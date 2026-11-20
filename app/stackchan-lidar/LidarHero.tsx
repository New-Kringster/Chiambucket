'use client';
/*
  The article's opening: a pinned stage (.lh, 440svh) where scrolling runs
  the scan. The title and lead sit over Stack-chan at first, then three beats
  follow, each with its caption: the sweep builds the real cloud, the camera
  closes in on the four sensors, and the cloud turns from depth to the
  camera's colours as the view pulls back. Scroll progress eases toward its
  target so the scene glides. The scene loads when the page opens and renders
  only while the stage is on screen. Without WebGL, or with reduced motion,
  the stage is a plain block: the photo of the real robot beside the title,
  and the three captions as a list (.lh-flat).
*/
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createLidarScene, hasWebGL, type LidarScene } from './lidarScene';

export type Beat = { title: string; text: string; from: number; to: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function LidarHero({ intro, beats, still, stillAlt }: { intro: ReactNode; beats: Beat[]; still: string; stillAlt: string }) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = root.current, gl = host.current;
    if (!el || !gl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !hasWebGL()) { setFlat(true); return; }
    let scene: LidarScene | null = null;
    let alive = true, raf = 0, q = 0, target = 0, onScreen = true;
    try { scene = createLidarScene(gl); } catch { setFlat(true); return; }
    const progress = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return clamp01(-r.top / (span || 1));
    };
    const paint = () => {
      el.style.setProperty('--q', q.toFixed(4));
      scene!.setStory(q);
    };
    const tick = () => {
      raf = 0;
      if (!alive || !onScreen) return;
      q += (target - q) * 0.12;
      if (Math.abs(target - q) < 0.0004) q = target;
      paint();
      if (q !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => { target = progress(); if (!raf) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); }, { rootMargin: '100px' });
    io.observe(el);
    const onResize = () => { scene?.resize(); kick(); };
    scene.ready.then(() => {
      if (!alive) return;
      scene!.resize();
      q = target = progress();
      paint();
      setReady(true);
    }).catch(() => setFlat(true));
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('scroll', kick); window.removeEventListener('resize', onResize);
      scene?.destroy();
    };
  }, []);

  return (
    <header ref={root} className={`lh${flat ? ' lh-flat' : ''}${ready ? ' is-ready' : ''}`}>
      <div className="lh-stage">
        <div className="lh-gl" ref={host} aria-hidden="true" />
        <img className="lh-still" src={still} alt={stillAlt} />
        <div className="lh-intro">{intro}</div>
        <ol className="lh-beats" aria-label="How a scan works">
          {beats.map((b, i) => (
            <li key={b.title} className="lh-beat" style={{ ['--a' as string]: b.from, ['--b' as string]: b.to }}>
              <span className="lh-beat-n">{String(i + 1).padStart(2, '0')}</span>
              <h2>{b.title}</h2>
              <p>{b.text}</p>
            </li>
          ))}
        </ol>
        <div className="lh-cue" aria-hidden="true"><span>Scroll to run the scan</span><i /></div>
        <div className="lh-rail" aria-hidden="true"><i /></div>
      </div>
    </header>
  );
}
