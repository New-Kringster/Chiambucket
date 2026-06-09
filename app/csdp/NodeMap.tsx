'use client';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────────────
 * EMA Home Map: a hub-and-spoke explorer for the five-node SocketIO mesh.
 *
 * The BeagleBone controller sits at the centre; the five sensor nodes ring
 * it like a pentagon. Telemetry dots glide inward along each spoke on a
 * loop, one node auto-highlights at a time, and clicking a node pins its
 * detail card open. "Simulate alert" turns the chosen node red, races a
 * red pulse down its spoke, and lights up the controller as it lands.
 * ──────────────────────────────────────────────────────────────────────── */

type NodeId = 'climate' | 'bathroom' | 'energy' | 'flame' | 'intrusion';

type SpokeNode = {
  id: NodeId;
  name: string;
  short: string;
  monitors: string;
  sensors: string;
  buzzer: string;
  icon: 'climate' | 'bathroom' | 'energy' | 'flame' | 'intrusion';
};

const NODES: SpokeNode[] = [
  {
    id: 'climate',
    name: 'Climate',
    short: 'Comfort',
    monitors: 'Room temperature and humidity, so the home only runs the fan when it actually needs to.',
    sensors: 'Temperature + humidity sensor, paired with a presence reading',
    buzzer: 'Soft chime if the room drifts out of the comfort range while occupied',
    icon: 'climate',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    short: 'Routine',
    monitors: 'Presence and the shower timer for the bathroom zone, so nobody loses track of time.',
    sensors: 'Entry presence sensor with an on-device button and display for setting the timer',
    buzzer: 'Buzzes once the set shower time runs out',
    icon: 'bathroom',
  },
  {
    id: 'energy',
    name: 'Kitchen energy',
    short: 'Consumption',
    monitors: 'How much power the kitchen appliances are drawing, scored live on the dashboard.',
    sensors: 'Current and voltage sensing on the fridge circuit',
    buzzer: 'Short alert tone on an unusual draw spike',
    icon: 'energy',
  },
  {
    id: 'flame',
    name: 'Kitchen flame',
    short: 'Safety-critical',
    monitors: 'The kitchen for an uncontrolled fire. The most safety-critical node in the mesh.',
    sensors: 'Flame sensor watching the cooking area',
    buzzer: 'Sustained siren that also triggers every other node in the home',
    icon: 'flame',
  },
  {
    id: 'intrusion',
    name: 'Intrusion',
    short: 'Security',
    monitors: 'Motion and door activity for unusual entries, especially at odd hours.',
    sensors: 'Motion sensor plus a door-knock / open detector',
    buzzer: 'Sharp repeating alarm broadcast across the whole mesh',
    icon: 'intrusion',
  },
];

const N = NODES.length;
const STEP_DEG = 360 / N;

/* Angle for node i, measured clockwise from straight up (12 o'clock).
 * Climate lands at the top; the rest fan out clockwise into a pentagon. */
const angleFor = (i: number) => STEP_DEG * i;

/* ── tiny line-art icons, one per node type, plus the controller glyph ── */
function NodeGlyph({ kind }: { kind: SpokeNode['icon'] | 'controller' }) {
  switch (kind) {
    case 'climate':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M11 4.5a2 2 0 014 0v8.7a4 4 0 11-4 0V4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M13 9.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="13" cy="15.5" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'bathroom':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M5 11V6.5a2.5 2.5 0 015 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="3.5" y="11" width="17" height="3.4" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 14.4c.3 2.6 1.4 4.6 3 5.7M19 14.4c-.3 2.6-1.4 4.6-3 5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'energy':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M13 3.5L6 13.5h5.2L11 20.5l7-10.6h-5.4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M12 3.4c.4 2.2-2.7 3.7-2.7 6.6a2.7 2.7 0 005.4 0c1 .8 1.6 2 1.6 3.4a4.3 4.3 0 01-8.6 0c0-3.6 3.4-5 4.3-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'intrusion':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M12 3.5l7 2.7v4.3c0 4.5-2.9 8.2-7 9.6-4.1-1.4-7-5.1-7-9.6V6.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.3 12l1.9 1.9 3.5-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'controller':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
          <rect x="4" y="4.5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 19.5h8M12 15.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="8" cy="9" r="1.1" fill="currentColor" />
          <circle cx="12" cy="9" r="1.1" fill="currentColor" />
          <circle cx="16" cy="9" r="1.1" fill="currentColor" />
        </svg>
      );
  }
}

/* Geometry: every spoke radiates from the hub centre (50%, 50%) outward to
 * its node at RADIUS_PCT of the square's side. nodeCentre() gives the node's
 * percentage coordinates (used both to place the node button and as the
 * start point for the travelling telemetry dot); spokeRotation() gives the
 * CSS rotation that points a horizontal line from the centre at that node. */
const RADIUS_PCT = 40;
// Round to 4dp so server and client stringify identically (avoids hydration mismatch)
const r4 = (n: number) => +n.toFixed(4);
const nodeCentre = (i: number) => {
  const rad = (angleFor(i) * Math.PI) / 180;
  return { nx: r4(50 + RADIUS_PCT * Math.sin(rad)), ny: r4(50 - RADIUS_PCT * Math.cos(rad)) };
};
const spokeRotation = (i: number) => `${angleFor(i) - 90}deg`;
const lerp = (from: number, to: number, t: number) => r4(from + (to - from) * t);

type AlertPhase = 'idle' | 'arming' | 'travelling' | 'received';

export default function NodeMap() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<NodeId>(NODES[0].id);
  const [pinned, setPinned] = useState(false);
  const [tick, setTick] = useState(0); // bumps every pulse cycle, drives the dot animation key
  const [alert, setAlert] = useState<AlertPhase>('idle');
  const alertTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const node = useMemo(() => NODES.find((n) => n.id === active) ?? NODES[0], [active]);

  /* Auto-rotate the highlighted node until the visitor takes the wheel */
  useEffect(() => {
    if (pinned || reduceMotion || alert !== 'idle') return;
    const t = setInterval(() => {
      setActive((cur) => {
        const i = NODES.findIndex((n) => n.id === cur);
        return NODES[(i + 1) % N].id;
      });
    }, 3400);
    return () => clearInterval(t);
  }, [pinned, reduceMotion, alert]);

  /* Telemetry pulses: every spoke periodically sends a dot inward */
  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setTick((p) => p + 1), 2600);
    return () => clearInterval(t);
  }, [reduceMotion]);

  const selectNode = (id: NodeId) => {
    setPinned(true);
    setActive(id);
    if (alert !== 'idle') resetAlert();
  };

  const resetAlert = () => {
    alertTimers.current.forEach(clearTimeout);
    alertTimers.current = [];
    setAlert('idle');
  };

  /* Walk the flame node through arm → travel → received, then settle */
  const simulateAlert = () => {
    resetAlert();
    setPinned(true);
    setActive('flame');
    setAlert('arming');
    const schedule = (fn: () => void, ms: number) => {
      alertTimers.current.push(setTimeout(fn, ms));
    };
    schedule(() => setAlert('travelling'), 650);
    schedule(() => setAlert('received'), reduceMotion ? 900 : 2050);
    schedule(() => setAlert('idle'), reduceMotion ? 3200 : 4550);
  };

  useEffect(() => () => alertTimers.current.forEach(clearTimeout), []);

  const isAlerting = alert !== 'idle';
  const alertDuration = reduceMotion ? 0.05 : 1.35;

  return (
    <div className="cs-nm" data-no-zoom>
      <div className="cs-nm-inner">
        {/* ── Diagram ── */}
        <div className="cs-nm-stage">
          <div className="cs-nm-ring" aria-hidden="true" />
          <div className={`cs-nm-grid${isAlerting ? ' is-alert' : ''}`}>

            {/* Layer 1: spokes, lines radiating from the hub centre out to
                each node. Pure rotation + length, no per-node coordinates. */}
            {NODES.map((n, i) => {
              const isAlertSpoke = isAlerting && n.id === 'flame';
              const isHotSpoke = n.id === active && !isAlerting;
              return (
                <span
                  key={`line-${n.id}`}
                  className={`cs-nm-line${isHotSpoke ? ' is-hot' : ''}${isAlertSpoke ? ' is-alarm' : ''}`}
                  style={{ '--cs-rot': spokeRotation(i) } as CSSProperties}
                  aria-hidden="true"
                />
              );
            })}

            {/* Layer 2: telemetry dots travelling node → hub in plain percentage
                coordinates (no motion-path needed, broad browser support). */}
            {!reduceMotion && NODES.map((n, i) => {
              if (isAlerting && n.id === 'flame') return null;
              const { nx, ny } = nodeCentre(i);
              const isHot = n.id === active;
              return (
                <motion.span
                  key={`pulse-${n.id}-${tick}`}
                  className={`cs-nm-pulse${isHot ? ' is-hot' : ''}`}
                  initial={{ left: `${nx}%`, top: `${ny}%`, opacity: 0 }}
                  animate={{ left: [`${nx}%`, '50%'], top: [`${ny}%`, '50%'], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1], times: [0, 0.12, 0.8, 1] }}
                />
              );
            })}
            {isAlerting && (alert === 'travelling' || alert === 'received') && (() => {
              const flameIdx = NODES.findIndex((n) => n.id === 'flame');
              const { nx, ny } = nodeCentre(flameIdx);
              const tx = alert === 'received' ? 50 : lerp(nx, 50, 0.9);
              const ty = alert === 'received' ? 50 : lerp(ny, 50, 0.9);
              return (
                <motion.span
                  className="cs-nm-pulse is-alarm"
                  initial={{ left: `${nx}%`, top: `${ny}%`, opacity: 0 }}
                  animate={{ left: `${tx}%`, top: `${ty}%`, opacity: 1 }}
                  transition={{ duration: alertDuration, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })()}

            {/* Layer 3: controller hub, dead centre. Its subtitle crossfades
                to the alert line on arrival, no floating label to collide
                with the spoke nodes ringing it at close range. */}
            <div className={`cs-nm-hub${isAlerting ? ' is-alert' : ''}${alert === 'received' ? ' is-hit' : ''}`}>
              <span className="cs-nm-hub-ping" aria-hidden="true" />
              <span className="cs-nm-hub-icon"><NodeGlyph kind="controller" /></span>
              <span className="cs-nm-hub-label">Controller</span>
              <span className="cs-nm-hub-sub-slot">
                <AnimatePresence mode="wait">
                  {alert === 'received' ? (
                    <motion.span
                      key="alert"
                      className="cs-nm-hub-sub is-alarm"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Alert surfaced to dashboard
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="cs-nm-hub-sub"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      BeagleBone Black Wireless
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>

            {/* Layer 4: sensor nodes, each anchored at its spoke's outer end */}
            {NODES.map((n, i) => {
              const { nx, ny } = nodeCentre(i);
              const isActive = n.id === active;
              const isFlameAlerting = isAlerting && n.id === 'flame';
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`cs-nm-node${isActive ? ' is-active' : ''}${isFlameAlerting ? ' is-alarm' : ''}`}
                  style={{ left: `${nx}%`, top: `${ny}%` }}
                  onClick={() => selectNode(n.id)}
                  onMouseEnter={() => { if (!isAlerting) { setPinned(true); setActive(n.id); } }}
                  aria-pressed={isActive}
                  aria-label={`${n.name} node${isFlameAlerting ? ', alarm active' : ''}`}
                >
                  <span className="cs-nm-node-icon"><NodeGlyph kind={n.icon} /></span>
                  <span className="cs-nm-node-name">{n.name}</span>
                  <span className="cs-nm-node-tag">{isFlameAlerting ? 'Alarm' : n.short}</span>
                  {isFlameAlerting && <span className="cs-nm-node-buzz" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <p className="cs-nm-caption">Lines are the SocketIO links; each dot is a telemetry packet on its way to the controller.</p>
        </div>

        {/* ── Detail panel ── */}
        <div className="cs-nm-panel">
          <div className="cs-nm-panel-head">
            <span className="cs-nm-eyebrow">{pinned ? 'Selected node' : 'Auto-touring · click any node to pin it'}</span>
            <div className="cs-nm-tabs" role="tablist" aria-label="Sensor nodes">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  role="tab"
                  aria-selected={n.id === active}
                  className={`cs-nm-tab${n.id === active ? ' is-active' : ''}${isAlerting && n.id === 'flame' ? ' is-alarm' : ''}`}
                  onClick={() => selectNode(n.id)}
                >
                  {n.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={node.id + (isAlerting && node.id === 'flame' ? '-alarm' : '')}
              className="cs-nm-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-nm-card-top">
                <span className="cs-nm-card-icon"><NodeGlyph kind={node.icon} /></span>
                <div>
                  <h4>{node.name} node</h4>
                  <span className="cs-nm-card-kicker">{node.short}</span>
                </div>
              </div>

              <dl className="cs-nm-deflist">
                <div>
                  <dt>Monitors</dt>
                  <dd>{node.monitors}</dd>
                </div>
                <div>
                  <dt>Sensors</dt>
                  <dd>{node.sensors}</dd>
                </div>
                <div>
                  <dt>Buzzer alert</dt>
                  <dd>{node.buzzer}</dd>
                </div>
              </dl>

              <div className={`cs-nm-status${isAlerting && node.id === 'flame' ? ' is-alarm' : ''}`}>
                <span className="cs-nm-status-dot" />
                {isAlerting && node.id === 'flame'
                  ? (alert === 'arming' ? 'Flame detected, arming local buzzer…'
                    : alert === 'travelling' ? 'Buzzer sounding, alert racing to the controller…'
                      : 'Controller has surfaced the alert to the dashboard')
                  : 'Link nominal · streaming over SocketIO'}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="cs-nm-actions">
            <button
              type="button"
              className={`cs-nm-sim${isAlerting ? ' is-busy' : ''}`}
              onClick={simulateAlert}
              disabled={isAlerting}
            >
              <span className="cs-nm-sim-dot" aria-hidden="true" />
              {isAlerting ? 'Alert in progress…' : 'Simulate flame alert'}
            </button>
            <p className="cs-nm-hint">Fires the kitchen flame node, the most safety-critical link in the mesh, and follows it into the controller.</p>
          </div>
        </div>
      </div>

      <style>{`
        .cs-nm {
          --line: rgba(255,255,255,0.10);
          --glow: color-mix(in srgb, var(--hp-sky) 60%, transparent);
          --alarm: #ff5a4d;
          margin: 1.5rem 0 0.4rem;
          padding: clamp(20px, 3vw, 30px);
          border-radius: 22px;
          background: linear-gradient(160deg, rgba(22,18,26,0.86), rgba(13,11,16,0.94));
          border: 1px solid var(--hp-line);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .cs-nm-inner {
          display: grid; grid-template-columns: 1.18fr 0.96fr;
          gap: clamp(20px, 3vw, 38px); align-items: stretch;
          position: relative; z-index: 1;
        }

        /* ── Diagram stage ── */
        .cs-nm-stage { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; min-width: 0; }
        .cs-nm-ring {
          position: absolute; inset: clamp(14px, 3vw, 26px) auto auto clamp(14px, 3vw, 26px);
          width: min(440px, 92%); aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--hp-blue) 18%, transparent), transparent 70%);
          filter: blur(40px); opacity: 0.6; pointer-events: none;
        }
        .cs-nm-grid {
          position: relative; width: min(420px, 100%); aspect-ratio: 1;
          display: grid; place-items: center;
        }

        /* Each line starts at the hub centre and extends outward, rotated to
           point at its node (angle supplied per-element via --cs-rot). The
           grid is a perfect square, so a percentage width reaches exactly
           RADIUS_PCT of the side regardless of viewport size. */
        .cs-nm-line {
          position: absolute; left: 50%; top: 50%; height: 1.5px; width: 40%;
          transform-origin: 0 50%;
          transform: rotate(var(--cs-rot, 0deg));
          background: linear-gradient(90deg, color-mix(in srgb, var(--hp-sky) 38%, transparent), var(--line) 78%);
          transition: background 0.4s ease, box-shadow 0.4s ease, height 0.3s ease;
          pointer-events: none;
        }
        .cs-nm-line.is-hot {
          height: 2px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--hp-sky) 85%, white 6%), color-mix(in srgb, var(--hp-blue) 50%, transparent) 85%);
          box-shadow: 0 0 14px -2px var(--glow);
        }
        .cs-nm-line.is-alarm {
          height: 2.5px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--alarm) 92%, white 6%), color-mix(in srgb, var(--alarm) 55%, transparent) 85%);
          box-shadow: 0 0 16px -1px rgba(255,90,77,0.55);
          animation: csNmAlarmLine 0.7s ease-in-out infinite;
        }
        @keyframes csNmAlarmLine { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }

        /* Pulses are positioned by their own centre point (left/top set inline
           as plain percentages of the square grid) and recentred with translate. */
        .cs-nm-pulse {
          position: absolute; width: 7px; height: 7px; border-radius: 50%;
          transform: translate(-50%, -50%);
          background: var(--hp-sky); pointer-events: none;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--hp-sky) 22%, transparent), 0 0 12px 1px var(--glow);
        }
        .cs-nm-pulse.is-hot { background: #fff; box-shadow: 0 0 0 4px color-mix(in srgb, var(--hp-sky) 32%, transparent), 0 0 16px 2px var(--glow); }
        .cs-nm-pulse.is-alarm {
          width: 9px; height: 9px;
          background: var(--alarm);
          box-shadow: 0 0 0 4px rgba(255,90,77,0.28), 0 0 18px 3px rgba(255,90,77,0.6);
        }

        /* Controller hub */
        .cs-nm-hub {
          position: relative; z-index: 2;
          width: clamp(118px, 28%, 142px); aspect-ratio: 1; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
          text-align: center; padding: 10px;
          background: radial-gradient(120% 120% at 50% 18%, rgba(255,255,255,0.07), transparent 60%), linear-gradient(165deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
          border: 1px solid color-mix(in srgb, var(--hp-sky) 32%, var(--hp-line));
          box-shadow: 0 18px 50px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07);
          color: var(--hp-ink, #ececec);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .cs-nm-hub-ping {
          position: absolute; inset: -1px; border-radius: 50%; pointer-events: none;
          border: 1px solid color-mix(in srgb, var(--hp-sky) 45%, transparent);
          opacity: 0; transform: scale(1);
        }
        .cs-nm-hub-icon { color: var(--hp-sky); margin-bottom: 1px; }
        .cs-nm-hub-label { font-family: 'oswaldbold'; font-size: 0.92rem; letter-spacing: -0.01em; color: #f3f3f3; line-height: 1.1; }
        /* Fixed-height slot keeps the hub from resizing as its subtitle
           crossfades between the idle caption and the surfaced-alert line. */
        .cs-nm-hub-sub-slot { position: relative; display: block; width: 100%; height: 2.6em; margin-top: 1px; }
        .cs-nm-hub-sub {
          position: absolute; inset: 0; display: block;
          font-family: 'inter'; font-size: 0.56rem; letter-spacing: 0.05em; line-height: 1.3;
          color: var(--hp-ink-dim, rgba(232,232,232,0.56));
          max-width: 13ch; margin: 0 auto;
        }
        .cs-nm-hub-sub.is-alarm { color: #ffb4ac; font-weight: 600; letter-spacing: 0.04em; max-width: 12ch; }
        .cs-nm-hub.is-alert { border-color: rgba(255,90,77,0.5); box-shadow: 0 18px 50px -20px rgba(255,90,77,0.35), inset 0 1px 0 rgba(255,255,255,0.07); }
        .cs-nm-hub.is-hit .cs-nm-hub-ping { animation: csNmHubPing 0.85s cubic-bezier(0.16,1,0.3,1) 1; border-color: rgba(255,90,77,0.65); }
        @keyframes csNmHubPing { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.55); } }

        /* Sensor nodes: left/top set inline as plain percentages (nodeCentre),
           recentred on that point so the spoke lines meet their middles. */
        .cs-nm-node {
          position: absolute; transform: translate(-50%, -50%);
          z-index: 3; cursor: pointer; appearance: none;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          width: clamp(82px, 21%, 100px); padding: 11px 8px 10px;
          border-radius: 16px; text-align: center;
          background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.1);
          color: var(--hp-ink-dim, rgba(232,232,232,0.6));
          box-shadow: 0 10px 30px -18px rgba(0,0,0,0.7);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }
        .cs-nm-node:hover { transform: translate(-50%, -50%) translateY(-3px); border-color: color-mix(in srgb, var(--hp-sky) 38%, rgba(255,255,255,0.12)); }
        .cs-nm-node:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 3px; }
        .cs-nm-node-icon { color: color-mix(in srgb, var(--hp-ink-dim, #bbb) 70%, transparent); transition: color 0.3s ease; }
        .cs-nm-node-name { font-family: 'dmsans'; font-weight: 700; font-size: 0.78rem; color: inherit; line-height: 1.2; }
        .cs-nm-node-tag { font-family: 'inter'; font-size: 0.56rem; letter-spacing: 0.09em; text-transform: uppercase; color: inherit; opacity: 0.62; }
        .cs-nm-node.is-active {
          transform: translate(-50%, -50%) translateY(-4px);
          background: color-mix(in srgb, var(--hp-blue) 16%, rgba(255,255,255,0.04));
          border-color: color-mix(in srgb, var(--hp-sky) 55%, transparent);
          color: #f4f4f4;
          box-shadow: 0 16px 40px -18px rgba(0,0,0,0.8), 0 0 0 1px color-mix(in srgb, var(--hp-sky) 18%, transparent), 0 0 24px -6px var(--glow);
        }
        .cs-nm-node.is-active .cs-nm-node-icon { color: var(--hp-sky); }
        .cs-nm-node.is-alarm {
          background: rgba(255,90,77,0.14); border-color: rgba(255,90,77,0.6); color: #ffe2df;
          box-shadow: 0 16px 40px -16px rgba(255,90,77,0.4), 0 0 0 1px rgba(255,90,77,0.25);
          animation: csNmNodeFlash 0.6s ease-in-out infinite;
        }
        .cs-nm-node.is-alarm .cs-nm-node-icon { color: var(--alarm); }
        @keyframes csNmNodeFlash { 0%, 100% { transform: translate(-50%, -50%) translateY(-4px) scale(1); } 50% { transform: translate(-50%, -50%) translateY(-4px) scale(1.045); } }
        .cs-nm-node-buzz {
          position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border-radius: 50%;
          background: var(--alarm); box-shadow: 0 0 0 0 rgba(255,90,77,0.6);
          animation: csNmBuzz 0.55s ease-out infinite;
        }
        @keyframes csNmBuzz { 0% { box-shadow: 0 0 0 0 rgba(255,90,77,0.55); } 100% { box-shadow: 0 0 0 7px rgba(255,90,77,0); } }

        .cs-nm-caption {
          font-family: 'dmsans'; font-size: 0.78rem; line-height: 1.6; text-align: center;
          color: var(--hp-ink-dim, rgba(232,232,232,0.5)); max-width: 38ch; margin: 0;
        }

        /* ── Detail panel ── */
        .cs-nm-panel { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
        .cs-nm-panel-head { display: flex; flex-direction: column; gap: 10px; }
        .cs-nm-eyebrow {
          font-family: 'inter'; font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--hp-sky); font-weight: 600;
        }
        .cs-nm-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
        .cs-nm-tab {
          font-family: 'dmsans'; font-size: 0.74rem; font-weight: 600; cursor: pointer;
          padding: 7px 12px; border-radius: 999px; color: var(--hp-ink-dim, rgba(232,232,232,0.6));
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.2s ease;
        }
        .cs-nm-tab:hover { transform: translateY(-1px); color: #eee; border-color: rgba(255,255,255,0.18); }
        .cs-nm-tab:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 2px; }
        .cs-nm-tab.is-active {
          color: #fff; background: color-mix(in srgb, var(--hp-blue) 22%, transparent);
          border-color: color-mix(in srgb, var(--hp-sky) 50%, transparent);
        }
        .cs-nm-tab.is-alarm { color: #ffd9d4; background: rgba(255,90,77,0.16); border-color: rgba(255,90,77,0.5); }

        .cs-nm-card {
          padding: 16px clamp(16px, 2.4vw, 22px); border-radius: 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; gap: 13px;
        }
        .cs-nm-card-top { display: flex; align-items: center; gap: 12px; }
        .cs-nm-card-icon {
          display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
          background: color-mix(in srgb, var(--hp-blue) 18%, transparent); color: var(--hp-sky);
          border: 1px solid color-mix(in srgb, var(--hp-sky) 28%, transparent);
        }
        .cs-nm-card h4 { font-family: 'oswaldbold'; font-size: 1.06rem; color: #f1f1f1; margin: 0; letter-spacing: -0.01em; line-height: 1.15; }
        .cs-nm-card-kicker { font-family: 'inter'; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hp-ink-dim, rgba(232,232,232,0.5)); }
        .cs-nm-deflist { display: flex; flex-direction: column; gap: 9px; margin: 0; }
        .cs-nm-deflist > div { display: grid; grid-template-columns: 84px 1fr; gap: 12px; align-items: baseline; }
        .cs-nm-deflist dt { font-family: 'inter'; font-weight: 700; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hp-sky); margin: 0; }
        .cs-nm-deflist dd { font-family: 'dmsans'; font-size: 0.86rem; line-height: 1.6; color: rgba(232,232,232,0.78); margin: 0; }

        .cs-nm-status {
          display: inline-flex; align-items: center; gap: 9px; align-self: flex-start;
          font-family: 'dmsans'; font-size: 0.78rem; color: rgba(232,232,232,0.6);
          padding: 7px 13px 7px 11px; border-radius: 999px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
        }
        .cs-nm-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 3px rgba(52,211,153,0.18); flex-shrink: 0; }
        .cs-nm-status.is-alarm { color: #ffd9d4; background: rgba(255,90,77,0.1); border-color: rgba(255,90,77,0.35); }
        .cs-nm-status.is-alarm .cs-nm-status-dot { background: var(--alarm); box-shadow: 0 0 0 3px rgba(255,90,77,0.22); animation: csNmBuzz 0.55s ease-out infinite; }

        .cs-nm-actions { margin-top: auto; display: flex; flex-direction: column; gap: 9px; padding-top: 4px; }
        .cs-nm-sim {
          align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; cursor: pointer;
          font-family: 'dmsans'; font-weight: 600; font-size: 0.88rem; color: #fff;
          padding: 11px 18px; border-radius: 999px;
          background: color-mix(in srgb, var(--alarm) 20%, transparent);
          border: 1px solid color-mix(in srgb, var(--alarm) 48%, transparent);
          transition: transform 0.2s ease, border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
        }
        .cs-nm-sim:hover:not(:disabled) { transform: translateY(-1px); border-color: color-mix(in srgb, var(--alarm) 70%, transparent); }
        .cs-nm-sim:active:not(:disabled) { transform: translateY(0); }
        .cs-nm-sim:focus-visible { outline: 2px solid var(--alarm); outline-offset: 3px; }
        .cs-nm-sim:disabled { cursor: progress; opacity: 0.72; }
        .cs-nm-sim-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--alarm); box-shadow: 0 0 0 3px rgba(255,90,77,0.25); flex-shrink: 0; }
        .cs-nm-sim.is-busy .cs-nm-sim-dot { animation: csNmBuzz 0.55s ease-out infinite; }
        .cs-nm-hint { font-family: 'dmsans'; font-size: 0.76rem; line-height: 1.6; color: var(--hp-ink-dim, rgba(232,232,232,0.46)); max-width: 44ch; margin: 0; }

        @media (max-width: 880px) {
          .cs-nm-inner { grid-template-columns: 1fr; gap: 26px; }
          .cs-nm-stage { padding-top: 6px; }
        }
        @media (max-width: 480px) {
          .cs-nm-grid { width: min(312px, 100%); }
          .cs-nm-hub { width: clamp(96px, 30%, 116px); gap: 2px; }
          .cs-nm-hub-label { font-size: 0.8rem; }
          /* Hide the idle caption to save space, but keep the alert line:
             it is the one moment the controller's read-out matters most. */
          .cs-nm-hub-sub-slot { height: 2.3em; }
          .cs-nm-hub-sub:not(.is-alarm) { display: none; }
          .cs-nm-hub-sub.is-alarm { font-size: 0.5rem; max-width: 10ch; }
          .cs-nm-node { width: clamp(70px, 23%, 84px); padding: 9px 6px 8px; gap: 3px; }
          .cs-nm-node-name { font-size: 0.7rem; }
          .cs-nm-node-tag { font-size: 0.5rem; }
          .cs-nm-deflist > div { grid-template-columns: 1fr; gap: 3px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-nm-line.is-alarm,
          .cs-nm-node.is-alarm,
          .cs-nm-node-buzz,
          .cs-nm-status.is-alarm .cs-nm-status-dot,
          .cs-nm-sim.is-busy .cs-nm-sim-dot { animation: none; }
          .cs-nm-hub-ping { animation: none; opacity: 0; }
        }

        /* Fallback for browsers without CSS motion-path support: keep the
           pulse centred on the spoke so nothing renders off-position. */
        @supports not (offset-path: path('M 0 0')) {
          .cs-nm-pulse { display: none; }
        }
      `}</style>
    </div>
  );
}
