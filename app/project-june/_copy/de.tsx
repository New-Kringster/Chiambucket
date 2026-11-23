import type { ProjectJuneCopy } from './en';

/* The Project June article's German words, in the shape of en.tsx. */
const de: ProjectJuneCopy = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: 'Ein 5G-Rover, den ich in drei Wochen gebaut habe: Ein ESP32-S3 und drei Handys streamen drei Live-Kamerabilder, GPS und Sensorwerte an eine Web-Konsole, von der aus ich ihn fahre.',
    ogDescription: 'Ein 5G-Rover mit drei Live-Kamerabildern, GPS, Sensoren und MQTT-Telemetrie.',
  },
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June, ein ferngesteuertes 5G-Fahrzeug',
    back: 'Zu den Projekten',
    tag: 'Eigenes Projekt',
    title: <>Project <em>June</em></>,
    lead: 'Ich habe diesen 5G-Rover gebaut, weil ich einen Marsrover haben wollte. Er streamt drei Live-Kamerabilder, GPS und Sensorwerte (Temperatur, Luftfeuchtigkeit, Luftdruck und Helligkeit) an eine Web-Konsole, von der aus ich ihn fahre.',
    builtWith: 'Gebaut mit',
    links: ['GitHub', 'Video ansehen'],
  },
  chapters: 'Kapitel',
  rail: {
    Demo: 'Demo', ProjectJune: 'Überblick', OnboardSys: 'An Bord', Ultras: 'Ultraschallsensor', Laser: 'Laser',
    Gps: 'GPS', IMU: '10‑Achsen‑IMU', Lightsensor: 'Lichtsensor', Dht11: 'DHT11', TechArch: 'Architektur',
    Livestr: 'Video', ctrlntelm: 'Steuerung, Telemetrie', Software: 'Software', softD: 'Konsolendesign', Driving: 'Am Steuer',
  },
  demo: { h: 'Demo', video: 'Demovideo von Project June' },
  overview: {
    h: 'Überblick',
    p: 'Für Project June hatte ich zwei Wochen eingeplant, und es wurden drei. Es war hektisch, und vieles würde ich heute anders machen, aber es ist immer noch eins der ehrgeizigsten Dinge, die ich je gebaut habe.',
    alt: 'Der ursprüngliche Rover von Project June',
    caption: 'Das erste Foto von Project June',
  },
  onboard: {
    h: 'An Bord',
    p: 'Ein ESP32-S3 liest die Sensoren, steuert den Motor und schickt die Telemetrie, während drei Handys an Bord dem Rover seinen 5G-Hotspot und seine Kamerabilder nach vorne, links und rechts geben. Der DC-Motor läuft über einen MOSFET-Motortreiber, den ich selbst gebaut habe, und ein 2S3P-Lithium-Ionen-Akku, den ich aus drei 2S-Packs zusammengesetzt habe, erhöht die Reichweite, während eine Powerbank den ESP32 und die Handys versorgt.',
    alt: 'Teilediagramm von Project June: drei Handys, der ESP32-S3, Sensoren, Motortreiber, Powerbank und Akkupack',
  },
  sensors: {
    Ultras: {
      h: 'Ultraschallsensor',
      p: 'Der Ultraschallsensor sitzt hinten, also sagt er mir, wie weit Hindernisse hinter dem Rover entfernt sind.',
      alt: 'Der Ultraschall-Abstandssensor und seine Anzeige in der Konsole',
    },
    Laser: {
      h: 'Laser',
      p: 'Vorne sitzt eine Laserdiode auf einem 3G-Servo, und ich kann sie von der Konsole aus bis zu 45° in beide Richtungen ausrichten.',
      alt: 'Die Laserdiode auf ihrem Servo und ihre Steuerung in der Konsole',
    },
    Gps: {
      h: 'GPS',
      p: 'Ein Neo8M-Modul liefert die Live-Position des Rovers, die auf der Karte in der Konsole erscheint.',
      alt: 'Das GPS-Modul Neo8M und die Karte in der Konsole',
    },
    IMU: {
      h: '10-Achsen-IMU',
      p: 'Ein einziges Board liefert mir Werte von Beschleunigungssensor, Gyroskop und Barometer, auch wenn ich sein Magnetometer nie benutzt habe.',
      alt: 'Das 10-Achsen-IMU-Board und seine Anzeige in der Konsole',
    },
    Lightsensor: {
      h: 'Lichtsensor',
      p: 'Der Lichtsensor ist ein TEMT6000, und weil ich ihn nicht kalibrieren konnte, zeigt die Konsole die Helligkeit in vier Stufen: Dark, Ambient, Bright und VBright.',
      alt: 'Der Lichtsensor TEMT6000 und seine Anzeige in der Konsole',
    },
    Dht11: {
      h: 'DHT11',
      p: 'Der DHT11 misst Umgebungstemperatur und Luftfeuchtigkeit.',
      alt: 'Der Temperatur- und Feuchtesensor DHT11 und seine Anzeige in der Konsole',
    },
  },
  arch: {
    h: 'Architektur',
    p: 'Dieses Diagramm zeigt die drei Teile des Systems, den Rover, den Server und den Client, und was zwischen ihnen läuft.',
    alt: 'Architekturdiagramm: der Rover mit seinen Sensoren und drei Handys, ein Server mit Mosquitto, einem Node.js-Socket.IO-Server und CoTURN, und die Client-Konsole mit einem Xbox-Controller',
  },
  video: {
    h: 'Video',
    p1: 'Jedes Handy schickt seine Kamera als eigenen WebRTC-Stream, also drei insgesamt, weitergeleitet über einen TURN-Server, damit das Video auch über mobile Daten funktioniert.',
    p2: 'Unten ist ein Nachbau der Konsole mit Aufnahmen von einer Tag- und einer Nachtfahrt, und du kannst eine Station des Signalwegs oder eine Kamera auswählen, um genauer hinzusehen.',
    systemAlt: 'Diagramm des Live-Video-Systems',
    routingAlt: 'Diagramm des WebRTC-Stream-Routings',
  },
  console: {
    labelEnd: '.',
    tag: 'Fahrkonsole',
    rebuilt: { day: 'Nachbau der Tagfahrt', night: 'Nachbau der Nachtfahrt' },
    toggleAria: 'Tag- oder Nachtfahrt wählen',
    day: 'Tagfahrt',
    night: 'Nachtfahrt',
    signalPath: 'Signalweg',
    trackAria: 'Signalweg vom Controller zum Rover',
    nodes: {
      pad: {
        label: 'Xbox‑Controller',
        sub: 'Bluetooth zur Konsole',
        blurb: 'Der Controller koppelt sich per Bluetooth mit der Web-Konsole, und die Konsole macht aus Stick- und Trigger-Eingaben Fahrbefehle, die sie per MQTT veröffentlicht.',
      },
      server: {
        label: 'Server',
        sub: 'MQTT, Signaling, TURN',
        blurb: 'Mosquitto vermittelt die Befehle und die Telemetrie, ein Node.js-Socket.IO-Server liefert die Konsole aus und übernimmt das WebRTC-Signaling, und CoTURN leitet das Video weiter, damit es auch über mobile Daten funktioniert.',
      },
      phones: {
        label: 'Drei Handys',
        sub: '5G-Hotspot und Kameras',
        blurb: 'Handy 1 ist der Haupt-Hotspot für 5G und die Frontkamera, Handy 2 ist ein zweiter Hotspot und die linke Kamera, und Handy 3 hängt sich als rechte Kamera an den Hotspot. Jedes schickt sein Bild als WebRTC-Stream.',
      },
      rover: {
        label: 'ESP32-S3',
        sub: 'Auf dem Rover',
        blurb: 'Er verbindet sich per WLAN mit dem Hotspot des Handys, steuert den Motor über den MOSFET-Treiber und schickt die Sensordaten per MQTT in drei Paketen mit etwa 10 Hz zurück.',
      },
    },
    flow: { out: 'Befehle', back: 'Video und Telemetrie' },
    telemetry: 'Telemetrie',
    metrics: {
      lat: 'Breite', lon: 'Länge', speed: 'Tempo', alt: 'Höhe',
      temp: 'Temperatur', hum: 'Feuchte', sats: 'Satelliten',
    },
    brightness: 'Helligkeit',
    gpsFix: 'GPS‑Fix',
    cameras: 'Kamerabilder',
    camsAria: 'Hauptkamera wählen',
    live: 'LIVE',
    camAria: { day: 'Kamera {label}, Tagfahrt', night: 'Kamera {label}, Nachtfahrt' },
    feeds: {
      left: { label: 'Links', phone: 'Handy 2', note: 'Handy 2 ist der zweite Hotspot und die linke Kamera.', show: 'Linke Kamera zeigen (Handy 2)' },
      center: { label: 'Vorne', phone: 'Handy 1', note: 'Handy 1 ist der Haupt-Hotspot für 5G und die Frontkamera.', show: 'Frontkamera zeigen (Handy 1)' },
      right: { label: 'Rechts', phone: 'Handy 3', note: 'Handy 3 hängt sich an den Hotspot und ist die rechte Kamera.', show: 'Rechte Kamera zeigen (Handy 3)' },
    },
  },
  control: {
    h: 'Steuerung und Telemetrie',
    p1: 'Der ESP32 veröffentlicht die Sensordaten auf einem MQTT-Topic, das der Client abonniert, und der Client schickt Fahr- und andere Befehle auf einem zweiten Topic zurück an den ESP32.',
    alt1: 'Diagramm des Steuerungs- und Telemetriesystems',
    packetsH: 'Drei Pakete',
    p2: 'Ich habe nicht alle Sensordaten in eine einzige MQTT-Nachricht bekommen und noch nicht herausgefunden, warum, also gehen sie als drei separate Pakete mit etwa 10 Hz raus.',
    alt2: 'Diagramm der drei Telemetriepakete',
  },
  software: {
    h: 'Software',
    p: 'Das ist ein vereinfachtes Flussdiagramm des Codes.',
    alts: ['Flussdiagramm der Software, Teil 1', 'Flussdiagramm der Software, Teil 2'],
  },
  design: {
    h: 'Konsolendesign',
    p: 'Die Konsole habe ich in Figma entworfen.',
    embed: 'Konsolendesign von Project June in Figma',
    splineH: 'Spline 3D',
    splineP: 'Der 3D-Rover in der Konsole ist ein Spline-Modell, das in die Vorwärtsansicht wechselt, wenn ich den Controller nach vorne drücke, und in die Rückwärtsansicht, wenn ich ihn zurückziehe.',
    modelAlt: 'Das Spline-3D-Modell des Rovers',
    modelCaption: 'Das Spline-Modell',
    viewCaption: 'Der Ansichtswechsel in der Konsole',
  },
  driving: {
    h: 'Am Steuer',
    p: 'Das Video kam aus über 8 km Entfernung und lief durch jeden Teil des Systems, also lag zwischen einer Eingabe am Controller und der Bewegung im Livebild etwa eine Sekunde Verzögerung. Der Stream war auch nicht immer stabil, was das Fahren manchmal ganz schön schwer gemacht hat.',
    repo: {
      title: 'Project June auf GitHub',
      text: 'Im Repository liegen die Konsole, das WebRTC-Video, die MQTT-Telemetrie und die ESP32-Firmware.',
      button: 'Code auf GitHub ansehen',
    },
  },
};

export default de;
