import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import WaterslopChapter from './WaterslopChapter';

const description =
  'Chapter V of WaterSlop, my ESP32-S3 water meter reader: the four-layer PCB, its components and the 3D-printed enclosure, rendered from the real KiCad and CAD files.';

export const metadata: Metadata = {
  title: 'WaterSlop: PCB & Enclosure — Chiambucket',
  description,
  alternates: { canonical: 'https://www.chiambucket.com/waterslop' },
  openGraph: {
    title: 'WaterSlop: PCB & Enclosure — Chiambucket',
    description,
    url: 'https://www.chiambucket.com/waterslop',
    type: 'article',
    images: [{ url: '/waterslop/og.webp', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'WaterSlop: PCB & Enclosure',
  description,
  image: 'https://www.chiambucket.com/waterslop/og.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/waterslop',
};

export default function WaterslopPage() {
  return (
    <main className="ws-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WaterslopChapter />
      <ArticleRecommendations exclude="proj-waterslop" />
    </main>
  );
}
