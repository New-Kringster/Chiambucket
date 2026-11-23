import type { Lang } from '@/lib/i18n';
import type { BeadreaderCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: BeadreaderCopy }>>> = { en: () => import('./en') };

export async function loadBeadreaderCopy(lang: Lang): Promise<BeadreaderCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { BeadreaderCopy };
