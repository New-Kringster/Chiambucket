import type { Lang } from '@/lib/i18n';
import zh from './_copy.zh';
import ja from './_copy.ja';
import nl from './_copy.nl';
import de from './_copy.de';
import ru from './_copy.ru';
import fr from './_copy.fr';
import es from './_copy.es';

/* The coming-soon placeholder's words; each other language is in _copy.<lang>.tsx. */
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

export const COMINGSOON_COPY: Record<Lang, ComingSoonCopy> = { en, zh, ja, nl, de, ru, fr, es };
export const comingSoonCopy = (lang: Lang): ComingSoonCopy => COMINGSOON_COPY[lang];
