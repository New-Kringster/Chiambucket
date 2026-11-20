import Link from 'next/link';
import { IcGrid, IcHome } from '../../components/Icons';
import { LANGS, HTML_LANG, localize } from '@/lib/i18n';
import { notFoundCopy } from './_copy';
import NotFoundTitle from './NotFoundTitle';

/* The 404's words, in the language of the address that was not found (/ja/nope is Japanese).
   The page is prerendered once and served for every missing address, so it carries every
   language and CSS shows the one matching <html lang>, which the head script sets from the
   address before paint: no English flash and nothing to swap after hydration. */
export default function NotFoundBody() {
  const show = LANGS.map((l) => `html:lang(${HTML_LANG[l]}) .nf-l[data-l="${l}"]{display:contents}`).join('');
  return (
    <>
      <style>{`.nf-l{display:none}${show}`}</style>
      <NotFoundTitle />
      {LANGS.map((l) => {
        const c = notFoundCopy(l);
        return (
          <div className="nf-l" data-l={l} lang={HTML_LANG[l]} key={l}>
            <span className="ct-kicker nf-kick">{c.kicker}</span>
            <h1 className="nf-code">404</h1>
            <p className="ct-sub nf-sub">{c.sub}</p>
            <div className="nf-btns">
              <Link href={localize('/', l)} className="hp-btn"><IcHome /> {c.home}</Link>
              <Link href={localize('/#projects', l)} className="hp-btn hp-btn-ghost"><IcGrid /> {c.projects}</Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
