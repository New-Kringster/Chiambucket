import type { Lang } from '@/lib/i18n';
import type { LidarCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: LidarCopy }>>> = { en: () => import('./en') };

export async function loadLidarCopy(lang: Lang): Promise<LidarCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { LidarCopy };
