/* ────────────────────────────────────────────────────────────────
   Per-page accent theming.

   Each route maps to a named theme; the theme name is written to
   <html data-theme="…"> and CSS variable blocks in mainstyle.css
   (:root + html[data-theme="…"]) recolour accents, auras and
   gradient text. All hues are sampled from the Frame 6 navy →
   lavender → mauve → violet gradient so the site stays cohesive
   while each page reads distinctly.

   The site-wide default is now the warm "paper" theme (honey / amber /
   chestnut). Only two routes keep a distinct cool palette: /contact and
   /homelab. Every other route (home, articles, photography, credits, …)
   falls through to "paper".
   ──────────────────────────────────────────────────────────────── */
export const THEME_MAP: Record<string, string> = {
  '/contact': 'indigo',
  '/homelab': 'datacenter',
};

export function themeForPath(pathname: string): string {
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return THEME_MAP[p] ?? 'paper';
}
