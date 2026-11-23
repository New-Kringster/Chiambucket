import type { CsdpCopy } from './en';

/* The EMA Smart Home article in French. Same shape as en.tsx. */
const fr: CsdpCopy = {
  meta: {
    title: 'EMA Smart Home | Braven Chiam',
    description: 'Un système de maison connectée que mon équipe de cinq a construit à l’école et pour lequel on a eu un A. Quatre nœuds BeagleBone Black Wireless s’occupent du climat, de la salle de bain, de la cuisine et de la porte, et un serveur web SocketIO les relie et héberge un tableau de bord en direct avec une vue 3D Spline.',
  },
  ld: { headline: 'EMA Smart Home' },
  hero: {
    alt: 'EMA Smart Home',
    back: 'Retour aux projets',
    tag: 'Projet d’école, équipe de cinq',
    title: <>EMA Smart <em>Home</em></>,
    lead: 'C’est un système de maison connectée construit sur quatre cartes BeagleBone Black Wireless pour réduire l’énergie consommée par une maison. C’est le projet de groupe le plus complexe sur lequel j’ai travaillé, il faisait appel à plusieurs de nos cours, et on a eu un A.',
    builtWith: 'Fait avec',
    links: { demo: 'Démo en ligne', github: 'GitHub', video: 'Vidéo promo' },
  },
  chapters: 'Chapitres',
  rail: {
    PromoVideo: 'Vidéo', Team: 'Équipe', ProjBackground: 'Le brief', DesignProcess: 'Tableau de bord',
    Climate: 'Nœud climat', Bathroom: 'Nœud salle de bain', Kitchen: 'Nœud cuisine', Intrusion: 'Nœud intrusion',
    Connectivity: 'Connectivité', SlideDeck: 'Présentation', Documentation: 'Documentation',
  },
  video: { h: 'Vidéo', title: 'Vidéo promotionnelle d’EMA Smart Home' },
  team: {
    h: 'Équipe',
    roles: ['Chef d’équipe, docs, code', 'Graphisme, code, design', 'Docs, code', 'Docs, code', 'Membre de l’équipe'],
    me: '{name} (moi)',
    profile: 'Profil',
    noProfile: 'Pas de profil',
  },
  brief: {
    h: 'Le brief',
    p: 'On nous a donné quatre cartes BeagleBone Black Wireless et un lot de modules click MikroBUS, et on nous a demandé de construire un système connecté en Wi-Fi qui favorise un mode de vie durable. On a construit un système de maison connectée qui suit la consommation d’énergie en temps réel et commute les appareils pour la réduire, puis on a ajouté un nœud de détection d’intrusion.',
    alt: 'L’emplacement de chaque carte dans la maison',
    caption: 'L’emplacement de chaque carte dans la maison',
  },
  dashboard: {
    h: 'Tableau de bord',
    p: <>La plus grande partie du projet était du logiciel, donc le travail de design a surtout servi à rendre le tableau de bord clair, lisible et rapide à comprendre. On a aussi ajouté un modèle 3D Spline de la maison qui montre chaque action au moment où elle se produit, et tu peux l’essayer toi-même dans la <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">démo en ligne</a>.</>,
    mockAlt: 'La maquette Figma du tableau de bord',
    mockCaption: 'La maquette Figma du tableau de bord',
    finishedCaption: 'Le tableau de bord terminé',
    splineCaption: 'La vue 3D Spline qui montre les actions en direct',
  },
  nodes: {
    Climate: {
      h: 'Nœud climat',
      p: 'Le nœud climat surveille la température, l’humidité et la présence de quelqu’un dans la pièce, et il n’allume le ventilateur que si une personne est détectée et que la pièce est chaude et humide.',
      alt: 'Le matériel du nœud climat',
    },
    Bathroom: {
      h: 'Nœud salle de bain',
      p: 'Tu règles la durée de ta douche avec les boutons et l’écran. Le minuteur démarre quand le nœud te détecte en train d’entrer dans la douche, et un buzzer sonne quand le temps est écoulé.',
      alt: 'Le matériel du nœud salle de bain',
    },
    Kitchen: {
      h: 'Nœud cuisine',
      p: 'Le nœud cuisine surveille la consommation d’énergie du frigo et envoie un score énergétique au tableau de bord. Il sert aussi d’alarme incendie, donc s’il détecte un feu incontrôlé, l’alarme sonne sur tous les nœuds.',
      alt: 'Le matériel du nœud cuisine',
    },
    Intrusion: {
      h: 'Nœud intrusion',
      p: 'Le nœud intrusion détecte les coups frappés à la porte et l’ouverture de la porte à des heures inhabituelles, et dans les deux cas il fait sonner une alarme sur tous les nœuds.',
      alt: 'Le matériel du nœud intrusion',
    },
  },
  connectivity: {
    h: 'Connectivité',
    p: [
      'Chaque carte se connecte à un serveur web SocketIO, qui héberge le tableau de bord et coordonne les événements et les alarmes entre les nœuds.',
      'La carte ci-dessous montre les quatre nœuds et le serveur. Choisis un nœud pour voir ce qu’il fait, ou simule un feu dans la cuisine pour voir l’alarme atteindre tous les nœuds.',
    ],
    diagramAlt: 'Schéma de la connexion entre les nœuds, le serveur et le tableau de bord',
    diagramCaption: 'Comment les nœuds, le serveur et le tableau de bord se connectent',
    repoTitle: 'Le code sur GitHub',
    repoText: 'Le dépôt contient le code de chaque nœud et du serveur SocketIO qui héberge le tableau de bord.',
    repoButton: 'Voir le code sur GitHub',
  },
  slides: { h: 'Présentation', title: 'La présentation d’EMA Smart Home (PDF)', open: 'Ouvrir la présentation (PDF)' },
  docs: { h: 'Documentation', title: 'La documentation d’EMA Smart Home (PDF)', open: 'Ouvrir la documentation (PDF)' },

  nodeMap: {
    nodes: {
      climate: {
        name: 'Climat',
        short: 'Ventilateur',
        does: 'Il n’allume le ventilateur que si quelqu’un est dans la pièce et que l’air est chaud et humide.',
        hardware: 'Capteur de température et d’humidité BME680, capteur de présence PIR, matrice LED 8x8, buzzer',
        alarm: 'Il sonne dès qu’un nœud donne l’alarme',
      },
      bathroom: {
        name: 'Salle de bain',
        short: 'Minuteur douche',
        does: 'Il chronomètre ta douche selon la durée réglée avec les boutons, à partir du moment où tu entres.',
        hardware: 'Capteur PIR, écran OLED, boutons capacitifs, buzzer',
        alarm: 'Il joue trois notes quand le temps est écoulé',
      },
      kitchen: {
        name: 'Cuisine',
        short: 'Énergie et feu',
        does: 'Il envoie la consommation d’énergie du frigo au tableau de bord sous forme de score et surveille le feu.',
        hardware: 'Capteur de courant analogique, Flame Click, écran OLED, buzzer',
        alarm: 'Un feu déclenche l’alarme sur tous les nœuds',
      },
      intrusion: {
        name: 'Intrusion',
        short: 'Sécurité porte',
        does: 'Il surveille les coups frappés à la porte et son ouverture à des heures inhabituelles.',
        hardware: 'Interrupteur reed sur la porte, capteur de vibration pour les coups, buzzer',
        alarm: 'Chacun des deux déclenche l’alarme sur tous les nœuds',
      },
    },
    hub: { label: 'Serveur web', idle: 'SocketIO, héberge le tableau de bord', alarm: 'Alarme envoyée à tous les nœuds' },
    nodeAria: 'Nœud {name}',
    nodeAriaAlarm: 'Nœud {name}, alarme en cours',
    alarmTag: 'Alarme',
    caption: 'Chaque ligne est une liaison SocketIO, et les points sont des mesures en route vers le serveur.',
    eyebrow: { pinned: 'Nœud choisi', idle: 'Choisis un nœud' },
    tabsAria: 'Nœuds capteurs',
    cardTitle: 'Nœud {name}',
    terms: { does: 'Rôle', hardware: 'Matériel', buzzer: 'Buzzer' },
    status: {
      idle: 'Connecté, il envoie ses mesures au serveur',
      arming: 'La cuisine voit une flamme et son buzzer sonne',
      travelling: 'Alarme en route vers le serveur',
      received: 'Le serveur diffuse l’alarme et tous les nœuds sonnent',
    },
    sim: { run: 'Simuler un feu en cuisine', busy: 'Alarme en cours' },
    hint: 'Quand le nœud cuisine détecte une flamme, le serveur reçoit l’alarme et la transmet à tous les nœuds.',
  },
};

export default fr;
