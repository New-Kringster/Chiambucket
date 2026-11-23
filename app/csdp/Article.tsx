/* The EMA Smart Home article, rendered in any language: the English page (page.tsx) and
   app/[lang]/csdp/page.tsx both render it. Its words come from ./_copy. */
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import AiMark from '../../components/AiMark';
import LazyVideo from '../../components/LazyVideo';
import NodeMap from './NodeMap';
import { IcGitHub } from '../../components/Icons';
import PdfEmbed from '../../components/PdfEmbed';
import { loadCsdpCopy } from './_copy';
import { fill } from '@/lib/fill';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/csdp';
const REPO = 'https://github.com/New-Kringster/EMA-Smart-home-System';
const DEMO = 'https://csdpdemo.chiambucket.com';
const SLIDES = 'https://content.chiambucket.com/downloadable/csdpf1.pdf';
const DOCS = 'https://content.chiambucket.com/downloadable/csdpf2.pdf';

/* the chapter rail: section id, and whether it is a sub-chapter */
const RAIL = [
  ['PromoVideo'], ['Team'], ['ProjBackground'], ['DesignProcess'],
  ['Climate', 1], ['Bathroom', 1], ['Kitchen', 1], ['Intrusion', 1],
  ['Connectivity'], ['SlideDeck'], ['Documentation'],
] as const;
/* the team rows, in order: name, avatar class and profile link (null: no profile).
   Their parts are copy (team.roles); my own row is marked with team.me. */
const TEAM: { name: string; avatar: string; href: string | null; me?: true }[] = [
  { name: 'Tan Yong Rui', avatar: 'tyr-profile', href: 'https://tanyongrui11.framer.website/project/www-pentaclay-com' },
  { name: 'Braven Chiam', avatar: 'braven-profile', href: '/', me: true },
  { name: 'Ong Zheng Xian', avatar: 'zx-profile', href: 'https://www.ongkian.com' },
  { name: 'Joycelyn Wong', avatar: 'jyc-profile', href: 'https://joycelynwong.framer.website/projects/ema' },
  { name: 'Benjamin Lee', avatar: '', href: null },
];
const NODE_IMG = { Climate: 'csdp5', Bathroom: 'csdp6', Kitchen: 'csdp7', Intrusion: 'csdp8' } as const;

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default async function CsdpArticle({ lang }: { lang: Lang }) {
  const c = await loadCsdpCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/Ema-pf-context.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/csdp', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/ema.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-ema" />
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
              <img src="/images/figma-icon.webp" alt="Figma" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'demo', label: c.hero.links.demo, url: DEMO },
              { type: 'github', label: c.hero.links.github, url: REPO },
              { type: 'video', label: c.hero.links.video, url: 'https://youtu.be/PFhsRaakJAs' },
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
              {RAIL.map(([id, sub]) => <a key={id} href={`#${id}`} className={sub ? 'sub' : undefined}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">

          <section id="PromoVideo" className="art-section" data-reveal>
            <h2>{c.video.h}</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/PFhsRaakJAs?si=t2kIXeFsMyZwU73l"
                title={c.video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* Team */}
          <section id="Team" className="art-section" data-reveal>
            <h2>{c.team.h}</h2>
            <div className="art-team">
              {TEAM.map((p, i) => (
                <div className="art-team-row" key={p.name}>
                  <div className="art-team-id">
                    <div className={p.avatar ? `art-team-avatar ${p.avatar}` : 'art-team-avatar'}></div>
                    <div>
                      <b>{p.me ? fill(c.team.me, { name: p.name }) : p.name}</b>
                      <span>{c.team.roles[i]}</span>
                    </div>
                  </div>
                  {p.href ? (
                    <a
                      className="art-team-link"
                      href={localize(p.href, lang)}
                      target="_blank"
                      rel="noopener"
                    >
                      {c.team.profile} <img src="/images/fwd-arrow.svg" alt="" />
                    </a>
                  ) : (
                    <span className="art-team-link is-disabled">{c.team.noProfile}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="ProjBackground" className="art-section" data-reveal>
            <h2>{c.brief.h}</h2>
            <p>{c.brief.p}</p>
            <figure className="art-fig">
              <img src="/images/csdp1.webp" alt={c.brief.alt} loading="lazy" />
              <figcaption>{c.brief.caption}</figcaption>
            </figure>
          </section>

          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>{c.dashboard.h}</h2>
            <p>{c.dashboard.p}</p>
            <figure className="art-fig">
              <img src="/images/csdp2.webp" alt={c.dashboard.mockAlt} loading="lazy" />
              <figcaption>{c.dashboard.mockCaption}</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo webm="/images/csdp3.webm" mp4="/images/csdp3.mp4" poster="/images/posters/csdp3.webp" />
              <figcaption>{c.dashboard.finishedCaption}</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo webm="/images/csdp4.webm" mp4="/images/csdp4.mp4" poster="/images/posters/csdp4.webp" />
              <figcaption>{c.dashboard.splineCaption}</figcaption>
            </figure>
          </section>

          {(Object.keys(NODE_IMG) as (keyof typeof NODE_IMG)[]).map((id) => (
            <section key={id} id={id} className="art-section" data-reveal>
              <h2>{c.nodes[id].h}</h2>
              <p>{c.nodes[id].p}</p>
              <img src={`/images/${NODE_IMG[id]}.webp`} alt={c.nodes[id].alt} loading="lazy" />
            </section>
          ))}

          <section id="Connectivity" className="art-section" data-reveal>
            <h2>{c.connectivity.h}</h2>
            <p>{c.connectivity.p[0]}</p>
            <p>{c.connectivity.p[1]}</p>
            <NodeMap t={c.nodeMap} />
            <figure className="art-fig">
              <img src="/images/csdp9.webp" alt={c.connectivity.diagramAlt} loading="lazy" />
              <figcaption>{c.connectivity.diagramCaption}</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>{c.connectivity.repoTitle}</strong>
                <span>{c.connectivity.repoText}</span>
              </div>
              <a className="hp-btn" href={REPO} target="_blank" rel="noopener"><IcGitHub /> {c.connectivity.repoButton}</a>
            </div>
          </section>

          <section id="SlideDeck" className="art-section" data-reveal>
            <h2>{c.slides.h}</h2>
            <div className="art-embed art-pdf">
              <PdfEmbed src={SLIDES} title={c.slides.title} />
            </div>
            <p><a href={SLIDES} target="_blank" rel="noopener">{c.slides.open}</a></p>
          </section>

          <section id="Documentation" className="art-section" data-reveal>
            <h2>{c.docs.h}</h2>
            <div className="art-embed art-pdf">
              <PdfEmbed src={DOCS} title={c.docs.title} />
            </div>
            <p><a href={DOCS} target="_blank" rel="noopener">{c.docs.open}</a></p>
          </section>


        </div>
      </div>
      <ArticleRecommendations exclude="proj-ema" />
    </main>
  );
}
