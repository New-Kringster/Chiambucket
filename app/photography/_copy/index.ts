import type { Lang } from '@/lib/i18n';
import type { PhotographyCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: PhotographyCopy }>>> = { en: () => import('./en') };

export async function loadPhotographyCopy(lang: Lang): Promise<PhotographyCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { PhotographyCopy };
