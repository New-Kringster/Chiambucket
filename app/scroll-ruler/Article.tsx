/* The Scroll Ruler article, rendered in any language: the English page (page.tsx) and
   app/[lang]/scroll-ruler/page.tsx both render it. Its words come from ./_copy. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import DemoVideo from '../pantry/DemoVideo';
import { Atom, Screen } from './Atom';
import RulerSim from './RulerSim';
import { loadScrollRulerCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';
import '../pantry/pantry.css';
import './scroll-ruler.css';

export const URL = 'https://www.chiambucket.com/scroll-ruler';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/scroll-ruler/';
const V = '/videos/scroll-ruler/';
const REPO = 'https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler';
const FLASHDECK = 'https://flashdeck.shebang.pro/';
const PER10 = 49; // steps the device counted for 10 cm in the demo
/* the chapter rail: section id, and whether it is a sub-chapter */
const RAIL = [['demo'], ['try'], ['use'], ['measure', 1], ['calibrate', 1], ['steps', 1], ['how'], ['hardware'], ['setup']] as const;
const MOMENTS = [0, 13, 25, 38]; // the demo's moments, in seconds
const SHOP = ['https://shop.m5stack.com/products/atoms3r-dev-kit', 'https://shop.m5stack.com/products/atomic-battery-base-200mah', 'https://docs.m5stack.com/en/unit/UNIT-Scroll'];

function Feature({ id, title, children, media, flip }: { id: string; title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean }) {
  return (
    <section id={id} className={`art-section pt-feat sr-feat${flip ? ' flip' : ''}`} data-reveal>
      <div className="pt-feat-media sr-feat-media">{media}</div>
      <div className="pt-feat-copy"><h3>{title}</h3>{children}</div>
    </section>
  );
}

export default async function ScrollRulerArticle({ lang }: { lang: Lang }) {
  const c = await loadScrollRulerCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/scroll-ruler-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/scroll-ruler', lang),
    about: c.ld.about,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art pt sr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-ruler" />
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links[0], url: REPO },
              { type: 'download', label: c.hero.links[1], url: FLASHDECK },
            ]}
          />
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
            <RulerSim t={c.sim} />
            <p className="pt-note">{c.try.note}</p>
          </section>

          <section id="use" className="art-section" data-reveal>
            <h2>{c.use.h}</h2>
            <p>{c.use.p}</p>
          </section>

          <Feature id="measure" title={c.measure.h}
            media={<figure className="sr-screens" style={{ maxWidth: 240 }}><Atom label={c.measure.screen}><Screen s={{ mode: 'measuring', pressed: true, steps: 20, calSteps: 0, per10cm: PER10 }} /></Atom></figure>}>
            <p>{c.measure.p1}</p>
            <p>{c.measure.p2}</p>
          </Feature>

          <Feature id="calibrate" title={c.calibrate.h} flip
            media={<div className="sr-screens">
              <figure><Atom label={c.calibrate.rolling}><Screen s={{ mode: 'calibrating', pressed: true, steps: 0, calSteps: PER10, per10cm: 0 }} /></Atom><figcaption>{c.calibrate.rollingCaption}</figcaption></figure>
              <figure><Atom label={c.calibrate.checking}><Screen s={{ mode: 'confirming', pressed: false, steps: 0, calSteps: PER10, per10cm: 0 }} /></Atom><figcaption>{c.calibrate.checkingCaption}</figcaption></figure>
            </div>}>
            <p>{c.calibrate.p1}</p>
            <p>{c.calibrate.p2}</p>
          </Feature>

          <section id="steps" className="art-section" data-reveal>
            <h3>{c.steps.h}</h3>
            <p>{c.steps.p}</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>{c.how.h}</h2>
            <p>{c.how.p1}</p>
            <p>{c.how.p2}</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>{c.hardware.h}</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                {c.hardware.parts.map((x, i) => (
                  <li key={i}><a href={SHOP[i]} target="_blank" rel="noopener"><b>{x.b}</b></a><span>{x.s}</span></li>
                ))}
              </ul>
              <figure className="sr-photo">
                <img src={I + 'reading.webp'} alt={c.hardware.photoAlt} loading="lazy" />
                <figcaption>{c.hardware.photoCaption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>{c.setup.h}</h2>
            <ol className="pt-steps">
              {c.setup.steps.map((s, i) => <li key={i}><p>{s}</p></li>)}
            </ol>
            <p>{c.setup.repo}</p>
            <p className="pt-note">{c.setup.note}</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-ruler" />
    </main>
  );
}
