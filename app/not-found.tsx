import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="ct-wrap nf-wrap">
        <div className="ct-aura"></div>
        <div className="nf-bloom" aria-hidden="true"></div>

        <div className="sa-hud" aria-hidden="true">
          <div className="sa-hud-tl">
            <span>ERR · 404 // NO_CARRIER</span>
            <span>CHANNEL · UNKNOWN</span>
          </div>
          <div className="sa-hud-tr">
            <span>TRACE · TERMINATED</span>
            <span>RETRY · MANUAL</span>
          </div>
          <div className="sa-hud-bl">
            <span>[ RETURN ]</span>
            <span>[ INDEX ]</span>
          </div>
          <div className="sa-hud-br">
            <span className="sa-live"><span className="sa-live-dot"></span>SIGNAL · LOST</span>
            <span>SCAN · 0 RESULTS</span>
          </div>
        </div>

        <span className="ct-kicker nf-kick">Signal lost · channel not found</span>
        <h1 className="nf-code">404</h1>
        <p className="nf-sub">
          The address you followed returns no carrier.<br />
          It may have moved, or it never existed.
        </p>
        <Link href="/" className="hp-btn nf-btn">[ RETURN TO INDEX ]</Link>
      </section>

      <style>{`
        /* ── 404 / SIGNAL LOST (scoped nf-*) ── */

        /* Soft ember bloom centerpiece: the one page where the warm accent leads */
        .nf-wrap > .nf-bloom { position: absolute; z-index: 0; }
        .nf-bloom {
          top: 50%; left: 50%; width: min(880px, 120vw); height: min(880px, 120vw);
          transform: translate(-50%, -50%); pointer-events: none;
          background:
            radial-gradient(38% 38% at 50% 50%, rgba(var(--sa-ember, 255,106,61), 0.075), transparent 70%),
            radial-gradient(60% 60% at 50% 50%, rgba(150,164,255,0.05), transparent 72%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .nf-bloom { animation: nf-breathe 8s ease-in-out infinite; }
        }
        @keyframes nf-breathe { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }

        /* Ember kicker: recolor the mono kicker + its signal ticks */
        html.sensory-active .ct-kicker.nf-kick { color: rgba(var(--sa-ember, 255,106,61), 0.85); }
        html.sensory-active .ct-kicker.nf-kick::before,
        html.sensory-active .ct-kicker.nf-kick::after {
          background: linear-gradient(90deg, transparent, rgba(var(--sa-ember, 255,106,61), 0.8));
        }

        /* Huge dim numeral with a luminous ember edge */
        .nf-code {
          font-family: 'oswaldbold', sans-serif;
          font-size: clamp(6.4rem, 24vw, 15rem); line-height: 1;
          letter-spacing: 0.16em; text-indent: 0.16em;
          margin: 0.6rem 0 0;
          color: rgba(255,236,228,0.04);
          -webkit-text-stroke: 1px rgba(var(--sa-ember, 255,106,61), 0.42);
          text-shadow: 0 0 110px rgba(var(--sa-ember, 255,106,61), 0.1);
        }

        /* Mono sub line */
        .nf-sub {
          margin-top: 1.5rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.66rem; letter-spacing: 0.2em; text-indent: 0.2em; line-height: 2.1;
          text-transform: uppercase; color: rgba(212,220,244,0.55);
          max-width: 620px;
        }

        /* Ghost terminal return */
        html.sensory-active .hp-btn.nf-btn {
          margin-top: 2.6rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.7rem; letter-spacing: 0.2em; text-indent: 0.1em; text-transform: uppercase;
        }

        /* HUD live dot spacing on this page */
        .nf-wrap .sa-live-dot { margin-right: 8px; }

        @media (max-width: 1100px) {
          html.sensory-active .nf-wrap .sa-hud-bl,
          html.sensory-active .nf-wrap .sa-hud-br { display: none; }
        }
      `}</style>
    </main>
  );
}
