'use client';
import { useEffect, useRef, useState } from 'react';
import RisoPrint from '../components/press/RisoPrint';
import { Arrow, Doodle, Hatch, RoughFrame, drawRack, drawRadio } from '../components/press/Sketch';

/* Photos that take turns on the hero press. All Braven's own, from the
   Lychee albums; the riso separation happens in the browser. */
const PRINTS = [
  { src: '/images/press/nz-mountains.webp', caption: 'New Zealand, 2026', focus: [0.5, 0.42], alt: 'Snow-capped mountains under heavy cloud, New Zealand' },
  { src: '/images/press/hk-estate.webp', caption: 'Hong Kong, 2026', focus: [0.5, 0.55], alt: 'A pastel housing estate rising over a basketball court, Hong Kong' },
  { src: '/images/press/mandarin-duck.webp', caption: 'China, 2025', focus: [0.46, 0.38], alt: 'A mandarin duck floating on still water' },
  { src: '/images/press/hallstatt.webp', caption: 'Hallstatt, Austria, 2025', focus: [0.62, 0.62], lift: 1.3, alt: 'The lakeside church and houses of Hallstatt under a misty mountain' },
  { src: '/images/press/tea-hat.webp', caption: 'China, 2025', focus: [0.5, 0.6], lift: 1.1, alt: 'A woven straw hat resting on rows of tea bushes' },
  { src: '/images/press/black-swan.webp', caption: 'A black swan, taking its time', focus: [0.3, 0.04], lift: 1.15, alt: 'A black swan among reeds' },
] as const;

const SNAPS = [
  { src: '/images/press/panda.webp', caption: 'a panda, taking a break', alt: 'A giant panda resting its chin on a branch', ar: '672 / 900', w: 190, r: -3.5, y: 26, lift: 1.9 },
  { src: '/images/press/boat.webp', caption: 'a boatman, China', alt: 'A boatman poling a wooden boat across a hazy lake', ar: '3 / 2', w: 300, r: 2, y: 0, lift: 1 },
  { src: '/images/press/roof.webp', caption: 'rooftops, China', alt: 'Layered eaves of a traditional Chinese roof', ar: '643 / 900', w: 180, r: -1.5, y: 44, lift: 1.25 },
  { src: '/images/press/misty-peak.webp', caption: 'low cloud, Europe', alt: 'A rocky peak breaking through low cloud', ar: '3 / 2', w: 290, r: 3, y: 8, lift: 1 },
  { src: '/images/press/hk-market.webp', caption: 'after dark, Hong Kong', alt: 'A market stall glowing at night, Hong Kong', ar: '620 / 900', w: 185, r: -2.5, y: 30, lift: 1.7 },
] as const;

const MORE = [
  { name: 'LoRA Messenger', url: '/brolocator', kind: 'Personal', blurb: 'An ESP32 handheld that talks over ESP-NOW and texts over LoRa, on a circuit board I designed in KiCAD.' },
  { name: 'LUMEN', url: '/lumen', kind: 'School', blurb: 'A voice-controlled smart room. An ESP32 listens, then Whisper and DeepSeek turn what you said into one command over MQTT.' },
  { name: 'EMA Smart Home', url: '/csdp', kind: 'School team', blurb: 'A multi-node smart home run from a BeagleBone Black, with a live dashboard and a 3D Spline view.' },
  { name: 'ELEC-F', url: '/elecf', kind: 'School team', blurb: 'A walk-in freezer safety system on M5Stack that notices when someone is trapped inside and calls for help.' },
  { name: 'Pandus Dispenser', url: '/pandus', kind: 'School', blurb: 'My first school project: a six-part 3D-printed water dispenser run by an Arduino Uno.' },
];

const FRIENDS = [
  { name: 'Tan Yong Rui', url: 'https://tanyongrui11.framer.website/project/www-pentaclay-com' },
  { name: 'Md Sadiq', url: 'https://www.mdsadiq.cc' },
  { name: 'Ong Zheng Xian', url: 'https://www.ongkian.com' },
  { name: 'Joycelyn Wong', url: 'https://joycelynwong.framer.website/projects/ema' },
  { name: 'Abel Goh', url: 'https://frequent-location-124634.framer.app' },
];

/* Rough doodles render client-side only: their paths are float-heavy and
   would not match byte-for-byte between server and browser. */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

/* A dotted-leader row: label ........ value */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="pr-fact">
      <dt>{label}</dt>
      <span className="pr-leader" aria-hidden="true" />
      <dd>{value}</dd>
    </div>
  );
}

function Stamp({ href, children, ink = false, external = false, seed = 2 }: {
  href: string; children: React.ReactNode; ink?: boolean; external?: boolean; seed?: number;
}) {
  const mounted = useMounted();
  return (
    <a className={`pr-stamp${ink ? ' is-ink' : ''}`} href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      {mounted && <RoughFrame seed={seed} />}
      <span>{children}</span>
    </a>
  );
}

function Hero() {
  const mounted = useMounted();
  const [idx, setIdx] = useState(0);
  const busy = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const print = PRINTS[idx];

  const pull = () => {
    if (busy.current) return;
    busy.current = true;
    setIdx((i) => (i + 1) % PRINTS.length);
    window.setTimeout(() => { busy.current = false; }, 900);
  };

  // Warm the next photo so the next pull starts printing straight away.
  useEffect(() => {
    const next = new Image();
    next.src = PRINTS[(idx + 1) % PRINTS.length].src;
  }, [idx]);

  // Moving the pointer over the print nudges each ink drum out of register.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty('--mx', mx.toFixed(3));
    el.style.setProperty('--my', my.toFixed(3));
  };
  const onLeave = () => {
    stageRef.current?.style.setProperty('--mx', '0');
    stageRef.current?.style.setProperty('--my', '0');
  };

  return (
    <section className="pr-hero" aria-labelledby="pr-name">
      <p className="pr-hello pr-hand">hello, I&apos;m</p>
      <h1 id="pr-name" className="pr-name pr-overprint">
        <span className="pr-op-ghost" aria-hidden="true">Braven Chiam</span>
        <span className="pr-op-ink">Braven Chiam</span>
      </h1>

      <div className="pr-stage" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="pr-sheet" onClick={pull}>
          <div className="pr-sheet-shadow">{mounted && <Hatch gap={7} seed={4} />}</div>
          <RisoPrint src={print.src} alt={print.alt} focus={print.focus} lift={'lift' in print ? print.lift : 1} eager cell={5.2} cellSmall={3.7} seed={idx + 1} className="pr-hero-print" />
          <span className="pr-tape pr-tape-l" aria-hidden="true" />
          <span className="pr-tape pr-tape-r" aria-hidden="true" />
        </div>
        <div className="pr-sheet-cap">
          <p className="pr-cap-text" aria-live="polite">
            <span>{print.caption}.</span> <span className="pr-cap-no">Print {idx + 1} of {PRINTS.length}</span>
          </p>
          <div className="pr-cap-act">
            <span className="pr-note pr-hand pr-note-pull" aria-hidden="true">
              go on, pull another
              {mounted && <Arrow w={70} h={40} from={[4, 10]} to={[64, 26]} bend={-0.3} color="#1D5FA8" />}
            </span>
            <button type="button" className="pr-stamp is-ink" onClick={pull}>
              {mounted && <RoughFrame seed={5} />}
              <span>Print another</span>
            </button>
          </div>
        </div>
      </div>

      <p className="pr-lede">
        I&apos;m a 19-year-old engineering student in Singapore. I build rovers, circuit boards,
        apps and a solar-powered homelab, and I take a lot of photos along the way.
      </p>

      <nav className="pr-toc" aria-label="On this page">
        <ol>
          {[
            ['#portfolio-items-holder', 'Things I’ve made'],
            ['#photographs', 'Photographs'],
            ['#homelab', 'The homelab'],
            ['#hello', 'Say hello'],
          ].map(([href, label], i) => (
            <li key={href}>
              <a href={href}>
                <span className="pr-toc-n">({i + 1})</span>
                <span className="pr-leader" aria-hidden="true" />
                <span className="pr-toc-t">{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}

function About() {
  const mounted = useMounted();
  return (
    <section className="pr-about" aria-label="About me">
      <div className="pr-prose">
        <p>
          It started with a broken radio. I took it apart to see how it worked, and I never
          really stopped taking things apart. These days I split my time between hardware,
          software and design.
        </p>
        <p>
          I think every engineer should also be a designer. A circuit board or a chassis
          deserves the same care as an interface: it should work well, and it should feel
          like it was meant to.
        </p>
      </div>
      <figure className="pr-about-doodle">
        {mounted && <Doodle w={290} h={190} draw={drawRadio} label="A pen sketch of an old radio with its screws loose" />}
        <figcaption className="pr-hand">exhibit A: the radio</figcaption>
      </figure>
    </section>
  );
}

function Work() {
  const mounted = useMounted();
  return (
    <section className="pr-section" id="portfolio-items-holder" aria-labelledby="work-h">
      <header className="pr-head">
        <span className="pr-head-n">(1)</span>
        <h2 id="work-h">Things I&apos;ve made</h2>
        <p>My two biggest builds, then everything else I&apos;ve written up so far.</p>
      </header>

      <article className="pr-feature" aria-labelledby="june-h">
        <figure className="pr-tipin pr-tipin-l">
          <div className="pr-tipin-shadow">{mounted && <Hatch gap={6} seed={7} />}</div>
          <img src="/images/ProjJuneBanner1.webp" alt="Project June, the 5G rover, with its controller and live camera feeds" loading="lazy" width={1920} height={902} />
          <span className="pr-tape pr-tape-l" aria-hidden="true" />
        </figure>
        <div className="pr-feature-text">
          <p className="pr-note pr-hand pr-note-feature">my most ambitious build</p>
          <h3 id="june-h">Project June</h3>
          <p>
            A 5G rover that streams three live camera feeds, reports telemetry over MQTT and
            carries a full sensor suite. I took it from enclosure to firmware in three weeks.
          </p>
          <dl className="pr-facts">
            <Fact label="Live camera feeds" value="3" />
            <Fact label="Link" value="5G, WebRTC" />
            <Fact label="Onboard sensors" value="8+" />
            <Fact label="Concept to first drive" value="3 weeks" />
          </dl>
          <div className="pr-actions">
            <Stamp href="/project-june" ink seed={11}>Read the story</Stamp>
            <a className="pr-link" href="https://youtu.be/MnkJsx-nwoE" target="_blank" rel="noopener">Watch the build</a>
          </div>
        </div>
      </article>

      <article className="pr-feature is-flip" aria-labelledby="bead-h">
        <figure className="pr-tipin pr-tipin-r">
          <div className="pr-tipin-shadow">{mounted && <Hatch gap={6} seed={9} angle={-38} />}</div>
          <img src="/images/beadreader-flagship.webp" alt="BeadReader, a private book reader, shown on three phones" loading="lazy" width={1488} height={728} />
          <span className="pr-tape pr-tape-r" aria-hidden="true" />
        </figure>
        <div className="pr-feature-text">
          <p className="pr-note pr-hand pr-note-feature">made for reading with friends</p>
          <h3 id="bead-h">BeadReader</h3>
          <p>
            A private, invite-only reader for novels and webtoons. You pick up where you left
            off, see who else is reading the same book, and keep reading offline.
          </p>
          <dl className="pr-facts">
            <Fact label="Reading together" value="Live" />
            <Fact label="Content gate" value="Enforced in SQL" />
            <Fact label="Offline reading" value="Yes" />
            <Fact label="Built with" value="Next.js, Supabase" />
          </dl>
          <div className="pr-actions">
            <Stamp href="/beadreader" ink seed={13}>Read the story</Stamp>
            <a className="pr-link" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener">See the code</a>
          </div>
        </div>
      </article>

      <div className="pr-more">
        <h3 className="pr-more-h">More write-ups</h3>
        <ul className="pr-index">
          {MORE.map((p) => (
            <li key={p.url}>
              <a href={p.url}>
                <span className="pr-index-name">{p.name}</span>
                <span className="pr-index-blurb">{p.blurb}</span>
                <span className="pr-index-kind">{p.kind}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="pr-small">
          Still to be written up: the Kauli concept, Series One Light, a copy of my school&apos;s
          dev board, my first website and a live Minecraft map.
        </p>
        <p className="pr-small">
          Some of these were team efforts. I built them with{' '}
          {FRIENDS.map((f, i) => (
            <span key={f.name}>
              <a className="pr-link" href={f.url} target="_blank" rel="noopener">{f.name}</a>
              {i < FRIENDS.length - 2 ? ', ' : i === FRIENDS.length - 2 ? ' and ' : '.'}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Photos() {
  const mounted = useMounted();
  return (
    <section className="pr-section" id="photographs" aria-labelledby="photo-h">
      <header className="pr-head">
        <span className="pr-head-n">(2)</span>
        <h2 id="photo-h">Photographs</h2>
        <p>
          I take photos wherever I travel, mostly mountains, rooftops and markets after dark.
          Every print on this page is one of mine, separated into riso ink by the page itself.
        </p>
      </header>
      <div className="pr-snaps">
        {SNAPS.map((s, i) => (
          <figure key={s.src} className="pr-snap"
            style={{ '--r': `${s.r}deg`, '--y': `${s.y}px`, '--w': `${s.w}px` } as React.CSSProperties}
            onPointerEnter={(e) => { e.currentTarget.style.setProperty('--mx', '1'); e.currentTarget.style.setProperty('--my', '0.7'); }}
            onPointerLeave={(e) => { e.currentTarget.style.setProperty('--mx', '0'); e.currentTarget.style.setProperty('--my', '0'); }}>
            <div className="pr-snap-shadow">{mounted && <Hatch gap={5} seed={20 + i} />}</div>
            <RisoPrint src={s.src} alt={s.alt} cell={3.6} lift={s.lift} ragged={3} seed={30 + i}
              className="pr-snap-print" style={{ aspectRatio: s.ar }} />
            <figcaption className="pr-hand">{s.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="pr-center">
        <Stamp href="/photography" seed={17}>Browse all seven albums</Stamp>
      </p>
    </section>
  );
}

function Homelab() {
  const mounted = useMounted();
  return (
    <section className="pr-section" id="homelab" aria-labelledby="lab-h">
      <div className="pr-lab">
        <header className="pr-head pr-head-left">
          <span className="pr-head-n">(3)</span>
          <h2 id="lab-h">The homelab</h2>
        </header>
        <div className="pr-prose">
          <p>
            A small rack at home runs my photo library, my files and the MQTT and TURN servers
            my hardware projects talk to. It runs on solar export credits. This site lives
            on Vercel, though.
          </p>
        </div>
        <dl className="pr-facts">
          <Fact label="Servers" value="3" />
          <Fact label="Usable storage" value="24 TB" />
          <Fact label="Self-hosted apps" value="38" />
          <Fact label="Powered by" value="Solar export credits" />
        </dl>
        <div className="pr-actions">
          <Stamp href="/homelab" seed={19}>Tour the homelab</Stamp>
        </div>
        <figure className="pr-rack">
          {mounted && <Doodle w={270} h={290} draw={drawRack} label="A pen sketch of a server rack under the sun" />}
          <span className="pr-rack-leds" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((u) => <i key={u} style={{ top: `${((60 + u * 42) / 290) * 100}%`, animationDelay: `${u * 0.37}s` }} />)}
          </span>
        </figure>
      </div>
    </section>
  );
}

function Hello() {
  return (
    <section className="pr-end" id="hello" aria-labelledby="hello-h">
      <span className="pr-head-n">(4)</span>
      <h2 id="hello-h" className="pr-end-h pr-overprint">
        <span className="pr-op-ghost" aria-hidden="true">Say hello</span>
        <span className="pr-op-ink">Say hello</span>
      </h2>
      <p className="pr-end-p">
        Got a project in mind, a question about one of mine, or a photo you liked?
        I would love to hear about it.
      </p>
      <p><a className="pr-email" href="mailto:braven@chiambucket.com">braven@chiambucket.com</a></p>
      <p className="pr-end-more"><a className="pr-link" href="/contact">Other ways to reach me</a></p>
    </section>
  );
}

export default function HomeClient() {
  return (
    <main className="pr-home">
      {/* Ink texture for overprinted type: rough edges plus flecks where the ink skipped */}
      <svg className="pr-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="pr-ink" x="-4%" y="-8%" width="108%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 5.7" result="flecks" />
          <feComposite in="rough" in2="flecks" operator="in" />
        </filter>
      </svg>
      <Hero />
      <About />
      <Work />
      <Photos />
      <Homelab />
      <Hello />
    </main>
  );
}
