import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import PipArticle, { URL } from './Article';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/pip') },
  openGraph: {
    title: en.meta.ogTitle,
    description: en.meta.description,
    url: URL,
    type: 'article',
    images: [{ url: '/images/pip/og.webp', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: en.meta.ogTitle, description: en.meta.description, images: ['/images/pip/og.webp'] },
};

export default function PipPage() {
  return <PipArticle lang="en" />;
}
