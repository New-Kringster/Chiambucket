'use client';
import { useEffect, useRef, useState } from 'react';

/*
  RisoPrint — renders a photo as a risograph print, in code.

  The image is separated into spot-ink layers (riso yellow, fluorescent pink,
  blue). Each layer is an AM halftone on its own canvas, screened at its own
  angle, with ink dropout and uneven coverage like a real drum. Layers stack
  with mix-blend-mode: multiply, so overlaps mix the way ink does (pink over
  blue prints ultramarine), and each layer sits slightly out of register.

  Changing `src` pulls a new print: the ink passes wipe in one drum at a time
  while the previous sheet fades. Pointer parallax is driven from outside by
  setting --mx / --my (-1..1) on any ancestor.
*/

type RGB = readonly [number, number, number];
type InkName = 'yellow' | 'pink' | 'blue';

const INKS: Record<InkName, { rgb: RGB; angle: number; ox: number; oy: number; k: number }> = {
  // angle: screen angle in degrees; ox/oy: resting misregistration (px); k: parallax strength
  yellow: { rgb: [255, 232, 0], angle: 0, ox: 1.6, oy: -1.2, k: 7 },
  pink: { rgb: [255, 72, 176], angle: 75, ox: -1.8, oy: 1.1, k: -5 },
  blue: { rgb: [0, 120, 191], angle: 15, ox: 0.4, oy: 0.6, k: 2.5 },
};

export type Separation = 'cmy' | 'duo';

/* Which inks a separation prints, in drum order (lightest first). */
const PASSES: Record<Separation, InkName[]> = {
  cmy: ['yellow', 'pink', 'blue'],
  duo: ['pink', 'blue'],
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* Ink coverage (0..1) for one pixel. */
function coverage(mode: Separation, ink: InkName, r: number, g: number, b: number): number {
  if (mode === 'cmy') {
    // Push saturation a little first: riso colour is bold, not photographic.
    const mean = (r + g + b) / 3;
    r = clamp01(mean + (r - mean) * 1.35);
    g = clamp01(mean + (g - mean) * 1.35);
    b = clamp01(mean + (b - mean) * 1.35);
    // Subtractive separation with no black drum. The grey component is kept
    // out of the yellow drum, so shadows print as blue over pink (a deep
    // ultramarine) instead of all three inks stacking into muddy green.
    const c = 1 - r, m = 1 - g, y = 1 - b;
    const k = Math.min(c, m, y);
    const tone = (v: number, cap: number) => cap * Math.pow(clamp01((v - 0.05) / 0.95), 1.15);
    if (ink === 'blue') return tone(c, 0.94);
    if (ink === 'pink') return tone(m, 0.86);
    return tone(y - k * 0.72, 0.9);
  }
  // duo: blue carries the tones, pink warms the mids and the reds
  const lum = 0.3 * r + 0.59 * g + 0.11 * b;
  const dark = 1 - lum;
  if (ink === 'blue') return smooth(0.12, 0.92, dark);
  const warm = clamp01((r - b) * 1.5 + (r - g) * 0.5);
  return clamp01(smooth(0.05, 0.75, dark) * 0.55 + warm * 0.55);
}

/* Small deterministic hash + value noise for ragged edges and ink mottling. */
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
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

interface DrawOpts {
  mode: Separation;
  cell: number; // halftone cell, CSS px
  lift: number; // >1 lightens mid-tones before separating (for dark photos)
  focus: readonly [number, number];
  ragged: number; // how far the ink edge wanders inwards, CSS px
  seed: number;
}

/* Samples the image (cover-cropped around `focus`) at two samples per cell. */
function sampleImage(img: HTMLImageElement, w: number, h: number, o: DrawOpts) {
  const step = o.cell / 2;
  const sw = Math.max(2, Math.ceil(w / step));
  const sh = Math.max(2, Math.ceil(h / step));
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const ir = img.naturalWidth / img.naturalHeight;
  const br = w / h;
  let sx = 0, sy = 0, sWid = img.naturalWidth, sHei = img.naturalHeight;
  if (ir > br) { sWid = img.naturalHeight * br; sx = (img.naturalWidth - sWid) * o.focus[0]; }
  else { sHei = img.naturalWidth / br; sy = (img.naturalHeight - sHei) * o.focus[1]; }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sWid, sHei, 0, 0, sw, sh);
  return { data: ctx.getImageData(0, 0, sw, sh).data, sw, sh, step };
}

function drawInk(
  canvas: HTMLCanvasElement, ink: InkName, w: number, h: number, dpr: number,
  sample: ReturnType<typeof sampleImage>, o: DrawOpts, seedOffset: number,
) {
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const { rgb, angle } = INKS[ink];
  const { data, sw, sh, step } = sample;
  const seed = o.seed + seedOffset;
  const rand = rng(seed * 9973 + 17);

  // tone lookup: 8-bit channel -> lifted 0..1
  const lut = new Float32Array(256);
  for (let v = 0; v < 256; v++) lut[v] = Math.pow(v / 255, 1 / o.lift);

  const cell = o.cell * dpr;
  const a = (angle * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  const cx = W / 2, cy = H / 2;
  const n = Math.ceil(Math.hypot(W, H) / 2 / cell) + 1;

  ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  ctx.beginPath();
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = cx + i * cell * ca - j * cell * sa;
      const y = cy + i * cell * sa + j * cell * ca;
      if (x < -cell || y < -cell || x > W + cell || y > H + cell) continue;
      const xc = x / dpr, yc = y / dpr; // CSS px
      const px = Math.min(sw - 1, Math.max(0, Math.floor(xc / step)));
      const py = Math.min(sh - 1, Math.max(0, Math.floor(yc / step)));
      const k = (py * sw + px) * 4;
      let cov = coverage(o.mode, ink, lut[data[k]], lut[data[k + 1]], lut[data[k + 2]]);
      if (cov < 0.03) continue;
      // Ragged edge: the ink boundary wanders inwards by up to `ragged` px.
      const edge = Math.min(xc, yc, w - xc, h - yc);
      const wander = vnoise(xc * 0.045, yc * 0.045, seed) * o.ragged;
      cov *= smooth(0, 3, edge - wander);
      // Uneven drum coverage: slow blotches of lighter ink.
      cov *= 0.86 + 0.14 * vnoise(xc * 0.011 + 3.1, yc * 0.013, seed + 5);
      if (cov < 0.03) continue;
      const r = cell * 0.564 * Math.sqrt(cov) * (1 + 0.28 * cov * cov) * (0.93 + rand() * 0.14);
      if (r < 0.5 * dpr) continue;
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  ctx.fill();

  // Ink dropout: tiny flecks where the ink didn't take.
  ctx.globalCompositeOperation = 'destination-out';
  const flecks = Math.round((W * H) / (70 * dpr * dpr));
  for (let f = 0; f < flecks; f++) {
    const s = (0.5 + rand() * 1.2) * dpr;
    ctx.globalAlpha = 0.25 + rand() * 0.65;
    ctx.fillRect(rand() * W, rand() * H, s, s);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

function buildSheet(img: HTMLImageElement, w: number, h: number, o: DrawOpts, printNo: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const sample = sampleImage(img, w, h, o);
  const sheet = document.createElement('div');
  sheet.className = 'pr-riso-sheet is-pending';
  PASSES[o.mode].forEach((ink, i) => {
    const layer = document.createElement('div');
    layer.className = `pr-riso-ink pr-riso-${ink}`;
    const { ox, oy, k } = INKS[ink];
    layer.style.cssText = `--ox:${ox}px;--oy:${oy}px;--k:${k};--i:${i}`;
    const canvas = document.createElement('canvas');
    drawInk(canvas, ink, w, h, dpr, sample, o, printNo * 31 + i);
    layer.appendChild(canvas);
    sheet.appendChild(layer);
  });
  return sheet;
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Props {
  src: string;
  alt: string;
  mode?: Separation;
  cell?: number;
  cellSmall?: number; // halftone cell on phone-width screens
  lift?: number;
  focus?: readonly [number, number];
  ragged?: number;
  seed?: number;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onPrinted?: () => void;
}

export default function RisoPrint({
  src, alt, mode = 'cmy', cell = 5, cellSmall, lift = 1, focus = [0.5, 0.5], ragged = 6, seed = 1,
  eager = false, className = '', style, onPrinted,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [inked, setInked] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const printNo = useRef(0);
  const pickCell = () => (cellSmall && typeof window !== 'undefined' && window.innerWidth < 720 ? cellSmall : cell);
  const optsRef = useRef<DrawOpts>({ mode, cell, lift, focus, ragged, seed });
  optsRef.current = { mode, cell: pickCell(), lift, focus, ragged, seed };
  const onPrintedRef = useRef(onPrinted);
  onPrintedRef.current = onPrinted;

  // Pull a print whenever the source changes (and the box is near the viewport).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const pull = () => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.decode().catch(() => undefined).then(() => {
        if (cancelled || !img.naturalWidth) return;
        const { width, height } = box.getBoundingClientRect();
        if (width < 4 || height < 4) return;
        imgRef.current = img;
        printNo.current += 1;
        const sheet = buildSheet(img, width, height, optsRef.current, printNo.current);
        const old = Array.from(box.querySelectorAll('.pr-riso-sheet'));
        box.appendChild(sheet);
        const still = reducedMotion();
        requestAnimationFrame(() => {
          sheet.classList.remove('is-pending');
          sheet.classList.add(still ? 'is-static' : 'is-printing');
          old.forEach((s) => {
            s.classList.add('is-leaving');
            window.setTimeout(() => s.remove(), still ? 0 : 700);
          });
          setInked(true);
          onPrintedRef.current?.();
        });
      });
    };

    if (eager) pull();
    else {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io?.disconnect(); pull(); }
      }, { rootMargin: '300px 0px' });
      io.observe(box);
    }
    return () => { cancelled = true; io?.disconnect(); };
  }, [src, eager]);

  // Redraw the current print (without the print animation) when the box resizes.
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
      t = window.setTimeout(() => {
        const img = imgRef.current;
        if (!img) return;
        const { width, height } = box.getBoundingClientRect();
        const sheet = buildSheet(img, width, height, optsRef.current, printNo.current);
        sheet.classList.remove('is-pending');
        sheet.classList.add('is-static');
        box.querySelectorAll('.pr-riso-sheet').forEach((s) => s.remove());
        box.appendChild(sheet);
      }, 180);
    });
    ro.observe(box);
    return () => { ro.disconnect(); window.clearTimeout(t); };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`pr-riso${inked ? ' is-inked' : ''} ${className}`}
      style={style}
      role="img"
      aria-label={alt}
    >
      {/* Shown until the ink is down, and for anyone without JS. */}
      <img className="pr-riso-proof" src={src} alt="" aria-hidden="true" loading={eager ? 'eager' : 'lazy'}
        style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }} />
    </div>
  );
}
