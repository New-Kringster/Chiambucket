/* The homepage's English words. Every other language fills the same shape.
   Project text is keyed by the project ids in ../content.ts, skill tiles by their
   tile keys and photo albums by album id; content.ts keeps the images, URLs,
   icons, types and flags. Product names in tool icons stay in content.ts. */
const en = {
  meta: {
    title: 'Braven Chiam | Hardware, software and design',
    description: 'Chiambucket is the portfolio of Braven Chiam, an engineering student in Singapore who builds from circuit board to cloud, like a 5G rover and a water meter reader.',
    keywords: 'Braven Chiam, Chiambucket, OCR Reader, DrumNet, Project June, 5G rover, BeadReader, Shebang, M5Stack, LoRA Messenger, ESP32, PCB design, KiCad, Onshape, Next.js, homelab, photography, Singapore',
    ogDescription: 'I build things from the circuit board to the cloud, including a water meter reader that reads on the chip, a 5G rover and a private book reader.',
    twitterTitle: 'Braven Chiam',
    twitterDescription: 'My projects include a water meter reader that reads on the chip, a 5G rover and a private book reader.',
  },
  /** the prose in the page's JSON-LD (names of people, sites and projects stay in code) */
  ld: {
    jobTitle: 'Electronic and Computer Engineering student',
    knowsAbout: [
      'Electronics Engineering', 'PCB Design', 'Embedded Systems', 'ESP32',
      'Microcontrollers', '3D CAD', 'UI Design', 'Photography', 'Self-hosting',
    ],
    juneHeadline: 'Project June, a 5G rover',
    juneAbout: 'A 5G rover with three live WebRTC camera feeds, MQTT telemetry, an ESP32-S3 sensor suite, a MOSFET motor driver and a 2S3P battery pack, built in three weeks.',
    juneKeywords: '5G rover, WebRTC, ESP32, MQTT, custom PCB, KiCAD, Onshape, telemetry',
    beadAbout: 'A private, invite-only online book reader with access-code auth, live read-together presence, an SQL-enforced explicit-content gate, text and webtoon books, reading stats and offline support. Built with Next.js, Supabase and Cloudflare R2.',
    beadKeywords: 'private book reader, invite-only, Next.js, Supabase, Cloudflare R2, reading together, offline PWA',
  },

  /* ── Start ── */
  hero: {
    kicker: 'Hello.',
    line: 'I’m Braven. Most projects need hardware, software and design, and I like doing all three myself.',
    artAlt: 'A painted morning: a stone pine on a grassy hill under a sage sky, the sun low on the right',
    /** the name in glass, one entry per word */
    name: ['Braven', 'Chiam'],
    scroll: 'Scroll',
    annivTitle: 'Chiambucket turns two',
    annivLine: 'Finally archived! All versions from 2024 to 2026',
    annivGo: 'See every version',
  },

  /* ── Hello ── */
  hello: {
    said: 'I’m a third-year Electronic and Computer Engineering student at Nanyang Polytechnic. I started by taking apart a broken radio to see how it worked, and now I design circuit boards, write firmware, build web apps and run the homelab they live on.',
    layersTitle: 'From the chip to the cloud',
    /** the layers of a build, from the chip to the cloud */
    layers: [
      { name: 'Firmware', line: 'I write C and C++ for ESP32, Arduino and M5Stack boards, or MicroPython when it suits.' },
      { name: 'Hardware', line: 'I draw schematics and boards in KiCad and solder them at home, SMD parts included.' },
      { name: 'Software', line: 'I build web apps in Next.js and TypeScript and run small Python servers in Docker.' },
      { name: 'Infrastructure', line: 'My projects run on my own homelab, where AI agents manage the servers, Docker and the UniFi network.' },
      { name: 'Design', line: 'I model enclosures in Onshape, render in Blender, design interfaces in Figma and edit films in DaVinci Resolve.' },
    ],
    complete: 'Complete',
  },

  /* ── The flagship chapters and their cards, by project id. The chapter's tag is
     the card's badge and its title is the project's title (projects below). ── */
  flagships: {
    'proj-waterslop': {
      badge: 'Flagship project',
      sub: 'A battery-powered camera that reads a water meter, entirely on the chip.',
      /** one beat per stretch of the pinned scene */
      beats: [
        { title: 'PCB designed in KiCad and manufactured by JLCPCB', text: 'The four-layer board is built around an ESP32-S3 and an OV2640 camera, and it carries LoRa, battery charging and LED lights.' },
        { title: 'A case with no screws', text: 'I modelled it in Onshape, and it snaps shut with side clips and holds the board on posts without tools.' },
        { title: 'DrumNET NN, Runs on Device', text: 'A 693K-parameter network finds the drums, reads each digit three times and votes on it, all on the ESP32-S3 in about two seconds.' },
      ],
      kind: 'Personal project',
      lead: 'I built this water meter reader end to end, from the board and a case with no screws to DrumNet, a neural network that reads the drums on the chip, so only the number goes out over LoRaWAN.',
      stats: [{ v: '693K', l: 'parameter model' }, { v: '~2 s', l: 'per reading' }, { v: '4-layer', l: 'custom PCB' }, { v: 'LoRaWAN', l: 'low-power link' }],
      posterAlt: 'The OCR Reader poster: DrumNet, a fully vertically-integrated OCR water meter solution, and the board',
      extra: 'Open the report',
    },
    'proj-june': {
      badge: 'Highlighted hardware build',
      sub: 'A 5G rover I can drive anywhere there is signal.',
      beats: [
        { title: 'Three live feeds from three phones', text: 'Phone 1 is the main 5G hotspot and the front camera, phone 2 is the second hotspot and the left camera, and phone 3 is the right camera. Each one streams its view to my console over WebRTC.' },
        { title: 'Telemetry from the night run', text: 'The ESP32-S3 joins the phone hotspot and sends its GPS, temperature, humidity and light readings back over MQTT, about ten times a second.' },
        { title: 'From a controller to the road', text: 'I drive it with an Xbox controller through my web console. The commands go over MQTT through my server and the video comes back through my TURN server, with about a second of delay from over 8 km away.' },
      ],
      kind: 'Personal project',
      lead: 'A 5G rover whose three phones stream its view to my dashboard while its sensors report what is around it. It took three weeks to go from the first concept to the first drive.',
      stats: [{ v: '3', l: 'live video streams' }, { v: '5G', l: 'cellular link' }, { v: '8+', l: 'onboard sensors' }, { v: '3 weeks', l: 'concept to drive' }],
      posterAlt: 'Project June: the rover kicking up dirt beside its driving console and an Xbox controller',
      extra: 'Watch the build',
    },
    'proj-pip': {
      badge: 'Highlighted software build',
      sub: 'A desk pet with an AI agent for a brain, built during my internship at M5Stack.',
      beats: [
        { title: 'It points things out', text: 'Ask Pip to show you something and it takes a screenshot of the page, finds the part in the picture and draws a circle, an arrow and a note over it.' },
        { title: 'It builds its own apps', text: 'Pip writes apps when I ask and keeps them in a drawer, either Lua scripts that run on the tablet or web apps it serves from my server.' },
        { title: 'A desktop for every chat', text: 'Pulling down the pill at the top opens the spotlight bar, and every conversation has its own desktop with its own Pip and colour.' },
      ],
      kind: 'Internship project, M5Stack',
      lead: 'A desk pet on an M5Stack Tab5 whose brain is the DeepSeek Harness on my server, so it can drive a browser, build its own apps and keep an eye on my other agents.',
      stats: [{ v: '106 s', l: 'to build a timer app' }, { v: 'Lua', l: 'native applets' }, { v: 'Docker', l: 'web applets' }, { v: '1 desktop', l: 'for every chat' }],
      posterAlt: 'Pip, a cyan desk pet with a light bulb, on the M5Stack Tab5',
    },
    'proj-lidar': {
      badge: 'Featured project',
      sub: 'A makeshift LiDAR on M5Stack’s little robot, built during my internship.',
      beats: [
        { title: 'It sweeps the room', text: 'Stack-chan turns its head across the room in small steps and takes a distance reading at every one. This is the real scan, filling in as the head pans across.' },
        { title: 'Quick, Normal or Fine', text: 'Before a scan I pick Quick, Normal or Fine. Quick is done in under a minute, and Fine takes longer but picks up much more detail.' },
        { title: 'Coloured by its own camera', text: 'Photos from the CoreS3’s camera colour the readings, which turns them into 68,206 coloured points that any browser on the Wi-Fi can show in 3D.' },
      ],
      kind: 'Internship project, M5Stack',
      lead: 'A makeshift LiDAR: four distance sensors on Stack-chan’s head, swept across a room by its two servos, with its camera colouring the points and a browser showing the scan in 3D.',
      stats: [{ v: '68,206', l: 'points in one scan' }, { v: '256°', l: 'widest sweep' }, { v: '4', l: 'ToF sensors' }, { v: '54 s', l: 'for a Quick scan' }],
      posterAlt: 'Stack-chan with four Unit ToF4M distance sensors on its head',
    },
    'proj-beadreader': {
      badge: 'Highlighted project',
      sub: 'A private book reader for a few friends.',
      beats: [
        { title: 'It remembers your page', text: 'The Who’s reading list shows how far each reader has got, and tapping your own row opens the same chapter at the line you stopped on.' },
        { title: 'Reading together', text: 'Friends on the same book show a green ring and their chapter. You can tap to send a wave or a short note, which fades from their screen in seconds and is never saved.' },
      ],
      kind: 'Personal project',
      lead: 'A book reader where I publish books in Markdown or as webtoons, my friends sign in with one access code, and anyone on the same book can see the others reading live.',
      stats: [{ v: 'Live', l: 'read-together presence' }, { v: 'SQL', l: 'enforced content gate' }, { v: 'Offline', l: 'works without a connection' }, { v: '1 click', l: 'to deploy your own' }],
      posterAlt: 'BeadReader on three phones: the sign-in screen, a chapter and the library',
      extra: 'GitHub',
    },
  },
  /** the flagship card's own words */
  card: {
    /** the card's aria-label */
    label: '{name}, {badge}',
    tools: 'Tools',
    read: 'Read the article',
    peek: 'Peek summary',
  },
  /** the peek reader's dialog */
  peek: {
    label: 'Project summary',
    close: 'Close the summary',
  },

  /* ── The set pieces ── */
  june: {
    feeds: {
      left: { label: 'Left', phone: 'Phone 2' },
      center: { label: 'Front', phone: 'Phone 1' },
      right: { label: 'Right', phone: 'Phone 3' },
    },
    live: 'Live',
    /** the telemetry readings' labels, in the order of TELE in SetPieces.tsx */
    tele: ['Latitude', 'Longitude', 'Satellites', 'Temperature', 'Humidity', 'Speed'],
    place: 'Place',
    placeName: 'Sembawang Park',
    /** the signal path, from the controller to the rover */
    link: [
      { label: 'Xbox controller', sub: 'Bluetooth to the console' },
      { label: 'My server', sub: 'MQTT, signalling, TURN' },
      { label: 'Three phones', sub: '5G hotspot and cameras' },
      { label: 'ESP32-S3', sub: 'Motors and sensors' },
    ],
  },
  pip: {
    /** the recordings' stills on the tablet, in beat order */
    shots: [
      'Pip circling the mitochondria on a cell diagram on the Tab5',
      'The app drawer on the Tab5 with the NCIR Thermometer app',
      'The spotlight bar on the Tab5, switching between desktops',
    ],
  },
  lidar: {
    cloudAlt: 'The finished scan in the camera\'s colours: the walls and ceiling of a room corner',
  },
  bead: {
    /** the readers in the scene; each avatar shows the name's first letter */
    mara: 'Mara',
    jae: 'Jae',
    sam: 'Sam',
    here: 'You were here',
    readingNow: 'reading now',
    pct: '{n}%',
    rowSub: 'On chapter {ch} of {of} · read {time}',
    readTime: '{h}h {m}m',
    maraPhone: 'Mara’s phone',
    maraScreen: 'Mara’s screen',
    waved: 'Braven waved at you',
    noteFrom: 'Braven',
    note: 'loved that twist!',
    onlineNow: 'Online now',
    readingHere: 'Reading here · ch {ch}',
    elsewhere: '{book} · ch {ch}',
    otherBook: 'The Hobbit',
    browsing: 'Browsing',
  },

  /* ── Projects ── */
  gallery: {
    title: 'All projects',
    sub: 'Everything I have built, at school, on my own and on internship.',
    filters: 'Show projects',
    all: 'All',
    types: { personal: 'Personal', school: 'School', internship: 'Internship' },
    atM5: 'at M5Stack',
    flagship: 'Flagship',
    highlight: 'Highlight',
    peek: 'Peek at a summary of {title}',
    read: 'Read',
    soon: 'Write-up coming soon',
  },
  /** every project's title and gallery blurb, by project id */
  projects: {
    'proj-waterslop': { title: 'OCR Reader', blurb: 'A battery-powered camera that reads a water meter, where a neural network on an ESP32-S3 reads the drums and only the number goes out over LoRaWAN.' },
    'proj-june': { title: 'Project June', blurb: 'A 5G rover whose three phones stream its view to my console, which I drive with an Xbox controller from anywhere with signal.' },
    'proj-pip': { title: 'Pip', blurb: 'A desk pet on an M5Stack Tab5 with an AI agent harness for a brain, so it can drive a browser and build its own apps.' },
    'proj-lidar': { title: 'Stack-chan LiDAR', blurb: 'Four distance sensors on Stack-chan’s head, swept across a room by its servos and coloured by its camera into a 3D scan.' },
    'proj-beadreader': { title: 'BeadReader', blurb: 'A private book reader for a few friends, who sign in with one access code and can see each other reading live.' },
    'proj-pantry': { title: 'Pantry Expiry Tracker', blurb: 'An expiry tracker for the fridge door, where you scan a barcode, pick when it expires and the screen shows what to eat first.' },
    'proj-ruler': { title: 'Scroll Ruler', blurb: 'A digital ruler from an AtomS3R and a Unit Scroll that measures whatever you roll its wheel along.' },
    'proj-cadmouse': { title: '3D CAD Mouse', blurb: 'An M5Stack Capsule that works as a wireless 3D mouse for Onshape, so the model turns as you turn it in your hand.' },
    'proj-lora': { title: 'LoRA Messenger', blurb: 'Two ESP32 handhelds that send text over LoRa and rough two-way voice over ESP-NOW, on my first PCB.' },
    'proj-lumen': { title: 'LUMEN', blurb: 'A voice-controlled room on an ESP32, where Whisper and DeepSeek turn speech into one JSON command sent over MQTT.' },
    'proj-ema': { title: 'EMA Smart Home', blurb: 'A team smart home, graded A, where four BeagleBone Black nodes report to a SocketIO server with a live 3D dashboard.' },
    'proj-pandus': { title: 'Pandus Dispenser', blurb: 'My first school project was a six-part 3D-printed syrup dispenser run by an Arduino Uno.' },
    'proj-elecf': { title: 'ELEC-F Concept', blurb: 'A walk-in freezer alarm on M5Stack that counts down when someone is shut inside.' },
    'proj-kauli': { title: 'Kauli Concept', blurb: 'A product concept I pitched for a communication-skills module, rendered in Blender.' },
    'proj-sol': { title: 'Series One Light', blurb: 'An ultralight gaming mouse shell based on the ZeroMouse, which I am aiming to bring down to about 20 g.' },
    'proj-copyboard': { title: 'Copy Board', blurb: 'A KiCad recreation of my school’s dev board, made because I couldn’t bring the original home.' },
    'proj-mc': { title: 'Minecraft Live Map', blurb: 'A Paper server in Docker on my homelab, with a live Dynmap of the world.' },
    'proj-webdev': { title: 'Web Development Prj', blurb: 'My first working website, in HTML and CSS, for my web development class.' },
  },

  /* ── On the bench (off the page while SHOW_BENCH is false), by bench key ── */
  bench: {
    title: 'On the bench',
    sub: 'What I have been building since the last write-up.',
    items: {
      shebang: {
        name: 'Shebang',
        status: 'My hosting platform',
        what: 'It gives me one account for sign-in, static pages, file hosting, short links and a Postgres database per project, reachable through one REST API or one MCP server, so my coding agents can publish for me. The MCP client is open source and on npm.',
        stack: ['Next.js 16', 'Self-hosted Supabase', 'Postgres', 'MCP', 'Docker'],
        link: 'shebang-mcp on GitHub',
      },
      pip: {
        name: 'Pip',
        status: 'In progress',
        what: 'A desk companion on an M5Stack Tab5 that talks to an AI agent running at home. It switches between several desktops, runs small applets it can build on request, and uses its camera.',
        stack: ['ESP32-P4', 'M5Stack Tab5', 'PlatformIO', 'Lua', 'Python'],
      },
      ncir: {
        name: 'NCIR thermometer demos',
        status: 'Firmware',
        what: 'These show live infrared temperature on M5Stack screens for the NCIR and NCIR 2 sensors. The NCIR 2 firmware talks to the sensor’s own I2C register map with no vendor library, and one codebase runs on the CoreS3 and the classic Basic.',
        stack: ['M5Stack CoreS3', 'C++', 'I2C', 'PlatformIO'],
      },
      flashdeck: {
        name: 'Flashdeck',
        status: 'Tooling',
        what: 'A shelf for my firmware with a browser flasher, so when I plug in an ESP32, ESP Web Tools picks the image built for that chip. The server is plain Python with no dependencies.',
        stack: ['Python', 'Web Serial', 'ESP Web Tools'],
      },
    },
  },

  /* ── My skills: each tile's words and its pop-up, by tile key. The pop-up's
     eyebrow is the tile's word; `links` are the labels of its buttons, in order. ── */
  skills: {
    title: 'My skills',
    /** a tile's aria-label */
    open: '{word}: {line}. Open the details',
    tiles: {
      hw: {
        word: 'Hardware', line: 'Boards I lay out and solder', title: 'Circuit boards',
        blurb: 'I draw the schematic and lay out the board in KiCad, then solder the parts myself, including SMD parts reflowed at home.',
        points: ['The OCR Reader’s four-layer board, made by JLCPCB', 'The LoRA Messenger board, my first PCB', 'A from-scratch recreation of my school’s ATmega328 dev board'],
        chips: ['KiCad', 'EAGLE', 'SMD reflow', 'Schematic capture'],
        links: ['OCR Reader', 'LoRA Messenger'],
      },
      fw: {
        word: 'Firmware', line: 'C, C++ and MicroPython', title: 'Microcontrollers I build with',
        blurb: 'Most of my builds run on a microcontroller, and I write the firmware in C and C++ with PlatformIO, or in MicroPython when it suits.',
        points: ['ESP32, my default for anything wireless', 'M5Stack boards when I need a screen and buttons in a hurry', 'Arduino Uno and the ATmega328 for simpler builds', 'BeagleBone Black as a Linux brain for a larger system'],
        chips: ['ESP32', 'M5Stack', 'Arduino', 'BeagleBone', 'PlatformIO', 'C / C++', 'MicroPython'],
        links: ['Project June', 'LUMEN'],
      },
      sw: {
        word: 'Software', line: 'Web apps and small servers', title: 'Web apps and servers',
        blurb: 'I build web apps in Next.js and TypeScript and write small Python servers that run in Docker.',
        points: ['BeadReader, on Next.js, Supabase Postgres and Cloudflare R2', 'LUMEN, a FastAPI server that turns speech into room commands', 'Shebang, my own hosting platform', 'This site, in Next.js on Vercel'],
        chips: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Docker'],
        links: ['BeadReader', 'LUMEN'],
      },
      cad: {
        word: '3D and CAD', line: 'Cases that fit the first time', title: 'Enclosures that fit',
        blurb: 'I model enclosures and parts in Onshape, render in Blender, and 3D print until the fit is right.',
        points: ['The OCR Reader’s toolless case', 'The LoRA Messenger’s handheld case', 'The six-part Pandus dispenser body, which fit on the first print'],
        chips: ['Onshape', 'Blender', '3D printing'],
      },
      infra: {
        word: 'Infrastructure', line: 'A home cloud run by agents', title: 'A homelab of my own',
        blurb: 'My homelab is run by AI agents on a server of their own, and they control the other machines, the UniFi network and Cloudflare.',
        points: ['Agents that deploy apps, change the network and fix services on their own', 'Self-hosted services behind Nginx Proxy Manager and CrowdSec', 'coturn and MQTT servers that my hardware projects rely on'],
        chips: ['Unraid', 'Docker', 'UniFi', 'Cloudflare', 'Nginx', 'Tailscale', 'Claude Code'],
        link: 'Explore the HomeLab',
      },
      radio: {
        word: 'Wireless', line: 'LoRa, ESP-NOW, MQTT and 5G', title: 'Radios and live links',
        blurb: 'I use LoRa for range, ESP-NOW for quick local links, MQTT for telemetry and WebRTC for live video over cellular.',
        points: ['Three live WebRTC camera streams over 5G on Project June', 'Long-range text on LoRa and two-way voice on ESP-NOW', 'LoRaWAN uplinks from the OCR Reader'],
        chips: ['LoRa', 'LoRaWAN', 'ESP-NOW', 'MQTT', 'WebRTC', '5G'],
      },
      video: {
        word: 'Video', line: 'A film for every build', title: 'A film for every build',
        blurb: 'I cut and grade a short film for my builds in DaVinci Resolve.',
        chips: ['DaVinci Resolve', 'Premiere Pro'],
        links: ['Watch the Project June build'],
      },
      ui: {
        word: 'Design', line: 'Interfaces and posters', title: 'Interfaces and posters',
        blurb: 'I design interfaces in Figma and Spline and make posters in Photoshop.',
        points: ['The Project June operator console and the EMA smart-home dashboard', 'The ELEC-F project poster'],
        chips: ['Figma', 'Spline', 'Photoshop'],
        links: ['EMA smart-home UI'],
      },
      photo: {
        word: 'Photography', line: 'Mostly travel', title: 'Photos',
        blurb: 'Photography helps me explore more of my creativity, and most of my photos are from travels in New Zealand, China and Europe.',
        link: 'See every album',
      },
    },
  },

  /* ── HomeLab ── */
  lab: {
    tag: 'Infrastructure',
    title: 'HomeLab',
    sub: 'Five machines at home, run by AI agents.',
    lead: 'They hold my photo library and my files and run the MQTT and TURN servers that Project June and LUMEN use, and the agents on braven-agents manage all of it, from the containers to the network. Solar export credits pay for their power, and this site itself is hosted on Vercel.',
    facts: [{ v: '5', l: 'machines' }, { v: '24 TB', l: 'usable storage' }, { v: '38', l: 'self-hosted apps' }],
    cta: 'Explore the HomeLab',
  },

  /* ── Photos ── */
  photos: {
    title: 'Photography',
    sub: 'Photos from New Zealand, China and Europe.',
    alt: 'A photo from the {album} album',
    albums: { nz: 'New Zealand', china: 'China', europe: 'Europe', highlights: 'Highlights' },
    more: 'See every album',
  },

  /* ── Contact ── */
  contact: {
    /** set word by word, split at the spaces */
    title: 'Say hello.',
    email: 'Email me',
    all: 'All the ways to reach me',
  },
};

export type HomeCopy = typeof en;
export default en;
