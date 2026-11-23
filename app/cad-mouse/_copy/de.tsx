import type { CadMouseCopy } from './en';

/* The 3D CAD Mouse article's German words, in the shape of en.tsx. */
const de: CadMouseCopy = {
  meta: {
    title: '3D-CAD-Maus | Braven Chiam',
    description: 'Eine kabellose 3D-Maus für Onshape, gebaut aus einer M5Stack Capsule. Du klickst ihre Taste und drehst sie in der Hand, und das Modell auf dem Bildschirm dreht sich mit, weil sich die Capsule per Bluetooth als SpaceMouse von 3Dconnexion ausgibt.',
    ogDescription: 'Dreh eine M5Stack Capsule in der Hand, und das Modell in Onshape dreht sich mit.',
  },
  ld: {
    headline: '3D-CAD-Maus',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', '3D-Maus', 'Onshape'],
  },
  hero: {
    alt: 'Die M5Stack Capsule v1.1 steht aufrecht, mit dem bunten Pin-Aufkleber nach vorn und dem USB-C-Anschluss unten',
    back: 'Zu den Projekten',
    tag: 'Praktikumsprojekt',
    title: <>3D-CAD-<em>Maus</em></>,
    lead: 'Ich habe eine M5Stack Capsule in eine kabellose 3D-Maus für Onshape verwandelt. Du klickst ihre Taste und drehst sie in der Hand, und das Modell auf dem Bildschirm dreht sich mit, als hieltest du das Teil selbst in der Hand.',
    builtWith: 'Gebaut mit',
    burnerTitle: 'Die Firmware ist noch nicht auf M5Burner',
    burner: 'Mit M5Burner flashen',
    burnerSoon: 'Kommt bald',
    meta: 'Praktikumsprojekt bei M5Stack, November 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.',
  },
  chapters: 'Kapitel',
  rail: {
    demo: 'Demo', try: 'Ausprobieren', use: 'Bedienung', how: 'Funktionsweise',
    spacemouse: 'Getarnt als SpaceMouse', turning: 'Deiner Hand folgen', stopping: 'Sauber anhalten',
    hardware: 'Hardware', setup: 'Nachbauen',
  },
  demo: {
    h: 'Demo',
    p: 'Das hier habe ich an meinem Schreibtisch gefilmt, mit einem meiner Gehäuse offen in Onshape. Ist Drehen an, dreht und kippt sich das Teil, während ich die Capsule drehe, und mit gedrückter Taste kann ich das Teil über den Bildschirm schieben und an seine Tasten heranzoomen.',
    video: 'Ein oranges Gehäuse in Onshape drehen, indem ich die Capsule in der Hand drehe, dann verschieben und an seine Tasten heranzoomen',
    moments: [
      { label: 'Das Teil drehen', note: 'Drehen ist an, also dreht und kippt sich das Teil mit meiner Hand' },
      { label: 'Umdrehen', note: 'Kippe ich die Capsule ganz um, sieht man die Unterseite' },
      { label: 'Verschieben', note: 'Mit gedrückter Taste schiebe ich das Teil zur Seite und zurück' },
      { label: 'Heranzoomen', note: 'Verdrehen bei gedrückter Taste zoomt an die Tasten heran und wieder heraus' },
    ],
  },
  try: {
    h: 'Ausprobieren',
    p: 'Diese Kopie führt die Tastenlogik der Capsule aus, und dein Mauszeiger übernimmt die Rolle deiner Hand. Die Oberseite der Capsule ist ihre Taste. Klick sie also an, um Drehen einzuschalten, und beweg den Zeiger über die Ansicht, um das Teil zu drehen. Halt sie gedrückt, um zu verschieben, und doppelklick sie, um das Teil wieder ganz ins Bild zu holen.',
    note: 'Die echte Capsule misst, wie schnell sich deine Hand dreht, sodass sich das Teil um denselben Winkel dreht wie deine Hand. Hier steht die Bewegung des Zeigers dafür.',
  },
  sim: {
    led: {
      ready: 'Grün blinkend: verbunden, Drehen aus',
      rotate: 'Cyan: Drehen an',
      pan: 'Gelb: Verschieben',
      fit: 'Weißer Blitz: Einpassen',
    },
    status: {
      demo: 'Eine Demo mit eingeschaltetem Drehen läuft. Tipp die Taste der Capsule an, um selbst zu steuern.',
      pan: 'Verschieben, solange du gedrückt hältst. Beweg den Zeiger, um das Teil zu schieben, und scroll zum Zoomen, das ist bei der echten das Verdrehen.',
      rotate: 'Drehen ist an. Beweg den Zeiger über die Ansicht, und das Teil dreht sich mit. Klick nochmal, um aufzuhören.',
      off: 'Drehen ist aus. Klick die Taste zum Starten, halt sie zum Verschieben oder doppelklick zum Einpassen.',
    },
    viewport: 'Ein oranges Handgehäuse in einer CAD-Ansicht, gedreht von der Capsule',
    button: 'Die Taste der Capsule: Klicken schaltet Drehen um, Halten verschiebt, Doppelklick passt ein',
    reset: 'Neu starten',
  },
  use: {
    h: 'Bedienung',
    p1: 'Du hältst die Capsule aufrecht, mit dem Aufkleber zu dir und dem USB-Anschluss unten, und ihre eine Taste erledigt alles.',
    parts: [
      { b: 'Klicken zum Drehen', s: 'Ein Klick schaltet Drehen ein, und das Licht wird cyan. Ab dann folgt das Modell deiner Hand, bis du nochmal klickst. Das Drehen startet 0,3 Sekunden nach dem Klick, so lange wartet sie, um einen Doppelklick auszuschließen.' },
      { b: 'Halten zum Verschieben und Zoomen', s: 'Hältst du die Taste gedrückt, pausiert das Drehen, und stattdessen wird verschoben, mit gelbem Licht. Zeigst du mit der Capsule nach links, rechts, oben oder unten, rutscht das Modell in diese Richtung, und Verdrehen zoomt. Lässt du los, geht das Drehen weiter.' },
      { b: 'Doppelklick zum Einpassen', s: 'Ein Doppelklick holt das ganze Modell auf den Bildschirm, und Drehen bleibt, wie es war.' },
    ],
    p2: 'Das Licht pulsiert blau, während sie auf einen Computer wartet, und blinkt alle paar Sekunden grün, sobald sie verbunden ist. Ein hoher Ton heißt, Drehen ist an, ein tieferer, es ist aus, und nach längerer Zeit ohne Benutzung schaltet sich die Capsule selbst ab.',
  },
  how: {
    h: 'Funktionsweise',
    p: 'Die Capsule hat ein Gyroskop und einen Beschleunigungssensor in ihrer IMU, eine Taste und Bluetooth, also alles, was eine 3D-Maus braucht. Schwierig war nur, Onshape dazu zu bringen, auf sie zu hören.',
  },
  spacemouse: {
    h: 'Getarnt als SpaceMouse',
    p: 'Onshape nimmt Eingaben einer 3D-Maus nur über den Treiber von 3Dconnexion an, der Firma, die die SpaceMouse herstellt. Also stellt sich die Capsule per Bluetooth als deren SpaceMouse Wireless vor, mit den IDs dieses Modells und demselben Aufbau für ihre Reports, und den Rest erledigt der Treiber. In Onshape muss nichts installiert werden. Die Bluetooth-Seite habe ich auf dem Code einer Air Mouse aufgebaut, die ich vorher gemacht hatte und die schon mit Windows und macOS lief.',
  },
  turning: {
    h: 'Deiner Hand folgen',
    p1: 'Eine echte SpaceMouse meldet, wie weit du ihre Kappe drückst, und der Treiber macht daraus eine Geschwindigkeit. Die Capsule schickt stattdessen von ihrem Gyroskop, wie schnell sich deine Hand dreht, sodass der Treiber das Modell um denselben Winkel dreht wie deine Hand. Es fühlt sich an, als hieltest du das Teil, statt es zu lenken.',
    p2: 'Der Beschleunigungssensor findet nur heraus, wo unten ist. So bleiben die Achsen gerade, egal wie du die Capsule hältst, und eine Drehung um die Senkrechte dreht das Modell immer um die Senkrechte des Bildschirms. Zum Bewegen des Modells habe ich ihn nicht benutzt, weil eine Position, die aus einem Beschleunigungssensor berechnet wird, innerhalb einer Sekunde wegdriftet. Deshalb kommt das Verschieben stattdessen vom Zeigen mit der Capsule.',
  },
  stopping: {
    h: 'Sauber anhalten',
    p1: 'Ein Druck auf die Taste friert die Ausgabe sofort ein, sodass das Zucken deines Daumens und das Abbremsen deiner Hand nie beim Modell ankommen. Solange sich deine Hand bewegt, schickt die Capsule 62,5 Reports pro Sekunde, wie die echte SpaceMouse. Hört sie auf, schickt sie so lange Nullen, bis drei durch sind, weil ein verlorener letzter Report das Modell weiterdrehen ließe, und dann ist sie still.',
    p2: 'Die Bewegungsrechnung und die Tastengesten stecken in einer Bibliothek ohne Hardware-Code, sodass 19 Unit-Tests sie vor jedem Flashen auf einem Computer prüfen.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'M5Stack Capsule v1.1', s: 'ist schon das ganze Ding, ohne Zusätze. Ihr ESP32-S3 führt die Firmware und Bluetooth aus, ihre BMI270-IMU liest das Gyroskop 200-mal pro Sekunde, und ihre RGB-LED und der Summer geben Rückmeldung.' },
      { b: 'Die Taste', s: 'oben auf der Capsule übernimmt alle drei Gesten.' },
      { b: 'Ein 250-mAh-Akku', s: 'im Inneren macht sie kabellos, und sie schaltet sich ab, wenn sie eine Weile nicht bewegt wurde.' },
    ],
    holdAlt: 'Ich halte die Capsule vor den Monitor, während sich das Gehäuse in Onshape mitdreht',
    holdCaption: 'Das Gehäuse aus der Demo drehen',
  },
  setup: {
    h: 'Nachbauen',
    steps: [
      <>Installier den kostenlosen Treiber von 3Dconnexion, 3DxWare, auf deinem Computer. Er enthält den Teil, durch den Onshape im Browser auf eine 3D-Maus hören kann.</>,
      <>Flash die Firmware mit M5Burner auf eine Capsule v1.1. Sie ist noch nicht auf M5Burner, also kommt dieser Schritt bald.</>,
      <>Öffne die Bluetooth-Einstellungen deines Computers und kopple <b>Capsule CAD Mouse</b>. Sie zwitschert, wenn sie sich verbindet.</>,
      <>Öffne ein Modell in Onshape, klick die Taste und dreh die Capsule.</>,
    ],
    note: 'Bisher habe ich sie nur in Onshape ausprobiert. Andere Programme, die eine SpaceMouse über 3DxWare ansprechen, sollten genauso funktionieren, aber getestet habe ich sie noch nicht, und wie lange der Akku hält, habe ich auch noch nicht gemessen.',
  },
};
export default de;
