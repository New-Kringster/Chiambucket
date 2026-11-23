import type { ScrollRulerCopy } from './en';

/* The Scroll Ruler article's German words, in the shape of en.tsx.
   The AtomS3R's screens keep the firmware's own English (RULER, CALIBRATE, tap: zero...). */
const de: ScrollRulerCopy = {
  meta: {
    title: 'Scroll-Lineal | Braven Chiam',
    description: 'Ein digitales Lineal aus einem M5Stack AtomS3R und einer Unit Scroll, gebaut während meines Praktikums bei M5Stack. Du drückst das Scrollrad nach unten und rollst es an dem entlang, was du messen willst, und nach einer einmaligen Kalibrierung über 10 cm zeigt der Bildschirm die Strecke in Zentimetern.',
    ogDescription: 'Roll die Unit Scroll an etwas entlang, und der AtomS3R zeigt, wie lang es ist.',
  },
  ld: {
    headline: 'Scroll-Lineal',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'Drehgeber', 'digitales Lineal'],
  },
  hero: {
    alt: 'Das Scroll-Lineal: ein AtomS3R auf seiner Atomic Battery Base, darunter die angesteckte Unit Scroll, der Bildschirm zeigt 0,0 cm',
    back: 'Zu den Projekten',
    tag: 'Praktikumsprojekt',
    title: <>Scroll-<em>Lineal</em></>,
    lead: 'Dieses digitale Lineal habe ich während meines Praktikums bei M5Stack aus einem AtomS3R und einer Unit Scroll gebaut. Du drückst das Scrollrad nach unten und rollst es an dem entlang, was du messen willst, und der Bildschirm zeigt die Strecke in Zentimetern.',
    builtWith: 'Gebaut mit',
    links: ['GitHub', 'Firmware flashen'],
    meta: 'Praktikumsprojekt bei M5Stack, November 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.',
  },
  chapters: 'Kapitel',
  rail: {
    demo: 'Demo', try: 'Ausprobieren', use: 'Bedienung', measure: 'Messen', calibrate: 'Kalibrieren',
    steps: 'Wie fein es misst', how: 'Funktionsweise', hardware: 'Hardware', setup: 'Nachbauen',
  },
  demo: {
    h: 'Demo',
    p: 'Das hier habe ich an meinem Schreibtisch gefilmt. Erst kalibriere ich es über 10 cm eines Lineals, dann messe ich drei Längen am selben Lineal.',
    video: 'Das Scroll-Lineal wird über 10 cm eines Lineals kalibriert und misst dann 4,1, 8,2 und 7,3 cm',
    moments: [
      { label: 'Kalibrieren über 10 cm', note: 'Es hat 49 Schritte des Rads gezählt, etwa 2 mm pro Schritt' },
      { label: 'Die erste Runde', note: 'Am Lineal entlanggerollt, zeigt es 4,1 cm' },
      { label: 'Die zweite Runde', note: 'Eine längere Strecke zeigt 8,2 cm' },
      { label: 'Die dritte Runde', note: 'Die letzte Strecke zeigt 7,3 cm' },
    ],
  },
  try: {
    h: 'Ausprobieren',
    p: 'Diese Kopie des Lineals läuft mit derselben Logik wie die Firmware und startet auf ihrem Kalibrierbildschirm. Zieh die Unit Scroll am Lineal entlang, um sie mit gedrücktem Rad zu rollen, das zählt. Oder klick auf das Lineal, um sie anzuheben und woanders aufzusetzen, das zählt nicht. Ein Tipp auf den Bildschirm speichert eine Kalibrierung oder setzt den Wert auf null, und hältst du ihn eine Sekunde lang, startet eine neue Kalibrierung.',
    note: 'Eine Kalibrierung, die nicht genau 10 cm lang ist, verfälscht jeden Wert um denselben Anteil, hier genauso wie beim echten Lineal.',
  },
  sim: {
    reading: 'Anzeige: {cm} Zentimeter.',
    readingLive: 'Anzeige: {cm} Zentimeter, zählt.',
    calibrating: 'Kalibrieren: bisher {n} Schritte. Roll genau 10 Zentimeter mit gedrücktem Rad und lass dann los.',
    confirming: '{n} Schritte für 10 Zentimeter. Tipp auf den Bildschirm, um zu speichern.',
    button: 'Der Bildschirm des AtomS3R, der auch seine Taste ist: Antippen setzt auf null oder speichert, Halten kalibriert neu',
    puck: 'Die Unit Scroll bei {cm} cm auf dem Lineal. Halt eine Pfeiltaste gedrückt, um sie mit gedrücktem Rad zu rollen.',
    reset: 'Neu starten',
  },
  use: {
    h: 'Bedienung',
    p: 'Der ganze Bildschirm des AtomS3R ist seine Taste, also hat das Lineal nur zwei Bedienelemente: das Scrollrad, das du beim Rollen nach unten drückst, und den Bildschirm, den du antippst oder gedrückt hältst.',
  },
  measure: {
    h: 'Messen',
    screen: 'Der Linealbildschirm beim Zählen: RULER mit einem grünen LIVE-Tag, 4,1 cm in Grün und 41 mm bei 2,0 mm pro Schritt',
    p1: 'Du drückst das Rad nach unten und rollst es nach vorn, und die Strecke zählt nur, solange das Rad gedrückt bleibt. Dabei leuchtet die LED der Unit Scroll grün, und der Wert wird auch grün. Lässt du das Rad los, stoppt die Zählung, und rollst du mit gedrücktem Rad rückwärts, geht wieder Strecke ab.',
    p2: 'Ein Tipp auf den Bildschirm setzt den Wert auf null, und hältst du ihn etwa eine Sekunde lang, startet eine neue Kalibrierung.',
  },
  calibrate: {
    h: 'Kalibrieren',
    rolling: 'Kalibrieren: bisher 49 Schritte gezählt, mit der Anweisung, das Rad zu drücken und genau 10 cm zu rollen',
    rollingCaption: 'Die 10 cm rollen',
    checking: 'Prüfen: 49 Schritte entsprechen 10 cm, zum Speichern antippen',
    checkingCaption: 'Losgelassen, bereit zum Speichern',
    p1: 'Beim ersten Start und immer dann, wenn du es willst, misst das Lineal 10 cm, um zu lernen, wie weit sich das Rad pro Schritt bewegt. Du drückst das Rad und rollst es genau 10 cm an einem echten Lineal entlang, dann lässt du los und tippst auf den Bildschirm, um die gezählten Schritte zu speichern.',
    p2: 'Drückst du das Rad nochmal, kommt mehr zur selben Strecke dazu, und hältst du den Bildschirm gedrückt, fängt sie von vorn an. Die Kalibrierung bleibt im Flash, übersteht also einen Stromausfall, und die Richtung, in die du gerollt hast, gilt ab dann als vorwärts.',
  },
  steps: {
    h: 'Wie fein es misst',
    p: 'Das Rad hat nur eine bestimmte Zahl von Schritten pro Umdrehung, also misst das Lineal in Schritten statt stufenlos. Meins hat 49 Schritte für 10 cm gezählt, also ist jeder Schritt etwa 2 mm lang, und der Bildschirm zeigt unter jedem Wert die genaue Schrittlänge, damit du weißt, wie sehr du der letzten Ziffer trauen kannst.',
  },
  how: {
    h: 'Funktionsweise',
    p1: 'Die Unit Scroll hat einen eigenen kleinen Chip, der die Schritte des Rads zählt und seine Taste ausliest, und der AtomS3R fragt beides hundertmal pro Sekunde per I2C über den Grove-Anschluss ab. Jede Abfrage liefert die Schritte seit der letzten, und die zählen nur zur Strecke, solange das Rad gedrückt ist.',
    p2: 'Die Logik des Lineals, also die Kalibrierung und die Rechnung für die Strecke, habe ich in einer Datei ohne Hardware-Code gehalten, sodass elf Unit-Tests sie auf einem Computer prüfen, bevor sie aufs Gerät kommt. Wird die Unit Scroll abgesteckt, sagt der Bildschirm das, und sobald sie wieder dran ist, erkennt er sie wieder.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'AtomS3R', s: 'betreibt das Lineal auf seinem ESP32-S3, und sein 0,85-Zoll-Bildschirm ist gleichzeitig seine Taste.' },
      { b: 'Atomic Battery Base', s: 'hält den Akku, also braucht das Lineal kein Kabel.' },
      { b: 'Unit Scroll', s: 'ist das Rad, das du rollst, mit einer Drucktaste und einer RGB-LED, und sie wird in den Grove-Anschluss des AtomS3R gesteckt.' },
    ],
    photoAlt: 'Das Lineal nach der zweiten Runde hochgehalten, sein Bildschirm zeigt 8,2 cm, darunter das Lineal, an dem es entlanggerollt ist',
    photoCaption: 'Nach der zweiten Runde in der Demo',
  },
  setup: {
    h: 'Nachbauen',
    steps: [
      <>Steck den AtomS3R auf die Atomic Battery Base und die Unit Scroll in den Grove-Anschluss des AtomS3R.</>,
      <>Öffne <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome oder Edge, wähl <b>Scroll Wheel Ruler</b>, schließ den AtomS3R per USB-C an und drück <b>Install</b>. Das flasht die Firmware direkt aus dem Browser.</>,
      <>Es startet auf dem Kalibrierbildschirm. Drück also das Rad, roll es genau 10 cm an einem Lineal entlang, lass dann los und tipp zum Speichern auf den Bildschirm.</>,
    ],
    repo: <>Im <a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">GitHub-Repository</a> findest du den Code der Firmware, ihre Unit-Tests und das Firmware-Image zum Download, falls du lieber mit esptool flashen willst.</>,
    note: <>Der AtomS3R auf dieser Seite ist aus dem eigenen Modell von M5Stack in <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> gerendert (MIT-Lizenz, Copyright M5Stack), und seine Bildschirme sind nach dem Layout der Firmware gezeichnet.</>,
  },
};
export default de;
