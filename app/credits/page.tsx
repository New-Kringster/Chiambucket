import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credits | Braven Chiam',
  description:
    'Colophon for chiambucket.com: built with Claude, hosted on Vercel, made with Next.js, and a self-hosted Lychee gallery for the photos.',
  alternates: { canonical: 'https://www.chiambucket.com/credits' },
  openGraph: {
    title: 'Credits | Braven Chiam',
    description: 'How this site is built and hosted, and the tools behind it.',
    url: 'https://www.chiambucket.com/credits',
  },
  twitter: {
    title: 'Credits | Braven Chiam',
    description: 'Built with Claude, hosted on Vercel.',
  },
};

export default function CreditsPage() {
  return (
    <main>
      <section className="cr-hero mf-hero">
        <div className="ct-aura"></div>

        <span className="ct-kicker">Credits</span>
        <h1 className="ct-title">Credits &amp; <em>content.</em></h1>
        <p className="ct-sub">
          How this site is built and hosted, and the tools behind it.
        </p>
      </section>

      <section className="hp-band" style={{ paddingTop: 0 }}>
        <div className="hp-section cr-stack">

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Design and build</span>
            </div>
            <h2 className="cr-h">Claude</h2>
            <p>
              I designed and built this site with Claude, an AI model from{' '}
              <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>.
              Claude helped with the layout, wrote much of the code, tightened the copy and
              helped me debug. I decided what stayed, what changed and how it looks.
            </p>
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Hosting</span>
            </div>
            <h2 className="cr-h">Vercel</h2>
            <p>
              <a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> hosts
              the site and deploys a new version on every push. Vercel Analytics and Speed
              Insights count visits and measure page speed.
            </p>
            <p>
              My homelab still runs the photo gallery and my other self-hosted services. The
              public site runs on Vercel because managed hosting keeps it faster and more
              reliable.
            </p>
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Tools and content</span>
            </div>
            <h2 className="cr-h">Software and typefaces</h2>
            <ul className="cr-list">
              <li><b>Next.js and React</b>, written in TypeScript</li>
              <li><b>Framer Motion</b> for the homelab page and the project demos</li>
              <li><b>Lychee</b>, the photo gallery I host for the photography page</li>
              <li><b>Oswald, Inter and DM Sans</b>, the main typefaces</li>
              <li><b>Plain CSS</b> for the background: one static layer with a soft light and faint dots, so an idle page does no background work</li>
              <li><b>Inline SVG</b> for the icons</li>
            </ul>
            <p style={{ marginTop: '1.4rem' }}>
              The photographs, writing and project work on this site are my own.
            </p>
          </article>

        </div>
      </section>

      <style>{`
        /* ── CREDITS (scoped mf-*) ── */

        /* Card header, closed by a hairline seam */
        .mf-head {
          display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
          padding-bottom: 13px; margin-bottom: 6px;
          background: linear-gradient(90deg, rgba(var(--sa-accent, 150,164,255), 0.28), rgba(var(--sa-accent, 150,164,255), 0.05) 55%, transparent 90%) left bottom / 100% 1px no-repeat;
        }

        /* Square accent list markers */
        .mf-card .cr-list li::before { border-radius: 1px; background: rgba(var(--sa-accent, 150,164,255), 0.72); }


      `}</style>
    </main>
  );
}
