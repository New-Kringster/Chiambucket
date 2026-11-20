import type { Metadata } from 'next';
import HomeStory from './_home/HomeStory';
import { loadHomeCopy } from './_home/_copy';
import en from './_home/_copy/en';
import { homeJsonLd } from './_home/jsonLd';
import { langAlternates } from '@/lib/i18n';

const { meta } = en;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  alternates: { canonical: 'https://www.chiambucket.com/', languages: langAlternates('/') },
  openGraph: {
    title: meta.title,
    description: meta.ogDescription,
    url: 'https://www.chiambucket.com/',
    type: 'website',
  },
  twitter: {
    title: meta.twitterTitle,
    description: meta.twitterDescription,
  },
};

export default async function HomePage() {
  const copy = await loadHomeCopy('en');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(copy.ld, 'en')) }}
      />
      <HomeStory copy={copy} />
    </>
  );
}
