'use client';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { Lang } from '@/lib/i18n';
import { useLang } from '@/lib/useLang';
import { fill } from '@/lib/fill';
import { COVERS, type PeekLang } from './peeks/kit';

/*
  ProjectPeek — the shared "peek" reader used by the homepage project gallery
  AND the end-of-article recommendations. Opening any project's peek renders a
  vertical feed: the chosen project first, then every other project in
  gallery order (wrapping once), each shown as the FULL readable reader
  (hero, video, chapters, CTA). Each next project peeks up, blurred, under
  the last one and is pulled open (PullNext). Heavy media lazy-mounts as each
  item nears the viewport, so opening stays fast.

  Callers keep their own .hp-modal shell + open/close state; they just render
  <PeekFeed startId={...} exclude={...} /> inside .hp-modal-content (keyed by
  startId so the feed resets to the top on each open).

  The words live in components/peeks/<lang>.tsx (each project's write-up,
  TITLES and the fixed LABELS, built with components/peeks/kit.tsx). PeekFeed
  loads only the visitor's language; a language without a file yet reads in
  English.
*/

/* Project order = the homepage gallery order (also the ALL_PROJECTS order). */
export const PEEK_ORDER: string[] = [
  'proj-waterslop', 'proj-june', 'proj-pip', 'proj-lidar', 'proj-beadreader', 'proj-pantry', 'proj-ruler', 'proj-cadmouse', 'proj-lora', 'proj-lumen', 'proj-ema', 'proj-pandus', 'proj-elecf',
  'proj-kauli', 'proj-sol', 'proj-copyboard', 'proj-webdev', 'proj-mc',
];

/* One feed slot: mounts its reader only when it nears the viewport. */
function PeekItem({ id, first, index, copy }: { id: string; first: boolean; index: number; copy: PeekLang }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(first);

  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { root: null, rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  const name = copy.TITLES[id] ?? fill(copy.LABELS.untitled, { n: index + 1 });

  // Each project is its own card, with a labelled gap before the next one,
  // so the feed reads as separate write-ups rather than one long page.
  return (
    <>
      {!first && (
        <div className="hp-rd-feed-sep" aria-hidden="true">
          <span>{fill(copy.LABELS.next, { title: name })}</span>
        </div>
      )}
      <article className="hp-rd-feed-item" ref={ref} aria-label={name}>
        {seen ? <copy.PeekBody id={id} /> : <div className="hp-rd-feed-skel" />}
      </article>
    </>
  );
}

// How far (px) the next project has to be pulled up before it pops open.
const PULL_POP = 130;
// A scroll that arrives at the end may only lift the next project this far
// (as a share of PULL_POP) before it springs back: the end resists first.
const ARRIVAL_LIFT = 0.28;
// Wheel events closer together than this (ms) belong to one gesture,
// including the momentum a trackpad or a flicked wheel keeps sending.
const GESTURE_GAP = 220;
// How long (ms) after the last wheel event a part-pulled card springs back.
// Longer than GESTURE_GAP, so slow single clicks of a wheel still add up.
const PULL_IDLE = 360;

/*
  PullNext — the next project peeks up, blurred, at the end of the reader. Keep
  scrolling past the end (wheel, trackpad or a finger) and it rises with some
  resistance and sharpens; let go early and it springs back; pull it past
  PULL_POP and it pops open with a spring. A click or Enter opens it too.
  The scroll that brings the reader to its end cannot open it, however fast:
  that gesture only lifts the card a little and lets it spring back, so the
  end is felt first. Opening takes a fresh scroll or swipe that starts at the
  end. A trackpad keeps sending momentum events for a second or more after
  the fingers lift, so a new swipe often arrives with no pause before it; it
  is told apart by its speed climbing again after the momentum has been
  slowing down.
*/
function PullNext({ id, scroller, onOpen, copy }: { id: string; scroller: () => HTMLElement | null; onOpen: () => void; copy: PeekLang }) {
  const title = copy.TITLES[id];
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const sc = scroller();
    const card = cardRef.current;
    if (!sc || !card) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pull = 0;
    let idle = 0;
    let startY: number | null = null;
    let done = false;
    // the current wheel gesture, whether it started away from the end, and
    // how its speed has been going (for telling a new swipe from momentum)
    let lastWheel = 0;
    let arrival = false;
    let prevSpeed = 0;
    let slowing = 0;
    // the same for a finger
    let touchArrival = false;

    const atEnd = () => sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4;
    const set = (v: number) => {
      pull = Math.max(0, v);
      const t = Math.min(1, pull / PULL_POP);
      card.style.setProperty('--pull', t.toFixed(3));
      card.classList.toggle('is-held', pull > 0);
    };
    const release = () => {
      if (done) return;
      card.classList.remove('is-held');
      set(0);
    };
    const pop = () => {
      if (done) return;
      done = true;
      card.classList.remove('is-held');
      card.style.setProperty('--pull', '1');
      setPopping(true);
      window.setTimeout(onOpen, calm ? 0 : 420);
    };
    // Each extra pixel takes a little more effort than the last.
    const resist = (raw: number) => PULL_POP * 1.4 * (1 - Math.exp(-raw / (PULL_POP * 1.4)));
    // and back: the effort that lifts the card to a given height
    const effort = (px: number) => -PULL_POP * 1.4 * Math.log(1 - Math.min(px, PULL_POP * 1.39) / (PULL_POP * 1.4));

    let raw = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const speed = Math.abs(e.deltaY);
      if (now - lastWheel > GESTURE_GAP) {
        // a new gesture: it arrives if it starts away from the end, and pulls
        // on from wherever the card is now
        arrival = !atEnd();
        slowing = 0;
        raw = effort(pull);
      } else {
        // a new swipe inside the momentum: after a few events that kept
        // slowing down, the speed jumps up again. Like any new gesture it
        // only pulls if it starts at the end.
        const push = arrival && slowing >= 3 && speed >= Math.max(6, prevSpeed * 1.5);
        slowing = speed <= prevSpeed * 1.05 + 1 ? slowing + 1 : 0;
        if (push) { arrival = !atEnd(); slowing = 0; raw = effort(pull); }
      }
      prevSpeed = speed;
      lastWheel = now;
      if (done || e.deltaY <= 0 || !atEnd()) { if (e.deltaY < 0 && raw > 0) { raw = 0; release(); } return; }
      raw += Math.min(e.deltaY, 120) * 0.7;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => { raw = 0; release(); }, PULL_IDLE);
      if (arrival) {
        raw = Math.min(raw, effort(PULL_POP * ARRIVAL_LIFT));
        set(resist(raw));
        return;
      }
      set(resist(raw));
      if (pull >= PULL_POP) pop();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchArrival = !atEnd();
      startY = touchArrival ? null : e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (done) return;
      if (startY === null) { if (atEnd()) startY = e.touches[0].clientY; return; }
      const lift = resist(Math.max(0, startY - e.touches[0].clientY));
      set(touchArrival ? Math.min(lift, PULL_POP * ARRIVAL_LIFT) : lift);
    };
    const onTouchEnd = () => {
      if (startY === null || done) return;
      startY = null;
      if (!touchArrival && pull >= PULL_POP * 0.8) pop(); else release();
    };
    sc.addEventListener('wheel', onWheel, { passive: true });
    sc.addEventListener('touchstart', onTouchStart, { passive: true });
    sc.addEventListener('touchmove', onTouchMove, { passive: true });
    sc.addEventListener('touchend', onTouchEnd);
    sc.addEventListener('touchcancel', onTouchEnd);
    return () => {
      window.clearTimeout(idle);
      sc.removeEventListener('wheel', onWheel);
      sc.removeEventListener('touchstart', onTouchStart);
      sc.removeEventListener('touchmove', onTouchMove);
      sc.removeEventListener('touchend', onTouchEnd);
      sc.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [scroller, onOpen]);

  return (
    <div className={`hp-rd-pull${popping ? ' is-popping' : ''}`}>
      <span className="hp-rd-pull-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        {fill(copy.LABELS.pullHint, { title })}
      </span>
      <button ref={cardRef} type="button" className="hp-rd-pull-card" onClick={() => {
        const card = cardRef.current;
        if (!card || popping) return;
        card.style.setProperty('--pull', '1');
        setPopping(true);
        window.setTimeout(onOpen, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420);
      }} aria-label={fill(copy.LABELS.pullAria, { title })}>
        <img src={COVERS[id]} alt="" loading="lazy" />
        <span className="hp-rd-pull-title">{title}</span>
      </button>
    </div>
  );
}

/*
  PeekFeed — the clicked project first. Under it the next project peeks up;
  pull it open (PullNext) and it joins the feed, with the one after it
  peeking up in turn, until every project has been shown (wrapping once from
  the clicked one). `exclude` drops one project (the current article on the
  recommendations rail). Key this by startId so it resets on each open.
*/
function Feed({ startId, exclude, copy }: FeedProps & { copy: PeekLang }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(1);

  const base = PEEK_ORDER.filter((id) => id !== exclude);
  const start = Math.max(0, base.indexOf(startId));
  const order = [...base.slice(start), ...base.slice(0, start)];

  // The feed mounts fresh on each open (keyed by startId); make sure the
  // scroll container starts at the top rather than a leftover position.
  useEffect(() => {
    const sc = rootRef.current?.parentElement;
    if (sc) sc.scrollTop = 0;
  }, []);

  const scroller = useCallback(() => rootRef.current?.parentElement ?? null, []);
  const openNext = useCallback(() => setShown((n) => n + 1), []);

  // When a project opens, bring its start into view.
  const opened = useRef(1);
  useEffect(() => {
    if (shown <= opened.current) return;
    opened.current = shown;
    const items = rootRef.current?.querySelectorAll<HTMLElement>('.hp-rd-feed-item');
    const item = items?.[shown - 1];
    const sc = scroller();
    if (!item || !sc) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    sc.scrollTo({ top: item.offsetTop - 12, behavior });
  }, [shown, scroller]);

  return (
    <div className="hp-rd-feed" ref={rootRef}>
      {order.slice(0, shown).map((id, i) => (
        <PeekItem key={id} id={id} index={i} first={i === 0} copy={copy} />
      ))}
      {shown < order.length
        ? <PullNext key={order[shown]} id={order[shown]} scroller={scroller} onOpen={openNext} copy={copy} />
        : <div className="hp-rd-feed-end" aria-hidden="true"><span>{copy.LABELS.end}</span></div>}
    </div>
  );
}

type FeedProps = { startId: string; exclude?: string };
/* A feed bound to one language's module, for next/dynamic. */
const bind = (copy: PeekLang) => function LangFeed(props: FeedProps) { return <Feed {...props} copy={copy} />; };

/* One line per language: only the visitor's language is downloaded. Add a
   translation as e.g. `zh: () => import('./peeks/zh'),`. */
const IMPORTS: Partial<Record<Lang, () => Promise<PeekLang>>> = {
  en: () => import('./peeks/en'),
  es: () => import('./peeks/es'),
  fr: () => import('./peeks/fr'),
  ru: () => import('./peeks/ru'),
  de: () => import('./peeks/de'),
  nl: () => import('./peeks/nl'),
  ja: () => import('./peeks/ja'),
  zh: () => import('./peeks/zh'),
};
const FEEDS: Partial<Record<Lang, ComponentType<FeedProps>>> = Object.fromEntries(
  Object.entries(IMPORTS).map(([l, load]) => [l, dynamic(() => load!().then(bind), { ssr: false })]),
);

/* Fetches a language's peeks ahead of the first open (the homepage calls it once it has settled),
   so the reader isn't empty for a moment while its words download. */
export function preloadPeeks(lang: Lang) {
  (IMPORTS[lang] ?? IMPORTS.en!)().catch(() => {});
}

/* The feed in the page's language, falling back to English. */
export function PeekFeed(props: FeedProps) {
  const LangFeed = FEEDS[useLang()] ?? FEEDS.en!;
  return <LangFeed {...props} />;
}
