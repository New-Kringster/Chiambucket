import type { PipCopy } from './en';

/* The Pip article's Spanish words. */
const es: PipCopy = {
  meta: {
    title: 'Pip, una mascota de escritorio con un agente por cerebro | Braven Chiam',
    ogTitle: 'Pip, una mascota de escritorio con un agente por cerebro',
    description: 'Pip es una mascota de escritorio en una M5Stack Tab5 cuyo cerebro es el DeepSeek Harness de mi servidor. Duerme, se despierta, piensa y da saltitos, maneja un navegador con su propio cursor, crea sus propias apps y dirige mis otras sesiones de agentes.',
  },
  ld: {
    headline: 'Pip: una mascota de escritorio en una M5Stack Tab5 con el DeepSeek Harness por cerebro',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'agentes de IA', 'mascota de escritorio'],
  },
  chapters: { meet: 'Así es Pip', canvas: 'La pantalla', applets: 'Applets', desktops: 'Escritorios', crew: 'El equipo', inside: 'Cómo funciona' },
  ui: {
    chapters: 'Capítulos',
    heroStage: 'Pip en la M5Stack Tab5, y luego Así es Pip',
    moods: 'Los estados de ánimo de Pip',
    nextStep: 'Siguiente paso',
    steps: 'Pasos',
    deck: 'Ocho de mis Pips',
    carousel: 'carrusel',
    prevPip: 'Pip anterior',
    nextPip: 'Pip siguiente',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip es una mascota de escritorio que funciona con DeepSeek Harness (DSH). Puede navegar por la web, crear y probar sus propias apps, controlar otros agentes a través del conector MCP y mucho más. La interfaz de Pip corre en una M5Stack Tab5.',
    meet: 'Así es Pip',
    m5: 'Leer en M5Stack',
    m5Off: 'Aún no publicado',
    meta: 'Proyecto de prácticas en M5Stack, noviembre de 2026. ESP32-P4, C++, Lua, Node, Python, Docker.',
  },

  meet: {
    title: 'Así es Pip',
    slotLabel: 'Mopi, una nube cian con gafas',
    lede: 'Está listo para ayudarte cuando quieras: solo coge la tableta y pulsa para hablar.',
  },
  moods: {
    asleep: { name: 'Dormido', line: 'Si lo dejas tranquilo un minuto, atenúa la pantalla y se queda dormido.', label: 'Pip dormido' },
    wake: { name: 'Despierto', line: 'Se despierta estirándose cuando coges o tocas la tableta, o cuando llega una respuesta.', label: 'Pip despierto' },
    listen: { name: 'Escuchando', line: 'Mantén pulsada la pantalla para hablar, y se inclina con la mano en la oreja.', label: 'Pip escuchando' },
    think: { name: 'Pensando', line: 'Mientras trabaja, se retuerce y se frota las sienes, y a veces se le ocurre una idea.', label: 'Pip pensando' },
    happy: { name: 'Contento', line: 'Da saltitos cada vez que algo sale bien.', label: 'Pip contento' },
    talk: { name: 'Hablando', line: 'Su respuesta aparece con un suave timbre en un bocadillo a su lado, justo debajo de lo que te ha oído decir.', label: 'Pip hablando' },
  },
  props: {
    title: 'Cada expresión es una acción distinta',
    label: 'Pips con una lupa, unos prismáticos, un megáfono y un avión de papel',
    p: 'Pip coge un objeto distinto para cada tarea, así que sabes de un vistazo qué está haciendo: una lupa cuando busca en la web, unos prismáticos cuando lee una página, un megáfono cuando da instrucciones a un subagente y un avión de papel cuando le escribe a otro Pip.',
  },
  desk: {
    title: 'Vive en mi escritorio',
    alt: 'La M5Stack Tab5 sobre su teclado en mi escritorio, con Mopi, una nube cian con gafas, en la pantalla de inicio',
    p: 'Pip funciona en una M5Stack Tab5 encajada en su teclado, encima de mi escritorio. Este es Mopi, el Pip de mi primer escritorio, que espera en la pantalla de inicio hasta que lo necesito.',
  },

  canvas: {
    title: 'La pantalla',
    pipLabel: 'Un Pip violeta con boina mirando con unos prismáticos',
    lede: 'Markdown, navegadores web interactivos, dibujos, preguntas y más.',
  },
  cursor: {
    title: 'Sabe usar el navegador',
    win: 'La página que maneja Pip',
    label: 'El cursor de Pip deslizándose sobre un vídeo de YouTube, activando los subtítulos y poniendo la velocidad a 1.5x',
    p: 'Cuando le pido un vídeo con subtítulos, Pip lo abre, lleva su cursor al botón de subtítulos y luego cambia la velocidad desde el menú del engranaje. El navegador en sí corre en mi servidor, mientras la tableta muestra la misma página con Pip mirando a su lado.',
  },
  point: {
    title: 'Te señala las cosas',
    label: 'Un diagrama sin etiquetas de una célula animal en la Tab5: Pip rodea las dos mitocondrias con una nota «Mitochondria» y luego dibuja una flecha con la etiqueta «Nucleus» hacia el núcleo',
    p: 'Esto viene muy bien para estudiar. Puse un diagrama sin etiquetas de una célula animal y le pedí a Pip que rodeara las mitocondrias y luego me enseñara el núcleo. Como Pip puede hacer una captura de pantalla y mirarla, encuentra las partes en la imagen él solo antes de dibujar los círculos, la flecha y la nota encima del diagrama.',
  },
  markdown: {
    title: 'Respuestas fáciles de leer',
    alt: 'Una respuesta con formato en la Tab5: un título en negrita, una lista con entradas en negrita y una línea en el bocadillo',
    p: 'Las respuestas largas se abren como texto con formato en un panel, mientras que la versión corta se queda en el bocadillo junto a Pip.',
  },
  question: {
    title: 'Pregunta antes de adivinar',
    alt: 'Una pregunta de opción múltiple de Pip en la Tab5: qué parte de la célula señalar primero, con tres opciones, «Type an answer» y «Skip»',
    p: 'Cuando Pip necesita que yo decida algo, me hace una pregunta, y puedo contestar tocando una opción, escribiendo en el teclado o manteniendo pulsado a Pip y diciéndolo.',
  },
  touches: {
    tap: { title: 'Toques', text: 'Cada toque se ve como un punto azul, que se convierte en un anillo verde cuando la página reacciona.', alt: 'Un toque en el botón redondo de ayuda de la página de M5Stack Tab5: un punto azul y luego un anillo verde' },
    drag: { title: 'Arrastres', text: 'Al arrastrar queda una línea azul detrás del dedo mientras la página se desplaza.', alt: 'Un dedo arrastrando hacia abajo la página de M5Stack Tab5 y dejando una línea azul' },
    expand: { title: 'Ampliar un panel', text: 'Toca Expand en cualquier panel y crecerá hasta llenar la pantalla.', alt: 'Un toque en Expand en un panel, que crece hasta ocupar toda la pantalla' },
    back: { title: 'Volver atrás', text: 'Desliza de izquierda a derecha para volver atrás, estés donde estés.', alt: 'Un dedo deslizando de izquierda a derecha, que devuelve la pantalla a la anterior' },
  },

  applets: {
    title: 'Applets',
    pipLabel: 'Un Pip rosa con auriculares escribiendo en un portátil',
    lede: 'Pip puede crear apps nativas en Lua o enviar apps web en streaming desde el host de DSH.',
  },
  drawer: {
    title: 'El cajón de apps',
    label: 'El cajón de applets subiendo, la ficha de información de NCIR Thermometer y luego la app abriéndose y leyendo un sensor',
    p: 'Al tirar del asa hacia arriba se abre el cajón de apps, donde se guardan las apps que crea Pip. Las apps nativas están escritas en Lua y van fluidas en la propia tableta, mientras que las apps de contenedor son apps web que corren en Docker en el host de DSH y se envían en streaming a la Tab5. Como corren en el servidor, las apps de contenedor pueden hacer mucho más, como juegos multijugador en tu red local o incluso una videollamada.',
  },
  web: {
    macAlt: 'Un MacBook mostrando el Intercom en un navegador: la imagen de la cámara de la Tab5, en la que salgo yo, llena la ventana, con la vista previa de la cámara de mi Mac al lado',
    tabAlt: 'El applet web Intercom en la Tab5 durante la misma llamada: mi cara desde la cámara del Mac llena la pantalla, con un botón TALK abajo y la imagen de la cámara de la propia tableta en la esquina',
    caption: <><b>Los applets web</b> son páginas que Pip escribe y sirve desde mi servidor, pero aun así pueden usar la cámara, los micrófonos y el altavoz de la tableta. Este es el Intercom, un applet de videollamada que creó Pip, durante una llamada de verdad, así que la Tab5 me muestra a través de la cámara de mi Mac mientras el navegador de mi Mac me muestra a través de la de la tableta.</>,
  },
  native: {
    alt: 'El applet nativo NCIR Thermometer mostrando la temperatura del objeto y la ambiente con una gráfica de tendencia',
    caption: <><b>Los applets nativos</b> son scripts de Lua que Pip envía a la tableta sobre la marcha, así que corren en la propia tableta a toda velocidad.</>,
  },
  built: {
    title: 'Hecho por Pip',
    label: 'Una partida de tres en raya en la Tab5, gana X en la diagonal',
    caption: 'El tres en raya, otra app que creó Pip, jugándose en la tableta',
    list: [
      { time: '106 s', what: 'un temporizador pomodoro' },
      { time: '5 min', what: 'un juego de reflejos en Lua, probado en la tableta' },
      { time: '8 min', what: 'un nivel de burbuja con la IMU' },
      { time: '32 min', what: 'un intercomunicador con webcam y un navegador al otro lado' },
    ],
  },
  devring: {
    title: 'Sin tocar mientras prueba',
    label: 'Un borde rojo alrededor de la pantalla mientras un subagente de pruebas toca una app de contador: 0, 1, 2, 3 y luego otra vez 2',
    p: 'Cuando un subagente está creando o probando una app en la pantalla, aparece un borde rojo a su alrededor, así sé que no tengo que tocar nada. En este clip, un subagente de pruebas va tocando una app de contador que un subagente programador acaba de escribir, contando hasta 3 y bajando otra vez a 2.',
  },

  desktops: {
    title: 'Escritorios',
    pipLabel: 'Un Pip lima con gorro de fiesta lanzando un avión de papel',
    lede: 'Cada conversación tiene su propio escritorio, con su propio Pip y su color.',
  },
  switch: {
    title: 'Desliza para cambiar',
    label: 'En el escritorio de Mopi, la píldora de arriba se arrastra hacia abajo hasta la barra de búsqueda, se desliza hasta la ficha de Fizz y se suelta, y aparece el escritorio de Fizz; luego lo mismo de Fizz a Wavo',
    p: 'Al tirar hacia abajo de la píldora de arriba de la pantalla se abre la barra de búsqueda, que tiene una ficha para cada escritorio. Cuando deslizas hasta una y sueltas, aparece ese escritorio con su propio Pip, su imagen y su trabajo. En este clip paso de Mopi a Fizz y luego a Wavo.',
  },
  newpip: {
    title: 'Cada Pip se inventa a sí mismo',
    p: 'Cada escritorio nuevo empieza como un huevo, y su Pip se inventa una personalidad, un nombre, un cuerpo, un sombrero y una imagen de inicio a juego antes de salir del cascarón. Al tocar su nombre se abre la ficha que escribió sobre sí mismo, y estos son ocho de los míos.',
  },
  hatch: [
    { alt: 'La barra de búsqueda bajada en el escritorio de Wavo, arrastrada más allá de la última ficha hasta que salta un signo más; al soltar, llega un escritorio nuevo con un huevo', caption: 'Arrastra más allá de la última ficha para un escritorio nuevo' },
    { alt: 'Riva, un corazón dorado con corona, recién salida del cascarón, con su primera frase en un bocadillo', caption: 'El huevo se abre y el Pip dice su primera frase' },
    { alt: 'La ficha de Riva en la Tab5, escrita por ella: una rival dorada y fanfarrona, teatral, competitiva y leal, con su frase típica, lo que le gusta y lo que no', caption: 'Toca su nombre para ver la ficha que escribió' },
  ],
  pips: {
    mopi: { name: 'Mopi', look: 'una nube cian con gafas', vibe: 'Un pequeño filósofo somnoliento que se toma la siesta y las preguntas sin respuesta igual de en serio.', says: 'Pregúntame después de la siesta.' },
    poco: { name: 'Poco', look: 'una alubia violeta con bufanda', vibe: 'Un vaquero en miniatura de voz chillona que vive cada tarea pequeña como una aventura en el Lejano Oeste.', says: '¡A enlazarlo!' },
    fizz: { name: 'Fizz', look: 'una gominola rosa con gorro de fiesta', vibe: 'Un duendecillo de gominola rosa que convierte cada pequeño desorden en un juego y luego lo recoge tan contento.', says: '¡Primero caos, luego orden!' },
    wavo: { name: 'Wavo', look: 'una gota lima con gafas de sol', vibe: 'Un surfero matemático muy tranquilo que resuelve ecuaciones en la arena mojada entre ola y ola.', says: 'Surfea el coseno, colega.' },
    quib: { name: 'Quib', look: 'una alubia cian con gafas', vibe: 'Un bibliotecario diminuto y gruñón que guarda los libros de la tableta y en el fondo agradece la compañía.', says: 'Shh. Primero los libros, luego los sentimientos.' },
    doughby: { name: 'Doughby', look: 'una gominola violeta con gorro de fiesta', vibe: 'Un panadero obsesionado con los juegos de palabras que trata cada conversación como una hornada nueva de chistes.', says: '¡Encantarta de conocerte!' },
    blooma: { name: 'Blooma', look: 'una gota rosa con una flor', vibe: 'Una jardinera zen muy dulce que convierte los momentos pequeños en pequeñas estaciones de calma.', says: 'Crece suave, con curiosidad.' },
    bzzt: { name: 'Bzzt', look: 'una nube lima con antena', vibe: 'Un pequeño robot humorista de cara seria que está aprendiendo de verdad qué es un chiste, un remate sin gracia cada vez.', says: 'Eso era un chiste. Ríete.' },
  },
  ask: {
    title: 'Pregúntale desde cualquier sitio',
    label: 'La barra de búsqueda bajada sobre la pantalla de inicio de Riva, la pregunta «What\'s a good name for a cactus?» escrita y enviada, y luego la respuesta de Riva: «Prickly Pete, Spike Lee or Sir Pokes-A-Lot»',
    p: 'También puedes hablar con Pip desde la barra de búsqueda en cualquier pantalla, bajándola o pulsando Ctrl+Space, y luego escribiendo o hablando. Aquí le pido a Riva que le ponga nombre a un cactus.',
  },
  control: {
    title: 'Un centro de control',
    label: 'El centro de control bajando sobre la app del termómetro, y luego su página de ajustes',
    p: 'Al deslizar hacia abajo desde la esquina superior derecha se abre el centro de control, que tiene el brillo, el volumen, el micrófono y la cámara y un botón para salir del applet, y los ajustes completos están a un toque más.',
  },

  crew: {
    title: 'El equipo',
    pipLabel: 'Un Pip corazón dorado con corona gritando por un megáfono',
    lede: 'Pip pasa los trabajos largos a subagentes, para poder seguir hablando conmigo.',
  },
  subagents: {
    title: 'Subagentes trabajando',
    label: 'Cinco pips subagentes trabajando: escribiendo, tecleando, apilando bloques, leyendo y mezclando un matraz',
    p: 'Cada subagente recibe una tarea y un objeto a juego, como una libreta, un portátil, bloques, un libro o un matraz burbujeante. Mientras trabajan, un pequeño Pip atareado se queda en la pantalla de inicio, y al tocarlo se abre la ficha del equipo, donde cada uno cuenta en qué anda.',
  },
  crewHome: {
    alt: 'La ficha del equipo abierta en la pantalla de inicio de Zesto: tres subagentes, Researcher, Scout y Writer, cada uno con un pensamiento corto',
    caption: 'La ficha del equipo con tres subagentes trabajando',
  },
  tasks: {
    title: 'Los trabajos largos van en lista',
    alt: 'Una lista de tareas de tres pasos terminada en la pantalla de inicio de Fizz: diseñar y escribir la app nativa en Lua, probarla en la tableta y abrirla en el escritorio',
    p: 'Pip convierte un trabajo largo en una lista de tareas en la pantalla de inicio y pasa cada paso a un subagente, como un explorador, un escritor o un probador, que lo tacha cuando ha terminado.',
  },
  kimi: {
    title: 'Vigila a mis otros agentes',
    steps: [
      { alt: 'La ficha del equipo con dos trabajando: Zesto y Kimi, un agente de fuera, tecleando', caption: 'Kimi se une al equipo' },
      { alt: 'Una ficha en la Tab5: Kimi quiere escribir, con «Approve once», «Approve for this session» y «Reject»', caption: 'Pregunta antes de escribir' },
      { alt: 'La respuesta de Pip en la Tab5: Kimi lo ha entregado, el archivo está en el espacio de trabajo y dice «hello from Kimi»', caption: 'Pip me informa' },
    ],
    p: 'Como Pip vive en el mismo harness que mis sesiones de programación, puede ver cuáles están en marcha, cuáles han terminado, cuáles están atascadas en una pregunta y cuáles se han roto, y también puede traer agentes de otros proveedores. Aquí le pasa un trabajo a Kimi Code en mi servidor, así que Kimi aparece en la ficha del equipo, su petición para escribir un archivo llega a la tableta para que yo la apruebe, y Pip me informa cuando ha terminado.',
  },

  inside: {
    title: 'Cómo funciona',
    pipLabel: 'Un Pip naranja con gafas pensando, hasta que se enciende una bombilla',
    lede: 'La tableta es solo la cara, y todo el pensar ocurre en mi servidor.',
  },
  flow: {
    label: 'El camino de una petición: la Tab5 habla con un puente en la VM, y el puente habla con el DeepSeek Harness',
    nodes: {
      tab: { title: 'Tab5', where: 'En mi mesa', items: ['Pip, dibujado en la tableta', 'Táctil, teclado, micros', 'Cámara, IMU, altavoz', 'Applets nativos en Lua'] },
      bridge: { title: 'Puente de Pip', where: 'En la VM', items: ['Voz a texto, en la VM', 'El hardware de la tableta, como API', 'Páginas para applets'] },
      dsh: { title: 'DeepSeek Harness', where: 'En la VM', items: ['Pip, una sesión con su personaje', 'Subagentes para los trabajos largos', 'Un navegador que Pip ve y clica', 'Applets en Docker'] },
    },
    links: [
      { out: 'voz, toques, teclas', back: 'imágenes, respuestas, scripts' },
      { out: 'tus palabras, como Pip', back: 'respuestas, páginas, apps' },
    ],
    caption: 'La tableta dibuja a Pip y la pantalla, y habla por Wi-Fi con una pequeña VM de Ubuntu en mi mesa, donde corre todo lo demás.',
  },
  hw: {
    working: 'En la Tab5, funciona',
    workingList: ['Táctil', 'Cámara', 'Micrófonos', 'Altavoz', 'IMU', 'I2C', 'Teclado'],
    unchecked: 'Sin probar aún',
    uncheckedList: ['USB', 'Jack de auriculares', 'Wi-Fi como función', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: 'Aún en construcción',
    p: 'Pip todavía está en desarrollo y cambia casi cada semana, así que las instrucciones para montar el tuyo llegarán aquí más adelante.',
  },
  credit: <>La Tab5 en 3D de arriba de esta página parte del modelo estructural de la Tab5 de la propia M5Stack, de <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (licencia MIT, copyright M5Stack), con el cristal, la pantalla y la parte trasera añadidos. Las animaciones de Pip se renderizan con el propio código de dibujo del firmware, y las capturas y clips vienen de la pantalla de la tableta. Los clips de gestos se grabaron con la tableta ralentizada, así que Pip se mueve un poco rápido en ellos.</>,
};

export default es;
