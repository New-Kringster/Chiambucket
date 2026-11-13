/* ────────────────────────────────────────────────────────────────
   Homepage story content. Every fact comes from a write-up on this site or,
   for "On the bench", from Braven's GitHub repos (private ones only at a high
   level: what it is, the stack, his role; no code, hosts or client details).
   ──────────────────────────────────────────────────────────────── */
import type { InfoItem } from '../../components/InfoModal';

/** The layers of a build, from the chip to the cloud (the Hello chapter). */
export const LAYERS = [
  { name: 'Firmware', line: 'C and C++ on ESP32, Arduino and M5Stack boards, or MicroPython when it suits.' },
  { name: 'Hardware', line: 'Schematics and boards in KiCad, soldered at home, SMD parts included.' },
  { name: 'Software', line: 'Web apps in Next.js and TypeScript, small Python servers in Docker.' },
  { name: 'Infrastructure', line: 'A homelab on Unraid, Proxmox and Docker that my projects run on.' },
  { name: 'Design', line: 'Enclosures in Onshape, renders in Blender, interfaces in Figma, films in DaVinci Resolve.' },
];

/** The OCR Reader set piece: one beat per stretch of the pinned scene. */
export const READER_BEATS = [
  { title: 'PCB designed in KiCad and manufactured by JLCPCB', text: 'A four-layer board built around an ESP32-S3 and an OV2640 camera, with LoRa, battery charging and LED lights on board.' },
  { title: 'A case with no screws', text: 'Its case, modelled in Onshape, snaps shut with side clips and holds the board on posts, no tools needed.' },
  { title: 'DrumNET NN, Runs on Device', text: 'A 693K-parameter network finds the drums, reads each digit three times and votes, all on the ESP32-S3, in about two seconds.' },
];

/* ── Flagship project cards ── */
export type Flagship = {
  id: string;
  name: string;
  badge: string;
  gold?: boolean;
  kind: string;
  lead: string;
  stats: { v: string; l: string }[];
  tools: { src: string; alt: string }[];
  poster: string;
  posterAlt: string;
  read: string;
  extra: { label: string; url: string; kind: 'play' | 'github' | 'report' };
};

export const OCR_CARD: Flagship = {
  id: 'proj-waterslop',
  name: 'OCR Reader',
  badge: 'Flagship project',
  gold: true,
  kind: 'School project, Nanyang Polytechnic',
  lead: 'A water meter reader I built end to end: my own board, a case with no screws and DrumNet, a neural network that reads the drums on the chip and sends only the number over LoRaWAN.',
  stats: [{ v: '693K', l: 'parameter model' }, { v: '~2 s', l: 'per reading' }, { v: '4-layer', l: 'custom PCB' }, { v: 'LoRaWAN', l: 'low-power link' }],
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }],
  poster: '/images/ocr-reader-flagship.webp',
  posterAlt: 'The OCR Reader poster: DrumNet, a fully vertically-integrated OCR water meter solution, and the board',
  read: '/waterslop',
  extra: { label: 'Open the report', url: '/downloadable/ocr-reader-report.pdf', kind: 'report' },
};

export const JUNE_CARD: Flagship = {
  id: 'proj-june',
  name: 'Project June',
  badge: 'Highlighted hardware build',
  kind: 'Personal project',
  lead: 'A 5G rover I can drive wherever there is signal. Three phones stream its view to my dashboard while its sensors report what is around it. Concept to first drive took three weeks.',
  stats: [{ v: '3', l: 'live video streams' }, { v: '5G', l: 'cellular link' }, { v: '8+', l: 'onboard sensors' }, { v: '3 weeks', l: 'concept to drive' }],
  tools: [{ src: '/images/esp-icon.webp', alt: 'ESP32-S3' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/PlatformIO-icon.webp', alt: 'PlatformIO' }],
  poster: '/images/home/june-poster.webp',
  posterAlt: 'Project June, the rover, floating in warm light',
  read: '/project-june',
  extra: { label: 'Watch the build', url: 'https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC', kind: 'play' },
};

export const BEAD_CARD: Flagship = {
  id: 'proj-beadreader',
  name: 'BeadReader',
  badge: 'Highlighted software build',
  kind: 'Personal project',
  lead: 'A private book reader for a few friends. I publish books in Markdown or as webtoons, they sign in with one access code, and friends on the same book see each other reading live.',
  stats: [{ v: 'Live', l: 'read-together presence' }, { v: 'SQL', l: 'enforced content gate' }, { v: 'Offline', l: 'works without a connection' }, { v: '1 click', l: 'to deploy your own' }],
  tools: [{ src: '/images/nextjs-icon.webp', alt: 'Next.js' }, { src: '/images/supabase-icon.webp', alt: 'Supabase' }, { src: '/images/tailwind-icon.webp', alt: 'Tailwind CSS' }, { src: '/images/cloudflare-icon.webp', alt: 'Cloudflare R2' }],
  poster: '/images/home/beadreader-poster.webp',
  posterAlt: 'BeadReader on three phones: sign-in, a chapter and the reading stats',
  read: '/beadreader',
  extra: { label: 'GitHub', url: 'https://github.com/New-Kringster/BeadReader', kind: 'github' },
};

/* ── The project gallery (everything that is not a flagship) ── */
export type Project = {
  id: string; title: string; blurb: string; img: string; type: 'personal' | 'school';
  highlight?: boolean; url: string | null; icons: { src: string; alt: string }[];
};
export const PROJECTS: Project[] = [
  { id: 'proj-lora', title: 'LoRA Messenger', blurb: 'Two ESP32 handhelds: text over LoRa, rough two-way voice over ESP-NOW. My first PCB.', img: '/images/borlocator-pf-context.webp', type: 'personal', highlight: true, url: '/brolocator', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/Kicad-icon.webp', alt: 'KiCad' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-lumen', title: 'LUMEN', blurb: 'A voice-controlled room on an ESP32: Whisper and DeepSeek turn speech into one JSON command over MQTT.', img: '/images/lumen-pf-context.webp', type: 'school', highlight: true, url: '/lumen', icons: [{ src: '/images/esp-icon.webp', alt: 'ESP32' }, { src: '/images/python-icon.webp', alt: 'Python' }, { src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-ema', title: 'EMA Smart Home', blurb: 'Four BeagleBone Black nodes report to a SocketIO server with a live 3D dashboard. Graded A.', img: '/images/Ema-pf-context.webp', type: 'school', url: '/csdp', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }, { src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-pandus', title: 'Pandus Dispenser', blurb: 'My first school project: a six-part 3D-printed syrup dispenser run by an Arduino Uno.', img: '/images/pandusarticle.webp', type: 'school', url: '/pandus', icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }, { src: '/images/resolve-icon.webp', alt: 'DaVinci Resolve' }] },
  { id: 'proj-elecf', title: 'ELEC-F Concept', blurb: 'A walk-in freezer alarm on M5Stack that counts down when someone is shut inside.', img: '/images/elef2-pf-context.webp', type: 'school', url: '/elecf', icons: [{ src: '/images/figma-icon.webp', alt: 'Figma' }, { src: '/images/ps-pf-icon.webp', alt: 'Photoshop' }] },
  { id: 'proj-kauli', title: 'Kauli Concept', blurb: 'A product concept I pitched for a communication-skills module, rendered in Blender.', img: '/images/kauli3-pf-context.webp', type: 'school', url: null, icons: [{ src: '/images/blender-icon.webp', alt: 'Blender' }] },
  { id: 'proj-sol', title: 'Series One Light', blurb: 'An ultralight gaming mouse shell, aiming for about 20 g, based on the ZeroMouse.', img: '/images/Series1l-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/onshape-icon.webp', alt: 'Onshape' }] },
  { id: 'proj-copyboard', title: 'Copy Board', blurb: 'A KiCad recreation of my school’s dev board, made because I couldn’t bring the original home.', img: '/images/CopyBoard-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/Kicad-icon.webp', alt: 'KiCad' }] },
  { id: 'proj-mc', title: 'Minecraft Live Map', blurb: 'A Paper server in Docker on my homelab, with a live Dynmap of the world.', img: '/images/mc-pf-context.webp', type: 'personal', url: null, icons: [{ src: '/images/docker-icon.webp', alt: 'Docker' }] },
  { id: 'proj-webdev', title: 'Web Development Prj', blurb: 'My first working website, in HTML and CSS, for my web development class.', img: '/images/tht-cover.webp', type: 'school', url: null, icons: [{ src: '/images/vscode-icon.webp', alt: 'VS Code' }] },
];

/** On the bench is off the page for now; set true to bring it back. */
export const SHOW_BENCH = false;

export type Bench = { name: string; status: string; what: string; stack: string[]; link?: { label: string; url: string } };

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

/* ── What I do: the bento. Each tile is a picture and a few words; the
   details open in a pop-up (the same facts the old About section had). ── */
const SKILL_HARDWARE: InfoItem = {
  eyebrow: 'Hardware', title: 'Circuit boards',
  blurb: 'I draw the schematic and lay out the board in KiCad, then solder the parts myself, including SMD parts reflowed at home.',
  points: ['The OCR Reader’s four-layer board, made by JLCPCB', 'The LoRA Messenger board, my first PCB', 'A from-scratch recreation of my school’s ATmega328 dev board'],
  chips: ['KiCad', 'EAGLE', 'SMD reflow', 'Schematic capture'],
  links: [{ label: 'OCR Reader', url: '/waterslop' }, { label: 'LoRA Messenger', url: '/brolocator' }],
};
const SKILL_FIRMWARE: InfoItem = {
  eyebrow: 'Firmware', title: 'Microcontrollers I build with',
  blurb: 'Most of my builds run on a microcontroller. I write the firmware in C and C++ with PlatformIO, or MicroPython when it suits.',
  points: ['ESP32, my default for anything wireless', 'M5Stack boards when I need a screen and buttons in a hurry', 'Arduino Uno and the ATmega328 for simpler builds', 'BeagleBone Black as a Linux brain for a larger system'],
  chips: ['ESP32', 'M5Stack', 'Arduino', 'BeagleBone', 'PlatformIO', 'C / C++', 'MicroPython'],
  links: [{ label: 'Project June', url: '/project-june' }, { label: 'LUMEN', url: '/lumen' }],
};
const SKILL_SOFTWARE: InfoItem = {
  eyebrow: 'Software', title: 'Web apps and servers',
  blurb: 'Web apps in Next.js and TypeScript, and small Python servers in Docker.',
  points: ['BeadReader, on Next.js, Supabase Postgres and Cloudflare R2', 'LUMEN, a FastAPI server that turns speech into room commands', 'Shebang, my own hosting platform', 'This site, in Next.js on Vercel'],
  chips: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Docker'],
  links: [{ label: 'BeadReader', url: '/beadreader' }, { label: 'LUMEN', url: '/lumen' }],
};
const SKILL_INFRA: InfoItem = {
  eyebrow: 'Infrastructure', title: 'A homelab of my own',
  blurb: 'A self-hosted homelab on Unraid, Proxmox and Docker, behind Nginx and a segmented UniFi network.',
  points: ['Self-hosted services behind Nginx Proxy Manager and CrowdSec', 'A WireGuard and Tailscale mesh to reach home from anywhere', 'coturn and MQTT that back real hardware projects'],
  chips: ['Unraid', 'Proxmox', 'Docker', 'Nginx', 'Tailscale', 'WireGuard', 'UniFi'],
  link: { label: 'Explore the HomeLab', url: '/homelab' },
};
const SKILL_CAD: InfoItem = {
  eyebrow: '3D and CAD', title: 'Enclosures that fit',
  blurb: 'I model enclosures and parts in Onshape, render in Blender, and 3D print until the fit is right.',
  points: ['The OCR Reader’s toolless case', 'The LoRA Messenger’s handheld case', 'The six-part Pandus dispenser body, which fit on the first print'],
  chips: ['Onshape', 'Blender', '3D printing'],
};
const SKILL_DESIGN: InfoItem = {
  eyebrow: 'Design', title: 'Interfaces and posters',
  blurb: 'Interfaces in Figma and Spline, posters in Photoshop.',
  points: ['The Project June operator console and the EMA smart-home dashboard', 'The ELEC-F project poster'],
  chips: ['Figma', 'Spline', 'Photoshop'],
  media: '/images/Cdyspstart.webp',
  links: [{ label: 'EMA smart-home UI', url: '/csdp' }],
};
const SKILL_WIRELESS: InfoItem = {
  eyebrow: 'Wireless', title: 'Radios and live links',
  blurb: 'LoRa for range, ESP-NOW for quick local links, MQTT for telemetry and WebRTC for live video over cellular.',
  points: ['Three live WebRTC camera streams over 5G on Project June', 'Long-range text on LoRa and two-way voice on ESP-NOW', 'LoRaWAN uplinks from the OCR Reader'],
  chips: ['LoRa', 'LoRaWAN', 'ESP-NOW', 'MQTT', 'WebRTC', '5G'],
};
const SKILL_VIDEO: InfoItem = {
  eyebrow: 'Video', title: 'A film for every build',
  blurb: 'I cut and grade a short film for my builds in DaVinci Resolve.',
  chips: ['DaVinci Resolve', 'Premiere Pro'],
  links: [{ label: 'Watch the Project June build', url: 'https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC' }],
};

const SKILL_PHOTOS: InfoItem = {
  eyebrow: 'Photography', title: 'Photos',
  blurb: 'Photography helps me explore more of my creativity: mostly travel, from New Zealand, China and Europe.',
  link: { label: 'See every album', url: '/photography' },
};

export type Tile = { key: string; word: string; line: string; img?: string; video?: { webm: string; mp4: string; poster: string }; fit?: 'cover' | 'contain'; pos?: string; size: 'xl' | 'tall' | 'wide' | 'sq'; item: InfoItem };
export const TILES: Tile[] = [
  { key: 'hw', word: 'Hardware', line: 'Boards I lay out and solder.', img: '/images/CopyBoard-pf-context.webp', size: 'xl', item: SKILL_HARDWARE },
  { key: 'fw', word: 'Firmware', line: 'C, C++ and MicroPython.', img: '/images/waterslop/cardputer.webp', fit: 'contain', size: 'tall', item: SKILL_FIRMWARE },
  { key: 'sw', word: 'Software', line: 'Web apps and small servers.', img: '/images/beadreader/contents-dark.webp', pos: '50% 0%', size: 'tall', item: SKILL_SOFTWARE },
  { key: 'cad', word: '3D and CAD', line: 'Cases that fit first time.', img: '/images/waterslop/enc-final.webp', size: 'sq', item: SKILL_CAD },
  { key: 'infra', word: 'Infrastructure', line: 'Three servers at home.', img: '/images/hl-newmain.png', fit: 'contain', size: 'sq', item: SKILL_INFRA },
  { key: 'radio', word: 'Wireless', line: 'LoRa, ESP-NOW, MQTT, 5G.', img: '/images/Brolocator1.webp', pos: '50% 85%', size: 'sq', item: SKILL_WIRELESS },
  { key: 'video', word: 'Video', line: 'A film for every build.', video: { webm: '/images/Davinci-showcase.webm', mp4: '/images/Davinci-showcase.mp4', poster: '/images/Davinci-showcase-poster.webp' }, size: 'wide', item: SKILL_VIDEO },
  { key: 'ui', word: 'Design', line: 'Interfaces and posters.', img: '/images/Cdyspstart.webp', size: 'sq', item: SKILL_DESIGN },
  { key: 'photo', word: 'Photography', line: 'Travel, mostly.', img: '/images/home/gal-12.webp', size: 'wide', item: SKILL_PHOTOS },
];

/** Highlights from the photo library, captioned by album only. */
export const PHOTOS = [
  { src: '/images/home/gal-01.webp', w: 900, h: 600, album: 'New Zealand' },
  { src: '/images/home/gal-02.webp', w: 900, h: 626, album: 'China' },
  { src: '/images/home/gal-07.webp', w: 537, h: 720, album: 'China' },
  { src: '/images/home/gal-03.webp', w: 900, h: 656, album: 'China' },
  { src: '/images/home/gal-04.webp', w: 900, h: 600, album: 'Europe' },
  { src: '/images/home/gal-11.webp', w: 480, h: 720, album: 'New Zealand' },
  { src: '/images/home/gal-05.webp', w: 900, h: 600, album: 'Europe' },
  { src: '/images/home/gal-06.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-09.webp', w: 505, h: 720, album: 'Highlights' },
  { src: '/images/home/gal-08.webp', w: 900, h: 610, album: 'Highlights' },
  { src: '/images/home/gal-10.webp', w: 900, h: 600, album: 'New Zealand' },
  { src: '/images/home/gal-13.webp', w: 480, h: 720, album: 'New Zealand' },
  { src: '/images/home/gal-12.webp', w: 900, h: 600, album: 'New Zealand' },
  { src: '/images/home/gal-14.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-22.webp', w: 514, h: 720, album: 'China' },
  { src: '/images/home/gal-15.webp', w: 900, h: 600, album: 'Highlights' },
  { src: '/images/home/gal-16.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-23.webp', w: 480, h: 720, album: 'China' },
  { src: '/images/home/gal-17.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-18.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-24.webp', w: 504, h: 720, album: 'Highlights' },
  { src: '/images/home/gal-19.webp', w: 900, h: 600, album: 'China' },
  { src: '/images/home/gal-20.webp', w: 900, h: 600, album: 'Europe' },
  { src: '/images/home/gal-21.webp', w: 900, h: 600, album: 'Europe' },
];
