import type { CadMouseCopy } from './en';

/* The 3D CAD Mouse article in French. Same shape as en.tsx. */
const fr: CadMouseCopy = {
  meta: {
    title: '3D CAD Mouse | Braven Chiam',
    description: 'Une souris 3D sans fil pour Onshape, faite à partir d’une M5Stack Capsule. Tu cliques sur son bouton et tu la tournes dans ta main, et le modèle à l’écran tourne avec elle, parce que la Capsule se fait passer pour une SpaceMouse de 3Dconnexion en Bluetooth.',
    ogDescription: 'Tourne une M5Stack Capsule dans ta main et le modèle dans Onshape tourne avec elle.',
  },
  ld: {
    headline: '3D CAD Mouse',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', 'souris 3D', 'Onshape'],
  },
  hero: {
    alt: 'La M5Stack Capsule v1.1 debout, son étiquette de broches colorée tournée vers l’avant et le port USB-C en bas',
    back: 'Retour aux projets',
    tag: 'Projet de stage',
    title: <>3D CAD <em>Mouse</em></>,
    lead: 'J’ai transformé une M5Stack Capsule en souris 3D sans fil pour Onshape. Tu cliques sur son bouton et tu la tournes dans ta main, et le modèle à l’écran tourne avec elle, comme si tu tenais la pièce elle-même.',
    builtWith: 'Fait avec',
    burnerTitle: 'Le firmware n’est pas encore sur M5Burner',
    burner: 'Installer via M5Burner',
    burnerSoon: 'Bientôt',
    meta: 'Projet de stage chez M5Stack, novembre 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.',
  },
  chapters: 'Chapitres',
  rail: {
    demo: 'Démo', try: 'Essaie-la', use: 'Mode d’emploi', how: 'Comment ça marche',
    spacemouse: 'Passer pour une SpaceMouse', turning: 'Suivre ta main', stopping: 'S’arrêter net',
    hardware: 'Matériel', setup: 'En monter une',
  },
  demo: {
    h: 'Démo',
    p: 'J’ai filmé ça à mon bureau avec un de mes boîtiers ouvert dans Onshape. Avec la rotation activée, la pièce tourne et bascule quand je tourne la Capsule, et en maintenant le bouton je peux faire glisser la pièce sur l’écran et zoomer sur ses boutons.',
    video: 'Je fais tourner un boîtier orange dans Onshape en tournant la Capsule dans ma main, puis je fais un panoramique et je zoome sur ses boutons',
    moments: [
      { label: 'Tourner la pièce', note: 'La rotation est activée, donc la pièce tourne et bascule avec ma main' },
      { label: 'La retourner', note: 'Basculer complètement la Capsule montre le dessous' },
      { label: 'La faire glisser', note: 'Maintenir le bouton déplace la pièce sur le côté, puis la ramène' },
      { label: 'Zoomer', note: 'Une torsion pendant que je maintiens zoome sur les boutons, puis dézoome' },
    ],
  },
  try: {
    h: 'Essaie-la',
    p: 'C’est le boîtier de la démo, celui que j’ai dessiné pour mon LoRA Messenger, et c’est le même modèle que j’avais ouvert dans Onshape. Fais-le glisser et il tourne comme quand je tourne la Capsule, pendant que la Capsule à côté montre ce que feraient ma main et son bouton.',
    note: 'La vraie Capsule mesure à quelle vitesse ta main tourne, donc la pièce tourne du même angle que ta main. Ici, c’est ton glissement qui la remplace.',
  },
  /** the simulator's words (CadSim) */
  sim: {
    /** the Capsule's light, by state */
    led: {
      ready: 'Vert clignotant : connectée, rotation coupée',
      rotate: 'Cyan : rotation active',
      pan: 'Ambre : bouton maintenu',
      fit: 'Flash blanc : recadrage',
    },
    viewport: 'Le boîtier du LoRA Messenger dans une vue de CAO. Fais glisser pour le tourner, fais glisser avec Maj pour le déplacer, fais défiler pour zoomer et double-clique pour le recadrer. Les flèches le tournent, Maj avec les flèches le déplace, plus et moins zooment, et 0 le recadre.',
    loading: 'Chargement du boîtier',
    failed: 'La vue 3D n’a pas pu démarrer dans ce navigateur.',
    hint: 'Fais glisser pour tourner le boîtier',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    fit: 'Recadrer',
    /** the key under the view: its two column heads, then each control with a mouse, with a touch screen, and as the Capsule's gesture */
    heads: { here: 'Dans cette vue', capsule: 'Avec la Capsule' },
    moves: {
      rotate: { mouse: 'Glisser', touch: 'Glisser avec un doigt', capsule: 'Cliquer sur le bouton, puis tourner la main' },
      pan: { mouse: 'Glisser avec le clic droit ou avec Maj', touch: 'Glisser avec deux doigts', capsule: 'Maintenir le bouton et pointer la Capsule' },
      zoom: { mouse: 'Faire défiler', touch: 'Pincer', capsule: 'Maintenir le bouton et tordre la Capsule' },
      fit: { mouse: 'Double-clic', touch: 'Toucher deux fois', capsule: 'Double-cliquer sur le bouton' },
    },
  },
  use: {
    h: 'Mode d’emploi',
    p1: 'Tu tiens la Capsule debout, l’étiquette tournée vers toi et le port USB en bas, et son unique bouton fait tout.',
    parts: [
      { b: 'Clic pour tourner', s: 'Un clic active la rotation, et la lumière passe au cyan. À partir de là, le modèle suit ta main jusqu’à ce que tu cliques à nouveau. La rotation démarre 0,3 seconde après le clic, le temps qu’elle attend pour écarter un double-clic.' },
      { b: 'Maintenir pour panoramique et zoom', s: 'Maintenir le bouton met la rotation en pause et fait un panoramique à la place, avec la lumière en ambre. Pointer la Capsule à gauche, à droite, en haut ou en bas fait glisser le modèle dans ce sens, et la tordre zoome. La rotation reprend quand tu relâches.' },
      { b: 'Double-clic pour recadrer', s: 'Un double-clic fait tenir tout le modèle à l’écran, et la rotation reste comme elle était.' },
    ],
    p2: 'La lumière respire en bleu pendant qu’elle attend un ordinateur et clignote en vert toutes les quelques secondes une fois connectée. Un bip aigu veut dire que la rotation est activée et un plus grave qu’elle est désactivée, et la Capsule s’éteint toute seule après un long moment sans servir.',
  },
  how: {
    h: 'Comment ça marche',
    p: 'La Capsule a un gyroscope et un accéléromètre dans son IMU, un bouton et du Bluetooth, soit tout ce dont une souris 3D a besoin. Le plus dur, c’était de faire en sorte qu’Onshape l’écoute.',
  },
  spacemouse: {
    h: 'Passer pour une SpaceMouse',
    p: 'Onshape n’accepte les entrées de souris 3D que via le driver de 3Dconnexion, l’entreprise qui fabrique la SpaceMouse. Alors la Capsule se présente en Bluetooth comme leur SpaceMouse Wireless, avec les identifiants de ce modèle et la même structure pour ses rapports, et le driver fait le reste. Rien à installer dans Onshape. J’ai construit la partie Bluetooth sur le code d’une air mouse que j’avais faite avant, qui marchait déjà sous Windows et macOS.',
  },
  turning: {
    h: 'Suivre ta main',
    p1: 'Une vraie SpaceMouse indique à quel point tu pousses son capuchon, et le driver transforme ça en vitesse. La Capsule envoie plutôt la vitesse à laquelle ta main tourne, mesurée par son gyroscope, donc le driver tourne le modèle du même angle que ta main. On a l’impression de tenir la pièce plutôt que de la piloter.',
    p2: 'L’accéléromètre sert seulement à savoir où est le bas. Ça garde les axes à niveau quelle que soit ta prise sur la Capsule, donc la tourner autour de la verticale fait toujours tourner le modèle autour de la verticale de l’écran. Je ne m’en suis pas servi pour déplacer le modèle, parce qu’une position calculée à partir d’un accéléromètre dérive en moins d’une seconde, et c’est pour ça que le panoramique vient plutôt de la direction où tu pointes la Capsule.',
  },
  stopping: {
    h: 'S’arrêter net',
    p1: 'Appuyer sur le bouton fige la sortie tout de suite, donc la secousse de ton pouce et l’arrêt de ta main n’atteignent jamais le modèle. Tant que ta main bouge, la Capsule envoie un rapport 62,5 fois par seconde, comme la vraie SpaceMouse. Quand ta main s’arrête, elle continue d’envoyer des zéros jusqu’à ce que trois soient passés, parce qu’un dernier rapport perdu laisserait le modèle tourner, et ensuite elle se tait.',
    p2: 'Les calculs de mouvement et les gestes du bouton sont dans une seule bibliothèque sans aucun code matériel, donc 19 tests unitaires les vérifient sur un ordinateur avant chaque flash.',
  },
  hardware: {
    h: 'Matériel',
    parts: [
      { b: 'M5Stack Capsule v1.1', s: 'fait tout à elle seule, sans rien d’ajouté. Son ESP32-S3 fait tourner le firmware et le Bluetooth, son IMU BMI270 lit le gyroscope 200 fois par seconde, et sa LED RGB et son buzzer donnent le retour.' },
      { b: 'Le bouton', s: 'sur le dessus de la Capsule fait les trois gestes.' },
      { b: 'Une batterie de 250 mAh', s: 'à l’intérieur la garde sans fil, et elle s’éteint toute seule quand elle n’a pas bougé depuis un moment.' },
    ],
    holdAlt: 'Je tiens la Capsule devant l’écran pendant que le boîtier dans Onshape tourne avec elle',
    holdCaption: 'Tourner le boîtier de la démo',
  },
  setup: {
    h: 'En monter une',
    steps: [
      <>Installe le driver gratuit de 3Dconnexion, 3DxWare, sur ton ordinateur. Il contient la partie qui permet à Onshape dans le navigateur d’écouter une souris 3D.</>,
      <>Flashe le firmware sur une Capsule v1.1 avec M5Burner. Il n’est pas encore sur M5Burner, donc cette étape arrive bientôt.</>,
      <>Ouvre les réglages Bluetooth de ton ordinateur et appaire <b>Capsule CAD Mouse</b>. Elle gazouille quand elle se connecte.</>,
      <>Ouvre un modèle dans Onshape, clique sur le bouton et tourne la Capsule.</>,
    ],
    note: 'Je ne l’ai essayée que dans Onshape pour l’instant. Les autres logiciels qui prennent une SpaceMouse via 3DxWare devraient marcher pareil, mais je ne les ai pas encore testés, et je n’ai pas mesuré combien de temps tient la batterie.',
  },
};

export default fr;
