import type { CsdpCopy } from './en';

const zh: CsdpCopy = {
  meta: {
    title: 'EMA 智能家居 | Braven Chiam',
    description: '我们五人学校小组做的智能家居系统，拿了 A。四个 BeagleBone Black Wireless 节点分别负责室内环境、浴室、厨房和门，一台 SocketIO 网页服务器把它们连在一起，并托管一个带 Spline 3D 视图的实时仪表盘。',
  },
  ld: { headline: 'EMA 智能家居' },
  hero: {
    alt: 'EMA 智能家居',
    back: '返回项目',
    tag: '学校项目，五人小组',
    title: <>EMA 智能<em>家居</em></>,
    lead: '这是一个用四块 BeagleBone Black Wireless 搭起来的智能家居系统，目的是减少家里用的电。这是我做过的最复杂的小组项目，用上了我们好几门课学到的东西，最后拿了 A。',
    builtWith: '使用工具',
    links: { demo: '在线演示', github: 'GitHub', video: '宣传视频' },
  },
  chapters: '章节',
  rail: {
    PromoVideo: '视频', Team: '团队', ProjBackground: '任务', DesignProcess: '仪表盘',
    Climate: '环境节点', Bathroom: '浴室节点', Kitchen: '厨房节点', Intrusion: '防盗节点',
    Connectivity: '连接', SlideDeck: '演示文稿', Documentation: '项目文档',
  },
  video: { h: '视频', title: 'EMA 智能家居宣传视频' },
  team: {
    h: '团队',
    roles: ['组长、文档、代码', '美术、代码、设计', '文档、代码', '文档、代码', '组员'],
    me: '{name}（我）',
    profile: '主页',
    noProfile: '没有主页',
  },
  brief: {
    h: '任务',
    p: '我们拿到了四块 BeagleBone Black Wireless 和一套 MikroBUS click 模块，任务是做一个连 Wi-Fi、支持可持续生活的系统。我们做了一个智能家居系统，实时监测用电情况，并通过开关设备来减少能耗，后来又加了一个防盗检测节点。',
    alt: '每块板子在家里的位置',
    caption: '每块板子在家里的位置',
  },
  dashboard: {
    h: '仪表盘',
    p: <>这个项目大部分是软件，所以设计上的功夫都花在让仪表盘清楚、好读、一眼就能看懂上。我们还加了一个 Spline 3D 房屋模型，实时展示每一个动作，你可以在<a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">在线演示</a>里亲自试试。</>,
    mockAlt: '仪表盘的 Figma 设计稿',
    mockCaption: '仪表盘的 Figma 设计稿',
    finishedCaption: '做好的仪表盘',
    splineCaption: '实时展示动作的 Spline 3D 视图',
  },
  nodes: {
    Climate: {
      h: '环境节点',
      p: '环境节点监测温度、湿度，以及房间里有没有人，只有在检测到有人、而且房间又热又潮时，它才会打开风扇。',
      alt: '环境节点的硬件',
    },
    Bathroom: {
      h: '浴室节点',
      p: '你用按钮和屏幕设定想洗多久的澡。节点检测到你走进淋浴间时计时器就会启动，时间一到蜂鸣器就会响。',
      alt: '浴室节点的硬件',
    },
    Kitchen: {
      h: '厨房节点',
      p: '厨房节点监测冰箱的用电情况，并把一个能耗分数报给仪表盘。它同时也是火灾警报器，如果检测到失控的火焰，每个节点都会响起警报。',
      alt: '厨房节点的硬件',
    },
    Intrusion: {
      h: '防盗节点',
      p: '防盗节点会检测有没有人敲门，以及门有没有在不寻常的时间被打开，只要发生其中一种情况，每个节点都会响起警报。',
      alt: '防盗节点的硬件',
    },
  },
  connectivity: {
    h: '连接',
    p: [
      '每块板子都连到一台 SocketIO 网页服务器，它托管着仪表盘，并在节点之间协调各种事件和警报。',
      '下面的地图展示了四个节点和服务器。选一个节点看看它是做什么的，或者模拟一场厨房火灾，看看警报怎么传到每个节点。',
    ],
    diagramAlt: '节点、服务器和仪表盘之间连接方式的示意图',
    diagramCaption: '节点、服务器和仪表盘是怎么连起来的',
    repoTitle: 'GitHub 上的源代码',
    repoText: '仓库里有每个节点的代码，以及托管仪表盘的 SocketIO 服务器的代码。',
    repoButton: '在 GitHub 上查看代码',
  },
  slides: { h: '演示文稿', title: 'EMA 智能家居演示文稿（PDF）', open: '打开演示文稿（PDF）' },
  docs: { h: '项目文档', title: 'EMA 智能家居项目文档（PDF）', open: '打开项目文档（PDF）' },

  nodeMap: {
    nodes: {
      climate: {
        name: '环境',
        short: '风扇控制',
        does: '只有在房间里有人、而且空气又热又潮时，它才会打开风扇。',
        hardware: 'BME680 温湿度传感器、PIR 人体传感器、8x8 LED 点阵、蜂鸣器',
        alarm: '任何节点发出警报时它都会响',
      },
      bathroom: {
        name: '浴室',
        short: '淋浴计时',
        does: '它按你用按钮设定的时长给淋浴计时，你一走进去就开始。',
        hardware: 'PIR 传感器、OLED 屏幕、电容按钮、蜂鸣器',
        alarm: '时间到了会响三声',
      },
      kitchen: {
        name: '厨房',
        short: '能耗与火灾',
        does: '它把冰箱的用电情况以分数的形式报给仪表盘，同时留意有没有起火。',
        hardware: '模拟电流传感器、Flame Click、OLED 屏幕、蜂鸣器',
        alarm: '一起火，每个节点都会响起警报',
      },
      intrusion: {
        name: '防盗',
        short: '门禁安全',
        does: '它留意有没有人敲门，以及门有没有在不寻常的时间被打开。',
        hardware: '门上的干簧管开关、检测敲门的振动传感器、蜂鸣器',
        alarm: '任何一种情况都会让每个节点响起警报',
      },
    },
    hub: { label: '网页服务器', idle: 'SocketIO，托管仪表盘', alarm: '警报已发给所有节点' },
    nodeAria: '{name}节点',
    nodeAriaAlarm: '{name}节点，警报正在响',
    alarmTag: '警报',
    caption: '每条线都是一个 SocketIO 连接，上面的小点是正在发往服务器的读数。',
    eyebrow: { pinned: '已选节点', idle: '选一个节点' },
    tabsAria: '传感器节点',
    cardTitle: '{name}节点',
    terms: { does: '作用', hardware: '硬件', buzzer: '蜂鸣器' },
    status: {
      idle: '已连接，正在向服务器发送读数',
      arming: '厨房检测到火焰，蜂鸣器响起',
      travelling: '警报正在发往服务器',
      received: '服务器广播警报，每个节点都响了',
    },
    sim: { run: '模拟厨房火灾', busy: '警报进行中' },
    hint: '厨房节点检测到火焰时，服务器会收到警报，再把它转发给每个节点。',
  },
};

export default zh;
