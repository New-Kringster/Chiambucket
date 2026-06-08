/* ────────────────────────────────────────────────────────────────
   Homelab page content. Specs reflect a read-only SSH snapshot of
   NewMain (Unraid 7.1.2) plus the operator's notes. Keep copy free of
   em dashes (project rule). `statusKey` marks publicly reachable
   services that the /api/homelab-status route pings for a live dot.
   ──────────────────────────────────────────────────────────────── */

export type Weight = 'extreme' | 'very-high' | 'high' | 'moderate' | 'low' | 'dev' | 'diagnostic';

export const WEIGHT_META: Record<Weight, { label: string; level: number }> = {
  extreme:     { label: 'Extreme load',  level: 5 },
  'very-high': { label: 'Very high',     level: 5 },
  high:        { label: 'High',          level: 4 },
  moderate:    { label: 'Moderate',      level: 3 },
  low:         { label: 'Light',         level: 1 },
  dev:         { label: 'In development', level: 2 },
  diagnostic:  { label: 'On demand',     level: 2 },
};

export interface ServerDetail {
  tagline: string;
  story: string[];                       // expanded narrative paragraphs
  highlights: string[];                  // quick "what makes it matter" bullets
  visual: 'runs' | 'pxe' | 'wake';       // which animated explainer to render
}

export interface Server {
  id: string;
  name: string;
  tag: string;
  photo: string;
  role: string;
  status: 'always-on' | 'on-demand';
  statusLabel: string;
  specs: { k: string; v: string }[];
  blurb: string;
  detail: ServerDetail;
}

export const SERVERS: Server[] = [
  {
    id: 'newmain',
    name: 'NewMain',
    tag: 'Primary node',
    photo: '/images/hl-newmain.png',
    role: 'Storage + compute',
    status: 'always-on',
    statusLabel: 'Online 24/7',
    specs: [
      { k: 'OS', v: 'Unraid 7.1.2' },
      { k: 'CPU', v: 'Ryzen 9 5950X · 16C/32T' },
      { k: 'Memory', v: '64 GB DDR4' },
      { k: 'GPU', v: 'GTX 1070 8 GB' },
      { k: 'Array', v: '2 parity + 3 data' },
      { k: 'Fast pool', v: '2× 2TB NVMe · ZFS mirror' },
    ],
    blurb:
      'The workhorse. Unraid drives a parity-protected array for bulk data plus a ZFS NVMe mirror for anything that needs speed, and it hosts the bulk of the Docker stack. Almost everything you reach on the network ends up here.',
    detail: {
      tagline: 'The workhorse that holds it all.',
      story: [
        'NewMain is the heart of the rack. Unraid lets me pool mismatched drives into one parity-protected array for bulk data, while a separate ZFS mirror of two NVMe drives handles anything that needs real speed: Docker app-data, databases and the containers that cannot wait on spinning disks.',
        'Almost every service on this page runs here. When you open a photo, drop a file, or hit any chiambucket.com subdomain, this is the machine that answers. The GTX 1070 inside it does the heavy pixel work too: video transcoding and the face recognition that powers Immich photo search.',
        'It is the one node I keep boring on purpose. Boring means it stays up, and everything else leans on it.',
      ],
      highlights: [
        'Parity array survives a two-drive failure',
        'ZFS NVMe mirror for hot app-data and VM disks',
        'Hosts the bulk of the Docker stack',
        'GTX 1070 drives Immich face recognition, ML and transcoding',
      ],
      visual: 'runs',
    },
  },
  {
    id: 'caca',
    name: 'CaCa',
    tag: 'PXE node · always on',
    photo: '/images/hl-caca.png',
    role: 'Proxmox PXE cluster',
    status: 'always-on',
    statusLabel: 'Online 24/7',
    specs: [
      { k: 'OS', v: 'Proxmox VE' },
      { k: 'CPU', v: 'Core i7-6700T' },
      { k: 'Memory', v: '32 GB DDR4' },
      { k: 'Boot', v: 'PXE network boot' },
      { k: 'Hosts', v: 'CasaOS + Debian VMs' },
    ],
    blurb:
      'A tiny ThinkCentre that used to be my main server. It now runs the always on half of a Proxmox PXE cluster, hosting the CasaOS and Debian virtual machines that used to live on bare metal.',
    detail: {
      tagline: 'Small, silent, always on.',
      story: [
        'CaCa is a tiny ThinkCentre that used to be my main server. Instead of retiring it, I turned it into the always-on half of a Proxmox PXE cluster.',
        'It carries no operating system of its own. It network-boots over PXE, pulling its disk over the wire instead of off a local drive, then runs the CasaOS and Debian virtual machines that used to live on bare metal.',
        'Because it sips power, this is the node that stays awake around the clock, so something is always listening even when the heavy iron is asleep.',
      ],
      highlights: [
        'No local OS drive, pure PXE network boot',
        'Hosts the CasaOS and Debian VMs',
        'Low power draw, online 24/7',
        'Clusters with Adell for live migration',
      ],
      visual: 'pxe',
    },
  },
  {
    id: 'adell',
    name: 'Adell',
    tag: 'PXE node · on demand',
    photo: '/images/hl-adell.png',
    role: 'Proxmox PXE cluster',
    status: 'on-demand',
    statusLabel: 'Wakes on demand',
    specs: [
      { k: 'OS', v: 'Proxmox VE' },
      { k: 'CPU', v: '2× Xeon E5-2470 v2 · 20C' },
      { k: 'Memory', v: '128 GB DDR3' },
      { k: 'Storage', v: 'Perc H710P · IT mode' },
      { k: 'Power', v: 'Wake-on-LAN only' },
    ],
    blurb:
      'The heavy iron. Twenty Xeon cores and 128 GB of RAM, joined to the same PXE cluster as CaCa. It is hungry, so it stays asleep and only wakes through UpSnap when a job actually needs the muscle.',
    detail: {
      tagline: 'Heavy iron, only when it earns it.',
      story: [
        'Adell is the muscle: twenty Xeon cores and 128 GB of RAM in the same Proxmox cluster as CaCa. That power is hungry, so it does not run around the clock.',
        'It sleeps until a job actually needs it. One button in UpSnap sends a Wake-on-LAN packet, Adell boots over the network, does the heavy lifting, then drops back to sleep.',
        'It is my lesson in spending watts deliberately: capacity on tap, not capacity always burning.',
      ],
      highlights: [
        'Twenty Xeon cores, 128 GB RAM',
        'Wakes on demand via Wake-on-LAN',
        'PXE-booted, no local OS drive',
        'Idle and near-silent until a heavy job lands',
      ],
      visual: 'wake',
    },
  },
];

export interface Service {
  name: string;
  icon: string;
  iconRound?: boolean;
  category: string;
  weight: Weight;
  hosts: string[];
  blurb: string;
  url?: string;        // public link shown on the card
  statusKey?: string;  // hostname pinged by the live-status route
  featured?: boolean;  // the current build, surfaced first with an accent
  long?: string[];     // deeper explanation shown in the detail modal
}

export const CATEGORIES = [
  'Edge & Access',
  'Files & Sharing',
  'Media & Collaboration',
  'Monitoring & Ops',
  'Project Backbone',
] as const;

export const SERVICES: Service[] = [
  // ── Featured · current build ──
  {
    name: 'OpenClaw', icon: '/images/openclaw-icon.webp', category: 'Project Backbone', weight: 'dev', hosts: ['NewMain'], featured: true,
    blurb: 'My current build. An agentic workflow runner I am wiring up so agents can drive real tasks against the lab, the rack teaching itself to run itself. Very much under construction.',
    long: [
      'OpenClaw is the project I am actively building right now. The idea is to give an agent a safe seat inside the lab so it can run real jobs: spin up a container, check a service, ship a small app, and report back.',
      'It is the natural next step after wiring Claude into a VM I can SSH into. Instead of me being the one who clicks every button, the lab starts to operate parts of itself, with me watching the results.',
    ],
  },

  // ── Edge & Access ──
  {
    name: 'Nginx Proxy Manager', icon: '/images/npm-icon.webp', category: 'Edge & Access', weight: 'very-high', hosts: ['NewMain'],
    blurb: 'The front door. Every container points here. NPM terminates SSL and routes each chiambucket.com subdomain to the right service, now hardened with a CrowdSec bouncer that auto bans hostile traffic.',
    long: [
      'Everything public goes through here first. One inbound address hits NPM, which terminates SSL and forwards each chiambucket.com subdomain to the right container behind it, so nothing else is ever exposed directly.',
      'The CrowdSec bouncer sits in front and watches for the patterns of an attack, then quietly bans the source before it becomes a problem. It is the single most important box to keep healthy, because if it falls over, everything public goes with it.',
    ],
  },
  {
    name: 'Tailscale', icon: '/images/tailscale-icon.webp', category: 'Edge & Access', weight: 'high', hosts: ['NewMain'],
    blurb: 'A WireGuard mesh that drops every device onto one private network. It is how I SSH home, edit configs, and get a free personal VPN from anywhere.',
  },
  {
    name: 'Shadowsocks', icon: '/images/shadowsocks-icon.png', iconRound: true, category: 'Edge & Access', weight: 'high', hosts: ['NewMain'],
    blurb: 'A proxy that disguises my traffic as ordinary HTTPS to the server, so a locked down school network still lets me reach the things I need.',
  },
  {
    name: 'Twingate', icon: '/images/twingate-icon.webp', category: 'Edge & Access', weight: 'low', hosts: ['NewMain'],
    blurb: 'A zero trust connector kept around as one more fallback path home, alongside Teleport, WireGuard, and Unraid Connect.',
  },
  {
    name: 'Pi-hole', icon: '/images/pihole-icon.png', iconRound: true, category: 'Edge & Access', weight: 'diagnostic', hosts: ['NewMain'],
    blurb: 'Network wide ad and tracker blocking at the DNS layer. Mostly a troubleshooting tool now, but a satisfying one when it kicks in.',
  },

  // ── Files & Sharing ──
  {
    name: 'Immich', icon: '/images/immich-icon.webp', category: 'Files & Sharing', weight: 'extreme', hosts: ['NewMain'],
    blurb: 'My self-hosted Google Photos. Automatic phone backup, machine learning search, and albums, all on my own storage. The single most used service in the rack.',
    long: [
      'Immich is the reason the whole rack earns its keep. Every photo and video off my phone backs up here automatically, then lives on my own storage instead of a subscription I rent forever.',
      'It is also the heaviest tenant on NewMain. The GTX 1070 accelerates the machine learning behind its search and face grouping, exactly the kind of always-on workload that taught me how to budget CPU, GPU, memory and storage for something real.',
    ],
  },
  {
    name: 'Lychee', icon: '/images/lychee-icon.webp', category: 'Files & Sharing', weight: 'high', hosts: ['NewMain'],
    blurb: 'The high quality gallery that powers the photography page of this very site.',
    url: 'https://photos.chiambucket.com', statusKey: 'photos.chiambucket.com',
  },
  {
    name: 'Pingvin Share', icon: '/images/pingvin-icon.png', iconRound: true, category: 'Files & Sharing', weight: 'high', hosts: ['NewMain'],
    blurb: 'Drop a big file, get a clean link to send. The easiest way to hand someone something too large for chat.',
    url: 'https://share.chiambucket.com', statusKey: 'share.chiambucket.com',
  },
  {
    name: 'PairDrop', icon: '/images/pairdrop-icon.png', iconRound: true, category: 'Files & Sharing', weight: 'high', hosts: ['NewMain'],
    blurb: 'AirDrop for everything. Shoot a file between any two devices on the network, no accounts, no cables.',
    url: 'https://drop.chiambucket.com', statusKey: 'drop.chiambucket.com',
  },
  {
    name: 'File Browser Quantum', icon: '/images/fbq-icon.webp', category: 'Files & Sharing', weight: 'high', hosts: ['NewMain'],
    blurb: 'Web access to the same files I reach over NFS and SMB at home, with link sharing on top. Still the latest stop in a long hunt for the perfect browser, after Nextcloud, FileBrowser, Alist, and SFTPGo.',
    long: [
      'This is the current answer to a question I keep re-asking: what is the cleanest way to get at my files from a browser? It serves the exact same data I already reach over NFS and SMB, plus shareable links on top.',
      'It earned its spot the hard way, after a run through Nextcloud, the original FileBrowser, Alist and SFTPGo. Each one taught me something about how I actually use storage, and File Browser Quantum is what stuck, for now.',
    ],
  },
  {
    name: 'Syncthing', icon: '/images/syncthing-icon.webp', category: 'Files & Sharing', weight: 'low', hosts: ['NewMain'],
    blurb: 'Continuous, versioned file sync between my devices. Quietly brilliant, it just keeps everything in step.',
  },

  // ── Media & Collaboration ──
  {
    name: 'Fireshare', icon: '/images/fireshare-icon.webp', iconRound: true, category: 'Media & Collaboration', weight: 'moderate', hosts: ['NewMain'],
    blurb: 'A clip locker with no upload limits, so my friends and I can dump game clips and share them freely.',
    url: 'https://clips.chiambucket.com', statusKey: 'clips.chiambucket.com',
  },
  {
    name: 'Neko Rooms', icon: '/images/neko-icon.png', iconRound: true, category: 'Media & Collaboration', weight: 'high', hosts: ['NewMain'],
    blurb: 'A shared browser in a tab. We hop into the same room to watch, research, or collaborate in real time on one screen.',
  },
  {
    name: 'Crafty', icon: '/images/crafty-icon.webp', category: 'Media & Collaboration', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'],
    blurb: 'A no fuss Minecraft server manager, running in two places so a world is always a click from online.',
  },
  {
    name: 'Paperless-NGX', icon: '/images/paperless-icon.webp', category: 'Media & Collaboration', weight: 'low', hosts: ['NewMain'],
    blurb: 'OCR powered document archive. It indexes every PDF and scan so anything is searchable from any device.',
  },
  {
    name: 'VS Code Server', icon: '/images/vscode-icon.webp', category: 'Media & Collaboration', weight: 'low', hosts: ['NewMain'],
    blurb: 'Browser based VS Code for quickly editing config files that live on the server without leaving the tab.',
  },

  // ── Monitoring & Ops ──
  {
    name: 'UpStat', icon: '/images/hl2/upstat-icon.png', category: 'Monitoring & Ops', weight: 'high', hosts: ['NewMain'],
    blurb: 'The watchtower. It tracks uptime and response time for every service and container, so I learn about a problem before anyone else does.',
  },
  {
    name: 'NetData', icon: '/images/netdata-icon.webp', category: 'Monitoring & Ops', weight: 'low', hosts: ['NewMain'],
    blurb: 'Real time, per second telemetry for the whole machine. CPU, disks, network, containers, all flawless so far.',
  },
  {
    name: 'UpSnap', icon: '/images/upsnap-icon.webp', category: 'Monitoring & Ops', weight: 'high', hosts: ['NewMain'],
    blurb: 'A tidy Wake-on-LAN panel. One button here is what powers Adell up from sleep when a heavy job needs it.',
  },
  {
    name: 'OpenSpeedTest', icon: '/images/ost-icon.webp', category: 'Monitoring & Ops', weight: 'moderate', hosts: ['NewMain'],
    blurb: 'A self-hosted speed test. Genuinely fun to see the throughput between the server and wherever I happen to be.',
    url: 'https://speedtest.chiambucket.com', statusKey: 'speedtest.chiambucket.com',
  },
  {
    name: 'Portainer', icon: '/images/portainer-icon.webp', category: 'Monitoring & Ops', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'],
    blurb: 'A clean Docker cockpit on both the Unraid host and the CasaOS VM, for when the terminal is more than I need.',
  },

  // ── Project Backbone ──
  {
    name: 'coturn', icon: '/images/coturn-icon.png', iconRound: true, category: 'Project Backbone', weight: 'low', hosts: ['NewMain'],
    blurb: 'A TURN and STUN server I stood up for Project June, so its three WebRTC camera streams could punch through cellular NAT.',
    long: [
      'coturn is the clearest example of the homelab feeding a hardware project. Project June streams three live camera feeds over a 5G connection, and cellular networks hide devices behind layers of NAT that WebRTC cannot cross on its own.',
      'Standing up my own TURN and STUN relay gave those streams a fixed point on the public internet to meet at, so the rover could be driven from anywhere. It is a quiet, low-load service that simply has to be there when it counts.',
    ],
  },
  {
    name: 'Mosquitto', icon: '/images/mosquitto-icon.svg', category: 'Project Backbone', weight: 'low', hosts: ['NewMain'],
    blurb: 'An MQTT broker, also born from Project June for telemetry and control. It now carries messages between ESP32 school projects and their dashboards.',
  },
  {
    name: 'Nginx', icon: '/images/nginx-icon.webp', iconRound: true, category: 'Project Backbone', weight: 'high', hosts: ['NewMain'],
    blurb: 'A pair of lightweight nginx containers that serve my self-hosted static sites and project demos.',
  },
];

/* The other ways home, beyond a single VPN. Ordered primary first;
   they all converge on the rack (the terminal "home" node). */
export interface AccessMethod { name: string; type: string; note: string; primary?: boolean }
export const ACCESS_METHODS: AccessMethod[] = [
  { name: 'Tailscale', type: 'Mesh VPN', note: 'A WireGuard mesh and my everyday path in, one identity across every device.', primary: true },
  { name: 'WireGuard', type: 'Raw tunnel', note: 'A bare encrypted tunnel straight into the network when I want no middleman.' },
  { name: 'UniFi Teleport', type: 'Built-in VPN', note: 'A one tap VPN issued straight from the UDM Pro, with no client to configure.' },
  { name: 'Twingate', type: 'Zero trust', note: 'Identity-checked access that leaves no inbound ports open to the internet.' },
  { name: 'Shadowsocks', type: 'Proxy', note: 'HTTPS-shaped traffic that slips home past locked-down school and office Wi-Fi.' },
  { name: 'Unraid Connect', type: 'Vendor link', note: 'A direct line to the Unraid box itself, straight from my account dashboard.' },
];
