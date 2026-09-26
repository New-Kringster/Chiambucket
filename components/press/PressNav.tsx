'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Mark from './Mark';

const PORTFOLIO_ID = 'portfolio-items-holder';

/* Nav for press routes, same items as the dark nav: the signature mark,
   Photography, HomeLab, Portfolio, Contact and "View my work". On phones the
   links fold into a sheet behind a "Menu" button. */
export default function PressNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  // On the homepage, scroll straight to the projects (a repeat click on the
  // same hash would otherwise do nothing).
  const toPortfolio = (e: React.MouseEvent) => {
    close();
    if (pathname !== '/') return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(PORTFOLIO_ID)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/#${PORTFOLIO_ID}`);
  };

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
        <Link href="/" className="pr-nav-home" onClick={close} aria-label="Chiambucket home">
          <Mark />
        </Link>
        <nav id="pr-nav-links" className="pr-nav-links" aria-label="Main">
          <Link href="/photography" onClick={close}>Photography</Link>
          <Link href="/homelab" onClick={close}>HomeLab</Link>
          <a href={`/#${PORTFOLIO_ID}`} onClick={toPortfolio}>Portfolio</a>
          <Link href="/contact" onClick={close}>Contact</Link>
          <a className="pr-btn is-solid pr-nav-cta" href={`/#${PORTFOLIO_ID}`} onClick={toPortfolio}>View my work</a>
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
