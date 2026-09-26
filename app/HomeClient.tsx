'use client';
import { useEffect, useRef, useState } from 'react';
import RisoPrint, { type Flood } from '../components/press/RisoPrint';
import Plate from '../components/press/Plate';

/* Photographs are Braven's own, from his Lychee albums. The riso separation
   happens in the browser (components/press/RisoPrint.tsx). */
const PLATES = [
  { src: '/images/press/nz-mountains.webp', caption: 'New Zealand, 2026', focus: [0.5, 0.35], lift: 1, alt: 'Snow-capped mountains under heavy cloud, New Zealand' },
  { src: '/images/press/hallstatt.webp', caption: 'Hallstatt, Austria, 2025', focus: [0.6, 0.45], lift: 1.25, alt: 'The lakeside church and houses of Hallstatt under a misty mountain' },
  { src: '/images/press/hk-estate.webp', caption: 'Hong Kong, 2026', focus: [0.5, 0.45], lift: 1, alt: 'A pastel housing estate rising over a basketball court, Hong Kong' },
  { src: '/images/press/mandarin-duck.webp', caption: 'China, 2025', focus: [0.46, 0.4], lift: 1, alt: 'A mandarin duck floating on still water' },
  { src: '/images/press/tea-hat.webp', caption: 'China, 2025', focus: [0.5, 0.55], lift: 1.1, alt: 'A woven straw hat resting on rows of tea bushes' },
  { src: '/images/press/black-swan.webp', caption: 'A black swan', focus: [0.3, 0.1], lift: 1.15, alt: 'A black swan among reeds' },
] as const;

/* The hero's bottom edge is printed with a deepening blue and pink tint
   (a split-fountain gradient) so the name can be knocked out of it. */
const HERO_FLOOD: Flood = { from: 0.42, blue: 0.62, pink: 0.46 };

type Shot = { src: string; caption: string; alt: string; shape: 'wide' | 'tall'; row: 'a' | 'b' | 'c' | 'd'; span: number; focus?: readonly [number, number]; lift?: number };
const GALLERY: Shot[] = [
  { src: '/images/press/nz-lake.webp', caption: 'New Zealand, 2026', alt: 'A turquoise lake below a long snowy range, New Zealand', shape: 'wide', row: 'a', span: 8 },
  { src: '/images/press/roof.webp', caption: 'China, 2025', alt: 'Layered eaves of a traditional Chinese roof', shape: 'tall', row: 'a', span: 4, lift: 1.15 },
  { src: '/images/press/panda.webp', caption: 'China, 2025', alt: 'A giant panda resting its chin on a branch', shape: 'tall', row: 'b', span: 4, lift: 1.6, focus: [0.5, 0.35] },
  { src: '/images/press/boat.webp', caption: 'China, 2025', alt: 'A boatman poling a wooden boat across a hazy lake', shape: 'wide', row: 'b', span: 4, focus: [0.62, 0.5] },
  { src: '/images/press/hk-market.webp', caption: 'Hong Kong, 2026', alt: 'A market stall glowing at night, Hong Kong', shape: 'tall', row: 'b', span: 4, lift: 1.5 },
  { src: '/images/press/lone-tree.webp', caption: 'New Zealand, 2026', alt: 'A lone tree standing in a lake, New Zealand', shape: 'tall', row: 'c', span: 4 },
  { src: '/images/press/misty-peak.webp', caption: 'Europe, 2025', alt: 'A rocky peak breaking through low cloud', shape: 'wide', row: 'c', span: 8 },
  { src: '/images/press/elephant.webp', caption: 'China, 2025', alt: 'An elephant with long tusks, in black and white', shape: 'wide', row: 'd', span: 6, lift: 1.3 },
  { src: '/images/press/night-bridge.webp', caption: 'China, 2025', alt: 'A lit stone bridge reflected in a river at night', shape: 'wide', row: 'd', span: 6, lift: 1.25 },
];

const MORE = [
  { name: 'LoRA Messenger', url: '/brolocator', kind: 'Personal', img: '/images/press/lora-desk.webp', focus: '50% 40%', alt: 'The LoRA Messenger handheld on a wooden desk', blurb: 'An ESP32 handheld that talks over ESP-NOW and texts over LoRa, on a circuit board I designed in KiCAD.' },
  { name: 'LUMEN', url: '/lumen', kind: 'School', img: '/images/press/lumen-bench.webp', focus: '50% 50%', alt: 'The LUMEN prototype on a breadboard', blurb: 'A voice-controlled smart room. An ESP32 listens, then Whisper and DeepSeek turn what you said into one command over MQTT.' },
  { name: 'EMA Smart Home', url: '/csdp', kind: 'School team', img: '/images/csdp1.webp', focus: '50% 50%', alt: 'A model house wired with smart-home nodes, seen from above', blurb: 'A multi-node smart home run from a BeagleBone Black, with a live dashboard and a 3D Spline view.' },
  { name: 'ELEC-F', url: '/elecf', kind: 'School team', img: '/images/press/elecf-proto.webp', focus: '50% 50%', alt: 'The ELEC-F prototype: an M5Stack controller on a cardboard freezer model', blurb: 'A walk-in freezer safety system on M5Stack that notices when someone is trapped inside and calls for help.' },
  { name: 'Pandus Dispenser', url: '/pandus', kind: 'School', img: '/images/press/pandus-shoot.webp', focus: '55% 50%', alt: 'The Pandus dispenser lit on a stool during its photo shoot', blurb: 'My first school project: a six-part 3D-printed water dispenser run by an Arduino Uno.' },
];

const FRIENDS = [
  { name: 'Tan Yong Rui', url: 'https://tanyongrui11.framer.website/project/www-pentaclay-com' },
  { name: 'Md Sadiq', url: 'https://www.mdsadiq.cc' },
  { name: 'Ong Zheng Xian', url: 'https://www.ongkian.com' },
  { name: 'Joycelyn Wong', url: 'https://joycelynwong.framer.website/projects/ema' },
  { name: 'Abel Goh', url: 'https://frequent-location-124634.framer.app' },
];

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

function Hero() {
  const [idx, setIdx] = useState(0);
  const busy = useRef(false);
  const plateRef = useRef<HTMLDivElement>(null);
  const plate = PLATES[idx];

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    setIdx((i) => (i + 1) % PLATES.length);
    window.setTimeout(() => { busy.current = false; }, 1200);
  };

  // Warm the next photo so the next pull starts straight away.
  useEffect(() => {
    const img = new Image();
    img.src = PLATES[(idx + 1) % PLATES.length].src;
  }, [idx]);

  // The pointer nudges each ink drum a little out of register.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !plateRef.current) return;
    const r = plateRef.current.getBoundingClientRect();
    plateRef.current.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    plateRef.current.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const onLeave = () => {
    plateRef.current?.style.setProperty('--mx', '0');
    plateRef.current?.style.setProperty('--my', '0');
  };

  return (
    <section className="pr-hero" aria-labelledby="pr-name">
      <div className="pr-hero-row">
        <RisoPrint src="/images/press/roof.webp" alt="" focus={[0.5, 0.6]} lift={1.15} seed={71} eager className="pr-strip" />
        <div className="pr-hero-plate" ref={plateRef} onPointerMove={onMove} onPointerLeave={onLeave} onClick={next}>
          <RisoPrint
            src={plate.src} alt={plate.alt} focus={plate.focus} lift={plate.lift}
            flood={HERO_FLOOD} layered eager cell={3.1} cellSmall={2.2} seed={idx + 1}
            className="pr-hero-print"
          />
          <div className="pr-hero-title">
            <h1 id="pr-name" className="pr-name">Braven Chiam</h1>
            <p className="pr-hero-sub">Engineer, designer and photographer in Singapore</p>
          </div>
        </div>
        <RisoPrint src="/images/press/hk-market.webp" alt="" focus={[0.5, 0.5]} lift={1.5} seed={73} eager className="pr-strip" />
      </div>
      <div className="pr-hero-cap">
        <p aria-live="polite">
          <span className="pr-cap-place">{plate.caption}</span>
          <span className="pr-cap-no">Plate {idx + 1} of {PLATES.length}</span>
        </p>
        <button type="button" className="pr-textbtn" onClick={next}>Next plate</button>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="pr-intro" aria-label="Introduction">
      <p className="pr-lede">
        I&apos;m Braven, an Electronic and Computer Engineering student at Nanyang Polytechnic.
        I build rovers, circuit boards, apps and a solar-powered homelab, and I photograph the
        places I travel to.
      </p>
      <nav className="pr-toc" aria-label="On this page">
        <ol>
          {[
            ['#portfolio-items-holder', 'Selected work'],
            ['#photographs', 'Photographs'],
            ['#homelab', 'The homelab'],
            ['#hello', 'Contact'],
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
      <div className="pr-about">
        <figure className="pr-fig pr-about-fig">
          <Plate src="/images/press/lora-parts.webp" alt="The 3D-printed LoRA Messenger case laid out in pieces on a wooden desk" ratio="4 / 3" />
          <figcaption>The LoRA Messenger case, in pieces.</figcaption>
        </figure>
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
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="pr-section" id="portfolio-items-holder" aria-labelledby="work-h">
      <header className="pr-head">
        <span className="pr-head-n">(1)</span>
        <h2 id="work-h">Selected work</h2>
        <p>My two biggest builds, then everything else I&apos;ve written up so far.</p>
      </header>

      <article className="pr-june" aria-labelledby="june-h">
        <figure className="pr-fig">
          <a href="/project-june" className="pr-lift" tabIndex={-1} aria-hidden="true">
            <Plate src="/images/press/june-night.webp" alt="" ratio="2.3 / 1" focus="50% 55%" />
          </a>
          <figcaption>Project June, photographed at night.</figcaption>
        </figure>
        <div className="pr-june-body">
          <div>
            <p className="pr-kind">Personal project</p>
            <h3 id="june-h"><a href="/project-june">Project June</a></h3>
            <p>
              A 5G rover that streams three live camera feeds, reports telemetry over MQTT and
              carries a full sensor suite. I took it from enclosure to firmware in three weeks.
            </p>
            <div className="pr-actions">
              <a className="pr-btn is-solid" href="/project-june">Read the write-up</a>
              <a className="pr-btn" href="https://youtu.be/MnkJsx-nwoE" target="_blank" rel="noopener">Watch the build</a>
            </div>
          </div>
          <dl className="pr-facts">
            <Fact label="Live camera feeds" value="3" />
            <Fact label="Link" value="5G, WebRTC" />
            <Fact label="Onboard sensors" value="8+" />
            <Fact label="Telemetry" value="MQTT" />
            <Fact label="Concept to first drive" value="3 weeks" />
          </dl>
        </div>
      </article>

      <article className="pr-bead" aria-labelledby="bead-h">
        <div className="pr-bead-text">
          <p className="pr-kind">Personal project</p>
          <h3 id="bead-h"><a href="/beadreader">BeadReader</a></h3>
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
            <a className="pr-btn is-solid" href="/beadreader">Read the write-up</a>
            <a className="pr-btn" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener">See the code</a>
          </div>
        </div>
        <div className="pr-bead-screens">
          {[
            ['/images/beadreader/reader-paper.webp', 'The BeadReader reading view, a chapter set on a paper theme'],
            ['/images/beadreader/contents-light.webp', 'A book page in BeadReader showing who else is reading it'],
            ['/images/beadreader/stats-detail-light.webp', 'Reading stats for one reader, with a chart of when they read'],
          ].map(([src, alt], i) => (
            <figure key={src} className="pr-fig pr-screen" style={{ '--i': i } as React.CSSProperties}>
              <Plate src={src} alt={alt} ratio="880 / 1300" focus="50% 0%" />
            </figure>
          ))}
        </div>
      </article>

      <div className="pr-more">
        <h3 className="pr-more-h">More write-ups</h3>
        <ul className="pr-cards">
          {MORE.map((p, i) => (
            <li key={p.url} className={i < 2 ? 'is-big' : ''}>
              <a href={p.url} className="pr-card">
                <span className="pr-lift"><Plate src={p.img} alt={p.alt} ratio={i < 2 ? '3 / 2' : '4 / 3'} focus={p.focus} /></span>
                <span className="pr-card-kind">{p.kind}</span>
                <span className="pr-card-name">{p.name}</span>
                <span className="pr-card-blurb">{p.blurb}</span>
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
  return (
    <section className="pr-section" id="photographs" aria-labelledby="photo-h">
      <header className="pr-head">
        <span className="pr-head-n">(2)</span>
        <h2 id="photo-h">Photographs</h2>
        <p>
          I take photos wherever I travel, mostly mountains, rooftops and streets after dark.
          Each one here is separated into riso ink by the page itself.
        </p>
      </header>
      <div className="pr-gallery">
        {GALLERY.map((s, i) => (
          <figure key={s.src} className={`pr-fig pr-shot is-${s.shape} row-${s.row}`} style={{ '--span': s.span } as React.CSSProperties}>
            <a href="/photography" className="pr-lift" aria-label={`${s.alt}. Open the photography page`}>
              <RisoPrint src={s.src} alt="" focus={s.focus} lift={s.lift} seed={40 + i} cell={2.8} cellSmall={2.1} className="pr-shot-print" />
            </a>
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="pr-center">
        <a className="pr-btn" href="/photography">See all seven albums</a>
      </p>
    </section>
  );
}

function Homelab() {
  return (
    <section className="pr-section" id="homelab" aria-labelledby="lab-h">
      <div className="pr-lab">
        <div className="pr-lab-text">
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
            <a className="pr-btn" href="/homelab">Tour the homelab</a>
          </div>
        </div>
        <figure className="pr-fig pr-lab-fig">
          <Plate src="/images/press/rack.webp" alt="The homelab rack: a tall black cabinet of servers and network gear" ratio="637 / 1060" focus="50% 30%" />
          <figcaption>The homelab rack.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="pr-end" id="hello" aria-labelledby="hello-h">
      <span className="pr-head-n">(4)</span>
      <h2 id="hello-h" className="pr-end-h">Say hello</h2>
      <p className="pr-end-p">
        Got a project in mind, a question about one of mine, or a photo you liked?
        I would like to hear about it.
      </p>
      <p><a className="pr-email" href="mailto:braven@chiambucket.com">braven@chiambucket.com</a></p>
      <p className="pr-end-more"><a className="pr-link" href="/contact">Other ways to reach me</a></p>
    </section>
  );
}

export default function HomeClient() {
  return (
    <main className="pr-home">
      <Hero />
      <Intro />
      <Work />
      <Photos />
      <Homelab />
      <Contact />
    </main>
  );
}
