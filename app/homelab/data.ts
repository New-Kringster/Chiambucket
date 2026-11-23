/* ────────────────────────────────────────────────────────────────
   Homelab page structure: the systems braven-agents controls, the
   machines, and the self-hosted services. Everything a visitor reads
   (roles, blurbs, specs, labels) lives in ./_copy, keyed by the ids
   here. `statusKey` marks publicly reachable services that the
   /api/homelab-status route pings for a live dot.
   ──────────────────────────────────────────────────────────────── */
import type { HomelabCopy } from './_copy/en';

export type NodeId = keyof HomelabCopy['core']['nodes'];
export type MachineId = keyof HomelabCopy['machines']['items'];
export type ServiceId = keyof HomelabCopy['services'];
export type Category = Exclude<keyof HomelabCopy['stack']['categories'], 'all'>;
export type Weight = keyof HomelabCopy['stack']['weights'];

/* ── The control map: braven-agents in the middle, every system it reaches around it ── */
export type Group = 'machines' | 'edge' | 'platforms';
export interface MapNode {
  id: NodeId;
  /** proper names stay in code; the planned Proxmox server takes its name from the copy */
  name?: string;
  group: Group;
  planned?: boolean;
  /** a small photo on the machines' cards */
  photo?: string;
}
export const GROUPS: Group[] = ['machines', 'edge', 'platforms'];
export const NODES: MapNode[] = [
  { id: 'newmain', name: 'NewMain', group: 'machines', photo: '/images/homelab/newmain.webp' },
  { id: 'caca', name: 'CaCa', group: 'machines', photo: '/images/homelab/caca.webp' },
  { id: 'servertop', name: 'Servertop', group: 'machines', photo: '/images/homelab/servertop.webp' },
  { id: 'blade', name: 'Razer Blade 15', group: 'machines', photo: '/images/homelab/blade.webp' },
  { id: 'proxmox', group: 'machines', planned: true },
  { id: 'unifi', name: 'UniFi', group: 'edge' },
  { id: 'npm', name: 'Nginx Proxy Manager', group: 'edge' },
  { id: 'cloudflare', name: 'Cloudflare', group: 'edge' },
  { id: 'github', name: 'GitHub', group: 'platforms' },
  { id: 'vercel', name: 'Vercel', group: 'platforms' },
  { id: 'shebang', name: 'Shebang', group: 'platforms' },
];

/* ── The machines, in the order the page lists them ── */
/** `photo` is a cut-out on a transparent background; the planned server has none yet */
export interface Machine { id: MachineId; photo?: string; planned?: boolean; core?: boolean }
export const CORE_PHOTO = '/images/homelab/agents.webp';
export const MACHINES: Machine[] = [
  { id: 'agents', photo: CORE_PHOTO, core: true },
  { id: 'newmain', photo: '/images/homelab/newmain.webp' },
  { id: 'caca', photo: '/images/homelab/caca.webp' },
  { id: 'servertop', photo: '/images/homelab/servertop.webp' },
  { id: 'blade', photo: '/images/homelab/blade.webp' },
  { id: 'proxmox', planned: true },
];

/* ── Self-hosted services on NewMain ── */
/** How many of the five meter bars light up in the service dialog; the label is in the copy (stack.weights). */
export const WEIGHT_LEVEL: Record<Weight, number> = {
  extreme: 5,
  'very-high': 5,
  high: 4,
  moderate: 3,
  low: 1,
  diagnostic: 2,
};

export interface Service {
  id: ServiceId;
  name: string;
  icon: string;
  iconRound?: boolean;
  category: Category;
  weight: Weight;
  url?: string;        // public link shown on the card
  statusKey?: string;  // hostname pinged by the live-status route
}

export const CATEGORIES: Category[] = ['access', 'files', 'media', 'monitoring', 'projects'];

export const SERVICES: Service[] = [
  // Access
  { id: 'npm', name: 'Nginx Proxy Manager', icon: '/images/npm-icon.webp', category: 'access', weight: 'very-high' },
  { id: 'tailscale', name: 'Tailscale', icon: '/images/tailscale-icon.webp', category: 'access', weight: 'high' },
  { id: 'shadowsocks', name: 'Shadowsocks', icon: '/images/shadowsocks-icon.png', iconRound: true, category: 'access', weight: 'high' },
  { id: 'twingate', name: 'Twingate', icon: '/images/twingate-icon.webp', category: 'access', weight: 'low' },
  { id: 'pihole', name: 'Pi-hole', icon: '/images/pihole-icon.png', iconRound: true, category: 'access', weight: 'diagnostic' },

  // Files
  { id: 'immich', name: 'Immich', icon: '/images/immich-icon.webp', category: 'files', weight: 'extreme' },
  {
    id: 'lychee', name: 'Lychee', icon: '/images/lychee-icon.webp', category: 'files', weight: 'high',
    url: 'https://photos.chiambucket.com', statusKey: 'photos.chiambucket.com',
  },
  {
    id: 'pingvin', name: 'Pingvin Share', icon: '/images/pingvin-icon.png', iconRound: true, category: 'files', weight: 'high',
    url: 'https://share.chiambucket.com', statusKey: 'share.chiambucket.com',
  },
  {
    id: 'pairdrop', name: 'PairDrop', icon: '/images/pairdrop-icon.png', iconRound: true, category: 'files', weight: 'high',
    url: 'https://drop.chiambucket.com', statusKey: 'drop.chiambucket.com',
  },
  { id: 'fbq', name: 'File Browser Quantum', icon: '/images/fbq-icon.webp', category: 'files', weight: 'high' },
  { id: 'syncthing', name: 'Syncthing', icon: '/images/syncthing-icon.webp', category: 'files', weight: 'low' },

  // Media and tools
  {
    id: 'fireshare', name: 'Fireshare', icon: '/images/fireshare-icon.webp', iconRound: true, category: 'media', weight: 'moderate',
    url: 'https://clips.chiambucket.com', statusKey: 'clips.chiambucket.com',
  },
  { id: 'neko', name: 'Neko Rooms', icon: '/images/neko-icon.png', iconRound: true, category: 'media', weight: 'high' },
  { id: 'crafty', name: 'Crafty', icon: '/images/crafty-icon.webp', category: 'media', weight: 'moderate' },
  { id: 'paperless', name: 'Paperless-NGX', icon: '/images/paperless-icon.webp', category: 'media', weight: 'low' },
  { id: 'vscode', name: 'VS Code Server', icon: '/images/vscode-icon.webp', category: 'media', weight: 'low' },

  // Monitoring
  { id: 'upstat', name: 'UpStat', icon: '/images/hl2/upstat-icon.png', category: 'monitoring', weight: 'high' },
  { id: 'netdata', name: 'NetData', icon: '/images/netdata-icon.webp', category: 'monitoring', weight: 'low' },
  { id: 'upsnap', name: 'UpSnap', icon: '/images/upsnap-icon.webp', category: 'monitoring', weight: 'high' },
  {
    id: 'openspeedtest', name: 'OpenSpeedTest', icon: '/images/ost-icon.webp', category: 'monitoring', weight: 'moderate',
    url: 'https://speedtest.chiambucket.com', statusKey: 'speedtest.chiambucket.com',
  },
  { id: 'portainer', name: 'Portainer', icon: '/images/portainer-icon.webp', category: 'monitoring', weight: 'moderate' },

  // For my projects
  { id: 'coturn', name: 'coturn', icon: '/images/coturn-icon.png', iconRound: true, category: 'projects', weight: 'low' },
  { id: 'mosquitto', name: 'Mosquitto', icon: '/images/mosquitto-icon.svg', category: 'projects', weight: 'low' },
  { id: 'nginx', name: 'Nginx', icon: '/images/nginx-icon.webp', iconRound: true, category: 'projects', weight: 'high' },
];
