import Link from 'next/link';
import Mark from './Mark';

const ELSEWHERE = [
  { label: 'Instagram', url: 'https://www.instagram.com/bombastic_demise' },
  { label: 'YouTube', url: 'https://www.youtube.com/@newkringster2564' },
  { label: 'GitHub', url: 'https://github.com/New-Kringster' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/braven-chiambucket/' },
  { label: 'WhatsApp', url: 'https://wa.me/6597100366' },
];

/* Footer for press routes, set like a colophon on the last page of a zine. */
export default function PressFooter() {
  return (
    <footer className="pr-foot">
      <div className="pr-foot-inner">
        <Link href="/" className="pr-foot-home">
          <Mark />
          <span>Chiambucket</span>
        </Link>
        <ul className="pr-foot-links" aria-label="Elsewhere">
          {ELSEWHERE.map((l) => (
            <li key={l.label}><a href={l.url} target="_blank" rel="noopener">{l.label}</a></li>
          ))}
        </ul>
        <p className="pr-foot-colophon">
          Set in Newsreader and DM Sans. The photographs are printed by the page itself, in riso
          yellow, fluorescent pink and blue. &copy; 2026 Braven Chiam. <Link className="pr-link" href="/credits">Credits</Link>
        </p>
      </div>
    </footer>
  );
}
