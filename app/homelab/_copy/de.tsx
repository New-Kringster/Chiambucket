import { draft, type Draft } from './draft';
import type { HomelabCopy } from './en';

/* The homelab page's German words, in the shape of en.tsx. */
// a loose cast while drafting: keys English no longer has are ignored by draft()
const de = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Meine Cloud zu Hause wird von KI-Agenten auf braven-agents betrieben, einem Server, der die anderen Rechner, das UniFi-Netzwerk und externe Plattformen wie Cloudflare steuert. Diese Seite zeigt, wie alles zusammenhängt, die Rechner, die Dienste und ihren Live-Status.',
  },
  jsonLd: {
    headline: 'Eine Heimcloud, betrieben von KI-Agenten',
    about: ['Self-Hosting', 'KI-Agenten', 'Infrastrukturautomatisierung', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: 'Details zu {name}',
  close: 'Schließen',

  hero: {
    title: 'Agent-first HomeLab',
    lead: 'Jeder Rechner, jedes Netzwerk und jeder Dienst hier wird von braven-agents betrieben, einem Server, dessen Aufgabe es ist, meine KI-Agenten laufen zu lassen. Sie erreichen alles andere, vom Speicherserver bis zum Router und Cloudflare, also passieren die meisten Änderungen über einen Prompt, ohne dass ich etwas anfassen muss.',
    mapCta: 'Zur Karte',
    machinesCta: 'Zu den Rechnern',
  },

  core: {
    title: 'Alles läuft über braven-agents',
    lead: 'braven-agents hat die Schlüssel zu jedem anderen System, und die Agenten darauf erreichen jedes davon über seine eigene API oder per SSH. Wähle ein System, um zu sehen, was sie dort tun.',
    mapLabel: 'Wie braven-agents mit jedem anderen System verbunden ist',
    coreTag: 'Der Kern',
    coreRole: 'Darauf laufen Claude Code, Codex und OpenCode, dazu Hermes für geplante Jobs, und in T3 Code starte und verfolge ich ihre Arbeit.',
    groups: { machines: 'Rechner', edge: 'Netz und Edge', platforms: 'Plattformen' },
    doesLabel: 'Was die Agenten hier tun',
    planned: 'Geplant',
    proxmoxName: 'Proxmox-Server',
    nodes: {
      newmain: { role: 'Speicher und eigene Dienste', via: 'Unraid API',
        does: ['Docker-Container starten, updaten und neu starten', 'Das Array und den Zustand jeder Festplatte überwachen', 'Shares und virtuelle Maschinen anlegen'] },
      caca: { role: 'Dev-Umgebung für ein geheimes Projekt', via: 'SSH',
        does: ['Das Projekt bauen und testen', 'Seine Tools und Pakete aktuell halten'] },
      servertop: { role: 'Brücke zu meiner iCloud', via: 'SSH',
        does: ['Termine in meinen Kalendern lesen und eintragen', 'Erinnerungen lesen und anlegen', 'Andere iCloud-Aufgaben erledigen, die einen Mac brauchen'] },
      blade: { role: 'GPU-Jobs', via: 'SSH',
        does: ['Trainingsjobs auf der RTX 3080 laufen lassen, wie die Läufe, mit denen DrumNet trainiert wurde', 'Größere Modelle und andere GPU-lastige Arbeit ausführen'] },
      proxmox: { role: 'Virtuelle Maschinen, Hardware noch offen', via: 'Noch inaktiv',
        does: ['Er wird gerade noch zusammengestellt, also läuft darauf noch nichts.'] },
      unifi: { role: 'Das ganze Heimnetz', via: 'UniFi API',
        does: ['Netzwerke und VLANs anlegen', 'Firewallregeln und Portweiterleitungen hinzufügen', 'Verbundene Geräte finden und verwalten'] },
      npm: { role: 'Reverse Proxy für öffentliche Dienste', via: 'NPM API',
        does: ['Für jede neue Subdomain einen Proxy-Host anlegen', 'SSL-Zertifikate ausstellen und erneuern', 'Festlegen, wer einen Dienst erreichen darf'] },
      cloudflare: { role: 'DNS und Edge-Dienste', via: 'Cloudflare API',
        does: ['DNS-Einträge anlegen und ändern', 'Cloudflare Tunnels für neue Apps öffnen', 'Workers deployen und R2-Speicher verwalten'] },
      github: { role: 'Mein Code', via: 'GitHub CLI',
        does: ['Repositories, Branches und Pull Requests anlegen', 'Ihre Änderungen pushen'] },
      vercel: { role: 'Hosting für diese Website', via: 'Vercel API',
        does: ['Previews deployen und prüfen, ob die Builds durchlaufen', 'Diese Website live schalten, wenn ich darum bitte'] },
      shebang: { role: 'Meine Hosting-Plattform', via: 'Shebang MCP',
        does: ['Seiten und Dateien veröffentlichen', 'Einer neuen App eine eigene Datenbank und Anmeldung geben'] },
    },
  },

  prompt: {
    title: 'Vom Prompt zur laufenden App',
    lead: 'Wenn ich etwas Neues will, arbeiten sich die Agenten selbst durch jedes System, das dafür nötig ist. Bitte ich sie zum Beispiel, eine neue App unter einer eigenen chiambucket.com-Adresse online zu stellen, passiert Folgendes:',
    requestLabel: 'Die Anfrage',
    request: 'Stell meine neue Notizen-App unter notes.chiambucket.com online.',
    steps: [
      { at: 'braven-agents', t: 'Ein Agent schreibt die App und ihre Docker-Compose-Datei und testet sie dann.' },
      { at: 'NewMain', t: 'Er startet die App als Container auf NewMain.' },
      { at: 'Nginx Proxy Manager', t: 'Er legt einen Proxy-Host für die neue Subdomain an und holt ein SSL-Zertifikat dafür.' },
      { at: 'Cloudflare', t: 'Er legt den DNS-Eintrag an, der die Subdomain zu mir nach Hause leitet.' },
      { at: 'UniFi', t: 'Braucht die App einen Port oder eine Firewallregel, richtet er das auf dem Router ein.' },
      { at: 'braven-agents', t: 'Er ruft die Adresse auf, prüft, ob die App antwortet, und schickt mir dann den Link.' },
    ],
    ownTitle: 'Von selbst',
    own: 'Jeden Tag läuft ein Health-Check, der selbst behebt, was er kann. Er startet gestoppte Container, Dienste und virtuelle Maschinen neu und hängt Laufwerke wieder ein, die weggefallen sind.',
    waitTitle: 'Was noch auf mich wartet',
    wait: 'Daten löschen, am Speicher-Array arbeiten und Rechner neu starten braucht weiterhin meine Freigabe, und die Tools fragen nach, bevor sie etwas Zerstörerisches tun.',
  },

  machines: {
    title: 'Die Rechner',
    photoAlt: '{name}',
    lead: 'Fünf Rechner laufen, und ein sechster ist noch in Planung.',
    status: { running: 'Läuft', planned: 'Geplant' },
    items: {
      agents: {
        name: 'braven-agents', role: 'Der Kern',
        blurb: 'Das ist der stärkste Rechner hier, und er läuft mit Ubuntu direkt auf der Hardware, damit die Agenten ihn ganz für sich haben.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X, 16 Kerne' },
          { k: 'RAM', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: 'Speicher', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'Speicher und Dienste',
        blurb: 'NewMain bewahrt meine Dateien, Fotos und Backups auf fünf Festplatten in einem paritätsgeschützten Unraid-Array auf und betreibt in Docker die selbst gehosteten Dienste weiter unten auf dieser Seite.',
        specs: [
          { k: 'OS', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 Kerne' },
          { k: 'RAM', v: '128 GB DDR3' },
          { k: 'Array', v: '5 Festplatten, mit Parität' },
          { k: 'Controller', v: 'PERC H710P im IT-Modus' },
        ],
      },
      caca: {
        name: 'CaCa', role: 'Dev-Umgebung',
        blurb: 'CaCa ist ein kleiner ThinkCentre, der als Entwicklungsumgebung für ein Projekt dient, über das ich noch nicht reden kann.',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'RAM', v: '32 GB DDR4' },
          { k: 'Speicher', v: '1 TB NVMe-SSD' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'iCloud-Brücke',
        blurb: 'Servertop ist ein MacBook Air, das bei meiner iCloud angemeldet bleibt, sodass die Agenten darüber meine Kalender, Erinnerungen und andere persönliche Dinge erreichen.',
        specs: [
          { k: 'Modell', v: 'MacBook Air, M1' },
          { k: 'RAM', v: '8 GB' },
          { k: 'Speicher', v: '256 GB SSD' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'GPU-Rechner',
        blurb: 'Dieser Laptop läuft mit Ubuntu und übernimmt die GPU-lastige Arbeit, und es ist derselbe Rechner, der DrumNet für den OCR Reader trainiert hat.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Core i7, 10. Generation' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'RAM', v: '32 GB' },
          { k: 'Speicher', v: '2 × 1 TB SSD' },
        ],
      },
      proxmox: {
        name: 'Proxmox-Server', role: 'Virtuelle Maschinen',
        blurb: 'Ein neuer Proxmox-Server wird gerade noch zusammengestellt, und seine Hardware steht noch nicht fest.',
        specs: [
          { k: 'OS', v: 'Proxmox VE' },
          { k: 'Hardware', v: 'Noch offen' },
        ],
      },
    },
    rack: {
      alt: 'Das Rack in meinem Zimmer, oben das Patchpanel mit blauen Kabeln, darunter die Server hinter einer Gittertür',
      caption: 'braven-agents, NewMain und CaCa teilen sich dieses Rack in meinem Zimmer.',
    },
  },

  stack: {
    title: 'Was darauf läuft',
    lead: 'NewMain betreibt diese Dienste für mich und meine Projekte, und die öffentlichen zeigen einen Live-Status, der einmal pro Minute geprüft wird.',
    filterLabel: 'Dienste filtern',
    categories: {
      all: 'Alle',
      access: 'Zugang',
      files: 'Dateien',
      media: 'Medien, Tools',
      monitoring: 'Monitoring',
      projects: 'Für Projekte',
    },
    checkedAt: 'Geprüft um {time}',
    checking: 'Prüfe Status',
    showFewer: 'Weniger zeigen',
    showAll: 'Alle {n} Dienste zeigen',
    status: { up: 'Online', down: 'Offline', wait: 'Prüfe', self: 'Privat' },
    loadLabel: 'Last: {label}',
    weights: {
      extreme: 'Am höchsten',
      'very-high': 'Sehr hoch',
      high: 'Hoch',
      moderate: 'Mittel',
      low: 'Gering',
      diagnostic: 'Bei Bedarf',
    },
    facts: { runsOn: 'Läuft auf', load: 'Last', access: 'Zugang', category: 'Kategorie' },
    access: {
      public: 'Öffentlich, über Nginx Proxy Manager und CrowdSec',
      private: 'Privat, im Tailscale-Netz',
    },
    visit: '{host} besuchen',
  },

  services: {
    npm: {
      blurb: 'Er steht als Reverse Proxy vor jedem öffentlichen Dienst, terminiert SSL, leitet jede Subdomain von chiambucket.com an ihren Container weiter und betreibt einen CrowdSec-Bouncer, der feindliche IPs sperrt.',
      long: [
        'Der gesamte öffentliche Verkehr kommt an einer Adresse an und geht zuerst an NPM, sodass kein Container direkt im Internet steht.',
        'CrowdSec beobachtet den Verkehr auf Angriffsmuster und sperrt die Quelle. Weil alles durch NPM läuft, fällt jeder öffentliche Dienst aus, sobald NPM ausfällt.',
      ],
    },
    tailscale: { blurb: 'Ein WireGuard-Mesh, das alle meine Geräte in ein privates Netz bringt, und darüber komme ich von überall nach Hause.' },
    shadowsocks: { blurb: 'Ein Proxy, der meinen Verkehr wie normales HTTPS aussehen lässt, damit ich aus eingeschränkten Schulnetzen nach Hause komme.' },
    twingate: { blurb: 'Ein Zero-Trust-Connector, den ich als weiteren Zugang behalte, neben Tailscale, WireGuard und UniFi Teleport.' },
    pihole: { blurb: 'Er blockiert Werbung und Tracker auf DNS-Ebene für das ganze Netzwerk, auch wenn ich ihn inzwischen vor allem zur Fehlersuche nutze.' },
    immich: {
      blurb: 'Immich ersetzt Google Fotos als meine Fotobibliothek, mit automatischen Backups vom Handy, Suche und Alben, und es ist der Dienst, den ich am meisten nutze.',
      long: [
        'Jedes Foto und Video von meinem Handy wird hier automatisch gesichert und bleibt auf meinem eigenen Speicher.',
        'Es ist der schwerste Dienst auf NewMain, und beim Dimensionieren habe ich gelernt, CPU, Arbeitsspeicher und Speicherplatz für eine echte Last einzuplanen.',
      ],
    },
    lychee: { blurb: 'Lychee ist die Fotogalerie hinter der Fotografie-Seite dieser Website.' },
    pingvin: { blurb: 'Hier lade ich Dateien hoch, die für Chat-Apps zu groß sind, und bekomme einen Link zum Verschicken.' },
    pairdrop: { blurb: 'Es schickt eine Datei vom Browser aus zwischen zwei beliebigen Geräten, wie AirDrop, ganz ohne Konten.' },
    fbq: {
      blurb: 'Es gibt mir Browserzugriff und Freigabelinks für dieselben Dateien, die ich zu Hause über NFS und SMB nutze.',
      long: ['Davor hatte ich Nextcloud, den ursprünglichen FileBrowser, Alist und SFTPGo, und das hier habe ich behalten.'],
    },
    syncthing: { blurb: 'Es hält Dateien zwischen meinen Geräten ständig synchron, mit Versionierung.' },
    fireshare: { blurb: 'Meine Freunde und ich laden hier Gaming-Clips hoch und teilen sie, ohne Upload-Limit.' },
    neko: { blurb: 'Es betreibt einen geteilten Browser in einem Tab, sodass wir im selben Raum zusammen schauen oder recherchieren können, auf einem Bildschirm.' },
    crafty: { blurb: 'Crafty verwaltet meine Minecraft-Server.' },
    paperless: { blurb: 'Ein Dokumentenarchiv, das jedes PDF und jeden Scan per OCR erfasst, sodass ich sie von jedem Gerät aus durchsuchen kann.' },
    vscode: { blurb: 'Es bringt VS Code in den Browser, damit ich Config-Dateien auf dem Server bearbeiten kann.' },
    upstat: { blurb: 'Es verfolgt Uptime und Antwortzeit jedes Dienstes und Containers, damit Probleme früh auffallen.' },
    netdata: { blurb: 'Es zeichnet sekündlich Messwerte für CPU, Festplatten, Netzwerk und Container auf.' },
    upsnap: { blurb: 'Ein Panel für Wake-on-LAN, das schlafende Rechner aufweckt.' },
    openspeedtest: { blurb: 'Ein selbst gehosteter Speedtest, der den Durchsatz zwischen dem Server und meinem jeweiligen Standort misst.' },
    portainer: { blurb: 'Es gibt mir eine Web-Oberfläche für die Docker-Container auf NewMain.' },
    coturn: {
      blurb: 'Diesen TURN- und STUN-Server habe ich für Project June aufgesetzt, damit seine drei WebRTC-Kamerastreams durch das NAT im Mobilfunknetz kommen.',
      long: [
        'Project June streamt drei Live-Kamerabilder über 5G, aber Mobilfunknetze stecken Geräte hinter mehrere Schichten NAT, durch die WebRTC allein nicht durchkommt.',
        'Mein eigener TURN- und STUN-Server gibt den Streams eine feste öffentliche Adresse als Treffpunkt, sodass ich den Rover von überall fahren kann, und er braucht kaum CPU.',
      ],
    },
    mosquitto: { blurb: 'Diesen MQTT-Broker habe ich zuerst für Telemetrie und Steuerung von Project June aufgesetzt, und heute überträgt er Nachrichten zwischen meinen ESP32-Schulprojekten und ihren Dashboards.' },
    nginx: { blurb: 'Zwei kleine nginx-Container liefern meine statischen Seiten und Projektdemos aus.' },
  },

  tubs: {
    title: 'Shebang Tubs',
    status: 'Früh, in Entwicklung',
    lead: 'Shebang Tubs ist ein Projekt und Framework, an dem ich baue, damit jeder mit Agenten seine eigenen Apps bauen und selbst hosten kann.',
    body: [
      'Jede App ist ein Tub, ein Ordner mit einer schlichten Compose-Datei und eigener Datenbank, eigenen Dateien und Secrets, sodass ein Agent sie bauen, betreiben und als eine einzige ZIP-Datei samt Daten auf einen anderen Rechner umziehen kann.',
      'Ein Dashboard deployt, startet und stoppt die Tubs, und wenn ich einen veröffentliche, bekommt er über Cloudflare Tunnel eine Webadresse, ohne Portweiterleitung oder Reverse Proxy. Agenten bekommen einen API-Key, also können sie all das selbst erledigen.',
    ],
    diagram: {
      label: 'Was ein Tub enthält und wohin er geht',
      tub: 'Ein Tub',
      parts: ['Compose-Datei', 'Datenbank', 'Dateien', 'Secrets'],
      zip: 'Als eine Zip exportiert',
      runs: 'Läuft auf jedem Rechner mit Docker',
      publish: 'Über Cloudflare Tunnel veröffentlicht',
    },
  },

  cta: {
    title: 'Wohin das führt',
    sub: 'Das Ziel ist eine persönliche Cloud, die sich um sich selbst kümmert und aus einem einzigen Prompt alles bauen und betreiben kann. Die meisten Teile sind jetzt da, und als Nächstes kommt der neue Proxmox-Server.',
    projects: 'Meine Projekte',
    contact: 'Kontakt',
  },
} as Draft<HomelabCopy>;

export default draft(de);
