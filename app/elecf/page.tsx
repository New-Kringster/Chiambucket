import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elec-F Concept — Chiambucket',
  description: 'Project article: a conceptual M5-Stack product designed to help prevent fatalities in walk-in freezers.',
  alternates: { canonical: 'https://www.chiambucket.com/elecf' },
  openGraph: {
    title: 'Elec-F Concept — Chiambucket',
    description: 'A conceptual safety product using M5Stack and sensors for walk-in freezer safety.',
    url: 'https://www.chiambucket.com/elecf',
    type: 'article',
  },
};

export default function ElecfPage() {
  return (
    <main>
      <div className="article-image article-elecf-image"></div>
      <div className="article-content">
        <div className="article-fade"></div>
        <div className="article-body">
          <div className="article-body-wrapper">
            <div className="article-header">
              <div className="pf-item-tag">
                <div className="pf-item-tag-school"><h5>School Project</h5></div>
              </div>
              <h1>Elec-F Concept</h1>
              <h3>ELEC-F is a conceptual product developed by my team and me for an engineering course. It utilizes the M5-Stack Controller along with various sensors to help prevent fatalities in walk-in freezers.</h3>
              <div className="pf-button-left-stack article-header-icons">
                <div className="icon-stack">
                  <img src="/images/resolve-icon.webp" alt="" />
                  <img src="/images/ps-pf-icon.webp" alt="" />
                  <img src="/images/powerpoint-icon.webp" alt="" />
                  <img src="/images/figma-icon.webp" alt="" />
                </div>
              </div>
            </div>
            <div className="article-real-body">
              <h1>Promotional Video</h1>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/fIJQzOhCKQU?si=UcWGUds-d79Ghaad" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <div className="article-real-body">
              <h1>Project Background</h1>
              <p>ELEC-F was developed as part of an engineering course, tasked with creating a conceptual product that addresses a real-world safety issue. Using the M5Stack controller and various sensors, the concept targets a critical problem: workers becoming trapped in walk-in freezers.</p>
              <img src="/images/pandus-article-img1.webp" alt="" />
            </div>
            <div className="next-article">
              Check Out The Next Article
              <a href="/comingsoon" className="pf-item-button">
                View Next Article
                <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
                  <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="article-bottom-fade"></div>
    </main>
  );
}
