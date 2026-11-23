import type { Metadata } from 'next';
import BrolocatorArticle from '../../brolocator/Article';
import { loadBrolocatorCopy } from '../../brolocator/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/brolocator', lang, (await loadBrolocatorCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/borlocator-pf-context.webp' }] } };
}

export default async function LangBrolocatorPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <BrolocatorArticle lang={lang} />;
}
