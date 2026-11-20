import type { Metadata } from 'next';
import PhotographyClient from '../../photography/PhotographyClient';
import { loadPhotographyCopy } from '../../photography/_copy';
import { photographyJsonLd } from '../../photography/jsonLd';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = await loadPhotographyCopy(lang);
  return langMeta('/photography', lang, meta, { twitter: { title: meta.title, description: meta.twitterDescription } });
}

export default async function LangPhotographyPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const copy = await loadPhotographyCopy(lang);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photographyJsonLd(copy.meta, lang)) }}
      />
      <PhotographyClient copy={copy} />
    </>
  );
}
