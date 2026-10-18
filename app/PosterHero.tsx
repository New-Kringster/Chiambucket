'use client';
import { useEffect, useRef } from 'react';
import { Ballet, Inter_Tight } from 'next/font/google';
import './poster.css';

/*
  PosterHero — the homepage opening as a typographic poster over the sunlit
  field: "Braven" in a swash script crossing over "Chiam" in a heavy grotesk,
  one quiet line of context, and blurred grass in the foreground for depth.
  The name resolves from pixels once on load (an SVG pixelate filter stepped
  down over under a second); after that a slow sheen of light crosses "Chiam" while
  the hero is on screen. Styles: app/poster.css (.slp-*).
*/

const script = Ballet({ subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--font-script' });
const grotesk = Inter_Tight({ subsets: ['latin'], weight: ['800'], display: 'swap', variable: '--font-grotesk' });

type Rand = () => number;
function seeded(seed: number): Rand {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r: Rand, a: number, b: number) => a + r() * (b - a);

/* Out-of-focus grass close to the camera. Painted small and scaled up by CSS,
   which blurs it for free; `side` picks which corner the clump grows from. */
function paintForeground(canvas: HTMLCanvasElement, side: 'left' | 'right') {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = 0.22;
  const w = Math.max(1, Math.round(rect.width * scale));
  const h = Math.max(1, Math.round(rect.height * scale));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(side === 'left' ? 4242 : 9191);
  const dir = side === 'left' ? 1 : -1;
  const root = (x: number) => (side === 'left' ? x : w - x);

  const blade = (x: number, len: number, lean: number, width: number, color: string, alpha: number) => {
    const tipX = x + lean * len;
    const tipY = h - len;
    const ctrlX = x + lean * len * 0.25;
    const ctrlY = h - len * 0.62;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - width, h + 2);
    ctx.quadraticCurveTo(ctrlX - width * 0.6, ctrlY, tipX, tipY);
    ctx.quadraticCurveTo(ctrlX + width * 0.6, ctrlY, x + width, h + 2);
    ctx.closePath();
    ctx.fill();
  };

  // Back layer: tall, pale, sunlit blades.
  for (let i = 0; i < 26; i++) {
    const x = root(Math.pow(rand(), 1.6) * w * 0.95);
    blade(x, h * between(rand, 0.45, 1.05), dir * between(rand, 0.05, 0.42), w * between(rand, 0.012, 0.03),
      ['#e2cf7c', '#d6bf68', '#ecdd9c', '#c9b35c'][i % 4], between(rand, 0.55, 0.9));
  }
  // Front layer: darker, broader blades right at the corner.
  for (let i = 0; i < 16; i++) {
    const x = root(Math.pow(rand(), 2.2) * w * 0.7);
    blade(x, h * between(rand, 0.35, 0.85), dir * between(rand, -0.05, 0.35), w * between(rand, 0.02, 0.045),
      ['#8c853c', '#6f6723', '#5d5517', '#a19a55'][i % 4], between(rand, 0.6, 0.95));
  }
  // A few soft light spots, like sun caught in the out-of-focus blades.
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) {
    const x = root(rand() * w * 0.75);
    const y = h * between(rand, 0.25, 0.85);
    const r = w * between(rand, 0.025, 0.06);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255, 244, 200, 0.55)');
    g.addColorStop(1, 'rgba(255, 244, 200, 0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

export default function PosterHero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const floodRef = useRef<SVGFEFloodElement>(null);
  const tileRef = useRef<SVGFECompositeElement>(null);
  const growRef = useRef<SVGFEMorphologyElement>(null);

  // Foreground grass: paint once, and again if the viewport size changes.
  useEffect(() => {
    let drawnW = 0;
    const paint = () => {
      if (window.innerWidth === drawnW) return;
      drawnW = window.innerWidth;
      if (leftRef.current) paintForeground(leftRef.current, 'left');
      if (rightRef.current) paintForeground(rightRef.current, 'right');
    };
    paint();
    let t = 0;
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(paint, 200); };
    window.addEventListener('resize', onResize);
    return () => { window.clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  // The name resolves from large pixels to sharp type, once, after the fonts load.
  useEffect(() => {
    const name = nameRef.current;
    const flood = floodRef.current;
    const tile = tileRef.current;
    const grow = growRef.current;
    if (!name || !flood || !tile || !grow) return;
    const reveal = () => name.classList.add('is-in');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reveal(); return; }

    let raf = 0;
    let cancelled = false;
    const setBlock = (b: number) => {
      const half = Math.max(1, Math.floor(b / 2));
      flood.setAttribute('x', String(half - 1));
      flood.setAttribute('y', String(half - 1));
      tile.setAttribute('width', String(b));
      tile.setAttribute('height', String(b));
      grow.setAttribute('radius', String(half));
    };
    // Coarse blocks settle into sharp type in a few deliberate steps, the way a
    // low-resolution image loads, rather than a smooth (and muddy) shrink.
    const steps = [36, 24, 16, 10, 6, 3];
    const stepMs = 120;
    const run = () => {
      if (cancelled) return;
      const start = performance.now();
      setBlock(steps[0]);
      name.style.filter = 'url(#slp-pixelate)';
      reveal();
      const tick = (now: number) => {
        // rAF timestamps can be a little earlier than `start`, so clamp at the first step
        const i = Math.max(0, Math.floor((now - start) / stepMs));
        if (i >= steps.length) {
          name.style.filter = '';
          return;
        }
        setBlock(steps[i]);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    // Wait for the display fonts so the pixels resolve into the right letters.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    (fonts ? fonts.ready : Promise.resolve()).then(run);
    return () => { cancelled = true; cancelAnimationFrame(raf); name.style.filter = ''; };
  }, []);

  return (
    <header className={`hp-hero slp ${script.variable} ${grotesk.variable}`}>
      <svg className="slp-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="slp-pixelate" x="0" y="0" width="100%" height="100%">
          <feFlood ref={floodRef} x="21" y="21" width="2" height="2" />
          <feComposite ref={tileRef} width="44" height="44" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology ref={growRef} operator="dilate" radius="22" />
        </filter>
      </svg>

      <div className="slp-stage">
        <h1 className="slp-name" ref={nameRef} aria-label="Braven Chiam">
          <span className="slp-first" aria-hidden="true">Braven</span>
          <span className="slp-last" aria-hidden="true">Chiam</span>
        </h1>
        <p className="slp-role">Electronic and Computer Engineering, Nanyang Polytechnic</p>
      </div>

      <span className="slp-edge slp-edge-l" aria-hidden="true">Singapore</span>
      <span className="slp-edge slp-edge-r" aria-hidden="true">Portfolio</span>

      <div className="slp-fore" aria-hidden="true">
        <canvas ref={leftRef} className="slp-fore-l" />
        <canvas ref={rightRef} className="slp-fore-r" />
      </div>
    </header>
  );
}
