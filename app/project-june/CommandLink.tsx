'use client';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────────────
 * Signal path: commands go left to right, video and telemetry come back.
 * Facts from the architecture diagram and the parts poster.
 * ──────────────────────────────────────────────────────────────────────── */
type NodeKey = 'pad' | 'server' | 'phones' | 'rover';

type LinkNode = {
  key: NodeKey;
  label: string;
  sub: string;
  blurb: string;
  icon: ReactNode;
};

const PadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="8.5" cy="12.5" r="1.4" fill="currentColor" />
    <path d="M14.5 11.5h3M14.5 13.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M9 5.2c1-.7 2-1 3-1s2 .3 3 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const ServerIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="16" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="4" y="13" width="16" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7.5 7.5h2M7.5 16.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="7" y="3" width="10" height="18" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.5 18h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const RoverIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <rect x="3.5" y="9" width="17" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="7.5" cy="18.5" r="1.6" fill="currentColor" />
    <circle cx="16.5" cy="18.5" r="1.6" fill="currentColor" />
    <path d="M9 9V6.6c0-.6.4-1 1-1h4c.6 0 1 .4 1 1V9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 5.6V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const LINK: LinkNode[] = [
  {
    key: 'pad',
    label: 'Xbox controller',
    sub: 'Bluetooth to the console',
    icon: <PadIcon />,
    blurb: 'The controller pairs with the web console over Bluetooth. The console turns stick and trigger input into movement commands and publishes them over MQTT.',
  },
  {
    key: 'server',
    label: 'Server',
    sub: 'MQTT, signalling, TURN',
    icon: <ServerIcon />,
    blurb: 'Mosquitto brokers the commands and the telemetry. A Node.js Socket.IO server serves the console and does the WebRTC signalling, and CoTURN relays the video so it works over mobile data.',
  },
  {
    key: 'phones',
    label: 'Three phones',
    sub: '5G hotspot and cameras',
    icon: <PhoneIcon />,
    blurb: 'Phone 1 is the main 5G hotspot and the front camera. Phone 2 is a second hotspot and the left camera. Phone 3 joins the hotspot and is the right camera. Each sends its view as a WebRTC stream.',
  },
  {
    key: 'rover',
    label: 'ESP32-S3',
    sub: 'On the rover',
    icon: <RoverIcon />,
    blurb: 'Joins the phone hotspot over Wi-Fi, drives the motor through the MOSFET driver and sends sensor data back over MQTT in three packets at about 10 Hz.',
  },
];
/* The longest blurb sizes the blurb box, so cycling never reflows the page. */
const LONGEST_BLURB = LINK.reduce((a, n) => (n.blurb.length > a.blurb.length ? n : a), LINK[0]);

/* ────────────────────────────────────────────────────────────────────────
 * Day and night runs, each with its own footage and telemetry
 * ──────────────────────────────────────────────────────────────────────── */
type Mode = 'day' | 'night';

type BrightLevel = 'Dark' | 'Ambient' | 'Bright' | 'VBright';
const BRIGHT_SCALE: BrightLevel[] = ['Dark', 'Ambient', 'Bright', 'VBright'];

type TeleBase = { lat: number; lon: number; speed: number; alt: number; temp: number; hum: number; sats: number; bright: BrightLevel; loc: string };
const TELE: Record<Mode, TeleBase> = {
  day:   { lat: 1.4614, lon: 103.8405, speed: 2, alt: -12, temp: 30.2, hum: 65, sats: 21, bright: 'VBright', loc: 'Irau Dr' },
  night: { lat: 1.4602, lon: 103.8359, speed: 3, alt: 4,   temp: 29.2, hum: 67, sats: 26, bright: 'Dark',    loc: 'Sembawang Park' },
};

type Metric = { key: keyof TeleBase; label: string; unit: string; dp: number; jit: number; min?: number; signed?: boolean };
const METRICS: Metric[] = [
  { key: 'lat', label: 'Latitude', unit: '°N', dp: 4, jit: 0.0004 },
  { key: 'lon', label: 'Longitude', unit: '°E', dp: 4, jit: 0.0004 },
  { key: 'speed', label: 'Speed', unit: 'km/h', dp: 1, jit: 0.7, min: 0 },
  { key: 'alt', label: 'Altitude', unit: 'm', dp: 0, jit: 1.4, signed: true },
  { key: 'temp', label: 'Temperature', unit: '°C', dp: 1, jit: 0.2 },
  { key: 'hum', label: 'Humidity', unit: '%', dp: 0, jit: 1.2 },
  { key: 'sats', label: 'Satellites', unit: '', dp: 0, jit: 1.6, min: 0 },
];

const jitterStr = (m: Metric, base: number) => {
  let v = base + (Math.random() - 0.5) * 2 * m.jit;
  if (m.min !== undefined && v < m.min) v = m.min;
  const s = v.toFixed(m.dp);
  return m.signed && v >= 0 ? `+${s}` : s;
};
const snapVals = (b: TeleBase): Record<string, string> =>
  Object.fromEntries(METRICS.map((m) => [m.key, jitterStr(m, b[m.key] as number)]));
/* Jitter-free snapshot for the FIRST render: the server and the hydrating
   client must produce identical text or React reports a hydration mismatch. */
const baseVals = (b: TeleBase): Record<string, string> =>
  Object.fromEntries(
    METRICS.map((m) => {
      const v = b[m.key] as number;
      const s = v.toFixed(m.dp);
      return [m.key, m.signed && v >= 0 ? `+${s}` : s];
    })
  );

/* ────────────────────────────────────────────────────────────────────────
 * Camera feeds: one per phone
 * ──────────────────────────────────────────────────────────────────────── */
type FeedKey = 'left' | 'center' | 'right';
type Feed = { key: FeedKey; label: string; phone: string; note: string };
const FEEDS: Feed[] = [
  { key: 'left', label: 'Left', phone: 'Phone 2', note: 'Phone 2: the second hotspot and the left camera.' },
  { key: 'center', label: 'Front', phone: 'Phone 1', note: 'Phone 1: the main 5G hotspot and the front camera.' },
  { key: 'right', label: 'Right', phone: 'Phone 3', note: 'Phone 3: joins the hotspot and is the right camera.' },
];
const camSrc = (k: FeedKey, m: Mode) => `/videos/rover-${k}-${m}.mp4`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 2.6v2.4M12 19v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.6 12h2.4M19 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M20 14.4A8 8 0 019.6 4 7 7 0 1020 14.4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export default function CommandLink() {
  const reduceMotion = !!useReducedMotion();
  const [mode, setMode] = useState<Mode>('day');
  const base = TELE[mode];

  /* Run only while on screen: auto-advance, telemetry ticks, packet flow and video */
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !seen) return;
    el.querySelectorAll('video').forEach((v) => {
      if (inView && !reduceMotion) v.play().catch(() => {});
      else v.pause();
    });
  }, [inView, seen, reduceMotion, mode]);

  /* ── Signal path state ── */
  const [active, setActive] = useState<NodeKey>('pad');
  const [pinned, setPinned] = useState(false);
  const node = useMemo(() => LINK.find((n) => n.key === active) ?? LINK[0], [active]);
  const idx = LINK.findIndex((n) => n.key === active);

  useEffect(() => {
    if (pinned || reduceMotion || !inView) return;
    const t = setInterval(() => {
      setActive((cur) => {
        const i = LINK.findIndex((n) => n.key === cur);
        return LINK[(i + 1) % LINK.length].key;
      });
    }, 3200);
    return () => clearInterval(t);
  }, [pinned, reduceMotion, inView]);

  const selectNode = (k: NodeKey) => { setPinned(true); setActive(k); };

  /* ── Telemetry state: jitter around the active run's values each tick ── */
  const [vals, setVals] = useState<Record<string, string>>(() => baseVals(TELE.day));
  const [changed, setChanged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const apply = () => {
      setVals((prev) => {
        const next = snapVals(base);
        const ch: Record<string, boolean> = {};
        for (const k in next) if (next[k] !== prev[k]) ch[k] = true;
        setChanged(ch);
        return next;
      });
    };
    if (reduceMotion || !inView) {
      setVals(baseVals(base));
      return;
    }
    apply();
    const t = setInterval(apply, 1700);
    return () => clearInterval(t);
  }, [base, reduceMotion, inView]);

  useEffect(() => {
    if (!Object.keys(changed).length) return;
    const t = setTimeout(() => setChanged({}), 650);
    return () => clearTimeout(t);
  }, [changed]);

  const brightIdx = BRIGHT_SCALE.indexOf(base.bright);

  /* ── Camera state ── */
  const [primary, setPrimary] = useState<FeedKey>('center');
  const primaryFeed = FEEDS.find((f) => f.key === primary) ?? FEEDS[1];

  return (
    <LazyMotion features={domAnimation}>
    <div ref={rootRef} className="pj-cl" data-no-zoom data-mode={mode} data-live={inView ? 'on' : 'off'}>
      <div className="pj-cl-head">
        <div className="pj-cl-head-l">
          <span className="pj-cl-tag"><i className="pj-cl-tag-dot" />Driving console</span>
          <span className="pj-cl-head-sub">Rebuilt from the {mode} run</span>
        </div>
        <div className="pj-cl-toggle" role="group" aria-label="Choose the day or night run">
          <span className="pj-cl-toggle-slider" data-mode={mode} aria-hidden="true" />
          <button type="button" className={`pj-cl-toggle-btn${mode === 'day' ? ' is-on' : ''}`} onClick={() => setMode('day')} aria-pressed={mode === 'day'}>
            <SunIcon /> Day run
          </button>
          <button type="button" className={`pj-cl-toggle-btn${mode === 'night' ? ' is-on' : ''}`} onClick={() => setMode('night')} aria-pressed={mode === 'night'}>
            <MoonIcon /> Night run
          </button>
        </div>
      </div>

      {/* ── 1. Signal path ── */}
      <div className="pj-cl-block">
        <span className="pj-cl-label">Signal path</span>
        <div className="pj-cl-track" role="list" aria-label="Signal path from controller to rover">
          <div className="pj-cl-rail" aria-hidden="true">
            <span className="pj-cl-rail-fill" style={{ width: `${(idx / (LINK.length - 1)) * 100}%` }} />
            {!reduceMotion && (
              <>
                <span className="pj-cl-pkt out o1" />
                <span className="pj-cl-pkt back b1" />
                <span className="pj-cl-pkt back b2" />
                <span className="pj-cl-pkt back b3" />
              </>
            )}
          </div>
          {LINK.map((n, i) => (
            <button
              key={n.key}
              role="listitem"
              className={`pj-cl-node${n.key === active ? ' is-active' : ''}${i <= idx ? ' is-passed' : ''}`}
              onClick={() => selectNode(n.key)}
              aria-pressed={n.key === active}
              aria-label={`${n.label}: ${n.sub}`}
            >
              <span className="pj-cl-node-ring"><span className="pj-cl-node-ic">{n.icon}</span></span>
              <span className="pj-cl-node-text">
                <b>{n.label}</b>
                <i>{n.sub}</i>
              </span>
            </button>
          ))}
        </div>
        <div className="pj-cl-flow-key" aria-hidden="true">
          <span><i className="dir out" />Commands</span>
          <span><i className="dir back" />Video and telemetry</span>
        </div>
        <div className="pj-cl-blurb-wrap" aria-live="polite">
          <p className="pj-cl-blurb pj-cl-sizer" aria-hidden="true"><b>{LONGEST_BLURB.label}.</b> {LONGEST_BLURB.blurb}</p>
          <AnimatePresence mode="wait">
            <m.p
              key={node.key}
              className="pj-cl-blurb"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <b>{node.label}.</b> {node.blurb}
            </m.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="pj-cl-grid2">
        {/* ── 2. Telemetry HUD ── */}
        <div className="pj-cl-block">
          <span className="pj-cl-label">Telemetry</span>
          <div className="pj-cl-hud">
            <ul className="pj-cl-readouts">
              {METRICS.map((m) => (
                <li key={m.key} className={changed[m.key] ? 'is-tick' : ''}>
                  <span className="pj-cl-ro-label">{m.label}</span>
                  <span className="pj-cl-ro-val">
                    {vals[m.key]}{m.unit && <i>{m.unit}</i>}
                  </span>
                </li>
              ))}
              <li className="pj-cl-ro-bright">
                <span className="pj-cl-ro-label">Brightness</span>
                <span className="pj-cl-bright">
                  <span className="pj-cl-bright-segs" aria-hidden="true">
                    {BRIGHT_SCALE.map((b, i) => <i key={b} className={i <= brightIdx ? 'on' : ''} />)}
                  </span>
                  <b>{base.bright}</b>
                </span>
              </li>
              <li className="pj-cl-ro-wide">
                <span className="pj-cl-ro-label">GPS fix</span>
                <span className="pj-cl-ro-val loc">{base.loc}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── 3. Camera strip ── */}
        <div className="pj-cl-block">
          <span className="pj-cl-label">Camera feeds</span>
          <div className="pj-cl-cams">
            <div className="pj-cl-cam-main">
              {seen && (
                <video
                  key={`main-${primary}-${mode}`}
                  className="pj-cl-cam-vid"
                  autoPlay={!reduceMotion} muted loop playsInline preload="metadata"
                  aria-label={`${primaryFeed.label} camera, ${mode} run`}
                >
                  <source src={camSrc(primary, mode)} type="video/mp4" />
                </video>
              )}
              <span className="pj-cl-scan" aria-hidden="true" />
              <span className="pj-cl-cam-grad" aria-hidden="true" />
              <span className="pj-cl-live"><i className="pj-cl-live-dot" />LIVE</span>
              <span className="pj-cl-cam-tag">{primaryFeed.label} · {primaryFeed.phone}</span>
              <AnimatePresence mode="wait">
                <m.span
                  key={primaryFeed.key}
                  className="pj-cl-cam-note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {primaryFeed.note}
                </m.span>
              </AnimatePresence>
            </div>
            <div className="pj-cl-cam-thumbs" role="group" aria-label="Choose the main camera">
              {FEEDS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`pj-cl-cam-thumb${f.key === primary ? ' is-primary' : ''}`}
                  onClick={() => setPrimary(f.key)}
                  aria-pressed={f.key === primary}
                  aria-label={`Show the ${f.label.toLowerCase()} camera (${f.phone})`}
                >
                  {seen && (
                    <video
                      key={`thumb-${f.key}-${mode}`}
                      className="pj-cl-thumb-vid"
                      autoPlay={!reduceMotion} muted loop playsInline preload="metadata" aria-hidden="true"
                    >
                      <source src={camSrc(f.key, mode)} type="video/mp4" />
                    </video>
                  )}
                  <span className="pj-cl-scan sm" aria-hidden="true" />
                  <span className="pj-cl-thumb-grad" aria-hidden="true" />
                  <span className="pj-cl-live sm"><i className="pj-cl-live-dot" />LIVE</span>
                  <span className="pj-cl-thumb-label">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pj-cl {
          --acc: var(--hp-sky);
          --acc-deep: var(--hp-blue);
          --live: #ff5a5a;
          margin: 1.5rem 0 0.7rem;
          padding: clamp(18px, 2.6vw, 28px);
          border-radius: 20px;
          background: linear-gradient(168deg, rgba(16,22,34,0.86), rgba(9,12,20,0.94));
          border: 1px solid var(--hp-line);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 80px -40px rgba(0,0,0,0.7);
          position: relative;
          overflow: hidden;
          transition: background 0.6s ease, border-color 0.6s ease;
        }
        .pj-cl[data-mode="night"] {
          --acc: #8ea2ff;
          --acc-deep: #5e79db;
          background: linear-gradient(168deg, rgba(11,14,26,0.92), rgba(6,8,16,0.96));
        }
        .pj-cl::before {
          content: ''; position: absolute; inset: -40% -10% auto auto; width: 60%; aspect-ratio: 1;
          background: radial-gradient(circle, color-mix(in srgb, var(--acc) 16%, transparent), transparent 70%);
          filter: blur(50px); pointer-events: none; transition: background 0.6s ease;
        }
        .pj-cl-head { position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 16px; margin-bottom: clamp(16px, 2.4vw, 22px); }
        .pj-cl-head-l { display: flex; flex-direction: column; gap: 4px; }
        .pj-cl-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'inter'; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--acc); }
        .pj-cl-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--acc); box-shadow: 0 0 0 4px color-mix(in srgb, var(--acc) 22%, transparent); }
        .pj-cl-head-sub { font-family: 'dmsans'; font-size: 0.78rem; color: rgba(232,232,232,0.4); letter-spacing: 0.01em; }

        /* ── Day / night toggle ── */
        .pj-cl-toggle {
          position: relative; display: inline-flex; padding: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.1);
        }
        .pj-cl-toggle-slider {
          position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc(50% - 4px); border-radius: 999px;
          background: color-mix(in srgb, var(--acc) 24%, transparent);
          border: 1px solid color-mix(in srgb, var(--acc) 55%, transparent);
          box-shadow: 0 4px 14px -6px color-mix(in srgb, var(--acc) 70%, transparent);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease;
        }
        .pj-cl-toggle-slider[data-mode="night"] { transform: translateX(100%); }
        .pj-cl-toggle-btn {
          position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
          background: none; border: 0; padding: 7px 15px; border-radius: 999px;
          font-family: 'inter'; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.04em;
          color: rgba(232,232,232,0.5); transition: color 0.3s ease;
        }
        .pj-cl-toggle-btn svg { opacity: 0.85; }
        .pj-cl-toggle-btn.is-on { color: #f4f8ff; }
        .pj-cl-toggle-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }

        .pj-cl-block { position: relative; }
        .pj-cl-label {
          display: inline-block; font-family: 'inter'; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(232,232,232,0.42); margin-bottom: 12px;
        }
        .pj-cl-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 30px); margin-top: clamp(22px, 3vw, 30px); padding-top: clamp(22px, 3vw, 30px); border-top: 1px solid rgba(255,255,255,0.07); align-items: start; }

        /* ── Signal path ── */
        .pj-cl-track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        .pj-cl-rail {
          position: absolute; left: calc(12.5% ); right: calc(12.5%); top: 22px; height: 2px;
          background: rgba(255,255,255,0.09); border-radius: 2px; overflow: visible;
        }
        .pj-cl-rail-fill {
          position: absolute; inset: 0 auto 0 0; border-radius: 2px;
          background: linear-gradient(90deg, var(--acc-deep), var(--acc));
          transition: width 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-cl-pkt {
          position: absolute; top: 50%; width: 6px; height: 6px; border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        /* One command packet out, three telemetry packets back (the ESP32 splits its data into three packets). */
        .pj-cl-pkt.out { background: var(--acc); box-shadow: 0 0 8px color-mix(in srgb, var(--acc) 80%, transparent); animation: pjFlowOut 4.5s linear infinite; }
        .pj-cl-pkt.back { width: 5px; height: 5px; background: rgba(232,232,232,0.6); box-shadow: 0 0 7px rgba(232,232,232,0.4); animation: pjFlowBack 4.5s linear infinite; }
        .pj-cl[data-live="off"] .pj-cl-pkt { animation-play-state: paused; }
        .pj-cl-pkt.o1 { animation-delay: 0s; }
        .pj-cl-pkt.b1 { animation-delay: 0s; }
        .pj-cl-pkt.b2 { animation-delay: 1.5s; }
        .pj-cl-pkt.b3 { animation-delay: 3s; }
        @keyframes pjFlowOut { 0% { left: 0%; opacity: 0; } 6% { opacity: 1; } 94% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        @keyframes pjFlowBack { 0% { left: 100%; opacity: 0; top: calc(50% + 9px); } 6% { opacity: 0.85; } 94% { opacity: 0.85; } 100% { left: 0%; opacity: 0; top: calc(50% + 9px); } }

        .pj-cl-node {
          position: relative; display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center;
          background: none; border: 0; cursor: pointer; padding: 0 2px 4px; font: inherit; color: inherit;
        }
        .pj-cl-node-ring {
          width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
          background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.12); color: rgba(232,232,232,0.5);
          transition: border-color 0.32s ease, color 0.32s ease, background 0.32s ease, box-shadow 0.32s ease, transform 0.32s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-cl-node.is-passed .pj-cl-node-ring { border-color: color-mix(in srgb, var(--acc) 45%, transparent); color: color-mix(in srgb, var(--acc) 80%, #e8e8e8); background: color-mix(in srgb, var(--acc) 9%, transparent); }
        .pj-cl-node.is-active .pj-cl-node-ring {
          border-color: var(--acc); color: #f4f8ff; background: color-mix(in srgb, var(--acc) 24%, transparent);
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--acc) 16%, transparent), 0 8px 22px -8px color-mix(in srgb, var(--acc) 70%, transparent);
          transform: scale(1.08);
        }
        .pj-cl-node:hover .pj-cl-node-ring { transform: translateY(-2px); }
        .pj-cl-node:focus-visible .pj-cl-node-ring { outline: 2px solid var(--acc); outline-offset: 3px; }
        .pj-cl-node-text { display: flex; flex-direction: column; gap: 2px; line-height: 1.25; }
        .pj-cl-node-text b { font-family: 'dmsans'; font-weight: 700; font-size: 0.8rem; color: #e8e8e8; letter-spacing: -0.005em; }
        .pj-cl-node-text i { font-style: normal; font-family: 'inter'; font-size: 0.64rem; letter-spacing: 0.05em; color: rgba(232,232,232,0.4); }
        .pj-cl-node.is-active .pj-cl-node-text b { color: var(--acc); }

        .pj-cl-flow-key { display: flex; gap: 18px; margin: 16px 0 2px; flex-wrap: wrap; }
        .pj-cl-flow-key span { display: inline-flex; align-items: center; gap: 7px; font-family: 'inter'; font-size: 0.68rem; letter-spacing: 0.04em; color: rgba(232,232,232,0.42); }
        .pj-cl-flow-key i.dir { width: 14px; height: 2px; border-radius: 2px; position: relative; }
        .pj-cl-flow-key i.dir.out { background: var(--acc); }
        .pj-cl-flow-key i.dir.out::after { content: ''; position: absolute; right: -1px; top: 50%; width: 0; height: 0; border: 3px solid transparent; border-left-color: var(--acc); transform: translateY(-50%); }
        .pj-cl-flow-key i.dir.back { background: rgba(232,232,232,0.45); }
        .pj-cl-flow-key i.dir.back::before { content: ''; position: absolute; left: -1px; top: 50%; width: 0; height: 0; border: 3px solid transparent; border-right-color: rgba(232,232,232,0.45); transform: translateY(-50%); }

        .pj-cl-blurb-wrap { display: grid; margin: 10px 0 0; max-width: 64ch; }
        .pj-cl-blurb-wrap > * { grid-area: 1 / 1; }
        .pj-cl-blurb { font-family: 'dmsans'; font-size: 0.92rem; line-height: 1.62; color: rgba(232,232,232,0.66); margin: 0; }
        .pj-cl-sizer { visibility: hidden; }
        .pj-cl-blurb b { color: #e8e8e8; font-weight: 700; }

        /* ── Telemetry ── */
        .pj-cl-hud { display: block; }
        .pj-cl-readouts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
        .pj-cl-readouts li {
          display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 11px;
          background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.5s ease, background 0.5s ease;
        }
        .pj-cl-readouts li.is-tick { border-color: color-mix(in srgb, var(--acc) 50%, transparent); background: color-mix(in srgb, var(--acc) 7%, rgba(255,255,255,0.035)); }
        .pj-cl-ro-wide { grid-column: 1 / -1; }
        .pj-cl-ro-label { font-family: 'inter'; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,232,232,0.4); }
        .pj-cl-ro-val { font-family: 'oswaldreg'; font-size: 1.05rem; color: #eef2fa; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; }
        .pj-cl-ro-val.loc { font-family: 'dmsans'; font-weight: 600; font-size: 0.96rem; }
        .pj-cl-ro-val i { font-style: normal; font-family: 'inter'; font-size: 0.66rem; color: rgba(232,232,232,0.4); margin-left: 3px; letter-spacing: 0.02em; }
        .pj-cl-bright { display: flex; align-items: center; gap: 8px; }
        .pj-cl-bright b { font-family: 'oswaldreg'; font-size: 0.98rem; color: #eef2fa; font-weight: 400; }
        .pj-cl-bright-segs { display: inline-flex; gap: 3px; }
        .pj-cl-bright-segs i { width: 7px; height: 13px; border-radius: 2px; background: rgba(255,255,255,0.12); transition: background 0.4s ease, box-shadow 0.4s ease; }
        .pj-cl-bright-segs i.on { background: var(--acc); box-shadow: 0 0 6px color-mix(in srgb, var(--acc) 65%, transparent); }

        /* ── Camera strip ── */
        .pj-cl-cams { display: flex; flex-direction: column; gap: 10px; }
        .pj-cl-cam-main {
          position: relative; aspect-ratio: 16 / 9; border-radius: 14px; overflow: hidden;
          background: #06080e; border: 1px solid rgba(255,255,255,0.1);
        }
        /* override the global .art-section video rule (margin/border) which otherwise pushes these down and leaves a top gap */
        .pj-cl-cams .pj-cl-cam-vid, .pj-cl-cams .pj-cl-thumb-vid { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; border: 0; border-radius: 0; object-fit: cover; display: block; }
        .pj-cl-cam-grad { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(5,7,12,0.82) 0%, rgba(5,7,12,0.18) 34%, transparent 56%); }
        .pj-cl-thumb-grad { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(5,7,12,0.78), transparent 62%); }
        .pj-cl-cam-tag { position: absolute; top: 11px; right: 12px; z-index: 2; font-family: 'inter'; font-size: 0.64rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.82); padding: 4px 8px; border-radius: 999px; background: rgba(0,0,0,0.42); border: 1px solid rgba(255,255,255,0.14); }
        .pj-cl-cam-note { position: absolute; left: 14px; right: 14px; bottom: 12px; z-index: 2; display: block; font-family: 'dmsans'; font-size: 0.82rem; line-height: 1.45; color: rgba(255,255,255,0.82); }

        .pj-cl-scan { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; z-index: 1;
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
                  mask-image: linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
        }
        .pj-cl-scan::after {
          content: ''; position: absolute; left: 0; right: 0; height: 32%;
          background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--acc) 16%, transparent), transparent);
          display: none;
        }

        .pj-cl-live { position: absolute; top: 11px; left: 12px; z-index: 2; display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px 4px 7px; border-radius: 999px;
          background: rgba(0,0,0,0.5); border: 1px solid rgba(255,90,90,0.4);
          font-family: 'inter'; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; color: #ffb3ad;
        }
        .pj-cl-live.sm { font-size: 0.5rem; padding: 3px 6px 3px 5px; top: 7px; left: 7px; gap: 4px; }
        .pj-cl-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--live); box-shadow: 0 0 0 3px rgba(255,90,90,0.22); }

        .pj-cl-cam-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pj-cl-cam-thumb {
          position: relative; overflow: hidden; cursor: pointer; font: inherit; color: inherit; text-align: left;
          aspect-ratio: 16 / 10; padding: 0;
          border-radius: 11px; background: #06080e; border: 1px solid rgba(255,255,255,0.09);
          transition: border-color 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-cl-cam-thumb:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--acc) 38%, transparent); }
        .pj-cl-cam-thumb:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
        .pj-cl-cam-thumb.is-primary { border-color: color-mix(in srgb, var(--acc) 65%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--acc) 45%, transparent), 0 8px 22px -12px color-mix(in srgb, var(--acc) 70%, transparent); }
        .pj-cl-thumb-label { position: absolute; left: 8px; bottom: 7px; z-index: 2; font-family: 'dmsans'; font-weight: 700; font-size: 0.72rem; color: #fff; letter-spacing: 0.01em; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
        .pj-cl-cam-thumb.is-primary .pj-cl-thumb-label { color: var(--acc); }

        @media (max-width: 760px) {
          .pj-cl-grid2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .pj-cl-track { grid-template-columns: repeat(2, 1fr); row-gap: 22px; }
          .pj-cl-rail { display: none; }
          .pj-cl-head { gap: 12px; }
        }
        @media (max-width: 420px) {
          .pj-cl-node-text i { display: none; }
          .pj-cl-cam-thumbs { grid-template-columns: 1fr 1fr 1fr; }
          .pj-cl-thumb-label { font-size: 0.58rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-cl-pkt { animation: none !important; display: none; }
        }
      `}</style>
    </div>
    </LazyMotion>
  );
}
