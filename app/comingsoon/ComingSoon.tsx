/* The coming-soon placeholder in any language: app/comingsoon/page.tsx and
   app/[lang]/comingsoon/page.tsx both render it. Its words come from ./_copy. */
import Link from 'next/link';
import { IcGrid, IcHome } from '../../components/Icons';
import { localize, type Lang } from '@/lib/i18n';
import { comingSoonCopy } from './_copy';

export default function ComingSoon({ lang }: { lang: Lang }) {
  const c = comingSoonCopy(lang);
  return (
    <main>
      <section className="ct-wrap cw-wrap">
        <div className="ct-aura"></div>
        <div className="cw-bloom" aria-hidden="true"></div>

        <span className="ct-kicker">{c.kicker}</span>
        <h1 className="ct-title cw-title">{c.title}</h1>
        <p className="ct-sub cw-sub">{c.sub}</p>

        <div className="cw-btns">
          <Link href={localize('/#projects', lang)} className="hp-btn"><IcGrid /> {c.all}</Link>
          <Link href={localize('/', lang)} className="hp-btn hp-btn-ghost"><IcHome /> {c.home}</Link>
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
