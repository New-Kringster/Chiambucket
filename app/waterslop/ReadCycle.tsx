'use client';
import { Cover, Page, Plate, type Frame } from './Story';

/* FirmwareChapter: the firmware's story in three rows: the setup the agent wrote
   it on, the reader's flow for a typical deployment (report Figure 2.24) with
   every step named beside it, and the dashboard where the reading lands. */

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
const GREEN = '#6fd38a', RED = '#ff6666', INK = '#e9e0d2';
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
const STEPS: Array<{ id: string; n: number; desc: string; tone?: 'ok' | 'red' }> = [
  { id: 'wake', n: 1, desc: 'The reader wakes from sleep and restores its configuration and LoRaWAN session from Non-Volatile Storage.' },
  { id: 'capture', n: 2, desc: 'The camera is initialised and a capture is taken with the LED lights.' },
  { id: 'low', n: 3, desc: 'The image goes straight through the DrumNet readers using the stored ROI from setup, no WindowNet. The normal, cheapest path: a confident reading goes to the uplink, about 1.5 s awake in all.', tone: 'ok' },
  { id: 'full', n: 4, desc: 'Only if the readers report a low confidence does the full pipeline run as a backup, with WindowNet finding the window again.', tone: 'red' },
  { id: 'check', n: 5, desc: 'The new reading’s confidence is checked. Most readings leave the loop here.' },
  { id: 'alt', n: 6, desc: 'The spotter runs once more with a different backup set of weights, one last attempt this cycle.', tone: 'red' },
  { id: 'reject', n: 7, desc: 'A failed attempt is stored in NVS for later evaluation and a low-confidence warning is reported on the dashboard.', tone: 'red' },
  { id: 'uplink', n: 8, desc: 'The LoRa link switches on and the reading is sent to the gateway.' },
  { id: 'sleep', n: 9, desc: 'All peripherals shut down and the reader deep-sleeps until the RTC wakes it for the next cycle. Pressing BOOT wakes it for configuration.' },
];

/* The chart, every node and edge numbered to match the steps beside it. */
function Chart() {
  return (
    <div className="ws-wstage rc-stage" style={{ ['--ar' as string]: 760 / 694 }} data-no-zoom>
      <svg viewBox="0 0 760 694" className="rc-svg" role="img" aria-label="Reader firmware flow for one wake cycle">
        <defs>
          <marker id="rc-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker>
        </defs>
        {EDGES.map((e) => {
          const c = e.tone === 'ok' ? GREEN : e.tone === 'fail' ? RED : '#8a847e';
          const a = N[e.a], b = N[e.b];
          const lx = a.side === b.side ? a.x + a.w / 2 + 10 : a.side === 'main' ? (a.x + a.w + b.x) / 2 : b.x + b.w / 2 + 10;
          const ly = a.side === b.side ? (a.y + a.h + b.y) / 2 + 5 : a.side === 'main' ? a.y + a.h / 2 - 8 : (a.y + a.h / 2 + b.y) / 2;
          return (
            <g key={e.id}>
              <path d={edgePath(a, b)} fill="none" stroke={c} strokeWidth={e.tone === 'plain' ? 1.6 : 2.2} markerEnd="url(#rc-ar)" />
              {e.label && <text x={lx} y={ly} fontSize={12} fill={c} style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.1em" textAnchor={a.side === 'main' && b.side === 'backup' ? 'middle' : 'start'}>{e.label.toUpperCase()}</text>}
            </g>
          );
        })}
        <path d={`M${N.sleep.x} ${N.sleep.y + N.sleep.h / 2} H6 V${N.wake.y + N.wake.h / 2} H${N.wake.x}`} fill="none" stroke="#ada496" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.6} markerEnd="url(#rc-ar)" />
        <text x={12} y={N.wake.y + N.wake.h / 2 - 220} fontSize={11} fill="#ada496" style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} transform={`rotate(-90 12 ${N.wake.y + N.wake.h / 2 - 220})`} textAnchor="middle" letterSpacing="0.1em">NEXT CYCLE</text>
        {NODES.map((n) => {
          const step = STEPS.find((s) => s.id === n.id)!;
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill={n.side === 'backup' ? 'rgba(255,102,102,0.05)' : 'rgba(216,203,184,0.04)'} stroke={n.side === 'backup' ? '#6b4a4a' : '#d8cbb875'} strokeWidth={1.4} />
              <circle cx={n.x + 18} cy={n.y + 18} r={11} fill="#d8cbb8" />
              <text x={n.x + 18} y={n.y + 23} fontSize={13} fill="#181716" textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{step.n}</text>
              {n.time && <text x={n.x + n.w - 14} y={n.y + 22} fontSize={11.5} fill="#ada496" textAnchor="end" style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.08em">{n.time}</text>}
              <text x={n.x + n.w / 2} y={n.y + 50} fontSize={21} fill={INK} textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{n.title}</text>
              <text x={n.x + n.w / 2} y={n.y + 70} fontSize={12.5} fill="#ada496" textAnchor="middle" style={{ fontFamily: 'Manrope, Arial, sans-serif' }}>{n.sub}</text>
            </g>
          );
        })}
      </svg>
      <style>{`.rc-svg { display: block; width: 100%; height: auto; aspect-ratio: 760 / 694; } .ws-row .rc-stage { width: min(var(--vw, 48vw), calc((100svh - var(--ws-nav, 0px) - 14svh) * 1.095)); }`}</style>
    </div>
  );
}

const I = '/images/waterslop/';
const ROWS: Frame[] = [
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
      { at: [26, 16], label: 'cellular router (LAN)' },
      { at: [62, 18], label: 'Jetson Nano: MQTT, SQLite, dashboard' },
      { at: [24, 44], label: 'the agents, on my laptop', edge: 'top', to: [8, 0] },
      { at: [66, 52], label: 'LoRaWAN gateway', edge: 'bottom', to: [84, 0] },
      { at: [17, 86], label: 'Cardputer, ConfigKing' },
      { at: [42, 86], label: 'Prototype V2 reader' },
    ],
  },
  {
    id: 'fw-cycle', eyebrow: 'One wake cycle', title: 'Nine steps, most readings take five',
    body: (
      <ol className="ws-steps">
        {STEPS.map((s) => <li key={s.id} className={s.tone}><b>{N[s.id].title}</b>{s.desc}</li>)}
      </ol>
    ),
    visual: <Chart />,
  },
  {
    id: 'fw-dashboard', eyebrow: 'Dashboard', title: 'Where the reading lands',
    body: <p>After the reading is made it is sent to the LoRaWAN gateway, which forwards it over MQTT to the Jetson Nano, where it is stored. The Jetson serves the dashboard as a single HTML file whose JavaScript updates the values from the stored data. The dashboard is a demo and is not designed to scale to real deployments.</p>,
    visual: <img src={I + 'dashboard.webp'} alt="The reader monitor dashboard: a bench reader card reading 0092.07 cubic metres with a low confidence chip, and history charts and a table of nine readings" loading="lazy" decoding="async" />,
    pointers: [
      { at: [9, 21], label: '0092.07 m³, the reading', to: [12, 0] },
      { at: [20, 11], label: 'low confidence, flagged', to: [40, 0] },
      { at: [50, 66], label: 'RSSI, SNR and timing history' },
      { at: [40, 94], label: 'every reading received', to: [18, 0] },
    ],
  },
];

export default function FirmwareChapter({ chapter }: { chapter: string }) {
  return (
    <>
      <Cover id="firmware" chapter={chapter} title="Firmware" lines={['Reader', 'firmware']} contents={[{ label: 'Written by an agent', href: '#fw-agents' }, { label: 'One wake cycle', href: '#fw-cycle' }, { label: 'The dashboard', href: '#fw-dashboard' }]}
        plate={<Plate srcs={['dashboard.webp', 'fw-setup.webp']} alt="The reader dashboard" />} />
      <Page id="firmware-body" title="Firmware" rows={ROWS} />
    </>
  );
}
