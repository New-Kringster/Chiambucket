import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import WaterslopChapter, { WaterslopChapterStyle } from './WaterslopChapter';
import { Cover, Page, type Frame } from './Story';
import { words } from './words';
import DrumNetStory from './DrumNetWalk';
import FirmwareChapter from './ReadCycle';
import CameraChapter from './FocusLab';
import ConfigKingChapter from './ConfigKingStory';
import PairCompare from './Compare';
import { LoopRing, AgentBadges } from './Agents';
import PageFx from './PageFx';
import Entrance from './Entrance';
import SkipToEnd from './SkipToEnd';
import { UiProvider } from './UiContext';
import { loadWaterslopCopy, type WaterslopCopy } from './_copy';
import PdfEmbed from '../../components/PdfEmbed';
import { IcRead, IcOut } from '../../components/Icons';
import AiMark from '../../components/AiMark';
import { fill } from '@/lib/fill';
import { HTML_LANG, type Lang } from '@/lib/i18n';
import './waterslop.css';
import './article.css';
import './story.css';

/* The OCR Reader article, shared by /waterslop and /{lang}/waterslop. Its words
   are the page's copy (_copy/<lang>.tsx), loaded here for the page's language;
   this file keeps the images, ids, hrefs and layout. Client widgets get their
   words as props, and the chapter engine's chrome through UiProvider. */

/* The report, a PDF hosted with the site (public/downloadable; .vercelignore
   lets this one PDF through). It used to be a OneDrive embed, which stopped
   opening for anyone not signed in. */
const REPORT_PDF = '/downloadable/ocr-reader-report.pdf';

export function waterslopJsonLd(c: WaterslopCopy, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/waterslop/og.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: 'https://www.chiambucket.com/waterslop',
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };
}

const I = '/images/waterslop/';
const img = (src: string, alt: string, cls?: string) => <img src={I + src} alt={alt} loading="lazy" decoding="async" className={cls} />;
const pair = (a: string, b: string, alt: string[], cls?: string) => (
  <div className={`ws-pair${cls ? ` ${cls}` : ''}`}>{img(a, alt[0])}{img(b, alt[1])}</div>
);
/* a cover's contents: the copy's labels, in order, against their frame ids */
const toc = (labels: string[], hrefs: string[]) => labels.map((label, i) => ({ label, href: hrefs[i] }));
/* big figures; `red` marks the ones in the accent */
const bignum = (items: Array<{ value: string; label: string; note: string }>, red: number[]) => (
  <div className="ws-bignum">
    {items.map((it, i) => <div key={i}><b className={red.includes(i) ? 'red' : undefined}>{it.value}</b><span>{it.label}</span><small>{it.note}</small></div>)}
  </div>
);

/* Chapters, in order. The PCB chapter is the exported 3D chapter plus two
   pages of its own; the roman numeral is shared. */
const CHAPTERS = ['v2', 'drumnet', 'configking', 'metersim', 'simgen2', 'agents', 'firmware', 'power', 'camera', 'proto', 'conclusion', 'report'] as const;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const NUM: Record<string, string> = Object.fromEntries(CHAPTERS.map((id, i) => [id, ROMAN[i]]));

const Contents = ({ c }: { c: WaterslopCopy }) => (
  <nav className="ws-contents article-chapter-wrapper" aria-label={c.hero.contentsAria}>
    {CHAPTERS.map((id) => <a key={id} href={`#${id}`}><span>{c.chapters[id]}</span><i /><span>({NUM[id]})</span></a>)}
  </nav>
);

/* ── Chapter IV: MeterSim ── */
const metersim = (c: WaterslopCopy['metersim']): Frame[] => {
  const r = c.rows;
  return [
    { id: 'ms-rig', ...words(r['ms-rig']), visual: img('v05-rig-a.webp', r['ms-rig'].alt) },
    { id: 'ms-control', ...words(r['ms-control']), visual: img('metersim-control.webp', r['ms-control'].alt) },
    { id: 'ms-designs', ...words(r['ms-designs']), visual: pair('metersim-designs.webp', 'metersim-presets.webp', r['ms-designs'].alt) },
    { id: 'ms-halfroll', ...words(r['ms-halfroll']), visual: img('metersim-halfroll.webp', r['ms-halfroll'].alt) },
    { id: 'ms-effects', ...words(r['ms-effects']), visual: img('metersim-effects.webp', r['ms-effects'].alt) },
    { id: 'ms-eval', ...words(r['ms-eval']), visual: pair('metersim-display-rig.webp', 'v05-rig-b.webp', r['ms-eval'].alt) },
  ];
};

/* ── Chapter V: SimGen2 ── */
const simgen2 = (c: WaterslopCopy['simgen2']): Frame[] => {
  const r = c.rows;
  return [
    {
      id: 'sg-stages', ...words(r['sg-stages']), wide: true,
      visual: (
        <div className="ws-stages">
          {img('simgen2-stages.webp', r['sg-stages'].alt)}
          <ol>{c.stages.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ol>
        </div>
      ),
    },
    { id: 'sg-overlay', ...words(r['sg-overlay']), visual: img('simgen2-overlay.webp', r['sg-overlay'].alt) },
    { id: 'sg-pairs', ...words(r['sg-pairs']), visual: <PairCompare t={c.compare} /> },
  ];
};

/* ── Chapter VI: the agents ── */
const agentic = (c: WaterslopCopy['agents']): Frame[] => {
  const r = c.rows;
  return [
    { id: 'ag-loop', ...words(r['ag-loop']), visual: <LoopRing t={c.loop} /> },
    { id: 'ag-six', ...words(r['ag-six']), wide: true, visual: <AgentBadges t={c.badges} /> },
    {
      id: 'ag-resources', ...words(r['ag-resources']),
      visual: (
        <div className="ws-pair stackv">
          {img('agents-resources-sketch.webp', r['ag-resources'].alt[0], 'plate')}
          {img('scheduler-compute.webp', r['ag-resources'].alt[1])}
        </div>
      ),
    },
    { id: 'ag-t3', ...words(r['ag-t3']), visual: img('t3-tailscale.webp', r['ag-t3'].alt, 'plate') },
  ];
};

/* ── Chapter VIII: power ── */
const MODES: Array<{ src: string; res: string; ox: number; oy: number; on?: boolean }> = [
  { src: 'mode-1600-full.webp', res: '1600 × 1200', ox: 57, oy: 41 },
  { src: 'mode-800-crop.webp', res: '800 × 600', ox: 58, oy: 41, on: true },
  { src: 'mode-400-crop.webp', res: '400 × 296', ox: 57, oy: 40 },
];
/* the hardware list: which entries are lit */
const HW_ON = [true, false, false, true];
const power = (c: WaterslopCopy['power']): Frame[] => {
  const r = c.rows;
  return [
    { id: 'pw-sub', ...words(r['pw-sub']), visual: pair('ov2640-svga.webp', 'ov2640-cif.webp', r['pw-sub'].alt, 'plate') },
    {
      id: 'pw-modes', ...words(r['pw-modes']), wide: true,
      visual: (
        <div className="ws-modes" data-no-zoom>
          {MODES.map((m, i) => (
            <figure key={m.res} className={m.on ? 'on' : undefined}>
              <img className="full" src={I + m.src} alt={fill(c.modeAlt, { res: m.res })} loading="lazy" decoding="async" />
              <div className="drums" role="img" aria-label={fill(c.drumsAria, { res: m.res })} style={{ backgroundImage: `url(${I + m.src})`, ['--ox' as string]: `${m.ox}%`, ['--oy' as string]: `${m.oy}%` }} />
              <figcaption><b>{m.res}</b><span>{c.modes[i].time} · {c.modes[i].note}</span></figcaption>
            </figure>
          ))}
        </div>
      ),
    },
    { id: 'pw-pwm', ...words(r['pw-pwm']), visual: pair('led-banding.webp', 'led-no-banding.webp', r['pw-pwm'].alt) },
    { id: 'pw-grey', ...words(r['pw-grey']), visual: pair('cam-grey.webp', 'cam-colour.webp', r['pw-grey'].alt) },
    { id: 'pw-int8', ...words(r['pw-int8']), visual: bignum(c.int8, [1]) },
    {
      id: 'pw-hw', ...words(r['pw-hw']),
      visual: (
        <div className="ws-spec-list">
          {c.hardware.map((h, i) => <div key={i} className={HW_ON[i] ? 'on' : undefined}><b>{h.name}</b><span>{h.note}</span></div>)}
        </div>
      ),
    },
  ];
};

/* ── Chapter X: Prototype V2 and the enclosure, the written detail behind the 3D chapter ── */
const ENC_PICS: Array<[string, string?]> = [['enc-reference.webp', 'plate'], ['enc-final.webp'], ['adapter-distance.webp', 'plate'], ['adapter-done-b.webp']];
const v2 = (c: WaterslopCopy['proto']): Frame[] => [
  { id: 'v2-intro', ...words(c.rows['v2-intro']), visual: img('pcb-3d-top.webp', c.rows['v2-intro'].alt) },
  { id: 'v2-size', ...words(c.rows['v2-size']), visual: img('v2-vs-devboard.webp', c.rows['v2-size'].alt) },
];
const enclosure = (c: WaterslopCopy['proto']): Frame[] => [
  {
    id: 'en-all', ...words(c.rows['en-all']),
    visual: (
      <div className="ws-quad">
        {c.rows['en-all'].figures.map((f, i) => <figure key={i}>{img(ENC_PICS[i][0], f.alt, ENC_PICS[i][1])}<figcaption>{f.caption}</figcaption></figure>)}
      </div>
    ),
  },
];

/* ── Chapter XI: conclusion ── */
const conclusion = (c: WaterslopCopy['conclusion']): Frame[] => [
  { id: 'cc-all', ...words(c.row), visual: bignum(c.figures, [0]) },
];

export default async function WaterslopArticle({ lang }: { lang: Lang }) {
  const c = await loadWaterslopCopy(lang);
  const cv = { metersim: c.metersim.cover, simgen2: c.simgen2.cover, agents: c.agents.cover, power: c.power.cover, proto: c.proto.cover, conclusion: c.conclusion.cover };
  return (
    <UiProvider ui={c.ui}>
    <main className="ws-page art-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(waterslopJsonLd(c, lang)) }} />
      <ArticleScrollSpy />
      <Entrance caption={c.entrance} />
      <PageFx />
      <SkipToEnd t={c.skip} />

      <header className="ws-hero">
        <div className="ws-hero-photo" aria-hidden="true"><img src={I + 'hero.webp'} alt="" /></div>
        <div className="ws-hero-label">{c.hero.label}<small>{c.hero.labelSub}</small></div>
        <div className="ws-wrap">
          <div className="ws-hero-copy">
            <h1>{c.hero.title.map((w) => <span key={w}>{w}</span>)}</h1>
            <p className="ws-hero-lead">{c.hero.lead}</p>
            <AiMark project="proj-waterslop" />
            <Contents c={c} />
            <div className="ws-hero-actions">
              <a className="ws-btn" href="#v2"><IcRead /> {c.hero.start}</a>
              <a className="ws-btn ghost" href={REPORT_PDF} target="_blank" rel="noopener"><IcOut /> {c.hero.report}</a>
              <span className="ws-hero-meta">{c.hero.meta}</span>
            </div>
          </div>
        </div>
      </header>

      {/* One flow, no covers between: the 3D board and enclosure, which ends by
          pointing the reader at the meter and taking a photo; DrumNet reading that
          photo; then ConfigKing showing the same reading on the setup tool. */}
      <section id="v2" className="ws-pcb" aria-label={c.pcb.aria}>
        <WaterslopChapter labels={{ dash: fill(c.ui.chapterDash, { n: NUM.v2 }), colon: fill(c.pcb.chapterColon, { n: NUM.v2 }), name: c.pcb.name }} />
        <WaterslopChapterStyle />
      </section>
      <DrumNetStory chapter={NUM.drumnet} t={c.film} />
      <ConfigKingChapter chapter={NUM.configking} t={c.configking} />

      <Cover id="metersim" chapter={NUM.metersim} title={cv.metersim.title} lines={cv.metersim.lines} contents={toc(cv.metersim.contents, ['#ms-rig', '#ms-control', '#ms-designs', '#ms-halfroll', '#ms-effects', '#ms-eval'])}
        bg="metersim-key.webp" focus={[0.62, 0.5]} lede={cv.metersim.lede} />
      <Page id="metersim-body" title={c.metersim.page} rows={metersim(c.metersim)} />

      <Cover id="simgen2" chapter={NUM.simgen2} title={cv.simgen2.title} lines={cv.simgen2.lines} contents={toc(cv.simgen2.contents, ['#sg-stages', '#sg-overlay', '#sg-pairs'])}
        bg="simgen2-overlay.webp" focus={[0.55, 0.55]} lede={cv.simgen2.lede} />
      <Page id="simgen2-body" title={c.simgen2.page} rows={simgen2(c.simgen2)} />

      <Cover id="agents" chapter={NUM.agents} title={cv.agents.title} lines={cv.agents.lines} contents={toc(cv.agents.contents, ['#ag-loop', '#ag-six', '#ag-resources', '#ag-t3'])}
        bg="scheduler-compute.webp" focus={[0.45, 0.4]} lede={cv.agents.lede} />
      <Page id="agents-body" title={c.agents.page} rows={agentic(c.agents)} />

      <FirmwareChapter chapter={NUM.firmware} t={c.firmware} />

      <Cover id="power" chapter={NUM.power} title={cv.power.title} lines={cv.power.lines} contents={toc(cv.power.contents, ['#pw-sub', '#pw-modes', '#pw-pwm', '#pw-grey', '#pw-int8', '#pw-hw'])}
        bg="mode-1600-full.webp" focus={[0.55, 0.62]} lede={cv.power.lede} />
      <Page id="power-body" title={c.power.page} rows={power(c.power)} />

      <CameraChapter chapter={NUM.camera} t={c.camera} />

      <Cover id="proto" chapter={NUM.proto} title={cv.proto.title} lines={cv.proto.lines} contents={toc(cv.proto.contents, ['#v2-intro', '#v2-size', '#en-all'])}
        bg="v2-vs-devboard.webp" lede={cv.proto.lede} />
      <Page id="v2-body" title={c.proto.page} rows={v2(c.proto)} />
      <Page id="enclosure" title={c.proto.enclosurePage} rows={enclosure(c.proto)} />

      <Cover id="conclusion" chapter={NUM.conclusion} title={cv.conclusion.title} lines={cv.conclusion.lines} contents={toc(cv.conclusion.contents, ['#cc-all', '#report'])}
        bg="adapter-done-b.webp" lede={cv.conclusion.lede} />
      <Page id="conclusion-body" title={c.conclusion.page} rows={conclusion(c.conclusion)} />

      <section id="report" className="ws-plain">
        <div className="ws-wrap">
          <div className="ws-content">
            <span className="ws-sec-n">{fill(c.ui.chapterDash, { n: NUM.report })}</span>
            <h2 className="ws-report-h2">{c.report.title}</h2>
            {REPORT_PDF ? (
              <div className="ws-report-frame">
                <PdfEmbed src={REPORT_PDF} title={c.report.frameTitle} />
              </div>
            ) : null}
            <div className="ws-report-card">
              <div className="ws-report-text">
                <b>{c.report.name}</b>
                <span>{c.report.about}</span>
              </div>
              <a className="ws-btn" href={REPORT_PDF} target="_blank" rel="noopener"><IcOut /> {c.report.open}</a>
            </div>
            <p className="ws-note ws-report-note">{c.report.note}</p>
          </div>
        </div>
      </section>

      <ArticleRecommendations exclude="proj-waterslop" />
    </main>
    </UiProvider>
  );
}
