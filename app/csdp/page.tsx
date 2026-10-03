import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import LazyVideo from '../../components/LazyVideo';
import NodeMap from './NodeMap';

const DESCRIPTION =
  'A school group project, graded A: four BeagleBone Black Wireless nodes (climate, bathroom, kitchen, intrusion) linked to a SocketIO web server that hosts a live dashboard with a Spline 3D view.';

export const metadata: Metadata = {
  title: 'EMA Smart Home | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.chiambucket.com/csdp' },
  openGraph: {
    title: 'EMA Smart Home | Braven Chiam',
    description: DESCRIPTION,
    url: 'https://www.chiambucket.com/csdp',
    type: 'article',
    images: [{ url: '/images/Ema-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'EMA Smart Home',
  description: DESCRIPTION,
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

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/Ema-pf-context.webp" alt="EMA Smart Home" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School project, team of five</span>
          </div>
          <h1 className="art-title">EMA Smart <em>Home</em></h1>
          <p className="art-lead">A smart home system on four BeagleBone Black Wireless boards, built to cut energy use. It was the most complex group project I have worked on and drew on several of our courses. We got an A.</p>
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
              { type: 'video', label: 'Promo video', url: 'https://youtu.be/PFhsRaakJAs' },
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
              <a href="#PromoVideo">Video</a>
              <a href="#Team">Team</a>
              <a href="#ProjBackground">Brief</a>
              <a href="#DesignProcess">Dashboard</a>
              <a href="#Climate" className="sub">Climate node</a>
              <a href="#Bathroom" className="sub">Bathroom node</a>
              <a href="#Kitchen" className="sub">Kitchen node</a>
              <a href="#Intrusion" className="sub">Intrusion node</a>
              <a href="#Connectivity">Connectivity</a>
              <a href="#SlideDeck">Slide deck</a>
              <a href="#Documentation">Documentation</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          <section id="PromoVideo" className="art-section" data-reveal>
            <h2>Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/PFhsRaakJAs?si=t2kIXeFsMyZwU73l"
                title="EMA Smart Home promotional video"
                loading="lazy"
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
                    <span>Team lead, docs, code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://tanyongrui11.framer.website/project/www-pentaclay-com"
                  target="_blank"
                  rel="noopener"
                >
                  Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar braven-profile"></div>
                  <div>
                    <b>Braven Chiam (me)</b>
                    <span>Art, code, design</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="/"
                  target="_blank"
                  rel="noopener"
                >
                  Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar zx-profile"></div>
                  <div>
                    <b>Ong Zheng Xian</b>
                    <span>Docs, code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://www.ongkian.com"
                  target="_blank"
                  rel="noopener"
                >
                  Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar jyc-profile"></div>
                  <div>
                    <b>Joycelyn Wong</b>
                    <span>Docs, code</span>
                  </div>
                </div>
                <a
                  className="art-team-link"
                  href="https://joycelynwong.framer.website/projects/ema"
                  target="_blank"
                  rel="noopener"
                >
                  Profile <img src="/images/fwd-arrow.svg" alt="" />
                </a>
              </div>

              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar"></div>
                  <div>
                    <b>Benjamin Lee</b>
                    <span>Team member</span>
                  </div>
                </div>
                <span className="art-team-link is-disabled">No profile</span>
              </div>
            </div>
          </section>

          <section id="ProjBackground" className="art-section" data-reveal>
            <h2>Brief</h2>
            <p>We were given four BeagleBone Black Wireless boards and a set of MikroBUS click modules, and asked to build a Wi-Fi connected system that supports sustainable living. We built a smart home system that monitors energy use in real time and switches devices to cut consumption, then added an intrusion-detection node.</p>
            <figure className="art-fig">
              <img src="/images/csdp1.webp" alt="Where each board sits in the home" loading="lazy" />
              <figcaption>Where each board sits in the home</figcaption>
            </figure>
          </section>

          <section id="DesignProcess" className="art-section" data-reveal>
            <h2>Dashboard</h2>
            <p>Most of the project was software, so the design work went into the dashboard: clear, readable, and quick to take in. We added a Spline 3D model of the home that shows each action as it happens. Try the <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">live demo</a>.</p>
            <figure className="art-fig">
              <img src="/images/csdp2.webp" alt="Figma mockup of the dashboard" loading="lazy" />
              <figcaption>Figma mockup of the dashboard</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo webm="/images/csdp3.webm" mp4="/images/csdp3.mp4" poster="/images/posters/csdp3.webp" />
              <figcaption>The finished dashboard</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo webm="/images/csdp4.webm" mp4="/images/csdp4.mp4" poster="/images/posters/csdp4.webp" />
              <figcaption>The Spline 3D view showing actions live</figcaption>
            </figure>
          </section>

          <section id="Climate" className="art-section" data-reveal>
            <h2>Climate node</h2>
            <p>Monitors temperature, humidity and whether someone is in the room. The fan turns on only when a person is detected and the room is warm and humid.</p>
            <img src="/images/csdp5.webp" alt="Climate node hardware" loading="lazy" />
          </section>

          <section id="Bathroom" className="art-section" data-reveal>
            <h2>Bathroom node</h2>
            <p>You set how long you want to shower for with the buttons and display. The timer starts when it detects you entering the shower, and a buzzer sounds when time is up.</p>
            <img src="/images/csdp6.webp" alt="Bathroom node hardware" loading="lazy" />
          </section>

          <section id="Kitchen" className="art-section" data-reveal>
            <h2>Kitchen node</h2>
            <p>Monitors the fridge&rsquo;s energy use and reports an energy score to the dashboard. It is also the fire alarm: if it detects an uncontrolled fire, the alarm sounds on every node.</p>
            <img src="/images/csdp7.webp" alt="Kitchen node hardware" loading="lazy" />
          </section>

          <section id="Intrusion" className="art-section" data-reveal>
            <h2>Intrusion node</h2>
            <p>Detects knocks on the door, and the door opening at unusual times, and sounds an alarm on every node.</p>
            <img src="/images/csdp8.webp" alt="Intrusion node hardware" loading="lazy" />
          </section>

          <section id="Connectivity" className="art-section" data-reveal>
            <h2>Connectivity</h2>
            <p>Each board connects to a SocketIO web server, which hosts the dashboard and coordinates events and alarms between the nodes.</p>
            <p>The map below shows the four nodes and the server. Select a node to see what it does, or simulate a kitchen fire to see the alarm reach every node.</p>
            <NodeMap />
            <figure className="art-fig">
              <img src="/images/csdp9.webp" alt="Diagram of how the nodes, server and dashboard connect" loading="lazy" />
              <figcaption>How the nodes, server and dashboard connect</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Source on GitHub</strong>
                <span>The node code and the SocketIO dashboard server.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/EMA-Smart-home-System" target="_blank" rel="noopener">View on GitHub <Circle /></a>
            </div>
          </section>

          <section id="SlideDeck" className="art-section" data-reveal>
            <h2>Slide deck</h2>
            <div className="art-embed art-pdf">
              <iframe src="https://content.chiambucket.com/downloadable/csdpf1.pdf" title="EMA Smart Home slide deck (PDF)" loading="lazy"></iframe>
            </div>
            <p><a href="https://content.chiambucket.com/downloadable/csdpf1.pdf" target="_blank" rel="noopener">Open the slide deck (PDF)</a></p>
          </section>

          <section id="Documentation" className="art-section" data-reveal>
            <h2>Documentation</h2>
            <div className="art-embed art-pdf">
              <iframe src="https://content.chiambucket.com/downloadable/csdpf2.pdf" title="EMA Smart Home documentation (PDF)" loading="lazy"></iframe>
            </div>
            <p><a href="https://content.chiambucket.com/downloadable/csdpf2.pdf" target="_blank" rel="noopener">Open the documentation (PDF)</a></p>
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
