import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import BrolocatorArticle, { URL } from './Article';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/brolocator') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.description,
    url: URL,
    type: 'article',
    images: [{ url: '/images/borlocator-pf-context.webp' }],
  },
};

export default function BrolocatorPage() {
  return <BrolocatorArticle lang="en" />;
}
