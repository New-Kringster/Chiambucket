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
import { Tab } from './Parts';

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

/* ── The hero and Meet Pip, one pinned stage (q = its progress, 0..1) ──
   q 0 to 0.42      the Tab5 turns to face us and its screen fills the view; the body fades (tab5Scene)
   q 0.40 to 0.475  Mopi's home picture fades, so only Pip is left on the black
   q 0.43 to 0.56   that same Pip flies into the Meet Pip slot (a shared element: one WebGL plane the
                    whole way, so there is no cut and no swap)
   q 0.50 to 1      the Meet Pip opener: the title rises letter by letter round Pip, the line follows,
                    and at the end everything, Pip included, slides off like a desktop switch
   Reduced motion: no pinning; a still of the tablet, then the opener with a still of Pip. */
const ZOOM_END = 0.42;
const smooth = (t: number) => t * t * (3 - 2 * t);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export function HeroMeet({ hero, title, lede, slotLabel }: { hero: ReactNode; title: string; lede: string; slotLabel: string }) {
  const host = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReduced();
  const q = useRef(0);
  const scene = useRef<import('./tab5Scene').Tab5Scene | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let alive = true, raf = 0, visible = true;
    const video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true;
    video.setAttribute('playsinline', '');
    const canWebm = video.canPlayType('video/webm; codecs="vp9"') !== '';
    if (!reduced) { video.src = '/videos/pip/pip-layer' + (canWebm ? '.webm' : '.mp4'); video.preload = 'auto'; }

    // the handoff, worked out every frame from the stage's progress and where the slot is now
    const handoff = () => {
      const sc = scene.current, sl = slot.current;
      if (!sc || !sl) return;
      const v = q.current;
      sc.setProgress(clamp01(v / ZOOM_END));
      const fade = smooth(span(v, 0.40, 0.475));
      const fly = smooth(span(v, 0.43, 0.56));
      const op = 0.30 + (v - 0.5) * 1.4;
      const exit = span(op, 0.84, 1);
      const hr = el.getBoundingClientRect(), r = sl.getBoundingClientRect();
      // Pip's box in the slot: body half the slot's height, feet 80 % down (the opener clips' framing)
      const bh = (0.5 * r.height) / (415.4 / 720), bw = bh * (800 / 720);
      const feet = r.top - hr.top + 0.8 * r.height;
      const to = { x: r.left - hr.left + r.width / 2 - bw / 2, y: feet - (589.8 / 720) * bh, w: bw, h: bh };
      sc.setHandoff(fade, fly, to, Math.max(0, 1 - exit * 1.1));
    };
    const loop = () => {
      raf = 0;
      if (!alive || !visible) return;
      handoff();
      scene.current?.render();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };
    import('./tab5Scene').then(({ createTab5Scene }) => {
      if (!alive) return;
      try {
        scene.current = createTab5Scene(el, {
          video, glb: '/pip/tab5.glb', wallpaper: '/images/pip/mopi-home.webp', still: reduced ? '/images/pip/mopi-home-still.webp' : undefined,
          onReady: () => {
            if (!alive) return;
            setReady(true);
            // reduced motion: one still frame, the tablet turned a little, Pip on its home screen
            if (reduced) { scene.current?.setProgress(0.12); scene.current?.render(); }
          },
        });
      } catch { return; }
      if (reduced) return;
      handoff();
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
  }, [reduced]);

  let i = 0;
  const n = title.replace(/ /g, '').length;
  return (
    <div className="pp-hm-wrap">
      {/* the desktop dots count Meet Pip from where its opener starts, not from the top of the page */}
      <span id="meet" className="pp-hm-anchor" aria-hidden="true" />
      <Stage className={`pp-hero pp-hm${ready ? ' is-ready' : ''}`} screens={5.6} label="Pip on the M5Stack Tab5, then Meet Pip"
        onProgress={(v) => { q.current = v; }}>
        <div className="pp-hero-gl" ref={host} aria-hidden="true" />
        {hero}
        <div className="pp-op pp-hm-op" style={{ ['--acc' as string]: '#00ffff', ['--n' as string]: n }}>
          <div className="pp-op-in">
            <div className="pp-op-pip pp-hm-slot" ref={slot} role="img" aria-label={slotLabel}>
              {reduced && <img src="/images/pip/mopi-slot.webp" alt="" />}
            </div>
            <h2 className="pp-op-t" aria-label={title}>
              {title.split(' ').map((w, wi) => (
                <span className="pp-op-w" key={wi} aria-hidden="true">
                  {Array.from(w).map((ch) => <span key={i} className="pp-op-l" style={{ ['--i' as string]: i++ }}>{ch}</span>)}
                </span>
              ))}
            </h2>
            <p className="pp-op-lede">{lede}</p>
          </div>
        </div>
      </Stage>
    </div>
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
    // the night scene only shows at the end, behind the recommendations and the footer
    const end = document.querySelector('.pp > .arec-section');
    const eo = new IntersectionObserver(([e]) => html.classList.toggle('pp-end', e.isIntersecting), { rootMargin: '0px 0px 100% 0px' });
    if (end) eo.observe(end);
    return () => { ro.disconnect(); io.disconnect(); eo.disconnect(); html.classList.remove('pp-route', 'pp-end'); html.style.removeProperty('--pp-nav'); };
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


/* ── Touches, shown: a contact disc on a zoomed-in piece of the real screen ──
   Each cell is a real hub frame with the tablet's own touch marks drawn over it at their real sizes
   (main.cpp: a blue #39B2FF dot of radius 13 at once, a 5 px blue trail while dragging; canvas.js: a
   44 px green ring where the click landed). CSS keyframes, transform and opacity only, paused while
   the row is off screen; reduced motion shows each cell's final state. The touch itself is a soft
   contact disc about a fingertip wide (~9 mm on the 110.7 mm panel), pressing in at the touch point. */
const TOUCHES = [
  { k: 'tap', img: '/images/pip/touch-docs.webp', title: 'Taps show.', text: 'A tap lands as a blue dot, then a green ring once the page has reacted.', alt: 'A touch on the round help button of the M5Stack Tab5 page: a blue dot, then a green ring' },
  { k: 'drag', img: '/images/pip/touch-full.webp', title: 'Drags show.', text: 'A drag leaves a blue line behind the finger while the page scrolls.', alt: 'A touch dragging down the M5Stack Tab5 page, leaving a blue line' },
  { k: 'expand', img: '/images/pip/touch-pane.webp', img2: '/images/pip/touch-full.webp', title: 'Any pane expands.', text: 'Tap Expand and the pane grows to the full screen.', alt: 'A touch on Expand on a pane, which grows to the full screen' },
  { k: 'back', img: '/images/pip/touch-pane.webp', img2: '/images/pip/touch-full.webp', title: 'Back is always the same.', text: 'A swipe from left to right goes back, wherever you are.', alt: 'A touch swiping from left to right, sliding the screen back to the one before' },
];

export function Touches() {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-on', e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul className="pp-touch" ref={ref} data-no-zoom>
      {TOUCHES.map((t) => (
        <li key={t.k} className={`pp-tc is-${t.k}`}>
          <div className="pp-tc-scr" role="img" aria-label={t.alt}>
            <div className="pp-tc-world">
              {t.img2 && t.k === 'back' && <img className="pp-tc-under" src={t.img} alt="" loading="lazy" decoding="async" />}
              <img className="pp-tc-page" src={t.k === 'back' ? t.img2 : t.img} alt="" loading="lazy" decoding="async" />
              {t.k === 'expand' && <img className="pp-tc-grow" src={t.img2} alt="" loading="lazy" decoding="async" />}
              {t.k === 'drag' && <i className="pp-tc-trail" />}
              {(t.k === 'tap' || t.k === 'expand') && <><i className="pp-tc-dot" /><i className="pp-tc-ring" /></>}
            </div>
            <div className="pp-tc-hand"><span className="pp-tc-finger"><i className="pp-tc-fm" /></span></div>
          </div>
          <p><b>{t.title}</b> {t.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ── A new Pip, step by step: one Tab5 screen that walks through the steps ──
   Each step is a real still or clip from the tablet. It advances on its own while on screen (a clip
   step waits for its clip's length), and the dots or a tap on the screen step it by hand, which
   pauses the auto-advance. Reduced motion: no auto-advance, the dots still work. */
export type HatchStep = { src: string; alt: string; caption: string; clip?: { src: string; poster: string; ms: number } };
export function HatchSlides({ steps }: { steps: HatchStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useReduced();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on || held || reduced) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % steps.length), steps[i].clip?.ms ?? 3600);
    return () => window.clearTimeout(t);
  }, [i, on, held, reduced, steps]);
  const go = (n: number) => { setHeld(true); setI(n); };
  return (
    <div className="pp-slides" ref={ref}>
      <Tab>
        <button type="button" className="pp-slides-scr" onClick={() => go((i + 1) % steps.length)} aria-label="Next step">
          {steps.map((s, n) => (
            <span key={s.src} className={`pp-slides-step${n === i ? ' on' : ''}`} aria-hidden={n !== i}>
              {s.clip
                ? <Clip src={s.clip.src} poster={s.clip.poster} className="pp-screen" label={s.alt} active={n === i && on} />
                : <img className="pp-screen" src={s.src} alt={s.alt} loading="lazy" decoding="async" />}
            </span>
          ))}
        </button>
      </Tab>
      <div className="pp-slides-foot">
        <div className="pp-slides-dots" role="tablist" aria-label="Steps">
          {steps.map((s, n) => (
            <button key={s.src} type="button" role="tab" aria-selected={n === i} aria-label={s.caption} className={n === i ? 'on' : ''} onClick={() => go(n)} />
          ))}
        </div>
        <p className="pp-slides-cap" aria-live="polite">
          {steps.map((s, n) => <span key={s.src} className={n === i ? 'on' : ''}>{s.caption}</span>)}
        </p>
      </div>
    </div>
  );
}

/* ── The Pips: a row of bodies; pick one to read the card it wrote about itself ── */
export type PipCard = { name: string; color: string; look: string; vibe: string; says: string; img: string };
export function PipPicker({ pips }: { pips: PipCard[] }) {
  const [i, setI] = useState(0);
  const p = pips[i];
  return (
    <div className="pp-picker" style={{ ['--c' as string]: p.color } as CSSProperties}>
      <div className="pp-picker-row" role="tablist" aria-label="Pips">
        {pips.map((q, n) => (
          <button key={q.name} type="button" role="tab" aria-selected={n === i} className={n === i ? 'on' : ''}
            style={{ ['--c' as string]: q.color } as CSSProperties}
            onClick={() => setI(n)} onMouseEnter={() => setI(n)} onFocus={() => setI(n)}>
            <img src={q.img} alt={`${q.name}, ${q.look}`} loading="lazy" decoding="async" />
            <span>{q.name}</span>
          </button>
        ))}
      </div>
      {/* every card is stacked in one cell, so the block keeps the tallest card's height */}
      <div className="pp-picker-card" role="tabpanel" aria-live="polite">
        {pips.map((q, n) => (
          <div key={q.name} className={n === i ? 'on' : ''} aria-hidden={n !== i}>
            <b style={{ color: q.color }}>{q.name}</b>
            <em>{q.look}</em>
            <p>{q.vibe}</p>
            <q>{q.says}</q>
          </div>
        ))}
      </div>
    </div>
  );
}
