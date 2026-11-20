import { usePeekKit, type PeekLabels } from './kit';

/*
  The peek reader in Spanish: the same write-ups, titles and labels as en.tsx,
  with the words translated. Image paths and links stay as they are; internal
  links are localized by the kit.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Control de caducidad', 'proj-ruler': 'Regla Scroll', 'proj-cadmouse': 'Ratón CAD 3D', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus Dispenser', 'proj-elecf': 'ELEC-F Concept',
  'proj-kauli': 'Kauli Concept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Desarrollo web', 'proj-mc': 'Mapa vivo de Minecraft',
};

export const LABELS: PeekLabels = {
  soon: 'Artículo pronto',
  next: 'Siguiente: {title}',
  untitled: 'Proyecto {n}',
  pullHint: 'Sigue bajando para ver {title}',
  pullAria: 'Abrir el siguiente proyecto: {title}',
  end: '¡Y esos son todos los proyectos!',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('El rover de Project June', ['Proyecto personal'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 semanas · Autodidacta · Diseño 3D · Red móvil · WebRTC · MQTT</p>
          <p className="hp-rd-lead">Un rover 5G que construí en tres semanas: transmite tres cámaras en directo, lleva un conjunto completo de sensores y se conduce con un mando de Xbox desde cualquier sitio con cobertura.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Tres vídeos en directo', <><p>Tres cámaras transmiten en directo por WebRTC a través de un servidor TURN, así que las imágenes atraviesan el NAT de la red móvil con poca latencia.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Las cámaras de Project June" loading="lazy" /></>)}
          {chapter('02', 'Control y telemetría', <p>MQTT lleva el control y la telemetría a través de un bróker Mosquitto, con control PWM propio para los motores y dirección por servo, todo desde un mando de Xbox.</p>)}
          {chapter('03', 'Sensores de todo tipo', <><p>El rover lleva un GPS Neo8M, un giroscopio, un acelerómetro, un magnetómetro, un barómetro, un sensor de distancia por ultrasonidos, un DHT11 y un sensor de luz TEMT6000.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="La arquitectura del sistema de Project June" loading="lazy" /></>)}
          {cta('El diario de montaje', 'El artículo tiene las fotos, la arquitectura y cada problema que me encontré.', 'Leer el artículo', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, una mascota de escritorio cian, en la M5Stack Tab5', ['Proyecto de prácticas'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 semana · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">Una mascota de escritorio en una M5Stack Tab5 cuyo cerebro es el DeepSeek Harness de mi servidor, así que puede manejar un navegador, crear sus propias apps y vigilar a mis otros agentes.</p>
          {chapter('01', 'Una mascota que se explica', <><p>Pip duerme cuando lo dejas tranquilo, se despierta cuando coges la tableta, se retuerce y se frota las sienes mientras piensa, y da saltitos cuando algo sale bien. También representa cada herramienta que usa: saca unos prismáticos para leer una página o un megáfono para dar instrucciones a un ayudante.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip con una lupa, unos prismáticos, un megáfono y un avión de papel" loading="lazy" /></>)}
          {chapter('02', 'Usa la pantalla', <p>Las respuestas llegan como páginas y texto con formato, y Pip puede navegar por esas páginas con su propio cursor o hacerme preguntas de opción múltiple. También crea pequeñas apps que guarda en un cajón, ya sean páginas web servidas desde mi servidor o scripts de Lua que corren en la propia tableta.</p>)}
          {chapter('03', 'Un centro para mis agentes', <><p>Pip vive en el mismo harness que mis sesiones de programación, pasa los trabajos largos a pips ayudantes y me avisa cuando una sesión termina o necesita una respuesta.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Pips ayudantes trabajando con una libreta, un portátil, bloques, un libro y un matraz" loading="lazy" /></>)}
          {cta('Mira cómo se mueve Pip', 'El artículo enseña sus estados de ánimo, sus apps y escritorios y cómo se conecta todo.', 'Leer el artículo', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('El control de caducidad, una CoreS3 SE sobre el módulo QRCode', ['Proyecto de prácticas'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Control de caducidad</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">Un control de caducidad para la puerta de la nevera. Escaneas el código de barras de un producto, eliges cuándo caduca y la pantalla siempre te enseña qué comer primero.</p>
          {chapter('01', 'Escanea y guarda', <><p>La pantalla brilla en rojo mientras el lector busca un código, luego muestra el nombre, la marca y la foto del producto desde Open Food Facts o GS1 China, y fijas la caducidad con los selectores de días, semanas y meses antes de guardarlo.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="El selector de caducidad del dispositivo" loading="lazy" /></>)}
          {chapter('02', 'Qué comer primero', <><p>La pantalla de inicio ordena la despensa por caducidad y pone el contador en rojo cuando falta un día y en ámbar cuando falta una semana, y si escaneas algo que ya está en la lista, se abre en lugar de añadirse dos veces.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="La pantalla de inicio ordenada por caducidad" loading="lazy" /></>)}
          {chapter('03', 'Un servidor hace el resto', <p>Un contenedor Docker en la red de casa guarda la lista, busca los códigos de barras, sirve una página web para gestionar las despensas y publica cada despensa en Home Assistant por MQTT para los recordatorios.</p>)}
          {cta('Prueba el control', 'El artículo tiene una copia funcional de su pantalla, el vídeo de demo y cómo montarte uno.', 'Leer el artículo', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('La Regla Scroll, un AtomS3R con una Unit Scroll conectada', ['Proyecto de prácticas'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Regla Scroll</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">Una regla digital. Presionas la rueda de la Unit Scroll y la haces rodar sobre lo que quieras medir, y el AtomS3R muestra la distancia en centímetros.</p>
          {chapter('01', 'Se calibra una vez', <><p>La primera vez que arranca, haces rodar exactamente 10 cm junto a una regla de verdad y tocas la pantalla para guardar los pasos que ha contado, así aprende cuánto avanza la rueda por paso. Después, la calibración se queda en la flash.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="La regla marcando 8,2 cm" loading="lazy" /></>)}
          {chapter('02', 'Rueda para medir', <p>La distancia solo cuenta mientras la rueda está presionada, con el LED en verde, así que puedes levantarla y volver a apoyarla sin perder la medida. Al tocar la pantalla se pone a cero, y al mantenerla pulsada empieza una nueva calibración.</p>)}
          {chapter('03', 'Probada fuera del dispositivo', <p>Las cuentas de la calibración y la distancia están en un archivo sin código de hardware, así que once tests unitarios las comprueban en un ordenador antes de que el firmware llegue al AtomS3R.</p>)}
          {cta('Hazla rodar tú', 'El artículo tiene una copia funcional de la regla, el vídeo de demo y cómo flashear una.', 'Leer el artículo', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan con cuatro sensores de distancia Unit ToF4M en la cabeza', ['Proyecto de prácticas'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · cuatro Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">Un LiDAR improvisado. Stack-chan pasea cuatro sensores de distancia por una habitación con sus dos servos, su cámara colorea los puntos y cualquier navegador de la misma Wi-Fi muestra el escaneo en 3D.</p>
          {chapter('01', 'El barrido', <><p>La cabeza recorre una cuadrícula fila a fila, desde la horizontal hasta mirar al techo y hasta 256 grados de lado a lado, y cada postura se convierte en una muestra: una dirección de los servos y una distancia de los sensores.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="El escaneo terminado de una esquina de la habitación con los colores de la cámara" loading="lazy" /></>)}
          {chapter('02', 'Cuatro sensores, una medida', <p>Los cuatro sensores apuntan en la misma dirección, así que cada muestra se queda con la mediana de sus lecturas, lo que descarta alguna suelta.</p>)}
          {chapter('03', 'El color de la cámara', <p>Las fotos tomadas antes del barrido colorean los puntos, y el navegador lleva cada píxel hasta la distancia medida, lo que dio 68.206 puntos de color en este escaneo.</p>)}
          {cta('Explora el escaneo', 'El artículo tiene el escaneo real en 3D, el vídeo de demo y cómo flashear uno.', 'Leer el artículo', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('La M5Stack Capsule v1.1 que funciona como ratón 3D', ['Proyecto de prácticas'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Ratón CAD 3D</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Un ratón 3D inalámbrico para Onshape. Pulsas el botón de la Capsule y la giras en la mano, y el modelo de la pantalla gira con ella.</p>
          {chapter('01', 'Haciéndose pasar por un SpaceMouse', <p>Onshape solo escucha a un ratón 3D a través del driver de 3Dconnexion, así que la Capsule se presenta por Bluetooth como su SpaceMouse Wireless y el driver hace el resto.</p>)}
          {chapter('02', 'Sigue tu mano', <><p>Envía lo rápido que gira tu mano, según su giroscopio, así que el modelo gira el mismo ángulo que tu mano. Si mantienes el botón, desplaza la vista, y si la retuerces, hace zoom.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Girando una carcasa en Onshape con la Capsule" loading="lazy" /></>)}
          {chapter('03', 'Probado fuera del dispositivo', <p>Las cuentas del movimiento y los gestos del botón están en una librería sin código de hardware, así que 19 tests unitarios las comprueban en un ordenador antes de cada flasheo.</p>)}
          {cta('Gíralo tú', 'El artículo tiene una copia funcional de sus controles, el vídeo de demo y cómo montarte uno.', 'Leer el artículo', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Proyecto personal'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 meses · Autodidacta · Diseño 3D · Diseño de PCB</p>
          <p className="hp-rd-lead">Un par de comunicadores de mano con ESP32 que hablan entre sí sin ninguna red: texto por LoRa de largo alcance y voz bidireccional por ESP-NOW.</p>
          {chapter('01', 'Dos radios, dos tareas', <><p>LoRa lleva el texto a larga distancia mientras ESP-NOW lleva la voz bidireccional con poca latencia, y programé los dos aparatos en PlatformIO con el framework de Arduino.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="El interior de LoRA Messenger" loading="lazy" /></>)}
          {chapter('02', 'Una PCB propia, soldada a mano', <><p>Diseñé la placa en KiCAD y soldé por refusión los componentes SMD yo mismo, y un circuito TP4056 en la placa se encarga de la carga.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="PCB a medida" loading="lazy" /></>)}
          {chapter('03', 'Audio y carcasa', <><p>Un micrófono I2S y un altavoz se encargan de las llamadas y dos pantallas OLED muestran los mensajes y el estado, todo dentro de una carcasa impresa en 3D que modelé en Onshape.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="Carcasa impresa en 3D" loading="lazy" /></>)}
          {cta('Mira cómo se hizo', 'El artículo cuenta la fase de protoboard, las revisiones de la PCB y lo que aprendí.', 'Leer el artículo', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('El asistente de voz LUMEN', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">Programación IoT en NYP · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">Un asistente de voz para una habitación inteligente que se despierta cuando dices &laquo;Hello Robot&raquo;. Un ESP32 graba lo que dices después, un relé FastAPI lo transcribe y le pide a un LLM un único comando JSON estricto, y ese comando vuelve a la habitación por MQTT.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'De la voz a un comando JSON', <p>El ESP32 envía audio a 16&nbsp;kHz al servidor, donde Whisper lo transcribe a través de OpenRouter y un LLM de DeepSeek lo convierte en exactamente un comando (una acción, una secuencia o un temporizador), que se valida con un esquema antes de llegar a la placa.</p>)}
          {chapter('02', 'Cabe en una placa sin PSRAM', <><p>El WROOM tenía unos 33&nbsp;KB de RAM libre con la WiFi activa, y un clip de voz ocupa unos 96&nbsp;KB, así que el audio se envía por un socket directo mientras se graba en lugar de guardarse en memoria, y el pico de memoria durante una subida se queda en unos 10&nbsp;KB.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="El micrófono INMP441 conectado al ESP32" loading="lazy" /></>)}
          {chapter('03', 'Una habitación que te escucha', <><p>Las luces, un NeoPixel, un ventilador, un servo y un zumbador responden a los comandos, y además hay un modo automático local y un panel web. Si le pides &laquo;pon el brillo según la humedad&raquo;, lee el sensor en directo y hace justo eso.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="El panel web de LUMEN" loading="lazy" /></>)}
          {cta('Mira el proyecto entero', 'El artículo cuenta los límites de memoria, el cableado y trae una demo interactiva.', 'Leer el artículo', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('OCR Reader con DrumNet: una solución OCR para contadores de agua totalmente integrada en vertical', ['Proyecto personal'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">Una cámara barata y con batería que se monta sobre un contador de agua mecánico y lee los tambores con una red neuronal de 693K parámetros que corre entera en un ESP32-S3, y luego envía el número a casa por LoRaWAN.</p>
          {chapter('01', 'DrumNet en el chip', <><p>Un localizador encuentra la ventana de los dígitos, un refinador ajusta sus bordes promediando las columnas y filas de los mapas de características, y tres lectores votan cada tambor aplicando la regla del acarreo. Toda la red corre en INT8 y tarda unos 2 segundos por lectura.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="La votación del conjunto de DrumNet y la lectura" loading="lazy" /></>)}
          {chapter('02', 'Entrenado por seis agentes', <><p>MeterSim renderiza contadores etiquetados y SimGen2 hace que parezcan fotos de cámara, mientras seis agentes de IA se turnaban en la GPU y en el equipo Jetson mediante un sistema de reservas, funcionando 24/7 por Tailscale y T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="Los nueve diseños de contador de MeterSim" loading="lazy" /></>)}
          {chapter('03', 'Una placa, una carcasa y 9 horas de soldadura', <><p>La PCB de 4 capas en KiCad lleva gestión de batería, LoRa y LEDs con PWM, y la monté a mano, la depuré bajo un microscopio y la metí en una carcasa impresa en 3D sin herramientas con un adaptador para el contador.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="Render 3D de la placa Prototype V2" loading="lazy" /></>)}
          {cta('Recorre todo el proceso', 'El artículo sigue la ejecución de DrumNet paso a paso, con un recorrido 3D por la placa, un simulador de ConfigKing y el informe completo.', 'Leer el artículo', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader, un lector de libros privado', ['Proyecto personal'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">App web · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Autodidacta</p>
          <p className="hp-rd-lead">Un pequeño lector de libros en línea, privado, para un puñado de amigos que entran con un único código de acceso. La app recuerda exactamente dónde lo dejaste, muestra quién más está leyendo y sigue el progreso de todos.</p>
          {chapter('01', 'Una biblioteca que te recuerda', <><p>Cuando abres un libro, vuelve al capítulo y la posición exactos, que se guardan como una fracción para que sigan cuadrando aunque cambies el tamaño de letra, y también se guardan el color, la fuente y el diseño de cada lector.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="La vista de lectura" loading="lazy" /></>)}
          {chapter('02', 'Leer juntos', <><p>Puedes ver quién está en línea, reconocer a un amigo en el mismo libro por su anillo verde y su número de capítulo, y mandarle un saludo o una notita que desaparece.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Presencia y mensajes rápidos" loading="lazy" /></>)}
          {chapter('03', 'Un filtro impuesto en SQL', <p>Los capítulos explícitos se filtran en la propia consulta a la base de datos, así que el texto filtrado nunca sale del servidor para un lector sin acceso. El mismo capítulo puede verse distinto para cada lector, y el modo Cal lo quita por completo.</p>)}
          {cta('Mira el proyecto entero', 'El artículo cuenta la presencia, el filtro de contenido, los webtoons y el stack.', 'Leer el artículo', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('Sistema EMA Smart Home', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Sistema EMA Smart Home</h2>
          <p className="hp-md-meta">3 meses · Proyecto escolar en grupo · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">Una casa inteligente que construimos los cinco de mi equipo para una asignatura sobre vida sostenible, y que sacó una A. Cuatro nodos BeagleBone informan a un servidor SocketIO con un panel 3D en directo.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Cuatro nodos, una tarea cada uno', <><p>Los cuatro nodos cubren el clima, el baño, la cocina (el consumo de la nevera y una alarma de incendios) y las intrusiones, y cada BeagleBone Black Wireless lleva módulos de sensores MikroBUS.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="El hardware del nodo de la cocina" loading="lazy" /></>)}
          {chapter('02', 'Un servidor para todos', <><p>Cada nodo se conecta a un servidor web SocketIO, que aloja el panel y hace sonar la alarma de incendios en todos los nodos a la vez.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="Cómo se conecta cada parte del sistema" loading="lazy" /></>)}
          {chapter('03', 'Un panel 3D en directo', <><p>El panel muestra datos en directo sobre un modelo 3D de la casa hecho en Spline, y diseñé su interfaz en Figma.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="El panel 3D de EMA" loading="lazy" /></>)}
          {cta('Pruébalo o lee el artículo', 'Hay una demo en vivo del panel y también el artículo completo del proyecto.', 'Demo en vivo', 'https://csdpdemo.chiambucket.com', { label: 'Leer el artículo', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus Dispenser', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus Dispenser</h2>
          <p className="hp-md-meta">1 mes · Primer proyecto escolar · Diseño 3D · PyFirmata</p>
          <p className="hp-rd-lead">Mi primer proyecto escolar fue un dispensador de sirope impreso en 3D, de seis piezas, y todas encajaron a la primera impresión.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Qué hace', <><p>Sirve tres tamaños de vaso, se despierta cuando alguien se acerca y tiene una puerta con servo y un LED de alta potencia para iluminar el vaso.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="El modelo de Pandus en Onshape" loading="lazy" /></>)}
          {chapter('02', 'Control y componentes', <><p>Un Arduino Uno R3 controlado con PyFirmata maneja un servo, LEDs, una placa de relés, botones, una bomba de corriente continua y un módulo infrarrojo de detección de obstáculos.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="El diagrama de flujo de Pandus" loading="lazy" /></>)}
          {cta('El montaje completo', 'El artículo cuenta las piezas, los diagramas de flujo y el modelo de Onshape.', 'Leer el artículo', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F, sistema de congelador seguro', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F Concept</h2>
          <p className="hp-md-meta">Sistema de congelador seguro · Equipo de 4 · Curso de ingeniería · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">Un sistema de seguridad para congeladores que diseñamos mi equipo y yo para un curso de ingeniería. Las cámaras frigoríficas de las fábricas pueden dejar atrapada a la gente que trabaja dentro, así que ELEC-F vigila la puerta y la sala y da la alarma antes de que el frío se vuelva peligroso.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'El problema', <><p>Un pestillo defectuoso, un cierre congelado o un simple despiste pueden dejar a un trabajador encerrado en una cámara frigorífica, donde la hipotermia llega rápido. ELEC-F está para acortar ese tiempo y tranquilizar a quien se haya quedado atrapado.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="El prototipo de congelador ELEC-F" loading="lazy" /></>)}
          {chapter('02', 'Cómo funciona', <><p>Un sensor ToF detecta si la puerta está abierta o cerrada, y un sensor PIR comprueba si aún queda alguien dentro. Si la puerta se cierra con una persona dentro, empieza un temporizador, y cuando se acaba, la unidad RGB parpadea y suena el zumbador.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="El estado armado de ELEC-F en la M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Hecho con M5Stack', <><p>Dos controladores M5Stack Fire y un Mini Hub conectan las unidades ToF, PIR y RGB, elegidos porque siguen funcionando a las temperaturas bajo cero que exige un congelador.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="El controlador M5Stack conectado a sus sensores" loading="lazy" /></>)}
          {cta('Mira el concepto entero', 'El artículo cuenta la investigación, el montaje y trae un recorrido interactivo.', 'Leer el artículo', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli Concept', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli Concept</h2>
          <p className="hp-md-meta">Concepto · Habilidades de comunicación · 3D en Blender</p>
          <p className="hp-rd-lead">Un concepto de producto original que creé y presenté para un proyecto de habilidades de comunicación, acompañado de escenas 3D hechas en Blender.</p>
          {chapter('01', 'De la idea a la presentación', <><p>El encargo iba de comunicar una idea, no solo de tenerla, así que diseñé el concepto, lo rendericé en Blender y preparé la presentación para explicarlo con claridad al público.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Render del concepto Kauli" loading="lazy" /></>)}
          {soon('Concepto Kauli', 'Los renders y la presentación tendrán su propio artículo.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Proyecto personal'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Personal · Diseño 3D · Ultraligero 20 g</p>
          <p className="hp-rd-lead">Mi propia versión del popular ZeroMouse, un ratón gaming ultraligero de 20 g que diseñé desde cero para jugar un poco mejor a los FPS.</p>
          {chapter('01', 'Diseñar gramo a gramo', <p>Cada pieza de la carcasa se modeló para quitar peso sin perder rigidez, equilibrando la comodidad del agarre con el objetivo de llegar a unos 20 gramos.</p>)}
          {soon('Series One Light', 'El modelo y sus compromisos tendrán su propio artículo.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('La PCB Copy Board', ['Proyecto personal'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Personal · Diseño de PCB · KiCAD · 1 semana</p>
          <p className="hp-rd-lead">Una recreación desde cero en KiCAD de la placa de desarrollo ATMega328 de NYP, hecha para tener mi propia copia con la que trabajar en casa.</p>
          {chapter('01', 'Desmontada y vuelta a construir', <p>Recreé la placa de la escuela en KiCAD a partir de su esquema, y como algunas piezas ya no se fabricaban, busqué sustitutas y luego usé la placa como mi primer intento serio de soldadura por refusión.</p>)}
          {soon('Copy Board', 'La búsqueda de piezas, el diseño y la soldadura tendrán su propio artículo.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Proyecto de desarrollo web', ['Proyecto escolar'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Proyecto de desarrollo web</h2>
          <p className="hp-md-meta">Escuela · HTML y CSS · Primera web</p>
          <p className="hp-rd-lead">La primera web totalmente funcional que hice, en HTML y CSS, para el trabajo final de mi clase de desarrollo web. Esta web fue mi segundo intento.</p>
          {chapter('01', 'Donde empezó todo', <p>Fue mi primer contacto con la creación web, y muestra lo mucho que ha avanzado mi trabajo desde entonces.</p>)}
          {soon('Mira dónde empezó', 'La web sigue en línea.', { label: 'Demo en vivo', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Mapa vivo de Minecraft', ['Proyecto personal'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Mapa vivo de Minecraft</h2>
          <p className="hp-md-meta">Personal · Docker · Paper y Dynmap</p>
          <p className="hp-rd-lead">Un servidor de Minecraft autoalojado en el homelab, con un mapa web en directo del mundo multijugador que cualquiera puede recorrer en tiempo real.</p>
          {chapter('01', 'Servidor y mapa', <p>Un servidor Paper corre en Docker con el plugin Dynmap, que genera un mapa interactivo en directo que se actualiza mientras los jugadores exploran y construyen.</p>)}
          {soon('Explora el mundo en vivo', 'El mapa en vivo está abierto a todo el mundo.', { label: 'Abrir el mapa', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
