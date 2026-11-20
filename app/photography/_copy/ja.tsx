import type { PhotographyCopy } from './en';

const ja: PhotographyCopy = {
  meta: {
    title: '写真 | Braven Chiam',
    description:
      'Braven Chiam がヨーロッパ、中国、ニュージーランド、香港で撮った写真のアルバムと、21:9 のウルトラワイドの写真、そして編集に使っているソフトウェア。',
    twitterDescription: 'Braven Chiam がヨーロッパ、中国、ニュージーランド、香港などで撮った写真のアルバム。',
    ldName: 'Braven Chiam の写真',
    ldDescription: 'Braven Chiam がヨーロッパ、中国、ニュージーランド、香港で撮った写真のアルバムと、21:9 のウルトラワイドの写真。',
  },
  hero: {
    kicker: '写真',
    title: <>写真と<em>デザイン</em></>,
    sub: 'ヨーロッパ、中国、ニュージーランド、香港で撮ったアルバムと、21:9 のウルトラワイドの写真をまとめています。どれも自宅のホームラボでホストしている Lychee ギャラリーから配信しています。まずは編集に使っているソフトを紹介して、そのあとにアルバムが続きます。',
    allPhotos: 'すべての写真',
    youtube: 'YouTube の動画',
  },
  tools: {
    eyebrow: 'ソフトウェア',
    title: '編集に使うもの',
    cardLabel: '{name} の詳細',
    iconAlt: '{name} のアイコン',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: '動画編集は Premiere Pro で覚えましたが、クラッシュが多すぎたので DaVinci Resolve に乗り換えました。',
        add: 'Photoshop と一緒に覚えましたが、今はもう使っていません。',
        chips: ['動画編集', 'タイムライン', '原点'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'ロゴや、SVG としてきれいに拡大縮小できる必要があるものには Illustrator を使います。ただ、Photoshop ほど頻繁ではありません。',
        add: 'アイコンやほかのベクターアートもこれで描いています。',
        chips: ['ロゴ', 'ベクター / SVG', 'アイコン'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: '写真ではなく図形で組み立てるデザインには Figma を使います。なので、僕の UI やポスターのほとんどは、ここでフレームとして生まれます。',
        add: 'コードで作ったり印刷に出したりする前に、ここで UI のプロトタイプを作り、ポスターをレイアウトしています。',
        chips: ['UI デザイン', 'プロトタイプ', 'レイアウト'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: '2019年からのメインツールです。学校のメディア部でちゃんとしたトレーニングを受けていて、写真のレタッチやポスターのレイアウトに使っています。',
        add: 'レタッチとポスターのほかに、合成にも使っています。',
        chips: ['写真編集', 'ポスター', '合成'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'カット、カラー、書き出しがひとつのソフトで全部できるので、動画は Resolve で編集しています。投稿することはあまりありませんが、これから増やす予定です。',
        add: 'クラッシュばかりしていた Premiere Pro の代わりになりました。',
        chips: ['動画編集', 'カラーグレーディング', '作品映像'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: '写真のほとんどは Lightroom で仕上げています。そのままでは使えない RAW ファイルから、ハイライトやシャドウ、ディテールを取り戻しています。',
        add: '下のアルバムの写真が最後に通るソフトは、たいていこれです。',
        chips: ['写真編集', 'カラー', 'RAW 現像'],
      },
    },
  },
  figma: {
    label: 'Figma ボード',
    open: 'Figma で開く',
    openLabel: 'ボードを Figma で開く',
    frameTitle: 'Figma ボード：Random board',
    caption: 'コードで作ったり印刷したりする前に、UI やポスターをレイアウトしている作業中の Figma ファイルです。',
  },
  galleries: {
    eyebrow: 'ギャラリー',
    title: 'アルバム',
    open: 'アルバムを開く',
    openLabel: '{title} のギャラリーを開く',
    showAll: 'すべての写真を見る',
    albums: {
      highlight: 'ハイライト',
      europe: 'ヨーロッパ',
      '21by9': '21:9',
      china: '中国',
      zealand: 'ニュージーランド',
      hongkong: '香港',
      general: 'その他',
    },
  },
};
export default ja;
