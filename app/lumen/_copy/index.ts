import type { Lang } from '@/lib/i18n';
import type { LumenCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: LumenCopy }>>> = { en: () => import('./en') };

export async function loadLumenCopy(lang: Lang): Promise<LumenCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { LumenCopy };
