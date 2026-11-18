'use client';
/* A phone demo filmed in one take, beside cards that jump to each moment.
   Shared by /pantry and /scroll-ruler: `base` is the folder holding demo.webm,
   demo.mp4, demo.webp (the poster) and moment-1..n.webp (the cards' stills). */
import { useRef, useState } from 'react';

export type Moment = { t: number; label: string; note: string };
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function DemoVideo({ base, moments, label }: { base: string; moments: Moment[]; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const seek = (t: number) => {
    const el = v.current; if (!el) return;
    el.currentTime = t;
    el.play().catch(() => {});
  };
  const at = moments.reduce((k, m, i) => (now >= m.t ? i : k), 0);
  return (
    <div className="pt-demo" data-no-zoom>
      <video ref={v} className="pt-demo-video" controls playsInline muted preload="none" poster={base + 'demo.webp'}
        onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)} aria-label={label}>
        <source src={base + 'demo.webm'} type="video/webm" />
        <source src={base + 'demo.mp4'} type="video/mp4" />
      </video>
      <ol className="pt-demo-moments">
        {moments.map((m, i) => (
          <li key={m.t}>
            <button type="button" className={i === at && now > 0 ? 'is-on' : ''} onClick={() => seek(m.t)}>
              <img src={`${base}moment-${i + 1}.webp`} alt="" loading="lazy" />
              <span className="pt-demo-text">
                <span className="pt-demo-time">{mmss(m.t)}</span>
                <b>{m.label}</b>
                <span className="pt-demo-note">{m.note}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
