import type { Metadata } from 'next';
import Credits from './Credits';
import { CREDITS } from './_copy';
import { langAlternates } from '@/lib/i18n';

const en = CREDITS.en!;

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: 'https://www.chiambucket.com/credits', languages: langAlternates('/credits') },
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    url: 'https://www.chiambucket.com/credits',
  },
  twitter: {
    title: en.meta.title,
    description: en.meta.twitterDescription,
  },
};

export default function CreditsPage() {
  return <Credits lang="en" />;
}
