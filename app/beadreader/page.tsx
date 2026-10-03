import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ReadingTogether from './ReadingTogether';
import SpicyGate from './SpicyGate';

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader&env=SESSION_SECRET,BOOTSTRAP_ADMIN_CODE&envDescription=SESSION_SECRET%20signs%20the%20login%20cookie%3B%20BOOTSTRAP_ADMIN_CODE%20is%20your%20first%20admin%20login%20code&envLink=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader%23environment-variables&project-name=beadreader&repository-name=beadreader&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6';

export const metadata: Metadata = {
  title: 'BeadReader | Braven Chiam',
  description:
    'A private, invite-only book reader: access-code login, per-reader resume and themes, live presence, a content gate enforced in SQL, webtoons and shared reading stats. Built with Next.js, Supabase and Cloudflare R2.',
  alternates: { canonical: 'https://www.chiambucket.com/beadreader' },
  openGraph: {
    title: 'BeadReader | Braven Chiam',
    description:
      'A private, invite-only book reader with live presence, per-reader resume, a content gate enforced in SQL, webtoons and shared reading stats.',
    url: 'https://www.chiambucket.com/beadreader',
    type: 'article',
    images: [{ url: '/images/beadreader-cover.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BeadReader',
  description:
    'A private, invite-only online book reader built with Next.js, Supabase and Cloudflare R2: access-code auth with an HMAC-signed cookie, per-reader resume and themes, live presence, an explicit-content gate enforced in SQL, webtoons and a shared reading-stats dashboard.',
  image: 'https://www.chiambucket.com/images/beadreader-cover.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/beadreader',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function BeadReaderPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero br-hero">
        <div className="art-hero-bg"><img src="/images/beadreader-cover.webp" alt="BeadReader on three phones: the login screen, a chapter and the stats page" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag personal">Personal project</span>
          </div>
          {/* On desktop the cover art carries the BeadReader wordmark, so this title is
              hidden there (kept for SEO/a11y). On phones the wide promo crops out its own
              wordmark, so the title becomes visible and leads instead. */}
          <h1 className="art-title br-hero-title">Bead<em>Reader</em></h1>
          <p className="art-lead">A private online book reader for a few friends. The admin publishes books in Markdown or as image webtoons, readers log in with one access code, and the app remembers where each reader stopped. Readers can see who else is reading, send a wave or a short note, and compare progress on a shared stats dashboard.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
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
              { type: 'github', label: 'GitHub', url: 'https://github.com/New-Kringster/BeadReader' },
              { type: 'demo', label: 'Deploy your own', url: DEPLOY_URL },
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
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#room">Private access</a>
              <a href="#library">Resume and themes</a>
              <a href="#together">Reading together</a>
              <a href="#gate">The spicy gate</a>
              <a href="#books">Text and webtoons</a>
              <a href="#stats">Reading stats</a>
              <a href="#instant">Offline and updates</a>
              <a href="#stack">The stack</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          <section id="room" className="art-section" data-reveal>
            <h2>Private access</h2>
            <p>BeadReader is a private library for one admin and a few readers. There are no passwords and no sign-up. One access code is your identity: it decides whether you are the admin or a reader, and whether you can see explicit chapters. Enter it once and a signed cookie keeps you logged in.</p>
            <p>The admin creates a reader and hands them a code. Revoke the code and they are out on their next request.</p>
            <figure className="art-fig">
              <img src="/images/beadreader/login-light.webp" alt="The BeadReader login screen with one access code field" loading="lazy" />
              <figcaption>The login screen. One code sets identity, role and content access.</figcaption>
            </figure>
          </section>

          <section id="library" className="art-section" data-reveal>
            <h2>Resume and themes</h2>
            <p>Opening a book jumps back to the chapter and scroll position you last reached. Position is stored as a fraction of the chapter, not a pixel offset, so it survives a font size change. Stop mid-paragraph on your phone and you land in the same place on a laptop.</p>
            <p>Background and text colour, font size and a scroll or paginated layout are saved per reader. The contents page marks each chapter you have opened, shows a progress bar on the one in progress, and lets you mark a chapter unread.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/reader-paper.webp" alt="The reading view in the paper theme" loading="lazy" />
                <figcaption>The reading view, paper theme.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/contents-light.webp" alt="A book's contents with per-reader progress" loading="lazy" />
                <figcaption>Contents with read tracking and a progress bar.</figcaption>
              </figure>
            </div>
          </section>

          <section id="together" className="art-section" data-reveal>
            <h2>Reading together</h2>
            <p>From the library you can see who else is online. Inside a book, the avatars of online readers sit at the top, each with a green dot. If a friend is in the same book, their avatar gets a green ring and their chapter number.</p>
            <p>Tap the avatars to send a wave or a short note. It shows on the other reader&apos;s screen for a few seconds and is not saved. Everyone can upload a profile photo, cropped and compressed in the browser, and anyone can turn on a privacy toggle to read invisibly.</p>
            <ReadingTogether />
            <figure className="art-fig">
              <img src="/images/posters/br-online.webp" alt="The menu for sending a wave or a note" loading="lazy" />
              <figcaption>The menu for sending a wave or a short note.</figcaption>
            </figure>
          </section>

          <section id="gate" className="art-section" data-reveal>
            <h2>The spicy gate</h2>
            <p>Some chapters, or passages inside a chapter, are marked explicit. Access is per reader and enforced in the database query. A reader without access never receives the gated text, not even hidden in the response, so it cannot be pulled from the raw API.</p>
            <p>The same chapter changes with the reader. With access, you get a blurred passage that clears on a tap. Without access, you see a locked preview with a note to request it. In cal mode, every explicit passage is removed, with no markers and no pepper icon.</p>
            <SpicyGate />
            <figure className="art-fig">
              <img src="/images/beadreader/contents-dark.webp" alt="A contents list with an explicit chapter marked" loading="lazy" />
              <figcaption>Explicit chapters carry a marker for readers who can see them and are hidden from readers who cannot.</figcaption>
            </figure>
          </section>

          <section id="books" className="art-section" data-reveal>
            <h2>Text and webtoons</h2>
            <p>A book is either text or a webtoon, chosen when it is created. Text books are written in Markdown with a side-by-side preview, and each chapter has its own draft and published state.</p>
            <p>For a webtoon, the admin picks a numbered image folder, previews its order and uploads straight from the browser to Cloudflare R2 with short-lived signed URLs. Readers get a gapless vertical strip with the same resume, tracking and gating as text.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/admin-books-light.webp" alt="The admin books list" loading="lazy" />
                <figcaption>The admin books list: text and webtoon books, draft and published.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/webtoon.webp" alt="A webtoon chapter as a gapless vertical strip" loading="lazy" />
                <figcaption>A webtoon chapter as one vertical strip.</figcaption>
              </figure>
            </div>
          </section>

          <section id="stats" className="art-section" data-reveal>
            <h2>Reading stats</h2>
            <p>Readers who share their activity appear on a common dashboard: total hours, books finished and reading streaks. A histogram shows what time of day people read, day by day, and tapping a reader opens a per-book, per-chapter breakdown of their time.</p>
            <p>Reading time only counts while you are reading. It pauses when the tab loses focus or you go idle.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/stats-overview-light.webp" alt="The reading-stats overview" loading="lazy" />
                <figcaption>The overview, with streaks.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/stats-detail-light.webp" alt="A per-reader stats breakdown" loading="lazy" />
                <figcaption>One reader, per book and per chapter.</figcaption>
              </figure>
            </div>
          </section>

          <section id="instant" className="art-section" data-reveal>
            <h2>Offline and updates</h2>
            <p>A service worker caches covers, artwork and static files on the device, never HTML or API responses, and the reader preloads the next chapter, so pages open fast and use less data. The Account page shows what is cached and how much space it uses, with one button to clear it.</p>
            <p>A public changelog and a once-per-version what&apos;s-new popup explain new features. When a newer build ships, a refresh prompt appears, based on the deploy rather than the database.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/account-light.webp" alt="The account and storage panel" loading="lazy" />
                <figcaption>Account and on-device storage, with a clear-all button.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/changelog-light.webp" alt="The in-app changelog" loading="lazy" />
                <figcaption>The changelog.</figcaption>
              </figure>
            </div>
          </section>

          <section id="stack" className="art-section" data-reveal>
            <h2>The stack</h2>
            <p>BeadReader is a Next.js App Router app with Tailwind CSS v4, Supabase for Postgres and storage, and Cloudflare R2 for webtoon images. Auth is custom: a short HMAC-signed cookie, not Supabase Auth.</p>
            <p>Because auth is custom, all database access runs server-side with the Supabase service role. Every table has row-level security enabled with no policies, so the public key can read nothing, and the explicit-content gate lives in the SQL query. The one-click Vercel deploy provisions Supabase through the integration and runs the migrations during the build.</p>
          </section>

        </div>
      </div>

      <ArticleRecommendations exclude="proj-beadreader" />
    </main>
  );
}
