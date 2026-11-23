import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import BeadreaderArticle, { URL } from './Article';

/* The English article. The page itself is Article.tsx, shared with
   /{lang}/beadreader; its words are _copy/en.tsx. */
export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/beadreader') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/beadreader-cover.webp' }],
  },
};

export default function BeadReaderPage() {
  return <BeadreaderArticle lang="en" />;
}
