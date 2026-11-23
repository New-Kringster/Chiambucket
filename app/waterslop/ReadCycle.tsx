'use client';
import { Cover, Page, type Frame } from './Story';
import { words } from './words';
import type { WaterslopCopy } from './_copy';

/* FirmwareChapter: the firmware's story in three rows: the setup the agent wrote
   it on, the reader's flow for a typical deployment (report Figure 2.24) with
   every step named beside it, and the dashboard where the reading lands. The
   layout is here; every word is `firmware` in the page's copy, keyed by node id. */

type FirmwareCopy = WaterslopCopy['firmware'];
type NodeId = keyof FirmwareCopy['nodes'];
type Node = { id: NodeId; x: number; y: number; w: number; h: number; side: 'main' | 'backup' };
const NODES: Node[] = [
  { id: 'wake', x: 20, y: 20, w: 300, h: 84, side: 'main' },
  { id: 'capture', x: 20, y: 134, w: 300, h: 84, side: 'main' },
  { id: 'low', x: 20, y: 248, w: 300, h: 84, side: 'main' },
  { id: 'uplink', x: 20, y: 476, w: 300, h: 84, side: 'main' },
  { id: 'sleep', x: 20, y: 590, w: 300, h: 84, side: 'main' },
  { id: 'full', x: 420, y: 248, w: 320, h: 84, side: 'backup' },
  { id: 'check', x: 420, y: 362, w: 320, h: 84, side: 'backup' },
  { id: 'alt', x: 420, y: 476, w: 320, h: 84, side: 'backup' },
  { id: 'reject', x: 420, y: 590, w: 320, h: 84, side: 'backup' },
];
const N = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, Node>;
const GREEN = '#6fd38a', RED = '#ff6666', INK = '#e9e0d2';
const edgePath = (a: Node, b: Node) => {
  if (a.side === b.side) return `M${a.x + a.w / 2} ${a.y + a.h} V${b.y}`;
  if (a.side === 'main') return `M${a.x + a.w} ${a.y + a.h / 2} H${b.x}`;
  return `M${a.x} ${a.y + a.h / 2} H${b.x + b.w / 2} V${b.y}`;
};
/* ok edges are labelled success, fail edges fail */
const EDGES: Array<{ id: string; a: NodeId; b: NodeId; tone: 'plain' | 'ok' | 'fail' }> = [
  { id: 'wake-capture', a: 'wake', b: 'capture', tone: 'plain' },
  { id: 'capture-low', a: 'capture', b: 'low', tone: 'plain' },
  { id: 'low-uplink', a: 'low', b: 'uplink', tone: 'ok' },
  { id: 'low-full', a: 'low', b: 'full', tone: 'fail' },
  { id: 'full-check', a: 'full', b: 'check', tone: 'plain' },
  { id: 'check-uplink', a: 'check', b: 'uplink', tone: 'ok' },
  { id: 'check-alt', a: 'check', b: 'alt', tone: 'fail' },
  { id: 'alt-uplink', a: 'alt', b: 'uplink', tone: 'ok' },
  { id: 'alt-reject', a: 'alt', b: 'reject', tone: 'fail' },
  { id: 'reject-uplink', a: 'reject', b: 'uplink', tone: 'plain' },
  { id: 'uplink-sleep', a: 'uplink', b: 'sleep', tone: 'plain' },
];
const STEPS: Array<{ id: NodeId; n: number; tone?: 'ok' | 'red' }> = [
  { id: 'wake', n: 1 },
  { id: 'capture', n: 2 },
  { id: 'low', n: 3, tone: 'ok' },
  { id: 'full', n: 4, tone: 'red' },
  { id: 'check', n: 5 },
  { id: 'alt', n: 6, tone: 'red' },
  { id: 'reject', n: 7, tone: 'red' },
  { id: 'uplink', n: 8 },
  { id: 'sleep', n: 9 },
];

/* The chart, every node and edge numbered to match the steps beside it. */
function Chart({ t }: { t: FirmwareCopy }) {
  return (
    <div className="ws-wstage rc-stage" style={{ ['--ar' as string]: 760 / 694 }} data-no-zoom>
      <svg viewBox="0 0 760 694" className="rc-svg" role="img" aria-label={t.chartAria}>
        <defs>
          <marker id="rc-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker>
        </defs>
        {EDGES.map((e) => {
          const c = e.tone === 'ok' ? GREEN : e.tone === 'fail' ? RED : '#8a847e';
          const a = N[e.a], b = N[e.b];
          const label = e.tone === 'ok' ? t.success : e.tone === 'fail' ? t.fail : '';
          const lx = a.side === b.side ? a.x + a.w / 2 + 10 : a.side === 'main' ? (a.x + a.w + b.x) / 2 : b.x + b.w / 2 + 10;
          const ly = a.side === b.side ? (a.y + a.h + b.y) / 2 + 5 : a.side === 'main' ? a.y + a.h / 2 - 8 : (a.y + a.h / 2 + b.y) / 2;
          return (
            <g key={e.id}>
              <path d={edgePath(a, b)} fill="none" stroke={c} strokeWidth={e.tone === 'plain' ? 1.6 : 2.2} markerEnd="url(#rc-ar)" />
              {label && <text x={lx} y={ly} fontSize={12} fill={c} style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.1em" textAnchor={a.side === 'main' && b.side === 'backup' ? 'middle' : 'start'}>{label.toUpperCase()}</text>}
            </g>
          );
        })}
        <path d={`M${N.sleep.x} ${N.sleep.y + N.sleep.h / 2} H6 V${N.wake.y + N.wake.h / 2} H${N.wake.x}`} fill="none" stroke="#ada496" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.6} markerEnd="url(#rc-ar)" />
        <text x={12} y={N.wake.y + N.wake.h / 2 - 220} fontSize={11} fill="#ada496" style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} transform={`rotate(-90 12 ${N.wake.y + N.wake.h / 2 - 220})`} textAnchor="middle" letterSpacing="0.1em">{t.nextCycle}</text>
        {NODES.map((n) => {
          const step = STEPS.find((s) => s.id === n.id)!;
          const w: { title: string; sub: string; time?: string } = t.nodes[n.id];
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill={n.side === 'backup' ? 'rgba(255,102,102,0.05)' : 'rgba(216,203,184,0.04)'} stroke={n.side === 'backup' ? '#6b4a4a' : '#d8cbb875'} strokeWidth={1.4} />
              <circle cx={n.x + 18} cy={n.y + 18} r={11} fill="#d8cbb8" />
              <text x={n.x + 18} y={n.y + 23} fontSize={13} fill="#181716" textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{step.n}</text>
              {w.time && <text x={n.x + n.w - 14} y={n.y + 22} fontSize={11.5} fill="#ada496" textAnchor="end" style={{ fontFamily: 'Manrope, Arial, sans-serif' }} fontWeight={600} letterSpacing="0.08em">{w.time}</text>}
              <text x={n.x + n.w / 2} y={n.y + 50} fontSize={21} fill={INK} textAnchor="middle" style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{w.title}</text>
              <text x={n.x + n.w / 2} y={n.y + 70} fontSize={12.5} fill="#ada496" textAnchor="middle" style={{ fontFamily: 'Manrope, Arial, sans-serif' }}>{w.sub}</text>
            </g>
          );
        })}
      </svg>
      <style>{`.rc-svg { display: block; width: 100%; height: auto; aspect-ratio: 760 / 694; } .ws-row .rc-stage { width: min(var(--vw, 48vw), calc((100svh - var(--ws-nav, 0px) - 14svh) * 1.095)); }`}</style>
    </div>
  );
}

const I = '/images/waterslop/';
const rows = (t: FirmwareCopy): Frame[] => [
  {
    id: 'fw-agents', ...words(t.rows['fw-agents']),
    visual: <img src={I + 'fw-setup.webp'} alt={t.rows['fw-agents'].alt} className="plate" loading="lazy" decoding="async" />,
  },
  {
    id: 'fw-cycle', ...words(t.rows['fw-cycle']),
    body: (
      <ol className="ws-steps">
        {STEPS.map((s) => <li key={s.id} className={s.tone}><b>{t.nodes[s.id].title}</b>{t.steps[s.id]}</li>)}
      </ol>
    ),
    visual: <Chart t={t} />,
  },
  {
    id: 'fw-dashboard', ...words(t.rows['fw-dashboard']),
    visual: <img src={I + 'dashboard.webp'} alt={t.rows['fw-dashboard'].alt} loading="lazy" decoding="async" />,
  },
];

export default function FirmwareChapter({ chapter, t }: { chapter: string; t: FirmwareCopy }) {
  const c = t.cover;
  return (
    <>
      <Cover id="firmware" chapter={chapter} title={c.title} lines={c.lines} contents={c.contents.map((label, i) => ({ label, href: ['#fw-agents', '#fw-cycle', '#fw-dashboard'][i] }))}
        bg="fw-setup.webp" lede={c.lede} />
      <Page id="firmware-body" title={t.page} rows={rows(t)} />
    </>
  );
}
