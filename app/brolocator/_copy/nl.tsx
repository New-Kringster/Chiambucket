import type { BrolocatorCopy } from './en';

const nl: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: 'Mijn eerste PCB, een ESP32-handheld die zonder internet tekst via LoRa verstuurt en via ESP-NOW simpele full-duplex spraak doet, met een board in KiCAD, een 3D-geprinte behuizing uit Onshape en firmware in PlatformIO.',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'De LoRA Messenger-handheld',
    back: 'Terug naar projecten',
    tag: 'Eigen project',
    title: <>LoRA <em>Messenger</em></>,
    lead: 'Dit was mijn eerste PCB en mijn eerste ESP32-project: een paar handhelds die elkaar zonder internet via LoRa berichtjes sturen en via ESP-NOW simpele full-duplex tweewegspraak doen als ze dicht genoeg bij elkaar zijn. Tijdens het bouwen noemde ik hem Brolocator.',
    builtWith: 'Gemaakt met',
    links: ['GitHub', 'Demovideo', '3D-model'],
  },
  chapters: 'Hoofdstukken',
  rail: {
    Demo: 'Demo', Functionality: 'Wat hij doet', ProjectDevelopment: 'Ontwikkeling', Code: 'Code',
    PCBDesign: 'PCB', threeDDesign: 'Behuizing', Assembly: 'Montage',
  },
  demo: { h: 'Demo', video: 'Demovideo van de LoRA Messenger' },
  features: {
    h: 'Wat hij doet',
    items: [
      'Stuurt tekstberichten via LoRa over lange afstand',
      'Doet tweewegspraak via ESP-NOW als het andere apparaat dichtbij genoeg is',
      'Werkt op oplaadbare LiPo-batterijen',
      'Heeft twee schermpjes',
      'Heeft een modus om het bereik te testen',
      'Heeft een simpel menu',
    ],
    p: 'De twee radio’s doen elk iets anders, want LoRa komt verder maar draagt alleen korte tekstpakketjes, terwijl ESP-NOW maar een kort bereik heeft maar snel genoeg is voor simpele tweewegspraak. De demo hieronder laat ze allebei zien.',
    alts: [
      'De voorkant van de LoRA Messenger',
      'De zijkant van de LoRA Messenger',
      'Close-up van de schermpjes',
      'Het menu',
      'Het berichtenscherm',
      'De modus voor de bereiktest',
    ],
  },
  demoWidget: {
    texts: [
      'Onderweg, nog 10 min',
      'Startpunt gevonden',
      'Accu op 40%, ik ga terug',
      'Kamp is net na de bergrug',
    ],
    radio: {
      lora: {
        label: 'Tekst via LoRa',
        short: 'LoRa',
        range: 'Lange afstand',
        carries: 'Korte tekstpakketjes',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa komt veel verder dan ESP-NOW, maar heeft alleen genoeg bandbreedte voor tekst.',
      },
      espnow: {
        label: 'Spraak via ESP-NOW',
        short: 'ESP-NOW',
        range: 'Kort, direct',
        carries: 'Simpele duplexspraak',
        module: 'De ESP32 zelf',
        blurb: 'ESP-NOW is een directe verbinding tussen de twee ESP32’s, snel genoeg voor simpele tweewegspraak, maar alleen op korte afstand.',
      },
    },
    quote: ['“', '”'] as [string, string],
    modesAria: 'Kies een radioverbinding',
    replay: 'Speel de demo af',
    you: 'Jij',
    friend: 'Vriend',
    screen: {
      pick: 'Kies bericht', sending: 'Versturen', delivered: 'Bezorgd',
      micLive: 'Mic aan', holdToTalk: 'Druk en praat',
      newMessage: 'Nieuw bericht', receiving: 'Ontvangen', standingBy: 'Stand-by', listening: 'Luistert',
    },
    link: {
      inFlight: 'Pakket onderweg', delivered: 'Bezorgd', longRange: 'Verre verbinding',
      streaming: 'Spraak beide kanten op', direct: 'Directe verbinding',
    },
    pickLabel: 'Kies een bericht en verstuur het',
    send: 'Via LoRa sturen',
    holdLabel: 'Houd ingedrukt om te praten',
    transmitting: 'Zendt uit',
    holdToTalk: 'Druk en praat',
    gauge: { range: 'Bereik', carries: 'Draagt', radio: 'Radio' },
  },
  dev: {
    h: 'Ontwikkeling',
    p: 'Dit was de eerste keer dat ik echt in microcontrollers dook en mijn eerste PCB, dus ik leerde met hulp van YouTube en ChatGPT hoe ik elk onderdeel moest gebruiken.',
    alt: 'Breadboardprototype met de ESP32, de LoRa-module, een I2S-microfoon en speaker, twee OLED-schermpjes, een draaiknop en knoppen',
    caption: 'Het breadboardprototype met een ESP32 DevKit, een Ebyte E220-900D LoRa-module, een I2S-microfoon en speaker, twee I2C-OLED-schermpjes, een draaiknop en knoppen',
  },
  code: {
    h: 'Code',
    p: 'De ESP32-firmware schreef ik in PlatformIO, want uit mijn onderzoek kwam dat als de beste keuze voor de ESP32. De broncode staat op GitHub, en het volledige PlatformIO-project staat hieronder.',
    alt: 'De firmware open in PlatformIO',
    project: { title: 'PlatformIO-project', text: 'Dit is het complete firmwareproject, klaar om te openen in PlatformIO.', button: 'Download het project' },
    repo: { title: 'Broncode op GitHub', text: 'De broncode van de firmware staat op GitHub.', button: 'Bekijk de code op GitHub' },
  },
  pcb: {
    h: 'PCB',
    p: 'Ik ontwierp het board in KiCAD, zodat alle onderdelen erop passen.',
    schematicAlt: 'Schema in KiCAD',
    schematicCaption: 'Schema',
    layoutAlt: 'Boardlayout in KiCAD',
    layoutCaption: 'Boardlayout',
    finishedAlt: 'De afgewerkte PCB',
    files: { title: 'KiCAD-bestanden', text: 'Dit is het volledige KiCAD-project van het board.', button: 'Download de KiCAD-bestanden' },
  },
  case: {
    h: 'Behuizing',
    p: 'Ik modelleerde de behuizing in Onshape en printte hem in 3D, en het live model staat hieronder.',
    figs: [
      { alt: 'Model van de behuizing in Onshape', caption: 'De behuizing in Onshape' },
      { alt: 'Geprinte versies van de behuizing naast elkaar', caption: 'De geprinte versies van de behuizing' },
      { alt: 'De klemmetjes van de behuizing voor en na het versterken', caption: 'De klemmetjes van de behuizing voor en nadat ik ze versterkte' },
    ],
    model: { title: 'Onshape-model', text: 'Dit is het live 3D-model van de behuizing.', button: 'Open het 3D-model in Onshape' },
  },
  assembly: {
    h: 'Montage',
    figs: [
      { alt: 'Alle onderdelen op de PCB gesoldeerd', caption: 'Alle onderdelen op de PCB gesoldeerd en werkend' },
      { alt: 'De PCB in de behuizing passen', caption: 'De PCB in de behuizing passen' },
      { alt: 'De afgewerkte LoRA Messenger', caption: 'De afgewerkte LoRA Messenger' },
    ],
  },
};

export default nl;
