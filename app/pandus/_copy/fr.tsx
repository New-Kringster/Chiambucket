import type { PandusCopy } from './en';

/* The Pandus Dispenser article in French. Same shape as en.tsx. */
const fr: PandusCopy = {
  meta: {
    title: 'Pandus Dispenser | Braven Chiam',
    description: 'Mon premier projet d’école à Nanyang Polytechnic était un distributeur de sirop fait de six pièces imprimées en 3D et piloté par un Arduino Uno, que j’ai programmé en Python avec PyFirmata.',
    ogDescription: 'Pandus est un distributeur de sirop fait de six pièces imprimées en 3D et piloté par un Arduino Uno avec PyFirmata.',
  },
  ld: { headline: 'Pandus Dispenser' },
  hero: {
    alt: 'Le distributeur de sirop Pandus',
    back: 'Retour aux projets',
    tag: 'Projet d’école',
    title: <>Pandus <em>Dispenser</em></>,
    lead: 'Pandus était mon premier projet d’école, un distributeur de sirop fait de six pièces imprimées en 3D et piloté par un Arduino Uno. Je l’ai construit avec les composants qu’on nous avait donnés en cours, plus quelques-uns que j’ai achetés.',
    builtWith: 'Fait avec',
    links: { video: 'Vidéo de démo', cad: 'Modèle 3D' },
  },
  chapters: 'Chapitres',
  rail: {
    PromotionalVideo: 'Vidéo', ProjectBackground: 'Contexte', DesignProcess: 'Design',
    ControlnFunction: 'Commande', Coverimg: 'Image de couverture',
  },
  video: { h: 'Vidéo', title: 'Vidéo du Pandus Dispenser' },
  background: {
    h: 'Contexte',
    p: [
      'Pandus a été mon premier gros projet en tant qu’étudiant de première année à Nanyang Polytechnic, et le sujet était libre, sans thème. On nous avait donné un Arduino Uno, un servo 4G, des LED, des boutons, des interrupteurs à glissière, un module infrarouge de détection d’obstacle et un paquet de fils.',
      'J’avais prévu un distributeur d’eau, mais quelqu’un d’autre l’avait déjà choisi, alors j’ai fait un distributeur de sirop à la place.',
    ],
    alt: 'Le tournage d’une partie de la vidéo de Pandus',
    caption: 'Le tournage d’une partie de la vidéo',
  },
  design: {
    h: 'Design',
    p: 'J’ai conçu Pandus dans Onshape, et comme j’avais peu d’expérience avec, apprendre le logiciel m’a pris beaucoup de temps. Il n’en restait plus pour des prototypes, donc j’ai envoyé le design final directement à l’imprimante 3D, et toutes les pièces se sont emboîtées dès la première impression.',
    explodedAlt: 'Vue éclatée du modèle Pandus dans Onshape',
    assembledAlt: 'Le modèle Pandus assemblé dans Onshape',
    cadTitle: 'Modèle 3D',
    cadText: 'Tu peux faire tourner le modèle Pandus dans Onshape et le démonter.',
    cadButton: 'Ouvrir le modèle 3D dans Onshape',
  },
  control: {
    h: 'Commande',
    p: [
      'On nous a appris à programmer l’Arduino en Python avec la bibliothèque Firmata. En plus des composants du cours, j’ai acheté des LED haute puissance, une pompe DC et une carte relais, et j’ai alimenté les composants gourmands en courant avec une batterie externe séparée.',
      'La démo ci-dessous fait tourner un cycle de distribution tiré de l’organigramme plus bas, et tu peux choisir un niveau pour le lancer toi-même.',
    ],
    alts: [
      'Organigramme dans lequel le capteur infrarouge ouvre le servo et allume la LED, le bouton de sélection règle le niveau et le bouton de confirmation fait tourner la pompe 3, 4 ou 5 secondes',
      'Schéma électrique de l’Arduino Uno, du servo, du capteur infrarouge, des relais, de la pompe DC, de la LED haute puissance, du buzzer, des boutons et des LED témoins',
      'Le câblage à l’intérieur de Pandus, avec la carte relais, les boutons et les LED témoins',
      'La breadboard, le buzzer et l’Arduino Uno à l’intérieur de Pandus',
    ],
  },
  cover: {
    h: 'Image de couverture',
    p: 'J’ai photographié Pandus quatre fois sous des éclairages différents et j’ai fusionné les quatre photos dans Photoshop pour faire la couverture.',
    caption: 'Comment les quatre photos se combinent pour former la couverture',
  },

  demo: {
    level: 'Niveau {n}',
    ledText: ['la LED rouge', 'les LED rouge et jaune', 'les trois LED'],
    pump: 'pompe {s} s',
    phases: {
      idle: { label: 'En attente', blurb: 'Le distributeur attend que le module infrarouge de détection d’obstacle détecte un gobelet.' },
      wake: { label: 'Gobelet', blurb: 'Quand un gobelet déclenche le module infrarouge, le servo tourne à 180° pour ouvrir la trappe au-dessus des boutons, la LED haute puissance s’allume et le niveau revient à 1.' },
      select: { label: 'Choix', blurb: 'Le bouton de sélection passe par les niveaux 1, 2 et 3, et les LED témoins montrent lequel est choisi.' },
      pour: { label: 'Versement', blurb: 'Le bouton de confirmation allume la pompe DC via le relais pendant 3, 4 ou 5 secondes, selon le niveau.' },
      done: { label: 'Fini', blurb: 'La pompe s’arrête et tout s’éteint jusqu’au prochain gobelet.' },
    },
    selectNow: 'Il est au niveau {n} en ce moment, ce qui allume {leds}.',
    cup: {
      idle: 'Gobelet sous le bec, vide et en attente',
      empty: 'Gobelet sous le bec, vide',
      filling: 'Gobelet sous le bec, en train de se remplir au niveau {n}',
      filled: 'Gobelet sous le bec, rempli au niveau {n}',
    },
    status: { reduced: '{level} · pompe {s} s', auto: 'En auto · {level}', pick: 'Ton choix · {level}' },
    resume: 'Mode auto',
    levelsAria: 'Choisir un niveau',
    railAria: 'Cycle de distribution',
    again: 'Encore un',
    schemaAria: 'État des composants',
    comps: {
      ir: { label: 'Module IR', full: 'Module infrarouge de détection d’obstacle' },
      servo: { label: 'Trappe', full: 'Trappe à servo au-dessus des boutons' },
      led: { label: 'LED', full: 'LED haute puissance au-dessus du gobelet' },
      pump: { label: 'Pompe', full: 'Pompe DC commutée par un relais' },
    },
    states: { watching: 'Surveille', triggered: 'Déclenché', closed: 'Fermée', open: 'Ouverte', on: 'Allumée', off: 'Éteinte', running: 'En marche' },
  },
};

export default fr;
