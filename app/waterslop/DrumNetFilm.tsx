'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENES, REVEAL, PHOTO, skeleton, revealedBounds, type PanelKey } from './film/scenes';
import { C, clamp01, ease, lerpRect, type Env, type Rect } from './film/draw';

/* DrumNetFilm: a full-screen canvas that walks the whole DrumNet V10
   architecture. One world map holds every stage; panels appear as the film
   reaches them, and a smooth camera moves from stage to stage while each
   scene animates as a function of its own progress, so the finale can run
   every stage at once. A player bar gives play, pause, step, fast forward and
   a zoom toggle between the action and the map so far; the keyboard works too
   (space, arrows, f, z). */

const FILES = ['photo.webp', 'thumb.webp', 'spot-b1.webp', 'spot-b2.webp', 'spot-b3.webp', 'spot-b4.webp', 'spot-b5.webp',
  'ref-p1-crop.webp', 'ref-p1-b1.webp', 'ref-p1-b2.webp', 'ref-p1-b3.webp', 'ref-p1-b4.webp',
  'ref-p2-crop.webp', 'ref-p2-b1.webp', 'ref-p2-b2.webp', 'ref-p2-b3.webp', 'ref-p2-b4.webp',
  'cut-win.webp', 'cut-cells.webp', 'cut-feats.webp', 'rd-b1.webp', 'rd-b2.webp', 'rd-b3.webp', 'rd-b4.webp', 'vote-window.webp'];
const A = '/images/waterslop/dn/';
const STARTS = SCENES.reduce<number[]>((acc, s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur); return acc; }, []);
const TOTAL = STARTS[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;
const FINALE = SCENES.length - 1;
const IDX: Record<string, number> = Object.fromEntries(SCENES.map((s, i) => [s.id, i]));
const SPEEDS = [1, 2, 4];

const sceneAt = (t: number) => { let k = 0; for (let i = 0; i < SCENES.length; i++) if (t >= STARTS[i]) k = i; return k; };

export default function DrumNetFilm({ chapter }: { chapter: string }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const images = useRef<Record<string, HTMLImageElement>>({});
  const t = useRef(0);
  const cam = useRef<Rect | null>(null);
  const playingRef = useRef(false);
  const speedRef = useRef(1);
  const zoomRef = useRef(false);
  const reducedRef = useRef(false);
  const inView = useRef(false);
  const started = useRef(false);
  const raf = useRef(0);
  // The film holds the page: scrolling past it waits until it reaches its finale.
  const holdRef = useRef(true);
  const [nudge, setNudge] = useState(false);
  const nudgeTimer = useRef(0);
  const last = useRef(0);
  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoomOut, setZoomOut] = useState(false);
  const [frac, setFrac] = useState(0);
  const [ended, setEnded] = useState(false);

  const draw = useCallback((dt: number) => {
    const cv = canvas.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = cv.clientWidth, ch = cv.clientHeight;
    if (cv.width !== Math.round(cw * dpr) || cv.height !== Math.round(ch * dpr)) { cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); }
    const now = t.current, ki = sceneAt(now), sc = SCENES[ki], lt = now - STARTS[ki];
    const finaleP = ki === FINALE ? clamp01(lt / sc.dur) : -1;
    // which panels exist yet
    const alphaOf = (key: PanelKey) => { const i = IDX[REVEAL[key]]; return finaleP >= 0 ? 1 : clamp01((now - STARTS[i] + 0.7) / 0.8); };
    // the camera: the scene's own view, or the map so far when zoomed out; eased towards its target
    const wide = zoomRef.current || sc.full;
    const target = wide ? revealedBounds(alphaOf) : sc.viewAt ? sc.viewAt(clamp01(lt / sc.dur)) : sc.view;
    if (!cam.current || reducedRef.current) cam.current = target;
    else { const e = 1 - Math.exp(-dt * 3.2); cam.current = lerpRect(cam.current, target, e); }
    const view = cam.current;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ws-nav')) || 0;
    const copyH = copy.current?.offsetHeight ?? 160;
    const mobile = cw < 900;
    const pad = mobile ? 12 : 28;
    // wide views sit beside the caption, in the right half at full height
    const side = wide && !mobile;
    const below = copy.current ? ch - copy.current.offsetTop + (mobile ? 4 : 16) : copyH + (mobile ? 96 : 100);
    const ax = side ? cw * 0.5 : pad, ay = nav + 72, aw = side ? cw * 0.5 - pad : cw - 2 * pad, ah = side ? ch - ay - 90 : ch - ay - below;
    let scale = Math.min(aw / view.w, ah / view.h);
    let tx = ax + (aw - view.w * scale) / 2 - view.x * scale, ty = (mobile && !wide ? ay + 8 : ay + (ah - view.h * scale) / 2) - view.y * scale;
    // The opening: the photo fills the screen (cover), as the 3D chapter's capture
    // left it, then the camera pulls back to the normal framing.
    const bleed = reducedRef.current ? 0 : now < STARTS[1] ? 1 : 1 - ease(clamp01((now - STARTS[1]) / 0.9));
    if (bleed > 0) {
      const sB = Math.max(cw / PHOTO.w, ch / PHOTO.h);
      const from = { x: tx + PHOTO.x * scale, y: ty + PHOTO.y * scale, w: PHOTO.w * scale, h: PHOTO.h * scale };
      const to = { x: (cw - PHOTO.w * sB) / 2, y: (ch - PHOTO.h * sB) / 2, w: PHOTO.w * sB, h: PHOTO.h * sB };
      const r = lerpRect(from, to, bleed);
      scale = r.w / PHOTO.w; tx = r.x - PHOTO.x * scale; ty = r.y - PHOTO.y * scale;
    }
    section.current?.style.setProperty('--bleed', bleed.toFixed(3));
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.bg; g.fillRect(0, 0, cw, ch);
    g.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * tx, dpr * ty);
    const env: Env = { img: (f) => { const im = images.current[f]; return im && im.complete && im.naturalWidth ? im : null; }, scale, reduced: reducedRef.current };
    const vis: Rect = { x: -tx / scale, y: -ty / scale, w: cw / scale, h: ch / scale };
    const hits = (r: Rect) => r.x < vis.x + vis.w && r.x + r.w > vis.x && r.y < vis.y + vis.h && r.y + r.h > vis.y;
    skeleton(g, env, alphaOf);
    for (let i = 0; i < FINALE; i++) {
      const s = SCENES[i];
      if (finaleP >= 0) { if (!s.until) (s.finale ?? s.draw)(g, env, finaleP); continue; }
      const p = (now - STARTS[i]) / s.dur;
      if (p < 0) continue;
      if (s.until && now >= STARTS[IDX[s.until]]) continue;
      if (!hits(s.view)) continue;
      s.draw(g, env, Math.min(1, p));
    }
    // scrims under the nav and the caption, so the map never collides with the words
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = 1 - bleed;
    const topEnd = ay + 4;
    const gt = g.createLinearGradient(0, topEnd - 40, 0, topEnd);
    gt.addColorStop(0, 'rgba(24,23,22,0.97)'); gt.addColorStop(1, 'rgba(24,23,22,0)');
    g.fillStyle = 'rgba(24,23,22,0.97)'; g.fillRect(0, 0, cw, topEnd - 40);
    g.fillStyle = gt; g.fillRect(0, topEnd - 40, cw, 40);
    if (!side) {
      const top = ch - below - 50;
      const gr = g.createLinearGradient(0, top, 0, top + 110);
      gr.addColorStop(0, 'rgba(24,23,22,0)'); gr.addColorStop(1, 'rgba(24,23,22,0.94)');
      g.fillStyle = gr; g.fillRect(0, top, cw, 110);
      g.fillStyle = 'rgba(24,23,22,0.94)'; g.fillRect(0, top + 110, cw, ch - top - 110);
    } else {
      g.fillStyle = 'rgba(24,23,22,0.94)'; g.fillRect(0, ch - 90, cw, 90);
    }
    g.globalAlpha = 1;
  }, []);

  const tick = useCallback((ts: number) => {
    raf.current = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (ts - last.current) / 1000); last.current = ts;
    if (playingRef.current && !reducedRef.current) {
      t.current += dt * speedRef.current;
      if (t.current >= TOTAL) { t.current = TOTAL - 0.001; playingRef.current = false; setPlaying(false); setEnded(true); }
    }
    const ki = sceneAt(t.current);
    if (ki >= FINALE && holdRef.current) { holdRef.current = false; document.documentElement.removeAttribute('data-ws-hold'); }
    setK((v) => (v === ki ? v : ki));
    setFrac(clamp01((t.current - STARTS[ki]) / SCENES[ki].dur));
    draw(dt);
  }, [draw]);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    FILES.forEach((f) => { const im = new Image(); im.src = A + f; images.current[f] = im; });
    Promise.all([document.fonts?.load("16px 'Libre Baskerville'"), document.fonts?.load('16px Manrope')].filter(Boolean)).catch(() => {});
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    const el = section.current!;
    // The film sits over the end of the 3D chapter (margin-top: -100svh) and stays
    // invisible until its top reaches the top of the screen, where its first frame
    // is the chapter's last: the same photo, full-bleed. It starts there, not before,
    // so the hand-over always lands on that frame.
    let under = true, sraf = 0;
    const place = () => {
      sraf = 0;
      const top = el.getBoundingClientRect().top;
      const now = top > 1;
      if (now !== under) {
        under = now;
        el.dataset.under = String(now);
        if (now) {
          if (playingRef.current) { playingRef.current = false; setPlaying(false); }
          // back under the chapter early on: rewind, so coming back lands on the photo again
          if (t.current < STARTS[2]) { t.current = 0; cam.current = null; started.current = false; }
        } else if (inView.current && !started.current && !reducedRef.current) { started.current = true; playingRef.current = true; setPlaying(true); }
      }
    };
    const onScrollPlace = () => { if (!sraf) sraf = requestAnimationFrame(place); };
    el.dataset.under = 'true';
    place();
    window.addEventListener('scroll', onScrollPlace, { passive: true });
    window.addEventListener('resize', onScrollPlace);

    /* The hold: until the film reaches its finale, the page stops with the film
       filling the screen. Scrolling down is held there (wheel, touch, keys, and
       anything else snaps back); scrolling up, the film's own controls, and the
       Skip to the end button still work. Reduced motion never holds. */
    const html = document.documentElement;
    if (reducedRef.current) holdRef.current = false;
    else html.setAttribute('data-ws-hold', '1');
    const holding = () => holdRef.current && !html.hasAttribute('data-ws-skipping');
    const covering = () => { const r = el.getBoundingClientRect(); return r.top <= 1 && r.top >= -2; };
    const topY = () => el.getBoundingClientRect().top + window.scrollY;
    const poke = () => { setNudge(true); window.clearTimeout(nudgeTimer.current); nudgeTimer.current = window.setTimeout(() => setNudge(false), 2600); };
    const onWheel = (e: WheelEvent) => {
      if (holding() && e.deltaY > 0 && covering()) { e.preventDefault(); e.stopPropagation(); poke(); }
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      if (holding() && y < touchY - 2 && covering() && e.cancelable) { e.preventDefault(); poke(); }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!holding() || !covering()) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || (e.key === ' ' && e.shiftKey === false && !inView.current)) { e.preventDefault(); e.stopPropagation(); poke(); }
    };
    // anything else (a scrollbar drag, momentum, a nudge from another script) snaps back,
    // but a long jump (a contents link, Skip to the end) is let through
    let lastY = window.scrollY;
    const onScrollHold = () => {
      const y = window.scrollY, top = topY();
      if (holding() && y > top + 2 && lastY <= top + 2 && y - lastY < window.innerHeight * 1.5) {
        window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
        lastY = top; poke(); return;
      }
      lastY = y;
    };
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', onKey, { capture: true });
    window.addEventListener('scroll', onScrollHold, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      if (e.isIntersecting && !under && !started.current && !reducedRef.current) { started.current = true; playingRef.current = true; setPlaying(true); }
      if (!e.isIntersecting && playingRef.current) { playingRef.current = false; setPlaying(false); }
    }, { threshold: 0.5 });
    io.observe(el);
    const w = window as unknown as { __dnf?: unknown };
    w.__dnf = { seek: (s: number) => { t.current = Math.max(0, Math.min(TOTAL - 0.001, s)); cam.current = null; }, pause: () => { playingRef.current = false; setPlaying(false); }, play: () => { playingRef.current = true; setPlaying(true); }, zoom: (z: boolean) => { zoomRef.current = z; setZoomOut(z); }, starts: STARTS, total: TOTAL };
    return () => {
      cancelAnimationFrame(raf.current); cancelAnimationFrame(sraf); io.disconnect();
      window.removeEventListener('scroll', onScrollPlace); window.removeEventListener('resize', onScrollPlace);
      window.removeEventListener('wheel', onWheel, { capture: true }); window.removeEventListener('touchstart', onTouchStart, { capture: true });
      window.removeEventListener('touchmove', onTouchMove, { capture: true }); window.removeEventListener('keydown', onKey, { capture: true });
      window.removeEventListener('scroll', onScrollHold); window.clearTimeout(nudgeTimer.current);
      html.removeAttribute('data-ws-hold'); delete w.__dnf;
    };
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
  const zoom = useCallback(() => { zoomRef.current = !zoomRef.current; setZoomOut(zoomRef.current); }, []);
  // Leave the film for the next chapter: lets the hold go and glides to ConfigKing.
  const skipChapter = useCallback(() => {
    const next = document.getElementById('configking');
    if (!next) return;
    const html = document.documentElement;
    html.setAttribute('data-ws-skipping', '');
    window.setTimeout(() => html.removeAttribute('data-ws-skipping'), 2400);
    playingRef.current = false; setPlaying(false);
    window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY, behavior: reducedRef.current ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!inView.current) return;
      const tg = e.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); seekScene(sceneAt(t.current) + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); seekScene(sceneAt(t.current) - 1); }
      else if (e.key === 'f' || e.key === 'F') faster();
      else if (e.key === 'z' || e.key === 'Z') zoom();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [toggle, seekScene, faster, zoom]);

  const sc = SCENES[k];
  return (
    <section ref={section} id="drumnet" className="dnf" aria-label="DrumNet V10, the whole architecture animated">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="ws-stage-chapter dnf-chapter">{`Chapter - ${chapter}`}<span>DrumNet</span></div>
      <div ref={copy} className="dnf-copy" aria-live="polite">
        <p className="ws-eyebrow">{sc.stage} · {k + 1} of {SCENES.length}</p>
        <h2>{sc.title}</h2>
        <p className="dnf-body">{sc.body}</p>
      </div>
      <p className={`dnf-nudge${nudge ? ' on' : ''}`} role="status">The page carries on when the film ends. › skips a scene, {SPEEDS[SPEEDS.length - 1]}× speeds it up.</p>
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
          <button type="button" className="skip" onClick={skipChapter} title="Skip to the next chapter, ConfigKing">Skip chapter</button>
        </div>
      </div>
      <style>{`
        .dnf { position: relative; z-index: 6; height: 100svh; min-height: 560px; margin-top: -100svh; background: var(--bg); overflow: hidden; isolation: isolate; transition: opacity 0.12s linear; }
        .dnf[data-under="true"] { opacity: 0; pointer-events: none; }
        .dnf-chapter, .dnf-copy, .dnf-bar { opacity: calc(1 - var(--bleed, 0)); }
        .dnf-nudge { position: absolute; z-index: 5; left: 50%; top: calc(var(--ws-nav, 56px) + 16px); margin: 0; padding: 9px 16px; border: 1px solid var(--line-strong); border-radius: 999px; background: #181716e6; color: var(--hi); font: 500 13px/1.3 var(--sans); letter-spacing: 0.01em; white-space: nowrap; opacity: 0; transform: translate(-50%, -6px); transition: opacity 0.2s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; }
        .dnf-nudge.on { opacity: 1; transform: translate(-50%, 0); }
        /* room for the floating Skip to the end button in the bottom-left corner */
        html[data-ws-skip="on"] .dnf-bar { left: calc(var(--ws-skip-x, 20px) + var(--ws-skip-w, 150px) + 20px); }
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
        .dnf-ctl button { min-width: 42px; height: 42px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 4px; background: #d8cbb80d; color: var(--ink); font: 500 13px var(--sans); cursor: pointer; transition: background 0.15s, color 0.15s; letter-spacing: 0.04em; white-space: nowrap; }
        .dnf-ctl button:hover { background: #d8cbb822; color: var(--hi); }
        .dnf-ctl button.primary { background: var(--btn); border-color: var(--btn); color: var(--btn-ink); min-width: 54px; }
        .dnf-ctl button.primary:hover { background: var(--hi); border-color: var(--hi); color: var(--btn-ink); }
        .dnf-ctl button.fast { color: var(--hi); border-color: var(--ink); }
        .dnf-ctl button:focus-visible { outline: 1px solid var(--ink); outline-offset: 3px; }
        @media (max-width: 900px) {
          .dnf-copy { left: 5%; right: 5%; width: auto; bottom: 92px; }
          html[data-ws-skip="on"] .dnf-bar { left: 5%; }
          html[data-ws-skip="on"] .dnf-copy { bottom: 136px; }
          .dnf-nudge { white-space: normal; width: 88%; text-align: center; font-size: 12px; }
          .dnf-copy h2 { font-size: clamp(19px, 5.6vw, 26px); }
          .dnf-body { font-size: 12.5px; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
          .dnf-bar { left: 5%; right: 5%; bottom: 18px; gap: 10px; flex-wrap: wrap; }
          .dnf-rail { flex-basis: 100%; height: 14px; }
          .dnf-ctl { width: 100%; justify-content: space-between; }
          .dnf-ctl button { min-width: 36px; height: 36px; padding: 0 8px; font-size: 12px; flex: 1; }
          .dnf-ctl button.primary { min-width: 44px; }
          .dnf-ctl button.skip { flex: 2.1; }
        }
        @media (prefers-reduced-motion: reduce) { .dnf-rail button::before { transition: none; } }
      `}</style>
    </section>
  );
}
