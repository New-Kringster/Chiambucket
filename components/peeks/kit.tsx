import type { ReactNode } from 'react';
import { IcRead, IcScreen, iconForUrl } from '../Icons';
import AiMark from '../AiMark';
import { localize } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';

/*
  The building blocks every language's peek reader is written with
  (components/peeks/<lang>.tsx). They hold the markup; the words come from the
  language file, and the few fixed words they print come from its LABELS.
*/

/* The fixed words of the reader and its feed, one object per language. Feed
   labels take {title} or {n} placeholders (filled with lib/fill.ts). */
export type PeekLabels = {
  /** The chip on a project that has no write-up yet. */
  soon: string;
  /** The gap before each next project in the feed: 'Next: {title}'. */
  next: string;
  /** A project's name when it has no title: 'Project {n}'. */
  untitled: string;
  /** The hint above the card that pulls the next project open. */
  pullHint: string;
  /** The aria-label of that card. */
  pullAria: string;
  /** The marker at the end of the feed. */
  end: string;
};

/* What a language file exports. */
export type PeekLang = {
  TITLES: Record<string, string>;
  LABELS: PeekLabels;
  PeekBody: (props: { id: string }) => ReactNode;
};

/* The cover each project's reader opens with (its hero), also the peek of the next one. */
export const COVERS: Record<string, string> = {
  'proj-june': '/images/ProjJuneBanner1.webp', 'proj-lora': '/images/borlocator-pf-context.webp',
  'proj-waterslop': '/images/ocr-reader-pf-context.webp', 'proj-pip': '/images/pip-pf-context.webp', 'proj-pantry': '/images/pantry-pf-context.webp', 'proj-ruler': '/images/scroll-ruler-pf-context.webp', 'proj-cadmouse': '/images/cad-mouse-pf-context.webp', 'proj-lidar': '/images/stackchan-lidar-pf-context.webp',
  'proj-lumen': '/images/lumen-pf-context.webp', 'proj-beadreader': '/images/beadreader-pf-context.webp',
  'proj-ema': '/images/Ema-pf-context.webp', 'proj-pandus': '/images/pandusarticle.webp',
  'proj-elecf': '/images/elef2-pf-context.webp', 'proj-kauli': '/images/kauli3-pf-context.webp',
  'proj-sol': '/images/Series1l-pf-context.webp', 'proj-copyboard': '/images/CopyBoard-pf-context.webp',
  'proj-webdev': '/images/tht-cover.webp', 'proj-mc': '/images/mc-pf-context.webp',
};

type Link = { label: string; url: string };

/* The helpers for one project's reader. Internal links go through localize(),
   so a link to a localized page (/, /contact, ...) stays in the reader's
   language; article links are left as they are. */
export function usePeekKit(id: string, labels: PeekLabels) {
  const lang = useLang();
  const href = (url: string) => localize(url, lang);

  const chapter = (num: string, title: string, body: ReactNode) => (
    <section className="hp-rd-chapter" key={num}>
      <span className="hp-rd-ch-num">{num}</span>
      <div className="hp-rd-ch-body"><h4>{title}</h4>{body}</div>
    </section>
  );

  const ext = (url: string) => (/^https?:/.test(url) ? { target: '_blank', rel: 'noopener' } : {});
  const cta = (text: string, sub: string, btnLabel: string, btnUrl: string, ghost?: Link) => (
    <div className="hp-rd-cta">
      <div className="hp-rd-cta-text"><strong>{text}</strong><span>{sub}</span></div>
      <a className="hp-btn" href={href(btnUrl)} {...ext(btnUrl)}>{/^\//.test(btnUrl) ? <IcRead /> : iconForUrl(btnUrl)} {btnLabel}</a>
      {ghost && <a className="hp-btn hp-btn-ghost" href={href(ghost.url)} {...ext(ghost.url)}>{iconForUrl(ghost.url)} {ghost.label}</a>}
    </div>
  );
  /* Projects with no write-up yet: say so plainly instead of linking to a placeholder. */
  const soon = (text: string, sub: string, live?: Link) => (
    <div className="hp-rd-cta is-soon">
      <div className="hp-rd-cta-text"><strong>{text}</strong><span>{sub}</span></div>
      {live && <a className="hp-btn" href={href(live.url)} target="_blank" rel="noopener"><IcScreen /> {live.label}</a>}
      <span className="hp-pf-soon">{labels.soon}</span>
    </div>
  );

  /* The cover image (from COVERS) with the AI-use mark and the project's tags.
     The tag colour follows `type`, never the tag's words, so it survives translation. */
  const hero = (alt: string, tags: string[], type: 'highlight' | 'personal' | 'school' | 'internship') => (
    <div className="hp-rd-hero">
      <img src={COVERS[id]} alt={alt} />
      <div className="hp-rd-hero-tags">
        <AiMark project={id} lang={lang} />
        {tags.map(t => <span key={t} className={`hp-md-tag ${type}`}>{t}</span>)}
      </div>
    </div>
  );

  return { chapter, cta, soon, hero };
}
