/* The 3D CAD Mouse article, rendered in any language: the English page (page.tsx) and
   app/[lang]/cad-mouse/page.tsx both render it. Its words come from ./_copy. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import DemoVideo from '../pantry/DemoVideo';
import CadSim from './CadSim';
import { loadCadMouseCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';
import '../pantry/pantry.css';
import './cad-mouse.css';

export const URL = 'https://www.chiambucket.com/cad-mouse';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/cad-mouse/';
const V = '/videos/cad-mouse/';
const CAPSULE = 'https://docs.m5stack.com/en/core/Capsule';
/* the chapter rail: section id, and whether it is a sub-chapter */
const RAIL = [['demo'], ['try'], ['use'], ['how'], ['spacemouse', 1], ['turning', 1], ['stopping', 1], ['hardware'], ['setup']] as const;
const MOMENTS = [0, 5, 9, 13]; // the demo's moments, in seconds

export default async function CadMouseArticle({ lang }: { lang: Lang }) {
  const c = await loadCadMouseCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/cad-mouse-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/cad-mouse', lang),
    about: c.ld.about,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art pt cm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-cadmouse" />
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
            </div>
          </div>
          <div className="art-links">
            <span className="art-link cm-burner" role="link" aria-disabled="true" title={c.hero.burnerTitle}>
              <img src={I + 'm5burner.png'} alt="" width={18} height={18} />
              <span>{c.hero.burner}</span>
              <small>{c.hero.burnerSoon}</small>
            </span>
          </div>
          <p className="pt-meta">{c.hero.meta}</p>
        </div>
      </header>

      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">{c.chapters}</span>
            <nav className="art-chapters article-chapter-wrapper">
              {RAIL.map(([id, sub]) => <a key={id} href={`#${id}`} className={sub ? 'sub' : undefined}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="demo" className="art-section" data-reveal>
            <h2>{c.demo.h}</h2>
            <p>{c.demo.p}</p>
            <DemoVideo base={V} label={c.demo.video} moments={MOMENTS.map((t, i) => ({ t, ...c.demo.moments[i] }))} />
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>{c.try.h}</h2>
            <p>{c.try.p}</p>
            <CadSim t={c.sim} />
            <p className="pt-note">{c.try.note}</p>
          </section>

          <section id="use" className="art-section" data-reveal>
            <h2>{c.use.h}</h2>
            <p>{c.use.p1}</p>
            <ul className="pt-parts">
              {c.use.parts.map((x) => <li key={x.b}><b>{x.b}</b><span>{x.s}</span></li>)}
            </ul>
            <p>{c.use.p2}</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>{c.how.h}</h2>
            <p>{c.how.p}</p>
          </section>

          <section id="spacemouse" className="art-section" data-reveal>
            <h3>{c.spacemouse.h}</h3>
            <p>{c.spacemouse.p}</p>
          </section>

          <section id="turning" className="art-section" data-reveal>
            <h3>{c.turning.h}</h3>
            <p>{c.turning.p1}</p>
            <p>{c.turning.p2}</p>
          </section>

          <section id="stopping" className="art-section" data-reveal>
            <h3>{c.stopping.h}</h3>
            <p>{c.stopping.p1}</p>
            <p>{c.stopping.p2}</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>{c.hardware.h}</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                {c.hardware.parts.map((x, i) => (
                  <li key={i}>{i === 0 ? <a href={CAPSULE} target="_blank" rel="noopener"><b>{x.b}</b></a> : <b>{x.b}</b>}<span>{x.s}</span></li>
                ))}
              </ul>
              <figure className="cm-hold">
                <img src={I + 'hold.webp'} alt={c.hardware.holdAlt} loading="lazy" />
                <figcaption>{c.hardware.holdCaption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>{c.setup.h}</h2>
            <ol className="pt-steps">
              {c.setup.steps.map((s, i) => <li key={i}><p>{s}</p></li>)}
            </ol>
            <p className="pt-note">{c.setup.note}</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-cadmouse" />
    </main>
  );
}
