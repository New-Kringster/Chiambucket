import type { ReactNode } from 'react';

/* Key links surfaced at the top of an article hero (GitHub, demo, video, CAD, downloads).
   Server component, no client JS. First link renders as the primary (filled) pill. */
export type LinkType = 'github' | 'video' | 'demo' | 'cad' | 'download';
export type ArtLink = { type: LinkType; label: string; url: string };

const ICONS: Record<LinkType, ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.4.5 0 5.9 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.6C24 5.9 18.6.5 12 .5z" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 8.3l5.6 3.7L10 15.7z" fill="currentColor" />
    </svg>
  ),
  demo: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 20h6M12 16.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  cad: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M12 2.8l8 4.4v9.6L12 21.2 4 16.8V7.2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 7.2l8 4.4 8-4.4M12 11.6v9.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function ArticleLinks({ links }: { links: ArtLink[] }) {
  if (!links.length) return null;
  return (
    <div className="art-links">
      {links.map((l, i) => (
        <a key={l.url} className={`art-link${i === 0 ? ' primary' : ''}`} href={l.url} target="_blank" rel="noopener">
          {ICONS[l.type]}
          <span>{l.label}</span>
        </a>
      ))}
    </div>
  );
}
