import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';

export const metadata: Metadata = {
  title: 'EMA Smart Home System — Chiambucket',
  description: 'Project article: a multi-node smart-home system on BeagleBone Black, Python and SocketIO, with a live 3D dashboard.',
  alternates: { canonical: 'https://www.chiambucket.com/csdp' },
  openGraph: {
    title: 'EMA Smart Home System — Chiambucket',
    description: 'A multi-node smart-home system on BeagleBone Black with a live Spline 3D dashboard.',
    url: 'https://www.chiambucket.com/csdp',
    type: 'article',
  },
};

export default function CsdpPage() {
  return (
    <main>
      <ArticleScrollSpy />
      <div className="article-csdp-image"></div>
      <div className="article-content">
        <div className="article-fade"></div>
        <div className="article-body">
          <div className="article-chapters">
            <div className="article-chapters-ultimate-wrapper">
              <h2>Chapters</h2>
              <nav className="article-chapter-wrapper">
                <a href="#ProjBackground">Project Background</a>
                <a href="#DesignProcess">Design Process</a>
                <a href="#Climate">- Climate Node</a>
                <a href="#Bathroom">- Bathroom Node</a>
                <a href="#Kitchen">- Kitchen Node</a>
                <a href="#Intrusion">- Intrusion Node</a>
                <a href="#Connectivity">Connectivity</a>
                <a href="#SlideDeck">Slide Deck</a>
                <a href="#Documentation">Documentation</a>
              </nav>
            </div>
          </div>
          <div className="article-body-wrapper">
            <div className="article-header">
              <div className="pf-item-tag">
                <div className="pf-item-tag-school"><h5>School Project</h5></div>
              </div>
              <h1>EMA Smart home system</h1>
              <h3>The EMA smart home system was the most complex group project I have worked on, requiring us to apply concepts and skills learned across multiple courses. Our team was awarded an &quot;A&quot; for the project.</h3>
              <div className="pf-button-left-stack article-header-icons">
                <div className="icon-stack">
                  <img src="/images/resolve-icon.webp" alt="" />
                  <img src="/images/ps-pf-icon.webp" alt="" />
                  <img src="/images/powerpoint-icon.webp" alt="" />
                  <img src="/images/vscode-icon.webp" alt="" />
                  <img src="/images/onshape-icon.webp" alt="" />
                  <img src="/images/figma-icon.webp" alt="" />
                </div>
              </div>
            </div>
            <div className="article-real-body article-no-style" style={{ marginTop: '3vh' }}>
              <div className="team-members">
                <h3>Team Members</h3>
                <div className="team-members-member">
                  <div className="team-members-left">
                    <div className="team-members-profile tyr-profile"></div>
                    <div className="team-members-title">
                      <h3>Tan Yong Rui</h3>
                      <p>Team Leader, Docs, Code</p>
                    </div>
                  </div>
                  <a target="_blank" rel="noopener" href="https://tanyongrui11.framer.website/project/www-pentaclay-com" className="team-members-right">
                    <h2>View Profile</h2>
                    <img src="/images/fwd-arrow.svg" alt="" />
                  </a>
                </div>
                <div className="team-members-member">
                  <div className="team-members-left">
                    <div className="team-members-profile braven-profile"></div>
                    <div className="team-members-title">
                      <h3>Braven (me)</h3>
                      <p>Art, Code, Design</p>
                    </div>
                  </div>
                  <a target="_blank" rel="noopener" href="/" className="team-members-right">
                    <h2>View Profile</h2>
                    <img src="/images/fwd-arrow.svg" alt="" />
                  </a>
                </div>
                <div className="team-members-member">
                  <div className="team-members-left">
                    <div className="team-members-profile zx-profile"></div>
                    <div className="team-members-title">
                      <h3>Ong Zheng Xian</h3>
                      <p>Docs, Code</p>
                    </div>
                  </div>
                  <a target="_blank" rel="noopener" href="https://www.ongkian.com" className="team-members-right">
                    <h2>View Profile</h2>
                    <img src="/images/fwd-arrow.svg" alt="" />
                  </a>
                </div>
                <div className="team-members-member">
                  <div className="team-members-left">
                    <div className="team-members-profile jyc-profile"></div>
                    <div className="team-members-title">
                      <h3>Joycelyn Wong</h3>
                      <p>Docs, Code</p>
                    </div>
                  </div>
                  <a target="_blank" rel="noopener" href="https://joycelynwong.framer.website/projects/ema" className="team-members-right">
                    <h2>View Profile</h2>
                    <img src="/images/fwd-arrow.svg" alt="" />
                  </a>
                </div>
                <div className="team-members-member">
                  <div className="team-members-left">
                    <div className="team-members-profile"></div>
                    <div className="team-members-title">
                      <h3>Benjamin Lee</h3>
                      <p>Team Member</p>
                    </div>
                  </div>
                  <a target="_blank" rel="noopener" href="#" className="team-members-right team-members-right-disabled">
                    <h2>No Profile</h2>
                  </a>
                </div>
              </div>
            </div>
            <div className="article-real-body">
              <h2>Promotional Video</h2>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/PFhsRaakJAs?si=t2kIXeFsMyZwU73l" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <section id="ProjBackground" className="article-real-body">
              <h2>Project Background</h2>
              <p>Given four BeagleBone Black Wireless boards and a selection of MikroBUS click modules, we were challenged to create a Wi-Fi connected system that supports sustainable living. Our solution was a smart home system that monitors energy usage in real time and intelligently controls devices to minimize consumption. To further extend its capabilities, we integrated an intrusion-detection node into the system.</p>
              <img src="/images/csdp1.webp" alt="" loading="lazy" />
              <span>Intended placement of each board within a home</span>
            </section>
            <section id="DesignProcess" className="article-real-body">
              <h2>Design process</h2>
              <p>As a software-driven project, we focused on user interface design, prioritizing clarity, readability, and efficient communication of information. We also added Spline3D into the final design for more clarity. <a href="https://csdpdemo.chiambucket.com">DEMO PAGE</a></p>
              <img src="/images/csdp2.webp" alt="" loading="lazy" />
              <span>Figma mockup of the UI that was used</span>
              <video autoPlay loop muted playsInline>
                <source src="/images/csdp3.webm" type="video/webm" />
                <source src="/images/csdp3.mp4" type="video/mp4" />
              </video>
              <span>Screenshot of the final UI that was made</span>
              <video autoPlay loop muted playsInline>
                <source src="/images/csdp4.webm" type="video/webm" />
                <source src="/images/csdp4.mp4" type="video/mp4" />
              </video>
              <span>Live visualisation of actions using Spline3D</span>
            </section>
            <section id="Climate" className="article-real-body">
              <h2>Climate Node</h2>
              <p>The climate node monitors for temperature, humidity and the presence of humans, it toggles the fan on only when a person is detected and the environment is warm and humid</p>
              <img src="/images/csdp5.webp" alt="" loading="lazy" />
            </section>
            <section id="Bathroom" className="article-real-body">
              <h2>Bathroom Node</h2>
              <p>The bathroom node allows you to set a timer for how long you would want to shower for, using the buttons and display. It automatically starts when it detects you entering the shower. A buzzer is sounded when your time is up</p>
              <img src="/images/csdp6.webp" alt="" loading="lazy" />
            </section>
            <section id="Kitchen" className="article-real-body">
              <h2>Kitchen Node</h2>
              <p>The kitchen node monitors energy usage from the fridge and reports an energy score on the dashboard, It also functions as a fire alarm, the alarm sounds across all nodes if there is an uncontrolled fire detected.</p>
              <img src="/images/csdp7.webp" alt="" loading="lazy" />
            </section>
            <section id="Intrusion" className="article-real-body">
              <h2>Intrusion Node</h2>
              <p>The intrusion node detects for door knocks and the opening of the door at unusual times and starts an alarm across all nodes</p>
              <img src="/images/csdp8.webp" alt="" loading="lazy" />
            </section>
            <section id="Connectivity" className="article-real-body">
              <h2>Connectivity</h2>
              <p>Each board connects to a SocketIO web server which hosts the dashboard and coordinates events and alarms too.</p>
              <img src="/images/csdp9.webp" alt="" loading="lazy" />
              <span>A chart of how each system connects with each other</span>
            </section>
            <section id="SlideDeck" className="article-real-body side-bar-scroll">
              <h2>Slide Deck</h2>
              <object data="/downloadable/csdpf1.pdf" type="application/pdf" width="100%" height="100%">
                <p>Alt link <a href="/downloadable/csdpf1.pdf">to the PDF!</a></p>
              </object>
            </section>
            <section id="Documentation" className="article-real-body side-bar-scroll">
              <h2>Documentation</h2>
              <object data="/downloadable/csdpf2.pdf" type="application/pdf" width="100%" height="100%">
                <p>Alt link <a href="/downloadable/csdpf2.pdf">to the PDF!</a></p>
              </object>
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
