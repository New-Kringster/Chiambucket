import type { PandusCopy } from './en';

const zh: PandusCopy = {
  meta: {
    title: 'Pandus 分配器 | Braven Chiam',
    description: '我在南洋理工学院的第一个学校项目，是一台由六个 3D 打印部件组成、由 Arduino Uno 控制的糖浆分配器，我用 PyFirmata 在 Python 里给它编程。',
    ogDescription: 'Pandus 是一台由六个 3D 打印部件组成的糖浆分配器，由一块用 PyFirmata 驱动的 Arduino Uno 控制。',
  },
  ld: { headline: 'Pandus 分配器' },
  hero: {
    alt: 'Pandus 糖浆分配器',
    back: '返回项目',
    tag: '学校项目',
    title: <>Pandus <em>分配器</em></>,
    lead: 'Pandus 是我的第一个学校项目，一台由六个 3D 打印部件组成、由 Arduino Uno 控制的糖浆分配器。我用的是课上发的零件，再加上几个自己买的。',
    builtWith: '使用工具',
    links: { video: '演示视频', cad: '3D 模型' },
  },
  chapters: '章节',
  rail: {
    PromotionalVideo: '视频', ProjectBackground: '背景', DesignProcess: '设计',
    ControlnFunction: '控制', Coverimg: '封面图',
  },
  video: { h: '视频', title: 'Pandus 分配器视频' },
  background: {
    h: '背景',
    p: [
      'Pandus 是我在南洋理工学院读一年级时的第一个大项目，题目很开放，没有指定主题。我们拿到了一块 Arduino Uno、一个 4G 舵机、几颗 LED、按钮、拨动开关、一个红外避障模块和一捆电线。',
      '我本来打算做一台饮水机，但已经有人选了，所以我改做了一台糖浆分配器。',
    ],
    alt: '拍摄 Pandus 视频的其中一段',
    caption: '拍摄视频的其中一段',
  },
  design: {
    h: '设计',
    p: 'Pandus 是我在 Onshape 里设计的，因为我之前没怎么用过它，光是学这个软件就花了很多时间。这样一来就没时间做原型了，所以我直接把最终设计送去 3D 打印，结果每个部件第一次打印就装上了。',
    explodedAlt: 'Onshape 里 Pandus 模型的爆炸图',
    assembledAlt: 'Onshape 里组装好的 Pandus 模型',
    cadTitle: '3D 模型',
    cadText: '你可以在 Onshape 里转动 Pandus 模型，还能把它拆开来看。',
    cadButton: '在 Onshape 里打开 3D 模型',
  },
  control: {
    h: '控制',
    p: [
      '课上教我们用 Firmata 库在 Python 里给 Arduino 编程。除了课上发的零件，我还买了大功率 LED、一个直流泵和一块继电器板，大电流的部件则用一个单独的充电宝供电。',
      '下面的演示会按照再往下那张流程图跑一遍出液流程，你也可以自己选一个档位来跑。',
    ],
    alts: [
      '流程图：红外传感器打开舵机并点亮 LED，选择按钮设定档位，确认按钮让泵运行 3、4 或 5 秒',
      'Arduino Uno、舵机、红外传感器、继电器、直流泵、大功率 LED、蜂鸣器、按钮和指示灯的电路图',
      'Pandus 内部的接线，有继电器板、按钮和指示灯',
      'Pandus 内部的面包板、蜂鸣器和 Arduino Uno',
    ],
  },
  cover: {
    h: '封面图',
    p: '我在不同的灯光下给 Pandus 拍了四张照片，再在 Photoshop 里把四张合成了封面。',
    caption: '四张照片是怎么合成封面的',
  },

  demo: {
    level: '{n} 档',
    ledText: ['红色 LED', '红色和黄色 LED', '全部三颗 LED'],
    pump: '泵 {s} 秒',
    phases: {
      idle: { label: '等待', blurb: '分配器在等红外避障模块检测到杯子。' },
      wake: { label: '放杯', blurb: '杯子触发红外模块时，舵机转到 180°，打开按钮上方的门，大功率 LED 亮起，档位重置为 1。' },
      select: { label: '选择', blurb: '选择按钮会在 1、2、3 档之间切换，指示灯显示选中了哪一档。' },
      pour: { label: '出液', blurb: '确认按钮通过继电器打开直流泵，根据档位运行 3、4 或 5 秒。' },
      done: { label: '完成', blurb: '泵停下来，所有东西都关掉，等下一个杯子。' },
    },
    selectNow: '现在是 {n} 档，亮起的是{leds}。',
    cup: {
      idle: '出液口下的杯子，空着，正在等待',
      empty: '出液口下的杯子，空的',
      filling: '出液口下的杯子，正在按 {n} 档出液',
      filled: '出液口下的杯子，已按 {n} 档装好',
    },
    status: { reduced: '{level} · 泵 {s} 秒', auto: '自动运行中 · {level}', pick: '你选的 · {level}' },
    resume: '自动运行',
    levelsAria: '选择档位',
    railAria: '出液流程',
    again: '再倒一杯',
    schemaAria: '元件状态',
    comps: {
      ir: { label: '红外模块', full: '红外避障模块' },
      servo: { label: '门', full: '按钮上方的舵机门' },
      led: { label: 'LED', full: '杯子上方的大功率 LED' },
      pump: { label: '泵', full: '由继电器控制的直流泵' },
    },
    states: { watching: '监测中', triggered: '已触发', closed: '关闭', open: '打开', on: '开', off: '关', running: '运行中' },
  },
};

export default zh;
