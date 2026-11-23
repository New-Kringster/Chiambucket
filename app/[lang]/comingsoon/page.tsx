import type { Metadata } from 'next';
import ComingSoon from '../../comingsoon/ComingSoon';
import { comingSoonCopy } from '../../comingsoon/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return langMeta('/comingsoon', lang, comingSoonCopy(lang).meta, { robots: 'noindex, nofollow' });
}

export default async function LangComingSoonPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <ComingSoon lang={lang} />;
}
