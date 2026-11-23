'use client';
/*
  The playground around plyViewer.ts: Braven's scan to turn, move, zoom and
  recolour, and room for the reader's own .ply (a link or a drop). The few
  controls sit on the view itself: the colour switch, Stack-chan's view, reset
  and full screen. It loads when it comes near the screen and renders only
  while it is on screen.
*/
import { useEffect, useRef, useState } from 'react';
import { createPlyViewer, PlyError, type PlyInfo, type PlyViewer } from './plyViewer';
import { hasWebGL } from './lidarScene';
import type { LidarCopy } from './_copy';
import { fill } from '@/lib/fill';

const fmt = (n: number) => n.toLocaleString('en-GB');

const Icon = {
  eye: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>,
  reset: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></svg>,
  full: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>,
  shrink: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>,
};

/* t: the playground's words (copy.pg), passed in by the article or the embed. */
export default function PlyPlayground({ still, stillAlt, t }: { still: string; stillAlt: string; t: LidarCopy['pg'] }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<PlyViewer | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'flat'>('idle');
  const [info, setInfo] = useState<PlyInfo | null>(null);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState<0 | 1 | 2>(0);
  const [eye, setEye] = useState(false);
  const [full, setFull] = useState(false);
  const [upY, setUpY] = useState(false);
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const last = useRef<File | null>(null);

  useEffect(() => {
    const el = box.current, gl = host.current;
    if (!el || !gl) return;
    setCoarse(window.matchMedia('(pointer: coarse)').matches);
    if (!hasWebGL()) { setState('flat'); return; }
    let alive = true;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !viewer.current) {
        setState('loading');
        try { viewer.current = createPlyViewer(gl); } catch { setState('flat'); return; }
        viewer.current.resize();
        viewer.current.bundled().then((i) => { if (!alive) return; setInfo(i); setState('ready'); }).catch(() => setState('flat'));
      }
      viewer.current?.setActive(e.isIntersecting);
    }, { rootMargin: '200px' });
    io.observe(el);
    const onResize = () => viewer.current?.resize();
    const onFull = () => { setFull(document.fullscreenElement === el); requestAnimationFrame(onResize); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull((f) => (f && !document.fullscreenElement ? false : f)); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onFull);
    return () => {
      alive = false; io.disconnect();
      window.removeEventListener('resize', onResize); document.removeEventListener('fullscreenchange', onFull);
      window.removeEventListener('keydown', onKey); document.documentElement.classList.remove('pg-lock');
      viewer.current?.destroy(); viewer.current = null;
    };
  }, []);

  const load = async (f: File, y = upY) => {
    if (!viewer.current) return;
    setErr(''); last.current = f; setEye(false);
    try { setInfo(await viewer.current.open(f, y)); }
    catch (e) { setErr(e instanceof PlyError ? t.errors[e.code] : e instanceof Error ? e.message : t.errors.unreadable); }
  };
  const back = async () => { if (!viewer.current) return; setErr(''); last.current = null; setEye(false); setInfo(await viewer.current.bundled()); };
  /* Full screen: the browser's own where it allows it for an element; phones that don't (Safari on iPhone)
     get the view filling the window instead, with the page behind it locked. */
  const toggleFull = () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (full) { setFull(false); return; }
    const fallback = () => setFull(true);
    if (el.requestFullscreen && document.fullscreenEnabled) el.requestFullscreen().catch(fallback);
    else fallback();
  };
  useEffect(() => {
    document.documentElement.classList.toggle('pg-lock', full && !document.fullscreenElement);
    requestAnimationFrame(() => viewer.current?.resize());
  }, [full]);

  const sizeTxt = info ? info.size.map((v) => v.toFixed(1)).join(' x ') : '';
  const hint = coarse ? t.hintTouch : t.hintMouse;

  return (
    <div className={`pg is-${state}${drag ? ' is-drag' : ''}`} data-no-zoom>
      <div className={`pg-view${full ? ' is-full' : ''}`} ref={box}
        onPointerDown={() => setTouched(true)}
        onWheel={() => setTouched(true)}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) load(f); }}>
        <div className="pg-gl" ref={host} role="img" aria-label={t.view} />
        <img className="pg-still" src={still} alt={stillAlt} loading="lazy" />
        {state === 'loading' && <p className="pg-msg">{t.loading}</p>}
        {state === 'ready' && !touched && <p className="pg-msg is-hint" aria-hidden="true">{hint}</p>}
        {drag && <p className="pg-drop">{t.drop}</p>}
        {info && state === 'ready' && (
          <p className="pg-stat"><b>{info.name}</b><span>{fill(t.stat, { n: fmt(info.points), size: sizeTxt })}</span></p>
        )}
        {state === 'ready' && (
          <div className="pg-bar">
            <div className="pg-seg" role="radiogroup" aria-label={t.colourBy}>
              {t.modes.map((m, i) => (
                <button key={m} type="button" role="radio" aria-checked={mode === i} className={mode === i ? 'is-on' : ''}
                  onClick={() => { setMode(i as 0 | 1 | 2); viewer.current?.setMode(i as 0 | 1 | 2); }}>{m}</button>
              ))}
            </div>
            <div className="pg-icons">
              {info?.robot && (
                <button type="button" className={`pg-icon${eye ? ' is-on' : ''}`} aria-pressed={eye} title={t.eyeTitle}
                  onClick={() => { const v = !eye; setEye(v); viewer.current?.view(v ? 'eye' : 'home'); }}>
                  {Icon.eye}<span className="pg-sr">{t.eye}</span>
                </button>
              )}
              <button type="button" className="pg-icon" title={t.reset} onClick={() => { setEye(false); viewer.current?.view('home'); }}>
                {Icon.reset}<span className="pg-sr">{t.reset}</span>
              </button>
              <button type="button" className="pg-icon" title={full ? t.leaveFull : t.full} onClick={toggleFull}>
                {full ? Icon.shrink : Icon.full}<span className="pg-sr">{full ? t.leaveFull : t.full}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pg-files">
        <button type="button" className="pg-text" onClick={() => file.current?.click()} disabled={state !== 'ready'}>{t.open}</button>
        <input ref={file} type="file" accept=".ply" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); e.target.value = ''; }} />
        {info && !info.robot ? (
          <>
            <label className="pg-check"><input type="checkbox" checked={upY} onChange={(e) => { setUpY(e.target.checked); if (last.current) load(last.current, e.target.checked); }} /> {t.upY}</label>
            <button type="button" className="pg-text" onClick={back}>{t.back}</button>
          </>
        ) : (
          <a className="pg-text" href="/stackchan-lidar/stackchan-scan-9-dense.ply" download>{t.download}</a>
        )}
        {err && <p className="pg-err" role="alert">{err}</p>}
      </div>
    </div>
  );
}
