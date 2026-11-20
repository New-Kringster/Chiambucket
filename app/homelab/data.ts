/* ────────────────────────────────────────────────────────────────
   Homelab page structure. Specs reflect a read-only SSH snapshot of
   NewMain (Unraid 7.1.2) plus the owner's notes. Everything a visitor
   reads (blurbs, labels, dialog text) lives in ./_copy, keyed by the
   ids here. `statusKey` marks publicly reachable services that the
   /api/homelab-status route pings for a live dot.
   ──────────────────────────────────────────────────────────────── */
import type { HomelabCopy } from './_copy/en';

export type Weight = 'extreme' | 'very-high' | 'high' | 'moderate' | 'low' | 'dev' | 'diagnostic';

/** How many of the five meter bars light up; the label is in the copy (stack.weights). */
export const WEIGHT_LEVEL: Record<Weight, number> = {
  extreme: 5,
  'very-high': 5,
  high: 4,
  moderate: 3,
  low: 1,
  dev: 2,
  diagnostic: 2,
};

export type SpecKey = 'os' | 'cpu' | 'memory' | 'gpu' | 'array' | 'fastPool' | 'storage' | 'boot' | 'hosts' | 'power';
export type ServerId = keyof HomelabCopy['servers'];
export type ServiceId = keyof HomelabCopy['services'];
export type AccessId = keyof HomelabCopy['access']['methods'];
export type Category = Exclude<keyof HomelabCopy['stack']['categories'], 'all'>;

export interface Server {
  id: ServerId;
  name: string;
  photo: string;
  status: 'always-on' | 'on-demand';
  /** `v` is a plain model name or size; specs whose value has words take it from the copy */
  specs: { k: SpecKey; v?: string }[];
  visual: 'runs' | 'pxe' | 'wake';       // which explainer the detail dialog renders
}

export const SERVERS: Server[] = [
  {
    id: 'newmain',
    name: 'NewMain',
    photo: '/images/hl-newmain.png',
    status: 'always-on',
    specs: [
      { k: 'os', v: 'Unraid 7.1.2' },
      { k: 'cpu' },
      { k: 'memory', v: '64 GB DDR4' },
      { k: 'gpu', v: 'GTX 1070 8 GB' },
      { k: 'array' },
      { k: 'fastPool' },
    ],
    visual: 'runs',
  },
  {
    id: 'caca',
    name: 'CaCa',
    photo: '/images/hl-caca.png',
    status: 'always-on',
    specs: [
      { k: 'os', v: 'Proxmox VE' },
      { k: 'cpu', v: 'Core i7-6700T' },
      { k: 'memory', v: '32 GB DDR4' },
      { k: 'storage' },
      { k: 'boot' },
      { k: 'hosts' },
    ],
    visual: 'pxe',
  },
  {
    id: 'adell',
    name: 'Adell',
    photo: '/images/hl-adell.png',
    status: 'on-demand',
    specs: [
      { k: 'os', v: 'Proxmox VE' },
      { k: 'cpu' },
      { k: 'memory', v: '128 GB DDR3' },
      { k: 'storage' },
      { k: 'power' },
    ],
    visual: 'wake',
  },
];

export interface Service {
  id: ServiceId;
  name: string;
  icon: string;
  iconRound?: boolean;
  category: Category;
  weight: Weight;
  hosts: string[];
  url?: string;        // public link shown on the card
  statusKey?: string;  // hostname pinged by the live-status route
  featured?: boolean;  // what I am building now, listed first
}

export const CATEGORIES: Category[] = ['access', 'files', 'media', 'monitoring', 'projects'];

export const SERVICES: Service[] = [
  { id: 'openclaw', name: 'OpenClaw', icon: '/images/openclaw-icon.webp', category: 'projects', weight: 'dev', hosts: ['NewMain'], featured: true },

  // Access
  { id: 'npm', name: 'Nginx Proxy Manager', icon: '/images/npm-icon.webp', category: 'access', weight: 'very-high', hosts: ['NewMain'] },
  { id: 'tailscale', name: 'Tailscale', icon: '/images/tailscale-icon.webp', category: 'access', weight: 'high', hosts: ['NewMain'] },
  { id: 'shadowsocks', name: 'Shadowsocks', icon: '/images/shadowsocks-icon.png', iconRound: true, category: 'access', weight: 'high', hosts: ['NewMain'] },
  { id: 'twingate', name: 'Twingate', icon: '/images/twingate-icon.webp', category: 'access', weight: 'low', hosts: ['NewMain'] },
  { id: 'pihole', name: 'Pi-hole', icon: '/images/pihole-icon.png', iconRound: true, category: 'access', weight: 'diagnostic', hosts: ['NewMain'] },

  // Files
  { id: 'immich', name: 'Immich', icon: '/images/immich-icon.webp', category: 'files', weight: 'extreme', hosts: ['NewMain'] },
  {
    id: 'lychee', name: 'Lychee', icon: '/images/lychee-icon.webp', category: 'files', weight: 'high', hosts: ['NewMain'],
    url: 'https://photos.chiambucket.com', statusKey: 'photos.chiambucket.com',
  },
  {
    id: 'pingvin', name: 'Pingvin Share', icon: '/images/pingvin-icon.png', iconRound: true, category: 'files', weight: 'high', hosts: ['NewMain'],
    url: 'https://share.chiambucket.com', statusKey: 'share.chiambucket.com',
  },
  {
    id: 'pairdrop', name: 'PairDrop', icon: '/images/pairdrop-icon.png', iconRound: true, category: 'files', weight: 'high', hosts: ['NewMain'],
    url: 'https://drop.chiambucket.com', statusKey: 'drop.chiambucket.com',
  },
  { id: 'fbq', name: 'File Browser Quantum', icon: '/images/fbq-icon.webp', category: 'files', weight: 'high', hosts: ['NewMain'] },
  { id: 'syncthing', name: 'Syncthing', icon: '/images/syncthing-icon.webp', category: 'files', weight: 'low', hosts: ['NewMain'] },

  // Media and tools
  {
    id: 'fireshare', name: 'Fireshare', icon: '/images/fireshare-icon.webp', iconRound: true, category: 'media', weight: 'moderate', hosts: ['NewMain'],
    url: 'https://clips.chiambucket.com', statusKey: 'clips.chiambucket.com',
  },
  { id: 'neko', name: 'Neko Rooms', icon: '/images/neko-icon.png', iconRound: true, category: 'media', weight: 'high', hosts: ['NewMain'] },
  { id: 'crafty', name: 'Crafty', icon: '/images/crafty-icon.webp', category: 'media', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'] },
  { id: 'paperless', name: 'Paperless-NGX', icon: '/images/paperless-icon.webp', category: 'media', weight: 'low', hosts: ['NewMain'] },
  { id: 'vscode', name: 'VS Code Server', icon: '/images/vscode-icon.webp', category: 'media', weight: 'low', hosts: ['NewMain'] },

  // Monitoring
  { id: 'upstat', name: 'UpStat', icon: '/images/hl2/upstat-icon.png', category: 'monitoring', weight: 'high', hosts: ['NewMain'] },
  { id: 'netdata', name: 'NetData', icon: '/images/netdata-icon.webp', category: 'monitoring', weight: 'low', hosts: ['NewMain'] },
  { id: 'upsnap', name: 'UpSnap', icon: '/images/upsnap-icon.webp', category: 'monitoring', weight: 'high', hosts: ['NewMain'] },
  {
    id: 'openspeedtest', name: 'OpenSpeedTest', icon: '/images/ost-icon.webp', category: 'monitoring', weight: 'moderate', hosts: ['NewMain'],
    url: 'https://speedtest.chiambucket.com', statusKey: 'speedtest.chiambucket.com',
  },
  { id: 'portainer', name: 'Portainer', icon: '/images/portainer-icon.webp', category: 'monitoring', weight: 'moderate', hosts: ['NewMain', 'CasaOS VM'] },

  // For my projects
  { id: 'coturn', name: 'coturn', icon: '/images/coturn-icon.png', iconRound: true, category: 'projects', weight: 'low', hosts: ['NewMain'] },
  { id: 'mosquitto', name: 'Mosquitto', icon: '/images/mosquitto-icon.svg', category: 'projects', weight: 'low', hosts: ['NewMain'] },
  { id: 'nginx', name: 'Nginx', icon: '/images/nginx-icon.webp', iconRound: true, category: 'projects', weight: 'high', hosts: ['NewMain'] },
];

/* Ways into the network from outside, main one first. They all end at
   the rack (the "home" node on the page). Type and note are in the copy. */
export interface AccessMethod { id: AccessId; name: string; primary?: boolean }
export const ACCESS_METHODS: AccessMethod[] = [
  { id: 'tailscale', name: 'Tailscale', primary: true },
  { id: 'wireguard', name: 'WireGuard' },
  { id: 'teleport', name: 'UniFi Teleport' },
  { id: 'twingate', name: 'Twingate' },
  { id: 'shadowsocks', name: 'Shadowsocks' },
  { id: 'unraidConnect', name: 'Unraid Connect' },
];
