import type { WaterslopCopy } from './en';

const zh: WaterslopCopy = {
  meta: {
    title: 'OCR Reader，在 ESP32-S3 上运行的视觉水表读数器 | Chiambucket',
    description:
      'OCR Reader 是一个低成本、用电池供电的水表读数器，它用摄像头来读水表。一个 69.3 万参数的网络 DrumNet V10 完全在它的 ESP32-S3 上运行，负责读出字轮，读数再通过 LoRaWAN 发出去。文章会讲到 MeterSim、SimGen2、训练它的六个智能体、一步步拆开的网络、固件、3D 展示的 PCB、外壳，还有一个 ConfigKing 模拟器。',
    ogTitle: 'OCR Reader：在 ESP32-S3 上运行的视觉水表读数器',
  },
  ld: { headline: 'OCR Reader：在 ESP32-S3 上运行的视觉 OCR 水表读数器' },

  ui: {
    chapterDash: '第 {n} 章',
    next: '下一步',
    nextChapter: '下一章',
    nextFrame: '下一帧',
    coverAria: '第 {n} 章：{title}',
    coverN: '第 {n} 章',
    coverContents: '第 {n} 章内容',
    ck: {
      hint: '点屏幕或按键就能接手操作',
      deviceAria: '运行在 M5Stack Cardputer 上的 ConfigKing 模拟器。点一下屏幕或按键，然后用方向键、Enter、Escape 和 Tab 操作。',
      keyboard: 'Cardputer 键盘',
      view: '视图',
      close: '近看',
      full: '全景',
      zoom: '放大',
      fullScreen: '全屏',
      exitFullScreen: '退出全屏',
    },
  },

  entrance: '在 ESP32-S3 上做水表 OCR',
  skip: { toEnd: '跳到结尾', toTop: '回到顶部' },

  hero: {
    label: 'OCR Reader',
    labelSub: '在 ESP32-S3 上做水表 OCR · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader 是一个低成本、低功耗、基于视觉的 OCR 水表读数器。一个 69.3 万参数的神经网络 DrumNet V10 完全在读数器的 ESP32-S3 上运行，它会找到数字窗口、读出每个字轮，再通过 LoRaWAN 把数字发回去，整个过程大约 2 秒。目标是一套电池撑 2 年、准确率 99%，目前的版本能读对 56% 的读数，我还打算继续改进。',
    contentsAria: '章节',
    start: '开始阅读',
    report: '报告',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  chapters: {
    v2: 'PCB 与外壳', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: '智能体工作流',
    firmware: '固件', power: '功耗优化', camera: '摄像头选型', proto: 'Prototype V2', conclusion: '总结', report: '报告',
  },

  pcb: {
    aria: 'Prototype V2 的 PCB 和外壳的 3D 展示，最后是读数器给水表拍照',
    chapterColon: '第 {n} 章：',
    name: 'OCR Reader PCB',
  },

  film: {
    aria: '整个 DrumNet V10 架构的动画',
    title: 'DrumNet',
    of: '{stage} · {n} / {total}',
    nudge: '影片会自己播放，页面稍后会接着往下。',
    scenesAria: '场景',
    sceneAria: '{n}. {title}',
    prev: '上一个场景',
    prevTitle: '上一个 (←)',
    play: '播放',
    pause: '暂停',
    replay: '重播',
    playTitle: '播放 / 暂停（空格）',
    next: '下一个场景',
    nextTitle: '下一个 (→)',
    fast: '快进，现在是 {n} 倍',
    fastTitle: '快进 (f)',
    skip: '跳过本章',
    skipTitle: '跳到下一章 ConfigKing',
    scenes: {
      photo: {
        stage: '拍摄', title: '读数器刚拍下的照片',
        body: '这是一张 800 × 600 的灰度画面，从这里开始的一切都在 ESP32-S3 上完成，用到的就只有这张照片。',
      },
      downscale: {
        stage: '输入', title: '把拍到的图缩小',
        body: '读数器以 800 × 600 灰度拍下水表，给定位器用的时候会缩小到 320 × 240，数字少了四倍，所以粗略搜索又快又省。',
      },
      'spot-net': {
        stage: '定位器', title: '五个模块把缩略图缩成 10 × 7 的网格',
        body: '每个模块都会让一个 3 × 3 卷积核滑过输入，留下强的响应（ReLU），再把尺寸减半（max-pool）。缩略图先变成 8 张特征图，然后是 16、24、32 和 32 张，每次都只有上一次的一半大，直到最后一个模块的一个格子代表缩略图上一块 32 × 34 的区域。',
      },
      'spot-head': {
        stage: '定位器', title: '分数图选出格子，另外四张图说明位置',
        body: '一个 1 × 1 卷积把第 5 个模块变成五张 10 × 7 的图，分数图会选出最可能是数字窗口中心的那个格子。这个位置交给 dx、dy、宽度和高度四张图，在同一个格子读出数值，合起来就在缩略图上画出一个框。',
      },
      'spot-crop': {
        stage: '定位器', title: '先画粗框，再大方地裁一块',
        body: '定位器的结果比较粗糙，所以框会放宽到 1.5 倍，周围的裁剪区域取框宽的 1.5 倍、框高的 2.4 倍。这块是从完整的 800 × 600 画面上裁下来的，不是从缩略图上，然后送去精修器。',
      },
      'ref-net': {
        stage: '精修器 · 第 1 轮', title: '四个模块把裁剪图变成 32 张 32 × 12 的特征图',
        body: '裁剪图会转成灰度并缩放到 256 × 96，RefNet 跑四个和定位器同类的模块。最后一个不做池化，所以第 4 个模块保留 32 张 32 × 12 的特征图，裁剪图每 8 个像素对应一列。',
      },
      'ref-avg': {
        stage: '精修器 · 第 1 轮', title: '每张特征图都被平均成一行和一列',
        body: '第 4 个模块是一叠 32 张特征图，它们会一张张剥离出来。每张图的 32 列各自平均，组成列平均图里的一行，12 行各自平均，组成行平均图里的一列，所以前者负责找左右，后者负责找上下。',
      },
      'ref-heads': {
        stage: '精修器 · 第 1 轮', title: '平均图变成分数条和偏移条',
        body: '一个 1 × 1 卷积读取列平均图的每一列，把它变成四条：左边缘的分数和偏移，右边缘也一样，行平均图则再变成四条，负责上下边缘。最高分选出格子，它的偏移说明边缘落在格子里的哪个位置，四条边缘合起来就是框。',
      },
      'ref-pass2': {
        stage: '精修器 · 第 2 轮', title: '扩大框，再裁一次，跑同一个网络',
        body: '第 1 轮的框只能和定位器的猜测一样居中，所以要把它扩大、再裁一次，送进完全相同的精修器，用的是同样的四个模块、同样的输出头和同样的 15,400 个权重。第 2 轮会快速重放第 1 轮，它的框接着交给读取器。',
      },
      cut: {
        stage: '切分', title: '把窗口切成字轮',
        body: '4 个整数字轮加 2 个小数字轮的布局在设置时就定好了，所以窗口被切成六个等宽的格子，每个都转成灰度、在 32 × 64 下拉满对比度，再送给读取器。我们跟着第六个字轮看，它是 7。',
      },
      'rd-net': {
        stage: '读取器 1', title: '读取器把一个格子变成 96 张小特征图',
        body: '读取器再一次用同样的四个模块（3 × 3 卷积、ReLU 和 max-pool），只是更宽，分别有 16、48、96 和 96 张特征图，所以 32 × 64 的格子最后变成 96 张 2 × 4 的特征图，其中一个格子代表字轮上一块 16 × 16 的区域。',
      },
      flatten: {
        stage: '读取器 1', title: '把 96 张特征图展平成一个 768 长的列表',
        body: '这里不做任何计算。第一张特征图从模块里抽出来，它的 2 × 4 个格子一行一行读成一排 8 个数，接着其余 95 张依次跟上，直到模块空了为止，所以这 768 个数的顺序永远一样，第 1 张图在最前，第 96 张在最后。',
      },
      dense: {
        stage: '读取器 1', title: '全连接层把 768 个数变成 96 个单元',
        body: '96 个单元里的每一个，都会把每个数乘上自己的权重，把 768 个乘积和一个偏置加起来，再把小于零的都变成零。先慢慢演示第 69 个单元，然后其余 95 个照做。',
      },
      digit: {
        stage: '读取器 1', title: '数字头把十个分数变成一个答案',
        body: '0 到 9 每个数字都有自己的 96 个权重和偏置，所以十个加权和给出十个分数。Softmax 对每个分数取 e 的次方，再除以总和，这样一个明显的领先就会拿走几乎全部的概率。7 以 96.4% 胜出，这个百分比就是置信度。',
      },
      roll: {
        stage: '读取器 1', title: '滚动头测量字轮转了多远',
        body: '对 96 个单元再做一次加权和，得到一个滚动分数，tanh 把它压到 −0.5 到 +0.5 之间，表示字轮越过刻度多远。这个 7 已经朝 8 滚过了 3.7% 格。',
      },
      readers3: {
        stage: '读取器集成', title: '读取器 2 和 3 读同一个字轮',
        body: '三份读取器共用一个架构，但是从不同的随机起点训练的，所以它们犯的错也不一样。同一个格子以同样的方式、快速地经过读取器 2 和 3，每个都给出自己的十个百分比和自己的滚动值。',
      },
      vote: {
        stage: '投票', title: '三个答案平均成一个',
        body: '三个读取器的答案汇到投票这一步，它们的概率列表会被平均，所以每个读取器的票数都一样，第三个负责打破平局。平均后的列表给出数字和置信度，三个滚动值也取平均，第 6 个字轮最后是 7，置信度 98.8%。',
      },
      drums: {
        stage: '投票', title: '其余字轮都走同一套流程',
        body: '另外五个格子快速走完同样的步骤，四个模块、展平、全连接层和两个输出头，三个读取器同时进行，然后投票，直到六个平均后的答案排好，等着进位规则。第 3 个字轮最没把握，是 71.5% 的 9，因为读取器 3 看到的是 0，被投票否决了。',
      },
      carry: {
        stage: '投票', title: '先套进位规则，再出读数',
        body: '只有当右边的字轮停在 9 或 0，或者它本身就是最后一个字轮时，这个字轮才允许处在滚动途中，这时它的滚动值可信，数字也可以往前进一位。如果右边的字轮停在 1 到 8，这个字轮就会锁定到最近的数字，这样 79 滚到 80 的途中就不会被读成 89。这里每个滚动值都在死区内，所以每个字轮都保持自己的数字，读数是 0092.07。',
      },
      finale: {
        stage: 'DrumNet V10', title: '整条流水线同时运行',
        body: '每个阶段再同时跑一遍，从缩略图和定位器，到精修器、六个格子、三个读取器、投票和进位规则，读数器每读一个数大约要两秒。',
      },
    },
    panels: {
      input: { title: '输入', sub: '读数器拍的一张照片' },
      spotter: { title: 'DetNet 定位器', sub: '在数字窗口周围画个粗框' },
      ref1: { title: 'RefNet 精修器 · 第 1 轮', sub: '在粗框里找到四条边' },
      ref2: { title: 'RefNet 精修器 · 第 2 轮', sub: '扩大、再裁一次、重跑网络' },
      cut: { title: '切成数字', sub: '每个字轮一个格子' },
      reader1: { title: 'DrumNet 读取器 1', sub: '显示的是哪个数字，转了多远' },
      reader2: { title: 'DrumNet 读取器 2', sub: '同一个网络，不同的随机起点' },
      reader3: { title: 'DrumNet 读取器 3', sub: '负责打破平局' },
      vote: { title: '集成投票与读数', sub: '平均、进位规则、读数' },
    },
    draw: {
      block: '模块 {n}',
      mapsOne: '{n} 张图 · {sub}',
      maps: '{n} 张图 · {sub}',
      weights: '{n} 个权重',
      noPool: '{sub} · 不池化',
      greyJpeg: '800 × 600 · 灰度 JPEG',
      fewer: '{n} 个数 · 少 4 倍',
      thumbnail: '缩略图',
      conv5: '1 × 1 卷积 · 32 → 5',
      score: '分数',
      chosen: '70 个格子里最高：选中',
      across: '中心在格子横向 {n}% 处',
      down: '中心在格子纵向 {n}% 处',
      width: '宽度为画面的 0.25 · {n} px',
      height: '高度为画面的 0.12 · {n} px',
      headCols: ['格子', '原始值', '0 到 1', '含义'],
      sigmoid: '0 到 1 是原始值的 sigmoid',
      corner: 'dx、dy 从格子角算起',
      selection: '定位器选出的区域 · {w} × {h} px',
      widened: '放宽 1.5 倍',
      cropBox: '裁剪区域 · 宽 1.5 倍，高 2.4 倍 · {w} × {h} px',
      cutFrom: '从完整的 800 × 600 画面裁下，不是缩略图',
      colAvgSize: '列平均 · 32 × 32',
      colAvgNote: '每张图一行 · 12 个值 → 1',
      rowAvgSize: '行平均 · 32 × 12',
      rowAvgNote: '每张图一列 · 32 个值 → 1',
      slab: '模块 4 · 32 张图 · 32 × 12',
      peel1: '第 1 张图剥离时，它的 32 列各平均成一个值，',
      peel2: '12 行也各平均成一个值',
      mapOf: '第 {n} / 32 张图',
      colAvg: '列平均',
      rowAvg: '行平均',
      sameCol: '每一列用同样的权重',
      sameRow: '每一行用同样的权重',
      conv: '1 × 1 卷积',
      inOut: '32 进，4 出',
      leftScore: '左分数', leftOffset: '左偏移', rightScore: '右分数', rightOffset: '右偏移',
      topScore: '上分数', topOffset: '上偏移', bottomScore: '下分数', bottomOffset: '下偏移',
      stripsKey: '实线：最高分 · 虚线：它的偏移 · 线：边缘在格子里的位置',
      crop: '裁剪图 · 256 × 96 灰度',
      expanded: '扩大后 · {w} × {h} px → 256 × 96',
      sameRef: '同一个 RefNet · 同样的模块、输出头和 15,400 个权重',
      pass2Box: '第 2 轮的框',
      toReader: '{w} × {h} px · 交给读取器',
      window: '窗口 · {w} × {h} px · 6 条等宽',
      cells: '格子 · 每个字轮一个',
      readerCells: '读取器的格子 · 灰度、满对比度、32 × 64',
      drum: '字轮 {n}',
      drumSize: '字轮 {n} · 32 × 64',
      reader1Maps: '图和单元显示的是读取器 1 的，但数字和滚动值是这个读取器自己的',
      mapsLeft: '模块 4 · 还剩 {n} / 96 张图',
      rowByRow: '一行一行',
      map1List: '图 1 → 列表第 1 到 8 位',
      map: '图 {n}',
      oneList: '一个列表 · {n} 个数',
      numbers768: '768 个数',
      weightPer: '每个数一个权重',
      sum768: '768 个的总和',
      offset: '偏置',
      unit: '单元 {n}',
      units96: '96 个单元',
      aboveZero: '{w} 个权重 · 这个字轮有 {n} / 96 个大于零',
      digitCols: ['分数', 'e^分数', '÷ 总和', 'softmax'],
      digit: '数字 {n}',
      firmwareChecks: '固件检查的置信度',
      share: 'e^7.1 = 1,215 ÷ 1,260 · 比第二名高 3.6 分，份额就大 36 倍',
      rollScore: '滚动分数',
      roll: '滚动 {v}',
      rollMeasured: '7 已越过刻度，朝 8 走了 3.7% 格',
      rollPast: '{d} 越过刻度 {p}% 格',
      rollBefore: '{d} 离刻度还差 {p}% 格',
      leastSure: '最没把握，因为读取器 3 读成了 0，被否决了',
      reader: '读取器 {n}',
      mean: '平均',
      meanOfThree: '滚动 {v} · 三个的平均',
      inBand: '死区内',
      pastBand: '超出死区',
      freeLast: '放开 · 最后一个字轮',
      free: '放开 · 右边字轮在 9 或 0',
      lock: '锁定 · 右边字轮在 1 到 8',
      allowed: '允许 {n} → {m}',
      absolute: '{n}，固定',
      carryNote: '79 滚到 80 可能被读成 89，所以规则会改选前一个数',
      units: '立方米 · 置信度 71.5%，6 个字轮中最没把握的',
      secondRoute: '第二条路线：用 WindowNet 重跑',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: '跳到模拟器',
    intro: {
      eyebrow: '设置与配置', title: '同一个读数，出现在设置工具上',
      before: <p>ConfigKing 让读数器执行 Read 时，显示的就是这个读数 0092.07，还有它来自的那一帧画面。ConfigKing 是我为 M5Stack Cardputer 写的固件，它通过 BLE 和 ESP-NOW 找到附近的读数器，一步步设置新的读数器，也能重新配置已有的。</p>,
      after: <p className="ws-note">DrumNet 和固件会一起烧录进 Prototype V2，同时设好 LoRa 设备地址。因为读数器大部分时间都在睡眠，你要按一下 boot 按钮把它唤醒，它才能被找到。这里的屏幕是真实固件界面的可用复刻，是根据它的源代码画在一张 Cardputer 照片上的。</p>,
    },
    press: { connect: '连接', save: '保存', next: '下一步', finish: '完成', continue: '继续' },
    steps: {
      nearby: { eyebrow: '第 1 步', title: '发现设备', body: '未配置的读数器一通电，就会自动进入配置模式。ConfigKing 检测到后会提示你进行设置。' },
      identify: { eyebrow: '第 2 步', title: '识别信息与读数频率', body: '先设置读数器在仪表盘上显示的名字，再设置它的读数频率，展开 (i) 图标还能看到读数器的更多细节。' },
      layout: { eyebrow: '第 3 步', title: '字轮布局', body: '按照读数器要装上的那块水表来设置字轮布局，整数字轮 1 到 8 个，小数字轮 0 到 4 个。' },
      camera: { eyebrow: '第 4 步', title: '摄像头配置', body: '设置亮度、增益和 LED 的 PWM 占空比，让光线均匀。你可以缩放和平移，把图像看得更仔细，画面也会随着设置变暗或变亮。' },
      roi: { eyebrow: '第 5 步', title: '微调 ROI', body: 'WindowNet 会自动生成一个 ROI，你可以用这些控制项微调它，也能缩放和平移，看得更细。' },
      read: { eyebrow: '第 6 步', title: '试读', body: '用前面设好的 ROI 做一次试读并显示置信度，按 (D) 可以逐个数字查看。' },
      radio: { eyebrow: '第 7 步', title: 'LoRa 连接测试', body: '连接测试会确认读数器能连上 LoRaWAN 网关，展开 (i) 菜单可以看到更多信息。' },
      review: { eyebrow: '第 8 步', title: '检查更改并保存', body: '检查一下要保存到读数器上的设置。保存之后，读数器会切换到标准部署模式，BLE 连接也会断开。' },
      done: { eyebrow: '设置完成', title: '读数器睡下，开始读数', body: '完成提示会显示读数器自己的睡眠计时器，从这里开始，读数器会按自己的间隔醒来，读一次数，发出去，然后接着睡。' },
      connected: { eyebrow: '已配置的读数器', title: 'Read、Configure、More', body: '已配置的读数器不会再走向导，而是显示 Read、Configure 和 More。Configure 一次打开一个设置类别，需要明确保存或放弃，More 里有无线测试、读数器信息、About，以及会先让你确认的恢复出厂设置。' },
    },
    free: {
      eyebrow: '试试看', title: '自己设置一个读数器',
      body: <p>这里的屏幕、按键和向导都和真机一样，只是连着的是一个模拟读数器。你可以按 Cardputer 上的键、点它的屏幕，或者直接用自己的键盘打字，过一会儿附近就会出现一个读数器。</p>,
    },
  },

  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['模拟出来的水表', '为智能体打造', '设计与预设', '半滚动的字轮', '天气与表面', '无人值守的评估'],
      lede: 'MeterSim 在平板上画出一块水表，这样真实的摄像头就能在没人看着的情况下收集带标签的读数。',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: '给真摄像头看的模拟水表',
        body: <p>MeterSim 的第一个版本是和 Prototype V0.5 的固件一起做的，两者配合工作，所以 MeterSim 可以自动控制 Prototype V0.5，生成带标签的图像来训练模型。所有软件和固件都是 Claude 写的。</p>,
        alt: 'Prototype V0.5（一块 ESP32-EYE）对着一台显示 MeterSim 画面的平板',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: '为智能体使用而打造',
        body: <p>MeterSim 是给 AI 智能体用的，而不是给人用的，所以它的控制面板主要是让人看看智能体的进展。智能体在打造 DrumNet 的过程中，用 MeterSim 搭测试、收集数据、检查准确率。机器学习里最繁琐的活，就是收集好的训练数据，MeterSim 直接把这些数据生成出来，而且因为水表是模拟的，每张图像生成时就已经带好标签了。</p>,
        alt: 'MeterSim 的控制界面，有调节读数、字轮、表面和天气效果的滑块',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: '九种水表设计和九个预设',
        body: (
          <>
            <p>MeterSim 有 9 种水表设计，每种都可以设成不同的字轮布局，比如 7 个整数字轮加 1 个小数字轮（7+1）。整数字轮通常是白色或黑色，小数字轮则是红色。</p>
            <p>常见的条件组合都存成了预设：干净、正午、数字反光、半边阴影、柔和阴影、黄昏、背阴、倾斜和脏污。</p>
          </>
        ),
        alt: [
          'MeterSim 里可用的九种水表设计：Itron Weg 50、Elster 黄铜表、Itron Multimag Cyble、Bonega S/13 和 T/13、Istameter II、一款通用工业表、B Meters 蓝色表，以及一款干净的 Elster 黄铜表',
          '九种预设条件：干净、正午、数字反光、半边阴影、柔和阴影、黄昏、背阴、倾斜和脏污',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: '半滚动的字轮',
        body: <p>它还能模拟滚到一半的字轮，让模型学会读停在两个数字之间的字轮，智能体在收集训练数据时会自动设置这些情况。</p>,
        alt: 'MeterSim 的滚动控制，把单个字轮拖到两个数字之间',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: '天气与表面状况',
        body: <p>MeterSim 还会模拟天气和水表表面的状态，模仿一块常年风吹日晒的水表可能的样子，让读数器在这些条件下都能学会读数。控制项包括反光、污迹、阴影、光照、模糊、传感器噪声、雾气、灰尘和缩放。</p>,
        alt: 'MeterSim 里的表面和天气效果滑块，每个都带预览缩略图',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: '无人值守的评估与数据收集',
        body: (
          <>
            <p>MeterSim 是一个自托管的网页应用，有两个端点，/control 是控制面板，/display 是显示画面。读数器和 MeterSim 连在同一个本地 Wi-Fi 网络上，通过它发送读数和图像，也接收指令。</p>
            <p>评估模型时，MeterSim 会随机生成一块水表和一组条件显示给读数器，读数器拍一张图，用训练好的网络读出来。结果再传回 MeterSim，它知道模拟的数值，就拿来和预测比较，智能体在没人看着的情况下重复很多次，就能得到模型的大致准确率。收集带标签的数据也是同样的流程，只是读数器拍的图像会和 JSON 格式的标签一起存到硬盘上，直接拿去训练。</p>
          </>
        ),
        alt: [
          '一台显示 MeterSim 画面的平板，旁边是打开控制面板的笔记本电脑，ESP32-EYE 读数器对着平板',
          '在教室里，架在瓶子上的 ESP32-EYE 读数器对着 MeterSim 画面',
        ],
      },
    },
  },

  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['六个阶段', '真实图叠合成图', '自己比比看'],
      lede: 'SimGen2 生成的合成图像看起来就像读数器自己的摄像头拍的，每张大约 2 秒，比真实拍摄快将近 5 倍。',
    },
    page: 'SimGen2',
    stages: [
      ['显示截图', 'MeterSim 的画面，1920 × 1080'], ['变形', '姿态和镜头，变为 1600 × 1200'], ['视场模糊', '1.2 到 2.2 px'], ['增益、色调曲线、暗角', '传感器的响应'], ['传感器噪声', '真实摄像头有噪点的地方'], ['OV2640 JPEG', '质量 6，和读数器的压缩一样'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: '把摄像头本身也模拟出来',
        body: (
          <>
            <p>即使有了这么多自动化，还剩一个大瓶颈：在读数器上拍一张图再发给 MeterSim 要将近 10 秒，几千张图下来就是好多个小时。所以下一个目标是把读数器的摄像头本身也模拟出来，这套系统就是 SimGen2。它会缩放图像，再加上滤镜和变形，让它看起来像是读数器的摄像头拍的。</p>
            <p>SimGen2 完全是由 OpenAI 的 ChatGPT Astra 6 开发的，它用了读数器拍的大约 4000 张真实图像来开发这些滤镜。</p>
          </>
        ),
        alt: 'SimGen2 的六个处理阶段，从显示截图到变形、模糊、调色、加噪和 JPEG 压缩后的输出，每个阶段都附有一条读数区的图',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: '真实图叠在合成图上',
        body: <p>SimGen2 生成一张图大约 2 秒，比用实体读数器拍快将近 5 倍。它和读数器一起运行，产出了几万张各不相同的带标签图像，用来训练 DrumNet Simulated 模型。这里把一张染成洋红色的真实拍摄叠在染成绿色的 SimGen2 版本上，两者吻合的地方就没有颜色，剩下最大的差别是真实拍摄里的 LED 反光。</p>,
        alt: '染成洋红色的真实拍摄叠在染成绿色的 SimGen2 合成版本上，两者吻合的地方没有颜色',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: '自己比比看',
        body: <p>这是二十一张真实拍摄和它们的 SimGen2 版本，涵盖六种水表设计，都是从报告的图表页上裁下来的。拖动分隔线来比较，左边是真实拍摄，右边是 SimGen2。读数区那一条显示得最大，因为那正是 DrumNet 要读的部分。</p>,
      },
    },
    compare: {
      realStrip: '{meter} 读数区的真实拍摄',
      simStrip: 'SimGen2 生成的同一个读数区',
      realMeter: '{meter} 水表的真实拍摄',
      simMeter: 'SimGen2 生成的同一块水表',
      real: '真实',
      sim: 'SimGen2',
      divider: '分隔线，左边是真实拍摄，右边是 SimGen2',
      pairs: '配对',
    },
  },

  agents: {
    cover: {
      title: '智能体工作流', lines: ['智能体', '工作流'],
      contents: ['循环', '六个智能体', '资源与调度器', '用 T3 Code 管理'],
      lede: '六个智能体同时训练和测试读取器，共用一个调度器来分配算力和测试台。',
    },
    page: '智能体工作流',
    rows: {
      'ag-loop': {
        eyebrow: '智能体工作流', title: '自我改进的循环',
        body: <p>这个项目里我大量使用了基于 LLM 的 AI 智能体，它们的任务是改进在 ESP32-S3 上运行的整条视觉流水线，朝 99% 水表准确率的目标前进。每个智能体都在一个循环里工作：提出假设，规划怎么执行，收集训练数据，对模型重新训练、微调或做 RL 训练，测试是变好了还是退步了，然后汇报发现，再从头开始。</p>,
      },
      'ag-six': {
        eyebrow: '智能体工作流', title: '六个智能体，三个在做 DrumNet',
        body: (
          <>
            <p>三个智能体跑这个循环，各自负责一个 DrumNet 变体，另外三个智能体负责其他工作。大约 1.5 周后，Standard 和 Premade 的表现还是很差，所以它们的开发被停掉了，所有资源都给了 DrumNet Simulated。</p>
            <p>之后 DrumNet Simulated 可以用所有数据集训练，包括来自测试台和外部目录的数据，并改名为 DrumNet。目前的版本 V10 是 DrumNet 系列里表现最好的网络。</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: '智能体工作流', title: '共享资源和调度器',
        body: (
          <>
            <p>六个智能体同时运行，总是在抢资源，所以我开发了一个调度器，让它们在共享资源上预约时间段。一个是训练用的算力，也就是我服务器的 CPU 和笔记本的 GPU，另一个是 Jetson 测试台，智能体可以在那里烧录和使用 Prototype V1，同时通过 MeterSim 控制原型对着的那块屏幕。</p>
            <p className="ws-note">在调度器的算力时间线上，填充区域表示已预约的线程数，对应 20 个线程的预算，红线表示已预约的内存，对应 9 GB 的预算，而笔记本 GPU 一次只接一个任务。</p>
          </>
        ),
        alt: [
          '三个 DrumNet 智能体通过两个调度器共用 Jetson 测试台和算力的草图，旁边是协调者、Sim2 Genius 和窗口检测模型',
          '算力资源的调度器时间线，显示每个智能体预约的时间块，以及已预约负载和预算的对比',
        ],
      },
      'ag-t3': {
        eyebrow: '智能体工作流', title: '用 T3 Code 管理',
        body: (
          <>
            <p>这些智能体靠一个“心跳”全天候运行，它是一个简单的脚本，会在设定的间隔或时间唤醒智能体，让它继续干活。我告诉它们要独立行动、自己做决定，所以几乎不需要人插手。</p>
            <p>网络用的是 Tailscale，一个个人的点对点 VPN，让我家里服务器上的智能体可以通过 SSH 连上并控制学校里的 Jetson 测试台。智能体本身则在 T3 Code 里管理，它是一个给 Claude Code 和 Codex 用的开源元框架（meta-harness）。</p>
          </>
        ),
        alt: 'T3 Code 通过 Tailscale 连接客户端设备、运行智能体的家用服务器、笔记本 GPU 和学校里的 Jetson 测试台的示意图',
      },
    },
    loop: {
      steps: ['提出假设', '规划执行', '收集训练数据集', '重新训练、微调或 RL 模型', '测试是改进还是退步', '汇报发现，再提新假设'],
      lines: [['提出假设'], ['规划', '执行'], ['收集', '训练数据集'], ['重新训练、微调', '或 RL 模型'], ['测试是改进', '还是退步'], ['汇报发现，', '再提新假设']],
      aria: '智能体的循环：{steps}，然后再来一圈。',
      target: '目标',
      accuracy: '水表准确率',
    },
    badges: {
      model: '模型', job: '工作', data: '训练数据', won: '成为了 DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: '纯粹派', model: 'Fable 5.1，后来换成 Opus 5.5', job: '读字轮', data: '只用 Prototype V1 拍的图像，从基础版 DrumNet V1 开始', fate: '1.5 周后停止' },
        simulated: { name: 'DrumNet Simulated', persona: '梦想家', model: 'Fable 5.1，后来换成 Opus 5.5', job: '读字轮', data: '只用 SimGen2 图像，全部由电脑生成，从基础版 DrumNet V1 开始', fate: '改名为 DrumNet，现在到了 V10' },
        premade: { name: 'DrumNet Premade', persona: '收藏家', model: 'Fable 5.1，后来换成 Opus 5.5', job: '读字轮', data: '所有数据集：Prototype V1、SimGen2、Badger55、Jomjol-digits，从 dig-cont 模型开始', fate: '1.5 周后停止' },
        windownet: { name: 'WindowNet', persona: '侦察兵', model: 'Opus 5.5', job: '找窗口', data: '训练用来定位字轮窗口的定位器（DetNet）和精修器（RefNet）', fate: '仍是最薄弱的一环，大部分错误读数都从这里开始' },
        sim2: { name: 'Sim 2 Genius', persona: '幕后帮手', model: 'Opus 5.5', job: '运行模拟器', data: '为其他智能体操作、维护和改进 SimGen2', fate: '源源不断地送来合成图片' },
        coordinator: { name: 'OCR Coordinator', persona: '工头', model: 'Fable 5.1', job: '管理项目', data: '和其他所有智能体沟通，预约它们的时间，掌管计划', fate: '其他智能体停滞时，把一切都转给了 Simulated' },
      },
    },
  },

  firmware: {
    cover: {
      title: '固件', lines: ['读数器', '固件'],
      contents: ['由智能体编写', '一个唤醒周期', '仪表盘'],
      lede: '在一个唤醒周期里，读数器醒来，拍下水表，读出字轮，把数字发回去，然后接着睡。',
    },
    page: '固件',
    chartAria: '读数器一个唤醒周期的固件流程',
    success: '成功',
    fail: '失败',
    nextCycle: '下一个周期',
    nodes: {
      wake: { title: '从 RTC 唤醒', sub: '恢复状态，初始化外设', time: '~0.2 秒' },
      capture: { title: '拍摄图像', sub: '借助 LED 灯光拍摄图像', time: '~0.5 秒' },
      low: { title: '低功耗读数', sub: '只用 DrumNet 读取器和存好的 ROI，不用 WindowNet', time: '~0.5 到 3 秒' },
      uplink: { title: 'LoRaWAN 上行', sub: '把读数发送到网关', time: '~0.3 秒' },
      sleep: { title: '睡眠', sub: '所有外设都关闭' },
      full: { title: '完整 DrumNet 流水线', sub: '用 WindowNet 重跑作为备用' },
      check: { title: '检查置信度', sub: '新读数够有把握吗？' },
      alt: { title: '用备用定位器运行', sub: '另一套备用权重' },
      reject: { title: '拒绝读数', sub: '存进 NVS 以便评估，在仪表盘上警告' },
    },
    steps: {
      wake: '读数器从睡眠中醒来，从非易失性存储里恢复配置和 LoRaWAN 会话。',
      capture: '初始化摄像头，借助 LED 灯光拍一张图。',
      low: '图像直接送进 DrumNet 读取器，用的是设置时存好的 ROI，不经过 WindowNet。这是正常也最省的路径，有把握的读数总共醒着大约 1.5 秒就会进入上行。',
      full: '只有当读取器报告置信度低时，才会运行完整流水线作为备用，由 WindowNet 重新找窗口。',
      check: '检查新读数的置信度，大多数读数在这里就离开循环了。',
      alt: '定位器换一套备用权重再跑一次，这是本周期的最后一次尝试。',
      reject: '失败的尝试会存进 NVS 供之后评估，仪表盘上会报告一个低置信度警告。',
      uplink: '打开 LoRa 链路，把读数发送到网关。',
      sleep: '所有外设关闭，读数器进入深度睡眠，直到 RTC 在下一个周期唤醒它，不过按下 BOOT 也能把它唤醒来做配置。',
    },
    rows: {
      'fw-agents': {
        eyebrow: '固件', title: '由智能体在真实硬件上编写',
        body: (
          <>
            <p>我让一个 Astra 6 智能体为读数器（Prototype V2）和 M5Stack Cardputer Adv 编写固件。Cardputer Adv 上运行的是 ConfigKing，这个配置控制台让现场工程师可以配置读数器以便部署，之后也能重新配置。这个智能体被要求只用 Fable 5.1 写代码。</p>
            <p className="ws-note">我的笔记本、LoRaWAN 网关（由 Lee Chang Fatt 老师慷慨提供）和 Jetson Nano 都接在同一个网络上，Cardputer 和 Prototype V2 通过 USB 串口连到笔记本，这四台设备都开放给智能体使用。</p>
          </>
        ),
        alt: '固件开发环境：笔记本、Jetson Nano、LoRaWAN 网关、Prototype V2 读数器和 Cardputer，智能体通过网络连接它们',
      },
      'fw-cycle': { eyebrow: '一个唤醒周期', title: '九个步骤，但大多数读数只走五步' },
      'fw-dashboard': {
        eyebrow: '仪表盘', title: '读数显示在哪里',
        body: <p>读数完成后会发到 LoRaWAN 网关，网关再通过 MQTT 转发给 Jetson Nano 存起来。Jetson 用一个单独的 HTML 文件提供仪表盘，里面的 JavaScript 会根据存储的数据更新数值，不过这个仪表盘只是个演示，并不是为真实部署的规模设计的。</p>,
        alt: '读数器监控仪表盘：一张测试台读数器卡片显示 0092.07 立方米和一个低置信度标签，下面是历史图表和一张九条读数的表格',
      },
    },
  },

  power: {
    cover: {
      title: '功耗优化', lines: ['节省', '功耗'],
      contents: ['子采样', '拍摄模式对比', 'PWM 调光', '灰度', 'INT8 与向量运算', '硬件'],
      lede: '为了让电池撑 2 年，唤醒周期的每一步都被削减过，拍摄更小，灯光更暗，还用上了整数运算。',
    },
    page: '功耗优化',
    modes: [
      { time: '拍摄 350 ms', note: '传感器的每个像素' },
      { time: '拍摄 89 ms', note: 'SVGA，最终选用的模式' },
      { time: '拍摄 61 ms', note: 'CIF，每个字轮的像素太少' },
    ],
    modeAlt: '水表的 {res} 拍摄',
    drumsAria: '{res} 下的字轮',
    int8: [
      { value: '61 秒', label: 'Float32', note: '从拍摄到预测，量化之前' },
      { value: '17 秒', label: 'INT8 + ESP-NN', note: '大约快 3.6 倍' },
    ],
    hardware: [
      { name: 'TPS63900 升降压', note: '静态电流约 75 nA，不管输入多少都稳定输出 3.3 V，适用于 Li-SOCl2' },
      { name: '低 Iq LDO', note: '给摄像头供 1.5 V 和 2.8 V，没有开关噪声' },
      { name: 'Ambiq AM1805 定时器', note: '按计划关闭和重新打开所有部件' },
      { name: 'LoRaWAN', note: '低功耗、远距离，是运营方可以自己运行的开放标准' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: '功耗优化 · 软件', title: '摄像头内子采样',
        body: (
          <>
            <p>读数器要用一套电池撑最多 2 年。ESP32-S3 做神经网络需要的向量运算这类重活还算高效，但远远比不上 Nordic 的 nRF 系列，所以我用了这一章里的这些方法来降低它的能耗。它的无线射频只在初次配置时才需要，所以部署后会关掉。</p>
            <p>OV2640 最高可以拍 1600 × 1200，也有 800 × 600（SVGA）和 400 × 296（CIF）两种子采样模式。</p>
          </>
        ),
        alt: ['OV2640 SVGA 子采样模式示意图，显示跳过了哪些像素', 'OV2640 CIF 子采样模式示意图'],
      },
      'pw-modes': {
        eyebrow: '拍摄模式对比', title: 'SVGA，最终选用，89 ms',
        body: (
          <>
            <p>这是同一块水表在三种分辨率下的样子，上面是完整画面，下面是同样放大倍数下的字轮。在 1600 × 1200 下，传感器的每个像素都要读出来，拍一次要 350 ms，这很重要，因为摄像头开着的时间越短，耗电就越少。在 400 × 296 下拍一次只要 61 ms，但字轮剩下的像素太少，没法可靠地读出来。</p>
            <p>在我的测试里，SVGA 在画质和速度之间取得了最好的平衡，在 800 × 600 下网络要处理的信息比 1600 × 1200 少 4 倍。我没有做正式的测试来证明准确率，不过就我的经验来看，它没受多大影响。</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: '功耗优化 · 软件', title: 'LED 的 PWM 调光',
        body: <p>我一开始否定了 PWM 调光，因为 OV2640 是卷帘快门，可能会在 PWM 信号的关断期间拍摄，出现条纹。实际上 OV2640 并没有出现任何条纹，所以我让 LED 以 20 kHz、50% 占空比运行，省了一些电，还多了亮度控制。</p>,
        alt: ['一张水表表面出现水平条纹的拍摄', '一张用 PWM 调光 LED、没有条纹的拍摄'],
      },
      'pw-grey': {
        eyebrow: '功耗优化 · 软件', title: '摄像头内灰度',
        body: <p>OV2640 会在摄像头上直接把图像转成灰度，返回的文件稍微小一点，虽然省下的很少甚至没有，但实现起来很简单。</p>,
        alt: ['摄像头拍下的灰度水表', '同一块水表的彩色拍摄'],
      },
      'pw-int8': {
        eyebrow: '功耗优化 · 软件', title: '向量指令和 INT8',
        body: <p>早期版本的 DrumNet 在 ESP32-S3 上以全精度 Float32 运行，又慢又低效。ESP32-S3 内置了向量指令，通过 ESP-NN 库来使用，每个时钟周期可以执行好几次乘累加（MAC）运算。DrumNet 量化到 8 位之后，从拍摄到预测的时间从 61 秒降到了 17 秒，大约快了 3.6 倍。我还没有正式测量效率的提升，不过我确定它也提高了很多。</p>,
      },
      'pw-hw': {
        eyebrow: '功耗优化 · 硬件', title: '低 Iq 转换器、定时器和 LoRaWAN',
        body: (
          <ul>
            <li><b>低 Iq、高效率的 DC-DC 转换器。</b> OV2640 需要 1.5 V 和 2.8 V。降压转换器比 LDO 更高效，但它们的静态电流高、设计更复杂，会增加成本和板子面积，却几乎没有收益，还可能在图像里引入伪影，所以我还是用了低静态电流的 LDO。主 3.3 V 电源轨会换成一款特殊的低 Iq（约 75 nA）升降压转换器，也就是 TI 的 TPS63900。</li>
            <li><b>超低功耗定时器 IC。</b> 像 Ambiq AM1805 这样的定时器 IC 可以关闭所有元件，再按计划把它们重新打开，不过收益可能很小。</li>
            <li><b>LoRaWAN。</b> 我选 LoRaWAN 是因为它功耗低、距离远，而且是开放标准，所以和 Sigfox、NB-IoT 不一样，运营方可以拥有并运行整个网络。</li>
          </ul>
        ),
      },
    },
  },

  camera: {
    cover: {
      title: '摄像头选型', lines: ['摄像头', '选型'],
      contents: ['两款 OV2640 镜头', '对焦测试'],
      lede: '我用对焦测试图，在 3、4 和 6 cm 处测试了两款 OV2640 镜头。',
    },
    page: '摄像头选型',
    lab: {
      lenses: { '160': '160° 镜头', '120': '120° 镜头' },
      charts: { b: '测试图 B（ISO 12233）', a: '测试图 A（手绘）' },
      cm: '{d} cm',
      lens: '镜头',
      distance: '距离',
      chart: '测试图',
      alt: '{lens}° 镜头，测试图 {chart}，{dist} cm，完整画面',
      caption: '完整画面 · {lens}° · {dist} cm',
      chosen: ' · 最终选用的配置',
      parts: { centre: '中间', left: '左边', right: '右边' },
      cropAria: '{part}的裁剪图',
      notInFrame: '不在画面内',
      notes: {
        '160': '160° 版本对近处物体对焦很好，但它的焦点似乎从画面中心往左边逐渐变差，往右边的变化就远没有那么明显。',
        '120': '120° 版本显然没法很好地对焦近处物体（微距），它的焦点以锥形均匀地向外变差，这对定焦镜头来说是意料之中的。',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: '摄像头选型', title: '一个微距摄像头，宽到能拍下所有字轮',
        body: (
          <>
            <p>我需要一个够用的微距摄像头，在离水表很近的地方也能拍下字轮的整个宽度。正规零售商里没有既便宜、接口又合适的选项，所以我从 Lazada 买了两个 OV2640 摄像头，一个是 160° 视场角的镜头，一个是 120° 的。它们不是当作微距摄像头卖的，但广角镜头天生对焦距离很短，看起来景深也深得多。</p>
            <p>测试时，我让两个摄像头分别在 3 cm、4 cm 和 6 cm 处对着两张对焦测试图拍照。测试图 A 是我手绘的，测试图 B 是 Cornell 的 Stephen H. Westin 制作的 ISO 12233 测试图。每个摄像头都接在一块备用的 ESP32-S3 摄像头板上，运行一个借助 AI 智能体写的简单网页小程序，装在一个盒子的侧面，镜头前方伸出一把尺子，测试图则放在一个可以移动的支架上。</p>
          </>
        ),
        alt: '对焦测试盒，ESP32 摄像头板装在侧面，底部放着一把尺子',
      },
      'cam-lab': {
        eyebrow: '对焦测试', title: '最终选用：160°，4 cm',
        body: (
          <>
            <p>选一个镜头、一个距离和一张测试图，就能看到完整的拍摄，以及从同一帧里按实际像素裁下的中间、左边和右边。这些是定焦镜头，焦点在出厂时就固定好了，从这里开始我用的都是 160° 版本、4 cm。</p>
            <p className="ws-note">测试图和摄像头是正对着的，没有明显的倾斜或凹陷，而 120° 版本的变化是均匀的，所以 160° 版本那种不对称的对焦说明可能是制造缺陷，不过我没有备用摄像头来验证是不是这样。</p>
          </>
        ),
      },
    },
  },

  proto: {
    cover: {
      title: 'Prototype V2', lines: ['Prototype', 'V2'],
      contents: ['缩小版的 Prototype V1', '开发板大小', '外壳与转接件'],
      lede: 'Prototype V2 是缩小到开发板大小的 Prototype V1，装在一个不用工具的两件式外壳里。',
    },
    page: 'Prototype V2',
    enclosurePage: '外壳',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototype V2', title: '缩小版的 Prototype V1',
        body: <p>Prototype V2 是 Prototype V1 的缩小版，能装进更窄的空间，也让我试了更小的元件，比如 Seeed Studio 的 Wio-SX1262 LoRa 模块。它内置电池管理、给摄像头和风扇供电的电路、可 PWM 调光的 LED 灯和一个 LoRa 模块。这块 4 层板是我在 KiCad 里设计的，元件从 DigiKey 采购，由 JLCPCB 制造，电路图都在报告里。</p>,
        alt: 'KiCad 里 Prototype V2 电路板顶面的 3D 渲染图',
      },
      'v2-size': {
        eyebrow: 'Prototype V2', title: '开发板大小',
        body: (
          <>
            <p>我把这块 PCB 设计成和一般的 ESP32-S3 开发板差不多大，这样它能装进更小的外壳，适合装在空间更窄的水表上。</p>
            <p className="ws-note">Prototype V2 是在我写报告之前做的，所以它还保留着一些我后来放弃的决定。风扇是为了应对高湿度加的，因为湿度高可能会起雾，但如果读数不可靠，就会改成把它去掉，而供电电路是在我决定用 Li-SOCl2 电池之前设计的。</p>
          </>
        ),
        alt: 'Prototype V2 的 PCB 放在一块差不多一样大的 ESP32-S3 开发板旁边',
      },
      'en-all': {
        eyebrow: '外壳', title: '不用工具的外壳和两件式转接件',
        body: (
          <>
            <p>内部外壳装着 Prototype V2 的 PCB 和电池。我把 KiCad 的 3D 文件导出到 Onshape 里当参考，为了准确手动建了摄像头的模型，并把外壳设计成不需要工具：侧边卡扣把两半扣在一起，凹槽和销钉防止它们左右滑动，平台和立柱不用螺丝就能固定 PCB，还有一个开口让 LoRa 的 IPEX 线能连到收发器。最终打印出来装配得很好，成品也不错，但我得给摄像头开一个孔，因为组装阶段的引脚布局弄错了，摄像头是反着装的。</p>
            <p>外部转接件分成两部分。下半部分贴着水表安装，让摄像头镜头离表盘大约 4 cm，这是在摄像头测试里选定的对焦距离，上半部分宽得多，留出了让读数器对准字轮的空间，也意味着只要重新设计下半部分，我就能把它用在其他水表上。我忘了考虑锁住水表盖子的卡舌，所以用斜口钳剪了几下给它们腾出位置。</p>
          </>
        ),
        figures: [
          { alt: 'KiCad 里装上摄像头模型的电路板 3D 模型，在 Onshape 里当作参考', caption: '在 Onshape 里当参考的 KiCad 导出文件' },
          { alt: '最终打印出来的内部外壳，电路板装在里面', caption: '打印出来的内部外壳' },
          { alt: '转接件的 CAD 剖面图，显示摄像头离水表表面大约 4 cm', caption: '转接件剖面，离表盘 4 cm' },
          { alt: '装在水表上的完整转接件', caption: '装在水表上的转接件' },
        ],
      },
    },
  },

  conclusion: {
    cover: {
      title: '总结', lines: ['总结'],
      contents: ['项目现状', '报告'],
      lede: '读数器能读对 56% 的读数，目标是 99%，这一章讲讲要补上这个差距需要做些什么。',
    },
    page: '总结',
    row: {
      eyebrow: '总结', title: '项目现状',
      body: (
        <>
          <p>因为时间有限，项目就停在这里了，在它成为一个可行的方案之前，还有很多问题要解决。我还没有测量它的能耗，也没有按额定的 2 年寿命测试过，而且我不认为现在的 Prototype V2 能达到这个指标，所以需要一个用上更多省电元件的第三版，到那时监测功耗才有意义。不过固件这边已经接近我想要的效率了。</p>
          <p>DrumNet V10 能读对 56% 的读数，离 99% 的目标还差很远。主要的瓶颈是 WindowNet，因为大部分错误读数都是它没找对 ROI 造成的。读取器也有训练不足的迹象，遇到没见过的水表时置信度会很低，因为数据集主要来自 SimGen2 能生成的那 9 种水表，所以一个更大、更多样的数据集对这两个问题都会有帮助。外壳对真实部署来说太笨重了，主要是因为摄像头太高，所以我需要一个更矮、微距更好的摄像头，而防风防雨也需要不同的材料和设计。</p>
          <p className="ws-note">这个项目里很多东西都是我第一次尝试，虽然我对结果不算满意，但我为自己学到的知识和积累的经验感到自豪，也很感激能有这样难得的机会，有时间、资源和支持，让我用自己的方式去学习和实验。谢谢 Alex Oh 老师（NYP）的指导、专业知识和鼓励，谢谢 Soh 老师（NYP），没有他我就没法让摄像头跑起来，也谢谢 Lee Chang Fatt 老师（NYP）提供的 LoRaWAN 网关。</p>
        </>
      ),
    },
    figures: [
      { value: '56%', label: '完整流水线', note: '1,440 次读数中读对 808 次' },
      { value: '99%', label: '目标', note: '整个读数完全正确' },
      { value: '93.2%', label: '只看 DrumNet', note: '合并测试集，不含 WindowNet' },
      { value: '2 年', label: '目标寿命', note: '还没测量，而且得先有 V3 电路板' },
    ],
  },

  report: {
    title: '报告',
    frameTitle: 'OCR Water Meter Reader 报告（PDF）',
    name: 'OCR Water Meter Reader',
    about: '低成本、低功耗、基于视觉的水表 OCR 读数方案。Braven Chiam，NYP 电子与计算机工程。58 页，PDF，6.8 MB。',
    open: '打开报告',
    note: '开发这个项目时我大量使用了 AI 工具。报告的大部分内容是我用自己的话写的，引言和部分图表除外，其他 AI 用途包括资料研究、生成图表和核对数据。按照我的 AI 使用等级，这个项目是 L3。',
  },
};

export default zh;
