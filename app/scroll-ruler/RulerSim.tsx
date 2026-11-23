'use client';
/*
  A working copy of the Scroll Ruler: the AtomS3R's screen above a ruler with
  the Unit Scroll on it.

  The logic is RulerCore (lib/RulerCore/RulerCore.h in AtomS3R_ScrollWheelRuler)
  line for line: steps count only while the wheel is pressed; releasing during
  calibration moves to CHECK; a tap saves (or zeroes, or cancels), a hold of
  0.8 s or more starts calibration again; distance = steps x 100 / steps-per-10-cm,
  so a calibration that was not exactly 10 cm makes every reading off by the
  same ratio, as on the device. The wheel's real step is 100 / 49 mm, the
  figure the device counted in the demo, and the LED takes the firmware's
  colours (ledColorFor).

  Dragging the Unit Scroll rolls it with the wheel pressed; clicking the ruler
  lifts it and sets it down there without counting. Until the reader touches
  it, it plays the demo's calibration and two runs by itself, only while it
  is on screen.

  The words around the device come from the article's copy (`t`, the copy's
  `sim`); the AtomS3R's screen keeps the firmware's English.
*/
import { useCallback, useEffect, useRef, useState } from 'react';
import { fill } from '@/lib/fill';
import { Atom, Screen, type Mode } from './Atom';
import type { ScrollRulerCopy } from './_copy/en';

const STEP_MM = 100 / 49;    // one detent of the wheel, as counted in the demo
const RANGE_MM = 150;        // the ruler shows 0 to 15 cm
const HOLD_MS = 800;         // M5.BtnA.setHoldThresh(800)

type Core = { mode: Mode; pressed: boolean; steps: number; calSteps: number; per10cm: number };
const START: Core = { mode: 'calibrating', pressed: false, steps: 0, calSteps: 0, per10cm: 0 };
const valid = (n: number) => Math.abs(n) >= 4;

/* RulerCore::update, tap and hold */
function update(c: Core, delta: number, pressed: boolean): Core {
  if (!pressed) return { ...c, pressed, mode: c.mode === 'calibrating' && c.calSteps !== 0 ? 'confirming' : c.mode };
  if (c.mode === 'measuring') return { ...c, pressed, steps: c.steps + delta };
  return { ...c, pressed, mode: 'calibrating', calSteps: c.calSteps + delta };
}
function tap(c: Core): Core {
  if (c.mode === 'measuring') return { ...c, steps: 0 };
  if (c.mode === 'confirming') return valid(c.calSteps) ? { ...c, per10cm: c.calSteps, steps: 0, mode: 'measuring' } : c;
  return c.calSteps === 0 && valid(c.per10cm) ? { ...c, mode: 'measuring' } : c;
}
const hold = (c: Core): Core => ({ ...c, calSteps: 0, mode: 'calibrating' });

/* ledColorFor */
const led = (c: Core) =>
  c.mode === 'confirming' ? 'is-amber' : c.pressed ? 'is-green' : c.mode === 'calibrating' ? 'is-blue' : '';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RulerSim({ t: tx }: { t: ScrollRulerCopy['sim'] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [core, setCore] = useState<Core>(START);
  const coreRef = useRef(core); coreRef.current = core;
  const [pos, setPos] = useState(0);            // where the wheel touches the ruler, mm
  const posRef = useRef(0);
  const acc = useRef(0);                        // mm rolled since the last detent
  const [lifted, setLifted] = useState(false);
  const [btn, setBtn] = useState(false);        // the screen is being pressed
  const [manual, setManual] = useState(false);
  const manualRef = useRef(manual); manualRef.current = manual;
  const [inView, setInView] = useState(false);
  const viewRef = useRef(inView); viewRef.current = inView;

  /* roll the wheel to a new position; steps only reach the core while pressed */
  const rollTo = useCallback((mm: number, pressed: boolean) => {
    const p = Math.max(0, Math.min(RANGE_MM, mm));
    const d = p - posRef.current;
    posRef.current = p; setPos(p);
    let steps = 0;
    if (pressed) {
      acc.current += d;
      // a hair of slack so rolling exactly 10 cm lands on the 49th detent despite floating-point error
      while (acc.current >= STEP_MM - 1e-6) { steps++; acc.current -= STEP_MM; }
      while (acc.current <= -STEP_MM + 1e-6) { steps--; acc.current += STEP_MM; }
    }
    setCore((c) => update(c, steps, pressed));
  }, []);
  const release = useCallback(() => { setCore((c) => update(c, 0, false)); }, []);
  const place = useCallback((mm: number) => {
    const p = Math.max(0, Math.min(RANGE_MM, mm));
    posRef.current = p; setPos(p); acc.current = 0;
  }, []);

  /* ── the Unit Scroll: drag rolls it pressed; clicking the ruler lifts and places it ── */
  const mmAt = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * RANGE_MM;
  };
  const drag = useRef<{ dx: number } | null>(null);
  const onPuckDown = (e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: mmAt(e.clientX) - posRef.current };
    acc.current = 0;
    setCore((c) => update(c, 0, true));
  };
  const onPuckMove = (e: React.PointerEvent) => { if (drag.current) rollTo(mmAt(e.clientX) - drag.current.dx, true); };
  const onPuckUp = () => { if (!drag.current) return; drag.current = null; release(); };
  const onTrackDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setLifted(true); place(mmAt(e.clientX)); setTimeout(() => setLifted(false), 260);
  };
  const keyRoll = useRef(false);
  const onPuckKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    if (!keyRoll.current) { keyRoll.current = true; acc.current = 0; }
    rollTo(posRef.current + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 10 : 1), true);
  };
  const onPuckKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && keyRoll.current) { keyRoll.current = false; release(); }
  };

  /* ── the screen is the button: tap under 0.8 s, hold past it ── */
  const holdT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const held = useRef(false);
  const btnDown = () => {
    setBtn(true); held.current = false;
    clearTimeout(holdT.current);
    holdT.current = setTimeout(() => { held.current = true; setCore((c) => hold(c)); }, HOLD_MS);
  };
  const btnUp = () => {
    if (!btn) return;
    setBtn(false); clearTimeout(holdT.current);
    if (!held.current) setCore((c) => tap(c));
  };

  /* ── the demo it plays by itself until touched ── */
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (manual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let stop = false;
    const wait = async (ms: number) => {
      let left = ms;
      while (left > 0) { if (stop || manualRef.current) throw 0; await sleep(50); if (viewRef.current) left -= 50; }
    };
    const glide = async (to: number, ms: number, pressed: boolean) => {
      if (pressed) { acc.current = 0; setCore((c) => update(c, 0, true)); }
      const from = posRef.current, n = Math.max(1, Math.round(ms / 40));
      for (let i = 1; i <= n; i++) {
        const t = i / n, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        if (pressed) rollTo(from + (to - from) * e, true); else place(from + (to - from) * e);
        await wait(40);
      }
      if (pressed) release();
    };
    const press = async (ms: number, then: () => void) => { setBtn(true); await wait(ms); setBtn(false); then(); };
    (async () => {
      try {
        await wait(1200);
        for (;;) {
          await glide(100, 2600, true);              // calibrate: roll exactly 10 cm
          await wait(1500);
          await press(220, () => setCore((c) => tap(c)));   // save
          await wait(1100);
          setLifted(true); await glide(0, 700, false); setLifted(false);
          await wait(500);
          await glide(41, 1500, true);               // 4.1 cm, as in the video
          await wait(1800);
          await press(220, () => setCore((c) => tap(c)));   // zero
          setLifted(true); await glide(0, 700, false); setLifted(false);
          await wait(500);
          await glide(82, 2000, true);               // 8.2 cm
          await wait(2200);
          await press(HOLD_MS + 150, () => setCore((c) => hold(c)));   // hold: calibrate again
          setLifted(true); await glide(0, 700, false); setLifted(false);
          await wait(1400);
        }
      } catch { /* handed over, or gone */ }
    })();
    return () => { stop = true; };
  }, [manual, rollTo, place, release]);

  const takeOver = () => { if (!manual) { setManual(true); setBtn(false); setLifted(false); } };
  const reset = () => { setCore(START); place(0); };

  const mm = core.per10cm ? (core.steps * 100) / core.per10cm : 0;
  const live =
    core.mode === 'measuring' ? fill(core.pressed ? tx.readingLive : tx.reading, { cm: (mm / 10).toFixed(1) })
    : core.mode === 'calibrating' ? fill(tx.calibrating, { n: Math.abs(core.calSteps) })
    : fill(tx.confirming, { n: Math.abs(core.calSteps) });
  const ticks = [];
  for (let i = 0; i <= RANGE_MM; i++) ticks.push(<i key={i} className={i % 10 === 0 ? 'cm' : i % 5 === 0 ? 'half' : ''} style={{ left: `${(i / RANGE_MM) * 100}%` }} />);

  return (
    <div ref={root} className={`srx${manual ? ' is-manual' : ''}`} data-no-zoom onPointerDownCapture={takeOver} onKeyDownCapture={takeOver}>
      <div className="srx-top">
        <button type="button" className={`srx-btn${btn ? ' is-down' : ''}`} aria-label={tx.button}
          onPointerDown={btnDown} onPointerUp={btnUp} onPointerLeave={btnUp} onPointerCancel={btnUp}
          onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); btnDown(); } }}
          onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); btnUp(); } }}>
          <Atom className="srx-atom"><Screen s={core} /></Atom>
        </button>
        <p className="srx-live" aria-live="polite">{live}</p>
      </div>

      <div className="srx-ruler">
        <div className="srx-track" ref={track} onPointerDown={onTrackDown}>
          <div className="srx-scale" aria-hidden="true">
            {ticks}
            {Array.from({ length: RANGE_MM / 10 + 1 }, (_, k) => <span key={k} style={{ left: `${(k * 10 / RANGE_MM) * 100}%` }}>{k}</span>)}
          </div>
          <button type="button" className={`srx-puck${core.pressed ? ' is-pressed' : ''}${lifted ? ' is-lifted' : ''}`}
            style={{ left: `${(pos / RANGE_MM) * 100}%` }}
            aria-label={fill(tx.puck, { cm: (pos / 10).toFixed(1) })}
            onPointerDown={onPuckDown} onPointerMove={onPuckMove} onPointerUp={onPuckUp} onPointerCancel={onPuckUp}
            onKeyDown={onPuckKey} onKeyUp={onPuckKeyUp}>
            <span className="srx-puck-body">
              <span className="srx-puck-label">SCROLL</span>
              <i className={`srx-led ${led(core)}`} />
              <span className="srx-wheel" />
            </span>
            <i className="srx-mark" />
          </button>
        </div>
        <button type="button" className="srx-reset" onClick={reset}>{tx.reset}</button>
      </div>
    </div>
  );
}
