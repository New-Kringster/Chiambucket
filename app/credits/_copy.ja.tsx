import type { CreditsCopy } from './_copy';

const ja: CreditsCopy = {
  meta: {
    title: 'クレジット | Braven Chiam',
    description:
      'chiambucket.com の奥付です。Claude と Next.js で作り、Vercel でホストし、写真はセルフホストの Lychee ギャラリーで公開しています。',
    ogDescription: 'このサイトの作り方とホスティング、そして支えているツールについて。',
    twitterDescription: 'このサイトは Claude で作り、Vercel でホストしています。',
  },
  kicker: 'クレジット',
  title: <>クレジットと<em>コンテンツ</em></>,
  sub: 'このページでは、サイトの作り方とホスティング、そして支えているツールを紹介します。',
  claude: {
    eyebrow: 'デザインと制作',
    title: 'Claude',
    body: <>このサイトは、<a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a> の AI モデル Claude と一緒にデザインして作りました。Claude はレイアウトを手伝い、コードの多くを書き、文章を磨き、デバッグにも付き合ってくれました。何を残して何を変えるか、どんな見た目にするかは僕が決めています。</>,
  },
  hosting: {
    eyebrow: 'ホスティング',
    title: 'Vercel',
    body: [
      <>サイトは <a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> でホストしていて、push するたびに新しいバージョンがデプロイされます。訪問数は Vercel Analytics、ページの速さは Speed Insights で測っています。</>,
      '写真ギャラリーやほかのセルフホストのサービスは今も自宅のホームラボで動かしていますが、公開サイトは Vercel に置いています。マネージドホスティングのほうが速くて安定しているからです。',
    ],
  },
  tools: {
    eyebrow: 'ツールとコンテンツ',
    title: 'ソフトウェアと書体',
    list: [
      <><b>Next.js と React</b>、TypeScript で書いています</>,
      <><b>Framer Motion</b>、ホームラボのページとプロジェクトのデモに</>,
      <><b>Lychee</b>、写真ページ用に自分でホストしているギャラリー</>,
      <><b>Oswald、Inter、DM Sans</b>、メインの書体</>,
      <><b>Canvas</b>、どのページの背景にもある空や雲、草、海の絵に。一度だけ描いて、動きは CSS だけでつけています</>,
      <><b>インライン SVG</b>、アイコンに</>,
    ],
    note: 'このサイトの写真、文章、プロジェクトはすべて僕自身のものです。',
  },
};
export default ja;
