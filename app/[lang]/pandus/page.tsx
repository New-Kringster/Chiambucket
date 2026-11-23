import type { Metadata } from 'next';
import PandusArticle from '../../pandus/Article';
import { loadPandusCopy } from '../../pandus/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/pandus', lang, (await loadPandusCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/pandusarticle.webp' }] } };
}

export default async function LangPandusPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <PandusArticle lang={lang} />;
}
