import type { LidarCopy } from './en';

const zh: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: '一个用 M5Stack 的 Stack-chan 做的 LiDAR：它用舵机带着四个 Unit ToF4M 距离传感器扫过整个房间，用摄像头给点上色，任何浏览器都能用 3D 显示扫描结果。',
    ogDescription: 'Stack-chan 带着四个距离传感器扫过房间，把读数变成一份你可以自由探索的彩色 3D 扫描。',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', '点云', '3D 扫描', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: '扫描', colour: '上色', demo: '演示', play: '玩玩扫描', setup: '自己做一个' },
  chaptersLabel: '章节',
  hero: {
    alt: '按 M5Stack 的模型画出来的 Stack-chan，头顶上四个 Unit ToF4M 传感器排成一个正方形',
    back: '返回项目',
    tag: '实习项目',
    featured: '精选',
    title: 'Stack-chan LiDAR',
    lead: '我在 Stack-chan 头上装了四个距离传感器，让它的舵机带着它们扫过整个房间，就这样把它变成了一个 LiDAR。它的摄像头给点上色，同一个 Wi-Fi 下的任何浏览器，都能一边扫一边用 3D 显示扫描结果。',
    builtWith: '用到的工具',
    flash: '烧录固件',
    meta: 'M5Stack 实习项目，2026年11月。Stack-chan（CoreS3）、PaHub、四个 Unit ToF4M、C++ 和 WebGL。',
    cue: '往下滚动，开始扫描',
  },
  sweep: {
    alt: '从 Stack-chan 肩后看过去，它的传感器视锥照到墙上，扫描结果在房间四周慢慢填满',
    caps: [
      { title: '扫过整个房间', p: 'Stack-chan 每次把头转几度，慢慢扫过整个房间，每一步都会停下来，量一量墙有多远。舵机给出方向，传感器给出距离，所以每一步都会在 3D 里多出一个点。这就是演示里真实的扫描，随着头部转动一点点填满。' },
      { title: '快速、普通或精细', p: '扫描前我会选快速、普通或精细。快速一分钟内就能扫完，精细要久一点，但能抓到多得多的细节。' },
    ],
  },
  colour: {
    alt: '从房间外面看完成的扫描，用的是摄像头的颜色',
    caps: [
      { title: '颜色来自摄像头', p: '开始扫描前，Stack-chan 会先用 CoreS3 的摄像头把这片区域拍下来。然后浏览器把照片里的每个像素放到传感器在那个方向测到的距离上，一格一格的读数就这样变成了 68,206 个彩色点。' },
      { title: '把照片对齐', p: '摄像头在传感器下面，所以照片和距离是从稍微不同的位置拍的。我把深度里的边缘和照片里的边缘对上，把两者对齐，现在房间大部分地方的颜色都落在了对的位置，不过还不是每一处都对。' },
    ],
  },
  demo: {
    h: '演示',
    p: '我把 Stack-chan 放在一个空房间角落的桌子上，用笔记本电脑开始扫描。视频里能看到它的头在扫，浏览器里的点一点点长出来，然后从各个角度看完成的扫描，先按距离上色，再用摄像头的颜色。',
    video: 'Stack-chan 扫描房间的一个角落，浏览器里的点云不断长大，然后是按深度和照片颜色显示的完成扫描',
    moments: [
      { label: '扫描', note: '头部在角落里来回扫，点慢慢填满' },
      { label: '完成的扫描', note: '从外面看这个角落的墙和天花板' },
      { label: '深度', note: '每个点按它离得多远上色' },
      { label: '照片颜色', note: '同样的点，用 Stack-chan 拍的照片上色' },
    ],
  },
  play: {
    h: '玩玩扫描',
    stillAlt: '从上面看完成的扫描：一个房间角落的墙和天花板，桌上有一个蓝色盒子',
  },
  pg: {
    view: 'Stack-chan 扫描的房间的 3D 点云。拖动可以旋转，滚轮或双指缩放，右键拖动可以平移，双击某个地方就会飞过去。',
    loading: '正在加载扫描',
    hintTouch: '拖动旋转，双指缩放',
    hintMouse: '拖动旋转，滚轮缩放，右键拖动平移',
    drop: '把 .ply 文件拖进来打开',
    stat: '{n} 个点，{size} 米',
    colourBy: '点的上色方式',
    modes: ['照片', '深度', '高度'],
    eyeTitle: '从 Stack-chan 的头部看',
    eye: '从 Stack-chan 的头部看',
    reset: '回到初始视角',
    full: '全屏',
    leaveFull: '退出全屏',
    open: '打开你自己的 .ply',
    upY: '这个文件里 Y 轴朝上',
    back: '回到 Stack-chan 的扫描',
    download: '下载这份扫描',
    errors: {
      notPly: '这个文件看起来不像 .ply 点云。',
      lists: '不支持顶点数据里的列表，只导出点就好。',
      noXyz: '这个 .ply 里找不到 x、y 和 z。',
      short: '这个 .ply 在所有点结束之前就断了。',
      unreadable: '这个文件读不出来。',
    },
  },
  setup: {
    h: '自己做一个',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>，M5Stack 的小机器人，它的头是一台装在两个舵机上的 CoreS3。它的 ESP32-S3 负责跑扫描、网页服务器和摄像头。</>,
      <>四个 <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>，也就是 VL53L1X 飞行时间（ToF）距离传感器，在头顶排成一个正方形。</>,
      <>一个 <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>，虽然四个传感器的 I2C 地址都一样，有了它就能共用一个 Grove 接口。</>,
    ],
    photoAlt: '真正的 Stack-chan，头上装着四个传感器，它们的 Grove 线绕到背后',
    photoCaption: '装好传感器的真 Stack-chan',
    steps: [
      <>把 PaHub 插到 Stack-chan 的 Port A，四个 Unit ToF4M 插到它的 0 到 3 通道，然后把传感器朝前装在头顶上。</>,
      <>用 Chrome 或 Edge 打开 <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a>，选择 <b>Stack-chan LiDAR</b>，用 USB-C 接上 Stack-chan，然后点 Install。</>,
      <>连上它开出来的 <b>StackChan-LiDAR</b> Wi-Fi 网络，打开 <b>http://192.168.4.1/</b>，点一下 Stack-chan 的脸，它也会显示这个地址。然后选一片区域和细节等级，开始扫描。</>,
    ],
    note: '本页的 Stack-chan 是用 M5Stack 自己的 3D 模型做的（M5_Hardware，MIT 许可证）。',
  },
};

export default zh;
