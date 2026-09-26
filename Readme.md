# Chiambucket

Personal portfolio and website for Braven Chiam, deployed on Vercel. The site is moving to a paper design ("Press": risograph prints of Braven's photographs rendered in code, fine engraved hatching, an image-led editorial layout set in Newsreader). The homepage has moved (same sections and copy as before, new presentation); the other pages still use the dark "Dark Sensory / Signal Archive" design (a WebGL shader-gradient field, frosted panels, terminal HUD type).

**Live site:** [chiambucket.com](https://chiambucket.com)

---

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — `app/` directory, server components by default
- **framer-motion** — available for React animations (CSS handles most transitions)
- **Press design** — `app/press.css` plus `components/press/`: `RisoPrint` separates a photo into riso inks (yellow, fluorescent pink, blue) and paints them per pixel as fine canvas halftones. Newsreader loads through `next/font`; DM Sans is local
- **WebGL sensory field** — a fixed full-viewport fragment shader (`components/SensoryAtmosphere.tsx`) recolours per route and crossfades on navigation; static CSS fallback for reduced motion
- **Vercel Analytics + Speed Insights** — loaded in `app/layout.tsx`
- **Lychee** — self-hosted photo galleries embedded via a remote script (loaded after paint, non-blocking)
- **No Tailwind, no CSS-in-JS** — one global stylesheet, `public/mainstyle.css`
- **Vercel** — every route prerenders as static

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. Use `npx tsc --noEmit` to type-check without disturbing a running dev server (don't run `next build` while `npm run dev` is live).

## Structure

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout — stylesheet links, loader, Nav/Footer, Analytics, sets per-page theme |
| `app/page.tsx` → `app/HomeClient.tsx` | Homepage (press design, same structure as before): riso hero, what I do, 01 about bento, 02 projects (spotlights, capabilities, searchable and filterable cards with the peek reader), collaborators, homelab, 03 live Lychee gallery, call to action |
| `app/press.css`, `components/press/` | Press design system: tokens, cards, buttons, hatching, `RisoPrint`, press nav and footer, paper versions of the shared pop-ups |
| `app/<route>/page.tsx` | File-based routes (`/photography`, `/contact`, `/credits`, `/homelab`, article pages) |
| `components/` | Shared `Nav`, `Footer`, `ClientEffects`, `SensoryShell`/`SensoryAtmosphere`, `ArticleRecommendations`, `ArticleScrollSpy` |
| `lib/theme.ts` | Per-page accent theme map (`data-theme` on `<html>`) and `PRESS_ROUTES`, the routes already on the press design |
| `public/mainstyle.css` | Single global stylesheet (~6300 lines) |
| `public/` | Images, fonts, downloads, `robots.txt` / `sitemap.xml` / `llms.txt` |
| `next.config.mjs` | Permanent redirects from the old `.html` URLs to clean routes |
| `vercel.json` | Security headers |

Article pages: `/project-june`, `/lumen`, `/beadreader`, `/brolocator`, `/csdp`, `/pandus`, `/elecf`.

## Theming

Routes listed in `PRESS_ROUTES` (`lib/theme.ts`) get `html.press` instead of the dark field: paper background, press nav and footer, styles from `app/press.css`. Every other route maps to a named accent theme (`blue`, `violet`, `indigo`, `mauve`, `steel`) via `lib/theme.ts`, written to `<html data-theme="…">` and resolved by CSS-variable blocks in `mainstyle.css`. Hues are sampled from a saved navy → lavender → mauve → violet gradient so pages read distinctly while staying cohesive.

## Deployment

Static-friendly Next.js app on Vercel; `npm run build` must pass. Dev tooling (`serve.mjs`, `screenshot*.mjs`, `shot.mjs`, scratch files) is excluded from deploys via `.vercelignore`.
