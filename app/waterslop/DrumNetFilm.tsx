'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENES, MAP, skeleton } from './film/scenes';
import { C, clamp01, ease, lerpRect, type Env, type Rect } from './film/draw';

/* DrumNetFilm: a full-screen canvas that walks the whole DrumNet V10
   architecture. One world map holds every stage; a camera moves from stage to
   stage while each scene animates as a function of its own progress, so the
   finale can run every stage at once. A player bar gives play, pause, step,
   and fast forward; the keyboard works too (space, arrows, f). */

const FILES = ['photo.webp', 'thumb.webp', 'spot-b1.webp', 'spot-b2.webp', 'spot-b3.webp', 'spot-b4.webp', 'spot-b5.webp',
  'ref-p1-crop.webp', 'ref-p1-b1.webp', 'ref-p1-b2.webp', 'ref-p1-b3.webp', 'ref-p1-b4.webp',
  'ref-p2-crop.webp', 'ref-p2-b1.webp', 'ref-p2-b2.webp', 'ref-p2-b3.webp', 'ref-p2-b4.webp',
  'cut-win.webp', 'cut-cells.webp', 'cut-feats.webp', 'rd-b1.webp', 'rd-b2.webp', 'rd-b3.webp', 'rd-b4.webp', 'vote-window.webp'];
const A = '/images/waterslop/dn/';
const STARTS = SCENES.reduce<number[]>((acc, s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur); return acc; }, []);
const TOTAL = STARTS[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;
const FINALE = SCENES.length - 1;
const CAM_T = 1.1;   // seconds the camera takes to reach a scene
const SPEEDS = [1, 2, 4];

const sceneAt = (t: number) => { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= STARTS[i]) k = i; return k; };

export default function DrumNetFilm({ chapter }: { chapter: string }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const images = useRef<Record<string, HTMLImageElement>>({});
  const t = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);
  const reducedRef = useRef(false);
  const inView = useRef(false);
  const started = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [frac, setFrac] = useState(0);
  const [ended, setEnded] = useState(false);

  const draw = useCallback(() => {
    const cv = canvas.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = cv.clientWidth, ch = cv.clientHeight;
    if (cv.width !== Math.round(cw * dpr) || cv.height !== Math.round(ch * dpr)) { cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); }
    const now = t.current, ki = sceneAt(now), sc = SCENES[ki], lt = now - STARTS[ki];
    // the camera: from the previous scene's view to this one's
    const prev = ki > 0 ? SCENES[ki - 1].view : sc.view;
    const view = lerpRect(prev, sc.view, reducedRef.current ? 1 : ease(lt / CAM_T));
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ws-nav')) || 0;
    const copyH = copy.current?.offsetHeight ?? 160;
    const mobile = cw < 900;
    const pad = mobile ? 12 : 28;
    // full-map scenes sit beside the caption, in the right half at full height
    const full = sc.full && !mobile;
    const ax = full ? cw * 0.5 : pad, ay = nav + (mobile ? 72 : 72), aw = full ? cw * 0.5 - pad : cw - 2 * pad, ah = full ? ch - ay - 90 : ch - ay - (copyH + (mobile ? 96 : 100));
    const scale = Math.min(aw / view.w, ah / view.h);
    // phones pin the view to the top of the area, so what follows shows beneath it instead of what came before
    const tx = ax + (aw - view.w * scale) / 2 - view.x * scale, ty = (mobile && !sc.full ? ay + 8 : ay + (ah - view.h * scale) / 2) - view.y * scale;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg; g.fillRect(0, 0, cw, ch);
    g.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * tx, dpr * ty);
    const env: Env = { img: (f) => { const im = images.current[f]; return im && im.complete && im.naturalWidth ? im : null; }, scale, reduced: reducedRef.current };
    const vis: Rect = { x: -tx / scale, y: -ty / scale, w: cw / scale, h: ch / scale };
    const hits = (r: Rect) => r.x < vis.x + vis.w && r.x + r.w > vis.x && r.y < vis.y + vis.h && r.y + r.h > vis.y;
    skeleton(g, env);
    const finaleP = ki === FINALE ? clamp01(lt / sc.dur) : -1;
    for (let i = 1; i < FINALE; i++) {
      const s = SCENES[i];
      const p = finaleP >= 0 ? finaleP : (now - STARTS[i]) / s.dur;
      if (p < 0) continue;
      if (!hits(s.view) && !(finaleP >= 0)) continue;
      s.draw(g, env, Math.min(1, p));
    }
    // scrims under the nav and the caption, so the map never collides with the words
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const topEnd = ay + 4;
    const gt = g.createLinearGradient(0, topEnd - 40, 0, topEnd);
    gt.addColorStop(0, 'rgba(24,23,22,0.97)'); gt.addColorStop(1, 'rgba(24,23,22,0)');
    g.fillStyle = 'rgba(24,23,22,0.97)'; g.fillRect(0, 0, cw, topEnd - 40);
    g.fillStyle = gt; g.fillRect(0, topEnd - 40, cw, 40);
    if (!full) {
      const top = ch - (copyH + (mobile ? 96 : 100)) - 50;
      const gr = g.createLinearGradient(0, top, 0, top + 110);
      gr.addColorStop(0, 'rgba(24,23,22,0)'); gr.addColorStop(1, 'rgba(24,23,22,0.94)');
      g.fillStyle = gr; g.fillRect(0, top, cw, 110);
      g.fillStyle = 'rgba(24,23,22,0.94)'; g.fillRect(0, top + 110, cw, ch - top - 110);
    }
  }, []);

  const tick = useCallback((ts: number) => {
    raf.current = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (ts - last.current) / 1000); last.current = ts;
    if (playingRef.current && !reducedRef.current) {
      t.current += dt * speedRef.current;
      if (t.current >= TOTAL) { t.current = TOTAL - 0.001; playingRef.current = false; setPlaying(false); setEnded(true); }
    }
    const ki = sceneAt(t.current);
    setK((v) => (v === ki ? v : ki));
    setFrac(clamp01((t.current - STARTS[ki]) / SCENES[ki].dur));
    draw();
  }, [draw]);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    FILES.forEach((f) => { const im = new Image(); im.src = A + f; images.current[f] = im; });
    Promise.all([document.fonts?.load("16px 'Libre Baskerville'"), document.fonts?.load('16px Manrope')].filter(Boolean)).catch(() => {});
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    const el = section.current!;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting && !started.current && !reducedRef.current) { started.current = true; playingRef.current = true; setPlaying(true); }
      if (!e.isIntersecting && playingRef.current) { playingRef.current = false; setPlaying(false); }
    }, { threshold: 0.5 });
    io.observe(el);
    const w = window as unknown as { __dnf?: unknown };
    w.__dnf = { seek: (s: number) => { t.current = Math.max(0, Math.min(TOTAL - 0.001, s)); }, pause: () => { playingRef.current = false; setPlaying(false); }, play: () => { playingRef.current = true; setPlaying(true); }, starts: STARTS, total: TOTAL };
    return () => { cancelAnimationFrame(raf.current); io.disconnect(); delete w.__dnf; };
  }, [tick]);

  const seekScene = useCallback((i: number) => {
    const idx = Math.max(0, Math.min(SCENES.length - 1, i));
    t.current = reducedRef.current ? STARTS[idx] + SCENES[idx].dur - 0.001 : STARTS[idx];
    setEnded(false);
    if (!reducedRef.current) { playingRef.current = true; setPlaying(true); }
  }, []);
  const toggle = useCallback(() => {
    if (reducedRef.current) return;
    if (ended) { t.current = 0; setEnded(false); }
    playingRef.current = !playingRef.current; setPlaying(playingRef.current);
  }, [ended]);
  const faster = useCallback(() => { const i = (SPEEDS.indexOf(speedRef.current) + 1) % SPEEDS.length; speedRef.current = SPEEDS[i]; setSpeed(SPEEDS[i]); if (!playingRef.current && !reducedRef.current && !ended) { playingRef.current = true; setPlaying(true); } }, [ended]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!inView.current) return;
      const tg = e.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); seekScene(sceneAt(t.current) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); seekScene(sceneAt(t.current) - 1); }
      else if (e.key === 'f' || e.key === 'F') faster();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [toggle, seekScene, faster]);

  const sc = SCENES[k];
  return (
    <section ref={section} id="drumnet-body" className="dnf" aria-label="DrumNet V10, the whole architecture animated">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="ws-stage-chapter dnf-chapter">{`Chapter - ${chapter}`}<span>DrumNet</span></div>
      <div ref={copy} className="dnf-copy" aria-live="polite">
        <p className="ws-eyebrow">{sc.stage} · {k + 1} of {SCENES.length}</p>
        <h2>{sc.title}</h2>
        <p className="dnf-body">{sc.body}</p>
      </div>
      <div className="dnf-bar">
        <div className="dnf-rail" role="list" aria-label="Scenes">
          {SCENES.map((s, i) => (
            <button key={s.id} type="button" title={s.title} aria-label={`${i + 1}. ${s.title}`} className={i === k ? 'on' : i < k ? 'done' : undefined} onClick={() => seekScene(i)}>
              {i === k && <i style={{ width: `${frac * 100}%` }} />}
            </button>
          ))}
        </div>
        <div className="dnf-ctl">
          <button type="button" onClick={() => seekScene(k - 1)} aria-label="Previous scene" title="Previous (←)">‹</button>
          <button type="button" className="primary" onClick={toggle} aria-label={playing ? 'Pause' : ended ? 'Replay' : 'Play'} title="Play / pause (space)">{playing ? '❚❚' : ended ? '↺' : '▶'}</button>
          <button type="button" onClick={() => seekScene(k + 1)} aria-label="Next scene" title="Next (→)">›</button>
          <button type="button" className={speed > 1 ? 'fast' : undefined} onClick={faster} aria-label={`Fast forward, now ${speed} times`} title="Fast forward (f)">{speed}× {speed === 1 ? '▸' : speed === 2 ? '▸▸' : '▸▸▸'}</button>
        </div>
      </div>
      <style>{`
        .dnf { position: relative; z-index: 2; height: 100svh; min-height: 560px; background: var(--bg); overflow: hidden; isolation: isolate; }
        .dnf canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .dnf-chapter { position: absolute; }
        .dnf-copy { position: absolute; left: 4%; bottom: 84px; width: min(46%, 640px); pointer-events: none; z-index: 3; }
        .dnf-copy .ws-eyebrow { font: 600 clamp(10px, 0.78vw, 14px)/1.4 var(--sans); letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin: 0 0 0.5em; }
        .dnf-copy h2 { font-family: var(--serif); font-weight: 400; font-size: clamp(20px, 2.2vw, 38px); line-height: 1.1; letter-spacing: -0.02em; color: var(--ink); margin: 0 0 0.4em; text-wrap: balance; }
        .dnf-body { font: 400 clamp(13px, 1vw, 17px)/1.55 var(--sans); color: var(--body); margin: 0; max-width: 62ch; text-wrap: pretty; }
        .dnf-bar { position: absolute; left: 4%; right: 4%; bottom: 22px; display: flex; align-items: center; gap: 18px; z-index: 4; }
        .dnf-rail { flex: 1; display: flex; gap: 3px; height: 18px; }
        .dnf-rail button { flex: 1; position: relative; height: 18px; border: 0; padding: 0; background: none; cursor: pointer; }
        .dnf-rail button::before { content: ''; position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: #d8cbb833; transition: background 0.2s; }
        .dnf-rail button.done::before { background: #d8cbb875; }
        .dnf-rail button.on::before { background: #d8cbb84d; }
        .dnf-rail button:hover::before { background: var(--hi); }
        .dnf-rail button i { position: absolute; left: 0; top: 8px; height: 2px; background: var(--ink); }
        .dnf-ctl { display: flex; gap: 6px; }
        .dnf-ctl button { min-width: 42px; height: 42px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 4px; background: #d8cbb80d; color: var(--ink); font: 500 13px var(--sans); cursor: pointer; transition: background 0.15s, color 0.15s; letter-spacing: 0.04em; }
        .dnf-ctl button:hover { background: #d8cbb822; color: var(--hi); }
        .dnf-ctl button.primary { background: var(--btn); border-color: var(--btn); color: var(--btn-ink); min-width: 54px; }
        .dnf-ctl button.primary:hover { background: var(--hi); border-color: var(--hi); color: var(--btn-ink); }
        .dnf-ctl button.fast { color: var(--hi); border-color: var(--ink); }
        .dnf-ctl button:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px; }
        @media (max-width: 900px) {
          .dnf-copy { left: 5%; right: 5%; width: auto; bottom: 92px; }
          .dnf-copy h2 { font-size: clamp(19px, 5.6vw, 26px); }
          .dnf-body { font-size: 12.5px; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
          .dnf-bar { left: 5%; right: 5%; bottom: 18px; gap: 10px; }
          .dnf-ctl button { min-width: 36px; height: 36px; padding: 0 8px; font-size: 12px; }
          .dnf-ctl button.primary { min-width: 44px; }
        }
        @media (prefers-reduced-motion: reduce) { .dnf-rail button::before { transition: none; } }
      `}</style>
    </section>
  );
}
