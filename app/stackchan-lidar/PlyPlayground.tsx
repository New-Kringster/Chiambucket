'use client';
/*
  The playground around plyViewer.ts: Braven's scan to turn, zoom, recolour
  and slice, and room for the reader's own .ply (a button or a drop). It loads
  when it comes near the screen and renders only while it is on screen.
*/
import { useEffect, useRef, useState } from 'react';
import { createPlyViewer, type PlyInfo, type PlyViewer } from './plyViewer';
import { hasWebGL } from './lidarScene';

const MODES = ['Photo', 'Depth', 'Height'] as const;
const fmt = (n: number) => n.toLocaleString('en-GB');

export default function PlyPlayground({ still, stillAlt }: { still: string; stillAlt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const viewer = useRef<PlyViewer | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'flat'>('idle');
  const [info, setInfo] = useState<PlyInfo | null>(null);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState<0 | 1 | 2>(0);
  const [size, setSize] = useState(1.6);
  const [slice, setSlice] = useState(1);
  const [spin, setSpin] = useState(false);
  const [upY, setUpY] = useState(false);
  const [drag, setDrag] = useState(false);
  const [touched, setTouched] = useState(false);
  const last = useRef<File | null>(null);

  useEffect(() => {
    const el = box.current, gl = host.current;
    if (!el || !gl) return;
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
    window.addEventListener('resize', onResize);
    return () => { alive = false; io.disconnect(); window.removeEventListener('resize', onResize); viewer.current?.destroy(); viewer.current = null; };
  }, []);

  const load = async (f: File, y = upY) => {
    if (!viewer.current) return;
    setErr(''); last.current = f;
    try { const i = await viewer.current.open(f, y); setInfo(i); setSlice(1); viewer.current.setSlice(1); }
    catch (e) { setErr(e instanceof Error ? e.message : 'That file could not be read.'); }
  };
  const back = async () => { if (!viewer.current) return; setErr(''); last.current = null; setSlice(1); viewer.current.setSlice(1); setInfo(await viewer.current.bundled()); };

  const sizeTxt = info ? info.size.map((v) => v.toFixed(1)).join(' x ') : '';

  return (
    <div className={`pg is-${state}${drag ? ' is-drag' : ''}`} data-no-zoom>
      <div className="pg-view" ref={box}
        onPointerDown={() => setTouched(true)}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) load(f); }}>
        <div className="pg-gl" ref={host} role="img" aria-label="A 3D point cloud: drag to turn it, scroll or pinch to zoom" />
        <img className="pg-still" src={still} alt={stillAlt} loading="lazy" />
        {state === 'loading' && <p className="pg-msg">Loading the scan</p>}
        {state === 'ready' && !touched && <p className="pg-msg is-hint" aria-hidden="true">Drag to turn, scroll or pinch to zoom</p>}
        {drag && <p className="pg-drop">Drop a .ply to open it</p>}
        {info && state === 'ready' && (
          <p className="pg-stat"><b>{info.name}</b><span>{fmt(info.points)} points, {sizeTxt} m</span></p>
        )}
      </div>

      <div className="pg-tools" aria-label="Viewer controls">
        <div className="pg-group">
          <span className="pg-label" id="pg-colour">Colour</span>
          <div className="pg-seg" role="radiogroup" aria-labelledby="pg-colour">
            {MODES.map((m, i) => (
              <button key={m} type="button" role="radio" aria-checked={mode === i} className={mode === i ? 'is-on' : ''}
                onClick={() => { setMode(i as 0 | 1 | 2); viewer.current?.setMode(i as 0 | 1 | 2); }}>{m}</button>
            ))}
          </div>
        </div>
        <label className="pg-group pg-range">
          <span className="pg-label">Point size</span>
          <input type="range" min={0.6} max={4} step={0.1} value={size} onChange={(e) => { const v = +e.target.value; setSize(v); viewer.current?.setSize(v); }} />
        </label>
        <label className="pg-group pg-range">
          <span className="pg-label">Slice from the top</span>
          <input type="range" min={0.15} max={1} step={0.01} value={slice} onChange={(e) => { const v = +e.target.value; setSlice(v); viewer.current?.setSlice(v); }} />
        </label>
        <div className="pg-group pg-btns">
          <button type="button" className={`pg-btn${spin ? ' is-on' : ''}`} aria-pressed={spin} onClick={() => { setSpin(!spin); viewer.current?.setSpin(!spin); }}>Spin</button>
          <button type="button" className="pg-btn" onClick={() => viewer.current?.reset()}>Reset view</button>
        </div>
      </div>

      <div className="pg-files">
        <button type="button" className="pg-btn is-primary" onClick={() => file.current?.click()} disabled={state !== 'ready'}>Open your own .ply</button>
        <input ref={file} type="file" accept=".ply" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f); e.target.value = ''; }} />
        {info && !info.robot && (
          <>
            <label className="pg-check"><input type="checkbox" checked={upY} onChange={(e) => { setUpY(e.target.checked); if (last.current) load(last.current, e.target.checked); }} /> Y is up in this file</label>
            <button type="button" className="pg-btn" onClick={back}>Back to Stack-chan&rsquo;s scan</button>
          </>
        )}
        <a className="pg-link" href="/stackchan-lidar/stackchan-scan-9-dense.ply" download>Download this scan (.ply)</a>
        {err && <p className="pg-err" role="alert">{err}</p>}
      </div>
      <p className="pg-note">Your own file opens in this browser only; nothing is uploaded.</p>
    </div>
  );
}
