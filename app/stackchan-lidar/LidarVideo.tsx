'use client';
/* The demo film, landscape, with four cards under it that jump to each moment. */
import { useRef, useState } from 'react';

export type Moment = { t: number; label: string; note: string };
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function LidarVideo({ base, moments, label }: { base: string; moments: Moment[]; label: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const seek = (t: number) => { const el = v.current; if (!el) return; el.currentTime = t; el.play().catch(() => {}); };
  const at = moments.reduce((k, m, i) => (now >= m.t ? i : k), 0);
  return (
    <div className="lv" data-no-zoom>
      <video ref={v} className="lv-video" controls playsInline preload="none" poster={base + 'demo.webp'}
        onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)} aria-label={label}>
        <source src={base + 'demo.mp4'} type="video/mp4" />
      </video>
      <ol className="lv-moments">
        {moments.map((m, i) => (
          <li key={m.t}>
            <button type="button" className={i === at && now > 0 ? 'is-on' : ''} onClick={() => seek(m.t)}>
              <img src={`${base}moment-${i + 1}.webp`} alt="" loading="lazy" />
              <span className="lv-time">{mmss(m.t)}</span>
              <b>{m.label}</b>
              <span className="lv-note">{m.note}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
