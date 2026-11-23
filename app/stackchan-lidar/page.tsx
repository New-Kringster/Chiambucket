import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import LidarArticle, { URL } from './Article';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/stackchan-lidar') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/stackchan-lidar-pf-context.webp' }],
  },
};

export default function StackchanLidarPage() {
  return <LidarArticle lang="en" />;
}
