'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANGS, LANG_COOKIE, LOCALIZED, NATIVE_NAME, HTML_LANG, isLang, localize, pickLang, type Lang } from '../lib/i18n';
import { SHELL } from '../lib/shell';

/*
  The globe at the right end of the nav: a round glass button that opens the
  list of languages, each in its own words. Picking one remembers it (the
  `lang` cookie, which proxy.ts reads) and opens the same page in that
  language. It sits outside the nav's merging pieces and fades away once the
  page scrolls into its content, and comes back at the top.

  On pages that are only in English (the articles), a reader whose language
  is another one gets a small note under it saying so, which fades the same way.
*/
const SCROLL_GONE = 48;

function readCookie(): Lang | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]+)`));
  return m && isLang(m[1]) ? m[1] : null;
}

export default function LangGlobe({ lang, base }: { lang: Lang; base: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const [noteLang, setNoteLang] = useState<Lang | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const t = SHELL[lang];
  const localized = LOCALIZED.includes(base);

  // fades out once the page has scrolled into its content
  useEffect(() => {
    const on = () => {
      const g = window.scrollY > SCROLL_GONE;
      setGone(g);
      if (g) setOpen(false);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // an English-only page, for a reader of another language: say so in theirs
  useEffect(() => {
    if (localized) { setNoteLang(null); return; }
    const want = readCookie() ?? pickLang(navigator.languages?.join(',') || navigator.language);
    setNoteLang(want && want !== 'en' ? want : null);
  }, [localized, base]);

  // closes on Escape (focus back on the globe) or a tap outside
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    const onPointer = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

  const choose = (l: Lang) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    const target = localize(base, l);
    if (target !== window.location.pathname) router.push(target + window.location.hash);
    else if (!localized) setNoteLang(l === 'en' ? null : l);
  };

  return (
    <div className={`pnav-lang${gone ? ' is-gone' : ''}${open ? ' is-open' : ''}`} ref={wrap}>
      <button
        ref={button}
        type="button"
        className="pnav-globe"
        aria-label={t.language}
        title={t.language}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="pnav-langs"
        tabIndex={gone ? -1 : 0}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
      </button>
      <div id="pnav-langs" className="pnav-langs" role="menu" aria-label={t.language}>
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            role="menuitemradio"
            aria-checked={l === lang}
            lang={HTML_LANG[l]}
            className={`pnav-lang-item${l === lang ? ' is-on' : ''}`}
            tabIndex={open ? 0 : -1}
            onClick={() => choose(l)}
          >
            <span>{NATIVE_NAME[l]}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7.5" /></svg>
          </button>
        ))}
      </div>
      {noteLang && <p className="pnav-langnote" lang={HTML_LANG[noteLang]}>{SHELL[noteLang].englishOnly}</p>}
    </div>
  );
}
