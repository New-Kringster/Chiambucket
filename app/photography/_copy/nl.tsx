import type { PhotographyCopy } from './en';

/* De Nederlandse woorden van de fotografiepagina, in dezelfde vorm als en.tsx. */
const nl: PhotographyCopy = {
  meta: {
    title: 'Fotografie | Braven Chiam',
    description:
      'Fotoalbums van Braven Chiam uit Europa, China, Nieuw-Zeeland en Hongkong, plus ultrabrede 21:9-beelden, en de software waarmee hij bewerkt.',
    twitterDescription: 'Fotoalbums van Braven Chiam uit Europa, China, Nieuw-Zeeland, Hongkong en meer.',
    ldName: 'Fotografie van Braven Chiam',
    ldDescription: 'Fotoalbums van Braven Chiam uit Europa, China, Nieuw-Zeeland en Hongkong, plus ultrabrede 21:9-beelden.',
  },
  hero: {
    kicker: 'Fotografie',
    title: <>Fotografie <em>en design</em></>,
    sub: 'Dit zijn mijn albums uit Europa, China, Nieuw-Zeeland en Hongkong, plus een reeks ultrabrede 21:9-beelden, en ze komen uit een Lychee-galerij die ik op mijn homelab host. Eerst de programma’s waarmee ik bewerk, daarna de albums.',
    allPhotos: 'Alle foto’s',
    youtube: 'Video’s op YouTube',
  },
  tools: {
    eyebrow: 'Software',
    title: 'Waarmee ik bewerk',
    cardLabel: 'Details van {name}',
    iconAlt: 'Icoon van {name}',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: 'Ik leerde video’s monteren in Premiere Pro, maar het crashte te vaak, dus ik stapte over op DaVinci Resolve.',
        add: 'Ik leerde het samen met Photoshop en gebruik het niet meer.',
        chips: ['Videomontage', 'Tijdlijnen', 'Hier begon ik'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'Ik gebruik Illustrator voor logo’s en alles wat netjes moet schalen als SVG, al minder vaak dan Photoshop.',
        add: 'Ik teken er ook iconen en ander vectorwerk in.',
        chips: ['Logo’s', 'Vector / SVG', 'Iconen'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: 'Ik gebruik Figma voor ontwerpen die uit vormen bestaan in plaats van foto’s, dus de meeste van mijn interfaces en posters beginnen daar als frames.',
        add: 'Hier maak ik prototypes van interfaces en zet ik posters op, voordat ik ze in code bouw of laat drukken.',
        chips: ['UI-ontwerp', 'Prototypes', 'Opmaak'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: 'Mijn belangrijkste tool sinds 2019. Ik kreeg er les in via de mediaclub van mijn school, en ik gebruik het om foto’s te retoucheren en posters op te maken.',
        add: 'Naast retoucheren en posters gebruik ik het ook voor compositing.',
        chips: ['Fotobewerking', 'Posters', 'Compositing'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'Ik monteer mijn video’s in Resolve, omdat knippen, kleur en exporteren allemaal in één programma gebeuren. Ik post ze zelden, maar er staan er meer op de planning.',
        add: 'Voor mij verving het Premiere Pro, dat steeds crashte.',
        chips: ['Videomontage', 'Color grading', 'Projectfilms'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: 'De meeste foto’s maak ik af in Lightroom, waar ik hoge lichten, schaduwen en detail terughaal uit RAW-bestanden die anders onbruikbaar zouden zijn.',
        add: 'Meestal is het het laatste programma waar een foto uit de albums hieronder doorheen gaat.',
        chips: ['Fotobewerking', 'Kleur', 'RAW-workflow'],
      },
    },
  },
  figma: {
    label: 'Figma-board',
    open: 'Open in Figma',
    openLabel: 'Open het board in Figma',
    frameTitle: 'Figma-board: Random board',
    caption: 'Een Figma-bestand waar ik aan werk en waarin ik interfaces en posters opzet voordat ik ze bouw of laat drukken.',
  },
  galleries: {
    eyebrow: 'Galerijen',
    title: 'Albums',
    open: 'Open album',
    openLabel: 'Open de galerij {title}',
    showAll: 'Alle foto’s tonen',
    albums: {
      highlight: 'Uitgelicht',
      europe: 'Europa',
      '21by9': '21:9',
      china: 'China',
      zealand: 'Nieuw-Zeeland',
      hongkong: 'Hongkong',
      general: 'Algemeen',
    },
  },
};
export default nl;
