'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import InfoModal, { type InfoItem } from '../components/InfoModal';
import LazyVideo from '../components/LazyVideo';
import { PeekFeed } from '../components/ProjectPeek';

/* Capability cards (Projects section) → detail pop-ups. Content drawn from the real builds. */
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

/* About-bento tiles → detail pop-ups (intro / engineering / microcontrollers / powerpoint). */
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

  /* ── HUD terminal clock (Singapore time) ── */
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-hud-clock]');
    if (!el) return;
    const tick = () => {
      const t = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
      el.textContent = `${t} SGT`;
    };
    tick();
    const id = setInterval(tick, 1000);
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
          html.sensory-active .hp-hero-kicker { font-family: var(--font-ddt); letter-spacing: 0.3em; text-transform: uppercase; font-size: 0.6rem; color: rgba(200,214,255,0.55); }
          html.sensory-active .hp-hero-kicker::before { content: '[ '; color: rgba(var(--sa-accent),0.6); }
          html.sensory-active .hp-hero-kicker::after { content: ' ]'; color: rgba(var(--sa-accent),0.6); }
          html.sensory-active .hp-hero-sub { color: rgba(222,229,248,0.68); }
          /* brutalist terminal headline: condensed caps riding the light plume */
          html.sensory-active .hp-hero-title { text-transform: uppercase; letter-spacing: 0.015em; }
          /* the rolling accent word catches the light source */
          html.sensory-active .hp-hero-title em { text-shadow: 0 0 34px rgba(var(--sa-accent),0.35); }
          /* "New" topper pill → terminal status chip */
          html.sensory-active .hero-topper {
            background: rgba(9,12,20,0.55) !important; border: 1px solid rgba(var(--sa-accent),0.28) !important;
            -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
          html.sensory-active .hero-topper-content {
            font-family: var(--font-ddt) !important; text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.66rem !important; }
          html.sensory-active .hero-topper-new-tag {
            font-family: var(--font-ddt) !important; text-transform: uppercase; letter-spacing: 0.1em;
            background: rgba(var(--sa-ember),0.16) !important; color: rgba(var(--sa-ember),0.95) !important;
            border: 1px solid rgba(var(--sa-ember),0.4) !important; }
          html.sensory-active .hp-scroll { font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.24em; font-size: 0.56rem; color: rgba(180,198,238,0.5); }

          /* ── Cards: homepage-only detail on top of the global panel language ── */
          html.sensory-active .hp-disc::after { opacity: 0.7; }
          html.sensory-active .hp-cap-card h4 { color: #a6bcff; }
          html.sensory-active .hp-disc-num { font-family: var(--font-ddt); }
          html.sensory-active .hp-disc { padding: 30px 26px 24px !important; }
          html.sensory-active .hp-cap-card { padding: 24px 22px 22px !important; }

          /* Spotlight + homelab stat readouts */
          html.sensory-active .hp-spot-stat b { color: #cfdcff; }
          html.sensory-active .hp-spot-stat span, html.sensory-active .hp-homelab-stat span {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.13em; font-size: 0.56rem; color: rgba(180,198,238,0.52); }
          html.sensory-active .hp-spot-tags span {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.62rem; }

          /* Toolbar + album tabs → instrument controls */
          html.sensory-active .hp-pf-search-wrap, html.sensory-active .hp-pf-filter, html.sensory-active .hp-album-link {
            background: rgba(var(--sa-accent),0.05) !important; border: 1px solid rgba(176,196,252,0.16) !important; }
          html.sensory-active .hp-pf-filter.is-active, html.sensory-active .hp-album-link.is-active {
            background: rgba(var(--sa-accent),0.16) !important; border-color: rgba(var(--sa-accent),0.42) !important; color: #eaf0ff !important; }

          /* Experience + stack labels → mono spec readouts */
          html.sensory-active .hp-exp-chip span, html.sensory-active .hp-stack-label {
            font-family: var(--font-ddt); text-transform: uppercase; letter-spacing: 0.11em; font-size: 0.55rem; color: rgba(180,198,238,0.52); }

          /* Gallery + projects bottom fades → a strong dissolve into the atmosphere navy (never pure black) */
          html.sensory-active .photo-main-ver .expand {
            background: linear-gradient(180deg, rgba(5,7,14,0) 0%, rgba(5,7,14,0.55) 55%, rgba(5,7,14,0.97) 100%) !important; }
          html.sensory-active .hp-pf-showmore-wrap::before {
            background: linear-gradient(to bottom, rgba(5,7,14,0) 0%, rgba(5,7,14,0.8) 62%, rgba(5,7,14,0.97) 100%) !important; }

          /* The flagship spotlight badge stays the premium gold crown (see .hp-spot-badge). */
        `}</style>

        {/* ── HERO ── */}
        <header className="hp-hero">
          <div className="sa-hud" aria-hidden="true">
            <div className="sa-hud-tl">
              <span>SYSTEM.ID // CHIAMBUCKET.001</span>
              <span>LOCAL_ENCODING · UTF-8</span>
              <span>SIGNAL_STRENGTH · 98%</span>
            </div>
            <div className="sa-hud-tr">
              <span className="sa-hud-em" data-hud-clock>--:--:-- SGT</span>
              <span>LAT 1.3521 N</span>
              <span>LONG 103.8198 E</span>
            </div>
            <div className="sa-hud-bl">
              <span>[ ENGINEER ]</span>
              <span>[ DESIGNER ]</span>
              <span>[ PHOTOGRAPHER ]</span>
            </div>
            <div className="sa-hud-br">
              <span>RENDER // WEBGL.FBM</span>
              <span>MODE · DARK_SENSORY</span>
            </div>
          </div>
          <div className="hp-hero-aura"></div>
          <div className="hp-hero-grid"></div>
          <a className="hero-topper" href="/beadreader">
            <div className="hero-topper-new-tag">New</div>
            <div className="hero-topper-content">BeadReader</div>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="hero-topper-arrow"><path fill="#E8E8E8" d="M338.752 104.704a64 64 0 000 90.496l316.8 316.8-316.8 316.8a64 64 0 0090.496 90.496l362.048-362.048a64 64 0 000-90.496L429.248 104.704a64 64 0 00-90.496 0z"/></svg>
          </a>
          <div className="hp-hero-kicker">Braven Chiam · Singapore</div>
          <h1 className="hp-hero-title hero-headline-text">
            Creating with <span className="hp-roll" data-words="Intention.,Purpose.,Meaning.,Intent.,Vision." aria-label="Intention"><em>Intention.</em></span>
          </h1>
          <p className="hp-hero-sub">I&apos;m an engineer who designs. I build hardware and software with a design-first mindset, from 5G rovers and custom PCBs to a solar-powered homelab and photography.</p>
          <div className="hp-hero-cta">
            <a className="hp-btn" href="#portfolio-items-holder">Explore my work <AC /></a>
            <button className="button-hero" onClick={() => { window.location.href = '/comingsoon'; }}>
              <div className="dots_border"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle"><use href="#icon-sparkle-btn"/></svg>
              <span className="text_button">To BucketCentral</span>
            </button>
          </div>
          <div className="hp-scroll"><span className="hp-mouse"><span></span></span>Scroll</div>
        </header>

        {/* ── DISCIPLINES ── */}
        <section className="hp-band">
          <div className="hp-section">
            <div className="hp-band-intro" data-reveal>
              <span className="hp-eyebrow">What I do</span>
              <h2>One person, four disciplines, built to work together.</h2>
              <p>Everything I make sits at the intersection of engineering and design. Here&apos;s the full picture, without the page-hopping.</p>
            </div>
            <div className="hp-disciplines">
              <a className="hp-disc" href="#portfolio-items-holder" data-reveal data-delay="1"><span className="hp-disc-num">01</span><span className="hp-disc-title">Engineering</span><span className="hp-disc-desc">Microcontrollers, custom PCBs and 3D CAD. Hardware and software, mostly self-taught.</span><span className="hp-disc-link">See projects <CR /></span></a>
              <a className="hp-disc" href="/photography" data-reveal data-delay="2"><span className="hp-disc-num">02</span><span className="hp-disc-title">Design</span><span className="hp-disc-desc">Design-first thinking across interfaces, posters, slides and motion. Clear and intentional.</span><span className="hp-disc-link">View design &amp; photos <CR /></span></a>
              <a className="hp-disc" href="#photolink" data-reveal data-delay="3"><span className="hp-disc-num">03</span><span className="hp-disc-title">Photography</span><span className="hp-disc-desc">Finding inspiration through perspective and detail, then bringing it back to the work.</span><span className="hp-disc-link">Browse gallery <CR /></span></a>
              <a className="hp-disc" href="/homelab" data-reveal data-delay="4"><span className="hp-disc-num">04</span><span className="hp-disc-title">HomeLab</span><span className="hp-disc-desc">Self-hosted, solar-powered servers running every Chiambucket service, including this site.</span><span className="hp-disc-link">Explore setup <CR /></span></a>
            </div>
          </div>
        </section>

        {/* ── ABOUT BENTO ── */}
        <section className="abm-bg hp-band" id="about">
          <div className="hp-section">
            <div className="section-editorial-header" data-reveal>
              <span className="seh-number">01</span>
              <div className="seh-content"><span className="seh-eyebrow">About</span><span className="seh-title">An engineer who designs</span></div>
            </div>
            <div className="hp-bento">
              {/* Intro */}
              <div className="hp-tile hp-tile-intro hp-clickable" data-reveal role="button" tabIndex={0} onClick={() => setOpenTile(TILE_INTRO)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_INTRO); } }}>
                <span className="hp-tile-go"><AU /></span>
                <img className="hp-wave" src="/images/wave.webp" alt="Waving hand" />
                <a className="hp-blink" id="sukuna-blink" href="https://www.pinterest.com/pin/665547651180427494/" onClick={(e) => e.stopPropagation()} aria-label="A little friend"></a>
                <h3 className="hp-tile-h">Hi, I&apos;m Braven.<br />An engineer who designs.</h3>
                <p className="hp-tile-p">Grounded in function, guided by human experience, and driven to make things that feel like art.</p>
              </div>
              {/* Engineering */}
              <div className="hp-tile hp-tile-eng hp-clickable" data-reveal data-delay="1" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_ENGINEERING)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_ENGINEERING); } }}>
                <span className="hp-tile-go"><AU /></span>
                <div className="hp-tile-media"><img src="/images/abm-engineering.webp" alt="" /></div>
                <span className="hp-key">Engineering</span>
                <h3 className="hp-tile-h">A design-first<br />engineering approach.</h3>
                <p className="hp-tile-p">I believe every engineer should be a designer, grounded in function, guided by experience.</p>
              </div>
              {/* Microcontrollers */}
              <div className="hp-tile hp-tile-micro hp-clickable" data-reveal data-delay="2" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_MICRO)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_MICRO); } }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Microcontrollers</span>
                <div className="hp-iconrow">
                  <img src="/images/microchip-icon.webp" alt="Microchip" /><img src="/images/esp-icon.webp" alt="ESP32" /><img src="/images/PlatformIO-icon.webp" alt="PlatformIO" /><img src="/images/arduino-icon.webp" alt="Arduino" />
                </div>
                <h3 className="hp-tile-h">Powerful hardware meets powerful software.</h3>
              </div>
              {/* DaVinci */}
              <div className="hp-tile hp-media-tile hp-tile-davinci hp-clickable" data-reveal role="link" tabIndex={0} onClick={() => window.open('https://www.youtube.com/@newkringster2564', '_blank')} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <LazyVideo webm="/images/Davinci-showcase.webm" mp4="/images/Davinci-showcase.mp4" poster="/images/Davinci-showcase-poster.webp" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">DaVinci Resolve</span><h3 className="hp-tile-h">Clear, creative, experimental.</h3><p className="hp-tile-p">Videos that add meaning and communicate a project&apos;s vision.</p></div>
              </div>
              {/* Figma */}
              <div className="hp-tile hp-tile-figma hp-clickable" data-reveal data-delay="1" role="link" tabIndex={0} onClick={() => { window.location.href = '/photography'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Figma</span>
                <div className="hp-figma-stack"><img className="back" src="/images/ELECF.webp" alt="" /><img className="mid" src="/images/Dashboard.webp" alt="" /><img className="front" src="/images/Cdyspstart.webp" alt="" /></div>
                <div><h3 className="hp-tile-h">Clean, functional.</h3><p className="hp-tile-p">Posters and interfaces that communicate instantly, without friction.</p></div>
              </div>
              {/* Design Tools */}
              <div className="hp-tile hp-tile-tools hp-clickable" data-reveal data-delay="2" role="link" tabIndex={0} onClick={() => { window.location.href = '#capabilities'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Design Tools</span>
                <ToolCarousel />
                <p className="hp-tile-p">A toolkit I reach for daily, from raster and vector to 3D and motion.</p>
              </div>
              {/* Photography */}
              <div className="hp-tile hp-media-tile hp-tile-photo hp-clickable" data-reveal role="link" tabIndex={0} onClick={() => { window.location.href = '#photolink'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <img src="/images/abm-lr.webp" alt="Photography" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">Photography</span><h3 className="hp-tile-h">Through a different lens.</h3><p className="hp-tile-p">Photography sharpens my perspective, attention to detail, and approach to design.</p></div>
              </div>
              {/* PowerPoint */}
              <div className="hp-tile hp-tile-ppt hp-clickable" data-reveal data-delay="1" role="button" tabIndex={0} onClick={() => setOpenTile(TILE_PPT)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(TILE_PPT); } }}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">PowerPoint</span>
                <div className="hp-ppt-media"><LazyVideo webm="/images/CPB1v4.webm" mp4="/images/CPB1v4.mp4" poster="/images/CPB1v4-poster.webp" /></div>
                <h3 className="hp-tile-h" style={{ fontSize: '1.25rem' }}>Fun, engaging, never overwhelming.</h3>
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
                <p className="peh-description">Builds spanning engineering, design and homelab infrastructure. Read a chaptered summary on any card, or open the full article.</p>
              </div>
            </div>

            {/* Flagship spotlight */}
            <article className="hp-spotlight" data-reveal>
              <div className="hp-spot-media">
                <img src="/images/ProjJuneBanner1.webp" alt="Project June, a 5G radio-controlled vehicle" loading="lazy" />
                <span className="hp-spot-badge"><CRWN /> Flagship Hardware Build</span>
              </div>
              <div className="hp-spot-body">
                <span className="hp-key">Project June · Personal</span>
                <h3 className="hp-spot-title">A 5G rover that streams, senses and steers.</h3>
                <p className="hp-spot-lead">My most ambitious build: a radio-controlled vehicle with three live video streams over 5G, full telemetry, and a complete sensor suite, designed enclosure to firmware in three weeks.</p>
                <div className="hp-spot-stats">
                  <div className="hp-spot-stat"><b>3</b><span>live video streams</span></div>
                  <div className="hp-spot-stat"><b>5G</b><span>cellular link</span></div>
                  <div className="hp-spot-stat"><b>8+</b><span>onboard sensors</span></div>
                  <div className="hp-spot-stat"><b>3 wks</b><span>concept to drive</span></div>
                </div>
                <div className="hp-spot-tags"><span>ESP32</span><span>WebRTC</span><span>MQTT</span><span>KiCAD</span><span>Onshape</span><span>PlatformIO</span></div>
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
                <span className="hp-spot-badge"><CRWN /> Flagship Software Build</span>
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
                <h3 className="hp-cap-h">Every build leaves behind a skill.</h3>
                <p className="hp-cap-p">The toolkit below is the sum of these projects, mostly self-taught, one problem at a time.</p>
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
              <h3>All projects</h3><span>Search, filter, and tap any card for a chaptered summary.</span>
            </div>
            <div className="hp-pf-toolbar" data-reveal>
              <label className="hp-pf-search-wrap">
                <SR />
                <input id="hp-pf-search" className="hp-pf-search" type="search" placeholder="Search projects, tools, tech…"
                  onInput={() => { setProjectsExpanded(true); (window as any).filterProjects?.(); }} aria-label="Search projects" />
              </label>
              <div className="hp-pf-filters" role="group" aria-label="Filter projects">
                {[['all','All'],['flagship','Flagship'],['highlight','Highlights'],['personal','Personal'],['school','School']].map(([f, label], i) => (
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
                  <span className="hp-pf-type personal">Personal</span><span className="hp-pf-crown"><CRWN />Flagship</span>
                  <img src="/images/ProjJuneBanner1.webp" alt="Project June rover" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Project June</h3>
                  <p className="hp-pf-blurb">A 5G radio-controlled vehicle with 3 live video streams, GPS, a laser system, gyroscope and more. My most ambitious build.</p>
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
                  <span className="hp-pf-type personal">Personal</span><span className="hp-pf-crown"><CRWN />Flagship</span>
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
                  <span className="hp-pf-type personal">Personal</span><span className="hp-pf-star"><ST />Highlight</span>
                  <img src="/images/borlocator-pf-context.webp" alt="LoRA Messenger" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">LoRA Messenger</h3>
                  <p className="hp-pf-blurb">An ESP32 messenger with 2-way voice over ESP-NOW and text over LoRa. Custom PCB in KiCAD, case in Onshape, all self-taught.</p>
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
                  <span className="hp-pf-type school">School</span><span className="hp-pf-star"><ST />Highlight</span>
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
                  <p className="hp-pf-blurb">A multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live dashboard and a 3D Spline view.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/vscode-icon.webp" alt="" /><img src="/images/figma-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /><img src="/images/onshape-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/csdp'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* Pandus */}
              <article id="proj-pandus" className="hp-pf-card" data-article="/pandus" data-type="school" data-search="pandus dispenser arduino uno pyfirmata 3d printed servo pump water school first">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/pandusarticle.webp" alt="Pandus Dispenser" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">Pandus Dispenser</h3>
                  <p className="hp-pf-blurb">My first school project: a 6-part 3D-printed water dispenser powered by an Arduino Uno and driven with PyFirmata.</p>
                  <div className="hp-pf-foot">
                    <div className="icon-stack"><img src="/images/onshape-icon.webp" alt="" /><img src="/images/vscode-icon.webp" alt="" /><img src="/images/resolve-icon.webp" alt="" /><img src="/images/powerpoint-icon.webp" alt="" /></div>
                    <button className="hp-pf-view" onClick={() => { window.location.href = '/pandus'; }}>Read article <AU /></button>
                  </div>
                </div>
              </article>

              {/* ELEC-F */}
              <article id="proj-elecf" className="hp-pf-card" data-article="/comingsoon" data-type="school" data-search="elec-f elecf concept m5-stack m5stack freezer safety sensors engineering course school">
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={peek} aria-label="Peek at a quick summary"><span className="hp-pf-peek-pill"><SR />Peek summary</span></button>
                  <span className="hp-pf-type school">School</span>
                  <img src="/images/elef2-pf-context.webp" alt="ELEC-F Concept" loading="lazy" />
                </div>
                <div className="hp-pf-info">
                  <h3 className="hp-pf-name">ELEC-F Concept</h3>
                  <p className="hp-pf-blurb">A freezer safety system on M5Stack. ToF and PIR sensors catch a worker trapped in a walk-in freezer, then a timer and alarm raise help.</p>
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
                  <p className="hp-pf-blurb">A conceptual product designed and presented for a communication-skills project, with 3D scenes built in Blender.</p>
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
                  <p className="hp-pf-blurb">My ultralight 20g take on the ZeroMouse, built to play a little better in FPS games.</p>
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
                  <p className="hp-pf-blurb">A Paper server running Dynmap, a live and interactive map for the multiplayer world.</p>
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
            .hp-collab-proj { font-family: 'inter'; font-size: 0.74rem; font-weight: 600; padding: 5px 11px; border-radius: 999px; background: rgba(127,168,255,0.1); border: 1px solid rgba(127,168,255,0.22); color: #cdd9ff; transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease; }
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
              <h2 className="hp-homelab-h">Servers that turn clean energy into experiences.</h2>
              <p className="hp-homelab-p">My homelab runs a stack of self-hosted services on solar export credits, with Ubiquiti networking and open-source Docker apps behind it. Lately I&apos;m leaning more toward cloud hosting too, so this site itself now lives on Vercel.</p>
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
              <div className="seh-content"><span className="seh-eyebrow">Gallery</span><span className="seh-title">Photography, Highlights</span></div>
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
          <h2>Let&apos;s make something with <span className="hp-roll" data-words="intention.,purpose.,meaning.,care.,soul." aria-label="intention"><em>intention.</em></span></h2>
          <div className="hp-cta-row">
            <button className="hp-btn" onClick={() => { window.location.href = '/contact'; }}>Contact me <AC /></button>
            <button className="hp-btn hp-btn-ghost" onClick={() => { window.location.href = '/comingsoon'; }}>Explore BucketCentral</button>
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
