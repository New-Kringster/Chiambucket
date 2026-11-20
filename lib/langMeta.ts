import type { Metadata } from 'next';
import { OG_LOCALE, SITE, langAlternates, localize, type Lang } from './i18n';

/** Metadata for a localized page: its own canonical, hreflang alternates and Open Graph locale.
    `extra.twitter` is merged into the defaults (so the large card stays), the rest of `extra` is added as is. */
export function langMeta(base: string, lang: Lang, m: { title: string; description: string; ogDescription?: string }, extra: Metadata = {}): Metadata {
  const url = SITE + localize(base, lang);
  const { twitter, ...rest } = extra;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: url, languages: langAlternates(base) },
    openGraph: { title: m.title, description: m.ogDescription ?? m.description, url, type: 'website', locale: OG_LOCALE[lang] },
    twitter: { card: 'summary_large_image', title: m.title, description: m.ogDescription ?? m.description, ...(twitter ?? {}) } as Metadata['twitter'],
    ...rest,
  };
}
