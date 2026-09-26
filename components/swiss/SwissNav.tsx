'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Mark from '../press/Mark';

/* Nav for the light-design routes: the mark and name on the left, four
   links on the right. On phones the links fold into a sheet behind "Menu". */
export default function SwissNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    <header className={`sw-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="sw-nav-row">
        <Link href="/" className="sw-nav-home" onClick={close}>
          <Mark />
          <span>Chiambucket</span>
        </Link>
        <nav id="sw-nav-links" className="sw-nav-links" aria-label="Main">
          <a href="/#portfolio-items-holder" onClick={close}>Work</a>
          <Link href="/photography" onClick={close}>Photographs</Link>
          <Link href="/homelab" onClick={close}>HomeLab</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
        </nav>
        <button
          type="button"
          className="sw-nav-toggle"
          aria-expanded={open}
          aria-controls="sw-nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
