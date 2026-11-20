'use client';
import HlModal from './HlModal';
import { type Service } from './data';
import { IcOut } from '../../components/Icons';
import { useHomelabCopy } from './_copy/context';
import { fill } from '@/lib/fill';

type StatusMap = Record<string, 'up' | 'down'>;

export default function ServiceModal({ service, status, onClose }: { service: Service | null; status: StatusMap; onClose: () => void }) {
  const c = useHomelabCopy();
  return (
    <HlModal item={service} onClose={onClose} label={(s) => fill(c.details, { name: s.name })} closeLabel={c.close}>
      {(s) => {
        const t = c.services[s.id];
        const live = s.statusKey ? status[s.statusKey] : undefined;
        const statusCls = s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : s.featured ? 'build' : 'self';
        const statusText = c.stack.status[statusCls];
        const access = s.statusKey
          ? c.stack.access.public
          : s.featured
            ? c.stack.access.dev
            : c.stack.access.private;
        const category = c.stack.categories[s.category];
        return (
          <div className="hl2-smodal">
            <div className="hl2-smodal-top">
              <span className="hl2-smodal-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
              <div className="hl2-smodal-id">
                <span className="hl2-smodal-cat">{category}</span>
                <h3>{s.name}</h3>
              </div>
              <span className={`hl2-svc-status ${statusCls}`}><i className="hl2-dot" />{statusText}</span>
            </div>

            <p className="hl2-modal-p hl2-smodal-lead">{t.blurb}</p>
            {t.long?.map((para, i) => <p key={i} className="hl2-modal-p">{para}</p>)}

            <dl className="hl2-smodal-facts">
              <div><dt>{c.stack.facts.runsOn}</dt><dd>{s.hosts.join(', ')}</dd></div>
              <div><dt>{c.stack.facts.load}</dt><dd>{c.stack.weights[s.weight]}</dd></div>
              <div><dt>{c.stack.facts.access}</dt><dd>{access}</dd></div>
              <div><dt>{c.stack.facts.category}</dt><dd>{category}</dd></div>
            </dl>

            {s.url && (
              <a className="hl2-btn hl2-smodal-visit" href={s.url} target="_blank" rel="noopener">
                <IcOut /> {fill(c.stack.visit, { host: s.url.replace('https://', '') })}
              </a>
            )}
          </div>
        );
      }}
    </HlModal>
  );
}
