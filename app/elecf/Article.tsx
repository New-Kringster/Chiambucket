/* The ELEC-F article, rendered in any language: the English page (page.tsx) and
   app/[lang]/elecf/page.tsx both render it. Its words come from ./_copy. */
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import SafetySequence from './SafetySequence';
import { IcGitHub } from '../../components/Icons';
import { loadElecfCopy } from './_copy';
import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/elecf';
const REPO = 'https://github.com/New-Kringster/ELEC-F-Safe-Fridge-Concept';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Fwd = () => <img src="/images/fwd-arrow.svg" alt="" />;

/* the chapter rail, by section id */
const RAIL = ['Demo', 'Problem', 'Objective', 'HowItWorks', 'Hardware', 'Logic', 'Build', 'Team'] as const;

/* the component cards; their words are keyed by id in the copy */
const COMPONENTS = [
  { id: 'fire', img: '/images/elecf-img.webp', dark: true },
  { id: 'hub', img: '/images/elecf-hub-mini.png' },
  { id: 'tof', img: '/images/elecf-tof.png' },
  { id: 'pir', img: '/images/elecf-pir.png' },
  { id: 'rgb', img: '/images/elecf-rgb.png' },
] as const;

/* the team rows; `me` is Braven's own row, labelled from the copy */
const TEAM = [
  { avatar: 'sadiq-profile', name: 'Md Sadiq', lead: true, href: 'https://www.mdsadiq.cc' },
  { avatar: 'tyr-profile', name: 'Tan Yong Rui', href: 'https://tanyongrui11.framer.website/project/www-pentaclay-com' },
  { avatar: 'braven-profile', me: true, href: '/' },
  { avatar: 'abel-profile', name: 'Abel Goh', href: 'https://frequent-location-124634.framer.app' },
];

export default async function ElecfArticle({ lang }: { lang: Lang }) {
  const c = await loadElecfCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/elecf-img.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : SITE + localize('/elecf', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/elecf.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <span className="hp-md-tag school">{c.hero.tags.school}</span>
            <span className="hp-md-tag personal">{c.hero.tags.team}</span>
          </div>
          <span className="hp-key" style={{ display: 'block', marginBottom: '0.4rem', letterSpacing: '0.2em' }}>{c.hero.key}</span>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="M5Stack" />
              <img src="/images/figma-icon.webp" alt="Figma" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links[0], url: REPO },
              { type: 'video', label: c.hero.links[1], url: 'https://youtu.be/8De2ahk-GPo' },
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
              {RAIL.map((id) => <a key={id} href={`#${id}`}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">

          {/* Demo Video */}
          <section id="Demo" className="art-section" data-reveal>
            <h2>{c.demo.h}</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/8De2ahk-GPo"
                title={c.demo.video}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* The problem */}
          <section id="Problem" className="art-section" data-reveal>
            <h2>{c.problem.h}</h2>
            <p>{c.problem.p1}</p>
            <h3>{c.problem.howH}</h3>
            <ul>
              {c.problem.how.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
            <h3>{c.problem.whyH}</h3>
            <ul>
              {c.problem.why.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
            <p>{c.problem.p2}</p>
          </section>

          {/* Objective */}
          <section id="Objective" className="art-section" data-reveal>
            <h2>{c.goals.h}</h2>
            <ul>
              {c.goals.items.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          </section>

          {/* How it works */}
          <section id="HowItWorks" className="art-section" data-reveal>
            <h2>{c.how.h}</h2>
            <p>{c.how.p1}</p>

            <SafetySequence t={c.seq} />

            <p>{c.how.partsIntro}</p>
            <ul>
              {c.how.parts.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
            <p>{c.how.p2}</p>
          </section>

          {/* Hardware */}
          <section id="Hardware" className="art-section" data-reveal>
            <h2>{c.hardware.h}</h2>
            <p>{c.hardware.p}</p>
            <figure className="art-fig">
              <img src="/images/elecf-controller-sensors.png" alt={c.hardware.figAlt} loading="lazy" />
              <figcaption>{c.hardware.figCaption}</figcaption>
            </figure>

            <div className="ef-comp-grid" data-no-zoom>
              {COMPONENTS.map((p) => {
                const w = c.hardware.components[p.id];
                return (
                  <div key={p.id} className={`ef-comp${'dark' in p && p.dark ? ' dark' : ''}`}>
                    <div className="ef-comp-ico"><img src={p.img} alt="" loading="lazy" /></div>
                    <span className="ef-comp-tag">{w.role}</span>
                    <b>{w.name}</b>
                    <span>{w.desc}</span>
                  </div>
                );
              })}
            </div>

            <figure className="art-fig">
              <img src="/images/elecf-wiring.png" alt={c.hardware.wiringAlt} loading="lazy" />
              <figcaption>{c.hardware.wiringCaption}</figcaption>
            </figure>
          </section>

          {/* Logic */}
          <section id="Logic" className="art-section" data-reveal>
            <h2>{c.logic.h}</h2>
            <p>{c.logic.p}</p>
            <img className="art-diagram" src="/images/elecf-main.avif" alt={c.logic.flowAlt} loading="lazy" />
            <figure className="art-fig">
              <img className="art-diagram" src="/images/elecf-blockdiagram.avif" alt={c.logic.blockAlt} loading="lazy" />
              <figcaption>{c.logic.blockCaption}</figcaption>
            </figure>
          </section>

          {/* The build */}
          <section id="Build" className="art-section" data-reveal>
            <h2>{c.build.h}</h2>
            <p>{c.build.p}</p>
            <div className="art-grid">
              <img src="/images/elecf-prototype2.avif" alt={c.build.alts[0]} loading="lazy" />
              <img src="/images/elecf-prototype3.avif" alt={c.build.alts[1]} loading="lazy" />
            </div>
            <figure className="art-fig">
              <img src="/images/elecf-poster.avif" alt={c.build.posterAlt} loading="lazy" />
              <figcaption>{c.build.posterCaption}</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.build.repo.title}</strong>
                <span>{c.build.repo.text}</span>
              </div>
              <a className="hp-btn" href={REPO} target="_blank" rel="noopener"><IcGitHub /> {c.build.repo.button}</a>
            </div>
          </section>

          {/* Team */}
          <section id="Team" className="art-section" data-reveal>
            <h2>{c.team.h}</h2>
            <div className="art-team">
              {TEAM.map((p) => (
                <div key={p.avatar} className="art-team-row">
                  <div className="art-team-id">
                    <div className={`art-team-avatar ${p.avatar}`}></div>
                    <div><b>{p.me ? c.team.me : p.name}</b><span>{p.lead ? c.team.lead : c.team.member}</span></div>
                  </div>
                  <a className="art-team-link" href={p.me ? localize(p.href, lang) : p.href} target="_blank" rel="noopener">{c.team.profile} <Fwd /></a>
                </div>
              ))}
            </div>
          </section>


        </div>
      </div>
      <ArticleRecommendations exclude="proj-elecf" />

      {/* Scoped styles: components grid */}
      <style>{`
        /* The cover photo is bright cardboard-on-white; deepen the hero scrim on this page
           so the back link and title stay legible, but still fade to transparent at the
           bottom so the hero dissolves into the field (matches the global hero fade). */
        html.sensory-active .art-hero-scrim {
          background: linear-gradient(180deg, rgba(3,4,8,0.82) 0%, rgba(3,4,8,0.44) 32%, rgba(3,4,8,0.6) 68%, rgba(3,4,8,0.76) 85%, transparent 100%); }
        .ef-comp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(148px, 1fr)); gap: 12px; margin: 1.4rem 0; }
        .ef-comp { display: flex; flex-direction: column; gap: 7px; padding: 14px; border-radius: 16px; background: var(--hp-glass); border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease; }
        .ef-comp:hover { transform: translateY(-3px); border-color: rgba(var(--sa-accent, 127,168,255), 0.35); }
        .ef-comp-ico { width: 100%; aspect-ratio: 1; border-radius: 12px; margin-bottom: 3px; display: grid; place-items: center; overflow: hidden; background: radial-gradient(circle at 50% 32%, #f5f6f8, #d7dae1); }
        .ef-comp-ico img { width: 78%; height: 78%; object-fit: contain; }
        .ef-comp.dark .ef-comp-ico { background: radial-gradient(circle at 50% 42%, #181820, #050507); }
        .ef-comp.dark .ef-comp-ico img { width: 96%; height: 96%; }
        .ef-comp-tag { font-family: 'inter'; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hp-sky); font-weight: 700; }
        .ef-comp b { font-family: 'inter'; font-weight: 600; font-size: 0.92rem; color: #ececec; }
        .ef-comp > span:last-child { font-family: 'dmsans'; font-size: 0.78rem; color: var(--hp-ink-dim); line-height: 1.5; }
      `}</style>
    </main>
  );
}
