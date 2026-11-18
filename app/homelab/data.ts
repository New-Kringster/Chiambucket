/* ────────────────────────────────────────────────────────────────
   Homelab page content. Specs reflect a read-only SSH snapshot of
   NewMain (Unraid 7.1.2) plus the owner's notes. Keep copy free of
   em dashes (project rule). `statusKey` marks publicly reachable
   services that the /api/homelab-status route pings for a live dot.
   ──────────────────────────────────────────────────────────────── */

export type Weight = 'extreme' | 'very-high' | 'high' | 'moderate' | 'low' | 'dev' | 'diagnostic';

export const WEIGHT_META: Record<Weight, { label: string; level: number }> = {
  extreme:     { label: 'Heaviest',      level: 5 },
  'very-high': { label: 'Very high',     level: 5 },
  high:        { label: 'High',          level: 4 },
  moderate:    { label: 'Moderate',      level: 3 },
  low:         { label: 'Light',         level: 1 },
  dev:         { label: 'In development', level: 2 },
  diagnostic:  { label: 'On demand',     level: 2 },
};

export interface ServerDetail {
  tagline: string;
  story: string[];                       // paragraphs shown in the detail dialog
  highlights: string[];                  // short fact bullets
  visual: 'runs' | 'pxe' | 'wake';       // which explainer to render
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
    tag: 'Main server',
    photo: '/images/hl-newmain.png',
    role: 'Storage and most of the Docker stack',
    status: 'always-on',
    statusLabel: 'On 24/7',
    specs: [
      { k: 'OS', v: 'Unraid 7.1.2' },
      { k: 'CPU', v: 'Ryzen 9 5950X, 16 cores' },
      { k: 'Memory', v: '64 GB DDR4' },
      { k: 'GPU', v: 'GTX 1070 8 GB' },
      { k: 'Array', v: '2 parity + 3 data' },
      { k: 'Fast pool', v: '2 × 2 TB NVMe, ZFS mirror' },
    ],
    blurb:
      'This is the main server, where a parity-protected Unraid array holds bulk data, a ZFS NVMe mirror holds anything that needs speed, and most of the Docker containers run.',
    detail: {
      tagline: 'Storage and most of the services',
      story: [
        'Unraid pools mismatched drives into one parity-protected array for bulk data, while a separate ZFS mirror of two NVMe drives holds Docker app data, databases and VM disks.',
        'Almost every service on this page runs here, including everything behind the chiambucket.com subdomains. The GTX 1070 handles video transcoding and the machine learning behind Immich search and face grouping.',
        'I change this machine as little as possible because everything else depends on it.',
      ],
      highlights: [
        'Parity array survives two drives failing at once',
        'ZFS NVMe mirror for app data and VM disks',
        'Runs most of the Docker containers',
        'GTX 1070 for Immich machine learning and transcoding',
      ],
      visual: 'runs',
    },
  },
  {
    id: 'caca',
    name: 'CaCa',
    tag: 'Proxmox node, always on',
    photo: '/images/hl-caca.png',
    role: 'Proxmox cluster, always on',
    status: 'always-on',
    statusLabel: 'On 24/7',
    specs: [
      { k: 'OS', v: 'Proxmox VE' },
      { k: 'CPU', v: 'Core i7-6700T' },
      { k: 'Memory', v: '32 GB DDR4' },
      { k: 'Storage', v: '1 TB NVMe SSD, boot and VMs' },
      { k: 'Boot', v: 'Local NVMe SSD' },
      { k: 'Hosts', v: 'CasaOS and Debian VMs' },
    ],
    blurb:
      'CaCa is a small ThinkCentre that used to be my main server, and it is now the always-on node of a Proxmox cluster, running the CasaOS and Debian VMs from its own 1 TB SSD.',
    detail: {
      tagline: 'The Proxmox node that stays on',
      story: [
        'CaCa was my main server before NewMain, and now it is the always-on half of a two-node Proxmox cluster with Adell.',
        'It boots Proxmox from a 1 TB NVMe SSD inside it, and the CasaOS and Debian virtual machines that used to run on bare metal now run from the same disk.',
        'It draws little power, so it stays on around the clock while Adell sleeps.',
      ],
      highlights: [
        'Boots and runs its VMs from a local 1 TB NVMe SSD',
        'Hosts the CasaOS and Debian VMs',
        'Low power draw, on 24/7',
        'Clusters with Adell for live migration',
      ],
      visual: 'pxe',
    },
  },
  {
    id: 'adell',
    name: 'Adell',
    tag: 'Proxmox node, on demand',
    photo: '/images/hl-adell.png',
    role: 'Proxmox cluster, woken on demand',
    status: 'on-demand',
    statusLabel: 'Off until needed',
    specs: [
      { k: 'OS', v: 'Proxmox VE' },
      { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 cores' },
      { k: 'Memory', v: '128 GB DDR3' },
      { k: 'Storage', v: 'PERC H710P in IT mode' },
      { k: 'Power', v: 'Wake-on-LAN only' },
    ],
    blurb:
      'Adell has twenty Xeon cores and 128 GB of RAM and sits in the same Proxmox cluster as CaCa, but it uses a lot of power, so it stays off until I wake it through UpSnap.',
    detail: {
      tagline: 'The big machine I wake when I need it',
      story: [
        'Adell is the big machine in the cluster, with two Xeons that have twenty cores between them and 128 GB of RAM, so it uses too much power to leave running.',
        'When a job needs it, I press wake in UpSnap, which sends a Wake-on-LAN packet, and Adell boots over the network, runs the job and then goes back to sleep.',
      ],
      highlights: [
        'Twenty Xeon cores, 128 GB RAM',
        'Wakes on demand via Wake-on-LAN',
        'PXE-booted, no local OS drive',
        'Stays off until a job needs it',
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
  featured?: boolean;  // what I am building now, listed first
  long?: string[];     // deeper explanation shown in the detail modal
}

export const CATEGORIES = [
  'Access',
  'Files',
  'Media and tools',
  'Monitoring',
  'For my projects',
] as const;

export const SERVICES: Service[] = [
  {
    name: 'OpenClaw', icon: '/images/openclaw-icon.webp', category: 'For my projects', weight: 'dev', hosts: ['NewMain'], featured: true,
    blurb: 'I am building OpenClaw now, a runner that lets AI agents do real tasks on the lab, and it is not finished yet.',
    long: [
      'The goal is to give an agent a safe place inside the lab where it can start a container, check a service, deploy a small app and report back.',
      'It follows on from giving Claude SSH access to a VM for deploying my apps, and the next step is letting it run parts of the lab while I review the results.',
    ],
  },

  // Access
  {
    name: 'Nginx Proxy Manager', icon: '/images/npm-icon.webp', category: 'Access', weight: 'very-high', hosts: ['NewMain'],
    blurb: 'It sits in front of every public service as the reverse proxy, terminating SSL, routing each chiambucket.com subdomain to its container and running a CrowdSec bouncer that bans hostile IPs.',
    long: [
      'All public traffic arrives at one address and goes to NPM first, so no container is exposed to the internet directly.',
      'CrowdSec watches the traffic for attack patterns and bans the source. Because everything passes through NPM, every public service goes down whenever NPM does.',
    ],
  },
  {
    name: 'Tailscale', icon: '/images/tailscale-icon.webp', category: 'Access', weight: 'high', hosts: ['NewMain'],
    blurb: 'It is a WireGuard mesh that puts all my devices on one private network, which I use to SSH in and edit configs from anywhere.',
  },
  {
    name: 'Shadowsocks', icon: '/images/shadowsocks-icon.png', iconRound: true, category: 'Access', weight: 'high', hosts: ['NewMain'],
    blurb: 'It is a proxy that makes my traffic look like ordinary HTTPS, so I can reach home from restricted school networks.',
  },
  {
    name: 'Twingate', icon: '/images/twingate-icon.webp', category: 'Access', weight: 'low', hosts: ['NewMain'],
    blurb: 'It is a zero trust connector that I keep as another way in, alongside Teleport, WireGuard and Unraid Connect.',
  },
  {
    name: 'Pi-hole', icon: '/images/pihole-icon.png', iconRound: true, category: 'Access', weight: 'diagnostic', hosts: ['NewMain'],
    blurb: 'It blocks ads and trackers at the DNS level for the whole network, though I mostly use it for troubleshooting now.',
  },

  // Files
  {
    name: 'Immich', icon: '/images/immich-icon.webp', category: 'Files', weight: 'extreme', hosts: ['NewMain'],
    blurb: 'Immich replaces Google Photos as my photo library, with automatic phone backups, search and albums, and it is the service I use most.',
    long: [
      'Every photo and video from my phone backs up here automatically and stays on my own storage.',
      'It is the heaviest service on NewMain. The GTX 1070 runs the machine learning for search and face grouping, and sizing it taught me how to budget CPU, GPU, memory and storage for a real workload.',
    ],
  },
  {
    name: 'Lychee', icon: '/images/lychee-icon.webp', category: 'Files', weight: 'high', hosts: ['NewMain'],
    blurb: 'Lychee is the photo gallery behind the photography page on this site.',
    url: 'https://photos.chiambucket.com', statusKey: 'photos.chiambucket.com',
  },
  {
    name: 'Pingvin Share', icon: '/images/pingvin-icon.png', iconRound: true, category: 'Files', weight: 'high', hosts: ['NewMain'],
    blurb: 'I upload files that are too big for chat apps here and get a link to send.',
    url: 'https://share.chiambucket.com', statusKey: 'share.chiambucket.com',
  },
  {
    name: 'PairDrop', icon: '/images/pairdrop-icon.png', iconRound: true, category: 'Files', weight: 'high', hosts: ['NewMain'],
    blurb: 'It sends a file between any two devices from the browser, like AirDrop, without any accounts.',
    url: 'https://drop.chiambucket.com', statusKey: 'drop.chiambucket.com',
  },
  {
    name: 'File Browser Quantum', icon: '/images/fbq-icon.webp', category: 'Files', weight: 'high', hosts: ['NewMain'],
    blurb: 'It gives me browser access and share links for the same files I use over NFS and SMB at home.',
    long: [
      'Before it I used Nextcloud, the original FileBrowser, Alist and SFTPGo, and this is the one I kept.',
    ],
  },
  {
    name: 'Syncthing', icon: '/images/syncthing-icon.webp', category: 'Files', weight: 'low', hosts: ['NewMain'],
    blurb: 'It keeps files in sync between my devices all the time, with versioning.',
  },

  // Media and tools
  {
    name: 'Fireshare', icon: '/images/fireshare-icon.webp', iconRound: true, category: 'Media and tools', weight: 'moderate', hosts: ['NewMain'],
    blurb: 'My friends and I upload and share game clips here, with no upload limits.',
    url: 'https://clips.chiambucket.com', statusKey: 'clips.chiambucket.com',
  },
  {
    name: 'Neko Rooms', icon: '/images/neko-icon.png', iconRound: true, category: 'Media and tools', weight: 'high', hosts: ['NewMain'],
    blurb: 'It runs a shared browser in a tab, so we can join the same room to watch or research on one screen.',
  },
  {
    name: 'Crafty', icon: '/images/crafty-icon.webp', category: 'Media and tools', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'],
    blurb: 'Crafty manages my Minecraft servers, and it runs in two places so a world can always be started.',
  },
  {
    name: 'Paperless-NGX', icon: '/images/paperless-icon.webp', category: 'Media and tools', weight: 'low', hosts: ['NewMain'],
    blurb: 'It is a document archive that OCRs every PDF and scan, so I can search them from any device.',
  },
  {
    name: 'VS Code Server', icon: '/images/vscode-icon.webp', category: 'Media and tools', weight: 'low', hosts: ['NewMain'],
    blurb: 'It runs VS Code in the browser, so I can edit config files on the server.',
  },

  // Monitoring
  {
    name: 'UpStat', icon: '/images/hl2/upstat-icon.png', category: 'Monitoring', weight: 'high', hosts: ['NewMain'],
    blurb: 'It tracks uptime and response time for every service and container, so I hear about problems first.',
  },
  {
    name: 'NetData', icon: '/images/netdata-icon.webp', category: 'Monitoring', weight: 'low', hosts: ['NewMain'],
    blurb: 'It records per-second metrics for CPU, disks, network and containers.',
  },
  {
    name: 'UpSnap', icon: '/images/upsnap-icon.webp', category: 'Monitoring', weight: 'high', hosts: ['NewMain'],
    blurb: 'It is a Wake-on-LAN panel, and it is how I turn Adell on.',
  },
  {
    name: 'OpenSpeedTest', icon: '/images/ost-icon.webp', category: 'Monitoring', weight: 'moderate', hosts: ['NewMain'],
    blurb: 'It is a self-hosted speed test that measures throughput between the server and wherever I am.',
    url: 'https://speedtest.chiambucket.com', statusKey: 'speedtest.chiambucket.com',
  },
  {
    name: 'Portainer', icon: '/images/portainer-icon.webp', category: 'Monitoring', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'],
    blurb: 'It gives me a web UI for Docker on both the Unraid host and the CasaOS VM.',
  },

  // For my projects
  {
    name: 'coturn', icon: '/images/coturn-icon.png', iconRound: true, category: 'For my projects', weight: 'low', hosts: ['NewMain'],
    blurb: 'I set up this TURN and STUN server for Project June, so its three WebRTC camera streams can get through cellular NAT.',
    long: [
      'Project June streams three live camera feeds over 5G, but cellular networks put devices behind layers of NAT that WebRTC cannot cross on its own.',
      'My own TURN and STUN server gives the streams a fixed public address to meet at, so I can drive the rover from anywhere, and it uses little CPU.',
    ],
  },
  {
    name: 'Mosquitto', icon: '/images/mosquitto-icon.svg', category: 'For my projects', weight: 'low', hosts: ['NewMain'],
    blurb: "I first set up this MQTT broker for Project June's telemetry and control, and it now carries messages between my ESP32 school projects and their dashboards.",
  },
  {
    name: 'Nginx', icon: '/images/nginx-icon.webp', iconRound: true, category: 'For my projects', weight: 'high', hosts: ['NewMain'],
    blurb: 'Two small nginx containers serve my static sites and project demos.',
  },
];

/* Ways into the network from outside, main one first. They all end at
   the rack (the "home" node on the page). */
export interface AccessMethod { name: string; type: string; note: string; primary?: boolean }
export const ACCESS_METHODS: AccessMethod[] = [
  { name: 'Tailscale', type: 'Mesh VPN', note: 'It is a WireGuard mesh with one login across all my devices, and it is the one I use every day.', primary: true },
  { name: 'WireGuard', type: 'Tunnel', note: 'It is a plain encrypted tunnel into the network with no third party involved.' },
  { name: 'UniFi Teleport', type: 'Built-in VPN', note: 'The UDM Pro issues this VPN itself, so there is no client to configure.' },
  { name: 'Twingate', type: 'Zero trust', note: 'It checks access per identity and keeps every inbound port closed.' },
  { name: 'Shadowsocks', type: 'Proxy', note: 'It makes my traffic look like HTTPS, so I can get through restricted school and office Wi-Fi.' },
  { name: 'Unraid Connect', type: 'Vendor service', note: 'It gives me direct access to the Unraid server from my Unraid account.' },
];
