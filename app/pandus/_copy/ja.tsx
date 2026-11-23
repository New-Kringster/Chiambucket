import type { PandusCopy } from './en';

const ja: PandusCopy = {
  meta: {
    title: 'Pandus ディスペンサー | Braven Chiam',
    description: 'ナンヤン・ポリテクニックでの初めての学校の課題は、6 つの 3D プリントのパーツでできていて Arduino Uno で動くシロップディスペンサーでした。プログラムは PyFirmata を使って Python から書きました。',
    ogDescription: 'Pandus は、6 つの 3D プリントのパーツでできていて、PyFirmata で Arduino Uno が動かすシロップディスペンサーです。',
  },
  ld: { headline: 'Pandus ディスペンサー' },
  hero: {
    alt: 'Pandus のシロップディスペンサー',
    back: '作品一覧へ戻る',
    tag: '学校の課題',
    title: <>Pandus <em>ディスペンサー</em></>,
    lead: 'Pandus は僕の初めての学校の課題で、6 つの 3D プリントのパーツでできていて Arduino Uno で動くシロップディスペンサーです。授業で配られた部品に、自分で買ったいくつかの部品を足して作りました。',
    builtWith: '使ったもの',
    links: { video: 'デモ動画', cad: '3D モデル' },
  },
  chapters: '章',
  rail: {
    PromotionalVideo: '動画', ProjectBackground: '背景', DesignProcess: 'デザイン',
    ControlnFunction: '制御', Coverimg: 'カバー画像',
  },
  video: { h: '動画', title: 'Pandus ディスペンサーの動画' },
  background: {
    h: '背景',
    p: [
      'Pandus は、ナンヤン・ポリテクニックの 1 年生のときの初めての大きなプロジェクトで、テーマのない自由な課題でした。配られたのは Arduino Uno、4G サーボ、LED、ボタン、スライドスイッチ、赤外線の衝突検知モジュール、それに配線の束です。',
      '最初は水のディスペンサーを考えていたのですが、ほかの人がもう選んでいたので、代わりにシロップのディスペンサーを作りました。',
    ],
    alt: 'Pandus の動画の一部を撮影しているところ',
    caption: '動画の一部を撮影しているところ',
  },
  design: {
    h: 'デザイン',
    p: 'Pandus は Onshape でデザインしました。使った経験がほとんどなかったので、ソフトを覚えるのにかなり時間を取られました。そのせいで試作する時間がなくなり、最終デザインをそのまま 3D プリンターに送りましたが、どのパーツも一回目のプリントでぴったり合いました。',
    explodedAlt: 'Onshape の Pandus のモデルの分解図',
    assembledAlt: 'Onshape で組み立てた Pandus のモデル',
    cadTitle: '3D モデル',
    cadText: 'Onshape で Pandus のモデルを回したり、分解したりできます。',
    cadButton: 'Onshape で 3D モデルを開く',
  },
  control: {
    h: '制御',
    p: [
      '授業では、Firmata ライブラリを使って Python から Arduino をプログラムする方法を習いました。授業の部品に加えて、高出力 LED、DC ポンプ、リレーボードを買い、電流の大きい部品は別のモバイルバッテリーから給電しました。',
      '下のデモは、さらに下にあるフローチャートの注ぐサイクルを 1 回分動かします。レベルを選んで自分で動かすこともできます。',
    ],
    alts: [
      'フローチャート：赤外線センサーでサーボが開いて LED が点き、選択ボタンでレベルを決め、決定ボタンでポンプが 3 秒、4 秒、5 秒動きます',
      'Arduino Uno、サーボ、赤外線センサー、リレー、DC ポンプ、高出力 LED、ブザー、ボタン、表示用 LED の回路図',
      'Pandus の中の配線。リレーボード、ボタン、表示用 LED があります',
      'Pandus の中のブレッドボード、ブザー、Arduino Uno',
    ],
  },
  cover: {
    h: 'カバー画像',
    p: 'Pandus を照明を変えて 4 回撮影し、Photoshop でその 4 枚を合成してカバーにしました。',
    caption: '4 枚の写真がカバーになるまで',
  },

  demo: {
    level: 'レベル {n}',
    ledText: ['赤の LED', '赤と黄の LED', '3 つすべての LED'],
    pump: 'ポンプ {s} 秒',
    phases: {
      idle: { label: '待機', blurb: 'ディスペンサーは、赤外線の衝突検知モジュールがカップを検知するのを待っています。' },
      wake: { label: 'カップ', blurb: 'カップで赤外線モジュールが反応すると、サーボが 180° 回ってボタンの上の扉が開き、高出力 LED が点いて、レベルが 1 に戻ります。' },
      select: { label: '選択', blurb: '選択ボタンでレベル 1、2、3 を切り替え、表示用 LED でどれを選んでいるかがわかります。' },
      pour: { label: '注ぐ', blurb: '決定ボタンを押すと、レベルに応じて 3 秒、4 秒、5 秒、リレーを通して DC ポンプがオンになります。' },
      done: { label: '完了', blurb: 'ポンプが止まり、次のカップが来るまですべてオフになります。' },
    },
    selectNow: '今はレベル {n} で、{leds}が点いています。',
    cup: {
      idle: '注ぎ口の下のカップ。空で待機中',
      empty: '注ぎ口の下のカップ。空',
      filling: '注ぎ口の下のカップ。レベル {n} で注いでいます',
      filled: '注ぎ口の下のカップ。レベル {n} で注ぎ終わりました',
    },
    status: { reduced: '{level} · ポンプ {s} 秒', auto: '自動で動作中 · {level}', pick: 'あなたの選択 · {level}' },
    resume: '自動で動かす',
    levelsAria: 'レベルを選ぶ',
    railAria: '注ぐサイクル',
    again: 'もう一杯',
    schemaAria: '部品の状態',
    comps: {
      ir: { label: '赤外線', full: '赤外線の衝突検知モジュール' },
      servo: { label: '扉', full: 'ボタンの上のサーボの扉' },
      led: { label: 'LED', full: 'カップを照らす高出力 LED' },
      pump: { label: 'ポンプ', full: 'リレーで切り替える DC ポンプ' },
    },
    states: { watching: '監視中', triggered: '反応', closed: '閉', open: '開', on: 'オン', off: 'オフ', running: '動作中' },
  },
};

export default ja;
