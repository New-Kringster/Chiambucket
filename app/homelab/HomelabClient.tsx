'use client';
import { useEffect, useState } from 'react';
import './homelab.css';
import { SERVICES, type Service } from './data';
import Constellation from './Constellation';
import Run from './Run';
import Fleet from './Fleet';
import ServiceModal from './ServiceModal';
import { sans } from './font';
import { IcGrid, IcMail } from '../../components/Icons';
import type { HomelabCopy } from './_copy/en';
import { HomelabCopyProvider } from './_copy/context';
import { localize } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

/*
  The HomeLab page, told like the homepage's chapters: black stages, the
  homepage's Figtree and gold, one light source per scene, and the moments
  that matter played by the scroll. In order:

  - Constellation.tsx: the title under a beam over braven-agents' chassis,
    which becomes the network of everything it controls.
  - Run.tsx: one request followed through every system it touches.
  - Without being asked / what waits for me: two statements.
  - Fleet.tsx: the machines, a slide each, scrolled sideways.
  - What it hosts: a wall of the self-hosted services (a dialog each).
  - Shebang Tubs, then where all this is going.

  Shared scroll engine in stage.ts; styles in homelab.css (namespace hx-).
*/


/* ── live status of the public services, shown in their dialogs ── */
type StatusMap = Record<string, 'up' | 'down'>;
function useStatus() {
  const [status, setStatus] = useState<StatusMap>({});
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch('/api/homelab-status')
        .then((r) => r.json())
        .then((d) => { if (alive) setStatus(d.services || {}); })
        .catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return status;
}

/* The page's words come from the server page (./_copy) for its language. */
export default function HomelabClient({ copy }: { copy: HomelabCopy }) {
  return (
    <HomelabCopyProvider value={copy}>
      <HomelabBody c={copy} />
    </HomelabCopyProvider>
  );
}

function HomelabBody({ c }: { c: HomelabCopy }) {
  const lang = useLang();
  const status = useStatus();
  const [openService, setOpenService] = useState<Service | null>(null);

  return (
    <main className={`hx ${sans.variable}`}>
      <Constellation />

      <Run />

      {/* ════════════ What happens without me, and what waits for me ════════════ */}
      <section className="hx-band hx-trust">
        <div className="hx-wrap hx-trust-grid">
          <div className="hx-trust-item">
            <span className="hx-tag"><i className="green" /> {c.prompt.ownTitle}</span>
            <p>{c.prompt.own}</p>
          </div>
          <div className="hx-trust-item quiet">
            <span className="hx-tag"><i className="hollow" /> {c.prompt.waitTitle}</span>
            <p>{c.prompt.wait}</p>
          </div>
        </div>
      </section>

      <Fleet />

      {/* ════════════ The services: a wall of them ════════════ */}
      <section className="hx-band" id="stack">
        <div className="hx-wrap">
          <span className="hx-tag"><i /> {c.stack.tag}</span>
          <h2 className="hx-h2">{c.stack.title}</h2>
          <p className="hx-sub"><span className="hx-trace" aria-hidden="true" />{c.stack.lead}</p>
          <div className="hx-wall">
            {SERVICES.map((s) => (
              <button key={s.id} type="button" className="hx-tile" onClick={() => setOpenService(s)}>
                <span className="hx-tile-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
                <span className="hx-tile-name">{s.name}</span>
                <span className="hx-tile-cat">{c.stack.categories[s.category]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ Shebang Tubs ════════════ */}
      <section className="hx-band" id="tubs">
        <div className="hx-wrap">
          <div className="hx-tubs">
            <div className="hx-tubs-text">
              <span className="hx-tag"><i /> {c.tubs.tag}</span>
              <h2 className="hx-h2">{c.tubs.title}</h2>
              <p className="hx-tubs-lead">{c.tubs.lead}</p>
              {c.tubs.body.map((p, i) => <p key={i} className="hx-tubs-p">{p}</p>)}
              <span className="hx-tubs-status">{c.tubs.status}</span>
            </div>
            <div className="hx-tubdia" role="img" aria-label={c.tubs.diagram.label}>
              <div className="hx-tub">
                <span className="hx-tub-name">{c.tubs.diagram.tub}</span>
                <div className="hx-tub-parts">{c.tubs.diagram.parts.map((p) => <span key={p}>{p}</span>)}</div>
              </div>
              <span className="hx-tub-arrow" />
              <span className="hx-tub-out">{c.tubs.diagram.zip}</span>
              <div className="hx-tub-split">
                <span className="hx-tub-out">{c.tubs.diagram.runs}</span>
                <span className="hx-tub-out">{c.tubs.diagram.publish}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ Where it is going ════════════ */}
      <section className="hx-end">
        <div className="hx-end-beam" aria-hidden="true" />
        <div className="hx-wrap">
          <h2 className="hx-end-title">{c.cta.title}</h2>
          <p className="hx-end-sub">{c.cta.sub}</p>
          <div className="hx-actions">
            <a className="hx-btn" href={localize('/#projects', lang)}><IcGrid /> {c.cta.projects}</a>
            <a className="hx-btn ghost" href={localize('/contact', lang)}><IcMail /> {c.cta.contact}</a>
          </div>
        </div>
      </section>

      <ServiceModal service={openService} status={status} onClose={() => setOpenService(null)} />
    </main>
  );
}
