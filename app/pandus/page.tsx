import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';

export const metadata: Metadata = {
  title: 'Pandus Dispenser — Chiambucket',
  description: 'Project article: a 6-part 3D-printed water dispenser powered by an Arduino Uno and driven with PyFirmata.',
  alternates: { canonical: 'https://www.chiambucket.com/pandus' },
  openGraph: {
    title: 'Pandus Dispenser — Chiambucket',
    description: 'A 3D-printed water dispenser with Arduino Uno and PyFirmata.',
    url: 'https://www.chiambucket.com/pandus',
    type: 'article',
  },
};

export default function PandusPage() {
  return (
    <main>
      <ArticleScrollSpy />
      <div className="article-image"></div>
      <div className="article-content">
        <div className="article-fade"></div>
        <div className="article-body">
          <div className="article-chapters">
            <div className="article-chapters-ultimate-wrapper">
              <h2>Chapters</h2>
              <nav className="article-chapter-wrapper">
                <a href="#ProjectBackground">Project Background</a>
                <a href="#DesignProcess">Design Process</a>
                <a href="#ControlnFunction">Control and Function</a>
                <a href="#Coverimg">Cover Image</a>
              </nav>
            </div>
          </div>
          <div className="article-body-wrapper">
            <div className="article-header">
              <div className="pf-item-tag">
                <div className="pf-item-tag-school"><h5>School Project</h5></div>
              </div>
              <h1>Pandus Project</h1>
              <h3>Pandus was my first school project I worked on. It is made of of 6 different 3D printed components and Powered by an Arduino uno.</h3>
              <div className="pf-button-left-stack article-header-icons">
                <div className="icon-stack">
                  <img src="/images/resolve-icon.webp" alt="" />
                  <img src="/images/ps-pf-icon.webp" alt="" />
                  <img src="/images/powerpoint-icon.webp" alt="" />
                  <img src="/images/vscode-icon.webp" alt="" />
                  <img src="/images/onshape-icon.webp" alt="" />
                </div>
              </div>
            </div>
            <div className="article-real-body">
              <h2>Promotional Video</h2>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <section id="ProjectBackground" className="article-real-body">
              <h2>Project Background</h2>
              <p>Pandus was the first major project I undertook as a first-year student at Nanyang Polytechnic. The assignment was open-ended, with no specific theme, and we were provided with various components including an Arduino Uno, 4G servo, LEDs, buttons, sliding switches, an infrared collision detection module, and a bundle of wires. Initially, I planned to create a water dispenser, but after discovering that someone else had already chosen that idea, I decided to pivot and develop a syrup dispenser instead.</p>
              <img src="/images/pandus-article-img1.webp" alt="" loading="lazy" />
              <span>BTS of how a part of the video was filmed</span>
            </section>
            <section id="DesignProcess" className="article-real-body">
              <h2>Design process</h2>
              <p>Pandus was designed using Onshape. With limited prior experience, I spent a significant amount of time learning how to use the software effectively. Eventually, I created the final design shown below, which I chose to proceed with for the project. Due to time constraints, I wasn&apos;t able to create any prototypes beforehand, so I took a leap of faith and sent the design straight to the 3D printer. Fortunately, everything fit perfectly on the first try. CLICK <a href="https://cad.onshape.com/documents/5010f3da2be8b0cad10575b0/w/c1baff5b3751dfe2426baad4/e/d042961855d215532e28db65">HERE</a> FOR A LIVE PREVIEW OF THE MODEL</p>
              <img src="/images/pandus2.webp" alt="" loading="lazy" />
              <img src="/images/pandus3.webp" alt="" loading="lazy" />
            </section>
            <section id="ControlnFunction" className="article-real-body">
              <h2>Control and Function</h2>
              <p>We were taught to code using Python and utilized the Firmata library to enable communication with the Arduino. Below are examples of the components and flowcharts illustrating how the system functioned. In addition to the components provided, I purchased high-powered LEDs, a DC pump, a relay board, and used a separate power bank to power the high-current components.</p>
              <img src="/images/pandus4.webp" alt="" loading="lazy" />
              <img src="/images/pandus5.webp" alt="" loading="lazy" />
              <img src="/images/pandus6.webp" alt="" loading="lazy" />
              <img src="/images/pandus7.webp" alt="" loading="lazy" />
            </section>
            <section id="Coverimg" className="article-real-body">
              <h2>Cover Image</h2>
              <p>I was especially proud of how the cover image turned out. I captured four separate photos of Pandus under different lighting conditions and blended them together in Photoshop to create the final composition.</p>
              <video autoPlay loop muted playsInline>
                <source src="/images/pandus7.webm" type="video/webm" />
                <source src="/images/pandus7.mp4" type="video/mp4" />
              </video>
              <span>An animation on how it was created</span>
            </section>
            <div className="next-article">
              Check Out The Next Article
              <a href="/portfolio" className="pf-item-button">
                View Next Article
                <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
                  <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="article-balance"></div>
        </div>
      </div>
      <div className="article-bottom-fade"></div>
      <div className="article-bottom-fade2"></div>
    </main>
  );
}
