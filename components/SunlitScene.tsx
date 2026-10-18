'use client';
import { useEffect, useRef } from 'react';

/*
  SunlitScene — the homepage background for the "sunlit" theme, painted like a
  pastel poster: a sage sky with soft pastel washes and brush strokes, the sun
  in the top-right corner with faint rays, drifting clouds, and a field of
  grass along the bottom of the screen.

  Each part is its own layer so it can move on the compositor alone: clouds
  drift, the rays shimmer, the sun's glow breathes and the field sways. All of
  it is painted once from a fixed seed (again only on resize) and animated by
  CSS transforms and opacity. Motion runs only while html.sl-alive is set,
  which this component does while the hero or the closing section is on
  screen, so the glass cards over the rest of the page are not re-blurred on
  every frame. Styles live in app/sunlit.css (.sl-*).
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
  { x: 0.5, y: 0.715, w: 0.95, h: 0.04, k: 0.34, drift: 2.5, secs: 120 },
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
  const raysRef = useRef<HTMLCanvasElement>(null);
  const grassRef = useRef<HTMLCanvasElement>(null);
  const cloudRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    const sky = skyRef.current;
    const rays = raysRef.current;
    const grass = grassRef.current;
    if (!scene || !sky || !rays || !grass) return;

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
      drawGrass(grass, w, h, dpr);

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
    };
    draw();

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, 160);
    };
    window.addEventListener('resize', onResize);

    // Motion runs only while the poster hero or the closing section is in view.
    const root = document.documentElement;
    const watched = ['.slp', '.hp-cta'].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
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
      io.disconnect();
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
      <canvas className="sl-rays" ref={raysRef} />
      <div className="sl-sun-bloom" />
      <div className="sl-grass">
        <canvas className="sl-grass-canvas" ref={grassRef} />
      </div>
    </div>
  );
}
