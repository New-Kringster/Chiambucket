import type { Metadata } from 'next';
import WaterslopArticle from './Article';
import en from './_copy/en';
import { langAlternates } from '@/lib/i18n';

/* The English article. The page itself is Article.tsx, shared with
   /{lang}/waterslop; its words are _copy/en.tsx. */
const { meta } = en;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: 'https://www.chiambucket.com/waterslop', languages: langAlternates('/waterslop') },
  openGraph: {
    title: meta.ogTitle,
    description: meta.description,
    url: 'https://www.chiambucket.com/waterslop',
    type: 'article',
    images: [{ url: '/waterslop/og.webp', width: 1200, height: 630 }],
  },
};

export default function WaterslopPage() {
  return <WaterslopArticle lang="en" />;
}
