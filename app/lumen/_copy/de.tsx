import type { LumenCopy } from './en';

/* The LUMEN article's German words, in the shape of en.tsx. */
const de: LumenCopy = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN ist ein Sprachassistent für ein smartes Zimmer, gebaut auf einem ESP32 ohne PSRAM. Das Board hört ein Wake-Word und nimmt mit einem INMP441-Mikrofon auf, ein FastAPI-Relay schickt den Clip über OpenRouter an Whisper und einen DeepSeek-Befehlsparser, und MQTT bringt den Befehl zu den Geräten.',
    ogDescription: 'Ein ESP32-Sprachassistent, der das Wake-Word direkt auf dem Board hört, den Clip über ein FastAPI-Relay an Whisper und einen DeepSeek-Befehlsparser schickt und das Zimmer per MQTT steuert.',
  },
  ld: {
    headline: 'LUMEN, ein ESP32-Sprachassistent',
    description: 'Ein sprachgesteuerter Assistent für ein smartes Zimmer, gebaut für das Modul IoT Programming an der NYP. Ein ESP32 mit MicroPython nimmt die Anfrage auf, ein FastAPI-Relay ruft über OpenRouter Whisper für die Spracherkennung und einen DeepSeek-Befehlsparser auf, und der Befehl geht per MQTT zurück ins Zimmer.',
  },
  hero: {
    alt: 'Coverbild von LUMEN, einem Smart-Home-Assistenten, gebaut mit OpenAI Whisper und DeepSeek',
    back: 'Zu den Projekten',
    tag: 'Schulprojekt',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN ist ein sprachgesteuerter Assistent für ein smartes Zimmer: Du sagst „Hello Robot“ oder hältst einen Knopf gedrückt und sprichst. Ein ESP32 nimmt das Audio auf, ein Server schreibt es ab und lässt ein LLM daraus einen einzigen JSON-Befehl machen, und MQTT bringt diesen Befehl zu Licht, Lüfter, Servo und Summer. Am schwierigsten war es, das alles auf ein Board mit etwa 33 KB freiem RAM zu bekommen.',
    builtWith: 'Gebaut mit',
  },
  chapters: 'Kapitel',
  rail: {
    overview: 'Überblick', try: 'Testen', how: 'Funktionsweise', brain: 'Der Parser', hardware: 'Hardware',
    memory: 'Speicher', auto: 'Automatik', deploy: 'Dashboard', slides: 'Folien', next: 'Nächste Schritte',
  },

  overview: {
    h: 'Überblick',
    p: [
      'LUMEN war mein Miniprojekt für das Modul IoT Programming an der NYP, und die Aufgabe war ganz einfach: ein vernetztes Gerät bauen, das etwas Nützliches tut. Ich wollte sehen, was ein günstiger ESP32 mit echtem Sprachverständnis schafft, statt mit einer festen Liste von Befehlen.',
      'Es wartet auf ein Wake-Word, nimmt auf, was du sagst, und macht daraus Aktionen: „mach das Licht etwas dunkler“, „schalte den Lüfter in zehn Minuten ein“, „stell die Helligkeit auf die Luftfeuchtigkeit“, „gute Nacht“. Die Sprachverarbeitung läuft auf einem kleinen Server, also muss der ESP32 nur Audio aufnehmen und Befehle ausführen.',
    ],
    video: 'Das Wake-Word, ein paar gesprochene Befehle und das Zimmer, das darauf reagiert.',
  },

  try: {
    h: 'Selbst testen',
    p: 'Diese Demo nimmt denselben Weg wie das echte System, nur im Kleinen: von einem Auslöser zu Whisper für die Spracherkennung, dann zu einem DeepSeek-LLM, das den Text in einen einzigen JSON-Befehl übersetzt (beides über OpenRouter), und zum Schluss per MQTT zu den Geräten. Du kannst unten einen Satz auswählen oder die Demo von selbst durchlaufen lassen.',
    note: 'Die Frage nach der Temperatur und der Wunsch nach einem Sandwich zeigen die Leitplanken: Eine Frage wird mit Live-Sensordaten beantwortet, ohne dass etwas passiert, und eine unmögliche Bitte wird abgelehnt. Der ESP32 handelt immer nur nach geprüftem JSON.',
  },

  console: {
    title: 'LUMEN‑Konsole',
    wake: '„Hello Robot“',
    ptt: 'Push‑to‑Talk',
    pipeAria: 'Ablauf der Anfrage',
    stages: ['Auslöser', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: 'Gehört',
    parsed: 'Erkannt',
    quote: '„{said}“',
    idle: 'Sag „Hello Robot“ oder halte den Knopf zum Sprechen.',
    room: 'Zimmer',
    autoOn: 'Automatik an',
    autoOff: 'Automatik aus',
    devices: { white: 'Weiße LED', rgb: 'NeoPixel', fan: 'Lüfter', servo: 'Servo' },
    on: 'an',
    off: 'aus',
    motion: 'Bewegung',
    still: 'ruhig',
    dark: 'dunkel',
    lit: 'hell',
    timer: 'Timer: Licht aus in 10 min',
    play: 'Start',
    pause: 'Pause',
    steps: [
      { said: 'Mach das Licht cyan und den Lüfter eine Sekunde später an.', reply: 'Jetzt cyan, Lüfter in 1 s.' },
      { said: 'Stell die Helligkeit auf die Luftfeuchtigkeit in Prozent.', reply: 'Helligkeit jetzt 69 %.' },
      { said: 'Schalte das Licht in zehn Minuten aus.', reply: 'Licht aus in 10 min.' },
      { said: 'Wie warm ist es hier drin?', reply: 'Hier drin 24,3 °C.' },
      { said: 'Gute Nacht.', reply: 'Gute Nacht.' },
      { said: 'Mach mir ein Sandwich.', reply: 'Das kann ich leider nicht.' },
    ],
  },

  how: {
    h: 'Funktionsweise',
    p1: <><strong>Der ESP32 denkt fast gar nicht nach</strong>, denn er muss nur Audio aufnehmen und Befehle ausführen. Spracherkennung, Sprachmodell und Logging laufen alle auf einem FastAPI-Server in Docker auf meinem Homelab, den das Board über das lokale Netzwerk erreicht.</>,
    p2: <>Ein Auslöser (das Wake-Word „Hello Robot“ oder ersatzweise eine Push-to-Talk-Taste) startet ein INMP441-Mikrofon, das Mono-Audio mit 16&nbsp;kHz aufnimmt. Das Board verpackt es als WAV und streamt es an den Endpunkt <code>/upload</code> des Servers. Der Server nutzt einen einzigen <strong>OpenRouter</strong>-API-Key für beide Schritte: Erst schreibt Whisper das Audio ab, dann macht ein DeepSeek-Modell unter einem strengen System-Prompt aus dem Text einen einzigen JSON-Befehl. Danach prüft er das JSON, veröffentlicht es auf einem MQTT-Topic, das der ESP32 abonniert hat, und hängt jedes Ergebnis mit den geschätzten Kosten pro Anfrage an ein Google Sheet an.</>,
    p3: 'Der Server abonniert außerdem die Status- und Sensor-Topics des Zimmers, speichert die neuesten Werte zwischen und gibt sie dem LLM als Kontext mit. So werden Fragen wie „Wie warm ist es?“ und „Ist der Lüfter an?“ mit echten Messwerten beantwortet.',
    pipelineH: 'Die Sprach-Pipeline',
    steps: [
      <>Du <b>löst</b> es aus, indem du „Hello Robot“ sagst oder die Push-to-Talk-Taste gedrückt hältst.</>,
      <>Das INMP441 <b>nimmt</b> etwa drei Sekunden Mono-Audio mit 16&nbsp;kHz auf, und so lange leuchtet die rote REC-LED.</>,
      <>Das Board <b>verpackt</b> das rohe PCM mit einem 44-Byte-WAV-Header und <b>streamt</b> es noch während der Aufnahme an <code>/upload</code>.</>,
      <>Der Server schickt den Clip an OpenRouter, wo Whisper ihn in Text <b>transkribiert</b>.</>,
      <>Der Server <b>ergänzt Kontext</b>: Er gibt dem Modell das Transkript zusammen mit einem Schnappschuss von Gerätestatus und Sensorwerten.</>,
      <>Ein DeepSeek-Modell, ebenfalls über OpenRouter, <b>parst</b> es in einen einzigen JSON-Befehl. Der Server prüft ihn gegen das Schema und versucht es einmal neu, bevor er auf ein No-op zurückfällt.</>,
      <>Der Server <b>schickt</b> den Befehl per MQTT raus und hängt eine Zeile an das Google Sheet an.</>,
      <>Der ESP32 <b>erledigt</b> den Befehl und zeigt die Antwort auf seinem OLED.</>,
    ],
  },

  flow: {
    stages: [
      { tag: 'Auf dem ESP32', title: 'Auslöser und Mikro', text: 'Ein Wake-Word oder Push-to-Talk startet das INMP441, das Mono-Audio mit 16 kHz aufnimmt.' },
      { tag: 'FastAPI-Server, OpenRouter', title: 'Whisper, DeepSeek und Prüfung', text: 'Whisper macht aus Sprache Text, und ein DeepSeek-Modell parst ihn in einen einzigen JSON-Befehl. Der Server prüft ihn gegen das Schema und versucht es einmal neu, bevor ein No-op kommt.' },
      { tag: 'Im Zimmer', title: 'Geräte und OLED', text: 'LED, RGB, Lüfter, Servo und Summer reagieren, und das OLED zeigt die Antwort.' },
    ],
    links: ['Stream an /upload', 'MQTT-Befehl'],
    caption: 'Der Weg eines Sprachbefehls vom ESP32 über den Server zu den Geräten im Zimmer',
  },

  brain: {
    h: 'Der Befehlsparser',
    p: 'Das Modell steuert nie direkt ein Gerät, sondern wandelt jeden Satz in genau eine von drei JSON-Formen um:',
    shapes: [
      <><b>action</b> ist eine einzelne Änderung, etwa „schalte den Lüfter ein“ oder „mach es cyan“.</>,
      <><b>sequence</b> ist eine Reihe geordneter Schritte, jeder mit einer Verzögerung ab dem Moment, in dem du gesprochen hast, etwa „Licht aus, dann eine Sekunde später den Lüfter aus“.</>,
      <><b>timer</b> ist eine Änderung nach einem Countdown, etwa „Licht aus in zehn Minuten“.</>,
    ],
    p2: 'Es funktioniert auch in anderen Sprachen, weil Whisper viele Sprachen transkribiert und der Parser jede davon auf dasselbe JSON-Vokabular abbildet. Ein Befehl auf Malaiisch oder Mandarin löst dieselbe Aktion aus wie die englische Version.',
    p3: 'Ein langer, strenger System-Prompt legt das Gerätevokabular fest (weiße LED, NeoPixel-RGB, Lüfter, Servo, Summer, Komfortbereich, Automatikmodus), erzwingt gültiges JSON mit Zahlen als Zahlen und lässt das Modell Farbnamen selbst in RGB umrechnen. Der Server prüft jede Antwort gegen ein Schema, und wenn eine durchfällt, versucht er es einmal neu und fällt dann auf ein No-op zurück, statt dem Board etwas zu schicken, dem es nicht trauen kann.',
    p4: <>Das Modell kann auch die Messwerte des Zimmers als Eingabe nutzen. Wenn ich also sage „stell die Helligkeit auf die Luftfeuchtigkeit in Prozent“, liest es die aktuelle Luftfeuchtigkeit aus dem zwischengespeicherten Sensorstatus, rundet sie, begrenzt sie auf den Bereich 0 bis 100 der LED und gibt einen echten <code>set_brightness</code>-Befehl aus.</>,
  },

  chart: {
    aria: 'Ein Flussdiagramm der Befehlsverarbeitung. Whisper transkribiert Sprache in vielen Sprachen, dann gehen der Text und der Live-Sensorkontext an das DeepSeek-LLM. Besteht das ausgegebene JSON die Schemaprüfung nicht, versucht es der Server einmal neu, und ist es dann immer noch ungültig, ist das Ergebnis ein sicheres No-op. Ist es gültig, wird der Befehl nach Typ weitergeleitet: als action für eine einzelne Geräteänderung, als sequence für geordnete Schritte mit Verzögerungen oder als timer für eine Änderung nach einem Countdown.',
    input: { t: 'Transkript und Sensorkontext', s: 'Whisper-Text plus Live-Zimmerstatus aus dem MQTT-Cache' },
    note: { t: 'Mehrsprachige Eingabe', s: 'Whisper kann viele Sprachen' },
    badge: 'Spricht viele Sprachen',
    llm: { t: 'DeepSeek-LLM (über OpenRouter)', s: 'Parst die Anfrage in einen JSON-Befehl' },
    valid: ['JSON-Schema', 'gültig?'],
    validOne: 'JSON-Schema gültig?',
    yes: 'Ja',
    no: 'Nein',
    fails: 'Fehler',
    route: { t: 'Nach Befehlstyp leiten', s: 'action, sequence oder timer' },
    outcomes: ['Eine Geräteänderung', 'Schritte mit Pausen', 'Eine Änderung verzögert'],
    retry: { t: 'Neuer Versuch', s: 'LLM neu fragen', phone: 'Das LLM neu fragen' },
    noop: { t: 'Sicheres No-op', s: 'Antwort ohne Aktion', phone: 'Nur eine Antwort, keine Aktion im Zimmer' },
    ifInvalid: 'wenn ungültig',
    failurePath: 'Fehlerpfad',
    stillFails: 'erneut Fehler',
    ifValid: 'wenn gültig',
    byType: 'nach Typ',
    caption: 'Wie ein Sprachbefehl durch den Parser läuft: Jeder Weg endet als action, sequence, timer oder als Ablehnung, die nichts auslöst',
  },

  prompt: {
    eyebrow: 'Der System-Prompt, den LUMEN dem Modell schickt',
    viewAria: 'Ansicht des Prompts',
    formatted: 'Formatiert',
    code: 'Code',
    more: 'Ganzen Prompt zeigen',
    less: 'Einklappen',
  },

  hardware: {
    h: 'Hardware',
    p1: 'Alles hängt an einem einzigen ESP32-WROOM mit MicroPython, die Eingänge auf der einen Seite und die Ausgänge auf der anderen. Eine nicht blockierende Hauptschleife bedient sie alle, sodass die Erkennung des Auslösers nie hängen bleibt.',
    p2: 'Der LDR ist ein digitales Lichtmodul mit eigenem Potentiometer für die Empfindlichkeit, also gibt es keine analogen Messungen, und das umgeht den Konflikt zwischen dem ADC des ESP32 und dem WLAN. Eine rote LED leuchtet nur, solange das Mikrofon aufnimmt, und ein SSD1306-OLED mit zwei Navigationstasten zeigt auf vier Seiten den Status und den letzten Befehl. Das Wake-Word-Modul DF2301Q ist verkabelt und sein Treiber geschrieben, aber am Labortisch führe ich alles mit der Push-to-Talk-Taste vor.',
    micAlt: 'Nahaufnahme des I2S-Mikrofons INMP441, verkabelt mit dem ESP32',
    micCaption: 'Das I2S-Mikrofon INMP441.',
  },

  hub: {
    aria: 'Ein Verdrahtungsplan mit einem ESP32-WROOM in der Mitte. Links sind die Sensoren und ihre Pins: das INMP441-Mikrofon an I2S (GPIO 14, 23, 32), der DHT22 (GPIO 4), der PIR (GPIO 35), der LDR (GPIO 34) und die Push-to-Talk-Taste (GPIO 19). Rechts sind die Ausgänge: die weiße LED (GPIO 25), der NeoPixel (GPIO 27), der Lüfter (GPIO 26), der Servo (GPIO 13), der Summer (GPIO 33) und die Aufnahme-LED (GPIO 17). Unten trägt der gemeinsame I2C-Bus (SDA 21, SCL 22) das SSD1306-OLED (0x3C) und das Wake-Word-Modul DF2301Q (0x64), und zwei Navigationstasten liegen an GPIO 18 und 16.',
    inputs: 'Sensoren, Eingänge',
    outputs: 'Ausgänge',
    bus: 'I2C-Bus (SDA 21, SCL 22) und UI-Tasten',
    core: { t: 'ESP32', s: ['WROOM, MicroPython', 'eine Non-Blocking-Loop'], phone: 'ESP32-WROOM', phoneS: 'MicroPython, eine nicht blockierende Schleife' },
    parts: {
      mic: { n: 'INMP441-Mikro', s: 'I2S-Mikrofon' },
      dht: { n: 'DHT22', s: 'Temperatur, Feuchte' },
      pir: { n: 'PIR', s: 'Bewegung' },
      ldr: { n: 'LDR-Modul', s: 'hell oder dunkel' },
      ptt: { n: 'PTT-Taste', s: 'Push-to-Talk' },
      led: { n: 'Weiße LED', s: 'PWM-Helligkeit' },
      neo: { n: 'NeoPixel', s: 'WS2812 RGB' },
      fan: { n: 'Lüfter', s: 'an oder aus' },
      servo: { n: 'Servo', s: '0 bis 180°' },
      buzzer: { n: 'Summer', s: 'Pieptöne, Alarme' },
      rec: { n: 'REC-LED', s: 'Aufnahme' },
      oled: { n: 'OLED', s: 'SSD1306, 0x3C' },
      wake: { n: 'DF2301Q', s: 'Wake-Word, 0x64' },
      navA: { n: 'Nav A', s: 'Seite' },
      navB: { n: 'Nav B', s: 'Seite' },
    },
    caption: 'Jedes Bauteil und sein GPIO, wobei sich OLED und DF2301Q einen I2C-Bus teilen',
  },

  memory: {
    h: 'Alles in den Speicher',
    p1: 'Der ESP32-WROOM hat kein PSRAM, und mit aktivem WLAN ließ mir MicroPython etwa 33 KB nutzbaren RAM. Ein Sprachclip ist etwa 96 KB groß, also passt das Audio nicht auf einmal in den Speicher.',
    p2: <>Deshalb hält nie irgendetwas den ganzen Clip. Das Mikrofon ist eine einzige, dauerhafte, vorgewärmte Instanz, die Aufnahmepuffer sind klein und werden erst bei Bedarf angelegt, und der Upload wird schon während der Aufnahme <strong>über einen rohen Socket gestreamt</strong>: erst eine Präambel, dann der WAV-Header, dann das PCM Stück für Stück und zum Schluss ein Abschluss. So bleibt der Spitzenverbrauch beim Hochladen bei etwa 10&nbsp;KB. Baut man stattdessen ein großes <code>bytes</code>-Objekt, holt sich der Garbage Collector einen Block von ~26&nbsp;KB aus demselben Heap, den WLAN und das I2S-Mikrofon brauchen, und der Netzwerkstack verhungert, bis der Upload in ein Timeout läuft.</>,
    p3: <>Die aktuelle Firmware hat auf dem OLED einen schlanken Statusbildschirm mit vier Seiten, denn eine reichere Version mit live aktualisierten Sensorwerten und einem Aufnahme-Splash hat den Heap so weit wachsen lassen, dass das Booten scheiterte. Damit konnte sich das Board nicht mehr mit MQTT verbinden (<code>ENOBUFS</code>) oder das Mikrofon öffnen (<code>ENOMEM</code>). Um Platz zu schaffen, habe ich auch die Echtzeituhr und die Zeitpläne nach Uhrzeit rausgeworfen, also laufen Timer jetzt über einen monotonen Tick-Zähler und brauchen keine Uhr.</>,
  },

  auto: {
    h: 'Automatik',
    p: [
      'Der Automatikmodus läuft lokal auf dem Board. Erkennt er Bewegung, während das Zimmer dunkel ist, schaltet er die weiße LED ein und nach fünf Minuten ohne Bewegung wieder aus. Steigt die Temperatur über den Komfortbereich, schaltet er den Lüfter ein, mit einer Hysterese, damit der Lüfter nicht ständig um die Schwelle herum an- und ausgeht.',
      'Jeder gesprochene Befehl hat Vorrang und setzt den Automatikzustand zurück, sodass der Automatikmodus nie ein Licht überschreibt, das du gerade eingestellt hast.',
    ],
  },

  deploy: {
    h: 'Dashboard und Deployment',
    p: [
      'Der Server ist eine FastAPI-App in Docker mit einem Web-Dashboard: Gerätesteuerung (weiße LED, RGB-Farbwähler, Lüfter, Servo, Summer, Schalter für den Automatikmodus, Editor für den Komfortbereich), eine Live-Statusanzeige, ein Verlaufsdiagramm für Temperatur und Luftfeuchtigkeit, ein Log der letzten Befehle, ein Player für die letzten paar Sprachaufnahmen und ein Textfeld, das in denselben LLM-Pfad führt. Das Textfeld ist mein Backup, falls das Mikrofon bei einer Live-Demo ausfällt, und ein Reset leert Diagramm, Log und Aufnahmen.',
      'Er läuft auf meinem Homelab hinter Nginx Proxy Manager und Cloudflare, die das Dashboard unter einem HTTPS-Hostnamen ausliefern. Der MQTT-Broker wird direkt erreicht statt über Cloudflare, und der ESP32 spricht nur mit einer LAN-Adresse statt mit dem öffentlichen Hostnamen, was die Firmware klein hält.',
    ],
    dashAlt: 'Das Web-Dashboard von LUMEN: Gerätesteuerung, Live-Anzeige, Verlaufsdiagramm und Aktivitätslog',
    dashCaption: 'Das Web-Dashboard von LUMEN',
  },

  slides: {
    h: 'Folien',
    p: 'Das ist die Präsentation, die ich bei der Modulabnahme gezeigt habe. Sie geht durch die Aufgabe, die Pipeline, die Arbeit am Speicher und die Demo.',
    frame: 'Präsentation zum Projekt LUMEN (Figma-Folien)',
  },

  next: {
    h: 'Nächste Schritte',
    p: 'Ein ESP32-S3 mit PSRAM würde das meiste von dem zurückbringen, was ich gestrichen habe, denn der WROOM ist schon am Limit, wenn er Mikrofon-Audio streamt und gleichzeitig WLAN und MQTT laufen.',
    items: [
      <><b>Ein reicheres OLED</b> mit den live aktualisierten Sensorseiten und dem Aufnahme-Splash, die ich entfernen musste.</>,
      <><b>Zeitpläne nach Uhrzeit</b> („jeden Tag um 8&nbsp;Uhr“), die die Echtzeituhr brauchen, die ich zum Speichersparen entfernt habe.</>,
      <><b>Ein dauerhafter Verlauf</b>, damit die Diagramme im Dashboard und die Timer einen Neustart überleben, denn heute liegen die letzten paar Stunden nur im RAM.</>,
      <><b>Ein funktionierendes Wake-Word</b> auf der Hardware, damit Push-to-Talk zur Notlösung wird statt zum Hauptauslöser.</>,
    ],
  },
};

export default de;
