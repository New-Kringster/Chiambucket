/* ────────────────────────────────────────────────────────────────
   Homepage story content. Every fact comes from a write-up on this site or,
   for "On the bench", from Braven's GitHub repos (private ones only at a high
   level: what it is, the stack, his role; no code, hosts or client details).
   ──────────────────────────────────────────────────────────────── */

export type Tone = 'dark' | 'paper';

/** Chapters in reading order; the left index lists these. */
export const CHAPTERS: { id: string; label: string }[] = [
  { id: 'top', label: 'Start' },
  { id: 'hello', label: 'Hello' },
  { id: 'ocr-reader', label: 'OCR Reader' },
  { id: 'june', label: 'Project June' },
  { id: 'beadreader', label: 'BeadReader' },
  { id: 'bench', label: 'On the bench' },
  { id: 'builds', label: 'Other builds' },
  { id: 'homelab', label: 'HomeLab' },
  { id: 'photos', label: 'Photos' },
  { id: 'contact', label: 'Contact' },
];

/** The layers of a build, from the chip to the cloud (the About chapter). */
export const LAYERS = [
  { name: 'Firmware', line: 'C and C++ on ESP32, Arduino and M5Stack boards, or MicroPython when it suits.' },
  { name: 'Hardware', line: 'Schematics and boards in KiCad, soldered at home, SMD parts included.' },
  { name: 'Software', line: 'Web apps in Next.js and TypeScript, small Python servers in Docker.' },
  { name: 'Infrastructure', line: 'A homelab on Unraid, Proxmox and Docker that my projects run on.' },
  { name: 'Design', line: 'Enclosures in Onshape, renders in Blender, interfaces in Figma, films in DaVinci Resolve.' },
];

/** The OCR Reader set piece: one beat per stretch of the pinned scene. */
export const READER_BEATS = [
  { title: 'A board of my own', text: 'A four-layer board I laid out in KiCad, built around an ESP32-S3 and an OV2640 camera.' },
  { title: 'A case with no screws', text: 'Its case, modelled in Onshape, snaps shut with side clips and holds the board on posts, no tools needed.' },
  { title: 'It reads on the chip', text: 'DrumNet, a 693K-parameter network, reads every drum on the ESP32-S3 in about two seconds.' },
  { title: 'And reports home', text: 'Each reading goes out over LoRaWAN, a low-power radio link.' },
];

export type Bench = {
  name: string;
  status: string;
  what: string;
  stack: string[];
  link?: { label: string; url: string };
};

/* New work from GitHub (November 2026). Source repos are listed in the PR
   report; all but shebang-mcp are private. */
export const BENCH: Bench[] = [
  {
    name: 'Shebang',
    status: 'My hosting platform',
    what: 'One account for sign-in, static pages, file hosting, short links and a Postgres database per project, reachable through one REST API or one MCP server, so my coding agents can publish for me. The MCP client is open source and on npm.',
    stack: ['Next.js 16', 'Self-hosted Supabase', 'Postgres', 'MCP', 'Docker'],
    link: { label: 'shebang-mcp on GitHub', url: 'https://github.com/New-Kringster/shebang-mcp' },
  },
  {
    name: 'Pip',
    status: 'In progress',
    what: 'A desk companion on an M5Stack Tab5 that talks to an AI agent running at home. It switches between several desktops, runs small applets it can build on request, and uses its camera, with tear-free page-flipped animation on the 1280 by 720 screen.',
    stack: ['ESP32-P4', 'M5Stack Tab5', 'PlatformIO', 'Lua', 'Python'],
  },
  {
    name: 'NCIR thermometer demos',
    status: 'Firmware',
    what: 'Live infrared temperature on M5Stack screens for the NCIR and NCIR 2 sensors. The NCIR 2 firmware talks to the sensor’s own I2C register map with no vendor library, and one codebase runs on the CoreS3 and the classic Basic.',
    stack: ['M5Stack CoreS3', 'C++', 'I2C', 'PlatformIO'],
  },
  {
    name: 'Flashdeck',
    status: 'Tooling',
    what: 'A shelf for my firmware with a browser flasher. Plug in an ESP32 and ESP Web Tools picks the image built for that chip. The server is plain Python with no dependencies.',
    stack: ['Python', 'Web Serial', 'ESP Web Tools'],
  },
];

export type Build = { id: string; name: string; kind: 'School' | 'Personal'; line: string; href: string; img: string };

export const BUILDS: Build[] = [
  { id: 'proj-lora', name: 'LoRA Messenger', kind: 'Personal', line: 'Two ESP32 handhelds: text over LoRa, rough two-way voice over ESP-NOW. My first PCB.', href: '/brolocator', img: '/images/borlocator-pf-context.webp' },
  { id: 'proj-lumen', name: 'LUMEN', kind: 'School', line: 'A voice-controlled room on an ESP32. Whisper and DeepSeek turn speech into one JSON command over MQTT.', href: '/lumen', img: '/images/lumen-pf-context.webp' },
  { id: 'proj-ema', name: 'EMA Smart Home', kind: 'School', line: 'Four BeagleBone Black nodes report to a SocketIO server with a live 3D dashboard.', href: '/csdp', img: '/images/Ema-pf-context.webp' },
  { id: 'proj-pandus', name: 'Pandus Dispenser', kind: 'School', line: 'My first school project: a six-part 3D-printed syrup dispenser run by an Arduino Uno.', href: '/pandus', img: '/images/pandusarticle.webp' },
  { id: 'proj-elecf', name: 'ELEC-F Concept', kind: 'School', line: 'A walk-in freezer alarm on M5Stack that counts down when someone is shut inside.', href: '/elecf', img: '/images/elef2-pf-context.webp' },
];

/** Projects without a write-up yet; named once, no links. */
export const UNWRITTEN = ['Kauli Concept', 'Series One Light', 'Copy Board', 'a web development class project', 'a Minecraft live map'];

/** Highlights from the photo library, captioned by album only. */
export const PHOTOS = [
  { src: '/images/home/photo-1.webp', w: 1500, h: 1000, album: 'New Zealand' },
  { src: '/images/home/photo-2.webp', w: 1438, h: 1000, album: 'China' },
  { src: '/images/home/photo-3.webp', w: 1372, h: 1000, album: 'China' },
  { src: '/images/home/photo-4.webp', w: 1500, h: 1000, album: 'Europe' },
  { src: '/images/home/photo-7.webp', w: 746, h: 1000, album: 'China' },
  { src: '/images/home/photo-5.webp', w: 1500, h: 1000, album: 'Europe' },
  { src: '/images/home/photo-6.webp', w: 1500, h: 1000, album: 'China' },
  { src: '/images/home/photo-9.webp', w: 701, h: 1000, album: 'Highlights' },
  { src: '/images/home/photo-8.webp', w: 1475, h: 1000, album: 'Highlights' },
];
