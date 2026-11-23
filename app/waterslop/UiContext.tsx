'use client';
/* The article's chrome words (the chapter engine's labels and the ConfigKing
   simulator's page controls), shared down the page: Article.tsx provides them
   for the page's language, Story.tsx and ConfigKingSim.tsx read them with useUi(). */
import { createContext, useContext, type ReactNode } from 'react';
import type { WaterslopCopy } from './_copy';

type Ui = WaterslopCopy['ui'];
const UiContext = createContext<Ui | null>(null);

export function UiProvider({ ui, children }: { ui: Ui; children: ReactNode }) {
  return <UiContext.Provider value={ui}>{children}</UiContext.Provider>;
}

export function useUi(): Ui {
  const u = useContext(UiContext);
  if (!u) throw new Error('useUi() outside UiProvider');
  return u;
}
