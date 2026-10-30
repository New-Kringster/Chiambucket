import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import WaterslopChapter from './WaterslopChapter';
import { Cover, Page, Plate, type Frame } from './Story';
import DrumNetStory from './DrumNetWalk';
import FirmwareChapter from './ReadCycle';
import CameraChapter from './FocusLab';
import CalibrationChapter from './CalibrationLab';
import ConfigKingChapter from './ConfigKingStory';
import PairCompare from './Compare';
import { LoopRing, AgentBadges } from './Agents';
import PageFx from './PageFx';
import './waterslop.css';
import './article.css';
import './story.css';

const description =
  'OCR Reader: a low-cost, battery-powered vision OCR water meter reader. A 693K-parameter DrumNet V10 pipeline runs entirely on an ESP32-S3, reads the drums, and sends the reading over LoRaWAN. Told chapter by chapter: MeterSim, SimGen2, six training agents, the network step by step, the firmware, the PCB in 3D, the enclosure and a ConfigKing simulator.';

export const metadata: Metadata = {
  title: 'OCR Reader, a vision water meter reader on an ESP32-S3 | Chiambucket',
  description,
  alternates: { canonical: 'https://www.chiambucket.com/waterslop' },
  openGraph: {
    title: 'OCR Reader: a vision water meter reader on an ESP32-S3',
    description,
    url: 'https://www.chiambucket.com/waterslop',
    type: 'article',
    images: [{ url: '/waterslop/og.webp', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'OCR Reader: a vision OCR water meter reader on an ESP32-S3',
  description,
  image: 'https://www.chiambucket.com/waterslop/og.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/waterslop',
};

/* The report on OneDrive. The share link cannot be framed (its CSP only allows
   OneDrive's own origins); the embed URL is the one OneDrive's Embed dialog
   produces. Clear it and the section links out instead. */
const REPORT_LINK = 'https://1drv.ms/w/c/4eae3340327c4979/IQD6fnAtH4qnTp-LM2j2Hj_7ARKI2X_7aByE_W7eXIiQjQk?e=DOacjY';
const REPORT_EMBED_URL = 'https://1drv.ms/w/c/4eae3340327c4979/IQTHPE0ITKXXRo97ze60q4LkAcIyqE0Ek_Mh2xwbOefamDk?em=2';

const I = '/images/waterslop/';
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const img = (src: string, alt: string, cls?: string) => <img src={I + src} alt={alt} loading="lazy" decoding="async" className={cls} />;
const pair = (a: string, altA: string, b: string, altB: string, cls?: string) => (
  <div className={`ws-pair${cls ? ` ${cls}` : ''}`}>{img(a, altA)}{img(b, altB)}</div>
);

/* Chapters, in order. The PCB chapter is the exported 3D chapter plus two
   pages of its own; the roman numeral is shared. */
const CHAPTERS: Array<[string, string]> = [
  ['brief', 'Design brief'], ['v2', 'PCB & enclosure'], ['drumnet', 'DrumNet'], ['configking', 'ConfigKing'],
  ['metersim', 'MeterSim'], ['simgen2', 'SimGen2'], ['agents', 'Agentic workflow'], ['firmware', 'Firmware'], ['power', 'Power optimisation'],
  ['camera', 'Camera choice'], ['calibration', 'Camera calibration'], ['conclusion', 'Conclusion'], ['report', 'The report'],
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const NUM: Record<string, string> = Object.fromEntries(CHAPTERS.map(([id], i) => [id, ROMAN[i]]));

const Contents = () => (
  <nav className="ws-contents article-chapter-wrapper" aria-label="Chapters">
    {CHAPTERS.map(([id, label]) => <a key={id} href={`#${id}`}><span>{label}</span><i /><span>({NUM[id]})</span></a>)}
  </nav>
);

/* ── Chapter I: the brief ── */
const SPECS: Array<[string, string]> = [
  ['Ultra-low power', 'The meter needs to be able to run on batteries while lasting for 2 years.'],
  ['Low cost', 'A target cost of under S$100 per piece, not inclusive of installation labour.'],
  ['High reliability', 'Target ≥ 99 % meter accuracy (the whole reading correct) and ≥ 99.9 % digit accuracy (each drum correct).'],
  ['Easy deployment', 'Easy to mount and configure, with minimal calibration.'],
  ['Modularity', 'Easily repairable and upgradable.'],
  ['Secure and safe', 'Able to resist tampering, as its readings directly affect billing.'],
  ['Weather sealed', 'Sealed so weather changes do not cause missed readings.'],
];
const BRIEF: Frame[] = [
  {
    id: 'brief-specs', eyebrow: 'Design brief', title: 'What the reader has to be',
    body: (
      <>
        <p>These are the design specifications the reader was designed around.</p>
        <p>The ESP32-S3 with 8 MB of PSRAM was selected as the microcontroller, and the OV2640 with a 160° field of view was selected as the camera. Production readers send their readings over LoRaWAN; Wi-Fi is only used by the reader on the training rig.</p>
      </>
    ),
    visual: <div className="ws-spec-list">{SPECS.map(([t, d]) => <div key={t}><b>{t}</b><span>{d}</span></div>)}</div>,
  },
  {
    id: 'brief-path', eyebrow: 'Design brief', title: 'From the meter to the dashboard',
    body: <p>The camera is pointed at the water meter and takes readings on 6-hour intervals. After the reading is made on device, the numerical reading is transmitted over LoRaWAN to a database storing the readings, which the user and the utility provider can access over a dashboard. The original image is never transmitted; only the predicted reading is.</p>,
    visual: (
      <div className="ws-flow-v" role="img" aria-label="Water meter, meter reader, LoRaWAN gateway, database storage, dashboard">
        {[['Water meter', 'the mechanical register, untouched', ''], ['Meter reader', 'camera + ESP32-S3, reads on device', 'camera'], ['LoRaWAN gateway', 'receives the small uplink', 'LoRaWAN'], ['Database storage', 'stores every reading', 'internet'], ['Dashboard', '92.07 m³, for the user and the utility', '']].map(([t, s, link], i) => (
          <div key={t} className={i === 1 ? 'lit' : undefined}>{link && <i>{link} →</i>}<b>{t}</b><span>{s}</span></div>
        ))}
      </div>
    ),
  },
];

/* ── Chapter II: MeterSim ── */
const METERSIM: Frame[] = [
  {
    id: 'ms-rig', eyebrow: 'MeterSim', title: 'A simulated meter for a real camera',
    body: <p>The first version of MeterSim was built alongside Prototype V0.5&rsquo;s firmware. They work in conjunction, so Prototype V0.5 can be controlled automatically by MeterSim and labelled image data can be generated for model training. All the software and firmware builds were entirely written by Claude.</p>,
    visual: img('v05-rig-a.webp', 'Prototype V0.5, an ESP32-EYE, pointed at a tablet showing the MeterSim display'),
    pointers: [{ at: [38, 36], label: 'the MeterSim display', to: [30, 0] }, { at: [84, 40], label: 'Prototype V0.5, an ESP32-EYE', to: [76, 0] }],
  },
  {
    id: 'ms-control', eyebrow: 'MeterSim', title: 'Built for agents, watched by humans',
    body: <p>MeterSim is built to be used by agentic AI agents instead of humans, so the control panel serves as a monitoring platform for humans to see the progress made by the agents. Agents use MeterSim as a framework to build tests, collect data and verify accuracy while creating DrumNet. It replaces the most tedious task in machine learning, gathering quality data to train on, by generating the data; and since the environment is simulated, the data is naturally labelled.</p>,
    visual: img('metersim-control.webp', 'The MeterSim control interface, with sliders for reading, drums, surface and weather effects'),
    pointers: [{ at: [30, 22], label: 'what the display shows', edge: 'top', to: [22, 0] }, { at: [30, 70], label: 'the reader’s latest capture', edge: 'bottom', to: [22, 0] }, { at: [80, 7], label: 'meter design', edge: 'top', to: [58, 0] }, { at: [80, 37], label: 'reading and drum layout', edge: 'top', to: [88, 0] }, { at: [80, 55], label: 'force a drum to half-roll', edge: 'bottom', to: [58, 0] }, { at: [80, 75], label: 'glare, smudge, shadow', edge: 'bottom', to: [88, 0] }],
  },
  {
    id: 'ms-designs', eyebrow: 'MeterSim', title: 'Nine meter designs, nine presets',
    body: (
      <>
        <p>MeterSim has 9 different meter designs that can be customised with different barrel configurations, like 7 integer barrels and 1 decimal barrel (7+1); the integer barrels are typically in white or black while the decimal barrels are in red.</p>
        <p>Common combinations of conditions are saved as presets: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty.</p>
      </>
    ),
    visual: pair('metersim-designs.webp', 'The nine meter designs available in MeterSim: Itron Weg 50, Elster brass, Itron Multimag Cyble, Bonega S/13 and T/13, Istameter II, an industrial generic, B Meters blue and a clean Elster brass', 'metersim-presets.webp', 'Nine preset conditions: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty'),
  },
  {
    id: 'ms-halfroll', eyebrow: 'MeterSim', title: 'Half-rolled drums, on purpose',
    body: <p>It also simulates half-rolled barrels, so the model can be trained to predict the value of barrels that are in the middle of transitioning from one value to another. This is done automatically by the agent during training data collection.</p>,
    visual: img('metersim-halfroll.webp', 'The MeterSim roll control, dragging individual drums part-way between digits'),
    pointers: [{ at: [26, 50], label: 'drag a drum part way', edge: 'top' }, { at: [66, 87], label: 'the last drum, mid-roll', edge: 'bottom' }],
  },
  {
    id: 'ms-effects', eyebrow: 'MeterSim', title: 'Weather and surface conditions',
    body: <p>MeterSim also simulates different weather and meter surface conditions to better match how a meter left out in the elements may look; this is part of the training so the reader can read in different conditions. The controls include glare, smudge, shadow, lighting, blur, sensor noise, fog, dirt and scaling.</p>,
    visual: img('metersim-effects.webp', 'The surface and weather effect sliders in MeterSim, each with a preview thumbnail'),
    pointers: [{ at: [72, 10], label: 'glare', edge: 'top', to: [30, 0] }, { at: [72, 30], label: 'window smudge', edge: 'top', to: [58, 0] }, { at: [72, 48], label: 'shadow', edge: 'top', to: [86, 0] }, { at: [72, 60], label: 'lighting', edge: 'bottom', to: [30, 0] }, { at: [72, 72], label: 'glass and sensor: blur, noise, fog, dirt', edge: 'bottom', to: [58, 0] }, { at: [72, 90], label: 'view: scale, tilt, offset', edge: 'bottom', to: [86, 0] }],
  },
  {
    id: 'ms-eval', eyebrow: 'MeterSim', title: 'Evaluation and data collection, unattended',
    body: (
      <>
        <p>MeterSim is a self-hosted web app with two endpoints: the control panel at /control and the display at /display. The reader is connected over Wi-Fi on the same local network as the MeterSim instance; it uses this to send readings and images it has taken and to receive commands.</p>
        <p>For model evaluation, a randomised meter and its conditions are generated and shown to the reader, which takes an image and makes a reading using the trained network. The results are sent back to MeterSim, and since MeterSim knows the simulated value (the answer), it is compared against the prediction; repeated many times, this gives an approximate accuracy of the model, performed by an agent without human intervention. Collecting labelled data works the same way, except the images the reader takes are saved to disk along with the labels in JSON, ready for training.</p>
      </>
    ),
    visual: pair('metersim-display-rig.webp', 'A tablet showing the MeterSim display next to a laptop with the control panel, with the ESP32-EYE reader pointed at the tablet', 'v05-rig-b.webp', 'The ESP32-EYE reader on a bottle pointed at the MeterSim display, in a classroom'),
    pointers: [{ at: [7, 62], label: '/display on the tablet', edge: 'bottom', to: [10, 0] }, { at: [28, 27], label: 'the reader, pointed at it', edge: 'top', to: [22, 0] }, { at: [44, 55], label: '/control on the laptop', edge: 'bottom', to: [40, 0] }, { at: [74, 27], label: 'the reader on its stand', edge: 'top', to: [72, 0] }, { at: [57, 52], label: 'MeterSim, waiting for the result', edge: 'bottom', to: [72, 0] }],
  },
];

/* ── Chapter III: SimGen2 ── */
const STAGES: Array<[string, string]> = [
  ['Display screenshot', 'MeterSim’s display, 1920 × 1080'], ['Warped', 'pose and lens, to 1600 × 1200'], ['Field blur', '1.2 to 2.2 px'], ['Gain, tone curve, vignette', 'the sensor’s response'], ['Sensor noise', 'grain where the real camera has it'], ['OV2640 JPEG', 'quality 6, as the reader compresses'],
];
const SIMGEN2: Frame[] = [
  {
    id: 'sg-stages', eyebrow: 'SimGen2', title: 'Simulating the camera itself', wide: true,
    body: (
      <>
        <p>Even with all these automation workflows, one major bottleneck remained: capturing images from the reader and transferring them to MeterSim takes almost 10 s, and repeated over thousands of images, many hours are wasted. So the next goal was to simulate the reader&rsquo;s camera itself. This system is SimGen2. It works by scaling, then applying filters and warping to simulate the look of an image taken from the reader&rsquo;s camera.</p>
        <p>SimGen2 was developed by OpenAI&rsquo;s ChatGPT Astra 6 entirely; roughly 4000 real images taken by the reader were used to develop the filters.</p>
      </>
    ),
    visual: (
      <div className="ws-stages">
        {img('simgen2-stages.webp', 'The six processing stages of SimGen2 from display screenshot to warped, blurred, toned, noisy and JPEG-compressed output, with a strip of the register at each stage')}
        <ol>{STAGES.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ol>
      </div>
    ),
  },
  {
    id: 'sg-overlay', eyebrow: 'SimGen2', title: 'Real over synthetic',
    body: <p>SimGen2 generates an image in about 2 s, almost 5× faster than capturing with the physical reader. Used in parallel with the reader, it produced tens of thousands of unique labelled images, which trained the DrumNet Simulated model. Here a real capture tinted magenta is overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured. The LED glare in the real capture is the biggest difference left.</p>,
    visual: img('simgen2-overlay.webp', 'A real capture tinted magenta overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured'),
  },
  {
    id: 'sg-pairs', eyebrow: 'SimGen2', title: 'Compare them yourself',
    body: <p>Twenty-one real captures and their SimGen2 versions across six meter designs, cut from the report&rsquo;s sheets. Drag the divider: the real capture is on the left, SimGen2 on the right. The register strip is the part DrumNet reads, so it is the big one.</p>,
    visual: <PairCompare />,
  },
];

/* ── Chapter IV: the agents ── */
const AGENTIC: Frame[] = [
  {
    id: 'ag-loop', eyebrow: 'Agentic workflow', title: 'The self-improvement loop',
    body: <p>LLM-based AI agents were used extensively in this project. Agents were tasked to improve the full vision pipeline running on the ESP32-S3 with the target of 99 % meter accuracy. The core loop is developing a hypothesis, planning the execution, gathering training data, retraining, fine-tuning or RL-ing the model, testing for improvements or regressions, then reporting the findings and starting again.</p>,
    visual: <LoopRing />,
  },
  {
    id: 'ag-six', eyebrow: 'Agentic workflow', title: 'Six agents, three of them on DrumNet', wide: true,
    body: (
      <>
        <p>This framework was applied to three agents, each working on a variant of DrumNet, with three more agents on other jobs. After running for about 1.5 weeks, Standard and Premade displayed lacklustre performance, so their development was halted and all resources were reallocated to DrumNet Simulated.</p>
        <p>It was then allowed to train on every dataset, including those from the rig and the external catalogue, and was renamed DrumNet. The current build, V10, is the highest performing network of the DrumNet series.</p>
      </>
    ),
    visual: <AgentBadges />,
  },
  {
    id: 'ag-resources', eyebrow: 'Agentic workflow', title: 'Shared resources and a scheduler',
    body: (
      <>
        <p>With six agents running simultaneously, they would constantly compete for resources, so the scheduler was developed. It lets the agents book timeslots on the shared resources: my server (CPU compute) and laptop (GPU compute), collectively the compute resource used for training, and the Jetson rig, which lets an agent flash and interact with Prototype V1 while controlling the display it is pointed at through MeterSim.</p>
        <p className="ws-note">On the scheduler&rsquo;s compute timeline, the filled area is booked threads against the 20-thread budget and the red line is booked memory against the 9 GB budget. The laptop GPU takes one job at a time.</p>
      </>
    ),
    visual: (
      <div className="ws-pair stackv">
        {img('agents-resources-sketch.webp', 'A sketch of the three DrumNet agents sharing the Jetson rig and compute through two schedulers, with the coordinator, Sim2 Genius and the window detector model alongside', 'plate')}
        {img('scheduler-compute.webp', 'The scheduler timeline for the compute resources, with booked blocks per agent and the booked load against the budget')}
      </div>
    ),
    pointers: [{ at: [22, 12], label: 'the Jetson rig', edge: 'top', to: [14, 0] }, { at: [78, 13], label: 'SimGen2, for Simulated and Premade', edge: 'top', to: [70, 0] }, { at: [22, 36], label: 'laptop GPU and server CPU', edge: 'top', to: [40, 0] }, { at: [50, 68], label: 'the scheduler: each agent’s bookings', edge: 'bottom', to: [40, 0] }, { at: [40, 80], label: 'booked load against the budget', edge: 'bottom', to: [72, 0] }],
  },
  {
    id: 'ag-t3', eyebrow: 'Agentic workflow', title: 'Managed with T3 Code',
    body: (
      <>
        <p>The agents ran 24/7 through a &ldquo;heartbeat&rdquo;, a simple script that wakes an agent after a set time, or at a set time, to continue working. The agents were instructed to act independently and make their own decisions, so very little human involvement was required.</p>
        <p>Tailscale was at the heart of the networking: a personal peer-to-peer VPN that let the agents running on my server at home communicate with and control the Jetson rig located in school, over SSH. T3 Code, an open-source meta-harness for Claude Code and Codex, managed the agents.</p>
      </>
    ),
    visual: img('t3-tailscale.webp', 'Diagram of T3 Code connecting the client device, the home server running the agents, the laptop GPU and the Jetson rig at school over Tailscale', 'plate'),
    pointers: [{ at: [15, 62], label: 'the Jetson rig, at school', edge: 'bottom', to: [15, 0] }, { at: [54, 22], label: 'T3 Code', edge: 'top', to: [50, 0] }, { at: [54, 50], label: 'Tailscale', edge: 'bottom', to: [50, 0] }, { at: [82, 20], label: 'my devices', edge: 'top', to: [82, 0] }, { at: [82, 78], label: 'the server at home, running the agents', edge: 'bottom', to: [82, 0] }],
  },
];

/* ── Chapter VII: power ── */
const MODES: Array<{ src: string; res: string; time: string; note: string; ox: number; oy: number; on?: boolean }> = [
  { src: 'mode-1600-full.webp', res: '1600 × 1200', time: '350 ms capture', note: 'every pixel of the sensor', ox: 57, oy: 41 },
  { src: 'mode-800-crop.webp', res: '800 × 600', time: '89 ms capture', note: 'SVGA, the chosen mode', ox: 58, oy: 41, on: true },
  { src: 'mode-400-crop.webp', res: '400 × 296', time: '61 ms capture', note: 'CIF, too few pixels per drum', ox: 57, oy: 40 },
];
const POWER: Frame[] = [
  {
    id: 'pw-sub', eyebrow: 'Power optimisation · software', title: 'In-camera sub-sampling',
    body: (
      <>
        <p>The reader needs to run for very long durations, up to 2 years, on a set of batteries. The ESP32-S3 is relatively efficient at heavy tasks like the vector maths neural networks need, but it is nowhere near as efficient as Nordic&rsquo;s nRF line-up, so these are the strategies to reduce energy use. The wireless radios of the ESP32-S3 are turned off in deployment; they are only used for initial configuration.</p>
        <p>The OV2640 supports up to 1600 × 1200 but also sub-sampling modes of 800 × 600 SVGA and 400 × 296 CIF.</p>
      </>
    ),
    visual: pair('ov2640-svga.webp', 'OV2640 SVGA sub-sampling mode diagram showing which pixels are skipped', 'ov2640-cif.webp', 'OV2640 CIF sub-sampling mode diagram', 'plate'),
  },
  {
    id: 'pw-modes', eyebrow: 'Capture modes, side by side', title: 'SVGA: 89 ms, and the chosen mode', wide: true,
    body: (
      <>
        <p>The same meter at the three resolutions: the full frame above, the drums below at the same magnification. At 1600 × 1200 every pixel of the sensor is read out and the capture takes 350 ms; the less time the camera stays on, the less energy it consumes. At 400 × 296 the capture takes 61 ms, but the drums are left with too few pixels to read reliably.</p>
        <p>Based on my testing, SVGA yields the best balance of quality and speed, and 800 × 600 means the network processes 4× less information than 1600 × 1200. No proper tests were conducted to back up the accuracy claim, although accuracy did not suffer greatly in my experience.</p>
      </>
    ),
    visual: (
      <div className="ws-modes" data-no-zoom>
        {MODES.map((m) => (
          <figure key={m.res} className={m.on ? 'on' : undefined}>
            <img className="full" src={I + m.src} alt={`${m.res} capture of the meter`} loading="lazy" decoding="async" />
            <div className="drums" role="img" aria-label={`the drums at ${m.res}`} style={{ backgroundImage: `url(${I + m.src})`, ['--ox' as string]: `${m.ox}%`, ['--oy' as string]: `${m.oy}%` }} />
            <figcaption><b>{m.res}</b><span>{m.time} · {m.note}</span></figcaption>
          </figure>
        ))}
      </div>
    ),
  },
  {
    id: 'pw-pwm', eyebrow: 'Power optimisation · software', title: 'PWM dimming on the LEDs',
    body: <p>I had initially dismissed PWM dimming because the OV2640 uses a rolling shutter, which could capture between the off-cycles of the PWM signal and show banding. But the OV2640 did not suffer from any banding, so I run the LEDs at 20 kHz with 50 % duty cycle. This saves some fraction of power and adds brightness control.</p>,
    visual: pair('led-banding.webp', 'A capture showing horizontal banding across the meter face', 'led-no-banding.webp', 'A capture with PWM-dimmed LEDs and no banding'),
    pointers: [{ at: [25, 30], label: 'banding', edge: 'top' }, { at: [75, 30], label: 'PWM-dimmed, no banding', edge: 'top' }],
  },
  {
    id: 'pw-grey', eyebrow: 'Power optimisation · software', title: 'In-camera greyscale',
    body: <p>The greyscale filter is done on the camera by the OV2640 and returns a slightly smaller image file; the impact is none to minimal, but it was easy to implement.</p>,
    visual: pair('cam-grey.webp', 'The meter captured in greyscale by the camera', 'cam-colour.webp', 'The same meter captured in colour'),
  },
  {
    id: 'pw-int8', eyebrow: 'Power optimisation · software', title: 'Vector instructions and INT8',
    body: <p>Earlier builds of DrumNet ran at full-precision Float32 on the ESP32-S3, slow and inefficient. The ESP32-S3 has built-in vector instructions, accessed through the ESP-NN library, that perform Multiply and Accumulate (MAC) operations multiple times per clock cycle. After quantising DrumNet to 8 bits, capture-to-prediction time was cut from 61 s to 17 s, roughly 3.6× faster. Efficiency gains have not been properly measured, although I am sure there were big improvements there too.</p>,
    visual: (
      <div className="ws-bignum">
        <div><b>61 s</b><span>Float32</span><small>capture to prediction, before quantisation</small></div>
        <div><b className="red">17 s</b><span>INT8 + ESP-NN</span><small>roughly 3.6× faster</small></div>
      </div>
    ),
  },
  {
    id: 'pw-hw', eyebrow: 'Power optimisation · hardware', title: 'Low-Iq converters, a timer, LoRaWAN',
    body: (
      <ul>
        <li><b>Low Iq, high-efficiency DC-DC converters.</b> The OV2640 needs 1.5 V and 2.8 V. Buck converters have better efficiency than LDOs, but their high quiescent current and more complex design add cost and board space for close-to-negligible gains, and can introduce artefacts in the image, so I stuck with LDOs with low quiescent current. The main 3.3 V rail would be swapped for a special low-Iq (~75 nA) buck-boost converter, the TI TPS63900.</li>
        <li><b>Ultra-low-power timer ICs.</b> A timer IC like the Ambiq AM1805 can turn off all the components and turn them back on on a schedule. The gain would probably be minimal.</li>
        <li><b>LoRaWAN.</b> Chosen for its superior low power and long range, and because its open standard lets the operator entirely own and run their network, unlike Sigfox and NB-IoT.</li>
      </ul>
    ),
    visual: (
      <div className="ws-spec-list">
        <div className="on"><b>TPS63900 buck-boost</b><span>~75 nA quiescent, holds 3.3 V whatever the input, rated for Li-SOCl2</span></div>
        <div><b>Low-Iq LDOs</b><span>1.5 V and 2.8 V for the camera, no switching artefacts</span></div>
        <div><b>Ambiq AM1805 timer</b><span>powers everything down and back up on a schedule</span></div>
        <div className="on"><b>LoRaWAN</b><span>low power, long range, an open standard the operator can run</span></div>
      </div>
    ),
  },
];

/* ── Chapter IX: Prototype V2 and the enclosure, after the 3D chapter ── */
const V2: Frame[] = [
  {
    id: 'v2-intro', eyebrow: 'Prototype V2', title: 'A shrunken-down Prototype V1',
    body: <p>Prototype V2 is a shrunken-down version of Prototype V1. It fits in tighter spaces and let me explore smaller components like the Wio-SX1262 LoRa module from Seeed Studio. It has built-in battery management, power circuitry for the camera and fan, PWM-dimmable LED lights and a LoRa module. I designed the board in KiCad, sourced the components from DigiKey and sent it to JLCPCB for manufacturing; it is a 4-layer board. The circuits are in the report.</p>,
    visual: img('pcb-3d-top.webp', '3D render of the top of the Prototype V2 board from KiCad'),
    pointers: [{ at: [38, 20], label: 'ESP32-S3 WROOM1 N16R8', edge: 'top' }, { at: [60, 70], label: 'battery management and power', edge: 'bottom', to: [70, 0] }, { at: [52, 88], label: 'USB-C', edge: 'bottom', to: [30, 0] }, { at: [86, 90], label: 'camera connector', edge: 'bottom', to: [94, 0] }],
  },
  {
    id: 'v2-size', eyebrow: 'Prototype V2', title: 'The size of a dev board',
    body: (
      <>
        <p>The PCB was designed to be roughly the same size as a typical ESP32-S3 dev board. This compact design allows a smaller housing that fits meters in tighter spaces.</p>
        <p className="ws-note">Prototype V2 was developed before the writing of the report, so some deprecated decisions are still part of it: the fan, proposed for high-humidity conditions that may cause fogging, will be dropped instead if the readings are not reliable; and the power circuitry pre-dates the decision to use Li-SOCl2 cells.</p>
      </>
    ),
    visual: img('v2-vs-devboard.webp', 'The Prototype V2 PCB lying next to an ESP32-S3 development board of nearly the same size'),
    pointers: [{ at: [37, 46], label: 'Prototype V2', edge: 'top', to: [30, 0] }, { at: [62, 46], label: 'an ESP32-S3 dev board', edge: 'top', to: [70, 0] }],
  },
];
const ENCLOSURE: Frame[] = [
  {
    id: 'en-all', eyebrow: 'Enclosure', title: 'Toolless inside, a two-part adapter outside',
    body: (
      <>
        <p>The interior enclosure houses the PCB and batteries of Prototype V2. I exported the 3D file from KiCad into Onshape as the reference, modelled the camera by hand for accuracy, and designed it toolless: side clips snap the two halves together, grooves and pins stop lateral slide, platforms and posts hold the PCB without screws, and a cutout lets the LoRa IPEX cable reach the transceiver. The fit and finish of the final print was great, but I had to cut a hole for the flipped camera from the incorrect pin layout of the assembly stage.</p>
        <p>The exterior adapter is two parts. The bottom half mounts against the meter and puts the camera lens about 4 cm from the dial, the focus distance chosen in the camera test. The top half is much wider, which leaves room to align the reader to the barrels and lets me reuse it on other meters by redesigning only a bottom half. I had forgotten the tabs that lock the meter&rsquo;s lid, so a few cuts with side cutters made room for them.</p>
      </>
    ),
    visual: (
      <div className="ws-quad">
        <figure>{img('enc-reference.webp', 'The KiCad 3D model of the board with the camera modelled on, used as the reference in Onshape', 'plate')}<figcaption>the KiCad export, the reference in Onshape</figcaption></figure>
        <figure>{img('enc-final.webp', 'The final printed interior enclosure with the board inside')}<figcaption>the interior enclosure, printed</figcaption></figure>
        <figure>{img('adapter-distance.webp', 'A CAD section through the adapter showing the camera about 4 cm from the meter face', 'plate')}<figcaption>the adapter in section, 4 cm from the dial</figcaption></figure>
        <figure>{img('adapter-done-b.webp', 'The completed adapter mounted on the meter')}<figcaption>mounted on the meter</figcaption></figure>
      </div>
    ),
  },
];

/* ── Chapter XII: conclusion ── */
const CONCLUSION: Frame[] = [
  {
    id: 'cc-all', eyebrow: 'Conclusion', title: 'Where it stops, for now',
    body: (
      <>
        <p>Due to time constraints, the project stops as it currently is; many issues still need to be addressed before this could be a viable solution. The energy use of this meter has not been measured or tested for its rated 2-year life cycle, and as Prototype V2 stands I do not think that rating is possible: a third revision with more energy-saving components is needed before it is reasonable to start monitoring consumption. The firmware is close to my targeted level of efficiency.</p>
        <p>The 56 % reading accuracy of DrumNet V10 is a far cry from the targeted 99 %. The primary bottleneck is WindowNet: most erroneous readings were caused by its inability to find the correct ROI. The readers also show signs of under-training; a meter they have not seen yields a low confidence, because the dataset was dominated by the 9 meters SimGen2 could generate. A more diverse and larger dataset could help both. The shell is much too bulky for a real deployment; the camera is the primary cause of the Z-height, so a shorter camera that is better at macro imaging needs to be selected, and weather sealing will need different materials and designs.</p>
        <p className="ws-note">Much of this project was my first attempt at something new. I am not exactly satisfied with the outcome, but I am proud of the knowledge and experience I have gained, and grateful for the rare opportunity of time, resources and support to learn and experiment the way I do. Thank you to Mr Alex Oh (NYP) for his guidance, expertise and encouragement, to Mr Soh (NYP), without whom I would not have got the camera working, and to Mr Lee Chang Fatt (NYP) for the LoRaWAN gateway.</p>
      </>
    ),
    visual: (
      <div className="ws-bignum">
        <div><b className="red">56 %</b><span>full pipeline</span><small>808 of 1,440 readings correct</small></div>
        <div><b>99 %</b><span>the target</span><small>the whole reading correct</small></div>
        <div><b>93.2 %</b><span>DrumNet alone</span><small>pooled test set, WindowNet left out</small></div>
        <div><b>2 yr</b><span>the target life</span><small>not yet measured; a V3 board is needed first</small></div>
      </div>
    ),
  },
];

export default function WaterslopPage() {
  return (
    <main className="ws-page art-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />
      <PageFx />

      <header className="ws-hero">
        <div className="ws-hero-photo" aria-hidden="true"><img src={I + 'hero.webp'} alt="" /></div>
        <div className="ws-hero-label">OCR Reader<small>Water meter OCR on an ESP32-S3 · NYP ECE · 2026</small></div>
        <div className="ws-wrap">
          <div className="ws-hero-copy">
            <h1><span>OCR</span><span>Reader</span></h1>
            <p className="ws-hero-lead">A low-cost, low-power, vision-based OCR water meter reader. A 693K-parameter neural network, DrumNet V10, runs entirely on the reader&rsquo;s ESP32-S3: it finds the digit window, reads each drum, and sends the number home over LoRaWAN in about 2 seconds. The target is 99 % accuracy on a 2-year battery; the current build reads 56 % of readings correctly, with plans to improve.</p>
            <Contents />
            <div className="ws-hero-actions">
              <a className="ws-btn" href="#brief">Start reading <ArrowRight /></a>
              <a className="ws-btn ghost" href={REPORT_LINK} target="_blank" rel="noopener">The report</a>
              <span className="ws-hero-meta">ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale</span>
            </div>
          </div>
        </div>
      </header>

      <Cover id="brief" chapter={NUM.brief} title="Design brief" lines={['Design', 'brief']} contents={[{ label: 'What the reader has to be', href: '#brief-specs' }, { label: 'From the meter to the dashboard', href: '#brief-path' }]}
        plate={<Plate src="adapter-done-b.webp" alt="The completed reader mounted on a water meter" />} />
      <Page id="brief-body" title="Design brief" rows={BRIEF} />

      {/* Chapter II: the exported 3D chapter opens it, then the board and the enclosure */}
      <section id="v2" className="ws-pcb" aria-label="Prototype V2: PCB and enclosure in 3D">
        <WaterslopChapter numeral={NUM.v2} />
      </section>
      <Page id="v2-body" chapter={NUM.v2} title="Prototype V2" rows={V2} />
      <Page id="enclosure" chapter={NUM.v2} title="Enclosure" rows={ENCLOSURE} />

      <DrumNetStory chapter={NUM.drumnet} />
      <ConfigKingChapter chapter={NUM.configking} />

      <Cover id="metersim" chapter={NUM.metersim} title="MeterSim" lines={['Meter', 'Sim']} contents={[{ label: 'A simulated meter', href: '#ms-rig' }, { label: 'Built for agents', href: '#ms-control' }, { label: 'Designs and presets', href: '#ms-designs' }, { label: 'Half-rolled drums', href: '#ms-halfroll' }, { label: 'Weather and surfaces', href: '#ms-effects' }, { label: 'Unattended evaluation', href: '#ms-eval' }]}
        plate={<Plate srcs={['metersim-control.webp', 'metersim-effects.webp']} alt="The MeterSim control panel" />} />
      <Page id="metersim-body" title="MeterSim" rows={METERSIM} />

      <Cover id="simgen2" chapter={NUM.simgen2} title="SimGen2" lines={['Sim', 'Gen2']} contents={[{ label: 'Six stages', href: '#sg-stages' }, { label: 'Real over synthetic', href: '#sg-overlay' }, { label: 'Compare them yourself', href: '#sg-pairs' }]}
        plate={<Plate src="simgen2-overlay.webp" alt="A real capture tinted magenta over its SimGen2 version tinted green" />} />
      <Page id="simgen2-body" title="SimGen2" rows={SIMGEN2} />

      <Cover id="agents" chapter={NUM.agents} title="Agentic workflow" lines={['Agentic', 'workflow']} contents={[{ label: 'The loop', href: '#ag-loop' }, { label: 'Six agents', href: '#ag-six' }, { label: 'Resources and the scheduler', href: '#ag-resources' }, { label: 'Managed with T3 Code', href: '#ag-t3' }]}
        plate={<Plate srcs={['agents-resources-sketch.webp', 'scheduler-compute.webp', 't3-tailscale.webp']} alt="The agents' shared resources" cls="light" />} />
      <Page id="agents-body" title="Agentic workflow" rows={AGENTIC} />

      <FirmwareChapter chapter={NUM.firmware} />

      <Cover id="power" chapter={NUM.power} title="Power optimisation" lines={['Saving', 'power']} contents={[{ label: 'Sub-sampling', href: '#pw-sub' }, { label: 'Capture modes, side by side', href: '#pw-modes' }, { label: 'PWM dimming', href: '#pw-pwm' }, { label: 'Greyscale', href: '#pw-grey' }, { label: 'INT8 and vector maths', href: '#pw-int8' }, { label: 'Hardware', href: '#pw-hw' }]}
        plate={<Plate srcs={['mode-800-crop.webp', 'mode-1600-full.webp', 'mode-400-crop.webp']} alt="The meter captured at 800 by 600" />} />
      <Page id="power-body" title="Power optimisation" rows={POWER} />

      <CameraChapter chapter={NUM.camera} />


      <CalibrationChapter chapter={NUM.calibration} />

      <Cover id="conclusion" chapter={NUM.conclusion} title="Conclusion" lines={['Conclusion']} contents={[{ label: 'Where it stops, for now', href: '#cc-all' }, { label: 'The report', href: '#report' }]}
        plate={<Plate src="enc-final.webp" alt="The printed enclosure with the board inside" />} />
      <Page id="conclusion-body" title="Conclusion" rows={CONCLUSION} />

      <section id="report" className="ws-plain">
        <div className="ws-wrap">
          <div className="ws-content">
            <span className="ws-sec-n">Chapter - {NUM.report}</span>
            <h2 className="ws-report-h2">The report</h2>
            {REPORT_EMBED_URL ? (
              <div className="ws-report-frame">
                <iframe title="OCR Water Meter Reader report (Word)" src={REPORT_EMBED_URL} loading="lazy" allowFullScreen />
              </div>
            ) : null}
            <div className="ws-report-card">
              <div className="ws-report-text">
                <b>OCR Water Meter Reader</b>
                <span>Low cost and power vision-based OCR solution for reading water meters. Braven Chiam, NYP Electronic and Computer Engineering. Opens in Word on OneDrive.</span>
              </div>
              <a className="ws-btn" href={REPORT_LINK} target="_blank" rel="noopener">Open the report <ArrowRight /></a>
            </div>
            <p className="ws-note ws-report-note">AI tools were used heavily in the development of this project. Most of the report was written by me in my own words, except for the introduction section and certain graphs; other AI use includes research, chart generation and data verification. This project scores a Level 3 on my scale of AI use.</p>
            <div className="ws-end">
              <span>Check out the next article</span>
              <a href="/#portfolio-items-holder" className="ws-btn ghost">All projects <ArrowRight /></a>
            </div>
          </div>
        </div>
      </section>

      <ArticleRecommendations exclude="proj-waterslop" />
    </main>
  );
}
