import type { ArchiveCopy } from './en';

/* The /archive page's words in Spanish. Text quoted from the old designs' screenshots stays in
   English, because that is what the pictures show. */
const es: ArchiveCopy = {
  meta: {
    title: 'Dos años de chiambucket.com | Braven Chiam',
    description:
      'Todos los diseños que ha tenido chiambucket.com desde septiembre de 2024, de una web en WordPress a la historia pintada que se cuenta al hacer scroll, con capturas y una copia funcional de cada versión antigua.',
    ogTitle: 'Dos años de chiambucket.com',
    ogDescription: 'Ocho diseños desde septiembre de 2024, y una copia funcional de cada uno de los antiguos.',
  },
  ldName: 'Dos años de chiambucket.com',
  ldItem: 'v{n}: {name} ({when})',

  title: 'Dos años de chiambucket.com',
  lede:
    'Empezó como una página de WordPress donde compartía enlaces a algunos de mis servicios autoalojados, pero desde entonces se ha convertido en mi blog personal y mi portfolio. Tres migraciones y ocho rediseños después, este es el mayor rediseño de mi web hasta la fecha. Con la ayuda de Claude, he archivado en esta página cada gran cambio de diseño, y puedes visitar cualquiera de ellos para ver cómo era chiambucket.com antes.',
  stripLabel: 'Las ocho versiones, cada una tan ancha como el tiempo que estuvo en línea',
  segLabel: 'v{n}, {name}, {when}',
  today: 'Hoy',

  srName: 'v{n}: ',
  builtWith: 'Hecha con {built}',
  backHome: 'Volver al inicio',
  open: 'Abrir v{n}',

  fact: {
    kicker: 'Curiosidad',
    title: '¿Por qué chiambucket.com?',
    text:
      'Chiambucket empezó como un mote que me puso uno de mis mejores amigos. Cuando buscaba un dominio para mi nueva página de inicio, chiambucket.com resultó ser el más barato disponible, así que me lo quedé y lo he mantenido desde entonces.',
    extra: <><b>Otra curiosidad:</b> también tengo <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, ¡y redirige a esta web!</>,
  },

  versions: {
    1: {
      name: 'La primera web en WordPress',
      when: 'De septiembre a octubre de 2024',
      built: 'WordPress y Elementor',
      body: 'Mi primer chiambucket.com fue una web en WordPress que monté con Elementor y que corría en mi servidor de casa. Giraba en torno a su botón Quick Links, porque era la página a la que mandaba a mis amigos cada vez que me pedían los enlaces a mis servicios autoalojados. Más abajo tenía un carrusel con mis fotos, el rack de mi homelab y una franja de enlaces de contacto.',
      desktopAlt: 'Una página azul marino con “Welcome To Chiambucket!” en blanco y un botón azul Quick Links',
      phoneAlt: 'La misma página de bienvenida azul marino en un móvil',
      detailAlt: 'Una sección blanca titulada “A little bit about myself” sobre un carrusel de fotos de paisajes',
    },
    2: {
      name: 'La renovación de WordPress',
      when: 'De noviembre de 2024 a la primavera de 2025',
      built: 'WordPress y Elementor',
      body: 'Dos meses después rehíce la cabecera y el menú y añadí una página Sobre mí. El titular iba cambiando entre varias frases después de “Welcome To My”, y la página de abajo mostraba un deslizador que comparaba una de mis fotos antes y después de editarla, junto a una foto alta del rack del homelab.',
      desktopAlt: 'Una página azul marino con una barra de menú redondeada y el titular “Welcome To My” sobre un botón azul Quick Links',
      phoneAlt: 'La página de inicio azul marino renovada en un móvil',
      detailAlt: 'Una sección gris con un deslizador de fotos de antes y después bajo “My Photos” y el rack del homelab bajo “My Homelab Journey”',
    },
    3: {
      name: 'La web negra hecha a mano',
      when: '2025',
      built: 'HTML, CSS y jQuery',
      body: 'En 2025 dejé WordPress y escribí toda la web yo mismo. Era negra, con Oswald para los títulos y un foco que caía sobre una esfera de partículas detrás del título, una escena 3D de Spline que quedaba genial pero hacía que toda la web fuera lenta. Junto a mis habilidades principales había un dibujo de Sukuna de Jujutsu Kaisen, un personaje que me encantaba. El botón To BucketCentral iba a llevar a una página que reuniera todos mis servicios autoalojados en un sitio, pero la descarté antes de construirla.',
      desktopAlt: 'Una página negra con “Welcome To Chiambucket!” iluminado por un foco sobre una esfera de partículas',
      phoneAlt: 'La página de bienvenida negra con el foco en un móvil',
      detailAlt: 'Tarjetas oscuras que dicen “Hi I am Braven, I shape designs And stir up Creations!” junto a un dibujo de Sukuna de Jujutsu Kaisen, sobre My Core Skills',
    },
    4: {
      name: 'El hero en degradado',
      when: 'De enero a junio de 2026',
      built: 'HTML, CSS y jQuery',
      body: 'En enero la rediseñé otra vez, todavía a mano, sobre todo para quitarme el lag de encima y para probar las cuadrículas bento, que me gustaban mucho. La parte de arriba de la página de inicio pasó a ser un degradado lavanda y violeta que decía “Creating with Intention.”, y las secciones de debajo se convirtieron en una cuadrícula de tarjetas oscuras para mis herramientas de CAD y PCB, mi forma de diseñar y un render polvoriento de Project June.',
      desktopAlt: 'Un degradado de lavanda a violeta detrás del titular “Creating with Intention.”',
      phoneAlt: 'El hero en degradado en un móvil',
      detailAlt: 'Tarjetas oscuras para CAD 3D y diseño de PCB y “A Design first Engineering approach”, sobre un rover levantando polvo',
    },
    5: {
      name: 'La reconstrucción en Next.js',
      when: 'De junio a julio de 2026',
      built: 'Next.js, React y Vercel',
      body: 'En junio usé Claude para diseñar la web por primera vez, la reconstruí en Next.js y la pasé a Vercel para ganar velocidad y disponibilidad. Cada página tenía su propio color de acento, la página de inicio decía “Creating with Meaning.” sobre un brillo azul, y una nueva galería con todos mis proyectos permitía buscarlos y filtrarlos, con cada tarjeta abriendo un breve resumen.',
      desktopAlt: 'Una página negra con “Creating with Meaning.” sobre un brillo azul y dos botones',
      phoneAlt: 'La página de inicio en Next.js en un móvil',
      detailAlt: 'La galería All projects con filtros y tarjetas de Project June, LoRA Messenger y LUMEN',
    },
    6: {
      name: 'Dark Sensory',
      when: 'De julio a octubre de 2026',
      built: 'Next.js, WebGL y Vercel',
      body: 'En julio hice un cambio más pequeño: mantuve el diseño tal como estaba y solo cambié la paleta de colores. Los tonos azules y morados habían empezado a parecerse a los de cualquier web hecha con IA, así que casi todas las páginas pasaron a un ámbar cálido con un aire más premium.',
      desktopAlt: 'Una página ámbar oscura con “CREATING WITH MEANING.” en mayúsculas altas y un botón luminoso Get in touch',
      phoneAlt: 'La página de inicio ámbar de Dark Sensory en un móvil',
      detailAlt: 'Tarjetas oscuras esmeriladas de vídeo, diseño de interfaces, fotografía y PowerPoint, con una luz ámbar cálida',
    },
    7: {
      name: 'Tema naturaleza',
      when: 'Del 30 de octubre al 18 de noviembre de 2026',
      built: 'Next.js y Vercel',
      body: 'A finales de octubre le di a la web un tema de naturaleza. Fue un cambio mayor que el anterior, pero aún gradual, porque el contenido y la estructura siguieron igual mientras cada página se mudaba a un paisaje pintado a su propia hora del día, y la web estrenó su barra de menú compacta.',
      desktopAlt: 'Una mañana pintada en tonos salvia con un pino piñonero a la izquierda y “Braven Chiam” en letras de cristal transparente',
      phoneAlt: 'La página de inicio con la mañana pintada en un móvil',
      detailAlt: 'Un título Projects sobre el cielo pintado, encima de la tarjeta insignia de OCR Meter',
    },
    8: {
      name: 'Rediseño naturaleza',
      when: 'Desde el 18 de noviembre de 2026',
      built: 'Next.js, GSAP y WebGL',
      body: 'Esta es la renovación completa en la que he estado trabajando, la primera desde la v5 que cambia algo más que el aspecto, con animaciones y diseños nuevos por todas partes. La página de inicio mantiene la pintura pero cuenta una historia mientras haces scroll: la mañana se deshace en grano, y luego OCR Reader, Project June, Pip y BeadReader tienen cada uno su propio capítulo antes de mis otros proyectos, mi homelab y mis fotos.',
      desktopAlt: 'La página de inicio actual: la mañana pintada con “Braven Chiam” en cristal transparente',
      phoneAlt: 'La página de inicio actual en un móvil',
      detailAlt: 'El capítulo de Project June en la página de inicio actual, con tres cámaras en directo junto al título “Tres vídeos en directo desde tres móviles”',
    },
  },
};

export default es;
