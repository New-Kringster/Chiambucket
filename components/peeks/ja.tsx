import { usePeekKit, type PeekLabels } from './kit';

/* The peek reader in Japanese: a copy of en.tsx with the words translated. */

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': '賞味期限トラッカー', 'proj-ruler': 'スクロール定規', 'proj-cadmouse': '3D CAD マウス', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA スマートホーム', 'proj-pandus': 'Pandus ディスペンサー', 'proj-elecf': 'ELEC-F コンセプト',
  'proj-kauli': 'Kauli コンセプト', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Web 開発', 'proj-mc': 'Minecraft ライブマップ',
};

export const LABELS: PeekLabels = {
  soon: '記事は近日公開',
  next: '次：{title}',
  untitled: 'プロジェクト {n}',
  pullHint: 'スクロールで次へ：{title}',
  pullAria: '次のプロジェクトを開く：{title}',
  end: 'これで全プロジェクトです',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Project June のローバー', ['個人作品'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 週間 · 独学 · 3D デザイン · モバイル通信 · WebRTC · MQTT</p>
          <p className="hp-rd-lead">3 週間で作った 5G ローバーです。3 台のライブカメラの映像を配信し、センサーをひと通り積んで、電波があればどこからでも Xbox コントローラーで運転できます。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '3 本のライブ映像', <><p>3 台のカメラが TURN サーバー経由の WebRTC でライブ配信するので、映像はモバイル回線の NAT を低遅延で越えられます。</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Project June のカメラ" loading="lazy" /></>)}
          {chapter('02', '操作とテレメトリー', <p>操作とテレメトリーは Mosquitto ブローカーを通して MQTT で運び、自作の PWM モーター制御とサーボのステアリングを Xbox コントローラーで動かします。</p>)}
          {chapter('03', 'センサーをひと通り', <><p>ローバーには Neo8M GPS、ジャイロスコープ、加速度センサー、磁気センサー、気圧計、超音波距離センサー、DHT11、TEMT6000 光センサーを積んでいます。</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="Project June のシステム構成" loading="lazy" /></>)}
          {cta('制作記録をすべて', '記事では、写真、構成、そしてぶつかった問題をすべて紹介しています。', '記事を読む', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('M5Stack Tab5 の上のシアン色のデスクペット Pip', ['インターン作品'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 週間 · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">M5Stack Tab5 の上のデスクペットで、頭脳は僕のサーバーで動く DeepSeek Harness です。なので、ブラウザを操作したり、自分でアプリを作ったり、僕のほかのエージェントを見守ったりできます。</p>
          {chapter('01', '働く様子を見せるペット', <><p>Pip はほうっておくと眠り、タブレットを持ち上げると起きて、考えている間は身をよじってこめかみをさすり、うまくいくと跳ねます。使うツールごとに演技もしてくれて、ページを読むときは双眼鏡を、助っ人に指示するときはメガホンを手に取ります。</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="虫めがね、双眼鏡、メガホン、紙飛行機を持った Pip" loading="lazy" /></>)}
          {chapter('02', '画面を使いこなす', <p>答えはページや整形されたテキストで返ってきて、Pip は自分のカーソルでそのページをクリックして進んだり、僕に選択式の質問をしたりできます。小さなアプリも作って引き出しにしまっておきます。僕のサーバーから配信する Web ページか、タブレット自体で動く Lua スクリプトです。</p>)}
          {chapter('03', 'エージェントたちの拠点', <><p>Pip は僕のコーディングセッションと同じハーネスの中で動き、長い作業は助っ人の pip に任せ、セッションが終わったり答えが必要になったりすると教えてくれます。</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="メモ帳、ノートパソコン、ブロック、本、フラスコを使って働く助っ人の pip たち" loading="lazy" /></>)}
          {cta('Pip が動く様子を見る', '記事では、気分、アプリ、デスクトップ、そしてそれらのつながり方を紹介しています。', '記事を読む', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('QRCode モジュールに CoreS3 SE を重ねた賞味期限トラッカー', ['インターン作品'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">賞味期限トラッカー</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">冷蔵庫の扉に貼る賞味期限トラッカーです。商品のバーコードを読み取って期限を選ぶと、画面にはいつも先に食べるべきものが表示されます。</p>
          {chapter('01', '読み取って保存', <><p>スキャナーがコードを探している間は画面が赤く光り、見つかると Open Food Facts か GS1 China から商品名、ブランド、写真を表示します。日、週、月のピッカーで期限を設定してから保存します。</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="トラッカーの期限ピッカー" loading="lazy" /></>)}
          {chapter('02', '先に食べるもの', <><p>ホーム画面は期限順に並び、残りが 1 日以内なら赤、1 週間以内ならアンバーで表示されます。すでにリストにあるものを読み取ると、二重に追加せずにそれを開きます。</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="期限順に並んだホーム画面" loading="lazy" /></>)}
          {chapter('03', 'あとはサーバーにおまかせ', <p>家のネットワークの Docker コンテナがリストを保管し、バーコードを調べ、パントリーを管理する Web ページを配信し、リマインダー用に各パントリーを MQTT で Home Assistant に公開します。</p>)}
          {cta('トラッカーを試す', '記事には、実際に動く画面のコピー、デモ動画、作り方があります。', '記事を読む', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('Unit Scroll を差した AtomS3R のスクロール定規', ['インターン作品'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">スクロール定規</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">デジタル定規です。Unit Scroll のホイールを押し下げて測りたいものに沿って転がすと、AtomS3R が距離をセンチメートルで表示します。</p>
          {chapter('01', '一度だけ校正', <><p>最初に起動したとき、本物の定規に沿ってちょうど 10 cm 転がし、画面をタップして数えたステップを保存します。これで 1 ステップあたりホイールがどれだけ進むかを覚えます。校正はその後もフラッシュに残ります。</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="8.2 cm を示す定規" loading="lazy" /></>)}
          {chapter('02', '転がして測る', <p>距離を数えるのはホイールを押し下げている間だけで、そのとき LED が緑に光ります。なので、持ち上げて置き直しても値はそのままです。画面をタップするとゼロに戻り、長押しすると校正をやり直します。</p>)}
          {chapter('03', 'デバイスの外でテスト', <p>校正と距離の計算はハードウェアのコードを含まないひとつのファイルにまとめてあるので、ファームウェアを AtomS3R に入れる前に、11 個のユニットテストでパソコン上で確認しています。</p>)}
          {cta('自分で転がしてみる', '記事には、実際に動く定規のコピー、デモ動画、書き込み方があります。', '記事を読む', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('頭に Unit ToF4M 距離センサーを 4 つ載せた Stack-chan', ['インターン作品'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · Unit ToF4M × 4 · C++ · WebGL</p>
          <p className="hp-rd-lead">手作りの LiDAR です。Stack-chan が 2 つのサーボで 4 つの距離センサーを部屋に向けて動かし、カメラが点に色をつけ、同じ Wi-Fi のブラウザならどれでもスキャンを 3D で表示できます。</p>
          {chapter('01', '見渡す', <><p>頭はグリッドを 1 行ずつ進み、水平から真上まで、横は最大 256 度まで動きます。どの姿勢もひとつのサンプルになり、サーボから方向を、センサーから距離を得ます。</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="カメラの色で仕上がった、部屋の隅のスキャン" loading="lazy" /></>)}
          {chapter('02', '4 つのセンサー、1 つの値', <p>4 つのセンサーは同じ方向を向いているので、各サンプルには測定値の中央値を使い、外れた値を捨てています。</p>)}
          {chapter('03', 'カメラで色づけ', <p>見渡す前に撮った写真で点に色をつけ、ブラウザが各ピクセルを測った距離まで押し出します。このスキャンでは 68,206 個の色つきの点になりました。</p>)}
          {cta('スキャンを見てみる', '記事には、実際のスキャンの 3D 表示、デモ映像、書き込み方があります。', '記事を読む', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('3D マウスとして使う M5Stack Capsule v1.1', ['インターン作品'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D CAD マウス</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Onshape 用のワイヤレス 3D マウスです。Capsule のボタンをクリックして手の中で回すと、画面のモデルも一緒に回ります。</p>
          {chapter('01', 'SpaceMouse になりすます', <p>Onshape は 3Dconnexion のドライバー経由でしか 3D マウスを受け付けないので、Capsule は Bluetooth で同社の SpaceMouse Wireless として名乗り、あとはドライバーがやってくれます。</p>)}
          {chapter('02', '手の動きについていく', <><p>ジャイロスコープで手の回る速さを送るので、モデルは手と同じ角度だけ回ります。ボタンを押したままにすると移動に、ひねるとズームになります。</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Capsule で Onshape のケースを回しているところ" loading="lazy" /></>)}
          {chapter('03', 'デバイスの外でテスト', <p>動きの計算とボタンのジェスチャーはハードウェアのコードを含まないひとつのライブラリにまとめてあるので、書き込むたびに 19 個のユニットテストでパソコン上で確認しています。</p>)}
          {cta('自分で回してみる', '記事には、実際に動く操作のコピー、デモ動画、作り方があります。', '記事を読む', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['個人作品'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 か月 · 独学 · 3D デザイン · PCB 設計</p>
          <p className="hp-rd-lead">ネットワークなしで話せる、ESP32 のハンディメッセンジャー 2 台です。テキストは長距離の LoRa で、双方向の音声は ESP-NOW で送ります。</p>
          {chapter('01', '2 つの無線、2 つの役割', <><p>LoRa は長距離でテキストを、ESP-NOW は低遅延の双方向音声を運びます。どちらの端末も、PlatformIO で Arduino フレームワークを使ってプログラムしました。</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="LoRA Messenger の中身" loading="lazy" /></>)}
          {chapter('02', '手でリフローした自作 PCB', <><p>基板は KiCAD で設計し、SMD 部品は自分でリフローはんだ付けしました。充電は基板の TP4056 回路が担当します。</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="自作 PCB" loading="lazy" /></>)}
          {chapter('03', '音声とケース', <><p>通話は I2S のマイクとスピーカーで、メッセージと状態は 2 枚の OLED ディスプレイで表示します。すべて Onshape でモデリングした 3D プリントのケースに収まっています。</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D プリントのケース" loading="lazy" /></>)}
          {cta('できあがるまでを見る', '記事では、ブレッドボードの段階、PCB の作り直し、学んだことを紹介しています。', '記事を読む', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('LUMEN 音声アシスタント', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT プログラミング · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">「Hello Robot」と言うと目を覚ます、音声で操作するスマートルームのアシスタントです。そのあとに話したことを ESP32 が録音し、FastAPI のリレーが文字起こしして、LLM に厳密な JSON コマンドをひとつ出してもらいます。そのコマンドが MQTT で部屋に送られます。</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', '話した言葉を JSON コマンドに', <p>ESP32 は 16&nbsp;kHz の音声をサーバーへストリーミングします。そこで Whisper が OpenRouter 経由で文字起こしし、DeepSeek の LLM がそれをちょうどひとつのコマンド（アクション、シーケンス、タイマーのどれか）にします。コマンドはボードに届く前にスキーマで確認されます。</p>)}
          {chapter('02', 'PSRAM なしのボードに収める', <><p>WROOM は WiFi をつないだ状態で空き RAM が約 33&nbsp;KB しかなく、音声クリップはおよそ 96&nbsp;KB あります。そこで音声はメモリにためずに、録音しながら raw ソケットでストリーミングし、アップロード中のメモリのピークは約 10&nbsp;KB に収まっています。</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="ESP32 に配線した INMP441 マイク" loading="lazy" /></>)}
          {chapter('03', '話しかけられる部屋', <><p>ライト、NeoPixel、ファン、サーボ、ブザーがコマンドに反応し、ローカルの自動モードと Web ダッシュボードもあります。「明るさを湿度に合わせて」と頼むと、センサーのライブの値を読んで、そのとおりにしてくれます。</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="LUMEN の Web ダッシュボード" loading="lazy" /></>)}
          {cta('制作のすべてを見る', '記事では、メモリの制約、配線、インタラクティブなデモを紹介しています。', '記事を読む', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('DrumNet を載せた OCR Reader：完全垂直統合型の OCR 水道メーターソリューション', ['個人作品'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">機械式の水道メーターの上に取り付ける、低コストでバッテリー駆動のカメラです。69.3 万パラメータのニューラルネットワークがすべて ESP32-S3 の上で動いてドラムを読み取り、その数字を LoRaWAN で家に送ります。</p>
          {chapter('01', 'チップの上の DrumNet', <><p>スポッターが数字の窓を見つけ、リファイナーが特徴マップの列と行を平均してその端を絞り込み、3 つのリーダーが繰り上がりのルールを当てはめながら各ドラムに投票します。ネットワーク全体が INT8 で動き、1 回の読み取りは約 2 秒です。</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="DrumNet のアンサンブル投票と読み取り結果" loading="lazy" /></>)}
          {chapter('02', '6 つのエージェントで学習', <><p>MeterSim がラベルつきのメーターをレンダリングし、SimGen2 がそれをカメラで撮ったように見せます。その間、6 つの AI エージェントが予約スケジューラーで GPU と Jetson のマシンを交代で使い、Tailscale と T3 Code で 24 時間動き続けました。</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="MeterSim の 9 つのメーターデザイン" loading="lazy" /></>)}
          {chapter('03', '基板、ケース、9 時間のリフロー', <><p>4 層の KiCad PCB にはバッテリー管理、LoRa、PWM の LED を載せています。手で組み立てて顕微鏡の下でデバッグし、メーター用アダプターつきの工具の要らない 3D プリントのケースに収めました。</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="Prototype V2 の基板の 3D レンダー" loading="lazy" /></>)}
          {cta('パイプライン全体をたどる', '記事では DrumNet の実行を一歩ずつ追い、3D の基板ツアー、ConfigKing のシミュレーター、レポート全文も載せています。', '記事を読む', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader、プライベートな電子書籍リーダー', ['個人作品'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Web アプリ · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · 独学</p>
          <p className="hp-rd-lead">数人の友だちのための、小さくてプライベートなオンラインの電子書籍リーダーです。みんなひとつのアクセスコードでログインします。どこまで読んだかを正確に覚えていて、ほかに誰が読んでいるかを表示し、みんなの進み具合も記録します。</p>
          {chapter('01', 'あなたを覚えているライブラリ', <><p>本を開くと、ちょうど読んでいた章とスクロール位置に戻ります。位置は割合で保存しているので、文字の大きさを変えてもずれません。読む人ごとの色、フォント、レイアウトも保存されます。</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="読書画面" loading="lazy" /></>)}
          {chapter('02', '一緒に読む', <><p>誰がオンラインかがわかり、同じ本を読んでいる友だちは緑の輪と章の番号で見つけられます。手を振ったり、消えてしまう短いメモを送ったりもできます。</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="オンライン表示とクイックメッセージ" loading="lazy" /></>)}
          {chapter('03', 'SQL で守る閲覧制限', <p>成人向けの章はデータベースのクエリ自体で制限しているので、アクセス権のない人には、制限された文章がサーバーから出ていくことはありません。同じ章でも読む人によって見え方が変わり、cal モードではまるごと取り除かれます。</p>)}
          {cta('制作のすべてを見る', '記事では、オンライン表示、閲覧制限、ウェブトゥーン、技術スタックを紹介しています。', '記事を読む', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA スマートホームシステム', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA スマートホームシステム</h2>
          <p className="hp-md-meta">3 か月 · 学校のグループ課題 · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">サステナブルな暮らしの授業で、5 人のチームで作ったスマートホームです。評価は A でした。4 つの BeagleBone のノードが、ライブの 3D ダッシュボードを動かす SocketIO サーバーに報告します。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA スマートホーム" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '4 つのノード、それぞれの役割', <><p>4 つのノードは、空調、バスルーム、キッチン（冷蔵庫の電力と火災報知器）、侵入検知を担当します。どの BeagleBone Black Wireless にも MikroBUS のセンサーモジュールを載せています。</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="キッチンのノードのハードウェア" loading="lazy" /></>)}
          {chapter('02', 'すべてをひとつのサーバーで', <><p>どのノードも SocketIO の Web サーバーにつながります。サーバーはダッシュボードをホストし、火災報知器を全ノードで同時に鳴らします。</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="システムの各部分のつながり" loading="lazy" /></>)}
          {chapter('03', 'ライブの 3D ダッシュボード', <><p>ダッシュボードは、家の Spline 3D モデルの上にライブのデータを表示します。UI は僕が Figma でデザインしました。</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="EMA の 3D ダッシュボード" loading="lazy" /></>)}
          {cta('試すか、記事を読む', 'ダッシュボードのライブデモと、プロジェクトの記事全文があります。', 'ライブデモ', 'https://csdpdemo.chiambucket.com', { label: '記事を読む', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus ディスペンサー', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus ディスペンサー</h2>
          <p className="hp-md-meta">1 か月 · 初めての学校の課題 · 3D デザイン · PyFirmata</p>
          <p className="hp-rd-lead">初めての学校の課題は、6 つのパーツを 3D プリントしたシロップディスペンサーでした。どのパーツも一回目のプリントでぴったり合いました。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus ディスペンサー" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'できること', <><p>3 つのカップサイズで注ぎ分け、人が近づくと起動し、サーボの扉とカップを照らす高出力 LED があります。</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Onshape の Pandus のモデル" loading="lazy" /></>)}
          {chapter('02', '制御と部品', <><p>PyFirmata で動かす Arduino Uno R3 が、サーボ、LED、リレーボード、ボタン、DC ポンプ、赤外線の衝突検知モジュールを制御します。</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Pandus のフローチャート" loading="lazy" /></>)}
          {cta('制作のすべて', '記事では、部品、フローチャート、Onshape のモデルを紹介しています。', '記事を読む', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F 安全冷凍庫システム', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F コンセプト</h2>
          <p className="hp-md-meta">安全冷凍庫保管システム · 4 人チーム · 工学の授業 · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">工学の授業でチームと一緒に設計した、冷凍庫の安全システムです。工場のウォークイン冷凍庫では、中で働く人が閉じ込められることがあります。そこで ELEC-F は扉と室内を見張り、寒さが危険になる前に警報を鳴らします。</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F 安全冷凍庫システム" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', '問題', <><p>掛け金の故障、凍りついたパッキン、あるいは単に気づかなかったことで、作業員がウォークイン冷凍庫に閉じ込められてしまうことがあります。そこでは低体温症がすぐに始まります。ELEC-F は、その時間を短くし、閉じ込められた人を安心させるためのものです。</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="ELEC-F の冷凍庫の試作機" loading="lazy" /></>)}
          {chapter('02', 'しくみ', <><p>ToF センサーが扉の開け閉めを読み取り、PIR センサーが中にまだ人がいるかを確認します。人が中にいるまま扉が閉まるとタイマーが始まり、時間切れになると RGB ユニットが点滅してブザーが鳴ります。</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="M5Stack 上の ELEC-F の警戒状態" loading="lazy" /></>)}
          {chapter('03', 'M5Stack で構築', <><p>2 台の M5Stack Fire コントローラーと Mini Hub で ToF、PIR、RGB のユニットをつないでいます。冷凍庫に必要な氷点下でも動き続けるので、これを選びました。</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="センサーに配線した M5Stack のコントローラー" loading="lazy" /></>)}
          {cta('コンセプトのすべてを見る', '記事では、リサーチ、制作、インタラクティブな解説を紹介しています。', '記事を読む', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli コンセプト', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli コンセプト</h2>
          <p className="hp-md-meta">コンセプト · コミュニケーションスキル · Blender で 3D</p>
          <p className="hp-rd-lead">コミュニケーションスキルの課題で考えて提案したオリジナルの製品コンセプトで、Blender で作った 3D のシーンで発表しました。</p>
          {chapter('01', 'アイデアから発表まで', <><p>課題のテーマは、アイデアを持つことだけでなく、それを伝えることでした。そこでコンセプトをデザインし、Blender でレンダリングして、聞き手にわかりやすく伝えるためのスライドを作りました。</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Kauli コンセプトのレンダー" loading="lazy" /></>)}
          {soon('Kauli コンセプト', 'レンダーと提案の記事を準備中です。')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['個人作品'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">個人 · 3D デザイン · 超軽量 20g</p>
          <p className="hp-rd-lead">人気の ZeroMouse を僕なりにアレンジした、20g の超軽量ゲーミングマウスです。FPS ゲームを少しでもうまくプレイできるように、一から設計しました。</p>
          {chapter('01', 'グラム単位の設計', <p>シェルのどのパーツも、剛性を落とさずに軽くなるようにモデリングし、握り心地と約 20 グラムという目標のバランスをとりました。</p>)}
          {soon('Series One Light', 'モデルとそのトレードオフの記事を準備中です。')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Copy Board の PCB', ['個人作品'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">個人 · PCB 設計 · KiCAD · 1 週間</p>
          <p className="hp-rd-lead">NYP の ATMega328 開発ボードを KiCAD で一から再現したものです。家で使える自分用のコピーが欲しくて作りました。</p>
          {chapter('01', 'リバースエンジニアリングして作り直す', <p>学校のボードを回路図から KiCAD で再現しました。生産終了の部品もあったので代わりの部品を探し、このボードで初めて本格的にリフローはんだ付けに挑戦しました。</p>)}
          {soon('Copy Board', '部品探し、レイアウト、リフローの記事を準備中です。')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Web 開発の課題', ['学校の課題'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Web 開発の課題</h2>
          <p className="hp-md-meta">学校 · HTML &amp; CSS · 初めてのサイト</p>
          <p className="hp-rd-lead">Web 開発の授業の最終課題として、HTML と CSS で作った初めてのちゃんと動くサイトです。このサイトは 2 回目の挑戦でした。</p>
          {chapter('01', '始まりの場所', <p>Web 向けのものづくりを初めて体験した作品で、あれから僕の作品がどれだけ進歩したかがわかります。</p>)}
          {soon('始まりを見る', 'サイトは今も公開しています。', { label: 'ライブデモ', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft ライブマップ', ['個人作品'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft ライブマップ</h2>
          <p className="hp-md-meta">個人 · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">ホームラボでセルフホストしている Minecraft サーバーで、マルチプレイのワールドを誰でもリアルタイムで見て回れるライブの Web マップがあります。</p>
          {chapter('01', 'サーバーとマップ', <p>Docker で動く Paper サーバーに Dynmap プラグインを入れていて、プレイヤーが探検したり建築したりするたびに更新される、ライブでインタラクティブなマップを生成します。</p>)}
          {soon('ワールドをライブで探検', 'ライブマップは誰でも見られます。', { label: 'ライブマップを開く', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
