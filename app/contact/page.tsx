import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact · Braven Chiam | Chiambucket',
  description: 'Get in touch with Braven Chiam. Email braven@chiambucket.com, or reach out on Instagram, YouTube, GitHub and WhatsApp.',
  alternates: { canonical: 'https://www.chiambucket.com/contact' },
  openGraph: {
    title: 'Contact · Braven Chiam | Chiambucket',
    description: 'Email braven@chiambucket.com, or reach out on Instagram, YouTube, GitHub and WhatsApp.',
    url: 'https://www.chiambucket.com/contact',
    type: 'website',
  },
  twitter: {
    title: 'Contact · Braven Chiam',
    description: 'Email braven@chiambucket.com, or reach out on social media.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
