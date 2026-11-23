import type { RecsCopy } from './en';

/* The recommendation cards in Spanish: a copy of en.ts with the words translated. */
const es: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'Un lector de contadores de agua con batería, donde un pipeline DrumNet de 693K parámetros en un ESP32-S3 lee los rodillos y envía la lectura por LoRaWAN, montado en una PCB propia diseñada en KiCad dentro de una carcasa impresa en 3D.',
    alt: 'OCR Reader con DrumNet, una solución de OCR para contadores de agua',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'Un rover 5G con tres cámaras en directo, GPS, un puntero láser y siete sensores, que se conduce desde una consola web.',
    alt: 'El rover de Project June',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'Una mascota de escritorio en una M5Stack Tab5 cuyo cerebro es el DeepSeek Harness de mi servidor, así que puede manejar un navegador, crear sus propias apps y vigilar a mis otros agentes.',
    alt: 'Pip, una mascota de escritorio cian, en la M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'Un LiDAR improvisado: cuatro sensores de distancia en la cabeza de Stack-chan, que sus servos pasean por una habitación, mientras su cámara colorea un escaneo 3D que puedes explorar en el navegador.',
    alt: 'Stack-chan con cuatro sensores de distancia Unit ToF4M en la cabeza',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'Un lector de libros online privado y solo por invitación, con presencia en directo, la lectura guardada de cada lector, un filtro de contenido impuesto con SQL, webtoons y estadísticas de lectura compartidas, hecho con Next.js y Supabase.',
    alt: 'BeadReader, un lector de libros privado',
  },
  'proj-pantry': {
    title: 'Control de caducidad',
    blurb: 'Un control de caducidad para la puerta de la nevera con un M5Stack CoreS3 SE y un módulo QRCode: escaneas un código de barras, eliges cuándo caduca y ves qué comer primero, con avisos en Home Assistant.',
    alt: 'El control de caducidad, un CoreS3 SE apilado sobre el módulo QRCode',
  },
  'proj-ruler': {
    title: 'Regla Scroll',
    blurb: 'Una regla digital hecha con un M5Stack AtomS3R y una Unit Scroll: aprieta la rueda, hazla rodar a lo largo de algo y la pantalla te dice cuánto mide, tras calibrarla una vez con 10 cm.',
    alt: 'La Regla Scroll, un AtomS3R con una Unit Scroll conectada',
  },
  'proj-cadmouse': {
    title: 'Ratón CAD 3D',
    blurb: 'Una M5Stack Capsule convertida en ratón 3D inalámbrico para Onshape: haz clic en su botón, gírala en la mano y el modelo de la pantalla gira con ella.',
    alt: 'La M5Stack Capsule v1.1 que hace de ratón 3D',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Dos dispositivos de mano con ESP32 que envían texto por LoRa y voz bidireccional básica por ESP-NOW, en mi primera PCB, diseñada en KiCAD, con una carcasa modelada en Onshape.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'Un asistente de voz para una habitación inteligente en un ESP32, donde Whisper y un LLM de DeepSeek a través de OpenRouter convierten la voz en un solo comando JSON enviado por MQTT.',
    alt: 'El asistente de voz LUMEN',
  },
  'proj-ema': {
    title: 'EMA Smart Home',
    blurb: 'Una casa inteligente en equipo, con nota A, donde cuatro nodos BeagleBone Black informan a un servidor SocketIO con un panel 3D de Spline en directo.',
    alt: 'El sistema EMA Smart Home',
  },
  'proj-pandus': {
    title: 'Pandus Dispenser',
    blurb: 'Mi primer proyecto escolar fue un dispensador de sirope impreso en 3D, de seis piezas y controlado por un Arduino Uno y PyFirmata.',
    alt: 'Pandus Dispenser',
  },
  'proj-elecf': {
    title: 'ELEC-F Concept',
    blurb: 'Una alarma para cámaras frigoríficas con M5Stack. Si alguien está dentro cuando se cierra la puerta, empieza un temporizador y la alarma suena cuando se acaba.',
    alt: 'ELEC-F Concept',
  },
  'proj-kauli': {
    title: 'Kauli Concept',
    blurb: 'Un concepto de producto que presenté para una asignatura de comunicación, renderizado en Blender.',
    alt: 'Kauli Concept',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'Una carcasa ultraligera de ratón gaming basada en el ZeroMouse, que quiero dejar en unos 20 g.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: 'Una recreación en KiCAD de la placa de desarrollo de mi escuela, porque no podía llevarme la original a casa.',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Proyecto web',
    blurb: 'Mi primera web totalmente funcional, hecha con HTML y CSS como trabajo final de mi clase de desarrollo web.',
    alt: 'Proyecto de desarrollo web',
  },
  'proj-mc': {
    title: 'Mapa vivo de Minecraft',
    blurb: 'Un servidor Paper en Docker en mi homelab, con un Dynmap del mundo en directo.',
    alt: 'Mapa vivo de Minecraft',
  },
};
export default es;
