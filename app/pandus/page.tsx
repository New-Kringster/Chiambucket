import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import PandusArticle, { URL } from './Article';

/* The English article. The page itself is Article.tsx, shared with
   /{lang}/pandus; its words are _copy/en.tsx. */
export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/pandus') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/pandusarticle.webp' }],
  },
};

export default function PandusPage() {
  return <PandusArticle lang="en" />;
}
