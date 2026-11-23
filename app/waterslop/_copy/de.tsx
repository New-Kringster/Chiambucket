import type { WaterslopCopy } from './en';

/* The OCR Reader article's German words, in the shape of en.tsx. */
const de: WaterslopCopy = {
  meta: {
    title: 'OCR Reader, ein kamerabasierter Wasserzählerleser auf einem ESP32-S3 | Chiambucket',
    description:
      'OCR Reader ist ein günstiger, batteriebetriebener Wasserzählerleser, der den Zähler mit einer Kamera abliest. Ein Netz mit 693K Parametern, DrumNet V10, läuft komplett auf seinem ESP32-S3 und liest die Rollen, und der Zählerstand geht per LoRaWAN raus. Der Artikel geht durch MeterSim, SimGen2, die sechs Agenten, die es trainiert haben, das Netz Schritt für Schritt, die Firmware, die Platine in 3D, das Gehäuse und einen ConfigKing-Simulator.',
    ogTitle: 'OCR Reader: ein kamerabasierter Wasserzählerleser auf einem ESP32-S3',
  },
  ld: { headline: 'OCR Reader: ein kamerabasierter OCR-Wasserzählerleser auf einem ESP32-S3' },

  ui: {
    chapterDash: 'Kapitel - {n}',
    next: 'Weiter',
    nextChapter: 'Nächstes Kapitel',
    nextFrame: 'Nächstes Bild',
    coverAria: 'Kapitel {n}: {title}',
    coverN: 'Kapitel {n}',
    coverContents: 'In Kapitel {n}',
    ck: {
      hint: 'Zum Steuern Display oder Taste antippen',
      deviceAria: 'ConfigKing-Simulator auf einem M5Stack Cardputer. Klick auf den Bildschirm oder die Tasten und nutze dann die Pfeiltasten, Enter, Escape und Tab.',
      keyboard: 'Cardputer-Tastatur',
      view: 'Ansicht',
      close: 'Nah',
      full: 'Gesamt',
      zoom: 'Lupe',
      fullScreen: 'Vollbild',
      exitFullScreen: 'Vollbild beenden',
    },
  },

  entrance: 'Wasserzähler-OCR auf einem ESP32-S3',
  skip: { toEnd: 'Zum Ende springen', toTop: 'Nach oben' },

  hero: {
    label: 'OCR Reader',
    labelSub: 'Wasserzähler-OCR auf einem ESP32-S3 · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader ist ein günstiger, sparsamer, kamerabasierter OCR-Leser für Wasserzähler. Ein neuronales Netz mit 693K Parametern, DrumNet V10, läuft komplett auf dem ESP32-S3 des Lesers. Dort findet es das Ziffernfenster, liest jede Rolle und schickt die Zahl in etwa 2 Sekunden per LoRaWAN nach Hause. Das Ziel sind 99 % Genauigkeit bei 2 Jahren Batterielaufzeit, und der aktuelle Build liest 56 % der Zählerstände richtig. Das will ich noch verbessern.',
    contentsAria: 'Kapitel',
    start: 'Jetzt lesen',
    report: 'Der Bericht',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  chapters: {
    v2: 'Platine & Gehäuse', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: 'Agenten‑Workflow',
    firmware: 'Firmware', power: 'Energie sparen', camera: 'Kamerawahl', proto: 'Prototyp V2', conclusion: 'Fazit', report: 'Der Bericht',
  },

  /* ── Kapitel I bis III: das 3D-Kapitel, der DrumNet-Film und ConfigKing ── */
  pcb: {
    aria: 'Platine und Gehäuse von Prototyp V2 in 3D, am Ende macht der Leser ein Foto vom Zähler',
    chapterColon: 'Kapitel {n}:',
    name: 'OCR-Reader-Platine',
  },

  film: {
    aria: 'Eine Animation der gesamten DrumNet-V10-Architektur',
    title: 'DrumNet',
    of: '{stage} · {n} von {total}',
    nudge: 'Der Film läuft von selbst, und gleich geht die Seite weiter.',
    scenesAria: 'Szenen',
    sceneAria: '{n}. {title}',
    prev: 'Vorherige Szene',
    prevTitle: 'Zurück (←)',
    play: 'Abspielen',
    pause: 'Pause',
    replay: 'Nochmal',
    playTitle: 'Abspielen / Pause (Leertaste)',
    next: 'Nächste Szene',
    nextTitle: 'Weiter (→)',
    fast: 'Vorspulen, jetzt {n}-fach',
    fastTitle: 'Vorspulen (f)',
    skip: 'Überspringen',
    skipTitle: 'Zum nächsten Kapitel springen, ConfigKing',
    scenes: {
      photo: {
        stage: 'Aufnahme', title: 'Das Foto, das der Leser gerade gemacht hat',
        body: 'Das ist ein einzelnes Graustufenbild mit 800 × 600, und alles ab hier läuft auf dem ESP32-S3, nur mit diesem Foto.',
      },
      downscale: {
        stage: 'Eingabe', title: 'Die Aufnahme verkleinern',
        body: 'Der Leser nimmt den Zähler mit 800 × 600 in Graustufen auf, und für den Spotter wird das auf 320 × 240 verkleinert. Das sind viermal weniger Zahlen, also läuft die grobe Suche schnell und günstig.',
      },
      'spot-net': {
        stage: 'Spotter', title: 'Fünf Blöcke schrumpfen das Vorschaubild auf ein 10 × 7-Raster',
        body: 'Jeder Block schiebt einen 3 × 3-Kernel über seine Eingabe, behält die starken Antworten (ReLU) und halbiert die Größe (Max-Pooling). Aus dem Vorschaubild werden 8 Maps, dann 16, 24, 32 und 32, jede halb so groß wie die vorige, bis eine Zelle des letzten Blocks für ein 32 × 34 großes Stück des Vorschaubilds steht.',
      },
      'spot-head': {
        stage: 'Spotter', title: 'Die Score-Map wählt die Zelle, die anderen vier sagen, wo',
        body: 'Eine 1 × 1-Faltung macht aus Block 5 fünf Maps mit 10 × 7, und die Score-Map wählt die Zelle, in der am wahrscheinlichsten die Mitte des Ziffernfensters liegt. Diese Position geht an die Maps für dx, dy, Breite und Höhe, die an derselben Zelle gelesen werden, und zusammen zeichnen sie eine Box auf das Vorschaubild.',
      },
      'spot-crop': {
        stage: 'Spotter', title: 'Erst eine grobe Box, dann ein großzügiger Ausschnitt',
        body: 'Der Spotter arbeitet grob, deshalb wird die Box um 1,5 × verbreitert, und der Ausschnitt drumherum nimmt das 1,5-Fache ihrer Breite und das 2,4-Fache ihrer Höhe. Er wird aus dem vollen 800 × 600-Bild geschnitten, nicht aus dem Vorschaubild, und an den Refiner weitergegeben.',
      },
      'ref-net': {
        stage: 'Refiner · Lauf 1', title: 'Vier Blöcke bringen den Ausschnitt auf 32 Maps mit 32 × 12',
        body: 'Der Ausschnitt wird in Graustufen umgewandelt und auf 256 × 96 skaliert, und RefNet lässt vier Blöcke derselben Art laufen wie der Spotter. Der letzte poolt nicht, also behält Block 4 seine 32 Maps mit 32 × 12, eine Spalte für je 8 Pixel des Ausschnitts.',
      },
      'ref-avg': {
        stage: 'Refiner · Lauf 1', title: 'Jede Map wird zu einer Zeile und einer Spalte gemittelt',
        body: 'Block 4 ist ein Stapel aus 32 Maps, und eine nach der anderen löst sich ab. Ihre 32 Spalten werden zu einer Zeile der Spaltenmittel-Map gemittelt und ihre 12 Zeilen zu einer Spalte der Zeilenmittel-Map, sodass die erste links und rechts findet und die zweite oben und unten.',
      },
      'ref-heads': {
        stage: 'Refiner · Lauf 1', title: 'Aus den Mittelwert-Maps werden Score- und Offset-Streifen',
        body: 'Eine 1 × 1-Faltung liest jede Spalte der Spalten-Map und macht daraus vier Streifen, einen Score und einen Offset für die linke Kante und dasselbe für die rechte, während aus der Zeilen-Map vier weitere für oben und unten werden. Der höchste Score wählt die Zelle, sein Offset sagt, wo in dieser Zelle die Kante sitzt, und die vier Kanten ergeben die Box.',
      },
      'ref-pass2': {
        stage: 'Refiner · Lauf 2', title: 'Box erweitern, neu zuschneiden, dasselbe Netz nochmal',
        body: 'Die Box aus Lauf 1 ist nur so gut zentriert wie die Schätzung des Spotters, deshalb wird sie erweitert, neu zugeschnitten und durch genau denselben Refiner geschickt, mit denselben vier Blöcken, Heads und 15.400 Gewichten. Lauf 2 spielt Lauf 1 schnell nach, und seine Box geht weiter an den Leser.',
      },
      cut: {
        stage: 'Schnitt', title: 'Das Fenster in Rollen schneiden',
        body: 'Das Layout mit 4 ganzen Rollen und 2 Nachkommarollen wurde beim Einrichten festgelegt, also wird das Fenster in sechs gleiche Zellen geteilt. Jede wird grau gemacht, bei 32 × 64 auf vollen Kontrast gestreckt und an die Leser geschickt. Wir folgen der sechsten Rolle, der 7.',
      },
      'rd-net': {
        stage: 'Leser 1', title: 'Ein Leser macht aus einer Zelle 96 winzige Maps',
        body: 'Der Leser nutzt noch einmal dieselben vier Blöcke aus 3 × 3-Faltung, ReLU und Max-Pooling, nur breiter, mit 16, 48, 96 und 96 Maps. So endet die 32 × 64-Zelle als 96 Maps mit 2 × 4, und eine Zelle steht dann für ein 16 × 16 großes Stück der Rolle.',
      },
      flatten: {
        stage: 'Leser 1', title: '96 Maps werden zu einer Liste mit 768 Zahlen',
        body: 'Hier wird nichts berechnet. Die erste Map wird vom Block gezogen, und ihre 2 × 4 Zellen werden Zeile für Zeile in eine Reihe aus 8 gelesen. Dann folgen die anderen 95 Maps, bis der Block leer ist, sodass die 768 Zahlen immer in derselben Reihenfolge stehen, Map 1 zuerst und Map 96 zuletzt.',
      },
      dense: {
        stage: 'Leser 1', title: 'Die Dense-Schicht macht aus 768 Zahlen 96 Neuronen',
        body: 'Jedes der 96 Neuronen multipliziert jede Zahl mit einem eigenen Gewicht, addiert die 768 Produkte und einen Offset und macht alles unter null zu null. Neuron 69 ist zuerst dran, ganz langsam, dann machen die anderen 95 dasselbe.',
      },
      digit: {
        stage: 'Leser 1', title: 'Der Ziffern-Head macht aus zehn Scores eine Antwort',
        body: 'Jede Ziffer von 0 bis 9 hat ihre eigenen 96 Gewichte und ihren eigenen Offset, also ergeben zehn gewichtete Summen zehn Scores. Softmax nimmt e hoch jeden Score und teilt durch die Summe, wodurch ein klarer Vorsprung fast die ganze Wahrscheinlichkeit bekommt. Die 7 gewinnt mit 96,4 %, und dieser Prozentwert ist die Konfidenz.',
      },
      roll: {
        stage: 'Leser 1', title: 'Der Roll-Head misst, wie weit sich die Rolle gedreht hat',
        body: 'Noch eine gewichtete Summe der 96 Neuronen ergibt einen Roll-Score, den tanh auf −0,5 bis +0,5 staucht. Er sagt, wie weit die Rolle über ihrer Marke steht. Diese 7 hat sich um 3,7 % eines Schritts Richtung 8 gedreht.',
      },
      readers3: {
        stage: 'Leser-Ensemble', title: 'Leser 2 und 3 lesen dieselbe Rolle',
        body: 'Drei Kopien des Lesers teilen sich eine Architektur, wurden aber von verschiedenen zufälligen Startwerten aus trainiert, also machen sie verschiedene Fehler. Dieselbe Zelle läuft genauso durch Leser 2 und 3, nur schnell, und jeder liefert seine eigenen zehn Prozentwerte und seinen eigenen Roll-Wert.',
      },
      vote: {
        stage: 'Abstimmung', title: 'Drei Antworten werden zu einer gemittelt',
        body: 'Die Antworten der drei Leser landen bei der Abstimmung, wo ihre Wahrscheinlichkeitslisten gemittelt werden. So hat jeder Leser dasselbe Stimmgewicht, und der dritte entscheidet bei Gleichstand. Die gemittelte Liste liefert die Ziffer und ihre Konfidenz, die drei Roll-Werte werden auch gemittelt, und Rolle 6 kommt als 7 mit 98,8 % heraus.',
      },
      drums: {
        stage: 'Abstimmung', title: 'Jede andere Rolle läuft durch dieselbe Maschinerie',
        body: 'Die anderen fünf Zellen durchlaufen schnell dieselben Schritte, die vier Blöcke, Flatten, Dense und die zwei Heads in allen drei Lesern gleichzeitig, dann die Abstimmung, bis sechs gemittelte Antworten vor der Übertragsregel nebeneinanderstehen. Rolle 3 ist am unsichersten, eine 9 mit 71,5 %, weil Leser 3 eine 0 gesehen hat und überstimmt wurde.',
      },
      carry: {
        stage: 'Abstimmung', title: 'Die Übertragsregel, dann der Zählerstand',
        body: 'Eine Rolle darf nur dann mitten im Drehen stehen, wenn die Rolle rechts von ihr auf 9 oder 0 steht oder wenn sie selbst die letzte ist. Dann wird ihrem Roll-Wert vertraut, und die Ziffer darf weiterspringen. Steht die rechte Rolle auf 1 bis 8, wird diese Rolle auf ihre nächstgelegene Ziffer festgelegt, damit 79 auf dem Weg zu 80 nicht als 89 gelesen wird. Hier liegt jeder Roll-Wert im Totband, also behält jede Rolle ihre Ziffer, und der Zählerstand ist 0092.07.',
      },
      finale: {
        stage: 'DrumNet V10', title: 'Die ganze Pipeline auf einmal',
        body: 'Noch einmal laufen alle Stufen gleichzeitig, vom Vorschaubild und dem Spotter über den Refiner, die sechs Zellen, die drei Leser und die Abstimmung bis zur Übertragsregel. Dafür braucht der Leser etwa zwei Sekunden pro Zahl.',
      },
    },
    panels: {
      input: { title: 'Eingabe', sub: 'ein Foto vom Leser' },
      spotter: { title: 'DetNet Spotter', sub: 'eine grobe Box ums Ziffernfenster' },
      ref1: { title: 'RefNet Refiner · Lauf 1', sub: 'die vier Kanten in der groben Box finden' },
      ref2: { title: 'RefNet Refiner · Lauf 2', sub: 'erweitern, neu zuschneiden, Netz nochmal' },
      cut: { title: 'In Ziffern schneiden', sub: 'eine Zelle pro Rolle' },
      reader1: { title: 'DrumNet-Leser 1', sub: 'welche Ziffer, und wie weit sie gedreht ist' },
      reader2: { title: 'DrumNet-Leser 2', sub: 'dasselbe Netz, anderer Zufallsstart' },
      reader3: { title: 'DrumNet-Leser 3', sub: 'entscheidet bei Gleichstand' },
      vote: { title: 'Abstimmung und Zählerstand', sub: 'Mittel, Übertrag, Zählerstand' },
    },
    draw: {
      block: 'Block {n}',
      mapsOne: '{n} Map · {sub}',
      maps: '{n} Maps · {sub}',
      weights: '{n} Gewichte',
      noPool: '{sub} · ohne Pool',
      greyJpeg: '800 × 600 · Graustufen-JPEG',
      fewer: '{n} Zahlen · 4 × weniger',
      thumbnail: 'Vorschau',
      conv5: '1 × 1 Conv · 32 → 5',
      score: 'Score',
      chosen: 'höchste der 70 Zellen: gewählt',
      across: 'Mitte bei {n} % der Zellbreite',
      down: 'Mitte bei {n} % der Zellhöhe',
      width: 'Breite 0,25 des Bilds · {n} px',
      height: 'Höhe 0,12 des Bilds · {n} px',
      headCols: ['Zelle', 'roh', '0 bis 1', 'Bedeutung'],
      sigmoid: '0 bis 1 ist das Sigmoid des Rohwerts',
      corner: 'dx, dy ab der Zellecke',
      selection: 'Auswahl des Spotters · {w} × {h} px',
      widened: '1,5 × verbreitert',
      cropBox: 'der Ausschnitt · 1,5 × breiter, 2,4 × höher · {w} × {h} px',
      cutFrom: 'aus dem vollen 800 × 600-Bild, nicht aus der Vorschau',
      colAvgSize: 'Spaltenmittel · 32 × 32',
      colAvgNote: 'eine Zeile pro Map · 12 Werte → 1',
      rowAvgSize: 'Zeilenmittel · 32 × 12',
      rowAvgNote: 'eine Spalte pro Map · 32 Werte → 1',
      slab: 'Block 4 · 32 Maps · 32 × 12',
      peel1: 'während Map 1 sich ablöst, wird jede ihrer 32 Spalten zu einem Wert,',
      peel2: 'und jede ihrer 12 Zeilen zu einem Wert',
      mapOf: 'Map {n} von 32',
      colAvg: 'Spaltenmittel',
      rowAvg: 'Zeilenmittel',
      sameCol: 'dieselben Gewichte für jede Spalte',
      sameRow: 'dieselben Gewichte für jede Zeile',
      conv: '1 × 1 Conv',
      inOut: '32 rein, 4 raus',
      leftScore: 'Score links', leftOffset: 'Offset links', rightScore: 'Score rechts', rightOffset: 'Offset rechts',
      topScore: 'Score oben', topOffset: 'Offset oben', bottomScore: 'Score unten', bottomOffset: 'Offset unten',
      stripsKey: 'voll: höchster Score · gepunktet: sein Offset · Linie: Lage der Kante in der Zelle',
      crop: 'Ausschnitt · 256 × 96 grau',
      expanded: 'erweitert · {w} × {h} px → 256 × 96',
      sameRef: 'dasselbe RefNet · gleiche Blöcke, gleiche Heads, gleiche 15.400 Gewichte',
      pass2Box: 'Box aus Lauf 2',
      toReader: '{w} × {h} px · an den Leser',
      window: 'Fenster · {w} × {h} px · 6 gleiche Streifen',
      cells: 'Zellen · eine pro Rolle',
      readerCells: 'Leserzellen · grau, voller Kontrast, 32 × 64',
      drum: 'Rolle {n}',
      drumSize: 'Rolle {n} · 32 × 64',
      reader1Maps: 'Maps und Neuronen sind die von Leser 1, Ziffer und Roll aber die dieses Lesers',
      mapsLeft: 'Block 4 · noch {n} von 96 Maps',
      rowByRow: 'Zeile für Zeile',
      map1List: 'Map 1 → Listenplätze 1 bis 8',
      map: 'Map {n}',
      oneList: 'eine Liste · {n} Zahlen',
      numbers768: '768 Zahlen',
      weightPer: 'ein Gewicht pro Zahl',
      sum768: 'Summe der 768',
      offset: 'Offset',
      unit: 'Neuron {n}',
      units96: '96 Neuronen',
      aboveZero: '{w} Gewichte · {n} der 96 sind für diese Rolle über null',
      digitCols: ['Score', 'e^Score', '÷ Summe', 'Softmax'],
      digit: 'Ziffer {n}',
      firmwareChecks: 'die Konfidenz, die die Firmware prüft',
      share: 'e^7,1 = 1.215 ÷ 1.260 · 3,6 Vorsprung im Score heißt 36 × Anteil',
      rollScore: 'Roll-Score',
      roll: 'Roll {v}',
      rollMeasured: 'die 7 ist 3,7 % eines Schritts über ihrer Marke, Richtung 8',
      rollPast: 'die {d} ist {p} % eines Schritts über ihrer Marke',
      rollBefore: 'die {d} ist {p} % eines Schritts vor ihrer Marke',
      leastSure: 'am unsichersten, da Leser 3 eine 0 las und überstimmt wurde',
      reader: 'Leser {n}',
      mean: 'Mittel',
      meanOfThree: 'Roll {v} · Mittel aus drei',
      inBand: 'im Band',
      pastBand: 'außerhalb',
      freeLast: 'frei · letzte Rolle',
      free: 'frei · rechte Rolle auf 9 oder 0',
      lock: 'fest · rechte Rolle auf 1 bis 8',
      allowed: '{n} → {m} erlaubt',
      absolute: '{n}, absolut',
      carryNote: '79 auf dem Weg zu 80 könnte als 89 gelesen werden, also nimmt die Regel die vorige Zahl',
      units: 'Kubikmeter · Konfidenz 71,5 %, die unsicherste der 6 Rollen',
      secondRoute: 'zweiter Weg: neu mit WindowNet',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: 'Zum Simulator',
    intro: {
      eyebrow: 'Einrichtung und Konfiguration', title: 'Derselbe Zählerstand im Setup-Tool',
      before: <p>Dieser Zählerstand, 0092.07, und das Bild, aus dem er stammt, sind genau das, was ConfigKing anzeigt, wenn es einen Leser mit Read ablesen lässt. ConfigKing ist die Firmware, die ich für einen M5Stack Cardputer geschrieben habe. Es findet Leser in der Nähe über BLE und ESP-NOW, richtet neue Schritt für Schritt ein und konfiguriert die übrigen neu.</p>,
      after: <p className="ws-note">DrumNet und die Firmware werden auf Prototyp V2 geflasht, und dabei wird gleich die LoRa-Geräteadresse gesetzt. Weil die Leser die meiste Zeit schlafen, drückst du den Boot-Knopf, um einen aufzuwecken, damit er gefunden werden kann. Der Bildschirm hier ist eine funktionierende Kopie der Bildschirme der echten Firmware, aus ihrem Quellcode auf ein Foto des Cardputers gezeichnet.</p>,
    },
    press: { connect: 'koppeln', save: 'sichern', next: 'weiter', finish: 'fertig', continue: 'weiter' },
    steps: {
      nearby: { eyebrow: 'Schritt 1', title: 'Erkennung', body: 'Wenn ein unkonfigurierter Leser eingeschaltet wird, startet er automatisch im Konfigurationsmodus. ConfigKing erkennt das und fordert dich auf, ihn einzurichten.' },
      identify: { eyebrow: 'Schritt 2', title: 'Kennung und Ableserate', body: 'Leg den Namen fest, den der Leser im Dashboard zeigt, dann seine Ableserate, und klapp das (i)-Symbol auf, um mehr Details über den Leser zu sehen.' },
      layout: { eyebrow: 'Schritt 3', title: 'Rollen-Layout', body: 'Stell das Rollen-Layout passend zu dem Zähler ein, an dem der Leser montiert wird, mit 1 bis 8 Rollen für ganze Zahlen und 0 bis 4 Nachkommarollen.' },
      camera: { eyebrow: 'Schritt 4', title: 'Kamera einstellen', body: 'Stell Helligkeit, Gain und den PWM-Tastgrad der LEDs für gleichmäßiges Licht ein. Du kannst zoomen und verschieben, um dir das Bild genauer anzusehen, und das Bild wird dunkler und heller, wenn sich die Einstellungen ändern.' },
      roi: { eyebrow: 'Schritt 5', title: 'ROI verfeinern', body: 'WindowNet erzeugt automatisch eine ROI, und mit den Reglern kannst du sie verfeinern, mit Zoom und Verschieben für mehr Details.' },
      read: { eyebrow: 'Schritt 6', title: 'Testablesung', body: 'Eine Testablesung läuft mit der vorher gesetzten ROI und zeigt ihre Konfidenz, die du mit (D) Ziffer für Ziffer ansehen kannst.' },
      radio: { eyebrow: 'Schritt 7', title: 'LoRa-Verbindungstest', body: 'Ein Verbindungstest stellt sicher, dass der Leser das LoRaWAN-Gateway erreicht, und das (i)-Menü zeigt aufgeklappt mehr Infos.' },
      review: { eyebrow: 'Schritt 8', title: 'Prüfen und speichern', body: 'Prüf die Einstellungen, die auf dem Leser gespeichert werden. Sobald sie gespeichert sind, wechselt der Leser in den normalen Einsatzmodus, und die BLE-Verbindung bricht ab.' },
      done: { eyebrow: 'Einrichtung fertig', title: 'Der Leser schläft und beginnt zu lesen', body: 'Die Abschlussmeldung zeigt den Schlaf-Timer des Lesers, und ab jetzt wacht der Leser in seinem eigenen Intervall auf, liest ab, schickt den Wert und schläft wieder ein.' },
      connected: { eyebrow: 'Ein konfigurierter Leser', title: 'Read, Configure, More', body: 'Ein konfigurierter Leser bekommt statt des Assistenten Read, Configure und More. Configure öffnet immer eine Setup-Kategorie auf einmal, mit ausdrücklichem Speichern oder Verwerfen, und More enthält den Funktest, Leserinfos, About und einen Werksreset, der um Bestätigung bittet.' },
    },
    free: {
      eyebrow: 'Ausprobieren', title: 'Richte selbst einen Leser ein',
      body: <p>Hier gibt es dieselben Bildschirme, Tasten und denselben Assistenten wie beim echten Gerät, verbunden mit einem simulierten Leser. Du kannst die Tasten am Cardputer drücken, auf seinen Bildschirm tippen oder auf deiner eigenen Tastatur schreiben, und gleich taucht ein Leser in der Nähe auf.</p>,
    },
  },

  /* ── Kapitel IV: MeterSim ── */
  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['Ein simulierter Zähler', 'Für Agenten gebaut', 'Designs und Presets', 'Halb gedrehte Rollen', 'Wetter und Oberflächen', 'Auswertung ohne Aufsicht'],
      lede: 'MeterSim zeichnet einen Wasserzähler auf ein Tablet, damit eine echte Kamera gelabelte Ablesungen sammeln kann, ohne dass jemand zuschaut.',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: 'Ein simulierter Zähler für eine echte Kamera',
        body: <p>Die erste Version von MeterSim entstand zusammen mit der Firmware für Prototyp V0.5, und die beiden arbeiten Hand in Hand. So kann MeterSim Prototyp V0.5 automatisch steuern und gelabelte Bilder fürs Training des Modells erzeugen. Die gesamte Software und Firmware hat Claude geschrieben.</p>,
        alt: 'Prototyp V0.5, ein ESP32-EYE, auf ein Tablet mit der MeterSim-Anzeige gerichtet',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: 'Für Agenten gebaut',
        body: <p>MeterSim ist dafür gebaut, von KI-Agenten statt von Menschen bedient zu werden, also ist sein Bedienfeld vor allem dazu da, dass Menschen den Fortschritt der Agenten verfolgen können. Die Agenten haben mit MeterSim Tests gebaut, Daten gesammelt und die Genauigkeit geprüft, während sie DrumNet entwickelt haben. Es übernimmt den mühsamsten Job im Machine Learning, gute Trainingsdaten zu sammeln, indem es diese Daten einfach erzeugt, und weil der Zähler simuliert ist, kommt jedes Bild schon mit Label.</p>,
        alt: 'Das Bedienfeld von MeterSim mit Reglern für Zählerstand, Rollen, Oberfläche und Wettereffekte',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: 'Neun Zählerdesigns und neun Presets',
        body: (
          <>
            <p>MeterSim hat 9 Zählerdesigns, und jedes lässt sich mit einem anderen Rollen-Layout einrichten, etwa mit 7 ganzzahligen Rollen und 1 Nachkommarolle (7+1). Die ganzzahligen Rollen sind meist weiß oder schwarz, die Nachkommarollen rot.</p>
            <p>Häufige Kombinationen von Bedingungen sind als Presets gespeichert: sauber, Mittag, Blendung auf den Ziffern, Halbschatten, weicher Schatten, Dämmerung, schattig, geneigt und schmutzig.</p>
          </>
        ),
        alt: [
          'Die neun Zählerdesigns in MeterSim: Itron Weg 50, Elster aus Messing, Itron Multimag Cyble, Bonega S/13 und T/13, Istameter II, ein generischer Industriezähler, B Meters in Blau und ein sauberer Elster aus Messing',
          'Neun Preset-Bedingungen: sauber, Mittag, Blendung auf den Ziffern, Halbschatten, weicher Schatten, Dämmerung, schattig, geneigt und schmutzig',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: 'Halb gedrehte Rollen',
        body: <p>Es simuliert auch halb gedrehte Rollen, damit das Modell lernt, eine Rolle zu lesen, die irgendwo zwischen einer Ziffer und der nächsten steht, und der Agent stellt sie beim Sammeln der Trainingsdaten automatisch ein.</p>,
        alt: 'Die Roll-Steuerung von MeterSim, mit der einzelne Rollen zwischen zwei Ziffern gezogen werden',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: 'Wetter und Oberflächen',
        body: <p>MeterSim simuliert auch das Wetter und den Zustand der Zähleroberfläche, so wie ein Zähler aussehen kann, der draußen Wind und Wetter ausgesetzt ist, damit der Leser lernt, unter all diesen Bedingungen zu lesen. Die Regler decken Blendung, Schlieren, Schatten, Beleuchtung, Unschärfe, Sensorrauschen, Nebel, Schmutz und Skalierung ab.</p>,
        alt: 'Die Regler für Oberflächen- und Wettereffekte in MeterSim, jeder mit einem Vorschaubild',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: 'Auswertung und Datensammlung ohne Aufsicht',
        body: (
          <>
            <p>MeterSim ist eine selbst gehostete Web-App mit zwei Endpunkten, dem Bedienfeld unter /control und der Anzeige unter /display. Der Leser verbindet sich mit demselben lokalen WLAN wie MeterSim und schickt darüber seine Zählerstände und Bilder und empfängt Befehle.</p>
            <p>Um ein Modell auszuwerten, erzeugt MeterSim einen zufälligen Zähler mit zufälligen Bedingungen und zeigt ihn dem Leser, der ein Bild macht und es mit dem trainierten Netz liest. Das Ergebnis geht zurück an MeterSim, das den simulierten Wert kennt und ihn mit der Vorhersage vergleicht. Wenn ein Agent das oft wiederholt, ohne dass jemand zuschaut, ergibt sich daraus eine ungefähre Genauigkeit für das Modell. Gelabelte Daten zu sammeln funktioniert genauso, nur werden die Bilder des Lesers mit ihren Labels in JSON auf die Platte gespeichert, fertig fürs Training.</p>
          </>
        ),
        alt: [
          'Ein Tablet mit der MeterSim-Anzeige neben einem Laptop mit dem Bedienfeld, der ESP32-EYE-Leser ist auf das Tablet gerichtet',
          'Der ESP32-EYE-Leser auf einer Flasche, auf die MeterSim-Anzeige gerichtet, in einem Klassenzimmer',
        ],
      },
    },
  },

  /* ── Kapitel V: SimGen2 ── */
  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['Sechs Stufen', 'Echt über synthetisch', 'Selbst vergleichen'],
      lede: 'SimGen2 erzeugt synthetische Aufnahmen, die aussehen, als hätte die Kamera des Lesers sie gemacht, in etwa 2 s pro Bild, fast 5× schneller als eine echte Aufnahme.',
    },
    page: 'SimGen2',
    stages: [
      ['Display-Screenshot', 'MeterSims Anzeige, 1920 × 1080'], ['Verzerrt', 'Pose und Linse, auf 1600 × 1200'], ['Feldunschärfe', '1,2 bis 2,2 px'], ['Gain, Tonkurve, Vignette', 'wie der Sensor reagiert'], ['Sensorrauschen', 'Körnung, wo die echte Kamera sie hat'], ['OV2640-JPEG', 'Qualität 6, wie der Leser komprimiert'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: 'Die Kamera selbst simulieren',
        body: (
          <>
            <p>Trotz all dieser Automatisierung blieb ein großer Engpass, denn ein Bild auf dem Leser aufzunehmen und an MeterSim zu schicken dauert fast 10 s, und bei Tausenden Bildern summiert sich das auf viele Stunden. Das nächste Ziel war also, die Kamera des Lesers selbst zu simulieren, und genau das ist SimGen2. Es skaliert das Bild und legt dann Filter und Verzerrungen darüber, damit es aussieht, als käme es aus der Kamera des Lesers.</p>
            <p>SimGen2 wurde komplett von OpenAIs ChatGPT Astra 6 entwickelt, das rund 4.000 echte Bilder vom Leser genutzt hat, um die Filter zu bauen.</p>
          </>
        ),
        alt: 'Die sechs Verarbeitungsstufen von SimGen2, vom Display-Screenshot über verzerrt, unscharf, getont und verrauscht bis zur JPEG-komprimierten Ausgabe, mit einem Streifen des Zählwerks in jeder Stufe',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: 'Echt über synthetisch',
        body: <p>SimGen2 erzeugt ein Bild in etwa 2 s, fast 5× schneller als eine Aufnahme mit dem echten Leser, und parallel zum Leser hat es Zehntausende einzigartige, gelabelte Bilder erzeugt, um das Modell DrumNet Simulated zu trainieren. Hier liegt eine echte Aufnahme in Magenta über ihrer SimGen2-Version in Grün, sodass das Bild überall farblos ist, wo die beiden übereinstimmen. Die LED-Blendung in der echten Aufnahme ist der größte Unterschied, der noch bleibt.</p>,
        alt: 'Eine echte Aufnahme in Magenta über ihrer synthetischen SimGen2-Version in Grün, farblos überall dort, wo die beiden übereinstimmen',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: 'Selbst vergleichen',
        body: <p>Das sind einundzwanzig echte Aufnahmen und ihre SimGen2-Versionen von sechs Zählerdesigns, ausgeschnitten aus den Bögen des Berichts. Zieh den Trenner, um sie zu vergleichen, links die echte Aufnahme und rechts SimGen2. Der Zählwerkstreifen ist am größten zu sehen, weil DrumNet genau diesen Teil liest.</p>,
      },
    },
    compare: {
      realStrip: 'Echte Aufnahme des Zählwerks von {meter}',
      simStrip: 'Dasselbe Zählwerk, wie SimGen2 es erzeugt hat',
      realMeter: 'Echte Aufnahme des Zählers {meter}',
      simMeter: 'Derselbe Zähler, wie SimGen2 ihn erzeugt hat',
      real: 'echt',
      sim: 'SimGen2',
      divider: 'Trenner zwischen der echten Aufnahme links und SimGen2 rechts',
      pairs: 'Paare',
    },
  },

  /* ── Kapitel VI: die Agenten ── */
  agents: {
    cover: {
      title: 'Agenten-Workflow', lines: ['Agenten-', 'Workflow'],
      contents: ['Die Schleife', 'Sechs Agenten', 'Ressourcen und Scheduler', 'Verwaltet mit T3 Code'],
      lede: 'Sechs Agenten haben die Leser gleichzeitig trainiert und getestet und sich dabei einen Scheduler für Rechenleistung und Teststand geteilt.',
    },
    page: 'Agenten-Workflow',
    rows: {
      'ag-loop': {
        eyebrow: 'Agenten-Workflow', title: 'Die Schleife der Selbstverbesserung',
        body: <p>In diesem Projekt habe ich sehr viel mit LLM-basierten KI-Agenten gearbeitet, und ihre Aufgabe war, die ganze Vision-Pipeline auf dem ESP32-S3 in Richtung eines Ziels von 99 % Zählergenauigkeit zu verbessern. Jeder Agent arbeitete in einer Schleife. Er stellte eine Hypothese auf, plante die Umsetzung, sammelte Trainingsdaten, trainierte das Modell neu, machte Fine-Tuning oder RL, testete auf Verbesserungen oder Rückschritte, berichtete dann seine Ergebnisse und fing von vorn an.</p>,
      },
      'ag-six': {
        eyebrow: 'Agenten-Workflow', title: 'Sechs Agenten, drei davon an DrumNet',
        body: (
          <>
            <p>Drei Agenten liefen in dieser Schleife, jeder an seiner eigenen DrumNet-Variante, während drei weitere Agenten andere Jobs erledigten. Nach etwa 1,5 Wochen schnitten Standard und Premade immer noch schlecht ab, also wurde ihre Entwicklung gestoppt, und alle ihre Ressourcen gingen an DrumNet Simulated.</p>
            <p>DrumNet Simulated durfte danach mit allen Datensätzen trainieren, auch mit denen vom Teststand und aus dem externen Katalog, und wurde in DrumNet umbenannt. Der aktuelle Build, V10, ist das beste Netz der ganzen DrumNet-Reihe.</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: 'Agenten-Workflow', title: 'Geteilte Ressourcen und ein Scheduler',
        body: (
          <>
            <p>Mit sechs Agenten gleichzeitig stritten sie sich ständig um Ressourcen, also habe ich einen Scheduler entwickelt, mit dem sie Zeitfenster auf den geteilten Ressourcen buchen können. Die eine ist die Rechenleistung fürs Training, also die CPU meines Servers und die GPU meines Laptops. Die andere ist der Jetson-Teststand, an dem ein Agent Prototyp V1 flashen und damit arbeiten kann, während er über MeterSim die Anzeige steuert, auf die der Prototyp gerichtet ist.</p>
            <p className="ws-note">In der Compute-Zeitleiste des Schedulers zeigt die gefüllte Fläche die gebuchten Threads gegenüber dem Budget von 20 Threads und die rote Linie den gebuchten Speicher gegenüber dem Budget von 9 GB, während die Laptop-GPU immer nur einen Job auf einmal nimmt.</p>
          </>
        ),
        alt: [
          'Eine Skizze der drei DrumNet-Agenten, die sich über zwei Scheduler den Jetson-Teststand und die Rechenleistung teilen, daneben der Koordinator, Sim2 Genius und das Modell zur Fenstererkennung',
          'Die Scheduler-Zeitleiste für die Rechenressourcen, mit gebuchten Blöcken pro Agent und der gebuchten Last gegenüber dem Budget',
        ],
      },
      'ag-t3': {
        eyebrow: 'Agenten-Workflow', title: 'Verwaltet mit T3 Code',
        body: (
          <>
            <p>Die Agenten liefen rund um die Uhr mit einem „Heartbeat“, einem einfachen Skript, das einen Agenten nach einem festen Intervall oder zu einer festen Uhrzeit weckt, damit er weiterarbeitet. Sie sollten selbstständig handeln und ihre eigenen Entscheidungen treffen, also musste ich kaum eingreifen.</p>
            <p>Das Netzwerk lief über Tailscale, ein persönliches Peer-to-Peer-VPN, über das die Agenten auf meinem Server zu Hause den Jetson-Teststand in der Schule per SSH erreichen und steuern konnten. Die Agenten selbst wurden in T3 Code verwaltet, einem Open-Source-Meta-Harness für Claude Code und Codex.</p>
          </>
        ),
        alt: 'Diagramm von T3 Code, das das Client-Gerät, den Heimserver mit den Agenten, die Laptop-GPU und den Jetson-Teststand in der Schule über Tailscale verbindet',
      },
    },
    loop: {
      steps: ['Hypothese', 'Umsetzung planen', 'Trainingsdaten sammeln', 'Neu trainieren, Fine-Tuning oder RL', 'Testen, ob besser oder schlechter', 'Ergebnisse melden, dann neue Hypothese'],
      lines: [['Hypothese'], ['Umsetzung', 'planen'], ['Trainingsdaten', 'sammeln'], ['Neu trainieren,', 'Fine-Tuning oder RL'], ['Testen, ob besser', 'oder schlechter'], ['Ergebnisse melden,', 'dann neue Hypothese']],
      aria: 'Die Schleife der Agenten: {steps}, und wieder von vorn.',
      target: 'ZIEL',
      accuracy: 'Genauigkeit',
    },
    badges: {
      model: 'Modell', job: 'Aufgabe', data: 'Trainiert mit', won: 'wurde DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: 'Der Purist', model: 'Fable 5.1, dann Opus 5.5', job: 'Liest Rollen', data: 'Nur Bilder von Prototyp V1, ausgehend vom Basis-DrumNet V1', fate: 'Nach 1,5 Wochen gestoppt' },
        simulated: { name: 'DrumNet Simulated', persona: 'Der Träumer', model: 'Fable 5.1, dann Opus 5.5', job: 'Liest Rollen', data: 'Nur SimGen2-Bilder, komplett computergeneriert, ausgehend vom Basis-DrumNet V1', fate: 'In DrumNet umbenannt, jetzt bei V10' },
        premade: { name: 'DrumNet Premade', persona: 'Der Sammler', model: 'Fable 5.1, dann Opus 5.5', job: 'Liest Rollen', data: 'Alle Datensätze: Prototyp V1, SimGen2, Badger55, Jomjol-digits, ausgehend vom dig-cont-Modell', fate: 'Nach 1,5 Wochen gestoppt' },
        windownet: { name: 'WindowNet', persona: 'Der Späher', model: 'Opus 5.5', job: 'Findet das Fenster', data: 'Trainiert den Spotter (DetNet) und den Refiner (RefNet), die das Rollenfenster finden', fate: 'Immer noch das schwächste Glied, hier beginnen die meisten falschen Zählerstände' },
        sim2: { name: 'Sim 2 Genius', persona: 'Der Bühnenarbeiter', model: 'Opus 5.5', job: 'Betreibt den Simulator', data: 'Bedient, wartet und verbessert SimGen2 für die anderen', fate: 'Sorgt für Nachschub an synthetischen Bildern' },
        coordinator: { name: 'OCR Coordinator', persona: 'Der Vorarbeiter', model: 'Fable 5.1', job: 'Leitet das Projekt', data: 'Spricht mit allen anderen Agenten, bucht ihre Zeit, hält den Plan', fate: 'Gab alles an Simulated, als die anderen feststeckten' },
      },
    },
  },

  /* ── Kapitel VII: Firmware (ReadCycle.tsx) ── */
  firmware: {
    cover: {
      title: 'Firmware', lines: ['Leser-', 'Firmware'],
      contents: ['Von einem Agenten geschrieben', 'Ein Wachzyklus', 'Das Dashboard'],
      lede: 'In einem Wachzyklus wacht der Leser auf, nimmt den Zähler auf, liest die Rollen, schickt die Zahl nach Hause und schläft wieder ein.',
    },
    page: 'Firmware',
    chartAria: 'Ablauf der Leser-Firmware für einen Wachzyklus',
    success: 'Erfolg',
    fail: 'Fehler',
    nextCycle: 'NEUER ZYKLUS',
    nodes: {
      wake: { title: 'Aufwachen per RTC', sub: 'Zustand laden, Peripherie starten', time: '~0,2 s' },
      capture: { title: 'Bildaufnahme', sub: 'Aufnahme mit den LED-Lichtern', time: '~0,5 s' },
      low: { title: 'Sparsames Ablesen', sub: 'nur DrumNet-Leser, gespeicherte ROI, ohne WindowNet', time: '~0,5 bis 3 s' },
      uplink: { title: 'LoRaWAN-Uplink', sub: 'Zählerstand geht ans Gateway', time: '~0,3 s' },
      sleep: { title: 'Schlafen', sub: 'die ganze Peripherie ist aus' },
      full: { title: 'Volle DrumNet-Pipeline', sub: 'neu mit WindowNet als Backup' },
      check: { title: 'Konfidenz prüfen', sub: 'ist der neue Wert sicher genug?' },
      alt: { title: 'Mit Ersatz-Spotter laufen', sub: 'ein anderer Satz Ersatzgewichte' },
      reject: { title: 'Ablesung verwerfen', sub: 'in NVS zur Auswertung gesichert, Warnung im Dashboard' },
    },
    steps: {
      wake: 'Der Leser wacht aus dem Schlaf auf und lädt seine Konfiguration und LoRaWAN-Session aus dem Non-Volatile Storage.',
      capture: 'Die Kamera wird initialisiert, und mit den LED-Lichtern wird eine Aufnahme gemacht.',
      low: 'Das Bild geht direkt durch die DrumNet-Leser, mit der beim Einrichten gespeicherten ROI und ohne WindowNet. Das ist der normale und günstigste Weg, und ein sicherer Zählerstand geht nach insgesamt etwa 1,5 s Wachzeit weiter zum Uplink.',
      full: 'Nur wenn die Leser eine niedrige Konfidenz melden, läuft die volle Pipeline als Backup, und WindowNet sucht das Fenster neu.',
      check: 'Die Konfidenz des neuen Zählerstands wird geprüft, und die meisten Ablesungen verlassen die Schleife hier.',
      alt: 'Der Spotter läuft noch einmal mit einem anderen Satz Ersatzgewichte, als letzter Versuch in diesem Zyklus.',
      reject: 'Ein gescheiterter Versuch wird für die spätere Auswertung im NVS gespeichert, und im Dashboard erscheint eine Warnung wegen niedriger Konfidenz.',
      uplink: 'Die LoRa-Verbindung schaltet sich ein, und der Zählerstand geht ans Gateway.',
      sleep: 'Die ganze Peripherie schaltet ab, und der Leser geht in den Tiefschlaf, bis die RTC ihn für den nächsten Zyklus weckt. Ein Druck auf BOOT weckt ihn aber auch zum Konfigurieren.',
    },
    rows: {
      'fw-agents': {
        eyebrow: 'Firmware', title: 'Von einem Agenten geschrieben, auf echter Hardware',
        body: (
          <>
            <p>Ein Astra-6-Agent hatte die Aufgabe, die Firmware für den Leser (Prototyp V2) und für den M5Stack Cardputer Adv zu schreiben. Auf dem läuft ConfigKing, die Konfigurationskonsole, mit der Techniker vor Ort Leser für den Einsatz einrichten und später neu konfigurieren. Der Agent sollte Code nur mit Fable 5.1 schreiben.</p>
            <p className="ws-note">Mein Laptop, das LoRaWAN-Gateway (freundlicherweise von Herrn Lee Chang Fatt bereitgestellt) und der Jetson Nano hingen im selben Netzwerk, der Cardputer und Prototyp V2 waren per USB-Seriell mit dem Laptop verbunden, und alle vier Geräte standen den Agenten zur Verfügung.</p>
          </>
        ),
        alt: 'Der Aufbau für die Firmware-Entwicklung: Laptop, Jetson Nano, LoRaWAN-Gateway, der Leser Prototyp V2 und der Cardputer, die die Agenten über das Netzwerk erreichen',
      },
      'fw-cycle': { eyebrow: 'Ein Wachzyklus', title: 'Neun Schritte, meist reichen aber fünf' },
      'fw-dashboard': {
        eyebrow: 'Dashboard', title: 'Wo der Zählerstand erscheint',
        body: <p>Nach der Ablesung geht der Zählerstand ans LoRaWAN-Gateway, das ihn per MQTT an den Jetson Nano weiterleitet, wo er gespeichert wird. Der Jetson liefert das Dashboard als einzelne HTML-Datei aus, deren JavaScript die Werte aus den gespeicherten Daten aktualisiert. Das Dashboard ist aber nur eine Demo und nicht dafür gemacht, auf echte Einsätze zu skalieren.</p>,
        alt: 'Das Dashboard zur Leserüberwachung: eine Karte für den Testleser mit 0092.07 Kubikmetern und einem Hinweis auf niedrige Konfidenz, dazu Verlaufsdiagramme und eine Tabelle mit neun Ablesungen',
      },
    },
  },

  /* ── Kapitel VIII: Energie ── */
  power: {
    cover: {
      title: 'Energie sparen', lines: ['Energie', 'sparen'],
      contents: ['Sub-Sampling', 'Aufnahmemodi im Vergleich', 'PWM-Dimmung', 'Graustufen', 'INT8 und Vektorrechnung', 'Hardware'],
      lede: 'Jeder Schritt des Wachzyklus wurde auf 2 Jahre Batterielaufzeit getrimmt, mit kleineren Aufnahmen, schwächerem Licht und Ganzzahl-Mathe.',
    },
    page: 'Energie sparen',
    modes: [
      { time: '350 ms Aufnahme', note: 'jedes Pixel des Sensors' },
      { time: '89 ms Aufnahme', note: 'SVGA, der gewählte Modus' },
      { time: '61 ms Aufnahme', note: 'CIF, zu wenige Pixel pro Rolle' },
    ],
    modeAlt: 'Aufnahme des Zählers mit {res}',
    drumsAria: 'die Rollen bei {res}',
    int8: [
      { value: '61 s', label: 'Float32', note: 'Aufnahme bis Vorhersage, vor der Quantisierung' },
      { value: '17 s', label: 'INT8 + ESP-NN', note: 'etwa 3,6× schneller' },
    ],
    hardware: [
      { name: 'TPS63900 Buck-Boost', note: '~75 nA Ruhestrom, hält 3,3 V bei jeder Eingangsspannung, für Li-SOCl2 ausgelegt' },
      { name: 'Low-Iq-LDOs', note: '1,5 V und 2,8 V für die Kamera, keine Schaltartefakte' },
      { name: 'Ambiq-AM1805-Timer', note: 'schaltet alles nach Zeitplan ab und wieder an' },
      { name: 'LoRaWAN', note: 'sparsam, große Reichweite, ein offener Standard fürs eigene Netz des Betreibers' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: 'Energie sparen · Software', title: 'Sub-Sampling in der Kamera',
        body: (
          <>
            <p>Der Leser muss bis zu 2 Jahre mit einem Satz Batterien laufen. Der ESP32-S3 ist bei schwerer Arbeit wie der Vektormathematik, die ein neuronales Netz braucht, recht effizient, kommt aber bei Weitem nicht an Nordics nRF-Reihe heran, also habe ich mit den Strategien in diesem Kapitel seinen Energieverbrauch gesenkt. Seine Funkmodule braucht er nur für die erste Konfiguration, deshalb sind sie im Einsatz abgeschaltet.</p>
            <p>Der OV2640 nimmt bis zu 1600 × 1200 auf und hat außerdem Sub-Sampling-Modi mit 800 × 600 (SVGA) und 400 × 296 (CIF).</p>
          </>
        ),
        alt: ['Diagramm des SVGA-Sub-Sampling-Modus des OV2640, das zeigt, welche Pixel übersprungen werden', 'Diagramm des CIF-Sub-Sampling-Modus des OV2640'],
      },
      'pw-modes': {
        eyebrow: 'Aufnahmemodi im Vergleich', title: 'SVGA, der gewählte Modus mit 89 ms',
        body: (
          <>
            <p>Das ist derselbe Zähler in den drei Auflösungen, oben das ganze Bild und unten die Rollen in derselben Vergrößerung. Bei 1600 × 1200 wird jedes Pixel des Sensors ausgelesen, und die Aufnahme dauert 350 ms. Das zählt, denn je kürzer die Kamera an ist, desto weniger Energie verbraucht sie. Bei 400 × 296 dauert die Aufnahme nur 61 ms, aber dann bleiben für die Rollen zu wenige Pixel, um sie zuverlässig zu lesen.</p>
            <p>In meinen Tests bot SVGA die beste Balance aus Qualität und Geschwindigkeit, und bei 800 × 600 verarbeitet das Netz 4× weniger Information als bei 1600 × 1200. Richtige Tests zur Genauigkeit habe ich nicht gemacht, nach meiner Erfahrung hat sie aber kaum gelitten.</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: 'Energie sparen · Software', title: 'PWM-Dimmung der LEDs',
        body: <p>Zuerst hatte ich PWM-Dimmung verworfen, weil der OV2640 einen Rolling Shutter hat, der während der Aus-Phasen des PWM-Signals aufnehmen und Streifen zeigen könnte. In der Praxis zeigte der OV2640 aber keine Streifen, also laufen die LEDs bei 20 kHz mit 50 % Tastgrad. Das spart etwas Strom und bringt eine Helligkeitsregelung mit.</p>,
        alt: ['Eine Aufnahme mit waagerechten Streifen über dem Zifferblatt', 'Eine Aufnahme mit PWM-gedimmten LEDs und ohne Streifen'],
      },
      'pw-grey': {
        eyebrow: 'Energie sparen · Software', title: 'Graustufen in der Kamera',
        body: <p>Der OV2640 wandelt das Bild direkt in der Kamera in Graustufen um und liefert eine etwas kleinere Datei. Die Ersparnis ist minimal oder gleich null, aber es war leicht umzusetzen.</p>,
        alt: ['Der Zähler, von der Kamera in Graustufen aufgenommen', 'Derselbe Zähler in Farbe aufgenommen'],
      },
      'pw-int8': {
        eyebrow: 'Energie sparen · Software', title: 'Vektorbefehle und INT8',
        body: <p>Frühere Builds von DrumNet liefen auf dem ESP32-S3 in voller Float32-Genauigkeit, was langsam und ineffizient war. Der ESP32-S3 hat eingebaute Vektorbefehle, die man über die ESP-NN-Bibliothek nutzt und die mehrere Multiply-and-Accumulate-Operationen (MAC) pro Taktzyklus ausführen. Seit DrumNet auf 8 Bit quantisiert ist, ist die Zeit von der Aufnahme bis zur Vorhersage von 61 s auf 17 s gefallen, etwa 3,6× schneller. Den Effizienzgewinn habe ich nicht richtig gemessen, ich bin mir aber sicher, dass er auch deutlich ist.</p>,
      },
      'pw-hw': {
        eyebrow: 'Energie sparen · Hardware', title: 'Low-Iq-Wandler, ein Timer und LoRaWAN',
        body: (
          <ul>
            <li><b>DC-DC-Wandler mit niedrigem Iq und hohem Wirkungsgrad.</b> Der OV2640 braucht 1,5 V und 2,8 V. Buck-Wandler sind effizienter als LDOs, aber ihr hoher Ruhestrom und das aufwendigere Design kosten Geld und Platz auf der Platine, für fast keinen Gewinn, und sie können Artefakte ins Bild bringen. Also bin ich bei LDOs mit niedrigem Ruhestrom geblieben. Die 3,3-V-Hauptschiene würde auf einen speziellen Buck-Boost-Wandler mit niedrigem Iq (~75 nA) umziehen, den TI TPS63900.</li>
            <li><b>Ultra-Low-Power-Timer-ICs.</b> Ein Timer-IC wie der Ambiq AM1805 kann alle Bauteile abschalten und nach Zeitplan wieder einschalten, auch wenn der Gewinn wohl minimal wäre.</li>
            <li><b>LoRaWAN.</b> Ich habe LoRaWAN wegen des geringen Verbrauchs und der großen Reichweite gewählt, und weil es ein offener Standard ist. Anders als bei Sigfox und NB-IoT kann der Betreiber so das ganze Netz selbst besitzen und betreiben.</li>
          </ul>
        ),
      },
    },
  },

  /* ── Kapitel IX: Kamera (FocusLab.tsx) ── */
  camera: {
    cover: {
      title: 'Kamerawahl', lines: ['Kamera-', 'wahl'],
      contents: ['Zwei OV2640-Linsen', 'Der Fokustest'],
      lede: 'Ich habe zwei OV2640-Linsen an Fokus-Testcharts in 3, 4 und 6 cm Abstand getestet.',
    },
    page: 'Kamerawahl',
    lab: {
      lenses: { '160': '160°‑Linse', '120': '120°‑Linse' },
      charts: { b: 'Chart B (ISO 12233)', a: 'Chart A (von Hand)' },
      cm: '{d} cm',
      lens: 'Linse',
      distance: 'Abstand',
      chart: 'Chart',
      alt: '{lens}°-Linse, Chart {chart} bei {dist} cm, ganzes Bild',
      caption: 'ganzes Bild · {lens}° · {dist} cm',
      chosen: ' · das gewählte Setup',
      parts: { centre: 'Mitte', left: 'links', right: 'rechts' },
      cropAria: 'Ausschnitt {part}',
      notInFrame: 'Nicht im Bild',
      notes: {
        '160': 'Die 160°-Variante stellt nahe Objekte gut scharf, aber ihre Schärfe scheint von der Mitte zur linken Bildseite hin nachzulassen, und nach rechts ist der Effekt längst nicht so stark.',
        '120': 'Die 120°-Variante kann nahe Objekte (Makro) eindeutig nicht gut scharfstellen, und ihre Schärfe lässt gleichmäßig in einem Kegel nach, wie man es von einer Fixfokus-Linse erwartet.',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: 'Kamerawahl', title: 'Eine Makrokamera, breit genug für die Rollen',
        body: (
          <>
            <p>Ich brauchte eine gute Makrokamera, die breit genug war, um aus sehr kurzer Entfernung die volle Breite der Zählerrollen zu erfassen. Kein seriöser Händler hatte etwas, das günstig war und den richtigen Anschluss hatte, also habe ich zwei OV2640-Kameras bei Lazada gekauft, eine mit 160°-Sichtfeld und eine mit 120°-Linse. Als Makrokameras wurden sie nicht verkauft, aber Weitwinkellinsen haben von Natur aus eine sehr kurze Naheinstellgrenze und eine viel größere scheinbare Schärfentiefe.</p>
            <p>Für den Test habe ich mit beiden Kameras bei 3 cm, 4 cm und 6 cm je ein Bild von zwei Fokus-Testcharts gemacht. Chart A habe ich von Hand gezeichnet, und Chart B ist das ISO-12233-Chart von Stephen H. Westin aus Cornell. Jede Kamera lief auf einem übrigen ESP32-S3-Kamerabord mit einem einfachen Web-Applet, das ich mit einem KI-Agenten geschrieben habe. Sie war seitlich an einer Kiste montiert, mit einem Lineal, das von der Linse aus nach vorn lief, während die Charts auf einem verschiebbaren Ständer standen.</p>
          </>
        ),
        alt: 'Die Kiste für den Fokustest mit dem ESP32-Kamerabord an der Seite und einem Lineal auf dem Boden',
      },
      'cam-lab': {
        eyebrow: 'Der Fokustest', title: 'Das gewählte Setup, 160° bei 4 cm',
        body: (
          <>
            <p>Wähl eine Linse, einen Abstand und ein Chart, dann siehst du die ganze Aufnahme, dazu Mitte, links und rechts aus demselben Bild in echten Pixeln. Das sind Fixfokus-Linsen, der Fokus ist also ab Werk fest eingestellt, und ab hier nutze ich die 160°-Variante bei 4 cm.</p>
            <p className="ws-note">Das Chart stand gerade zur Kamera, ohne größere Schrägen oder Dellen, und die 120°-Variante lässt gleichmäßig nach. Der schiefe Fokus der 160°-Variante deutet also auf einen Fertigungsfehler hin, aber ich habe keine Ersatzkameras, um zu testen, ob das stimmt.</p>
          </>
        ),
      },
    },
  },

  /* ── Kapitel X: Prototyp V2 und das Gehäuse ── */
  proto: {
    cover: {
      title: 'Prototyp V2', lines: ['Prototyp', 'V2'],
      contents: ['Ein geschrumpfter Prototyp V1', 'So groß wie ein Dev-Board', 'Gehäuse und Adapter'],
      lede: 'Prototyp V2 ist Prototyp V1, geschrumpft auf die Größe eines Dev-Boards, in einem zweiteiligen Gehäuse, das ohne Werkzeug auskommt.',
    },
    page: 'Prototyp V2',
    enclosurePage: 'Gehäuse',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototyp V2', title: 'Ein geschrumpfter Prototyp V1',
        body: <p>Prototyp V2 ist eine geschrumpfte Version von Prototyp V1. Er passt in engere Stellen und hat mich kleinere Bauteile ausprobieren lassen, etwa das LoRa-Modul Wio-SX1262 von Seeed Studio. Er hat ein eingebautes Batteriemanagement, die Stromversorgung für Kamera und Lüfter, PWM-dimmbare LED-Lichter und ein LoRa-Modul. Die vierlagige Platine habe ich in KiCad entworfen, die Bauteile bei DigiKey bestellt und sie bei JLCPCB fertigen lassen, und die Schaltungen stehen im Bericht.</p>,
        alt: '3D-Render der Oberseite der Platine von Prototyp V2 aus KiCad',
      },
      'v2-size': {
        eyebrow: 'Prototyp V2', title: 'So groß wie ein Dev-Board',
        body: (
          <>
            <p>Ich habe die Platine etwa so groß wie ein typisches ESP32-S3-Dev-Board entworfen, damit sie in ein kleineres Gehäuse passt, das sich für Zähler an engen Stellen eignet.</p>
            <p className="ws-note">Prototyp V2 entstand, bevor ich den Bericht geschrieben habe, und trägt deshalb noch ein paar Entscheidungen in sich, von denen ich inzwischen abgerückt bin. Der Lüfter war für hohe Luftfeuchtigkeit gedacht, die zu Beschlag führen kann, aber er fliegt stattdessen raus, wenn die Ablesungen damit nicht zuverlässig sind, und die Stromversorgung entstand, bevor ich mich für Li-SOCl2-Zellen entschieden habe.</p>
          </>
        ),
        alt: 'Die Platine von Prototyp V2 neben einem ESP32-S3-Entwicklungsboard von fast gleicher Größe',
      },
      'en-all': {
        eyebrow: 'Gehäuse', title: 'Ein Gehäuse ohne Werkzeug und ein zweiteiliger Adapter',
        body: (
          <>
            <p>Das Innengehäuse nimmt die Platine und die Batterien von Prototyp V2 auf. Ich habe die 3D-Datei aus KiCad als Referenz nach Onshape exportiert, die Kamera für mehr Genauigkeit von Hand modelliert und das Gehäuse so entworfen, dass es kein Werkzeug braucht. Seitliche Clips lassen die zwei Hälften zusammenrasten, Nuten und Stifte verhindern, dass sie seitlich verrutschen, Podeste und Pfosten halten die Platine ohne Schrauben, und eine Aussparung lässt das IPEX-Kabel für LoRa bis zum Transceiver durch. Der fertige Druck passte und sah gut aus, aber ich musste ein Loch für die Kamera schneiden, die wegen einer falschen Pinbelegung bei der Bestückung verkehrt herum montiert war.</p>
            <p>Der äußere Adapter besteht aus zwei Teilen. Die untere Hälfte sitzt am Zähler und hält die Kameralinse etwa 4 cm vom Zifferblatt entfernt, den im Kameratest gewählten Fokusabstand, während die viel breitere obere Hälfte Platz lässt, um den Leser an den Rollen auszurichten. So kann ich den Adapter an anderen Zählern wiederverwenden und muss nur die untere Hälfte neu entwerfen. Die Laschen, die den Deckel des Zählers verriegeln, hatte ich vergessen, also habe ich ihnen mit ein paar Schnitten mit dem Seitenschneider Platz gemacht.</p>
          </>
        ),
        figures: [
          { alt: 'Das 3D-Modell der Platine aus KiCad mit aufmodellierter Kamera, als Referenz in Onshape genutzt', caption: 'der KiCad-Export als Referenz in Onshape' },
          { alt: 'Das fertig gedruckte Innengehäuse mit der Platine darin', caption: 'das gedruckte Innengehäuse' },
          { alt: 'Ein CAD-Schnitt durch den Adapter, der die Kamera etwa 4 cm vor dem Zifferblatt zeigt', caption: 'ein Schnitt durch den Adapter, 4 cm vor dem Zifferblatt' },
          { alt: 'Der fertige Adapter, am Zähler montiert', caption: 'der Adapter am Zähler' },
        ],
      },
    },
  },

  /* ── Kapitel XI: Fazit ── */
  conclusion: {
    cover: {
      title: 'Fazit', lines: ['Fazit'],
      contents: ['Wo das Projekt steht', 'Der Bericht'],
      lede: 'Der Leser liest 56 % der Zählerstände richtig, das Ziel sind 99 %, und in diesem Kapitel geht es darum, was es bräuchte, um die Lücke zu schließen.',
    },
    page: 'Fazit',
    row: {
      eyebrow: 'Fazit', title: 'Wo das Projekt steht',
      body: (
        <>
          <p>Aus Zeitgründen endet das Projekt hier, und viele Probleme müssen noch gelöst werden, bevor es eine brauchbare Lösung sein könnte. Ich habe seinen Energieverbrauch nicht gemessen und es nicht gegen die angepeilten 2 Jahre Laufzeit getestet, und ich glaube nicht, dass Prototyp V2 das in seinem jetzigen Zustand schafft. Es braucht also eine dritte Revision mit sparsameren Bauteilen, bevor es sich lohnt, den Verbrauch zu überwachen. Die Firmware dagegen ist schon nah an der Effizienz, die ich angepeilt habe.</p>
          <p>DrumNet V10 liest 56 % der Zählerstände richtig, weit unter dem Ziel von 99 %. Der größte Engpass ist WindowNet, denn die meisten falschen Zählerstände kamen daher, dass es die richtige ROI nicht gefunden hat. Die Leser zeigen auch Anzeichen von zu wenig Training, und ein Zähler, den sie noch nicht gesehen haben, bekommt eine niedrige Konfidenz, weil im Datensatz die 9 Zähler dominierten, die SimGen2 erzeugen konnte. Ein größerer und vielfältigerer Datensatz könnte also bei beidem helfen. Das Gehäuse ist für einen echten Einsatz viel zu klobig, vor allem wegen der Höhe der Kamera, also brauche ich eine flachere Kamera, die Makro besser kann, und für Wetterfestigkeit braucht es andere Materialien und Designs.</p>
          <p className="ws-note">Vieles an diesem Projekt war mein erster Versuch mit etwas Neuem, und auch wenn ich mit dem Ergebnis nicht gerade zufrieden bin, bin ich stolz auf das Wissen und die Erfahrung, die ich gewonnen habe. Und ich bin dankbar für die seltene Chance, mit so viel Zeit, Ressourcen und Unterstützung so zu lernen und zu experimentieren, wie ich es tue. Danke an Herrn Alex Oh (NYP) für seine Anleitung, sein Fachwissen und seine Ermutigung, an Herrn Soh (NYP), ohne den ich die Kamera nicht zum Laufen gebracht hätte, und an Herrn Lee Chang Fatt (NYP) für das LoRaWAN-Gateway.</p>
        </>
      ),
    },
    figures: [
      { value: '56 %', label: 'ganze Pipeline', note: '808 von 1.440 Zählerständen richtig' },
      { value: '99 %', label: 'das Ziel', note: 'der ganze Zählerstand richtig' },
      { value: '93,2 %', label: 'nur DrumNet', note: 'gepoolter Testsatz, ohne WindowNet' },
      { value: '2 J.', label: 'Ziel-Laufzeit', note: 'noch nicht gemessen, erst braucht es eine V3-Platine' },
    ],
  },

  /* ── Kapitel XII: der Bericht ── */
  report: {
    title: 'Der Bericht',
    frameTitle: 'Bericht OCR Water Meter Reader (PDF)',
    name: 'OCR Water Meter Reader',
    about: 'Günstige und sparsame kamerabasierte OCR-Lösung zum Ablesen von Wasserzählern. Braven Chiam, NYP, Elektronik und Technische Informatik. 58 Seiten, PDF, 6,8 MB.',
    open: 'Bericht öffnen',
    note: 'Bei der Entwicklung dieses Projekts habe ich KI-Tools stark genutzt. Den Großteil des Berichts habe ich selbst in meinen eigenen Worten geschrieben, bis auf die Einleitung und einige Grafiken, und sonst habe ich KI für Recherche, Diagramme und das Prüfen von Daten genutzt. Auf meiner Skala der KI-Nutzung kommt dieses Projekt auf Level 3.',
  },
};

export default de;
