'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { blobPath, type Capsule } from './navBlob';
import './nav.css';

const PORTFOLIO_ID = 'portfolio-items-holder';

type Key = 'home' | 'work' | 'photography' | 'homelab' | 'contact';
const LINKS: { key: Key; href: string; label: string }[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'work', href: `/#${PORTFOLIO_ID}`, label: 'My work' },
  { key: 'photography', href: '/photography', label: 'Photography' },
  { key: 'homelab', href: '/homelab', label: 'HomeLab' },
  { key: 'contact', href: '/contact', label: 'Contact' },
];

/*
  The nav is a row of separate small pieces rather than one long bar: the logo
  on its own and a segmented pill of pages. The current one sits in a dark
  inner pill, the mark, which slides from item to item: on the homepage it
  moves from Home to My work while the projects section is in the middle of
  the screen, and back again. On phones the page pill folds into a round menu
  button that opens a small dropdown. Styles: components/nav.css.

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
  const markRef = useRef<HTMLSpanElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<SVGPathElement>(null);
  const close = () => setOpen(false);
  // On the homepage: is the projects section in the middle of the screen?
  const [atWork, setAtWork] = useState(false);

  const active: Key | null = pathname === '/' ? (atWork ? 'work' : 'home')
    : LINKS.find((l) => l.key !== 'home' && l.key !== 'work' && pathname.startsWith(l.href))?.key ?? null;

  /* On the homepage, Home and My work scroll the page instead of navigating.
     Leaving it to the href would do nothing on a repeat click, because the URL
     still carries #portfolio-items-holder from last time and the router sees
     no change. Elsewhere they are ordinary links to the homepage. */
  const scrollTo = (e: React.MouseEvent, key: 'home' | 'work') => {
    close();
    if (pathname !== '/') return;
    e.preventDefault();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    setAtWork(key === 'work');
    if (key === 'home') {
      window.scrollTo({ top: 0, behavior });
      window.history.replaceState(null, '', '/');
      return;
    }
    document.getElementById(PORTFOLIO_ID)?.scrollIntoView({ behavior, block: 'start' });
    window.history.replaceState(null, '', `/#${PORTFOLIO_ID}`);
  };

  // Watch the projects section on the homepage: My work lights up while it
  // crosses the middle of the screen.
  useEffect(() => {
    setAtWork(false);
    if (pathname !== '/') return;
    const section = document.getElementById(PORTFOLIO_ID);
    if (!section) return;
    const io = new IntersectionObserver(([e]) => setAtWork(e.isIntersecting), { rootMargin: '-50% 0px -50% 0px' });
    io.observe(section);
    return () => io.disconnect();
  }, [pathname]);

  /* The mark: one dark pill behind the items, cut to the current item with
     clip-path. Its two edges are separate animated lengths, and the leading
     edge moves first, so it stretches towards the next item and then catches
     up, a small jump. The items keep their own background until it is placed. */
  const placed = useRef(false);
  useEffect(() => {
    const pill = linksRef.current;
    const mark = markRef.current;
    if (!pill || !mark) return;
    const place = () => {
      const item = active ? pill.querySelector<HTMLElement>(`[data-key="${active}"]`) : null;
      if (!item) { pill.classList.remove('has-mark'); placed.current = false; return; }
      const l = item.offsetLeft;
      const r = pill.clientWidth - (item.offsetLeft + item.offsetWidth);
      const prevL = parseFloat(mark.style.getPropertyValue('--mark-l')) || 0;
      mark.classList.toggle('to-right', l > prevL);
      mark.style.setProperty('--mark-l', `${l}px`);
      mark.style.setProperty('--mark-r', `${r}px`);
      if (!placed.current) {
        // first placement: no slide in from nowhere
        mark.classList.remove('is-live');
        pill.classList.add('has-mark');
        placed.current = true;
        requestAnimationFrame(() => requestAnimationFrame(() => mark.classList.add('is-live')));
      }
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

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
      const all = [logoRef.current, linksRef.current, menuRef.current];
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
      // the phone dropdown follows the menu button, but never past the left edge of the screen
      menuDx = pieces.find((q) => q.el === menuRef.current)?.dx ?? 0;
      const sheetBox = sheet.getBoundingClientRect();
      if (sheetBox.width) menuDx = Math.max(menuDx, 14 - (sheetBox.right - sheet.offsetWidth));
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
        [logoRef.current, linksRef.current, menuRef.current, sheet].forEach((el) => { if (el) el.style.translate = ''; });
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

  const links = () =>
    LINKS.map((l) => (
      <Link
        key={l.key}
        href={l.href}
        data-key={l.key}
        className={`pnav-item${active === l.key ? ' is-active' : ''}`}
        aria-current={active === l.key ? (l.key === 'work' ? 'location' : 'page') : undefined}
        onClick={l.key === 'home' || l.key === 'work' ? (e) => scrollTo(e, l.key as 'home' | 'work') : close}
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

      <Link href="/" className="pnav-logo" onClick={(e) => scrollTo(e, 'home')} ref={logoRef}>
        <img src="/images/logo.webp" alt="Chiambucket home" />
      </Link>

      <nav className="pnav-pill pnav-links" aria-label="Main" ref={linksRef}>
        <span className="pnav-mark" ref={markRef} aria-hidden="true" />
        {links()}
      </nav>

      <div className="pnav-right">
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
        <nav aria-label="Main (menu)">{links()}</nav>
      </div>
    </header>
  );
}
