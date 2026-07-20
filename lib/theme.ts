/* ────────────────────────────────────────────────────────────────
   Per-page accent theming.

   Each route maps to a named theme; the theme name is written to
   <html data-theme="…"> and CSS variable blocks in mainstyle.css
   (:root + html[data-theme="…"]) recolour accents, auras and
   gradient text. All hues are sampled from the Frame 6 navy →
   lavender → mauve → violet gradient so the site stays cohesive
   while each page reads distinctly.

   Routes not listed fall back to "blue" (the signature default):
   home, project-june (the blue rover flagship), comingsoon, 404.
   ──────────────────────────────────────────────────────────────── */
export const THEME_MAP: Record<string, string> = {
  '/photography': 'violet',
  '/contact': 'indigo',
  '/credits': 'indigo',
  '/brolocator': 'indigo',
  '/csdp': 'mauve',
  '/pandus': 'steel',
  '/elecf': 'violet',
  '/lumen': 'violet',
  '/beadreader': 'paper',
  '/homelab': 'datacenter',
};

export function themeForPath(pathname: string): string {
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return THEME_MAP[p] ?? 'blue';
}
