import type { PantryCopy } from './en';

/* The Pantry Expiry Tracker article's German words, in the shape of en.tsx.
   The simulator's screen keeps the firmware's own English labels (SCAN NOW, SAVE, Pantry...). */
const de: PantryCopy = {
  meta: {
    title: 'Haltbarkeits-Tracker | Braven Chiam',
    description: 'Ein Tracker fürs Ablaufdatum an der Kühlschranktür, gebaut während meines Praktikums bei M5Stack aus einem M5Stack CoreS3 SE und einem QRCode-Modul. Du scannst einen Barcode und wählst, wann das Produkt abläuft, und der Bildschirm zeigt immer, was du zuerst essen solltest, während ein kleiner Server die Produkte benennt und Erinnerungen an Home Assistant schickt.',
    ogDescription: 'Barcode scannen, Ablaufdatum wählen, und die Kühlschranktür zeigt, was zuerst weg muss.',
  },
  ld: {
    headline: 'Haltbarkeits-Tracker',
    about: ['M5Stack CoreS3 SE', 'ESP32-S3', 'Barcodescanner', 'Home Assistant', 'MQTT', 'Open Food Facts'],
  },
  hero: {
    alt: 'Der Haltbarkeits-Tracker: ein CoreS3 SE auf dem QRCode-Modul und seiner Akkubasis, der Bildschirm leuchtet beim Scannen rot',
    back: 'Zu den Projekten',
    tag: 'Praktikumsprojekt',
    title: <>Haltbarkeits-<em>Tracker</em></>,
    lead: 'Diesen Tracker fürs Ablaufdatum an der Kühlschranktür habe ich während meines Praktikums bei M5Stack gebaut. Du scannst den Barcode eines Produkts und wählst, wann es abläuft, und der Bildschirm zeigt immer, was du zuerst essen solltest, mit Produktnamen auf Chinesisch oder Englisch.',
    builtWith: 'Gebaut mit',
    links: ['GitHub', 'Im M5Stack-Blog', 'Firmware flashen', 'Server‑Downloads'],
    meta: 'Praktikumsprojekt bei M5Stack, November 2026. M5Stack CoreS3 SE, Module13.2 QRCode, C++, Python, Docker, MQTT.',
  },
  chapters: 'Kapitel',
  rail: {
    demo: 'Demo', try: 'Ausprobieren', features: 'Funktionen', scan: 'Produkt scannen', first: 'Was zuerst weg muss',
    again: 'Zum Öffnen neu scannen', swipe: 'Wischen zum Löschen', pantries: 'Mehrere Vorräte', control: 'Kontrollzentrum',
    web: 'Im Browser', ha: 'Home Assistant', how: 'Funktionsweise', hardware: 'Hardware', setup: 'Nachbauen',
  },
  demo: {
    h: 'Demo',
    p: 'Das hier habe ich an meinem Schreibtisch gefilmt. Erst scanne ich Produkte von einem Demoblatt auf meinem Laptop und dann eine echte Packung 冰红茶, bevor ich die Packung ein zweites Mal scanne und zu einem zweiten Vorrat wechsle.',
    video: 'Der Tracker im Einsatz: Produkte scannen, eine echte Packung, sie nochmal scannen und den Vorrat wechseln',
    moments: [
      { label: 'Scannen vom Demoblatt', note: 'Nutella, Coca-Cola und Ritter Sport vom Bildschirm meines Laptops' },
      { label: 'Eine echte Packung', note: 'Eine Packung 冰红茶, benannt von GS1 China' },
      { label: 'Nochmal scannen', note: 'Die gespeicherte Packung öffnet sich, statt doppelt eingetragen zu werden' },
      { label: 'Ein anderer Vorrat', note: 'Wechsel zum Kühlschrank und dort etwas hinzufügen' },
    ],
  },
  try: {
    h: 'Ausprobieren',
    p: <>Das ist eine Kopie vom Bildschirm des Trackers, die dieselben Schritte durchläuft. Tipp auf <b>SCAN NOW</b> und nimm ein Produkt aus dem Regal, das du vor den Scanner hältst, dann stell ein, wann es abläuft, und speicher es. Du kannst auch eine Karte nach links wischen, um sie zu löschen, und scannst du etwas, das schon auf der Liste steht, öffnet es sich stattdessen.</>,
    note: 'Die Barcodes im Regal sind die echten EAN-13-Codes der Produkte, also kann der Tracker selbst sie von dieser Seite scannen.',
  },
  sim: {
    live: {
      home: 'Der Vorrat, {n} Produkte, sortiert nach dem, was zuerst abläuft.',
      scan: 'Scannen. Nimm ein Produkt aus dem Regal und halt es vor den Scanner.',
      entry: '{name}. Stell ein, wann es abläuft, und speicher es dann.',
      detail: '{name}, schon auf der Liste. {days}.',
    },
    list: 'Vorrat',
    card: '{name}, {days}',
    remove: '{name} löschen',
    cancel: 'Abbrechen',
    back: 'Zurück',
    more: { d: 'Mehr Tage', w: 'Mehr Wochen', m: 'Mehr Monate' },
    fewer: { d: 'Weniger Tage', w: 'Weniger Wochen', m: 'Weniger Monate' },
    hintScan: 'Nimm ein Produkt und halt es vor den Scanner',
    hint: 'Tipp ein Produkt an, um es zu scannen',
    scan: '{name} scannen',
    scanSaved: '{name} scannen, schon auf der Liste',
    onList: 'auf der Liste',
    shelf: {
      '5449000000996': 'Coca-Cola', '3256540000698': 'Pains au lait', '6909548500734': '冰红茶',
      '3046920029759': 'Lindt dunkel', '3017620425035': 'Nutella',
    } as Record<string, string>,
    reset: 'Neu starten',
  },
  features: {
    h: 'Funktionen',
    p: 'Der Tracker hängt an der Kühlschranktür, und jeder Bildschirm hier unten ist eine Aufnahme davon.',
  },
  scan: {
    h: 'Produkt scannen',
    alt: 'Die Auswahl fürs Ablaufdatum von 牛奶面包 von Brioche Pasquier, mit Days 0, Weeks 1 und Months 0, eine Woche ab heute, und einem grünen SAVE-Button',
    p1: <>Wenn du auf <b>SCAN NOW</b> tippst und einen Barcode etwa eine Handbreit vor das Scanfenster hältst, leuchtet der Bildschirm rot, während der Scanner nach einem Code sucht. Danach zeigt der Tracker Name, Marke, Größe und Foto des Produkts. Die kommen meistens von Open Food Facts, während Produkte, die in Festlandchina verkauft werden, über ein kostenloses Konto von GS1 China kommen.</>,
    p2: <>Das Ablaufdatum stellst du mit den Pfeilen unter Days, Weeks und Months ein und tippst dann auf <b>SAVE</b>.</>,
  },
  first: {
    h: 'Was zuerst weg muss',
    alt: 'Der Startbildschirm: Prince abgelaufen in Rot, Pesto alla Genovese in 2 Tagen und Skyr in 5 Tagen in Gelb, unten SCAN NOW',
    p: 'Der Startbildschirm listet den Vorrat mit dem nächsten Ablaufdatum ganz oben, und die Anzeige wird rot, wenn nur noch ein Tag bleibt, und gelb, wenn es weniger als eine Woche ist.',
  },
  again: {
    h: 'Zum Öffnen neu scannen',
    alt: 'Die Produktseite für Barilla Pesto alla Genovese: heute hinzugefügt, läuft am Mittwoch, 11.11.2026 ab, 2 Tage, mit einem roten DELETE-Button',
    p: 'Scannst du etwas, das schon auf der Liste steht, öffnet es sich, statt doppelt eingetragen zu werden, und dort kannst du sein Datum prüfen oder es löschen.',
  },
  swipe: {
    h: 'Wischen zum Löschen',
    alt: 'Die Karte von Prince nach links geschoben, darunter ein roter Mülleimer-Button',
    p: 'Wischst du ein Produkt von rechts nach links, erscheint ein roter Mülleimer zum Antippen, und ein Wisch von links nach rechts bringt dich überall zurück.',
  },
  pantries: {
    h: 'Mehrere Vorräte',
    alt: 'Das Vorratsmenü ist offen: Default Pantry mit 6 Produkten, Fridge mit 1 und Create Pantry',
    p: <>Der Button <b>Pantry</b> wechselt zwischen Vorräten wie dem Kühlschrank, dem Gefrierfach oder einem Schrank und kann auch einen neuen anlegen.</>,
  },
  control: {
    h: 'Ein Kontrollzentrum',
    alt: 'Das Kontrollzentrum: ein Schalter für den Piepton, ein Helligkeitsregler, 100 % Akku und Home Assistant verbunden',
    p: 'Der Status-Button oben rechts öffnet den Schalter für den Piepton, die Bildschirmhelligkeit und den Akkustand, und sein Haus-Symbol wird grün, wenn der Tracker mit Home Assistant verbunden ist.',
  },
  web: {
    h: 'Verwalten im Browser',
    p: 'Dieselbe Liste gibt es auch auf einer Webseite, wo du vom Computer oder Handy aus Produkte per Barcode hinzufügen, umbenennen und Vorräte organisieren kannst. Ein kleines Abzeichen neben jedem Namen zeigt, woher er kommt, etwa OFF für Open Food Facts oder GS1 für GS1 China.',
    alt: 'Die Webseite des Vorrats: Tabs für All, Default Pantry und Fridge, ein Formular für Barcode und Datum und die Produkte nach Ablaufdatum sortiert, mit ihren Quellen-Abzeichen',
    caption: 'Die Webseite des Vorrats',
  },
  ha: {
    h: 'Erinnerungen in Home Assistant',
    p: 'Jeder Vorrat erscheint in Home Assistant als eigenes Gerät, mit der Anzahl der Produkte, dem, was bald abläuft, und dem nächsten Produkt, das abläuft. Jedes Scannen, Hinzufügen und Löschen löst außerdem ein Event aus, sodass du darauf eigene Automationen bauen kannst, zum Beispiel eine Erinnerung aufs Handy am Tag, bevor etwas abläuft.',
    alt: 'Drei Geräte in Home Assistant: Pantry Tracker, Default Pantry und Fridge, jeweils mit abgelaufen, läuft bald ab, Anzahl der Produkte und nächstem Ablaufdatum',
    caption: 'Die Vorratsgeräte in Home Assistant',
  },
  how: {
    h: 'Funktionsweise',
    p: 'Der Tracker kümmert sich nur um den Bildschirm und den Scanner, und ein Docker-Container im Heimnetz macht den Rest: Er speichert die Liste, schlägt Barcodes nach, speichert Produktfotos zwischen und meldet alles per MQTT an Home Assistant. So habe ich es aufgeteilt, weil der ESP32-S3 die Anmeldung bei GS1 China nicht schafft und weil eine einzige Liste auf dem Server bedeutet, dass Tracker, Webseite und Home Assistant immer übereinstimmen.',
    overviewAlt: 'Systemübersicht: Der Tracker am Kühlschrank spricht per WLAN mit dem Vorratsserver, der Server schlägt Produkte bei Open Food Facts und GS1 China nach und meldet sie per MQTT an Home Assistant, und jeder Browser kann seine Webseite öffnen',
    overviewCaption: 'Wie die Teile verbunden sind',
    flowAlt: 'Was beim Scannen passiert: Der Barcode wird über UART gelesen, der Server wird gefragt, ob er schon gespeichert ist, das Produkt wird nachgeschlagen und zwischengespeichert, du wählst das Ablaufdatum, das Produkt wird gespeichert und Home Assistant aktualisiert',
    flowCaption: 'Was beim Scannen passiert',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'CoreS3 SE', s: 'betreibt den Tracker, mit Touchscreen und WLAN.' },
      { b: 'Module13.2 QRCode', s: 'liest 1D- und 2D-Barcodes und wird unter den CoreS3 SE gesteckt.' },
      { b: 'Eine Akkubasis', s: 'kommt ganz nach unten, damit er am Kühlschrank ohne Kabel läuft.' },
    ],
    fridgeAlt: 'Der Tracker an einer grauen Kühlschranktür, mit seinem Bildschirm Set me up und einem QR-Code',
    fridgeCaption: 'An der Kühlschranktür, bereit zum Einrichten',
    p: 'Außerdem brauchst du einen Computer, der für den Server immer an bleibt, und Home Assistant, wenn du Erinnerungen willst.',
  },
  setup: {
    h: 'Nachbauen',
    p: 'Alles, was du brauchst, kannst du kostenlos herunterladen: Die Firmware flashst du mit M5Burner, und der Server kommt als Docker-Paket mit seinen Images, sodass beim Installieren nichts von Docker Hub geladen werden muss.',
    steps: [
      <>Schieb am QRCode-Modul den Schnittstellen-Schalter auf UART und stell Nummer 2 in den beiden DIP-Blöcken TX und RX auf an, dann steck die drei Teile aufeinander.</>,
      <>Öffne die <a href="https://burner.m5stack.com/share/firmware/R4VK5Z" target="_blank" rel="noopener">Pantry-Firmware auf M5Burner</a>, schließ den CoreS3 SE per USB-C an und flash sie mit der M5Burner-App.</>,
      <>Lade den Server für den Computer herunter, auf dem er laufen soll, entweder das <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-amd64.tar.gz">Paket für Intel- und AMD-Computer</a> oder das <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-arm64.tar.gz">Paket für Macs mit Apple Silicon und einen Raspberry Pi</a>. Entpack es, setz <code>TZ</code> in <code>docker-compose.yml</code> auf deine Zeitzone und führ <code>./install.sh</code> in diesem Ordner aus.</>,
      <>Schalt den Tracker ein, scann den QR-Code auf seinem Bildschirm mit dem Handy und gib dein WLAN und die Serveradresse ein, zum Beispiel <code>http://192.168.1.20:8080</code>.</>,
      <>Tipp auf <b>SCAN NOW</b> und scann diesen Code einmal. Das stellt die Scan-Engine von USB auf seriell um.</>,
      <>Füg in Home Assistant die MQTT-Integration mit der IP-Adresse des Servers und Port 1883 hinzu.</>,
      <>Für chinesische Barcodes legst du auf der Webseite des Servers unter <b>Settings</b> ein kostenloses Konto bei gds.org.cn an und meldest dich einmal an.</>,
    ],
    hardwareAlt: 'Der Schnittstellen-Schalter auf UART, Schalter 2 in den DIP-Blöcken TX und RX an und der CoreS3 SE auf das Modul und die Akkubasis gesteckt',
    bootAlt: 'Erster Start: Der Tracker öffnet einen Pantry-Hotspot mit QR-Code, das Handy verbindet sich, die Einrichtungsseite nimmt WLAN und Serveradresse entgegen, und der Startbildschirm lädt',
    codeAlt: 'Der Einstellungscode 21424000 für die Scan-Engine, Serial Communication',
    repo: <>Im <a href="https://github.com/New-Kringster/Pantry_tracker_code" target="_blank" rel="noopener">GitHub-Repository</a> steht die ganze Anleitung im README, zusammen mit dem Code für Firmware und Server, falls du beides lieber selbst bauen willst.</>,
    note: 'Produktnamen und Fotos auf dieser Seite stammen von Open Food Facts (CC BY-SA) und GS1 China.',
  },
};
export default de;
