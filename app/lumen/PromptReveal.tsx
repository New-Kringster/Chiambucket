'use client';
import { useState } from 'react';

/* Shows a preview of the system prompt that fades out, with a Show more / less toggle. */
export default function PromptReveal({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lm-pr${open ? ' open' : ''}`}>
      <div className="lm-pr-eyebrow">System prompt · server/prompts.py</div>
      <div className="lm-pr-box">
        <pre className="lm-pr-pre">{text}</pre>
        {!open && <div className="lm-pr-fade" aria-hidden="true" />}
      </div>
      <button className="lm-pr-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Show less' : 'Show the full prompt'}
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
