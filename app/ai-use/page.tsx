import type { Metadata } from 'next';

const TITLE = 'Scale of AI use | Braven Chiam';
const DESCRIPTION =
  'How I use AI in my projects, and the four-level scale (L1 to L4) I use to label how much of each project was made with AI tools.';
const URL = 'https://www.chiambucket.com/ai-use';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'article' },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/* The four levels. `rgb` is the mark's own colour as an R,G,B triplet, taken
   from the stroke in public/images/ai-use/L*-label.svg. */
type Level = {
  id: string;
  code: string;
  rgb: string;
  name: string;
  short: string;
  alt: string;
  body: string[];
  uses: string[];
};

const LEVELS: Level[] = [
  {
    id: 'l1',
    code: 'L1',
    short: 'Little use',
    rgb: '83,212,119',
    name: 'Little to insignificant use of AI',
    alt: 'L1 mark: little use of AI based tools',
    body: [
      'I used AI tools in the project, but they had little to no impact on the outcome.',
    ],
    uses: ['Paraphrasing', 'Ideas', 'Feasibility checks', 'Small, minor pieces of work', 'Generating charts', 'Checking my work'],
  },
  {
    id: 'l2',
    code: 'L2',
    short: 'Average use',
    rgb: '245,205,71',
    name: 'Moderate use of AI',
    alt: 'L2 mark: average use of AI based tools',
    body: [
      'Everything in Level 1, plus AI tools were used to create or generate core parts of the project.',
    ],
    uses: ['Writing code', 'Assets the project depends on, like textures for a 3D object', 'Configuring devices'],
  },
  {
    id: 'l3',
    code: 'L3',
    short: 'Heavy use',
    rgb: '255,131,7',
    name: 'Heavy use of AI',
    alt: 'L3 mark: heavy use of AI based tools',
    body: [
      'Level 3 takes this one step further. AI tools ran in automation loops and made crucial, impactful decisions for the project on their own, without asking a human first. The code is almost entirely written by AI, with little to no human involvement.',
      'Humans take a higher-level role: they orchestrate and manage the work the AI agents produce. Humans are still in the loop and make the key decisions.',
    ],
    uses: ['Agents in automation loops', 'Almost all code written by AI', 'Humans orchestrate and review'],
  },
  {
    id: 'l4',
    code: 'L4',
    short: 'Entirely AI',
    rgb: '185,139,250',
    name: 'Entirely AI generated',
    alt: 'L4 mark: entirely created by AI tools',
    body: [
      'At Level 4 the orchestration role passes to an agent. Humans are no longer in the loop, and agents make every decision on their own.',
      'A human sets the goals and leaves the agents running in a loop. Human intervention is rare and happens only when needed. The results reach the human to use or study only after the work is complete.',
    ],
    uses: ['A human sets the goal', 'Agents orchestrate other agents', 'Results reviewed after completion'],
  },
];

/* Comparison rows: one question, answered for L1 to L4 in order. \u00AD is a soft
   hyphen: Chrome won't auto-hyphenate capitalised words in the narrow phone columns. */
const ROWS: { q: string; a: [string, string, string, string] }[] = [
  {
    q: 'How much AI',
    a: ['Little to insignificant', 'Moderate', 'Heavy', 'Entirely AI generated'],
  },
  {
    q: 'What AI works on',
    a: ['Small supporting tasks', 'Core parts of the project', 'Almost all of the work, in automation loops', 'All of the work'],
  },
  {
    q: 'Who does the core work',
    a: ['Me', 'Me, with AI generating core parts', 'AI agents', 'AI agents'],
  },
  {
    q: 'Who makes the key decisions',
    a: ['Me', 'Me', 'Me, while AI makes some crucial calls on its own', 'Agents, working toward goals I set'],
  },
  {
    q: 'AI acts without asking',
    a: ['No', 'No', 'Yes', 'Yes'],
  },
  {
    q: 'Human in the loop',
    a: ['Yes, throughout', 'Yes, throughout', 'Yes, for the key decisions', 'No, only at the start and the end'],
  },
  {
    q: 'My role',
    a: ['Maker', 'Maker, using AI as a tool', 'Orches\u00ADtrator and manager', 'Sets the goal, steps in rarely, studies the results'],
  },
  {
    q: 'Example uses',
    a: [
      'Para\u00ADphrasing, feasibility checks, charts, checking my work',
      'Writing code, 3D textures, configuring devices',
      'Agent loops that write almost all of the code',
      'Agents running on their own toward a set goal',
    ],
  },
];

/* The four downloadable versions of each mark, at their SVG viewBox sizes. `area` places
   each one in the download tile's grid. Both QR versions encode https://www.chiambucket.com/ai-use. */
const MARKS = [
  { kind: 'label', label: 'Label', name: 'label', area: 'label', w: 84, h: 94 },
  { kind: 'icon', label: 'Icon', name: 'icon', area: 'icon', w: 84, h: 67 },
  { kind: 'vertical-qr', label: 'Vertical QR', name: 'vertical QR code', area: 'vqr', w: 84, h: 164 },
  { kind: 'horizontal-qr', label: 'Horizontal QR', name: 'horizontal QR code', area: 'hqr', w: 173, h: 94 },
] as const;

const lv = (rgb: string) => ({ '--lv': rgb } as React.CSSProperties);

export default function AiUsePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Scale of AI use',
    description: DESCRIPTION,
    url: URL,
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com' },
    image: 'https://www.chiambucket.com/images/ai-use/L1-label.svg',
  };

  return (
    <main className="ai-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="cr-hero ai-hero">
        <div className="ct-aura"></div>
        <h1 className="ct-title">Scale of AI use</h1>
        <p className="ct-sub">
          This scale is used to transparently communicate the impact of AI tools on my
          projects.
        </p>

        <nav className="ai-scale" aria-label="The four levels">
          <ol className="ai-scale-marks">
            {LEVELS.map((l) => (
              <li key={l.id} style={lv(l.rgb)}>
                <a href={`#${l.id}`} className="ai-scale-mark">
                  <img src={`/images/ai-use/${l.code}-label.svg`} alt={l.alt} width={84} height={94} />
                </a>
                <span className="ai-scale-seg" aria-hidden="true"></span>
              </li>
            ))}
          </ol>
          <div className="ai-scale-ends" aria-hidden="true">
            <span>Human decides</span>
            <span>Agents decide</span>
          </div>
        </nav>
      </section>

      <section className="hp-band ai-band">
        <div className="hp-section">
          <article className="ai-stance">
            <h2 className="ai-h2">Why I use AI, and why I say so</h2>
            <p>
              In my opinion, AI is a revolutionary technology that allows unprecedented, rapid
              development in many fields. Instead of gating and limiting its use as most
              institutions do, I let myself explore these tools to their full potential and push
              the limits of what they can do. In that way, I continuously learn about this
              ever-changing, rapidly improving technology, which significantly speeds up my work
              and raises its quality.
            </p>
            <p>
              However, I am very much against the use of AI tools to make low-quality,
              low-effort work, especially art. I use AI tools in my design work, but I heavily
              tweak the design styles myself till they are of a level I can proudly display.
            </p>
            <p>
              As such, I built this scale to make it easy to see how much AI was involved in a
              given project. If you find it useful, please feel free to adopt it for your work
              too!
            </p>
          </article>
        </div>
      </section>

      <section className="hp-band ai-band" aria-labelledby="ai-levels-h">
        <div className="hp-section">
          <header className="ai-intro">
            <h2 className="ai-h2" id="ai-levels-h">The four levels</h2>
            <p>Each level includes everything in the levels before it.</p>
          </header>

          <ol className="ai-levels">
            {LEVELS.map((l) => (
              <li key={l.id} id={l.id} className="ai-level" style={lv(l.rgb)}>
                <div className="ai-level-mark">
                  <img src={`/images/ai-use/${l.code}-label.svg`} alt={l.alt} width={84} height={94} loading="lazy" />
                </div>
                <div className="ai-level-body">
                  <h3>{l.name}</h3>
                  {l.body.map((p) => <p key={p}>{p}</p>)}
                  <ul className="ai-uses" aria-label={`Typical ${l.code} uses`}>
                    {l.uses.map((u) => <li key={u}>{u}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-band ai-band" aria-labelledby="ai-cmp-h">
        <div className="hp-section">
          <header className="ai-intro">
            <h2 className="ai-h2" id="ai-cmp-h">The levels side by side</h2>
            <p>The same questions, answered for each level.</p>
          </header>

          <div className="ai-cmp-wrap">
            <table className="ai-cmp">
              <caption className="ai-sr">Comparison of the four levels of AI use</caption>
              <thead>
                <tr>
                  <td className="ai-cmp-corner"></td>
                  {LEVELS.map((l) => (
                    <th key={l.id} scope="col" style={lv(l.rgb)}>
                      <a href={`#${l.id}`} className="ai-cmp-head">
                        <img src={`/images/ai-use/${l.code}-icon.svg`} alt={l.code} width={84} height={67} loading="lazy" />
                        <span className="ai-cmp-long">{l.name}</span>
                        <span className="ai-cmp-short">{l.short}</span>
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.q}>
                    <th scope="row">{r.q}</th>
                    {r.a.map((a, i) => (
                      <td key={LEVELS[i].id}>
                        {a}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hp-band ai-band" aria-labelledby="ai-dl-h">
        <div className="hp-section">
          <header className="ai-intro">
            <h2 className="ai-h2" id="ai-dl-h">Download the marks</h2>
            <p>
              Each level comes as a label, a smaller icon, and vertical and horizontal versions
              with a QR code that links back to this page. All are SVG. Use them to mark your own
              projects.
            </p>
          </header>

          <ul className="ai-dl">
            {LEVELS.map((l) => (
              <li key={l.id} className="ai-dl-level" style={lv(l.rgb)}>
                <h3>{l.code} <span>{l.short}</span></h3>
                <div className="ai-dl-marks">
                  {MARKS.map((m) => (
                    <figure
                      key={m.kind}
                      className="ai-dl-mark"
                      style={{ gridArea: m.area, '--mw': m.w } as React.CSSProperties}
                    >
                      <div className="ai-dl-well">
                        <img
                          src={`/images/ai-use/${l.code}-${m.kind}.svg`}
                          alt={`${l.code} ${m.name} mark`}
                          width={m.w}
                          height={m.h}
                          loading="lazy"
                        />
                      </div>
                      <a
                        href={`/images/ai-use/${l.code}-${m.kind}.svg`}
                        download={`AI-use-${l.code}-${m.kind}.svg`}
                        className="ai-dl-btn"
                        aria-label={`Download the ${l.code} ${m.name} mark as SVG`}
                      >
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                          <path d="M8 2v8M4.5 6.8 8 10.3l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {m.label}
                      </a>
                    </figure>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <style>{`
        /* ── AI USE SCALE (scoped ai-*) ── */
        .ai-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        .ai-hero .ct-title { max-width: 18ch; text-wrap: balance; }
        .ai-hero .ct-sub { max-width: 520px; }

        /* Hero scale: the four marks over a segmented bar, human end to agent end */
        .ai-scale { width: 100%; max-width: 560px; margin: clamp(36px, 5vw, 52px) auto 0; }
        .ai-scale-marks { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .ai-scale-marks li { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .ai-scale-mark { display: block; border-radius: 10px; outline: none;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
        .ai-scale-mark img { display: block; width: clamp(68px, 18vw, 104px); height: auto; }
        .ai-scale-mark:hover { transform: translateY(-4px); box-shadow: 0 14px 30px -14px rgba(var(--lv), 0.55); }
        .ai-scale-mark:focus-visible { box-shadow: 0 0 0 2px #0b0906, 0 0 0 4px rgba(var(--lv), 0.95); }
        .ai-scale-mark:active { transform: translateY(-1px) scale(0.98); }
        .ai-scale-seg { display: block; width: 100%; height: 5px; border-radius: 3px; background: rgb(var(--lv)); opacity: 0.85; }
        .ai-scale-ends { display: flex; justify-content: space-between; margin-top: 10px; }
        .ai-hero .ai-scale-ends span { font-family: 'dmsans'; font-size: 0.86rem; letter-spacing: 0; text-transform: none; color: var(--hp-ink-dim); }

        .ai-band { padding-top: clamp(48px, 6vw, 84px); padding-bottom: clamp(48px, 6vw, 84px); }
        .ai-h2 { font-family: 'oswaldbold'; font-size: clamp(1.8rem, 3.6vw, 2.6rem); line-height: 1.1;
          letter-spacing: -0.015em; color: #f2f2f2; padding-bottom: 0.06em; }
        .ai-intro { max-width: 720px; margin: 0 auto clamp(26px, 4vw, 40px); }
        .ai-intro p { font-family: 'dmsans'; font-size: 1.02rem; line-height: 1.6; color: var(--hp-ink-dim); margin-top: 0.5rem; }

        /* Stance: a single reading column on a panel */
        .ai-stance { max-width: 720px; margin: 0 auto; padding: clamp(26px, 4vw, 46px);
          border-radius: 22px; border: 1px solid var(--sa-hairline);
          background: linear-gradient(180deg, var(--sa-panel-hi), var(--sa-panel-lo));
          box-shadow: inset 0 1px 0 rgba(255,236,210,0.05), 0 24px 60px -30px rgba(0,0,0,0.85); }
        .ai-stance p { font-family: 'dmsans'; font-size: 1.06rem; line-height: 1.75; color: rgba(236,232,226,0.78); margin-top: 1.05rem; }
        .ai-stance p:first-of-type { margin-top: 1.2rem; }

        /* Levels: a stepped rail. Each mark is joined to the next by a line in its colour. */
        .ai-levels { list-style: none; margin: 0 auto; padding: 0; max-width: 820px; }
        .ai-level { display: grid; grid-template-columns: 104px 1fr; gap: clamp(20px, 3.4vw, 40px);
          scroll-margin-top: 130px; }
        .ai-level-mark { position: relative; display: flex; justify-content: center; align-items: flex-start; padding-top: 4px; }
        .ai-level-mark img { display: block; width: 104px; height: auto; position: relative; z-index: 1; }
        .ai-level:not(:last-child) .ai-level-mark::after { content: ''; position: absolute; left: 50%; top: 120px; bottom: 8px;
          width: 2px; margin-left: -1px; border-radius: 1px;
          background: linear-gradient(180deg, rgba(var(--lv), 0.6), rgba(var(--lv), 0.12)); }
        .ai-level-body { padding: 4px 0 clamp(44px, 6vw, 64px); }
        .ai-level-body h3 { font-family: 'oswaldbold'; font-size: clamp(1.45rem, 2.6vw, 1.9rem); line-height: 1.12;
          letter-spacing: -0.01em; color: rgb(var(--lv)); padding-bottom: 0.04em; }
        .ai-level-body p { font-family: 'dmsans'; font-size: 1.02rem; line-height: 1.72; color: rgba(236,232,226,0.76);
          margin-top: 0.75rem; max-width: 62ch; }
        .ai-uses { list-style: none; padding: 0; margin: 1.05rem 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
        .ai-uses li { font-family: 'dmsans'; font-size: 0.86rem; line-height: 1.3; color: rgba(240,236,230,0.86);
          padding: 6px 12px; border-radius: 8px; background: rgba(var(--lv), 0.08); border: 1px solid rgba(var(--lv), 0.26); }

        /* Comparison table */
        .ai-cmp-wrap { border-radius: 22px; border: 1px solid var(--sa-hairline); overflow: hidden;
          background: linear-gradient(180deg, var(--sa-panel-hi), var(--sa-panel-lo));
          box-shadow: inset 0 1px 0 rgba(255,236,210,0.05), 0 24px 60px -30px rgba(0,0,0,0.85); }
        .ai-cmp { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .ai-cmp-corner { width: 19%; }
        .ai-cmp thead th { vertical-align: top; padding: 22px 16px 18px; text-align: left;
          border-bottom: 2px solid rgba(var(--lv), 0.7); }
        .ai-cmp-head { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; text-decoration: none;
          border-radius: 8px; outline: none; }
        .ai-cmp-head img { width: 64px; height: auto; display: block;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1); }
        .ai-cmp-head span { font-family: 'oswaldbold'; font-size: 1.08rem; line-height: 1.15; letter-spacing: -0.005em; color: rgb(var(--lv)); }
        .ai-cmp-head:hover img { transform: translateY(-3px); }
        .ai-cmp-head:focus-visible { box-shadow: 0 0 0 2px rgba(var(--lv), 0.9); }
        .ai-cmp-head:active img { transform: scale(0.97); }
        .ai-cmp tbody th, .ai-cmp td { padding: 16px; text-align: left; vertical-align: top;
          font-family: 'dmsans'; font-size: 0.95rem; line-height: 1.5; border-top: 1px solid rgba(255,236,210,0.06); }
        .ai-cmp tbody tr:first-child th, .ai-cmp tbody tr:first-child td { border-top: 0; }
        .ai-cmp tbody th { font-weight: 600; color: #f0ece6; padding-left: 24px; }
        .ai-cmp td { color: rgba(236,232,226,0.74); }
        .ai-cmp tbody tr:nth-child(even) { background: rgba(255,236,210,0.022); }

        /* Downloads: one tile per level. The tall vertical QR mark takes the right column, the
           wide horizontal one sits under the label and icon. --mw is the mark's viewBox width
           and --s one shared scale, so the four marks keep their true relative sizes. */
        .ai-dl { --s: 1.2; list-style: none; margin: 0 auto; padding: 0; display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(12px, 1.6vw, 18px); }
        .ai-dl-level { padding: 18px 16px 16px; border-radius: 18px; border: 1px solid var(--sa-hairline);
          border-top: 2px solid rgba(var(--lv), 0.7);
          background: linear-gradient(180deg, var(--sa-panel-hi), var(--sa-panel-lo));
          box-shadow: inset 0 1px 0 rgba(255,236,210,0.05), 0 20px 50px -30px rgba(0,0,0,0.85); }
        .ai-dl-level h3 { font-family: 'oswaldbold'; font-size: 1.2rem; line-height: 1.15; color: rgb(var(--lv)); }
        .ai-dl-level h3 span { font-family: 'dmsans'; font-weight: 500; font-size: 0.92rem; color: rgba(236,232,226,0.72); margin-left: 4px; }
        .ai-dl-marks { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-template-areas: "label icon vqr" "hqr hqr vqr"; gap: 10px; margin-top: 14px; }
        .ai-dl-mark { margin: 0; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ai-dl-well { flex: 1; display: flex; align-items: center; justify-content: center; padding: 16px 8px;
          border-radius: 12px; background: rgba(0,0,0,0.28); border: 1px solid rgba(255,236,210,0.05); }
        .ai-dl-well img { display: block; width: calc(var(--mw) * var(--s) * 1px); max-width: 100%; height: auto; }
        .ai-dl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px;
          padding: 6px 10px; border-radius: 10px; text-decoration: none;
          font-family: 'dmsans'; font-size: 0.86rem; font-weight: 600; color: rgba(244,240,234,0.92);
          background: rgba(var(--lv), 0.1); border: 1px solid rgba(var(--lv), 0.34); outline: none;
          transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s cubic-bezier(.22,1,.36,1); }
        .ai-dl-btn svg { color: rgb(var(--lv)); flex: none; }
        .ai-dl-btn:hover { background: rgba(var(--lv), 0.2); border-color: rgba(var(--lv), 0.6); }
        .ai-dl-btn:focus-visible { box-shadow: 0 0 0 2px #0b0906, 0 0 0 4px rgba(var(--lv), 0.95); }
        .ai-dl-btn:active { transform: scale(0.97); }
        @media (max-width: 1000px) {
          .ai-dl { --s: 0.62; }
          .ai-dl-btn { white-space: nowrap; padding: 6px 6px; font-size: 0.8rem; gap: 4px; }
        }
        @media (max-width: 700px) {
          .ai-dl { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 520px) {
          .ai-dl-level { padding: 14px 12px 12px; border-radius: 16px; }
          .ai-dl-marks { gap: 8px; margin-top: 10px; }
          .ai-dl-well { padding: 12px 6px; }
        }

        @media (max-width: 760px) {
          .ai-level { grid-template-columns: 72px 1fr; }
          .ai-level-mark img { width: 72px; }
          .ai-level:not(:last-child) .ai-level-mark::after { top: 90px; }
        }

        /* Phones and tablets: the same table, four level columns wide. There is no room for a
           question column, so each question becomes a full-width line above its row. */
        @media (max-width: 900px) {
          .ai-cmp-wrap { margin: 0 -6px; border-radius: 18px; }
          .ai-cmp, .ai-cmp thead, .ai-cmp tbody { display: block; }
          .ai-cmp tr { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .ai-cmp-corner { display: none; }
          .ai-cmp thead th { padding: 16px 8px 12px; }
          .ai-cmp-head { gap: 8px; }
          .ai-cmp-head img { width: clamp(46px, 8vw, 64px); }
          .ai-cmp-head span { font-size: clamp(0.86rem, 2vw, 1rem); }
          .ai-cmp-head .ai-cmp-long { display: none; }
          .ai-cmp tbody th { grid-column: 1 / -1; padding: 14px 12px 2px; font-size: clamp(0.9rem, 2vw, 1rem); }
          .ai-cmp td { padding: 6px 8px 14px; font-size: clamp(0.8rem, 2vw, 0.92rem); line-height: 1.42; border-top: 0;
            hyphens: auto; overflow-wrap: break-word; }
        }
        @media (min-width: 901px) {
          .ai-cmp-head .ai-cmp-short { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-scale-mark, .ai-cmp-head img, .ai-dl-btn { transition: none; }
          .ai-scale-mark:hover, .ai-cmp-head:hover img { transform: none; }
        }
      `}</style>
    </main>
  );
}
