'use client';
/* ────────────────────────────────────────────────────────────────
   The HomeLab chapter's background: the site's cloud-and-N mark
   (public/images/dither2.webp) drawn as ASCII on one canvas behind the copy.

   The mark is sampled into a character grid by brightness (softened first, so
   its dotted outline becomes continuous strokes). The motion is quiet: a soft
   band of light drifts across the cloud, the characters under it brighten
   and step up the ramp, and a sparse field of dim dots breathes around it.

   It draws only while on screen and the tab is visible, at about 20 fps.
   Reduced motion draws one still frame.
   ──────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from 'react';

const RAMP = ' .:-=+*#%@';
const SRC = '/images/dither2.webp';

export default function AsciiLab() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!, box = host.current!;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lum = new Float32Array(0);
    let cols = 0, rows = 0, cw = 0, ch = 0, dpr = 1, ox = 0;
    let raf = 0, last = 0, t = 0, visible = false, dead = false;
    const img = new Image();
    img.src = SRC;

    const sample = () => {
      if (!img.complete || !img.naturalWidth) return;
      const w = box.clientWidth, h = box.clientHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cw = w < 700 ? 8 : 10; ch = cw * 1.6;
      cols = Math.floor(w / cw); rows = Math.floor(h / ch);
      // the mark fills most of the height; on wide screens it sits to the right of the copy
      const markRows = Math.min(rows * 0.92, (cols * (cw / ch)) * 0.95);
      const markCols = markRows * (ch / cw);
      ox = w < 900 ? Math.round((cols - markCols) / 2) : Math.round(cols - markCols - cols * 0.04);
      const oy = Math.round((rows - markRows) / 2);
      const off = document.createElement('canvas');
      off.width = cols; off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.fillStyle = '#000'; o.fillRect(0, 0, cols, rows);
      // soften the dotted outline into strokes before sampling
      o.filter = `blur(${Math.max(0.6, markCols / 260).toFixed(2)}px)`;
      o.drawImage(img, ox, oy, markCols, markRows);
      o.filter = 'none';
      const d = o.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      let mx = 0.001;
      for (let i = 0; i < lum.length; i++) { const v = (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 765; lum[i] = v; if (v > mx) mx = v; }
      for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.pow(lum[i] / mx, 0.55) * 1.15);
    };

    const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

    const draw = () => {
      if (!lum.length) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.font = `${Math.round(ch * 0.8)}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
      ctx.textBaseline = 'top';
      // a soft diagonal band of light that drifts across, once every ~9 s
      const band = ((t / 9) % 1) * 1.6 - 0.3;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = lum[y * cols + x];
          const u = (x / cols) * 0.75 + (y / rows) * 0.25;
          const glow = reduced ? 0 : Math.exp(-Math.pow((u - band) / 0.09, 2));
          if (v < 0.12) {
            // the field around the mark: a few dim dots that slowly breathe
            const hsh = hash(x, y);
            if (hsh > 0.985) {
              const a = 0.06 + 0.06 * Math.sin(t * 0.8 + hsh * 60) + glow * 0.08;
              ctx.fillStyle = `rgba(241,239,232,${a.toFixed(3)})`;
              ctx.fillText('.', x * cw, y * ch);
            }
            continue;
          }
          const lv = Math.min(1, v * (0.78 + glow * 0.5));
          const c = RAMP[Math.min(RAMP.length - 1, Math.floor(lv * (RAMP.length - 0.01)))];
          const a = Math.min(1, 0.22 + lv * 0.55 + glow * 0.35);
          ctx.fillStyle = glow > 0.35 ? `rgba(240,212,150,${a.toFixed(3)})` : `rgba(217,181,107,${(a * 0.9).toFixed(3)})`;
          ctx.fillText(c, x * cw, y * ch);
        }
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (dead || !visible || document.hidden) return;
      if (now - last >= 50) { t += Math.min(0.1, (now - last) / 1000); last = now; draw(); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    img.onload = () => { sample(); draw(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: '10% 0px' });
    io.observe(box);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => { sample(); draw(); });
    ro.observe(box);
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  return (
    <div ref={host} className="hs-ascii" aria-hidden="true" data-no-zoom>
      <canvas ref={canvas} />
    </div>
  );
}
