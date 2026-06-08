# Chiambucket

Personal portfolio and website for Braven Chiam. Dark-themed, design-forward ("Refined Editorial Dark"), deployed on Vercel.

**Live site:** [chiambucket.com](https://chiambucket.com)

---

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — `app/` directory, server components by default
- **framer-motion** — available for React animations (CSS handles most transitions)
- **Vercel Analytics + Speed Insights** — loaded in `app/layout.tsx`
- **animate.css** (CDN) — a few entrance animations
- **Lychee** — self-hosted photo galleries embedded via a remote script
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
| `app/page.tsx` → `app/HomeClient.tsx` | Homepage — hero, disciplines, About bento, Projects, HomeLab, photography, CTA |
| `app/<route>/page.tsx` | File-based routes (`/photography`, `/contact`, `/credits`, `/homelab`, article pages) |
| `components/` | Shared `Nav`, `Footer`, `ClientEffects`, `ArticleRecommendations`, `ArticleScrollSpy` |
| `lib/theme.ts` | Per-page accent theme map (`data-theme` on `<html>`) |
| `public/mainstyle.css` | Single global stylesheet (~5900 lines) |
| `public/` | Images, fonts, downloads, `robots.txt` / `sitemap.xml` / `llms.txt` |
| `next.config.mjs` | Permanent redirects from the old `.html` URLs to clean routes |
| `vercel.json` | Security headers |

Article pages: `/project-june`, `/brolocator`, `/csdp`, `/pandus`, `/elecf`.

## Theming

Each route maps to a named accent theme (`blue`, `violet`, `indigo`, `mauve`, `steel`) via `lib/theme.ts`, written to `<html data-theme="…">` and resolved by CSS-variable blocks in `mainstyle.css`. Hues are sampled from a saved navy → lavender → mauve → violet gradient so pages read distinctly while staying cohesive.

## Deployment

Static-friendly Next.js app on Vercel; `npm run build` must pass. Dev tooling (`serve.mjs`, `screenshot*.mjs`, `shot.mjs`, scratch files) is excluded from deploys via `.vercelignore`.
