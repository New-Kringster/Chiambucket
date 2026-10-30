import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import WaterslopChapter from './WaterslopChapter';
import Story, { type Frame } from './Story';
import DrumNetStory from './DrumNetWalk';
import FirmwareStory from './ReadCycle';
import CameraStory from './FocusLab';
import CalibrationStory from './CalibrationLab';
import ConfigKingStory from './ConfigKingStory';
import PageFx from './PageFx';
import './waterslop.css';
import './article.css';
import './story.css';

const description =
  'OCR Reader: a low-cost, battery-powered vision OCR water meter reader. A 693K-parameter DrumNet V10 pipeline runs entirely on an ESP32-S3, reads the drums, and sends the reading over LoRaWAN. Told as a scroll-driven story: MeterSim, SimGen2, six training agents, the network step by step, the firmware, the PCB in 3D, the enclosure and a ConfigKing simulator.';

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
   Microsoft hosts); the inline viewer uses the src from OneDrive's own Embed
   dialog. Clear it and the section links out instead. */
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
   stories of its own; the roman numeral is shared. */
const CHAPTERS: Array<[string, string]> = [
  ['brief', 'Design brief'], ['metersim', 'MeterSim'], ['simgen2', 'SimGen2'], ['agents', 'Agentic workflow'], ['drumnet', 'DrumNet'],
  ['firmware', 'Firmware'], ['mcu', 'Processor'], ['battery', 'Battery'], ['power', 'Power optimisation'], ['camera', 'Camera choice'],
  ['v2', 'PCB & enclosure'], ['calibration', 'Camera calibration'], ['configking', 'ConfigKing'], ['conclusion', 'Conclusion'], ['report', 'The report'],
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
    pointers: [{ at: [38, 36], label: 'the MeterSim display', to: [22, 14] }, { at: [84, 40], label: 'Prototype V0.5, an ESP32-EYE', to: [62, 72] }],
  },
  {
    id: 'ms-control', eyebrow: 'MeterSim', title: 'Built for agents, watched by humans',
    body: <p>MeterSim is built to be used by agentic AI agents instead of humans, so the control panel serves as a monitoring platform for humans to see the progress made by the agents. Agents use MeterSim as a framework to build tests, collect data and verify accuracy while creating DrumNet. It replaces the most tedious task in machine learning, gathering quality data to train on, by generating the data; and since the environment is simulated, the data is naturally labelled.</p>,
    visual: img('metersim-control.webp', 'The MeterSim control interface, with sliders for reading, drums, surface and weather effects'),
    pointers: [{ at: [30, 22], label: 'what the display shows', to: [8, 8] }, { at: [30, 70], label: 'the reader’s latest capture', to: [8, 52] }, { at: [80, 7], label: 'meter design', side: 'l', to: [62, 4] }, { at: [80, 37], label: 'reading and drum layout', side: 'l', to: [62, 30] }, { at: [80, 55], label: 'force a drum to half-roll', side: 'l', to: [62, 48] }, { at: [80, 75], label: 'glare, smudge, shadow', side: 'l', to: [62, 68] }],
  },
  {
    id: 'ms-designs', eyebrow: 'MeterSim', title: 'Nine meter designs',
    body: <p>MeterSim has 9 different meter designs that can be customised with different barrel configurations, like 7 integer barrels and 1 decimal barrel (7+1); the integer barrels are typically in white or black while the decimal barrels are in red.</p>,
    visual: img('metersim-designs.webp', 'The nine meter designs available in MeterSim: Itron Weg 50, Elster brass, Itron Multimag Cyble, Bonega S/13 and T/13, Istameter II, an industrial generic, B Meters blue and a clean Elster brass'),
  },
  {
    id: 'ms-halfroll', eyebrow: 'MeterSim', title: 'Half-rolled drums, on purpose',
    body: <p>It also simulates half-rolled barrels, so the model can be trained to predict the value of barrels that are in the middle of transitioning from one value to another. This is done automatically by the agent during training data collection.</p>,
    visual: img('metersim-halfroll.webp', 'The MeterSim roll control, dragging individual drums part-way between digits'),
    pointers: [{ at: [26, 50], label: 'drag a drum part way', to: [52, 42] }, { at: [66, 87], label: 'the last drum, mid-roll', to: [78, 70] }],
  },
  {
    id: 'ms-effects', eyebrow: 'MeterSim', title: 'Weather and surface conditions',
    body: <p>MeterSim also simulates different weather and meter surface conditions to better match how a meter left out in the elements may look; this is part of the training so the reader can read in different conditions. The controls include glare, smudge, shadow, lighting, blur, sensor noise, fog, dirt and scaling.</p>,
    visual: img('metersim-effects.webp', 'The surface and weather effect sliders in MeterSim, each with a preview thumbnail'),
    pointers: [{ at: [72, 10], label: 'glare', side: 'l', to: [40, 8] }, { at: [72, 30], label: 'window smudge', side: 'l', to: [40, 28] }, { at: [72, 48], label: 'shadow', side: 'l', to: [40, 46] }, { at: [72, 60], label: 'lighting', side: 'l', to: [40, 58] }, { at: [72, 72], label: 'glass and sensor: blur, noise, fog, dirt', side: 'l', to: [40, 70] }, { at: [72, 90], label: 'view: scale, tilt, offset', side: 'l', to: [40, 88] }],
  },
  {
    id: 'ms-presets', eyebrow: 'MeterSim', title: 'Common combinations, saved as presets',
    body: <p>Common combinations are saved as presets: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty.</p>,
    visual: img('metersim-presets.webp', 'Nine preset conditions: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty'),
  },
  {
    id: 'ms-endpoints', eyebrow: 'MeterSim', title: 'Two endpoints on one network',
    body: <p>MeterSim is a self-hosted web app with two endpoints: the control panel at /control and the display at /display. The reader is connected over Wi-Fi on the same local network as the MeterSim instance; it uses this to send readings and images it has taken and to receive commands. MeterSim is used for two purposes: model evaluation and labelled data collection.</p>,
    visual: img('metersim-display-rig.webp', 'A tablet showing the MeterSim display next to a laptop with the control panel, with the ESP32-EYE reader pointed at the tablet'),
    pointers: [{ at: [14, 62], label: '/display on the tablet', to: [8, 88] }, { at: [57, 27], label: 'the reader, pointed at it', to: [40, 10] }, { at: [90, 55], label: '/control on the laptop', side: 'l', to: [70, 86] }],
  },
  {
    id: 'ms-eval', eyebrow: 'MeterSim', title: 'Evaluation and data collection, unattended',
    body: <p>For model evaluation, a randomised meter and its conditions are generated and shown to the reader, which takes an image and makes a reading using the trained network. The results are sent back to MeterSim, and since MeterSim knows the simulated value (the answer), it is compared against the prediction; repeated many times, this gives an approximate accuracy of the model, performed by an agent without human intervention. Collecting labelled data works the same way, except the images the reader takes are saved to disk along with the labels in JSON, ready for training.</p>,
    visual: img('v05-rig-b.webp', 'The ESP32-EYE reader on a bottle pointed at the MeterSim display, in a classroom'),
    pointers: [{ at: [48, 27], label: 'the reader on its stand', to: [66, 12] }, { at: [12, 52], label: 'MeterSim, waiting for the result', to: [30, 78] }],
  },
];

/* ── Chapter III: SimGen2 ── */
const SIMGEN2: Frame[] = [
  {
    id: 'sg-stages', eyebrow: 'SimGen2', title: 'Simulating the camera itself', wide: true,
    body: (
      <>
        <p>Even with all these automation workflows, one major bottleneck remained: capturing images from the reader and transferring them to MeterSim takes almost 10 s, and repeated over thousands of images, many hours are wasted. So the next goal was to simulate the reader&rsquo;s camera itself. This system is SimGen2. It works by scaling, then applying filters and warping to simulate the look of an image taken from the reader&rsquo;s camera.</p>
        <p>SimGen2 was developed by OpenAI&rsquo;s ChatGPT Astra 6 entirely; roughly 4000 real images taken by the reader were used to develop the filters.</p>
      </>
    ),
    visual: img('simgen2-stages.webp', 'The six processing stages of SimGen2 from display screenshot to warped, blurred, toned, noisy and JPEG-compressed output, with a strip of the register at each stage'),
    pointers: [{ at: [8, 42], label: 'display screenshot', to: [3, 8] }, { at: [25, 42], label: 'warped to the camera’s aspect', to: [17, 96] }, { at: [42, 42], label: 'field blur', to: [36, 8] }, { at: [58, 42], label: 'gain, tone curves, vignetting', to: [50, 96] }, { at: [75, 42], label: 'sensor noise', to: [70, 8] }, { at: [92, 42], label: 'JPEG at 55 %', to: [96, 96] }],
  },
  {
    id: 'sg-overlay', eyebrow: 'SimGen2', title: 'Real over synthetic',
    body: <p>SimGen2 generates an image in about 2 s, almost 5× faster than capturing with the physical reader. Used in parallel with the reader, it produced tens of thousands of unique labelled images, which trained the DrumNet Simulated model. Here a real capture tinted magenta is overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured.</p>,
    visual: img('simgen2-overlay.webp', 'A real capture tinted magenta overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured'),
    pointers: [{ at: [20, 14], label: 'real only: the LED glare', to: [40, 6] }, { at: [60, 44], label: 'match: uncoloured', to: [78, 30] }, { at: [92, 50], label: 'synthetic only', side: 'l', to: [80, 72] }],
  },
  {
    id: 'sg-pairs', eyebrow: 'SimGen2', title: 'Real and synthetic pairs',
    body: <p>Pairs of real captures and their SimGen2 versions, across several meter designs: real on the left, SimGen2 on the right.</p>,
    visual: pair('simgen2-pairs-a.webp', 'Pairs of real captures and their SimGen2 versions, several meter designs', 'simgen2-pairs-b.webp', 'More real and synthetic pairs'),
  },
];

/* ── Chapter IV: the agents ── */
const AGENTS: Array<[string, string, string, boolean?]> = [
  ['DrumNet Standard', 'OCR Standard agent · Fable 5.1, then Opus 5.5', 'Trains only from images taken by Prototype V1, starting from the base DrumNet V1 network.', true],
  ['DrumNet Simulated', 'OCR Simulated agent · Fable 5.1, then Opus 5.5', 'Trains only from images generated by SimGen2, fully computer-generated, also from the base DrumNet V1.'],
  ['DrumNet Premade', 'OCR Premade agent · Fable 5.1, then Opus 5.5', 'Trains from every dataset: Prototype V1 captures, SimGen2, and public water meter datasets (Badger55, Jomjol-digits). Base model derived from AI-on-the-edge-device’s dig-cont model.', true],
  ['WindowNet', 'OCR windownet agent · Opus 5.5', 'Trains the spotter (DetNet) and refiner (RefNet) used to locate the drum window.'],
  ['Sim 2 Genius', 'Opus 5.5', 'Operates, maintains and improves SimGen2.'],
  ['OCR Coordinator', 'Fable 5.1', 'Coordinates and talks to all the other agents to manage the project.'],
];
const AgentsList = ({ dim }: { dim?: boolean }) => (
  <div className="ws-agents-v">{AGENTS.map(([t, who, d, halted]) => <div key={t} className={dim && halted ? 'dim' : undefined}><b>{t}</b><i>{who}</i><span>{d}</span></div>)}</div>
);
const AGENTIC: Frame[] = [
  {
    id: 'ag-loop', eyebrow: 'Agentic workflow', title: 'The self-improvement loop',
    body: <p>LLM-based AI agents were used extensively in this project. Agents were tasked to improve the full vision pipeline running on the ESP32-S3 with the target of 99 % meter accuracy. The core loop is developing a hypothesis, planning the execution, gathering training data, retraining, fine-tuning or RL-ing the model, testing for improvements or regressions, then reporting the findings.</p>,
    visual: <div className="ws-loop-v">{['Hypothesis', 'Execution planning', 'Gathering training dataset', 'Re-train, fine-tune or RL the model', 'Test for improvement or regression', 'Report findings, then a new hypothesis'].map((s, i) => <div key={s}><i>{i + 1}</i><span>{s}</span></div>)}</div>,
  },
  {
    id: 'ag-six', eyebrow: 'Agentic workflow', title: 'Six agents, three of them on DrumNet',
    body: <p>This framework was applied to three agents, each working on a variant of DrumNet, with three more agents on other jobs.</p>,
    visual: <AgentsList />,
  },
  {
    id: 'ag-resources', eyebrow: 'Agentic workflow', title: 'Shared resources and a scheduler',
    body: <p>With six agents running simultaneously, they would constantly compete for resources, so the scheduler was developed. It lets the agents book timeslots on the shared resources: my server (CPU compute) and laptop (GPU compute), collectively the compute resource used for training, and the Jetson rig, which lets an agent flash and interact with Prototype V1 while controlling the display it is pointed at through MeterSim.</p>,
    visual: img('agents-resources-sketch.webp', 'A sketch of the three DrumNet agents sharing the Jetson rig and compute through two schedulers, with the coordinator, Sim2 Genius and the window detector model alongside', 'plate'),
    pointers: [{ at: [20, 22], label: 'the Jetson rig', to: [8, 48] }, { at: [47, 27], label: 'scheduler', to: [38, 50] }, { at: [78, 25], label: 'SimGen2', to: [66, 48] }, { at: [22, 68], label: 'laptop GPU and server CPU', to: [8, 90] }, { at: [70, 65], label: 'the coordinator', to: [56, 92] }, { at: [86, 78], label: 'window detector', side: 'l', to: [74, 92] }],
  },
  {
    id: 'ag-bookings', eyebrow: 'Agentic workflow', title: 'Bookings against a budget',
    body: <p>The scheduler timeline for the compute resources: the filled area is booked threads against the 20-thread budget, the red line is booked memory against the 9 GB budget. The laptop GPU takes one job at a time.</p>,
    visual: img('scheduler-compute.webp', 'The scheduler timeline for the compute resources, with booked blocks per agent'),
    pointers: [{ at: [34, 42], label: 'bookings per agent', to: [54, 30] }, { at: [34, 60], label: 'booked load against the budget', to: [54, 68] }, { at: [34, 86], label: 'laptop GPU, one job at a time', to: [54, 94] }],
  },
  {
    id: 'ag-winner', eyebrow: 'Agentic workflow', title: 'Simulated wins, and becomes DrumNet',
    body: <p>After running for about 1.5 weeks, Standard and Premade displayed lacklustre performance, so their development was halted and all resources were reallocated to DrumNet Simulated. It was then allowed to train on every dataset, including those from the rig and the external catalogue, and was renamed DrumNet. The current build, V10, is the highest performing network of the DrumNet series.</p>,
    visual: <AgentsList dim />,
  },
  {
    id: 'ag-tailscale', eyebrow: 'Agentic workflow', title: 'Heartbeats over Tailscale, managed in T3 Code',
    body: (
      <>
        <p>The agents ran 24/7 through a &ldquo;heartbeat&rdquo;, a simple script that wakes an agent after a set time, or at a set time, to continue working. The agents were instructed to act independently and make their own decisions, so very little human involvement was required.</p>
        <p>Tailscale was at the heart of the networking: a personal peer-to-peer VPN that let the agents running on my server at home communicate with and control the Jetson rig located in school, over SSH. T3 Code, an open-source meta-harness for Claude Code and Codex, managed the agents.</p>
      </>
    ),
    visual: img('t3-tailscale.webp', 'Diagram of T3 Code connecting the client device, the home server running the agents, the laptop GPU and the Jetson rig at school over Tailscale', 'plate'),
    pointers: [{ at: [14, 54], label: 'the Jetson rig, at school', to: [8, 86] }, { at: [55, 14], label: 'T3 Code', to: [36, 6] }, { at: [55, 34], label: 'Tailscale', to: [36, 46] }, { at: [82, 14], label: 'my devices', side: 'l', to: [70, 4] }, { at: [78, 62], label: 'the server at home, running the agents', side: 'l', to: [60, 92] }],
  },
];

/* ── Chapter VII: the processor ── */
const MCU_ROWS: Array<[string, string, string, string]> = [
  ['CPU architecture', 'Dual-core 32-bit RISC-V', 'Dual-core 32-bit Xtensa LX7', 'Dual-core 32-bit RISC-V'],
  ['Max frequency', '320 MHz', '240 MHz', '400 MHz'],
  ['AI instruction accel', 'Accelerator instruction set', 'PIE instruction extension', 'Custom AI and DSP extensions (XespV)'],
  ['GPIO', '60', '45', '55'],
  ['LCD / camera', 'RGB · I80 · DVP', 'RGB · I80 · DVP', 'RGB · I80 · DVP'],
  ['JPEG codec', 'Supported', 'Not supported', 'Supported'],
  ['Security', 'Secure Boot, crypto accelerators, SDC, XTS_AES, TRNG, Key Manager, Glitch Detector, DPA, APM, TEE', 'Secure Boot, Flash Encryption, crypto accelerators (SHA, AES, RSA, HMAC, RSA_DS, RNG)', 'Secure Boot, OTP, crypto and security components, Key Manager, PMS'],
  ['Light-sleep current', '50 µA', '240 µA', '75 µA'],
  ['Deep-sleep current', '12 µA', '7 µA', '12 µA'],
  ['Low-power coprocessor', 'Not supported', 'Supported', 'Supported'],
];
const McuTable = ({ rows }: { rows?: string[] }) => (
  <div className="ws-tablewrap">
    <table className="ws-table">
      <thead><tr><th>Feature</th><th>ESP32-S31</th><th className="hl">ESP32-S3</th><th>ESP32-P4</th></tr></thead>
      <tbody>
        {MCU_ROWS.map((r) => <tr key={r[0]} className={rows?.includes(r[0]) ? 'hl' : undefined}><th scope="row">{r[0]}</th><td>{r[1]}</td><td className="hl">{r[2]}</td><td>{r[3]}</td></tr>)}
      </tbody>
    </table>
  </div>
);
const MCU: Frame[] = [
  {
    id: 'mcu-pick', eyebrow: 'Processor (MCU)', title: 'The ESP32-S3, with 8 MB of PSRAM', wide: true,
    body: <p>After screening multiple processors, the ESP32-S3 with 8 MB of PSRAM came out as one of the more balanced options; I chose it primarily for ease of access and my general comfort with Espressif&rsquo;s chips. The must-haves were Digital Video Port (DVP) support (non-negotiable, since the OV2640 uses it), hardware-accelerated vector or matrix instructions (non-negotiable, vital for running neural networks on a limited energy budget), low cost and low power.</p>,
    visual: <McuTable />,
  },
  {
    id: 'mcu-three', eyebrow: 'Processor (MCU)', title: 'Three Espressif chips fit', wide: true,
    body: <p>The P4 is the most powerful, targeted at multimedia and HMI-heavy compute, much too overkill. The S31 looks to be the second-best contender, with welcome security upgrades like glitch detection and APM that help against physical tampering, 60 GPIOs, and a newer, faster core; but its deep-sleep current is 12 µA against the S3&rsquo;s 7 µA, almost double. The S3 is the most mature platform, battle-tested for nearly 6 years with plenty of community support, while the P4&rsquo;s current revision (v3.x) was only released in May 2026 and the S31 only entered mass production in July 2026.</p>,
    visual: <McuTable rows={['Deep-sleep current', 'Security', 'LCD / camera', 'AI instruction accel']} />,
  },
  {
    id: 'mcu-alif', eyebrow: 'Processor (MCU)', title: 'The alternative costs 5.5 to 8.1 times more',
    body: <p>Espressif does not match the reliability and security reputation of STMicroelectronics, Nordic or NXP. The next best non-Espressif option would be the Alif Ensemble E3 series, but it is 5.5 to 8.1 times more expensive depending on quantity. The ESP32-S3 is purpose-built for IoT edge-AI applications like this, which is why I plan to continue using it.</p>,
    visual: (
      <div className="ws-tablewrap">
        <table className="ws-table">
          <caption>Unit price of the ESP32-S3R8 vs the Alif Ensemble E3 by order quantity (USD)</caption>
          <thead><tr><th>Quantity</th><th className="hl">ESP32-S3R8 (LCSC)</th><th>Alif E3 (Mouser)</th><th>E3 ÷ S3</th></tr></thead>
          <tbody>
            {[['1', '$3.02', '$16.72', '5.5×'], ['100', '$2.19', '$15.82', '7.2×'], ['~1,000', '$2.06 (1,000+)', '$16.78 (1,500 reel)', '8.1×']].map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td className="hl">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
          </tbody>
        </table>
      </div>
    ),
  },
];

/* ── Chapter VIII: the battery ── */
const BATT_ROWS = [
  ['Li-SOCl2 bobbin', 'Saft LS33600, Tadiran TL-5930, EVE ER34615', '3.6', '~610 · ~1,180', '<1 %/yr', 'Low (D cell: 250 mA continuous, 400 mA for 0.1 s)', '−60 to 85 °C', 'Water/gas meters, asset trackers, 10 to 20 yr sensors', 'Passivation and voltage delay after idle periods, poor at high current, cannot be charged', '~$8 to 12 (EVE); ~$19 to 30 (Saft/Tadiran D)'],
  ['Li-SOCl2 spiral', 'Saft LSH20', '3.6', '~490 · ~930', '~3 %/yr', 'High (1.8 A continuous, 4 A pulse)', '−60 to 85 °C', 'Devices with motors, valves, GSM/NB-IoT bursts', 'Higher self-discharge, lower capacity than bobbin', '~$28 to 42 (D)'],
  ['Li-SOCl2 + hybrid layer capacitor', 'Tadiran PulsesPlus', '3.6', 'Same as bobbin', '<1 %/yr', 'Very high (HLC: 2 A pulses)', '−40 to 85 °C', 'Cellular/LoRa meters needing long life plus big TX pulses', 'Cost, larger pack, fewer suppliers', '~$20 to 40 (AA/C); ~$40 to 60 (D)'],
  ['Li-MnO2 cylindrical', 'CR123A, Saft LM33600', '3.0', '~270 · ~600 (CR123A)', '~1 to 3 %/yr', 'High (CR123A: 1.5 A continuous)', '−40 to 70 °C', 'Smoke alarms, smart locks, security sensors', 'Lower capacity than Li-SOCl2', '~$2 to 6 (CR123A); ~$30+ (LM33600)'],
  ['Li-MnO2 coin', 'CR2032, CR2450', '3.0', '~225 (CR2032)', '~1 %/yr', 'Very low (tens of mA; needs a bulk cap for BLE)', '−30 to 70 °C', 'BLE beacons, tags, RTC backup', 'High internal resistance, capacity falls sharply under pulses', '~$0.30 to 1.50'],
  ['Li-FeS2', 'Energizer L91 (AA)', '1.5', '~300 to 330 · ~550 to 600', '~1 %/yr (20-yr shelf rating)', 'High (2.5 A continuous)', '−40 to 60 °C', 'Drop-in AA replacement, field-swappable sensors', '1.8 V fresh, can over-volt parts designed for alkaline', '~$1.50 to 3'],
  ['Alkaline', 'Energizer E91 (AA)', '1.5', '~150 to 170 · ~450 (low drain)', '~2 to 3 %/yr', 'Moderate, capacity collapses at high drain', '−18 to 55 °C', 'Consumer gadgets, remotes, low-cost sensors', 'Leakage, poor in heat and cold, sloping voltage', '~$0.30 to 1'],
  ['Zinc-air', 'Hearing-aid cells, some trackers', '1.4', '~400+', 'Low while sealed, dries out within weeks once opened', 'Low', '~0 to 50 °C', 'Short-life wearables, hearing aids', 'Needs airflow, humidity-sensitive, short life once activated', '~$0.30 to 0.80'],
  ['Silver oxide', 'SR626, SR44', '1.55', '~130', '~5 to 10 %/yr', 'Low', '−10 to 60 °C', 'Watches, small medical sensors', 'Tiny capacity, expensive', '~$0.50 to 3'],
];
const BATTERY: Frame[] = [
  {
    id: 'batt', eyebrow: 'Battery technology', title: 'Li-SOCl2: bobbin or spiral', wide: true,
    body: (
      <>
        <p>The two most important factors are the ability to adapt to a wide range of temperatures and weather conditions, and a low self-discharge rate: the readers could sit in a cold, dark, damp utility closet or in extreme heat under direct sunlight, and they are in deep sleep for most of a ~2-year life. Lithium coin cells are the first choice for ultra-long-life IoT, but they do not have nearly enough capacity to run the OCR model, LoRa and the camera for 2 years. That is why I decided on Li-SOCl2 cells (bobbin or spiral not yet decided); they are widely used in industrial IoT where conditions vary drastically, and self-discharge only ~1 to 3 % a year.</p>
        <p className="ws-note">Prices are approximate single-cell retail prices from US battery distributors (October 2026); volume pricing is typically 10 to 35 % lower.</p>
      </>
    ),
    visual: (
      <div className="ws-tablewrap">
        <table className="ws-table ws-battery">
          <thead><tr><th>Chemistry</th><th>Example cell</th><th>V</th><th>Wh/kg · Wh/L</th><th>Self-discharge</th><th>Pulse current</th><th>Temp</th><th>Typical IoT use</th><th>Watch out for</th><th>Price (USD/cell)</th></tr></thead>
          <tbody>
            {BATT_ROWS.map((row, k) => <tr key={row[0]} className={k < 2 ? 'hl' : 'dim'}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}
          </tbody>
        </table>
      </div>
    ),
  },
];

/* ── Chapter IX: power ── */
const Zoom = ({ src, alt, res, time, ox, oy, zoom = 2.6 }: { src: string; alt: string; res: string; time: string; ox: number; oy: number; zoom?: number }) => (
  <div className="ws-zoom" style={{ ['--ox' as string]: `${ox}%`, ['--oy' as string]: `${oy}%`, ['--zoom' as string]: zoom }} data-no-zoom>
    <img src={I + src} alt={alt} loading="lazy" decoding="async" />
    <div className="ws-zoom-cap"><b>{res}</b><span>{time}</span></div>
  </div>
);
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
    id: 'pw-1600', eyebrow: 'Capture modes · 1600 × 1200', title: 'Full resolution: 350 ms to capture',
    body: <p>Scroll to zoom into the drums. At 1600 × 1200 every pixel of the sensor is read out, and the capture takes 350 ms; the less time the camera stays on, the less energy it consumes.</p>,
    visual: <Zoom src="mode-1600-full.webp" alt="1600 × 1200 capture of the meter" res="1600 × 1200" time="350 ms capture time" ox={57} oy={41} zoom={2.8} />,
  },
  {
    id: 'pw-800', eyebrow: 'Capture modes · 800 × 600', title: 'SVGA: 89 ms, and the chosen mode',
    body: <p>Based on my testing, SVGA yields the best balance of quality and speed, and 800 × 600 means the network processes 4× less information than 1600 × 1200. No proper tests were conducted to back up the accuracy claim, although accuracy did not suffer greatly in my experience.</p>,
    visual: <Zoom src="mode-800-crop.webp" alt="800 × 600 capture of the meter" res="800 × 600" time="89 ms capture time" ox={58} oy={41} zoom={2.8} />,
  },
  {
    id: 'pw-400', eyebrow: 'Capture modes · 400 × 296', title: 'CIF: 61 ms, too little detail',
    body: <p>At 400 × 296 the capture takes 61 ms, but the drums are left with too few pixels to read reliably.</p>,
    visual: <Zoom src="mode-400-crop.webp" alt="400 × 296 capture of the meter" res="400 × 296" time="61 ms capture time" ox={57} oy={40} zoom={2.8} />,
  },
  {
    id: 'pw-pwm', eyebrow: 'Power optimisation · software', title: 'PWM dimming on the LEDs',
    body: <p>I had initially dismissed PWM dimming because the OV2640 uses a rolling shutter, which could capture between the off-cycles of the PWM signal and show banding. But the OV2640 did not suffer from any banding, so I run the LEDs at 20 kHz with 50 % duty cycle. This saves some fraction of power and adds brightness control.</p>,
    visual: pair('led-banding.webp', 'A capture showing horizontal banding across the meter face', 'led-no-banding.webp', 'A capture with PWM-dimmed LEDs and no banding'),
    pointers: [{ at: [25, 30], label: 'banding', to: [12, 10] }, { at: [75, 30], label: 'PWM-dimmed, no banding', side: 'l', to: [88, 10] }],
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

/* ── Chapter XI: Prototype V2, the circuits and the enclosure ── */
const V2: Frame[] = [
  {
    id: 'v2-intro', eyebrow: 'Prototype V2', title: 'A shrunken-down Prototype V1',
    body: <p>Prototype V2 is a shrunken-down version of Prototype V1. It fits in tighter spaces and let me explore smaller components like the Wio-SX1262 LoRa module from Seeed Studio. It has built-in battery management, power circuitry for the camera and fan, PWM-dimmable LED lights and a LoRa module. Scroll through the board, component by component, rendered from the real KiCad and CAD files.</p>,
    visual: img('pcb-3d-top.webp', '3D render of the top of the Prototype V2 board from KiCad'),
    pointers: [{ at: [38, 20], label: 'ESP32-S3 WROOM1 N16R8', to: [62, 8] }, { at: [60, 70], label: 'battery management and power', to: [76, 56] }, { at: [52, 88], label: 'USB-C', to: [30, 94] }, { at: [86, 90], label: 'camera connector', side: 'l', to: [66, 96] }],
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
    pointers: [{ at: [37, 46], label: 'Prototype V2', to: [20, 20] }, { at: [62, 46], label: 'an ESP32-S3 dev board', to: [78, 20] }],
  },
];
const CIRCUITS: Array<{ k: string; t: string; d: string }> = [
  { k: '3v3', t: '3.3 V buck-boost circuit', d: 'The schematic was mostly copied from the manufacturer’s reference design. A buck-boost converter was used for the 3.3 V rail because the battery voltage can sit above or below 3.3 V depending on its state of charge.' },
  { k: '5v', t: '5 V boost circuit', d: 'The schematic was also mostly copied from the manufacturer’s reference design. A boost converter was used for the fan, which draws significant power and benefits from the boost converter’s efficiency.' },
  { k: 'ldo', t: '1.5 V and 2.8 V LDO regulator circuit', d: 'Chosen for simplicity and because they produce no noise as compared to buck converters, as they power the camera.' },
  { k: 'charge', t: 'LiPo battery charging circuit', d: 'Handles power switching from USB and battery; its output feeds into the 3.3 V buck-boost chip. It manages charging of the built-in LiPo battery.' },
  { k: 'protect', t: 'Battery protection and monitoring circuit', d: 'The BQ29700 protects the LiPo cell from over-charge, over-discharge and over-current; the MAX17048 fuel gauge reports its state of charge over I²C.' },
];
const PERIPHERALS: Array<{ k: string; t: string; d: string }> = [
  { k: 'mcu', t: 'ESP32-S3 MCU', d: 'The MCU controls all the peripherals on this board and runs the neural network.' },
  { k: 'usb', t: 'USB-C and ESD protection', d: 'Connected to the ESP32’s USB OTG interface; a diode array chip is added to protect against ESD.' },
  { k: 'limit', t: 'Limit switches', d: 'Mounted to the edges of the cap to detect improper contact with the adapter.' },
  { k: 'fan', t: 'Fan control circuit', d: 'Uses an N-channel MOSFET to control the fan, powered from the 5 V boost circuit.' },
  { k: 'led', t: 'PWM-controlled LEDs', d: 'They are flat-top LEDs, unlike the ones portrayed in the visualisation.' },
  { k: 'humid', t: 'I²C humidity and temperature sensor', d: 'Used to measure the environmental condition around the reader; skips a read in bad conditions.' },
  { k: 'lora', t: 'LoRa module', d: 'Low power, long range communication that allows the reader to run for years on a battery.' },
  { k: 'camera', t: '24-pin connector for DVP cameras', d: 'Allows the camera to be connected to the board.' },
];
const sch = (k: string, t: string) => (
  <div className="ws-sch">
    <img src={`${I}sch-${k}.webp`} alt={`${t}, schematic`} loading="lazy" decoding="async" />
    <img src={`${I}loc-${k}.webp`} alt={`${t}, location on the board`} loading="lazy" decoding="async" className="loc" />
  </div>
);
const CIRCUIT_FRAMES: Frame[] = [
  {
    id: 'cx-bom', eyebrow: 'Circuits and layout', title: 'Planning the parts', wide: true,
    body: <p>I designed the board in KiCad, starting with the DC-DC conversion: 5 V for the deprecated fan, 3.3 V for the MCU, LoRa module and camera, then 1.5 V and 2.8 V for the camera itself, and finally the battery charging, monitoring and protection circuitry. I sourced the components from DigiKey and sent the PCB to JLCPCB for manufacturing; it is a 4-layer board.</p>,
    visual: (
      <div className="ws-bom-v">
        <div><b>Primary components</b><ul><li>ESP32-S3 WROOM1 N16R8, the chosen MCU</li><li>Wio-SX1262 all-in-one LoRa module from Seeed Studio (SPI)</li><li>SHT-40 humidity and temperature sensor (I²C)</li></ul></div>
        <div><b>LiPo battery protection and charging</b><ul><li>BQ24074RGTR battery charging IC</li><li>BQ29700DSER battery protection IC</li><li>MAX17048G+T10 battery monitoring IC (I²C)</li></ul></div>
        <div><b>Other active components</b><ul><li>MIC5365-2.8, 2.8 V linear LDO regulator (camera)</li><li>TPS7A0315PDBVR, 1.5 V linear LDO regulator (camera)</li><li>TPS63021DSJR, 3.3 V buck-boost converter (general)</li><li>TPS61023DRLR, 5 V boost converter (fan, deprecated)</li><li>AO3400A N-channel MOSFET</li><li>USBLC6-2SC6Y USB ESD protection</li></ul></div>
        <div><b>Passive components</b><ul><li>Resistors from 22 R to 732 K, 0402 and 0603</li><li>Capacitors from 0.1 µF to 22 µF, 0402 and 0603</li><li>Inductors 1 µH and 1.5 µH, 1210</li><li>Push buttons and slide switches, SS14 Schottky diode (for the deprecated fan), flat-top LEDs, USB-C connector</li></ul></div>
      </div>
    ),
  },
  {
    id: 'cx-power', eyebrow: 'Power circuit', title: 'All the power circuits, 40 % of the board',
    body: <p>All power circuits combined. They take up about 40 % of board space. Each circuit follows: its schematic on the left and where it sits on the board on the right.</p>,
    visual: sch('power-all', 'Full power circuitry'),
  },
  ...CIRCUITS.map((c): Frame => ({ id: `cx-${c.k}`, eyebrow: 'Power circuit', title: c.t, body: <p>{c.d}</p>, visual: sch(c.k, c.t) })),
  ...PERIPHERALS.map((c): Frame => ({ id: `px-${c.k}`, eyebrow: 'Peripherals and MCU', title: c.t, body: <p>{c.d}</p>, visual: sch(c.k, c.t) })),
  {
    id: 'cx-schematic', eyebrow: 'PCB layout and manufacturing', title: 'The full schematic', wide: true,
    body: <p>Full board schematic from KiCad. Click it to zoom.</p>,
    visual: img('kicad-schematic.webp', 'The full board schematic from KiCad', 'art-diagram light'),
  },
  {
    id: 'cx-layout', eyebrow: 'PCB layout and manufacturing', title: 'Four layers, two faces',
    body: <p>The PCB layout in KiCad with both copper layers, and 3D renders of the top and bottom of the board.</p>,
    visual: (
      <div className="ws-trio-v">
        <figure>{img('pcb-layout.webp', 'The PCB layout in KiCad, both copper layers')}<figcaption>layout</figcaption></figure>
        <figure>{img('pcb-3d-top.webp', '3D render of the top of the board from KiCad')}<figcaption>top</figcaption></figure>
        <figure>{img('pcb-3d-bottom.webp', '3D render of the bottom of the board from KiCad')}<figcaption>bottom</figcaption></figure>
      </div>
    ),
  },
];
const ENCLOSURE: Frame[] = [
  {
    id: 'en-ref', eyebrow: 'Interior enclosure', title: 'Designed around the real board',
    body: <p>The interior enclosure houses the PCB and batteries of Prototype V2. I exported the 3D file from KiCad into Onshape as the reference to design the enclosure around, and quickly modelled the exact shape and size of the camera for better accuracy. The enclosure adopts a toolless design: no screws or tools are needed to assemble or disassemble it.</p>,
    visual: img('enc-reference.webp', 'The KiCad 3D model of the board with the camera modelled on, used as the reference in Onshape', 'art-diagram light'),
    pointers: [{ at: [30, 24], label: 'the KiCad export', to: [14, 8] }, { at: [46, 66], label: 'the camera, modelled by hand', to: [34, 90] }, { at: [78, 52], label: 'USB-C', to: [90, 76] }],
  },
  {
    id: 'en-clips', eyebrow: 'Interior enclosure', title: 'Side clips',
    body: <p>The side clips allow the top and bottom halves of the enclosure to snap on with no screws needed.</p>,
    visual: img('enc-clips.webp', 'A section through the enclosure showing the side clips holding the two halves'),
    pointers: [{ at: [23, 48], label: 'clip', to: [10, 20] }, { at: [88, 54], label: 'clip', side: 'l', to: [78, 20] }],
  },
  {
    id: 'en-stopper', eyebrow: 'Interior enclosure', title: 'Lateral movement stopper',
    body: <p>Grooves are cut out from the bottom half, where pins from above are inset, to prevent lateral slide.</p>,
    visual: pair('enc-stopper-a.webp', 'The bottom half of the enclosure with grooves cut for the pins', 'enc-stopper-b.webp', 'The top half with pins that sit in the grooves', 'plate'),
  },
  {
    id: 'en-holder', eyebrow: 'Interior enclosure', title: 'PCB holder',
    body: <p>Platforms on the bottom of the case and posts from above hold the PCB to the case without any screws.</p>,
    visual: pair('enc-holder-a.webp', 'Platforms on the bottom of the case that carry the PCB', 'enc-holder-b.webp', 'Posts from the top half that press the PCB down', 'plate'),
  },
  {
    id: 'en-antenna', eyebrow: 'Interior enclosure', title: 'LoRa antenna cutout',
    body: <p>A special hole lets the LoRa IPEX cable interface with the LoRa transceiver on the board.</p>,
    visual: img('enc-antenna.webp', 'The LoRa antenna cutout in the enclosure CAD', 'art-diagram light'),
  },
  {
    id: 'en-final', eyebrow: 'Interior enclosure', title: 'Fit and finish, and one cut',
    body: <p>The fit and finish of the final enclosure was great, but I had to cut a hole to fit the flipped camera from the incorrect pin layout of the PCB assembly stage. Earlier printed revisions, V1 to V3, are on the right.</p>,
    visual: pair('enc-final.webp', 'The final printed interior enclosure with the board inside', 'enc-revisions.webp', 'Earlier printed revisions of the enclosure, labelled V1 to V3'),
    pointers: [{ at: [26, 44], label: 'the OV2640', to: [12, 20] }, { at: [27, 58], label: 'cut for the flipped camera', to: [12, 80] }],
  },
  {
    id: 'en-adapter', eyebrow: 'Exterior enclosure', title: 'The meter adapter',
    body: <p>I edited my original water meter adapter so the camera sits about 4 cm away from the meter. The adapter is two parts. The bottom half mounts against the meter.</p>,
    visual: pair('adapter-top.webp', 'The meter adapter CAD model, top view', 'adapter-bottom.webp', 'The meter adapter CAD model, bottom view, with the reader inside', 'plate'),
    pointers: [{ at: [75, 44], label: 'the reader inside', side: 'l', to: [60, 14] }],
  },
  {
    id: 'en-distance', eyebrow: 'Exterior enclosure', title: 'About 4 cm from the dial',
    body: <p>Distance from the camera lens to the meter face: about 4 cm, the focus distance chosen in the camera test.</p>,
    visual: img('adapter-distance.webp', 'A CAD section through the adapter showing the camera about 4 cm from the meter face', 'art-diagram light'),
    pointers: [{ at: [56, 30], label: 'the camera', to: [34, 14] }, { at: [50, 72], label: 'the meter face sits here', to: [22, 86] }],
  },
  {
    id: 'en-cuts', eyebrow: 'Exterior enclosure', title: 'Room for the lid tabs',
    body: <p>While modelling, I had forgotten the tabs on the side of the meter that lock the lid in place, so the bottom half could not sit flush against the meter face. Luckily it was printed with the layer lines parallel to the meter face, so a few simple cuts with side cutters made room for the tabs.</p>,
    visual: pair('adapter-cut-a.webp', 'The bottom half of the adapter with cuts made for the meter lid tabs', 'adapter-cut-b.webp', 'The adapter sitting flush on the meter after the cuts'),
  },
  {
    id: 'en-done', eyebrow: 'Exterior enclosure', title: 'The completed adapter',
    body: <p>The top half was designed with a much larger diameter than the bottom half. This creates more space to adjust Prototype V2&rsquo;s position for a better alignment to the meter barrels, and lets me reuse the top half with other meters by redesigning only a bottom half for each new meter.</p>,
    visual: pair('adapter-done-a.webp', 'The completed adapter with the reader fitted, seen from above', 'adapter-done-b.webp', 'The completed adapter mounted on the meter'),
    pointers: [{ at: [36, 44], label: 'the reader in the top half', to: [14, 14] }, { at: [68, 36], label: 'the top half, on the meter', side: 'l', to: [86, 10] }],
  },
];

/* ── Chapter XIV: conclusion ── */
const CONCLUSION: Frame[] = [
  {
    id: 'cc-energy', eyebrow: 'Conclusion', title: 'Energy use and longevity',
    body: <p>Due to time constraints, the project stops as it currently is; many issues still need to be addressed before this could be a viable solution. The energy use of this meter has not been measured or tested for its rated 2-year life cycle. As Prototype V2 stands, I do not think that rating is possible. A third revision will be required to implement more energy-saving components before it is reasonable to start monitoring energy consumption. The current firmware is close to my targeted level of efficiency and will need less work to reach an acceptable level.</p>,
    visual: (
      <div className="ws-bignum">
        <div><b>2 yr</b><span>the target life</span><small>on one set of Li-SOCl2 cells</small></div>
        <div><b className="red">V3</b><span>needed first</span><small>energy use not yet measured on Prototype V2</small></div>
      </div>
    ),
  },
  {
    id: 'cc-accuracy', eyebrow: 'Conclusion', title: 'WindowNet and accuracy',
    body: <p>The 56 % reading accuracy of DrumNet V10 is a far cry from the targeted 99 %. The primary bottleneck is WindowNet: most erroneous readings were caused by its inability to find the correct ROI, so the readers received bad data. The DrumNet readers also show signs of under-training; showing them a meter they have not seen before yields a low confidence. They are trained on a moderately large dataset, but it was dominated by the 9 meters SimGen2 could generate, so the variation was small. A more diverse and larger dataset could help both WindowNet and the readers.</p>,
    visual: (
      <div className="ws-bignum">
        <div><b className="red">56 %</b><span>full pipeline</span><small>808 of 1,440 readings correct</small></div>
        <div><b>99 %</b><span>the target</span><small>the whole reading correct</small></div>
        <div><b>93.2 %</b><span>DrumNet alone</span><small>pooled test set, WindowNet left out</small></div>
      </div>
    ),
  },
  {
    id: 'cc-shell', eyebrow: 'Conclusion', title: 'Shell and mounting',
    body: <p>The current shell is much too bulky for a realistic deployment; a fundamental redesign is needed for the shell, PCB and mount. The camera is the primary cause of the high Z-height, so a shorter camera that is better at macro imaging needs to be selected. Weather sealing will also need different materials and designs.</p>,
    visual: img('adapter-done-b.webp', 'The completed adapter mounted on the meter, next to a breadboard'),
    pointers: [{ at: [34, 34], label: 'the Z-height the camera forces', to: [12, 12] }, { at: [62, 34], label: 'the meter', to: [80, 14] }],
  },
  {
    id: 'cc-thanks', eyebrow: 'Closing remarks', title: 'A first attempt at many things',
    body: <p>Much of this project was my first attempt at something new. I am not exactly satisfied with the outcome, but I am still proud of the knowledge and experience I have gained. I am grateful for the rare opportunity of time, resources and support to learn and experiment the way I do; without it this project would not have been possible. Thank you to Mr Alex Oh (NYP) for his guidance, expertise and encouragement, to Mr Soh (NYP), without whom I would not have got the camera working, and to Mr Lee Chang Fatt (NYP) for the LoRaWAN gateway.</p>,
    visual: img('hero.webp', 'The water meter register as the reader sees it: 0092.07 cubic metres'),
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

      <Story id="brief" chapter={NUM.brief} title="Design brief" frames={BRIEF} />
      <Story id="metersim" chapter={NUM.metersim} title="MeterSim" frames={METERSIM} per={0.85} />
      <Story id="simgen2" chapter={NUM.simgen2} title="SimGen2" frames={SIMGEN2} />
      <Story id="agents" chapter={NUM.agents} title="Agentic workflow" frames={AGENTIC} per={0.85} />
      <DrumNetStory chapter={NUM.drumnet} />
      <FirmwareStory chapter={NUM.firmware} />
      <Story id="mcu" chapter={NUM.mcu} title="Processor" frames={MCU} />
      <Story id="battery" chapter={NUM.battery} title="Battery technology" frames={BATTERY} per={1.1} />
      <Story id="power" chapter={NUM.power} title="Power optimisation" frames={POWER} per={0.9} />
      <CameraStory chapter={NUM.camera} />

      {/* Chapter XI: Prototype V2, then the exported 3D chapter, then its circuits and enclosure */}
      <Story id="v2" chapter={NUM.v2} title="Prototype V2" frames={V2} />
      <section id="pcb" className="ws-pcb" aria-label="Prototype V2: PCB and enclosure in 3D">
        <WaterslopChapter />
      </section>
      <Story id="circuits" chapter={NUM.v2} title="Circuits and layout" frames={CIRCUIT_FRAMES} per={0.75} />
      <Story id="enclosure" chapter={NUM.v2} title="Enclosure" frames={ENCLOSURE} per={0.8} />

      <CalibrationStory chapter={NUM.calibration} />
      <ConfigKingStory chapter={NUM.configking} />
      <Story id="conclusion" chapter={NUM.conclusion} title="Conclusion" frames={CONCLUSION} />

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
