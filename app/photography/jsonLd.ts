import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';
import type { PhotographyCopy } from './_copy';

/** The page's ImageGallery JSON-LD; the translated pages also say which language they are in. */
export function photographyJsonLd(meta: PhotographyCopy['meta'], lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: meta.ldName,
    description: meta.ldDescription,
    url: SITE + localize('/photography', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
    author: {
      '@type': 'Person',
      name: 'Braven Chiam',
      url: 'https://www.chiambucket.com/',
    },
  };
}
