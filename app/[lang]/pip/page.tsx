import type { Metadata } from 'next';
import PipArticle from '../../pip/Article';
import { loadPipCopy } from '../../pip/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = await loadPipCopy(lang);
  // like the English page: Open Graph and the card carry the article's own title, as an article
  const m = langMeta('/pip', lang, meta, { twitter: { title: meta.ogTitle, images: ['/images/pip/og.webp'] } });
  return {
    ...m,
    openGraph: { ...m.openGraph, title: meta.ogTitle, type: 'article', images: [{ url: '/images/pip/og.webp', width: 1200, height: 630 }] },
  };
}

export default async function LangPipPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <PipArticle lang={lang} />;
}
