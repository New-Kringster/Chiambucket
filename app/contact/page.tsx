import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { langAlternates } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Contact | Braven Chiam',
  description:
    'Email Braven Chiam at braven@chiambucket.com, or find him on GitHub, LinkedIn, YouTube, Instagram and WhatsApp.',
  alternates: { canonical: 'https://www.chiambucket.com/contact', languages: langAlternates('/contact') },
  openGraph: {
    title: 'Contact | Braven Chiam',
    description: 'Email braven@chiambucket.com, or find me on GitHub, LinkedIn, YouTube, Instagram and WhatsApp.',
    url: 'https://www.chiambucket.com/contact',
    type: 'website',
  },
  twitter: {
    title: 'Contact | Braven Chiam',
    description: 'Email me at braven@chiambucket.com.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
