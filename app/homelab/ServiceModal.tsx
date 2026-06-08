'use client';
import HlModal from './HlModal';
import { WEIGHT_META, type Service } from './data';

type StatusMap = Record<string, 'up' | 'down'>;

export default function ServiceModal({ service, status, onClose }: { service: Service | null; status: StatusMap; onClose: () => void }) {
  return (
    <HlModal item={service} onClose={onClose} label={(s) => `${s.name} details`}>
      {(s) => {
        const live = s.statusKey ? status[s.statusKey] : undefined;
        const statusCls = s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : s.featured ? 'build' : 'self';
        const statusText = s.statusKey ? (live === 'up' ? 'online' : live === 'down' ? 'offline' : 'checking…') : s.featured ? 'current build' : 'self-hosted';
        const access = s.statusKey
          ? 'Public, via Nginx Proxy Manager + CrowdSec'
          : s.featured
            ? 'In development on NewMain'
            : 'Private, on the Tailscale network';
        return (
          <div className="hl2-smodal">
            <div className="hl2-smodal-top">
              <span className="hl2-smodal-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
              <div className="hl2-smodal-id">
                <span className="hl2-smodal-cat">{s.category}</span>
                <h3>{s.name}</h3>
              </div>
              <span className={`hl2-svc-status ${statusCls}`}><i className="hl2-dot" />{statusText}</span>
            </div>

            <p className="hl2-modal-p hl2-smodal-lead">{s.blurb}</p>
            {s.long?.map((para, i) => <p key={i} className="hl2-modal-p">{para}</p>)}

            <dl className="hl2-smodal-facts">
              <div><dt>Runs on</dt><dd>{s.hosts.join(' · ')}</dd></div>
              <div><dt>Load</dt><dd>{WEIGHT_META[s.weight].label}</dd></div>
              <div><dt>Access</dt><dd>{access}</dd></div>
              <div><dt>Category</dt><dd>{s.category}</dd></div>
            </dl>

            {s.url && (
              <a className="hl2-btn hl2-smodal-visit" href={s.url} target="_blank" rel="noopener">
                Visit {s.url.replace('https://', '')}
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            )}
          </div>
        );
      }}
    </HlModal>
  );
}
