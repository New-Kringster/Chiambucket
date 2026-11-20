import type { Lang } from '@/lib/i18n';
import type { AiUseCopy } from './en';

/* Only the visitor's language is loaded; translators add `zh: () => import('./zh')` and so on. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: AiUseCopy }>>> = { en: () => import('./en'), es: () => import('./es'), fr: () => import('./fr'), ru: () => import('./ru'), de: () => import('./de'), nl: () => import('./nl'), ja: () => import('./ja'), zh: () => import('./zh') };

export async function loadAiUseCopy(lang: Lang): Promise<AiUseCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
