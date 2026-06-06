'use client';
import { useEffect } from 'react';

const tools = [
  {
    img: '/images/pr-icon.webp',
    name: 'Premiere Pro',
    desc: 'I learned Premiere Pro with Photoshop, but frequent crashes led me to switch to DaVinci Resolve with no regrets.',
  },
  {
    img: '/images/il-icon.webp',
    name: 'Illustrator',
    desc: "Illustrator is a fairly simple tool I use for creating logos or SVGs, but I don't use it as much as Photoshop.",
  },
  {
    img: '/images/fm-icon.webp',
    name: 'Figma',
    desc: 'A highly powerful tool I use to prototype and create designs focused on shapes rather than images.',
  },
  {
    img: '/images/ps-logo.webp',
    name: 'Photoshop',
    desc: "I've used Photoshop since 2019, received professional training through my school's media club, and it remains my favorite tool.",
  },
  {
    img: '/images/resolve-logo.webp',
    name: 'DaVinci Resolve',
    desc: 'I regularly edit my videos using DaVinci, but I rarely post them. However, I have more content planned for the future.',
  },
  {
    img: '/images/lrc-logo.webp',
    name: 'Lightroom',
    desc: 'Lightroom provides me with powerful tools to enhance images and recover details from unusable shots.',
  },
];

const galleries = [
  { id: 'highlight', title: 'Highlights',   albumId: 'pxAS20i7_kWFVTC_Ke_HlDUk', galleryUrl: 'https://photos.chiambucket.com/gallery/pxAS20i7_kWFVTC_Ke_HlDUk' },
  { id: 'europe',    title: 'Europe',        albumId: 'LhvwBoxDDt6VdG3HvKrDMi1Z', galleryUrl: 'https://photos.chiambucket.com/gallery/LhvwBoxDDt6VdG3HvKrDMi1Z' },
  { id: '21by9',     title: '21:9',          albumId: 'cZ6uVEzxH72ygIJLPbnxZAiN', galleryUrl: 'https://photos.chiambucket.com/gallery/cZ6uVEzxH72ygIJLPbnxZAiN' },
  { id: 'china',     title: 'China',         albumId: 'LscJWL46nCkW76KiKEY4csiI', galleryUrl: 'https://photos.chiambucket.com/gallery/LscJWL46nCkW76KiKEY4csiI' },
  { id: 'zealand',   title: 'New Zealand',   albumId: 'RgKkSumOaHmpoMKbNxPU-o-0', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
  { id: 'general',   title: 'General',       albumId: 'X1sod6pbc0khZPykFISHCjzg', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
];

export default function PhotographyClient() {
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
      <link rel="stylesheet" href="https://photos.chiambucket.com/embed/lychee-embed.css?v=1.0.0" />

      {/* ── HERO ── */}
      <section className="ct-wrap">
        <div className="ct-aura"></div>
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
            {tools.map(({ img, name, desc }) => (
              <div key={name} className="cr-card ph-tool-card">
                <div className="ph-tool-card-inner">
                  <img src={img} alt={`${name} icon`} className="ph-tool-icon" />
                  <div>
                    <h3 className="ph-tool-name">{name}</h3>
                    <p className="ph-tool-desc">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
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
          {galleries.map(({ id, title, albumId, galleryUrl }) => (
            <div key={id} className="photography-box" data-reveal>
              <div className="phototop">
                <h1>{title}</h1>
                <a href={galleryUrl} target="_blank" rel="noopener" aria-label={`Open ${title} gallery`}>
                  <img src="/images/arrow.webp" alt="" />
                </a>
              </div>
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
                <button onClick={() => expandPhoto(id)}>Click to Expand</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* bespoke overrides scoped to photography page */}
      <style>{`
        .ph-hero-btns {
          display: flex;
          gap: 12px;
          margin-top: 2.2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ph-tools-grid {
          grid-template-columns: repeat(3, 1fr);
          margin-top: 0;
        }
        @media only screen and (max-width: 900px) {
          .ph-tools-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media only screen and (max-width: 560px) {
          .ph-tools-grid { grid-template-columns: 1fr; }
        }
        .ph-tool-card {
          padding: clamp(18px, 2.4vw, 28px);
        }
        .ph-tool-card-inner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .ph-tool-icon {
          width: 44px;
          height: 44px;
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 10px;
        }
        .ph-tool-name {
          font-family: 'inter';
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7fa8ff;
          margin: 0 0 6px;
        }
        .ph-tool-desc {
          font-family: 'dmsans';
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(232,232,232,0.65);
          margin: 0;
        }
        .photography-box-wrapper {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 56px);
        }
        .photography-box {
          width: 100%;
          margin: 0 0 3rem;
        }
      `}</style>
    </main>
  );
}
