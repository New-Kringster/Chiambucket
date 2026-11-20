'use client';
import { createContext, useContext } from 'react';
import type { HomelabCopy } from './en';

/* HomelabClient gets the page's copy as a prop from the server page and shares it with the
   map and the dialogs through this context. */
const HomelabCopyContext = createContext<HomelabCopy | null>(null);
export const HomelabCopyProvider = HomelabCopyContext.Provider;
export function useHomelabCopy(): HomelabCopy {
  const c = useContext(HomelabCopyContext);
  if (!c) throw new Error('useHomelabCopy needs a HomelabCopyProvider');
  return c;
}
