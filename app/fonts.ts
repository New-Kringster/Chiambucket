import localFont from 'next/font/local';

/*
  Figtree and Newsreader, served from the site itself (app/fonts/, the latin
  files Google Fonts serves, both under the SIL Open Font License). They used
  to come from next/font/google, which downloads them at build time and
  started failing builds whenever Google's response changed. Figtree is the
  variable file, so one file carries every weight. Each page's CSS reads its
  own variable name.
*/

/** the homepage */
export const homeSans = localFont({ src: './fonts/figtree-latin.woff2', weight: '300 900', display: 'swap', variable: '--hs-sans' });
export const homeSerif = localFont({ src: './fonts/newsreader-italic-latin.woff2', weight: '400', style: 'italic', display: 'swap', variable: '--hs-serif' });
/** the HomeLab page */
export const homelabSans = localFont({ src: './fonts/figtree-latin.woff2', weight: '300 900', display: 'swap', variable: '--hx-sans' });
/** the archive */
export const archiveSans = localFont({ src: './fonts/figtree-latin.woff2', weight: '300 900', display: 'swap', variable: '--ar-sans' });
export const archiveSerif = localFont({ src: './fonts/newsreader-italic-latin.woff2', weight: '400', style: 'italic', display: 'swap', variable: '--ar-serif' });
/** the Stack-chan LiDAR article and its embed */
export const lidarSans = localFont({ src: './fonts/figtree-latin.woff2', weight: '300 900', display: 'swap', variable: '--ls-sans' });
