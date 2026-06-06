import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';

export const metadata: Metadata = {
  title: 'Project June — Chiambucket',
  description: 'Project article: a 5G radio-controlled vehicle with 3 live video streams, GPS, sensors, and full telemetry, designed from enclosure to firmware.',
  alternates: { canonical: 'https://www.chiambucket.com/project-june' },
  openGraph: {
    title: 'Project June — Chiambucket',
    description: 'A 5G rover with 3 live video streams, GPS, sensors, and full telemetry.',
    url: 'https://www.chiambucket.com/project-june',
    type: 'article',
  },
};

export default function ProjectJunePage() {
  return (
    <main>
      <ArticleScrollSpy />
      <div className="article-ProjJune-image"></div>
      <div className="article-content">
        <div className="article-fade"></div>
        <div className="article-body">
          <div className="article-chapters">
            <div className="article-chapters-ultimate-wrapper">
              <h2>Chapters</h2>
              <nav className="article-chapter-wrapper">
                <a href="#ProjectJune">Project June</a>
                <a href="#OnboardSys">Onboard Systems</a>
                <a href="#Ultras">- Ultrasonic Distance Sensor</a>
                <a href="#Laser">- Laser System</a>
                <a href="#Gps">- Live GPS</a>
                <a href="#IMU">- 10 Axis IMU</a>
                <a href="#Lightsensor">- Light Sensor</a>
                <a href="#Dht11">- DHT11 Temp &amp; humidity</a>
                <a href="#TechArch">Technical Architecture</a>
                <a href="#Livestr">Live Steam System</a>
                <a href="#ctrlntelm">Control &amp; Telemetry System</a>
                <a href="#Software">Software</a>
                <a href="#softD">Software Design (Figma)</a>
                <a href="#Driving">Driving Project June</a>
              </nav>
            </div>
          </div>
          <div className="article-body-wrapper">
            <div className="article-header">
              <div className="pf-item-tag">
                <div className="pf-item-tag-personal-best"><h5>Highlights</h5></div>
                <div className="pf-item-tag-personal"><h5>Personal Project</h5></div>
              </div>
              <h1 style={{ fontSize: '72px' }} className="Project-june-special-title">Project June</h1>
              <h3>I want a Mars rover, and if I cannot buy one, I will build one myself. That&apos;s the motivation behind this project. The rover streams three live video feeds of its surroundings together with GPS data and sensor readings like temperature, humidity, pressure, brightness, and more, helping the operator understand and navigate the terrain with confidence.</h3>
              <div className="pf-button-left-stack article-header-icons">
                <div className="icon-stack">
                  <img src="/images/ps-pf-icon.webp" alt="" />
                  <img src="/images/vscode-icon.webp" alt="" />
                  <img src="/images/onshape-icon.webp" alt="" />
                  <img src="/images/Kicad-icon.webp" alt="" />
                  <img src="/images/esp-icon.webp" alt="" />
                  <img src="/images/PlatformIO-icon.webp" alt="" />
                </div>
              </div>
            </div>
            <div className="article-real-body">
              <h2>Demo Video</h2>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/MnkJsx-nwoE?si=NvIvJadJ0R4rWWwO" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <section id="ProjectJune" className="article-real-body">
              <h2>Project June</h2>
              <p>I planned to build Project June in two weeks, but it took me three. It was definitely rushed, and there are a lot of things I wish I had done differently. Even so, it is still one of the most ambitious projects I have worked on.</p>
              <img src="/images/ProjJune1.webp" alt="" loading="lazy" />
              <span>The original Project June photo</span>
            </section>
            <section id="OnboardSys" className="article-real-body">
              <h2>Onboard Systems</h2>
              <img src="/images/ProjJune2.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="Ultras" className="article-real-body">
              <h2>Ultrasonic Distance Sensor</h2>
              <img src="/images/ProjJune3.webp" alt="" className="borderless" loading="lazy" />
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune4.webm" type="video/webm" />
                <source src="/images/ProjJune4.mp4" type="video/mp4" />
              </video>
            </section>
            <section id="Laser" className="article-real-body">
              <h2>Laser System</h2>
              <img src="/images/ProjJune5.webp" alt="" className="borderless" loading="lazy" />
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune6.webm" type="video/webm" />
                <source src="/images/ProjJune6.mp4" type="video/mp4" />
              </video>
            </section>
            <section id="Gps" className="article-real-body">
              <h2>Live GPS</h2>
              <img src="/images/ProjJune7.webp" alt="" className="borderless" loading="lazy" />
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune8.webm" type="video/webm" />
                <source src="/images/ProjJune8.mp4" type="video/mp4" />
              </video>
            </section>
            <section id="IMU" className="article-real-body">
              <h2>10 Axis IMU</h2>
              <img src="/images/ProjJune9.webp" alt="" className="borderless" loading="lazy" />
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune10.webm" type="video/webm" />
                <source src="/images/ProjJune10.mp4" type="video/mp4" />
              </video>
            </section>
            <section id="Lightsensor" className="article-real-body">
              <h2>Light Sensor</h2>
              <img src="/images/ProjJune11.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="Dht11" className="article-real-body">
              <h2>DHT11 Temp &amp; humidity</h2>
              <img src="/images/ProjJune12.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="TechArch" className="article-real-body">
              <h2>Technical Architecture</h2>
              <p>This is an overview of how each system functions and how they all interact with each other.</p>
              <img src="/images/ProjJuneArchi.webp" alt="" loading="lazy" />
            </section>
            <section id="Livestr" className="article-real-body">
              <h2>Live Stream System</h2>
              <p>This diagram shows how the whole live streaming system works, it is 3 different WebRTC streams that send the live video to the client</p>
              <img src="/images/ProjJune13.webp" alt="" className="borderless" loading="lazy" />
              <img src="/images/ProjJune16.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="ctrlntelm" className="article-real-body">
              <h2>Control &amp; Telemetry System</h2>
              <p>The Control and telemetry system feeds sensor data for the rover to the client using an MQTT topic that the client is subscribed to, another MQTT topic is used by the client to send back commands and movement commands back to the ESP32</p>
              <img src="/images/ProjJune14.webp" alt="" className="borderless" loading="lazy" />
              <div className="gap"></div>
              <h2>Signalling</h2>
              <p>Because of an issue that has not yet been resolved, all sensor data could not be sent together in a single MQTT transmission. Instead, the data was divided into three separate packets and transmitted individually at approximately 10 Hz.</p>
              <img src="/images/ProjJune15.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="Software" className="article-real-body">
              <h2>Software</h2>
              <p>Here is the simplified flow chart of how the code works.</p>
              <img src="/images/ProjJune17.webp" alt="" className="borderless" loading="lazy" />
              <img src="/images/ProjJune18.webp" alt="" className="borderless" loading="lazy" />
            </section>
            <section id="softD" className="article-real-body">
              <h2>Software Design (Figma)</h2>
              <iframe style={{ border: '1px solid rgba(0,0,0,0.1)' }} width="800" height="450" src="https://embed.figma.com/design/mcnJbSAA9XGrY8XuUzH60Y/Project-June?node-id=0-1&embed-host=share" allowFullScreen></iframe>
              <div className="gap"></div>
              <h2>Spline3D</h2>
              <p>I used Spline3D for the 3D elements in the UI. When you push the controller forward, the model moves into forward view, and if you move it back, it goes into the reverse view.</p>
              <img src="/images/ProjJune19.webp" alt="" loading="lazy" />
              <span>Spline3D</span>
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune20.webm" type="video/webm" />
                <source src="/images/ProjJune20.mp4" type="video/mp4" />
              </video>
              <span>The live animation</span>
            </section>
            <section id="Driving" className="article-real-body">
              <h2>Driving Project June</h2>
              <p>Driving Project June was an unforgettable experience. The roughly one-second delay between controller input and movement on the live feed, combined with the instability of the stream, made it challenging at times. Thinking about how my controller input had to travel through so many layers of systems, while the video feed was being sent from over 8 kilometres away, still blows my mind.</p>
              <video autoPlay loop muted playsInline>
                <source src="/images/ProjJune21.webm" type="video/webm" />
                <source src="/images/ProjJune21.mp4" type="video/mp4" />
              </video>
              <h1>Github</h1>
              <div className="project">
                <h2>Project June</h2>
                <p>A rover control system with WebRTC video streaming, MQTT telemetry, and ESP32 sensor integration.</p>
                <a className="github-button" href="https://github.com/New-Kringster/ProjectJune" target="_blank" rel="noopener">
                  View GitHub Repo
                </a>
              </div>
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
      <div className="article-bottom-fade2"></div>
      <div className="article-bottom-fade"></div>
    </main>
  );
}
