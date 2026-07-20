'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

/* SpicyGate — dramatises BeadReader's per-reader "spicy" content gate. The
   spicy passage sits on its OWN line between two clean sentences, so revealing
   it never rearranges the surrounding text. Full access blurs the line and
   animates it clear on tap; No access shows a locked block; Cal mode drops the
   line entirely. Auto-cycles, pauses off-screen, never reflows the page. */

const LEAD = 'They had circled each other all evening. When the last guest finally left, the room went quiet.';
const SPICY = 'What happened next stayed between them and the low light of the fire.';
const TRAIL = 'Morning came far too soon.';

type ModeKey = 'full' | 'none' | 'cal';
type Mode = { key: ModeKey; label: string; caption: string };
const MODES: Mode[] = [
  { key: 'full', label: 'Full access', caption: 'Tap the blurred line and it clears. The reader has access.' },
  { key: 'none', label: 'No access', caption: 'Locked. The passage never renders for this reader.' },
  { key: 'cal', label: 'Cal mode', caption: 'The line is dropped entirely, no gap and no marker.' },
];

const LONGEST_CAPTION = MODES.reduce((a, b) => (b.caption.length > a.length ? b.caption : a), '');

export default function SpicyGate() {
  const [modeIdx, setModeIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    const t = setInterval(() => setModeIdx((p) => (p + 1) % MODES.length), 3600);
    return () => clearInterval(t);
  }, [auto, inView, reduced]);

  // Switching modes always resets the reveal state, so Full access re-blurs.
  useEffect(() => { setRevealed(false); }, [modeIdx]);

  const selectMode = (idx: number) => {
    setAuto(false);
    setModeIdx(idx);
  };

  const mode = MODES[modeIdx];
  const showRevealed = revealed || reduced;

  const fade = {
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.28 },
  } as const;

  return (
    <LazyMotion features={domAnimation}>
      <div ref={rootRef} className="sg" data-no-zoom>
        <div className="sg-panel">
          <span className="sg-eyebrow">Chapter 9</span>
          <div className="sg-page">
            <div className="sg-story">
              <p className="sg-para">{LEAD}</p>
              <div className="sg-spicy-line">
                <AnimatePresence mode="wait" initial={false}>
                  {mode.key === 'full' && (
                    <m.div key="full" className="sg-spicy-wrap" {...fade}>
                      <button
                        type="button"
                        className={`sg-reveal${showRevealed ? ' is-revealed' : ''}`}
                        onClick={() => setRevealed(true)}
                        disabled={showRevealed}
                        aria-label={showRevealed ? 'Spicy passage revealed' : 'Tap to reveal the spicy passage'}
                      >
                        <span className="sg-spicy-text">{SPICY}</span>
                        <span className="sg-reveal-tag"><span aria-hidden="true">🌶</span> tap to reveal</span>
                      </button>
                    </m.div>
                  )}
                  {mode.key === 'none' && (
                    <m.div key="none" className="sg-spicy-wrap" {...fade}>
                      <span className="sg-lock-block"><span aria-hidden="true">🔒</span> Spicy passage, access on request</span>
                    </m.div>
                  )}
                  {mode.key === 'cal' && (
                    <m.div key="cal" className="sg-spicy-wrap sg-cal" {...fade} />
                  )}
                </AnimatePresence>
              </div>
              <p className="sg-para">{TRAIL}</p>
            </div>
          </div>
        </div>

        <div className="sg-side">
          <div className="sg-tabs" role="tablist" aria-label="Reader mode">
            {MODES.map((m2, n) => (
              <button
                key={m2.key}
                className={`sg-tab${n === modeIdx ? ' is-active' : ''}`}
                onClick={() => selectMode(n)}
                role="tab"
                aria-selected={n === modeIdx}
                aria-label={m2.label}
              >
                {m2.label}
              </button>
            ))}
          </div>
          <div className="sg-cap-wrap">
            <p className="sg-cap sg-cap-sizer" aria-hidden="true">{LONGEST_CAPTION}</p>
            <p className="sg-cap">{mode.caption}</p>
          </div>
          <span className="sg-footnote">Enforced in the SQL query, gated text never leaves the server.</span>
        </div>

        <style>{`
          .sg {
            --sg-spicy: #e0663d;
            display: grid; grid-template-columns: 1.3fr 0.85fr; gap: clamp(18px, 3vw, 34px);
            align-items: center; margin: 1.5rem 0 0.6rem;
            padding: clamp(18px, 3vw, 30px); border-radius: 22px;
            background: linear-gradient(160deg, rgba(30,22,14,0.82), rgba(18,14,9,0.9));
            border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
            position: relative; overflow: hidden;
          }
          .sg-panel {
            background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; padding: 18px 18px 16px;
          }
          .sg-eyebrow {
            font-family: 'inter'; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.2em;
            text-transform: uppercase; color: rgba(232,220,200,0.55); display: block; margin-bottom: 12px;
          }
          /* Fixed reserve for the whole passage block, so cycling modes never reflows the page. */
          .sg-page { min-height: 190px; display: flex; align-items: center; }
          .sg-story { width: 100%; }
          .sg-para {
            font-family: 'dmsans'; font-size: 0.98rem; line-height: 1.7; color: rgba(240,232,220,0.86); margin: 0;
          }
          /* The spicy passage is its OWN line between the two paragraphs. */
          .sg-spicy-line { margin: 0.55rem 0; }
          .sg-spicy-wrap { min-height: 1.75em; display: flex; align-items: center; }
          .sg-spicy-wrap.sg-cal { min-height: 0; }
          .sg-reveal {
            display: inline-flex; align-items: center; gap: 11px; flex-wrap: wrap;
            border: 0; background: none; padding: 0; margin: 0; cursor: pointer; text-align: left; font: inherit; color: inherit;
          }
          .sg-reveal[disabled] { cursor: default; }
          /* Same text element both states: revealing only animates the blur away, so nothing moves. */
          .sg-spicy-text {
            font-family: 'dmsans'; font-size: 0.98rem; line-height: 1.7;
            filter: blur(6px); color: rgba(240,232,220,0.5); user-select: none;
            transition: filter 0.6s ease, color 0.6s ease;
          }
          .sg-reveal.is-revealed .sg-spicy-text { filter: blur(0); color: var(--sg-spicy); user-select: text; }
          .sg-reveal-tag {
            display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
            font-family: 'inter'; font-weight: 700; font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase;
            color: var(--sg-spicy); background: rgba(224,102,61,0.14); border: 1px solid rgba(224,102,61,0.35);
            padding: 3px 9px; border-radius: 999px; transition: opacity 0.45s ease;
          }
          .sg-reveal.is-revealed .sg-reveal-tag { opacity: 0; }
          .sg-reveal:focus-visible { outline: 2px solid rgb(var(--sa-accent)); outline-offset: 4px; border-radius: 6px; }
          .sg-lock-block {
            display: inline-flex; align-items: center; gap: 7px;
            font-family: 'inter'; font-weight: 600; font-size: 0.8rem; color: rgba(240,232,220,0.55);
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
            padding: 5px 12px; border-radius: 8px;
          }
          .sg-side { display: flex; flex-direction: column; gap: 16px; }
          .sg-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
          .sg-tab {
            font-family: 'inter'; font-weight: 700; font-size: 0.72rem; letter-spacing: 0.02em;
            color: rgba(232,220,200,0.62); cursor: pointer; padding: 8px 13px; border-radius: 999px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            transition: color 0.22s ease, background 0.22s ease, border-color 0.22s ease, transform 0.18s ease;
          }
          .sg-tab:hover { transform: translateY(-1px); border-color: rgba(var(--sa-accent), 0.5); color: #f2ece2; }
          .sg-tab:active { transform: translateY(0); }
          .sg-tab:focus-visible { outline: 2px solid rgb(var(--sa-accent)); outline-offset: 2px; }
          .sg-tab.is-active { color: #1a1208; background: rgb(var(--sa-accent)); border-color: rgb(var(--sa-accent)); }
          .sg-cap-wrap { display: grid; }
          .sg-cap-wrap > .sg-cap { grid-area: 1 / 1; }
          .sg-cap-sizer { visibility: hidden; pointer-events: none; }
          .sg-cap { font-family: 'dmsans'; font-size: 0.94rem; line-height: 1.6; color: rgba(240,232,220,0.78); margin: 0; max-width: 32ch; }
          .sg-footnote {
            font-family: 'dmsans'; font-size: 0.76rem; line-height: 1.5; color: rgba(232,220,200,0.45); max-width: 32ch;
          }
          @media (max-width: 720px) {
            .sg { grid-template-columns: 1fr; gap: 20px; }
          }
          @media (max-width: 420px) {
            .sg-page { min-height: 226px; }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
