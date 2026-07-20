# BeadReader Article — Design Spec

**Date:** 2026-07-20
**Route:** `/beadreader`
**Type:** New flagship article page (feature-showcase flavour), following the `art-*` template.
**Source project:** `New-Kringster/BeadReader` (public) · local at `/Volumes/Shargey+/Projects/MINIjects/BeadReader`

## 1. What we are building

A full flagship article for **BeadReader** — a small, private, invite-only online book
reader Braven built (Next.js App Router + Tailwind v4 + Supabase + Cloudflare R2). The
article reads as a **product/feature showcase**: real screenshots as figures, one bespoke
interactive widget dramatising the app's signature "reading together" social hook, and a
closing stack/architecture chapter. It matches the editorial language and quality bar of
`/project-june` and `/lumen`.

The product's identity is warm (brown / cream / green presence dots), which is honoured
by adding a **new warm "paper" theme** to the site's theming system rather than reusing a
cool Frame-6 palette.

## 2. Decisions (locked)

| Decision | Choice |
|---|---|
| Theme | New warm **`paper`** palette (amber / tan / cream; green reserved for presence, ember for status) |
| Scope | Full flagship `art-*` article, feature-showcase flavour |
| Bespoke widget | "Reading together" presence (avatars, live dots, same-book ring + chapter, ephemeral bump/note) |
| Key links | GitHub (primary) + "Deploy your own" (Vercel one-click) |
| Hero image | Generated warm cover via `gpt-image-2` (`beadreader-cover.webp`), doubles as gallery card (`beadreader-pf-context.webp`) |
| Gallery placement | `type: personal`, `highlight: true`, in homepage Projects gallery + ArticleRecommendations |

## 3. The `paper` theme

Added exactly the way every existing theme is added — three touch points, no hardcoded
accent rgba anywhere:

1. **`lib/theme.ts`** — add `'/beadreader': 'paper'` to `THEME_MAP`.
2. **`components/SensoryAtmosphere.tsx`** — add a `paper` entry to `PALETTES` with six warm
   shader colour stops (cream → amber → soft brown).
3. **`public/mainstyle.css`** —
   - a `html[data-theme="paper"]` block in the per-page-accent section re-pointing
     `--aura-1/2/3`, `--em-grad`, `--title-grad`, `--orb-edge`, and the `--hp-blue/-deep/-indigo/-sky` overrides to warm hues;
   - a `html.sensory-active[data-theme="paper"]` block in the DARK SENSORY section setting
     `--sa-accent` to a warm tan `R,G,B` triplet.
   - Update the reduced-motion `--aura` fallback mesh block to include paper.

Green (`presence`) and the reserved warm ember (`--sa-ember`) are NOT changed — green is
BeadReader's own live-signal colour and reads correctly against the warm field.

## 4. Page structure

Server `app/beadreader/page.tsx`:
- exports `metadata` (title, description, canonical `/beadreader`, OG image = cover) and an
  `Article` JSON-LD block.
- renders the `art-*` hero + body; imports the client widget and `ArticleRecommendations`.

Hero: `.art-hero` with `beadreader-cover.webp` as `.art-hero-bg`, scrim, aura, `.art-title`
"BeadReader", `.art-lead`, `.art-toolrow`, then `<ArticleLinks>` with:
- `{ type: 'github', label: 'View on GitHub', url: 'https://github.com/New-Kringster/BeadReader' }` (primary)
- `{ type: 'demo', label: 'Deploy your own', url: '<Vercel one-click clone URL from README>' }`

Body: `.art-body` 2-col grid, sticky `.art-rail` with `.art-chapters article-chapter-wrapper`
scroll-spy rail (via `ArticleScrollSpy`), `.art-section` blocks with `data-reveal`.

### Chapters

1. **A private reading room** — invite-only; one access code = identity + role (admin/reader)
   + explicit-content access; no passwords, no sign-up; signed-cookie session. *Fig: login (light/dark).*
2. **A library that remembers you** — auto-resume to exact chapter + scroll fraction (stored
   as a fraction/page, survives font-size changes); per-reader reading themes (background/text
   colour, font size, scroll vs paginated); contents with read-tracking, in-progress bar,
   greyed read chapters. *Figs: library, reader-paper, reader-dark, contents.*
3. **Reading together** — presence ("Online now"), same-book green ring + chapter-number badge,
   ephemeral bump 👋 / short note, browser-cropped profile photos, per-reader "share activity"
   privacy toggle. **Bespoke `ReadingTogether` widget inserted inside this section.**
   *Figs: presence-reader, reader-menu.*
4. **The spicy gate** — one chapter, three readers: full click-to-reveal / locked
   request-preview / cal-mode removed entirely. Gate enforced in the SQL query (gated chapters
   never leave the server), not CSS. Inline `[[spicy]]…[[/spicy]]` passages. *Fig: contents crop w/ 🌶.*
5. **Two kinds of book** — Text (Markdown chapter editor + live side-by-side preview) and
   Webtoon (numbered image folder → direct-to-R2 signed PUT upload → gapless vertical strip;
   1080×1920 portrait, auto-WebP). *Figs: admin-books, webtoon.*
6. **Reading stats** — shared `/read/stats` dashboard: total hours, books finished, streaks,
   a scrollable "when do you read" histogram, per-book/per-chapter time breakdown; visible to
   every reader who shares activity. *Figs: stats-overview, stats-detail.*
7. **Built to feel instant** — service worker caches covers/artwork/static on-device (never
   HTML/API) + next-chapter preload; Account → Storage panel + clear-data; in-app version +
   changelog, once-per-version what's-new popup, refresh-on-new-build prompt sourced from the
   Vercel build. *Figs: account, changelog.*
8. **How it fits** — stack: Next.js App Router + Tailwind v4 + Supabase (Postgres + Storage)
   + Cloudflare R2. Custom HMAC-signed cookie auth (not Supabase Auth); all DB access server-side
   with `service_role`; every table RLS-enabled with no policies so anon reads nothing; the spicy
   gate lives in SQL. One-click Vercel deploy provisions Supabase via the integration and runs
   `scripts/setup-db.mjs` migrations. Ends with `art-next` CTA + `<ArticleRecommendations exclude="proj-beadreader" />`.

## 5. Bespoke widget — `app/beadreader/ReadingTogether.tsx`

`'use client'`, framer-motion. A mini "Online now" panel dramatising the social hook:

- Avatar cluster of 3 readers (Mara / Jae / Sam) each with a live green presence dot.
- The reader in *your* book gets the green ring + a chapter-number badge (e.g. `12`).
- Tapping a reader fires either a **bump 👋** or a short quick-note that pops onto their card
  and **fades after ~3s** — ephemeral, nothing persisted.
- Auto-cycles through a short script (bump → note → new reader appears), yields to manual taps,
  and **pauses when scrolled out of view** (IntersectionObserver `inView` gate).

Conventions (matching other article widgets): scoped `<style>` with a unique `rt-` prefix,
`data-no-zoom` on the root, `--hp-*` / paper tokens for accent plus semantic green for presence,
transform/opacity-only animation with a `prefers-reduced-motion` static fallback, fixed-height
reserves on any text region that changes per step so the widget never reflows the page,
single-column collapse at 390px. Inserted inside the existing "Reading together" `<section>`
(not added to the scroll-spy rail).

## 6. Assets

- **Official icon (required).** Copy `~/Downloads/beadreader-icon.png` (256×256 RGBA, a
  monochrome grey "bead" glyph on transparent) into `public/images/beadreader-icon.png`. This
  is THE official BeadReader mark and must be used faithfully (unmodified) wherever the mark
  appears: the hero mark by the title, the `ReadingTogether` widget panel header, and composited
  onto the generated cover. Do not redraw or recolour it.
- **Cover.** Generate a warm cover *background* (no text, no fake logo) via `gpt-image-2` —
  cream/amber field, open-book / stacked-spines motif, soft grain — then composite the OFFICIAL
  icon onto it to produce `public/images/beadreader-cover.webp` (hero) and
  `beadreader-pf-context.webp` (gallery card). The "BeadReader" wordmark on the hero comes from
  the template's `.art-title` overlay, not from the generated image. No hero poster needed (static image).
- **Copy** real screenshots from the project into `public/images/beadreader/`:
  login-light/dark, library-light/dark, reader-paper, reader-dark, contents-light/dark,
  presence-reader, reader-menu, webtoon, admin-books-light, stats-overview-light,
  stats-detail-light, account-light/dark, changelog-light. Convert PNG→WebP where it saves weight.
- **Project-card icons**: Next.js, TypeScript, Supabase, Tailwind, Cloudflare. Reuse existing
  webp icons where present; add any missing icon webp to `public/images/` (checked at build time).

## 7. Site wiring / integration

- `app/HomeClient.tsx` — add `proj-beadreader` to the homepage Projects gallery data
  (title "BeadReader", personal, highlight, blurb, card img, icons, `articleUrl: '/beadreader'`).
- `components/ArticleRecommendations.tsx` — add the same `proj-beadreader` entry to its project list.
- `public/sitemap.xml` — add `<url>` for `/beadreader`.
- `public/llms.txt` — add a `/beadreader` line.
- No `next.config.mjs` redirect needed (brand-new route).
- `CLAUDE.md` routing table + README — add the `/beadreader` row / feature note.

## 8. Copy rules

- No em dashes (`—`) in any rendered copy; use commas or split sentences.
- HUD corner text: article pages deliberately carry NO corner HUD (per template) — none added.
- Keep the tone editorial and factual, matching `/lumen` and `/project-june`.

## 9. Verification checklist

- `npx tsc --noEmit` clean (do NOT run `next build` while dev server is up).
- `shot.mjs` desktop + 390px mobile, ≥2 passes; check light + dark; compare against
  `/project-june` / `/lumen` reference language; fix mismatches and re-shoot.
- Widget: auto-cycles, pauses off-screen, no page reflow, reduced-motion fallback, 390px single column.
- Theme: auras / gradient text / shader field all read warm; green presence + ember status intact.
- SEO: metadata + canonical + Article JSON-LD present; sitemap + llms updated.
