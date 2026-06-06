# Chiambucket — Project Overview

Personal portfolio/personal website for Braven Chiam. Dark-themed, design-forward, self-hosted on a homelab server.

## Stack

- **Pure HTML + CSS + vanilla JS** — no build tools, no frameworks
- **jQuery 3.7.1** — loaded from CDN, used for DOM manipulation and AJAX includes
- **animate.css** — loaded from CDN for some entrance animations
- **No package.json, no bundler, no TypeScript**

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage (redesigned, `hp-*` classes) — hero, "what I do" disciplines, About bento, Projects (flagship spotlight + Capabilities showcase + filterable gallery + chaptered reader modal), HomeLab band, switchable Photography gallery, CTA |
| `contact.html` | Contact page — email `braven@chiambucket.com` + socials (uses `ct-*` classes) |
| `credits.html` | Colophon / content credits (uses `cr-*` + shared `ct-*` hero) — built with Claude Opus 4, hosted on Vercel, open-source tools. Linked from the footer's "Credits to content" button (`ContentCredits` route) |
| `photography.html` | Photography page — collage, albums (Europe, China, NZ, etc.) |
| `homelab.html` | HomeLab page — server cards, Docker apps showcase |
| `portfolio.html` | Standalone portfolio page (separate from index section) |
| `Brolocator.html` | Article: LoRA Messenger project |
| `ProjectJune.html` | Article: Project June RC vehicle |
| `csdp.html` | Article: EMA Smart Home System (school project) |
| `pandus.html` | Article: Pandus Dispenser (school project) |
| `comingsoon.html` | Placeholder for unfinished pages |
| `404.html` | Custom 404 page |
| `footer.html` | Shared footer — loaded via jQuery `.load()` on all pages |
| `mainstyle.css` | Single global stylesheet for the entire site (~5400 lines). Homepage redesign lives in the `HOMEPAGE REDESIGN v3` / `v3.1` / `v3.2` sections at the end (`hp-*`, `ct-*`) |
| `links.js` | Centralised URL/route config + all global JS functions |
| `projects.js` | Homepage Projects gallery: search, filter (with transition animation) + chaptered reader modal (loaded only on `index.html`) |
| `banner.js` | Banner-making utility |
| `banner-making.html` | Interactive banner-maker tool (dev utility) |
| `elecf.html` | Article: Elec-F Concept project |
| `vercel.json` / `.vercelignore` | Vercel deploy config (static, no build): long-cache headers for assets, security headers; `.vercelignore` excludes dev tooling |
| `robots.txt` / `sitemap.xml` / `llms.txt` | SEO + AI-crawler files (keep `sitemap.xml` and `llms.txt` in sync when adding pages) |

(`aboutme.html` was removed — its content lives in the homepage About bento; do not re-add links to it.)

## Routing / Navigation

All navigation is handled in `links.js` — URLs are stored as variables (e.g. `let Photography = "photography.html"`) and navigated with `window.location`. To add a new page or change a URL, update `links.js`.

## Shared Components

- **Nav**: `nav.html` is injected via `$("#nav-holder").load("nav.html")` in `links.js`. Every page needs `<div class="nav-holder" id="nav-holder"></div>` and a `<script src="links.js">` to get the nav.
- **Footer**: `footer.html` is injected via `$("#footers").load("footer.html")` in `links.js`. Every page needs `<div id="footers"></div>` and a `<script src="links.js">` to get the footer.

## CSS Conventions

- Single file `mainstyle.css` — sections are delineated by comments (e.g. `/* Photography */`, `/* Homelab */`, `/* Portfolio */`)
- CSS custom properties (variables) are minimal — only font sizes in `:root` and some component-level `--var` patterns
- Fonts loaded via `@font-face` from local `/fonts/` folder: `oswaldreg`, `oswaldbold`, `inter`, `dmsans`, `GreaterTheory`, `gcreg`, `ddt`, `mextrine`, `monda`, `roboto`
- Color scheme: pure black background (`#000`), off-white text (`#e8e8e8`, `#d8d8d8`), accent blue (`#006bb3`, `#5e79db`)
- Gradients and `backdrop-filter: blur()` used heavily for glassmorphism effects
- Responsive breakpoints exist — mobile nav switches to hamburger menu

## JS Patterns

- **Homepage Projects gallery** (`projects.js`): cards are `.hp-pf-card` with `data-type` (personal/school), optional `data-highlight="1"`, `data-search` keywords, and `data-article` (full-article URL). `setProjectFilter()`/`filterProjects()` handle the filter chips + search box (filter changes fade + stagger-in via the `.just-shown` animation). Two actions per card: the **"Peek summary"** button (`.hp-pf-peek`, a hover overlay on the thumb on desktop, persistent on touch via `@media (hover:none)`) calls `openProject()` to open the chaptered reader modal (`#hp-modal`); the footer **"Read article"** button calls `openArticle()` which navigates to the card's `data-article`. The modal clones each card's `<template class="hp-pf-detail">`, a reader of `.hp-rd-hero` image + `.hp-rd-chapter` blocks (optional `.hp-rd-fig` images) + a persuasive `.hp-rd-cta`. To add a project, copy a `.hp-pf-card` block in `index.html` (set `data-article`); no JS edits needed. Give a card an `id` to open its reader from elsewhere, e.g. the flagship spotlight calls `openProject('proj-june')`.
- **Projects grid is flexbox** (`.hp-pf-grid { display:flex; justify-content:center }`), not grid, so partial rows stay centered. Cards are `box-sizing:border-box` with `flex: 0 1 calc((100% - 38px)/3)`. Note: the band keeps the legacy `id="portfolio-items-holder"` (nav anchor), whose old CSS is neutralized by `#portfolio-items-holder.hp-projects-band { ... }`.
- **Flagship spotlight + Capabilities**: the Projects section opens with `.hp-spotlight` (a featured Project June card) and `.hp-cap` (a skills-by-category showcase, anchored `#capabilities`), both built from the resume content.
- The old `toggleCard(contentId, menuId)` inline expand pattern is no longer used on the homepage (replaced by the gallery + modal); it is still referenced by other pages.
- **Photography gallery switcher** (inline script at the bottom of `index.html`): `switchGallery(key, btn)` swaps the embedded Lychee album in place using `window.LycheeEmbed.createLycheeEmbed(node, {albumId})`, with a fade transition on `#hp-gallery-stage`. Album IDs are in the script; the mount node deliberately omits `data-lychee-embed` so the library's auto-init skips it.
- Photo album expand: `expandPhoto(albumId)` in `links.js` removes `photography-restrict` class; `expandphoto()` (no args) handles the main highlights embed separately
- All navigation uses `navigate(url)` in `links.js`; named shortcuts (`BucketCentralOnClick` etc.) kept for HTML onclick compatibility
- Scroll-spy for article chapters uses `IntersectionObserver` in `links.js`
- **Word rotators** (inline script in `index.html`): the script drives every `.hp-roll` on the page (hero "Creating with Intention." and the closing CTA "make something with intention."), cycling the synonyms in each one's `data-words` attr, animating out/in (`.is-out`/`.is-in`) and tweening the container width. Respects `prefers-reduced-motion`. The rotating `<em>` needs a roomy `line-height` (1.28) so the gradient (`background-clip:text`) doesn't slice off tall letter tops. A few other small touches live in the `v3.3` CSS: hero-kicker sheen, spotlight star pulse, staggered capability-card reveal.
- **Aura gotcha** (`.hp-hero`, `.ct-wrap`, `.cr-hero`): each wrapper has a `> *` rule forcing children to `position: relative; z-index: 2`, which overrides the `.ct-aura`/aura's own `position: absolute` (equal specificity) and drops the 600px-tall aura into flow, pushing content way down. Always re-assert `position: absolute` on the aura with a `> .aura` selector (higher specificity).
- Page loader: `#loader` div with `fadeOut()` on window load

## Assets

- `/images/` — all site images, icons, GIFs, banners
- `/fonts/` — all local font files
- `/downloadable/` — files users can download (PPTX, PDF)

## Pages Still Incomplete / Placeholders

Several article links point to `comingsoon.html`:
- BucketCentral, Kauli, THT, ELECF, SOL, Minecraft, Copyboard article pages
- `contact.html` and `credits.html` are now real pages (credits = the `ContentCredits` route, linked from the footer).

## Copy / Content Conventions

- **No em dashes (`—`).** Prefer commas (or split into sentences). This applies to all user-facing copy.
- When adding pages, update `sitemap.xml` and `llms.txt`, and keep the JSON-LD schema in `<head>` accurate.

## Known Quirks

- `mainstyle.css` is one large file — styles for all pages live here, organised by comment sections
- Navigation links in HTML use `onclick="navigate(VariableName); return false;"` with real `href` fallbacks
- The homepage was redesigned ("Refined Editorial Dark", `hp-*` classes). The old homepage classes (`.hero`, `.index-*`, `.abm-top*`, `.portfolio-items2`/`.pf-*`) remain in `mainstyle.css` for other pages but are no longer used by `index.html`
- `testing.html` and `testing2.html` are dev scratch files, not part of the real site

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Deployment
- The site is a static site, deployable to **Vercel** with no build step (framework preset "Other", no build command, output = repo root).
- `vercel.json` sets long-cache headers for static assets and basic security headers; `cleanUrls` is intentionally **off** because links use explicit `.html` (e.g. `navigate("photography.html")`).
- `.vercelignore` keeps dev tooling (`serve.mjs`, `screenshot*.mjs`, `temporary screenshots/`, scratch HTML, PDFs) out of the deploy. `404.html` is served automatically by Vercel.

## Screenshot Workflow
- Puppeteer is installed globally at `/opt/homebrew/lib/node_modules/puppeteer`. Chrome cache is at `~/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
