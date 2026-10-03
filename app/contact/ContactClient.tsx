'use client';
import { useState } from 'react';

export default function ContactClient() {
  const [copyLabel, setCopyLabel] = useState('Copy address');

  const handleCopy = () => {
    const email = 'braven@chiambucket.com';
    const done = () => {
      setCopyLabel('Copied');
      setTimeout(() => setCopyLabel('Copy address'), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(done).catch(done);
    } else {
      const t = document.createElement('textarea');
      t.value = email;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); } catch (e) { /* noop */ }
      document.body.removeChild(t);
      done();
    }
  };

  return (
    <main>
      <section className="ct-wrap cx-wrap">
        <div className="ct-aura"></div>
        <div className="cx-monolith" aria-hidden="true"></div>

        <span className="ct-kicker">Contact</span>
        <h1 className="ct-title cx-title">Let&apos;s <em>talk.</em></h1>
        <p className="ct-sub">
          Email is the fastest way to reach me. I&apos;m also on the sites below.
        </p>

        <div className="ct-email-card cx-card">
          <div className="ct-email-text">
            <span className="ct-email-label">Email</span>
            <span className="ct-email-addr" id="ct-email">braven@chiambucket.com</span>
          </div>
          <div className="ct-email-actions">
            <a className="ct-copy" href="mailto:braven@chiambucket.com">
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Write an email
            </a>
            <button className="ct-copy" type="button" onClick={handleCopy}>
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="ct-copy-label" aria-live="polite">{copyLabel}</span>
            </button>
          </div>
        </div>

        <div className="ct-socials cx-socials">
          <a className="cx-soc" href="https://www.instagram.com/bombastic_demise" target="_blank" rel="noopener">Instagram</a>
          <a className="cx-soc" href="https://www.youtube.com/@newkringster2564" target="_blank" rel="noopener">YouTube</a>
          <a className="cx-soc" href="https://github.com/New-Kringster" target="_blank" rel="noopener">GitHub</a>
          <a className="cx-soc" href="https://www.linkedin.com/in/braven-chiambucket/" target="_blank" rel="noopener">LinkedIn</a>
          <a className="cx-soc" href="https://wa.me/6597100366" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </section>

      <style>{`
        /* ── CONTACT (scoped cx-*) ── */

        /* Vertical light monolith behind the centered column */
        .cx-wrap > .cx-monolith { position: absolute; z-index: 0; }
        .cx-monolith {
          top: 50%; left: 50%;
          width: min(480px, 86vw); height: min(112svh, 960px);
          transform: translate(-50%, -50%);
          pointer-events: none;
          background:
            radial-gradient(44% 46% at 50% 50%, rgba(168,182,240,0.09), transparent 72%),
            radial-gradient(18% 54% at 50% 50%, rgba(198,208,252,0.12), transparent 74%),
            radial-gradient(6.5% 58% at 50% 50%, rgba(226,232,255,0.16), transparent 80%);
        }
        .cx-monolith::after {
          content: ''; position: absolute; left: 50%; top: 7%; bottom: 7%; width: 1px; margin-left: -0.5px;
          background: linear-gradient(180deg, transparent, rgba(206,216,255,0.2) 28%, rgba(206,216,255,0.2) 72%, transparent);
        }
        @media (max-width: 640px) {
          .cx-monolith::after {
            background: linear-gradient(180deg, transparent, rgba(206,216,255,0.12) 28%, rgba(206,216,255,0.12) 72%, transparent);
          }
        }

        /* Tight-set display title (Oswald is condensed, reads best tight) */
        html.sensory-active .ct-title.cx-title { letter-spacing: -0.01em; }

        /* Email row */
        .ct-email-card.cx-card { margin-top: 3rem; border-radius: 14px; }
        .cx-card .ct-email-addr {
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace);
          font-size: clamp(0.88rem, 2.1vw, 1.02rem); letter-spacing: 0.08em; color: #eef2ff;
        }
        .cx-card .ct-copy {
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.18em; text-indent: 0.06em;
        }
        .cx-card .ct-copy svg { opacity: 0.75; }
        .cx-card .ct-copy-label { font: inherit; letter-spacing: inherit; text-transform: inherit; }
        .cx-card .ct-copy:focus-visible { outline: 1px solid rgba(var(--sa-accent, 150,164,255), 0.7); outline-offset: 3px; }

        /* Social links */
        .ct-socials.cx-socials { gap: 4px 16px; margin-top: 2.7rem; }
        .cx-soc {
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(214,224,248,0.62); padding: 0.55rem 0.2rem; text-decoration: none;
          transition: color 0.25s ease, text-shadow 0.25s ease, transform 0.2s ease;
        }
        .cx-soc:hover { color: #ffffff; text-shadow: 0 0 18px rgba(var(--sa-accent, 150,164,255), 0.55); }
        .cx-soc:focus-visible { outline: 1px solid rgba(var(--sa-accent, 150,164,255), 0.7); outline-offset: 4px; border-radius: 4px; }
        .cx-soc:active { transform: translateY(1px); }

      `}</style>
    </main>
  );
}
