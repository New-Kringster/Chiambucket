import type { CsdpCopy } from './en';

const ja: CsdpCopy = {
  meta: {
    title: 'EMA スマートホーム | Braven Chiam',
    description: '学校の 5 人のチームで作り、評価 A をもらったスマートホームシステムです。4 つの BeagleBone Black Wireless のノードが空調、バスルーム、キッチン、扉を見守り、SocketIO の Web サーバーがそれをつないで、Spline 3D のビューがあるライブのダッシュボードをホストします。',
  },
  ld: { headline: 'EMA スマートホーム' },
  hero: {
    alt: 'EMA スマートホーム',
    back: '作品一覧へ戻る',
    tag: '学校の課題、5 人チーム',
    title: <>EMA スマート<em>ホーム</em></>,
    lead: '4 枚の BeagleBone Black Wireless で作った、家庭で使うエネルギーを減らすためのスマートホームシステムです。今まで取り組んだ中でいちばん複雑なグループ課題で、いくつもの授業で学んだことを使いました。評価は A でした。',
    builtWith: '使ったもの',
    links: { demo: 'ライブデモ', github: 'GitHub', video: 'PR 動画' },
  },
  chapters: '章',
  rail: {
    PromoVideo: '動画', Team: 'チーム', ProjBackground: '課題', DesignProcess: 'ダッシュボード',
    Climate: '空調ノード', Bathroom: 'バスルームノード', Kitchen: 'キッチンノード', Intrusion: '侵入検知ノード',
    Connectivity: '通信', SlideDeck: 'スライド', Documentation: 'ドキュメント',
  },
  video: { h: '動画', title: 'EMA スマートホームの PR 動画' },
  team: {
    h: 'チーム',
    roles: ['リーダー、資料、コード', 'アート、コード、デザイン', '資料、コード', '資料、コード', 'メンバー'],
    me: '{name}（僕）',
    profile: 'プロフィール',
    noProfile: 'プロフィールなし',
  },
  brief: {
    h: '課題',
    p: '渡されたのは 4 枚の BeagleBone Black Wireless と MikroBUS の Click モジュール一式で、課題はサステナブルな暮らしを支える Wi-Fi 接続のシステムを作ることでした。僕たちは、エネルギーの使用量をリアルタイムで見守り、機器を切り替えて消費を減らすスマートホームシステムを作り、さらに侵入検知のノードも加えました。',
    alt: '各ボードが家のどこにあるか',
    caption: '各ボードが家のどこにあるか',
  },
  dashboard: {
    h: 'ダッシュボード',
    p: <>プロジェクトのほとんどはソフトウェアだったので、デザインの作業はダッシュボードをわかりやすく、読みやすく、ひと目で把握できるようにすることに注ぎました。家の Spline 3D モデルも加えて、それぞれの動作が起きるたびに表示されるようにしました。<a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">ライブデモ</a>で自分でも試せます。</>,
    mockAlt: 'Figma で作ったダッシュボードのモックアップ',
    mockCaption: 'Figma で作ったダッシュボードのモックアップ',
    finishedCaption: '完成したダッシュボード',
    splineCaption: '動作をライブで表示する Spline 3D のビュー',
  },
  nodes: {
    Climate: {
      h: '空調ノード',
      p: '空調ノードは温度、湿度、部屋に人がいるかを見守り、人を検知していて部屋が暑くて湿っているときだけファンを回します。',
      alt: '空調ノードのハードウェア',
    },
    Bathroom: {
      h: 'バスルームノード',
      p: 'ボタンとディスプレイで、シャワーを浴びたい時間を設定します。シャワーに入ったことをノードが検知するとタイマーが始まり、時間になるとブザーが鳴ります。',
      alt: 'バスルームノードのハードウェア',
    },
    Kitchen: {
      h: 'キッチンノード',
      p: 'キッチンノードは冷蔵庫のエネルギー使用量を見守り、エネルギースコアをダッシュボードに報告します。火災報知器も兼ねていて、制御されていない火を検知すると、すべてのノードで警報が鳴ります。',
      alt: 'キッチンノードのハードウェア',
    },
    Intrusion: {
      h: '侵入検知ノード',
      p: '侵入検知ノードは、扉のノックと、ふだんと違う時間に扉が開いたことを検知します。どちらかが起きると、すべてのノードで警報を鳴らします。',
      alt: '侵入検知ノードのハードウェア',
    },
  },
  connectivity: {
    h: '通信',
    p: [
      'どのボードも SocketIO の Web サーバーにつながります。サーバーはダッシュボードをホストし、ノード同士のイベントと警報を取りまとめます。',
      '下のマップは、4 つのノードとサーバーを表しています。ノードを選ぶと何をするかがわかり、キッチンの火災をシミュレートすると、警報がすべてのノードに届く様子を見られます。',
    ],
    diagramAlt: 'ノード、サーバー、ダッシュボードのつながりを示す図',
    diagramCaption: 'ノード、サーバー、ダッシュボードのつながり',
    repoTitle: 'GitHub のソース',
    repoText: 'リポジトリには、各ノードのコードと、ダッシュボードをホストする SocketIO サーバーのコードがあります。',
    repoButton: 'GitHub でコードを見る',
  },
  slides: { h: 'スライド', title: 'EMA スマートホームのスライド（PDF）', open: 'スライドを開く（PDF）' },
  docs: { h: 'ドキュメント', title: 'EMA スマートホームのドキュメント（PDF）', open: 'ドキュメントを開く（PDF）' },

  nodeMap: {
    nodes: {
      climate: {
        name: '空調',
        short: 'ファン制御',
        does: '部屋に人がいて、空気が暑くて湿っているときだけファンを回します。',
        hardware: 'BME680 の温湿度センサー、PIR の人感センサー、8x8 の LED マトリクス、ブザー',
        alarm: 'どれかのノードが警報を出すと鳴ります',
      },
      bathroom: {
        name: 'バスルーム',
        short: 'タイマー',
        does: 'ボタンで設定した長さでシャワーの時間を計ります。入ったときにスタートします。',
        hardware: 'PIR センサー、OLED ディスプレイ、静電容量式ボタン、ブザー',
        alarm: '時間になると 3 回音を鳴らします',
      },
      kitchen: {
        name: 'キッチン',
        short: '電力と火災',
        does: '冷蔵庫のエネルギー使用量をスコアにしてダッシュボードに報告し、火を見張ります。',
        hardware: 'アナログ電流センサー、Flame Click、OLED ディスプレイ、ブザー',
        alarm: '火災が起きると、すべてのノードで警報が鳴ります',
      },
      intrusion: {
        name: '侵入検知',
        short: '扉の防犯',
        does: '扉のノックと、ふだんと違う時間に扉が開くことを見張ります。',
        hardware: '扉のリードスイッチ、ノック用の振動センサー、ブザー',
        alarm: 'どちらが起きても、すべてのノードで警報が鳴ります',
      },
    },
    hub: { label: 'Web サーバー', idle: 'SocketIO、ダッシュボードをホスト', alarm: '全ノードに警報を送信' },
    nodeAria: '{name}ノード',
    nodeAriaAlarm: '{name}ノード、警報が鳴っています',
    alarmTag: '警報',
    caption: '線はそれぞれ SocketIO のリンクで、点はサーバーに向かっている測定値です。',
    eyebrow: { pinned: '選んだノード', idle: 'ノードを選ぶ' },
    tabsAria: 'センサーノード',
    cardTitle: '{name}ノード',
    terms: { does: '役割', hardware: 'ハードウェア', buzzer: 'ブザー' },
    status: {
      idle: '接続中で、サーバーに測定値を送っています',
      arming: 'キッチンが炎を検知して、ブザーが鳴ります',
      travelling: '警報がサーバーに向かっています',
      received: 'サーバーが警報を一斉に送り、すべてのノードが鳴ります',
    },
    sim: { run: 'キッチンの火災をシミュレート', busy: '警報が作動中' },
    hint: 'キッチンノードが炎を検知すると、サーバーが警報を受け取り、すべてのノードに送ります。',
  },
};

export default ja;
