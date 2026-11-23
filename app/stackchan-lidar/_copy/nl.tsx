import type { LidarCopy } from './en';

const nl: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Een LiDAR gemaakt van Stack-chan van M5Stack, die met zijn servo’s vier Unit ToF4M-afstandssensoren door een kamer zwaait, de punten inkleurt met zijn camera en de scan in 3D laat zien in elke browser.',
    ogDescription: 'Stack-chan zwaait vier afstandssensoren door een kamer en maakt van de metingen een gekleurde 3D-scan die je zelf kunt verkennen.',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'puntenwolk', '3D-scannen', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: 'De zwaai', colour: 'Kleur', demo: 'Demo', play: 'Probeer de scan', setup: 'Zelf maken' },
  chaptersLabel: 'Hoofdstukken',
  hero: {
    alt: 'Stack-chan getekend naar de modellen van M5Stack, met vier Unit ToF4M-sensoren in een vierkant boven op zijn hoofd',
    back: 'Terug naar projecten',
    tag: 'Stageproject',
    featured: 'Uitgelicht',
    title: 'Stack-chan LiDAR',
    lead: 'Ik heb van Stack-chan een LiDAR gemaakt door vier afstandssensoren op zijn hoofd te zetten en ze met zijn servo’s door een kamer te laten zwaaien. Zijn camera kleurt de punten in, en elke browser op dezelfde wifi laat de scan in 3D zien terwijl hij ontstaat.',
    builtWith: 'Gemaakt met',
    flash: 'Flash de firmware',
    meta: 'Stageproject bij M5Stack, november 2026. Stack-chan (CoreS3), PaHub, vier Unit ToF4M, C++ en WebGL.',
    cue: 'Scroll om een scan te draaien',
  },
  sweep: {
    alt: 'Over de schouder van Stack-chan, met zijn sensorkegel tot aan de muur terwijl de scan de kamer om hem heen invult',
    caps: [
      { title: 'De kamer afzwaaien', p: 'Stack-chan draait zijn hoofd een paar graden per keer door de kamer en stopt bij elke stap om te meten hoe ver de muur weg is. De servo’s geven de richting en de sensoren de afstand, dus elke stap levert een punt in 3D op. Dit is de echte scan uit de demo, die zich vult terwijl het hoofd rondkijkt.' },
      { title: 'Quick, Normal of Fine', p: 'Voor een scan kies ik Quick, Normal of Fine. Quick is in minder dan een minuut klaar, en Fine duurt langer maar pikt veel meer detail op.' },
    ],
  },
  colour: {
    alt: 'De afgeronde scan van buiten de kamer, in de kleuren van de camera',
    caps: [
      { title: 'Kleur uit zijn camera', p: 'Voordat hij gaat zwaaien, maakt Stack-chan foto’s van het gebied met de camera van de CoreS3. De browser zet daarna elke pixel van die foto’s op de afstand die de sensoren in die richting hebben gemeten, en zo wordt een raster van metingen 68.206 gekleurde punten.' },
      { title: 'De foto’s uitlijnen', p: 'De camera zit onder de sensoren, dus de foto’s en de afstanden worden vanaf net iets andere plekken gemaakt. Ik heb ze uitgelijnd door de randen in de diepte te laten passen op de randen in de foto’s, en nu vallen de kleuren op het grootste deel van de kamer op de goede plek, al lukt dat niet overal.' },
    ],
  },
  demo: {
    h: 'Demo',
    p: 'Ik zette Stack-chan op een tafel in de hoek van een lege kamer en startte een scan vanaf mijn laptop. De video laat het hoofd zien dat zwaait terwijl de punten zich opbouwen in de browser, en daarna de afgeronde scan van alle kanten, eerst gekleurd op afstand en dan met de camera.',
    video: 'Stack-chan zwaait door de hoek van een kamer terwijl de puntenwolk in de browser groeit, daarna de afgeronde scan in diepte- en fotokleuren',
    moments: [
      { label: 'De zwaai', note: 'Het hoofd werkt de hoek af terwijl de punten zich vullen' },
      { label: 'De afgeronde scan', note: 'De muren en het plafond van de hoek, van buitenaf gezien' },
      { label: 'Diepte', note: 'Elk punt gekleurd naar hoe ver het weg is' },
      { label: 'Fotokleur', note: 'Dezelfde punten gekleurd met de foto’s van Stack-chan' },
    ],
  },
  play: {
    h: 'Probeer de scan',
    stillAlt: 'De afgeronde scan van bovenaf: de muren en het plafond van een kamerhoek, met een blauwe doos op de tafel',
  },
  pg: {
    view: 'Een 3D-puntenwolk van de kamer die Stack-chan heeft gescand. Sleep om hem te draaien, scroll of knijp om te zoomen, sleep met rechts om hem te verplaatsen en dubbelklik op een plek om ernaartoe te vliegen.',
    loading: 'Scan laden',
    hintTouch: 'Sleep om te draaien en knijp om te zoomen',
    hintMouse: 'Sleep om te draaien, scroll om te zoomen en sleep met rechts om te verplaatsen',
    drop: 'Sleep een .ply-bestand hierheen om het te openen',
    stat: '{n} punten, {size} m',
    colourBy: 'Kleur de punten op',
    modes: ['Foto', 'Diepte', 'Hoogte'],
    eyeTitle: 'Bekijk het vanaf het hoofd van Stack-chan',
    eye: 'Bekijk het vanaf het hoofd van Stack-chan',
    reset: 'Terug naar de beginweergave',
    full: 'Volledig scherm',
    leaveFull: 'Volledig scherm sluiten',
    open: 'Open je eigen .ply',
    upY: 'Y is boven in dit bestand',
    back: 'Terug naar de scan van Stack-chan',
    download: 'Download deze scan',
    errors: {
      notPly: 'Dit bestand lijkt geen .ply-puntenwolk te zijn.',
      lists: 'Lijsten in de vertexdata worden niet ondersteund, exporteer alleen de punten.',
      noXyz: 'Geen x, y en z gevonden in deze .ply.',
      short: 'Deze .ply houdt op voordat al zijn punten erin staan.',
      unreadable: 'Dat bestand kon niet worden gelezen.',
    },
  },
  setup: {
    h: 'Zelf maken',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, het robotje van M5Stack, met een CoreS3 als hoofd op twee servo&rsquo;s. Zijn ESP32-S3 draait de scan, de webserver en de camera.</>,
      <>Vier <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, VL53L1X-time-of-flight-afstandssensoren, in een vierkant boven op het hoofd gemonteerd.</>,
      <>Een <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, zodat de vier sensoren één Grove-poort kunnen delen, ook al hebben ze allemaal hetzelfde I2C-adres.</>,
    ],
    photoAlt: 'De echte Stack-chan met de vier sensoren op zijn hoofd en hun Grove-kabels die in een lus naar de achterkant lopen',
    photoCaption: 'De echte Stack-chan met zijn sensoren',
    steps: [
      <>Steek een PaHub in Port A van Stack-chan en de vier Unit ToF4M in kanaal 0 tot en met 3, en monteer de sensoren dan boven op het hoofd, naar voren gericht.</>,
      <>Open <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome of Edge, kies <b>Stack-chan LiDAR</b>, sluit Stack-chan aan via USB-C en druk op Install.</>,
      <>Maak verbinding met het wifinetwerk <b>StackChan-LiDAR</b> dat hij start en open <b>http://192.168.4.1/</b>, dat Stack-chan ook laat zien als je op zijn gezicht tikt. Kies dan een gebied en een detailniveau en start een scan.</>,
    ],
    note: 'De Stack-chan op deze pagina is gebouwd uit de eigen 3D-modellen van M5Stack (M5_Hardware, MIT-licentie).',
  },
};

export default nl;
