/* The Stack-chan LiDAR article, rendered in any language: the English page (page.tsx) and
   app/[lang]/stackchan-lidar/page.tsx both render it. Its words come from ./_copy. */
import type { CSSProperties, ReactNode } from 'react';
import { Figtree } from 'next/font/google';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LidarStory, { type Chapter } from './LidarStory';
import LidarVideo from './LidarVideo';
import PlyPlayground from './PlyPlayground';
import { loadLidarCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';
import './lidar.css';

const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--ls-sans', display: 'swap' });

export const URL = 'https://www.chiambucket.com/stackchan-lidar';

const I = '/images/stackchan-lidar/';
const FLASHDECK = 'https://flashdeck.shebang.pro/';

/* The chapters in order; their names are copy.chapters. */
const CHAPTERS = ['top', 'sweep', 'colour', 'demo', 'play', 'setup'] as const;
/* The demo's moments, in seconds (their words are copy.demo.moments, in the same order). */
const MOMENTS = [4, 24, 34, 52];

/** A caption inside a pinned chapter, shown while the chapter's --t is between a and b. */
function Cap({ a, b, n, title, children }: { a: number; b: number; n?: string; title: string; children: ReactNode }) {
  return (
    <div className="ls-cap" style={{ '--a': a, '--b': b } as CSSProperties}>
      {n && <span className="ls-num">{n}</span>}
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default async function LidarArticle({ lang }: { lang: Lang }) {
  const c = await loadLidarCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/stackchan-lidar-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/stackchan-lidar', lang),
    about: c.ld.about,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };
  const chapters: Chapter[] = CHAPTERS.map((id) => ({ id, name: c.chapters[id] }));
  const [sw1, sw2] = c.sweep.caps;
  const [co1, co2] = c.colour.caps;

  return (
    <main className={`ls ${sans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LidarStory chapters={chapters} label={c.chaptersLabel} />

      {/* ── Meet: Stack-chan close up beside the title; at the end the camera swings behind it ── */}
      <header className="ls-pin is-meet" data-shot="meet" id="top">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-meet.webp'} alt={c.hero.alt} />
          <div className="ls-intro">
            <a className="ls-back" href={localize('/#projects', lang)}>{c.hero.back}</a>
            <div className="ls-tags">
              <AiMark project="proj-lidar" />
              <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />{c.hero.tag}</span>
              <span className="hp-md-tag ls-feat">{c.hero.featured}</span>
            </div>
            <h1 className="ls-title">{c.hero.title}</h1>
            <p className="ls-lead">{c.hero.lead}</p>
            <div className="ls-toolrow">
              <span>{c.hero.builtWith}</span>
              <div className="icon-stack">
                <img src="/images/esp-icon.webp" alt="ESP32-S3" />
                <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
                <img src="/images/blender-icon.webp" alt="Blender" />
              </div>
            </div>
            <ArticleLinks links={[{ type: 'download', label: c.hero.flash, url: FLASHDECK }]} />
            <p className="ls-meta">{c.hero.meta}</p>
          </div>
          <div className="ls-cue" aria-hidden="true"><span>{c.hero.cue}</span><i /></div>
        </div>
      </header>

      {/* ── The sweep: the real scan fills in as the head pans across ── */}
      <section className="ls-pin is-sweep" data-shot="sweep" id="sweep">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-sweep.webp'} alt={c.sweep.alt} />
          <Cap a={0.04} b={0.5} n="01" title={sw1.title}>
            <p>{sw1.p}</p>
          </Cap>
          <Cap a={0.5} b={1.05} title={sw2.title}>
            <p>{sw2.p}</p>
          </Cap>
        </div>
      </section>

      {/* ── Colour: depth fades into the photos' colours as the view pulls back ── */}
      <section className="ls-pin is-colour" data-shot="colour" id="colour">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-colour.webp'} alt={c.colour.alt} />
          <Cap a={0.06} b={0.55} n="02" title={co1.title}>
            <p>{co1.p}</p>
          </Cap>
          <Cap a={0.55} b={1.05} title={co2.title}>
            <p>{co2.p}</p>
          </Cap>
        </div>
      </section>

      {/* ── The rest of the page scrolls over the finished room ── */}
      <div className="ls-flow" data-shot="rest">
        <section id="demo" className="ls-block is-wide">
          <h2>{c.demo.h}</h2>
          <p>{c.demo.p}</p>
          <LidarVideo base="/videos/stackchan-lidar/" label={c.demo.video} moments={c.demo.moments.map((m, i) => ({ t: MOMENTS[i], ...m }))} />
        </section>

        <section id="play" className="ls-block is-wide">
          <h2>{c.play.h}</h2>
          <PlyPlayground still={I + 'cloud.webp'} stillAlt={c.play.stillAlt} t={c.pg} />
        </section>

        <section id="setup" className="ls-block">
          <h2>{c.setup.h}</h2>
          <div className="ls-hw">
            <ul className="ls-parts">
              {c.setup.parts.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <figure className="ls-photo">
              <img src={I + 'cover.webp'} alt={c.setup.photoAlt} loading="lazy" />
              <figcaption>{c.setup.photoCaption}</figcaption>
            </figure>
          </div>
          <ol className="ls-steps">
            {c.setup.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <p className="ls-note">{c.setup.note}</p>
        </section>
      </div>

      <ArticleRecommendations exclude="proj-lidar" />
    </main>
  );
}
