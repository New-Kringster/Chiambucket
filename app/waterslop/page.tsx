import type { Metadata } from 'next';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import WaterslopChapter, { WaterslopChapterStyle } from './WaterslopChapter';
import { Cover, Page, type Frame } from './Story';
import DrumNetStory from './DrumNetWalk';
import FirmwareChapter from './ReadCycle';
import CameraChapter from './FocusLab';
import ConfigKingChapter from './ConfigKingStory';
import PairCompare from './Compare';
import { LoopRing, AgentBadges } from './Agents';
import PageFx from './PageFx';
import Entrance from './Entrance';
import SkipToEnd from './SkipToEnd';
import PdfEmbed from '../../components/PdfEmbed';
import { IcRead, IcOut } from '../../components/Icons';
import AiMark from '../../components/AiMark';
import './waterslop.css';
import './article.css';
import './story.css';

const description =
  'OCR Reader is a low-cost, battery-powered water meter reader that reads the meter with a camera. A 693K-parameter network, DrumNet V10, runs entirely on its ESP32-S3 to read the drums, and the reading is sent over LoRaWAN. The article goes through MeterSim, SimGen2, the six agents that trained it, the network step by step, the firmware, the PCB in 3D, the enclosure and a ConfigKing simulator.';

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

/* The report, a PDF hosted with the site (public/downloadable; .vercelignore
   lets this one PDF through). It used to be a OneDrive embed, which stopped
   opening for anyone not signed in. */
const REPORT_PDF = '/downloadable/ocr-reader-report.pdf';

const I = '/images/waterslop/';
const img = (src: string, alt: string, cls?: string) => <img src={I + src} alt={alt} loading="lazy" decoding="async" className={cls} />;
const pair = (a: string, altA: string, b: string, altB: string, cls?: string) => (
  <div className={`ws-pair${cls ? ` ${cls}` : ''}`}>{img(a, altA)}{img(b, altB)}</div>
);

/* Chapters, in order. The PCB chapter is the exported 3D chapter plus two
   pages of its own; the roman numeral is shared. */
const CHAPTERS: Array<[string, string]> = [
  ['v2', 'PCB & enclosure'], ['drumnet', 'DrumNet'], ['configking', 'ConfigKing'],
  ['metersim', 'MeterSim'], ['simgen2', 'SimGen2'], ['agents', 'Agentic workflow'], ['firmware', 'Firmware'], ['power', 'Power optimisation'],
  ['camera', 'Camera choice'], ['proto', 'Prototype V2'], ['conclusion', 'Conclusion'], ['report', 'The report'],
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const NUM: Record<string, string> = Object.fromEntries(CHAPTERS.map(([id], i) => [id, ROMAN[i]]));

const Contents = () => (
  <nav className="ws-contents article-chapter-wrapper" aria-label="Chapters">
    {CHAPTERS.map(([id, label]) => <a key={id} href={`#${id}`}><span>{label}</span><i /><span>({NUM[id]})</span></a>)}
  </nav>
);

/* ── Chapter IV: MeterSim ── */
const METERSIM: Frame[] = [
  {
    id: 'ms-rig', eyebrow: 'MeterSim', title: 'A simulated meter for a real camera',
    body: <p>The first version of MeterSim was built alongside the firmware for Prototype V0.5, and the two work together, so MeterSim can control Prototype V0.5 automatically and generate labelled images for training the model. Claude wrote all of the software and firmware.</p>,
    visual: img('v05-rig-a.webp', 'Prototype V0.5, an ESP32-EYE, pointed at a tablet showing the MeterSim display'),
  },
  {
    id: 'ms-control', eyebrow: 'MeterSim', title: 'Built for agents to use',
    body: <p>MeterSim is built to be used by AI agents rather than people, so its control panel is mainly a way for people to watch the progress the agents make. The agents used MeterSim to build tests, collect data and check accuracy while they created DrumNet. It takes over the most tedious job in machine learning, gathering good data to train on, by generating that data, and because the meter is simulated, every image comes already labelled.</p>,
    visual: img('metersim-control.webp', 'The MeterSim control interface, with sliders for reading, drums, surface and weather effects'),
  },
  {
    id: 'ms-designs', eyebrow: 'MeterSim', title: 'Nine meter designs and nine presets',
    body: (
      <>
        <p>MeterSim has 9 meter designs, and each can be set up with a different barrel layout, such as 7 integer barrels and 1 decimal barrel (7+1). The integer barrels are usually white or black, while the decimal barrels are red.</p>
        <p>Common combinations of conditions are saved as presets: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty.</p>
      </>
    ),
    visual: pair('metersim-designs.webp', 'The nine meter designs available in MeterSim: Itron Weg 50, Elster brass, Itron Multimag Cyble, Bonega S/13 and T/13, Istameter II, an industrial generic, B Meters blue and a clean Elster brass', 'metersim-presets.webp', 'Nine preset conditions: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty'),
  },
  {
    id: 'ms-halfroll', eyebrow: 'MeterSim', title: 'Half-rolled drums',
    body: <p>It also simulates half-rolled barrels, so the model can learn to read a barrel that is partway between one digit and the next, and the agent sets these up automatically while it collects training data.</p>,
    visual: img('metersim-halfroll.webp', 'The MeterSim roll control, dragging individual drums part-way between digits'),
  },
  {
    id: 'ms-effects', eyebrow: 'MeterSim', title: 'Weather and surface conditions',
    body: <p>MeterSim also simulates the weather and the state of the meter&rsquo;s surface, to match how a meter left out in the elements may look, so the reader is trained to read in all of these conditions. The controls cover glare, smudge, shadow, lighting, blur, sensor noise, fog, dirt and scaling.</p>,
    visual: img('metersim-effects.webp', 'The surface and weather effect sliders in MeterSim, each with a preview thumbnail'),
  },
  {
    id: 'ms-eval', eyebrow: 'MeterSim', title: 'Unattended evaluation and data collection',
    body: (
      <>
        <p>MeterSim is a self-hosted web app with two endpoints, the control panel at /control and the display at /display. The reader joins the same local Wi-Fi network as MeterSim, which it uses to send its readings and images and to receive commands.</p>
        <p>To evaluate a model, MeterSim generates a random meter and conditions and shows them to the reader, which takes an image and reads it with the trained network. The result goes back to MeterSim, which knows the simulated value and compares it with the prediction, and when an agent repeats this many times with nobody watching, it gives an approximate accuracy for the model. Collecting labelled data works the same way, except that the reader&rsquo;s images are saved to disk with their labels in JSON, ready for training.</p>
      </>
    ),
    visual: pair('metersim-display-rig.webp', 'A tablet showing the MeterSim display next to a laptop with the control panel, with the ESP32-EYE reader pointed at the tablet', 'v05-rig-b.webp', 'The ESP32-EYE reader on a bottle pointed at the MeterSim display, in a classroom'),
  },
];

/* ── Chapter V: SimGen2 ── */
const STAGES: Array<[string, string]> = [
  ['Display screenshot', 'MeterSim’s display, 1920 × 1080'], ['Warped', 'pose and lens, to 1600 × 1200'], ['Field blur', '1.2 to 2.2 px'], ['Gain, tone curve, vignette', 'the sensor’s response'], ['Sensor noise', 'grain where the real camera has it'], ['OV2640 JPEG', 'quality 6, as the reader compresses'],
];
const SIMGEN2: Frame[] = [
  {
    id: 'sg-stages', eyebrow: 'SimGen2', title: 'Simulating the camera itself', wide: true,
    body: (
      <>
        <p>Even with all this automation, one big bottleneck remained, because capturing an image on the reader and sending it to MeterSim takes almost 10 s, which adds up to many hours over thousands of images. So the next goal was to simulate the reader&rsquo;s camera itself, and that system is SimGen2. It scales the image, then applies filters and warping so it looks like an image taken with the reader&rsquo;s camera.</p>
        <p>SimGen2 was developed entirely by OpenAI&rsquo;s ChatGPT Astra 6, which used roughly 4000 real images from the reader to develop the filters.</p>
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
    body: <p>SimGen2 generates an image in about 2 s, almost 5× faster than capturing one with the physical reader, and running alongside the reader it produced tens of thousands of unique labelled images to train the DrumNet Simulated model. Here a real capture tinted magenta is laid over its SimGen2 version tinted green, so the picture is uncoloured wherever the two match, and the LED glare in the real capture is the biggest difference left.</p>,
    visual: img('simgen2-overlay.webp', 'A real capture tinted magenta overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured'),
  },
  {
    id: 'sg-pairs', eyebrow: 'SimGen2', title: 'Compare them yourself',
    body: <p>These are twenty-one real captures and their SimGen2 versions across six meter designs, cut from the report&rsquo;s sheets. Drag the divider to compare them, with the real capture on the left and SimGen2 on the right. The register strip is shown largest because it is the part DrumNet reads.</p>,
    visual: <PairCompare />,
  },
];

/* ── Chapter VI: the agents ── */
const AGENTIC: Frame[] = [
  {
    id: 'ag-loop', eyebrow: 'Agentic workflow', title: 'The self-improvement loop',
    body: <p>I used LLM-based AI agents extensively in this project, and their task was to improve the full vision pipeline running on the ESP32-S3 towards a target of 99 % meter accuracy. Each agent worked in a loop where it formed a hypothesis, planned how to carry it out, gathered training data, retrained, fine-tuned or RL-trained the model, tested for improvements or regressions, then reported its findings and started again.</p>,
    visual: <LoopRing />,
  },
  {
    id: 'ag-six', eyebrow: 'Agentic workflow', title: 'Six agents, three of them on DrumNet', wide: true,
    body: (
      <>
        <p>Three agents ran this loop, each on its own variant of DrumNet, while three more agents handled other jobs. After about 1.5 weeks Standard and Premade were still performing poorly, so their development was halted and all of their resources went to DrumNet Simulated.</p>
        <p>DrumNet Simulated was then allowed to train on every dataset, including those from the rig and the external catalogue, and was renamed DrumNet. The current build, V10, is the best-performing network in the DrumNet series.</p>
      </>
    ),
    visual: <AgentBadges />,
  },
  {
    id: 'ag-resources', eyebrow: 'Agentic workflow', title: 'Shared resources and a scheduler',
    body: (
      <>
        <p>With six agents running at once they kept competing for resources, so I developed a scheduler that lets them book timeslots on the shared resources. One is the compute used for training, which is my server&rsquo;s CPU and my laptop&rsquo;s GPU, and the other is the Jetson rig, where an agent can flash and work with Prototype V1 while it controls, through MeterSim, the display the prototype is pointed at.</p>
        <p className="ws-note">On the scheduler&rsquo;s compute timeline, the filled area shows booked threads against the 20-thread budget and the red line shows booked memory against the 9 GB budget, while the laptop GPU takes one job at a time.</p>
      </>
    ),
    visual: (
      <div className="ws-pair stackv">
        {img('agents-resources-sketch.webp', 'A sketch of the three DrumNet agents sharing the Jetson rig and compute through two schedulers, with the coordinator, Sim2 Genius and the window detector model alongside', 'plate')}
        {img('scheduler-compute.webp', 'The scheduler timeline for the compute resources, with booked blocks per agent and the booked load against the budget')}
      </div>
    ),
  },
  {
    id: 'ag-t3', eyebrow: 'Agentic workflow', title: 'Managed with T3 Code',
    body: (
      <>
        <p>The agents ran 24/7 on a &ldquo;heartbeat&rdquo;, a simple script that wakes an agent after a set interval or at a set time so it carries on working. They were told to act independently and make their own decisions, so very little human involvement was needed.</p>
        <p>The networking ran on Tailscale, a personal peer-to-peer VPN, which let the agents on my server at home reach and control the Jetson rig at school over SSH. The agents themselves were managed in T3 Code, an open-source meta-harness for Claude Code and Codex.</p>
      </>
    ),
    visual: img('t3-tailscale.webp', 'Diagram of T3 Code connecting the client device, the home server running the agents, the laptop GPU and the Jetson rig at school over Tailscale', 'plate'),
  },
];

/* ── Chapter VIII: power ── */
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
        <p>The reader has to run for up to 2 years on one set of batteries. The ESP32-S3 is fairly efficient at heavy work like the vector maths a neural network needs, but it is nowhere near as efficient as Nordic&rsquo;s nRF line-up, so I used the strategies in this chapter to cut its energy use. Its wireless radios are only needed for the initial configuration, so they are turned off in deployment.</p>
        <p>The OV2640 captures up to 1600 × 1200, and it also has sub-sampling modes at 800 × 600 (SVGA) and 400 × 296 (CIF).</p>
      </>
    ),
    visual: pair('ov2640-svga.webp', 'OV2640 SVGA sub-sampling mode diagram showing which pixels are skipped', 'ov2640-cif.webp', 'OV2640 CIF sub-sampling mode diagram', 'plate'),
  },
  {
    id: 'pw-modes', eyebrow: 'Capture modes, side by side', title: 'SVGA, the chosen mode at 89 ms', wide: true,
    body: (
      <>
        <p>This is the same meter at the three resolutions, with the full frame above and the drums below at the same magnification. At 1600 × 1200 every pixel of the sensor is read out and the capture takes 350 ms, which matters because the less time the camera stays on, the less energy it uses. At 400 × 296 the capture takes only 61 ms, but the drums are left with too few pixels to read reliably.</p>
        <p>In my testing SVGA gave the best balance of quality and speed, and at 800 × 600 the network processes 4× less information than at 1600 × 1200. I did not run proper tests to back up the accuracy, although it did not suffer much in my experience.</p>
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
    body: <p>I first dismissed PWM dimming because the OV2640 has a rolling shutter, which could capture during the off-cycles of the PWM signal and show banding. The OV2640 did not show any banding in practice, so I run the LEDs at 20 kHz with a 50 % duty cycle, which saves some power and adds brightness control.</p>,
    visual: pair('led-banding.webp', 'A capture showing horizontal banding across the meter face', 'led-no-banding.webp', 'A capture with PWM-dimmed LEDs and no banding'),
  },
  {
    id: 'pw-grey', eyebrow: 'Power optimisation · software', title: 'In-camera greyscale',
    body: <p>The OV2640 converts the image to greyscale on the camera itself and returns a slightly smaller file, and although the saving is minimal or none, it was easy to implement.</p>,
    visual: pair('cam-grey.webp', 'The meter captured in greyscale by the camera', 'cam-colour.webp', 'The same meter captured in colour'),
  },
  {
    id: 'pw-int8', eyebrow: 'Power optimisation · software', title: 'Vector instructions and INT8',
    body: <p>Earlier builds of DrumNet ran in full-precision Float32 on the ESP32-S3, which was slow and inefficient. The ESP32-S3 has built-in vector instructions, used through the ESP-NN library, that perform several Multiply and Accumulate (MAC) operations per clock cycle, and once DrumNet was quantised to 8 bits, the time from capture to prediction fell from 61 s to 17 s, roughly 3.6× faster. I have not properly measured the gain in efficiency, although I am sure it improved a lot too.</p>,
    visual: (
      <div className="ws-bignum">
        <div><b>61 s</b><span>Float32</span><small>capture to prediction, before quantisation</small></div>
        <div><b className="red">17 s</b><span>INT8 + ESP-NN</span><small>roughly 3.6× faster</small></div>
      </div>
    ),
  },
  {
    id: 'pw-hw', eyebrow: 'Power optimisation · hardware', title: 'Low-Iq converters, a timer and LoRaWAN',
    body: (
      <ul>
        <li><b>Low Iq, high-efficiency DC-DC converters.</b> The OV2640 needs 1.5 V and 2.8 V. Buck converters are more efficient than LDOs, but their high quiescent current and more complex design add cost and board space for close to no gain, and they can introduce artefacts in the image, so I stuck with low-quiescent-current LDOs. The main 3.3 V rail would move to a special low-Iq (~75 nA) buck-boost converter, the TI TPS63900.</li>
        <li><b>Ultra-low-power timer ICs.</b> A timer IC like the Ambiq AM1805 can turn off all the components and turn them back on to a schedule, although the gain would probably be minimal.</li>
        <li><b>LoRaWAN.</b> I chose LoRaWAN for its low power and long range, and because it is an open standard, so unlike with Sigfox and NB-IoT the operator can own and run the whole network.</li>
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

/* ── Chapter X: Prototype V2 and the enclosure, the written detail behind the 3D chapter ── */
const V2: Frame[] = [
  {
    id: 'v2-intro', eyebrow: 'Prototype V2', title: 'A shrunken-down Prototype V1',
    body: <p>Prototype V2 is a shrunken-down version of Prototype V1, which fits in tighter spaces and let me try smaller components like the Wio-SX1262 LoRa module from Seeed Studio. It has built-in battery management, power circuitry for the camera and fan, PWM-dimmable LED lights and a LoRa module. I designed the 4-layer board in KiCad, sourced the components from DigiKey and had it made by JLCPCB, and the circuits are in the report.</p>,
    visual: img('pcb-3d-top.webp', '3D render of the top of the Prototype V2 board from KiCad'),
  },
  {
    id: 'v2-size', eyebrow: 'Prototype V2', title: 'The size of a dev board',
    body: (
      <>
        <p>I designed the PCB to be about the same size as a typical ESP32-S3 dev board, so it fits in a smaller housing that suits meters in tighter spaces.</p>
        <p className="ws-note">Prototype V2 was made before I wrote the report, so it still carries some decisions I have since moved away from. The fan was proposed for high humidity, which may cause fogging, but it will be dropped instead if the readings are not reliable, and the power circuitry was designed before I decided to use Li-SOCl2 cells.</p>
      </>
    ),
    visual: img('v2-vs-devboard.webp', 'The Prototype V2 PCB lying next to an ESP32-S3 development board of nearly the same size'),
  },
];
const ENCLOSURE: Frame[] = [
  {
    id: 'en-all', eyebrow: 'Enclosure', title: 'A toolless enclosure and a two-part adapter',
    body: (
      <>
        <p>The interior enclosure houses the PCB and batteries of Prototype V2. I exported the 3D file from KiCad into Onshape as the reference, modelled the camera by hand for accuracy, and designed the enclosure to need no tools: side clips snap the two halves together, grooves and pins stop them sliding sideways, platforms and posts hold the PCB without screws, and a cutout lets the LoRa IPEX cable reach the transceiver. The final print fitted and finished well, but I had to cut a hole for the camera, which was mounted flipped because of an incorrect pin layout at the assembly stage.</p>
        <p>The exterior adapter comes in two parts. The bottom half mounts against the meter and holds the camera lens about 4 cm from the dial, the focus distance chosen in the camera test, while the much wider top half leaves room to line the reader up with the barrels and means I can reuse it on other meters by redesigning only the bottom half. I had forgotten the tabs that lock the meter&rsquo;s lid, so I made room for them with a few cuts from side cutters.</p>
      </>
    ),
    visual: (
      <div className="ws-quad">
        <figure>{img('enc-reference.webp', 'The KiCad 3D model of the board with the camera modelled on, used as the reference in Onshape', 'plate')}<figcaption>the KiCad export used as the reference in Onshape</figcaption></figure>
        <figure>{img('enc-final.webp', 'The final printed interior enclosure with the board inside')}<figcaption>the printed interior enclosure</figcaption></figure>
        <figure>{img('adapter-distance.webp', 'A CAD section through the adapter showing the camera about 4 cm from the meter face', 'plate')}<figcaption>a section through the adapter, 4 cm from the dial</figcaption></figure>
        <figure>{img('adapter-done-b.webp', 'The completed adapter mounted on the meter')}<figcaption>the adapter mounted on the meter</figcaption></figure>
      </div>
    ),
  },
];

/* ── Chapter XI: conclusion ── */
const CONCLUSION: Frame[] = [
  {
    id: 'cc-all', eyebrow: 'Conclusion', title: 'Where the project stands',
    body: (
      <>
        <p>Because of time constraints the project stops where it is, and many issues still need to be addressed before it could be a viable solution. I have not measured its energy use or tested it against the rated 2-year life, and I do not think Prototype V2 can reach that rating as it stands, so a third revision with more energy-saving components is needed before it is worth monitoring consumption. The firmware, on the other hand, is close to the efficiency I was aiming for.</p>
        <p>DrumNet V10 reads 56 % of readings correctly, far short of the 99 % target. The main bottleneck is WindowNet, because most wrong readings came from it failing to find the correct ROI. The readers also show signs of under-training, and a meter they have not seen gives a low confidence because the dataset was dominated by the 9 meters SimGen2 could generate, so a larger and more diverse dataset could help both. The shell is much too bulky for a real deployment, mostly because of the camera&rsquo;s height, so I need a shorter camera that is better at macro imaging, and weather sealing will need different materials and designs.</p>
        <p className="ws-note">Much of this project was my first attempt at something new, and although I am not exactly satisfied with the outcome, I am proud of the knowledge and experience I have gained, and grateful for the rare opportunity of time, resources and support to learn and experiment the way I do. Thank you to Mr Alex Oh (NYP) for his guidance, expertise and encouragement, to Mr Soh (NYP), without whom I would not have got the camera working, and to Mr Lee Chang Fatt (NYP) for the LoRaWAN gateway.</p>
      </>
    ),
    visual: (
      <div className="ws-bignum">
        <div><b className="red">56 %</b><span>full pipeline</span><small>808 of 1,440 readings correct</small></div>
        <div><b>99 %</b><span>the target</span><small>the whole reading correct</small></div>
        <div><b>93.2 %</b><span>DrumNet alone</span><small>pooled test set, WindowNet left out</small></div>
        <div><b>2 yr</b><span>the target life</span><small>not yet measured, and a V3 board is needed first</small></div>
      </div>
    ),
  },
];

export default function WaterslopPage() {
  return (
    <main className="ws-page art-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />
      <Entrance />
      <PageFx />
      <SkipToEnd />

      <header className="ws-hero">
        <div className="ws-hero-photo" aria-hidden="true"><img src={I + 'hero.webp'} alt="" /></div>
        <div className="ws-hero-label">OCR Reader<small>Water meter OCR on an ESP32-S3 · NYP ECE · 2026</small></div>
        <div className="ws-wrap">
          <div className="ws-hero-copy">
            <h1><span>OCR</span><span>Reader</span></h1>
            <p className="ws-hero-lead">OCR Reader is a low-cost, low-power, vision-based OCR water meter reader. A 693K-parameter neural network, DrumNet V10, runs entirely on the reader&rsquo;s ESP32-S3, where it finds the digit window, reads each drum and sends the number home over LoRaWAN in about 2 seconds. The target is 99 % accuracy on a 2-year battery, and the current build reads 56 % of readings correctly, with plans to improve.</p>
            <AiMark project="proj-waterslop" />
            <Contents />
            <div className="ws-hero-actions">
              <a className="ws-btn" href="#v2"><IcRead /> Start reading</a>
              <a className="ws-btn ghost" href={REPORT_PDF} target="_blank" rel="noopener"><IcOut /> The report</a>
              <span className="ws-hero-meta">ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale</span>
            </div>
          </div>
        </div>
      </header>

      {/* One flow, no covers between: the 3D board and enclosure, which ends by
          pointing the reader at the meter and taking a photo; DrumNet reading that
          photo; then ConfigKing showing the same reading on the setup tool. */}
      <section id="v2" className="ws-pcb" aria-label="The PCB and enclosure of Prototype V2 in 3D, ending with the reader taking a photo of the meter">
        <WaterslopChapter numeral={NUM.v2} />
        <WaterslopChapterStyle />
      </section>
      <DrumNetStory chapter={NUM.drumnet} />
      <ConfigKingChapter chapter={NUM.configking} />

      <Cover id="metersim" chapter={NUM.metersim} title="MeterSim" lines={['Meter', 'Sim']} contents={[{ label: 'A simulated meter', href: '#ms-rig' }, { label: 'Built for agents', href: '#ms-control' }, { label: 'Designs and presets', href: '#ms-designs' }, { label: 'Half-rolled drums', href: '#ms-halfroll' }, { label: 'Weather and surfaces', href: '#ms-effects' }, { label: 'Unattended evaluation', href: '#ms-eval' }]}
        bg="metersim-key.webp" focus={[0.62, 0.5]} lede="MeterSim draws a water meter on a tablet, so a real camera can collect labelled readings with nobody watching." />
      <Page id="metersim-body" title="MeterSim" rows={METERSIM} />

      <Cover id="simgen2" chapter={NUM.simgen2} title="SimGen2" lines={['Sim', 'Gen2']} contents={[{ label: 'Six stages', href: '#sg-stages' }, { label: 'Real over synthetic', href: '#sg-overlay' }, { label: 'Compare them yourself', href: '#sg-pairs' }]}
        bg="simgen2-overlay.webp" focus={[0.55, 0.55]} lede="SimGen2 makes synthetic captures that look like the reader's own camera took them, in about 2 s each, almost 5× faster than a real capture." />
      <Page id="simgen2-body" title="SimGen2" rows={SIMGEN2} />

      <Cover id="agents" chapter={NUM.agents} title="Agentic workflow" lines={['Agentic', 'workflow']} contents={[{ label: 'The loop', href: '#ag-loop' }, { label: 'Six agents', href: '#ag-six' }, { label: 'Resources and the scheduler', href: '#ag-resources' }, { label: 'Managed with T3 Code', href: '#ag-t3' }]}
        bg="scheduler-compute.webp" focus={[0.45, 0.4]} lede="Six agents trained and tested the readers at the same time, sharing one scheduler for the compute and the test rig." />
      <Page id="agents-body" title="Agentic workflow" rows={AGENTIC} />

      <FirmwareChapter chapter={NUM.firmware} />

      <Cover id="power" chapter={NUM.power} title="Power optimisation" lines={['Saving', 'power']} contents={[{ label: 'Sub-sampling', href: '#pw-sub' }, { label: 'Capture modes, side by side', href: '#pw-modes' }, { label: 'PWM dimming', href: '#pw-pwm' }, { label: 'Greyscale', href: '#pw-grey' }, { label: 'INT8 and vector maths', href: '#pw-int8' }, { label: 'Hardware', href: '#pw-hw' }]}
        bg="mode-1600-full.webp" focus={[0.55, 0.62]} lede="Every step of the wake cycle was trimmed towards a 2-year battery life with smaller captures, dimmer light and integer maths." />
      <Page id="power-body" title="Power optimisation" rows={POWER} />

      <CameraChapter chapter={NUM.camera} />

      <Cover id="proto" chapter={NUM.proto} title="Prototype V2" lines={['Prototype', 'V2']} contents={[{ label: 'A shrunken-down Prototype V1', href: '#v2-intro' }, { label: 'The size of a dev board', href: '#v2-size' }, { label: 'The enclosure and adapter', href: '#en-all' }]}
        bg="v2-vs-devboard.webp" lede="Prototype V2 is Prototype V1 shrunk to the size of a dev board, in a two-part enclosure that needs no tools." />
      <Page id="v2-body" title="Prototype V2" rows={V2} />
      <Page id="enclosure" title="Enclosure" rows={ENCLOSURE} />

      <Cover id="conclusion" chapter={NUM.conclusion} title="Conclusion" lines={['Conclusion']} contents={[{ label: 'Where the project stands', href: '#cc-all' }, { label: 'The report', href: '#report' }]}
        bg="adapter-done-b.webp" lede="The reader gets 56 % of readings right against a 99 % target, and this chapter covers what it would take to close the gap." />
      <Page id="conclusion-body" title="Conclusion" rows={CONCLUSION} />

      <section id="report" className="ws-plain">
        <div className="ws-wrap">
          <div className="ws-content">
            <span className="ws-sec-n">Chapter - {NUM.report}</span>
            <h2 className="ws-report-h2">The report</h2>
            {REPORT_PDF ? (
              <div className="ws-report-frame">
                <PdfEmbed src={REPORT_PDF} title="OCR Water Meter Reader report (PDF)" />
              </div>
            ) : null}
            <div className="ws-report-card">
              <div className="ws-report-text">
                <b>OCR Water Meter Reader</b>
                <span>Low cost and power vision-based OCR solution for reading water meters. Braven Chiam, NYP Electronic and Computer Engineering. 58 pages, PDF, 6.8 MB.</span>
              </div>
              <a className="ws-btn" href={REPORT_PDF} target="_blank" rel="noopener"><IcOut /> Open the report</a>
            </div>
            <p className="ws-note ws-report-note">I used AI tools heavily in developing this project. I wrote most of the report myself in my own words, except for the introduction and certain graphs, and other AI use included research, chart generation and data verification. This project scores a Level 3 on my scale of AI use.</p>
          </div>
        </div>
      </section>

      <ArticleRecommendations exclude="proj-waterslop" />
    </main>
  );
}
