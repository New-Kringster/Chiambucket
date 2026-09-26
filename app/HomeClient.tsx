'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import InfoModal, { type InfoItem } from '../components/InfoModal';
import LazyVideo from '../components/LazyVideo';
import { PeekFeed } from '../components/ProjectPeek';
import RisoPrint, { type Flood } from '../components/press/RisoPrint';

/*
  Homepage on the press design. Same structure and copy as the dark homepage
  it replaces (hero, what I do, 01 about bento, 02 projects, collaborators,
  homelab, 03 gallery, closing call to action); only the presentation moved
  to paper, riso and ink. Styles: app/press.css (pr-* classes).
*/

/* ── Detail pop-ups (capability cards and about tiles) ── */
const CAPABILITIES: InfoItem[] = [
  { eyebrow: 'Capability', title: 'Microcontrollers & Firmware',
    blurb: 'The brains of almost everything I build. I write bare-metal firmware in C and C++ on the ESP32 and Arduino families, flashing and debugging over PlatformIO.',
    points: ['ESP32 firmware for the Project June rover and the LoRA Messenger', 'Custom PWM motor control, servo steering and sensor drivers', 'Reading a whole suite of sensors at once while keeping the loop fast'],
    chips: ['ESP32', 'Arduino', 'ATmega328', 'PlatformIO', 'C / C++'] },
  { eyebrow: 'Capability', title: 'PCB Design',
    blurb: 'Taking a circuit from a schematic to a board I can hold. I design in KiCAD, route the layout, then reflow-solder the SMD parts by hand.',
    points: ['The LoRA Messenger’s custom board, reflowed at home', 'A from-scratch recreation of my school’s ATmega328 dev board', 'Schematic capture, footprint sourcing and respins'],
    chips: ['KiCAD', 'EAGLE', 'SMD reflow', 'Schematic capture'] },
  { eyebrow: 'Capability', title: 'Wireless Comms',
    blurb: 'Getting devices to talk, near or far. I pick the radio and protocol to fit the job, from long-range LoRa to low-latency WebRTC video over cellular.',
    points: ['Three live WebRTC camera streams over 5G on Project June', 'Long-range text on LoRa and two-way voice on ESP-NOW', 'MQTT telemetry brokered through my homelab'],
    chips: ['LoRa', 'ESP-NOW', 'MQTT', 'WebRTC', 'SocketIO', '5G'] },
  { eyebrow: 'Capability', title: '3D & CAD',
    blurb: 'Designing the physical shell. I model enclosures and parts in Onshape, visualise in Blender, then 3D print and iterate until the fit is right.',
    points: ['The rover chassis and the LoRA Messenger’s handheld case', 'Tolerance-tuned fits and print-in-place mechanisms', 'Concept renders for pitches and posters'],
    chips: ['Onshape', 'Blender', '3D printing', 'Enclosure design'] },
  { eyebrow: 'Capability', title: 'Design & Media',
    blurb: 'The design-first half of the work. I move between interfaces, posters, motion and 3D so a project communicates, not just functions.',
    points: ['UI and dashboards in Figma, often with Spline 3D scenes', 'Posters and graphics in Photoshop', 'Project films cut and graded in DaVinci Resolve'],
    chips: ['Figma', 'Photoshop', 'DaVinci Resolve', 'Premiere Pro', 'Spline 3D'] },
  { eyebrow: 'Capability', title: 'Infrastructure',
    blurb: 'Where my projects live and how I reach them. I run a self-hosted homelab on Proxmox and Docker, fronted by Nginx and a segmented UniFi network.',
    points: ['Self-hosted services behind Nginx Proxy Manager and CrowdSec', 'A WireGuard and Tailscale mesh to reach home from anywhere', 'coturn and MQTT that back real hardware projects'],
    chips: ['Proxmox', 'Docker', 'Nginx', 'Tailscale', 'Wireguard', 'Unifi'],
    link: { label: 'Explore the HomeLab', url: '/homelab' } },
];

const TILE_INTRO: InfoItem = {
  eyebrow: 'Hello',
  title: "Hi, I'm Braven",
  blurb: "I'm a 19-year-old engineering student in Singapore. It all started when I was young, taking apart a broken radio just to see how it worked. That same curiosity never left me, it just grew into rovers, custom PCBs, a solar-powered homelab and this very site.",
  add: "Today I split my time across hardware, software and design, an engineer who designs, chasing the same feeling that broken radio first gave me: working out how something ticks, then making it better.",
  links: [
    { label: 'Get in touch', url: '/contact' },
    { label: 'Sukuna art credit', url: 'https://www.pinterest.com/pin/665547651180427494/' },
  ],
};

const TILE_ENGINEERING: InfoItem = {
  eyebrow: 'Design-first engineering',
  title: 'Every engineer should be a designer',
  blurb: "I don't treat function and form as a trade-off. I approach a circuit or a chassis the way I'd approach an interface: grounded in what it has to do, then shaped by how it actually feels to use. It should work well and look like it was meant to.",
  add: "The render on the card is a Blender scene from my Kauli concept, a product I designed and pitched for a communication-skills brief. That same instinct carries into my interface work, like the live dashboard I designed for the EMA smart-home system shown below.",
  media: '/images/Cdyspstart.webp',
  links: [
    { label: 'See the Kauli concept', url: '/comingsoon' },
    { label: 'EMA smart-home UI', url: '/csdp' },
  ],
};

const TILE_MICRO: InfoItem = {
  eyebrow: 'The brains of the build',
  title: 'Microcontrollers I build with',
  blurb: "Almost everything I make has a microcontroller at its core. I write bare-metal firmware in C and C++, flashing and debugging over PlatformIO, and I choose the chip to fit the job rather than forcing the job onto one chip.",
  points: [
    'ESP32, my default for anything wireless, with WiFi, ESP-NOW and plenty of headroom',
    'Arduino Uno and the ATmega328 for simpler, well-supported builds',
    'M5Stack Fire when I need a screen, buttons and modules in a hurry',
    'BeagleBone Black as a Linux brain coordinating a larger system',
  ],
  chips: ['ESP32', 'Arduino', 'ATmega328', 'M5Stack', 'BeagleBone', 'PlatformIO', 'C / C++'],
  links: [
    { label: 'Project June (ESP32)', url: '/project-june' },
    { label: 'LoRA Messenger (ESP32)', url: '/brolocator' },
    { label: 'ELEC-F (M5Stack)', url: '/elecf' },
  ],
};

const TILE_PPT: InfoItem = {
  eyebrow: 'Presenting & slide design',
  title: 'Slides that hold a room',
  blurb: "A deck should carry the talk, not compete with it. I design slides to land one idea at a time and keep only the key points on screen, large and readable, so the audience can take them in at a glance and keep listening to me rather than reading the wall.",
  add: "Strong typography, real imagery and a clear visual rhythm do the heavy lifting, while the detail lives in what I say. That keeps the slides clean and the delivery engaging.",
  points: [
    'One key idea per slide, never a wall of text',
    'Only the most important points make the cut',
    'Visual hierarchy and motion that guide the eye',
  ],
  links: [
    { label: 'Download the slides (.pptx)', url: 'https://content.chiambucket.com/downloadable/CPB1v4.pptx' },
  ],
};

/* ── Hero plates: Braven's own photographs, printed in riso by the page ── */
const PLATES = [
  { src: '/images/press/nz-mountains.webp', caption: 'New Zealand, 2026', focus: [0.5, 0.3], lift: 1, alt: 'Snow-capped mountains under heavy cloud, New Zealand' },
  { src: '/images/press/hallstatt.webp', caption: 'Hallstatt, Austria, 2025', focus: [0.6, 0.4], lift: 1.25, alt: 'The lakeside church and houses of Hallstatt under a misty mountain' },
  { src: '/images/press/hk-estate.webp', caption: 'Hong Kong, 2026', focus: [0.5, 0.4], lift: 1, alt: 'A pastel housing estate rising over a basketball court, Hong Kong' },
  { src: '/images/press/mandarin-duck.webp', caption: 'China, 2025', focus: [0.46, 0.3], lift: 1, alt: 'A mandarin duck floating on still water' },
  { src: '/images/press/tea-hat.webp', caption: 'China, 2025', focus: [0.5, 0.5], lift: 1.1, alt: 'A woven straw hat resting on rows of tea bushes' },
  { src: '/images/press/black-swan.webp', caption: 'A black swan', focus: [0.3, 0.1], lift: 1.15, alt: 'A black swan among reeds' },
] as const;
/* An even blue-pink tint over the plate that deepens toward the bottom, so the
   hero copy can be knocked out of it in paper colour. */
const HERO_FLOOD: Flood = { from: 0.06, base: 0.3, curve: 0.5, blue: 0.68, pink: 0.5 };

const DISCIPLINES = [
  { title: 'Engineering', desc: 'Microcontrollers, custom PCBs and 3D CAD. Hardware and software, mostly self-taught.', link: 'See projects', href: '#portfolio-items-holder' },
  { title: 'Design', desc: 'Design-first thinking across interfaces, posters, slides and motion. Clear and intentional.', link: 'View design & photos', href: '/photography' },
  { title: 'Photography', desc: 'Finding inspiration through perspective and detail, then bringing it back to the work.', link: 'Browse gallery', href: '#photolink' },
  { title: 'HomeLab', desc: 'Self-hosted, solar-powered servers running every Chiambucket service, including this site.', link: 'Explore setup', href: '/homelab' },
];

/* ── Design tools carousel ── */
const TOOL_RING = [
  { src: '/images/photoshop-icon-dark.webp', name: 'Photoshop' },
  { src: '/images/figma-icon-dark.webp', name: 'Figma' },
  { src: '/images/davinci-icon-dark.webp', name: 'DaVinci Resolve' },
  { src: '/images/premier-icon-dark.webp', name: 'Premiere Pro' },
  { src: '/images/spline-icon-dark.webp', name: 'Spline' },
  { src: '/images/powerpoint-icon-dark.webp', name: 'PowerPoint' },
];

/* ── Projects ── */
type Proj = {
  id: string; url: string; type: 'personal' | 'school'; tier?: 'flagship' | 'highlight';
  img: string; alt: string; name: string; blurb: string; icons: string[]; search: string;
};
const PROJECTS: Proj[] = [
  { id: 'proj-june', url: '/project-june', type: 'personal', tier: 'flagship', img: '/images/ProjJuneBanner1.webp', alt: 'Project June rover', name: 'Project June',
    blurb: 'A 5G radio-controlled vehicle with 3 live video streams, GPS, a laser system, gyroscope and more. My most ambitious build.',
    icons: ['esp', 'Kicad', 'onshape', 'PlatformIO'], search: 'project june 5g rc rover vehicle webrtc mqtt esp32 gps gyroscope laser spline cellular video personal flagship highlight' },
  { id: 'proj-beadreader', url: '/beadreader', type: 'personal', tier: 'flagship', img: '/images/beadreader-pf-context.webp', alt: 'BeadReader private book reader', name: 'BeadReader',
    blurb: 'A private, invite-only online book reader with live reading-together presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats. Next.js and Supabase.',
    icons: ['nextjs', 'supabase', 'tailwind', 'cloudflare'], search: 'beadreader bead reader private book reader ebook webtoon nextjs supabase cloudflare r2 tailwind postgres presence reading stats access code personal flagship highlight web app' },
  { id: 'proj-lora', url: '/brolocator', type: 'personal', tier: 'highlight', img: '/images/borlocator-pf-context.webp', alt: 'LoRA Messenger', name: 'LoRA Messenger',
    blurb: 'An ESP32 messenger with 2-way voice over ESP-NOW and text over LoRa. Custom PCB in KiCAD, case in Onshape, all self-taught.',
    icons: ['esp', 'Kicad', 'onshape', 'PlatformIO'], search: 'lora messenger esp32 espnow voice pcb kicad onshape oled battery personal radio highlight' },
  { id: 'proj-lumen', url: '/lumen', type: 'school', tier: 'highlight', img: '/images/lumen-pf-context.webp', alt: 'LUMEN voice assistant', name: 'LUMEN',
    blurb: 'A voice-controlled smart-room assistant on an ESP32, with Whisper and a DeepSeek LLM via OpenRouter turning speech into one JSON command over MQTT.',
    icons: ['esp', 'python', 'docker', 'vscode'], search: 'lumen esp32 voice assistant wake word whisper deepseek llm mqtt fastapi micropython inmp441 microphone smart room iot nyp school highlight' },
  { id: 'proj-ema', url: '/csdp', type: 'school', img: '/images/Ema-pf-context.webp', alt: 'EMA Smart Home System', name: 'EMA Smart Home',
    blurb: 'A multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live dashboard and a 3D Spline view.',
    icons: ['vscode', 'figma', 'resolve', 'onshape'], search: 'ema smart home beaglebone python socketio flask websocket spline mikrobus school group sensors' },
  { id: 'proj-pandus', url: '/pandus', type: 'school', img: '/images/pandusarticle.webp', alt: 'Pandus Dispenser', name: 'Pandus Dispenser',
    blurb: 'My first school project: a 6-part 3D-printed water dispenser powered by an Arduino Uno and driven with PyFirmata.',
    icons: ['onshape', 'vscode', 'resolve', 'powerpoint'], search: 'pandus dispenser arduino uno pyfirmata 3d printed servo pump water school first' },
  { id: 'proj-elecf', url: '/elecf', type: 'school', img: '/images/elef2-pf-context.webp', alt: 'ELEC-F Concept', name: 'ELEC-F Concept',
    blurb: 'A freezer safety system on M5Stack. ToF and PIR sensors catch a worker trapped in a walk-in freezer, then a timer and alarm raise help.',
    icons: ['figma', 'ps-pf', 'resolve'], search: 'elec-f elecf concept m5-stack m5stack freezer safety sensors engineering course school' },
  { id: 'proj-kauli', url: '/comingsoon', type: 'school', img: '/images/kauli3-pf-context.webp', alt: 'Kauli Concept', name: 'Kauli Concept',
    blurb: 'A conceptual product designed and presented for a communication-skills project, with 3D scenes built in Blender.',
    icons: ['blender', 'ps-pf', 'resolve'], search: 'kauli concept blender 3d communication skills presentation school onshape' },
  { id: 'proj-sol', url: '/comingsoon', type: 'personal', img: '/images/Series1l-pf-context.webp', alt: 'Series One Light', name: 'Series One Light',
    blurb: 'My ultralight 20g take on the ZeroMouse, built to play a little better in FPS games.',
    icons: ['onshape', 'ps-pf'], search: 'series one light zeromouse optimum tech ultralight 20g fps mouse onshape personal' },
  { id: 'proj-copyboard', url: '/comingsoon', type: 'personal', img: '/images/CopyBoard-pf-context.webp', alt: 'Copy Board', name: 'Copy Board',
    blurb: "A KiCAD recreation of my school's dev board, made because I couldn't bring the original home.",
    icons: ['Kicad'], search: 'copy board kicad pcb schematic dev board school recreation personal' },
  { id: 'proj-webdev', url: '/comingsoon', type: 'school', img: '/images/tht-cover.webp', alt: 'Web Development Project', name: 'Web Development Prj',
    blurb: 'My first fully functional website, built with HTML and CSS as the final assignment for my web development class.',
    icons: ['vscode', 'chrome', 'canva'], search: 'web development html css website school first chrome canva demo tht' },
  { id: 'proj-mc', url: '/comingsoon', type: 'personal', img: '/images/mc-pf-context.webp', alt: 'Minecraft Live Map', name: 'Minecraft Live Map',
    blurb: 'A Paper server running Dynmap, a live and interactive map for the multiplayer world.',
    icons: ['docker', 'chrome'], search: 'minecraft server paper dynmap live interactive map docker multiplayer personal demo' },
];
const FILTERS = [['all', 'All'], ['flagship', 'Flagship'], ['highlight', 'Highlights'], ['personal', 'Personal'], ['school', 'School']] as const;

/* ── People I've built school projects with, from the ELEC-F and EMA team rolls ── */
const COLLABORATORS = [
  { name: 'Tan Yong Rui', role: 'Lead · Docs · Code', img: 'https://framerusercontent.com/images/Z3GPice7XE0ttZhHBYRI737GQtA.png?scale-down-to=512&width=854&height=486', fit: 'contain', profile: 'https://tanyongrui11.framer.website/project/www-pentaclay-com', projects: [{ label: 'ELEC-F', url: '/elecf' }, { label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Md Sadiq', role: 'Team Lead on ELEC-F', img: '/images/elecf-sadiq.jpeg', fit: 'cover', profile: 'https://www.mdsadiq.cc', projects: [{ label: 'ELEC-F', url: '/elecf' }] },
  { name: 'Ong Zheng Xian', role: 'Docs · Code', img: 'https://www.ongkian.com/css/images/Passport_Photo.jpg', fit: 'cover', profile: 'https://www.ongkian.com', projects: [{ label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Joycelyn Wong', role: 'Docs · Code', img: 'https://framerusercontent.com/images/asafLs7NWVzXO9AolaQ8XVF5F4.jpg?scale-down-to=512&width=1280&height=807', fit: 'cover', profile: 'https://joycelynwong.framer.website/projects/ema', projects: [{ label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Abel Goh', role: 'Team member on ELEC-F', img: '/images/abel-goh.webp', fit: 'cover', profile: 'https://frequent-location-124634.framer.app', projects: [{ label: 'ELEC-F', url: '/elecf' }] },
];

const HOMELAB_APPS = ['immich', 'paperless', 'syncthing', 'npm', 'netdata', 'lychee', 'openwebui', 'portainer', 'crafty'];

const ALBUMS = [
  ['highlight', 'Highlights', 'pxAS20i7_kWFVTC_Ke_HlDUk'],
  ['europe', 'Europe', 'LhvwBoxDDt6VdG3HvKrDMi1Z'],
  ['china', 'China', 'LscJWL46nCkW76KiKEY4csiI'],
  ['zealand', 'New Zealand', 'RgKkSumOaHmpoMKbNxPU-o-0'],
  ['by219', '21:9', 'cZ6uVEzxH72ygIJLPbnxZAiN'],
  ['general', 'General', 'X1sod6pbc0khZPykFISHCjzg'],
] as const;

/* ── Small pieces ── */
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Crown = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M2.4 18.2h19.2l-1.5-9.4-5.4 3.9L12 4.8 9.3 12.7 3.9 8.8z" /></svg>
);
const Star = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z" /></svg>
);

/* Keyboard-and-click behaviour for tiles that act as buttons or links. */
function tileProps(action: () => void, label?: string) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onClick: action,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); action(); } },
  };
}
const go = (url: string) => () => {
  if (url.startsWith('#')) document.getElementById(url.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  else if (/^https?:/.test(url)) window.open(url, '_blank', 'noopener');
  else window.location.href = url;
};

/* A rotating word that never changes the line's size: every word sits in the
   same grid cell, so the cell is always as wide as the longest one. */
function Roller({ words, delay = 0 }: { words: string[]; delay?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let iv: number | undefined;
    const t = window.setTimeout(() => { iv = window.setInterval(() => setI((n) => (n + 1) % words.length), 2800); }, delay);
    return () => { window.clearTimeout(t); window.clearInterval(iv); };
  }, [words.length, delay]);
  return (
    <span className="pr-roll" aria-label={words[0]}>
      {words.map((w, n) => <span key={w} aria-hidden="true" className={n === i ? 'is-on' : ''}>{w}</span>)}
    </span>
  );
}

function SectionHead({ n, eyebrow, title, desc }: { n: string; eyebrow: string; title: string; desc?: string }) {
  return (
    <header className="pr-shead">
      <span className="pr-shead-n" aria-hidden="true">{n}</span>
      <div>
        <span className="pr-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </header>
  );
}

function ToolCarousel() {
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);
  const n = TOOL_RING.length;
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setStill(mq.matches);
    if (mq.matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), 2200);
    return () => window.clearInterval(id);
  }, [n]);
  const off = (i: number) => { let d = i - active; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };
  return (
    <div className={`pr-tcar${still ? ' is-still' : ''}`} aria-label={`Design tools, showing ${TOOL_RING[active].name}`}>
      <div className="pr-tcar-stage">
        {TOOL_RING.map((t, i) => {
          const d = off(i), ad = Math.abs(d);
          return (
            <span key={t.name} className={`pr-tcar-chip${d === 0 ? ' is-active' : ''}`} aria-hidden={d !== 0}
              style={{ transform: `translateX(${d * 58}px) scale(${1 - ad * 0.16}) rotate(${d * 4}deg)`, opacity: ad > 2 ? 0 : 1 - ad * 0.3, zIndex: 10 - ad }}>
              <img src={t.src} alt={t.name} loading="lazy" />
            </span>
          );
        })}
      </div>
      <span className="pr-tcar-label" aria-live="polite">{TOOL_RING[active].name}</span>
    </div>
  );
}

/* ── Hero ── */
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
    <header className="pr-hero">
      <div className="pr-hero-row">
        <RisoPrint src="/images/press/roof.webp" alt="" focus={[0.5, 0.6]} lift={1.15} seed={71} eager className="pr-strip" />
        <div className="pr-hero-plate" ref={plateRef} onPointerMove={onMove} onPointerLeave={onLeave}>
          <RisoPrint
            src={plate.src} alt={plate.alt} focus={plate.focus} lift={plate.lift}
            flood={HERO_FLOOD} layered eager cell={3.1} cellSmall={2.2} seed={idx + 1}
            className="pr-hero-print"
          />
          <div className="pr-hero-copy">
            <a className="pr-topper" href="/beadreader">
              <span className="pr-topper-new">New</span>
              <span>BeadReader</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <p className="pr-hero-kicker">Braven Chiam · Singapore</p>
            <h1 className="pr-hero-title">
              <span>Creating with</span>
              <Roller words={['Intention.', 'Purpose.', 'Meaning.', 'Intent.', 'Vision.']} />
            </h1>
            <p className="pr-hero-sub">
              I&apos;m an engineer who designs. I build hardware and software with a design-first
              mindset, from 5G rovers and custom PCBs to a solar-powered homelab and photography.
            </p>
            <div className="pr-hero-cta">
              <a className="pr-btn is-paper" href="#portfolio-items-holder" onClick={(e) => { e.preventDefault(); go('#portfolio-items-holder')(); }}>View my work</a>
              <a className="pr-btn is-onink" href="/contact">Get in touch</a>
            </div>
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
    </header>
  );
}

/* ── What I do ── */
function Disciplines() {
  return (
    <section className="pr-band" aria-labelledby="disc-h">
      <div className="pr-wrap">
        <div className="pr-intro-c">
          <span className="pr-eyebrow">What I do</span>
          <h2 id="disc-h">One person, four disciplines, built to work together.</h2>
          <p>Everything I make sits at the intersection of engineering and design. Here&apos;s the full picture, without the page-hopping.</p>
        </div>
        <div className="pr-disc-grid">
          {DISCIPLINES.map((d, i) => (
            <a key={d.title} className="pr-disc pr-card-lift" href={d.href}>
              <span className="pr-disc-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pr-disc-t">{d.title}</span>
              <span className="pr-disc-d">{d.desc}</span>
              <span className="pr-disc-l">{d.link}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 01 About ── */
function About({ openTile }: { openTile: (t: InfoItem) => void }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => { setBlink(true); window.setTimeout(() => setBlink(false), 90); }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="pr-band" id="about" aria-labelledby="about-h">
      <div className="pr-wrap">
        <SectionHead n="01" eyebrow="About" title="An engineer who designs" />
        <div className="pr-bento">
          <div className="pr-tile pr-t-intro pr-card-lift" {...tileProps(() => openTile(TILE_INTRO), 'About me')}>
            <span className="pr-tile-go"><Arrow /></span>
            <img className="pr-wave" src="/images/wave.webp" alt="" />
            <a className={`pr-sukuna${blink ? ' is-blink' : ''}`} href="https://www.pinterest.com/pin/665547651180427494/"
              onClick={(e) => e.stopPropagation()} aria-label="A little friend (art credit)" />
            <h3 id="about-h" className="pr-tile-h">Hi, I&apos;m Braven.<br />An engineer who designs.</h3>
            <p className="pr-tile-p">Grounded in function, guided by human experience, and driven to make things that feel like art.</p>
          </div>

          <div className="pr-tile pr-t-eng pr-card-lift" {...tileProps(() => openTile(TILE_ENGINEERING), 'A design-first engineering approach')}>
            <span className="pr-tile-go"><Arrow /></span>
            <img className="pr-t-eng-media" src="/images/abm-engineering.webp" alt="" />
            <span className="pr-key">Engineering</span>
            <h3 className="pr-tile-h">A design-first<br />engineering approach.</h3>
            <p className="pr-tile-p">I believe every engineer should be a designer, grounded in function, guided by experience.</p>
          </div>

          <div className="pr-tile pr-t-micro pr-card-lift" {...tileProps(() => openTile(TILE_MICRO), 'Microcontrollers')}>
            <span className="pr-tile-go"><Arrow /></span>
            <span className="pr-key">Microcontrollers</span>
            <div className="pr-iconrow">
              <img src="/images/microchip-icon.webp" alt="Microchip" /><img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" /><img src="/images/arduino-icon.webp" alt="Arduino" />
            </div>
            <h3 className="pr-tile-h">Powerful hardware meets powerful software.</h3>
          </div>

          <div className="pr-tile pr-t-media pr-t-davinci pr-card-lift" {...tileProps(go('https://www.youtube.com/@newkringster2564'), 'DaVinci Resolve videos on YouTube')}>
            <span className="pr-tile-go"><Arrow /></span>
            <LazyVideo webm="/images/Davinci-showcase.webm" mp4="/images/Davinci-showcase.mp4" poster="/images/Davinci-showcase-poster.webp" />
            <div className="pr-media-body">
              <span className="pr-key">DaVinci Resolve</span>
              <h3 className="pr-tile-h">Clear, creative, experimental.</h3>
              <p className="pr-tile-p">Videos that add meaning and communicate a project&apos;s vision.</p>
            </div>
          </div>

          <div className="pr-tile pr-t-figma pr-card-lift" {...tileProps(go('/photography'), 'Figma design work')}>
            <span className="pr-tile-go"><Arrow /></span>
            <span className="pr-key">Figma</span>
            <div className="pr-figma-stack">
              <img className="back" src="/images/ELECF.webp" alt="" /><img className="mid" src="/images/Dashboard.webp" alt="" /><img className="front" src="/images/Cdyspstart.webp" alt="" />
            </div>
            <div>
              <h3 className="pr-tile-h">Clean, functional.</h3>
              <p className="pr-tile-p">Posters and interfaces that communicate instantly, without friction.</p>
            </div>
          </div>

          <div className="pr-tile pr-t-tools pr-card-lift" {...tileProps(go('#capabilities'), 'Design tools')}>
            <span className="pr-tile-go"><Arrow /></span>
            <span className="pr-key">Design Tools</span>
            <ToolCarousel />
            <p className="pr-tile-p">A toolkit I reach for daily, from raster and vector to 3D and motion.</p>
          </div>

          <div className="pr-tile pr-t-media pr-t-photo pr-card-lift" {...tileProps(go('#photolink'), 'Photography gallery')}>
            <span className="pr-tile-go"><Arrow /></span>
            <RisoPrint src="/images/abm-lr.webp" alt="Hallstatt under low cloud" focus={[0.5, 0.55]} lift={1.3} cell={2.8} cellSmall={2.2}
              flood={{ from: 0.45, blue: 0.5, pink: 0.32 }} seed={17} className="pr-t-photo-print" />
            <div className="pr-media-body is-knock">
              <span className="pr-key">Photography</span>
              <h3 className="pr-tile-h">Through a different lens.</h3>
              <p className="pr-tile-p">Photography sharpens my perspective, attention to detail, and approach to design.</p>
            </div>
          </div>

          <div className="pr-tile pr-t-ppt pr-card-lift" {...tileProps(() => openTile(TILE_PPT), 'Presenting and slide design')}>
            <span className="pr-tile-go"><Arrow /></span>
            <span className="pr-key">PowerPoint</span>
            <div className="pr-ppt-media"><LazyVideo webm="/images/CPB1v4.webm" mp4="/images/CPB1v4.mp4" poster="/images/CPB1v4-poster.webp" /></div>
            <h3 className="pr-tile-h">Fun, engaging, never overwhelming.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 02 Projects ── */
function Projects({ peek, openCap }: { peek: (id: string) => void; openCap: (c: InfoItem) => void }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false); // phones show the first few until asked
  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PROJECTS.filter((p) => {
      const f = filter === 'all' || (filter === 'flagship' ? p.tier === 'flagship' : filter === 'highlight' ? p.tier === 'highlight' : p.type === filter);
      return f && (!q || p.search.includes(q));
    });
  }, [filter, query]);

  return (
    <section className="pr-band" id="portfolio-items-holder" aria-labelledby="proj-h">
      <div className="pr-wrap">
        <SectionHead n="02" eyebrow="Selected work" title="Projects"
          desc="Builds spanning engineering, design and homelab infrastructure. Read a chaptered summary on any card, or open the full article." />

        {/* Flagship: Project June */}
        <article className="pr-spot" aria-labelledby="june-h">
          <div className="pr-spot-media">
            <img src="/images/press/june-night.webp" alt="Project June, the 5G rover, photographed at night" loading="lazy" />
            <span className="pr-badge is-flagship"><Crown /> Flagship hardware build</span>
          </div>
          <div className="pr-spot-body">
            <span className="pr-key">Project June · Personal</span>
            <h3 id="june-h" className="pr-spot-title">A 5G rover that streams, senses and steers.</h3>
            <p className="pr-spot-lead">My most ambitious build: a radio-controlled vehicle with three live video streams over 5G, full telemetry, and a complete sensor suite, designed enclosure to firmware in three weeks.</p>
            <dl className="pr-stats">
              <div><dt>live video streams</dt><dd>3</dd></div>
              <div><dt>cellular link</dt><dd>5G</dd></div>
              <div><dt>onboard sensors</dt><dd>8+</dd></div>
              <div><dt>concept to drive</dt><dd>3 wks</dd></div>
            </dl>
            <div className="pr-tags">{['ESP32', 'WebRTC', 'MQTT', 'KiCAD', 'Onshape', 'PlatformIO'].map((t) => <span key={t}>{t}</span>)}</div>
            <div className="pr-actions">
              <button type="button" className="pr-btn is-solid" onClick={() => peek('proj-june')}>Read the summary</button>
              <a className="pr-btn" href="/project-june">Full article</a>
              <a className="pr-btn" href="https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC" target="_blank" rel="noopener">Watch the build</a>
            </div>
          </div>
        </article>

        {/* Flagship: BeadReader */}
        <article className="pr-spot is-solo" aria-label="BeadReader">
          <div className="pr-spot-media">
            <img src="/images/beadreader-flagship.webp" alt="BeadReader, a self-hosted invite-only private book reader" loading="lazy" />
            <span className="pr-badge is-flagship"><Crown /> Flagship software build</span>
          </div>
          <div className="pr-spot-solo-body">
            <dl className="pr-stats">
              <div><dt>read-together presence</dt><dd>Live</dd></div>
              <div><dt>content gate</dt><dd>SQL</dd></div>
              <div><dt>PWA, service worker</dt><dd>Offline</dd></div>
              <div><dt>Vercel deploy</dt><dd>1-click</dd></div>
            </dl>
            <div className="pr-tags">{['Next.js', 'Supabase', 'Cloudflare R2', 'Tailwind v4', 'TypeScript'].map((t) => <span key={t}>{t}</span>)}</div>
            <div className="pr-actions">
              <button type="button" className="pr-btn is-solid" onClick={() => peek('proj-beadreader')}>Read the summary</button>
              <a className="pr-btn" href="/beadreader">Full article</a>
              <a className="pr-btn" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </article>

        {/* Capabilities */}
        <div className="pr-cap" id="capabilities">
          <div className="pr-cap-intro">
            <span className="pr-eyebrow">Capabilities</span>
            <h3>Every build leaves behind a skill.</h3>
            <p>The toolkit below is the sum of these projects, mostly self-taught, one problem at a time.</p>
          </div>
          <div className="pr-cap-grid">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="pr-cap-card pr-card-lift" {...tileProps(() => openCap(c), `${c.title} details`)}>
                <span className="pr-cap-plus" aria-hidden="true">+</span>
                <h4>{c.title}</h4>
                <div className="pr-tags">{c.chips!.map((x) => <span key={x}>{x}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All projects */}
        <div className="pr-pf-lead">
          <h3>All projects</h3><span>Search, filter, and tap any card for a chaptered summary.</span>
        </div>
        <div className="pr-pf-toolbar">
          <label className="pr-search">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M20.5 20.5l-4-4" /></svg>
            <input type="search" placeholder="Search projects, tools, tech…" aria-label="Search projects"
              value={query} onChange={(e) => { setQuery(e.target.value); setExpanded(true); }} />
          </label>
          <div className="pr-filters" role="group" aria-label="Filter projects">
            {FILTERS.map(([f, label]) => (
              <button key={f} type="button" className={`pr-filter${filter === f ? ' is-active' : ''}`} aria-pressed={filter === f}
                onClick={() => { setFilter(f); setExpanded(true); }}>{label}</button>
            ))}
          </div>
        </div>
        <div className={`pr-pf-grid${expanded ? '' : ' is-clamped'}`}>
          {shown.map((p) => (
            <article key={p.id} id={p.id} className={`pr-pf-card pr-card-lift${p.tier ? ` is-${p.tier}` : ''}`}>
              <div className="pr-pf-thumb">
                <img src={p.img} alt={p.alt} loading="lazy" />
                <span className="pr-pf-type">{p.type === 'personal' ? 'Personal' : 'School'}</span>
                {p.tier === 'flagship' && <span className="pr-badge is-flagship"><Crown /> Flagship</span>}
                {p.tier === 'highlight' && <span className="pr-badge is-highlight"><Star /> Highlight</span>}
                <button type="button" className="pr-pf-peek" onClick={() => peek(p.id)} aria-label={`Peek at a summary of ${p.name}`}>
                  <span>Peek summary</span>
                </button>
              </div>
              <div className="pr-pf-info">
                <h4><a href={p.url}>{p.name}</a></h4>
                <p>{p.blurb}</p>
                <div className="pr-pf-foot">
                  <div className="pr-icon-stack">{p.icons.map((ic) => <img key={ic} src={`/images/${ic}-icon.webp`} alt="" />)}</div>
                  <a className="pr-textbtn" href={p.url}>Read article</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!expanded && shown.length > 4 && (
          <div className="pr-pf-more"><button type="button" className="pr-btn" onClick={() => setExpanded(true)}>Show all projects</button></div>
        )}
        {shown.length === 0 && <p className="pr-pf-empty">No projects match that search. Try another keyword.</p>}
      </div>
    </section>
  );
}

/* ── Collaborators ── */
function Collaborators() {
  return (
    <section className="pr-band" aria-labelledby="collab-h">
      <div className="pr-wrap">
        <div className="pr-intro-c">
          <span className="pr-eyebrow">Collaborators</span>
          <h2 id="collab-h">People I build with</h2>
          <p>A few of the school projects above were team efforts. Here are the people I built them with, and what we made together.</p>
        </div>
        <div className="pr-collab-grid">
          {COLLABORATORS.map((c) => (
            <div key={c.name} className="pr-collab">
              <div className="pr-collab-top">
                <span className="pr-collab-av" style={{ backgroundImage: `url("${c.img}")`, backgroundSize: c.fit }} />
                <div><b>{c.name}</b><span>{c.role}</span></div>
              </div>
              <div className="pr-tags">{c.projects.map((p) => <a key={p.url} href={p.url}>{p.label}</a>)}</div>
              <a className="pr-collab-link" href={c.profile} target="_blank" rel="noopener">View profile <Arrow /></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── HomeLab ── */
function Homelab() {
  return (
    <section className="pr-band" aria-labelledby="lab-h">
      <div className="pr-wrap pr-lab">
        <div className="pr-lab-text">
          <span className="pr-eyebrow">Infrastructure</span>
          <h2 id="lab-h">Servers that turn clean energy into experiences.</h2>
          <p>My homelab runs a stack of self-hosted services on solar export credits, with Ubiquiti networking and open-source Docker apps behind it. Lately I&apos;m leaning more toward cloud hosting too, so this site itself now lives on Vercel.</p>
          <dl className="pr-stats">
            <div><dt>servers</dt><dd>3</dd></div>
            <div><dt>usable storage</dt><dd>24TB</dd></div>
            <div><dt>self-hosted apps</dt><dd>38</dd></div>
          </dl>
          <div className="pr-apps">
            <span className="pr-apps-label">Running right now</span>
            <div className="pr-apps-row">
              {HOMELAB_APPS.map((n) => <img key={n} src={`/images/${n}-icon.webp`} alt={n} title={n} />)}
              <span>and more</span>
            </div>
          </div>
          <div className="pr-actions"><a className="pr-btn is-solid" href="/homelab">Explore the HomeLab</a></div>
        </div>
        <figure className="pr-lab-media">
          <RisoPrint src="/images/press/rack.webp" alt="The Chiambucket homelab rack" focus={[0.5, 0.3]} lift={2.3} cell={2.8} cellSmall={2.2} seed={29} className="pr-lab-print" />
          <figcaption>The rack, printed in riso by this page.</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ── 03 Gallery (live Lychee albums) ── */
type LycheeApi = { createLycheeEmbed: (n: Element, o: object) => { unmount?: () => void } };
const lychee = () => (window as unknown as { LycheeEmbed?: LycheeApi }).LycheeEmbed;

function Gallery() {
  const [album, setAlbum] = useState<string>('highlight');
  const [expanded, setExpanded] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [ready, setReady] = useState(false);
  const app = useRef<{ unmount?: () => void } | null>(null);

  // The embed's cross-origin stylesheet loads after paint so it never blocks it.
  useEffect(() => {
    if (document.querySelector('link[data-lychee-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://photos.chiambucket.com/embed/lychee-embed.css?v=1.0.0';
    link.setAttribute('data-lychee-css', '');
    document.head.appendChild(link);
  }, []);
  // Returning to the page: the script is already loaded, so onLoad won't fire.
  useEffect(() => { if (lychee()) setReady(true); }, []);

  useEffect(() => {
    const L = lychee();
    const stage = document.getElementById('hp-gallery-stage');
    if (!ready || !L || !stage) return;
    const id = ALBUMS.find((a) => a[0] === album)![2];
    setSwitching(true);
    const t = window.setTimeout(() => {
      try { app.current?.unmount?.(); } catch { /* already gone */ }
      stage.innerHTML = '';
      const node = document.createElement('div');
      node.id = 'lyc';
      const attrs: Record<string, string> = { 'data-api-url': 'https://photos.chiambucket.com', 'data-mode': 'album', 'data-album-id': id, 'data-layout': 'masonry', 'data-spacing': '8', 'data-target-row-height': '150', 'data-target-column-width': '150', 'data-max-photos': 'none', 'data-sort-order': 'desc', 'data-header-placement': 'none' };
      for (const k in attrs) node.setAttribute(k, attrs[k]);
      stage.appendChild(node);
      try { app.current = L.createLycheeEmbed(node, { albumId: id }); } catch { /* embed failed; stage stays empty */ }
      requestAnimationFrame(() => setSwitching(false));
    }, 200);
    return () => window.clearTimeout(t);
  }, [album, ready]);

  const label = ALBUMS.find((a) => a[0] === album)![1];
  return (
    <section className="pr-band" aria-labelledby="gal-h">
      <Script src="https://photos.chiambucket.com/embed/lychee-embed.js?v=1.0.0" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <div className="pr-wrap">
        <SectionHead n="03" eyebrow="Gallery" title={`Photography, ${label}`} />
        <div className="pr-albums" role="tablist" aria-label="Photo albums">
          {ALBUMS.map(([key, name]) => (
            <button key={key} type="button" role="tab" aria-selected={album === key} className={`pr-filter${album === key ? ' is-active' : ''}`}
              onClick={() => { setAlbum(key); setExpanded(false); }}>{name}</button>
          ))}
          <a className="pr-textbtn" href="/photography">All albums</a>
        </div>
        <div className="pr-gallery-box" id="photolink">
          <div className="pr-gallery-top">
            <h3 id="gal-h">{label}</h3>
            <a href="/photography" aria-label="Open the full gallery"><Arrow /></a>
          </div>
          <div className={`pr-gallery-stage${expanded ? ' is-open' : ''}${switching ? ' is-switching' : ''}`} id="hp-gallery-stage" />
          {!expanded && (
            <div className="pr-gallery-fade"><button type="button" className="pr-btn" onClick={() => setExpanded(true)}>Click to expand</button></div>
          )}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="pr-cta" aria-labelledby="cta-h">
      <span className="pr-eyebrow">Get in touch</span>
      <h2 id="cta-h">
        <span>Let&apos;s make something with</span>
        <Roller words={['meaning.', 'intention.', 'purpose.', 'care.', 'soul.']} delay={1100} />
      </h2>
      <div className="pr-actions is-center">
        <a className="pr-btn is-solid" href="/contact">Contact me</a>
        <a className="pr-btn" href="#portfolio-items-holder">Browse projects</a>
      </div>
    </section>
  );
}

export default function HomeClient() {
  const [openCap, setOpenCap] = useState<InfoItem | null>(null);
  const [openTile, setOpenTile] = useState<InfoItem | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [animOpen, setAnimOpen] = useState(false);

  const peek = (id: string) => { setActive(id); document.body.style.overflow = 'hidden'; };
  const closePeek = () => {
    setAnimOpen(false);
    document.body.style.overflow = '';
    window.setTimeout(() => setActive(null), 320);
  };
  useEffect(() => { if (active) requestAnimationFrame(() => setAnimOpen(true)); }, [active]);
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closePeek(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [active]);

  return (
    <>
      <main className="pr-home">
        <Hero />
        <Disciplines />
        <About openTile={setOpenTile} />
        <Projects peek={peek} openCap={setOpenCap} />
        <Collaborators />
        <Homelab />
        <Gallery />
        <Cta />
      </main>
      {/* Project summary reader (shared with the article pages) */}
      <div className={`hp-modal${animOpen ? ' is-open' : ''}`} id="hp-modal" hidden={!active}>
        <div className="hp-modal-backdrop" onClick={closePeek} />
        <div className="hp-modal-panel" role="dialog" aria-modal={true} aria-label="Project details">
          <button className="hp-modal-close" onClick={closePeek} aria-label="Close details">&times;</button>
          <div className="hp-modal-content" id="hp-modal-content">
            {active && <PeekFeed key={active} startId={active} />}
          </div>
        </div>
      </div>
      <InfoModal item={openCap} onClose={() => setOpenCap(null)} />
      <InfoModal item={openTile} onClose={() => setOpenTile(null)} />
    </>
  );
}
