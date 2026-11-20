/*
  Every design chiambucket.com has had, oldest first (shared by /archive and
  the anniversary card in the homepage hero).

  v1 to v7 each run as their own copy at https://chiambucket-vN.shebang.pro
  (built by ~/apps/chiambucket-archive on the homelab, see its README). v8 is
  the live site. `start` is the day a design went live; the strip on /archive
  makes each band as wide as the time until the next one. v2 to v3 is
  approximate (the hand-built site replaced WordPress in spring 2025).

  Screenshots in public/images/archive: vN-desktop (1440 x 900 at the top of
  the homepage), vN-phone (390 x 844), vN-detail (further down the homepage)
  and vN-thumb, all taken from the archived copies with their pill hidden.

  The words for each version (its name, dates, story and alt texts) are copy,
  keyed by `n` in _copy/en.tsx so they can be translated.
*/
export type Version = {
  n: number;
  start: string;
  /** the design's own colours: its main background and its accent */
  base: string;
  accent: string;
  /** whether there is a vN-detail screenshot */
  detail: boolean;
};

export const FIRST_LAUNCH = '2024-09-01';

export const VERSIONS: Version[] = [
  { n: 1, start: '2024-09-01', base: '#0d1b2a', accent: '#4c7cf3', detail: true },
  { n: 2, start: '2024-11-03', base: '#16263b', accent: '#4c7cf3', detail: true },
  { n: 3, start: '2025-04-15', base: '#050505', accent: '#c9c9c9', detail: true },
  { n: 4, start: '2026-01-19', base: '#464469', accent: '#b9b6dc', detail: true },
  { n: 5, start: '2026-06-06', base: '#0b0d16', accent: '#2f6fe0', detail: true },
  { n: 6, start: '2026-07-19', base: '#171009', accent: '#d6995a', detail: true },
  { n: 7, start: '2026-10-30', base: '#a6b495', accent: '#f4f1dc', detail: true },
  { n: 8, start: '2026-11-18', base: '#1d2b22', accent: '#d9b56b', detail: true },
];

export const archiveUrl = (n: number) => `https://chiambucket-v${n}.shebang.pro/`;
export const archiveHost = (n: number) => `chiambucket-v${n}.shebang.pro`;
