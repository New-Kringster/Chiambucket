'use client';
import { useEffect, useRef } from 'react';

/*
  SunlitScene — the homepage background for the "sunlit" theme, painted like a
  pastel poster: a sage sky with soft pastel washes and brush strokes, the sun
  in the top-right corner with faint rays, drifting clouds, a lone umbrella
  pine on the hill at the left, and a field of grass along the bottom.

  The grass is not inside the scene. SunlitField renders it inside <main>,
  right after the About section, so it is drawn in front of that section
  (which rises out of it as you scroll) and behind everything after it.

  Each part is its own layer so it can move on the compositor alone: clouds
  drift, the rays shimmer, the sun's glow breathes, the tree and the field
  sway. All of it is painted once from a fixed seed (again only on resize) and
  animated by CSS transforms and opacity. Motion runs only while html.sl-alive
  is set, which this component does while the hero or the closing section is
  on screen, so the glass cards over the rest of the page are not re-blurred
  on every frame. Styles live in app/sunlit.css (.sl-*).
*/

type Ctx = CanvasRenderingContext2D;
type Rand = () => number;

// Small seeded PRNG (mulberry32) so the painting is the same on every visit.
function seeded(seed: number): Rand {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rand: Rand, a: number, b: number) => a + rand() * (b - a);
const pick = <T,>(rand: Rand, list: T[]) => list[Math.floor(rand() * list.length)];

function prepare(canvas: HTMLCanvasElement, w: number, h: number, dpr: number): Ctx {
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// An offscreen canvas drawn at a fraction of full size. Scaling it back up softens it.
function softLayer(w: number, h: number, scale: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(w * scale));
  canvas.height = Math.max(1, Math.ceil(h * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  return { canvas, ctx };
}

// The sun sits just past the top-right corner.
const sunAt = (w: number, h: number) => ({ x: w * 0.97, y: -h * 0.005 });

/* ---------------- Sky: haze, brush strokes, beams, grain ---------------- */

function puff(ctx: Ctx, x: number, y: number, r: number, rgb: string, alpha: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${alpha})`);
  g.addColorStop(0.5, `rgba(${rgb},${alpha * 0.5})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Wedge-shaped beam from the sun. It fades in after `gap` and out towards its end.
function beam(
  ctx: Ctx, sun: { x: number; y: number }, angle: number, length: number, gap: number,
  startWidth: number, endWidth: number, rgb: string, alpha: number,
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const ex = sun.x + dx * length;
  const ey = sun.y + dy * length;
  const g = ctx.createLinearGradient(sun.x, sun.y, ex, ey);
  const fadeIn = Math.min(0.6, gap / length);
  g.addColorStop(0, `rgba(${rgb},${gap ? 0 : alpha})`);
  g.addColorStop(fadeIn, `rgba(${rgb},${alpha})`);
  g.addColorStop(Math.min(0.95, fadeIn + 0.3), `rgba(${rgb},${alpha * 0.7})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(sun.x + nx * startWidth, sun.y + ny * startWidth);
  ctx.lineTo(ex + nx * endWidth, ey + ny * endWidth);
  ctx.lineTo(ex - nx * endWidth, ey - ny * endWidth);
  ctx.lineTo(sun.x - nx * startWidth, sun.y - ny * startWidth);
  ctx.closePath();
  ctx.fill();
}

// A long, soft brush stroke: thick in the middle, tapering to both ends.
function stroke(ctx: Ctx, x: number, y: number, len: number, thick: number, tilt: number, rgb: string, alpha: number) {
  const g = ctx.createLinearGradient(x, y, x + len, y);
  g.addColorStop(0, `rgba(${rgb},0)`);
  g.addColorStop(0.3, `rgba(${rgb},${alpha})`);
  g.addColorStop(0.7, `rgba(${rgb},${alpha})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.translate(-x, -y);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + len * 0.5, y - thick, x + len, y);
  ctx.quadraticCurveTo(x + len * 0.5, y + thick * 0.6, x, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// A fine, static grain tile: film texture, and it breaks up 8-bit banding.
function grainPattern(ctx: Ctx, rand: Rand) {
  const tile = document.createElement('canvas');
  tile.width = tile.height = 96;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const light = rand() < 0.5;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 255 : 40;
    img.data[i + 3] = Math.round(rand() * 10);
  }
  t.putImageData(img, 0, 0);
  return ctx.createPattern(tile, 'repeat')!;
}

function drawSky(canvas: HTMLCanvasElement, w: number, h: number, dpr: number) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(20261018);
  const sun = sunAt(w, h);
  const reach = Math.hypot(w, h);

  const { canvas: soft, ctx: s } = softLayer(w, h, 0.5);

  // Uneven light around the sun.
  for (let i = 0; i < 30; i++) {
    const a = between(rand, Math.PI * 0.5, Math.PI * 1.0);
    const d = Math.pow(rand(), 0.8) * reach * 0.45;
    puff(s, sun.x + Math.cos(a) * d, sun.y + Math.sin(a) * d, between(rand, 0.04, 0.1) * reach, '250,248,228', between(rand, 0.05, 0.12));
  }

  // Pastel brushwork, as if the sky were painted: long soft strokes, more of
  // them low in the sky where the light is warmest.
  const tints = ['247,226,196', '236,214,206', '214,224,230', '244,240,214', '226,232,206'];
  for (let i = 0; i < Math.round(14 + w / 90); i++) {
    const y = h * Math.pow(rand(), 0.7) * 0.74;
    const len = w * between(rand, 0.25, 0.75);
    const x = between(rand, -0.2, 1) * w - len * 0.3;
    stroke(s, x, y, len, h * between(rand, 0.02, 0.06), between(rand, -0.14, 0.1), pick(rand, tints), between(rand, 0.05, 0.12));
  }

  // Broad, faint beams.
  s.globalCompositeOperation = 'screen';
  for (let i = 0; i < 7; i++) {
    const angle = between(rand, Math.PI * 0.58, Math.PI * 0.97);
    beam(s, sun, angle, reach * between(rand, 0.5, 0.9), 0, reach * 0.003, reach * between(rand, 0.02, 0.05), '250,248,226', between(rand, 0.05, 0.1));
  }
  s.globalCompositeOperation = 'source-over';

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(soft, 0, 0, w, h);

  ctx.fillStyle = grainPattern(ctx, rand);
  ctx.fillRect(0, 0, w, h);
}

// Thin rays on their own layer, so they can shimmer: faint, uneven, and
// starting at different distances from the sun.
function drawRays(canvas: HTMLCanvasElement, w: number, h: number, dpr: number) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(7071);
  const sun = sunAt(w, h);
  const reach = Math.hypot(w, h);
  for (let i = 0; i < 17; i++) {
    const angle = between(rand, Math.PI * 0.57, Math.PI * 0.99);
    const length = reach * between(rand, 0.3, 0.8);
    const gap = length * between(rand, 0, 0.35);
    const width = between(rand, 0.6, 1.8);
    const alpha = between(rand, 0.06, 0.18);
    beam(ctx, sun, angle, length, gap, 0.4, width * 3.5, '252,250,232', alpha * 0.4);
    beam(ctx, sun, angle, length, gap, 0.2, width, '255,253,240', alpha);
  }
}

/* ---------------- Clouds ---------------- */

/* Where the clouds sit (centre x/y as a fraction of the screen, size as a
   fraction of the shorter side), how bright they are, and how they drift. */
const CLOUDS = [
  { x: 0.16, y: 0.15, w: 0.64, h: 0.11, k: 0.62, drift: 4, secs: 70 },
  { x: 0.75, y: 0.45, w: 0.42, h: 0.075, k: 0.5, drift: 6, secs: 92 },
  { x: 0.42, y: 0.32, w: 0.28, h: 0.05, k: 0.34, drift: 7, secs: 58 },
  { x: 0.5, y: 0.765, w: 0.95, h: 0.04, k: 0.34, drift: 2.5, secs: 120 },
];

/* One fair-weather cloud on its own canvas: round lobes with a flat base,
   shaded from a warm lit top to a sage underside. It is painted at a modest
   resolution and softened by a CSS blur, which stays smooth at any pixel
   density (the old version was upscaled from a few pixels and looked blocky
   on phones). */
function paintCloud(canvas: HTMLCanvasElement, cw: number, ch: number, rand: Rand) {
  const scale = 0.5;
  canvas.width = Math.max(2, Math.round(cw * scale));
  canvas.height = Math.max(2, Math.round(ch * scale));
  const c = canvas.getContext('2d')!;
  c.setTransform(scale, 0, 0, scale, 0, 0);
  const w = cw / 1.4;
  const h = ch / 2.6;
  const ox = cw / 2;
  const base = ch * 0.8;

  const lobes = Math.round(9 + (w / h) * 2.2);
  c.fillStyle = '#000';
  for (let i = 0; i < lobes; i++) {
    // Spaced along the width so none float off alone; largest in the middle for the dome.
    const u = -0.42 + (0.84 * (i + rand() * 0.8)) / lobes;
    const edge = 1 - Math.min(1, Math.abs(u) * 2);
    const r = h * (0.28 + 0.62 * edge) * between(rand, 0.75, 1.15);
    c.beginPath();
    c.arc(ox + u * w, base - r * between(rand, 0.35, 0.75) - edge * h * 0.25, r, 0, Math.PI * 2);
    c.fill();
  }
  c.clearRect(0, base + h * 0.15, cw, ch);

  c.globalCompositeOperation = 'source-in';
  const shade = c.createLinearGradient(0, base - h * 1.3, 0, base);
  shade.addColorStop(0, '#fcfbf1');
  shade.addColorStop(0.5, '#f0efdd');
  shade.addColorStop(0.85, '#d3d8bf');
  shade.addColorStop(1, '#bfc9ad');
  c.fillStyle = shade;
  c.fillRect(0, 0, cw, ch);

  // Brighter rims on the sun side, a little volume underneath.
  c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < lobes; i++) {
    puff(c, ox + between(rand, -0.2, 0.5) * w, base - h * between(rand, 0.6, 1.2), h * between(rand, 0.25, 0.5), '255,255,248', 0.5);
    puff(c, ox + between(rand, -0.45, 0.3) * w, base - h * between(rand, 0.05, 0.35), h * between(rand, 0.2, 0.4), '176,190,160', 0.28);
  }

  // Fade the underside out so it reads flat without a hard edge.
  c.globalCompositeOperation = 'destination-out';
  const under = c.createLinearGradient(0, base - h * 0.5, 0, base + h * 0.15);
  under.addColorStop(0, 'rgba(0,0,0,0)');
  under.addColorStop(0.6, 'rgba(0,0,0,0.45)');
  under.addColorStop(1, 'rgba(0,0,0,1)');
  c.fillStyle = under;
  c.fillRect(0, base - h * 0.5, cw, h * 0.65);
  c.globalCompositeOperation = 'source-over';
}

/* ---------------- Grass ---------------- */

// The top of the hill, as a fraction of the screen height (it is a little higher on the left).
const HILL = 0.795;

// Hill line: a little higher on the left, with slow rolls.
function ridgeAt(x: number, w: number, h: number) {
  const t = x / w;
  return h * (HILL + 0.03 * t)
    + Math.sin(t * 4.3 + 0.6) * h * 0.013
    + Math.sin(t * 11.7 + 2.1) * h * 0.006
    + Math.sin(t * 29.3 + 1.3) * h * 0.002;
}

function blade(
  ctx: Ctx, x: number, y: number, length: number, angle: number,
  width: number, bend: number, color: string, alpha: number,
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const tx = x + dx * length;
  const ty = y + dy * length;
  const mx = x + dx * length * 0.5 + nx * bend;
  const my = y + dy * length * 0.5 + ny * bend;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + nx * width, y + ny * width);
  ctx.quadraticCurveTo(mx + nx * width * 0.7, my + ny * width * 0.7, tx, ty);
  ctx.quadraticCurveTo(mx - nx * width * 0.7, my - ny * width * 0.7, x - nx * width, y - ny * width);
  ctx.closePath();
  ctx.fill();
}

const LIT = ['#dcc56d', '#d3bb63', '#c9b35c', '#e3d085', '#c0ab55'];
const MID = ['#b1a452', '#a4994b', '#988f46', '#b2ab66', '#8f8944', '#bcad5c'];
const LOW = ['#8c853c', '#807930', '#938d46', '#706824', '#a19a55', '#635a1a', '#878140'];
const CREST = ['#dcc66f', '#e3d085', '#cdb862', '#c2b05b', '#b6a755'];

/* The field is painted for a screen of height h onto a canvas that starts at
   FIELD_TOP (nothing is painted above it) and runs to `full`, below the bottom
   of the screen: that part is there for the end of the page, where the field
   rises to reach above the footer. */
const FIELD_TOP = 0.6;

function drawGrass(canvas: HTMLCanvasElement, w: number, h: number, full: number, dpr: number) {
  const origin = h * FIELD_TOP;
  const ctx = prepare(canvas, w, full - origin, dpr);
  ctx.clearRect(0, 0, w, full - origin);
  ctx.translate(0, -origin);
  const rand = seeded(1517);

  const top = h * (HILL - 0.005);
  const band = h - top;
  const k = Math.min(1.5, Math.max(0.85, band / 170));
  const ridge = (x: number) => ridgeAt(Math.min(w, Math.max(0, x)), w, h);

  // Base body of the hill, darkening towards the bottom of the screen and on below it.
  const body = ctx.createLinearGradient(0, top, 0, h);
  body.addColorStop(0, '#d2bc66');
  body.addColorStop(0.12, '#bfad58');
  body.addColorStop(0.32, '#9d9448');
  body.addColorStop(0.65, '#8a833b');
  body.addColorStop(1, '#736d29');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, full);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, ridgeAt(x, w, h) + 3);
  ctx.lineTo(w, full);
  ctx.closePath();
  ctx.fill();

  // Broad, soft brushwork underneath: pale sweeps and deep shadow sweeps.
  const { canvas: soft, ctx: s } = softLayer(w, full, 0.25);
  for (let i = 0; i < Math.round((w / 14) * ((full - top) / band) * 0.6); i++) {
    const x = between(rand, -60, w);
    const r = ridge(x);
    const depth = rand();
    const y = r + 10 + depth * (full - r);
    const dark = depth > 0.25 && rand() < 0.6;
    blade(s, x, y, between(rand, 0.4, 1.1) * band, between(rand, -0.5, -0.18), between(rand, 8, 22) * k, between(rand, -10, 10),
      dark ? '#5d5517' : pick(rand, ['#c7b763', '#b4ab62', '#d6c374']), dark ? between(rand, 0.12, 0.28) : between(rand, 0.1, 0.25));
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(soft, 0, 0, w, full);

  // Short tufts along the crest so the hilltop is ragged rather than a clean line.
  for (let i = 0; i < Math.round(w / 1.6); i++) {
    const x = between(rand, -10, w + 10);
    blade(ctx, x, ridge(x) + between(rand, 4, 12), between(rand, 0.03, 0.1) * band, between(rand, -1.6, -0.75),
      between(rand, 1.2, 3.2) * k, between(rand, -3, 3), pick(rand, ['#d2bc66', '#c9b45e', '#dcc66f', '#bfad58']), between(rand, 0.7, 1));
  }

  // The main field of strokes, painted back to front. Depth is measured down
  // the visible band, so the part below the screen is all deep, darker grass.
  const strokes: { x: number; y: number; depth: number }[] = [];
  const reach = (full - top) / band;
  const count = Math.round((w * band) / 55);
  const below = Math.round(count * (reach - 1) * 0.55);
  for (let i = 0; i < count + below; i++) {
    const x = between(rand, -60, w + 10);
    const r = ridge(x);
    const depth = i < count ? Math.pow(rand(), 0.85) : between(rand, 1, reach);
    strokes.push({ x, y: r + 4 + depth * (h - r + 30), depth });
  }
  strokes.sort((a, b) => a.y - b.y);
  for (const st of strokes) {
    const t = st.depth + between(rand, -0.1, 0.1);
    const palette = t < 0.15 ? LIT : t < 0.4 ? MID : LOW;
    const lift = st.depth < 0.18 ? 0.3 : 0; // blades on the crest stand more upright
    blade(ctx, st.x, st.y, between(rand, 0.14, 0.5) * band * (st.depth < 0.15 ? 0.75 : 1), between(rand, -0.85, -0.25) - lift,
      between(rand, 0.8, 3) * k, between(rand, -8, 8) * k, pick(rand, palette), between(rand, 0.3, 0.75));
  }

  // A few pale highlights catching the light, mostly near the crest.
  for (let i = 0; i < Math.round(w / 4); i++) {
    const x = rand() * w;
    const r = ridgeAt(x, w, h);
    const depth = Math.pow(rand(), 2);
    blade(ctx, x, r + depth * (h - r), between(rand, 0.1, 0.32) * band, between(rand, -1.05, -0.4),
      between(rand, 0.4, 1) * k, between(rand, -5, 5), pick(rand, ['#ecdd9c', '#e3d189', '#d8ca85']), between(rand, 0.25, 0.6));
  }

  // Clumps of taller blades break up the crest.
  const clumps = Math.max(4, Math.round(w / 130));
  for (let c = 0; c < clumps; c++) {
    const cx = between(rand, 0, w);
    const tall = between(rand, 0.12, 0.3) * band;
    for (let i = 0; i < 18; i++) {
      const x = cx + between(rand, -1, 1) * tall * 0.35;
      blade(ctx, x, ridge(x) + between(rand, 4, band * 0.07), tall * between(rand, 0.45, 1), between(rand, -1.65, -0.8),
        between(rand, 0.5, 1.4) * k, between(rand, -6, 6), pick(rand, [...CREST, '#a99c4f']), between(rand, 0.55, 0.95));
    }
  }

  // Stray blades standing against the sky along the crest.
  for (let i = 0; i < Math.round(w / 4); i++) {
    const x = rand() * w;
    blade(ctx, x, ridgeAt(x, w, h) + between(rand, 2, band * 0.06), between(rand, 0.04, 0.2) * band, between(rand, -1.75, -0.9),
      between(rand, 0.3, 0.9) * k, between(rand, -5, 5), pick(rand, CREST), between(rand, 0.45, 0.9));
  }

  ctx.globalAlpha = 1;

  // Darken the very bottom slightly so the field sits on the edge of the screen,
  // and keep darkening below it.
  const foot = ctx.createLinearGradient(0, h - band * 0.45, 0, full);
  foot.addColorStop(0, 'rgba(70,64,18,0)');
  foot.addColorStop(Math.min(0.9, (band * 0.45) / (full - h + band * 0.45)), 'rgba(70,64,18,0.26)');
  foot.addColorStop(1, 'rgba(62,58,16,0.4)');
  ctx.fillStyle = foot;
  ctx.fillRect(0, h - band * 0.45, w, full - h + band * 0.45);
}

/* ---------------- The tree ---------------- */

/* A painted Italian stone pine (public/images/sunlit/stone-pine.webp) on the
   hill at the left. It is drawn in two parts: the crown at one scale, sized to
   fit between the nav and the name, and the bare trunk under it stretched down
   into the grass. So on any screen the crown stays above the name and the
   trunk to the left of it. */
const TREE = {
  src: '/images/sunlit/stone-pine.webp',
  crownTop: 127 / 1536, // first row of needles in the painting
  split: 740 / 1536, // below this row the trunk is bare
  trunkX: 236 / 1024, // the trunk's centre, across the painting
};

type NameBox = { left: number; top: number };

function drawTree(canvas: HTMLCanvasElement, w: number, h: number, dpr: number, img: HTMLImageElement, name: NameBox) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const portrait = w < h * 0.9;
  const crownBottom = name.top - h * 0.012;
  const below = 66; // the nav pills
  const s = Math.max(0.05, Math.min(
    (crownBottom - below) / ((TREE.split - TREE.crownTop) * ih),
    ((portrait ? 0.82 : 0.38) * w) / iw,
  ));
  const trunkX = Math.max(6, name.left - Math.max(18, w * 0.045));
  const left = trunkX - TREE.trunkX * iw * s;
  const splitY = TREE.split * ih;
  const ground = ridgeAt(Math.max(0, trunkX), w, h) + h * 0.06;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, iw, splitY, left, crownBottom - splitY * s, iw * s, splitY * s);
  ctx.drawImage(img, 0, splitY, iw, ih - splitY, left, crownBottom, iw * s, Math.max(1, ground - crownBottom));

  // A little of the sky's colour over it, so it sits in the same air, then the grain.
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = 'rgba(176, 194, 162, 0.12)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = grainPattern(ctx, seeded(3301));
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

// Where the name sits, from layout offsets so its load animation (a scale) does not skew it.
function nameBox(w: number, h: number): NameBox {
  const words = Array.from(document.querySelectorAll<HTMLElement>('.slp-word'));
  if (!words.length) return { left: w * 0.08, top: h * 0.35 };
  const at = (el: HTMLElement) => {
    let x = 0;
    let y = 0;
    for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) { x += e.offsetLeft; y += e.offsetTop; }
    return { x, y };
  };
  const spots = words.map(at);
  const size = parseFloat(getComputedStyle(words[0]).fontSize) || 100;
  // the cap height starts a little below the top of the line
  return { left: Math.min(...spots.map((p) => p.x)), top: Math.min(...spots.map((p) => p.y)) + size * 0.18 };
}

/* ---------------- Birds ---------------- */

/* Now and then a few tiny birds cross the sky far away, flapping and gliding. */
type Bird = { svg: SVGSVGElement; path: SVGPathElement; ox: number; oy: number; flap: number; rate: number; glideAt: number };
const SVG_NS = 'http://www.w3.org/2000/svg';

function makeBird(): Bird {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 10');
  svg.setAttribute('class', 'sl-bird');
  const path = document.createElementNS(SVG_NS, 'path');
  svg.appendChild(path);
  return { svg, path, ox: 0, oy: 0, flap: Math.random() * 6, rate: 9 + Math.random() * 3, glideAt: 0 };
}

// Wings from a tip height: 1 is fully up, -0.4 a little below the body.
const wings = (lift: number) => {
  const y = (5 - lift * 4.2).toFixed(2);
  return `M1 ${y} Q5.5 ${(5 - lift * 2.2).toFixed(2)} 10 5.6 Q14.5 ${(5 - lift * 2.2).toFixed(2)} 19 ${y}`;
};


/** The grass. Render it inside <main>, after the section that should rise out of it. */
export function SunlitField() {
  return (
    <div className="sl-grass" aria-hidden="true">
      <canvas className="sl-grass-canvas" />
    </div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function SunlitScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<HTMLCanvasElement>(null);
  const cloudRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    const sky = skyRef.current;
    const rays = raysRef.current;
    const tree = treeRef.current;
    // SunlitField renders in the same commit, so its canvases are already in the page.
    const field = document.querySelector<HTMLElement>('.sl-grass');
    const grass = document.querySelector<HTMLCanvasElement>('.sl-grass .sl-grass-canvas');
    const flock = scene?.querySelector<HTMLElement>('.sl-birds');
    if (!scene || !sky || !rays || !tree || !field || !grass || !flock) return;
    const treeLayer = tree.parentElement as HTMLElement;
    const treeImg = new Image();
    treeImg.decoding = 'async';
    treeImg.src = TREE.src;

    let drawnW = 0;
    let drawnH = 0;
    const draw = () => {
      const rect = scene.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (!w || !h || (w === drawnW && h === drawnH)) return;
      drawnW = w;
      drawnH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      drawSky(sky, w, h, dpr);
      drawRays(rays, w, h, dpr);
      if (treeImg.complete) drawTree(tree, w, h, dpr, treeImg, nameBox(w, h));
      drawGrass(grass, w, h, Math.max(h, Math.round(field.getBoundingClientRect().height)), dpr);

      const unit = Math.min(w, h * 1.15);
      const rand = seeded(5150);
      CLOUDS.forEach((c, i) => {
        const el = cloudRefs.current[i];
        if (!el) return;
        const cw = c.w * unit * 1.4;
        const ch = c.h * unit * 2.6;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.left = `${c.x * w - cw / 2}px`;
        el.style.top = `${c.y * h - ch * 0.8}px`;
        el.style.opacity = String(c.k);
        el.style.filter = `blur(${Math.max(2, c.h * unit * 0.07).toFixed(1)}px)`;
        paintCloud(el, cw, ch, rand);
      });
      scene.classList.add('is-drawn');
      field.classList.add('is-drawn');
    };
    draw();
    // The painting may arrive after the first draw, and the name moves a little once its font loads.
    const redrawTree = () => {
      if (!drawnW || !treeImg.complete) return;
      drawTree(tree, drawnW, drawnH, Math.min(window.devicePixelRatio || 1, 2), treeImg, nameBox(drawnW, drawnH));
    };
    treeImg.addEventListener('load', redrawTree);
    document.fonts?.ready.then(redrawTree);

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, 160);
    };
    window.addEventListener('resize', onResize);

    /* Scrolling, written at most once a frame:
       - The About section rises out of the grass. Each .sl-emerge block is
         soft and faint while it is still near the crest and comes into focus
         as it clears it.
       - Then the field and the tree sink a little and dissolve into the haze,
         so the middle of the page sits in open sky.
       - Near the end they come back for the closing section, and the field
         rises until its crest is above the footer, so the footer stands in
         the grass on any screen. */
    const root = document.documentElement;
    const footer = document.querySelector<HTMLElement>('.footer');
    const rising = Array.from(document.querySelectorAll<HTMLElement>('#about .sl-emerge'));
    const shifted = new Map<HTMLElement, number>(); // the translate we last gave each block, in px
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const settle = (el: HTMLElement) => {
      if (!shifted.has(el)) return;
      shifted.delete(el);
      el.style.filter = '';
      el.style.opacity = '';
      el.style.translate = '';
    };

    const place = () => {
      frame = 0;
      // With reduced motion nothing moves: the field and the tree only fade,
      // the field appears already raised at the end, and nothing blurs.
      const calm = still.matches;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const end = root.scrollHeight - vh;
      const crest = vh * HILL;

      // The field stays solid while the section's heading comes up out of it,
      // then drops away quickly; the tree leaves with it.
      const back = clamp01((y - (end - vh * 1.1)) / (vh * 0.9));
      const fade = (from: number, over: number) => {
        const t = Math.max(0, clamp01((y - vh * from) / (vh * over)) - back);
        return t * t * (3 - 2 * t);
      };
      const gone = fade(0.42, 0.3);
      const treeGone = fade(0.3, 0.38);
      const reach = footer ? Math.max(0, crest - (vh - footer.offsetHeight - 28)) : 0;
      const lift = calm ? (back > 0 ? reach : 0) : reach * back;
      field.style.opacity = gone >= 1 ? '0' : (1 - gone).toFixed(3);
      field.style.translate = `0 ${((calm ? 0 : gone * vh * 0.18) - lift).toFixed(1)}px`;
      treeLayer.style.opacity = treeGone >= 1 ? '0' : (1 - treeGone).toFixed(3);
      treeLayer.style.translate = calm ? '' : `0 ${(treeGone * vh * 0.04).toFixed(1)}px`;

      if (calm) { rising.forEach(settle); return; }
      const present = 1 - gone;
      for (const el of rising) {
        const top = el.getBoundingClientRect().top - (shifted.get(el) ?? 0);
        if (top > vh * 1.2 || top < -vh) { settle(el); continue; }
        const soft = (1 - clamp01((crest - top) / (vh * 0.3))) * present;
        if (soft < 0.01) { settle(el); continue; }
        const drop = soft * 28;
        shifted.set(el, drop);
        el.style.filter = `blur(${(soft * 12).toFixed(2)}px)`;
        el.style.opacity = (1 - soft * 0.6).toFixed(3);
        el.style.translate = `0 ${drop.toFixed(1)}px`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    place();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    still.addEventListener('change', onScroll);

    /* The birds: an animation loop that runs only while the hero or the
       closing section is on screen, the tab is visible and motion is allowed. */
    const birds = [makeBird(), makeBird(), makeBird(), makeBird()];
    birds.forEach((b) => flock.appendChild(b.svg));

    let flight: { dir: 1 | -1; alt: number; start: number; secs: number; count: number } | null = null;
    let nextFlight = performance.now() + 5000;
    let loop = 0;

    const stepBirds = (now: number) => {
      if (!flight && now >= nextFlight) {
        const count = 2 + Math.floor(Math.random() * 3);
        flight = { dir: Math.random() < 0.5 ? 1 : -1, alt: between(Math.random, 0.1, 0.34), start: now, secs: between(Math.random, 26, 36), count };
        birds.forEach((b, i) => {
          b.ox = i === 0 ? 0 : between(Math.random, 14, 38) * Math.ceil(i / 2) * (i % 2 ? 1 : 0.85);
          b.oy = i === 0 ? 0 : (i % 2 ? -1 : 1) * between(Math.random, 5, 12) * Math.ceil(i / 2);
          b.svg.style.visibility = i < count ? 'visible' : 'hidden';
        });
      }
      if (!flight) return;
      const w = drawnW;
      const h = drawnH;
      const p = (now - flight.start) / (flight.secs * 1000);
      if (p > 1) { flight = null; birds.forEach((b) => { b.svg.style.visibility = 'hidden'; }); nextFlight = now + between(Math.random, 9000, 20000); return; }
      const lead = flight.dir > 0 ? -40 + (w + 120) * p : w + 40 - (w + 120) * p;
      const size = Math.max(7, Math.min(11, w / 150));
      birds.forEach((b, i) => {
        if (i >= flight!.count) return;
        b.flap += 0.016 * b.rate;
        // flap for a while, then glide with wings held a little up
        const gliding = ((now / 1000 + i * 1.7) % 7) > 5;
        const lift = gliding ? 0.25 : Math.sin(b.flap);
        b.path.setAttribute('d', wings(lift));
        const x = lead - flight!.dir * b.ox;
        const y = flight!.alt * h + b.oy + Math.sin(p * Math.PI * 3 + i) * 7;
        b.svg.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(size / 20).toFixed(3)})`;
      });
    };

    const tick = (now: number) => {
      loop = 0;
      stepBirds(now);
      loop = requestAnimationFrame(tick);
    };
    const showing = new Set<Element>();
    const setMotion = () => {
      const on = showing.size > 0 && !document.hidden && !still.matches;
      root.classList.toggle('sl-alive', showing.size > 0);
      if (on && !loop) loop = requestAnimationFrame(tick);
      if (!on && loop) { cancelAnimationFrame(loop); loop = 0; }
    };

    // Motion runs only while the poster hero or the closing section is in view.
    const watched = ['.slp', '.hp-cta'].map((q) => document.querySelector(q)).filter(Boolean) as Element[];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) showing.add(e.target);
        else showing.delete(e.target);
      }
      setMotion();
    });
    watched.forEach((el) => io.observe(el));
    document.addEventListener('visibilitychange', setMotion);
    still.addEventListener('change', setMotion);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      still.removeEventListener('change', onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(loop);
      io.disconnect();
      document.removeEventListener('visibilitychange', setMotion);
      still.removeEventListener('change', setMotion);
      treeImg.removeEventListener('load', redrawTree);
      birds.forEach((b) => b.svg.remove());
      rising.forEach(settle);
      root.classList.remove('sl-alive');
    };
  }, []);

  return (
    <div className="sl-scene" ref={sceneRef} aria-hidden="true">
      <div className="sl-sky" />
      <div className="sl-wash" />
      <canvas className="sl-sky-canvas" ref={skyRef} />
      <div className="sl-clouds">
        {CLOUDS.map((c, i) => (
          <canvas
            key={i}
            className="sl-cloud"
            ref={(el) => { cloudRefs.current[i] = el; }}
            style={{ '--drift': `${c.drift}vw`, '--secs': `${c.secs}s`, '--delay': `${-c.secs * (i * 0.37 % 1)}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="sl-birds" />
      <div className="sl-tree">
        <canvas className="sl-tree-canvas" ref={treeRef} />
      </div>
      <canvas className="sl-rays" ref={raysRef} />
      <div className="sl-sun-bloom" />
    </div>
  );
}
