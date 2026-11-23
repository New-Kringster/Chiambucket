import type { RecsCopy } from './en';

/* The recommendation cards in French: a copy of en.ts with the words translated. */
const fr: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'Un lecteur de compteur d’eau sur batterie, où un pipeline DrumNet de 693K paramètres sur un ESP32-S3 lit les rouleaux et transmet par LoRaWAN, monté sur un PCB maison conçu dans KiCad, dans un boîtier imprimé en 3D.',
    alt: 'OCR Reader avec DrumNet, une solution d’OCR pour compteur d’eau',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'Un rover 5G avec trois flux caméra en direct, un GPS, un pointeur laser et sept capteurs, piloté depuis une console web.',
    alt: 'Le rover de Project June',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'Un animal de bureau sur un M5Stack Tab5 dont le cerveau est le DeepSeek Harness sur mon serveur, alors il peut piloter un navigateur, créer ses propres applis et garder un œil sur mes autres agents.',
    alt: 'Pip, un animal de bureau cyan, sur le M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'Un LiDAR bricolé : quatre capteurs de distance sur la tête de Stack-chan, que ses servos font balayer une pièce, pendant que sa caméra colore un scan 3D que tu peux explorer dans le navigateur.',
    alt: 'Stack-chan avec quatre capteurs de distance Unit ToF4M sur la tête',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'Une liseuse en ligne privée, sur invitation, avec la présence en direct, la reprise de lecture pour chaque lecteur, un filtre de contenu imposé en SQL, des webtoons et des stats de lecture partagées, faite avec Next.js et Supabase.',
    alt: 'BeadReader, une liseuse privée',
  },
  'proj-pantry': {
    title: 'Pantry Expiry Tracker',
    blurb: 'Un suivi des dates de péremption pour la porte du frigo, sur un M5Stack CoreS3 SE et un module QRCode : tu scannes un code-barres, tu choisis la date et tu vois quoi manger en premier, avec des rappels dans Home Assistant.',
    alt: 'Le Pantry Expiry Tracker, un CoreS3 SE posé sur le module QRCode',
  },
  'proj-ruler': {
    title: 'Scroll Ruler',
    blurb: 'Une règle numérique faite d’un M5Stack AtomS3R et d’une Unit Scroll : appuie sur la molette, fais-la rouler le long d’un objet et l’écran affiche sa longueur, après un étalonnage sur 10 cm.',
    alt: 'La Scroll Ruler, un AtomS3R avec une Unit Scroll branchée',
  },
  'proj-cadmouse': {
    title: '3D CAD Mouse',
    blurb: 'Un M5Stack Capsule en souris 3D sans fil pour Onshape : clique sur son bouton, tourne-le dans ta main et le modèle à l’écran tourne avec.',
    alt: 'Le M5Stack Capsule v1.1 qui sert de souris 3D',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Deux appareils portables ESP32 qui envoient du texte par LoRa et une voix bidirectionnelle sommaire par ESP-NOW, sur mon premier PCB, conçu dans KiCAD, avec un boîtier modélisé dans Onshape.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'Un assistant vocal pour pièce connectée sur un ESP32, où Whisper et un LLM DeepSeek via OpenRouter transforment la parole en une seule commande JSON envoyée par MQTT.',
    alt: 'L’assistant vocal LUMEN',
  },
  'proj-ema': {
    title: 'EMA Smart Home',
    blurb: 'Une maison connectée faite en équipe, notée A, où quatre nœuds BeagleBone Black remontent leurs données à un serveur SocketIO avec un tableau de bord 3D Spline en direct.',
    alt: 'Le système EMA Smart Home',
  },
  'proj-pandus': {
    title: 'Pandus Dispenser',
    blurb: 'Mon premier projet d’école, un distributeur de sirop imprimé en 3D en six pièces et piloté par un Arduino Uno et PyFirmata.',
    alt: 'Pandus Dispenser',
  },
  'proj-elecf': {
    title: 'ELEC-F Concept',
    blurb: 'Une alarme de chambre froide sur M5Stack. Si quelqu’un est à l’intérieur quand la porte se ferme, un minuteur démarre et l’alarme sonne quand il arrive à zéro.',
    alt: 'ELEC-F Concept',
  },
  'proj-kauli': {
    title: 'Kauli Concept',
    blurb: 'Un concept de produit que j’ai présenté pour un module de communication, avec des rendus dans Blender.',
    alt: 'Kauli Concept',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'Une coque de souris gaming ultralégère inspirée de la ZeroMouse, que je cherche à faire descendre vers 20 g.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: 'Une recréation dans KiCAD de la carte de dev de mon école, faite parce que je ne pouvais pas ramener l’originale chez moi.',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Web Development Prj',
    blurb: 'Mon premier site entièrement fonctionnel, fait en HTML et CSS comme devoir final de mon cours de développement web.',
    alt: 'Projet de développement web',
  },
  'proj-mc': {
    title: 'Minecraft Live Map',
    blurb: 'Un serveur Paper dans Docker sur mon homelab, avec une Dynmap du monde en direct.',
    alt: 'Minecraft Live Map',
  },
};
export default fr;
