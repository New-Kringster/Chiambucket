import type { BrolocatorCopy } from './en';

/* The LoRA Messenger article in French. Same shape as en.tsx. */
const fr: BrolocatorCopy = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: 'Mon premier PCB, un appareil portable à ESP32 qui envoie du texte en LoRa sans internet et fait de la voix full-duplex rudimentaire en ESP-NOW, avec une carte KiCAD, un boîtier Onshape imprimé en 3D et un firmware PlatformIO.',
  },
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'L’appareil LoRA Messenger',
    back: 'Retour aux projets',
    tag: 'Projet perso',
    title: <>LoRA <em>Messenger</em></>,
    lead: 'C’était mon premier PCB et mon premier projet ESP32, une paire d’appareils portables qui s’envoient des textos en LoRa sans internet et qui font de la voix bidirectionnelle full-duplex, un peu rudimentaire, en ESP-NOW quand ils sont à portée. Je l’appelais Brolocator pendant que je le construisais.',
    builtWith: 'Fait avec',
    links: ['GitHub', 'Vidéo de démo', 'Modèle 3D'],
  },
  chapters: 'Chapitres',
  rail: {
    Demo: 'Démo', Functionality: 'Ce qu’il fait', ProjectDevelopment: 'Développement', Code: 'Code',
    PCBDesign: 'PCB', threeDDesign: 'Boîtier', Assembly: 'Assemblage',
  },
  demo: { h: 'Démo', video: 'Vidéo de démo du LoRA Messenger' },
  features: {
    h: 'Ce qu’il fait',
    items: [
      'Envoie des messages texte en LoRa sur de longues distances',
      'Fait de la voix bidirectionnelle en ESP-NOW quand l’autre appareil est à portée',
      'Tourne sur des batteries LiPo rechargeables',
      'A deux écrans',
      'A un mode test de portée',
      'Utilise une interface à menu simple',
    ],
    p: 'Les deux radios ont des rôles différents, parce que LoRa porte plus loin mais ne transporte que de courts paquets de texte, alors qu’ESP-NOW a une courte portée mais va assez vite pour une voix bidirectionnelle rudimentaire. La démo ci-dessous montre les deux.',
    alts: [
      'L’avant du LoRA Messenger',
      'Le côté du LoRA Messenger',
      'Gros plan sur les écrans',
      'L’interface à menu',
      'L’écran de messagerie',
      'Le mode test de portée',
    ],
  },
  demoWidget: {
    texts: [
      'J’arrive, donne-moi 10 min',
      'J’ai trouvé le départ du sentier',
      'Batterie à 40 %, je rentre',
      'Le camp est juste après la crête',
    ],
    radio: {
      lora: {
        label: 'Texte en LoRa',
        short: 'LoRa',
        range: 'Longue distance',
        carries: 'Courts paquets de texte',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa porte bien plus loin qu’ESP-NOW, mais n’a la bande passante que pour du texte.',
      },
      espnow: {
        label: 'Voix en ESP-NOW',
        short: 'ESP-NOW',
        range: 'Liaison directe courte',
        carries: 'Voix full-duplex rudimentaire',
        module: 'L’ESP32 lui-même',
        blurb: 'ESP-NOW est une liaison directe entre les deux ESP32, assez rapide pour une voix bidirectionnelle rudimentaire mais seulement à courte portée.',
      },
    },
    quote: ['« ', ' »'] as [string, string],
    modesAria: 'Choisir une liaison radio',
    replay: 'Lancer la démo',
    you: 'Toi',
    friend: 'Ami',
    screen: {
      pick: 'Choisis un message', sending: 'Envoi', delivered: 'Reçu',
      micLive: 'Micro actif', holdToTalk: 'Appuie et parle',
      newMessage: 'Nouveau message', receiving: 'Réception', standingBy: 'En attente', listening: 'À l’écoute',
    },
    link: {
      inFlight: 'Paquet en route', delivered: 'Reçu', longRange: 'Longue portée',
      streaming: 'Voix dans les deux sens', direct: 'Liaison directe',
    },
    pickLabel: 'Choisis un message, puis envoie-le',
    send: 'Envoyer en LoRa',
    holdLabel: 'Maintiens pour parler',
    transmitting: 'Émission',
    holdToTalk: 'Appuie et parle',
    gauge: { range: 'Portée', carries: 'Transporte', radio: 'Radio' },
  },
  dev: {
    h: 'Développement',
    p: 'C’était ma première vraie plongée dans les microcontrôleurs et mon premier PCB, donc j’ai appris à utiliser chaque composant avec l’aide de YouTube et de ChatGPT.',
    alt: 'Le prototype sur breadboard avec l’ESP32, le module LoRa, le micro et le haut-parleur I2S, deux écrans OLED, un encodeur rotatif et des boutons',
    caption: 'Le prototype sur breadboard avec un ESP32 DevKit, un module LoRa Ebyte E220-900D, un micro et un haut-parleur I2S, deux écrans OLED I2C, un encodeur rotatif et des boutons',
  },
  code: {
    h: 'Code',
    p: 'J’ai écrit le firmware de l’ESP32 dans PlatformIO, que mes recherches désignaient comme le meilleur choix pour l’ESP32. Le code source est sur GitHub, et le projet PlatformIO complet est ci-dessous.',
    alt: 'Le firmware ouvert dans PlatformIO',
    project: { title: 'Projet PlatformIO', text: 'Voici le projet firmware complet, prêt à ouvrir dans PlatformIO.', button: 'Télécharger le projet' },
    repo: { title: 'Le code sur GitHub', text: 'Le code source du firmware est sur GitHub.', button: 'Voir le code sur GitHub' },
  },
  pcb: {
    h: 'PCB',
    p: 'J’ai conçu la carte dans KiCAD pour qu’elle porte tous les composants.',
    schematicAlt: 'Le schéma KiCAD',
    schematicCaption: 'Schéma',
    layoutAlt: 'Le routage de la carte dans KiCAD',
    layoutCaption: 'Routage de la carte',
    finishedAlt: 'Le PCB terminé',
    files: { title: 'Fichiers KiCAD', text: 'Voici le projet KiCAD complet de la carte.', button: 'Télécharger les fichiers KiCAD' },
  },
  case: {
    h: 'Boîtier',
    p: 'J’ai modélisé le boîtier dans Onshape et je l’ai imprimé en 3D, et le modèle en direct est en lien ci-dessous.',
    figs: [
      { alt: 'Le modèle du boîtier dans Onshape', caption: 'Le boîtier dans Onshape' },
      { alt: 'Les versions imprimées du boîtier côte à côte', caption: 'Les versions imprimées du boîtier' },
      { alt: 'Les clips du boîtier avant et après renforcement', caption: 'Les clips du boîtier avant et après que je les ai renforcés' },
    ],
    model: { title: 'Modèle Onshape', text: 'Voici le modèle 3D en direct du boîtier.', button: 'Ouvrir le modèle 3D dans Onshape' },
  },
  assembly: {
    h: 'Assemblage',
    figs: [
      { alt: 'Tous les composants soudés sur le PCB', caption: 'Tous les composants soudés sur le PCB et qui marchent' },
      { alt: 'Mise en place du PCB dans le boîtier', caption: 'Mise en place du PCB dans le boîtier' },
      { alt: 'Le LoRA Messenger terminé', caption: 'Le LoRA Messenger terminé' },
    ],
  },
};

export default fr;
