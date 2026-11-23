import type { CadMouseCopy } from './en';

/* The 3D CAD Mouse article's Spanish words. */
const es: CadMouseCopy = {
  meta: {
    title: 'Ratón CAD 3D | Braven Chiam',
    description: 'Un ratón 3D inalámbrico para Onshape hecho con una M5Stack Capsule. Haces clic en su botón y la giras en la mano, y el modelo de la pantalla gira con ella, porque la Capsule se hace pasar por un SpaceMouse de 3Dconnexion por Bluetooth.',
    ogDescription: 'Gira una M5Stack Capsule en la mano y el modelo de Onshape gira con ella.',
  },
  ld: {
    headline: 'Ratón CAD 3D',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', 'ratón 3D', 'Onshape'],
  },
  hero: {
    alt: 'La M5Stack Capsule v1.1 de pie, con su etiqueta de pines de colores hacia delante y el puerto USB-C abajo',
    back: 'Volver a proyectos',
    tag: 'Proyecto de prácticas',
    title: <>Ratón CAD <em>3D</em></>,
    lead: 'Convertí una M5Stack Capsule en un ratón 3D inalámbrico para Onshape. Haces clic en su botón y la giras en la mano, y el modelo de la pantalla gira con ella, como si tuvieras la pieza en la mano.',
    builtWith: 'Hecho con',
    burnerTitle: 'El firmware todavía no está en M5Burner',
    burner: 'Instalar con M5Burner',
    burnerSoon: 'Pronto',
    meta: 'Proyecto de prácticas en M5Stack, noviembre de 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.',
  },
  chapters: 'Capítulos',
  rail: {
    demo: 'Demo', try: 'Pruébalo', use: 'Cómo se usa', how: 'Cómo funciona',
    spacemouse: 'Pasar por un SpaceMouse', turning: 'Seguir tu mano', stopping: 'Pararse limpio',
    hardware: 'Hardware', setup: 'Móntate uno',
  },
  demo: {
    h: 'Demo',
    p: 'Lo grabé en mi escritorio con una de mis carcasas abierta en Onshape. Con el giro activado, la pieza gira y se inclina a la vez que giro la Capsule, y si mantengo el botón puedo deslizar la pieza por la pantalla y hacer zoom en sus botones.',
    video: 'Girando una carcasa naranja en Onshape al girar la Capsule en la mano, y luego desplazándola y haciendo zoom en sus botones',
    moments: [
      { label: 'Girar la pieza', note: 'El giro está activado, así que la pieza gira y se inclina con mi mano' },
      { label: 'Darle la vuelta', note: 'Inclinando del todo la Capsule se ve la parte de abajo' },
      { label: 'Deslizarla', note: 'Manteniendo el botón, la pieza se desplaza a un lado y vuelve' },
      { label: 'Hacer zoom', note: 'Retorciéndola mientras la mantengo, hace zoom en los botones y vuelve' },
    ],
  },
  try: {
    h: 'Pruébalo',
    p: 'Esta copia ejecuta la lógica del botón de la Capsule, con tu puntero en lugar de tu mano. La parte de arriba de la Capsule es su botón, así que haz clic para activar el giro y mueve el puntero sobre la vista para girar la pieza, mantenlo para desplazarla y haz doble clic para encuadrarla de nuevo.',
    note: 'La Capsule de verdad mide lo rápido que gira tu mano, así que la pieza gira el mismo ángulo que tu mano. Aquí el movimiento del puntero hace ese papel.',
  },
  sim: {
    led: {
      ready: 'Parpadeo verde: conectado, sin giro',
      rotate: 'Cian: giro activado',
      pan: 'Ámbar: desplazando',
      fit: 'Destello blanco: encuadrar',
    },
    status: {
      demo: 'Reproduciendo una demo con el giro activado. Toca el botón de la Capsule para tomar el control.',
      pan: 'Desplazando mientras mantienes. Mueve para deslizar la pieza y usa la rueda para hacer zoom, que en la de verdad es retorcerla.',
      rotate: 'El giro está activado. Mueve el puntero sobre la vista y la pieza gira con él. Haz clic otra vez para pararlo.',
      off: 'El giro está desactivado. Haz clic en el botón para empezar, mantenlo para desplazar o haz doble clic para encuadrar.',
    },
    viewport: 'Una carcasa de mano naranja en una vista de CAD, girada por la Capsule',
    button: 'El botón de la Capsule: clic para activar o desactivar el giro, mantener para desplazar, doble clic para encuadrar',
    reset: 'Reiniciar',
  },
  use: {
    h: 'Cómo se usa',
    p1: 'Sostienes la Capsule de pie, con la etiqueta hacia ti y el puerto USB abajo, y su único botón lo hace todo.',
    parts: [
      { b: 'Clic para girar', s: 'Un clic activa el giro y la luz se pone cian. A partir de ahí el modelo sigue tu mano hasta que vuelves a hacer clic. El giro empieza 0,3 segundos después del clic, que es lo que espera para descartar un doble clic.' },
      { b: 'Mantén para mover y ampliar', s: 'Si mantienes el botón, el giro se pausa y en su lugar desplazas la vista, con la luz en ámbar. Apuntar la Capsule a la izquierda, a la derecha, arriba o abajo desliza el modelo hacia ese lado, y retorcerla hace zoom. El giro vuelve cuando sueltas.' },
      { b: 'Doble clic para encuadrar', s: 'Un doble clic encaja todo el modelo en la pantalla, y el giro se queda como estaba.' },
    ],
    p2: 'La luz respira en azul mientras espera a un ordenador y parpadea en verde cada pocos segundos cuando ya está conectada. Un pitido agudo significa que el giro está activado y uno más grave que está desactivado, y la Capsule se apaga sola después de mucho rato sin usarla.',
  },
  how: {
    h: 'Cómo funciona',
    p: 'La Capsule tiene un giroscopio y un acelerómetro en su IMU, un botón y Bluetooth, que es todo lo que necesita un ratón 3D. Lo difícil fue conseguir que Onshape le hiciera caso.',
  },
  spacemouse: {
    h: 'Pasar por un SpaceMouse',
    p: 'Onshape solo acepta un ratón 3D a través del driver de 3Dconnexion, la empresa que fabrica el SpaceMouse. Así que la Capsule se presenta por Bluetooth como su SpaceMouse Wireless, con los IDs de ese modelo y la misma estructura en sus informes, y el driver hace el resto. No hay que instalar nada dentro de Onshape. Monté la parte de Bluetooth sobre el código de un air mouse que había hecho antes, que ya funcionaba con Windows y con macOS.',
  },
  turning: {
    h: 'Seguir tu mano',
    p1: 'Un SpaceMouse de verdad informa de cuánto empujas su tapa, y el driver lo convierte en velocidad. La Capsule, en cambio, envía lo rápido que gira tu mano, según su giroscopio, así que el driver gira el modelo el mismo ángulo que giró tu mano. Se siente como sostener la pieza en lugar de dirigirla.',
    p2: 'El acelerómetro solo averigua dónde está abajo. Eso mantiene los ejes nivelados la agarres como la agarres, así que girarla sobre la vertical siempre gira el modelo sobre la vertical de la pantalla. No lo usé para mover el modelo, porque una posición calculada con un acelerómetro se desvía en menos de un segundo, y por eso el desplazamiento sale de apuntar con la Capsule.',
  },
  stopping: {
    h: 'Pararse limpio',
    p1: 'Al pulsar el botón, la salida se congela al instante, así que el tirón del pulgar y el frenazo de la mano nunca llegan al modelo. Mientras tu mano se mueve, la Capsule envía un informe 62,5 veces por segundo, igual que el SpaceMouse de verdad. Cuando se para, sigue enviando ceros hasta que pasan tres, porque si se perdiera el último informe el modelo se quedaría girando, y luego se calla.',
    p2: 'Las cuentas del movimiento y los gestos del botón están en una librería sin código de hardware, así que 19 tests unitarios las comprueban en un ordenador antes de cada flasheo.',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'M5Stack Capsule v1.1', s: 'es todo el aparato, sin añadir nada. Su ESP32-S3 ejecuta el firmware y el Bluetooth, su IMU BMI270 lee el giroscopio 200 veces por segundo, y su LED RGB y su zumbador dan la respuesta.' },
      { b: 'El botón', s: 'de arriba de la Capsule hace los tres gestos.' },
      { b: 'Una batería de 250 mAh', s: 'dentro la mantiene inalámbrica, y se apaga sola cuando lleva un rato sin moverse.' },
    ],
    holdAlt: 'Sosteniendo la Capsule delante del monitor mientras la carcasa de Onshape gira con ella',
    holdCaption: 'Girando la carcasa en la demo',
  },
  setup: {
    h: 'Móntate uno',
    steps: [
      <>Instala en tu ordenador el driver gratuito de 3Dconnexion, 3DxWare. Incluye la parte que deja que Onshape en el navegador escuche a un ratón 3D.</>,
      <>Flashea el firmware en una Capsule v1.1 con M5Burner. Todavía no está en M5Burner, así que este paso llegará pronto.</>,
      <>Abre los ajustes de Bluetooth de tu ordenador y empareja <b>Capsule CAD Mouse</b>. Hace un pitidito cuando se conecta.</>,
      <>Abre un modelo en Onshape, haz clic en el botón y gira la Capsule.</>,
    ],
    note: 'De momento solo lo he probado en Onshape. Otros programas que usan un SpaceMouse a través de 3DxWare deberían funcionar igual, pero todavía no los he probado, y no he medido cuánto dura la batería.',
  },
};
export default es;
