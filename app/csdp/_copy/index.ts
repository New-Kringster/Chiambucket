import type { Lang } from '@/lib/i18n';
import type { CsdpCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: CsdpCopy }>>> = { en: () => import('./en') };

export async function loadCsdpCopy(lang: Lang): Promise<CsdpCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { CsdpCopy };
