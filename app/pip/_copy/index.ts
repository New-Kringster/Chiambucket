import type { Lang } from '@/lib/i18n';
import type { PipCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: PipCopy }>>> = { en: () => import('./en') };

export async function loadPipCopy(lang: Lang): Promise<PipCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { PipCopy };
