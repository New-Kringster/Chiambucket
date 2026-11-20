import type { Lang } from '@/lib/i18n';
import type { AiUseCopy } from './en';

/* Only the visitor's language is loaded; translators add `zh: () => import('./zh')` and so on. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: AiUseCopy }>>> = { en: () => import('./en') };

export async function loadAiUseCopy(lang: Lang): Promise<AiUseCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
