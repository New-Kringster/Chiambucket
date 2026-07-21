# Chiambucket — Project Overview

Personal portfolio/personal website for Braven Chiam. Dark-themed, design-forward. The current design language is **"Dark Sensory / Signal Archive"** (July 2026 redesign): every page rides a fixed WebGL shader-gradient field, content sits on frosted "instrument panels", labels read as letterspaced mono HUD readouts, and one warm ember accent is reserved for live/status moments. Built with Next.js and deployed on Vercel.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — `app/` directory, server components by default
- **Vercel Analytics + Speed Insights** — loaded in `app/layout.tsx`
- **framer-motion** — installed (`framer-motion`); available for React animations when CSS isn't enough. Prefer CSS for simple transitions; reach for it for orchestrated/gesture/layout animations.
- **WebGL sensory field** — `components/SensoryAtmosphere.tsx` (domain-warped fBM fragment shader, per-theme palette uniforms with crossfade on navigation, film grain, focal bloom; static `--aura` CSS-mesh fallback on `prefers-reduced-motion`/no-WebGL; pauses when the tab is hidden). Mounted once via `components/SensoryShell.tsx` in `app/layout.tsx`; the inline head script sets `html.sensory-active` before paint.
- **Lychee** — self-hosted photo gallery embedded via a remote script (homepage + photography). The remote script *and* its cross-origin stylesheet are injected client-side after paint (a `useEffect` appends a `<link data-lychee-css>`), so the homelab server never render-blocks first paint.
- **No Tailwind, no CSS-in-JS.** One global stylesheet: `public/mainstyle.css` (~3760 lines; the dead legacy pre-Next rules were purged)
- jQuery is **gone** — the old jQuery `.load()` includes were replaced by React components. The legacy `links.js`/`nav.html`/`footer.html`/`projects.js` files and the pre-Next root `*.html` pages have been deleted.

## Routing (Next.js App Router)

Routes are file-based under `app/<route>/page.tsx`. There is no `links.js` router anymore.

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` → `app/HomeClient.tsx` | Homepage (`hp-*` classes): hero, disciplines, About bento (intro/engineering/microcontrollers/PowerPoint tiles open `InfoModal` detail popups; the Design Tools tile is a 3D auto-rotating icon carousel, `.hp-tcar-*`), Projects (**two flagship spotlights** — `.hp-spotlight` Project June "Flagship Hardware Build", and `.hp-spotlight.hp-spotlight-solo` BeadReader "Flagship Software Build", a full-bleed promo graphic `beadreader-flagship.webp` + `.hp-spot-solo-cta` row — then capabilities + filterable gallery + chaptered reader modal). **Project tiers:** `Flagship` is a premium tier ABOVE `Highlight` (gold `.hp-pf-crown` / `.hp-md-tag.flagship` badge, `is-flagship` card glow, its own **Flagship** filter via `data-flagship="1"`) reserved for `proj-june` + `proj-beadreader`; `Highlight` (`.hp-pf-star`, `data-highlight="1"`) stays for LoRA + LUMEN. The tier is mirrored across the gallery cards, `ProjectPeek` hero tags, `ArticleRecommendations`, and each flagship article's `.art-tags`. Collaborators band (`.hp-collab-*`: school teammates pulled from the ELEC-F + EMA team rolls, with the projects we built together), HomeLab band, switchable photography gallery, CTA |
| `/photography` | `app/photography/page.tsx` → `PhotographyClient.tsx` | Editorial hero + "My Tools" cards + seven Lychee galleries |
| `/contact` | `app/contact/page.tsx` → `ContactClient.tsx` | Email + socials (`ct-*`) |
| `/credits` | `app/credits/page.tsx` | Colophon (`cr-*` + shared `ct-*` hero): built with Claude, hosted on Vercel, open-source tools |
| `/homelab` | `app/homelab/page.tsx` → `HomelabClient.tsx` | HomeLab — the most interactive page. Bespoke **"datacenter" theme** (`hl2-*`/`dc-*`). Server `page.tsx` owns metadata + JSON-LD; client renders hero, mission pillars, machine cards (real server photos), the **interactive `SystemMap`**, storage/PXE, the filterable service stack with **live status dots**, and access methods. Content lives in `app/homelab/data.ts`; styles in `app/homelab/homelab.css` (imported, not in `mainstyle.css`); animations via **framer-motion** |
| `/project-june` | `app/project-june/page.tsx` | Article: Project June 5G rover — **the gold-standard `art-*` article template** |
| `/lumen` | `app/lumen/page.tsx` → `LumenConsole.tsx`, `PromptReveal.tsx` | Article: LUMEN ESP32 voice assistant (NYP IoT). Wake word + INMP441 mic on-device, Dockerised FastAPI relay that calls **OpenRouter** for both Whisper STT (`openai/whisper-1`) + DeepSeek LLM command parser (`deepseek/deepseek-chat`) on one API key, fanning out over MQTT (the pipeline is **multilingual**: speech in many languages is transcribed by Whisper and still resolves to the same JSON command vocabulary); the engineering story is fitting streamed audio onto a no-PSRAM board (the lean 4-page OLED ships; heavier variants reverted). Theme `violet`. Hero background is the designed cover graphic (`lumen-cover.webp`; the same art also serves the project card as `lumen-pf-context.webp`), with the overlaid `art-title` kept on top. An embedded **demo video** (`/videos/lumen-demo.*` + poster), dashboard + mic photos; `SignalPath` is a clean **CSS flow** diagram (`.lm-flow*`, three stages + arrow pills, stacks on mobile, no overlap); the two inline-SVG `.lm-dia*` diagrams — `CommandFlowchart` (command-parsing decision flow, with a "Multilingual input" annotation) and `HardwareHub` (pin-accurate wiring map, from `pinmap.md`) — render the full SVG on desktop but **reflow to a native stacked layout on phones** (`.lm-fc-m` flow / `.lm-hw-m` grouped pin-list; `@media ≤640px` hides `.lm-dia > svg`, so no shrink / sideways-scroll / overlap); a numbered **voice-pipeline** stepper (`.lm-steps`); the system prompt in a `PromptReveal` client component with a **Formatted / Code toggle** (formatted = a tiny built-in markdown renderer for headings/lists/`"quote"→JSON` example cards; code = the verbatim `SYSTEM_PROMPT` const) plus preview → fade → "show the full prompt" (collapse lives on `.lm-pr-content`, not the `<pre>`); the `LumenConsole` widget dramatises voice→JSON→room (its variable regions — `heard`, parsed-JSON screen, sensors — carry fixed reserves so cycling the demo never reflows the page). No image blanks remain. **No key-links row (private repo / time-boxed demo).** Listed in the homepage projects gallery + `ArticleRecommendations` as `proj-lumen` (card image `lumen-pf-context.webp`, school + Highlight) |
| `/beadreader` | `app/beadreader/page.tsx` → `ReadingTogether.tsx`, `SpicyGate.tsx` | Article: **BeadReader**, a private, invite-only online book reader (Next.js App Router + Tailwind v4 + Supabase Postgres/Storage + Cloudflare R2, custom HMAC-cookie auth). Bespoke warm **`paper` theme** (honey/amber/chestnut; green reserved for presence). Feature-showcase flagship: 8 chapters (private room / resume + reading themes / **reading together** / the SQL-enforced spicy gate / text + webtoon books / reading stats / offline + updates / the stack), real app screenshots as `art-fig`s (in `public/images/beadreader/`), GitHub + "Deploy your own" `ArticleLinks`. Hero + card use a designed promo graphic (`beadreader-cover.webp` / `beadreader-pf-context.webp`, both = `BeadreaderHeroandCard.png`, the "BeadReader by Shebang! LABS" lockup + phone mockups on black). The hero is **image-forward**: on desktop the promo's own wordmark leads and the `.art-title` h1 is sr-only (scoped `.br-hero` CSS in `page.tsx`); on phones the wide promo can't show its wordmark, so the backdrop zooms into the phones (`transform:scale`) and the gradient `.art-title` becomes visible instead. Official grey-bead mark is `beadreader-icon.png`. Bespoke widget `ReadingTogether` (scoped `.rt-*`) dramatises presence: an "Online now" panel with a same-book green ring + chapter badge and ephemeral wave/note bubbles (auto-cycles, pauses off-screen, no reflow, reduced-motion fallback). Second widget `SpicyGate` (scoped `.sg-*`, in the "spicy gate" chapter) dramatises the per-reader content gate: one chapter paragraph rendered three ways as you switch reader mode (Full access = blurred tap-to-reveal, No access = locked, Cal mode = removed entirely); same conventions. Listed in the homepage gallery + peek reader + `ArticleRecommendations` as `proj-beadreader` (personal + **Flagship** tier). Tool icons `nextjs/typescript/supabase/tailwind/cloudflare-icon.webp` |
| `/brolocator` | `app/brolocator/page.tsx` | Article: LoRA Messenger |
| `/csdp` | `app/csdp/page.tsx` | Article: EMA Smart Home (has team rows + embedded PDFs) |
| `/pandus` | `app/pandus/page.tsx` | Article: Pandus Dispenser |
| `/elecf` | `app/elecf/page.tsx` | Article: Elec-F Concept |
| `/comingsoon` | `app/comingsoon/page.tsx` | Placeholder (noindex) |
| 404 | `app/not-found.tsx` | Custom 404 |

- **`next.config.mjs`** keeps permanent redirects from the old `.html` URLs to the clean routes (`/ProjectJune.html` → `/project-june`, etc.). `/portfolio` and `/portfolio.html` both redirect to `/#portfolio-items-holder` (the portfolio page was removed; its content lives in the homepage Projects section).
- **`app/layout.tsx`** is the root layout: links `mainstyle.css`, renders `<ClientEffects/>`, `<Nav/>`, `{children}`, `<Footer/>`, plus Analytics/Speed Insights. It also holds site-wide `metadata` (metadataBase, OG defaults). There is **no page loader and no external CSS CDN** — both were removed for performance (the old `#loader` splash and the animate.css CDN link are gone).
- The legacy pre-Next root `*.html` files (`index.html`, `ProjectJune.html`, …) have been **removed**. `next.config.mjs` still redirects the old `.html` URLs to the clean routes for any stale inbound links.
- **`app/api/homelab-status/route.ts`** is the one dynamic endpoint (a serverless function): it pings the public `*.chiambucket.com` services server-side and returns up/down JSON for the homelab page's live status dots. Everything else still prerenders as static.

## Shared components (`components/`)

- **`ArticleRecommendations.tsx`** (`'use client'`) — renders a "More to explore" project card grid at the end of every article page. Self-contained: includes all project data, the peek-modal system (same chapter content as homepage), and a "Load more" button (shows 3 cards initially, all on click). Takes an `exclude` prop (the current article's project ID, e.g. `"proj-june"`). Import it at the bottom of any article `main` element.
- **`ProjectPeek.tsx`** (`'use client'`) — the shared "peek" reader (`PeekFeed`) used by BOTH the homepage gallery and `ArticleRecommendations`. Opening a peek shows ONLY the clicked project's reader, then a **"Load more projects"** button (`.hp-rd-feed-more`, reuses `.hp-btn`); pressing it reveals the rest of the gallery (still lazy-mounted per item) plus the END OF FEED marker. `PEEK_ORDER` + `TITLES` + a `PeekModalContent` switch case must include every project id. It is keyed by `startId` at the call sites, so the expand state resets on each open.
- **`ArticleLinks.tsx`** (server component) — a row of key-link pills (`ArtLink[]` with `type: 'github' | 'video' | 'demo' | 'cad' | 'download'`, each with `label` + `url`) surfaced in the article hero, just after `.art-toolrow`. First link renders as the primary (filled) pill; all open in a new tab. Each article page passes its own GitHub / demo / video / CAD links. Styles are `.art-links` / `.art-link` in the ARTICLE section of `mainstyle.css`.
- **`SensoryShell.tsx` / `SensoryAtmosphere.tsx`** (`'use client'`) — the site-wide shader field (see Stack). Do NOT mount per page; the single mount lives in `app/layout.tsx`. To add a theme palette, extend `PALETTES` in `SensoryAtmosphere.tsx` alongside the `html[data-theme]` block in `mainstyle.css`.
- **Corner HUD readouts (`.sa-hud`)** — bespoke `.sa-hud` blocks (children `.sa-hud-tl/tr/bl/br`, each holding short letterspaced mono `<span>` lines) sit in the hero of home/photography/homelab/contact/credits/404/comingsoon. The global `.sa-hud` CSS positions them at the page corners, hides them ≤760px, and boots the lines in with a staggered reveal. Article pages deliberately do NOT carry corner HUD text (removed at the owner's request). Keep any HUD lines short, facts only, no em dashes.
- **`Nav.tsx`** (`'use client'`) — the nav with hamburger toggle; uses Next `<Link>`. Restyled globally into a "console command bar" (indexed mono links) by the DARK SENSORY section; no markup changes needed for that.
- **`Footer.tsx`** (`'use client'`) — shared footer (logo, socials, credits link).
- **`LazyVideo.tsx`** (`'use client'`) — drop-in replacement for a decorative autoplaying `<video>` loop that defers its own weight. Props: `webm`, `mp4`, `poster`, optional `className` / `rootMargin`. The poster paints immediately; the `<source>`s are only injected once the element scrolls near the viewport (IntersectionObserver), and on **Save-Data** connections or **`prefers-reduced-motion`** the clip is never fetched at all (poster stands in). Used by the homepage About-bento media tiles (DaVinci, PowerPoint) and the photography hero montage. Renders a plain `<video>`, so existing CSS targeting those tiles still applies.
- **`ClientEffects.tsx`** (`'use client'`) — global effects: cursor spotlight, nav scroll glow, and the `[data-reveal]` scroll-reveal IntersectionObserver (re-runs on every route change via `usePathname`, so new pages animate in).
- **`ArticleScrollSpy.tsx`** (`'use client'`) — highlights the active chapter in article rails. It observes `<section>` elements and toggles `.article-chapter-selected` on `.article-chapter-wrapper a[href="#id"]`. Article rails therefore carry BOTH classes: `class="art-chapters article-chapter-wrapper"`.
- **`ArticleLightbox.tsx`** (`'use client'`, mounted once in `app/layout.tsx`) — global click-to-zoom for article images. A delegated listener opens any `<img>` inside `.art-body` in a full-screen viewer (click image to toggle a 2.4x loupe that follows the cursor; Esc/scrim/× to close). A floating magnifier cue tracks hovered images as the affordance. CSS (`.art-lb*`, `.art-zoom-cue`, the `cursor:zoom-in` hover-lift) lives in the ARTICLE section of `mainstyle.css`. Opt a subtree out with `data-no-zoom` (used by interactive widgets and tiny icon grids); linked images (`<a><img></a>`) are skipped automatically. Diagrams with transparent backgrounds get a light plate via class `art-diagram` (the lightbox carries it through with `.art-lb-img.lit`).
- **`InfoModal.tsx`** (`'use client'`) — a small, theme-aware detail pop-up (`InfoItem`: eyebrow, title, blurb, optional add / `media` (a wide image) / points / chips / icon, plus either a single `link` or a `links[]` button row, first primary then ghost, that auto-opens http(s) targets in a new tab). CSS-only enter/exit, portaled to `body`, ESC/scrim/× to close. Accents follow the page's `data-theme` via `--hp-*` tokens (blue on home, violet on photography). Used by the homepage **capability cards**, the homepage **About-bento tiles** (intro/engineering/microcontrollers/PowerPoint), and the photography **"My Tools" cards** (each card is `role="button"` with a hover-rotating `+` affordance). Styles are `.im-*` in `mainstyle.css`.
- **Article interactive widgets** (per-route `'use client'` components, not shared) — each flagship article embeds a bespoke framer-motion widget dramatizing its core mechanic: `app/elecf/SafetySequence.tsx` (door/timer stepper), `app/project-june/CommandLink.tsx` (5G signal-path + telemetry HUD), `app/brolocator/LinkDemo.tsx` (LoRa-text vs ESP-NOW-voice two-handset demo), `app/csdp/NodeMap.tsx` (BeagleBone hub-and-spoke node map with an alert simulation), `app/pandus/DispenseDemo.tsx` (dispense-cycle machine with cup-fill), `app/lumen/LumenConsole.tsx` (voice phrase → trigger/Whisper/DeepSeek/MQTT pipeline → parsed JSON → a live "room" panel of devices reacting), `app/beadreader/ReadingTogether.tsx` (live presence "Online now" panel) + `app/beadreader/SpicyGate.tsx` (per-reader content-gate: same passage as Full / No access / Cal mode). Convention when adding interactivity to an article: a scoped `<style>` block with a unique class prefix, `data-no-zoom` on the root, `--hp-*` theme-token accents (plus semantic colours where meaningful), transform/opacity-only animation with a `prefers-reduced-motion` fallback, auto-play that yields to manual control **and pauses when scrolled out of view** (gate the auto-advance interval on an `IntersectionObserver` `inView` state), and a single-column collapse at 390px. **Auto-cycling widgets must not reflow the page**: any region whose text changes per step (a paragraph, a wrapping chip row) needs a fixed reserve — the simplest is a hidden "sizer" with the longest content stacked in the same CSS-grid cell (`grid-area: 1/1`, `visibility:hidden`), so the block is always as tall as the worst case at any width (see `SafetySequence` desc + sensor sizers; `LumenConsole` uses fixed-height reserves). Insert inside an existing `<section>` (don't add a chapter to the scroll-spy rail).

## Design system (all in `public/mainstyle.css`)

The file is one large stylesheet, organised by comment sections. Four families matter:

- **DARK SENSORY / SIGNAL ARCHIVE** — the LAST section of the file and the one that defines the current site-wide look. Everything is keyed on `html.sensory-active` (set before paint in `app/layout.tsx`). Tokens: `--sa-accent` (an `R,G,B` triplet following `data-theme`; always use `rgba(var(--sa-accent),x)`, never hardcode accent rgba), `--sa-ember` (`255,106,61`, the ONLY warm accent, reserved for live/status/error moments like status dots, 404, the NEW chip), `--font-ddt` (terminal mono face), `--sa-panel-hi`/`--sa-panel-lo` (frosted panel gradient stops), `--sa-nav-a`/`--sa-nav-b` (nav command-bar surface), `--sa-btn` (button-hero fill), `--sa-hairline`. **All of these surface tokens are warm-charcoal by default** (they sit over the warm paper field); the `html.sensory-active[data-theme="indigo"], [data-theme="datacenter"]` block overrides them back to cool navy for `/contact` + `/homelab`. The nav, `.button-hero`, the frosted card family, and the `.im-panel`/`.hp-modal-panel` modals all read from these tokens, so surfaces follow the route theme (never hardcode a navy surface). It strips `.hp-band` fills (seams become signal hairlines), frosts every card family into instrument panels, turns `.hp-btn` into ghost terminal buttons, reskins the nav into a console command bar and the footer into an instrument panel, restyles `ct-*` heroes, fully reskins the `art-*` article template (bracketed back link, indexed chapter rail, `FIG ·` captions, hero covers mask-dissolving into the field), and provides `.sa-hud`/`.sa-hud-tl|tr|bl|br` corner-HUD classes plus `.sa-live`/`.sa-live-dot`. Panels use `backdrop-filter` over the live canvas, so keep new blurred surfaces to a reasonable count per view.

- **Homepage** — `HOMEPAGE REDESIGN v3 / v3.1 / v3.2 / v3.3` near the end. Tokens live in `:root` as `--hp-*` (`--hp-glass`, `--hp-line`, `--hp-blue`, `--hp-indigo`, `--hp-sky`, `--hp-ink`, …). Reusable: `.hp-band`, `.hp-section`, `.hp-eyebrow`, `.hp-btn` / `.hp-btn-ghost`, `.hp-md-tag.personal|.school|.highlight`, `.hp-pf-*` (project cards/grid), `.hp-cap-*`, `.hp-spot-*`, `.seh-*` / `.peh-*` (editorial section headers), `.icon-stack`.
- **Page heroes** — `.ct-wrap` + `.ct-aura` + `.ct-kicker` + `.ct-title` (with `<em>` gradient accent) + `.ct-sub` (contact/portfolio/photography/comingsoon/404 heroes). `.cr-*` for the credits cards. **Aura gotcha:** keep `<div class="ct-aura">` (or `hp-hero-aura`/`art-hero-aura`) as the first child and let the higher-specificity `> .aura` rule re-assert `position:absolute`, otherwise the `> *` `z-index:2` rule drops it into flow.
- **Articles** — `ARTICLE REDESIGN` section at the very end. Namespace `.art-*`: `.art-hero` (feature header: `.art-hero-bg` img + `.art-hero-scrim` + `.art-hero-aura` + `.art-hero-inner`), `.art-back`, `.art-title`, `.art-lead`, `.art-toolrow`; `.art-body` (2-col grid) with sticky `.art-rail` + `.art-chapters`; `.art-section` blocks (use `data-reveal`); `.art-fig`+`<figcaption>`, `.art-grid` (2-up image gallery), `.art-video` / `.art-embed` / `.art-embed.art-pdf`, `.art-repo` (GitHub callout), `.art-team*` (csdp team rows), `.art-next` (closing CTA). Images are height-capped (`max-height:76vh`, `width:auto`) so tall portrait shots don't blow up the page.

**When building/extending a page, REUSE these classes.** New bespoke CSS for a single page should be a scoped `<style>` block in that page's component with a unique prefix, not a global edit (avoids touching the shared file and prevents collisions).

## Per-page accent theming

Pages are recoloured by a single `data-theme` attribute on `<html>` so each route reads distinctly while staying cohesive. All hues are sampled from the **Frame 6 gradient** (navy → lavender → mauve → violet), saved in `temporary screenshots/Frame 6.png`.

- **`lib/theme.ts`** — `THEME_MAP` (route → theme name) + `themeForPath()`. **The site-wide default is now `paper`** (warm honey/amber/chestnut). `THEME_MAP` only overrides two routes: `/contact` = `indigo` and `/homelab` = `datacenter` (cyan + emerald, mission-control). Every other route (home, all articles, photography, credits, comingsoon, 404) falls through to `paper`. The older per-route palettes (`blue`/`violet`/`mauve`/`steel`) still exist as `html[data-theme]` blocks + `PALETTES` entries but are currently unused. Because accent uses were tokenised (see below), the whole site reads warm except the two cool exceptions. Green stays reserved for presence, ember for status.
- **No hardcoded accent colours.** Accent glows/borders/links use `rgba(var(--sa-accent), x)` (per-theme) or the `--hp-*` / `--em-grad` / `--title-grad` tokens, never a literal blue. The July 2026 warm-default pass converted the remaining hardcoded blues (`94,121,219` indigo, `127,168,255` / `140,170,255` sky, `0,107,179`/`10,126,199`/`10,95,176` blue, plus `#5e79db`/`#7fa8ff` colour uses) to those tokens so they follow the route theme.
- **Desktop scale.** The layout is rem/clamp based; `html` root font-size steps down on large screens (`93.75%` ≥1100px, `90.6%` ≥1600px) so the site doesn't read zoomed-in at 1080p. Mobile keeps the full 16px base.
- **Set in two places:** an inline `<script>` in `app/layout.tsx` `<head>` sets it before paint (no flash); `components/ClientEffects.tsx` updates it on client-side navigation (`themeForPath(pathname)`).
- **How it recolours:** `:root` in `mainstyle.css` defines `--aura-1/2/3` (hero/page auras), `--em-grad` + `--title-grad` (gradient accent words), `--orb-edge` (section-number stroke), and overrides `--hp-blue/-deep`, `--hp-indigo`, `--hp-sky`. Each `html[data-theme="…"]` block re-points those tokens. **To theme a new page:** add its route to `THEME_MAP`; to add a new palette, add a `html[data-theme="…"]` block next to the others. Auras/buttons/links/gradient text follow automatically — don't hardcode accent rgba values, use the tokens.
- **The shader field follows the same themes:** `PALETTES` in `components/SensoryAtmosphere.tsx` maps each theme name to six shader colour stops, and `html.sensory-active[data-theme="…"]` blocks in the DARK SENSORY section re-point `--sa-accent`. When adding a theme, update BOTH (plus the `--aura` block above, which feeds the reduced-motion fallback mesh).
- The homepage hero has a drifting aura plus two free-floating orbs (`.hp-hero::before/::after`); the photography hero has a masked photo-montage backdrop (`index-photos-gif.webm`) + grain. Big section numbers (`.seh-number`/`.peh-number`) are dim with a luminous `-webkit-text-stroke` edge (var `--orb-edge`) for legibility.

## SEO / AI scraping

- **`public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`** — these MUST live in `public/` (Next only serves `public/` at the root; copies in the repo root return 404). Keep `sitemap.xml` and `llms.txt` in sync with clean routes whenever you add/rename a page.
- **Metadata**: server components export `const metadata: Metadata`. A page that needs client interactivity is split into a server `page.tsx` (which owns `metadata`) + a `*Client.tsx` (`'use client'`) child — see `app/page.tsx`/`HomeClient.tsx`, `app/contact/`, `app/photography/`. Never put `metadata` in a `'use client'` file (it silently does nothing).
- **JSON-LD**: injected via `<script type="application/ld+json" dangerouslySetInnerHTML=...>`. Home = `Person` + `WebSite`; article pages = `Article`; portfolio = `ItemList`; photography = `ImageGallery`. Mirror the existing block when adding a page.

## CSS conventions

- Single file `public/mainstyle.css`; sections delineated by comments.
- Fonts via local `@font-face`: `oswaldreg`, `oswaldbold`, `inter`, `dmsans`, `gcreg`, `ddt`, `GreaterTheory`, `mextrine`, `monda`, `roboto` (in `public/fonts/`).
- Pair a display face (oswald/gcreg) with a body face (dmsans/inter). Tight tracking on big headings, generous line-height on body.
- Colors: pure black `#000`, off-white text `#e8e8e8`/`#d8d8d8`, accent blue `#0a7ec7`/`#006bb3`, indigo `#5e79db`, sky `#7fa8ff`. Glassmorphism via `var(--hp-glass)` + `backdrop-filter`.
- Responsive: mobile nav is a hamburger; layouts collapse to single column. Always verify mobile (390px).

## Assets (`public/`)

- `public/images/` — all images, icons, videos (webm/mp4) and their poster stills
- `public/fonts/` — local fonts
- `public/downloadable/` — PPTX/PDF downloads
- `public/mainstyle.css` — the global stylesheet

**Media perf rules:** animated content is **always `.webm` + `.mp4`, never `.gif`** (GIFs are an order of magnitude heavier; the old redundant GIF twins were deleted and `*.gif` is `.vercelignore`d as a backstop). Decorative autoplay loops use `<LazyVideo>` (in-view loading + Save-Data/reduced-motion fallback to a poster) rather than a raw `<video autoPlay>`. When adding a clip, generate a small poster still (`ffmpeg -i clip.webm -vframes 1 ... → cwebp`) and pass it to `LazyVideo`.

## Local development

- **Dev server:** `npm run dev` (Next defaults to port 3000; this project is often run on **3001**). The user starts it themselves — do not start a second instance or restart it.
- **Do NOT run `npm run build` (`next build`) while the dev server is running** — build overwrites `.next` and the dev server starts serving 500s until it is restarted. For type validation use `npx tsc --noEmit` instead.

## Screenshot workflow

- Puppeteer is at `/opt/homebrew/lib/node_modules/puppeteer`.
- **`shot.mjs`** (the one screenshot helper) — `node shot.mjs <url> <label> [desktop|mobile|WxH] [full]`. It scrolls the page first so `[data-reveal]` sections animate in and lazy images load. Scroll to a section with `SCROLLY=<px> node shot.mjs <url> <label> desktop`. Saves to `temporary screenshots/screenshot-N-…png` (auto-incremented).
- Always screenshot from `http://localhost:<port>`, never `file:///`. After capturing, Read the PNG and compare against the homepage / `project-june` reference; fix mismatches and re-shoot (≥2 passes).

## Deployment

- Static-friendly Next.js app on **Vercel** (every route prerenders as static). `npm run build` must pass.
- `vercel.json` sets security headers. `.vercelignore` keeps dev tooling (`shot.mjs`, `temporary screenshots/`, PDFs, `*.gif`) out of the deploy.

## Pages still incomplete / placeholders

- These project articles still point to `/comingsoon`: Kauli, Series One Light, Copy Board, Web Development, Minecraft.

## Copy / content conventions

- **No em dashes (`—`).** Use commas or split into sentences. Applies to all user-facing copy.
- When adding a page: update `public/sitemap.xml` + `public/llms.txt`, add the right JSON-LD, and ensure `metadata` is on a server component.

## After every change — checklist

Run through this after ANY code change before reporting done:

1. **Mobile responsiveness** — check the affected page at 390px width. Layouts must collapse gracefully; no overflow, truncated text, or broken spacing.
2. **SEO / AI crawlers** — if a page was added or renamed: update `public/sitemap.xml`, `public/llms.txt`, ensure the page's server component exports `metadata` with title + description + canonical, and has JSON-LD structured data.
3. **No em dashes in rendered copy** — use commas or split sentences. Never `—` in any text visible to the user.
4. **Update CLAUDE.md** — if the architecture, routing, components, or CSS conventions changed, reflect it here.
5. **Update README.md** — if user-facing information (stack, deploy steps, routes, features) changed, update it.

## Always do first

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Working style

- **Use subagents when it helps.** Spawn Sonnet or Haiku agents to parallelise or offload well-scoped actions/coding (research, repetitive edits, asset prep). Keep creative CSS that needs cohesion + screenshot iteration on the main thread; avoid multiple agents editing `mainstyle.css` at once (merge conflicts).
- **Use any skills the task needs**, including newer ones like image generation (`gpt-image-2`) for custom assets/textures, and `ui-ux-pro-max` for design reference. `frontend-design` is still mandatory first.
- **Iterate on every design** until it's clean and pleasing on **both desktop and mobile (390px)**: screenshot with `shot.mjs`, Read the PNG, fix mismatches, re-shoot — at least two passes. Check the affected page at both widths before reporting done.

## Reference images

- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content. Do not improve or add to the design.
- If no reference: design from scratch with high craft (see guardrails). For this site, "the reference" is usually the homepage / `project-june` editorial language — match it.
- Screenshot your output, compare against the reference, fix mismatches, re-screenshot. At least 2 rounds.

## Anti-generic guardrails

- **Colors:** custom brand palette only (never default Tailwind indigo/blue).
- **Shadows:** layered, color-tinted, low opacity (never flat `shadow-md`).
- **Typography:** distinct display + body pairing; tight tracking on large headings, line-height ~1.7 on body.
- **Gradients/texture:** layered radial gradients, subtle grain/aura for depth.
- **Animations:** only `transform` and `opacity`; spring-style easing; never `transition-all`.
- **Interactive states:** every clickable element needs hover, focus-visible, and active states.
- **Images:** gradient overlay/scrim for legibility over photos.
- **Depth:** a layering system (base → elevated → floating), not one flat z-plane.

## Hard rules

- Do not add sections/features/content not asked for; match the reference, don't "improve" it.
- Do not stop after one screenshot pass.
- Do not use `transition-all` or default Tailwind blue/indigo as primary color.
