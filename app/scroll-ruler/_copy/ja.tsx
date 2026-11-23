import type { ScrollRulerCopy } from './en';

const ja: ScrollRulerCopy = {
  meta: {
    title: 'スクロール定規 | Braven Chiam',
    description: 'M5Stack でのインターン中に、M5Stack AtomS3R と Unit Scroll で作ったデジタル定規です。スクロールホイールを押し下げて測りたいものに沿って転がすと、最初に一度だけ 10 cm で校正しておけば、画面に距離がセンチメートルで表示されます。',
    ogDescription: 'Unit Scroll を何かに沿って転がすと、AtomS3R がその長さを表示します。',
  },
  ld: {
    headline: 'スクロール定規',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'ロータリーエンコーダー', 'デジタル定規'],
  },
  hero: {
    alt: 'スクロール定規：Atomic Battery Base に載せた AtomS3R。下に Unit Scroll が差してあり、画面は 0.0 cm を示しています',
    back: '作品一覧へ戻る',
    tag: 'インターン作品',
    title: <>スクロール<em>定規</em></>,
    lead: 'M5Stack でのインターン中に、AtomS3R と Unit Scroll でこのデジタル定規を作りました。スクロールホイールを押し下げて測りたいものに沿って転がすと、画面に距離がセンチメートルで表示されます。',
    builtWith: '使ったもの',
    links: ['GitHub', 'ファームを書き込む'],
    meta: 'M5Stack でのインターン作品、2026年11月。M5Stack AtomS3R、Atomic Battery Base、Unit Scroll、C++。',
  },
  chapters: '章',
  rail: {
    demo: 'デモ', try: '試す', use: '使い方', measure: '測る', calibrate: '校正',
    steps: '測れる細かさ', how: 'しくみ', hardware: 'ハードウェア', setup: 'セットアップ',
  },
  demo: {
    h: 'デモ',
    p: '自分の机で撮影しました。まず定規の 10 cm を使って校正し、そのあと同じ定規に沿って 3 つの長さを測っています。',
    video: '定規の 10 cm で校正してから、4.1 cm、8.2 cm、7.3 cm を測るスクロール定規',
    moments: [
      { label: '10 cm で校正', note: 'ホイールは 49 ステップ数え、1 ステップは約 2 mm でした' },
      { label: '1 回目', note: '定規に沿って転がすと 4.1 cm' },
      { label: '2 回目', note: '長めに転がすと 8.2 cm' },
      { label: '3 回目', note: '最後は 7.3 cm' },
    ],
  },
  try: {
    h: '試す',
    p: 'この定規のコピーはファームウェアと同じ処理で動いていて、校正の画面から始まります。Unit Scroll を定規に沿ってドラッグすると、ホイールを押し下げたまま転がすことになるので数えます。定規をクリックすると持ち上げて別の場所に置くことになるので、数えません。画面をタップすると校正を保存するか値をゼロに戻し、1 秒長押しすると校正をやり直します。',
    note: '校正がちょうど 10 cm でないと、すべての値が同じ割合でずれます。これは本物の定規でも同じです。',
  },
  sim: {
    reading: '{cm} センチメートルです。',
    readingLive: '{cm} センチメートル、計測中です。',
    calibrating: '校正中：ここまで {n} ステップ。ホイールを押したままちょうど 10 センチメートル転がしてから離してください。',
    confirming: '10 センチメートルで {n} ステップ。画面をタップして保存してください。',
    button: 'AtomS3R の画面。ボタンも兼ねています：タップでゼロに戻すか保存、長押しで校正をやり直し',
    puck: '定規の {cm} cm の位置にある Unit Scroll。矢印キーを押し続けると、ホイールを押したまま転がします。',
    reset: '最初から',
  },
  use: {
    h: '使い方',
    p: 'AtomS3R は画面全体がボタンなので、定規の操作は 2 つだけです。転がしている間は押し下げておくスクロールホイールと、タップするか長押しする画面です。',
  },
  measure: {
    h: '測る',
    screen: '計測中の定規の画面：RULER と緑の LIVE タグ、緑の 4.1 cm、1 ステップ 2.0 mm で 41 mm',
    p1: 'ホイールを押し下げて前に転がします。距離を数えるのはホイールを押している間だけで、そのとき Unit Scroll の LED が緑に光り、表示の数字も緑になります。ホイールを離すと数えるのが止まり、押したまま後ろに転がすとその分の距離が引かれます。',
    p2: '画面をタップすると値がゼロに戻り、1 秒くらい長押しすると校正をやり直します。',
  },
  calibrate: {
    h: '校正',
    rolling: '校正中：ここまで 49 ステップ。ホイールを押してちょうど 10 cm 転がすように指示が出ています',
    rollingCaption: '10 cm を転がしているところ',
    checking: '確認：49 ステップで 10 cm、タップで保存',
    checkingCaption: '離して、保存できる状態',
    p1: '最初に起動したときと、頼んだときにはいつでも、定規は 10 cm を測って、1 ステップでホイールがどれだけ進むかを覚えます。ホイールを押して本物の定規に沿ってちょうど 10 cm 転がし、離して画面をタップすると、数えたステップ数が保存されます。',
    p2: 'もう一度ホイールを押すと同じ転がしに足していき、画面を長押しするとやり直しになります。校正はフラッシュに残るので電源が切れても消えません。転がした向きが「前」になります。',
  },
  steps: {
    h: 'どこまで細かく測れるか',
    p: 'ホイールが 1 回転するステップ数は決まっているので、定規はなめらかにではなく、ステップ単位で測ります。僕のものは 10 cm で 49 ステップだったので、1 ステップは約 2 mm です。画面にはどの値の下にも正確なステップの長さが出るので、最後の桁をどれくらい信じていいかがわかります。',
  },
  how: {
    h: 'しくみ',
    p1: 'Unit Scroll には自分専用の小さなチップがあって、ホイールのステップを数え、ボタンを読みます。AtomS3R は Grove ポート経由の I2C で、その両方を 1 秒に 100 回問い合わせます。読むたびに前回からのステップ数が返ってきて、それが距離に数えられるのはホイールを押しているときだけです。',
    p2: '定規の処理、つまり校正と距離の計算は、ハードウェアのコードを含まないひとつのファイルにまとめたので、デバイスに入れる前に 11 個のユニットテストでパソコン上で確認しています。Unit Scroll が抜けると画面にそう表示され、差し直せばすぐにまた認識します。',
  },
  hardware: {
    h: 'ハードウェア',
    parts: [
      { b: 'AtomS3R', s: 'は ESP32-S3 で定規を動かします。0.85 インチの画面はボタンも兼ねています。' },
      { b: 'Atomic Battery Base', s: 'にバッテリーが入っているので、ケーブルは要りません。' },
      { b: 'Unit Scroll', s: 'は転がすホイールで、押しボタンと RGB LED が付いていて、AtomS3R の Grove ポートに差します。' },
    ],
    photoAlt: '2 回目のあとに持ち上げた定規。画面は 8.2 cm を示していて、下には転がした定規があります',
    photoCaption: 'デモの 2 回目のあと',
  },
  setup: {
    h: 'セットアップ',
    steps: [
      <>AtomS3R を Atomic Battery Base に重ね、Unit Scroll を AtomS3R の Grove ポートに差します。</>,
      <>Chrome か Edge で <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> を開き、<b>Scroll Wheel Ruler</b> を選んで、AtomS3R を USB-C でつないで <b>Install</b> を押します。これでブラウザーから直接ファームウェアが書き込まれます。</>,
      <>校正の画面から始まるので、ホイールを押して定規に沿ってちょうど 10 cm 転がし、離して画面をタップして保存します。</>,
    ],
    repo: <><a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">GitHub リポジトリ</a>には、ファームウェアのコードとユニットテスト、それに esptool で書き込みたい人向けのファームウェアイメージのダウンロードがあります。</>,
    note: <>このページの AtomS3R は、<a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> にある M5Stack 公式のモデル（MIT ライセンス、著作権は M5Stack）からレンダリングしたもので、画面はファームウェアのレイアウトどおりに描いています。</>,
  },
};
export default ja;
