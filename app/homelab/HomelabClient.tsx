'use client';
import { useEffect, useRef, useState } from 'react';
import './homelab.css';
import { MACHINES, SERVICES, CATEGORIES, type Service, type Category } from './data';
import ControlMap from './ControlMap';
import ServiceModal from './ServiceModal';
import { IcGrid, IcMail } from '../../components/Icons';
import type { HomelabCopy } from './_copy/en';
import { HomelabCopyProvider } from './_copy/context';
import { fill } from '@/lib/fill';
import { localize } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

/* ── live status of the public services (unknown until the first check returns) ── */
type StatusMap = Record<string, 'up' | 'down'>;
function useStatus() {
  const [status, setStatus] = useState<StatusMap>({});
  const [synced, setSynced] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch('/api/homelab-status')
        .then((r) => r.json())
        .then((d) => { if (alive) { setStatus(d.services || {}); setSynced(d.checkedAt || null); } })
        .catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return { status, synced };
}

/* The page's words come from the server page (./_copy) for its language. */
export default function HomelabClient({ copy }: { copy: HomelabCopy }) {
  return (
    <HomelabCopyProvider value={copy}>
      <HomelabBody c={copy} />
    </HomelabCopyProvider>
  );
}

const STACK_VISIBLE = 6;

/* The run from a request to a live app. Each step lights up once it has scrolled
   past the lower third of the screen and stays lit, so the line fills in as you
   read; with reduced motion every step starts lit. */
function Steps({ steps }: { steps: HomelabCopy['prompt']['steps'] }) {
  const list = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setLit(steps.length); return; }
    const items = [...el.querySelectorAll<HTMLElement>('.hx-step')];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) setLit((n) => Math.max(n, items.indexOf(e.target as HTMLElement) + 1));
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, [steps.length]);
  return (
    <ol className="hx-steps" ref={list} style={{ ['--lit' as string]: lit / steps.length }}>
      {steps.map((s, i) => (
        <li key={i} className={`hx-step${i < lit ? ' is-lit' : ''}`}>
          <span className="hx-step-n">{i + 1}</span>
          <div className="hx-step-body">
            <p>{s.t}</p>
            <span className="hx-step-at">{s.at}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* A planned machine has no photo yet: a dashed outline of a rack server stands in. */
function PlannedOutline() {
  return (
    <svg className="hx-outline" viewBox="0 0 240 110" aria-hidden="true">
      <path d="M20 40 L120 12 L220 40 L220 70 L120 98 L20 70 Z M20 40 L120 68 L220 40 M120 68 L120 98" />
      <path d="M36 56 L104 75 M36 63 L104 82" />
    </svg>
  );
}

function HomelabBody({ c }: { c: HomelabCopy }) {
  const lang = useLang();
  const { status, synced } = useStatus();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [stackOpen, setStackOpen] = useState(false);
  const [openService, setOpenService] = useState<Service | null>(null);

  const shown = filter === 'all' ? SERVICES : SERVICES.filter((s) => s.category === filter);
  const collapsible = shown.length > STACK_VISIBLE;
  const collapsed = collapsible && !stackOpen;
  const visible = collapsed ? shown.slice(0, STACK_VISIBLE) : shown;

  const liveOf = (s: Service) => (s.statusKey ? (status[s.statusKey] === 'up' ? 'up' : status[s.statusKey] === 'down' ? 'down' : 'wait') : 'self');

  return (
    <main className="hx">
      {/* ════════════ Hero ════════════ */}
      <header className="hx-hero">
        <div className="hx-wrap hx-hero-grid">
          <div className="hx-hero-text">
            <h1 className="hx-title">{c.hero.title}</h1>
            <p className="hx-lead">{c.hero.lead}</p>
            <div className="hx-actions">
              <a className="hx-btn" href="#core">{c.hero.mapCta}</a>
              <a className="hx-btn ghost" href="#machines">{c.hero.machinesCta}</a>
            </div>
          </div>
          <figure className="hx-rack">
            <img src="/images/hl-rack-real.jpg" alt={c.machines.rack.alt} />
            <figcaption>{c.machines.rack.caption}</figcaption>
          </figure>
        </div>
      </header>

      {/* ════════════ The core and everything it controls ════════════ */}
      <section className="hx-band" id="core">
        <div className="hx-wrap">
          <h2 className="hx-h2">{c.core.title}</h2>
          <p className="hx-intro">{c.core.lead}</p>
          <ControlMap />
        </div>
      </section>

      {/* ════════════ One prompt, followed through ════════════ */}
      <section className="hx-band" id="prompt">
        <div className="hx-wrap">
          <h2 className="hx-h2">{c.prompt.title}</h2>
          <p className="hx-intro">{c.prompt.lead}</p>
          <div className="hx-run">
            <div className="hx-flow">
              <div className="hx-request">
                <span className="hx-request-label">{c.prompt.requestLabel}</span>
                <p>{c.prompt.request}</p>
              </div>
              <Steps steps={c.prompt.steps} />
            </div>
            <div className="hx-notes">
              <div className="hx-note">
                <h3>{c.prompt.ownTitle}</h3>
                <p>{c.prompt.own}</p>
              </div>
              <div className="hx-note quiet">
                <h3>{c.prompt.waitTitle}</h3>
                <p>{c.prompt.wait}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ The machines ════════════ */}
      <section className="hx-band" id="machines">
        <div className="hx-wrap">
          <h2 className="hx-h2">{c.machines.title}</h2>
          <p className="hx-intro">{c.machines.lead}</p>
          <div className="hx-machines">
            <div className="hx-mlist">
              {MACHINES.map((m) => {
                const t = c.machines.items[m.id];
                return (
                  <article key={m.id} className={`hx-machine${m.planned ? ' is-planned' : ''}${m.core ? ' is-core' : ''}`}>
                    <div className="hx-machine-photo">
                      {m.photo ? <img src={m.photo} alt={fill(c.machines.photoAlt, { name: t.name })} loading="lazy" /> : <PlannedOutline />}
                    </div>
                    <div className="hx-machine-body">
                      <div className="hx-machine-head">
                        <h3>{t.name}</h3>
                        <span className="hx-machine-role">{t.role}</span>
                        <span className={`hx-state${m.planned ? ' planned' : ''}`}>
                          <i className={`hx-dot${m.planned ? '' : ' on'}`} />{m.planned ? c.machines.status.planned : c.machines.status.running}
                        </span>
                      </div>
                      <p className="hx-machine-blurb">{t.blurb}</p>
                      <dl className="hx-spec">
                        {t.specs.map((sp) => <div key={sp.k}><dt>{sp.k}</dt><dd>{sp.v}</dd></div>)}
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ Services ════════════ */}
      <section className="hx-band" id="stack">
        <div className="hx-wrap">
          <h2 className="hx-h2">{c.stack.title}</h2>
          <p className="hx-intro">{c.stack.lead}</p>
          <div className="hx-toolbar">
            <div className="hx-filters" role="group" aria-label={c.stack.filterLabel}>
              {(['all', ...CATEGORIES] as const).map((cat) => (
                <button key={cat} type="button" className={`hx-filter${filter === cat ? ' on' : ''}`} aria-pressed={filter === cat}
                  onClick={() => { setFilter(cat); setStackOpen(false); }}>
                  {c.stack.categories[cat]}
                </button>
              ))}
            </div>
            <span className="hx-synced">
              {synced ? fill(c.stack.checkedAt, { time: new Date(synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }) : c.stack.checking}
            </span>
          </div>
          <div className={`hx-svcs-wrap${collapsed ? ' is-collapsed' : ''}`}>
            <div className="hx-svcs">
              {visible.map((s) => {
                const live = liveOf(s);
                return (
                  <article key={s.id} className="hx-svc" role="button" tabIndex={0}
                    onClick={() => setOpenService(s)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenService(s); } }}
                    aria-label={fill(c.details, { name: s.name })}>
                    <div className="hx-svc-top">
                      <span className="hx-svc-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
                      <h3 className="hx-svc-name">{s.name}</h3>
                      <span className={`hx-svc-status ${live}`}><i className="hx-dot" />{c.stack.status[live]}</span>
                    </div>
                    <p className="hx-svc-blurb">{c.services[s.id].blurb}</p>
                    {s.url && (
                      <a className="hx-svc-link" href={s.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                        {s.url.replace('https://', '')}
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
          {collapsible && (
            <div className="hx-more">
              <button type="button" className="hx-btn ghost" aria-expanded={stackOpen} onClick={() => {
                const next = !stackOpen;
                setStackOpen(next);
                if (!next) document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>
                {stackOpen ? c.stack.showFewer : fill(c.stack.showAll, { n: shown.length })}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ Shebang Tubs ════════════ */}
      <section className="hx-band" id="tubs">
        <div className="hx-wrap">
          <div className="hx-tubs">
            <div className="hx-tubs-head">
              <h2 className="hx-h2">{c.tubs.title}</h2>
              <span className="hx-state planned">{c.tubs.status}</span>
            </div>
            <div className="hx-tubs-grid">
              <div>
                <p className="hx-tubs-lead">{c.tubs.lead}</p>
                {c.tubs.body.map((p, i) => <p key={i} className="hx-tubs-p">{p}</p>)}
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
        </div>
      </section>

      {/* ════════════ Where it is going ════════════ */}
      <section className="hx-band hx-end">
        <div className="hx-wrap">
          <h2 className="hx-h2">{c.cta.title}</h2>
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
