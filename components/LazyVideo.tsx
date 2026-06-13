'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  webm: string;
  mp4: string;
  /** Lightweight still shown before (and instead of) the clip. */
  poster: string;
  className?: string;
  /** How far below the fold to begin loading the clip. */
  rootMargin?: string;
};

/**
 * Decorative autoplaying loop that defers its own weight.
 * - The poster paints immediately; the video sources are only injected once the
 *   element scrolls near the viewport (IntersectionObserver), so off-screen clips
 *   never cost bandwidth on first load.
 * - On Save-Data connections or `prefers-reduced-motion`, the clip is never fetched
 *   at all — the poster stands in. That keeps the homepage light on mobile data.
 */
export default function LazyVideo({ webm, mp4, poster, className, rootMargin = '400px' }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (saveData || reduceMotion) return; // keep the poster, fetch nothing

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    el.load();
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, [active]);

  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-hidden="true">
      {active && <source src={webm} type="video/webm" />}
      {active && <source src={mp4} type="video/mp4" />}
    </video>
  );
}
