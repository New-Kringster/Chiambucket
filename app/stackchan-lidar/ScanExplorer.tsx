'use client';
/*
  The finished scan to look around: the same scene as the opening, in orbit
  mode over the whole cloud (drag to turn, scroll or pinch to zoom), with the
  two colourings Stack-chan's own viewer offers, depth and photo. It loads
  when it comes near the screen and only renders while the reader moves it.
*/
import { useEffect, useRef, useState } from 'react';
import { createLidarScene, hasWebGL, type LidarScene } from './lidarScene';

export default function ScanExplorer({ still, stillAlt }: { still: string; stillAlt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<LidarScene | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'flat'>('idle');
  const [photo, setPhoto] = useState(true);
  const [moved, setMoved] = useState(false);
  const mix = useRef(1);

  useEffect(() => {
    const el = box.current, gl = host.current;
    if (!el || !gl) return;
    if (!hasWebGL()) { setState('flat'); return; }
    let alive = true, raf = 0;
    const loop = () => { scene.current?.render(); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; return; }
      if (!scene.current) {
        setState('loading');
        try { scene.current = createLidarScene(gl); } catch { setState('flat'); return; }
        scene.current.ready.then(() => {
          if (!alive || !scene.current) return;
          scene.current.resize();
          scene.current.explore(() => setMoved(true));
          scene.current.setColour(mix.current);
          setState('ready');
        }).catch(() => setState('flat'));
      }
      // the controls ease after a drag, so keep rendering while it is on screen
      if (!raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: '200px' });
    io.observe(el);
    const onResize = () => scene.current?.resize();
    window.addEventListener('resize', onResize);
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); scene.current?.destroy(); scene.current = null; };
  }, []);

  // ease between the two colourings
  useEffect(() => {
    const to = photo ? 1 : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { mix.current = to; scene.current?.setColour(to); return; }
    let raf = 0;
    const step = () => {
      mix.current += (to - mix.current) * 0.14;
      if (Math.abs(to - mix.current) < 0.002) mix.current = to;
      scene.current?.setColour(mix.current);
      if (mix.current !== to) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [photo]);

  return (
    <div className={`lx is-${state}`} data-no-zoom>
      <div className="lx-view" ref={box}>
        <div className="lx-gl" ref={host} aria-label="The scan in 3D: drag to look around it, scroll or pinch to zoom" role="img" />
        <img className="lx-still" src={still} alt={stillAlt} loading="lazy" />
        {state === 'loading' && <p className="lx-msg">Loading 68,206 points</p>}
        {state === 'ready' && !moved && <p className="lx-hint" aria-hidden="true">Drag to look around, scroll or pinch to zoom</p>}
      </div>
      <div className="lx-bar">
        <div className="lx-seg" role="radiogroup" aria-label="Colour the points by">
          <button type="button" role="radio" aria-checked={photo} className={photo ? 'is-on' : ''} onClick={() => setPhoto(true)}>Photo colour</button>
          <button type="button" role="radio" aria-checked={!photo} className={!photo ? 'is-on' : ''} onClick={() => setPhoto(false)}>Depth</button>
        </div>
        <a className="lx-dl" href="/stackchan-lidar/stackchan-scan-9-dense.ply" download>Download the scan (.ply)</a>
      </div>
    </div>
  );
}
