import type { Lang } from '@/lib/i18n';
import type { WaterslopCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: WaterslopCopy }>>> = { en: () => import('./en') };

export async function loadWaterslopCopy(lang: Lang): Promise<WaterslopCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { WaterslopCopy };
