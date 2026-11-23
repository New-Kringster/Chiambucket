import type { BrolocatorCopy } from './en';

/* The LoRA Messenger article's German words, in the shape of en.tsx. */
const de: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: 'Meine erste Platine, ein ESP32-Handgerät, das ohne Internet Text über LoRa schickt und über ESP-NOW einfache Vollduplex-Sprache überträgt, mit einer Platine aus KiCAD, einem 3D-gedruckten Gehäuse aus Onshape und Firmware in PlatformIO.',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'Das Handgerät LoRA Messenger',
    back: 'Zu den Projekten',
    tag: 'Eigenes Projekt',
    title: <>LoRA <em>Messenger</em></>,
    lead: 'Das war meine erste Platine und mein erstes ESP32-Projekt: zwei Handgeräte, die sich ohne Internet über LoRa Nachrichten schreiben und über ESP-NOW einfache Vollduplex-Sprache in beide Richtungen übertragen, wenn sie in Reichweite sind. Während ich es gebaut habe, hieß es Brolocator.',
    builtWith: 'Gebaut mit',
    links: ['GitHub', 'Demovideo', '3D‑Modell'],
  },
  chapters: 'Kapitel',
  rail: {
    Demo: 'Demo', Functionality: 'Funktionen', ProjectDevelopment: 'Entwicklung', Code: 'Code',
    PCBDesign: 'Platine', threeDDesign: 'Gehäuse', Assembly: 'Zusammenbau',
  },
  demo: { h: 'Demo', video: 'Demovideo des LoRA Messenger' },
  features: {
    h: 'Funktionen',
    items: [
      'Schickt Textnachrichten über LoRa über große Distanzen',
      'Überträgt Sprache in beide Richtungen über ESP-NOW, wenn das andere Gerät in Reichweite ist',
      'Läuft mit wiederaufladbaren LiPo-Akkus',
      'Hat zwei Displays',
      'Hat einen Modus zum Testen der Reichweite',
      'Hat ein einfaches Menü',
    ],
    p: 'Die beiden Funkwege haben verschiedene Aufgaben, weil LoRa weiter reicht, aber nur kurze Textpakete trägt, während ESP-NOW nur kurze Reichweite hat, dafür aber schnell genug für einfache Sprache in beide Richtungen ist. Die Demo unten zeigt beides.',
    alts: [
      'Die Vorderseite des LoRA Messenger',
      'Die Seite des LoRA Messenger',
      'Nahaufnahme der Displays',
      'Das Menü',
      'Der Bildschirm für Nachrichten',
      'Der Modus zum Testen der Reichweite',
    ],
  },
  demoWidget: {
    texts: [
      'Bin unterwegs, gib mir 10',
      'Hab den Wanderweg gefunden',
      'Akku bei 40 %, ich komm zurück',
      'Das Lager ist gleich hinterm Grat',
    ],
    radio: {
      lora: {
        label: 'Text über LoRa',
        short: 'LoRa',
        range: 'Große Distanz',
        carries: 'Kurze Textpakete',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa reicht viel weiter als ESP-NOW, hat aber nur genug Bandbreite für Text.',
      },
      espnow: {
        label: 'Sprache über ESP-NOW',
        short: 'ESP-NOW',
        range: 'Kurz und direkt',
        carries: 'Grobe Vollduplex‑Sprache',
        module: 'Der ESP32 selbst',
        blurb: 'ESP-NOW ist eine direkte Verbindung zwischen den beiden ESP32, schnell genug für einfache Sprache in beide Richtungen, aber nur auf kurze Distanz.',
      },
    },
    quote: ['„', '“'] as [string, string],
    modesAria: 'Funkverbindung wählen',
    replay: 'Demo abspielen',
    you: 'Du',
    friend: 'Freund',
    screen: {
      pick: 'Nachricht wählen', sending: 'Sendet', delivered: 'Zugestellt',
      micLive: 'Mikro an', holdToTalk: 'Halten & reden',
      newMessage: 'Neue Nachricht', receiving: 'Empfängt', standingBy: 'Bereit', listening: 'Hört zu',
    },
    link: {
      inFlight: 'Paket unterwegs', delivered: 'Zugestellt', longRange: 'Fernverbindung',
      streaming: 'Sprache hin und zurück', direct: 'Direktverbindung',
    },
    pickLabel: 'Nachricht wählen, dann senden',
    send: 'Über LoRa senden',
    holdLabel: 'Gedrückt halten zum Sprechen',
    transmitting: 'Sendet',
    holdToTalk: 'Halten & reden',
    gauge: { range: 'Reichweite', carries: 'Trägt', radio: 'Funk' },
  },
  dev: {
    h: 'Entwicklung',
    p: 'Das war mein erster richtiger Einstieg in Mikrocontroller und meine erste Platine, also habe ich mit Hilfe von YouTube und ChatGPT gelernt, wie man jedes Bauteil benutzt.',
    alt: 'Prototyp auf dem Steckbrett mit ESP32, LoRa-Modul, I2S-Mikrofon und Lautsprecher, zwei OLED-Displays, Drehgeber und Tasten',
    caption: 'Der Prototyp auf dem Steckbrett mit einem ESP32 DevKit, einem LoRa-Modul Ebyte E220-900D, einem I2S-Mikrofon und Lautsprecher, zwei I2C-OLED-Displays, einem Drehgeber und Tasten',
  },
  code: {
    h: 'Code',
    p: 'Die ESP32-Firmware habe ich in PlatformIO geschrieben, weil meine Recherche es als beste Wahl für den ESP32 empfohlen hat. Der Quellcode liegt auf GitHub, und das ganze PlatformIO-Projekt findest du unten.',
    alt: 'Die Firmware offen in PlatformIO',
    project: { title: 'PlatformIO-Projekt', text: 'Das ist das komplette Firmware-Projekt, fertig zum Öffnen in PlatformIO.', button: 'Projekt herunterladen' },
    repo: { title: 'Quellcode auf GitHub', text: 'Der Quellcode der Firmware liegt auf GitHub.', button: 'Code auf GitHub ansehen' },
  },
  pcb: {
    h: 'Platine',
    p: 'Ich habe die Platine in KiCAD so entworfen, dass sie jedes Bauteil trägt.',
    schematicAlt: 'Schaltplan in KiCAD',
    schematicCaption: 'Schaltplan',
    layoutAlt: 'Platinenlayout in KiCAD',
    layoutCaption: 'Platinenlayout',
    finishedAlt: 'Die fertige Platine',
    files: { title: 'KiCAD-Dateien', text: 'Das ist das komplette KiCAD-Projekt der Platine.', button: 'KiCAD-Dateien herunterladen' },
  },
  case: {
    h: 'Gehäuse',
    p: 'Das Gehäuse habe ich in Onshape modelliert und 3D-gedruckt, und das Live-Modell ist unten verlinkt.',
    figs: [
      { alt: 'Modell des Gehäuses in Onshape', caption: 'Das Gehäuse in Onshape' },
      { alt: 'Gedruckte Versionen des Gehäuses nebeneinander', caption: 'Die gedruckten Versionen des Gehäuses' },
      { alt: 'Clips des Gehäuses vor und nach dem Verstärken', caption: 'Die Clips des Gehäuses, bevor und nachdem ich sie verstärkt habe' },
    ],
    model: { title: 'Onshape-Modell', text: 'Das ist das live 3D-Modell des Gehäuses.', button: '3D-Modell in Onshape öffnen' },
  },
  assembly: {
    h: 'Zusammenbau',
    figs: [
      { alt: 'Alle Bauteile auf die Platine gelötet', caption: 'Alle Bauteile auf die Platine gelötet, und alles funktioniert' },
      { alt: 'Die Platine ins Gehäuse einsetzen', caption: 'Die Platine ins Gehäuse einsetzen' },
      { alt: 'Der fertige LoRA Messenger', caption: 'Der fertige LoRA Messenger' },
    ],
  },
};
export default de;
