'use client';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Live room state the script mutates ──────────────────────────── */
type Room = {
  whiteLed: { on: boolean; bright: number };
  rgb: { on: boolean; r: number; g: number; b: number };
  fan: boolean;
  servo: number;
  buzzer: boolean;
  auto: boolean;
  timer: string | null;
  reply: string;
};

const SENSORS = { temp: 24.3, humidity: 69, motion: true, dark: true };

const START: Room = {
  whiteLed: { on: false, bright: 0 },
  rgb: { on: false, r: 0, g: 0, b: 0 },
  fan: false,
  servo: 90,
  buzzer: false,
  auto: true,
  timer: null,
  reply: 'Ready. Say "Hello Robot" or hold to talk.',
};

/* ── The demo script: each line is one real LUMEN exchange ───────── */
type Step = {
  trigger: 'ptt' | 'wake';
  said: string;
  json: string;
  reply: string;
  apply: (r: Room) => Room;
};

const SCRIPT: Step[] = [
  {
    trigger: 'ptt',
    said: 'Set the light to cyan and turn the fan on a second later.',
    json: `{ "type": "sequence", "steps": [
  { "delay_ms": 0, "device": "rgb_led",
    "action": "set_rgb", "r": 0, "g": 255, "b": 255 },
  { "delay_ms": 1000, "device": "fan", "action": "turn_on" }
] }`,
    reply: 'Cyan now, fan in 1s.',
    apply: (r) => ({ ...r, rgb: { on: true, r: 0, g: 255, b: 255 }, fan: true, auto: false }),
  },
  {
    trigger: 'wake',
    said: 'Set the brightness to the humidity percentage.',
    json: `{ "type": "action", "device": "white_led",
  "action": "set_brightness", "value": 69 }
// STATE.sensors.humidity = 69% → clamped`,
    reply: 'Brightness set to 69%.',
    apply: (r) => ({ ...r, whiteLed: { on: true, bright: 69 }, auto: false }),
  },
  {
    trigger: 'ptt',
    said: 'Turn the light off in ten minutes.',
    json: `{ "type": "timer", "device": "white_led",
  "action": "turn_off", "delay_seconds": 600,
  "label": "10 min light off" }`,
    reply: 'Light off in 10 min.',
    apply: (r) => ({ ...r, timer: '10 min · light off' }),
  },
  {
    trigger: 'ptt',
    said: "What's the temperature in here?",
    json: `{ "type": "action", "device": "none",
  "action": "report",
  "response_text": "24.3°C in here." }
// answered from live sensor state`,
    reply: '24.3°C in here.',
    apply: (r) => r,
  },
  {
    trigger: 'wake',
    said: 'Good night.',
    json: `{ "type": "sequence", "steps": [
  { "device": "white_led", "action": "turn_off" },
  { "device": "rgb_led",  "action": "turn_off" },
  { "device": "fan",      "action": "turn_off" },
  { "device": "auto_mode","action": "disable" }
] }`,
    reply: 'Good night.',
    apply: (r) => ({
      ...r,
      whiteLed: { on: false, bright: 0 },
      rgb: { on: false, r: 0, g: 0, b: 0 },
      fan: false,
      auto: false,
      timer: null,
    }),
  },
  {
    trigger: 'ptt',
    said: 'Make me a sandwich.',
    json: `{ "type": "action", "device": "none",
  "action": "noop",
  "response_text": "Sorry, I can't do that." }`,
    reply: "Sorry, I can't do that.",
    apply: (r) => r,
  },
];

/* Pipeline the request travels through, mirrored from the real path. */
const STAGES = ['Trigger', 'Whisper', 'DeepSeek', 'MQTT'] as const;
// idle = -1, then 0..3 light up, 4 = executed on device
const STAGE_AT = { listen: 0, stt: 1, llm: 2, exec: 3 };

export default function LumenConsole() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'listen' | 'stt' | 'llm' | 'exec' | 'done'>('idle');
  const [room, setRoom] = useState<Room>(START);
  const [playing, setPlaying] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, reduce ? ms * 0.4 : ms)); };

  const run = useCallback((i: number) => {
    clearTimers();
    const step = SCRIPT[i];
    setPhase('listen');
    after(700, () => setPhase('stt'));
    after(1500, () => setPhase('llm'));
    after(2500, () => setPhase('exec'));
    after(3050, () => {
      setRoom((r) => ({ ...step.apply(r), reply: step.reply }));
      setPhase('done');
    });
  }, [reduce]);

  // auto-advance through the script
  useEffect(() => {
    run(idx);
    if (!playing) return;
    const adv = setTimeout(() => setIdx((n) => (n + 1) % SCRIPT.length), reduce ? 3200 : 5200);
    return () => clearTimeout(adv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, playing]);

  useEffect(() => () => clearTimers(), []);

  const pick = (i: number) => { setPlaying(false); setIdx(i); };

  const step = SCRIPT[idx];
  const activeStage =
    phase === 'idle' ? -1 :
    phase === 'done' || phase === 'exec' ? STAGE_AT.exec :
    STAGE_AT[phase];
  const rgbCss = `rgb(${step ? room.rgb.r : 0}, ${room.rgb.g}, ${room.rgb.b})`;

  return (
    <LazyMotion features={domAnimation}>
      <div className="lm-cl" data-no-zoom>
        {/* ── Console: what was heard → what was parsed ── */}
        <div className="lm-cl-console">
          <div className="lm-cl-bar">
            <span className="lm-cl-dot" />
            <span className="lm-cl-bar-t">LUMEN console</span>
            <span className={`lm-cl-trig ${step.trigger}`}>
              {step.trigger === 'wake' ? '“Hello Robot”' : 'push-to-talk'}
            </span>
          </div>

          {/* pipeline */}
          <div className="lm-cl-pipe" role="list" aria-label="Request pipeline">
            {STAGES.map((s, n) => (
              <div key={s} className={`lm-cl-node${n <= activeStage ? ' on' : ''}${n === activeStage && phase !== 'done' ? ' live' : ''}`} role="listitem">
                <span className="lm-cl-node-d" />
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* heard */}
          <div className="lm-cl-line">
            <span className="lm-cl-k">heard</span>
            <AnimatePresence mode="wait">
              <m.p
                key={idx + '-said'}
                className="lm-cl-said"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                “{step.said}”
              </m.p>
            </AnimatePresence>
          </div>

          {/* parsed JSON */}
          <div className="lm-cl-line">
            <span className="lm-cl-k">parsed</span>
            <div className="lm-cl-jsonwrap">
              <AnimatePresence mode="wait">
                {activeStage >= STAGE_AT.exec ? (
                  <m.pre
                    key={idx + '-json'}
                    className="lm-cl-json"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.json}
                  </m.pre>
                ) : (
                  <m.div key={idx + '-think'} className="lm-cl-think" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span /><span /><span />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* spoken reply */}
          <div className="lm-cl-reply">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
            <AnimatePresence mode="wait">
              <m.span key={room.reply} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {room.reply}
              </m.span>
            </AnimatePresence>
          </div>
        </div>

        {/* ── The room reacting ── */}
        <div className="lm-cl-room">
          <div className="lm-cl-room-h">
            <span>The room</span>
            <span className={`lm-cl-auto${room.auto ? ' on' : ''}`}>auto-mode {room.auto ? 'on' : 'off'}</span>
          </div>

          <div className="lm-cl-devices">
            {/* white LED */}
            <div className={`lm-cl-dev${room.whiteLed.on ? ' on' : ''}`}>
              <div className="lm-cl-dev-ico" style={{ filter: room.whiteLed.on ? `drop-shadow(0 0 10px rgba(255,240,200,${0.25 + room.whiteLed.bright / 160}))` : 'none' }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M9 18h6m-5 3h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span className="lm-cl-dev-n">White LED</span>
              <div className="lm-cl-bright"><span style={{ width: `${room.whiteLed.on ? room.whiteLed.bright : 0}%` }} /></div>
              <span className="lm-cl-dev-v">{room.whiteLed.on ? `${room.whiteLed.bright}%` : 'off'}</span>
            </div>

            {/* RGB */}
            <div className={`lm-cl-dev${room.rgb.on ? ' on' : ''}`}>
              <div className="lm-cl-swatch" style={{ background: room.rgb.on ? rgbCss : 'transparent', boxShadow: room.rgb.on ? `0 0 16px ${rgbCss}` : 'none' }} />
              <span className="lm-cl-dev-n">NeoPixel</span>
              <span className="lm-cl-dev-v">{room.rgb.on ? `${room.rgb.r},${room.rgb.g},${room.rgb.b}` : 'off'}</span>
            </div>

            {/* fan */}
            <div className={`lm-cl-dev${room.fan ? ' on' : ''}`}>
              <m.div className="lm-cl-dev-ico" animate={room.fan && !reduce ? { rotate: 360 } : { rotate: 0 }} transition={room.fan && !reduce ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 12c0-3 1-5 3-5s3 2 1 4m-4 1c3 0 5 1 5 3s-2 3-4 1m-1-4c0 3-1 5-3 5s-3-2-1-4m4-1c-3 0-5-1-5-3s2-3 4-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></svg>
              </m.div>
              <span className="lm-cl-dev-n">Fan</span>
              <span className="lm-cl-dev-v">{room.fan ? 'on' : 'off'}</span>
            </div>

            {/* servo */}
            <div className="lm-cl-dev on">
              <div className="lm-cl-dev-ico">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <path d="M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <m.line x1="12" y1="18" x2="12" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ originX: '12px', originY: '18px' }} animate={{ rotate: room.servo - 90 }} transition={{ type: reduce ? 'tween' : 'spring', stiffness: 120, damping: 12 }} />
                  <circle cx="12" cy="18" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="lm-cl-dev-n">Servo</span>
              <span className="lm-cl-dev-v">{room.servo}°</span>
            </div>
          </div>

          {/* live sensors */}
          <div className="lm-cl-sensors">
            <span className="lm-cl-chip">{SENSORS.temp}°C</span>
            <span className="lm-cl-chip">{SENSORS.humidity}% RH</span>
            <span className={`lm-cl-chip${SENSORS.motion ? ' hot' : ''}`}>{SENSORS.motion ? 'motion' : 'still'}</span>
            <span className={`lm-cl-chip${SENSORS.dark ? ' hot' : ''}`}>{SENSORS.dark ? 'dark' : 'lit'}</span>
            <AnimatePresence>
              {room.timer && (
                <m.span className="lm-cl-chip timer" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  ⏱ {room.timer}
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Pick a phrase ── */}
        <div className="lm-cl-picks">
          {SCRIPT.map((s, i) => (
            <button key={i} className={`lm-cl-pick${i === idx ? ' active' : ''}`} onClick={() => pick(i)}>
              {s.said.length > 34 ? s.said.slice(0, 32) + '…' : s.said}
            </button>
          ))}
          <button className={`lm-cl-pick play${playing ? ' active' : ''}`} onClick={() => setPlaying((p) => !p)}>
            {playing ? '❚❚ auto' : '▶ auto'}
          </button>
        </div>

        <style>{`
          .lm-cl {
            --lm: var(--hp-sky, #7fa8ff); --lm-deep: var(--hp-indigo, #5e79db);
            display: grid; grid-template-columns: 1.18fr 0.82fr; gap: 16px;
            margin: 1.5rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px);
            border-radius: 22px; position: relative; overflow: hidden;
            background: linear-gradient(165deg, rgba(20,22,38,0.9), rgba(10,11,20,0.94));
            border: 1px solid var(--hp-line, rgba(255,255,255,0.1));
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            font-family: var(--font-dmsans, inherit);
          }
          .lm-cl-console { display: flex; flex-direction: column; gap: 13px; min-width: 0; }
          .lm-cl-bar { display: flex; align-items: center; gap: 9px; }
          .lm-cl-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lm); box-shadow: 0 0 9px var(--lm); flex: none; }
          .lm-cl-bar-t { font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; color: #c4ccde; font-weight: 600; }
          .lm-cl-trig { margin-left: auto; font-size: 0.68rem; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--hp-line); color: #aeb8cc; white-space: nowrap; }
          .lm-cl-trig.wake { color: var(--lm); border-color: color-mix(in srgb, var(--lm) 45%, transparent); }

          .lm-cl-pipe { display: flex; gap: 6px; flex-wrap: wrap; }
          .lm-cl-node { display: flex; align-items: center; gap: 6px; font-size: 0.68rem; color: #6d768a; padding: 4px 9px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); transition: color 0.3s, border-color 0.3s, background 0.3s; }
          .lm-cl-node-d { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
          .lm-cl-node.on { color: var(--lm); border-color: color-mix(in srgb, var(--lm) 35%, transparent); background: color-mix(in srgb, var(--lm) 9%, transparent); }
          .lm-cl-node.live .lm-cl-node-d { animation: lm-pulse 0.9s ease-in-out infinite; }
          @keyframes lm-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } }

          .lm-cl-line { display: flex; flex-direction: column; gap: 5px; }
          .lm-cl-k { font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #6d768a; }
          .lm-cl-said { margin: 0; font-size: 1.02rem; line-height: 1.4; color: #eef1f7; font-style: italic; min-height: 2.8em; }
          .lm-cl-jsonwrap { min-height: 150px; }
          .lm-cl-json { margin: 0; font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.74rem; line-height: 1.5; color: #b7e3c8; white-space: pre-wrap; word-break: break-word;
            background: rgba(0,0,0,0.32); border: 1px solid rgba(255,255,255,0.07); border-radius: 11px; padding: 11px 13px; }
          .lm-cl-think { display: flex; gap: 6px; align-items: center; padding: 16px 13px; }
          .lm-cl-think span { width: 7px; height: 7px; border-radius: 50%; background: var(--lm); opacity: 0.4; animation: lm-think 1s ease-in-out infinite; }
          .lm-cl-think span:nth-child(2) { animation-delay: 0.15s; } .lm-cl-think span:nth-child(3) { animation-delay: 0.3s; }
          @keyframes lm-think { 0%,100% { opacity: 0.25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-4px); } }

          .lm-cl-reply { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: var(--lm); }
          .lm-cl-reply svg { flex: none; }

          .lm-cl-room { display: flex; flex-direction: column; gap: 12px; background: rgba(0,0,0,0.22); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 14px; }
          .lm-cl-room-h { display: flex; align-items: center; justify-content: space-between; font-size: 0.74rem; letter-spacing: 0.1em; text-transform: uppercase; color: #c4ccde; font-weight: 600; }
          .lm-cl-auto { font-size: 0.62rem; letter-spacing: 0.04em; text-transform: none; padding: 3px 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); color: #6d768a; }
          .lm-cl-auto.on { color: #7fe0a8; border-color: rgba(127,224,168,0.4); background: rgba(127,224,168,0.08); }

          .lm-cl-devices { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
          .lm-cl-dev { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; align-items: center; gap: 2px 9px; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: #7c869a; transition: border-color 0.3s, background 0.3s; }
          .lm-cl-dev.on { color: #eef1f7; border-color: color-mix(in srgb, var(--lm) 30%, transparent); background: color-mix(in srgb, var(--lm) 7%, transparent); }
          .lm-cl-dev-ico { grid-row: 1 / 3; display: flex; align-items: center; justify-content: center; }
          .lm-cl-dev-n { font-size: 0.78rem; font-weight: 600; align-self: end; }
          .lm-cl-dev-v { font-size: 0.68rem; color: #8b94a8; align-self: start; }
          .lm-cl-dev.on .lm-cl-dev-v { color: var(--lm); }
          .lm-cl-bright { grid-column: 1 / 3; height: 4px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; margin-top: 3px; }
          .lm-cl-bright span { display: block; height: 100%; background: linear-gradient(90deg, var(--lm-deep), var(--lm)); border-radius: 999px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
          .lm-cl-swatch { grid-row: 1 / 3; width: 26px; height: 26px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.14); transition: background 0.5s, box-shadow 0.5s; }

          .lm-cl-sensors { display: flex; flex-wrap: wrap; align-content: flex-start; gap: 6px; margin-top: auto; min-height: 52px; }
          .lm-cl-chip { font-size: 0.66rem; padding: 4px 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); color: #aeb8cc; }
          .lm-cl-chip.hot { color: var(--lm); border-color: color-mix(in srgb, var(--lm) 35%, transparent); }
          .lm-cl-chip.timer { color: #f5c97a; border-color: rgba(245,201,122,0.4); background: rgba(245,201,122,0.08); }

          .lm-cl-picks { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 7px; padding-top: 4px; }
          .lm-cl-pick { font-size: 0.72rem; padding: 6px 11px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: #aeb8cc; cursor: pointer; transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.15s; }
          .lm-cl-pick:hover { color: #eef1f7; border-color: color-mix(in srgb, var(--lm) 45%, transparent); }
          .lm-cl-pick:active { transform: scale(0.97); }
          .lm-cl-pick:focus-visible { outline: 2px solid var(--lm); outline-offset: 2px; }
          .lm-cl-pick.active { color: #fff; border-color: var(--lm); background: color-mix(in srgb, var(--lm) 16%, transparent); }
          .lm-cl-pick.play { margin-left: auto; }

          @media (max-width: 720px) {
            .lm-cl { grid-template-columns: 1fr; }
          }
          @media (prefers-reduced-motion: reduce) {
            .lm-cl-node.live .lm-cl-node-d, .lm-cl-think span { animation: none; }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
