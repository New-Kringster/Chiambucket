'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { blobPath, type Capsule } from './navBlob';
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

  As the page scrolls, the pieces slide together and merge into one compact
  bar in the middle, like metaballs: the logo gets a chip that swells out of a
  point, and where two pieces come close a neck of glass reaches across and
  thickens until they fuse (geometry in components/navBlob.ts). The glass for
  all of them is one layer clipped to that shape, with the rim and shadow
  drawn by an SVG filter from the same shape. Scrolling back up pulls them
  apart again. With reduced motion or reduced transparency the pieces stay
  where they are, each with its own glass.
*/

// How far the page scrolls (px) for the pieces to come all the way together.
const MERGE_SPAN = 260;
// How much neighbouring pieces overlap once merged, so the bar is one piece.
const MERGED_OVERLAP = 4;
export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<SVGPathElement>(null);
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

  /* The merge. Measures where each piece sits on its own, then on every
     scroll eases a progress value towards scrollY / MERGE_SPAN and moves the
     pieces from their own places to their places in the merged bar. */
  useEffect(() => {
    const header = headerRef.current;
    const glass = glassRef.current;
    const edge = edgeRef.current;
    const sheet = sheetRef.current;
    if (!header || !glass || !edge || !sheet) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clear = window.matchMedia('(prefers-reduced-transparency: reduce)');

    type Piece = { el: HTMLElement; x0: number; w: number; cy: number; r: number; dx: number; grows: boolean };
    let pieces: Piece[] = [];
    let menuDx = 0;
    let p = 0;
    let frame = 0;
    let last = 0;
    let on = false;

    const measure = () => {
      const all = [logoRef.current, linksRef.current, ctaRef.current, menuRef.current];
      all.forEach((el) => { if (el) el.style.translate = ''; });
      sheet.style.translate = '';
      const shown = all.filter((el): el is HTMLElement => !!el && el.getClientRects().length > 0);
      pieces = shown.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x0: r.left, w: r.width, cy: r.top + r.height / 2, r: r.height / 2, dx: 0, grows: el === logoRef.current };
      });
      // one height and one centre line for all, taken from the pills, so the merged bar is even
      const ref = pieces.find((q) => !q.grows) ?? pieces[0];
      if (ref) pieces.forEach((q) => { q.r = ref.r; q.cy = ref.cy; });
      // the merged bar, centred, each piece overlapping the next a little
      const total = pieces.reduce((sum, q) => sum + q.w, 0) - MERGED_OVERLAP * (pieces.length - 1);
      let x = (window.innerWidth - total) / 2;
      for (const q of pieces) { q.dx = x - q.x0; x += q.w - MERGED_OVERLAP; }
      menuDx = pieces.find((q) => q.el === menuRef.current)?.dx ?? 0;
    };

    const draw = () => {
      // ease out: quick to set off, slow as they meet, so the necks can be seen forming
      const move = 1 - Math.pow(1 - p, 4);
      const caps: Capsule[] = pieces.map((q) => {
        const x0 = q.x0 + q.dx * move;
        q.el.style.translate = `${(q.dx * move).toFixed(2)}px 0`;
        return { x0, x1: x0 + q.w, cy: q.cy, r: q.r, s: q.grows ? Math.min(1, p / 0.25) : 1 };
      });
      sheet.style.translate = `${(menuDx * move).toFixed(2)}px 0`;
      const d = blobPath(caps);
      glass.style.clipPath = `path('${d}')`;
      edge.setAttribute('d', d);
      header.classList.toggle('is-merged', p > 0.98);
    };

    const tick = (now: number) => {
      frame = 0;
      const target = Math.min(1, Math.max(0, window.scrollY / MERGE_SPAN));
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      p += (target - p) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - p) < 0.0005) p = target;
      draw();
      if (p !== target) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => { if (on && !frame) frame = requestAnimationFrame(tick); };

    const setUp = () => {
      on = !calm.matches && !clear.matches;
      header.classList.toggle('is-blob', on);
      if (!on) {
        cancelAnimationFrame(frame);
        frame = 0;
        [logoRef.current, linksRef.current, ctaRef.current, menuRef.current, sheet].forEach((el) => { if (el) el.style.translate = ''; });
        return;
      }
      measure();
      p = Math.min(1, Math.max(0, window.scrollY / MERGE_SPAN));
      draw();
    };
    setUp();
    document.fonts?.ready.then(setUp);
    let resizeTimer = 0;
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(setUp, 120); };
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', onResize);
    calm.addEventListener('change', setUp);
    clear.addEventListener('change', setUp);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', onResize);
      calm.removeEventListener('change', setUp);
      clear.removeEventListener('change', setUp);
    };
  }, [pathname]);

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
    <header className="pnav" ref={headerRef}>
      {/* the glass for every piece, drawn as one merging shape */}
      <div className="pnav-blob" aria-hidden="true">
        <div className="pnav-blob-glass" ref={glassRef} />
        <svg className="pnav-blob-edge">
          <defs>
            <filter id="pnav-edge" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              {/* a soft shadow under it, outside the shape only */}
              <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
              <feOffset in="blur" dy="9" result="drop" />
              <feComposite in="drop" in2="SourceAlpha" operator="out" result="dropOut" />
              <feFlood className="pnav-fl-drop" result="dropColour" />
              <feComposite in="dropColour" in2="dropOut" operator="in" result="shadow" />
              {/* a thin edge all the way round */}
              <feMorphology in="SourceAlpha" operator="erode" radius="1" result="inner" />
              <feComposite in="SourceAlpha" in2="inner" operator="out" result="ring" />
              <feFlood className="pnav-fl-edge" result="edgeColour" />
              <feComposite in="edgeColour" in2="ring" operator="in" result="edge" />
              {/* the bright rim on the top-left edges and a dimmer one bottom-right */}
              <feOffset in="SourceAlpha" dx="1.5" dy="1.5" result="downRight" />
              <feComposite in="SourceAlpha" in2="downRight" operator="out" result="topLeft" />
              <feFlood className="pnav-fl-rim" result="rimColour" />
              <feComposite in="rimColour" in2="topLeft" operator="in" result="rim" />
              <feOffset in="SourceAlpha" dx="-1" dy="-1" result="upLeft" />
              <feComposite in="SourceAlpha" in2="upLeft" operator="out" result="bottomRight" />
              <feFlood className="pnav-fl-rim2" result="rim2Colour" />
              <feComposite in="rim2Colour" in2="bottomRight" operator="in" result="rim2" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="edge" />
                <feMergeNode in="rim2" />
                <feMergeNode in="rim" />
              </feMerge>
            </filter>
          </defs>
          <path ref={edgeRef} filter="url(#pnav-edge)" />
        </svg>
      </div>

      <Link href="/" className="pnav-logo" onClick={close} ref={logoRef}>
        <img src="/images/logo.webp" alt="Chiambucket home" />
      </Link>

      <nav className="pnav-pill pnav-links" aria-label="Main" ref={linksRef}>
        {links()}
      </nav>

      <div className="pnav-right">
        <Link href={`/#${PORTFOLIO_ID}`} className="pnav-pill pnav-cta" onClick={goToPortfolio} ref={ctaRef}>
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
