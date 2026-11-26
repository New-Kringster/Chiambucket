import type { HomelabCopy } from './en';

/* De Nederlandse woorden van de homelabpagina, in dezelfde vorm als en.tsx. */
const nl: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Mijn thuiscloud wordt gerund door AI-agents op braven-agents, een server die de andere machines, het UniFi-netwerk en externe platforms zoals Cloudflare bestuurt. Op deze pagina zie je hoe alles samenhangt, de machines, de diensten en hun live status.',
  },
  jsonLd: {
    headline: 'Een thuiscloud gerund door AI-agents',
    about: ['Selfhosting', 'AI-agents', 'Infrastructuurautomatisering', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: 'Details van {name}',
  close: 'Sluiten',

  hero: {
    tag: 'Infrastructuur',
    title: 'Agent-first HomeLab',
    sub: 'Elke machine, elk netwerk en elke dienst hier wordt gerund door AI-agents op één server.',
    scroll: 'Scroll',
  },

  core: {
    title: 'Alles loopt via braven-agents',
    lead: 'braven-agents heeft de sleutels van elk ander systeem, en de agents erop bereiken elk systeem via zijn eigen API of via SSH, dus de meeste wijzigingen gebeuren vanuit een prompt zonder dat ik iets hoef aan te raken.',
    hint: 'Kies een systeem om te zien wat de agents daar doen.',
    mapLabel: 'Hoe braven-agents met elk ander systeem verbonden is',
    coreTag: 'De kern',
    coreRole: 'Hij draait Claude Code, Codex en OpenCode, plus Hermes voor geplande taken, en in T3 Code start en volg ik hun werk.',
    groups: { machines: 'Machines', edge: 'Netwerk en edge', platforms: 'Platforms' },
    doesLabel: 'Wat de agents hier doen',
    planned: 'Gepland',
    proxmoxName: 'Proxmox-server',
    nodes: {
      newmain: { role: 'Opslag en zelfgehoste diensten', via: 'Unraid API',
        does: ['Docker-containers starten, updaten en herstarten', 'De array en de gezondheid van elke schijf in de gaten houden', 'Shares en virtuele machines aanmaken'] },
      caca: { role: 'Dev-omgeving voor een onaangekondigd project', via: 'SSH',
        does: ['Het project bouwen en testen', 'Zijn tools en pakketten up-to-date houden'] },
      servertop: { role: 'Brug naar mijn iCloud', via: 'SSH',
        does: ['Afspraken in mijn agenda’s lezen en toevoegen', 'Herinneringen lezen en toevoegen', 'Andere iCloud-taken doen waar een Mac voor nodig is'] },
      blade: { role: 'GPU-taken', via: 'SSH',
        does: ['Trainingsjobs draaien op de RTX 3080, zoals de runs waarmee DrumNet is getraind', 'Grotere modellen en ander zwaar GPU-werk draaien'] },
      proxmox: { role: 'Virtuele machines, hardware nog te bepalen', via: 'Draait nog niet',
        does: ['Hij wordt nog in elkaar gezet, dus er draait nog niets op.'] },
      unifi: { role: 'Het hele thuisnetwerk', via: 'UniFi API',
        does: ['Netwerken en VLAN’s aanmaken', 'Firewallregels en port forwards toevoegen', 'Verbonden apparaten opzoeken en beheren'] },
      npm: { role: 'Reverse proxy voor publieke diensten', via: 'NPM API',
        does: ['Een proxy host toevoegen voor elk nieuw subdomein', 'SSL-certificaten uitgeven en vernieuwen', 'Instellen wie bij een dienst kan'] },
      cloudflare: { role: 'DNS en edge-diensten', via: 'Cloudflare API',
        does: ['DNS-records aanmaken en wijzigen', 'Cloudflare Tunnels openen voor nieuwe apps', 'Workers deployen en R2-opslag beheren'] },
      github: { role: 'Mijn code', via: 'GitHub CLI',
        does: ['Repositories, branches en pull requests aanmaken', 'De wijzigingen pushen die ze maken'] },
      vercel: { role: 'Hosting voor deze site', via: 'Vercel API',
        does: ['Previews deployen en checken of builds slagen', 'Deze site live zetten als ik erom vraag'] },
      shebang: { role: 'Mijn hostingplatform', via: 'Shebang MCP',
        does: ['Pagina’s en bestanden publiceren', 'Een nieuwe app een eigen database en login geven'] },
    },
  },

  prompt: {
    tag: 'Eén prompt',
    title: 'Van één prompt naar een draaiende app',
    lead: 'Als ik om iets nieuws vraag, werken de agents zelf elk systeem af waar het mee te maken heeft.',
    stepOf: 'Stap {n} van {total}',
    done: 'Live op notes.chiambucket.com',
    requestLabel: 'Het verzoek',
    request: 'Zet mijn nieuwe notities-app online op notes.chiambucket.com.',
    steps: [
      { at: 'braven-agents', t: 'Een agent schrijft de app en het Docker Compose-bestand en test hem daarna.' },
      { at: 'NewMain', t: 'Hij start de app als container op NewMain.' },
      { at: 'Nginx Proxy Manager', t: 'Hij voegt een proxy host toe voor het nieuwe subdomein en haalt er een SSL-certificaat voor op.' },
      { at: 'Cloudflare', t: 'Hij maakt het DNS-record aan dat het subdomein naar huis laat wijzen.' },
      { at: 'UniFi', t: 'Als de app een poort of een firewallregel nodig heeft, voegt hij die toe op de router.' },
      { at: 'braven-agents', t: 'Hij opent het adres om te checken of de app antwoordt en stuurt me dan de link.' },
    ],
    ownTitle: 'Uit zichzelf',
    own: 'Elke dag draait er een health check die zelf oplost wat hij kan, dus hij herstart containers, diensten en virtuele machines die gestopt zijn en koppelt schijven opnieuw die zijn weggevallen.',
    waitTitle: 'Wat nog op mij wacht',
    wait: 'Voor data verwijderen, werken aan de opslagarray en machines herstarten is nog steeds mijn goedkeuring nodig, en de tools vragen het eerst voordat ze iets destructiefs doen.',
  },

  machines: {
    tag: 'Hardware',
    title: 'De machines',
    photoAlt: 'De {name}',
    lead: 'Er draaien vijf machines, en een zesde staat nog op de planning.',
    planned: 'Gepland',
    items: {
      agents: {
        name: 'braven-agents', role: 'De kern',
        blurb: 'Dit is de krachtigste machine hier, en hij draait Ubuntu direct op de hardware, zodat de agents hem helemaal voor zichzelf hebben.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X, 16 cores' },
          { k: 'Geheugen', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: 'Opslag', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'Opslag en diensten',
        blurb: 'NewMain bewaart mijn bestanden, foto’s en back-ups op vijf harde schijven in een Unraid-array met pariteit, en draait in Docker de zelfgehoste diensten die je verderop op deze pagina ziet.',
        specs: [
          { k: 'OS', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 cores' },
          { k: 'Geheugen', v: '128 GB DDR3' },
          { k: 'Array', v: '5 harde schijven, met pariteit' },
          { k: 'Controller', v: 'PERC H710P in IT-modus' },
        ],
      },
      caca: {
        name: 'CaCa', role: 'Dev-omgeving',
        blurb: 'CaCa is een kleine ThinkCentre die dient als ontwikkelomgeving voor een project waar ik nog niets over kan vertellen.',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'Geheugen', v: '32 GB DDR4' },
          { k: 'Opslag', v: '1 TB NVMe-SSD' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'iCloud-brug',
        blurb: 'Servertop is een MacBook Air die ingelogd blijft op mijn iCloud, zodat de agents via hem bij mijn agenda’s, herinneringen en andere persoonlijke dingen kunnen.',
        specs: [
          { k: 'Model', v: 'MacBook Air, M1' },
          { k: 'Geheugen', v: '8 GB' },
          { k: 'Opslag', v: '256 GB SSD' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'GPU-machine',
        blurb: 'Deze laptop draait Ubuntu en neemt het zware GPU-werk op zich, en het is dezelfde machine die DrumNet heeft getraind voor de OCR Reader.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Core i7, 10e generatie' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'Geheugen', v: '32 GB' },
          { k: 'Opslag', v: '2 × 1 TB SSD' },
        ],
      },
      proxmox: {
        name: 'Proxmox-server', role: 'Virtuele machines',
        blurb: 'Er wordt nog een nieuwe Proxmox-server in elkaar gezet, en welke hardware erin komt, staat nog niet vast.',
        specs: [
          { k: 'OS', v: 'Proxmox VE' },
          { k: 'Hardware', v: 'Nog te bepalen' },
        ],
      },
    },
    rack: {
      alt: 'Het rack in mijn kamer, met het patchpaneel en de blauwe kabels bovenaan en de servers achter een gaasdeur',
      caption: 'braven-agents, NewMain en CaCa delen dit rack in mijn kamer.',
    },
  },

  stack: {
    tag: 'Software',
    title: 'Wat erop draait',
    lead: 'NewMain draait deze diensten voor mij en mijn projecten. Kies er een om te zien wat hij doet.',
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
    status: { up: 'Online', down: 'Offline', wait: 'Checken', self: 'Privé' },
    loadLabel: 'Belasting: {label}',
    weights: {
      extreme: 'Zwaarst',
      'very-high': 'Zeer hoog',
      high: 'Hoog',
      moderate: 'Gemiddeld',
      low: 'Licht',
      diagnostic: 'Op afroep',
    },
    facts: { runsOn: 'Draait op', load: 'Belasting', access: 'Toegang', category: 'Categorie' },
    access: {
      public: 'Publiek, via Nginx Proxy Manager en CrowdSec',
      private: 'Privé, op het Tailscale-netwerk',
    },
    visit: 'Ga naar {host}',
  },

  services: {
    npm: {
      blurb: 'Hij staat als reverse proxy voor elke publieke dienst. Hij handelt SSL af, stuurt elk subdomein van chiambucket.com naar zijn container en draait een CrowdSec-bouncer die vijandige IP’s blokkeert.',
      long: [
        'Al het publieke verkeer komt aan op één adres en gaat eerst naar NPM, dus geen enkele container staat direct open voor internet.',
        'CrowdSec houdt het verkeer in de gaten op aanvalspatronen en blokkeert de bron. Omdat alles via NPM loopt, gaat elke publieke dienst plat zodra NPM platgaat.',
      ],
    },
    tailscale: { blurb: 'Het is een WireGuard-mesh die al mijn apparaten op één privénetwerk zet, en die ik gebruik om overal vandaan thuis te komen.' },
    shadowsocks: { blurb: 'Het is een proxy die mijn verkeer eruit laat zien als gewone HTTPS, zodat ik vanaf afgeschermde schoolnetwerken thuis kan komen.' },
    twingate: { blurb: 'Het is een zero-trust-connector die ik als extra toegang houd, naast Tailscale, WireGuard en UniFi Teleport.' },
    pihole: { blurb: 'Hij blokkeert advertenties en trackers op DNS-niveau voor het hele netwerk, al gebruik ik hem nu vooral om problemen op te sporen.' },
    immich: {
      blurb: 'Immich vervangt Google Foto’s als mijn fotobibliotheek, met automatische back-ups van mijn telefoon, zoeken en albums, en het is de dienst die ik het meest gebruik.',
      long: [
        'Elke foto en video van mijn telefoon wordt hier automatisch geback-upt en blijft op mijn eigen opslag.',
        'Het is de zwaarste dienst op NewMain, en door hem goed te dimensioneren leerde ik hoe je CPU, geheugen en opslag budgetteert voor een echte werklast.',
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
    crafty: { blurb: 'Crafty beheert mijn Minecraft-servers.' },
    paperless: { blurb: 'Het is een documentarchief dat elke pdf en scan door OCR haalt, zodat ik ze vanaf elk apparaat kan doorzoeken.' },
    vscode: { blurb: 'Het draait VS Code in de browser, zodat ik configbestanden op de server kan bewerken.' },
    upstat: { blurb: 'Het houdt de uptime en reactietijd van elke dienst en container bij, zodat problemen vroeg opvallen.' },
    netdata: { blurb: 'Het legt per seconde statistieken vast voor de CPU, schijven, het netwerk en containers.' },
    upsnap: { blurb: 'Het is een Wake-on-LAN-paneel dat machines aanzet die slapen.' },
    openspeedtest: { blurb: 'Het is een zelfgehoste snelheidstest die de doorvoer meet tussen de server en waar ik ook ben.' },
    portainer: { blurb: 'Het geeft me een web-UI voor de Docker-containers op NewMain.' },
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

  tubs: {
    tag: 'Waar ik aan bouw',
    title: 'Shebang Tubs',
    status: 'Vroeg, in ontwikkeling',
    lead: 'Shebang Tubs is een project en framework waar ik aan bouw, zodat iedereen met agents zijn eigen apps kan bouwen en zelf hosten.',
    body: [
      'Elke app is een tub, één map met een gewoon Compose-bestand en een eigen database, bestanden en secrets, zodat een agent hem kan bouwen, draaien en als één zip met al zijn data naar een andere machine kan verhuizen.',
      'Een dashboard deployt, start en stopt de tubs, en publiceer je er een, dan krijgt hij via Cloudflare Tunnel een webadres, zonder port forward of reverse proxy. Agents krijgen een API-key, dus ze kunnen dit allemaal zelf doen.',
    ],
    diagram: {
      label: 'Wat een tub bevat en waar hij heen kan',
      tub: 'Eén tub',
      parts: ['Compose-bestand', 'Database', 'Bestanden', 'Secrets'],
      zip: 'Geëxporteerd als één zip',
      runs: 'Draait op elke machine met Docker',
      publish: 'Gepubliceerd via Cloudflare Tunnel',
    },
  },

  cta: {
    title: 'Waar dit naartoe gaat',
    sub: 'Het doel is een persoonlijke cloud die voor zichzelf zorgt en alles kan bouwen en draaien vanuit één prompt. De meeste stukjes zijn er nu, en het volgende is de nieuwe Proxmox-server.',
    projects: 'Mijn projecten',
    contact: 'Contact',
  },
};

export default nl;
