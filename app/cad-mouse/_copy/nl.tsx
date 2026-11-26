import type { CadMouseCopy } from './en';

const nl: CadMouseCopy = {
  meta: {
    title: '3D CAD-muis | Braven Chiam',
    description: 'Een draadloze 3D-muis voor Onshape, gemaakt van een M5Stack Capsule. Je klikt op de knop en draait hem in je hand, en het model op het scherm draait mee, want de Capsule doet zich via Bluetooth voor als een SpaceMouse van 3Dconnexion.',
    ogDescription: 'Draai een M5Stack Capsule in je hand en het model in Onshape draait mee.',
  },
  ld: {
    headline: '3D CAD-muis',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', '3D-muis', 'Onshape'],
  },
  hero: {
    alt: 'De M5Stack Capsule v1.1 rechtop, met het kleurige pinlabel naar voren en de USB-C-poort onderaan',
    back: 'Terug naar projecten',
    tag: 'Stageproject',
    title: <>3D CAD-<em>muis</em></>,
    lead: 'Ik heb van een M5Stack Capsule een draadloze 3D-muis voor Onshape gemaakt. Je klikt op de knop en draait hem in je hand, en het model op het scherm draait mee, alsof je het onderdeel zelf vasthoudt.',
    builtWith: 'Gemaakt met',
    burnerTitle: 'De firmware staat nog niet op M5Burner',
    burner: 'Installeer via M5Burner',
    burnerSoon: 'Binnenkort',
    meta: 'Stageproject bij M5Stack, november 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.',
  },
  chapters: 'Hoofdstukken',
  rail: {
    demo: 'Demo', try: 'Probeer het', use: 'Het gebruik', how: 'Hoe het werkt',
    spacemouse: 'Vermomd als SpaceMouse', turning: 'Je hand volgen', stopping: 'Netjes stoppen',
    hardware: 'Hardware', setup: 'Zelf instellen',
  },
  demo: {
    h: 'Demo',
    p: 'Ik filmde dit aan mijn bureau met een van mijn behuizingen open in Onshape. Met draaien aan draait en kantelt het onderdeel als ik de Capsule draai, en als ik de knop ingedrukt houd, kan ik het onderdeel over het scherm schuiven en op de knopjes inzoomen.',
    video: 'Een oranje behuizing in Onshape draaien door de Capsule in mijn hand te draaien, en dan verschuiven en inzoomen op de knopjes',
    moments: [
      { label: 'Het onderdeel draaien', note: 'Draaien staat aan, dus het onderdeel draait en kantelt met mijn hand mee' },
      { label: 'Omkeren', note: 'Als ik de Capsule helemaal omkantel, zie je de onderkant' },
      { label: 'Opzij schuiven', note: 'Met de knop ingedrukt schuift het onderdeel opzij en weer terug' },
      { label: 'Inzoomen', note: 'Een draai terwijl ik hem vasthoud zoomt in op de knopjes en weer uit' },
    ],
  },
  try: {
    h: 'Probeer het',
    p: 'Dit is de behuizing uit de demo, die ik voor mijn LoRA Messenger heb ontworpen, en het is hetzelfde model dat ik in Onshape open had staan. Sleep eraan en hij draait zoals wanneer ik de Capsule draai, terwijl de Capsule ernaast laat zien wat mijn hand en de knop dan zouden doen.',
    note: 'De echte Capsule meet hoe snel je hand draait, zodat het onderdeel over dezelfde hoek draait als je hand. Hier neemt je sleepbeweging die rol over.',
  },
  /** the simulator's words (CadSim) */
  sim: {
    /** the Capsule's light, by state */
    led: {
      ready: 'Groen knipperen: verbonden, draaien uit',
      rotate: 'Cyaan: draaien aan',
      pan: 'Oranje: knop ingedrukt',
      fit: 'Witte flits: passend',
    },
    viewport: 'De behuizing van de LoRA Messenger in een CAD-weergave. Sleep om hem te draaien, sleep met Shift om hem te verschuiven, scroll om te zoomen en dubbelklik om hem passend te maken. De pijltjestoetsen draaien hem, Shift met de pijltjestoetsen verschuift hem, plus en min zoomen, en 0 maakt hem passend.',
    loading: 'Behuizing wordt geladen',
    failed: 'De 3D-weergave kon in deze browser niet starten.',
    hint: 'Sleep om de behuizing te draaien',
    zoomIn: 'Inzoomen',
    zoomOut: 'Uitzoomen',
    fit: 'Passend',
    /** the key under the view: its two column heads, then each control with a mouse, with a touch screen, and as the Capsule's gesture */
    heads: { here: 'In deze weergave', capsule: 'Met de Capsule' },
    moves: {
      rotate: { mouse: 'Slepen', touch: 'Slepen met één vinger', capsule: 'Op de knop klikken en dan je hand draaien' },
      pan: { mouse: 'Slepen met rechts of met Shift', touch: 'Slepen met twee vingers', capsule: 'De knop ingedrukt houden en met de Capsule wijzen' },
      zoom: { mouse: 'Scrollen', touch: 'Knijpen', capsule: 'De knop ingedrukt houden en de Capsule verdraaien' },
      fit: { mouse: 'Dubbelklikken', touch: 'Dubbeltikken', capsule: 'Dubbelklikken op de knop' },
    },
  },
  use: {
    h: 'Het gebruik',
    p1: 'Je houdt de Capsule rechtop met het label naar je toe en de USB-poort onderaan, en de ene knop doet alles.',
    parts: [
      { b: 'Klik: draaien', s: 'Een klik zet draaien aan, en het lampje wordt cyaan. Vanaf dan volgt het model je hand tot je weer klikt. Draaien begint 0,3 seconde na de klik, want zo lang wacht hij om een dubbelklik uit te sluiten.' },
      { b: 'Vasthouden: schuiven en zoomen', s: 'Als je de knop ingedrukt houdt, pauzeert draaien en verschuif je in plaats daarvan, met een oranje lampje. Wijs je de Capsule naar links, rechts, omhoog of omlaag, dan schuift het model die kant op, en met een draai zoom je. Laat je los, dan gaat draaien weer verder.' },
      { b: 'Dubbelklik: passend maken', s: 'Een dubbelklik zet het hele model passend op het scherm, en draaien blijft zoals het was.' },
    ],
    p2: 'Het lampje ademt blauw terwijl hij op een computer wacht en knippert om de paar seconden groen zodra hij verbonden is. Een hoge tik betekent dat draaien aan staat en een lagere dat het uit staat, en na een lange tijd zonder gebruik zet de Capsule zichzelf uit.',
  },
  how: {
    h: 'Hoe het werkt',
    p: 'De Capsule heeft een gyroscoop en een versnellingsmeter in zijn IMU, een knop en Bluetooth, en dat is alles wat een 3D-muis nodig heeft. Het lastige was om Onshape ernaar te laten luisteren.',
  },
  spacemouse: {
    h: 'Vermomd als SpaceMouse',
    p: 'Onshape neemt alleen 3D-muisinvoer aan via de driver van 3Dconnexion, het bedrijf dat de SpaceMouse maakt. Dus de Capsule stelt zich via Bluetooth voor als hun SpaceMouse Wireless, met de ID’s van dat model en dezelfde opbouw voor zijn reports, en de driver doet de rest. Er hoeft niets in Onshape geïnstalleerd te worden. De Bluetooth-kant bouwde ik op de code van een air mouse die ik eerder had gemaakt, en die werkte al met Windows en macOS.',
  },
  turning: {
    h: 'Je hand volgen',
    p1: 'Een echte SpaceMouse meldt hoe ver je zijn kap duwt, en de driver maakt daar een snelheid van. De Capsule stuurt in plaats daarvan met zijn gyroscoop door hoe snel je hand draait, zodat de driver het model over dezelfde hoek draait als je hand. Het voelt alsof je het onderdeel vasthoudt in plaats van het te besturen.',
    p2: 'De versnellingsmeter bepaalt alleen waar beneden is. Daardoor blijven de assen recht hoe je de Capsule ook vastpakt, dus als je hem om de verticale as draait, draait het model altijd om de verticale as van het scherm. Ik gebruikte hem niet om het model te verplaatsen, want een positie die je uit een versnellingsmeter berekent, drijft binnen een seconde weg. Daarom komt verschuiven van het richten van de Capsule.',
  },
  stopping: {
    h: 'Netjes stoppen',
    p1: 'Als je op de knop drukt, bevriest de uitvoer meteen, zodat de schok van je duim en het stilvallen van je hand het model nooit bereiken. Terwijl je hand beweegt, stuurt de Capsule 62,5 keer per seconde een report, net als de echte SpaceMouse. Stopt je hand, dan blijft hij nullen sturen tot er drie zijn doorgekomen, want als het laatste report verloren gaat, blijft het model draaien. Daarna wordt hij stil.',
    p2: 'Het rekenwerk voor de beweging en de knopgebaren zit in één bibliotheek zonder hardwarecode, dus 19 unittests controleren het op een computer voor elke flash.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'M5Stack Capsule v1.1', s: 'is het hele apparaat, zonder iets extra’s. De ESP32-S3 draait de firmware en de Bluetooth, de BMI270-IMU leest de gyroscoop 200 keer per seconde, en de RGB-led en de zoemer geven de feedback.' },
      { b: 'De knop', s: 'boven op de Capsule doet alle drie de gebaren.' },
      { b: 'Een batterij van 250 mAh', s: 'binnenin houdt hem draadloos, en hij zet zichzelf uit als hij een tijdje niet bewogen heeft.' },
    ],
    holdAlt: 'De Capsule voor de monitor houden terwijl de behuizing in Onshape meedraait',
    holdCaption: 'De behuizing draaien in de demo',
  },
  setup: {
    h: 'Zelf instellen',
    steps: [
      <>Installeer de gratis driver van 3Dconnexion, 3DxWare, op je computer. Daar zit het deel in waarmee Onshape in de browser naar een 3D-muis kan luisteren.</>,
      <>Flash de firmware met M5Burner op een Capsule v1.1. Hij staat nog niet op M5Burner, dus deze stap volgt binnenkort.</>,
      <>Open de Bluetooth-instellingen van je computer en koppel <b>Capsule CAD Mouse</b>. Hij piept als hij verbinding maakt.</>,
      <>Open een model in Onshape, klik op de knop en draai de Capsule.</>,
    ],
    note: 'Ik heb het tot nu toe alleen in Onshape geprobeerd. Andere programma’s die een SpaceMouse via 3DxWare gebruiken, zouden op dezelfde manier moeten werken, maar die heb ik nog niet getest, en ik heb ook nog niet gemeten hoe lang de batterij meegaat.',
  },
};

export default nl;
