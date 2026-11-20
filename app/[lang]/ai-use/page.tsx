import type { Metadata } from 'next';
import AiUse from '../../ai-use/AiUse';
import { loadAiUseCopy } from '../../ai-use/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const m = langMeta('/ai-use', lang, (await loadAiUseCopy(lang)).meta);
  return { ...m, openGraph: { ...m.openGraph, type: 'article' } };
}

export default async function LangAiUsePage({ params }: Props) {
  const { lang } = await params;
  return <AiUse lang={lang} c={await loadAiUseCopy(lang)} />;
}
