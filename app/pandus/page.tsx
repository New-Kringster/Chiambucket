import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import LazyVideo from '../../components/LazyVideo';
import DispenseDemo from './DispenseDemo';

const DESCRIPTION =
  'My first school project at Nanyang Polytechnic: a syrup dispenser made of six 3D-printed parts, run by an Arduino Uno from Python with PyFirmata.';

export const metadata: Metadata = {
  title: 'Pandus Dispenser | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.chiambucket.com/pandus' },
  openGraph: {
    title: 'Pandus Dispenser | Braven Chiam',
    description: 'A syrup dispenser made of six 3D-printed parts, run by an Arduino Uno with PyFirmata.',
    url: 'https://www.chiambucket.com/pandus',
    type: 'article',
    images: [{ url: '/images/pandusarticle.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pandus Dispenser',
  description: DESCRIPTION,
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
            <span className="hp-md-tag school">School project</span>
          </div>
          <h1 className="art-title">Pandus <em>Dispenser</em></h1>
          <p className="art-lead">My first school project: a syrup dispenser made of six 3D-printed parts and run by an Arduino Uno. I built it from the parts we were given in class plus a few I bought.</p>
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
              <a href="#PromotionalVideo">Video</a>
              <a href="#ProjectBackground">Background</a>
              <a href="#DesignProcess">Design</a>
              <a href="#ControlnFunction">Control</a>
              <a href="#Coverimg">Cover image</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="PromotionalVideo" className="art-section" data-reveal>
            <h2>Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad"
                title="Pandus Dispenser video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          <section id="ProjectBackground" className="art-section" data-reveal>
            <h2>Background</h2>
            <p>Pandus was my first major project as a first-year student at Nanyang Polytechnic. The brief was open, with no theme. We were given an Arduino Uno, a 4G servo, LEDs, buttons, sliding switches, an infrared collision detection module and a bundle of wires.</p>
            <p>I planned a water dispenser, but someone else had already chosen that, so I made a syrup dispenser instead.</p>
            <figure className="art-fig">
              <img src="/images/pandus-article-img1.webp" alt="Filming part of the Pandus video" loading="lazy" />
              <figcaption>Filming part of the video</figcaption>
            </figure>
          </section>

          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>Design</h2>
            <p>I designed Pandus in Onshape. I had little experience with it, so learning the software took a lot of the time. There was no time left for prototypes, so I sent the final design straight to the 3D printer, and every part fit on the first print.</p>
            <img src="/images/pandus2.webp" alt="Exploded view of the Pandus model in Onshape" loading="lazy" />
            <img src="/images/pandus3.webp" alt="The assembled Pandus model in Onshape" loading="lazy" />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>3D model</strong>
                <span>The Pandus model in Onshape, which you can rotate and take apart.</span>
              </div>
              <a className="hp-btn" href="https://cad.onshape.com/documents/5010f3da2be8b0cad10575b0/w/c1baff5b3751dfe2426baad4/e/d042961855d215532e28db65" target="_blank" rel="noopener">View on Onshape <Circle /></a>
            </div>
          </section>

          <section id="ControlnFunction" className="art-section" data-reveal>
            <h2>Control</h2>
            <p>We were taught to program the Arduino from Python with the Firmata library. On top of the class parts I bought high-power LEDs, a DC pump and a relay board, and used a separate power bank for the high-current parts.</p>
            <p>The demo below runs one dispense cycle from the flow chart further down. Pick a level to run it yourself.</p>

            <DispenseDemo />

            <img src="/images/pandus4.webp" alt="Flow chart: the infrared sensor opens the servo and lights the LED, select sets the level, confirm runs the pump for 3, 4 or 5 seconds" loading="lazy" />
            <img src="/images/pandus5.webp" alt="Circuit diagram: Arduino Uno, servo, infrared sensor, relays, DC pump, high-power LED, buzzer, buttons and indicator LEDs" loading="lazy" />
            <img src="/images/pandus6.webp" alt="The wiring inside Pandus: relay board, buttons and indicator LEDs" loading="lazy" />
            <img src="/images/pandus7.webp" alt="The breadboard, buzzer and Arduino Uno inside Pandus" loading="lazy" />
          </section>

          <section id="Coverimg" className="art-section" data-reveal>
            <h2>Cover image</h2>
            <p>I photographed Pandus four times under different lighting and blended the four shots in Photoshop to make the cover.</p>
            <figure className="art-fig">
              <LazyVideo webm="/images/pandus7.webm" mp4="/images/pandus7.mp4" poster="/images/posters/pandus7.webp" />
              <figcaption>How the four photos combine into the cover</figcaption>
            </figure>
          </section>

          <div className="art-next">
            <span className="art-next-label">More projects</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-pandus" />
    </main>
  );
}
