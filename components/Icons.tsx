/*
  Icons — one small set for every button on the site, so each one shows what
  it does: read, peek, watch, open on GitHub, download, open a 3D model, email,
  copy, go home, browse, expand, and leave the site. All are 24px line icons
  in currentColor, sized by the button (1.05em by default) and hidden from
  screen readers, since the button's text already says what it does.
*/
type P = { className?: string };
const base = (p: P) => ({
  viewBox: '0 0 24 24', width: '1.05em', height: '1.05em', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true, focusable: false, className: `btn-ico${p.className ? ` ${p.className}` : ''}`,
});

/** Read the full article: an open book */
export const IcRead = (p: P) => (
  <svg {...base(p)}><path d="M12 6.5C10.4 5.2 8 4.5 4 4.5v13c4 0 6.4.7 8 2 1.6-1.3 4-2 8-2v-13c-4 0-6.4.7-8 2z" /><path d="M12 6.5v13" /></svg>
);
/** Peek at a summary: a magnifying glass */
export const IcPeek = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
);
/** Watch a video: a play button */
export const IcPlay = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3.5" /><path d="M10.2 9.2v5.6L15 12z" fill="currentColor" /></svg>
);
/** Open on GitHub: the GitHub mark (filled) */
export const IcGitHub = (p: P) => (
  <svg {...base(p)} stroke="none" fill="currentColor">
    <path d="M12 2.2a9.8 9.8 0 00-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 014.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.8 9.8 0 0012 2.2z" />
  </svg>
);
/** Download a file */
export const IcDownload = (p: P) => (
  <svg {...base(p)}><path d="M12 4v11M7 10.5l5 5 5-5" /><path d="M5 19.5h14" /></svg>
);
/** Open a 3D model: a cube */
export const IcCube = (p: P) => (
  <svg {...base(p)}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>
);
/** Write an email */
export const IcMail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M4 7l8 6 8-6" /></svg>
);
/** Go to the homepage */
export const IcHome = (p: P) => (
  <svg {...base(p)}><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V19h12V9.5" /></svg>
);
/** Browse the projects: a grid */
export const IcGrid = (p: P) => (
  <svg {...base(p)}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></svg>
);
/** Photos: a picture */
export const IcPhotos = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 16l-5-5-8.5 8" /></svg>
);
/** The homelab: a server */
export const IcServer = (p: P) => (
  <svg {...base(p)}><rect x="4" y="4" width="16" height="7" rx="2" /><rect x="4" y="13" width="16" height="7" rx="2" /><path d="M8 7.5h.01M8 16.5h.01" /></svg>
);
/** Show more: a chevron down */
export const IcMore = (p: P) => (
  <svg {...base(p)}><path d="M6 9.5l6 6 6-6" /></svg>
);
/** A map of the network: three linked nodes */
export const IcMap = (p: P) => (
  <svg {...base(p)}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="8" r="2.5" /><circle cx="10" cy="18" r="2.5" /><path d="M8.3 7l7.3.7M7 8.3l2 7.3M16.4 10l-4.7 6" /></svg>
);
/** Expand to full size */
export const IcExpand = (p: P) => (
  <svg {...base(p)}><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" /></svg>
);
/** A live site or demo: a screen */
export const IcScreen = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8.5 20h7M12 16.5V20" /></svg>
);
/** Opens somewhere else: an arrow up and to the right */
export const IcOut = (p: P) => (
  <svg {...base(p)}><path d="M8 16L16 8M9.5 8H16v6.5" /></svg>
);
/** Go on, in this site: an arrow to the right */
export const IcGo = (p: P) => (
  <svg {...base(p)}><path d="M5 12h13M13 7l5 5-5 5" /></svg>
);

/** The icon for a link, from where it goes: GitHub, YouTube, a CAD model, a file, email, another site, or a page here (an article, the homelab, photos). */
export function iconForUrl(url: string) {
  if (/github\.com/.test(url)) return <IcGitHub />;
  if (/youtu\.?be/.test(url)) return <IcPlay />;
  if (/onshape\.com|\.step$|\.stl$/i.test(url)) return <IcCube />;
  if (/\.pdf$|\/raw\?|download/i.test(url)) return <IcDownload />;
  if (/^mailto:/.test(url) || url === '/contact') return <IcMail />;
  if (/^https?:/.test(url)) return <IcOut />;
  if (url === '/homelab') return <IcServer />;
  if (url === '/photography') return <IcPhotos />;
  if (/^\/(project-june|brolocator|lumen|beadreader|csdp|pandus|elecf|waterslop)\b/.test(url)) return <IcRead />;
  return <IcGo />;
}
