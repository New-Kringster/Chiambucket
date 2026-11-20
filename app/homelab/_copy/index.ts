import type { Lang } from '@/lib/i18n';
import type { HomelabCopy } from './en';

/* One file per language, loaded on the server so only the visitor's language reaches the browser. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: HomelabCopy }>>> = { en: () => import('./en') };
export async function loadHomelabCopy(lang: Lang): Promise<HomelabCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
