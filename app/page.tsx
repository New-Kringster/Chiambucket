import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Braven Chiam · Chiambucket | Engineer, Designer & Photographer',
  description: 'Braven Chiam is an engineer who designs. Explore his projects (5G rovers, custom PCBs, smart-home systems), design and photography work, and a solar-powered self-hosted homelab.',
  keywords: 'Braven Chiam, Chiambucket, engineer, designer, photographer, Singapore, homelab, self-hosted, ESP32, PCB design, 3D CAD, portfolio',
  alternates: { canonical: 'https://www.chiambucket.com/' },
  openGraph: {
    title: 'Braven Chiam · Chiambucket | Engineer, Designer & Photographer',
    description: 'An engineer who designs. Projects, design, photography and a solar-powered homelab, all in one place.',
    url: 'https://www.chiambucket.com/',
    type: 'website',
  },
  twitter: {
    title: 'Braven Chiam · Chiambucket',
    description: 'An engineer who designs. Projects, design, photography and a solar-powered homelab.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Braven Chiam',
    url: 'https://www.chiambucket.com/',
    image: 'https://www.chiambucket.com/images/logo.png',
    jobTitle: 'Engineer & Designer',
    email: 'mailto:braven@chiambucket.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Singapore', addressCountry: 'SG' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Nanyang Polytechnic' },
    knowsAbout: [
      'Electronics Engineering', 'PCB Design', 'Embedded Systems', 'ESP32',
      'Microcontrollers', '3D CAD', 'UI Design', 'Photography', 'Self-hosting',
    ],
    sameAs: [
      'https://github.com/New-Kringster',
      'https://www.instagram.com/bombastic_demise',
      'https://www.youtube.com/@newkringster2564',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chiambucket',
    url: 'https://www.chiambucket.com/',
    author: { '@type': 'Person', name: 'Braven Chiam' },
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
