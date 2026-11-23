import type { Lang } from '@/lib/i18n';
import type { ProjectJuneCopy } from './en';

/* Each language is its own chunk, so a visitor only downloads theirs. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: ProjectJuneCopy }>>> = { en: () => import('./en') };

export async function loadProjectJuneCopy(lang: Lang): Promise<ProjectJuneCopy> {
  return (await (LOADERS[lang] ?? LOADERS.en!)()).default;
}
export type { ProjectJuneCopy };
