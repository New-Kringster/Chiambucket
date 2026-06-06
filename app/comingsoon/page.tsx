import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coming Soon — Chiambucket',
  description: 'This page is still in development.',
  robots: 'noindex, nofollow',
};

export default function ComingSoonPage() {
  return (
    <main>
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <div>
          <h1 style={{ fontSize: '8rem', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' }}>
            Coming Soon
          </h1>
          <h1 style={{ color: '#7c7c7c' }}>This page is still in development</h1>
          <Link
            href="/"
            className="pf-item-button pf-item-demo"
            style={{ marginTop: 15, display: 'inline-flex' }}
          >
            BACK
            <svg fill="currentColor" viewBox="0 0 24 24" className="pf-item-buttom-icon">
              <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
