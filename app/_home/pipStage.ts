/*
  The Pip story's stage on the homepage: the 3D Tab5 from the Pip article
  (app/pip/tab5Scene.ts, M5Stack's own Tab5 frame with Mopi's real home
  picture and the firmware's Pip animation on its screen).

  On the title slide the tablet sits turned beside the title; as the title
  leaves it turns to face us and settles in the set piece's visual box
  (.hs-pt-visual), and its own screen plays the article's recordings for the
  three beats. As the card comes up it turns back to the title slide's pose,
  its screen returns to the home picture with Pip, and it settles in the
  card's picture band (.hs-fc-media), so the card's picture is the live
  tablet. HomeStory hands it the section's scroll progress with set(p).
  The scene and its videos load only once the section comes near, and it
  renders only while the section is on screen. Without WebGL the section gets
  .hs-pt-flat and CSS shows still pictures instead.
*/
import type { Tab5Scene, Rect } from '../pip/tab5Scene';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

/* Scroll timing, in the section's progress. The captions use the same
   windows (HomeStory: c1 0.14-0.4, c2 0.4-0.62, c3 0.62-0.82). */
const TURN = [0.05, 0.2] as const;      // the title leaves and the tablet turns to face us
const CLIP_IN = [0.15, 0.21] as const;  // the first recording comes up over the home screen
const SWITCH = [0.4, 0.62];             // where one recording hands over to the next
const DIP = 0.03;                       // half the width of each hand-over
const CARD = [0.8, 0.92] as const;      // the card comes up (HomeStory's --k)
const CLIPS = ['point', 'drawer', 'switch'];

export function createPipStage(section: HTMLElement) {
  const host = section.querySelector<HTMLElement>('.hs-pt-gl')!;
  const box = section.querySelector<HTMLElement>('.hs-pt-visual')!;
  const stage = section.querySelector<HTMLElement>('.hs-fl-stage')!;
  const media = section.querySelector<HTMLElement>('.hs-fc-media');
  let scene: Tab5Scene | null = null;
  let alive = true, near = false, inView = false, on = false, raf = 0, p = 0;
  let layer: HTMLVideoElement | null = null;
  let clips: HTMLVideoElement[] = [];
  let turned: Rect | null = null, facing: Rect | null = null, card: Rect | null = null;

  /* Safari on iPhone refuses to autoplay a muted video it counts as hidden (a 2 px, nearly transparent
     one was refused with NotAllowedError and never loaded), so the videos are an ordinary, opaque
     160 x 90 block in the middle of the stage, laid before the scene so the scene's opaque black
     paints over it: on screen as far as Safari is concerned, out of sight for the reader. */
  const dock = document.createElement('div');
  dock.setAttribute('aria-hidden', 'true');
  dock.style.cssText = 'position:absolute;left:50%;top:50%;width:160px;height:90px;margin:-45px 0 0 -80px;overflow:hidden;pointer-events:none';
  stage.insertBefore(dock, stage.firstChild);
  const video = (src: string) => {
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.preload = 'auto';
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
    v.src = src;
    v.addEventListener('canplay', () => { if (on && scene) apply(); });
    dock.appendChild(v);
    return v;
  };

  /* Where the body sits turned (beside the title; above it on phones), facing us (the visual box) and in the card. */
  const frames = () => {
    const hr = host.getBoundingClientRect();
    const W = hr.width || 1, H = hr.height || 1;
    const navb = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hs-navb')) || 64;
    const wide = W / H > 1.05;
    const turnedR: Rect = wide
      ? { x: W * 0.44, y: navb + H * 0.07, w: W * 0.5, h: H * 0.54 }
      : { x: W * 0.05, y: navb + 8, w: W * 0.9, h: H * 0.42 };
    const br = box.getBoundingClientRect();
    facing = { x: br.left - hr.left, y: br.top - hr.top, w: br.width, h: br.height };
    turned = turnedR;
    // the card's picture band, kept clear of the nav, with room for the turned tablet's near corner
    const m = media ? layoutRect(media) : null;
    if (m) {
      const top = Math.max(m.y, navb + 12), h = m.y + m.h - top, f = 0.84;
      card = { x: m.x + (m.w * (1 - f)) / 2, y: top + (h * (1 - f)) / 2, w: m.w * f, h: h * f };
    } else card = null;
  };
  /* A box's place in the stage by layout, so the scale the card puts on the
     scene (and on the picture band) while it comes up doesn't skew it. */
  const layoutRect = (el: HTMLElement): Rect | null => {
    let x = 0, y = 0, n: HTMLElement | null = el;
    while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
    return n ? { x, y, w: el.offsetWidth, h: el.offsetHeight } : null;
  };
  /* The card's band in the canvas's own pixels: the scene (and the canvas in
     it) shrinks about its centre by 1 - 0.06k as the card comes up. */
  const cardFrame = (k: number): Rect => {
    const s = 1 - 0.06 * k, cx = stage.offsetWidth / 2, cy = stage.offsetHeight / 2;
    const r = card!;
    return { x: cx + (r.x - cx) / s, y: cy + (r.y - cy) / s, w: r.w / s, h: r.h / s };
  };

  const started = new Set<HTMLVideoElement>();
  const play = (v: HTMLVideoElement | null | undefined, go: boolean) => {
    if (!v) return;
    if (go) { if (v.paused) v.play().then(() => started.add(v), () => {}); }
    else if (!v.paused) v.pause();
  };
  /* If Safari still refuses (Low Power Mode does), the reader's first tap starts every video once,
     which lets them play from then on; apply() pauses the ones not on screen right after. */
  const unlock = () => {
    for (const v of [layer, ...clips]) {
      if (!v || started.has(v)) continue;
      v.play().then(() => { started.add(v); apply(); }, () => {});
    }
  };
  const GESTURES = ['touchend', 'click', 'keydown'] as const;
  for (const ev of GESTURES) document.addEventListener(ev, unlock, { capture: true, passive: true });

  const apply = () => {
    if (!scene || !turned || !facing) return;
    const k = ease(ramp(p, CARD[0], CARD[1]));
    if (k > 0 && card) {
      // the card: from facing us back to the turned pose, in the card's picture band
      scene.setFrames(cardFrame(k), facing);
      scene.setProgress(1 - k);
    } else {
      scene.setFrames(turned, facing);
      scene.setProgress(ease(ramp(p, TURN[0], TURN[1])));
    }
    // which recording, and how much of it shows: in over the home screen, then a quick dip at each hand-over
    const idx = p < SWITCH[0] ? 0 : p < SWITCH[1] ? 1 : 2;
    let op = ease(ramp(p, CLIP_IN[0], CLIP_IN[1]));
    for (const s of SWITCH) op *= ease(clamp01(Math.abs(p - s) / DIP));
    op *= 1 - k;
    const clip = clips[idx] ?? null;
    scene.setClip(clip, op);
    // Pip on the home screen gives way to the recordings, which have Pip in them
    scene.setHandoff(0, 0, null, Math.max(1 - ease(ramp(p, CLIP_IN[0], CLIP_IN[1])), k));
    play(layer, on && (p < CLIP_IN[1] + 0.02 || k > 0));
    clips.forEach((v, i) => play(v, on && i === idx && op > 0));
  };

  const loop = () => {
    raf = 0;
    if (!alive || !on || !scene) return;
    apply();
    scene.render();
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && on && scene) raf = requestAnimationFrame(loop); };

  const load = () => {
    if (scene || !alive) return;
    // the H.264 copy: smaller than the WebM, and decoded in hardware on iPhones
    layer = video('/videos/pip/pip-layer.mp4');
    clips = CLIPS.map((k) => video(`/videos/pip/${k}.mp4`));
    import('../pip/tab5Scene').then(({ createTab5Scene }) => {
      if (!alive) return;
      try {
        scene = createTab5Scene(host, {
          video: layer!, glb: '/pip/tab5.glb', wallpaper: '/images/pip/mopi-home.webp',
          onReady: () => section.classList.add('hs-pt-ready'),
        });
      } catch { section.classList.add('hs-pt-flat'); return; }
      frames();
      apply();
      scene.render();
      start();
    }).catch(() => section.classList.add('hs-pt-flat'));
  };

  // load a screen and a half ahead; render only while the section is on screen
  const io = new IntersectionObserver((es) => {
    for (const e of es) {
      if (e.target === section && e.isIntersecting && !near) { near = true; load(); }
    }
  }, { rootMargin: '150% 0px 150% 0px' });
  io.observe(section);
  const vis = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    on = inView && !document.hidden;
    if (on) start(); else { apply(); clips.forEach((v) => v.pause()); layer?.pause(); }
  });
  vis.observe(section);

  const onResize = () => { if (!scene) return; scene.resize(); frames(); apply(); scene.render(); };
  window.addEventListener('resize', onResize);
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  const onVis = () => {
    on = inView && !document.hidden;
    if (on) start(); else { clips.forEach((v) => v.pause()); layer?.pause(); }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    set(v: number) { p = v; if (!raf && scene) { apply(); scene.render(); } },
    destroy() {
      alive = false; io.disconnect(); vis.disconnect();
      for (const ev of GESTURES) document.removeEventListener(ev, unlock, { capture: true });
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      if (raf) cancelAnimationFrame(raf);
      for (const v of [layer, ...clips]) { if (!v) continue; v.pause(); v.removeAttribute('src'); v.load(); }
      dock.remove();
      scene?.destroy(); scene = null;
    },
  };
}
