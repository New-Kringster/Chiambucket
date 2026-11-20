import { usePeekKit, type PeekLabels } from './kit';

/*
  The peek reader in Simplified Chinese: the same write-ups as en.tsx, words
  translated. Image paths and links stay as they are; internal links are
  localized by the kit.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': '食品保质期追踪器', 'proj-ruler': '滚轮尺', 'proj-cadmouse': '3D CAD 鼠标', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA 智能家居', 'proj-pandus': 'Pandus 分配器', 'proj-elecf': 'ELEC-F 概念',
  'proj-kauli': 'Kauli 概念', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': '网页开发', 'proj-mc': 'Minecraft 实时地图',
};

export const LABELS: PeekLabels = {
  soon: '文章即将推出',
  next: '下一个：{title}',
  untitled: '项目 {n}',
  pullHint: '继续滚动查看 {title}',
  pullAria: '打开下一个项目：{title}',
  end: '所有项目都在这里啦',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Project June 遥控车', ['个人项目'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 周 · 自学 · 3D 设计 · 蜂窝网络 · WebRTC · MQTT</p>
          <p className="hp-rd-lead">一辆我用三周做出来的 5G 遥控车，能传三路实时摄像头画面，带着一整套传感器，只要有信号，在哪里都能用 Xbox 手柄开。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '三路实时视频', <><p>三个摄像头通过 TURN 服务器用 WebRTC 实时传输，所以画面能以低延迟穿过蜂窝网络的 NAT。</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Project June 的摄像头" loading="lazy" /></>)}
          {chapter('02', '控制与遥测', <p>MQTT 通过一个 Mosquitto 代理传输控制指令和遥测数据，电机用自定义的 PWM 控制，舵机负责转向，全部由 Xbox 手柄操作。</p>)}
          {chapter('03', '一整套传感器', <><p>车上装着 Neo8M GPS、陀螺仪、加速度计、磁力计、气压计、超声波测距传感器、DHT11 和 TEMT6000 光照传感器。</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="Project June 的系统架构" loading="lazy" /></>)}
          {cta('完整的制作日志', '文章里有照片、系统架构，还有我遇到的每一个问题。', '阅读全文', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip，一只青色的桌面宠物，在 M5Stack Tab5 上', ['实习项目'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 周 · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">一个跑在 M5Stack Tab5 上的桌面宠物，它的大脑是我服务器上的 DeepSeek Harness，所以它能操作浏览器、自己做应用，还能帮我盯着其他智能体。</p>
          {chapter('01', '会把工作过程演出来的宠物', <><p>你不理 Pip，它就睡觉，你拿起平板，它就醒过来，思考的时候会扭来扭去、揉揉太阳穴，事情办成了还会蹦一下。它用每个工具时也会演出来，读网页时拿起望远镜，给帮手布置任务时举起喇叭。</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="拿着放大镜、望远镜、喇叭和纸飞机的 Pip" loading="lazy" /></>)}
          {chapter('02', '它会用屏幕', <p>回答会以页面和排好版的文字出现，Pip 能用自己的光标点进这些页面，也能给我出选择题。它还会做一些小应用放进抽屉里，有的是从我服务器上提供的网页，有的是直接在平板上运行的 Lua 脚本。</p>)}
          {chapter('03', '我所有智能体的中枢', <><p>Pip 和我的编程会话跑在同一个框架里，会把耗时长的任务交给帮手小 Pip，某个会话完成了或者需要我回答时，它也会告诉我。</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="拿着记事本、笔记本电脑、积木、书和烧瓶忙活的帮手小 Pip" loading="lazy" /></>)}
          {cta('看看 Pip 动起来', '文章展示了它的情绪、应用和桌面，以及这一切是怎么连起来的。', '阅读全文', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('食品保质期追踪器，一台叠在 QRCode 模块上的 CoreS3 SE', ['实习项目'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">食品保质期追踪器</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">一个贴在冰箱门上的保质期追踪器。扫一下商品的条形码，选好过期日期，屏幕就会一直告诉你该先吃什么。</p>
          {chapter('01', '先扫，再存', <><p>扫码器找条形码时屏幕会亮红光，然后显示从 Open Food Facts 或 GS1 China 查到的商品名称、品牌和照片，你用天、周、月选择器设好保质期，再保存。</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="追踪器上的保质期选择器" loading="lazy" /></>)}
          {chapter('02', '该先吃什么', <><p>主屏幕按过期时间给食品排序，一天内过期的数字变红，一周内的变成琥珀色，而扫到已经在列表里的东西，会直接打开它，不会重复添加。</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="按过期时间排序的主屏幕" loading="lazy" /></>)}
          {chapter('03', '剩下的交给服务器', <p>家庭网络上的一个 Docker 容器负责保存列表、查询条形码、提供一个管理食品柜的网页，还会通过 MQTT 把每个食品柜发布到 Home Assistant，用来提醒。</p>)}
          {cta('试试这个追踪器', '文章里有一个能操作的屏幕副本、演示视频，以及怎么自己搭一个。', '阅读全文', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('滚轮尺，一台插着 Unit Scroll 的 AtomS3R', ['实习项目'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">滚轮尺</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">一把数字尺子。按下 Unit Scroll 的滚轮，沿着你想量的东西滚过去，AtomS3R 就会用厘米显示距离。</p>
          {chapter('01', '校准一次就好', <><p>第一次开机时，你沿着一把真尺子准确地滚 10 厘米，再点一下屏幕，保存它数到的步数，这样它就知道滚轮每一步走多远。之后校准数据会一直存在闪存里。</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="尺子显示 8.2 厘米" loading="lazy" /></>)}
          {chapter('02', '滚一滚就能量', <p>只有在滚轮被按下、LED 亮绿灯时才会计数，所以你可以把它拿起来再放下，读数也不会丢。点一下屏幕就归零，长按屏幕则开始重新校准。</p>)}
          {chapter('03', '离开设备也能测试', <p>校准和距离的计算都放在一个没有硬件代码的文件里，所以在固件烧进 AtomS3R 之前，十一个单元测试会先在电脑上把它们检查一遍。</p>)}
          {cta('自己滚滚看', '文章里有一个能操作的尺子副本、演示视频，以及怎么自己烧录一个。', '阅读全文', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('头上装着四个 Unit ToF4M 距离传感器的 Stack-chan', ['实习项目'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · 四个 Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">一个临时拼出来的 LiDAR。Stack-chan 用两个舵机带着四个距离传感器扫过房间，摄像头给点上色，同一个 Wi-Fi 下的任何浏览器都能用 3D 显示扫描结果。</p>
          {chapter('01', '扫描', <><p>头部按网格一行一行地扫，从水平一直到正上方，横向最多 256 度，每个姿态都会变成一个样本：舵机给出方向，传感器给出距离。</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="用摄像头颜色上色的房间角落完整扫描" loading="lazy" /></>)}
          {chapter('02', '四个传感器，一个读数', <p>四个传感器朝向同一个方向，所以每个样本都取它们读数的中位数，这样就能把偶尔跑偏的那个剔掉。</p>)}
          {chapter('03', '颜色来自摄像头', <p>扫描前拍的照片会给点上色，浏览器再把每个像素推到测到的距离上，这次扫描就这样得到了 68,206 个彩色点。</p>)}
          {cta('探索这次扫描', '文章里有真实的 3D 扫描、演示短片，以及怎么自己烧录一个。', '阅读全文', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('当作 3D 鼠标用的 M5Stack Capsule v1.1', ['实习项目'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D CAD 鼠标</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">一个给 Onshape 用的无线 3D 鼠标。按一下 Capsule 的按钮，在手里转它，屏幕上的模型就跟着转。</p>
          {chapter('01', '假装成 SpaceMouse', <p>Onshape 只通过 3Dconnexion 的驱动来接收 3D 鼠标的信号，所以 Capsule 通过蓝牙把自己介绍成他们家的 SpaceMouse Wireless，剩下的就交给驱动了。</p>)}
          {chapter('02', '跟着你的手走', <><p>它用陀螺仪测出你的手转得有多快再发出去，所以模型转过的角度和你的手一样。按住按钮就变成平移，扭一扭就能缩放。</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="用 Capsule 在 Onshape 里转动一个外壳" loading="lazy" /></>)}
          {chapter('03', '离开设备也能测试', <p>运动计算和按钮手势都放在一个没有硬件代码的库里，所以每次烧录前，19 个单元测试会先在电脑上把它们检查一遍。</p>)}
          {cta('自己转转看', '文章里有一个能操作的控制副本、演示视频，以及怎么自己搭一个。', '阅读全文', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['个人项目'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 个月 · 自学 · 3D 设计 · PCB 设计</p>
          <p className="hp-rd-lead">一对 ESP32 手持通讯器，不需要任何网络也能互相通话：用远距离的 LoRa 发文字，用 ESP-NOW 进行双向语音。</p>
          {chapter('01', '两种无线电，各管一样', <><p>LoRa 负责远距离传文字，ESP-NOW 负责低延迟的双向语音，两台设备我都是用 PlatformIO 和 Arduino 框架编程的。</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="LoRA Messenger 的内部结构" loading="lazy" /></>)}
          {chapter('02', '一块手工回流焊的定制 PCB', <><p>电路板是我在 KiCAD 里设计的，SMD 元件也是我自己回流焊上去的，板上的 TP4056 电路负责充电。</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="定制 PCB" loading="lazy" /></>)}
          {chapter('03', '音频与外壳', <><p>I2S 麦克风和扬声器负责通话，两块 OLED 屏幕显示消息和状态，全部装在我用 Onshape 建模、3D 打印出来的外壳里。</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D 打印的外壳" loading="lazy" /></>)}
          {cta('看看它是怎么做出来的', '文章讲了面包板阶段、PCB 的几次改版，还有我学到的东西。', '阅读全文', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('LUMEN 语音助手', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP 物联网编程 · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">一个声控的智能房间助手，你说“Hello Robot”它就会醒来。ESP32 录下你接下来说的话，一个 FastAPI 中继把它转成文字，再让大语言模型给出一条严格的 JSON 指令，这条指令通过 MQTT 发回房间。</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', '从语音到一条 JSON 指令', <p>ESP32 把 16&nbsp;kHz 的音频流式传到服务器，Whisper 通过 OpenRouter 把它转成文字，DeepSeek 大语言模型再把它变成刚好一条指令（一个动作、一个序列或一个定时器），这条指令在到达开发板之前会先按 schema 校验一遍。</p>)}
          {chapter('02', '塞进一块没有 PSRAM 的板子', <><p>开着 WiFi 时，WROOM 大约只剩 33&nbsp;KB 空闲内存，而一段语音大约有 96&nbsp;KB，所以音频是边录边通过原始 socket 传出去的，不放在内存里，上传时的内存峰值一直保持在 10&nbsp;KB 左右。</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="接到 ESP32 上的 INMP441 麦克风" loading="lazy" /></>)}
          {chapter('03', '一个能对话的房间', <><p>灯、NeoPixel、风扇、舵机和蜂鸣器都会响应指令，还有本地的自动模式和一个网页仪表盘。如果你让它“把亮度设成湿度”，它就会读取实时的传感器数据，然后照做。</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="LUMEN 网页仪表盘" loading="lazy" /></>)}
          {cta('看看完整的制作过程', '文章讲了内存限制、接线，还有一个互动演示。', '阅读全文', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('搭载 DrumNet 的 OCR Reader：一套完全垂直整合的 OCR 水表方案', ['个人项目'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">一个低成本、用电池供电的摄像头，装在机械水表上，用一个完全跑在 ESP32-S3 上的 69.3 万参数神经网络读出字轮，再通过 LoRaWAN 把数字发回家。</p>
          {chapter('01', '芯片上的 DrumNet', <><p>定位器找到数字窗口，精修器通过对特征图的列和行取平均来确定它的边缘，然后三个读取器给每个字轮投票，并套用进位规则。整个网络以 INT8 运行，每次读数大约 2 秒。</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="DrumNet 的集成投票和读数" loading="lazy" /></>)}
          {chapter('02', '由六个智能体训练', <><p>MeterSim 渲染出带标签的水表，SimGen2 让它们看起来像摄像头拍的照片，同时六个 AI 智能体通过一个预约调度器轮流使用 GPU 和 Jetson 设备，借助 Tailscale 和 T3 Code 全天候运行。</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="MeterSim 里的九种水表设计" loading="lazy" /></>)}
          {chapter('03', '一块板子、一个外壳、一次 9 小时的回流焊', <><p>这块 4 层 KiCad PCB 带有电池管理、LoRa 和 PWM LED，我亲手组装，在显微镜下调试，再装进一个免工具的 3D 打印外壳里，配有水表转接件。</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="Prototype V2 电路板的 3D 渲染图" loading="lazy" /></>)}
          {cta('走一遍整个流程', '文章一步步跟着 DrumNet 运行一遍，还有 3D 电路板导览、ConfigKing 模拟器和完整报告。', '阅读全文', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader 私人电子书阅读器', ['个人项目'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">网页应用 · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · 自学</p>
          <p className="hp-rd-lead">一个小小的私人在线电子书阅读器，给几个朋友用，大家用同一个访问码登录。它会准确记住你读到哪里，显示还有谁在读，并记录每个人的进度。</p>
          {chapter('01', '一个记得你的书库', <><p>打开一本书时，它会直接跳回你上次的章节和滚动位置，这个位置是按比例存的，所以换了字号也还能对上，每个读者的颜色、字体和排版也都会保存。</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="阅读界面" loading="lazy" /></>)}
          {chapter('02', '一起阅读', <><p>你能看到谁在线，通过绿色圆环和章节号认出在读同一本书的朋友，还能给他们挥挥手或者发一条会自动消失的短消息。</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="在线状态和快捷消息" loading="lazy" /></>)}
          {chapter('03', '用 SQL 把关的内容限制', <p>成人章节直接在数据库查询里设限，所以对没有权限的读者来说，受限的文字根本不会离开服务器。同一章在不同读者眼里可以不一样，而 cal 模式会把它整个去掉。</p>)}
          {cta('看看完整的制作过程', '文章讲了在线状态、内容限制、条漫和技术栈。', '阅读全文', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA 智能家居系统', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA 智能家居系统</h2>
          <p className="hp-md-meta">3 个月 · 学校小组项目 · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">我们五人小组为一门可持续生活课程做的智能家居，拿了 A。四个 BeagleBone 节点向一台 SocketIO 服务器汇报，服务器上运行着一个实时 3D 仪表盘。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA 智能家居" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '四个节点，各司其职', <><p>四个节点分别负责室内环境、浴室、厨房（冰箱能耗和火灾警报）和防盗，每块 BeagleBone Black Wireless 都插着 MikroBUS 传感器模块。</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="厨房节点的硬件" loading="lazy" /></>)}
          {chapter('02', '一台服务器管所有节点', <><p>每个节点都连到一台 SocketIO 网页服务器，它托管着仪表盘，还能让所有节点同时响起火灾警报。</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="系统各部分是怎么连接的" loading="lazy" /></>)}
          {chapter('03', '实时 3D 仪表盘', <><p>仪表盘在一个 Spline 3D 房屋模型上显示实时数据，它的界面是我在 Figma 里设计的。</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="EMA 3D 仪表盘" loading="lazy" /></>)}
          {cta('试一试，或者读读文章', '这里有仪表盘的在线演示，也有完整的项目文章。', '在线演示', 'https://csdpdemo.chiambucket.com', { label: '阅读文章', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus 分配器', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus 分配器</h2>
          <p className="hp-md-meta">1 个月 · 第一个学校项目 · 3D 设计 · PyFirmata</p>
          <p className="hp-rd-lead">我的第一个学校项目，是一台由六个部件 3D 打印而成的糖浆分配器，每个部件第一次打印就装上了。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus 分配器" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '它能做什么', <><p>它能倒三种杯量，有人走近就会醒来，还有一扇舵机门和一颗大功率 LED 来照亮杯子。</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Onshape 里的 Pandus 模型" loading="lazy" /></>)}
          {chapter('02', '控制与元件', <><p>一块用 PyFirmata 驱动的 Arduino Uno R3 控制着舵机、LED、继电器板、按钮、直流泵和一个红外避障模块。</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Pandus 的流程图" loading="lazy" /></>)}
          {cta('完整的制作过程', '文章讲了零件、流程图和 Onshape 模型。', '阅读全文', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F 冷库安全系统', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F 概念</h2>
          <p className="hp-md-meta">冷库安全存储系统 · 4 人团队 · 工程课程 · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">我和队友为一门工程课设计的冷库安全系统。工厂里的步入式冷库可能会把在里面工作的人困住，所以 ELEC-F 会盯着门和室内，在寒冷变得危险之前拉响警报。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F 冷库安全系统" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '问题在哪', <><p>门闩故障、密封条结冰，或者只是一时没留意，都可能让工人被关在步入式冷库里，而在那里失温来得很快。ELEC-F 就是为了缩短这段时间，也让被困的人安心一点。</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="ELEC-F 冷库原型" loading="lazy" /></>)}
          {chapter('02', '它是怎么工作的', <><p>ToF 传感器判断门是开着还是关着，PIR 传感器检查里面还有没有人。如果门关上时有人在里面，计时器就会启动，时间一到，RGB 模块就会闪烁，蜂鸣器也会响起。</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="M5Stack 上 ELEC-F 的布防状态" loading="lazy" /></>)}
          {chapter('03', '基于 M5Stack 打造', <><p>两台 M5Stack Fire 控制器和一个 Mini Hub 把 ToF、PIR 和 RGB 模块连在一起，选它们是因为在冷库要求的零下温度里也能照常工作。</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="接好传感器的 M5Stack 控制器" loading="lazy" /></>)}
          {cta('看看完整的概念', '文章讲了调研、制作过程，还有一个互动演示。', '阅读全文', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli 概念', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli 概念</h2>
          <p className="hp-md-meta">概念 · 沟通技巧 · Blender 3D</p>
          <p className="hp-rd-lead">我为一个沟通技巧项目原创并提出的产品概念，用 Blender 做的 3D 场景来展示。</p>
          {chapter('01', '从想法到展示', <><p>这个作业讲的不只是要有想法，还要把想法讲清楚，所以我设计了这个概念，用 Blender 渲染出来，再做了一套演示文稿，清楚地讲给观众听。</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Kauli 概念渲染图" loading="lazy" /></>)}
          {soon('Kauli 概念', '渲染图和提案之后会有一篇完整的文章。')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['个人项目'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">个人 · 3D 设计 · 超轻 20 克</p>
          <p className="hp-rd-lead">我对热门的 ZeroMouse 的一次重新诠释，一个我从零设计的 20 克超轻游戏鼠标，想让自己在 FPS 游戏里玩得好一点。</p>
          {chapter('01', '一克一克地设计', <p>外壳的每个部分在建模时都在减重，又不能牺牲刚性，在握持的舒适度和减到 20 克左右的目标之间找平衡。</p>)}
          {soon('Series One Light', '模型和其中的取舍之后会有一篇完整的文章。')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Copy Board 电路板', ['个人项目'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">个人 · PCB 设计 · KiCAD · 1 周</p>
          <p className="hp-rd-lead">用 KiCAD 从零复刻的 NYP ATMega328 开发板，这样我在家里也能有一块自己的来用。</p>
          {chapter('01', '先逆向，再重建', <p>我根据学校开发板的原理图在 KiCAD 里把它复刻出来，因为有些零件已经停产，我就找了替代品，然后用这块板子第一次正经地尝试回流焊。</p>)}
          {soon('Copy Board', '找零件、布板和回流焊之后会有一篇完整的文章。')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('网页开发项目', ['学校项目'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">网页开发项目</h2>
          <p className="hp-md-meta">学校 · HTML &amp; CSS · 第一个网站</p>
          <p className="hp-rd-lead">我做的第一个功能完整的网站，用 HTML 和 CSS 写的，是网页开发课的期末作业。这个网站是我的第二次尝试。</p>
          {chapter('01', '一切的起点', <p>这是我第一次接触网页开发，也能看出我的作品从那时起进步了多少。</p>)}
          {soon('看看一切从哪里开始', '这个网站现在还在线。', { label: '在线演示', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft 实时地图', ['个人项目'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft 实时地图</h2>
          <p className="hp-md-meta">个人 · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">一台跑在 homelab 上的自托管 Minecraft 服务器，配有多人世界的实时网页地图，任何人都能实时拖动浏览。</p>
          {chapter('01', '服务器和地图', <p>一台 Paper 服务器跑在 Docker 里，Dynmap 插件会生成一张实时的互动地图，随着玩家探索和建造不断更新。</p>)}
          {soon('实时探索这个世界', '实时地图对所有人开放。', { label: '打开实时地图', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
