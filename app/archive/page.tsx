import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Figtree, Newsreader } from 'next/font/google';
import { VERSIONS, FIRST_LAUNCH, archiveUrl, archiveHost } from './versions';
import './archive.css';

const sans = Figtree({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--ar-sans', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400'], variable: '--ar-serif', display: 'swap' });

const URL = 'https://www.chiambucket.com/archive';
const DESCRIPTION =
  'Every design chiambucket.com has had since September 2024, from a WordPress site to the painted scroll story, with screenshots and a working copy of each old version.';

export const metadata: Metadata = {
  title: 'Two years of chiambucket.com | Braven Chiam',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Two years of chiambucket.com',
    description: 'Eight designs since September 2024, and a working copy of every old one.',
    url: URL,
    type: 'website',
    images: [{ url: '/images/archive/v4-desktop.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Two years of chiambucket.com',
  description: DESCRIPTION,
  url: URL,
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: VERSIONS.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `v${v.n}: ${v.name} (${v.when})`,
      url: v.n === VERSIONS.length ? 'https://www.chiambucket.com/' : archiveUrl(v.n),
    })),
  },
};

const DAY = 86_400_000;
const days = (a: string, b: string) => Math.max(1, Math.round((Date.parse(b) - Date.parse(a)) / DAY));
const I = '/images/archive/';

const Out = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function ArchivePage() {
  // The page is prerendered, so "today" is the day it was last deployed.
  const today = new Date().toISOString().slice(0, 10);
  const live = VERSIONS.map((v, i) => days(v.start, VERSIONS[i + 1]?.start ?? today));
  const current = VERSIONS[VERSIONS.length - 1];

  return (
    <main className={`ar ${sans.variable} ${serif.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="ar-hero ar-wrap">
        <h1 className="ar-title">Two years of chiambucket.com</h1>
        <p className="ar-lede">
          It started off as a WordPress page where I shared links to some of my self-hosted services, but it has since turned into my
          personal blog and portfolio. Three migrations and eight redesigns later, this is the biggest redesign of my website to date.
          With the help of Claude, I have archived every major design overhaul on this page, and you can visit any of them to see what
          chiambucket.com looked like in the past.
        </p>

        <nav className="ar-strip" aria-label="The eight versions, each as wide as the time it was live">
          {VERSIONS.map((v, i) => (
            <a
              key={v.n}
              href={`#v${v.n}`}
              className="ar-seg"
              style={{ flexGrow: live[i], '--b': v.base, '--a': v.accent } as CSSProperties}
              aria-label={`v${v.n}, ${v.name}, ${v.when}`}
            >
              <span className="ar-seg-band" />
              <span className="ar-seg-n">v{v.n}</span>
              <span className="ar-tip" aria-hidden="true">
                <img src={`${I}v${v.n}-thumb.webp`} alt="" width={160} height={100} loading="lazy" />
                <b>{v.name}</b>
                <span>{v.when}</span>
              </span>
            </a>
          ))}
        </nav>
        <p className="ar-strip-ends"><span>{new Date(FIRST_LAUNCH).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span><span>Today</span></p>
        <p className="ar-note">Each band is one design, as wide as the time it was live.</p>
      </header>

      <ol className="ar-list ar-wrap" data-zoom>
        {VERSIONS.map((v) => {
          const isNow = v === current;
          return (
            <li key={v.n} id={`v${v.n}`} className={`ar-v${isNow ? ' is-now' : ''}`} style={{ '--b': v.base, '--a': v.accent } as CSSProperties}>
              <div className="ar-v-meta">
                <p className="ar-v-n" aria-hidden="true">v{v.n}</p>
                <h2 className="ar-v-name"><span className="sr-only">v{v.n}: </span>{v.name}</h2>
                <p className="ar-v-when"><i className="ar-swatch" aria-hidden="true" />{v.when}</p>
                <p className="ar-v-body">{v.body}</p>
                <p className="ar-v-built">Built with {v.built}</p>
                <div className="ar-v-actions">
                  {isNow ? (
                    <Link className="ar-btn is-primary" href="/">Back to the homepage</Link>
                  ) : (
                    <>
                      <a className="ar-btn is-primary" href={archiveUrl(v.n)} target="_blank" rel="noopener">Open v{v.n}<Out /></a>
                      <span className="ar-v-host">{archiveHost(v.n)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="ar-v-shots">
                <figure className="ar-shot is-desk">
                  <figcaption className="ar-bar"><span>{isNow ? 'www.chiambucket.com' : archiveHost(v.n)}</span></figcaption>
                  <img src={`${I}v${v.n}-desktop.webp`} alt={v.desktopAlt} width={1600} height={1000} loading={v.n === 1 ? 'eager' : 'lazy'} />
                </figure>
                <div className={`ar-v-row${v.detailAlt ? '' : ' is-solo'}`}>
                  {v.detailAlt && (
                    <figure className="ar-shot is-detail">
                      <img src={`${I}v${v.n}-detail.webp`} alt={v.detailAlt} width={1600} height={1000} loading="lazy" />
                    </figure>
                  )}
                  <figure className="ar-shot is-phone">
                    <img src={`${I}v${v.n}-phone.webp`} alt={v.phoneAlt} width={520} height={1125} loading="lazy" />
                  </figure>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="ar-end ar-wrap" aria-labelledby="ar-why">
        <div className="ar-fact">
          <p className="ar-fact-kicker">Fun fact</p>
          <h2 id="ar-why" className="ar-fact-title">Why chiambucket.com?</h2>
          <p>
            Chiambucket started as a nickname that one of my close friends gave me. When I was looking for a domain name for my new
            landing page, chiambucket.com just happened to be the cheapest one available, so I took it and have kept it ever since.
          </p>
          <p className="ar-fact-extra">
            <b>Extra fun fact:</b> I also own <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, and it redirects to this site!
          </p>
        </div>
      </section>
    </main>
  );
}
