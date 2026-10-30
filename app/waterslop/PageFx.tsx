'use client';
import { useEffect } from 'react';

/* Page-wide effects for the OCR Reader article: the bottom edge of the fixed
   site nav as --ws-nav, so the stages and the 3D chapter keep their titles
   clear of it. The nav is a floating pill (.pnav), so its bottom edge, not its
   height, is what the titles must clear. The painted scene behind the page
   pauses its own motion while only the opaque chapters are on screen. */
export default function PageFx() {
  useEffect(() => {
    const html = document.documentElement;
    const nav = document.querySelector<HTMLElement>('.pnav');
    const set = () => html.style.setProperty('--ws-nav', `${Math.ceil(nav?.getBoundingClientRect().bottom ?? 0)}px`);
    set();
    const ro = new ResizeObserver(set);
    if (nav) ro.observe(nav);
    window.addEventListener('resize', set);
    return () => { ro.disconnect(); window.removeEventListener('resize', set); html.style.removeProperty('--ws-nav'); };
  }, []);
  return null;
}
