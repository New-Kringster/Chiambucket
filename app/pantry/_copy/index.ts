import type { Lang } from '@/lib/i18n';
import type { PantryCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: PantryCopy }>>> = { en: () => import('./en') };

export async function loadPantryCopy(lang: Lang): Promise<PantryCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { PantryCopy };
