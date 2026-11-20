import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { Figtree } from 'next/font/google';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LidarStory, { type Chapter } from './LidarStory';
import LidarVideo from './LidarVideo';
import PlyPlayground from './PlyPlayground';
import './lidar.css';

const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--ls-sans', display: 'swap' });

const URL = 'https://www.chiambucket.com/stackchan-lidar';
const DESCRIPTION =
  'A makeshift LiDAR built on M5Stack’s Stack-chan: four Unit ToF4M distance sensors on its head, swept across a room by its two servos, with its camera colouring every point and a browser showing the scan in 3D.';

export const metadata: Metadata = {
  title: 'Stack-chan LiDAR | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Four distance sensors on Stack-chan’s head, swept across a room, turned into a coloured 3D scan you can explore.',
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

const I = '/images/stackchan-lidar/';
const FLASHDECK = 'https://flashdeck.shebang.pro/';

const CHAPTERS: Chapter[] = [
  { id: 'top', name: 'Stack-chan LiDAR' },
  { id: 'sweep', name: 'The sweep' },
  { id: 'sensors', name: 'Four sensors' },
  { id: 'colour', name: 'Colour' },
  { id: 'demo', name: 'Demo' },
  { id: 'play', name: 'Try the scan' },
  { id: 'notes', name: 'Build notes' },
  { id: 'setup', name: 'Make one' },
];

/** A caption inside a pinned chapter, shown while the chapter's --t is between a and b. */
function Cap({ a, b, n, title, children }: { a: number; b: number; n?: string; title: string; children: ReactNode }) {
  return (
    <div className="ls-cap" style={{ '--a': a, '--b': b } as CSSProperties}>
      {n && <span className="ls-num">{n}</span>}
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default function StackchanLidarPage() {
  return (
    <main className={`ls ${sans.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LidarStory chapters={CHAPTERS} />

      {/* ── Meet: Stack-chan close up beside the title; at the end the camera swings behind it ── */}
      <header className="ls-pin is-meet" data-shot="meet" id="top">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-meet.webp'} alt="Stack-chan drawn from M5Stack's models, with four Unit ToF4M sensors in a square on top of its head" />
          <div className="ls-intro">
            <a className="ls-back" href="/#projects">Back to projects</a>
            <div className="ls-tags">
              <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />Internship project</span>
              <span className="ls-feat">Featured</span>
              <AiMark project="proj-lidar" />
            </div>
            <h1 className="ls-title">Stack-chan LiDAR</h1>
            <p className="ls-lead">I put four distance sensors on Stack-chan&rsquo;s head and let its servos sweep them across a room. Its camera colours the points, and any browser on the same Wi-Fi shows the scan in 3D.</p>
            <div className="ls-toolrow">
              <span>Built with</span>
              <div className="icon-stack">
                <img src="/images/esp-icon.webp" alt="ESP32-S3" />
                <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
                <img src="/images/blender-icon.webp" alt="Blender" />
              </div>
            </div>
            <ArticleLinks links={[{ type: 'download', label: 'Flash the firmware', url: FLASHDECK }]} />
            <p className="ls-meta">Internship project at M5Stack, November 2026. Stack-chan (CoreS3), PaHub, four Unit ToF4M, C++ and WebGL.</p>
          </div>
          <div className="ls-cue" aria-hidden="true"><span>Scroll to run a scan</span><i /></div>
        </div>
      </header>

      {/* ── The sweep: the real scan fills in as the head pans across ── */}
      <section className="ls-pin is-sweep" data-shot="sweep" id="sweep">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-sweep.webp'} alt="Over Stack-chan's shoulder, its sensor cone reaching the wall while the scan fills in around the room" />
          <Cap a={0.04} b={0.5} n="01" title="It sweeps the room">
            <p>Stack-chan turns its head across the room in small steps and stops at every one to take a distance reading: a direction from the two servos and a distance from the sensors. This is the real scan from the demo, filling in as the head pans across.</p>
          </Cap>
          <Cap a={0.5} b={1.05} title="Wide and slow, or quick">
            <p>You choose the area, up to 256 degrees across and from level to straight up, and the detail. Quick steps the head 5 degrees at a time, Normal 3 and Fine 2, and a Quick scan of a 90 by 45 degree area takes under a minute.</p>
          </Cap>
        </div>
      </section>

      {/* ── Four sensors: a side view of the head, a beam from each sensor ── */}
      <section className="ls-pin is-sensors" data-shot="sensors" id="sensors">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-sensors.webp'} alt="The four Unit ToF4M on Stack-chan's head from the side, a beam from each one" />
          <Cap a={0.08} b={0.55} n="02" title="Four sensors, one reading">
            <p>The four Unit ToF4M share one Grove port through a PaHub and all point the same way, so they are four opinions about the same spot rather than four rays. Each step keeps the median of their first readings after the head stops moving, which throws out a stray one.</p>
          </Cap>
          <Cap a={0.55} b={1.05} title="A narrower cone">
            <p>Each sensor sees a cone, not a thin beam. At its widest the cone is about 27 degrees and it smeared every edge, so I narrowed it to about 20, which turns the edge of a box into a sharp step. The sensors reach about 3 metres, enough for the shape of a room.</p>
          </Cap>
        </div>
      </section>

      {/* ── Colour: depth fades into the photos' colours as the view pulls back ── */}
      <section className="ls-pin is-colour" data-shot="colour" id="colour">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-colour.webp'} alt="The finished scan from outside the room in the camera's colours" />
          <Cap a={0.06} b={0.55} n="03" title="Coloured by its own camera">
            <p>Before it sweeps, Stack-chan photographs the area with the CoreS3&rsquo;s camera. The browser pushes every pixel of those photos out to the distance the sensors measured in that direction, which turns a grid of readings into 68,206 coloured points.</p>
          </Cap>
          <Cap a={0.55} b={1.05} title="Lining up the photos">
            <p>The camera sits below the sensors, so the two never see from the same place. Fitting edges in the depth to edges in the photos put the sensors 9.4 cm above the tilt servo and the camera 2 degrees to one side. The colours land closer now, though not perfectly.</p>
          </Cap>
        </div>
      </section>

      {/* ── The rest of the page scrolls over the finished room ── */}
      <div className="ls-flow" data-shot="rest">
        <section id="demo" className="ls-block is-wide">
          <h2>Demo</h2>
          <p>I set Stack-chan on a table in the corner of an empty room and started a scan from my laptop. The film shows the head sweeping while the cloud grows in the browser, then the finished scan from every side, first as depth and then in the camera&rsquo;s colours.</p>
          <LidarVideo base="/videos/stackchan-lidar/" label="Stack-chan sweeping a room corner with the point cloud growing in the browser, then the finished scan in depth and photo colour" moments={[
            { t: 4, label: 'The sweep', note: 'The head works across the corner while the cloud fills in' },
            { t: 24, label: 'The finished cloud', note: 'The walls and ceiling around the corner, from outside' },
            { t: 34, label: 'Depth', note: 'Coloured by distance, showing the rings each row draws' },
            { t: 52, label: 'Photo colour', note: 'The same points coloured from Stack-chan’s own photos' },
          ]} />
        </section>

        <section id="play" className="ls-block is-wide">
          <h2>Try the scan</h2>
          <p>Here is the scan itself, with Stack-chan where it stood. Turn it round, colour it by the photos, by distance or by height, slice off the ceiling to look inside, or open a .ply of your own.</p>
          <PlyPlayground still={I + 'cloud.webp'} stillAlt="The finished scan from above: the walls and ceiling of a room corner, with a blue box on the table" />
        </section>

        <section id="notes" className="ls-block">
          <h2>Build notes</h2>
          <h3>From a handheld idea</h3>
          <p>I first wanted a scanner I could wave around a room like the LiDAR on an iPhone, with an IMU tracking where it pointed. An IMU only knows which way it faces, though, not where it is, and the iPhone works out its position from its camera. So I mounted the sensors on Stack-chan instead, whose two servos know exactly which way the head points, and let it do the sweeping.</p>
          <h3>A viewer in the robot</h3>
          <p>Stack-chan serves its own viewer, a small WebGL page compressed into the firmware, to any browser on the same Wi-Fi. It starts scans, shows the cloud growing as they run, switches between photo colour, samples and depth, and saves the result as a .ply file. Tapping Stack-chan&rsquo;s face shows its network and the address to open, and if it can&rsquo;t join the Wi-Fi it starts its own.</p>
          <h3>What broke</h3>
          <ul className="ls-fixes">
            <li><b>The array flew off.</b> The servo library swings the head to each new angle as hard as it can, about 7 g at the sensors on a 90 degree swing, and once that knocked the whole array off. Every move now speeds up and slows down gently, capped at 90 degrees a second, which keeps it to about a quarter of a g. A Quick scan takes 54 seconds instead of 37.</li>
            <li><b>The page stopped responding.</b> During a scan only 13 KB of the chip&rsquo;s internal memory was free, and Wi-Fi and the web server need it. Moving the camera&rsquo;s frame copy and the scan buffers into the 8 MB of PSRAM left about 122 KB free mid-scan, and the viewer then answered every request under load.</li>
            <li><b>A scan vanished.</b> Scans only lived in memory, so a restart wiped one. The last scan is now saved to flash with its photos and comes back after a restart.</li>
          </ul>
        </section>

        <section id="setup" className="ls-block">
          <h2>Make one</h2>
          <div className="ls-hw">
            <ul className="ls-parts">
              <li><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, M5Stack&rsquo;s little robot: a CoreS3 for a head on two servos. Its ESP32-S3 runs the scanner, the web server and the camera.</li>
              <li>Four <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, each a VL53L1X time-of-flight sensor, mounted in a square on top of the head.</li>
              <li>A <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, so the four sensors, which share one I2C address, can hang off one Grove port.</li>
            </ul>
            <figure className="ls-photo">
              <img src={I + 'cover.webp'} alt="The real Stack-chan with the four sensors on its head and their Grove cables looping down to the back" loading="lazy" />
              <figcaption>The real one</figcaption>
            </figure>
          </div>
          <ol className="ls-steps">
            <li>Plug a PaHub into Stack-chan&rsquo;s Port A and the four Unit ToF4M into its channels 0 to 3, then mount them facing forward on top of the head.</li>
            <li>Open <a href={FLASHDECK} target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Stack-chan LiDAR</b>, plug Stack-chan in over USB-C and press Install.</li>
            <li>Join the <b>StackChan-LiDAR</b> Wi-Fi it starts, open <b>http://192.168.4.1/</b>, pick an area and a level of detail, and start a scan.</li>
          </ol>
          <p className="ls-note">The firmware on Flashdeck always starts its own Wi-Fi, because a public image can&rsquo;t carry a network password. Stack-chan only looks from level upwards, so set it on a table to scan a room. The Stack-chan on this page is drawn from M5Stack&rsquo;s own 3D models (M5_Hardware, MIT licence), which I put together in Blender with the four sensors on top.</p>
        </section>
      </div>

      <ArticleRecommendations exclude="proj-lidar" />
    </main>
  );
}
