# Chiambucket — Project Overview

Personal portfolio/personal website for Braven Chiam. Dark-themed, design-forward ("Refined Editorial Dark"). Built with Next.js and deployed on Vercel.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — `app/` directory, server components by default
- **Vercel Analytics + Speed Insights** — loaded in `app/layout.tsx`
- **framer-motion** — installed (`framer-motion`); available for React animations when CSS isn't enough. Prefer CSS for simple transitions; reach for it for orchestrated/gesture/layout animations.
- **animate.css** — loaded from CDN (a few entrance animations)
- **Lychee** — self-hosted photo gallery embedded via a remote script (homepage + photography)
- **No Tailwind, no CSS-in-JS.** One global stylesheet: `public/mainstyle.css` (~5900 lines)
- jQuery is **gone** — the old jQuery `.load()` includes were replaced by React components. `links.js`/`nav.html`/`footer.html`/`projects.js` etc. are legacy and no longer used by the app.

## Routing (Next.js App Router)

Routes are file-based under `app/<route>/page.tsx`. There is no `links.js` router anymore.

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` → `app/HomeClient.tsx` | Homepage (`hp-*` classes): hero, disciplines, About bento, Projects (spotlight + capabilities + filterable gallery + chaptered reader modal), HomeLab band, switchable photography gallery, CTA |
| `/photography` | `app/photography/page.tsx` → `PhotographyClient.tsx` | Editorial hero + "My Tools" cards + six Lychee galleries |
| `/contact` | `app/contact/page.tsx` → `ContactClient.tsx` | Email + socials (`ct-*`) |
| `/credits` | `app/credits/page.tsx` | Colophon (`cr-*` + shared `ct-*` hero): built with Claude, hosted on Vercel, open-source tools |
| `/homelab` | `app/homelab/page.tsx` → `HomelabClient.tsx` | HomeLab — the most interactive page. Bespoke **"datacenter" theme** (`hl2-*`/`dc-*`). Server `page.tsx` owns metadata + JSON-LD; client renders hero, mission pillars, machine cards (real server photos), the **interactive `SystemMap`**, storage/PXE, the filterable service stack with **live status dots**, and access methods. Content lives in `app/homelab/data.ts`; styles in `app/homelab/homelab.css` (imported, not in `mainstyle.css`); animations via **framer-motion** |
| `/project-june` | `app/project-june/page.tsx` | Article: Project June 5G rover — **the gold-standard `art-*` article template** |
| `/brolocator` | `app/brolocator/page.tsx` | Article: LoRA Messenger |
| `/csdp` | `app/csdp/page.tsx` | Article: EMA Smart Home (has team rows + embedded PDFs) |
| `/pandus` | `app/pandus/page.tsx` | Article: Pandus Dispenser |
| `/elecf` | `app/elecf/page.tsx` | Article: Elec-F Concept |
| `/comingsoon` | `app/comingsoon/page.tsx` | Placeholder (noindex) |
| 404 | `app/not-found.tsx` | Custom 404 |

- **`next.config.mjs`** keeps permanent redirects from the old `.html` URLs to the clean routes (`/ProjectJune.html` → `/project-june`, etc.). `/portfolio` and `/portfolio.html` both redirect to `/#portfolio-items-holder` (the portfolio page was removed; its content lives in the homepage Projects section).
- **`app/layout.tsx`** is the root layout: links `mainstyle.css` + animate.css, renders the `#loader`, `<ClientEffects/>`, `<Nav/>`, `{children}`, `<Footer/>`, plus Analytics/Speed Insights. It also holds site-wide `metadata` (metadataBase, OG defaults).
- Legacy root `*.html` files (`index.html`, `ProjectJune.html`, …) are **dead** — Next does not serve them; they remain only as historical reference.
- **`app/api/homelab-status/route.ts`** is the one dynamic endpoint (a serverless function): it pings the public `*.chiambucket.com` services server-side and returns up/down JSON for the homelab page's live status dots. Everything else still prerenders as static.

## Shared components (`components/`)

- **`ArticleRecommendations.tsx`** (`'use client'`) — renders a "More to explore" project card grid at the end of every article page. Self-contained: includes all project data, the peek-modal system (same chapter content as homepage), and a "Load more" button (shows 3 cards initially, all on click). Takes an `exclude` prop (the current article's project ID, e.g. `"proj-june"`). Import it at the bottom of any article `main` element.
- **`Nav.tsx`** (`'use client'`) — the nav with hamburger toggle; uses Next `<Link>`.
- **`Footer.tsx`** (`'use client'`) — shared footer (logo, socials, credits link).
- **`ClientEffects.tsx`** (`'use client'`) — global effects: page-loader fade, cursor spotlight, nav scroll glow, and the `[data-reveal]` scroll-reveal IntersectionObserver (re-runs on every route change via `usePathname`, so new pages animate in).
- **`ArticleScrollSpy.tsx`** (`'use client'`) — highlights the active chapter in article rails. It observes `<section>` elements and toggles `.article-chapter-selected` on `.article-chapter-wrapper a[href="#id"]`. Article rails therefore carry BOTH classes: `class="art-chapters article-chapter-wrapper"`.

## Design system (all in `public/mainstyle.css`)

The file is one large stylesheet, organised by comment sections. Three families matter:

- **Homepage** — `HOMEPAGE REDESIGN v3 / v3.1 / v3.2 / v3.3` near the end. Tokens live in `:root` as `--hp-*` (`--hp-glass`, `--hp-line`, `--hp-blue`, `--hp-indigo`, `--hp-sky`, `--hp-ink`, …). Reusable: `.hp-band`, `.hp-section`, `.hp-eyebrow`, `.hp-btn` / `.hp-btn-ghost`, `.hp-md-tag.personal|.school|.highlight`, `.hp-pf-*` (project cards/grid), `.hp-cap-*`, `.hp-spot-*`, `.seh-*` / `.peh-*` (editorial section headers), `.icon-stack`.
- **Page heroes** — `.ct-wrap` + `.ct-aura` + `.ct-kicker` + `.ct-title` (with `<em>` gradient accent) + `.ct-sub` (contact/portfolio/photography/comingsoon/404 heroes). `.cr-*` for the credits cards. **Aura gotcha:** keep `<div class="ct-aura">` (or `hp-hero-aura`/`art-hero-aura`) as the first child and let the higher-specificity `> .aura` rule re-assert `position:absolute`, otherwise the `> *` `z-index:2` rule drops it into flow.
- **Articles** — `ARTICLE REDESIGN` section at the very end. Namespace `.art-*`: `.art-hero` (feature header: `.art-hero-bg` img + `.art-hero-scrim` + `.art-hero-aura` + `.art-hero-inner`), `.art-back`, `.art-title`, `.art-lead`, `.art-toolrow`; `.art-body` (2-col grid) with sticky `.art-rail` + `.art-chapters`; `.art-section` blocks (use `data-reveal`); `.art-fig`+`<figcaption>`, `.art-grid` (2-up image gallery), `.art-video` / `.art-embed` / `.art-embed.art-pdf`, `.art-repo` (GitHub callout), `.art-team*` (csdp team rows), `.art-next` (closing CTA). Images are height-capped (`max-height:76vh`, `width:auto`) so tall portrait shots don't blow up the page.

**When building/extending a page, REUSE these classes.** New bespoke CSS for a single page should be a scoped `<style>` block in that page's component with a unique prefix, not a global edit (avoids touching the shared file and prevents collisions).

## Per-page accent theming

Pages are recoloured by a single `data-theme` attribute on `<html>` so each route reads distinctly while staying cohesive. All hues are sampled from the **Frame 6 gradient** (navy → lavender → mauve → violet), saved in `temporary screenshots/Frame 6.png`.

- **`lib/theme.ts`** — `THEME_MAP` (route → theme name) + `themeForPath()`. Themes: `blue` (default), `violet`, `indigo`, `mauve`, `steel`, `datacenter`. Home and `project-june` stay `blue` (the signature/flagship); photography = `violet`, contact/credits/brolocator = `indigo`, csdp = `mauve`, pandus = `steel`, elecf = `violet`, homelab = `datacenter` (cyan + emerald, mission-control).
- **Set in two places:** an inline `<script>` in `app/layout.tsx` `<head>` sets it before paint (no flash); `components/ClientEffects.tsx` updates it on client-side navigation (`themeForPath(pathname)`).
- **How it recolours:** `:root` in `mainstyle.css` defines `--aura-1/2/3` (hero/page auras), `--em-grad` + `--title-grad` (gradient accent words), `--orb-edge` (section-number stroke), and overrides `--hp-blue/-deep`, `--hp-indigo`, `--hp-sky`. Each `html[data-theme="…"]` block re-points those tokens. **To theme a new page:** add its route to `THEME_MAP`; to add a new palette, add a `html[data-theme="…"]` block next to the others. Auras/buttons/links/gradient text follow automatically — don't hardcode accent rgba values, use the tokens.
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

- `public/images/` — all images, icons, GIFs, videos (webm/mp4)
- `public/fonts/` — local fonts
- `public/downloadable/` — PPTX/PDF downloads
- `public/mainstyle.css` — the global stylesheet

## Local development

- **Dev server:** `npm run dev` (Next defaults to port 3000; this project is often run on **3001**). The user starts it themselves — do not start a second instance or restart it.
- **Do NOT run `npm run build` (`next build`) while the dev server is running** — build overwrites `.next` and the dev server starts serving 500s until it is restarted. For type validation use `npx tsc --noEmit` instead.

## Screenshot workflow

- Puppeteer is at `/opt/homebrew/lib/node_modules/puppeteer`.
- **`shot.mjs`** (preferred) — `node shot.mjs <url> <label> [desktop|mobile|WxH] [full]`. It scrolls the page first so `[data-reveal]` sections animate in and lazy images load. Scroll to a section with `SCROLLY=<px> node shot.mjs <url> <label> desktop`. Saves to `temporary screenshots/screenshot-N-…png` (auto-incremented).
- `screenshot.mjs` — the older desktop-only, top-of-page helper.
- Always screenshot from `http://localhost:<port>`, never `file:///`. After capturing, Read the PNG and compare against the homepage / `project-june` reference; fix mismatches and re-shoot (≥2 passes).

## Deployment

- Static-friendly Next.js app on **Vercel** (every route prerenders as static). `npm run build` must pass.
- `vercel.json` sets security headers. `.vercelignore` keeps dev tooling (`serve.mjs`, `screenshot*.mjs`, `shot.mjs`, `temporary screenshots/`, scratch HTML, PDFs) out of the deploy.

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
