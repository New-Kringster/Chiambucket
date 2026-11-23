import type { Metadata } from 'next';
import ElecfArticle from '../../elecf/Article';
import { loadElecfCopy } from '../../elecf/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/elecf', lang, (await loadElecfCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/elecf-img.webp' }] } };
}

export default async function LangElecfPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <ElecfArticle lang={lang} />;
}
