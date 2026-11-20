import type { Metadata } from 'next';
import Archive from '../../archive/Archive';
import { loadArchiveCopy } from '../../archive/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = await loadArchiveCopy(lang);
  const m = langMeta('/archive', lang, meta);
  return { ...m, openGraph: { ...m.openGraph, title: meta.ogTitle, images: [{ url: '/images/archive/v4-desktop.webp' }] } };
}

export default async function LangArchivePage({ params }: Props) {
  const { lang } = await params;
  return <Archive lang={lang} c={await loadArchiveCopy(lang)} />;
}
