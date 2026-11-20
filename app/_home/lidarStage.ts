/*
  The Stack-chan LiDAR story's stage on the homepage: the article's 3D scene
  (app/stackchan-lidar/lidarScene.ts, M5Stack's Stack-chan models with the
  real scan) in the chapter's .hs-ld-gl. HomeStory hands it the section's
  scroll progress with set(p), and the chapter's caption windows (c1 0.14-0.4,
  c2 0.4-0.62, c3 0.62-0.82) are mapped onto the scene's own story: the sweep
  builds the cloud under the first two captions, then the cloud takes the
  camera's colours as the view pulls back. As the card comes up the
  canvas fades (CSS, --k). The scene loads only once the section comes near
  and renders only while it is on screen; without WebGL the section gets
  .hs-ld-flat and CSS shows still pictures instead.
*/
import { createLidarScene, hasWebGL, type LidarScene } from '../stackchan-lidar/lidarScene';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/* p (the section) to q (the scene's story), piece by piece */
const MAP: [number, number][] = [[0, 0], [0.08, 0], [0.14, 0.1], [0.62, 0.75], [0.82, 1], [1, 1]];   // the sweep runs under the first two captions
const toQ = (p: number) => {
  for (let i = 0; i < MAP.length - 1; i++) {
    const [a, qa] = MAP[i], [b, qb] = MAP[i + 1];
    if (p <= b) return qa + (qb - qa) * clamp01((p - a) / (b - a || 1));
  }
  return 1;
};

export function createLidarStage(section: HTMLElement) {
  const host = section.querySelector<HTMLElement>('.hs-ld-gl')!;
  let scene: LidarScene | null = null;
  let alive = true, ready = false, inView = false, p = 0;

  if (!hasWebGL() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.classList.add('hs-ld-flat');
    return { set() {}, destroy() {} };
  }

  const draw = () => { if (ready && inView && scene) scene.setStory(toQ(p)); };
  const live = () => scene?.setActive(ready && inView && !document.hidden);
  const start = () => {
    if (scene) return;
    try { scene = createLidarScene(host, 'home'); } catch { section.classList.add('hs-ld-flat'); return; }
    scene.ready.then(() => {
      if (!alive || !scene) return;
      scene.resize();
      ready = true;
      section.classList.add('hs-ld-ready');
      draw(); scene.settle(); live();
    }).catch(() => section.classList.add('hs-ld-flat'));
  };
  const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { start(); near.disconnect(); } }, { rootMargin: '150% 0px' });
  near.observe(section);
  const vis = new IntersectionObserver(([e]) => { inView = e.isIntersecting; live(); draw(); });
  document.addEventListener('visibilitychange', live);
  vis.observe(section);
  const onResize = () => { scene?.resize(); draw(); };
  window.addEventListener('resize', onResize);

  return {
    set(v: number) { p = v; draw(); },
    destroy() {
      alive = false; near.disconnect(); vis.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', live);
      scene?.destroy(); scene = null;
    },
  };
}
