'use client';
import { useRef, useState, type CSSProperties } from 'react';
import { MACHINES } from './data';
import { useHomelabCopy } from './_copy/context';
import { useStage } from './stage';
import { fill } from '@/lib/fill';

/*
  The machines, a pinned stage that scrolls sideways (.hx-fleet, one screen of
  scroll per slide). The first slide is the real rack; then every machine
  gets the whole screen: its name huge and faint behind it, its photo under a
  beam of light (darkened a little), and its role, a line about it and its
  specs along the foot. The planned Proxmox server draws a dashed outline in
  place of a photo. `--x` slides the track; `--f` is each slide's own
  progress, which brings its photo up and its words in. On phones the same
  stage stacks the words under the photo. With reduced motion the slides
  stack down the page.
*/

function PlannedOutline() {
  return (
    <svg className="hx-outline" viewBox="0 0 240 110" aria-hidden="true">
      <path d="M20 40 L120 12 L220 40 L220 70 L120 98 L20 70 Z M20 40 L120 68 L220 40 M120 68 L120 98" />
      <path d="M36 56 L104 75 M36 63 L104 82" />
    </svg>
  );
}

export default function Fleet() {
  const c = useHomelabCopy();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const total = MACHINES.length + 1;
  const [at, setAt] = useState(0);

  useStage(section, (p) => {
    const x = p * (total - 1);
    const el = track.current;
    if (!el) return;
    el.style.setProperty('--x', x.toFixed(4));
    // each slide's own progress: 1 while it fills the screen, 0 a slide away
    Array.from(el.children).forEach((s, i) => (s as HTMLElement).style.setProperty('--f', Math.max(0, 1 - Math.abs(x - i)).toFixed(3)));
    const n = Math.round(x);
    setAt((v) => (v === n ? v : n));
  });

  return (
    <section className="hx-fleet" ref={section} id="machines" aria-labelledby="hx-fleet-title" style={{ ['--n' as string]: total } as CSSProperties}>
      <div className="hx-fleet-stage">
        <div className="hx-fleet-track" ref={track}>
          {/* the rack, where three of them live */}
          <article className="hx-slide hx-slide-intro" style={{ ['--i' as string]: 0 } as CSSProperties}>
            <div className="hx-slide-intro-text">
              <span className="hx-tag"><i /> {c.machines.tag}</span>
              <h2 className="hx-fleet-title" id="hx-fleet-title">{c.machines.title}</h2>
              <p className="hx-sub"><span className="hx-trace" aria-hidden="true" />{c.machines.lead}</p>
            </div>
            <figure className="hx-rackshot">
              <img src="/images/hl-rack-real.jpg" alt={c.machines.rack.alt} />
              <figcaption>{c.machines.rack.caption}</figcaption>
            </figure>
          </article>

          {MACHINES.map((m, k) => {
            const t = c.machines.items[m.id];
            return (
              <article key={m.id} className={`hx-slide${m.core ? ' is-core' : ''}${m.planned ? ' is-planned' : ''}`} style={{ ['--i' as string]: k + 1 } as CSSProperties}>
                <span className="hx-slide-ghost" aria-hidden="true">{t.name}</span>
                <div className="hx-slide-beam" aria-hidden="true" />
                <div className="hx-slide-pic">
                  {m.photo ? <img src={m.photo} alt={fill(c.machines.photoAlt, { name: t.name })} loading="lazy" /> : <PlannedOutline />}
                </div>
                <div className="hx-slide-foot">
                  <div className="hx-slide-id">
                    <span className="hx-tag">{m.planned ? <><i className="amber" /> {c.machines.planned}</> : <><i /> {t.role}</>}</span>
                    <h3>{t.name}</h3>
                    <p>{t.blurb}</p>
                  </div>
                  <dl className="hx-slide-specs">
                    {t.specs.map((sp) => <div key={sp.k}><dt>{sp.k}</dt><dd>{sp.v}</dd></div>)}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hx-fleet-meter" aria-hidden="true">
          <span>{String(at + 1).padStart(2, '0')}</span>
          <i><b style={{ transform: `scaleX(${(at + 1) / total})` }} /></i>
          <span>{String(total).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  );
}
