import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import en from './_copy/en';
import ProjectJuneArticle, { URL } from './Article';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/project-june') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: URL,
    type: 'article',
    images: [{ url: '/images/ProjJuneBanner1.webp' }],
  },
};

export default function ProjectJunePage() {
  return <ProjectJuneArticle lang="en" />;
}
