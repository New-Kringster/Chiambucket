import type { LumenCopy } from './en';

const zh: LumenCopy = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN 是一个智能房间的语音助手，做在一块没有 PSRAM 的 ESP32 上。开发板听到唤醒词后用 INMP441 麦克风录音，一个 FastAPI 中继通过 OpenRouter 把录音交给 Whisper 和 DeepSeek 指令解析器，再由 MQTT 把指令送到各个设备。',
    ogDescription: '一个 ESP32 语音助手：开发板自己听唤醒词，录音经过 FastAPI 中继交给 Whisper 和 DeepSeek 指令解析器，再通过 MQTT 控制整个房间。',
  },
  ld: {
    headline: 'LUMEN，一个 ESP32 语音助手',
    description: '为 NYP 物联网编程课程做的声控智能房间助手。一块运行 MicroPython 的 ESP32 录下请求，一个 FastAPI 中继调用 OpenRouter 上的 Whisper 语音转文字和 DeepSeek 指令解析器，指令再通过 MQTT 发回房间。',
  },
  hero: {
    alt: '用 OpenAI Whisper 和 DeepSeek 做的智能家居助手 LUMEN 的封面图',
    back: '返回项目',
    tag: '学校项目',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN 是一个声控的智能房间助手，你说一声“Hello Robot”，或者按住按钮说话，就能用它。ESP32 负责录音，服务器把录音转成文字，再让大语言模型把它变成一条 JSON 指令，然后 MQTT 把这条指令送到灯、风扇、舵机和蜂鸣器。最难的地方，是把这一切塞进一块只有大约 33 KB 空闲内存的板子里。',
    builtWith: '用到的工具',
  },
  chapters: '章节',
  rail: {
    overview: '概览', try: '试一试', how: '工作原理', brain: '解析器', hardware: '硬件',
    memory: '内存', auto: '自动模式', deploy: '仪表盘', slides: '幻灯片', next: '接下来想加的',
  },

  overview: {
    h: '概览',
    p: [
      'LUMEN 是我在 NYP 物联网编程课程里做的小项目，题目很简单，就是做一个联网的、有点用处的设备。我想看看，一块便宜的 ESP32 如果真的能听懂人话，而不只是认一串固定的指令，能做到什么程度。',
      '它会等着唤醒词，录下你说的话，再把它变成动作：“把灯调暗一点”“十分钟后开风扇”“把亮度设成和湿度一样”“晚安”。理解语言的工作都在一台小服务器上完成，所以 ESP32 只需要录音和执行指令。',
    ],
    video: '唤醒词、几条语音指令，还有房间的反应。',
  },

  try: {
    h: '试一试',
    p: '这个演示走的是和真实系统一样的路线，只是规模小一点：从触发开始，交给 Whisper 做语音转文字，再交给 DeepSeek 大语言模型把文字解析成一条 JSON 指令（两步都通过 OpenRouter），最后通过 MQTT 发给设备。你可以在下面选一句话，也可以让它自己轮流播放。',
    note: '问温度和要三明治这两句，展示的是它的安全护栏：问题会用实时的传感器数据来回答，不做任何动作，而做不到的请求会被拒绝。ESP32 只会执行校验过的 JSON。',
  },

  console: {
    title: 'LUMEN 控制台',
    wake: '“Hello Robot”',
    ptt: '按键说话',
    pipeAria: '请求流程',
    stages: ['触发', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: '听到',
    parsed: '解析',
    quote: '“{said}”',
    idle: '说“Hello Robot”或者按住按钮说话。',
    room: '房间',
    autoOn: '自动模式开',
    autoOff: '自动模式关',
    devices: { white: '白色 LED', rgb: 'NeoPixel', fan: '风扇', servo: '舵机' },
    on: '开',
    off: '关',
    motion: '有人',
    still: '没人',
    dark: '暗',
    lit: '亮',
    timer: '定时：10 分钟后关灯',
    play: '播放',
    pause: '暂停',
    steps: [
      { said: '把灯设成青色，一秒后开风扇。', reply: '现在是青色，风扇 1 秒后开。' },
      { said: '把亮度设成湿度的百分比。', reply: '亮度已设为 69%。' },
      { said: '十分钟后关灯。', reply: '10 分钟后关灯。' },
      { said: '这里温度多少？', reply: '这里是 24.3°C。' },
      { said: '晚安。', reply: '晚安。' },
      { said: '给我做个三明治。', reply: '抱歉，这个我做不到。' },
    ],
  },

  how: {
    h: '工作原理',
    p1: <><strong>ESP32 几乎不用动脑</strong>，它唯一的工作就是录音和执行指令。语音转文字、语言模型和日志记录，全都跑在我 homelab 上 Docker 里的一台 FastAPI 服务器上，开发板通过局域网连过去。</>,
    p2: <>一个触发（“Hello Robot”唤醒词，或者作为备用的按键说话按钮）会让 INMP441 麦克风开始录 16&nbsp;kHz 的单声道音频。开发板把它包成 WAV，流式传到服务器的 <code>/upload</code> 接口。服务器两步都用同一个 <strong>OpenRouter</strong> API key，先让 Whisper 把音频转成文字，再让一个 DeepSeek 模型在一份严格的 system prompt 下把文字变成一条 JSON 指令。接着它校验这段 JSON，把它发布到 ESP32 订阅的一个 MQTT topic 上，并把每次的结果连同估算的单次请求费用追加到一张 Google 表格里。</>,
    p3: '服务器还会订阅房间的状态和传感器 topic，缓存最新的数值，并把它们作为上下文交给大语言模型，所以像“现在温度多少？”和“风扇开着吗？”这样的问题，都是用真实读数来回答的。',
    pipelineH: '语音流程',
    steps: [
      <>你说一声“Hello Robot”，或者按住按键说话按钮，<b>触发</b>它。</>,
      <>INMP441 <b>录下</b>大约三秒 16&nbsp;kHz 的单声道音频，录音时红色的 REC LED 会一直亮着。</>,
      <>开发板给原始 PCM 加上 44 字节的 WAV 头，<b>包装</b>好以后，一边录一边<b>流式传</b>到 <code>/upload</code>。</>,
      <>服务器把这段录音发给 OpenRouter，由 Whisper 把它<b>转写</b>成文字。</>,
      <>服务器<b>补上上下文</b>，把转写的文字连同设备状态和传感器读数的快照一起交给模型。</>,
      <>一个同样通过 OpenRouter 调用的 DeepSeek 模型把它<b>解析</b>成一条 JSON 指令，服务器按 schema 检查它，不合格就重试一次，再不行就退回一个空操作。</>,
      <>服务器通过 MQTT <b>发出</b>指令，并在 Google 表格里追加一行。</>,
      <>ESP32 <b>执行</b>指令，并在 OLED 上显示回复。</>,
    ],
  },

  flow: {
    stages: [
      { tag: '在 ESP32 上', title: '触发与麦克风', text: '唤醒词或按键说话会让 INMP441 开始录 16 kHz 的单声道音频。' },
      { tag: 'FastAPI 服务器，OpenRouter', title: 'Whisper、DeepSeek 和校验', text: 'Whisper 把语音转成文字，DeepSeek 模型把它解析成一条 JSON 指令，服务器按 schema 检查，不合格就重试一次，再不行就是空操作。' },
      { tag: '在房间里', title: '设备与 OLED', text: 'LED、RGB、风扇、舵机和蜂鸣器做出反应，OLED 显示回复。' },
    ],
    links: ['流式传到 /upload', 'MQTT 指令'],
    caption: '一条语音指令从 ESP32 出发，经过服务器，到达房间里各个设备的路线',
  },

  brain: {
    h: '指令解析器',
    p: '模型从来不直接控制设备，它只是把每句话转换成三种 JSON 格式里的刚好一种：',
    shapes: [
      <><b>action</b> 是单个改动，比如“开风扇”或者“设成青色”。</>,
      <><b>sequence</b> 是一组按顺序执行的步骤，每一步都带着从你说话那一刻算起的延迟，比如“关灯，一秒后再关风扇”。</>,
      <><b>timer</b> 是倒计时结束后的一个改动，比如“十分钟后关灯”。</>,
    ],
    p2: '它也能听懂其他语言，因为 Whisper 能转写很多种语言，而解析器会把每种语言都对应到同一套 JSON 词汇。用马来语或者华语说的指令，和英文版产生的动作完全一样。',
    p3: '一份又长又严格的 system prompt 固定了设备词汇（白色 LED、NeoPixel RGB、风扇、舵机、蜂鸣器、舒适范围、自动模式），强制输出合法的 JSON、数字必须是数字，还让模型自己把颜色名换算成 RGB。服务器会按 schema 检查每一个回应，如果不合格就重试一次，然后退回一个空操作，而不是把一条信不过的东西发给开发板。',
    p4: <>模型还能把房间的读数当作输入，所以当我让它“把亮度设成湿度的百分比”时，它会从缓存的传感器状态里读出实时湿度，取整，限制在 LED 的 0 到 100 范围内，然后输出一条真正的 <code>set_brightness</code> 指令。</>,
  },

  chart: {
    aria: '指令解析的流程图。Whisper 转写用多种语言说出的语音，然后文字和实时传感器上下文一起交给 DeepSeek 大语言模型。如果输出的 JSON 没有通过 schema 校验，服务器会重试一次，如果还是不合格，结果就是一个安全的空操作。如果合格，指令会按类型分流：action 是单个设备的改动，sequence 是带延迟的有序步骤，timer 是倒计时后的一个改动。',
    input: { t: '转写文字和传感器上下文', s: 'Whisper 的转写，加上 MQTT 缓存里的实时房间快照' },
    note: { t: '多语言输入', s: 'Whisper 能处理多种语言' },
    badge: '能听懂多种语言',
    llm: { t: 'DeepSeek 大语言模型（通过 OpenRouter）', s: '把请求解析成一条 JSON 指令' },
    valid: ['JSON schema', '合格吗？'],
    validOne: 'JSON schema 合格吗？',
    yes: '是',
    no: '否',
    fails: '不合格',
    route: { t: '按指令类型分流', s: 'action、sequence 或 timer' },
    outcomes: ['单个设备改动', '带延迟的步骤', '延迟后的一个改动'],
    retry: { t: '重试一次', s: '重新提示模型', phone: '重新提示大语言模型' },
    noop: { t: '安全空操作', s: '只回复，不动作', phone: '只回复，不对房间做任何动作' },
    ifInvalid: '不合格时',
    failurePath: '失败路径',
    stillFails: '仍不合格',
    ifValid: '合格时',
    byType: '按类型',
    caption: '一条语音指令在解析器里怎么走，每条路径最后都是一个 action、一个 sequence、一个 timer，或者一次不做任何动作的拒绝',
  },

  prompt: {
    eyebrow: 'LUMEN 发给模型的 system prompt',
    viewAria: 'Prompt 视图',
    formatted: '排版',
    code: '代码',
    more: '显示完整的 prompt',
    less: '收起',
  },

  hardware: {
    h: '硬件',
    p1: '所有东西都挂在一块运行 MicroPython 的 ESP32-WROOM 上，输入在一边，输出在另一边。一个非阻塞的主循环服务所有部件，所以触发检测永远不会卡住。',
    p2: 'LDR 是一个自带灵敏度电位器的数字光照模块，所以完全不用模拟读取，也就避开了 ESP32 的 ADC 和 WiFi 之间的冲突。一颗红色 LED 只在麦克风录音时亮起，一块带两个翻页按钮的 SSD1306 OLED 分四页显示状态和上一条指令。DF2301Q 唤醒词模块已经接好线、驱动也写好了，不过在实验台上演示时，我用的是按键说话按钮。',
    micAlt: '接到 ESP32 上的 INMP441 I2S 麦克风特写',
    micCaption: 'INMP441 I2S 麦克风。',
  },

  hub: {
    aria: '一张接线图，ESP32-WROOM 在中间。左边是传感器和它们的引脚：I2S 上的 INMP441 麦克风（GPIO 14、23、32）、DHT22（GPIO 4）、PIR（GPIO 35）、LDR（GPIO 34）和按键说话按钮（GPIO 19）。右边是输出：白色 LED（GPIO 25）、NeoPixel（GPIO 27）、风扇（GPIO 26）、舵机（GPIO 13）、蜂鸣器（GPIO 33）和录音 LED（GPIO 17）。底部共用的 I2C 总线（SDA 21、SCL 22）上接着 SSD1306 OLED（0x3C）和 DF2301Q 唤醒词模块（0x64），两个翻页按钮在 GPIO 18 和 16 上。',
    inputs: '传感器与输入',
    outputs: '输出',
    bus: 'I2C 总线（SDA 21、SCL 22）和界面按钮',
    core: { t: 'ESP32', s: ['WROOM，MicroPython', '一个非阻塞循环'], phone: 'ESP32-WROOM', phoneS: 'MicroPython，一个非阻塞循环' },
    parts: {
      mic: { n: 'INMP441 麦克风', s: 'I2S 麦克风' },
      dht: { n: 'DHT22', s: '温度和湿度' },
      pir: { n: 'PIR', s: '人体感应' },
      ldr: { n: 'LDR 模块', s: '亮或暗' },
      ptt: { n: '说话按钮', s: '按键说话' },
      led: { n: '白色 LED', s: 'PWM 亮度' },
      neo: { n: 'NeoPixel', s: 'WS2812 RGB' },
      fan: { n: '风扇', s: '开或关' },
      servo: { n: '舵机', s: '0 到 180°' },
      buzzer: { n: '蜂鸣器', s: '提示音和警报' },
      rec: { n: 'REC LED', s: '录音中' },
      oled: { n: 'OLED', s: 'SSD1306，0x3C' },
      wake: { n: 'DF2301Q', s: '唤醒词，0x64' },
      navA: { n: '翻页 A', s: '翻页' },
      navB: { n: '翻页 B', s: '翻页' },
    },
    caption: '每个元件和它用到的 GPIO，OLED 和 DF2301Q 共用一条 I2C 总线',
  },

  memory: {
    h: '塞进内存里',
    p1: 'ESP32-WROOM 没有 PSRAM，开着 WiFi 时，MicroPython 只给我留了大约 33 KB 能用的内存。一段语音大约有 96 KB，所以音频没办法一次全放进内存。',
    p2: <>为了绕过这一点，没有任何地方会拿着整段录音。麦克风是一个常驻、提前预热好的实例，录音缓冲区很小，用到时才分配，而上传是一边录一边<strong>通过原始 socket 流式传出</strong>的：先发一段前导，再发 WAV 头，然后一块一块地发 PCM，最后发结尾。这样上传时的内存峰值能保持在大约 10&nbsp;KB。要是改成拼出一个大的 <code>bytes</code> 对象，垃圾回收器就得从 WiFi 和 I2S 麦克风共用的同一个堆里拿走一块约 26&nbsp;KB 的内存，网络栈会被饿到上传超时。</>,
    p3: <>现在的固件在 OLED 上用的是一个精简的四页状态屏，因为一个更丰富的版本，带实时刷新的传感器数值和录音启动画面，把堆撑大到连开机都会出问题。用那个版本时，开发板既连不上 MQTT（<code>ENOBUFS</code>），也打不开麦克风（<code>ENOMEM</code>）。为了腾出空间，我还去掉了实时时钟和按钟点执行的计划，所以现在定时器靠单调递增的 tick 计数来跑，不需要时钟。</>,
  },

  auto: {
    h: '自动模式',
    p: [
      '自动模式直接在开发板上运行。房间暗的时候一检测到有人走动，它就打开白色 LED，五分钟没人再把它关掉。温度一超过舒适范围，它就开风扇，而且留了一段迟滞区间，免得风扇在阈值附近开开关关。',
      '任何语音指令都优先，还会清掉自动状态，所以自动模式永远不会推翻你刚设好的灯。',
    ],
  },

  deploy: {
    h: '仪表盘与部署',
    p: [
      '服务器是一个 Docker 化的 FastAPI 应用，带一个网页仪表盘：设备控制（白色 LED、RGB 取色器、风扇、舵机、蜂鸣器、自动模式开关、舒适范围编辑器）、实时状态显示、温湿度历史图表、最近指令的日志、最近几段语音录音的播放器，还有一个走同样大语言模型流程的文本框。这个文本框是我的后备方案，万一现场演示时麦克风罢工就靠它了，而重置会清空图表、日志和录音。',
      '它跑在我的 homelab 上，前面是 Nginx Proxy Manager 和 Cloudflare，用一个 HTTPS 主机名来提供仪表盘。MQTT 代理是直接连的，不经过 Cloudflare，而 ESP32 只和一个局域网地址通信，不走公网主机名，这样固件能保持小巧。',
    ],
    dashAlt: 'LUMEN 网页仪表盘：设备控制、实时显示、历史图表和活动日志',
    dashCaption: 'LUMEN 网页仪表盘',
  },

  slides: {
    h: '幻灯片',
    p: '这是我在课程评审时用的幻灯片，讲了题目、流程、内存上的功夫和演示。',
    frame: 'LUMEN 项目演示（Figma 幻灯片）',
  },

  next: {
    h: '接下来想加的',
    p: '换一块带 PSRAM 的 ESP32-S3，就能把我砍掉的大部分功能找回来，因为 WROOM 一边跑 WiFi 和 MQTT、一边流式传麦克风音频，已经到极限了。',
    items: [
      <><b>更丰富的 OLED</b>，把我不得不去掉的实时刷新传感器页面和录音启动画面加回来。</>,
      <><b>按钟点执行的计划</b>（“每天早上 8&nbsp;点”），这需要我为了省内存而去掉的实时时钟。</>,
      <><b>能保留下来的历史</b>，让仪表盘的图表和定时器重启后还在，因为现在最近几个小时的数据只存在内存里。</>,
      <><b>真正能用的唤醒词</b>，在硬件上跑起来，这样按键说话就变成备用，而不是主要的触发方式。</>,
    ],
  },
};

export default zh;
