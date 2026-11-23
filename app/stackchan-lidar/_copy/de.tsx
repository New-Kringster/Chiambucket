import type { LidarCopy } from './en';

/* The Stack-chan LiDAR article's German words, in the shape of en.tsx. */
const de: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Ein LiDAR aus Stack-chan von M5Stack, der mit seinen Servos vier Abstandssensoren vom Typ Unit ToF4M durch einen Raum schwenkt, die Punkte mit seiner Kamera einfärbt und den Scan in jedem Browser in 3D zeigt.',
    ogDescription: 'Stack-chan schwenkt vier Abstandssensoren durch einen Raum und macht aus den Messwerten einen farbigen 3D-Scan, den du erkunden kannst.',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'Punktwolke', '3D-Scan', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: 'Der Schwenk', colour: 'Farbe', demo: 'Demo', play: 'Ausprobieren', setup: 'Nachbauen' },
  chaptersLabel: 'Kapitel',
  hero: {
    alt: 'Stack-chan, gezeichnet nach den Modellen von M5Stack, mit vier Unit-ToF4M-Sensoren im Quadrat auf dem Kopf',
    back: 'Zu den Projekten',
    tag: 'Praktikumsprojekt',
    featured: 'Im Fokus',
    title: 'Stack-chan LiDAR',
    lead: 'Ich habe Stack-chan in ein LiDAR verwandelt, indem ich ihm vier Abstandssensoren auf den Kopf gesetzt habe und seine Servos sie durch den Raum schwenken lasse. Seine Kamera färbt die Punkte ein, und jeder Browser im selben WLAN zeigt den Scan in 3D, während er entsteht.',
    builtWith: 'Gebaut mit',
    flash: 'Firmware flashen',
    meta: 'Praktikumsprojekt bei M5Stack, November 2026. Stack-chan (CoreS3), PaHub, vier Unit ToF4M, C++ und WebGL.',
    cue: 'Scrollen und scannen',
  },
  sweep: {
    alt: 'Über Stack-chans Schulter: Sein Sensorkegel reicht bis zur Wand, während sich der Scan rundherum füllt',
    caps: [
      { title: 'Den Raum abtasten', p: 'Stack-chan dreht seinen Kopf in Schritten von ein paar Grad durch den Raum und hält bei jedem Schritt an, um zu messen, wie weit die Wand entfernt ist. Die Servos liefern die Richtung und die Sensoren den Abstand, also kommt mit jedem Schritt ein Punkt in 3D dazu. Das hier ist der echte Scan aus der Demo, der sich füllt, während der Kopf schwenkt.' },
      { title: 'Quick, Normal oder Fine', p: 'Vor einem Scan wähle ich Quick, Normal oder Fine. Quick ist in unter einer Minute fertig, und Fine dauert länger, erfasst aber viel mehr Details.' },
    ],
  },
  colour: {
    alt: 'Der fertige Scan von außerhalb des Raums in den Farben der Kamera',
    caps: [
      { title: 'Farbe aus der Kamera', p: 'Vor dem Schwenk macht Stack-chan mit der Kamera des CoreS3 Fotos von der Umgebung. Der Browser setzt dann jedes Pixel dieser Fotos in den Abstand, den die Sensoren in dieser Richtung gemessen haben, und so werden aus einem Raster von Messwerten 68.206 farbige Punkte.' },
      { title: 'Die Fotos ausrichten', p: 'Die Kamera sitzt unter den Sensoren, also werden Fotos und Abstände von leicht unterschiedlichen Stellen aus aufgenommen. Ich habe sie ausgerichtet, indem ich die Kanten in der Tiefe mit den Kanten in den Fotos abgeglichen habe, und jetzt landen die Farben in den meisten Teilen des Raums an der richtigen Stelle, wenn auch nicht überall.' },
    ],
  },
  demo: {
    h: 'Demo',
    p: 'Ich habe Stack-chan in der Ecke eines leeren Raums auf einen Tisch gestellt und von meinem Laptop aus einen Scan gestartet. Das Video zeigt den Kopf beim Schwenken, während sich im Browser die Punkte aufbauen, und dann den fertigen Scan von allen Seiten, erst nach Abstand eingefärbt und dann in den Farben der Kamera.',
    video: 'Stack-chan schwenkt durch eine Zimmerecke, während die Punktwolke im Browser wächst, danach der fertige Scan in Tiefen- und Fotofarben',
    moments: [
      { label: 'Der Schwenk', note: 'Der Kopf arbeitet sich durch die Ecke, während sich die Punkte füllen' },
      { label: 'Der fertige Scan', note: 'Wände und Decke der Ecke, von außen gesehen' },
      { label: 'Tiefe', note: 'Jeder Punkt eingefärbt nach seinem Abstand' },
      { label: 'Fotofarbe', note: 'Dieselben Punkte in den Farben von Stack-chans Fotos' },
    ],
  },
  play: {
    h: 'Ausprobieren',
    stillAlt: 'Der fertige Scan von oben: Wände und Decke einer Zimmerecke, mit einer blauen Kiste auf dem Tisch',
  },
  pg: {
    view: 'Eine 3D-Punktwolke des Raums, den Stack-chan gescannt hat. Zieh, um sie zu drehen, scroll oder zieh zwei Finger zusammen, um zu zoomen, zieh mit der rechten Maustaste, um sie zu verschieben, und doppelklick auf eine Stelle, um hinzufliegen.',
    loading: 'Scan wird geladen',
    hintTouch: 'Ziehen dreht, zwei Finger zoomen',
    hintMouse: 'Ziehen dreht, Scrollen zoomt, Rechtsziehen verschiebt',
    drop: 'Zum Öffnen .ply hier ablegen',
    stat: '{n} Punkte, {size} m',
    colourBy: 'Punkte färben nach',
    modes: ['Foto', 'Tiefe', 'Höhe'],
    eyeTitle: 'Aus Stack-chans Kopf sehen',
    eye: 'Aus Stack-chans Kopf sehen',
    reset: 'Zurück zur Startansicht',
    full: 'Vollbild',
    leaveFull: 'Vollbild beenden',
    open: 'Eigene .ply öffnen',
    upY: 'Y zeigt nach oben',
    back: 'Zurück zu Stack-chans Scan',
    download: 'Scan herunterladen',
    errors: {
      notPly: 'Diese Datei sieht nicht nach einer .ply-Punktwolke aus.',
      lists: 'Listen in den Vertex-Daten werden nicht unterstützt. Exportiere nur die Punkte.',
      noXyz: 'In dieser .ply gibt es kein x, y und z.',
      short: 'Diese .ply endet, bevor alle ihre Punkte kommen.',
      unreadable: 'Die Datei konnte nicht gelesen werden.',
    },
  },
  setup: {
    h: 'Nachbauen',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, der kleine Roboter von M5Stack, dessen Kopf ein CoreS3 auf zwei Servos ist. Sein ESP32-S3 übernimmt den Scan, den Webserver und die Kamera.</>,
      <>Vier <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, also VL53L1X-Time-of-Flight-Abstandssensoren, im Quadrat oben auf den Kopf montiert.</>,
      <>Ein <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, über den sich die vier Sensoren einen Grove-Port teilen können, obwohl alle dieselbe I2C-Adresse haben.</>,
    ],
    photoAlt: 'Der echte Stack-chan mit den vier Sensoren auf dem Kopf, deren Grove-Kabel in Schlaufen nach hinten laufen',
    photoCaption: 'Der echte Stack-chan mit seinen Sensoren',
    steps: [
      <>Steck einen PaHub in Port A von Stack-chan und die vier Unit ToF4M in seine Kanäle 0 bis 3, dann montier die Sensoren nach vorne gerichtet oben auf den Kopf.</>,
      <>Öffne <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome oder Edge, wähle <b>Stack-chan LiDAR</b>, schließ Stack-chan über USB-C an und drück auf Install.</>,
      <>Verbinde dich mit dem WLAN <b>StackChan-LiDAR</b>, das er aufmacht, und öffne <b>http://192.168.4.1/</b>, was Stack-chan auch anzeigt, wenn du auf sein Gesicht tippst. Dann wählst du einen Bereich und eine Detailstufe und startest einen Scan.</>,
    ],
    note: 'Der Stack-chan auf dieser Seite ist aus M5Stacks eigenen 3D-Modellen gebaut (M5_Hardware, MIT-Lizenz).',
  },
};

export default de;
