'use client';
import { useEffect } from 'react';
import { useLang } from '@/lib/useLang';
import { notFoundCopy } from './_copy';

/* The 404's metadata is English (the page gets no URL params), so the tab title follows the
   address's language once the page runs. */
export default function NotFoundTitle() {
  const lang = useLang();
  useEffect(() => {
    // after the metadata has written its own <title>, which would otherwise win
    const t = notFoundCopy(lang).meta.title;
    const id = window.setTimeout(() => { document.title = t; }, 60);
    return () => window.clearTimeout(id);
  }, [lang]);
  return null;
}
