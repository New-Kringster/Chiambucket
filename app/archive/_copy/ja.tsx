import type { ArchiveCopy } from './en';

const ja: ArchiveCopy = {
  meta: {
    title: 'chiambucket.com の 2 年間 | Braven Chiam',
    description:
      '2024年9月から chiambucket.com がたどってきたすべてのデザイン。WordPress のサイトから、絵の中をスクロールするストーリーまで、スクリーンショットと、実際に動く旧バージョンのコピー付きです。',
    ogTitle: 'chiambucket.com の 2 年間',
    ogDescription: '2024年9月から 8 つのデザイン。どの旧バージョンも、実際に動くコピーで見られます。',
  },
  ldName: 'chiambucket.com の 2 年間',
  ldItem: 'v{n}：{name}（{when}）',

  title: 'chiambucket.com の 2 年間',
  lede:
    '始まりは、セルフホストしているサービスへのリンクをいくつか載せた WordPress のページでした。それが今では、僕の個人ブログ兼ポートフォリオになっています。3 回の移行と 8 回のリデザインを経て、今回が僕のサイトでいちばん大きなリデザインです。Claude の力を借りて、これまでの大きなデザイン変更をすべてこのページにアーカイブしました。どれでも開いて、昔の chiambucket.com がどんな見た目だったか見られますよ。',
  stripLabel: '8 つのバージョン。幅はそれぞれ公開されていた期間の長さです',
  segLabel: 'v{n}、{name}、{when}',
  today: '現在',

  srName: 'v{n}：',
  builtWith: '使ったもの：{built}',
  backHome: 'ホームへ戻る',
  open: 'v{n} を開く',

  fact: {
    kicker: '豆知識',
    title: 'なぜ chiambucket.com？',
    text:
      'Chiambucket は、仲のいい友だちの一人がつけてくれたあだ名から始まりました。新しいランディングページ用のドメインを探していたとき、たまたま chiambucket.com がいちばん安かったので、それに決めて今もずっと使っています。',
    extra: <><b>おまけの豆知識：</b><a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a> も持っていて、このサイトにリダイレクトされます！</>,
  },

  versions: {
    1: {
      name: '最初の WordPress サイト',
      when: '2024年9月〜10月',
      built: 'WordPress と Elementor',
      body: '最初の chiambucket.com は、Elementor で組んで自宅のサーバーで動かしていた WordPress のサイトでした。中心にあったのは Quick Links ボタンです。友だちにセルフホストのサービスのリンクを聞かれるたびに、このページを送っていたからです。その下には、写真のカルーセル、ホームラボのラック、連絡先リンクの帯がありました。',
      desktopAlt: '白い「Welcome To Chiambucket!」と青い Quick Links ボタンがあるネイビーのページ',
      phoneAlt: 'スマホで見た同じネイビーのウェルカムページ',
      detailAlt: '「A little bit about myself」という見出しの白いセクションと、その下の風景写真のカルーセル',
    },
    2: {
      name: 'WordPress のリニューアル',
      when: '2024年11月〜2025年春',
      built: 'WordPress と Elementor',
      body: '2 か月後、ヘッダーとメニューを作り直して About Me のページを加えました。見出しは「Welcome To My」のあとにいくつかのフレーズが切り替わり、その下では僕の写真の編集前と編集後を比べられるスライダーが、ホームラボのラックの縦長の写真と並んでいました。',
      desktopAlt: '角の丸いメニューバーと「Welcome To My」の見出し、その下に青い Quick Links ボタンがあるネイビーのページ',
      phoneAlt: 'スマホで見たリニューアル後のネイビーのランディングページ',
      detailAlt: '「My Photos」の下の編集前後の写真スライダーと、「My Homelab Journey」の下のホームラボのラックがあるグレーのセクション',
    },
    3: {
      name: '手作りの黒いサイト',
      when: '2025年',
      built: 'HTML、CSS、jQuery',
      body: '2025年、WordPress を離れてサイトを全部自分で書きました。背景は黒、見出しは Oswald で、タイトルの後ろには粒子の球にスポットライトが当たっていました。この Spline の 3D シーンは見た目は最高でしたが、サイト全体が重くなってしまいました。僕のコアスキルの横には、大好きだった『呪術廻戦』の宿儺の絵がありました。To BucketCentral ボタンは、セルフホストのサービスをひとまとめにしたページへ飛ぶ予定でしたが、そのページは作る前にやめました。',
      desktopAlt: '粒子の球の上でスポットライトに照らされた「Welcome To Chiambucket!」がある黒いページ',
      phoneAlt: 'スマホで見た黒いスポットライトのウェルカムページ',
      detailAlt: '「Hi I am Braven, I shape designs And stir up Creations!」と書かれた暗いカードと『呪術廻戦』の宿儺の絵、その下に My Core Skills',
    },
    4: {
      name: 'グラデーションのヒーロー',
      when: '2026年1月〜6月',
      built: 'HTML、CSS、jQuery',
      body: '1月にまた手作業でリデザインしました。主な目的は重さをなくすことと、大好きなベントーグリッドを試すことです。ホームの上部は「Creating with Intention.」と書かれたラベンダーとバイオレットのグラデーションになり、その下のセクションは、CAD と PCB のツール、僕のデザインの考え方、砂ぼこりの中の Project June のレンダーを並べた暗いカードのグリッドになりました。',
      desktopAlt: '「Creating with Intention.」の見出しの後ろに広がるラベンダーからバイオレットへのグラデーション',
      phoneAlt: 'スマホで見たグラデーションのヒーロー',
      detailAlt: '3D CAD と PCB 設計、「A Design first Engineering approach」の暗いカードと、その下で砂ぼこりを上げるローバー',
    },
    5: {
      name: 'Next.js で作り直し',
      when: '2026年6月〜7月',
      built: 'Next.js、React、Vercel',
      body: '6月、初めて Claude を使ってサイトをデザインし、Next.js で作り直して、速さと稼働率のために Vercel へ移しました。ページごとにアクセントカラーがつき、ホームでは青い光の上に「Creating with Meaning.」と書かれ、全プロジェクトの新しいギャラリーで検索や絞り込みができるようになりました。各カードを開くと短い概要が出てきます。',
      desktopAlt: '青い光の上に「Creating with Meaning.」と 2 つのボタンがある黒いページ',
      phoneAlt: 'スマホで見た Next.js 版のホーム',
      detailAlt: '絞り込みチップと、Project June、LoRA Messenger、LUMEN のカードが並ぶ All projects ギャラリー',
    },
    6: {
      name: 'Dark Sensory',
      when: '2026年7月〜10月',
      built: 'Next.js、WebGL、Vercel',
      body: '7月はもっと小さな変更で、レイアウトはそのままに配色だけを変えました。青と紫の色合いが、AI で作ったどのサイトにも見えてきたので、ほとんどのページを温かいアンバーにして、より上質な雰囲気にしました。',
      desktopAlt: '縦長の大文字で「CREATING WITH MEANING.」と書かれ、光る Get in touch ボタンがある暗いアンバーのページ',
      phoneAlt: 'スマホで見たアンバーの Dark Sensory 版ホーム',
      detailAlt: '温かいアンバーの光の中に、動画、UI デザイン、写真、PowerPoint の作品を並べたすりガラス風の暗いカード',
    },
    7: {
      name: '自然のテーマ',
      when: '2026年10月30日〜11月18日',
      built: 'Next.js、Vercel',
      body: '10月の終わりに、サイトに自然のテーマをつけました。前回より大きな変更でしたが、それでも少しずつの変更です。内容とレイアウトはそのままで、各ページがそれぞれの時間帯の描かれた風景の中に移り、コンパクトなメニューバーが加わりました。',
      desktopAlt: '左にカサマツ、透明なガラスの文字で「Braven Chiam」と描かれたセージ色の朝の絵',
      phoneAlt: 'スマホで見た朝の絵のホーム',
      detailAlt: '描かれた空の上の Projects の見出しと、その下の OCR Meter のフラッグシップカード',
    },
    8: {
      name: '自然のリデザイン',
      when: '2026年11月18日から',
      built: 'Next.js、GSAP、WebGL',
      body: 'これがずっと取り組んできた全面リニューアルで、v5 以来初めて見た目以上のものを変えました。新しいアニメーションと新しいデザインが全体に入っています。ホームは絵をそのまま残しつつ、スクロールするとストーリーが進みます。朝の景色が粒子に崩れていき、OCR Reader、Project June、Pip、BeadReader がそれぞれ自分の章を持ち、そのあとにほかのプロジェクト、ホームラボ、写真が続きます。',
      desktopAlt: '今のホーム：透明なガラスの「Braven Chiam」がある朝の絵',
      phoneAlt: 'スマホで見た今のホーム',
      detailAlt: '今のホームにある Project June の章。「Three live feeds from three phones」の見出しの横に 3 つのライブカメラ映像',
    },
  },
};
export default ja;
