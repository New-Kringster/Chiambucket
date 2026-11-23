import type { ScrollRulerCopy } from './en';

/* The Scroll Ruler article in French. Same shape as en.tsx. */
const fr: ScrollRulerCopy = {
  meta: {
    title: 'Scroll Ruler | Braven Chiam',
    description: 'Une règle numérique faite d’un M5Stack AtomS3R et d’un Unit Scroll pendant mon stage chez M5Stack. Tu appuies sur la molette et tu la fais rouler le long de ce que tu veux mesurer, et l’écran affiche la distance en centimètres après une seule calibration sur 10 cm.',
    ogDescription: 'Fais rouler l’Unit Scroll le long d’un objet et l’AtomS3R te dit combien il mesure.',
  },
  ld: {
    headline: 'Scroll Ruler',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'encodeur rotatif', 'règle numérique'],
  },
  hero: {
    alt: 'La Scroll Ruler : un AtomS3R sur son Atomic Battery Base, avec l’Unit Scroll branché en dessous et l’écran qui affiche 0.0 cm',
    back: 'Retour aux projets',
    tag: 'Projet de stage',
    title: <>Scroll <em>Ruler</em></>,
    lead: 'J’ai construit cette règle numérique pendant mon stage chez M5Stack, avec un AtomS3R et un Unit Scroll. Tu appuies sur la molette et tu la fais rouler le long de ce que tu veux mesurer, et l’écran affiche la distance en centimètres.',
    builtWith: 'Fait avec',
    links: ['GitHub', 'Flasher le firmware'],
    meta: 'Projet de stage chez M5Stack, novembre 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.',
  },
  chapters: 'Chapitres',
  rail: {
    demo: 'Démo', try: 'Essaie-la', use: 'Mode d’emploi', measure: 'Mesurer', calibrate: 'Calibrer',
    steps: 'Sa précision', how: 'Comment ça marche', hardware: 'Matériel', setup: 'En monter une',
  },
  demo: {
    h: 'Démo',
    p: 'J’ai filmé ça à mon bureau, en la calibrant d’abord sur 10 cm d’une règle, puis en mesurant trois longueurs le long de la même règle.',
    video: 'La Scroll Ruler calibrée sur 10 cm d’une règle, puis qui mesure 4,1, 8,2 et 7,3 cm',
    moments: [
      { label: 'Calibrer sur 10 cm', note: 'Elle a compté 49 pas de molette, environ 2 mm par pas' },
      { label: 'Premier passage', note: 'Roulée le long de la règle, elle affiche 4,1 cm' },
      { label: 'Deuxième passage', note: 'Un passage plus long affiche 8,2 cm' },
      { label: 'Troisième passage', note: 'Le dernier passage affiche 7,3 cm' },
    ],
  },
  try: {
    h: 'Essaie-la',
    p: 'Cette copie de la règle fait tourner la même logique que le firmware et démarre sur son écran de calibration. Fais glisser l’Unit Scroll le long de la règle pour le faire rouler molette enfoncée, ce qui compte, ou clique sur la règle pour le soulever et le poser ailleurs, ce qui ne compte pas. Toucher l’écran enregistre une calibration ou remet la mesure à zéro, et le maintenir une seconde lance une nouvelle calibration.',
    note: 'Une calibration qui ne fait pas exactement 10 cm fausse toutes les mesures de la même façon, ici comme sur la vraie règle.',
  },
  sim: {
    reading: 'Mesure : {cm} centimètres.',
    readingLive: 'Mesure : {cm} centimètres, comptage en cours.',
    calibrating: 'Calibration : {n} pas pour l’instant. Fais rouler exactement 10 centimètres molette enfoncée, puis relâche.',
    confirming: '{n} pas pour 10 centimètres. Touche l’écran pour l’enregistrer.',
    button: 'L’écran de l’AtomS3R, qui est aussi son bouton : touche pour remettre à zéro ou enregistrer, maintiens pour recalibrer',
    puck: 'L’Unit Scroll à {cm} cm sur la règle. Maintiens une flèche du clavier pour le faire rouler molette enfoncée.',
    reset: 'Recommencer',
  },
  use: {
    h: 'Mode d’emploi',
    p: 'Tout l’écran de l’AtomS3R est son bouton, donc la règle n’a que deux commandes : la molette, que tu enfonces pendant que tu la fais rouler, et l’écran, que tu touches ou maintiens.',
  },
  measure: {
    h: 'Mesurer',
    screen: 'L’écran de la règle pendant le comptage : RULER avec une étiquette LIVE verte, 4.1 cm en vert, et 41 mm à 2.0 mm par pas',
    p1: 'Tu enfonces la molette et tu la fais rouler vers l’avant, et la distance ne compte que tant que la molette reste enfoncée, avec la LED de l’Unit Scroll allumée en vert et la mesure qui passe au vert elle aussi. Relâcher la molette arrête le comptage, et rouler en arrière molette enfoncée retire de la distance.',
    p2: 'Toucher l’écran remet la mesure à zéro, et le maintenir environ une seconde lance une nouvelle calibration.',
  },
  calibrate: {
    h: 'Calibrer',
    rolling: 'Calibration : 49 pas comptés pour l’instant, avec la consigne d’enfoncer la molette et de rouler exactement 10 cm',
    rollingCaption: 'Rouler les 10 cm',
    checking: 'Vérification : 49 pas valent 10 cm, touche pour enregistrer',
    checkingCaption: 'Relâchée, prête à enregistrer',
    p1: 'Au premier démarrage, et chaque fois que tu le lui demandes, la règle mesure 10 cm pour apprendre la distance parcourue par la molette à chaque pas. Tu enfonces la molette et tu la fais rouler exactement 10 cm le long d’une vraie règle, puis tu la relâches et tu touches l’écran pour enregistrer le nombre de pas comptés.',
    p2: 'Enfoncer à nouveau la molette continue d’ajouter au même passage, et maintenir l’écran recommence depuis le début. La calibration reste en flash, donc elle survit à une coupure de courant, et le sens dans lequel tu as roulé devient l’avant.',
  },
  steps: {
    h: 'Sa précision',
    p: 'La molette n’a qu’un certain nombre de pas par tour, donc la règle mesure par pas plutôt qu’en continu. La mienne a compté 49 pas pour 10 cm, ce qui fait environ 2 mm par pas, et l’écran affiche la longueur exacte d’un pas sous chaque mesure pour que tu saches à quel point te fier au dernier chiffre.',
  },
  how: {
    h: 'Comment ça marche',
    p1: 'L’Unit Scroll a sa propre petite puce qui compte les pas de la molette et lit son bouton, et l’AtomS3R lui demande les deux en I2C par le port Grove cent fois par seconde. Chaque lecture renvoie les pas depuis la précédente, et ils ne comptent dans la distance que tant que la molette est enfoncée.',
    p2: 'J’ai gardé la logique de la règle, c’est-à-dire la calibration et le calcul de distance, dans un seul fichier sans aucun code matériel, donc onze tests unitaires la vérifient sur un ordinateur avant qu’elle passe sur l’appareil. Si l’Unit Scroll se débranche, l’écran le dit, et il le retrouve dès qu’il est rebranché.',
  },
  hardware: {
    h: 'Matériel',
    parts: [
      { b: 'AtomS3R', s: 'fait tourner la règle sur son ESP32-S3, et son écran de 0,85 pouce est aussi son bouton.' },
      { b: 'Atomic Battery Base', s: 'porte la batterie, donc la règle n’a pas besoin de câble.' },
      { b: 'Unit Scroll', s: 'est la molette que tu fais rouler, avec un bouton-poussoir et une LED RGB, et il se branche sur le port Grove de l’AtomS3R.' },
    ],
    photoAlt: 'La règle tenue en l’air après le deuxième passage, son écran affichant 8.2 cm, au-dessus de la règle le long de laquelle elle a roulé',
    photoCaption: 'Après le deuxième passage de la démo',
  },
  setup: {
    h: 'En monter une',
    steps: [
      <>Empile l’AtomS3R sur l’Atomic Battery Base et branche l’Unit Scroll sur le port Grove de l’AtomS3R.</>,
      <>Ouvre <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> dans Chrome ou Edge, choisis <b>Scroll Wheel Ruler</b>, branche l’AtomS3R en USB-C et appuie sur <b>Install</b>, ce qui flashe le firmware directement depuis le navigateur.</>,
      <>Elle démarre sur l’écran de calibration, alors enfonce la molette et fais-la rouler exactement 10 cm le long d’une règle, puis relâche-la et touche l’écran pour enregistrer.</>,
    ],
    repo: <>Le <a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">dépôt GitHub</a> contient le code du firmware, ses tests unitaires et une image du firmware à télécharger pour la flasher plutôt avec esptool.</>,
    note: <>L’AtomS3R sur cette page est rendu à partir du modèle de M5Stack dans <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (licence MIT, copyright M5Stack), et ses écrans sont dessinés d’après la mise en page du firmware lui-même.</>,
  },
};

export default fr;
