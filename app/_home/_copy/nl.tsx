import type { HomeCopy } from './en';

/* De Nederlandse woorden van de homepage, in dezelfde vorm als en.tsx. */
const nl: HomeCopy = {
  meta: {
    title: 'Braven Chiam | Hardware, software en design',
    description: 'Chiambucket is het portfolio van Braven Chiam, een engineeringstudent in Singapore die bouwt van printplaat tot cloud, zoals een 5G-rover en een watermeterlezer.',
    keywords: 'Braven Chiam, Chiambucket, OCR Reader, DrumNet, Project June, 5G-rover, BeadReader, Shebang, M5Stack, LoRA Messenger, ESP32, PCB-ontwerp, KiCad, Onshape, Next.js, homelab, fotografie, Singapore',
    ogDescription: 'Ik bouw dingen van printplaat tot cloud, zoals een watermeterlezer die op de chip leest, een 5G-rover en een privé-boekenlezer.',
    twitterTitle: 'Braven Chiam',
    twitterDescription: 'Mijn projecten zijn onder meer een watermeterlezer die op de chip leest, een 5G-rover en een privé-boekenlezer.',
  },
  ld: {
    jobTitle: 'Student Electronic and Computer Engineering',
    knowsAbout: [
      'Elektrotechniek', 'PCB-ontwerp', 'Embedded systemen', 'ESP32',
      'Microcontrollers', '3D-CAD', 'UI-ontwerp', 'Fotografie', 'Selfhosting',
    ],
    juneHeadline: 'Project June, een 5G-rover',
    juneAbout: 'Een 5G-rover met drie live WebRTC-camerabeelden, MQTT-telemetrie, een ESP32-S3-sensorpakket, een MOSFET-motordriver en een 2S3P-accupakket, gebouwd in drie weken.',
    juneKeywords: '5G-rover, WebRTC, ESP32, MQTT, eigen PCB, KiCAD, Onshape, telemetrie',
    beadAbout: 'Een privé-boekenlezer, alleen op uitnodiging, met inloggen via een toegangscode, live zien wie er samen leest, een filter voor expliciete inhoud dat in SQL wordt afgedwongen, tekst- en webtoonboeken, leesstatistieken en offline gebruik. Gebouwd met Next.js, Supabase en Cloudflare R2.',
    beadKeywords: 'privé-boekenlezer, alleen op uitnodiging, Next.js, Supabase, Cloudflare R2, samen lezen, offline PWA',
  },

  /* ── Start ── */
  hero: {
    kicker: 'Hoi.',
    line: 'Ik ben Braven. De meeste projecten vragen om hardware, software en design, en ik doe ze alle drie graag zelf.',
    artAlt: 'Een geschilderde ochtend: een parasolden op een grazige heuvel onder een saliegroene lucht, met de zon laag aan de rechterkant',
    name: ['Braven', 'Chiam'],
    scroll: 'Scroll',
    annivTitle: 'Chiambucket wordt twee',
    annivLine: 'Eindelijk gearchiveerd! Alle versies van 2024 tot 2026',
    annivGo: 'Alle versies',
  },

  /* ── Hallo ── */
  hello: {
    said: 'Ik zit in mijn derde jaar Electronic and Computer Engineering aan Nanyang Polytechnic. Ik begon met het uit elkaar halen van een kapotte radio om te zien hoe die werkte, en nu ontwerp ik printplaten, schrijf ik firmware, bouw ik webapps en draai ik het homelab waar ze op leven.',
    layersTitle: 'Van chip tot cloud',
    layers: [
      { name: 'Firmware', line: 'Ik schrijf C en C++ voor ESP32-, Arduino- en M5Stack-boards, of MicroPython als dat beter past.' },
      { name: 'Hardware', line: 'Ik teken schema’s en printplaten in KiCad en soldeer ze thuis, SMD-onderdelen ook.' },
      { name: 'Software', line: 'Ik bouw webapps in Next.js en TypeScript en draai kleine Python-servers in Docker.' },
      { name: 'Infrastructuur', line: 'Mijn projecten draaien op mijn eigen homelab, gebouwd op Unraid, Proxmox en Docker.' },
      { name: 'Design', line: 'Ik modelleer behuizingen in Onshape, render in Blender, ontwerp interfaces in Figma en monteer films in DaVinci Resolve.' },
    ],
    complete: 'Compleet',
  },

  flagships: {
    'proj-waterslop': {
      badge: 'Topproject',
      sub: 'Een camera op een batterij die een watermeter afleest, helemaal op de chip.',
      beats: [
        { title: 'PCB ontworpen in KiCad en gemaakt door JLCPCB', text: 'Het vierlaagse board is gebouwd rond een ESP32-S3 en een OV2640-camera, en het heeft LoRa, het opladen van de batterij en ledlampjes aan boord.' },
        { title: 'Een behuizing zonder schroeven', text: 'Ik heb hem in Onshape gemodelleerd. Hij klikt dicht met clips aan de zijkant en houdt het board op pootjes vast, zonder gereedschap.' },
        { title: 'DrumNET NN, draait op het apparaat', text: 'Een netwerk met 693K parameters vindt de rollen, leest elk cijfer drie keer en stemt erover, allemaal op de ESP32-S3 in zo’n twee seconden.' },
      ],
      kind: 'Eigen project',
      lead: 'Ik heb deze watermeterlezer van begin tot eind gebouwd, van het board en een behuizing zonder schroeven tot DrumNet, een neuraal netwerk dat de rollen op de chip leest, zodat alleen het getal via LoRaWAN de deur uit gaat.',
      stats: [{ v: '693K', l: 'parameters' }, { v: '~2 s', l: 'per meting' }, { v: '4-laags', l: 'eigen PCB' }, { v: 'LoRaWAN', l: 'zuinige link' }],
      posterAlt: 'De poster van de OCR Reader: DrumNet, een volledig verticaal geïntegreerde OCR-oplossing voor watermeters, en het board',
      extra: 'Open het verslag',
    },
    'proj-june': {
      badge: 'Uitgelicht hardwareproject',
      sub: 'Een 5G-rover die ik overal kan besturen waar bereik is.',
      beats: [
        { title: 'Drie live beelden van drie telefoons', text: 'Telefoon 1 is de hoofdhotspot voor 5G en de camera voorop, telefoon 2 is de tweede hotspot en de linkercamera, en telefoon 3 is de rechtercamera. Elk streamt zijn beeld via WebRTC naar mijn console.' },
        { title: 'Telemetrie van de nachtrit', text: 'De ESP32-S3 maakt verbinding met de hotspot van de telefoon en stuurt zijn GPS, temperatuur, luchtvochtigheid en lichtmetingen via MQTT terug, zo’n tien keer per seconde.' },
        { title: 'Van controller tot de weg', text: 'Ik bestuur hem met een Xbox-controller via mijn webconsole. De commando’s gaan via MQTT door mijn server en het beeld komt terug via mijn TURN-server, met ongeveer een seconde vertraging vanaf meer dan 8 km afstand.' },
      ],
      kind: 'Eigen project',
      lead: 'Een 5G-rover waarvan drie telefoons het beeld naar mijn dashboard streamen, terwijl zijn sensoren melden wat er om hem heen gebeurt. Van het eerste idee tot de eerste rit duurde drie weken.',
      stats: [{ v: '3', l: 'live videostreams' }, { v: '5G', l: 'mobiele link' }, { v: '8+', l: 'boordsensoren' }, { v: '3 weken', l: 'van idee tot rit' }],
      posterAlt: 'Project June: de rover die stof opwerpt naast zijn besturingsconsole en een Xbox-controller',
      extra: 'Bekijk de bouw',
    },
    'proj-pip': {
      badge: 'Uitgelicht softwareproject',
      sub: 'Een bureauhuisdier met een AI-agent als brein, gebouwd tijdens mijn stage bij M5Stack.',
      beats: [
        { title: 'Het wijst dingen aan', text: 'Vraag Pip je iets te laten zien en het maakt een screenshot van de pagina, zoekt het stukje in de afbeelding op en tekent er een cirkel, een pijl en een notitie overheen.' },
        { title: 'Het bouwt zijn eigen apps', text: 'Pip schrijft apps als ik erom vraag en bewaart ze in een la, als Lua-scripts die op de tablet draaien of als webapps die het vanaf mijn server aanbiedt.' },
        { title: 'Een bureaublad per chat', text: 'Als je de pil bovenaan omlaag trekt, opent de spotlightbalk, en elk gesprek heeft zijn eigen bureaublad met een eigen Pip en kleur.' },
      ],
      kind: 'Stageproject, M5Stack',
      lead: 'Een bureauhuisdier op een M5Stack Tab5 met de DeepSeek Harness op mijn server als brein, zodat het een browser kan bedienen, zijn eigen apps kan bouwen en een oogje kan houden op mijn andere agents.',
      stats: [{ v: '106 s', l: 'voor een timer-app' }, { v: 'Lua', l: 'eigen applets' }, { v: 'Docker', l: 'webapplets' }, { v: '1 bureaublad', l: 'per chat' }],
      posterAlt: 'Pip, een cyaan bureauhuisdier met een gloeilamp, op de M5Stack Tab5',
    },
    'proj-lidar': {
      badge: 'Project in beeld',
      sub: 'Een zelfgemaakte LiDAR op het robotje van M5Stack, gebouwd tijdens mijn stage.',
      beats: [
        { title: 'Het scant de kamer', text: 'Stack-chan draait zijn hoofd in kleine stapjes door de kamer en meet bij elke stap een afstand. Dit is de echte scan, die zich vult terwijl het hoofd meedraait.' },
        { title: 'Quick, Normal of Fine', text: 'Voor een scan kies ik Quick, Normal of Fine. Quick is binnen een minuut klaar, en Fine duurt langer maar pikt veel meer detail op.' },
        { title: 'Ingekleurd door zijn eigen camera', text: 'Foto’s van de camera van de CoreS3 kleuren de metingen in, en zo worden ze 68.206 gekleurde punten die elke browser op de wifi in 3D kan laten zien.' },
      ],
      kind: 'Stageproject, M5Stack',
      lead: 'Een zelfgemaakte LiDAR: vier afstandssensoren op het hoofd van Stack-chan, die met zijn twee servo’s door een kamer zwaaien, terwijl zijn camera de punten inkleurt en een browser de scan in 3D laat zien.',
      stats: [{ v: '68.206', l: 'punten in één scan' }, { v: '256°', l: 'max. zwaai' }, { v: '4', l: 'ToF-sensors' }, { v: '54 s', l: 'per Quick-scan' }],
      posterAlt: 'Stack-chan met vier Unit ToF4M-afstandssensoren op zijn hoofd',
    },
    'proj-beadreader': {
      badge: 'Uitgelicht project',
      sub: 'Een privé-boekenlezer voor een paar vrienden.',
      beats: [
        { title: 'Het onthoudt je bladzijde', text: 'De lijst Who’s reading laat zien hoe ver elke lezer is, en als je op je eigen rij tikt, opent hetzelfde hoofdstuk bij de regel waar je gebleven was.' },
        { title: 'Samen lezen', text: 'Vrienden in hetzelfde boek krijgen een groene ring en hun hoofdstuk. Je kunt tikken om te zwaaien of een kort berichtje te sturen, dat binnen een paar seconden van hun scherm verdwijnt en nooit wordt bewaard.' },
      ],
      kind: 'Eigen project',
      lead: 'Een boekenlezer waarin ik boeken publiceer in Markdown of als webtoon, mijn vrienden inloggen met één toegangscode, en iedereen in hetzelfde boek de anderen live kan zien lezen.',
      stats: [{ v: 'Live', l: 'samen lezen' }, { v: 'SQL', l: 'afgedwongen filter' }, { v: 'Offline', l: 'werkt zonder verbinding' }, { v: '1 klik', l: 'om zelf te hosten' }],
      posterAlt: 'BeadReader op drie telefoons: het inlogscherm, een hoofdstuk en de bibliotheek',
      extra: 'GitHub',
    },
  },
  card: {
    label: '{name}, {badge}',
    tools: 'Tools',
    read: 'Lees het artikel',
    peek: 'Snel bekijken',
  },
  peek: {
    label: 'Projectsamenvatting',
    close: 'Samenvatting sluiten',
  },

  /* ── De decorstukken ── */
  june: {
    feeds: {
      left: { label: 'Links', phone: 'Telefoon 2' },
      center: { label: 'Voor', phone: 'Telefoon 1' },
      right: { label: 'Rechts', phone: 'Telefoon 3' },
    },
    live: 'Live',
    tele: ['Breedte', 'Lengte', 'Satellieten', 'Temperatuur', 'Vocht', 'Snelheid'],
    place: 'Plek',
    placeName: 'Sembawang Park',
    link: [
      { label: 'Xbox-controller', sub: 'Bluetooth naar de console' },
      { label: 'Mijn server', sub: 'MQTT, signalering, TURN' },
      { label: 'Drie telefoons', sub: '5G-hotspot en camera’s' },
      { label: 'ESP32-S3', sub: 'Motoren en sensoren' },
    ],
  },
  pip: {
    shots: [
      'Pip omcirkelt de mitochondriën op een celdiagram op de Tab5',
      'De appla op de Tab5 met de NCIR Thermometer-app',
      'De spotlightbalk op de Tab5, die wisselt tussen bureaubladen',
    ],
  },
  lidar: {
    cloudAlt: 'De afgeronde scan in de kleuren van de camera: de muren en het plafond van een hoek van een kamer',
  },
  bead: {
    mara: 'Mara',
    jae: 'Jae',
    sam: 'Sam',
    here: 'Hier was je',
    readingNow: 'leest nu',
    pct: '{n}%',
    rowSub: 'Hoofdstuk {ch} van {of} · {time} gelezen',
    readTime: '{h}u {m}m',
    maraPhone: 'Mara’s telefoon',
    maraScreen: 'Mara’s scherm',
    waved: 'Braven zwaait naar je',
    noteFrom: 'Braven',
    note: 'mooie twist, zeg!',
    onlineNow: 'Nu online',
    readingHere: 'Leest hier · hfst {ch}',
    elsewhere: '{book} · hfst {ch}',
    otherBook: 'De Hobbit',
    browsing: 'Bladert',
  },

  /* ── Projecten ── */
  gallery: {
    title: 'Alle projecten',
    sub: 'Alles wat ik heb gebouwd, op school, op eigen houtje en tijdens mijn stage.',
    filters: 'Toon projecten',
    all: 'Alle',
    types: { personal: 'Eigen', school: 'School', internship: 'Stage' },
    atM5: 'bij M5Stack',
    flagship: 'Topproject',
    highlight: 'Uitgelicht',
    peek: 'Bekijk een samenvatting van {title}',
    read: 'Lees',
    soon: 'Artikel volgt binnenkort',
  },
  projects: {
    'proj-waterslop': { title: 'OCR Reader', blurb: 'Een camera op een batterij die een watermeter afleest, waarbij een neuraal netwerk op een ESP32-S3 de rollen leest en alleen het getal via LoRaWAN wordt verstuurd.' },
    'proj-june': { title: 'Project June', blurb: 'Een 5G-rover waarvan drie telefoons het beeld naar mijn console streamen, en die ik met een Xbox-controller bestuur vanaf elke plek met bereik.' },
    'proj-pip': { title: 'Pip', blurb: 'Een bureauhuisdier op een M5Stack Tab5 met een AI-agentharness als brein, zodat het een browser kan bedienen en zijn eigen apps kan bouwen.' },
    'proj-lidar': { title: 'Stack-chan LiDAR', blurb: 'Vier afstandssensoren op het hoofd van Stack-chan, die met zijn servo’s door een kamer zwaaien en door zijn camera worden ingekleurd tot een 3D-scan.' },
    'proj-beadreader': { title: 'BeadReader', blurb: 'Een privé-boekenlezer voor een paar vrienden, die inloggen met één toegangscode en elkaar live kunnen zien lezen.' },
    'proj-pantry': { title: 'Houdbaarheidstracker', blurb: 'Een houdbaarheidstracker voor op de koelkastdeur: je scant een barcode, kiest wanneer het over de datum gaat en het scherm laat zien wat je het eerst moet opeten.' },
    'proj-ruler': { title: 'Scroll Ruler', blurb: 'Een digitale liniaal van een AtomS3R en een Unit Scroll, die alles meet waar je het wieltje langs rolt.' },
    'proj-cadmouse': { title: '3D CAD-muis', blurb: 'Een M5Stack Capsule die werkt als draadloze 3D-muis voor Onshape, zodat het model meedraait als je hem in je hand draait.' },
    'proj-lora': { title: 'LoRA Messenger', blurb: 'Twee ESP32-handhelds die tekst sturen via LoRa en ruwe tweewegspraak via ESP-NOW, op mijn eerste PCB.' },
    'proj-lumen': { title: 'LUMEN', blurb: 'Een kamer die je met je stem bedient, op een ESP32, waar Whisper en DeepSeek spraak omzetten in één JSON-commando dat via MQTT gaat.' },
    'proj-ema': { title: 'EMA Smart Home', blurb: 'Een smart home dat we als team bouwden, beoordeeld met een A, waarin vier BeagleBone Black-nodes rapporteren aan een SocketIO-server met een live 3D-dashboard.' },
    'proj-pandus': { title: 'Pandus Dispenser', blurb: 'Mijn eerste schoolproject was een 3D-geprinte siroopdispenser van zes onderdelen, aangestuurd door een Arduino Uno.' },
    'proj-elecf': { title: 'ELEC-F Concept', blurb: 'Een alarm voor een walk-in vriezer op M5Stack, dat aftelt als er iemand binnen is opgesloten.' },
    'proj-kauli': { title: 'Kauli Concept', blurb: 'Een productconcept dat ik pitchte voor een module over communicatievaardigheden, gerenderd in Blender.' },
    'proj-sol': { title: 'Series One Light', blurb: 'Een ultralichte gamingmuisbehuizing op basis van de ZeroMouse, die ik terug wil brengen naar zo’n 20 g.' },
    'proj-copyboard': { title: 'Copy Board', blurb: 'Een namaak in KiCad van het devboard van mijn school, gemaakt omdat ik het origineel niet mee naar huis mocht nemen.' },
    'proj-mc': { title: 'Minecraft Live Map', blurb: 'Een Paper-server in Docker op mijn homelab, met een live Dynmap van de wereld.' },
    'proj-webdev': { title: 'Webdev-project', blurb: 'Mijn eerste werkende website, in HTML en CSS, voor mijn les webontwikkeling.' },
  },

  /* ── Op de werkbank ── */
  bench: {
    title: 'Op de werkbank',
    sub: 'Waar ik aan bouw sinds het laatste artikel.',
    items: {
      shebang: {
        name: 'Shebang',
        status: 'Mijn hostingplatform',
        what: 'Het geeft me één account voor inloggen, statische pagina’s, bestandshosting, korte links en een Postgres-database per project, bereikbaar via één REST API of één MCP-server, zodat mijn codeeragents voor me kunnen publiceren. De MCP-client is open source en staat op npm.',
        stack: ['Next.js 16', 'Zelfgehoste Supabase', 'Postgres', 'MCP', 'Docker'],
        link: 'shebang-mcp op GitHub',
      },
      pip: {
        name: 'Pip',
        status: 'Bezig',
        what: 'Een bureaumaatje op een M5Stack Tab5 dat praat met een AI-agent die thuis draait. Het wisselt tussen meerdere bureaubladen, draait kleine applets die het op verzoek kan bouwen en gebruikt zijn camera.',
        stack: ['ESP32-P4', 'M5Stack Tab5', 'PlatformIO', 'Lua', 'Python'],
      },
      ncir: {
        name: 'NCIR-thermometerdemo’s',
        status: 'Firmware',
        what: 'Deze laten live infraroodtemperatuur zien op M5Stack-schermen voor de NCIR- en NCIR 2-sensoren. De NCIR 2-firmware praat met de eigen I2C-registermap van de sensor zonder bibliotheek van de fabrikant, en één codebase draait op de CoreS3 en de klassieke Basic.',
        stack: ['M5Stack CoreS3', 'C++', 'I2C', 'PlatformIO'],
      },
      flashdeck: {
        name: 'Flashdeck',
        status: 'Tooling',
        what: 'Een plank voor mijn firmware met een flasher in de browser, dus als ik een ESP32 aansluit, kiest ESP Web Tools de image die voor die chip is gebouwd. De server is gewoon Python, zonder dependencies.',
        stack: ['Python', 'Web Serial', 'ESP Web Tools'],
      },
    },
  },

  /* ── Wat ik kan ── */
  skills: {
    title: 'Wat ik kan',
    open: '{word}: {line}. Open de details',
    tiles: {
      hw: {
        word: 'Hardware', line: 'Boards die ik ontwerp en soldeer', title: 'Printplaten',
        blurb: 'Ik teken het schema en ontwerp het board in KiCad, en daarna soldeer ik de onderdelen zelf, ook SMD-onderdelen die ik thuis reflow.',
        points: ['Het vierlaagse board van de OCR Reader, gemaakt door JLCPCB', 'Het board van de LoRA Messenger, mijn eerste PCB', 'Een zelfgemaakte namaak van het ATmega328-devboard van mijn school'],
        chips: ['KiCad', 'EAGLE', 'SMD-reflow', 'Schema-ontwerp'],
        links: ['OCR Reader', 'LoRA Messenger'],
      },
      fw: {
        word: 'Firmware', line: 'C, C++ en MicroPython', title: 'Microcontrollers waarmee ik bouw',
        blurb: 'De meeste van mijn projecten draaien op een microcontroller, en ik schrijf de firmware in C en C++ met PlatformIO, of in MicroPython als dat beter past.',
        points: ['ESP32, mijn standaard voor alles wat draadloos is', 'M5Stack-boards als ik snel een scherm en knoppen nodig heb', 'Arduino Uno en de ATmega328 voor simpelere projecten', 'BeagleBone Black als Linux-brein voor een groter systeem'],
        chips: ['ESP32', 'M5Stack', 'Arduino', 'BeagleBone', 'PlatformIO', 'C / C++', 'MicroPython'],
        links: ['Project June', 'LUMEN'],
      },
      sw: {
        word: 'Software', line: 'Webapps en kleine servers', title: 'Webapps en servers',
        blurb: 'Ik bouw webapps in Next.js en TypeScript en schrijf kleine Python-servers die in Docker draaien.',
        points: ['BeadReader, op Next.js, Supabase Postgres en Cloudflare R2', 'LUMEN, een FastAPI-server die spraak omzet in commando’s voor de kamer', 'Shebang, mijn eigen hostingplatform', 'Deze site, in Next.js op Vercel'],
        chips: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Docker'],
        links: ['BeadReader', 'LUMEN'],
      },
      cad: {
        word: '3D en CAD', line: 'Behuizingen die meteen passen', title: 'Behuizingen die passen',
        blurb: 'Ik modelleer behuizingen en onderdelen in Onshape, render in Blender en print in 3D tot alles goed past.',
        points: ['De behuizing van de OCR Reader, zonder gereedschap', 'De handheldbehuizing van de LoRA Messenger', 'De dispenser van Pandus in zes delen, die bij de eerste print al paste'],
        chips: ['Onshape', 'Blender', '3D-printen'],
      },
      infra: {
        word: 'Infrastructuur', line: 'Drie servers thuis', title: 'Een eigen homelab',
        blurb: 'Ik draai een zelfgehost homelab op Unraid, Proxmox en Docker, achter Nginx en een gesegmenteerd UniFi-netwerk.',
        points: ['Zelfgehoste diensten achter Nginx Proxy Manager en CrowdSec', 'Een WireGuard- en Tailscale-mesh om overal vandaan thuis te komen', 'coturn- en MQTT-servers waar mijn hardwareprojecten op leunen'],
        chips: ['Unraid', 'Proxmox', 'Docker', 'Nginx', 'Tailscale', 'WireGuard', 'UniFi'],
        link: 'Ontdek het HomeLab',
      },
      radio: {
        word: 'Draadloos', line: 'LoRa, ESP-NOW, MQTT en 5G', title: 'Radio’s en live links',
        blurb: 'Ik gebruik LoRa voor bereik, ESP-NOW voor snelle lokale links, MQTT voor telemetrie en WebRTC voor live video via het mobiele netwerk.',
        points: ['Drie live WebRTC-camerastreams via 5G bij Project June', 'Tekst over lange afstand via LoRa en tweewegspraak via ESP-NOW', 'LoRaWAN-uplinks vanaf de OCR Reader'],
        chips: ['LoRa', 'LoRaWAN', 'ESP-NOW', 'MQTT', 'WebRTC', '5G'],
      },
      video: {
        word: 'Video', line: 'Een film bij elk project', title: 'Een film bij elk project',
        blurb: 'Bij mijn projecten monteer en grade ik een korte film in DaVinci Resolve.',
        chips: ['DaVinci Resolve', 'Premiere Pro'],
        links: ['Bekijk de bouw van Project June'],
      },
      ui: {
        word: 'Design', line: 'Interfaces en posters', title: 'Interfaces en posters',
        blurb: 'Ik ontwerp interfaces in Figma en Spline en maak posters in Photoshop.',
        points: ['De bedieningsconsole van Project June en het smarthomedashboard van EMA', 'De poster van het ELEC-F-project'],
        chips: ['Figma', 'Spline', 'Photoshop'],
        links: ['EMA smarthome-UI'],
      },
      photo: {
        word: 'Fotografie', line: 'Vooral op reis', title: 'Foto’s',
        blurb: 'Met fotografie ontdek ik meer van mijn creativiteit, en de meeste foto’s zijn van reizen door Nieuw-Zeeland, China en Europa.',
        link: 'Alle albums',
      },
    },
  },

  /* ── HomeLab ── */
  lab: {
    tag: 'Infrastructuur',
    title: 'HomeLab',
    sub: 'Drie servers thuis waar mijn projecten op draaien.',
    lead: 'Ze bewaren mijn fotobibliotheek en mijn bestanden en draaien de MQTT- en TURN-servers die Project June en LUMEN gebruiken, en de stroom wordt betaald met tegoed van mijn teruggeleverde zonne-energie. Deze site zelf staat op Vercel.',
    facts: [{ v: '3', l: 'servers' }, { v: '24 TB', l: 'netto opslag' }, { v: '38', l: 'zelfgehoste apps' }],
    cta: 'Ontdek het HomeLab',
  },

  /* ── Foto’s ── */
  photos: {
    title: 'Fotografie',
    sub: 'Foto’s uit Nieuw-Zeeland, China en Europa.',
    alt: 'Een foto uit het album {album}',
    albums: { nz: 'Nieuw-Zeeland', china: 'China', europe: 'Europa', highlights: 'Uitgelicht' },
    more: 'Alle albums',
  },

  /* ── Contact ── */
  contact: {
    title: 'Zeg hallo.',
    email: 'Mail me',
    all: 'Overal waar je me vindt',
  },
};

export default nl;
