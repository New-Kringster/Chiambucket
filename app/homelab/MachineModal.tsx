'use client';
import { motion } from 'framer-motion';
import HlModal from './HlModal';
import { SERVICES, type Server } from './data';

/* ── per-machine animated explainer ── */
function MachineVisual({ kind }: { kind: 'runs' | 'pxe' | 'wake' }) {
  if (kind === 'runs') {
    const icons = SERVICES.filter((s) => s.hosts.includes('NewMain'));
    return (
      <div className="hl2-mv">
        <span className="hl2-mv-label">What runs here</span>
        <div className="hl2-mv-runs">
          {icons.map((s, i) => (
            <motion.span
              key={s.name}
              className="hl2-mv-chip"
              title={s.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.025, type: 'spring', stiffness: 340, damping: 18 }}
            >
              <img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} />
            </motion.span>
          ))}
        </div>
        <span className="hl2-mv-foot"><b>{icons.length}</b> of {SERVICES.length} services on this page live on NewMain</span>
      </div>
    );
  }

  if (kind === 'pxe') {
    const steps = [
      { t: 'No local disk', s: 'CaCa keeps no OS drive of its own' },
      { t: 'PXE boot', s: 'It pulls its disk over the network, not a local drive' },
      { t: 'Run the VMs', s: 'CasaOS and Debian come up in the cluster' },
    ];
    return (
      <div className="hl2-mv">
        <span className="hl2-mv-label">How it boots</span>
        <div className="hl2-mv-flow">
          {steps.map((st, i) => (
            <motion.div
              key={st.t}
              className="hl2-mv-step"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hl2-mv-step-n">{i + 1}</span>
              <b>{st.t}</b>
              <span>{st.s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // wake
  return (
    <div className="hl2-mv">
      <span className="hl2-mv-label">Wake on demand</span>
      <div className="hl2-mv-wake">
        <span className="hl2-mv-packet" aria-hidden="true" />
        <div className="hl2-mv-cores">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="hl2-mv-core"
              initial={{ opacity: 0.16 }}
              animate={{ opacity: [0.16, 1, 0.72] }}
              transition={{ delay: 0.55 + i * 0.045, duration: 0.5 }}
            />
          ))}
        </div>
      </div>
      <span className="hl2-mv-foot">One Wake-on-LAN packet spins up <b>20 cores</b> in seconds</span>
    </div>
  );
}

export default function MachineModal({ server, onClose }: { server: Server | null; onClose: () => void }) {
  return (
    <HlModal item={server} onClose={onClose} label={(s) => `${s.name} details`}>
      {(s) => (
        <div className="hl2-modal-grid">
          <div className="hl2-modal-media">
            <span className={`hl2-machine-state ${s.status}`}><i className="hl2-dot" />{s.statusLabel}</span>
            <img src={s.photo} alt={`${s.name} server`} />
            <dl className="hl2-spec hl2-modal-spec">
              {s.specs.map((sp) => (
                <div key={sp.k}><dt>{sp.k}</dt><dd>{sp.v}</dd></div>
              ))}
            </dl>
          </div>

          <div className="hl2-modal-body">
            <div className="hl2-modal-head">
              <span className="hl2-machine-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <p className="hl2-modal-tagline">{s.detail.tagline}</p>
            </div>
            {s.detail.story.map((para, i) => <p key={i} className="hl2-modal-p">{para}</p>)}
            <ul className="hl2-modal-highlights">
              {s.detail.highlights.map((h) => (
                <li key={h}><CheckIcon />{h}</li>
              ))}
            </ul>
            <MachineVisual kind={s.detail.visual} />
          </div>
        </div>
      )}
    </HlModal>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4 4 10-10" />
    </svg>
  );
}
