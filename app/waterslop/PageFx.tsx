'use client';
import { useEffect } from 'react';

/* Page-wide effects for the OCR Reader article: the fixed nav's height as
   --ws-nav (the stages keep their titles clear of it), and the site's shader
   field paused for the whole visit, since every stage here is opaque. */
export default function PageFx() {
  useEffect(() => {
    const html = document.documentElement;
    const nav = document.querySelector<HTMLElement>('.nav-holder');
    const set = () => html.style.setProperty('--ws-nav', `${nav?.offsetHeight ?? 0}px`);
    set();
    const ro = new ResizeObserver(set);
    if (nav) ro.observe(nav);
    html.setAttribute('data-sensory-paused', '');
    return () => { ro.disconnect(); html.style.removeProperty('--ws-nav'); html.removeAttribute('data-sensory-paused'); };
  }, []);
  return null;
}
