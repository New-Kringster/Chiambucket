import type { Metadata } from 'next';
import HomelabPage from '../../homelab/HomelabPage';
import { loadHomelabCopy } from '../../homelab/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return langMeta('/homelab', lang, (await loadHomelabCopy(lang)).meta);
}

export default async function LangHomelabPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return <HomelabPage lang={lang} />;
}
