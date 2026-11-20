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
  'A LiDAR made from M5Stack’s Stack-chan, which sweeps four Unit ToF4M distance sensors across a room with its servos, colours the points with its camera and shows the scan in 3D in any browser.';

export const metadata: Metadata = {
  title: 'Stack-chan LiDAR | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Stack-chan sweeps four distance sensors across a room and turns the readings into a coloured 3D scan you can explore.',
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
            <p className="ls-lead">I turned Stack-chan into a LiDAR by putting four distance sensors on its head and letting its servos sweep them across a room. Its camera colours the points, and any browser on the same Wi-Fi shows the scan in 3D as it builds.</p>
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
          <Cap a={0.04} b={0.5} n="01" title="Sweeping the room">
            <p>Stack-chan turns its head across the room a few degrees at a time and stops at every step to measure how far away the wall is. The servos give the direction and the sensors give the distance, so every step adds a point in 3D. This is the real scan from the demo, filling in as the head pans across.</p>
          </Cap>
          <Cap a={0.5} b={1.05} title="Choosing the area and detail">
            <p>Before a scan I pick how much of the room to cover, up to 256 degrees across and from level to straight up, and how fine the steps are. Quick moves the head 5 degrees at a time, Normal 3 and Fine 2, and a Quick scan of a 90 by 45 degree area takes under a minute.</p>
          </Cap>
        </div>
      </section>

      {/* ── Four sensors: a side view of the head, a beam from each sensor ── */}
      <section className="ls-pin is-sensors" data-shot="sensors" id="sensors">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-sensors.webp'} alt="The four Unit ToF4M on Stack-chan's head from the side, a beam from each one" />
          <Cap a={0.08} b={0.55} n="02" title="Four sensors on one port">
            <p>The four Unit ToF4M plug into one Grove port through a PaHub and all point the same way, so every step gets four readings of the same spot. Stack-chan keeps the middle one once the head has stopped moving, which throws away the odd bad reading.</p>
          </Cap>
          <Cap a={0.55} b={1.05} title="A narrower view">
            <p>Each sensor sees a cone rather than a thin beam, and at its widest setting of about 27 degrees it blurred every edge. I narrowed it to about 20 degrees, so the edge of a box now shows as a clean step, and the sensors still reach about 3 metres, which is enough for a whole room.</p>
          </Cap>
        </div>
      </section>

      {/* ── Colour: depth fades into the photos' colours as the view pulls back ── */}
      <section className="ls-pin is-colour" data-shot="colour" id="colour">
        <div className="ls-sticky">
          <img className="ls-still" src={I + 'shot-colour.webp'} alt="The finished scan from outside the room in the camera's colours" />
          <Cap a={0.06} b={0.55} n="03" title="Colour from its camera">
            <p>Before it sweeps, Stack-chan takes photos of the area with the CoreS3&rsquo;s camera. The browser then places every pixel of those photos at the distance the sensors measured in that direction, which turns a grid of readings into 68,206 coloured points.</p>
          </Cap>
          <Cap a={0.55} b={1.05} title="Lining up the photos">
            <p>The camera sits below the sensors, so the photos and the distances are taken from slightly different places. I lined them up by matching the edges in the depth to the edges in the photos, and the colours now land in the right place on most of the room, though not everywhere.</p>
          </Cap>
        </div>
      </section>

      {/* ── The rest of the page scrolls over the finished room ── */}
      <div className="ls-flow" data-shot="rest">
        <section id="demo" className="ls-block is-wide">
          <h2>Demo</h2>
          <p>I put Stack-chan on a table in the corner of an empty room and started a scan from my laptop. The video shows the head sweeping while the points build up in the browser, and then the finished scan from every side, first coloured by distance and then by the camera.</p>
          <LidarVideo base="/videos/stackchan-lidar/" label="Stack-chan sweeping a room corner with the point cloud growing in the browser, then the finished scan in depth and photo colour" moments={[
            { t: 4, label: 'The sweep', note: 'The head works across the corner while the points fill in' },
            { t: 24, label: 'The finished scan', note: 'The walls and ceiling of the corner, seen from outside' },
            { t: 34, label: 'Depth', note: 'Each point coloured by how far away it is' },
            { t: 52, label: 'Photo colour', note: 'The same points coloured by Stack-chan’s photos' },
          ]} />
        </section>

        <section id="play" className="ls-block is-wide">
          <h2>Try the scan</h2>
          <p>This is the same scan, with Stack-chan standing where it was. You can drag to turn it, scroll or pinch to zoom, right-drag or use two fingers to move around and double-click any spot to fly to it. The eye button puts you in Stack-chan&rsquo;s head to see the room the way it did, and you can open a .ply file of your own as well.</p>
          <PlyPlayground still={I + 'cloud.webp'} stillAlt="The finished scan from above: the walls and ceiling of a room corner, with a blue box on the table" />
        </section>

        <section id="setup" className="ls-block">
          <h2>Make one</h2>
          <div className="ls-hw">
            <ul className="ls-parts">
              <li><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, M5Stack&rsquo;s little robot, which has a CoreS3 for a head on two servos. Its ESP32-S3 runs the scan, the web server and the camera.</li>
              <li>Four <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, which are VL53L1X time-of-flight distance sensors, mounted in a square on top of the head.</li>
              <li>A <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, which lets the four sensors share one Grove port even though they all have the same I2C address.</li>
            </ul>
            <figure className="ls-photo">
              <img src={I + 'cover.webp'} alt="The real Stack-chan with the four sensors on its head and their Grove cables looping down to the back" loading="lazy" />
              <figcaption>The real Stack-chan with its sensors</figcaption>
            </figure>
          </div>
          <ol className="ls-steps">
            <li>Plug a PaHub into Stack-chan&rsquo;s Port A and the four Unit ToF4M into its channels 0 to 3, then mount the sensors on top of the head facing forward.</li>
            <li>Open <a href={FLASHDECK} target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Stack-chan LiDAR</b>, plug Stack-chan in over USB-C and press Install.</li>
            <li>Join the <b>StackChan-LiDAR</b> Wi-Fi network it starts and open <b>http://192.168.4.1/</b>, which Stack-chan also shows when you tap its face. Then pick an area and a level of detail and start a scan.</li>
          </ol>
          <p className="ls-note">The firmware on Flashdeck always starts its own Wi-Fi network, because a public download can&rsquo;t carry your network&rsquo;s password. Stack-chan only looks from level upwards, so put it on a table to scan a room. The Stack-chan on this page is built from M5Stack&rsquo;s own 3D models (M5_Hardware, MIT licence), which I put together in Blender with the four sensors on top.</p>
        </section>
      </div>

      <ArticleRecommendations exclude="proj-lidar" />
    </main>
  );
}
