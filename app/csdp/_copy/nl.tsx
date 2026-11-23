import type { CsdpCopy } from './en';

const nl: CsdpCopy = {
  meta: {
    title: 'EMA Smart Home | Braven Chiam',
    description: 'Een smart home-systeem dat ik met mijn schoolteam van vijf bouwde en waarvoor we een A kregen. Vier BeagleBone Black Wireless-nodes zorgen voor het klimaat, de badkamer, de keuken en de deur, en een SocketIO-webserver verbindt ze en host een live dashboard met een 3D-weergave in Spline.',
  },
  ld: { headline: 'EMA Smart Home' },
  hero: {
    alt: 'EMA Smart Home',
    back: 'Terug naar projecten',
    tag: 'Schoolproject, team van vijf',
    title: <>EMA Smart <em>Home</em></>,
    lead: 'Dit is een smart home-systeem op vier BeagleBone Black Wireless-boards om het energieverbruik van een huis omlaag te brengen. Het was het ingewikkeldste groepsproject waar ik aan heb gewerkt, het haalde kennis uit meerdere van onze vakken, en we kregen er een A voor.',
    builtWith: 'Gemaakt met',
    links: { demo: 'Live demo', github: 'GitHub', video: 'Promovideo' },
  },
  chapters: 'Hoofdstukken',
  rail: {
    PromoVideo: 'Video', Team: 'Team', ProjBackground: 'Opdracht', DesignProcess: 'Dashboard',
    Climate: 'Klimaatnode', Bathroom: 'Badkamernode', Kitchen: 'Keukennode', Intrusion: 'Inbraaknode',
    Connectivity: 'Verbindingen', SlideDeck: 'Slides', Documentation: 'Documentatie',
  },
  video: { h: 'Video', title: 'Promovideo van EMA Smart Home' },
  team: {
    h: 'Team',
    roles: ['Teamleider, docs, code', 'Artwork, code, ontwerp', 'Docs, code', 'Docs, code', 'Teamlid'],
    me: '{name} (ik)',
    profile: 'Profiel',
    noProfile: 'Geen profiel',
  },
  brief: {
    h: 'Opdracht',
    p: 'We kregen vier BeagleBone Black Wireless-boards en een set MikroBUS Click-modules, met de vraag om een systeem met wifi te bouwen dat duurzaam wonen ondersteunt. We bouwden een smart home-systeem dat het energieverbruik realtime bijhoudt en apparaten schakelt om minder te verbruiken, en daarna voegden we er een node voor inbraakdetectie aan toe.',
    alt: 'Waar elk board in het huis zit',
    caption: 'Waar elk board in het huis zit',
  },
  dashboard: {
    h: 'Dashboard',
    p: <>Het meeste van het project was software, dus het ontwerpwerk ging erin zitten om het dashboard duidelijk, leesbaar en in één oogopslag te begrijpen te maken. We voegden ook een 3D-model van het huis in Spline toe dat elke actie laat zien terwijl hij gebeurt, en je kunt het zelf proberen in de <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">live demo</a>.</>,
    mockAlt: 'Figma-mockup van het dashboard',
    mockCaption: 'Figma-mockup van het dashboard',
    finishedCaption: 'Het afgewerkte dashboard',
    splineCaption: 'De 3D-weergave in Spline die acties live laat zien',
  },
  nodes: {
    Climate: {
      h: 'Klimaatnode',
      p: 'De klimaatnode houdt de temperatuur, de luchtvochtigheid en de aanwezigheid van iemand in de kamer bij, en zet de ventilator alleen aan als er een persoon wordt gezien en de kamer warm en vochtig is.',
      alt: 'Hardware van de klimaatnode',
    },
    Bathroom: {
      h: 'Badkamernode',
      p: 'Met de knoppen en het scherm stel je in hoe lang je wilt douchen. De timer start als de node ziet dat je de douche in stapt, en als de tijd om is gaat er een zoemer af.',
      alt: 'Hardware van de badkamernode',
    },
    Kitchen: {
      h: 'Keukennode',
      p: 'De keukennode houdt het energieverbruik van de koelkast bij en stuurt een energiescore naar het dashboard. Hij werkt ook als brandalarm, dus als hij een onbeheerst vuur ziet, gaat het alarm op elke node af.',
      alt: 'Hardware van de keukennode',
    },
    Intrusion: {
      h: 'Inbraaknode',
      p: 'De inbraaknode merkt het als er op de deur wordt geklopt of als de deur op een ongewoon moment opengaat, en in beide gevallen gaat er op elke node een alarm af.',
      alt: 'Hardware van de inbraaknode',
    },
  },
  connectivity: {
    h: 'Verbindingen',
    p: [
      'Elk board maakt verbinding met een SocketIO-webserver, die het dashboard host en de events en alarmen tussen de nodes regelt.',
      'De kaart hieronder laat de vier nodes en de server zien. Kies een node om te zien wat hij doet, of simuleer een keukenbrand om te zien hoe het alarm elke node bereikt.',
    ],
    diagramAlt: 'Schema van hoe de nodes, de server en het dashboard verbonden zijn',
    diagramCaption: 'Hoe de nodes, de server en het dashboard verbonden zijn',
    repoTitle: 'Broncode op GitHub',
    repoText: 'De repository bevat de code voor elke node en voor de SocketIO-server die het dashboard host.',
    repoButton: 'Bekijk de code op GitHub',
  },
  slides: { h: 'Slides', title: 'Slides van EMA Smart Home (pdf)', open: 'Open de slides (pdf)' },
  docs: { h: 'Documentatie', title: 'Documentatie van EMA Smart Home (pdf)', open: 'Open de documentatie (pdf)' },

  nodeMap: {
    nodes: {
      climate: {
        name: 'Klimaat',
        short: 'Ventilator',
        does: 'Hij zet de ventilator alleen aan als er iemand in de kamer is en de lucht warm en vochtig is.',
        hardware: 'BME680-sensor voor temperatuur en luchtvochtigheid, PIR-aanwezigheidssensor, 8x8-ledmatrix, zoemer',
        alarm: 'Hij gaat af zodra een van de nodes alarm slaat',
      },
      bathroom: {
        name: 'Badkamer',
        short: 'Douchetimer',
        does: 'Hij timet je douchebeurt op de lengte die je met de knoppen instelt, vanaf het moment dat je binnenkomt.',
        hardware: 'PIR-sensor, OLED-scherm, capacitieve knoppen, zoemer',
        alarm: 'Hij speelt drie tonen als de tijd om is',
      },
      kitchen: {
        name: 'Keuken',
        short: 'Energie en vuur',
        does: 'Hij stuurt het energieverbruik van de koelkast als score naar het dashboard en let op brand.',
        hardware: 'Analoge stroomsensor, Flame Click, OLED-scherm, zoemer',
        alarm: 'Bij brand gaat het alarm op elke node af',
      },
      intrusion: {
        name: 'Inbraak',
        short: 'Beveiliging',
        does: 'Hij let op geklop op de deur en op de deur die op een ongewoon moment opengaat.',
        hardware: 'Reedcontact op de deur, trillingssensor voor geklop, zoemer',
        alarm: 'Bij allebei gaat het alarm op elke node af',
      },
    },
    hub: { label: 'Webserver', idle: 'SocketIO, host het dashboard', alarm: 'Alarm naar alle nodes' },
    nodeAria: '{name}-node',
    nodeAriaAlarm: '{name}-node, alarm gaat af',
    alarmTag: 'Alarm',
    caption: 'Elke lijn is een SocketIO-verbinding, en de stipjes zijn metingen op weg naar de server.',
    eyebrow: { pinned: 'Gekozen node', idle: 'Kies een node' },
    tabsAria: 'Sensornodes',
    cardTitle: '{name}-node',
    terms: { does: 'Doet', hardware: 'Hardware', buzzer: 'Zoemer' },
    status: {
      idle: 'Verbonden en stuurt metingen naar de server',
      arming: 'De keuken ziet een vlam en de zoemer gaat af',
      travelling: 'Alarm onderweg naar de server',
      received: 'De server verspreidt het alarm en elke node gaat af',
    },
    sim: { run: 'Simuleer een keukenbrand', busy: 'Alarm loopt' },
    hint: 'Als de keukennode een vlam ziet, krijgt de server het alarm en stuurt hij het door naar elke node.',
  },
};

export default nl;
