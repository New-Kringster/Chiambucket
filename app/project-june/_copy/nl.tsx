import type { ProjectJuneCopy } from './en';

const nl: ProjectJuneCopy = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: 'Een 5G-rover die ik in drie weken bouwde, waarbij een ESP32-S3 en drie telefoons drie live camerabeelden, GPS en sensormetingen streamen naar een webconsole waar ik hem vanaf bestuur.',
    ogDescription: 'Een 5G-rover met drie live camerabeelden, GPS, sensoren en MQTT-telemetrie.',
  },
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June, een radiografisch bestuurd 5G-voertuig',
    back: 'Terug naar projecten',
    tag: 'Eigen project',
    title: <>Project <em>June</em></>,
    lead: 'Ik bouwde deze 5G-rover omdat ik een Marsrover wilde, en hij streamt drie live camerabeelden, GPS en sensormetingen (temperatuur, luchtvochtigheid, luchtdruk en helderheid) naar een webconsole waar ik hem vanaf bestuur.',
    builtWith: 'Gemaakt met',
    links: ['GitHub', 'Bekijk de bouw'],
  },
  chapters: 'Hoofdstukken',
  rail: {
    Demo: 'Demo', ProjectJune: 'Overzicht', OnboardSys: 'Aan boord', Ultras: 'Ultrasone sensor', Laser: 'Laser',
    Gps: 'GPS', IMU: '10-assige IMU', Lightsensor: 'Lichtsensor', Dht11: 'DHT11', TechArch: 'Architectuur',
    Livestr: 'Video', ctrlntelm: 'Besturing en telemetrie', Software: 'Software', softD: 'Consoleontwerp', Driving: 'Rijden',
  },
  demo: { h: 'Demo', video: 'Demovideo van Project June' },
  overview: {
    h: 'Overzicht',
    p: 'Ik had twee weken gepland voor Project June en het werden er drie. Het was gehaast en er is veel dat ik anders zou doen, maar het is nog steeds een van de meest ambitieuze dingen die ik heb gebouwd.',
    alt: 'De originele rover van Project June',
    caption: 'De eerste foto van Project June',
  },
  onboard: {
    h: 'Aan boord',
    p: 'Een ESP32-S3 leest de sensoren uit, stuurt de motor aan en verstuurt de telemetrie, terwijl drie telefoons aan boord de rover zijn 5G-hotspot en zijn camerabeelden voor, links en rechts geven. De DC-motor loopt via een MOSFET-motordriver die ik zelf heb gebouwd, en een 2S3P-lithium-ionpakket dat ik van drie 2S-pakketten heb gemaakt vergroot het bereik, terwijl een powerbank de ESP32 en de telefoons van stroom voorziet.',
    alt: 'Onderdelendiagram van Project June: drie telefoons, de ESP32-S3, sensoren, motordriver, powerbank en accupakket',
  },
  sensors: {
    Ultras: {
      h: 'Ultrasone sensor',
      p: 'De ultrasone sensor zit achterop, zodat hij me vertelt hoe ver obstakels achter de rover weg zijn.',
      alt: 'De ultrasone afstandssensor en zijn uitlezing in de console',
    },
    Laser: {
      h: 'Laser',
      p: 'Voorop zit een laserdiode op een 3G-servo, en die kan ik vanuit de console tot 45° naar beide kanten richten.',
      alt: 'De laserdiode op zijn servo en de bediening in de console',
    },
    Gps: {
      h: 'GPS',
      p: 'Een Neo8M-module geeft de live positie van de rover, die op de kaart in de console verschijnt.',
      alt: 'De Neo8M-gps-module en de kaart in de console',
    },
    IMU: {
      h: '10-assige IMU',
      p: 'Eén board geeft me metingen van een versnellingsmeter, een gyroscoop en een barometer, al heb ik de magnetometer nooit gebruikt.',
      alt: 'Het 10-assige IMU-board en zijn uitlezing in de console',
    },
    Lightsensor: {
      h: 'Lichtsensor',
      p: 'De lichtsensor is een TEMT6000, en omdat ik hem niet kon kalibreren, laat de console de helderheid in vier stappen zien: Dark, Ambient, Bright en VBright.',
      alt: 'De TEMT6000-lichtsensor en zijn uitlezing in de console',
    },
    Dht11: {
      h: 'DHT11',
      p: 'De DHT11 meet de temperatuur en luchtvochtigheid van de omgeving.',
      alt: 'De DHT11-temperatuur- en luchtvochtigheidssensor en zijn uitlezing in de console',
    },
  },
  arch: {
    h: 'Architectuur',
    p: 'Dit diagram laat de drie delen van het systeem zien, de rover, de server en de client, en wat er tussen ze loopt.',
    alt: 'Architectuurdiagram: de rover met zijn sensoren en drie telefoons, een server met Mosquitto, een Node.js-Socket.IO-server en CoTURN, en de clientconsole met een Xbox-controller',
  },
  video: {
    h: 'Video',
    p1: 'Elke telefoon stuurt zijn camera als een eigen WebRTC-stream, drie in totaal, doorgegeven via een TURN-server zodat de video ook over mobiele data werkt.',
    p2: 'Hieronder staat een nagebouwde versie van de console met beelden van een rit overdag en een rit in het donker, en je kunt een stap van het signaalpad of een camera kiezen om beter te kijken.',
    systemAlt: 'Diagram van het live videosysteem',
    routingAlt: 'Diagram van de routering van de WebRTC-streams',
  },
  console: {
    labelEnd: '.',
    tag: 'Rijconsole',
    rebuilt: { day: 'Nagebouwd van de dagrit', night: 'Nagebouwd van de nachtrit' },
    toggleAria: 'Kies de dagrit of de nachtrit',
    day: 'Dagrit',
    night: 'Nachtrit',
    signalPath: 'Signaalpad',
    trackAria: 'Signaalpad van controller tot rover',
    nodes: {
      pad: {
        label: 'Xbox-controller',
        sub: 'Bluetooth naar de console',
        blurb: 'De controller koppelt via Bluetooth met de webconsole, en de console maakt van de stick- en triggerinvoer bewegingscommando’s die hij via MQTT publiceert.',
      },
      server: {
        label: 'Server',
        sub: 'MQTT, signalering, TURN',
        blurb: 'Mosquitto regelt de commando’s en de telemetrie, een Node.js-Socket.IO-server serveert de console en handelt de WebRTC-signalering af, en CoTURN geeft de video door zodat die ook over mobiele data werkt.',
      },
      phones: {
        label: 'Drie telefoons',
        sub: '5G-hotspot en camera’s',
        blurb: 'Telefoon 1 is de hoofdhotspot voor 5G en de camera voorop, telefoon 2 is een tweede hotspot en de linkercamera, en telefoon 3 verbindt met de hotspot als de rechtercamera, en elk stuurt zijn beeld als WebRTC-stream.',
      },
      rover: {
        label: 'ESP32-S3',
        sub: 'Op de rover',
        blurb: 'Hij verbindt via wifi met de hotspot van de telefoon, stuurt de motor aan via de MOSFET-driver en stuurt de sensordata via MQTT terug in drie pakketten op zo’n 10 Hz.',
      },
    },
    flow: { out: 'Commando’s', back: 'Video en telemetrie' },
    telemetry: 'Telemetrie',
    metrics: {
      lat: 'Breedtegraad', lon: 'Lengtegraad', speed: 'Snelheid', alt: 'Hoogte',
      temp: 'Temperatuur', hum: 'Vochtigheid', sats: 'Satellieten',
    },
    brightness: 'Helderheid',
    gpsFix: 'GPS-fix',
    cameras: 'Camerabeelden',
    camsAria: 'Kies de hoofdcamera',
    live: 'LIVE',
    camAria: { day: 'Camera {label}, dagrit', night: 'Camera {label}, nachtrit' },
    feeds: {
      left: { label: 'Links', phone: 'Telefoon 2', note: 'Telefoon 2 is de tweede hotspot en de linkercamera.', show: 'Toon de linkercamera (telefoon 2)' },
      center: { label: 'Voor', phone: 'Telefoon 1', note: 'Telefoon 1 is de hoofdhotspot voor 5G en de camera voorop.', show: 'Toon de camera voorop (telefoon 1)' },
      right: { label: 'Rechts', phone: 'Telefoon 3', note: 'Telefoon 3 verbindt met de hotspot en is de rechtercamera.', show: 'Toon de rechtercamera (telefoon 3)' },
    },
  },
  control: {
    h: 'Besturing en telemetrie',
    p1: 'De ESP32 publiceert sensordata op een MQTT-topic waar de client op geabonneerd is, en de client stuurt bewegings- en andere commando’s via een tweede topic terug naar de ESP32.',
    alt1: 'Diagram van het besturings- en telemetriesysteem',
    packetsH: 'Drie pakketten',
    p2: 'Het lukte me niet om alle sensordata in één MQTT-bericht te krijgen en ik weet nog steeds niet waarom, dus het gaat de deur uit als drie losse pakketten op zo’n 10 Hz.',
    alt2: 'Diagram van de drie telemetriepakketten',
  },
  software: {
    h: 'Software',
    p: 'Dit is een vereenvoudigd stroomdiagram van de code.',
    alts: ['Stroomdiagram van de software, deel 1', 'Stroomdiagram van de software, deel 2'],
  },
  design: {
    h: 'Consoleontwerp',
    p: 'Ik heb de console in Figma ontworpen.',
    embed: 'Het consoleontwerp van Project June in Figma',
    splineH: 'Spline 3D',
    splineP: 'De 3D-rover in de console is een Spline-model, dat naar het vooraanzicht draait als ik de controller naar voren duw en naar het achteraanzicht als ik hem terugtrek.',
    modelAlt: 'Het Spline-3D-model van de rover',
    modelCaption: 'Het Spline-model',
    viewCaption: 'De wisseling van aanzicht in de console',
  },
  driving: {
    h: 'Rijden',
    p: 'De video kwam van meer dan 8 km afstand en ging door elk deel van het systeem, dus er zat zo’n seconde vertraging tussen een controllerinvoer en de beweging op het live beeld. De stream was ook niet altijd stabiel, waardoor rijden soms lastig was.',
    repo: {
      title: 'Project June op GitHub',
      text: 'De repository bevat de console, de WebRTC-video, de MQTT-telemetrie en de ESP32-firmware.',
      button: 'Bekijk de code op GitHub',
    },
  },
};

export default nl;
