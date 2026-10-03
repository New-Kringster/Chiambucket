import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import LinkDemo from './LinkDemo';

const DESCRIPTION =
  'My first PCB: an ESP32 handheld that sends text over LoRa with no internet and does crude full-duplex voice over ESP-NOW. KiCAD board, 3D-printed Onshape case, PlatformIO firmware.';

export const metadata: Metadata = {
  title: 'LoRA Messenger | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.chiambucket.com/brolocator' },
  openGraph: {
    title: 'LoRA Messenger | Braven Chiam',
    description: DESCRIPTION,
    url: 'https://www.chiambucket.com/brolocator',
    type: 'article',
    images: [{ url: '/images/borlocator-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'LoRA Messenger',
  alternativeHeadline: 'Brolocator',
  description: DESCRIPTION,
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
        <div className="art-hero-bg"><img src="/images/borlocator-pf-context.webp" alt="The LoRA Messenger handheld" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag personal">Personal project</span>
          </div>
          <h1 className="art-title">LoRA <em>Messenger</em></h1>
          <p className="art-lead">My first PCB and my first ESP32 project. Two of these handhelds text each other over LoRa with no internet, and do crude full-duplex two-way voice over ESP-NOW when they are in range. I called it Brolocator while I was building it.</p>
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
              <a href="#Demo">Demo</a>
              <a href="#Functionality">What it does</a>
              <a href="#ProjectDevelopment">Development</a>
              <a href="#Code">Code</a>
              <a href="#PCBDesign">PCB</a>
              <a href="#threeDDesign">Case</a>
              <a href="#Assembly">Assembly</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/1nbiYCAtGPA?si=DX0zrik6DufUva5P"
                title="LoRA Messenger demo video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="Functionality" className="art-section" data-reveal>
            <h2>What it does</h2>
            <ul>
              <li>Sends text messages over LoRa, across long distances</li>
              <li>Two-way voice over ESP-NOW when the other unit is in range</li>
              <li>Runs on rechargeable LiPo batteries</li>
              <li>Two displays</li>
              <li>A range-test mode</li>
              <li>A simple menu UI</li>
            </ul>
            <p>The two radios do different jobs. LoRa reaches further but only carries short text packets. ESP-NOW is short range but fast enough for crude two-way voice. The demo below shows both.</p>

            <LinkDemo />

            <div className="art-grid">
              <img src="/images/Brolocator1.webp" alt="LoRA Messenger, front" loading="lazy" />
              <img src="/images/Brolocator2.webp" alt="LoRA Messenger, side" loading="lazy" />
              <img src="/images/Brolocator3.webp" alt="Close-up of the displays" loading="lazy" />
              <img src="/images/Brolocator4.webp" alt="The menu UI" loading="lazy" />
              <img src="/images/Brolocator5.webp" alt="The messaging screen" loading="lazy" />
              <img src="/images/Brolocator6.webp" alt="Range-test mode" loading="lazy" />
            </div>
          </section>

          <section id="ProjectDevelopment" className="art-section" data-reveal>
            <h2>Development</h2>
            <p>This was my first deep dive into microcontrollers and my first PCB. I learned how to use each component with help from YouTube and ChatGPT.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator7.webp" alt="Breadboard prototype with the ESP32, LoRa module, I2S mic and speaker, two OLED displays, rotary encoder and buttons" loading="lazy" />
              <figcaption>Breadboard prototype: ESP32 DevKit, Ebyte E220-900D LoRa module, I2S mic and speaker, two I2C OLED displays, rotary encoder and buttons</figcaption>
            </figure>
          </section>

          <section id="Code" className="art-section" data-reveal>
            <h2>Code</h2>
            <p>I wrote the ESP32 firmware in PlatformIO, which my research pointed to as the best fit for the ESP32. The source is on GitHub, and the full PlatformIO project is below.</p>
            <img src="/images/Brolocator8.webp" alt="The firmware open in PlatformIO" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>PlatformIO project</strong>
                <span>The complete firmware project, ready to open in PlatformIO.</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=Uw31ufKRXVAmviDG4Y3zsw" target="_blank" rel="noopener">Download project <Circle /></a>
            </div>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Source on GitHub</strong>
                <span>The firmware source.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/Bro_Locator" target="_blank" rel="noopener">View on GitHub <Circle /></a>
            </div>
          </section>

          <section id="PCBDesign" className="art-section" data-reveal>
            <h2>PCB</h2>
            <p>I designed the board in KiCAD to carry every component.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator9.webp" alt="KiCAD schematic" loading="lazy" />
              <figcaption>Schematic</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator10.webp" alt="KiCAD board layout" loading="lazy" />
              <figcaption>Board layout</figcaption>
            </figure>
            <img src="/images/Brolocator11.webp" alt="The finished PCB" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>KiCAD files</strong>
                <span>The full KiCAD project for the board.</span>
              </div>
              <a className="hp-btn" href="https://file.chiambucket.com/public/api/raw?hash=y5dKQ_glrduAHZ2b09PwFw" target="_blank" rel="noopener">Download KiCAD files <Circle /></a>
            </div>
          </section>

          <section id="threeDDesign" className="art-section" data-reveal>
            <h2>Case</h2>
            <p>I modelled the case in Onshape and 3D printed it. The live model is linked below.</p>
            <figure className="art-fig">
              <img src="/images/Brolocator12.webp" alt="Case model in Onshape" loading="lazy" />
              <figcaption>The case in Onshape</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator16.webp" alt="Printed case iterations side by side" loading="lazy" />
              <figcaption>Printed iterations</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator17.webp" alt="Case clips before and after reinforcing" loading="lazy" />
              <figcaption>Fixing a failure: reinforced, stronger clips</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Onshape model</strong>
                <span>The live 3D model of the case.</span>
              </div>
              <a className="hp-btn" href="https://cad.onshape.com/documents/06f42027d48061220c14a0ca/w/a8ae7436030816f045f9e912/e/ee2cc98ca48e0de54fb6f19a?renderMode=0&uiState=69242b3fb36228e1cf876de1" target="_blank" rel="noopener">View on Onshape <Circle /></a>
            </div>
          </section>

          <section id="Assembly" className="art-section" data-reveal>
            <h2>Assembly</h2>
            <figure className="art-fig">
              <img src="/images/Brolocator13.webp" alt="All components soldered to the PCB" loading="lazy" />
              <figcaption>All components soldered to the PCB and working</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator14.webp" alt="Fitting the PCB into the case" loading="lazy" />
              <figcaption>Fitting the PCB into the case</figcaption>
            </figure>
            <figure className="art-fig">
              <img src="/images/Brolocator15.webp" alt="The finished LoRA Messenger" loading="lazy" />
              <figcaption>Finished</figcaption>
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
