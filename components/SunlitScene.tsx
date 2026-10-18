'use client';
import { useEffect, useRef } from 'react';

/*
  SunlitScene — the homepage background for the "sunlit" theme: a sage sky with
  the sun in the top-right corner, faint rays, a few soft clouds and a field of
  painted grass along the bottom of the screen. The sky gradient and sun glow are
  CSS; clouds, rays and grass are painted once onto two canvases from a fixed
  seed (and again only when the viewport size changes), so nothing runs while
  the page is idle or scrolling. Styles live in app/sunlit.css (.sl-*).
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

/* ---------------- Sky: haze, clouds, beams, rays, grain ---------------- */

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

// One fair-weather cloud: round lobes with a flat base, shaded from a warm lit
// top to a sage underside, then softened by rendering it small.
function cloud(target: Ctx, rand: Rand, cx: number, cy: number, w: number, h: number, strength: number) {
  const W = w * 1.4;
  const H = h * 2.6;
  const { canvas, ctx: c } = softLayer(W, H, 0.07);
  const ox = W / 2;
  const base = H * 0.8;

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
  c.clearRect(0, base + h * 0.15, W, H);

  c.globalCompositeOperation = 'source-in';
  const shade = c.createLinearGradient(0, base - h * 1.3, 0, base);
  shade.addColorStop(0, '#fbfaef');
  shade.addColorStop(0.5, '#eeeedb');
  shade.addColorStop(0.85, '#cdd4ba');
  shade.addColorStop(1, '#b9c5a9');
  c.fillStyle = shade;
  c.fillRect(0, 0, W, H);

  // Brighter rims on the sun side, a little volume underneath.
  c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < lobes; i++) {
    puff(c, ox + between(rand, -0.2, 0.5) * w, base - h * between(rand, 0.6, 1.2), h * between(rand, 0.25, 0.5), '255,255,248', 0.5);
    puff(c, ox + between(rand, -0.45, 0.3) * w, base - h * between(rand, 0.05, 0.35), h * between(rand, 0.2, 0.4), '170,186,154', 0.3);
  }

  // Fade the underside out so it reads flat without a hard edge.
  c.globalCompositeOperation = 'destination-out';
  const under = c.createLinearGradient(0, base - h * 0.5, 0, base + h * 0.15);
  under.addColorStop(0, 'rgba(0,0,0,0)');
  under.addColorStop(0.6, 'rgba(0,0,0,0.45)');
  under.addColorStop(1, 'rgba(0,0,0,1)');
  c.fillStyle = under;
  c.fillRect(0, base - h * 0.5, W, h * 0.65);

  target.globalAlpha = strength;
  target.drawImage(canvas, cx - ox, cy - base, W, H);
  target.globalAlpha = 1;
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

// A fine, static grain tile. It breaks up 8-bit banding in the soft gradients.
function grainPattern(ctx: Ctx, rand: Rand) {
  const tile = document.createElement('canvas');
  tile.width = tile.height = 96;
  const t = tile.getContext('2d')!;
  const img = t.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const light = rand() < 0.5;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 255 : 40;
    img.data[i + 3] = Math.round(rand() * 6);
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
  const unit = Math.min(w, h * 1.15);

  const { canvas: soft, ctx: s } = softLayer(w, h, 0.5);

  // Uneven light around the sun.
  for (let i = 0; i < 30; i++) {
    const a = between(rand, Math.PI * 0.5, Math.PI * 1.0);
    const d = Math.pow(rand(), 0.8) * reach * 0.45;
    puff(s, sun.x + Math.cos(a) * d, sun.y + Math.sin(a) * d, between(rand, 0.04, 0.1) * reach, '250,248,228', between(rand, 0.05, 0.12));
  }

  // A bank top left, one drifting mid right, and a long flat one on the horizon.
  const clouds = [
    { x: 0.16, y: 0.15, w: 0.64, h: 0.11, k: 0.6 },
    { x: 0.75, y: 0.45, w: 0.42, h: 0.075, k: 0.48 },
    { x: 0.5, y: 0.715, w: 0.95, h: 0.04, k: 0.32 },
  ];
  for (const c of clouds) cloud(s, rand, c.x * w, c.y * h, c.w * unit, c.h * unit, c.k);

  // Broad, faint beams that pass over the clouds.
  s.globalCompositeOperation = 'screen';
  for (let i = 0; i < 7; i++) {
    const angle = between(rand, Math.PI * 0.58, Math.PI * 0.97);
    beam(s, sun, angle, reach * between(rand, 0.5, 0.9), 0, reach * 0.003, reach * between(rand, 0.02, 0.05), '250,248,226', between(rand, 0.05, 0.1));
  }
  s.globalCompositeOperation = 'source-over';

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(soft, 0, 0, w, h);

  // Thin rays: faint, uneven, starting at different distances from the sun.
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 17; i++) {
    const angle = between(rand, Math.PI * 0.57, Math.PI * 0.99);
    const length = reach * between(rand, 0.3, 0.8);
    const gap = length * between(rand, 0, 0.35);
    const width = between(rand, 0.6, 1.8);
    const alpha = between(rand, 0.06, 0.18);
    beam(ctx, sun, angle, length, gap, 0.4, width * 3.5, '252,250,232', alpha * 0.4);
    beam(ctx, sun, angle, length, gap, 0.2, width, '255,253,240', alpha);
  }
  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle = grainPattern(ctx, rand);
  ctx.fillRect(0, 0, w, h);
}

/* ---------------- Grass ---------------- */

// Hill line: a little higher on the left, with slow rolls.
function ridgeAt(x: number, w: number, h: number) {
  const t = x / w;
  return h * (0.745 + 0.035 * t)
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

function drawGrass(canvas: HTMLCanvasElement, w: number, h: number, dpr: number) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(1517);

  const top = h * 0.74;
  const band = h - top;
  const k = Math.min(1.5, Math.max(0.85, band / 190));
  const ridge = (x: number) => ridgeAt(Math.min(w, Math.max(0, x)), w, h);

  // Base body of the hill.
  const body = ctx.createLinearGradient(0, top, 0, h);
  body.addColorStop(0, '#d2bc66');
  body.addColorStop(0.12, '#bfad58');
  body.addColorStop(0.32, '#9d9448');
  body.addColorStop(0.65, '#8a833b');
  body.addColorStop(1, '#736d29');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, ridgeAt(x, w, h) + 3);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Broad, soft brushwork underneath: pale sweeps and deep shadow sweeps.
  const { canvas: soft, ctx: s } = softLayer(w, h, 0.25);
  for (let i = 0; i < Math.round(w / 14); i++) {
    const x = between(rand, -60, w);
    const r = ridge(x);
    const depth = rand();
    const y = r + 10 + depth * (h - r);
    const dark = depth > 0.35 && rand() < 0.6;
    blade(s, x, y, between(rand, 0.4, 1.1) * band, between(rand, -0.5, -0.18), between(rand, 8, 22) * k, between(rand, -10, 10),
      dark ? '#5d5517' : pick(rand, ['#c7b763', '#b4ab62', '#d6c374']), dark ? between(rand, 0.12, 0.28) : between(rand, 0.1, 0.25));
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(soft, 0, 0, w, h);

  // Short tufts along the crest so the hilltop is ragged rather than a clean line.
  for (let i = 0; i < Math.round(w / 1.6); i++) {
    const x = between(rand, -10, w + 10);
    blade(ctx, x, ridge(x) + between(rand, 4, 12), between(rand, 0.03, 0.1) * band, between(rand, -1.6, -0.75),
      between(rand, 1.2, 3.2) * k, between(rand, -3, 3), pick(rand, ['#d2bc66', '#c9b45e', '#dcc66f', '#bfad58']), between(rand, 0.7, 1));
  }

  // The main field of strokes, painted back to front.
  const strokes: { x: number; y: number; depth: number }[] = [];
  const count = Math.round((w * band) / 55);
  for (let i = 0; i < count; i++) {
    const x = between(rand, -60, w + 10);
    const r = ridge(x);
    const depth = Math.pow(rand(), 0.85);
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

  // Darken the very bottom slightly so the field sits on the edge of the screen.
  const foot = ctx.createLinearGradient(0, h - band * 0.45, 0, h);
  foot.addColorStop(0, 'rgba(70,64,18,0)');
  foot.addColorStop(1, 'rgba(70,64,18,0.26)');
  ctx.fillStyle = foot;
  ctx.fillRect(0, h - band * 0.45, w, band * 0.45);
}

export default function SunlitScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const grassRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const sky = skyRef.current;
    const grass = grassRef.current;
    if (!scene || !sky || !grass) return;

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
      drawGrass(grass, w, h, dpr);
      scene.classList.add('is-drawn');
    };
    draw();

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, 160);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="sl-scene" ref={sceneRef} aria-hidden="true">
      <div className="sl-sky" />
      <canvas className="sl-sky-canvas" ref={skyRef} />
      <div className="sl-sun-bloom" />
      <canvas className="sl-grass-canvas" ref={grassRef} />
    </div>
  );
}
