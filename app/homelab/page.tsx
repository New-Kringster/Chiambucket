import type { Metadata } from 'next';
import HomelabPage from './HomelabPage';
import en from './_copy/en';
import { langAlternates } from '@/lib/i18n';

const { title, description } = en.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/homelab', languages: langAlternates('/homelab') },
  openGraph: {
    title,
    description,
    url: '/homelab',
    type: 'website',
  },
};

export default function Page() {
  return <HomelabPage lang="en" />;
}
