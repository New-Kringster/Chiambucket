import type { BrolocatorCopy } from './en';

const ja: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: '僕の初めての PCB です。インターネットなしで LoRa でテキストを送り、ESP-NOW で荒削りな全二重の音声通話ができる ESP32 のハンディ端末で、基板は KiCAD、ケースは Onshape で設計して 3D プリント、ファームウェアは PlatformIO で書きました。',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'LoRA Messenger のハンディ端末',
    back: '作品一覧へ戻る',
    tag: '個人作品',
    title: <>LoRA <em>Messenger</em></>,
    lead: '僕の初めての PCB で、初めての ESP32 のプロジェクトです。2 台のハンディ端末が、インターネットなしで LoRa でテキストを送り合い、近くにいるときは ESP-NOW で荒削りな全二重の双方向音声通話ができます。作っている間は Brolocator と呼んでいました。',
    builtWith: '使ったもの',
    links: ['GitHub', 'デモ動画', '3D モデル'],
  },
  chapters: '章',
  rail: {
    Demo: 'デモ', Functionality: 'できること', ProjectDevelopment: '開発', Code: 'コード',
    PCBDesign: 'PCB', threeDDesign: 'ケース', Assembly: '組み立て',
  },
  demo: { h: 'デモ', video: 'LoRA Messenger のデモ動画' },
  features: {
    h: 'できること',
    items: [
      'LoRa で長距離にテキストメッセージを送れる',
      'もう 1 台が近くにいれば ESP-NOW で双方向の音声通話ができる',
      '充電式の LiPo バッテリーで動く',
      'ディスプレイが 2 枚ある',
      '通信距離テストのモードがある',
      'シンプルなメニュー UI',
    ],
    p: '2 つの無線は役割が違います。LoRa は遠くまで届くけれど短いテキストのパケットしか運べず、ESP-NOW は近距離だけど荒削りな双方向音声には十分な速さがあるからです。下のデモで両方を見られます。',
    alts: [
      'LoRA Messenger の正面',
      'LoRA Messenger の側面',
      'ディスプレイのアップ',
      'メニュー UI',
      'メッセージ画面',
      '通信距離テストのモード',
    ],
  },
  demoWidget: {
    texts: [
      '向かってる、あと 10 分',
      '登山口を見つけた',
      'バッテリー 40%、戻るね',
      'キャンプは尾根のすぐ先',
    ],
    radio: {
      lora: {
        label: 'LoRa でテキスト',
        short: 'LoRa',
        range: '長距離',
        carries: '短いテキスト',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa は ESP-NOW よりずっと遠くまで届きますが、帯域はテキスト分しかありません。',
      },
      espnow: {
        label: 'ESP-NOW で音声',
        short: 'ESP-NOW',
        range: '近距離の直接リンク',
        carries: '荒削りな全二重の音声',
        module: 'ESP32 そのもの',
        blurb: 'ESP-NOW は 2 台の ESP32 を直接つなぐリンクで、荒削りな双方向音声には十分な速さですが、届くのは近距離だけです。',
      },
    },
    quote: ['「', '」'] as [string, string],
    modesAria: '無線リンクを選ぶ',
    replay: 'デモを再生',
    you: '自分',
    friend: '友だち',
    screen: {
      pick: '送る文を選択', sending: '送信中', delivered: '送信済み',
      micLive: 'マイク ON', holdToTalk: '長押しで話す',
      newMessage: '新着メッセージ', receiving: '受信中', standingBy: '待機中', listening: '受話中',
    },
    link: {
      inFlight: 'パケット送信中', delivered: '送信済み', longRange: '長距離リンク',
      streaming: '音声を双方向に配信中', direct: '直接のピアリンク',
    },
    pickLabel: 'メッセージを選んで送信',
    send: 'LoRa で送信',
    holdLabel: '長押しで話す',
    transmitting: '送信中',
    holdToTalk: '長押しで話す',
    gauge: { range: '距離', carries: '運ぶもの', radio: '無線' },
  },
  dev: {
    h: '開発',
    p: 'これはマイコンに本格的に取り組んだ最初のプロジェクトで、初めての PCB でもありました。なので、部品の使い方はひとつずつ YouTube と ChatGPT に助けてもらいながら覚えました。',
    alt: 'ESP32、LoRa モジュール、I2S のマイクとスピーカー、2 枚の OLED ディスプレイ、ロータリーエンコーダー、ボタンを載せたブレッドボードの試作機',
    caption: 'ブレッドボードの試作機。ESP32 DevKit、Ebyte E220-900D の LoRa モジュール、I2S のマイクとスピーカー、2 枚の I2C OLED ディスプレイ、ロータリーエンコーダー、ボタンを載せています',
  },
  code: {
    h: 'コード',
    p: 'ESP32 のファームウェアは PlatformIO で書きました。調べてみて、ESP32 にはこれがいちばん合っていそうだったからです。ソースは GitHub にあり、PlatformIO のプロジェクト一式は下からダウンロードできます。',
    alt: 'PlatformIO で開いたファームウェア',
    project: { title: 'PlatformIO のプロジェクト', text: 'ファームウェアのプロジェクト一式です。そのまま PlatformIO で開けます。', button: 'プロジェクトをダウンロード' },
    repo: { title: 'GitHub のソース', text: 'ファームウェアのソースコードは GitHub にあります。', button: 'GitHub でコードを見る' },
  },
  pcb: {
    h: 'PCB',
    p: 'すべての部品を載せる基板を KiCAD で設計しました。',
    schematicAlt: 'KiCAD の回路図',
    schematicCaption: '回路図',
    layoutAlt: 'KiCAD の基板レイアウト',
    layoutCaption: '基板レイアウト',
    finishedAlt: '完成した PCB',
    files: { title: 'KiCAD のファイル', text: '基板の KiCAD プロジェクト一式です。', button: 'KiCAD のファイルをダウンロード' },
  },
  case: {
    h: 'ケース',
    p: 'ケースは Onshape でモデリングして 3D プリントしました。実際のモデルへのリンクは下にあります。',
    figs: [
      { alt: 'Onshape のケースのモデル', caption: 'Onshape のケース' },
      { alt: 'プリントしたケースの試作を並べたところ', caption: 'プリントしたケースの試作' },
      { alt: '補強する前と後のケースのクリップ', caption: '補強する前と後のケースのクリップ' },
    ],
    model: { title: 'Onshape のモデル', text: 'ケースの実際の 3D モデルです。', button: 'Onshape で 3D モデルを開く' },
  },
  assembly: {
    h: '組み立て',
    figs: [
      { alt: 'すべての部品を PCB にはんだ付けしたところ', caption: 'すべての部品を PCB にはんだ付けして、ちゃんと動きました' },
      { alt: 'PCB をケースに収めているところ', caption: 'PCB をケースに収めているところ' },
      { alt: '完成した LoRA Messenger', caption: '完成した LoRA Messenger' },
    ],
  },
};

export default ja;
