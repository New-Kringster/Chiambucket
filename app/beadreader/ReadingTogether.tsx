'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

/* ReadingTogether — dramatises BeadReader's "reading together" presence: an
   Online-now panel where a friend in the same book gets a green ring + chapter
   badge, and a tap sends a wave or a short note that pops on their row and
   fades. Auto-cycles, pauses off-screen, never reflows the page. */

type Reader = { key: string; name: string; initial: string };
const READERS: Reader[] = [
  { key: 'mara', name: 'Mara', initial: 'M' },
  { key: 'jae', name: 'Jae', initial: 'J' },
  { key: 'sam', name: 'Sam', initial: 'S' },
];

type Bubble = { row: number; kind: 'wave' | 'note'; text?: string } | null;

type Beat = { caption: string; bubble: Bubble; samInBook: boolean };
const BEATS: Beat[] = [
  { caption: 'Mara is on chapter 12, right here in the same book as you.', bubble: null, samInBook: false },
  { caption: 'Tap a reader to send a wave. It lands on their screen, then fades.', bubble: { row: 0, kind: 'wave' }, samInBook: false },
  { caption: 'Or a short note, gone in a few seconds. Nothing is saved.', bubble: { row: 1, kind: 'note', text: 'loved that twist!' }, samInBook: false },
  { caption: 'Sam just opened the same book. Three of you, reading together.', bubble: null, samInBook: true },
];

const LONGEST_CAPTION = BEATS.reduce((a, b) => (b.caption.length > a.length ? b.caption : a), '');
const WaveIcon = () => <span aria-hidden="true">👋</span>;
const NoteIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
);

export default function ReadingTogether() {
  const [beat, setBeat] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [manual, setManual] = useState<(Bubble & { id: number }) | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // Only run while on screen, so it never animates (or reflows) out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const t = setInterval(() => setBeat((p) => (p + 1) % BEATS.length), 3400);
    return () => clearInterval(t);
  }, [auto, inView, reduced]);

  // A manual wave/note pops on the reader's row and clears itself after ~2.6s.
  const send = useCallback((row: number, kind: 'wave' | 'note') => {
    setAuto(false);
    const id = row * 2 + (kind === 'note' ? 1 : 0) + beat * 10;
    setManual({ row, kind, text: kind === 'note' ? 'reading this now!' : undefined, id });
    if (clearRef.current) clearTimeout(clearRef.current);
    clearRef.current = setTimeout(() => setManual(null), 2600);
  }, [beat]);

  useEffect(() => () => { if (clearRef.current) clearTimeout(clearRef.current); }, []);

  const current = BEATS[beat];
  const bubble: Bubble = manual ?? current.bubble;
  const samInBook = current.samInBook;

  const status = useMemo(() => [
    'Reading here · ch 12',
    'The Hobbit · ch 3',
    samInBook ? 'Reading here · ch 1' : 'Browsing',
  ], [samInBook]);
  const sameBook = [true, false, samInBook];
  const badge = ['12', '', '1'];

  return (
    <LazyMotion features={domAnimation}>
      <div ref={rootRef} className="rt" data-no-zoom>
        <div className="rt-panel">
          <span className="rt-eyebrow">Online now</span>
          <div className="rt-rows">
            {READERS.map((r, idx) => (
              <div className={`rt-row${sameBook[idx] ? ' same' : ''}`} key={r.key}>
                <div className="rt-av-wrap">
                  <div className="rt-av">{r.initial}</div>
                  {sameBook[idx]
                    ? <span className="rt-badge">{badge[idx]}</span>
                    : <span className="rt-dot" />}
                </div>
                <div className="rt-meta">
                  <span className="rt-name">{r.name}{sameBook[idx] && <span className="rt-here">reading here</span>}</span>
                  <span className="rt-status">{status[idx]}</span>
                </div>
                <div className="rt-actions">
                  <button className="rt-act" onClick={() => send(idx, 'wave')} aria-label={`Wave at ${r.name}`}><WaveIcon /></button>
                  <button className="rt-act" onClick={() => send(idx, 'note')} aria-label={`Send ${r.name} a note`}><NoteIcon /></button>
                </div>
                <div className="rt-bubble-slot" aria-live="polite">
                  <AnimatePresence>
                    {bubble && bubble.row === idx && (
                      <m.span
                        key={(manual?.id ?? beat) + '-' + bubble.kind}
                        className={`rt-bubble ${bubble.kind}`}
                        initial={reduced ? false : { opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {bubble.kind === 'wave' ? '👋' : bubble.text}
                      </m.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rt-side">
          <div className="rt-cap-wrap">
            <p className="rt-cap rt-cap-sizer" aria-hidden="true">{LONGEST_CAPTION}</p>
            <p className="rt-cap">{current.caption}</p>
          </div>
          <div className="rt-dots" role="tablist" aria-label="Presence beats">
            {BEATS.map((b, n) => (
              <button
                key={n}
                className={`rt-dot-btn${n === beat ? ' is-active' : ''}`}
                onClick={() => { setAuto(false); setManual(null); setBeat(n); }}
                role="tab"
                aria-selected={n === beat}
                aria-label={`Beat ${n + 1}`}
              />
            ))}
          </div>
          <span className="rt-legend"><span className="rt-legend-dot" /> green ring = same book as you</span>
        </div>

        <style>{`
          .rt {
            --rt-green: #22c55e;
            display: grid; grid-template-columns: 1.25fr 0.9fr; gap: clamp(18px, 3vw, 34px);
            align-items: center; margin: 1.5rem 0 0.6rem;
            padding: clamp(18px, 3vw, 30px); border-radius: 22px;
            background: linear-gradient(160deg, rgba(30,22,14,0.82), rgba(18,14,9,0.9));
            border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            position: relative; overflow: hidden;
          }
          .rt-panel {
            background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; padding: 16px 16px 12px;
          }
          .rt-eyebrow {
            font-family: 'inter'; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.2em;
            text-transform: uppercase; color: rgba(232,220,200,0.55); display: block; margin-bottom: 12px;
          }
          .rt-rows { display: flex; flex-direction: column; }
          .rt-row {
            display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px;
            min-height: 60px; padding: 8px 0; position: relative;
            border-top: 1px solid rgba(255,255,255,0.055);
          }
          .rt-row:first-child { border-top: 0; }
          .rt-av-wrap { position: relative; width: 42px; height: 42px; flex-shrink: 0; }
          .rt-av {
            width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
            font-family: 'oswaldbold'; font-size: 1rem; color: #efe4d4;
            background: radial-gradient(circle at 35% 30%, #6b4a2f, #402c1b);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); transition: box-shadow 0.4s ease;
          }
          .rt-row.same .rt-av { box-shadow: 0 0 0 2px var(--rt-green), 0 0 0 4px rgba(34,197,94,0.22); }
          .rt-dot {
            position: absolute; right: -1px; bottom: -1px; width: 12px; height: 12px; border-radius: 50%;
            background: var(--rt-green); border: 2.5px solid #17110b;
          }
          .rt-badge {
            position: absolute; right: -4px; bottom: -4px; min-width: 19px; height: 19px; padding: 0 4px;
            border-radius: 999px; background: var(--rt-green); color: #06210f; border: 2.5px solid #17110b;
            font-family: 'inter'; font-weight: 800; font-size: 0.62rem; display: grid; place-items: center;
          }
          .rt-meta { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
          .rt-name {
            font-family: 'dmsans'; font-weight: 700; font-size: 0.98rem; color: #f2ece2;
            display: flex; align-items: center; gap: 8px;
          }
          .rt-here {
            font-family: 'inter'; font-weight: 700; font-size: 0.56rem; letter-spacing: 0.08em;
            text-transform: uppercase; color: var(--rt-green);
            background: rgba(34,197,94,0.14); padding: 3px 7px; border-radius: 999px;
          }
          .rt-status {
            font-family: 'dmsans'; font-size: 0.82rem; color: rgba(232,220,200,0.55);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          .rt-actions { display: flex; gap: 6px; }
          .rt-act {
            width: 34px; height: 34px; border-radius: 10px; cursor: pointer; padding: 0;
            display: grid; place-items: center; font-size: 0.95rem; color: #d8c9b4;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.18s ease, border-color 0.22s ease, background 0.22s ease;
          }
          .rt-act:hover { transform: translateY(-1px); border-color: rgba(var(--sa-accent), 0.6); background: rgba(var(--sa-accent), 0.12); }
          .rt-act:active { transform: translateY(0); }
          .rt-act:focus-visible { outline: 2px solid rgb(var(--sa-accent)); outline-offset: 2px; }
          /* Bubble overlays the row (absolute), so it never changes the widget height. */
          .rt-bubble-slot { position: absolute; right: 84px; top: 50%; transform: translateY(-50%); pointer-events: none; }
          .rt-bubble {
            display: inline-block; white-space: nowrap; font-family: 'dmsans'; font-weight: 600;
            font-size: 0.82rem; color: #10250f; background: var(--rt-green);
            padding: 6px 11px; border-radius: 12px 12px 3px 12px;
            box-shadow: 0 10px 24px -10px rgba(0,0,0,0.7);
          }
          .rt-bubble.wave { font-size: 1.05rem; padding: 4px 10px; }
          .rt-side { display: flex; flex-direction: column; gap: 16px; }
          .rt-cap-wrap { display: grid; }
          .rt-cap-wrap > .rt-cap { grid-area: 1 / 1; }
          .rt-cap-sizer { visibility: hidden; pointer-events: none; }
          .rt-cap { font-family: 'dmsans'; font-size: 1rem; line-height: 1.6; color: rgba(240,232,220,0.82); margin: 0; max-width: 30ch; }
          .rt-dots { display: flex; gap: 8px; }
          .rt-dot-btn {
            width: 26px; height: 6px; border-radius: 999px; border: 0; cursor: pointer; padding: 0;
            background: rgba(255,255,255,0.16); transition: background 0.3s ease, width 0.3s ease;
          }
          .rt-dot-btn:hover { background: rgba(255,255,255,0.32); }
          .rt-dot-btn.is-active { width: 38px; background: rgb(var(--sa-accent)); }
          .rt-dot-btn:focus-visible { outline: 2px solid rgb(var(--sa-accent)); outline-offset: 3px; }
          .rt-legend {
            display: inline-flex; align-items: center; gap: 8px; font-family: 'dmsans';
            font-size: 0.78rem; color: rgba(232,220,200,0.5);
          }
          .rt-legend-dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 0 2px var(--rt-green), 0 0 0 4px rgba(34,197,94,0.22); }
          @media (max-width: 720px) {
            .rt { grid-template-columns: 1fr; gap: 20px; }
            .rt-bubble-slot { right: 84px; }
          }
          @media (max-width: 420px) {
            .rt-bubble-slot { right: 78px; }
            .rt-here { display: none; }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
