'use client';
import { useEffect, useState } from 'react';

/* SkipToEnd: a floating button, on the OCR Reader article only, that skips the
   long walk-through and lands on its ending (the conclusion, then the report).
   It appears once the reader is past the hero and goes away when the ending is
   on screen. */
export default function SkipToEnd({ target = 'conclusion' }: { target?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const end = document.getElementById(target);
      const hero = document.querySelector('.ws-hero');
      if (!end) return;
      const past = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.4 : window.scrollY > window.innerHeight;
      setShow(past && end.getBoundingClientRect().top > window.innerHeight * 0.6);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [target]);

  const skip = () => {
    const end = document.getElementById(target);
    if (!end) return;
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
      <button type="button" className={`ws-skip${show ? ' on' : ''}`} onClick={skip} tabIndex={show ? 0 : -1} aria-hidden={!show}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l6 6 6-6M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>Skip to the end</span>
      </button>
      <style>{`
        .ws-skip { position: fixed; z-index: 60; right: clamp(14px, 2vw, 32px); top: calc(var(--ws-nav, 56px) + 14px); display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px 0 12px; border: 1px solid #d8cbb859; border-radius: 999px; background: #181716cc; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #d8cbb8; font: 500 12.5px/1 Manrope, Arial, sans-serif; letter-spacing: 0.02em; cursor: pointer; box-shadow: 0 10px 26px -12px #000c; opacity: 0; transform: translateY(-6px); pointer-events: none; transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.15s, color 0.15s; }
        .ws-skip.on { opacity: 1; transform: none; pointer-events: auto; }
        .ws-skip:hover { background: #2a2724e6; color: #fff0db; }
        .ws-skip:active { transform: scale(0.97); }
        .ws-skip:focus-visible { outline: 1px solid #d8cbb8; outline-offset: 3px; }
        .ws-skip svg { flex: none; }
        @media (max-width: 760px) { .ws-skip { right: 12px; min-height: 34px; padding: 0 11px 0 9px; font-size: 11.5px; } }
        @media (prefers-reduced-motion: reduce) { .ws-skip { transition: opacity 0.2s ease; transform: none; } }
      `}</style>
    </>
  );
}
