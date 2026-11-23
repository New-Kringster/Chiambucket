/* The recommendation cards' words in English, by project id (components/ArticleRecommendations.tsx).
   Another language is a copy of this file with the words translated (./<lang>.ts). */
const en = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'A battery-powered water meter reader where a 693K-parameter DrumNet pipeline on an ESP32-S3 reads the drums and reports over LoRaWAN, built on a custom KiCad PCB inside a 3D-printed shell.',
    alt: 'OCR Reader with DrumNet, an OCR water meter solution',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'A 5G rover with three live camera feeds, GPS, a laser pointer and seven sensors, driven from a web console.',
    alt: 'Project June rover',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'A desk pet on an M5Stack Tab5 whose brain is the DeepSeek Harness on my server, so it can drive a browser, build its own apps and watch my other agents.',
    alt: 'Pip, a cyan desk pet, on the M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'A makeshift LiDAR: four distance sensors on Stack-chan’s head, swept across a room by its servos, with its camera colouring a 3D scan you can explore in the browser.',
    alt: 'Stack-chan with four Unit ToF4M distance sensors on its head',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'A private, invite-only online book reader with live presence, per-reader resume, a SQL-enforced content gate, webtoons and shared reading stats, built with Next.js and Supabase.',
    alt: 'BeadReader private book reader',
  },
  'proj-pantry': {
    title: 'Pantry Expiry Tracker',
    blurb: 'An expiry tracker for the fridge door on an M5Stack CoreS3 SE and a QRCode module, where you scan a barcode, pick when it expires and see what to eat first, with reminders in Home Assistant.',
    alt: 'The pantry tracker, a CoreS3 SE stacked on the QRCode module',
  },
  'proj-ruler': {
    title: 'Scroll Ruler',
    blurb: 'A digital ruler from an M5Stack AtomS3R and a Unit Scroll: press the wheel down, roll it along something and the screen shows how long it is, after a 10 cm calibration.',
    alt: 'The Scroll Ruler, an AtomS3R with a Unit Scroll plugged in',
  },
  'proj-cadmouse': {
    title: '3D CAD Mouse',
    blurb: 'An M5Stack Capsule as a wireless 3D mouse for Onshape: click its button and turn it in your hand, and the model on the screen turns with it.',
    alt: 'The M5Stack Capsule v1.1 that works as the 3D mouse',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Two ESP32 handhelds that send text over LoRa and rough two-way voice over ESP-NOW, on my first PCB, designed in KiCAD, with a case modelled in Onshape.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'A voice-controlled smart-room assistant on an ESP32, with Whisper and a DeepSeek LLM via OpenRouter turning speech into one JSON command over MQTT.',
    alt: 'LUMEN voice assistant',
  },
  'proj-ema': {
    title: 'EMA Smart Home',
    blurb: 'A team smart home, graded A, where four BeagleBone Black nodes report to a SocketIO server with a live 3D Spline dashboard.',
    alt: 'EMA Smart Home System',
  },
  'proj-pandus': {
    title: 'Pandus Dispenser',
    blurb: 'My first school project was a six-part 3D-printed syrup dispenser run by an Arduino Uno and PyFirmata.',
    alt: 'Pandus Dispenser',
  },
  'proj-elecf': {
    title: 'ELEC-F Concept',
    blurb: 'A walk-in freezer alarm on M5Stack. If someone is inside when the door shuts, a timer starts and the alarm sounds when it runs out.',
    alt: 'ELEC-F Concept',
  },
  'proj-kauli': {
    title: 'Kauli Concept',
    blurb: 'A product concept I pitched for a communication-skills module, rendered in Blender.',
    alt: 'Kauli Concept',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'An ultralight gaming mouse shell based on the ZeroMouse, which I am aiming to bring down to about 20 g.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: "A KiCAD recreation of my school's dev board, made because I couldn't bring the original home.",
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Web Development Prj',
    blurb: 'My first fully functional website, built with HTML and CSS as the final assignment for my web development class.',
    alt: 'Web Development Project',
  },
  'proj-mc': {
    title: 'Minecraft Live Map',
    blurb: 'A Paper server in Docker on my homelab, with a live Dynmap of the world.',
    alt: 'Minecraft Live Map',
  },
};
export type RecsId = keyof typeof en;
export type RecsCopy = Record<RecsId, { title: string; blurb: string; alt: string }>;
export default en;
