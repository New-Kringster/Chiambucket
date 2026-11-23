import type { ElecfCopy } from './en';

/* The ELEC-F article in French. Same shape as en.tsx. */
const fr: ElecfCopy = {
  meta: {
    title: 'ELEC-F | Braven Chiam',
    description: 'ELEC-F est un système de chambre froide sécurisée construit par mon équipe de quatre, dans lequel deux contrôleurs M5Stack Fire avec des modules ToF, PIR et RGB déclenchent une alarme quand quelqu’un reste enfermé trop longtemps dans une chambre froide.',
    ogDescription: 'Un système de sécurité pour chambre froide sur M5Stack, qui surveille la porte avec un capteur ToF et la pièce avec un capteur PIR, et donne l’alerte avec une lumière RGB et un buzzer.',
  },
  ld: { headline: 'Elec-F : système de chambre froide sécurisée' },
  hero: {
    alt: 'Le prototype de chambre froide ELEC-F en carton, avec le M5Stack et les capteurs',
    back: 'Retour aux projets',
    tags: { school: 'Projet d’école', team: 'Équipe de 4' },
    key: 'ELEC-F',
    title: <>Chambre froide <em>sécurisée</em></>,
    lead: 'ELEC-F est un système de chambre froide sécurisée que mon équipe de quatre a construit pour un cours d’ingénierie. Il surveille la porte d’une chambre froide et la pièce à l’intérieur, et déclenche une alarme si quelqu’un reste enfermé trop longtemps.',
    builtWith: 'Fait avec',
    links: ['GitHub', 'Vidéo de démo'],
  },
  chapters: 'Chapitres',
  rail: {
    Demo: 'Démo', Problem: 'Le problème', Objective: 'Objectifs', HowItWorks: 'Comment ça marche',
    Hardware: 'Matériel', Logic: 'Logique', Build: 'Prototype', Team: 'Équipe',
  },
  demo: { h: 'Démo', video: 'Vidéo de démo d’ELEC-F' },
  problem: {
    h: 'Le problème',
    p1: 'À mesure que les usines s’automatisent, la sécurité doit suivre, et un risque souvent négligé, c’est la chambre froide, où un employé peut se retrouver enfermé.',
    howH: 'Comment ça arrive',
    how: [
      'La porte peut lâcher, parce que les loquets usés se coincent, l’humidité gèle les joints et les ouvertures d’urgence peuvent être cassées, absentes ou prises dans la glace.',
      'Personne ne se rend peut-être compte que quelqu’un est encore à l’intérieur, et les employés expérimentés peuvent devenir négligents.',
    ],
    whyH: 'Pourquoi c’est dangereux',
    why: [
      'Le froid provoque une hypothermie, qui entraîne de la confusion puis une perte de conscience.',
      'Une chambre froide fermée peut manquer d’oxygène, ce qui peut mener à l’asphyxie.',
      'La panique et les tentatives pour sortir causent des chutes et d’autres blessures.',
      'Sans secours à temps, rester enfermé longtemps peut être mortel.',
    ],
    p2: 'Être enfermé provoque aussi de la panique, surtout chez les personnes atteintes de cléithrophobie, la peur de ne pas pouvoir s’échapper. ELEC-F doit raccourcir le temps pendant lequel quelqu’un reste coincé et lui faire savoir que les secours arrivent.',
  },
  goals: {
    h: 'Objectifs',
    items: [
      'Empêcher que des employés restent coincés dans une chambre froide d’usine.',
      'Garder le contact avec toute personne enfermée et la rassurer.',
      'Fonctionner de façon fiable dans une pièce froide, humide et fermée.',
    ],
  },
  how: {
    h: 'Comment ça marche',
    p1: 'Pendant que la porte est ouverte, tu règles une durée limite sur le M5Stack, et fermer la porte lance le minuteur. Si le minuteur arrive à zéro alors que quelqu’un est encore à l’intérieur, l’alarme se déclenche.',
    partsIntro: 'Le système a quatre parties qui fonctionnent ensemble :',
    parts: [
      <>Le <b>minuteur</b> se règle sur le M5Stack pendant que la porte est ouverte et démarre quand la porte se ferme.</>,
      <>Le <b>capteur de porte</b> est un capteur à temps de vol (ToF) qui mesure une distance pour savoir si la porte est ouverte ou fermée.</>,
      <>Le <b>capteur de présence</b> est un capteur PIR qui détecte la chaleur du corps et le mouvement pour savoir si quelqu’un est encore dans la pièce.</>,
      <>L’<b>alarme</b> fait clignoter le module RGB et sonner le buzzer si la porte reste fermée au-delà de la limite avec quelqu’un à l’intérieur.</>,
    ],
    p2: 'On a choisi des capteurs ToF et PIR parce que les deux continuent de marcher sous zéro.',
  },
  seq: {
    steps: {
      open: {
        label: 'Porte ouverte',
        title: 'Régler le minuteur',
        desc: 'Quand un employé entre, le capteur PIR détecte la chaleur de son corps et ses mouvements, et le capteur ToF voit la porte ouverte. Tu règles alors sur le M5Stack combien de temps la porte peut rester fermée.',
        alt: 'L’écran du M5Stack à l’étape 1, régler le minuteur',
        pir: 'Quelqu’un dedans',
        tof: 'Porte ouverte',
      },
      armed: {
        label: 'Porte fermée',
        title: 'Minuteur lancé',
        desc: 'Quand la porte se ferme, le capteur ToF la voit fermée et le minuteur démarre, mais si la pièce se vide avant la fin du temps, le système se réinitialise.',
        alt: 'L’écran du M5Stack à l’étape 2, minuteur lancé',
        pir: 'Quelqu’un dedans',
        tof: 'Porte fermée',
      },
      alarm: {
        label: 'Temps écoulé',
        title: 'Alarme',
        desc: 'Si le temps s’écoule avec quelqu’un encore à l’intérieur, le module RGB clignote et le buzzer du M5Stack sonne pour alerter les personnes autour, jusqu’à ce que la porte soit ouverte.',
        alt: 'L’écran du M5Stack à l’étape 3, alarme',
        pir: 'Quelqu’un dedans',
        tof: 'Porte fermée',
      },
    },
    eyebrow: 'Étape {n} sur {total} · {label}',
    chips: { pir: 'PIR', tof: 'ToF', alert: 'Alerte' },
    alert: { idle: 'En veille', armed: 'Armée', sounding: 'Lumière RGB et buzzer' },
    pirSizer: 'Présence détectée',
    stepsAria: 'Étapes',
    dotAria: 'Étape {n} : {title}',
    prev: 'Étape précédente',
    nextAria: 'Étape suivante',
    next: 'Suivant',
  },
  hardware: {
    h: 'Matériel',
    p: 'Tout est en M5Stack, ce qui rendait le prototypage rapide et le changement de modules facile. Deux contrôleurs M5Stack Fire font tourner la logique et l’affichage, et un module Mini Hub divise l’unique port du Fire pour que chaque capteur ait un endroit où se brancher.',
    figAlt: 'Le M5Stack Fire relié aux modules ToF, PIR et RGB',
    figCaption: 'Le M5Stack Fire et ses modules capteurs',
    components: {
      fire: { name: 'M5Stack Fire ×2', role: 'Contrôleur', desc: 'Il fait tourner le minuteur, lit les capteurs et pilote l’écran, et il a le buzzer intégré.' },
      hub: { name: 'Module Mini Hub', role: 'Extension', desc: 'Il divise l’unique port du Fire pour que chaque capteur puisse se brancher.' },
      tof: { name: 'Capteur ToF', role: 'État de la porte', desc: 'Il mesure une distance pour savoir si la porte de la chambre froide est ouverte ou fermée.' },
      pir: { name: 'Capteur PIR', role: 'Présence', desc: 'Il détecte la chaleur du corps et le mouvement pour savoir si quelqu’un est encore à l’intérieur.' },
      rgb: { name: 'Module RGB', role: 'Alarme', desc: 'Il clignote en même temps que le buzzer quand quelqu’un est à l’intérieur au-delà de la limite.' },
    },
    wiringAlt: 'Le câblage d’ELEC-F',
    wiringCaption: 'Comment les modules sont câblés entre eux',
  },
  logic: {
    h: 'Logique',
    p: 'L’organigramme ci-dessous montre toute la boucle que fait tourner le M5Stack. Les boutons règlent la durée limite pendant que la porte est ouverte, et une fois la porte fermée, le minuteur tourne et les capteurs décident de la suite.',
    flowAlt: 'L’organigramme logiciel d’ELEC-F, du réglage du minuteur jusqu’au déclenchement de l’alarme',
    blockAlt: 'Le schéma fonctionnel du système ELEC-F',
    blockCaption: 'Schéma fonctionnel du système',
  },
  build: {
    h: 'Prototype',
    p: 'On a fabriqué la chambre froide et sa porte en carton pour tester les capteurs et le minutage de bout en bout avant de penser à un vrai boîtier.',
    alts: ['Le prototype ELEC-F avec les capteurs montés', 'La porte du prototype ELEC-F'],
    posterAlt: 'L’affiche du projet ELEC-F',
    posterCaption: 'L’affiche du projet',
    repo: {
      title: 'ELEC-F sur GitHub',
      text: 'Le dépôt contient le code M5Stack du minuteur de porte, des mesures des capteurs et de l’alarme.',
      button: 'Voir le code sur GitHub',
    },
  },
  team: {
    h: 'Équipe',
    lead: 'Chef d’équipe',
    member: 'Membre de l’équipe',
    me: 'Braven (moi)',
    profile: 'Profil',
  },
};

export default fr;
