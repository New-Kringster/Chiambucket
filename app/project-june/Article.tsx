/* The Project June article, rendered in any language: the English page (page.tsx) and
   app/[lang]/project-june/page.tsx both render it. Its words come from ./_copy. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import AiMark from '../../components/AiMark';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LazyVideo from '../../components/LazyVideo';
import CommandLink from './CommandLink';
import { IcGitHub } from '../../components/Icons';
import { loadProjectJuneCopy, type ProjectJuneCopy } from './_copy';
import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/project-june';
const REPO = 'https://github.com/New-Kringster/ProjectJune';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const clip = (n: number) => ({
  webm: `/images/ProjJune${n}.webm`,
  mp4: `/images/ProjJune${n}.mp4`,
  poster: `/images/posters/projjune${n}.webp`,
});

/* the chapter rail: section id, and whether it is a sub-chapter */
const RAIL = [
  ['Demo'], ['ProjectJune'], ['OnboardSys'], ['Ultras', 1], ['Laser', 1], ['Gps', 1], ['IMU', 1], ['Lightsensor', 1], ['Dht11', 1],
  ['TechArch'], ['Livestr'], ['ctrlntelm'], ['Software'], ['softD'], ['Driving'],
] as const;

/* the on-board sensor sections: section id, image number and an optional clip number; their words are keyed by id */
const SENSORS: { id: keyof ProjectJuneCopy['sensors']; img: number; vid?: number }[] = [
  { id: 'Ultras', img: 3, vid: 4 }, { id: 'Laser', img: 5, vid: 6 }, { id: 'Gps', img: 7, vid: 8 }, { id: 'IMU', img: 9, vid: 10 },
  { id: 'Lightsensor', img: 11 }, { id: 'Dht11', img: 12 },
];

export default async function ProjectJuneArticle({ lang }: { lang: Lang }) {
  const c = await loadProjectJuneCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/ProjJuneBanner1.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : SITE + localize('/project-june', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/june.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-june" lang={lang} />
            <span className="hp-md-tag personal">{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
              <img src="/images/Kicad-icon.webp" alt="KiCAD" />
              <img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links[0], url: REPO },
              { type: 'video', label: c.hero.links[1], url: 'https://youtu.be/MnkJsx-nwoE' },
            ]}
          />
        </div>
      </header>

      {/* ── Body ── */}
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
          <section id="Demo" className="art-section" data-reveal>
            <h2>{c.demo.h}</h2>
            <div className="art-video">
              <iframe src="https://www.youtube.com/embed/MnkJsx-nwoE?si=NvIvJadJ0R4rWWwO" title={c.demo.video} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </section>

          <section id="ProjectJune" className="art-section" data-reveal>
            <h2>{c.overview.h}</h2>
            <p>{c.overview.p}</p>
            <figure className="art-fig">
              <img src="/images/ProjJune1.webp" alt={c.overview.alt} loading="lazy" />
              <figcaption>{c.overview.caption}</figcaption>
            </figure>
          </section>

          <section id="OnboardSys" className="art-section" data-reveal>
            <h2>{c.onboard.h}</h2>
            <p>{c.onboard.p}</p>
            <img src="/images/ProjJune2.webp" alt={c.onboard.alt} loading="lazy" />
          </section>

          {SENSORS.map(({ id, img, vid }) => {
            const w = c.sensors[id];
            return (
              <section key={id} id={id} className="art-section" data-reveal>
                <h2>{w.h}</h2>
                <p>{w.p}</p>
                <img src={`/images/ProjJune${img}.webp`} alt={w.alt} loading="lazy" />
                {vid !== undefined && <LazyVideo {...clip(vid)} />}
              </section>
            );
          })}

          <section id="TechArch" className="art-section" data-reveal>
            <h2>{c.arch.h}</h2>
            <p>{c.arch.p}</p>
            <img src="/images/ProjJuneArchi.webp" alt={c.arch.alt} loading="lazy" />
          </section>

          <section id="Livestr" className="art-section" data-reveal>
            <h2>{c.video.h}</h2>
            <p>{c.video.p1}</p>
            <p>{c.video.p2}</p>
            <CommandLink t={c.console} />
            <img src="/images/ProjJune13.webp" alt={c.video.systemAlt} loading="lazy" />
            <img src="/images/ProjJune16.webp" alt={c.video.routingAlt} loading="lazy" />
          </section>

          <section id="ctrlntelm" className="art-section" data-reveal>
            <h2>{c.control.h}</h2>
            <p>{c.control.p1}</p>
            <img src="/images/ProjJune14.webp" alt={c.control.alt1} loading="lazy" />
            <h3>{c.control.packetsH}</h3>
            <p>{c.control.p2}</p>
            <img src="/images/ProjJune15.webp" alt={c.control.alt2} loading="lazy" />
          </section>

          <section id="Software" className="art-section" data-reveal>
            <h2>{c.software.h}</h2>
            <p>{c.software.p}</p>
            <img src="/images/ProjJune17.webp" alt={c.software.alts[0]} loading="lazy" />
            <img src="/images/ProjJune18.webp" alt={c.software.alts[1]} loading="lazy" />
          </section>

          <section id="softD" className="art-section" data-reveal>
            <h2>{c.design.h}</h2>
            <p>{c.design.p}</p>
            <div className="art-embed">
              <iframe src="https://embed.figma.com/design/mcnJbSAA9XGrY8XuUzH60Y/Project-June?node-id=0-1&embed-host=share" title={c.design.embed} loading="lazy" allowFullScreen></iframe>
            </div>
            <h3>{c.design.splineH}</h3>
            <p>{c.design.splineP}</p>
            <figure className="art-fig">
              <img src="/images/ProjJune19.webp" alt={c.design.modelAlt} loading="lazy" />
              <figcaption>{c.design.modelCaption}</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo {...clip(20)} />
              <figcaption>{c.design.viewCaption}</figcaption>
            </figure>
          </section>

          <section id="Driving" className="art-section" data-reveal>
            <h2>{c.driving.h}</h2>
            <p>{c.driving.p}</p>
            <LazyVideo {...clip(21)} />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.driving.repo.title}</strong>
                <span>{c.driving.repo.text}</span>
              </div>
              <a className="hp-btn" href={REPO} target="_blank" rel="noopener"><IcGitHub /> {c.driving.repo.button}</a>
            </div>
          </section>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-june" />
    </main>
  );
}
