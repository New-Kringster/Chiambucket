/* ────────────────────────────────────────────────────────────────
   Homepage story content. Every fact comes from a write-up on this site or,
   for "On the bench", from Braven's GitHub repos (private ones only at a high
   level: what it is, the stack, his role; no code, hosts or client details).
   This file keeps the structure (ids, images, URLs, icons, types, flags); the
   words are in ./_copy, keyed by the ids and keys here.
   ──────────────────────────────────────────────────────────────── */
import type { HomeCopy } from './_copy';

/* ── Flagship project cards ── */
export type FlagshipId = 'proj-waterslop' | 'proj-june' | 'proj-pip' | 'proj-lidar' | 'proj-beadreader';
export type Flagship = {
  id: FlagshipId;
  gold?: boolean;
  tools: { src: string; alt: string }[];
  poster: string;
  read: string;
  /** a third button; its label is the copy's flagships[id].extra */
  extra?: { url: string; kind: 'play' | 'github' | 'report' };
};

export const OCR_CARD: Flagship = {
  id: 'proj-waterslop',
  gold: true,
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }],
  poster: '/images/ocr-reader-flagship.webp',
  read: '/waterslop',
  extra: { url: '/downloadable/ocr-reader-report.pdf', kind: 'report' },
};

export const JUNE_CARD: Flagship = {
  id: 'proj-june',
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }],
  poster: '/images/home/june-banner.webp',
  read: '/project-june',
  extra: { url: 'https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC', kind: 'play' },
};

export const PIP_CARD: Flagship = {
  id: 'proj-pip',
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-P4' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/docker-icon.webp', alt: 'Docker' }],
  poster: '/images/pip-pf-context.webp',
  read: '/pip',
};

export const LIDAR_CARD: Flagship = {
  id: 'proj-lidar',
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/blender-icon.webp', alt: 'Blender' }],
  poster: '/images/stackchan-lidar/cover.webp',   // the transparent cutout, so no box shows on the card
  read: '/stackchan-lidar',
};

export const BEAD_CARD: Flagship = {
  id: 'proj-beadreader',
  tools: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/tailwind-icon.webp', alt: 'Tailwind CSS' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }],
  poster: '/images/home/bead-banner.webp',
  read: '/beadreader',
  extra: { url: 'https://github.com/New-Kringster/BeadReader', kind: 'github' },
};

/* ── The project gallery: every project, the story-scroll ones first ── */
export type ProjectType = 'personal' | 'school' | 'internship';
/** every project's title and blurb are the copy's projects[id] */
export type ProjectId = keyof HomeCopy['projects'];
export type Project = {
  id: ProjectId; img: string; type: ProjectType;
  flagship?: boolean; highlight?: boolean; url: string | null; icons: { src: string; alt: string }[];
};
export const PROJECTS: Project[] = [
  { id: 'proj-waterslop', img: '/images/ocr-reader-pf-context.webp', type: 'personal', flagship: true, url: '/waterslop', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-june', img: '/images/ProjJuneBanner1.webp', type: 'personal', highlight: true, url: '/project-june', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-pip', img: '/images/pip-pf-context.webp', type: 'internship', highlight: true, url: '/pip', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-P4' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-lidar', img: '/images/stackchan-lidar-pf-context.webp', type: 'internship', highlight: true, url: '/stackchan-lidar', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/blender-icon.webp', alt: 'Blender' }] },
  { id: 'proj-beadreader', img: '/images/beadreader-pf-context.webp', type: 'personal', highlight: true, url: '/beadreader', icons: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }] },
  { id: 'proj-pantry', img: '/images/pantry-pf-context.webp', type: 'internship', url: '/pantry', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-ruler', img: '/images/scroll-ruler-pf-context.webp', type: 'internship', url: '/scroll-ruler', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-cadmouse', img: '/images/cad-mouse-pf-context.webp', type: 'internship', url: '/cad-mouse', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-lora', img: '/images/borlocator-pf-context.webp', type: 'personal', url: '/brolocator', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-lumen', img: '/images/lumen-pf-context.webp', type: 'school', url: '/lumen', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-ema', img: '/images/Ema-pf-context.webp', type: 'school', url: '/csdp', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-pandus', img: '/images/pandusarticle.webp', type: 'school', url: '/pandus', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-elecf', img: '/images/elef2-pf-context.webp', type: 'school', url: '/elecf', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }] },
  { id: 'proj-kauli', img: '/images/kauli3-pf-context.webp', type: 'school', url: null, icons: [{ src: '/images/blender-icon.webp', alt: 'Blender' }] },
  { id: 'proj-sol', img: '/images/Series1l-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-copyboard', img: '/images/CopyBoard-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/Kicad-icon.webp', alt: 'KiCad' }] },
  { id: 'proj-mc', img: '/images/mc-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-webdev', img: '/images/tht-cover.webp', type: 'school', url: null, icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }] },
];

/** On the bench is off the page for now; set true to bring it back. */
export const SHOW_BENCH = false;

export type BenchKey = keyof HomeCopy['bench']['items'];
/** its name, status, story, stack and link label are the copy's bench.items[key] */
export type Bench = { key: BenchKey; link?: string };

/* New work from GitHub (November 2026). Source repos are listed in the PR
   report; all but shebang-mcp are private. */
export const BENCH: Bench[] = [
  { key: 'shebang', link: 'https://github.com/New-Kringster/shebang-mcp' },
  { key: 'pip' },
  { key: 'ncir' },
  { key: 'flashdeck' },
];

/* ── What I do: the bento. Each tile is a picture and a few words; the
   details open in a pop-up (the same facts the old About section had). The
   tile's words and the pop-up's text are the copy's skills.tiles[key]; here
   are its picture, its pop-up's wide image and its buttons' URLs, in the
   order of the copy's `links` (or the single `link`). ── */
export type TileKey = keyof HomeCopy['skills']['tiles'];
export type Tile = {
  key: TileKey; img?: string; video?: { webm: string; mp4: string; poster: string }; fit?: 'cover' | 'contain'; pos?: string; size: 'xl' | 'tall' | 'wide' | 'sq';
  media?: string; links?: string[]; link?: string;
};
export const TILES: Tile[] = [
  { key: 'hw', img: '/images/CopyBoard-pf-context.webp', size: 'xl', links: ['/waterslop', '/brolocator'] },
  { key: 'fw', img: '/images/waterslop/cardputer.webp', fit: 'contain', size: 'tall', links: ['/project-june', '/lumen'] },
  { key: 'sw', img: '/images/beadreader/contents-dark.webp', pos: '50% 0%', size: 'tall', links: ['/beadreader', '/lumen'] },
  { key: 'cad', img: '/images/waterslop/enc-final.webp', size: 'sq' },
  { key: 'infra', img: '/images/hl-newmain.png', fit: 'contain', size: 'sq', link: '/homelab' },
  { key: 'radio', img: '/images/Brolocator1.webp', pos: '50% 85%', size: 'sq' },
  { key: 'video', video: { webm: '/images/Davinci-showcase.webm', mp4: '/images/Davinci-showcase.mp4', poster: '/images/Davinci-showcase-poster.webp' }, size: 'wide', links: ['https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC'] },
  { key: 'ui', img: '/images/Cdyspstart.webp', size: 'sq', media: '/images/Cdyspstart.webp', links: ['/csdp'] },
  { key: 'photo', img: '/images/home/gal-12.webp', size: 'wide', link: '/photography' },
];

/** Highlights from the photo library, captioned by album only (the album's name is the copy's photos.albums[album]). */
export type AlbumId = keyof HomeCopy['photos']['albums'];
export const PHOTOS: { src: string; w: number; h: number; album: AlbumId }[] = [
  { src: '/images/home/gal-01.webp', w: 900, h: 600, album: 'nz' },
  { src: '/images/home/gal-02.webp', w: 900, h: 626, album: 'china' },
  { src: '/images/home/gal-07.webp', w: 537, h: 720, album: 'china' },
  { src: '/images/home/gal-03.webp', w: 900, h: 656, album: 'china' },
  { src: '/images/home/gal-04.webp', w: 900, h: 600, album: 'europe' },
  { src: '/images/home/gal-11.webp', w: 480, h: 720, album: 'nz' },
  { src: '/images/home/gal-05.webp', w: 900, h: 600, album: 'europe' },
  { src: '/images/home/gal-06.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-09.webp', w: 505, h: 720, album: 'highlights' },
  { src: '/images/home/gal-08.webp', w: 900, h: 610, album: 'highlights' },
  { src: '/images/home/gal-10.webp', w: 900, h: 600, album: 'nz' },
  { src: '/images/home/gal-13.webp', w: 480, h: 720, album: 'nz' },
  { src: '/images/home/gal-12.webp', w: 900, h: 600, album: 'nz' },
  { src: '/images/home/gal-14.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-22.webp', w: 514, h: 720, album: 'china' },
  { src: '/images/home/gal-15.webp', w: 900, h: 600, album: 'highlights' },
  { src: '/images/home/gal-16.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-23.webp', w: 480, h: 720, album: 'china' },
  { src: '/images/home/gal-17.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-18.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-24.webp', w: 504, h: 720, album: 'highlights' },
  { src: '/images/home/gal-19.webp', w: 900, h: 600, album: 'china' },
  { src: '/images/home/gal-20.webp', w: 900, h: 600, album: 'europe' },
  { src: '/images/home/gal-21.webp', w: 900, h: 600, album: 'europe' },
];
