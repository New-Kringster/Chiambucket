import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import CadMouseArticle, { URL } from './Article';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/cad-mouse') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/cad-mouse-pf-context.webp' }],
  },
};

export default function CadMousePage() {
  return <CadMouseArticle lang="en" />;
}
