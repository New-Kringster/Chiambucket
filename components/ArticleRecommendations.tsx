'use client';
import { useState, useEffect } from 'react';

const AC = () => <svg aria-hidden="true"><use href="#arec-arrow-circle" /></svg>;
const AU = () => <svg aria-hidden="true"><use href="#arec-arrow-ur" /></svg>;
const SR = () => <svg aria-hidden="true"><use href="#arec-search" /></svg>;
const ST = () => <svg aria-hidden="true"><use href="#arec-star" /></svg>;

function ModalContent({ id, close }: { id: string; close: () => void }) {
  const nav = (url: string) => () => { window.location.href = url; };
  const ext = (url: string) => () => { window.open(url, '_blank'); };

  const chapter = (num: string, title: string, body: React.ReactNode) => (
    <section className="hp-rd-chapter" key={num}>
      <span className="hp-rd-ch-num">{num}</span>
      <div className="hp-rd-ch-body"><h4>{title}</h4>{body}</div>
    </section>
  );

  const cta = (text: string, sub: string, btnLabel: string, btnUrl: string, ghost?: { label: string; url: string }) => (
    <div className="hp-rd-cta">
      <div className="hp-rd-cta-text"><strong>{text}</strong><span>{sub}</span></div>
      <button className="hp-btn" onClick={nav(btnUrl)}>{btnLabel} <AC /></button>
      {ghost && <button className="hp-btn hp-btn-ghost" onClick={nav(ghost.url)}>{ghost.label}</button>}
    </div>
  );

  const hero = (img: string, alt: string, tags: string[], type: 'highlight' | 'personal' | 'school') => (
    <div className="hp-rd-hero">
      <img src={img} alt={alt} />
      <div className="hp-rd-hero-tags">
        {tags.map(t => <span key={t} className={`hp-md-tag ${t === 'Highlights' ? 'highlight' : type}`}>{t}</span>)}
      </div>
    </div>
  );

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('/images/ProjJuneBanner1.webp', 'Project June rover', ['Highlights', 'Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 Weeks · High Difficulty · Self-Learnt · 3D Design · Cellular · WebRTC · MQTT</p>
          <p className="hp-rd-lead">A 5G radio-controlled vehicle I designed end to end in three weeks, from the Onshape chassis to the firmware. It streams three live cameras, carries a full sensor suite, and drives from an Xbox controller anywhere with signal.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/1nbiYCAtGPA" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Three live video streams', <><p>Three cameras stream live over WebRTC, routed through a TURN server so the feeds punch through cellular NAT with low latency.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Project June cameras" loading="lazy" /></>)}
          {chapter('02', 'Control and telemetry', <p>MQTT carries control and telemetry over a Mosquitto broker, with custom PWM motor control and servo steering driven from an Xbox controller.</p>)}
          {chapter('03', 'A full sensor suite', <><p>Neo8M GPS, gyroscope, accelerometer, magnetometer, barometer, ultrasonic distance sensor, DHT11, and a TEMT6000 light sensor.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="System architecture" loading="lazy" /></>)}
          {cta('Want the full build log?', 'Photos, the architecture and every problem I hit.', 'Read the full article', '/project-june')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('/images/borlocator-pf-context.webp', 'LoRA Messenger', ['Highlights', 'Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 Months · High Difficulty · Self-Learnt · 3D Design · PCB Design</p>
          <p className="hp-rd-lead">A pair of handheld ESP32 messengers that talk to each other off-grid: text over long-range LoRa and two-way voice over ESP-NOW.</p>
          {chapter('01', 'Two radios, two jobs', <><p>LoRa carries text over long range, while ESP-NOW carries low-latency two-way voice. Programmed on PlatformIO with the Arduino framework.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="LoRA Messenger internals" loading="lazy" /></>)}
          {chapter('02', 'A custom PCB, reflowed by hand', <><p>I designed the board in KiCAD and reflow-soldered the SMD components myself. A TP4056 circuit handles charging.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="Custom PCB" loading="lazy" /></>)}
          {chapter('03', 'Audio and enclosure', <><p>An I2S microphone and speaker handle calls, dual OLED displays show messages and status, all in a 3D-printed Onshape case.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D-printed case" loading="lazy" /></>)}
          {cta('See how it came together', 'The breadboard, the PCB respins and the takeaways.', 'Read the full article', '/brolocator')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('/images/Ema-pf-context.webp', 'EMA Smart Home System', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA Smart Home System</h2>
          <p className="hp-md-meta">3 Months · High Difficulty · School Group Project · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">A five-node smart-home system built with my team. Each node owns a job, and a central controller ties them together behind a live 3D web dashboard.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Five nodes, one job each', <><p>Climate, bathroom, kitchen (energy and flame), and intrusion detection. Each node has its own buzzer for local alerts.</p><img className="hp-rd-fig" src="/images/csdp2.webp" alt="EMA sensor node" loading="lazy" /></>)}
          {chapter('02', 'A controller that coordinates', <><p>BeagleBone Black Wireless with a MikroBus cape collects sensor data over SocketIO and hosts the Flask dashboard.</p><img className="hp-rd-fig" src="/images/csdp6.webp" alt="EMA central controller" loading="lazy" /></>)}
          {chapter('03', 'A live 3D dashboard', <><p>The frontend shows live data on an interactive Spline 3D map of the home, so the whole system&apos;s state is readable at a glance.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="EMA 3D dashboard" loading="lazy" /></>)}
          {cta('Try it or read the write-up', 'A live demo of the dashboard, plus the full project article.', 'Live demo', 'https://csdpdemo.chiambucket.com', { label: 'Read the article', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('/images/pandusarticle.webp', 'Pandus Dispenser', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus Dispenser</h2>
          <p className="hp-md-meta">1 Month · Medium Difficulty · First School Project · 3D Design · PyFirmata</p>
          <p className="hp-rd-lead">My very first school project: a six-part 3D-printed water dispenser that taught me how to bring mechanical design, electronics and code together.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'What it does', <><p>Three selectable water levels, automatic wake on approach, a self-closing door, and a high-brightness LED to light the cup.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Pandus in use" loading="lazy" /></>)}
          {chapter('02', 'Control and components', <><p>An Arduino Uno R3 driven with PyFirmata coordinates a servo, LEDs, relays, buttons, a peristaltic pump and an infrared distance sensor.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Pandus internals" loading="lazy" /></>)}
          {cta('The first one always teaches the most', "The full build and what I'd do differently now.", 'Read the full article', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('/images/elef2-pf-context.webp', 'ELEC-F Safe Freezer System', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F Concept</h2>
          <p className="hp-md-meta">Safe Freezer Storage System · Team of 4 · Engineering Course · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">A freezer safety system my team and I designed for an engineering course. Walk-in factory freezers can trap the people working inside them, so ELEC-F watches the door and the room and sounds the alarm before the cold turns dangerous.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'The problem', <><p>Faulty latches, frozen seals or simple unawareness can leave a worker shut inside a walk-in freezer, where hypothermia sets in fast. ELEC-F exists to cut that time down and reassure whoever is trapped.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="The ELEC-F freezer prototype" loading="lazy" /></>)}
          {chapter('02', 'How it works', <><p>A ToF sensor reads whether the door is open or closed, and a PIR sensor checks if anyone is still inside. Shut the door with a person in, and a timer arms. Overrun it, and the RGB unit flashes while the buzzer sounds.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="ELEC-F armed state on the M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Built on M5Stack', <><p>Two M5Stack Fire controllers and a Mini Hub tie the ToF, PIR and RGB units together, chosen because they keep working at the sub-zero temperatures a freezer demands.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="The M5Stack controller wired to its sensors" loading="lazy" /></>)}
          {cta('See the full concept', 'The research, the build and an interactive walkthrough.', 'Read the full article', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('/images/kauli3-pf-context.webp', 'Kauli Concept', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli Concept</h2>
          <p className="hp-md-meta">Concept · Communication Skills · 3D in Blender</p>
          <p className="hp-rd-lead">An original product concept I created and pitched for a communication-skills project, presented with 3D scenes built in Blender.</p>
          {chapter('01', 'Idea to presentation', <><p>The brief was as much about communicating an idea as having one. I designed the concept, rendered it in Blender, and built the deck around making it land with an audience.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Kauli concept render" loading="lazy" /></>)}
          {cta('See the concept and pitch', 'Renders, reasoning and the final presentation.', 'Read the full article', '/comingsoon')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('/images/Series1l-pf-context.webp', 'Series One Light', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Personal · 3D Design · Ultralight 20g</p>
          <p className="hp-rd-lead">My own take on the popular ZeroMouse: an ultralight 20g gaming mouse I designed from scratch to play a little sharper in FPS games.</p>
          {chapter('01', 'Designing for grams', <p>Every part of the shell was modelled to shed weight without losing rigidity, balancing grip comfort against the goal of reaching around 20 grams.</p>)}
          {cta('See the design', 'The model, the trade-offs and how it feels to use.', 'Read the full article', '/comingsoon')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('/images/CopyBoard-pf-context.webp', 'Copy Board PCB', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Personal · PCB Design · KiCAD · 1 Week</p>
          <p className="hp-rd-lead">A from-scratch KiCAD recreation of NYP&apos;s ATMega328 dev board, made so I could have my own copy to work with at home.</p>
          {chapter('01', 'Reverse-engineered, then rebuilt', <p>I worked from the school board&apos;s schematic to recreate it in KiCAD. Some parts were out of production so I sourced substitutes and used it as my first proper run at reflow soldering.</p>)}
          {cta('The full recreation', 'Sourcing parts, the layout, and the reflow.', 'Read the full article', '/comingsoon')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('/images/tht-cover.webp', 'Web Development Project', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Web Development Project</h2>
          <p className="hp-md-meta">School · HTML &amp; CSS · First Website</p>
          <p className="hp-rd-lead">The first fully functional website I built, HTML and CSS, as the final assignment for my web development class. The Chiambucket site was my second attempt.</p>
          {chapter('01', 'Where it started', <p>This was my introduction to building for the web. You can see how far the craft has come since then.</p>)}
          {cta('See where it began', 'Open the live site or read the write-up.', 'Live demo', 'https://tht.chiambucket.com', { label: 'Read the article', url: '/comingsoon' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('/images/mc-pf-context.webp', 'Minecraft Live Map', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft Live Map</h2>
          <p className="hp-md-meta">Personal · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">A self-hosted Minecraft server on the homelab, with a live web map of the multiplayer world that anyone can pan around in real time.</p>
          {chapter('01', 'Server and map', <p>A Paper server runs in Docker with the Dynmap plugin generating a live, interactive map that updates as players explore and build.</p>)}
          {cta('Explore the world live', "Open the interactive map or read how it's hosted.", 'Open live map', 'https://map.chiambucket.com', { label: 'Read the article', url: '/comingsoon' })}
        </div>
      </>
    );
    default: return null;
  }
}

type ProjectType = 'personal' | 'school';

interface Project {
  id: string;
  title: string;
  blurb: string;
  img: string;
  imgAlt: string;
  type: ProjectType;
  highlight?: boolean;
  articleUrl: string;
  icons: Array<{ src: string; alt: string }>;
}

const ALL_PROJECTS: Project[] = [
  { id: 'proj-june', title: 'Project June', blurb: 'A 5G radio-controlled vehicle with 3 live video streams, GPS, a laser system, gyroscope and more. My most ambitious build.', img: '/images/ProjJuneBanner1.webp', imgAlt: 'Project June rover', type: 'personal', highlight: true, articleUrl: '/project-june', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-lora', title: 'LoRA Messenger', blurb: 'An ESP32 messenger with 2-way voice over ESP-NOW and text over LoRa. Custom PCB in KiCAD, case in Onshape, all self-taught.', img: '/images/borlocator-pf-context.webp', imgAlt: 'LoRA Messenger', type: 'personal', highlight: true, articleUrl: '/brolocator', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-ema', title: 'EMA Smart Home', blurb: 'A multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live dashboard and a 3D Spline view.', img: '/images/Ema-pf-context.webp', imgAlt: 'EMA Smart Home System', type: 'school', highlight: false, articleUrl: '/csdp', icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-pandus', title: 'Pandus Dispenser', blurb: 'My first school project: a 6-part 3D-printed water dispenser powered by an Arduino Uno and driven with PyFirmata.', img: '/images/pandusarticle.webp', imgAlt: 'Pandus Dispenser', type: 'school', highlight: false, articleUrl: '/pandus', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/powerpoint-icon.webp', alt: 'PowerPoint' }] },
  { id: 'proj-elecf', title: 'ELEC-F Concept', blurb: 'A freezer safety system on M5Stack. ToF and PIR sensors catch a worker trapped in a walk-in freezer, then a timer and alarm raise help.', img: '/images/elef2-pf-context.webp', imgAlt: 'ELEC-F Concept', type: 'school', highlight: false, articleUrl: '/elecf', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-kauli', title: 'Kauli Concept', blurb: 'A conceptual product designed and presented for a communication-skills project, with 3D scenes built in Blender.', img: '/images/kauli3-pf-context.webp', imgAlt: 'Kauli Concept', type: 'school', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/blender-icon.webp', alt: 'Blender' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-sol', title: 'Series One Light', blurb: 'My ultralight 20g take on the ZeroMouse, built to play a little better in FPS games.', img: '/images/Series1l-pf-context.webp', imgAlt: 'Series One Light', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }] },
  { id: 'proj-copyboard', title: 'Copy Board', blurb: "A KiCAD recreation of my school's dev board, made because I couldn't bring the original home.", img: '/images/CopyBoard-pf-context.webp', imgAlt: 'Copy Board', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/Kicad-icon.webp', alt: 'KiCAD' }] },
  { id: 'proj-webdev', title: 'Web Development Prj', blurb: 'My first fully functional website, built with HTML and CSS as the final assignment for my web development class.', img: '/images/tht-cover.webp', imgAlt: 'Web Development Project', type: 'school', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }, { src: '/images/chrome-icon.webp', alt: 'Chrome' }, { src: '/images/canva-icon.webp', alt: 'Canva' }] },
  { id: 'proj-mc', title: 'Minecraft Live Map', blurb: 'A Paper server running Dynmap, a live and interactive map for the multiplayer world.', img: '/images/mc-pf-context.webp', imgAlt: 'Minecraft Live Map', type: 'personal', highlight: false, articleUrl: '/comingsoon', icons: [{ src: '/images/docker-icon.webp', alt: 'Docker' }, { src: '/images/chrome-icon.webp', alt: 'Chrome' }] },
];

export default function ArticleRecommendations({ exclude }: { exclude: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnimOpen, setModalAnimOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const openProject = (id: string) => {
    setActiveProject(id);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setModalAnimOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => { setModalOpen(false); setActiveProject(null); }, 320);
  };

  useEffect(() => {
    if (modalOpen) requestAnimationFrame(() => setModalAnimOpen(true));
  }, [modalOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalOpen) closeProject(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [modalOpen]);

  const projects = ALL_PROJECTS.filter(p => p.id !== exclude);
  const visible = showAll ? projects : projects.slice(0, 3);

  return (
    <>
      <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <symbol id="arec-arrow-circle" viewBox="0 0 24 24" fill="none"><path fill="currentColor" clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"/></symbol>
        <symbol id="arec-arrow-ur" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15"/></symbol>
        <symbol id="arec-search" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20.5 20.5l-4-4"/></symbol>
        <symbol id="arec-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z"/></symbol>
      </svg>

      <section className="hp-band arec-section">
        <div className="hp-section">
          <div className="arec-header" data-reveal>
            <span className="hp-eyebrow">More to explore</span>
            <h2>Other projects</h2>
          </div>
          <div className="hp-pf-grid">
            {visible.map(p => (
              <article
                key={p.id}
                className={`hp-pf-card${p.highlight ? ' is-highlight' : ''}`}
                data-article={p.articleUrl}
                data-type={p.type}
                data-highlight={p.highlight ? '1' : undefined}
              >
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={() => openProject(p.id)} aria-label="Peek at a quick summary">
                    <span className="hp-pf-peek-pill"><SR />Peek summary</span>
                  </button>
                  <span className={`hp-pf-type ${p.type}`}>{p.type === 'personal' ? 'Personal' : 'School'}</span>
                  {p.highlight && <span className="hp-pf-star"><ST />Highlight</span>}
                  <img src={p.img} alt={p.imgAlt} loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">{p.title}</h3>
                  <p className="hp-pf-blurb">{p.blurb}</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack">
                      {p.icons.map(ic => <img key={ic.src} src={ic.src} alt={ic.alt} />)}
                    </div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = p.articleUrl; }}>
                      Read article <AU />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!showAll && projects.length > 3 && (
            <div className="arec-more">
              <button className="hp-btn hp-btn-ghost" onClick={() => setShowAll(true)}>Load more</button>
            </div>
          )}
        </div>
      </section>

      <div className={`hp-modal${modalAnimOpen ? ' is-open' : ''}`} id="hp-modal-arec" hidden={!modalOpen}>
        <div className="hp-modal-backdrop" onClick={closeProject}></div>
        <div className="hp-modal-panel" role="dialog" aria-modal={true} aria-label="Project details">
          <button className="hp-modal-close" onClick={closeProject} aria-label="Close details">&times;</button>
          <div className="hp-modal-content">
            {activeProject && <ModalContent id={activeProject} close={closeProject} />}
          </div>
        </div>
      </div>
    </>
  );
}
