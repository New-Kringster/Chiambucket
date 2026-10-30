'use client';

import { useEffect, useRef } from 'react';
import { chapterMarkup } from './chapter/markup.js';
import { mountChapter } from './chapter/chapter.js';
import './chapter/chapter.css';
import './waterslop.css';

// Rendered on the server too, so the component notes are in the HTML. The
// exported chapter numbers itself V; in this article it is chapter XI.
const markup = chapterMarkup().replace('Chapter - V', 'Chapter - XI').replace('Chapter V:', 'Chapter XI:').replace('WaterSlop PCB', 'OCR Reader PCB');

export default function WaterslopChapter() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Keep the chapter's top-anchored titles clear of the fixed site nav.
    const nav = document.querySelector<HTMLElement>('.nav-holder');
    const inset = () => el.style.setProperty('--ws-top-inset', `${nav?.offsetHeight ?? 0}px`);
    inset();
    const navSize = new ResizeObserver(inset);
    if (nav) navSize.observe(nav);
    const unmount = mountChapter(el, {
      assetBase: '/waterslop/',
      // The whole article pauses the site shader field (PageFx); nothing to toggle here.
      onCover: () => {},
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
