'use client';
import { useEffect, useRef, useState } from 'react';

/* SkipToEnd: a floating button in the bottom-left corner, on the OCR Reader
   article only, that skips the long walk-through and lands on its ending (the
   conclusion, then the report). It appears once the reader is past the hero and
   goes away when the ending is on screen. It is also the way out of the DrumNet
   film's hold (DrumNetFilm.tsx): pressing it sets data-ws-skipping, which lets
   the jump through.

   While it shows, <html data-ws-skip="on"> and --ws-skip-x / --ws-skip-w tell the
   stages to keep their dots and the film its player bar clear of it. On phones it
   rises above the film's player bar while the film fills the screen. */
export default function SkipToEnd({ target = 'conclusion' }: { target?: string }) {
  const [show, setShow] = useState(false);
  const [lift, setLift] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const html = document.documentElement;
    const check = () => {
      raf = 0;
      const end = document.getElementById(target);
      const hero = document.querySelector('.ws-hero');
      if (!end) return;
      const past = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.4 : window.scrollY > window.innerHeight;
      const on = past && end.getBoundingClientRect().top > window.innerHeight * 0.6;
      setShow(on);
      const film = document.getElementById('drumnet');
      const fr = film?.getBoundingClientRect();
      setLift(Boolean(fr && fr.top < window.innerHeight * 0.5 && fr.bottom > window.innerHeight * 0.5));
      if (on) html.setAttribute('data-ws-skip', 'on'); else html.removeAttribute('data-ws-skip');
      const b = btn.current;
      if (b) { html.style.setProperty('--ws-skip-w', `${b.offsetWidth}px`); html.style.setProperty('--ws-skip-x', `${b.offsetLeft}px`); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on); window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
      html.removeAttribute('data-ws-skip'); html.style.removeProperty('--ws-skip-w'); html.style.removeProperty('--ws-skip-x');
    };
  }, [target]);

  const skip = () => {
    const end = document.getElementById(target);
    if (!end) return;
    const html = document.documentElement;
    html.setAttribute('data-ws-skipping', '');
    window.setTimeout(() => html.removeAttribute('data-ws-skipping'), 3200);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A long way down through pinned stages: jump most of it at once, then glide the
    // last screen. Pictures above may still be loading and move the ending, so check
    // where it is once the glide is done and settle on it.
    const y = end.getBoundingClientRect().top + window.scrollY;
    if (!reduced) window.scrollTo({ top: y - window.innerHeight, behavior: 'instant' as ScrollBehavior });
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${target}`);
    const settle = (left: number) => window.setTimeout(() => {
      const off = end.getBoundingClientRect().top;
      if (Math.abs(off) > 2) window.scrollTo({ top: window.scrollY + off, behavior: 'instant' as ScrollBehavior });
      if (left > 1) settle(left - 1);
    }, 700);
    settle(3);
  };

  return (
    <>
      <button ref={btn} type="button" className={`ws-skip${show ? ' on' : ''}${lift ? ' lift' : ''}`} onClick={skip} tabIndex={show ? 0 : -1} aria-hidden={!show}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l6 6 6-6M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>Skip to the end</span>
      </button>
      <style>{`
        .ws-skip { position: fixed; z-index: 60; left: clamp(14px, 1.6vw, 28px); bottom: max(20px, env(safe-area-inset-bottom)); display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px 0 13px; border: 1px solid #d8cbb859; border-radius: 999px; background: #181716d9; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #d8cbb8; font: 500 12.5px/1 Manrope, Arial, sans-serif; letter-spacing: 0.02em; cursor: pointer; box-shadow: 0 10px 26px -12px #000c; opacity: 0; transform: translateY(6px); pointer-events: none; transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.15s, color 0.15s; }
        .ws-skip.on { opacity: 1; transform: none; pointer-events: auto; }
        .ws-skip:hover { background: #2a2724ee; color: #fff0db; }
        .ws-skip:active { transform: scale(0.97); }
        .ws-skip:focus-visible { outline: 1px solid #d8cbb8; outline-offset: 3px; }
        .ws-skip svg { flex: none; }
        /* the pinned stages keep their progress dots clear of it */
        html[data-ws-skip="on"] .ws-stage-dots { left: calc(var(--ws-skip-x, 20px) + var(--ws-skip-w, 150px) + 24px); width: min(28vw, 380px); }
        @media (max-width: 900px) {
          .ws-skip { left: 12px; bottom: max(16px, env(safe-area-inset-bottom)); min-height: 38px; padding: 0 12px 0 10px; font-size: 11.5px; }
          /* above the film's two-row player bar while the film fills the screen */
          .ws-skip.lift { bottom: 88px; }
          html[data-ws-skip="on"] .ws-stage-dots { left: calc(var(--ws-skip-x, 12px) + var(--ws-skip-w, 120px) + 14px); width: max(60px, calc(100vw - var(--ws-skip-w, 120px) - 150px)); }
        }
        @media (prefers-reduced-motion: reduce) { .ws-skip { transition: opacity 0.2s ease; transform: none; } }
      `}</style>
    </>
  );
}
