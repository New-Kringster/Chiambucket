/*
  Static parts of the Pip article (server components).

  Tab   the Tab5 drawn in CSS around a screen recording or screenshot. The
        proportions are the real ones: a 128 x 80 mm body, a 110.7 x 62.3 mm
        panel set a little left of centre, the camera on the wider bezel.
  Flow  how a request travels: the tablet, the bridge on the VM, the harness.
*/
import type { ReactNode } from 'react';
import type { PipCopy } from './_copy';

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

/* The three boxes in order; their words come from the copy (copy.flow). */
const FLOW = ['tab', 'bridge', 'dsh'] as const;

export function Flow({ t }: { t: PipCopy['flow'] }) {
  return (
    <figure className="pp-flow" aria-label={t.label}>
      <div className="pp-flow-row">
        {FLOW.map((k, i) => { const n = t.nodes[k]; return (
          <div className="pp-flow-cell" key={k}>
            <div className={`pp-node is-${k}`}>
              <span className="pp-node-where">{n.where}</span>
              <b>{n.title}</b>
              <ul>{n.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
            {i < FLOW.length - 1 && (
              <div className="pp-link" aria-hidden="true">
                <span className="pp-link-out">{t.links[i].out}</span>
                <span className="pp-link-line"><i /></span>
                <span className="pp-link-back">{t.links[i].back}</span>
              </div>
            )}
          </div>
        ); })}
      </div>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}
