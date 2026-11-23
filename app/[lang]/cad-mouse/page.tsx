import type { Metadata } from 'next';
import CadMouseArticle from '../../cad-mouse/Article';
import { loadCadMouseCopy } from '../../cad-mouse/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/cad-mouse', lang, (await loadCadMouseCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/cad-mouse-pf-context.webp' }] } };
}

export default async function LangCadMousePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <CadMouseArticle lang={lang} />;
}
