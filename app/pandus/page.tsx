import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import DispenseDemo from './DispenseDemo';

export const metadata: Metadata = {
  title: 'Pandus Dispenser — Chiambucket',
  description: 'A 6-part 3D-printed syrup dispenser powered by an Arduino Uno and driven with PyFirmata, built as a first-year school project at Nanyang Polytechnic.',
  alternates: { canonical: 'https://www.chiambucket.com/pandus' },
  openGraph: {
    title: 'Pandus Dispenser — Chiambucket',
    description: 'A 6-part 3D-printed syrup dispenser powered by an Arduino Uno and driven with PyFirmata.',
    url: 'https://www.chiambucket.com/pandus',
    type: 'article',
    images: [{ url: '/images/pandusarticle.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pandus Dispenser',
  description: 'A 6-part 3D-printed syrup dispenser powered by an Arduino Uno and driven with PyFirmata, built as a first-year school project at Nanyang Polytechnic.',
  image: 'https://www.chiambucket.com/images/pandusarticle.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/pandus',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function PandusPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/pandusarticle.webp" alt="Pandus syrup dispenser" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School Project</span>
          </div>
          <h1 className="art-title">Pandus <em>Dispenser</em></h1>
          <p className="art-lead">Pandus was my first school project. It is made up of 6 different 3D-printed components and powered by an Arduino Uno. What started as a water dispenser idea became a syrup dispenser, built entirely from components provided in class plus a few extras I sourced myself.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'video', label: 'Demo video', url: 'https://youtu.be/fIJQzOhCKQU' },
              { type: 'cad', label: '3D model', url: 'https://cad.onshape.com/documents/5010f3da2be8b0cad10575b0/w/c1baff5b3751dfe2426baad4/e/d042961855d215532e28db65' },
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
              <a href="#PromotionalVideo">Promotional Video</a>
              <a href="#ProjectBackground">Project Background</a>
              <a href="#DesignProcess">Design Process</a>
              <a href="#ControlnFunction">Control and Function</a>
              <a href="#Coverimg">Cover Image</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="PromotionalVideo" className="art-section" data-reveal>
            <h2>Promotional Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad"
                title="Pandus Dispenser promotional video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="ProjectBackground" className="art-section" data-reveal>
            <h2>Project Background</h2>
            <p>Pandus was the first major project I undertook as a first-year student at Nanyang Polytechnic. The assignment was open-ended with no specific theme, and we were provided with various components including an Arduino Uno, a 4G servo, LEDs, buttons, sliding switches, an infrared collision detection module, and a bundle of wires. Initially I planned to create a water dispenser, but after discovering that someone else had already chosen that idea, I decided to pivot and develop a syrup dispenser instead.</p>
            <figure className="art-fig">
              <img src="/images/pandus-article-img1.webp" alt="Behind the scenes of how part of the video was filmed" loading="lazy" />
              <figcaption>BTS of how a part of the video was filmed</figcaption>
            </figure>
          </section>

          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>Design Process</h2>
            <p>Pandus was designed using Onshape. With limited prior experience, I spent a significant amount of time learning how to use the software effectively. Eventually I created the final design shown below, which I chose to proceed with for the project. Due to time constraints, I was not able to create any prototypes beforehand, so I took a leap of faith and sent the design straight to the 3D printer. Fortunately, everything fit perfectly on the first try. You can view a live preview of the model on Onshape.</p>
            <img src="/images/pandus2.webp" alt="Pandus 3D model in Onshape" loading="lazy" />
            <img src="/images/pandus3.webp" alt="Pandus 3D model exploded view" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Live 3D Model Preview</strong>
                <span>View the interactive Onshape model of the Pandus dispenser.</span>
              </div>
              <a className="hp-btn" href="https://cad.onshape.com/documents/5010f3da2be8b0cad10575b0/w/c1baff5b3751dfe2426baad4/e/d042961855d215532e28db65" target="_blank" rel="noopener">View on Onshape <Circle /></a>
            </div>
          </section>

          <section id="ControlnFunction" className="art-section" data-reveal>
            <h2>Control and Function</h2>
            <p>We were taught to code using Python and utilised the Firmata library to enable communication with the Arduino. Below are examples of the components and flowcharts illustrating how the system functioned. In addition to the components provided, I purchased high-powered LEDs, a DC pump, a relay board, and used a separate power bank to power the high-current components.</p>
            <p>Here is roughly how a single dispense plays out, from the moment a cup approaches to the door swinging shut again. Pick a level to run it yourself, or let the demo cycle through all three on its own.</p>

            <DispenseDemo />

            <img src="/images/pandus4.webp" alt="Component diagram" loading="lazy" />
            <img src="/images/pandus5.webp" alt="System flowchart part 1" loading="lazy" />
            <img src="/images/pandus6.webp" alt="System flowchart part 2" loading="lazy" />
            <img src="/images/pandus7.webp" alt="System flowchart part 3" loading="lazy" />
          </section>

          <section id="Coverimg" className="art-section" data-reveal>
            <h2>Cover Image</h2>
            <p>I was especially proud of how the cover image turned out. I captured four separate photos of Pandus under different lighting conditions and blended them together in Photoshop to create the final composition.</p>
            <figure className="art-fig">
              <video autoPlay loop muted playsInline>
                <source src="/images/pandus7.webm" type="video/webm" />
                <source src="/images/pandus7.mp4" type="video/mp4" />
              </video>
              <figcaption>An animation showing how it was created</figcaption>
            </figure>
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-pandus" />
    </main>
  );
}
