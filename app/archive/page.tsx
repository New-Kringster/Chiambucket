import type { Metadata } from 'next';
import Archive from './Archive';
import en from './_copy/en';
import { langAlternates } from '@/lib/i18n';

const URL = 'https://www.chiambucket.com/archive';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/archive') },
  openGraph: {
    title: en.meta.ogTitle,
    description: en.meta.ogDescription,
    url: URL,
    type: 'website',
    images: [{ url: '/images/archive/v4-desktop.webp' }],
  },
};

export default function ArchivePage() {
  return <Archive lang="en" c={en} />;
}
