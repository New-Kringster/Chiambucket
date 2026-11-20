# Moving a page's English copy into copy files (i18n, phase 1)

Repo: /home/braven-agents/apps/Chiambucket-copy (branch task/i18n). Next.js 16 App Router, React 19, TypeScript.
Read CLAUDE.md first. Then read these, which are already written and are the reference:
- lib/i18n.ts (languages, splitLang, localize, LOCALIZED), lib/useLang.ts, lib/langMeta.ts, lib/fill.ts, lib/shell.ts
- the finished reference page: app/contact/_copy.tsx, app/contact/ContactClient.tsx, app/contact/page.tsx, app/[lang]/contact/page.tsx, app/[lang]/layout.tsx

Goal: every word a visitor can read or hear on your pages (visible text, alt text, aria-labels, titles,
button labels, empty and error states, metadata title/description/OG text, JSON-LD names where they are
prose) comes from a copy object instead of being written in the JSX, so translators can later add the
same object in 7 other languages (zh, ja, nl, de, ru, fr, es). You only write the ENGLISH copy now.
The English pages must render exactly the same text, markup and layout as before. Do not reword
anything.

## Two patterns
- Small copy (English copy object under ~3 KB): one file `<area>/_copy.tsx` exporting
  `const en = {...}; export type XCopy = typeof en; export const X_COPY: Partial<Record<Lang, XCopy>> = { en };`
  and a getter `export const xCopy = (lang: Lang): XCopy => X_COPY[lang] ?? en;`. Client components call
  `xCopy(useLang())`. Translators will later add the other languages to that object.
- Large copy: a folder `<area>/_copy/` with `en.tsx` (`const en = {...}; export type XCopy = typeof en; export default en;`)
  and `index.ts`:
  ```ts
  import type { Lang } from '@/lib/i18n';
  import type { XCopy } from './en';
  const LOADERS: Partial<Record<Lang, () => Promise<{ default: XCopy }>>> = { en: () => import('./en') };
  export async function loadXCopy(lang: Lang): Promise<XCopy> { return (await (LOADERS[lang] ?? LOADERS.en!)()).default; }
  ```
  The server page (page.tsx) loads the copy for its language and passes it down as a prop; deep client
  trees can share it through a small React context. Translators will add `zh: () => import('./zh')` etc.
  Only the visitor's language is ever sent to the browser.

Copy values: plain strings; JSX fragments ONLY where the English has inline markup (em, b, a, br, span with
a class). No functions in copy (copy crosses the server/client boundary as props). Numbers or names inside a
sentence: use a `{name}` placeholder and `fill()` from lib/fill.ts. Lists stay arrays in the same order.
Keep structural data (ids, image paths, URLs, icons, layout flags) out of the copy, in the code or data
file; key translatable text by id when it belongs to a data list. Proper nouns and product names stay as
they are inside the copy (Braven, Chiambucket, OCR Reader, DrumNet, Project June, Pip, BeadReader,
Stack-chan, M5Stack, LUMEN, HomeLab and so on), but they are still part of the copy strings.

Internal links written inside copy JSX: point them at the English path (e.g. href="/contact"); a component
that renders links from code should wrap internal hrefs to localized pages with `localize(href, lang)` from
lib/i18n.ts (articles are never localized, so their links stay plain).

## Localized route
For each page you own, add `app/[lang]/<route>/page.tsx` that renders the same page component for `lang`
(mirror app/[lang]/contact/page.tsx), with `generateMetadata` built by `langMeta(base, lang, copy.meta)` and
the page's JSON-LD (add `inLanguage: HTML_LANG[lang]`). The English page.tsx keeps its metadata and gains
`alternates.languages: langAlternates('<base path>')`. app/[lang]/layout.tsx already exists; do not edit it.
Server components get `lang` from `params` (a Promise in Next 16: `const { lang } = await params`).
Client components get it from `useLang()`.

## Rules
- Only edit the files your task lists, plus new files inside your area and your app/[lang]/<route> folder.
  Never edit public/mainstyle.css, components/Nav.tsx, components/nav.css, lib/i18n.ts, lib/shell.ts,
  app/layout.tsx, app/[lang]/layout.tsx, or another area's files. Other agents are editing other areas at
  the same time.
- A dev server is already running at http://localhost:3117 (it reloads on save). Do NOT start, stop or
  restart any dev server and do NOT run `next build` (it breaks the running server). Use
  `npx tsc --noEmit -p .` for type checks (other agents' work in progress may show errors in their files;
  only yours must be clean).
- Before you change anything, save the English page's visible text: e.g. with Playwright
  (`import { chromium } from '/home/braven-agents/apps/beadreader/node_modules/playwright/index.mjs'`),
  load http://localhost:3117<route>, wait for it, scroll through, and save `document.body.innerText`, plus
  the list of all `alt`, `aria-label` and `title` attribute values, to a file in your scratch dir. After
  the refactor do the same and diff: the English must be identical (the only allowed differences are none).
  Also load http://localhost:3117/ja<route> and confirm it renders (still English text for now) with no
  console errors.
- Keep the code style of the file you are in. Keep comments accurate; add a one-line comment where the copy
  is wired in if it helps the next reader.
- No em dashes in any copy (the English already has none; do not introduce any).
- Do not commit. Report back: the files you created and changed, the copy object's top-level shape, the
  English word count of your copy (roughly), anything you could not move and why, and the diff result.
