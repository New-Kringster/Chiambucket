import type { CreditsCopy } from './_copy';

const zh: CreditsCopy = {
  meta: {
    title: '致谢 | Braven Chiam',
    description:
      'chiambucket.com 的版本说明：网站用 Claude 和 Next.js 打造，托管在 Vercel 上，照片放在我自己托管的 Lychee 相册里。',
    ogDescription: '这个网站是怎么搭建和托管的，背后又用了哪些工具。',
    twitterDescription: '这个网站用 Claude 打造，托管在 Vercel 上。',
  },
  kicker: '致谢',
  title: <>致谢与<em>内容</em></>,
  sub: '这一页讲的是这个网站怎么搭建、怎么托管，以及背后用了哪些工具。',
  claude: {
    eyebrow: '设计与开发',
    title: 'Claude',
    body: <>这个网站是我和 Claude 一起设计、搭建的，Claude 是 <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a> 推出的 AI 模型。Claude 帮我做了排版，写了大部分代码，润色了文字，也帮我调试，而留下什么、改掉什么、长什么样，都由我来决定。</>,
  },
  hosting: {
    eyebrow: '托管',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> 负责托管这个网站，我每推送一次，它就部署一个新版本。Vercel Analytics 和 Speed Insights 用来统计访问量和测量页面速度。</>,
      '我的 homelab 仍然运行着相册和我其他自托管的服务，不过公开的网站放在 Vercel 上，因为托管服务能让它更快、更稳定。',
    ],
  },
  tools: {
    eyebrow: '工具与内容',
    title: '软件与字体',
    list: [
      <><b>Next.js 和 React</b>，用 TypeScript 编写</>,
      <><b>Framer Motion</b>，用在 homelab 页面和项目演示里</>,
      <><b>Lychee</b>，我为摄影页面自己托管的相册</>,
      <><b>Oswald、Inter 和 DM Sans</b>，网站的主要字体</>,
      <><b>Canvas</b>，用来画每个页面背后的天空、云朵、草地和大海，只画一次，之后只用 CSS 让它们动起来</>,
      <><b>内联 SVG</b>，用来做图标</>,
    ],
    note: '这个网站上的照片、文字和项目作品都是我自己的。',
  },
};
export default zh;
