'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './nav.css';

const PORTFOLIO_ID = 'portfolio-items-holder';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/photography', label: 'Photography' },
  { href: '/homelab', label: 'HomeLab' },
  { href: '/contact', label: 'Contact' },
];

/*
  The nav is a row of separate small pieces rather than one long bar: the logo
  on its own, a segmented pill of pages (the current page is the light inner
  pill), and a "View my work" pill on the right. On phones the page pill folds
  into a round menu button that opens a small dropdown. Styles: components/nav.css.
*/
export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  /* Already on the homepage, scroll to the projects directly. Leaving it to the
     href would do nothing on a repeat click, because the URL still carries
     #portfolio-items-holder from last time and the router sees no change. */
  const goToPortfolio = (e: React.MouseEvent) => {
    close();
    if (pathname !== '/') return;
    e.preventDefault();
    const target = document.getElementById(PORTFOLIO_ID);
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `/#${PORTFOLIO_ID}`);
  };

  // The phone menu closes on Escape (focus returns to its button) or a tap outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuRef.current?.focus(); }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!sheetRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // A route change always closes the menu.
  useEffect(() => { setOpen(false); }, [pathname]);

  const links = (onClick?: () => void) =>
    LINKS.map((l) => (
      <Link
        key={l.href}
        href={l.href}
        className={`pnav-item${isActive(l.href) ? ' is-active' : ''}`}
        aria-current={isActive(l.href) ? 'page' : undefined}
        onClick={onClick}
      >
        {l.label}
      </Link>
    ));

  return (
    <header className="pnav">
      <Link href="/" className="pnav-logo" onClick={close}>
        <img src="/images/logo.webp" alt="Chiambucket home" />
      </Link>

      <nav className="pnav-pill pnav-links" aria-label="Main">
        {links()}
      </nav>

      <div className="pnav-right">
        <Link href={`/#${PORTFOLIO_ID}`} className="pnav-pill pnav-cta" onClick={goToPortfolio}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.2 8.1 15 5.25l.8 2.85a4 4 0 0 0 2.9 2.9l2.85.8-2.85.8a4 4 0 0 0-2.9 2.9L15 18.75l-.8-2.85a4 4 0 0 0-2.9-2.9L8.25 12l2.85-.8a4 4 0 0 0 3.1-3.1ZM6 14.25l.26 1.04a3 3 0 0 0 2.2 2.2L9.75 18l-1.04.26a3 3 0 0 0-2.2 2.2L6 21.75l-.26-1.04a3 3 0 0 0-2.2-2.2L2.25 18l1.04-.26a3 3 0 0 0 2.2-2.2L6 14.25ZM6.5 4l.2.6a1 1 0 0 0 .7.7l.6.2-.6.2a1 1 0 0 0-.7.7l-.2.6-.2-.6a1 1 0 0 0-.7-.7L5 5.5l.6-.2a1 1 0 0 0 .7-.7L6.5 4Z" />
          </svg>
          View my work
        </Link>
        <button
          ref={menuRef}
          type="button"
          className={`pnav-circle pnav-menu${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="pnav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div ref={sheetRef} id="pnav-sheet" className={`pnav-sheet${open ? ' is-open' : ''}`}>
        <nav aria-label="Main (menu)">{links(close)}</nav>
      </div>
    </header>
  );
}
