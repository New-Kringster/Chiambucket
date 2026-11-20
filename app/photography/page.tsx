import type { Metadata } from 'next';
import PhotographyClient from './PhotographyClient';
import { loadPhotographyCopy } from './_copy';
import en from './_copy/en';
import { photographyJsonLd } from './jsonLd';
import { langAlternates } from '@/lib/i18n';

const { meta } = en;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: 'https://www.chiambucket.com/photography', languages: langAlternates('/photography') },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: 'https://www.chiambucket.com/photography',
    type: 'website',
  },
  twitter: {
    title: meta.title,
    description: meta.twitterDescription,
  },
};

export default async function PhotographyPage() {
  const copy = await loadPhotographyCopy('en');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photographyJsonLd(copy.meta, 'en')) }}
      />
      <PhotographyClient copy={copy} />
    </>
  );
}
