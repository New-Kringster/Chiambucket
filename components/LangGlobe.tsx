'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANGS, LANG_COOKIE, NATIVE_NAME, HTML_LANG, localize, type Lang } from '../lib/i18n';
import { SHELL } from '../lib/shell';

/*
  Choosing the site's language. Picking one remembers it (the `lang` cookie,
  which proxy.ts reads) and opens the same page in that language.

  - LangGlobe (desktop): a round glass button at the right end of the nav that
    opens the list of languages, each in its own words. It sits outside the
    nav's merging pieces and fades away once the page scrolls into its content.
    On phones it is hidden and takes no room, so the merged bar stays at the edge.
  - LangSheet (phones): the last row of the menu dropdown, the current language
    with a globe, which opens the same list inside the menu.
*/
const SCROLL_GONE = 48;

/** Remembers the choice and opens the page in it. */
function useChooseLang(base: string) {
  const router = useRouter();
  return (l: Lang) => {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    const target = localize(base, l);
    if (target !== window.location.pathname) router.push(target + window.location.hash);
  };
}

const Globe = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);

function LangList({ lang, open, onPick, id }: { lang: Lang; open: boolean; onPick: (l: Lang) => void; id: string }) {
  return (
    <div id={id} className="pnav-langs" role="menu" aria-label={SHELL[lang].language}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          role="menuitemradio"
          aria-checked={l === lang}
          lang={HTML_LANG[l]}
          className={`pnav-lang-item${l === lang ? ' is-on' : ''}`}
          tabIndex={open ? 0 : -1}
          onClick={() => onPick(l)}
        >
          <span>{NATIVE_NAME[l]}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7.5" /></svg>
        </button>
      ))}
    </div>
  );
}

export default function LangGlobe({ lang, base }: { lang: Lang; base: string }) {
  const choose = useChooseLang(base);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const t = SHELL[lang];

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

  // closes on Escape (focus back on the globe) or a tap outside
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    const onPointer = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); };
  }, [open]);

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
        <Globe />
      </button>
      <LangList id="pnav-langs" lang={lang} open={open} onPick={(l) => { setOpen(false); choose(l); }} />
    </div>
  );
}

/** The language row at the bottom of the phone menu; it opens the list in place. */
export function LangSheet({ lang, base, menuOpen }: { lang: Lang; base: string; menuOpen: boolean }) {
  const choose = useChooseLang(base);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!menuOpen) setOpen(false); }, [menuOpen]);
  return (
    <div className={`pnav-sheet-lang${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="pnav-item pnav-sheet-langbtn"
        aria-expanded={open}
        aria-controls="pnav-sheet-langs"
        aria-label={`${SHELL[lang].language}: ${NATIVE_NAME[lang]}`}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe />
        <span>{NATIVE_NAME[lang]}</span>
        <svg className="pnav-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
      </button>
      <LangList id="pnav-sheet-langs" lang={lang} open={open && menuOpen} onPick={choose} />
    </div>
  );
}
