import type { SpecKey } from '../data';

/* The homelab page's English words. Structure (ids, hostnames, URLs, icons, plain model-name specs,
   layout) lives in ../data.ts and the components; everything a visitor reads lives here, keyed by the
   same ids. Other languages fill the same shape in their own file (see ./index.ts). */

type ServerText = {
  tag: string;
  role: string;
  blurb: string;
  /** spec values that contain words; plain model names and sizes stay in data.ts */
  specs: Partial<Record<SpecKey, string>>;
  detail: { tagline: string; story: string[]; highlights: string[] };
};
type ServiceText = { blurb: string; long?: string[] };
type NodeText = { label: string; sub: string; detail: string };

/** Keeps the ids as keys while giving every entry the same shape (some services have no `long`). */
const byId = <T,>() => <K extends string>(o: Record<K, T>) => o;

const en = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'I run three servers at home for my photo library, file sharing, and the MQTT and TURN servers that Project June and LUMEN use. This page covers their hardware, network map, storage, services and live status.',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['Self-hosting', 'Home networking', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  /* shared bits */
  details: '{name} details',
  close: 'Close',

  hero: {
    checking: 'Checking public services',
    /** {count} is the bold "{n} of {total}" */
    online: '{count}public services online',
    onlineCount: '{n} of {total}',
    tele: 'NewMain runs Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>Three servers <em>in my room</em></>,
    lead: 'They run my photo library, my files, and the MQTT and TURN servers that Project June and LUMEN use, and they are also where I learn networking, storage and Docker and host what I build.',
    stats: [
      { v: '3', k: 'servers' },
      { v: '38', k: 'self-hosted services' },
      { v: '24 TB', k: 'usable storage' },
      { v: '4', k: 'VLANs' },
    ],
    mapCta: 'See the network map',
    stackCta: 'See the services',
    scrollCue: 'Scroll down',
  },

  mission: {
    eyebrow: 'Why I run it',
    title: 'What it is for',
    lead: "My hardware projects need servers to talk to, so Project June streams its cameras through my TURN server and uses my MQTT broker for telemetry and control, while LUMEN's speech relay runs in Docker here. Running these myself is how I learned networking, storage and deployment.",
    /** keyed by the pillar's icon */
    pillars: {
      cloud: { k: 'Servers and storage', d: 'Docker containers run the services I use every day behind a reverse proxy, with two storage tiers and backups.' },
      net: { k: 'Networking', d: 'The network has four VLANs, RADIUS and WPA3-Enterprise Wi-Fi, running on UniFi switches and access points.' },
      code: { k: 'Deploying my apps', d: 'Apps I build are deployed to a VM in the Proxmox cluster, and next I want agents to run parts of the lab themselves.' },
      link: { k: 'For my projects', d: 'coturn lets Project June stream video over 5G, while Mosquitto carries messages for my ESP32 school projects.' },
    },
  },

  machines: {
    eyebrow: 'Hardware',
    title: 'Servers',
    photoAlt: '{name} server',
    more: 'Specs and details',
    rack: {
      alt: 'The homelab rack in my room: the patch panel with blue cables at the top, the servers behind a mesh door',
      eyebrow: 'The rack',
      title: 'All three servers in one cabinet',
      body: 'The rack sits in a corner of my room, with the patch panel at the top and the servers behind the mesh door. Two of them run all the time, while Adell stays off until I need it.',
    },
  },

  statusLabels: { 'always-on': 'On 24/7', 'on-demand': 'Off until needed' },

  specLabels: {
    os: 'OS', cpu: 'CPU', memory: 'Memory', gpu: 'GPU', array: 'Array', fastPool: 'Fast pool',
    storage: 'Storage', boot: 'Boot', hosts: 'Hosts', power: 'Power',
  } satisfies Record<SpecKey, string>,

  servers: byId<ServerText>()({
    newmain: {
      tag: 'Main server',
      role: 'Storage and most of the Docker stack',
      blurb: 'This is the main server, where a parity-protected Unraid array holds bulk data, a ZFS NVMe mirror holds anything that needs speed, and most of the Docker containers run.',
      specs: {
        cpu: 'Ryzen 9 5950X, 16 cores',
        array: '2 parity + 3 data',
        fastPool: '2 × 2 TB NVMe, ZFS mirror',
      },
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
      },
    },
    caca: {
      tag: 'Proxmox node, always on',
      role: 'Proxmox cluster, always on',
      blurb: 'CaCa is a small ThinkCentre that used to be my main server, and it is now the always-on node of a Proxmox cluster, running the CasaOS and Debian VMs from its own 1 TB SSD.',
      specs: {
        storage: '1 TB NVMe SSD, boot and VMs',
        boot: 'Local NVMe SSD',
        hosts: 'CasaOS and Debian VMs',
      },
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
      },
    },
    adell: {
      tag: 'Proxmox node, on demand',
      role: 'Proxmox cluster, woken on demand',
      blurb: 'Adell has twenty Xeon cores and 128 GB of RAM and sits in the same Proxmox cluster as CaCa, but it uses a lot of power, so it stays off until I wake it through UpSnap.',
      specs: {
        cpu: '2 × Xeon E5-2470 v2, 20 cores',
        storage: 'PERC H710P in IT mode',
        power: 'Wake-on-LAN only',
      },
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
      },
    },
  }),

  /* the animated explainer in each machine's dialog */
  visuals: {
    runsLabel: 'What runs here',
    /** {n} is bold */
    runsFoot: '{n} of the {total} services on this page run on NewMain',
    bootLabel: 'How it boots',
    bootSteps: [
      { t: 'Local SSD', s: 'A 1 TB NVMe SSD inside the machine' },
      { t: 'Proxmox', s: 'Proxmox boots from that disk' },
      { t: 'VMs', s: 'CasaOS and Debian run from the same SSD' },
    ],
    wakeLabel: 'How it wakes',
    wakeFoot: <>One Wake-on-LAN packet from UpSnap starts all <b>20 cores</b></>,
  },

  map: {
    eyebrow: 'Network',
    title: 'Network map',
    lead: 'My home runs on one UniFi network split into four VLANs, and you can select a device to see what it does or a VLAN to highlight the devices on it.',
    clear: 'Clear highlight',
    tip: 'Select a VLAN to highlight its devices',
    svgLabel: 'Network map. Select a device for details.',
    core: 'Core network',
    segment: 'Segment',
    hint: 'Select a device to see what it does.',
    legend: {
      unraid: 'Unraid VLAN',
      server: 'Server VLAN',
      default: 'Default VLAN',
      iot: 'IoT VLAN, isolated',
    },
    vlans: {
      unraid: { label: 'Unraid VLAN', blurb: 'NewMain sits on this VLAN by itself, and trusted VLANs can reach it for storage and apps while the IoT VLAN cannot.' },
      server: { label: 'Server VLAN', blurb: 'CaCa and Adell, the Proxmox cluster, share this segment so they can live-migrate VMs and PXE boot.' },
      default: { label: 'Default VLAN', blurb: 'Workstations and the main WPA3-Enterprise Wi-Fi sit here, and they can reach the servers while the IoT VLAN cannot reach them.' },
      iot: { label: 'IoT VLAN', blurb: 'Smart devices get internet access and nothing else, because firewall rules block this segment from every other VLAN.' },
      core: { label: 'Core network', blurb: 'The gateway and switches that route between the VLANs.' },
    },
    nodes: byId<NodeText>()({
      internet: { label: 'Internet', sub: 'Public edge',
        detail: 'Inbound traffic reaches one public address and goes straight to the gateway, so nothing behind it can be reached directly.' },
      udm: { label: 'UDM Pro', sub: 'Gateway, firewall, RADIUS',
        detail: 'The UniFi Dream Machine Pro is the gateway, firewall, network controller and RADIUS server. It decides which VLAN can reach which, and authenticates the WPA3-Enterprise Wi-Fi.' },
      sw1: { label: 'USW Pro Max 24', sub: 'Server rack',
        detail: 'This 24-port switch sits in the server rack, and each server connects to it with a redundant pair of links.' },
      sw2: { label: 'USW Flex 2.5G', sub: 'General',
        detail: 'This 2.5 Gb switch connects the faster everyday devices in the apartment.' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'Powers the APs',
        detail: 'This 8-port PoE switch connects and powers the five access points, with one cable each.' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'The Unraid server has a VLAN to itself, which trusted VLANs can reach for storage and apps while the IoT VLAN cannot.' },
      caca: { label: 'CaCa', sub: 'Always on',
        detail: 'CaCa is the Proxmox node that stays on, and it shares the server VLAN with Adell.' },
      adell: { label: 'Adell', sub: 'On demand',
        detail: 'Adell is the Proxmox node I wake when I need it, and it shares the server VLAN with CaCa for live migration and PXE boot.' },
      clients: { label: 'Workstations', sub: 'Laptops, desktops',
        detail: 'Everyday devices sit on the default VLAN, where they can reach the servers but the IoT VLAN cannot reach them.' },
      aps: { label: '5 UniFi APs', sub: 'Wi-Fi',
        detail: 'Five access points broadcast two separate Wi-Fi networks across the apartment, powered over PoE from the Lite 8.' },
      wmain: { label: 'Main WLAN', sub: 'WPA3-Enterprise',
        detail: 'The main Wi-Fi uses WPA3-Enterprise with RADIUS on the UDM Pro, so every device has its own credentials.' },
      wiot: { label: 'IoT WLAN', sub: 'Isolated',
        detail: 'Smart devices get internet access and nothing else, because firewall rules block them from every other VLAN.' },
    }),
  },

  storage: {
    eyebrow: 'Storage and VMs',
    title: 'Storage and virtual machines',
    poolsTitle: 'Storage on NewMain',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'Array',
      sub: 'Unraid, parity protected',
      body: 'It has two parity drives and three data drives, so it survives two drives failing at once, and it holds PXE backups, archives and media.',
    },
    fast: {
      name: 'Fast pool',
      sub: 'ZFS NVMe mirror',
      body: 'Two 2 TB NVMe drives form a ZFS mirror, which Docker app data, VM disks and the PXE ISO library run from.',
    },
    sharedOver: 'Shared over',
    protocols: ['SFTP', 'SMB on the local network', 'NFS to Linux and macOS'],
    clusterTitle: 'The Proxmox cluster',
    clusterLead: 'CaCa and Adell form one Proxmox cluster. CaCa boots from its own 1 TB SSD and stays on, while Adell boots over the network with no local OS drive and I wake it when I need its cores.',
    vms: [
      { k: 'claudeplayground', d: 'It is an Ubuntu VM where I deploy the apps I build, and Claude has SSH access to ship them.' },
      { k: 'CasaOS and Debian', d: 'These VMs used to run on bare metal.' },
      { k: 'Wake-on-LAN', d: 'UpSnap turns Adell on when a job needs it, so it only draws power while working.' },
    ],
  },

  stack: {
    eyebrow: 'Software',
    title: 'Services',
    lead: 'These are the main services out of 38, and the public ones show a live status that is checked once a minute.',
    filterLabel: 'Filter services',
    /** filter buttons; every key but `all` is a service category in data.ts */
    categories: {
      all: 'All',
      access: 'Access',
      files: 'Files',
      media: 'Media and tools',
      monitoring: 'Monitoring',
      projects: 'For my projects',
    },
    checkedAt: 'Checked at {time}',
    checking: 'Checking status',
    showFewer: 'Show fewer',
    showAll: 'Show all {n} services',
    status: { up: 'online', down: 'offline', wait: 'checking', build: 'building now', self: 'private' },
    loadLabel: 'Load: {label}',
    weights: {
      extreme: 'Heaviest',
      'very-high': 'Very high',
      high: 'High',
      moderate: 'Moderate',
      low: 'Light',
      dev: 'In development',
      diagnostic: 'On demand',
    },
    /* the service dialog */
    facts: { runsOn: 'Runs on', load: 'Load', access: 'Access', category: 'Category' },
    access: {
      public: 'Public, through Nginx Proxy Manager and CrowdSec',
      dev: 'In development on NewMain',
      private: 'Private, on the Tailscale network',
    },
    visit: 'Visit {host}',
  },

  services: byId<ServiceText>()({
    openclaw: {
      blurb: 'I am building OpenClaw now, a runner that lets AI agents do real tasks on the lab, and it is not finished yet.',
      long: [
        'The goal is to give an agent a safe place inside the lab where it can start a container, check a service, deploy a small app and report back.',
        'It follows on from giving Claude SSH access to a VM for deploying my apps, and the next step is letting it run parts of the lab while I review the results.',
      ],
    },
    npm: {
      blurb: 'It sits in front of every public service as the reverse proxy, terminating SSL, routing each chiambucket.com subdomain to its container and running a CrowdSec bouncer that bans hostile IPs.',
      long: [
        'All public traffic arrives at one address and goes to NPM first, so no container is exposed to the internet directly.',
        'CrowdSec watches the traffic for attack patterns and bans the source. Because everything passes through NPM, every public service goes down whenever NPM does.',
      ],
    },
    tailscale: { blurb: 'It is a WireGuard mesh that puts all my devices on one private network, which I use to SSH in and edit configs from anywhere.' },
    shadowsocks: { blurb: 'It is a proxy that makes my traffic look like ordinary HTTPS, so I can reach home from restricted school networks.' },
    twingate: { blurb: 'It is a zero trust connector that I keep as another way in, alongside Teleport, WireGuard and Unraid Connect.' },
    pihole: { blurb: 'It blocks ads and trackers at the DNS level for the whole network, though I mostly use it for troubleshooting now.' },
    immich: {
      blurb: 'Immich replaces Google Photos as my photo library, with automatic phone backups, search and albums, and it is the service I use most.',
      long: [
        'Every photo and video from my phone backs up here automatically and stays on my own storage.',
        'It is the heaviest service on NewMain. The GTX 1070 runs the machine learning for search and face grouping, and sizing it taught me how to budget CPU, GPU, memory and storage for a real workload.',
      ],
    },
    lychee: { blurb: 'Lychee is the photo gallery behind the photography page on this site.' },
    pingvin: { blurb: 'I upload files that are too big for chat apps here and get a link to send.' },
    pairdrop: { blurb: 'It sends a file between any two devices from the browser, like AirDrop, without any accounts.' },
    fbq: {
      blurb: 'It gives me browser access and share links for the same files I use over NFS and SMB at home.',
      long: ['Before it I used Nextcloud, the original FileBrowser, Alist and SFTPGo, and this is the one I kept.'],
    },
    syncthing: { blurb: 'It keeps files in sync between my devices all the time, with versioning.' },
    fireshare: { blurb: 'My friends and I upload and share game clips here, with no upload limits.' },
    neko: { blurb: 'It runs a shared browser in a tab, so we can join the same room to watch or research on one screen.' },
    crafty: { blurb: 'Crafty manages my Minecraft servers, and it runs in two places so a world can always be started.' },
    paperless: { blurb: 'It is a document archive that OCRs every PDF and scan, so I can search them from any device.' },
    vscode: { blurb: 'It runs VS Code in the browser, so I can edit config files on the server.' },
    upstat: { blurb: 'It tracks uptime and response time for every service and container, so I hear about problems first.' },
    netdata: { blurb: 'It records per-second metrics for CPU, disks, network and containers.' },
    upsnap: { blurb: 'It is a Wake-on-LAN panel, and it is how I turn Adell on.' },
    openspeedtest: { blurb: 'It is a self-hosted speed test that measures throughput between the server and wherever I am.' },
    portainer: { blurb: 'It gives me a web UI for Docker on both the Unraid host and the CasaOS VM.' },
    coturn: {
      blurb: 'I set up this TURN and STUN server for Project June, so its three WebRTC camera streams can get through cellular NAT.',
      long: [
        'Project June streams three live camera feeds over 5G, but cellular networks put devices behind layers of NAT that WebRTC cannot cross on its own.',
        'My own TURN and STUN server gives the streams a fixed public address to meet at, so I can drive the rover from anywhere, and it uses little CPU.',
      ],
    },
    mosquitto: { blurb: "I first set up this MQTT broker for Project June's telemetry and control, and it now carries messages between my ESP32 school projects and their dashboards." },
    nginx: { blurb: 'Two small nginx containers serve my static sites and project demos.' },
  }),

  access: {
    eyebrow: 'Remote access',
    title: 'Six ways in',
    lead: 'I keep six separate ways in from outside, so one of them breaking does not lock me out.',
    primary: 'Primary',
    methods: {
      tailscale: { type: 'Mesh VPN', note: 'It is a WireGuard mesh with one login across all my devices, and it is the one I use every day.' },
      wireguard: { type: 'Tunnel', note: 'It is a plain encrypted tunnel into the network with no third party involved.' },
      teleport: { type: 'Built-in VPN', note: 'The UDM Pro issues this VPN itself, so there is no client to configure.' },
      twingate: { type: 'Zero trust', note: 'It checks access per identity and keeps every inbound port closed.' },
      shadowsocks: { type: 'Proxy', note: 'It makes my traffic look like HTTPS, so I can get through restricted school and office Wi-Fi.' },
      unraidConnect: { type: 'Vendor service', note: 'It gives me direct access to the Unraid server from my Unraid account.' },
    },
    home: { type: 'The rack', note: 'Every path above ends here.' },
  },

  cta: {
    title: 'What I am building now',
    sub: 'I am building OpenClaw, a runner that lets AI agents do real tasks on the lab, such as starting a container, checking a service, deploying a small app and reporting back, but it is not finished yet.',
    projects: 'See my projects',
    contact: 'Contact me',
  },
};

export type HomelabCopy = typeof en;
export default en;
