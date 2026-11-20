import { usePeekKit, type PeekLabels } from './kit';

/*
  The peek reader in English: every project's write-up (PeekBody), its title
  (TITLES) and the reader's fixed words (LABELS). Another language is a copy
  of this file with the words translated (components/peeks/<lang>.tsx), added
  to FEEDS in components/ProjectPeek.tsx. Image paths and links stay as they
  are; internal links are localized by the kit.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Pantry Expiry Tracker', 'proj-ruler': 'Scroll Ruler', 'proj-cadmouse': '3D CAD Mouse', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus Dispenser', 'proj-elecf': 'ELEC-F Concept',
  'proj-kauli': 'Kauli Concept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Web Development', 'proj-mc': 'Minecraft Live Map',
};

export const LABELS: PeekLabels = {
  soon: 'Write-up coming soon',
  next: 'Next: {title}',
  untitled: 'Project {n}',
  pullHint: 'Keep scrolling for {title}',
  pullAria: 'Open the next project: {title}',
  end: "That's every project",
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Project June rover', ['Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 Weeks · Self-Learnt · 3D Design · Cellular · WebRTC · MQTT</p>
          <p className="hp-rd-lead">A 5G rover I built in three weeks, which streams three live cameras, carries a full sensor suite and drives from an Xbox controller anywhere with signal.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Three live video streams', <><p>Three cameras stream live over WebRTC through a TURN server, so the feeds get through cellular NAT with low latency.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Project June cameras" loading="lazy" /></>)}
          {chapter('02', 'Control and telemetry', <p>MQTT carries control and telemetry over a Mosquitto broker, with custom PWM motor control and servo steering driven from an Xbox controller.</p>)}
          {chapter('03', 'A full sensor suite', <><p>The rover carries a Neo8M GPS, a gyroscope, an accelerometer, a magnetometer, a barometer, an ultrasonic distance sensor, a DHT11 and a TEMT6000 light sensor.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="The Project June system architecture" loading="lazy" /></>)}
          {cta('The full build log', 'The article covers the photos, the architecture and every problem I hit.', 'Read the full article', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, a cyan desk pet, on the M5Stack Tab5', ['Internship Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 Week · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">A desk pet on an M5Stack Tab5 whose brain is the DeepSeek Harness on my server, so it can drive a browser, build its own apps and keep an eye on my other agents.</p>
          {chapter('01', 'A pet that shows its work', <><p>Pip sleeps when you leave it alone, wakes when you pick up the tablet, twists and rubs its temples while it thinks, and hops when something works. It also acts out each tool it uses, picking up binoculars to read a page or a megaphone to brief a helper.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip with a magnifying glass, binoculars, a megaphone and a paper plane" loading="lazy" /></>)}
          {chapter('02', 'It uses the screen', <p>Answers come as pages and formatted text, and Pip can click through those pages with its own cursor or ask me multiple choice questions. It also builds small apps that it keeps in a drawer, either web pages served from my server or Lua scripts that run on the tablet itself.</p>)}
          {chapter('03', 'A hub for my agents', <><p>Pip runs inside the same harness as my coding sessions, hands long jobs to helper pips, and tells me when a session finishes or needs an answer.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Helper pips at work with a notepad, a laptop, blocks, a book and a flask" loading="lazy" /></>)}
          {cta('See Pip move', 'The article shows its moods, apps and desktops and how it all connects.', 'Read the full article', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('The pantry tracker, a CoreS3 SE stacked on the QRCode module', ['Internship Project'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pantry Expiry Tracker</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">An expiry tracker for the fridge door. You scan a product&rsquo;s barcode and pick when it expires, and the screen always shows what to eat first.</p>
          {chapter('01', 'Scan, then save', <><p>The screen glows red while the scanner looks for a code, then shows the product&rsquo;s name, brand and photo from Open Food Facts or GS1 China, and you set the expiry with the Days, Weeks and Months pickers before saving it.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="The expiry picker on the tracker" loading="lazy" /></>)}
          {chapter('02', 'What to eat first', <><p>The home screen sorts the pantry by expiry and turns the count red within a day and amber within a week, while scanning something already on the list opens it instead of adding it twice.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="The home screen sorted by expiry" loading="lazy" /></>)}
          {chapter('03', 'A server does the rest', <p>A Docker container on the home network keeps the list, looks up barcodes, serves a web page for managing pantries and publishes each pantry to Home Assistant over MQTT for reminders.</p>)}
          {cta('Try the tracker', 'The article has a working copy of its screen, the demo video and how to set one up.', 'Read the full article', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('The Scroll Ruler, an AtomS3R with a Unit Scroll plugged in', ['Internship Project'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Scroll Ruler</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">A digital ruler. You press the Unit Scroll&rsquo;s wheel down and roll it along whatever you want to measure, and the AtomS3R shows the distance in centimetres.</p>
          {chapter('01', 'Calibrate once', <><p>The first time it starts, you roll exactly 10 cm along a real ruler and tap the screen to save the steps it counted, which teaches it how far the wheel travels per step. The calibration stays in flash after that.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="The ruler reading 8.2 cm" loading="lazy" /></>)}
          {chapter('02', 'Roll to measure', <p>The distance counts only while the wheel is pressed down, with the LED glowing green, so you can lift it off and set it down without losing the reading. Tapping the screen zeroes it, and holding the screen starts a new calibration.</p>)}
          {chapter('03', 'Tested off the device', <p>The calibration and distance maths sit in one file with no hardware code, so eleven unit tests check them on a computer before the firmware goes onto the AtomS3R.</p>)}
          {cta('Roll it yourself', 'The article has a working copy of the ruler, the demo video and how to flash one.', 'Read the full article', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan with four Unit ToF4M distance sensors on its head', ['Internship Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · four Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">A makeshift LiDAR. Stack-chan sweeps four distance sensors across a room with its two servos, its camera colours the points, and any browser on the same Wi-Fi shows the scan in 3D.</p>
          {chapter('01', 'The sweep', <><p>The head works through a grid row by row, from level to straight up and up to 256 degrees across, and every pose becomes one sample: a direction from the servos and a distance from the sensors.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="The finished scan of a room corner in the camera's colours" loading="lazy" /></>)}
          {chapter('02', 'Four sensors, one reading', <p>The four sensors point the same way, so each sample keeps the median of their readings, which throws out a stray one.</p>)}
          {chapter('03', 'Colour from the camera', <p>Photos taken before the sweep colour the points, and the browser pushes every pixel out to the measured distance, which made 68,206 coloured points in this scan.</p>)}
          {cta('Explore the scan', 'The article has the real scan in 3D, the demo film and how to flash one.', 'Read the full article', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('The M5Stack Capsule v1.1 that works as the 3D mouse', ['Internship Project'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D CAD Mouse</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">A wireless 3D mouse for Onshape. You click the Capsule&rsquo;s button and turn it in your hand, and the model on the screen turns with it.</p>
          {chapter('01', 'Passing as a SpaceMouse', <p>Onshape only listens to a 3D mouse through 3Dconnexion&rsquo;s driver, so the Capsule introduces itself over Bluetooth as their SpaceMouse Wireless and the driver does the rest.</p>)}
          {chapter('02', 'Following your hand', <><p>It sends how fast your hand is turning, from its gyroscope, so the model turns through the same angle your hand did. Holding the button pans instead, and twisting zooms.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Turning an enclosure in Onshape with the Capsule" loading="lazy" /></>)}
          {chapter('03', 'Tested off the device', <p>The motion maths and the button gestures sit in one library with no hardware code, so 19 unit tests check them on a computer before each flash.</p>)}
          {cta('Turn it yourself', 'The article has a working copy of its controls, the demo video and how to set one up.', 'Read the full article', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 Months · Self-Learnt · 3D Design · PCB Design</p>
          <p className="hp-rd-lead">A pair of handheld ESP32 messengers that talk to each other off-grid: text over long-range LoRa and two-way voice over ESP-NOW.</p>
          {chapter('01', 'Two radios, two jobs', <><p>LoRa carries text over long range while ESP-NOW carries low-latency two-way voice, and I programmed both handsets in PlatformIO with the Arduino framework.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="LoRA Messenger internals" loading="lazy" /></>)}
          {chapter('02', 'A custom PCB, reflowed by hand', <><p>I designed the board in KiCAD and reflow-soldered the SMD components myself, and a TP4056 circuit on it handles charging.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="Custom PCB" loading="lazy" /></>)}
          {chapter('03', 'Audio and enclosure', <><p>An I2S microphone and speaker handle calls and dual OLED displays show messages and status, all inside a 3D-printed case I modelled in Onshape.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D-printed case" loading="lazy" /></>)}
          {cta('See how it came together', 'The article covers the breadboard stage, the PCB respins and what I learned.', 'Read the full article', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('LUMEN voice assistant', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT Programming · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">A voice-controlled smart-room assistant that wakes when you say &ldquo;Hello Robot&rdquo;. An ESP32 captures what you say next, a FastAPI relay transcribes it and asks an LLM for one strict JSON command, and that command goes back out to the room over MQTT.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'Speech to one JSON command', <p>The ESP32 streams 16&nbsp;kHz audio to the server, where Whisper transcribes it through OpenRouter and a DeepSeek LLM turns it into exactly one command (an action, a sequence or a timer), which is checked against a schema before it reaches the board.</p>)}
          {chapter('02', 'Fitting it on a no-PSRAM board', <><p>The WROOM had about 33&nbsp;KB of free RAM with WiFi up while a voice clip is roughly 96&nbsp;KB, so the audio is streamed over a raw socket as it records instead of being held in memory, and peak memory during an upload stays around 10&nbsp;KB.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="The INMP441 microphone wired to the ESP32" loading="lazy" /></>)}
          {chapter('03', 'A room you can talk to', <><p>Lights, a NeoPixel, a fan, a servo and a buzzer respond to commands, and there is a local auto mode and a web dashboard too. If you ask it to &ldquo;set the brightness to the humidity&rdquo;, it reads the live sensor and does exactly that.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="The LUMEN web dashboard" loading="lazy" /></>)}
          {cta('See the full build', 'The article covers the memory limits, the wiring and an interactive demo.', 'Read the full article', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('OCR Reader with DrumNet: a fully vertically-integrated OCR water meter solution', ['Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">A low-cost, battery-powered camera that mounts over a mechanical water meter and reads the drums with a 693K-parameter neural network running entirely on an ESP32-S3, then sends the number home over LoRaWAN.</p>
          {chapter('01', 'DrumNet on the chip', <><p>A spotter finds the digit window, a refiner pins down its edges by averaging feature-map columns and rows, and three readers vote on every drum with the carry rule applied. The whole network runs in INT8 and takes about 2 seconds per reading.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="The DrumNet ensemble vote and reading" loading="lazy" /></>)}
          {chapter('02', 'Trained by six agents', <><p>MeterSim renders labelled meters and SimGen2 makes them look like camera shots, while six AI agents took turns on the GPU and the Jetson rig through a booking scheduler, running 24/7 over Tailscale and T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="The nine meter designs in MeterSim" loading="lazy" /></>)}
          {chapter('03', 'A board, a shell, a 9-hour reflow', <><p>The 4-layer KiCad PCB carries battery management, LoRa and PWM LEDs, and I assembled it by hand, debugged it under a microscope and housed it in a toolless 3D-printed enclosure with a meter adapter.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="3D render of the Prototype V2 board" loading="lazy" /></>)}
          {cta('Walk through the whole pipeline', 'The article follows the DrumNet run step by step, with a 3D board tour, a ConfigKing simulator and the full report.', 'Read the full article', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader private book reader', ['Personal Project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Web App · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Self-Learnt</p>
          <p className="hp-rd-lead">A small, private online book reader for a handful of friends, who log in with one access code. The app remembers exactly where you left off, shows who else is reading and tracks everyone&apos;s progress.</p>
          {chapter('01', 'A library that remembers you', <><p>When you open a book, it jumps back to the exact chapter and scroll position, which is stored as a fraction so it still lines up after a font-size change, and each reader&apos;s colour, font and layout are saved too.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="The reading view" loading="lazy" /></>)}
          {chapter('02', 'Reading together', <><p>You can see who is online, spot a friend in the same book by their green ring and chapter number, and send them a wave or a short note that disappears.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Presence and quick messages" loading="lazy" /></>)}
          {chapter('03', 'A gate enforced in SQL', <p>Explicit chapters are gated in the database query itself, so gated text never leaves the server for a reader without access. The same chapter can look different for each reader, and cal mode removes it entirely.</p>)}
          {cta('See the whole build', 'The article covers presence, the content gate, webtoons and the stack.', 'Read the full article', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA Smart Home System', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA Smart Home System</h2>
          <p className="hp-md-meta">3 Months · School Group Project · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">A smart home my team of five built for a module on sustainable living, which was graded A. Four BeagleBone nodes report to a SocketIO server that runs a live 3D dashboard.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Four nodes, one job each', <><p>The four nodes cover climate, the bathroom, the kitchen (fridge energy and a fire alarm) and intrusion, and each BeagleBone Black Wireless carries MikroBUS sensor modules.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="The kitchen node hardware" loading="lazy" /></>)}
          {chapter('02', 'One server for all of them', <><p>Every node connects to a SocketIO web server, which hosts the dashboard and sounds the fire alarm on every node at once.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="How each part of the system connects" loading="lazy" /></>)}
          {chapter('03', 'A live 3D dashboard', <><p>The dashboard shows live data on a Spline 3D model of the house, and I designed its UI in Figma.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="EMA 3D dashboard" loading="lazy" /></>)}
          {cta('Try it or read the write-up', 'There is a live demo of the dashboard as well as the full project article.', 'Live demo', 'https://csdpdemo.chiambucket.com', { label: 'Read the article', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus Dispenser', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus Dispenser</h2>
          <p className="hp-md-meta">1 Month · First School Project · 3D Design · PyFirmata</p>
          <p className="hp-rd-lead">My first school project was a six-part 3D-printed syrup dispenser, and every part fit on the first print.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'What it does', <><p>It pours three cup sizes, wakes when someone walks up, and has a servo door and a high-power LED to light the cup.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="The Pandus model in Onshape" loading="lazy" /></>)}
          {chapter('02', 'Control and components', <><p>An Arduino Uno R3 driven with PyFirmata runs a servo, LEDs, a relay board, buttons, a DC pump and an infrared collision detection module.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="The Pandus flowchart" loading="lazy" /></>)}
          {cta('The full build', 'The article covers the parts, the flowcharts and the Onshape model.', 'Read the full article', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F Safe Freezer System', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F Concept</h2>
          <p className="hp-md-meta">Safe Freezer Storage System · Team of 4 · Engineering Course · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">A freezer safety system my team and I designed for an engineering course. Walk-in factory freezers can trap the people working inside them, so ELEC-F watches the door and the room and sounds the alarm before the cold turns dangerous.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'The problem', <><p>Faulty latches, frozen seals or simple unawareness can leave a worker shut inside a walk-in freezer, where hypothermia sets in fast. ELEC-F is there to shorten that time and reassure whoever is trapped.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="The ELEC-F freezer prototype" loading="lazy" /></>)}
          {chapter('02', 'How it works', <><p>A ToF sensor reads whether the door is open or closed, and a PIR sensor checks if anyone is still inside. If the door shuts with a person inside, a timer starts, and when it runs out the RGB unit flashes and the buzzer sounds.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="ELEC-F armed state on the M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Built on M5Stack', <><p>Two M5Stack Fire controllers and a Mini Hub tie the ToF, PIR and RGB units together, chosen because they keep working at the sub-zero temperatures a freezer demands.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="The M5Stack controller wired to its sensors" loading="lazy" /></>)}
          {cta('See the full concept', 'The article covers the research, the build and an interactive walkthrough.', 'Read the full article', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli Concept', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli Concept</h2>
          <p className="hp-md-meta">Concept · Communication Skills · 3D in Blender</p>
          <p className="hp-rd-lead">An original product concept I created and pitched for a communication-skills project, presented with 3D scenes built in Blender.</p>
          {chapter('01', 'Idea to presentation', <><p>The brief was about communicating an idea as well as having one, so I designed the concept, rendered it in Blender and built the deck to present it clearly to an audience.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Kauli concept render" loading="lazy" /></>)}
          {soon('Kauli concept', 'The renders and the pitch will get a full write-up.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Personal · 3D Design · Ultralight 20g</p>
          <p className="hp-rd-lead">My own take on the popular ZeroMouse, an ultralight 20g gaming mouse I designed from scratch to play a little better in FPS games.</p>
          {chapter('01', 'Designing for grams', <p>Every part of the shell was modelled to shed weight without losing rigidity, balancing grip comfort against the goal of reaching around 20 grams.</p>)}
          {soon('Series One Light', 'The model and its trade-offs will get a full write-up.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Copy Board PCB', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Personal · PCB Design · KiCAD · 1 Week</p>
          <p className="hp-rd-lead">A from-scratch KiCAD recreation of NYP&apos;s ATMega328 dev board, made so I could have my own copy to work with at home.</p>
          {chapter('01', 'Reverse-engineered, then rebuilt', <p>I recreated the school board in KiCAD from its schematic, and because some parts were out of production I sourced substitutes, then used the board as my first proper attempt at reflow soldering.</p>)}
          {soon('Copy Board', 'Sourcing parts, the layout and the reflow will get a full write-up.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Web Development Project', ['School Project'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Web Development Project</h2>
          <p className="hp-md-meta">School · HTML &amp; CSS · First Website</p>
          <p className="hp-rd-lead">The first fully functional website I built, in HTML and CSS, for the final assignment of my web development class. This site was my second attempt.</p>
          {chapter('01', 'Where it started', <p>This was my introduction to building for the web, and it shows how far my work has come since then.</p>)}
          {soon('See where it began', 'The site is still online.', { label: 'Live demo', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft Live Map', ['Personal Project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft Live Map</h2>
          <p className="hp-md-meta">Personal · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">A self-hosted Minecraft server on the homelab, with a live web map of the multiplayer world that anyone can pan around in real time.</p>
          {chapter('01', 'Server and map', <p>A Paper server runs in Docker with the Dynmap plugin generating a live, interactive map that updates as players explore and build.</p>)}
          {soon('Explore the world live', 'The live map is open to anyone.', { label: 'Open the live map', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
