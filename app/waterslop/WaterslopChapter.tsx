'use client';

import { useEffect, useRef } from 'react';
import { chapterMarkup } from './chapter/markup.js';
import { mountChapter } from './chapter/chapter.js';
import './chapter/chapter.css';
import './waterslop.css';

// Rendered on the server too, so the component notes are in the HTML. The
// exported chapter numbers itself V; the article passes its own numeral.
const markupFor = (numeral: string) => chapterMarkup().replace('Chapter - V', `Chapter - ${numeral}`).replace('Chapter V:', `Chapter ${numeral}:`).replace('WaterSlop PCB', 'OCR Reader PCB');

export default function WaterslopChapter({ numeral = 'XI' }: { numeral?: string }) {
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
      dangerouslySetInnerHTML={{ __html: markupFor(numeral) }}
    />
  );
}

/* The exported chapter ends with a 'Component notes and sources' block and a skip
   link to it; the article keeps the chapter to the animation. */
export function WaterslopChapterStyle() {
  return <style>{`.ws-chapter #reading, .ws-chapter .skip { display: none; }`}</style>;
}
