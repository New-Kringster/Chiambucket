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
           the ConfigKing screen). */

export type Frame = {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  visual: ReactNode;
  wide?: boolean;                // the visual spans the stage, copy sits beneath it
  cls?: string;                  // extra class on the frame (for per-frame CSS)
};

type Ctx = { active: boolean; near: boolean; index: number };
const FrameCtx = createContext<Ctx>({ active: true, near: true, index: 0 });
/* Widgets inside a frame read this to start or pause their own motion. Fragments
   written in the server page arrive as plain arrays, so children are keyed here. */
export const useFrame = () => useContext(FrameCtx);

/* One visual; it fades and lifts in with its frame. */
function Visual({ visual, show }: { visual: ReactNode; show: boolean }) {
  return (
    <div className="ws-pic">
      <div className="ws-pic-in">{show ? Children.toArray(visual) : null}</div>
    </div>
  );
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
      // The next thing on the page: skip siblings with no box (a <style> follows the ConfigKing story).
      let next = el.nextElementSibling as HTMLElement | null;
      while (next && next.getClientRects().length === 0) next = next.nextElementSibling as HTMLElement | null;
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
                <div className="ws-visual"><Visual visual={fr.visual} show={near} /></div>
                <div className="ws-copy">
                  {fr.eyebrow && <p className="ws-eyebrow">{fr.eyebrow}</p>}
                  <h2>{fr.title}</h2>
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
        <div className="ws-visual"><Visual visual={fr.visual} show /></div>
        <div className="ws-copy">
          {fr.eyebrow && <p className="ws-eyebrow">{fr.eyebrow}</p>}
          <h2>{fr.title}</h2>
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

/* ── Cover: how a chapter begins ──
   A pinned, full-screen opening in three beats, all tied to scroll position:
   the chapter's key visual forms out of bright glitter (the dissolve in
   components/dissolve.ts), the giant title rises letter by letter with a one
   line lede, then the visual breaks up again into the page's dark ground so
   the chapter starts on a clean slate. Without WebGL, or with reduced motion,
   it is a still picture with the copy in place. */
export type Contents = Array<{ label: string; href?: string }>;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export function Cover({ id, chapter, title, lines, contents, bg, lede, focus = [0.5, 0.5], cls }: {
  id: string; chapter: string; title: string; lines: string[]; contents?: Contents;
  bg: string; lede?: string; focus?: [number, number]; cls?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const glHost = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);
  const reduced = useReduced();
  const src = bg.startsWith('/') ? bg : '/images/waterslop/' + bg;
  const n = lines.join('').length;
  const [fX, fY] = focus;

  useEffect(() => {
    const el = ref.current, host = glHost.current;
    if (!el || !host || reduced) return;
    let cv: HTMLCanvasElement | null = null;
    let fx: import('../../components/dissolve').Dissolve | null = null;
    let raf = 0, alive = true, near = false, ready = false, last = '';
    const t0 = performance.now();
    const frame = () => {
      raf = 0;
      if (!alive || !near) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = clamp01((vh - r.top) / r.height);
      const inP = span(t, 0.17, 0.42), outP = span(t, 0.8, 0.99);
      el.style.setProperty('--v', inP.toFixed(4));
      el.style.setProperty('--x', outP.toFixed(4));
      el.style.setProperty('--t', span(t, 0.27, 0.52).toFixed(4));
      el.style.setProperty('--l', span(t, 0.44, 0.58).toFixed(4));
      el.style.setProperty('--o', span(t, 0.76, 0.92).toFixed(4));
      if (fx && ready) {
        const moving = (inP > 0 && inP < 1) || (outP > 0 && outP < 1);
        const key = `${inP.toFixed(4)}|${outP.toFixed(4)}|${t.toFixed(4)}`;
        if (moving || key !== last) {
          last = key;
          fx.draw({ inP, outP, time: (performance.now() - t0) / 1000, focus: [fX, fY], zoom: 1.1 - 0.1 * t });
        }
      }
      raf = requestAnimationFrame(frame);
    };
    let mod: typeof import('../../components/dissolve') | null = null;
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) {
        if (!fx && mod) {
          cv = document.createElement('canvas');
          cv.className = 'ws-op-gl';
          host.appendChild(cv);
          fx = mod.Dissolve.create(cv);
          if (!fx) { cv.remove(); cv = null; }
          if (fx) {
            fx.setColor([0x18 / 255, 0x17 / 255, 0x16 / 255]);
            mod.loadImage(src).then((im) => { if (!alive || !fx) return; fx.setImage(im, im.naturalWidth / im.naturalHeight); ready = true; last = ''; setGl(true); }).catch(() => {});
          }
        }
        if (!raf) raf = requestAnimationFrame(frame);
      } else if (fx) {
        // far away: give the WebGL context back, the page has many of them
        fx.destroy(); fx = null; cv?.remove(); cv = null; ready = false; setGl(false);
      }
    }, { rootMargin: '60% 0px 60% 0px' });
    import('../../components/dissolve').then((m) => { mod = m; if (!alive) return; io.observe(el); });
    const onResize = () => { fx?.resize(); last = ''; };
    window.addEventListener('resize', onResize);
    return () => { alive = false; io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); fx?.destroy(); cv?.remove(); };
  }, [src, reduced, fX, fY]);

  let k = 0;
  return (
    <section ref={ref} id={id} className={`ws-op${gl ? ' gl' : ''}${reduced ? ' still' : ''}${cls ? ` ${cls}` : ''}`} aria-label={`Chapter ${chapter}: ${title}`}>
      <div className="ws-op-stage">
        <img className="ws-op-still" src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div ref={glHost} className="ws-op-glhost" aria-hidden="true" />
        <div className="ws-op-shade" aria-hidden="true" />
        <div className="ws-op-copy">
          <p className="ws-op-n">Chapter {chapter}</p>
          <h2 className="ws-op-title" aria-label={title} style={{ '--n': n, '--w': Math.max(...lines.map((l) => l.length)) } as CSSProperties}>
            {lines.map((l) => (
              <span key={l} className="ws-op-line" aria-hidden="true">
                {[...l].map((ch) => <span key={k} className="ws-op-ch" style={{ '--i': k++ } as CSSProperties}>{ch === ' ' ? '\u00a0' : ch}</span>)}
              </span>
            ))}
          </h2>
          {lede && <p className="ws-op-lede">{lede}</p>}
        </div>
        {contents?.length ? (
          <nav className="ws-op-contents" aria-label={`In chapter ${chapter}`}>
            {contents.map((c, j) => c.href
              ? <a key={c.label} href={c.href}><span>{c.label}</span><i /><span>{j + 1}</span></a>
              : <span key={c.label}><span>{c.label}</span><i /><span>{j + 1}</span></span>)}
          </nav>
        ) : null}
      </div>
    </section>
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
