import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Braven Chiam · Chiambucket | Engineer, Designer & Photographer',
  description: 'Braven Chiam is an engineer who designs. Flagship builds: Project June, a 5G rover streaming three live video feeds, and BeadReader, a private invite-only book reader. Plus custom PCBs, design, photography and a solar-powered homelab.',
  keywords: 'Braven Chiam, Chiambucket, Project June, 5G rover, BeadReader, book reader app, engineer, designer, photographer, Singapore, ESP32, PCB design, Next.js, homelab, portfolio',
  alternates: { canonical: 'https://www.chiambucket.com/' },
  openGraph: {
    title: 'Braven Chiam · Chiambucket | Engineer, Designer & Photographer',
    description: 'Flagship builds Project June (a 5G rover) and BeadReader (a private book reader), plus custom PCBs, design, photography and a solar-powered homelab.',
    url: 'https://www.chiambucket.com/',
    type: 'website',
  },
  twitter: {
    title: 'Braven Chiam · Chiambucket',
    description: 'Flagship builds Project June (a 5G rover) and BeadReader (a private book reader), plus engineering, design, photography and a homelab.',
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
    subjectOf: [
      { '@type': 'CreativeWork', name: 'Project June', url: 'https://www.chiambucket.com/project-june' },
      { '@type': 'SoftwareApplication', name: 'BeadReader', url: 'https://www.chiambucket.com/beadreader' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chiambucket',
    url: 'https://www.chiambucket.com/',
    author: { '@type': 'Person', name: 'Braven Chiam' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Project June',
    headline: 'Project June, a 5G rover that streams, senses and steers',
    url: 'https://www.chiambucket.com/project-june',
    author: { '@type': 'Person', name: 'Braven Chiam' },
    about: 'A 5G radio-controlled rover with three simultaneous live WebRTC video streams, MQTT telemetry, a full sensor suite and a custom PCB, designed enclosure to firmware in three weeks.',
    keywords: '5G rover, WebRTC, ESP32, MQTT, custom PCB, KiCAD, Onshape, telemetry',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BeadReader',
    url: 'https://www.chiambucket.com/beadreader',
    applicationCategory: 'BookApplication',
    operatingSystem: 'Web',
    author: { '@type': 'Person', name: 'Braven Chiam' },
    about: 'A private, invite-only online book reader with access-code auth, live read-together presence, an SQL-enforced explicit-content gate, text and webtoon books, reading stats and offline support. Built with Next.js, Supabase and Cloudflare R2.',
    keywords: 'private book reader, invite-only, Next.js, Supabase, Cloudflare R2, reading together, offline PWA',
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
