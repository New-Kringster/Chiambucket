import type { AiUseCopy } from './en';

/* The /ai-use page in French. Same shape as en.tsx. The four short level names
   match `aiShort` in lib/shell.ts. */
const fr: AiUseCopy = {
  meta: {
    title: 'Échelle d’usage de l’IA | Braven Chiam',
    description:
      'Comment j’utilise l’IA dans mes projets, et l’échelle à quatre niveaux (L1 à L4) qui me sert à indiquer quelle part de chaque projet a été faite avec des outils d’IA.',
  },
  ldHeadline: 'Échelle d’usage de l’IA',

  title: 'Échelle d’usage de l’IA',
  sub: 'Cette échelle sert à montrer de façon transparente l’impact des outils d’IA sur mes projets.',
  scaleLabel: 'Les quatre niveaux',
  humanEnd: 'L’humain décide',
  agentEnd: 'Les agents décident',

  stance: {
    title: 'Pourquoi l’IA, et pourquoi le dire',
    body: [
      'À mon avis, l’IA est une technologie révolutionnaire qui permet un développement rapide et sans précédent dans de nombreux domaines. Au lieu d’encadrer et de limiter son usage comme le font la plupart des institutions, je me laisse explorer ces outils à fond et repousser les limites de ce qu’ils savent faire. Comme ça, j’apprends en continu sur cette technologie qui change sans cesse et progresse vite, ce qui accélère nettement mon travail et en améliore la qualité.',
      'Par contre, je suis vraiment contre l’usage des outils d’IA pour produire du travail bâclé et sans effort, surtout en art. J’utilise des outils d’IA dans mon travail de design, mais je retravaille beaucoup les styles moi-même, jusqu’à ce qu’ils atteignent un niveau que je suis fier de montrer.',
      'C’est pour ça que j’ai créé cette échelle, pour qu’on voie facilement à quel point l’IA a été impliquée dans un projet donné. Si tu la trouves utile, n’hésite pas à l’adopter pour ton travail aussi !',
    ],
  },

  levelsTitle: 'Les quatre niveaux',
  levelsIntro: 'Chaque niveau inclut tout ce que contiennent les niveaux précédents.',
  usesLabel: 'Usages typiques en {code}',
  levels: {
    l1: {
      code: 'L1',
      short: 'Usage léger',
      name: 'Usage faible à insignifiant de l’IA',
      alt: 'Badge L1 : usage léger d’outils basés sur l’IA',
      body: [
        'J’ai utilisé des outils d’IA dans le projet, mais ils n’ont eu que peu ou pas d’impact sur le résultat.',
      ],
      uses: ['Reformulation', 'Idées', 'Vérifications de faisabilité', 'Petites tâches mineures', 'Création de graphiques', 'Relecture de mon travail'],
    },
    l2: {
      code: 'L2',
      short: 'Usage moyen',
      name: 'Usage modéré de l’IA',
      alt: 'Badge L2 : usage moyen d’outils basés sur l’IA',
      body: [
        'Tout le niveau 1, plus des outils d’IA utilisés pour créer ou générer des parties essentielles du projet.',
      ],
      uses: ['Écrire du code', 'Des ressources dont dépend le projet, comme les textures d’un objet 3D', 'Configurer des appareils'],
    },
    l3: {
      code: 'L3',
      short: 'Usage intensif',
      name: 'Usage intensif de l’IA',
      alt: 'Badge L3 : usage intensif d’outils basés sur l’IA',
      body: [
        'Le niveau 3 va un cran plus loin. Les outils d’IA tournaient en boucles d’automatisation et prenaient seuls des décisions cruciales et déterminantes pour le projet, sans demander d’abord à un humain. Le code est presque entièrement écrit par l’IA, avec peu ou pas d’intervention humaine.',
        'Les humains prennent un rôle de plus haut niveau, où ils orchestrent et gèrent le travail que produisent les agents IA. Les humains restent dans la boucle et prennent les décisions clés.',
      ],
      uses: ['Agents en boucles d’automatisation', 'Presque tout le code écrit par l’IA', 'Les humains orchestrent et relisent'],
    },
    l4: {
      code: 'L4',
      short: 'Entièrement IA',
      name: 'Entièrement généré par l’IA',
      alt: 'Badge L4 : entièrement créé par des outils d’IA',
      body: [
        'Au niveau 4, le rôle d’orchestration passe à un agent. Les humains ne sont plus dans la boucle, et les agents prennent toutes les décisions seuls.',
        'Un humain fixe les objectifs et laisse les agents tourner en boucle. L’intervention humaine est rare et n’a lieu qu’en cas de besoin. Les résultats n’arrivent à l’humain, pour qu’il les utilise ou les étudie, qu’une fois le travail terminé.',
      ],
      uses: ['Un humain fixe l’objectif', 'Des agents orchestrent d’autres agents', 'Résultats relus après coup'],
    },
  },

  compareTitle: 'Les niveaux côte à côte',
  compareIntro: 'Chaque ligne pose la même question aux quatre niveaux.',
  compareCaption: 'Comparaison des quatre niveaux d’usage de l’IA',
  /* ­ is a soft hyphen for the long words in the narrow phone columns. */
  rows: [
    {
      q: 'Combien d’IA',
      a: ['Peu ou quasi pas', 'Modérément', 'Beaucoup', 'Tout est généré par l’IA'],
    },
    {
      q: 'Sur quoi l’IA travaille',
      a: ['Petites tâches d’appoint', 'Parties essentielles du projet', 'Presque tout le travail, en boucles d’automatisation', 'Tout le travail'],
    },
    {
      q: 'Qui fait le gros du travail',
      a: ['Moi', 'Moi, avec l’IA qui génère des parties essentielles', 'Des agents IA', 'Des agents IA'],
    },
    {
      q: 'Qui prend les décisions clés',
      a: ['Moi', 'Moi', 'Moi, même si l’IA tranche seule certains points cruciaux', 'Les agents, vers les objectifs que je fixe'],
    },
    {
      q: 'L’IA agit sans demander',
      a: ['Non', 'Non', 'Oui', 'Oui'],
    },
    {
      q: 'Humain dans la boucle',
      a: ['Oui, tout du long', 'Oui, tout du long', 'Oui, pour les décisions clés', 'Non, seulement au début et à la fin'],
    },
    {
      q: 'Mon rôle',
      a: ['Créateur', 'Créateur, avec l’IA comme outil', 'Orches­trateur et gestion­naire', 'Fixe l’objectif, intervient rarement, étudie les résultats'],
    },
    {
      q: 'Exemples d’usage',
      a: [
        'Refor­mulation, vérifications de faisabilité, graphiques, relecture de mon travail',
        'Écrire du code, textures 3D, configurer des appareils',
        'Des boucles d’agents qui écrivent presque tout le code',
        'Des agents qui avancent seuls vers un objectif fixé',
      ],
    },
  ],

  downloadTitle: 'Télécharger les badges',
  downloadIntro:
    'Chaque niveau existe en étiquette, en icône plus petite, et en versions verticale et horizontale avec un QR code qui renvoie vers cette page, le tout en fichiers SVG que tu peux utiliser pour marquer tes propres projets.',
  marks: {
    label: { label: 'Étiquette', name: 'étiquette' },
    icon: { label: 'Icône', name: 'icône' },
    'vertical-qr': { label: 'QR vertical', name: 'QR code vertical' },
    'horizontal-qr': { label: 'QR horizontal', name: 'QR code horizontal' },
  },
  markAlt: 'Badge {code}, {name}',
  downloadLabel: 'Télécharger le badge {code}, {name}, en SVG',
};

export default fr;
