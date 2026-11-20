import type { Metadata } from 'next';
import Credits from '../../credits/Credits';
import { creditsCopy } from '../../credits/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

type Props = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = creditsCopy(lang);
  return langMeta('/credits', lang, meta, { twitter: { title: meta.title, description: meta.twitterDescription } });
}

export default async function LangCreditsPage({ params }: Props) {
  const { lang } = await params;
  return <Credits lang={lang} />;
}
