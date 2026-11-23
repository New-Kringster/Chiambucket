import type { BrolocatorCopy } from './en';

const zh: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: '我的第一块 PCB，一台 ESP32 手持设备，不需要网络就能通过 LoRa 发文字，还能通过 ESP-NOW 进行简陋的全双工语音通话，配有 KiCAD 电路板、用 Onshape 建模并 3D 打印的外壳，以及 PlatformIO 固件。',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'LoRA Messenger 手持设备',
    back: '返回项目',
    tag: '个人项目',
    title: <>LoRA <em>Messenger</em></>,
    lead: '这是我的第一块 PCB，也是我的第一个 ESP32 项目：一对手持设备，不需要网络就能通过 LoRa 互发文字，在彼此范围内时还能通过 ESP-NOW 进行简陋的全双工双向语音。做的时候我管它叫 Brolocator。',
    builtWith: '使用工具',
    links: ['GitHub', '演示视频', '3D 模型'],
  },
  chapters: '章节',
  rail: {
    Demo: '演示', Functionality: '它能做什么', ProjectDevelopment: '开发过程', Code: '代码',
    PCBDesign: 'PCB', threeDDesign: '外壳', Assembly: '组装',
  },
  demo: { h: '演示', video: 'LoRA Messenger 演示视频' },
  features: {
    h: '它能做什么',
    items: [
      '通过 LoRa 远距离发送文字消息',
      '对方在范围内时，通过 ESP-NOW 双向语音',
      '用可充电的 LiPo 电池供电',
      '有两块屏幕',
      '有一个测距模式',
      '用一个简单的菜单界面',
    ],
    p: '两种无线电各管一样，因为 LoRa 传得更远，但只能传短短的文字数据包，而 ESP-NOW 距离短，速度却快到足以支撑简陋的双向语音。下面的演示把两种都展示了一遍。',
    alts: [
      'LoRA Messenger 的正面',
      'LoRA Messenger 的侧面',
      '屏幕的特写',
      '菜单界面',
      '消息界面',
      '测距模式',
    ],
  },
  demoWidget: {
    texts: [
      '在路上了，等我 10 分钟',
      '找到登山口了',
      '电量 40%，往回走了',
      '营地就在山脊后面',
    ],
    radio: {
      lora: {
        label: '用 LoRa 发文字',
        short: 'LoRa',
        range: '远距离',
        carries: '短文字数据包',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa 比 ESP-NOW 传得远得多，但带宽只够传文字。',
      },
      espnow: {
        label: '用 ESP-NOW 通话',
        short: 'ESP-NOW',
        range: '短距离直连',
        carries: '简陋的全双工语音',
        module: 'ESP32 本身',
        blurb: 'ESP-NOW 是两块 ESP32 之间的直连，快到足以进行简陋的双向语音，但只能在短距离内用。',
      },
    },
    quote: ['“', '”'] as [string, string],
    modesAria: '选择一种无线链路',
    replay: '播放演示',
    you: '你',
    friend: '朋友',
    screen: {
      pick: '选一条消息', sending: '发送中', delivered: '已送达',
      micLive: '麦克风开启', holdToTalk: '按住说话',
      newMessage: '新消息', receiving: '接收中', standingBy: '待机中', listening: '收听中',
    },
    link: {
      inFlight: '数据包传输中', delivered: '已送达', longRange: '远距离链路',
      streaming: '双向语音传输中', direct: '点对点直连',
    },
    pickLabel: '选一条消息，然后发送',
    send: '用 LoRa 发送',
    holdLabel: '按住说话',
    transmitting: '发送中',
    holdToTalk: '按住说话',
    gauge: { range: '距离', carries: '内容', radio: '无线电' },
  },
  dev: {
    h: '开发过程',
    p: '这是我第一次深入研究单片机，也是我的第一块 PCB，所以每个元件怎么用，我都是靠 YouTube 和 ChatGPT 学会的。',
    alt: '面包板原型，上面有 ESP32、LoRa 模块、I2S 麦克风和扬声器、两块 OLED 屏幕、旋转编码器和按钮',
    caption: '面包板原型，有一块 ESP32 DevKit、一个 Ebyte E220-900D LoRa 模块、I2S 麦克风和扬声器、两块 I2C OLED 屏幕、一个旋转编码器和几个按钮',
  },
  code: {
    h: '代码',
    p: 'ESP32 的固件我是在 PlatformIO 里写的，我查资料时发现它最适合 ESP32。源代码在 GitHub 上，完整的 PlatformIO 项目就在下面。',
    alt: '在 PlatformIO 里打开的固件',
    project: { title: 'PlatformIO 项目', text: '这是完整的固件项目，可以直接在 PlatformIO 里打开。', button: '下载项目' },
    repo: { title: 'GitHub 上的源代码', text: '固件的源代码放在 GitHub 上。', button: '在 GitHub 上查看代码' },
  },
  pcb: {
    h: 'PCB',
    p: '我在 KiCAD 里设计了这块电路板，让它装下所有元件。',
    schematicAlt: 'KiCAD 原理图',
    schematicCaption: '原理图',
    layoutAlt: 'KiCAD 电路板布局',
    layoutCaption: '电路板布局',
    finishedAlt: '做好的 PCB',
    files: { title: 'KiCAD 文件', text: '这是这块电路板完整的 KiCAD 项目。', button: '下载 KiCAD 文件' },
  },
  case: {
    h: '外壳',
    p: '外壳是我在 Onshape 里建模、再 3D 打印出来的，在线模型的链接就在下面。',
    figs: [
      { alt: 'Onshape 里的外壳模型', caption: 'Onshape 里的外壳' },
      { alt: '并排放着的几版打印外壳', caption: '外壳打印出来的几个版本' },
      { alt: '加固前后的外壳卡扣', caption: '我加固前后的外壳卡扣' },
    ],
    model: { title: 'Onshape 模型', text: '这是外壳的在线 3D 模型。', button: '在 Onshape 里打开 3D 模型' },
  },
  assembly: {
    h: '组装',
    figs: [
      { alt: '所有元件都焊在 PCB 上', caption: '所有元件都焊到 PCB 上，而且能用' },
      { alt: '把 PCB 装进外壳', caption: '把 PCB 装进外壳' },
      { alt: '做好的 LoRA Messenger', caption: '做好的 LoRA Messenger' },
    ],
  },
};

export default zh;
