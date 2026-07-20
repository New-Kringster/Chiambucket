'use client';
import { useEffect, useRef, useState } from 'react';

/*
  ProjectPeek — the shared "peek" reader used by the homepage project gallery
  AND the end-of-article recommendations. Opening any project's peek renders a
  vertical, TikTok-style feed: the chosen project first, then every other
  project in gallery order (wrapping once), each shown as the FULL readable
  reader (hero, video, chapters, CTA), separated by a "NEXT" divider. Heavy
  media lazy-mounts as each item nears the viewport, so opening stays fast.

  Callers keep their own .hp-modal shell + open/close state; they just render
  <PeekFeed startId={...} exclude={...} /> inside .hp-modal-content (keyed by
  startId so the feed resets to the top on each open).
*/

/* Project order = the homepage gallery order (also the ALL_PROJECTS order). */
export const PEEK_ORDER: string[] = [
  'proj-june', 'proj-lora', 'proj-lumen', 'proj-beadreader', 'proj-ema', 'proj-pandus', 'proj-elecf',
  'proj-kauli', 'proj-sol', 'proj-copyboard', 'proj-webdev', 'proj-mc',
];

const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus Dispenser', 'proj-elecf': 'ELEC-F Concept',
  'proj-kauli': 'Kauli Concept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Web Development', 'proj-mc': 'Minecraft Live Map',
};

/* Inlined so the shared component carries its own icon (no dependency on each
   host page's <symbol> defs). */
const ArrowCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" />
  </svg>
);

/* ── Reader content for one project ── */
export function PeekModalContent({ id }: { id: string }) {
  const nav = (url: string) => () => { window.location.href = url; };

  const chapter = (num: string, title: string, body: React.ReactNode) => (
    <section className="hp-rd-chapter" key={num}>
      <span className="hp-rd-ch-num">{num}</span>
      <div className="hp-rd-ch-body"><h4>{title}</h4>{body}</div>
    </section>
  );

  const cta = (text: string, sub: string, btnLabel: string, btnUrl: string, ghost?: { label: string; url: string }) => (
    <div className="hp-rd-cta">
      <div className="hp-rd-cta-text"><strong>{text}</strong><span>{sub}</span></div>
      <button className="hp-btn" onClick={nav(btnUrl)}>{btnLabel} <ArrowCircle /></button>
      {ghost && <button className="hp-btn hp-btn-ghost" onClick={nav(ghost.url)}>{ghost.label}</button>}
    </div>
  );

  const hero = (img: string, alt: string, tags: string[], type: 'highlight' | 'personal' | 'school') => (
    <div className="hp-rd-hero">
      <img src={img} alt={alt} />
      <div className="hp-rd-hero-tags">
        {tags.map(t => <span key={t} className={`hp-md-tag ${t === 'Flagship' ? 'flagship' : t === 'Highlights' ? 'highlight' : type}`}>{t}</span>)}
      </div>
    </div>
  );

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('/images/ProjJuneBanner1.webp', 'Project June rover', ['Flagship', 'Personal Project'], 'highlight')}
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
    case 'proj-lumen': return (
      <>
        {hero('/images/lumen-pf-context.webp', 'LUMEN voice assistant', ['Highlights', 'School Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT Programming · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">A voice-controlled smart-room assistant. Say &ldquo;Hello Robot,&rdquo; speak, and the room answers: an ESP32 captures your voice, a FastAPI relay transcribes it and asks an LLM for one strict JSON command, and that fans back out over MQTT.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'Speech to one JSON command', <p>The ESP32 streams 16&nbsp;kHz audio to the server; through OpenRouter, Whisper transcribes it and a DeepSeek LLM parses it into exactly one validated command (action, sequence or timer), checked against a schema before it ever reaches the board.</p>)}
          {chapter('02', 'Fitting it on a no-PSRAM board', <><p>The WROOM left about 33&nbsp;KB of free RAM with WiFi up, and a voice clip is roughly 96&nbsp;KB, so the audio is streamed over a raw socket as it records, never held whole. Peak memory during an upload is around 10&nbsp;KB.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="The INMP441 microphone wired to the ESP32" loading="lazy" /></>)}
          {chapter('03', 'A room you can talk to', <><p>Lights, a NeoPixel, a fan, a servo and a buzzer respond, with a local auto-mode and a web dashboard. Ask it to &ldquo;set the brightness to the humidity&rdquo; and it reads the live sensor and does exactly that.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="The LUMEN web dashboard" loading="lazy" /></>)}
          {cta('See the full build', 'The memory wall, the wiring and the interactive demo.', 'Read the full article', '/lumen')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('/images/beadreader-pf-context.webp', 'BeadReader private book reader', ['Flagship', 'Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Web App · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Self-Learnt</p>
          <p className="hp-rd-lead">A small, private online book reader for a handful of friends. Log in with one access code, and the app remembers exactly where you left off, shows who else is reading, and tracks everyone&apos;s progress.</p>
          {chapter('01', 'A library that remembers you', <><p>Open a book and it jumps back to the exact chapter and scroll position, stored as a fraction so it survives font-size changes. Colour, font and layout are saved per reader.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="The reading view" loading="lazy" /></>)}
          {chapter('02', 'Reading together', <><p>See who is online, spot a friend in the same book by their green ring and chapter number, and send a wave or a short disappearing note.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Presence and quick messages" loading="lazy" /></>)}
          {chapter('03', 'A gate enforced in SQL', <p>Explicit chapters are gated in the database query itself, so gated text never leaves the server for a reader without access. The same chapter adapts per reader, down to a cal mode that removes it entirely.</p>)}
          {cta('See the whole build', 'Presence, the content gate, webtoons and the stack.', 'Read the full article', '/beadreader')}
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

/* One feed slot: mounts its reader only when it nears the viewport. */
function PeekItem({ id, first, index }: { id: string; first: boolean; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(first);

  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { root: null, rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div className="hp-rd-feed-item" ref={ref}>
      {!first && (
        <div className="hp-rd-feed-sep" aria-hidden="true">
          <span>NEXT · {TITLES[id] ?? `0${index + 1}`}</span>
        </div>
      )}
      {seen ? <PeekModalContent id={id} /> : <div className="hp-rd-feed-skel" />}
    </div>
  );
}

/*
  PeekFeed — the clicked project first, then the rest of the gallery in order
  (wrapping once). `exclude` drops one project (the current article on the
  recommendations rail). Key this by startId so it resets on each open.
*/
export function PeekFeed({ startId, exclude }: { startId: string; exclude?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  const base = PEEK_ORDER.filter((id) => id !== exclude);
  const start = Math.max(0, base.indexOf(startId));
  const order = [...base.slice(start), ...base.slice(0, start)];

  // The feed mounts fresh on each open (keyed by startId); make sure the
  // scroll container starts at the top rather than a leftover position.
  useEffect(() => {
    const sc = rootRef.current?.parentElement;
    if (sc) sc.scrollTop = 0;
  }, []);

  return (
    <div className="hp-rd-feed" ref={rootRef}>
      <PeekItem key={order[0]} id={order[0]} index={0} first={true} />
      {order.length > 1 && !expanded ? (
        <div className="hp-rd-feed-more" style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 8px' }}>
          <button className="hp-btn" onClick={() => setExpanded(true)}>Load more projects</button>
        </div>
      ) : (
        <>
          {order.slice(1).map((id, i) => (
            <PeekItem key={id} id={id} index={i + 1} first={false} />
          ))}
          <div className="hp-rd-feed-end" aria-hidden="true"><span>END OF FEED</span></div>
        </>
      )}
    </div>
  );
}
