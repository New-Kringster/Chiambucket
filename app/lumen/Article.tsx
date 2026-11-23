/* The LUMEN article, rendered in any language: the English page (page.tsx) and
   app/[lang]/lumen/page.tsx both render it. Its words come from ./_copy; the system
   prompt (./prompt.ts) stays English. Client widgets get their words as props. */
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LumenConsole from './LumenConsole';
import PromptReveal from './PromptReveal';
import { SYSTEM_PROMPT } from './prompt';
import { loadLumenCopy, type LumenCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';

export const URL = 'https://www.chiambucket.com/lumen';

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* the chapter rail, by section id (labels in the copy's rail) */
const RAIL = ['overview', 'try', 'how', 'brain', 'hardware', 'memory', 'auto', 'deploy', 'slides', 'next'] as const;

export default async function LumenArticle({ lang }: { lang: Lang }) {
  const c = await loadLumenCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.ld.description,
    image: 'https://www.chiambucket.com/images/logo.png',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/lumen', lang),
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero (decorative; drop a hero photo into art-hero-bg later) ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/covers/lumen.webp" alt={c.hero.alt} /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href={localize('/#projects', lang)}><BackArrow /> {c.hero.back}</a>
          <div className="art-tags">
            <AiMark project="proj-lumen" />
            <span className="hp-md-tag school">{c.hero.tag}</span>
          </div>
          <h1 className="art-title">{c.hero.title}</h1>
          <p className="art-lead">{c.hero.lead}</p>
          <div className="art-toolrow">
            <span className="hp-key">{c.hero.builtWith}</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/python-icon.webp" alt="Python" />
              <img src="/images/docker-icon.webp" alt="Docker" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
            </div>
          </div>
          {/*  KEY LINKS: the repo is private (the spec doc holds graded credentials) and the
              dashboard is only exposed during the demo, so no public links ship yet.
              When ready, add back the row, e.g.:
              <ArticleLinks links={[
                { type: 'video', label: 'Watch the demo', url: 'https://youtu.be/…' },
                { type: 'github', label: 'GitHub', url: 'https://github.com/…' },
              ]} />  */}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">{c.chapters}</span>
            <nav className="art-chapters article-chapter-wrapper">
              {RAIL.map((id) => <a key={id} href={`#${id}`}>{c.rail[id]}</a>)}
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="overview" className="art-section" data-reveal>
            <h2>{c.overview.h}</h2>
            <p>{c.overview.p[0]}</p>
            <p>{c.overview.p[1]}</p>
            <figure className="lm-demo">
              <video controls preload="none" poster="/images/posters/lumen-demo.webp" playsInline width={1280} height={720}>
                <source src="/videos/lumen-demo.webm" type="video/webm" />
                <source src="/videos/lumen-demo.mp4" type="video/mp4" />
              </video>
              <figcaption>{c.overview.video}</figcaption>
            </figure>
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>{c.try.h}</h2>
            <p>{c.try.p}</p>
            <LumenConsole t={c.console} />
            <p className="art-cap-note">{c.try.note}</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>{c.how.h}</h2>
            <p>{c.how.p1}</p>
            <SignalPath t={c.flow} />
            <p>{c.how.p2}</p>
            <p>{c.how.p3}</p>
            <h3>{c.how.pipelineH}</h3>
            <ol className="lm-steps">
              {c.how.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </section>

          <section id="brain" className="art-section" data-reveal>
            <h2>{c.brain.h}</h2>
            <p>{c.brain.p}</p>
            <ul className="lm-list">
              {c.brain.shapes.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <CommandFlowchart t={c.chart} />
            <p>{c.brain.p2}</p>
            <p>{c.brain.p3}</p>
            <PromptReveal text={SYSTEM_PROMPT} t={c.prompt} />
            <p>{c.brain.p4}</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>{c.hardware.h}</h2>
            <p>{c.hardware.p1}</p>
            <HardwareHub t={c.hub} />
            <p>{c.hardware.p2}</p>
            <figure className="art-fig">
              <img src="/images/lumen-mic.webp" alt={c.hardware.micAlt} loading="lazy" />
              <figcaption>{c.hardware.micCaption}</figcaption>
            </figure>
          </section>

          <section id="memory" className="art-section" data-reveal>
            <h2>{c.memory.h}</h2>
            <p>{c.memory.p1}</p>
            <p>{c.memory.p2}</p>
            <p>{c.memory.p3}</p>
          </section>

          <section id="auto" className="art-section" data-reveal>
            <h2>{c.auto.h}</h2>
            <p>{c.auto.p[0]}</p>
            <p>{c.auto.p[1]}</p>
          </section>

          <section id="deploy" className="art-section" data-reveal>
            <h2>{c.deploy.h}</h2>
            <p>{c.deploy.p[0]}</p>
            <p>{c.deploy.p[1]}</p>
            <figure className="art-fig lm-dash">
              <img src="/images/lumen-dashboard.webp" alt={c.deploy.dashAlt} loading="lazy" />
              <figcaption>{c.deploy.dashCaption}</figcaption>
            </figure>
          </section>

          <section id="slides" className="art-section" data-reveal>
            <h2>{c.slides.h}</h2>
            <p>{c.slides.p}</p>
            <div className="art-embed lm-deck">
              <iframe
                title={c.slides.frame}
                src="https://embed.figma.com/deck/SPhrhpw7sGvLo9PwOkXY8b/LUMEN?embed-host=share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>

          <section id="next" className="art-section" data-reveal>
            <h2>{c.next.h}</h2>
            <p>{c.next.p}</p>
            <ul className="lm-list">
              {c.next.items.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

          </section>
        </div>
      </div>

      <ArticleRecommendations exclude="proj-lumen" />

      <style>{`
        /* ── Signal-path flow (high-level pipeline; CSS so nothing overlaps) ── */
        .lm-flow { margin: 1.2rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px); border-radius: 18px;
          background: linear-gradient(165deg, var(--sa-panel-hi, rgba(20,22,38,0.7)), var(--sa-panel-lo, rgba(10,11,20,0.85)));
          border: 1px solid var(--sa-hairline, rgba(255,255,255,0.1)); }
        .lm-flow-track { display: grid; grid-template-columns: 1fr auto 1.3fr auto 1fr; align-items: stretch; gap: 6px; }
        .lm-flow-stage { display: flex; flex-direction: column; gap: 9px; min-width: 0; }
        .lm-flow-tag { font-size: 0.6rem; letter-spacing: 0.13em; text-transform: uppercase; color: #7a8398; font-family: var(--font-ddt, monospace); }
        .lm-flow-card { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 14px 15px; border-radius: 13px;
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 22%, rgba(255,255,255,0.1));
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 6%, rgba(255,255,255,0.015)); }
        .lm-flow-card.lit { border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 48%, transparent); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); }
        .lm-flow-card b { font-size: 0.92rem; color: #eef1f7; }
        .lm-flow-card span { font-size: 0.8rem; line-height: 1.5; color: #97a1b6; }
        .lm-flow-link { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 0 2px; align-self: center; }
        .lm-flow-pill { font-size: 0.64rem; font-family: var(--font-ddt, monospace); color: #b7e3c8; white-space: nowrap; }
        .lm-flow-ar { position: relative; width: 38px; height: 2px; border-radius: 2px;
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent); }
        .lm-flow-ar::after { content: ''; position: absolute; right: -1px; top: 50%; width: 7px; height: 7px;
          border-top: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent);
          border-right: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent);
          transform: translateY(-50%) rotate(45deg); }
        .lm-flow-foot { margin: 1rem 0 0; font-size: 0.82rem; line-height: 1.55; color: #8b94a8; text-align: center; }
        @media (max-width: 720px) {
          .lm-flow-track { grid-template-columns: 1fr; gap: 4px; }
          .lm-flow-link { flex-direction: column; padding: 6px 0; }
          .lm-flow-ar { width: 2px; height: 24px; }
          .lm-flow-ar::after { right: 50%; top: auto; bottom: -1px; transform: translateX(50%) rotate(135deg); }
        }

        /* ── Lists ── */
        /* Inherit the global .art-section ul gutter (li padding-left:20px) so the blue dot
           sits in the margin, not on the text. Only tweak the row gap here. */
        .lm-list { margin: 0.6rem 0 0.4rem; gap: 0.55rem; }
        .art-cap-note { font-size: 0.92rem; color: #aab4c8; }

        /* ── System prompt reveal (preview → fade → show more) ── */
        .lm-pr { margin: 1.1rem 0 1.3rem; }
        .lm-pr-head { display: flex; align-items: center; justify-content: space-between; gap: 9px 14px; flex-wrap: wrap; margin-bottom: 9px; }
        .lm-pr-eyebrow { font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #7a8398; font-family: var(--font-ddt, monospace); }
        .lm-pr-toggle { display: inline-flex; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); background: rgba(255,255,255,0.03); }
        .lm-pr-tab { font-family: inherit; font-size: 0.72rem; font-weight: 600; padding: 4px 13px; border: none; border-radius: 999px; background: transparent; color: #aab4c8; cursor: pointer; transition: color 0.2s, background 0.2s, transform 0.15s; }
        .lm-pr-tab:hover { color: #eef1f7; }
        .lm-pr-tab:active { transform: scale(0.96); }
        .lm-pr-tab.on { color: #08101e; background: var(--hp-sky, #7fa8ff); }
        .lm-pr-tab:focus-visible { outline: 2px solid var(--hp-sky, #7fa8ff); outline-offset: 2px; }
        .lm-pr-box { position: relative; border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); border-radius: 14px; background: rgba(0,0,0,0.3); overflow: hidden; }
        .lm-pr-content { max-height: 230px; overflow: hidden; transition: max-height 0.55s cubic-bezier(0.16,1,0.3,1); }
        .lm-pr.open .lm-pr-content { max-height: 9000px; overflow: visible; }
        .lm-pr-pre { margin: 0; padding: 16px;
          font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.78rem; line-height: 1.55; color: #c7d0e0; white-space: pre-wrap; word-break: break-word; }
        /* Formatted (rendered-markdown) view */
        .lm-pr-fmt { padding: 15px 17px; font-size: 0.84rem; line-height: 1.62; color: #c7d0e0; font-family: var(--font-dmsans, inherit); }
        .lm-pr-fmt > :first-child { margin-top: 0; }
        .lm-pr-h { margin: 18px 0 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: var(--hp-sky, #7fa8ff); }
        .lm-pr-p { margin: 7px 0; }
        .lm-pr-ol { margin: 7px 0; padding-left: 21px; }
        .lm-pr-ol > li { margin: 4px 0; }
        .lm-pr-ul { margin: 7px 0; padding-left: 4px; list-style: none; }
        .lm-pr-ul > li { position: relative; padding-left: 17px; margin: 5px 0; }
        .lm-pr-ul > li::before { content: ''; position: absolute; left: 2px; top: 0.62em; width: 5px; height: 5px; border-radius: 1px; background: var(--hp-sky, #7fa8ff); }
        .lm-pr-sub { margin: 5px 0; padding-left: 4px; list-style: none; }
        .lm-pr-sub > li { position: relative; padding-left: 15px; margin: 3px 0; color: #aab4c8; }
        .lm-pr-sub > li::before { content: ''; position: absolute; left: 1px; top: 0.66em; width: 6px; height: 1px; background: #6d768a; }
        .lm-pr-q { color: #e7ecf6; font-style: italic; }
        .lm-pr-arrow { color: var(--hp-sky, #7fa8ff); font-weight: 600; padding: 0 2px; }
        .lm-pr-ex { margin: 9px 0; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.015); }
        .lm-pr-ex-q { padding: 8px 12px; font-style: italic; color: #e7ecf6; background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 7%, transparent); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .lm-pr-ex-code { margin: 0; padding: 10px 12px; font-family: var(--font-ddt, ui-monospace, monospace); font-size: 0.73rem; line-height: 1.5; color: #b7e3c8; white-space: pre-wrap; word-break: break-word; }
        /* Collapsed preview dissolves into the field via a mask (no opaque fade slab) */
        .lm-pr:not(.open) .lm-pr-content {
          -webkit-mask-image: linear-gradient(180deg, #000 45%, transparent 97%);
          mask-image: linear-gradient(180deg, #000 45%, transparent 97%); }
        .lm-pr-fade { display: none; }
        .lm-pr-btn { display: inline-flex; align-items: center; gap: 7px; margin-top: 11px; padding: 8px 15px; cursor: pointer;
          border-radius: 999px; border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 40%, transparent);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 10%, transparent); color: var(--hp-sky, #7fa8ff);
          font-size: 0.82rem; font-weight: 600; transition: background 0.2s, color 0.2s, transform 0.15s; }
        .lm-pr-btn:hover { background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 18%, transparent); color: #fff; }
        .lm-pr-btn:active { transform: scale(0.97); }
        .lm-pr-btn:focus-visible { outline: 2px solid var(--hp-sky, #7fa8ff); outline-offset: 2px; }
        .lm-pr-btn svg { transition: transform 0.25s ease; }
        .lm-pr.open .lm-pr-btn svg { transform: rotate(180deg); }

        /* ── Numbered voice-pipeline steps ── */
        .lm-steps { margin: 0.8rem 0 0.4rem; padding: 0; list-style: none; counter-reset: lm-step; display: flex; flex-direction: column; gap: 0.6rem; }
        .lm-steps li { position: relative; counter-increment: lm-step; padding: 11px 14px 11px 52px; border-radius: 12px; line-height: 1.6;
          border: 1px solid var(--hp-line, rgba(255,255,255,0.08)); background: color-mix(in srgb, var(--hp-indigo, #5e79db) 6%, rgba(255,255,255,0.015)); }
        .lm-steps li::before { content: counter(lm-step); position: absolute; left: 12px; top: 10px; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center; border-radius: 8px; font-family: var(--font-ddt, monospace); font-size: 0.84rem; font-weight: 700;
          color: var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 14%, transparent); border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 35%, transparent); }
        .lm-steps b { color: #eef1f7; }

        /* ── Figma slide deck (decks are 16:9, not the .art-embed default) ── */
        .lm-deck { aspect-ratio: 16 / 9; }

        /* ── Demo video ── */
        .lm-demo { margin: 1.3rem 0 0.6rem; }
        .lm-demo video { width: 100%; height: auto; aspect-ratio: 16 / 9; display: block; border-radius: 14px; background: #000; border: 1px solid rgba(255,255,255,0.08); }
        .lm-demo figcaption { margin-top: 0.7rem; font-size: 0.86rem; color: #8b94a8; text-align: center; }

        /* ── Dashboard (tall portrait) figure ── */
        .lm-dash img { display: block; margin: 0 auto; max-height: 80vh; width: auto; border-radius: 12px; }

        /* ── Inline SVG diagrams ── */
        .lm-dia { width: 100%; box-sizing: border-box; margin: 1.2rem 0 0.6rem; padding: clamp(16px, 2.4vw, 26px); border-radius: 18px;
          background: linear-gradient(165deg, var(--sa-panel-hi, rgba(20,22,38,0.7)), var(--sa-panel-lo, rgba(10,11,20,0.85)));
          border: 1px solid var(--sa-hairline, rgba(255,255,255,0.1)); overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .lm-dia svg { width: 100%; height: auto; display: block; }
        /* On phones, both inline diagrams reflow to native layouts (see .lm-fc-m / .lm-hw-m)
           instead of shrinking the SVG or scrolling it sideways */
        @media (max-width: 640px) {
          .lm-dia { padding: 14px; }
          .lm-dia > svg { display: none; }
        }
        .lm-dia .d-box { fill: rgba(255,255,255,0.03); stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 30%, rgba(255,255,255,0.12)); }
        .lm-dia .d-box.accent { fill: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); stroke: var(--hp-sky, #7fa8ff); }
        .lm-dia .d-box.warm { fill: rgba(245,201,122,0.08); stroke: rgba(245,201,122,0.55); }
        .lm-dia .d-box.note { fill: color-mix(in srgb, var(--hp-sky, #7fa8ff) 5%, transparent); stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 30%, rgba(255,255,255,0.1)); stroke-dasharray: 5 4; }
        .lm-dia .d-t { fill: #e8edf6; font-size: 13px; font-weight: 600; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-s { fill: #97a1b6; font-size: 10.5px; font-family: var(--font-dmsans, sans-serif); }
        .lm-dia .d-line { stroke: color-mix(in srgb, var(--hp-sky, #7fa8ff) 45%, rgba(255,255,255,0.2)); stroke-width: 1.6; fill: none; }
        .lm-dia .d-line.dash { stroke-dasharray: 4 4; opacity: 0.7; }
        .lm-dia .d-chip { fill: #b7e3c8; font-size: 11px; font-family: var(--font-ddt, monospace); }
        .lm-dia-cap { font-size: 0.86rem; color: #8b94a8; text-align: center; margin-top: 0.7rem; }

        /* ── Command flowchart: native top-to-bottom reflow for phones (replaces the scrolling SVG) ── */
        .lm-fc-m { display: none; }
        .lm-hw-m { display: none; }
        @media (max-width: 640px) {
          .lm-fc-m { display: flex; flex-direction: column; align-items: stretch; }
          .lm-hw-m { display: flex; flex-direction: column; gap: 14px; }
        }
        .lm-fc-node { position: relative; border-radius: 14px; padding: 15px 17px; text-align: center;
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 26%, rgba(255,255,255,0.12));
          background: rgba(255,255,255,0.035); }
        .lm-fc-node b { display: block; font-size: 0.96rem; font-weight: 600; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); line-height: 1.35; }
        .lm-fc-node span { display: block; margin-top: 5px; font-size: 0.81rem; line-height: 1.5; color: #97a1b6; }
        .lm-fc-node .lm-fc-badge { display: inline-block; margin-top: 10px; padding: 3px 11px; border-radius: 999px;
          font-size: 0.64rem; letter-spacing: 0.09em; text-transform: uppercase; font-family: var(--font-ddt, monospace);
          color: var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 13%, transparent);
          border: 1px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 34%, transparent); }
        .lm-fc-node .lm-fc-badge::before { content: '🌐'; margin-right: 5px; font-size: 0.72rem; }
        .lm-fc-node.accent { background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 70%, transparent); }
        .lm-fc-node.accent b { color: #dce7ff; }
        .lm-fc-node.warm { background: rgba(245,201,122,0.08); border-color: rgba(245,201,122,0.5); }
        .lm-fc-node.warm b { color: #f3d9a6; }
        .lm-fc-node.dec { border-style: dashed; border-color: color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 7%, transparent); }
        .lm-fc-node.dec b { color: var(--hp-sky, #7fa8ff); }

        /* vertical connector: line + down-arrow, with an optional centered chip label */
        .lm-fc-conn { position: relative; height: 42px; }
        .lm-fc-conn.sm { height: 32px; }
        .lm-fc-conn::before { content: ''; position: absolute; left: 50%; top: -1px; bottom: 6px; width: 2px; transform: translateX(-50%);
          background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 42%, rgba(255,255,255,0.16)); }
        .lm-fc-conn::after { content: ''; position: absolute; left: 50%; bottom: 4px; width: 7px; height: 7px;
          border-right: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 52%, rgba(255,255,255,0.2));
          border-bottom: 2px solid color-mix(in srgb, var(--hp-sky, #7fa8ff) 52%, rgba(255,255,255,0.2));
          transform: translate(-50%, 0) rotate(45deg); }
        .lm-fc-conn i { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -58%); white-space: nowrap;
          padding: 2px 11px; border-radius: 999px; font-style: normal; font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-ddt, monospace); color: #b7e3c8; background: #0d0f1a; border: 1px solid rgba(255,255,255,0.09); }

        /* the failure branch: a clearly self-contained, dimmer side path */
        .lm-fc-branch { display: flex; flex-direction: column; align-items: stretch; padding: 14px 14px 16px;
          border-radius: 14px; border: 1px dashed rgba(245,201,122,0.4); background: rgba(245,201,122,0.045); }
        .lm-fc-blabel { align-self: flex-start; margin-bottom: 13px; padding: 3px 10px; border-radius: 999px;
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-ddt, monospace);
          color: #f3d9a6; background: rgba(245,201,122,0.12); border: 1px solid rgba(245,201,122,0.32); }
        .lm-fc-branch .lm-fc-conn::before { background: rgba(245,201,122,0.45); }
        .lm-fc-branch .lm-fc-conn::after { border-color: rgba(245,201,122,0.5); }

        /* the three command outcomes */
        .lm-fc-outs { display: flex; flex-direction: column; gap: 9px; }
        .lm-fc-out { display: flex; align-items: baseline; gap: 11px; padding: 12px 15px; border-radius: 12px;
          border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); background: rgba(255,255,255,0.025); }
        .lm-fc-out::before { content: ''; flex: none; align-self: center; width: 7px; height: 7px; border-radius: 2px;
          background: var(--hp-sky, #7fa8ff); box-shadow: 0 0 8px color-mix(in srgb, var(--hp-sky, #7fa8ff) 55%, transparent); }
        .lm-fc-out b { flex: none; min-width: 62px; text-align: left; font-size: 0.86rem; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); }
        .lm-fc-out span { font-size: 0.78rem; line-height: 1.4; color: #97a1b6; }

        /* ── Hardware map: native pin-list reflow for phones (replaces the scrolling wiring SVG) ── */
        .lm-hw-core { text-align: center; padding: 14px 16px; border-radius: 14px;
          border: 1px solid var(--hp-sky, #7fa8ff); background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 12%, transparent); }
        .lm-hw-core b { display: block; font-size: 1rem; letter-spacing: 0.02em; color: #dce7ff; font-family: var(--font-dmsans, sans-serif); }
        .lm-hw-core span { display: block; margin-top: 3px; font-size: 0.79rem; color: #9fb2dd; }
        .lm-hw-group { border: 1px solid var(--hp-line, rgba(255,255,255,0.1)); border-radius: 14px; background: rgba(255,255,255,0.02); overflow: hidden; }
        .lm-hw-glabel { display: flex; align-items: center; gap: 8px; padding: 10px 15px; font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase;
          font-family: var(--font-ddt, monospace); color: #8b94a8; background: rgba(255,255,255,0.025); border-bottom: 1px solid var(--hp-line, rgba(255,255,255,0.08)); }
        .lm-hw-glabel::before { content: ''; width: 7px; height: 7px; border-radius: 2px; background: var(--hp-sky, #7fa8ff); flex: none; }
        .lm-hw-group.out .lm-hw-glabel::before { background: #5ad6a0; }
        .lm-hw-group.bus .lm-hw-glabel::before { background: #b79bff; }
        .lm-hw-row { display: flex; align-items: center; gap: 12px; padding: 11px 15px; }
        .lm-hw-row + .lm-hw-row { border-top: 1px solid rgba(255,255,255,0.05); }
        .lm-hw-row > div { flex: 1; min-width: 0; }
        .lm-hw-row b { display: block; font-size: 0.88rem; color: #eef1f7; font-family: var(--font-dmsans, sans-serif); }
        .lm-hw-row span { display: block; margin-top: 1px; font-size: 0.76rem; line-height: 1.4; color: #97a1b6; }
        .lm-hw-pin { flex: none; padding: 4px 10px; border-radius: 8px; font-size: 0.72rem; font-family: var(--font-ddt, monospace);
          color: #b7e3c8; background: color-mix(in srgb, var(--hp-sky, #7fa8ff) 9%, rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.1); white-space: nowrap; }
      `}</style>
    </main>
  );
}

/* ───────────────────────── Diagrams ───────────────────────── */

function SignalPath({ t }: { t: LumenCopy['flow'] }) {
  const [esp, server, room] = t.stages;
  return (
    <figure className="lm-flow" data-no-zoom>
      <div className="lm-flow-track">
        <div className="lm-flow-stage">
          <span className="lm-flow-tag">{esp.tag}</span>
          <div className="lm-flow-card">
            <b>{esp.title}</b>
            <span>{esp.text}</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">{t.links[0]}</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">{server.tag}</span>
          <div className="lm-flow-card lit">
            <b>{server.title}</b>
            <span>{server.text}</span>
          </div>
        </div>

        <div className="lm-flow-link">
          <span className="lm-flow-pill">{t.links[1]}</span>
          <i className="lm-flow-ar" aria-hidden="true" />
        </div>

        <div className="lm-flow-stage">
          <span className="lm-flow-tag">{room.tag}</span>
          <div className="lm-flow-card">
            <b>{room.title}</b>
            <span>{room.text}</span>
          </div>
        </div>
      </div>
      <figcaption className="lm-flow-foot">{t.caption}</figcaption>
    </figure>
  );
}

/* The command types are the JSON's own `type` values, so they stay as code; `outcomes` in the copy
   says what each one does, in this order. */
const TYPES = ['action', 'sequence', 'timer'] as const;

function CommandFlowchart({ t }: { t: LumenCopy['chart'] }) {
  const [action, sequence, timer] = TYPES;
  return (
    <figure className="lm-dia lm-fc" data-no-zoom>
      <svg viewBox="0 0 840 445" role="img" aria-label={t.aria}>
        <defs>
          <marker id="lm-fc-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--hp-sky, #7fa8ff)" fillOpacity="0.7" />
          </marker>
        </defs>

        {/* ─ Input node ─ */}
        <rect className="d-box" x="180" y="16" width="360" height="52" rx="10" />
        <text className="d-t" x="360" y="38" textAnchor="middle">{t.input.t}</text>
        <text className="d-s" x="360" y="56" textAnchor="middle">{t.input.s}</text>

        {/* Multilingual annotation on the input */}
        <line className="d-line dash" x1="540" y1="42" x2="586" y2="42" />
        <rect className="d-box note" x="588" y="20" width="232" height="46" rx="10" />
        <text className="d-t" x="601" y="40" style={{fontSize: 12}}>{t.note.t}</text>
        <text className="d-s" x="601" y="56">{t.note.s}</text>

        {/* Arrow: input → DeepSeek */}
        <line className="d-line" x1="360" y1="68" x2="360" y2="95" markerEnd="url(#lm-fc-arr)" />

        {/* ─ DeepSeek LLM node ─ */}
        <rect className="d-box accent" x="205" y="97" width="310" height="52" rx="10" />
        <text className="d-t" x="360" y="119" textAnchor="middle">{t.llm.t}</text>
        <text className="d-s" x="360" y="137" textAnchor="middle">{t.llm.s}</text>

        {/* Arrow: DeepSeek → diamond, with label */}
        <line className="d-line" x1="360" y1="149" x2="360" y2="171" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="368" y="164">JSON</text>

        {/* ─ Decision diamond: schema valid? ─
            Center (360, 215); vertices: top (360,173) right (465,215) bottom (360,257) left (255,215) */}
        <polygon className="d-box" points="255,215 360,173 465,215 360,257" />
        <text className="d-t" x="360" y="210" textAnchor="middle" style={{fontSize: 12}}>{t.valid[0]}</text>
        <text className="d-t" x="360" y="226" textAnchor="middle" style={{fontSize: 12}}>{t.valid[1]}</text>

        {/* Yes: arrow down from diamond bottom */}
        <line className="d-line" x1="360" y1="257" x2="360" y2="285" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="368" y="275">{t.yes}</text>

        {/* ─ Route by type node ─ */}
        <rect className="d-box" x="200" y="287" width="320" height="48" rx="10" />
        <text className="d-t" x="360" y="307" textAnchor="middle">{t.route.t}</text>
        <text className="d-s" x="360" y="323" textAnchor="middle">{t.route.s}</text>

        {/* Three branch lines from route box bottom */}
        <path className="d-line" d="M 310 335 L 115 370" markerEnd="url(#lm-fc-arr)" />
        <line className="d-line" x1="360" y1="335" x2="360" y2="370" markerEnd="url(#lm-fc-arr)" />
        <path className="d-line" d="M 415 335 L 605 370" markerEnd="url(#lm-fc-arr)" />

        {/* Branch type labels */}
        <text className="d-chip" x="198" y="360" textAnchor="middle">{action}</text>
        <text className="d-chip" x="360" y="358" textAnchor="middle">{sequence}</text>
        <text className="d-chip" x="519" y="360" textAnchor="middle">{timer}</text>

        {/* ─ Outcome boxes ─ */}
        <rect className="d-box" x="20" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="115" y="392" textAnchor="middle">{action}</text>
        <text className="d-s" x="115" y="408" textAnchor="middle">{t.outcomes[0]}</text>

        <rect className="d-box" x="265" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="360" y="392" textAnchor="middle">{sequence}</text>
        <text className="d-s" x="360" y="408" textAnchor="middle">{t.outcomes[1]}</text>

        <rect className="d-box" x="510" y="370" width="190" height="52" rx="10" />
        <text className="d-t" x="605" y="392" textAnchor="middle">{timer}</text>
        <text className="d-s" x="605" y="408" textAnchor="middle">{t.outcomes[2]}</text>

        {/* No: arrow right from diamond to retry */}
        <line className="d-line" x1="465" y1="215" x2="558" y2="215" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="493" y="208">{t.no}</text>

        {/* ─ Retry node ─ */}
        <rect className="d-box" x="560" y="189" width="155" height="52" rx="10" />
        <text className="d-t" x="637" y="211" textAnchor="middle">{t.retry.t}</text>
        <text className="d-s" x="637" y="227" textAnchor="middle">{t.retry.s}</text>

        {/* Fails arrow: retry → no-op */}
        <line className="d-line" x1="637" y1="241" x2="637" y2="269" markerEnd="url(#lm-fc-arr)" />
        <text className="d-chip" x="645" y="259">{t.fails}</text>

        {/* ─ Safe no-op node ─ */}
        <rect className="d-box warm" x="560" y="271" width="155" height="52" rx="10" />
        <text className="d-t" x="637" y="293" textAnchor="middle">{t.noop.t}</text>
        <text className="d-s" x="637" y="309" textAnchor="middle">{t.noop.s}</text>
      </svg>

      {/* Phone layout: the same flow, reflowed top-to-bottom so nothing shrinks, scrolls, or overlaps */}
      <div className="lm-fc-m">
        <div className="lm-fc-node">
          <b>{t.input.t}</b>
          <span>{t.input.s}</span>
          <span className="lm-fc-badge">{t.badge}</span>
        </div>

        <div className="lm-fc-conn" />

        <div className="lm-fc-node accent">
          <b>{t.llm.t}</b>
          <span>{t.llm.s}</span>
        </div>

        <div className="lm-fc-conn"><i>JSON</i></div>

        <div className="lm-fc-node dec">
          <b>{t.validOne}</b>
        </div>

        <div className="lm-fc-conn sm"><i>{t.ifInvalid}</i></div>

        <div className="lm-fc-branch">
          <span className="lm-fc-blabel">{t.failurePath}</span>
          <div className="lm-fc-node">
            <b>{t.retry.t}</b>
            <span>{t.retry.phone}</span>
          </div>
          <div className="lm-fc-conn sm"><i>{t.stillFails}</i></div>
          <div className="lm-fc-node warm">
            <b>{t.noop.t}</b>
            <span>{t.noop.phone}</span>
          </div>
        </div>

        <div className="lm-fc-conn"><i>{t.ifValid}</i></div>

        <div className="lm-fc-node">
          <b>{t.route.t}</b>
          <span>{t.route.s}</span>
        </div>

        <div className="lm-fc-conn"><i>{t.byType}</i></div>

        <div className="lm-fc-outs">
          {TYPES.map((type, i) => <div className="lm-fc-out" key={type}><b>{type}</b><span>{t.outcomes[i]}</span></div>)}
        </div>
      </div>

      <figcaption className="lm-dia-cap">{t.caption}</figcaption>
    </figure>
  );
}

/* The wiring: each part's id (its name and role are in the copy's hub.parts) and the pins it uses. */
type Part = keyof LumenCopy['hub']['parts'];
const LEFT: [Part, string][] = [['mic', 'G14, 23, 32'], ['dht', 'G4'], ['pir', 'G35'], ['ldr', 'G34'], ['ptt', 'G19']];
const RIGHT: [Part, string][] = [['led', 'G25'], ['neo', 'G27'], ['fan', 'G26'], ['servo', 'G13'], ['buzzer', 'G33'], ['rec', 'G17']];
const BOTTOM: [Part, string][] = [['oled', 'I2C'], ['wake', 'I2C'], ['navA', 'G18'], ['navB', 'G16']];

function HardwareHub({ t }: { t: LumenCopy['hub'] }) {
  return (
    <figure className="lm-dia lm-hw" data-no-zoom>
      <svg viewBox="0 0 960 600" role="img" aria-label={t.aria}>
        <text className="d-s" x="20" y="26">{t.inputs}</text>
        <text className="d-s" x="772" y="26" textAnchor="end">{t.outputs}</text>
        <text className="d-s" x="20" y="480">{t.bus}</text>

        {/* ESP32 centre */}
        <rect className="d-box accent" x="392" y="250" width="176" height="118" rx="16" />
        <text className="d-t" x="480" y="298" textAnchor="middle" style={{ fontSize: 17 }}>{t.core.t}</text>
        <text className="d-s" x="480" y="320" textAnchor="middle">{t.core.s[0]}</text>
        <text className="d-s" x="480" y="338" textAnchor="middle">{t.core.s[1]}</text>

        {LEFT.map(([id, p], i) => {
          const y = 44 + i * 70;
          const ty = 268 + i * 22;
          return (
            <g key={id}>
              <path className="d-line" d={`M252 ${y + 26} C 322 ${y + 26}, 334 ${ty}, 392 ${ty}`} />
              <text className="d-chip" x="306" y={(y + 26 + ty) / 2 - 5} textAnchor="middle">{p}</text>
              <rect className="d-box" x="20" y={y} width="232" height="52" rx="10" />
              <text className="d-t" x="36" y={y + 22}>{t.parts[id].n}</text>
              <text className="d-s" x="36" y={y + 40}>{t.parts[id].s}</text>
            </g>
          );
        })}

        {RIGHT.map(([id, p], i) => {
          const y = 44 + i * 58;
          const ty = 262 + i * 18;
          return (
            <g key={id}>
              <path className="d-line" d={`M708 ${y + 26} C 638 ${y + 26}, 628 ${ty}, 568 ${ty}`} />
              <text className="d-chip" x="654" y={(y + 26 + ty) / 2 - 5} textAnchor="middle">{p}</text>
              <rect className="d-box" x="708" y={y} width="232" height="52" rx="10" />
              <text className="d-t" x="724" y={y + 22}>{t.parts[id].n}</text>
              <text className="d-s" x="724" y={y + 40}>{t.parts[id].s}</text>
            </g>
          );
        })}

        {BOTTOM.map(([id, p], j) => {
          const x = 20 + j * 240;
          const cx = x + 110;
          const tx = 410 + j * 46;
          return (
            <g key={id}>
              <path className="d-line" d={`M${cx} 502 C ${cx} 440, ${tx} 430, ${tx} 368`} />
              <text className="d-chip" x={cx} y="497" textAnchor="middle">{p}</text>
              <rect className="d-box" x={x} y="502" width="220" height="56" rx="10" />
              <text className="d-t" x={x + 16} y="526">{t.parts[id].n}</text>
              <text className="d-s" x={x + 16} y="544">{t.parts[id].s}</text>
            </g>
          );
        })}
      </svg>

      {/* Phone layout: the same wiring as a grouped pin list, no shrinking or sideways scroll */}
      <div className="lm-hw-m">
        <div className="lm-hw-core">
          <b>{t.core.phone}</b>
          <span>{t.core.phoneS}</span>
        </div>
        <div className="lm-hw-group">
          <span className="lm-hw-glabel">{t.inputs}</span>
          {LEFT.map(([id, p]) => (
            <div className="lm-hw-row" key={id}>
              <div><b>{t.parts[id].n}</b><span>{t.parts[id].s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
        <div className="lm-hw-group out">
          <span className="lm-hw-glabel">{t.outputs}</span>
          {RIGHT.map(([id, p]) => (
            <div className="lm-hw-row" key={id}>
              <div><b>{t.parts[id].n}</b><span>{t.parts[id].s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
        <div className="lm-hw-group bus">
          <span className="lm-hw-glabel">{t.bus}</span>
          {BOTTOM.map(([id, p]) => (
            <div className="lm-hw-row" key={id}>
              <div><b>{t.parts[id].n}</b><span>{t.parts[id].s}</span></div>
              <span className="lm-hw-pin">{p}</span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="lm-dia-cap">{t.caption}</figcaption>
    </figure>
  );
}
