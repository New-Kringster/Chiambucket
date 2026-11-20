import type { AiUseCopy } from './en';

/* De woorden van de /ai-use-pagina in het Nederlands, in dezelfde vorm als en.tsx.
   ­ is een zacht afbreekstreepje voor de smalle kolommen op de telefoon. */
const nl: AiUseCopy = {
  meta: {
    title: 'Schaal van AI-gebruik | Braven Chiam',
    description:
      'Hoe ik AI gebruik in mijn projecten, en de schaal met vier niveaus (L1 tot L4) waarmee ik aangeef hoeveel van elk project met AI-tools is gemaakt.',
  },
  ldHeadline: 'Schaal van AI-gebruik',

  title: 'Schaal van AI-gebruik',
  sub: 'Met deze schaal laat ik eerlijk zien hoeveel invloed AI-tools op mijn projecten hebben gehad.',
  scaleLabel: 'De vier niveaus',
  humanEnd: 'Mens beslist',
  agentEnd: 'Agents beslissen',

  stance: {
    title: 'Waarom ik AI gebruik, en waarom ik dat zeg',
    body: [
      'Volgens mij is AI een revolutionaire technologie die in veel vakgebieden ongekend snelle ontwikkeling mogelijk maakt. In plaats van het gebruik af te schermen en te beperken, zoals de meeste instellingen doen, laat ik mezelf deze tools tot het uiterste verkennen en zoek ik de grenzen op van wat ze kunnen. Zo leer ik steeds meer over deze technologie, die continu verandert en snel beter wordt, en dat maakt mijn werk flink sneller en beter.',
      'Ik ben er wel echt tegen om AI-tools te gebruiken voor werk van lage kwaliteit waar weinig moeite in zit, vooral kunst. Ik gebruik AI-tools in mijn ontwerpwerk, maar ik sleutel zelf flink aan de ontwerpstijlen tot ze op een niveau zijn dat ik met trots kan laten zien.',
      'Daarom heb ik deze schaal gemaakt, zodat je makkelijk kunt zien hoeveel AI er bij een project kwam kijken. Vind je hem handig? Gebruik hem dan gerust ook voor je eigen werk!',
    ],
  },

  levelsTitle: 'De vier niveaus',
  levelsIntro: 'Elk niveau omvat alles van de niveaus ervoor.',
  usesLabel: 'Typisch gebruik bij {code}',
  levels: {
    l1: {
      code: 'L1',
      short: 'Weinig gebruik',
      name: 'Weinig tot verwaarloosbaar gebruik van AI',
      alt: 'L1-badge: weinig gebruik van AI-tools',
      body: [
        'Ik heb AI-tools in het project gebruikt, maar ze hadden weinig tot geen invloed op het resultaat.',
      ],
      uses: ['Herformuleren', 'Ideeën', 'Haalbaarheidschecks', 'Kleine klusjes', 'Grafieken maken', 'Mijn werk nakijken'],
    },
    l2: {
      code: 'L2',
      short: 'Gemiddeld gebruik',
      name: 'Gemiddeld gebruik van AI',
      alt: 'L2-badge: gemiddeld gebruik van AI-tools',
      body: [
        'Alles van niveau 1, en daarnaast zijn AI-tools gebruikt om kernonderdelen van het project te maken of te genereren.',
      ],
      uses: ['Code schrijven', 'Assets waar het project op leunt, zoals texturen voor een 3D-object', 'Apparaten configureren'],
    },
    l3: {
      code: 'L3',
      short: 'Veel gebruik',
      name: 'Veel gebruik van AI',
      alt: 'L3-badge: veel gebruik van AI-tools',
      body: [
        'Niveau 3 gaat nog een stap verder. AI-tools draaiden in automatiseringslussen en namen zelf cruciale beslissingen met grote impact voor het project, zonder eerst een mens te vragen. De code is bijna helemaal door AI geschreven, met weinig tot geen menselijke inbreng.',
        'Mensen krijgen een rol op een hoger niveau: ze orkestreren en beheren het werk dat de AI-agents opleveren. Mensen zitten nog steeds in de lus en nemen de belangrijkste beslissingen.',
      ],
      uses: ['Agents in automatiseringslussen', 'Bijna alle code door AI geschreven', 'Mensen orkestreren en controleren'],
    },
    l4: {
      code: 'L4',
      short: 'Volledig AI',
      name: 'Volledig door AI gegenereerd',
      alt: 'L4-badge: volledig gemaakt met AI-tools',
      body: [
        'Op niveau 4 gaat de orkestratie over naar een agent. Mensen zitten niet meer in de lus, en agents nemen elke beslissing zelf.',
        'Een mens stelt de doelen en laat de agents in een lus draaien. Een mens grijpt zelden in, alleen als het nodig is. De resultaten komen pas bij de mens om te gebruiken of te bestuderen als het werk af is.',
      ],
      uses: ['Een mens stelt het doel', 'Agents orkestreren andere agents', 'Resultaten nagekeken na afloop'],
    },
  },

  compareTitle: 'De niveaus naast elkaar',
  compareIntro: 'Elke rij stelt alle vier de niveaus dezelfde vraag.',
  compareCaption: 'Vergelijking van de vier niveaus van AI-gebruik',
  rows: [
    {
      q: 'Hoeveel AI',
      a: ['Weinig tot verwaar­loosbaar', 'Gemiddeld', 'Veel', 'Volledig door AI gegene­reerd'],
    },
    {
      q: 'Waar AI aan werkt',
      a: ['Kleine onder­steunende taken', 'Kern­onderdelen van het project', 'Bijna al het werk, in automati­serings­lussen', 'Al het werk'],
    },
    {
      q: 'Wie het kernwerk doet',
      a: ['Ik', 'Ik, met AI die kern­onderdelen genereert', 'AI-agents', 'AI-agents'],
    },
    {
      q: 'Wie de hoofd\u00ADbeslissingen neemt',
      a: ['Ik', 'Ik', 'Ik, terwijl AI zelf een paar cruciale keuzes maakt', 'Agents, die werken aan doelen die ik stel'],
    },
    {
      q: 'AI handelt zonder te vragen',
      a: ['Nee', 'Nee', 'Ja', 'Ja'],
    },
    {
      q: 'Mens in de lus',
      a: ['Ja, de hele tijd', 'Ja, de hele tijd', 'Ja, voor de belangrijkste beslissingen', 'Nee, alleen aan het begin en het eind'],
    },
    {
      q: 'Mijn rol',
      a: ['Maker', 'Maker, met AI als tool', 'Orkes­trator en manager', 'Stelt het doel, grijpt zelden in, bestudeert de resultaten'],
    },
    {
      q: 'Voorbeelden',
      a: [
        'Herfor­muleren, haalbaar­heids­checks, grafieken, mijn werk nakijken',
        'Code schrijven, 3D-texturen, apparaten configureren',
        'Agentlussen die bijna alle code schrijven',
        'Agents die zelf naar een gesteld doel toewerken',
      ],
    },
  ],

  downloadTitle: 'Download de badges',
  downloadIntro:
    'Elk niveau is er als label, als kleiner icoon en als verticale en horizontale versie met een QR-code die terugverwijst naar deze pagina, allemaal als SVG-bestanden waarmee je je eigen projecten kunt markeren.',
  marks: {
    label: { label: 'Label', name: 'label' },
    icon: { label: 'Icoon', name: 'icoon' },
    'vertical-qr': { label: 'Verticaal QR', name: 'verticale QR-code' },
    'horizontal-qr': { label: 'Horizontaal QR', name: 'horizontale QR-code' },
  },
  markAlt: '{code}-badge: {name}',
  downloadLabel: 'Download de {code}-badge ({name}) als SVG',
};

export default nl;
