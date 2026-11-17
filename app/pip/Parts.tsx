/*
  Static parts of the Pip article (server components).

  Tab   the Tab5 drawn in CSS around a screen recording or screenshot. The
        proportions are the real ones: a 128 x 80 mm body, a 110.7 x 62.3 mm
        panel set a little left of centre, the camera on the wider bezel.
  Flow  how a request travels: the tablet, the bridge on the VM, the harness.
  Hub   Pip in the middle of everything it can see and steer.
*/
import type { ReactNode } from 'react';

export function Tab({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pp-tab${className ? ` ${className}` : ''}`} data-no-zoom>
      <i className="pp-tab-glass" aria-hidden="true" />
      <div className="pp-tab-screen">{children}</div>
      <i className="pp-tab-cam" aria-hidden="true" />
    </div>
  );
}

/* The browser Pip drives, as a plain window with Pip's eyes in its bar (the mark for "this is Pip's"). */
export function Win({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="pp-win" data-no-zoom>
      <div className="pp-win-bar"><i aria-hidden="true" /><span>{label}</span></div>
      <div className="pp-win-body">{children}</div>
    </div>
  );
}

const FLOW: Array<{ k: string; title: string; where: string; items: string[] }> = [
  { k: 'tab', title: 'Tab5', where: 'On my desk', items: ['Pip, drawn on the tablet', 'Touch, keyboard, mics', 'Camera, IMU, speaker', 'Native applets in Lua'] },
  { k: 'bridge', title: 'Pet bridge', where: 'On the VM', items: ['Speech to text, on the VM', 'The tablet’s hardware, as an API', 'Pages for applets'] },
  { k: 'dsh', title: 'DeepSeek Harness', where: 'On the VM', items: ['Pip, a session with its own persona', 'Subagents that do the long jobs', 'A browser Pip can see and click', 'Applets in Docker'] },
];

export function Flow() {
  return (
    <figure className="pp-flow" aria-label="How a request travels: the Tab5 talks to a bridge on the VM, the bridge talks to the DeepSeek Harness">
      <div className="pp-flow-row">
        {FLOW.map((n, i) => (
          <div className="pp-flow-cell" key={n.k}>
            <div className={`pp-node is-${n.k}`}>
              <span className="pp-node-where">{n.where}</span>
              <b>{n.title}</b>
              <ul>{n.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            {i < FLOW.length - 1 && (
              <div className="pp-link" aria-hidden="true">
                <span className="pp-link-out">{i === 0 ? 'voice, taps, keys' : 'your words, as Pip'}</span>
                <span className="pp-link-line"><i /></span>
                <span className="pp-link-back">{i === 0 ? 'frames, replies, scripts' : 'replies, pages, apps'}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <figcaption>The tablet only draws Pip and the screen. Everything that thinks runs on a small Ubuntu VM on my desk, over Wi-Fi.</figcaption>
    </figure>
  );
}

/* Pip in the middle; what it can see and steer around it. Positions in a 600 x 600 box. */
const SPOKES: Array<{ x: number; y: number; label: string[]; dot?: string }> = [
  { x: 300, y: 70, label: ['Coding session', 'running'], dot: '#7cc8ff' },
  { x: 515, y: 190, label: ['Coding session', 'done'], dot: '#5EE08A' },
  { x: 515, y: 420, label: ['Coding session', 'needs an answer'], dot: '#FFB04A' },
  { x: 300, y: 535, label: ['Subagents', 'planner, coder, tester'] },
  { x: 85, y: 420, label: ['Applets', 'web and native'] },
  { x: 85, y: 190, label: ['Other Pips', 'one per desktop'] },
];

export function Hub() {
  return (
    <figure className="pp-hub" aria-label="Pip at the centre, connected to coding sessions, subagents, applets and the other Pips">
      <svg viewBox="0 0 600 600" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="pp-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--acc)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--acc)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="190" fill="none" stroke="#2E333F" strokeDasharray="3 7" />
        {SPOKES.map((s, i) => <line key={i} className="pp-hub-spoke" x1="300" y1="300" x2={s.x} y2={s.y} style={{ ['--d' as string]: `${i * 0.35}s` }} />)}
        <circle cx="300" cy="300" r="120" fill="url(#pp-hub-glow)" />
        <g className="pp-hub-pip">
          <ellipse cx="300" cy="306" rx="58" ry="66" fill="var(--acc)" />
          <ellipse cx="281" cy="292" rx="9" ry="12" fill="#0E1015" />
          <ellipse cx="319" cy="292" rx="9" ry="12" fill="#0E1015" />
          <circle cx="284" cy="287" r="3" fill="#fff" />
          <circle cx="322" cy="287" r="3" fill="#fff" />
          <path d="M288 320 q12 10 24 0" fill="none" stroke="#0E1015" strokeWidth="4" strokeLinecap="round" />
        </g>
        {SPOKES.map((s, i) => (
          <g key={`n${i}`} transform={`translate(${s.x} ${s.y})`}>
            <rect x="-78" y="-30" width="156" height="60" rx="18" fill="#181B23" stroke="#2E333F" />
            {s.dot && <circle cx="-60" cy="-9" r="5" fill={s.dot} />}
            <text x={s.dot ? -48 : 0} y="-4" textAnchor={s.dot ? 'start' : 'middle'} className="pp-hub-t">{s.label[0]}</text>
            <text x={s.dot ? -48 : 0} y="16" textAnchor={s.dot ? 'start' : 'middle'} className="pp-hub-s">{s.label[1]}</text>
          </g>
        ))}
      </svg>
      {/* phones: the same spokes as rows, readable at that size */}
      <ul className="pp-hub-list">
        {SPOKES.map((sp) => (
          <li key={sp.label.join()}><i style={sp.dot ? { background: sp.dot } : undefined} /><b>{sp.label[0]}</b><span>{sp.label[1]}</span></li>
        ))}
      </ul>
    </figure>
  );
}
