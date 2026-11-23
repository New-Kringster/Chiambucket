import type { ProjectJuneCopy } from './en';

const zh: ProjectJuneCopy = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: '一辆我用三周做出来的 5G 遥控车，一块 ESP32-S3 和三部手机把三路实时摄像头画面、GPS 和传感器读数传到一个网页控制台，我就在控制台上开它。',
    ogDescription: '一辆 5G 遥控车，带三路实时摄像头画面、GPS、传感器和 MQTT 遥测。',
  },
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June，一辆 5G 遥控车',
    back: '返回项目',
    tag: '个人项目',
    title: <>Project <em>June</em></>,
    lead: '我做这辆 5G 遥控车，是因为我想要一台火星车。它会把三路实时摄像头画面、GPS 和传感器读数（温度、湿度、气压和亮度）传到一个网页控制台，我就在控制台上开它。',
    builtWith: '用到的工具',
    links: ['GitHub', '看制作视频'],
  },
  chapters: '章节',
  rail: {
    Demo: '演示', ProjectJune: '概览', OnboardSys: '车上系统', Ultras: '超声波传感器', Laser: '激光',
    Gps: 'GPS', IMU: '10 轴 IMU', Lightsensor: '光照传感器', Dht11: 'DHT11', TechArch: '系统架构',
    Livestr: '视频', ctrlntelm: '控制与遥测', Software: '软件', softD: '控制台设计', Driving: '开起来',
  },
  demo: { h: '演示', video: 'Project June 演示视频' },
  overview: {
    h: '概览',
    p: '我给 Project June 计划了两周，结果花了三周。做得很赶，有很多地方我现在会换个做法，但它仍然是我做过最有野心的东西之一。',
    alt: '最初的 Project June 遥控车',
    caption: 'Project June 的第一张照片',
  },
  onboard: {
    h: '车上系统',
    p: '一块 ESP32-S3 负责读取传感器、驱动电机和发送遥测数据，车上的三部手机则给遥控车提供 5G 热点，以及前、左、右三个摄像头视角。直流电机通过我自己做的 MOSFET 电机驱动来运转，一个我用三个 2S 电池组拼成的 2S3P 锂离子电池组用来延长续航，而一个充电宝给 ESP32 和手机供电。',
    alt: 'Project June 的零件图：三部手机、ESP32-S3、传感器、电机驱动、充电宝和电池组',
  },
  sensors: {
    Ultras: {
      h: '超声波传感器',
      p: '超声波传感器装在车尾，所以它能告诉我车后面的障碍物有多远。',
      alt: '超声波测距传感器和它在控制台上的读数',
    },
    Laser: {
      h: '激光',
      p: '车头的一个 3G 舵机上装着一颗激光二极管，我可以在控制台上把它往两边各转最多 45°。',
      alt: '舵机上的激光二极管和它在控制台上的控制',
    },
    Gps: {
      h: 'GPS',
      p: '一个 Neo8M 模块提供遥控车的实时位置，显示在控制台的地图上。',
      alt: 'Neo8M GPS 模块和控制台地图',
    },
    IMU: {
      h: '10 轴 IMU',
      p: '一块板子就能给我加速度计、陀螺仪和气压计的读数，不过它的磁力计我一直没用上。',
      alt: '10 轴 IMU 板和它在控制台上的读数',
    },
    Lightsensor: {
      h: '光照传感器',
      p: '光照传感器是一个 TEMT6000，因为我没办法校准它，控制台就把亮度分成四档显示：Dark、Ambient、Bright 和 VBright。',
      alt: 'TEMT6000 光照传感器和它在控制台上的读数',
    },
    Dht11: {
      h: 'DHT11',
      p: 'DHT11 测量环境的温度和湿度。',
      alt: 'DHT11 温湿度传感器和它在控制台上的读数',
    },
  },
  arch: {
    h: '系统架构',
    p: '这张图展示了系统的三个部分，也就是遥控车、服务器和客户端，以及它们之间跑着什么。',
    alt: '架构图：带传感器和三部手机的遥控车，一台运行 Mosquitto、Node.js Socket.IO 服务器和 CoTURN 的服务器，还有接着 Xbox 手柄的客户端控制台',
  },
  video: {
    h: '视频',
    p1: '每部手机都把自己的摄像头作为一路单独的 WebRTC 流发出去，一共三路，经过一台 TURN 服务器中转，所以视频在移动数据下也能用。',
    p2: '下面是重新搭出来的控制台，用的是白天和夜间两次实测的画面，你可以选信号路径上的某一站或者某个摄像头，凑近看看。',
    systemAlt: '实时视频系统的示意图',
    routingAlt: 'WebRTC 流路由的示意图',
  },
  console: {
    tag: '驾驶控制台',
    rebuilt: { day: '用白天的实测重建', night: '用夜间的实测重建' },
    toggleAria: '选择白天或夜间的实测',
    day: '白天',
    night: '夜间',
    signalPath: '信号路径',
    trackAria: '从手柄到遥控车的信号路径',
    nodes: {
      pad: {
        label: 'Xbox 手柄',
        sub: '蓝牙连到控制台',
        blurb: '手柄通过蓝牙和网页控制台配对，控制台把摇杆和扳机的输入转成移动指令，再通过 MQTT 发布出去。',
      },
      server: {
        label: '服务器',
        sub: 'MQTT、信令、TURN',
        blurb: 'Mosquitto 负责转发指令和遥测数据，一台 Node.js Socket.IO 服务器提供控制台页面并处理 WebRTC 信令，CoTURN 负责中转视频，让它在移动数据下也能用。',
      },
      phones: {
        label: '三部手机',
        sub: '5G 热点和摄像头',
        blurb: '手机 1 是主 5G 热点和前摄像头，手机 2 是第二个热点和左摄像头，手机 3 连上热点当右摄像头，每部手机都把自己的画面作为一路 WebRTC 流发出去。',
      },
      rover: {
        label: 'ESP32-S3',
        sub: '在车上',
        blurb: '它通过 Wi-Fi 连上手机热点，通过 MOSFET 驱动来驱动电机，再把传感器数据分成三个数据包，以大约 10 Hz 通过 MQTT 发回去。',
      },
    },
    flow: { out: '指令', back: '视频和遥测' },
    telemetry: '遥测',
    metrics: {
      lat: '纬度', lon: '经度', speed: '速度', alt: '海拔',
      temp: '温度', hum: '湿度', sats: '卫星',
    },
    brightness: '亮度',
    gpsFix: 'GPS 定位',
    cameras: '摄像头画面',
    camsAria: '选择主摄像头',
    live: '直播',
    camAria: { day: '{label}摄像头，白天实测', night: '{label}摄像头，夜间实测' },
    feeds: {
      left: { label: '左', phone: '手机 2', note: '手机 2 是第二个热点和左摄像头。', show: '显示左摄像头（手机 2）' },
      center: { label: '前', phone: '手机 1', note: '手机 1 是主 5G 热点和前摄像头。', show: '显示前摄像头（手机 1）' },
      right: { label: '右', phone: '手机 3', note: '手机 3 连上热点，当右摄像头。', show: '显示右摄像头（手机 3）' },
    },
  },
  control: {
    h: '控制与遥测',
    p1: 'ESP32 把传感器数据发布到一个客户端订阅的 MQTT topic 上，客户端再通过第二个 topic 把移动和其他指令发回 ESP32。',
    alt1: '控制与遥测系统的示意图',
    packetsH: '三个数据包',
    p2: '我没办法把所有传感器数据塞进一条 MQTT 消息里，原因到现在也还没搞清楚，所以它们分成三个单独的数据包，以大约 10 Hz 发出去。',
    alt2: '三个遥测数据包的示意图',
  },
  software: {
    h: '软件',
    p: '这是代码的简化流程图。',
    alts: ['软件流程图，第 1 部分', '软件流程图，第 2 部分'],
  },
  design: {
    h: '控制台设计',
    p: '控制台是我在 Figma 里设计的。',
    embed: 'Figma 里的 Project June 控制台设计',
    splineH: 'Spline 3D',
    splineP: '控制台里的 3D 遥控车是一个 Spline 模型，我把手柄往前推，它就转到前进视角，往后拉就转到倒车视角。',
    modelAlt: 'Spline 3D 遥控车模型',
    modelCaption: 'Spline 模型',
    viewCaption: '控制台里的视角切换',
  },
  driving: {
    h: '开起来',
    p: '视频是从超过 8 公里外传过来的，要经过系统的每一个部分，所以从按下手柄到在实时画面里看到车动，大约有一秒的延迟。画面也不是一直都很稳定，有时候开起来挺难的。',
    repo: {
      title: 'GitHub 上的 Project June',
      text: '仓库里有控制台、WebRTC 视频、MQTT 遥测和 ESP32 固件。',
      button: '在 GitHub 上看代码',
    },
  },
};

export default zh;
