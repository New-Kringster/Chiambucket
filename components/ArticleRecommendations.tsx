'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PeekFeed } from './ProjectPeek';
import { IcRead, IcMore } from './Icons';
import AiMark from './AiMark';
import { localize, type Lang } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { ARTICLE_SHELL, type ArticleShellCopy } from '@/lib/articleShell';
import type { RecsCopy, RecsId } from './recs/en';

/*
  "More to explore" at the end of every article. The fixed words are in
  lib/articleShell.ts (every language); the cards' titles, blurbs and image
  alts are in components/recs/<lang>.ts, and only the page's language is
  loaded (CARDS below, rendered on the server too, so the HTML has them).
*/

const SR = () => <svg aria-hidden="true"><use href="#arec-search" /></svg>;
const ST = () => <svg aria-hidden="true"><use href="#arec-star" /></svg>;
const CR = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 18.2h19.2l-1.5-9.4-5.4 3.9L12 4.8 9.3 12.7 3.9 8.8z" /></svg>;

type ProjectType = 'personal' | 'school' | 'internship';

interface Project {
  id: RecsId;
  img: string;
  type: ProjectType;
  highlight?: boolean;
  flagship?: boolean;
  articleUrl: string;
  icons: Array<{ src: string; alt: string }>;
}

/* A project with no write-up yet points at the placeholder page; show it as coming soon instead. */
const soonOf = (p: Project) => p.articleUrl === '/comingsoon';

const ALL_PROJECTS: Project[] = [
  { id: 'proj-waterslop', img: '/images/ocr-reader-pf-context.webp', type: 'personal', flagship: true, articleUrl: '/waterslop', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-june', img: '/images/ProjJuneBanner1.webp', type: 'personal', highlight: true, articleUrl: '/project-june', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-pip', img: '/images/pip-pf-context.webp', type: 'internship', highlight: true, articleUrl: '/pip', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-P4' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/docker-icon.webp', alt: 'Docker' }, { src: '/images/vscode-icon.webp', alt: 'VS Code' }] },
  { id: 'proj-lidar', img: '/images/stackchan-lidar-pf-context.webp', type: 'internship', highlight: true, articleUrl: '/stackchan-lidar', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/blender-icon.webp', alt: 'Blender' }] },
  { id: 'proj-beadreader', img: '/images/beadreader-pf-context.webp', type: 'personal', highlight: true, articleUrl: '/beadreader', icons: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/tailwind-icon.webp', alt: 'Tailwind CSS' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }] },
  { id: 'proj-pantry', img: '/images/pantry-pf-context.webp', type: 'internship', articleUrl: '/pantry', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-ruler', img: '/images/scroll-ruler-pf-context.webp', type: 'internship', articleUrl: '/scroll-ruler', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-cadmouse', img: '/images/cad-mouse-pf-context.webp', type: 'internship', articleUrl: '/cad-mouse', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-lora', img: '/images/borlocator-pf-context.webp', type: 'personal', articleUrl: '/brolocator', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-lumen', img: '/images/lumen-pf-context.webp', type: 'school', articleUrl: '/lumen', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }, { src: '/images/vscode-icon.webp', alt: 'VS Code' }] },
  { id: 'proj-ema', img: '/images/Ema-pf-context.webp', type: 'school', highlight: false, articleUrl: '/csdp', icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-pandus', img: '/images/pandusarticle.webp', type: 'school', highlight: false, articleUrl: '/pandus', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/powerpoint-icon.webp', alt: 'PowerPoint' }] },
  { id: 'proj-elecf', img: '/images/elef2-pf-context.webp', type: 'school', highlight: false, articleUrl: '/elecf', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-kauli', img: '/images/kauli3-pf-context.webp', type: 'school', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/blender-icon.webp', alt: 'Blender' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-sol', img: '/images/Series1l-pf-context.webp', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }] },
  { id: 'proj-copyboard', img: '/images/CopyBoard-pf-context.webp', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/Kicad-icon.webp', alt: 'KiCAD' }] },
  { id: 'proj-webdev', img: '/images/tht-cover.webp', type: 'school', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/chrome-icon.webp', alt: 'Chrome' }, { src: '/images/canva-icon.webp', alt: 'Canva' }] },
  { id: 'proj-mc', img: '/images/mc-pf-context.webp', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/docker-icon.webp', alt: 'Docker' }, { src: '/images/chrome-icon.webp', alt: 'Chrome' }] },
];

type CardsProps = { projects: Project[]; ui: ArticleShellCopy['recs']; lang: Lang; onPeek: (id: string) => void };

function Cards({ projects, ui, lang, onPeek, copy }: CardsProps & { copy: RecsCopy }) {
  return (
    <>
      {projects.map(p => (
        <article
          key={p.id}
          className={`hp-pf-card${p.flagship ? ' is-flagship' : p.highlight ? ' is-highlight' : ' is-compact'}${soonOf(p) ? ' is-soon' : ''}`}
          data-article={soonOf(p) ? undefined : p.articleUrl}
          data-type={p.type}
          data-highlight={p.highlight ? '1' : undefined}
          data-flagship={p.flagship ? '1' : undefined}
        >
          <div className="hp-pf-thumb">
            <button className="hp-pf-peek" onClick={() => onPeek(p.id)} aria-label={ui.peekAria}>
              <span className="hp-pf-peek-pill"><SR />{ui.peek}</span>
            </button>
            <div className="hp-pf-badges">
              <AiMark project={p.id} />
              <span className={`hp-pf-type ${p.type}`}>{ui.types[p.type]}{p.type === 'internship' && <i className="hp-m5" role="img" aria-label={ui.atM5} />}</span>
            </div>
            
            <img src={p.img} alt={copy[p.id].alt} loading="lazy" />
          </div>
          <div className="hp-pf-info">
            <h3 className="hp-pf-name">{copy[p.id].title}</h3>
            <p className="hp-pf-blurb">{copy[p.id].blurb}</p>
            <div className="hp-pf-foot">
              <div className="icon-stack">
                {p.icons.map(ic => <img key={ic.src} src={ic.src} alt={ic.alt} />)}
              </div>
              {soonOf(p)
                ? <span className="hp-pf-soon">{ui.soon}</span>
                : <a className="hp-pf-view" href={localize(p.articleUrl, lang)}><IcRead /> {ui.read}</a>}
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

/* One card grid per language, each loading only its own words. The imports are written out so Next
   renders them on the server and preloads the page's chunk. No Suspense boundary of their own: with one,
   the server streams the cards in after the page instead of in place. */
const bind = (m: { default: RecsCopy }) => {
  const Bound = (p: CardsProps) => <Cards {...p} copy={m.default} />;
  return Bound;
};
const CARDS: Partial<Record<Lang, React.ComponentType<CardsProps>>> = {
  en: dynamic(() => import('./recs/en').then(bind)),
  zh: dynamic(() => import('./recs/zh').then(bind)),
  ja: dynamic(() => import('./recs/ja').then(bind)),
  nl: dynamic(() => import('./recs/nl').then(bind)),
  de: dynamic(() => import('./recs/de').then(bind)),
  ru: dynamic(() => import('./recs/ru').then(bind)),
  fr: dynamic(() => import('./recs/fr').then(bind)),
  es: dynamic(() => import('./recs/es').then(bind)),
};
function LangCards(p: CardsProps) {
  const C = CARDS[p.lang] ?? CARDS.en!;
  return <C {...p} />;
}

export default function ArticleRecommendations({ exclude }: { exclude: string }) {
  const lang = useLang();
  const ui = ARTICLE_SHELL[lang].recs;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnimOpen, setModalAnimOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const openProject = (id: string) => {
    setActiveProject(id);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setModalAnimOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => { setModalOpen(false); setActiveProject(null); }, 320);
  };

  useEffect(() => {
    if (modalOpen) requestAnimationFrame(() => setModalAnimOpen(true));
  }, [modalOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalOpen) closeProject(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [modalOpen]);

  const projects = ALL_PROJECTS.filter(p => p.id !== exclude);
  const visible = showAll ? projects : projects.slice(0, 3);

  return (
    <>
      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="arec-arrow-circle" viewBox="0 0 24 24" fill="none"><path fill="currentColor" clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"/></symbol>
        <symbol id="arec-search" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20.5 20.5l-4-4"/></symbol>
        <symbol id="arec-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z"/></symbol>
      </svg>

      <section className="hp-band arec-section">
        <div className="hp-section">
          <div className="arec-header" data-reveal>
            <span className="hp-eyebrow">{ui.eyebrow}</span>
            <h2>{ui.title}</h2>
          </div>
          <div className="hp-pf-grid">
            <LangCards projects={visible} ui={ui} lang={lang} onPeek={openProject} />
          </div>
          {!showAll && projects.length > 3 && (
            <div className="arec-more">
              <button className="hp-btn hp-btn-ghost" onClick={() => setShowAll(true)}><IcMore /> {ui.more}</button>
            </div>
          )}
        </div>
      </section>

      <div className={`hp-modal${modalAnimOpen ? ' is-open' : ''}`} id="hp-modal-arec" hidden={!modalOpen}>
        <div className="hp-modal-backdrop" onClick={closeProject}></div>
        <div className="hp-modal-panel" role="dialog" aria-modal={true} aria-label={ui.dialog}>
          <button className="hp-modal-close" onClick={closeProject} aria-label={ui.close}>&times;</button>
          <div className="hp-modal-content">
            {activeProject && <PeekFeed key={activeProject} startId={activeProject} exclude={exclude} />}
          </div>
        </div>
      </div>
    </>
  );
}
