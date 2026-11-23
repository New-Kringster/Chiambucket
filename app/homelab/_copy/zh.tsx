import type { HomelabCopy } from './en';

const zh: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      '我的家庭云由 AI 智能体运行，它们跑在 braven-agents 上，这台服务器掌控着其他机器、UniFi 网络，以及 Cloudflare 这样的外部平台。这一页介绍这一切是怎么连在一起的，还有机器、服务和它们的实时状态。',
  },
  jsonLd: {
    headline: '一个由 AI 智能体运行的家庭云',
    about: ['自托管', 'AI 智能体', '基础设施自动化', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: '{name} 详情',
  close: '关闭',

  hero: {
    checking: '正在检查公开服务',
    online: '{count}个公开服务在线',
    onlineCount: '{n}/{total}',
    title: '会自己运转的家庭云',
    lead: '这里的每台机器、每个网络和每个服务，都由 braven-agents 来运行，这台服务器的工作就是运行我的 AI 智能体。它们能访问其他所有东西，从存储服务器到路由器再到 Cloudflare，所以大部分改动只要一条 prompt 就能完成，我什么都不用碰。',
    mapCta: '查看连接方式',
    machinesCta: '查看机器',
  },

  core: {
    title: '一切都经过 braven-agents',
    lead: 'braven-agents 握着通往其他每个系统的钥匙，上面的智能体通过各自的 API 或 SSH 访问每一个系统。选一个系统，看看它们在那里做什么。',
    mapLabel: 'braven-agents 如何连接其他每个系统',
    coreTag: '核心',
    coreRole: '它运行着 Claude Code、Codex 和 OpenCode，还有负责定时任务的 Hermes，我在 T3 Code 里启动并跟进它们的工作。',
    groups: { machines: '机器', edge: '网络与边缘', platforms: '平台' },
    doesLabel: '智能体在这里做什么',
    planned: '计划中',
    proxmoxName: 'Proxmox 服务器',
    nodes: {
      newmain: { role: '存储和自托管服务', via: 'Unraid API',
        does: ['启动、更新和重启 Docker 容器', '监控阵列和每块硬盘的健康状况', '创建共享和虚拟机'] },
      caca: { role: '未公开项目的开发环境', via: 'SSH',
        does: ['构建和测试这个项目', '让它的工具和软件包保持最新'] },
      servertop: { role: '我的 iCloud 桥接', via: 'SSH',
        does: ['读取和添加日历里的日程', '读取和添加提醒事项', '处理其他需要 Mac 的 iCloud 任务'] },
      blade: { role: 'GPU 任务', via: 'SSH',
        does: ['在 RTX 3080 上跑训练任务，比如训练 DrumNet 的那些', '跑更大的模型和其他吃 GPU 的工作'] },
      proxmox: { role: '虚拟机，硬件还没定', via: '尚未运行',
        does: ['它还在组装中，所以上面还什么都没跑。'] },
      unifi: { role: '整个家庭网络', via: 'UniFi API',
        does: ['创建网络和 VLAN', '添加防火墙规则和端口转发', '查找和管理已连接的设备'] },
      npm: { role: '公开服务的反向代理', via: 'NPM API',
        does: ['为每个新子域名添加代理主机', '签发和续期 SSL 证书', '设置谁能访问一个服务'] },
      cloudflare: { role: 'DNS 和边缘服务', via: 'Cloudflare API',
        does: ['创建和修改 DNS 记录', '为新应用开通 Cloudflare Tunnel', '部署 Workers，管理 R2 存储'] },
      github: { role: '我的代码', via: 'GitHub CLI',
        does: ['创建仓库、分支和 pull request', '推送它们做的改动'] },
      vercel: { role: '这个网站的托管', via: 'Vercel API',
        does: ['部署预览，检查构建是否通过', '在我要求时让这个网站上线'] },
      shebang: { role: '我的托管平台', via: 'Shebang MCP',
        does: ['发布页面和文件', '给新应用配上自己的数据库和登录'] },
    },
  },

  prompt: {
    title: '从一条 prompt 到一个跑起来的应用',
    lead: '我要一个新东西时，智能体会自己把它涉及的每个系统都处理好。比如我让它们把一个新应用上线到它自己的 chiambucket.com 地址，过程是这样的：',
    requestLabel: '请求',
    request: '把我新的笔记应用上线到 notes.chiambucket.com。',
    steps: [
      { at: 'braven-agents', t: '一个智能体写好应用和它的 Docker Compose 文件，然后测试它。' },
      { at: 'NewMain', t: '它把应用作为容器在 NewMain 上启动。' },
      { at: 'Nginx Proxy Manager', t: '它为新子域名添加代理主机，并为它申请 SSL 证书。' },
      { at: 'Cloudflare', t: '它创建 DNS 记录，把子域名指向家里。' },
      { at: 'UniFi', t: '如果应用需要端口或防火墙规则，它就在路由器上加上。' },
      { at: 'braven-agents', t: '它打开这个地址，确认应用有响应，然后把链接发给我。' },
    ],
    ownTitle: '不用我开口',
    own: '每天都会跑一次健康检查，能修的它自己就修了，比如重启停掉的容器、服务和虚拟机，重新挂载掉线的硬盘。',
    waitTitle: '还要等我的事',
    wait: '删除数据、动存储阵列和重启机器，仍然需要我批准，而且这些工具在做任何破坏性操作之前都会先问我。',
  },

  machines: {
    title: '机器',
    photoAlt: '{name}',
    lead: '五台机器正在运行，第六台还在计划中。',
    status: { running: '运行中', planned: '计划中' },
    items: {
      agents: {
        name: 'braven-agents', role: '核心',
        blurb: '这是这里性能最强的机器，它在裸机上运行 Ubuntu，这样整台机器都归智能体用。',
        specs: [
          { k: '系统', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X，16 核' },
          { k: '内存', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: '存储', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: '存储和服务',
        blurb: 'NewMain 把我的文件、照片和备份存在由五块硬盘组成、带校验保护的 Unraid 阵列里，还用 Docker 运行这一页下面那些自托管服务。',
        specs: [
          { k: '系统', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2，20 核' },
          { k: '内存', v: '128 GB DDR3' },
          { k: '阵列', v: '5 块硬盘，校验保护' },
          { k: '控制器', v: 'IT 模式的 PERC H710P' },
        ],
      },
      caca: {
        name: 'CaCa', role: '开发环境',
        blurb: 'CaCa 是一台小小的 ThinkCentre，用作一个我暂时还不能说的项目的开发环境。',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: '内存', v: '32 GB DDR4' },
          { k: '存储', v: '1 TB NVMe SSD' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'iCloud 桥接',
        blurb: 'Servertop 是一台一直登录着我 iCloud 的 MacBook Air，智能体就是通过它访问我的日历、提醒事项和其他私人的东西。',
        specs: [
          { k: '型号', v: 'MacBook Air，M1' },
          { k: '内存', v: '8 GB' },
          { k: '存储', v: '256 GB SSD' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'GPU 工作机',
        blurb: '这台笔记本运行 Ubuntu，负责吃 GPU 的工作，当初为 OCR Reader 训练 DrumNet 的也正是它。',
        specs: [
          { k: '系统', v: 'Ubuntu' },
          { k: 'CPU', v: '第十代 Core i7' },
          { k: 'GPU', v: 'RTX 3080 笔记本 GPU' },
          { k: '内存', v: '32 GB' },
          { k: '存储', v: '2 × 1 TB SSD' },
        ],
      },
      proxmox: {
        name: 'Proxmox 服务器', role: '虚拟机',
        blurb: '一台新的 Proxmox 服务器还在组装中，硬件还没定下来。',
        specs: [
          { k: '系统', v: 'Proxmox VE' },
          { k: '硬件', v: '待定' },
        ],
      },
    },
    rack: {
      alt: '我房间里的机柜：顶部是插着蓝色网线的配线架，服务器在网门后面',
      caption: 'braven-agents、NewMain 和 CaCa 一起放在我房间的这个机柜里。',
    },
  },

  stack: {
    title: '托管的服务',
    lead: 'NewMain 为我和我的项目运行着这些服务，公开服务会显示每分钟检查一次的实时状态。',
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
    status: { up: '在线', down: '离线', wait: '检查中', self: '私有' },
    loadLabel: '负载：{label}',
    weights: {
      extreme: '最重',
      'very-high': '很高',
      high: '高',
      moderate: '中等',
      low: '轻',
      diagnostic: '按需',
    },
    facts: { runsOn: '运行在', load: '负载', access: '访问', category: '类别' },
    access: {
      public: '公开，经过 Nginx Proxy Manager 和 CrowdSec',
      private: '私有，在 Tailscale 网络里',
    },
    visit: '访问 {host}',
  },

  services: {
    npm: {
      blurb: '它作为反向代理挡在每个公开服务前面，负责 SSL 终止，把每个 chiambucket.com 子域名路由到对应的容器，还运行着一个 CrowdSec bouncer 来封禁恶意 IP。',
      long: [
        '所有公开流量都到达同一个地址，先进入 NPM，所以没有任何容器直接暴露在互联网上。',
        'CrowdSec 会盯着流量里的攻击模式，并封禁来源。因为一切都经过 NPM，所以只要 NPM 挂了，所有公开服务也都会跟着挂。',
      ],
    },
    tailscale: { blurb: '这是一个 WireGuard 组网，把我所有的设备放进同一个私有网络，我用它在任何地方连回家。' },
    shadowsocks: { blurb: '这是一个代理，能让我的流量看起来像普通的 HTTPS，所以在受限的学校网络上我也能连回家。' },
    twingate: { blurb: '这是一个零信任连接器，我把它留作另一种进入方式，和 Tailscale、WireGuard 以及 UniFi Teleport 并用。' },
    pihole: { blurb: '它在 DNS 层面为整个网络屏蔽广告和追踪器，不过我现在主要用它来排查问题。' },
    immich: {
      blurb: 'Immich 取代了 Google Photos，成为我的照片库，支持手机自动备份、搜索和相册，也是我用得最多的服务。',
      long: [
        '我手机里的每张照片和每段视频都会自动备份到这里，并且一直存在我自己的存储上。',
        '它是 NewMain 上最重的服务，给它规划资源，让我学会了怎么为真实的工作负载分配 CPU、内存和存储。',
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
    crafty: { blurb: 'Crafty 管理着我的 Minecraft 服务器。' },
    paperless: { blurb: '这是一个文档归档，会对每份 PDF 和扫描件做 OCR，所以我在任何设备上都能搜索它们。' },
    vscode: { blurb: '它在浏览器里运行 VS Code，这样我就能编辑服务器上的配置文件。' },
    upstat: { blurb: '它追踪每个服务和容器的在线时间和响应时间，所以问题能及早发现。' },
    netdata: { blurb: '它按秒记录 CPU、硬盘、网络和容器的各项指标。' },
    upsnap: { blurb: '这是一个网络唤醒面板，能把睡着的机器叫醒。' },
    openspeedtest: { blurb: '这是一个自托管的测速工具，能测出服务器和我所在位置之间的吞吐量。' },
    portainer: { blurb: '它为 NewMain 上的 Docker 容器提供一个网页界面。' },
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

  tubs: {
    title: 'Shebang Tubs',
    status: '早期开发中',
    lead: 'Shebang Tubs 是我正在做的一个项目和框架，让任何人都能用智能体搭建并自托管自己的应用。',
    body: [
      '每个应用就是一个 tub，也就是一个文件夹，里面有一份普通的 Compose 文件，还有它自己的数据库、文件和密钥，所以智能体可以构建它、运行它，再把它连同数据完整地打成一个 zip 搬到另一台机器上。',
      '一个仪表盘负责部署、启动和停止这些 tub，发布一个 tub 时，它会通过 Cloudflare Tunnel 拿到一个网址，不需要端口转发，也不需要反向代理。智能体有自己的 API key，所以这些事它们都能自己做。',
    ],
    diagram: {
      label: '一个 tub 装着什么、去往哪里',
      tub: '一个 tub',
      parts: ['Compose 文件', '数据库', '文件', '密钥'],
      zip: '导出为一个 zip',
      runs: '能在任何装了 Docker 的机器上运行',
      publish: '通过 Cloudflare Tunnel 发布',
    },
  },

  cta: {
    title: '接下来的方向',
    sub: '目标是一个能照顾好自己的个人云，只要一条 prompt 就能构建和运行任何东西。大部分拼图现在都已经到位，下一块是新的 Proxmox 服务器。',
    projects: '查看我的项目',
    contact: '联系我',
  },
};
export default zh;
