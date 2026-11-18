/*
  The CoreS3 SE around a screen (server-safe, no state).

  The frame is a photo of the real unit, straight on, with its display blacked
  out (public/images/pantry/cores3-front.webp, 476 x 475, from Braven). The
  screen box sits on the display at 4:3, as tall as the black window and
  centred in it, so the window's own black margin reads as the bezel. The box
  is a container, so anything inside can size itself in screen pixels with
  --u (one of the panel's 320 pixels across).
*/
import type { ReactNode } from 'react';

export function Core({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className={`pt-core${className ? ` ${className}` : ''}`} data-no-zoom role={label ? 'img' : undefined} aria-label={label}>
      <img className="pt-core-frame" src="/images/pantry/cores3-front.webp" alt="" aria-hidden="true" draggable={false} />
      <div className="pt-core-screen">{children}</div>
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
