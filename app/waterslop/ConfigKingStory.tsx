'use client';
import { useMemo, useState } from 'react';
import Story, { type Frame } from './Story';
import ConfigKingSim, { CK_STYLE, CkViewContext, type CkView, type Press, type SimScene } from './ConfigKingSim';
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

type StepFrame = { scene: SimScene; eyebrow: string; title: string; body: string; from?: SimScene; via?: Press[] };
/* The Cardputer's enter key is printed "ok". */
const ok = (label: string, wait?: number): Press => ({ key: { enter: true }, cap: 'enter', name: 'ok ↵', label, wait });
const STEPS: StepFrame[] = [
  { scene: 'nearby', from: 'free', via: [], eyebrow: 'Step 1', title: 'Discovery', body: 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.' },
  { scene: 'identify', from: 'nearby', via: [ok('connect', 1900)], eyebrow: 'Step 2', title: 'Identification and reading rate', body: 'Set the name the reader shows on the dashboard, then its reading rate, and expand the (i) icon for more details about the reader.' },
  { scene: 'layout', from: 'identify', via: [ok('save')], eyebrow: 'Step 3', title: 'Drum layout', body: 'Set the drum layout to match the meter the reader will be installed on, with 1 to 8 whole-number drums and 0 to 4 fraction drums.' },
  { scene: 'camera', from: 'layout', via: [ok('next')], eyebrow: 'Step 4', title: 'Camera configuration', body: 'Set the brightness, gain and LED PWM duty cycle for even lighting. You can zoom and pan to look at the image more closely, and the picture darkens and brightens as the settings change.' },
  { scene: 'roi', from: 'camera', via: [ok('next')], eyebrow: 'Step 5', title: 'ROI refinement', body: 'WindowNet generates a ROI automatically, and the controls let you refine it, with zoom and pan to see it in more detail.' },
  { scene: 'read', from: 'roi', via: [ok('next', 1700)], eyebrow: 'Step 6', title: 'Test read', body: 'A test reading is made with the ROI set earlier and shows its confidence, which you can inspect digit by digit by pressing (D).' },
  { scene: 'radio', from: 'read', via: [ok('next', 1700)], eyebrow: 'Step 7', title: 'LoRa connectivity test', body: 'A connectivity test makes sure the reader can reach the LoRaWAN gateway, and expanding the (i) menu shows more information.' },
  { scene: 'review', from: 'radio', via: [ok('next')], eyebrow: 'Step 8', title: 'Review changes and save', body: 'Check the settings that will be saved to the reader. Once they are saved, the reader switches to standard deployment mode and the BLE link drops.' },
  { scene: 'done', from: 'review', via: [ok('finish', 1500)], eyebrow: 'Setup complete', title: 'The reader sleeps and starts reading', body: 'The finish message shows the reader’s own sleep timer, and from here the reader wakes on its own interval, takes a reading, sends it and goes back to sleep.' },
  { scene: 'connected', from: 'done', via: [ok('continue')], eyebrow: 'A configured reader', title: 'Read, Configure, More', body: 'A configured reader gets Read, Configure and More instead of the wizard. Configure opens one setup category at a time with an explicit save or discard, and More holds the radio test, reader info, About and a factory reset that asks for confirmation.' },
];

const buildFrames = (view: CkView): Frame[] => [
  {
    // The bridge from the film: the same reading, as the setup tool shows it.
    id: 'ck-intro', eyebrow: 'Setup and configuration', title: 'The same reading, on the setup tool', cls: `ck-first ckf${view === 'close' ? ' ck-bleed' : ''}`,
    body: (
      <>
        <p>That reading, 0092.07, and the frame it came from are what ConfigKing shows when it asks a reader to Read. ConfigKing is the firmware I wrote for an M5Stack Cardputer, and it finds readers nearby over BLE and ESP-NOW, sets up new ones step by step and reconfigures the rest.</p>
        <SkipToSim />
        <p className="ws-note">DrumNet and the firmware are flashed onto Prototype V2 with the LoRa device address set at the same time, and because the readers are mostly asleep, you press the boot button to wake one up so it can be found. The screen here is a working copy of the real firmware&rsquo;s screens, drawn from its source code on a photo of the Cardputer.</p>
      </>
    ),
    visual: <ConfigKingSim scene="reread" keys={false} />,
  },
  ...STEPS.map((s): Frame => ({
    id: `ck-${s.scene}`, eyebrow: s.eyebrow, title: s.title, body: <p>{s.body}</p>, cls: `ckf${view === 'close' ? ' ck-bleed' : ''}`,
    visual: <ConfigKingSim scene={s.scene} keys={false} from={s.from} via={s.via} />,
  })),
  {
    id: 'ck-free', eyebrow: 'Try it', title: 'Set up a reader yourself', wide: true, cls: `tall ckf${view === 'close' ? ' ck-bleed' : ''}`,
    body: <p>This has the same screens, keys and wizard as the real thing, talking to a simulated reader. You can press the keys on the Cardputer, tap its screen or type on your own keyboard, and a reader will turn up nearby in a moment.</p>,
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
