import type { Lang } from '@/lib/i18n';
import type { BrolocatorCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Record<Lang, () => Promise<{ default: BrolocatorCopy }>> = { en: () => import('./en'), zh: () => import('./zh'), ja: () => import('./ja'), nl: () => import('./nl'), de: () => import('./de'), ru: () => import('./ru'), fr: () => import('./fr'), es: () => import('./es') };

export async function loadBrolocatorCopy(lang: Lang): Promise<BrolocatorCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { BrolocatorCopy };
