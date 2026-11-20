import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Figtree, Newsreader } from 'next/font/google';
import { VERSIONS, FIRST_LAUNCH, archiveUrl, archiveHost } from './versions';
import type { ArchiveCopy } from './_copy/en';
import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';
import { fill } from '@/lib/fill';
import './archive.css';

const sans = Figtree({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--ar-sans', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400'], variable: '--ar-serif', display: 'swap' });

const DAY = 86_400_000;
const days = (a: string, b: string) => Math.max(1, Math.round((Date.parse(b) - Date.parse(a)) / DAY));
const I = '/images/archive/';

const Out = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* The /archive page in one language: page.tsx (English) and [lang]/archive/page.tsx load the copy. */
export default function Archive({ lang, c }: { lang: Lang; c: ArchiveCopy }) {
  const words = (n: number) => c.versions[n as keyof ArchiveCopy['versions']];
  const url = SITE + localize('/archive', lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: c.ldName,
    description: c.meta.description,
    url,
    ...(lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] }),
    author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: VERSIONS.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: fill(c.ldItem, { n: v.n, name: words(v.n).name, when: words(v.n).when }),
        url: v.n === VERSIONS.length ? SITE + localize('/', lang) : archiveUrl(v.n),
      })),
    },
  };

  // The page is prerendered, so "today" is the day it was last deployed.
  const today = new Date().toISOString().slice(0, 10);
  const live = VERSIONS.map((v, i) => days(v.start, VERSIONS[i + 1]?.start ?? today));
  const current = VERSIONS[VERSIONS.length - 1];

  return (
    <main className={`ar ${sans.variable} ${serif.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="ar-hero ar-wrap">
        <h1 className="ar-title">{c.title}</h1>
        <p className="ar-lede">{c.lede}</p>

        <nav className="ar-strip" aria-label={c.stripLabel}>
          {VERSIONS.map((v, i) => {
            const w = words(v.n);
            return (
              <a
                key={v.n}
                href={`#v${v.n}`}
                className="ar-seg"
                style={{ flexGrow: live[i], '--b': v.base, '--a': v.accent } as CSSProperties}
                aria-label={fill(c.segLabel, { n: v.n, name: w.name, when: w.when })}
              >
                <span className="ar-seg-band" />
                <span className="ar-seg-n">v{v.n}</span>
                <span className="ar-tip" aria-hidden="true">
                  <img src={`${I}v${v.n}-thumb.webp`} alt="" width={160} height={100} loading="lazy" />
                  <b>{w.name}</b>
                  <span>{w.when}</span>
                </span>
              </a>
            );
          })}
        </nav>
        <p className="ar-strip-ends"><span>{new Date(FIRST_LAUNCH).toLocaleDateString(lang === 'en' ? 'en-GB' : HTML_LANG[lang], { month: 'long', year: 'numeric' })}</span><span>{c.today}</span></p>
      </header>

      <ol className="ar-list ar-wrap" data-zoom>
        {VERSIONS.map((v) => {
          const isNow = v === current;
          const w = words(v.n);
          return (
            <li key={v.n} id={`v${v.n}`} className={`ar-v${isNow ? ' is-now' : ''}`} style={{ '--b': v.base, '--a': v.accent } as CSSProperties}>
              <div className="ar-v-meta">
                <p className="ar-v-n" aria-hidden="true">v{v.n}</p>
                <h2 className="ar-v-name"><span className="sr-only">{fill(c.srName, { n: v.n })}</span>{w.name}</h2>
                <p className="ar-v-when"><i className="ar-swatch" aria-hidden="true" />{w.when}</p>
                <p className="ar-v-body">{w.body}</p>
                <p className="ar-v-built">{fill(c.builtWith, { built: w.built })}</p>
                <div className="ar-v-actions">
                  {isNow ? (
                    <Link className="ar-btn is-primary" href={localize('/', lang)}>{c.backHome}</Link>
                  ) : (
                    <>
                      <a className="ar-btn is-primary" href={archiveUrl(v.n)} target="_blank" rel="noopener">{fill(c.open, { n: v.n })}<Out /></a>
                      <span className="ar-v-host">{archiveHost(v.n)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="ar-v-shots">
                <figure className="ar-shot is-desk">
                  <figcaption className="ar-bar"><span>{isNow ? 'www.chiambucket.com' : archiveHost(v.n)}</span></figcaption>
                  <img src={`${I}v${v.n}-desktop.webp`} alt={w.desktopAlt} width={1600} height={1000} loading={v.n === 1 ? 'eager' : 'lazy'} />
                </figure>
                <div className={`ar-v-row${v.detail ? '' : ' is-solo'}`}>
                  {v.detail && (
                    <figure className="ar-shot is-detail">
                      <img src={`${I}v${v.n}-detail.webp`} alt={w.detailAlt} width={1600} height={1000} loading="lazy" />
                    </figure>
                  )}
                  <figure className="ar-shot is-phone">
                    <img src={`${I}v${v.n}-phone.webp`} alt={w.phoneAlt} width={520} height={1125} loading="lazy" />
                  </figure>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="ar-end ar-wrap" aria-labelledby="ar-why">
        <div className="ar-fact">
          <div className="ar-fact-head">
            <p className="ar-fact-kicker">{c.fact.kicker}</p>
            <h2 id="ar-why" className="ar-fact-title">{c.fact.title}</h2>
          </div>
          <div className="ar-fact-text">
          <p>{c.fact.text}</p>
          <p className="ar-fact-extra">{c.fact.extra}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
