/* The BeadReader article, rendered in any language: the English page (page.tsx) and
   app/[lang]/beadreader/page.tsx both render it. Its words come from ./_copy. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import AiMark from '../../components/AiMark';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ReadingTogether from './ReadingTogether';
import SpicyGate from './SpicyGate';
import { loadBeadreaderCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/beadreader';
const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader&env=SESSION_SECRET,BOOTSTRAP_ADMIN_CODE&envDescription=SESSION_SECRET%20signs%20the%20login%20cookie%3B%20BOOTSTRAP_ADMIN_CODE%20is%20your%20first%20admin%20login%20code&envLink=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader%23environment-variables&project-name=beadreader&repository-name=beadreader&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6';

/* the chapter rail, by section id */
const RAIL = ['room', 'library', 'together', 'gate', 'books', 'stats', 'instant', 'stack'] as const;

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default async function BeadreaderArticle({ lang }: { lang: Lang }) {
  const c = await loadBeadreaderCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.ld.description,
    image: 'https://www.chiambucket.com/images/beadreader-cover.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/beadreader', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero br-hero">
        <div className="art-hero-bg"><img src="/images/covers/beadreader.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-beadreader" />
            <span className="hp-md-tag personal">{c.hero.tag}</span>
          </div>
          {/* On desktop the cover art carries the BeadReader wordmark, so this title is
              hidden there (kept for SEO/a11y). On phones the wide promo crops out its own
              wordmark, so the title becomes visible and leads instead. */}
          <h1 className="art-title br-hero-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/nextjs-icon.webp" alt="Next.js" />
              <img src="/images/typescript-icon.webp" alt="TypeScript" />
              <img src="/images/supabase-icon.webp" alt="Supabase" />
              <img src="/images/tailwind-icon.webp" alt="Tailwind CSS" />
              <img src="/images/cloudflare-icon.webp" alt="Cloudflare R2" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: c.hero.links.github, url: 'https://github.com/New-Kringster/BeadReader' },
              { type: 'demo', label: c.hero.links.deploy, url: DEPLOY_URL },
            ]}
          />
        </div>
      </header>

      <style>{`
        /* Desktop: the promo cover shows its own wordmark, so the h1 is hidden
           (present for SEO/a11y). The image is nudged so the wordmark clears the nav. */
        .br-hero .art-hero-bg img { object-position: center 22%; }
        .br-hero .br-hero-title { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
        /* Phones: the promo wordmark is too wide to fit a phone screen, so zoom the
           backdrop into the phone mockups (pushing the baked wordmark out of frame)
           and let the real gradient title lead instead. */
        @media (max-width: 760px) {
          .br-hero .art-hero-bg img { object-position: center; transform: scale(1.75); transform-origin: 66% 84%; }
          .br-hero .br-hero-title { position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal; border: 0; }
        }
      `}</style>

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

          <section id="room" className="art-section" data-reveal>
            <h2>{c.room.h}</h2>
            <p>{c.room.p[0]}</p>
            <p>{c.room.p[1]}</p>
            <figure className="art-fig">
              <img src="/images/beadreader/login-light.webp" alt={c.room.alt} loading="lazy" />
              <figcaption>{c.room.caption}</figcaption>
            </figure>
          </section>

          <section id="library" className="art-section" data-reveal>
            <h2>{c.library.h}</h2>
            <p>{c.library.p[0]}</p>
            <p>{c.library.p[1]}</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/reader-paper.webp" alt={c.library.figs[0].alt} loading="lazy" />
                <figcaption>{c.library.figs[0].caption}</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/contents-light.webp" alt={c.library.figs[1].alt} loading="lazy" />
                <figcaption>{c.library.figs[1].caption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="together" className="art-section" data-reveal>
            <h2>{c.together.h}</h2>
            <p>{c.together.p[0]}</p>
            <p>{c.together.p[1]}</p>
            <ReadingTogether t={c.presence} />
            <figure className="art-fig">
              <img src="/images/posters/br-online.webp" alt={c.together.alt} loading="lazy" />
              <figcaption>{c.together.caption}</figcaption>
            </figure>
          </section>

          <section id="gate" className="art-section" data-reveal>
            <h2>{c.gate.h}</h2>
            <p>{c.gate.p[0]}</p>
            <p>{c.gate.p[1]}</p>
            <SpicyGate t={c.spicyGate} />
            <figure className="art-fig">
              <img src="/images/beadreader/contents-dark.webp" alt={c.gate.alt} loading="lazy" />
              <figcaption>{c.gate.caption}</figcaption>
            </figure>
          </section>

          <section id="books" className="art-section" data-reveal>
            <h2>{c.books.h}</h2>
            <p>{c.books.p[0]}</p>
            <p>{c.books.p[1]}</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/admin-books-light.webp" alt={c.books.figs[0].alt} loading="lazy" />
                <figcaption>{c.books.figs[0].caption}</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/webtoon.webp" alt={c.books.figs[1].alt} loading="lazy" />
                <figcaption>{c.books.figs[1].caption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="stats" className="art-section" data-reveal>
            <h2>{c.stats.h}</h2>
            <p>{c.stats.p[0]}</p>
            <p>{c.stats.p[1]}</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/stats-overview-light.webp" alt={c.stats.figs[0].alt} loading="lazy" />
                <figcaption>{c.stats.figs[0].caption}</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/stats-detail-light.webp" alt={c.stats.figs[1].alt} loading="lazy" />
                <figcaption>{c.stats.figs[1].caption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="instant" className="art-section" data-reveal>
            <h2>{c.instant.h}</h2>
            <p>{c.instant.p[0]}</p>
            <p>{c.instant.p[1]}</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/account-light.webp" alt={c.instant.figs[0].alt} loading="lazy" />
                <figcaption>{c.instant.figs[0].caption}</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/changelog-light.webp" alt={c.instant.figs[1].alt} loading="lazy" />
                <figcaption>{c.instant.figs[1].caption}</figcaption>
              </figure>
            </div>
          </section>

          <section id="stack" className="art-section" data-reveal>
            <h2>{c.stack.h}</h2>
            <p>{c.stack.p[0]}</p>
            <p>{c.stack.p[1]}</p>
          </section>

        </div>
      </div>

      <ArticleRecommendations exclude="proj-beadreader" />
    </main>
  );
}
