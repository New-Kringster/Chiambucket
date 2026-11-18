import type { Metadata } from 'next';
import localFont from 'next/font/local';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import AiMark from '../../components/AiMark';
import { IcRead } from '../../components/Icons';
import { HeroMeet, Opener, Moods, Clip, Desktops, PageFx, Touches, HatchSlides, PipDeck, type Mood, type HatchStep } from './PipFx';
import { Tab, Win, Flow } from './Parts';
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
  { key: 'asleep', name: 'Asleep', line: 'If you leave it alone for a minute, it dims the screen and dozes off.', clip: V + 'm-asleep' },
  { key: 'wake', name: 'Awake', line: 'It wakes with a stretch when you pick the tablet up or tap it, or when a reply arrives.', clip: V + 'm-wake' },
  { key: 'listen', name: 'Listening', line: 'Hold the screen to talk, and it leans in with a hand to its ear.', clip: V + 'm-listen' },
  { key: 'think', name: 'Thinking', line: 'While it works, it twists around and rubs its temples, and sometimes it gets an idea.', clip: V + 'm-think' },
  { key: 'happy', name: 'Happy', line: 'It hops whenever something works out.', clip: V + 'm-happy' },
  { key: 'talk', name: 'Talking', line: 'Its reply appears with a soft chime in a bubble beside it, just under what it heard you say.', clip: V + 'm-talk' },
];

/* A new desktop, step by step (HatchSlides), as the tablet showed it. */
const HATCH: HatchStep[] = [
  { src: V + 'newpip.webp', alt: 'The spotlight bar pulled down on Wavo\'s desktop, dragged past the last chip until a plus springs out; let go, and a new desktop arrives with an egg',
    caption: 'Drag past the last chip for a new desktop', clip: { src: V + 'newpip', poster: V + 'newpip.webp', ms: 4400 } },
  { src: I + 'hatch-riva.webp', alt: 'Riva, a gold heart in a crown, hatched, with her first line in a bubble', caption: 'The egg hatches and the Pip says its first line' },
  { src: I + 'icard-riva.webp', alt: "Riva's card on the Tab5, written by her: a swaggering golden rival, theatrical, competitive and loyal, with her catchphrase, likes and dislikes", caption: 'Tap its name for the card it wrote' },
]

/* Eight real Pips: the four on my desktops and four from the test desktops, from their own cards. */
const PIPS = [
  { name: 'Mopi', color: C.cyan, look: 'a cyan cloud in glasses', vibe: 'A drowsy little philosopher who treats napping and wondering as equally serious work.', says: 'Ask me after my nap.' },
  { name: 'Poco', color: C.violet, look: 'a violet bean in a scarf', vibe: 'A squeaky miniature ranch-hand who treats every tiny task like a frontier adventure.', says: "Let's wrangle it!" },
  { name: 'Fizz', color: C.pink, look: 'a pink gumdrop in a party hat', vibe: 'A pink gumdrop gremlin who turns every tiny mess into a game, then cheerfully tidies it up.', says: 'Chaos first, tidy after!' },
  { name: 'Wavo', color: C.lime, look: 'a lime drop in sunglasses', vibe: 'A laid-back surf-mathematician who solves equations in wet sand between sets.', says: 'Ride the cosine, dude.' },
  { name: 'Quib', color: C.cyan, look: 'a cyan bean in glasses', vibe: "A tiny, grumpy librarian who guards the tablet's books and secretly likes company.", says: 'Shh. Books first, feelings later.' },
  { name: 'Doughby', color: C.violet, look: 'a violet gumdrop in a party hat', vibe: 'A pun-obsessed baker who treats every conversation like a fresh batch of jokes.', says: 'Nice to whisk you!' },
  { name: 'Blooma', color: C.pink, look: 'a pink drop with a flower', vibe: 'A gentle zen gardener who turns tiny moments into little seasons of calm.', says: 'Grow soft, stay curious.' },
  { name: 'Bzzt', color: C.lime, look: 'a lime cloud with an antenna', vibe: 'A deadpan little robot comic who is earnestly learning what a joke is, one flat punchline at a time.', says: 'That was a joke. Laugh.' },
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
      <div className="pp-body">
      <Desktops items={CHAPTERS} />

      {/* ── The hero and 1. Meet Pip (cyan): one stage, the same Pip from the tablet's screen into the opener ── */}
      <HeroMeet title="Meet Pip" slotLabel="Mopi, a cyan cloud in glasses"
        lede="It's ready to help whenever you are, just pick it up and push to talk."
        hero={
          <div className="pp-hero-copy">
            <h1 className="pp-hero-t">Pip</h1>
            <p className="pp-hero-lead">Pip is a desk pet that runs from DeepSeek Harness (DSH). It can browse the web, build and test its own apps, control other agents through the MCP connector and much more. Pip&rsquo;s interface runs on an M5Stack Tab5.</p>
            <div className="pp-hero-row">
              <a className="pp-btn" href="#meet"><IcRead /> Meet Pip</a>
              <span className="pp-btn pp-btn-off" role="link" aria-disabled="true" title="Not published yet">
                <i className="pp-m5" aria-hidden="true" /> Read on M5Stack
              </span>
              <AiMark project="proj-pip" className="pp-ai" />
            </div>
            <p className="pp-hero-meta">Internship project at M5Stack, November 2026. ESP32-P4, C++, Lua, Node, Python, Docker.</p>
          </div>
        } />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.cyan }}>
        <Moods moods={MOODS} id="moods" />
        <div className="pp-wrap">
          <Row title="Each expression is a different action" wide
            media={<Clip src={V + 'props'} poster={V + 'props.webp'} className="pp-pipvid pp-strip" label="Pips with a magnifying glass, binoculars, a megaphone and a paper plane" />}>
            <p>Pip picks up a different prop for each job, so you can tell what it is doing at a glance: a magnifying glass when it searches the web, binoculars when it reads a page, a megaphone when it briefs a subagent and a paper plane when it messages another Pip.</p>
          </Row>
          <Row title="It lives on my desk" flip
            media={<figure className="pp-photo"><img src={I + 'desk-photo.webp'} alt="The M5Stack Tab5 on its keyboard on my desk, with Mopi, a cyan cloud in glasses, on its home screen" loading="lazy" decoding="async" /></figure>}>
            <p>Pip runs on an M5Stack Tab5 clipped to its keyboard on my desk. This is Mopi, the Pip on my first desktop, which waits on the home screen until I need it.</p>
          </Row>
        </div>
      </div>

      {/* ── 2. The screen (violet) ── */}
      <Opener id="canvas" desk={1} color={C.violet} title="The screen" clip={V + 'o-violet'} pipLabel="A violet Pip in a beret looking through binoculars"
        lede="Markdown, interactive web browsers, drawings, questions and more." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.violet }}>
        <div className="pp-wrap">
          <Row title="Browser use capabilities" wide
            media={<Win label="The page Pip is driving"><Clip src={V + 'cursor'} poster={V + 'cursor.webp'} className="pp-screen" label="Pip's cursor gliding over a YouTube video, turning on captions and setting the speed to 1.5x" /></Win>}>
            <p>When I ask for a video with captions on, Pip opens it, moves its cursor to the captions button and then sets the speed from the gear menu. The browser itself runs on my server, while the tablet shows the same page with Pip watching beside it.</p>
          </Row>
          <Row title="It points things out" flip
            media={<Tab><Clip src={V + 'point'} poster={V + 'point.webp'} className="pp-screen" label="An unlabelled animal cell diagram on the Tab5: Pip circles the two mitochondria with a Mitochondria note, then draws an arrow labelled Nucleus into the nucleus" /></Tab>}>
            <p>This comes in handy for studying. I put up an unlabelled diagram of an animal cell and asked Pip to circle the mitochondria and then show me the nucleus. Because Pip can take a screenshot and look at it, it finds the parts in the picture by itself before drawing the circles, the arrow and the note over the diagram.</p>
          </Row>
          <Row title="Answers you can read"
            media={<Tab><img className="pp-screen" src={I + 'markdown.webp'} alt="A formatted reply on the Tab5: a bold title, a list with bold leads, and a line in the talk bubble" loading="lazy" decoding="async" /></Tab>}>
            <p>Longer answers open as formatted text in a pane, while the short version stays in the bubble next to Pip.</p>
          </Row>
          <Row title="It asks before it guesses" flip
            media={<Tab><img className="pp-screen" src={I + 'question.webp'} alt="A multiple choice question from Pip on the Tab5: which part of the cell to point at first, with three options, Type an answer and Skip" loading="lazy" decoding="async" /></Tab>}>
            <p>When Pip needs me to decide something, it puts up a question, and I can answer by tapping an option, typing on the keyboard or holding Pip and saying it.</p>
          </Row>
          <div className="pp-touchwrap" data-pp-in><Touches /></div>
        </div>
      </div>

      {/* ── 3. Applets (pink) ── */}
      <Opener id="applets" desk={2} color={C.pink} title="Applets" clip={V + 'o-pink'} pipLabel="A pink Pip in headphones typing on a laptop"
        lede="Pip can build native apps in Lua or stream web apps from the DSH host." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.pink }}>
        <div className="pp-wrap">
          <Row title="App Drawer" wide
            media={<Tab><Clip src={V + 'drawer'} poster={V + 'drawer.webp'} className="pp-screen" label="The applet drawer rising, the NCIR Thermometer info card, then the app launching and reading a sensor" /></Tab>}>
            <p>Pulling up on the handle opens the app drawer, where the apps Pip makes are saved. Native apps are written in Lua and run smoothly on the tablet itself, while container apps are web apps that run in Docker on the DSH host and stream to the Tab5. Because they run on the server, container apps can do much more, such as multiplayer games on your local network or even a video call.</p>
          </Row>
          <div className="pp-pair" data-pp-in>
            <figure>
              <div className="pp-call">
                <img className="pp-call-mac" src={I + 'intercom-mac.webp'} alt="A MacBook showing the Intercom in a browser: the Tab5's camera view of me fills the window, with my own Mac camera preview beside it" loading="lazy" decoding="async" />
                <Tab className="pp-call-tab"><img className="pp-screen" src={I + 'intercom-call.webp'} alt="The Intercom web applet on the Tab5 during the same call: my face from the Mac's camera fills the screen, a TALK button at the bottom and the tablet's own camera view in the corner" loading="lazy" decoding="async" /></Tab>
              </div>
              <figcaption><b>Web applets</b> are pages Pip writes and serves from my server, but they can still use the tablet&rsquo;s camera, mics and speaker. This is the Intercom, a video call applet Pip built, during a real call, so the Tab5 shows me through my Mac&rsquo;s camera while the browser on my Mac shows me through the tablet&rsquo;s.</figcaption>
            </figure>
            <figure>
              <Tab><img className="pp-screen" src={I + 'native.webp'} alt="The native NCIR Thermometer applet showing the object and ambient temperature with a trend graph" loading="lazy" decoding="async" /></Tab>
              <figcaption><b>Native applets</b> are Lua scripts that Pip sends to the tablet on the fly, so they run on the tablet itself at full speed.</figcaption>
            </figure>
          </div>
          <div className="pp-built" data-pp-in>
            <div className="pp-built-head">
              <h3>Built by Pip</h3>
              <figure className="pp-built-clip">
                <Tab><Clip src={V + 'tictactoe'} poster={V + 'tictactoe.webp'} className="pp-screen" label="A game of Tic-Tac-Toe on the Tab5, X wins along the diagonal" /></Tab>
                <figcaption>Tic-Tac-Toe, another app Pip built, being played on the tablet</figcaption>
              </figure>
            </div>
            <ul>
              <li><b>106 s</b><span>a pomodoro timer</span></li>
              <li><b>5 min</b><span>a reaction game in Lua, tested on the tablet</span></li>
              <li><b>8 min</b><span>a bubble level from the IMU</span></li>
              <li><b>32 min</b><span>a webcam intercom with a browser on the other end</span></li>
            </ul>
          </div>
          <Row title="Hands off while it tests" flip
            media={<Tab><Clip src={V + 'devring'} poster={V + 'devring.webp'} className="pp-screen" label="A red border round the screen while a tester subagent taps a counter app: 0, 1, 2, 3, then back to 2" /></Tab>}>
            <p>A red border goes around the screen whenever a subagent is building or testing an app on it, so I know to keep my hands off. In this clip, a tester subagent taps through a counter app that a coder subagent has just written, counting up to 3 and back down to 2.</p>
          </Row>
        </div>
      </div>

      {/* ── 4. Desktops (lime) ── */}
      <Opener id="desktops" desk={3} color={C.lime} title="Desktops" clip={V + 'o-lime'} pipLabel="A lime Pip in a party hat throwing a paper plane"
        lede="Every conversation gets its own desktop, with its own Pip and colour." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.lime }}>
        <div className="pp-wrap">
          <Row title="Pull down to switch" wide
            media={<Tab><Clip src={V + 'switch'} poster={V + 'switch.webp'} className="pp-screen" label="On Mopi's desktop the pill at the top is pulled down into the spotlight bar, slides to Fizz's chip and lets go, and Fizz's desktop arrives; then the same from Fizz to Wavo" /></Tab>}>
            <p>Pulling down the pill at the top of the screen opens the spotlight bar, which has a chip for every desktop. When you slide to one and let go, that desktop comes up with its own Pip, picture and work. In this clip I switch from Mopi to Fizz and then to Wavo.</p>
          </Row>
          <div className="pp-newpip" data-pp-in>
            <div className="pp-newpip-copy">
              <h3>Every Pip makes itself up</h3>
              <p>Each new desktop starts as an egg, and its Pip makes up a personality, a name, a body, a hat and a home picture to match before it hatches. Tapping its name opens the card it wrote about itself, and these are eight of mine.</p>
              <PipDeck pips={PIPS.map((p) => ({ ...p, img: I + 'pips/' + p.name.toLowerCase() + '.webp' }))} />
            </div>
            <div className="pp-newpip-media"><HatchSlides steps={HATCH} /></div>
          </div>
          <Row title="Ask Pip from anywhere"
            media={<Tab><Clip src={V + 'ask'} poster={V + 'ask.webp'} className="pp-screen" label="The spotlight bar pulled down over Riva's home screen, the question What's a good name for a cactus? typed and sent, then Riva's reply: Prickly Pete, Spike Lee or Sir Pokes-A-Lot" /></Tab>}>
            <p>You can also talk to Pip from the spotlight bar on any screen, by pulling it down or pressing Ctrl+Space and then typing or speaking. Here I ask Riva to name a cactus.</p>
          </Row>
          <Row title="A control centre" flip
            media={<Tab><Clip src={V + 'control'} poster={V + 'control.webp'} className="pp-screen" label="The control centre dropping down over the thermometer app, then its settings page" /></Tab>}>
            <p>Pulling down from the top right opens the control centre, which has brightness, volume, the mic and camera and a button to exit the applet, and the full settings are one more tap away.</p>
          </Row>
        </div>
      </div>

      {/* ── 5. The crew (gold) ── */}
      <Opener id="crew" desk={4} color={C.gold} title="The crew" clip={V + 'o-gold'} pipLabel="A gold heart Pip in a crown shouting through a megaphone"
        lede="Pip hands long jobs to subagents, so it can keep talking to me." />
      <div className="pp-chapter" style={{ ['--acc' as string]: C.gold }}>
        <div className="pp-wrap">
          <Row title="Subagents at work" wide
            media={<Clip src={V + 'crew'} poster={V + 'crew.webp'} className="pp-pipvid pp-strip" label="Five subagent pips at work: writing, typing, stacking blocks, reading and mixing a flask" />}>
            <p>Each subagent gets a job and a prop to match it, such as a notepad, a laptop, blocks, a book or a bubbling flask. While they work, a small busy Pip sits on the home screen, and tapping it opens the crew card, where each of them says what it is up to.</p>
          </Row>
          <figure className="pp-crewhome" data-pp-in>
            <Tab><img className="pp-screen" src={I + 'crew-home.webp'} alt="The crew card open on Zesto's home screen: three subagents, Researcher, Scout and Writer, each with a short thought" loading="lazy" decoding="async" /></Tab>
            <figcaption>The crew card with three subagents at work</figcaption>
          </figure>
          <Row title="Long jobs get a list" flip
            media={<figure className="pp-zoomlist" data-no-zoom><img src={I + 'desk-fizz.webp'} alt="A finished three step task list on Fizz's home screen: design and write the native Lua app, test it on the tablet, open it on the desktop" loading="lazy" decoding="async" /></figure>}>
            <p>Pip turns a long job into a task list on the home screen and hands each step to a subagent, such as a scout, a writer or a tester, which ticks it off when it is done.</p>
          </Row>
          <Row title="It watches my other agents" wide
            media={
              <ol className="pp-steps">
                <li><Tab><img className="pp-screen" src={I + 'kimi-1.webp'} alt="The crew card with two at work: Zesto and Kimi, an outside agent, typing" loading="lazy" decoding="async" /></Tab><span>Kimi joins the crew</span></li>
                <li><Tab><img className="pp-screen" src={I + 'kimi-2.webp'} alt="A card on the Tab5: Kimi wants to write, with Approve once, Approve for this session and Reject" loading="lazy" decoding="async" /></Tab><span>It asks before it writes</span></li>
                <li><Tab><img className="pp-screen" src={I + 'kimi-3.webp'} alt="Pip's reply on the Tab5: Kimi shipped it, the file is in the workspace and reads hello from Kimi" loading="lazy" decoding="async" /></Tab><span>Pip reports back</span></li>
              </ol>
            }>
            <p>Because Pip lives in the same harness as my coding sessions, it can see which ones are running, finished, stuck on a question or broken, and it can bring in agents from other providers too. Here it hands a job to Kimi Code on my server, so Kimi joins the crew card, its request to write a file comes to the tablet for me to approve, and Pip reports back once it is done.</p>
          </Row>
        </div>
      </div>

      {/* ── 6. How it works (orange) ── */}
      <Opener id="inside" desk={5} color={C.orange} title="How it works" clip={V + 'o-orange'} pipLabel="An orange Pip in glasses thinking, until a light bulb lights up"
        lede="The tablet is only the face, and all the thinking happens on my server." />
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
            <h3>Still in progress</h3>
            <p>Pip is still being built and changes most weeks, so instructions for deploying your own will be added here later.</p>
          </div>
          <p className="pp-credit" data-pp-in>The Tab5 in 3D at the top of this page is built on M5Stack&rsquo;s own Tab5 structure model from <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT licence, copyright M5Stack), with the glass, screen and back added. Pip&rsquo;s animations are rendered from the firmware&rsquo;s own drawing code, and the screenshots and clips come from the tablet&rsquo;s screen. The gesture clips were recorded with the tablet slowed down, so Pip moves a little fast in them.</p>
        </div>
      </div>

      </div>

      <ArticleRecommendations exclude="proj-pip" />
    </main>
  );
}
