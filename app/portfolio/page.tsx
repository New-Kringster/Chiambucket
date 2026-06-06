'use client';
import type { Metadata } from 'next';
import { useState } from 'react';

const ViewBtn = ({ href }: { href: string }) => (
  <a href={href} className="pf-item-button">
    View Article
    <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
      <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
    </svg>
  </a>
);

const DemoBtn = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noopener" className="pf-item-button pf-item-demo">
    DEMO
    <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
      <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
    </svg>
  </a>
);

export default function PortfolioPage() {
  const [brolocatorOpen, setBrolocatorOpen] = useState(false);

  return (
    <main>
      <div className="portfolio-hero-bottom">
        <div id="portfolio-items-holder">

          {/* LoRA Messenger */}
          <div className={`portfolio-items2 pf-item-card-bg pf-personal-highlights${brolocatorOpen ? ' portfolio-items2-open' : ''}`} id="blddm">
            <div className="pf-items-wrapper">
              <div className="pf-items-top">
                <div className="pf-item-tag">
                  <div className="pf-item-tag-personal-best"><h5>Highlights</h5></div>
                  <div className="pf-item-tag-personal"><h5>Personal Project</h5></div>
                </div>
                <div className="pf-info-dropdown">
                  <label className="pf-info-dropdown-checkbox">
                    <input type="checkbox" checked={brolocatorOpen} onChange={() => setBrolocatorOpen(!brolocatorOpen)} />
                    <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="chevron-down">
                      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="pf-item-content pf-item2-content">
                <h1>LoRA Messenger</h1>
                <h6>Featuring the ESP32 Microcontroller, LoRA, 2-Way Voice communication over ESP-NOW, Designing a PCB with KiCAD &amp; case with Onshape. All self-learnt.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/vscode-icon.webp" alt="" />
                      <img src="/images/onshape-icon.webp" alt="" />
                      <img src="/images/Kicad-icon.webp" alt="" />
                      <img src="/images/esp-icon.webp" alt="" />
                      <img src="/images/PlatformIO-icon.webp" alt="" />
                    </div>
                  </div>
                  <ViewBtn href="/brolocator" />
                </div>
              </div>
              <div className={`pf-hidden-content${brolocatorOpen ? ' pf-hidden-content-shown' : ''}`} id="bldd">
                <h1>Summary</h1>
                <p>1 Month • High Difficulty</p>
                <div className="pf-hidden-bottom">
                  <div className="pf-hidden-left">
                    <div className="pf-hidden-keypoints">
                      <div className="left">
                        <h3 className="pf-key">Features:</h3>
                        <p className="pf-point">- Messaging</p>
                        <p className="pf-point">- Voice calls 2-Way</p>
                        <p className="pf-point">- Battery Powered</p>
                        <h3 className="pf-key">Microcontroller:</h3>
                        <p className="pf-point">- ESP32 WROOM</p>
                        <p className="pf-point">- PlatformIO IDE VsCode</p>
                        <p className="pf-point">- Arduino Framework</p>
                        <h3 className="pf-key">Connectivity:</h3>
                        <p className="pf-point">- ESPNOW [Voice]</p>
                        <p className="pf-point">- LoRa p2p [Text]</p>
                      </div>
                      <div className="right">
                        <h3 className="pf-key">Audio:</h3>
                        <p className="pf-point">- I2S Mic and Speaker</p>
                        <h3 className="pf-key">Others:</h3>
                        <p className="pf-point">- Custom PCB</p>
                        <p className="pf-point">- Custom 3D Case</p>
                        <p className="pf-point">- TP4056 Charger</p>
                        <p className="pf-point">- Dual OLED Displays</p>
                      </div>
                    </div>
                  </div>
                  <div className="pf-hidden-right">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/1nbiYCAtGPA?si=DX0zrik6DufUva5P" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur">
              <img src="/images/borlocator-pf-context.webp" alt="" className="pf-item-image" />
            </div>
          </div>

          {/* Pandus */}
          <div className="portfolio-items2 pf-item-card-bg">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-school"><h5>School Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Pandus Dispenser</h1>
                <h6>Pandus was my first school project I worked on. It is made of 6 different 3D printed components and Powered by an Arduino uno.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/resolve-icon.webp" alt="" />
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/powerpoint-icon.webp" alt="" />
                      <img src="/images/vscode-icon.webp" alt="" />
                      <img src="/images/onshape-icon.webp" alt="" />
                    </div>
                  </div>
                  <ViewBtn href="/pandus" />
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/pandusarticle.webp" alt="" className="pf-item-image-pandus" /></div>
          </div>

          {/* EMA Smart Home */}
          <div className="portfolio-items2 pf-item-card-bg">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-school"><h5>School Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>EMA Smart Home System</h1>
                <h6>BeagleBone Black Wireless, Click boards, Python, SocketIO.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/resolve-icon.webp" alt="" />
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/powerpoint-icon.webp" alt="" />
                      <img src="/images/vscode-icon.webp" alt="" />
                      <img src="/images/onshape-icon.webp" alt="" />
                      <img src="/images/figma-icon.webp" alt="" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 15 }} className="pf-dual-buttons">
                    <DemoBtn href="https://csdpdemo.chiambucket.com" />
                    <ViewBtn href="/csdp" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/Ema-pf-context.webp" alt="" className="pf-item-image" /></div>
          </div>

          {/* Kauli */}
          <div className="portfolio-items2 pf-item-card-bg">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-school"><h5>School Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Kauli Concept</h1>
                <h6>Kauli is a conceptual product I developed for a communication skills project. I used Blender to design the 3D scenes.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/resolve-icon.webp" alt="" />
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/powerpoint-icon.webp" alt="" />
                      <img src="/images/blender-icon.webp" alt="" />
                      <img src="/images/onshape-icon.webp" alt="" />
                    </div>
                  </div>
                  <ViewBtn href="/comingsoon" />
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/kauli3-pf-context.webp" alt="" className="pf-item-image-kauli" /></div>
          </div>

          {/* Series One Light */}
          <div className="portfolio-items2 pf-item-card-bg">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-personal"><h5>Personal Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Series One Light</h1>
                <h6>Series One Light is my take on the popular <a href="https://zeromouse.co/">ZeroMouse</a> by <a href="https://www.youtube.com/@optimumtech">Optimum Tech</a> — an ultralight 20g mouse for FPS games.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/onshape-icon.webp" alt="" />
                    </div>
                  </div>
                  <ViewBtn href="/comingsoon" />
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/Series1l-pf-context.webp" alt="" className="pf-item-image-kauli" /></div>
          </div>

          {/* Copy Board */}
          <div className="portfolio-items2 pf-item-card-bg">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-personal"><h5>Personal Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Copy Board</h1>
                <h6>Created because my school did not allow me to bring the dev board home, copied from the school&apos;s dev board&apos;s schematic.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack"><img src="/images/Kicad-icon.webp" alt="" /></div>
                  </div>
                  <ViewBtn href="/comingsoon" />
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/CopyBoard-pf-context.webp" alt="" className="pf-item-image-pandus" /></div>
          </div>

          {/* ELEC-F */}
          <div className="portfolio-items2">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-school"><h5>School Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>ELEC-F Concept</h1>
                <h6>ELEC-F is a conceptual product developed by my team for an engineering course. It uses the M5-Stack Controller and sensors to help prevent fatalities in walk-in freezers.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/resolve-icon.webp" alt="" />
                      <img src="/images/ps-pf-icon.webp" alt="" />
                      <img src="/images/powerpoint-icon.webp" alt="" />
                      <img src="/images/figma-icon.webp" alt="" />
                    </div>
                  </div>
                  <ViewBtn href="/elecf" />
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/elef2-pf-context.webp" alt="" className="pf-item-image-kauli" /></div>
          </div>

          {/* Web Development Project */}
          <div className="portfolio-items2">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-school"><h5>School Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Web Development Prj</h1>
                <h6>This was the first fully functional website I created using HTML and CSS as the final assignment for my web development class.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/vscode-icon.webp" alt="" />
                      <img src="/images/chrome-icon.webp" alt="" />
                      <img src="/images/canva-icon.webp" alt="" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 15 }} className="pf-dual-buttons">
                    <DemoBtn href="https://tht.chiambucket.com" />
                    <ViewBtn href="/comingsoon" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur"><img src="/images/tht-cover.webp" alt="" className="pf-item-image darken" /></div>
          </div>

          {/* Minecraft */}
          <div className="portfolio-items2">
            <div className="pf-items-wrapper">
              <div className="pf-item-tag"><div className="pf-item-tag-personal"><h5>Personal Project</h5></div></div>
              <div className="pf-item-content pf-item2-content">
                <h1>Minecraft Server With Live Interactive Map</h1>
                <h6>Minecraft Server running Paper and featuring Dynmap, a plugin that adds an interactive map to multiplayer servers.</h6>
                <div className="pf-item-button-wrapper">
                  <div className="pf-button-left-stack">
                    <h3>Tools Used:</h3>
                    <div className="icon-stack">
                      <img src="/images/docker-icon.webp" alt="" />
                      <img src="/images/chrome-icon.webp" alt="" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 15 }} className="pf-dual-buttons">
                    <DemoBtn href="https://map.chiambucket.com" />
                    <ViewBtn href="/comingsoon" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pf-item-image-wrapper-blur pf-item-image-wrapper-blur-minecraft">
              <img src="/images/mc-pf-context.webp" alt="" className="pf-item-image darken-light" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
