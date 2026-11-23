import type { LidarCopy } from './en';

/* The Stack-chan LiDAR article's Spanish words. */
const es: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Un LiDAR hecho con el Stack-chan de M5Stack, que pasea cuatro sensores de distancia Unit ToF4M por una habitación con sus servos, colorea los puntos con su cámara y muestra el escaneo en 3D en cualquier navegador.',
    ogDescription: 'Stack-chan pasea cuatro sensores de distancia por una habitación y convierte las lecturas en un escaneo 3D a color que puedes explorar.',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'nube de puntos', 'escaneo 3D', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: 'El barrido', colour: 'Color', demo: 'Demo', play: 'Pruébalo', setup: 'Hazte uno' },
  chaptersLabel: 'Capítulos',
  hero: {
    alt: 'Stack-chan dibujado a partir de los modelos de M5Stack, con cuatro sensores Unit ToF4M en cuadrado encima de la cabeza',
    back: 'Volver a proyectos',
    tag: 'Proyecto de prácticas',
    featured: 'Destacado',
    title: 'Stack-chan LiDAR',
    lead: 'Convertí a Stack-chan en un LiDAR poniéndole cuatro sensores de distancia en la cabeza y dejando que sus servos los pasearan por una habitación. Su cámara colorea los puntos, y cualquier navegador de la misma Wi-Fi muestra el escaneo en 3D mientras se va formando.',
    builtWith: 'Hecho con',
    flash: 'Flashear firmware',
    meta: 'Proyecto de prácticas en M5Stack, noviembre de 2026. Stack-chan (CoreS3), PaHub, cuatro Unit ToF4M, C++ y WebGL.',
    cue: 'Desliza para escanear',
  },
  sweep: {
    alt: 'Por encima del hombro de Stack-chan, el cono de su sensor llega a la pared mientras el escaneo se va rellenando por la habitación',
    caps: [
      { title: 'Barriendo la habitación', p: 'Stack-chan gira la cabeza por la habitación unos pocos grados cada vez y se para en cada paso a medir a qué distancia está la pared. Los servos dan la dirección y los sensores la distancia, así que cada paso añade un punto en 3D. Este es el escaneo real de la demo, rellenándose a medida que la cabeza gira.' },
      { title: 'Quick, Normal o Fine', p: 'Antes de escanear elijo Quick, Normal o Fine. Quick termina en menos de un minuto, y Fine tarda más pero capta muchísimo más detalle.' },
    ],
  },
  colour: {
    alt: 'El escaneo terminado visto desde fuera de la habitación, con los colores de la cámara',
    caps: [
      { title: 'Color desde su cámara', p: 'Antes del barrido, Stack-chan hace fotos de la zona con la cámara de la CoreS3. Luego el navegador coloca cada píxel de esas fotos a la distancia que midieron los sensores en esa dirección, y así una cuadrícula de lecturas se convierte en 68.206 puntos de color.' },
      { title: 'Alinear las fotos', p: 'La cámara está debajo de los sensores, así que las fotos y las distancias se toman desde sitios un poco distintos. Las alineé haciendo coincidir los bordes de la profundidad con los bordes de las fotos, y ahora los colores caen en su sitio en casi toda la habitación, aunque no en todas partes.' },
    ],
  },
  demo: {
    h: 'Demo',
    p: 'Puse a Stack-chan en una mesa en la esquina de una habitación vacía y empecé un escaneo desde mi portátil. El vídeo muestra la cabeza barriendo mientras los puntos se acumulan en el navegador, y luego el escaneo terminado desde todos los lados, primero coloreado por distancia y después con la cámara.',
    video: 'Stack-chan barriendo la esquina de una habitación mientras la nube de puntos crece en el navegador, y luego el escaneo terminado en profundidad y con el color de las fotos',
    moments: [
      { label: 'El barrido', note: 'La cabeza recorre la esquina mientras se rellenan los puntos' },
      { label: 'El escaneo final', note: 'Las paredes y el techo de la esquina, vistos desde fuera' },
      { label: 'Profundidad', note: 'Cada punto coloreado según lo lejos que está' },
      { label: 'Color de foto', note: 'Los mismos puntos coloreados con las fotos de Stack-chan' },
    ],
  },
  play: {
    h: 'Prueba el escaneo',
    stillAlt: 'El escaneo terminado visto desde arriba: las paredes y el techo de la esquina de una habitación, con una caja azul sobre la mesa',
  },
  pg: {
    view: 'Una nube de puntos en 3D de la habitación que escaneó Stack-chan. Arrastra para girarla, usa la rueda o pellizca para hacer zoom, arrastra con el botón derecho para moverla y haz doble clic en un punto para volar hasta él.',
    loading: 'Cargando el escaneo',
    hintTouch: 'Arrastra para girar y pellizca para hacer zoom',
    hintMouse: 'Arrastra para girar, rueda para zoom, botón derecho para mover',
    drop: 'Suelta un archivo .ply para abrirlo',
    stat: '{n} puntos, {size} m',
    colourBy: 'Colorear los puntos por',
    modes: ['Foto', 'Distancia', 'Altura'],
    eyeTitle: 'Verlo desde la cabeza de Stack-chan',
    eye: 'Verlo desde la cabeza de Stack-chan',
    reset: 'Volver a la vista inicial',
    full: 'Pantalla completa',
    leaveFull: 'Salir de pantalla completa',
    open: 'Abre tu propio .ply',
    upY: 'En este archivo Y es arriba',
    back: 'Volver al escaneo de Stack-chan',
    download: 'Descargar este escaneo',
    errors: {
      notPly: 'Este archivo no parece una nube de puntos .ply.',
      lists: 'No se admiten listas en los datos de vértices; exporta solo los puntos.',
      noXyz: 'No hay x, y ni z en este .ply.',
      short: 'Este .ply se acaba antes de todos sus puntos.',
      unreadable: 'No se ha podido leer ese archivo.',
    },
  },
  setup: {
    h: 'Hazte uno',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, el pequeño robot de M5Stack, que tiene una CoreS3 por cabeza sobre dos servos. Su ESP32-S3 se encarga del escaneo, el servidor web y la cámara.</>,
      <>Cuatro <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, que son sensores de distancia de tiempo de vuelo VL53L1X, montados en cuadrado encima de la cabeza.</>,
      <>Un <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, que permite que los cuatro sensores compartan un solo puerto Grove aunque todos tengan la misma dirección I2C.</>,
    ],
    photoAlt: 'El Stack-chan real con los cuatro sensores en la cabeza y sus cables Grove bajando en bucle hacia la parte de atrás',
    photoCaption: 'El Stack-chan real con sus sensores',
    steps: [
      <>Conecta un PaHub al Port A de Stack-chan y los cuatro Unit ToF4M a sus canales 0 a 3, y luego monta los sensores encima de la cabeza mirando hacia delante.</>,
      <>Abre <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> en Chrome o Edge, elige <b>Stack-chan LiDAR</b>, conecta Stack-chan por USB-C y pulsa Install.</>,
      <>Únete a la red Wi-Fi <b>StackChan-LiDAR</b> que crea y abre <b>http://192.168.4.1/</b>, que Stack-chan también muestra cuando le tocas la cara. Luego elige una zona y un nivel de detalle y empieza un escaneo.</>,
    ],
    note: 'El Stack-chan de esta página está hecho con los propios modelos 3D de M5Stack (M5_Hardware, licencia MIT).',
  },
};

export default es;
