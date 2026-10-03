import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Coming soon | Braven Chiam',
  description: 'This write-up is not finished yet.',
  robots: 'noindex, nofollow',
};

export default function ComingSoonPage() {
  return (
    <main>
      <section className="ct-wrap cw-wrap">
        <div className="ct-aura"></div>
        <div className="cw-bloom" aria-hidden="true"></div>

        <span className="ct-kicker">Not written up yet</span>
        <h1 className="ct-title cw-title">Coming <em>soon.</em></h1>
        <p className="ct-sub cw-sub">
          I haven&apos;t finished this write-up. The projects I have written up are listed on the
          homepage.
        </p>

        <div className="cw-btns">
          <Link href="/#portfolio-items-holder" className="hp-btn">See all projects</Link>
          <Link href="/" className="hp-btn hp-btn-ghost">Go to the homepage</Link>
        </div>
      </section>

      <style>{`
        /* ── COMING SOON (scoped cw-*) ── */

        /* Soft cool bloom centerpiece */
        .cw-wrap > .cw-bloom { position: absolute; z-index: 0; }
        .cw-bloom {
          top: 50%; left: 50%; width: min(820px, 120vw); height: min(820px, 120vw);
          transform: translate(-50%, -50%); pointer-events: none;
          background:
            radial-gradient(34% 34% at 50% 50%, rgba(190,202,255,0.09), transparent 70%),
            radial-gradient(58% 58% at 50% 50%, rgba(150,164,255,0.05), transparent 74%);
        }

        html.sensory-active .ct-title.cw-title { letter-spacing: -0.01em; }

        .cw-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 2.4rem; position: relative; z-index: 1; }
      `}</style>
    </main>
  );
}
