import type { ProjectJuneCopy } from './en';

/* The Project June article's Spanish words. */
const es: ProjectJuneCopy = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: 'Un rover 5G que construí en tres semanas, donde un ESP32-S3 y tres móviles transmiten tres cámaras en directo, el GPS y las lecturas de los sensores a una consola web desde la que lo conduzco.',
    ogDescription: 'Un rover 5G con tres cámaras en directo, GPS, sensores y telemetría MQTT.',
  },
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June, un vehículo 5G radiocontrolado',
    back: 'Volver a proyectos',
    tag: 'Proyecto personal',
    title: <>Project <em>June</em></>,
    lead: 'Construí este rover 5G porque quería un rover de Marte, y transmite tres cámaras en directo, el GPS y las lecturas de los sensores (temperatura, humedad, presión y luminosidad) a una consola web desde la que lo conduzco.',
    builtWith: 'Hecho con',
    links: ['GitHub', 'Ver el montaje'],
  },
  chapters: 'Capítulos',
  rail: {
    Demo: 'Demo', ProjectJune: 'Resumen', OnboardSys: 'A bordo', Ultras: 'Sensor ultrasónico', Laser: 'Láser',
    Gps: 'GPS', IMU: 'IMU de 10 ejes', Lightsensor: 'Sensor de luz', Dht11: 'DHT11', TechArch: 'Arquitectura',
    Livestr: 'Vídeo', ctrlntelm: 'Control y telemetría', Software: 'Software', softD: 'Diseño de la consola', Driving: 'Al volante',
  },
  demo: { h: 'Demo', video: 'Vídeo de demo de Project June' },
  overview: {
    h: 'Resumen',
    p: 'Planeé dos semanas para Project June y me llevó tres. Fue con prisas y hay muchas cosas que haría de otra manera, pero sigue siendo una de las cosas más ambiciosas que he construido.',
    alt: 'El rover original de Project June',
    caption: 'La primera foto de Project June',
  },
  onboard: {
    h: 'A bordo',
    p: 'Un ESP32-S3 lee los sensores, mueve el motor y envía la telemetría, mientras que tres móviles a bordo le dan al rover su punto de acceso 5G y sus vistas de cámara frontal, izquierda y derecha. El motor DC va con un driver de motor con MOSFET que construí yo, y una batería de litio-ion 2S3P que hice con tres packs 2S amplía la autonomía, mientras que un power bank alimenta el ESP32 y los móviles.',
    alt: 'Diagrama de piezas de Project June: tres móviles, el ESP32-S3, los sensores, el driver del motor, el power bank y la batería',
  },
  sensors: {
    Ultras: {
      h: 'Sensor ultrasónico',
      p: 'El sensor ultrasónico va montado detrás, así que me dice a qué distancia están los obstáculos que hay detrás del rover.',
      alt: 'El sensor de distancia ultrasónico y su lectura en la consola',
    },
    Laser: {
      h: 'Láser',
      p: 'Un diodo láser va sobre un servo 3G en la parte delantera, y puedo apuntarlo hasta 45° hacia cada lado desde la consola.',
      alt: 'El diodo láser sobre su servo y su control en la consola',
    },
    Gps: {
      h: 'GPS',
      p: 'Un módulo Neo8M da la posición del rover en directo, que aparece en el mapa de la consola.',
      alt: 'El módulo GPS Neo8M y el mapa de la consola',
    },
    IMU: {
      h: 'IMU de 10 ejes',
      p: 'Una sola placa me da lecturas de acelerómetro, giroscopio y barómetro, aunque nunca llegué a usar su magnetómetro.',
      alt: 'La placa IMU de 10 ejes y su lectura en la consola',
    },
    Lightsensor: {
      h: 'Sensor de luz',
      p: 'El sensor de luz es un TEMT6000, y como no pude calibrarlo, la consola muestra el brillo en cuatro niveles: Dark, Ambient, Bright y VBright.',
      alt: 'El sensor de luz TEMT6000 y su lectura en la consola',
    },
    Dht11: {
      h: 'DHT11',
      p: 'El DHT11 mide la temperatura y la humedad ambiente.',
      alt: 'El sensor de temperatura y humedad DHT11 y su lectura en la consola',
    },
  },
  arch: {
    h: 'Arquitectura',
    p: 'Este diagrama muestra las tres partes del sistema, el rover, el servidor y el cliente, y lo que circula entre ellas.',
    alt: 'Diagrama de arquitectura: el rover con sus sensores y tres móviles, un servidor con Mosquitto, un servidor Node.js con Socket.IO y CoTURN, y la consola del cliente con un mando de Xbox',
  },
  video: {
    h: 'Vídeo',
    p1: 'Cada móvil envía su cámara como su propio stream WebRTC, tres en total, retransmitidos por un servidor TURN para que el vídeo funcione con datos móviles.',
    p2: 'Abajo tienes una reconstrucción de la consola con imágenes de una ruta de día y otra de noche, y puedes elegir una etapa del recorrido de la señal o una cámara para verla más de cerca.',
    systemAlt: 'Diagrama del sistema de vídeo en directo',
    routingAlt: 'Diagrama del enrutado de los streams WebRTC',
  },
  console: {
    tag: 'Consola de conducción',
    rebuilt: { day: 'Reconstruida de la ruta de día', night: 'Reconstruida de la ruta de noche' },
    toggleAria: 'Elige la ruta de día o de noche',
    day: 'De día',
    night: 'De noche',
    signalPath: 'Recorrido de la señal',
    trackAria: 'Recorrido de la señal del mando al rover',
    nodes: {
      pad: {
        label: 'Mando de Xbox',
        sub: 'Bluetooth a la consola',
        blurb: 'El mando se empareja con la consola web por Bluetooth, y la consola convierte los movimientos del joystick y los gatillos en comandos de movimiento que publica por MQTT.',
      },
      server: {
        label: 'Servidor',
        sub: 'MQTT, señalización, TURN',
        blurb: 'Mosquitto gestiona los comandos y la telemetría, un servidor Node.js con Socket.IO sirve la consola y se encarga de la señalización WebRTC, y CoTURN retransmite el vídeo para que funcione con datos móviles.',
      },
      phones: {
        label: 'Tres móviles',
        sub: 'Punto de acceso 5G y cámaras',
        blurb: 'El móvil 1 es el punto de acceso 5G principal y la cámara frontal, el móvil 2 es un segundo punto de acceso y la cámara izquierda, y el móvil 3 se conecta al punto de acceso como cámara derecha, y cada uno envía su imagen como un stream WebRTC.',
      },
      rover: {
        label: 'ESP32-S3',
        sub: 'En el rover',
        blurb: 'Se conecta por Wi-Fi al punto de acceso del móvil, mueve el motor con el driver de MOSFET y devuelve los datos de los sensores por MQTT en tres paquetes a unos 10 Hz.',
      },
    },
    flow: { out: 'Comandos', back: 'Vídeo y telemetría' },
    telemetry: 'Telemetría',
    metrics: {
      lat: 'Latitud', lon: 'Longitud', speed: 'Velocidad', alt: 'Altitud',
      temp: 'Temperatura', hum: 'Humedad', sats: 'Satélites',
    },
    brightness: 'Brillo',
    gpsFix: 'Fix GPS',
    cameras: 'Cámaras',
    camsAria: 'Elige la cámara principal',
    live: 'EN VIVO',
    camAria: { day: 'Cámara {label}, ruta de día', night: 'Cámara {label}, ruta de noche' },
    feeds: {
      left: { label: 'Izquierda', phone: 'Móvil 2', note: 'El móvil 2 es el segundo punto de acceso y la cámara izquierda.', show: 'Ver la cámara izquierda (móvil 2)' },
      center: { label: 'Frontal', phone: 'Móvil 1', note: 'El móvil 1 es el punto de acceso 5G principal y la cámara frontal.', show: 'Ver la cámara frontal (móvil 1)' },
      right: { label: 'Derecha', phone: 'Móvil 3', note: 'El móvil 3 se conecta al punto de acceso y es la cámara derecha.', show: 'Ver la cámara derecha (móvil 3)' },
    },
  },
  control: {
    h: 'Control y telemetría',
    p1: 'El ESP32 publica los datos de los sensores en un topic MQTT al que está suscrito el cliente, y el cliente envía los comandos de movimiento y demás de vuelta al ESP32 por un segundo topic.',
    alt1: 'Diagrama del sistema de control y telemetría',
    packetsH: 'Tres paquetes',
    p2: 'No conseguí meter todos los datos de los sensores en un solo mensaje MQTT y todavía no he descubierto por qué, así que salen en tres paquetes separados a unos 10 Hz.',
    alt2: 'Diagrama de los tres paquetes de telemetría',
  },
  software: {
    h: 'Software',
    p: 'Este es un diagrama de flujo simplificado del código.',
    alts: ['Diagrama de flujo del software, parte 1', 'Diagrama de flujo del software, parte 2'],
  },
  design: {
    h: 'Diseño de la consola',
    p: 'Diseñé la consola en Figma.',
    embed: 'Diseño de la consola de Project June en Figma',
    splineH: 'Spline 3D',
    splineP: 'El rover en 3D de la consola es un modelo de Spline, que pasa a la vista de avance cuando empujo el mando hacia delante y a la vista de marcha atrás cuando tiro de él hacia atrás.',
    modelAlt: 'El modelo 3D del rover en Spline',
    modelCaption: 'El modelo de Spline',
    viewCaption: 'El cambio de vista en la consola',
  },
  driving: {
    h: 'Al volante',
    p: 'El vídeo venía desde más de 8 km de distancia y pasaba por todas las partes del sistema, así que había más o menos un segundo de retraso entre lo que hacía con el mando y el movimiento en la imagen en directo. Además, el stream no siempre era estable, y a ratos eso hacía difícil conducir.',
    repo: {
      title: 'Project June en GitHub',
      text: 'El repositorio tiene la consola, el vídeo WebRTC, la telemetría MQTT y el firmware del ESP32.',
      button: 'Ver el código en GitHub',
    },
  },
};

export default es;
