'use client';
import { useMemo, useState } from 'react';
import Story, { type Frame } from './Story';
import ConfigKingSim, { CK_STYLE, CkViewContext, screenAt, type CkView, type Press, type SimScene } from './ConfigKingSim';
import { IcScreen } from '../../components/Icons';

/* On the chapter's first slide: past the eight steps, straight to the last frame,
   where the simulator is the reader's to use. Lands where the stage's own dots do. */
function SkipToSim() {
  const go = () => {
    const el = document.getElementById('configking');
    if (!el) return;
    const n = el.querySelectorAll('.ws-frame').length;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((n - 1 + 0.3) / n) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return <button type="button" className="ws-btn ck-skipsim" onClick={go}><IcScreen /> Skip to the simulator</button>;
}

/* ConfigKingChapter: the setup procedure, walked on the real Cardputer (a photo,
   its screen live and magnified above it). It follows straight on from the
   DrumNet film with no cover: the first frame is that same reading, 0092.07, as
   ConfigKing shows it. Each step frame then replays the press that gets there
   from the step before (the key lights on the photo, a chip names it, the screen
   moves on); the last frame hands the reader the keys. Step text is the report's. */

type StepFrame = { scene: SimScene; eyebrow: string; title: string; body: string; pointers: Frame['pointers']; from?: SimScene; via?: Press[] };
/* Pointers are written in screen pixels (240 x 135) and placed for the view the
   reader picked: on the zoomed-in or magnified screen, or on the whole
   Cardputer with the labels spread across the band above it. Every label sits above the
   drawing, so no leader crosses the device. */
const at = (x: number, y: number): [number, number] => [x, y];
function place(view: CkView, list: Frame['pointers']): Frame['pointers'] {
  if (!list) return list;
  if (view !== 'full') return list.map((q) => ({
    ...q, at: screenAt(view, q.at[0], q.at[1]), edge: 'top' as const,
    to: q.to ? [screenAt(view, (q.to[0] / 100) * 240, 0)[0], 0] as [number, number] : undefined,
  }));
  const order = list.map((q, i) => ({ x: q.at[0], i })).sort((a, b) => a.x - b.x);
  const cols: number[] = [];
  order.forEach((o, k) => { cols[o.i] = 12 + ((k + 0.5) * 76) / list.length; });
  return list.map((q, i) => ({ ...q, at: screenAt('full', q.at[0], q.at[1]), to: [cols[i], 0] as [number, number], edge: 'top' as const }));
}
/* The Cardputer's enter key is printed "ok". */
const ok = (label: string, wait?: number): Press => ({ key: { enter: true }, cap: 'enter', name: 'ok ↵', label, wait });
const STEPS: StepFrame[] = [
  { scene: 'nearby', from: 'free', via: [], eyebrow: 'Step 1', title: 'Discovery', body: 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.',
    pointers: [{ at: at(120, 56), label: 'the reader found nearby, blank', edge: 'top' }, { at: at(58, 88), label: 'Enter connects, Esc waits', edge: 'bottom' }] },
  { scene: 'identify', from: 'nearby', via: [ok('connect', 1900)], eyebrow: 'Step 2', title: 'Identification and reading rate', body: 'Configure the name of the reader that shows up in the dashboard, then the reading rate. Expanding the (i) icon shows more details about the reader.',
    pointers: [{ at: at(120, 44), label: 'the name on the dashboard', edge: 'top', to: [30, 0] }, { at: at(100, 68), label: 'every 60 s; arrows change it', edge: 'bottom' }, { at: at(225, 20), label: 'reader details', edge: 'top', to: [80, 0] }] },
  { scene: 'layout', from: 'identify', via: [ok('save')], eyebrow: 'Step 3', title: 'Drum layout', body: 'Configure the drum layout based on the meter the reader will be installed on: whole-number drums range from 1 to 8, and fraction drums from 0 to 4.',
    pointers: [{ at: at(80, 42), label: 'whole drums, 1 to 8', edge: 'top' }, { at: at(80, 64), label: 'decimal drums, 0 to 4', edge: 'bottom', to: [20, 0] }, { at: at(84, 90), label: 'decimal drums in red', edge: 'bottom', to: [60, 0] }] },
  { scene: 'camera', from: 'layout', via: [ok('next')], eyebrow: 'Step 4', title: 'Camera configuration', body: 'Configure the brightness, gain and LED PWM duty cycle to achieve even lighting. You can zoom and pan to inspect the image closer; the picture darkens and brightens with the settings.',
    pointers: [{ at: at(75, 70), label: 'live frame from the reader', edge: 'bottom' }, { at: at(198, 38), label: 'exposure', edge: 'top', to: [62, 0] }, { at: at(198, 56), label: 'gain', edge: 'top', to: [84, 0] }, { at: at(198, 74), label: 'LED duty', edge: 'bottom', to: [84, 0] }] },
  { scene: 'roi', from: 'camera', via: [ok('next')], eyebrow: 'Step 5', title: 'ROI refinement', body: 'WindowNet auto-generates a ROI; the controls refine the selection further, with zoom and pan to view it in more detail.',
    pointers: [{ at: at(96, 15), label: 'x y w h of the box', edge: 'top', to: [40, 0] }, { at: at(120, 72), label: 'the auto guess, to be checked', edge: 'bottom' }, { at: at(224, 15), label: 'Tab: move, size or pan', edge: 'top', to: [80, 0] }] },
  { scene: 'read', from: 'roi', via: [ok('next', 1700)], eyebrow: 'Step 6', title: 'Test read', body: 'A test reading is made using the ROI set earlier. It shows the confidence level of the reading, and you can inspect digit by digit by pressing (D).',
    pointers: [{ at: at(75, 70), label: 'the frame the OCR used', edge: 'bottom' }, { at: at(165, 33), label: 'LOW: below the 0.8 gate', edge: 'top', to: [70, 0] }, { at: at(175, 63), label: 'the least sure drum', edge: 'bottom', to: [78, 0] }] },
  { scene: 'radio', from: 'read', via: [ok('next', 1700)], eyebrow: 'Step 7', title: 'LoRa connectivity test', body: 'A connectivity test to the LoRaWAN gateway makes sure the reader can reach the gateway. More info can be viewed by expanding the (i) menu.',
    pointers: [{ at: at(30, 48), label: 'signal bars', edge: 'bottom', to: [20, 0] }, { at: at(96, 40), label: 'acknowledgement time', edge: 'top' }, { at: at(225, 20), label: 'RSSI, SNR, data rate', edge: 'top', to: [82, 0] }] },
  { scene: 'review', from: 'radio', via: [ok('next')], eyebrow: 'Step 8', title: 'Review changes and save', body: 'Check the settings and configuration to be saved to the reader. After saving, the reader changes into standard deployment mode and the BLE link is lost.',
    pointers: [{ at: at(90, 54), label: 'everything about to be committed', edge: 'top' }, { at: at(120, 113), label: 'Finish', edge: 'bottom' }] },
  { scene: 'done', from: 'review', via: [ok('finish', 1500)], eyebrow: 'Setup complete', title: 'The reader sleeps and starts reading', body: 'The finish message quotes the reader’s own sleep timer. From here the reader wakes on its own interval, reads, sends and sleeps.',
    pointers: [{ at: at(70, 48), label: 'the reader’s own reply', edge: 'top' }] },
  { scene: 'connected', from: 'done', via: [ok('continue')], eyebrow: 'A configured reader', title: 'Read, Configure, More', body: 'A configured reader gets Read, Configure and More instead of the wizard. Configure opens one setup category at a time, with explicit save or discard; More holds the radio test, reader info, About and a factory reset behind a confirmation.',
    pointers: [{ at: at(50, 48), label: 'read now', edge: 'top', to: [26, 0] }, { at: at(62, 66), label: 'one category at a time', edge: 'top', to: [60, 0] }, { at: at(50, 84), label: 'radio test, info, factory reset', edge: 'bottom' }] },
];

const buildFrames = (view: CkView): Frame[] => [
  {
    // The bridge from the film: the same reading, as the setup tool shows it.
    id: 'ck-intro', eyebrow: 'Setup and configuration', title: 'The same reading, on the setup tool', cls: 'ck-first',
    body: (
      <>
        <p>That reading, 0092.07 with the frame it came from, is what ConfigKing shows when it asks a reader to Read. ConfigKing is the firmware I wrote for an M5Stack Cardputer: it finds readers nearby over BLE and ESP-NOW, sets up new ones step by step and reconfigures the rest.</p>
        <SkipToSim />
        <p className="ws-note">DrumNet and the firmware are loaded onto Prototype V2, with the LoRa device address baked in when it is flashed. The readers are mostly asleep, so pressing the boot button wakes one up to be found. The screen is a working copy of the real firmware&rsquo;s screens, drawn from its source, on a photo of the Cardputer.</p>
      </>
    ),
    pointers: place(view, [{ at: at(75, 70), label: 'the frame and the box it read', edge: 'top', to: [24, 0] }, { at: at(175, 45), label: '0092.07', edge: 'top', to: [78, 0] }]),
    visual: <ConfigKingSim scene="reread" keys={false} />,
  },
  ...STEPS.map((s): Frame => ({
    id: `ck-${s.scene}`, eyebrow: s.eyebrow, title: s.title, body: <p>{s.body}</p>, pointers: place(view, s.pointers),
    visual: <ConfigKingSim scene={s.scene} keys={false} from={s.from} via={s.via} />,
  })),
  {
    id: 'ck-free', eyebrow: 'Try it', title: 'Set up a reader yourself', wide: true, cls: 'tall',
    body: <p>The same screens, keys and wizard, talking to a simulated reader. Press the keys on the Cardputer, tap its screen, or type on your own keyboard. A reader will turn up nearby in a moment.</p>,
    visual: <ConfigKingSim scene="free" keys large />,
  },
];

/* No cover: the chapter carries straight on from the DrumNet film. */
export default function ConfigKingChapter({ chapter }: { chapter: string }) {
  // Zoomed in by default; the choice carries across every frame of the chapter.
  const [view, setView] = useState<CkView>('close');
  const frames = useMemo(() => buildFrames(view), [view]);
  const ctx = useMemo(() => ({ view, setView }), [view]);
  return (
    <CkViewContext.Provider value={ctx}>
      <Story id="configking" chapter={chapter} title="ConfigKing" frames={frames} per={0.85} />
      <style>{CK_STYLE}</style>
    </CkViewContext.Provider>
  );
}
