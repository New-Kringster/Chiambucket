import type { LidarCopy } from './en';

const ja: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'M5Stack の Stack-chan で作った LiDAR です。サーボで 4 つの Unit ToF4M 距離センサーを部屋に向けて動かし、カメラで点に色をつけ、スキャンをどのブラウザでも 3D で表示します。',
    ogDescription: 'Stack-chan が 4 つの距離センサーで部屋を見渡し、その値を色つきの 3D スキャンにします。自由に動かして見られます。',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', '点群', '3D スキャン', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: '見渡す', colour: '色', demo: 'デモ', play: '触ってみる', setup: '作り方' },
  chaptersLabel: '章',
  hero: {
    alt: 'M5Stack のモデルから描いた Stack-chan。頭の上に 4 つの Unit ToF4M センサーが四角く並んでいます',
    back: '作品一覧へ',
    tag: 'インターン作品',
    featured: '注目',
    title: 'Stack-chan LiDAR',
    lead: 'Stack-chan の頭に距離センサーを 4 つ載せて、サーボで部屋を見渡させ、LiDAR にしました。カメラが点に色をつけ、同じ Wi-Fi のブラウザならどれでも、スキャンができていく様子を 3D で見られます。',
    builtWith: '使ったもの',
    flash: '書き込む',
    meta: 'M5Stack でのインターン作品、2026年11月。Stack-chan（CoreS3）、PaHub、Unit ToF4M × 4、C++、WebGL。',
    cue: 'スクロールでスキャン開始',
  },
  sweep: {
    alt: 'Stack-chan の肩越しの眺め。センサーの視野が壁まで届き、部屋のまわりにスキャンが埋まっていきます',
    caps: [
      { title: '部屋を見渡す', p: 'Stack-chan は頭を数度ずつ動かして部屋を見渡し、一歩ごとに止まって壁までの距離を測ります。サーボから方向が、センサーから距離がわかるので、一歩ごとに 3D の点がひとつ増えます。これはデモの実際のスキャンで、頭が横に動くにつれて埋まっていきます。' },
      { title: 'Quick、Normal、Fine', p: 'スキャンの前に Quick、Normal、Fine から選びます。Quick は 1 分かからずに終わり、Fine は時間がかかるぶん、ずっと細かいところまで拾えます。' },
    ],
  },
  colour: {
    alt: '仕上がったスキャンを部屋の外から見たところ。カメラの色がついています',
    caps: [
      { title: 'カメラで色をつける', p: '見渡す前に、Stack-chan は CoreS3 のカメラでその範囲の写真を撮ります。それからブラウザが、写真のピクセルひとつひとつを、その方向でセンサーが測った距離に置いていきます。これで測定値のグリッドが、色のついた 68,206 個の点になります。' },
      { title: '写真の位置を合わせる', p: 'カメラはセンサーの下にあるので、写真と距離は少しずれた場所から撮られています。そこで、深度のエッジと写真のエッジを合わせて位置をそろえました。今は部屋のほとんどで色が正しい場所に乗っていますが、全部ではありません。' },
    ],
  },
  demo: {
    h: 'デモ',
    p: '空っぽの部屋の隅にあるテーブルに Stack-chan を置いて、ノートパソコンからスキャンを始めました。動画では、頭が動くのに合わせてブラウザに点がたまっていき、そのあと仕上がったスキャンをいろいろな方向から、最初は距離の色で、次にカメラの色で見せています。',
    video: '部屋の隅を見渡す Stack-chan と、ブラウザで増えていく点群。そのあと、仕上がったスキャンを深度と写真の色で',
    moments: [
      { label: '見渡す', note: '頭が隅を動いていき、点が埋まっていきます' },
      { label: '仕上がったスキャン', note: '部屋の隅の壁と天井を外から見たところ' },
      { label: '深度', note: '点ごとに距離で色をつけています' },
      { label: '写真の色', note: '同じ点を Stack-chan の写真で色づけ' },
    ],
  },
  play: {
    h: '触ってみる',
    stillAlt: '仕上がったスキャンを上から見たところ：部屋の隅の壁と天井、テーブルの上に青い箱',
  },
  pg: {
    view: 'Stack-chan がスキャンした部屋の 3D 点群です。ドラッグで回転、スクロールかピンチでズーム、右ドラッグで移動、ダブルクリックでその場所へ飛べます。',
    loading: 'スキャンを読み込み中',
    hintTouch: 'ドラッグで回転、ピンチでズーム',
    hintMouse: 'ドラッグで回転、スクロールでズーム、右ドラッグで移動',
    drop: '.ply ファイルをドロップして開く',
    stat: '{n} 点、{size} m',
    colourBy: '点の色',
    modes: ['写真', '深度', '高さ'],
    eyeTitle: 'Stack-chan の頭から見る',
    eye: 'Stack-chan の頭から見る',
    reset: '最初の視点に戻す',
    full: '全画面',
    leaveFull: '全画面を終了',
    open: '自分の .ply を開く',
    upY: 'このファイルは Y が上',
    back: 'Stack-chan のスキャンに戻る',
    download: 'このスキャンをダウンロード',
    errors: {
      notPly: 'このファイルは .ply の点群ではないようです。',
      lists: '頂点データのリストには対応していません。点だけを書き出してください。',
      noXyz: 'この .ply には x、y、z が見つかりません。',
      short: 'この .ply は、すべての点が出てくる前に終わっています。',
      unreadable: 'そのファイルを読み込めませんでした。',
    },
  },
  setup: {
    h: '作り方',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a> は M5Stack の小さなロボットで、2 つのサーボの上に CoreS3 の頭が載っています。スキャン、Web サーバー、カメラは、その ESP32-S3 が動かします。</>,
      <><a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a> を 4 つ。VL53L1X の ToF 距離センサーで、頭の上に四角く並べて取り付けます。</>,
      <><a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a> がひとつ。4 つのセンサーは I2C アドレスが全部同じですが、これがあれば 1 つの Grove ポートを共有できます。</>,
    ],
    photoAlt: '頭に 4 つのセンサーを載せた本物の Stack-chan。Grove ケーブルが背中へ垂れています',
    photoCaption: 'センサーを載せた本物の Stack-chan',
    steps: [
      <>Stack-chan の Port A に PaHub を挿し、そのチャンネル 0〜3 に 4 つの Unit ToF4M をつないでから、センサーを頭の上に前向きに取り付けます。</>,
      <>Chrome か Edge で <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> を開き、<b>Stack-chan LiDAR</b> を選んで、Stack-chan を USB-C でつなぎ、Install を押します。</>,
      <>Stack-chan が立ち上げる <b>StackChan-LiDAR</b> の Wi-Fi に接続して <b>http://192.168.4.1/</b> を開きます。このアドレスは Stack-chan の顔をタップしても表示されます。あとは範囲と細かさを選んで、スキャンを始めましょう。</>,
    ],
    note: 'このページの Stack-chan は、M5Stack 公式の 3D モデル（M5_Hardware、MIT ライセンス）から作っています。',
  },
};

export default ja;
