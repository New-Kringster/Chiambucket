import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import CsdpArticle, { URL } from './Article';

/* The English article. The page itself is Article.tsx, shared with
   /{lang}/csdp; its words are _copy/en.tsx. */
export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/csdp') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.description,
    url: URL,
    type: 'article',
    images: [{ url: '/images/Ema-pf-context.webp' }],
  },
};

export default function CsdpPage() {
  return <CsdpArticle lang="en" />;
}
