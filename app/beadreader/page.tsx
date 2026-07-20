import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ReadingTogether from './ReadingTogether';

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader&env=SESSION_SECRET,BOOTSTRAP_ADMIN_CODE&envDescription=SESSION_SECRET%20signs%20the%20login%20cookie%3B%20BOOTSTRAP_ADMIN_CODE%20is%20your%20first%20admin%20login%20code&envLink=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader%23environment-variables&project-name=beadreader&repository-name=beadreader&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6';

export const metadata: Metadata = {
  title: 'BeadReader — Chiambucket',
  description:
    'A private, invite-only online book reader: access-code login, per-reader resume and themes, live "reading together" presence, a spicy content gate enforced in SQL, webtoons, and a shared reading-stats dashboard. Built with Next.js, Supabase and Cloudflare R2.',
  alternates: { canonical: 'https://www.chiambucket.com/beadreader' },
  openGraph: {
    title: 'BeadReader — Chiambucket',
    description:
      'A private, invite-only book reader with live presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats.',
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
    'A private, invite-only online book reader built with Next.js, Supabase and Cloudflare R2: access-code auth, per-reader resume and themes, live reading-together presence, a SQL-enforced explicit-content gate, webtoons, and a shared reading-stats dashboard.',
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
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/beadreader-cover.webp" alt="BeadReader, a private online book reader" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> All projects</a>
          <div
            className="br-mark"
            aria-hidden="true"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 54, height: 54, borderRadius: 15, marginBottom: 20,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            <img src="/images/beadreader-icon.png" alt="" width={36} height={36} style={{ display: 'block' }} />
          </div>
          <div className="art-tags">
            <span className="hp-md-tag highlight">Highlights</span>
            <span className="hp-md-tag personal">Personal Project</span>
          </div>
          <h1 className="art-title">Bead<em>Reader</em></h1>
          <p className="art-lead">A small, private online book reader for a handful of friends. One person publishes books in Markdown or image webtoons, everyone else logs in with a single access code, and the app remembers exactly where each reader left off. You can see who else is reading, react in the moment, and follow everyone&apos;s progress in a shared stats dashboard.</p>
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
              { type: 'github', label: 'View on GitHub', url: 'https://github.com/New-Kringster/BeadReader' },
              { type: 'demo', label: 'Deploy your own', url: DEPLOY_URL },
            ]}
          />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#room">A private reading room</a>
              <a href="#library">A library that remembers you</a>
              <a href="#together">Reading together</a>
              <a href="#gate">The spicy gate</a>
              <a href="#books">Two kinds of book</a>
              <a href="#stats">Reading stats</a>
              <a href="#instant">Built to feel instant</a>
              <a href="#stack">How it fits</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          <section id="room" className="art-section" data-reveal>
            <h2>A private reading room</h2>
            <p>BeadReader is not a public product. It is a private library for one admin and a few readers. There are no passwords and no sign-up. One access code is your whole identity: it decides whether you are the admin or a reader, and whether you can see explicit chapters. Enter it once and a signed cookie keeps you logged in.</p>
            <p>That single idea keeps the whole app small. The admin creates a reader, hands them a code out of band, and they are in. Revoke the code and they are out on their next request.</p>
            <figure className="art-fig">
              <img src="/images/beadreader/login-light.webp" alt="The BeadReader login screen" loading="lazy" />
              <figcaption>One code is identity, role and content access. No accounts to manage.</figcaption>
            </figure>
          </section>

          <section id="library" className="art-section" data-reveal>
            <h2>A library that remembers you</h2>
            <p>Open a book and it jumps straight back to the exact chapter and scroll position you last reached. Position is stored as a fraction of the chapter, not a pixel offset, so it survives even when you change the font size. Close mid-paragraph on your phone, pick up on a laptop, and you land in the same place.</p>
            <p>Reading is yours to tune. Background and text colour, font size, and a scroll or paginated layout are all saved per reader. The contents page marks each chapter you have opened, shows a progress bar on the one in progress, and lets you quietly mark a chapter unread.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/reader-paper.webp" alt="The reading view in a warm paper theme" loading="lazy" />
                <figcaption>The reading view, paper theme.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/contents-light.webp" alt="A book's contents with per-reader progress" loading="lazy" />
                <figcaption>Contents with read-tracking and a live progress bar.</figcaption>
              </figure>
            </div>
          </section>

          <section id="together" className="art-section" data-reveal>
            <h2>Reading together</h2>
            <p>Reading here is quietly social. From the library you can see who else is online. Inside a book, a small cluster of avatars sits at the top, each with a green dot. If a friend is in the very same book, their avatar gains a green ring and a chapter number, so you can tell they are right there with you.</p>
            <p>Tap the cluster and you can send a wave or a short note. These are ephemeral: they pop up on the other screen for a few seconds and then vanish, nothing is saved. Everyone can upload a profile photo, cropped and compressed in the browser, and anyone can flip a privacy toggle to read invisibly.</p>
            <ReadingTogether />
            <figure className="art-fig">
              <img src="/images/beadreader/reader-menu.webp" alt="The bump and quick-message menu" loading="lazy" />
              <figcaption>Tap a reader to wave or send a short, disappearing note.</figcaption>
            </figure>
          </section>

          <section id="gate" className="art-section" data-reveal>
            <h2>The spicy gate</h2>
            <p>Some chapters, or even passages inside a chapter, are marked explicit. Access is per reader, and it is enforced in the database query itself. A reader without access never receives the gated text, not even hidden in the response, so it cannot be pulled out of the raw API. This is a real gate, not CSS.</p>
            <p>The same chapter adapts to who is reading. A reader with access gets a blurred teaser that expands on a tap. A reader without access sees a small locked preview with a note to request it. A reader in cal mode sees the book with every explicit passage removed entirely, no markers and no pepper icon at all.</p>
            <figure className="art-fig">
              <img src="/images/beadreader/contents-dark.webp" alt="A contents list with an explicit chapter marked" loading="lazy" />
              <figcaption>Explicit chapters carry a marker for readers who can see them, and are invisible to those who cannot.</figcaption>
            </figure>
          </section>

          <section id="books" className="art-section" data-reveal>
            <h2>Two kinds of book</h2>
            <p>A book is either a text book or a webtoon, chosen once when it is created. Text books are written in Markdown with a live side-by-side preview, and each chapter has its own draft and published state.</p>
            <p>Webtoons are image-first. The admin points at a numbered image folder, previews its natural order, and uploads straight from the browser to Cloudflare R2 with short-lived signed URLs. Readers get a phone-friendly, gapless vertical strip with the same resume, tracking and gating as text.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/admin-books-light.webp" alt="The admin books list" loading="lazy" />
                <figcaption>The admin side: text and webtoon books, draft and published.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/webtoon.webp" alt="A webtoon chapter as a gapless vertical strip" loading="lazy" />
                <figcaption>A webtoon reads as one continuous vertical strip.</figcaption>
              </figure>
            </div>
          </section>

          <section id="stats" className="art-section" data-reveal>
            <h2>Reading stats</h2>
            <p>Every reader who shares their activity shows up in a common dashboard: total hours, books finished, and reading streaks. A histogram shows when in the day people read, scrolled day by day, and tapping a reader opens a per-book, per-chapter breakdown of where their time went.</p>
            <p>Reading time is tracked only while you are actually reading. It pauses when the tab loses focus or you go idle, so the numbers mean something.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/stats-overview-light.webp" alt="The reading-stats overview" loading="lazy" />
                <figcaption>Everyone&apos;s reading at a glance, streaks included.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/stats-detail-light.webp" alt="A per-reader stats breakdown" loading="lazy" />
                <figcaption>Per reader, per book, per chapter.</figcaption>
              </figure>
            </div>
          </section>

          <section id="instant" className="art-section" data-reveal>
            <h2>Built to feel instant</h2>
            <p>A service worker caches covers, artwork and static files on the device, never HTML or API responses, and the reader pre-loads the next chapter, so pages open fast and use less data. An Account page shows exactly what is cached and how much space it uses, with one button to clear it all.</p>
            <p>The app updates itself gracefully. A public changelog and a once-per-version what&apos;s-new popup explain each new feature, and when a newer build ships a gentle refresh prompt appears, sourced from the deploy rather than the database.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/account-light.webp" alt="The account and storage panel" loading="lazy" />
                <figcaption>Account and on-device storage, with a clear-all button.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/changelog-light.webp" alt="The in-app changelog" loading="lazy" />
                <figcaption>A public changelog and per-version what&apos;s-new.</figcaption>
              </figure>
            </div>
          </section>

          <section id="stack" className="art-section" data-reveal>
            <h2>How it fits</h2>
            <p>BeadReader is a Next.js App Router app with Tailwind CSS v4, backed by Supabase for Postgres and storage, plus Cloudflare R2 for webtoon images. Auth is custom: a short HMAC-signed cookie, not Supabase Auth.</p>
            <p>Because auth is custom, all database access runs server-side with the Supabase service role. Every table has row-level security enabled with no policies, so the public key can read nothing directly, and the explicit-content gate lives inside the SQL query. A one-click Vercel deploy provisions Supabase through the integration and runs the migrations during the build, so the whole thing stands up from a single button.</p>
          </section>

        </div>
      </div>

      <ArticleRecommendations exclude="proj-beadreader" />
    </main>
  );
}
