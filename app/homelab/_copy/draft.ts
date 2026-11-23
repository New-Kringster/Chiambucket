import en, { type HomelabCopy } from './en';

/* While the page is being redesigned its English changes faster than the translations can follow
   (translation is the last step before publishing; see "Languages" in CLAUDE.md). Until then each
   language file keeps the strings it already has and borrows English for anything new: objects are
   merged key by key, and a list whose length changed comes from English whole. Once every language
   is translated again, the files go back to `const xx: HomelabCopy = {...}` and this file goes. */
export type Draft<T> = T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: Draft<T[K]> } : T;

function merge(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (Array.isArray(base)) return Array.isArray(over) && over.length === base.length ? over : base;
  if (base && typeof base === 'object' && !(base as { $$typeof?: unknown }).$$typeof) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base)) out[k] = merge((base as Record<string, unknown>)[k], (over as Record<string, unknown>)?.[k]);
    return out;
  }
  return typeof over === typeof base ? over : base;
}

export const draft = (partial: Draft<HomelabCopy>): HomelabCopy => merge(en, partial) as HomelabCopy;
