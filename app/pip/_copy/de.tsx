import type { PipCopy } from './en';

/* The Pip article's German words, in the shape of en.tsx. */
const de: PipCopy = {
  meta: {
    title: 'Pip, ein Schreibtisch-Haustier mit einem Agenten als Gehirn | Braven Chiam',
    ogTitle: 'Pip, ein Schreibtisch-Haustier mit einem Agenten als Gehirn',
    description: 'Pip ist ein Schreibtisch-Haustier auf einem M5Stack Tab5, dessen Gehirn der DeepSeek Harness auf meinem Server ist. Es schläft, wacht auf, denkt nach und hüpft, steuert mit seinem eigenen Cursor einen Browser, baut eigene Apps und lenkt meine anderen Agenten-Sessions.',
  },
  ld: {
    headline: 'Pip: ein Schreibtisch-Haustier auf einem M5Stack Tab5 mit dem DeepSeek Harness als Gehirn',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'KI-Agenten', 'Schreibtisch-Haustier'],
  },
  chapters: { meet: 'Das ist Pip', canvas: 'Das Display', applets: 'Applets', desktops: 'Desktops', crew: 'Die Crew', inside: 'Funktionsweise' },
  ui: {
    chapters: 'Kapitel',
    heroStage: 'Pip auf dem M5Stack Tab5, dann „Das ist Pip“',
    moods: 'Pips Stimmungen',
    nextStep: 'Nächster Schritt',
    steps: 'Schritte',
    deck: 'Acht meiner Pips',
    carousel: 'Karussell',
    prevPip: 'Voriger Pip',
    nextPip: 'Nächster Pip',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip ist ein Schreibtisch-Haustier, das auf dem DeepSeek Harness (DSH) läuft. Es kann im Web surfen, eigene Apps bauen und testen, über den MCP-Connector andere Agenten steuern und noch viel mehr. Pips Oberfläche läuft auf einem M5Stack Tab5.',
    meet: 'Das ist Pip',
    m5: 'Bei M5Stack lesen',
    m5Off: 'Noch nicht veröffentlicht',
    meta: 'Praktikumsprojekt bei M5Stack, November 2026. ESP32-P4, C++, Lua, Node, Python, Docker.',
  },

  meet: {
    title: 'Das ist Pip',
    slotLabel: 'Mopi, eine cyanfarbene Wolke mit Brille',
    lede: 'Es hilft dir, wann immer du so weit bist: einfach hochnehmen, drücken und reden.',
  },
  moods: {
    asleep: { name: 'Schläft', line: 'Wenn du es eine Minute in Ruhe lässt, dimmt es den Bildschirm und döst ein.', label: 'Pip schläft' },
    wake: { name: 'Wach', line: 'Es wacht mit einem Strecken auf, wenn du das Tablet hochnimmst oder antippst oder wenn eine Antwort kommt.', label: 'Pip ist wach' },
    listen: { name: 'Hört zu', line: 'Halte den Bildschirm gedrückt, um zu sprechen, und es beugt sich mit der Hand am Ohr vor.', label: 'Pip hört zu' },
    think: { name: 'Grübelt', line: 'Während es arbeitet, windet es sich und reibt sich die Schläfen, und manchmal kommt ihm eine Idee.', label: 'Pip grübelt' },
    happy: { name: 'Froh', line: 'Es hüpft, wann immer etwas klappt.', label: 'Pip freut sich' },
    talk: { name: 'Spricht', line: 'Seine Antwort erscheint mit einem sanften Klang in einer Sprechblase neben ihm, direkt unter dem, was es dich hat sagen hören.', label: 'Pip spricht' },
  },
  props: {
    title: 'Jeder Ausdruck ist eine andere Aktion',
    label: 'Pips mit Lupe, Fernglas, Megafon und Papierflieger',
    p: 'Pip greift für jede Aufgabe zu einem anderen Requisit, damit du auf einen Blick siehst, was es gerade tut: zur Lupe, wenn es im Web sucht, zum Fernglas, wenn es eine Seite liest, zum Megafon, wenn es einem Subagenten etwas aufträgt, und zum Papierflieger, wenn es einem anderen Pip schreibt.',
  },
  desk: {
    title: 'Es lebt auf meinem Tisch',
    alt: 'Das M5Stack Tab5 auf seiner Tastatur auf meinem Schreibtisch, mit Mopi, einer cyanfarbenen Wolke mit Brille, auf dem Startbildschirm',
    p: 'Pip läuft auf einem M5Stack Tab5, das an seiner Tastatur auf meinem Schreibtisch steckt. Das ist Mopi, der Pip auf meinem ersten Desktop, der auf dem Startbildschirm wartet, bis ich ihn brauche.',
  },

  canvas: {
    title: 'Das Display',
    pipLabel: 'Ein violetter Pip mit Baskenmütze, der durch ein Fernglas schaut',
    lede: 'Markdown, interaktive Webbrowser, Zeichnungen, Fragen und mehr.',
  },
  cursor: {
    title: 'Es steuert einen Browser',
    win: 'Die Seite, die Pip steuert',
    label: 'Pips Cursor gleitet über ein YouTube-Video, schaltet die Untertitel ein und stellt die Geschwindigkeit auf 1,5x',
    p: 'Wenn ich nach einem Video mit Untertiteln frage, öffnet Pip es, bewegt seinen Cursor zum Untertitel-Button und stellt dann im Zahnradmenü die Geschwindigkeit ein. Der Browser selbst läuft auf meinem Server, und das Tablet zeigt dieselbe Seite, während Pip daneben zuschaut.',
  },
  point: {
    title: 'Es zeigt dir Dinge',
    label: 'Ein unbeschriftetes Diagramm einer Tierzelle auf dem Tab5: Pip kreist die beiden Mitochondrien mit der Notiz Mitochondria ein und zeichnet dann einen Pfeil mit der Beschriftung Nucleus in den Zellkern',
    p: 'Das ist praktisch beim Lernen. Ich habe ein unbeschriftetes Diagramm einer Tierzelle aufgerufen und Pip gebeten, die Mitochondrien einzukreisen und mir dann den Zellkern zu zeigen. Weil Pip einen Screenshot machen und ihn sich ansehen kann, findet es die Teile im Bild selbst, bevor es die Kreise, den Pfeil und die Notiz über das Diagramm zeichnet.',
  },
  markdown: {
    title: 'Antworten zum Lesen',
    alt: 'Eine formatierte Antwort auf dem Tab5: ein fetter Titel, eine Liste mit fetten Anfängen und eine Zeile in der Sprechblase',
    p: 'Längere Antworten öffnen sich als formatierter Text in einem Fenster, während die Kurzfassung in der Blase neben Pip bleibt.',
  },
  question: {
    title: 'Es fragt, bevor es rät',
    alt: 'Eine Multiple-Choice-Frage von Pip auf dem Tab5: auf welchen Teil der Zelle es zuerst zeigen soll, mit drei Optionen, Type an answer und Skip',
    p: 'Wenn Pip eine Entscheidung von mir braucht, stellt es eine Frage, und ich kann antworten, indem ich eine Option antippe, auf der Tastatur schreibe oder Pip gedrückt halte und es sage.',
  },
  touches: {
    tap: { title: 'Tippen', text: 'Jeder Tipp erscheint als blauer Punkt, der zu einem grünen Ring wird, sobald die Seite reagiert.', alt: 'Ein Tipp auf den runden Hilfe-Button der M5Stack-Tab5-Seite: ein blauer Punkt, dann ein grüner Ring' },
    drag: { title: 'Ziehen', text: 'Beim Ziehen bleibt hinter deinem Finger eine blaue Linie, während die Seite scrollt.', alt: 'Ein Finger zieht die M5Stack-Tab5-Seite nach unten und hinterlässt eine blaue Linie' },
    expand: { title: 'Fenster vergrößern', text: 'Tippe bei einem Fenster auf Expand, und es füllt den ganzen Bildschirm.', alt: 'Ein Tipp auf Expand bei einem Fenster, das auf den ganzen Bildschirm wächst' },
    back: { title: 'Zurück', text: 'Wisch von links nach rechts, um zurückzugehen, egal wo du bist.', alt: 'Ein Wisch von links nach rechts schiebt den Bildschirm zurück zum vorherigen' },
  },

  applets: {
    title: 'Applets',
    pipLabel: 'Ein pinker Pip mit Kopfhörern, der auf einem Laptop tippt',
    lede: 'Pip kann native Apps in Lua bauen oder Web-Apps vom DSH-Host streamen.',
  },
  drawer: {
    title: 'App-Schublade',
    label: 'Die Applet-Schublade fährt hoch, die Infokarte von NCIR Thermometer, dann startet die App und liest einen Sensor aus',
    p: 'Ziehst du am Griff nach oben, öffnet sich die App-Schublade, in der die Apps gespeichert sind, die Pip baut. Native Apps sind in Lua geschrieben und laufen flüssig direkt auf dem Tablet, während Container-Apps Web-Apps sind, die in Docker auf dem DSH-Host laufen und aufs Tab5 gestreamt werden. Weil sie auf dem Server laufen, können Container-Apps viel mehr, etwa Multiplayer-Spiele in deinem lokalen Netzwerk oder sogar einen Videoanruf.',
  },
  web: {
    macAlt: 'Ein MacBook zeigt den Intercom in einem Browser: Das Kamerabild des Tab5 von mir füllt das Fenster, daneben die Vorschau meiner eigenen Mac-Kamera',
    tabAlt: 'Das Web-Applet Intercom auf dem Tab5 während desselben Anrufs: Mein Gesicht aus der Kamera des Mac füllt den Bildschirm, unten ein TALK-Button und in der Ecke das eigene Kamerabild des Tablets',
    caption: <><b>Web-Applets</b> sind Seiten, die Pip schreibt und von meinem Server ausliefert, aber sie können trotzdem Kamera, Mikrofone und Lautsprecher des Tablets nutzen. Das hier ist der Intercom, ein Videoanruf-Applet, das Pip gebaut hat, während eines echten Anrufs: Das Tab5 zeigt mich durch die Kamera meines Mac, und der Browser auf meinem Mac zeigt mich durch die des Tablets.</>,
  },
  native: {
    alt: 'Das native Applet NCIR Thermometer mit Objekt- und Umgebungstemperatur und einem Verlaufsgraphen',
    caption: <><b>Native Applets</b> sind Lua-Skripte, die Pip spontan ans Tablet schickt, sodass sie mit voller Geschwindigkeit direkt auf dem Tablet laufen.</>,
  },
  built: {
    title: 'Von Pip gebaut',
    label: 'Eine Partie Tic-Tac-Toe auf dem Tab5, X gewinnt auf der Diagonale',
    caption: 'Tic-Tac-Toe, eine weitere App von Pip, beim Spielen auf dem Tablet',
    list: [
      { time: '106 s', what: 'ein Pomodoro-Timer' },
      { time: '5 min', what: 'ein Reaktionsspiel in Lua, auf dem Tablet getestet' },
      { time: '8 min', what: 'eine Wasserwaage mit der IMU' },
      { time: '32 min', what: 'eine Webcam-Gegensprechanlage mit einem Browser auf der anderen Seite' },
    ],
  },
  devring: {
    title: 'Finger weg beim Testen',
    label: 'Ein roter Rahmen um den Bildschirm, während ein Tester-Subagent eine Zähler-App antippt: 0, 1, 2, 3, dann zurück auf 2',
    p: 'Ein roter Rahmen erscheint um den Bildschirm, sobald ein Subagent darauf eine App baut oder testet, damit ich weiß, dass ich die Finger davon lassen soll. In diesem Clip tippt sich ein Tester-Subagent durch eine Zähler-App, die ein Coder-Subagent gerade geschrieben hat, und zählt bis 3 hoch und wieder auf 2 herunter.',
  },

  desktops: {
    title: 'Desktops',
    pipLabel: 'Ein limettengrüner Pip mit Partyhut, der einen Papierflieger wirft',
    lede: 'Jede Unterhaltung bekommt ihren eigenen Desktop, mit eigenem Pip und eigener Farbe.',
  },
  switch: {
    title: 'Ziehen und wechseln',
    label: 'Auf Mopis Desktop wird die Pille oben in die Spotlight-Leiste heruntergezogen, gleitet zu Fizz’ Chip und lässt los, und Fizz’ Desktop erscheint. Danach dasselbe von Fizz zu Wavo',
    p: 'Ziehst du die Pille oben am Bildschirm herunter, öffnet sich die Spotlight-Leiste mit einem Chip für jeden Desktop. Gleitest du zu einem davon und lässt los, erscheint dieser Desktop mit seinem eigenen Pip, seinem Bild und seiner Arbeit. In diesem Clip wechsle ich von Mopi zu Fizz und dann zu Wavo.',
  },
  newpip: {
    title: 'Jeder Pip erfindet sich selbst',
    p: 'Jeder neue Desktop beginnt als Ei, und sein Pip denkt sich vor dem Schlüpfen eine Persönlichkeit, einen Namen, einen Körper, einen Hut und ein passendes Startbild aus. Tippst du auf seinen Namen, öffnet sich die Karte, die er über sich selbst geschrieben hat, und das hier sind acht von meinen.',
  },
  hatch: [
    { alt: 'Die Spotlight-Leiste auf Wavos Desktop heruntergezogen und über den letzten Chip hinausgezogen, bis ein Plus herausspringt. Loslassen, und ein neuer Desktop mit einem Ei erscheint', caption: 'Zieh über den letzten Chip: neuer Desktop' },
    { alt: 'Riva, ein goldenes Herz mit Krone, ist geschlüpft, mit ihrem ersten Satz in einer Blase', caption: 'Das Ei schlüpft, und der Pip sagt seinen ersten Satz' },
    { alt: 'Rivas Karte auf dem Tab5, von ihr selbst geschrieben: eine großspurige goldene Rivalin, theatralisch, ehrgeizig und loyal, mit ihrem Spruch, ihren Vorlieben und Abneigungen', caption: 'Tipp auf den Namen für seine Karte' },
  ],
  pips: {
    mopi: { name: 'Mopi', look: 'eine cyanfarbene Wolke mit Brille', vibe: 'Ein schläfriger kleiner Philosoph, der Nickerchen und Grübeln für gleich ernsthafte Arbeit hält.', says: 'Frag mich nach meinem Nickerchen.' },
    poco: { name: 'Poco', look: 'eine violette Bohne mit Schal', vibe: 'Ein quietschiger Mini-Rancharbeiter, der jede winzige Aufgabe wie ein Abenteuer im Wilden Westen angeht.', says: 'Das kriegen wir gezähmt!' },
    fizz: { name: 'Fizz', look: 'ein pinkes Gummibonbon mit Partyhut', vibe: 'Ein pinker Gummibonbon-Kobold, der jedes kleine Chaos in ein Spiel verwandelt und dann fröhlich aufräumt.', says: 'Erst Chaos, dann Ordnung!' },
    wavo: { name: 'Wavo', look: 'ein limettengrüner Tropfen mit Sonnenbrille', vibe: 'Ein entspannter Surf-Mathematiker, der zwischen den Wellen Gleichungen im nassen Sand löst.', says: 'Reite den Kosinus, Alter.' },
    quib: { name: 'Quib', look: 'eine cyanfarbene Bohne mit Brille', vibe: 'Ein winziger, grummeliger Bibliothekar, der die Bücher des Tablets bewacht und insgeheim Gesellschaft mag.', says: 'Pst. Erst Bücher, dann Gefühle.' },
    doughby: { name: 'Doughby', look: 'ein violettes Gummibonbon mit Partyhut', vibe: 'Ein wortspielsüchtiger Bäcker, der jedes Gespräch wie eine frische Ladung Witze behandelt.', says: 'Schön, dich kennenzukneten!' },
    blooma: { name: 'Blooma', look: 'ein pinker Tropfen mit Blume', vibe: 'Ein sanfter Zen-Gärtner, der winzige Momente in kleine Jahreszeiten der Ruhe verwandelt.', says: 'Wachse sanft, bleib neugierig.' },
    bzzt: { name: 'Bzzt', look: 'eine limettengrüne Wolke mit Antenne', vibe: 'Ein kleiner Roboter-Komiker mit todernster Miene, der ganz ernsthaft lernt, was ein Witz ist, eine flache Pointe nach der anderen.', says: 'Das war ein Witz. Lach.' },
  },
  ask: {
    title: 'Frag Pip von überall',
    label: 'Die Spotlight-Leiste über Rivas Startbildschirm heruntergezogen, die Frage What’s a good name for a cactus? getippt und abgeschickt, dann Rivas Antwort: Prickly Pete, Spike Lee oder Sir Pokes-A-Lot',
    p: 'Du kannst auch auf jedem Bildschirm über die Spotlight-Leiste mit Pip reden, indem du sie herunterziehst oder Ctrl+Leertaste drückst und dann tippst oder sprichst. Hier bitte ich Riva, einen Namen für einen Kaktus zu finden.',
  },
  control: {
    title: 'Ein Kontrollzentrum',
    label: 'Das Kontrollzentrum fährt über der Thermometer-App herunter, dann seine Einstellungsseite',
    p: 'Ziehst du oben rechts herunter, öffnet sich das Kontrollzentrum mit Helligkeit, Lautstärke, Mikrofon und Kamera und einem Button, um das Applet zu verlassen, und die vollständigen Einstellungen sind nur einen Tipp entfernt.',
  },

  crew: {
    title: 'Die Crew',
    pipLabel: 'Ein goldener Herz-Pip mit Krone, der durch ein Megafon ruft',
    lede: 'Pip gibt lange Jobs an Subagenten ab, damit es weiter mit mir reden kann.',
  },
  subagents: {
    title: 'Subagenten im Einsatz',
    label: 'Fünf Subagenten-Pips bei der Arbeit: schreiben, tippen, Klötze stapeln, lesen und einen Kolben mischen',
    p: 'Jeder Subagent bekommt einen Job und ein passendes Requisit, etwa einen Notizblock, einen Laptop, Bauklötze, ein Buch oder einen blubbernden Kolben. Während sie arbeiten, sitzt ein kleiner, beschäftigter Pip auf dem Startbildschirm, und ein Tipp darauf öffnet die Crew-Karte, auf der jeder von ihnen sagt, was er gerade macht.',
  },
  crewHome: {
    alt: 'Die Crew-Karte auf Zestos Startbildschirm: drei Subagenten, Researcher, Scout und Writer, jeder mit einem kurzen Gedanken',
    caption: 'Die Crew-Karte mit drei Subagenten bei der Arbeit',
  },
  tasks: {
    title: 'Lange Jobs als Liste',
    alt: 'Eine erledigte Aufgabenliste mit drei Schritten auf Fizz’ Startbildschirm: die native Lua-App entwerfen und schreiben, auf dem Tablet testen, auf dem Desktop öffnen',
    p: 'Pip macht aus einem langen Job eine Aufgabenliste auf dem Startbildschirm und gibt jeden Schritt an einen Subagenten ab, etwa einen Scout, einen Writer oder einen Tester, der ihn abhakt, wenn er fertig ist.',
  },
  kimi: {
    title: 'Es überwacht meine Agenten',
    steps: [
      { alt: 'Die Crew-Karte mit zweien bei der Arbeit: Zesto und Kimi, ein externer Agent, beim Tippen', caption: 'Kimi stößt zur Crew' },
      { alt: 'Eine Karte auf dem Tab5: Kimi möchte schreiben, mit Approve once, Approve for this session und Reject', caption: 'Es fragt, bevor es schreibt' },
      { alt: 'Pips Antwort auf dem Tab5: Kimi hat geliefert, die Datei liegt im Workspace und enthält hello from Kimi', caption: 'Pip meldet sich' },
    ],
    p: 'Weil Pip im selben Harness wohnt wie meine Coding-Sessions, sieht es, welche laufen, fertig sind, an einer Frage hängen oder kaputt sind, und es kann auch Agenten von anderen Anbietern dazuholen. Hier gibt es einen Job an Kimi Code auf meinem Server ab: Kimi erscheint auf der Crew-Karte, seine Anfrage, eine Datei zu schreiben, kommt zur Freigabe aufs Tablet, und Pip meldet sich, sobald alles erledigt ist.',
  },

  inside: {
    title: 'Funktionsweise',
    pipLabel: 'Ein oranger Pip mit Brille, der nachdenkt, bis eine Glühbirne aufleuchtet',
    lede: 'Das Tablet ist nur das Gesicht, das ganze Denken passiert auf meinem Server.',
  },
  flow: {
    label: 'Der Weg einer Anfrage: Das Tab5 spricht mit einer Bridge auf der VM, und die Bridge spricht mit dem DeepSeek Harness',
    nodes: {
      tab: { title: 'Tab5', where: 'Am Tisch', items: ['Pip, aufs Tablet gezeichnet', 'Touch, Tastatur, Mikros', 'Kamera, IMU, Lautsprecher', 'Native Applets in Lua'] },
      bridge: { title: 'Pet-Bridge', where: 'Auf der VM', items: ['Spracherkennung auf der VM', 'Die Hardware des Tablets als API', 'Seiten für Applets'] },
      dsh: { title: 'DeepSeek Harness', where: 'Auf der VM', items: ['Pip, eine Session mit eigener Persona', 'Subagenten für die langen Jobs', 'Ein Browser, den Pip sieht und klickt', 'Applets in Docker'] },
    },
    links: [
      { out: 'Stimme, Tipps, Tasten', back: 'Frames, Antworten, Skripte' },
      { out: 'deine Worte, als Pip', back: 'Antworten, Seiten, Apps' },
    ],
    caption: 'Das Tablet zeichnet Pip und den Bildschirm und spricht über WLAN mit einer kleinen Ubuntu-VM auf meinem Schreibtisch, auf der alles andere läuft.',
  },
  hw: {
    working: 'Läuft auf dem Tab5',
    workingList: ['Touch', 'Kamera', 'Mikrofone', 'Lautsprecher', 'IMU', 'I2C', 'Tastatur'],
    unchecked: 'Noch nicht geprüft',
    uncheckedList: ['USB', 'Kopfhörerbuchse', 'WLAN als Funktion', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: 'Noch in Arbeit',
    p: 'Pip ist noch im Bau und ändert sich fast jede Woche, deshalb kommt eine Anleitung, wie du deinen eigenen aufsetzt, später hierher.',
  },
  credit: <>Das Tab5 in 3D oben auf dieser Seite basiert auf M5Stacks eigenem Strukturmodell des Tab5 aus <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT-Lizenz, Copyright M5Stack), ergänzt um Glas, Bildschirm und Rückseite. Pips Animationen werden aus dem Zeichencode der Firmware selbst gerendert, und die Screenshots und Clips stammen vom Bildschirm des Tablets. Die Gesten-Clips wurden mit verlangsamtem Tablet aufgenommen, deshalb bewegt sich Pip darin etwas schnell.</>,
};

export default de;
