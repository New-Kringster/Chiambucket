import type { LidarCopy } from './en';

/* The Stack-chan LiDAR article in French. Same shape as en.tsx. */
const fr: LidarCopy = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'Un LiDAR fait à partir du Stack-chan de M5Stack, qui balaie une pièce avec quatre capteurs de distance Unit ToF4M grâce à ses servos, colore les points avec sa caméra et affiche le scan en 3D dans n’importe quel navigateur.',
    ogDescription: 'Stack-chan balaie une pièce avec quatre capteurs de distance et transforme les mesures en un scan 3D coloré que tu peux explorer.',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'nuage de points', 'scan 3D', 'ESP32-S3'],
  },
  chapters: { top: 'Stack-chan LiDAR', sweep: 'Le balayage', colour: 'Couleur', demo: 'Démo', play: 'Essaie le scan', setup: 'En faire un' },
  chaptersLabel: 'Chapitres',
  hero: {
    alt: 'Stack-chan dessiné d’après les modèles de M5Stack, avec quatre capteurs Unit ToF4M en carré sur la tête',
    back: 'Retour aux projets',
    tag: 'Projet de stage',
    featured: 'À la une',
    title: 'Stack-chan LiDAR',
    lead: 'J’ai transformé Stack-chan en LiDAR en lui mettant quatre capteurs de distance sur la tête et en laissant ses servos les balayer à travers une pièce. Sa caméra colore les points, et n’importe quel navigateur sur le même Wi-Fi affiche le scan en 3D pendant qu’il se construit.',
    builtWith: 'Fait avec',
    flash: 'Flasher le firmware',
    meta: 'Projet de stage chez M5Stack, novembre 2026. Stack-chan (CoreS3), PaHub, quatre Unit ToF4M, C++ et WebGL.',
    cue: 'Défile pour scanner',
  },
  sweep: {
    alt: 'Par-dessus l’épaule de Stack-chan, son cône de capteur qui atteint le mur pendant que le scan se remplit tout autour de la pièce',
    caps: [
      { title: 'Balayer la pièce', p: 'Stack-chan tourne la tête à travers la pièce, quelques degrés à la fois, et s’arrête à chaque pas pour mesurer à quelle distance se trouve le mur. Les servos donnent la direction et les capteurs la distance, donc chaque pas ajoute un point en 3D. Voici le vrai scan de la démo, qui se remplit à mesure que la tête pivote.' },
      { title: 'Quick, Normal ou Fine', p: 'Avant un scan, je choisis Quick, Normal ou Fine. Quick se termine en moins d’une minute, et Fine prend plus de temps mais capte bien plus de détails.' },
    ],
  },
  colour: {
    alt: 'Le scan terminé vu de l’extérieur de la pièce, aux couleurs de la caméra',
    caps: [
      { title: 'La couleur de sa caméra', p: 'Avant de balayer, Stack-chan prend des photos de la zone avec la caméra de la CoreS3. Le navigateur place ensuite chaque pixel de ces photos à la distance mesurée par les capteurs dans cette direction, ce qui transforme une grille de mesures en 68 206 points colorés.' },
      { title: 'Aligner les photos', p: 'La caméra est sous les capteurs, donc les photos et les distances sont prises depuis des endroits légèrement différents. Je les ai alignées en faisant correspondre les contours de la profondeur à ceux des photos, et maintenant les couleurs tombent au bon endroit sur la plus grande partie de la pièce, mais pas partout.' },
    ],
  },
  demo: {
    h: 'Démo',
    p: 'J’ai posé Stack-chan sur une table dans le coin d’une pièce vide et j’ai lancé un scan depuis mon portable. La vidéo montre la tête qui balaie pendant que les points s’accumulent dans le navigateur, puis le scan terminé sous tous les angles, d’abord coloré selon la distance, puis selon la caméra.',
    video: 'Stack-chan qui balaie un coin de pièce pendant que le nuage de points grandit dans le navigateur, puis le scan terminé coloré selon la distance et selon les photos',
    moments: [
      { label: 'Le balayage', note: 'La tête parcourt le coin pendant que les points se remplissent' },
      { label: 'Le scan terminé', note: 'Les murs et le plafond du coin, vus de l’extérieur' },
      { label: 'Distance', note: 'Chaque point coloré selon sa distance' },
      { label: 'Couleur photo', note: 'Les mêmes points colorés par les photos de Stack-chan' },
    ],
  },
  play: {
    h: 'Essaie le scan',
    stillAlt: 'Le scan terminé vu d’en haut : les murs et le plafond d’un coin de pièce, avec une boîte bleue sur la table',
  },
  pg: {
    view: 'Un nuage de points 3D de la pièce scannée par Stack-chan. Fais glisser pour le tourner, fais défiler ou pince pour zoomer, fais glisser avec le clic droit pour le déplacer, et double-clique sur un endroit pour y voler.',
    loading: 'Chargement du scan',
    hintTouch: 'Glisse pour tourner, pince pour zoomer',
    hintMouse: 'Glisse pour tourner, molette pour zoomer, clic droit pour bouger',
    drop: 'Dépose un fichier .ply pour l’ouvrir',
    stat: '{n} points, {size} m',
    colourBy: 'Colorer les points selon',
    modes: ['Photo', 'Distance', 'Hauteur'],
    eyeTitle: 'Voir depuis la tête de Stack-chan',
    eye: 'Voir depuis la tête de Stack-chan',
    reset: 'Revenir à la vue de départ',
    full: 'Plein écran',
    leaveFull: 'Quitter le plein écran',
    open: 'Ouvrir ton propre .ply',
    upY: 'Ce fichier a Y en haut',
    back: 'Retour au scan de Stack-chan',
    download: 'Télécharger ce scan',
    errors: {
      notPly: 'Ce fichier ne ressemble pas à un nuage de points .ply.',
      lists: 'Les listes dans les données de sommets ne sont pas prises en charge ; exporte seulement les points.',
      noXyz: 'Pas de x, y et z dans ce .ply.',
      short: 'Ce .ply s’arrête avant la fin de ses points.',
      unreadable: 'Impossible de lire ce fichier.',
    },
  },
  setup: {
    h: 'En faire un',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, le petit robot de M5Stack, qui a une CoreS3 pour tête, posée sur deux servos. Son ESP32-S3 fait tourner le scan, le serveur web et la caméra.</>,
      <>Quatre <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, des capteurs de distance à temps de vol VL53L1X, montés en carré sur le dessus de la tête.</>,
      <>Un <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, qui permet aux quatre capteurs de partager un seul port Grove alors qu’ils ont tous la même adresse I2C.</>,
    ],
    photoAlt: 'Le vrai Stack-chan avec les quatre capteurs sur la tête et leurs câbles Grove qui redescendent vers l’arrière',
    photoCaption: 'Le vrai Stack-chan avec ses capteurs',
    steps: [
      <>Branche un PaHub sur le Port A de Stack-chan et les quatre Unit ToF4M sur ses canaux 0 à 3, puis monte les capteurs sur le dessus de la tête, tournés vers l’avant.</>,
      <>Ouvre <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> dans Chrome ou Edge, choisis <b>Stack-chan LiDAR</b>, branche Stack-chan en USB-C et appuie sur Install.</>,
      <>Connecte-toi au réseau Wi-Fi <b>StackChan-LiDAR</b> qu’il crée et ouvre <b>http://192.168.4.1/</b>, que Stack-chan affiche aussi quand tu touches son visage. Ensuite, choisis une zone et un niveau de détail, et lance un scan.</>,
    ],
    note: 'Le Stack-chan de cette page est construit à partir des modèles 3D de M5Stack lui-même (M5_Hardware, licence MIT).',
  },
};

export default fr;
