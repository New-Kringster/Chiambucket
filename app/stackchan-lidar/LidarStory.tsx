'use client';
/*
  The page's conductor. One 3D scene (lidarScene.ts) sits fixed behind the
  whole article (.ls-bg). Every chapter is an element with data-shot: the
  pinned ones (meet, sweep, sensors, colour) are tall sections whose sticky
  child stays on screen while their progress t runs 0..1; the rest of the
  page (data-shot="rest") scrolls normally over the finished room, turning
  slowly. On scroll this finds the chapter under the middle of the screen,
  hands the scene its shot and t (the scene eases toward it), and writes t to
  the chapter as --t so its captions can come and go.

  The route takes the page over like Pip's: the body is the warm black of the
  scene until the recommendations, where the painted night scene shows again
  (html.lr-end). Without WebGL, or with reduced motion, html.lr-flat collapses
  the pinned chapters and each shows its still instead. The dots on the right
  jump between chapters.
*/
import { useEffect, useRef, useState } from 'react';
import { createLidarScene, hasWebGL, type LidarScene, type Shot } from './lidarScene';

export type Chapter = { id: string; name: string };
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function LidarStory({ chapters }: { chapters: Chapter[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(chapters[0]?.id);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('lr-route');
    const end = document.querySelector('.ls > .arec-section');
    const eo = new IntersectionObserver(([e]) => html.classList.toggle('lr-end', e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    if (end) eo.observe(end);

    const flat = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !hasWebGL();
    let scene: LidarScene | null = null;
    if (flat) html.classList.add('lr-flat');
    else {
      try { scene = createLidarScene(host.current!); } catch { html.classList.add('lr-flat'); }
      // development only: lets screenshot scripts snap the camera to its target (window.__lidar.settle())
      if (process.env.NODE_ENV !== 'production' && scene) (window as unknown as { __lidar?: LidarScene }).__lidar = scene;
    }

    const shots = Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'));
    const marks = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    let raf = 0, ready = false, lastShot = '';
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, mid = vh / 2;
      let pick: HTMLElement | null = null, t = 0;
      for (const el of shots) {
        const r = el.getBoundingClientRect();
        const span = Math.max(1, r.height - vh);
        const tt = clamp01(-r.top / span);
        el.style.setProperty('--t', tt.toFixed(4));
        if (r.top <= mid && r.bottom > mid) { pick = el; t = tt; }
      }
      if (!pick) pick = shots[shots.length - 1];
      const shot = (pick?.dataset.shot ?? 'rest') as Shot;
      if (scene && ready) {
        scene.setShot(shot, t);
        if (shot !== lastShot) { lastShot = shot; html.dataset.lrShot = shot; }
      }
      // the chapter dots follow whichever chapter's top has passed the middle
      let cur = marks[0]?.id;
      for (const m of marks) if (m.getBoundingClientRect().top <= mid) cur = m.id;
      setCurrent((c) => (c === cur ? c : cur));
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(update); };
    // render only while the backdrop shows (not behind the recommendations and footer)
    const visible = () => scene?.setActive(!html.classList.contains('lr-end') && !document.hidden);
    const mo = new MutationObserver(visible);
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', visible);
    const onResize = () => { scene?.resize(); kick(); };
    scene?.ready.then(() => {
      ready = true;
      scene!.resize();
      html.classList.add('lr-ready');
      update(); scene!.settle(); visible();
    }).catch(() => html.classList.add('lr-flat'));
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    update();
    return () => {
      cancelAnimationFrame(raf); eo.disconnect(); mo.disconnect();
      document.removeEventListener('visibilitychange', visible);
      window.removeEventListener('scroll', kick); window.removeEventListener('resize', onResize);
      scene?.destroy();
      html.classList.remove('lr-route', 'lr-end', 'lr-flat', 'lr-ready');
      delete html.dataset.lrShot;
    };
  }, [chapters]);

  return (
    <>
      <div className="ls-bg" aria-hidden="true"><div className="ls-gl" ref={host} /></div>
      <nav className="ls-dots" aria-label="Chapters">
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} className={c.id === current ? 'is-on' : ''} aria-current={c.id === current ? 'true' : undefined}>
            <i aria-hidden="true" /><span>{c.name}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
