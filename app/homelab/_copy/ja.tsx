import type { HomelabCopy } from './en';

const ja: HomelabCopy = {
  meta: {
    title: 'ホームラボ | Braven Chiam',
    description:
      '自宅で 3 台のサーバーを動かしていて、写真ライブラリ、ファイル共有、そして Project June と LUMEN が使う MQTT と TURN のサーバーを担っています。このページでは、ハードウェア、ネットワークマップ、ストレージ、サービス、ライブの稼働状況を紹介します。',
  },
  jsonLd: {
    headline: 'ホームラボ',
    about: ['セルフホスティング', 'ホームネットワーク', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: '{name} の詳細',
  close: '閉じる',

  hero: {
    checking: '公開サービスを確認中',
    online: '公開サービス {count} がオンライン',
    onlineCount: '{n} / {total}',
    tele: 'NewMain は Unraid 7.1.2 で稼働中',
    eyebrow: 'ホームラボ',
    title: <>3 台のサーバーが<em>僕の部屋に</em></>,
    lead: '写真ライブラリやファイル、そして Project June と LUMEN が使う MQTT と TURN のサーバーを動かしています。ネットワークやストレージ、Docker を学び、自分で作ったものをホストする場所でもあります。',
    stats: [
      { v: '3', k: 'サーバー' },
      { v: '38', k: 'セルフホスト' },
      { v: '24 TB', k: '使える容量' },
      { v: '4', k: 'VLAN' },
    ],
    mapCta: 'ネットワークマップ',
    stackCta: 'サービスを見る',
    scrollCue: '下へスクロール',
  },

  mission: {
    eyebrow: '動かす理由',
    title: '何のためか',
    lead: '僕のハードウェアのプロジェクトには、通信相手になるサーバーが必要です。Project June はカメラ映像を僕の TURN サーバー経由で配信し、テレメトリーと操作には僕の MQTT ブローカーを使っています。LUMEN の音声リレーもここの Docker で動いています。こうしたものを自分で動かすことで、ネットワーク、ストレージ、デプロイを学んできました。',
    pillars: {
      cloud: { k: 'サーバーとストレージ', d: '毎日使うサービスを、リバースプロキシの後ろの Docker コンテナで動かしています。ストレージは 2 段構成で、バックアップもあります。' },
      net: { k: 'ネットワーク', d: 'ネットワークは 4 つの VLAN、RADIUS、WPA3-Enterprise の Wi-Fi で構成し、UniFi のスイッチとアクセスポイントで動いています。' },
      code: { k: 'アプリのデプロイ', d: '自分で作ったアプリは Proxmox クラスターの VM にデプロイしています。次は、ラボの一部をエージェントに任せてみたいです。' },
      link: { k: 'プロジェクトのために', d: 'coturn のおかげで Project June は 5G で映像を配信でき、Mosquitto は学校の ESP32 プロジェクトのメッセージを運んでいます。' },
    },
  },

  machines: {
    eyebrow: 'ハードウェア',
    title: 'サーバー',
    photoAlt: '{name} サーバー',
    more: 'スペックと詳細',
    rack: {
      alt: '僕の部屋のホームラボのラック。上に青いケーブルのパッチパネル、メッシュの扉の奥にサーバー',
      eyebrow: 'ラック',
      title: '3 台のサーバーをひとつのキャビネットに',
      body: 'ラックは部屋の隅にあって、上にパッチパネル、メッシュの扉の奥にサーバーがあります。2 台はずっと動いていて、Adell は必要になるまで電源を切っています。',
    },
  },

  statusLabels: { 'always-on': '24 時間稼働', 'on-demand': '必要時のみ' },

  specLabels: {
    os: 'OS', cpu: 'CPU', memory: 'メモリ', gpu: 'GPU', array: 'アレイ', fastPool: '高速プール',
    storage: 'ストレージ', boot: '起動', hosts: 'ホスト', power: '電源',
  },

  servers: {
    newmain: {
      tag: 'メインサーバー',
      role: 'ストレージと Docker の大部分',
      blurb: 'これがメインのサーバーです。パリティで守られた Unraid のアレイに大容量のデータを、ZFS の NVMe ミラーに速さが必要なものを置き、Docker コンテナのほとんどもここで動いています。',
      specs: {
        cpu: 'Ryzen 9 5950X、16 コア',
        array: 'パリティ 2 + データ 3',
        fastPool: '2 × 2 TB NVMe、ZFS ミラー',
      },
      detail: {
        tagline: 'ストレージとほとんどのサービス',
        story: [
          'Unraid は容量の違うドライブをまとめて、パリティで守られたひとつのアレイにして大容量のデータを置きます。一方、2 台の NVMe ドライブで組んだ別の ZFS ミラーには、Docker のアプリデータ、データベース、VM のディスクを置いています。',
          'このページのサービスはほぼすべてここで動いていて、chiambucket.com のサブドメインの裏にあるものも全部そうです。GTX 1070 は動画のトランスコードと、Immich の検索や顔のグループ分けを支える機械学習を担当しています。',
          'ほかのすべてがこのマシンに頼っているので、できるだけ手を加えないようにしています。',
        ],
        highlights: [
          'パリティアレイはドライブが 2 台同時に壊れても大丈夫',
          'アプリデータと VM ディスク用の ZFS NVMe ミラー',
          'Docker コンテナのほとんどを実行',
          'Immich の機械学習とトランスコード用の GTX 1070',
        ],
      },
    },
    caca: {
      tag: 'Proxmox ノード、常時稼働',
      role: 'Proxmox クラスター、常時稼働',
      blurb: 'CaCa は小さな ThinkCentre で、以前は僕のメインサーバーでした。今は Proxmox クラスターの常時稼働ノードとして、自分の 1 TB SSD から CasaOS と Debian の VM を動かしています。',
      specs: {
        storage: '1 TB NVMe SSD、起動と VM 用',
        boot: '内蔵の NVMe SSD',
        hosts: 'CasaOS と Debian の VM',
      },
      detail: {
        tagline: 'ずっと動いている Proxmox ノード',
        story: [
          'CaCa は NewMain の前のメインサーバーで、今は Adell と組んだ 2 ノードの Proxmox クラスターの、常時稼働のほうを担っています。',
          '内蔵の 1 TB NVMe SSD から Proxmox を起動していて、以前ベアメタルで動いていた CasaOS と Debian の仮想マシンも、今は同じディスクから動いています。',
          '消費電力が少ないので、Adell が眠っている間も一日中動かしています。',
        ],
        highlights: [
          '内蔵の 1 TB NVMe SSD から起動して VM を実行',
          'CasaOS と Debian の VM をホスト',
          '低消費電力で 24 時間稼働',
          'Adell とクラスターを組んでライブマイグレーション',
        ],
      },
    },
    adell: {
      tag: 'Proxmox ノード、必要時',
      role: 'Proxmox クラスター、必要時に起動',
      blurb: 'Adell は Xeon 20 コアと 128 GB の RAM を持ち、CaCa と同じ Proxmox クラスターに入っています。でも電気をたくさん食うので、UpSnap で起こすまでは電源を切っています。',
      specs: {
        cpu: '2 × Xeon E5-2470 v2、20 コア',
        storage: 'PERC H710P（IT モード）',
        power: 'Wake-on-LAN のみ',
      },
      detail: {
        tagline: '必要なときに起こす大きなマシン',
        story: [
          'Adell はクラスターの中の大きなマシンで、2 基の Xeon で合わせて 20 コア、RAM は 128 GB あります。そのぶん電気を使いすぎるので、つけっぱなしにはできません。',
          '必要な作業があるときは UpSnap で起動ボタンを押します。すると Wake-on-LAN のパケットが送られ、Adell はネットワーク経由で起動して作業をこなし、また眠りにつきます。',
        ],
        highlights: [
          'Xeon 20 コア、RAM 128 GB',
          'Wake-on-LAN で必要なときに起動',
          'PXE ブートで、OS 用の内蔵ドライブなし',
          '作業が必要になるまで電源オフ',
        ],
      },
    },
  },

  visuals: {
    runsLabel: 'ここで動くもの',
    runsFoot: 'このページの {total} 個のサービスのうち {n} 個が NewMain で動いています',
    bootLabel: '起動のしかた',
    bootSteps: [
      { t: '内蔵 SSD', s: 'マシンの中の 1 TB NVMe SSD' },
      { t: 'Proxmox', s: 'そのディスクから Proxmox が起動' },
      { t: 'VM', s: 'CasaOS と Debian も同じ SSD から動く' },
    ],
    wakeLabel: '起こしかた',
    wakeFoot: <>UpSnap から Wake-on-LAN のパケットを 1 つ送るだけで、<b>20 コア</b>すべてが動き出します</>,
  },

  map: {
    eyebrow: 'ネットワーク',
    title: 'ネットワークマップ',
    lead: '家のネットワークはひとつの UniFi ネットワークを 4 つの VLAN に分けています。デバイスを選ぶと役割が、VLAN を選ぶとそこにあるデバイスが表示されます。',
    clear: '強調を解除',
    tip: 'VLAN を選ぶとデバイスを強調',
    svgLabel: 'ネットワークマップ。デバイスを選ぶと詳細が見られます。',
    core: 'コアネットワーク',
    segment: 'セグメント',
    hint: 'デバイスを選ぶと役割が見られます。',
    legend: {
      unraid: 'Unraid VLAN',
      server: 'サーバー VLAN',
      default: 'デフォルト VLAN',
      iot: 'IoT VLAN（隔離）',
    },
    vlans: {
      unraid: { label: 'Unraid VLAN', blurb: 'この VLAN には NewMain だけがいます。信頼できる VLAN からはストレージやアプリに届きますが、IoT VLAN からは届きません。' },
      server: { label: 'サーバー VLAN', blurb: 'Proxmox クラスターの CaCa と Adell がこのセグメントを共有していて、VM のライブマイグレーションや PXE ブートができます。' },
      default: { label: 'デフォルト VLAN', blurb: 'ワークステーションとメインの WPA3-Enterprise Wi-Fi がここにあります。ここからサーバーには届きますが、IoT VLAN からここへは届きません。' },
      iot: { label: 'IoT VLAN', blurb: 'スマートデバイスはインターネットにだけつながります。ファイアウォールのルールで、このセグメントからほかのどの VLAN にも行けないようにしているからです。' },
      core: { label: 'コアネットワーク', blurb: 'VLAN 同士をルーティングするゲートウェイとスイッチです。' },
    },
    nodes: {
      internet: { label: 'インターネット', sub: '公開の入口',
        detail: '外から来る通信はひとつのパブリックアドレスに届き、そのままゲートウェイへ向かいます。なので、その奥にあるものには直接アクセスできません。' },
      udm: { label: 'UDM Pro', sub: 'ゲートウェイ、FW、RADIUS',
        detail: 'UniFi Dream Machine Pro は、ゲートウェイ、ファイアウォール、ネットワークコントローラー、RADIUS サーバーを兼ねています。どの VLAN がどこへ行けるかを決め、WPA3-Enterprise の Wi-Fi の認証もしています。' },
      sw1: { label: 'USW Pro Max 24', sub: 'サーバーラック',
        detail: 'この 24 ポートのスイッチはサーバーラックにあり、各サーバーは冗長化した 2 本のリンクでつながっています。' },
      sw2: { label: 'USW Flex 2.5G', sub: '一般用',
        detail: 'この 2.5 Gb のスイッチは、家の中の速めの普段使いデバイスをつないでいます。' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'AP に給電',
        detail: 'この 8 ポートの PoE スイッチは、5 台のアクセスポイントをそれぞれケーブル 1 本でつなぎ、給電もしています。' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'Unraid サーバーは専用の VLAN を持っています。信頼できる VLAN からはストレージやアプリに届きますが、IoT VLAN からは届きません。' },
      caca: { label: 'CaCa', sub: '常時稼働',
        detail: 'CaCa はずっと動いている Proxmox ノードで、Adell とサーバー VLAN を共有しています。' },
      adell: { label: 'Adell', sub: '必要時',
        detail: 'Adell は必要なときに起こす Proxmox ノードで、ライブマイグレーションと PXE ブートのために CaCa とサーバー VLAN を共有しています。' },
      clients: { label: 'PC', sub: 'ノート、デスクトップ',
        detail: '普段使いのデバイスはデフォルト VLAN にいます。ここからサーバーには届きますが、IoT VLAN からここへは届きません。' },
      aps: { label: 'UniFi AP × 5', sub: 'Wi-Fi',
        detail: '5 台のアクセスポイントが、家じゅうに 2 つの別々の Wi-Fi ネットワークを飛ばしています。電源は Lite 8 からの PoE です。' },
      wmain: { label: 'メイン WLAN', sub: 'WPA3-Enterprise',
        detail: 'メインの Wi-Fi は、UDM Pro の RADIUS を使った WPA3-Enterprise なので、デバイスごとに自分の認証情報を持っています。' },
      wiot: { label: 'IoT WLAN', sub: '隔離',
        detail: 'スマートデバイスはインターネットにだけつながります。ファイアウォールのルールで、ほかのどの VLAN にも行けないようにしているからです。' },
    },
  },

  storage: {
    eyebrow: 'ストレージと VM',
    title: 'ストレージと仮想マシン',
    poolsTitle: 'NewMain のストレージ',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'アレイ',
      sub: 'Unraid、パリティ保護',
      body: 'パリティドライブ 2 台とデータドライブ 3 台なので、ドライブが 2 台同時に壊れても大丈夫です。PXE のバックアップ、アーカイブ、メディアを置いています。',
    },
    fast: {
      name: '高速プール',
      sub: 'ZFS NVMe ミラー',
      body: '2 TB の NVMe ドライブ 2 台で ZFS ミラーを組んでいて、Docker のアプリデータ、VM のディスク、PXE の ISO ライブラリはここから動いています。',
    },
    sharedOver: '共有方法',
    protocols: ['SFTP', 'ローカルネットワークで SMB', 'Linux と macOS へ NFS'],
    clusterTitle: 'Proxmox クラスター',
    clusterLead: 'CaCa と Adell でひとつの Proxmox クラスターを組んでいます。CaCa は自分の 1 TB SSD から起動してずっと動いていて、Adell は OS 用の内蔵ドライブなしでネットワーク経由で起動し、コアが必要なときに僕が起こします。',
    vms: [
      { k: 'claudeplayground', d: '自分で作ったアプリをデプロイする Ubuntu の VM です。Claude が SSH でアクセスして、アプリを公開しています。' },
      { k: 'CasaOS と Debian', d: 'この 2 つの VM は、以前はベアメタルで動いていました。' },
      { k: 'Wake-on-LAN', d: '作業が必要になると UpSnap が Adell を起動するので、電気を使うのは動いているときだけです。' },
    ],
  },

  stack: {
    eyebrow: 'ソフトウェア',
    title: 'サービス',
    lead: '38 個のうち主なサービスです。公開しているものは、1 分ごとに確認しているライブの稼働状況を表示しています。',
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
    status: { up: 'オンライン', down: 'オフライン', wait: '確認中', build: '構築中', self: '非公開' },
    loadLabel: '負荷：{label}',
    weights: {
      extreme: '最重量',
      'very-high': 'とても高い',
      high: '高い',
      moderate: '中くらい',
      low: '軽い',
      dev: '開発中',
      diagnostic: '必要時',
    },
    facts: { runsOn: '稼働先', load: '負荷', access: 'アクセス', category: 'カテゴリー' },
    access: {
      public: '公開、Nginx Proxy Manager と CrowdSec 経由',
      dev: 'NewMain で開発中',
      private: '非公開、Tailscale ネットワーク内',
    },
    visit: '{host} を開く',
  },

  services: {
    openclaw: {
      blurb: '今作っている OpenClaw は、AI エージェントがラボで実際の作業をこなせるようにするランナーです。まだ完成していません。',
      long: [
        '目指しているのは、エージェントがラボの中で安全に動ける場所を用意することです。そこでコンテナを起動し、サービスを確認し、小さなアプリをデプロイして、結果を報告してくれます。',
        'これは、アプリのデプロイ用に Claude へ VM の SSH アクセスを渡したことの延長です。次のステップは、ラボの一部をエージェントに任せて、僕が結果をレビューすることです。',
      ],
    },
    npm: {
      blurb: 'すべての公開サービスの前に立つリバースプロキシです。SSL を終端し、chiambucket.com の各サブドメインをそれぞれのコンテナへ振り分け、悪意のある IP を締め出す CrowdSec のバウンサーも動かしています。',
      long: [
        '公開の通信はすべてひとつのアドレスに届いてまず NPM へ行くので、インターネットに直接さらされるコンテナはありません。',
        'CrowdSec は通信を見張って攻撃のパターンを見つけ、送り元を締め出します。すべてが NPM を通るので、NPM が止まると公開サービスも全部止まります。',
      ],
    },
    tailscale: { blurb: '僕のデバイスをすべてひとつのプライベートネットワークにまとめる WireGuard のメッシュです。どこからでも SSH で入って設定を編集するのに使っています。' },
    shadowsocks: { blurb: '通信を普通の HTTPS のように見せるプロキシで、制限のある学校のネットワークからでも家につなげられます。' },
    twingate: { blurb: 'ゼロトラストのコネクターで、Teleport、WireGuard、Unraid Connect と並ぶもうひとつの入り口として置いています。' },
    pihole: { blurb: 'ネットワーク全体の広告やトラッカーを DNS レベルでブロックします。ただ、今はほとんどトラブルシューティングに使っています。' },
    immich: {
      blurb: 'Immich は Google フォトの代わりの写真ライブラリで、スマホの自動バックアップ、検索、アルバムがそろっています。いちばんよく使うサービスです。',
      long: [
        'スマホの写真と動画はすべて自動でここにバックアップされ、自分のストレージに残ります。',
        'NewMain でいちばん重いサービスです。検索と顔のグループ分けの機械学習は GTX 1070 が担当していて、そのサイズを決める中で、実際の負荷に向けて CPU、GPU、メモリ、ストレージをどう割り振るかを学びました。',
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
    crafty: { blurb: 'Crafty で Minecraft のサーバーを管理しています。2 か所で動かしているので、いつでもワールドを起動できます。' },
    paperless: { blurb: 'すべての PDF やスキャンを OCR する文書アーカイブで、どのデバイスからでも検索できます。' },
    vscode: { blurb: 'ブラウザで VS Code を動かして、サーバーの設定ファイルを編集できます。' },
    upstat: { blurb: 'すべてのサービスとコンテナの稼働時間と応答時間を記録しているので、問題があれば真っ先に気づけます。' },
    netdata: { blurb: 'CPU、ディスク、ネットワーク、コンテナの指標を 1 秒ごとに記録します。' },
    upsnap: { blurb: 'Wake-on-LAN のパネルで、Adell を起動するのはこれです。' },
    openspeedtest: { blurb: 'セルフホストのスピードテストで、サーバーと今いる場所の間の通信速度を測ります。' },
    portainer: { blurb: 'Unraid のホストと CasaOS の VM、両方の Docker を Web の画面で扱えます。' },
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

  access: {
    eyebrow: 'リモートアクセス',
    title: '6 つの入り口',
    lead: '外から入る方法を 6 つ別々に用意しているので、どれかひとつが壊れても締め出されることはありません。',
    primary: 'メイン',
    methods: {
      tailscale: { type: 'メッシュ VPN', note: '全デバイスでひとつのログインを使う WireGuard のメッシュで、毎日使っているのはこれです。' },
      wireguard: { type: 'トンネル', note: '第三者を介さない、ネットワークへのシンプルな暗号化トンネルです。' },
      teleport: { type: '内蔵 VPN', note: 'UDM Pro 自身が発行する VPN なので、設定するクライアントがありません。' },
      twingate: { type: 'ゼロトラスト', note: 'ID ごとにアクセスを確認し、受信ポートはすべて閉じたままにします。' },
      shadowsocks: { type: 'プロキシ', note: '通信を HTTPS のように見せるので、制限のある学校やオフィスの Wi-Fi でも通れます。' },
      unraidConnect: { type: 'ベンダー提供', note: '自分の Unraid アカウントから、Unraid サーバーに直接アクセスできます。' },
    },
    home: { type: 'ラック', note: '上のどの道も、ここにたどり着きます。' },
  },

  cta: {
    title: '今作っているもの',
    sub: '今作っている OpenClaw は、AI エージェントがラボで実際の作業をこなせるようにするランナーです。コンテナを起動し、サービスを確認し、小さなアプリをデプロイして、結果を報告します。まだ完成していません。',
    projects: 'プロジェクトを見る',
    contact: '連絡する',
  },
};
export default ja;
