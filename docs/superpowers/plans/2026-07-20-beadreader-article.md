# BeadReader Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Before writing any frontend code (per project CLAUDE.md): invoke the `frontend-design` skill first.**

**Goal:** Ship a flagship, feature-showcase article for BeadReader at `/beadreader`, with a new warm "paper" theme, a bespoke "reading together" presence widget, real screenshots, and full site wiring.

**Architecture:** A server component (`app/beadreader/page.tsx`) owns metadata + JSON-LD and renders the shared `art-*` article template (hero → 8 chapters → recommendations). A `'use client'` child (`ReadingTogether.tsx`) provides the interactive presence widget. A new `paper` theme is registered across the three theming touch points. The project is added to the homepage gallery, the shared peek reader, and end-of-article recommendations.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, one global `public/mainstyle.css`, framer-motion (installed), `shot.mjs` (Puppeteer) for screenshot verification, `gpt-image-2` skill for the cover, `sips`/`cwebp` for image conversion.

## Global Constraints

- **No em dashes (`—`)** in any rendered copy. Use commas or split sentences.
- **No `next build` while the dev server runs** — validate types with `npx tsc --noEmit`.
- **No hardcoded accent rgba** — always `rgba(var(--sa-accent), x)` and the `--hp-*`/aura tokens.
- **Official icon is mandatory and unmodified**: `~/Downloads/beadreader-icon.png` → `public/images/beadreader-icon.png`, used as the BeadReader mark.
- **Animated media is `.webm` + `.mp4`, never `.gif`**; decorative autoplay uses `<LazyVideo>`. (BeadReader has no video; screenshots only.)
- **Article pages carry NO corner HUD** (`.sa-hud`) — do not add one.
- **Mobile**: verify every touched page at 390px; layouts collapse, no overflow.
- **Dev server** is user-run on port 3000 or 3001; do not start/restart it. Detect the live port before screenshots.
- Project id/slug: **`proj-beadreader`** / route **`/beadreader`**. Title **"BeadReader"**. Tags **Personal + Highlight**.
- Repo: `https://github.com/New-Kringster/BeadReader`. Deploy URL: the Vercel one-click clone URL from the project README (see Task 3).

---

## File map

| File | Change | Responsibility |
|---|---|---|
| `public/images/beadreader-icon.png` | create (copy) | Official mark |
| `public/images/beadreader-cover.webp` | create | Hero cover (generated bg + official icon) |
| `public/images/beadreader-pf-context.webp` | create | Gallery/recommendation card image |
| `public/images/beadreader/*.webp` | create | Real app screenshots used as figures |
| `lib/theme.ts` | modify | Map `/beadreader` → `paper` |
| `components/SensoryAtmosphere.tsx` | modify | Add `paper` shader palette |
| `public/mainstyle.css` | modify | `paper` aura block + DARK SENSORY `--sa-accent` + reduced-motion `--aura` |
| `app/beadreader/page.tsx` | create | Server: metadata, JSON-LD, hero, 8 chapters, recommendations |
| `app/beadreader/ReadingTogether.tsx` | create | Bespoke presence widget (`'use client'`) |
| `app/HomeClient.tsx` | modify | Add `proj-beadreader` gallery card |
| `components/ProjectPeek.tsx` | modify | Add `proj-beadreader` to `PEEK_ORDER`, `TITLES`, and a `PeekModalContent` case |
| `components/ArticleRecommendations.tsx` | modify | Add `proj-beadreader` metadata entry |
| `public/sitemap.xml` | modify | Add `/beadreader` url |
| `public/llms.txt` | modify | Add `/beadreader` line |
| `CLAUDE.md`, `README.md` | modify | Document the new route |

---

### Task 1: Assets — official icon + screenshots + generated cover

**Files:**
- Create: `public/images/beadreader-icon.png`, `public/images/beadreader-cover.webp`, `public/images/beadreader-pf-context.webp`, `public/images/beadreader/<screenshots>.webp`
- Source: `/Volumes/Shargey+/Projects/MINIjects/BeadReader/docs/screenshots/*` and `.../public/changelog/*`, `~/Downloads/beadreader-icon.png`

**Interfaces:**
- Produces: image paths consumed by Tasks 3–6. Exact names below.

- [ ] **Step 1: Copy the official icon**

```bash
cd "/Users/braven/Library/Mobile Documents/com~apple~CloudDocs/Trashy/chiambucket stuffs/chiambucket"
cp ~/Downloads/beadreader-icon.png public/images/beadreader-icon.png
```

- [ ] **Step 2: Copy + convert screenshots to WebP into `public/images/beadreader/`**

Source dir A = `/Volumes/Shargey+/Projects/MINIjects/BeadReader/docs/screenshots`
Source dir B = `/Volumes/Shargey+/Projects/MINIjects/BeadReader/public/changelog`

Copy these and convert PNG→WebP (use `cwebp -q 82 in.png -o out.webp`, or `sips -s format webp`):
`login-light, login-dark, library-light, library-dark, reader-paper, reader-dark, contents-light, contents-dark, webtoon, admin-books-light, stats-overview-light, stats-detail-light, account-light, account-dark, changelog-light` (from A), and `presence-reader, reader-menu` (from B).
Target names: `public/images/beadreader/<name>.webp`.

```bash
mkdir -p public/images/beadreader
A="/Volumes/Shargey+/Projects/MINIjects/BeadReader/docs/screenshots"
B="/Volumes/Shargey+/Projects/MINIjects/BeadReader/public/changelog"
for f in login-light login-dark library-light library-dark reader-paper reader-dark contents-light contents-dark webtoon admin-books-light stats-overview-light stats-detail-light account-light account-dark changelog-light; do
  cwebp -q 82 "$A/$f.png" -o "public/images/beadreader/$f.webp" 2>/dev/null || sips -s format webp "$A/$f.png" --out "public/images/beadreader/$f.webp";
done
for f in presence-reader reader-menu; do
  cwebp -q 82 "$B/$f.png" -o "public/images/beadreader/$f.webp" 2>/dev/null || sips -s format webp "$B/$f.png" --out "public/images/beadreader/$f.webp";
done
ls -la public/images/beadreader/
```

- [ ] **Step 3: Generate the warm cover background (gpt-image-2 skill)**

Invoke the `gpt-image-2` skill. Prompt intent: a wide (1600×900) warm editorial cover **background** for a cozy private reading app. Cream-to-amber field, a soft motif of an open book / stacked warm-toned book spines, gentle paper grain, generous negative space on the left third for an overlaid title, no text, no logo, no UI. Muted warm palette (cream #f4 efe6, amber #c98a3a, soft brown #6b4a2f). Save the raw output under `temporary screenshots/` first.

- [ ] **Step 4: Composite the official icon onto the cover → produce hero + card WebP**

Place the official `beadreader-icon.png` (scaled ~140px) in the negative-space area of the generated background, export two crops:
- `public/images/beadreader-cover.webp` (wide hero, ~1600×900)
- `public/images/beadreader-pf-context.webp` (card, ~1200×800, tighter crop)

Use PIL/ImageMagick to composite + `cwebp -q 85`. Verify both open and look warm.

- [ ] **Step 5: Commit**

```bash
git add public/images/beadreader-icon.png public/images/beadreader-cover.webp public/images/beadreader-pf-context.webp public/images/beadreader/
git commit -m "assets: BeadReader icon, cover, and screenshots"
```

---

### Task 2: The `paper` theme

**Files:**
- Modify: `lib/theme.ts` (add map entry), `components/SensoryAtmosphere.tsx:83-108` (add palette), `public/mainstyle.css` (aura block + DARK SENSORY accent + reduced-motion aura)

**Interfaces:**
- Produces: `data-theme="paper"` renders a warm field + warm accents. Consumed by Task 3 (page sets no theme itself; `themeForPath('/beadreader')` returns `paper`).

- [ ] **Step 1: Map the route**

In `lib/theme.ts`, add to `THEME_MAP`:

```ts
  '/beadreader': 'paper',
```

- [ ] **Step 2: Add the shader palette**

In `components/SensoryAtmosphere.tsx`, inside `PALETTES` (after `datacenter`), add a warm-dark palette (`[base, deep, mid, highlight, whisper, bloom]`):

```ts
  paper: [
    [0.013, 0.009, 0.005], [0.060, 0.036, 0.017], [0.130, 0.082, 0.040],
    [0.300, 0.196, 0.100], [0.210, 0.120, 0.055], [0.120, 0.076, 0.035],
  ],
```

- [ ] **Step 3: Add the per-page accent block in mainstyle.css**

In the per-page-accent section (next to the other `html[data-theme="…"]` blocks), add. Values are warm; tune later with screenshots.

```css
html[data-theme="paper"] {
  --aura-1: rgba(201, 138, 58, 0.30);
  --aura-2: rgba(233, 214, 180, 0.18);
  --aura-3: rgba(107, 74, 47, 0.28);
  --em-grad: linear-gradient(90deg, #e6b877, #c98a3a);
  --title-grad: linear-gradient(90deg, #f0dcc0, #c98a3a);
  --orb-edge: rgba(201, 138, 58, 0.55);
  --hp-blue: #c98a3a;
  --hp-deep: #6b4a2f;
  --hp-indigo: #b9772e;
  --hp-sky: #e6b877;
}
```

- [ ] **Step 4: Add the DARK SENSORY accent block**

In the DARK SENSORY / SIGNAL ARCHIVE section (next to the other `html.sensory-active[data-theme="…"]` rules), add:

```css
html.sensory-active[data-theme="paper"] { --sa-accent: 216, 156, 92; }
```

- [ ] **Step 5: Add paper to the reduced-motion `--aura` fallback**

Find the `:root`/`--aura` mesh fallback block used for `prefers-reduced-motion`/no-WebGL and add a `html[data-theme="paper"]` variant with the warm stops (mirror an existing theme's `--aura` override, warm hues).

- [ ] **Step 6: Verify types + visual**

```bash
npx tsc --noEmit
```
Expected: no errors. Then (after Task 3 exists) screenshot `/beadreader` and confirm the field + auras read warm.

- [ ] **Step 7: Commit**

```bash
git add lib/theme.ts components/SensoryAtmosphere.tsx public/mainstyle.css
git commit -m "theme: add warm 'paper' palette for BeadReader"
```

---

### Task 3: Article page scaffold — hero + metadata + JSON-LD + links

**Files:**
- Create: `app/beadreader/page.tsx`

**Interfaces:**
- Consumes: `ArticleScrollSpy`, `ArticleLinks` (`ArtLink[]`, types include `'github' | 'demo'`), `ArticleRecommendations` (`exclude` prop), cover image from Task 1.
- Produces: renders at `/beadreader`; body chapters filled in Task 4; widget imported in Task 5.

- [ ] **Step 1: Create the page with hero only (body added next task)**

Mirror `app/project-june/page.tsx` structure. Use the Deploy URL verbatim from the README's clone button:
`https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader&env=SESSION_SECRET,BOOTSTRAP_ADMIN_CODE&envDescription=SESSION_SECRET%20signs%20the%20login%20cookie%3B%20BOOTSTRAP_ADMIN_CODE%20is%20your%20first%20admin%20login%20code&envLink=https%3A%2F%2Fgithub.com%2FNew-Kringster%2FBeadReader%23environment-variables&project-name=beadreader&repository-name=beadreader&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6`

```tsx
import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ReadingTogether from './ReadingTogether';

export const metadata: Metadata = {
  title: 'BeadReader — Chiambucket',
  description: 'A private, invite-only online book reader: access-code login, per-reader resume and themes, live "reading together" presence, a spicy content gate enforced in SQL, webtoons, and a shared reading-stats dashboard. Next.js, Supabase and Cloudflare R2.',
  alternates: { canonical: 'https://www.chiambucket.com/beadreader' },
  openGraph: {
    title: 'BeadReader — Chiambucket',
    description: 'A private, invite-only book reader with live presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats.',
    url: 'https://www.chiambucket.com/beadreader',
    type: 'article',
    images: [{ url: '/images/beadreader-cover.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'BeadReader',
  description: 'A private, invite-only online book reader built with Next.js, Supabase and Cloudflare R2: access-code auth, per-reader resume and themes, live reading-together presence, a SQL-enforced explicit-content gate, webtoons, and a shared reading-stats dashboard.',
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

      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/beadreader-cover.webp" alt="BeadReader, a private online book reader" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> All projects</a>
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
              { type: 'demo', label: 'Deploy your own', url: 'PASTE_DEPLOY_URL_HERE' },
            ]}
          />
        </div>
      </header>

      {/* Body added in Task 4 */}

      <ArticleRecommendations exclude="proj-beadreader" />
    </main>
  );
}
```

Replace `PASTE_DEPLOY_URL_HERE` with the full Deploy URL above.

- [ ] **Step 2: Ensure the toolrow icons exist**

Check which of `nextjs-icon.webp typescript-icon.webp supabase-icon.webp tailwind-icon.webp cloudflare-icon.webp` exist in `public/images/`:

```bash
for i in nextjs typescript supabase tailwind cloudflare; do ls public/images/$i-icon.webp 2>/dev/null || echo "MISSING: $i-icon.webp"; done
```

For any MISSING icon, add a small square WebP logo (fetch the official brand SVG/PNG, convert to ~48×48 WebP). Keep alt text accurate. If an icon truly cannot be sourced, drop that one `<img>` from the toolrow rather than shipping a broken image.

- [ ] **Step 3: Create a temporary stub for the widget so the page compiles**

Create `app/beadreader/ReadingTogether.tsx` with a minimal default export (replaced fully in Task 5):

```tsx
'use client';
export default function ReadingTogether() { return null; }
```

- [ ] **Step 4: Verify types + render**

```bash
npx tsc --noEmit
```
Expected: no errors. Then load `http://localhost:<port>/beadreader` and confirm the hero renders with the warm cover, tags, title, lead, toolrow, and both link pills.

- [ ] **Step 5: Commit**

```bash
git add app/beadreader/page.tsx app/beadreader/ReadingTogether.tsx public/images/*-icon.webp
git commit -m "feat: BeadReader article hero + metadata scaffold"
```

---

### Task 4: Article body — 8 chapters + scroll-spy rail + figures

**Files:**
- Modify: `app/beadreader/page.tsx` (insert `.art-body` between the hero and `ArticleRecommendations`)

**Interfaces:**
- Consumes: screenshot WebPs from Task 1 (`/images/beadreader/<name>.webp`), `ReadingTogether` (Task 5).
- Produces: the full readable article; section ids match the rail anchors.

- [ ] **Step 1: Insert the body block**

Add between the `</header>` and `<ArticleRecommendations …/>`. Rail anchors must match section ids. Use `.art-fig` + `<figcaption>` for figures (caption prefix `FIG ·` is applied by CSS). Diagrams/screenshots with their own frames do NOT need `art-diagram`. Insert `<ReadingTogether />` inside the "Reading together" section.

```tsx
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
                <figcaption>Everyone's reading at a glance, streaks included.</figcaption>
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
            <p>The app updates itself gracefully. A public changelog and a once-per-version what's-new popup explain each new feature, and when a newer build ships a gentle refresh prompt appears, sourced from the deploy rather than the database.</p>
            <div className="art-grid">
              <figure className="art-fig">
                <img src="/images/beadreader/account-light.webp" alt="The account and storage panel" loading="lazy" />
                <figcaption>Account and on-device storage, with a clear-all button.</figcaption>
              </figure>
              <figure className="art-fig">
                <img src="/images/beadreader/changelog-light.webp" alt="The in-app changelog" loading="lazy" />
                <figcaption>A public changelog and per-version what's-new.</figcaption>
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
```

- [ ] **Step 2: Verify types + render both themes**

```bash
npx tsc --noEmit
```
Load `/beadreader`, scroll through; confirm all 8 sections render, figures load, the rail highlights the active chapter, and no image 404s in the console.

- [ ] **Step 3: Commit**

```bash
git add app/beadreader/page.tsx
git commit -m "feat: BeadReader article body — 8 chapters with figures"
```

---

### Task 5: Bespoke widget — `ReadingTogether.tsx`

**Files:**
- Replace: `app/beadreader/ReadingTogether.tsx`

**Interfaces:**
- Consumes: `framer-motion` (installed), `--hp-*`/paper tokens, `public/images/beadreader-icon.png`.
- Produces: default export `ReadingTogether` (already imported in Task 4).

- [ ] **Step 1: Implement the widget**

A mini "Online now" panel. Requirements, matching the other article widgets:
- Three readers (Mara / Jae / Sam), each an avatar with a live green presence dot.
- One reader is "in your book": green ring + a chapter-number badge.
- An auto-cycling script: highlight a reader, fire a **bump 👋** or a short quick-note that appears on their row and **fades after ~3s** (ephemeral). Manual taps interrupt and drive it.
- Root has `data-no-zoom`. Scoped `<style>` with a unique `rt-` prefix (no global CSS edits).
- Accent from `--hp-*`/paper tokens; presence uses semantic green (`#22c55e` family).
- Transform/opacity-only animation; `prefers-reduced-motion` renders a static, non-animating panel.
- **Pauses when scrolled out of view** via `IntersectionObserver` gating the auto-advance interval.
- **No reflow**: any text region that changes per step gets a fixed-height reserve (fixed `min-height`, or a hidden longest-content sizer in the same grid cell).
- Single-column collapse at 390px.

Reference the app's real UI (`docs/screenshots/reader-menu`, `contents-light`) for layout fidelity. Follow the structure of `app/pandus/DispenseDemo.tsx` / `app/csdp/NodeMap.tsx` for the framer-motion + IntersectionObserver + reduced-motion + sizer conventions.

- [ ] **Step 2: Verify types**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Verify behaviour in browser**

On `/beadreader`, confirm: the widget auto-cycles, a bump/note appears and fades, tapping a reader interrupts, scrolling it out of view pauses it, and it does not shift the page height as text changes. Toggle OS reduced-motion and confirm the static fallback.

- [ ] **Step 4: Commit**

```bash
git add app/beadreader/ReadingTogether.tsx
git commit -m "feat: ReadingTogether presence widget for BeadReader"
```

---

### Task 6: Site wiring — gallery, peek reader, recommendations

**Files:**
- Modify: `app/HomeClient.tsx` (add gallery card after `proj-lumen`, before `proj-ema`), `components/ProjectPeek.tsx` (`PEEK_ORDER`, `TITLES`, new `PeekModalContent` case), `components/ArticleRecommendations.tsx` (metadata array)

**Interfaces:**
- Consumes: card image `/images/beadreader-pf-context.webp`, toolrow icons from Task 3.
- Produces: `proj-beadreader` visible in homepage gallery, peek reader, and every article's recommendations.

- [ ] **Step 1: Add the homepage gallery card**

In `app/HomeClient.tsx`, immediately after the LUMEN `</article>` (the `id="proj-lumen"` card) and before the EMA card, insert:

```tsx
              {/* BeadReader */}
              <article id="proj-beadreader" className="hp-pf-card" data-article="/beadreader" data-type="personal" data-highlight="1" data-search="beadreader bead reader private book reader ebook webtoon nextjs supabase cloudflare r2 tailwind postgres presence reading stats access code personal highlight web app">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span><span className="hp-pf-star"><ST />Highlight</span>
                  <img src="/images/beadreader-pf-context.webp" alt="BeadReader private book reader" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">BeadReader</h3>
                  <p className="hp-pf-blurb">A private, invite-only online book reader with live reading-together presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats. Next.js and Supabase.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/nextjs-icon.webp" alt="" /><img src="/images/supabase-icon.webp" alt="" /><img src="/images/tailwind-icon.webp" alt="" /><img src="/images/cloudflare-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/beadreader'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>
```

- [ ] **Step 2: Add to PEEK_ORDER and TITLES**

In `components/ProjectPeek.tsx`, add `'proj-beadreader'` to `PEEK_ORDER` after `'proj-lumen'`:

```ts
export const PEEK_ORDER: string[] = [
  'proj-june', 'proj-lora', 'proj-lumen', 'proj-beadreader', 'proj-ema', 'proj-pandus', 'proj-elecf',
  'proj-kauli', 'proj-sol', 'proj-copyboard', 'proj-webdev', 'proj-mc',
];
```

And to `TITLES`:

```ts
  'proj-beadreader': 'BeadReader',
```

- [ ] **Step 3: Add the PeekModalContent case**

In the `switch (id)` of `PeekModalContent`, add after the `proj-lumen` case:

```tsx
    case 'proj-beadreader': return (
      <>
        {hero('/images/beadreader-pf-context.webp', 'BeadReader private book reader', ['Highlights', 'Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Web App · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Self-Learnt</p>
          <p className="hp-rd-lead">A small, private online book reader for a handful of friends. Log in with one access code, and the app remembers exactly where you left off, shows who else is reading, and tracks everyone&apos;s progress.</p>
          {chapter('01', 'A library that remembers you', <><p>Open a book and it jumps back to the exact chapter and scroll position, stored as a fraction so it survives font-size changes. Colour, font and layout are saved per reader.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="The reading view" loading="lazy" /></>)}
          {chapter('02', 'Reading together', <><p>See who is online, spot a friend in the same book by their green ring and chapter number, and send a wave or a short disappearing note.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Presence and quick messages" loading="lazy" /></>)}
          {chapter('03', 'A gate enforced in SQL', <p>Explicit chapters are gated in the database query itself, so gated text never leaves the server for a reader without access. The same chapter adapts per reader, down to a cal mode that removes it entirely.</p>)}
          {cta('See the whole build', 'Presence, the content gate, webtoons and the stack.', 'Read the full article', '/beadreader')}
        </div>
      </>
    );
```

- [ ] **Step 4: Add the recommendations metadata entry**

In `components/ArticleRecommendations.tsx`, add after the `proj-lumen` object in the projects array:

```ts
  { id: 'proj-beadreader', title: 'BeadReader', blurb: 'A private, invite-only online book reader with live presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats. Next.js and Supabase.', img: '/images/beadreader-pf-context.webp', imgAlt: 'BeadReader private book reader', type: 'personal', highlight: true, articleUrl: '/beadreader', icons: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/tailwind-icon.webp', alt: 'Tailwind CSS' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }] },
```

- [ ] **Step 5: Verify types + both surfaces**

```bash
npx tsc --noEmit
```
On `/` open the BeadReader card's peek and confirm the reader renders; on `/lumen` scroll to recommendations and confirm the BeadReader card appears (and is excluded on `/beadreader`).

- [ ] **Step 6: Commit**

```bash
git add app/HomeClient.tsx components/ProjectPeek.tsx components/ArticleRecommendations.tsx
git commit -m "feat: register BeadReader in gallery, peek reader and recommendations"
```

---

### Task 7: SEO + docs + final verification

**Files:**
- Modify: `public/sitemap.xml`, `public/llms.txt`, `CLAUDE.md`, `README.md`

**Interfaces:** none produced; final integration.

- [ ] **Step 1: Add the sitemap entry**

In `public/sitemap.xml`, add a `<url>` block (mirror the `/lumen` one):

```xml
  <url>
    <loc>https://www.chiambucket.com/beadreader</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
```

- [ ] **Step 2: Add the llms.txt line**

In `public/llms.txt`, after the LUMEN project line, add:

```
- BeadReader: a private, invite-only online book reader built with Next.js (App Router), Tailwind v4, Supabase (Postgres + Storage) and Cloudflare R2. Access-code auth (one code = identity, role and explicit-content access), per-reader auto-resume and reading themes, live "reading together" presence with ephemeral bump/notes, an explicit-content gate enforced inside the SQL query, Markdown text books and image webtoons, and a shared reading-stats dashboard with streaks. [Article](https://www.chiambucket.com/beadreader)
```

- [ ] **Step 3: Update CLAUDE.md routing table + README**

Add a `/beadreader` row to the routing table in `CLAUDE.md` (route, file `app/beadreader/page.tsx` → `ReadingTogether.tsx`, purpose: private book-reader article, `paper` theme, presence widget). Note the new `paper` theme in the theming section. Add a brief BeadReader entry to `README.md` if it lists projects/routes.

- [ ] **Step 4: Full screenshot verification (≥2 passes, desktop + mobile, light + dark)**

Detect the live dev port, then:

```bash
node shot.mjs http://localhost:3001/beadreader beadreader-desktop desktop full
node shot.mjs http://localhost:3001/beadreader beadreader-mobile mobile full
```

Read each PNG. Check against `/project-june` and `/lumen` language: hero cover dissolves into the field, chapter rail + `FIG ·` captions, warm auras/gradient text, the widget reads well and does not overflow at 390px, all figures load. Fix mismatches in `mainstyle.css` (paper tokens) or the page and re-shoot. Also shoot the homepage gallery card and one recommendations surface.

- [ ] **Step 5: Final type check + commit**

```bash
npx tsc --noEmit
git add public/sitemap.xml public/llms.txt CLAUDE.md README.md
git commit -m "docs+seo: register /beadreader in sitemap, llms, CLAUDE.md"
```

---

## Self-review notes

- **Spec coverage:** paper theme (Task 2), hero+links+SEO (Task 3), 8 showcase chapters w/ screenshots (Task 4), presence widget (Task 5), gallery+peek+recommendations (Task 6), sitemap/llms/docs + verification (Task 7), official icon + generated cover (Task 1). All spec sections mapped.
- **Icons risk:** `nextjs/typescript/supabase/tailwind/cloudflare` webp icons may not exist yet — Task 3 Step 2 sources or drops them before they are referenced in Tasks 4/6.
- **Type consistency:** `proj-beadreader` id, `/beadreader` route, and image paths are identical across HomeClient, ProjectPeek (`PEEK_ORDER`/`TITLES`/case), ArticleRecommendations, sitemap, llms.
- **No unit tests:** this is a design/content codebase with no test runner; verification is `npx tsc --noEmit` + `shot.mjs` screenshot review, per project conventions.
