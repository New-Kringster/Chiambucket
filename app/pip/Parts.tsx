/*
  Static parts of the Pip article (server components).

  Tab   the Tab5 drawn in CSS around a screen recording or screenshot. The
        proportions are the real ones: a 128 x 80 mm body, a 110.7 x 62.3 mm
        panel set a little left of centre, the camera on the wider bezel.
  Flow  how a request travels: the tablet, the bridge on the VM, the harness.
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
      <figcaption>The tablet draws Pip and the screen, and it talks over Wi-Fi to a small Ubuntu VM on my desk, where everything else runs.</figcaption>
    </figure>
  );
}
