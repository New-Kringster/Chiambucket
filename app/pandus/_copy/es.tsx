import type { PandusCopy } from './en';

/* The Pandus Dispenser article's Spanish words. */
const es: PandusCopy = {
  meta: {
    title: 'Pandus Dispenser | Braven Chiam',
    description: 'Mi primer proyecto escolar en Nanyang Polytechnic fue un dispensador de sirope hecho con seis piezas impresas en 3D y controlado por un Arduino Uno, que programé desde Python con PyFirmata.',
    ogDescription: 'Pandus es un dispensador de sirope hecho con seis piezas impresas en 3D y controlado por un Arduino Uno con PyFirmata.',
  },
  ld: { headline: 'Pandus Dispenser' },
  hero: {
    alt: 'El dispensador de sirope Pandus',
    back: 'Volver a proyectos',
    tag: 'Proyecto escolar',
    title: <>Pandus <em>Dispenser</em></>,
    lead: 'Pandus fue mi primer proyecto escolar, un dispensador de sirope hecho con seis piezas impresas en 3D y controlado por un Arduino Uno. Lo construí con las piezas que nos dieron en clase y unas pocas que compré yo.',
    builtWith: 'Hecho con',
    links: { video: 'Vídeo demo', cad: 'Modelo 3D' },
  },
  chapters: 'Capítulos',
  rail: {
    PromotionalVideo: 'Vídeo', ProjectBackground: 'Contexto', DesignProcess: 'Diseño',
    ControlnFunction: 'Control', Coverimg: 'Portada',
  },
  video: { h: 'Vídeo', title: 'Vídeo de Pandus Dispenser' },
  background: {
    h: 'Contexto',
    p: [
      'Pandus fue mi primer proyecto grande como estudiante de primer año en Nanyang Polytechnic, y el encargo era libre, sin tema. Nos dieron un Arduino Uno, un servo 4G, LEDs, botones, interruptores deslizantes, un módulo infrarrojo de detección de colisiones y un montón de cables.',
      'Pensé en un dispensador de agua, pero alguien ya lo había elegido, así que hice un dispensador de sirope.',
    ],
    alt: 'Grabando una parte del vídeo de Pandus',
    caption: 'Grabando una parte del vídeo',
  },
  design: {
    h: 'Diseño',
    p: 'Diseñé Pandus en Onshape, y como tenía poca experiencia con él, aprender el programa me llevó mucho tiempo. No me quedó tiempo para prototipos, así que mandé el diseño final directamente a la impresora 3D, y todas las piezas encajaron a la primera.',
    explodedAlt: 'Vista explosionada del modelo de Pandus en Onshape',
    assembledAlt: 'El modelo de Pandus montado en Onshape',
    cadTitle: 'Modelo 3D',
    cadText: 'Puedes girar el modelo de Pandus en Onshape y desmontarlo.',
    cadButton: 'Abrir el modelo 3D en Onshape',
  },
  control: {
    h: 'Control',
    p: [
      'Nos enseñaron a programar el Arduino desde Python con la librería Firmata. Además de las piezas de clase, compré LEDs de alta potencia, una bomba de CC y una placa de relés, y alimenté las piezas de mucha corriente con una batería externa aparte.',
      'La demo de abajo ejecuta un ciclo de dispensado del diagrama de flujo que hay más abajo, y puedes elegir un nivel para probarlo tú.',
    ],
    alts: [
      'Diagrama de flujo en el que el sensor infrarrojo abre el servo y enciende el LED, el botón de selección fija el nivel y el botón de confirmar hace funcionar la bomba durante 3, 4 o 5 segundos',
      'Esquema del circuito con el Arduino Uno, el servo, el sensor infrarrojo, los relés, la bomba de CC, el LED de alta potencia, el zumbador, los botones y los LEDs indicadores',
      'El cableado dentro de Pandus, con la placa de relés, los botones y los LEDs indicadores',
      'La protoboard, el zumbador y el Arduino Uno dentro de Pandus',
    ],
  },
  cover: {
    h: 'Imagen de portada',
    p: 'Fotografié Pandus cuatro veces con distinta iluminación y mezclé las cuatro fotos en Photoshop para hacer la portada.',
    caption: 'Cómo se combinan las cuatro fotos en la portada',
  },

  demo: {
    level: 'Nivel {n}',
    ledText: ['el LED rojo', 'los LED rojo y amarillo', 'los tres LED'],
    pump: 'Bomba {s} s',
    phases: {
      idle: { label: 'Esperando', blurb: 'El dispensador espera a que el módulo infrarrojo de detección de colisiones detecte un vaso.' },
      wake: { label: 'Con vaso', blurb: 'Cuando un vaso activa el módulo infrarrojo, el servo gira a 180° para abrir la tapa de los botones, el LED de alta potencia se enciende y el nivel vuelve a 1.' },
      select: { label: 'Elegir', blurb: 'El botón de selección pasa por los niveles 1, 2 y 3, y los LEDs indicadores muestran cuál está elegido.' },
      pour: { label: 'Servir', blurb: 'El botón de confirmar enciende la bomba de CC a través del relé durante 3, 4 o 5 segundos, según el nivel.' },
      done: { label: 'Listo', blurb: 'La bomba se para y todo se apaga hasta el siguiente vaso.' },
    },
    selectNow: 'Ahora está en el nivel {n}, que enciende {leds}.',
    cup: {
      idle: 'Vaso bajo el caño, vacío y esperando',
      empty: 'Vaso bajo el caño, vacío',
      filling: 'Vaso bajo el caño, llenándose en el nivel {n}',
      filled: 'Vaso bajo el caño, lleno en el nivel {n}',
    },
    status: { reduced: '{level} · bomba {s} s', auto: 'Automático · {level}', pick: 'Tu elección · {level}' },
    resume: 'Modo automático',
    levelsAria: 'Elige un nivel',
    railAria: 'Ciclo de dispensado',
    again: 'Servir otro',
    schemaAria: 'Estado de los componentes',
    comps: {
      ir: { label: 'Módulo IR', full: 'Módulo infrarrojo de detección de colisiones' },
      servo: { label: 'Tapa', full: 'Tapa del servo sobre los botones' },
      led: { label: 'LED', full: 'LED de alta potencia sobre el vaso' },
      pump: { label: 'Bomba', full: 'Bomba de CC accionada por un relé' },
    },
    states: { watching: 'Vigilando', triggered: 'Activado', closed: 'Cerrada', open: 'Abierta', on: 'Encendido', off: 'Apagado', running: 'En marcha' },
  },
};
export default es;
