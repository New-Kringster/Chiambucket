import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credits · Braven Chiam | Chiambucket',
  description: 'Colophon for chiambucket.com: designed and built with Claude Opus 4, hosted on Vercel, and standing on a few open-source tools.',
  alternates: { canonical: 'https://www.chiambucket.com/credits' },
  openGraph: {
    title: 'Credits · Braven Chiam | Chiambucket',
    description: 'How this site was designed, built and hosted, and the tools behind it.',
    url: 'https://www.chiambucket.com/credits',
  },
  twitter: {
    title: 'Credits · Braven Chiam',
    description: 'Designed and built with Claude Opus 4, hosted on Vercel.',
  },
};

export default function CreditsPage() {
  return (
    <main>
      <section className="cr-hero mf-hero">
        <div className="ct-aura"></div>


        <span className="ct-kicker">Site manifest</span>
        <h1 className="ct-title">Credits &amp; <em>content.</em></h1>
        <p className="ct-sub">
          How this site was designed, built and hosted, and the tools and people that made
          it possible.
        </p>
      </section>

      <section className="hp-band" style={{ paddingTop: 0 }}>
        <div className="hp-section cr-stack">

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Designed &amp; built with</span>
              <span className="mf-idx">REC · 01</span>
            </div>
            <h2 className="cr-h">Claude Opus 4</h2>
            <p>
              This redesign was made together with Claude Opus 4, Anthropic&apos;s frontier AI
              model. Claude helped shape the layout and visual direction, write the HTML,
              CSS and JavaScript, sharpen the copy, and debug along the way, working
              iteratively from rough ideas into the finished pages you&apos;re looking at now.
            </p>
            <p>
              Claude is a family of AI assistants from{' '}
              <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>,
              an AI safety company. People use it for writing, coding, analysis and
              research, and it&apos;s built to be helpful, harmless and honest. The Opus models
              are the most capable of the family, which suited the open-ended design and
              engineering this rebuild needed. I still made every call on what stayed, what
              changed and how it should feel, Claude was the tool that helped me get there
              faster.
            </p>
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Hosted on</span>
              <span className="mf-idx">REC · 02</span>
            </div>
            <h2 className="cr-h">Vercel</h2>
            <p>
              The site is served by{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a>,
              a cloud platform for deploying web projects. It distributes the pages across a
              global edge network so they load quickly wherever you are, with automatic HTTPS
              and a fresh deploy on every push.
            </p>
            <p>
              Moving here is part of a wider shift. The Chiambucket homelab still runs plenty
              of self-hosted services on solar power, but for the public site, leaning on
              managed cloud hosting keeps it fast, reliable and effortless to ship.
            </p>
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">Tools &amp; content</span>
              <span className="mf-idx">REC · 03</span>
            </div>
            <h2 className="cr-h">Standing on open shoulders</h2>
            <p>A few open-source projects and assets do quiet work behind the scenes:</p>
            <ul className="cr-list">
              <li><b>Next.js</b>, the React framework powering the site</li>
              <li><b>Lychee</b>, the self-hosted photography gallery embed</li>
              <li><b>Oswald, Inter &amp; DM Sans</b>, the core typefaces</li>
              <li><b>Display faces</b> for the accent headings</li>
              <li><b>Inline SVG</b> for every icon on the site</li>
            </ul>
            <p style={{ marginTop: '1.4rem' }}>
              All photography, writing and project work is by Braven Chiam. Design and build
              by Braven Chiam with Claude Opus 4.
            </p>
          </article>

          <div className="mf-end" aria-hidden="true">// END OF MANIFEST</div>

        </div>
      </section>

      <style>{`
        /* ── CREDITS / MANIFEST (scoped mf-*) ── */

        /* Numbered record header inside each card, closed by a hairline seam */
        .mf-head {
          display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
          padding-bottom: 13px; margin-bottom: 6px;
          background: linear-gradient(90deg, rgba(var(--sa-accent, 150,164,255), 0.28), rgba(var(--sa-accent, 150,164,255), 0.05) 55%, transparent 90%) left bottom / 100% 1px no-repeat;
        }
        .mf-idx {
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.58rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: rgba(178,192,230,0.42); white-space: nowrap;
        }

        /* List markers follow the readout language: square accent ticks */
        .mf-card .cr-list li::before { border-radius: 1px; background: rgba(var(--sa-accent, 150,164,255), 0.72); }

        /* Manifest terminator */
        .mf-end {
          margin-top: 14px; text-align: center;
          font-family: var(--font-ddt, 'ddt', ui-monospace, monospace); font-weight: 400;
          font-size: 0.58rem; letter-spacing: 0.32em; text-indent: 0.32em; text-transform: uppercase;
          color: rgba(178,192,230,0.34);
        }

      `}</style>
    </main>
  );
}
