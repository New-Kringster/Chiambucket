'use client';
import { useEffect, useRef } from 'react';

/*
  SunlitScene — the background of every page, painted like a pastel poster: a
  sky with soft pastel washes and brush strokes, the sun with faint rays (or,
  at night, the moon and stars), drifting clouds, and a field of grass along
  the bottom. Each page has its own time of day: PRESETS below holds each
  one's colours, light and cloud layout, and app/scenes.css its sky
  gradients. components/SceneShell.tsx mounts it for the current route.

  The homepage adds the stone pine and the bird-free version of the field:
  there SunlitField renders the grass inside <main>, right after the About
  section, so it is drawn in front of that section (which rises out of it as
  you scroll) and behind everything after it. On every other page the scene
  draws its own field, behind all the content. Day scenes have tiny birds,
  the night scene fireflies in the grass.

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

/* ---------------- Presets: one per time of day ---------------- */

type CloudSpot = { x: number; y: number; w: number; h: number; k: number; drift: number; secs: number };
/* A colour grade laid over the painted field: a flat colour, or a vertical
   band running down from the hill crest, in a canvas blend mode. */
type Grade = { op: GlobalCompositeOperation; color: string } | { op: GlobalCompositeOperation; band: [string, string]; depth: number };

export type Preset = {
  sun: { x: number; y: number }; // the sun (or moon), as fractions of the screen
  haze: string; // rgb of the uneven light around it
  tints: string[]; // rgb of the sky's brushwork
  beam: string; // rgb of the broad beams
  ray: [string, string]; // rgb of the thin rays: halo, core
  rays: number; // ray strength (0: none)
  cloud: { stops: [string, string, string, string]; rim: string; under: string; k: number };
  clouds: CloudSpot[];
  grass: Grade[];
  ground?: 'beach'; // sand and sea instead of the meadow
  night?: boolean; // the moon instead of the sun, stars, fireflies instead of birds
  stars?: boolean; // the first faint stars (dusk), without the moon
};

const MORNING_CLOUDS: CloudSpot[] = [
  { x: 0.16, y: 0.15, w: 0.64, h: 0.11, k: 0.62, drift: 4, secs: 70 },
  { x: 0.75, y: 0.45, w: 0.42, h: 0.075, k: 0.5, drift: 6, secs: 92 },
  { x: 0.42, y: 0.32, w: 0.28, h: 0.05, k: 0.34, drift: 7, secs: 58 },
  { x: 0.5, y: 0.765, w: 0.95, h: 0.04, k: 0.34, drift: 2.5, secs: 120 },
];

export const PRESETS: Record<string, Preset> = {
  // Home: a sage morning, the sun just past the top-right corner.
  sunlit: {
    sun: { x: 0.97, y: -0.005 },
    haze: '250,248,228',
    tints: ['247,226,196', '236,214,206', '214,224,230', '244,240,214', '226,232,206'],
    beam: '250,248,226',
    ray: ['252,250,232', '255,253,240'],
    rays: 1,
    cloud: { stops: ['#fcfbf1', '#f0efdd', '#d3d8bf', '#bfc9ad'], rim: '255,255,248', under: '176,190,160', k: 1 },
    clouds: MORNING_CLOUDS,
    grass: [],
  },
  // Photography: golden hour, a low sun on the left, apricot light and rose clouds.
  golden: {
    sun: { x: 0.05, y: 0.16 },
    haze: '255,224,176',
    tints: ['255,212,168', '246,194,178', '232,204,216', '255,230,192', '238,210,186'],
    beam: '255,230,186',
    ray: ['255,232,196', '255,244,222'],
    rays: 1.15,
    cloud: { stops: ['#fff1dc', '#f7d9bd', '#e3bdad', '#c9a5a2'], rim: '255,238,210', under: '190,150,150', k: 1 },
    clouds: [
      { x: 0.74, y: 0.12, w: 0.6, h: 0.1, k: 0.6, drift: 4, secs: 76 },
      { x: 0.26, y: 0.46, w: 0.38, h: 0.07, k: 0.48, drift: 6, secs: 88 },
      { x: 0.56, y: 0.3, w: 0.3, h: 0.05, k: 0.36, drift: 7, secs: 62 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.04, k: 0.36, drift: 2.5, secs: 120 },
    ],
    grass: [{ op: 'soft-light', color: 'rgba(255,140,60,0.55)' }, { op: 'multiply', color: 'rgba(255,220,180,0.45)' }],
  },
  // Contact: a clear blue midday, the sun high on the right, bright white clouds.
  noon: {
    sun: { x: 0.8, y: -0.06 },
    haze: '255,255,250',
    tints: ['224,236,246', '240,244,236', '212,228,240', '246,246,236', '220,234,228'],
    beam: '255,255,252',
    ray: ['250,252,255', '255,255,255'],
    rays: 0.7,
    cloud: { stops: ['#ffffff', '#f2f6f8', '#d7e2e9', '#bccbd6'], rim: '255,255,255', under: '168,188,206', k: 1.25 },
    clouds: [
      { x: 0.22, y: 0.2, w: 0.5, h: 0.1, k: 0.7, drift: 5, secs: 70 },
      { x: 0.68, y: 0.36, w: 0.36, h: 0.08, k: 0.62, drift: 6, secs: 84 },
      { x: 0.45, y: 0.1, w: 0.26, h: 0.05, k: 0.45, drift: 8, secs: 60 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.04, k: 0.4, drift: 2.5, secs: 120 },
    ],
    grass: [],
    ground: 'beach',
  },
  // HomeLab: a cool, misty teal morning, the sun somewhere behind the haze on the left.
  teal: {
    sun: { x: 0.12, y: -0.03 },
    haze: '236,248,242',
    tints: ['210,232,226', '226,240,232', '204,224,228', '234,242,228', '208,228,222'],
    beam: '238,250,246',
    ray: ['236,250,246', '246,255,252'],
    rays: 0.55,
    cloud: { stops: ['#f5fbf8', '#e2eee9', '#c1d3ce', '#a7bdb8'], rim: '250,255,252', under: '146,174,170', k: 1 },
    clouds: [
      { x: 0.78, y: 0.16, w: 0.62, h: 0.1, k: 0.6, drift: 4, secs: 80 },
      { x: 0.3, y: 0.4, w: 0.44, h: 0.07, k: 0.5, drift: 5, secs: 96 },
      { x: 0.6, y: 0.3, w: 0.26, h: 0.05, k: 0.36, drift: 7, secs: 64 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.045, k: 0.42, drift: 2.5, secs: 120 },
    ],
    grass: [{ op: 'multiply', color: 'rgba(184,212,200,0.65)' }, { op: 'soft-light', color: 'rgba(30,96,96,0.3)' }],
  },
  // Credits and coming soon: a soft lilac haze, the sun a pale disc high in the middle.
  mist: {
    sun: { x: 0.5, y: 0.02 },
    haze: '252,248,252',
    tints: ['236,226,240', '244,236,236', '226,228,240', '240,238,230', '232,226,236'],
    beam: '252,248,252',
    ray: ['250,246,252', '255,252,255'],
    rays: 0.4,
    cloud: { stops: ['#fbf8fb', '#ebe5ee', '#d1cbd8', '#bab3c4'], rim: '255,252,255', under: '172,164,188', k: 1 },
    clouds: [
      { x: 0.2, y: 0.18, w: 0.56, h: 0.09, k: 0.55, drift: 4, secs: 84 },
      { x: 0.78, y: 0.32, w: 0.46, h: 0.07, k: 0.5, drift: 5, secs: 96 },
      { x: 0.5, y: 0.46, w: 0.3, h: 0.05, k: 0.34, drift: 6, secs: 70 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.05, k: 0.46, drift: 2.5, secs: 120 },
    ],
    grass: [{ op: 'saturation', color: 'rgba(128,128,128,0.45)' }, { op: 'multiply', color: 'rgba(228,216,234,0.55)' }],
  },
  // AI use: dusk. The sun just set behind the hill on the left, a warm glow
  // along the horizon, a violet sky and the first stars, clouds lit from below.
  dusk: {
    sun: { x: 0.14, y: 0.8 },
    haze: '255,176,140',
    tints: ['120,96,168', '168,110,150', '96,90,160', '214,138,128', '140,104,170'],
    beam: '255,190,150',
    ray: ['255,190,160', '255,214,186'],
    rays: 0.35,
    cloud: { stops: ['#f4c2ae', '#c793a6', '#7c678f', '#4a4670'], rim: '255,204,176', under: '58,54,96', k: 0.85 },
    clouds: [
      { x: 0.7, y: 0.2, w: 0.6, h: 0.09, k: 0.55, drift: 4, secs: 90 },
      { x: 0.28, y: 0.4, w: 0.42, h: 0.07, k: 0.5, drift: 5, secs: 100 },
      { x: 0.5, y: 0.3, w: 0.26, h: 0.05, k: 0.34, drift: 6, secs: 70 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.045, k: 0.4, drift: 2.5, secs: 126 },
    ],
    grass: [
      { op: 'multiply', color: '#5a5272' },
      { op: 'multiply', color: 'rgba(120,104,150,0.5)' },
      { op: 'screen', band: ['rgba(255,150,110,0.3)', 'rgba(255,150,110,0)'], depth: 0.12 },
    ],
    stars: true,
  },
  // Articles: night. The moon high on the right, stars, moonlit clouds, dark grass.
  night: {
    sun: { x: 0.84, y: 0.14 },
    haze: '150,176,226',
    tints: ['60,82,132', '84,76,128', '56,96,126', '96,100,146', '72,104,118'],
    beam: '170,196,240',
    ray: ['170,196,240', '210,226,255'],
    rays: 0,
    cloud: { stops: ['#a9b8d0', '#7184a0', '#46566f', '#2f3b54'], rim: '206,220,246', under: '24,32,52', k: 0.75 },
    clouds: [
      { x: 0.24, y: 0.14, w: 0.58, h: 0.09, k: 0.5, drift: 4, secs: 90 },
      { x: 0.62, y: 0.38, w: 0.42, h: 0.07, k: 0.42, drift: 5, secs: 104 },
      { x: 0.4, y: 0.27, w: 0.26, h: 0.05, k: 0.3, drift: 6, secs: 72 },
      { x: 0.5, y: 0.765, w: 0.95, h: 0.04, k: 0.3, drift: 2.5, secs: 130 },
    ],
    grass: [
      { op: 'multiply', color: '#33475e' },
      { op: 'multiply', color: 'rgba(70,92,124,0.55)' },
      { op: 'screen', band: ['rgba(150,178,212,0.32)', 'rgba(150,178,212,0)'], depth: 0.16 },
    ],
    night: true,
  },
};

export const presetFor = (theme: string) => PRESETS[theme] ?? PRESETS.sunlit;

const sunAt = (w: number, h: number, p: Preset) => ({ x: w * p.sun.x, y: h * p.sun.y });
// The direction the light falls in: from the sun towards the middle of the field.
const lightAngle = (w: number, h: number, p: Preset) => {
  const s = sunAt(w, h, p);
  return Math.atan2(h * 0.7 - s.y, w * 0.45 - s.x);
};

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

function drawSky(canvas: HTMLCanvasElement, w: number, h: number, dpr: number, p: Preset) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(20261018);
  const sun = sunAt(w, h, p);
  const fall = lightAngle(w, h, p);
  const reach = Math.hypot(w, h);

  const { canvas: soft, ctx: s } = softLayer(w, h, 0.5);

  // Uneven light around the sun (or the moon).
  for (let i = 0; i < 30; i++) {
    const a = fall + between(rand, -Math.PI / 4, Math.PI / 4);
    const d = Math.pow(rand(), 0.8) * reach * (p.night ? 0.3 : 0.45);
    puff(s, sun.x + Math.cos(a) * d, sun.y + Math.sin(a) * d, between(rand, 0.04, 0.1) * reach, p.haze, between(rand, 0.05, 0.12) * (p.night ? 0.6 : 1));
  }

  // Pastel brushwork, as if the sky were painted: long soft strokes, more of
  // them low in the sky where the light is warmest.
  for (let i = 0; i < Math.round(14 + w / 90); i++) {
    const y = h * Math.pow(rand(), 0.7) * 0.74;
    const len = w * between(rand, 0.25, 0.75);
    const x = between(rand, -0.2, 1) * w - len * 0.3;
    stroke(s, x, y, len, h * between(rand, 0.02, 0.06), between(rand, -0.14, 0.1), pick(rand, p.tints), between(rand, 0.05, 0.12));
  }

  // Broad, faint beams.
  if (p.rays > 0) {
    s.globalCompositeOperation = 'screen';
    for (let i = 0; i < 7; i++) {
      const angle = fall + between(rand, -0.6, 0.6);
      beam(s, sun, angle, reach * between(rand, 0.5, 0.9), 0, reach * 0.003, reach * between(rand, 0.02, 0.05), p.beam, between(rand, 0.05, 0.1) * Math.min(1, p.rays));
    }
    s.globalCompositeOperation = 'source-over';
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(soft, 0, 0, w, h);

  if (p.night) drawMoon(ctx, w, h, sun, rand);

  ctx.fillStyle = grainPattern(ctx, rand);
  ctx.fillRect(0, 0, w, h);
}

// The moon: a pale disc lit from one side, with faint seas and a soft rim.
function drawMoon(ctx: Ctx, w: number, h: number, at: { x: number; y: number }, rand: Rand) {
  const r = Math.max(14, Math.min(w, h) * 0.042);
  const glow = ctx.createRadialGradient(at.x, at.y, r * 0.9, at.x, at.y, r * 4.5);
  glow.addColorStop(0, 'rgba(214,226,250,0.32)');
  glow.addColorStop(1, 'rgba(214,226,250,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(at.x, at.y, r * 4.5, 0, Math.PI * 2);
  ctx.fill();
  const disc = ctx.createRadialGradient(at.x - r * 0.35, at.y - r * 0.35, r * 0.1, at.x, at.y, r);
  disc.addColorStop(0, '#fbf8ec');
  disc.addColorStop(0.7, '#ece8d8');
  disc.addColorStop(1, '#cfcfc6');
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(at.x, at.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(at.x, at.y, r, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < 7; i++) {
    puff(ctx, at.x + between(rand, -0.55, 0.5) * r, at.y + between(rand, -0.5, 0.55) * r, r * between(rand, 0.18, 0.36), '150,156,160', between(rand, 0.18, 0.32));
  }
  ctx.restore();
}

/* Stars: many faint ones, denser and brighter towards the top of the sky.
   `bright` paints only the few brighter stars that twinkle on their own layer. */
function drawStars(canvas: HTMLCanvasElement, w: number, h: number, dpr: number, bright: boolean) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(bright ? 8821 : 4410);
  const count = Math.round((w * h) / (bright ? 26000 : 2600));
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = Math.pow(rand(), 1.7) * h * 0.72;
    const r = bright ? between(rand, 0.9, 1.6) : between(rand, 0.35, 0.9);
    const a = (bright ? between(rand, 0.7, 1) : between(rand, 0.25, 0.75)) * (1 - y / (h * 0.8));
    ctx.fillStyle = `rgba(${pick(rand, ['255,255,255', '226,236,255', '255,244,226'])},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (bright) puff(ctx, x, y, r * 5, '210,226,255', 0.12);
  }
}

// Thin rays on their own layer, so they can shimmer: faint, uneven, and
// starting at different distances from the sun.
function drawRays(canvas: HTMLCanvasElement, w: number, h: number, dpr: number, p: Preset) {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  if (p.rays <= 0) return;
  const rand = seeded(7071);
  const sun = sunAt(w, h, p);
  const fall = lightAngle(w, h, p);
  const reach = Math.hypot(w, h);
  for (let i = 0; i < 17; i++) {
    const angle = fall + between(rand, -0.66, 0.66);
    const length = reach * between(rand, 0.3, 0.8);
    const gap = length * between(rand, 0, 0.35);
    const width = between(rand, 0.6, 1.8);
    const alpha = between(rand, 0.06, 0.18) * p.rays;
    beam(ctx, sun, angle, length, gap, 0.4, width * 3.5, p.ray[0], alpha * 0.4);
    beam(ctx, sun, angle, length, gap, 0.2, width, p.ray[1], alpha);
  }
}

/* ---------------- Clouds ---------------- */

/* Each preset's `clouds` gives where they sit (centre x/y as a fraction of the
   screen, size as a fraction of the shorter side), how bright they are, and
   how they drift. */

/* One fair-weather cloud on its own canvas: round lobes with a flat base,
   shaded from a warm lit top to a sage underside. It is painted at a modest
   resolution and softened by a CSS blur, which stays smooth at any pixel
   density (the old version was upscaled from a few pixels and looked blocky
   on phones). */
function paintCloud(canvas: HTMLCanvasElement, cw: number, ch: number, rand: Rand, look: Preset['cloud']) {
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
  shade.addColorStop(0, look.stops[0]);
  shade.addColorStop(0.5, look.stops[1]);
  shade.addColorStop(0.85, look.stops[2]);
  shade.addColorStop(1, look.stops[3]);
  c.fillStyle = shade;
  c.fillRect(0, 0, cw, ch);

  // Brighter rims on the sun side, a little volume underneath.
  c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < lobes; i++) {
    puff(c, ox + between(rand, -0.2, 0.5) * w, base - h * between(rand, 0.6, 1.2), h * between(rand, 0.25, 0.5), look.rim, 0.5);
    puff(c, ox + between(rand, -0.45, 0.3) * w, base - h * between(rand, 0.05, 0.35), h * between(rand, 0.2, 0.4), look.under, 0.28);
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

// The horizon, as a fraction of the screen height (a touch higher on the left).
const HILL = 0.795;

/* The far edge of the field: nearly level, with long low swells, so the
   meadow reads as running on to the horizon rather than over a near hill. */
function ridgeAt(x: number, w: number, h: number) {
  const t = x / w;
  return h * (HILL + 0.01 * t)
    + Math.sin(t * 3.1 + 0.6) * h * 0.004
    + Math.sin(t * 9.7 + 2.1) * h * 0.0018
    + Math.sin(t * 31.3 + 1.3) * h * 0.0006;
}

function blade(
  ctx: Ctx, x: number, y: number, length: number, angle: number,
  width: number, bend: number, color: string, alpha: number, root?: string,
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
  if (root) {
    // shaded at its foot, where the blades around it block the light, lit towards the tip
    const shade = ctx.createLinearGradient(x, y, tx, ty);
    shade.addColorStop(0, root);
    shade.addColorStop(0.6, color);
    ctx.fillStyle = shade;
  } else {
    ctx.fillStyle = color;
  }
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
const FAR = ['#d8c674', '#cdbb68', '#c3b263', '#e0d08a', '#b9aa5f'];

/* The field is painted for a screen of height h onto a canvas that starts at
   FIELD_TOP (nothing is painted above it) and runs to `full`, below the bottom
   of the screen: that part is there for the end of the page, where the field
   rises to reach above the footer. */
const FIELD_TOP = 0.6;

/* Where the tree stands in the field (homepage): the trunk is copied from the
   tree's canvas into the field down to its foot, with the nearer grass laid
   over the foot, so the tree stands partway into the meadow instead of on
   the horizon. */
export type TreeFoot = { canvas: HTMLCanvasElement; dpr: number; x: number; half: number; foot: number };
// How far down the grass, from the horizon (0) to the bottom of the screen (1), the tree stands.
const TREE_DEPTH = 0.32;

/* Perspective: the ground is a plane running away to the horizon, so a blade
   s of the way from the horizon (0) to the bottom of the screen (1) is drawn
   at a size proportional to s. Far away there are only specks and streaks;
   close up, long single blades. */
function drawGrass(canvas: HTMLCanvasElement, w: number, h: number, full: number, dpr: number, p: Preset, horizon: string | null, tree?: TreeFoot | null) {
  const origin = h * FIELD_TOP;
  const ctx = prepare(canvas, w, full - origin, dpr);
  ctx.clearRect(0, 0, w, full - origin);
  ctx.translate(0, -origin);
  const rand = seeded(1517);

  const top = h * (HILL - 0.005);
  const band = h - top;
  const k = Math.min(1.5, Math.max(0.85, band / 170));
  const ridge = (x: number) => ridgeAt(Math.min(w, Math.max(0, x)), w, h);
  const at = (x: number, s: number) => { const r = ridge(x); return r + s * (h - r); };

  // Base body of the field: pale where it meets the sky, deepening towards the viewer.
  const body = ctx.createLinearGradient(0, top, 0, h);
  body.addColorStop(0, '#d6c272');
  body.addColorStop(0.1, '#c8b562');
  body.addColorStop(0.32, '#a59a4c');
  body.addColorStop(0.65, '#8a833b');
  body.addColorStop(1, '#736d29');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, full);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, ridgeAt(x, w, h) + 1);
  ctx.lineTo(w, full);
  ctx.closePath();
  ctx.fill();

  // Broad, soft brushwork underneath: pale and shadowed sweeps, flattening
  // into thin streaks towards the horizon.
  const { canvas: soft, ctx: s } = softLayer(w, full, 0.25);
  for (let i = 0; i < Math.round((w / 14) * ((full - top) / band) * 0.6); i++) {
    const x = between(rand, -60, w);
    const depth = rand();
    const y = at(x, 0.04 + depth * ((full - top) / band));
    const d = Math.min(1, depth * 1.4);
    const dark = depth > 0.25 && rand() < 0.6;
    blade(s, x, y, between(rand, 0.4, 1.1) * band * (0.25 + 0.75 * d), between(rand, -0.5, -0.18) * (0.35 + 0.65 * d), between(rand, 8, 22) * k * (0.2 + 0.8 * d), between(rand, -10, 10),
      dark ? '#5d5517' : pick(rand, ['#c7b763', '#b4ab62', '#d6c374']), dark ? between(rand, 0.12, 0.28) : between(rand, 0.1, 0.25));
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(soft, 0, 0, w, full);

  // The distant field: too far for single blades. Long flat dabs of light and
  // shade, and fine upright specks that grow as the ground comes nearer.
  for (let i = 0; i < Math.round(w / 3); i++) {
    const sd = Math.pow(rand(), 1.5) * 0.22;
    const x = between(rand, -40, w);
    ctx.globalAlpha = between(rand, 0.1, 0.24);
    ctx.fillStyle = rand() < 0.5 ? pick(rand, FAR) : '#8f8642';
    ctx.beginPath();
    ctx.ellipse(x, at(x, sd), between(rand, 20, 70) * (0.3 + sd * 4), 0.6 + sd * 9 * k, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < Math.round((w * band) / 10); i++) {
    const sd = Math.pow(rand(), 1.4) * 0.16;
    const x = between(rand, -4, w + 4);
    const tall = (0.8 + sd * 30) * k * between(rand, 0.6, 1.3);
    ctx.globalAlpha = between(rand, 0.35, 0.8);
    ctx.fillStyle = sd < 0.03 ? pick(rand, FAR) : pick(rand, rand() < 0.6 ? FAR : MID);
    ctx.fillRect(x, at(x, sd) - tall + 0.5, Math.max(0.6, (0.5 + sd * 6) * k), tall);
  }

  // The main field of strokes, painted back to front. Each is sized by its
  // distance; there are many more of them towards the horizon, where each
  // covers so little. Depth runs past 1 below the screen, all near, darker grass.
  const strokes: { x: number; y: number; depth: number }[] = [];
  const reach = (full - top) / band;
  const S0 = 0.07;
  const count = Math.round((w * band) / 48);
  const below = Math.round(count * (reach - 1) * 0.14);
  for (let i = 0; i < count + below; i++) {
    const x = between(rand, -60, w + 10);
    // denser towards the horizon: s is drawn from 1/s^1.6 between S0 and 1
    const depth = i < count ? S0 / Math.pow(1 - rand() * (1 - Math.pow(S0, 0.6)), 1 / 0.6) : between(rand, 1, reach);
    strokes.push({ x, y: at(x, depth) + 2, depth });
  }
  strokes.sort((a, b) => a.y - b.y);
  // The tree's foot, in the field's own x (the canvas is stretched to 106 % and starts 3 % left).
  const treeX = tree ? (tree.x + w * 0.03) / 1.06 : 0;
  const footY = tree ? at(treeX, TREE_DEPTH) : Infinity;
  const front: Parameters<typeof blade>[] = [];
  for (const st of strokes) {
    const near = Math.min(1, st.depth);
    const size = 0.06 + 1.8 * near;
    const t = st.depth + between(rand, -0.1, 0.1);
    const palette = t < 0.15 ? LIT : t < 0.4 ? MID : LOW;
    // Shading is kept to the visible slope: the far rows are too small to show
    // it and the grass below the screen is already deep in shadow.
    const root = st.depth < 0.25 || st.depth > 1 ? undefined : near < 0.55 ? '#7f7731' : '#575016';
    const args: Parameters<typeof blade> = [ctx, st.x, st.y, between(rand, 0.17, 0.42) * band * size, between(rand, -1.05, -0.5) - (1 - near) * 0.45,
      between(rand, 0.9, 2.4) * k * size, between(rand, -7, 7) * k * size, pick(rand, palette), between(rand, 0.4, 0.8), root];
    blade(...args);
    // strokes rooted at or in front of the tree's foot that can reach across its trunk
    if (tree && st.y > footY - band * 0.015 && st.y < footY + band * 0.9 && st.x > treeX - band * 0.85 && st.x < treeX + band * 0.12) front.push(args);
  }

  // Wind running over the field: soft patches of light and shadow in rows
  // that crowd together towards the horizon, the way gusts bend a meadow.
  const { canvas: wind, ctx: wv } = softLayer(w, full, 0.1);
  const rows = 10;
  for (let j = 1; j <= rows; j++) {
    const d = Math.pow(j / rows, 1.9);
    const tall = (2 + 32 * d) * k;
    const lit = j % 2 === 1;
    for (let x = between(rand, -200, 0); x < w + 200; x += between(rand, 0.6, 1.4) * (120 + 360 * d)) {
      wv.globalAlpha = lit ? between(rand, 0.08, 0.17) : between(rand, 0.12, 0.22);
      wv.fillStyle = lit ? '#f1e3a6' : '#48420f';
      wv.beginPath();
      wv.ellipse(x, at(x, 0.02 + d * 0.98) + between(rand, -0.4, 0.4) * tall, between(rand, 70, 170) * (0.3 + d), tall, between(rand, -0.04, 0.04), 0, Math.PI * 2);
      wv.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-atop';
  ctx.drawImage(wind, 0, 0, w, full);
  ctx.globalCompositeOperation = 'source-over';

  // A few pale highlights catching the light, sized by distance like the rest.
  for (let i = 0; i < Math.round(w / 4); i++) {
    const x = rand() * w;
    const depth = 0.04 + Math.pow(rand(), 1.6) * 0.96;
    const size = 0.1 + 1.1 * depth;
    blade(ctx, x, at(x, depth), between(rand, 0.1, 0.3) * band * size, between(rand, -1.25, -0.55),
      between(rand, 0.4, 1) * k * size, between(rand, -5, 5) * size, pick(rand, ['#ecdd9c', '#e3d189', '#d8ca85']), between(rand, 0.25, 0.6) * (1 - depth * 0.5));
  }

  // The horizon's own edge: a fine fringe of specks standing just over it.
  for (let i = 0; i < Math.round(w / 1.4); i++) {
    const x = between(rand, -4, w + 4);
    const tall = between(rand, 0.6, 2.4) * k;
    ctx.globalAlpha = between(rand, 0.4, 0.85);
    ctx.fillStyle = pick(rand, FAR);
    ctx.fillRect(x, ridge(x) + 1.5 - tall, Math.max(0.6, 0.7 * k), tall);
  }

  // Out of focus right in front: a few long, dark blades rising from below the
  // edge of the screen, painted small and scaled up so they come out soft.
  const { canvas: fore, ctx: f } = softLayer(w, full, 0.14);
  for (let i = 0; i < Math.round(w / 22); i++) {
    const x = between(rand, -40, w + 40);
    blade(f, x, h + between(rand, 0.05, 0.45) * band, between(rand, 0.35, 0.75) * band, between(rand, -1.45, -0.85),
      between(rand, 7, 15) * k, between(rand, -16, 16) * k, pick(rand, ['#433e0f', '#4f4914', '#5c551b']), between(rand, 0.35, 0.6));
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(fore, 0, 0, w, full);

  // Darken the very bottom slightly so the field sits on the edge of the screen,
  // and keep darkening below it.
  const foot = ctx.createLinearGradient(0, h - band * 0.45, 0, full);
  foot.addColorStop(0, 'rgba(70,64,18,0)');
  foot.addColorStop(Math.min(0.9, (band * 0.45) / (full - h + band * 0.45)), 'rgba(70,64,18,0.26)');
  foot.addColorStop(1, 'rgba(62,58,16,0.4)');
  ctx.fillStyle = foot;
  ctx.fillRect(0, h - band * 0.45, w, full - h + band * 0.45);

  gradeField(canvas, p.grass, h, origin, dpr);

  // Distance: the far field takes on the colour of the sky just above it, most
  // of all at the horizon, fading out down the slope. Laid on after the grade
  // so it matches the sky as painted, in narrow columns that follow the horizon.
  if (horizon) haze(ctx, 0, w, band, ridge, horizon);

  // The tree, planted: its trunk down to the foot over the finished field,
  // then the strokes in front of the foot again, graded and hazed the same way.
  if (tree) {
    plantTree(ctx, tree, w, ridge(treeX), footY);
    const bx = Math.floor(treeX - band * 0.9), by = Math.floor(ridge(treeX) - 8);
    const bw = Math.ceil(band * 1.1), bh = Math.ceil(footY + band * 0.95 - by);
    const layer = document.createElement('canvas');
    const lc = prepare(layer, bw, bh, dpr);
    lc.translate(-bx, -by);
    for (const args of front) { args[0] = lc; blade(...args); }
    lc.globalAlpha = 1;
    lc.drawImage(fore, 0, 0, w, full);
    gradeField(layer, p.grass, h, by, dpr);
    if (horizon) haze(lc, bx, bx + bw, band, ridge, horizon);
    ctx.drawImage(layer, bx, by, bw, bh);
  }
}

/* Distance haze over a painted field, in narrow columns that follow the horizon. */
function haze(ctx: Ctx, x0: number, x1: number, band: number, ridge: (x: number) => number, horizon: string) {
  ctx.globalCompositeOperation = 'source-atop';
  const step = 24;
  for (let x = Math.floor(x0 / step) * step; x < x1; x += step) {
    const r = ridge(x + step / 2);
    const air = ctx.createLinearGradient(0, r - 4, 0, r + band * 0.55);
    air.addColorStop(0, `rgba(${horizon},0.78)`);
    air.addColorStop(0.08, `rgba(${horizon},0.5)`);
    air.addColorStop(0.3, `rgba(${horizon},0.2)`);
    air.addColorStop(1, `rgba(${horizon},0)`);
    ctx.fillStyle = air;
    ctx.fillRect(x, r - 12, step, band * 0.6);
  }
  ctx.globalCompositeOperation = 'source-over';
}

/* Lay the trunk into the field where the tree stands: copied from the tree's
   canvas (the field canvas is stretched to 106 % of the screen and starts 3 %
   to the left, so screen x maps back through that), then the strokes after it
   cover its foot. */
function plantTree(ctx: Ctx, tree: TreeFoot, w: number, horizonY: number, footY: number) {
  const sx = Math.max(0, (tree.x - tree.half * 2) * tree.dpr);
  const sw = Math.min(tree.canvas.width - sx, tree.half * 4 * tree.dpr);
  const y0 = horizonY - 6;
  const y1 = footY + 4;
  if (sw <= 0 || y1 <= y0) return;
  // The trunk on its own layer first, so its foot can sink into shadow and fade.
  const cw = Math.ceil(sw / tree.dpr), ch = Math.ceil(y1 - y0);
  const piece = document.createElement('canvas');
  const pc = prepare(piece, cw, ch, tree.dpr);
  pc.drawImage(tree.canvas, sx, y0 * tree.dpr, sw, ch * tree.dpr, 0, 0, cw, ch);
  pc.globalCompositeOperation = 'source-atop';
  const dusk = pc.createLinearGradient(0, ch - 26, 0, ch);
  dusk.addColorStop(0, 'rgba(52,46,14,0)');
  dusk.addColorStop(1, 'rgba(52,46,14,0.55)');
  pc.fillStyle = dusk;
  pc.fillRect(0, ch - 26, cw, 26);
  pc.globalCompositeOperation = 'destination-out';
  const fade = pc.createLinearGradient(0, ch - 10, 0, ch);
  fade.addColorStop(0, 'rgba(0,0,0,0)');
  fade.addColorStop(1, 'rgba(0,0,0,1)');
  pc.fillStyle = fade;
  pc.fillRect(0, ch - 10, cw, 10);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.drawImage(piece, (sx / tree.dpr + w * 0.03) / 1.06, y0, cw / 1.06, ch);
  ctx.restore();
}

/* The sky's colour just above the horizon, averaged across the screen. */
function horizonOf(sky: HTMLCanvasElement, h: number): string | null {
  const ctx = sky.getContext('2d');
  if (!ctx || !sky.width || !sky.height) return null;
  const y = Math.min(sky.height - 1, Math.round(h * (HILL - 0.02) * (sky.height / h)));
  const row = ctx.getImageData(0, y, sky.width, 1).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < row.length; i += 4 * 8) { r += row[i]; g += row[i + 1]; b += row[i + 2]; n++; }
  return n ? `${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)}` : null;
}

/* ---------------- Beach (the contact page) ---------------- */

/* Instead of the meadow, the contact page looks out to sea from the sand: a
   level sea horizon, open water turning to turquoise over the shallows, a
   wave breaking, the surf washing up the wet sand, and dry rippled sand in
   front. Painted once like the field; the surf and the glints on the water
   are their own small canvases, moved only with CSS (app/scenes.css). */

// The waterline, as a share of the way from the horizon (0) down to the bottom of the screen (1).
const shoreAt = (x: number, w: number) => 0.47 + 0.03 * Math.sin((x / w) * 2.3 + 0.8) + 0.01 * Math.sin((x / w) * 7.3 + 1.9);

const SEA_BRUSH = ['#9cc0d6', '#86b2cc', '#6fa3c2', '#5b96b9', '#4f8db3'];
const SAND_LIT = ['#f2e4c3', '#eedcb6', '#f5e9cd'];
const SAND_SHADE = ['#d3bb8f', '#c9ae82', '#dcc59a'];

export type BeachLayers = { surf: HTMLCanvasElement[]; glints: HTMLCanvasElement[] };

function drawBeach(canvas: HTMLCanvasElement, w: number, h: number, full: number, dpr: number, p: Preset, horizon: string | null, layers: BeachLayers | null) {
  const origin = h * FIELD_TOP;
  const ctx = prepare(canvas, w, full - origin, dpr);
  ctx.clearRect(0, 0, w, full - origin);
  ctx.translate(0, -origin);
  const rand = seeded(2207);

  const sea = h * (HILL + 0.004); // the horizon: dead level, as only the sea is
  const band = h - sea;
  const k = Math.min(1.5, Math.max(0.85, band / 170));
  const yAt = (s: number) => sea + s * band;
  const shoreY = (x: number) => yAt(shoreAt(x, w));
  const sunX = w * p.sun.x;

  // The water: hazy at the horizon, deep blue out at sea, turquoise and pale over the shallows.
  const water = ctx.createLinearGradient(0, sea, 0, yAt(0.52));
  water.addColorStop(0, '#a9c8db');
  water.addColorStop(0.08, '#7eabc8');
  water.addColorStop(0.35, '#5b98bd');
  water.addColorStop(0.62, '#4fa4b8');
  water.addColorStop(0.82, '#6cc1c3');
  water.addColorStop(1, '#9bd8cf');
  ctx.fillStyle = water;
  ctx.fillRect(-10, sea, w + 20, band * 0.6);

  // Long, flat brushstrokes of lighter and darker water, flattening into lines towards the horizon.
  for (let i = 0; i < Math.round(w / 2.2); i++) {
    const s = Math.pow(rand(), 1.6) * 0.46;
    const x = between(rand, -60, w + 60);
    if (yAt(s) > shoreY(x) - 2) continue;
    ctx.globalAlpha = between(rand, 0.08, 0.26);
    ctx.fillStyle = rand() < 0.45 ? '#cfe3ec' : pick(rand, SEA_BRUSH);
    ctx.beginPath();
    ctx.ellipse(x, yAt(s), between(rand, 16, 60) * (0.25 + s * 4), (0.3 + s * 5) * k, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Swells rolling in: darker lines that crowd together towards the horizon.
  const swells = 9;
  for (let j = 1; j <= swells; j++) {
    const s = Math.pow(j / swells, 1.8) * 0.4;
    ctx.strokeStyle = '#3f7fa6';
    ctx.lineWidth = (0.4 + s * 6) * k;
    for (let x = between(rand, -200, 0); x < w + 100;) {
      const len = between(rand, 60, 260) * (0.4 + s * 3);
      ctx.globalAlpha = between(rand, 0.12, 0.3);
      ctx.beginPath();
      for (let u = 0; u <= 1.001; u += 0.1) {
        const px = x + u * len;
        const py = yAt(s) + Math.sin(u * Math.PI) * -1.4 * (0.3 + s * 4) * k;
        if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      x += len + between(rand, 20, 160) * (0.4 + s * 2);
    }
  }

  // Whitecaps: specks out at sea, short dashes nearer in.
  for (let i = 0; i < Math.round(w / 16); i++) {
    const s = Math.pow(rand(), 1.4) * 0.34;
    const x = between(rand, 0, w);
    const len = (1 + s * 30) * k * between(rand, 0.4, 1.3);
    ctx.globalAlpha = between(rand, 0.25, 0.65) * (0.5 + s);
    ctx.fillStyle = '#f6fbfb';
    ctx.beginPath();
    ctx.ellipse(x, yAt(s), len, Math.max(0.35, (0.3 + s * 3) * k), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // The sun on the water: a soft column of light under the sun, widening towards the shore.
  const { canvas: glow, ctx: g } = softLayer(w, full, 0.2);
  for (let i = 0; i < 260; i++) {
    const s = Math.pow(rand(), 0.8) * 0.42;
    const spread = 18 + s * 520;
    g.globalAlpha = between(rand, 0.05, 0.16);
    g.fillStyle = '#fbfdf8';
    g.beginPath();
    g.ellipse(sunX + between(rand, -1, 1) * spread, yAt(s), between(rand, 10, 40) * (0.4 + s * 3), (0.6 + s * 4) * k, 0, 0, Math.PI * 2);
    g.fill();
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(glow, 0, 0, w, full);

  // The breaking wave: a pale, glassy face under a line of foam, then the
  // foam left behind on the shallows, all following the waterline.
  const line = (off: number) => (x: number) => shoreY(x) - off * band;
  const face = line(0.085), crest = line(0.1), wash = line(0.045);
  ctx.globalAlpha = 0.5;
  const faceFill = ctx.createLinearGradient(0, yAt(0.33), 0, yAt(0.48));
  faceFill.addColorStop(0, 'rgba(120,206,206,0)');
  faceFill.addColorStop(1, 'rgba(150,222,214,0.9)');
  ctx.fillStyle = faceFill;
  ctx.beginPath();
  ctx.moveTo(-10, crest(-10));
  for (let x = 0; x <= w + 10; x += 8) ctx.lineTo(x, crest(x));
  for (let x = w + 10; x >= -10; x -= 8) ctx.lineTo(x, face(x) + band * 0.03);
  ctx.closePath();
  ctx.fill();
  // The crest: foam that swells and thins along the wave in clumps.
  for (let x = -20; x < w + 20; x += 2) {
    const swell = 0.5 + 0.5 * Math.sin(x / 47 + 1.3) * Math.sin(x / 131 + 0.4);
    const thick = (0.8 + swell * 2.6) * k;
    ctx.globalAlpha = between(rand, 0.55, 0.95);
    ctx.fillStyle = rand() < 0.75 ? '#fbfefd' : '#dcefee';
    ctx.beginPath();
    ctx.ellipse(x, crest(x) + between(rand, -0.5, 0.5) * thick, between(rand, 2.4, 5) * k, thick * between(rand, 0.6, 1), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // What the wave leaves on the shallows: a loose lace of foam.
  ctx.strokeStyle = '#f2fafa';
  for (let i = 0; i < Math.round(w / 9); i++) {
    const x = between(rand, -20, w + 20);
    const y = between(rand, crest(x) + 3 * k, wash(x) + 2 * k);
    const len = between(rand, 10, 40) * k;
    ctx.globalAlpha = between(rand, 0.25, 0.6);
    ctx.lineWidth = between(rand, 0.5, 1.2) * k;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + len * 0.3, y + between(rand, -4, 4) * k, x + len * 0.7, y + between(rand, -4, 4) * k, x + len, y + between(rand, -1.5, 1.5) * k);
    ctx.stroke();
  }

  // The sand. Wet and dark at the waterline with the sky in it, drying to pale
  // gold, then warmer and shadowed close up.
  const sandTop = (x: number) => shoreY(x) - 1;
  ctx.globalAlpha = 1;
  const sand = ctx.createLinearGradient(0, yAt(0.42), 0, h);
  sand.addColorStop(0, '#b49b74');
  sand.addColorStop(0.16, '#cdb68c');
  sand.addColorStop(0.3, '#e9d7af');
  sand.addColorStop(0.7, '#e3cc9f');
  sand.addColorStop(1, '#d5ba8b');
  ctx.fillStyle = sand;
  ctx.beginPath();
  ctx.moveTo(-10, full);
  for (let x = -10; x <= w + 10; x += 6) ctx.lineTo(x, sandTop(x));
  ctx.lineTo(w + 10, full);
  ctx.closePath();
  ctx.fill();
  // the sky mirrored in the wet sand
  ctx.globalCompositeOperation = 'source-atop';
  for (let x = 0; x < w; x += 24) {
    const top = sandTop(x + 12);
    const sheen = ctx.createLinearGradient(0, top, 0, top + band * 0.14);
    sheen.addColorStop(0, 'rgba(178,212,230,0.6)');
    sheen.addColorStop(1, 'rgba(178,212,230,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(x, top, 24, band * 0.15);
  }
  ctx.globalCompositeOperation = 'source-over';

  // Ripples the wind has left in the dry sand, finer and closer together further off.
  // Soft mottling: broad patches a shade lighter or darker.
  const { canvas: mott, ctx: m } = softLayer(w, full, 0.15);
  for (let i = 0; i < Math.round(w / 6); i++) {
    const x = between(rand, -60, w + 60);
    const sd = between(rand, shoreAt(x, w) + 0.1, (full - sea) / band);
    m.globalAlpha = between(rand, 0.08, 0.2);
    m.fillStyle = rand() < 0.5 ? '#f6ead0' : '#c8ad80';
    m.beginPath();
    m.ellipse(x, yAt(sd), between(rand, 30, 110) * (0.3 + sd), between(rand, 3, 9) * (0.3 + sd) * k, 0, 0, Math.PI * 2);
    m.fill();
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(mott, 0, 0, w, full);
  for (let j = 0; j < 26; j++) {
    const s = 0.6 + Math.pow(j / 26, 1.4) * 0.85;
    for (let x = between(rand, -160, 0); x < w + 60;) {
      const len = between(rand, 70, 220) * (0.5 + s);
      const y = yAt(s) + between(rand, -3, 3) * s;
      if (y > sandTop(x) + band * 0.1) {
        const a1 = between(rand, -4, 4) * s * k, a2 = between(rand, -4, 4) * s * k;
        for (const [color, dy, a] of [['#c4a97c', 0, 0.2], ['#f7ecd3', -1.3 * s * k, 0.3]] as const) {
          ctx.globalAlpha = a * between(rand, 0.5, 1);
          ctx.strokeStyle = color;
          ctx.lineWidth = (0.5 + s * 1.4) * k;
          ctx.beginPath();
          ctx.moveTo(x, y + dy);
          ctx.bezierCurveTo(x + len * 0.33, y + dy + a1, x + len * 0.66, y + dy + a2, x + len, y + dy);
          ctx.stroke();
        }
      }
      x += len + between(rand, 30, 120) * s;
    }
  }

  // Grains: fine specks of light and shade, larger close up.
  for (let i = 0; i < Math.round((w * band) / 14); i++) {
    const x = between(rand, 0, w);
    const s = between(rand, shoreAt(x, w) + 0.02, (full - sea) / band);
    const size = Math.max(0.6, (0.3 + s * 1.6) * k);
    ctx.globalAlpha = between(rand, 0.2, 0.55);
    ctx.fillStyle = rand() < 0.5 ? pick(rand, SAND_LIT) : pick(rand, SAND_SHADE);
    ctx.fillRect(x, yAt(s), size, size);
  }

  // Close in front: soft, out-of-focus swells of sand along the bottom edge.
  const { canvas: fore, ctx: f } = softLayer(w, full, 0.12);
  for (let i = 0; i < Math.round(w / 60); i++) {
    f.globalAlpha = between(rand, 0.18, 0.34);
    f.fillStyle = pick(rand, ['#c4a676', '#b89a6b', '#d0b484']);
    f.beginPath();
    f.ellipse(between(rand, -60, w + 60), h + between(rand, -0.05, 0.25) * band, between(rand, 80, 220) * k, between(rand, 14, 34) * k, 0, 0, Math.PI * 2);
    f.fill();
  }
  ctx.globalAlpha = 1;
  ctx.drawImage(fore, 0, 0, w, full);
  const foot = ctx.createLinearGradient(0, h - band * 0.4, 0, full);
  foot.addColorStop(0, 'rgba(120,96,58,0)');
  foot.addColorStop(Math.min(0.9, (band * 0.4) / (full - h + band * 0.4)), 'rgba(120,96,58,0.18)');
  foot.addColorStop(1, 'rgba(110,88,52,0.3)');
  ctx.fillStyle = foot;
  ctx.fillRect(0, h - band * 0.4, w, full - h + band * 0.4);

  // Distance: the far sea melts into the sky.
  if (horizon) haze(ctx, 0, w, band * 0.5, () => sea, horizon);

  if (layers) drawShoreLayers(layers, w, h, sea, band, k, sunX, dpr);
}

/* The moving parts, each on a small canvas laid over the waterline or the
   sea: two sheets of surf that take turns washing up the sand, and two sets
   of glints under the sun that twinkle out of step. They are in screen
   coordinates (the field canvas is stretched to 106 % from 3 % left). */
function drawShoreLayers(layers: BeachLayers, w: number, h: number, sea: number, band: number, k: number, sunX: number, dpr: number) {
  const toField = (x: number) => (x + w * 0.03) / 1.06;
  const shore = (x: number) => sea + shoreAt(toField(x), w) * band;
  const rand = seeded(4409);

  const surfTop = sea + band * 0.36, surfH = band * 0.34;
  layers.surf.forEach((el, n) => {
    el.style.top = `${surfTop.toFixed(1)}px`;
    el.style.height = `${surfH.toFixed(1)}px`;
    const c = prepare(el, w, surfH, Math.min(dpr, 1.5));
    c.clearRect(0, 0, w, surfH);
    c.translate(0, -surfTop);
    // the thin sheet of water running up the sand, and its lacy edge
    const reachOf = (x: number) => shore(x) + band * (0.035 + 0.025 * Math.sin(x / (90 + n * 40) + n * 2.1) + 0.012 * Math.sin(x / 23 + n));
    c.globalAlpha = 1;
    for (let x = 0; x < w; x += 6) {
      const top = shore(x) - band * 0.02, bottom = reachOf(x);
      const sheet = c.createLinearGradient(0, top, 0, bottom);
      sheet.addColorStop(0, 'rgba(150,214,212,0.55)');
      sheet.addColorStop(1, 'rgba(196,232,228,0.25)');
      c.fillStyle = sheet;
      c.fillRect(x, top, 6.5, bottom - top);
    }
    for (let x = -4; x < w + 4; x += 2.2) {
      const y = reachOf(x);
      c.globalAlpha = between(rand, 0.5, 0.95);
      c.fillStyle = rand() < 0.85 ? '#fbfefe' : '#e2f2f1';
      c.beginPath();
      c.ellipse(x, y + between(rand, -1, 0.6) * k, between(rand, 1.4, 3.6) * k, between(rand, 0.5, 1.3) * k, 0, 0, Math.PI * 2);
      c.fill();
      if (rand() < 0.35) {
        c.globalAlpha = between(rand, 0.3, 0.7);
        c.beginPath();
        c.arc(x + between(rand, -3, 3), y - between(rand, 1, 6) * k, between(rand, 0.4, 1.1) * k, 0, Math.PI * 2);
        c.fill();
      }
    }
  });

  const glintTop = sea, glintH = band * 0.45;
  layers.glints.forEach((el) => {
    el.style.top = `${glintTop.toFixed(1)}px`;
    el.style.height = `${glintH.toFixed(1)}px`;
    const c = prepare(el, w, glintH, Math.min(dpr, 1.5));
    c.clearRect(0, 0, w, glintH);
    c.translate(0, -glintTop);
    c.fillStyle = '#ffffff';
    for (let i = 0; i < 46; i++) {
      const s = Math.pow(rand(), 0.85) * 0.38;
      const x = sunX + between(rand, -1, 1) * (12 + s * 420);
      const y = sea + s * band;
      if (y > shore(x) - band * 0.14) continue;
      const r = (0.4 + s * 3.4) * k * between(rand, 0.6, 1.2);
      c.globalAlpha = between(rand, 0.45, 0.9);
      c.beginPath();
      c.ellipse(x, y, r * 2.6, Math.max(0.35, r * 0.32), 0, 0, Math.PI * 2);
      c.fill();
    }
  });
}

/* Lay a preset's colour grade over the painted field. Blend modes also paint
   where the canvas is empty, so the field's own shape is stamped back on
   afterwards from a copy taken first. */
function gradeField(canvas: HTMLCanvasElement, grades: Grade[], h: number, origin: number, dpr: number) {
  if (!grades.length) return;
  const ctx = canvas.getContext('2d')!;
  const shape = document.createElement('canvas');
  shape.width = canvas.width;
  shape.height = canvas.height;
  shape.getContext('2d')!.drawImage(canvas, 0, 0);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  for (const g of grades) {
    ctx.globalCompositeOperation = g.op;
    if ('color' in g) {
      ctx.fillStyle = g.color;
    } else {
      // a band running down from just above the hill crest
      const y0 = (h * (HILL - 0.03) - origin) * dpr;
      const band = ctx.createLinearGradient(0, y0, 0, y0 + h * g.depth * dpr);
      band.addColorStop(0, g.band[0]);
      band.addColorStop(1, g.band[1]);
      ctx.fillStyle = band;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(shape, 0, 0);
  ctx.restore();
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
  trunkHalf: 30 / 820, // half the bare trunk's width, across the painting
};

type NameBox = { left: number; top: number };

function drawTree(canvas: HTMLCanvasElement, w: number, h: number, dpr: number, img: HTMLImageElement, name: NameBox): TreeFoot | null {
  const ctx = prepare(canvas, w, h, dpr);
  ctx.clearRect(0, 0, w, h);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return null;
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
  // The trunk runs on well past its foot in the field: the grass hides the
  // rest, and the field sinks a little further than the tree as you scroll.
  const horizonY = ridgeAt(Math.max(0, trunkX), w, h);
  const foot = horizonY + (h - horizonY) * TREE_DEPTH;
  const ground = Math.min(h, foot + h * 0.15);
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
  return { canvas, dpr, x: trunkX, half: TREE.trunkHalf * iw * s, foot };
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
export function SunlitField({ beach = false }: { beach?: boolean }) {
  return (
    <div className={`sl-grass${beach ? ' is-beach' : ''}`} aria-hidden="true">
      <canvas className="sl-grass-canvas" />
      {beach && (
        <>
          <canvas className="sl-glint" />
          <canvas className="sl-glint is-b" />
          <canvas className="sl-surf" />
          <canvas className="sl-surf is-b" />
        </>
      )}
    </div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* Fireflies for the night scene: small glowing points drifting and blinking
   in the grass, each on its own CSS animation (app/scenes.css .sl-firefly). */
function addFireflies(field: HTMLElement, h: number) {
  const rand = seeded(9090);
  const flies: HTMLElement[] = [];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('span');
    el.className = 'sl-firefly';
    el.style.left = `${(between(rand, 0.02, 0.98) * 100).toFixed(2)}%`;
    el.style.top = `${(h * between(rand, HILL - 0.04, 0.97)).toFixed(1)}px`;
    el.style.setProperty('--dx', `${between(rand, -40, 40).toFixed(0)}px`);
    el.style.setProperty('--dy', `${between(rand, -28, 10).toFixed(0)}px`);
    el.style.setProperty('--drift', `${between(rand, 6, 11).toFixed(1)}s`);
    el.style.setProperty('--blink', `${between(rand, 2.2, 4.5).toFixed(1)}s`);
    el.style.setProperty('--delay', `${(-between(rand, 0, 10)).toFixed(1)}s`);
    field.appendChild(el);
    flies.push(el);
  }
  return flies;
}

type SceneProps = {
  theme: string;
  /** The homepage: the stone pine, the grass rendered by the page (SunlitField), the About section rising out of it. */
  home: boolean;
};

export default function SunlitScene({ theme, home }: SceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const twinkleRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<HTMLCanvasElement>(null);
  const cloudRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const preset = presetFor(theme);

  useEffect(() => {
    const p = preset;
    const scene = sceneRef.current;
    const sky = skyRef.current;
    const rays = raysRef.current;
    const tree = home ? treeRef.current : null;
    // The field: on the homepage SunlitField renders it in <main> (same commit, so it is in the page
    // already); elsewhere it is rendered right after the scene.
    const field = document.querySelector<HTMLElement>('.sl-grass');
    const grass = field?.querySelector<HTMLCanvasElement>('.sl-grass-canvas');
    const flock = scene?.querySelector<HTMLElement>('.sl-birds');
    if (!scene || !sky || !rays || !field || !grass || !flock) return;
    const treeLayer = tree?.parentElement ?? null;
    const treeImg = home ? new Image() : null;
    if (treeImg) {
      treeImg.decoding = 'async';
      treeImg.src = TREE.src;
    }

    let drawnW = 0;
    let drawnH = 0;
    let planted: TreeFoot | null = null;
    let flies: HTMLElement[] = [];
    // The field, which carries the foot of the tree once the tree is drawn.
    const paintField = (w: number, h: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2);
      const full = Math.max(h, Math.round(field.getBoundingClientRect().height));
      if (p.ground === 'beach') {
        drawBeach(grass, w, h, full, dpr, p, horizonOf(sky, h), {
          surf: Array.from(field.querySelectorAll<HTMLCanvasElement>('.sl-surf')),
          glints: Array.from(field.querySelectorAll<HTMLCanvasElement>('.sl-glint')),
        });
      } else {
        drawGrass(grass, w, h, full, dpr, p, horizonOf(sky, h), planted);
      }
    };
    const draw = () => {
      const rect = scene.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (!w || !h || (w === drawnW && h === drawnH)) return;
      drawnW = w;
      drawnH = h;
      /* Resolution. The sky, rays and stars are soft paintings with grain, so
         they draw at one pixel per CSS pixel; only the grass and the tree need
         the screen's sharpness. On phones that keeps the scene to a few
         megabytes of graphics memory: iOS paints layers black when a page runs
         out of it, and the articles stack many layers over the scene. */
      const dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2);
      const soft = 1;
      drawSky(sky, w, h, soft, p);
      if ((p.night || p.stars) && starsRef.current && twinkleRef.current) {
        drawStars(starsRef.current, w, h, soft, false);
        drawStars(twinkleRef.current, w, h, soft, true);
      }
      drawRays(rays, w, h, soft, p);
      planted = tree && treeImg?.complete ? drawTree(tree, w, h, dpr, treeImg, nameBox(w, h)) : null;
      paintField(w, h);
      if (p.night) { flies.forEach((f) => f.remove()); flies = addFireflies(field, h); }

      const unit = Math.min(w, h * 1.15);
      const rand = seeded(5150);
      p.clouds.forEach((c, i) => {
        const el = cloudRefs.current[i];
        if (!el) return;
        const cw = c.w * unit * 1.4;
        const ch = c.h * unit * 2.6;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.left = `${c.x * w - cw / 2}px`;
        el.style.top = `${c.y * h - ch * 0.8}px`;
        el.style.opacity = String(Math.min(1, c.k * p.cloud.k));
        el.style.filter = `blur(${Math.max(2, c.h * unit * 0.07).toFixed(1)}px)`;
        paintCloud(el, cw, ch, rand, p.cloud);
      });
      scene.classList.add('is-drawn');
      field.classList.add('is-drawn');
    };
    draw();
    // The painting may arrive after the first draw, and the name moves a little once its font loads.
    const redrawTree = () => {
      if (!tree || !treeImg || !drawnW || !treeImg.complete) return;
      planted = drawTree(tree, drawnW, drawnH, Math.min(window.devicePixelRatio || 1, 2), treeImg, nameBox(drawnW, drawnH));
      paintField(drawnW, drawnH);
    };
    treeImg?.addEventListener('load', redrawTree);
    if (home) document.fonts?.ready.then(redrawTree);

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, 160);
    };
    window.addEventListener('resize', onResize);

    /* Scrolling, written at most once a frame:
       - On the homepage the About section rises out of the grass. Each
         .sl-emerge block is soft and faint while it is still near the crest
         and comes into focus as it clears it.
       - Then the field (and the tree) sink a little and dissolve into the
         haze, so the middle of the page sits in open sky.
       - Near the end the field comes back and rises until its crest is above
         the footer, so the footer stands in the grass on any screen. */
    const root = document.documentElement;
    const footer = document.querySelector<HTMLElement>('.footer');
    const rising = home ? Array.from(document.querySelectorAll<HTMLElement>('#about .sl-emerge')) : [];
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

      // The field stays solid while the first content comes up over it, then
      // drops away quickly; the tree leaves with it.
      const back = clamp01((y - (end - vh * 1.1)) / (vh * 0.9));
      const fade = (from: number, over: number) => {
        const t = Math.max(0, clamp01((y - vh * from) / (vh * over)) - back);
        return t * t * (3 - 2 * t);
      };
      const gone = fade(0.42, 0.3);
      const reach = footer ? Math.max(0, crest - (vh - footer.offsetHeight - 28)) : 0;
      const lift = calm ? (back > 0 ? reach : 0) : reach * back;
      field.style.opacity = gone >= 1 ? '0' : (1 - gone).toFixed(3);
      field.style.translate = `0 ${((calm ? 0 : gone * vh * 0.18) - lift).toFixed(1)}px`;
      if (treeLayer) {
        // the same fade as the field, which carries the foot of its trunk
        const treeGone = gone;
        treeLayer.style.opacity = treeGone >= 1 ? '0' : (1 - treeGone).toFixed(3);
        treeLayer.style.translate = calm ? '' : `0 ${(treeGone * vh * 0.04).toFixed(1)}px`;
      }

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

    /* The birds (day scenes): an animation loop that runs only while the top
       of the page or its end is on screen, the tab is visible and motion is
       allowed. The night scene has fireflies instead, all CSS. */
    const birds = p.night ? [] : [makeBird(), makeBird(), makeBird(), makeBird()];
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
      const q = (now - flight.start) / (flight.secs * 1000);
      if (q > 1) { flight = null; birds.forEach((b) => { b.svg.style.visibility = 'hidden'; }); nextFlight = now + between(Math.random, 9000, 20000); return; }
      const lead = flight.dir > 0 ? -40 + (w + 120) * q : w + 40 - (w + 120) * q;
      const size = Math.max(7, Math.min(11, w / 150));
      birds.forEach((b, i) => {
        if (i >= flight!.count) return;
        b.flap += 0.016 * b.rate;
        // flap for a while, then glide with wings held a little up
        const gliding = ((now / 1000 + i * 1.7) % 7) > 5;
        const lift = gliding ? 0.25 : Math.sin(b.flap);
        b.path.setAttribute('d', wings(lift));
        const x = lead - flight!.dir * b.ox;
        const yy = flight!.alt * h + b.oy + Math.sin(q * Math.PI * 3 + i) * 7;
        b.svg.style.transform = `translate3d(${x.toFixed(1)}px, ${yy.toFixed(1)}px, 0) scale(${(size / 20).toFixed(3)})`;
      });
    };

    const tick = (now: number) => {
      loop = 0;
      stepBirds(now);
      loop = requestAnimationFrame(tick);
    };
    const showing = new Set<Element>();
    const setMotion = () => {
      const on = showing.size > 0 && !document.hidden && !still.matches && birds.length > 0;
      root.classList.toggle('sl-alive', showing.size > 0);
      if (on && !loop) loop = requestAnimationFrame(tick);
      if (!on && loop) { cancelAnimationFrame(loop); loop = 0; }
    };

    // Motion runs only while the top of the page or its end is in view.
    const first = Array.from(document.querySelector('main')?.children ?? []).find((el) => !['STYLE', 'SCRIPT'].includes(el.tagName));
    const watched = (home ? ['.slp', '.hp-cta'].map((q) => document.querySelector(q)) : [first, footer])
      .filter(Boolean) as Element[];
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
      treeImg?.removeEventListener('load', redrawTree);
      birds.forEach((b) => b.svg.remove());
      flies.forEach((f) => f.remove());
      rising.forEach(settle);
      root.classList.remove('sl-alive');
    };
  }, [preset, home]);

  return (
    <>
      <div className="sl-scene" ref={sceneRef} aria-hidden="true">
        <div className="sl-sky" />
        <div className="sl-wash" />
        <canvas className="sl-sky-canvas" ref={skyRef} />
        {(preset.night || preset.stars) && <canvas className={`sl-stars${preset.stars ? ' is-faint' : ''}`} ref={starsRef} />}
        {(preset.night || preset.stars) && <canvas className={`sl-stars sl-twinkle${preset.stars ? ' is-faint' : ''}`} ref={twinkleRef} />}
        <div className="sl-clouds">
          {preset.clouds.map((c, i) => (
            <canvas
              key={i}
              className="sl-cloud"
              ref={(el) => { cloudRefs.current[i] = el; }}
              style={{ '--drift': `${c.drift}vw`, '--secs': `${c.secs}s`, '--delay': `${-c.secs * (i * 0.37 % 1)}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="sl-birds" />
        {home && (
          <div className="sl-tree">
            <canvas className="sl-tree-canvas" ref={treeRef} />
          </div>
        )}
        <canvas className="sl-rays" ref={raysRef} />
        <div className="sl-sun-bloom" />
      </div>
      {!home && <SunlitField beach={preset.ground === 'beach'} />}
    </>
  );
}
