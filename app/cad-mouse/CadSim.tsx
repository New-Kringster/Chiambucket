'use client';
/*
  CadSim: the "Try it" section. The viewport holds the real LoRA Messenger case
  (caseScene.ts) and takes the controls a reader already knows from any 3D
  viewer: drag to turn, right-drag, Shift-drag or two fingers to slide, the
  wheel or a pinch to zoom, a double click to fit. Each of those is one of the
  Capsule's three gestures, so the Capsule beside the view acts it out as the
  reader does it: it leans the way the hand would turn, its button shows as
  clicked or held, and its light takes the firmware's colour (cyan for rotate,
  amber while the button is held, a white flash for fit). The key under the
  view pairs each control with its gesture and lights the one in use.

  The wheel only zooms once the reader has pressed inside the view, so
  scrolling the page past it is never caught. Until the first touch, and only
  while on screen, the case sways by itself. Its words come from the article's
  copy (`t`, the copy's `sim`).
*/
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CadMouseCopy } from './_copy/en';
import type { CaseScene } from './caseScene';

type Mode = 'ready' | 'rotate' | 'pan' | 'zoom' | 'fit';
type Led = 'ready' | 'rotate' | 'pan' | 'fit';
const MOVES = ['rotate', 'pan', 'zoom', 'fit'] as const;
const LEDS: Led[] = ['ready', 'rotate', 'pan', 'fit'];
const LEAN_MAX = 24;
const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

export default function CadSim({ t: tx }: { t: CadMouseCopy['sim'] }) {
  const root = useRef<HTMLDivElement>(null);
  const vp = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cap = useRef<HTMLDivElement>(null);
  const scene = useRef<CaseScene | null>(null);

  const [mode, setMode] = useState<Mode>('ready');
  const [state, setState] = useState<'idle' | 'ready' | 'failed'>('idle');
  const [demo, setDemo] = useState(true);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);

  const live = useRef({
    pts: new Map<number, { x: number; y: number }>(), mode: 'ready' as Mode, engaged: false,
    tapAt: 0, tapX: 0, tapY: 0, downX: 0, downY: 0, moved: false, timer: 0,
    lean: { x: 0, y: 0, z: 0 }, leanAt: 0, leanRaf: 0,
  });

  const go = useCallback((m: Mode) => { if (live.current.mode !== m) { live.current.mode = m; setMode(m); } }, []);
  /* a short state (zoom from the wheel, the fit flash) that falls back to ready */
  const flash = useCallback((m: Mode, ms: number) => {
    const L = live.current;
    go(m); window.clearTimeout(L.timer);
    L.timer = window.setTimeout(() => { if (!L.pts.size) go('ready'); }, ms);
  }, [go]);

  /* The Capsule leans with the hand, then settles back upright. */
  const lean = useCallback((x: number, y: number, z: number) => {
    const L = live.current, el = cap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    L.lean.x = clamp(L.lean.x + x, LEAN_MAX); L.lean.y = clamp(L.lean.y + y, LEAN_MAX); L.lean.z = clamp(L.lean.z + z, LEAN_MAX);
    L.leanAt = performance.now();
    if (L.leanRaf) return;
    const step = (now: number) => {
      const a = L.lean;
      if (now - L.leanAt > 70) { a.x *= 0.9; a.y *= 0.9; a.z *= 0.9; }
      el.style.transform = `perspective(520px) rotateX(${a.x.toFixed(2)}deg) rotateY(${a.y.toFixed(2)}deg) rotateZ(${a.z.toFixed(2)}deg)`;
      if (Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z) < 0.08 && now - L.leanAt > 70) { el.style.transform = ''; L.leanRaf = 0; return; }
      L.leanRaf = requestAnimationFrame(step);
    };
    L.leanRaf = requestAnimationFrame(step);
  }, []);

  // the model and three.js are only fetched once the section is close
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '500px 0px' });
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el); vis.observe(el);
    return () => { io.disconnect(); vis.disconnect(); };
  }, []);
  useEffect(() => {
    if (!near || !canvas.current) return;
    let gone = false, ro: ResizeObserver | null = null;
    import('./caseScene').then(({ createCaseScene }) => {
      if (gone || !canvas.current) return;
      try {
        const s = createCaseScene(canvas.current, {
          glb: '/cad-mouse/brolocator.glb',
          onReady: () => { if (!gone) setState('ready'); },
          onError: () => { if (!gone) setState('failed'); },
          onAutoTurn: (yaw, pitch) => lean(pitch * 0.6, yaw * 0.6, 0),
        });
        scene.current = s;
        ro = new ResizeObserver(() => s.resize());
        if (vp.current) ro.observe(vp.current);
      } catch { setState('failed'); }
    }).catch(() => { if (!gone) setState('failed'); });
    const L = live.current;
    return () => { gone = true; ro?.disconnect(); scene.current?.destroy(); scene.current = null; window.clearTimeout(L.timer); cancelAnimationFrame(L.leanRaf); L.leanRaf = 0; };
  }, [near, lean]);

  // the sway that plays until the reader takes over, only while on screen
  const swaying = demo && inView && state === 'ready';
  useEffect(() => {
    scene.current?.setAuto(swaying);
    if (swaying && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) go('rotate');
    else if (demo) go('ready');
  }, [swaying, demo, go]);
  const take = useCallback(() => { if (live.current.pts.size === 0 && demo) go('ready'); setDemo(false); }, [demo, go]);

  const fit = useCallback(() => { take(); scene.current?.fit(); flash('fit', 420); }, [take, flash]);
  const zoomBy = useCallback((f: number) => { take(); scene.current?.zoom(f); lean(0, 0, f > 1 ? 7 : -7); flash('zoom', 320); }, [take, flash, lean]);

  const down = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const L = live.current;
    take(); L.engaged = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    L.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    L.downX = e.clientX; L.downY = e.clientY; L.moved = false;
    window.clearTimeout(L.timer);
    go(L.pts.size > 1 || e.button === 2 || e.button === 1 || e.shiftKey ? 'pan' : 'rotate');
  };
  const move = (e: React.PointerEvent) => {
    const L = live.current, p = L.pts.get(e.pointerId), s = scene.current;
    if (!p || !s) return;
    const x = e.clientX, y = e.clientY, dx = x - p.x, dy = y - p.y;
    if (Math.abs(x - L.downX) + Math.abs(y - L.downY) > 6) L.moved = true;
    if (L.pts.size === 1) {
      p.x = x; p.y = y;
      if (L.mode === 'pan') { s.pan(dx, dy); lean(-dy * 0.16, dx * 0.16, 0); }
      else { go('rotate'); s.rotate(dx, dy); lean(-dy * 0.22, dx * 0.22, 0); }
      return;
    }
    // two fingers: the pair slides the case, and the gap between them zooms it
    const other = [...L.pts.entries()].find(([id]) => id !== e.pointerId)?.[1];
    if (!other) return;
    const before = Math.hypot(p.x - other.x, p.y - other.y), after = Math.hypot(x - other.x, y - other.y);
    p.x = x; p.y = y;
    s.pan(dx / 2, dy / 2);
    if (before > 8 && after > 8) {
      const f = after / before;
      s.zoom(f);
      const pinch = Math.abs(after - before) > Math.hypot(dx, dy) * 0.6;
      go(pinch ? 'zoom' : 'pan');
      if (pinch) lean(0, 0, (f - 1) * 90); else lean(-dy * 0.1, dx * 0.1, 0);
    }
  };
  const up = (e: React.PointerEvent) => {
    const L = live.current;
    if (!L.pts.delete(e.pointerId)) return;
    if (L.pts.size) { go('rotate'); return; }
    go('ready');
    if (L.moved || e.type === 'pointercancel') { L.tapAt = 0; return; }
    // a second quick tap in the same place is the double click
    const now = performance.now();
    if (now - L.tapAt < 340 && Math.abs(e.clientX - L.tapX) + Math.abs(e.clientY - L.tapY) < 28) { L.tapAt = 0; fit(); return; }
    L.tapAt = now; L.tapX = e.clientX; L.tapY = e.clientY;
  };

  // the wheel zooms once the reader has pressed inside the view (or pinches a trackpad), never before
  useEffect(() => {
    const el = vp.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!live.current.engaged && !e.ctrlKey) return;
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  const key = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const s = scene.current; if (!s) return;
    const arrow: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const a = arrow[e.key];
    if (a) {
      e.preventDefault(); take();
      if (e.shiftKey) { s.pan(a[0] * 24, a[1] * 24); lean(-a[1] * 6, a[0] * 6, 0); flash('pan', 320); }
      else { s.rotate(a[0] * 30, a[1] * 30); lean(-a[1] * 8, a[0] * 8, 0); flash('rotate', 320); }
    } else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(1.2); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomBy(1 / 1.2); }
    else if (e.key === '0' || e.key === 'Home' || e.key === 'f' || e.key === 'F') { e.preventDefault(); fit(); }
  };

  const led: Led = mode === 'zoom' ? 'pan' : mode;
  return (
    <div ref={root} className={`cmx is-${mode}${state === 'ready' ? ' is-loaded' : ''}`} data-no-zoom>
      <div ref={vp} className="cmx-vp" tabIndex={0} role="group" aria-label={tx.viewport}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onPointerLeave={() => { if (!live.current.pts.size) live.current.engaged = false; }}
        onContextMenu={(e) => e.preventDefault()} onKeyDown={key}>
        <div className="cmx-vp-bar" aria-hidden="true"><span /><span /><span /><span className="cmx-vp-name">Brolocator case</span></div>
        <div className="cmx-stage"><canvas ref={canvas} aria-hidden="true" /></div>
        {state !== 'ready' && <p className="cmx-wait">{state === 'failed' ? tx.failed : tx.loading}</p>}
        {state === 'ready' && demo && (
          <p className="cmx-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {tx.hint}
          </p>
        )}
        <div className="cmx-tools">
          <button type="button" onClick={() => zoomBy(1 / 1.3)} aria-label={tx.zoomOut} title={tx.zoomOut}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
          <button type="button" onClick={() => zoomBy(1.3)} aria-label={tx.zoomIn} title={tx.zoomIn}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className="cmx-tools-fit" onClick={fit}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {tx.fit}
          </button>
        </div>
      </div>

      <div className="cmx-dev" aria-hidden="true">
        <div className="cmx-cap" ref={cap}>
          <img src="/images/cad-mouse/cover.webp" alt="" width={535} height={823} draggable={false} />
          <span className="cmx-btn"><i /></span>
        </div>
        <p className={`cmx-led is-${led}`}>
          <i />
          <span className="cmx-led-text">
            {LEDS.map((k) => <span key={k} className={k === led ? 'on' : undefined}>{tx.led[k]}</span>)}
          </span>
        </p>
      </div>

      <div className="cmx-key">
        <p className="cmx-key-head"><span>{tx.heads.here}</span><span>{tx.heads.capsule}</span></p>
        <ul>
          {MOVES.map((m) => (
            <li key={m} className={`cmx-move is-${m}${mode === m ? ' on' : ''}`}>
              <b><span className="cmx-mouse">{tx.moves[m].mouse}</span><span className="cmx-touch">{tx.moves[m].touch}</span></b>
              <span>{tx.moves[m].capsule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
