import type { ScrollRulerCopy } from './en';

const nl: ScrollRulerCopy = {
  meta: {
    title: 'Scroll Ruler | Braven Chiam',
    description: 'Een digitale liniaal, gebouwd van een M5Stack AtomS3R en een Unit Scroll tijdens mijn stage bij M5Stack. Je drukt het scrollwieltje in en rolt het langs wat je wilt meten, en na één kalibratie van 10 cm laat het scherm de afstand in centimeters zien.',
    ogDescription: 'Rol de Unit Scroll ergens langs en de AtomS3R laat zien hoe lang het is.',
  },
  ld: {
    headline: 'Scroll Ruler',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'draaiencoder', 'digitale liniaal'],
  },
  hero: {
    alt: 'De Scroll Ruler: een AtomS3R op de Atomic Battery Base, met de Unit Scroll eronder aangesloten en 0.0 cm op het scherm',
    back: 'Terug naar projecten',
    tag: 'Stageproject',
    title: <>Scroll <em>Ruler</em></>,
    lead: 'Deze digitale liniaal bouwde ik tijdens mijn stage bij M5Stack van een AtomS3R en een Unit Scroll. Je drukt het scrollwieltje in en rolt het langs wat je wilt meten, en het scherm laat de afstand in centimeters zien.',
    builtWith: 'Gemaakt met',
    links: ['GitHub', 'Flash de firmware'],
    meta: 'Stageproject bij M5Stack, november 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.',
  },
  chapters: 'Hoofdstukken',
  rail: {
    demo: 'Demo', try: 'Probeer het', use: 'Het gebruik', measure: 'Meten', calibrate: 'Kalibreren',
    steps: 'Hoe fijn hij meet', how: 'Hoe het werkt', hardware: 'Hardware', setup: 'Zelf instellen',
  },
  demo: {
    h: 'Demo',
    p: 'Ik filmde dit aan mijn bureau. Eerst kalibreerde ik hem over 10 cm van een liniaal en daarna mat ik drie lengtes langs diezelfde liniaal.',
    video: 'De Scroll Ruler gekalibreerd over 10 cm van een liniaal, en dan metingen van 4,1, 8,2 en 7,3 cm',
    moments: [
      { label: 'Kalibreren over 10 cm', note: 'Hij telde 49 stappen van het wieltje, zo’n 2 mm per stap' },
      { label: 'De eerste meting', note: 'Langs de liniaal gerold geeft hij 4,1 cm aan' },
      { label: 'De tweede meting', note: 'Een langere rol geeft 8,2 cm aan' },
      { label: 'De derde meting', note: 'De laatste rol geeft 7,3 cm aan' },
    ],
  },
  try: {
    h: 'Probeer het',
    p: 'Deze kopie van de liniaal draait dezelfde logica als de firmware en begint op het kalibratiescherm. Sleep de Unit Scroll langs de liniaal om hem met ingedrukt wieltje te rollen, wat telt, of klik op de liniaal om hem op te tillen en ergens anders neer te zetten, wat niet telt. Tik op het scherm om een kalibratie op te slaan of de meting op nul te zetten, en houd het een seconde vast om opnieuw te kalibreren.',
    note: 'Een kalibratie die niet precies 10 cm is, zet elke meting met dezelfde verhouding scheef, hier net zo goed als op de echte liniaal.',
  },
  sim: {
    reading: 'Meting: {cm} centimeter.',
    readingLive: 'Meting: {cm} centimeter, aan het tellen.',
    calibrating: 'Kalibreren: tot nu toe {n} stappen. Rol precies 10 centimeter met het wieltje ingedrukt en laat dan los.',
    confirming: '{n} stappen voor 10 centimeter. Tik op het scherm om op te slaan.',
    button: 'Het scherm van de AtomS3R, dat ook de knop is: tik om op nul te zetten of op te slaan, houd vast om opnieuw te kalibreren',
    puck: 'De Unit Scroll op {cm} cm op de liniaal. Houd een pijltjestoets ingedrukt om hem met ingedrukt wieltje te rollen.',
    reset: 'Opnieuw',
  },
  use: {
    h: 'Het gebruik',
    p: 'Het hele scherm van de AtomS3R is zijn knop, dus de liniaal heeft maar twee bedieningen: het scrollwieltje, dat je indrukt terwijl je rolt, en het scherm, waar je op tikt of dat je vasthoudt.',
  },
  measure: {
    h: 'Meten',
    screen: 'Het liniaalscherm tijdens het tellen: RULER met een groen LIVE-label, 4.1 cm in het groen, en 41 mm bij 2.0 mm per stap',
    p1: 'Je drukt het wieltje in en rolt het vooruit, en de afstand telt alleen zolang het wieltje ingedrukt blijft. Dan brandt de led van de Unit Scroll groen en wordt de meting ook groen. Laat je het wieltje los, dan stopt het tellen, en als je achteruit rolt terwijl het ingedrukt is, gaat er weer afstand af.',
    p2: 'Tik op het scherm om de meting weer op nul te zetten, en houd het ongeveer een seconde vast om opnieuw te kalibreren.',
  },
  calibrate: {
    h: 'Kalibreren',
    rolling: 'Kalibreren: tot nu toe 49 stappen geteld, met de instructie om het wieltje in te drukken en precies 10 cm te rollen',
    rollingCaption: 'De 10 cm rollen',
    checking: 'Controleren: 49 stappen zijn 10 cm, tik om op te slaan',
    checkingCaption: 'Losgelaten, klaar om op te slaan',
    p1: 'De eerste keer dat hij opstart, en wanneer je er maar om vraagt, meet de liniaal 10 cm om te leren hoe ver het wieltje per stap gaat. Je drukt het wieltje in en rolt het precies 10 cm langs een echte liniaal, laat het dan los en tikt op het scherm om het aantal getelde stappen op te slaan.',
    p2: 'Druk je het wieltje opnieuw in, dan telt het verder bij dezelfde rol, en als je het scherm vasthoudt begin je opnieuw. De kalibratie blijft in het flashgeheugen staan, dus hij overleeft het als de stroom uitvalt, en de richting waarin je rolde wordt vooruit.',
  },
  steps: {
    h: 'Hoe fijn hij meet',
    p: 'Het wieltje heeft maar een bepaald aantal stappen per omwenteling, dus de liniaal meet in stappen en niet vloeiend. De mijne telde 49 stappen voor 10 cm, dus elke stap is zo’n 2 mm, en het scherm laat onder elke meting de precieze staplengte zien, zodat je weet hoeveel je het laatste cijfer kunt vertrouwen.',
  },
  how: {
    h: 'Hoe het werkt',
    p1: 'De Unit Scroll heeft een eigen chipje dat de stappen van het wieltje telt en de knop leest, en de AtomS3R vraagt allebei honderd keer per seconde op via I2C, over de Grove-poort. Elke uitlezing geeft de stappen sinds de vorige, en die tellen alleen mee voor de afstand zolang het wieltje is ingedrukt.',
    p2: 'De logica van de liniaal, dus de kalibratie en het rekenwerk voor de afstand, zette ik in één bestand zonder hardwarecode, zodat elf unittests het op een computer controleren voordat het op het apparaat gaat. Als de Unit Scroll losraakt, zegt het scherm dat, en zodra hij weer is aangesloten pakt hij hem meteen weer op.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'AtomS3R', s: 'draait de liniaal op zijn ESP32-S3, en het scherm van 0,85 inch is ook de knop.' },
      { b: 'Atomic Battery Base', s: 'houdt de batterij, dus de liniaal heeft geen kabel nodig.' },
      { b: 'Unit Scroll', s: 'is het wieltje dat je rolt, met een drukknop en een RGB-led, en het gaat in de Grove-poort van de AtomS3R.' },
    ],
    photoAlt: 'De liniaal omhoog gehouden na de tweede meting, met 8.2 cm op het scherm, boven de liniaal waarlangs hij rolde',
    photoCaption: 'Na de tweede meting in de demo',
  },
  setup: {
    h: 'Zelf instellen',
    steps: [
      <>Zet de AtomS3R op de Atomic Battery Base en sluit de Unit Scroll aan op de Grove-poort van de AtomS3R.</>,
      <>Open <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome of Edge, kies <b>Scroll Wheel Ruler</b>, sluit de AtomS3R aan via USB-C en druk op <b>Install</b>, en de firmware wordt meteen vanuit de browser geflasht.</>,
      <>Hij begint op het kalibratiescherm, dus druk het wieltje in en rol het precies 10 cm langs een liniaal, laat het dan los en tik op het scherm om op te slaan.</>,
    ],
    repo: <>De <a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">GitHub-repository</a> heeft de code van de firmware, de unittests en een download van de firmware-image, als je liever met esptool flasht.</>,
    note: <>De AtomS3R op deze pagina is gerenderd van het eigen model van M5Stack in <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT-licentie, copyright M5Stack), en de schermen zijn getekend naar de eigen lay-out van de firmware.</>,
  },
};

export default nl;
