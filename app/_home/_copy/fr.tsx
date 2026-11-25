import type { HomeCopy } from './en';

/* The homepage in French. Same shape as en.tsx. */
const fr: HomeCopy = {
  meta: {
    title: 'Braven Chiam | Matériel, logiciel et design',
    description: 'Chiambucket est le portfolio de Braven Chiam, étudiant ingénieur à Singapour qui construit de la carte électronique au cloud, comme un rover 5G et un lecteur de compteur d’eau.',
    keywords: 'Braven Chiam, Chiambucket, OCR Reader, DrumNet, Project June, rover 5G, BeadReader, Shebang, M5Stack, LoRA Messenger, ESP32, conception de PCB, KiCad, Onshape, Next.js, homelab, photographie, Singapour',
    ogDescription: 'Je construis des choses de la carte électronique jusqu’au cloud, dont un lecteur de compteur d’eau qui lit directement sur la puce, un rover 5G et un lecteur de livres privé.',
    twitterTitle: 'Braven Chiam',
    twitterDescription: 'Parmi mes projets, un lecteur de compteur d’eau qui lit directement sur la puce, un rover 5G et un lecteur de livres privé.',
  },
  ld: {
    jobTitle: 'Étudiant en génie électronique et informatique',
    knowsAbout: [
      'Génie électronique', 'Conception de PCB', 'Systèmes embarqués', 'ESP32',
      'Microcontrôleurs', 'CAO 3D', 'Design d’interface', 'Photographie', 'Auto-hébergement',
    ],
    juneHeadline: 'Project June, un rover 5G',
    juneAbout: 'Un rover 5G avec trois flux caméra WebRTC en direct, de la télémétrie MQTT, une suite de capteurs ESP32-S3, un driver moteur à MOSFET et une batterie 2S3P, construit en trois semaines.',
    juneKeywords: 'rover 5G, WebRTC, ESP32, MQTT, PCB sur mesure, KiCAD, Onshape, télémétrie',
    beadAbout: 'Un lecteur de livres en ligne privé, sur invitation uniquement, avec une connexion par code d’accès, une présence en direct pour lire ensemble, un filtre de contenu explicite appliqué en SQL, des livres en texte et en webtoon, des statistiques de lecture et un mode hors ligne. Construit avec Next.js, Supabase et Cloudflare R2.',
    beadKeywords: 'lecteur de livres privé, sur invitation, Next.js, Supabase, Cloudflare R2, lire ensemble, PWA hors ligne',
  },

  /* ── Start ── */
  hero: {
    kicker: 'Salut.',
    line: 'Moi, c’est Braven. La plupart des projets demandent du matériel, du logiciel et du design, et j’aime faire les trois moi-même.',
    artAlt: 'Un matin peint : un pin parasol sur une colline herbeuse sous un ciel vert sauge, le soleil bas sur la droite',
    name: ['Braven', 'Chiam'],
    scroll: 'Défiler',
    annivTitle: 'Chiambucket a deux ans',
    annivLine: 'Enfin archivé ! Toutes les versions de 2024 à 2026',
    annivGo: 'Voir les versions',
  },

  /* ── Hello ── */
  hello: {
    said: 'Je suis en troisième année de génie électronique et informatique à Nanyang Polytechnic. J’ai commencé en démontant une radio cassée pour voir comment elle marchait, et maintenant je conçois des cartes électroniques, j’écris du firmware, je crée des applis web et je fais tourner le homelab qui les héberge.',
    layersTitle: 'De la puce au cloud',
    layers: [
      { name: 'Firmware', line: 'J’écris du C et du C++ pour les cartes ESP32, Arduino et M5Stack, ou du MicroPython quand ça s’y prête.' },
      { name: 'Matériel', line: 'Je dessine les schémas et les cartes dans KiCad et je les soude chez moi, composants CMS compris.' },
      { name: 'Logiciel', line: 'Je crée des applis web en Next.js et TypeScript et je fais tourner de petits serveurs Python dans Docker.' },
      { name: 'Infrastructure', line: 'Mes projets tournent sur mon propre homelab, monté sur Unraid, Proxmox et Docker.' },
      { name: 'Design', line: 'Je modélise les boîtiers dans Onshape, je fais les rendus dans Blender, je conçois les interfaces dans Figma et je monte les films dans DaVinci Resolve.' },
    ],
    complete: 'Complet',
  },

  /* ── The flagship chapters and their cards ── */
  flagships: {
    'proj-waterslop': {
      badge: 'Projet phare',
      sub: 'Une caméra sur batterie qui lit un compteur d’eau, entièrement sur la puce.',
      beats: [
        { title: 'PCB conçu dans KiCad et fabriqué par JLCPCB', text: 'La carte à quatre couches est construite autour d’un ESP32-S3 et d’une caméra OV2640, et elle embarque LoRa, la charge de la batterie et des LED.' },
        { title: 'Un boîtier sans vis', text: 'Je l’ai modélisé dans Onshape, il se ferme avec des clips latéraux et tient la carte sur des plots, sans outils.' },
        { title: 'DrumNET NN, tourne sur l’appareil', text: 'Un réseau de 693K paramètres trouve les tambours, lit chaque chiffre trois fois et vote, le tout sur l’ESP32-S3 en environ deux secondes.' },
      ],
      kind: 'Projet perso',
      lead: 'J’ai construit ce lecteur de compteur d’eau de bout en bout, de la carte et du boîtier sans vis jusqu’à DrumNet, un réseau de neurones qui lit les tambours sur la puce, si bien que seul le nombre part en LoRaWAN.',
      stats: [{ v: '693K', l: 'paramètres' }, { v: '~2 s', l: 'par lecture' }, { v: '4 couches', l: 'PCB sur mesure' }, { v: 'LoRaWAN', l: 'liaison basse conso' }],
      posterAlt: 'L’affiche de l’OCR Reader : DrumNet, une solution OCR de compteur d’eau entièrement intégrée verticalement, et la carte',
      extra: 'Voir le rapport',
    },
    'proj-june': {
      badge: 'Projet matériel à la une',
      sub: 'Un rover 5G que je peux piloter partout où il y a du réseau.',
      beats: [
        { title: 'Trois flux en direct, trois téléphones', text: 'Le téléphone 1 est le hotspot 5G principal et la caméra avant, le téléphone 2 est le second hotspot et la caméra gauche, et le téléphone 3 est la caméra droite. Chacun envoie son image à ma console en WebRTC.' },
        { title: 'La télémétrie de la sortie de nuit', text: 'L’ESP32-S3 se connecte au hotspot du téléphone et renvoie son GPS, sa température, son humidité et sa luminosité en MQTT, environ dix fois par seconde.' },
        { title: 'De la manette à la route', text: 'Je le pilote avec une manette Xbox depuis ma console web. Les commandes passent en MQTT par mon serveur et la vidéo revient par mon serveur TURN, avec environ une seconde de latence à plus de 8 km.' },
      ],
      kind: 'Projet perso',
      lead: 'Un rover 5G dont les trois téléphones envoient l’image à mon tableau de bord pendant que ses capteurs décrivent ce qui l’entoure. Il a fallu trois semaines entre la première idée et le premier trajet.',
      stats: [{ v: '3', l: 'flux vidéo en direct' }, { v: '5G', l: 'liaison cellulaire' }, { v: '8+', l: 'capteurs embarqués' }, { v: '3 semaines', l: 'de l’idée à la route' }],
      posterAlt: 'Project June : le rover qui soulève la poussière à côté de sa console de pilotage et d’une manette Xbox',
      extra: 'Voir la vidéo',
    },
    'proj-pip': {
      badge: 'Projet logiciel à la une',
      sub: 'Un compagnon de bureau avec un agent IA pour cerveau, construit pendant mon stage chez M5Stack.',
      beats: [
        { title: 'Il te montre les choses', text: 'Demande à Pip de te montrer quelque chose, et il fait une capture de la page, trouve l’élément sur l’image et dessine par-dessus un cercle, une flèche et une note.' },
        { title: 'Il crée ses propres applis', text: 'Pip écrit des applis quand je le lui demande et les range dans un tiroir, soit des scripts Lua qui tournent sur la tablette, soit des applis web servies depuis mon serveur.' },
        { title: 'Un bureau par conversation', text: 'Tirer vers le bas la pilule en haut ouvre la barre spotlight, et chaque conversation a son propre bureau, avec son propre Pip et sa couleur.' },
      ],
      kind: 'Projet de stage, M5Stack',
      lead: 'Un compagnon de bureau sur une M5Stack Tab5 dont le cerveau est le DeepSeek Harness sur mon serveur, ce qui lui permet de piloter un navigateur, de créer ses propres applis et de garder un œil sur mes autres agents.',
      stats: [{ v: '106 s', l: 'pour créer une appli minuteur' }, { v: 'Lua', l: 'applets natifs' }, { v: 'Docker', l: 'applets web' }, { v: '1 bureau', l: 'par conversation' }],
      posterAlt: 'Pip, un compagnon de bureau cyan avec une ampoule, sur la M5Stack Tab5',
    },
    'proj-lidar': {
      badge: 'Projet vedette',
      sub: 'Un LiDAR de fortune sur le petit robot de M5Stack, construit pendant mon stage.',
      beats: [
        { title: 'Il balaie la pièce', text: 'Stack-chan tourne la tête à travers la pièce par petits pas et prend une mesure de distance à chaque pas. Voici le vrai scan, qui se remplit à mesure que la tête pivote.' },
        { title: 'Quick, Normal ou Fine', text: 'Avant un scan, je choisis Quick, Normal ou Fine. Quick se termine en moins d’une minute, et Fine prend plus de temps mais capte bien plus de détails.' },
        { title: 'Coloré par sa propre caméra', text: 'Les photos de la caméra de la CoreS3 colorent les mesures, ce qui donne 68 206 points colorés que n’importe quel navigateur sur le Wi-Fi peut afficher en 3D.' },
      ],
      kind: 'Projet de stage, M5Stack',
      lead: 'Un LiDAR de fortune : quatre capteurs de distance sur la tête de Stack-chan, balayés à travers une pièce par ses deux servos, avec sa caméra qui colore les points et un navigateur qui affiche le scan en 3D.',
      stats: [{ v: '68 206', l: 'points en un scan' }, { v: '256°', l: 'balayage maximal' }, { v: '4', l: 'capteurs ToF' }, { v: '54 s', l: 'pour un scan Quick' }],
      posterAlt: 'Stack-chan avec quatre capteurs de distance Unit ToF4M sur la tête',
    },
    'proj-beadreader': {
      badge: 'Projet à la une',
      sub: 'Un lecteur de livres privé pour quelques amis.',
      beats: [
        { title: 'Il retient ta page', text: 'La liste des lecteurs montre où en est chacun, et toucher ta propre ligne rouvre le même chapitre à la ligne où tu t’étais arrêté.' },
        { title: 'Lire ensemble', text: 'Les amis sur le même livre affichent un anneau vert et leur chapitre. Tu peux toucher pour leur envoyer un coucou ou un petit mot, qui disparaît de leur écran en quelques secondes et n’est jamais enregistré.' },
      ],
      kind: 'Projet perso',
      lead: 'Un lecteur de livres où je publie des livres en Markdown ou en webtoon, où mes amis se connectent avec un seul code d’accès, et où chacun voit en direct les autres lecteurs du même livre.',
      stats: [{ v: 'Direct', l: 'présence des lecteurs' }, { v: 'SQL', l: 'filtre de contenu' }, { v: 'Hors ligne', l: 'marche sans connexion' }, { v: '1 clic', l: 'pour déployer le tien' }],
      posterAlt: 'BeadReader sur trois téléphones : l’écran de connexion, un chapitre et la bibliothèque',
      extra: 'GitHub',
    },
  },
  card: {
    label: '{name}, {badge}',
    tools: 'Outils',
    read: 'Lire l’article',
    peek: 'Aperçu',
  },
  peek: {
    label: 'Résumé du projet',
    close: 'Fermer le résumé',
  },

  /* ── The set pieces ── */
  june: {
    feeds: {
      left: { label: 'Gauche', phone: 'Tél. 2' },
      center: { label: 'Avant', phone: 'Tél. 1' },
      right: { label: 'Droite', phone: 'Tél. 3' },
    },
    live: 'Direct',
    tele: ['Latitude', 'Longitude', 'Satellites', 'Température', 'Humidité', 'Vitesse'],
    place: 'Lieu',
    placeName: 'Sembawang Park',
    link: [
      { label: 'Manette Xbox', sub: 'Bluetooth vers la console' },
      { label: 'Mon serveur', sub: 'MQTT, signalisation, TURN' },
      { label: 'Trois téléphones', sub: 'Hotspot 5G et caméras' },
      { label: 'ESP32-S3', sub: 'Moteurs et capteurs' },
    ],
  },
  pip: {
    shots: [
      'Pip qui entoure les mitochondries sur un schéma de cellule, sur la Tab5',
      'Le tiroir d’applis de la Tab5 avec l’appli NCIR Thermometer',
      'La barre spotlight sur la Tab5, qui passe d’un bureau à l’autre',
    ],
  },
  lidar: {
    cloudAlt: 'Le scan terminé aux couleurs de la caméra : les murs et le plafond d’un coin de pièce',
  },
  bead: {
    mara: 'Mara',
    jae: 'Jae',
    sam: 'Sam',
    here: 'Tu étais ici',
    readingNow: 'en lecture',
    pct: '{n} %',
    rowSub: 'Chapitre {ch} sur {of} · {time} de lecture',
    readTime: '{h} h {m}',
    maraPhone: 'Le téléphone de Mara',
    maraScreen: 'L’écran de Mara',
    waved: 'Braven t’a fait coucou',
    noteFrom: 'Braven',
    note: 'quel retournement !',
    onlineNow: 'En ligne',
    readingHere: 'Lit ici · ch. {ch}',
    elsewhere: '{book} · ch. {ch}',
    otherBook: 'Le Hobbit',
    browsing: 'Navigue',
  },

  /* ── Projects ── */
  gallery: {
    title: 'Tous les projets',
    sub: 'Tout ce que j’ai construit, à l’école, de mon côté et en stage.',
    filters: 'Afficher les projets',
    all: 'Tous',
    types: { personal: 'Perso', school: 'École', internship: 'Stage' },
    atM5: 'chez M5Stack',
    flagship: 'Phare',
    highlight: 'À la une',
    peek: 'Voir un résumé de {title}',
    read: 'Lire',
    soon: 'Article bientôt',
  },
  projects: {
    'proj-waterslop': { title: 'OCR Reader', blurb: 'Une caméra sur batterie qui lit un compteur d’eau, où un réseau de neurones sur un ESP32-S3 lit les tambours et seul le nombre part en LoRaWAN.' },
    'proj-june': { title: 'Project June', blurb: 'Un rover 5G dont les trois téléphones envoient l’image à ma console, et que je pilote avec une manette Xbox partout où il y a du réseau.' },
    'proj-pip': { title: 'Pip', blurb: 'Un compagnon de bureau sur une M5Stack Tab5 avec un harness d’agent IA pour cerveau, qui peut piloter un navigateur et créer ses propres applis.' },
    'proj-lidar': { title: 'Stack-chan LiDAR', blurb: 'Quatre capteurs de distance sur la tête de Stack-chan, balayés à travers une pièce par ses servos et colorés par sa caméra pour former un scan 3D.' },
    'proj-beadreader': { title: 'BeadReader', blurb: 'Un lecteur de livres privé pour quelques amis, qui se connectent avec un seul code d’accès et se voient lire en direct.' },
    'proj-pantry': { title: 'Pantry Expiry Tracker', blurb: 'Un suivi des dates de péremption pour la porte du frigo, où tu scannes un code-barres, tu choisis la date et l’écran montre quoi manger en premier.' },
    'proj-ruler': { title: 'Scroll Ruler', blurb: 'Une règle numérique faite d’un AtomS3R et d’un Unit Scroll, qui mesure tout ce le long de quoi tu fais rouler sa molette.' },
    'proj-cadmouse': { title: '3D CAD Mouse', blurb: 'Une M5Stack Capsule qui sert de souris 3D sans fil pour Onshape, si bien que le modèle tourne quand tu la tournes dans ta main.' },
    'proj-lora': { title: 'LoRA Messenger', blurb: 'Deux appareils portables ESP32 qui envoient du texte en LoRa et une voix bidirectionnelle un peu brute en ESP-NOW, sur mon premier PCB.' },
    'proj-lumen': { title: 'LUMEN', blurb: 'Une pièce pilotée à la voix sur un ESP32, où Whisper et DeepSeek transforment la parole en une seule commande JSON envoyée en MQTT.' },
    'proj-ema': { title: 'EMA Smart Home', blurb: 'Une maison connectée faite en équipe, notée A, où quatre nœuds BeagleBone Black remontent leurs données à un serveur SocketIO avec un tableau de bord 3D en direct.' },
    'proj-pandus': { title: 'Pandus Dispenser', blurb: 'Mon premier projet d’école, un distributeur de sirop imprimé en 3D en six pièces et piloté par un Arduino Uno.' },
    'proj-elecf': { title: 'ELEC-F Concept', blurb: 'Une alarme de chambre froide sur M5Stack qui lance un compte à rebours quand quelqu’un est enfermé dedans.' },
    'proj-kauli': { title: 'Kauli Concept', blurb: 'Un concept de produit que j’ai présenté pour un module de communication, avec des rendus dans Blender.' },
    'proj-sol': { title: 'Series One Light', blurb: 'Une coque de souris gaming ultralégère inspirée de la ZeroMouse, que je cherche à faire descendre vers 20 g.' },
    'proj-copyboard': { title: 'Copy Board', blurb: 'Une recréation dans KiCad de la carte de dev de mon école, faite parce que je ne pouvais pas ramener l’originale chez moi.' },
    'proj-mc': { title: 'Minecraft Live Map', blurb: 'Un serveur Paper dans Docker sur mon homelab, avec une Dynmap du monde en direct.' },
    'proj-webdev': { title: 'Web Development Prj', blurb: 'Mon premier site qui marche, en HTML et CSS, pour mon cours de développement web.' },
  },

  /* ── On the bench ── */
  bench: {
    title: 'Sur l’établi',
    sub: 'Ce que je construis depuis le dernier article.',
    items: {
      shebang: {
        name: 'Shebang',
        status: 'Mon hébergement',
        what: 'Ça me donne un seul compte pour la connexion, les pages statiques, l’hébergement de fichiers, les liens courts et une base Postgres par projet, accessibles via une seule API REST ou un seul serveur MCP, pour que mes agents de code puissent publier à ma place. Le client MCP est open source et disponible sur npm.',
        stack: ['Next.js 16', 'Supabase auto-hébergé', 'Postgres', 'MCP', 'Docker'],
        link: 'shebang-mcp sur GitHub',
      },
      pip: {
        name: 'Pip',
        status: 'En cours',
        what: 'Un compagnon de bureau sur une M5Stack Tab5 qui parle à un agent IA qui tourne chez moi. Il passe d’un bureau à l’autre, lance de petits applets qu’il peut créer sur demande et se sert de sa caméra.',
        stack: ['ESP32-P4', 'M5Stack Tab5', 'PlatformIO', 'Lua', 'Python'],
      },
      ncir: {
        name: 'Démos thermomètre NCIR',
        status: 'Firmware',
        what: 'Elles affichent la température infrarouge en direct sur les écrans M5Stack pour les capteurs NCIR et NCIR 2. Le firmware du NCIR 2 parle directement à la carte des registres I2C du capteur, sans bibliothèque du fabricant, et une seule base de code tourne sur la CoreS3 et sur la Basic classique.',
        stack: ['M5Stack CoreS3', 'C++', 'I2C', 'PlatformIO'],
      },
      flashdeck: {
        name: 'Flashdeck',
        status: 'Outils',
        what: 'Une étagère pour mes firmwares avec un flasheur dans le navigateur, si bien que quand je branche un ESP32, ESP Web Tools choisit l’image compilée pour cette puce. Le serveur est en Python pur, sans dépendances.',
        stack: ['Python', 'Web Serial', 'ESP Web Tools'],
      },
    },
  },

  /* ── My skills ── */
  skills: {
    title: 'Mes compétences',
    open: '{word} : {line}. Voir les détails',
    tiles: {
      hw: {
        word: 'Matériel', line: 'Des cartes que je route et soude', title: 'Cartes électroniques',
        blurb: 'Je dessine le schéma et je route la carte dans KiCad, puis je soude les composants moi-même, y compris des CMS en refusion à la maison.',
        points: ['La carte à quatre couches de l’OCR Reader, fabriquée par JLCPCB', 'La carte du LoRA Messenger, mon premier PCB', 'Une recréation de zéro de la carte de dev ATmega328 de mon école'],
        chips: ['KiCad', 'EAGLE', 'Refusion CMS', 'Saisie de schéma'],
        links: ['OCR Reader', 'LoRA Messenger'],
      },
      fw: {
        word: 'Firmware', line: 'C, C++ et MicroPython', title: 'Mes microcontrôleurs',
        blurb: 'La plupart de mes projets tournent sur un microcontrôleur, et j’écris le firmware en C et C++ avec PlatformIO, ou en MicroPython quand ça s’y prête.',
        points: ['L’ESP32, mon choix par défaut pour tout ce qui est sans fil', 'Les cartes M5Stack quand il me faut vite un écran et des boutons', 'L’Arduino Uno et l’ATmega328 pour les projets plus simples', 'La BeagleBone Black comme cerveau Linux d’un système plus gros'],
        chips: ['ESP32', 'M5Stack', 'Arduino', 'BeagleBone', 'PlatformIO', 'C / C++', 'MicroPython'],
        links: ['Project June', 'LUMEN'],
      },
      sw: {
        word: 'Logiciel', line: 'Applis web et petits serveurs', title: 'Applis web et serveurs',
        blurb: 'Je crée des applis web en Next.js et TypeScript et j’écris de petits serveurs Python qui tournent dans Docker.',
        points: ['BeadReader, sur Next.js, Supabase Postgres et Cloudflare R2', 'LUMEN, un serveur FastAPI qui transforme la parole en commandes pour la pièce', 'Shebang, ma propre plateforme d’hébergement', 'Ce site, en Next.js sur Vercel'],
        chips: ['Next.js', 'TypeScript', 'Supabase', 'Postgres', 'Python', 'FastAPI', 'Docker'],
        links: ['BeadReader', 'LUMEN'],
      },
      cad: {
        word: '3D et CAO', line: 'Des boîtiers justes du premier coup', title: 'Des boîtiers qui s’ajustent',
        blurb: 'Je modélise boîtiers et pièces dans Onshape, je fais les rendus dans Blender, et j’imprime en 3D jusqu’à ce que tout s’ajuste.',
        points: ['Le boîtier sans outils de l’OCR Reader', 'Le boîtier portable du LoRA Messenger', 'Le corps en six pièces du distributeur Pandus, bon dès la première impression'],
        chips: ['Onshape', 'Blender', 'Impression 3D'],
      },
      infra: {
        word: 'Infrastructure', line: 'Trois serveurs à la maison', title: 'Mon propre homelab',
        blurb: 'Je fais tourner un homelab auto-hébergé sur Unraid, Proxmox et Docker, derrière Nginx et un réseau UniFi segmenté.',
        points: ['Des services auto-hébergés derrière Nginx Proxy Manager et CrowdSec', 'Un maillage WireGuard et Tailscale pour joindre la maison de partout', 'Des serveurs coturn et MQTT dont dépendent mes projets matériels'],
        chips: ['Unraid', 'Proxmox', 'Docker', 'Nginx', 'Tailscale', 'WireGuard', 'UniFi'],
        link: 'Explorer le HomeLab',
      },
      radio: {
        word: 'Sans fil', line: 'LoRa, ESP-NOW, MQTT et 5G', title: 'Radios et liens en direct',
        blurb: 'J’utilise LoRa pour la portée, ESP-NOW pour les liaisons locales rapides, MQTT pour la télémétrie et WebRTC pour la vidéo en direct sur réseau cellulaire.',
        points: ['Trois flux caméra WebRTC en direct en 5G sur Project June', 'Du texte longue portée en LoRa et de la voix bidirectionnelle en ESP-NOW', 'Des envois LoRaWAN depuis l’OCR Reader'],
        chips: ['LoRa', 'LoRaWAN', 'ESP-NOW', 'MQTT', 'WebRTC', '5G'],
      },
      video: {
        word: 'Vidéo', line: 'Un film par projet', title: 'Un film par projet',
        blurb: 'Je monte et étalonne un court film pour mes projets dans DaVinci Resolve.',
        chips: ['DaVinci Resolve', 'Premiere Pro'],
        links: ['Voir le film de Project June'],
      },
      ui: {
        word: 'Design', line: 'Interfaces et affiches', title: 'Interfaces et affiches',
        blurb: 'Je conçois des interfaces dans Figma et Spline et je fais des affiches dans Photoshop.',
        points: ['La console de pilotage de Project June et le tableau de bord de la maison connectée EMA', 'L’affiche du projet ELEC-F'],
        chips: ['Figma', 'Spline', 'Photoshop'],
        links: ['L’interface EMA'],
      },
      photo: {
        word: 'Photo', line: 'Surtout en voyage', title: 'Photos',
        blurb: 'La photo m’aide à explorer davantage ma créativité, et la plupart de mes photos viennent de voyages en Nouvelle-Zélande, en Chine et en Europe.',
        link: 'Voir tous les albums',
      },
    },
  },

  /* ── HomeLab ── */
  lab: {
    tag: 'Infrastructure',
    title: 'HomeLab',
    sub: 'Trois serveurs à la maison sur lesquels tournent mes projets.',
    lead: 'Ils gardent ma photothèque et mes fichiers et font tourner les serveurs MQTT et TURN qu’utilisent Project June et LUMEN, et les crédits de revente solaire paient leur électricité. Ce site, lui, est hébergé sur Vercel.',
    facts: [{ v: '3', l: 'serveurs' }, { v: '24 To', l: 'de stockage utile' }, { v: '38', l: 'applis auto-hébergées' }],
    cta: 'Explorer le HomeLab',
  },

  /* ── Photos ── */
  photos: {
    title: 'Photographie',
    sub: 'Des photos de Nouvelle-Zélande, de Chine et d’Europe.',
    alt: 'Une photo de l’album {album}',
    albums: { nz: 'Nouvelle-Zélande', china: 'Chine', europe: 'Europe', highlights: 'Sélection' },
    more: 'Voir tous les albums',
  },

  /* ── Contact ── */
  contact: {
    title: 'Dis bonjour.',
    email: 'Écris-moi',
    all: 'Tous les moyens de me joindre',
  },
};

export default fr;
