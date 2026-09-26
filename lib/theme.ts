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

/* ────────────────────────────────────────────────────────────────
   "Press" design (paper, riso ink, pen sketches).

   Routes listed here have moved to the paper redesign. They skip the
   dark WebGL field, get the press nav and footer, and read their
   styles from app/press.css (everything scoped under html.press).
   Add a route here when its page is rebuilt in the press language.
   ──────────────────────────────────────────────────────────────── */
export const PRESS_ROUTES: string[] = ['/'];

export function isPressPath(pathname: string): boolean {
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return PRESS_ROUTES.includes(p);
}
