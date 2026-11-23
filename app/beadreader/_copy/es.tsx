import type { BeadreaderCopy } from './en';

/* The BeadReader article's Spanish words. */
const es: BeadreaderCopy = {
  meta: {
    title: 'BeadReader | Braven Chiam',
    description: 'Un lector de libros privado y solo por invitación que hice con Next.js, Supabase y Cloudflare R2, con acceso por código, la lectura y los temas guardados de cada lector, presencia en directo, un filtro de contenido impuesto en SQL, webtoons y estadísticas de lectura compartidas.',
    ogDescription: 'Un lector de libros privado y solo por invitación, con presencia en directo, la lectura guardada de cada lector, un filtro de contenido impuesto en SQL, webtoons y estadísticas de lectura compartidas.',
  },
  ld: {
    headline: 'BeadReader',
    description: 'Un lector de libros online privado y solo por invitación, hecho con Next.js, Supabase y Cloudflare R2, con acceso por código mediante una cookie firmada con HMAC, la lectura y los temas guardados de cada lector, presencia en directo, un filtro de contenido explícito impuesto en SQL, webtoons y un panel compartido de estadísticas de lectura.',
  },
  hero: {
    alt: 'BeadReader en tres móviles: la pantalla de acceso, un capítulo y la página de estadísticas',
    back: 'Volver a proyectos',
    tag: 'Proyecto personal',
    title: <>Bead<em>Reader</em></>,
    lead: 'BeadReader es un lector de libros online privado para unos pocos amigos, donde el admin publica libros en Markdown o como webtoons de imágenes y los lectores entran con un solo código de acceso. La app recuerda dónde se quedó cada lector, y los lectores pueden ver quién más está leyendo, mandar un saludo o una notita y comparar su progreso en un panel de estadísticas compartido.',
    builtWith: 'Hecho con',
    links: { github: 'GitHub', deploy: 'Despliega el tuyo' },
  },
  chapters: 'Capítulos',
  rail: {
    room: 'Acceso privado', library: 'Retomar y temas', together: 'Leer juntos', gate: 'El filtro picante',
    books: 'Texto y webtoons', stats: 'Estadísticas', instant: 'Offline y novedades', stack: 'El stack',
  },
  room: {
    h: 'Acceso privado',
    p: [
      'BeadReader es una biblioteca privada para un admin y unos pocos lectores, y no tiene contraseñas ni registro. En su lugar, un único código de acceso es tu identidad, que decide si eres el admin o un lector y si puedes ver capítulos explícitos, y en cuanto lo introduces, una cookie firmada mantiene tu sesión abierta.',
      'El admin crea cada lector y le da un código, y si el admin revoca ese código, el lector se queda fuera en su siguiente petición.',
    ],
    alt: 'La pantalla de acceso de BeadReader con un solo campo para el código',
    caption: 'La pantalla de acceso con su único campo para el código',
  },
  library: {
    h: 'Retomar y temas',
    p: [
      'Al abrir un libro vuelves al capítulo y a la posición de scroll donde lo dejaste. La posición se guarda como una fracción del capítulo y no como un desplazamiento en píxeles, así que sigue valiendo aunque cambies el tamaño de letra, y si lo dejas a mitad de párrafo en el móvil, apareces en el mismo sitio en el portátil.',
      'BeadReader guarda el color de fondo y de texto de cada lector, su tamaño de letra y si prefiere un diseño con scroll o por páginas. El índice marca cada capítulo que has abierto, muestra una barra de progreso en el que estás leyendo y te deja marcar un capítulo como no leído.',
    ],
    figs: [
      { alt: 'La vista de lectura con el tema papel', caption: 'La vista de lectura con el tema papel' },
      { alt: 'El índice de un libro con el progreso de cada lector', caption: 'El índice con los capítulos leídos y una barra de progreso' },
    ],
  },
  together: {
    h: 'Leer juntos',
    p: [
      'Desde la biblioteca puedes ver quién más está en línea, y dentro de un libro los avatares de los lectores en línea aparecen arriba, cada uno con un punto verde. Si un amigo está en el mismo libro, su avatar también lleva un anillo verde y su número de capítulo.',
      'Si tocas los avatares puedes mandar un saludo o una notita, que aparece unos segundos en la pantalla del otro lector y nunca se guarda. Todo el mundo puede subir una foto de perfil, que se recorta y se comprime en el navegador, y cualquiera puede activar un interruptor de privacidad para leer de forma invisible.',
    ],
    alt: 'El menú para mandar un saludo o una nota',
    caption: 'El menú para mandar un saludo o una notita',
  },
  gate: {
    h: 'El filtro picante',
    p: [
      'Algunos capítulos, o pasajes dentro de un capítulo, están marcados como explícitos, y el acceso a ellos se configura para cada lector y se impone en la consulta a la base de datos. Un lector sin acceso nunca recibe el texto filtrado, ni siquiera escondido en la respuesta, así que no se puede sacar de la API en bruto.',
      'El mismo capítulo se ve distinto según el lector: con acceso, ves un pasaje borroso que se aclara al tocarlo, sin acceso, ves una vista previa bloqueada con una nota para pedirlo, y en modo Cal se quita cada pasaje explícito, sin marcas y sin el icono de la guindilla.',
    ],
    alt: 'Un índice con un capítulo explícito marcado',
    caption: 'Un índice con un capítulo explícito marcado, tal como lo ve un lector con acceso',
  },
  books: {
    h: 'Texto y webtoons',
    p: [
      'Cada libro es de texto o un webtoon, y el admin lo elige al crearlo. Los libros de texto se escriben en Markdown con una vista previa al lado, y cada capítulo tiene su propio estado de borrador o publicado.',
      'Para un webtoon, el admin elige una carpeta de imágenes numeradas, revisa su orden y las sube directamente desde el navegador a Cloudflare R2 con URLs firmadas de corta duración. Luego los lectores bajan por una sola tira vertical sin huecos, con el mismo retomar, seguimiento y filtro que un libro de texto.',
    ],
    figs: [
      { alt: 'La lista de libros del admin', caption: 'La lista de libros del admin, con libros de texto y webtoons, en borrador y publicados' },
      { alt: 'Un capítulo de webtoon como una tira vertical sin huecos', caption: 'Un capítulo de webtoon como una sola tira vertical' },
    ],
  },
  stats: {
    h: 'Estadísticas',
    p: [
      'Los lectores que comparten su actividad aparecen en un panel común que muestra sus horas totales, los libros terminados y sus rachas de lectura. Un histograma muestra a qué hora del día lee la gente, día a día, y si tocas un lector se abre el desglose de su tiempo por libro y por capítulo.',
      'El tiempo de lectura solo cuenta mientras estás leyendo de verdad, así que se pausa cuando la pestaña pierde el foco o te quedas inactivo.',
    ],
    figs: [
      { alt: 'El resumen de las estadísticas de lectura', caption: 'El resumen de estadísticas con las rachas de lectura' },
      { alt: 'El desglose de estadísticas de un lector', caption: 'El tiempo de un lector desglosado por libro y capítulo' },
    ],
  },
  instant: {
    h: 'Offline y novedades',
    p: [
      'Un service worker guarda en caché las portadas, las ilustraciones y los archivos estáticos en el dispositivo, nunca el HTML ni las respuestas de la API, y el lector precarga el siguiente capítulo, así que las páginas se abren rápido y gastan menos datos. La página de la cuenta muestra qué hay en caché y cuánto espacio ocupa, con un botón para vaciarla.',
      'Un registro de cambios público y una ventana de novedades, que sale una vez por versión, explican las funciones nuevas, y aparece un aviso para recargar cada vez que se despliega una versión más reciente.',
    ],
    figs: [
      { alt: 'El panel de la cuenta y el almacenamiento', caption: 'La página de la cuenta y el almacenamiento en el dispositivo, con un botón para borrarlo todo' },
      { alt: 'El registro de cambios dentro de la app', caption: 'El registro de cambios dentro de la app' },
    ],
  },
  stack: {
    h: 'El stack',
    p: [
      'BeadReader es una app de Next.js con App Router y Tailwind CSS v4, con Supabase para Postgres y el almacenamiento, y Cloudflare R2 para las imágenes de los webtoons, mientras que el acceso usa una cookie corta firmada con HMAC hecha por mí en lugar de Supabase Auth.',
      'Como el acceso es propio, todo el acceso a la base de datos se hace en el servidor con el service role de Supabase, y cada tabla tiene la seguridad a nivel de fila activada sin ninguna política, así que la clave pública no puede leer nada. El filtro de contenido explícito vive en la consulta SQL, y el despliegue en Vercel con un clic configura Supabase a través de la integración y ejecuta las migraciones durante el build.',
    ],
  },

  presence: {
    eyebrow: 'En línea',
    captions: [
      'Mara está en el capítulo 12 del libro que estás leyendo, así que su avatar tiene el anillo verde.',
      'Toca a un lector para mandarle un saludo, que aparece en su pantalla y luego se desvanece.',
      'También puedes mandar una notita, que desaparece en unos segundos y nunca se guarda.',
      'Sam abre el mismo libro y también le sale un anillo verde.',
    ],
    note: '¡me encantó el giro!',
    sentNote: '¡lo estoy leyendo!',
    status: {
      mara: 'Este libro, capítulo 12',
      jae: 'El hobbit, capítulo 3',
      samLibrary: 'Mirando la biblioteca',
      samBook: 'Este libro, capítulo 1',
    },
    here: 'leyendo aquí',
    wave: 'Saludar a {name}',
    sendNote: 'Mandar una nota a {name}',
    stepsAria: 'Pasos de la demo',
    step: 'Paso {n} de {total}',
    legend: 'Un anillo verde marca a quien lee tu libro',
  },

  spicyGate: {
    chapter: 'Capítulo 9',
    passage: {
      lead: 'Se habían estado rondando toda la noche. Cuando por fin se fue el último invitado, la sala se quedó en silencio.',
      spicy: 'Lo que pasó después quedó entre ellos y la luz tenue del fuego.',
      trail: 'La mañana llegó demasiado pronto.',
    },
    modes: {
      full: { label: 'Acceso total', caption: 'Este lector tiene acceso, así que un toque aclara la línea borrosa.' },
      none: { label: 'Sin acceso', caption: 'El servidor nunca le envía a este lector el pasaje bloqueado.' },
      cal: { label: 'Modo Cal', caption: 'La línea se quita por completo, sin hueco y sin marca.' },
    },
    revealAria: 'Toca para mostrar el pasaje picante',
    revealedAria: 'Pasaje picante a la vista',
    reveal: 'Toca para ver',
    locked: 'Pasaje picante. Pídele acceso al admin.',
    tabsAria: 'Modo de lector',
    footnote: 'El filtro se impone en la consulta SQL, así que el texto filtrado nunca sale del servidor.',
  },
};
export default es;
