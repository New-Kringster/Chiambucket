'use client';
import { Children, createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/* Story: one pinned chapter of the OCR Reader article, told the way the PCB chapter
   is told. The stage is sticky for the whole scroll of the section; scrolling
   advances through frames. Each frame is one visual (a photo, a diagram, a widget)
   with pointers drawn onto it, and a short copy block in the chapter's own position.
   Native scrolling: no wheel capture, so the page stays predictable on phones.

   Frames are mounted when they are within one of the active frame, so a long story
   never holds every image in memory. Copy for every frame is in the HTML. */

export type Pointer = {
  at: [number, number];          // the thing being named, in % of the visual's box
  label: string;
  to?: [number, number];         // where the label sits; derived from `at` when absent
  side?: 'l' | 'r';              // which side of `at` the label goes when `to` is absent
};
export type Frame = {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  visual: ReactNode;
  pointers?: Pointer[];
  wide?: boolean;                // the visual spans the stage, copy sits beneath it
  cls?: string;                  // extra class on the frame (for per-frame CSS)
};

type Ctx = { active: boolean; near: boolean; index: number };
const FrameCtx = createContext<Ctx>({ active: true, near: true, index: 0 });
/* Widgets inside a frame read this to start or pause their own motion. Fragments
   written in the server page arrive as plain arrays, so children are keyed here. */
export const useFrame = () => useContext(FrameCtx);

const labelPos = (p: Pointer): [number, number] => {
  if (p.to) return p.to;
  const side = p.side ?? (p.at[0] > 56 ? 'l' : 'r');
  const dx = side === 'l' ? -13 : 13;
  const dy = p.at[1] < 20 ? 10 : -10;
  return [Math.max(2, Math.min(98, p.at[0] + dx)), Math.max(4, Math.min(96, p.at[1] + dy))];
};

function Pointers({ list }: { list: Pointer[] }) {
  return (
    <div className="ws-pointers" aria-hidden="true">
      <svg width="100%" height="100%">
        {list.map((p, i) => {
          const to = labelPos(p);
          return (
            <g key={i} style={{ ['--i' as string]: i }}>
              <line x1={`${p.at[0]}%`} y1={`${p.at[1]}%`} x2={`${to[0]}%`} y2={`${to[1]}%`} pathLength={1} />
              <circle cx={`${p.at[0]}%`} cy={`${p.at[1]}%`} r={3.5} />
            </g>
          );
        })}
      </svg>
      {list.map((p, i) => {
        const to = labelPos(p);
        // the label grows away from the nearer edge, so it never leaves the picture
        const left = to[0] >= 50;
        return (
          <span key={i} className={`ws-ptr-label${left ? ' l' : ''}`} style={{ left: `${to[0]}%`, top: `${to[1]}%`, ['--i' as string]: i }}>{p.label}</span>
        );
      })}
      {/* phones: a numbered marker on the picture and a legend under the title */}
      {list.map((p, i) => <i key={`n${i}`} className="ws-ptr-n" style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%`, ['--i' as string]: i }}>{i + 1}</i>)}
    </div>
  );
}

export default function Story({ id, chapter, title, frames, per = 0.92, ariaLabel }: { id: string; chapter?: string; title: string; frames: Frame[]; per?: number; ariaLabel?: string }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = frames.length;
  const height = `calc(${n * per + 1} * 100svh)`;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  useEffect(() => {
    const el = root.current, st = stage.current;
    if (!el || !st) return;
    let raf = 0, last = -1, lastP = -1;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      const k = Math.min(n - 1, Math.floor(p * n + 1e-6));
      // progress inside the current frame, for continuous effects (zooms)
      const fp = Math.min(1, Math.max(0, (p - k / n) * n));
      if (Math.abs(fp - lastP) > 0.004) { st.style.setProperty('--p', fp.toFixed(3)); lastP = fp; }
      if (k !== last) { last = k; setI(k); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const vh = window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (k >= n) {
      // leave the story: the next section's top
      const next = el.nextElementSibling as HTMLElement | null;
      const y = next ? next.getBoundingClientRect().top + window.scrollY : top + el.offsetHeight;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    const travel = el.offsetHeight - vh;
    const y = top + ((k + 0.3) / n) * travel;
    window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };

  const ctxs = useMemo(() => frames.map((_, k) => ({ active: k === i, near: Math.abs(k - i) <= 1, index: k })), [frames, i]);
  const f = frames[i];
  return (
    <section ref={root} id={id} className="ws-story" style={{ height }} aria-label={ariaLabel ?? title}>
      <div ref={stage} className="ws-stage-pin" data-frame={i} data-wide={f.wide ? 'true' : undefined}>
        <div className="ws-stage-chapter">{chapter ? `Chapter - ${chapter}` : ''}<span>{title}</span></div>
        {frames.map((fr, k) => {
          const state = k === i ? 'active' : k < i ? 'past' : 'next';
          const near = Math.abs(k - i) <= 1;
          return (
            <FrameCtx.Provider key={fr.id ?? k} value={ctxs[k]}>
              <div className={`ws-frame${fr.wide ? ' wide' : ''}${fr.cls ? ` ${fr.cls}` : ''}`} data-state={state} aria-hidden={k !== i}>
                <div className="ws-visual">
                  <div className="ws-pic">
                    {near ? Children.toArray(fr.visual) : null}
                    {near && fr.pointers?.length ? <Pointers list={fr.pointers} /> : null}
                  </div>
                </div>
                <div className="ws-copy">
                  {fr.eyebrow && <p className="ws-eyebrow">{fr.eyebrow}</p>}
                  <h2>{fr.title}</h2>
                  {fr.pointers?.length ? <ol className="ws-ptr-legend" aria-hidden="true">{fr.pointers.map((p, k) => <li key={k}><i>{k + 1}</i>{p.label}</li>)}</ol> : null}
                  {fr.body && <div className="ws-copy-body">{Children.toArray(fr.body)}</div>}
                </div>
              </div>
            </FrameCtx.Provider>
          );
        })}
        <div className="ws-stage-dots" aria-hidden="true">
          {frames.map((fr, k) => <button key={fr.id ?? k} type="button" tabIndex={-1} className={k === i ? 'on' : k < i ? 'done' : undefined} onClick={() => go(k)} title={fr.title} />)}
        </div>
        <button type="button" className="ws-next" onClick={() => go(i + 1)} aria-label={i + 1 < n ? 'Next frame' : 'Next chapter'}>
          <span>{i + 1 < n ? 'Next' : 'Next chapter'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}

/* A plain article block that sits between stories (the hero, the report). */
export function Pair({ a, b, altA, altB, base = '/images/waterslop/' }: { a: string; b: string; altA: string; altB: string; base?: string }) {
  return (
    <div className="ws-pair">
      <img src={base + a} alt={altA} loading="lazy" decoding="async" />
      <img src={base + b} alt={altB} loading="lazy" decoding="async" />
    </div>
  );
}
