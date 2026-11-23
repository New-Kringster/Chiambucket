import type { Metadata } from 'next';
import LidarArticle from '../../stackchan-lidar/Article';
import { loadLidarCopy } from '../../stackchan-lidar/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/stackchan-lidar', lang, (await loadLidarCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/stackchan-lidar-pf-context.webp' }] } };
}

export default async function LangStackchanLidarPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <LidarArticle lang={lang} />;
}
