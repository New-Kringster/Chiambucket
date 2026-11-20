import type { ArchiveCopy } from './en';

const zh: ArchiveCopy = {
  meta: {
    title: 'chiambucket.com 的两年 | Braven Chiam',
    description:
      '从 2024 年 9 月到现在，chiambucket.com 用过的每一版设计，从 WordPress 网站到手绘风格的滚动故事，每个旧版本都有截图和一份能用的副本。',
    ogTitle: 'chiambucket.com 的两年',
    ogDescription: '从 2024 年 9 月起的八版设计，每个旧版本都有一份能用的副本。',
  },
  ldName: 'chiambucket.com 的两年',
  ldItem: 'v{n}：{name}（{when}）',

  title: 'chiambucket.com 的两年',
  lede:
    '它一开始只是一个 WordPress 页面，我在上面分享一些自托管服务的链接，后来慢慢变成了我的个人博客和作品集。经历了三次迁移和八次改版，这是我网站迄今为止最大的一次改版。在 Claude 的帮助下，我把每一次大改版都归档到了这一页，你可以打开其中任何一个，看看 chiambucket.com 以前是什么样子。',
  stripLabel: '八个版本，每个的宽度对应它上线的时长',
  segLabel: 'v{n}，{name}，{when}',
  today: '今天',

  srName: 'v{n}：',
  builtWith: '用 {built} 搭建',
  backHome: '回到首页',
  open: '打开 v{n}',

  fact: {
    kicker: '冷知识',
    title: '为什么叫 chiambucket.com？',
    text:
      'Chiambucket 最早是我一个好朋友给我起的外号。我在给新的落地页找域名时，chiambucket.com 刚好是最便宜的那个，所以我就买下了它，一直用到现在。',
    extra: <><b>再来一个冷知识：</b>我还有 <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a> 这个域名，它会跳转到这个网站哦！</>,
  },

  versions: {
    1: {
      name: '第一个 WordPress 网站',
      when: '2024 年 9 月至 10 月',
      built: 'WordPress 和 Elementor',
      body: '我的第一个 chiambucket.com 是一个用 Elementor 拼起来的 WordPress 网站，跑在我家里的服务器上。整个页面都围绕着它的 Quick Links 按钮，因为每次朋友问我要自托管服务的链接，我就把他们带到这个页面。再往下是一个轮播展示我的照片、我的 homelab 机柜，还有一排联系方式链接。',
      desktopAlt: '一个藏青色页面，上面有白色的“Welcome To Chiambucket!”和一个蓝色的 Quick Links 按钮',
      phoneAlt: '手机上同样的藏青色欢迎页',
      detailAlt: '一个标题为“A little bit about myself”的白色区块，下面是风景照片轮播',
    },
    2: {
      name: 'WordPress 改版',
      when: '2024 年 11 月至 2025 年春',
      built: 'WordPress 和 Elementor',
      body: '两个月后，我重做了页眉和菜单，还加了一个 About Me 页面。标题在“Welcome To My”后面轮流切换几句话，下面的页面有一个滑块，对比我一张照片修图前后的样子，旁边是一张 homelab 机柜的竖幅照片。',
      desktopAlt: '一个藏青色页面，有圆角菜单栏，标题“Welcome To My”下面是一个蓝色的 Quick Links 按钮',
      phoneAlt: '手机上改版后的藏青色落地页',
      detailAlt: '一个灰色区块，“My Photos”下面是修图前后对比滑块，“My Homelab Journey”下面是 homelab 机柜',
    },
    3: {
      name: '手写的黑色网站',
      when: '2025 年',
      built: 'HTML、CSS 和 jQuery',
      body: '2025 年，我离开了 WordPress，整个网站都自己写。它是黑色的，标题用 Oswald 字体，标题后面有一束聚光灯打在一个粒子球上，那是一个 Spline 3D 场景，看起来很棒，但让整个网站都卡了起来。我的核心技能旁边放着一幅《咒术回战》里宿傩的画，那是我很喜欢的角色。To BucketCentral 按钮本来是要通往一个把我所有自托管服务集中在一起的页面，可我还没做那个页面就放弃了。',
      desktopAlt: '一个黑色页面，“Welcome To Chiambucket!”被一束聚光灯照亮，后面是一个粒子球',
      phoneAlt: '手机上的黑色聚光灯欢迎页',
      detailAlt: '深色卡片上写着“Hi I am Braven, I shape designs And stir up Creations!”，旁边是《咒术回战》里宿傩的画，下面是 My Core Skills',
    },
    4: {
      name: '渐变首屏',
      when: '2026 年 1 月至 6 月',
      built: 'HTML、CSS 和 jQuery',
      body: '1 月我又改版了一次，还是手写的，主要是为了解决卡顿，也想试试我很喜欢的便当格布局。首页顶部变成了薰衣草紫到紫罗兰色的渐变，写着“Creating with Intention.”，下面的区块变成了一格格深色卡片，放着我的 CAD 和 PCB 工具、我的设计思路，还有一张尘土飞扬的 Project June 渲染图。',
      desktopAlt: '标题“Creating with Intention.”后面是薰衣草紫到紫罗兰色的渐变',
      phoneAlt: '手机上的渐变首屏',
      detailAlt: '3D CAD 和 PCB 设计以及“A Design first Engineering approach”的深色卡片，下面是一辆扬起尘土的遥控车',
    },
    5: {
      name: 'Next.js 重建',
      when: '2026 年 6 月至 7 月',
      built: 'Next.js、React 和 Vercel',
      body: '6 月，我第一次用 Claude 来设计网站，用 Next.js 重建了它，并搬到了 Vercel 上，速度和稳定性都更好。每个页面都有了自己的强调色，首页在蓝色光晕上写着“Creating with Meaning.”，还有一个新的项目库，可以搜索和筛选我所有的项目，点开每张卡片都能看到一段简短的摘要。',
      desktopAlt: '一个黑色页面，蓝色光晕上写着“Creating with Meaning.”，还有两个按钮',
      phoneAlt: '手机上的 Next.js 首页',
      detailAlt: '“All projects”项目库，带筛选标签，还有 Project June、LoRA Messenger 和 LUMEN 的卡片',
    },
    6: {
      name: 'Dark Sensory',
      when: '2026 年 7 月至 10 月',
      built: 'Next.js、WebGL 和 Vercel',
      body: '7 月我做了一次小一点的改动，布局保持不变，只换了配色。蓝紫色调已经开始看起来和所有 AI 做的网站一个样，所以大部分页面都换成了温暖的琥珀色，感觉更高级一些。',
      desktopAlt: '一个深琥珀色页面，用高大的大写字母写着“CREATING WITH MEANING.”，还有一个发光的 Get in touch 按钮',
      phoneAlt: '手机上琥珀色的 Dark Sensory 首页',
      detailAlt: '温暖琥珀色光线下，视频、界面设计、摄影和 PowerPoint 作品的磨砂深色卡片',
    },
    7: {
      name: '自然主题',
      when: '2026 年 10 月 30 日至 11 月 18 日',
      built: 'Next.js 和 Vercel',
      body: '10 月底，我给网站换上了自然主题。这次改动比上一次大，但仍然是循序渐进的，因为内容和布局都没变，只是每个页面都搬进了一幅手绘风景里，各有各的时辰，网站也多了一条紧凑的菜单栏。',
      desktopAlt: '一幅灰绿色的清晨画面，左边是一棵石松，“Braven Chiam”是透明的玻璃字',
      phoneAlt: '手机上的手绘清晨首页',
      detailAlt: '手绘天空上的 Projects 标题，下面是 OCR Meter 旗舰卡片',
    },
    8: {
      name: '自然风改版',
      when: '2026 年 11 月 18 日至今',
      built: 'Next.js、GSAP 和 WebGL',
      body: '这就是我一直在做的全面改版，也是自 v5 以来第一次不只改外观的改版，从头到尾都有新的动画和新的设计。首页保留了那幅画，但会随着你滚动讲一个故事：清晨化成颗粒散开，然后 OCR Reader、Project June、Pip 和 BeadReader 各有一章，后面才是我的其他项目、我的 homelab 和我的照片。',
      desktopAlt: '现在的首页：手绘的清晨，“Braven Chiam”是透明的玻璃字',
      phoneAlt: '手机上现在的首页',
      detailAlt: '现在首页上 Project June 的那一章，三路实时摄像头画面旁边是标题“Three live feeds from three phones”',
    },
  },
};
export default zh;
