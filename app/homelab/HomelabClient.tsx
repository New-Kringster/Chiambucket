'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './homelab.css';
import { SERVERS, SERVICES, CATEGORIES, WEIGHT_META, ACCESS_METHODS, type Weight, type Server, type Service } from './data';
import SystemMap from './SystemMap';
import MachineModal from './MachineModal';
import ServiceModal from './ServiceModal';

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
  const { label, level } = WEIGHT_META[weight];
  return (
    <span className="hl2-meter" title={label} aria-label={`Load: ${label}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`hl2-meter-bar${i <= level ? ' on' : ''}${weight === 'dev' ? ' dev' : ''}`} />
      ))}
      <span className="hl2-meter-label">{label}</span>
    </span>
  );
}

export default function HomelabClient() {
  const { status, synced } = useStatus();
  const [filter, setFilter] = useState<string>('All');
  const [stackOpen, setStackOpen] = useState(false);
  const [openServer, setOpenServer] = useState<Server | null>(null);
  const [openService, setOpenService] = useState<Service | null>(null);

  const publicKeys = SERVICES.filter((s) => s.statusKey).map((s) => s.statusKey!) as string[];
  const onlineCount = publicKeys.filter((k) => status[k] === 'up').length;
  const checked = publicKeys.some((k) => status[k]);

  const shown = filter === 'All' ? SERVICES : SERVICES.filter((s) => s.category === filter);
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
              {checked ? <><b>{onlineCount} of {publicKeys.length}</b>public services online</> : 'Checking public services'}
            </span>
            <span className="hl2-sep" />
            <span className="hl2-tele">NewMain runs Unraid 7.1.2</span>
          </motion.div>

          <motion.span className="hl2-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            Homelab
          </motion.span>
          <motion.h1 className="hl2-title"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            Three servers <em>in my room.</em>
          </motion.h1>
          <motion.p className="hl2-lead"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            They run my photo library, my files, and the MQTT and TURN servers that Project June and
            LUMEN use. It is also where I learn networking, storage and Docker, and where I host what I build.
          </motion.p>

          <motion.div className="hl2-hero-stats"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {[
              { v: '3', k: 'servers' },
              { v: '38', k: 'self-hosted services' },
              { v: '24 TB', k: 'usable storage' },
              { v: '4', k: 'VLANs' },
            ].map((s) => (
              <div key={s.k} className="hl2-stat"><b>{s.v}</b><span>{s.k}</span></div>
            ))}
          </motion.div>

          <motion.div className="hl2-hero-cta"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
            <a className="hl2-btn" href="#map">See the network map <Arrow /></a>
            <a className="hl2-btn ghost" href="#stack">See the services</a>
          </motion.div>
        </div>
        <a className="hl2-scrollcue" href="#mission" aria-label="Scroll down"><span /></a>
      </header>

      {/* ════════════ MISSION ════════════ */}
      <section className="hl2-band" id="mission">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="01" eyebrow="Why I run it" title="What it is for." /></Reveal>
          <Reveal delay={0.05}>
            <p className="hl2-mission-lead">
              My hardware projects need servers to talk to. Project June streams its cameras through my
              TURN server and uses my MQTT broker for telemetry and control. LUMEN&apos;s speech relay runs in
              Docker here. Running these myself is how I learned networking, storage and deployment.
            </p>
          </Reveal>
          <div className="hl2-pillars">
            {[
              { k: 'Servers and storage', d: 'Docker containers behind a reverse proxy, two storage tiers and backups, running services I use every day.', icon: 'cloud' },
              { k: 'Networking', d: 'Four VLANs, RADIUS, WPA3-Enterprise Wi-Fi, and UniFi switches and access points.', icon: 'net' },
              { k: 'Deploying my apps', d: 'Apps I build are deployed to a VM in the Proxmox cluster. Next I want agents to run parts of the lab themselves.', icon: 'code' },
              { k: 'For my projects', d: 'coturn lets Project June stream video over 5G. Mosquitto carries messages for my ESP32 school projects.', icon: 'link' },
            ].map((p, i) => (
              <Reveal key={p.k} delay={i * 0.06} className="hl2-pillar">
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
          <Reveal><SectionHead n="02" eyebrow="Hardware" title="Servers." /></Reveal>
          <div className="hl2-machines">
            {SERVERS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08} className={`hl2-machine ${s.status}`}
                onClick={() => setOpenServer(s)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenServer(s); } }}
                ariaLabel={`${s.name} details`}>
                <div className="hl2-machine-photo">
                  <img src={s.photo} alt={`${s.name} server`} />
                  <span className={`hl2-machine-state ${s.status}`}><i className="hl2-dot" />{s.statusLabel}</span>
                </div>
                <div className="hl2-machine-body">
                  <div className="hl2-machine-head">
                    <h3>{s.name}</h3>
                    <span className="hl2-machine-tag">{s.tag}</span>
                  </div>
                  <p className="hl2-machine-role">{s.role}</p>
                  <p className="hl2-machine-blurb">{s.blurb}</p>
                  <dl className="hl2-spec">
                    {s.specs.map((sp) => (
                      <div key={sp.k}><dt>{sp.k}</dt><dd>{sp.v}</dd></div>
                    ))}
                  </dl>
                  <span className="hl2-machine-more">Specs and details <Arrow /></span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="hl2-rackreal">
            <figure className="hl2-rackreal-photo">
              <img src="/images/hl-rack-real.jpg" alt="The homelab rack in my room: the patch panel with blue cables at the top, the servers behind a mesh door" loading="lazy" />
            </figure>
            <div className="hl2-rackreal-text">
              <span className="hl2-eyebrow">The rack</span>
              <h3>All three in one cabinet.</h3>
              <p>The rack sits in a corner of my room. The patch panel is at the top and the servers are behind the mesh door. Two run all the time; Adell stays off until I need it.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ SYSTEM MAP ════════════ */}
      <section className="hl2-band" id="map">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="03" eyebrow="Network" title="Network map." /></Reveal>
          <Reveal delay={0.05}>
            <p className="hl2-map-lead">
              One UniFi network split into four VLANs. Select a device to see what it does, or a
              VLAN to highlight the devices on it.
            </p>
          </Reveal>
          <Reveal delay={0.08}><SystemMap /></Reveal>
        </div>
      </section>

      {/* ════════════ STORAGE + PXE ════════════ */}
      <section className="hl2-band hl2-band-alt" id="storage">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="04" eyebrow="Storage and VMs" title="Storage and virtual machines." /></Reveal>
          <div className="hl2-storage">
            <Reveal className="hl2-storage-col">
              <h3 className="hl2-sub">Storage on NewMain</h3>
              <div className="hl2-tier">
                <div className="hl2-tier-head"><b>Array</b><span>Unraid, parity protected</span></div>
                <div className="hl2-disks">
                  <span className="hl2-disk parity">P</span><span className="hl2-disk parity">P</span>
                  <span className="hl2-disk">D</span><span className="hl2-disk">D</span><span className="hl2-disk">D</span>
                </div>
                <p>Two parity drives and three data drives. It holds PXE backups, archives and media, and survives two drives failing at once.</p>
              </div>
              <div className="hl2-tier">
                <div className="hl2-tier-head"><b>Fast pool</b><span>ZFS NVMe mirror</span></div>
                <div className="hl2-disks">
                  <span className="hl2-disk nvme">NVMe</span><span className="hl2-disk nvme">NVMe</span>
                </div>
                <p>Two 2 TB NVMe drives in a ZFS mirror. Docker app data, VM disks and the PXE ISO library run from here.</p>
              </div>
              <div className="hl2-proto">
                <span className="hl2-sub small">Shared over</span>
                <div className="hl2-proto-row">
                  <span>SFTP</span><span>SMB on the local network</span><span>NFS to Linux and macOS</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="hl2-storage-col">
              <h3 className="hl2-sub">The Proxmox cluster</h3>
              <p className="hl2-pxe-lead">CaCa and Adell form one Proxmox cluster. CaCa boots from its own 1 TB SSD and stays on. Adell boots over the network with no local OS drive, and I wake it when I need its cores.</p>
              <ul className="hl2-pxe-list">
                <li><b>claudeplayground</b><span>An Ubuntu VM where I deploy apps I build. Claude has SSH access to ship them.</span></li>
                <li><b>CasaOS and Debian</b><span>The VMs that used to run on bare metal.</span></li>
                <li><b>Wake-on-LAN</b><span>UpSnap turns Adell on when a job needs it, so it only draws power while working.</span></li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ THE STACK ════════════ */}
      <section className="hl2-band" id="stack">
        <div className="hl2-wrap">
          <Reveal><SectionHead n="05" eyebrow="Software" title="Services." /></Reveal>
          <Reveal delay={0.03}>
            <p className="hl2-map-lead">The main ones, out of 38. Public services show live status, checked once a minute.</p>
          </Reveal>
          <Reveal delay={0.04} className="hl2-stack-toolbar">
            <div className="hl2-filters" role="group" aria-label="Filter services">
              {['All', ...CATEGORIES].map((c) => (
                <button key={c} className={`hl2-filter${filter === c ? ' on' : ''}`} onClick={() => { setFilter(c); setStackOpen(false); }}>{c}</button>
              ))}
            </div>
            <span className="hl2-synced">
              {synced ? `Checked at ${new Date(synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Checking status'}
            </span>
          </Reveal>
          <div className={`hl2-services-wrap${collapsed ? ' is-collapsed' : ''}`}>
            <div className="hl2-services">
            {visibleServices.map((s, i) => {
              const live = s.statusKey ? status[s.statusKey] : undefined;
              return (
                <motion.article
                  key={s.name}
                  className={`hl2-svc${s.featured ? ' featured' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.025, 0.3) }}
                  onClick={() => setOpenService(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenService(s); } }}
                  aria-label={`${s.name} details`}
                >
                  <div className="hl2-svc-top">
                    <span className="hl2-svc-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
                    <span className={`hl2-svc-status ${s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : s.featured ? 'build' : 'self'}`}>
                      <i className="hl2-dot" />
                      {s.statusKey ? (live === 'up' ? 'online' : live === 'down' ? 'offline' : 'checking') : s.featured ? 'building now' : 'private'}
                    </span>
                    <span className="hl2-svc-expand" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" /></svg>
                    </span>
                  </div>
                  <h3 className="hl2-svc-name">{s.name}</h3>
                  <p className="hl2-svc-blurb">{s.blurb}</p>
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
                {stackOpen ? 'Show fewer' : `Show all ${shown.length} services`}
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
          <Reveal><SectionHead n="06" eyebrow="Remote access" title="Six ways in." /></Reveal>
          <Reveal delay={0.04}>
            <p className="hl2-map-lead">Six separate ways in from outside, so one of them breaking does not lock me out.</p>
          </Reveal>
          <div className="hl2-roads">
            {ACCESS_METHODS.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05} className={`hl2-road${m.primary ? ' primary' : ''}`}>
                <span className="hl2-road-node"><i /></span>
                <div className="hl2-road-name">
                  <b>{m.name}</b>
                  <div className="hl2-road-tags">
                    <span className="hl2-road-type">{m.type}</span>
                    {m.primary && <span className="hl2-road-badge">Primary</span>}
                  </div>
                </div>
                <p className="hl2-road-note">{m.note}</p>
              </Reveal>
            ))}
            <Reveal delay={ACCESS_METHODS.length * 0.05} className="hl2-road hl2-road-home">
              <span className="hl2-road-node"><i /></span>
              <div className="hl2-road-name">
                <b>NewMain</b>
                <div className="hl2-road-tags">
                  <span className="hl2-road-type">The rack</span>
                </div>
              </div>
              <p className="hl2-road-note">Every path above ends here. If one fails, the other five still work.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="hl2-band hl2-cta">
        <div className="hl2-wrap">
          <Reveal>
            <h2 className="hl2-cta-title">What I am building now.</h2>
            <p className="hl2-cta-sub">OpenClaw, a runner that lets AI agents do real tasks on the lab: start a container, check a service, deploy a small app and report back. It is not finished.</p>
            <div className="hl2-hero-cta">
              <a className="hl2-btn" href="/#portfolio-items-holder">See my projects <Arrow /></a>
              <a className="hl2-btn ghost" href="/contact">Contact me</a>
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
