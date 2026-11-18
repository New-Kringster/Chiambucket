'use client';
/* Project cards for the homepage story: the full-screen flagship card, the
   project gallery (with the shared peek reader) and the What I do bento. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import AiMark from '../../components/AiMark';
import InfoModal, { type InfoItem } from '../../components/InfoModal';
import LazyVideo from '../../components/LazyVideo';
import { PeekFeed } from '../../components/ProjectPeek';
import { IcRead, IcPeek, IcPlay, IcGitHub, IcOut } from '../../components/Icons';
import { PROJECTS, TILES, TYPE_LABEL, type Flagship, type Project, type ProjectType } from './content';

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

/* The tier marks the old homepage used (.hp-pf-crown, .hp-pf-star): a crown
   for the flagship, a star for highlighted builds. */
export const Crown = () => <svg className="hs-tier-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 18.2h19.2l-1.5-9.4-5.4 3.9L12 4.8 9.3 12.7 3.9 8.8z" /></svg>;
export const Star = () => <svg className="hs-tier-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z" /></svg>;

/** A flagship project as a full-screen card: a frame round the screen, the
    picture in a band across the top (the project's own art on black, so it
    meets the card with no edge), then the copy across the card's full inner
    width: the badge with the AI-use mark at the right edge, the title beside
    the lead, the facts, and the tools beside the actions. `slot` lets the
    OCR card leave its picture band to the live 3D reader. */
export function FlagCard({ p, onPeek, variant, slot }: { p: Flagship; onPeek: (id: string) => void; variant: 'ocr' | 'june' | 'pip' | 'bead'; slot?: ReactNode }) {
  return (
    <article className={`hs-fc is-${variant}`} aria-label={`${p.name}, ${p.badge}`}>
      <div className="hs-fc-frame" aria-hidden="true" />
      <div className="hs-fc-media">
        {slot ?? <img src={p.poster} alt={p.posterAlt} loading="lazy" />}
      </div>
      <div className="hs-fc-body">
        <div className="hs-fc-top">
          <span className={`hs-fc-badge${p.gold ? ' is-gold' : ''}`}>{p.gold ? <Crown /> : <Star />}{p.badge}</span>
          <AiMark project={p.id} className="hs-fc-ai" />
        </div>
        <div className="hs-fc-head">
          <h3 className="hs-fc-title">{p.name}</h3>
          <p className="hs-fc-kind">{p.kind}</p>
        </div>
        <p className="hs-fc-lead">{p.lead}</p>
        <dl className="hs-fc-stats">
          {p.stats.map((s) => <div key={s.l}><dt>{s.v}</dt><dd>{s.l}</dd></div>)}
        </dl>
        <div className="hs-fc-foot">
          <div className="hs-fc-tools" aria-label="Tools">
            {p.tools.map((t) => <img key={t.src} src={t.src} alt={t.alt} title={t.alt} loading="lazy" />)}
            {slot && <img className="hs-fc-poster" src={p.poster} alt={p.posterAlt} loading="lazy" />}
          </div>
          <div className="hs-btns">
            <a className="hs-btn is-primary" href={p.read}><IcRead /> Read the article</a>
            <button type="button" className="hs-btn" onClick={() => onPeek(p.id)}><IcPeek /> Peek summary</button>
            {p.extra && <a className="hs-btn" href={p.extra.url} target="_blank" rel="noopener">{extraIcon[p.extra.kind]} {p.extra.label}</a>}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── The project gallery ──
   Cards are sized by tier: the flagship across the whole row, highlights two
   to a row, everything else three to a row (a six-column grid). An odd
   highlight left over takes two thirds of a row beside the first ordinary
   card, so no row is left with a hole. */
type Size = 'xl' | 'lg' | 'md' | 'sm';
function bySize(list: Project[]): { p: Project; size: Size; pair?: boolean }[] {
  const flag = list.filter((p) => p.flagship);
  const hl = list.filter((p) => !p.flagship && p.highlight);
  const rest = list.filter((p) => !p.flagship && !p.highlight);
  const odd = hl.length % 2 === 1 && rest.length > 0;
  return [
    ...flag.map((p) => ({ p, size: 'xl' as Size })),
    ...hl.map((p, i) => ({ p, size: (odd && i === hl.length - 1 ? 'md' : 'lg') as Size })),
    // the ordinary card beside an odd highlight is as tall as it, so its picture grows to fill
    ...rest.map((p, i) => ({ p, size: 'sm' as Size, pair: odd && i === 0 })),
  ];
}

export function ProjectGallery({ onPeek }: { onPeek: (id: string) => void }) {
  const [filter, setFilter] = useState<'all' | ProjectType>('all');
  const shown = bySize(PROJECTS.filter((p) => filter === 'all' || p.type === filter));
  /* Each card rises in once, the first time it comes into view. The observer
     is set up again for every filter, so cards a filter brings up are never
     left hidden (a page-wide scroll batch used to miss them). */
  const grid = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const cards = Array.from(grid.current?.querySelectorAll<HTMLElement>('.hs-pc:not(.is-in)') ?? []);
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      cards.forEach((c) => c.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      let k = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.style.setProperty('--rise-d', `${k++ * 70}ms`);
        el.classList.add('is-in');
        io.unobserve(el);
        setTimeout(() => el.style.removeProperty('--rise-d'), 1200);
      }
    }, { rootMargin: '0px 0px -6% 0px' });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [filter]);
  return (
    <>
      <div className="hs-pg-filters" role="group" aria-label="Show projects">
        {(['all', 'personal', 'school', 'internship'] as const).map((f) => (
          <button key={f} type="button" className={filter === f ? 'is-on' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : TYPE_LABEL[f]}
            {f === 'internship' && <i className="hs-m5" role="img" aria-label="at M5Stack" />}
          </button>
        ))}
      </div>
      <ul className="hs-pg" ref={grid}>
        {shown.map(({ p, size, pair }, i) => (
          <li key={p.id} className={`hs-pc is-${size}${pair ? ' is-pair' : ''}${p.url ? '' : ' is-soon'}`} style={{ '--i': i } as CSSProperties}>
            <div className="hs-pc-thumb">
              <img src={p.img} alt="" loading="lazy" />
              <AiMark project={p.id} />
              <div className="hs-pc-tags">
                <span className="hs-pc-type">{TYPE_LABEL[p.type]}{p.type === 'internship' && <i className="hs-m5" role="img" aria-label="at M5Stack" />}</span>
                {p.flagship ? <span className="hs-pc-hl is-gold"><Crown />Flagship</span> : p.highlight && <span className="hs-pc-hl"><Star />Highlight</span>}
              </div>
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
            <button type="button" onClick={() => setItem(t.item)} aria-label={`${t.word}: ${t.line}. Open the details`}>
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
