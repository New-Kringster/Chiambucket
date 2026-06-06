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
| `index.html` | Homepage — hero, about-me bento grid, portfolio cards |
| `photography.html` | Photography page — collage, albums (Europe, China, NZ, etc.) |
| `homelab.html` | HomeLab page — server cards, Docker apps showcase |
| `portfolio.html` | Standalone portfolio page (separate from index section) |
| `Brolocator.html` | Article: LoRA Messenger project |
| `ProjectJune.html` | Article: Project June RC vehicle |
| `csdp.html` | Article: EMA Smart Home System (school project) |
| `pandus.html` | Article: Pandus Dispenser (school project) |
| `aboutme.html` | Standalone about-me page |
| `comingsoon.html` | Placeholder for unfinished pages |
| `404.html` | Custom 404 page |
| `footer.html` | Shared footer — loaded via jQuery `.load()` on all pages |
| `mainstyle.css` | Single global stylesheet for the entire site (~4000 lines) |
| `links.js` | Centralised URL/route config + all global JS functions |
| `banner.js` | Banner-making utility |

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

- Dropdown expand/collapse for portfolio cards: `toggleCard(contentId, menuId)` in `links.js` toggles `pf-hidden-content-shown` and `portfolio-items2-open` classes
- Photo album expand: `expandPhoto(albumId)` in `links.js` removes `photography-restrict` class; `expandphoto()` (no args) handles the main highlights embed separately
- All navigation uses `navigate(url)` in `links.js`; named shortcuts (`BucketCentralOnClick` etc.) kept for HTML onclick compatibility
- Scroll-spy for article chapters uses `IntersectionObserver` in `links.js`
- Page loader: `#loader` div with `fadeOut()` on window load

## Assets

- `/images/` — all site images, icons, GIFs, banners
- `/fonts/` — all local font files
- `/downloadable/` — files users can download (PPTX, PDF)

## Pages Still Incomplete / Placeholders

Several article links point to `comingsoon.html`:
- BucketCentral, ContentCredits, Kauli, THT, ELECF, SOL, Minecraft, Copyboard article pages

## Known Quirks

- `mainstyle.css` is one large file — styles for all pages live here, organised by comment sections
- Navigation links in HTML use `onclick="navigate(VariableName); return false;"` with real `href` fallbacks
- The `aboutme-top-holder` grid has a hardcoded `height: 5968px` — changes to the bento grid likely require adjusting this
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

## Screenshot Workflow
- Puppeteer is installed globally at `/opt/homebrew/lib/node_modules/puppeteer`. Chrome cache is at `~/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

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
