import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import CommandLink from './CommandLink';

export const metadata: Metadata = {
  title: 'Project June — Chiambucket',
  description: 'Project article: a 5G radio-controlled vehicle with 3 live video streams, GPS, sensors, and full telemetry, designed from enclosure to firmware.',
  alternates: { canonical: 'https://www.chiambucket.com/project-june' },
  openGraph: {
    title: 'Project June — Chiambucket',
    description: 'A 5G rover with 3 live video streams, GPS, sensors, and full telemetry.',
    url: 'https://www.chiambucket.com/project-june',
    type: 'article',
    images: [{ url: '/images/ProjJuneBanner1.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Project June',
  description: 'A 5G radio-controlled vehicle with 3 live video streams, GPS, a full sensor suite and MQTT telemetry, designed from enclosure to firmware in three weeks.',
  image: 'https://www.chiambucket.com/images/ProjJuneBanner1.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/project-june',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function ProjectJunePage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/ProjJuneBanner1.webp" alt="Project June, a 5G radio-controlled vehicle" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> All projects</a>
          <div className="art-tags">
            <span className="hp-md-tag highlight">Highlights</span>
            <span className="hp-md-tag personal">Personal Project</span>
          </div>
          <h1 className="art-title">Project <em>June</em></h1>
          <p className="art-lead">I want a Mars rover, and if I cannot buy one, I will build one myself. That&apos;s the motivation behind this project. The rover streams three live video feeds of its surroundings together with GPS data and sensor readings like temperature, humidity, pressure and brightness, helping the operator understand and navigate the terrain with confidence.</p>
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
              { type: 'github', label: 'GitHub', url: 'https://github.com/New-Kringster/ProjectJune' },
              { type: 'video', label: 'Watch the build', url: 'https://youtu.be/MnkJsx-nwoE' },
            ]}
          />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#Demo">Demo Video</a>
              <a href="#ProjectJune">Project June</a>
              <a href="#OnboardSys">Onboard Systems</a>
              <a href="#Ultras" className="sub">Ultrasonic Sensor</a>
              <a href="#Laser" className="sub">Laser System</a>
              <a href="#Gps" className="sub">Live GPS</a>
              <a href="#IMU" className="sub">10 Axis IMU</a>
              <a href="#Lightsensor" className="sub">Light Sensor</a>
              <a href="#Dht11" className="sub">DHT11 Temp &amp; Humidity</a>
              <a href="#TechArch">Technical Architecture</a>
              <a href="#Livestr">Live Stream System</a>
              <a href="#ctrlntelm">Control &amp; Telemetry</a>
              <a href="#Software">Software</a>
              <a href="#softD">Software Design (Figma)</a>
              <a href="#Driving">Driving Project June</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo Video</h2>
            <div className="art-video">
              <iframe src="https://www.youtube.com/embed/MnkJsx-nwoE?si=NvIvJadJ0R4rWWwO" title="Project June demo video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </section>

          <section id="ProjectJune" className="art-section" data-reveal>
            <h2>Project June</h2>
            <p>I planned to build Project June in two weeks, but it took me three. It was definitely rushed, and there are a lot of things I wish I had done differently. Even so, it is still one of the most ambitious projects I have worked on.</p>
            <figure className="art-fig">
              <img src="/images/ProjJune1.webp" alt="The original Project June rover" loading="lazy" />
              <figcaption>The original Project June photo</figcaption>
            </figure>
          </section>

          <section id="OnboardSys" className="art-section" data-reveal>
            <h2>Onboard Systems</h2>
            <img src="/images/ProjJune2.webp" alt="Project June onboard systems overview" loading="lazy" />
          </section>

          <section id="Ultras" className="art-section" data-reveal>
            <h2>Ultrasonic Distance Sensor</h2>
            <img src="/images/ProjJune3.webp" alt="Ultrasonic distance sensor" loading="lazy" />
            <video autoPlay loop muted playsInline>
              <source src="/images/ProjJune4.webm" type="video/webm" />
              <source src="/images/ProjJune4.mp4" type="video/mp4" />
            </video>
          </section>

          <section id="Laser" className="art-section" data-reveal>
            <h2>Laser System</h2>
            <img src="/images/ProjJune5.webp" alt="Laser system" loading="lazy" />
            <video autoPlay loop muted playsInline>
              <source src="/images/ProjJune6.webm" type="video/webm" />
              <source src="/images/ProjJune6.mp4" type="video/mp4" />
            </video>
          </section>

          <section id="Gps" className="art-section" data-reveal>
            <h2>Live GPS</h2>
            <img src="/images/ProjJune7.webp" alt="Live GPS module" loading="lazy" />
            <video autoPlay loop muted playsInline>
              <source src="/images/ProjJune8.webm" type="video/webm" />
              <source src="/images/ProjJune8.mp4" type="video/mp4" />
            </video>
          </section>

          <section id="IMU" className="art-section" data-reveal>
            <h2>10 Axis IMU</h2>
            <img src="/images/ProjJune9.webp" alt="10 axis IMU" loading="lazy" />
            <video autoPlay loop muted playsInline>
              <source src="/images/ProjJune10.webm" type="video/webm" />
              <source src="/images/ProjJune10.mp4" type="video/mp4" />
            </video>
          </section>

          <section id="Lightsensor" className="art-section" data-reveal>
            <h2>Light Sensor</h2>
            <img src="/images/ProjJune11.webp" alt="Light sensor" loading="lazy" />
          </section>

          <section id="Dht11" className="art-section" data-reveal>
            <h2>DHT11 Temp &amp; Humidity</h2>
            <img src="/images/ProjJune12.webp" alt="DHT11 temperature and humidity sensor" loading="lazy" />
          </section>

          <section id="TechArch" className="art-section" data-reveal>
            <h2>Technical Architecture</h2>
            <p>This is an overview of how each system functions and how they all interact with each other.</p>
            <img src="/images/ProjJuneArchi.webp" alt="System architecture diagram" loading="lazy" />
          </section>

          <section id="Livestr" className="art-section" data-reveal>
            <h2>Live Stream System</h2>
            <p>This diagram shows how the whole live streaming system works. It is 3 different WebRTC streams that send the live video to the client.</p>
            <p>Here is roughly what the operator&apos;s console looked like while driving: the same signal path, telemetry and camera feeds laid out for a glance.</p>
            <CommandLink />
            <img src="/images/ProjJune13.webp" alt="Live stream system diagram" loading="lazy" />
            <img src="/images/ProjJune16.webp" alt="WebRTC stream routing" loading="lazy" />
          </section>

          <section id="ctrlntelm" className="art-section" data-reveal>
            <h2>Control &amp; Telemetry System</h2>
            <p>The control and telemetry system feeds sensor data to the client using an MQTT topic that the client is subscribed to. Another MQTT topic is used by the client to send movement and command messages back to the ESP32.</p>
            <img src="/images/ProjJune14.webp" alt="Control and telemetry diagram" loading="lazy" />
            <h3>Signalling</h3>
            <p>Because of an issue that has not yet been resolved, all sensor data could not be sent together in a single MQTT transmission. Instead, the data was divided into three separate packets and transmitted individually at approximately 10 Hz.</p>
            <img src="/images/ProjJune15.webp" alt="Signalling packet diagram" loading="lazy" />
          </section>

          <section id="Software" className="art-section" data-reveal>
            <h2>Software</h2>
            <p>Here is the simplified flow chart of how the code works.</p>
            <img src="/images/ProjJune17.webp" alt="Software flow chart part 1" loading="lazy" />
            <img src="/images/ProjJune18.webp" alt="Software flow chart part 2" loading="lazy" />
          </section>

          <section id="softD" className="art-section" data-reveal>
            <h2>Software Design (Figma)</h2>
            <div className="art-embed">
              <iframe src="https://embed.figma.com/design/mcnJbSAA9XGrY8XuUzH60Y/Project-June?node-id=0-1&embed-host=share" title="Project June Figma design" allowFullScreen></iframe>
            </div>
            <h3>Spline 3D</h3>
            <p>I used Spline 3D for the 3D elements in the UI. When you push the controller forward, the model moves into the forward view, and if you move it back, it goes into the reverse view.</p>
            <figure className="art-fig">
              <img src="/images/ProjJune19.webp" alt="Spline 3D UI element" loading="lazy" />
              <figcaption>Spline 3D</figcaption>
            </figure>
            <figure className="art-fig">
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune20.webm" type="video/webm" />
                <source src="/images/ProjJune20.mp4" type="video/mp4" />
              </video>
              <figcaption>The live animation</figcaption>
            </figure>
          </section>

          <section id="Driving" className="art-section" data-reveal>
            <h2>Driving Project June</h2>
            <p>Driving Project June was an unforgettable experience. The roughly one-second delay between controller input and movement on the live feed, combined with the instability of the stream, made it challenging at times. Thinking about how my controller input had to travel through so many layers of systems, while the video feed was being sent from over 8 kilometres away, still blows my mind.</p>
            <video autoPlay loop muted playsInline>
              <source src="/images/ProjJune21.webm" type="video/webm" />
              <source src="/images/ProjJune21.mp4" type="video/mp4" />
            </video>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Project June on GitHub</strong>
                <span>A rover control system with WebRTC video streaming, MQTT telemetry, and ESP32 sensor integration.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/ProjectJune" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-june" />
    </main>
  );
}
