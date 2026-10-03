import type { Metadata } from 'next';
import HomelabClient from './HomelabClient';
import { SERVICES } from './data';

const description =
  'Three servers at home running my photo library, file sharing, and the MQTT and TURN servers that Project June and LUMEN use. Hardware, network map, storage, services and live status.';

export const metadata: Metadata = {
  title: 'Homelab | Braven Chiam',
  description,
  alternates: { canonical: '/homelab' },
  openGraph: {
    title: 'Homelab | Braven Chiam',
    description,
    url: '/homelab',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Homelab',
  description,
  author: { '@type': 'Person', name: 'Braven Chiam' },
  about: ['Self-hosting', 'Home networking', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  keywords: SERVICES.map((s) => s.name).join(', '),
  mainEntityOfPage: 'https://www.chiambucket.com/homelab',
};

export default function HomelabPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomelabClient />
    </>
  );
}
