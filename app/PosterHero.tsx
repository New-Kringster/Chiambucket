import { Instrument_Serif } from 'next/font/google';
import './poster.css';

/*
  PosterHero — the homepage opening: the name set large in Instrument Serif
  over the sunlit field, and one quiet line of context. On load the name comes
  into focus, like a lens finding its subject, and then holds still. Pure CSS,
  so it also plays before the page hydrates. Styles: app/poster.css (.slp-*).
*/

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-poster' });

export default function PosterHero() {
  return (
    <header className={`hp-hero slp ${serif.variable}`}>
      <div className="slp-stage">
        <h1 className="slp-name" aria-label="Braven Chiam">
          <span className="slp-word" aria-hidden="true">Braven</span>{' '}
          <span className="slp-word" aria-hidden="true">Chiam</span>
        </h1>
        <p className="slp-role">Electronic and Computer Engineering, Nanyang Polytechnic</p>
      </div>
    </header>
  );
}
