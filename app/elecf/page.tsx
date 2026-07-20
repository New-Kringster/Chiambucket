import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import SafetySequence from './SafetySequence';

export const metadata: Metadata = {
  title: 'Elec-F: Safe Freezer Storage System — Chiambucket',
  description: 'Project article: ELEC-F, a freezer safety system built on M5Stack with ToF, PIR and RGB units to keep workers from being trapped in walk-in freezers.',
  alternates: { canonical: 'https://www.chiambucket.com/elecf' },
  openGraph: {
    title: 'Elec-F: Safe Freezer Storage System — Chiambucket',
    description: 'A freezer safety system on M5Stack: ToF door sensing, PIR presence detection, and an RGB + buzzer alarm for trapped workers.',
    url: 'https://www.chiambucket.com/elecf',
    type: 'article',
    images: [{ url: '/images/elecf-img.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Elec-F: Safe Freezer Storage System',
  description: 'A freezer safety concept developed for an engineering course. Two M5Stack Fire controllers with ToF, PIR and RGB units detect when a worker is trapped in a walk-in freezer and raise the alarm.',
  image: 'https://www.chiambucket.com/images/elecf-img.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/elecf',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);
const Fwd = () => <img src="/images/fwd-arrow.svg" alt="" />;

const COMPONENTS = [
  { img: '/images/elecf-img.webp', name: 'M5Stack Fire ×2', role: 'Controller', desc: 'The brains and the screen. One drives the interface and logic, the other extends the build.', dark: true },
  { img: '/images/elecf-hub-mini.png', name: 'Mini Hub Unit', role: 'Expansion', desc: 'Fans out the Fire’s single port so every sensor and unit has somewhere to plug in.' },
  { img: '/images/elecf-tof.png', name: 'ToF Sensor', role: 'Door state', desc: 'Time-of-flight distance sensing tells the system whether the freezer door is open or closed.' },
  { img: '/images/elecf-pir.png', name: 'PIR Sensor', role: 'Presence', desc: 'Reads body heat and movement to know if a person is still inside the room.' },
  { img: '/images/elecf-rgb.png', name: 'RGB Unit', role: 'Alarm', desc: 'Flashes bright warning light alongside the buzzer when someone is trapped past the limit.' },
];

export default function ElecfPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* ── Feature hero ── */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/elecf-prototype1.avif" alt="The ELEC-F cardboard freezer prototype with M5Stack and sensors" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School Project</span>
            <span className="hp-md-tag personal">Team of 4</span>
          </div>
          <span className="hp-key" style={{ display: 'block', marginBottom: '0.4rem', letterSpacing: '0.2em' }}>ELEC-F</span>
          <h1 className="art-title">Safe Freezer <em>Storage</em> System</h1>
          <p className="art-lead">A freezer safety system my team and I designed for an engineering course. Walk-in factory freezers can trap the people working inside them. ELEC-F watches the door and the room, and if someone is shut in for too long, it sounds the alarm before the cold turns dangerous.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32 / M5Stack" />
              <img src="/images/figma-icon.webp" alt="Figma" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: 'GitHub', url: 'https://github.com/New-Kringster/ELEC-F-Safe-Fridge-Concept' },
              { type: 'video', label: 'Demo video', url: 'https://youtu.be/8De2ahk-GPo' },
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
              <a href="#Problem">The problem</a>
              <a href="#Objective">What we set out to do</a>
              <a href="#HowItWorks">How it works</a>
              <a href="#Hardware">The hardware</a>
              <a href="#Logic">The logic</a>
              <a href="#Build">The build</a>
              <a href="#Team">The team</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          {/* Demo Video */}
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/8De2ahk-GPo"
                title="ELEC-F Safe Freezer Storage System video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* The problem */}
          <section id="Problem" className="art-section" data-reveal>
            <h2>The problem</h2>
            <p>As the world moves into the Fourth Industrial Revolution, factories are filling up with electronics and automation. Smart factories chase efficiency, but safety has to keep pace. One risk that often goes unnoticed is the walk-in freezer, where a worker can end up trapped inside.</p>
            <h3>How it happens</h3>
            <ul>
              <li>Faulty door mechanisms: worn latches jam, moisture freezes the seals shut, and emergency releases can be broken, missing or frozen over.</li>
              <li>Lack of awareness: nobody realises a person is still inside, and routine can make experienced workers drop their guard.</li>
            </ul>
            <h3>Why it is dangerous</h3>
            <ul>
              <li>Hypothermia: cold exposure brings confusion, then unconsciousness.</li>
              <li>Asphyxiation: a sealed freezer can run low on oxygen.</li>
              <li>Physical injury: panic and escape attempts lead to falls and wounds.</li>
              <li>Fatal exposure: without a timely rescue, prolonged entrapment can be deadly.</li>
            </ul>
            <p>There is an emotional cost too. Being trapped triggers intense panic and helplessness, especially for people with cleithrophobia, the fear of being unable to escape. ELEC-F is built to cut that time down and reassure a trapped worker that help is on the way.</p>
          </section>

          {/* Objective */}
          <section id="Objective" className="art-section" data-reveal>
            <h2>What we set out to do</h2>
            <p>The brief was simple to state and harder to solve: make working around factory freezers safer. We set ourselves three goals.</p>
            <ul>
              <li>Build a system that stops workers from being stuck inside a factory freezer.</li>
              <li>Keep communication and reassurance flowing to anyone who does get trapped.</li>
              <li>Stay reliable in an environment most electronics hate: sub-zero, damp and sealed.</li>
            </ul>
          </section>

          {/* How it works */}
          <section id="HowItWorks" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>ELEC-F runs on a simple loop. While the door is open, you set a timer on the M5Stack. The moment the door closes, that timer arms. If it runs out while someone is still inside, the alarm fires. Step through it below.</p>

            <SafetySequence />

            <p>Under the hood, four jobs run together:</p>
            <ul>
              <li><b>Stopwatch.</b> When the door is open, set a time limit on the M5Stack. Closing the door starts the clock.</li>
              <li><b>Door sensor.</b> A ToF (time-of-flight) sensor measures distance to tell whether the door is open or closed.</li>
              <li><b>Human detection.</b> A PIR sensor watches for body heat and movement to know if someone is still in the room.</li>
              <li><b>Danger alert.</b> If the door stays closed past the limit with a person inside, the RGB unit flashes and the buzzer sounds to alert anyone nearby.</li>
            </ul>
            <p>We chose ToF and PIR sensors on purpose: both keep working at sub-zero temperatures, which is exactly what a freezer demands.</p>
          </section>

          {/* Hardware */}
          <section id="Hardware" className="art-section" data-reveal>
            <h2>The hardware</h2>
            <p>The whole system is built from M5Stack parts, which made it quick to prototype and easy to swap modules. Two M5Stack Fire controllers act as the brains and the display, with a Mini Hub unit fanning out their single port so every sensor has somewhere to plug in.</p>
            <figure className="art-fig">
              <img src="/images/elecf-controller-sensors.png" alt="The M5Stack Fire controller wired to the ToF, PIR and RGB units" loading="lazy" />
              <figcaption>The M5Stack Fire and its sensor modules</figcaption>
            </figure>

            <div className="ef-comp-grid" data-no-zoom>
              {COMPONENTS.map((c) => (
                <div key={c.name} className={`ef-comp${c.dark ? ' dark' : ''}`}>
                  <div className="ef-comp-ico"><img src={c.img} alt={c.name} loading="lazy" /></div>
                  <span className="ef-comp-tag">{c.role}</span>
                  <b>{c.name}</b>
                  <span>{c.desc}</span>
                </div>
              ))}
            </div>

            <figure className="art-fig">
              <img src="/images/elecf-wiring.png" alt="ELEC-F wiring layout" loading="lazy" />
              <figcaption>How the units are wired together</figcaption>
            </figure>
          </section>

          {/* Logic */}
          <section id="Logic" className="art-section" data-reveal>
            <h2>The logic</h2>
            <p>Here is the full decision loop the M5Stack runs, from setting the timer to sounding the alarm. The buttons adjust the limit while the door is open; once it closes, the stopwatch takes over and the sensors decide what happens next.</p>
            <img className="art-diagram" src="/images/elecf-main.avif" alt="ELEC-F software flowchart showing the full decision loop" loading="lazy" />
            <figure className="art-fig">
              <img className="art-diagram" src="/images/elecf-blockdiagram.avif" alt="ELEC-F system block diagram" loading="lazy" />
              <figcaption>System block diagram</figcaption>
            </figure>
          </section>

          {/* The build */}
          <section id="Build" className="art-section" data-reveal>
            <h2>The build</h2>
            <p>We modelled the freezer and its door out of cardboard so we could test the sensors and the timing end to end before worrying about a finished enclosure. It was rough, but it let us prove the whole loop worked.</p>
            <div className="art-grid">
              <img src="/images/elecf-prototype2.avif" alt="ELEC-F prototype, sensors mounted" loading="lazy" />
              <img src="/images/elecf-prototype3.avif" alt="ELEC-F prototype, door detail" loading="lazy" />
            </div>
            <figure className="art-fig">
              <img src="/images/elecf-poster.avif" alt="The full ELEC-F project poster" loading="lazy" />
              <figcaption>The full project poster</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>ELEC-F on GitHub</strong>
                <span>The M5Stack code for the door timer, sensor reads and alarm logic.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/ELEC-F-Safe-Fridge-Concept" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          {/* Team */}
          <section id="Team" className="art-section" data-reveal>
            <h2>The team</h2>
            <div className="art-team">
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar sadiq-profile"></div>
                  <div><b>Md Sadiq</b><span>Team Leader</span></div>
                </div>
                <a className="art-team-link" href="https://www.mdsadiq.cc" target="_blank" rel="noopener">View Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar tyr-profile"></div>
                  <div><b>Tan Yong Rui</b><span>Team Member</span></div>
                </div>
                <a className="art-team-link" href="https://tanyongrui11.framer.website/project/www-pentaclay-com" target="_blank" rel="noopener">View Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar braven-profile"></div>
                  <div><b>Braven (me)</b><span>Team Member</span></div>
                </div>
                <a className="art-team-link" href="/" target="_blank" rel="noopener">View Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar abel-profile"></div>
                  <div><b>Abel Goh</b><span>Team Member</span></div>
                </div>
                <a className="art-team-link" href="https://frequent-location-124634.framer.app" target="_blank" rel="noopener">View Profile <Fwd /></a>
              </div>
            </div>
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-elecf" />

      {/* Scoped styles: components grid */}
      <style>{`
        /* The cover photo is bright cardboard-on-white; deepen the hero scrim on this page
           so the back link and title stay legible, but still fade to transparent at the
           bottom so the hero dissolves into the field (matches the global hero fade). */
        html.sensory-active .art-hero-scrim {
          background: linear-gradient(180deg, rgba(3,4,8,0.82) 0%, rgba(3,4,8,0.44) 32%, rgba(3,4,8,0.6) 68%, rgba(3,4,8,0.76) 85%, transparent 100%); }
        .ef-comp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(148px, 1fr)); gap: 12px; margin: 1.4rem 0; }
        .ef-comp { display: flex; flex-direction: column; gap: 7px; padding: 14px; border-radius: 16px; background: var(--hp-glass); border: 1px solid var(--hp-line); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease; }
        .ef-comp:hover { transform: translateY(-3px); border-color: rgba(var(--sa-accent, 127,168,255), 0.35); }
        .ef-comp-ico { width: 100%; aspect-ratio: 1; border-radius: 12px; margin-bottom: 3px; display: grid; place-items: center; overflow: hidden; background: radial-gradient(circle at 50% 32%, #f5f6f8, #d7dae1); }
        .ef-comp-ico img { width: 78%; height: 78%; object-fit: contain; }
        .ef-comp.dark .ef-comp-ico { background: radial-gradient(circle at 50% 42%, #181820, #050507); }
        .ef-comp.dark .ef-comp-ico img { width: 96%; height: 96%; }
        .ef-comp-tag { font-family: 'inter'; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hp-sky); font-weight: 700; }
        .ef-comp b { font-family: 'inter'; font-weight: 600; font-size: 0.92rem; color: #ececec; }
        .ef-comp > span:last-child { font-family: 'dmsans'; font-size: 0.78rem; color: var(--hp-ink-dim); line-height: 1.5; }
      `}</style>
    </main>
  );
}
