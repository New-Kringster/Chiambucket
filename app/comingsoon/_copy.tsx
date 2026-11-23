import type { Lang } from '@/lib/i18n';

/* The coming-soon placeholder's words. Translations go in _copy.<lang>.tsx and are added to COMINGSOON_COPY. */
const en = {
  meta: {
    title: 'Coming soon | Braven Chiam',
    description: 'This write-up is not finished yet.',
  },
  kicker: 'Not written up yet',
  title: <>Coming <em>soon</em></>,
  sub: 'I haven\'t finished this write-up yet, but the projects I have written up are listed on the homepage.',
  all: 'See all projects',
  home: 'Go to the homepage',
};
export type ComingSoonCopy = typeof en;

export const COMINGSOON_COPY: Partial<Record<Lang, ComingSoonCopy>> = { en };
export const comingSoonCopy = (lang: Lang): ComingSoonCopy => COMINGSOON_COPY[lang] ?? en;
