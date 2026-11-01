'use client';
import { useEffect, useState } from 'react';

/*
  PdfEmbed — a PDF shown in the article. Desktop browsers get their own PDF
  viewer in the frame. On touch screens (iOS Safari in particular) a PDF in a
  frame shows only its first page and cannot be scrolled, so there it goes
  through Google's document viewer, which renders every page as a scrollable
  page. The link under each embed still opens the file itself.
*/
export default function PdfEmbed({ src, title }: { src: string; title: string }) {
  const [touch, setTouch] = useState(false);
  const [abs, setAbs] = useState(src);
  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    // Google's viewer fetches the file itself, so a path on this site needs its full address.
    setAbs(new URL(src, window.location.href).href);
  }, [src]);
  const url = touch ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(abs)}` : src;
  return <iframe key={url} src={url} title={title} loading="lazy" />;
}
