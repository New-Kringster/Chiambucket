import type { Lang } from '@/lib/i18n';
import es from './_copy.es';
import fr from './_copy.fr';
import ru from './_copy.ru';
import de from './_copy.de';
import nl from './_copy.nl';
import ja from './_copy.ja';
import zh from './_copy.zh';

/* The credits page's words (small enough to ship every language together). */
const en = {
  meta: {
    title: 'Credits | Braven Chiam',
    description:
      'The colophon for chiambucket.com, which is built with Claude and Next.js, hosted on Vercel, and uses a self-hosted Lychee gallery for the photos.',
    ogDescription: 'How this site is built and hosted, and which tools are behind it.',
    twitterDescription: 'This site is built with Claude and hosted on Vercel.',
  },
  kicker: 'Credits',
  title: <>Credits &amp; <em>content</em></>,
  sub: 'This page explains how the site is built and hosted, and which tools are behind it.',
  claude: {
    eyebrow: 'Design and build',
    title: 'Claude',
    body: <>I designed and built this site with Claude, an AI model from <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude helped with the layout, wrote much of the code, tightened the copy and helped me debug, while I decided what stayed, what changed and how it looks.</>,
  },
  hosting: {
    eyebrow: 'Hosting',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> hosts the site and deploys a new version on every push. Vercel Analytics and Speed Insights count visits and measure page speed.</>,
      'My homelab still runs the photo gallery and my other self-hosted services, but the public site runs on Vercel because managed hosting keeps it faster and more reliable.',
    ],
  },
  tools: {
    eyebrow: 'Tools and content',
    title: 'Software and typefaces',
    list: [
      <><b>Next.js and React</b>, written in TypeScript</>,
      <><b>Framer Motion</b> for the homelab page and the project demos</>,
      <><b>Lychee</b>, the photo gallery I host for the photography page</>,
      <><b>Oswald, Inter and DM Sans</b>, the main typefaces</>,
      <><b>Canvas</b> for the painted skies, clouds, grass and sea behind every page, drawn once and moved only with CSS</>,
      <><b>Inline SVG</b> for the icons</>,
    ],
    note: 'The photographs, writing and project work on this site are my own.',
  },
};
export type CreditsCopy = typeof en;

export const CREDITS: Partial<Record<Lang, CreditsCopy>> = { en, es, fr, ru, de, nl, ja, zh };
export const creditsCopy = (lang: Lang): CreditsCopy => CREDITS[lang] ?? en;
