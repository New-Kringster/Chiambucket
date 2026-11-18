/*
  The CoreS3 SE drawn in CSS around a screen (server-safe, no state).

  The proportions follow the real unit: a 54 mm square body in light grey,
  black glass inset on its face, the 2-inch 320 x 240 panel near the top, and
  the printed row of touch marks under it. The screen box is 4:3 and a
  container, so anything inside can size itself in screen pixels with
  --u (one of the panel's 320 pixels across).
*/
import type { ReactNode } from 'react';

export function Core({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className={`pt-core${className ? ` ${className}` : ''}`} data-no-zoom role={label ? 'img' : undefined} aria-label={label}>
      <i className="pt-core-glass" aria-hidden="true" />
      <div className="pt-core-screen">{children}</div>
      <i className="pt-core-marks" aria-hidden="true">
        <b /><span>‹</span><span>‹</span><em /><span>›</span><span>›</span><b />
      </i>
    </div>
  );
}

/* A real screen capture from the tracker (320 x 240, captured at 2x over serial). */
export function Screen({ src, alt }: { src: string; alt: string }) {
  return (
    <Core>
      <img className="pt-shot" src={src} alt={alt} loading="lazy" decoding="async" />
    </Core>
  );
}
