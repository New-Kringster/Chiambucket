import type { Metadata } from 'next';
import WaterslopArticle from '../../waterslop/Article';
import { loadWaterslopCopy } from '../../waterslop/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = await loadWaterslopCopy(lang);
  // like the English page: Open Graph and the card carry the article's own title, as an article
  const m = langMeta('/waterslop', lang, meta, { twitter: { title: meta.ogTitle } });
  return {
    ...m,
    openGraph: { ...m.openGraph, title: meta.ogTitle, type: 'article', images: [{ url: '/waterslop/og.webp', width: 1200, height: 630 }] },
  };
}

export default async function LangWaterslopPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <WaterslopArticle lang={lang} />;
}
