'use client';
/* ────────────────────────────────────────────────────────────────
   The Project June and BeadReader set pieces. Each is pure markup driven by
   CSS variables that HomeStory sets on its section from the scroll:
     --f, --g, --l   (June)  feeds, telemetry, signal path: 0 → 1 as each builds
     --b, --r, --s   (Bead)  the book, reading together, the spicy gate
     --c1 … --c3     the caption of each beat, 0 hidden → 1 shown
   Numbers that count up carry data-to / data-dp and are written by HomeStory.
   Every fact here comes from the Project June and BeadReader articles
   (CommandLink.tsx, ReadingTogether.tsx, SpicyGate.tsx).
   ──────────────────────────────────────────────────────────────── */
import type { CSSProperties, ReactNode } from 'react';

export type Beat = { title: string; text: string };

export const JUNE_BEATS: Beat[] = [
  { title: 'Three phones, three live feeds', text: 'Phone 1 is the main 5G hotspot and the front camera, phone 2 the second hotspot and the left camera, phone 3 the right camera. Each streams its view to my console over WebRTC.' },
  { title: 'Telemetry from the night run', text: 'The ESP32-S3 joins the phone hotspot and sends its GPS, temperature, humidity and light readings back over MQTT, about ten times a second.' },
  { title: 'From a controller to the road', text: 'An Xbox controller drives it through my web console. Commands go over MQTT through my server and the video comes back through my TURN server, with about a second of delay from over 8 km away.' },
];

export const BEAD_BEATS: Beat[] = [
  { title: 'It remembers your page', text: 'Open a book and Continue reading takes you back to the chapter you stopped on, in the reading theme you chose. Books are Markdown text or image webtoons.' },
  { title: 'Reading together', text: 'Friends on the same book get a green ring and their chapter. Tap to send a wave or a short note: it shows on their screen, fades in seconds and nothing is saved.' },
];

function Captions({ beats }: { beats: Beat[] }) {
  return (
    <ol className="hs-sp-caps">
      {beats.map((b, i) => (
        <li key={b.title} className="hs-sp-cap" style={{ '--v': `var(--c${i + 1})` } as CSSProperties}>
          <span className="hs-beat-n">{String(i + 1).padStart(2, '0')}</span>
          <h3>{b.title}</h3>
          <p>{b.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── Project June: mission control ── */
const FEEDS = [
  { key: 'left', label: 'Left', phone: 'Phone 2' },
  { key: 'center', label: 'Front', phone: 'Phone 1' },
  { key: 'right', label: 'Right', phone: 'Phone 3' },
];
// The night run's readings, as shown in the article's console (CommandLink.tsx).
const TELE = [
  { label: 'Latitude', to: 1.4602, dp: 4, unit: '°N' },
  { label: 'Longitude', to: 103.8359, dp: 4, unit: '°E' },
  { label: 'Satellites', to: 26, dp: 0, unit: '' },
  { label: 'Temperature', to: 29.2, dp: 1, unit: '°C' },
  { label: 'Humidity', to: 67, dp: 0, unit: '%' },
  { label: 'Speed', to: 3, dp: 1, unit: 'km/h' },
];
const LINK = [
  { label: 'Xbox controller', sub: 'Bluetooth to the console' },
  { label: 'My server', sub: 'MQTT, signalling, TURN' },
  { label: 'Three phones', sub: '5G hotspot and cameras' },
  { label: 'ESP32-S3', sub: 'Motors and sensors' },
];

export function JuneHud() {
  return (
    <div className="hs-sp hs-jh">
      <div className="hs-jh-visual" aria-hidden="true">
        <div className="hs-jh-feeds">
          {FEEDS.map((f, i) => (
            <figure key={f.key} className="hs-jh-feed" style={{ '--i': i } as CSSProperties}>
              <video muted loop playsInline preload="none" poster={`/images/home/feed-${f.key}.webp`} data-src={`/videos/rover-${f.key}-night.mp4`} />
              <figcaption><b>{f.label}</b><span>{f.phone}</span></figcaption>
              <i className="hs-jh-live">Live</i>
            </figure>
          ))}
        </div>
        <div className="hs-jh-strip">
          <dl className="hs-jh-tele">
            {TELE.map((t, i) => (
              <div key={t.label} style={{ '--i': i } as CSSProperties}>
                <dt>{t.label}</dt>
                <dd><b data-to={t.to} data-dp={t.dp}>{t.to.toFixed(t.dp)}</b>{t.unit && <span>{t.unit}</span>}</dd>
              </div>
            ))}
            <div className="hs-jh-place" style={{ '--i': TELE.length } as CSSProperties}><dt>Place</dt><dd><b>Sembawang Park</b></dd></div>
          </dl>
          <ol className="hs-jh-link">
            {/* one track from the first stop's centre to the last; it lights from the left */}
            <span className="hs-jh-wire"><i /></span>
            {LINK.map((n, i) => (
              <li key={n.label} style={{ '--i': i } as CSSProperties}><span className="hs-jh-node" /><b>{n.label}</b><span>{n.sub}</span></li>
            ))}
          </ol>
        </div>
      </div>
      <Captions beats={JUNE_BEATS} />
    </div>
  );
}

/* ── BeadReader: the real app on two phones ──
   Beat 1: the book page (Continue reading, chapter 12 marked "reading")
   turns from the light theme to the dark one, and beside it the reader
   opens on chapter 12. Beat 2: Mara's screen, with the "Online now" panel
   as you see it: rings, chapters, a wave and a note that reach her screen.
   Every screen is a real screenshot from public/images/beadreader. */
function Phone({ cls, children }: { cls: string; children: ReactNode }) {
  return <div className={`hs-bb-phone ${cls}`}><div className="hs-bb-screen">{children}</div></div>;
}

export function BeadBook() {
  return (
    <div className="hs-sp hs-bb">
      <div className="hs-bb-visual" aria-hidden="true">
        {/* beat 1: it remembers your page and your theme */}
        <div className="hs-bb-resume">
          <figure className="hs-bb-col">
            <Phone cls="is-book">
              <img src="/images/beadreader/contents-light.webp" alt="" loading="lazy" />
              <img className="hs-bb-dark" src="/images/beadreader/contents-dark.webp" alt="" loading="lazy" />
            </Phone>
            <figcaption><span className="hs-bb-theme"><b className="is-l">Light theme</b><b className="is-d">Dark theme</b></span>Your place, kept</figcaption>
          </figure>
          <span className="hs-bb-arrow"><i /></span>
          <figure className="hs-bb-col is-reader">
            <Phone cls="is-reader">
              <img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" />
            </Phone>
            <figcaption><span className="hs-bb-theme"><b>Paper theme</b></span>Back on chapter 12</figcaption>
          </figure>
        </div>
        {/* beat 2: reading together */}
        <div className="hs-bb-together">
          <figure className="hs-bb-col is-mara">
            <Phone cls="is-mara">
              <img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" />
              <p className="hs-bb-toast is-wave"><span>👋</span>Braven waved at you</p>
              <p className="hs-bb-toast is-note"><b>Braven</b>loved that twist!</p>
            </Phone>
            <figcaption>Mara’s screen</figcaption>
          </figure>
          <div className="hs-bb-online">
            <p className="hs-bb-online-h">Online now</p>
            <ul>
              <li className="is-mara">
                <span className="hs-bb-av">M<em>12</em></span>
                <span className="hs-bb-who"><b>Mara</b><small>Reading here · ch 12</small></span>
                <span className="hs-bb-acts"><i className="is-wave">👋</i><i className="is-note">💬</i></span>
              </li>
              <li className="hs-bb-notebox"><span>loved that twist!</span><i>➤</i></li>
              <li>
                <span className="hs-bb-av">J</span>
                <span className="hs-bb-who"><b>Jae</b><small>The Hobbit · ch 3</small></span>
                <span className="hs-bb-acts"><i>👋</i><i>💬</i></span>
              </li>
              <li className="is-sam">
                <span className="hs-bb-av">S<em>1</em></span>
                <span className="hs-bb-who"><b>Sam</b><small className="is-a">Browsing</small><small className="is-b">Reading here · ch 1</small></span>
                <span className="hs-bb-acts"><i>👋</i><i>💬</i></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Captions beats={BEAD_BEATS} />
    </div>
  );
}
