import type { HomelabCopy } from './en';

/* The homelab page's German words, in the shape of en.tsx. */
const de: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Ich betreibe zu Hause drei Server für meine Fotobibliothek, zum Teilen von Dateien und für die MQTT- und TURN-Server, die Project June und LUMEN nutzen. Diese Seite zeigt ihre Hardware, die Netzwerkkarte, den Speicher, die Dienste und den Live-Status.',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['Self-Hosting', 'Heimnetzwerk', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: 'Details zu {name}',
  close: 'Schließen',

  hero: {
    checking: 'Prüfe öffentliche Dienste',
    online: '{count}öffentliche Dienste online',
    onlineCount: '{n} von {total}',
    tele: 'NewMain läuft mit Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>Drei Server <em>in meinem Zimmer</em></>,
    lead: 'Auf ihnen laufen meine Fotobibliothek, meine Dateien und die MQTT- und TURN-Server, die Project June und LUMEN nutzen, und an ihnen lerne ich Netzwerke, Speicher und Docker und hoste, was ich baue.',
    stats: [
      { v: '3', k: 'Server' },
      { v: '38', k: 'gehostete Dienste' },
      { v: '24 TB', k: 'nutzbarer Speicher' },
      { v: '4', k: 'VLANs' },
    ],
    mapCta: 'Zur Netzwerkkarte',
    stackCta: 'Zu den Diensten',
    scrollCue: 'Nach unten',
  },

  mission: {
    eyebrow: 'Warum ich es betreibe',
    title: 'Wofür es da ist',
    lead: 'Meine Hardwareprojekte brauchen Server, mit denen sie reden können. Project June streamt seine Kameras über meinen TURN-Server und nutzt meinen MQTT-Broker für Telemetrie und Steuerung, und das Sprach-Relay von LUMEN läuft hier in Docker. Indem ich das alles selbst betreibe, habe ich Netzwerke, Speicher und Deployment gelernt.',
    pillars: {
      cloud: { k: 'Server und Speicher', d: 'Docker-Container betreiben hinter einem Reverse Proxy die Dienste, die ich jeden Tag nutze, mit zwei Speicherstufen und Backups.' },
      net: { k: 'Netzwerk', d: 'Das Netzwerk hat vier VLANs, RADIUS und WLAN mit WPA3-Enterprise und läuft auf Switches und Access Points von UniFi.' },
      code: { k: 'Meine Apps', d: 'Apps, die ich baue, werden auf eine VM im Proxmox-Cluster deployt, und als Nächstes sollen Agenten Teile des Labs selbst betreiben.' },
      link: { k: 'Für meine Projekte', d: 'Mit coturn kann Project June Video über 5G streamen, und Mosquitto überträgt Nachrichten für meine ESP32-Schulprojekte.' },
    },
  },

  machines: {
    eyebrow: 'Hardware',
    title: 'Server',
    photoAlt: 'Der Server {name}',
    more: 'Specs und Details',
    rack: {
      alt: 'Das Homelab-Rack in meinem Zimmer: oben das Patchpanel mit blauen Kabeln, die Server hinter einer Gittertür',
      eyebrow: 'Das Rack',
      title: 'Alle drei Server in einem Schrank',
      body: 'Das Rack steht in einer Ecke meines Zimmers, oben das Patchpanel und die Server hinter der Gittertür. Zwei davon laufen die ganze Zeit, und Adell bleibt aus, bis ich ihn brauche.',
    },
  },

  statusLabels: { 'always-on': 'Läuft 24/7', 'on-demand': 'Nur bei Bedarf' },

  specLabels: {
    os: 'OS', cpu: 'CPU', memory: 'RAM', gpu: 'GPU', array: 'Array', fastPool: 'Fast Pool',
    storage: 'Speicher', boot: 'Boot', hosts: 'Hostet', power: 'Strom',
  },

  servers: {
    newmain: {
      tag: 'Hauptserver',
      role: 'Speicher und der Großteil von Docker',
      blurb: 'Das ist der Hauptserver. Ein Unraid-Array mit Parität hält die großen Datenmengen, ein ZFS-Mirror aus NVMe-SSDs alles, was schnell sein muss, und hier laufen die meisten Docker-Container.',
      specs: {
        cpu: 'Ryzen 9 5950X, 16 Kerne',
        array: '2 Parität + 3 Daten',
        fastPool: '2 × 2 TB NVMe, ZFS-Mirror',
      },
      detail: {
        tagline: 'Speicher und die meisten Dienste',
        story: [
          'Unraid fasst unterschiedliche Festplatten zu einem Array mit Paritätsschutz für große Datenmengen zusammen, während ein separater ZFS-Mirror aus zwei NVMe-SSDs App-Daten von Docker, Datenbanken und VM-Disks hält.',
          'Fast jeder Dienst auf dieser Seite läuft hier, auch alles hinter den Subdomains von chiambucket.com. Die GTX 1070 übernimmt das Transkodieren von Videos und das maschinelle Lernen hinter der Suche und Gesichtserkennung von Immich.',
          'An dieser Maschine ändere ich so wenig wie möglich, weil alles andere von ihr abhängt.',
        ],
        highlights: [
          'Das Paritäts-Array übersteht zwei gleichzeitig ausfallende Festplatten',
          'ZFS-Mirror aus NVMe für App-Daten und VM-Disks',
          'Betreibt die meisten Docker-Container',
          'GTX 1070 für maschinelles Lernen in Immich und Transkodierung',
        ],
      },
    },
    caca: {
      tag: 'Proxmox-Node, immer an',
      role: 'Proxmox-Cluster, immer an',
      blurb: 'CaCa ist ein kleiner ThinkCentre, der früher mein Hauptserver war. Heute ist er der immer laufende Node eines Proxmox-Clusters und betreibt die VMs für CasaOS und Debian von seiner eigenen 1-TB-SSD.',
      specs: {
        storage: '1 TB NVMe-SSD, Boot und VMs',
        boot: 'Lokale NVMe-SSD',
        hosts: 'VMs für CasaOS und Debian',
      },
      detail: {
        tagline: 'Der Proxmox-Node, der anbleibt',
        story: [
          'CaCa war vor NewMain mein Hauptserver, und jetzt ist er zusammen mit Adell die immer laufende Hälfte eines Proxmox-Clusters aus zwei Nodes.',
          'Er bootet Proxmox von einer eingebauten 1-TB-NVMe-SSD, und die virtuellen Maschinen für CasaOS und Debian, die früher direkt auf der Hardware liefen, laufen jetzt von derselben Disk.',
          'Er braucht wenig Strom, also bleibt er rund um die Uhr an, während Adell schläft.',
        ],
        highlights: [
          'Bootet und betreibt seine VMs von einer lokalen 1-TB-NVMe-SSD',
          'Hostet die VMs für CasaOS und Debian',
          'Wenig Stromverbrauch, läuft 24/7',
          'Bildet mit Adell einen Cluster für Live-Migration',
        ],
      },
    },
    adell: {
      tag: 'Proxmox-Node, bei Bedarf',
      role: 'Proxmox-Cluster, bei Bedarf geweckt',
      blurb: 'Adell hat zwanzig Xeon-Kerne und 128 GB RAM und steckt im selben Proxmox-Cluster wie CaCa, braucht aber viel Strom. Darum bleibt er aus, bis ich ihn über UpSnap aufwecke.',
      specs: {
        cpu: '2 × Xeon E5-2470 v2, 20 Kerne',
        storage: 'PERC H710P im IT-Modus',
        power: 'Nur Wake-on-LAN',
      },
      detail: {
        tagline: 'Die große Maschine, die ich bei Bedarf wecke',
        story: [
          'Adell ist die große Maschine im Cluster, mit zwei Xeons, die zusammen zwanzig Kerne haben, und 128 GB RAM, also braucht er zu viel Strom, um ihn laufen zu lassen.',
          'Wenn eine Aufgabe ihn braucht, drücke ich in UpSnap auf Wecken. Das schickt ein Wake-on-LAN-Paket, Adell bootet übers Netzwerk, erledigt die Aufgabe und legt sich wieder schlafen.',
        ],
        highlights: [
          'Zwanzig Xeon-Kerne, 128 GB RAM',
          'Wacht bei Bedarf per Wake-on-LAN auf',
          'Bootet per PXE, ohne lokale Systemplatte',
          'Bleibt aus, bis eine Aufgabe ihn braucht',
        ],
      },
    },
  },

  visuals: {
    runsLabel: 'Was hier läuft',
    runsFoot: '{n} der {total} Dienste auf dieser Seite laufen auf NewMain',
    bootLabel: 'Wie er bootet',
    bootSteps: [
      { t: 'Lokale SSD', s: 'Eine eingebaute 1-TB-NVMe-SSD' },
      { t: 'Proxmox', s: 'Proxmox bootet von dieser Disk' },
      { t: 'VMs', s: 'CasaOS und Debian laufen von derselben SSD' },
    ],
    wakeLabel: 'Wie er aufwacht',
    wakeFoot: <>Ein einziges Wake-on-LAN-Paket von UpSnap startet alle <b>20 Kerne</b></>,
  },

  map: {
    eyebrow: 'Netzwerk',
    title: 'Netzwerkkarte',
    lead: 'Bei mir zu Hause läuft ein UniFi-Netzwerk, das in vier VLANs aufgeteilt ist. Wähl ein Gerät, um zu sehen, was es macht, oder ein VLAN, um die Geräte darin hervorzuheben.',
    clear: 'Auswahl aufheben',
    tip: 'Wähl ein VLAN, um seine Geräte hervorzuheben',
    svgLabel: 'Netzwerkkarte. Wähl ein Gerät für Details.',
    core: 'Kernnetz',
    segment: 'Segment',
    hint: 'Wähl ein Gerät, um zu sehen, was es macht.',
    legend: {
      unraid: 'Unraid-VLAN',
      server: 'Server-VLAN',
      default: 'Standard-VLAN',
      iot: 'IoT-VLAN, isoliert',
    },
    vlans: {
      unraid: { label: 'Unraid-VLAN', blurb: 'NewMain hat dieses VLAN für sich allein. Vertrauenswürdige VLANs erreichen es für Speicher und Apps, das IoT-VLAN dagegen nicht.' },
      server: { label: 'Server-VLAN', blurb: 'CaCa und Adell, der Proxmox-Cluster, teilen sich dieses Segment, damit sie VMs live migrieren und per PXE booten können.' },
      default: { label: 'Standard-VLAN', blurb: 'Hier sind die Arbeitsrechner und das Haupt-WLAN mit WPA3-Enterprise. Sie erreichen die Server, das IoT-VLAN erreicht sie aber nicht.' },
      iot: { label: 'IoT-VLAN', blurb: 'Smarte Geräte bekommen Internetzugang und sonst nichts, weil Firewall-Regeln dieses Segment von allen anderen VLANs abschotten.' },
      core: { label: 'Kernnetz', blurb: 'Das Gateway und die Switches, die zwischen den VLANs routen.' },
    },
    nodes: {
      internet: { label: 'Internet', sub: 'Öffentlicher Rand',
        detail: 'Eingehender Verkehr kommt an einer öffentlichen Adresse an und geht direkt zum Gateway, sodass nichts dahinter direkt erreichbar ist.' },
      udm: { label: 'UDM Pro', sub: 'Gateway, Firewall, RADIUS',
        detail: 'Die UniFi Dream Machine Pro ist Gateway, Firewall, Netzwerk-Controller und RADIUS-Server. Sie entscheidet, welches VLAN welches erreichen darf, und authentifiziert das WLAN mit WPA3-Enterprise.' },
      sw1: { label: 'USW Pro Max 24', sub: 'Server-Rack',
        detail: 'Dieser Switch mit 24 Ports sitzt im Server-Rack, und jeder Server hängt mit einem redundanten Paar Verbindungen daran.' },
      sw2: { label: 'USW Flex 2.5G', sub: 'Allgemein',
        detail: 'Dieser 2,5-Gbit-Switch verbindet die schnelleren Alltagsgeräte in der Wohnung.' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'Strom für die APs',
        detail: 'Dieser PoE-Switch mit 8 Ports verbindet die fünf Access Points und versorgt sie mit Strom, mit je einem Kabel.' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'Der Unraid-Server hat ein VLAN für sich. Vertrauenswürdige VLANs erreichen ihn für Speicher und Apps, das IoT-VLAN dagegen nicht.' },
      caca: { label: 'CaCa', sub: 'Immer an',
        detail: 'CaCa ist der Proxmox-Node, der anbleibt, und teilt sich das Server-VLAN mit Adell.' },
      adell: { label: 'Adell', sub: 'Bei Bedarf',
        detail: 'Adell ist der Proxmox-Node, den ich wecke, wenn ich ihn brauche, und er teilt sich das Server-VLAN mit CaCa für Live-Migration und PXE-Boot.' },
      clients: { label: 'Arbeitsrechner', sub: 'Laptops, Desktops',
        detail: 'Alltagsgeräte sind im Standard-VLAN. Dort erreichen sie die Server, aber das IoT-VLAN erreicht sie nicht.' },
      aps: { label: '5 UniFi-APs', sub: 'WLAN',
        detail: 'Fünf Access Points senden zwei getrennte WLANs durch die Wohnung und bekommen ihren Strom per PoE vom Lite 8.' },
      wmain: { label: 'Haupt-WLAN', sub: 'WPA3-Enterprise',
        detail: 'Das Haupt-WLAN nutzt WPA3-Enterprise mit RADIUS auf der UDM Pro, sodass jedes Gerät eigene Zugangsdaten hat.' },
      wiot: { label: 'IoT-WLAN', sub: 'Isoliert',
        detail: 'Smarte Geräte bekommen Internetzugang und sonst nichts, weil Firewall-Regeln sie von allen anderen VLANs abschotten.' },
    },
  },

  storage: {
    eyebrow: 'Speicher und VMs',
    title: 'Speicher und virtuelle Maschinen',
    poolsTitle: 'Speicher auf NewMain',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'Array',
      sub: 'Unraid, mit Parität',
      body: 'Es hat zwei Paritätsplatten und drei Datenplatten, übersteht also zwei gleichzeitig ausfallende Festplatten, und hält PXE-Backups, Archive und Medien.',
    },
    fast: {
      name: 'Fast Pool',
      sub: 'ZFS-Mirror aus NVMe',
      body: 'Zwei NVMe-SSDs mit je 2 TB bilden einen ZFS-Mirror, von dem App-Daten von Docker, VM-Disks und die PXE-ISO-Bibliothek laufen.',
    },
    sharedOver: 'Freigegeben per',
    protocols: ['SFTP', 'SMB im lokalen Netz', 'NFS für Linux und macOS'],
    clusterTitle: 'Der Proxmox-Cluster',
    clusterLead: 'CaCa und Adell bilden einen Proxmox-Cluster. CaCa bootet von seiner eigenen 1-TB-SSD und bleibt an, während Adell ohne lokale Systemplatte übers Netzwerk bootet und ich ihn wecke, wenn ich seine Kerne brauche.',
    vms: [
      { k: 'claudeplayground', d: 'Eine Ubuntu-VM, auf die ich die Apps deploye, die ich baue, und Claude hat SSH-Zugang, um sie auszuliefern.' },
      { k: 'CasaOS und Debian', d: 'Diese VMs liefen früher direkt auf der Hardware.' },
      { k: 'Wake-on-LAN', d: 'UpSnap schaltet Adell ein, wenn eine Aufgabe ihn braucht, sodass er nur Strom zieht, während er arbeitet.' },
    ],
  },

  stack: {
    eyebrow: 'Software',
    title: 'Dienste',
    lead: 'Das sind die wichtigsten von 38 Diensten, und die öffentlichen zeigen einen Live-Status, der einmal pro Minute geprüft wird.',
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
    status: { up: 'online', down: 'offline', wait: 'prüfe', build: 'im Aufbau', self: 'privat' },
    loadLabel: 'Last: {label}',
    weights: {
      extreme: 'Am höchsten',
      'very-high': 'Sehr hoch',
      high: 'Hoch',
      moderate: 'Mittel',
      low: 'Gering',
      dev: 'In Arbeit',
      diagnostic: 'Bei Bedarf',
    },
    facts: { runsOn: 'Läuft auf', load: 'Last', access: 'Zugang', category: 'Kategorie' },
    access: {
      public: 'Öffentlich, über Nginx Proxy Manager und CrowdSec',
      dev: 'In Entwicklung auf NewMain',
      private: 'Privat, im Tailscale-Netz',
    },
    visit: '{host} besuchen',
  },

  services: {
    openclaw: {
      blurb: 'Gerade baue ich OpenClaw, einen Runner, mit dem KI-Agenten echte Aufgaben im Lab erledigen können, und er ist noch nicht fertig.',
      long: [
        'Das Ziel ist, einem Agenten einen sicheren Platz im Lab zu geben, an dem er einen Container starten, einen Dienst prüfen, eine kleine App deployen und Bericht erstatten kann.',
        'Es baut darauf auf, dass Claude schon SSH-Zugang zu einer VM hat, um meine Apps zu deployen, und der nächste Schritt ist, dass es Teile des Labs betreibt, während ich die Ergebnisse prüfe.',
      ],
    },
    npm: {
      blurb: 'Er steht als Reverse Proxy vor jedem öffentlichen Dienst, terminiert SSL, leitet jede Subdomain von chiambucket.com an ihren Container weiter und betreibt einen CrowdSec-Bouncer, der feindliche IPs sperrt.',
      long: [
        'Der gesamte öffentliche Verkehr kommt an einer Adresse an und geht zuerst an NPM, sodass kein Container direkt im Internet steht.',
        'CrowdSec beobachtet den Verkehr auf Angriffsmuster und sperrt die Quelle. Weil alles durch NPM läuft, fällt jeder öffentliche Dienst aus, sobald NPM ausfällt.',
      ],
    },
    tailscale: { blurb: 'Ein WireGuard-Mesh, das alle meine Geräte in ein privates Netz bringt. Darüber verbinde ich mich per SSH und bearbeite Configs von überall.' },
    shadowsocks: { blurb: 'Ein Proxy, der meinen Verkehr wie normales HTTPS aussehen lässt, damit ich aus eingeschränkten Schulnetzen nach Hause komme.' },
    twingate: { blurb: 'Ein Zero-Trust-Connector, den ich als weiteren Zugang behalte, neben Teleport, WireGuard und Unraid Connect.' },
    pihole: { blurb: 'Er blockiert Werbung und Tracker auf DNS-Ebene für das ganze Netzwerk, auch wenn ich ihn inzwischen vor allem zur Fehlersuche nutze.' },
    immich: {
      blurb: 'Immich ersetzt Google Fotos als meine Fotobibliothek, mit automatischen Backups vom Handy, Suche und Alben, und es ist der Dienst, den ich am meisten nutze.',
      long: [
        'Jedes Foto und Video von meinem Handy wird hier automatisch gesichert und bleibt auf meinem eigenen Speicher.',
        'Es ist der schwerste Dienst auf NewMain. Die GTX 1070 übernimmt das maschinelle Lernen für Suche und Gesichtserkennung, und beim Dimensionieren habe ich gelernt, CPU, GPU, Arbeitsspeicher und Speicherplatz für eine echte Last einzuplanen.',
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
    crafty: { blurb: 'Crafty verwaltet meine Minecraft-Server und läuft an zwei Orten, damit sich eine Welt immer starten lässt.' },
    paperless: { blurb: 'Ein Dokumentenarchiv, das jedes PDF und jeden Scan per OCR erfasst, sodass ich sie von jedem Gerät aus durchsuchen kann.' },
    vscode: { blurb: 'Es bringt VS Code in den Browser, damit ich Config-Dateien auf dem Server bearbeiten kann.' },
    upstat: { blurb: 'Es verfolgt Uptime und Antwortzeit jedes Dienstes und Containers, damit ich von Problemen als Erster erfahre.' },
    netdata: { blurb: 'Es zeichnet sekündlich Messwerte für CPU, Festplatten, Netzwerk und Container auf.' },
    upsnap: { blurb: 'Ein Panel für Wake-on-LAN, und damit schalte ich Adell ein.' },
    openspeedtest: { blurb: 'Ein selbst gehosteter Speedtest, der den Durchsatz zwischen dem Server und meinem jeweiligen Standort misst.' },
    portainer: { blurb: 'Es gibt mir eine Web-Oberfläche für Docker, auf dem Unraid-Host und in der CasaOS-VM.' },
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

  access: {
    eyebrow: 'Fernzugriff',
    title: 'Sechs Wege rein',
    lead: 'Ich halte sechs getrennte Wege von außen offen, damit ich nicht ausgesperrt bin, wenn einer davon ausfällt.',
    primary: 'Haupt',
    methods: {
      tailscale: { type: 'Mesh-VPN', note: 'Ein WireGuard-Mesh mit einem Login für alle meine Geräte, und den nutze ich jeden Tag.' },
      wireguard: { type: 'Tunnel', note: 'Ein schlichter verschlüsselter Tunnel ins Netzwerk, ganz ohne Drittanbieter.' },
      teleport: { type: 'Eingebautes VPN', note: 'Die UDM Pro stellt dieses VPN selbst aus, also muss kein Client eingerichtet werden.' },
      twingate: { type: 'Zero Trust', note: 'Es prüft den Zugriff pro Identität und hält jeden eingehenden Port geschlossen.' },
      shadowsocks: { type: 'Proxy', note: 'Es lässt meinen Verkehr wie HTTPS aussehen, damit ich durch eingeschränkte WLANs in Schule und Büro komme.' },
      unraidConnect: { type: 'Herstellerdienst', note: 'Es gibt mir über mein Unraid-Konto direkten Zugriff auf den Unraid-Server.' },
    },
    home: { type: 'Das Rack', note: 'Jeder Weg oben endet hier.' },
  },

  cta: {
    title: 'Woran ich gerade baue',
    sub: 'Ich baue OpenClaw, einen Runner, mit dem KI-Agenten echte Aufgaben im Lab erledigen, etwa einen Container starten, einen Dienst prüfen, eine kleine App deployen und Bericht erstatten, aber er ist noch nicht fertig.',
    projects: 'Meine Projekte',
    contact: 'Kontakt',
  },
};

export default de;
