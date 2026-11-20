import type { Lang } from '@/lib/i18n';
import es from './_copy.es';
import fr from './_copy.fr';
import ru from './_copy.ru';
import de from './_copy.de';
import nl from './_copy.nl';
import ja from './_copy.ja';
import zh from './_copy.zh';

/* The 404 page's words (small enough to ship every language together). */
const en = {
  meta: { title: 'Page not found | Braven Chiam' },
  kicker: 'Page not found',
  sub: 'There is nothing at this address, so the page may have moved or the link may be wrong.',
  home: 'Go to the homepage',
  projects: 'See all projects',
};
export type NotFoundCopy = typeof en;

export const NOT_FOUND: Partial<Record<Lang, NotFoundCopy>> = { en, es, fr, ru, de, nl, ja, zh };
export const notFoundCopy = (lang: Lang): NotFoundCopy => NOT_FOUND[lang] ?? en;
