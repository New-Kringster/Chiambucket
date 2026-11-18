'use client';
import { useState } from 'react';
import { Cover, Page, type Frame } from './Story';

/* CameraChapter: the camera focus test (report Figures 3.7 and 3.8) on one page:
   the setup, then the lab, where the reader picks a lens, a distance and a chart
   and sees the full 1600 x 1200 capture with centre, left and right crops cut
   from the same frame. Every image is a real capture from the test. */

const I = '/images/waterslop/';
const LENSES = [{ key: '160', label: '160° lens' }, { key: '120', label: '120° lens' }] as const;
const DISTS = ['3', '4', '6'] as const;
const CHARTS = [{ key: 'b', label: 'Chart B (ISO 12233)' }, { key: 'a', label: 'Chart A (hand-drawn)' }] as const;
const NOTE: Record<string, string> = {
  '160': 'The 160° variant focuses well on close objects, but its focus seems to taper off from the centre towards the left of the image, and the effect is nowhere near as strong towards the right.',
  '120': 'The 120° variant clearly cannot focus well on close objects (macro), and its focus tapers off evenly in a cone, as expected from a fixed-focus lens.',
};

function Seg<T extends string>({ items, value, set, label }: { items: ReadonlyArray<{ key: T; label: string }>; value: T; set: (v: T) => void; label: string }) {
  return (
    <div className="ws-seg" role="group" aria-label={label}>
      {items.map((it) => <button key={it.key} type="button" className={`ws-tab${it.key === value ? ' on' : ''}`} aria-pressed={it.key === value} onClick={() => set(it.key)}>{it.label}</button>)}
    </div>
  );
}

export function FocusLab() {
  const [lens, setLens] = useState<'160' | '120'>('160');
  const [dist, setDist] = useState<'3' | '4' | '6'>('4');
  const [chart, setChart] = useState<'a' | 'b'>('b');
  const src = `${I}focus-${lens}-${dist}${chart}.webp`;
  const noRight = lens === '120' && dist === '3' && chart === 'b';
  const chosen = lens === '160' && dist === '4';
  return (
    <div className="fl" data-no-zoom>
      <div className="fl-controls">
        <Seg label="Lens" items={LENSES} value={lens} set={setLens} />
        <Seg label="Distance" items={DISTS.map((d) => ({ key: d, label: `${d} cm` }))} value={dist} set={setDist} />
        <Seg label="Chart" items={CHARTS} value={chart} set={setChart} />
      </div>
      <div className="fl-grid">
        <figure className="fl-full">
          <img src={src} alt={`${lens}° lens, chart ${chart.toUpperCase()} at ${dist} cm, full frame`} loading="lazy" decoding="async" />
          <figcaption>full frame · {lens}° · {dist} cm{chosen ? ' · the chosen setup' : ''}</figcaption>
        </figure>
        {(['centre', 'left', 'right'] as const).map((part) => (
          <figure key={part} className={`fl-crop fl-${part}`}>
            {part === 'right' && noRight ? <div className="fl-none">Not in frame</div> : <div className="fl-zoom" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={`${part} crop`} />}
            <figcaption>{part}</figcaption>
          </figure>
        ))}
      </div>
      <p className="fl-note">{NOTE[lens]}</p>
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

const ROWS: Frame[] = [
  {
    id: 'cam-why', eyebrow: 'Camera choice', title: 'A macro camera, wide enough for the drums',
    body: (
      <>
        <p>I needed a capable macro camera that was wide enough to capture the full width of the meter barrels from very close to the meter. No reputable retailer had an option that was both low-cost and had the right connector, so I bought two OV2640 cameras from Lazada, one with a 160° field-of-view lens and one with a 120° lens. They were not sold as macro cameras, but wide-angle lenses naturally have a very short focusing distance and a much deeper apparent depth of field.</p>
        <p>For the test I took an image with both cameras at 3 cm, 4 cm and 6 cm against two focusing charts. Chart A is one I drew by hand, and Chart B is Stephen H. Westin&rsquo;s ISO 12233 chart from Cornell. Each camera ran on a spare ESP32-S3 cam board with a simple web applet written with an AI agent, and it was mounted on the side of a box with a ruler running out from the lens, while the charts sat on a movable stand.</p>
      </>
    ),
    visual: <img src={I + 'focus-setup.webp'} alt="The focus test box with the ESP32 cam board on the side and a ruler on the floor" loading="lazy" decoding="async" />,
  },
  {
    id: 'cam-lab', eyebrow: 'The focus test', title: 'The chosen setup, 160° at 4 cm',
    body: (
      <>
        <p>Pick a lens, a distance and a chart to see the full capture, with its centre, left and right cut from the same frame at actual pixels. These are fixed-focus lenses, so the focus is set permanently at the factory, and from here on I use the 160° variant at 4 cm.</p>
        <p className="ws-note">The chart was square to the camera with no major slants or dents, and the 120° variant tapers evenly, so the lopsided focus of the 160° variant points towards a manufacturing defect, although I have no spare cameras to test whether that is true.</p>
      </>
    ),
    visual: <FocusLab />,
  },
];

export default function CameraChapter({ chapter }: { chapter: string }) {
  return (
    <>
      <Cover id="camera" chapter={chapter} title="Camera choice" lines={['Camera', 'choice']} contents={[{ label: 'Two OV2640 lenses', href: '#cam-why' }, { label: 'The focus test', href: '#cam-lab' }]}
        bg="focus-160-4b.webp" lede="I tested two OV2640 lenses against focusing charts at 3, 4 and 6 cm." />
      <Page id="camera-body" title="Camera choice" rows={ROWS} />
    </>
  );
}
