import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleLinks from '../../components/ArticleLinks';
import SafetySequence from './SafetySequence';

const DESCRIPTION =
  'ELEC-F, a safe freezer storage system built by a team of four: two M5Stack Fire controllers with ToF, PIR and RGB units that sound an alarm when someone is shut inside a walk-in freezer too long.';

export const metadata: Metadata = {
  title: 'ELEC-F | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.chiambucket.com/elecf' },
  openGraph: {
    title: 'ELEC-F | Braven Chiam',
    description: 'A freezer safety system on M5Stack: ToF door sensing, PIR presence detection, and an RGB light and buzzer alarm.',
    url: 'https://www.chiambucket.com/elecf',
    type: 'article',
    images: [{ url: '/images/elecf-img.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Elec-F: Safe Freezer Storage System',
  description: DESCRIPTION,
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
  { img: '/images/elecf-img.webp', name: 'M5Stack Fire ×2', role: 'Controller', desc: 'Runs the timer, reads the sensors and shows the screen. The buzzer is built in.', dark: true },
  { img: '/images/elecf-hub-mini.png', name: 'Mini Hub unit', role: 'Expansion', desc: 'Splits the Fire’s single port so every sensor can plug in.' },
  { img: '/images/elecf-tof.png', name: 'ToF sensor', role: 'Door state', desc: 'Measures distance to tell whether the freezer door is open or closed.' },
  { img: '/images/elecf-pir.png', name: 'PIR sensor', role: 'Presence', desc: 'Picks up body heat and movement to tell whether someone is still inside.' },
  { img: '/images/elecf-rgb.png', name: 'RGB unit', role: 'Alarm', desc: 'Flashes with the buzzer when someone is inside past the limit.' },
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
            <span className="hp-md-tag school">School project</span>
            <span className="hp-md-tag personal">Team of 4</span>
          </div>
          <span className="hp-key" style={{ display: 'block', marginBottom: '0.4rem', letterSpacing: '0.2em' }}>ELEC-F</span>
          <h1 className="art-title">Safe Freezer <em>Storage</em> System</h1>
          <p className="art-lead">A safe freezer storage system my team of four built for an engineering course. It watches a walk-in freezer’s door and the room inside, and sounds an alarm if someone is shut in for too long.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="M5Stack" />
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
              <a href="#Demo">Demo</a>
              <a href="#Problem">The problem</a>
              <a href="#Objective">Goals</a>
              <a href="#HowItWorks">How it works</a>
              <a href="#Hardware">Hardware</a>
              <a href="#Logic">Logic</a>
              <a href="#Build">Prototype</a>
              <a href="#Team">Team</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          {/* Demo Video */}
          <section id="Demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/8De2ahk-GPo"
                title="ELEC-F demo video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* The problem */}
          <section id="Problem" className="art-section" data-reveal>
            <h2>The problem</h2>
            <p>Factories are filling up with automation, and safety has to keep up. One risk that gets overlooked is the walk-in freezer, where a worker can be trapped inside.</p>
            <h3>How it happens</h3>
            <ul>
              <li>Faulty doors: worn latches jam, moisture freezes the seals shut, and emergency releases can be broken, missing or frozen over.</li>
              <li>No one notices: nobody realises a person is still inside, and experienced workers can get careless.</li>
            </ul>
            <h3>Why it is dangerous</h3>
            <ul>
              <li>Hypothermia: cold exposure causes confusion, then unconsciousness.</li>
              <li>Asphyxiation: a sealed freezer can run low on oxygen.</li>
              <li>Injury: panic and escape attempts lead to falls and wounds.</li>
              <li>Death: without a timely rescue, a long entrapment can be fatal.</li>
            </ul>
            <p>Being trapped also causes panic, especially for people with cleithrophobia, the fear of being unable to escape. ELEC-F is meant to shorten the time someone is stuck and let them know help is coming.</p>
          </section>

          {/* Objective */}
          <section id="Objective" className="art-section" data-reveal>
            <h2>Goals</h2>
            <ul>
              <li>Stop workers from being stuck inside a factory freezer.</li>
              <li>Keep in contact with anyone who does get trapped and reassure them.</li>
              <li>Work reliably in a cold, damp, sealed room.</li>
            </ul>
          </section>

          {/* How it works */}
          <section id="HowItWorks" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>While the door is open, you set a time limit on the M5Stack. Closing the door starts the timer. If it runs out while someone is still inside, the alarm goes off.</p>

            <SafetySequence />

            <p>Four parts run together:</p>
            <ul>
              <li><b>Timer.</b> Set on the M5Stack while the door is open. Closing the door starts it.</li>
              <li><b>Door sensor.</b> A time-of-flight (ToF) sensor measures distance to tell whether the door is open or closed.</li>
              <li><b>Presence sensor.</b> A PIR sensor detects body heat and movement to tell whether someone is still in the room.</li>
              <li><b>Alarm.</b> If the door stays closed past the limit with someone inside, the RGB unit flashes and the buzzer sounds.</li>
            </ul>
            <p>We chose ToF and PIR sensors because both keep working below freezing.</p>
          </section>

          {/* Hardware */}
          <section id="Hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <p>Everything is M5Stack, which made it quick to prototype and easy to swap modules. Two M5Stack Fire controllers run the logic and the display, and a Mini Hub unit splits the Fire’s single port so every sensor has somewhere to plug in.</p>
            <figure className="art-fig">
              <img src="/images/elecf-controller-sensors.png" alt="The M5Stack Fire wired to the ToF, PIR and RGB units" loading="lazy" />
              <figcaption>The M5Stack Fire and its sensor units</figcaption>
            </figure>

            <div className="ef-comp-grid" data-no-zoom>
              {COMPONENTS.map((c) => (
                <div key={c.name} className={`ef-comp${c.dark ? ' dark' : ''}`}>
                  <div className="ef-comp-ico"><img src={c.img} alt="" loading="lazy" /></div>
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
            <h2>Logic</h2>
            <p>The full loop the M5Stack runs. The buttons set the time limit while the door is open. Once it closes, the timer runs and the sensors decide what happens next.</p>
            <img className="art-diagram" src="/images/elecf-main.avif" alt="ELEC-F software flow chart, from setting the timer to sounding the alarm" loading="lazy" />
            <figure className="art-fig">
              <img className="art-diagram" src="/images/elecf-blockdiagram.avif" alt="ELEC-F system block diagram" loading="lazy" />
              <figcaption>System block diagram</figcaption>
            </figure>
          </section>

          {/* The build */}
          <section id="Build" className="art-section" data-reveal>
            <h2>Prototype</h2>
            <p>We made the freezer and its door out of cardboard to test the sensors and the timing end to end before thinking about a proper enclosure.</p>
            <div className="art-grid">
              <img src="/images/elecf-prototype2.avif" alt="ELEC-F prototype with the sensors mounted" loading="lazy" />
              <img src="/images/elecf-prototype3.avif" alt="ELEC-F prototype, the door" loading="lazy" />
            </div>
            <figure className="art-fig">
              <img src="/images/elecf-poster.avif" alt="The ELEC-F project poster" loading="lazy" />
              <figcaption>The project poster</figcaption>
            </figure>
            <div className="art-repo">
              <div className="art-repo-text">
                <strong>ELEC-F on GitHub</strong>
                <span>The M5Stack code for the door timer, the sensor reads and the alarm.</span>
              </div>
              <a className="hp-btn" href="https://github.com/New-Kringster/ELEC-F-Safe-Fridge-Concept" target="_blank" rel="noopener">View GitHub Repo <Circle /></a>
            </div>
          </section>

          {/* Team */}
          <section id="Team" className="art-section" data-reveal>
            <h2>Team</h2>
            <div className="art-team">
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar sadiq-profile"></div>
                  <div><b>Md Sadiq</b><span>Team lead</span></div>
                </div>
                <a className="art-team-link" href="https://www.mdsadiq.cc" target="_blank" rel="noopener">Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar tyr-profile"></div>
                  <div><b>Tan Yong Rui</b><span>Team member</span></div>
                </div>
                <a className="art-team-link" href="https://tanyongrui11.framer.website/project/www-pentaclay-com" target="_blank" rel="noopener">Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar braven-profile"></div>
                  <div><b>Braven (me)</b><span>Team member</span></div>
                </div>
                <a className="art-team-link" href="/" target="_blank" rel="noopener">Profile <Fwd /></a>
              </div>
              <div className="art-team-row">
                <div className="art-team-id">
                  <div className="art-team-avatar abel-profile"></div>
                  <div><b>Abel Goh</b><span>Team member</span></div>
                </div>
                <a className="art-team-link" href="https://frequent-location-124634.framer.app" target="_blank" rel="noopener">Profile <Fwd /></a>
              </div>
            </div>
          </section>

          <div className="art-next">
            <span className="art-next-label">More projects</span>
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
