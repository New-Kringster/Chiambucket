import { NextResponse, type NextRequest } from 'next/server';
import { LANG_COOKIE, OTHER_LANGS, isLang, localize, pickLang, type Lang } from './lib/i18n';

/*
  A visitor opening a localized English page (lib/i18n.ts LOCALIZED) is sent
  to the same page in their language: the one they picked with the globe in
  the nav (the `lang` cookie), or else their browser's preferred one. Picking
  English with the globe keeps them on the English pages. Everything else
  (articles, assets, the /ja/... pages themselves) passes straight through.
*/
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const chosen = req.cookies.get(LANG_COOKIE)?.value;
  let lang: Lang | null = null;
  if (isLang(chosen)) lang = chosen;
  else lang = pickLang(req.headers.get('accept-language'));
  if (!lang || lang === 'en' || !(OTHER_LANGS as string[]).includes(lang)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = localize(pathname, lang);
  if (url.pathname === pathname) return NextResponse.next();
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language, Cookie');
  return res;
}

export const config = {
  matcher: [
    '/', '/contact', '/photography', '/homelab', '/archive', '/credits', '/ai-use',
    '/waterslop', '/project-june', '/pip', '/stackchan-lidar', '/beadreader', '/pantry', '/scroll-ruler', '/cad-mouse', '/brolocator', '/lumen', '/csdp', '/pandus', '/elecf', '/comingsoon',
  ],
};
