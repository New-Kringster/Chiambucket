import type { Metadata } from 'next';
import LumenArticle from '../../lumen/Article';
import { loadLumenCopy } from '../../lumen/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/lumen', lang, (await loadLumenCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/logo.png' }] } };
}

export default async function LangLumenPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <LumenArticle lang={lang} />;
}
