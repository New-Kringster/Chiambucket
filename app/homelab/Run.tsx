'use client';
import { useRef, useState } from 'react';
import { useHomelabCopy } from './_copy/context';
import { ramp, useStage } from './stage';
import { fill } from '@/lib/fill';
import { Glyph } from './Constellation';

/*
  One request followed through every system, a pinned stage (.hx-run, ~460svh).
  The request types itself into the prompt as the page scrolls, then the six
  stops down the right light one after another along a gold track (the
  homepage's signal path, stood on end), and the caption on the left follows
  the step that is lit. At the end the app is live. With reduced motion the
  request is typed and every stop is lit.
*/

const TYPE: [number, number] = [0.05, 0.17];
const stepAt = (i: number) => 0.21 + i * 0.115;
const DONE = 0.9;

/* the systems' small pictures, by the name each step is "at" */
const PIC: Record<string, string> = {
  'braven-agents': '/images/homelab/agents.webp',
  NewMain: '/images/homelab/newmain.webp',
  'Nginx Proxy Manager': '/images/npm-icon.webp',
  Cloudflare: '/images/cloudflare-icon.webp',
};

export default function Run() {
  const c = useHomelabCopy();
  const section = useRef<HTMLElement>(null);
  const steps = c.prompt.steps;
  const [typed, setTyped] = useState(0);
  const [lit, setLit] = useState(-1);
  const [done, setDone] = useState(false);

  useStage(section, (p) => {
    const n = Math.round(c.prompt.request.length * ramp(p, TYPE[0], TYPE[1]));
    setTyped((v) => (v === n ? v : n));
    let l = -1;
    steps.forEach((_, i) => { if (p >= stepAt(i)) l = i; });
    setLit((v) => (v === l ? v : l));
    const d = p >= DONE;
    setDone((v) => (v === d ? v : d));
  });

  const cur = Math.max(0, lit);
  const track = lit < 0 ? 0 : lit / (steps.length - 1);

  return (
    <section className="hx-run" ref={section} id="prompt" aria-labelledby="hx-run-title">
      <div className="hx-run-stage">
        <div className="hx-run-left">
          <span className="hx-tag"><i /> {c.prompt.tag}</span>
          <h2 className="hx-run-title" id="hx-run-title">{c.prompt.title}</h2>
          <p className="hx-run-lead">{c.prompt.lead}</p>

          <div className="hx-term">
            <span className="hx-term-label">{c.prompt.requestLabel}</span>
            <p className="hx-term-line">
              <span className="hx-term-caret-in">›</span>
              {/* the whole request is there for screen readers; the visible part types itself */}
              <span className="sr-only">{c.prompt.request}</span>
              <span aria-hidden="true">{c.prompt.request.slice(0, typed)}</span>
              <i className={`hx-term-caret${typed >= c.prompt.request.length ? ' is-idle' : ''}`} aria-hidden="true" />
            </p>
          </div>

          {/* the step that is lit, said in full */}
          <div className="hx-run-now" aria-hidden="true">
            {steps.map((s, i) => (
              <div key={i} className={`hx-run-cap${i === cur && lit >= 0 ? ' is-on' : ''}`}>
                <span className="hx-run-cap-n">{fill(c.prompt.stepOf, { n: i + 1, total: steps.length })}</span>
                <p>{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        <ol className="hx-path" style={{ ['--track' as string]: track }}>
          {steps.map((s, i) => (
            <li key={i} className={`hx-stop${i <= lit ? ' is-lit' : ''}${i === lit ? ' is-now' : ''}`}>
              <span className="hx-stop-dot" aria-hidden="true" />
              <span className="hx-stop-pic" aria-hidden="true">{PIC[s.at] ? <img src={PIC[s.at]} alt="" /> : <Glyph id="unifi" />}</span>
              <span className="hx-stop-text">
                <b>{s.at}</b>
                <span>{s.t}</span>
              </span>
            </li>
          ))}
          <li className={`hx-stop hx-stop-done${done ? ' is-lit is-now' : ''}`}>
            <span className="hx-stop-dot" aria-hidden="true" />
            <span className="hx-done">{c.prompt.done}</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
