'use client';
import type { Metadata } from 'next';
import { useState } from 'react';

// Page metadata exported separately for server components — declared here for reference
// export const metadata: Metadata = { ... };

export default function ContactPage() {
  const [copyLabel, setCopyLabel] = useState('Copy');

  const handleCopy = () => {
    const email = 'braven@chiambucket.com';
    const done = () => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy'), 1600);
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
      <section className="ct-wrap">
        <div className="ct-aura"></div>
        <span className="ct-kicker">Get in touch</span>
        <h1 className="ct-title">Let&apos;s <em>talk.</em></h1>
        <p className="ct-sub">
          Have a project in mind, a question, or just want to say hi? The fastest way to reach
          me is email, but I&apos;m on a few other places too.
        </p>

        <div className="ct-email-card">
          <div className="ct-email-text">
            <span className="ct-email-label">Email</span>
            <span className="ct-email-addr" id="ct-email">braven@chiambucket.com</span>
          </div>
          <div className="ct-email-actions">
            <a className="ct-copy" href="mailto:braven@chiambucket.com">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Email me
            </a>
            <button className="ct-copy" type="button" onClick={handleCopy}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="ct-copy-label">{copyLabel}</span>
            </button>
          </div>
        </div>

        <div className="ct-socials">
          <a className="ct-social" href="https://www.instagram.com/bombastic_demise" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="#e1306c" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="#e1306c" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="#e1306c" />
            </svg>
            Instagram
          </a>
          <a className="ct-social" href="https://www.youtube.com/@newkringster2564" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="#e62117" strokeWidth="1.8" />
              <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="#e62117" />
            </svg>
            YouTube
          </a>
          <a className="ct-social" href="https://github.com/New-Kringster" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="#e8e8e8" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a className="ct-social" href="https://wa.me/6597100366" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 21l1.6-4.3A8 8 0 1 1 12 20a8.4 8.4 0 0 1-4-1L3 21z" stroke="#25d366" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 8.5c.2 1.5 1.5 4 4.5 5.5.8.4 1.4-.1 1.7-.5" stroke="#25d366" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
