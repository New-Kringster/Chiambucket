'use client';
import { Children, createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* The OCR Reader article's chapter engine, in the PCB chapter's composition.

   Cover   a full-viewport opening for every chapter: the blueprint grid, the
           chapter numeral, the two-line title with a dotted contents list, and the
           chapter's key visual on a floating 3D plate.
   Page    a chapter that reads top to bottom: rows of one visual beside its copy,
           nothing pinned, so a reader just scrolls.
   Story   a pinned stage where scrolling advances frames; kept for the two
           chapters where one object changes step by step (the DrumNet run and
           the ConfigKing screen).

   Pointers name parts of a visual. Labels sit in bands above and below the
   picture with elbow leaders down to the point, so they never cover the picture.
   On phones they become numbered markers with a legend under the title. */

export type Pointer = {
  at: [number, number];          // the thing being named, in % of the visual's box
  label: string;
  to?: [number, number];         // kept for older frames: only to[0] is used, as the label's column
  side?: 'l' | 'r';
  edge?: 'top' | 'bottom';       // which band the label sits in; derived from `at` when absent
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

const LANE = 26;   // px per label lane in a band

type Placed = { p: Pointer; x: number; edge: 'top' | 'bottom'; lane: number };
/* Labels go into the band nearer the point, in the point's own column; when two
   columns are close the second label drops into the next lane. */
function placeLabels(list: Pointer[]): Placed[] {
  const items: Placed[] = list.map((p) => ({ p, x: Math.max(4, Math.min(96, p.to ? p.to[0] : p.at[0])), edge: p.edge ?? (p.at[1] < 50 ? 'top' : 'bottom'), lane: 0 }));
  // a label's width, as a share of a typical picture (about 560 px wide)
  const width = (p: Pointer) => Math.min(46, p.label.length * 1.25 + 3);
  for (const edge of ['top', 'bottom'] as const) {
    const band = items.filter((i) => i.edge === edge).sort((a, b) => a.x - b.x);
    const taken: Array<{ l: number; r: number; lane: number }> = [];
    for (const it of band) {
      const w = width(it.p);
      const l = it.x - (it.x < 14 ? w * 0.06 : it.x > 86 ? w * 0.94 : w / 2), r = l + w;
      let lane = 0;
      while (lane < 3 && taken.some((t) => t.lane === lane && l < t.r + 1.5 && r > t.l - 1.5)) lane++;
      it.lane = Math.min(2, lane);
      taken.push({ l, r, lane: it.lane });
    }
  }
  return items;
}
export const bandLanes = (list?: Pointer[]) => {
  if (!list?.length) return { lt: 0, lb: 0 };
  const placed = placeLabels(list);
  const max = (edge: 'top' | 'bottom') => placed.filter((i) => i.edge === edge).reduce((m, i) => Math.max(m, i.lane + 1), 0);
  return { lt: max('top'), lb: max('bottom') };
};

function Pointers({ list }: { list: Pointer[] }) {
  const placed = placeLabels(list);
  return (
    <div className="ws-pointers" aria-hidden="true">
      {placed.map(({ p, x, edge, lane }, i) => {
        const [ax, ay] = p.at;
        const style = {
          '--x': x, '--ax': ax, '--ay': ay, '--lane': lane, '--i': i,
          '--hx': Math.min(ax, x), '--hw': Math.abs(ax - x),
          '--tx': x < 14 ? '-6%' : x > 86 ? '-94%' : '-50%',
        } as CSSProperties;
        return (
          <div key={i} className={`ws-ptr ${edge}`} style={style}>
            <i className="ws-ptr-h" /><i className="ws-ptr-v" /><i className="ws-ptr-dot" />
            <span className="ws-ptr-label">{p.label}</span>
            <i className="ws-ptr-n">{i + 1}</i>
          </div>
        );
      })}
    </div>
  );
}

/* One visual with its pointers; the bands' height is reserved around the picture. */
function Visual({ visual, pointers, show }: { visual: ReactNode; pointers?: Pointer[]; show: boolean }) {
  const { lt, lb } = bandLanes(pointers);
  return (
    <div className="ws-pic" style={{ '--lt': lt, '--lb': lb } as CSSProperties}>
      <div className="ws-pic-in">
        {show ? Children.toArray(visual) : null}
        {show && pointers?.length ? <Pointers list={pointers} /> : null}
      </div>
    </div>
  );
}

function Legend({ pointers }: { pointers?: Pointer[] }) {
  if (!pointers?.length) return null;
  return <ol className="ws-ptr-legend" aria-hidden="true">{pointers.map((p, k) => <li key={k}><i>{k + 1}</i>{p.label}</li>)}</ol>;
}

const useReduced = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return reduced;
};

/* ── Story: the pinned stage ── */
export default function Story({ id, chapter, title, frames, per = 0.92, ariaLabel }: { id: string; chapter?: string; title: string; frames: Frame[]; per?: number; ariaLabel?: string }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const reduced = useReduced();
  const n = frames.length;
  const height = `calc(${n * per + 1} * 100svh)`;

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
                <div className="ws-visual"><Visual visual={fr.visual} pointers={fr.pointers} show={near} /></div>
                <div className="ws-copy">
                  {fr.eyebrow && <p className="ws-eyebrow">{fr.eyebrow}</p>}
                  <h2>{fr.title}</h2>
                  <Legend pointers={fr.pointers} />
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

/* ── Page: a chapter that scrolls ── */
function useInView<T extends Element>(ref: React.RefObject<T | null>, threshold = 0.3) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold, rootMargin: '-6% 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return on;
}

function Row({ frame: fr, index }: { frame: Frame; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, 0.25);
  const ctx = useMemo(() => ({ active, near: true, index }), [active, index]);
  return (
    <FrameCtx.Provider value={ctx}>
      <div ref={ref} id={fr.id} className={`ws-row${fr.wide ? ' wide' : ''}${fr.cls ? ` ${fr.cls}` : ''}`} data-state={active ? 'active' : 'next'}>
        <div className="ws-visual"><Visual visual={fr.visual} pointers={fr.pointers} show /></div>
        <div className="ws-copy">
          {fr.eyebrow && <p className="ws-eyebrow">{fr.eyebrow}</p>}
          <h2>{fr.title}</h2>
          <Legend pointers={fr.pointers} />
          {fr.body && <div className="ws-copy-body">{Children.toArray(fr.body)}</div>}
        </div>
      </div>
    </FrameCtx.Provider>
  );
}

export function Page({ id, chapter, title, rows, cls }: { id: string; chapter?: string; title: string; rows: Frame[]; cls?: string }) {
  return (
    <section id={id} className={`ws-story ws-single${cls ? ` ${cls}` : ''}`} aria-label={title}>
      {chapter && <div className="ws-stage-chapter">{`Chapter - ${chapter}`}<span>{title}</span></div>}
      {rows.map((r, k) => <Row key={r.id ?? k} frame={r} index={k} />)}
    </section>
  );
}

/* ── Cover: how a chapter begins ── */
export type Contents = Array<{ label: string; href?: string }>;
export function Cover({ id, chapter, title, lines, contents, plate, cls }: { id: string; chapter: string; title: string; lines: string[]; contents?: Contents; plate: ReactNode; cls?: string }) {
  const ref = useRef<HTMLElement>(null);
  const active = useInView(ref, 0.2);
  const reduced = useReduced();
  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => { const el = ref.current; if (el) { el.style.removeProperty('--mx'); el.style.removeProperty('--my'); } };
  return (
    <section ref={ref} id={id} className={`ws-cover${cls ? ` ${cls}` : ''}`} data-state={active ? 'active' : 'next'} aria-label={`Chapter ${chapter}: ${title}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="ws-cover-grid" aria-hidden="true" />
      <div className="ws-cover-halo" aria-hidden="true" />
      <div className="ws-stage-chapter">{`Chapter - ${chapter}`}<span>{title}</span></div>
      <div className="ws-cover-copy">
        <h2 className="ws-cover-title">{lines.map((l) => <span key={l}>{l}</span>)}</h2>
        {contents?.length ? (
          <nav className="ws-contents ws-cover-contents" aria-label={`In chapter ${chapter}`}>
            {contents.map((c, k) => c.href
              ? <a key={c.label} href={c.href}><span>{c.label}</span><i /><span>({k + 1})</span></a>
              : <span key={c.label} className="static"><span>{c.label}</span><i /><span>({k + 1})</span></span>)}
          </nav>
        ) : null}
      </div>
      <div className="ws-cover-plate" aria-hidden="true"><div className="ws-plate">{plate}</div></div>
    </section>
  );
}

/* The plate's object: one picture, or a short stack of them in depth. */
export function Plate({ src, srcs, alt = '', base = '/images/waterslop/', cls }: { src?: string; srcs?: string[]; alt?: string; base?: string; cls?: string }) {
  const list = srcs ?? (src ? [src] : []);
  return (
    <div className={`ws-plate-obj${list.length > 1 ? ' stack' : ''}${cls ? ` ${cls}` : ''}`} style={{ '--n': list.length } as CSSProperties}>
      {list.map((s, k) => <img key={s} src={s.startsWith('/') ? s : base + s} alt={k === 0 ? alt : ''} loading="lazy" decoding="async" style={{ '--k': k } as CSSProperties} />)}
    </div>
  );
}

/* Two pictures side by side. */
export function Pair({ a, b, altA, altB, base = '/images/waterslop/' }: { a: string; b: string; altA: string; altB: string; base?: string }) {
  return (
    <div className="ws-pair">
      <img src={base + a} alt={altA} loading="lazy" decoding="async" />
      <img src={base + b} alt={altB} loading="lazy" decoding="async" />
    </div>
  );
}
