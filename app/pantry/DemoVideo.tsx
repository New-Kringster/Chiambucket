'use client';
/* The demo, filmed on a phone in one take, with buttons that jump to each moment. */
import { useRef, useState } from 'react';

const MOMENTS = [
  { t: 0, label: 'Scanning from the demo sheet', note: 'Nutella, Coca-Cola and Ritter Sport off my laptop screen' },
  { t: 45, label: 'A real carton', note: 'A carton of 冰红茶, named by GS1 China' },
  { t: 69, label: 'Scanning it again', note: 'The saved carton opens instead of being added twice' },
  { t: 78, label: 'Another pantry', note: 'Switching to the fridge and adding to it' },
];
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function DemoVideo() {
  const v = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const seek = (t: number) => {
    const el = v.current; if (!el) return;
    el.currentTime = t;
    el.play().catch(() => {});
  };
  const at = MOMENTS.reduce((k, m, i) => (now >= m.t ? i : k), 0);
  return (
    <div className="pt-demo" data-no-zoom>
      <video ref={v} className="pt-demo-video" controls playsInline muted preload="none" poster="/videos/pantry/demo.webp"
        onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)} aria-label="The tracker in use: scanning products, a real carton, scanning it again and switching pantries">
        <source src="/videos/pantry/demo.webm" type="video/webm" />
        <source src="/videos/pantry/demo.mp4" type="video/mp4" />
      </video>
      <ol className="pt-demo-moments">
        {MOMENTS.map((m, i) => (
          <li key={m.t}>
            <button type="button" className={i === at && now > 0 ? 'is-on' : ''} onClick={() => seek(m.t)}>
              <img src={`/videos/pantry/moment-${i + 1}.webp`} alt="" loading="lazy" />
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
