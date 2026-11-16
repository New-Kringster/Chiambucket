import type { Metadata } from 'next';
import localFont from 'next/font/local';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import AiMark from '../../components/AiMark';
import { IcRead } from '../../components/Icons';
import { Tab5Hero, Opener, Moods, Clip, Desktops, PageFx, DeskSwitch, type Mood } from './PipFx';
import { Tab, Win, Flow, Hub } from './Parts';
import './pip.css';

/* Pip's own typeface: the tablet's UI is set in Nunito (SIL Open Font License). Self-hosted, the
   Latin subset of the variable font (weights 500 to 900), so the build never waits on Google Fonts. */
const nunito = localFont({ src: './nunito-latin-var.woff2', weight: '500 900', variable: '--pp-font', display: 'swap' });

const URL = 'https://www.chiambucket.com/pip';
const description =
  'Pip is a desk pet on an M5Stack Tab5 whose brain is the DeepSeek Harness on my server. It sleeps, wakes, thinks and hops, drives a browser with its own cursor, builds its own apps, and steers my other agent sessions.';

export const metadata: Metadata = {
  title: 'Pip, a desk pet with an agent for a brain | Braven Chiam',
  description,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Pip, a desk pet with an agent for a brain',
    description,
    url: URL,
    type: 'article',
    images: [{ url: '/images/pip/og.webp', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Pip, a desk pet with an agent for a brain', description, images: ['/images/pip/og.webp'] },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pip: a desk pet on an M5Stack Tab5 with the DeepSeek Harness for a brain',
  description,
  image: 'https://www.chiambucket.com/images/pip/og.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: URL,
  about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'AI agents', 'desk pet'],
};

/* The six desktop colours, from the hub's palette (dsh-pet-hub, lib/index.js). */
const C = { cyan: '#00ffff', violet: '#b48cff', pink: '#ff7ab6', lime: '#9be564', gold: '#ffd43b', orange: '#ff8a4c' };
const V = '/videos/pip/';
const I = '/images/pip/';

const CHAPTERS = [
  { id: 'meet', name: 'Meet Pip', color: C.cyan },
  { id: 'canvas', name: 'The screen', color: C.violet },
  { id: 'applets', name: 'Applets', color: C.pink },
  { id: 'desktops', name: 'Desktops', color: C.lime },
  { id: 'crew', name: 'The crew', color: C.gold },
  { id: 'inside', name: 'How it works', color: C.orange },
];

const MOODS: Mood[] = [
  { key: 'asleep', name: 'Asleep', line: 'Left alone for a minute, it dims the screen and dozes off.', clip: V + 'm-asleep' },
  { key: 'wake', name: 'Awake', line: 'Pick the tablet up, tap it, or let a reply arrive, and it wakes with a stretch.', clip: V + 'm-wake' },
  { key: 'listen', name: 'Listening', line: 'Hold the screen to talk. It leans in with a hand to its ear.', clip: V + 'm-listen' },
  { key: 'think', name: 'Thinking', line: 'While it works it twists, rubs its temples, and sometimes gets an idea.', clip: V + 'm-think' },
  { key: 'happy', name: 'Happy', line: 'When something works, it hops.', clip: V + 'm-happy' },
  { key: 'talk', name: 'Talking', line: 'Replies land in a bubble beside it, under the words it heard, with a soft chime.', clip: V + 'm-talk' },
];

/* Three desktops, as the tablet showed them: each keeps its own Pip, picture and work. */
const DESKS = [
  { src: I + 'desk-mopi.webp', name: 'Mopi', color: C.cyan, alt: 'Mopi, a cyan cloud in glasses, on a misty lake' },
  { src: I + 'desk-fizz.webp', name: 'Fizz', color: C.pink, alt: 'Fizz, a pink Pip in a party hat, on a meme with a finished task list' },
  { src: I + 'desk-zebo.webp', name: 'Zebo', color: C.gold, alt: 'Zebo, a gold pear in a bow tie, thinking beside the YouTube video it is working on' },
];

/* One feature: a picture or clip on the Tab5, and a few words. */
function Row({ title, children, media, flip, wide }: { title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean; wide?: boolean }) {
  return (
    <div className={`pp-row${flip ? ' flip' : ''}${wide ? ' wide' : ''}`} data-pp-in>
      <div className="pp-row-media">{media}</div>
      <div className="pp-row-copy"><h3>{title}</h3>{children}</div>
    </div>
  );
}

export default function PipPage() {
  return (
    <main className={`pp ${nunito.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageFx />
      <Desktops items={CHAPTERS} />

      <Tab5Hero screen={V + 'screen-home'}>
        <div className="pp-hero-copy">
          <h1 className="pp-hero-t">Pip</h1>
          <p className="pp-hero-lead">A desk pet that lives on an M5Stack Tab5. Its brain is the DeepSeek Harness running on my server, so it can do real work: drive a browser, build its own apps, and keep an eye on my other agents.</p>
          <div className="pp-hero-row">
            <a className="pp-btn" href="#meet"><IcRead /> Meet Pip</a>
            <AiMark project="proj-pip" className="pp-ai" />
          </div>
          <p className="pp-hero-meta">Personal project, November 2026. ESP32-P4, C++, Lua, Node, Python, Docker.</p>
        </div>
      </Tab5Hero>

      {/* ── 1. Meet Pip (cyan) ── */}
      <Opener id="meet" desk={0} color={C.cyan} title="Meet Pip" clip={V + 'o-cyan'} pipLabel="Mopi, a cyan cloud in glasses, blinking and winking"
        lede="It sleeps, wakes when you pick it up, and always shows you what it is doing." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.cyan }}>
        <Moods moods={MOODS} id="moods" />
        <div className="pp-wrap">
          <Row title="It acts out what it is doing" wide
            media={<Clip src={V + 'props'} poster={V + 'props.webp'} className="pp-pipvid pp-strip" label="Pips with a magnifying glass, binoculars, a megaphone and a paper plane" />}>
            <p>A magnifying glass when it searches the web. Binoculars when it reads a page. A megaphone when it briefs a helper. A paper plane when it messages another Pip.</p>
          </Row>
          <Row title="It lives on my desk" flip
            media={<figure className="pp-photo"><img src={I + 'desk-photo.webp'} alt="The M5Stack Tab5 on its keyboard next to my laptop, with Mopi on screen holding a magnifying glass" loading="lazy" decoding="async" /></figure>}>
            <p>Pip runs on an M5Stack Tab5 clipped to its keyboard, next to my laptop. This is Mopi, the Pip on my first desktop, in the middle of a web search.</p>
          </Row>
        </div>
      </div>

      {/* ── 2. The screen (violet) ── */}
      <Opener id="canvas" desk={1} color={C.violet} title="The screen" clip={V + 'o-violet'} pipLabel="A violet Pip in a beret looking through binoculars"
        lede="Pip answers with pages, not just text, and it can use those pages itself." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.violet }}>
        <div className="pp-wrap">
          <Row title="It drives the browser" wide
            media={<Win label="The page Pip is driving"><Clip src={V + 'cursor'} poster={V + 'cursor.webp'} className="pp-screen" label="Pip's cursor gliding over a YouTube video, turning on captions and setting the speed to 1.5x" /></Win>}>
            <p>Ask for a video with captions on and Pip opens it, glides its cursor to the captions button, then finds the speed setting in the gear menu. This is recorded from the browser Pip drives on my server. On the tablet, Pip sits beside this page and watches.</p>
          </Row>
          <div className="pp-pair" data-pp-in>
            <figure>
              <Win label="The page Pip is driving"><Clip src={V + 'site'} poster={V + 'site.webp'} className="pp-screen" label="Pip opening My work on chiambucket.com and scrolling to Project June" /></Win>
              <figcaption><b>It finds its way around.</b> On this site, it opened My work and scrolled to the project I asked about.</figcaption>
            </figure>
            <figure>
              <Tab><img className="pp-screen" src={I + 'marks.webp'} alt="Pip's gold circle around Project June on chiambucket.com, with an arrow to the next build" loading="lazy" decoding="async" /></Tab>
              <figcaption><b>It points things out.</b> Pip draws circles and arrows over the page, stroke by stroke, to show me what it means.</figcaption>
            </figure>
          </div>
          <Row title="Answers you can read"
            media={<Tab><img className="pp-screen" src={I + 'markdown.webp'} alt="A formatted reply on the Tab5: a bold title, a list with bold leads, and a line in the talk bubble" loading="lazy" decoding="async" /></Tab>}>
            <p>Longer answers come as formatted text in a pane, with the short version in the bubble next to Pip.</p>
          </Row>
          <Row title="It asks before it guesses" flip
            media={<Tab><img className="pp-screen" src={I + 'question.webp'} alt="A multiple choice question card from Pip on the Tab5 with three options and a Skip button" loading="lazy" decoding="async" /></Tab>}>
            <p>When Pip needs a decision it puts up a question. Tap an option, type on the keyboard, or hold Pip and say it.</p>
          </Row>
          <ul className="pp-notes" data-pp-in>
            <li><b>Taps show.</b> A tap lands as a blue dot and turns green when the page reacts.</li>
            <li><b>Drags show.</b> A drag leaves a blue line behind the finger.</li>
            <li><b>Any pane expands.</b> One button takes it to the full screen.</li>
            <li><b>Back is always the same.</b> A swipe from left to right.</li>
          </ul>
        </div>
      </div>

      {/* ── 3. Applets (pink) ── */}
      <Opener id="applets" desk={2} color={C.pink} title="Applets" clip={V + 'o-pink'} pipLabel="A pink Pip in headphones typing on a laptop"
        lede="Small apps Pip writes on request and keeps in a drawer." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.pink }}>
        <div className="pp-wrap">
          <Row title="A drawer of apps" wide
            media={<Tab><Clip src={V + 'drawer'} poster={V + 'drawer.webp'} className="pp-screen" label="The applet drawer rising, the NCIR Thermometer info card, then the app launching and reading a sensor" /></Tab>}>
            <p>Pull up from the handle and the drawer rises with your finger. Every applet has an icon and an info card with Launch, End and Remove. Launching one grows its tile into the app. Here it is my infrared thermometer, reading the sensor on Port A.</p>
          </Row>
          <div className="pp-pair" data-pp-in>
            <figure>
              <Tab><img className="pp-screen" src={I + 'pomodoro.webp'} alt="A pomodoro timer web applet on the Tab5 counting down from 25 minutes" loading="lazy" decoding="async" /></Tab>
              <figcaption><b>Web applets</b> are pages Pip writes and serves from my server. They can still use the tablet&rsquo;s camera, mics, speaker and sensors.</figcaption>
            </figure>
            <figure>
              <Tab><img className="pp-screen" src={I + 'native.webp'} alt="The native NCIR Thermometer applet showing the object and ambient temperature with a trend graph" loading="lazy" decoding="async" /></Tab>
              <figcaption><b>Native applets</b> are Lua scripts sent to the tablet on the fly. They run on the tablet itself, at full speed.</figcaption>
            </figure>
          </div>
          <div className="pp-built" data-pp-in>
            <h3>Built by Pip, from one sentence</h3>
            <ul>
              <li><b>106 s</b><span>a pomodoro timer</span></li>
              <li><b>5 min</b><span>a reaction game in Lua, tested on the tablet</span></li>
              <li><b>8 min</b><span>a bubble level from the IMU</span></li>
              <li><b>32 min</b><span>a webcam intercom with a browser on the other end</span></li>
            </ul>
            <p>While a helper builds or tests an app on screen, a red border goes round it, so I know to keep my hands off.</p>
          </div>
        </div>
      </div>

      {/* ── 4. Desktops (lime) ── */}
      <Opener id="desktops" desk={3} color={C.lime} title="Desktops" clip={V + 'o-lime'} pipLabel="A lime Pip in a party hat throwing a paper plane"
        lede="One desktop for each conversation, each with its own Pip and its own colour." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.lime }}>
        <DeskSwitch id="switch" desks={DESKS} />
        <div className="pp-wrap">
          <div className="pp-pair pp-hatch" data-pp-in>
            <figure>
              <Tab><img className="pp-screen" src={I + 'hatch-egg.webp'} alt="A new desktop on the Tab5 with a gold egg labelled hatching" loading="lazy" decoding="async" /></Tab>
            </figure>
            <figure>
              <Tab><img className="pp-screen" src={I + 'hatch-zebo.webp'} alt="Zebo, a gold pear with a bow tie, announcing that it has hatched" loading="lazy" decoding="async" /></Tab>
            </figure>
            <div className="pp-hatch-copy">
              <h3>Every Pip makes itself up</h3>
              <p>A new desktop starts as an egg. Its Pip invents a personality, a name, a body, a hat and a home picture to match, then hatches. This one became Zebo, a soap-opera narrator in a bow tie. A tap on its name shows the card it wrote about itself.</p>
            </div>
          </div>
          <Row title="Ask Pip from anywhere"
            media={<Tab><img className="pp-screen" src={I + 'spotlight.webp'} alt="The Ask Pip bar pulled down from the top with a chip for each of four desktops" loading="lazy" decoding="async" /></Tab>}>
            <p>Pull down the pill at the top, or press Ctrl+Space on the keyboard, and an Ask Pip bar drops in with a chip for every desktop. Drag past the last chip to start a new one.</p>
          </Row>
          <Row title="A control centre" flip
            media={<Tab><Clip src={V + 'control'} poster={V + 'control.webp'} className="pp-screen" label="The control centre dropping down over the thermometer app, then its settings page" /></Tab>}>
            <p>Pull from the top right for brightness, volume, the mic and camera, and Exit applet. Settings sit one tap further in.</p>
          </Row>
        </div>
      </div>

      {/* ── 5. The crew (gold) ── */}
      <Opener id="crew" desk={4} color={C.gold} title="The crew" clip={V + 'o-gold'} pipLabel="A gold heart Pip in a crown shouting through a megaphone"
        lede="Pip hands long jobs to helpers, so it can keep talking to me." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.gold }}>
        <div className="pp-wrap">
          <Row title="Helpers at work" wide
            media={<Clip src={V + 'crew'} poster={V + 'crew.webp'} className="pp-pipvid pp-strip" label="Five helper pips at work: writing, typing, stacking blocks, reading and mixing a flask" />}>
            <p>Each helper gets a job and a prop to match: a notepad, a laptop, blocks, a book, a bubbling flask. A small busy Pip on the home screen opens the crew card, where each one says what it is up to.</p>
          </Row>
          <figure className="pp-crewcard" data-pp-in>
            <picture>
              <source media="(max-width: 900px)" srcSet={I + 'crewcard-2x2.webp'} />
              <img src={I + 'crewcard.webp'} alt="Four frames of the crew card on the Tab5: a helper called Tester swirling a flask, thinking: Clicking buttons, hoping green" loading="lazy" decoding="async" />
            </picture>
            <figcaption>The crew card on the tablet, with my Tester helper thinking &ldquo;Clicking buttons, hoping green&rdquo;.</figcaption>
          </figure>
          <Row title="Long jobs get a list" flip
            media={<Tab><img className="pp-screen" src={I + 'desk-fizz.webp'} alt="Fizz, a pink Pip in a party hat, on its meme home picture with a finished three step task list" loading="lazy" decoding="async" /></Tab>}>
            <p>A long job becomes a task list on the home screen. Each step goes to a named helper, a scout, a writer or a tester, and ticks off when it is done.</p>
          </Row>
          <Row title="It watches my other agents"
            media={<Hub />}>
            <p>Pip lives inside the same harness as my coding sessions. It sees which ones are running, done, stuck on a question or broken, tells me with a chime, and can answer for me when I ask it to.</p>
          </Row>
        </div>
      </div>

      {/* ── 6. How it works (orange) ── */}
      <Opener id="inside" desk={5} color={C.orange} title="How it works" clip={V + 'o-orange'} pipLabel="An orange Pip in glasses thinking, until a light bulb lights up"
        lede="The tablet is the face. The thinking happens on my server." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.orange }}>
        <div className="pp-wrap">
          <div className="pp-how" data-pp-in>
            <Flow />
          </div>
          <div className="pp-hw" data-pp-in>
            <div>
              <h3>On the Tab5, working</h3>
              <ul className="pp-chips on">
                <li>Touch</li><li>Camera</li><li>Microphones</li><li>Speaker</li><li>IMU</li><li>I2C</li><li>Keyboard</li>
              </ul>
            </div>
            <div>
              <h3>Not checked yet</h3>
              <ul className="pp-chips">
                <li>USB</li><li>Headphone jack</li><li>Wi-Fi as a feature</li><li>ESP-NOW</li><li>BLE</li><li>UART</li>
              </ul>
            </div>
          </div>
          <div className="pp-next" data-pp-in>
            <h3>Coming next</h3>
            <ul>
              <li><b>Interrupting with my voice.</b> Talking over Pip mid-job to change course. It is built, but not tested on the tablet yet.</li>
              <li><b>Agents from other places.</b> Coding agents on other machines and from other providers joining the crew and reporting back to Pip.</li>
              <li><b>The rest of the hardware.</b> USB, the headphone jack, ESP-NOW, BLE and UART, each in an applet of its own.</li>
            </ul>
          </div>
          <p className="pp-credit" data-pp-in>The Tab5 in 3D at the top of this page is built on M5Stack&rsquo;s own Tab5 structure model from <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT licence, copyright M5Stack), with the glass, screen and back added. Pip&rsquo;s animations are drawn by its firmware&rsquo;s own drawing code, rendered on a computer at 30 frames a second. The screens come from the tablet itself, and the browser clips from the page Pip drives on my server.</p>
        </div>
      </div>

      <ArticleRecommendations exclude="proj-pip" />
    </main>
  );
}
