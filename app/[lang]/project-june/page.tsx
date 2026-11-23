import type { Metadata } from 'next';
import ProjectJuneArticle from '../../project-june/Article';
import { loadProjectJuneCopy } from '../../project-june/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/project-june', lang, (await loadProjectJuneCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article', images: [{ url: '/images/ProjJuneBanner1.webp' }] } };
}

export default async function LangProjectJunePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <ProjectJuneArticle lang={lang} />;
}
