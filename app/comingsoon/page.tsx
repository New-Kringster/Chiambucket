import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coming Soon — Chiambucket',
  description: 'This page is still in development.',
  robots: 'noindex, nofollow',
};

function ArrowCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="17" height="17" aria-hidden="true">
      <path
        fill="currentColor"
        clipRule="evenodd"
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
      />
    </svg>
  );
}

export default function ComingSoonPage() {
  return (
    <main>
      <section className="ct-wrap">
        <div className="ct-aura"></div>
        <span className="ct-kicker">In progress</span>
        <h1 className="ct-title">Coming <em>soon.</em></h1>
        <p className="ct-sub">This page is still in development. Check back later.</p>
        <Link href="/" className="hp-btn" style={{ marginTop: '2.4rem' }}>
          Back home <ArrowCircle />
        </Link>
      </section>
    </main>
  );
}
