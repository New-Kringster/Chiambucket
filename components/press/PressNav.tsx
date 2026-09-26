'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Mark from './Mark';

/* Nav for press routes: ink on paper, the signature mark, four links.
   On phones the links fold into a sheet behind a "Menu" button. */
export default function PressNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`pr-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="pr-nav-row">
        <Link href="/" className="pr-nav-home" onClick={close}>
          <Mark />
          <span className="pr-nav-name">Chiambucket</span>
        </Link>
        <nav id="pr-nav-links" className="pr-nav-links" aria-label="Main">
          <a href="/#portfolio-items-holder" onClick={close}>Work</a>
          <Link href="/photography" onClick={close}>Photographs</Link>
          <Link href="/homelab" onClick={close}>HomeLab</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
        <button
          type="button"
          className="pr-nav-toggle"
          aria-expanded={open}
          aria-controls="pr-nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
