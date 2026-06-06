import type { Metadata } from 'next';
import PhotographyClient from './PhotographyClient';

export const metadata: Metadata = {
  title: 'Photography · Braven Chiam | Chiambucket',
  description:
    'Browse photo albums from Europe, China, New Zealand, 21:9 ultrawide shots, and more. Photography by Braven Chiam, a Singapore-based engineer and designer.',
  alternates: { canonical: 'https://www.chiambucket.com/photography' },
  openGraph: {
    title: 'Photography · Braven Chiam | Chiambucket',
    description:
      'Albums from Europe, China, New Zealand and more. Design through a different lens.',
    url: 'https://www.chiambucket.com/photography',
    type: 'website',
  },
  twitter: {
    title: 'Photography · Braven Chiam',
    description: 'Photo albums by Braven Chiam: Europe, China, New Zealand and more.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Photography by Braven Chiam',
  description:
    'A collection of photo albums by Braven Chiam, covering travel and creative photography across Europe, China, New Zealand, and more.',
  url: 'https://www.chiambucket.com/photography',
  author: {
    '@type': 'Person',
    name: 'Braven Chiam',
    url: 'https://www.chiambucket.com/',
  },
};

export default function PhotographyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhotographyClient />
    </>
  );
}
