'use client';
import { useEffect, useState } from 'react';
import { useFrame } from './Story';

/* The agentic workflow's two visuals: the self-improvement loop as a ring that
   runs while it is on screen, and the six agents as badges, one persona each. */

const STEPS = ['Hypothesis', 'Execution planning', 'Gather the training dataset', 'Re-train, fine-tune or RL the model', 'Test for improvement or regression', 'Report findings, then a new hypothesis'];
const INK = '#d8cbb8', HI = '#fff0db', MUTED = '#ada496', LINE = '#d8cbb84d', RED = '#ff6666';
const CX = 380, CY = 282, R = 168;
const pt = (k: number, r = R) => { const a = ((k * 60 - 90) * Math.PI) / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const; };
/* the arc from node k to node k + 1, stopping short of the node discs */
const arc = (k: number) => {
  const gap = 9.5;
  const a0 = ((k * 60 - 90 + gap) * Math.PI) / 180, a1 = (((k + 1) * 60 - 90 - gap) * Math.PI) / 180;
  return `M${CX + R * Math.cos(a0)} ${CY + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${CX + R * Math.cos(a1)} ${CY + R * Math.sin(a1)}`;
};
const LABEL: Array<{ dx: number; dy: number; a: 'start' | 'middle' | 'end'; lines: string[] }> = [
  { dx: 0, dy: -40, a: 'middle', lines: ['Hypothesis'] },
  { dx: 44, dy: -6, a: 'start', lines: ['Execution', 'planning'] },
  { dx: 44, dy: 6, a: 'start', lines: ['Gather the', 'training dataset'] },
  { dx: 0, dy: 50, a: 'middle', lines: ['Re-train, fine-tune', 'or RL the model'] },
  { dx: -44, dy: 6, a: 'end', lines: ['Test for improvement', 'or regression'] },
  { dx: -44, dy: -6, a: 'end', lines: ['Report findings,', 'then a new hypothesis'] },
];

export function LoopRing() {
  const { active } = useFrame();
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setCur((c) => (c + 1) % 6), 1900);
    return () => clearInterval(t);
  }, [active]);
  return (
    <div className="ag-ring" data-no-zoom role="img" aria-label={`The agents' loop: ${STEPS.join(', ')}, and around again.`}>
      <svg viewBox="0 0 760 560">
        <defs>
          <marker id="ag-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="2 5" />
        {STEPS.map((_, k) => (
          <path key={k} d={arc(k)} fill="none" stroke={k === cur ? HI : LINE} strokeWidth={k === cur ? 1.8 : 1} markerEnd="url(#ag-ar)" className={k === cur ? 'ag-live' : undefined} pathLength={1} />
        ))}
        {STEPS.map((s, k) => {
          const [x, y] = pt(k);
          const on = k === cur, l = LABEL[k];
          return (
            <g key={s} style={{ transition: 'opacity .3s' }}>
              <circle cx={x} cy={y} r={17} fill={on ? INK : '#181716'} stroke={on ? INK : '#d8cbb875'} strokeWidth={1.2} />
              <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fill={on ? '#181716' : INK} style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>{k + 1}</text>
              <text x={x + l.dx} y={y + l.dy - (l.lines.length - 1) * 8} textAnchor={l.a} fontSize={15} fill={on ? HI : MUTED} style={{ fontFamily: 'Manrope, Arial, sans-serif', fontWeight: on ? 600 : 400, transition: 'fill .3s' }}>
                {l.lines.map((t, i) => <tspan key={t} x={x + l.dx} dy={i ? 18 : 0}>{t}</tspan>)}
              </text>
            </g>
          );
        })}
        <text x={CX} y={CY - 8} textAnchor="middle" fontSize={13} fill={MUTED} style={{ fontFamily: 'Manrope, Arial, sans-serif', letterSpacing: '0.14em' }}>TARGET</text>
        <text x={CX} y={CY + 26} textAnchor="middle" fontSize={34} fill={INK} style={{ fontFamily: "'Libre Baskerville', Baskerville, serif" }}>99 %</text>
        <text x={CX} y={CY + 46} textAnchor="middle" fontSize={12.5} fill={MUTED} style={{ fontFamily: 'Manrope, Arial, sans-serif' }}>meter accuracy</text>
      </svg>
      <style>{`
        .ag-ring { width: min(var(--vw, 48vw), calc((100svh - var(--ws-nav, 0px) - 16svh) * 1.36)); }
        .ag-ring svg { display: block; width: 100%; height: auto; }
        .ag-live { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ag-draw 1.6s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes ag-draw { to { stroke-dashoffset: 0; } }
        @media (max-width: 900px) { .ag-ring { width: 92vw; } }
        @media (prefers-reduced-motion: reduce) { .ag-live { animation: none; stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}

type Agent = { name: string; persona: string; model: string; job: string; data: string; fate: string; state: 'won' | 'halted' | 'on'; glyph: React.ReactNode };
const G = { fill: 'none', stroke: INK, strokeWidth: 1.3 } as const;
const AGENTS: Agent[] = [
  { name: 'DrumNet Standard', persona: 'The purist', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Only images taken by Prototype V1, from the base DrumNet V1', fate: 'Halted after 1.5 weeks', state: 'halted',
    glyph: <g {...G}><circle cx="20" cy="20" r="14" /><circle cx="20" cy="20" r="5" fill={INK} stroke="none" /><path d="M20 6v4M20 30v4M6 20h4M30 20h4" /></g> },
  { name: 'DrumNet Simulated', persona: 'The dreamer', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Only SimGen2 images, fully computer-generated, from the base DrumNet V1', fate: 'Won: renamed DrumNet, now at V10', state: 'won',
    glyph: <g {...G}><circle cx="20" cy="20" r="14" strokeDasharray="2.5 3.5" /><rect x="14" y="14" width="12" height="12" /><rect x="18" y="18" width="4" height="4" fill={INK} stroke="none" /></g> },
  { name: 'DrumNet Premade', persona: 'The collector', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Every dataset: Prototype V1, SimGen2, Badger55, Jomjol-digits, from the dig-cont model', fate: 'Halted after 1.5 weeks', state: 'halted',
    glyph: <g {...G}><rect x="10" y="6" width="20" height="9" rx="1.5" /><rect x="8" y="15.5" width="24" height="9" rx="1.5" /><rect x="6" y="25" width="28" height="9" rx="1.5" /></g> },
  { name: 'WindowNet', persona: 'The spotter', model: 'Opus 5.5', job: 'Finds the window', data: 'Trains the Spotter (DetNet) and Refiner (RefNet) that locate the drum window', fate: 'Still the weakest link: most wrong readings start here', state: 'on',
    glyph: <g {...G}><rect x="7" y="12" width="26" height="16" rx="1.5" /><path d="M20 4v6M20 30v6M3 20h4M33 20h4" /><path d="M13 16v8M18 16v8M23 16v8M28 16v8" stroke={RED} /></g> },
  { name: 'Sim 2 Genius', persona: 'The stagehand', model: 'Opus 5.5', job: 'Runs the simulator', data: 'Operates, maintains and improves SimGen2 for the others', fate: 'Keeps the synthetic pictures coming', state: 'on',
    glyph: <g {...G}><circle cx="20" cy="20" r="14" /><path d="M8 20c3-7 6-7 9 0s6 7 9 0 3-7 6 0" /></g> },
  { name: 'OCR Coordinator', persona: 'The foreman', model: 'Fable 5.1', job: 'Runs the project', data: 'Talks to all the other agents, books their time, keeps the plan', fate: 'Reallocated everything to Simulated when the others stalled', state: 'on',
    glyph: <g {...G}><circle cx="20" cy="20" r="3.5" fill={INK} stroke="none" /><path d="M20 20L20 6M20 20L33 13M20 20L33 29M20 20L7 29M20 20L7 13" /><circle cx="20" cy="6" r="2.5" /><circle cx="33" cy="13" r="2.5" /><circle cx="33" cy="29" r="2.5" /><circle cx="7" cy="29" r="2.5" /><circle cx="7" cy="13" r="2.5" /></g> },
];

export function AgentBadges() {
  return (
    <div className="ag-badges" data-no-zoom>
      {AGENTS.map((a) => (
        <article key={a.name} className={`ag-badge ${a.state}`}>
          <svg viewBox="0 0 40 40" className="ag-glyph" aria-hidden="true">{a.glyph}</svg>
          <div className="ag-head"><b>{a.name}</b><i>{a.persona}</i></div>
          <dl>
            <div><dt>Model</dt><dd>{a.model}</dd></div>
            <div><dt>Job</dt><dd>{a.job}</dd></div>
            <div><dt>Trains on</dt><dd>{a.data}</dd></div>
          </dl>
          <p className="ag-fate">{a.fate}</p>
        </article>
      ))}
      <style>{`
        .ag-badges { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; width: min(100%, 1240px); perspective: 1600px; }
        .ag-badge { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 18px 18px 16px; border: 1px solid #d8cbb84d; border-radius: 6px; background: linear-gradient(170deg, #1f1d1b, #141312); box-shadow: 0 30px 50px -30px #000c, inset 0 1px 0 #ffffff0d; transform-style: preserve-3d; transition: transform .5s cubic-bezier(.2,.7,.2,1), border-color .3s; }
        .ag-badge:hover { transform: rotateX(4deg) rotateY(-5deg) translateZ(14px); border-color: #d8cbb88c; }
        .ag-badge.won { border-color: #d8cbb8; transform: translateZ(18px); box-shadow: 0 40px 60px -30px #000, 0 0 0 1px #d8cbb833, inset 0 1px 0 #ffffff14; }
        .ag-badge.won:hover { transform: rotateX(4deg) rotateY(-5deg) translateZ(30px); }
        .ag-badge.won::after { content: 'became DrumNet'; position: absolute; top: 12px; right: 12px; font: 600 9.5px/1.4 Manrope, Arial, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #181716; background: #d8cbb8; padding: 3px 7px; border-radius: 2px; }
        .ag-badge.halted { opacity: 0.62; }
        .ag-badge.halted .ag-fate { color: #ff8a8a; }
        .ag-badge.won .ag-fate { color: #fff0db; }
        .ag-glyph { width: 40px; height: 40px; }
        .ag-head { display: flex; flex-direction: column; gap: 2px; }
        .ag-head b { font: 400 clamp(17px, 1.35vw, 22px)/1.2 'Libre Baskerville', Baskerville, serif; color: #d8cbb8; }
        .ag-head i { font: 500 11px/1.4 Manrope, Arial, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #ada496; font-style: normal; }
        .ag-badge dl { margin: 0; display: grid; gap: 5px; }
        .ag-badge dl div { display: grid; grid-template-columns: 62px 1fr; gap: 10px; align-items: baseline; }
        .ag-badge dt { font: 600 9.5px/1.5 Manrope, Arial, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #7d766e; }
        .ag-badge dd { margin: 0; font: 400 clamp(12px, 0.9vw, 14.5px)/1.45 Manrope, Arial, sans-serif; color: #bfb6a9; }
        .ag-fate { margin: auto 0 0; padding-top: 10px; border-top: 1px solid #d8cbb833; font: 500 clamp(12px, 0.9vw, 14px)/1.4 Manrope, Arial, sans-serif; color: #ada496; }
        @media (max-width: 900px) { .ag-badges { grid-template-columns: 1fr 1fr; gap: 8px; } .ag-badge { padding: 12px; gap: 7px; } .ag-badge dl div { grid-template-columns: 1fr; gap: 1px; } .ag-badge dd { font-size: 11.5px; } .ag-glyph { width: 30px; height: 30px; } .ag-badge.won::after { font-size: 8px; top: 8px; right: 8px; } .ag-badge, .ag-badge.won { transform: none; } }
        @media (max-width: 560px) { .ag-badges { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .ag-badge, .ag-badge:hover, .ag-badge.won:hover { transform: none; transition: none; } }
      `}</style>
    </div>
  );
}
