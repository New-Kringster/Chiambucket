import type { HomelabCopy } from './en';

const zh: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      '我在家里运行着三台服务器，用来放我的照片库、分享文件，还有 Project June 和 LUMEN 用到的 MQTT 和 TURN 服务器。这一页介绍它们的硬件、网络拓扑、存储、服务和实时状态。',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['自托管', '家庭网络', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: '{name} 详情',
  close: '关闭',

  hero: {
    checking: '正在检查公开服务',
    online: '{count} 个公开服务在线',
    onlineCount: '{n}/{total}',
    tele: 'NewMain 运行着 Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>我房间里的<em>三台服务器</em></>,
    lead: '它们运行着我的照片库、我的文件，还有 Project June 和 LUMEN 用到的 MQTT 和 TURN 服务器，我也是在这里学网络、存储和 Docker，托管我做出来的东西。',
    stats: [
      { v: '3', k: '台服务器' },
      { v: '38', k: '个自托管服务' },
      { v: '24 TB', k: '可用存储' },
      { v: '4', k: '个 VLAN' },
    ],
    mapCta: '查看网络拓扑',
    stackCta: '查看服务',
    scrollCue: '向下滚动',
  },

  mission: {
    eyebrow: '为什么要搭',
    title: '它是用来干嘛的',
    lead: '我的硬件项目需要能对话的服务器，所以 Project June 通过我的 TURN 服务器传摄像头画面，用我的 MQTT 代理传遥测和控制指令，而 LUMEN 的语音中继就跑在这里的 Docker 里。正是自己运行这些东西，让我学会了网络、存储和部署。',
    pillars: {
      cloud: { k: '服务器与存储', d: '我每天用的服务都跑在反向代理后面的 Docker 容器里，有两层存储，还有备份。' },
      net: { k: '网络', d: '网络分成四个 VLAN，有 RADIUS 和 WPA3-Enterprise Wi-Fi，跑在 UniFi 交换机和接入点上。' },
      code: { k: '部署我的应用', d: '我做的应用都部署到 Proxmox 集群里的一台虚拟机上，下一步我想让智能体自己来运行实验室的一部分。' },
      link: { k: '为了我的项目', d: 'coturn 让 Project June 能通过 5G 传视频，Mosquitto 则为我的 ESP32 学校项目传递消息。' },
    },
  },

  machines: {
    eyebrow: '硬件',
    title: '服务器',
    photoAlt: '{name} 服务器',
    more: '规格与详情',
    rack: {
      alt: '我房间里的 homelab 机柜：顶部是插着蓝色网线的配线架，服务器在网门后面',
      eyebrow: '机柜',
      title: '三台服务器都在一个机柜里',
      body: '机柜放在我房间的一个角落，配线架在最上面，服务器在网门后面。其中两台一直开着，Adell 则在我需要它之前一直关着。',
    },
  },

  statusLabels: { 'always-on': '全天候运行', 'on-demand': '需要时才开' },

  specLabels: {
    os: '系统', cpu: 'CPU', memory: '内存', gpu: 'GPU', array: '阵列', fastPool: '高速池',
    storage: '存储', boot: '启动', hosts: '承载', power: '电源',
  },

  servers: {
    newmain: {
      tag: '主服务器',
      role: '存储和大部分 Docker 服务',
      blurb: '这是主服务器，带校验保护的 Unraid 阵列存放大量数据，ZFS NVMe 镜像存放需要速度的东西，大部分 Docker 容器也都跑在这里。',
      specs: {
        cpu: 'Ryzen 9 5950X，16 核',
        array: '2 块校验盘 + 3 块数据盘',
        fastPool: '2 × 2 TB NVMe，ZFS 镜像',
      },
      detail: {
        tagline: '存储和大部分服务',
        story: [
          'Unraid 把大小不一的硬盘组成一个带校验保护的阵列来存放大量数据，另外由两块 NVMe 组成的 ZFS 镜像存放 Docker 应用数据、数据库和虚拟机磁盘。',
          '这一页上几乎所有服务都跑在这里，包括 chiambucket.com 子域名背后的一切。GTX 1070 负责视频转码，以及 Immich 搜索和人脸分组背后的机器学习。',
          '其他一切都依赖这台机器，所以我尽量少动它。',
        ],
        highlights: [
          '校验阵列能扛住两块硬盘同时坏掉',
          'ZFS NVMe 镜像存放应用数据和虚拟机磁盘',
          '运行大部分 Docker 容器',
          'GTX 1070 负责 Immich 机器学习和转码',
        ],
      },
    },
    caca: {
      tag: 'Proxmox 节点，常开',
      role: 'Proxmox 集群，常开',
      blurb: 'CaCa 是一台小小的 ThinkCentre，以前是我的主服务器，现在是 Proxmox 集群里常开的节点，用它自己的 1 TB SSD 运行 CasaOS 和 Debian 虚拟机。',
      specs: {
        storage: '1 TB NVMe SSD，启动盘兼虚拟机',
        boot: '本地 NVMe SSD',
        hosts: 'CasaOS 和 Debian 虚拟机',
      },
      detail: {
        tagline: '一直开着的 Proxmox 节点',
        story: [
          '在有 NewMain 之前，CaCa 是我的主服务器，现在它和 Adell 组成一个双节点 Proxmox 集群，是其中常开的那一半。',
          '它从机身里的 1 TB NVMe SSD 启动 Proxmox，以前直接装在裸机上的 CasaOS 和 Debian 虚拟机，现在也从同一块盘运行。',
          '它耗电很少，所以 Adell 睡觉的时候，它全天候开着。',
        ],
        highlights: [
          '从本地 1 TB NVMe SSD 启动并运行虚拟机',
          '承载 CasaOS 和 Debian 虚拟机',
          '功耗低，全天候运行',
          '和 Adell 组成集群，支持在线迁移',
        ],
      },
    },
    adell: {
      tag: 'Proxmox 节点，按需开机',
      role: 'Proxmox 集群，按需唤醒',
      blurb: 'Adell 有二十个 Xeon 核心和 128 GB 内存，和 CaCa 在同一个 Proxmox 集群里，但它很耗电，所以在我通过 UpSnap 唤醒它之前一直关着。',
      specs: {
        cpu: '2 × Xeon E5-2470 v2，20 核',
        storage: 'IT 模式的 PERC H710P',
        power: '仅限网络唤醒',
      },
      detail: {
        tagline: '需要时才唤醒的大家伙',
        story: [
          'Adell 是集群里的大家伙，两颗 Xeon 加起来有二十个核心，还有 128 GB 内存，所以耗电太多，不能一直开着。',
          '有任务需要它的时候，我在 UpSnap 里点一下唤醒，它会发出一个网络唤醒数据包，Adell 就通过网络启动，跑完任务再回去睡觉。',
        ],
        highlights: [
          '二十个 Xeon 核心，128 GB 内存',
          '通过网络唤醒按需开机',
          '通过 PXE 启动，没有本地系统盘',
          '有任务需要它之前一直关着',
        ],
      },
    },
  },

  visuals: {
    runsLabel: '这里跑着什么',
    runsFoot: '这一页的 {total} 个服务中，有 {n} 个跑在 NewMain 上',
    bootLabel: '它怎么启动',
    bootSteps: [
      { t: '本地 SSD', s: '机身里的一块 1 TB NVMe SSD' },
      { t: 'Proxmox', s: 'Proxmox 从这块盘启动' },
      { t: '虚拟机', s: 'CasaOS 和 Debian 从同一块 SSD 运行' },
    ],
    wakeLabel: '它怎么唤醒',
    wakeFoot: <>UpSnap 发出的一个网络唤醒数据包，就能启动全部 <b>20 个核心</b></>,
  },

  map: {
    eyebrow: '网络',
    title: '网络拓扑',
    lead: '我家用的是一个 UniFi 网络，分成四个 VLAN，你可以选一台设备看看它是干什么的，或者选一个 VLAN 把上面的设备高亮出来。',
    clear: '取消高亮',
    tip: '选一个 VLAN 来高亮它的设备',
    svgLabel: '网络拓扑。选一台设备查看详情。',
    core: '核心网络',
    segment: '网段',
    hint: '选一台设备，看看它是干什么的。',
    legend: {
      unraid: 'Unraid VLAN',
      server: '服务器 VLAN',
      default: '默认 VLAN',
      iot: 'IoT VLAN，已隔离',
    },
    vlans: {
      unraid: { label: 'Unraid VLAN', blurb: 'NewMain 独占这个 VLAN，受信任的 VLAN 可以访问它的存储和应用，而 IoT VLAN 不行。' },
      server: { label: '服务器 VLAN', blurb: 'Proxmox 集群的 CaCa 和 Adell 共用这个网段，这样它们就能在线迁移虚拟机和 PXE 启动。' },
      default: { label: '默认 VLAN', blurb: '工作站和主 WPA3-Enterprise Wi-Fi 都在这里，它们能访问服务器，而 IoT VLAN 访问不到它们。' },
      iot: { label: 'IoT VLAN', blurb: '智能设备只能上网，别的都不行，因为防火墙规则把这个网段和其他所有 VLAN 都隔开了。' },
      core: { label: '核心网络', blurb: '在各个 VLAN 之间路由的网关和交换机。' },
    },
    nodes: {
      internet: { label: '互联网', sub: '公网入口',
        detail: '入站流量到达一个公网地址后直接进入网关，所以网关后面的任何设备都没法被直接访问。' },
      udm: { label: 'UDM Pro', sub: '网关、防火墙、RADIUS',
        detail: 'UniFi Dream Machine Pro 是网关、防火墙、网络控制器和 RADIUS 服务器。它决定哪个 VLAN 能访问哪个，还负责 WPA3-Enterprise Wi-Fi 的认证。' },
      sw1: { label: 'USW Pro Max 24', sub: '服务器机柜',
        detail: '这台 24 口交换机放在服务器机柜里，每台服务器都用一对冗余链路连到它。' },
      sw2: { label: 'USW Flex 2.5G', sub: '日常设备',
        detail: '这台 2.5 Gb 交换机连接家里速度更快的日常设备。' },
      sw3: { label: 'USW Lite 8 PoE', sub: '给 AP 供电',
        detail: '这台 8 口 PoE 交换机连接五个接入点并给它们供电，每个只要一根线。' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: '这台 Unraid 服务器独占一个 VLAN，受信任的 VLAN 可以访问它的存储和应用，而 IoT VLAN 不行。' },
      caca: { label: 'CaCa', sub: '常开',
        detail: 'CaCa 是一直开着的 Proxmox 节点，和 Adell 共用服务器 VLAN。' },
      adell: { label: 'Adell', sub: '按需开机',
        detail: 'Adell 是我需要时才唤醒的 Proxmox 节点，它和 CaCa 共用服务器 VLAN，用于在线迁移和 PXE 启动。' },
      clients: { label: '工作站', sub: '笔记本、台式机',
        detail: '日常设备都在默认 VLAN 上，它们能访问服务器，而 IoT VLAN 访问不到它们。' },
      aps: { label: '5 个 UniFi AP', sub: 'Wi-Fi',
        detail: '五个接入点在家里广播两个独立的 Wi-Fi 网络，由 Lite 8 通过 PoE 供电。' },
      wmain: { label: '主 WLAN', sub: 'WPA3-Enterprise',
        detail: '主 Wi-Fi 使用 WPA3-Enterprise，RADIUS 在 UDM Pro 上，所以每台设备都有自己的凭据。' },
      wiot: { label: 'IoT WLAN', sub: '已隔离',
        detail: '智能设备只能上网，别的都不行，因为防火墙规则把它们和其他所有 VLAN 都隔开了。' },
    },
  },

  storage: {
    eyebrow: '存储与 VM',
    title: '存储与虚拟机',
    poolsTitle: 'NewMain 上的存储',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: '阵列',
      sub: 'Unraid，校验保护',
      body: '它有两块校验盘和三块数据盘，所以能扛住两块硬盘同时坏掉，里面放着 PXE 备份、归档和媒体文件。',
    },
    fast: {
      name: '高速池',
      sub: 'ZFS NVMe 镜像',
      body: '两块 2 TB NVMe 组成一个 ZFS 镜像，Docker 应用数据、虚拟机磁盘和 PXE ISO 库都从这里运行。',
    },
    sharedOver: '共享方式',
    protocols: ['SFTP', '局域网内用 SMB', '给 Linux 和 macOS 用 NFS'],
    clusterTitle: 'Proxmox 集群',
    clusterLead: 'CaCa 和 Adell 组成一个 Proxmox 集群。CaCa 从自己的 1 TB SSD 启动，一直开着，而 Adell 通过网络启动，没有本地系统盘，我需要它的核心时才唤醒它。',
    vms: [
      { k: 'claudeplayground', d: '这是一台 Ubuntu 虚拟机，我做的应用都部署在这里，Claude 有 SSH 权限来发布它们。' },
      { k: 'CasaOS 和 Debian', d: '这些虚拟机以前直接跑在裸机上。' },
      { k: '网络唤醒', d: '有任务需要 Adell 时，UpSnap 就把它打开，所以它只在干活时耗电。' },
    ],
  },

  stack: {
    eyebrow: '软件',
    title: '服务',
    lead: '这些是 38 个服务里的主要几个，公开服务会显示每分钟检查一次的实时状态。',
    filterLabel: '筛选服务',
    categories: {
      all: '全部',
      access: '访问',
      files: '文件',
      media: '媒体与工具',
      monitoring: '监控',
      projects: '为了我的项目',
    },
    checkedAt: '{time} 检查',
    checking: '正在检查状态',
    showFewer: '收起',
    showAll: '显示全部 {n} 个服务',
    status: { up: '在线', down: '离线', wait: '检查中', build: '正在构建', self: '私有' },
    loadLabel: '负载：{label}',
    weights: {
      extreme: '最重',
      'very-high': '很高',
      high: '高',
      moderate: '中等',
      low: '轻',
      dev: '开发中',
      diagnostic: '按需',
    },
    facts: { runsOn: '运行在', load: '负载', access: '访问', category: '类别' },
    access: {
      public: '公开，经过 Nginx Proxy Manager 和 CrowdSec',
      dev: '在 NewMain 上开发中',
      private: '私有，在 Tailscale 网络里',
    },
    visit: '访问 {host}',
  },

  services: {
    openclaw: {
      blurb: '我正在做 OpenClaw，一个让 AI 智能体在实验室里做真实任务的运行器，现在还没做完。',
      long: [
        '目标是在实验室里给智能体一个安全的地方，让它能启动容器、检查服务、部署小应用，然后回来汇报。',
        '这是接着之前给 Claude 一台虚拟机的 SSH 权限来部署我的应用做的，下一步是让它运行实验室的一部分，而我来审查结果。',
      ],
    },
    npm: {
      blurb: '它作为反向代理挡在每个公开服务前面，负责 SSL 终止，把每个 chiambucket.com 子域名路由到对应的容器，还运行着一个 CrowdSec bouncer 来封禁恶意 IP。',
      long: [
        '所有公开流量都到达同一个地址，先进入 NPM，所以没有任何容器直接暴露在互联网上。',
        'CrowdSec 会盯着流量里的攻击模式，并封禁来源。因为一切都经过 NPM，所以只要 NPM 挂了，所有公开服务也都会跟着挂。',
      ],
    },
    tailscale: { blurb: '这是一个 WireGuard 组网，把我所有的设备放进同一个私有网络，我用它在任何地方 SSH 进来改配置。' },
    shadowsocks: { blurb: '这是一个代理，能让我的流量看起来像普通的 HTTPS，所以在受限的学校网络上我也能连回家。' },
    twingate: { blurb: '这是一个零信任连接器，我把它留作另一种进入方式，和 Teleport、WireGuard 以及 Unraid Connect 并用。' },
    pihole: { blurb: '它在 DNS 层面为整个网络屏蔽广告和追踪器，不过我现在主要用它来排查问题。' },
    immich: {
      blurb: 'Immich 取代了 Google Photos，成为我的照片库，支持手机自动备份、搜索和相册，也是我用得最多的服务。',
      long: [
        '我手机里的每张照片和每段视频都会自动备份到这里，并且一直存在我自己的存储上。',
        '它是 NewMain 上最重的服务。GTX 1070 负责搜索和人脸分组的机器学习，而给它规划资源，让我学会了怎么为真实的工作负载分配 CPU、GPU、内存和存储。',
      ],
    },
    lychee: { blurb: 'Lychee 是这个网站摄影页面背后的相册。' },
    pingvin: { blurb: '聊天软件发不了的大文件，我就传到这里，拿到一个链接发出去。' },
    pairdrop: { blurb: '它能在浏览器里把文件从一台设备发到另一台，就像 AirDrop 一样，不需要任何账号。' },
    fbq: {
      blurb: '我在家里通过 NFS 和 SMB 用的那些文件，它让我也能在浏览器里访问并生成分享链接。',
      long: ['在它之前我用过 Nextcloud、原版 FileBrowser、Alist 和 SFTPGo，最后留下来的是它。'],
    },
    syncthing: { blurb: '它让我的设备之间的文件一直保持同步，还带版本记录。' },
    fireshare: { blurb: '我和朋友们在这里上传、分享游戏片段，没有上传限制。' },
    neko: { blurb: '它在一个标签页里运行一个共享浏览器，这样我们就能进同一个房间，在同一个屏幕上一起看东西或查资料。' },
    crafty: { blurb: 'Crafty 管理着我的 Minecraft 服务器，它在两个地方运行，所以总能把世界开起来。' },
    paperless: { blurb: '这是一个文档归档，会对每份 PDF 和扫描件做 OCR，所以我在任何设备上都能搜索它们。' },
    vscode: { blurb: '它在浏览器里运行 VS Code，这样我就能编辑服务器上的配置文件。' },
    upstat: { blurb: '它追踪每个服务和容器的在线时间和响应时间，所以出了问题我总是第一个知道。' },
    netdata: { blurb: '它按秒记录 CPU、硬盘、网络和容器的各项指标。' },
    upsnap: { blurb: '这是一个网络唤醒面板，我就是用它打开 Adell 的。' },
    openspeedtest: { blurb: '这是一个自托管的测速工具，能测出服务器和我所在位置之间的吞吐量。' },
    portainer: { blurb: '它为 Unraid 主机和 CasaOS 虚拟机上的 Docker 提供一个网页界面。' },
    coturn: {
      blurb: '我为 Project June 搭了这个 TURN 和 STUN 服务器，让它的三路 WebRTC 摄像头画面能穿过蜂窝网络的 NAT。',
      long: [
        'Project June 通过 5G 传三路实时摄像头画面，但蜂窝网络会把设备藏在好几层 NAT 后面，WebRTC 自己是穿不过去的。',
        '我自己的 TURN 和 STUN 服务器给这些视频流提供一个固定的公网地址来会合，所以我在哪里都能开这辆车，而且它几乎不占 CPU。',
      ],
    },
    mosquitto: { blurb: '我最早是为 Project June 的遥测和控制搭了这个 MQTT 代理，现在它在我的 ESP32 学校项目和它们的仪表盘之间传递消息。' },
    nginx: { blurb: '两个小小的 nginx 容器负责提供我的静态网站和项目演示。' },
  },

  access: {
    eyebrow: '远程访问',
    title: '六种进入方式',
    lead: '我从外面连回家有六种各自独立的方式，所以就算其中一种坏了，我也不会被锁在外面。',
    primary: '主要',
    methods: {
      tailscale: { type: '组网 VPN', note: '这是一个 WireGuard 组网，所有设备一个账号登录，是我每天都在用的那个。' },
      wireguard: { type: '隧道', note: '这是一条直通网络的普通加密隧道，不经过任何第三方。' },
      teleport: { type: '内置 VPN', note: '这个 VPN 由 UDM Pro 自己签发，所以不需要配置任何客户端。' },
      twingate: { type: '零信任', note: '它按身份检查访问权限，并让所有入站端口保持关闭。' },
      shadowsocks: { type: '代理', note: '它让我的流量看起来像 HTTPS，所以我能穿过受限的学校和办公室 Wi-Fi。' },
      unraidConnect: { type: '厂商服务', note: '它让我能从 Unraid 账号直接访问 Unraid 服务器。' },
    },
    home: { type: '机柜', note: '上面每一条路最后都通到这里。' },
  },

  cta: {
    title: '我现在在做什么',
    sub: '我正在做 OpenClaw，一个让 AI 智能体在实验室里做真实任务的运行器，比如启动容器、检查服务、部署小应用，然后回来汇报，不过现在还没做完。',
    projects: '查看我的项目',
    contact: '联系我',
  },
};
export default zh;
