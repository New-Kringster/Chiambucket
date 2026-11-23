import type { Metadata } from 'next';
import ScrollRulerArticle from '../../scroll-ruler/Article';
import { loadScrollRulerCopy } from '../../scroll-ruler/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/scroll-ruler', lang, (await loadScrollRulerCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/scroll-ruler-pf-context.webp' }] } };
}

export default async function LangScrollRulerPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <ScrollRulerArticle lang={lang} />;
}
