import { creditsCopy } from './_copy';
import type { Lang } from '@/lib/i18n';

/* The credits page in one language: page.tsx (English) and [lang]/credits/page.tsx render it. */
export default function Credits({ lang }: { lang: Lang }) {
  const c = creditsCopy(lang);
  return (
    <main>
      <section className="cr-hero mf-hero">
        <div className="ct-aura"></div>

        <span className="ct-kicker">{c.kicker}</span>
        <h1 className="ct-title">{c.title}</h1>
        <p className="ct-sub">{c.sub}</p>
      </section>

      <section className="hp-band" style={{ paddingTop: 0 }}>
        <div className="hp-section cr-stack">

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">{c.claude.eyebrow}</span>
            </div>
            <h2 className="cr-h">{c.claude.title}</h2>
            <p>{c.claude.body}</p>
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">{c.hosting.eyebrow}</span>
            </div>
            <h2 className="cr-h">{c.hosting.title}</h2>
            {c.hosting.body.map((p, i) => <p key={i}>{p}</p>)}
          </article>

          <article className="cr-card mf-card" data-reveal>
            <div className="mf-head">
              <span className="hp-eyebrow">{c.tools.eyebrow}</span>
            </div>
            <h2 className="cr-h">{c.tools.title}</h2>
            <ul className="cr-list">
              {c.tools.list.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
            <p style={{ marginTop: '1.4rem' }}>{c.tools.note}</p>
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
