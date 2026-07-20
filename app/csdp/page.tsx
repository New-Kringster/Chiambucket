import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import NodeMap from './NodeMap';

export const metadata: Metadata = {
  title: 'EMA Smart Home System — Chiambucket',
  description: 'Project article: a multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live 3D dashboard.',
  alternates: { canonical: 'https://www.chiambucket.com/csdp' },
  openGraph: {
    title: 'EMA Smart Home System — Chiambucket',
    description: 'A multi-node smart-home system on BeagleBone Black with a live Spline 3D dashboard.',
    url: 'https://www.chiambucket.com/csdp',
    type: 'article',
    images: [{ url: '/images/Ema-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'EMA Smart Home System',
  description: 'A multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live Spline 3D dashboard. Awarded an A grade.',
  image: 'https://www.chiambucket.com/images/Ema-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/csdp',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function CsdpPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />
      {/* Sub-chapters must not consume the rail's channel index (keeps mains at 01..07) */}

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/Ema-pf-context.webp" alt="EMA Smart Home System" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School Project</span>
          </div>
          <h1 className="art-title">EMA Smart <em>Home</em></h1>
          <p className="art-lead">The EMA smart home system was the most complex group project I have worked on, requiring us to apply concepts and skills learned across multiple courses. Our team was awarded an &ldquo;A&rdquo; for the project.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
              <img src="/images/vscode-icon.webp" alt="VS Code" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
              <img src="/images/figma-icon.webp" alt="Figma" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'demo', label: 'Live demo', url: 'https://csdpdemo.chiambucket.com' },
              { type: 'github', label: 'GitHub', url: 'https://github.com/New-Kringster/EMA-Smart-home-System' },
              { type: 'video', label: 'Demo video', url: 'https://youtu.be/PFhsRaakJAs' },
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
              <a href="#PromoVideo">Promotional Video</a>
              <a href="#Team">Team</a>
              <a href="#ProjBackground">Project Background</a>
              <a href="#DesignProcess">Design Process</a>
              <a href="#Climate" className="sub">Climate Node</a>
              <a href="#Bathroom" className="sub">Bathroom Node</a>
              <a href="#Kitchen" className="sub">Kitchen Node</a>
              <a href="#Intrusion" className="sub">Intrusion Node</a>
              <a href="#Connectivity">Connectivity</a>
              <a href="#SlideDeck">Slide Deck</a>
              <a href="#Documentation">Documentation</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          {/* Promotional Video */}
          <section id="PromoVideo" className="art-section" data-reveal>
            <h2>Promotional Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/PFhsRaakJAs?si=t2kIXeFsMyZwU73l"
                title="EMA Smart Home System promotional video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* Team */}
          <section id="Team" className="art-section" data-reveal>
            <h2>Team</h2>
            <div className="art-team">
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar tyr-profile"></div>
                  <div>
                    <b>Tan Yong Rui</b>
                    <span>Team Leader, Docs, Code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://tanyongrui11.framer.website/project/www-pentaclay-com"
                  target="_blank"
                  rel="noopener"
                >
                  View Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar braven-profile"></div>
                  <div>
                    <b>Braven (me)</b>
                    <span>Art, Code, Design</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="/"
                  target="_blank"
                  rel="noopener"
                >
                  View Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar zx-profile"></div>
                  <div>
                    <b>Ong Zheng Xian</b>
                    <span>Docs, Code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://www.ongkian.com"
                  target="_blank"
                  rel="noopener"
                >
                  View Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar jyc-profile"></div>
                  <div>
                    <b>Joycelyn Wong</b>
                    <span>Docs, Code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://joycelynwong.framer.website/projects/ema"
                  target="_blank"
                  rel="noopener"
                >
                  View Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar"></div>
                  <div>
                    <b>Benjamin Lee</b>
                    <span>Team Member</span>
                  </div>
                </div>
                <span className="art-team-link is-disabled">No Profile</span>
              </div>
            </div>
          </section>

          {/* Project Background */}
          <section id="ProjBackground" className="art-section" data-reveal>
            <h2>Project Background</h2>
            <p>Given four BeagleBone Black Wireless boards and a selection of MikroBUS click modules, we were challenged to create a Wi-Fi connected system that supports sustainable living. Our solution was a smart home system that monitors energy usage in real time and intelligently controls devices to minimize consumption. To further extend its capabilities, we integrated an intrusion-detection node into the system.</p>
            <figure className="art-fig">
              <img src="/images/csdp1.webp" alt="Intended placement of each board within a home" loading="lazy" />
              <figcaption>Intended placement of each board within a home</figcaption>
            </figure>
          </section>

          {/* Design Process */}
          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>Design Process</h2>
            <p>As a software-driven project, we focused on user interface design, prioritizing clarity, readability, and efficient communication of information. We also added Spline3D into the final design for more clarity. <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">DEMO PAGE</a></p>
            <figure className="art-fig">
              <img src="/images/csdp2.webp" alt="Figma mockup of the UI that was used" loading="lazy" />
              <figcaption>Figma mockup of the UI that was used</figcaption>
            </figure>
            <figure className="art-fig">
              <video autoPlay loop muted playsInline>
                <source src="/images/csdp3.webm" type="video/webm" />
                <source src="/images/csdp3.mp4" type="video/mp4" />
              </video>
              <figcaption>Screenshot of the final UI that was made</figcaption>
            </figure>
            <figure className="art-fig">
              <video autoPlay loop muted playsInline>
                <source src="/images/csdp4.webm" type="video/webm" />
                <source src="/images/csdp4.mp4" type="video/mp4" />
              </video>
              <figcaption>Live visualisation of actions using Spline3D</figcaption>
            </figure>
          </section>

          {/* Climate Node */}
          <section id="Climate" className="art-section" data-reveal>
            <h2>Climate Node</h2>
            <p>The climate node monitors for temperature, humidity and the presence of humans, it toggles the fan on only when a person is detected and the environment is warm and humid</p>
            <img src="/images/csdp5.webp" alt="Climate node hardware" loading="lazy" />
          </section>

          {/* Bathroom Node */}
          <section id="Bathroom" className="art-section" data-reveal>
            <h2>Bathroom Node</h2>
            <p>The bathroom node allows you to set a timer for how long you would want to shower for, using the buttons and display. It automatically starts when it detects you entering the shower. A buzzer is sounded when your time is up</p>
            <img src="/images/csdp6.webp" alt="Bathroom node hardware" loading="lazy" />
          </section>

          {/* Kitchen Node */}
          <section id="Kitchen" className="art-section" data-reveal>
            <h2>Kitchen Node</h2>
            <p>The kitchen node monitors energy usage from the fridge and reports an energy score on the dashboard, It also functions as a fire alarm, the alarm sounds across all nodes if there is an uncontrolled fire detected.</p>
            <img src="/images/csdp7.webp" alt="Kitchen node hardware" loading="lazy" />
          </section>

          {/* Intrusion Node */}
          <section id="Intrusion" className="art-section" data-reveal>
            <h2>Intrusion Node</h2>
            <p>The intrusion node detects for door knocks and the opening of the door at unusual times and starts an alarm across all nodes</p>
            <img src="/images/csdp8.webp" alt="Intrusion node hardware" loading="lazy" />
          </section>

          {/* Connectivity */}
          <section id="Connectivity" className="art-section" data-reveal>
            <h2>Connectivity</h2>
            <p>Each board connects to a SocketIO web server which hosts the dashboard and coordinates events and alarms too.</p>
            <p>Here is that mesh laid out as a hub and spokes, the BeagleBone controller in the middle with a live link out to each of the five nodes. Click a node to inspect it, or trigger the flame alarm to watch an alert race down the line.</p>
            <NodeMap />
            <figure className="art-fig">
              <img src="/images/csdp9.webp" alt="A chart of how each system connects with each other" loading="lazy" />
              <figcaption>A chart of how each system connects with each other</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>EMA Smart Home on GitHub</strong>
                <span>The full source for the node firmware and SocketIO dashboard server.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/EMA-Smart-home-System" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          {/* Slide Deck */}
          <section id="SlideDeck" className="art-section" data-reveal>
            <h2>Slide Deck</h2>
            <div className="art-embed art-pdf">
              <object data="https://content.chiambucket.com/downloadable/csdpf1.pdf" type="application/pdf">
                <p>Alt link <a href="https://content.chiambucket.com/downloadable/csdpf1.pdf">to the PDF!</a></p>
              </object>
            </div>
          </section>

          {/* Documentation */}
          <section id="Documentation" className="art-section" data-reveal>
            <h2>Documentation</h2>
            <div className="art-embed art-pdf">
              <object data="https://content.chiambucket.com/downloadable/csdpf2.pdf" type="application/pdf">
                <p>Alt link <a href="https://content.chiambucket.com/downloadable/csdpf2.pdf">to the PDF!</a></p>
              </object>
            </div>
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-ema" />
    </main>
  );
}
