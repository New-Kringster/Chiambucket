import type { Lang } from '@/lib/i18n';
import type { ElecfCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: ElecfCopy }>>> = { en: () => import('./en') };

export async function loadElecfCopy(lang: Lang): Promise<ElecfCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { ElecfCopy };
