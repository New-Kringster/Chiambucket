import type { PhotographyCopy } from './en';

const zh: PhotographyCopy = {
  meta: {
    title: '摄影 | Braven Chiam',
    description:
      'Braven Chiam 在欧洲、中国、新西兰和香港拍的相册，还有一组 21:9 超宽画幅照片，以及他平时用来修图剪片的软件。',
    twitterDescription: 'Braven Chiam 在欧洲、中国、新西兰、香港等地拍的相册。',
    ldName: 'Braven Chiam 的摄影作品',
    ldDescription: 'Braven Chiam 在欧洲、中国、新西兰和香港拍的相册，还有一组 21:9 超宽画幅照片。',
  },
  hero: {
    kicker: '摄影',
    title: <>摄影<em>与设计</em></>,
    sub: '这些是我在欧洲、中国、新西兰和香港拍的相册，还有一组 21:9 的超宽画幅照片，全都放在我 homelab 上自己托管的 Lychee 相册里。先介绍我用来修图剪片的软件，相册就在后面。',
    allPhotos: '全部照片',
    youtube: 'YouTube 视频',
  },
  tools: {
    eyebrow: '软件',
    title: '我的编辑工具',
    cardLabel: '{name} 详情',
    iconAlt: '{name} 图标',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: '我是用 Premiere Pro 学会剪视频的，可它老是崩溃，所以我换到了 DaVinci Resolve。',
        add: '我是和 Photoshop 一起学的它，现在已经不用了。',
        chips: ['视频剪辑', '时间线', '起点'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: '做 logo 和任何需要以 SVG 格式清晰缩放的东西，我都用 Illustrator，不过用得没有 Photoshop 多。',
        add: '我也用它画图标和其他矢量图。',
        chips: ['Logo', '矢量 / SVG', '图标'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: '用形状而不是照片搭出来的设计，我都在 Figma 里做，所以我大部分的界面和海报都是从这里的画框开始的。',
        add: '界面原型和海报排版我都先在这里做好，然后再写成代码或者送去打印。',
        chips: ['UI 设计', '原型', '排版'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: '从 2019 年起就是我的主力工具。我在学校的媒体社团接受过正式培训，平时用它修照片和排海报。',
        add: '除了修图和做海报，我也用它做合成。',
        chips: ['修图', '海报', '合成'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: '我用 Resolve 剪视频，因为剪辑、调色和导出都能在一个软件里搞定。我很少发视频，不过之后还会有更多哦。',
        add: '它替代了老是崩溃的 Premiere Pro。',
        chips: ['视频剪辑', '调色', '项目影片'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: '我大部分照片都是在 Lightroom 里完成的，在这里我能从 RAW 文件里救回高光、阴影和细节，不然那些照片根本没法用。',
        add: '下面相册里的照片，最后经过的通常就是它。',
        chips: ['修图', '色彩', 'RAW 流程'],
      },
    },
  },
  figma: {
    label: 'Figma 画板',
    open: '在 Figma 打开',
    openLabel: '在 Figma 里打开这个画板',
    frameTitle: 'Figma 画板：Random board',
    caption: '一个正在用的 Figma 文件，我在搭建或打印之前，会先在这里排好界面和海报。',
  },
  galleries: {
    eyebrow: '图库',
    title: '相册',
    open: '打开相册',
    openLabel: '打开 {title} 相册',
    showAll: '显示全部照片',
    albums: {
      highlight: '精选',
      europe: '欧洲',
      '21by9': '21:9',
      china: '中国',
      zealand: '新西兰',
      hongkong: '香港',
      general: '综合',
    },
  },
};
export default zh;
