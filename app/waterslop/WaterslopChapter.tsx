'use client';

import { useEffect, useRef } from 'react';
import { chapterMarkup } from './chapter/markup.js';
import { mountChapter } from './chapter/chapter.js';
import './chapter/chapter.css';
import './waterslop.css';

// Rendered on the server too, so the component notes are in the HTML.
const markup = chapterMarkup();

export default function WaterslopChapter() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    // Keep the chapter's top-anchored titles clear of the fixed site nav.
    const nav = document.querySelector<HTMLElement>('.nav-holder');
    const inset = () => el.style.setProperty('--ws-top-inset', `${nav?.offsetHeight ?? 0}px`);
    inset();
    const navSize = new ResizeObserver(inset);
    if (nav) navSize.observe(nav);
    const unmount = mountChapter(el, {
      assetBase: '/waterslop/',
      // The stage is opaque while pinned; pause the site shader field behind it.
      onCover: (covered: boolean) => html.toggleAttribute('data-sensory-paused', covered),
    });
    return () => {
      navSize.disconnect();
      unmount();
    };
  }, []);
  return (
    <div
      ref={root}
      className="ws-chapter"
      data-no-zoom
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
