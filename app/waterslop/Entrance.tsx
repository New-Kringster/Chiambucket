'use client';
import { useEffect, useRef, type CSSProperties } from 'react';

/* The OCR Reader's entrance. A water meter's drum window draws itself in
   hairlines (the dial's rim, the window, the dividers between drums), the
   title rolls onto the drums the way a meter's odometer settles, the last two
   drums red like a meter's decimals, and then the whole plate breaks up in the
   bright dissolve to show the article.

   It plays once per tab session, on a full load or a client navigation. Any
   click, key or wheel skips to the dissolve. Reduced motion, or a second visit
   in the same session, never shows it. The inline script hides it before first
   paint in those cases; a CSS timeout removes it if scripts never run. */

const WORD = 'OCR READER';
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SKIP = 'ws-intro-seen';

/* A fixed, seeded run of glyphs for each drum, ending on its letter, so the
   server and the client render the same reels. */
function reel(ch: string, k: number) {
  let s = 977 + k * 131;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const n = 9 + k;
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(GLYPHS[Math.floor(rnd() * GLYPHS.length)]);
  out.push(ch === ' ' ? ' ' : ch);
  return out;
}

export default function Entrance() {
  const root = useRef<HTMLDivElement>(null);
  const glHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, host = glHost.current;
    if (!el || !host) return;
    const html = document.documentElement;
    let seen = false;
    try { seen = sessionStorage.getItem(SKIP) === '1'; } catch { /* private mode */ }
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('gone'); return; }

    html.dataset.intro = '1';
    el.classList.add('run');
    let alive = true, raf = 0, timer = 0, leaving = false;
    let fx: import('../../components/dissolve').Dissolve | null = null;
    let cv: HTMLCanvasElement | null = null;

    const stop = () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      fx?.destroy(); fx = null;
      cv?.remove(); cv = null;
      delete html.dataset.intro;
    };
    const finish = () => {
      if (!alive) return;
      stop();
      el.classList.add('gone');
      try { sessionStorage.setItem(SKIP, '1'); } catch { /* ignore */ }
      window.dispatchEvent(new Event('ws-intro-done'));
    };

    const leave = () => {
      if (leaving || !alive) return;
      leaving = true;
      el.classList.add('leave');
      if (!fx) { el.classList.add('fade'); timer = window.setTimeout(finish, 650); return; }
      const t0 = performance.now(), dur = 1300;
      const tick = () => {
        if (!alive || !fx) return;
        const k = Math.min(1, (performance.now() - t0) / dur);
        const e = 1 - Math.pow(1 - k, 2.2);
        fx.draw({ inP: 1, outP: e, time: (performance.now() - t0) / 1000, focus: [0.5, 0.52] });
        if (k < 1) raf = requestAnimationFrame(tick); else finish();
      };
      raf = requestAnimationFrame(tick);
    };

    import('../../components/dissolve').then((m) => {
      if (!alive) return;
      cv = document.createElement('canvas');
      cv.className = 'wi-gl';
      host.appendChild(cv);
      fx = m.Dissolve.create(cv);
      if (fx) {
        fx.setColor([0x18 / 255, 0x17 / 255, 0x16 / 255]);
        fx.draw({ inP: 1, outP: 0, time: 0 });
        el.classList.add('gl');
      } else { cv.remove(); cv = null; }
    });

    // The drums started rolling at first paint (CSS), not at hydration: leave
    // when the last one has settled, measured on the animations' own clock.
    const anims = el.querySelector('.wi-reel')?.getAnimations?.() ?? [];
    const elapsed = Number(anims[0]?.currentTime ?? 0) || 0;
    timer = window.setTimeout(leave, Math.max(250, 2750 - elapsed));
    const skip = () => leave();
    const opts = { passive: true } as const;
    window.addEventListener('pointerdown', skip, opts);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, opts);
    window.addEventListener('touchmove', skip, opts);
    const onResize = () => fx?.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
      window.removeEventListener('resize', onResize);
      if (alive) { stop(); el.classList.remove('gl', 'leave', 'fade'); }
    };
  }, []);

  const cells = [...WORD];
  return (
    <>
      <div ref={root} id="ws-intro" className="wi" aria-hidden="true">
        <div ref={glHost} className="wi-glhost" />
        <svg className="wi-lines" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <line className="wi-l wi-h" x1="500" y1="500" x2="1000" y2="500" />
          <line className="wi-l wi-h" x1="500" y1="500" x2="0" y2="500" />
          <circle className="wi-l wi-rim" cx="500" cy="500" r="330" />
          <circle className="wi-l wi-rim2" cx="500" cy="500" r="352" />
        </svg>
        <div className="wi-window" style={{ '--n': cells.length } as CSSProperties}>
          {cells.map((ch, k) => (
            <span key={k} className={`wi-drum${k >= cells.length - 2 ? ' red' : ''}`} style={{ '--k': k, '--len': reel(ch, k).length } as CSSProperties}>
              <span className="wi-reel">{reel(ch, k).map((g, j) => <span key={j}>{g}</span>)}</span>
            </span>
          ))}
        </div>
        <p className="wi-cap">Water meter OCR on an ESP32-S3</p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem('${SKIP}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ws-intro-skip')}catch(e){}` }} />
      <style>{CSS}</style>
    </>
  );
}

const CSS = `
html.ws-intro-skip #ws-intro { display: none; }
.wi { position: fixed; inset: 0; z-index: 10000; background: #181716; color: #d8cbb8; display: grid; place-items: center; overflow: hidden;
  animation: wi-failsafe 0.01s linear 6s forwards; --cell: min(8.4vw, 98px); }
.wi.run { animation: none; }
.wi.gl { background: transparent; }
.wi-glhost, .wi-gl { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.wi.gone { display: none; }
.wi-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.wi-l { fill: none; stroke: #d8cbb8; stroke-width: 0.6; vector-effect: non-scaling-stroke; opacity: 0.55; }
.wi-h { stroke-dasharray: 500; stroke-dashoffset: 500; animation: wi-draw 1.1s cubic-bezier(.6,0,.2,1) 0.1s forwards; }
.wi-rim { stroke-dasharray: 2074; stroke-dashoffset: 2074; transform: rotate(-90deg); transform-origin: 500px 500px; animation: wi-draw 1.5s cubic-bezier(.5,0,.2,1) 0.25s forwards; opacity: 0.4; }
.wi-rim2 { stroke-dasharray: 2212; stroke-dashoffset: 2212; transform: rotate(90deg); transform-origin: 500px 500px; animation: wi-draw 1.7s cubic-bezier(.5,0,.2,1) 0.4s forwards; opacity: 0.22; }
.wi-window { position: relative; display: flex; border: 1px solid #d8cbb800; background: #121110; padding: 0; transform: scaleX(0.001); animation: wi-open 0.7s cubic-bezier(.7,0,.2,1) 0.45s forwards;
  box-shadow: 0 0 0 1px #d8cbb855, 0 40px 80px -30px #000, inset 0 10px 18px -8px #000c, inset 0 -10px 18px -8px #000c; }
.wi-drum { position: relative; width: var(--cell); height: calc(var(--cell) * 1.32); overflow: hidden; border-left: 1px solid #d8cbb82e;
  background: linear-gradient(180deg, #0c0b0a 0%, #2a2724 22%, #3a3632 50%, #2a2724 78%, #0c0b0a 100%); }
.wi-drum:first-child { border-left: 0; }
.wi-drum.red { background: linear-gradient(180deg, #160807 0%, #4a1c16 22%, #6b271e 50%, #4a1c16 78%, #160807 100%); }
.wi-reel { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column;
  transform: translate3d(0, 0, 0); animation: wi-roll calc(0.9s + var(--k) * 0.06s) cubic-bezier(.12,.62,.18,1.02) calc(0.7s + var(--k) * 0.04s) forwards; }
.wi-reel span { height: calc(var(--cell) * 1.32); display: grid; place-items: center; font: 700 calc(var(--cell) * 0.86)/1 Manrope, Arial, sans-serif; letter-spacing: -0.02em; color: #f3e7d4; }
.wi-drum.red .wi-reel span { color: #ffe3d8; }
.wi-cap { position: absolute; left: 50%; top: calc(50% + var(--cell) * 0.66 + 34px); transform: translateX(-50%); margin: 0; font: 400 15px/1 'Libre Baskerville', Baskerville, serif; letter-spacing: 0.01em; color: #ada496; opacity: 0; animation: wi-in 0.8s ease 1.7s forwards; white-space: nowrap; }
.wi.leave .wi-window, .wi.leave .wi-lines, .wi.leave .wi-cap { animation: wi-out 0.5s ease forwards; }
.wi.fade { transition: opacity 0.6s ease; opacity: 0; }
@keyframes wi-draw { to { stroke-dashoffset: 0; } }
@keyframes wi-open { to { transform: scaleX(1); } }
@keyframes wi-roll { to { transform: translate3d(0, calc((var(--len) - 1) * var(--cell) * -1.32), 0); } }
@keyframes wi-in { to { opacity: 1; } }
@keyframes wi-out { 0% { opacity: 1; filter: brightness(1); } 35% { filter: brightness(2.4); } 100% { opacity: 0; filter: brightness(3); } }
@keyframes wi-failsafe { to { visibility: hidden; opacity: 0; } }
@media (max-width: 640px) { .wi { --cell: 9.1vw; } .wi-cap { font-size: 12px; } }
`;
