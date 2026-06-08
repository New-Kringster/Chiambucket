'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Pic = { src: string; alt: string; lit: boolean };

/* Click-to-zoom for article images. A single delegated listener opens any
   image inside `.art-body` in a full-screen viewer; a floating magnifier cue
   follows the hovered image so it is subtly obvious the images are clickable. */
export default function ArticleLightbox() {
  const [mounted, setMounted] = useState(false);
  const [pic, setPic] = useState<Pic | null>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeT = useRef<number | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    setZoomed(false);
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => setPic(null), 260);
  }, []);

  // Open the viewer on a click of any article-body image
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || el.tagName !== 'IMG') return;
      const img = el as HTMLImageElement;
      if (!img.closest('.art-body') || img.closest('a') || img.closest('[data-no-zoom]')) return; // leave linked / opted-out images alone
      e.preventDefault();
      window.clearTimeout(closeT.current);
      setZoomed(false);
      setPic({ src: img.currentSrc || img.src, alt: img.alt || '', lit: img.classList.contains('art-diagram') });
      requestAnimationFrame(() => setOpen(true));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // ESC to close + lock body scroll while the viewer is up
  useEffect(() => {
    if (!pic) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [pic, close]);

  // Floating magnifier cue that tracks the hovered article image (the affordance)
  useEffect(() => {
    const cue = document.createElement('div');
    cue.className = 'art-zoom-cue';
    cue.setAttribute('aria-hidden', 'true');
    cue.innerHTML =
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L20 20M10.5 7.8v5.4M7.8 10.5h5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    document.body.appendChild(cue);
    let hovered: HTMLElement | null = null;
    let raf = 0;

    const place = () => {
      raf = 0;
      if (!hovered) return;
      const r = hovered.getBoundingClientRect();
      if (r.bottom < 8 || r.top > window.innerHeight - 8) { cue.classList.remove('show'); return; }
      cue.style.top = `${r.top + 12}px`;
      cue.style.left = `${r.right - 12}px`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(place); };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || t.tagName !== 'IMG' || !t.closest('.art-body') || t.closest('a') || t.closest('[data-no-zoom]')) return;
      hovered = t;
      place();
      cue.classList.add('show');
    };
    const out = (e: MouseEvent) => {
      if (e.target === hovered) { hovered = null; cue.classList.remove('show'); }
    };

    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
      cue.remove();
    };
  }, []);

  const setOrigin = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return;
    const r = img.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
    img.style.transformOrigin = `${x}% ${y}%`;
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!zoomed) setOrigin(e.clientX, e.clientY);
    setZoomed((z) => !z);
  };

  if (!mounted || !pic) return null;

  return createPortal(
    <div
      className={`art-lb${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={close}
    >
      <button className="art-lb-x" aria-label="Close image" onClick={(e) => { e.stopPropagation(); close(); }}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <img
        ref={imgRef}
        className={`art-lb-img${zoomed ? ' zoomed' : ''}${pic.lit ? ' lit' : ''}`}
        src={pic.src}
        alt={pic.alt}
        onClick={toggleZoom}
        onMouseMove={zoomed ? (e) => setOrigin(e.clientX, e.clientY) : undefined}
        draggable={false}
      />
      <span className="art-lb-hint" aria-hidden="true">{zoomed ? 'Click to fit · Esc to close' : 'Click to zoom · Esc to close'}</span>
    </div>,
    document.body,
  );
}
