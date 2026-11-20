import type { Lang } from '@/lib/i18n';
import type { ArchiveCopy } from './en';

/* Only the visitor's language is loaded; translators add `zh: () => import('./zh')` and so on. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: ArchiveCopy }>>> = { en: () => import('./en'), es: () => import('./es'), fr: () => import('./fr'), ru: () => import('./ru'), de: () => import('./de'), nl: () => import('./nl'), ja: () => import('./ja'), zh: () => import('./zh') };

export async function loadArchiveCopy(lang: Lang): Promise<ArchiveCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
