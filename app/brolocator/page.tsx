import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import LinkDemo from './LinkDemo';

export const metadata: Metadata = {
  title: 'LoRA Messenger (Brolocator) — Chiambucket',
  description: 'A LoRA-based peer-to-peer messenger with 2-way voice, custom PCB, and 3D-printed enclosure, built with ESP32, KiCad, and PlatformIO.',
  alternates: { canonical: 'https://www.chiambucket.com/brolocator' },
  openGraph: {
    title: 'LoRA Messenger (Brolocator) — Chiambucket',
    description: 'A LoRA-based peer-to-peer messenger with 2-way voice, custom PCB, and 3D-printed enclosure.',
    url: 'https://www.chiambucket.com/brolocator',
    type: 'article',
    images: [{ url: '/images/borlocator-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'LoRA Messenger (Brolocator)',
  description: 'A LoRA-based peer-to-peer messenger that sends messages over long distances without internet, with 2-way voice communication, custom PCB design, and a 3D-printed enclosure.',
  image: 'https://www.chiambucket.com/images/borlocator-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/brolocator',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function BrolocatorPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/borlocator-pf-context.webp" alt="Brolocator LoRA Messenger device" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag personal">Personal Project</span>
          </div>
          <h1 className="art-title">LoRA <em>Messenger</em></h1>
          <p className="art-lead">I started this project with the goal of learning how to use the ESP32 microcontroller. With help from YouTube and ChatGPT, I created &quot;Brolocator&quot;, a device that lets you send messages over long distances without internet. It can also perform crude full-duplex 2-way voice transmissions within range of ESP-NOW.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
              <img src="/images/Kicad-icon.webp" alt="KiCAD" />
              <img src="/images/esp-icon.webp" alt="ESP32" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: 'GitHub', url: 'https://github.com/New-Kringster/Bro_Locator' },
              { type: 'video', label: 'Demo video', url: 'https://youtu.be/1nbiYCAtGPA' },
              { type: 'cad', label: '3D model', url: 'https://cad.onshape.com/documents/06f42027d48061220c14a0ca/w/a8ae7436030816f045f9e912/e/ee2cc98ca48e0de54fb6f19a?renderMode=0&uiState=69242b3fb36228e1cf876de1' },
            ]}
          />
        </div>
      </header>

      {/* Body */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#Demo">Demo Video</a>
              <a href="#Functionality">Functionality</a>
              <a href="#ProjectDevelopment">Project Development</a>
              <a href="#Code">Code</a>
              <a href="#PCBDesign">PCB Design</a>
              <a href="#threeDDesign">3D Design</a>
              <a href="#Assembly">Assembly</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/1nbiYCAtGPA?si=DX0zrik6DufUva5P"
                title="Brolocator LoRA Messenger demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="Functionality" className="art-section" data-reveal>
            <h2>Functionality</h2>
            <ul>
              <li>Use LoRA for long distance messaging</li>
              <li>2-way voice communication when in range of ESP-NOW</li>
              <li>Powered off rechargeable LiPo batteries</li>
              <li>2 displays</li>
              <li>A mode for range testing</li>
              <li>Decent and simple to use UI</li>
            </ul>
            <p>The two radios trade off against each other: LoRa reaches kilometres but only carries text a packet at a time, while ESP-NOW is a short hop that is fast enough for live voice. Try the link below to feel the difference.</p>

            <LinkDemo />

            <div className="art-grid">
              <img src="/images/Brolocator1.webp" alt="Brolocator device front view" loading="lazy" />
              <img src="/images/Brolocator2.webp" alt="Brolocator device side view" loading="lazy" />
              <img src="/images/Brolocator3.webp" alt="Brolocator display close-up" loading="lazy" />
              <img src="/images/Brolocator4.webp" alt="Brolocator UI screenshot" loading="lazy" />
              <img src="/images/Brolocator5.webp" alt="Brolocator messaging interface" loading="lazy" />
              <img src="/images/Brolocator6.webp" alt="Brolocator range test mode" loading="lazy" />
            </div>
          </section>

          <section id="ProjectDevelopment" className="art-section" data-reveal>
            <h2>Project Development</h2>
            <p>Brolocator is my first deep dive into microcontrollers, and also my first attempt at designing a PCB. I used PlatformIO to code the ESP32, and with some help from YouTube and ChatGPT, I was able to learn how to use each component to build the Brolocator.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator7.webp" alt="Development of the Brolocator" loading="lazy" />
              <figcaption>Development of the Brolocator</figcaption>
            </figure>
          </section>

          <section id="Code" className="art-section" data-reveal>
            <h2>Code</h2>
            <p>Based on my research, PlatformIO was the best choice for developing code for the ESP32. You can download the PlatformIO project files below.</p>
            <img src="/images/Brolocator8.webp" alt="PlatformIO code screenshot" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>PlatformIO Project Files</strong>
                <span>Download the full PlatformIO project for the Brolocator ESP32 firmware.</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=Uw31ufKRXVAmviDG4Y3zsw" target="_blank" rel="noopener">Download Project <Circle /></a>
            </div>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Brolocator on GitHub</strong>
                <span>The full source for the Brolocator firmware, hosted alongside the PlatformIO project.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/Bro_Locator" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          <section id="PCBDesign" className="art-section" data-reveal>
            <h2>PCB Design</h2>
            <p>I used KiCAD to design a PCB for all the components. You can download the KiCAD files below.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator9.webp" alt="KiCAD schematic for Brolocator PCB" loading="lazy" />
              <figcaption>Schematic</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator10.webp" alt="KiCAD PCB board layout" loading="lazy" />
              <figcaption>Board</figcaption>
            </figure>
            <img src="/images/Brolocator11.webp" alt="Finished Brolocator PCB" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>KiCAD PCB Files</strong>
                <span>Download the full KiCAD project for the Brolocator PCB design.</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=y5dKQ_glrduAHZ2b09PwFw" target="_blank" rel="noopener">Download KiCAD Files <Circle /></a>
            </div>
          </section>

          <section id="threeDDesign" className="art-section" data-reveal>
            <h2>3D Design</h2>
            <p>I used Onshape to design a case for the board. You can get the files and view a live preview of the model below.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator12.webp" alt="3D model of the Brolocator case" loading="lazy" />
              <figcaption>3D model of the Brolocator case</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator16.webp" alt="Design iterations for the Brolocator case" loading="lazy" />
              <figcaption>Design iterations</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator17.webp" alt="Design failures and lessons learned" loading="lazy" />
              <figcaption>Learning from design failures</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Onshape 3D Model</strong>
                <span>View the live interactive 3D model of the Brolocator case on Onshape.</span>
              </div>
              <a className="hp-btn" href="https://cad.onshape.com/documents/06f42027d48061220c14a0ca/w/a8ae7436030816f045f9e912/e/ee2cc98ca48e0de54fb6f19a?renderMode=0&uiState=69242b3fb36228e1cf876de1" target="_blank" rel="noopener">View on Onshape <Circle /></a>
            </div>
          </section>

          <section id="Assembly" className="art-section" data-reveal>
            <h2>Assembly</h2>
            <p>Assembly of all components together.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator13.webp" alt="All components soldered to the PCB and working" loading="lazy" />
              <figcaption>All components soldered to the PCB and working</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator14.webp" alt="Fitting PCB into the case" loading="lazy" />
              <figcaption>Fitting PCB into case</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator15.webp" alt="Completed Brolocator device" loading="lazy" />
              <figcaption>Complete</figcaption>
            </figure>
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-lora" />
    </main>
  );
}
