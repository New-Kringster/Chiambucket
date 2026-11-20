import HomelabClient from './HomelabClient';
import { SERVICES } from './data';
import { loadHomelabCopy } from './_copy';
import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';

/* The homelab page in one language: its JSON-LD and the client page, both from the copy for `lang`.
   Rendered by app/homelab/page.tsx (English) and app/[lang]/homelab/page.tsx. */
export default async function HomelabPage({ lang }: { lang: Lang }) {
  const copy = await loadHomelabCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: copy.jsonLd.headline,
    description: copy.meta.description,
    author: { '@type': 'Person', name: 'Braven Chiam' },
    about: copy.jsonLd.about,
    keywords: SERVICES.map((s) => s.name).join(', '),
    mainEntityOfPage: SITE + localize('/homelab', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomelabClient copy={copy} />
    </>
  );
}
