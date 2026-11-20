import type { Metadata } from 'next';
import NotFoundBody from './_404/NotFoundBody';
import { NOT_FOUND } from './_404/_copy';

/* The global 404 gets no URL params, so its <title> stays English. */
export const metadata: Metadata = {
  title: NOT_FOUND.en!.meta.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main>
      <section className="ct-wrap nf-wrap">
        <div className="ct-aura"></div>
        <div className="nf-bloom" aria-hidden="true"></div>

        {/* every language is rendered; CSS shows the one matching <html lang> */}
        <NotFoundBody />
      </section>

      <style>{`
        /* ── 404 (scoped nf-*) ── */

        /* Soft ember bloom centerpiece: the one page where the warm accent leads */
        .nf-wrap > .nf-bloom { position: absolute; z-index: 0; }
        .nf-bloom {
          top: 50%; left: 50%; width: min(880px, 120vw); height: min(880px, 120vw);
          transform: translate(-50%, -50%); pointer-events: none;
          background:
            radial-gradient(38% 38% at 50% 50%, rgba(var(--sa-ember, 255,106,61), 0.075), transparent 70%),
            radial-gradient(60% 60% at 50% 50%, rgba(150,164,255,0.05), transparent 72%);
        }

        /* Ember kicker: recolor the kicker and its ticks */
        html.sensory-active .ct-kicker.nf-kick { color: rgba(var(--sa-ember, 255,106,61), 0.85); }
        html.sensory-active .ct-kicker.nf-kick::before,
        html.sensory-active .ct-kicker.nf-kick::after {
          background: linear-gradient(90deg, transparent, rgba(var(--sa-ember, 255,106,61), 0.8));
        }

        /* Huge dim numeral with an ember edge */
        .nf-code {
          font-family: 'oswaldbold', sans-serif;
          font-size: clamp(6.4rem, 24vw, 15rem); line-height: 1;
          letter-spacing: 0.16em; text-indent: 0.16em;
          margin: 0.6rem 0 0;
          color: rgba(255,236,228,0.04);
          -webkit-text-stroke: 1px rgba(var(--sa-ember, 255,106,61), 0.42);
        }

        .nf-sub { margin-top: 1.5rem; max-width: 520px; }

        .nf-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 2.4rem; position: relative; z-index: 1; }
      `}</style>
    </main>
  );
}
