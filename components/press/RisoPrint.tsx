'use client';
import { useEffect, useRef, useState } from 'react';

/*
  RisoPrint — renders a photo as a risograph print, in code.

  The photo is separated into spot inks (riso yellow, fluorescent pink and
  blue). Each ink is screened as an AM halftone at its own angle and painted
  per pixel, so the dots are anti-aliased and fine enough for the picture to
  read. Inks multiply where they overlap (pink over blue prints ultramarine)
  and sit a fraction of a pixel out of register.

  Two ways to print:
  - composite (default): all inks on one canvas. Cheap; used for galleries.
  - layered: one canvas per ink, stacked with mix-blend-mode: multiply, so
    each drum can animate on its own (the hero's "next plate" pull) and drift
    with the pointer via --mx / --my (-1..1) set on any ancestor.
*/

type InkName = 'yellow' | 'pink' | 'blue';

const INKS: Record<InkName, { rgb: readonly [number, number, number]; angle: number; ox: number; oy: number; k: number }> = {
  // angle: screen angle (deg); ox/oy: resting misregistration (CSS px); k: pointer drift (px)
  yellow: { rgb: [255, 232, 0], angle: 0, ox: 0.6, oy: -0.4, k: 2.6 },
  pink: { rgb: [255, 72, 176], angle: 75, ox: -0.7, oy: 0.45, k: -2 },
  blue: { rgb: [0, 120, 191], angle: 15, ox: 0.15, oy: 0.25, k: 1 },
};

export type Separation = 'cmy' | 'duo';

const PASSES: Record<Separation, InkName[]> = {
  cmy: ['yellow', 'pink', 'blue'],
  duo: ['pink', 'blue'],
};

/* The sheet the ink lands on (matches --pr-sheet). */
const SHEET: readonly [number, number, number] = [250, 248, 242];

/* A printed tint that deepens toward the bottom of the sheet, so type can be
   knocked out of it. `from` is where it starts (0 top, 1 bottom). */
export interface Flood { from: number; blue?: number; pink?: number; yellow?: number }

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* Ink coverage (0..1) for one pixel of the source photo. */
function coverage(mode: Separation, ink: InkName, r: number, g: number, b: number): number {
  if (mode === 'cmy') {
    const mean = (r + g + b) / 3;
    r = clamp01(mean + (r - mean) * 1.15);
    g = clamp01(mean + (g - mean) * 1.15);
    b = clamp01(mean + (b - mean) * 1.15);
    // No black drum, so the three inks share the greys between them.
    const c = 1 - r, m = 1 - g, y = 1 - b;
    const k = Math.min(c, m, y);
    const tone = (v: number, cap: number) => cap * Math.pow(clamp01((v - 0.04) / 0.96), 1.1);
    if (ink === 'blue') return tone(c, 0.9);
    if (ink === 'pink') return tone(m, 0.86);
    // Mid greys keep all three inks (a warm neutral). Only deep shadows drop
    // the yellow, so they print ultramarine instead of a muddy green-black.
    return tone(y - k * 0.75 * smooth(0.45, 0.95, k), 0.82);
  }
  const dark = 1 - (0.3 * r + 0.59 * g + 0.11 * b);
  if (ink === 'blue') return smooth(0.1, 0.95, dark);
  const warm = clamp01((r - b) * 1.5 + (r - g) * 0.5);
  return clamp01(smooth(0.05, 0.8, dark) * 0.5 + warm * 0.5);
}

/* Deterministic hash and value noise (ink mottling, dot jitter, dropout). */
function hash2(x: number, y: number, s: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x: number, y: number, s: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

interface Opts {
  mode: Separation;
  cell: number; // halftone cell, CSS px
  lift: number; // >1 lightens mid-tones first (for dark photos)
  focus: readonly [number, number];
  flood?: Flood;
  seed: number;
}

interface Sep { maps: Partial<Record<InkName, Float32Array>>; sw: number; sh: number; step: number }

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/* Cover-crops the photo around `focus`, samples it (dots read their centre,
   so a bit more than one sample per cell is plenty), and turns it into one
   coverage map per ink with mottling and flood applied. Yields like paint(). */
async function separate(img: HTMLImageElement, w: number, h: number, o: Opts, alive: () => boolean): Promise<Sep | null> {
  const step = o.cell * 0.7;
  const sw = Math.max(2, Math.ceil(w / step));
  const sh = Math.max(2, Math.ceil(h / step));
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const ir = img.naturalWidth / img.naturalHeight, br = w / h;
  let sx = 0, sy = 0, sW = img.naturalWidth, sH = img.naturalHeight;
  if (ir > br) { sW = img.naturalHeight * br; sx = (img.naturalWidth - sW) * o.focus[0]; }
  else { sH = img.naturalWidth / br; sy = (img.naturalHeight - sH) * o.focus[1]; }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sW, sH, 0, 0, sw, sh);
  const data = ctx.getImageData(0, 0, sw, sh).data;

  const lut = new Float32Array(256);
  for (let v = 0; v < 256; v++) lut[v] = Math.pow(v / 255, 1 / o.lift);

  const maps: Sep['maps'] = {};
  let t0 = performance.now();
  for (const ink of PASSES[o.mode]) {
    const m = new Float32Array(sw * sh);
    const flood = o.flood?.[ink] ?? 0;
    for (let j = 0; j < sh; j++) {
      if ((j & 7) === 0 && performance.now() - t0 > 12) {
        await nextFrame();
        if (!alive()) return null;
        t0 = performance.now();
      }
      const yc = (j + 0.5) * step;
      const fl = flood ? flood * Math.pow(smooth(o.flood!.from, 1, yc / h), 1.15) : 0;
      for (let i = 0; i < sw; i++) {
        const k = (j * sw + i) * 4;
        let cov = coverage(o.mode, ink, lut[data[k]], lut[data[k + 1]], lut[data[k + 2]]);
        // uneven drum: slow, faint blotches of lighter ink
        cov *= 0.9 + 0.1 * vnoise((i + 0.5) * step * 0.012 + 3.1, yc * 0.014, o.seed + ink.length);
        if (fl) cov = 1 - (1 - cov) * (1 - fl);
        m[j * sw + i] = cov;
      }
    }
    maps[ink] = m;
  }
  return { maps, sw, sh, step };
}

/* Dot radius (in cells) for a coverage, with a little extra past 50% so
   solid areas close up fully. */
const RADIUS = (() => {
  const t = new Float32Array(257);
  for (let i = 0; i <= 256; i++) { const c = i / 256; t[i] = 0.564 * Math.sqrt(c) * (1 + 0.28 * c * c); }
  return t;
})();

/* Paints `inks` into `canvas`, one pixel at a time. `base` is the paper the
   first ink lands on (white for layers that multiply over another). Yields to
   the browser every ~12ms so a big print never blocks input. */
async function paint(
  canvas: HTMLCanvasElement, inks: InkName[], sep: Sep, w: number, h: number, dpr: number,
  o: Opts, seed: number, withOffsets: boolean, base: readonly [number, number, number], alive: () => boolean,
) {
  const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
  const out = new ImageData(W, H);
  const d = out.data;
  const cellPx = o.cell * dpr, inv = 1 / cellPx;
  const toSample = 1 / (sep.step * dpr);
  const { sw, sh } = sep;
  const n = inks.length;
  const CA = new Float64Array(n), SA = new Float64Array(n), OX = new Float64Array(n), OY = new Float64Array(n);
  const KR = new Float64Array(n), KG = new Float64Array(n), KB = new Float64Array(n), S = new Int32Array(n);
  const M = inks.map((ink) => sep.maps[ink]!);
  inks.forEach((ink, q) => {
    const a = (INKS[ink].angle * Math.PI) / 180;
    CA[q] = Math.cos(a); SA[q] = Math.sin(a);
    OX[q] = withOffsets ? INKS[ink].ox * dpr : 0;
    OY[q] = withOffsets ? INKS[ink].oy * dpr : 0;
    KR[q] = 1 - INKS[ink].rgb[0] / 255; KG[q] = 1 - INKS[ink].rgb[1] / 255; KB[q] = 1 - INKS[ink].rgb[2] / 255;
    S[q] = seed * 131 + q * 17;
  });

  let t0 = performance.now();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let R = base[0], G = base[1], B = base[2];
      const grain = hash2(x, y, seed);
      for (let q = 0; q < n; q++) {
        const px = x - OX[q], py = y - OY[q];
        const u = (px * CA[q] + py * SA[q]) * inv, v = (py * CA[q] - px * SA[q]) * inv;
        const iu = Math.round(u), iv = Math.round(v);
        // coverage is read at the dot's centre, so every dot stays a clean disc
        const cx = (iu * CA[q] - iv * SA[q]) * cellPx + OX[q];
        const cy = (iu * SA[q] + iv * CA[q]) * cellPx + OY[q];
        let si = (cx * toSample) | 0, sj = (cy * toSample) | 0;
        if (si < 0) si = 0; else if (si >= sw) si = sw - 1;
        if (sj < 0) sj = 0; else if (sj >= sh) sj = sh - 1;
        const cov = M[q][sj * sw + si];
        if (cov < 0.012) continue;
        const du = u - iu, dv = v - iv;
        const rad = RADIUS[(cov * 256) | 0] * (0.95 + 0.1 * hash2(iu, iv, S[q]));
        let a = (rad - Math.sqrt(du * du + dv * dv)) * cellPx + 0.5; // ~1px anti-aliased edge
        if (a <= 0) continue;
        if (a > 1) a = 1;
        // ink that didn't take: rare flecks, plus a faint grain
        a *= grain < 0.012 ? 0.3 : 0.94 + 0.06 * ((grain * 977) % 1);
        R *= 1 - a * KR[q]; G *= 1 - a * KG[q]; B *= 1 - a * KB[q];
      }
      const p = (y * W + x) * 4;
      d[p] = R; d[p + 1] = G; d[p + 2] = B; d[p + 3] = 255;
    }
    if ((y & 15) === 0 && performance.now() - t0 > 12) {
      await nextFrame();
      if (!alive()) return false;
      t0 = performance.now();
    }
  }
  canvas.width = W; canvas.height = H;
  canvas.getContext('2d')!.putImageData(out, 0, 0);
  return true;
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Big prints paint at up to 1.5x density; small ones at up to 2x. */
const densityFor = (w: number, h: number) => Math.min(window.devicePixelRatio || 1, w * h > 400_000 ? 1.5 : 2);

async function printSheet(img: HTMLImageElement, w: number, h: number, o: Opts, layered: boolean, printNo: number, alive: () => boolean) {
  const dpr = densityFor(w, h);
  const sep = await separate(img, w, h, o, alive);
  if (!sep) return null;
  const sheet = document.createElement('div');
  sheet.className = `pr-riso-sheet is-pending${layered ? ' is-layered' : ''}`;
  const inks = PASSES[o.mode];
  if (layered) {
    for (let i = 0; i < inks.length; i++) {
      const ink = inks[i];
      const layer = document.createElement('div');
      layer.className = `pr-riso-ink pr-riso-${ink}`;
      const { ox, oy, k } = INKS[ink];
      layer.style.cssText = `--ox:${ox}px;--oy:${oy}px;--k:${k};--i:${i}`;
      const canvas = document.createElement('canvas');
      const ok = await paint(canvas, [ink], sep, w, h, dpr, o, printNo * 7 + i, false, i === 0 ? SHEET : [255, 255, 255], alive);
      if (!ok) return null;
      layer.appendChild(canvas);
      sheet.appendChild(layer);
    }
  } else {
    const canvas = document.createElement('canvas');
    const ok = await paint(canvas, inks, sep, w, h, dpr, o, printNo * 7, true, SHEET, alive);
    if (!ok) return null;
    sheet.appendChild(canvas);
  }
  return sheet;
}

interface Props {
  src: string;
  alt: string;
  mode?: Separation;
  cell?: number;
  cellSmall?: number; // halftone cell on phone-width screens
  lift?: number;
  focus?: readonly [number, number];
  flood?: Flood;
  seed?: number;
  layered?: boolean;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function RisoPrint({
  src, alt, mode = 'cmy', cell = 3, cellSmall, lift = 1, focus = [0.5, 0.5], flood, seed = 1,
  layered = false, eager = false, className = '', style,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [inked, setInked] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const printNo = useRef(0);
  const run = useRef(0); // bumps on every new print so stale paints stop
  const opts = (): Opts => ({
    mode, lift, focus, flood, seed,
    cell: cellSmall && window.innerWidth < 720 ? cellSmall : cell,
  });
  const optsRef = useRef(opts);
  optsRef.current = opts;

  // Pull a print whenever the source changes (once the box is near view).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let io: IntersectionObserver | null = null;
    const id = ++run.current;
    const alive = () => run.current === id;

    const pull = async () => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      try { await img.decode(); } catch { /* fall through to size check */ }
      if (!alive() || !img.naturalWidth) return;
      const { width, height } = box.getBoundingClientRect();
      if (width < 4 || height < 4) return;
      imgRef.current = img;
      printNo.current += 1;
      const sheet = await printSheet(img, width, height, optsRef.current(), layered, printNo.current, alive);
      if (!sheet || !alive()) return;
      const old = Array.from(box.querySelectorAll('.pr-riso-sheet'));
      box.appendChild(sheet);
      const still = reducedMotion();
      requestAnimationFrame(() => {
        sheet.classList.remove('is-pending');
        sheet.classList.add(still ? 'is-static' : 'is-printing');
        old.forEach((s) => {
          s.classList.add('is-leaving');
          window.setTimeout(() => s.remove(), still ? 0 : 900);
        });
        setInked(true);
      });
    };

    if (eager) void pull();
    else {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io?.disconnect(); void pull(); }
      }, { rootMargin: '400px 0px' });
      io.observe(box);
    }
    return () => { io?.disconnect(); run.current++; };
  }, [src, eager, layered]);

  // Reprint the current photo (without the pull) when the box changes size.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let t: number | undefined;
    let lastW = box.clientWidth, lastH = box.clientHeight;
    const ro = new ResizeObserver(() => {
      const w = box.clientWidth, h = box.clientHeight;
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w; lastH = h;
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        const img = imgRef.current;
        if (!img) return;
        const id = ++run.current;
        const { width, height } = box.getBoundingClientRect();
        const sheet = await printSheet(img, width, height, optsRef.current(), layered, printNo.current, () => run.current === id);
        if (!sheet || run.current !== id) return;
        sheet.classList.remove('is-pending');
        sheet.classList.add('is-static');
        box.querySelectorAll('.pr-riso-sheet').forEach((s) => s.remove());
        box.appendChild(sheet);
      }, 220);
    });
    ro.observe(box);
    return () => { ro.disconnect(); window.clearTimeout(t); };
  }, [layered]);

  return (
    <div
      ref={boxRef}
      className={`pr-riso${inked ? ' is-inked' : ''} ${className}`}
      style={style}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {/* A faint proof shows until the ink is down (and for anyone without JS). */}
      <img className="pr-riso-proof" src={src} alt="" aria-hidden="true" loading={eager ? 'eager' : 'lazy'}
        decoding="async" style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }} />
    </div>
  );
}
