# Chiambucket

Personal portfolio and website for Braven Chiam. Dark-themed, design-forward, deployed on Vercel.

**Live site:** [chiambucket.com](https://chiambucket.com)

---

## Stack

- Pure HTML + CSS + vanilla JS — no build tools, no frameworks
- jQuery 3.7.1 (CDN) — DOM manipulation and AJAX includes
- animate.css (CDN) — entrance animations
- Vercel — static hosting, no build step

## Running locally

```bash
node serve.mjs
```

Opens at `http://localhost:3000`. Requires Node.js.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, about, projects gallery, homelab, photography |
| `contact.html` | Contact page |
| `credits.html` | Colophon / content credits |
| `photography.html` | Photography page with album switcher |
| `homelab.html` | HomeLab server and Docker apps showcase |
| `portfolio.html` | Standalone portfolio page |
| `mainstyle.css` | Single global stylesheet (~5400 lines) |
| `links.js` | Centralised URL/route config + all global JS |
| `projects.js` | Homepage projects gallery: filter, search, reader modal |
| `nav.html` / `footer.html` | Shared nav and footer, injected via jQuery `.load()` |
| `vercel.json` | Static deploy config: cache headers, security headers |

Article pages: `Brolocator.html`, `ProjectJune.html`, `csdp.html`, `pandus.html`, `elecf.html`

## Deployment

Static site deployed to Vercel. No build command, output is the repo root. `cleanUrls` is off because links use explicit `.html` extensions.

Dev tooling (`serve.mjs`, `screenshot*.mjs`, scratch HTML) is excluded from deploys via `.vercelignore`.
