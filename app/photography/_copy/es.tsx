import type { PhotographyCopy } from './en';

/* The photography page's Spanish words. */
const es: PhotographyCopy = {
  meta: {
    title: 'Fotografía | Braven Chiam',
    description:
      'Álbumes de fotos de Braven Chiam de Europa, China, Nueva Zelanda y Hong Kong, además de fotos panorámicas en 21:9, y los programas con los que las edita.',
    twitterDescription: 'Álbumes de fotos de Braven Chiam de Europa, China, Nueva Zelanda, Hong Kong y más.',
    ldName: 'Fotografía de Braven Chiam',
    ldDescription: 'Álbumes de fotos de Braven Chiam de Europa, China, Nueva Zelanda y Hong Kong, además de fotos panorámicas en 21:9.',
  },
  hero: {
    kicker: 'Fotografía',
    title: <>Fotografía <em>y diseño</em></>,
    sub: 'Aquí están mis álbumes de Europa, China, Nueva Zelanda y Hong Kong, más una serie de fotos panorámicas en 21:9, servidos desde una galería Lychee que alojo en mi homelab. Primero van los programas con los que edito, y después los álbumes.',
    allPhotos: 'Todas las fotos',
    youtube: 'Vídeos en YouTube',
  },
  tools: {
    eyebrow: 'Software',
    title: 'Con qué edito',
    cardLabel: 'Detalles de {name}',
    iconAlt: 'Icono de {name}',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: 'Aprendí a editar vídeo con Premiere Pro, pero se colgaba demasiado, así que me pasé a DaVinci Resolve.',
        add: 'Lo aprendí a la vez que Photoshop y ya no lo uso.',
        chips: ['Edición de vídeo', 'Líneas de tiempo', 'Donde empecé'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'Uso Illustrator para logos y todo lo que tenga que escalar limpio como SVG, aunque menos que Photoshop.',
        add: 'También dibujo iconos y otras ilustraciones vectoriales con él.',
        chips: ['Logos', 'Vector / SVG', 'Iconos'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: 'Uso Figma para diseños hechos con formas en vez de fotos, así que casi todas mis interfaces y pósteres empiezan ahí como frames.',
        add: 'Aquí hago prototipos de interfaces y maqueto pósteres antes de programarlos o mandarlos a imprimir.',
        chips: ['Diseño de UI', 'Prototipos', 'Maquetación'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: 'Mi herramienta principal desde 2019. Recibí formación en el club de medios de mi escuela, y lo uso para retocar fotos y maquetar pósteres.',
        add: 'Además de retoques y pósteres, también lo uso para fotomontajes.',
        chips: ['Edición de fotos', 'Pósteres', 'Fotomontaje'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'Edito mis vídeos en Resolve porque el montaje, el color y la exportación se hacen en un solo programa. Casi nunca los publico, pero vendrán más.',
        add: 'Para mí sustituyó a Premiere Pro, que no paraba de colgarse.',
        chips: ['Edición de vídeo', 'Etalonaje', 'Vídeos de proyectos'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: 'Casi todas mis fotos se terminan en Lightroom, donde recupero luces, sombras y detalle de archivos RAW que, si no, serían inservibles.',
        add: 'Suele ser el último programa por el que pasa una foto de los álbumes de abajo.',
        chips: ['Edición de fotos', 'Color', 'Flujo RAW'],
      },
    },
  },
  figma: {
    label: 'Tablero de Figma',
    open: 'Abrir en Figma',
    openLabel: 'Abrir el tablero en Figma',
    frameTitle: 'Tablero de Figma: Random board',
    caption: 'Un archivo de Figma de trabajo donde maqueto interfaces y pósteres antes de construirlos o imprimirlos.',
  },
  galleries: {
    eyebrow: 'Galerías',
    title: 'Álbumes',
    open: 'Abrir álbum',
    openLabel: 'Abrir la galería {title}',
    showAll: 'Ver todas las fotos',
    albums: {
      highlight: 'Favoritas',
      europe: 'Europa',
      '21by9': '21:9',
      china: 'China',
      zealand: 'Nueva Zelanda',
      hongkong: 'Hong Kong',
      general: 'General',
    },
  },
};
export default es;
