'use client';
import Story, { type Frame } from './Story';

/* CameraStory: the camera chapter. The focus test (report Figures 3.7 and 3.8)
   is walked lens by lens and distance by distance: the full 1600 x 1200 capture of
   Chart B plus centre, left and right crops cut from the same frame. Every image is
   a real capture from the test. */

const I = '/images/waterslop/';
const NOTE: Record<string, string> = {
  '160': 'The 160° variant focuses well on close objects. On this lens the focus seems to taper off towards the left of the image from the centre, while the effect is nowhere near as strong in the opposite direction.',
  '120': 'It is very clear that the 120° variant is unable to focus well on close objects (macro). Its focus tapering is conical and even, as expected from a fixed-focus lens.',
};

function Shot({ lens, dist }: { lens: '160' | '120'; dist: '3' | '4' | '6' }) {
  const src = `${I}focus-${lens}-${dist}b.webp`;
  const noRight = lens === '120' && dist === '3';
  return (
    <div className="fl-grid" data-no-zoom>
      <figure className="fl-full"><img src={src} alt={`${lens}° lens, chart B at ${dist} cm, full frame`} loading="lazy" decoding="async" /><figcaption>full frame</figcaption></figure>
      {(['centre', 'left', 'right'] as const).map((part) => (
        <figure key={part} className={`fl-crop fl-${part}`}>
          {part === 'right' && noRight ? <div className="fl-none">Not in frame</div> : <div className="fl-zoom" style={{ backgroundImage: `url(${src})` }} role="img" aria-label={`${part} crop`} />}
          <figcaption>{part}</figcaption>
        </figure>
      ))}
      <style>{`
        .fl-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: repeat(3, auto); gap: 8px; width: min(calc(54vw - 24px), calc((100svh - var(--ws-nav, 0px) - 16svh) * 1.55)); }
        .fl-full { grid-row: 1 / span 3; margin: 0; display: flex; flex-direction: column; min-height: 0; }
        .fl-full img { width: 100%; height: auto; border-radius: 4px; display: block; border: 1px solid #d8cbb833; }
        .fl-crop { margin: 0; min-width: 0; }
        .fl-zoom { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px solid #d8cbb833; background-size: 300% 300%; background-repeat: no-repeat; background-position: 50% 50%; }
        .fl-left .fl-zoom { background-position: 0% 50%; }
        .fl-right .fl-zoom { background-position: 100% 50%; }
        .fl-none { width: 100%; aspect-ratio: 4 / 3; border-radius: 4px; border: 1px dashed #d8cbb875; display: flex; align-items: center; justify-content: center; font: 500 12px Manrope, Arial, sans-serif; color: #ada496; }
        .fl-grid figcaption { font: 400 11.5px/1.3 Manrope, Arial, sans-serif; color: #ada496; margin-top: 4px; }
        @media (max-width: 900px) { .fl-grid { width: 92vw; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; gap: 5px; } .fl-full { grid-column: 1 / -1; grid-row: 1; } .fl-full img { max-height: calc(45svh - var(--ws-nav, 0px) - 110px); object-fit: contain; width: auto; margin: 0 auto; } .fl-grid figcaption { display: none; } }
      `}</style>
    </div>
  );
}

const shots: Array<['160' | '120', '3' | '4' | '6']> = [['160', '3'], ['160', '4'], ['160', '6'], ['120', '3'], ['120', '4'], ['120', '6']];
const FRAMES: Frame[] = [
  {
    id: 'cam-why', eyebrow: 'Camera choice', title: 'A macro camera, wide enough for the drums',
    body: <p>I needed a capable macro camera, wide enough to capture the full width of the meter barrels while in close proximity to the meter. There were no options that were both low cost and of the correct connector type from reputable retailers, so I bought two OV2640 cameras from Lazada, one with a 160° field-of-view lens and one with 120°. They were not advertised as macro, but an intrinsic property of wide-angle lenses is their ultra-short focusing distance and much deeper apparent depth of field.</p>,
    visual: <img src={I + 'focus-setup.webp'} alt="The focus test box with the ESP32 cam board on the side and a ruler on the floor" loading="lazy" decoding="async" />,
    pointers: [{ at: [37, 40], label: 'spare ESP32-S3 cam board', to: [18, 22] }, { at: [58, 36], label: 'chart on a movable stand', to: [76, 20] }, { at: [66, 70], label: 'ruler from the lens', to: [80, 84] }],
  },
  {
    id: 'cam-charts', eyebrow: 'The test', title: 'Two charts, three distances, two lenses',
    body: <p>The test was simple: take an image with both cameras at 3 cm, 4 cm and 6 cm, against two focusing charts. Chart A was hand-drawn by me; Chart B is Stephen H. Westin&rsquo;s ISO 12233 chart from Cornell. Using a spare ESP32-S3 cam board and a simple web applet written with an AI agent, the camera was mounted to the side of a box with a ruler starting from the lens, and the charts sat on a movable stand.</p>,
    visual: <div className="ws-pair plate"><img src={I + 'chart-a.webp'} alt="Chart A, a hand-drawn focus chart" loading="lazy" decoding="async" /><img src={I + 'chart-b.webp'} alt="Chart B, the ISO 12233 resolution test chart" loading="lazy" decoding="async" /></div>,
  },
  ...shots.map(([lens, dist]): Frame => ({
    id: `cam-${lens}-${dist}`,
    eyebrow: `${lens}° lens · ${dist} cm · chart B`,
    title: lens === '160' && dist === '4' ? 'The chosen setup: 160° at 4 cm' : `${lens}° lens at ${dist} cm`,
    body: <p>{NOTE[lens]}{lens === '160' && dist === '4' ? ' These are fixed-focus lenses, so focus is permanently set at the factory. Moving forward I use the 160° variant at 4 cm.' : ''}</p>,
    visual: <Shot lens={lens} dist={dist} />,
  })),
  {
    id: 'cam-taper', eyebrow: 'One more finding', title: 'Focus tapers to the left',
    body: <p>On the 160° variant, focus seems to taper off towards the left of the image from the centre, while the effect is nowhere near as strong in the opposite direction. The paper was positioned perpendicular to the camera with no major slants or dents. The effect was not present in the 120° variant, which had a conical and even tapering, as expected. This points towards a manufacturing defect, but I have no extra cameras to test if that is true.</p>,
    visual: <img src={I + 'focus-taper.webp'} alt="Chart A tinted red on the left where focus is bad and green on the right where focus is good" loading="lazy" decoding="async" style={{ imageRendering: 'auto', width: 'min(100%, 560px)' }} />,
    pointers: [{ at: [22, 50], label: 'bad focus', to: [12, 14] }, { at: [78, 50], label: 'good focus', to: [86, 14] }],
  },
];

export default function CameraStory({ chapter }: { chapter: string }) {
  return <Story id="camera" chapter={chapter} title="Camera choice" frames={FRAMES} per={0.8} />;
}
