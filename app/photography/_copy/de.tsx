import type { PhotographyCopy } from './en';

/* The photography page's German words, in the shape of en.tsx. */
const de: PhotographyCopy = {
  meta: {
    title: 'Fotografie | Braven Chiam',
    description:
      'Fotoalben von Braven Chiam aus Europa, China, Neuseeland und Hongkong, dazu ultrabreite Bilder in 21:9 und die Software, mit der er bearbeitet.',
    twitterDescription: 'Fotoalben von Braven Chiam aus Europa, China, Neuseeland, Hongkong und mehr.',
    ldName: 'Fotografie von Braven Chiam',
    ldDescription: 'Fotoalben von Braven Chiam aus Europa, China, Neuseeland und Hongkong, dazu ultrabreite Bilder in 21:9.',
  },
  hero: {
    kicker: 'Fotografie',
    title: <>Fotografie <em>und Design</em></>,
    sub: 'Hier sind meine Alben aus Europa, China, Neuseeland und Hongkong, dazu eine Reihe ultrabreiter Bilder in 21:9, und sie kommen aus einer Lychee-Galerie, die ich auf meinem Homelab hoste. Zuerst kommen die Programme, mit denen ich bearbeite, danach die Alben.',
    allPhotos: 'Alle Fotos',
    youtube: 'Videos auf YouTube',
  },
  tools: {
    eyebrow: 'Software',
    title: 'Womit ich bearbeite',
    cardLabel: 'Details zu {name}',
    iconAlt: 'Symbol von {name}',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: 'Videoschnitt habe ich mit Premiere Pro gelernt, aber es ist zu oft abgestürzt, also bin ich zu DaVinci Resolve gewechselt.',
        add: 'Ich habe es zusammen mit Photoshop gelernt und nutze es nicht mehr.',
        chips: ['Videoschnitt', 'Timelines', 'Mein Einstieg'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'Illustrator nutze ich für Logos und alles, was als SVG sauber skalieren muss, allerdings seltener als Photoshop.',
        add: 'Ich zeichne darin auch Icons und andere Vektorgrafiken.',
        chips: ['Logos', 'Vektor / SVG', 'Icons'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: 'Figma nutze ich für Designs, die aus Formen statt aus Fotos bestehen, deshalb fangen die meisten meiner Oberflächen und Poster dort als Frames an.',
        add: 'Hier baue ich Prototypen von Oberflächen und lege Poster an, bevor ich sie in Code umsetze oder in den Druck gebe.',
        chips: ['UI-Design', 'Prototyping', 'Layout'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: 'Mein wichtigstes Werkzeug seit 2019. Ich hatte eine richtige Schulung im Medienclub meiner Schule, und ich nutze es zum Retuschieren von Fotos und zum Gestalten von Postern.',
        add: 'Neben Retusche und Postern nutze ich es auch für Compositing.',
        chips: ['Fotobearbeitung', 'Poster', 'Compositing'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'Meine Videos schneide ich in Resolve, weil Schnitt, Farbe und Export alle in einem Programm passieren. Ich veröffentliche sie selten, aber es sind mehr geplant.',
        add: 'Es hat bei mir Premiere Pro ersetzt, das ständig abgestürzt ist.',
        chips: ['Videoschnitt', 'Color Grading', 'Projektfilme'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: 'Die meisten meiner Fotos werden in Lightroom fertig. Dort hole ich Lichter, Schatten und Details aus RAW-Dateien zurück, die sonst unbrauchbar wären.',
        add: 'Meist ist es das letzte Programm, durch das ein Foto in den Alben unten geht.',
        chips: ['Fotobearbeitung', 'Farbe', 'RAW-Workflow'],
      },
    },
  },
  figma: {
    label: 'Figma-Board',
    open: 'In Figma öffnen',
    openLabel: 'Das Board in Figma öffnen',
    frameTitle: 'Figma-Board: Random board',
    caption: 'Eine Arbeitsdatei in Figma, in der ich Oberflächen und Poster anlege, bevor ich sie baue oder drucke.',
  },
  galleries: {
    eyebrow: 'Galerien',
    title: 'Alben',
    open: 'Album öffnen',
    openLabel: 'Galerie {title} öffnen',
    showAll: 'Alle Fotos zeigen',
    albums: {
      highlight: 'Highlights',
      europe: 'Europa',
      '21by9': '21:9',
      china: 'China',
      zealand: 'Neuseeland',
      hongkong: 'Hongkong',
      general: 'Allgemein',
    },
  },
};

export default de;
