import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import ArticleScrollSpy from '../../components/ArticleScrollSpy';
import ArticleRecommendations from '../../components/ArticleRecommendations';
import ArticleLinks from '../../components/ArticleLinks';
import WaterslopChapter from './WaterslopChapter';
import DrumNetWalk from './DrumNetWalk';
import ReadCycle from './ReadCycle';
import FocusLab from './FocusLab';
import CalibrationLab from './CalibrationLab';
import './waterslop.css';
import './article.css';

const description =
  'WaterSlop: a low-cost, battery-powered vision OCR water meter reader. A 693K-parameter DrumNet V10 pipeline runs entirely on an ESP32-S3, reads the drums, and sends the reading over LoRaWAN. The full build: MeterSim, SimGen2, six training agents, the network, the firmware, the PCB and the enclosure.';

export const metadata: Metadata = {
  title: 'WaterSlop — Chiambucket',
  description,
  alternates: { canonical: 'https://www.chiambucket.com/waterslop' },
  openGraph: {
    title: 'WaterSlop — OCR water meter reader on an ESP32-S3',
    description,
    url: 'https://www.chiambucket.com/waterslop',
    type: 'article',
    images: [{ url: '/waterslop/og.webp', width: 1200, height: 630 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'WaterSlop: a vision OCR water meter reader on an ESP32-S3',
  description,
  image: 'https://www.chiambucket.com/waterslop/og.webp',
  author: { '@type': 'Person', name: 'Braven Chiam', url: 'https://www.chiambucket.com/' },
  publisher: { '@type': 'Person', name: 'Braven Chiam' },
  mainEntityOfPage: 'https://www.chiambucket.com/waterslop',
};

/* The report on OneDrive. The share link cannot be framed (its CSP only allows
   Microsoft hosts), so the inline viewer needs the URL from OneDrive's own
   "Embed" dialog. Paste that src here and the viewer appears; until then the
   section links out. */
const REPORT_LINK = 'https://1drv.ms/w/c/4eae3340327c4979/IQD6fnAtH4qnTp-LM2j2Hj_7ARKI2X_7aByE_W7eXIiQjQk?e=DOacjY';
const REPORT_EMBED_URL = '';

const I = '/images/waterslop/';

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Fig({ src, alt, cap, cls, diagram }: { src: string; alt: string; cap: ReactNode; cls?: string; diagram?: boolean }) {
  return (
    <figure className={`ws-fig${cls ? ` ${cls}` : ''}`}>
      <img src={I + src} alt={alt} loading="lazy" decoding="async" className={diagram ? 'art-diagram light' : undefined} />
      <figcaption>{cap}</figcaption>
    </figure>
  );
}
function Grid2({ items, cap, cls }: { items: Array<[string, string]>; cap?: ReactNode; cls?: string }) {
  return (
    <figure className="ws-fig">
      <div className={`ws-grid${cls ? ` ${cls}` : ''}`}>{items.map(([s, a]) => <img key={s} src={I + s} alt={a} loading="lazy" decoding="async" />)}</div>
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];

/* Chapter rail, used twice because the 3D PCB chapter breaks the article into two bodies. */
const CHAPTERS: Array<[string, string, boolean?]> = [
  ['overview', 'Overview'], ['brief', 'Design brief'],
  ['metersim', 'MeterSim'], ['simgen2', 'SimGen2'], ['agents', 'Agentic workflow'],
  ['drumnet', 'DrumNet'], ['walk', 'Step by step', true], ['windownet', 'WindowNet', true], ['reader', 'Reader ensemble', true],
  ['firmware', 'Firmware'], ['payloads', 'Payloads', true],
  ['mcu', 'Processor'], ['battery', 'Battery'], ['power', 'Power optimisation'], ['camera', 'Camera choice'], ['v1', 'Prototype V1'],
  ['pcb', 'PCB & enclosure'], ['v2', 'Circuits & layout', true], ['assembly', 'Assembly', true], ['enclosure', 'Enclosures', true], ['calibration', 'Camera calibration', true], ['configking', 'ConfigKing', true],
  ['conclusion', 'Conclusion'], ['report', 'The report'],
];
/* Roman numeral of a main chapter, so headings and both contents lists agree. */
const NUM: Record<string, string> = {};
{ let n = 0; for (const [id, , sub] of CHAPTERS) if (!sub) NUM[id] = ROMAN[n++]; }
const Contents = ({ full }: { full?: boolean }) => (
  <nav className="ws-contents article-chapter-wrapper" aria-label="Chapters">
    {CHAPTERS.filter(([, , sub]) => full || !sub).map(([id, label, sub]) => (
      <a key={id} href={`#${id}`} className={sub ? 'sub' : undefined}><span>{label}</span><i /><span>{sub ? '' : `(${NUM[id]})`}</span></a>
    ))}
  </nav>
);
const Rail = () => (
  <aside className="ws-rail">
    <div className="ws-rail-title">Contents</div>
    <Contents full />
  </aside>
);
const Head = ({ id, title }: { id: string; title: string }) => (
  <>
    <span className="ws-sec-n">{NUM[id] ? `Chapter - ${NUM[id]}` : ''}</span>
    <h2>{title}</h2>
  </>
);

/* How a reading travels from the meter to the dashboard (Figure 1.2). */
const DataPath = () => (
  <div className="ws-flow" role="img" aria-label="Water meter to meter reader, over LoRaWAN to a gateway, over the internet to database storage, then to the dashboard">
    {[
      ['Water meter', 'the mechanical register, untouched', 'meter'],
      ['Meter reader', 'camera + ESP32-S3, reads on device', 'reader'],
      ['LoRaWAN gateway', 'receives the small uplink', 'gateway'],
      ['Database storage', 'stores every reading', 'db'],
      ['Dashboard', '92.07 m³, for the user and the utility', 'dash'],
    ].map(([t, s, k], i) => (
      <div key={k} className="ws-flow-item">
        {i > 0 && <div className="ws-flow-link"><span className="ws-flow-pill">{i === 1 ? 'camera' : i === 2 ? 'LoRaWAN' : 'internet'}</span><span className="ws-flow-ar" /></div>}
        <div className={`ws-flow-card${k === 'reader' ? ' lit' : ''}`}><b>{t}</b><span>{s}</span></div>
      </div>
    ))}
  </div>
);

/* The self-improvement loop followed by each training agent (Figure 2.11). */
const AgentLoop = () => (
  <div className="ws-loop" role="img" aria-label="Hypothesis, execution planning, gathering a training dataset, retraining the model, testing for improvement or regression, reporting findings, then back to a new hypothesis">
    {['Hypothesis', 'Execution planning', 'Gathering training dataset', 'Re-train, fine-tune or RL the model', 'Test for improvement or regression', 'Report findings'].map((s, i) => (
      <div key={s} className="ws-loop-step"><span className="ws-loop-n">{i + 1}</span><span>{s}</span></div>
    ))}
    <div className="ws-loop-back">then a new hypothesis, 24/7, woken by a heartbeat</div>
  </div>
);

/* Prototype V1 block diagram (Figure 3.11). */
const V1Block = () => (
  <svg className="ws-v1" viewBox="0 0 520 230" role="img" aria-label="Prototype V1 block diagram: an M5Stack LoRa cap on SPI and I2C to the ESP32-S3 cam board, which drives the LEDs and reads the limit switches">
    <g style={{ fontFamily: "Manrope, Arial, sans-serif" }} fontSize="15" fill="#d8cbb8" textAnchor="middle">
      <rect x="20" y="40" width="130" height="150" rx="14" fill="none" stroke="#d8cbb875" />
      <circle cx="46" cy="66" r="8" fill="none" stroke="rgba(255,255,255,0.4)" />
      <text x="85" y="122">M5Stack</text><text x="85" y="142">LoRa Cap</text>
      <rect x="250" y="20" width="250" height="130" rx="18" fill="none" stroke="#d8cbb875" />
      <text x="375" y="80" fontSize="18" fontWeight="700">ESP32-S3 Cam</text>
      <rect x="250" y="178" width="100" height="42" rx="10" fill="none" stroke="#d8cbb875" /><text x="300" y="205">LEDs</text>
      <rect x="380" y="178" width="120" height="42" rx="10" fill="none" stroke="#d8cbb875" /><text x="440" y="205">Limit Sw</text>
    </g>
    <g stroke="#d8cbb8" strokeWidth="1.5" fill="none">
      <path d="M150 80 H250" /><path d="M150 120 H250" /><path d="M300 150 V178" /><path d="M440 150 V178" />
    </g>
    <g style={{ fontFamily: "Manrope, Arial, sans-serif" }} fontSize="11" fontWeight="600" fill="#ada496" textAnchor="middle" letterSpacing="0.14em">
      <text x="200" y="72">SPI</text><text x="200" y="112">I2C</text>
    </g>
  </svg>
);

const PAYLOADS = [
  {
    id: 'reading', title: 'Reading payload', port: 'LoRaWAN port 10',
    bytes: [['10', 'ver/status'], ['00', 'sequence'], ['0A', ''], ['42', 'layout'], ['00', 'value'], ['00', ''], ['23', ''], ['F7', ''], ['E5', 'min conf'], ['08', 'awake ms'], ['BC', ''], ['9E', 'ocr/10'], ['81', 'flags'], ['F6', 'mean conf'], ['00', 'batt mV'], ['0A', ''], ['5A', ''], ['17', ''], ['E8', '']],
    fields: [['version', '1'], ['status', '0'], ['status_text', 'ok'], ['sequence', '10'], ['layout', '4+2'], ['digits', '009207'], ['value', '92.07'], ['min_conf', '0.898'], ['awake_ms', '2236'], ['ocr_ms', '1580'], ['flags', 'fixed_roi, environment'], ['mean_conf', '0.965'], ['temperature_c', '26.50'], ['humidity_pct', '61.20'], ['environment', 'ok']],
  },
  {
    id: 'radio', title: 'Radio test payload', port: 'LoRaWAN port 11',
    bytes: [['01', 'ver/kind'], ['00', 'fw'], ['27', ''], ['03', 'reset'], ['01', 'cfg crc'], ['01', ''], ['01', 'interval'], ['AD', ''], ['AD', 'layout'], ['1C', 'boots'], ['CB', '']],
    fields: [['version', '0'], ['kind', 'radio_test'], ['fw', '39'], ['fw_text', '0.39'], ['reset_reason', '3'], ['config_crc', '0101'], ['interval_s', '429'], ['layout', '10+13'], ['boot_count', '7371']],
  },
  {
    id: 'recovery', title: 'DrumNet recovery event payload', port: 'LoRaWAN port 12',
    bytes: [['01', 'ver'], ['00', 'seq'], ['27', ''], ['03', 'reason'], ['01', 'outcome'], ['01', 'st0'], ['01', 'st1'], ['AD', 'conf0'], ['AD', 'conf1'], ['1C', 'det ms'], ['CB', '']],
    fields: [['version', '1'], ['linked_sequence', '39'], ['reason', 'persistent_low_conf'], ['outcome', 'rejected'], ['initial_status', 'low_conf'], ['final_status', 'low_conf'], ['initial_min_conf', '0.678'], ['final_min_conf', '0.678'], ['detector_ms', '7371']],
  },
];

const BLE_ITEMS: Array<[string, string]> = [
  ['Name', 'WSR-DC7C (WSR- plus the last 4 hex of the DevEUI)'],
  ['Service', '6e400001-b5a3-f393-e0a9-e50e24dcca9e (Nordic UART layout, custom semantics)'],
  ['RX / TX / IMG', '...0002 write, ...0003 notify (reply lines), ...0004 notify (2-byte LE chunk index + up to MTU-5 bytes of JPEG)'],
  ['Advertisement', 'manufacturer 0xFFFF, ‘W’, state byte (0 discovery, 1 configured setup), 8-byte DevEUI'],
  ['Security', 'LE Secure Connections, Just Works, bonding, encrypted characteristics, one connection, 3 bonds max. The physical commissioning window is the authentication.'],
];
const BLE_CMDS: Array<[string, string]> = [
  ['HELLO', 'name, fw, deveui, state, configured, key present, uptime. First thing the wizard sends.'],
  ['CFG GET / SET <json> / COMMIT / DISCARD / RESET', 'Staged partial JSON, validated as a whole; nothing persists until COMMIT. Identity changes clear the session so the next wake rejoins.'],
  ['KEY SET <32 hex>', 'Stages the AppKey; the reply never echoes it and no command reads it back (CFG GET reports only app_key_set).'],
  ['PREVIEW [maxw]', 'One lit frame, software-shrunk JPEG (default 240 px wide) streamed in chunks; IMG MISS re-requests chunks.'],
  ['ROI SET x y w h / ROI FIND / ROI AUTO', 'Fixed box in SVGA pixels (validated against the layout); FIND and AUTO are experimental detector paths.'],
  ['READ / ANNOT', 'Full capture + OCR with the staged config; status, digits, confidences, box, timings, then the annotated JPEG.'],
  ['FRAME [maxw] [x y w h] / FRAME RAW', 'Re-sends the frame of the last capture without a new capture or LED: FRAME RAW is the camera’s own 800×600 JPEG (about 22 kB), FRAME 480 a 400×300 re-encode, a rectangle keeps full resolution. Headers carry src=, scale= and frame=n; READ replies carry the same frame=n, so a client never pairs an old reading with a newer picture.'],
  ['OK END ... retries= drops=', 'BLE image notifications are sent through the host’s own notify call so a refusal for lack of buffers is seen: the reader waits 8 ms and retries, up to 40 times per chunk, and reports the counts. Three repeated FRAME RAW of one frame: 22102 B, 93 of 93 chunks, 1.423 to 1.429 s, drops 0.'],
  ['RADIO TEST', 'Joins if needed, sends one confirmed port 11 frame, reports ack, RSSI, SNR, DR, bytes, trimmed, ms. Real result: joined=new fcnt=0 ack=1 rssi=-16 snr=10.8 dr=3 bytes=14 trimmed=0 ms=6992.'],
  ['STATUS / DONE / SLEEP / FACTORY RESET', 'Counters JSON; finish setup (port 11 status, then sleep); immediate sleep; wipe the reader namespace and reboot into discovery.'],
];

const CIRCUITS: Array<{ k: string; t: string; d: string }> = [
  { k: '3v3', t: '3.3 V buck-boost circuit', d: 'The schematic was mostly copied from the manufacturer’s reference design.' },
  { k: '5v', t: '5 V boost circuit', d: 'The schematic was also mostly copied from the manufacturer’s reference design.' },
  { k: 'ldo', t: '1.5 V and 2.8 V LDO regulator circuit', d: 'Chosen for simplicity and because they produce no noise as compared to buck converters.' },
  { k: 'charge', t: 'LiPo battery charging circuit', d: 'Handles power switching from USB and battery; its output feeds into the 3.3 V buck-boost chip. It manages charging of the built-in LiPo battery.' },
  { k: 'protect', t: 'Battery protection and monitoring circuit', d: 'The BQ29700 protects the LiPo cell from over-charge, over-discharge and over-current; the MAX17048 fuel gauge reports its state of charge over I²C.' },
  { k: 'power-all', t: 'Full power circuitry', d: 'All power circuits combined. They take up about 40 % of board space.' },
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

const CONFIGKING: Array<[string, string]> = [
  ['Discovery', 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.'],
  ['Identification and reading rate', 'Configure the name of the reader that shows up in the dashboard, then the reading rate. Expanding the (i) icon shows more details about the reader.'],
  ['Drum layout', 'Configure the drum layout based on the meter the reader will be installed on: whole-number drums range from 1 to 8, and fraction drums from 0 to 4.'],
  ['Camera configuration', 'Configure the brightness, gain and LED PWM duty cycle to achieve even lighting. You can zoom and pan to inspect the image closer.'],
  ['ROI refinement', 'WindowNet auto-generates a ROI; the controls refine the selection further, with zoom and pan to view it in more detail.'],
  ['Test read', 'A test reading is made using the ROI set earlier. It shows the confidence level of the reading, and you can inspect digit by digit by pressing (D).'],
  ['LoRa connectivity test', 'A connectivity test to the LoRaWAN gateway makes sure the reader can reach the gateway. More info can be viewed by expanding the (i) menu.'],
  ['Review changes and save', 'Check the settings and configuration to be saved to the reader. After saving, the reader changes into standard deployment mode and the BLE link is lost.'],
];

export default function WaterslopPage() {
  return (
    <main className="ws-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleScrollSpy />

      <header className="ws-hero">
        <div className="ws-hero-photo" aria-hidden="true"><img src={I + 'hero.webp'} alt="" /></div>
        <div className="ws-hero-label">WaterSlop<small>OCR water meter reader · NYP ECE · 2026</small></div>
        <div className="ws-wrap">
          <div className="ws-hero-copy">
            <h1><span>Water</span><span>Slop</span></h1>
            <p className="ws-hero-lead">A low-cost, low-power, vision-based OCR water meter reader. A 693K-parameter neural network, DrumNet V10, runs entirely on the reader&rsquo;s ESP32-S3: it finds the digit window, reads each drum, and sends the number home over LoRaWAN in about 2 seconds. The target is 99 % accuracy on a 2-year battery; the current build reads 56 % of readings correctly, with plans to improve.</p>
            <Contents />
            <div className="ws-hero-actions">
              <a className="ws-btn" href={REPORT_LINK} target="_blank" rel="noopener">Read the report <ArrowRight /></a>
              <a className="ws-btn ghost" href="#walk">See DrumNet run</a>
              <span className="ws-hero-meta">ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale</span>
            </div>
          </div>
        </div>
      </header>

      <div className="ws-wrap ws-body">
        <Rail />
        <div className="ws-content art-body">
          <section id="overview" className="ws-sec">
            <Head id="overview" title="Overview" />
            <p>Singapore has about 1.6 million water meters, and they have been read by hand once every two months, with the bill for the month in between estimated from earlier usage. Six readings a year per meter is enough for billing. It is far too coarse to catch a leak early or to show a household how its habits change what it uses.</p>
            <p>PUB&rsquo;s answer is the Smart Water Meter Programme: 300,000 smart meters that send readings every day over an Itron network. The rollout was slowed by the global microchip shortage, and PUB has said it will review the first phase before going further. So for more than a million meters, the two-month cycle carries on. Digitising each of them means a plumber, a new meter and a network to carry its data.</p>
            <p>There is a cheaper route. The register on a mechanical meter already shows the reading, so a camera fixed over it can read the same digits a person does. The best-known open-source example is AI-on-the-edge-device, which costs under &euro;10 on an ESP32-CAM. That proves the hardware is cheap enough. Its documentation does not report accuracy figures, though, and each user draws the digit regions by hand during setup.</p>
            <p>Reading a meter by camera is harder than it looks. The register sits behind glass that catches glare and collects dirt, and the meter is often in a dim cabinet or in shadow. The drums turn continuously, so the last one is often caught between two digits, where either answer can be argued. Singapore&rsquo;s household meters are not all one design either.</p>
            <Grid2 items={[['meter-brass.webp', 'A compact brass water meter with four black and four red drums'], ['meter-aquadis.webp', 'A white Aquadis+ water meter with five black and three red drums']]} cap="Typical water meters in Singapore: brass meter (left) and Aquadis+ meter (right)" cls="meters" />
            <p>This project builds a low-cost sensor that mounts over an existing mechanical meter and reports its reading as text, with no plumbing work. It starts from an existing AI image node reference design and replaces that design&rsquo;s generic image classification with a meter-reading pipeline. The pipeline runs entirely on an ESP32-S3 in three stages: a detector finds the drum window, a refiner corrects the window&rsquo;s edges, and a reader reads each drum, including digits caught halfway through a turn.</p>
            <p>The camera is pointed at the water meter and takes readings on 6-hour intervals. After the reading is made on device, the numerical reading is transmitted over LoRaWAN to a database storing the readings, which the user and the utility provider can access over a dashboard. The original image is never transmitted; only the predicted reading is.</p>
            <DataPath />
          </section>

          <section id="brief" className="ws-sec">
            <Head id="brief" title="Design brief" />
            <p>These are the design specifications the reader was designed around.</p>
            <div className="ws-specs">
              {[
                ['Ultra-low power', 'The meter needs to be able to run on batteries while lasting for 2 years.'],
                ['Low cost', 'A target cost of under S$100 per piece, not inclusive of installation labour.'],
                ['High reliability', 'Target ≥ 99 % meter accuracy (the whole reading correct) and ≥ 99.9 % digit accuracy (each drum correct).'],
                ['Easy deployment', 'Easy to mount and configure, with minimal calibration.'],
                ['Modularity', 'Easily repairable and upgradable.'],
                ['Secure and safe', 'Able to resist tampering, as its readings directly affect billing.'],
                ['Weather sealed', 'Sealed so weather changes do not cause missed readings.'],
              ].map(([t, d]) => <div key={t} className="ws-spec"><b>{t}</b><span>{d}</span></div>)}
            </div>
            <p>The ESP32-S3 with 8 MB of PSRAM was selected as the microcontroller, and the OV2640 with a 160° field of view was selected as the camera. Production readers send their readings over LoRaWAN; Wi-Fi is only used by the reader on the training rig.</p>
          </section>

          <section id="metersim" className="ws-sec">
            <Head id="metersim" title="MeterSim" />
            <p>The first version of MeterSim was built alongside Prototype V0.5&rsquo;s firmware. They work in conjunction, so Prototype V0.5 can be controlled automatically by MeterSim and labelled image data can be generated for model training. All the software and firmware builds were entirely written by Claude.</p>
            <Grid2 items={[['v05-rig-a.webp', 'Prototype V0.5, an ESP32-EYE, pointed at a tablet showing the MeterSim display'], ['v05-rig-b.webp', 'The MeterSim output on screen with the ESP32-EYE reader in front of it']]} cap="Prototype V0.5 (ESP32-EYE) pointed at the MeterSim display" />
            <p>MeterSim is built to be used by agentic AI agents instead of humans, so the control panel serves as a monitoring platform for humans to see the progress made by the agents. Agents use MeterSim as a framework to build tests, collect data and verify accuracy while creating DrumNet. It replaces the most tedious task in machine learning, gathering quality data to train on, by generating the data; and since the environment is simulated, the data is naturally labelled, which removes the second most tedious task of labelling it by hand. This focus on heavily automated model training supervised by agents is what let the project progress so quickly and freed up my time for the hardware.</p>
            <Fig src="metersim-control.webp" alt="The MeterSim control interface, with sliders for reading, drums, surface and weather effects" cap="MeterSim control interface" />
            <p>MeterSim has 9 different meter designs that can be customised with different barrel configurations, like 7 integer barrels and 1 decimal barrel (7+1); the integer barrels are typically in white or black while the decimal barrels are in red. It also simulates half-rolled barrels, so the model can be trained to predict the value of barrels that are in the middle of transitioning from one value to another. This is done automatically by the agent during training data collection.</p>
            <Grid2 items={[['metersim-designs.webp', 'The nine meter designs available in MeterSim: Itron Weg 50, Elster brass, Itron Multimag Cyble, Bonega S/13 and T/13, Istameter II, an industrial generic, B Meters blue and a clean Elster brass'], ['metersim-halfroll.webp', 'The MeterSim roll control, dragging individual drums part-way between digits']]} cap="The nine meter designs available in MeterSim (left) and simulating half-rolled drums (right)" />
            <p>MeterSim also simulates different weather and meter surface conditions to better match how a meter left out in the elements may look; this is part of the training so the reader can read in different conditions. The controls include glare, smudge, shadow, lighting, blur, sensor noise, fog, dirt and scaling. Common combinations are saved as presets.</p>
            <Grid2 items={[['metersim-effects.webp', 'The surface and weather effect sliders in MeterSim, each with a preview thumbnail'], ['metersim-presets.webp', 'Nine preset conditions: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty']]} cap="Surface and weather effects (left) and the preset conditions (right)" />
            <p>MeterSim is a self-hosted web app with two endpoints: the control panel at <code>/control</code> and the display at <code>/display</code>. The reader is connected over Wi-Fi on the same local network as the MeterSim instance; it uses this to send readings and images it has taken and to receive commands. MeterSim is used for two purposes: model evaluation and labelled data collection.</p>
            <Fig src="metersim-display-rig.webp" alt="A tablet showing the MeterSim display next to a laptop with the control panel, with the ESP32-EYE reader pointed at the tablet" cap="MeterSim display and control panel with the ESP32-EYE reader" />
            <p>For model evaluation, a randomised meter and its conditions are generated and shown to the reader, which takes an image and makes a reading using the trained network. The results are sent back to MeterSim, and since MeterSim knows the simulated value (the answer), it is compared against the prediction; repeated many times, this gives an approximate accuracy of the model, performed by an agent without human intervention. Collecting labelled data works the same way, except the images the reader takes are saved to disk along with the labels in JSON, ready for training.</p>
          </section>

          <section id="simgen2" className="ws-sec">
            <Head id="simgen2" title="SimGen2" />
            <p>Even with all these automation workflows, one major bottleneck remained: capturing images from the reader and transferring them to MeterSim takes almost 10 s, and repeated over thousands of images, many hours are wasted. So the next goal was to simulate the reader&rsquo;s camera itself. This system is SimGen2. It works by scaling, then applying filters and warping to simulate the look of an image taken from the reader&rsquo;s camera. MeterSim is plugged into its input so that labelled training data can be generated end to end without ever needing a physical rig, although the rig was kept for testing the model and occasional data generation.</p>
            <p>SimGen2 was developed by OpenAI&rsquo;s ChatGPT Astra 6 entirely; roughly 4000 real images taken by the reader were used to develop the filters. The synthetic image starts as a screenshot of the MeterSim output, passes through a warping stage that stretches the image to fit the aspect ratio of the camera, then field blur, gain, tone curves, sensor noise and vignetting are added, and finally JPEG compression at 55 % (similar to quality 6 of the OV2640) gives the final look.</p>
            <Fig src="simgen2-stages.webp" alt="The six processing stages of SimGen2 from display screenshot to warped, blurred, toned, noisy and JPEG-compressed output, with a strip of the register at each stage" cap="The processing stages of SimGen2" />
            <p>SimGen2 generates an image in about 2 s, almost 5× faster than capturing with the physical reader. Used in parallel with the reader, it produced tens of thousands of unique labelled images, which trained the DrumNet Simulated model.</p>
            <Fig src="simgen2-overlay.webp" alt="A real capture tinted magenta overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured" cap="Real capture (magenta) overlaid on its SimGen2 synthetic image (green); uncoloured areas match" />
            <Grid2 items={[['simgen2-pairs-a.webp', 'Pairs of real captures and their SimGen2 versions, several meter designs'], ['simgen2-pairs-b.webp', 'More real and synthetic pairs']]} cap="Real and synthetic image pairs (left: real, right: SimGen2)" />
          </section>

          <section id="agents" className="ws-sec">
            <Head id="agents" title="Agentic workflow and model training" />
            <p>LLM-based AI agents were used extensively in this project. Agents were tasked to improve the full vision pipeline running on the ESP32-S3 with the target of 99 % meter accuracy. The core loop is developing a hypothesis, planning the execution, gathering training data, retraining, fine-tuning or RL-ing the model, testing for improvements or regressions, then reporting the findings.</p>
            <AgentLoop />
            <p>This framework was applied to three agents, each working on a variant of DrumNet, with three more agents on other jobs:</p>
            <div className="ws-agents">
              {[
                ['DrumNet Standard', 'OCR Standard agent · Fable 5.1, then Opus 5.5', 'Trains only from images taken by Prototype V1, starting from the base DrumNet V1 network.'],
                ['DrumNet Simulated', 'OCR Simulated agent · Fable 5.1, then Opus 5.5', 'Trains only from images generated by SimGen2, fully computer-generated, also from the base DrumNet V1.'],
                ['DrumNet Premade', 'OCR Premade agent · Fable 5.1, then Opus 5.5', 'Trains from every dataset: Prototype V1 captures, SimGen2, and public water meter datasets (Badger55, 2,506 photos cut into 4,548 digits; Jomjol-digits, 1,290 photos). Base model derived from AI-on-the-edge-device’s dig-cont model.'],
                ['WindowNet', 'OCR windownet agent · Opus 5.5', 'Trains the spotter (DetNet) and refiner (RefNet) used to locate the drum window.'],
                ['Sim 2 Genius', 'Opus 5.5', 'Operates, maintains and improves SimGen2.'],
                ['OCR Coordinator', 'Fable 5.1', 'Coordinates and talks to all the other agents to manage the project.'],
              ].map(([t, who, d]) => <div key={t} className="ws-agent"><b>{t}</b><i>{who}</i><span>{d}</span></div>)}
            </div>
            <p>With six agents running simultaneously, they would constantly compete for resources, so the scheduler was developed. It lets the agents book timeslots on the shared resources: my server (CPU compute) and laptop (GPU compute), collectively the compute resource used for training, and the Jetson rig, which lets an agent flash and interact with Prototype V1 while controlling the display it is pointed at through MeterSim, to test ideas and verify built models on real hardware.</p>
            <Fig src="agents-resources-sketch.webp" alt="A sketch of the three DrumNet agents sharing the Jetson rig and compute through two schedulers, with the coordinator, Sim2 Genius and the window detector model alongside" cap="The agents, the shared resources and the scheduler" cls="plate" />
            <Grid2 items={[['scheduler-compute.webp', 'The scheduler timeline for the compute resources, with booked blocks per agent'], ['scheduler-jetson.webp', 'The scheduler timeline for the Jetson rig']]} cap="Scheduler bookings for the compute resources (left) and the Jetson rig (right)" />
            <p>After running for about 1.5 weeks, Standard and Premade displayed lacklustre performance, so their development was halted and all resources were reallocated to DrumNet Simulated. It was then allowed to train on every dataset, including those from the rig and the external catalogue, and was renamed DrumNet. The current build, V10, is the highest performing network of the DrumNet series.</p>
            <p>The agents ran 24/7 through a &ldquo;heartbeat&rdquo;, a simple script that wakes an agent after a set time, or at a set time, to continue working: when a resource becomes available or when a model finishes training. The agents were instructed to act independently and make their own decisions, so very little human involvement was required, which freed up the time to build the hardware (Prototype V2) that DrumNet would eventually run on, and to study the models the agents built only after the hardware was done.</p>
            <p>Tailscale was at the heart of the networking: a personal peer-to-peer VPN that let the agents running on my server at home communicate with and control the Jetson rig located in school, over SSH. T3 Code, an open-source meta-harness for Claude Code and Codex, managed the agents, so I could talk to and control them from my devices, use any model from either provider, let them communicate with each other, and connect multiple computers under one app, all over the Tailscale connection.</p>
            <Fig src="t3-tailscale.webp" alt="Diagram of T3 Code connecting the client device, the home server running the agents, the laptop GPU and the Jetson rig at school over Tailscale" cap="How T3 Code and Tailscale connect the agents, machines and test rig" cls="plate" />
          </section>

          <section id="drumnet" className="ws-sec">
            <Head id="drumnet" title="DrumNet" />
            <h3>The problem</h3>
            <p>OCR is a relatively solved problem, with plenty of models to choose from. What complicates this application is that water meter drums have an in-between state when transitioning from one value to another, known as half-rolled drums, which makes it significantly harder to guess the true value of that drum.</p>
            <Fig src="half-rolled.webp" alt="A MeterSim register reading 0000697 where the last drum is caught between a 7 and an 8" cap="A half-rolled drum: the last drum is caught between two digits" diagram />
            <p>The second hurdle was locating the meter&rsquo;s digit window, then cutting out each digit correctly, before feeding it to the OCR model. DrumNet&rsquo;s architecture is built around solving these two problems step by step.</p>
            <Fig src="windownet-early.webp" alt="Eight Itron drum-window crops with red outer boxes and green drum splits from an early WindowNet" cap="An early version of WindowNet's detection and cutting results" />
            <h3>Network architecture</h3>
            <p>DrumNet V10 is a 693K-parameter, 3-stage CNN pipeline: the Spotter network, the Edge refiner network and the Reader network. The Spotter and the Refiner are known collectively as WindowNet; its job is to find the location of the drums on the meter and cut them out. The cut-out images are then passed to the reader network, which makes the final prediction. DrumNet is a mixed-precision quantised network of mostly INT8 values (99.95 %), retaining FP16 for the most critical parts that cannot survive being quantised.</p>
            <p>WindowNet does not typically run for every reading; that would be too costly. Since the meter&rsquo;s position stays locked, WindowNet runs during setup and stores the Region Of Interest to be reused during standard operation. If a reading turns out to have a confidence lower than acceptable, DrumNet reruns with WindowNet in a sort of recovery mode to get a better reading.</p>
            <Fig src="arch-overview.webp" alt="The full DrumNet V10 architecture diagram: input image, downscale, the WindowNet pipeline of DetNet spotter and two RefinerNet passes, cut into digits, the three DrumNet readers, and the ensemble vote and reading" cap="DrumNet V10 architecture overview, drawn from real runs of the network. Click to zoom." />
          </section>

          <section id="walk" className="ws-sec">
            <Head id="walk" title="DrumNet, step by step" />
            <p>This is the whole pipeline on one real photo from Prototype V2, played forward one operation at a time: how a thumbnail becomes a score map, how the refiner averages each column into a single pixel, how a cell becomes 768 numbers, a softmax and a vote. The maps and numbers are taken from the run itself, not drawn by hand. It plays on its own; pick a stage or step through it yourself.</p>
            <DrumNetWalk />
            <p className="ws-note">The visualisations are from an image of a meter type WindowNet had never seen before. It was therefore unable to correctly identify the ROI; the results are promising and show conceptually how WindowNet works, but the window used from the cut stage onwards was drawn by hand.</p>
          </section>

          <section id="windownet" className="ws-sec">
            <Head id="windownet" title="WindowNet" />
            <p><strong>Spotter network (DetNet).</strong> The Spotter is a CNN built for efficiency and rough work, a fast search. Five blocks, each a 3 × 3 convolution, ReLU and 2 × 2 max-pool, shrink the 320 × 240 thumbnail into a 10 × 7 grid; then a 1 × 1 convolution turns the grid into five 10 × 7 grids, one for each value we are looking for: the score (which cell), dy, dx, width and height. The ROI is scaled and used to crop the original image. Since DetNet&rsquo;s work is rough, the crop is typically 1.5× wider and 2.4× taller than the ROI, so the refiners work with a focused image instead of searching the whole frame. If confidence is low, DetNet retries with an alternative model.</p>
            <Fig src="dia-spotter.webp" alt="The DetNet spotter diagram: thumbnail, five blocks, the head with score, dx, dy, w and h, and the rough box out" cap="The Spotter network (DetNet)" />
            <p><strong>Refiner network (RefNet).</strong> The Refiner refines the selection of the ROI. It runs twice: first from the output of the spotter; its new ROI is expanded (×1.5 and ×2.4) and passed back into the same refiner for a second run. RefNet is 4 blocks of 3 × 3 convolution, ReLU and 2 × 2 max-pool that turn the 256 × 96 crop into 32 maps of 32 × 12 values. Each column of each map is compressed into an average, producing a 32 × 32 column average map; likewise each row, producing a 32 × 12 row average map. The column map runs through a 1 × 1 convolution that produces a left score and offset and a right score and offset; the highest score locates the position on the offset slice, and that offset says where the edge is. The same is done on the row map for the top and bottom edges.</p>
            <Fig src="dia-refiner.webp" alt="The RefNet refiner diagram: the crop, four blocks, the column and row average heads, and the two passes" cap="The Refiner network (RefNet)" />
            <p><strong>Cutting out the digits.</strong> The drum layout, for example 4 whole drums and 2 decimal drums (4+2), should have been set during setup. The layout is used to evenly slice the ROI into cells, one per drum, and each cell is passed to DrumNet to read the digit on the drum.</p>
            <Fig src="dia-cut.webp" alt="The window cut into six cells, then stretched into six grey 32 by 64 reader cells" cap="Cutting the region of interest into individual drums (ROI drawn by hand)" />
          </section>

          <section id="reader" className="ws-sec">
            <Head id="reader" title="DrumNet reader ensemble" />
            <p>The reader ensemble is a collection of 3 reader networks. All 3 share the same architecture but are trained from different random starting seeds, and all 3 find the digit and roll value of a given cell. Each cell is fed into all 3 readers, which produce 3 slightly different results, averaged in the voting phase to get the final reading.</p>
            <p>Each reader (206,619 parameters) is a 4-block 3 × 3 convolution, ReLU and max-pool operation that converts the 32 × 64 cell into 96 feature maps of 2 × 4. These are flattened by rearranging each 2 × 4 map into a 1 × 8 list, combined into a long list of 768 values. In the dense layer, the weighted sum of the 768 numbers with each of the 96 weights passes through a ReLU to get 96 units. To predict the digit, the weighted sum of each class (0 to 9) with the 96 units gives a probability distribution; a softmax normalises it, the highest class is the answer and its probability is the confidence. To predict the roll, the weighted sum of the 96 units with the roll weights is squished with tanh into a roll value between +0.5 and −0.5, how far the drum has rolled and in which direction.</p>
            <Fig src="dia-reader.webp" alt="A single DrumNet reader: cell, four blocks, flatten, dense layer, digit head with softmax and roll head with tanh" cap="A single DrumNet reader network" />
            <p><strong>Ensemble vote and reading.</strong> The 3 sets of probabilities (after softmax) are averaged; each reader has the same voting power, so the third reader was added as a tie breaker. The confidence and roll are averaged too. Finally the carry rule settles each drum: if the drum to the right reads 0 or 9, the drum on the left could be in transition and its roll value is acceptable; if the right drum is between 1 and 8, the left drum cannot be in transition, so the roll is negated and the digit is absolute. This catches two drums transitioning together: 79 rolling to 80 could be read as 89, and the rule knows to pick the preceding number instead.</p>
            <Fig src="dia-vote.webp" alt="The ensemble vote, roll band, carry rule and the final reading 0092.07" cap="Ensemble vote, carry rule and final reading" />
            <h3>DrumNet V10 summary</h3>
            <div className="ws-table-wrap">
              <table className="ws-table ws-kv">
                <tbody>
                  {[
                    ['Parameters', '693K (DrumNet ~620K + WindowNet ~73K)'],
                    ['Size on board', '~920 KB (DrumNet 636 KB int8 + WindowNet ~285 KB)'],
                    ['Read time', '~2.1 s (with WindowNet)'],
                    ['Training data', 'DrumNet reader: 197,204 images. WindowNet: 12,000 simulator photos + ~5,300 real-meter photos'],
                    ['Training time (DrumNet only)', '~6 h on an RTX 3080 laptop (fine-tuned from V9b); WindowNet not counted'],
                    ['Accuracy: full pipeline', '56 % (808 / 1,440)'],
                    ['Accuracy: training fit (DrumNet only)', '99.8 %'],
                    ['Accuracy: pooled test set (DrumNet only)', '93.2 % (538 / 577)'],
                    ['Accuracy: on board (DrumNet only)', '85.8 %'],
                  ].map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="ws-cap">Key figures for the on-board reading pipeline (WindowNet + DrumNet V10-s10)</p>
          </section>

          <section id="firmware" className="ws-sec">
            <Head id="firmware" title="Firmware" />
            <p>An Astra 6 agent was tasked with writing the firmware for the reader (Prototype V2) and for the M5Stack Cardputer Adv, which runs ConfigKing, the configuration console that lets onsite engineers configure readers for deployment and reconfigure them later. The agent was told to only write code using Fable 5.1.</p>
            <p>My laptop, the LoRaWAN gateway (graciously provided by Mr Lee Chang Fatt) and the Jetson Nano were set up on the same network; the Cardputer and Prototype V2 were connected over USB serial to the laptop, and all four devices were made available to the agents.</p>
            <Fig src="fw-setup.webp" alt="The firmware development setup: the laptop, Jetson Nano, LoRaWAN gateway, Prototype V2 reader and the Cardputer, with the agents reaching them over the network" cap="Firmware development setup made available to the agents" cls="plate" />
            <h3>Reader firmware</h3>
            <p>On a standard deployed reader, one cycle looks like this. Since the reader is in deep sleep most of the time, pressing the boot button wakes it for configuration.</p>
            <ReadCycle />
            <h3>Dashboard</h3>
            <p>After the reading is made it is sent to the LoRaWAN gateway, which forwards it over MQTT to the Jetson Nano, where it is stored. The Jetson serves the dashboard as a single HTML file whose JavaScript updates the values from the stored data. The dashboard is a demo and is not designed to scale to real deployments.</p>
            <Fig src="dashboard.webp" alt="The reader monitor dashboard: a bench reader card reading 0092.07 cubic metres with a low confidence chip, and history charts and a table of nine readings" cap="Reader monitor dashboard served by the Jetson Nano" />
          </section>

          <section id="payloads" className="ws-sec">
            <Head id="payloads" title="LoRaWAN and BLE payloads" />
            <p>Three uplink payloads leave the reader over LoRaWAN, each on its own port, and one BLE protocol links ConfigKing to the reader during setup.</p>
            {PAYLOADS.map((p) => (
              <div key={p.id} className="ws-payload">
                <div className="ws-payload-head"><b>{p.title}</b><span>{p.port}</span></div>
                <div className="ws-bytes" aria-label="Byte layout">{p.bytes.map(([b, l], i) => <span key={i} className="ws-byte"><b>{b}</b>{l && <i>{l}</i>}</span>)}</div>
                <div className="ws-table-wrap">
                  <table className="ws-table ws-kv ws-mono"><tbody>{p.fields.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
                </div>
              </div>
            ))}
            <h3>BLE protocol between ConfigKing and the reader</h3>
            <div className="ws-table-wrap">
              <table className="ws-table ws-kv ws-mono"><tbody>{BLE_ITEMS.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
            </div>
            <div className="ws-table-wrap">
              <table className="ws-table ws-kv ws-mono"><thead><tr><th>Command</th><th>Effect</th></tr></thead><tbody>{BLE_CMDS.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
            </div>
          </section>

          <section id="mcu" className="ws-sec">
            <Head id="mcu" title="Processor (MCU)" />
            <p>After screening multiple processors, the ESP32-S3 with 8 MB of PSRAM came out as one of the more balanced options; I chose it primarily for ease of access and my general comfort with Espressif&rsquo;s chips. The must-haves were Digital Video Port (DVP) support (non-negotiable, since the OV2640 uses it), hardware-accelerated vector or matrix instructions (non-negotiable, vital for running neural networks on a limited energy budget), low cost and low power.</p>
            <p>Three Espressif chips fit the non-negotiables: the P4, the S31 and the S3. The P4 is the most powerful, targeted at multimedia and HMI-heavy compute, much too overkill. The S31 looks to be the second-best contender, with welcome security upgrades like glitch detection and APM that help against physical tampering, 60 GPIOs, and a newer, faster core; but its deep-sleep current is 12 µA against the S3&rsquo;s 7 µA, almost double. The S3 is the most mature platform, battle-tested for nearly 6 years with plenty of community support, while the P4&rsquo;s current revision (v3.x) was only released in May 2026 and the S31 only entered mass production in July 2026.</p>
            <div className="ws-table-wrap">
              <table className="ws-table">
                <caption>Comparison of the Espressif ESP32-S31, ESP32-S3 and ESP32-P4</caption>
                <thead><tr><th>Feature</th><th>ESP32-S31</th><th>ESP32-S3</th><th>ESP32-P4</th></tr></thead>
                <tbody>
                  <tr><th scope="row">CPU architecture</th><td>Dual-core 32-bit RISC-V</td><td>Dual-core 32-bit Xtensa LX7</td><td>Dual-core 32-bit RISC-V</td></tr>
                  <tr><th scope="row">Max frequency</th><td>320 MHz</td><td>240 MHz</td><td>400 MHz</td></tr>
                  <tr><th scope="row">AI instruction accel</th><td>Accelerator instruction set</td><td>PIE instruction extension</td><td>Custom AI and DSP extensions (XespV)</td></tr>
                  <tr><th scope="row">GPIO</th><td>60</td><td>45</td><td>55</td></tr>
                  <tr><th scope="row">LCD / camera</th><td>RGB · I80 · DVP</td><td>RGB · I80 · DVP</td><td>RGB · I80 · DVP</td></tr>
                  <tr><th scope="row">JPEG codec</th><td>Supported</td><td>Not supported</td><td>Supported</td></tr>
                  <tr><th scope="row">Security</th><td>Secure Boot, crypto accelerators, SDC, XTS_AES, TRNG, Key Manager, Glitch Detector, DPA, APM, TEE</td><td>Secure Boot, Flash Encryption, crypto accelerators (SHA, AES, RSA, HMAC, RSA_DS, RNG)</td><td>Secure Boot, OTP, crypto and security components, Key Manager, PMS</td></tr>
                  <tr><th scope="row">Light-sleep current</th><td>50 µA</td><td>240 µA</td><td>75 µA</td></tr>
                  <tr><th scope="row">Deep-sleep current</th><td>12 µA</td><td>7 µA</td><td>12 µA</td></tr>
                  <tr><th scope="row">Low-power coprocessor</th><td>Not supported</td><td>Supported</td><td>Supported</td></tr>
                </tbody>
              </table>
            </div>
            <p>Espressif does not match the reliability and security reputation of STMicroelectronics, Nordic or NXP. The next best non-Espressif option would be the Alif Ensemble E3 series, but it is 5.5 to 8.1 times more expensive depending on quantity. The ESP32-S3 is purpose-built for IoT edge-AI applications like this, which is why I plan to continue using it.</p>
            <div className="ws-table-wrap">
              <table className="ws-table">
                <caption>Unit price of the ESP32-S3R8 vs the Alif Semiconductor Ensemble E3 by order quantity (USD)</caption>
                <thead><tr><th>Quantity</th><th>ESP32-S3R8 (LCSC)</th><th>Alif E3 (Mouser)</th><th>E3 ÷ S3</th></tr></thead>
                <tbody>
                  <tr><th scope="row">1</th><td>$3.02</td><td>$16.72</td><td>5.5×</td></tr>
                  <tr><th scope="row">100</th><td>$2.19</td><td>$15.82</td><td>7.2×</td></tr>
                  <tr><th scope="row">~1,000</th><td>$2.06 (1,000+)</td><td>$16.78 (1,500 reel)</td><td>8.1×</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="battery" className="ws-sec">
            <Head id="battery" title="Battery technology" />
            <p>The two most important factors are the ability to adapt to a wide range of temperatures and weather conditions, and a low self-discharge rate: the readers could sit in a cold, dark, damp utility closet or in extreme heat under direct sunlight, and they are in deep sleep for most of a ~2-year life. Lithium coin cells are the first choice for ultra-long-life IoT, but they do not have nearly enough capacity to run the OCR model, LoRa and the camera for 2 years. That is why I decided on Li-SOCl2 cells (bobbin or spiral not yet decided); they are widely used in industrial IoT where conditions vary drastically, and self-discharge only ~1 to 3 % a year.</p>
            <div className="ws-table-wrap">
              <table className="ws-table ws-battery">
                <caption>Comparison of primary battery chemistries used in IoT devices</caption>
                <thead><tr><th>Chemistry</th><th>Example cell</th><th>V</th><th>Wh/kg · Wh/L</th><th>Self-discharge</th><th>Pulse current</th><th>Temp</th><th>Typical IoT use</th><th>Watch out for</th><th>Price (USD/cell)</th></tr></thead>
                <tbody>
                  {[
                    ['Li-SOCl2 bobbin', 'Saft LS33600, Tadiran TL-5930, EVE ER34615', '3.6', '~610 · ~1,180', '<1 %/yr', 'Low (D cell: 250 mA continuous, 400 mA for 0.1 s)', '−60 to 85 °C', 'Water/gas meters, asset trackers, 10 to 20 yr sensors', 'Passivation and voltage delay after idle periods, poor at high current, cannot be charged', '~$8 to 12 (EVE); ~$19 to 30 (Saft/Tadiran D)'],
                    ['Li-SOCl2 spiral', 'Saft LSH20', '3.6', '~490 · ~930', '~3 %/yr', 'High (1.8 A continuous, 4 A pulse)', '−60 to 85 °C', 'Devices with motors, valves, GSM/NB-IoT bursts', 'Higher self-discharge, lower capacity than bobbin', '~$28 to 42 (D)'],
                    ['Li-SOCl2 + hybrid layer capacitor', 'Tadiran PulsesPlus', '3.6', 'Same as bobbin', '<1 %/yr', 'Very high (HLC: 2 A pulses)', '−40 to 85 °C', 'Cellular/LoRa meters needing long life plus big TX pulses', 'Cost, larger pack, fewer suppliers', '~$20 to 40 (AA/C); ~$40 to 60 (D)'],
                    ['Li-MnO2 cylindrical', 'CR123A, Saft LM33600', '3.0', '~270 · ~600 (CR123A)', '~1 to 3 %/yr', 'High (CR123A: 1.5 A continuous)', '−40 to 70 °C', 'Smoke alarms, smart locks, security sensors', 'Lower capacity than Li-SOCl2', '~$2 to 6 (CR123A); ~$30+ (LM33600)'],
                    ['Li-MnO2 coin', 'CR2032, CR2450', '3.0', '~225 (CR2032)', '~1 %/yr', 'Very low (tens of mA; needs a bulk cap for BLE)', '−30 to 70 °C', 'BLE beacons, tags, RTC backup', 'High internal resistance, capacity falls sharply under pulses', '~$0.30 to 1.50'],
                    ['Li-FeS2', 'Energizer L91 (AA)', '1.5', '~300 to 330 · ~550 to 600', '~1 %/yr (20-yr shelf rating)', 'High (2.5 A continuous)', '−40 to 60 °C', 'Drop-in AA replacement, field-swappable sensors', '1.8 V fresh, can over-volt parts designed for alkaline', '~$1.50 to 3'],
                    ['Alkaline', 'Energizer E91 (AA)', '1.5', '~150 to 170 · ~450 (low drain)', '~2 to 3 %/yr', 'Moderate, capacity collapses at high drain', '−18 to 55 °C', 'Consumer gadgets, remotes, low-cost sensors', 'Leakage, poor in heat and cold, sloping voltage', '~$0.30 to 1'],
                    ['Zinc-air', 'Hearing-aid cells, some trackers', '1.4', '~400+', 'Low while sealed, dries out within weeks once opened', 'Low', '~0 to 50 °C', 'Short-life wearables, hearing aids', 'Needs airflow, humidity-sensitive, short life once activated', '~$0.30 to 0.80'],
                    ['Silver oxide', 'SR626, SR44', '1.55', '~130', '~5 to 10 %/yr', 'Low', '−10 to 60 °C', 'Watches, small medical sensors', 'Tiny capacity, expensive', '~$0.50 to 3'],
                  ].map((row) => <tr key={row[0]}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}
                </tbody>
              </table>
            </div>
            <p className="ws-note">Prices are approximate single-cell retail prices from US battery distributors (October 2026); volume pricing is typically 10 to 35 % lower. Energy density and current figures are typical datasheet values.</p>
          </section>

          <section id="power" className="ws-sec">
            <Head id="power" title="Power optimisation" />
            <p>The reader needs to run for very long durations, up to 2 years, on a set of batteries. The ESP32-S3 is relatively efficient at heavy tasks like the vector maths neural networks need, but it is nowhere near as efficient as Nordic&rsquo;s nRF line-up, so these are the strategies to reduce energy use. The wireless radios of the ESP32-S3 are turned off in deployment; they are only used for initial configuration.</p>
            <h3>Software-based optimisations</h3>
            <p>Still work in progress: most are implemented, but their energy impact has not been conclusively measured.</p>
            <p><strong>In-camera sub-sampling.</strong> The OV2640 supports up to 1600 × 1200 but also sub-sampling modes of 800 × 600 SVGA and 400 × 296 CIF. Based on my testing, SVGA yields the best balance of quality and speed; the less time the camera stays on, the less energy it consumes, and 800 × 600 means the network processes 4× less information than 1600 × 1200. No proper tests were conducted to back up the accuracy claim, although accuracy did not suffer greatly in my experience.</p>
            <Grid2 items={[['ov2640-svga.webp', 'OV2640 SVGA sub-sampling mode diagram showing which pixels are skipped'], ['ov2640-cif.webp', 'OV2640 CIF sub-sampling mode diagram']]} cap="SVGA and CIF sub-sampling modes of the OV2640 (OmniVision Technologies, 2006)" cls="contain" />
            <div className="ws-modes">
              {[
                ['mode-1600-crop.webp', 'mode-1600-full.webp', '1600 × 1200', '350 ms capture time'],
                ['mode-800-crop.webp', 'mode-800-crop.webp', '800 × 600', '89 ms capture time'],
                ['mode-400-crop.webp', 'mode-400-crop.webp', '400 × 296', '61 ms capture time'],
              ].map(([crop, full, res, t]) => (
                <figure key={res} className="ws-mode">
                  <img src={I + crop} alt={`${res} capture, crop of the drums`} loading="lazy" decoding="async" className="ws-mode-crop" />
                  <img src={I + full} alt={`${res} capture, full frame`} loading="lazy" decoding="async" />
                  <figcaption><b>{res}</b><span>{t}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="ws-cap">Comparison of OV2640 capture modes: crop of the drums (top), full frame (bottom) and capture time</p>
            <p><strong>PWM dimming on the LEDs.</strong> I had initially dismissed PWM dimming because the OV2640 uses a rolling shutter, which could capture between the off-cycles of the PWM signal and show banding. But the OV2640 did not suffer from any banding, so I run the LEDs at 20 kHz with 50 % duty cycle. This saves some fraction of power and adds brightness control.</p>
            <Grid2 items={[['led-banding.webp', 'A capture showing horizontal banding across the meter face'], ['led-no-banding.webp', 'A capture with PWM-dimmed LEDs and no banding']]} cap="Banding vs no banding when the LEDs are PWM-dimmed" />
            <p><strong>In-camera greyscale.</strong> The greyscale filter is done on the camera by the OV2640 and returns a slightly smaller image file; the impact is none to minimal, but it was easy to implement.</p>
            <Grid2 items={[['cam-grey.webp', 'The meter captured in greyscale by the camera'], ['cam-colour.webp', 'The same meter captured in colour']]} cap="In-camera greyscale vs colour capture" />
            <p><strong>Hardware-accelerated vector instructions and model quantisation.</strong> Earlier builds of DrumNet ran at full-precision Float32 on the ESP32-S3, slow and inefficient. The ESP32-S3 has built-in vector instructions, accessed through the ESP-NN library, that perform Multiply and Accumulate (MAC) operations multiple times per clock cycle. After quantising DrumNet to 8 bits, capture-to-prediction time was cut from 61 s to 17 s, roughly 3.6× faster. Efficiency gains have not been properly measured, although I am sure there were big improvements there too.</p>
            <h3>Hardware-based optimisations</h3>
            <ul>
              <li><b>Low Iq, high-efficiency DC-DC converters.</b> The OV2640 needs 1.5 V and 2.8 V. Buck converters have better efficiency than LDOs, but their high quiescent current and more complex design add cost and board space for close-to-negligible gains, and can introduce artefacts in the image, so I stuck with LDOs with low quiescent current. The main 3.3 V rail would be swapped for a special low-Iq (~75 nA) buck-boost converter, the TI TPS63900, which handles the current the LoRa and MCU might need, holds 3.3 V whatever the input, and is rated for Li-SOCl2 batteries.</li>
              <li><b>Ultra-low-power timer ICs.</b> Not strictly necessary, but a timer IC like the Ambiq AM1805 can turn off all the components and turn them back on on a schedule. The gain would probably be minimal, since most components already draw little in deep sleep.</li>
              <li><b>LoRaWAN.</b> Chosen for its superior low power and long range, and because its open standard lets the operator entirely own and run their network, unlike Sigfox and NB-IoT which tap into privately owned networks.</li>
            </ul>
          </section>

          <section id="camera" className="ws-sec">
            <Head id="camera" title="Camera choice" />
            <p>I needed a capable macro camera, wide enough to capture the full width of the meter barrels while in close proximity to the meter. There were no options that were both low cost and of the correct connector type from reputable retailers, so I bought two OV2640 cameras from Lazada, one with a 160° field-of-view lens and one with 120°. They were not advertised as macro, but an intrinsic property of wide-angle lenses is their ultra-short focusing distance and much deeper apparent depth of field, keeping more of the foreground and background in focus.</p>
            <p>The test was simple: take an image with both cameras at 3 cm, 4 cm and 6 cm, against two focusing charts. Chart A was hand-drawn by me; Chart B is Stephen H. Westin&rsquo;s ISO 12233 chart from Cornell. Using a spare ESP32-S3 cam board and a simple web applet written with an AI agent, the camera was mounted to the side of a box with a ruler starting from the lens, and the charts sat on a movable stand.</p>
            <Grid2 items={[['chart-a.webp', 'Chart A, a hand-drawn focus chart with diagonal lines and a letter A'], ['chart-b.webp', 'Chart B, the ISO 12233 resolution test chart']]} cap="Focus charts: Chart A (left, hand-drawn) and Chart B (right)" cls="contain" />
            <Grid2 items={[['focus-setup.webp', 'The focus test box with the ESP32 cam board on the side and a ruler on the floor'], ['focus-applet.webp', 'The camera web applet used to set the camera up and snap a picture']]} cap="Focus test setup (left) and the camera web applet (right)" cls="contain" />
            <p>Every capture from the test is below. Pick a lens, a distance and a chart; the three crops are cut from the same frame.</p>
            <FocusLab />
            <p>Based on the results, it is very clear that the 120° variant of the OV2640 is unable to focus well on close objects. These are fixed-focus lenses, so focus is permanently set at the factory. Moving forward I use the 160° variant at 4 cm.</p>
            <p>One more finding: on the 160° variant, focus seems to taper off towards the left of the image from the centre, while the effect is nowhere near as strong in the opposite direction. The paper was positioned perpendicular to the camera with no major slants or dents. The effect was not present in the 120° variant, which had a conical and even tapering, as expected. This points towards a manufacturing defect, but I have no extra cameras to test if that is true.</p>
            <Fig src="focus-taper.webp" alt="Chart A tinted red on the left where focus is bad and green on the right where focus is good" cap="Focus tapering effect of the 160° lens: bad focus on the left, good focus on the right" cls="small" />
          </section>

          <section id="v1" className="ws-sec">
            <Head id="v1" title="Prototype V1" />
            <p>Prototype V0.5 (ESP32-EYE) lacked easily accessible GPIO pins for secondary development, so Prototype V1 was created. It added a LoRa radio, LED pins and limit switches; an M5Stack Cardputer LoRa cap was repurposed for the radio, and a perfboard mounted all the components together. Prototype V1 was primarily used by the test rig to capture images for training and to evaluate model performance.</p>
            <V1Block />
            <p className="ws-cap">Prototype V1 block diagram</p>
            <p>Prototype V1 was mounted onto the V1 enclosure, designed to be fitted above a water meter but instead used as part of the test rig to improve model performance.</p>
            <div className="ws-trio">
              {[['v1-rig-a.webp', 'The purple V1 enclosure cap with the camera and LEDs, mounted on a tripod'], ['v1-rig-b.webp', 'The side of Prototype V1 with the M5Stack LoRa cap and ESP32-S3 cam board wired to the enclosure'], ['v1-rig-c.webp', 'Prototype V1 on its tripod in front of a monitor showing the MeterSim display']].map(([s, a]) => <img key={s} src={I + s} alt={a} loading="lazy" decoding="async" />)}
            </div>
            <p className="ws-cap">Prototype V1 assembled: limit switches, LEDs and the OV2640 in the cap, the M5Stack LoRa cap and the ESP32-S3 CAM behind</p>
          </section>
        </div>
      </div>

      {/* ── Prototype V2: the scroll-driven 3D chapter, full bleed ── */}
      <section id="pcb" className="ws-pcb" aria-label="Prototype V2: PCB and enclosure">
        <div className="ws-wrap"><div className="ws-pcb-intro">
          <span className="ws-sec-n">Chapter - {NUM.pcb}</span>
          <h2>Prototype V2</h2>
          <p>Prototype V2 is a shrunken-down version of Prototype V1. It fits in tighter spaces and let me explore smaller components like the Wio-SX1262 LoRa module from Seeed Studio. It has built-in battery management, power circuitry for the camera and fan, PWM-dimmable LED lights and a LoRa module. Scroll through the board, component by component, rendered from the real KiCad and CAD files.</p>
          <p className="ws-note">Prototype V2 was developed before the writing of the report, so some deprecated decisions are still part of it: the fan, proposed for high-humidity conditions that may cause fogging, will be dropped instead if the readings are not reliable; and the power circuitry pre-dates the decision to use Li-SOCl2 cells.</p>
        </div>
        </div>
        <WaterslopChapter />
      </section>

      <div className="ws-wrap ws-body ws-body-2">
        <Rail />
        <div className="ws-content art-body">
          <section id="v2" className="ws-sec">
            <Head id="v2" title="Circuits and layout" />
            <h3>Planning</h3>
            <div className="ws-bom">
              <div><b>Primary components</b><ul><li>ESP32-S3 WROOM1 N16R8, the chosen MCU</li><li>Wio-SX1262 all-in-one LoRa module from Seeed Studio (SPI)</li><li>SHT-40 humidity and temperature sensor (I²C)</li></ul></div>
              <div><b>LiPo battery protection and charging</b><ul><li>BQ24074RGTR battery charging IC</li><li>BQ29700DSER battery protection IC</li><li>MAX17048G+T10 battery monitoring IC (I²C)</li></ul></div>
              <div><b>Other active components</b><ul><li>MIC5365-2.8, 2.8 V linear LDO regulator (camera)</li><li>TPS7A0315PDBVR, 1.5 V linear LDO regulator (camera)</li><li>TPS63021DSJR, 3.3 V buck-boost converter (general)</li><li>TPS61023DRLR, 5 V boost converter (fan, deprecated)</li><li>AO3400A N-channel MOSFET</li><li>USBLC6-2SC6Y USB ESD protection</li></ul></div>
              <div><b>Passive components</b><ul><li>Resistors from 22 R to 732 K, 0402 and 0603</li><li>Capacitors from 0.1 µF to 22 µF, 0402 and 0603</li><li>Inductors 1 µH and 1.5 µH, 1210</li><li>Push buttons and slide switches, SS14 Schottky diode (for the deprecated fan), flat-top LEDs, USB-C connector</li></ul></div>
            </div>
            <h3>Power circuit</h3>
            <p>I designed the board in KiCad, starting with the DC-DC conversion: 5 V for the deprecated fan, 3.3 V for the MCU, LoRa module and camera, then 1.5 V and 2.8 V for the camera itself, and finally the battery charging, monitoring and protection circuitry. A buck-boost converter was used for the 3.3 V rail because the battery voltage can sit above or below 3.3 V depending on its state of charge; the 1.5 V and 2.8 V LDOs were chosen for their low noise as they power the camera; and a boost converter was used for the fan, which draws significant power and benefits from the boost converter&rsquo;s efficiency.</p>
            <div className="ws-circuits">
              {CIRCUITS.map((c) => (
                <figure key={c.k} className="ws-circuit">
                  <div className="ws-circuit-imgs"><img src={`${I}sch-${c.k}.webp`} alt={`${c.t}, schematic`} loading="lazy" decoding="async" /><img src={`${I}loc-${c.k}.webp`} alt={`${c.t}, location on the board`} loading="lazy" decoding="async" className="ws-loc" /></div>
                  <figcaption><b>{c.t}</b><span>{c.d}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="ws-cap">Power circuits: schematic (left) and location on the board (right)</p>
            <h3>Peripherals and MCU</h3>
            <div className="ws-circuits">
              {PERIPHERALS.map((c) => (
                <figure key={c.k} className="ws-circuit">
                  <div className="ws-circuit-imgs"><img src={`${I}sch-${c.k}.webp`} alt={`${c.t}, schematic`} loading="lazy" decoding="async" /><img src={`${I}loc-${c.k}.webp`} alt={`${c.t}, location on the board`} loading="lazy" decoding="async" className="ws-loc" /></div>
                  <figcaption><b>{c.t}</b><span>{c.d}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="ws-cap">MCU and peripheral circuits: schematic (left) and location on the board (right)</p>
            <h3>PCB layout and manufacturing</h3>
            <p>I sourced the components from DigiKey and sent the PCB to JLCPCB for manufacturing; it is a 4-layer board.</p>
            <Fig src="kicad-schematic.webp" alt="The full board schematic from KiCad" cap="Full board schematic from KiCad" diagram />
            <div className="ws-trio pcbviews">
              <img src={I + 'pcb-layout.webp'} alt="The PCB layout in KiCad, both copper layers" loading="lazy" decoding="async" />
              <img src={I + 'pcb-3d-top.webp'} alt="3D render of the top of the board from KiCad" loading="lazy" decoding="async" />
              <img src={I + 'pcb-3d-bottom.webp'} alt="3D render of the bottom of the board from KiCad" loading="lazy" decoding="async" />
            </div>
            <p className="ws-cap">PCB layout and 3D renders of the board from KiCad</p>
            <p>The PCB was designed to be roughly the same size as a typical ESP32-S3 dev board. This compact design allows a smaller housing that fits meters in tighter spaces.</p>
            <Fig src="v2-vs-devboard.webp" alt="The Prototype V2 PCB lying next to an ESP32-S3 development board of nearly the same size" cap="Prototype V2 PCB next to an ESP32-S3 development board" />
          </section>

          <section id="assembly" className="ws-sec">
            <Head id="assembly" title="PCB assembly" />
            <p>First a stencil spread solder paste onto the pads, then the components were placed and the solder reflowed on a hotplate. As I was preparing to solder, I found I had forgotten to add the battery protection IC to my order, so I opted not to use the battery for this part of the project: the first of the three problems I faced.</p>
            <Grid2 items={[['stencil.webp', 'The solder stencil for the board'], ['paste.webp', 'The bare board with solder paste applied to every pad']]} cap="The solder stencil (left) and the board with solder paste applied (right)" />
            <Fig src="components-laid.webp" alt="All the surface-mount components laid out on the desk in labelled strips before assembly" cap="Components laid out for assembly" />
            <p>It took about 9 hours to fully assemble the board without any visually noticeable defects. I stripped a USB-C cable to connect it to my benchtop power supply at 5 V with a 400 mA current limit. Almost immediately after I turned it on, the current limit alarm beeped: the board was drawing the maximum 400 mA and the voltage dropped to 4.2 V. I promptly cut power and started investigating.</p>
            <Fig src="bench-supply.webp" alt="The assembled board wired to a benchtop power supply" cap="The assembled board on the benchtop power supply" cls="small" />
            <p>Raising the limit to 600 mA, an unreasonable amount of current for this board with the fan unplugged, hit the limit again, so there had to be a short. Probing with a multimeter in continuity mode was extremely hard with components this small, so I placed my finger over the whole board and turned on the supply to feel what got hot: the battery charging IC, within roughly 2 seconds. I desoldered it with a hot air gun, wicked the pads, applied fresh paste and fitted a new charging IC, just to be safe. Same problem.</p>
            <p>The next downstream component was the 3.3 V buck-boost chip. Reflowing it with the hot air gun produced the same result, so I inspected its solder joints closely under a microscope.</p>
            <div className="ws-scope">
              {[['scope-bottom.webp', 'Bottom'], ['scope-top.webp', 'Top'], ['scope-topdown.webp', 'Top down'], ['scope-left.webp', 'Left'], ['scope-right.webp', 'Right'], ['scope-pads.webp', 'Pads']].map(([s, l]) => (
                <figure key={s}><img src={I + s} alt={`Microscope view of the 3.3 V buck-boost chip, ${l.toLowerCase()}`} loading="lazy" decoding="async" /><figcaption>{l}</figcaption></figure>
              ))}
            </div>
            <p className="ws-cap">Microscope views of the 3.3 V buck-boost chip</p>
            <p>Replacing the chip with a fresh one removed the short but gave no output at all, and then I noticed the enable-pin pad of the footprint was lifted and broken; it must have failed from the many reflow attempts. During that process the double-sided tape holding the camera to the board failed, so I removed the camera (key to this problem). With no saving this circuit, I injected 3.3 V externally through thin enamel wires tapped to the 3.3 V rail. The short went away: 70 mA at 3.3 V, well within the expected range, and holding the ESP32-S3&rsquo;s reset button dropped it to 50 mA, so the chip was working. A USB cable from my computer detected the board, which was a relief, and I asked an agent to write a simple blinky program to flash. Powering from the bench supply was too clunky, so I scrapped an old ESP32 board for its proven regulators to turn the 5 V USB input into 3.3 V, bypassing the buck-boost circuit entirely.</p>
            <Fig src="bypass-3v3.webp" alt="The scrapped ESP32 dev board wired to Prototype V2 to supply 3.3 V from its own regulator" cap="3.3 V bypass using the regulator of a scrapped ESP32 board" cls="small" />
            <p>With the board powering on correctly, I reconnected the camera, and to my surprise the current limit tripped yet again. The camera was the actual culprit. A second camera produced the same result, which pointed at the FPC ribbon connector: not soldered correctly, or a shorted joint. I tried replacing the connector and varying the solder on the pads, but the connectors were fragile, could not survive the hot air gun, and I broke three of them. Working with my last one, I noticed the camera connector was flipped around: pin 1 did not line up with the connector in the normal orientation the camera is mounted in, but at the opposite end. The only fix was to flip the camera around instead.</p>
            <Grid2 items={[['camera-pinout.webp', 'The camera FPC against the board footprint, showing pin 1 of the camera at the opposite end from pin 1 of the board'], ['camera-flipped.webp', 'The camera mounted flipped around on the board to match the mirrored connector']]} cap="Mirrored camera pin-out (left) and the flipped camera (right)" cls="contain" />
            <p>After flipping the camera, the board booted and the camera was detected. Taking a photo threw a &ldquo;Camera Frame Timeout&rdquo; error, so I tested the connectivity of PCLK and XCLK, the timing lines, with my multimeter. PCLK had no connection from the camera connector to the MCU.</p>
            <Grid2 items={[['pclk-testpoint.webp', 'The PCLK test point on the board under a microscope'], ['pclk-pin.webp', 'The PCLK pin at the camera connector footprint in KiCad']]} cap="PCLK test point (left) and PCLK pin at the camera connector (right)" cls="contain" />
            <p>After some attempts, and with help from Mr Soh, the connector was soldered successfully, and the camera took images without problems.</p>
            <Fig src="first-capture.webp" alt="The first, very blurry image captured by Prototype V2, a bright blob on a desk" cap="First successful image capture on Prototype V2" cls="small" />
            <p>In hindsight, the camera, not the 3.3 V buck-boost converter, was most likely causing the short. I should have assembled the board in stages and only moved on when the previous stage was confirmed to work. The 3.3 V circuit would not have been damaged if not for that mistake, but due to time constraints I had to rush.</p>
          </section>

          <section id="enclosure" className="ws-sec">
            <Head id="enclosure" title="Interior enclosure and meter adapter" />
            <p>The interior enclosure houses the PCB and batteries of Prototype V2. I exported the 3D file from KiCad into Onshape as the reference to design the enclosure around, and quickly modelled the exact shape and size of the camera for better accuracy.</p>
            <Fig src="enc-reference.webp" alt="The KiCad 3D model of the board with the camera modelled on, used as the reference in Onshape" cap="KiCad 3D model used as the reference for the enclosure design" diagram />
            <p>The enclosure adopts a toolless design: no screws or tools are needed to assemble or disassemble it.</p>
            <div className="ws-encl">
              {[
                ['Side clips', 'The side clips allow the top and bottom halves of the enclosure to snap on with no screws needed.', ['enc-clips.webp']],
                ['Lateral movement stopper', 'Grooves are cut out from the bottom half, where pins from above are inset, to prevent lateral slide.', ['enc-stopper-a.webp', 'enc-stopper-b.webp']],
                ['PCB holder', 'Platforms on the bottom of the case and posts from above hold the PCB to the case without any screws.', ['enc-holder-a.webp', 'enc-holder-b.webp']],
                ['LoRa antenna cutout', 'A special hole lets the LoRa IPEX cable interface with the LoRa transceiver on the board.', ['enc-antenna.webp']],
              ].map(([t, d, imgs]) => (
                <figure key={t as string} className="ws-encl-item">
                  <div className="ws-encl-imgs">{(imgs as string[]).map((s) => <img key={s} src={I + s} alt={`${t}: enclosure CAD view`} loading="lazy" decoding="async" />)}</div>
                  <figcaption><b>{t}</b><span>{d}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="ws-cap">Notable features of the interior enclosure</p>
            <p>The fit and finish of the final enclosure was great, but I had to cut a hole to fit the flipped camera from the incorrect pin layout of the PCB assembly stage.</p>
            <Grid2 items={[['enc-final.webp', 'The final printed interior enclosure with the board inside'], ['enc-revisions.webp', 'Earlier printed revisions of the enclosure, labelled V1 to V3']]} cap="Final interior enclosure (left) and earlier revisions (right)" cls="contain" />
            <h3>Exterior enclosure (meter adapter)</h3>
            <p>I edited my original water meter adapter so the camera sits about 4 cm away from the meter.</p>
            <Grid2 items={[['adapter-top.webp', 'The meter adapter CAD model, top view'], ['adapter-bottom.webp', 'The meter adapter CAD model, bottom view, with the reader inside']]} cap="Meter adapter: top view (left) and bottom view (right)" cls="contain" />
            <Fig src="adapter-distance.webp" alt="A CAD section through the adapter showing the camera about 4 cm from the meter face" cap="Distance from the camera lens to the meter face (about 4 cm)" diagram />
            <p>The adapter is two parts. The bottom half mounts against the meter. While modelling, I had forgotten the tabs on the side of the meter that lock the lid in place, so the bottom half could not sit flush against the meter face. Luckily it was printed with the layer lines parallel to the meter face, so a few simple cuts with side cutters made room for the tabs.</p>
            <Grid2 items={[['adapter-cut-a.webp', 'The bottom half of the adapter with cuts made for the meter lid tabs'], ['adapter-cut-b.webp', 'The adapter sitting flush on the meter after the cuts']]} cap="Cuts made so the adapter sits flush against the meter" />
            <p>The top half was designed with a much larger diameter than the bottom half. This creates more space to adjust Prototype V2&rsquo;s position for a better alignment to the meter barrels, and lets me reuse the top half with other meters by redesigning only a bottom half for each new meter.</p>
            <Grid2 items={[['adapter-done-a.webp', 'The completed adapter with the reader fitted, seen from above'], ['adapter-done-b.webp', 'The completed adapter mounted on the meter']]} cap="The completed adapter" />
          </section>

          <section id="calibration" className="ws-sec">
            <Head id="calibration" title="Camera calibration" />
            <p>With the help of an AI agent, I ran a test to find how each camera setting affects the image, aiming for a clean, acceptable image while minimising LED on-time and capture time. SVGA (800 × 600) sub-sampling was already the preferred resolution. The test covered exposure, gain, PWM duty cycle and frequency, pulse duration, contrast, raw gamma and LED start delay.</p>
            <CalibrationLab />
            <p className="ws-note">Digit mean is the average brightness in the digit region; contrast is its 90th to 10th percentile intensity range. Images retain their original brightness. Typical examples are individual captures near the group median; the pulse-duration row includes the darkest 60 ms repeat. Contrast, raw gamma, brightness and LED delay were retested after correcting the shared grayscale and tone controls, with three passes of five captures per level; the first capture of each block was retained but excluded from the 12-sample summaries. LED on-time is estimated from the measured illumination window and PWM duty, not measured electrical energy. Results apply to this fixed scene; OCR accuracy was not tested.</p>
          </section>

          <section id="configking" className="ws-sec">
            <Head id="configking" title="Setup and configuration (ConfigKing)" />
            <p>DrumNet and the firmware are loaded onto Prototype V2, and the LoRa device address is baked into the firmware during flashing. Setup is done with an M5Stack Cardputer over BLE and ESP-NOW. The Cardputer runs a piece of firmware called ConfigKing, which automatically detects nearby unconfigured readers and prompts the user to set them up; it also reconfigures configured readers. Since the readers are mostly asleep, pressing the boot button wakes one up to be discoverable.</p>
            <Fig src="configking.webp" alt="The eight-step reader setup procedure on the ConfigKing screen: discovery, identification, drum layout, camera, ROI refinement, test read, LoRa test, review and save" cap="Reader setup procedure using ConfigKing. Click to zoom." />
            <ol className="ws-steps">
              {CONFIGKING.map(([t, d]) => <li key={t}><b>{t}.</b> {d}</li>)}
            </ol>
          </section>

          <section id="conclusion" className="ws-sec">
            <Head id="conclusion" title="Conclusion" />
            <p>Due to time constraints, the project stops as it currently is; many issues still need to be addressed before this could be a viable solution.</p>
            <h3>Energy use and longevity</h3>
            <p>The energy use of this meter has not been measured or tested for its rated 2-year life cycle. As Prototype V2 stands, I do not think that rating is possible. A third revision will be required to implement more energy-saving components before it is reasonable to start monitoring energy consumption. The current firmware is close to my targeted level of efficiency and will need less work to reach an acceptable level.</p>
            <h3>WindowNet and accuracy</h3>
            <p>The 56 % reading accuracy of DrumNet V10 is a far cry from the targeted 99 %. The primary bottleneck is WindowNet: most erroneous readings were caused by its inability to find the correct ROI, so the readers received bad data. Considerable work still needs to go into WindowNet. The DrumNet readers also show signs of under-training; showing them a meter they have not seen before yields a low confidence. They are trained on a moderately large dataset, but it was dominated by the 9 meters SimGen2 could generate, so the variation was small. A more diverse and larger dataset could help both WindowNet and the readers.</p>
            <h3>Shell and mounting</h3>
            <p>The current shell is much too bulky for a realistic deployment; a fundamental redesign is needed for the shell, PCB and mount. The camera is the primary cause of the high Z-height, so a shorter camera that is better at macro imaging needs to be selected. Weather sealing will also need different materials and designs.</p>
            <h3>Closing remarks</h3>
            <p>Much of this project was my first attempt at something new. I am not exactly satisfied with the outcome, but I am still proud of the knowledge and experience I have gained. I am grateful for the rare opportunity of time, resources and support to learn and experiment the way I do; without it this project would not have been possible. Thank you to Mr Alex Oh (NYP) for his guidance, expertise and encouragement, to Mr Soh (NYP), without whom I would not have got the camera working, and to Mr Lee Chang Fatt (NYP) for the LoRaWAN gateway.</p>
          </section>

          <section id="report" className="ws-sec">
            <Head id="report" title="The report" />
            <p>Everything above follows the project report, written for NYP Electronic and Computer Engineering. Read the full document, with its references, tables and every figure, here.</p>
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
            <p className="ws-note">AI tools were used heavily in the development of this project. Most of the report was written by me in my own words, except for the introduction section and certain graphs; other AI use includes research, chart generation and data verification. This project scores a Level 3 on my scale of AI use.</p>
            <div className="ws-end">
              <span>Check out the next article</span>
              <a href="/#portfolio-items-holder" className="ws-btn ghost">All projects <ArrowRight /></a>
            </div>
          </section>
        </div>
      </div>

      <ArticleRecommendations exclude="proj-waterslop" />

    </main>
  );
}
