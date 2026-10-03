'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

/* One dispense cycle, following the flow chart in the write-up:
   IR module triggered, servo to 180°, high-power LED on, level 1;
   select steps the level (indicator LEDs); confirm runs the DC pump
   for 3, 4 or 5 seconds; everything off. */

type Level = 1 | 2 | 3;
type Phase = 'idle' | 'wake' | 'select' | 'pour' | 'done';
type Led = 'red' | 'yellow' | 'green';

const SPRING = [0.16, 1, 0.3, 1] as const;

const LEVELS: Record<Level, { label: string; fill: number; pumpS: number; leds: Led[]; ledText: string }> = {
  1: { label: 'Level 1', fill: 0.45, pumpS: 3, leds: ['red'], ledText: 'red' },
  2: { label: 'Level 2', fill: 0.65, pumpS: 4, leds: ['red', 'yellow'], ledText: 'red and yellow' },
  3: { label: 'Level 3', fill: 0.86, pumpS: 5, leds: ['red', 'yellow', 'green'], ledText: 'red, yellow and green' },
};
const LEVEL_ORDER: Level[] = [1, 2, 3];
const ALL_LEDS: Led[] = ['red', 'yellow', 'green'];

const PHASES: { key: Phase; label: string; blurb: string }[] = [
  { key: 'idle', label: 'Waiting', blurb: 'Waiting for the infrared collision detection module to detect a cup.' },
  { key: 'wake', label: 'Cup in', blurb: 'A cup triggers the infrared module. The servo turns to 180° and opens the door over the buttons, the high-power LED turns on and the level resets to 1.' },
  { key: 'select', label: 'Select', blurb: 'The select button steps through levels 1, 2 and 3. The indicator LEDs show the level: red, red and yellow, or all three.' },
  { key: 'pour', label: 'Pour', blurb: 'The confirm button switches the DC pump on through the relay for 3, 4 or 5 seconds, depending on the level.' },
  { key: 'done', label: 'Done', blurb: 'The pump stops and everything turns off until the next cup.' },
];
const phaseText = (p: Phase, l: Level) =>
  (PHASES.find((x) => x.key === p)?.blurb ?? '') + (p === 'select' ? ` Now on level ${l}: ${LEVELS[l].ledText}.` : '');
/* Longest text any step can show: reserves the height so steps never reflow the page */
const LONGEST_BLURB = PHASES.flatMap((p) => LEVEL_ORDER.map((l) => phaseText(p.key, l))).reduce((a, t) => (t.length > a.length ? t : a), '');
const PHASE_DURATIONS: Record<Phase, number> = { idle: 1800, wake: 1500, select: 1700, pour: 0, done: 2000 };

type CompKey = 'ir' | 'servo' | 'led' | 'pump';
const COMPONENTS: { key: CompKey; label: string; full: string }[] = [
  { key: 'ir', label: 'IR module', full: 'Infrared collision detection module' },
  { key: 'servo', label: 'Door', full: 'Servo door over the buttons' },
  { key: 'led', label: 'LED', full: 'High-power LED over the cup' },
  { key: 'pump', label: 'Pump', full: 'DC pump, switched by a relay' },
];
/* Each component's colour state and its label during each phase */
type CompState = 'off' | 'standby' | 'active' | 'done';
const COMP_STATE: Record<Phase, Record<CompKey, [CompState, string]>> = {
  idle: { ir: ['active', 'Watching'], servo: ['done', 'Closed'], led: ['off', 'Off'], pump: ['off', 'Off'] },
  wake: { ir: ['active', 'Triggered'], servo: ['active', 'Open'], led: ['active', 'On'], pump: ['off', 'Off'] },
  select: { ir: ['standby', 'Triggered'], servo: ['active', 'Open'], led: ['active', 'On'], pump: ['standby', 'Off'] },
  pour: { ir: ['standby', 'Triggered'], servo: ['active', 'Open'], led: ['active', 'On'], pump: ['active', 'Running'] },
  done: { ir: ['active', 'Watching'], servo: ['done', 'Closed'], led: ['off', 'Off'], pump: ['off', 'Off'] },
};

export default function DispenseDemo() {
  // false on the server and the first client render, so hydration matches
  const reduceMotion = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [level, setLevel] = useState<Level>(2);
  const [phase, setPhase] = useState<Phase>('idle');
  const [auto, setAuto] = useState(true);
  const [cycle, setCycle] = useState(0);

  const phaseIndex = PHASES.findIndex((p) => p.key === phase);
  const lv = LEVELS[level];
  const comp = COMP_STATE[phase];
  const ledOn = comp.led[0] === 'active';
  const pouring = phase === 'pour';
  const filling = pouring || phase === 'done';
  const fillTarget = filling ? lv.fill : 0;
  const doorOpen = phase === 'wake' || phase === 'select' || phase === 'pour';
  const ledsLit: Led[] = phase === 'select' || phase === 'pour' ? lv.leds : phase === 'wake' ? ['red'] : [];
  const instant = reduceMotion ? 0 : undefined; // framer-motion treats `duration: 0` as a snap, no tween
  const live = inView && !reduceMotion;

  // Only run while on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-demo rotates the level each cycle until a visitor picks one
  useEffect(() => {
    if (reduceMotion || !auto || phase !== 'idle') return;
    setLevel(LEVEL_ORDER[(cycle + 1) % LEVEL_ORDER.length]);
  }, [reduceMotion, auto, phase, cycle]);

  // Step timer: runs while in view, for the auto-demo or a manual run in progress
  const running = live && (auto || phase !== 'idle');
  useEffect(() => {
    if (!running) return;
    const ms = phase === 'pour' ? lv.pumpS * 1000 : PHASE_DURATIONS[phase];
    const t = setTimeout(() => {
      if (phase === 'done') {
        setCycle((c) => c + 1);
        setPhase('idle');
      } else {
        setPhase(PHASES[PHASES.findIndex((x) => x.key === phase) + 1].key);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [running, phase, lv.pumpS]);

  const pick = useCallback((l: Level) => {
    setAuto(false);
    setLevel(l);
    // Reduced motion: show the finished frame instead of stepping through the cycle
    setPhase(reduceMotion ? 'done' : 'wake');
  }, [reduceMotion]);

  const status = reduceMotion
    ? `${lv.label} · ${lv.pumpS} s pump`
    : auto
      ? `Running on its own · ${lv.label}`
      : `Your pick · ${lv.label}`;

  return (
    <LazyMotion features={domAnimation}>
    <div ref={rootRef} className={`pd-dd pd-dd-${phase}`} data-no-zoom data-live={live ? 'on' : 'off'}>
      <div className="pd-dd-glass">
        <div className="pd-dd-glow" aria-hidden="true" />

        {/* IR beam, sweeps when a cup arrives */}
        <div className="pd-dd-beam-track" aria-hidden="true">
          <AnimatePresence>
            {phase === 'wake' && (
              <m.span
                className="pd-dd-beam"
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: [0, 1, 1, 0], scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.05, times: [0, 0.25, 0.8, 1], ease: SPRING }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="pd-dd-machine">
          {/* Dispenser head: body, high-power LED, the servo door over the panel, spout below */}
          <div className="pd-dd-head">
            <span className="pd-dd-head-vent" aria-hidden="true" />
            <m.span
              className="pd-dd-head-led"
              aria-hidden="true"
              animate={{ opacity: ledOn ? 1 : 0.16, boxShadow: ledOn ? '0 0 14px 3px rgba(255,207,138,0.7)' : '0 0 0 0 rgba(255,207,138,0)' }}
              transition={{ duration: instant ?? 0.4, ease: SPRING }}
            />
            <div className="pd-dd-panel">
              <span className="pd-dd-btns" aria-hidden="true">
                <span className="pd-dd-inds">
                  {ALL_LEDS.map((c) => (
                    <i key={c} className={`pd-dd-ind ${c}${ledsLit.includes(c) ? ' on' : ''}`} />
                  ))}
                </span>
                <span className={`pd-dd-pbtn${phase === 'select' ? ' is-pressed' : ''}`} />
                <span className={`pd-dd-pbtn${phase === 'pour' ? ' is-pressed' : ''}`} />
              </span>
              <m.span
                className="pd-dd-door"
                aria-hidden="true"
                animate={{ y: doorOpen ? '-104%' : '0%' }}
                transition={{ duration: instant ?? 0.55, ease: SPRING, delay: reduceMotion ? 0 : phase === 'done' ? 0.15 : phase === 'wake' ? 0.1 : 0 }}
              />
            </div>
            <div className="pd-dd-spout">
              <span className="pd-dd-spout-mouth" aria-hidden="true" />
            </div>
          </div>

          {/* Pour stream bridging head and cup */}
          <div className="pd-dd-stream-track" aria-hidden="true">
            <AnimatePresence>
              {pouring && (
                <m.span
                  className="pd-dd-stream"
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.4 }}
                  transition={{ duration: 0.3, ease: SPRING }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* High-power LED light over the cup */}
          <m.div
            className="pd-dd-led-pool"
            aria-hidden="true"
            animate={{ opacity: ledOn ? 1 : 0, scale: ledOn ? 1 : 0.8 }}
            transition={{ duration: instant ?? 0.6, ease: SPRING }}
          />

          {/* The cup, sitting in the dispensing area */}
          <div className="pd-dd-cup" role="img" aria-label={`Cup under the spout, ${phase === 'idle' ? 'empty, waiting' : phase === 'done' ? `filled at ${lv.label.toLowerCase()}` : pouring ? `filling at ${lv.label.toLowerCase()}` : 'empty'}`}>
            <span className="pd-dd-cup-rim" aria-hidden="true" />
            <m.div
              className="pd-dd-water"
              animate={{ height: `${fillTarget * 100}%` }}
              transition={{ duration: instant ?? (pouring ? lv.pumpS : 0.5), ease: pouring ? 'linear' : SPRING }}
            >
              <m.span
                className="pd-dd-wobble"
                aria-hidden="true"
                animate={live && pouring ? { scaleY: [1, 1.35, 0.85, 1.18, 1], scaleX: [1, 0.97, 1.02, 0.99, 1] } : { scaleY: 1, scaleX: 1 }}
                transition={live && pouring ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: instant ?? 0.4 }}
              />
              <span className="pd-dd-shine" aria-hidden="true" />
            </m.div>
            <span className="pd-dd-cup-base" aria-hidden="true" />
          </div>
          <span className="pd-dd-shelf" aria-hidden="true" />
        </div>
      </div>

      <div className="pd-dd-side">
        <div className="pd-dd-headrow">
          <span className="pd-dd-eyebrow">{status}</span>
          {!reduceMotion && !auto && (
            <button type="button" className="pd-dd-resume" onClick={() => { setAuto(true); setPhase('idle'); }}>
              <RefreshGlyph /> Run on its own
            </button>
          )}
        </div>

        <div className="pd-dd-levels" role="group" aria-label="Choose a level">
          {LEVEL_ORDER.map((l) => (
            <button
              key={l}
              type="button"
              className={`pd-dd-level${l === level ? ' is-active' : ''}`}
              onClick={() => pick(l)}
              aria-pressed={l === level}
            >
              <span className="pd-dd-level-glyph">{l}</span>
              <span className="pd-dd-level-text"><b>{LEVELS[l].label}</b>{LEVELS[l].pumpS} s pump</span>
            </button>
          ))}
        </div>

        {/* Phase rail: a horizontal thread the cycle travels along */}
        <div className="pd-dd-rail" aria-label="Dispense cycle">
          <div className="pd-dd-rail-track" aria-hidden="true">
            <m.div
              className="pd-dd-rail-fill"
              animate={{ width: `${(phaseIndex / (PHASES.length - 1)) * 100}%` }}
              transition={{ duration: instant ?? 0.5, ease: SPRING }}
            />
          </div>
          <div className="pd-dd-rail-steps">
            {PHASES.map((p, n) => (
              <span key={p.key} className={`pd-dd-rail-step${n <= phaseIndex ? ' is-lit' : ''}${n === phaseIndex ? ' is-current' : ''}`} aria-current={n === phaseIndex ? 'step' : undefined}>
                <span className="pd-dd-rail-dot" />
                <span className="pd-dd-rail-label">{p.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pd-dd-desc-wrap" role="status" aria-live="polite">
          <p className="pd-dd-desc pd-dd-sizer" aria-hidden="true">{LONGEST_BLURB}</p>
          <AnimatePresence mode="wait">
            <m.p
              key={phase}
              className="pd-dd-desc"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: instant ?? 0.32, ease: SPRING }}
            >
              {phaseText(phase, level)}
            </m.p>
          </AnimatePresence>
        </div>

        <div className="pd-dd-again-slot">
          {phase === 'done' && !auto && (
            <button type="button" className="pd-dd-again" onClick={() => pick(level)}>
              Pour another <ArrowGlyph />
            </button>
          )}
        </div>

        {/* Mini schematic: signal line through the four components */}
        <div className="pd-dd-schema" aria-label="Component status">
          <span className="pd-dd-schema-line" aria-hidden="true">
            <m.span
              className="pd-dd-schema-pulse"
              animate={live && phase !== 'idle' ? { left: ['0%', '100%'] } : { left: '0%', opacity: reduceMotion && phase !== 'idle' ? 1 : undefined }}
              transition={live && phase !== 'idle' ? { duration: 1.4, repeat: Infinity, ease: 'linear' } : { duration: instant ?? 0.3 }}
            />
          </span>
          {COMPONENTS.map((c) => (
            <div key={c.key} className={`pd-dd-node st-${comp[c.key][0]}`} title={c.full}>
              <span className="pd-dd-node-dot" />
              <span className="pd-dd-node-label">{c.label}</span>
              <span className="pd-dd-node-state">{comp[c.key][1]}</span>
            </div>
          ))}
        </div>
      </div>

      <PdStyles />
    </div>
    </LazyMotion>
  );
}

function RefreshGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
      <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15a8 8 0 0014.1 2.6M19.5 9A8 8 0 005.4 6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdStyles() {
  return (
    <style>{`
      .pd-dd {
        --water: #e0a24a; --water-deep: #a3601c; --warm: #ffcf8a; /* syrup */
        display: grid; grid-template-columns: 0.78fr 1.22fr; gap: clamp(22px, 3.4vw, 44px);
        align-items: stretch; margin: 1.5rem 0 0.6rem;
        padding: clamp(20px, 3vw, 32px); border-radius: 22px;
        background: linear-gradient(160deg, rgba(20,22,28,0.86), rgba(11,12,16,0.94));
        border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        position: relative; overflow: hidden;
      }
      /* ---- glass / vessel column ---- */
      .pd-dd-glass {
        position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 320px; border-radius: 16px;
        background: radial-gradient(120% 90% at 50% 12%, rgba(167,198,232,0.07), transparent 60%), rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        padding: 28px 18px 22px;
      }
      .pd-dd-glow {
        position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(46% 40% at 50% 70%, color-mix(in srgb, var(--hp-sky) 16%, transparent), transparent 72%);
        opacity: 0.6; transition: opacity 0.6s ease;
      }
      .pd-dd-pour .pd-dd-glow, .pd-dd-select .pd-dd-glow { opacity: 1; }

      /* IR beam sweeps low, where the cup approaches the dispensing area */
      .pd-dd-beam-track { position: absolute; bottom: 27%; left: 12%; right: 12%; height: 2px; pointer-events: none; z-index: 2; }
      .pd-dd-beam {
        position: absolute; inset: 0; transform-origin: left center; border-radius: 999px;
        background: linear-gradient(90deg, color-mix(in srgb, var(--hp-sky) 75%, transparent), color-mix(in srgb, var(--hp-sky) 18%, transparent));
        box-shadow: 0 0 14px 2px color-mix(in srgb, var(--hp-sky) 55%, transparent);
      }

      /* The whole machine: head unit above, cup below, on a shelf */
      .pd-dd-machine { position: relative; display: flex; flex-direction: column; align-items: center; z-index: 1; }

      /* Dispenser head: body + status LED + control panel (door over buttons) + open spout */
      .pd-dd-head {
        position: relative; width: 142px; min-height: 100px; border-radius: 14px 14px 8px 8px;
        background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 60%);
        border: 1px solid rgba(255,255,255,0.14); border-bottom: none;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 14px 30px -18px rgba(0,0,0,0.7);
        display: flex; flex-direction: column; align-items: center; padding: 26px 0 0;
      }
      .pd-dd-head-vent {
        position: absolute; top: 12px; left: 16px; width: 26px; height: 4px; border-radius: 999px;
        background: repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 3px, transparent 3px 7px);
      }
      .pd-dd-head-led {
        position: absolute; top: 13px; right: 18px; width: 8px; height: 8px; border-radius: 50%;
        background: var(--warm); transition: opacity 0.4s ease, box-shadow 0.4s ease;
      }
      /* Control panel: the level buttons sit here; the self-closing door slides over them */
      .pd-dd-panel {
        position: relative; width: 86px; height: 30px; border-radius: 8px; overflow: hidden;
        background: linear-gradient(180deg, rgba(0,0,0,0.34), rgba(0,0,0,0.52));
        border: 1px solid rgba(255,255,255,0.12);
        display: grid; place-items: center;
      }
      .pd-dd-btns { display: inline-flex; align-items: center; gap: 7px; }
      /* Indicator LEDs: red, yellow, green show the level */
      .pd-dd-inds { display: inline-flex; gap: 3px; margin-right: 2px; }
      .pd-dd-ind { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.14); transition: background 0.3s ease, box-shadow 0.3s ease; }
      .pd-dd-ind.red.on { background: #ff6a5c; box-shadow: 0 0 6px 1px rgba(255,106,92,0.6); }
      .pd-dd-ind.yellow.on { background: #f5cf7e; box-shadow: 0 0 6px 1px rgba(245,207,126,0.6); }
      .pd-dd-ind.green.on { background: #6fd6a8; box-shadow: 0 0 6px 1px rgba(111,214,168,0.6); }
      .pd-dd-pbtn {
        width: 13px; height: 13px; border-radius: 50%;
        background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.3), rgba(255,255,255,0.08));
        border: 1px solid rgba(255,255,255,0.22);
        transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
      }
      .pd-dd-pbtn.is-pressed {
        background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--hp-sky) 92%, #fff), var(--hp-sky));
        box-shadow: 0 0 10px 1px color-mix(in srgb, var(--hp-sky) 60%, transparent);
        transform: scale(0.84);
      }
      /* Self-closing door: covers the buttons at rest, slides up to uncover them mid-cycle */
      .pd-dd-door {
        position: absolute; inset: 0; z-index: 3; border-radius: 7px;
        background: linear-gradient(180deg, #d7e0ea, #9aabbf);
        border: 1px solid rgba(255,255,255,0.4);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 12px -6px rgba(0,0,0,0.5);
      }
      .pd-dd-door::after {
        content: ''; position: absolute; left: 50%; bottom: 5px; width: 28px; height: 3px; margin-left: -14px;
        border-radius: 999px; background: rgba(0,0,0,0.18);
      }
      .pd-dd-spout {
        margin-top: 9px; width: 44px; height: 16px; border-radius: 0 0 10px 10px;
        background: linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
        border: 1px solid rgba(255,255,255,0.1); border-top: none;
        display: flex; align-items: flex-end; justify-content: center;
      }
      .pd-dd-spout-mouth {
        position: relative; bottom: -1px; width: 22px; height: 8px; border-radius: 0 0 7px 7px;
        background: linear-gradient(180deg, rgba(167,198,232,0.28), rgba(167,198,232,0.08));
        border: 1px solid rgba(255,255,255,0.14); border-top: none;
      }

      .pd-dd-stream-track { position: relative; height: 30px; width: 8px; display: flex; justify-content: center; z-index: 2; }
      .pd-dd-stream {
        position: absolute; top: 0; width: 5px; height: 30px; transform-origin: top center; border-radius: 999px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--water) 65%, transparent), var(--water));
        box-shadow: 0 0 10px 1px color-mix(in srgb, var(--water) 50%, transparent);
      }

      .pd-dd-led-pool {
        position: absolute; left: 50%; bottom: 18%; width: 220px; height: 220px; margin-left: -110px; margin-bottom: -90px;
        border-radius: 50%; pointer-events: none;
        background: radial-gradient(circle, color-mix(in srgb, var(--warm) 55%, transparent), transparent 68%);
        filter: blur(26px);
      }

      /* The cup */
      .pd-dd-cup {
        position: relative; width: 92px; height: 110px; border-radius: 8px 8px 20px 20px;
        background: linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
        border: 1px solid rgba(255,255,255,0.16); border-top: none; overflow: hidden;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03), 0 16px 36px -20px rgba(0,0,0,0.7);
      }
      .pd-dd-cup-rim {
        position: absolute; top: 0; left: -5px; right: -5px; height: 7px; border-radius: 999px;
        background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05));
        border: 1px solid rgba(255,255,255,0.18); z-index: 3;
      }
      .pd-dd-cup-base {
        position: absolute; bottom: -5px; left: 50%; width: 46px; height: 8px; margin-left: -23px; border-radius: 999px;
        background: rgba(0,0,0,0.34); filter: blur(3px);
      }
      .pd-dd-shelf {
        margin-top: 10px; width: 168px; height: 4px; border-radius: 999px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
      }
      .pd-dd-water {
        position: absolute; left: 0; right: 0; bottom: 0; min-height: 0;
        background: linear-gradient(180deg, color-mix(in srgb, var(--water) 78%, transparent), var(--water-deep));
        overflow: hidden;
      }
      .pd-dd-wobble {
        position: absolute; left: -12%; right: -12%; top: -7px; height: 14px; transform-origin: 50% 100%;
        background: radial-gradient(50% 100% at 50% 0%, color-mix(in srgb, var(--water) 92%, #fff 12%), transparent 75%);
        border-radius: 50%; opacity: 0.85;
      }
      .pd-dd-shine {
        position: absolute; left: 14%; top: 0; bottom: 0; width: 16%;
        background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02));
        border-radius: 999px; filter: blur(1px); opacity: 0.55;
      }

      /* ---- side column ---- */
      .pd-dd-side { display: flex; flex-direction: column; min-width: 0; }
      .pd-dd-headrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 0.85rem; min-height: 34px; } /* reserves the resume button's height */
      .pd-dd-eyebrow {
        font-family: 'inter'; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--hp-sky); font-weight: 600;
      }
      .pd-dd-resume {
        display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
        font-family: 'dmsans'; font-weight: 600; font-size: 0.78rem; color: rgba(232,232,232,0.72);
        padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
        transition: transform 0.2s ease, border-color 0.25s ease, color 0.25s ease;
      }
      .pd-dd-resume:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--hp-sky) 45%, transparent); color: #fff; }
      .pd-dd-resume:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 3px; }

      .pd-dd-levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-bottom: 1.1rem; }
      .pd-dd-level {
        display: flex; flex-direction: column; align-items: flex-start; gap: 7px; cursor: pointer; text-align: left;
        padding: 11px 13px; border-radius: 13px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.1);
        transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, background 0.25s ease;
      }
      .pd-dd-level:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--hp-sky) 40%, transparent); background: rgba(255,255,255,0.05); }
      .pd-dd-level:active { transform: translateY(0); }
      .pd-dd-level:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 2px; }
      .pd-dd-level.is-active {
        border-color: color-mix(in srgb, var(--hp-sky) 60%, transparent);
        background: linear-gradient(160deg, color-mix(in srgb, var(--hp-blue) 22%, transparent), color-mix(in srgb, var(--hp-blue) 8%, transparent));
        box-shadow: 0 10px 26px -16px color-mix(in srgb, var(--hp-blue) 70%, transparent);
      }
      .pd-dd-level-glyph {
        display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px;
        font-family: 'oswaldbold'; font-size: 0.92rem; color: #fff;
        background: color-mix(in srgb, var(--hp-blue) 38%, transparent); border: 1px solid color-mix(in srgb, var(--hp-sky) 38%, transparent);
      }
      .pd-dd-level-text { display: flex; flex-direction: column; line-height: 1.25; font-family: 'dmsans'; font-size: 0.78rem; color: rgba(232,232,232,0.62); }
      .pd-dd-level-text b { font-family: 'inter'; font-weight: 700; font-size: 0.86rem; color: #f1f1f1; letter-spacing: -0.01em; }

      /* phase rail */
      .pd-dd-rail { margin-bottom: 0.95rem; }
      .pd-dd-rail-track { position: relative; height: 3px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; margin-bottom: 11px; }
      .pd-dd-rail-fill { position: absolute; inset: 0 auto 0 0; border-radius: 999px; background: linear-gradient(90deg, var(--hp-blue), var(--hp-sky)); }
      .pd-dd-rail-steps { display: flex; justify-content: space-between; gap: 4px; }
      .pd-dd-rail-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; min-width: 0; }
      .pd-dd-rail-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.18); transition: background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease; }
      .pd-dd-rail-step.is-lit .pd-dd-rail-dot { background: var(--hp-sky); }
      .pd-dd-rail-step.is-current .pd-dd-rail-dot { transform: scale(1.35); box-shadow: 0 0 0 5px color-mix(in srgb, var(--hp-sky) 20%, transparent); }
      .pd-dd-rail-label {
        font-family: 'inter'; font-size: 0.6rem; letter-spacing: 0.05em; text-transform: uppercase; text-align: center;
        color: rgba(232,232,232,0.4); transition: color 0.35s ease, font-weight 0.2s ease; white-space: nowrap;
      }
      .pd-dd-rail-step.is-lit .pd-dd-rail-label { color: rgba(232,232,232,0.7); }
      .pd-dd-rail-step.is-current .pd-dd-rail-label { color: #fff; font-weight: 700; }

      .pd-dd-desc-wrap { display: grid; margin: 0 0 0.7rem; max-width: 54ch; }
      .pd-dd-desc-wrap > * { grid-area: 1 / 1; }
      .pd-dd-desc { font-family: 'dmsans'; font-size: 0.92rem; line-height: 1.62; color: rgba(232,232,232,0.66); margin: 0; }
      .pd-dd-sizer { visibility: hidden; }
      /* Fixed slot, so the button appearing never moves the schematic */
      .pd-dd-again-slot { min-height: 40px; margin-bottom: 0.4rem; }
      .pd-dd-again {
        display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
        font-family: 'dmsans'; font-weight: 600; font-size: 0.86rem; color: #fff;
        padding: 9px 16px; border-radius: 999px;
        background: color-mix(in srgb, var(--hp-blue) 22%, transparent); border: 1px solid color-mix(in srgb, var(--hp-sky) 42%, transparent);
        transition: transform 0.2s ease, border-color 0.25s ease, background 0.25s ease;
      }
      .pd-dd-again:hover { transform: translateY(-1px); background: color-mix(in srgb, var(--hp-blue) 30%, transparent); }
      .pd-dd-again:active { transform: translateY(0); }
      .pd-dd-again:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 3px; }

      /* component schematic */
      .pd-dd-schema { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: auto; padding-top: 14px; }
      .pd-dd-schema-line {
        position: absolute; left: 6%; right: 6%; top: 9px; height: 2px; border-radius: 999px;
        background: rgba(255,255,255,0.08); overflow: hidden;
      }
      .pd-dd-schema-pulse {
        position: absolute; top: 0; bottom: 0; width: 26%; border-radius: 999px;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hp-sky) 85%, transparent), transparent);
      }
      .pd-dd-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
      .pd-dd-node-dot {
        width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.16);
        border: 1px solid rgba(255,255,255,0.2); box-sizing: border-box;
        transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
      }
      .pd-dd-node-label { font-family: 'inter'; font-weight: 700; font-size: 0.66rem; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(232,232,232,0.55); }
      .pd-dd-node-state {
        font-family: 'dmsans'; font-size: 0.68rem; color: rgba(232,232,232,0.36); letter-spacing: 0.02em;
        transition: color 0.35s ease;
      }
      .pd-dd-node.st-standby .pd-dd-node-dot { background: #f5cf7e; border-color: rgba(245,207,126,0.5); box-shadow: 0 0 0 4px rgba(245,207,126,0.14); }
      .pd-dd-node.st-standby .pd-dd-node-state { color: #f5cf7e; }
      .pd-dd-node.st-active .pd-dd-node-dot { background: var(--hp-sky); border-color: color-mix(in srgb, var(--hp-sky) 70%, transparent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--hp-sky) 22%, transparent); animation: pdNodePulse 1.1s ease-in-out infinite; }
      .pd-dd-node.st-active .pd-dd-node-state { color: var(--hp-sky); font-weight: 600; }
      .pd-dd-node.st-done .pd-dd-node-dot { background: #6fd6a8; border-color: rgba(111,214,168,0.55); box-shadow: 0 0 0 4px rgba(111,214,168,0.16); }
      .pd-dd-node.st-done .pd-dd-node-state { color: #6fd6a8; }
      @keyframes pdNodePulse { 0%,100% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--hp-sky) 22%, transparent); } 50% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--hp-sky) 8%, transparent); } }

      @media (max-width: 760px) {
        .pd-dd { grid-template-columns: 1fr; }
        .pd-dd-glass { min-height: 260px; padding: 22px 16px; }
        .pd-dd-schema { grid-template-columns: repeat(2, 1fr); row-gap: 14px; }
        .pd-dd-schema-line { display: none; }
      }
      @media (max-width: 420px) {
        .pd-dd-levels { grid-template-columns: 1fr; }
        .pd-dd-level { flex-direction: row; align-items: center; }
        .pd-dd-rail-label { display: none; }
        .pd-dd-rail-steps { padding: 0 2px; }
      }
      .pd-dd[data-live="off"] .pd-dd-node-dot { animation-play-state: paused; }
      @media (prefers-reduced-motion: reduce) {
        .pd-dd-node.st-active .pd-dd-node-dot { animation: none; }
      }
    `}</style>
  );
}
