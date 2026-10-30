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
    const unmount = mountChapter(el, {
      assetBase: '/waterslop/',
      // The chapter's stage is opaque; the scene behind the page needs nothing from it.
      onCover: () => {},
    });
    return unmount;
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
   link to it; the article keeps the chapter to the animation. The notes block is
   not removed, though: at the last stop the chapter's Next button scrolls it into
   view, so it stays as an empty, invisible anchor at the chapter's end, and Next
   carries the reader on to the section after the chapter. With display: none,
   Next had nowhere to go and did nothing. */
export function WaterslopChapterStyle() {
  /* Its top-anchored titles clear the fixed site nav: PageFx measures the nav as --ws-nav. */
  return <style>{`.ws-chapter .skip { display: none; } .ws-pcb .ws-chapter #reading { display: block; height: 0; margin: 0; padding: 0; border: 0; overflow: hidden; visibility: hidden; } .ws-chapter { --ws-top-inset: var(--ws-nav, 0px); }`}</style>;
}
