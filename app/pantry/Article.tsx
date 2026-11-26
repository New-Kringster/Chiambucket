/* The Pantry Expiry Tracker article, rendered in any language: the English page (page.tsx) and
   app/[lang]/pantry/page.tsx both render it. Its words come from ./_copy. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LazyVideo from '../../components/LazyVideo';
import { Screen } from './Core';
import DemoVideo from './DemoVideo';
import PantrySim from './PantrySim';
import { loadPantryCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';
import './pantry.css';

export const URL = 'https://www.chiambucket.com/pantry';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/pantry/';
const REPO = 'https://github.com/New-Kringster/Pantry_tracker_code';
const M5_BLOG = 'https://shop.m5stack.com/blogs/news/turn-your-fridge-door-into-a-pantry-assistant-with-m5stack-cores3-se';
const BURNER = 'https://burner.m5stack.com/share/firmware/R4VK5Z';
const V = '/videos/pantry/';
/* the chapter rail: section id, and whether it is a sub-chapter */
const RAIL = [['demo'], ['try'], ['features'], ['scan', 1], ['first', 1], ['again', 1], ['swipe', 1], ['pantries', 1], ['control', 1], ['web', 1], ['ha', 1], ['how'], ['hardware'], ['setup']] as const;
const MOMENTS = [0, 45, 69, 78]; // the demo's moments, in seconds
const SHOP = ['https://shop.m5stack.com/products/m5stack-cores3-se-iot-controller-w-o-battery-bottom', 'https://shop.m5stack.com/products/qr-code-scanner-module-13-2'];

/* One feature: the screen (and sometimes a clip of it in the hand) beside a few words. */
function Feature({ id, title, children, media, flip }: { id: string; title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean }) {
  return (
    <section id={id} className={`art-section pt-feat${flip ? ' flip' : ''}`} data-reveal>
      <div className="pt-feat-media">{media}</div>
      <div className="pt-feat-copy"><h3>{title}</h3>{children}</div>
    </section>
  );
}

export default async function PantryArticle({ lang }: { lang: Lang }) {
  const c = await loadPantryCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/pantry-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/pantry', lang),
    about: c.ld.about,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };
  const s = c.setup;

  return (
    <main className="art pt">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-pantry" />
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
              <img src="/images/python-icon.webp" alt="Python" />
              <img src="/images/docker-icon.webp" alt="Docker" />
              <img src="/images/mosquitto-icon.svg" alt="Mosquitto MQTT" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links[0], url: REPO },
              { type: 'read', label: c.hero.links[1], url: M5_BLOG },
              { type: 'download', label: c.hero.links[2], url: BURNER },
              { type: 'download', label: c.hero.links[3], url: REPO + '/releases/latest' },
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
            <PantrySim t={c.sim} />
            <p className="pt-note">{c.try.note}</p>
          </section>

          <section id="features" className="art-section" data-reveal>
            <h2>{c.features.h}</h2>
            <p>{c.features.p}</p>
          </section>

          <Feature id="scan" title={c.scan.h}
            media={<div className="pt-duo"><LazyVideo webm={V + 'scan.webm'} mp4={V + 'scan.mp4'} poster={V + 'scan.webp'} className="pt-clip" /><Screen src={I + 'screen-expiry-picker.webp'} alt={c.scan.alt} /></div>}>
            <p>{c.scan.p1}</p>
            <p>{c.scan.p2}</p>
          </Feature>

          <Feature id="first" title={c.first.h} flip
            media={<Screen src={I + 'screen-home.webp'} alt={c.first.alt} />}>
            <p>{c.first.p}</p>
          </Feature>

          <Feature id="again" title={c.again.h}
            media={<Screen src={I + 'screen-item-detail.webp'} alt={c.again.alt} />}>
            <p>{c.again.p}</p>
          </Feature>

          <Feature id="swipe" title={c.swipe.h} flip
            media={<div className="pt-duo"><LazyVideo webm={V + 'swipe.webm'} mp4={V + 'swipe.mp4'} poster={V + 'swipe.webp'} className="pt-clip" /><Screen src={I + 'screen-swipe-delete.webp'} alt={c.swipe.alt} /></div>}>
            <p>{c.swipe.p}</p>
          </Feature>

          <Feature id="pantries" title={c.pantries.h}
            media={<Screen src={I + 'screen-pantry-menu.webp'} alt={c.pantries.alt} />}>
            <p>{c.pantries.p}</p>
          </Feature>

          <Feature id="control" title={c.control.h} flip
            media={<Screen src={I + 'screen-control-centre.webp'} alt={c.control.alt} />}>
            <p>{c.control.p}</p>
          </Feature>

          <section id="web" className="art-section" data-reveal>
            <h3>{c.web.h}</h3>
            <p>{c.web.p}</p>
            <figure className="art-fig">
              <img src={I + 'web-list.webp'} alt={c.web.alt} loading="lazy" />
              <figcaption>{c.web.caption}</figcaption>
            </figure>
          </section>

          <section id="ha" className="art-section" data-reveal>
            <h3>{c.ha.h}</h3>
            <p>{c.ha.p}</p>
            <figure className="art-fig">
              <img src={I + 'ha-devices.webp'} alt={c.ha.alt} loading="lazy" />
              <figcaption>{c.ha.caption}</figcaption>
            </figure>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>{c.how.h}</h2>
            <p>{c.how.p}</p>
            <figure className="art-fig">
              <img src={I + 'diagram-system-overview.webp'} alt={c.how.overviewAlt} loading="lazy" />
              <figcaption>{c.how.overviewCaption}</figcaption>
            </figure>
            <figure className="art-fig">
              <img src={I + 'diagram-scan-flow.webp'} alt={c.how.flowAlt} loading="lazy" />
              <figcaption>{c.how.flowCaption}</figcaption>
            </figure>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>{c.hardware.h}</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                {c.hardware.parts.map((x, i) => (
                  <li key={i}>{SHOP[i] ? <a href={SHOP[i]} target="_blank" rel="noopener"><b>{x.b}</b></a> : <b>{x.b}</b>}<span>{x.s}</span></li>
                ))}
              </ul>
              <figure className="pt-fridge">
                <img src={I + 'fridge.webp'} alt={c.hardware.fridgeAlt} loading="lazy" />
                <figcaption>{c.hardware.fridgeCaption}</figcaption>
              </figure>
            </div>
            <p>{c.hardware.p}</p>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
            <ol className="pt-steps">
              <li>
                <p>{s.steps[0]}</p>
                <figure className="art-fig"><img src={I + 'diagram-hardware-setup.webp'} alt={s.hardwareAlt} loading="lazy" /></figure>
              </li>
              <li><p>{s.steps[1]}</p></li>
              <li><p>{s.steps[2]}</p></li>
              <li>
                <p>{s.steps[3]}</p>
                <figure className="art-fig"><img src={I + 'diagram-first-boot.webp'} alt={s.bootAlt} loading="lazy" /></figure>
              </li>
              <li>
                <p>{s.steps[4]}</p>
                <figure className="pt-code"><img src={I + 'serial-mode-code.webp'} alt={s.codeAlt} loading="lazy" /></figure>
              </li>
              <li><p>{s.steps[5]}</p></li>
              <li><p>{s.steps[6]}</p></li>
            </ol>
            <p>{s.repo}</p>
            <p className="pt-note">{s.note}</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-pantry" />
    </main>
  );
}
