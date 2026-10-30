/* ────────────────────────────────────────────────────────────────
   Per-page scene and theme.

   Every route sits on a painted scene (components/SunlitScene.tsx) in the
   same pastel-poster style, each at its own time of day. The theme name is
   written to <html data-theme="…">, and <html> also gets .is-day or
   .is-night: day pages share the light glass styles (app/sunlit.css), night
   pages the dark glass ones (app/scenes.css). Each theme picks its scene
   preset (PRESETS in SunlitScene.tsx) and its sky colours (app/scenes.css).

     /             sunlit   morning, sage sky, sun top right, the stone pine
     /photography  golden   golden hour, low sun on the left
     /contact      noon     clear blue midday
     /homelab      teal     cool, misty teal morning
     /credits      mist     soft lilac haze (also /comingsoon)
     everything else (the articles and the 404 page): night, moon and stars
   ──────────────────────────────────────────────────────────────── */
export const THEME_MAP: Record<string, string> = {
  '/': 'sunlit',
  '/photography': 'golden',
  '/contact': 'noon',
  '/homelab': 'teal',
  '/credits': 'mist',
  '/comingsoon': 'mist',
};

export const DEFAULT_THEME = 'night';

export function themeForPath(pathname: string): string {
  const p = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return THEME_MAP[p] ?? DEFAULT_THEME;
}

export const isNight = (theme: string) => theme === 'night';

/** Write the theme to <html>: data-theme plus .is-day or .is-night. */
export function applyTheme(theme: string) {
  const d = document.documentElement;
  d.setAttribute('data-theme', theme);
  d.classList.toggle('is-night', isNight(theme));
  d.classList.toggle('is-day', !isNight(theme));
}
