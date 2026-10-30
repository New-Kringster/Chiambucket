'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import InfoModal, { type InfoItem } from '../components/InfoModal';
import LazyVideo from '../components/LazyVideo';
import { PeekFeed } from '../components/ProjectPeek';
import { SunlitField } from '../components/SunlitScene';
import { IcRead, IcPeek, IcPlay, IcGitHub, IcMail, IcGrid, IcServer, IcMore, IcExpand } from '../components/Icons';
import PosterHero from './PosterHero';
import './about.css';

/* About bento tiles → detail pop-ups. Each skill tile lists where it was used;
   every fact comes from a project write-up on this site. */
const TILE_INTRO: InfoItem = {
  eyebrow: 'Hello',
  title: "Hi, I'm Braven",
  blurb: "I'm a third-year Electronic and Computer Engineering student at Nanyang Polytechnic in Singapore. I started by taking apart a broken radio to see how it worked. Now I build rovers, circuit boards, web apps and the homelab they run on.",
  add: "Most projects need hardware, software and design, and I like doing all three myself.",
  links: [
    { label: 'Get in touch', url: '/contact' },
    { label: 'Sukuna art credit', url: 'https://www.pinterest.com/pin/665547651180427494/' },
  ],
};

const SKILL_HARDWARE: InfoItem = {
  eyebrow: 'Hardware',
  title: 'Circuit boards',
  blurb: 'I draw the schematic and lay out the board in KiCAD, then solder the parts myself, including SMD parts reflowed at home.',
  points: ['The LoRA Messenger board, my first PCB', 'A from-scratch recreation of my school’s ATmega328 dev board', 'Motor drivers, battery packs and sensor wiring for Project June'],
  chips: ['KiCAD', 'EAGLE', 'SMD reflow', 'Schematic capture'],
  links: [{ label: 'LoRA Messenger', url: '/brolocator' }],
};

const SKILL_FIRMWARE: InfoItem = {
  eyebrow: 'Firmware',
  title: 'Microcontrollers I build with',
  blurb: 'Most of my builds run on a microcontroller. I write the firmware in C and C++ with PlatformIO, or MicroPython when it suits, and pick the board to suit the project.',
  points: [
    'ESP32, my default for anything wireless, with WiFi, ESP-NOW and plenty of headroom',
    'Arduino Uno and the ATmega328 for simpler, well-supported builds',
    'M5Stack Fire when I need a screen, buttons and modules in a hurry',
    'BeagleBone Black as a Linux brain coordinating a larger system',
  ],
  chips: ['ESP32', 'Arduino', 'ATmega328', 'M5Stack', 'BeagleBone', 'PlatformIO', 'C / C++', 'MicroPython'],
  links: [
    { label: 'Project June (ESP32-S3)', url: '/project-june' },
    { label: 'LUMEN (MicroPython)', url: '/lumen' },
    { label: 'ELEC-F (M5Stack)', url: '/elecf' },
  ],
};

const SKILL_SOFTWARE: InfoItem = {
  eyebrow: 'Software',
  title: 'Web apps and servers',
  blurb: 'The software side of my projects: web apps in Next.js and TypeScript, and small Python servers in Docker.',
  points: [
    'BeadReader, a private book reader on Next.js, Supabase Postgres and Cloudflare R2, with its access rules enforced in SQL',
    'LUMEN, a FastAPI server in Docker that turns speech into room commands with Whisper and DeepSeek',
    'Project June, three live WebRTC video streams through my own TURN server',
    'This site, built in Next.js and hosted on Vercel',
  ],
  chips: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Docker'],
  links: [{ label: 'BeadReader', url: '/beadreader' }, { label: 'LUMEN', url: '/lumen' }],
};

const SKILL_WIRELESS: InfoItem = {
  eyebrow: 'Wireless',
  title: 'Radios and live links',
  blurb: 'LoRa for range, ESP-NOW for quick local links, MQTT for telemetry and WebRTC for live video over cellular.',
  points: ['Three live WebRTC camera streams over 5G on Project June', 'Long-range text on LoRa and two-way voice on ESP-NOW', 'MQTT telemetry brokered through my homelab'],
  chips: ['LoRa', 'ESP-NOW', 'MQTT', 'WebRTC', 'SocketIO', '5G'],
};

const SKILL_INFRA: InfoItem = {
  eyebrow: 'Infrastructure',
  title: 'A homelab of my own',
  blurb: 'A self-hosted homelab on Unraid, Proxmox and Docker, behind Nginx and a segmented UniFi network.',
  points: ['Self-hosted services behind Nginx Proxy Manager and CrowdSec', 'A WireGuard and Tailscale mesh to reach home from anywhere', 'coturn and MQTT that back real hardware projects'],
  chips: ['Unraid', 'Proxmox', 'Docker', 'Nginx', 'Tailscale', 'WireGuard', 'UniFi'],
  link: { label: 'Explore the HomeLab', url: '/homelab' },
};

const SKILL_CAD: InfoItem = {
  eyebrow: '3D and CAD',
  title: 'Enclosures that fit',
  blurb: 'I model enclosures and parts in Onshape, render in Blender, and 3D print until the fit is right.',
  points: ['The LoRA Messenger’s handheld case', 'The six-part Pandus dispenser body, which fit on the first print', 'Concept renders for pitches and posters'],
  chips: ['Onshape', 'Blender', '3D printing', 'Enclosure design'],
};

const SKILL_DESIGN: InfoItem = {
  eyebrow: 'Design',
  title: 'Interfaces, posters and film',
  blurb: 'Interfaces in Figma and Spline, posters in Photoshop, and a video for each build cut in DaVinci Resolve.',
  points: ['The Project June operator console and the EMA smart-home dashboard', 'The ELEC-F project poster', 'Project films cut and graded in DaVinci Resolve'],
  chips: ['Figma', 'Spline', 'Photoshop', 'DaVinci Resolve', 'Premiere Pro'],
  media: '/images/Cdyspstart.webp',
  links: [{ label: 'EMA smart-home UI', url: '/csdp' }],
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
const AU = () => <svg aria-hidden="true"><use href="#icon-arrow-ur" /></svg>;
const SR = () => <svg aria-hidden="true"><use href="#icon-search" /></svg>;

export default function HomeClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnimOpen, setModalAnimOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [projectsExpanded, setProjectsExpanded] = useState(false); // mobile-only collapse
  const [openTile, setOpenTile] = useState<InfoItem | null>(null); // about-bento tile detail modal

  /* ── Modal ── */
  // Takes a project id, not a card: the two spotlit projects have no card in the gallery.
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

  /* ── Escape key close ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalOpen) closeProject(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [modalOpen]);

  /* ── Blink easter egg ── */
  useEffect(() => {
    const el = document.getElementById('sukuna-blink');
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id);
      if (e.isIntersecting) id = setInterval(() => { el.classList.add('abm-top1-blink'); setTimeout(() => el.classList.remove('abm-top1-blink'), 50); }, 4000);
    });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(id); };
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
  const peek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.closest('.hp-pf-card')?.id;
    if (id) openProject(id);
  };

  /* Skill tiles and the layers inside the grouped tiles open a detail pop-up. */
  const opens = (item: InfoItem) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick: () => setOpenTile(item),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTile(item); }
    },
  });

  return (
    <>
      <Script src="https://photos.chiambucket.com/embed/lychee-embed.js?v=1.0.0" strategy="afterInteractive" onLoad={initLychee} />

      {/* SVG symbol definitions */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="icon-arrow-circle" viewBox="0 0 24 24" fill="none"><path fill="currentColor" clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"/></symbol>
        <symbol id="icon-chevron-right" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></symbol>
        <symbol id="icon-arrow-ur" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15"/></symbol>
        <symbol id="icon-search" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20.5 20.5l-4-4"/></symbol>
        <symbol id="icon-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.05 6.6.78-4.87 4.5 1.28 6.52L12 17.9 6.09 20.85l1.28-6.52L2.5 9.33l6.6-.78z"/></symbol>
      </svg>

      {/* The painted scene and the page-agnostic styles are global: SceneShell
          mounts the scene in app/layout.tsx, and the day glass lives in
          app/sunlit.css. Only homepage-specific retuning stays here. */}
      <main>

        {/* ═══════ DARK SENSORY, homepage-specific retuning ═══════ */}
        <style>{`
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

        {/* ── HERO: a typographic poster over the field ── */}
        <PosterHero />

        {/* ── ABOUT: who I am and what I can build. It rises out of the grass
             (SunlitScene blurs each .sl-emerge block into focus as it clears
             the crest; the field is drawn in front of this one section). ── */}
        <section className="abm-bg hp-band" id="about">
          <div className="hp-section">
            <div className="section-editorial-header sl-emerge">
              <div className="seh-content"><span className="seh-eyebrow">About</span><span className="seh-title">What I do</span></div>
            </div>
            <div className="hp-bento ab-bento">
              {/* Intro */}
              <div className="hp-tile hp-tile-intro hp-clickable sl-emerge" {...opens(TILE_INTRO)}>
                <span className="hp-tile-go"><AU /></span>
                <a className="hp-blink" id="sukuna-blink" href="https://www.pinterest.com/pin/665547651180427494/" onClick={(e) => e.stopPropagation()} aria-label="A little friend"></a>
                <span className="hp-key ab-intro-key">About</span>
                <dl className="hp-facts">
                  <div><dt>Studying</dt><dd>Electronic and Computer Engineering, year 3</dd></div>
                  <div><dt>At</dt><dd>Nanyang Polytechnic, Singapore</dd></div>
                  <div><dt>Builds</dt><dd>Hardware, software and design, end to end</dd></div>
                </dl>
                <div className="ab-intro-copy">
                  <h3 className="hp-tile-h">Hi, I&apos;m Braven.</h3>
                  <p className="hp-tile-p">I design circuit boards, write the software that runs on them, and model the cases they go in. Most of it I taught myself through these projects.</p>
                </div>
              </div>

              {/* One system, every layer: firmware, board, software, servers */}
              <div className="hp-tile ab-group ab-stack sl-emerge">
                <div className="ab-head">
                  <span className="hp-key">End to end</span>
                  <h3 className="hp-tile-h">From the chip to the cloud.</h3>
                  <p className="hp-tile-p">I can build a whole system myself, from the microcontroller and its firmware to the servers it reports to.</p>
                </div>
                <ol className="ab-chain">
                  <li className="ab-layer hp-clickable" {...opens(SKILL_FIRMWARE)}>
                    <span className="hp-tile-go"><AU /></span>
                    <div className="ab-media hp-iconrow">
                      <img src="/images/esp-icon.webp" alt="ESP32" /><img src="/images/arduino-icon.webp" alt="Arduino" /><img src="/images/microchip-icon.webp" alt="Microchip ATmega328" /><img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
                    </div>
                    <div className="ab-layer-text">
                      <span className="hp-key">Firmware</span>
                      <h4 className="hp-tile-h">The microcontroller.</h4>
                      <p className="hp-tile-p">ESP32, Arduino and the ATmega328, programmed in C, C++ and MicroPython.</p>
                    </div>
                  </li>
                  <li className="ab-layer hp-clickable" {...opens(SKILL_HARDWARE)}>
                    <span className="hp-tile-go"><AU /></span>
                    <div className="ab-media"><img className="ab-photo" src="/images/Brolocator13.webp" alt="The LoRA Messenger circuit board, lit up in my hand" loading="lazy" /></div>
                    <div className="ab-layer-text">
                      <span className="hp-key">Hardware</span>
                      <h4 className="hp-tile-h">The circuit board.</h4>
                      <p className="hp-tile-p">Schematics and layouts in KiCAD, then SMD parts reflowed and soldered at home.</p>
                    </div>
                  </li>
                  <li className="ab-layer hp-clickable" {...opens(SKILL_SOFTWARE)}>
                    <span className="hp-tile-go"><AU /></span>
                    <div className="ab-media hp-iconrow hp-iconrow-sm">
                      <img src="/images/nextjs-icon.webp" alt="Next.js" /><img src="/images/typescript-icon.webp" alt="TypeScript" /><img src="/images/supabase-icon.webp" alt="Supabase" /><img src="/images/python-icon.webp" alt="Python" /><img src="/images/docker-icon.webp" alt="Docker" />
                    </div>
                    <div className="ab-layer-text">
                      <span className="hp-key">Software</span>
                      <h4 className="hp-tile-h">The software.</h4>
                      <p className="hp-tile-p">Web apps in Next.js and Supabase like BeadReader, and Python servers like the one behind LUMEN.</p>
                    </div>
                  </li>
                  <li className="ab-layer hp-clickable" {...opens(SKILL_INFRA)}>
                    <span className="hp-tile-go"><AU /></span>
                    <div className="ab-media"><img className="ab-device" src="/images/abm-udm.webp" alt="" loading="lazy" /></div>
                    <div className="ab-layer-text">
                      <span className="hp-key">Infrastructure</span>
                      <h4 className="hp-tile-h">The cloud.</h4>
                      <p className="hp-tile-p">My own. Three servers at home run my photos and files, and the MQTT and TURN servers my projects talk to.</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Design: why the case, the screens and the poster matter */}
              <div className="hp-tile ab-group ab-design sl-emerge">
                <div className="ab-head">
                  <span className="hp-key">Design</span>
                  <h3 className="hp-tile-h">Designed for people.</h3>
                  <p className="hp-tile-p">Design is how my projects stand out. A build has to work, but it also has to fit the hand that holds it and make sense the first time someone sees it. So I design the case, the screens and the poster myself.</p>
                </div>
                <div className="ab-cell ab-cad hp-clickable" {...opens(SKILL_CAD)}>
                  <span className="hp-tile-go"><AU /></span>
                  <img className="hp-tile-render" src="/images/lora-case-cut.webp" alt="The LoRA Messenger case, modelled in Onshape" loading="lazy" />
                  <span className="hp-key">3D and CAD</span>
                  <h4 className="hp-tile-h">Enclosures that fit.</h4>
                  <p className="hp-tile-p">Modelled in Onshape, rendered in Blender, printed until the fit is right.</p>
                </div>
                <div className="ab-cell ab-ui hp-clickable" {...opens(SKILL_DESIGN)}>
                  <span className="hp-tile-go"><AU /></span>
                  <div className="hp-figma-stack"><img className="back" src="/images/ELECF.webp" alt="" /><img className="mid" src="/images/Dashboard.webp" alt="" /><img className="front" src="/images/Cdyspstart.webp" alt="" /></div>
                  <span className="hp-key">Interfaces</span>
                  <h4 className="hp-tile-h">Interfaces and posters.</h4>
                  <p className="hp-tile-p">The Project June console, the EMA dashboard and the ELEC-F poster, in Figma, Spline and Photoshop.</p>
                </div>
              </div>

              {/* Wireless */}
              <div className="hp-tile hp-tile-rf hp-clickable" data-reveal {...opens(SKILL_WIRELESS)}>
                <span className="hp-tile-go"><AU /></span>
                <span className="hp-key">Wireless</span>
                <h3 className="hp-tile-h">Radios and live links.</h3>
                <p className="hp-tile-p">LoRa for range, ESP-NOW for quick local links, MQTT for telemetry and WebRTC over 5G for live video.</p>
                <div className="hp-chips"><span>LoRa</span><span>ESP-NOW</span><span>MQTT</span><span>WebRTC</span><span>5G</span></div>
              </div>
              {/* Video */}
              <div className="hp-tile hp-media-tile hp-tile-davinci hp-clickable" data-reveal data-delay="1" role="link" tabIndex={0} onClick={() => window.open('https://www.youtube.com/@newkringster2564', '_blank')} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <LazyVideo webm="/images/Davinci-showcase.webm" mp4="/images/Davinci-showcase.mp4" poster="/images/Davinci-showcase-poster.webp" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">Video</span><h3 className="hp-tile-h">A film for every build.</h3><p className="hp-tile-p">Engaging videos to explain my builds.</p></div>
              </div>
              {/* Photography */}
              <div className="hp-tile hp-media-tile hp-tile-photo hp-clickable" data-reveal data-delay="2" role="link" tabIndex={0} onClick={() => { window.location.href = '#photolink'; }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}>
                <span className="hp-tile-go"><AU /></span>
                <img src="/images/abm-lr.webp" alt="Photography" />
                <div className="hp-media-scrim"></div>
                <div className="hp-media-body"><span className="hp-key">Photography</span><h3 className="hp-tile-h">Photos.</h3><p className="hp-tile-p">Photography helps me explore more of my creativity.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* The grass, drawn here so it sits in front of the About section and behind everything after it */}
        <SunlitField />
        {/* ── PROJECTS ── */}
        <section className="hp-band hp-projects-band" id="portfolio-items-holder">
          <div className="hp-section">
            <div className="portfolio-editorial-header" data-reveal>
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
                  <a className="hp-btn" href="/project-june"><IcRead /> Read article</a>
                  <button className="hp-btn hp-btn-ghost" onClick={() => openProject('proj-june')}><IcPeek /> Peek summary</button>
                  <a className="hp-btn hp-btn-ghost" href="https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC" target="_blank" rel="noopener"><IcPlay /> Watch the build</a>
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
                  <a className="hp-btn" href="/beadreader"><IcRead /> Read article</a>
                  <button className="hp-btn hp-btn-ghost" onClick={() => openProject('proj-beadreader')}><IcPeek /> Peek summary</button>
                  <a className="hp-btn hp-btn-ghost" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener"><IcGitHub /> GitHub</a>
                </div>
              </div>
            </article>

            <div className="hp-pf-lead" data-reveal>
              <h3>Other projects</h3><span>Search or filter, then open a card for a summary.</span>
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
                    <a className="hp-pf-view" href="/brolocator"><IcRead /> Read article</a>
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
                    <a className="hp-pf-view" href="/lumen"><IcRead /> Read article</a>
                  </div>
                </div>
              </article>

              {/* EMA Smart Home */}
              <article id="proj-ema" className="hp-pf-card is-compact" data-article="/csdp" data-type="school" data-search="ema smart home beaglebone python socketio flask websocket spline mikrobus school group sensors">
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
                    <a className="hp-pf-view" href="/csdp"><IcRead /> Read article</a>
                  </div>
                </div>
              </article>

              {/* Pandus */}
              <article id="proj-pandus" className="hp-pf-card is-compact" data-article="/pandus" data-type="school" data-search="pandus dispenser arduino uno pyfirmata 3d printed servo pump syrup school first">
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
                    <a className="hp-pf-view" href="/pandus"><IcRead /> Read article</a>
                  </div>
                </div>
              </article>

              {/* ELEC-F */}
              <article id="proj-elecf" className="hp-pf-card is-compact" data-article="/elecf" data-type="school" data-search="elec-f elecf concept m5-stack m5stack freezer safety sensors engineering course school">
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
                    <a className="hp-pf-view" href="/elecf"><IcRead /> Read article</a>
                  </div>
                </div>
              </article>

              {/* Kauli */}
              <article id="proj-kauli" className="hp-pf-card is-compact is-soon" data-type="school" data-search="kauli concept blender 3d communication skills presentation school onshape">
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
                    <span className="hp-pf-soon">Coming soon</span>
                  </div>
                </div>
              </article>

              {/* Series One Light */}
              <article id="proj-sol" className="hp-pf-card is-compact is-soon" data-type="personal" data-search="series one light zeromouse optimum tech ultralight 20g fps mouse onshape personal">
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
                    <span className="hp-pf-soon">Coming soon</span>
                  </div>
                </div>
              </article>

              {/* Copy Board */}
              <article id="proj-copyboard" className="hp-pf-card is-compact is-soon" data-type="personal" data-search="copy board kicad pcb schematic dev board school recreation personal">
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
                    <span className="hp-pf-soon">Coming soon</span>
                  </div>
                </div>
              </article>

              {/* Web Dev */}
              <article id="proj-webdev" className="hp-pf-card is-compact is-soon" data-type="school" data-search="web development html css website school first chrome canva demo tht">
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
                    <span className="hp-pf-soon">Coming soon</span>
                  </div>
                </div>
              </article>

              {/* Minecraft */}
              <article id="proj-mc" className="hp-pf-card is-compact is-soon" data-type="personal" data-search="minecraft server paper dynmap live interactive map docker multiplayer personal demo">
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
                    <span className="hp-pf-soon">Coming soon</span>
                  </div>
                </div>
              </article>

            </div>
            {!projectsExpanded && (
              <div className="hp-pf-showmore-wrap">
                <button className="hp-pf-showmore" onClick={() => setProjectsExpanded(true)}><IcMore /> Show all projects</button>
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
              <a className="hp-btn" href="/homelab" style={{ marginTop: '1.8rem' }}>
                <IcServer /> Explore the HomeLab
              </a>
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
              <div className="seh-content"><span className="seh-eyebrow">Gallery</span><span className="seh-title">Photography</span></div>
            </div>
            {/* Tabs and gallery share one glass panel, so the preview fades into the panel instead of the sky */}
            <div className="ab-photos" data-reveal>
              <div className="hp-albums" role="tablist" aria-label="Photo albums">
                {[['highlight','Highlights'],['europe','Europe'],['china','China'],['zealand','New Zealand'],['by219','21:9'],['general','General']].map(([key, label], i) => (
                  <button key={key} className={`hp-album-link${i === 0 ? ' is-active' : ''}`} role="tab" aria-selected={i === 0}
                    onClick={(e) => (window as any).switchGallery?.(key, e.currentTarget)}>
                    {label}
                  </button>
                ))}
                <a className="hp-album-all" href="/photography">All albums <AU /></a>
              </div>
              <div className="photography-box photo-main-ver" id="photolink">
                <div className="expand" id="expand">
                  <button onClick={() => (window as any).expandphoto?.()}><IcExpand /> Show the whole album</button>
                </div>
                <div className="phototop">
                  <h1 id="hp-gallery-title">Highlights</h1>
                  <a href="/photography" aria-label="Open full gallery"><img src="/images/arrow.webp" alt="" /></a>
                </div>
                <div className="hp-gallery-stage" id="hp-gallery-stage"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section className="hp-cta" data-reveal>
          <span className="hp-eyebrow">Get in touch</span>
          <h2>Email me at <a href="mailto:braven@chiambucket.com"><em>braven@chiambucket.com</em></a></h2>
          <div className="hp-cta-row">
            <a className="hp-btn" href="/contact"><IcMail /> Contact me</a>
            <a className="hp-btn hp-btn-ghost" href="#portfolio-items-holder"><IcGrid /> Browse projects</a>
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

      <InfoModal item={openTile} onClose={() => setOpenTile(null)} />
    </>
  );
}
