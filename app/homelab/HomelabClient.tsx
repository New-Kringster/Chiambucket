'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './homelab.css';
import { SERVERS, SERVICES, CATEGORIES, WEIGHT_LEVEL, ACCESS_METHODS, type Weight, type Server, type Service, type Category } from './data';
import SystemMap from './SystemMap';
import MachineModal from './MachineModal';
import ServiceModal from './ServiceModal';
import { IcGrid, IcMail, IcMap } from '../../components/Icons';
import type { HomelabCopy } from './_copy/en';
import { HomelabCopyProvider, useHomelabCopy } from './_copy/context';
import { fillNode } from './_copy/fillNode';
import { fill } from '@/lib/fill';
import { localize } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

/* ── live status hook (graceful: unknown until the ping returns) ── */
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

/* ── small reveal wrapper (optionally interactive) ── */
function Reveal({ children, className, delay = 0, onClick, role, tabIndex, onKeyDown, ariaLabel }: {
  children: React.ReactNode; className?: string; delay?: number;
  onClick?: () => void; role?: string; tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void; ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}

function WeightMeter({ weight }: { weight: Weight }) {
  const c = useHomelabCopy();
  const label = c.stack.weights[weight];
  const level = WEIGHT_LEVEL[weight];
  return (
    <span className="hl2-meter" title={label} aria-label={fill(c.stack.loadLabel, { label })}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`hl2-meter-bar${i <= level ? ' on' : ''}${weight === 'dev' ? ' dev' : ''}`} />
      ))}
      <span className="hl2-meter-label">{label}</span>
    </span>
  );
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
  const { status, synced } = useStatus();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [stackOpen, setStackOpen] = useState(false);
  const [openServer, setOpenServer] = useState<Server | null>(null);
  const [openService, setOpenService] = useState<Service | null>(null);

  const publicKeys = SERVICES.filter((s) => s.statusKey).map((s) => s.statusKey!) as string[];
  const onlineCount = publicKeys.filter((k) => status[k] === 'up').length;
  const checked = publicKeys.some((k) => status[k]);

  const shown = filter === 'all' ? SERVICES : SERVICES.filter((s) => s.category === filter);
  const STACK_VISIBLE = 6;
  const collapsible = shown.length > STACK_VISIBLE;
  const collapsed = collapsible && !stackOpen;
  const visibleServices = collapsed ? shown.slice(0, STACK_VISIBLE) : shown;

  return (
    <main className="hl2">
      {/* ════════════ HERO ════════════ */}
      <header className="hl2-hero">
        <div className="hl2-hero-bg" aria-hidden="true">
          <div className="hl2-grid" />
        </div>

        <div className="hl2-hero-inner">
          <motion.div
            className="hl2-statusbar"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="hl2-live" aria-live="polite">
              <i className={`hl2-dot${checked && onlineCount > 0 ? ' on' : ''}`} />
              {checked
                ? <>{fillNode(c.hero.online, { count: <b>{fill(c.hero.onlineCount, { n: onlineCount, total: publicKeys.length })}</b> })}</>
                : c.hero.checking}
            </span>
            <span className="hl2-sep" />
            <span className="hl2-tele">{c.hero.tele}</span>
          </motion.div>

          <motion.span className="hl2-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {c.hero.eyebrow}
          </motion.span>
          <motion.h1 className="hl2-title"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {c.hero.title}
          </motion.h1>
          <motion.p className="hl2-lead"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {c.hero.lead}
          </motion.p>

          <motion.div className="hl2-hero-stats"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {c.hero.stats.map((s) => (
              <div key={s.k} className="hl2-stat"><b>{s.v}</b><span>{s.k}</span></div>
            ))}
          </motion.div>

          <motion.div className="hl2-hero-cta"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
            <a className="hl2-btn" href="#map"><IcMap /> {c.hero.mapCta}</a>
            <a className="hl2-btn ghost" href="#stack"><IcGrid /> {c.hero.stackCta}</a>
          </motion.div>
        </div>
        <a className="hl2-scrollcue" href="#mission" aria-label={c.hero.scrollCue}><span /></a>
      </header>

      {/* ════════════ MISSION ════════════ */}
      <section className="hl2-band" id="mission">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="01" eyebrow={c.mission.eyebrow} title={c.mission.title} /></Reveal>
          <Reveal delay={0.05}>
            <p className="hl2-mission-lead">{c.mission.lead}</p>
          </Reveal>
          <div className="hl2-pillars">
            {(['cloud', 'net', 'code', 'link'] as const).map((icon) => ({ icon, ...c.mission.pillars[icon] })).map((p, i) => (
              <Reveal key={p.icon} delay={i * 0.06} className="hl2-pillar">
                <PillarIcon name={p.icon} />
                <h3>{p.k}</h3>
                <p>{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MACHINES ════════════ */}
      <section className="hl2-band hl2-band-alt" id="machines">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="02" eyebrow={c.machines.eyebrow} title={c.machines.title} /></Reveal>
          <div className="hl2-machines">
            {SERVERS.map((s, i) => { const t = c.servers[s.id]; return (
              <Reveal key={s.id} delay={i * 0.08} className={`hl2-machine ${s.status}`}
                onClick={() => setOpenServer(s)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenServer(s); } }}
                ariaLabel={fill(c.details, { name: s.name })}>
                <div className="hl2-machine-photo">
                  <img src={s.photo} alt={fill(c.machines.photoAlt, { name: s.name })} />
                  <span className={`hl2-machine-state ${s.status}`}><i className="hl2-dot" />{c.statusLabels[s.status]}</span>
                </div>
                <div className="hl2-machine-body">
                  <div className="hl2-machine-head">
                    <h3>{s.name}</h3>
                    <span className="hl2-machine-tag">{t.tag}</span>
                  </div>
                  <p className="hl2-machine-role">{t.role}</p>
                  <p className="hl2-machine-blurb">{t.blurb}</p>
                  <dl className="hl2-spec">
                    {s.specs.map((sp) => (
                      <div key={sp.k}><dt>{c.specLabels[sp.k]}</dt><dd>{sp.v ?? t.specs[sp.k]}</dd></div>
                    ))}
                  </dl>
                  <span className="hl2-machine-more">{c.machines.more} <Arrow /></span>
                </div>
              </Reveal>
            ); })}
          </div>

          <Reveal className="hl2-rackreal">
            <figure className="hl2-rackreal-photo">
              <img src="/images/hl-rack-real.jpg" alt={c.machines.rack.alt} loading="lazy" />
            </figure>
            <div className="hl2-rackreal-text">
              <span className="hl2-eyebrow">{c.machines.rack.eyebrow}</span>
              <h3>{c.machines.rack.title}</h3>
              <p>{c.machines.rack.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ SYSTEM MAP ════════════ */}
      <section className="hl2-band" id="map">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="03" eyebrow={c.map.eyebrow} title={c.map.title} /></Reveal>
          <Reveal delay={0.05}>
            <p className="hl2-map-lead">{c.map.lead}</p>
          </Reveal>
          <Reveal delay={0.08}><SystemMap /></Reveal>
        </div>
      </section>

      {/* ════════════ STORAGE + PXE ════════════ */}
      <section className="hl2-band hl2-band-alt" id="storage">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="04" eyebrow={c.storage.eyebrow} title={c.storage.title} /></Reveal>
          <div className="hl2-storage">
            <Reveal className="hl2-storage-col">
              <h3 className="hl2-sub">{c.storage.poolsTitle}</h3>
              <div className="hl2-tier">
                <div className="hl2-tier-head"><b>{c.storage.array.name}</b><span>{c.storage.array.sub}</span></div>
                <div className="hl2-disks">
                  <span className="hl2-disk parity">{c.storage.disks.parity}</span><span className="hl2-disk parity">{c.storage.disks.parity}</span>
                  <span className="hl2-disk">{c.storage.disks.data}</span><span className="hl2-disk">{c.storage.disks.data}</span><span className="hl2-disk">{c.storage.disks.data}</span>
                </div>
                <p>{c.storage.array.body}</p>
              </div>
              <div className="hl2-tier">
                <div className="hl2-tier-head"><b>{c.storage.fast.name}</b><span>{c.storage.fast.sub}</span></div>
                <div className="hl2-disks">
                  <span className="hl2-disk nvme">{c.storage.disks.nvme}</span><span className="hl2-disk nvme">{c.storage.disks.nvme}</span>
                </div>
                <p>{c.storage.fast.body}</p>
              </div>
              <div className="hl2-proto">
                <span className="hl2-sub small">{c.storage.sharedOver}</span>
                <div className="hl2-proto-row">
                  {c.storage.protocols.map((p) => <span key={p}>{p}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="hl2-storage-col">
              <h3 className="hl2-sub">{c.storage.clusterTitle}</h3>
              <p className="hl2-pxe-lead">{c.storage.clusterLead}</p>
              <ul className="hl2-pxe-list">
                {c.storage.vms.map((v) => <li key={v.k}><b>{v.k}</b><span>{v.d}</span></li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ THE STACK ════════════ */}
      <section className="hl2-band" id="stack">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="05" eyebrow={c.stack.eyebrow} title={c.stack.title} /></Reveal>
          <Reveal delay={0.03}>
            <p className="hl2-map-lead">{c.stack.lead}</p>
          </Reveal>
          <Reveal delay={0.04} className="hl2-stack-toolbar">
            <div className="hl2-filters" role="group" aria-label={c.stack.filterLabel}>
              {(['all', ...CATEGORIES] as const).map((cat) => (
                <button key={cat} className={`hl2-filter${filter === cat ? ' on' : ''}`} onClick={() => { setFilter(cat); setStackOpen(false); }}>{c.stack.categories[cat]}</button>
              ))}
            </div>
            <span className="hl2-synced">
              {synced ? fill(c.stack.checkedAt, { time: new Date(synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }) : c.stack.checking}
            </span>
          </Reveal>
          <div className={`hl2-services-wrap${collapsed ? ' is-collapsed' : ''}`}>
            <div className="hl2-services">
            {visibleServices.map((s, i) => {
              const live = s.statusKey ? status[s.statusKey] : undefined;
              return (
                <motion.article
                  key={s.id}
                  className={`hl2-svc${s.featured ? ' featured' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.025, 0.3) }}
                  onClick={() => setOpenService(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenService(s); } }}
                  aria-label={fill(c.details, { name: s.name })}
                >
                  <div className="hl2-svc-top">
                    <span className="hl2-svc-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
                    <span className={`hl2-svc-status ${s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : s.featured ? 'build' : 'self'}`}>
                      <i className="hl2-dot" />
                      {c.stack.status[s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : s.featured ? 'build' : 'self']}
                    </span>
                    <span className="hl2-svc-expand" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" /></svg>
                    </span>
                  </div>
                  <h3 className="hl2-svc-name">{s.name}</h3>
                  <p className="hl2-svc-blurb">{c.services[s.id].blurb}</p>
                  <div className="hl2-svc-foot">
                    <WeightMeter weight={s.weight} />
                    <span className="hl2-svc-hosts">{s.hosts.join(', ')}</span>
                  </div>
                  {s.url && (
                    <a className="hl2-svc-link" href={s.url} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                      {s.url.replace('https://', '')} <Arrow />
                    </a>
                  )}
                </motion.article>
              );
            })}
            </div>
          </div>
          {collapsible && (
            <div className="hl2-stack-more">
              <button type="button" className="hl2-btn ghost" onClick={() => {
                const next = !stackOpen;
                setStackOpen(next);
                if (!next) document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }} aria-expanded={stackOpen}>
                {stackOpen ? c.stack.showFewer : fill(c.stack.showAll, { n: shown.length })}
                <svg className={`hl2-chev${stackOpen ? ' up' : ''}`} viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════ ACCESS ════════════ */}
      <section className="hl2-band hl2-band-alt" id="access">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="06" eyebrow={c.access.eyebrow} title={c.access.title} /></Reveal>
          <Reveal delay={0.04}>
            <p className="hl2-map-lead">{c.access.lead}</p>
          </Reveal>
          <div className="hl2-roads">
            {ACCESS_METHODS.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05} className={`hl2-road${m.primary ? ' primary' : ''}`}>
                <span className="hl2-road-node"><i /></span>
                <div className="hl2-road-name">
                  <b>{m.name}</b>
                  <div className="hl2-road-tags">
                    <span className="hl2-road-type">{c.access.methods[m.id].type}</span>
                    {m.primary && <span className="hl2-road-badge">{c.access.primary}</span>}
                  </div>
                </div>
                <p className="hl2-road-note">{c.access.methods[m.id].note}</p>
              </Reveal>
            ))}
            <Reveal delay={ACCESS_METHODS.length * 0.05} className="hl2-road hl2-road-home">
              <span className="hl2-road-node"><i /></span>
              <div className="hl2-road-name">
                <b>NewMain</b>
                <div className="hl2-road-tags">
                  <span className="hl2-road-type">{c.access.home.type}</span>
                </div>
              </div>
              <p className="hl2-road-note">{c.access.home.note}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="hl2-band hl2-cta">
        <div className="hl2-wrap">
          <Reveal>
            <h2 className="hl2-cta-title">{c.cta.title}</h2>
            <p className="hl2-cta-sub">{c.cta.sub}</p>
            <div className="hl2-hero-cta">
              <a className="hl2-btn" href={localize('/#projects', lang)}><IcGrid /> {c.cta.projects}</a>
              <a className="hl2-btn ghost" href={localize('/contact', lang)}><IcMail /> {c.cta.contact}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <MachineModal server={openServer} onClose={() => setOpenServer(null)} />
      <ServiceModal service={openService} status={status} onClose={() => setOpenService(null)} />
    </main>
  );
}

/* ── bits ── */
function SectionHead({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }) {
  return (
    <div className="hl2-head">
      <span className="hl2-head-n">{n}</span>
      <div><span className="hl2-head-eyebrow">{eyebrow}</span><h2 className="hl2-head-title">{title}</h2></div>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PillarIcon({ name }: { name: string }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
  const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'cloud') return (<svg {...common}><path {...stroke} d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17 18H7Z" /></svg>);
  if (name === 'net') return (<svg {...common}><circle cx="12" cy="5" r="2.2" {...stroke} /><circle cx="5" cy="19" r="2.2" {...stroke} /><circle cx="19" cy="19" r="2.2" {...stroke} /><path {...stroke} d="M12 7.2v4.3M12 11.5 6.4 17M12 11.5 17.6 17" /></svg>);
  if (name === 'code') return (<svg {...common}><path {...stroke} d="m9 8-4 4 4 4M15 8l4 4-4 4" /></svg>);
  return (<svg {...common}><path {...stroke} d="M9.5 14.5 8 16a3 3 0 0 1-4-4l2-2a3 3 0 0 1 4 0M14.5 9.5 16 8a3 3 0 0 1 4 4l-2 2a3 3 0 0 1-4 0" /></svg>);
}
