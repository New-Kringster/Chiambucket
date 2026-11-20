import type { Lang } from '@/lib/i18n';
import type { ArchiveCopy } from './en';

/* Only the visitor's language is loaded; translators add `zh: () => import('./zh')` and so on. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: ArchiveCopy }>>> = { en: () => import('./en') };

export async function loadArchiveCopy(lang: Lang): Promise<ArchiveCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
