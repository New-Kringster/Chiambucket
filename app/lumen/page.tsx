import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import LumenArticle, { URL } from './Article';

/* The English article. The page itself is Article.tsx, shared with
   /{lang}/lumen; its words are _copy/en.tsx. */
export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/lumen') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/logo.png' }],
  },
};

export default function LumenPage() {
  return <LumenArticle lang="en" />;
}
