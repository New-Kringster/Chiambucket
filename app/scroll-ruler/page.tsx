import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import DemoVideo from '../pantry/DemoVideo';
import { Atom, Screen } from './Atom';
import RulerSim from './RulerSim';
import '../pantry/pantry.css';
import './scroll-ruler.css';

const URL = 'https://www.chiambucket.com/scroll-ruler';
const DESCRIPTION =
  'A digital ruler built from an M5Stack AtomS3R and a Unit Scroll during my internship at M5Stack. You press the scroll wheel down and roll it along whatever you want to measure, and the screen shows the distance in centimetres after a one-time 10 cm calibration.';

export const metadata: Metadata = {
  title: 'Scroll Ruler | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Scroll Ruler | Braven Chiam',
    description: 'Roll the Unit Scroll along something and the AtomS3R shows how long it is.',
    url: URL,
    type: 'article',
    images: [{ url: '/images/scroll-ruler-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scroll Ruler',
  description: DESCRIPTION,
  image: 'https://www.chiambucket.com/images/scroll-ruler-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: URL,
  about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'rotary encoder', 'digital ruler'],
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/scroll-ruler/';
const V = '/videos/scroll-ruler/';
const REPO = 'https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler';
const FLASHDECK = 'https://flashdeck.shebang.pro/';
const PER10 = 49; // steps the device counted for 10 cm in the demo

function Feature({ id, title, children, media, flip }: { id: string; title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean }) {
  return (
    <section id={id} className={`art-section pt-feat sr-feat${flip ? ' flip' : ''}`} data-reveal>
      <div className="pt-feat-media sr-feat-media">{media}</div>
      <div className="pt-feat-copy"><h3>{title}</h3>{children}</div>
    </section>
  );
}

export default function ScrollRulerPage() {
  return (
    <main className="art pt sr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt="The Scroll Ruler: an AtomS3R on its Atomic Battery Base, with the Unit Scroll plugged in underneath and the screen reading 0.0 cm" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#projects"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <AiMark project="proj-ruler" />
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />Internship project</span>
          </div>
          <h1 className="art-title">Scroll <em>Ruler</em></h1>
          <p className="art-lead">I built this digital ruler during my internship at M5Stack from an AtomS3R and a Unit Scroll. You press the scroll wheel down and roll it along whatever you want to measure, and the screen shows the distance in centimetres.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: 'GitHub', url: REPO },
              { type: 'download', label: 'Flash the firmware', url: FLASHDECK },
            ]}
          />
          <p className="pt-meta">Internship project at M5Stack, November 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.</p>
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
              <a href="#measure" className="sub">Measure</a>
              <a href="#calibrate" className="sub">Calibrate</a>
              <a href="#steps" className="sub">How fine it measures</a>
              <a href="#how">How it works</a>
              <a href="#hardware">Hardware</a>
              <a href="#setup">Setting one up</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <p>I filmed this at my desk, first calibrating it over 10 cm of a ruler and then measuring three lengths along the same ruler.</p>
            <DemoVideo base={V} label="The Scroll Ruler calibrated over 10 cm of a ruler, then measuring 4.1, 8.2 and 7.3 cm" moments={[
              { t: 0, label: 'Calibrating over 10 cm', note: 'It counted 49 steps of the wheel, about 2 mm a step' },
              { t: 13, label: 'The first run', note: 'Rolled along the ruler, it reads 4.1 cm' },
              { t: 25, label: 'The second run', note: 'A longer roll reads 8.2 cm' },
              { t: 38, label: 'The third run', note: 'The last roll reads 7.3 cm' },
            ]} />
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>Try it</h2>
            <p>This copy of the ruler runs the same logic as the firmware and starts on its calibration screen. Drag the Unit Scroll along the ruler to roll it with the wheel pressed down, which counts, or click the ruler to lift it and set it down somewhere else, which doesn&rsquo;t. Tapping the screen saves a calibration or zeroes the reading, and holding it for a second starts a new calibration.</p>
            <RulerSim />
            <p className="pt-note">A calibration that isn&rsquo;t exactly 10 cm throws every reading off by the same amount, here as on the real ruler.</p>
          </section>

          <section id="use" className="art-section" data-reveal>
            <h2>How to use it</h2>
            <p>The AtomS3R&rsquo;s whole screen is its button, so the ruler has only two controls: the scroll wheel, which you press down while you roll it, and the screen, which you tap or hold.</p>
          </section>

          <Feature id="measure" title="Measure"
            media={<figure className="sr-screens" style={{ maxWidth: 240 }}><Atom label="The ruler screen while counting: RULER with a green LIVE tag, 4.1 cm in green, and 41 mm at 2.0 mm a step"><Screen s={{ mode: 'measuring', pressed: true, steps: 20, calSteps: 0, per10cm: PER10 }} /></Atom></figure>}>
            <p>You press the wheel down and roll it forward, and the distance counts only while the wheel stays pressed, with the Unit Scroll&rsquo;s LED glowing green and the reading turning green too. Releasing the wheel stops the count, and rolling backwards while it is pressed takes distance off again.</p>
            <p>Tapping the screen sets the reading back to zero, and holding it for about a second starts a new calibration.</p>
          </Feature>

          <Feature id="calibrate" title="Calibrate" flip
            media={<div className="sr-screens">
              <figure><Atom label="Calibrating: 49 steps counted so far, with the instruction to press the wheel and roll exactly 10 cm"><Screen s={{ mode: 'calibrating', pressed: true, steps: 0, calSteps: PER10, per10cm: 0 }} /></Atom><figcaption>Rolling the 10 cm</figcaption></figure>
              <figure><Atom label="Checking: 49 steps equal 10 cm, tap to save"><Screen s={{ mode: 'confirming', pressed: false, steps: 0, calSteps: PER10, per10cm: 0 }} /></Atom><figcaption>Released, ready to save</figcaption></figure>
            </div>}>
            <p>The first time it starts, and whenever you ask it to, the ruler measures 10 cm to learn how far the wheel travels per step. You press the wheel and roll it exactly 10 cm along a real ruler, then release it and tap the screen to save the number of steps it counted.</p>
            <p>Pressing the wheel again keeps adding to the same roll, and holding the screen starts it over. The calibration stays in flash, so it survives a power cut, and the direction you rolled it in becomes forward.</p>
          </Feature>

          <section id="steps" className="art-section" data-reveal>
            <h3>How fine it measures</h3>
            <p>The wheel only has so many steps in a turn, so the ruler measures in steps rather than smoothly. Mine counted 49 steps for 10 cm, which makes each step about 2 mm, and the screen shows the exact step length under every reading so you know how much to trust the last digit.</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>The Unit Scroll has its own small chip that counts the wheel&rsquo;s steps and reads its button, and the AtomS3R asks it for both over I2C through the Grove port a hundred times a second. Each read returns the steps since the last one, and they only count toward the distance while the wheel is pressed.</p>
            <p>I kept the ruler&rsquo;s logic, which is the calibration and the distance maths, in one file with no hardware code in it, so eleven unit tests check it on a computer before it goes onto the device. If the Unit Scroll comes unplugged the screen says so, and it picks the unit back up as soon as it is plugged in again.</p>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                <li><a href="https://shop.m5stack.com/products/atoms3r-dev-kit" target="_blank" rel="noopener"><b>AtomS3R</b></a><span>runs the ruler on its ESP32-S3, and its 0.85-inch screen is also its button.</span></li>
                <li><a href="https://shop.m5stack.com/products/atomic-battery-base-200mah" target="_blank" rel="noopener"><b>Atomic Battery Base</b></a><span>holds the battery, so the ruler needs no cable.</span></li>
                <li><a href="https://docs.m5stack.com/en/unit/UNIT-Scroll" target="_blank" rel="noopener"><b>Unit Scroll</b></a><span>is the wheel you roll, with a push button and an RGB LED, and it plugs into the AtomS3R&rsquo;s Grove port.</span></li>
              </ul>
              <figure className="sr-photo">
                <img src={I + 'reading.webp'} alt="The ruler held up after the second run, its screen reading 8.2 cm, above the ruler it rolled along" loading="lazy" />
                <figcaption>After the second run in the demo</figcaption>
              </figure>
            </div>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>Setting one up</h2>
            <ol className="pt-steps">
              <li><p>Stack the AtomS3R on the Atomic Battery Base and plug the Unit Scroll into the AtomS3R&rsquo;s Grove port.</p></li>
              <li><p>Open <a href={FLASHDECK} target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Scroll Wheel Ruler</b>, plug the AtomS3R in over USB-C and press <b>Install</b>, which flashes the firmware straight from the browser.</p></li>
              <li><p>It starts on the calibration screen, so press the wheel and roll it exactly 10 cm along a ruler, then release it and tap the screen to save.</p></li>
            </ol>
            <p>The <a href={REPO} target="_blank" rel="noopener">GitHub repository</a> has the firmware&rsquo;s code, its unit tests and a download of the firmware image for flashing with esptool instead.</p>
            <p className="pt-note">The AtomS3R on this page is rendered from M5Stack&rsquo;s own model in <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT licence, copyright M5Stack), and its screens are drawn from the firmware&rsquo;s own layout.</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-ruler" />
    </main>
  );
}
