'use client';
import { useState } from 'react';

/* FocusLab: the camera focus test from the report (Figures 3.7 and 3.8). Two OV2640
   lenses, three distances, two charts; the full frame plus centre, left and right
   crops of the same 1600 x 1200 capture. Every image is a real capture from the test. */

const LENSES = [{ key: '160', label: '160° lens' }, { key: '120', label: '120° lens' }] as const;
const DISTS = ['3', '4', '6'] as const;
const CHARTS = [{ key: 'a', label: 'Chart A (hand-drawn)' }, { key: 'b', label: 'Chart B (ISO 12233)' }] as const;

const NOTE: Record<string, string> = {
  '160': 'The 160° variant focuses well on close objects. On this lens the focus seems to taper off towards the left of the image from the centre, while the effect is nowhere near as strong in the opposite direction.',
  '120': 'It is very clear that the 120° variant is unable to focus well on close objects (macro). Its focus tapering is conical and even, as expected from a fixed-focus lens.',
};

export default function FocusLab() {
  const [lens, setLens] = useState<'160' | '120'>('160');
  const [dist, setDist] = useState<'3' | '4' | '6'>('4');
  const [chart, setChart] = useState<'a' | 'b'>('b');
  const src = `/images/waterslop/focus-${lens}-${dist}${chart}.webp`;
  const noRight = lens === '120' && dist === '3' && chart === 'b';
  const chosen = lens === '160' && dist === '4';

  const Seg = <T extends string>({ items, value, set, label }: { items: ReadonlyArray<{ key: T; label: string }>; value: T; set: (v: T) => void; label: string }) => (
    <div className="ws-seg" role="group" aria-label={label}>
      {items.map((it) => <button key={it.key} type="button" className={`ws-tab${it.key === value ? ' on' : ''}`} onClick={() => set(it.key)}>{it.label}</button>)}
    </div>
  );

  return (
    <div className="ws-panel fl" data-no-zoom>
      <div className="fl-controls">
        <Seg label="Lens" items={LENSES} value={lens} set={setLens} />
        <Seg label="Distance" items={DISTS.map((d) => ({ key: d, label: `${d} cm` }))} value={dist} set={setDist} />
        <Seg label="Chart" items={CHARTS} value={chart} set={setChart} />
      </div>
      <div className="fl-grid">
        <figure className="fl-full">
          <img src={src} alt={`${lens}° lens, chart ${chart.toUpperCase()} at ${dist} cm, full frame`} loading="lazy" decoding="async" />
          <figcaption>full frame · {lens}° lens · {dist} cm{chosen ? ' · the chosen setup' : ''}</figcaption>
        </figure>
        {(['centre', 'left', 'right'] as const).map((part) => (
          <figure key={part} className={`fl-crop fl-${part}`}>
            {part === 'right' && noRight ? (
              <div className="fl-none">Not in frame</div>
            ) : (
              <div className="fl-zoom" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={`${part} crop`} />
            )}
            <figcaption>{part}</figcaption>
          </figure>
        ))}
      </div>
      <p className="ws-wcap fl-note">{NOTE[lens]}</p>
      <style>{`
        .fl { padding: 14px 16px 18px; }
        .fl-controls { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-bottom: 14px; }
        .fl-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 8px; }
        .fl-full { grid-row: 1 / span 3; margin: 0; display: flex; flex-direction: column; min-height: 0; }
        .fl-full img { width: 100%; flex: 1 1 auto; min-height: 0; height: auto; object-fit: cover; border-radius: 4px; display: block; border: 1px solid #d8cbb833; }
        .fl-crop { margin: 0; min-width: 0; }
        .fl-zoom { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px solid #d8cbb833; background-size: 300% 300%; background-repeat: no-repeat; background-position: 50% 50%; }
        .fl-left .fl-zoom { background-position: 0% 50%; }
        .fl-right .fl-zoom { background-position: 100% 50%; }
        .fl-none { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px dashed #d8cbb875; display: flex; align-items: center; justify-content: center; font: 500 12px Manrope, Arial, sans-serif; color: #ada496; }
        .fl figcaption { font: 400 12.5px/1.4 Manrope, Arial, sans-serif; color: #ada496; margin-top: 6px; }
        .fl-note { margin-top: 14px; }
        @media (max-width: 560px) { .fl { padding: 12px; } .fl-grid { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; } .fl-full { grid-column: 1 / -1; grid-row: 1; } .fl-controls { gap: 6px; } }
      `}</style>
    </div>
  );
}
