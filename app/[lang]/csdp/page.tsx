import type { Metadata } from 'next';
import CsdpArticle from '../../csdp/Article';
import { loadCsdpCopy } from '../../csdp/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/csdp', lang, (await loadCsdpCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/Ema-pf-context.webp' }] } };
}

export default async function LangCsdpPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <CsdpArticle lang={lang} />;
}
