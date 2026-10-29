'use client';
import { useEffect, useRef, useState } from 'react';

/* ReadCycle: the reader firmware flow for a typical deployment (report Figure 2.24),
   walked node by node. Three routes: a confident first read, a low-confidence read
   that falls back to the full pipeline, and a read that is rejected. Auto-plays,
   pauses off-screen, and the description has a fixed reserve so nothing reflows. */

type Node = { id: string; title: string; sub: string; time?: string; x: number; y: number; w: number; h: number; side: 'main' | 'backup' };
const NODES: Node[] = [
  { id: 'wake', title: 'Wake from RTC', sub: 'restore state, initialise peripherals', time: '~0.2 s', x: 20, y: 20, w: 300, h: 84, side: 'main' },
  { id: 'capture', title: 'Image capture', sub: 'image captured using the LED lights', time: '~0.5 s', x: 20, y: 134, w: 300, h: 84, side: 'main' },
  { id: 'low', title: 'Low power reading', sub: 'DrumNet readers only, stored ROI, no WindowNet', time: '~0.5 to 3 s', x: 20, y: 248, w: 300, h: 84, side: 'main' },
  { id: 'uplink', title: 'LoRaWAN uplink', sub: 'reading sent to the gateway', time: '~0.3 s', x: 20, y: 476, w: 300, h: 84, side: 'main' },
  { id: 'sleep', title: 'Sleep', sub: 'all peripherals are shut down', x: 20, y: 590, w: 300, h: 84, side: 'main' },
  { id: 'full', title: 'Full DrumNet pipeline', sub: 'rerun with WindowNet as a backup', x: 420, y: 248, w: 320, h: 84, side: 'backup' },
  { id: 'check', title: 'Check confidence', sub: 'is the new reading confident enough?', x: 420, y: 362, w: 320, h: 84, side: 'backup' },
  { id: 'alt', title: 'Run with alternative spotter', sub: 'a different backup set of weights', x: 420, y: 476, w: 320, h: 84, side: 'backup' },
  { id: 'reject', title: 'Reject reading', sub: 'saved to NVS for evaluation, warned on the dashboard', x: 420, y: 590, w: 320, h: 84, side: 'backup' },
];
const N = Object.fromEntries(NODES.map((n) => [n.id, n]));

type Route = { key: string; label: string; path: string[]; edges: string[] };
const ROUTES: Route[] = [
  { key: 'ok', label: 'Confident first read', path: ['wake', 'capture', 'low', 'uplink', 'sleep'], edges: ['wake-capture', 'capture-low', 'low-uplink', 'uplink-sleep'] },
  { key: 'backup', label: 'Low confidence, backup', path: ['wake', 'capture', 'low', 'full', 'check', 'uplink', 'sleep'], edges: ['wake-capture', 'capture-low', 'low-full', 'full-check', 'check-uplink', 'uplink-sleep'] },
  { key: 'reject', label: 'Still unsure, rejected', path: ['wake', 'capture', 'low', 'full', 'check', 'alt', 'reject', 'uplink', 'sleep'], edges: ['wake-capture', 'capture-low', 'low-full', 'full-check', 'check-alt', 'alt-reject', 'reject-uplink', 'uplink-sleep'] },
];

const DESC: Record<string, string> = {
  wake: 'The reader wakes up from sleep and restores the reader configuration and LoRaWAN session from Non-Volatile Storage (NVS).',
  capture: 'The camera is initialised and a capture is taken with the LED lights.',
  low: 'The image is run directly through the DrumNet readers using the stored ROI from setup, with no WindowNet. This is the normal, cheapest path.',
  full: 'Only if the DrumNet readers report a low confidence will the full DrumNet pipeline run as a backup, with WindowNet finding the window again.',
  check: 'The confidence of the new reading is checked. A confident reading goes straight to the uplink.',
  alt: 'The spotter is run again with a different backup set of weights, one more attempt before giving up on this cycle.',
  reject: 'A failed first attempt is stored in the NVS for future evaluation, and a low-confidence warning is reported in the dashboard.',
  uplink: 'Once the reading is ready, the LoRa link is switched on and the reading is sent to the LoRa gateway.',
  sleep: 'Finally the reader shuts off all peripherals and goes into deep sleep, to wake up at the next RTC-triggered cycle. Pressing the boot button wakes it for configuration.',
};
const LONGEST = Object.values(DESC).reduce((a, b) => (b.length > a.length ? b : a), '');

const GREEN = '#6fd38a';
const RED = '#ff6666';
const INK = '#e9e0d2';
const edgePath = (a: Node, b: Node) => {
  if (a.side === b.side) return `M${a.x + a.w / 2} ${a.y + a.h} V${b.y}`;
  if (a.side === 'main') return `M${a.x + a.w} ${a.y + a.h / 2} H${b.x}`;
  return `M${a.x} ${a.y + a.h / 2} H${b.x + b.w / 2} V${b.y}`;
};
const EDGES: Array<{ id: string; a: string; b: string; tone: 'plain' | 'ok' | 'fail'; label?: string }> = [
  { id: 'wake-capture', a: 'wake', b: 'capture', tone: 'plain' },
  { id: 'capture-low', a: 'capture', b: 'low', tone: 'plain' },
  { id: 'low-uplink', a: 'low', b: 'uplink', tone: 'ok', label: 'success' },
  { id: 'low-full', a: 'low', b: 'full', tone: 'fail', label: 'fail' },
  { id: 'full-check', a: 'full', b: 'check', tone: 'plain' },
  { id: 'check-uplink', a: 'check', b: 'uplink', tone: 'ok', label: 'success' },
  { id: 'check-alt', a: 'check', b: 'alt', tone: 'fail', label: 'fail' },
  { id: 'alt-uplink', a: 'alt', b: 'uplink', tone: 'ok', label: 'success' },
  { id: 'alt-reject', a: 'alt', b: 'reject', tone: 'fail', label: 'fail' },
  { id: 'reject-uplink', a: 'reject', b: 'uplink', tone: 'plain' },
  { id: 'uplink-sleep', a: 'uplink', b: 'sleep', tone: 'plain' },
];

export default function ReadCycle() {
  const [route, setRoute] = useState(0);
  const [pos, setPos] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !inView) return;
    const r = ROUTES[route];
    const t = setTimeout(() => {
      if (pos < r.path.length - 1) setPos(pos + 1);
      else { setRoute((route + 1) % ROUTES.length); setPos(0); }
    }, pos === r.path.length - 1 ? 2600 : 1700);
    return () => clearTimeout(t);
  }, [auto, inView, route, pos]);

  const r = ROUTES[route];
  const cur = r.path[pos];
  const visited = new Set(r.path.slice(0, pos + 1));
  const litEdges = new Set(r.edges.slice(0, pos));
  const pick = (k: number) => { setAuto(false); setRoute(k); setPos(0); };
  const step = (d: number) => { setAuto(false); setPos((p) => Math.max(0, Math.min(r.path.length - 1, p + d))); };

  return (
    <div ref={rootRef} className="ws-panel rc" data-no-zoom>
      <div className="ws-panel-head">
        <div className="ws-tabs" role="tablist" aria-label="Reading outcome">
          {ROUTES.map((x, k) => (
            <button key={x.key} type="button" role="tab" aria-selected={k === route} className={`ws-tab${k === route ? ' on' : ''}`} onClick={() => pick(k)}><span className="n">{['I', 'II', 'III'][k]}</span>{x.label}</button>
          ))}
        </div>
        <button type="button" className={`ws-play${auto ? ' on' : ''}`} aria-pressed={auto} onClick={() => setAuto((a) => !a)}><span className="dot" aria-hidden="true" />{auto ? 'Playing' : 'Paused'}</button>
      </div>
      <div className="rc-body">
        <svg viewBox="0 0 760 694" className="rc-svg" role="img" aria-label={`Reader firmware flow, currently at ${N[cur].title}`}>
          <defs>
            <marker id="rc-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker>
          </defs>
          {EDGES.map((e) => {
            const lit = litEdges.has(e.id);
            const c = e.tone === 'ok' ? GREEN : e.tone === 'fail' ? RED : '#8a847e';
            const a = N[e.a], b = N[e.b];
            const d = edgePath(a, b);
            const lx = a.side === b.side ? a.x + a.w / 2 + 10 : a.side === 'main' ? (a.x + a.w + b.x) / 2 : b.x + b.w / 2 + 10;
            const ly = a.side === b.side ? (a.y + a.h + b.y) / 2 + 5 : a.side === 'main' ? a.y + a.h / 2 - 8 : (a.y + a.h / 2 + b.y) / 2;
            return (
              <g key={e.id} opacity={lit ? 1 : 0.28} style={{ transition: 'opacity .35s' }}>
                <path d={d} fill="none" stroke={c} strokeWidth={lit ? 2.6 : 1.6} markerEnd="url(#rc-ar)" style={{ transition: 'stroke-width .35s' }} />
                {e.label && <text x={lx} y={ly} fontSize={12} fill={c} style={{ fontFamily: "Manrope, Arial, sans-serif" }} fontWeight={600} letterSpacing="0.1em" textAnchor={a.side === 'main' && b.side === 'backup' ? 'middle' : 'start'}>{e.label.toUpperCase()}</text>}
              </g>
            );
          })}
          <path d={`M${N.sleep.x} ${N.sleep.y + N.sleep.h / 2} H6 V${N.wake.y + N.wake.h / 2} H${N.wake.x}`} fill="none" stroke="#ada496" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.5} markerEnd="url(#rc-ar)" />
          <text x={12} y={N.wake.y + N.wake.h / 2 - 220} fontSize={11} fill="#ada496" style={{ fontFamily: "Manrope, Arial, sans-serif" }} fontWeight={600} transform={`rotate(-90 12 ${N.wake.y + N.wake.h / 2 - 220})`} textAnchor="middle" letterSpacing="0.1em">NEXT CYCLE</text>
          {NODES.map((n) => {
            const on = n.id === cur, seen = visited.has(n.id);
            return (
              <g key={n.id} opacity={seen ? 1 : 0.38} style={{ transition: 'opacity .35s' }} onClick={() => { const k = r.path.indexOf(n.id); if (k >= 0) { setAuto(false); setPos(k); } }} cursor="pointer">
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill={on ? 'rgba(255,102,102,0.1)' : 'rgba(216,203,184,0.03)'} stroke={on ? RED : n.side === 'backup' ? '#4a4540' : '#d8cbb875'} strokeWidth={on ? 2 : 1.4} style={{ transition: 'fill .35s, stroke .35s' }} />
                {n.time && <text x={n.x + 16} y={n.y + 22} fontSize={11.5} fill={on ? RED : '#ada496'} style={{ fontFamily: "Manrope, Arial, sans-serif" }} fontWeight={600} letterSpacing="0.08em">{n.time}</text>}
                <text x={n.x + n.w / 2} y={n.y + (n.time ? 48 : 42)} fontSize={21} fill={INK} textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{n.title}</text>
                <text x={n.x + n.w / 2} y={n.y + (n.time ? 69 : 64)} fontSize={12.5} fill="#ada496" textAnchor="middle" style={{ fontFamily: "Manrope, Arial, sans-serif" }}>{n.sub}</text>
                {on && !reduced && <rect x={n.x - 4} y={n.y - 4} width={n.w + 8} height={n.h + 8} rx={15} fill="none" stroke={RED} strokeWidth={1} opacity={0.5} className="rc-ring" />}
              </g>
            );
          })}
        </svg>
        <div className="rc-read">
          <span className="ws-eyebrow">{r.label} · {pos + 1} of {r.path.length}</span>
          <h4 className="ws-wtitle">{N[cur].title}</h4>
          <div className="rc-cap-wrap">
            <p className="ws-wcap rc-cap-sizer" aria-hidden="true">{LONGEST}</p>
            <p className="ws-wcap">{DESC[cur]}</p>
          </div>
          <div className="ws-arrows rc-nav">
            <button type="button" className="ws-arrow" onClick={() => step(-1)} aria-label="Previous node">←</button>
            <button type="button" className="ws-arrow" onClick={() => step(1)} aria-label="Next node">→</button>
          </div>
        </div>
      </div>
      <style>{`
        .rc-body { display: grid; grid-template-columns: 1.25fr 1fr; gap: 22px; padding: 18px 16px; align-items: start; }
        .rc-svg { display: block; width: 100%; height: auto; }
        .rc-ring { animation: rc-ring 1.6s ease-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes rc-ring { from { opacity: .55; transform: scale(1); } to { opacity: 0; transform: scale(1.06); } }
        .rc-read { position: sticky; top: 120px; }
        .rc-cap-wrap { display: grid; }
        .rc-cap-wrap > p { grid-area: 1 / 1; }
        .rc-cap-sizer { visibility: hidden; pointer-events: none; }
        .rc-nav { margin-top: 14px; }
        @media (max-width: 760px) { .rc-body { grid-template-columns: 1fr; gap: 12px; padding: 12px; } .rc-read { position: static; } }
        @media (prefers-reduced-motion: reduce) { .rc-ring { animation: none; } }
      `}</style>
    </div>
  );
}
