'use client';
import { useState } from 'react';
import { fill } from '@/lib/fill';
import { Cover, Page, type Frame } from './Story';
import { words } from './words';
import type { WaterslopCopy } from './_copy';

/* CameraChapter: the camera focus test (report Figures 3.7 and 3.8) on one page:
   the setup, then the lab, where the reader picks a lens, a distance and a chart
   and sees the full 1600 x 1200 capture with centre, left and right crops cut
   from the same frame. Every image is a real capture from the test. Its words
   are `camera` in the page's copy. */

type CameraCopy = WaterslopCopy['camera'];

const I = '/images/waterslop/';
const LENSES = ['160', '120'] as const;
const DISTS = ['3', '4', '6'] as const;
const CHARTS = ['b', 'a'] as const;

function Seg<T extends string>({ items, value, set, label }: { items: ReadonlyArray<{ key: T; label: string }>; value: T; set: (v: T) => void; label: string }) {
  return (
    <div className="ws-seg" role="group" aria-label={label}>
      {items.map((it) => <button key={it.key} type="button" className={`ws-tab${it.key === value ? ' on' : ''}`} aria-pressed={it.key === value} onClick={() => set(it.key)}>{it.label}</button>)}
    </div>
  );
}

export function FocusLab({ t }: { t: CameraCopy['lab'] }) {
  const [lens, setLens] = useState<'160' | '120'>('160');
  const [dist, setDist] = useState<'3' | '4' | '6'>('4');
  const [chart, setChart] = useState<'a' | 'b'>('b');
  const src = `${I}focus-${lens}-${dist}${chart}.webp`;
  const noRight = lens === '120' && dist === '3' && chart === 'b';
  const chosen = lens === '160' && dist === '4';
  return (
    <div className="fl" data-no-zoom>
      <div className="fl-controls">
        <Seg label={t.lens} items={LENSES.map((key) => ({ key, label: t.lenses[key] }))} value={lens} set={setLens} />
        <Seg label={t.distance} items={DISTS.map((d) => ({ key: d, label: fill(t.cm, { d }) }))} value={dist} set={setDist} />
        <Seg label={t.chart} items={CHARTS.map((key) => ({ key, label: t.charts[key] }))} value={chart} set={setChart} />
      </div>
      <div className="fl-grid">
        <figure className="fl-full">
          <img src={src} alt={fill(t.alt, { lens, chart: chart.toUpperCase(), dist })} loading="lazy" decoding="async" />
          <figcaption>{fill(t.caption, { lens, dist })}{chosen ? t.chosen : ''}</figcaption>
        </figure>
        {(['centre', 'left', 'right'] as const).map((part) => (
          <figure key={part} className={`fl-crop fl-${part}`}>
            {part === 'right' && noRight ? <div className="fl-none">{t.notInFrame}</div> : <div className="fl-zoom" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={fill(t.cropAria, { part: t.parts[part] })} />}
            <figcaption>{t.parts[part]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="fl-note">{t.notes[lens]}</p>
      <style>{`
        .fl { display: flex; flex-direction: column; gap: 12px; width: min(var(--vw, 48vw), calc((100svh - var(--ws-nav, 0px) - 22svh) * 1.5)); }
        .fl-controls { display: flex; flex-wrap: wrap; gap: 8px 12px; }
        .fl-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: repeat(3, auto); gap: 8px; }
        .fl-full { grid-row: 1 / span 3; margin: 0; display: flex; flex-direction: column; min-height: 0; }
        .fl-full img { width: 100%; height: auto; border-radius: 4px; display: block; border: 1px solid #d8cbb833; }
        .fl-crop { margin: 0; min-width: 0; }
        .fl-zoom { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px solid #d8cbb833; background-size: 300% 300%; background-repeat: no-repeat; background-position: 50% 50%; }
        .fl-left .fl-zoom { background-position: 0% 50%; }
        .fl-right .fl-zoom { background-position: 100% 50%; }
        .fl-none { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px dashed #d8cbb875; display: flex; align-items: center; justify-content: center; font: 500 12px Manrope, Arial, sans-serif; color: #ada496; }
        .fl-grid figcaption { font: 400 11.5px/1.3 Manrope, Arial, sans-serif; color: #ada496; margin-top: 4px; }
        .fl-note { font: 400 13px/1.5 Manrope, Arial, sans-serif; color: #ada496; margin: 0; }
        @media (max-width: 900px) { .fl { width: 92vw; gap: 8px; } .fl-grid { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; gap: 5px; } .fl-full { grid-column: 1 / -1; grid-row: 1; } .fl-controls { gap: 6px; } .fl-note { font-size: 12px; } }
      `}</style>
    </div>
  );
}

const rows = (t: CameraCopy): Frame[] => [
  {
    id: 'cam-why', ...words(t.rows['cam-why']),
    visual: <img src={I + 'focus-setup.webp'} alt={t.rows['cam-why'].alt} loading="lazy" decoding="async" />,
  },
  {
    id: 'cam-lab', ...words(t.rows['cam-lab']),
    visual: <FocusLab t={t.lab} />,
  },
];

export default function CameraChapter({ chapter, t }: { chapter: string; t: CameraCopy }) {
  const c = t.cover;
  return (
    <>
      <Cover id="camera" chapter={chapter} title={c.title} lines={c.lines} contents={c.contents.map((label, i) => ({ label, href: ['#cam-why', '#cam-lab'][i] }))}
        bg="focus-160-4b.webp" lede={c.lede} />
      <Page id="camera-body" title={t.page} rows={rows(t)} />
    </>
  );
}
