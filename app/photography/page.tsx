import type { Metadata } from 'next';
import PhotographyClient from './PhotographyClient';

const description =
  'Photo albums by Braven Chiam from Europe, China, New Zealand and Hong Kong, plus ultrawide 21:9 frames, and the software he edits with.';

export const metadata: Metadata = {
  title: 'Photography | Braven Chiam',
  description,
  alternates: { canonical: 'https://www.chiambucket.com/photography' },
  openGraph: {
    title: 'Photography | Braven Chiam',
    description,
    url: 'https://www.chiambucket.com/photography',
    type: 'website',
  },
  twitter: {
    title: 'Photography | Braven Chiam',
    description: 'Photo albums by Braven Chiam: Europe, China, New Zealand, Hong Kong and more.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Photography by Braven Chiam',
  description:
    'Photo albums by Braven Chiam from Europe, China, New Zealand and Hong Kong, plus ultrawide 21:9 frames.',
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
