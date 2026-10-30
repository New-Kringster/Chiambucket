'use client';
import Story, { Cover, type Frame } from './Story';
import ConfigKingSim, { CardputerCover, CK_STYLE, type SimScene } from './ConfigKingSim';

/* ConfigKingChapter: the setup procedure, walked on the simulated Cardputer.
   Each frame puts the simulator at that step of the wizard; the last frame hands
   the reader the keys. Step text is the report's. */

type StepFrame = { scene: SimScene; eyebrow: string; title: string; body: string; pointers: Frame['pointers'] };
/* Pointers are in % of the whole device drawing; the screen spans 15 to 85 % across and 6 to 68 % down. */
const sx = (x: number) => 14.8 + (x / 240) * 70.4;
const sy = (y: number) => 5.9 + (y / 135) * 62.3;
const at = (x: number, y: number): [number, number] => [sx(x), sy(y)];
const STEPS: StepFrame[] = [
  { scene: 'nearby', eyebrow: 'Step 1', title: 'Discovery', body: 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.',
    pointers: [{ at: at(120, 56), label: 'the reader found nearby, blank', edge: 'top' }, { at: at(58, 88), label: 'Enter connects, Esc waits', edge: 'bottom' }] },
  { scene: 'identify', eyebrow: 'Step 2', title: 'Identification and reading rate', body: 'Configure the name of the reader that shows up in the dashboard, then the reading rate. Expanding the (i) icon shows more details about the reader.',
    pointers: [{ at: at(120, 44), label: 'the name on the dashboard', edge: 'top', to: [30, 0] }, { at: at(100, 68), label: 'every 60 s; arrows change it', edge: 'bottom' }, { at: at(225, 20), label: 'reader details', edge: 'top', to: [80, 0] }] },
  { scene: 'layout', eyebrow: 'Step 3', title: 'Drum layout', body: 'Configure the drum layout based on the meter the reader will be installed on: whole-number drums range from 1 to 8, and fraction drums from 0 to 4.',
    pointers: [{ at: at(80, 42), label: 'whole drums, 1 to 8', edge: 'top' }, { at: at(80, 64), label: 'decimal drums, 0 to 4', edge: 'bottom', to: [20, 0] }, { at: at(84, 90), label: 'decimal drums in red', edge: 'bottom', to: [60, 0] }] },
  { scene: 'camera', eyebrow: 'Step 4', title: 'Camera configuration', body: 'Configure the brightness, gain and LED PWM duty cycle to achieve even lighting. You can zoom and pan to inspect the image closer; the picture darkens and brightens with the settings.',
    pointers: [{ at: at(75, 70), label: 'live frame from the reader', edge: 'bottom' }, { at: at(198, 38), label: 'exposure', edge: 'top', to: [62, 0] }, { at: at(198, 56), label: 'gain', edge: 'top', to: [84, 0] }, { at: at(198, 74), label: 'LED duty', edge: 'bottom', to: [84, 0] }] },
  { scene: 'roi', eyebrow: 'Step 5', title: 'ROI refinement', body: 'WindowNet auto-generates a ROI; the controls refine the selection further, with zoom and pan to view it in more detail.',
    pointers: [{ at: at(96, 15), label: 'x y w h of the box', edge: 'top', to: [40, 0] }, { at: at(120, 72), label: 'the auto guess, to be checked', edge: 'bottom' }, { at: at(224, 15), label: 'Tab: move, size or pan', edge: 'top', to: [80, 0] }] },
  { scene: 'read', eyebrow: 'Step 6', title: 'Test read', body: 'A test reading is made using the ROI set earlier. It shows the confidence level of the reading, and you can inspect digit by digit by pressing (D).',
    pointers: [{ at: at(75, 70), label: 'the frame the OCR used', edge: 'bottom' }, { at: at(165, 33), label: 'LOW: below the 0.8 gate', edge: 'top', to: [70, 0] }, { at: at(175, 63), label: 'the least sure drum', edge: 'bottom', to: [78, 0] }] },
  { scene: 'radio', eyebrow: 'Step 7', title: 'LoRa connectivity test', body: 'A connectivity test to the LoRaWAN gateway makes sure the reader can reach the gateway. More info can be viewed by expanding the (i) menu.',
    pointers: [{ at: at(30, 48), label: 'signal bars', edge: 'bottom', to: [20, 0] }, { at: at(96, 40), label: 'acknowledgement time', edge: 'top' }, { at: at(225, 20), label: 'RSSI, SNR, data rate', edge: 'top', to: [82, 0] }] },
  { scene: 'review', eyebrow: 'Step 8', title: 'Review changes and save', body: 'Check the settings and configuration to be saved to the reader. After saving, the reader changes into standard deployment mode and the BLE link is lost.',
    pointers: [{ at: at(90, 54), label: 'everything about to be committed', edge: 'top' }, { at: at(120, 113), label: 'Finish', edge: 'bottom' }] },
  { scene: 'done', eyebrow: 'Setup complete', title: 'The reader sleeps and starts reading', body: 'The finish message quotes the reader’s own sleep timer. From here the reader wakes on its own interval, reads, sends and sleeps.',
    pointers: [{ at: at(70, 48), label: 'the reader’s own reply', edge: 'top' }] },
  { scene: 'connected', eyebrow: 'A configured reader', title: 'Read, Configure, More', body: 'A configured reader gets Read, Configure and More instead of the wizard. Configure opens one setup category at a time, with explicit save or discard; More holds the radio test, reader info, About and a factory reset behind a confirmation.',
    pointers: [{ at: at(50, 48), label: 'read now', edge: 'top', to: [26, 0] }, { at: at(62, 66), label: 'one category at a time', edge: 'top', to: [60, 0] }, { at: at(50, 84), label: 'radio test, info, factory reset', edge: 'bottom' }] },
  { scene: 'reread', eyebrow: 'Read', title: 'The very frame the OCR used', body: 'Read shows the reading with the frame it was made from, the box the reader read and the drum separators, decimal drums in red. (D) cycles single digits with that digit’s model confidence.',
    pointers: [{ at: at(75, 70), label: 'box and drum separators', edge: 'bottom' }, { at: at(175, 45), label: '0092.07', edge: 'top', to: [78, 0] }] },
];

const FRAMES: Frame[] = [
  {
    id: 'ck-intro', eyebrow: 'Setup and configuration', title: 'ConfigKing',
    body: (
      <>
        <p>DrumNet and the firmware are loaded onto Prototype V2, and the LoRa device address is baked into the firmware during flashing. Setup is done with an M5Stack Cardputer over BLE and ESP-NOW. The Cardputer runs a piece of firmware called ConfigKing, which automatically detects nearby unconfigured readers and prompts the user to set them up; it also reconfigures configured readers.</p>
        <p className="ws-note">Since the readers are mostly asleep, pressing the boot button wakes one up to be discoverable. The screen on the left is a working copy of the real firmware&rsquo;s screens, drawn from its source.</p>
      </>
    ),
    visual: <ConfigKingSim scene="free" keys={false} />,
  },
  ...STEPS.map((s): Frame => ({
    id: `ck-${s.scene}`, eyebrow: s.eyebrow, title: s.title, body: <p>{s.body}</p>, pointers: s.pointers,
    visual: <ConfigKingSim scene={s.scene} keys={false} />,
  })),
  {
    id: 'ck-free', eyebrow: 'Try it', title: 'Set up a reader yourself', wide: true, cls: 'tall',
    body: <p>The same screens, keys and wizard, talking to a simulated reader. A reader will turn up nearby in a moment.</p>,
    visual: <ConfigKingSim scene="free" keys large />,
  },
];

export default function ConfigKingChapter({ chapter }: { chapter: string }) {
  return (
    <>
      <Cover id="configking" chapter={chapter} title="ConfigKing" lines={['Config', 'King']}
        contents={[{ label: 'Discovery to review, 8 steps' }, { label: 'A configured reader' }, { label: 'Try it yourself' }]}
        plate={<div className="ws-plate-obj device"><CardputerCover /></div>} />
      <Story id="configking-body" chapter={chapter} title="ConfigKing" frames={FRAMES} per={0.85} />
      <style>{CK_STYLE}</style>
    </>
  );
}
