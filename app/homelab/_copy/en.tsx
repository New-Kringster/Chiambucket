/* The homelab page's English words. Structure (ids, proper names, hostnames, URLs, icons, layout)
   lives in ../data.ts and the components; everything a visitor reads lives here, keyed by the same
   ids. Other languages fill the same shape in their own file (see ./index.ts). */

type NodeText = { role: string; via: string; does: string[] };
type MachineText = { name: string; role: string; blurb: string; specs: { k: string; v: string }[] };
type ServiceText = { blurb: string; long?: string[] };

/** Keeps the ids as keys while giving every entry the same shape (some services have no `long`). */
const byId = <T,>() => <K extends string>(o: Record<K, T>) => o;

const en = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'My home cloud is run by AI agents on braven-agents, a server that controls the other machines, the UniFi network and outside platforms like Cloudflare. This page covers how it all connects, the machines, the services and their live status.',
  },
  jsonLd: {
    headline: 'A home cloud run by AI agents',
    about: ['Self-hosting', 'AI agents', 'Infrastructure automation', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  /* shared bits */
  details: '{name} details',
  close: 'Close',

  hero: {
    checking: 'Checking public services',
    /** {count} is the bold "{n} of {total}" */
    online: '{count}public services online',
    onlineCount: '{n} of {total}',
    title: 'A home cloud that runs itself',
    lead: 'Every machine, network and service here is run by braven-agents, a server whose job is running my AI agents. They can reach everything else, from the storage server to the router and Cloudflare, so most changes happen from a prompt without me touching anything.',
    mapCta: 'See how it connects',
    machinesCta: 'See the machines',
  },

  /* the control map: braven-agents in the middle, every system it reaches around it */
  core: {
    title: 'Everything goes through braven-agents',
    lead: 'braven-agents holds the keys to every other system, and the agents on it reach each one through its own API or over SSH. Select a system to see what they do there.',
    mapLabel: 'How braven-agents connects to every other system',
    coreTag: 'The core',
    coreRole: 'It runs Claude Code, Codex and OpenCode, plus Hermes for scheduled jobs, and I start and follow their work in T3 Code.',
    groups: { machines: 'Machines', edge: 'Network and edge', platforms: 'Platforms' },
    doesLabel: 'What the agents do here',
    planned: 'Planned',
    proxmoxName: 'Proxmox server',
    nodes: byId<NodeText>()({
      newmain: { role: 'Storage and self-hosted services', via: 'Unraid API',
        does: ['Start, update and restart Docker containers', 'Watch the array and the health of each disk', 'Create shares and virtual machines'] },
      caca: { role: 'Dev environment for an unannounced project', via: 'SSH',
        does: ['Build and test the project', 'Keep its tools and packages up to date'] },
      servertop: { role: 'Bridge to my iCloud', via: 'SSH',
        does: ['Read and add events in my calendars', 'Read and add reminders', 'Handle other iCloud tasks that need a Mac'] },
      blade: { role: 'GPU jobs', via: 'SSH',
        does: ['Run training jobs on the RTX 3080, like the runs that trained DrumNet', 'Run larger models and other GPU-heavy work'] },
      proxmox: { role: 'Virtual machines, hardware still to be decided', via: 'Not running yet',
        does: ['It is still being put together, so nothing runs on it yet.'] },
      unifi: { role: 'The whole home network', via: 'UniFi API',
        does: ['Create networks and VLANs', 'Add firewall rules and port forwards', 'Look up and manage connected devices'] },
      npm: { role: 'Reverse proxy for public services', via: 'NPM API',
        does: ['Add a proxy host for each new subdomain', 'Issue and renew SSL certificates', 'Set who can reach a service'] },
      cloudflare: { role: 'DNS and edge services', via: 'Cloudflare API',
        does: ['Create and change DNS records', 'Open Cloudflare Tunnels for new apps', 'Deploy Workers and manage R2 storage'] },
      github: { role: 'My code', via: 'GitHub CLI',
        does: ['Create repositories, branches and pull requests', 'Push the changes they make'] },
      vercel: { role: 'Hosting for this site', via: 'Vercel API',
        does: ['Deploy previews and check that builds pass', 'Put this site live when I ask'] },
      shebang: { role: 'My hosting platform', via: 'Shebang MCP',
        does: ['Publish pages and files', 'Give a new app its own database and sign-in'] },
    }),
  },

  /* one request followed through every system it touches */
  prompt: {
    title: 'From one prompt to a running app',
    lead: 'When I ask for something new, the agents work through every system it touches by themselves. If I ask them to put a new app online at its own chiambucket.com address, for example, this is what happens:',
    steps: [
      { at: 'braven-agents', t: 'An agent writes the app and its Docker Compose file, then tests it.' },
      { at: 'NewMain', t: 'It starts the app as a container on NewMain.' },
      { at: 'Nginx Proxy Manager', t: 'It adds a proxy host for the new subdomain and gets an SSL certificate for it.' },
      { at: 'Cloudflare', t: 'It creates the DNS record that points the subdomain at home.' },
      { at: 'UniFi', t: 'If the app needs a port or a firewall rule, it adds that on the router.' },
      { at: 'braven-agents', t: 'It opens the address to check that the app answers, then sends me the link.' },
    ],
    ownTitle: 'Without being asked',
    own: 'A health check runs every day and fixes what it can on its own, so it restarts containers, services and virtual machines that have stopped and remounts drives that have dropped.',
    waitTitle: 'What still waits for me',
    wait: 'Deleting data, working on the storage array and rebooting machines still need my approval, and the tools ask before anything destructive.',
  },

  machines: {
    title: 'The machines',
    lead: 'Five machines are running, and a sixth is still being planned.',
    status: { running: 'Running', planned: 'Planned' },
    items: byId<MachineText>()({
      agents: {
        name: 'braven-agents', role: 'The core',
        blurb: 'This is the most powerful machine here, and it runs Ubuntu on bare metal so the agents have all of it to themselves.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X, 16 cores' },
          { k: 'Memory', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: 'Storage', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'Storage and services',
        blurb: 'NewMain keeps my files, photos and backups on five hard drives in a parity-protected Unraid array, and it runs the self-hosted services further down this page in Docker.',
        specs: [
          { k: 'OS', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 cores' },
          { k: 'Memory', v: '128 GB DDR3' },
          { k: 'Array', v: '5 hard drives, parity protected' },
          { k: 'Controller', v: 'PERC H710P in IT mode' },
        ],
      },
      caca: {
        name: 'CaCa', role: 'Dev environment',
        blurb: 'CaCa is a small ThinkCentre that serves as the development environment for a project I cannot talk about yet.',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'Memory', v: '32 GB DDR4' },
          { k: 'Storage', v: '1 TB NVMe SSD' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'iCloud bridge',
        blurb: 'Servertop is a MacBook Air that stays signed in to my iCloud, so the agents reach my calendars, reminders and other personal things through it.',
        specs: [
          { k: 'Model', v: 'MacBook Air, M1' },
          { k: 'Memory', v: '8 GB' },
          { k: 'Storage', v: '256 GB SSD' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'GPU worker',
        blurb: 'This laptop runs Ubuntu and takes the GPU-heavy work, and it is the same machine that trained DrumNet for the OCR Reader.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: '10th-gen Core i7' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'Memory', v: '32 GB' },
          { k: 'Storage', v: '2 × 1 TB SSD' },
        ],
      },
      proxmox: {
        name: 'Proxmox server', role: 'Virtual machines',
        blurb: 'A new Proxmox server is still being put together, and its hardware is yet to be decided.',
        specs: [
          { k: 'OS', v: 'Proxmox VE' },
          { k: 'Hardware', v: 'To be decided' },
        ],
      },
    }),
    rack: {
      alt: 'The rack in my room, with the patch panel and blue cables at the top and the servers behind a mesh door',
      caption: 'braven-agents, NewMain and CaCa share this rack in my room.',
    },
  },

  stack: {
    title: 'What it hosts',
    lead: 'NewMain runs these services for me and my projects, and the public ones show a live status that is checked once a minute.',
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
    status: { up: 'Online', down: 'Offline', wait: 'Checking', self: 'Private' },
    loadLabel: 'Load: {label}',
    weights: {
      extreme: 'Heaviest',
      'very-high': 'Very high',
      high: 'High',
      moderate: 'Moderate',
      low: 'Light',
      diagnostic: 'On demand',
    },
    /* the service dialog */
    facts: { runsOn: 'Runs on', load: 'Load', access: 'Access', category: 'Category' },
    access: {
      public: 'Public, through Nginx Proxy Manager and CrowdSec',
      private: 'Private, on the Tailscale network',
    },
    visit: 'Visit {host}',
  },

  services: byId<ServiceText>()({
    npm: {
      blurb: 'It sits in front of every public service as the reverse proxy, terminating SSL, routing each chiambucket.com subdomain to its container and running a CrowdSec bouncer that bans hostile IPs.',
      long: [
        'All public traffic arrives at one address and goes to NPM first, so no container is exposed to the internet directly.',
        'CrowdSec watches the traffic for attack patterns and bans the source. Because everything passes through NPM, every public service goes down whenever NPM does.',
      ],
    },
    tailscale: { blurb: 'It is a WireGuard mesh that puts all my devices on one private network, which I use to reach home from anywhere.' },
    shadowsocks: { blurb: 'It is a proxy that makes my traffic look like ordinary HTTPS, so I can reach home from restricted school networks.' },
    twingate: { blurb: 'It is a zero trust connector that I keep as another way in, alongside Tailscale, WireGuard and UniFi Teleport.' },
    pihole: { blurb: 'It blocks ads and trackers at the DNS level for the whole network, though I mostly use it for troubleshooting now.' },
    immich: {
      blurb: 'Immich replaces Google Photos as my photo library, with automatic phone backups, search and albums, and it is the service I use most.',
      long: [
        'Every photo and video from my phone backs up here automatically and stays on my own storage.',
        'It is the heaviest service on NewMain, and sizing it taught me how to budget CPU, memory and storage for a real workload.',
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
    crafty: { blurb: 'Crafty manages my Minecraft servers.' },
    paperless: { blurb: 'It is a document archive that OCRs every PDF and scan, so I can search them from any device.' },
    vscode: { blurb: 'It runs VS Code in the browser, so I can edit config files on the server.' },
    upstat: { blurb: 'It tracks uptime and response time for every service and container, so problems show up early.' },
    netdata: { blurb: 'It records per-second metrics for CPU, disks, network and containers.' },
    upsnap: { blurb: 'It is a Wake-on-LAN panel that turns on machines which are asleep.' },
    openspeedtest: { blurb: 'It is a self-hosted speed test that measures throughput between the server and wherever I am.' },
    portainer: { blurb: 'It gives me a web UI for the Docker containers on NewMain.' },
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

  tubs: {
    title: 'Shebang Tubs',
    status: 'Early, in development',
    lead: 'Shebang Tubs is a project and framework I am building so that anyone can build and self-host their own apps with agents.',
    body: [
      'Each app is a tub, one folder with a plain Compose file and its own database, files and secrets, so an agent can build it, run it and move it to another machine as one zip with its data intact.',
      'A dashboard deploys, starts and stops the tubs, and publishing one gives it a web address through Cloudflare Tunnel with no port forward or reverse proxy. Agents get an API key, so they can do all of this themselves.',
    ],
  },

  cta: {
    title: 'Where this is going',
    sub: 'The goal is a personal cloud that looks after itself and can build and run anything from a single prompt. Most of the pieces are in place now, and the next one is the new Proxmox server.',
    projects: 'See my projects',
    contact: 'Contact me',
  },
};

export type HomelabCopy = typeof en;
export default en;
