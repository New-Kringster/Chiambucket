import type { PandusCopy } from './en';

const nl: PandusCopy = {
  meta: {
    title: 'Pandus Dispenser | Braven Chiam',
    description: 'Mijn eerste schoolproject aan Nanyang Polytechnic was een siroopdispenser van zes 3D-geprinte onderdelen, aangestuurd door een Arduino Uno die ik vanuit Python programmeerde met PyFirmata.',
    ogDescription: 'Pandus is een siroopdispenser van zes 3D-geprinte onderdelen, aangestuurd door een Arduino Uno met PyFirmata.',
  },
  ld: { headline: 'Pandus Dispenser' },
  hero: {
    alt: 'De Pandus-siroopdispenser',
    back: 'Terug naar projecten',
    tag: 'Schoolproject',
    title: <>Pandus <em>Dispenser</em></>,
    lead: 'Pandus was mijn eerste schoolproject, een siroopdispenser van zes 3D-geprinte onderdelen, aangestuurd door een Arduino Uno. Ik bouwde hem met de onderdelen die we in de les kregen, plus een paar die ik zelf kocht.',
    builtWith: 'Gemaakt met',
    links: { video: 'Demovideo', cad: '3D-model' },
  },
  chapters: 'Hoofdstukken',
  rail: {
    PromotionalVideo: 'Video', ProjectBackground: 'Achtergrond', DesignProcess: 'Ontwerp',
    ControlnFunction: 'Besturing', Coverimg: 'Coverfoto',
  },
  video: { h: 'Video', title: 'Video van de Pandus Dispenser' },
  background: {
    h: 'Achtergrond',
    p: [
      'Pandus was mijn eerste grote project als eerstejaars aan Nanyang Polytechnic, en de opdracht was open, zonder thema. We kregen een Arduino Uno, een 4G-servo, leds, knoppen, schuifschakelaars, een infrarood botsingsdetectiemodule en een bos draadjes.',
      'Ik had een waterdispenser in gedachten, maar iemand anders had die al gekozen, dus maakte ik in plaats daarvan een siroopdispenser.',
    ],
    alt: 'Een deel van de Pandus-video filmen',
    caption: 'Een deel van de video filmen',
  },
  design: {
    h: 'Ontwerp',
    p: 'Ik ontwierp Pandus in Onshape, en omdat ik er weinig ervaring mee had, kostte het leren van de software veel tijd. Daardoor was er geen tijd voor prototypes, dus ik stuurde het eindontwerp meteen naar de 3D-printer, en elk onderdeel paste bij de eerste print.',
    explodedAlt: 'Opengewerkte weergave van het Pandus-model in Onshape',
    assembledAlt: 'Het in elkaar gezette Pandus-model in Onshape',
    cadTitle: '3D-model',
    cadText: 'Je kunt het Pandus-model in Onshape draaien en uit elkaar halen.',
    cadButton: 'Open het 3D-model in Onshape',
  },
  control: {
    h: 'Besturing',
    p: [
      'We leerden de Arduino vanuit Python te programmeren met de Firmata-bibliotheek. Naast de onderdelen uit de les kocht ik krachtige leds, een DC-pomp en een relaisboard, en de onderdelen die veel stroom trekken liet ik op een aparte powerbank draaien.',
      'De demo hieronder draait één schenkronde uit het stroomschema verderop, en je kunt een niveau kiezen om hem zelf te draaien.',
    ],
    alts: [
      'Stroomschema waarin de infraroodsensor de servo opent en de led aanzet, de keuzeknop het niveau instelt en de bevestigknop de pomp 3, 4 of 5 seconden laat lopen',
      'Schakelschema van de Arduino Uno, de servo, de infraroodsensor, de relais, de DC-pomp, de krachtige led, de zoemer, de knoppen en de indicatorleds',
      'De bedrading in Pandus, met het relaisboard, de knoppen en de indicatorleds',
      'Het breadboard, de zoemer en de Arduino Uno in Pandus',
    ],
  },
  cover: {
    h: 'Coverfoto',
    p: 'Ik fotografeerde Pandus vier keer onder ander licht en mengde de vier foto’s in Photoshop tot de cover.',
    caption: 'Hoe de vier foto’s samen de cover worden',
  },

  demo: {
    level: 'Niveau {n}',
    ledText: ['de rode led', 'de rode en de gele led', 'alle drie de leds'],
    pump: '{s} s pomp',
    phases: {
      idle: { label: 'Wachten', blurb: 'De dispenser wacht tot de infrarood botsingsdetectiemodule een beker ziet.' },
      wake: { label: 'Beker', blurb: 'Als een beker de infraroodmodule activeert, draait de servo naar 180° om het deurtje boven de knoppen te openen, gaat de krachtige led aan en springt het niveau terug naar 1.' },
      select: { label: 'Kiezen', blurb: 'De keuzeknop loopt door de niveaus 1, 2 en 3, en de indicatorleds laten zien welke gekozen is.' },
      pour: { label: 'Schenken', blurb: 'De bevestigknop zet de DC-pomp via het relais 3, 4 of 5 seconden aan, afhankelijk van het niveau.' },
      done: { label: 'Klaar', blurb: 'De pomp stopt en alles gaat uit tot de volgende beker.' },
    },
    selectNow: 'Hij staat nu op niveau {n}, met {leds} aan.',
    cup: {
      idle: 'Beker onder de tuit, leeg en wachtend',
      empty: 'Beker onder de tuit, leeg',
      filling: 'Beker onder de tuit, vult op niveau {n}',
      filled: 'Beker onder de tuit, gevuld op niveau {n}',
    },
    status: { reduced: '{level} · {s} s pomp', auto: 'Loopt vanzelf · {level}', pick: 'Jouw keuze · {level}' },
    resume: 'Laat hem lopen',
    levelsAria: 'Kies een niveau',
    railAria: 'Schenkronde',
    again: 'Nog eentje',
    schemaAria: 'Status van de onderdelen',
    comps: {
      ir: { label: 'IR-module', full: 'Infrarood botsingsdetectiemodule' },
      servo: { label: 'Deurtje', full: 'Servodeurtje boven de knoppen' },
      led: { label: 'Led', full: 'Krachtige led boven de beker' },
      pump: { label: 'Pomp', full: 'DC-pomp, geschakeld door een relais' },
    },
    states: { watching: 'Let op', triggered: 'Geactiveerd', closed: 'Dicht', open: 'Open', on: 'Aan', off: 'Uit', running: 'Loopt' },
  },
};

export default nl;
