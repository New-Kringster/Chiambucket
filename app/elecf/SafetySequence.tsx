'use client';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Step = {
  key: string;
  img: string;
  label: string;
  title: string;
  desc: string;
  pir: string;
  tof: string;
  tofClosed: boolean;
  alarm: 'idle' | 'armed' | 'sounding';
  tone: 'calm' | 'warn' | 'alarm';
};

const STEPS: Step[] = [
  {
    key: 'open',
    img: '/images/elecf-door-open.png',
    label: 'Door open',
    title: 'Set the timer',
    desc: 'A worker steps into the freezer. The PIR sensor reads their body heat and movement, while the ToF sensor sees the door as open. On the M5Stack, you set how long the door is allowed to stay shut.',
    pir: 'Presence detected',
    tof: 'Door open',
    tofClosed: false,
    alarm: 'idle',
    tone: 'calm',
  },
  {
    key: 'armed',
    img: '/images/elecf-door-armed.png',
    label: 'Door closed',
    title: 'Armed and counting',
    desc: 'The door swings shut. The ToF sensor flips to closed and the countdown arms itself. If the room empties before time runs out, the system quietly resets, no fuss.',
    pir: 'Still inside',
    tof: 'Door closed',
    tofClosed: true,
    alarm: 'armed',
    tone: 'warn',
  },
  {
    key: 'alarm',
    img: '/images/elecf-warning.png',
    label: 'Overtime',
    title: 'Overtime, alarm',
    desc: 'Time runs out with someone still inside. The RGB unit flashes and the M5Stack buzzer sounds to alert anyone nearby. Opening the door cancels the alarm at once.',
    pir: 'Still inside',
    tof: 'Door closed',
    tofClosed: true,
    alarm: 'sounding',
    tone: 'alarm',
  },
];

export default function SafetySequence() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const step = STEPS[i];

  const goto = useCallback((n: number, manual = true) => {
    if (manual) setAuto(false);
    setI(((n % STEPS.length) + STEPS.length) % STEPS.length);
  }, []);

  // Auto-advance the demo until the visitor takes over
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((p) => (p + 1) % STEPS.length), 3000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <div className={`ef-seq tone-${step.tone}`} data-no-zoom>
      <div className="ef-seq-media">
        <div className="ef-seq-glow" aria-hidden="true" />
        <div className="ef-seq-screen">
          <AnimatePresence mode="wait">
            <motion.img
              key={step.key}
              src={step.img}
              alt={`M5Stack screen: ${step.title}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              draggable={false}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="ef-seq-info">
        <span className="ef-seq-eyebrow">Step {i + 1} of 3 · {step.label}</span>
        <h3 className="ef-seq-title">{step.title}</h3>
        <p className="ef-seq-desc">{step.desc}</p>

        <div className="ef-seq-sensors">
          <div className="ef-chip on">
            <span className="ef-chip-dot" />
            <span className="ef-chip-txt"><b>PIR</b>{step.pir}</span>
          </div>
          <div className={`ef-chip ${step.tofClosed ? 'closed' : 'open'}`}>
            <span className="ef-chip-dot" />
            <span className="ef-chip-txt"><b>ToF</b>{step.tof}</span>
          </div>
          <div className={`ef-chip alarm-${step.alarm}`}>
            <span className="ef-chip-dot" />
            <span className="ef-chip-txt"><b>Alert</b>{step.alarm === 'sounding' ? 'RGB + buzzer' : step.alarm === 'armed' ? 'Armed' : 'Standby'}</span>
          </div>
        </div>

        <div className="ef-seq-controls">
          <div className="ef-seq-dots" role="tablist" aria-label="Sequence steps">
            {STEPS.map((s, n) => (
              <button
                key={s.key}
                className={`ef-seq-dot${n === i ? ' is-active' : ''}`}
                onClick={() => goto(n)}
                role="tab"
                aria-selected={n === i}
                aria-label={`Step ${n + 1}: ${s.title}`}
              />
            ))}
          </div>
          <div className="ef-seq-btns">
            <button className="ef-seq-nav" onClick={() => goto(i - 1)} aria-label="Previous step">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="ef-seq-nav primary" onClick={() => goto(i + 1)} aria-label="Next step">
              Next
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ef-seq {
          --calm: #7c83ff; --warn: #f5b13d; --alarm: #ff5a4d;
          --accent: var(--calm);
          display: grid; grid-template-columns: 0.86fr 1.14fr; gap: clamp(20px, 3vw, 40px);
          align-items: center; margin: 1.4rem 0 0.6rem;
          padding: clamp(20px, 3vw, 34px); border-radius: 22px;
          background: linear-gradient(160deg, rgba(20,18,32,0.86), rgba(12,11,20,0.92));
          border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
          transition: border-color 0.5s ease;
        }
        .ef-seq.tone-warn { --accent: var(--warn); }
        .ef-seq.tone-alarm { --accent: var(--alarm); border-color: rgba(255,90,77,0.4); }
        .ef-seq-media { position: relative; display: grid; place-items: center; min-height: 230px; }
        .ef-seq-glow {
          position: absolute; width: 70%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 68%);
          filter: blur(34px); opacity: 0.7; transition: background 0.5s ease; pointer-events: none;
        }
        .ef-seq.tone-alarm .ef-seq-glow { animation: efAlarmGlow 0.9s ease-in-out infinite; }
        @keyframes efAlarmGlow { 0%,100% { opacity: 0.45; transform: scale(0.96); } 50% { opacity: 0.95; transform: scale(1.05); } }
        .ef-seq-screen { position: relative; width: min(260px, 78%); }
        .ef-seq-screen img {
          width: 100%; display: block; border-radius: 16px;
          box-shadow: 0 24px 60px -24px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06);
        }
        .ef-seq-eyebrow {
          font-family: 'inter'; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--accent); font-weight: 600; transition: color 0.4s ease;
        }
        .ef-seq-title { font-family: 'oswaldbold'; font-size: clamp(1.3rem, 2.4vw, 1.7rem); color: #f1f1f1; margin: 0.45rem 0 0.5rem; letter-spacing: -0.01em; }
        .ef-seq-desc { font-family: 'dmsans'; font-size: 0.98rem; line-height: 1.66; color: rgba(232,232,232,0.7); margin: 0 0 1.1rem; max-width: 52ch; }
        .ef-seq-sensors { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1.2rem; }
        .ef-chip {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 9px 14px 9px 12px; border-radius: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          transition: border-color 0.4s ease, background 0.4s ease;
        }
        .ef-chip-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.3); flex-shrink: 0; transition: background 0.4s ease, box-shadow 0.4s ease; }
        .ef-chip-txt { display: flex; flex-direction: column; line-height: 1.2; font-family: 'dmsans'; font-size: 0.82rem; color: #dcdce4; }
        .ef-chip-txt b { font-family: 'inter'; font-weight: 700; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .ef-chip.on .ef-chip-dot { background: #34d399; box-shadow: 0 0 0 4px rgba(52,211,153,0.16); }
        .ef-chip.open .ef-chip-dot { background: var(--warn); box-shadow: 0 0 0 4px rgba(245,177,61,0.16); }
        .ef-chip.closed .ef-chip-dot { background: #4f9dff; box-shadow: 0 0 0 4px rgba(79,157,255,0.16); }
        .ef-chip.alarm-armed { border-color: rgba(245,177,61,0.4); }
        .ef-chip.alarm-armed .ef-chip-dot { background: var(--warn); box-shadow: 0 0 0 4px rgba(245,177,61,0.18); }
        .ef-chip.alarm-sounding { border-color: rgba(255,90,77,0.55); background: rgba(255,90,77,0.08); }
        .ef-chip.alarm-sounding .ef-chip-dot { background: var(--alarm); animation: efBlink 0.5s steps(1) infinite; }
        @keyframes efBlink { 0%,100% { box-shadow: 0 0 0 4px rgba(255,90,77,0.35); } 50% { box-shadow: 0 0 0 4px rgba(255,90,77,0); } }
        .ef-seq-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .ef-seq-dots { display: flex; gap: 8px; }
        .ef-seq-dot {
          width: 26px; height: 6px; border-radius: 999px; border: 0; cursor: pointer; padding: 0;
          background: rgba(255,255,255,0.16); transition: background 0.3s ease, width 0.3s ease;
        }
        .ef-seq-dot:hover { background: rgba(255,255,255,0.3); }
        .ef-seq-dot.is-active { width: 38px; background: var(--accent); }
        .ef-seq-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .ef-seq-btns { display: flex; gap: 8px; }
        .ef-seq-nav {
          display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
          font-family: 'dmsans'; font-weight: 600; font-size: 0.9rem; color: #e8e8e8;
          padding: 9px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
          transition: transform 0.2s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .ef-seq-nav.primary { background: color-mix(in srgb, var(--accent) 18%, transparent); border-color: color-mix(in srgb, var(--accent) 45%, transparent); color: #fff; }
        .ef-seq-nav:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--accent) 55%, transparent); }
        .ef-seq-nav:active { transform: translateY(0); }
        .ef-seq-nav:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        @media (max-width: 680px) {
          .ef-seq { grid-template-columns: 1fr; gap: 22px; }
          .ef-seq-media { min-height: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ef-seq.tone-alarm .ef-seq-glow, .ef-chip.alarm-sounding .ef-chip-dot { animation: none; }
        }
      `}</style>
    </div>
  );
}
