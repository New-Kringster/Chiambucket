import type { AiUseCopy } from './en';

/* The /ai-use page's words in Spanish. The levels' short names match aiShort in lib/shell.ts.
   ­ is a soft hyphen, for the long words in the narrow phone columns. */
const es: AiUseCopy = {
  meta: {
    title: 'Escala de uso de IA | Braven Chiam',
    description:
      'Cómo uso la IA en mis proyectos, y la escala de cuatro niveles (L1 a L4) con la que indico cuánto de cada proyecto se hizo con herramientas de IA.',
  },
  ldHeadline: 'Escala de uso de IA',

  title: 'Escala de uso de IA',
  sub: 'Esta escala sirve para contar con transparencia cuánto han influido las herramientas de IA en mis proyectos.',
  scaleLabel: 'Los cuatro niveles',
  humanEnd: 'Decide la persona',
  agentEnd: 'Deciden los agentes',

  stance: {
    title: 'Por qué uso IA, y por qué lo digo',
    body: [
      'En mi opinión, la IA es una tecnología revolucionaria que permite un desarrollo rapidísimo y sin precedentes en muchos campos. En vez de restringir y limitar su uso como hacen la mayoría de las instituciones, me dejo explorar estas herramientas a fondo y llevar al límite lo que pueden hacer. Así aprendo continuamente sobre esta tecnología que cambia y mejora tan deprisa, y eso acelera muchísimo mi trabajo y sube su calidad.',
      'Eso sí, estoy muy en contra de usar herramientas de IA para hacer trabajos de baja calidad y poco esfuerzo, sobre todo arte. Uso herramientas de IA en mi trabajo de diseño, pero retoco mucho los estilos yo mismo hasta que llegan a un nivel que puedo enseñar con orgullo.',
      'Por eso creé esta escala, para que sea fácil ver cuánta IA hubo en un proyecto. Si te resulta útil, ¡úsala también en tu trabajo con toda libertad!',
    ],
  },

  levelsTitle: 'Los cuatro niveles',
  levelsIntro: 'Cada nivel incluye todo lo de los niveles anteriores.',
  usesLabel: 'Usos típicos de {code}',
  levels: {
    l1: {
      code: 'L1',
      short: 'Poco uso',
      name: 'Uso de IA escaso o insignificante',
      alt: 'Marca L1: poco uso de herramientas de IA',
      body: [
        'Usé herramientas de IA en el proyecto, pero apenas influyeron en el resultado, o nada.',
      ],
      uses: ['Parafrasear', 'Ideas', 'Ver si algo es viable', 'Tareas pequeñas y menores', 'Generar gráficos', 'Revisar mi trabajo'],
    },
    l2: {
      code: 'L2',
      short: 'Uso medio',
      name: 'Uso moderado de IA',
      alt: 'Marca L2: uso medio de herramientas de IA',
      body: [
        'Todo lo del nivel 1, y además se usaron herramientas de IA para crear o generar partes clave del proyecto.',
      ],
      uses: ['Escribir código', 'Recursos de los que depende el proyecto, como las texturas de un objeto 3D', 'Configurar dispositivos'],
    },
    l3: {
      code: 'L3',
      short: 'Mucho uso',
      name: 'Uso intensivo de IA',
      alt: 'Marca L3: mucho uso de herramientas de IA',
      body: [
        'El nivel 3 va un paso más allá. Las herramientas de IA funcionaron en bucles automáticos y tomaron por su cuenta decisiones cruciales e importantes para el proyecto, sin preguntar antes a una persona. El código lo escribe casi entero la IA, con poca o ninguna intervención humana.',
        'Las personas pasan a un papel de más alto nivel: orquestan y gestionan el trabajo que producen los agentes de IA. Siguen dentro del bucle y toman las decisiones clave.',
      ],
      uses: ['Agentes en bucles automáticos', 'Casi todo el código lo escribe la IA', 'Las personas orquestan y revisan'],
    },
    l4: {
      code: 'L4',
      short: 'Totalmente IA',
      name: 'Generado totalmente por IA',
      alt: 'Marca L4: creado totalmente con herramientas de IA',
      body: [
        'En el nivel 4, el papel de orquestar pasa a un agente. Las personas ya no están en el bucle, y los agentes toman todas las decisiones por su cuenta.',
        'Una persona fija los objetivos y deja a los agentes trabajando en bucle. La intervención humana es rara y solo ocurre cuando hace falta. Los resultados llegan a la persona para usarlos o estudiarlos solo cuando el trabajo está terminado.',
      ],
      uses: ['Una persona fija el objetivo', 'Agentes que orquestan a otros agentes', 'Resultados revisados al terminar'],
    },
  },

  compareTitle: 'Los niveles, lado a lado',
  compareIntro: 'Cada fila hace la misma pregunta a los cuatro niveles.',
  compareCaption: 'Comparación de los cuatro niveles de uso de IA',
  rows: [
    {
      q: 'Cuánta IA',
      a: ['Escasa o insignificante', 'Moderada', 'Intensiva', 'Generado totalmente por IA'],
    },
    {
      q: 'En qué trabaja la IA',
      a: ['Pequeñas tareas de apoyo', 'Partes clave del proyecto', 'Casi todo el trabajo, en bucles automáticos', 'Todo el trabajo'],
    },
    {
      q: 'Quién hace el trabajo principal',
      a: ['Yo', 'Yo, con la IA generando partes clave', 'Agentes de IA', 'Agentes de IA'],
    },
    {
      q: 'Quién toma las decisiones clave',
      a: ['Yo', 'Yo', 'Yo, aunque la IA toma algunas decisiones cruciales por su cuenta', 'Los agentes, hacia los objetivos que fijo'],
    },
    {
      q: 'La IA actúa sin preguntar',
      a: ['No', 'No', 'Sí', 'Sí'],
    },
    {
      q: 'Persona en el bucle',
      a: ['Sí, todo el tiempo', 'Sí, todo el tiempo', 'Sí, para las decisiones clave', 'No, solo al principio y al final'],
    },
    {
      q: 'Mi papel',
      a: ['Creador', 'Creador, con la IA como herramienta', 'Orques­tador y gestor', 'Fija el objetivo, interviene poco y estudia los resultados'],
    },
    {
      q: 'Ejemplos de uso',
      a: [
        'Parafrasear, ver si algo es viable, gráficos, revisar mi trabajo',
        'Escribir código, texturas 3D, configurar dispositivos',
        'Bucles de agentes que escriben casi todo el código',
        'Agentes trabajando solos hacia un objetivo fijado',
      ],
    },
  ],

  downloadTitle: 'Descarga las marcas',
  downloadIntro:
    'Cada nivel viene como etiqueta, como icono más pequeño y en versiones vertical y horizontal con un código QR que enlaza a esta página, todo en archivos SVG que puedes usar para marcar tus propios proyectos.',
  marks: {
    label: { label: 'Etiqueta', name: 'etiqueta' },
    icon: { label: 'Icono', name: 'icono' },
    'vertical-qr': { label: 'QR vertical', name: 'código QR vertical' },
    'horizontal-qr': { label: 'QR horizontal', name: 'código QR horizontal' },
  },
  markAlt: 'Marca {code}, {name}',
  downloadLabel: 'Descargar la marca {code}, {name}, en SVG',
};

export default es;
