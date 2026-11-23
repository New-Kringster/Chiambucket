'use client';
import HlModal from './HlModal';
import { WEIGHT_LEVEL, type Service } from './data';
import { IcOut } from '../../components/Icons';
import { useHomelabCopy } from './_copy/context';
import { fill } from '@/lib/fill';
import { sans } from './font';

type StatusMap = Record<string, 'up' | 'down'>;

/** A service's dialog: what it is, where and how it runs, and for public services whether it is up right now. */
export default function ServiceModal({ service, status, onClose }: { service: Service | null; status: StatusMap; onClose: () => void }) {
  const c = useHomelabCopy();
  return (
    <HlModal item={service} onClose={onClose} label={(s) => fill(c.details, { name: s.name })} closeLabel={c.close}>
      {(s) => {
        const t = c.services[s.id];
        const live = s.statusKey ? status[s.statusKey] : undefined;
        const category = c.stack.categories[s.category];
        const load = c.stack.weights[s.weight];
        return (
          <div className={`hx-smodal ${sans.variable}`}>
            <div className="hx-smodal-top">
              <span className="hx-smodal-ico"><img src={s.icon} alt="" style={s.iconRound ? { borderRadius: '22%' } : undefined} /></span>
              <div className="hx-smodal-id">
                <span className="hx-smodal-cat">{category}</span>
                <h3>{s.name}</h3>
              </div>
            </div>

            <p className="hx-modal-p lead">{t.blurb}</p>
            {t.long?.map((para, i) => <p key={i} className="hx-modal-p">{para}</p>)}

            <dl className="hx-smodal-facts">
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
              <div>
                <dt>{c.stack.facts.access}</dt>
                <dd>
                  {s.statusKey ? c.stack.access.public : c.stack.access.private}
                  {live && <>, <span className={live === 'up' ? 'hx-up' : 'hx-down'}>{c.stack.status[live]}</span></>}
                </dd>
              </div>
              <div><dt>{c.stack.facts.category}</dt><dd>{category}</dd></div>
            </dl>

            {s.url && (
              <a className="hx-btn" href={s.url} target="_blank" rel="noopener">
                <IcOut /> {fill(c.stack.visit, { host: s.url.replace('https://', '') })}
              </a>
            )}
          </div>
        );
      }}
    </HlModal>
  );
}
