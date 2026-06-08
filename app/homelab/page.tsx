import type { Metadata } from 'next';
import HomelabClient from './HomelabClient';
import { SERVICES } from './data';

export const metadata: Metadata = {
  title: 'HomeLab · Braven Chiam | Self-hosted cloud, networking & infrastructure',
  description:
    'A hands-on cloud-engineering, networking and software-design sandbox: a three-node, solar-powered homelab running ~38 self-hosted services behind a segmented UniFi network. The supplemental layer that makes my hardware projects actually work.',
  alternates: { canonical: '/homelab' },
  openGraph: {
    title: 'HomeLab · Braven Chiam',
    description:
      'Three nodes, a segmented UniFi network, and ~38 self-hosted services. My sandbox for learning cloud engineering, networking and software design.',
    url: '/homelab',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'The Chiambucket HomeLab',
  description:
    'A three-node self-hosted homelab used to learn cloud engineering, networking and software design, supporting a portfolio of hardware projects.',
  author: { '@type': 'Person', name: 'Braven Chiam' },
  about: ['Self-hosting', 'Home networking', 'Cloud engineering', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
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
