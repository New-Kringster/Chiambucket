'use client';
/* The homepage's copy, shared down the story's tree (HomeStory provides it; the
   cards and set pieces read it with useHomeCopy()). */
import { createContext, useContext, type ReactNode } from 'react';
import type { HomeCopy } from './_copy';

const HomeCopyContext = createContext<HomeCopy | null>(null);

export function HomeCopyProvider({ copy, children }: { copy: HomeCopy; children: ReactNode }) {
  return <HomeCopyContext.Provider value={copy}>{children}</HomeCopyContext.Provider>;
}

export function useHomeCopy(): HomeCopy {
  const c = useContext(HomeCopyContext);
  if (!c) throw new Error('useHomeCopy() outside HomeCopyProvider');
  return c;
}
