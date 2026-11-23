import type { ReactNode } from 'react';

/* A frame's words from the page's copy (its eyebrow, title and body), leaving
   anything else the copy holds for it, such as alt text, to the visual. A plain
   module, so both the server page and the client chapters can call it. */
export const words = (c: { eyebrow?: string; title: string; body?: ReactNode }) => ({ eyebrow: c.eyebrow, title: c.title, body: c.body });
