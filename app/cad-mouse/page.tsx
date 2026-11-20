import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import DemoVideo from '../pantry/DemoVideo';
import CadSim from './CadSim';
import '../pantry/pantry.css';
import './cad-mouse.css';

const URL = 'https://www.chiambucket.com/cad-mouse';
const DESCRIPTION =
  'A wireless 3D mouse for Onshape made from an M5Stack Capsule. You click its button and turn it in your hand, and the model on the screen turns with it, because the Capsule passes itself off as a 3Dconnexion SpaceMouse over Bluetooth.';

export const metadata: Metadata = {
  title: '3D CAD Mouse | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: '3D CAD Mouse | Braven Chiam',
    description: 'Turn an M5Stack Capsule in your hand and the model in Onshape turns with it.',
    url: URL,
    type: 'article',
    images: [{ url: '/images/cad-mouse-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '3D CAD Mouse',
  description: DESCRIPTION,
  image: 'https://www.chiambucket.com/images/cad-mouse-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: URL,
  about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', '3D mouse', 'Onshape'],
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/cad-mouse/';
const V = '/videos/cad-mouse/';
const CAPSULE = 'https://docs.m5stack.com/en/core/Capsule';

export default function CadMousePage() {
  return (
    <main className="art pt cm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt="The M5Stack Capsule v1.1 standing upright, its colourful pin label facing forward and the USB-C port at the bottom" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#projects"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <AiMark project="proj-cadmouse" />
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />Internship project</span>
          </div>
          <h1 className="art-title">3D CAD <em>Mouse</em></h1>
          <p className="art-lead">I turned an M5Stack Capsule into a wireless 3D mouse for Onshape. You click its button and turn it in your hand, and the model on the screen turns with it, as if you were holding the part itself.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
              <img src="/images/onshape-icon.webp" alt="Onshape" />
            </div>
          </div>
          <div className="art-links">
            <span className="art-link cm-burner" role="link" aria-disabled="true" title="The firmware is not on M5Burner yet">
              <img src={I + 'm5burner.png'} alt="" width={18} height={18} />
              <span>Install with M5Burner</span>
              <small>Coming soon</small>
            </span>
          </div>
          <p className="pt-meta">Internship project at M5Stack, November 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.</p>
        </div>
      </header>

      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#demo">Demo</a>
              <a href="#try">Try it</a>
              <a href="#use">How to use it</a>
              <a href="#how">How it works</a>
              <a href="#spacemouse" className="sub">Passing as a SpaceMouse</a>
              <a href="#turning" className="sub">Following your hand</a>
              <a href="#stopping" className="sub">Stopping cleanly</a>
              <a href="#hardware">Hardware</a>
              <a href="#setup">Setting one up</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <p>I filmed this at my desk with one of my enclosures open in Onshape. With rotate on, the part turns and tips as I turn the Capsule, and holding the button lets me slide the part across the screen and zoom in on its buttons.</p>
            <DemoVideo base={V} label="Turning an orange enclosure in Onshape by turning the Capsule in my hand, then panning and zooming in on its buttons" moments={[
              { t: 0, label: 'Turning the part', note: 'Rotate is on, so the part turns and tips with my hand' },
              { t: 5, label: 'Turning it over', note: 'Tipping the Capsule right over shows the underside' },
              { t: 9, label: 'Sliding it across', note: 'Holding the button pans the part off to the side and back' },
              { t: 13, label: 'Zooming in', note: 'Twisting while I hold it zooms in on the buttons, then back out' },
            ]} />
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>Try it</h2>
            <p>This copy runs the Capsule&rsquo;s button logic with your pointer standing in for your hand. The top of the Capsule is its button, so click it to turn rotate on and move the pointer over the view to turn the part, hold it to pan, and double click it to fit the part back in view.</p>
            <CadSim />
            <p className="pt-note">The real Capsule measures how fast your hand turns, so the part turns through the same angle your hand did. Here the pointer&rsquo;s movement stands in for that.</p>
          </section>

          <section id="use" className="art-section" data-reveal>
            <h2>How to use it</h2>
            <p>You hold the Capsule upright with its label facing you and the USB port at the bottom, and its one button does everything.</p>
            <ul className="pt-parts">
              <li><b>Click to rotate</b><span>A click turns rotate on, and the light turns cyan. From then on the model follows your hand until you click again. Rotate starts 0.3 seconds after the click, which is how long it waits to rule out a double click.</span></li>
              <li><b>Hold to pan and zoom</b><span>Holding the button pauses rotate and pans instead, with the light amber. Pointing the Capsule left, right, up or down slides the model that way, and twisting it zooms. Rotate picks up again when you let go.</span></li>
              <li><b>Double click to fit</b><span>A double click fits the whole model on the screen, and rotate stays as it was.</span></li>
            </ul>
            <p>The light breathes blue while it waits for a computer and blinks green every few seconds once it is connected. A high tick means rotate is on and a lower one means it is off, and the Capsule switches itself off after a long time unused.</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>The Capsule has a gyroscope and an accelerometer in its IMU, a button and Bluetooth, which is everything a 3D mouse needs. The hard part was getting Onshape to listen to it.</p>
          </section>

          <section id="spacemouse" className="art-section" data-reveal>
            <h3>Passing as a SpaceMouse</h3>
            <p>Onshape only takes 3D mouse input through the driver from 3Dconnexion, the company that makes the SpaceMouse. So the Capsule introduces itself over Bluetooth as their SpaceMouse Wireless, with that model&rsquo;s IDs and the same layout for its reports, and the driver does the rest. Nothing has to be installed inside Onshape. I built the Bluetooth side on the code from an air mouse I had made earlier, which already worked with both Windows and macOS.</p>
          </section>

          <section id="turning" className="art-section" data-reveal>
            <h3>Following your hand</h3>
            <p>A real SpaceMouse reports how far you push its cap, and the driver turns that into speed. The Capsule sends how fast your hand is turning instead, from its gyroscope, so the driver turns the model through the same angle your hand turned. It feels like holding the part rather than steering it.</p>
            <p>The accelerometer only works out which way is down. That keeps the axes level however you grip the Capsule, so turning it about the vertical always spins the model about the screen&rsquo;s vertical. I didn&rsquo;t use it to move the model, because a position worked out from an accelerometer drifts away within a second, which is why panning comes from pointing the Capsule instead.</p>
          </section>

          <section id="stopping" className="art-section" data-reveal>
            <h3>Stopping cleanly</h3>
            <p>Pressing the button freezes the output straight away, so the jolt of your thumb and your hand coming to a stop never reach the model. While your hand moves, the Capsule sends a report 62.5 times a second, like the real SpaceMouse. When it stops, it keeps sending zeros until three have gone through, because a lost last report would leave the model spinning, and then it goes quiet.</p>
            <p>The motion maths and the button gestures sit in one library with no hardware code in it, so 19 unit tests check them on a computer before each flash.</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                <li><a href={CAPSULE} target="_blank" rel="noopener"><b>M5Stack Capsule v1.1</b></a><span>is the whole thing, with nothing added. Its ESP32-S3 runs the firmware and the Bluetooth, its BMI270 IMU reads the gyroscope 200 times a second, and its RGB LED and buzzer give the feedback.</span></li>
                <li><b>The button</b><span>on top of the Capsule does all three gestures.</span></li>
                <li><b>A 250 mAh battery</b><span>inside keeps it wireless, and it powers itself off when it hasn&rsquo;t moved for a while.</span></li>
              </ul>
              <figure className="cm-hold">
                <img src={I + 'hold.webp'} alt="Holding the Capsule in front of the monitor while the enclosure in Onshape turns with it" loading="lazy" />
                <figcaption>Turning the enclosure in the demo</figcaption>
              </figure>
            </div>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>Setting one up</h2>
            <ol className="pt-steps">
              <li><p>Install 3Dconnexion&rsquo;s free driver, 3DxWare, on your computer. It includes the part that lets Onshape in the browser listen to a 3D mouse.</p></li>
              <li><p>Flash the firmware onto a Capsule v1.1 with M5Burner. It isn&rsquo;t on M5Burner yet, so this step is coming soon.</p></li>
              <li><p>Open your computer&rsquo;s Bluetooth settings and pair <b>Capsule CAD Mouse</b>. It chirps when it connects.</p></li>
              <li><p>Open a model in Onshape, click the button and turn the Capsule.</p></li>
            </ol>
            <p className="pt-note">I have only tried it in Onshape so far. Other programs that take a SpaceMouse through 3DxWare should work the same way, but I haven&rsquo;t tested them yet, and I haven&rsquo;t measured how long the battery lasts.</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-cadmouse" />
    </main>
  );
}
