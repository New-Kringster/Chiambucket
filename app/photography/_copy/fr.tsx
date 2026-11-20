import type { PhotographyCopy } from './en';

/* The photography page in French. Same shape as en.tsx. */
const fr: PhotographyCopy = {
  meta: {
    title: 'Photographie | Braven Chiam',
    description:
      'Les albums photo de Braven Chiam en Europe, en Chine, en Nouvelle-Zélande et à Hong Kong, des cadrages ultra-larges en 21:9 et les logiciels avec lesquels il retouche.',
    twitterDescription: 'Les albums photo de Braven Chiam en Europe, en Chine, en Nouvelle-Zélande, à Hong Kong et ailleurs.',
    ldName: 'Photographie de Braven Chiam',
    ldDescription: 'Les albums photo de Braven Chiam en Europe, en Chine, en Nouvelle-Zélande et à Hong Kong, et des cadrages ultra-larges en 21:9.',
  },
  hero: {
    kicker: 'Photographie',
    title: <>Photographie <em>et design</em></>,
    sub: 'Voici mes albums d’Europe, de Chine, de Nouvelle-Zélande et de Hong Kong, plus une série de cadrages ultra-larges en 21:9, servis depuis une galerie Lychee que j’héberge sur mon homelab. D’abord les logiciels avec lesquels je retouche, ensuite les albums.',
    allPhotos: 'Toutes les photos',
    youtube: 'Vidéos sur YouTube',
  },
  tools: {
    eyebrow: 'Logiciels',
    title: 'Mes outils',
    cardLabel: 'Détails de {name}',
    iconAlt: 'Icône de {name}',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: 'J’ai appris le montage vidéo sur Premiere Pro, mais il plantait trop souvent, alors je suis passé à DaVinci Resolve.',
        add: 'Je l’ai appris en même temps que Photoshop et je ne l’utilise plus.',
        chips: ['Montage vidéo', 'Timelines', 'Mes débuts'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'J’utilise Illustrator pour les logos et tout ce qui doit rester net à toutes les tailles en SVG, mais moins souvent que Photoshop.',
        add: 'J’y dessine aussi des icônes et d’autres illustrations vectorielles.',
        chips: ['Logos', 'Vecteur / SVG', 'Icônes'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: 'J’utilise Figma pour les designs faits de formes plutôt que de photos, donc la plupart de mes interfaces et de mes affiches commencent là, sous forme de frames.',
        add: 'J’y prototype les interfaces et j’y mets en page les affiches avant de les coder ou de les envoyer à l’impression.',
        chips: ['Design d’UI', 'Prototypage', 'Mise en page'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: 'Mon outil principal depuis 2019. J’ai été formé au club média de mon école, et je m’en sers pour retoucher les photos et mettre en page les affiches.',
        add: 'En plus de la retouche et des affiches, je m’en sers aussi pour le compositing.',
        chips: ['Retouche photo', 'Affiches', 'Compositing'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'Je monte mes vidéos dans Resolve parce que le montage, l’étalonnage et l’export se font tous dans un seul logiciel. Je les publie rarement, mais d’autres sont prévues.',
        add: 'Il a remplacé Premiere Pro, qui n’arrêtait pas de planter.',
        chips: ['Montage vidéo', 'Étalonnage', 'Films de projet'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: 'La plupart de mes photos sont finalisées dans Lightroom, où je récupère les hautes lumières, les ombres et les détails de fichiers RAW qui seraient sinon inutilisables.',
        add: 'C’est souvent le dernier logiciel par lequel passe une photo des albums ci-dessous.',
        chips: ['Retouche photo', 'Couleur', 'Workflow RAW'],
      },
    },
  },
  figma: {
    label: 'Tableau Figma',
    open: 'Ouvrir dans Figma',
    openLabel: 'Ouvrir le tableau dans Figma',
    frameTitle: 'Tableau Figma : Random board',
    caption: 'Un fichier Figma de travail où je mets en page les interfaces et les affiches avant de les construire ou de les imprimer.',
  },
  galleries: {
    eyebrow: 'Galeries',
    title: 'Albums',
    open: 'Ouvrir l’album',
    openLabel: 'Ouvrir la galerie {title}',
    showAll: 'Voir toutes les photos',
    albums: {
      highlight: 'Sélection',
      europe: 'Europe',
      '21by9': '21:9',
      china: 'Chine',
      zealand: 'Nouvelle-Zélande',
      hongkong: 'Hong Kong',
      general: 'Divers',
    },
  },
};

export default fr;
