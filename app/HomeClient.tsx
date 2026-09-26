'use client';
import { useEffect, useRef, useState } from 'react';
import RisoPrint from '../components/press/RisoPrint';

/*
  Homepage in the Swiss (International Typographic) style: one grotesque,
  a twelve-column grid, flush-left ragged-right text, rules between
  sections, and one spot colour. The hero photograph is printed in red and
  black by the page (components/press/RisoPrint.tsx); every other photo is
  shown as it is. Styles: app/swiss.css (sw-* classes).
*/

/* Braven's own photographs, from his Lychee albums. */
const PLATES = [
  { src: '/images/press/hk-estate.webp', caption: 'Hong Kong, 2026', focus: [0.5, 0.35], lift: 1.05, alt: 'A pastel housing estate rising over a basketball court, Hong Kong' },
  { src: '/images/press/nz-mountains.webp', caption: 'New Zealand, 2026', focus: [0.5, 0.45], lift: 1, alt: 'Snow-capped mountains under heavy cloud, New Zealand' },
  { src: '/images/press/hallstatt.webp', caption: 'Hallstatt, Austria, 2025', focus: [0.6, 0.45], lift: 1.35, alt: 'The lakeside church and houses of Hallstatt under a misty mountain' },
  { src: '/images/press/tea-hat.webp', caption: 'China, 2025', focus: [0.5, 0.55], lift: 1.2, alt: 'A woven straw hat resting on rows of tea bushes' },
  { src: '/images/press/mandarin-duck.webp', caption: 'China, 2025', focus: [0.46, 0.4], lift: 1.15, alt: 'A mandarin duck floating on still water' },
  { src: '/images/press/black-swan.webp', caption: 'A black swan', focus: [0.3, 0.1], lift: 1.3, alt: 'A black swan among reeds' },
] as const;

/* The photo grid: three rows, each adding up to twelve columns. */
const GALLERY = [
  { src: '/images/press/nz-lake.webp', caption: 'New Zealand, 2026', alt: 'A turquoise lake below a long snowy range, New Zealand', span: 6, row: 1 },
  { src: '/images/press/roof.webp', caption: 'China, 2025', alt: 'Layered eaves of a traditional Chinese roof', span: 3, row: 1 },
  { src: '/images/press/panda.webp', caption: 'China, 2025', alt: 'A giant panda resting its chin on a branch', span: 3, row: 1, focus: '50% 30%' },
  { src: '/images/press/hk-market.webp', caption: 'Hong Kong, 2026', alt: 'A market stall glowing at night, Hong Kong', span: 3, row: 2 },
  { src: '/images/press/lone-tree.webp', caption: 'New Zealand, 2026', alt: 'A lone tree standing in a lake, New Zealand', span: 3, row: 2 },
  { src: '/images/press/misty-peak.webp', caption: 'Europe, 2025', alt: 'A rocky peak breaking through low cloud', span: 6, row: 2 },
  { src: '/images/press/boat.webp', caption: 'China, 2025', alt: 'A boatman poling a wooden boat across a hazy lake', span: 4, row: 3, focus: '62% 50%' },
  { src: '/images/press/elephant.webp', caption: 'China, 2025', alt: 'An elephant with long tusks, in black and white', span: 4, row: 3 },
  { src: '/images/press/night-bridge.webp', caption: 'China, 2025', alt: 'A lit stone bridge reflected in a river at night', span: 4, row: 3 },
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

const pad = (n: number) => String(n).padStart(2, '0');

function Facts({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="sw-facts">
      {rows.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function Photo({ src, alt, focus = '50% 50%', className = '' }: { src: string; alt: string; focus?: string; className?: string }) {
  return <img className={`sw-photo ${className}`} src={src} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: focus }} />;
}

/* A section opens with a full-width rule, its number in the first two
   columns and the heading in the rest. */
function SectionHead({ n, id, title, intro }: { n: string; id: string; title: string; intro?: string }) {
  return (
    <header className="sw-shead">
      <span className="sw-num" aria-hidden="true">{n}</span>
      <div className="sw-shead-main">
        <h2 id={id}>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}

function Hero() {
  const [idx, setIdx] = useState(0);
  const busy = useRef(false);
  const printRef = useRef<HTMLElement>(null);
  const plate = PLATES[idx];

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    setIdx((i) => (i + 1) % PLATES.length);
    window.setTimeout(() => { busy.current = false; }, 1100);
  };

  // Warm the next photo so the next print starts straight away.
  useEffect(() => {
    const img = new Image();
    img.src = PLATES[(idx + 1) % PLATES.length].src;
  }, [idx]);

  // The pointer nudges the two ink drums slightly out of register.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !printRef.current) return;
    const r = printRef.current.getBoundingClientRect();
    printRef.current.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    printRef.current.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const onLeave = () => {
    printRef.current?.style.setProperty('--mx', '0');
    printRef.current?.style.setProperty('--my', '0');
  };

  return (
    <header className="sw-hero">
      <div className="sw-grid">
        <h1 className="sw-name"><span>Braven</span> <span>Chiam</span></h1>

        <div className="sw-hero-meta">
          <p>Engineer, designer and photographer</p>
          <p>Singapore</p>
        </div>

        <div className="sw-hero-text">
          <p className="sw-lede">
            I&apos;m an Electronic and Computer Engineering student at Nanyang Polytechnic.
            I build rovers, circuit boards, apps and a solar-powered homelab, and I photograph
            the places I travel to.
          </p>
          <nav aria-label="On this page">
            <ol className="sw-index">
              {[
                ['#portfolio-items-holder', 'Selected work'],
                ['#photographs', 'Photographs'],
                ['#homelab', 'The homelab'],
                ['#hello', 'Contact'],
              ].map(([href, label], i) => (
                <li key={href}><a href={href}><span>{pad(i + 1)}</span>{label}</a></li>
              ))}
            </ol>
          </nav>
        </div>

        <figure className="sw-hero-fig" ref={printRef} onPointerMove={onMove} onPointerLeave={onLeave}>
          <button type="button" className="sw-hero-hit" onClick={next} tabIndex={-1} aria-hidden="true" />
          <RisoPrint
            src={plate.src} alt={plate.alt} focus={plate.focus} lift={plate.lift}
            mode="duotone" layered eager cell={2.8} cellSmall={2.2} seed={idx + 1}
            className="sw-hero-print"
          />
          <figcaption className="sw-cap-row">
            <span className="sw-cap-no">{pad(idx + 1)}/{pad(PLATES.length)}</span>
            <span aria-live="polite">{plate.caption}</span>
            <button type="button" className="sw-textbtn" onClick={next}>Next photograph</button>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}

function About() {
  return (
    <section className="sw-section" aria-labelledby="about-h">
      <div className="sw-grid sw-ruled">
        <span className="sw-label" id="about-h">About</span>
        <figure className="sw-about-fig">
          <Photo src="/images/press/lora-parts.webp" alt="The 3D-printed LoRA Messenger case laid out in pieces on a wooden desk" />
          <figcaption>The LoRA Messenger case, in pieces.</figcaption>
        </figure>
        <div className="sw-about-text">
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
    <section className="sw-section" id="portfolio-items-holder" aria-labelledby="work-h">
      <div className="sw-grid sw-ruled">
        <SectionHead n="01" id="work-h" title="Selected work" intro="My two biggest builds, then everything else I've written up so far." />

        {/* Project June */}
        <span className="sw-label sw-row-start">Personal project</span>
        <a className="sw-june-fig" href="/project-june" tabIndex={-1} aria-hidden="true">
          <Photo src="/images/press/june-night.webp" alt="" focus="50% 55%" />
        </a>
        <div className="sw-june-text">
          <h3><a href="/project-june">Project June</a></h3>
          <p>
            A 5G rover that streams three live camera feeds, reports telemetry over MQTT and
            carries a full sensor suite. I took it from enclosure to firmware in three weeks.
          </p>
          <div className="sw-actions">
            <a className="sw-btn" href="/project-june">Read the write-up</a>
            <a className="sw-btn is-line" href="https://youtu.be/MnkJsx-nwoE" target="_blank" rel="noopener">Watch the build</a>
          </div>
        </div>
        <div className="sw-june-facts">
          <Facts rows={[['Live camera feeds', '3'], ['Link', '5G, WebRTC'], ['Onboard sensors', '8+'], ['Telemetry', 'MQTT'], ['Concept to first drive', '3 weeks']]} />
        </div>

        {/* BeadReader */}
        <span className="sw-label sw-row-start sw-bead-label">Personal project</span>
        <div className="sw-bead-text">
          <h3><a href="/beadreader">BeadReader</a></h3>
          <p>
            A private, invite-only reader for novels and webtoons. You pick up where you left
            off, see who else is reading the same book, and keep reading offline.
          </p>
          <Facts rows={[['Reading together', 'Live'], ['Content gate', 'Enforced in SQL'], ['Offline reading', 'Yes'], ['Built with', 'Next.js, Supabase']]} />
          <div className="sw-actions">
            <a className="sw-btn" href="/beadreader">Read the write-up</a>
            <a className="sw-btn is-line" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener">See the code</a>
          </div>
        </div>
        <div className="sw-bead-screens">
          {[
            ['/images/beadreader/reader-paper.webp', 'The BeadReader reading view, a chapter set on a paper theme'],
            ['/images/beadreader/contents-light.webp', 'A book page in BeadReader showing who else is reading it'],
            ['/images/beadreader/stats-detail-light.webp', 'Reading stats for one reader, with a chart of when they read'],
          ].map(([src, alt]) => <Photo key={src} src={src} alt={alt} focus="50% 0%" className="sw-screen" />)}
        </div>

        {/* More write-ups, as an index */}
        <span className="sw-label sw-row-start sw-more-label">More write-ups</span>
        <ul className="sw-list">
          {MORE.map((p) => (
            <li key={p.url}>
              <a href={p.url}>
                <span className="sw-list-kind">{p.kind}</span>
                <span className="sw-list-name">{p.name}</span>
                <span className="sw-list-blurb">{p.blurb}</span>
                <Photo src={p.img} alt={p.alt} focus={p.focus} className="sw-list-img" />
              </a>
            </li>
          ))}
        </ul>

        <div className="sw-notes">
          <p>
            Still to be written up: the Kauli concept, Series One Light, a copy of my school&apos;s
            dev board, my first website and a live Minecraft map.
          </p>
          <p>
            Some of these were team efforts. I built them with{' '}
            {FRIENDS.map((f, i) => (
              <span key={f.name}>
                <a className="sw-link" href={f.url} target="_blank" rel="noopener">{f.name}</a>
                {i < FRIENDS.length - 2 ? ', ' : i === FRIENDS.length - 2 ? ' and ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Photographs() {
  return (
    <section className="sw-section" id="photographs" aria-labelledby="photo-h">
      <div className="sw-grid sw-ruled">
        <SectionHead n="02" id="photo-h" title="Photographs"
          intro="I take photos wherever I travel, mostly mountains, rooftops and streets after dark." />
        <div className="sw-gallery">
          {GALLERY.map((g) => (
            <figure key={g.src} className={`sw-shot row-${g.row} span-${g.span}`}>
              <a href="/photography" aria-label={`${g.alt}. Open the photography page`}>
                <Photo src={g.src} alt="" focus={g.focus} />
              </a>
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="sw-after-gallery">
          <a className="sw-btn is-line" href="/photography">See all seven albums</a>
        </div>
      </div>
    </section>
  );
}

function Homelab() {
  return (
    <section className="sw-section" id="homelab" aria-labelledby="lab-h">
      <div className="sw-grid sw-ruled">
        <SectionHead n="03" id="lab-h" title="The homelab" />
        <div className="sw-lab-text">
          <p>
            A small rack at home runs my photo library, my files and the MQTT and TURN servers
            my hardware projects talk to. It runs on solar export credits. This site lives on
            Vercel, though.
          </p>
          <Facts rows={[['Servers', '3'], ['Usable storage', '24 TB'], ['Self-hosted apps', '38'], ['Powered by', 'Solar export credits']]} />
          <div className="sw-actions">
            <a className="sw-btn" href="/homelab">Tour the homelab</a>
          </div>
        </div>
        <figure className="sw-lab-fig">
          <Photo src="/images/press/rack.webp" alt="The homelab rack: a tall black cabinet of servers and network gear" focus="50% 30%" />
          <figcaption>The homelab rack.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="sw-section sw-contact" id="hello" aria-labelledby="hello-h">
      <div className="sw-grid sw-ruled">
        <SectionHead n="04" id="hello-h" title="Say hello"
          intro="Got a project in mind, a question about one of mine, or a photo you liked? I would like to hear about it." />
        <a className="sw-email" href="mailto:braven@chiambucket.com">braven@chiambucket.com</a>
        <p className="sw-contact-more"><a className="sw-link" href="/contact">Other ways to reach me</a></p>
      </div>
    </section>
  );
}

export default function HomeClient() {
  return (
    <main className="sw-home">
      <Hero />
      <About />
      <Work />
      <Photographs />
      <Homelab />
      <Contact />
    </main>
  );
}
