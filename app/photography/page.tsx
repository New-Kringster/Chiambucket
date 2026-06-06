'use client';
import type { Metadata } from 'next';
import { useEffect } from 'react';
import Script from 'next/script';

export default function PhotographyPage() {
  const expandPhoto = (albumId: string) => {
    const el = document.getElementById('photography-' + albumId);
    if (el) el.classList.remove('photography-restrict');
    const exp = document.getElementById('expand-' + albumId);
    if (exp) exp.classList.add('loader-hide');
  };

  return (
    <main>
      <Script
        src="https://photos.chiambucket.com/embed/lychee-embed.js?v=1.0.0"
        strategy="afterInteractive"
      />
      <link rel="stylesheet" href="https://photos.chiambucket.com/embed/lychee-embed.css?v=1.0.0" />

      <div className="photography-header">
        <div className="photography-collage">
          <div className="photography-card">
            <h1 className="photography-header-headline">Not Just a Photographer...</h1>
            <h1 className="photography-header-subtitle">Design has always been a passion of mine, and I love exploring its many forms, from photography to 3D design.</h1>
            <div className="buttons-for-photography">
              <button className="button-photography" onClick={() => window.open('https://photos.chiambucket.com', '_blank')}>
                All Photos
                <svg className="icon-photography-button" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="button-photography" onClick={() => window.open('https://www.youtube.com/@newkringster2564', '_blank')}>
                Videos
                <svg className="icon-photography-button" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="photography-main-body">
        <div className="photography-blur">
          <div className="photography-body">
            <h1 className="photography-other-tools">My Tools</h1>
            <div className="photography-cards">
              {[
                { cls: 'photography-end-card1', img: '/images/pr-icon.webp', name: 'Premiere Pro', desc: "I learned Premiere Pro with Photoshop, but frequent crashes led me to switch to DaVinci Resolve with no regrets." },
                { cls: 'photography-end-card2', img: '/images/il-icon.webp', name: 'Illustrator', desc: "Illustrator is a fairly simple tool I use for creating logos or SVGs, but I don't use it as much as Photoshop." },
                { cls: 'photography-end-card3', img: '/images/fm-icon.webp', name: 'Figma', desc: "A highly powerful tool I use to prototype and create designs focused on shapes rather than images." },
                { cls: 'photography-end-card4', img: '/images/ps-logo.webp', name: 'Photoshop', desc: "I've used Photoshop since 2019, received professional training through my school's media club, and it remains my favorite tool." },
                { cls: 'photography-end-card5', img: '/images/resolve-logo.webp', name: 'DaVinci Resolve', desc: "I regularly edit my videos using DaVinci, but I rarely post them. However, I have more content planned for the future." },
                { cls: 'photography-end-card4', img: '/images/lrc-logo.webp', name: 'Lightroom', desc: "Lightroom provides me with powerful tools to enhance images and recover details from unusable shots." },
              ].map(({ cls, img, name, desc }) => (
                <div key={name} className={`${cls} photography-end-cards-style`}>
                  <div className="photography-end-card-content">
                    <img src={img} alt={`${name} icon`} />
                    <h1>{name}</h1>
                    <h3>{desc}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="photography-box-wrapper">
        {[
          { id: 'highlight', title: 'Highlights', albumId: 'pxAS20i7_kWFVTC_Ke_HlDUk', galleryUrl: 'https://photos.chiambucket.com/gallery/pxAS20i7_kWFVTC_Ke_HlDUk' },
          { id: 'europe', title: 'Europe', albumId: 'LhvwBoxDDt6VdG3HvKrDMi1Z', galleryUrl: 'https://photos.chiambucket.com/gallery/LhvwBoxDDt6VdG3HvKrDMi1Z' },
          { id: '21by9', title: '21:9', albumId: 'cZ6uVEzxH72ygIJLPbnxZAiN', galleryUrl: 'https://photos.chiambucket.com/gallery/cZ6uVEzxH72ygIJLPbnxZAiN' },
          { id: 'china', title: 'China', albumId: 'LscJWL46nCkW76KiKEY4csiI', galleryUrl: 'https://photos.chiambucket.com/gallery/LscJWL46nCkW76KiKEY4csiI' },
          { id: 'zealand', title: 'New Zealand', albumId: 'RgKkSumOaHmpoMKbNxPU-o-0', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
          { id: 'general', title: 'General', albumId: 'X1sod6pbc0khZPykFISHCjzg', galleryUrl: 'https://photos.chiambucket.com/gallery/RgKkSumOaHmpoMKbNxPU-o-0' },
        ].map(({ id, title, albumId, galleryUrl }) => (
          <div key={id} className="photography-box">
            <div className="phototop">
              <h1>{title}</h1>
              <a href={galleryUrl}><img src="/images/arrow.webp" alt="" /></a>
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
    </main>
  );
}
