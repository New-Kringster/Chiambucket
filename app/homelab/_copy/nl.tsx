import type { HomelabCopy } from './en';

/* De Nederlandse woorden van de homelabpagina, in dezelfde vorm als en.tsx. */
const nl: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Ik draai thuis drie servers voor mijn fotobibliotheek, het delen van bestanden en de MQTT- en TURN-servers die Project June en LUMEN gebruiken. Op deze pagina zie je de hardware, de netwerkkaart, de opslag, de diensten en hun live status.',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['Selfhosting', 'Thuisnetwerken', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: 'Details van {name}',
  close: 'Sluiten',

  hero: {
    checking: 'Publieke diensten checken',
    online: '{count}publieke diensten online',
    onlineCount: '{n} van {total}',
    tele: 'NewMain draait Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>Drie servers <em>in mijn kamer</em></>,
    lead: 'Ze draaien mijn fotobibliotheek, mijn bestanden en de MQTT- en TURN-servers die Project June en LUMEN gebruiken, en het is ook de plek waar ik netwerken, opslag en Docker leer en host wat ik bouw.',
    stats: [
      { v: '3', k: 'servers' },
      { v: '38', k: 'zelfgehoste diensten' },
      { v: '24 TB', k: 'netto opslag' },
      { v: '4', k: 'VLAN’s' },
    ],
    mapCta: 'Bekijk de netwerkkaart',
    stackCta: 'Bekijk de diensten',
    scrollCue: 'Scroll omlaag',
  },

  mission: {
    eyebrow: 'Waarom ik het draai',
    title: 'Waar het voor is',
    lead: 'Mijn hardwareprojecten hebben servers nodig om mee te praten. Project June streamt zijn camera’s via mijn TURN-server en gebruikt mijn MQTT-broker voor telemetrie en besturing, en de spraakrelay van LUMEN draait hier in Docker. Door dit zelf te draaien heb ik netwerken, opslag en deployen geleerd.',
    pillars: {
      cloud: { k: 'Servers en opslag', d: 'Docker-containers draaien achter een reverse proxy de diensten die ik elke dag gebruik, met twee opslaglagen en back-ups.' },
      net: { k: 'Netwerken', d: 'Het netwerk heeft vier VLAN’s, RADIUS en WPA3-Enterprise-wifi, op UniFi-switches en -access points.' },
      code: { k: 'Mijn apps deployen', d: 'Apps die ik bouw worden gedeployed naar een VM in het Proxmox-cluster, en hierna wil ik dat agents zelf delen van het lab draaien.' },
      link: { k: 'Voor mijn projecten', d: 'Met coturn kan Project June video via 5G streamen, terwijl Mosquitto berichten draagt voor mijn ESP32-schoolprojecten.' },
    },
  },

  machines: {
    eyebrow: 'Hardware',
    title: 'Servers',
    photoAlt: 'Server {name}',
    more: 'Specs en details',
    rack: {
      alt: 'Het homelabrack in mijn kamer: het patchpaneel met blauwe kabels bovenaan, de servers achter een gaasdeur',
      eyebrow: 'Het rack',
      title: 'Alle drie de servers in één kast',
      body: 'Het rack staat in een hoek van mijn kamer, met het patchpaneel bovenaan en de servers achter de gaasdeur. Twee ervan draaien altijd, en Adell blijft uit tot ik hem nodig heb.',
    },
  },

  statusLabels: { 'always-on': 'Altijd aan', 'on-demand': 'Uit tot nodig' },

  specLabels: {
    os: 'OS', cpu: 'CPU', memory: 'Geheugen', gpu: 'GPU', array: 'Array', fastPool: 'Snelle pool',
    storage: 'Opslag', boot: 'Boot', hosts: 'Draait', power: 'Stroom',
  },

  servers: {
    newmain: {
      tag: 'Hoofdserver',
      role: 'Opslag en het grootste deel van de Docker-stack',
      blurb: 'Dit is de hoofdserver, waar een Unraid-array met pariteit de bulkdata bewaart, een ZFS-NVMe-mirror alles bevat wat snel moet zijn, en de meeste Docker-containers draaien.',
      specs: {
        cpu: 'Ryzen 9 5950X, 16 cores',
        array: '2 pariteit + 3 data',
        fastPool: '2 × 2 TB NVMe, ZFS-mirror',
      },
      detail: {
        tagline: 'Opslag en de meeste diensten',
        story: [
          'Unraid voegt schijven van verschillende maten samen tot één array met pariteit voor bulkdata, terwijl een aparte ZFS-mirror van twee NVMe-schijven de appdata van Docker, databases en VM-schijven bevat.',
          'Bijna elke dienst op deze pagina draait hier, ook alles achter de subdomeinen van chiambucket.com. De GTX 1070 doet de videotranscoding en de machine learning achter het zoeken en het groeperen van gezichten in Immich.',
          'Ik verander zo weinig mogelijk aan deze machine, omdat al het andere ervan afhangt.',
        ],
        highlights: [
          'De array met pariteit overleeft twee kapotte schijven tegelijk',
          'ZFS-NVMe-mirror voor appdata en VM-schijven',
          'Draait de meeste Docker-containers',
          'GTX 1070 voor machine learning en transcoding in Immich',
        ],
      },
    },
    caca: {
      tag: 'Proxmox-node, altijd aan',
      role: 'Proxmox-cluster, altijd aan',
      blurb: 'CaCa is een kleine ThinkCentre die vroeger mijn hoofdserver was. Nu is hij de node van een Proxmox-cluster die altijd aan staat, en draait hij de CasaOS- en Debian-VM’s vanaf zijn eigen SSD van 1 TB.',
      specs: {
        storage: '1 TB NVMe-SSD, boot en VM’s',
        boot: 'Lokale NVMe-SSD',
        hosts: 'CasaOS- en Debian-VM’s',
      },
      detail: {
        tagline: 'De Proxmox-node die aan blijft',
        story: [
          'CaCa was mijn hoofdserver vóór NewMain, en nu is hij de helft van een Proxmox-cluster van twee nodes met Adell, de helft die altijd aan staat.',
          'Hij start Proxmox op vanaf een NVMe-SSD van 1 TB in de kast, en de virtuele machines met CasaOS en Debian die vroeger direct op de hardware draaiden, draaien nu vanaf dezelfde schijf.',
          'Hij verbruikt weinig stroom, dus hij blijft dag en nacht aan terwijl Adell slaapt.',
        ],
        highlights: [
          'Start op en draait zijn VM’s vanaf een lokale NVMe-SSD van 1 TB',
          'Host de CasaOS- en Debian-VM’s',
          'Laag verbruik, 24/7 aan',
          'Vormt een cluster met Adell voor live migratie',
        ],
      },
    },
    adell: {
      tag: 'Proxmox-node, op afroep',
      role: 'Proxmox-cluster, wakker op afroep',
      blurb: 'Adell heeft twintig Xeon-cores en 128 GB RAM en zit in hetzelfde Proxmox-cluster als CaCa, maar hij verbruikt veel stroom, dus hij blijft uit tot ik hem wakker maak via UpSnap.',
      specs: {
        cpu: '2 × Xeon E5-2470 v2, 20 cores',
        storage: 'PERC H710P in IT-modus',
        power: 'Alleen Wake-on-LAN',
      },
      detail: {
        tagline: 'De grote machine die ik wek als ik hem nodig heb',
        story: [
          'Adell is de grote machine in het cluster, met twee Xeons die samen twintig cores hebben en 128 GB RAM, dus hij verbruikt te veel stroom om aan te laten.',
          'Als een klus hem nodig heeft, druk ik op wake in UpSnap, dat een Wake-on-LAN-pakket stuurt, en dan start Adell op via het netwerk, doet de klus en gaat weer slapen.',
        ],
        highlights: [
          'Twintig Xeon-cores, 128 GB RAM',
          'Wordt op afroep gewekt via Wake-on-LAN',
          'Start via PXE, geen lokale OS-schijf',
          'Blijft uit tot een klus hem nodig heeft',
        ],
      },
    },
  },

  visuals: {
    runsLabel: 'Wat hier draait',
    runsFoot: '{n} van de {total} diensten op deze pagina draaien op NewMain',
    bootLabel: 'Hoe hij opstart',
    bootSteps: [
      { t: 'Lokale SSD', s: 'Een NVMe-SSD van 1 TB in de machine' },
      { t: 'Proxmox', s: 'Proxmox start op vanaf die schijf' },
      { t: 'VM’s', s: 'CasaOS en Debian draaien vanaf dezelfde SSD' },
    ],
    wakeLabel: 'Hoe hij wakker wordt',
    wakeFoot: <>Eén Wake-on-LAN-pakket van UpSnap start alle <b>20 cores</b></>,
  },

  map: {
    eyebrow: 'Netwerk',
    title: 'Netwerkkaart',
    lead: 'Bij mij thuis draait alles op één UniFi-netwerk, opgesplitst in vier VLAN’s. Kies een apparaat om te zien wat het doet, of een VLAN om de apparaten erop te laten oplichten.',
    clear: 'Wis markering',
    tip: 'Kies een VLAN om de apparaten te laten oplichten',
    svgLabel: 'Netwerkkaart. Kies een apparaat voor details.',
    core: 'Kernnetwerk',
    segment: 'Segment',
    hint: 'Kies een apparaat om te zien wat het doet.',
    legend: {
      unraid: 'Unraid-VLAN',
      server: 'Server-VLAN',
      default: 'Standaard-VLAN',
      iot: 'IoT-VLAN, geïsoleerd',
    },
    vlans: {
      unraid: { label: 'Unraid-VLAN', blurb: 'NewMain zit in z’n eentje op dit VLAN. Vertrouwde VLAN’s kunnen erbij voor opslag en apps, het IoT-VLAN niet.' },
      server: { label: 'Server-VLAN', blurb: 'CaCa en Adell, het Proxmox-cluster, delen dit segment, zodat ze VM’s live kunnen migreren en via PXE kunnen opstarten.' },
      default: { label: 'Standaard-VLAN', blurb: 'Werkplekken en de belangrijkste WPA3-Enterprise-wifi zitten hier. Ze kunnen bij de servers, terwijl het IoT-VLAN niet bij hen kan.' },
      iot: { label: 'IoT-VLAN', blurb: 'Slimme apparaten krijgen toegang tot internet en verder niets, want firewallregels sluiten dit segment af van elk ander VLAN.' },
      core: { label: 'Kernnetwerk', blurb: 'De gateway en switches die tussen de VLAN’s routeren.' },
    },
    nodes: {
      internet: { label: 'Internet', sub: 'Publieke rand',
        detail: 'Inkomend verkeer komt aan op één publiek adres en gaat meteen naar de gateway, dus niets daarachter is direct bereikbaar.' },
      udm: { label: 'UDM Pro', sub: 'Gateway, firewall, RADIUS',
        detail: 'De UniFi Dream Machine Pro is de gateway, firewall, netwerkcontroller en RADIUS-server. Hij bepaalt welk VLAN bij welk ander kan, en authenticeert de WPA3-Enterprise-wifi.' },
      sw1: { label: 'USW Pro Max 24', sub: 'Serverrack',
        detail: 'Deze switch met 24 poorten zit in het serverrack, en elke server is erop aangesloten met een redundant paar verbindingen.' },
      sw2: { label: 'USW Flex 2.5G', sub: 'Algemeen',
        detail: 'Deze 2,5 Gb-switch verbindt de snellere apparaten die we in het appartement elke dag gebruiken.' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'Voedt de AP’s',
        detail: 'Deze PoE-switch met 8 poorten verbindt en voedt de vijf access points, met één kabel per stuk.' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'De Unraid-server heeft een eigen VLAN. Vertrouwde VLAN’s kunnen erbij voor opslag en apps, het IoT-VLAN niet.' },
      caca: { label: 'CaCa', sub: 'Altijd aan',
        detail: 'CaCa is de Proxmox-node die aan blijft, en hij deelt het server-VLAN met Adell.' },
      adell: { label: 'Adell', sub: 'Op afroep',
        detail: 'Adell is de Proxmox-node die ik wek als ik hem nodig heb, en hij deelt het server-VLAN met CaCa voor live migratie en opstarten via PXE.' },
      clients: { label: 'Werkplekken', sub: 'Laptops, desktops',
        detail: 'Apparaten voor elke dag zitten op het standaard-VLAN, waar ze bij de servers kunnen, maar het IoT-VLAN niet bij hen.' },
      aps: { label: '5 UniFi-AP’s', sub: 'Wifi',
        detail: 'Vijf access points zenden twee aparte wifinetwerken uit door het hele appartement, gevoed via PoE vanaf de Lite 8.' },
      wmain: { label: 'Hoofd-WLAN', sub: 'WPA3-Enterprise',
        detail: 'De hoofdwifi gebruikt WPA3-Enterprise met RADIUS op de UDM Pro, dus elk apparaat heeft zijn eigen inloggegevens.' },
      wiot: { label: 'IoT-WLAN', sub: 'Geïsoleerd',
        detail: 'Slimme apparaten krijgen toegang tot internet en verder niets, want firewallregels sluiten ze af van elk ander VLAN.' },
    },
  },

  storage: {
    eyebrow: 'Opslag en VM’s',
    title: 'Opslag en virtuele machines',
    poolsTitle: 'Opslag op NewMain',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'Array',
      sub: 'Unraid, met pariteit',
      body: 'Hij heeft twee pariteitsschijven en drie dataschijven, dus hij overleeft twee kapotte schijven tegelijk, en hij bewaart PXE-back-ups, archieven en media.',
    },
    fast: {
      name: 'Snelle pool',
      sub: 'ZFS-NVMe-mirror',
      body: 'Twee NVMe-schijven van 2 TB vormen een ZFS-mirror, waar de appdata van Docker, de VM-schijven en de PXE-ISO-bibliotheek vanaf draaien.',
    },
    sharedOver: 'Gedeeld via',
    protocols: ['SFTP', 'SMB op het lokale netwerk', 'NFS naar Linux en macOS'],
    clusterTitle: 'Het Proxmox-cluster',
    clusterLead: 'CaCa en Adell vormen samen één Proxmox-cluster. CaCa start op vanaf zijn eigen SSD van 1 TB en blijft aan, terwijl Adell via het netwerk opstart zonder lokale OS-schijf en ik hem wek als ik zijn cores nodig heb.',
    vms: [
      { k: 'claudeplayground', d: 'Een Ubuntu-VM waar ik de apps die ik bouw op deploy, en Claude heeft SSH-toegang om ze uit te rollen.' },
      { k: 'CasaOS en Debian', d: 'Deze VM’s draaiden vroeger direct op de hardware.' },
      { k: 'Wake-on-LAN', d: 'UpSnap zet Adell aan als een klus hem nodig heeft, dus hij verbruikt alleen stroom terwijl hij werkt.' },
    ],
  },

  stack: {
    eyebrow: 'Software',
    title: 'Diensten',
    lead: 'Dit zijn de belangrijkste diensten van de 38, en de publieke laten een live status zien die één keer per minuut wordt gecheckt.',
    filterLabel: 'Diensten filteren',
    categories: {
      all: 'Alle',
      access: 'Toegang',
      files: 'Bestanden',
      media: 'Media en tools',
      monitoring: 'Monitoring',
      projects: 'Voor projecten',
    },
    checkedAt: 'Gecheckt om {time}',
    checking: 'Status checken',
    showFewer: 'Minder tonen',
    showAll: 'Alle {n} diensten tonen',
    status: { up: 'online', down: 'offline', wait: 'checken', build: 'in aanbouw', self: 'privé' },
    loadLabel: 'Belasting: {label}',
    weights: {
      extreme: 'Zwaarst',
      'very-high': 'Zeer hoog',
      high: 'Hoog',
      moderate: 'Gemiddeld',
      low: 'Licht',
      dev: 'In ontwikkeling',
      diagnostic: 'Op afroep',
    },
    facts: { runsOn: 'Draait op', load: 'Belasting', access: 'Toegang', category: 'Categorie' },
    access: {
      public: 'Publiek, via Nginx Proxy Manager en CrowdSec',
      dev: 'In ontwikkeling op NewMain',
      private: 'Privé, op het Tailscale-netwerk',
    },
    visit: 'Ga naar {host}',
  },

  services: {
    openclaw: {
      blurb: 'Ik bouw nu aan OpenClaw, een runner waarmee AI-agents echte taken op het lab kunnen doen, en hij is nog niet af.',
      long: [
        'Het doel is een agent een veilige plek in het lab te geven, waar hij een container kan starten, een dienst kan checken, een kleine app kan deployen en kan terugmelden.',
        'Het volgt op de SSH-toegang die Claude al heeft tot een VM om mijn apps te deployen, en de volgende stap is hem zelf stukken van het lab te laten draaien terwijl ik de resultaten nakijk.',
      ],
    },
    npm: {
      blurb: 'Hij staat als reverse proxy voor elke publieke dienst. Hij handelt SSL af, stuurt elk subdomein van chiambucket.com naar zijn container en draait een CrowdSec-bouncer die vijandige IP’s blokkeert.',
      long: [
        'Al het publieke verkeer komt aan op één adres en gaat eerst naar NPM, dus geen enkele container staat direct open voor internet.',
        'CrowdSec houdt het verkeer in de gaten op aanvalspatronen en blokkeert de bron. Omdat alles via NPM loopt, gaat elke publieke dienst plat zodra NPM platgaat.',
      ],
    },
    tailscale: { blurb: 'Een WireGuard-mesh die al mijn apparaten op één privénetwerk zet, en die ik gebruik om overal vandaan via SSH in te loggen en configs te bewerken.' },
    shadowsocks: { blurb: 'Een proxy die mijn verkeer eruit laat zien als gewone HTTPS, zodat ik vanaf afgeschermde schoolnetwerken thuis kan komen.' },
    twingate: { blurb: 'Een zero-trust-connector die ik als extra toegang houd, naast Teleport, WireGuard en Unraid Connect.' },
    pihole: { blurb: 'Hij blokkeert advertenties en trackers op DNS-niveau voor het hele netwerk, al gebruik ik hem nu vooral om problemen op te sporen.' },
    immich: {
      blurb: 'Immich vervangt Google Foto’s als mijn fotobibliotheek, met automatische back-ups van mijn telefoon, zoeken en albums, en het is de dienst die ik het meest gebruik.',
      long: [
        'Elke foto en video van mijn telefoon wordt hier automatisch geback-upt en blijft op mijn eigen opslag.',
        'Het is de zwaarste dienst op NewMain. De GTX 1070 draait de machine learning voor het zoeken en het groeperen van gezichten, en door het goed te dimensioneren leerde ik hoe je CPU, GPU, geheugen en opslag budgetteert voor een echte werklast.',
      ],
    },
    lychee: { blurb: 'Lychee is de fotogalerij achter de fotografiepagina op deze site.' },
    pingvin: { blurb: 'Hier upload ik bestanden die te groot zijn voor chatapps, en dan krijg ik een link om te versturen.' },
    pairdrop: { blurb: 'Het stuurt een bestand tussen twee willekeurige apparaten vanuit de browser, net als AirDrop, zonder accounts.' },
    fbq: {
      blurb: 'Het geeft me toegang via de browser en deellinks voor dezelfde bestanden die ik thuis via NFS en SMB gebruik.',
      long: ['Hiervoor gebruikte ik Nextcloud, de originele FileBrowser, Alist en SFTPGo, en dit is degene die ik heb gehouden.'],
    },
    syncthing: { blurb: 'Het houdt bestanden de hele tijd gelijk tussen mijn apparaten, met versiebeheer.' },
    fireshare: { blurb: 'Mijn vrienden en ik uploaden en delen hier gameclips, zonder uploadlimiet.' },
    neko: { blurb: 'Het draait een gedeelde browser in een tabblad, zodat we in dezelfde ruimte kunnen meekijken of samen iets uitzoeken op één scherm.' },
    crafty: { blurb: 'Crafty beheert mijn Minecraft-servers, en het draait op twee plekken, zodat een wereld altijd kan worden gestart.' },
    paperless: { blurb: 'Een documentarchief dat elke pdf en scan door OCR haalt, zodat ik ze vanaf elk apparaat kan doorzoeken.' },
    vscode: { blurb: 'Het draait VS Code in de browser, zodat ik configbestanden op de server kan bewerken.' },
    upstat: { blurb: 'Het houdt de uptime en reactietijd van elke dienst en container bij, zodat ik als eerste van problemen hoor.' },
    netdata: { blurb: 'Het legt per seconde statistieken vast voor de CPU, schijven, het netwerk en containers.' },
    upsnap: { blurb: 'Een Wake-on-LAN-paneel, en zo zet ik Adell aan.' },
    openspeedtest: { blurb: 'Een zelfgehoste snelheidstest die de doorvoer meet tussen de server en waar ik ook ben.' },
    portainer: { blurb: 'Het geeft me een web-UI voor Docker op zowel de Unraid-host als de CasaOS-VM.' },
    coturn: {
      blurb: 'Ik zette deze TURN- en STUN-server op voor Project June, zodat zijn drie WebRTC-camerastreams door de NAT van het mobiele netwerk komen.',
      long: [
        'Project June streamt drie live camerabeelden via 5G, maar mobiele netwerken zetten apparaten achter lagen NAT waar WebRTC in z’n eentje niet doorheen komt.',
        'Mijn eigen TURN- en STUN-server geeft de streams een vast publiek adres om elkaar te ontmoeten, zodat ik de rover overal vandaan kan besturen, en hij gebruikt weinig CPU.',
      ],
    },
    mosquitto: { blurb: 'Ik zette deze MQTT-broker eerst op voor de telemetrie en besturing van Project June, en nu draagt hij berichten tussen mijn ESP32-schoolprojecten en hun dashboards.' },
    nginx: { blurb: 'Twee kleine nginx-containers serveren mijn statische sites en projectdemo’s.' },
  },

  access: {
    eyebrow: 'Toegang op afstand',
    title: 'Zes wegen naar binnen',
    lead: 'Ik houd zes losse manieren om van buitenaf binnen te komen, zodat ik niet buitengesloten ben als er een kapotgaat.',
    primary: 'Primair',
    methods: {
      tailscale: { type: 'Mesh-vpn', note: 'Een WireGuard-mesh met één login op al mijn apparaten, en degene die ik elke dag gebruik.' },
      wireguard: { type: 'Tunnel', note: 'Een gewone versleutelde tunnel het netwerk in, zonder derde partij ertussen.' },
      teleport: { type: 'Ingebouwde vpn', note: 'De UDM Pro geeft deze vpn zelf uit, dus er is geen client om in te stellen.' },
      twingate: { type: 'Zero trust', note: 'Het controleert toegang per identiteit en houdt elke inkomende poort dicht.' },
      shadowsocks: { type: 'Proxy', note: 'Het laat mijn verkeer eruitzien als HTTPS, zodat ik door afgeschermde wifi op school en kantoor heen kom.' },
      unraidConnect: { type: 'Dienst van Unraid', note: 'Het geeft me via mijn Unraid-account direct toegang tot de Unraid-server.' },
    },
    home: { type: 'Het rack', note: 'Elk pad hierboven eindigt hier.' },
  },

  cta: {
    title: 'Waar ik nu aan bouw',
    sub: 'Ik bouw aan OpenClaw, een runner waarmee AI-agents echte taken op het lab kunnen doen, zoals een container starten, een dienst checken, een kleine app deployen en terugmelden, maar hij is nog niet af.',
    projects: 'Bekijk mijn projecten',
    contact: 'Neem contact op',
  },
};

export default nl;
