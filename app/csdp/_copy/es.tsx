import type { CsdpCopy } from './en';

/* The EMA Smart Home article's Spanish words. The PDFs themselves stay in English. */
const es: CsdpCopy = {
  meta: {
    title: 'EMA Smart Home | Braven Chiam',
    description: 'Un sistema de casa inteligente que construimos en un equipo de cinco en clase y que sacó una A. Cuatro nodos BeagleBone Black Wireless se ocupan del clima, el baño, la cocina y la puerta, y un servidor web SocketIO los conecta y aloja un panel en directo con una vista 3D de Spline.',
  },
  ld: { headline: 'EMA Smart Home' },
  hero: {
    alt: 'EMA Smart Home',
    back: 'Volver a proyectos',
    tag: 'Proyecto escolar, equipo de cinco',
    title: <>EMA Smart <em>Home</em></>,
    lead: 'Es un sistema de casa inteligente hecho con cuatro placas BeagleBone Black Wireless para reducir la energía que gasta una casa. Fue el proyecto en grupo más complejo en el que he trabajado, tiraba de varias de nuestras asignaturas, y sacamos una A.',
    builtWith: 'Hecho con',
    links: { demo: 'Demo en vivo', github: 'GitHub', video: 'Vídeo promo' },
  },
  chapters: 'Capítulos',
  rail: {
    PromoVideo: 'Vídeo', Team: 'Equipo', ProjBackground: 'Encargo', DesignProcess: 'Panel',
    Climate: 'Nodo de clima', Bathroom: 'Nodo de baño', Kitchen: 'Nodo de cocina', Intrusion: 'Nodo de intrusión',
    Connectivity: 'Conectividad', SlideDeck: 'Diapositivas', Documentation: 'Documentación',
  },
  video: { h: 'Vídeo', title: 'Vídeo promocional de EMA Smart Home' },
  team: {
    h: 'Equipo',
    roles: ['Líder, docs, código', 'Arte, código, diseño', 'Docs, código', 'Docs, código', 'Miembro del equipo'],
    me: '{name} (yo)',
    profile: 'Perfil',
    noProfile: 'Sin perfil',
  },
  brief: {
    h: 'Encargo',
    p: 'Nos dieron cuatro placas BeagleBone Black Wireless y un juego de módulos click MikroBUS, y nos pidieron construir un sistema conectado por Wi-Fi que ayudara a vivir de forma sostenible. Construimos un sistema de casa inteligente que vigila el consumo de energía en tiempo real y enciende o apaga aparatos para gastar menos, y luego añadimos un nodo de detección de intrusos.',
    alt: 'Dónde va cada placa en la casa',
    caption: 'Dónde va cada placa en la casa',
  },
  dashboard: {
    h: 'Panel',
    p: <>Casi todo el proyecto era software, así que el trabajo de diseño se centró en que el panel fuera claro, legible y fácil de entender de un vistazo. También añadimos un modelo 3D de la casa en Spline que muestra cada acción en el momento, y puedes probarlo tú mismo en la <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">demo en vivo</a>.</>,
    mockAlt: 'Maqueta del panel en Figma',
    mockCaption: 'Maqueta del panel en Figma',
    finishedCaption: 'El panel terminado',
    splineCaption: 'La vista 3D de Spline mostrando las acciones en directo',
  },
  nodes: {
    Climate: {
      h: 'Nodo de clima',
      p: 'El nodo de clima vigila la temperatura, la humedad y si hay alguien en la habitación, y solo enciende el ventilador cuando detecta a una persona y la habitación está caliente y húmeda.',
      alt: 'El hardware del nodo de clima',
    },
    Bathroom: {
      h: 'Nodo de baño',
      p: 'Con los botones y la pantalla eliges cuánto quieres que dure tu ducha. El temporizador empieza cuando el nodo detecta que entras en la ducha, y suena un zumbador cuando se acaba el tiempo.',
      alt: 'El hardware del nodo de baño',
    },
    Kitchen: {
      h: 'Nodo de cocina',
      p: 'El nodo de cocina vigila el consumo de energía de la nevera y envía una puntuación de energía al panel. También hace de alarma de incendios, así que si detecta un fuego descontrolado, la alarma suena en todos los nodos.',
      alt: 'El hardware del nodo de cocina',
    },
    Intrusion: {
      h: 'Nodo de intrusión',
      p: 'El nodo de intrusión detecta golpes en la puerta y que la puerta se abra a horas raras, y cuando pasa cualquiera de las dos cosas hace sonar una alarma en todos los nodos.',
      alt: 'El hardware del nodo de intrusión',
    },
  },
  connectivity: {
    h: 'Conectividad',
    p: [
      'Cada placa se conecta a un servidor web SocketIO, que aloja el panel y coordina los eventos y las alarmas entre los nodos.',
      'El mapa de abajo muestra los cuatro nodos y el servidor. Elige un nodo para ver qué hace, o simula un incendio en la cocina para ver cómo la alarma llega a todos los nodos.',
    ],
    diagramAlt: 'Diagrama de cómo se conectan los nodos, el servidor y el panel',
    diagramCaption: 'Cómo se conectan los nodos, el servidor y el panel',
    repoTitle: 'Código en GitHub',
    repoText: 'El repositorio tiene el código de cada nodo y del servidor SocketIO que aloja el panel.',
    repoButton: 'Ver el código en GitHub',
  },
  slides: { h: 'Diapositivas', title: 'Diapositivas de EMA Smart Home (PDF)', open: 'Abrir las diapositivas (PDF)' },
  docs: { h: 'Documentación', title: 'Documentación de EMA Smart Home (PDF)', open: 'Abrir la documentación (PDF)' },

  nodeMap: {
    nodes: {
      climate: {
        name: 'Clima',
        short: 'Ventilador',
        does: 'Solo enciende el ventilador cuando hay alguien en la habitación y el aire está caliente y húmedo.',
        hardware: 'Sensor de temperatura y humedad BME680, sensor de presencia PIR, matriz LED de 8x8, zumbador',
        alarm: 'Suena siempre que cualquier nodo da la alarma',
      },
      bathroom: {
        name: 'Baño',
        short: 'Tiempo de ducha',
        does: 'Cronometra tu ducha con la duración que fijas con los botones, y empieza cuando entras.',
        hardware: 'Sensor PIR, pantalla OLED, botones capacitivos, zumbador',
        alarm: 'Toca tres tonos cuando se acaba el tiempo',
      },
      kitchen: {
        name: 'Cocina',
        short: 'Energía y fuego',
        does: 'Envía al panel el consumo de energía de la nevera como una puntuación y vigila si hay fuego.',
        hardware: 'Sensor de corriente analógico, Flame Click, pantalla OLED, zumbador',
        alarm: 'Un fuego hace saltar la alarma en todos los nodos',
      },
      intrusion: {
        name: 'Intrusión',
        short: 'Vigila la puerta',
        does: 'Vigila si llaman a la puerta y si la puerta se abre a horas raras.',
        hardware: 'Interruptor reed en la puerta, sensor de vibración para los golpes, zumbador',
        alarm: 'Cualquiera de los dos hace saltar la alarma en todos los nodos',
      },
    },
    hub: { label: 'Servidor web', idle: 'SocketIO, aloja el panel', alarm: 'Alarma enviada a todos los nodos' },
    nodeAria: 'Nodo {name}',
    nodeAriaAlarm: 'Nodo {name}, alarma sonando',
    alarmTag: 'Alarma',
    caption: 'Cada línea es un enlace SocketIO, y los puntos son lecturas de camino al servidor.',
    eyebrow: { pinned: 'Nodo elegido', idle: 'Elige un nodo' },
    tabsAria: 'Nodos de sensores',
    cardTitle: 'Nodo {name}',
    terms: { does: 'Hace', hardware: 'Hardware', buzzer: 'Zumbador' },
    status: {
      idle: 'Conectado y enviando lecturas al servidor',
      arming: 'La cocina ve una llama y su zumbador suena',
      travelling: 'La alarma va de camino al servidor',
      received: 'El servidor difunde la alarma y suenan todos los nodos',
    },
    sim: { run: 'Simular fuego en la cocina', busy: 'Alarma en curso' },
    hint: 'Cuando el nodo de cocina detecta una llama, el servidor recibe la alarma y la reenvía a todos los nodos.',
  },
};
export default es;
