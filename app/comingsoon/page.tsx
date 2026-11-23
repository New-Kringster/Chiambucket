import type { Metadata } from 'next';
import { langAlternates } from '@/lib/i18n';
import ComingSoon from './ComingSoon';
import { comingSoonCopy } from './_copy';

const en = comingSoonCopy('en');
export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  robots: 'noindex, nofollow',
  alternates: { languages: langAlternates('/comingsoon') },
};

export default function ComingSoonPage() {
  return <ComingSoon lang="en" />;
}
