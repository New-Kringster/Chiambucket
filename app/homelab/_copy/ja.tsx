import type { HomelabCopy } from './en';

const ja: HomelabCopy = {
  meta: {
    title: 'ホームラボ | Braven Chiam',
    description:
      '僕の家のクラウドは、braven-agents の上で動く AI エージェントが運用しています。braven-agents は、ほかのマシンや UniFi のネットワーク、Cloudflare のような外部のプラットフォームを操作するサーバーです。このページでは、全体のつながり方、マシン、サービス、そのライブの稼働状況を紹介します。',
  },
  jsonLd: {
    headline: 'AI エージェントが動かす家のクラウド',
    about: ['セルフホスティング', 'AI エージェント', 'インフラ自動化', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: '{name} の詳細',
  close: '閉じる',

  hero: {
    checking: '公開サービスを確認中',
    online: '{count}公開サービスがオンライン',
    onlineCount: '{n} / {total}',
    title: '自分で動く家のクラウド',
    lead: 'ここにあるマシン、ネットワーク、サービスは、すべて braven-agents が動かしています。僕の AI エージェントを動かすのが仕事のサーバーです。エージェントはストレージサーバーからルーター、Cloudflare まで、ほかのすべてにアクセスできるので、ほとんどの変更は僕が何も触らなくても、プロンプトひとつで済みます。',
    mapCta: 'つながりを見る',
    machinesCta: 'マシンを見る',
  },

  core: {
    title: 'すべては braven-agents を通る',
    lead: 'braven-agents はほかのすべてのシステムの鍵を持っていて、その上のエージェントは、それぞれの API か SSH で各システムにアクセスします。システムを選ぶと、エージェントがそこで何をしているかが見られます。',
    mapLabel: 'braven-agents がほかのすべてのシステムにつながる仕組み',
    coreTag: 'コア',
    coreRole: 'Claude Code、Codex、OpenCode に加えて、定期ジョブ用の Hermes も動いていて、僕は T3 Code でエージェントの作業を始めたり見守ったりしています。',
    groups: { machines: 'マシン', edge: 'ネットワークとエッジ', platforms: 'プラットフォーム' },
    doesLabel: 'ここでエージェントがすること',
    planned: '計画中',
    proxmoxName: 'Proxmox サーバー',
    nodes: {
      newmain: { role: 'ストレージとセルフホスト', via: 'Unraid API',
        does: ['Docker コンテナの起動、更新、再起動', 'アレイと各ディスクの状態の監視', '共有フォルダと仮想マシンの作成'] },
      caca: { role: '未発表プロジェクトの開発環境', via: 'SSH',
        does: ['プロジェクトのビルドとテスト', 'ツールとパッケージを最新に保つ'] },
      servertop: { role: 'iCloud への橋渡し', via: 'SSH',
        does: ['カレンダーの予定の確認と追加', 'リマインダーの確認と追加', 'Mac が必要なほかの iCloud の作業'] },
      blade: { role: 'GPU ジョブ', via: 'SSH',
        does: ['DrumNet の学習のような、RTX 3080 での学習ジョブ', '大きめのモデルや、GPU を多く使うほかの作業'] },
      proxmox: { role: '仮想マシン用、ハードは未定', via: '未稼働',
        does: ['まだ組み立て中なので、今は何も動いていません。'] },
      unifi: { role: '家のネットワーク全体', via: 'UniFi API',
        does: ['ネットワークと VLAN の作成', 'ファイアウォールのルールとポート転送の追加', '接続中のデバイスの確認と管理'] },
      npm: { role: '公開サービスのリバースプロキシ', via: 'NPM API',
        does: ['新しいサブドメインごとのプロキシホストの追加', 'SSL 証明書の発行と更新', 'サービスに誰がアクセスできるかの設定'] },
      cloudflare: { role: 'DNS とエッジサービス', via: 'Cloudflare API',
        does: ['DNS レコードの作成と変更', '新しいアプリ用の Cloudflare Tunnel の開設', 'Workers のデプロイと R2 ストレージの管理'] },
      github: { role: '僕のコード', via: 'GitHub CLI',
        does: ['リポジトリ、ブランチ、プルリクエストの作成', 'エージェントが加えた変更のプッシュ'] },
      vercel: { role: 'このサイトのホスティング', via: 'Vercel API',
        does: ['プレビューのデプロイとビルドの確認', '頼んだときにこのサイトを公開する'] },
      shebang: { role: '僕のホスティング基盤', via: 'Shebang MCP',
        does: ['ページとファイルの公開', '新しいアプリに専用のデータベースとサインインを用意'] },
    },
  },

  prompt: {
    title: 'プロンプトひとつから、動くアプリまで',
    lead: '新しいものを頼むと、エージェントはそれに関わるすべてのシステムを自分たちで進めていきます。たとえば、新しいアプリを専用の chiambucket.com のアドレスで公開してと頼むと、こんな流れになります：',
    requestLabel: 'リクエスト',
    request: '新しいメモアプリを notes.chiambucket.com で公開して。',
    steps: [
      { at: 'braven-agents', t: 'エージェントがアプリとその Docker Compose ファイルを書いて、テストします。' },
      { at: 'NewMain', t: 'アプリを NewMain 上のコンテナとして起動します。' },
      { at: 'Nginx Proxy Manager', t: '新しいサブドメインのプロキシホストを追加して、SSL 証明書を取得します。' },
      { at: 'Cloudflare', t: 'サブドメインを家に向ける DNS レコードを作ります。' },
      { at: 'UniFi', t: 'アプリにポートやファイアウォールのルールが必要なら、ルーターに追加します。' },
      { at: 'braven-agents', t: 'アドレスを開いてアプリが応答するのを確かめてから、僕にリンクを送ってくれます。' },
    ],
    ownTitle: '頼まなくても',
    own: '毎日ヘルスチェックが走り、直せるものは自分で直します。止まったコンテナ、サービス、仮想マシンを再起動し、外れたドライブをマウントし直します。',
    waitTitle: 'まだ僕を待つこと',
    wait: 'データの削除、ストレージアレイの作業、マシンの再起動にはまだ僕の承認が必要で、ツールも破壊的な操作の前には必ず確認してきます。',
  },

  machines: {
    title: 'マシン',
    photoAlt: '{name}',
    lead: '5 台のマシンが動いていて、6 台目はまだ計画中です。',
    status: { running: '稼働中', planned: '計画中' },
    items: {
      agents: {
        name: 'braven-agents', role: 'コア',
        blurb: 'ここでいちばんパワフルなマシンです。ベアメタルで Ubuntu を動かしているので、エージェントがマシン全体を独り占めできます。',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X、16 コア' },
          { k: 'メモリ', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: 'ストレージ', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'ストレージとサービス',
        blurb: 'NewMain は、パリティで守られた 5 台のハードディスクの Unraid アレイに僕のファイル、写真、バックアップを保管していて、このページの下で紹介しているセルフホストのサービスも Docker で動かしています。',
        specs: [
          { k: 'OS', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2、20 コア' },
          { k: 'メモリ', v: '128 GB DDR3' },
          { k: 'アレイ', v: 'ハードディスク 5 台、パリティ保護' },
          { k: 'コントローラー', v: 'IT モードの PERC H710P' },
        ],
      },
      caca: {
        name: 'CaCa', role: '開発環境',
        blurb: 'CaCa は小さな ThinkCentre で、まだ話せないプロジェクトの開発環境として使っています。',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'メモリ', v: '32 GB DDR4' },
          { k: 'ストレージ', v: '1 TB NVMe SSD' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'iCloud の橋渡し',
        blurb: 'Servertop は僕の iCloud にサインインしたままの MacBook Air で、エージェントはこれを通して、カレンダーやリマインダー、そのほかの個人的なものにアクセスします。',
        specs: [
          { k: 'モデル', v: 'MacBook Air、M1' },
          { k: 'メモリ', v: '8 GB' },
          { k: 'ストレージ', v: '256 GB SSD' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'GPU ワーカー',
        blurb: 'このノート PC は Ubuntu で動いていて、GPU を多く使う作業を担当しています。OCR Reader の DrumNet を学習させたのも、このマシンです。',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: '第 10 世代 Core i7' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'メモリ', v: '32 GB' },
          { k: 'ストレージ', v: '2 × 1 TB SSD' },
        ],
      },
      proxmox: {
        name: 'Proxmox サーバー', role: '仮想マシン',
        blurb: '新しい Proxmox サーバーはまだ組み立て中で、ハードウェアもこれから決めます。',
        specs: [
          { k: 'OS', v: 'Proxmox VE' },
          { k: 'ハードウェア', v: '未定' },
        ],
      },
    },
    rack: {
      alt: '僕の部屋のラック。上に青いケーブルのパッチパネル、メッシュの扉の奥にサーバー',
      caption: 'braven-agents、NewMain、CaCa は、僕の部屋のこのラックに一緒に入っています。',
    },
  },

  stack: {
    title: 'ホストしているもの',
    lead: 'NewMain は僕と僕のプロジェクトのためにこれらのサービスを動かしていて、公開しているものは、1 分ごとに確認しているライブの稼働状況を表示しています。',
    filterLabel: 'サービスを絞り込む',
    categories: {
      all: 'すべて',
      access: 'アクセス',
      files: 'ファイル',
      media: 'メディア・ツール',
      monitoring: '監視',
      projects: 'プロジェクト用',
    },
    checkedAt: '{time} に確認',
    checking: '状況を確認中',
    showFewer: '少なく表示',
    showAll: '{n} 個すべて表示',
    status: { up: 'オンライン', down: 'オフライン', wait: '確認中', self: '非公開' },
    loadLabel: '負荷：{label}',
    weights: {
      extreme: '最重量',
      'very-high': 'とても高い',
      high: '高い',
      moderate: '中くらい',
      low: '軽い',
      diagnostic: '必要時',
    },
    facts: { runsOn: '稼働先', load: '負荷', access: 'アクセス', category: 'カテゴリー' },
    access: {
      public: '公開、Nginx Proxy Manager と CrowdSec 経由',
      private: '非公開、Tailscale ネットワーク内',
    },
    visit: '{host} を開く',
  },

  services: {
    npm: {
      blurb: 'すべての公開サービスの前に立つリバースプロキシです。SSL を終端し、chiambucket.com の各サブドメインをそれぞれのコンテナへ振り分け、悪意のある IP を締め出す CrowdSec のバウンサーも動かしています。',
      long: [
        '公開の通信はすべてひとつのアドレスに届いてまず NPM へ行くので、インターネットに直接さらされるコンテナはありません。',
        'CrowdSec は通信を見張って攻撃のパターンを見つけ、送り元を締め出します。すべてが NPM を通るので、NPM が止まると公開サービスも全部止まります。',
      ],
    },
    tailscale: { blurb: '僕のデバイスをすべてひとつのプライベートネットワークにまとめる WireGuard のメッシュです。どこからでも家につなぐのに使っています。' },
    shadowsocks: { blurb: '通信を普通の HTTPS のように見せるプロキシで、制限のある学校のネットワークからでも家につなげられます。' },
    twingate: { blurb: 'ゼロトラストのコネクターで、Tailscale、WireGuard、UniFi Teleport と並ぶもうひとつの入り口として置いています。' },
    pihole: { blurb: 'ネットワーク全体の広告やトラッカーを DNS レベルでブロックします。ただ、今はほとんどトラブルシューティングに使っています。' },
    immich: {
      blurb: 'Immich は Google フォトの代わりの写真ライブラリで、スマホの自動バックアップ、検索、アルバムがそろっています。いちばんよく使うサービスです。',
      long: [
        'スマホの写真と動画はすべて自動でここにバックアップされ、自分のストレージに残ります。',
        'NewMain でいちばん重いサービスで、そのサイズを決める中で、実際の負荷に向けて CPU、メモリ、ストレージをどう割り振るかを学びました。',
      ],
    },
    lychee: { blurb: 'Lychee は、このサイトの写真ページを支えている写真ギャラリーです。' },
    pingvin: { blurb: 'チャットアプリには大きすぎるファイルをここにアップロードして、送れるリンクをもらいます。' },
    pairdrop: { blurb: 'AirDrop のように、ブラウザから 2 台のデバイスの間でファイルを送れます。アカウントは要りません。' },
    fbq: {
      blurb: '家で NFS や SMB 経由で使っているのと同じファイルに、ブラウザからアクセスしたり共有リンクを作ったりできます。',
      long: ['これまでに Nextcloud、元祖の FileBrowser、Alist、SFTPGo を使ってきて、最後に残ったのがこれです。'],
    },
    syncthing: { blurb: 'デバイス間のファイルを常に同期し、バージョン管理もしてくれます。' },
    fireshare: { blurb: '友だちとゲームのクリップをアップロードして共有する場所で、アップロードの上限はありません。' },
    neko: { blurb: 'タブの中で共有のブラウザを動かせるので、同じ部屋に入ってひとつの画面で一緒に観たり調べたりできます。' },
    crafty: { blurb: 'Crafty で Minecraft のサーバーを管理しています。' },
    paperless: { blurb: 'すべての PDF やスキャンを OCR する文書アーカイブで、どのデバイスからでも検索できます。' },
    vscode: { blurb: 'ブラウザで VS Code を動かして、サーバーの設定ファイルを編集できます。' },
    upstat: { blurb: 'すべてのサービスとコンテナの稼働時間と応答時間を記録しているので、問題に早めに気づけます。' },
    netdata: { blurb: 'CPU、ディスク、ネットワーク、コンテナの指標を 1 秒ごとに記録します。' },
    upsnap: { blurb: 'スリープ中のマシンを起こす Wake-on-LAN のパネルです。' },
    openspeedtest: { blurb: 'セルフホストのスピードテストで、サーバーと今いる場所の間の通信速度を測ります。' },
    portainer: { blurb: 'NewMain の Docker コンテナを Web の画面で扱えます。' },
    coturn: {
      blurb: 'Project June の 3 本の WebRTC カメラ映像がモバイル回線の NAT を越えられるように、この TURN と STUN のサーバーを立てました。',
      long: [
        'Project June は 3 本のライブカメラ映像を 5G で配信しますが、モバイル回線ではデバイスが何重もの NAT の奥に置かれ、WebRTC だけでは越えられません。',
        '自前の TURN と STUN のサーバーが、映像同士の待ち合わせ場所になる固定のパブリックアドレスを用意してくれるので、どこからでもローバーを運転できます。CPU もあまり使いません。',
      ],
    },
    mosquitto: { blurb: 'この MQTT ブローカーは、最初は Project June のテレメトリーと操作のために立てました。今は学校の ESP32 プロジェクトとそのダッシュボードの間でメッセージを運んでいます。' },
    nginx: { blurb: '小さな nginx コンテナ 2 つで、静的サイトとプロジェクトのデモを配信しています。' },
  },

  tubs: {
    title: 'Shebang Tubs',
    status: '開発初期',
    lead: 'Shebang Tubs は、誰でもエージェントと一緒に自分のアプリを作ってセルフホストできるように、僕が作っているプロジェクト兼フレームワークです。',
    body: [
      'アプリひとつがひとつの tub です。素の Compose ファイルと、専用のデータベース、ファイル、シークレットが入ったひとつのフォルダなので、エージェントはそれをビルドして動かし、データごとひとつの zip にまとめて別のマシンへ移せます。',
      'ダッシュボードで tub のデプロイ、起動、停止ができて、tub を公開すると Cloudflare Tunnel 経由で Web アドレスが付きます。ポート転送もリバースプロキシも要りません。エージェントには API キーを渡しているので、これを全部自分たちでこなせます。',
    ],
    diagram: {
      label: 'tub の中身と行き先',
      tub: 'ひとつの tub',
      parts: ['Compose ファイル', 'データベース', 'ファイル', 'シークレット'],
      zip: 'ひとつの zip に書き出し',
      runs: 'Docker があればどのマシンでも動く',
      publish: 'Cloudflare Tunnel で公開',
    },
  },

  cta: {
    title: 'これから目指すもの',
    sub: '目指しているのは、自分の面倒を自分で見て、プロンプトひとつで何でも作って動かせる個人のクラウドです。ほとんどのピースはもうそろっていて、次は新しい Proxmox サーバーです。',
    projects: 'プロジェクトを見る',
    contact: '連絡する',
  },
};
export default ja;
