import type { BrolocatorCopy } from './en';

/* The LoRA Messenger article's Spanish words. */
const es: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: 'Mi primera PCB, un aparato de mano con ESP32 que envía texto por LoRa sin internet y hace voz full-duplex básica por ESP-NOW, con una placa en KiCAD, una carcasa de Onshape impresa en 3D y firmware en PlatformIO.',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'El aparato de mano LoRA Messenger',
    back: 'Volver a proyectos',
    tag: 'Proyecto personal',
    title: <>LoRA <em>Messenger</em></>,
    lead: 'Fue mi primera PCB y mi primer proyecto con ESP32: un par de aparatos de mano que se mandan mensajes de texto por LoRa sin internet y hacen voz bidireccional full-duplex, bastante básica, por ESP-NOW cuando están a su alcance. Mientras lo construía lo llamaba Brolocator.',
    builtWith: 'Hecho con',
    links: ['GitHub', 'Vídeo demo', 'Modelo 3D'],
  },
  chapters: 'Capítulos',
  rail: {
    Demo: 'Demo', Functionality: 'Qué hace', ProjectDevelopment: 'Desarrollo', Code: 'Código',
    PCBDesign: 'PCB', threeDDesign: 'Carcasa', Assembly: 'Montaje',
  },
  demo: { h: 'Demo', video: 'Vídeo de demo de LoRA Messenger' },
  features: {
    h: 'Qué hace',
    items: [
      'Envía mensajes de texto por LoRa a largas distancias',
      'Hace voz bidireccional por ESP-NOW cuando el otro aparato está a su alcance',
      'Funciona con baterías LiPo recargables',
      'Tiene dos pantallas',
      'Tiene un modo de prueba de alcance',
      'Usa un menú sencillo',
    ],
    p: 'Las dos radios hacen trabajos distintos, porque LoRa llega más lejos pero solo lleva paquetes cortos de texto, mientras que ESP-NOW tiene poco alcance pero es lo bastante rápido para una voz bidireccional básica. La demo de abajo enseña las dos.',
    alts: [
      'La parte delantera de LoRA Messenger',
      'El lateral de LoRA Messenger',
      'Primer plano de las pantallas',
      'El menú',
      'La pantalla de mensajes',
      'El modo de prueba de alcance',
    ],
  },
  demoWidget: {
    texts: [
      'Voy de camino, dame 10',
      'Encontré el sendero',
      'Batería al 40%, vuelvo',
      'Campamento tras la cresta',
    ],
    radio: {
      lora: {
        label: 'Texto por LoRa',
        short: 'LoRa',
        range: 'Larga distancia',
        carries: 'Textos cortos',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa llega mucho más lejos que ESP-NOW, pero solo tiene ancho de banda para texto.',
      },
      espnow: {
        label: 'Voz por ESP-NOW',
        short: 'ESP-NOW',
        range: 'Corto y directo',
        carries: 'Voz full-duplex básica',
        module: 'El propio ESP32',
        blurb: 'ESP-NOW es un enlace directo entre los dos ESP32, lo bastante rápido para una voz bidireccional básica, pero solo a corta distancia.',
      },
    },
    quote: ['«', '»'] as [string, string],
    modesAria: 'Elige un enlace de radio',
    replay: 'Ver la demo',
    you: 'Tú',
    friend: 'Amigo',
    screen: {
      pick: 'Elige mensaje', sending: 'Enviando', delivered: 'Entregado',
      micLive: 'Mic activo', holdToTalk: 'Pulsa y habla',
      newMessage: 'Nuevo mensaje', receiving: 'Recibiendo', standingBy: 'En espera', listening: 'Escuchando',
    },
    link: {
      inFlight: 'Paquete en vuelo', delivered: 'Entregado', longRange: 'Largo alcance',
      streaming: 'Voz en ambos sentidos', direct: 'Enlace directo',
    },
    pickLabel: 'Elige un mensaje y envíalo',
    send: 'Enviar por LoRa',
    holdLabel: 'Mantén para hablar',
    transmitting: 'Transmitiendo',
    holdToTalk: 'Pulsa y habla',
    gauge: { range: 'Alcance', carries: 'Lleva', radio: 'Radio' },
  },
  dev: {
    h: 'Desarrollo',
    p: 'Fue mi primera inmersión a fondo en los microcontroladores y mi primera PCB, así que aprendí a usar cada componente con ayuda de YouTube y ChatGPT.',
    alt: 'Prototipo en protoboard con el ESP32, el módulo LoRa, el micrófono y el altavoz I2S, dos pantallas OLED, un encoder rotativo y botones',
    caption: 'El prototipo en protoboard con un ESP32 DevKit, un módulo LoRa Ebyte E220-900D, un micrófono y un altavoz I2S, dos pantallas OLED I2C, un encoder rotativo y botones',
  },
  code: {
    h: 'Código',
    p: 'Escribí el firmware del ESP32 en PlatformIO, que según lo que investigué era lo que mejor encajaba con el ESP32. El código está en GitHub, y el proyecto completo de PlatformIO está aquí abajo.',
    alt: 'El firmware abierto en PlatformIO',
    project: { title: 'Proyecto de PlatformIO', text: 'Este es el proyecto completo del firmware, listo para abrir en PlatformIO.', button: 'Descargar el proyecto' },
    repo: { title: 'Código en GitHub', text: 'El código fuente del firmware está en GitHub.', button: 'Ver el código en GitHub' },
  },
  pcb: {
    h: 'PCB',
    p: 'Diseñé la placa en KiCAD para que llevara todos los componentes.',
    schematicAlt: 'Esquemático en KiCAD',
    schematicCaption: 'Esquemático',
    layoutAlt: 'Diseño de la placa en KiCAD',
    layoutCaption: 'Diseño de la placa',
    finishedAlt: 'La PCB terminada',
    files: { title: 'Archivos de KiCAD', text: 'Este es el proyecto completo de KiCAD de la placa.', button: 'Descargar los archivos de KiCAD' },
  },
  case: {
    h: 'Carcasa',
    p: 'Modelé la carcasa en Onshape y la imprimí en 3D, y el modelo en vivo está enlazado aquí abajo.',
    figs: [
      { alt: 'Modelo de la carcasa en Onshape', caption: 'La carcasa en Onshape' },
      { alt: 'Versiones impresas de la carcasa una al lado de otra', caption: 'Las versiones impresas de la carcasa' },
      { alt: 'Los clips de la carcasa antes y después de reforzarlos', caption: 'Los clips de la carcasa antes y después de reforzarlos' },
    ],
    model: { title: 'Modelo de Onshape', text: 'Este es el modelo 3D en vivo de la carcasa.', button: 'Abrir el modelo 3D en Onshape' },
  },
  assembly: {
    h: 'Montaje',
    figs: [
      { alt: 'Todos los componentes soldados a la PCB', caption: 'Todos los componentes soldados a la PCB y funcionando' },
      { alt: 'Metiendo la PCB en la carcasa', caption: 'Metiendo la PCB en la carcasa' },
      { alt: 'El LoRA Messenger terminado', caption: 'El LoRA Messenger terminado' },
    ],
  },
};
export default es;
