'use client';
/*
  The moving parts of the Pip article.

  Stage   a tall section with a sticky, full-screen child. Scrolling through it
          sets --p (0..1) on the section, eased by a critically damped spring so
          nothing starts or stops dead, and data-beat when it is split into beats.
          The spring runs only while it is moving and the stage is near the screen.
  Tab5Hero  the opening: the Tab5 in 3D (tab5Scene.ts) turns to face us and
          grows until its screen fills the view.
  Clip    an autoplaying loop that loads near the screen and plays only on it.
  Desktops  the dots at the foot of the screen: one per chapter, in that
          chapter's desktop colour, like Pip's own desktop pill.
  PageFx  the nav's bottom edge as --pp-nav, and the slide-in for [data-pp-in].
  Reduced motion: no springs and no pinning (stages lay out as plain blocks),
  the hero is a still frame, loops show their posters.
*/
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setR(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/* A critically damped spring that follows a target; returns true while moving. */
function spring(omega = 9) {
  let x = -1, v = 0;
  return {
    get: () => x,
    step(target: number, dt: number, jump: boolean) {
      if (x < 0 || jump) { x = target; v = 0; return false; }
      const h = Math.min(dt, 1 / 30);
      const a = omega * omega * (target - x) - 2 * omega * v;
      v += a * h; x += v * h;
      if (Math.abs(target - x) < 1e-4 && Math.abs(v) < 1e-4) { x = target; v = 0; return false; }
      return true;
    },
  };
}

/* Progress through a tall element: 0 when its top meets the top of the screen, 1 when its bottom meets the bottom. */
function progressOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const run = r.height - window.innerHeight;
  return run > 0 ? clamp01(-r.top / run) : r.top < 0 ? 1 : 0;
}

/* Progress from the moment its top enters the screen (0) until its bottom meets the bottom of the screen (1). */
function enterOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return clamp01((window.innerHeight - r.top) / r.height);
}

type StageProps = {
  id?: string; className?: string; style?: CSSProperties; children: ReactNode;
  /** Height of the section in screens. */
  screens: number;
  beats?: number;
  onBeat?: (b: number) => void;
  onProgress?: (p: number) => void;
  label?: string;
  desk?: number;
  /** pin: 0 when the section reaches the top of the screen; enter: 0 when its top enters from below. */
  from?: 'pin' | 'enter';
};
export function Stage({ id, className, style, children, screens, beats = 0, onBeat, onProgress, label, desk, from = 'pin' }: StageProps) {
  const ref = useRef<HTMLElement>(null);
  const cb = useRef({ onBeat, onProgress });
  cb.current = { onBeat, onProgress };
  const reduced = useReduced();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { el.style.setProperty('--p', '1'); return; }
    const s = spring();
    let raf = 0, last = 0, near = false, beat = -1;
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const target = from === 'enter' ? enterOf(el) : progressOf(el);
      const moving = s.step(target, dt, Math.abs(target - s.get()) > 0.35);
      const p = s.get();
      el.style.setProperty('--p', p.toFixed(4));
      cb.current.onProgress?.(p);
      if (beats > 0) {
        const b = Math.min(beats - 1, Math.floor(p * beats));
        if (b !== beat) { beat = b; el.dataset.beat = String(b); cb.current.onBeat?.(b); }
      }
      if (moving && near) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const kick = () => { if (!raf && near) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting; kick(); }, { rootMargin: '50% 0px' });
    io.observe(el);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => { io.disconnect(); window.removeEventListener('scroll', kick); window.removeEventListener('resize', kick); if (raf) cancelAnimationFrame(raf); };
  }, [beats, reduced, from]);

  return (
    <section ref={ref} id={id} aria-label={label} data-desk={desk} className={`pp-stage${reduced ? ' is-still' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, ['--screens' as string]: screens }}>
      <div className="pp-sticky">{children}</div>
    </section>
  );
}

/* ── An autoplaying loop that loads near the screen and plays only while on it ── */
export function Clip({ src, poster, className, label, active = true, eager = false }: {
  src: string; poster: string; className?: string; label?: string; active?: boolean; eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(eager);
  const reduced = useReduced();
  // the observers outlive renders, so everything sync() reads lives in a ref
  const state = useRef({ on: false, active, load, reduced });
  state.current.active = active;
  state.current.load = load;
  state.current.reduced = reduced;

  const sync = () => {
    const v = ref.current, st = state.current;
    if (!v || !st.load) return;
    if (st.on && st.active && !st.reduced) { const pr = v.play(); if (pr) pr.catch(() => {}); }
    else v.pause();
  };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLoad(true); near.disconnect(); } }, { rootMargin: '60% 0px' });
    const on = new IntersectionObserver(([e]) => { state.current.on = e.isIntersecting; sync(); }, { threshold: 0.05 });
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (!conn?.saveData) near.observe(v);
    on.observe(v);
    return () => { near.disconnect(); on.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const v = ref.current; if (v && load && !reduced) v.load(); sync(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [load, reduced]);
  useEffect(() => { if (active && ref.current) ref.current.currentTime = 0; sync(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [active]);

  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none"
      aria-label={label} aria-hidden={label ? undefined : true}>
      {load && !reduced && <source src={src + '.webm'} type="video/webm" />}
      {load && !reduced && <source src={src + '.mp4'} type="video/mp4" />}
    </video>
  );
}

/* ── The hero: the Tab5 turns to face us and its screen fills the view ── */
export function Tab5Hero({ children, screen }: { children: ReactNode; screen: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReduced();
  const p = useRef(0);
  const scene = useRef<import('./tab5Scene').Tab5Scene | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let alive = true, raf = 0, visible = true;
    const video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.crossOrigin = 'anonymous';
    video.setAttribute('playsinline', '');
    const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== '';
    if (!reduced) { video.src = screen + (canWebm ? '.webm' : '.mp4'); video.preload = 'auto'; }
    const loop = () => {
      raf = 0;
      if (!alive || !visible) return;
      scene.current?.render();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };
    import('./tab5Scene').then(({ createTab5Scene }) => {
      if (!alive) return;
      try {
        scene.current = createTab5Scene(el, {
          video, glb: '/pip/tab5.glb', still: reduced ? screen + '.webp' : undefined,
          onReady: () => {
            if (!alive) return;
            setReady(true);
            // reduced motion: one still frame, the tablet turned a little, its screen on Pip
            if (reduced) { scene.current?.setProgress(0.12); scene.current?.render(); }
          },
        });
      } catch { return; }
      scene.current.setProgress(p.current);
      if (reduced) return;
      video.play().catch(() => {});
      start();
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced) { video.play().catch(() => {}); start(); } else video.pause();
    });
    io.observe(el);
    const onResize = () => { scene.current?.resize(); if (reduced) scene.current?.render(); };
    window.addEventListener('resize', onResize);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      scene.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const onVis = () => { if (document.hidden) video.pause(); else if (visible && !reduced) video.play().catch(() => {}); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      alive = false; io.disconnect();
      window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      if (raf) cancelAnimationFrame(raf);
      video.pause(); if (video.src) { video.removeAttribute('src'); video.load(); }
      scene.current?.destroy(); scene.current = null;
    };
  }, [screen, reduced]);

  return (
    <Stage className={`pp-hero${ready ? ' is-ready' : ''}`} screens={3} label="Pip on the M5Stack Tab5"
      onProgress={(v) => { p.current = v; scene.current?.setProgress(v); }}>
      <div className="pp-hero-gl" ref={host} aria-hidden="true" />
      {children}
    </Stage>
  );
}

/* ── Pip's moods, one beat each, the active one playing ── */
export type Mood = { key: string; name: string; line: string; clip: string };
export function Moods({ moods, id }: { moods: Mood[]; id?: string }) {
  const [beat, setBeat] = useState(0);
  const reduced = useReduced();
  return (
    <Stage id={id} className="pp-moods" screens={moods.length * 0.7 + 1} beats={moods.length} onBeat={setBeat} label="Pip's moods">
      <div className="pp-moods-in">
        <ol className="pp-mood-list" aria-hidden={reduced ? undefined : true}>
          {moods.map((m, i) => <li key={m.key} className={!reduced && i === beat ? 'on' : undefined}><span>{m.name}</span></li>)}
        </ol>
        <div className="pp-mood-view">
          {moods.map((m, i) => (
            <figure key={m.key} className={`pp-mood${reduced || i === beat ? ' on' : ''}`}>
              <Clip src={m.clip} poster={m.clip + '.webp'} className="pp-pipvid" active={reduced || i === beat} label={`Pip ${m.name.toLowerCase()}`} />
              <figcaption><b>{m.name}</b>{m.line}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ── Desktop dots: where you are, in the chapter's colour ── */
export function Desktops({ items }: { items: Array<{ id: string; name: string; color: string }> }) {
  const [cur, setCur] = useState(-1);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<Element, number>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e.isIntersecting ? e.intersectionRect.height : 0));
      let best = -1, bestH = 0;
      els.forEach((el, i) => { const h = seen.get(el) ?? 0; if (h > bestH) { bestH = h; best = i; } });
      setCur(best);
      setShow(best >= 0);
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className={`pp-desks${show ? ' is-on' : ''}`} aria-label="Chapters">
      {items.map((it, i) => (
        <a key={it.id} href={`#${it.id}`} className={i === cur ? 'on' : undefined} style={{ ['--c' as string]: it.color }} aria-current={i === cur ? 'true' : undefined}>
          <i aria-hidden="true" /><span>{it.name}</span>
        </a>
      ))}
    </nav>
  );
}

/* ── Page-wide: the nav's bottom edge, and content sliding in like the next desktop ── */
export function PageFx() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('pp-route');
    const nav = document.querySelector<HTMLElement>('.pnav');
    const set = () => html.style.setProperty('--pp-nav', `${Math.ceil(nav?.getBoundingClientRect().bottom ?? 80)}px`);
    set();
    const ro = new ResizeObserver(set);
    if (nav) ro.observe(nav);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('[data-pp-in]').forEach((el) => io.observe(el));
    return () => { ro.disconnect(); io.disconnect(); html.classList.remove('pp-route'); html.style.removeProperty('--pp-nav'); };
  }, []);
  return null;
}

/* ── A chapter opener: Pip in the chapter's colour, the title rising letter by letter, then a slide to the next desktop ── */
export function Opener({ id, desk, color, title, lede, clip, pipLabel }: {
  id: string; desk: number; color: string; title: string; lede: string; clip: string; pipLabel: string;
}) {
  let i = 0;
  const words = title.split(' ');
  const n = title.replace(/ /g, '').length;
  return (
    <Stage id={id} desk={desk} className="pp-op" screens={2.7} from="enter" label={title} style={{ ['--acc' as string]: color, ['--n' as string]: n }}>
      <div className="pp-op-in">
        <div className="pp-op-pip"><Clip src={clip} poster={clip + '.webp'} className="pp-pipvid" label={pipLabel} /></div>
        <h2 className="pp-op-t" aria-label={title}>
          {words.map((w, wi) => (
            <span className="pp-op-w" key={wi} aria-hidden="true">
              {Array.from(w).map((ch) => <span key={i} className="pp-op-l" style={{ ['--i' as string]: i++ }}>{ch}</span>)}
            </span>
          ))}
        </h2>
        <p className="pp-op-lede">{lede}</p>
      </div>
    </Stage>
  );
}

/* ── Desktops: scroll through three real home screens, each sliding in like a desktop switch ── */
export function DeskSwitch({ desks, id }: { desks: Array<{ src: string; name: string; color: string; alt: string }>; id?: string }) {
  const [beat, setBeat] = useState(0);
  const reduced = useReduced();
  return (
    <Stage id={id} className="pp-switch" screens={desks.length * 0.75 + 1} beats={desks.length} onBeat={setBeat} label="Three of my desktops">
      <div className="pp-switch-in" style={{ ['--acc' as string]: desks[beat].color }}>
        <div className="pp-tab" data-no-zoom>
          <i className="pp-tab-glass" aria-hidden="true" />
          <div className="pp-tab-screen">
            <div className="pp-switch-strip" style={{ transform: reduced ? undefined : `translateX(${-beat * 100}%)` }}>
              {desks.map((d) => <img key={d.name} src={d.src} alt={d.alt} loading="lazy" decoding="async" />)}
            </div>
          </div>
          <i className="pp-tab-cam" aria-hidden="true" />
        </div>
        <div className="pp-switch-pill" aria-hidden="true">
          {desks.map((d, i) => <i key={d.name} className={i === beat ? 'on' : undefined} style={{ ['--c' as string]: d.color }} />)}
        </div>
        <p className="pp-switch-name" aria-live="polite"><b style={{ color: desks[beat].color }}>{desks[beat].name}</b></p>
      </div>
    </Stage>
  );
}
