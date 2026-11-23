/* The Pip article, rendered in any language: the English page (page.tsx) and
   app/[lang]/pip/page.tsx both render it. Its words come from ./_copy. */
import localFont from 'next/font/local';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import AiMark from '../../components/AiMark';
import { IcRead } from '../../components/Icons';
import { HeroMeet, Opener, Moods, Clip, Desktops, PageFx, Touches, HatchSlides, PipDeck, type Mood, type HatchStep } from './PipFx';
import { Tab, Win, Flow } from './Parts';
import { loadPipCopy, type PipCopy } from './_copy';
import { HTML_LANG, localize, type Lang } from '@/lib/i18n';
import './pip.css';

/* Pip's own typeface: the tablet's UI is set in Nunito (SIL Open Font License). Self-hosted, the
   Latin subset of the variable font (weights 500 to 900), so the build never waits on Google Fonts. */
const nunito = localFont({ src: './nunito-latin-var.woff2', weight: '500 900', variable: '--pp-font', display: 'swap' });

export const URL = 'https://www.chiambucket.com/pip';

/* The six desktop colours, from the hub's palette (dsh-pet-hub, lib/index.js). */
const C = { cyan: '#00ffff', violet: '#b48cff', pink: '#ff7ab6', lime: '#9be564', gold: '#ffd43b', orange: '#ff8a4c' };
const V = '/videos/pip/';
const I = '/images/pip/';

/* The chapters in order, in their desktop colours; their names are copy.chapters. */
const CHAPTERS = [
  { id: 'meet', color: C.cyan },
  { id: 'canvas', color: C.violet },
  { id: 'applets', color: C.pink },
  { id: 'desktops', color: C.lime },
  { id: 'crew', color: C.gold },
  { id: 'inside', color: C.orange },
] as const;

/* Pip's moods in order (copy.moods by key), each with its clip. */
const MOODS = ['asleep', 'wake', 'listen', 'think', 'happy', 'talk'] as const;
const moods = (c: PipCopy): Mood[] => MOODS.map((key) => ({ key, ...c.moods[key], clip: V + 'm-' + key }));

/* A new desktop, step by step (HatchSlides), as the tablet showed it; the words are copy.hatch, in order. */
const HATCH: Array<Pick<HatchStep, 'src' | 'clip'>> = [
  { src: V + 'newpip.webp', clip: { src: V + 'newpip', poster: V + 'newpip.webp', ms: 4400 } },
  { src: I + 'hatch-riva.webp' },
  { src: I + 'icard-riva.webp' },
];

/* Eight real Pips: the four on my desktops and four from the test desktops, from their own cards (copy.pips). */
const PIPS = [
  { id: 'mopi', color: C.cyan }, { id: 'poco', color: C.violet }, { id: 'fizz', color: C.pink }, { id: 'wavo', color: C.lime },
  { id: 'quib', color: C.cyan }, { id: 'doughby', color: C.violet }, { id: 'blooma', color: C.pink }, { id: 'bzzt', color: C.lime },
] as const;

/* One feature: a picture or clip on the Tab5, and a few words. */
function Row({ title, children, media, flip, wide }: { title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean; wide?: boolean }) {
  return (
    <div className={`pp-row${flip ? ' flip' : ''}${wide ? ' wide' : ''}`} data-pp-in>
      <div className="pp-row-media">{media}</div>
      <div className="pp-row-copy"><h3>{title}</h3>{children}</div>
    </div>
  );
}

export default async function PipArticle({ lang }: { lang: Lang }) {
  const c = await loadPipCopy(lang);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.ld.headline,
    description: c.meta.description,
    image: 'https://www.chiambucket.com/images/pip/og.webp',
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    publisher: { '@type': 'Person', name: 'Braven Chiam' },
    mainEntityOfPage: lang === 'en' ? URL : 'https://www.chiambucket.com' + localize('/pip', lang),
    about: c.ld.about,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
  };

  return (
    <main className={`pp ${nunito.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageFx />
      <div className="pp-body">
      <Desktops items={CHAPTERS.map((ch) => ({ ...ch, name: c.chapters[ch.id] }))} label={c.ui.chapters} />

      {/* ── The hero and 1. Meet Pip (cyan): one stage, the same Pip from the tablet's screen into the opener ── */}
      <HeroMeet title={c.meet.title} slotLabel={c.meet.slotLabel} lede={c.meet.lede} ui={c.ui}
        hero={
          <div className="pp-hero-copy">
            <h1 className="pp-hero-t">{c.hero.title}</h1>
            <p className="pp-hero-lead">{c.hero.lead}</p>
            <div className="pp-hero-row">
              <a className="pp-btn" href="#meet"><IcRead /> {c.hero.meet}</a>
              <span className="pp-btn pp-btn-off" role="link" aria-disabled="true" title={c.hero.m5Off}>
                <i className="pp-m5" aria-hidden="true" /> {c.hero.m5}
              </span>
              <AiMark project="proj-pip" className="pp-ai" />
            </div>
            <p className="pp-hero-meta">{c.hero.meta}</p>
          </div>
        } />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.cyan }}>
        <Moods moods={moods(c)} id="moods" ui={c.ui} />
        <div className="pp-wrap">
          <Row title={c.props.title} wide
            media={<Clip src={V + 'props'} poster={V + 'props.webp'} className="pp-pipvid pp-strip" label={c.props.label} />}>
            <p>{c.props.p}</p>
          </Row>
          <Row title={c.desk.title} flip
            media={<figure className="pp-photo"><img src={I + 'desk-photo.webp'} alt={c.desk.alt} loading="lazy" decoding="async" /></figure>}>
            <p>{c.desk.p}</p>
          </Row>
        </div>
      </div>

      {/* ── 2. The screen (violet) ── */}
      <Opener id="canvas" desk={1} color={C.violet} title={c.canvas.title} clip={V + 'o-violet'} pipLabel={c.canvas.pipLabel}
        lede={c.canvas.lede} />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.violet }}>
        <div className="pp-wrap">
          <Row title={c.cursor.title} wide
            media={<Win label={c.cursor.win}><Clip src={V + 'cursor'} poster={V + 'cursor.webp'} className="pp-screen" label={c.cursor.label} /></Win>}>
            <p>{c.cursor.p}</p>
          </Row>
          <Row title={c.point.title} flip
            media={<Tab><Clip src={V + 'point'} poster={V + 'point.webp'} className="pp-screen" label={c.point.label} /></Tab>}>
            <p>{c.point.p}</p>
          </Row>
          <Row title={c.markdown.title}
            media={<Tab><img className="pp-screen" src={I + 'markdown.webp'} alt={c.markdown.alt} loading="lazy" decoding="async" /></Tab>}>
            <p>{c.markdown.p}</p>
          </Row>
          <Row title={c.question.title} flip
            media={<Tab><img className="pp-screen" src={I + 'question.webp'} alt={c.question.alt} loading="lazy" decoding="async" /></Tab>}>
            <p>{c.question.p}</p>
          </Row>
          <div className="pp-touchwrap" data-pp-in><Touches words={c.touches} /></div>
        </div>
      </div>

      {/* ── 3. Applets (pink) ── */}
      <Opener id="applets" desk={2} color={C.pink} title={c.applets.title} clip={V + 'o-pink'} pipLabel={c.applets.pipLabel}
        lede={c.applets.lede} />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.pink }}>
        <div className="pp-wrap">
          <Row title={c.drawer.title} wide
            media={<Tab><Clip src={V + 'drawer'} poster={V + 'drawer.webp'} className="pp-screen" label={c.drawer.label} /></Tab>}>
            <p>{c.drawer.p}</p>
          </Row>
          <div className="pp-pair" data-pp-in>
            <figure>
              <div className="pp-call">
                <img className="pp-call-mac" src={I + 'intercom-mac.webp'} alt={c.web.macAlt} loading="lazy" decoding="async" />
                <Tab className="pp-call-tab"><img className="pp-screen" src={I + 'intercom-call.webp'} alt={c.web.tabAlt} loading="lazy" decoding="async" /></Tab>
              </div>
              <figcaption>{c.web.caption}</figcaption>
            </figure>
            <figure>
              <Tab><img className="pp-screen" src={I + 'native.webp'} alt={c.native.alt} loading="lazy" decoding="async" /></Tab>
              <figcaption>{c.native.caption}</figcaption>
            </figure>
          </div>
          <div className="pp-built" data-pp-in>
            <div className="pp-built-head">
              <h3>{c.built.title}</h3>
              <figure className="pp-built-clip">
                <Tab><Clip src={V + 'tictactoe'} poster={V + 'tictactoe.webp'} className="pp-screen" label={c.built.label} /></Tab>
                <figcaption>{c.built.caption}</figcaption>
              </figure>
            </div>
            <ul>
              {c.built.list.map((b) => <li key={b.time}><b>{b.time}</b><span>{b.what}</span></li>)}
            </ul>
          </div>
          <Row title={c.devring.title} flip
            media={<Tab><Clip src={V + 'devring'} poster={V + 'devring.webp'} className="pp-screen" label={c.devring.label} /></Tab>}>
            <p>{c.devring.p}</p>
          </Row>
        </div>
      </div>

      {/* ── 4. Desktops (lime) ── */}
      <Opener id="desktops" desk={3} color={C.lime} title={c.desktops.title} clip={V + 'o-lime'} pipLabel={c.desktops.pipLabel}
        lede={c.desktops.lede} />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.lime }}>
        <div className="pp-wrap">
          <Row title={c.switch.title} wide
            media={<Tab><Clip src={V + 'switch'} poster={V + 'switch.webp'} className="pp-screen" label={c.switch.label} /></Tab>}>
            <p>{c.switch.p}</p>
          </Row>
          <div className="pp-newpip" data-pp-in>
            <div className="pp-newpip-copy">
              <h3>{c.newpip.title}</h3>
              <p>{c.newpip.p}</p>
              <PipDeck pips={PIPS.map((p) => ({ ...c.pips[p.id], color: p.color, img: I + 'pips/' + p.id + '.webp' }))} ui={c.ui} />
            </div>
            <div className="pp-newpip-media"><HatchSlides steps={HATCH.map((h, i) => ({ ...h, ...c.hatch[i] }))} ui={c.ui} /></div>
          </div>
          <Row title={c.ask.title}
            media={<Tab><Clip src={V + 'ask'} poster={V + 'ask.webp'} className="pp-screen" label={c.ask.label} /></Tab>}>
            <p>{c.ask.p}</p>
          </Row>
          <Row title={c.control.title} flip
            media={<Tab><Clip src={V + 'control'} poster={V + 'control.webp'} className="pp-screen" label={c.control.label} /></Tab>}>
            <p>{c.control.p}</p>
          </Row>
        </div>
      </div>

      {/* ── 5. The crew (gold) ── */}
      <Opener id="crew" desk={4} color={C.gold} title={c.crew.title} clip={V + 'o-gold'} pipLabel={c.crew.pipLabel}
        lede={c.crew.lede} />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.gold }}>
        <div className="pp-wrap">
          <Row title={c.subagents.title} wide
            media={<Clip src={V + 'crew'} poster={V + 'crew.webp'} className="pp-pipvid pp-strip" label={c.subagents.label} />}>
            <p>{c.subagents.p}</p>
          </Row>
          <figure className="pp-crewhome" data-pp-in>
            <Tab><img className="pp-screen" src={I + 'crew-home.webp'} alt={c.crewHome.alt} loading="lazy" decoding="async" /></Tab>
            <figcaption>{c.crewHome.caption}</figcaption>
          </figure>
          <Row title={c.tasks.title} flip
            media={<figure className="pp-zoomlist" data-no-zoom><img src={I + 'desk-fizz.webp'} alt={c.tasks.alt} loading="lazy" decoding="async" /></figure>}>
            <p>{c.tasks.p}</p>
          </Row>
          <Row title={c.kimi.title} wide
            media={
              <ol className="pp-steps">
                {c.kimi.steps.map((st, i) => (
                  <li key={i}><Tab><img className="pp-screen" src={I + `kimi-${i + 1}.webp`} alt={st.alt} loading="lazy" decoding="async" /></Tab><span>{st.caption}</span></li>
                ))}
              </ol>
            }>
            <p>{c.kimi.p}</p>
          </Row>
        </div>
      </div>

      {/* ── 6. How it works (orange) ── */}
      <Opener id="inside" desk={5} color={C.orange} title={c.inside.title} clip={V + 'o-orange'} pipLabel={c.inside.pipLabel}
        lede={c.inside.lede} />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.orange }}>
        <div className="pp-wrap">
          <div className="pp-how" data-pp-in>
            <Flow t={c.flow} />
          </div>
          <div className="pp-hw" data-pp-in>
            <div>
              <h3>{c.hw.working}</h3>
              <ul className="pp-chips on">
                {c.hw.workingList.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div>
              <h3>{c.hw.unchecked}</h3>
              <ul className="pp-chips">
                {c.hw.uncheckedList.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
          <div className="pp-next" data-pp-in>
            <h3>{c.next.title}</h3>
            <p>{c.next.p}</p>
          </div>
          <p className="pp-credit" data-pp-in>{c.credit}</p>
        </div>
      </div>

      </div>

      <ArticleRecommendations exclude="proj-pip" />
    </main>
  );
}
