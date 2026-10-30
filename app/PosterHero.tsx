import { Figtree } from 'next/font/google';
import './poster.css';

/*
  PosterHero — the homepage opening: the name set large in Figtree, made of
  clear frosted glass over the sunlit field (it blurs and brightens the sky
  behind each letter, with a bright rim where the sun catches the edges), and
  one quiet line under it. On load the name comes into focus, like a lens
  finding its subject, and then holds still. Pure CSS, so it also plays
  before the page hydrates. Styles: app/poster.css (.slp-*).
*/

const display = Figtree({ subsets: ['latin'], weight: '800', display: 'swap', variable: '--font-poster' });

// Each word is four stacked copies of itself: a soft shadow, the glass body,
// a highlight across the top, and the rim. The rim, last and in flow, sets the size.
function GlassWord({ children }: { children: string }) {
  return (
    <span className="slp-word" aria-hidden="true">
      <span className="slp-shadow">{children}</span>
      <span className="slp-glass">{children}</span>
      <span className="slp-light">{children}</span>
      <span className="slp-rim">{children}</span>
    </span>
  );
}

export default function PosterHero() {
  return (
    <header className={`hp-hero slp ${display.variable}`}>
      <div className="slp-stage">
        <h1 className="slp-name" aria-label="Braven Chiam">
          <GlassWord>Braven</GlassWord>{' '}
          <GlassWord>Chiam</GlassWord>
        </h1>
        <p className="slp-role">Engineer, designer, all in one</p>
      </div>
    </header>
  );
}
