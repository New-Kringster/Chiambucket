import type { Lang } from '@/lib/i18n';
import type { CadMouseCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: CadMouseCopy }>>> = { en: () => import('./en') };

export async function loadCadMouseCopy(lang: Lang): Promise<CadMouseCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { CadMouseCopy };
