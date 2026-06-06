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

export default function HomePage() {
  return <HomeClient />;
}
