import type { PantryCopy } from './en';

/* The Pantry Expiry Tracker article's Spanish words. The simulator's screen keeps the firmware's own
   English labels, so the copy names them as they appear (SCAN NOW, SAVE, Days...). */
const es: PantryCopy = {
  meta: {
    title: 'Control de caducidad | Braven Chiam',
    description: 'Un control de caducidad para la puerta de la nevera, hecho con un M5Stack CoreS3 SE y un módulo QRCode durante mis prácticas en M5Stack. Escaneas un código de barras y eliges cuándo caduca, y la pantalla siempre te enseña qué comer primero, mientras un pequeño servidor pone nombre a los productos y manda avisos a Home Assistant.',
    ogDescription: 'Escanea un código de barras, elige cuándo caduca y la puerta de la nevera te dice qué comer primero.',
  },
  ld: {
    headline: 'Control de caducidad',
    about: ['M5Stack CoreS3 SE', 'ESP32-S3', 'lector de códigos de barras', 'Home Assistant', 'MQTT', 'Open Food Facts'],
  },
  hero: {
    alt: 'El control de caducidad: un CoreS3 SE apilado sobre el módulo QRCode y su base de batería, con la pantalla brillando en rojo mientras escanea',
    back: 'Volver a proyectos',
    tag: 'Proyecto de prácticas',
    title: <>Control de <em>caducidad</em></>,
    lead: 'Hice este control de caducidad para la puerta de la nevera durante mis prácticas en M5Stack. Escaneas el código de barras de un producto y eliges cuándo caduca, y la pantalla siempre te enseña qué comer primero, con los nombres de los productos en chino o en inglés.',
    builtWith: 'Hecho con',
    links: ['GitHub', 'Leer en M5Stack', 'Flashear firmware', 'Descargar servidor'],
    meta: 'Proyecto de prácticas en M5Stack, noviembre de 2026. M5Stack CoreS3 SE, Module13.2 QRCode, C++, Python, Docker, MQTT.',
  },
  chapters: 'Capítulos',
  rail: {
    demo: 'Demo', try: 'Pruébalo', features: 'Qué hace', scan: 'Escanear', first: 'Qué comer primero',
    again: 'Escanéalo y se abre', swipe: 'Desliza y borra', pantries: 'Varias despensas', control: 'Centro de control',
    web: 'En un navegador', ha: 'Home Assistant', how: 'Cómo funciona', hardware: 'Hardware', setup: 'Móntate uno',
  },
  demo: {
    h: 'Demo',
    p: 'Lo grabé en mi escritorio: primero escaneo productos de una hoja de demo en mi portátil y luego un brick de verdad de 冰红茶, después vuelvo a escanear el brick y paso a una segunda despensa.',
    video: 'El control en uso: escaneando productos, un brick de verdad, escaneándolo otra vez y cambiando de despensa',
    moments: [
      { label: 'Escaneando la hoja de demo', note: 'Nutella, Coca-Cola y Ritter Sport desde la pantalla del portátil' },
      { label: 'Un brick de verdad', note: 'Un brick de 冰红茶, con el nombre de GS1 China' },
      { label: 'Escanearlo otra vez', note: 'El brick guardado se abre en lugar de añadirse dos veces' },
      { label: 'Otra despensa', note: 'Cambiando a la nevera y añadiendo algo' },
    ],
  },
  try: {
    h: 'Pruébalo',
    p: <>Esta es una copia de la pantalla del control que sigue los mismos pasos. Toca <b>SCAN NOW</b> y elige un producto de la estantería para ponerlo delante del lector, luego fija cuándo caduca y guárdalo. También puedes deslizar una tarjeta hacia la izquierda para borrarla, y si escaneas algo que ya está en la lista, se abre en lugar de añadirse.</>,
    note: 'Los códigos de barras de la estantería son los EAN-13 reales de los productos, así que el propio control puede escanearlos desde esta página.',
  },
  sim: {
    live: {
      home: 'La despensa, {n} productos, ordenados por lo que caduca antes.',
      scan: 'Escaneando. Elige un producto de la estantería para ponerlo delante del lector.',
      entry: '{name}. Fija cuándo caduca y guárdalo.',
      detail: '{name}, ya está en la lista. {days}.',
    },
    list: 'Despensa',
    card: '{name}, {days}',
    remove: 'Borrar {name}',
    cancel: 'Cancelar',
    back: 'Atrás',
    more: { d: 'Más días', w: 'Más semanas', m: 'Más meses' },
    fewer: { d: 'Menos días', w: 'Menos semanas', m: 'Menos meses' },
    hintScan: 'Elige un producto para ponerlo delante del lector',
    hint: 'Toca un producto para escanearlo',
    scan: 'Escanear {name}',
    scanSaved: 'Escanear {name}, ya está en la lista',
    onList: 'en la lista',
    shelf: {
      '5449000000996': 'Coca-Cola', '3256540000698': 'Pains au lait', '6909548500734': '冰红茶',
      '3046920029759': 'Lindt negro', '3017620425035': 'Nutella',
    } as Record<string, string>,
    reset: 'Reiniciar',
  },
  features: {
    h: 'Qué hace',
    p: 'El control vive en la puerta de la nevera, y cada pantalla de aquí abajo es una captura suya.',
  },
  scan: {
    h: 'Escanea un producto',
    alt: 'El selector de caducidad de 牛奶面包 de Brioche Pasquier, con Days 0, Weeks 1 y Months 0, dentro de una semana, y un botón verde SAVE',
    p1: <>Cuando tocas <b>SCAN NOW</b> y pones un código de barras a un palmo de la ventana del lector, la pantalla brilla en rojo mientras busca un código. Después el control enseña el nombre, la marca, el tamaño y la foto del producto, que casi siempre salen de Open Food Facts, mientras que los productos que se venden en China continental salen de GS1 China a través de una cuenta gratuita.</>,
    p2: <>Fijas la caducidad con las flechas de Days, Weeks y Months y luego tocas <b>SAVE</b>.</>,
  },
  first: {
    h: 'Mira qué comer primero',
    alt: 'La pantalla de inicio: Prince caducado en rojo, Pesto alla Genovese en 2 días y Skyr en 5 días en ámbar, con SCAN NOW abajo',
    p: 'La pantalla de inicio muestra la despensa con lo que caduca antes arriba del todo, y el contador se pone rojo cuando falta un día y ámbar cuando falta una semana.',
  },
  again: {
    h: 'Escanéalo y se abre',
    alt: 'La página del producto Barilla Pesto alla Genovese: añadido hoy, caduca el miércoles 2026-11-11, en 2 días, con un botón rojo DELETE',
    p: 'Si escaneas algo que ya está en la lista, se abre en lugar de añadirse dos veces, así que desde ahí puedes mirar su fecha o borrarlo.',
  },
  swipe: {
    h: 'Desliza para borrar',
    alt: 'La tarjeta de Prince deslizada a la izquierda, con un botón rojo de papelera',
    p: 'Si deslizas un producto de derecha a izquierda aparece una papelera roja para tocar, y si deslizas de izquierda a derecha en cualquier sitio vuelves atrás.',
  },
  pantries: {
    h: 'Varias despensas',
    alt: 'El menú de despensas abierto: Default Pantry con 6 productos, Fridge con 1 y Create Pantry',
    p: <>El botón <b>Pantry</b> cambia entre despensas como la nevera, el congelador o un armario, y también puede crear una nueva.</>,
  },
  control: {
    h: 'Un centro de control',
    alt: 'El centro de control: un interruptor del pitido, un control de brillo, la batería al 100% y Home Assistant conectado',
    p: 'El botón de estado de arriba a la derecha abre el interruptor del pitido, el brillo de la pantalla y el nivel de batería, y su icono de casa se pone verde cuando el control está conectado a Home Assistant.',
  },
  web: {
    h: 'Gestiónalo desde el navegador',
    p: 'La misma lista está en una página web, donde puedes añadir productos por código de barras, cambiarles el nombre y organizar las despensas desde un ordenador o un móvil. Una etiquetita junto a cada nombre te dice de dónde salió, como OFF para Open Food Facts o GS1 para GS1 China.',
    alt: 'La página web de la despensa: pestañas para All, Default Pantry y Fridge, un formulario de código de barras y fecha, y los productos ordenados por caducidad con sus etiquetas de origen',
    caption: 'La página web de la despensa',
  },
  ha: {
    h: 'Avisos en Home Assistant',
    p: 'Cada despensa aparece en Home Assistant como su propio dispositivo, con el número de productos, lo que caduca pronto y el siguiente en caducar. Cada escaneo, cada producto añadido y cada borrado lanzan también un evento, así que puedes montar tus propias automatizaciones encima, como un aviso en el móvil el día antes de que algo caduque.',
    alt: 'Tres dispositivos en Home Assistant: Pantry Tracker, Default Pantry y Fridge, cada uno con caducados, a punto de caducar, número de productos y próxima caducidad',
    caption: 'Los dispositivos de la despensa en Home Assistant',
  },
  how: {
    h: 'Cómo funciona',
    p: 'El control solo se ocupa de la pantalla y del lector, mientras un contenedor Docker en la red de casa hace el resto: guarda la lista, busca los códigos de barras, guarda en caché las fotos de los productos y lo publica todo en Home Assistant por MQTT. Lo dividí así porque el ESP32-S3 no puede hacer el inicio de sesión de GS1 China, y porque con una sola lista en el servidor, el control, la página web y Home Assistant siempre coinciden.',
    overviewAlt: 'Vista general del sistema: el control de la nevera habla con el servidor de la despensa por Wi-Fi, el servidor busca los productos en Open Food Facts y GS1 China y publica en Home Assistant por MQTT, y cualquier navegador puede abrir su página web',
    overviewCaption: 'Cómo se conectan las piezas',
    flowAlt: 'Lo que pasa al escanear: el código de barras se lee por UART, se pregunta al servidor si ya está guardado, se busca el producto y se guarda en caché, eliges la caducidad, se guarda el producto y se actualiza Home Assistant',
    flowCaption: 'Lo que pasa al escanear',
  },
  hardware: {
    h: 'Hardware',
    parts: [
      { b: 'CoreS3 SE', s: 'ejecuta el control, con la pantalla táctil y el Wi-Fi.' },
      { b: 'Module13.2 QRCode', s: 'lee códigos de barras 1D y 2D y va apilado debajo del CoreS3 SE.' },
      { b: 'Una base de batería', s: 'va debajo, así que funciona en la nevera sin cable.' },
    ],
    fridgeAlt: 'El control pegado a la puerta gris de una nevera, con su pantalla Set me up y un código QR',
    fridgeCaption: 'En la puerta de la nevera, listo para configurar',
    p: 'También necesitas un ordenador que se quede encendido para el servidor, y Home Assistant si quieres avisos.',
  },
  setup: {
    h: 'Móntate uno',
    p: 'Todo lo que necesitas se descarga gratis: el firmware se flashea con M5Burner, y el servidor viene como un paquete de Docker con sus imágenes incluidas, así que no hay que bajar nada de Docker Hub durante la instalación.',
    steps: [
      <>En el módulo QRCode, pon el selector de interfaz en UART y activa el número 2 en los dos bloques DIP, TX y RX, y luego apila las tres piezas.</>,
      <>Abre el <a href="https://burner.m5stack.com/share/firmware/R4VK5Z" target="_blank" rel="noopener">firmware de Pantry en M5Burner</a>, conecta el CoreS3 SE por USB-C y flashéalo con la app M5Burner.</>,
      <>Descarga el servidor para el ordenador que lo vaya a ejecutar, ya sea el <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-amd64.tar.gz">paquete para ordenadores Intel y AMD</a> o el <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-arm64.tar.gz">paquete para Macs con Apple Silicon y Raspberry Pi</a>. Descomprímelo, pon en <code>TZ</code> de <code>docker-compose.yml</code> tu zona horaria y ejecuta <code>./install.sh</code> en esa carpeta.</>,
      <>Enciende el control, escanea con el móvil el código QR de su pantalla e introduce tu Wi-Fi y la dirección del servidor, por ejemplo <code>http://192.168.1.20:8080</code>.</>,
      <>Toca <b>SCAN NOW</b> y escanea este código una vez, que cambia el lector de USB a serie.</>,
      <>En Home Assistant, añade la integración MQTT con la dirección IP del servidor y el puerto 1883.</>,
      <>Para los códigos de barras chinos, añade una cuenta gratuita de gds.org.cn en <b>Settings</b>, en la página web del servidor, e inicia sesión una vez.</>,
    ],
    hardwareAlt: 'El selector de interfaz en UART, el interruptor 2 activado en los bloques DIP TX y RX, y el CoreS3 SE apilado sobre el módulo y la base de batería',
    bootAlt: 'Primer arranque: el control abre un punto de acceso Pantry con un código QR, el móvil se conecta, la página de configuración pide el Wi-Fi y la dirección del servidor, y se carga la pantalla de inicio',
    codeAlt: 'El código de ajuste del lector 21424000, Serial Communication',
    repo: <>El <a href="https://github.com/New-Kringster/Pantry_tracker_code" target="_blank" rel="noopener">repositorio de GitHub</a> tiene la guía completa en su README, junto con el código del firmware y del servidor por si prefieres compilarlos tú.</>,
    note: 'Los nombres y fotos de productos de esta página vienen de Open Food Facts (CC BY-SA) y GS1 China.',
  },
};
export default es;
