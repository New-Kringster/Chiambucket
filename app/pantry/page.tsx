import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import AiMark from '../../components/AiMark';
import ArticleLinks from '../../components/ArticleLinks';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import LazyVideo from '../../components/LazyVideo';
import { Screen } from './Core';
import DemoVideo from './DemoVideo';
import PantrySim from './PantrySim';
import './pantry.css';

const URL = 'https://www.chiambucket.com/pantry';
const DESCRIPTION =
  'An expiry tracker for the fridge door, built on an M5Stack CoreS3 SE and a QRCode module during my internship at M5Stack. You scan a barcode and pick when it expires, and the screen always shows what to eat first, while a small server names the products and sends reminders to Home Assistant.';

export const metadata: Metadata = {
  title: 'Pantry Expiry Tracker | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Pantry Expiry Tracker | Braven Chiam',
    description: 'Scan a barcode, pick when it expires, and the fridge door shows what to eat first.',
    url: URL,
    type: 'article',
    images: [{ url: '/images/pantry-pf-context.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pantry Expiry Tracker',
  description: DESCRIPTION,
  image: 'https://www.chiambucket.com/images/pantry-pf-context.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: URL,
  about: ['M5Stack CoreS3 SE', 'ESP32-S3', 'barcode scanner', 'Home Assistant', 'MQTT', 'Open Food Facts'],
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = '/images/pantry/';
const REPO = 'https://github.com/New-Kringster/Pantry_tracker_code';
const DL = REPO + '/releases/latest/download/';
const FLASHDECK = 'https://flashdeck.shebang.pro/';
const V = '/videos/pantry/';

/* One feature: the screen (and sometimes a clip of it in the hand) beside a few words. */
function Feature({ id, title, children, media, flip }: { id: string; title: string; children: React.ReactNode; media: React.ReactNode; flip?: boolean }) {
  return (
    <section id={id} className={`art-section pt-feat${flip ? ' flip' : ''}`} data-reveal>
      <div className="pt-feat-media">{media}</div>
      <div className="pt-feat-copy"><h3>{title}</h3>{children}</div>
    </section>
  );
}

export default function PantryPage() {
  return (
    <main className="art pt">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="art-hero">
        <div className="art-hero-bg"><img src={I + 'cover.webp'} alt="The pantry tracker: a CoreS3 SE stacked on the QRCode module and its battery base, the screen glowing red while it scans" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#projects"><BackArrow /> Back to projects</a>
          <div className="art-tags">
            <span className="hp-md-tag internship"><i className="hp-m5" aria-hidden="true" />Internship project</span>
            <AiMark project="proj-pantry" />
          </div>
          <h1 className="art-title">Pantry <em>Expiry Tracker</em></h1>
          <p className="art-lead">I built this expiry tracker for the fridge door during my internship at M5Stack. You scan a product&rsquo;s barcode and pick when it expires, and the screen always shows what to eat first, with product names in Chinese or English.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/esp-icon.webp" alt="ESP32-S3" />
              <img src="/images/PlatformIO-icon.webp" alt="PlatformIO" />
              <img src="/images/python-icon.webp" alt="Python" />
              <img src="/images/docker-icon.webp" alt="Docker" />
              <img src="/images/mosquitto-icon.svg" alt="Mosquitto MQTT" />
            </div>
          </div>
          <ArticleLinks
            links={[
              { type: 'github', label: 'GitHub', url: REPO },
              { type: 'download', label: 'Flash the firmware', url: FLASHDECK },
              { type: 'download', label: 'Server downloads', url: REPO + '/releases/latest' },
            ]}
          />
          <p className="pt-meta">Internship project at M5Stack, November 2026. M5Stack CoreS3 SE, Module13.2 QRCode, C++, Python, Docker, MQTT.</p>
        </div>
      </header>

      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#demo">Demo</a>
              <a href="#try">Try it</a>
              <a href="#features">What it does</a>
              <a href="#scan" className="sub">Scan a product</a>
              <a href="#first" className="sub">What to eat first</a>
              <a href="#again" className="sub">Scan again to open it</a>
              <a href="#swipe" className="sub">Swipe to delete</a>
              <a href="#pantries" className="sub">Several pantries</a>
              <a href="#control" className="sub">Control centre</a>
              <a href="#web" className="sub">In a browser</a>
              <a href="#ha" className="sub">Home Assistant</a>
              <a href="#how">How it works</a>
              <a href="#hardware">Hardware</a>
              <a href="#setup">Setting one up</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">
          <section id="demo" className="art-section" data-reveal>
            <h2>Demo</h2>
            <p>I filmed this at my desk, first scanning products off a demo sheet on my laptop and then a real carton of 冰红茶, before scanning the carton a second time and moving to a second pantry.</p>
            <DemoVideo />
          </section>

          <section id="try" className="art-section" data-reveal>
            <h2>Try it</h2>
            <p>This is a copy of the tracker&rsquo;s screen that runs the same steps. Tap <b>SCAN NOW</b> and pick a product from the shelf to hold up to the scanner, then set when it expires and save it. You can also swipe a card to the left to delete it, and scanning something that is already on the list opens it instead.</p>
            <PantrySim />
            <p className="pt-note">The barcodes on the shelf are the products&rsquo; real EAN-13 codes, so the tracker itself can scan them off this page.</p>
          </section>

          <section id="features" className="art-section" data-reveal>
            <h2>What it does</h2>
            <p>The tracker sits on the fridge door, and every screen below is a capture from it.</p>
          </section>

          <Feature id="scan" title="Scan a product"
            media={<div className="pt-duo"><LazyVideo webm={V + 'scan.webm'} mp4={V + 'scan.mp4'} poster={V + 'scan.webp'} className="pt-clip" /><Screen src={I + 'screen-expiry-picker.webp'} alt="The expiry picker for 牛奶面包 by Brioche Pasquier, with Days 0, Weeks 1 and Months 0, a week from today, and a green SAVE button" /></div>}>
            <p>When you tap <b>SCAN NOW</b> and hold a barcode about a hand&rsquo;s width from the scan window, the screen glows red while the scanner looks for a code. The tracker then shows the product&rsquo;s name, brand, size and photo, which mostly come from Open Food Facts, while products sold in mainland China come from GS1 China through a free account.</p>
            <p>You set the expiry with the arrows under Days, Weeks and Months and then tap <b>SAVE</b>.</p>
          </Feature>

          <Feature id="first" title="See what to eat first" flip
            media={<Screen src={I + 'screen-home.webp'} alt="The home screen: Prince expired in red, Pesto alla Genovese in 2 days and Skyr in 5 days in amber, with SCAN NOW at the bottom" />}>
            <p>The home screen lists the pantry with the soonest expiry at the top, and the count turns red within a day of the date and amber within a week.</p>
          </Feature>

          <Feature id="again" title="Scan again to open it"
            media={<Screen src={I + 'screen-item-detail.webp'} alt="The item page for Barilla Pesto alla Genovese: added today, expires Wednesday 2026-11-11, 2 days, with a red DELETE button" />}>
            <p>Scanning something that is already on the list opens it instead of adding it twice, so you can check its date or delete it from there.</p>
          </Feature>

          <Feature id="swipe" title="Swipe to delete" flip
            media={<div className="pt-duo"><LazyVideo webm={V + 'swipe.webm'} mp4={V + 'swipe.mp4'} poster={V + 'swipe.webp'} className="pt-clip" /><Screen src={I + 'screen-swipe-delete.webp'} alt="The Prince card slid to the left, showing a red bin button" /></div>}>
            <p>Swiping an item from right to left shows a red bin to tap, and swiping from left to right anywhere takes you back.</p>
          </Feature>

          <Feature id="pantries" title="Keep several pantries"
            media={<Screen src={I + 'screen-pantry-menu.webp'} alt="The pantry menu open: Default Pantry with 6 items, Fridge with 1, and Create Pantry" />}>
            <p>The <b>Pantry</b> button switches between pantries such as the fridge, the freezer or a cupboard, and it can create a new one too.</p>
          </Feature>

          <Feature id="control" title="A control centre" flip
            media={<Screen src={I + 'screen-control-centre.webp'} alt="The control centre: a beep switch, a brightness slider, 100% battery and Home Assistant connected" />}>
            <p>The status button at the top right opens the beep switch, the screen brightness and the battery level, and its house icon turns green when the tracker is connected to Home Assistant.</p>
          </Feature>

          <section id="web" className="art-section" data-reveal>
            <h3>Manage it from a browser</h3>
            <p>The same list is on a web page, where you can add items by barcode, rename them and organise pantries from a computer or a phone. A small badge beside each name shows where it came from, such as OFF for Open Food Facts or GS1 for GS1 China.</p>
            <figure className="art-fig">
              <img src={I + 'web-list.webp'} alt="The pantry web page: tabs for All, Default Pantry and Fridge, a barcode and date form, and the items sorted by expiry with their source badges" loading="lazy" />
              <figcaption>The pantry web page</figcaption>
            </figure>
          </section>

          <section id="ha" className="art-section" data-reveal>
            <h3>Reminders in Home Assistant</h3>
            <p>Each pantry appears in Home Assistant as its own device, with its item count, what is expiring soon and the next item to expire. Every scan, add and delete also fires an event, so you can build your own automations on top of it, such as a reminder on your phone the day before something expires.</p>
            <figure className="art-fig">
              <img src={I + 'ha-devices.webp'} alt="Three devices in Home Assistant: Pantry Tracker, Default Pantry and Fridge, each with expired, expiring soon, item count and next expiry" loading="lazy" />
              <figcaption>The pantry devices in Home Assistant</figcaption>
            </figure>
          </section>

          <section id="how" className="art-section" data-reveal>
            <h2>How it works</h2>
            <p>The tracker only handles the screen and the scanner, while a Docker container on the home network does the rest: it stores the list, looks up barcodes, caches product photos and publishes everything to Home Assistant over MQTT. I split it this way because the ESP32-S3 can&rsquo;t run the GS1 China sign-in, and because keeping one list on the server means the tracker, the web page and Home Assistant always agree.</p>
            <figure className="art-fig">
              <img src={I + 'diagram-system-overview.webp'} alt="System overview: the tracker on the fridge talks to the pantry server over WiFi, the server looks products up on Open Food Facts and GS1 China and publishes to Home Assistant over MQTT, and any browser can open its web page" loading="lazy" />
              <figcaption>How the parts connect</figcaption>
            </figure>
            <figure className="art-fig">
              <img src={I + 'diagram-scan-flow.webp'} alt="What happens when you scan: the barcode is read over UART, the server is asked whether it is already saved, the product is looked up and cached, you pick the expiry, the item is saved and Home Assistant is updated" loading="lazy" />
              <figcaption>What happens when you scan</figcaption>
            </figure>
          </section>

          <section id="hardware" className="art-section" data-reveal>
            <h2>Hardware</h2>
            <div className="pt-hw">
              <ul className="pt-parts">
                <li><a href="https://shop.m5stack.com/products/m5stack-cores3-se-iot-controller-w-o-battery-bottom" target="_blank" rel="noopener"><b>CoreS3 SE</b></a><span>runs the tracker, with the touch screen and WiFi.</span></li>
                <li><a href="https://shop.m5stack.com/products/qr-code-scanner-module-13-2" target="_blank" rel="noopener"><b>Module13.2 QRCode</b></a><span>reads 1D and 2D barcodes and stacks under the CoreS3 SE.</span></li>
                <li><b>A battery base</b><span>goes underneath, so it runs on the fridge without a cable.</span></li>
              </ul>
              <figure className="pt-fridge">
                <img src={I + 'fridge.webp'} alt="The tracker stuck to a grey fridge door, showing its Set me up screen with a QR code" loading="lazy" />
                <figcaption>On the fridge door, ready to be set up</figcaption>
              </figure>
            </div>
            <p>You also need a computer that stays on for the server, and Home Assistant if you want reminders.</p>
          </section>

          <section id="setup" className="art-section" data-reveal>
            <h2>Setting one up</h2>
            <p>Everything you need is free to download: the firmware flashes from your browser, and the server comes as a Docker bundle with its images included, so nothing has to be pulled from Docker Hub while it installs.</p>
            <ol className="pt-steps">
              <li>
                <p>On the QRCode module, slide the interface toggle to UART and switch on number 2 in both the TX and RX DIP blocks, then stack the three parts.</p>
                <figure className="art-fig"><img src={I + 'diagram-hardware-setup.webp'} alt="The interface toggle set to UART, switch 2 on in the TX and RX DIP blocks, and the CoreS3 SE stacked on the module and the battery base" loading="lazy" /></figure>
              </li>
              <li><p>Open <a href={FLASHDECK} target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Pantry</b>, plug the CoreS3 SE in over USB-C and press <b>Install</b>, which flashes the firmware straight from the browser.</p></li>
              <li>
                <p>Download the server for the computer that will run it, either the <a href={DL + 'pantry-server-docker-amd64.tar.gz'}>bundle for Intel and AMD computers</a> or the <a href={DL + 'pantry-server-docker-arm64.tar.gz'}>bundle for Apple Silicon Macs and a Raspberry Pi</a>. Unpack it, set <code>TZ</code> in <code>docker-compose.yml</code> to your time zone and run <code>./install.sh</code> in that folder.</p>
              </li>
              <li>
                <p>Turn the tracker on, scan the QR code on its screen with your phone, and enter your WiFi and the server address, for example <code>http://192.168.1.20:8080</code>.</p>
                <figure className="art-fig"><img src={I + 'diagram-first-boot.webp'} alt="First boot: the tracker opens a Pantry hotspot with a QR code, the phone joins it, the setup page takes the WiFi and server address, and the home screen loads" loading="lazy" /></figure>
              </li>
              <li>
                <p>Tap <b>SCAN NOW</b> and scan this code once, which switches the scan engine from USB to serial.</p>
                <figure className="pt-code"><img src={I + 'serial-mode-code.webp'} alt="The scan engine setting code 21424000, Serial Communication" loading="lazy" /></figure>
              </li>
              <li><p>In Home Assistant, add the MQTT integration with the server&rsquo;s IP address and port 1883.</p></li>
              <li><p>For Chinese barcodes, add a free gds.org.cn account under <b>Settings</b> on the server&rsquo;s web page and sign in once.</p></li>
            </ol>
            <p>The <a href={REPO} target="_blank" rel="noopener">GitHub repository</a> has the full guide in its README, along with the firmware and server code if you would rather build them yourself.</p>
            <p className="pt-note">Product names and photos on this page come from Open Food Facts (CC BY-SA) and GS1 China.</p>
          </section>
        </div>
      </div>
      <ArticleRecommendations exclude="proj-pantry" />
    </main>
  );
}
