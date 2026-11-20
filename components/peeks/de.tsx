import { usePeekKit, type PeekLabels } from './kit';

/*
  The peek reader in German: a copy of en.tsx with the words translated.
  Image paths and links stay as they are; internal links are localized by the kit.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Haltbarkeits-Tracker', 'proj-ruler': 'Scroll-Lineal', 'proj-cadmouse': '3D-CAD-Maus', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus-Dispenser', 'proj-elecf': 'ELEC-F-Konzept',
  'proj-kauli': 'Kauli-Konzept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Webentwicklung', 'proj-mc': 'Minecraft-Livekarte',
};

export const LABELS: PeekLabels = {
  soon: 'Artikel folgt bald',
  next: 'Weiter: {title}',
  untitled: 'Projekt {n}',
  pullHint: 'Weiterscrollen für {title}',
  pullAria: 'Nächstes Projekt öffnen: {title}',
  end: 'Das sind alle Projekte',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Der Rover von Project June', ['Eigenes Projekt'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 Wochen · Selbst gelernt · 3D-Design · Mobilfunk · WebRTC · MQTT</p>
          <p className="hp-rd-lead">Ein 5G-Rover, den ich in drei Wochen gebaut habe. Er streamt drei Live-Kameras, hat eine komplette Sensorausstattung an Bord und lässt sich mit einem Xbox-Controller von überall fahren, wo es Empfang gibt.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Drei Live-Videostreams', <><p>Drei Kameras streamen live per WebRTC über einen TURN-Server, sodass die Bilder mit wenig Verzögerung durch das NAT im Mobilfunknetz kommen.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Die Kameras von Project June" loading="lazy" /></>)}
          {chapter('02', 'Steuerung und Telemetrie', <p>MQTT überträgt Steuerung und Telemetrie über einen Mosquitto-Broker, mit eigener PWM-Motorsteuerung und Servo-Lenkung, gesteuert von einem Xbox-Controller.</p>)}
          {chapter('03', 'Volle Sensorausstattung', <><p>Der Rover hat ein Neo8M-GPS, ein Gyroskop, einen Beschleunigungssensor, ein Magnetometer, ein Barometer, einen Ultraschall-Abstandssensor, einen DHT11 und einen TEMT6000-Lichtsensor an Bord.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="Die Systemarchitektur von Project June" loading="lazy" /></>)}
          {cta('Das ganze Baulog', 'Im Artikel findest du die Fotos, die Architektur und jedes Problem, auf das ich gestoßen bin.', 'Ganzen Artikel lesen', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, ein cyanfarbenes Schreibtisch-Haustier, auf dem M5Stack Tab5', ['Praktikumsprojekt'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 Woche · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">Ein Schreibtisch-Haustier auf einem M5Stack Tab5, dessen Gehirn der DeepSeek Harness auf meinem Server ist. So kann es einen Browser steuern, eigene Apps bauen und meine anderen Agenten im Blick behalten.</p>
          {chapter('01', 'Ein Haustier, das zeigt, was es tut', <><p>Pip schläft, wenn du es in Ruhe lässt, wacht auf, wenn du das Tablet hochnimmst, windet sich und reibt sich die Schläfen, während es nachdenkt, und hüpft, wenn etwas klappt. Außerdem spielt es jedes Werkzeug vor, das es benutzt, und greift zum Fernglas, um eine Seite zu lesen, oder zum Megafon, um einem Helfer etwas aufzutragen.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip mit Lupe, Fernglas, Megafon und Papierflieger" loading="lazy" /></>)}
          {chapter('02', 'Es nutzt den Bildschirm', <p>Antworten kommen als Seiten und formatierter Text, und Pip kann sich mit seinem eigenen Cursor durch diese Seiten klicken oder mir Multiple-Choice-Fragen stellen. Außerdem baut es kleine Apps, die es in einer Schublade aufbewahrt, entweder Webseiten von meinem Server oder Lua-Skripte, die direkt auf dem Tablet laufen.</p>)}
          {chapter('03', 'Zentrale für meine Agenten', <><p>Pip läuft im selben Harness wie meine Coding-Sessions, gibt lange Aufgaben an Helfer-Pips ab und sagt mir Bescheid, wenn eine Session fertig ist oder eine Antwort braucht.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Helfer-Pips bei der Arbeit mit Notizblock, Laptop, Bauklötzen, einem Buch und einem Kolben" loading="lazy" /></>)}
          {cta('Pip in Bewegung', 'Der Artikel zeigt seine Stimmungen, Apps und Desktops und wie alles zusammenhängt.', 'Ganzen Artikel lesen', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('Der Haltbarkeits-Tracker, ein CoreS3 SE auf dem QRCode-Modul', ['Praktikumsprojekt'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Haltbarkeits-Tracker</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">Ein Tracker fürs Ablaufdatum an der Kühlschranktür. Du scannst den Barcode eines Produkts und wählst, wann es abläuft, und der Bildschirm zeigt immer, was du zuerst essen solltest.</p>
          {chapter('01', 'Scannen, dann speichern', <><p>Der Bildschirm leuchtet rot, während der Scanner nach einem Code sucht, dann zeigt er Name, Marke und Foto des Produkts aus Open Food Facts oder GS1 China, und du stellst das Ablaufdatum mit den Auswahlfeldern für Tage, Wochen und Monate ein, bevor du speicherst.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="Die Auswahl für das Ablaufdatum auf dem Tracker" loading="lazy" /></>)}
          {chapter('02', 'Was zuerst weg muss', <><p>Der Startbildschirm sortiert die Vorräte nach Ablaufdatum und färbt die Anzeige rot, wenn nur noch ein Tag bleibt, und gelb, wenn es weniger als eine Woche ist. Scannst du etwas, das schon auf der Liste steht, öffnet es sich, statt doppelt eingetragen zu werden.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="Der Startbildschirm, sortiert nach Ablaufdatum" loading="lazy" /></>)}
          {chapter('03', 'Den Rest macht ein Server', <p>Ein Docker-Container im Heimnetz führt die Liste, schlägt Barcodes nach, stellt eine Webseite zum Verwalten der Vorräte bereit und meldet jeden Vorrat per MQTT an Home Assistant, damit es Erinnerungen gibt.</p>)}
          {cta('Probier den Tracker', 'Im Artikel gibt es eine funktionierende Kopie seines Bildschirms, das Demovideo und eine Anleitung zum Nachbauen.', 'Ganzen Artikel lesen', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('Das Scroll-Lineal, ein AtomS3R mit angesteckter Unit Scroll', ['Praktikumsprojekt'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Scroll-Lineal</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">Ein digitales Lineal. Du drückst das Rad der Unit Scroll nach unten und rollst es an dem entlang, was du messen willst, und der AtomS3R zeigt die Strecke in Zentimetern an.</p>
          {chapter('01', 'Einmal kalibrieren', <><p>Beim ersten Start rollst du genau 10 cm an einem echten Lineal entlang und tippst auf den Bildschirm, um die gezählten Schritte zu speichern. So lernt es, wie weit sich das Rad pro Schritt bewegt. Die Kalibrierung bleibt danach im Flash.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="Das Lineal zeigt 8,2 cm an" loading="lazy" /></>)}
          {chapter('02', 'Rollen und messen', <p>Die Strecke zählt nur, solange das Rad gedrückt ist und die LED grün leuchtet, sodass du es anheben und wieder aufsetzen kannst, ohne den Wert zu verlieren. Ein Tipp auf den Bildschirm setzt ihn auf null, und langes Drücken startet eine neue Kalibrierung.</p>)}
          {chapter('03', 'Getestet ohne Gerät', <p>Die Rechnung für Kalibrierung und Strecke steckt in einer Datei ohne Hardware-Code, sodass elf Unit-Tests sie auf einem Computer prüfen, bevor die Firmware auf den AtomS3R kommt.</p>)}
          {cta('Roll selbst', 'Im Artikel gibt es eine funktionierende Kopie des Lineals, das Demovideo und eine Anleitung zum Flashen.', 'Ganzen Artikel lesen', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan mit vier Unit-ToF4M-Abstandssensoren auf dem Kopf', ['Praktikumsprojekt'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · vier Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">Ein improvisiertes LiDAR. Stack-chan schwenkt mit seinen zwei Servos vier Abstandssensoren durch den Raum, seine Kamera färbt die Punkte ein, und jeder Browser im selben WLAN zeigt den Scan in 3D.</p>
          {chapter('01', 'Der Schwenk', <><p>Der Kopf arbeitet sich Reihe für Reihe durch ein Raster, von waagerecht bis senkrecht nach oben und bis zu 256 Grad zur Seite, und jede Stellung wird zu einem Messpunkt: eine Richtung von den Servos und ein Abstand von den Sensoren.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="Der fertige Scan einer Zimmerecke in den Farben der Kamera" loading="lazy" /></>)}
          {chapter('02', 'Vier Sensoren, ein Wert', <p>Die vier Sensoren zeigen in dieselbe Richtung, also behält jeder Messpunkt den Median ihrer Werte, was einen Ausreißer rauswirft.</p>)}
          {chapter('03', 'Farbe von der Kamera', <p>Fotos, die vor dem Schwenk aufgenommen werden, färben die Punkte ein, und der Browser schiebt jedes Pixel auf den gemessenen Abstand hinaus, was in diesem Scan 68.206 farbige Punkte ergab.</p>)}
          {cta('Erkunde den Scan', 'Im Artikel gibt es den echten Scan in 3D, den Demofilm und eine Anleitung zum Flashen.', 'Ganzen Artikel lesen', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('Die M5Stack Capsule v1.1, die als 3D-Maus dient', ['Praktikumsprojekt'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D-CAD-Maus</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Eine kabellose 3D-Maus für Onshape. Du drückst die Taste der Capsule und drehst sie in der Hand, und das Modell auf dem Bildschirm dreht sich mit.</p>
          {chapter('01', 'Getarnt als SpaceMouse', <p>Onshape hört nur über den Treiber von 3Dconnexion auf eine 3D-Maus, also gibt sich die Capsule per Bluetooth als deren SpaceMouse Wireless aus, und den Rest erledigt der Treiber.</p>)}
          {chapter('02', 'Sie folgt deiner Hand', <><p>Sie schickt über ihr Gyroskop, wie schnell sich deine Hand dreht, sodass sich das Modell um denselben Winkel dreht wie deine Hand. Hältst du die Taste gedrückt, wird stattdessen verschoben, und Verdrehen zoomt.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Ein Gehäuse in Onshape mit der Capsule drehen" loading="lazy" /></>)}
          {chapter('03', 'Getestet ohne Gerät', <p>Die Bewegungsrechnung und die Tastengesten stecken in einer Bibliothek ohne Hardware-Code, sodass 19 Unit-Tests sie vor jedem Flashen auf einem Computer prüfen.</p>)}
          {cta('Dreh selbst', 'Im Artikel gibt es eine funktionierende Kopie der Steuerung, das Demovideo und eine Anleitung zum Nachbauen.', 'Ganzen Artikel lesen', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Eigenes Projekt'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 Monate · Selbst gelernt · 3D-Design · Platinendesign</p>
          <p className="hp-rd-lead">Zwei ESP32-Messenger zum In-der-Hand-Halten, die ohne Netz miteinander sprechen: Text über LoRa mit großer Reichweite und Zwei-Wege-Sprache über ESP-NOW.</p>
          {chapter('01', 'Zwei Funkwege, zwei Aufgaben', <><p>LoRa trägt Text über große Distanzen, während ESP-NOW Zwei-Wege-Sprache mit wenig Verzögerung überträgt, und beide Handgeräte habe ich in PlatformIO mit dem Arduino-Framework programmiert.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="Das Innenleben des LoRA Messenger" loading="lazy" /></>)}
          {chapter('02', 'Eigene Platine, von Hand gelötet', <><p>Ich habe die Platine in KiCAD entworfen und die SMD-Bauteile selbst im Reflow-Verfahren gelötet, und eine TP4056-Schaltung darauf kümmert sich ums Laden.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="Eigene Platine" loading="lazy" /></>)}
          {chapter('03', 'Audio und Gehäuse', <><p>Ein I2S-Mikrofon und ein Lautsprecher übernehmen die Gespräche, und zwei OLED-Displays zeigen Nachrichten und Status an, alles in einem 3D-gedruckten Gehäuse, das ich in Onshape modelliert habe.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D-gedrucktes Gehäuse" loading="lazy" /></>)}
          {cta('So ist er entstanden', 'Der Artikel zeigt die Phase auf dem Steckbrett, die neuen Platinenversionen und was ich gelernt habe.', 'Ganzen Artikel lesen', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('Der Sprachassistent LUMEN', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT-Programmierung · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">Ein sprachgesteuerter Assistent für ein smartes Zimmer, der aufwacht, wenn du &bdquo;Hello Robot&ldquo; sagst. Ein ESP32 nimmt auf, was du danach sagst, ein FastAPI-Relay transkribiert es und lässt ein LLM daraus einen einzigen strikten JSON-Befehl machen, und dieser Befehl geht per MQTT zurück in den Raum.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'Von Sprache zu einem JSON-Befehl', <p>Der ESP32 streamt 16&nbsp;kHz-Audio an den Server, wo Whisper es über OpenRouter transkribiert und ein DeepSeek-LLM daraus genau einen Befehl macht (eine Aktion, eine Abfolge oder einen Timer), der gegen ein Schema geprüft wird, bevor er das Board erreicht.</p>)}
          {chapter('02', 'Passend für ein Board ohne PSRAM', <><p>Der WROOM hatte mit aktivem WLAN etwa 33&nbsp;KB freien RAM, während ein Sprachclip rund 96&nbsp;KB groß ist. Also wird das Audio schon während der Aufnahme über einen rohen Socket gestreamt, statt im Speicher zu liegen, und der Spitzenverbrauch beim Hochladen bleibt bei etwa 10&nbsp;KB.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="Das INMP441-Mikrofon, verkabelt mit dem ESP32" loading="lazy" /></>)}
          {chapter('03', 'Ein Raum, mit dem du sprichst', <><p>Lampen, ein NeoPixel, ein Ventilator, ein Servo und ein Summer reagieren auf Befehle, und es gibt auch einen lokalen Automatikmodus und ein Web-Dashboard. Sagst du &bdquo;Stell die Helligkeit auf die Luftfeuchtigkeit&ldquo;, liest es den Sensor live aus und macht genau das.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="Das Web-Dashboard von LUMEN" loading="lazy" /></>)}
          {cta('Der ganze Build', 'Der Artikel zeigt die Speichergrenzen, die Verkabelung und eine interaktive Demo.', 'Ganzen Artikel lesen', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('OCR Reader mit DrumNet: eine komplett vertikal integrierte OCR-Lösung für Wasserzähler', ['Eigenes Projekt'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">Eine günstige, akkubetriebene Kamera, die auf einen mechanischen Wasserzähler gesetzt wird und die Zählrollen mit einem neuronalen Netz mit 693K Parametern abliest, das komplett auf einem ESP32-S3 läuft. Die Zahl schickt sie dann per LoRaWAN nach Hause.</p>
          {chapter('01', 'DrumNet auf dem Chip', <><p>Ein Spotter findet das Ziffernfenster, ein Refiner bestimmt seine Ränder genau, indem er Spalten und Zeilen der Feature-Maps mittelt, und drei Reader stimmen über jede Rolle ab, mit angewandter Übertragsregel. Das ganze Netz läuft in INT8 und braucht etwa 2 Sekunden pro Ablesung.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="Die Abstimmung des DrumNet-Ensembles und die Ablesung" loading="lazy" /></>)}
          {chapter('02', 'Trainiert von sechs Agenten', <><p>MeterSim rendert beschriftete Zähler, und SimGen2 lässt sie wie Kamerafotos aussehen, während sechs KI-Agenten sich über einen Buchungsplaner an der GPU und dem Jetson-Rig abwechselten, rund um die Uhr über Tailscale und T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="Die neun Zählerdesigns in MeterSim" loading="lazy" /></>)}
          {chapter('03', 'Platine, Gehäuse, 9 Stunden Reflow', <><p>Die vierlagige KiCad-Platine bringt Akkumanagement, LoRa und PWM-LEDs mit. Ich habe sie von Hand bestückt, unter dem Mikroskop debuggt und in ein werkzeugloses, 3D-gedrucktes Gehäuse mit Zähleradapter gesetzt.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="3D-Render der Platine von Prototype V2" loading="lazy" /></>)}
          {cta('Die ganze Pipeline', 'Der Artikel geht den DrumNet-Durchlauf Schritt für Schritt durch, mit einer 3D-Tour über die Platine, einem ConfigKing-Simulator und dem vollständigen Bericht.', 'Ganzen Artikel lesen', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader, eine private Lese-App für Bücher', ['Eigenes Projekt'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Web-App · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Selbst gelernt</p>
          <p className="hp-rd-lead">Eine kleine, private Online-Lese-App für eine Handvoll Freunde, die sich mit einem einzigen Zugangscode anmelden. Die App merkt sich genau, wo du aufgehört hast, zeigt, wer sonst gerade liest, und verfolgt den Fortschritt aller.</p>
          {chapter('01', 'Eine Bibliothek, die dich kennt', <><p>Wenn du ein Buch öffnest, springt es genau zum Kapitel und zur Scrollposition zurück. Die wird als Bruchteil gespeichert, damit sie auch nach einer Änderung der Schriftgröße noch passt, und Farbe, Schrift und Layout jedes Lesers werden ebenfalls gespeichert.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="Die Leseansicht" loading="lazy" /></>)}
          {chapter('02', 'Gemeinsam lesen', <><p>Du siehst, wer online ist, erkennst Freunde im selben Buch an ihrem grünen Ring und ihrer Kapitelnummer und kannst ihnen ein Winken oder eine kurze Notiz schicken, die wieder verschwindet.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Anwesenheit und kurze Nachrichten" loading="lazy" /></>)}
          {chapter('03', 'Eine Sperre in SQL', <p>Explizite Kapitel werden direkt in der Datenbankabfrage gesperrt, sodass gesperrter Text den Server nie verlässt, wenn ein Leser keinen Zugang hat. Dasselbe Kapitel kann für jeden Leser anders aussehen, und der Cal-Modus entfernt es ganz.</p>)}
          {cta('Der ganze Build', 'Der Artikel zeigt die Anwesenheit, die Inhaltssperre, Webtoons und den Stack.', 'Ganzen Artikel lesen', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA Smart Home System', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA Smart Home System</h2>
          <p className="hp-md-meta">3 Monate · Gruppenprojekt in der Schule · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">Ein Smart Home, das mein fünfköpfiges Team für ein Modul über nachhaltiges Wohnen gebaut hat und das mit A bewertet wurde. Vier BeagleBone-Knoten melden an einen SocketIO-Server, auf dem ein Live-3D-Dashboard läuft.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Vier Knoten, je eine Aufgabe', <><p>Die vier Knoten kümmern sich um Klima, Bad, Küche (Energie des Kühlschranks und ein Feueralarm) und Einbruch, und jedes BeagleBone Black Wireless trägt MikroBUS-Sensormodule.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="Die Hardware des Küchenknotens" loading="lazy" /></>)}
          {chapter('02', 'Ein Server für alle', <><p>Jeder Knoten verbindet sich mit einem SocketIO-Webserver, der das Dashboard hostet und den Feueralarm auf allen Knoten gleichzeitig auslöst.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="Wie die Teile des Systems verbunden sind" loading="lazy" /></>)}
          {chapter('03', 'Ein Live-3D-Dashboard', <><p>Das Dashboard zeigt Live-Daten auf einem 3D-Modell des Hauses in Spline, und seine Oberfläche habe ich in Figma gestaltet.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="Das 3D-Dashboard von EMA" loading="lazy" /></>)}
          {cta('Ausprobieren oder nachlesen', 'Es gibt eine Live-Demo des Dashboards und den kompletten Projektartikel.', 'Live-Demo', 'https://csdpdemo.chiambucket.com', { label: 'Artikel lesen', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus-Dispenser', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus-Dispenser</h2>
          <p className="hp-md-meta">1 Monat · Erstes Schulprojekt · 3D-Design · PyFirmata</p>
          <p className="hp-rd-lead">Mein erstes Schulprojekt war ein sechsteiliger, 3D-gedruckter Sirupspender, und jedes Teil passte beim ersten Druck.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Was er kann', <><p>Er schenkt drei Bechergrößen aus, wacht auf, wenn jemand herankommt, und hat eine Servoklappe und eine helle Power-LED, die den Becher beleuchtet.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Das Pandus-Modell in Onshape" loading="lazy" /></>)}
          {chapter('02', 'Steuerung und Bauteile', <><p>Ein Arduino Uno R3, angesteuert über PyFirmata, betreibt einen Servo, LEDs, ein Relaisboard, Tasten, eine DC-Pumpe und ein Infrarot-Modul zur Hinderniserkennung.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Das Flussdiagramm von Pandus" loading="lazy" /></>)}
          {cta('Der ganze Build', 'Der Artikel zeigt die Teile, die Flussdiagramme und das Onshape-Modell.', 'Ganzen Artikel lesen', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F, ein sicheres Kühlraumsystem', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F-Konzept</h2>
          <p className="hp-md-meta">Sicheres Kühlraumsystem · 4er-Team · Ingenieurkurs · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">Ein Sicherheitssystem für Tiefkühlräume, das mein Team und ich für einen Ingenieurkurs entworfen haben. Begehbare Tiefkühlräume in Fabriken können Leute einsperren, die darin arbeiten, also überwacht ELEC-F die Tür und den Raum und schlägt Alarm, bevor die Kälte gefährlich wird.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Das Problem', <><p>Defekte Riegel, festgefrorene Dichtungen oder einfach Unachtsamkeit können dazu führen, dass jemand in einem begehbaren Tiefkühlraum eingeschlossen wird, wo schnell eine Unterkühlung droht. ELEC-F soll diese Zeit verkürzen und der eingeschlossenen Person Sicherheit geben.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="Der Kühlraum-Prototyp von ELEC-F" loading="lazy" /></>)}
          {chapter('02', 'So funktioniert es', <><p>Ein ToF-Sensor erkennt, ob die Tür offen oder zu ist, und ein PIR-Sensor prüft, ob noch jemand drin ist. Geht die Tür mit einer Person darin zu, startet ein Timer, und wenn er abläuft, blinkt die RGB-Einheit und der Summer ertönt.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="ELEC-F im scharfen Zustand auf dem M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Gebaut mit M5Stack', <><p>Zwei M5Stack-Fire-Controller und ein Mini Hub verbinden die ToF-, PIR- und RGB-Einheiten. Wir haben sie gewählt, weil sie auch bei den Minusgraden weiterlaufen, die ein Tiefkühlraum mit sich bringt.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="Der M5Stack-Controller, verkabelt mit seinen Sensoren" loading="lazy" /></>)}
          {cta('Das ganze Konzept', 'Der Artikel zeigt die Recherche, den Bau und eine interaktive Tour.', 'Ganzen Artikel lesen', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli-Konzept', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli-Konzept</h2>
          <p className="hp-md-meta">Konzept · Kommunikation · 3D in Blender</p>
          <p className="hp-rd-lead">Ein eigenes Produktkonzept, das ich für ein Projekt zu Kommunikationsfähigkeiten entwickelt und gepitcht habe, präsentiert mit 3D-Szenen aus Blender.</p>
          {chapter('01', 'Von der Idee zur Präsentation', <><p>Bei der Aufgabe ging es darum, eine Idee gut zu vermitteln und nicht nur eine zu haben. Also habe ich das Konzept entworfen, in Blender gerendert und die Präsentation so gebaut, dass das Publikum sie klar versteht.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Render des Kauli-Konzepts" loading="lazy" /></>)}
          {soon('Kauli-Konzept', 'Die Renders und der Pitch bekommen noch einen ausführlichen Artikel.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Eigenes Projekt'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Privat · 3D-Design · Ultraleicht 20 g</p>
          <p className="hp-rd-lead">Meine eigene Version der beliebten ZeroMouse, eine ultraleichte Gaming-Maus mit 20 g, die ich von Grund auf entworfen habe, um in FPS-Spielen ein bisschen besser zu spielen.</p>
          {chapter('01', 'Design auf das Gramm', <p>Jedes Teil des Gehäuses habe ich so modelliert, dass es Gewicht spart, ohne an Steifigkeit zu verlieren, immer abgewogen zwischen bequemem Griff und dem Ziel von etwa 20 Gramm.</p>)}
          {soon('Series One Light', 'Das Modell und seine Kompromisse bekommen noch einen ausführlichen Artikel.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Die Platine Copy Board', ['Eigenes Projekt'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Privat · Platinendesign · KiCAD · 1 Woche</p>
          <p className="hp-rd-lead">Ein Nachbau des ATMega328-Dev-Boards der NYP in KiCAD, von Grund auf, damit ich eine eigene Kopie hatte, um zu Hause damit zu arbeiten.</p>
          {chapter('01', 'Erst analysiert, dann nachgebaut', <p>Ich habe das Schulboard anhand seines Schaltplans in KiCAD nachgebaut, und weil einige Teile nicht mehr hergestellt wurden, habe ich Ersatz besorgt. Danach war das Board mein erster richtiger Versuch mit Reflow-Löten.</p>)}
          {soon('Copy Board', 'Die Teilesuche, das Layout und das Reflow-Löten bekommen noch einen ausführlichen Artikel.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Projekt in Webentwicklung', ['Schulprojekt'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Projekt in Webentwicklung</h2>
          <p className="hp-md-meta">Schule · HTML &amp; CSS · Erste Website</p>
          <p className="hp-rd-lead">Die erste voll funktionsfähige Website, die ich gebaut habe, in HTML und CSS, als Abschlussaufgabe in meinem Kurs für Webentwicklung. Diese Seite hier war mein zweiter Versuch.</p>
          {chapter('01', 'Wo alles anfing', <p>Damit habe ich angefangen, fürs Web zu bauen, und man sieht, wie weit meine Arbeit seitdem gekommen ist.</p>)}
          {soon('Wo alles begann', 'Die Seite ist immer noch online.', { label: 'Live-Demo', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft-Livekarte', ['Eigenes Projekt'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft-Livekarte</h2>
          <p className="hp-md-meta">Privat · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">Ein selbst gehosteter Minecraft-Server auf dem Homelab, mit einer Live-Webkarte der Multiplayer-Welt, auf der jeder in Echtzeit herumscrollen kann.</p>
          {chapter('01', 'Server und Karte', <p>Ein Paper-Server läuft in Docker, und das Plugin Dynmap erzeugt eine interaktive Live-Karte, die sich aktualisiert, während Spieler erkunden und bauen.</p>)}
          {soon('Die Welt live erkunden', 'Die Live-Karte ist für alle offen.', { label: 'Live-Karte öffnen', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
