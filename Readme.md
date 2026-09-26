# Chiambucket

Personal portfolio and website for Braven Chiam, deployed on Vercel. The site is moving to a light design. This branch (`redesign/swiss`) tries the Swiss style: Host Grotesk on a twelve-column grid, black on off-white with one spot red, and a red and black halftone print of Braven's photographs rendered in code. The homepage has moved; the other pages still use the dark "Dark Sensory / Signal Archive" design (a WebGL shader-gradient field, frosted panels, terminal HUD type).

**Live site:** [chiambucket.com](https://chiambucket.com)

---

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — `app/` directory, server components by default
- **framer-motion** — available for React animations (CSS handles most transitions)
- **Swiss design** — `app/swiss.css`, `components/swiss/` (nav, footer) and `components/press/RisoPrint.tsx`, which paints photos as halftone prints on canvas (red and black duotone for the hero). Host Grotesk loads through `next/font`
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
| `app/page.tsx` → `app/HomeClient.tsx` | Homepage (Swiss design): the name set large, lede and index, a red and black print you can advance, about, selected work, a photo grid, the homelab, say hello |
| `app/swiss.css`, `components/swiss/`, `components/press/` | Swiss design system: tokens, the grid, nav and footer, the halftone print |
| `app/<route>/page.tsx` | File-based routes (`/photography`, `/contact`, `/credits`, `/homelab`, article pages) |
| `components/` | Shared `Nav`, `Footer`, `ClientEffects`, `SensoryShell`/`SensoryAtmosphere`, `ArticleRecommendations`, `ArticleScrollSpy` |
| `lib/theme.ts` | Per-page accent theme map (`data-theme` on `<html>`) and `PRESS_ROUTES`, the routes already on the press design |
| `public/mainstyle.css` | Single global stylesheet (~6300 lines) |
| `public/` | Images, fonts, downloads, `robots.txt` / `sitemap.xml` / `llms.txt` |
| `next.config.mjs` | Permanent redirects from the old `.html` URLs to clean routes |
| `vercel.json` | Security headers |

Article pages: `/project-june`, `/lumen`, `/beadreader`, `/brolocator`, `/csdp`, `/pandus`, `/elecf`.

## Theming

Routes listed in `PRESS_ROUTES` (`lib/theme.ts`) get `html.press` instead of the dark field: the light background, the Swiss nav and footer, and styles from `app/swiss.css`. Every other route maps to a named accent theme (`blue`, `violet`, `indigo`, `mauve`, `steel`) via `lib/theme.ts`, written to `<html data-theme="…">` and resolved by CSS-variable blocks in `mainstyle.css`. Hues are sampled from a saved navy → lavender → mauve → violet gradient so pages read distinctly while staying cohesive.

## Deployment

Static-friendly Next.js app on Vercel; `npm run build` must pass. Dev tooling (`serve.mjs`, `screenshot*.mjs`, `shot.mjs`, scratch files) is excluded from deploys via `.vercelignore`.
