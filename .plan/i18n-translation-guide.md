# Translating chiambucket.com (i18n, phase 2)

You translate the site's English copy into ONE language. The copy has already been moved out of the
JSX into copy files (see .plan/i18n-extraction-brief.md for the patterns). Read CLAUDE.md, lib/i18n.ts
and lib/shell.ts (the nav/footer words, already translated: use the same terms).

## Voice: the same person, in your language
The English is Braven Chiam (a young engineering student in Singapore) talking about his own work:
cheerful, conversational, plain and warm, in the first person. Short connected sentences, no marketing
puff, no formality, no filler. A friend explaining what they built, with a bit of a smile. Keep exactly
what each sentence says: do not add claims, explanations or technical detail, and do not drop any.
Translate the meaning and the mood, not word by word; it must read as if written in your language first.

Register:
- zh (Simplified Chinese): 你, friendly and natural, light warmth (an occasional 哦 or 啦 is fine, never on every line). Full-width punctuation (，。：？！、“”).
- ja: friendly です/ます, not stiff keigo, not slangy. 「」 for quotes, full-width punctuation.
- nl: je/jij, informal.
- de: du, informal. „…“ quotes.
- ru: вы (lowercase), warm and simple, not bureaucratic. «…» quotes.
- fr: tu, informal. A narrow no-break space before ? ! : ; (write it as   in strings or &#8239; in JSX).
- es: tú, informal. ¿…? and ¡…!.

House rules (all languages):
- No em dashes (—) and no spaced en dashes as punctuation. Use commas, full stops or your language's
  normal punctuation instead.
- Keep proper nouns and product names exactly: Braven, Braven Chiam, Chiambucket, chiambucket.com, OCR Reader,
  DrumNet, WaterSlop, Project June, Pip, BeadReader, Stack-chan, M5Stack, LUMEN, LoRA Messenger, HomeLab,
  ConfigKing, MeterSim, SimGen2, Shebang, Flashdeck, Mopi, Tab5, CoreS3, ESP32, model numbers, software
  names (Next.js, Docker, Proxmox, Unraid, KiCad, Onshape, Blender, ...), hostnames, URLs, emails, version
  labels (V1, L3, ...). Nanyang Polytechnic may be written as it is usually written in your language
  (e.g. 南洋理工学院), otherwise keep it.
- Dates and numbers in your language's normal form (e.g. 2024年9月, 9 septembre 2024, September 2024 → setembro...).
- UI LABELS MUST NOT GET LONGER. Buttons, pills, tags, nav items, stat labels, short headings and anything
  with `white-space: nowrap` or a fixed width: keep them as short as the English or shorter, choosing the
  shorter natural word (e.g. de "Projekte" not "Meine Arbeiten"). Body paragraphs may run longer, but
  headings should stay within about 120 % of the English length. If a heading is a single word or two in
  English, keep it one or two words. This is what keeps the padding and layout intact.

Glossary (keep consistent with lib/shell.ts):
| English | zh | ja | nl | de | ru | fr | es |
|---|---|---|---|---|---|---|---|
| My work | 我的作品 | 作品 | Mijn werk | Projekte | Проекты | Mes projets | Mis proyectos |
| Read the article | 阅读文章 | 記事を読む | Lees het artikel | Artikel lesen | Читать статью | Lire l’article | Leer el artículo |
| Peek summary | 快速预览 | ざっと見る | Snel bekijken | Kurz ansehen | Кратко | Aperçu | Vista rápida |
| Internship project | 实习项目 | インターン作品 | Stageproject | Praktikumsprojekt | Проект стажировки | Projet de stage | Proyecto de prácticas |
| Personal project | 个人项目 | 個人作品 | Eigen project | Eigenes Projekt | Личный проект | Projet perso | Proyecto personal |
| School project | 学校项目 | 学校の課題 | Schoolproject | Schulprojekt | Учебный проект | Projet d’école | Proyecto escolar |
| Flagship | 旗舰 | フラッグシップ | Topproject | Vorzeigeprojekt | Флагман | Phare | Insignia |
| Highlight(ed) | 精选 | 注目 | Uitgelicht | Highlight | Избранное | À la une | Destacado |
| Write-up coming soon | 文章即将推出 | 記事は近日公開 | Artikel volgt binnenkort | Artikel folgt bald | Статья скоро | Article bientôt | Artículo pronto |
| AI use levels L1 / L2 / L3 / L4 (short) | see `aiShort` in lib/shell.ts for your language: use exactly those words for the four levels wherever the levels are named |
| Close (pop-up button) | see `close` in lib/shell.ts |
These are defaults; if the English context clearly needs a different word, translate the meaning, but keep
the same word for the same thing everywhere.

## Files
For each area, create your language's copy next to the English one, with exactly the same shape (same keys,
same array lengths and order, same `{placeholders}`, same JSX elements and attributes such as className and
href, only the words changed):
- Large pattern (`<area>/_copy/en.tsx` + `index.ts`): create `<area>/_copy/<lang>.tsx`:
  `import type { XCopy } from './en'; const <lang>: XCopy = { ... }; export default <lang>;`
- Small pattern (one `<area>/_copy.tsx` holding a record of languages): do NOT edit that file (other
  translators work in parallel). Create `<area>/_copy.<lang>.tsx` exporting `const <lang>: XCopy = {...}; export default <lang>;`
  (import the type from './_copy').
- The project peeks (components/peeks/en.tsx, JSX built with components/peeks/kit.tsx): create
  components/peeks/<lang>.tsx with the same exports (titles, labels, PeekBody) and the same JSX, words
  translated. Keep every prop, className, URL, iframe and image path identical.
Do NOT edit any index.ts loader map, the small-pattern record, ProjectPeek.tsx's language map or any English
file. The lead wires your files in when all languages are done.

Internal links inside copy JSX: links to the localized pages (/, /contact, /photography, /homelab, /archive,
/credits, /ai-use, including hash links like /#projects) get your prefix: /<lang>, /<lang>/contact, /<lang>#projects.
Links to articles (/pip, /waterslop, /stackchan-lidar, ...) and external links stay exactly as they are.
Alt text and aria-labels are translated too. Metadata titles keep the pattern "<Page> | Braven Chiam".

## Checks before you finish
- `npx tsc --noEmit -p .` shows no errors in your files (other translators' in-progress files may error).
- Grep your files: no "—", no leftover English sentences (proper nouns and code aside), placeholders intact.
- Re-read every heading, button and label against its English: not longer than allowed above.
- Do not start or stop any dev server and do not run `next build`. Do not commit.
Report: the files you created, rough word count, any string you were unsure about (with the English and your
choice), and any label you could not keep short.
