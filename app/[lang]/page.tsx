import type { Metadata } from 'next';
import HomeStory from '../_home/HomeStory';
import { loadHomeCopy } from '../_home/_copy';
import { homeJsonLd } from '../_home/jsonLd';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = await loadHomeCopy(lang);
  return langMeta('/', lang, meta, { keywords: meta.keywords, twitter: { title: meta.twitterTitle, description: meta.twitterDescription } });
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const copy = await loadHomeCopy(lang);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(copy.ld, lang)) }}
      />
      <HomeStory copy={copy} />
    </>
  );
}
