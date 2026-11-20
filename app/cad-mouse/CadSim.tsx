'use client';
/*
  CadSim: the Capsule's button and an Onshape-like viewport, so a reader can
  feel the gesture machine from the firmware (lib/cadcore, GestureMachine):
  a click toggles rotate 0.3 s after release (the double-click window), a
  press held for 0.25 s pans while held, a double click fits the view, and
  rotate picks up again 0.1 s after a pan. The pointer stands in for the hand:
  while rotate is on, moving it turns the part; while panning, moving it slides
  the part and the wheel zooms (the twist). The LED colours are the firmware's.
  Until the reader touches it, and only while on screen, it plays a short demo.
*/
import { useCallback, useEffect, useRef, useState } from 'react';

const HOLD_MS = 250, GAP_MS = 300, SETTLE_MS = 100;
const DEG_PER_PX = 0.45;
const HOME = { yaw: -28, pitch: -14, x: 0, y: 0, zoom: 1 };
type View = typeof HOME;
type Led = 'ready' | 'rotate' | 'pan' | 'fit';

const LED_TEXT: Record<Led, string> = {
  ready: 'Green blink: connected, rotate off',
  rotate: 'Cyan: rotate on',
  pan: 'Amber: panning',
  fit: 'White flash: fit',
};

export default function CadSim() {
  const root = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(HOME);
  const [rotate, setRotate] = useState(false);
  const [panning, setPanning] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [flash, setFlash] = useState(false);
  const [fitting, setFitting] = useState(false);
  const [demo, setDemo] = useState(true);
  const [inView, setInView] = useState(false);

  const t = useRef({ hold: 0, click: 0, settle: 0, flash: 0, fit: 0 });
  const live = useRef({ rotate: false, panning: false, pressed: false, resumeAt: 0, downAt: 0, pendingClick: false, last: null as null | { x: number; y: number }, vpLast: null as null | { x: number; y: number } });
  live.current.rotate = rotate;

  const stopDemo = useCallback(() => setDemo(false), []);

  // auto demo: rotate on, a slow hand turning back and forth, only on screen
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!demo || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDemo(false); return; }
    setRotate(true);
    let raf = 0; const t0 = performance.now();
    const step = (now: number) => {
      const s = (now - t0) / 1000;
      setView((v) => ({ ...v, yaw: HOME.yaw + Math.sin(s * 0.7) * 48, pitch: HOME.pitch + Math.sin(s * 0.45) * 16 }));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [demo, inView]);
  useEffect(() => { if (!demo) { setRotate(false); setView(HOME); } }, [demo]);
  useEffect(() => () => { Object.values(t.current).forEach((id) => window.clearTimeout(id)); }, []);

  const fit = () => {
    setFitting(true); setView(HOME); setFlash(true);
    window.clearTimeout(t.current.flash); window.clearTimeout(t.current.fit);
    t.current.flash = window.setTimeout(() => setFlash(false), 320);
    t.current.fit = window.setTimeout(() => setFitting(false), 520);
  };

  // the button, as the firmware's gesture machine sees it
  const down = () => {
    stopDemo();
    const L = live.current; if (L.pressed) return;
    L.pressed = true; setPressed(true); L.downAt = performance.now();
    window.clearTimeout(t.current.settle);
    t.current.hold = window.setTimeout(() => {
      L.panning = true; setPanning(true);
      if (L.pendingClick) { L.pendingClick = false; window.clearTimeout(t.current.click); setRotate((r) => !r); }
    }, HOLD_MS);
  };
  const up = () => {
    const L = live.current; if (!L.pressed) return;
    L.pressed = false; setPressed(false); window.clearTimeout(t.current.hold);
    if (L.panning) {
      L.panning = false; setPanning(false);
      L.resumeAt = performance.now() + SETTLE_MS;
      return;
    }
    if (L.pendingClick) { L.pendingClick = false; window.clearTimeout(t.current.click); fit(); return; }
    L.pendingClick = true;
    t.current.click = window.setTimeout(() => { L.pendingClick = false; setRotate((r) => !r); }, GAP_MS);
  };

  // the pointer stands in for the hand: while the button is held it pans from
  // anywhere (the button keeps the pointer), otherwise moving it over the
  // viewport turns the part when rotate is on
  const panMove = (e: React.PointerEvent) => {
    const L = live.current; if (!L.pressed) return;
    const p = { x: e.clientX, y: e.clientY }; const prev = L.last; L.last = p;
    if (!prev || !L.panning) return;
    setView((v) => ({ ...v, x: v.x + p.x - prev.x, y: v.y + p.y - prev.y }));
  };
  const vpMove = (e: React.PointerEvent) => {
    const L = live.current; if (L.pressed) return;
    const p = { x: e.clientX, y: e.clientY }; const prev = L.vpLast; L.vpLast = p;
    if (!prev || demo || !L.rotate || performance.now() < L.resumeAt) return;
    setView((v) => ({ ...v, yaw: v.yaw + (p.x - prev.x) * DEG_PER_PX, pitch: v.pitch - (p.y - prev.y) * DEG_PER_PX }));
  };
  // scrolling while panning is the twist: it zooms, and must not scroll the page
  useEffect(() => {
    const el = root.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!live.current.panning) return;
      e.preventDefault();
      setView((v) => ({ ...v, zoom: Math.min(2.6, Math.max(0.45, v.zoom * Math.exp(-e.deltaY * 0.0015))) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  // a touch only moves while it is down, so a drag on the viewport works too
  const vpDown = (e: React.PointerEvent) => { stopDemo(); live.current.vpLast = { x: e.clientX, y: e.clientY }; };

  const key = (e: React.KeyboardEvent, isDown: boolean) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (isDown) { if (!e.repeat) down(); } else up();
  };
  const arrows = (e: React.KeyboardEvent) => {
    const step: Record<string, [number, number]> = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, 12], ArrowDown: [0, -12] };
    const s = step[e.key]; if (!s) return;
    e.preventDefault(); stopDemo();
    if (live.current.panning) setView((v) => ({ ...v, x: v.x + s[0] * 2, y: v.y - s[1] * 2 }));
    else if (live.current.rotate) setView((v) => ({ ...v, yaw: v.yaw + s[0], pitch: v.pitch + s[1] }));
  };

  const led: Led = flash ? 'fit' : panning ? 'pan' : rotate ? 'rotate' : 'ready';
  const status = demo
    ? 'Playing a demo with rotate on. Touch the Capsule’s button to take over.'
    : panning ? 'Panning while you hold. Move to slide the part, and scroll to zoom, which is the twist on the real one.'
    : rotate ? 'Rotate is on. Move the pointer over the view and the part turns with it. Click again to stop.'
    : 'Rotate is off. Click the button to start, hold it to pan, or double click to fit.';
  const part = { transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom}) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` };
  const triad = { transform: `rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` };

  return (
    <div ref={root} className={`cmx${fitting ? ' is-fitting' : ''}`} data-no-zoom onPointerMove={panMove}>
      <div className="cmx-vp" onPointerDown={vpDown} onPointerMove={vpMove} onPointerLeave={() => { live.current.vpLast = null; }} onKeyDown={arrows} tabIndex={0}
        role="img" aria-label="An orange handheld enclosure in a CAD viewport, turned by the Capsule">
        <div className="cmx-vp-bar" aria-hidden="true"><span /><span /><span /><span className="cmx-vp-name">Part Studio 1</span></div>
        <div className="cmx-stage" aria-hidden="true">
          <div className="cmx-part" style={part}>
            <i className="cmx-f cmx-front"><em className="cmx-win w1" /><em className="cmx-win w2" /><em className="cmx-win w3" /><em className="cmx-knob k1" /><em className="cmx-knob k2" /><em className="cmx-dot" /><em className="cmx-slot" /></i>
            <i className="cmx-f cmx-back" /><i className="cmx-f cmx-left" /><i className="cmx-f cmx-right" />
            <i className="cmx-f cmx-top" /><i className="cmx-f cmx-bottom" />
          </div>
        </div>
        <div className="cmx-triad" aria-hidden="true"><div className="cmx-triad-in" style={triad}><i className="ax x" /><i className="ax y" /><i className="ax z" /></div></div>
      </div>

      <div className="cmx-dev">
        <div className="cmx-cap">
          <img src="/images/cad-mouse/cover.webp" alt="" width={535} height={823} draggable={false} />
          <button type="button" className={`cmx-btn${pressed ? ' is-down' : ''}`} aria-label="The Capsule's button: click to toggle rotate, hold to pan, double click to fit"
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); live.current.last = { x: e.clientX, y: e.clientY }; down(); }}
            onPointerUp={up} onPointerCancel={up} onKeyDown={(e) => key(e, true)} onKeyUp={(e) => key(e, false)}>
            <span className="cmx-btn-ring" aria-hidden="true" />
          </button>
        </div>
        <p className={`cmx-led is-${led}`}><i aria-hidden="true" />{LED_TEXT[led]}</p>
        <p className="cmx-status" aria-live="polite">{status}</p>
        {!demo && (rotate || view !== HOME) && <button type="button" className="cmx-reset" onClick={() => { setRotate(false); fit(); }}>Start over</button>}
      </div>
    </div>
  );
}
