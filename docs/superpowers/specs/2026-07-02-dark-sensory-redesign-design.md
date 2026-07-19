# Dark Sensory / Shader Gradient Redesign — "Signal Archive"

Date: 2026-07-02
Scope: full site (every route). Goal per the owner: the site should be "almost
unrecognizable" from the previous Refined Editorial Dark look, moving to the
shader-gradient + dark-sensory styles in the Desktop reference screenshots.

## References (Desktop screenshots, 2026-07-01)

1. Shader gradient swatch grid: grainy, blurred mesh/shader color fields
   (teal-blue, indigo-violet with light bloom, amber, sage, ember-red with an
   iridescent beam, dusty blue).
2. "dark sensory" examples: near-black pages, smoky texture, tiny mono HUD
   metadata at the corners, sparse centered content, brutalist letterspaced
   display type, floating pill controls.
3. "SYNESTHESIA private access terminal": pure black, a glowing white light
   monolith centerpiece, corner HUD readouts (SYSTEM.ID, coords, clock),
   letterspaced serif title, bracketed nav items.
4. "AETH/R archive": dark smoke field, centered mono spec block, bracketed nav,
   vertical edge text, bottom index row, a single warm orange status accent.

## Concept

The site becomes **one continuous instrument: a private signal archive**.
Every page is a "channel" rendered over a living shader-gradient field.

Three pillars:

1. **The Field (shader gradients).** A fixed full-viewport WebGL fragment
   shader (domain-warped fBM, film grain, soft focal bloom, heavy vignette)
   sits behind every page. The palette is driven by the route's existing
   `data-theme`, and crossfades smoothly on client-side navigation:
   - `blue` (home, project-june): navy → indigo → slate bloom
   - `violet` (photography, elecf, lumen): black → violet → mauve bloom
   - `indigo` (contact, credits, brolocator): black → indigo → periwinkle
   - `mauve` (csdp): black → plum → orchid
   - `steel` (pandus): black → slate → steel cyan
   - `datacenter` (homelab): black → deep teal → cyan/emerald
   Fallbacks: static CSS mesh on `prefers-reduced-motion` or missing WebGL;
   rendering pauses when the tab is hidden. A fine static SVG grain overlay
   covers all content.

2. **The Instrument Deck (dark sensory).** Content rides on transparent bands
   over the field. Section fills are stripped; seams become hairline "signal"
   gradients. Cards become frosted glass instrument panels. Buttons become
   ghost terminal controls. Eyebrows/labels become letterspaced mono readouts
   with a leading signal tick. Big display titles gain wide tracking. Heroes
   carry corner HUD metadata (system id, SGT clock, coordinates, bracketed
   roles). The nav is a console command bar with indexed mono links; the
   footer is an instrument panel with mono readouts.

3. **The Ember (signal accent).** One warm accent, `--sa-ember` (#ff6a3d
   family), used *only* for live/status moments: homelab live dots, the 404
   "SIGNAL LOST" state, small "REC"/status ticks. Everything else stays cool.
   This mirrors the single orange "92% DEPLETED" accent in the reference.

Copy rule respected: no em dashes in rendered copy (use `//`, `·`, or commas).

## Architecture

- `components/SensoryAtmosphere.tsx` — the WebGL field. Extended with
  per-theme palette uniforms; reads `html[data-theme]`, watches it with a
  MutationObserver, and lerps palettes over ~1.6s on navigation.
- `components/SensoryShell.tsx` — mounts the atmosphere + flags
  `html.sensory-active`. Mounted **once in `app/layout.tsx`** (it is fixed,
  z-index −1). Per-page mounts from the WIP are removed.
- `public/mainstyle.css` — new final section `DARK SENSORY / SIGNAL ARCHIVE`,
  keyed on `html.sensory-active`, holding all page-agnostic reskin rules
  (tokens incl. `--font-ddt` + `--sa-accent` + `--sa-ember`, band stripping,
  seams, frosted panels, ghost buttons, mono readouts, nav/footer console
  reskin, `ct-*` hero reskin, full `art-*` article reskin). The duplicated CSS
  currently inlined in `HomeClient.tsx`/`SensoryShell.tsx` moves here.
- `components/ArticleHud.tsx` — small server component rendering corner HUD
  metadata inside each `art-hero` (ref id, channel name, coords/date line).
  Each article passes its own strings.
- Page-specific looks stay in each page's scoped `<style>` block with unique
  prefixes, per the house convention.

## Page treatments

- **Home**: hero becomes the archive index terminal: HUD corners (already in
  WIP), mono kicker, tracked title, ghost buttons; all sections on frosted
  panels (WIP) with final polish. `.hp-sensory` inline block moves to global.
- **Photography**: WIP treatment kept (violet field), plus gallery frames and
  tool cards on the global panel language.
- **Contact**: full bespoke redesign, "private access terminal": centered
  light-bloom monolith, letterspaced title, mono spec block (EMAIL / LOCATION /
  RESPONSE window), `REQUEST_ENTRY`-style email button, bracketed mono social
  links, corner HUD.
- **Credits**: "MANIFEST" channel: mono list index treatment over the field,
  frosted cards.
- **Articles (project-june, lumen, brolocator, csdp, pandus, elecf)**: global
  `art-*` reskin (transparent sections, seams, mono chapter rail with `[0n]`
  indices, frosted figures, terminal repo callout) + per-article `ArticleHud`
  with bespoke metadata. Interactive widgets already use `--hp-*` tokens and
  inherit the new palette.
- **Homelab**: keeps its cyan/emerald identity; its opaque page background and
  card fills are retuned to ride the datacenter-palette field; hero gains HUD
  corners. Its live status dots + "degraded/offline" states use the ember.
- **404**: "SIGNAL LOST · 404" terminal with ember accent.
  **Comingsoon**: "IN TRANSMISSION" placeholder on the field.

## Non-goals / constraints

- No route changes, no content rewrites beyond label copy, no metadata/SEO
  regressions (sitemap unchanged; page metadata untouched).
- Performance: shader is low-power, DPR-capped, paused when hidden, static
  fallback for reduced motion. No new render-blocking resources.
- Accessibility: HUD/decoration is `aria-hidden`; contrast of body text over
  the darkened field stays ≥ previous levels (field is dimmer than old auras).
- Mobile 390px: HUD corners hide, panels stack, nothing overflows.

## Verification

- `npx tsc --noEmit` clean (never `next build` while dev server runs).
- `shot.mjs` screenshots of every route, desktop + mobile 390px, at least two
  iteration passes against the reference language.
