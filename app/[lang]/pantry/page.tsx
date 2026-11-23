import type { Metadata } from 'next';
import PantryArticle from '../../pantry/Article';
import { loadPantryCopy } from '../../pantry/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/pantry', lang, (await loadPantryCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/pantry-pf-context.webp' }] } };
}

export default async function LangPantryPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <PantryArticle lang={lang} />;
}
