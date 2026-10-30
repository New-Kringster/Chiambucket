/*
  AiMark — a project's level on the Scale of AI use. It shows the official
  label mark (the level plus its words, e.g. "Little use of AI based Tools")
  from public/images/ai-use and links to that level on /ai-use, so
  a reader can see what the level means. One map holds every project's level;
  a project that is not in it (Pandus, ELEC-F, the unwritten ones) shows no
  mark. Works in server and client components alike.
*/
export type AiLevel = 1 | 2 | 3 | 4;

const SHORT: Record<AiLevel, string> = { 1: 'little use', 2: 'average use', 3: 'heavy use', 4: 'entirely AI' };

/** Each project's level on the scale, by project id. */
export const AI_LEVEL: Partial<Record<string, AiLevel>> = {
  'proj-waterslop': 3,
  'proj-june': 1,
  'proj-beadreader': 3,
  'proj-lora': 1,
  'proj-lumen': 2,
  'proj-ema': 1,
};

export default function AiMark({ project, className }: { project: string; className?: string }) {
  const level = AI_LEVEL[project];
  if (!level) return null;
  const label = `AI use: L${level}, ${SHORT[level]}. Open the Scale of AI use`;
  return (
    <a className={`ai-mark${className ? ` ${className}` : ''}`} href={`/ai-use#l${level}`} aria-label={label} title={label}>
      <img src={`/images/ai-use/L${level}-label.svg`} alt="" width={84} height={94} />
    </a>
  );
}
