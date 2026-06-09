'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Radio = 'lora' | 'espnow';
type Phase = 'idle' | 'sending' | 'arrived';

const SPRING = [0.16, 1, 0.3, 1] as const;

const TEXTS = [
  'On my way, give me 10',
  'Found the trailhead',
  'Battery at 40%, heading back',
  'Camp is just past the ridge',
];

const RADIO: Record<Radio, {
  label: string;
  short: string;
  band: string;
  range: string;
  rangeNote: string;
  speed: string;
  glyph: 'wave' | 'bolt';
  blurb: string;
}> = {
  lora: {
    label: 'Text over LoRa',
    short: 'LoRa',
    band: '915 MHz · spread spectrum',
    range: 'Kilometres',
    rangeNote: 'open ground, line of sight',
    speed: 'One slow packet at a time',
    glyph: 'wave',
    blurb: 'Long, lazy radio waves trade reach for bandwidth, so messages travel far but arrive a character at a time.',
  },
  espnow: {
    label: 'Voice over ESP-NOW',
    short: 'ESP-NOW',
    band: '2.4 GHz · direct peer link',
    range: '~150 metres',
    rangeNote: 'through a wall or two',
    speed: 'Live, two-way audio',
    glyph: 'bolt',
    blurb: 'A short, direct hop between the two ESP32 radios keeps latency low enough for real conversation.',
  },
};

/* Long, lazy arc for LoRa · viewBox 0 0 520 150 */
const LORA_PATH = 'M 70 108 C 160 8, 360 8, 450 108';
/* Short, near-straight hop for ESP-NOW */
const ESPNOW_PATH = 'M 70 92 C 160 70, 360 70, 450 92';

function useAutoDemo(running: boolean, onTick: () => void, delayMs: number) {
  const cb = useRef(onTick);
  cb.current = onTick;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => cb.current(), delayMs);
    return () => clearTimeout(t);
  });
}

export default function LinkDemo() {
  const reduceMotion = useReducedMotion();

  const [radio, setRadio] = useState<Radio>('lora');
  const [auto, setAuto] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [textIdx, setTextIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [talking, setTalking] = useState(false);
  const [pulse, setPulse] = useState(0);

  const cfg = RADIO[radio];
  const message = TEXTS[textIdx];

  // Auto-play only when motion is welcome; reduced-motion visitors land on a
  // calm static scene they can still drive by hand (chips, toggle, hold-to-talk).
  const autoplay = auto && !reduceMotion;
  const stopAuto = useCallback(() => setAuto(false), []);

  /* ---- LoRa: send a packet, then type it out on the friend's screen ---- */
  const send = useCallback((manual: boolean) => {
    if (manual) stopAuto();
    if (phase !== 'idle') return;
    setPhase('sending');
  }, [phase, stopAuto]);

  useEffect(() => {
    if (radio !== 'lora' || phase !== 'sending') return;
    if (reduceMotion) {
      setTyped(message);
      const t = setTimeout(() => setPhase('arrived'), 700);
      return () => clearTimeout(t);
    }
    setTyped('');
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(message.slice(0, i));
      if (i >= message.length) clearInterval(type);
    }, 78);
    const arrive = setTimeout(() => setPhase('arrived'), 1700);
    return () => { clearInterval(type); clearTimeout(arrive); };
  }, [radio, phase, message, reduceMotion]);

  /* Settle, then reset for the next round */
  useEffect(() => {
    if (phase !== 'arrived') return;
    const t = setTimeout(() => {
      setPhase('idle');
      setTyped('');
      setTalking(false);
    }, radio === 'lora' ? 2200 : 1500);
    return () => clearTimeout(t);
  }, [phase, radio]);

  /* ---- ESP-NOW: hold-to-talk waveform pulse ---- */
  const startTalk = useCallback((manual: boolean) => {
    if (manual) stopAuto();
    setTalking(true);
    setPhase('sending');
  }, [stopAuto]);
  const endTalk = useCallback(() => {
    setTalking(false);
    setPhase((p) => (p === 'sending' ? 'arrived' : p));
  }, []);

  useEffect(() => {
    if (radio !== 'espnow' || !talking) return;
    const t = setInterval(() => setPulse((p) => p + 1), reduceMotion ? 600 : 220);
    return () => clearInterval(t);
  }, [radio, talking, reduceMotion]);

  /* ---- Mode switch ---- */
  const pick = useCallback((r: Radio, manual: boolean) => {
    if (manual) stopAuto();
    setRadio(r);
    setPhase('idle');
    setTyped('');
    setTalking(false);
  }, [stopAuto]);

  /* ---- Auto-demo loop: alternates a LoRa send and an ESP-NOW exchange.
     Gated on `autoplay`, so reduced-motion visitors land on a still scene. ---- */
  useAutoDemo(autoplay && phase === 'idle' && radio === 'lora', () => {
    setTextIdx((n) => (n + 1) % TEXTS.length);
    setPhase('sending');
  }, 1900);
  useAutoDemo(autoplay && phase === 'idle' && radio === 'espnow' && !talking, () => {
    setTalking(true);
    setPhase('sending');
  }, 1100);
  useAutoDemo(autoplay && radio === 'espnow' && talking, () => endTalk(), 2200);
  useAutoDemo(autoplay && phase === 'idle' && radio === 'lora' && textIdx === TEXTS.length - 1 && !talking, () => {
    pick('espnow', false);
  }, 2600);
  useAutoDemo(autoplay && phase === 'idle' && radio === 'espnow' && pulse > 0 && pulse % 6 === 0 && !talking, () => {
    pick('lora', false);
    setPulse(0);
  }, 900);

  const path = radio === 'lora' ? LORA_PATH : ESPNOW_PATH;
  const linkActive = phase === 'sending' || (radio === 'espnow' && talking);

  return (
    <div className={`bl-ld bl-ld-${radio}`} data-no-zoom>
      <div className="bl-ld-head">
        <div className="bl-ld-modes" role="tablist" aria-label="Choose a radio link">
          {(['lora', 'espnow'] as Radio[]).map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={radio === r}
              className={`bl-ld-mode is-${r}${radio === r ? ' is-active' : ''}`}
              onClick={() => pick(r, true)}
            >
              <Glyph kind={RADIO[r].glyph} />
              {RADIO[r].label}
            </button>
          ))}
        </div>
        {!auto && !reduceMotion && (
          <button type="button" className="bl-ld-replay" onClick={() => { setAuto(true); setPhase('idle'); setTalking(false); setTyped(''); }}>
            <RefreshIcon /> Auto-demo
          </button>
        )}
      </div>

      <div className="bl-ld-stage">
        <Handset
          role="you"
          label="You"
          radio={radio}
          phase={phase}
          message={message}
          typed={typed}
          screenText={radio === 'lora' ? (phase === 'idle' ? 'Pick a message' : phase === 'arrived' ? 'Delivered ✓' : 'Sending…') : (talking ? 'Mic live' : 'Hold to talk')}
          talking={radio === 'espnow' && talking}
          pulse={pulse}
          isSender
          reduceMotion={!!reduceMotion}
        />

        <div className="bl-ld-link" aria-hidden="true">
          <svg viewBox="0 0 520 150" className="bl-ld-link-svg" preserveAspectRatio="none">
            <path d={path} className="bl-ld-link-track" />
            <AnimatePresence>
              {linkActive && radio === 'lora' && (
                <motion.path
                  key="lora-draw"
                  d={path}
                  className="bl-ld-link-draw"
                  initial={{ pathLength: 0, opacity: 0.9 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0.5 : 1.5, ease: SPRING }}
                />
              )}
            </AnimatePresence>
            {linkActive && radio === 'espnow' && !reduceMotion && (
              <>
                <motion.path d={path} className="bl-ld-link-draw fast" initial={{ opacity: 0.55 }} animate={{ opacity: [0.25, 0.85, 0.25] }} transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }} />
              </>
            )}
            {linkActive && radio === 'lora' && !reduceMotion && (
              <motion.circle
                key={`packet-${textIdx}`}
                r={5.5}
                className="bl-ld-packet"
                initial={{ offsetDistance: '0%', opacity: 0 }}
                animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, ease: SPRING, times: [0, 0.08, 0.86, 1] }}
                style={{ offsetPath: `path('${path}')` } as React.CSSProperties}
              />
            )}
          </svg>
          <span className={`bl-ld-link-label${linkActive ? ' is-on' : ''}`}>
            {radio === 'lora'
              ? (phase === 'sending' ? 'Packet in flight…' : phase === 'arrived' ? 'Link closed' : 'Long-range hop')
              : (talking ? 'Two-way audio streaming' : 'Direct peer link')}
          </span>
        </div>

        <Handset
          role="friend"
          label="Friend"
          radio={radio}
          phase={phase}
          message={message}
          typed={typed}
          screenText={radio === 'lora' ? (phase === 'arrived' ? 'New message' : phase === 'sending' ? 'Receiving…' : 'Standing by') : (talking ? 'Listening…' : 'Standing by')}
          talking={radio === 'espnow' && talking}
          pulse={pulse}
          reduceMotion={!!reduceMotion}
        />
      </div>

      <div className="bl-ld-controls">
        {radio === 'lora' ? (
          <>
            <span className="bl-ld-controls-label">Pick a message</span>
            <div className="bl-ld-chips">
              {TEXTS.map((t, n) => (
                <button
                  key={t}
                  type="button"
                  className={`bl-ld-chip${textIdx === n ? ' is-active' : ''}`}
                  onClick={() => { stopAuto(); setTextIdx(n); }}
                  disabled={phase !== 'idle'}
                >
                  {t}
                </button>
              ))}
            </div>
            <button type="button" className="bl-ld-send" onClick={() => send(true)} disabled={phase !== 'idle'}>
              <SendIcon /> Send over LoRa
            </button>
          </>
        ) : (
          <>
            <span className="bl-ld-controls-label">Press and hold to talk</span>
            <button
              type="button"
              className={`bl-ld-talk${talking ? ' is-live' : ''}`}
              onPointerDown={() => startTalk(true)}
              onPointerUp={endTalk}
              onPointerLeave={() => talking && endTalk()}
              aria-pressed={talking}
            >
              <MicIcon />
              {talking ? 'Transmitting…' : 'Hold to talk'}
            </button>
          </>
        )}
      </div>

      <div className="bl-ld-compare">
        {(['lora', 'espnow'] as Radio[]).map((r) => {
          const c = RADIO[r];
          return (
            <div key={r} className={`bl-ld-gauge is-${r}${radio === r ? ' is-current' : ''}`}>
              <div className="bl-ld-gauge-top">
                <Glyph kind={c.glyph} />
                <span className="bl-ld-gauge-name">{c.short}</span>
              </div>
              <div className="bl-ld-gauge-track"><span className={`bl-ld-gauge-fill fill-${r}`} /></div>
              <div className="bl-ld-gauge-row"><b>Range</b><span>{c.range}<i>{c.rangeNote}</i></span></div>
              <div className="bl-ld-gauge-row"><b>Carries</b><span>{c.speed}</span></div>
              <p className="bl-ld-gauge-blurb">{c.blurb}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .bl-ld {
          --lora: #7fa8ff; --lora-soft: rgba(127,168,255,0.16);
          --espnow: #f2a154; --espnow-soft: rgba(242,161,84,0.16);
          --acc: var(--lora); --acc-soft: var(--lora-soft);
          margin: 1.5rem 0 0.5rem; padding: clamp(20px, 3vw, 32px);
          border-radius: 22px; position: relative; overflow: hidden;
          background: linear-gradient(160deg, rgba(20,20,30,0.86), rgba(11,11,17,0.94));
          border: 1px solid var(--hp-line);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          transition: border-color 0.5s ease;
        }
        .bl-ld-espnow { --acc: var(--espnow); --acc-soft: var(--espnow-soft); }
        .bl-ld::before {
          content: ''; position: absolute; inset: -40% -10% auto -10%; height: 70%;
          background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--acc) 20%, transparent), transparent 70%);
          opacity: 0.6; pointer-events: none; transition: background 0.6s ease;
        }

        /* ---- Header: mode toggle ---- */
        .bl-ld-head { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: clamp(20px, 3vw, 28px); }
        .bl-ld-modes { display: inline-flex; gap: 6px; padding: 5px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
        .bl-ld-mode {
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          font-family: 'dmsans'; font-weight: 600; font-size: 0.86rem; color: rgba(232,232,232,0.62);
          padding: 9px 16px; border-radius: 10px; border: 1px solid transparent; background: transparent;
          transition: color 0.3s ease, background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
        }
        .bl-ld-mode svg { opacity: 0.7; transition: opacity 0.3s ease; }
        .bl-ld-mode:hover { color: #f1f1f1; transform: translateY(-1px); }
        .bl-ld-mode:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
        .bl-ld-mode.is-active.is-lora { color: #0d1320; background: linear-gradient(135deg, var(--lora), color-mix(in srgb, var(--lora) 60%, var(--hp-indigo))); border-color: transparent; }
        .bl-ld-mode.is-active.is-espnow { color: #1c1306; background: linear-gradient(135deg, var(--espnow), #e8835a); border-color: transparent; }
        .bl-ld-mode.is-active svg { opacity: 1; }
        .bl-ld-replay {
          display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
          font-family: 'dmsans'; font-weight: 600; font-size: 0.8rem; color: rgba(232,232,232,0.6);
          padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          transition: color 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
        }
        .bl-ld-replay:hover { color: #f1f1f1; border-color: color-mix(in srgb, var(--acc) 50%, transparent); transform: translateY(-1px); }
        .bl-ld-replay:active { transform: translateY(0); }
        .bl-ld-replay:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
        .bl-ld-replay svg { opacity: 0.75; }

        /* ---- Stage: handset / link / handset ---- */
        .bl-ld-stage { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(96px, 1.3fr) minmax(0,1fr); align-items: center; gap: clamp(6px, 2vw, 18px); }

        .bl-ld-handset {
          position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 16px 14px 14px; border-radius: 18px;
          background: linear-gradient(170deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 18px 48px -26px rgba(0,0,0,0.75);
        }
        .bl-ld-handset-name { font-family: 'inter'; font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(232,232,232,0.42); }
        .bl-ld-handset-body {
          width: clamp(78px, 16vw, 112px); aspect-ratio: 0.62; border-radius: 16px;
          background: linear-gradient(165deg, #232530, #15161d);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; align-items: center; padding: 12px 9px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -10px 22px rgba(0,0,0,0.35);
          gap: 8px; position: relative;
        }
        .bl-ld-handset-body::after {
          content: ''; position: absolute; left: 50%; bottom: 8px; width: 28px; height: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.1); transform: translateX(-50%);
        }
        .bl-ld-screen {
          width: 100%; flex: 1; border-radius: 7px; background: #060c08; position: relative; overflow: hidden;
          border: 1px solid rgba(127,255,180,0.18);
          box-shadow: inset 0 0 14px rgba(0,0,0,0.7), 0 0 18px -6px color-mix(in srgb, var(--acc) 50%, transparent);
          display: flex; flex-direction: column; justify-content: center; padding: 7px 7px;
          transition: box-shadow 0.4s ease;
        }
        .bl-ld-screen-status { font-family: 'monda'; font-size: 0.5rem; letter-spacing: 0.05em; color: rgba(143,255,189,0.78); line-height: 1.35; }
        .bl-ld-screen-msg { font-family: 'monda'; font-size: 0.5rem; line-height: 1.4; color: rgba(143,255,189,0.92); margin-top: 4px; word-break: break-word; min-height: 2.6em; }
        .bl-ld-screen-cursor { display: inline-block; width: 5px; height: 0.95em; background: rgba(143,255,189,0.85); margin-left: 1px; vertical-align: text-bottom; animation: blCursor 1s steps(1) infinite; }
        @keyframes blCursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .bl-ld-screen-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 30%, rgba(143,255,189,0.1), transparent 70%); pointer-events: none; }
        .bl-ld-handset-led { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.18); transition: background 0.3s ease, box-shadow 0.3s ease; }
        .bl-ld-handset-led.is-on { background: var(--acc); box-shadow: 0 0 0 4px color-mix(in srgb, var(--acc) 22%, transparent); }
        .bl-ld-handset-led.is-blink { animation: blBlink 0.7s steps(1) infinite; }
        @keyframes blBlink { 0%, 100% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--acc) 30%, transparent); } 50% { box-shadow: 0 0 0 4px transparent; } }

        /* Voice waveform inside the OLED */
        .bl-ld-wave { display: flex; align-items: center; justify-content: center; gap: 2.5px; height: 16px; }
        .bl-ld-wave i { display: block; width: 2.5px; border-radius: 999px; background: rgba(143,255,189,0.85); transition: height 0.16s ease, opacity 0.2s ease; }

        /* ---- Link between handsets ---- */
        .bl-ld-link { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90px; gap: 6px; }
        .bl-ld-link-svg { width: 100%; max-width: 280px; height: auto; overflow: visible; }
        .bl-ld-link-track { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 1.6; stroke-dasharray: 3 7; stroke-linecap: round; }
        .bl-ld-link-draw { fill: none; stroke: var(--acc); stroke-width: 2; stroke-linecap: round; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--acc) 65%, transparent)); }
        .bl-ld-link-draw.fast { stroke-width: 2.6; }
        .bl-ld-packet { fill: var(--acc); filter: drop-shadow(0 0 7px color-mix(in srgb, var(--acc) 80%, transparent)); }
        .bl-ld-link-label { font-family: 'inter'; font-size: 0.64rem; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(232,232,232,0.34); transition: color 0.35s ease; text-align: center; }
        .bl-ld-link-label.is-on { color: var(--acc); }

        /* ---- Controls ---- */
        .bl-ld-controls { position: relative; margin-top: clamp(18px, 3vw, 26px); display: flex; flex-direction: column; align-items: center; gap: 13px; text-align: center; }
        .bl-ld-controls-label { font-family: 'inter'; font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(232,232,232,0.4); }
        .bl-ld-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 640px; }
        .bl-ld-chip {
          font-family: 'dmsans'; font-size: 0.84rem; color: rgba(232,232,232,0.78); cursor: pointer;
          padding: 9px 16px; border-radius: 999px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease, transform 0.2s ease, opacity 0.25s ease;
        }
        .bl-ld-chip:hover:not(:disabled) { border-color: color-mix(in srgb, var(--acc) 45%, transparent); transform: translateY(-1px); color: #f1f1f1; }
        .bl-ld-chip:active:not(:disabled) { transform: translateY(0); }
        .bl-ld-chip:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
        .bl-ld-chip.is-active { color: #fff; border-color: color-mix(in srgb, var(--acc) 60%, transparent); background: var(--acc-soft); }
        .bl-ld-chip:disabled { opacity: 0.4; cursor: default; }
        .bl-ld-send, .bl-ld-talk {
          display: inline-flex; align-items: center; gap: 9px; cursor: pointer; -webkit-user-select: none; user-select: none;
          font-family: 'dmsans'; font-weight: 700; font-size: 0.92rem; color: #0d1320;
          padding: 13px 26px; border-radius: 999px; border: 0;
          background: linear-gradient(135deg, var(--lora), color-mix(in srgb, var(--lora) 55%, var(--hp-indigo)));
          box-shadow: 0 14px 32px -14px color-mix(in srgb, var(--lora) 70%, transparent);
          transition: transform 0.2s ease, box-shadow 0.3s ease, opacity 0.25s ease;
        }
        .bl-ld-send:hover:not(:disabled), .bl-ld-talk:hover { transform: translateY(-2px); }
        .bl-ld-send:active:not(:disabled), .bl-ld-talk:active { transform: translateY(0) scale(0.99); }
        .bl-ld-send:focus-visible, .bl-ld-talk:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }
        .bl-ld-send:disabled { opacity: 0.45; cursor: default; transform: none; }
        .bl-ld-talk { color: #1c1306; background: linear-gradient(135deg, var(--espnow), #e8835a); box-shadow: 0 14px 32px -14px rgba(242,161,84,0.55); touch-action: none; }
        .bl-ld-talk.is-live { box-shadow: 0 0 0 7px rgba(242,161,84,0.16), 0 14px 32px -14px rgba(242,161,84,0.7); transform: scale(1.03); }
        .bl-ld-talk svg, .bl-ld-send svg { flex-shrink: 0; }

        /* ---- Range comparison gauges ---- */
        .bl-ld-compare { position: relative; margin-top: clamp(22px, 4vw, 32px); display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .bl-ld-gauge {
          padding: 16px 17px; border-radius: 15px; background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08); transition: border-color 0.4s ease, background 0.4s ease, transform 0.3s ease;
        }
        .bl-ld-gauge.is-current { transform: translateY(-2px); }
        .bl-ld-gauge.is-lora.is-current { border-color: color-mix(in srgb, var(--lora) 45%, transparent); background: rgba(127,168,255,0.05); }
        .bl-ld-gauge.is-espnow.is-current { border-color: color-mix(in srgb, var(--espnow) 45%, transparent); background: rgba(242,161,84,0.055); }
        .bl-ld-gauge-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .bl-ld-gauge.is-lora .bl-ld-gauge-top svg, .bl-ld-gauge.is-lora .bl-ld-gauge-fill { color: var(--lora); }
        .bl-ld-gauge.is-espnow .bl-ld-gauge-top svg, .bl-ld-gauge.is-espnow .bl-ld-gauge-fill { color: var(--espnow); }
        .bl-ld-gauge-name { font-family: 'oswaldbold'; font-size: 0.92rem; letter-spacing: 0.02em; color: #f1f1f1; }
        .bl-ld-gauge-track { height: 5px; border-radius: 999px; background: rgba(255,255,255,0.07); overflow: hidden; margin-bottom: 12px; }
        .bl-ld-gauge-fill { display: block; height: 100%; border-radius: 999px; background: currentColor; opacity: 0.85; }
        .bl-ld-gauge-fill.fill-lora { width: 92%; }
        .bl-ld-gauge-fill.fill-espnow { width: 22%; }
        .bl-ld-gauge-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.06); }
        .bl-ld-gauge-row:first-of-type { border-top: 0; padding-top: 0; }
        .bl-ld-gauge-row b { font-family: 'inter'; font-weight: 700; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; }
        .bl-ld-gauge-row span { font-family: 'dmsans'; font-size: 0.86rem; color: #e2e2ea; text-align: right; }
        .bl-ld-gauge-row span i { display: block; font-style: normal; font-size: 0.72rem; color: rgba(232,232,232,0.46); margin-top: 1px; }
        .bl-ld-gauge-blurb { font-family: 'dmsans'; font-size: 0.84rem; line-height: 1.6; color: rgba(232,232,232,0.56); margin: 11px 0 0; }

        @media (max-width: 760px) {
          .bl-ld-stage { grid-template-columns: 1fr; }
          .bl-ld-link { min-height: 64px; transform: rotate(90deg); margin: -6px 0; }
          .bl-ld-link-svg { max-width: 160px; }
          .bl-ld-link-label { transform: rotate(-90deg); position: absolute; white-space: nowrap; }
          .bl-ld-compare { grid-template-columns: 1fr; }
        }
        @media (max-width: 460px) {
          .bl-ld-mode { font-size: 0.78rem; padding: 8px 12px; }
          .bl-ld-mode span.bl-ld-mode-full { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bl-ld-screen-cursor, .bl-ld-handset-led.is-blink { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────── Handset ───────────────────────── */

function Handset({
  role, label, radio, phase, message, typed, screenText, talking, pulse, isSender, reduceMotion,
}: {
  role: 'you' | 'friend';
  label: string;
  radio: Radio;
  phase: Phase;
  message: string;
  typed: string;
  screenText: string;
  talking: boolean;
  pulse: number;
  isSender?: boolean;
  reduceMotion: boolean;
}) {
  const ledOn = radio === 'lora' ? phase !== 'idle' : talking;
  const ledBlink = radio === 'lora' ? phase === 'sending' : talking;

  return (
    <div className="bl-ld-handset">
      <span className="bl-ld-handset-name">{label}</span>
      <div className="bl-ld-handset-body">
        <div className="bl-ld-screen">
          <div className="bl-ld-screen-glow" aria-hidden="true" />
          {radio === 'lora' ? (
            <>
              <span className="bl-ld-screen-status">{screenText.toUpperCase()}</span>
              <span className="bl-ld-screen-msg">
                {isSender
                  ? (phase === 'idle' ? `“${message}”` : `“${message}” →`)
                  : (typed ? <>“{typed}<span className="bl-ld-screen-cursor" /></> : (phase === 'sending' ? <span className="bl-ld-screen-cursor" /> : '···'))}
              </span>
            </>
          ) : (
            <>
              <span className="bl-ld-screen-status">{screenText.toUpperCase()}</span>
              <Waveform active={talking} pulse={pulse} reduceMotion={reduceMotion} />
            </>
          )}
        </div>
        <span className={`bl-ld-handset-led${ledOn ? ' is-on' : ''}${ledBlink ? ' is-blink' : ''}`} aria-hidden="true" />
      </div>
    </div>
  );
}

function Waveform({ active, pulse, reduceMotion }: { active: boolean; pulse: number; reduceMotion: boolean }) {
  const bars = 9;
  return (
    <div className="bl-ld-wave" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        let h = 4;
        if (active) {
          if (reduceMotion) {
            h = 6 + ((i + pulse) % 4) * 2.5;
          } else {
            const seed = (i * 13 + pulse * 7) % 11;
            h = 4 + seed * 1.35;
          }
        }
        return <i key={i} style={{ height: `${h}px`, opacity: active ? 1 : 0.32 }} />;
      })}
    </div>
  );
}

/* ───────────────────────── Icons ───────────────────────── */

function Glyph({ kind }: { kind: 'wave' | 'bolt' }) {
  if (kind === 'wave') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0 2 4 2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2.5" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M8.5 21h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 0115.3-6.4M21 12a9 9 0 01-15.3 6.4M3 4v5h5M21 20v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
