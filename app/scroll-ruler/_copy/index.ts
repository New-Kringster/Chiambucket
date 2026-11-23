import type { Lang } from '@/lib/i18n';
import type { ScrollRulerCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Record<Lang, () => Promise<{ default: ScrollRulerCopy }>> = { en: () => import('./en'), zh: () => import('./zh'), ja: () => import('./ja'), nl: () => import('./nl'), de: () => import('./de'), ru: () => import('./ru'), fr: () => import('./fr'), es: () => import('./es') };

export async function loadScrollRulerCopy(lang: Lang): Promise<ScrollRulerCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { ScrollRulerCopy };
