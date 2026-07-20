'use client';
import { useState, useEffect } from 'react';
import { PeekFeed } from './ProjectPeek';

const AU = () => <svg aria-hidden="true"><use href="#arec-arrow-ur" /></svg>;
const SR = () => <svg aria-hidden="true"><use href="#arec-search" /></svg>;
const ST = () => <svg aria-hidden="true"><use href="#arec-star" /></svg>;
const CR = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 18.2h19.2l-1.5-9.4-5.4 3.9L12 4.8 9.3 12.7 3.9 8.8z" /></svg>;

type ProjectType = 'personal' | 'school';

interface Project {
  id: string;
  title: string;
  blurb: string;
  img: string;
  imgAlt: string;
  type: ProjectType;
  highlight?: boolean;
  flagship?: boolean;
  articleUrl: string;
  icons: Array<{ src: string; alt: string }>;
}

const ALL_PROJECTS: Project[] = [
  { id: 'proj-june', title: 'Project June', blurb: 'A 5G radio-controlled vehicle with 3 live video streams, GPS, a laser system, gyroscope and more. My most ambitious build.', img: '/images/ProjJuneBanner1.webp', imgAlt: 'Project June rover', type: 'personal', flagship: true, articleUrl: '/project-june', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-beadreader', title: 'BeadReader', blurb: 'A private, invite-only online book reader with live presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats. Next.js and Supabase.', img: '/images/beadreader-pf-context.webp', imgAlt: 'BeadReader private book reader', type: 'personal', flagship: true, articleUrl: '/beadreader', icons: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/tailwind-icon.webp', alt: 'Tailwind CSS' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }] },
  { id: 'proj-lora', title: 'LoRA Messenger', blurb: 'An ESP32 messenger with 2-way voice over ESP-NOW and text over LoRa. Custom PCB in KiCAD, case in Onshape, all self-taught.', img: '/images/borlocator-pf-context.webp', imgAlt: 'LoRA Messenger', type: 'personal', highlight: true, articleUrl: '/brolocator', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCAD' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }] },
  { id: 'proj-lumen', title: 'LUMEN', blurb: 'A voice-controlled smart-room assistant on an ESP32, with Whisper and a DeepSeek LLM via OpenRouter turning speech into one JSON command over MQTT.', img: '/images/lumen-pf-context.webp', imgAlt: 'LUMEN voice assistant', type: 'school', highlight: true, articleUrl: '/lumen', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }, { src: '/images/vscode-icon.webp', alt: 'VS Code' }] },
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
                className={`hp-pf-card${p.flagship ? ' is-flagship' : p.highlight ? ' is-highlight' : ''}`}
                data-article={p.articleUrl}
                data-type={p.type}
                data-highlight={p.highlight ? '1' : undefined}
                data-flagship={p.flagship ? '1' : undefined}
              >
                <div className="hp-pf-thumb">
                  <button className="hp-pf-peek" onClick={() => openProject(p.id)} aria-label="Peek at a quick summary">
                    <span className="hp-pf-peek-pill"><SR />Peek summary</span>
                  </button>
                  <span className={`hp-pf-type ${p.type}`}>{p.type === 'personal' ? 'Personal' : 'School'}</span>
                  {p.flagship ? <span className="hp-pf-crown"><CR />Flagship</span> : p.highlight && <span className="hp-pf-star"><ST />Highlight</span>}
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
            {activeProject && <PeekFeed key={activeProject} startId={activeProject} exclude={exclude} />}
          </div>
        </div>
      </div>
    </>
  );
}
