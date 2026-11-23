import type { RecsCopy } from './en';

/* The recommendation cards in Japanese: a copy of en.ts with the words translated. */
const ja: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: '電池で動く水道メーターの読み取り機です。ESP32-S3 上の 693K パラメータの DrumNet パイプラインが数字の輪を読み取って LoRaWAN で送り、自作の KiCad 基板と 3D プリントのケースに収まっています。',
    alt: 'DrumNet を使った水道メーター OCR、OCR Reader',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'ライブカメラ 3 台、GPS、レーザーポインター、センサー 7 個を積んだ 5G ローバーで、Web コンソールから運転します。',
    alt: 'Project June のローバー',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'M5Stack Tab5 に住むデスクペットです。頭脳は僕のサーバーで動く DeepSeek Harness なので、ブラウザを操作したり、自分でアプリを作ったり、ほかのエージェントを見守ったりできます。',
    alt: 'M5Stack Tab5 に映る水色のデスクペット、Pip',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: '即席の LiDAR です。Stack-chan の頭に距離センサーを 4 つ載せてサーボで部屋を見渡し、カメラで色を付けた 3D スキャンをブラウザで見て回れます。',
    alt: '頭に Unit ToF4M 距離センサーを 4 つ載せた Stack-chan',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: '招待制のプライベートなオンライン読書アプリです。リアルタイムの在室表示、読者ごとの続きから再開、SQL で守る閲覧制限、Webtoon、みんなの読書統計があり、Next.js と Supabase で作りました。',
    alt: 'プライベート読書アプリ BeadReader',
  },
  'proj-pantry': {
    title: '賞味期限トラッカー',
    blurb: 'M5Stack CoreS3 SE と QRCode モジュールで作った、冷蔵庫の扉に貼る賞味期限トラッカーです。バーコードを読んで期限を選ぶと先に食べるものがわかり、Home Assistant でお知らせもしてくれます。',
    alt: 'QRCode モジュールに重ねた CoreS3 SE、賞味期限トラッカー',
  },
  'proj-ruler': {
    title: 'スクロール定規',
    blurb: 'M5Stack AtomS3R と Unit Scroll で作ったデジタル定規です。10 cm で一度校正したら、ホイールを押し込んで物に沿って転がすだけで、画面に長さが出ます。',
    alt: 'Unit Scroll をつないだ AtomS3R、スクロール定規',
  },
  'proj-cadmouse': {
    title: '3D CAD マウス',
    blurb: 'M5Stack Capsule を Onshape 用のワイヤレス 3D マウスにしました。ボタンをクリックして手の中で回すと、画面のモデルも一緒に回ります。',
    alt: '3D マウスとして使う M5Stack Capsule v1.1',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'LoRa でテキストを、ESP-NOW でざっくりした双方向の音声を送る ESP32 の携帯端末 2 台です。KiCAD で設計した初めての基板に、Onshape でモデリングしたケースを組み合わせました。',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'ESP32 で動く、声で操作するスマートルームのアシスタントです。OpenRouter 経由の Whisper と DeepSeek の LLM が、話した言葉を MQTT で送る 1 つの JSON コマンドに変えます。',
    alt: 'LUMEN 音声アシスタント',
  },
  'proj-ema': {
    title: 'EMA スマートホーム',
    blurb: '評価 A をもらったチームのスマートホームです。4 つの BeagleBone Black のノードが SocketIO サーバーに報告し、Spline で作ったライブの 3D ダッシュボードで見られます。',
    alt: 'EMA スマートホームシステム',
  },
  'proj-pandus': {
    title: 'Pandus ディスペンサー',
    blurb: '初めての学校の課題で、Arduino Uno と PyFirmata で動く、6 つのパーツを 3D プリントしたシロップディスペンサーです。',
    alt: 'Pandus ディスペンサー',
  },
  'proj-elecf': {
    title: 'ELEC-F コンセプト',
    blurb: 'M5Stack で作ったウォークイン冷凍庫のアラームです。扉が閉まったときに中に人がいるとタイマーが始まり、時間切れでアラームが鳴ります。',
    alt: 'ELEC-F コンセプト',
  },
  'proj-kauli': {
    title: 'Kauli コンセプト',
    blurb: 'コミュニケーションスキルの授業で提案した製品コンセプトで、Blender でレンダリングしました。',
    alt: 'Kauli コンセプト',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'ZeroMouse をベースにした超軽量ゲーミングマウスのシェルで、約 20 g まで軽くするのが目標です。',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: '学校の開発ボードを KiCAD で再現したものです。本物を家に持ち帰れなかったので作りました。',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Web 開発の課題',
    blurb: '初めてちゃんと動いた Web サイトで、Web 開発の授業の最終課題として HTML と CSS で作りました。',
    alt: 'Web 開発の課題',
  },
  'proj-mc': {
    title: 'Minecraft ライブマップ',
    blurb: '僕のホームラボの Docker で動く Paper サーバーで、ワールドのライブ Dynmap つきです。',
    alt: 'Minecraft ライブマップ',
  },
};
export default ja;
