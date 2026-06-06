import type { Metadata } from 'next';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';

export const metadata: Metadata = {
  title: 'Elec-F Concept — Chiambucket',
  description: 'Project article: a conceptual M5-Stack product designed to help prevent fatalities in walk-in freezers.',
  alternates: { canonical: 'https://www.chiambucket.com/elecf' },
  openGraph: {
    title: 'Elec-F Concept — Chiambucket',
    description: 'A conceptual safety product using M5Stack and sensors for walk-in freezer safety.',
    url: 'https://www.chiambucket.com/elecf',
    type: 'article',
    images: [{ url: '/images/elecf-img.webp' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Elec-F Concept',
  description: 'A conceptual safety product developed for an engineering course, using the M5Stack controller and various sensors to help prevent fatalities in walk-in freezers.',
  image: 'https://www.chiambucket.com/images/elecf-img.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/elecf',
};

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Circle = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon" aria-hidden="true"><path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" /></svg>
);

export default function ElecfPage() {
  return (
    <main className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      {/* Feature hero */}
      <header className="art-hero">
        <div className="art-hero-bg"><img src="/images/elecf-img.webp" alt="Elec-F Concept project" /></div>
        <div className="art-hero-scrim"></div>
        <div className="art-hero-inner hp-section">
          <a className="art-back" href="/#portfolio-items-holder"><BackArrow /> All projects</a>
          <div className="art-tags">
            <span className="hp-md-tag school">School Project</span>
          </div>
          <h1 className="art-title">Elec-F <em>Concept</em></h1>
          <p className="art-lead">ELEC-F is a conceptual product developed by my team and me for an engineering course. It utilizes the M5-Stack Controller along with various sensors to help prevent fatalities in walk-in freezers.</p>
          <div className="art-toolrow">
            <span className="hp-key">Built with</span>
            <div className="icon-stack">
              <img src="/images/resolve-icon.webp" alt="DaVinci Resolve" />
              <img src="/images/ps-pf-icon.webp" alt="Photoshop" />
              <img src="/images/powerpoint-icon.webp" alt="PowerPoint" />
              <img src="/images/figma-icon.webp" alt="Figma" />
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="art-body hp-section">
        <aside className="art-rail">
          <div className="art-rail-inner">
            <span className="hp-eyebrow">Chapters</span>
            <nav className="art-chapters article-chapter-wrapper">
              <a href="#PromoVideo">Promotional Video</a>
              <a href="#ProjectBackground">Project Background</a>
            </nav>
          </div>
        </aside>

        <div className="art-content">

          {/* Promotional Video */}
          <section id="PromoVideo" className="art-section" data-reveal>
            <h2>Promotional Video</h2>
            <div className="art-video">
              <iframe
                src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad"
                title="Elec-F Concept promotional video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </section>

          {/* Project Background */}
          <section id="ProjectBackground" className="art-section" data-reveal>
            <h2>Project Background</h2>
            <p>ELEC-F was developed as part of an engineering course, tasked with creating a conceptual product that addresses a real-world safety issue. Using the M5Stack controller and various sensors, the concept targets a critical problem: workers becoming trapped in walk-in freezers.</p>
            <img src="/images/pandus-article-img1.webp" alt="Elec-F Concept project background" loading="lazy" />
          </section>

          <div className="art-next">
            <span className="art-next-label">Check out the next article</span>
            <a href="/#portfolio-items-holder" className="hp-btn">All projects <Circle /></a>
          </div>

        </div>
      </div>
      <ArticleRecommendations exclude="proj-elecf" />
    </main>
  );
}
