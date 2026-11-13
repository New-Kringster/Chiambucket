'use client';
/* Project cards for the homepage story: the full-screen flagship card, the
   project gallery (with the shared peek reader) and the What I do bento. */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import AiMark from '../../components/AiMark';
import InfoModal, { type InfoItem } from '../../components/InfoModal';
import LazyVideo from '../../components/LazyVideo';
import { PeekFeed } from '../../components/ProjectPeek';
import { IcRead, IcPeek, IcPlay, IcGitHub, IcOut } from '../../components/Icons';
import { PROJECTS, TILES, type Flagship } from './content';

/* ── The peek reader, shared by every card on the page ── */
export function usePeek() {
  const [open, setOpen] = useState(false);
  const [anim, setAnim] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const show = (pid: string) => { setId(pid); setOpen(true); document.body.style.overflow = 'hidden'; };
  const close = () => {
    setAnim(false);
    document.body.style.overflow = '';
    setTimeout(() => { setOpen(false); setId(null); }, 320);
  };
  useEffect(() => { if (open) requestAnimationFrame(() => setAnim(true)); }, [open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) close(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);
  const modal = (
    <div className={`hp-modal${anim ? ' is-open' : ''}`} hidden={!open}>
      <div className="hp-modal-backdrop" onClick={close} />
      <div className="hp-modal-panel" role="dialog" aria-modal aria-label="Project summary">
        <button className="hp-modal-close" onClick={close} aria-label="Close the summary">&times;</button>
        <div className="hp-modal-content">{id && <PeekFeed key={id} startId={id} />}</div>
      </div>
    </div>
  );
  return { show, modal };
}

const extraIcon = { play: <IcPlay />, github: <IcGitHub />, report: <IcOut /> };

/** A flagship project as a full-screen card: a frame around the screen, the
    badge, the AI-use mark, the poster, the facts and the actions. `side`
    picks which side the poster stands on; `slot` lets the OCR card leave its
    poster area to the live 3D reader. */
export function FlagCard({ p, onPeek, side = 'right', variant, slot }: { p: Flagship; onPeek: (id: string) => void; side?: 'left' | 'right'; variant: 'ocr' | 'june' | 'bead'; slot?: ReactNode }) {
  return (
    <article className={`hs-fc is-${variant} is-${side}`} aria-label={`${p.name}, ${p.badge}`}>
      <div className="hs-fc-frame" aria-hidden="true" />
      <div className="hs-fc-media">
        {slot ?? <img src={p.poster} alt={p.posterAlt} loading="lazy" />}
      </div>
      <div className="hs-fc-body">
        <div className="hs-fc-top">
          <span className={`hs-fc-badge${p.gold ? ' is-gold' : ''}`}>{p.badge}</span>
          <AiMark project={p.id} className="hs-fc-ai" />
        </div>
        <h3 className="hs-fc-title">{p.name}</h3>
        <p className="hs-fc-kind">{p.kind}</p>
        <p className="hs-fc-lead">{p.lead}</p>
        <dl className="hs-fc-stats">
          {p.stats.map((s) => <div key={s.l}><dt>{s.v}</dt><dd>{s.l}</dd></div>)}
        </dl>
        <div className="hs-fc-tools" aria-label="Tools">
          {p.tools.map((t) => <img key={t.src} src={t.src} alt={t.alt} title={t.alt} loading="lazy" />)}
        </div>
        <div className="hs-btns">
          <a className="hs-btn is-primary" href={p.read}><IcRead /> Read the article</a>
          <button type="button" className="hs-btn" onClick={() => onPeek(p.id)}><IcPeek /> Peek summary</button>
          <a className="hs-btn" href={p.extra.url} target="_blank" rel="noopener">{extraIcon[p.extra.kind]} {p.extra.label}</a>
        </div>
        {slot && <img className="hs-fc-poster" src={p.poster} alt={p.posterAlt} loading="lazy" />}
      </div>
    </article>
  );
}

/* ── The project gallery ── */
export function ProjectGallery({ onPeek }: { onPeek: (id: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'personal' | 'school'>('all');
  const shown = PROJECTS.filter((p) => filter === 'all' || p.type === filter);
  return (
    <>
      <div className="hs-pg-filters" role="group" aria-label="Show projects">
        {(['all', 'personal', 'school'] as const).map((f) => (
          <button key={f} type="button" className={filter === f ? 'is-on' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'personal' ? 'Personal' : 'School'}
          </button>
        ))}
      </div>
      <ul className="hs-pg">
        {shown.map((p, i) => (
          <li key={p.id} className={`hs-pc${p.highlight ? ' is-wide' : ''}${p.url ? '' : ' is-soon'}`} style={{ '--i': i } as CSSProperties}>
            <div className="hs-pc-thumb">
              <img src={p.img} alt="" loading="lazy" />
              <AiMark project={p.id} />
              <span className="hs-pc-type">{p.type === 'personal' ? 'Personal' : 'School'}</span>
            </div>
            <div className="hs-pc-info">
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <div className="hs-pc-foot">
                <div className="hs-pc-icons">{p.icons.map((ic) => <img key={ic.src} src={ic.src} alt={ic.alt} title={ic.alt} loading="lazy" />)}</div>
                {p.url ? (
                  <div className="hs-pc-act">
                    <button type="button" className="hs-pc-peek" onClick={() => onPeek(p.id)} aria-label={`Peek at a summary of ${p.title}`}><IcPeek /></button>
                    <a className="hs-pc-read" href={p.url}><IcRead /> Read</a>
                  </div>
                ) : <span className="hs-pc-soon">Write-up coming soon</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ── What I do: a bento of pictures; each opens its details ── */
export function Bento() {
  const [item, setItem] = useState<InfoItem | null>(null);
  return (
    <>
      <ul className="hs-bento">
        {TILES.map((t) => (
          <li key={t.key} className={`hs-tile is-${t.size}`}>
            <button type="button" onClick={() => setItem(t.item)} aria-label={`${t.word}: ${t.line} Open the details`}>
              <span className="hs-tile-media">
                {t.video
                  ? <LazyVideo webm={t.video.webm} mp4={t.video.mp4} poster={t.video.poster} />
                  : <img src={t.img} alt="" loading="lazy" style={{ objectFit: t.fit ?? 'cover', objectPosition: t.pos ?? '50% 50%' }} className={t.fit === 'contain' ? 'is-contain' : ''} />}
              </span>
              <span className="hs-tile-text"><b>{t.word}</b><span>{t.line}</span></span>
              <span className="hs-tile-plus" aria-hidden="true">+</span>
            </button>
          </li>
        ))}
      </ul>
      <InfoModal item={item} onClose={() => setItem(null)} />
    </>
  );
}
