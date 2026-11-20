/*
  AiMark — a project's level on the Scale of AI use. It shows the official
  label mark (the level plus its words, e.g. "Little use of AI based Tools")
  from public/images/ai-use and links to that level on /ai-use, so
  a reader can see what the level means. One map holds every project's level;
  a project that is not in it (Pandus, ELEC-F, the unwritten ones) shows no
  mark. Works in server and client components alike.
*/
import { localize, type Lang } from '../lib/i18n';
import { SHELL } from '../lib/shell';
import { fill } from '../lib/fill';

export type AiLevel = 1 | 2 | 3 | 4;

/** Each project's level on the scale, by project id. */
export const AI_LEVEL: Partial<Record<string, AiLevel>> = {
  'proj-waterslop': 3,
  'proj-june': 1,
  'proj-beadreader': 3,
  'proj-lora': 1,
  'proj-lumen': 2,
  'proj-pip': 3,
  'proj-pantry': 3,
  'proj-ruler': 4,
  'proj-cadmouse': 3,
  'proj-lidar': 3,
  'proj-ema': 1,
};

/* `lang` (default English) picks the label's words and the /ai-use link's language; client callers
   pass useLang(), server pages their own language. The mark image itself is the same in every language. */
export default function AiMark({ project, className, lang = 'en' }: { project: string; className?: string; lang?: Lang }) {
  const level = AI_LEVEL[project];
  if (!level) return null;
  const t = SHELL[lang];
  const label = fill(t.aiUse, { n: level, short: t.aiShort[level - 1] });
  return (
    <a className={`ai-mark${className ? ` ${className}` : ''}`} href={localize(`/ai-use#l${level}`, lang)} aria-label={label} title={label}>
      <img src={`/images/ai-use/L${level}-label.svg`} alt="" width={84} height={94} />
    </a>
  );
}
