import Link from 'next/link';
import Mark from '../press/Mark';

const ELSEWHERE = [
  { label: 'Instagram', url: 'https://www.instagram.com/bombastic_demise' },
  { label: 'YouTube', url: 'https://www.youtube.com/@newkringster2564' },
  { label: 'GitHub', url: 'https://github.com/New-Kringster' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/braven-chiambucket/' },
  { label: 'WhatsApp', url: 'https://wa.me/6597100366' },
];

const PAGES = [
  { label: 'Work', url: '/#portfolio-items-holder' },
  { label: 'Photographs', url: '/photography' },
  { label: 'HomeLab', url: '/homelab' },
  { label: 'Contact', url: '/contact' },
];

/* Footer on the same 12-column grid as the page: name, pages, elsewhere, colophon. */
export default function SwissFooter() {
  return (
    <footer className="sw-foot">
      <div className="sw-grid">
        <Link href="/" className="sw-foot-home">
          <Mark />
          <span>Chiambucket</span>
        </Link>
        <div className="sw-foot-col">
          <span className="sw-foot-label">Pages</span>
          <ul>{PAGES.map((l) => <li key={l.label}><a href={l.url}>{l.label}</a></li>)}</ul>
        </div>
        <div className="sw-foot-col">
          <span className="sw-foot-label">Elsewhere</span>
          <ul>{ELSEWHERE.map((l) => <li key={l.label}><a href={l.url} target="_blank" rel="noopener">{l.label}</a></li>)}</ul>
        </div>
        <p className="sw-foot-colophon">
          Set in Host Grotesk on a twelve-column grid. The red and black prints are drawn by the
          page itself. &copy; 2026 Braven Chiam. <Link href="/credits">Credits</Link>
        </p>
      </div>
    </footer>
  );
}
