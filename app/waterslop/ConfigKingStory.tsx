'use client';
import Story, { type Frame } from './Story';
import ConfigKingSim, { type SimScene } from './ConfigKingSim';

/* ConfigKingStory: the setup procedure, walked on the simulated Cardputer. Each
   frame puts the simulator at that step of the wizard; the last frames hand the
   keys to the reader. Step text is the report's. */

type StepFrame = { scene: SimScene; eyebrow: string; title: string; body: string; pointers: Frame['pointers'] };
const STEPS: StepFrame[] = [
  { scene: 'nearby', eyebrow: 'Step 1', title: 'Discovery', body: 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.',
    pointers: [{ at: [46, 40], label: 'the reader found nearby, blank', to: [62, 14] }, { at: [22, 62], label: 'Enter connects, Esc waits', to: [6, 86] }] },
  { scene: 'identify', eyebrow: 'Step 2', title: 'Identification and reading rate', body: 'Configure the name of the reader that shows up in the dashboard, then the reading rate. Expanding the (i) icon shows more details about the reader.',
    pointers: [{ at: [50, 33], label: 'the name on the dashboard', to: [62, 14] }, { at: [40, 51], label: 'every 60 s; arrows change it', to: [48, 72] }, { at: [93, 15], label: 'reader details', to: [70, 6] }] },
  { scene: 'layout', eyebrow: 'Step 3', title: 'Drum layout', body: 'Configure the drum layout based on the meter the reader will be installed on: whole-number drums range from 1 to 8, and fraction drums from 0 to 4.',
    pointers: [{ at: [34, 31], label: 'whole drums, 1 to 8', to: [56, 22] }, { at: [34, 48], label: 'decimal drums, 0 to 4', to: [56, 42] }, { at: [35, 66], label: 'decimal drums in red', to: [56, 82] }] },
  { scene: 'camera', eyebrow: 'Step 4', title: 'Camera configuration', body: 'Configure the brightness, gain and LED PWM duty cycle to achieve even lighting. You can zoom and pan to inspect the image closer.',
    pointers: [{ at: [31, 55], label: 'live frame from the reader', to: [10, 86] }, { at: [82, 29], label: 'exposure', side: 'l', to: [64, 20] }, { at: [82, 43], label: 'gain', side: 'l', to: [64, 46] }, { at: [82, 56], label: 'LED duty', side: 'l', to: [64, 66] }] },
  { scene: 'roi', eyebrow: 'Step 5', title: 'ROI refinement', body: 'WindowNet auto-generates a ROI; the controls refine the selection further, with zoom and pan to view it in more detail.',
    pointers: [{ at: [40, 11], label: 'x y w h of the box', to: [22, 3] }, { at: [50, 52], label: 'the auto guess, to be checked', to: [66, 30] }, { at: [93, 11], label: 'Tab: move, size or pan', to: [96, 3] }] },
  { scene: 'read', eyebrow: 'Step 6', title: 'Test read', body: 'A test reading is made using the ROI set earlier. It shows the confidence level of the reading, and you can inspect digit by digit by pressing (D).',
    pointers: [{ at: [31, 52], label: 'the frame the OCR used', to: [10, 84] }, { at: [68, 26], label: 'LOW: below the 0.8 gate', to: [84, 10] }, { at: [72, 46], label: 'the least sure drum', to: [86, 64] }] },
  { scene: 'radio', eyebrow: 'Step 7', title: 'LoRa connectivity test', body: 'A connectivity test to the LoRaWAN gateway makes sure the reader can reach the gateway. More info can be viewed by expanding the (i) menu.',
    pointers: [{ at: [12, 36], label: 'signal bars', to: [8, 70] }, { at: [40, 30], label: 'acknowledgement time', to: [56, 56] }, { at: [93, 15], label: 'RSSI, SNR, data rate', side: 'l', to: [72, 6] }] },
  { scene: 'review', eyebrow: 'Step 8', title: 'Review changes and save', body: 'Check the settings and configuration to be saved to the reader. After saving, the reader changes into standard deployment mode and the BLE link is lost.',
    pointers: [{ at: [36, 40], label: 'everything about to be committed', to: [60, 26] }, { at: [50, 84], label: 'Finish', to: [70, 70] }] },
  { scene: 'done', eyebrow: 'Setup complete', title: 'The reader sleeps and starts reading', body: 'The finish message quotes the reader’s own sleep timer. From here the reader wakes on its own interval, reads, sends and sleeps.',
    pointers: [{ at: [30, 36], label: 'the reader’s own reply', to: [60, 60] }] },
  { scene: 'connected', eyebrow: 'A configured reader', title: 'Read, Configure, More', body: 'A configured reader gets Read, Configure and More instead of the wizard. Configure opens one setup category at a time, with explicit save or discard; More holds the radio test, reader info, About and a factory reset behind a confirmation.',
    pointers: [{ at: [20, 36], label: 'read now', to: [50, 24] }, { at: [26, 49], label: 'one category at a time', to: [56, 48] }, { at: [20, 62], label: 'radio test, info, factory reset', to: [50, 76] }] },
  { scene: 'reread', eyebrow: 'Read', title: 'The very frame the OCR used', body: 'Read shows the reading with the frame it was made from, the box the reader read and the drum separators, decimal drums in red. (D) cycles single digits with that digit’s model confidence.',
    pointers: [{ at: [31, 52], label: 'box and drum separators', to: [10, 84] }, { at: [70, 34], label: '0092.07', to: [86, 14] }] },
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
    id: 'ck-free', eyebrow: 'Try it', title: 'Set up a reader yourself',
    body: (
      <>
        <p>This is the ConfigKing firmware simulated in the browser: the same screens, keys and wizard, talking to a simulated reader. Click the screen, then use the arrow keys, Enter, Esc and Tab, or the keys under it. A reader will turn up nearby in a moment.</p>
        <p className="ws-note">Keys: arrows move, Enter selects, Esc goes back, Tab cycles the active control, + and − zoom, Shift makes steps ×10. Letters: i info, p preset or refresh, f find the window again, d digit, r read again, t radio test, s sound.</p>
      </>
    ),
    visual: <ConfigKingSim scene="free" keys />,
  },
];

export default function ConfigKingStory({ chapter }: { chapter: string }) {
  return (
    <>
      <Story id="configking" chapter={chapter} title="ConfigKing" frames={FRAMES} per={0.85} />
      <style>{`
        .ck { display: flex; flex-direction: column; gap: 10px; align-items: center; width: min(calc(54vw - 24px), calc((100svh - var(--ws-nav, 0px) - 30svh) * 1.78)); }
        .ck-device { position: relative; width: 100%; padding: 4.2% 4.2% 4.6%; border-radius: 14px; background: linear-gradient(160deg, #2a2724, #141211); box-shadow: inset 0 1px 0 #ffffff14, 0 20px 50px -20px #000; outline: none; cursor: default; }
        .ck-device:focus-visible { box-shadow: inset 0 1px 0 #ffffff14, 0 0 0 1px var(--ink, #d8cbb8), 0 20px 50px -20px #000; }
        .ck-screen { display: block; width: 100%; height: auto; aspect-ratio: 240 / 135; border-radius: 4px; background: #000; image-rendering: auto; }
        .ck-keys { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; width: 100%; }
        .ck-keys button { min-width: 38px; height: 32px; padding: 0 10px; border: 1px solid #d8cbb875; border-radius: 4px; background: #d8cbb80d; color: var(--ink, #d8cbb8); font: 500 12px Manrope, Arial, sans-serif; transition: background 0.15s, color 0.15s; }
        .ck-keys button:hover { background: #d8cbb822; color: #fff0db; }
        .ck-keys button:active { background: #eee4d5; color: #28231e; }
        @media (max-width: 900px) { .ck { width: min(92vw, calc((45svh - var(--ws-nav, 0px) - 70px) * 1.78)); gap: 6px; } .ck-device { padding: 3% 3% 3.4%; border-radius: 10px; } .ck-keys button { min-width: 32px; height: 28px; padding: 0 7px; font-size: 11px; } }
      `}</style>
    </>
  );
}
