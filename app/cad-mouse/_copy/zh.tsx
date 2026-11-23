import type { CadMouseCopy } from './en';

const zh: CadMouseCopy = {
  meta: {
    title: '3D CAD 鼠标 | Braven Chiam',
    description: '一个用 M5Stack Capsule 做成的 Onshape 无线 3D 鼠标。按一下它的按钮，在手里转它，屏幕上的模型就跟着转，因为 Capsule 会通过蓝牙把自己伪装成一只 3Dconnexion SpaceMouse。',
    ogDescription: '在手里转动 M5Stack Capsule，Onshape 里的模型就跟着转。',
  },
  ld: {
    headline: '3D CAD 鼠标',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', '蓝牙 LE HID', '3D 鼠标', 'Onshape'],
  },
  hero: {
    alt: '竖着放的 M5Stack Capsule v1.1，彩色的引脚标签朝前，USB-C 接口在底部',
    back: '返回项目',
    tag: '实习项目',
    title: <>3D CAD <em>鼠标</em></>,
    lead: '我把一个 M5Stack Capsule 改成了 Onshape 用的无线 3D 鼠标。按一下它的按钮，在手里转它，屏幕上的模型就跟着转，就好像你手里拿着的是那个零件本身。',
    builtWith: '使用工具',
    burnerTitle: '固件还没有上架 M5Burner',
    burner: '用 M5Burner 安装',
    burnerSoon: '即将推出',
    meta: '2026 年 11 月，M5Stack 实习项目。M5Stack Capsule v1.1、蓝牙 LE、C++。',
  },
  chapters: '章节',
  rail: {
    demo: '演示', try: '试一试', use: '怎么用', how: '工作原理',
    spacemouse: '伪装成 SpaceMouse', turning: '跟着你的手走', stopping: '干净利落地停下',
    hardware: '硬件', setup: '自己搭一个',
  },
  demo: {
    h: '演示',
    p: '这段是我在桌前拍的，Onshape 里打开着我做的一个外壳。打开旋转后，我转动 Capsule，零件就跟着转、跟着倾斜；按住按钮，我还能把零件在屏幕上拖来拖去，放大看它上面的按键。',
    video: '在手里转动 Capsule，让 Onshape 里一个橙色外壳跟着转，然后平移并放大看它的按键',
    moments: [
      { label: '转动零件', note: '旋转已打开，零件跟着我的手转动、倾斜' },
      { label: '翻个面', note: '把 Capsule 整个翻过来，就能看到底面' },
      { label: '拖到一边', note: '按住按钮，零件就平移到一边再回来' },
      { label: '放大细看', note: '按住时扭一扭，就能放大看按键，再缩回来' },
    ],
  },
  try: {
    h: '试一试',
    p: '这个副本运行的是 Capsule 的按钮逻辑，只是用你的鼠标指针代替你的手。Capsule 的顶部就是它的按钮：点一下打开旋转，然后把指针移到视图上来转动零件；按住它就是平移，双击它就能让零件重新完整地显示在视图里。',
    note: '真正的 Capsule 会测量你的手转得有多快，所以零件转过的角度和你的手一样。这里用指针的移动来代替。',
  },
  sim: {
    led: {
      ready: '绿灯闪：已连接，旋转关闭',
      rotate: '青色：旋转打开',
      pan: '琥珀色：平移中',
      fit: '白光一闪：适配视图',
    },
    status: {
      demo: '正在播放旋转演示。碰一下 Capsule 的按钮就能接手。',
      pan: '按住时是平移。移动指针拖动零件，滚动滚轮缩放，也就是真机上的扭动。',
      rotate: '旋转已打开。把指针移到视图上，零件就跟着转。再点一下就停。',
      off: '旋转已关闭。点按钮开始，按住平移，双击适配视图。',
    },
    viewport: 'CAD 视图里一个橙色的手持设备外壳，由 Capsule 转动',
    button: 'Capsule 的按钮：点一下切换旋转，按住平移，双击适配视图',
    reset: '重新开始',
  },
  use: {
    h: '怎么用',
    p1: '把 Capsule 竖着拿，标签朝向你，USB 接口在底部，它唯一的那个按钮就能搞定一切。',
    parts: [
      { b: '点一下旋转', s: '点一下就会打开旋转，灯变成青色。从这时起，模型会一直跟着你的手，直到你再点一下。旋转会在点击 0.3 秒后才开始，这是它在等着确认你不是要双击。' },
      { b: '按住平移和缩放', s: '按住按钮会暂停旋转，改成平移，灯变成琥珀色。把 Capsule 指向左、右、上或下，模型就往那边滑，扭一扭就能缩放。松开按钮，旋转又会接着开始。' },
      { b: '双击适配视图', s: '双击会把整个模型适配到屏幕里，旋转保持原来的状态。' },
    ],
    p2: '等待连接电脑时，灯会像呼吸一样闪蓝光，连上之后每隔几秒闪一下绿光。高一点的滴声表示旋转打开，低一点的表示关闭，而且长时间不用的话，Capsule 会自己关机。',
  },
  how: {
    h: '工作原理',
    p: 'Capsule 的 IMU 里有陀螺仪和加速度计，再加上一个按钮和蓝牙，3D 鼠标需要的东西它全都有。难的是让 Onshape 肯听它的。',
  },
  spacemouse: {
    h: '伪装成 SpaceMouse',
    p: 'Onshape 只通过 3Dconnexion 的驱动接收 3D 鼠标的输入，这家公司就是做 SpaceMouse 的。所以 Capsule 通过蓝牙把自己介绍成他们家的 SpaceMouse Wireless，用的是那个型号的 ID 和一模一样的报告格式，剩下的就交给驱动了。Onshape 里面什么都不用装。蓝牙这部分我是在之前做的一个空中鼠标的代码上搭起来的，那份代码本来就能在 Windows 和 macOS 上用。',
  },
  turning: {
    h: '跟着你的手走',
    p1: '真正的 SpaceMouse 汇报的是你把它的帽子推了多远，驱动再把这个换算成速度。Capsule 发送的则是陀螺仪测到的你的手转得有多快，所以驱动会让模型转过和你的手一样的角度。感觉就像是拿着零件，而不是在操控它。',
    p2: '加速度计只负责判断哪边是下。这样不管你怎么握 Capsule，坐标轴都能保持水平，绕竖直方向转它，模型就总是绕屏幕的竖直方向转。我没有用它来移动模型，因为用加速度计算出来的位置不到一秒就会漂走，所以平移是靠 Capsule 指向哪里来实现的。',
  },
  stopping: {
    h: '干净利落地停下',
    p1: '按下按钮的一瞬间输出就会冻结，所以拇指按下时的抖动和手停下来的那一下都不会传到模型上。手在动的时候，Capsule 每秒发送 62.5 次报告，和真正的 SpaceMouse 一样。手停下后，它会继续发零，直到发够三个，因为如果最后一个报告丢了，模型就会一直转下去，然后它才安静下来。',
    p2: '运动计算和按钮手势都放在一个没有硬件代码的库里，所以每次烧录前，19 个单元测试会先在电脑上把它们检查一遍。',
  },
  hardware: {
    h: '硬件',
    parts: [
      { b: 'M5Stack Capsule v1.1', s: '就是全部了，什么都没加。它的 ESP32-S3 运行固件和蓝牙，BMI270 IMU 每秒读取 200 次陀螺仪，RGB LED 和蜂鸣器负责给出反馈。' },
      { b: '按钮', s: '在 Capsule 顶部，三种手势全靠它。' },
      { b: '一块 250 mAh 电池', s: '装在里面，让它保持无线，而且一段时间不动它就会自动关机。' },
    ],
    holdAlt: '在显示器前拿着 Capsule，Onshape 里的外壳跟着它转动',
    holdCaption: '演示里转动外壳的样子',
  },
  setup: {
    h: '自己搭一个',
    steps: [
      <>在电脑上安装 3Dconnexion 的免费驱动 3DxWare。它里面有让浏览器里的 Onshape 接收 3D 鼠标信号的组件。</>,
      <>用 M5Burner 把固件烧录到一个 Capsule v1.1 上。它还没有上架 M5Burner，所以这一步即将推出。</>,
      <>打开电脑的蓝牙设置，配对 <b>Capsule CAD Mouse</b>。连上的时候它会叫一声。</>,
      <>在 Onshape 里打开一个模型，点一下按钮，然后转动 Capsule。</>,
    ],
    note: '到目前为止我只在 Onshape 里试过。其他通过 3DxWare 使用 SpaceMouse 的软件应该也能一样用，但我还没测试过，也还没测过电池能撑多久。',
  },
};
export default zh;
