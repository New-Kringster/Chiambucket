import type { Lang } from '@/lib/i18n';
import type { HomeCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: HomeCopy }>>> = { en: () => import('./en') };

export async function loadHomeCopy(lang: Lang): Promise<HomeCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { HomeCopy };
