/*
  The site's languages. English lives at the plain paths (/contact); every
  other language has the same page under its code (/ja/contact). Every page
  is in LOCALIZED (scripts/check-i18n.mjs makes sure of it); embeds stay English.

  A visitor's first request to an English page is sent to their
  browser's preferred language by proxy.ts, unless they picked a language with
  the globe in the nav, which is remembered in the `lang` cookie.

  Page copy lives next to each page in a _copy folder: en.tsx defines the shape
  (`export type XCopy = typeof en`) and every other language fills the same
  shape, so a missing string is a type error.
*/
export const LANGS = ['en', 'zh', 'ja', 'nl', 'de', 'ru', 'fr', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export type OtherLang = Exclude<Lang, 'en'>;
export const OTHER_LANGS = LANGS.filter((l): l is OtherLang => l !== 'en');

/** The value for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = { en: 'en', zh: 'zh-Hans', ja: 'ja', nl: 'nl', de: 'de', ru: 'ru', fr: 'fr', es: 'es' };
/** Each language in its own words, for the language menu. */
export const NATIVE_NAME: Record<Lang, string> = {
  en: 'English', zh: '简体中文', ja: '日本語', nl: 'Nederlands', de: 'Deutsch', ru: 'Русский', fr: 'Français', es: 'Español',
};
/** Open Graph locale codes. */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_GB', zh: 'zh_CN', ja: 'ja_JP', nl: 'nl_NL', de: 'de_DE', ru: 'ru_RU', fr: 'fr_FR', es: 'es_ES' };

/** The English paths that have a translation in every other language. */
export const LOCALIZED = [
  '/', '/contact', '/photography', '/homelab', '/archive', '/credits', '/ai-use',
  '/waterslop', '/project-june', '/pip', '/stackchan-lidar', '/beadreader', '/pantry', '/scroll-ruler', '/cad-mouse', '/brolocator', '/lumen', '/csdp', '/pandus', '/elecf', '/comingsoon',
];

export const LANG_COOKIE = 'lang';
export const SITE = 'https://www.chiambucket.com';

export const isLang = (s: string | undefined | null): s is Lang => !!s && (LANGS as readonly string[]).includes(s);

/** '/ja/contact' -> { lang: 'ja', base: '/contact' }; '/contact' -> { lang: 'en', base: '/contact' }. */
export function splitLang(pathname: string | null | undefined): { lang: Lang; base: string } {
  const p = pathname || '/';
  const seg = p.split('/')[1];
  if (seg && seg !== 'en' && isLang(seg)) {
    const rest = p.slice(seg.length + 1);
    return { lang: seg, base: rest === '' ? '/' : rest };
  }
  return { lang: 'en', base: p };
}

/** A link in a given language: localized pages get the language prefix, everything else is left alone. */
export function localize(href: string, lang: Lang): string {
  if (lang === 'en' || !href.startsWith('/')) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const tail = cut === -1 ? '' : href.slice(cut);
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  if (!LOCALIZED.includes(clean)) return href;
  return `/${lang}${clean === '/' ? '' : clean}${tail}`;
}

/** The best supported language from an Accept-Language header, or null. Traditional Chinese has no match. */
export function pickLang(header: string | null | undefined): Lang | null {
  if (!header) return null;
  const wanted = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const q = params.map((s) => s.trim()).find((s) => s.startsWith('q='));
      return { tag, q: q ? parseFloat(q.slice(2)) || 0 : 1 };
    })
    .filter((w) => w.tag && w.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of wanted) {
    const [base, ...sub] = tag.split('-');
    if (base === 'zh') {
      if (sub.some((s) => s === 'hant' || s === 'tw' || s === 'hk' || s === 'mo')) continue;
      return 'zh';
    }
    if (isLang(base)) return base;
  }
  return null;
}

/** hreflang alternates for a localized page (Next metadata `alternates.languages`). */
export function langAlternates(base: string): Record<string, string> {
  const out: Record<string, string> = { 'x-default': SITE + base };
  for (const l of LANGS) out[HTML_LANG[l]] = SITE + localize(base, l);
  return out;
}
