'use client';
import { useEffect, useState } from 'react';
import InfoModal, { type InfoItem } from '../../components/InfoModal';
import LazyVideo from '../../components/LazyVideo';

const tools = [
  {
    img: '/images/pr-icon.webp',
    name: 'Premiere Pro',
    maker: 'Adobe',
    desc: 'I learned Premiere Pro with Photoshop, but frequent crashes led me to switch to DaVinci Resolve with no regrets.',
    add: 'It taught me the fundamentals of a timeline, but it mostly lives in my history now.',
    chips: ['Video editing', 'Timelines', 'Where I started'],
  },
  {
    img: '/images/il-icon.webp',
    name: 'Illustrator',
    maker: 'Adobe',
    desc: "Illustrator is a fairly simple tool I use for creating logos or SVGs, but I don't use it as much as Photoshop.",
    add: 'When something needs to scale cleanly or live as an SVG, this is where it gets drawn.',
    chips: ['Logos', 'Vector / SVG', 'Icons'],
  },
  {
    img: '/images/fm-icon.webp',
    name: 'Figma',
    maker: 'Figma',
    desc: 'A highly powerful tool I use to prototype and create designs focused on shapes rather than images.',
    add: 'Most of my interfaces and posters start as Figma frames before they become code or print.',
    chips: ['UI design', 'Prototyping', 'Layout'],
  },
  {
    img: '/images/ps-logo.webp',
    name: 'Photoshop',
    maker: 'Adobe',
    desc: "I've used Photoshop since 2019, received professional training through my school's media club, and it remains my favorite tool.",
    add: 'From retouching photos to laying out posters, it is the tool I reach for first.',
    chips: ['Photo editing', 'Posters', 'Compositing'],
  },
  {
    img: '/images/resolve-logo.webp',
    name: 'DaVinci Resolve',
    maker: 'Blackmagic Design',
    desc: 'I regularly edit my videos using DaVinci, but I rarely post them. However, I have more content planned for the future.',
    add: 'Editing, colour and export all live in one place, which is exactly why it replaced Premiere for me.',
    chips: ['Video editing', 'Colour grading', 'Project films'],
  },
  {
    img: '/images/lrc-logo.webp',
    name: 'Lightroom',
    maker: 'Adobe',
    desc: 'Lightroom provides me with powerful tools to enhance images and recover details from unusable shots.',
    add: 'It is the last stop for most of my photos, pulling back highlights and shadows a JPEG would have lost.',
    chips: ['Photo editing', 'Colour', 'RAW workflow'],
  },
];

const galleries = [
  { id: 'highlight', title: 'Highlights',   albumId: 'pxAS20i7_kWFVTC_Ke_HlDUk', galleryUrl: 'https://photos.chiambucket.com/gallery/pxAS20i7_kWFVTC_Ke_HlDUk' },
  { id: 'europe',    title: 'Europe',        albumId: 'LhvwBoxDDt6VdG3HvKrDMi1Z', galleryUrl: 'https://photos.chiambucket.com/gallery/LhvwBoxDDt6VdG3HvKrDMi1Z' },
  { id: '21by9',     title: '21:9',          albumId: 'cZ6uVEzxH72ygIJLPbnxZAiN', galleryUrl: 'https://photos.chiambucket.com/gallery/cZ6uVEzxH72ygIJLPbnxZAiN' },
  { id: 'china',     title: 'China',         albumId: 'LscJWL46nCkW76KiKEY4csiI', galleryUrl: 'https://photos.chiambucket.com/gallery/LscJWL46nCkW76KiKEY4csiI' },
  { id: 'zealand',   title: 'New Zealand',   albumId: 'RgKkSumOaHmpoMKbNxPU-o-0', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
  { id: 'hongkong',  title: 'Hong Kong',     albumId: '9cDZmd5tSazcQToprQAzbKKu', galleryUrl: 'https://photos.chiambucket.com/gallery/9cDZmd5tSazcQToprQAzbKKu' },
  { id: 'general',   title: 'General',       albumId: 'X1sod6pbc0khZPykFISHCjzg', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
];

export default function PhotographyClient() {
  const [openTool, setOpenTool] = useState<InfoItem | null>(null);

  const expandPhoto = (albumId: string) => {
    const el = document.getElementById('photography-' + albumId);
    if (el) el.classList.remove('photography-restrict');
    const exp = document.getElementById('expand-' + albumId);
    if (exp) exp.classList.add('loader-hide');
  };

  /* Re-inject Lychee embed script on every mount so it re-scans the DOM
     after client-side navigation (Next.js Script only runs once globally) */
  useEffect(() => {
    const LYCHEE_JS = 'https://photos.chiambucket.com/embed/lychee-embed.js?v=1.0.0';
    // Load Lychee's cross-origin stylesheet after paint so it never render-blocks on the homelab server
    if (!document.querySelector('link[data-lychee-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://photos.chiambucket.com/embed/lychee-embed.css?v=1.0.0';
      link.setAttribute('data-lychee-css', '');
      document.head.appendChild(link);
    }
    // Remove any previously injected copy so it executes fresh
    document.querySelectorAll(`script[data-lychee-script]`).forEach(s => s.remove());
    const script = document.createElement('script');
    script.src = LYCHEE_JS;
    script.setAttribute('data-lychee-script', '');
    document.body.appendChild(script);
    return () => {
      document.querySelectorAll(`script[data-lychee-script]`).forEach(s => s.remove());
    };
  }, []);

  /* data-reveal IntersectionObserver */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-visible'); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="ct-wrap ph-hero">
        <div className="ph-hero-media" aria-hidden="true">
          <LazyVideo webm="/images/index-photos-gif.webm" mp4="/images/index-photos-gif.mp4" poster="/images/abm-lr.webp" />
        </div>
        <div className="ph-hero-scrim" aria-hidden="true"></div>
        <div className="ct-aura"></div>
        <div className="ph-hero-grain" aria-hidden="true"></div>
        <span className="ct-kicker">Photography</span>
        <h1 className="ct-title">
          Through a <em>different lens.</em>
        </h1>
        <p className="ct-sub">
          Design has always been a passion of mine, and I love exploring its many forms, from photography to 3D design. Every frame is a lesson in perspective.
        </p>
        <div className="ph-hero-btns">
          <button
            className="hp-btn"
            onClick={() => window.open('https://photos.chiambucket.com', '_blank')}
          >
            All Photos
            <svg viewBox="0 0 24 24" fill="none" width="17" height="17" aria-hidden="true">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15"/>
            </svg>
          </button>
          <button
            className="hp-btn hp-btn-ghost"
            onClick={() => window.open('https://www.youtube.com/@newkringster2564', '_blank')}
          >
            Videos
          </button>
        </div>
      </section>

      {/* ── MY TOOLS ── */}
      <section className="hp-band">
        <div className="hp-section">
          <div className="section-editorial-header" data-reveal>
            <span className="seh-number">01</span>
            <div className="seh-content">
              <span className="seh-eyebrow">Creative Stack</span>
              <span className="seh-title">My Tools</span>
            </div>
          </div>
          <div className="hp-cap-grid ph-tools-grid" data-reveal>
            {tools.map((t) => {
              const item: InfoItem = { icon: t.img, eyebrow: t.maker, title: t.name, blurb: t.desc, add: t.add, chips: t.chips };
              return (
                <div key={t.name} className="cr-card ph-tool-card" role="button" tabIndex={0}
                  aria-label={`${t.name} details`}
                  onClick={() => setOpenTool(item)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenTool(item); } }}>
                  <span className="ph-tool-plus" aria-hidden="true">+</span>
                  <div className="ph-tool-card-inner">
                    <img src={t.img} alt={`${t.name} icon`} className="ph-tool-icon" />
                    <div>
                      <h3 className="ph-tool-name">{t.name}</h3>
                      <p className="ph-tool-desc">{t.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GALLERIES ── */}
      <section className="hp-band" style={{ paddingTop: 0 }}>
        <div className="hp-section">
          <div className="section-editorial-header" data-reveal>
            <span className="seh-number">02</span>
            <div className="seh-content">
              <span className="seh-eyebrow">Albums</span>
              <span className="seh-title">Browse the galleries</span>
            </div>
          </div>
        </div>

        <div className="photography-box-wrapper">
          {galleries.map(({ id, title, albumId, galleryUrl }, i) => (
            <div key={id} className="photography-box ph-gallery" data-reveal>
              <div className="ph-gallery-head">
                <div className="ph-gallery-head-l">
                  <span className="ph-gallery-num">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="ph-gallery-title">{title}</h2>
                </div>
                <a className="ph-gallery-open" href={galleryUrl} target="_blank" rel="noopener" aria-label={`Open ${title} gallery`}>
                  View album
                  <svg viewBox="0 0 24 24" fill="none" width="15" height="15" aria-hidden="true">
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </a>
              </div>
              <div className="ph-gallery-frame">
                <div
                  id={`photography-${id}`}
                  className="photography-restrict"
                  data-lychee-embed=""
                  data-api-url="https://photos.chiambucket.com"
                  data-mode="album"
                  data-album-id={albumId}
                  data-layout="masonry"
                  data-spacing="8"
                  data-target-row-height="150"
                  data-target-column-width="150"
                  data-max-photos="none"
                  data-sort-order="desc"
                  data-header-placement="none"
                ></div>
                <div className="expand-photography" id={`expand-${id}`}>
                  <button onClick={() => expandPhoto(id)}>Show all photos</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* bespoke overrides scoped to photography page */}
      <style>{`
        /* ── Hero: photographic montage backdrop + violet aura + grain ── */
        .ph-hero { position: relative; overflow: hidden; }
        .ph-hero > .ph-hero-media,
        .ph-hero > .ph-hero-scrim,
        .ph-hero > .ph-hero-grain { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .ph-hero-grain { z-index: 1; }
        .ph-hero-media video {
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0.26; filter: saturate(1.05) contrast(1.02);
          -webkit-mask-image: radial-gradient(ellipse 82% 72% at 50% 42%, #000 28%, transparent 80%);
          mask-image: radial-gradient(ellipse 82% 72% at 50% 42%, #000 28%, transparent 80%);
          animation: phHeroPan 44s ease-in-out infinite alternate;
        }
        @keyframes phHeroPan {
          from { transform: scale(1.08) translate3d(-1%, -1%, 0); }
          to   { transform: scale(1.17) translate3d(1.5%, 1%, 0); }
        }
        .ph-hero-scrim {
          background:
            linear-gradient(180deg, rgba(6,6,9,0.62) 0%, rgba(6,6,9,0.38) 40%, rgba(6,6,9,0.76) 100%),
            radial-gradient(ellipse 70% 62% at 50% 44%, transparent 34%, rgba(6,6,9,0.66) 100%);
        }
        .ph-hero-grain {
          opacity: 0.55; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 140px 140px;
        }
        /* Second, coarser grain pass multiplied underneath: deepens shadows
           (mix-blend-mode:multiply) without overlay's tendency to blow out
           the highlights, so the montage stays visible but the mood reads darker. */
        .ph-hero-grain::after {
          content: ''; position: absolute; inset: 0;
          opacity: 0.22; mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E");
          background-size: 220px 220px;
        }
        /* ── Diffuse the violet aura into a broad, gentle wash rather than a
           tight glow: scale the box up, push the blur much further, and back
           the overall intensity off so it reads as ambient colour, not a blob. */
        .ph-hero > .ct-aura {
          position: absolute;
          top: -32%; left: 50%; transform: translateX(-50%);
          width: min(1900px, 230vw); height: 1280px;
          filter: blur(180px);
          opacity: 0.5;
        }
        @media (prefers-reduced-motion: reduce) { .ph-hero-media video { animation: none; } }

        .ph-hero-btns {
          display: flex;
          gap: 12px;
          margin-top: 2.2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* ── My Tools: richer cards ── */
        .ph-tools-grid {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 0;
          gap: 16px;
        }
        @media only screen and (max-width: 900px) {
          .ph-tools-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media only screen and (max-width: 560px) {
          .ph-tools-grid { grid-template-columns: 1fr; }
        }
        .ph-tool-card {
          position: relative;
          overflow: hidden;
          padding: clamp(20px, 2.6vw, 30px);
          background: var(--hp-glass);
          border: 1px solid var(--hp-line);
          border-radius: 20px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .ph-tool-card:focus-visible { outline: 2px solid var(--hp-sky); outline-offset: 3px; }
        .ph-tool-plus { position: absolute; top: 14px; right: 16px; font-family: 'inter'; font-size: 1.05rem; line-height: 1; color: rgba(255,255,255,0.28); transition: color 0.25s ease, transform 0.3s ease; z-index: 1; }
        .ph-tool-card:hover .ph-tool-plus { color: var(--hp-sky); transform: rotate(90deg); }
        .ph-tool-card::before {
          content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--hp-sky) 55%, transparent), transparent);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .ph-tool-card:hover {
          transform: translateY(-4px);
          border-color: color-mix(in srgb, var(--hp-indigo) 40%, transparent);
          box-shadow: 0 24px 54px -28px color-mix(in srgb, var(--hp-blue) 65%, transparent), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .ph-tool-card:hover::before { opacity: 1; }
        .ph-tool-card-inner { display: flex; align-items: flex-start; gap: 16px; }
        .ph-tool-icon {
          width: 54px; height: 54px; object-fit: contain; flex-shrink: 0;
          padding: 11px; border-radius: 15px;
          background: linear-gradient(158deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .ph-tool-card:hover .ph-tool-icon { transform: scale(1.06) rotate(-2deg); }
        .ph-tool-name {
          font-family: 'inter';
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--hp-sky);
          margin: 0 0 6px;
        }
        .ph-tool-desc {
          font-family: 'dmsans';
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(232,232,232,0.65);
          margin: 0;
        }

        /* ── Galleries: editorial header + glass frame ── */
        .photography-box-wrapper {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 56px);
        }
        .ph-gallery {
          width: 100%;
          margin: 0 0 clamp(2.4rem, 4vw, 3.4rem);
          border-top: none;
          border-radius: 0;
          text-align: left;
          display: block;
        }
        .ph-gallery-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 16px; padding-bottom: 14px; margin-bottom: 18px;
          position: relative;
        }
        .ph-gallery-head::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--hp-sky) 30%, transparent), rgba(255,255,255,0.06) 45%, transparent);
        }
        .ph-gallery-head-l { display: flex; align-items: baseline; gap: 14px; min-width: 0; }
        .ph-gallery-num {
          font-family: 'oswaldbold'; font-size: clamp(1.4rem, 3vw, 2rem); line-height: 1;
          color: transparent;
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-stroke: 1px var(--orb-edge);
          flex-shrink: 0;
        }
        .ph-gallery-title {
          font-family: 'oswaldbold'; font-size: clamp(1.3rem, 3vw, 2rem); line-height: 1.1;
          letter-spacing: -0.01em; margin: 0; padding: 0;
          background: linear-gradient(91deg, #fff 0%, #9a9a9a 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .ph-gallery-open {
          display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
          font-family: 'inter'; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.02em;
          color: var(--hp-sky);
          padding: 8px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .ph-gallery-open svg { transition: transform 0.3s ease; }
        .ph-gallery-open:hover {
          color: #fff; transform: translateY(-2px);
          background: color-mix(in srgb, var(--hp-blue) 24%, transparent);
          border-color: color-mix(in srgb, var(--hp-indigo) 50%, transparent);
        }
        .ph-gallery-open:hover svg { transform: translate(2px, -2px); }
        .ph-gallery-frame {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--hp-line);
          background: rgba(255,255,255,0.018);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 60px -40px rgba(0,0,0,0.85);
          padding: 8px;
        }
        .ph-gallery .photography-restrict { height: 26vh; border-radius: 12px; }
        .ph-gallery .expand-photography {
          left: 8px; right: 8px; bottom: 8px; width: auto;
          border-radius: 0 0 12px 12px;
          background: linear-gradient(180deg, rgba(8,8,10,0) 0%, rgba(8,8,10,0.82) 70%);
          height: 38% !important;
        }
        .ph-gallery .expand-photography button {
          font-family: 'inter'; font-size: 0.8rem; font-weight: 600;
          color: var(--hp-ink);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
          padding: 8px 18px; border-radius: 999px;
        }
        .ph-gallery .expand-photography button:hover {
          color: #fff;
          background: color-mix(in srgb, var(--hp-blue) 28%, transparent);
          border-color: color-mix(in srgb, var(--hp-indigo) 50%, transparent);
          transform: translateY(-2px);
        }
      `}</style>

      <InfoModal item={openTool} onClose={() => setOpenTool(null)} />
    </main>
  );
}
