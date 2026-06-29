'use client';
import { useState, type ReactNode } from 'react';

type View = 'formatted' | 'code';

/* Inline touches for the formatted view: curly-quote "..." spans, style -> arrows. */
function inline(text: string, kp: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let k = 0;
  const pushPlain = (s: string) => {
    s.split('->').forEach((p, idx) => {
      if (idx > 0) nodes.push(<span key={`${kp}-a${k++}`} className="lm-pr-arrow">→</span>);
      if (p) nodes.push(<span key={`${kp}-t${k++}`}>{p}</span>);
    });
  };
  const re = /"([^"]+)"/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) pushPlain(text.slice(last, m.index));
    nodes.push(<span key={`${kp}-q${k++}`} className="lm-pr-q">“{m[1]}”</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) pushPlain(text.slice(last));
  return nodes;
}

/* Minimal markdown renderer for the LUMEN system prompt: headings, ordered/
   unordered lists (with one level of nesting + wrapped lines), example blocks
   ("quote" followed by its JSON), and paragraphs. */
function renderPrompt(src: string): ReactNode[] {
  const lines = src.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let b = 0;

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (t === '') { i++; continue; }

    // heading
    if (t.startsWith('## ')) {
      blocks.push(<h4 key={b++} className="lm-pr-h">{t.slice(3)}</h4>);
      i++;
      continue;
    }

    // example block: a line that opens with a quote, then its JSON until a blank line
    if (line[0] === '"') {
      const q = line;
      i++;
      const code: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && lines[i][0] !== '"') { code.push(lines[i]); i++; }
      blocks.push(
        <div key={b++} className="lm-pr-ex">
          <div className="lm-pr-ex-q">{inline(q, `ex${b}`)}</div>
          {code.length > 0 && <pre className="lm-pr-ex-code">{code.join('\n')}</pre>}
        </div>
      );
      continue;
    }

    // ordered list
    if (/^\d+\.\s/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/, '')); i++; }
      blocks.push(<ol key={b++} className="lm-pr-ol">{items.map((x, n) => <li key={n}>{inline(x, `ol${b}-${n}`)}</li>)}</ol>);
      continue;
    }

    // unordered list with nested "* " sub-bullets and wrapped continuation lines
    if (t.startsWith('- ')) {
      type Item = { text: string; subs: string[] };
      const items: Item[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (l.trim() === '') break;
        const indent = l.length - l.trimStart().length;
        const lt = l.trim();
        if (indent === 0 && lt.startsWith('- ')) items.push({ text: lt.slice(2), subs: [] });
        else if (indent >= 2 && lt.startsWith('* ') && items.length) items[items.length - 1].subs.push(lt.slice(2));
        else if (indent >= 2 && items.length) {
          const it = items[items.length - 1];
          if (it.subs.length) it.subs[it.subs.length - 1] += ' ' + lt;
          else it.text += ' ' + lt;
        } else break;
        i++;
      }
      blocks.push(
        <ul key={b++} className="lm-pr-ul">
          {items.map((it, n) => (
            <li key={n}>
              {inline(it.text, `ul${b}-${n}`)}
              {it.subs.length > 0 && (
                <ul className="lm-pr-sub">{it.subs.map((s, mn) => <li key={mn}>{inline(s, `sub${b}-${n}-${mn}`)}</li>)}</ul>
              )}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // paragraph: gather consecutive plain lines
    const para: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      const lt = l.trim();
      if (lt === '' || lt.startsWith('## ') || /^\d+\.\s/.test(lt) || lt.startsWith('- ') || l[0] === '"') break;
      para.push(lt);
      i++;
    }
    blocks.push(<p key={b++} className="lm-pr-p">{inline(para.join(' '), `p${b}`)}</p>);
  }

  return blocks;
}

/* Shows the system prompt with a Formatted/Code toggle, a preview that fades
   out, and a Show more / less control. */
export default function PromptReveal({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('formatted');
  return (
    <div className={`lm-pr${open ? ' open' : ''}`}>
      <div className="lm-pr-head">
        <span className="lm-pr-eyebrow">System prompt · server/prompts.py</span>
        <div className="lm-pr-toggle" role="tablist" aria-label="Prompt view">
          <button type="button" role="tab" aria-selected={view === 'formatted'} className={`lm-pr-tab${view === 'formatted' ? ' on' : ''}`} onClick={() => setView('formatted')}>
            Formatted
          </button>
          <button type="button" role="tab" aria-selected={view === 'code'} className={`lm-pr-tab${view === 'code' ? ' on' : ''}`} onClick={() => setView('code')}>
            Code
          </button>
        </div>
      </div>
      <div className="lm-pr-box">
        <div className="lm-pr-content">
          {view === 'code'
            ? <pre className="lm-pr-pre">{text}</pre>
            : <div className="lm-pr-fmt">{renderPrompt(text)}</div>}
        </div>
        {!open && <div className="lm-pr-fade" aria-hidden="true" />}
      </div>
      <button className="lm-pr-btn" type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Show less' : 'Show the full prompt'}
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
