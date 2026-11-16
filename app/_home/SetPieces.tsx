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
import type { CSSProperties } from 'react';

export type Beat = { title: string; text: string };

export const JUNE_BEATS: Beat[] = [
  { title: 'Three phones, three live feeds', text: 'Phone 1 is the main 5G hotspot and the front camera, phone 2 the second hotspot and the left camera, phone 3 the right camera. Each streams its view to my console over WebRTC.' },
  { title: 'Telemetry from the night run', text: 'The ESP32-S3 joins the phone hotspot and sends its GPS, temperature, humidity and light readings back over MQTT, about ten times a second.' },
  { title: 'From a controller to the road', text: 'An Xbox controller drives it through my web console. Commands go over MQTT through my server and the video comes back through my TURN server, with about a second of delay from over 8 km away.' },
];

export const BEAD_BEATS: Beat[] = [
  { title: 'It remembers your page', text: 'Every reader picks up where they stopped, in the reading theme they chose. Books are Markdown text or image webtoons.' },
  { title: 'Reading together', text: 'Friends on the same book get a green ring and their chapter. Send a wave or a short note: it fades in seconds and nothing is saved.' },
  { title: 'The spicy gate', text: 'Each reader’s access decides what the server sends: blurred until tapped, locked, or removed with no gap. The gate is enforced in the SQL query.' },
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
                <dd><b data-to={t.to} data-dp={t.dp}>{(0).toFixed(t.dp)}</b>{t.unit && <span>{t.unit}</span>}</dd>
              </div>
            ))}
            <div className="hs-jh-place" style={{ '--i': TELE.length } as CSSProperties}><dt>Place</dt><dd><b>Sembawang Park</b></dd></div>
          </dl>
          <ol className="hs-jh-link">
            <svg className="hs-jh-wire" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M12.5 5 H87.5" pathLength={1} /></svg>
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

/* ── BeadReader: a book read together ── */
// Only lines that appear in the app's own screenshot of its reader (public/images/beadreader/reader-paper.webp).
const LEAVES = [
  ['I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before.', 'It was a fine, thick piece of wood, bulbous-headed, of the sort which is known as a “Penang lawyer.”'],
  ['“To the man who loves art for its own sake,” remarked Sherlock Holmes,', '“it is frequently in its least important and lowliest manifestations that the keenest pleasure is to be derived.”'],
  ['Mr. Sherlock Holmes, who was usually very late in the mornings,', 'was seated at the breakfast table.'],
];
const GATE = {
  lead: 'They had circled each other all evening. When the last guest finally left, the room went quiet.',
  spicy: 'What happened next stayed between them and the low light of the fire.',
  trail: 'Morning came far too soon.',
};

export function BeadBook() {
  return (
    <div className="hs-sp hs-bb">
      <div className="hs-bb-visual" aria-hidden="true">
        <div className="hs-bb-book">
          <div className="hs-bb-page is-left">
            <p className="hs-bb-crumb">A Study in Scarlet</p>
            <h4>The Science of Deduction</h4>
            <p>Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table.</p>
            <p className="hs-bb-progress"><span><i /></span>Chapter 12 of 16</p>
          </div>
          <div className="hs-bb-page is-right">
            <p>“To the man who loves art for its own sake,” remarked Sherlock Holmes, “it is frequently in its least important and lowliest manifestations that the keenest pleasure is to be derived.”</p>
          </div>
          {LEAVES.map(([front, back], i) => (
            <div key={i} className="hs-bb-leaf" style={{ '--i': i } as CSSProperties}>
              <div className="hs-bb-face is-front"><p>{front}</p></div>
              <div className="hs-bb-face is-back"><p>{back}</p></div>
            </div>
          ))}
        </div>
        <div className="hs-bb-online">
          <p className="hs-bb-online-h">Online now</p>
          <ul>
            <li className="is-here"><span className="hs-bb-av">M<em>12</em></span><span><b>Mara</b><small>Reading here, chapter 12</small></span></li>
            <li><span className="hs-bb-av">J</span><span><b>Jae</b><small>The Hobbit, chapter 3</small></span></li>
            <li className="hs-bb-sam"><span className="hs-bb-av">S<em>1</em></span><span><b>Sam</b><small className="is-a">Browsing the library</small><small className="is-b">This book, chapter 1</small></span></li>
          </ul>
          <p className="hs-bb-note">loved that twist!</p>
        </div>
        <div className="hs-bb-gate">
          <ul className="hs-bb-modes">
            <li className="is-full">Full access</li>
            <li className="is-none">No access</li>
            <li className="is-cal">Cal mode</li>
          </ul>
          <div className="hs-bb-passage">
            <p>{GATE.lead}</p>
            <p className="hs-bb-spicy"><span>{GATE.spicy}</span><i>Locked</i></p>
            <p className="hs-bb-trail">{GATE.trail}</p>
          </div>
        </div>
      </div>
      <Captions beats={BEAD_BEATS} />
    </div>
  );
}
