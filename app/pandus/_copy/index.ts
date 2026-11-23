import type { Lang } from '@/lib/i18n';
import type { PandusCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: PandusCopy }>>> = { en: () => import('./en') };

export async function loadPandusCopy(lang: Lang): Promise<PandusCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { PandusCopy };
