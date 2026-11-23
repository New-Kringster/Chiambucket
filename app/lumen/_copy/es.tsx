import type { LumenCopy } from './en';

/* The LUMEN article's Spanish words. */
const es: LumenCopy = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN es un asistente de voz para una habitación inteligente, hecho con un ESP32 sin PSRAM. La placa oye una palabra de activación y graba con un micrófono INMP441, un relé FastAPI envía el clip a Whisper y a un parser de comandos DeepSeek a través de OpenRouter, y MQTT lleva el comando a los dispositivos.',
    ogDescription: 'Un asistente de voz con ESP32 que oye la palabra de activación en la propia placa, envía el clip por un relé FastAPI a Whisper y a un parser de comandos DeepSeek, y controla la habitación por MQTT.',
  },
  ld: {
    headline: 'LUMEN, un asistente de voz con ESP32',
    description: 'Un asistente por voz para una habitación inteligente, hecho para el módulo de IoT Programming de NYP. Un ESP32 con MicroPython graba la petición, un relé FastAPI llama a OpenRouter para pasar la voz a texto con Whisper y para un parser de comandos DeepSeek, y el comando vuelve a la habitación por MQTT.',
  },
  hero: {
    alt: 'Portada de LUMEN, un asistente para casa inteligente hecho con OpenAI Whisper y DeepSeek',
    back: 'Volver a proyectos',
    tag: 'Proyecto escolar',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN es un asistente por voz para una habitación inteligente: dices «Hello Robot» o mantienes pulsado un botón y hablas. Un ESP32 graba el audio, un servidor lo transcribe y le pide a un LLM que lo convierta en un único comando JSON, y MQTT lleva ese comando a las luces, el ventilador, el servo y el zumbador. Lo más difícil fue meter todo esto en una placa con unos 33 KB de RAM libre.',
    builtWith: 'Hecho con',
  },
  chapters: 'Capítulos',
  rail: {
    overview: 'Resumen', try: 'Pruébalo', how: 'Cómo funciona', brain: 'El parser', hardware: 'Hardware',
    memory: 'Memoria', auto: 'Modo auto', deploy: 'Panel', slides: 'Diapositivas', next: 'Lo que añadiría',
  },

  overview: {
    h: 'Resumen',
    p: [
      'LUMEN fue mi miniproyecto para el módulo de IoT Programming de NYP, donde el encargo era simplemente construir un dispositivo conectado que hiciera algo útil. Quería ver qué podía hacer un ESP32 barato con comprensión real del lenguaje en lugar de una lista fija de comandos.',
      'Espera la palabra de activación, graba lo que dices y lo convierte en acciones: «baja un poco la luz», «enciende el ventilador dentro de diez minutos», «pon el brillo según la humedad», «buenas noches». El trabajo con el lenguaje se hace en un pequeño servidor, así que el ESP32 solo tiene que grabar audio y ejecutar comandos.',
    ],
    video: 'La palabra de activación, unos cuantos comandos hablados y la habitación respondiendo.',
  },

  try: {
    h: 'Pruébalo',
    p: 'Esta demo sigue el mismo camino que el sistema real a pequeña escala: de un disparo a Whisper para pasar la voz a texto, luego a un LLM de DeepSeek que convierte el texto en un único comando JSON (los dos a través de OpenRouter), y por último por MQTT hasta los dispositivos. Puedes elegir una frase abajo o dejar que las vaya recorriendo sola.',
    note: 'La pregunta sobre la temperatura y la petición del sándwich enseñan las barreras de seguridad: una pregunta se responde con datos de los sensores en directo sin hacer ninguna acción, y una petición imposible se rechaza. El ESP32 solo actúa sobre JSON validado.',
  },

  console: {
    title: 'Consola de LUMEN',
    wake: '«Hello Robot»',
    ptt: 'pulsar para hablar',
    pipeAria: 'Recorrido de la petición',
    stages: ['Disparo', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: 'Oído',
    parsed: 'Parseado',
    quote: '«{said}»',
    idle: 'Di «Hello Robot» o mantén el botón para hablar.',
    room: 'El cuarto',
    autoOn: 'Auto activado',
    autoOff: 'Auto apagado',
    devices: { white: 'LED blanco', rgb: 'NeoPixel', fan: 'Ventilador', servo: 'Servo' },
    on: 'on',
    off: 'off',
    motion: 'movimiento',
    still: 'quieto',
    dark: 'oscuro',
    lit: 'con luz',
    timer: 'Timer: luz off en 10 min',
    play: 'Reproducir',
    pause: 'Pausa',
    steps: [
      { said: 'Pon la luz en cian y enciende el ventilador un segundo después.', reply: 'Cian ya, ventilador en 1 s.' },
      { said: 'Pon el brillo al porcentaje de humedad.', reply: 'Brillo al 69 %.' },
      { said: 'Apaga la luz dentro de diez minutos.', reply: 'Luz off en 10 min.' },
      { said: '¿Qué temperatura hace aquí?', reply: 'Hace 24,3 °C aquí.' },
      { said: 'Buenas noches.', reply: 'Buenas noches.' },
      { said: 'Hazme un sándwich.', reply: 'Lo siento, no puedo.' },
    ],
  },

  how: {
    h: 'Cómo funciona',
    p1: <><strong>El ESP32 apenas piensa</strong>, porque sus únicas tareas son grabar audio y ejecutar comandos. La conversión de voz a texto, el modelo de lenguaje y el registro van en un servidor FastAPI en Docker en mi homelab, al que la placa llega por la red local.</>,
    p2: <>Un disparo (la palabra de activación «Hello Robot», o un botón de pulsar para hablar como alternativa) pone a un micrófono INMP441 a captar audio mono a 16&nbsp;kHz. La placa lo envuelve como WAV y lo envía en streaming al endpoint <code>/upload</code> del servidor. El servidor usa una sola clave de API de <strong>OpenRouter</strong> para los dos pasos: primero Whisper transcribe el audio y luego un modelo de DeepSeek convierte el texto en un único comando JSON bajo un prompt de sistema estricto. Después valida el JSON, lo publica en un topic MQTT al que está suscrito el ESP32 y añade cada resultado a una hoja de Google Sheets con un coste estimado por petición.</>,
    p3: 'El servidor también está suscrito a los topics de estado y de sensores de la habitación, guarda en caché los últimos valores y se los pasa al LLM como contexto, y así preguntas como «¿qué temperatura hace?» o «¿está encendido el ventilador?» se responden con lecturas reales.',
    pipelineH: 'El recorrido de la voz',
    steps: [
      <>Lo <b>activas</b> diciendo «Hello Robot» o manteniendo pulsado el botón de hablar.</>,
      <>El INMP441 <b>graba</b> unos tres segundos de audio mono a 16&nbsp;kHz, y el LED rojo de REC se queda encendido mientras tanto.</>,
      <>La placa <b>envuelve</b> el PCM en bruto en una cabecera WAV de 44 bytes y lo <b>envía en streaming</b> a <code>/upload</code> mientras sigue grabando.</>,
      <>El servidor manda el clip a OpenRouter, donde Whisper lo <b>transcribe</b> a texto.</>,
      <>El servidor <b>añade contexto</b> pasándole al modelo la transcripción junto con una foto del estado de los dispositivos y de las lecturas de los sensores.</>,
      <>Un modelo de DeepSeek, también a través de OpenRouter, lo <b>convierte</b> en un único comando JSON, que el servidor comprueba contra el esquema, con un reintento antes de quedarse en un no-op.</>,
      <>El servidor <b>envía</b> el comando por MQTT y añade una fila a la hoja de Google Sheets.</>,
      <>El ESP32 <b>ejecuta</b> el comando y muestra la respuesta en su OLED.</>,
    ],
  },

  flow: {
    stages: [
      { tag: 'En el ESP32', title: 'Disparo y micro', text: 'Una palabra de activación o el botón pone al INMP441 a captar audio mono a 16 kHz.' },
      { tag: 'Servidor FastAPI, OpenRouter', title: 'Whisper, DeepSeek y validación', text: 'Whisper pasa la voz a texto y un modelo de DeepSeek la convierte en un único comando JSON, que el servidor comprueba contra el esquema, con un reintento antes de un no-op.' },
      { tag: 'En la habitación', title: 'Dispositivos y OLED', text: 'El LED, el RGB, el ventilador, el servo y el zumbador responden, y el OLED muestra la respuesta.' },
    ],
    links: ['stream a /upload', 'comando MQTT'],
    caption: 'El camino que sigue un comando de voz desde el ESP32, pasando por el servidor, hasta los dispositivos de la habitación',
  },

  brain: {
    h: 'El parser de comandos',
    p: 'El modelo nunca controla un dispositivo directamente, sino que convierte cada frase en exactamente una de tres formas de JSON:',
    shapes: [
      <><b>action</b> es un solo cambio, como «enciende el ventilador» o «ponlo en cian».</>,
      <><b>sequence</b> es una serie de pasos en orden, cada uno con un retraso desde el momento en que hablaste, como «apaga las luces y el ventilador un segundo después».</>,
      <><b>timer</b> es un cambio tras una cuenta atrás, como «apaga la luz dentro de diez minutos».</>,
    ],
    p2: 'También funciona en otros idiomas, porque Whisper transcribe muchos idiomas y el parser lleva cada uno al mismo vocabulario JSON. Un comando dicho en malayo o en mandarín produce la misma acción que en inglés.',
    p3: 'Un prompt de sistema largo y estricto fija el vocabulario de dispositivos (LED blanco, NeoPixel RGB, ventilador, servo, zumbador, rango de confort, modo automático), obliga a dar JSON válido con los números como números y hace que el propio modelo traduzca los nombres de colores a RGB. El servidor comprueba cada respuesta contra un esquema, y si una falla lo reintenta una vez y luego se queda en un no-op en lugar de mandarle a la placa algo de lo que no se puede fiar.',
    p4: <>El modelo también puede usar las lecturas de la habitación como entradas, así que cuando le pido «pon el brillo al porcentaje de humedad», lee la humedad en directo del estado de sensores en caché, la redondea, la limita al rango de 0 a 100 del LED y emite un comando <code>set_brightness</code> de verdad.</>,
  },

  chart: {
    aria: 'Un diagrama de flujo del análisis de comandos. Whisper transcribe la voz en cualquiera de muchos idiomas, y luego el texto y el contexto de los sensores en directo van al LLM de DeepSeek. Si el JSON de salida no pasa la validación del esquema, el servidor lo reintenta una vez, y si sigue sin ser válido el resultado es un no-op seguro. Si es válido, el comando se dirige según su tipo: action para un solo cambio en un dispositivo, sequence para pasos en orden con retrasos, o timer para un cambio tras una cuenta atrás.',
    input: { t: 'Texto y contexto de sensores', s: 'Transcripción de Whisper y foto en directo de la caché MQTT' },
    note: { t: 'Entrada multilingüe', s: 'Whisper entiende muchos idiomas' },
    badge: 'Habla muchos idiomas',
    llm: { t: 'LLM DeepSeek (vía OpenRouter)', s: 'Convierte la petición en un comando JSON' },
    valid: ['¿Esquema JSON', 'válido?'],
    validOne: '¿Esquema JSON válido?',
    yes: 'Sí',
    no: 'No',
    fails: 'falla',
    route: { t: 'Según el tipo de comando', s: 'action, sequence o timer' },
    outcomes: ['Cambia un dispositivo', 'Pasos con retrasos', 'Un cambio tras esperar'],
    retry: { t: 'Un reintento', s: 'nuevo prompt al LLM', phone: 'Vuelve a preguntar al LLM' },
    noop: { t: 'No-op seguro', s: 'responde, sin actuar', phone: 'Solo responde, sin tocar la habitación' },
    ifInvalid: 'si no vale',
    failurePath: 'Si falla',
    stillFails: 'sigue fallando',
    ifValid: 'si vale',
    byType: 'según tipo',
    caption: 'Cómo pasa un comando de voz por el parser, donde cada camino acaba en un action, un sequence, un timer o una negativa que no hace nada',
  },

  prompt: {
    eyebrow: 'El prompt de sistema que LUMEN envía al modelo',
    viewAria: 'Vista del prompt',
    formatted: 'Formateado',
    code: 'Código',
    more: 'Ver el prompt entero',
    less: 'Ver menos',
  },

  hardware: {
    h: 'Hardware',
    p1: 'Todo cuelga de un solo ESP32-WROOM con MicroPython, con las entradas a un lado y las salidas al otro. Un único bucle principal no bloqueante las atiende a todas, así que la detección del disparo nunca se atasca.',
    p2: 'El LDR es un módulo de luz digital con su propio potenciómetro de sensibilidad, así que no hay lecturas analógicas, lo que evita el conflicto del ADC del ESP32 con la WiFi. Un LED rojo se enciende solo mientras el micrófono graba, y un OLED SSD1306 con dos botones de navegación muestra el estado y el último comando en cuatro páginas. El módulo de palabra de activación DF2301Q está cableado y su driver escrito, pero en las pruebas hago la demo con el botón de pulsar para hablar.',
    micAlt: 'Primer plano del micrófono I2S INMP441 conectado al ESP32',
    micCaption: 'El micrófono I2S INMP441.',
  },

  hub: {
    aria: 'Un mapa de cableado con un ESP32-WROOM en el centro. Los sensores y sus pines están a la izquierda: el micrófono INMP441 por I2S (GPIO 14, 23, 32), el DHT22 (GPIO 4), el PIR (GPIO 35), el LDR (GPIO 34) y el botón de pulsar para hablar (GPIO 19). Las salidas están a la derecha: el LED blanco (GPIO 25), el NeoPixel (GPIO 27), el ventilador (GPIO 26), el servo (GPIO 13), el zumbador (GPIO 33) y el LED de grabación (GPIO 17). Abajo, el bus I2C compartido (SDA 21, SCL 22) lleva el OLED SSD1306 (0x3C) y el módulo de palabra de activación DF2301Q (0x64), y dos botones de navegación están en los GPIO 18 y 16.',
    inputs: 'Sensores y entradas',
    outputs: 'Salidas',
    bus: 'Bus I2C (SDA 21, SCL 22) y botones UI',
    core: { t: 'ESP32', s: ['WROOM, MicroPython', 'un bucle no bloqueante'], phone: 'ESP32-WROOM', phoneS: 'MicroPython, un bucle no bloqueante' },
    parts: {
      mic: { n: 'Micro INMP441', s: 'micrófono I2S' },
      dht: { n: 'DHT22', s: 'temperatura y humedad' },
      pir: { n: 'PIR', s: 'movimiento' },
      ldr: { n: 'Módulo LDR', s: 'luz u oscuridad' },
      ptt: { n: 'Botón PTT', s: 'pulsar para hablar' },
      led: { n: 'LED blanco', s: 'brillo por PWM' },
      neo: { n: 'NeoPixel', s: 'WS2812 RGB' },
      fan: { n: 'Ventilador', s: 'on u off' },
      servo: { n: 'Servo', s: '0 a 180°' },
      buzzer: { n: 'Zumbador', s: 'pitidos y avisos' },
      rec: { n: 'LED REC', s: 'grabando' },
      oled: { n: 'OLED', s: 'SSD1306, 0x3C' },
      wake: { n: 'DF2301Q', s: 'activación, 0x64' },
      navA: { n: 'Nav A', s: 'página' },
      navB: { n: 'Nav B', s: 'página' },
    },
    caption: 'Cada componente y el GPIO que usa, con el OLED y el DF2301Q compartiendo un mismo bus I2C',
  },

  memory: {
    h: 'Meterlo en la memoria',
    p1: 'El ESP32-WROOM no tiene PSRAM, y con la WiFi activa MicroPython me dejaba unos 33 KB de RAM utilizable. Un clip de voz ocupa unos 96 KB, así que el audio no cabe en memoria de una vez.',
    p2: <>Para esquivarlo, nada guarda nunca el clip entero. El micrófono es una única instancia persistente y ya preparada, los búferes de captura son pequeños y se reservan solo cuando hacen falta, y la subida se <strong>envía en streaming por un socket directo</strong> mientras graba: un preámbulo, la cabecera WAV, el PCM trozo a trozo y luego un cierre. Así el pico de memoria durante una subida se queda en unos 10&nbsp;KB. Si en cambio construyes un solo objeto <code>bytes</code> grande, el recolector de basura toma un bloque de ~26&nbsp;KB del mismo heap que necesitan la WiFi y el micrófono I2S, y eso deja sin memoria a la pila de red hasta que la subida caduca.</>,
    p3: <>El firmware actual lleva una pantalla de estado sencilla de cuatro páginas en el OLED, porque una versión más completa, con valores de sensores refrescándose en directo y una pantalla de grabación, hacía crecer el heap lo bastante como para romper el arranque. Con ella, la placa ya no podía conectarse a MQTT (<code>ENOBUFS</code>) ni abrir el micrófono (<code>ENOMEM</code>). Para hacer sitio también quité el reloj en tiempo real y las programaciones por hora, así que ahora los temporizadores van con un contador de ticks monótono y no necesitan reloj.</>,
  },

  auto: {
    h: 'Modo automático',
    p: [
      'El modo automático funciona en local, en la propia placa. Cuando detecta movimiento con la habitación a oscuras, enciende el LED blanco y lo vuelve a apagar tras cinco minutos sin movimiento. Cuando la temperatura sube por encima del rango de confort, enciende el ventilador, con un margen de histéresis para que no se pase el rato encendiéndose y apagándose alrededor del umbral.',
      'Cualquier comando hablado tiene prioridad y borra el estado automático, así que el modo automático nunca pisa una luz que acabas de poner.',
    ],
  },

  deploy: {
    h: 'Panel y despliegue',
    p: [
      'El servidor es una app FastAPI en Docker con un panel web: controles de los dispositivos (LED blanco, selector RGB, ventilador, servo, zumbador, interruptor del modo automático, editor del rango de confort), una lectura del estado en directo, una gráfica con el historial de temperatura y humedad, un registro de los últimos comandos, un reproductor de las últimas grabaciones de voz y un cuadro de texto que entra por el mismo camino del LLM. El cuadro de texto es mi plan B por si el micrófono falla en una demo en directo, y un reset borra la gráfica, el registro y las grabaciones.',
      'Funciona en mi homelab detrás de Nginx Proxy Manager y Cloudflare, que sirven el panel en un hostname HTTPS. Al broker MQTT se llega directamente y no a través de Cloudflare, y el ESP32 solo habla con una dirección de la LAN en lugar del hostname público, lo que mantiene el firmware pequeño.',
    ],
    dashAlt: 'El panel web de LUMEN: controles de los dispositivos, estado en directo, gráfica del historial y registro de actividad',
    dashCaption: 'El panel web de LUMEN',
  },

  slides: {
    h: 'Diapositivas',
    p: 'Esta es la presentación que hice en la evaluación del módulo, y cubre el encargo, el recorrido de la voz, el trabajo con la memoria y la demo.',
    frame: 'Presentación del proyecto LUMEN (en Figma)',
  },

  next: {
    h: 'Lo que añadiría',
    p: 'Un ESP32-S3 con PSRAM traería de vuelta casi todo lo que recorté, porque el WROOM ya está al límite enviando el audio del micrófono mientras mantiene la WiFi y MQTT.',
    items: [
      <><b>Un OLED más completo</b>, con las páginas de sensores refrescándose en directo y la pantalla de grabación que tuve que quitar.</>,
      <><b>Programaciones por hora</b> («todos los días a las 8&nbsp;h»), que necesitan el reloj en tiempo real que quité para ahorrar memoria.</>,
      <><b>Un historial que dure</b>, para que las gráficas del panel y los temporizadores sobrevivan a un reinicio, porque ahora las últimas horas solo viven en la RAM.</>,
      <><b>Una palabra de activación que funcione</b> en el hardware, para que pulsar para hablar sea la alternativa y no el disparo principal.</>,
    ],
  },
};

export default es;
