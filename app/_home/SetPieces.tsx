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
import { fill } from '@/lib/fill';
import { useHomeCopy } from './copyContext';

export type Beat = { title: string; text: string };

/* Every word here is the homepage copy's (useHomeCopy): the beats are its
   flagships[id].beats, the set pieces' own labels its june, pip, lidar and bead. */

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
const FEEDS = ['left', 'center', 'right'] as const;
// The night run's readings, as shown in the article's console (CommandLink.tsx).
// Their labels are the copy's june.tele, in this order.
const TELE = [
  { to: 1.4602, dp: 4, unit: '°N' },
  { to: 103.8359, dp: 4, unit: '°E' },
  { to: 26, dp: 0, unit: '' },
  { to: 29.2, dp: 1, unit: '°C' },
  { to: 67, dp: 0, unit: '%' },
  { to: 3, dp: 1, unit: 'km/h' },
];

export function JuneHud() {
  const { june: c, flagships } = useHomeCopy();
  return (
    <div className="hs-sp hs-jh">
      <div className="hs-jh-visual" aria-hidden="true">
        <div className="hs-jh-feeds">
          {FEEDS.map((key, i) => (
            <figure key={key} className="hs-jh-feed" style={{ '--i': i } as CSSProperties}>
              <video muted loop playsInline preload="none" poster={`/images/home/feed-${key}.webp`} data-src={`/videos/rover-${key}-night.mp4`} />
              <figcaption><b>{c.feeds[key].label}</b><span>{c.feeds[key].phone}</span></figcaption>
              <i className="hs-jh-live">{c.live}</i>
            </figure>
          ))}
        </div>
        <div className="hs-jh-strip">
          <dl className="hs-jh-tele">
            {TELE.map((t, i) => (
              <div key={i} style={{ '--i': i } as CSSProperties}>
                <dt>{c.tele[i]}</dt>
                <dd><b data-to={t.to} data-dp={t.dp}>{t.to.toFixed(t.dp)}</b>{t.unit && <span>{t.unit}</span>}</dd>
              </div>
            ))}
            <div className="hs-jh-place" style={{ '--i': TELE.length } as CSSProperties}><dt>{c.place}</dt><dd><b>{c.placeName}</b></dd></div>
          </dl>
          <ol className="hs-jh-link">
            {/* one track from the first stop's centre to the last; it lights from the left */}
            <span className="hs-jh-wire"><i /></span>
            {c.link.map((n, i) => (
              <li key={i} style={{ '--i': i } as CSSProperties}><span className="hs-jh-node" /><b>{n.label}</b><span>{n.sub}</span></li>
            ))}
          </ol>
        </div>
      </div>
      <Captions beats={flagships['proj-june'].beats} />
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
  const c = useHomeCopy().bead;
  return (
    <div className="hs-bb-app is-reader">
      <Status />
      <div className="hs-bb-rbar"><img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" /></div>
      <div className="hs-bb-rbody">
        <div className="hs-bb-rpage">
          <img src="/images/beadreader/reader-paper.webp" alt="" loading="lazy" />
          <i className="hs-bb-here" />
          <b className="hs-bb-herechip"><svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 1h10v14l-5-4-5 4z" /></svg>{c.here}</b>
        </div>
      </div>
    </div>
  );
}

/** An avatar's letter: the first letter of the name. */
const initial = (name: string) => Array.from(name)[0] ?? '';

/** Mara's row of "Who's reading", as the book page draws it. */
function ReadingRow({ cls }: { cls: string }) {
  const c = useHomeCopy().bead;
  return (
    <div className={`hs-bb-row ${cls}`}>
      <span className="hs-bb-row-av">{initial(c.mara)}</span>
      <span className="hs-bb-row-name">{c.mara}</span>
      <span className="hs-bb-row-chip">{c.readingNow}</span>
      <span className="hs-bb-row-bar"><i /></span>
      <span className="hs-bb-row-pct">{fill(c.pct, { n: 75 })}</span>
      <span className="hs-bb-row-sub">{fill(c.rowSub, { ch: 12, of: 16, time: fill(c.readTime, { h: 2, m: 15 }) })}</span>
    </div>
  );
}

export function BeadBook() {
  const { bead: c, flagships } = useHomeCopy();
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
          <figcaption>{c.maraPhone}</figcaption>
        </figure>
        {/* beat 2: reading together */}
        <div className="hs-bb-together">
          <figure className="hs-bb-col is-mara">
            <Phone cls="is-mara">
              <Reader />
              <p className="hs-bb-toast is-wave"><span>👋</span>{c.waved}</p>
              <p className="hs-bb-toast is-note"><b>{c.noteFrom}</b>{c.note}</p>
            </Phone>
            <figcaption>{c.maraScreen}</figcaption>
          </figure>
          <div className="hs-bb-online">
            <p className="hs-bb-online-h">{c.onlineNow}</p>
            <ul>
              <li className="is-mara">
                <span className="hs-bb-av">{initial(c.mara)}<em>12</em></span>
                <span className="hs-bb-who"><b>{c.mara}</b><small>{fill(c.readingHere, { ch: 12 })}</small></span>
                <span className="hs-bb-acts"><i className="is-wave">👋</i><i className="is-note">💬</i></span>
              </li>
              <li className="hs-bb-notebox"><span>{c.note}</span><i>➤</i></li>
              <li>
                <span className="hs-bb-av">{initial(c.jae)}</span>
                <span className="hs-bb-who"><b>{c.jae}</b><small>{fill(c.elsewhere, { book: c.otherBook, ch: 3 })}</small></span>
                <span className="hs-bb-acts"><i>👋</i><i>💬</i></span>
              </li>
              <li className="is-sam">
                <span className="hs-bb-av">{initial(c.sam)}<em>1</em></span>
                <span className="hs-bb-who"><b>{c.sam}</b><small className="is-a">{c.browsing}</small><small className="is-b">{fill(c.readingHere, { ch: 1 })}</small></span>
                <span className="hs-bb-acts"><i>👋</i><i>💬</i></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Captions beats={flagships['proj-beadreader'].beats} />
    </div>
  );
}

/* ── Pip: the 3D Tab5 from the article (pipStage.ts draws it in .hs-pt-gl) ──
   The visual box is where the tablet settles, facing us, for the beats; its
   own screen plays the recordings. Without WebGL or with reduced motion the
   box shows the recordings' stills instead. */
// Their alt text is the copy's pip.shots, in this order.
const PIP_SHOTS = ['point', 'drawer', 'switch'];

export function PipTab() {
  const { pip: c, flagships } = useHomeCopy();
  return (
    <div className="hs-sp hs-pt">
      <div className="hs-pt-visual">
        <div className="hs-pt-shots">
          {PIP_SHOTS.map((key, i) => (
            <img key={key} className={`is-${i + 1}`} src={`/videos/pip/${key}.webp`} alt={c.shots[i]} loading="lazy" />
          ))}
        </div>
      </div>
      <Captions beats={flagships['proj-pip'].beats} />
    </div>
  );
}

/* ── Stack-chan LiDAR: the 3D scene is the section's own backdrop (lidarStage.ts);
   this box only holds the finished scan for the flat fallback ── */
export function LidarSet() {
  const { lidar: c, flagships } = useHomeCopy();
  return (
    <div className="hs-sp hs-ld">
      <div className="hs-ld-visual">
        <img className="hs-ld-cloud" src="/images/stackchan-lidar/cloud.webp" alt={c.cloudAlt} loading="lazy" />
      </div>
      <Captions beats={flagships['proj-lidar'].beats} />
    </div>
  );
}
