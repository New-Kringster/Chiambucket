'use client';
import Story, { type Frame } from './Story';

/* CalibrationStory: Table 3.4 of the report, one camera setting per frame: the
   three example captures with their measured digit mean and contrast. Text is the
   report's own. */

type Example = { label: string; img?: number; mean?: string; contrast?: string; text?: string };
type Factor = { key: string; name: string; tested: string; cond: string; effect: string; ex: Example[] };

const FACTORS: Factor[] = [
  { key: 'exposure', name: 'Exposure', tested: 'Tested: 84, 168, 336, 448, 672, 1000', cond: 'No PWM', effect: '84 was too dark. 336 brightened the digits. Higher exposure gave variable brightness rather than a consistent improvement.',
    ex: [{ label: '84', img: 157, mean: '33.2', contrast: '43' }, { label: '336', img: 158, mean: '93.1', contrast: '134' }, { label: '1000', img: 159, mean: '131.4', contrast: '160' }] },
  { key: 'gain', name: 'Gain', tested: 'Tested: indices 0, 1, 2, 3, 4, 5, 6, 8', cond: 'No PWM', effect: 'Increasing gain brightened the image, but clipped highlights at high settings. At low PWM duty, higher gain also reduced visible detail.',
    ex: [{ label: 'Index 0', img: 158, mean: '93.1', contrast: '134' }, { label: 'Index 2', img: 160, mean: '167.0', contrast: '160' }, { label: 'Index 4', img: 161, mean: '212.8', contrast: '117' }] },
  { key: 'duty', name: 'PWM duty', tested: 'Tested: 10, 15, 20, 25, 35, 50, 75 %', cond: '20 kHz PWM', effect: 'Lower duty reduced illumination and estimated cumulative LED on-time. Exposure or gain compensation was needed to regain brightness.',
    ex: [{ label: '25 %', img: 162, mean: '33.6', contrast: '40' }, { label: '50 %', img: 163, mean: '58.0', contrast: '87' }, { label: '75 %', img: 164, mean: '76.7', contrast: '115' }] },
  { key: 'pulse', name: 'Pulse duration', tested: 'Tested: 20, 40, 60, 80, 100, 150 ms', cond: 'No PWM', effect: 'Short pulses caused partial lighting or dark images. The same 60 ms setting gave digit means from 5.7 to 94.3, so a single good shot was misleading.',
    ex: [{ label: '20 ms', img: 165, mean: '6.0', contrast: '2' }, { label: '60 ms', img: 166, mean: '5.7', contrast: '2' }, { label: '150 ms maximum', img: 167, mean: '96.9', contrast: '136' }] },
  { key: 'freq', name: 'PWM frequency', tested: 'Tested: 10, 20, 40 kHz', cond: 'PWM', effect: 'All three produced readable digits. These small samples did not establish a clear detail advantage; 20 kHz was retained.',
    ex: [{ label: '10 kHz', img: 168, mean: '99.0', contrast: '101' }, { label: '20 kHz', img: 169, mean: '92.2', contrast: '101' }, { label: '40 kHz', img: 170, mean: '97.1', contrast: '100' }] },
  { key: 'contrast', name: 'Contrast', tested: 'Retested: 0, +1, +2', cond: 'Exposure 336; gain 4; 25 % PWM at 20 kHz; brightness 0; gamma on', effect: 'Median digit contrast rose from 104 to 117 to 129. Median brightness stayed about 106 to 108. Higher contrast improved tone separation while preserving grayscale.',
    ex: [{ label: '0', img: 171, mean: '107.9', contrast: '100' }, { label: '+1', img: 172, mean: '105.5', contrast: '115' }, { label: '+2', img: 173, mean: '106.5', contrast: '126' }] },
  { key: 'gamma', name: 'Raw gamma', tested: 'Retested: on / off', cond: 'Exposure 336; gain 3; 25 % PWM at 20 kHz; brightness and contrast 0', effect: 'Turning gamma off reduced median digit brightness from 93 to 36 and contrast from 105 to 46. Gamma on retained more visible shadow detail.',
    ex: [{ label: 'On', img: 174, mean: '93.6', contrast: '105' }, { label: 'Off', img: 175, mean: '35.8', contrast: '45' }, { label: 'Retest method', text: 'Three passes in different orders; 12 settled captures per level. Only the named setting changed within each comparison. All 165 retest images had identical red, green and blue channels.' }] },
  { key: 'brightness', name: 'Brightness', tested: 'Retested: −1, 0, +1', cond: 'Exposure 336; gain 2; 35 % PWM at 20 kHz; contrast 0; gamma on', effect: 'Median brightness was 144, 96 and 176 respectively. Both nonzero levels brightened this grayscale pipeline; −1 did not darken it. These control values are not a linear exposure scale.',
    ex: [{ label: '−1', img: 176, mean: '144.0', contrast: '122' }, { label: '0', img: 177, mean: '96.6', contrast: '122' }, { label: '+1', img: 178, mean: '176.8', contrast: '123' }] },
  { key: 'delay', name: 'LED start delay', tested: 'Retested: 0, 10, 20 ms', cond: 'Exposure 336; gain 2; 50 % PWM at 20 kHz. Timed mode; 1000 ms duration limit for every level, never reached', effect: 'Median brightness stayed near 120. At 20 ms delay, estimated LED on-time fell from 62 to 47 ms, but the darkest repeat fell to 81 (0 ms minimum: 114). Zero delay was more consistent.',
    ex: [{ label: '0 ms: typical', img: 179, mean: '118.8', contrast: '135' }, { label: '10 ms: typical', img: 180, mean: '119.7', contrast: '137' }, { label: '20 ms: darkest repeat', img: 181, mean: '80.8', contrast: '108' }] },
];

function Examples({ f }: { f: Factor }) {
  return (
    <div className="cl-ex" data-no-zoom>
      {f.ex.map((e) => (
        <figure key={e.label} className="cl-card">
          {e.img ? <img src={`/images/waterslop/calib-${e.img}.webp`} alt={`${f.name} ${e.label}`} loading="lazy" decoding="async" /> : <div className="cl-method">{e.text}</div>}
          <figcaption><b>{e.label}</b>{e.mean && <span>digit mean {e.mean}/255 · contrast {e.contrast}</span>}</figcaption>
        </figure>
      ))}
      <style>{`
        .cl-ex { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: min(calc(54vw - 24px), calc((100svh - var(--ws-nav, 0px) - 20svh) * 2.4)); }
        .cl-card { margin: 0; }
        .cl-card img, .cl-method { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; border-radius: 4px; border: 1px solid #d8cbb833; background: #0f0e0d; }
        .cl-method { padding: 10px 12px; font: 400 12px/1.45 Manrope, Arial, sans-serif; color: #ada496; overflow: auto; }
        .cl-card figcaption { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; font: 400 12px/1.4 Manrope, Arial, sans-serif; color: #ada496; }
        .cl-card figcaption b { font: 400 15px/1.3 'Libre Baskerville', Baskerville, serif; color: #d8cbb8; }
        @media (max-width: 900px) { .cl-ex { width: 92vw; gap: 6px; } .cl-card figcaption { font-size: 10.5px; } .cl-card figcaption b { font-size: 12.5px; } .cl-method { font-size: 10px; padding: 6px 8px; } }
      `}</style>
    </div>
  );
}

const FRAMES: Frame[] = [
  {
    id: 'cal-intro', eyebrow: 'Camera calibration', title: 'Which setting does what',
    body: (
      <>
        <p>With the help of an AI agent, I ran a test to find how each camera setting affects the image, aiming for a clean, acceptable image while minimising LED on-time and capture time. SVGA (800 × 600) sub-sampling was already the preferred resolution. The test covered exposure, gain, PWM duty cycle and frequency, pulse duration, contrast, raw gamma and LED start delay.</p>
        <p className="ws-note">Digit mean is the average brightness in the digit region; contrast is its 90th to 10th percentile intensity range. Results apply to this fixed scene; OCR accuracy was not tested.</p>
      </>
    ),
    visual: <img src="/images/waterslop/calib-173.webp" alt="A calibration capture of the meter with contrast +2" loading="lazy" decoding="async" />,
    pointers: [{ at: [57, 40], label: 'the digit region that is measured', to: [74, 18] }],
  },
  ...FACTORS.map((f): Frame => ({
    id: `cal-${f.key}`,
    eyebrow: f.tested,
    title: f.name,
    body: <p><b>{f.cond}.</b> {f.effect}</p>,
    visual: <Examples f={f} />,
  })),
];

export default function CalibrationStory({ chapter }: { chapter: string }) {
  return <Story id="calibration" chapter={chapter} title="Camera calibration" frames={FRAMES} per={0.8} />;
}
