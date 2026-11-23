import type { RecsCopy } from './en';

/* The recommendation cards in Simplified Chinese: a copy of en.ts with the words translated. */
const zh: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: '一个用电池供电的水表读数器：ESP32-S3 上一套 693K 参数的 DrumNet 流程读出字轮，再通过 LoRaWAN 上报，装在我自己设计的 KiCad PCB 和 3D 打印外壳里。',
    alt: 'OCR Reader 与 DrumNet，一套水表 OCR 方案',
  },
  'proj-june': {
    title: 'Project June',
    blurb: '一辆 5G 遥控车，带三路实时摄像头、GPS、激光笔和七个传感器，用网页控制台来驾驶。',
    alt: 'Project June 遥控车',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: '一只住在 M5Stack Tab5 上的桌面宠物，它的大脑是我服务器上的 DeepSeek Harness，所以它能操作浏览器、自己做小应用，还能盯着我的其他智能体。',
    alt: 'Pip，一只青色的桌面宠物，在 M5Stack Tab5 上',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: '一台临时拼出来的 LiDAR：Stack-chan 头上装了四个测距传感器，由舵机带着扫过整个房间，再用它的摄像头给 3D 扫描上色，你可以在浏览器里随意查看。',
    alt: '头上装着四个 Unit ToF4M 测距传感器的 Stack-chan',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: '一个只限受邀用户的私人在线阅读器，有实时在线状态、每位读者各自的阅读进度、由 SQL 把关的内容限制、条漫和共享的阅读统计，用 Next.js 和 Supabase 搭建。',
    alt: 'BeadReader 私人阅读器',
  },
  'proj-pantry': {
    title: '食品保质期追踪器',
    blurb: '一个贴在冰箱门上的保质期追踪器，基于 M5Stack CoreS3 SE 和 QRCode 模块：扫一下条码、选好到期时间，就能看到该先吃什么，还会在 Home Assistant 里提醒你。',
    alt: '食品保质期追踪器：叠在 QRCode 模块上的 CoreS3 SE',
  },
  'proj-ruler': {
    title: '滚轮尺',
    blurb: '用 M5Stack AtomS3R 和 Unit Scroll 做的电子尺：先用 10 厘米校准一次，然后按下滚轮沿着东西滚过去，屏幕就会显示它有多长。',
    alt: '滚轮尺：插着 Unit Scroll 的 AtomS3R',
  },
  'proj-cadmouse': {
    title: '3D CAD 鼠标',
    blurb: '把 M5Stack Capsule 变成 Onshape 用的无线 3D 鼠标：点一下按钮，在手里转动它，屏幕上的模型就跟着转。',
    alt: '用作 3D 鼠标的 M5Stack Capsule v1.1',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: '两台 ESP32 手持设备，用 LoRa 发文字，用 ESP-NOW 实现粗糙的双向语音，用的是我在 KiCAD 里设计的第一块 PCB，外壳在 Onshape 里建模。',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: '一个跑在 ESP32 上的声控智能房间助手，通过 OpenRouter 调用 Whisper 和 DeepSeek 大模型，把语音变成一条经 MQTT 发送的 JSON 指令。',
    alt: 'LUMEN 语音助手',
  },
  'proj-ema': {
    title: 'EMA 智能家居',
    blurb: '一个拿了 A 的团队智能家居项目，四个 BeagleBone Black 节点向一台 SocketIO 服务器汇报，配有实时的 3D Spline 仪表盘。',
    alt: 'EMA 智能家居系统',
  },
  'proj-pandus': {
    title: 'Pandus 分配器',
    blurb: '我的第一个学校项目，一台由六个 3D 打印部件组成的糖浆分配器，用 Arduino Uno 和 PyFirmata 控制。',
    alt: 'Pandus 分配器',
  },
  'proj-elecf': {
    title: 'ELEC-F 概念',
    blurb: '一个基于 M5Stack 的冷库报警器。如果门关上时里面还有人，计时器就会开始倒数，时间一到警报就会响。',
    alt: 'ELEC-F 概念',
  },
  'proj-kauli': {
    title: 'Kauli 概念',
    blurb: '我为一门沟通技巧课提出的产品概念，用 Blender 渲染。',
    alt: 'Kauli 概念',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: '一个基于 ZeroMouse 的超轻游戏鼠标外壳，我的目标是把它减到大约 20 克。',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: '我用 KiCAD 复刻了学校的开发板，因为原版没法带回家。',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: '网页开发项目',
    blurb: '我的第一个功能完整的网站，用 HTML 和 CSS 做成，是网页开发课的期末作业。',
    alt: '网页开发项目',
  },
  'proj-mc': {
    title: 'Minecraft 实时地图',
    blurb: '一台跑在我 homelab 的 Docker 里的 Paper 服务器，配有世界的实时 Dynmap。',
    alt: 'Minecraft 实时地图',
  },
};
export default zh;
