import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LidarHero, { type Beat } from './LidarHero';
import ScanExplorer from './ScanExplorer';
import LidarVideo from './LidarVideo';
import '../pantry/pantry.css';
import './lidar.css';

const URL = 'https://www.chiambucket.com/stackchan-lidar';
const DESCRIPTION =
  'A makeshift LiDAR built on M5Stack’s Stack-chan: four Unit ToF4M distance sensors on its head, swept across a room by its two servos, with its camera colouring every point and a browser showing the scan in 3D.';

export const metadata: Metadata = {
  title: 'Stack-chan LiDAR | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Four distance sensors on Stack-chan’s head, swept across a room, turned into a coloured 3D scan.',
    url: URL,
    type: 'article',
    images: [{ url: '/images/stackchan-lidar-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Stack-chan LiDAR',
  description: DESCRIPTION,
  image: 'https://www.chiambucket.com/images/stackchan-lidar-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: URL,
  about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'point cloud', '3D scanning', 'ESP32-S3'],
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/stackchan-lidar/';
const FLASHDECK = 'https://flashdeck.shebang.pro/';

const BEATS: Beat[] = [
  { title: 'It sweeps the room', text: 'Stack-chan turns its head across the room row by row, from the top, and stops at every step to take a distance reading. This is the real scan from the video, built up in the order the head moved.', from: 0.1, to: 0.52 },
  { title: 'Four sensors, one reading', text: 'The four Unit ToF4M all point the same way, so they are four opinions about the same spot rather than four rays. Each step keeps the middle of their readings, which throws out the odd bad one.', from: 0.55, to: 0.75 },
  { title: 'Coloured by its own camera', text: 'Before it scans, Stack-chan photographs the area with the CoreS3’s camera, and the browser pushes every pixel of those photos out to the distance the sensors measured, which turns a grid of readings into 68,206 coloured points.', from: 0.77, to: 1.2 },
];

export default function StackchanLidarPage() {
  return (
    <main className="art pt lr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <LidarHero
        still={I + 'cover.webp'}
        stillAlt="The real Stack-chan LiDAR: Stack-chan with four Unit ToF4M sensors in a square on top of its head, their Grove cables looping down to the back, and its sleepy face on the screen"
        beats={BEATS}
        intro={<>
          <a className="art-back" href="/#projects"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />Internship project</span>
            <span className="hp-md-tag highlight">Featured</span>
            <AiMark project="proj-lidar" />
          </div>
          <h1 className="art-title">Stack-chan <em>LiDAR</em></h1>
          <p className="art-lead">I put four distance sensors on Stack-chan&rsquo;s head and let its servos sweep them across a room. Its camera colours the points, and any browser on the same Wi-Fi shows the scan in 3D.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
              <img src="/images/blender-icon.webp" alt="Blender" />
            </div>
          </div>
          <ArticleLinks links={[{ type: 'download', label: 'Flash the firmware', url: FLASHDECK }]} />
          <p className="pt-meta">Internship project at M5Stack, November 2026. Stack-chan (CoreS3), PaHub, four Unit ToF4M, C++ and WebGL.</p>
        </>}
      />

      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#demo">Demo</a>
              <a href="#explore">Explore the scan</a>
              <a href="#idea">From a handheld idea</a>
              <a href="#how">How a scan works</a>
              <a href="#sweep" className="sub">The sweep</a>
              <a href="#sensors" className="sub">Four sensors</a>
              <a href="#colour" className="sub">Colour</a>
              <a href="#browser" className="sub">In the browser</a>
              <a href="#lessons">What broke</a>
              <a href="#hardware">Hardware</a>
              <a href="#setup">Try it yourself</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <p>I set Stack-chan down on a table in the corner of an empty room and started a scan from my laptop. The film shows the head sweeping while the cloud grows in the browser, then the finished scan from every side, first as depth and then in the camera&rsquo;s colours.</p>
            <LidarVideo base="/videos/stackchan-lidar/" label="Stack-chan sweeping a room corner with the point cloud growing in the browser, then the finished scan in depth and photo colour" moments={[
              { t: 4, label: 'The sweep', note: 'The head works across the corner while the cloud fills in beside it' },
              { t: 24, label: 'The finished cloud', note: 'The walls and ceiling around the corner, seen from outside' },
              { t: 34, label: 'Depth', note: 'Coloured by distance, which shows the rings each row draws' },
              { t: 52, label: 'Photo colour', note: 'The same points coloured from Stack-chan’s own photos' },
            ]} />
          </section>

          <section id="explore" className="art-section" data-reveal>
            <h2>Explore the scan</h2>
            <p>This is the scan from the video, all 68,206 points, with Stack-chan drawn at its real size where it stood. Drag to look around the corner it scanned, and switch between the camera&rsquo;s colours and depth.</p>
            <ScanExplorer still={I + 'cloud.webp'} stillAlt="The finished scan from above: two pale walls meeting in a corner, the ceiling and the table, with a blue box on the table" />
            <p className="pt-note">Stack-chan is drawn from M5Stack&rsquo;s own 3D models, which I put together in Blender with the four sensors on top.</p>
          </section>

          <section id="idea" className="art-section" data-reveal>
            <h2>From a handheld idea</h2>
            <p>I first wanted a scanner I could wave around a room like the LiDAR on an iPhone, with an IMU tracking where it pointed. An IMU only knows which way it faces, though, not where it is, and the iPhone works out its position from its camera. So I mounted the four sensors on Stack-chan instead, whose two servos know exactly which way the head points, and let it do the sweeping.</p>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How a scan works</h2>
            <p>A scan has three parts: a set of photos, a sweep of distance readings, and the browser putting them together.</p>
          </section>

          <section id="sweep" className="art-section" data-reveal>
            <h3>The sweep</h3>
            <p>You choose how wide and how tall an area to cover, up to 256 degrees across and from level to straight up, and how much detail you want. Quick steps the head 5 degrees at a time, Normal 3 and Fine 2. The head works through the grid row by row from the top, turning back at the end of each row, and every pose becomes one sample: a direction from the servos and a distance from the sensors.</p>
          </section>

          <section id="sensors" className="art-section" data-reveal>
            <h3>Four sensors</h3>
            <p>The four Unit ToF4M share one Grove port through a PaHub, which switches between them. They point the same way, so each sample takes the median of the first reading from each sensor that started after the head stopped moving, which keeps a stray reading or one taken mid-swing out of the scan.</p>
            <p>Each sensor sees a cone rather than a thin beam. At its widest the cone is about 27 degrees, which smeared every edge, so I narrowed it to about 20 degrees, which turns the edge of a box into a sharp step. It reaches about 3 metres, so the scans show the shape of a room and its furniture rather than fine detail.</p>
          </section>

          <section id="colour" className="art-section" data-reveal>
            <h3>Colour</h3>
            <p>Before each sweep Stack-chan takes overlapping photos of the area with the CoreS3&rsquo;s camera. Each sample takes its colour from the photo that sees it closest to the middle, and the browser goes further: it pushes every pixel of the photos out to the distance the sensors measured in that direction, which is where the dense, coloured cloud comes from.</p>
            <p>The camera sits below the sensors, so the two never look from exactly the same place. I fitted the geometry against test scans of my desk, by lining up edges in the depth with edges in the photos, and found the sensors sit 9.4 cm above the tilt servo with the camera aimed 2 degrees to one side. The colours land closer to the right place now, but not perfectly.</p>
          </section>

          <section id="browser" className="art-section" data-reveal>
            <h3>In the browser</h3>
            <p>Stack-chan serves its own viewer, a small WebGL page compressed into the firmware, to any browser on the same Wi-Fi. It starts scans, shows the cloud growing as they run, switches between photo colour, samples and depth, and downloads the result as a .ply file. Tapping Stack-chan&rsquo;s face shows its network and the address to open, and if it can&rsquo;t join the Wi-Fi it starts its own.</p>
          </section>

          <section id="lessons" className="art-section" data-reveal>
            <h2>What broke</h2>
            <ul className="pt-parts lr-fixes">
              <li><b>The array flew off.</b><span>The servo library swings the head to each new angle as hard as it can, about 7 g at the sensors on a 90 degree swing, and once that knocked the whole array off. Every move now speeds up and slows down gently, capped at 90 degrees a second, which keeps it to about a quarter of a g. A Quick scan takes 54 seconds instead of 37.</span></li>
              <li><b>The page stopped responding.</b><span>During a scan only 13 KB of the chip&rsquo;s internal memory was free, and Wi-Fi and the web server need it. Moving the camera&rsquo;s frame copy and the scan buffers into the 8 MB of PSRAM left about 122 KB free mid-scan, and the viewer then answered every request under load.</span></li>
              <li><b>A scan vanished.</b><span>Scans only lived in memory, so a restart wiped one. The last scan is now saved to flash with its photos and comes back after a restart.</span></li>
            </ul>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                <li><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener"><b>Stack-chan</b></a><span>is M5Stack&rsquo;s little robot: a CoreS3 for a head on two servos, one that turns it and one that tips it. The CoreS3&rsquo;s ESP32-S3 runs the scanner, the web server and the camera.</span></li>
                <li><a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener"><b>Unit ToF4M</b></a><span>four times, each a VL53L1X time-of-flight sensor, mounted in a square on top of the head.</span></li>
                <li><a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener"><b>PaHub</b></a><span>lets all four sensors, which share one I2C address, hang off a single Grove port.</span></li>
              </ul>
              <figure className="lr-photo">
                <img src={I + 'cover.webp'} alt="The real Stack-chan with the four sensors on its head" loading="lazy" />
                <figcaption>The real one, sensors on top</figcaption>
              </figure>
            </div>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>Try it yourself</h2>
            <ol className="pt-steps">
              <li><p>Plug a PaHub into Stack-chan&rsquo;s Port A and the four Unit ToF4M into its channels 0 to 3, then mount them facing forward on top of the head.</p></li>
              <li><p>Open <a href={FLASHDECK} target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Stack-chan LiDAR</b>, plug Stack-chan in over USB-C and press Install.</p></li>
              <li><p>Join the <b>StackChan-LiDAR</b> Wi-Fi it starts, open <b>http://192.168.4.1/</b>, pick an area and a level of detail, and start a scan.</p></li>
            </ol>
            <p className="pt-note">The firmware on Flashdeck always starts its own Wi-Fi, because a public image can&rsquo;t carry a network password. Stack-chan only looks from level upwards, so set it on a table to scan a room.</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-lidar" />
    </main>
  );
}
