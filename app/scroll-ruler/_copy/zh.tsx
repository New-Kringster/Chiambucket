import type { ScrollRulerCopy } from './en';

const zh: ScrollRulerCopy = {
  meta: {
    title: '滚轮尺 | Braven Chiam',
    description: '一把数字尺子，是我在 M5Stack 实习期间用 M5Stack AtomS3R 和 Unit Scroll 做的。按下滚轮，沿着你想量的东西滚过去，只要先用 10 厘米校准一次，屏幕就会用厘米显示距离。',
    ogDescription: '让 Unit Scroll 沿着东西滚一遍，AtomS3R 就会告诉你它有多长。',
  },
  ld: {
    headline: '滚轮尺',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', '旋转编码器', '数字尺'],
  },
  hero: {
    alt: '滚轮尺：装在 Atomic Battery Base 上的 AtomS3R，下面插着 Unit Scroll，屏幕显示 0.0 cm',
    back: '返回项目',
    tag: '实习项目',
    title: <>滚轮<em>尺</em></>,
    lead: '这把数字尺子是我在 M5Stack 实习时用 AtomS3R 和 Unit Scroll 做的。按下滚轮，沿着你想量的东西滚过去，屏幕就会用厘米显示距离。',
    builtWith: '使用工具',
    links: ['GitHub', '烧录固件'],
    meta: '2026 年 11 月，M5Stack 实习项目。M5Stack AtomS3R、Atomic Battery Base、Unit Scroll、C++。',
  },
  chapters: '章节',
  rail: {
    demo: '演示', try: '试一试', use: '怎么用', measure: '测量', calibrate: '校准',
    steps: '能量多精细', how: '工作原理', hardware: '硬件', setup: '自己搭一个',
  },
  demo: {
    h: '演示',
    p: '这段是我在桌前拍的，先沿着一把尺子的 10 厘米校准，然后沿着同一把尺子量了三段长度。',
    video: '滚轮尺沿着一把尺子的 10 厘米校准，然后量出 4.1、8.2 和 7.3 厘米',
    moments: [
      { label: '用 10 厘米校准', note: '滚轮数了 49 步，每步大约 2 毫米' },
      { label: '第一次测量', note: '沿着尺子滚过去，读数是 4.1 cm' },
      { label: '第二次测量', note: '滚得更长一点，读数是 8.2 cm' },
      { label: '第三次测量', note: '最后一次的读数是 7.3 cm' },
    ],
  },
  try: {
    h: '试一试',
    p: '这个尺子副本跑的是和固件一样的逻辑，一开始停在校准界面。沿着尺子拖动 Unit Scroll，就是按着滚轮滚动，这样会计数；点一下尺子，就是把它拿起来放到别处，这样不会计数。点一下屏幕会保存校准或者把读数归零，按住一秒则开始重新校准。',
    note: '如果校准时滚的不是刚好 10 厘米，之后每个读数都会偏掉同样的幅度，这里和真正的尺子一样。',
  },
  sim: {
    reading: '读数 {cm} 厘米。',
    readingLive: '读数 {cm} 厘米，计数中。',
    calibrating: '校准中：目前 {n} 步。按住滚轮刚好滚 10 厘米，然后松开。',
    confirming: '10 厘米是 {n} 步。点一下屏幕保存。',
    button: 'AtomS3R 的屏幕，同时也是它的按钮：点一下归零或保存，按住重新校准',
    puck: 'Unit Scroll 在尺子上 {cm} cm 的位置。按住方向键，就能按着滚轮滚动它。',
    reset: '重新开始',
  },
  use: {
    h: '怎么用',
    p: 'AtomS3R 的整块屏幕就是它的按钮，所以这把尺子只有两个控件：滚轮，滚的时候要按着；还有屏幕，可以点也可以按住。',
  },
  measure: {
    h: '测量',
    screen: '计数时的尺子界面：RULER 旁边有绿色的 LIVE 标签，4.1 cm 显示为绿色，下面是 41 mm，每步 2.0 mm',
    p1: '按下滚轮往前滚，只有滚轮一直按着的时候才会计数，这时 Unit Scroll 的 LED 亮绿光，读数也变成绿色。松开滚轮就停止计数，按着往回滚则会把距离减掉。',
    p2: '点一下屏幕会把读数归零，按住大约一秒则开始重新校准。',
  },
  calibrate: {
    h: '校准',
    rolling: '校准中：目前已数到 49 步，提示按住滚轮刚好滚 10 cm',
    rollingCaption: '正在滚那 10 厘米',
    checking: '确认中：49 步等于 10 cm，点一下保存',
    checkingCaption: '已松开，可以保存了',
    p1: '第一次开机时，以及你每次要求它的时候，尺子都会量一次 10 厘米，来弄清滚轮每一步走多远。你按着滚轮沿着一把真尺子刚好滚 10 厘米，然后松开，再点一下屏幕，保存它数到的步数。',
    p2: '再按下滚轮会接着累加到同一段里，按住屏幕则从头来过。校准数据存在闪存里，所以断电也不会丢，而你校准时滚的方向就成了“往前”。',
  },
  steps: {
    h: '能量多精细',
    p: '滚轮转一圈只有那么多步，所以尺子是一步一步地量，而不是连续的。我这把 10 厘米数了 49 步，也就是每步大约 2 毫米，屏幕会在每个读数下面显示准确的步长，让你知道最后一位数能信几分。',
  },
  how: {
    h: '工作原理',
    p1: 'Unit Scroll 有自己的小芯片，负责数滚轮的步数和读取按钮，AtomS3R 通过 Grove 接口用 I2C 每秒问它一百次。每次读取都会返回自上一次以来的步数，只有滚轮被按着时，这些步数才会算进距离里。',
    p2: '我把尺子的逻辑，也就是校准和距离计算，放在一个没有硬件代码的文件里，所以在它烧进设备之前，十一个单元测试会先在电脑上把它检查一遍。如果 Unit Scroll 被拔掉，屏幕会提示，一重新插上，它马上就能重新识别。',
  },
  hardware: {
    h: '硬件',
    parts: [
      { b: 'AtomS3R', s: '用它的 ESP32-S3 运行尺子，那块 0.85 英寸的屏幕同时也是按钮。' },
      { b: 'Atomic Battery Base', s: '装着电池，所以尺子不用接线。' },
      { b: 'Unit Scroll', s: '就是你滚的那个滚轮，带一个按键和一颗 RGB LED，插在 AtomS3R 的 Grove 接口上。' },
    ],
    photoAlt: '第二次测量后举起的尺子，屏幕显示 8.2 cm，下面是它刚滚过的那把尺子',
    photoCaption: '演示里第二次测量之后',
  },
  setup: {
    h: '自己搭一个',
    steps: [
      <>把 AtomS3R 叠在 Atomic Battery Base 上，再把 Unit Scroll 插进 AtomS3R 的 Grove 接口。</>,
      <>用 Chrome 或 Edge 打开 <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a>，选择 <b>Scroll Wheel Ruler</b>，用 USB-C 接上 AtomS3R，按 <b>Install</b>，固件就会直接从浏览器烧录进去。</>,
      <>它一开机就是校准界面，所以按着滚轮沿着一把尺子刚好滚 10 厘米，然后松开，再点一下屏幕保存。</>,
    ],
    repo: <><a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">GitHub 仓库</a>里有固件的代码、单元测试，还有一个固件镜像可以下载，方便你改用 esptool 烧录。</>,
    note: <>本页的 AtomS3R 是用 M5Stack 自己在 <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> 里的模型渲染的（MIT 许可，版权归 M5Stack 所有），屏幕画面则是按固件自己的布局画出来的。</>,
  },
};
export default zh;
