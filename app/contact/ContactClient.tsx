'use client';
import { useState } from 'react';

export default function ContactClient() {
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
          <a className="ct-social" href="https://www.linkedin.com/in/braven-chiambucket/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0a66c2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
            LinkedIn
          </a>
          <a className="ct-social" href="https://wa.me/6597100366" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25d366" d="M17.47 14.38c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.22-9.41 9.41-9.41 2.51 0 4.88.98 6.65 2.76a9.36 9.36 0 0 1 2.75 6.66c0 5.19-4.22 9.41-9.41 9.41zM20.52 3.49A11.78 11.78 0 0 0 12.04 0C5.46 0 .11 5.35.11 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.3-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.49-8.45z"/></svg>
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
