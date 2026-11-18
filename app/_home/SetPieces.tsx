'use client';
/* ────────────────────────────────────────────────────────────────
   The Project June and BeadReader set pieces. Each is pure markup driven by
   CSS variables that HomeStory sets on its section from the scroll:
     --f, --g, --l   (June)  feeds, telemetry, signal path: 0 → 1 as each builds
     --f, --g        (Bead)  your place, reading together; inside beat 1
                     --lift, --tap, --push, --scr, --mark step through it
     --c1 … --c3     the caption of each beat, 0 hidden → 1 shown
   Numbers that count up carry data-to / data-dp and are written by HomeStory.
   Every fact here comes from the Project June and BeadReader articles
   (CommandLink.tsx, ReadingTogether.tsx, SpicyGate.tsx).
   ──────────────────────────────────────────────────────────────── */
import type { CSSProperties, ReactNode } from 'react';

export type Beat = { title: string; text: string };

export const JUNE_BEATS: Beat[] = [
  { title: 'Three live feeds from three phones', text: 'Phone 1 is the main 5G hotspot and the front camera, phone 2 is the second hotspot and the left camera, and phone 3 is the right camera. Each one streams its view to my console over WebRTC.' },
  { title: 'Telemetry from the night run', text: 'The ESP32-S3 joins the phone hotspot and sends its GPS, temperature, humidity and light readings back over MQTT, about ten times a second.' },
  { title: 'From a controller to the road', text: 'I drive it with an Xbox controller through my web console. The commands go over MQTT through my server and the video comes back through my TURN server, with about a second of delay from over 8 km away.' },
];

export const BEAD_BEATS: Beat[] = [
  { title: 'It remembers your page', text: 'The Who’s reading list shows how far each reader has got, and tapping your own row opens the same chapter at the line you stopped on.' },
  { title: 'Reading together', text: 'Friends on the same book show a green ring and their chapter. You can tap to send a wave or a short note, which fades from their screen in seconds and is never saved.' },
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

/* ── BeadReader: the real app in an iPhone 16 ──
   The phone is Braven's iPhone 16 mockup (public/images/home/iphone16-front.webp,
   flattened from the PSD with the screen cut out), so the screens are live
   markup under it. Sizes inside the phone use --fu (one frame pixel of the
   1046 × 2159 mockup) and --su (one pixel of the 880-wide app screenshots).
   Beat 1, on Mara's phone: her row of "Who's reading" lifted out of the
   book page as a cut-out, set back, tapped, and the book opening on
   chapter 12 at the line she stopped on. Beat 2: the same screen with the
   "Online now" panel beside it, a wave and a note reaching her as toasts.
   Every screen is a real screenshot from public/images/beadreader. */
function Phone({ cls, children, over }: { cls: string; children: ReactNode; over?: ReactNode }) {
  return (
    <div className={`hs-bb-phone ${cls}`}>
      <div className="hs-bb-screen">{children}<i className="hs-bb-home" /></div>
      <img className="hs-bb-frame" src="/images/home/iphone16-front.webp" alt="" loading="lazy" />
      {over}
    </div>
  );
}

function Status() {
  return (
    <p className="hs-bb-status">
      <b>9:41</b>
      <svg viewBox="0 0 68 24" aria-hidden="true">
        <rect x="0" y="15" width="4" height="6" rx="1" /><rect x="6" y="12" width="4" height="9" rx="1" /><rect x="12" y="8" width="4" height="13" rx="1" /><rect x="18" y="4" width="4" height="17" rx="1" />
        <path d="M37 19.5a2 2 0 1 0 0.01 0zM31.5 14.2a7.8 7.8 0 0 1 11 0l-1.7 1.7a5.4 5.4 0 0 0-7.6 0zM28 10.7a12.7 12.7 0 0 1 18 0l-1.7 1.7a10.3 10.3 0 0 0-14.6 0z" />
        <rect x="50.5" y="5.5" width="14" height="13" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.45" /><rect x="52.5" y="7.5" width="10" height="9" rx="2" /><rect x="65.6" y="9.5" width="1.6" height="5" rx="0.8" opacity="0.45" />
      </svg>
    </p>
  );
}

/** The reader on chapter 12: the screenshot's top bar stays put while the page
    under it scrolls (--scr) to the saved line, which is marked (--mark). */
function Reader() {
  return (
    <div className="hs-bb-app is-reader">
      <Status />
      <div className="hs-bb-rbar"><img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" /></div>
      <div className="hs-bb-rbody">
        <div className="hs-bb-rpage">
          <img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" />
          <i className="hs-bb-here" />
          <b className="hs-bb-herechip"><svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 1h10v14l-5-4-5 4z" /></svg>You were here</b>
        </div>
      </div>
    </div>
  );
}

/** Mara's row of "Who's reading", as the book page draws it. */
function ReadingRow({ cls }: { cls: string }) {
  return (
    <div className={`hs-bb-row ${cls}`}>
      <span className="hs-bb-row-av">M</span>
      <span className="hs-bb-row-name">Mara</span>
      <span className="hs-bb-row-chip">reading now</span>
      <span className="hs-bb-row-bar"><i /></span>
      <span className="hs-bb-row-pct">75%</span>
      <span className="hs-bb-row-sub">On chapter 12 of 16 · read 2h 15m</span>
    </div>
  );
}

export function BeadBook() {
  return (
    <div className="hs-sp hs-bb">
      <div className="hs-bb-visual" aria-hidden="true">
        {/* beat 1: it remembers your page */}
        <figure className="hs-bb-col hs-bb-resume">
          <Phone
            cls="is-resume"
            over={<>
              <ReadingRow cls="is-cut" />
              <i className="hs-bb-touch" />
            </>}
          >
            <div className="hs-bb-app is-contents">
              <Status />
              <div className="hs-bb-cpage">
                <img src="/images/beadreader/contents-light.webp" alt="" loading="lazy" />
                <i className="hs-bb-slot" />
              </div>
              <i className="hs-bb-dim" />
            </div>
            <Reader />
          </Phone>
          <figcaption>Mara’s phone</figcaption>
        </figure>
        {/* beat 2: reading together */}
        <div className="hs-bb-together">
          <figure className="hs-bb-col is-mara">
            <Phone cls="is-mara">
              <Reader />
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
