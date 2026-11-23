import type { ScrollRulerCopy } from './en';

/* The Scroll Ruler article's Spanish words. The AtomS3R's screens keep the firmware's own English. */
const es: ScrollRulerCopy = {
  meta: {
    title: 'Regla Scroll | Braven Chiam',
    description: 'Una regla digital hecha con un M5Stack AtomS3R y una Unit Scroll durante mis prácticas en M5Stack. Presionas la rueda y la haces rodar sobre lo que quieras medir, y la pantalla muestra la distancia en centímetros después de calibrarla una sola vez con 10 cm.',
    ogDescription: 'Haz rodar la Unit Scroll sobre algo y el AtomS3R te dice cuánto mide.',
  },
  ld: {
    headline: 'Regla Scroll',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'encoder rotativo', 'regla digital'],
  },
  hero: {
    alt: 'La Regla Scroll: un AtomS3R sobre su Atomic Battery Base, con la Unit Scroll conectada debajo y la pantalla marcando 0,0 cm',
    back: 'Volver a proyectos',
    tag: 'Proyecto de prácticas',
    title: <>Regla <em>Scroll</em></>,
    lead: 'Hice esta regla digital durante mis prácticas en M5Stack con un AtomS3R y una Unit Scroll. Presionas la rueda y la haces rodar sobre lo que quieras medir, y la pantalla muestra la distancia en centímetros.',
    builtWith: 'Hecho con',
    links: ['GitHub', 'Flashear firmware'],
    meta: 'Proyecto de prácticas en M5Stack, noviembre de 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.',
  },
  chapters: 'Capítulos',
  rail: {
    demo: 'Demo', try: 'Pruébalo', use: 'Cómo se usa', measure: 'Medir', calibrate: 'Calibrar',
    steps: 'Su precisión', how: 'Cómo funciona', hardware: 'Hardware', setup: 'Móntate una',
  },
  demo: {
    h: 'Demo',
    p: 'Lo grabé en mi escritorio: primero la calibro con 10 cm de una regla y luego mido tres longitudes sobre esa misma regla.',
    video: 'La Regla Scroll calibrada con 10 cm de una regla, midiendo luego 4,1, 8,2 y 7,3 cm',
    moments: [
      { label: 'Calibrando con 10 cm', note: 'Contó 49 pasos de la rueda, unos 2 mm por paso' },
      { label: 'La primera pasada', note: 'Rodando sobre la regla, marca 4,1 cm' },
      { label: 'La segunda pasada', note: 'Una pasada más larga marca 8,2 cm' },
      { label: 'La tercera pasada', note: 'La última pasada marca 7,3 cm' },
    ],
  },
  try: {
    h: 'Pruébalo',
    p: 'Esta copia de la regla ejecuta la misma lógica que el firmware y empieza en su pantalla de calibración. Arrastra la Unit Scroll sobre la regla para hacerla rodar con la rueda presionada, que sí cuenta, o haz clic en la regla para levantarla y ponerla en otro sitio, que no cuenta. Tocar la pantalla guarda una calibración o pone la lectura a cero, y mantenerla un segundo empieza una calibración nueva.',
    note: 'Una calibración que no sea exactamente de 10 cm desvía todas las lecturas en la misma medida, aquí igual que en la regla de verdad.',
  },
  sim: {
    reading: 'Marca {cm} centímetros.',
    readingLive: 'Marca {cm} centímetros, contando.',
    calibrating: 'Calibrando: {n} pasos por ahora. Haz rodar exactamente 10 centímetros con la rueda presionada y luego suéltala.',
    confirming: '{n} pasos para 10 centímetros. Toca la pantalla para guardarlo.',
    button: 'La pantalla del AtomS3R, que también es su botón: toca para poner a cero o guardar, mantén para volver a calibrar',
    puck: 'La Unit Scroll a {cm} cm sobre la regla. Mantén una tecla de flecha para hacerla rodar con la rueda presionada.',
    reset: 'Reiniciar',
  },
  use: {
    h: 'Cómo se usa',
    p: 'Toda la pantalla del AtomS3R es su botón, así que la regla solo tiene dos controles: la rueda, que presionas mientras la haces rodar, y la pantalla, que tocas o mantienes.',
  },
  measure: {
    h: 'Medir',
    screen: 'La pantalla de la regla mientras cuenta: RULER con una etiqueta verde LIVE, 4,1 cm en verde y 41 mm a 2,0 mm por paso',
    p1: 'Presionas la rueda y la haces rodar hacia delante, y la distancia solo cuenta mientras la rueda sigue presionada, con el LED de la Unit Scroll en verde y la lectura en verde también. Al soltar la rueda se para la cuenta, y si la haces rodar hacia atrás mientras está presionada, se resta distancia.',
    p2: 'Tocar la pantalla vuelve a poner la lectura a cero, y mantenerla más o menos un segundo empieza una calibración nueva.',
  },
  calibrate: {
    h: 'Calibrar',
    rolling: 'Calibrando: 49 pasos contados por ahora, con la indicación de presionar la rueda y hacerla rodar exactamente 10 cm',
    rollingCaption: 'Rodando los 10 cm',
    checking: 'Comprobando: 49 pasos equivalen a 10 cm, toca para guardar',
    checkingCaption: 'Soltada, lista para guardar',
    p1: 'La primera vez que arranca, y siempre que se lo pidas, la regla mide 10 cm para aprender cuánto avanza la rueda por paso. Presionas la rueda y la haces rodar exactamente 10 cm junto a una regla de verdad, luego la sueltas y tocas la pantalla para guardar los pasos que ha contado.',
    p2: 'Si vuelves a presionar la rueda, sigue sumando a la misma pasada, y si mantienes la pantalla, empieza de nuevo. La calibración se queda en la flash, así que sobrevive a un corte de corriente, y el sentido en que la hiciste rodar pasa a ser hacia delante.',
  },
  steps: {
    h: 'Con qué precisión mide',
    p: 'La rueda tiene un número fijo de pasos por vuelta, así que la regla mide a saltos de un paso y no de forma continua. La mía contó 49 pasos para 10 cm, así que cada paso son unos 2 mm, y la pantalla enseña la longitud exacta del paso debajo de cada lectura para que sepas cuánto fiarte del último dígito.',
  },
  how: {
    h: 'Cómo funciona',
    p1: 'La Unit Scroll tiene su propio chip pequeño que cuenta los pasos de la rueda y lee su botón, y el AtomS3R le pide las dos cosas por I2C a través del puerto Grove cien veces por segundo. Cada lectura devuelve los pasos desde la anterior, y solo cuentan para la distancia mientras la rueda está presionada.',
    p2: 'Dejé la lógica de la regla, que es la calibración y las cuentas de la distancia, en un archivo sin código de hardware, así que once tests unitarios la comprueban en un ordenador antes de que llegue al dispositivo. Si la Unit Scroll se desconecta, la pantalla te lo dice, y la vuelve a detectar en cuanto la conectas otra vez.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'AtomS3R', s: 'ejecuta la regla en su ESP32-S3, y su pantalla de 0,85 pulgadas también es su botón.' },
      { b: 'Atomic Battery Base', s: 'lleva la batería, así que la regla no necesita cable.' },
      { b: 'Unit Scroll', s: 'es la rueda que haces rodar, con un pulsador y un LED RGB, y se conecta al puerto Grove del AtomS3R.' },
    ],
    photoAlt: 'La regla en alto después de la segunda pasada, con la pantalla marcando 8,2 cm, encima de la regla sobre la que rodó',
    photoCaption: 'Después de la segunda pasada de la demo',
  },
  setup: {
    h: 'Móntate una',
    steps: [
      <>Apila el AtomS3R sobre la Atomic Battery Base y conecta la Unit Scroll al puerto Grove del AtomS3R.</>,
      <>Abre <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> en Chrome o Edge, elige <b>Scroll Wheel Ruler</b>, conecta el AtomS3R por USB-C y pulsa <b>Install</b>, que flashea el firmware directamente desde el navegador.</>,
      <>Arranca en la pantalla de calibración, así que presiona la rueda y hazla rodar exactamente 10 cm junto a una regla, luego suéltala y toca la pantalla para guardar.</>,
    ],
    repo: <>El <a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">repositorio de GitHub</a> tiene el código del firmware, sus tests unitarios y una descarga de la imagen del firmware por si prefieres flashearla con esptool.</>,
    note: <>El AtomS3R de esta página está renderizado a partir del propio modelo de M5Stack en <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (licencia MIT, copyright M5Stack), y sus pantallas están dibujadas según el diseño del propio firmware.</>,
  },
};
export default es;
