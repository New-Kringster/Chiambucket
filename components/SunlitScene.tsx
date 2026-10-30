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

/* The field is painted for a screen of height h, on a canvas `full` tall: the
   part below the screen is there for the end of the page, where the field
   rises to reach above the footer. */
function drawGrass(canvas: HTMLCanvasElement, w: number, h: number, full: number, dpr: number) {
  const ctx = prepare(canvas, w, full, dpr);
  ctx.clearRect(0, 0, w, full);
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
    blade(ctx, x, r + Math.pow(rand(), 2) * (h - r), between(rand, 0.1, 0.32) * band, between(rand, -1.05, -0.4),
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

/* A lone umbrella pine on the hill at the left: a tall, bare, slightly bent
   trunk, a few limbs fanning out under a broad, flat crown. The crown is a
   stack of foliage pads painted like the clouds, back to front, each lit on
   top from the sun in the top-right corner and dark underneath. The crown
   sits above the name and the trunk to the left of it, so the name never has
   foliage behind it. */

function limb(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number, bend: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (x0 + x1) / 2 + nx * bend;
  const my = (y0 + y1) / 2 + ny * bend;
  const wm = (w0 + w1) / 2;
  ctx.beginPath();
  ctx.moveTo(x0 + nx * w0, y0 + ny * w0);
  ctx.quadraticCurveTo(mx + nx * wm, my + ny * wm, x1 + nx * w1, y1 + ny * w1);
  ctx.lineTo(x1 - nx * w1, y1 - ny * w1);
  ctx.quadraticCurveTo(mx - nx * wm, my - ny * wm, x0 - nx * w0, y0 - ny * w0);
  ctx.closePath();
  ctx.fill();
}

// One foliage pad on its own small canvas: lobes with a flat underside, lit
// on top towards the sun, short needle strokes for texture.
function foliagePad(rw: number, rh: number, lit: number, rand: Rand) {
  const pad = Math.ceil(rh * 0.5);
  const cw = Math.ceil(rw * 2 + pad * 2);
  const ch = Math.ceil(rh * 2 + pad);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const c = canvas.getContext('2d')!;
  const ox = cw / 2;
  const base = ch - pad * 0.6;

  // Silhouette: a dome of lobes, lowest at the ends.
  c.fillStyle = '#000';
  const lobes = 11;
  for (let i = 0; i < lobes; i++) {
    const u = -0.92 + (1.84 * (i + rand() * 0.7)) / lobes;
    const middle = 1 - Math.min(1, Math.abs(u));
    const r = rh * (0.42 + 0.48 * Math.sqrt(middle)) * between(rand, 0.85, 1.12);
    c.beginPath();
    c.arc(ox + u * rw, base - r * between(rand, 0.75, 1.05), r, 0, Math.PI * 2);
    c.fill();
  }
  // A soft, slightly uneven underside rather than a cut line.
  c.globalCompositeOperation = 'destination-out';
  const under = c.createLinearGradient(0, base - rh * 0.22, 0, base + rh * 0.1);
  under.addColorStop(0, 'rgba(0,0,0,0)');
  under.addColorStop(0.55, 'rgba(0,0,0,0.5)');
  under.addColorStop(1, 'rgba(0,0,0,1)');
  c.fillStyle = under;
  c.fillRect(0, base - rh * 0.22, cw, ch);
  c.globalCompositeOperation = 'source-over';

  // Light from above and to the right; the underside sinks into shade.
  c.globalCompositeOperation = 'source-in';
  const tone = c.createLinearGradient(ox + rw * 0.35, base - rh * 2, ox - rw * 0.2, base);
  tone.addColorStop(0, lit > 0.5 ? '#a9b67e' : '#8d9d6b');
  tone.addColorStop(0.42, '#6d8056');
  tone.addColorStop(0.8, '#4f6243');
  tone.addColorStop(1, '#3c4c34');
  c.fillStyle = tone;
  c.fillRect(0, 0, cw, ch);

  // Needle strokes: lighter and upright near the lit top, darker below.
  c.globalCompositeOperation = 'source-atop';
  const strokes = Math.round((rw * rh) / 5);
  for (let i = 0; i < strokes; i++) {
    const x = ox + between(rand, -1, 1) * rw;
    const y = base - Math.pow(rand(), 0.8) * rh * 2;
    const height = (base - y) / (rh * 2);
    const sunSide = (x - ox) / rw;
    const v = height * 0.75 + sunSide * 0.15 + between(rand, -0.15, 0.15);
    const color = v > 0.72 ? pick(rand, ['#c3c992', '#b5bf86', '#cdd09c'])
      : v > 0.48 ? pick(rand, ['#8fa06c', '#98a873', '#839565'])
      : v > 0.25 ? pick(rand, ['#677a52', '#5f724c', '#71835a'])
      : pick(rand, ['#435437', '#4b5d3e', '#3e4e34']);
    blade(c, x, y, between(rand, 3, 7), between(rand, -2.2, -0.9), between(rand, 0.7, 1.5), between(rand, -1.2, 1.2), color, between(rand, 0.25, 0.55));
  }
  c.globalAlpha = 1;
  // A bright rim along the top where the sun catches it.
  puff(c, ox + rw * 0.3, base - rh * 1.75, rh * 0.9, '232,230,180', lit * 0.35);
  c.globalCompositeOperation = 'source-over';

  // Ragged needle tips poking out of the top edge.
  for (let i = 0; i < Math.round(rw / 2.2); i++) {
    const u = between(rand, -0.85, 0.85);
    const middle = 1 - Math.abs(u);
    const x = ox + u * rw;
    const y = base - rh * (0.55 + 1.25 * Math.sqrt(middle)) * between(rand, 0.86, 1);
    blade(c, x, y + 2, between(rand, 2.5, 5.5), between(rand, -2.4, -0.7), between(rand, 0.5, 1), 0,
      u > 0 ? '#9fae78' : '#7d8f62', between(rand, 0.35, 0.7));
  }
  c.globalAlpha = 1;
  return { canvas, ox, base };
}

function drawTree(canvas: HTMLCanvasElement, w: number, h: number, dpr: number) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(3301);
  const portrait = w < h * 0.9;

  // The crown: centre and half-width/half-height, kept above and left of the name.
  // (below the nav: its top stays clear of the logo)
  const rx = portrait ? Math.min(w * 0.42, h * 0.2) : Math.min(w * 0.19, h * 0.33);
  const ry = rx * 0.3;
  const cx = portrait ? w * 0.12 : w * 0.075;
  const cy = portrait ? h * 0.16 : h * 0.205;
  const baseX = portrait ? w * 0.022 : w * 0.032;
  const baseY = ridgeAt(baseX, w, h) + h * 0.06;
  const forkX = portrait ? w * 0.045 : baseX + rx * 0.12;
  const forkY = cy + ry * 1.25;
  const girth = Math.max(4, rx * (portrait ? 0.05 : 0.065));

  // Trunk, bent a little, lit on the side facing the sun.
  const bark = ctx.createLinearGradient(forkX - girth * 1.4, 0, forkX + girth * 1.2, 0);
  bark.addColorStop(0, '#3d3a2b');
  bark.addColorStop(0.5, '#575140');
  bark.addColorStop(1, '#8e8566');
  ctx.fillStyle = bark;
  limb(ctx, baseX, baseY, forkX, forkY, girth, girth * 0.72, -rx * 0.05);
  // Bark: a few long dark strokes down the shaded side.
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#2f2c20';
  for (let i = 0; i < 5; i++) {
    const t0 = between(rand, 0.05, 0.7);
    const x0 = baseX + (forkX - baseX) * t0 - girth * between(rand, 0.1, 0.6);
    const y0 = baseY + (forkY - baseY) * t0;
    limb(ctx, x0, y0, x0 + (forkX - baseX) * 0.12, y0 + (forkY - baseY) * between(rand, 0.08, 0.2), girth * 0.09, girth * 0.03, 0);
  }
  ctx.globalAlpha = 1;

  // Limbs fanning up and out from the fork into the underside of the crown.
  const limbShade = ctx.createLinearGradient(0, forkY, 0, cy);
  limbShade.addColorStop(0, '#4c4736');
  limbShade.addColorStop(1, '#3a3a2a');
  ctx.fillStyle = limbShade;
  const reach = [-0.75, -0.35, 0.05, 0.42, 0.8];
  for (const u of reach) {
    const tx = cx + u * rx * 0.85;
    const ty = cy + ry * (0.35 + 0.25 * Math.abs(u));
    limb(ctx, forkX, forkY, tx, ty, girth * 0.48, girth * 0.14, (u > 0 ? -1 : 1) * rx * 0.08);
    // and a twig or two from each
    for (let j = 0; j < 2; j++) {
      const ex = tx + between(rand, -0.16, 0.16) * rx;
      limb(ctx, tx, ty, ex, ty - ry * between(rand, 0.2, 0.45), girth * 0.14, girth * 0.05, between(rand, -3, 3));
    }
  }

  // Crown pads, back to front: the high middle ones first, the low outer ones last.
  type Pad = { x: number; y: number; rw: number; rh: number; lit: number };
  const pads: Pad[] = [];
  const back = 5;
  for (let i = 0; i < back; i++) {
    const u = -0.62 + (1.24 * i) / (back - 1) + between(rand, -0.05, 0.05);
    const middle = 1 - Math.abs(u);
    pads.push({ x: cx + u * rx, y: cy - ry * (0.1 + middle * 0.45), rw: rx * between(rand, 0.3, 0.38), rh: ry * (0.55 + middle * 0.35), lit: 0.6 + u * 0.4 });
  }
  const front = 6;
  for (let i = 0; i < front; i++) {
    const u = -0.85 + (1.7 * i) / (front - 1) + between(rand, -0.05, 0.05);
    pads.push({ x: cx + u * rx, y: cy + ry * between(rand, 0.25, 0.5), rw: rx * between(rand, 0.2, 0.28), rh: ry * between(rand, 0.45, 0.6), lit: 0.35 + u * 0.35 });
  }
  const scale = 0.6; // painted smaller, then scaled up: soft edges like the clouds
  for (const p of pads) {
    const { canvas: padCanvas, ox, base } = foliagePad(p.rw * scale, p.rh * scale, p.lit, rand);
    ctx.drawImage(padCanvas, p.x - ox / scale, p.y + p.rh * 0.6 - base / scale, padCanvas.width / scale, padCanvas.height / scale);
  }

  // Air between us and the tree: a little of the sky's colour over all of it, then the grain.
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = 'rgba(172, 190, 158, 0.14)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = grainPattern(ctx, rand);
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}


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
    // SunlitField renders in the same commit, so its canvas is already in the page.
    const grass = document.querySelector<HTMLCanvasElement>('.sl-grass-canvas');
    if (!scene || !sky || !rays || !tree || !grass) return;
    const field = grass.parentElement as HTMLElement;
    const treeLayer = tree.parentElement as HTMLElement;

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
      drawTree(tree, w, h, dpr);
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

      // The field stays solid until the first block has come up out of it; the
      // tree leaves a little sooner, before the section's heading reaches it.
      const back = clamp01((y - (end - vh * 1.1)) / (vh * 0.9));
      const fade = (from: number, over: number) => {
        const t = Math.max(0, clamp01((y - vh * from) / (vh * over)) - back);
        return t * t * (3 - 2 * t);
      };
      const gone = fade(0.75, 0.6);
      const treeGone = fade(0.3, 0.65);
      const reach = footer ? Math.max(0, crest - (vh - footer.offsetHeight - 28)) : 0;
      const lift = calm ? (back > 0 ? reach : 0) : reach * back;
      field.style.opacity = gone >= 1 ? '0' : (1 - gone).toFixed(3);
      field.style.translate = `0 ${((calm ? 0 : gone * vh * 0.12) - lift).toFixed(1)}px`;
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

    // Motion runs only while the poster hero or the closing section is in view.
    const watched = ['.slp', '.hp-cta'].map((q) => document.querySelector(q)).filter(Boolean) as Element[];
    const showing = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) showing.add(e.target);
        else showing.delete(e.target);
      }
      root.classList.toggle('sl-alive', showing.size > 0);
    });
    watched.forEach((el) => io.observe(el));

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      still.removeEventListener('change', onScroll);
      cancelAnimationFrame(frame);
      io.disconnect();
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
      <div className="sl-tree">
        <canvas className="sl-tree-canvas" ref={treeRef} />
      </div>
      <canvas className="sl-rays" ref={raysRef} />
      <div className="sl-sun-bloom" />
    </div>
  );
}
