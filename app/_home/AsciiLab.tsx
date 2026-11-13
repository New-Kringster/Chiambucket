'use client';
/* ────────────────────────────────────────────────────────────────
   The HomeLab as an ASCII video: each machine photo is sampled into a grid
   of characters by brightness and drawn on one canvas, one machine after
   another. A machine "decodes" in (characters settle from noise, top to
   bottom), holds with a slow scan line and a flicker in its brightest
   cells, then scrambles out to the next.

   It draws only while on screen and the tab is visible, at about 24 fps.
   Reduced motion shows the first machine, settled, and the caption list.
   ──────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from 'react';
import { MACHINES } from './content';

const RAMP = ' .:-=+*#%@';
const NOISE = '01<>/\\|[]{}#%&$@*+=-:.';
const HOLD = 3.4; // seconds a machine stays settled
const IN = 1.1;   // decode in
const OUT = 0.5;  // scramble out
const PERIOD = IN + HOLD + OUT;

type Grid = { cols: number; rows: number; lum: Float32Array };

export default function AsciiLab() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const cv = canvas.current!, box = host.current!;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let grids: Grid[] = [];
    let cols = 0, rows = 0, cw = 0, ch = 0, dpr = 1;
    let raf = 0, last = 0, t = 0, visible = false, dead = false, shown = -1;
    const imgs = MACHINES.map((m) => { const im = new Image(); im.src = m.img; return im; });

    // Sample every photo onto the same grid (contain-fit, centred).
    const sample = () => {
      const w = box.clientWidth, h = box.clientHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const cell = w < 560 ? 7 : 9; // character width in CSS px
      cw = cell; ch = cell * 1.55;
      cols = Math.floor(w / cw); rows = Math.floor(h / ch);
      const off = document.createElement('canvas');
      off.width = cols; off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      grids = imgs.map((im) => {
        o.fillStyle = '#000'; o.fillRect(0, 0, cols, rows);
        if (im.complete && im.naturalWidth) {
          // characters are taller than wide, so squash the picture to match
          const ar = (im.naturalWidth / im.naturalHeight) * (ch / cw);
          let dw = cols, dh = cols / ar;
          if (dh > rows) { dh = rows; dw = rows * ar; }
          o.drawImage(im, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        }
        const d = o.getImageData(0, 0, cols, rows).data;
        const lum = new Float32Array(cols * rows);
        let mx = 0.001;
        for (let i = 0; i < lum.length; i++) { const v = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255; lum[i] = v; if (v > mx) mx = v; }
        for (let i = 0; i < lum.length; i++) lum[i] = Math.pow(lum[i] / mx, 0.62); // stretch to the full ramp, lifting the shadows
        return { cols, rows, lum };
      });
    };

    const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

    const draw = () => {
      if (!grids.length) return;
      const k = Math.floor(t / PERIOD) % grids.length;
      const local = t % PERIOD;
      if (k !== shown) { shown = k; setCur(k); }
      const g = grids[k];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.font = `${Math.round(ch * 0.82)}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
      ctx.textBaseline = 'top';
      const scan = ((t * 0.18) % 1.3) - 0.15; // a soft line that sweeps down
      const frame = Math.floor(t * 24);
      for (let y = 0; y < g.rows; y++) {
        const yf = y / g.rows;
        // decode front: top rows settle first; scramble out all at once from the bottom
        const settleAt = yf * 0.75 * IN;
        const settled = reduced ? 1 : local < IN ? (local > settleAt ? 1 : 0) : local > IN + HOLD ? (hash(y, frame) < (local - IN - HOLD) / OUT ? 0 : 1) : 1;
        const sd = Math.abs(yf - scan);
        const glow = reduced ? 0 : Math.max(0, 1 - sd * 9);
        for (let x = 0; x < g.cols; x++) {
          const v = g.lum[y * g.cols + x];
          if (v < 0.09 && settled) continue;
          let c: string, a: number;
          if (!settled) {
            if (hash(x, y + frame) > 0.35) continue;
            c = NOISE[Math.floor(hash(x + frame, y) * NOISE.length)];
            a = 0.35;
          } else {
            let lv = v;
            // the brightest cells (LEDs, lit edges) flicker a little
            if (!reduced && v > 0.82 && hash(x, y + Math.floor(t * 6)) > 0.7) lv = Math.max(0.5, v - 0.35);
            c = RAMP[Math.min(RAMP.length - 1, Math.floor(lv * RAMP.length))];
            a = 0.42 + lv * 0.58;
          }
          // ENIG gold for the brightest, silkscreen white for the rest
          const gold = v > 0.72 || glow > 0.5;
          ctx.fillStyle = gold ? `rgba(217,181,107,${Math.min(1, a + glow * 0.3)})` : `rgba(241,239,232,${Math.min(1, a * 0.86 + glow * 0.25)})`;
          ctx.fillText(c, x * cw, y * ch);
        }
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (dead || !visible || document.hidden) return;
      if (now - last >= 1000 / 24) { t += Math.min(0.1, (now - last) / 1000); last = now; draw(); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    let loaded = 0;
    imgs.forEach((im) => { im.onload = () => { loaded++; if (loaded === imgs.length || loaded === 1) { sample(); draw(); } }; });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: '10% 0px' });
    io.observe(box);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => { sample(); draw(); });
    ro.observe(box);
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  return (
    <div className="hs-ascii" data-no-zoom>
      <div ref={host} className="hs-ascii-screen">
        <canvas ref={canvas} role="img" aria-label="The homelab machines drawn in text characters: the rack, NewMain, CaCa and Adell" />
      </div>
      <ol className="hs-ascii-caps" aria-label="Machines">
        {MACHINES.map((m, i) => (
          <li key={m.name} className={i === cur ? 'is-on' : ''}>
            <b>{m.name}</b><span>{m.line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
