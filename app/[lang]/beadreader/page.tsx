import type { Metadata } from 'next';
import BeadreaderArticle from '../../beadreader/Article';
import { loadBeadreaderCopy } from '../../beadreader/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/beadreader', lang, (await loadBeadreaderCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/beadreader-cover.webp' }] } };
}

export default async function LangBeadreaderPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <BeadreaderArticle lang={lang} />;
}
