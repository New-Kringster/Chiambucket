import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LazyVideo from '../../components/LazyVideo';
import CommandLink from './CommandLink';

const DESCRIPTION =
  'A 5G rover I built in three weeks. An ESP32-S3 and three phones stream three live camera feeds, GPS and sensor readings to a web console I drive it from.';

export const metadata: Metadata = {
  title: 'Project June | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.chiambucket.com/project-june' },
  openGraph: {
    title: 'Project June | Braven Chiam',
    description: 'A 5G rover with three live camera feeds, GPS, sensors and MQTT telemetry.',
    url: 'https://www.chiambucket.com/project-june',
    type: 'article',
    images: [{ url: '/images/ProjJuneBanner1.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Project June',
  description: DESCRIPTION,
  image: 'https://www.chiambucket.com/images/ProjJuneBanner1.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/project-june',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const clip = (n: number) => ({
  webm: `/images/ProjJune${n}.webm`,
  mp4: `/images/ProjJune${n}.mp4`,
  poster: `/images/posters/projjune${n}.webp`,
});

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
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag personal">Personal project</span>
          </div>
          <h1 className="art-title">Project <em>June</em></h1>
          <p className="art-lead">A 5G rover I built because I wanted a Mars rover. It streams three live camera feeds, GPS and sensor readings (temperature, humidity, pressure, brightness) to a web console I drive it from.</p>
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
              <a href="#Demo">Demo</a>
              <a href="#ProjectJune">Overview</a>
              <a href="#OnboardSys">On board</a>
              <a href="#Ultras" className="sub">Ultrasonic sensor</a>
              <a href="#Laser" className="sub">Laser</a>
              <a href="#Gps" className="sub">GPS</a>
              <a href="#IMU" className="sub">10-axis IMU</a>
              <a href="#Lightsensor" className="sub">Light sensor</a>
              <a href="#Dht11" className="sub">DHT11</a>
              <a href="#TechArch">Architecture</a>
              <a href="#Livestr">Video</a>
              <a href="#ctrlntelm">Control and telemetry</a>
              <a href="#Software">Software</a>
              <a href="#softD">Console design</a>
              <a href="#Driving">Driving it</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <div className="art-video">
              <iframe src="https://www.youtube.com/embed/MnkJsx-nwoE?si=NvIvJadJ0R4rWWwO" title="Project June demo video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
          </section>

          <section id="ProjectJune" className="art-section" data-reveal>
            <h2>Overview</h2>
            <p>I planned two weeks for Project June and it took three. It was rushed and there is a lot I would do differently, but it is still one of the most ambitious things I have built.</p>
            <figure className="art-fig">
              <img src="/images/ProjJune1.webp" alt="The original Project June rover" loading="lazy" />
              <figcaption>The first photo of Project June</figcaption>
            </figure>
          </section>

          <section id="OnboardSys" className="art-section" data-reveal>
            <h2>On board</h2>
            <p>An ESP32-S3 reads the sensors, drives the motor and sends telemetry. Three phones on board give the rover its 5G hotspot and the front, left and right camera views. The DC motor runs through a MOSFET motor driver I built, and a 2S3P lithium-ion pack I made from three 2S packs extends the range. A power bank supplies the ESP32 and the phones.</p>
            <img src="/images/ProjJune2.webp" alt="Parts diagram of Project June: three phones, the ESP32-S3, sensors, motor driver, power bank and battery pack" loading="lazy" />
          </section>

          <section id="Ultras" className="art-section" data-reveal>
            <h2>Ultrasonic sensor</h2>
            <p>Mounted at the back. It tells me how far away obstacles behind the rover are.</p>
            <img src="/images/ProjJune3.webp" alt="The ultrasonic distance sensor and its console readout" loading="lazy" />
            <LazyVideo {...clip(4)} />
          </section>

          <section id="Laser" className="art-section" data-reveal>
            <h2>Laser</h2>
            <p>A laser diode on a 3G servo at the front. I can aim it up to 45° either way from the console.</p>
            <img src="/images/ProjJune5.webp" alt="The laser diode on its servo and its console control" loading="lazy" />
            <LazyVideo {...clip(6)} />
          </section>

          <section id="Gps" className="art-section" data-reveal>
            <h2>GPS</h2>
            <p>A Neo8M module gives the live position on the console map.</p>
            <img src="/images/ProjJune7.webp" alt="The Neo8M GPS module and the console map" loading="lazy" />
            <LazyVideo {...clip(8)} />
          </section>

          <section id="IMU" className="art-section" data-reveal>
            <h2>10-axis IMU</h2>
            <p>Accelerometer, gyroscope and barometer readings from one board. Its magnetometer went unused.</p>
            <img src="/images/ProjJune9.webp" alt="The 10-axis IMU board and its console readout" loading="lazy" />
            <LazyVideo {...clip(10)} />
          </section>

          <section id="Lightsensor" className="art-section" data-reveal>
            <h2>Light sensor</h2>
            <p>A TEMT6000. I could not calibrate it, so the console shows brightness in four steps: Dark, Ambient, Bright and VBright.</p>
            <img src="/images/ProjJune11.webp" alt="The TEMT6000 light sensor and its console readout" loading="lazy" />
          </section>

          <section id="Dht11" className="art-section" data-reveal>
            <h2>DHT11</h2>
            <p>Ambient temperature and humidity.</p>
            <img src="/images/ProjJune12.webp" alt="The DHT11 temperature and humidity sensor and its console readout" loading="lazy" />
          </section>

          <section id="TechArch" className="art-section" data-reveal>
            <h2>Architecture</h2>
            <p>The rover, the server and the client, and what runs between them.</p>
            <img src="/images/ProjJuneArchi.webp" alt="Architecture diagram: the rover with its sensors and three phones, a server running Mosquitto, a Node.js Socket.IO server and CoTURN, and the client console with an Xbox controller" loading="lazy" />
          </section>

          <section id="Livestr" className="art-section" data-reveal>
            <h2>Video</h2>
            <p>Each phone sends its camera as its own WebRTC stream, three in total, relayed through a TURN server so the video works over mobile data.</p>
            <p>Below is a rebuild of the console with footage from a day run and a night run. Select a stage of the signal path or a camera to look closer.</p>
            <CommandLink />
            <img src="/images/ProjJune13.webp" alt="Diagram of the live video system" loading="lazy" />
            <img src="/images/ProjJune16.webp" alt="Diagram of the WebRTC stream routing" loading="lazy" />
          </section>

          <section id="ctrlntelm" className="art-section" data-reveal>
            <h2>Control and telemetry</h2>
            <p>The ESP32 publishes sensor data to an MQTT topic the client subscribes to. The client sends movement and commands back to the ESP32 on a second topic.</p>
            <img src="/images/ProjJune14.webp" alt="Diagram of the control and telemetry system" loading="lazy" />
            <h3>Three packets</h3>
            <p>I could not get all the sensor data into one MQTT message, and I have not solved why yet. It goes out as three separate packets at about 10 Hz.</p>
            <img src="/images/ProjJune15.webp" alt="Diagram of the three telemetry packets" loading="lazy" />
          </section>

          <section id="Software" className="art-section" data-reveal>
            <h2>Software</h2>
            <p>A simplified flow chart of the code.</p>
            <img src="/images/ProjJune17.webp" alt="Software flow chart, part 1" loading="lazy" />
            <img src="/images/ProjJune18.webp" alt="Software flow chart, part 2" loading="lazy" />
          </section>

          <section id="softD" className="art-section" data-reveal>
            <h2>Console design</h2>
            <p>I designed the console in Figma.</p>
            <div className="art-embed">
              <iframe src="https://embed.figma.com/design/mcnJbSAA9XGrY8XuUzH60Y/Project-June?node-id=0-1&embed-host=share" title="Project June console design in Figma" loading="lazy" allowFullScreen></iframe>
            </div>
            <h3>Spline 3D</h3>
            <p>The 3D rover in the console is a Spline model. Push the controller forward and it moves to the forward view; pull back and it moves to the reverse view.</p>
            <figure className="art-fig">
              <img src="/images/ProjJune19.webp" alt="The Spline 3D rover model" loading="lazy" />
              <figcaption>The Spline model</figcaption>
            </figure>
            <figure className="art-fig">
              <LazyVideo {...clip(20)} />
              <figcaption>The view change in the console</figcaption>
            </figure>
          </section>

          <section id="Driving" className="art-section" data-reveal>
            <h2>Driving it</h2>
            <p>There was about one second of delay between a controller input and the movement on the live feed, and the stream was not always stable, so driving was hard at times. The video was coming from over 8 km away, through every layer of the system.</p>
            <LazyVideo {...clip(21)} />
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>Project June on GitHub</strong>
                <span>The console, WebRTC video, MQTT telemetry and ESP32 firmware.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/ProjectJune" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          <div className="art-next">
            <span className="art-next-label">More projects</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-june" />
    </main>
  );
}
