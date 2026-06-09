'use client';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────────────
 * Signal path: the chain a command travels down, and telemetry travels back up
 * ──────────────────────────────────────────────────────────────────────── */
type NodeKey = 'pad' | 'cell' | 'turn' | 'rover';

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
const CellIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path d="M4 17v-2.4M8.4 17v-4.8M12.8 17V7.6M17.2 17V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="19.5" cy="5.5" r="1.6" fill="currentColor" />
  </svg>
);
const TurnIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path d="M8 5l-4 4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 19l4-4-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 9h7a4 4 0 014 4v1M20 15h-7a4 4 0 01-4-4v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
  { key: 'pad', label: 'Xbox controller', sub: 'Operator input', icon: <PadIcon />, blurb: 'Stick and trigger movements are read at the operator end and packaged into small command messages, dozens of times a second.' },
  { key: 'cell', label: '5G cellular', sub: 'Carrier network', icon: <CellIcon />, blurb: 'Both ends ride the public 5G network. It is fast enough for live video, but it sits behind carrier-grade NAT, so neither side has a direct address to dial.' },
  { key: 'turn', label: 'TURN relay', sub: 'NAT traversal', icon: <TurnIcon />, blurb: 'Relays the WebRTC streams and MQTT messages so they punch through cellular NAT, giving the controller and rover a meeting point with low added latency.' },
  { key: 'rover', label: 'Rover · ESP32', sub: 'Onboard brain', icon: <RoverIcon />, blurb: 'The ESP32 decodes each command into PWM motor and servo output, then answers with three camera feeds and a stream of sensor telemetry.' },
];

/* ────────────────────────────────────────────────────────────────────────
 * Telemetry HUD: compact live readouts with a believable random-walk
 * ──────────────────────────────────────────────────────────────────────── */
type Reading = {
  key: string;
  label: string;
  unit: string;
  value: number;
  decimals: number;
  step: number;
  min: number;
  max: number;
  format?: (v: number) => string;
};

const SEED_READINGS: Reading[] = [
  { key: 'lat', label: 'Latitude', unit: '°N', value: 1.3521, decimals: 4, step: 0.0006, min: 1.346, max: 1.358 },
  { key: 'lon', label: 'Longitude', unit: '°E', value: 103.8198, decimals: 4, step: 0.0006, min: 103.812, max: 103.828 },
  { key: 'speed', label: 'Speed', unit: 'km/h', value: 8.4, decimals: 1, step: 0.6, min: 0, max: 18 },
  { key: 'alt', label: 'Altitude', unit: 'm', value: 24, decimals: 0, step: 0.8, min: 14, max: 36 },
  { key: 'dist', label: 'Clearance', unit: 'cm', value: 86, decimals: 0, step: 6, min: 12, max: 220 },
  { key: 'temp', label: 'Temp', unit: '°C', value: 29.4, decimals: 1, step: 0.25, min: 24, max: 34 },
  { key: 'hum', label: 'Humidity', unit: '%', value: 64, decimals: 0, step: 1.4, min: 48, max: 78 },
  { key: 'light', label: 'Light', unit: 'lux', value: 540, decimals: 0, step: 30, min: 60, max: 1100 },
];

const fmt = (r: Reading) => r.format ? r.format(r.value) : r.value.toFixed(r.decimals);

function walk(r: Reading): Reading {
  const drift = (Math.random() - 0.5) * 2 * r.step;
  let next = r.value + drift;
  if (next < r.min) next = r.min + Math.abs(drift);
  if (next > r.max) next = r.max - Math.abs(drift);
  return { ...r, value: next };
}

/* ────────────────────────────────────────────────────────────────────────
 * Camera strip
 * ──────────────────────────────────────────────────────────────────────── */
type Feed = { key: string; label: string; angle: string; note: string };
const FEEDS: Feed[] = [
  { key: 'front', label: 'Front', angle: '0°', note: 'Forward driving view, the operator’s primary feed.' },
  { key: 'rear', label: 'Rear', angle: '180°', note: 'Reverse view for backing out of tight spots.' },
  { key: 'pan', label: 'Pan', angle: '±120°', note: 'Steerable head for scouting the terrain off to the side.' },
];

export default function CommandLink() {
  const reduceMotion = useReducedMotion();

  /* ── Signal path state ── */
  const [active, setActive] = useState<NodeKey>('pad');
  const [pinned, setPinned] = useState(false);
  const node = useMemo(() => LINK.find((n) => n.key === active) ?? LINK[0], [active]);
  const idx = LINK.findIndex((n) => n.key === active);

  useEffect(() => {
    if (pinned || reduceMotion) return;
    const t = setInterval(() => {
      setActive((cur) => {
        const i = LINK.findIndex((n) => n.key === cur);
        return LINK[(i + 1) % LINK.length].key;
      });
    }, 2600);
    return () => clearInterval(t);
  }, [pinned, reduceMotion]);

  const selectNode = (k: NodeKey) => { setPinned(true); setActive(k); };

  /* ── Telemetry state ── */
  const [readings, setReadings] = useState<Reading[]>(SEED_READINGS);
  const [changed, setChanged] = useState<Record<string, boolean>>({});
  const [heading, setHeading] = useState(214);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      setReadings((prev) => {
        const next = prev.map(walk);
        const flags: Record<string, boolean> = {};
        next.forEach((r, i) => { if (Math.abs(r.value - prev[i].value) > prev[i].step * 0.18) flags[r.key] = true; });
        setChanged(flags);
        return next;
      });
      setHeading((h) => {
        let n = h + (Math.random() - 0.5) * 26;
        if (n < 0) n += 360;
        if (n >= 360) n -= 360;
        return n;
      });
    }, 1900);
    return () => clearInterval(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (!Object.keys(changed).length) return;
    const t = setTimeout(() => setChanged({}), 650);
    return () => clearTimeout(t);
  }, [changed]);

  const compassLabel = useMemo(() => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(heading / 45) % 8];
  }, [heading]);

  /* ── Camera state ── */
  const [primary, setPrimary] = useState<string>('front');
  const primaryFeed = FEEDS.find((f) => f.key === primary) ?? FEEDS[0];

  return (
    <div className="pj-cl" data-no-zoom>
      <div className="pj-cl-head">
        <span className="pj-cl-tag"><i className="pj-cl-tag-dot" />Command Link</span>
        <span className="pj-cl-head-sub">Live console layout, reconstructed from the mission build</span>
      </div>

      {/* ── 1. Signal path ── */}
      <div className="pj-cl-block">
        <span className="pj-cl-label">Signal path</span>
        <div className="pj-cl-track" role="list" aria-label="Signal path from controller to rover">
          <div className="pj-cl-rail" aria-hidden="true">
            <span className="pj-cl-rail-fill" style={{ width: `${(idx / (LINK.length - 1)) * 100}%` }} />
            {!reduceMotion && (
              <>
                <span className="pj-cl-pkt out p1" />
                <span className="pj-cl-pkt out p2" />
                <span className="pj-cl-pkt back p3" />
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
          <span><i className="dir back" />Video &amp; telemetry</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={node.key}
            className="pj-cl-blurb"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <b>{node.label}.</b> {node.blurb}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="pj-cl-grid2">
        {/* ── 2. Telemetry HUD ── */}
        <div className="pj-cl-block">
          <span className="pj-cl-label">Telemetry HUD</span>
          <div className="pj-cl-hud">
            <div className="pj-cl-compass" aria-label={`Heading ${Math.round(heading)} degrees, ${compassLabel}`}>
              <div className="pj-cl-compass-dial">
                <span className="pj-cl-compass-tick n" />
                <span className="pj-cl-compass-tick e" />
                <span className="pj-cl-compass-tick s" />
                <span className="pj-cl-compass-tick w" />
                <motion.span
                  className="pj-cl-needle"
                  animate={{ rotate: heading }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                    <path d="M12 3l3.6 8L12 21 8.4 11z" fill="currentColor" />
                    <path d="M12 3l3.6 8L12 11z" fill="rgba(255,255,255,0.92)" />
                  </svg>
                </motion.span>
              </div>
              <span className="pj-cl-compass-read"><b>{Math.round(heading)}°</b> {compassLabel}</span>
              <span className="pj-cl-compass-cap">Heading · magnetometer</span>
            </div>
            <ul className="pj-cl-readouts">
              {readings.map((r) => (
                <li key={r.key} className={changed[r.key] ? 'is-tick' : ''}>
                  <span className="pj-cl-ro-label">{r.label}</span>
                  <span className="pj-cl-ro-val">
                    {fmt(r)}<i>{r.unit}</i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 3. Camera strip ── */}
        <div className="pj-cl-block">
          <span className="pj-cl-label">Camera feeds</span>
          <div className="pj-cl-cams">
            <div className="pj-cl-cam-main">
              <div className="pj-cl-scan" aria-hidden="true" />
              <span className="pj-cl-live"><i className="pj-cl-live-dot" />LIVE</span>
              <span className="pj-cl-cam-tag">{primaryFeed.label} · {primaryFeed.angle}</span>
              <span className="pj-cl-cam-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                  <rect x="2.5" y="6.5" width="13" height="11" rx="2.4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M15.5 10l5.2-2.8a.9.9 0 011.3.8v8a.9.9 0 01-1.3.8L15.5 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={primaryFeed.key}
                  className="pj-cl-cam-note"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {primaryFeed.note}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="pj-cl-cam-thumbs" role="list" aria-label="Camera feeds, select to promote">
              {FEEDS.map((f) => (
                <button
                  key={f.key}
                  role="listitem"
                  className={`pj-cl-cam-thumb${f.key === primary ? ' is-primary' : ''}`}
                  onClick={() => setPrimary(f.key)}
                  aria-pressed={f.key === primary}
                  aria-label={`Promote ${f.label} camera to primary view`}
                >
                  <span className="pj-cl-scan sm" aria-hidden="true" />
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
        }
        .pj-cl::before {
          content: ''; position: absolute; inset: -40% -10% auto auto; width: 60%; aspect-ratio: 1;
          background: radial-gradient(circle, color-mix(in srgb, var(--acc) 16%, transparent), transparent 70%);
          filter: blur(50px); pointer-events: none;
        }
        .pj-cl-head { position: relative; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 16px; margin-bottom: clamp(16px, 2.4vw, 22px); }
        .pj-cl-tag { display: inline-flex; align-items: center; gap: 8px; font-family: 'inter'; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--acc); }
        .pj-cl-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--acc); box-shadow: 0 0 0 4px color-mix(in srgb, var(--acc) 22%, transparent); }
        .pj-cl-head-sub { font-family: 'dmsans'; font-size: 0.78rem; color: rgba(232,232,232,0.4); letter-spacing: 0.01em; }

        .pj-cl-block { position: relative; }
        .pj-cl-label {
          display: inline-block; font-family: 'inter'; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(232,232,232,0.42); margin-bottom: 12px;
        }
        .pj-cl-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px, 3vw, 30px); margin-top: clamp(22px, 3vw, 30px); padding-top: clamp(22px, 3vw, 30px); border-top: 1px solid rgba(255,255,255,0.07); }

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
        .pj-cl-pkt.out { background: var(--acc); box-shadow: 0 0 8px color-mix(in srgb, var(--acc) 80%, transparent); animation: pjFlowOut 4.4s linear infinite; }
        .pj-cl-pkt.back { background: rgba(232,232,232,0.55); box-shadow: 0 0 7px rgba(232,232,232,0.35); animation: pjFlowBack 5.6s linear infinite; }
        .pj-cl-pkt.p1 { animation-delay: 0s; }
        .pj-cl-pkt.p2 { animation-delay: 2.2s; }
        .pj-cl-pkt.p3 { animation-delay: 1.1s; }
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

        .pj-cl-blurb { font-family: 'dmsans'; font-size: 0.92rem; line-height: 1.62; color: rgba(232,232,232,0.66); margin: 10px 0 0; max-width: 64ch; min-height: 2.9em; }
        .pj-cl-blurb b { color: #e8e8e8; font-weight: 700; }

        /* ── Telemetry HUD ── */
        .pj-cl-hud { display: grid; grid-template-columns: auto 1fr; gap: clamp(16px, 2.4vw, 24px); align-items: stretch; }
        .pj-cl-compass { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 6px 4px 0; }
        .pj-cl-compass-dial {
          position: relative; width: 78px; height: 78px; border-radius: 50%; display: grid; place-items: center;
          background: radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05), rgba(255,255,255,0.015) 70%);
          border: 1px solid rgba(255,255,255,0.13);
        }
        .pj-cl-compass-tick { position: absolute; background: rgba(232,232,232,0.34); border-radius: 1px; }
        .pj-cl-compass-tick.n, .pj-cl-compass-tick.s { width: 2px; height: 8px; left: 50%; transform: translateX(-50%); }
        .pj-cl-compass-tick.e, .pj-cl-compass-tick.w { height: 2px; width: 8px; top: 50%; transform: translateY(-50%); }
        .pj-cl-compass-tick.n { top: 5px; background: var(--acc); }
        .pj-cl-compass-tick.s { bottom: 5px; }
        .pj-cl-compass-tick.e { right: 5px; }
        .pj-cl-compass-tick.w { left: 5px; }
        .pj-cl-needle { display: grid; place-items: center; color: var(--acc); filter: drop-shadow(0 2px 8px color-mix(in srgb, var(--acc) 55%, transparent)); transform-origin: 50% 55%; }
        .pj-cl-compass-read { font-family: 'oswaldreg'; font-size: 0.94rem; color: #e8e8e8; letter-spacing: 0.01em; }
        .pj-cl-compass-read b { font-family: 'oswaldbold'; color: var(--acc); }
        .pj-cl-compass-cap { font-family: 'inter'; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,232,232,0.32); text-align: center; }

        .pj-cl-readouts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
        .pj-cl-readouts li {
          display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 11px;
          background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.5s ease, background 0.5s ease;
        }
        .pj-cl-readouts li.is-tick { border-color: color-mix(in srgb, var(--acc) 50%, transparent); background: color-mix(in srgb, var(--acc) 7%, rgba(255,255,255,0.035)); }
        .pj-cl-ro-label { font-family: 'inter'; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,232,232,0.4); }
        .pj-cl-ro-val { font-family: 'oswaldreg'; font-size: 1.05rem; color: #eef2fa; letter-spacing: 0.01em; font-variant-numeric: tabular-nums; }
        .pj-cl-ro-val i { font-style: normal; font-family: 'inter'; font-size: 0.66rem; color: rgba(232,232,232,0.4); margin-left: 3px; letter-spacing: 0.02em; }

        /* ── Camera strip ── */
        .pj-cl-cams { display: flex; flex-direction: column; gap: 10px; height: 100%; }
        .pj-cl-cam-main {
          position: relative; flex: 1; min-height: 132px; border-radius: 14px; overflow: hidden;
          background: linear-gradient(150deg, rgba(127,168,255,0.1), rgba(8,11,18,0.94) 62%);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between;
        }
        .pj-cl-cam-glyph { position: absolute; right: 14px; bottom: 12px; color: rgba(255,255,255,0.14); }
        .pj-cl-cam-tag { font-family: 'inter'; font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(232,232,232,0.5); }
        .pj-cl-cam-note { display: block; font-family: 'dmsans'; font-size: 0.82rem; line-height: 1.5; color: rgba(232,232,232,0.62); max-width: 30ch; margin-top: auto; padding-top: 10px; }

        .pj-cl-scan { position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
                  mask-image: linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent);
        }
        .pj-cl-scan::after {
          content: ''; position: absolute; left: 0; right: 0; height: 32%;
          background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--acc) 14%, transparent), transparent);
          animation: pjScan 5.5s ease-in-out infinite;
        }
        @keyframes pjScan { 0% { top: -34%; } 50% { top: 102%; } 100% { top: -34%; } }

        .pj-cl-live { position: relative; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px 4px 7px; border-radius: 999px;
          background: rgba(0,0,0,0.4); border: 1px solid rgba(255,90,90,0.32);
          font-family: 'inter'; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; color: #ffb3ad;
        }
        .pj-cl-live.sm { font-size: 0.56rem; padding: 3px 7px 3px 6px; }
        .pj-cl-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--live); box-shadow: 0 0 0 0 rgba(255,90,90,0.5); animation: pjLivePulse 1.8s ease-out infinite; }
        @keyframes pjLivePulse { 0% { box-shadow: 0 0 0 0 rgba(255,90,90,0.55); } 70% { box-shadow: 0 0 0 7px rgba(255,90,90,0); } 100% { box-shadow: 0 0 0 0 rgba(255,90,90,0); } }

        .pj-cl-cam-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pj-cl-cam-thumb {
          position: relative; overflow: hidden; cursor: pointer; font: inherit; color: inherit; text-align: left;
          display: flex; align-items: flex-end; min-height: 56px; padding: 8px 10px;
          border-radius: 11px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.09);
          transition: border-color 0.28s ease, background 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-cl-cam-thumb .pj-cl-live { position: absolute; top: 7px; left: 8px; }
        .pj-cl-cam-thumb:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--acc) 38%, transparent); }
        .pj-cl-cam-thumb:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
        .pj-cl-cam-thumb.is-primary { border-color: color-mix(in srgb, var(--acc) 60%, transparent); background: color-mix(in srgb, var(--acc) 10%, rgba(255,255,255,0.035)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acc) 30%, transparent); }
        .pj-cl-thumb-label { font-family: 'dmsans'; font-weight: 700; font-size: 0.78rem; color: #dfe6f2; letter-spacing: 0.01em; }
        .pj-cl-cam-thumb.is-primary .pj-cl-thumb-label { color: var(--acc); }

        @media (max-width: 760px) {
          .pj-cl-grid2 { grid-template-columns: 1fr; }
          .pj-cl-hud { grid-template-columns: 1fr; }
          .pj-cl-compass { flex-direction: row; justify-content: flex-start; gap: 14px; }
          .pj-cl-compass-cap { text-align: left; }
        }
        @media (max-width: 600px) {
          .pj-cl-track { grid-template-columns: repeat(2, 1fr); row-gap: 22px; }
          .pj-cl-rail { display: none; }
          .pj-cl-readouts { grid-template-columns: repeat(2, 1fr); }
          .pj-cl-cam-thumbs { grid-template-columns: 1fr; }
        }
        @media (max-width: 420px) {
          .pj-cl-node-text i { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-cl-pkt, .pj-cl-scan::after, .pj-cl-live-dot { animation: none !important; }
          .pj-cl-scan::after { display: none; }
        }
      `}</style>
    </div>
  );
}
