'use client';
import Story, { type Frame } from './Story';

/* ReadCycle: the reader firmware flow for a typical deployment (report Figure 2.24),
   walked node by node as the reader scrolls. One pass follows the longest route,
   a read that is rejected, so every branch is visited; the copy says where a
   confident reading would have left the loop earlier. */

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


/* The chart with one node current and everything before it on the route lit. */
function Chart({ pos, route }: { pos: number; route: Route }) {
  const cur = route.path[pos];
  const visited = new Set(route.path.slice(0, pos + 1));
  const lit = new Set(route.edges.slice(0, pos));
  // at the fork the reader sees both ways out
  if (cur === 'low') { lit.add('low-uplink'); lit.add('low-full'); }
  if (cur === 'check') { lit.add('check-uplink'); lit.add('check-alt'); }
  if (cur === 'alt') { lit.add('alt-uplink'); lit.add('alt-reject'); }
  return (
    <div className="ws-wstage rc-stage" style={{ ['--ar' as string]: 760 / 694 }} data-no-zoom>
      <svg viewBox="0 0 760 694" className="rc-svg" role="img" aria-label={`Reader firmware flow, at ${N[cur].title}`}>
        <defs>
          <marker id="rc-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker>
        </defs>
        {EDGES.map((e) => {
          const on = lit.has(e.id);
          const c = e.tone === 'ok' ? GREEN : e.tone === 'fail' ? RED : '#8a847e';
          const a = N[e.a], b = N[e.b];
          const lx = a.side === b.side ? a.x + a.w / 2 + 10 : a.side === 'main' ? (a.x + a.w + b.x) / 2 : b.x + b.w / 2 + 10;
          const ly = a.side === b.side ? (a.y + a.h + b.y) / 2 + 5 : a.side === 'main' ? a.y + a.h / 2 - 8 : (a.y + a.h / 2 + b.y) / 2;
          return (
            <g key={e.id} opacity={on ? 1 : 0.28} style={{ transition: 'opacity .35s' }}>
              <path d={edgePath(a, b)} fill="none" stroke={c} strokeWidth={on ? 2.6 : 1.6} markerEnd="url(#rc-ar)" style={{ transition: 'stroke-width .35s' }} />
              {e.label && <text x={lx} y={ly} fontSize={12} fill={c} style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.1em" textAnchor={a.side === 'main' && b.side === 'backup' ? 'middle' : 'start'}>{e.label.toUpperCase()}</text>}
            </g>
          );
        })}
        <path d={`M${N.sleep.x} ${N.sleep.y + N.sleep.h / 2} H6 V${N.wake.y + N.wake.h / 2} H${N.wake.x}`} fill="none" stroke="#ada496" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.5} markerEnd="url(#rc-ar)" />
        <text x={12} y={N.wake.y + N.wake.h / 2 - 220} fontSize={11} fill="#ada496" style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} transform={`rotate(-90 12 ${N.wake.y + N.wake.h / 2 - 220})`} textAnchor="middle" letterSpacing="0.1em">NEXT CYCLE</text>
        {NODES.map((n) => {
          const on = n.id === cur, seen = visited.has(n.id);
          return (
            <g key={n.id} opacity={seen ? 1 : 0.38} style={{ transition: 'opacity .35s' }}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill={on ? 'rgba(255,102,102,0.1)' : 'rgba(216,203,184,0.03)'} stroke={on ? RED : n.side === 'backup' ? '#4a4540' : '#d8cbb875'} strokeWidth={on ? 2 : 1.4} />
              {n.time && <text x={n.x + 16} y={n.y + 22} fontSize={11.5} fill={on ? RED : '#ada496'} style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.08em">{n.time}</text>}
              <text x={n.x + n.w / 2} y={n.y + (n.time ? 48 : 42)} fontSize={21} fill={INK} textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{n.title}</text>
              <text x={n.x + n.w / 2} y={n.y + (n.time ? 69 : 64)} fontSize={12.5} fill="#ada496" textAnchor="middle" style={{ fontFamily: 'Manrope, Arial, sans-serif' }}>{n.sub}</text>
            </g>
          );
        })}
      </svg>
      <style>{`.rc-svg { display: block; width: 100%; height: auto; aspect-ratio: 760 / 694; }`}</style>
    </div>
  );
}

const ROUTE = ROUTES[2];
const EXTRA: Record<string, string> = {
  low: ' A confident reading goes straight to the uplink: the usual cycle is five steps and about 1.5 s awake.',
  check: ' Most readings leave the loop here.',
};
export const readCycleFrames = (): Frame[] => ROUTE.path.map((id, k) => ({
  id: `rc-${id}`,
  eyebrow: `Reader firmware · ${k + 1} of ${ROUTE.path.length}`,
  title: N[id].title,
  body: <p>{DESC[id]}{EXTRA[id] ?? ''}</p>,
  visual: <Chart pos={k} route={ROUTE} />,
}));

const I = '/images/waterslop/';
const FRAMES: Frame[] = [
  {
    id: 'fw-agents', eyebrow: 'Firmware', title: 'Written by an agent, on real hardware',
    body: (
      <>
        <p>An Astra 6 agent was tasked with writing the firmware for the reader (Prototype V2) and for the M5Stack Cardputer Adv, which runs ConfigKing, the configuration console that lets onsite engineers configure readers for deployment and reconfigure them later. The agent was told to only write code using Fable 5.1.</p>
        <p className="ws-note">My laptop, the LoRaWAN gateway (graciously provided by Mr Lee Chang Fatt) and the Jetson Nano were set up on the same network; the Cardputer and Prototype V2 were connected over USB serial to the laptop, and all four devices were made available to the agents.</p>
      </>
    ),
    visual: <img src={I + 'fw-setup.webp'} alt="The firmware development setup: the laptop, Jetson Nano, LoRaWAN gateway, Prototype V2 reader and the Cardputer, with the agents reaching them over the network" className="plate" loading="lazy" decoding="async" />,
    pointers: [
      { at: [26, 16], label: 'cellular router (LAN)', to: [12, 30] },
      { at: [62, 18], label: 'Jetson Nano: MQTT, SQLite, dashboard', to: [78, 38] },
      { at: [24, 44], label: 'the agents, on my laptop', to: [10, 60] },
      { at: [66, 52], label: 'LoRaWAN gateway', to: [80, 62] },
      { at: [17, 86], label: 'Cardputer, ConfigKing', to: [8, 72] },
      { at: [42, 86], label: 'Prototype V2 reader', to: [48, 70] },
    ],
  },
  ...readCycleFrames(),
  {
    id: 'dashboard', eyebrow: 'Dashboard', title: 'Where the reading lands',
    body: <p>After the reading is made it is sent to the LoRaWAN gateway, which forwards it over MQTT to the Jetson Nano, where it is stored. The Jetson serves the dashboard as a single HTML file whose JavaScript updates the values from the stored data. The dashboard is a demo and is not designed to scale to real deployments.</p>,
    visual: <img src={I + 'dashboard.webp'} alt="The reader monitor dashboard: a bench reader card reading 0092.07 cubic metres with a low confidence chip, and history charts and a table of nine readings" loading="lazy" decoding="async" />,
    pointers: [
      { at: [9, 21], label: '0092.07 m³, the reading', to: [30, 14] },
      { at: [20, 11], label: 'low confidence, flagged', to: [38, 26] },
      { at: [50, 66], label: 'RSSI, SNR and timing history', to: [62, 46] },
      { at: [40, 94], label: 'every reading received', to: [58, 86] },
    ],
  },
];

export default function FirmwareStory({ chapter }: { chapter: string }) {
  return <Story id="firmware" chapter={chapter} title="Firmware" frames={FRAMES} per={0.8} />;
}
