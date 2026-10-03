import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Braven Chiam | Hardware, software and design',
  description: 'Projects by Braven Chiam, an Electronic and Computer Engineering student at Nanyang Polytechnic: a 5G rover, a private book reader, an off-grid LoRa messenger with his own PCB, a voice-controlled room and more, each split into the hardware, software and design he did.',
  keywords: 'Braven Chiam, Chiambucket, Project June, 5G rover, BeadReader, LoRA Messenger, ESP32, PCB design, KiCAD, Onshape, Next.js, homelab, photography, Singapore',
  alternates: { canonical: 'https://www.chiambucket.com/' },
  openGraph: {
    title: 'Braven Chiam | Hardware, software and design',
    description: 'A 5G rover, a private book reader, an off-grid LoRa messenger and more, each split into the hardware, software and design I did.',
    url: 'https://www.chiambucket.com/',
    type: 'website',
  },
  twitter: {
    title: 'Braven Chiam',
    description: 'A 5G rover, a private book reader, an off-grid LoRa messenger and more, each split into hardware, software and design.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Braven Chiam',
    url: 'https://www.chiambucket.com/',
    image: 'https://www.chiambucket.com/images/logo.png',
    jobTitle: 'Electronic and Computer Engineering student',
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
    headline: 'Project June, a 5G rover',
    url: 'https://www.chiambucket.com/project-june',
    author: { '@type': 'Person', name: 'Braven Chiam' },
    about: 'A 5G rover with three live WebRTC camera feeds, MQTT telemetry, an ESP32-S3 sensor suite, a MOSFET motor driver and a 2S3P battery pack, built in three weeks.',
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
