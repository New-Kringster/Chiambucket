'use client';
import HlModal from './HlModal';
import { WEIGHT_LEVEL, type Service } from './data';
import { IcOut } from '../../components/Icons';
import { useHomelabCopy } from './_copy/context';
import { fill } from '@/lib/fill';

type StatusMap = Record<string, 'up' | 'down'>;

/** A service's dialog: what it is, its live status, and where and how it runs. */
export default function ServiceModal({ service, status, onClose }: { service: Service | null; status: StatusMap; onClose: () => void }) {
  const c = useHomelabCopy();
  return (
    <HlModal item={service} onClose={onClose} label={(s) => fill(c.details, { name: s.name })} closeLabel={c.close}>
      {(s) => {
        const t = c.services[s.id];
        const live = s.statusKey ? status[s.statusKey] : undefined;
        const statusCls = s.statusKey ? (live === 'up' ? 'up' : live === 'down' ? 'down' : 'wait') : 'self';
        const category = c.stack.categories[s.category];
        const load = c.stack.weights[s.weight];
        return (
          <div className="hx-smodal">
            <div className="hx-smodal-top">
              <span className="hx-svc-ico big"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
              <div className="hx-smodal-id">
                <span className="hx-smodal-cat">{category}</span>
                <h3>{s.name}</h3>
              </div>
              <span className={`hx-svc-status ${statusCls}`}><i className="hx-dot" />{c.stack.status[statusCls]}</span>
            </div>

            <p className="hx-modal-p lead">{t.blurb}</p>
            {t.long?.map((para, i) => <p key={i} className="hx-modal-p">{para}</p>)}

            <dl className="hx-spec hx-smodal-facts">
              <div><dt>{c.stack.facts.runsOn}</dt><dd>NewMain</dd></div>
              <div>
                <dt>{c.stack.facts.load}</dt>
                <dd className="hx-load" aria-label={fill(c.stack.loadLabel, { label: load })}>
                  <span className="hx-meter" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= WEIGHT_LEVEL[s.weight] ? 'on' : ''} />)}
                  </span>
                  {load}
                </dd>
              </div>
              <div><dt>{c.stack.facts.access}</dt><dd>{s.statusKey ? c.stack.access.public : c.stack.access.private}</dd></div>
              <div><dt>{c.stack.facts.category}</dt><dd>{category}</dd></div>
            </dl>

            {s.url && (
              <a className="hx-btn hx-smodal-visit" href={s.url} target="_blank" rel="noopener">
                <IcOut /> {fill(c.stack.visit, { host: s.url.replace('https://', '') })}
              </a>
            )}
          </div>
        );
      }}
    </HlModal>
  );
}
