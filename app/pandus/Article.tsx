/* The Pandus Dispenser article, rendered in any language: the English page (page.tsx) and
   app/[lang]/pandus/page.tsx both render it. Its words come from ./_copy. */
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import LazyVideo from '../../components/LazyVideo';
import DispenseDemo from './DispenseDemo';
import { IcCube } from '../../components/Icons';
import { loadPandusCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/pandus';
const CAD = 'https://cad.onshape.com/documents/5010f3da2be8b0cad10575b0/w/c1baff5b3751dfe2426baad4/e/d042961855d215532e28db65';
/* the chapter rail, by section id */
const RAIL = ['PromotionalVideo', 'ProjectBackground', 'DesignProcess', 'ControlnFunction', 'Coverimg'] as const;
/* the pictures under the demo, in the order of control.alts */
const CONTROL_IMG = ['pandus4', 'pandus5', 'pandus6', 'pandus7'];

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default async function PandusArticle({ lang }: { lang: Lang }) {
  const c = await loadPandusCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/pandusarticle.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/pandus', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/pandus.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <span className="hp-md-tag school">{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'video', label: c.hero.links.video, url: 'https://youtu.be/fIJQzOhCKQU' },
              { type: 'cad', label: c.hero.links.cad, url: CAD },
            ]}
          />
        </div>
      </header>

      {/* Body */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">{c.chapters}</span>
            <nav className="art-chapters article-chapter-wrapper">
              {RAIL.map((id) => <a key={id} href={`#${id}`}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="PromotionalVideo" className="art-section" data-reveal>
            <h2>{c.video.h}</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad"
                title={c.video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="ProjectBackground" className="art-section" data-reveal>
            <h2>{c.background.h}</h2>
            <p>{c.background.p[0]}</p>
            <p>{c.background.p[1]}</p>
            <figure className="art-fig">
              <img src="/images/pandus-article-img1.webp" alt={c.background.alt} loading="lazy" />
              <figcaption>{c.background.caption}</figcaption>
            </figure>
          </section>

          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>{c.design.h}</h2>
            <p>{c.design.p}</p>
            <img src="/images/pandus2.webp" alt={c.design.explodedAlt} loading="lazy" />
            <img src="/images/pandus3.webp" alt={c.design.assembledAlt} loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.design.cadTitle}</strong>
                <span>{c.design.cadText}</span>
              </div>
              <a className="hp-btn" href={CAD} target="_blank" rel="noopener"><IcCube /> {c.design.cadButton}</a>
            </div>
          </section>

          <section id="ControlnFunction" className="art-section" data-reveal>
            <h2>{c.control.h}</h2>
            <p>{c.control.p[0]}</p>
            <p>{c.control.p[1]}</p>

            <DispenseDemo t={c.demo} />

            {CONTROL_IMG.map((img, i) => <img key={img} src={`/images/${img}.webp`} alt={c.control.alts[i]} loading="lazy" />)}
          </section>

          <section id="Coverimg" className="art-section" data-reveal>
            <h2>{c.cover.h}</h2>
            <p>{c.cover.p}</p>
            <figure className="art-fig">
              <LazyVideo webm="/images/pandus7.webm" mp4="/images/pandus7.mp4" poster="/images/posters/pandus7.webp" />
              <figcaption>{c.cover.caption}</figcaption>
            </figure>
          </section>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-pandus" />
    </main>
  );
}
