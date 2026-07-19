import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coming Soon · Chiambucket',
  description: 'This page is still in development.',
  robots: 'noindex, nofollow',
};

export default function ComingSoonPage() {
  return (
    <main>
      <section className="ct-wrap cw-wrap">
        <div className="ct-aura"></div>
        <div className="cw-bloom" aria-hidden="true"></div>

        <div className="sa-hud" aria-hidden="true">
          <div className="sa-hud-tl">
            <span>CHANNEL // PENDING</span>
            <span>INDEX · NOT_PUBLISHED</span>
          </div>
          <div className="sa-hud-tr">
            <span>CARRIER · DETECTED</span>
            <span>BUFFER · FILLING</span>
          </div>
          <div className="sa-hud-bl">
            <span>[ INDEX ]</span>
            <span>[ RETURN ]</span>
          </div>
          <div className="sa-hud-br">
            <span>SYS · STANDBY</span>
          </div>
        </div>

        <span className="ct-kicker">In transmission</span>
        <h1 className="ct-title cw-title">Coming <em>soon.</em></h1>

        <div className="cw-panel">
          <div className="cw-panel-head" aria-hidden="true">
            <span>TRANSMISSION_LOG</span>
            <span className="cw-caret"></span>
          </div>
          <dl className="cw-spec">
            <div className="cw-row">
              <dt>STATUS</dt>
              <dd><span className="sa-live"><span className="sa-live-dot"></span>IN TRANSMISSION</span></dd>
            </div>
            <div className="cw-row">
              <dt>ETA</dt>
              <dd>SOON</dd>
            </div>
            <div className="cw-row">
              <dt>REF</dt>
              <dd>BUCKETCENTRAL</dd>
            </div>
          </dl>
        </div>

        <p className="cw-note">THIS PAGE IS STILL IN DEVELOPMENT // CHECK BACK LATER</p>

        <Link href="/" className="hp-btn cw-btn">[ RETURN TO INDEX ]</Link>
      </section>

      <style>{`
        /* ── COMING SOON / IN TRANSMISSION (scoped cw-*) ── */

        /* Soft cool bloom centerpiece */
        .cw-wrap > .cw-bloom { position: absolute; z-index: 0; }
        .cw-bloom {
          top: 50%; left: 50%; width: min(820px, 120vw); height: min(820px, 120vw);
          transform: translate(-50%, -50%); pointer-events: none;
          background:
            radial-gradient(34% 34% at 50% 50%, rgba(190,202,255,0.09), transparent 70%),
            radial-gradient(58% 58% at 50% 50%, rgba(150,164,255,0.05), transparent 74%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .cw-bloom { animation: cw-breathe 9s ease-in-out infinite; }
        }
        @keyframes cw-breathe { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }

        html.sensory-active .ct-title.cw-title { letter-spacing: -0.01em; }

        /* Terminal pop-up: frosted spec panel */
        .cw-panel {
          margin-top: 2.8rem; width: min(400px, 90vw); text-align: left;
          border: 1px solid var(--sa-hairline, rgba(176,196,252,0.1)); border-radius: 14px;
          background: linear-gradient(180deg, var(--sa-panel-hi, rgba(23,27,41,0.5)), var(--sa-panel-lo, rgba(9,11,20,0.6)));
          -webkit-backdrop-filter: blur(16px) saturate(1.05); backdrop-filter: blur(16px) saturate(1.05);
          box-shadow: inset 0 1px 0 rgba(196,210,255,0.07), 0 24px 60px -30px rgba(0,0,0,0.85);
          overflow: hidden;
        }
        .cw-panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.7rem 1.15rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-size: 0.56rem;
          letter-spacing: 0.3em; text-transform: uppercase; color: rgba(178,192,230,0.45);
          border-bottom: 1px solid rgba(176,196,252,0.09);
          background: rgba(var(--sa-accent, 150,178,255), 0.04);
        }
        .cw-caret { width: 6px; height: 10px; background: rgba(var(--sa-accent, 150,178,255), 0.8); }
        @media (prefers-reduced-motion: no-preference) { .cw-caret { animation: cw-blink 1.2s steps(1) infinite; } }
        @keyframes cw-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0; } }

        .cw-spec { margin: 0; }
        .cw-row {
          display: flex; align-items: center; justify-content: space-between; gap: 18px;
          padding: 0.85rem 1.15rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-size: 0.64rem;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .cw-row + .cw-row { border-top: 1px solid rgba(176,196,252,0.07); }
        .cw-row dt { color: rgba(178,192,230,0.48); }
        .cw-row dd { margin: 0; color: #e6ecff; text-align: right; }
        .cw-row .sa-live-dot { margin-right: 8px; }

        /* Mono microcopy */
        .cw-note {
          margin-top: 1.8rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.58rem; letter-spacing: 0.22em; text-indent: 0.22em; line-height: 2;
          text-transform: uppercase; color: rgba(200,210,238,0.42); max-width: 520px;
        }

        /* Ghost terminal return */
        html.sensory-active .hp-btn.cw-btn {
          margin-top: 2.2rem;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.7rem; letter-spacing: 0.2em; text-indent: 0.1em; text-transform: uppercase;
        }

        @media (max-width: 1100px) {
          html.sensory-active .cw-wrap .sa-hud-bl,
          html.sensory-active .cw-wrap .sa-hud-br { display: none; }
        }
      `}</style>
    </main>
  );
}
