'use client';
import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { IcGrid, IcHome } from '../../components/Icons';
import { useLang } from '@/lib/useLang';
import { localize } from '@/lib/i18n';
import { notFoundCopy } from './_copy';

const noSubscribe = () => () => {};

/* The 404's words, in the language of the address that was not found (/ja/nope is Japanese).
   The page is prerendered once, in English, and served for every missing address, so the
   language is only taken from the address once the page has hydrated. */
export default function NotFoundBody() {
  const pathLang = useLang();
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  const lang = hydrated ? pathLang : 'en';
  const c = notFoundCopy(lang);

  return (
    <>
      <span className="ct-kicker nf-kick">{c.kicker}</span>
      <h1 className="nf-code">404</h1>
      <p className="ct-sub nf-sub">{c.sub}</p>
      <div className="nf-btns">
        <Link href={localize('/', lang)} className="hp-btn"><IcHome /> {c.home}</Link>
        <Link href={localize('/#projects', lang)} className="hp-btn hp-btn-ghost"><IcGrid /> {c.projects}</Link>
      </div>
    </>
  );
}
