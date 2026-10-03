'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import InfoModal, { type InfoItem } from '../components/InfoModal';
import LazyVideo from '../components/LazyVideo';
import { PeekFeed } from '../components/ProjectPeek';

/* Capability cards (Projects section) → detail pop-ups. Content drawn from the real builds. */
const CAPABILITIES: InfoItem[] = [
  { eyebrow: 'Capability', title: 'Microcontrollers & Firmware',
    blurb: 'I write firmware in C and C++ for ESP32 and Arduino boards with PlatformIO.',
    points: ['ESP32-S3 firmware for Project June and ESP32 firmware for the LoRA Messenger', 'PWM motor control, servo steering and sensor drivers', 'MicroPython on an ESP32 for LUMEN, streaming audio with about 10 KB of peak memory'],
    chips: ['ESP32', 'Arduino', 'ATmega328', 'PlatformIO', 'C / C++'] },
  { eyebrow: 'Capability', title: 'PCB Design',
    blurb: 'I draw the schematic and lay out the board in KiCAD, then solder the SMD parts myself.',
    points: ['The LoRA Messenger’s custom board, reflowed at home', 'A from-scratch recreation of my school’s ATmega328 dev board', 'Schematic capture, footprint sourcing and respins'],
    chips: ['KiCAD', 'EAGLE', 'SMD reflow', 'Schematic capture'] },
  { eyebrow: 'Capability', title: 'Wireless Comms',
    blurb: 'LoRa for range, ESP-NOW for quick local links, MQTT for telemetry and WebRTC for live video over cellular.',
    points: ['Three live WebRTC camera streams over 5G on Project June', 'Long-range text on LoRa and two-way voice on ESP-NOW', 'MQTT telemetry brokered through my homelab'],
    chips: ['LoRa', 'ESP-NOW', 'MQTT', 'WebRTC', 'SocketIO', '5G'] },
  { eyebrow: 'Capability', title: '3D & CAD',
    blurb: 'I model enclosures and parts in Onshape, render in Blender, and 3D print until the fit is right.',
    points: ['The LoRA Messenger’s handheld case', 'The six-part Pandus dispenser body, which fit on the first print', 'Concept renders for pitches and posters'],
    chips: ['Onshape', 'Blender', '3D printing', 'Enclosure design'] },
  { eyebrow: 'Capability', title: 'Design & Media',
    blurb: 'Interfaces in Figma and Spline, posters in Photoshop, and project videos in DaVinci Resolve.',
    points: ['UI and dashboards in Figma, often with Spline 3D scenes', 'Posters and graphics in Photoshop', 'Project films cut and graded in DaVinci Resolve'],
    chips: ['Figma', 'Photoshop', 'DaVinci Resolve', 'Premiere Pro', 'Spline 3D'] },
  { eyebrow: 'Capability', title: 'Infrastructure',
    blurb: 'A self-hosted homelab on Unraid, Proxmox and Docker, behind Nginx and a segmented UniFi network.',
    points: ['Self-hosted services behind Nginx Proxy Manager and CrowdSec', 'A WireGuard and Tailscale mesh to reach home from anywhere', 'coturn and MQTT that back real hardware projects'],
    chips: ['Proxmox', 'Docker', 'Nginx', 'Tailscale', 'Wireguard', 'Unifi'],
    link: { label: 'Explore the HomeLab', url: '/homelab' } },
];

/* About-bento tiles → detail pop-ups (intro / engineering / microcontrollers / powerpoint). */
const TILE_INTRO: InfoItem = {
  eyebrow: 'Hello',
  title: "Hi, I'm Braven",
  blurb: "I'm a 19-year-old Electronic and Computer Engineering student at Nanyang Polytechnic in Singapore. I started by taking apart a broken radio to see how it worked. Now I build rovers, circuit boards, web apps and the homelab they run on.",
  add: "Most projects need hardware, software and design, and I like doing all three myself.",
  links: [
    { label: 'Get in touch', url: '/contact' },
    { label: 'Sukuna art credit', url: 'https://www.pinterest.com/pin/665547651180427494/' },
  ],
};

const TILE_ENGINEERING: InfoItem = {
  eyebrow: 'Engineering',
  title: 'Circuits, firmware and 3D CAD',
  blurb: "I design circuit boards in KiCAD, write firmware in C and C++ with PlatformIO, and model enclosures in Onshape to 3D print. I also design the interface when a project has one.",
  add: "The render on the card is from my Kauli concept, made in Blender. Below is the live dashboard I designed for the EMA smart home.",
  media: '/images/Cdyspstart.webp',
  links: [
    { label: 'See the Kauli concept', url: '/comingsoon' },
    { label: 'EMA smart-home UI', url: '/csdp' },
  ],
};

const TILE_MICRO: InfoItem = {
  eyebrow: 'The brains of the build',
  title: 'Microcontrollers I build with',
  blurb: "Most of my builds run on a microcontroller. I write the firmware in C and C++ with PlatformIO and pick the board to suit the project.",
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
  eyebrow: 'Slides',
  title: 'Slides for school pitches',
  blurb: "I design the decks for my school presentations: one idea per slide, large type and real photos, with the detail in what I say.",
  links: [
    { label: 'Download the slides (.pptx)', url: 'https://content.chiambucket.com/downloadable/CPB1v4.pptx' },
  ],
};

/* People I've built school projects with, drawn from the ELEC-F and EMA team rolls. */
type Collab = {
  name: string;
  role: string;
  img: string | null;
  fit: 'cover' | 'contain';
  initials?: string;
  profile: string | null;
  projects: { label: string; url: string }[];
};
const COLLABORATORS: Collab[] = [
  { name: 'Tan Yong Rui', role: 'Lead · Docs · Code', img: 'https://framerusercontent.com/images/Z3GPice7XE0ttZhHBYRI737GQtA.png?scale-down-to=512&width=854&height=486', fit: 'contain', profile: 'https://tanyongrui11.framer.website/project/www-pentaclay-com', projects: [{ label: 'ELEC-F', url: '/elecf' }, { label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Md Sadiq', role: 'Team Lead on ELEC-F', img: '/images/elecf-sadiq.jpeg', fit: 'cover', profile: 'https://www.mdsadiq.cc', projects: [{ label: 'ELEC-F', url: '/elecf' }] },
  { name: 'Ong Zheng Xian', role: 'Docs · Code', img: 'https://www.ongkian.com/css/images/Passport_Photo.jpg', fit: 'cover', profile: 'https://www.ongkian.com', projects: [{ label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Joycelyn Wong', role: 'Docs · Code', img: 'https://framerusercontent.com/images/asafLs7NWVzXO9AolaQ8XVF5F4.jpg?scale-down-to=512&width=1280&height=807', fit: 'cover', profile: 'https://joycelynwong.framer.website/projects/ema', projects: [{ label: 'EMA Smart Home', url: '/csdp' }] },
  { name: 'Abel Goh', role: 'Team member on ELEC-F', img: '/images/abel-goh.webp', fit: 'cover', profile: 'https://frequent-location-124634.framer.app', projects: [{ label: 'ELEC-F', url: '/elecf' }] },
];

/* What I did on each project, by discipline. null = no work in that discipline.
   Facts from the write-ups. Rows open the project's peek summary. */
const HSD: { id: string; name: string; kind: string; hw: string | null; sw: string | null; de: string | null }[] = [
  { id: 'proj-june', name: 'Project June', kind: 'Personal, 3 weeks',
    hw: 'ESP32-S3 with GPS, IMU and more sensors, a MOSFET motor driver and a 2S3P battery pack I built, three phones for 5G and cameras',
    sw: 'Three WebRTC video streams through a TURN server, MQTT telemetry, Xbox controller input',
    de: 'Operator console in Figma with a Spline 3D model of the rover' },
  { id: 'proj-beadreader', name: 'BeadReader', kind: 'Personal',
    hw: null,
    sw: 'Next.js, Supabase Postgres, Cloudflare R2, my own cookie auth, a content gate enforced in SQL',
    de: 'Reading themes, live presence rings, a reading stats page' },
  { id: 'proj-lora', name: 'LoRA Messenger', kind: 'Personal, 3 months',
    hw: 'My first PCB, laid out in KiCAD and soldered by hand: ESP32, LoRa radio, two displays, LiPo',
    sw: 'PlatformIO firmware for LoRa text, ESP-NOW voice and a range-test mode',
    de: 'A 3D-printed case modelled in Onshape' },
  { id: 'proj-lumen', name: 'LUMEN', kind: 'School, IoT module',
    hw: 'ESP32-WROOM with an I2S microphone, DHT22, PIR, light sensor, NeoPixel, fan, servo and OLED',
    sw: 'MicroPython, a FastAPI server in Docker, Whisper and DeepSeek through OpenRouter, MQTT',
    de: null },
  { id: 'proj-ema', name: 'EMA Smart Home', kind: 'School, team of 5',
    hw: 'Four BeagleBone Black Wireless boards with MikroBUS sensor modules',
    sw: 'A SocketIO server that hosts the dashboard and sounds the fire alarm on every node',
    de: 'Dashboard UI in Figma and a live 3D house in Spline' },
  { id: 'proj-elecf', name: 'ELEC-F', kind: 'School, team of 4',
    hw: 'Two M5Stack Fire controllers, a ToF door sensor, a PIR presence sensor, an RGB light and a buzzer',
    sw: 'Timer and alarm logic on the M5Stack',
    de: 'The cardboard freezer prototype and the project poster' },
  { id: 'proj-pandus', name: 'Pandus Dispenser', kind: 'School, my first project',
    hw: 'Arduino Uno, a DC pump on a relay, a servo, an infrared sensor and high-power LEDs',
    sw: 'Python with PyFirmata',
    de: 'A six-part body modelled in Onshape that fit on the first print' },
];

/* ── Shared icon helpers ── */
const AC = () => <svg aria-hidden="true"><use href="#icon-arrow-circle" /></svg>;
const CR = () => <svg aria-hidden="true"><use href="#icon-chevron-right" /></svg>;
const AU = () => <svg aria-hidden="true"><use href="#icon-arrow-ur" /></svg>;
const SR = () => <svg aria-hidden="true"><use href="#icon-search" /></svg>;
const ST = () => <svg aria-hidden="true"><use href="#icon-star" /></svg>;
const SB = () => <svg aria-hidden="true"><use href="#icon-sparkle-btn" /></svg>;
const CRWN = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 18.2h19.2l-1.5-9.4-5.4 3.9L12 4.8 9.3 12.7 3.9 8.8z" /></svg>;

/* ── Design Tools 3D coverflow carousel ── */
const TOOL_RING = [
  { src: '/images/photoshop-icon-dark.webp', name: 'Photoshop' },
  { src: '/images/figma-icon-dark.webp', name: 'Figma' },
  { src: '/images/davinci-icon-dark.webp', name: 'DaVinci Resolve' },
  { src: '/images/premier-icon-dark.webp', name: 'Premiere Pro' },
  { src: '/images/spline-icon-dark.webp', name: 'Spline' },
  { src: '/images/powerpoint-icon-dark.webp', name: 'PowerPoint' },
];

function ToolCarousel() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = TOOL_RING.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 2200);
    return () => clearInterval(id);
  }, [reduced, n]);

  // Shortest signed offset of slot i from the active slot, e.g. for n=6: -2..3 → wrapped to -3..2
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  if (reduced) {
    // Static fanned/tilted arrangement, no motion.
    return (
      <div className="hp-tcar hp-tcar-static" aria-label="Design tools: Photoshop, Figma, DaVinci Resolve, Premiere Pro, Spline, PowerPoint">
        <div className="hp-tcar-stage">
          {TOOL_RING.map((tool, i) => {
            const d = offsetOf(i);
            return (
              <div className="hp-tcar-chip" key={tool.name}
                style={{ transform: `translateX(${d * 38}px) rotate(${d * 6}deg)`, zIndex: 10 - Math.abs(d), opacity: Math.abs(d) > 2 ? 0 : 1 }}>
                <img src={tool.src} alt={tool.name} loading="lazy" />
              </div>
            );
          })}
        </div>
        <span className="hp-tcar-label">{TOOL_RING[active].name}</span>
      </div>
    );
  }

  return (
    <div className="hp-tcar" aria-label={`Design tools carousel, currently showing ${TOOL_RING[active].name}`}>
      <div className="hp-tcar-stage">
        <div className="hp-tcar-ring">
          {TOOL_RING.map((tool, i) => {
            const d = offsetOf(i);
            const ad = Math.abs(d);
            const style: React.CSSProperties = {
              transform: `translateX(${d * 64}px) translateZ(${-ad * 78}px) rotateY(${d * -34}deg) scale(${1 - ad * 0.16})`,
              opacity: ad > 2 ? 0 : 1 - ad * 0.32,
              zIndex: 10 - ad,
            };
            return (
              <div className={`hp-tcar-chip${d === 0 ? ' is-active' : ''}`} key={tool.name} style={style} aria-hidden={d !== 0}>
                <img src={tool.src} alt={tool.name} loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>
      <span className="hp-tcar-label" aria-live="polite">{TOOL_RING[active].name}</span>
    </div>
  );
}

export default function HomeClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnimOpen, setModalAnimOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(false); // mobile-only collapse
  const [openCap, setOpenCap] = useState<InfoItem | null>(null); // capability detail modal
  const [openTile, setOpenTile] = useState<InfoItem | null>(null); // about-bento tile detail modal

  /* ── Modal ── */
  const openProject = (cardEl: Element | string) => {
    const card = (typeof cardEl === 'string'
      ? document.getElementById(cardEl)
      : (cardEl as Element).closest('.hp-pf-card')) as HTMLElement | null;
    if (!card?.id) return;
    setActiveProject(card.id);
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

  /* ── Escape key close ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalOpen) closeProject(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [modalOpen]);

  /* ── Blink easter egg ── */
  useEffect(() => {
    const id = setInterval(() => {
      const el = document.getElementById('sukuna-blink');
      if (el) { el.classList.add('abm-top1-blink'); setTimeout(() => el.classList.remove('abm-top1-blink'), 50); }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* ── Lychee stylesheet: inject after paint so the cross-origin homelab CSS never render-blocks first paint ── */
  useEffect(() => {
    if (document.querySelector('link[data-lychee-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://photos.chiambucket.com/embed/lychee-embed.css?v=1.0.0';
    link.setAttribute('data-lychee-css', '');
    document.head.appendChild(link);
  }, []);

  /* ── Projects gallery filter/search ── */
  useEffect(() => {
    let activeFilter = 'all';
    const cards = () => Array.from(document.querySelectorAll('.hp-pf-card')) as HTMLElement[];
    const gridEl = () => document.getElementById('hp-pf-grid');

    const applyFilter = (opts: { fade?: boolean; stagger?: boolean } = {}) => {
      const input = document.getElementById('hp-pf-search') as HTMLInputElement | null;
      const q = (input?.value ?? '').toLowerCase().trim();
      const decided = cards().map((card) => {
        const type = card.dataset.type || '';
        const matchFilter = activeFilter === 'all' ||
          (activeFilter === 'highlight' ? card.dataset.highlight === '1'
            : activeFilter === 'flagship' ? card.dataset.flagship === '1'
            : type === activeFilter);
        const matchSearch = !q || (card.dataset.search || '').includes(q);
        return { card, show: matchFilter && matchSearch };
      });
      const commit = () => {
        let i = 0, shown = 0;
        decided.forEach(({ card, show }) => {
          card.style.display = show ? '' : 'none';
          card.classList.remove('just-shown');
          if (show) {
            shown++;
            if (opts.stagger) { card.style.animationDelay = (i * 0.045) + 's'; void card.offsetWidth; card.classList.add('just-shown'); }
            i++;
          }
        });
        const empty = document.getElementById('hp-pf-empty');
        if (empty) empty.hidden = shown > 0;
      };
      const g = gridEl();
      if (opts.fade && g) { g.classList.add('is-filtering'); setTimeout(() => { commit(); g.classList.remove('is-filtering'); }, 180); }
      else commit();
    };

    (window as any).setProjectFilter = (btn: HTMLButtonElement) => {
      if (btn.classList.contains('is-active')) return;
      document.querySelectorAll('.hp-pf-filter').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter || 'all';
      applyFilter({ fade: true, stagger: true });
    };
    (window as any).filterProjects = () => applyFilter({});

    cards().forEach((c) => { if (c.dataset.highlight === '1') c.classList.add('is-highlight'); if (c.dataset.flagship === '1') c.classList.add('is-flagship'); });
    applyFilter();
  }, []);

  /* ── Word rotator (with cleanup so intervals don't stack on re-visits) ── */
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const resizeHandlers: Array<() => void> = [];

    function initRoller(el: HTMLElement, startDelay: number) {
      const em = el.querySelector('em') as HTMLElement | null;
      const words = (el.getAttribute('data-words') || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (!em || words.length < 2) return;
      let i = 0;
      const widthOf = (text: string) => {
        const g = em!.cloneNode(false) as HTMLElement;
        g.textContent = text; g.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;width:auto';
        el.appendChild(g); const w = g.getBoundingClientRect().width; el.removeChild(g); return w;
      };
      el.style.width = widthOf(words[0]) + 'px';
      const tick = () => {
        const ni = (i + 1) % words.length;
        el.style.width = widthOf(words[ni]) + 'px';
        em!.classList.remove('is-in'); em!.classList.add('is-out');
        setTimeout(() => { i = ni; em!.textContent = words[i]; em!.classList.remove('is-out'); void em!.offsetWidth; em!.classList.add('is-in'); }, 360);
      };
      const t = setTimeout(() => { intervals.push(setInterval(tick, 2800)); }, startDelay);
      timeouts.push(t);
      const onResize = () => { el.style.width = widthOf(words[i]) + 'px'; };
      window.addEventListener('resize', onResize);
      resizeHandlers.push(onResize);
    }
    document.querySelectorAll<HTMLElement>('.hp-roll').forEach((el, idx) => initRoller(el, idx * 1100));

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      resizeHandlers.forEach((h) => window.removeEventListener('resize', h));
    };
  }, []);

  /* ── Lychee gallery ── */
  const initLychee = () => {
    const albums: Record<string, string> = {
      highlight: 'pxAS20i7_kWFVTC_Ke_HlDUk',
      europe: 'LhvwBoxDDt6VdG3HvKrDMi1Z',
      china: 'LscJWL46nCkW76KiKEY4csiI',
      zealand: 'RgKkSumOaHmpoMKbNxPU-o-0',
      by219: 'cZ6uVEzxH72ygIJLPbnxZAiN',
      general: 'X1sod6pbc0khZPykFISHCjzg',
    };
    let app: any = null, current: string | null = null;

    const mount = (id: string) => {
      const stage = document.getElementById('hp-gallery-stage');
      if (!stage || !(window as any).LycheeEmbed) return;
      try { if (app?.unmount) app.unmount(); } catch (e) {}
      stage.innerHTML = '';
      const node = document.createElement('div');
      node.className = 'lyc'; node.id = 'lyc';
      const attrs: Record<string, string> = { 'data-api-url': 'https://photos.chiambucket.com', 'data-mode': 'album', 'data-album-id': id, 'data-layout': 'masonry', 'data-spacing': '8', 'data-target-row-height': '150', 'data-target-column-width': '150', 'data-max-photos': 'none', 'data-sort-order': 'desc', 'data-header-placement': 'none' };
      for (const k in attrs) node.setAttribute(k, attrs[k]);
      stage.appendChild(node);
      try { app = (window as any).LycheeEmbed.createLycheeEmbed(node, { albumId: id }); } catch (e) {}
    };

    (window as any).switchGallery = (key: string, btn: HTMLButtonElement) => {
      if (!albums[key] || key === current) return;
      document.querySelectorAll('.hp-album-link').forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      if (btn) { btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true'); }
      const title = document.getElementById('hp-gallery-title');
      if (title && btn) title.textContent = btn.textContent?.trim() ?? '';
      const ex = document.getElementById('expand');
      if (ex) ex.classList.remove('loader-hide');
      current = key;
      const stage = document.getElementById('hp-gallery-stage');
      if (stage) { stage.classList.add('is-switching'); setTimeout(() => { mount(albums[key]); requestAnimationFrame(() => stage.classList.remove('is-switching')); }, 240); }
      else mount(albums[key]);
    };

    (window as any).expandphoto = () => {
      const lyc = document.getElementById('lyc');
      if (lyc) lyc.classList.remove('lyc');
      const exp = document.getElementById('expand');
      if (exp) exp.classList.add('loader-hide');
    };

    current = 'highlight'; mount(albums.highlight);
  };

  /* ── Re-init Lychee on return visits (script already loaded, onLoad won't fire again) ── */
  useEffect(() => {
    if ((window as any).LycheeEmbed) {
      initLychee();
    }
  }, []);

  /* ── Peek button helper ── */
  const peek = (e: React.MouseEvent<HTMLButtonElement>) => openProject(e.currentTarget);

  return (
    <>
      <Script src="https://photos.chiambucket.com/embed/lychee-embed.js?v=1.0.0" strategy="afterInteractive" onLoad={initLychee} />

      {/* SVG symbol definitions */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="icon-sparkle-btn" viewBox="0 0 24 24" fill="none">
          <path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"/><path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"/><path className="path" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="currentColor" d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"/>
        </symbol>
        <symbol id="icon-arrow-circle" viewBox="0 0 24 24" fill="none"><path fill="currentColor" clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"/></symbol>
        <symbol id="icon-chevron-right" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></symbol>
        <symbol id="icon-arrow-ur" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15"/></symbol>
        <symbol id="icon-search" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20.5 20.5l-4-4"/></symbol>
        <symbol id="icon-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z"/></symbol>
      </svg>

      {/* Atmosphere backdrop + page-agnostic reskin are global now:
          SensoryShell mounts in app/layout.tsx, tokens/panels/nav/footer live in
          the DARK SENSORY section of mainstyle.css. Only homepage-specific
          retuning stays here. */}
      <main>

        {/* ═══════ DARK SENSORY, homepage-specific retuning ═══════ */}
        <style>{`
          /* ── Hero: let the shader be the backdrop ── */
          html.sensory-active .hp-hero-grid { display: none; }
          html.sensory-active .hp-hero::before, html.sensory-active .hp-hero::after { opacity: 0.2; }
          html.sensory-active .hp-hero-kicker { font-family: var(--font-ddt); letter-spacing: 0.08em; font-size: 0.82rem; color: rgba(226,212,190,0.6); }
          html.sensory-active .hp-hero-sub { color: rgba(222,229,248,0.68); }
          /* brutalist terminal headline: condensed caps riding the light plume */
          html.sensory-active .hp-hero-title { text-transform: uppercase; letter-spacing: 0.015em; }
          /* the accent words catch the light source */
          html.sensory-active .hp-hero-title em { text-shadow: 0 0 34px rgba(var(--sa-accent),0.35); }
          /* "New" topper pill → terminal status chip */
          html.sensory-active .hero-topper {
            background: rgba(9,12,20,0.55) !important; border: 1px solid rgba(var(--sa-accent),0.28) !important;
            -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
          html.sensory-active .hero-topper-content {
            font-family: var(--font-ddt) !important; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.66rem !important; }
          /* NEW chip: solid ember with dark type, so it reads as a badge rather than a whisper */
          html.sensory-active .hero-topper-new-tag {
            font-family: var(--font-ddt) !important; text-transform: uppercase; letter-spacing: 0.1em;
            font-weight: 700;
            background: rgb(var(--sa-ember)) !important; color: #17100b !important;
            border: 1px solid rgba(255,146,105,0.9) !important;
            box-shadow: 0 2px 12px -2px rgba(var(--sa-ember),0.55); }
          html.sensory-active .hp-scroll { font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.24em; font-size: 0.56rem; color: rgba(214,200,180,0.5); }

          /* ── Cards: homepage-only detail on top of the global panel language ── */
          html.sensory-active .hp-disc::after { opacity: 0.7; }
          html.sensory-active .hp-cap-card h4 { color: rgba(var(--sa-accent),0.92); }
          html.sensory-active .hp-disc-num { font-family: var(--font-ddt); }
          html.sensory-active .hp-disc { padding: 30px 26px 24px !important; }
          html.sensory-active .hp-cap-card { padding: 24px 22px 22px !important; }

          /* Spotlight + homelab stat readouts */
          html.sensory-active .hp-spot-stat b { color: #f2e8d8; }
          html.sensory-active .hp-spot-stat span, html.sensory-active .hp-homelab-stat span {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.13em; font-size: 0.56rem; color: rgba(214,200,180,0.52); }
          html.sensory-active .hp-spot-tags span {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.62rem; }

          /* Toolbar + album tabs → instrument controls */
          html.sensory-active .hp-pf-search-wrap, html.sensory-active .hp-pf-filter, html.sensory-active .hp-album-link {
            background: rgba(var(--sa-accent),0.05) !important; border: 1px solid rgba(176,196,252,0.16) !important; }
          html.sensory-active .hp-pf-filter.is-active, html.sensory-active .hp-album-link.is-active {
            background: rgba(var(--sa-accent),0.16) !important; border-color: rgba(var(--sa-accent),0.42) !important; color: #eaf0ff !important; }

          /* Experience + stack labels → mono spec readouts */
          html.sensory-active .hp-exp-chip span, html.sensory-active .hp-stack-label {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.11em; font-size: 0.55rem; color: rgba(214,200,180,0.52); }

          /* Gallery + projects bottom fades → a strong dissolve into the warm paper atmosphere (never pure black) */
          html.sensory-active .photo-main-ver .expand {
            background: linear-gradient(180deg, rgba(12,9,5,0) 0%, rgba(12,9,5,0.55) 55%, rgba(12,9,5,0.97) 100%) !important; }
          html.sensory-active .hp-pf-showmore-wrap::before {
            background: linear-gradient(to bottom, rgba(12,9,5,0) 0%, rgba(12,9,5,0.8) 62%, rgba(12,9,5,0.97) 100%) !important; }

          /* The flagship spotlight badge stays the premium gold crown (see .hp-spot-badge). */
        `}</style>

        {/* ── HERO ── */}
        <header className="hp-hero">
          <div className="hp-hero-aura"></div>
          <div className="hp-hero-grid"></div>
          <a className="hero-topper" href="/beadreader">
            <div className="hero-topper-new-tag">New</div>
            <div className="hero-topper-content">BeadReader</div>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="hero-topper-arrow"><path fill="#E8E8E8" d="M338.752 104.704a64 64 0 000 90.496l316.8 316.8-316.8 316.8a64 64 0 0090.496 90.496l362.048-362.048a64 64 0 000-90.496L429.248 104.704a64 64 0 00-90.496 0z"/></svg>
          </a>
          <div className="hp-hero-kicker">Braven Chiam, Singapore</div>
          <h1 className="hp-hero-title hero-headline-text">
            Hardware, software <em>and design.</em>
          </h1>
          <p className="hp-hero-sub">I&apos;m a third-year Electronic and Computer Engineering student at Nanyang Polytechnic. I design circuit boards, write the software that runs on them, and model the cases they go in.</p>
          <div className="hp-hero-cta">
            <button className="button-hero" onClick={() => { document.getElementById('portfolio-items-holder')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <div className="dots_border"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle"><use href="#icon-sparkle-btn"/></svg>
              <span className="text_button">View my work</span>
            </button>
            <a className="hp-btn" href="/contact">Get in touch <AC /></a>
          </div>
          <div className="hp-scroll"><span className="hp-mouse"><span></span></span>Scroll</div>
        </header>

        {/* ── HARDWARE / SOFTWARE / DESIGN ── */}
        <section className="hp-band" id="what-i-do">
          <div className="hp-section">
            <div className="hp-band-intro" data-reveal>
              <span className="hp-eyebrow">What I do</span>
              <h2>What I did on each project.</h2>
              <p>Split into hardware, software and design. Most builds use all three. Select a row for a short summary.</p>
            </div>
            <div className="hp-hsd" role="table" aria-label="Projects by hardware, software and design" data-reveal>
              <div className="hp-hsd-row hp-hsd-head" role="row">
                <span role="columnheader">Project</span>
                <span role="columnheader">Hardware</span>
                <span role="columnheader">Software</span>
                <span role="columnheader">Design</span>
              </div>
              {HSD.map((p) => (
                <div key={p.id} className="hp-hsd-row" role="row">
                  <span className="hp-hsd-name" role="rowheader">
                    <button type="button" onClick={() => openProject(p.id)}>{p.name}</button>
                    <small>{p.kind}</small>
                  </span>
                  {(['hw', 'sw', 'de'] as const).map((k) => (
                    <span key={k} role="cell" className={`hp-hsd-cell${p[k] ? '' : ' is-empty'}`}>
                      <i aria-hidden="true">{k === 'hw' ? 'Hardware' : k === 'sw' ? 'Software' : 'Design'}</i>
                      {p[k] ?? <span className="sr-only">None</span>}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT BENTO ── */}
        <section className="abm-bg hp-band" id="about">
          <div className="hp-section">
            <div className="section-editorial-header" data-reveal>
              <span className="seh-number">01</span>
              <div className="seh-content"><span className="seh-eyebrow">About</span><span className="seh-title">What I work with</span></div>
            </div>
            <div className="hp-bento">
              {/* Intro */}
              <div className="hp-tile hp-tile-intro hp-clickable" data-reveal role="button" tabIndex={0} onClick={() => setOpenTile(TILE_INTRO)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_INTRO); } }}>
                <span className="hp-tile-go"><AU /></span>
                <img className="hp-wave" src="/images/wave.webp" alt="Waving hand" />
                <a className="hp-blink" id="sukuna-blink" href="https://www.pinterest.com/pin/665547651180427494/" onClick={(e) => e.stopPropagation()} aria-label="A little friend"></a>
                <h3 className="hp-tile-h">Hi, I&apos;m Braven.</h3>
                <p className="hp-tile-p">Electronic and Computer Engineering student in Singapore. Most of what I know about building things I taught myself through these projects.</p>
              </div>
              {/* Engineering */}
              <div className="hp-tile hp-tile-eng hp-clickable" data-reveal data-delay="1" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_ENGINEERING)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_ENGINEERING); } }}>
                <span className="hp-tile-go"><AU /></span>
                <div className="hp-tile-media"><img src="/images/abm-engineering.webp" alt="" /></div>
                <span className="hp-key">Engineering</span>
                <h3 className="hp-tile-h">Circuits, firmware<br />and 3D CAD.</h3>
                <p className="hp-tile-p">Custom PCBs in KiCAD, firmware in PlatformIO, enclosures in Onshape.</p>
              </div>
              {/* Microcontrollers */}
              <div className="hp-tile hp-tile-micro hp-clickable" data-reveal data-delay="2" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_MICRO)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_MICRO); } }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Microcontrollers</span>
                <div className="hp-iconrow">
                  <img src="/images/microchip-icon.webp" alt="Microchip" /><img src="/images/esp-icon.webp" alt="ESP32" /><img src="/images/PlatformIO-icon.webp" alt="PlatformIO" /><img src="/images/arduino-icon.webp" alt="Arduino" />
                </div>
                <h3 className="hp-tile-h">ESP32, Arduino, ATmega328 and PlatformIO.</h3>
              </div>
              {/* DaVinci */}
              <div className="hp-tile hp-media-tile hp-tile-davinci hp-clickable" data-reveal role="link" tabIndex={0} onClick={() => window.open('https://www.youtube.com/@newkringster2564', '_blank')} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <LazyVideo webm="/images/Davinci-showcase.webm" mp4="/images/Davinci-showcase.mp4" poster="/images/Davinci-showcase-poster.webp" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">DaVinci Resolve</span><h3 className="hp-tile-h">Project videos.</h3><p className="hp-tile-p">I film and edit the demo video for each build.</p></div>
              </div>
              {/* Figma */}
              <div className="hp-tile hp-tile-figma hp-clickable" data-reveal data-delay="1" role="link" tabIndex={0} onClick={() => { window.location.href = '/photography'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Figma</span>
                <div className="hp-figma-stack"><img className="back" src="/images/ELECF.webp" alt="" /><img className="mid" src="/images/Dashboard.webp" alt="" /><img className="front" src="/images/Cdyspstart.webp" alt="" /></div>
                <div><h3 className="hp-tile-h">Interfaces and posters.</h3><p className="hp-tile-p">The Project June console, the EMA dashboard and the ELEC-F poster.</p></div>
              </div>
              {/* Design Tools */}
              <div className="hp-tile hp-tile-tools hp-clickable" data-reveal data-delay="2" role="link" tabIndex={0} onClick={() => { window.location.href = '#capabilities'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Design Tools</span>
                <ToolCarousel />
                <p className="hp-tile-p">Photoshop, Figma, DaVinci Resolve, Premiere Pro, Spline and PowerPoint.</p>
              </div>
              {/* Photography */}
              <div className="hp-tile hp-media-tile hp-tile-photo hp-clickable" data-reveal role="link" tabIndex={0} onClick={() => { window.location.href = '#photolink'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <img src="/images/abm-lr.webp" alt="Photography" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">Photography</span><h3 className="hp-tile-h">Travel photos.</h3><p className="hp-tile-p">Europe, China, New Zealand and Hong Kong.</p></div>
              </div>
              {/* PowerPoint */}
              <div className="hp-tile hp-tile-ppt hp-clickable" data-reveal data-delay="1" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_PPT)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_PPT); } }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">PowerPoint</span>
                <div className="hp-ppt-media"><LazyVideo webm="/images/CPB1v4.webm" mp4="/images/CPB1v4.mp4" poster="/images/CPB1v4-poster.webp" /></div>
                <h3 className="hp-tile-h" style={{ fontSize: '1.25rem' }}>Slides for school pitches.</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section className="hp-band hp-projects-band" id="portfolio-items-holder">
          <div className="hp-section">
            <div className="portfolio-editorial-header" data-reveal>
              <div className="peh-number">02</div>
              <div className="peh-content">
                <div className="peh-eyebrow">Selected Work</div>
                <h2 className="peh-title">Projects</h2>
                <p className="peh-description">Open a card for a short summary, or read the full write-up.</p>
              </div>
            </div>

            {/* Flagship spotlight */}
            <article className="hp-spotlight" data-reveal>
              <div className="hp-spot-media">
                <img src="/images/ProjJuneBanner1.webp" alt="Project June, a 5G radio-controlled vehicle" loading="lazy" />
                <span className="hp-spot-badge">Main hardware build</span>
              </div>
              <div className="hp-spot-body">
                <span className="hp-key">Project June · Personal</span>
                <h3 className="hp-spot-title">A 5G rover with three live cameras.</h3>
                <p className="hp-spot-lead">I drive it over 5G from anywhere with signal. Three phones on board stream the video, and an ESP32-S3 reads GPS and the other sensors and drives the motor through a MOSFET driver I built. Three weeks from start to first drive.</p>
                <div className="hp-spot-stats">
                  <div className="hp-spot-stat"><b>3</b><span>live video streams</span></div>
                  <div className="hp-spot-stat"><b>5G</b><span>cellular link</span></div>
                  <div className="hp-spot-stat"><b>8+</b><span>onboard sensors</span></div>
                  <div className="hp-spot-stat"><b>3 wks</b><span>concept to drive</span></div>
                </div>
                <div className="hp-spot-tags"><span>ESP32-S3</span><span>WebRTC</span><span>MQTT</span><span>KiCAD</span><span>Onshape</span><span>PlatformIO</span></div>
                <div className="hp-spot-cta">
                  <button className="hp-btn" onClick={() => openProject('proj-june')}>Read the summary <SB /></button>
                  <button className="hp-btn hp-btn-ghost" onClick={() => { window.location.href = '/project-june'; }}>Full article</button>
                  <button className="hp-btn hp-btn-ghost" onClick={() => window.open('https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC', '_blank')}>Watch the build</button>
                </div>
              </div>
            </article>

            {/* Flagship spotlight — BeadReader (software) */}
            <article className="hp-spotlight hp-spotlight-solo" data-reveal>
              <div className="hp-spot-media">
                <img src="/images/beadreader-flagship.webp" alt="BeadReader, a self-hosted invite-only private book reader" loading="lazy" />
                <span className="hp-spot-badge">Main software build</span>
              </div>
              <div className="hp-spot-solo-body">
                <div className="hp-spot-stats">
                  <div className="hp-spot-stat"><b>Live</b><span>read-together presence</span></div>
                  <div className="hp-spot-stat"><b>SQL</b><span>content gate</span></div>
                  <div className="hp-spot-stat"><b>Offline</b><span>PWA, service worker</span></div>
                  <div className="hp-spot-stat"><b>1-click</b><span>Vercel deploy</span></div>
                </div>
                <div className="hp-spot-tags"><span>Next.js</span><span>Supabase</span><span>Cloudflare R2</span><span>Tailwind v4</span><span>TypeScript</span></div>
                <div className="hp-spot-solo-cta">
                  <button className="hp-btn" onClick={() => openProject('proj-beadreader')}>Read the summary <SB /></button>
                  <button className="hp-btn hp-btn-ghost" onClick={() => { window.location.href = '/beadreader'; }}>Full article</button>
                  <button className="hp-btn hp-btn-ghost" onClick={() => window.open('https://github.com/New-Kringster/BeadReader', '_blank')}>GitHub</button>
                </div>
              </div>
            </article>

            {/* Capabilities */}
            <div className="hp-cap" id="capabilities" data-reveal>
              <div className="hp-cap-intro">
                <span className="hp-eyebrow">Capabilities</span>
                <h3 className="hp-cap-h">Skills, and where I used them.</h3>
                <p className="hp-cap-p">Open a card to see the projects behind each one.</p>
              </div>
              <div className="hp-cap-grid">
                {CAPABILITIES.map((cap) => (
                  <div key={cap.title} className="hp-cap-card" role="button" tabIndex={0}
                    aria-label={`${cap.title} details`}
                    onClick={() => setOpenCap(cap)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenCap(cap); } }}>
                    <span className="hp-cap-plus" aria-hidden="true">+</span>
                    <h4>{cap.title}</h4>
                    <div className="hp-cap-chips">{cap.chips!.map((c) => <span key={c}>{c}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hp-pf-lead" data-reveal>
              <h3>All projects</h3><span>Search or filter, then open a card for a summary.</span>
            </div>
            <div className="hp-pf-toolbar" data-reveal>
              <label className="hp-pf-search-wrap">
                <SR />
                <input id="hp-pf-search" className="hp-pf-search" type="search" placeholder="Search projects, tools, tech…"
                  onInput={() => { setProjectsExpanded(true); (window as any).filterProjects?.(); }} aria-label="Search projects" />
              </label>
              <div className="hp-pf-filters" role="group" aria-label="Filter projects">
                {[['all','All'],['personal','Personal'],['school','School']].map(([f, label], i) => (
                  <button key={f} className={`hp-pf-filter${i === 0 ? ' is-active' : ''}`} data-filter={f}
                    onClick={(e) => { setProjectsExpanded(true); (window as any).setProjectFilter?.(e.currentTarget); }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Project cards grid */}
            <div className={`hp-pf-grid${projectsExpanded ? '' : ' is-clamped'}`} id="hp-pf-grid">

              {/* Project June */}
              <article id="proj-june" className="hp-pf-card" data-article="/project-june" data-type="personal" data-flagship="1" data-search="project june 5g rc rover vehicle webrtc mqtt esp32 gps gyroscope laser spline cellular video personal flagship highlight">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/ProjJuneBanner1.webp" alt="Project June rover" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Project June</h3>
                  <p className="hp-pf-blurb">A 5G rover with three live camera feeds, GPS, a laser pointer and seven sensors, driven from a web console.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/esp-icon.webp" alt="" /><img src="/images/Kicad-icon.webp" alt="" /><img src="/images/onshape-icon.webp" alt="" /><img src="/images/PlatformIO-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/project-june'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* BeadReader */}
              <article id="proj-beadreader" className="hp-pf-card" data-article="/beadreader" data-type="personal" data-flagship="1" data-search="beadreader bead reader private book reader ebook webtoon nextjs supabase cloudflare r2 tailwind postgres presence reading stats access code personal flagship highlight web app">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/beadreader-pf-context.webp" alt="BeadReader private book reader" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">BeadReader</h3>
                  <p className="hp-pf-blurb">A private, invite-only online book reader with live reading-together presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats. Next.js and Supabase.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/nextjs-icon.webp" alt="" /><img src="/images/supabase-icon.webp" alt="" /><img src="/images/tailwind-icon.webp" alt="" /><img src="/images/cloudflare-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/beadreader'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* LoRA Messenger */}
              <article id="proj-lora" className="hp-pf-card" data-article="/brolocator" data-type="personal" data-highlight="1" data-search="lora messenger esp32 espnow voice pcb kicad onshape oled battery personal radio highlight">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/borlocator-pf-context.webp" alt="LoRA Messenger" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">LoRA Messenger</h3>
                  <p className="hp-pf-blurb">Two ESP32 handhelds: text over LoRa, rough two-way voice over ESP-NOW. My first PCB, in KiCAD, and a case in Onshape.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/esp-icon.webp" alt="" /><img src="/images/Kicad-icon.webp" alt="" /><img src="/images/onshape-icon.webp" alt="" /><img src="/images/PlatformIO-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/brolocator'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* LUMEN */}
              <article id="proj-lumen" className="hp-pf-card" data-article="/lumen" data-type="school" data-highlight="1" data-search="lumen esp32 voice assistant wake word whisper deepseek llm mqtt fastapi micropython inmp441 microphone smart room iot nyp school highlight">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/lumen-pf-context.webp" alt="LUMEN voice assistant" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">LUMEN</h3>
                  <p className="hp-pf-blurb">A voice-controlled smart-room assistant on an ESP32, with Whisper and a DeepSeek LLM via OpenRouter turning speech into one JSON command over MQTT.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/esp-icon.webp" alt="" /><img src="/images/python-icon.webp" alt="" /><img src="/images/docker-icon.webp" alt="" /><img src="/images/vscode-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/lumen'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* EMA Smart Home */}
              <article id="proj-ema" className="hp-pf-card" data-article="/csdp" data-type="school" data-search="ema smart home beaglebone python socketio flask websocket spline mikrobus school group sensors">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/Ema-pf-context.webp" alt="EMA Smart Home System" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">EMA Smart Home</h3>
                  <p className="hp-pf-blurb">A team smart home: four BeagleBone Black nodes report to a SocketIO server with a live 3D Spline dashboard. Graded A.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/vscode-icon.webp" alt="" /><img src="/images/figma-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /><img src="/images/onshape-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/csdp'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Pandus */}
              <article id="proj-pandus" className="hp-pf-card" data-article="/pandus" data-type="school" data-search="pandus dispenser arduino uno pyfirmata 3d printed servo pump syrup school first">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/pandusarticle.webp" alt="Pandus Dispenser" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Pandus Dispenser</h3>
                  <p className="hp-pf-blurb">My first school project: a six-part 3D-printed syrup dispenser run by an Arduino Uno and PyFirmata.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/onshape-icon.webp" alt="" /><img src="/images/vscode-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /><img src="/images/powerpoint-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/pandus'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* ELEC-F */}
              <article id="proj-elecf" className="hp-pf-card" data-article="/elecf" data-type="school" data-search="elec-f elecf concept m5-stack m5stack freezer safety sensors engineering course school">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/elef2-pf-context.webp" alt="ELEC-F Concept" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">ELEC-F Concept</h3>
                  <p className="hp-pf-blurb">A walk-in freezer alarm on M5Stack. If someone is inside when the door shuts, a timer starts and the alarm sounds when it runs out.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/figma-icon.webp" alt="" /><img src="/images/ps-pf-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/elecf'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Kauli */}
              <article id="proj-kauli" className="hp-pf-card" data-article="/comingsoon" data-type="school" data-search="kauli concept blender 3d communication skills presentation school onshape">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/kauli3-pf-context.webp" alt="Kauli Concept" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Kauli Concept</h3>
                  <p className="hp-pf-blurb">A product concept I pitched for a communication-skills module, rendered in Blender.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/blender-icon.webp" alt="" /><img src="/images/ps-pf-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/comingsoon'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Series One Light */}
              <article id="proj-sol" className="hp-pf-card" data-article="/comingsoon" data-type="personal" data-search="series one light zeromouse optimum tech ultralight 20g fps mouse onshape personal">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/Series1l-pf-context.webp" alt="Series One Light" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Series One Light</h3>
                  <p className="hp-pf-blurb">An ultralight gaming mouse shell, aiming for about 20 g, based on the ZeroMouse.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/onshape-icon.webp" alt="" /><img src="/images/ps-pf-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/comingsoon'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Copy Board */}
              <article id="proj-copyboard" className="hp-pf-card" data-article="/comingsoon" data-type="personal" data-search="copy board kicad pcb schematic dev board school recreation personal">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/CopyBoard-pf-context.webp" alt="Copy Board" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Copy Board</h3>
                  <p className="hp-pf-blurb">A KiCAD recreation of my school&apos;s dev board, made because I couldn&apos;t bring the original home.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/Kicad-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/comingsoon'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Web Dev */}
              <article id="proj-webdev" className="hp-pf-card" data-article="/comingsoon" data-type="school" data-search="web development html css website school first chrome canva demo tht">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/tht-cover.webp" alt="Web Development Project" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Web Development Prj</h3>
                  <p className="hp-pf-blurb">My first fully functional website, built with HTML and CSS as the final assignment for my web development class.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/vscode-icon.webp" alt="" /><img src="/images/chrome-icon.webp" alt="" /><img src="/images/canva-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/comingsoon'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Minecraft */}
              <article id="proj-mc" className="hp-pf-card" data-article="/comingsoon" data-type="personal" data-search="minecraft server paper dynmap live interactive map docker multiplayer personal demo">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type personal">Personal</span>
                  <img src="/images/mc-pf-context.webp" alt="Minecraft Live Map" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Minecraft Live Map</h3>
                  <p className="hp-pf-blurb">A Paper server in Docker on my homelab, with a live Dynmap of the world.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/docker-icon.webp" alt="" /><img src="/images/chrome-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/comingsoon'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

            </div>
            {!projectsExpanded && (
              <div className="hp-pf-showmore-wrap">
                <button className="hp-pf-showmore" onClick={() => setProjectsExpanded(true)}>Show all projects <CR /></button>
              </div>
            )}
            <p className="hp-pf-empty" id="hp-pf-empty" hidden>No projects match that search. Try another keyword.</p>
          </div>
        </section>

        {/* ── COLLABORATORS ── */}
        <section className="hp-band hp-collab-band" data-reveal>
          <div className="hp-section">
            <div className="hp-collab-intro">
              <span className="hp-eyebrow">Collaborators</span>
              <h2 className="hp-collab-h">People I build with</h2>
              <p className="hp-collab-p">A few of the school projects above were team efforts. Here are the people I built them with, and what we made together.</p>
            </div>
            <div className="hp-collab-grid">
              {COLLABORATORS.map((c, i) => (
                <div key={c.name} className="hp-collab-card" data-reveal data-delay={(i % 3) + 1}>
                  <div className="hp-collab-top">
                    <span className="hp-collab-av" style={c.img ? { backgroundImage: `url("${c.img}")`, backgroundSize: c.fit } : undefined}>
                      {!c.img && <span className="hp-collab-initials">{c.initials}</span>}
                    </span>
                    <div className="hp-collab-meta">
                      <b className="hp-collab-name">{c.name}</b>
                      <span className="hp-collab-role">{c.role}</span>
                    </div>
                  </div>
                  <div className="hp-collab-projects">
                    {c.projects.map((p) => (
                      <a key={p.url} className="hp-collab-proj" href={p.url}>{p.label}</a>
                    ))}
                  </div>
                  {c.profile
                    ? <a className="hp-collab-link" href={c.profile} target="_blank" rel="noopener">View profile <AU /></a>
                    : <span className="hp-collab-link is-off">Profile coming soon</span>}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            .hp-collab-intro { max-width: 760px; margin: 0 auto 2.4rem; text-align: center; }
            .hp-collab-h { font-family: 'oswaldbold'; font-size: clamp(1.6rem, 4vw, 2.4rem); letter-spacing: -0.01em; margin: 0.5rem 0 0.6rem; color: #f0f0f0; }
            .hp-collab-p { font-family: 'dmsans'; font-size: 1rem; line-height: 1.7; color: rgba(232,232,232,0.6); margin: 0; }
            .hp-collab-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1080px; margin: 0 auto; }
            .hp-collab-card { display: flex; flex-direction: column; gap: 14px; padding: 22px; border-radius: 18px; background: var(--hp-glass); border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, box-shadow 0.35s ease; }
            .hp-collab-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--hp-indigo) 40%, transparent); box-shadow: 0 24px 54px -30px color-mix(in srgb, var(--hp-blue) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.06); }
            .hp-collab-top { display: flex; align-items: center; gap: 14px; }
            .hp-collab-av { width: 56px; height: 56px; flex-shrink: 0; border-radius: 999px; background-color: #0b0b0f; background-position: center; background-repeat: no-repeat; border: 1px solid var(--hp-line); display: grid; place-items: center; overflow: hidden; }
            .hp-collab-initials { font-family: 'oswaldbold'; font-size: 1.1rem; color: var(--hp-sky); letter-spacing: 0.04em; }
            .hp-collab-meta { min-width: 0; }
            .hp-collab-name { display: block; font-family: 'inter'; font-weight: 700; font-size: 1rem; color: #ededed; }
            .hp-collab-role { display: block; font-family: 'dmsans'; font-size: 0.82rem; color: rgba(232,232,232,0.55); margin-top: 2px; }
            .hp-collab-projects { display: flex; flex-wrap: wrap; gap: 7px; }
            .hp-collab-proj { font-family: 'inter'; font-size: 0.74rem; font-weight: 600; padding: 5px 11px; border-radius: 999px; background: rgba(var(--sa-accent),0.1); border: 1px solid rgba(var(--sa-accent),0.22); color: #f2e8d8; transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease; }
            .hp-collab-proj:hover { background: color-mix(in srgb, var(--hp-blue) 26%, transparent); border-color: color-mix(in srgb, var(--hp-indigo) 50%, transparent); color: #fff; transform: translateY(-1px); }
            .hp-collab-link { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; font-family: 'inter'; font-size: 0.82rem; font-weight: 600; color: var(--hp-sky); transition: gap 0.25s ease, color 0.25s ease; }
            .hp-collab-link svg { width: 14px; height: 14px; }
            .hp-collab-link:hover { gap: 9px; color: #fff; }
            .hp-collab-link.is-off { color: rgba(232,232,232,0.32); cursor: default; }
            @media (max-width: 900px) { .hp-collab-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 560px) { .hp-collab-grid { grid-template-columns: 1fr; } .hp-collab-intro { text-align: left; } }
          `}</style>
        </section>

        {/* ── HOMELAB BAND ── */}
        <section className="hp-band hp-homelab-band" data-reveal>
          <div className="hp-section hp-homelab">
            <div className="hp-homelab-text">
              <span className="hp-eyebrow">Infrastructure</span>
              <h2 className="hp-homelab-h">My homelab.</h2>
              <p className="hp-homelab-p">Three servers at home run my photo library, my files, and the MQTT and TURN servers that Project June and LUMEN use. They run on solar export credits. This site is hosted on Vercel.</p>
              <div className="hp-homelab-stats">
                <div className="hp-homelab-stat"><b>3</b><span>servers</span></div>
                <div className="hp-homelab-stat"><b>24TB</b><span>usable storage</span></div>
                <div className="hp-homelab-stat"><b>38</b><span>self-hosted apps</span></div>
              </div>
              <div className="hp-stack-strip">
                <div className="hp-stack-label">Running right now</div>
                <div className="hp-stack-apps">
                  {['immich','paperless','syncthing','npm','netdata','lychee','openwebui','portainer','crafty'].map((n) => (
                    <img key={n} src={`/images/${n}-icon.webp`} alt={n} title={n} />
                  ))}
                  <span className="hp-stack-more">and more</span>
                </div>
              </div>
              <button className="hp-btn" onClick={() => { window.location.href = '/homelab'; }} style={{ marginTop: '1.8rem' }}>
                Explore the HomeLab <AC />
              </button>
            </div>
            <div className="hp-homelab-media">
              <img src="/images/dither2.webp" alt="Chiambucket homelab server rack" />
              <div className="hp-homelab-glow"><img src="/images/godray.webp" alt="" /></div>
            </div>
          </div>
        </section>

        {/* ── PHOTOGRAPHY ── */}
        <section className="hp-band hp-photo-band">
          <div className="hp-section">
            <div className="section-editorial-header" data-reveal>
              <span className="seh-number">03</span>
              <div className="seh-content"><span className="seh-eyebrow">Gallery</span><span className="seh-title">Photography</span></div>
            </div>
            <div className="hp-albums" data-reveal role="tablist" aria-label="Photo albums">
              {[['highlight','Highlights'],['europe','Europe'],['china','China'],['zealand','New Zealand'],['by219','21:9'],['general','General']].map(([key, label], i) => (
                <button key={key} className={`hp-album-link${i === 0 ? ' is-active' : ''}`} role="tab" aria-selected={i === 0}
                  onClick={(e) => (window as any).switchGallery?.(key, e.currentTarget)}>
                  {label}
                </button>
              ))}
              <a className="hp-album-all" href="/photography">All albums <AU /></a>
            </div>
          </div>
          <div className="photography-box photo-main-ver" id="photolink">
            <div className="expand" id="expand">
              <button onClick={() => (window as any).expandphoto?.()}>Click to Expand</button>
            </div>
            <div className="phototop">
              <h1 id="hp-gallery-title">Highlights</h1>
              <a href="/photography" aria-label="Open full gallery"><img src="/images/arrow.webp" alt="" /></a>
            </div>
            <div className="hp-gallery-stage" id="hp-gallery-stage"></div>
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className="hp-cta" data-reveal>
          <span className="hp-eyebrow">Get in touch</span>
          <h2>Email me at <a href="mailto:braven@chiambucket.com"><em>braven@chiambucket.com</em></a></h2>
          <div className="hp-cta-row">
            <button className="hp-btn" onClick={() => { window.location.href = '/contact'; }}>Contact me <AC /></button>
            <a className="hp-btn hp-btn-ghost" href="#portfolio-items-holder">Browse projects</a>
          </div>
        </section>
      </main>

      {/* Project detail modal */}
      <div className={`hp-modal${modalAnimOpen ? ' is-open' : ''}`} id="hp-modal" hidden={!modalOpen}>
        <div className="hp-modal-backdrop" onClick={closeProject}></div>
        <div className="hp-modal-panel" role="dialog" aria-modal={true} aria-label="Project details">
          <button className="hp-modal-close" onClick={closeProject} aria-label="Close details">&times;</button>
          <div className="hp-modal-content" id="hp-modal-content">
            {activeProject && <PeekFeed key={activeProject} startId={activeProject} />}
          </div>
        </div>
      </div>

      <InfoModal item={openCap} onClose={() => setOpenCap(null)} />
      <InfoModal item={openTile} onClose={() => setOpenTile(null)} />

      {/* Scoped styles: Design Tools 3D coverflow carousel */}
      <style>{`
        .hp-tcar { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin: 0.2rem 0; }
        .hp-tcar-stage {
          position: relative;
          width: 100%;
          height: 132px;
          display: grid;
          place-items: center;
          perspective: 900px;
          perspective-origin: 50% 45%;
        }
        .hp-tcar-ring {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(7deg) rotate(-3deg);
          display: grid;
          place-items: center;
        }
        .hp-tcar-chip {
          position: absolute;
          width: 60px; height: 60px;
          display: grid; place-items: center;
          box-sizing: border-box;
          border-radius: 15px;
          background: linear-gradient(158deg, rgba(255,255,255,0.085), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 18px -10px rgba(0,0,0,0.75);
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.5s ease, box-shadow 0.5s ease;
          will-change: transform, opacity;
        }
        .hp-tcar-chip img { width: 30px; height: 30px; object-fit: contain; display: block; }
        .hp-tcar-chip.is-active {
          border-color: color-mix(in srgb, var(--hp-indigo) 55%, transparent);
          background: linear-gradient(158deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 16px 34px -12px color-mix(in srgb, var(--hp-blue) 65%, transparent);
        }
        .hp-tcar-label {
          font-family: 'inter';
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--hp-sky);
          opacity: 0.85;
          transition: opacity 0.4s ease;
        }
        /* Static fallback for prefers-reduced-motion: a fanned, tilted arrangement, no auto-advance */
        .hp-tcar-static .hp-tcar-stage { perspective: none; }
        .hp-tcar-static .hp-tcar-chip {
          width: 52px; height: 52px;
          transition: none;
        }
        .hp-tcar-static .hp-tcar-chip img { width: 26px; height: 26px; }
        .hp-tcar-static .hp-tcar-chip.is-active {
          border-color: color-mix(in srgb, var(--hp-indigo) 50%, transparent);
        }

        @media (max-width: 1000px) {
          .hp-tcar-stage { height: 116px; }
          .hp-tcar-chip { width: 54px; height: 54px; }
          .hp-tcar-chip img { width: 27px; height: 27px; }
        }
        @media (max-width: 480px) {
          .hp-tcar-stage { height: 104px; perspective: 700px; }
          .hp-tcar-chip { width: 48px; height: 48px; border-radius: 13px; }
          .hp-tcar-chip img { width: 24px; height: 24px; }
          .hp-tcar-label { font-size: 0.6rem; letter-spacing: 0.13em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-tcar-chip { transition: none; }
        }
      `}</style>
    </>
  );
}
