import type { Metadata } from 'next';
import AiUse from './AiUse';
import en from './_copy/en';
import { langAlternates } from '@/lib/i18n';

const URL = 'https://www.chiambucket.com/ai-use';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: { canonical: URL, languages: langAlternates('/ai-use') },
  openGraph: { title: en.meta.title, description: en.meta.description, url: URL, type: 'article' },
  twitter: { title: en.meta.title, description: en.meta.description },
};

export default function AiUsePage() {
  return <AiUse lang="en" c={en} />;
}
