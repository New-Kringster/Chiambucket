import type { PipCopy } from './en';

/* The Pip article in French. Same shape as en.tsx. */
const fr: PipCopy = {
  meta: {
    title: 'Pip, un compagnon de bureau avec un agent pour cerveau | Braven Chiam',
    ogTitle: 'Pip, un compagnon de bureau avec un agent pour cerveau',
    description: 'Pip est un compagnon de bureau sur une M5Stack Tab5 dont le cerveau est le DeepSeek Harness sur mon serveur. Il dort, se réveille, réfléchit et sautille, pilote un navigateur avec son propre curseur, crée ses propres applis et dirige mes autres sessions d’agents.',
  },
  ld: {
    headline: 'Pip : un compagnon de bureau sur une M5Stack Tab5 avec le DeepSeek Harness pour cerveau',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'agents IA', 'compagnon de bureau'],
  },
  chapters: { meet: 'Voici Pip', canvas: 'L’écran', applets: 'Applets', desktops: 'Bureaux', crew: 'L’équipe', inside: 'Fonctionnement' },
  ui: {
    chapters: 'Chapitres',
    heroStage: 'Pip sur la M5Stack Tab5, puis Voici Pip',
    moods: 'Les humeurs de Pip',
    nextStep: 'Étape suivante',
    steps: 'Étapes',
    deck: 'Huit de mes Pips',
    carousel: 'carrousel',
    prevPip: 'Pip précédent',
    nextPip: 'Pip suivant',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip est un compagnon de bureau qui tourne sur le DeepSeek Harness (DSH). Il peut naviguer sur le web, créer et tester ses propres applis, piloter d’autres agents via le connecteur MCP, et bien plus encore. L’interface de Pip tourne sur une M5Stack Tab5.',
    meet: 'Voici Pip',
    m5: 'Lire sur M5Stack',
    m5Off: 'Pas encore publié',
    meta: 'Projet de stage chez M5Stack, novembre 2026. ESP32-P4, C++, Lua, Node, Python, Docker.',
  },

  /* ── 1. Meet Pip ── */
  meet: {
    title: 'Voici Pip',
    slotLabel: 'Mopi, un nuage cyan à lunettes',
    lede: 'Il est prêt à t’aider quand tu veux : prends-le et appuie pour parler.',
  },
  moods: {
    asleep: { name: 'Endormi', line: 'Si tu le laisses tranquille une minute, il baisse l’écran et s’assoupit.', label: 'Pip endormi' },
    wake: { name: 'Éveillé', line: 'Il se réveille en s’étirant quand tu prends la tablette ou que tu la touches, ou quand une réponse arrive.', label: 'Pip éveillé' },
    listen: { name: 'À l’écoute', line: 'Maintiens l’écran pour parler, et il se penche vers toi, la main à l’oreille.', label: 'Pip à l’écoute' },
    think: { name: 'Pensif', line: 'Pendant qu’il travaille, il se tortille et se masse les tempes, et parfois il a une idée.', label: 'Pip pensif' },
    happy: { name: 'Joyeux', line: 'Il sautille dès que quelque chose marche.', label: 'Pip joyeux' },
    talk: { name: 'Bavard', line: 'Sa réponse apparaît avec un petit carillon dans une bulle à côté de lui, juste sous ce qu’il t’a entendu dire.', label: 'Pip qui parle' },
  },
  props: {
    title: 'Chaque expression est une action différente',
    label: 'Des Pips avec une loupe, des jumelles, un mégaphone et un avion en papier',
    p: 'Pip prend un accessoire différent pour chaque tâche, donc tu vois d’un coup d’œil ce qu’il fait : une loupe quand il cherche sur le web, des jumelles quand il lit une page, un mégaphone quand il briefe un sous-agent et un avion en papier quand il écrit à un autre Pip.',
  },
  desk: {
    title: 'Il vit sur mon bureau',
    alt: 'La M5Stack Tab5 sur son clavier, sur mon bureau, avec Mopi, un nuage cyan à lunettes, sur son écran d’accueil',
    p: 'Pip tourne sur une M5Stack Tab5 clipsée sur son clavier, posée sur mon bureau. Voici Mopi, le Pip de mon premier bureau virtuel, qui attend sur l’écran d’accueil jusqu’à ce que j’aie besoin de lui.',
  },

  /* ── 2. The screen ── */
  canvas: {
    title: 'L’écran',
    pipLabel: 'Un Pip violet en béret qui regarde dans des jumelles',
    lede: 'Du Markdown, des navigateurs web interactifs, des dessins, des questions et plus encore.',
  },
  cursor: {
    title: 'Il pilote un navigateur',
    win: 'La page que Pip pilote',
    label: 'Le curseur de Pip qui glisse sur une vidéo YouTube, active les sous-titres et règle la vitesse sur 1,5x',
    p: 'Quand je demande une vidéo avec les sous-titres, Pip l’ouvre, déplace son curseur jusqu’au bouton des sous-titres, puis règle la vitesse depuis le menu des paramètres. Le navigateur lui-même tourne sur mon serveur, pendant que la tablette affiche la même page avec Pip qui regarde à côté.',
  },
  point: {
    title: 'Il te montre les choses',
    label: 'Un schéma de cellule animale sans légendes sur la Tab5 : Pip entoure les deux mitochondries avec une note « Mitochondria », puis dessine une flèche marquée « Nucleus » vers le noyau',
    p: 'C’est pratique pour réviser. J’ai affiché un schéma de cellule animale sans légendes et j’ai demandé à Pip d’entourer les mitochondries, puis de me montrer le noyau. Comme Pip peut faire une capture d’écran et la regarder, il trouve tout seul les éléments sur l’image avant de dessiner les cercles, la flèche et la note par-dessus le schéma.',
  },
  markdown: {
    title: 'Des réponses lisibles',
    alt: 'Une réponse mise en forme sur la Tab5 : un titre en gras, une liste aux débuts en gras, et une ligne dans la bulle',
    p: 'Les réponses plus longues s’ouvrent en texte mis en forme dans un panneau, pendant que la version courte reste dans la bulle à côté de Pip.',
  },
  question: {
    title: 'Il demande avant de deviner',
    alt: 'Une question à choix multiples de Pip sur la Tab5 : quelle partie de la cellule montrer d’abord, avec trois options, Type an answer et Skip',
    p: 'Quand Pip a besoin que je décide quelque chose, il affiche une question, et je peux répondre en touchant une option, en tapant au clavier ou en maintenant Pip pour la dire.',
  },
  touches: {
    tap: { title: 'Appuis', text: 'Chaque appui s’affiche en point bleu, qui devient un anneau vert dès que la page réagit.', alt: 'Un appui sur le bouton d’aide rond de la page M5Stack Tab5 : un point bleu, puis un anneau vert' },
    drag: { title: 'Glisser', text: 'Un glisser laisse une ligne bleue derrière ton doigt pendant que la page défile.', alt: 'Un doigt qui glisse vers le bas sur la page M5Stack Tab5 et laisse une ligne bleue' },
    expand: { title: 'Agrandir un panneau', text: 'Touche Expand sur n’importe quel panneau et il s’agrandit jusqu’à remplir l’écran.', alt: 'Un appui sur Expand sur un panneau, qui s’agrandit en plein écran' },
    back: { title: 'Revenir', text: 'Balaie de gauche à droite pour revenir en arrière, où que tu sois.', alt: 'Un doigt qui balaie de gauche à droite et ramène l’écran précédent' },
  },

  /* ── 3. Applets ── */
  applets: {
    title: 'Applets',
    pipLabel: 'Un Pip rose avec un casque qui tape sur un ordinateur portable',
    lede: 'Pip peut créer des applis natives en Lua ou streamer des applis web depuis l’hôte DSH.',
  },
  drawer: {
    title: 'Tiroir d’applis',
    label: 'Le tiroir d’applets qui monte, la fiche d’info de NCIR Thermometer, puis l’appli qui se lance et lit un capteur',
    p: 'Tirer la poignée vers le haut ouvre le tiroir d’applis, où sont rangées les applis que Pip crée. Les applis natives sont écrites en Lua et tournent de façon fluide sur la tablette elle-même, tandis que les applis conteneur sont des applis web qui tournent dans Docker sur l’hôte DSH et sont streamées vers la Tab5. Comme elles tournent sur le serveur, les applis conteneur peuvent faire beaucoup plus, comme des jeux multijoueurs sur ton réseau local ou même un appel vidéo.',
  },
  web: {
    macAlt: 'Un MacBook qui affiche l’Intercom dans un navigateur : l’image de moi prise par la caméra de la Tab5 remplit la fenêtre, avec l’aperçu de la caméra de mon Mac à côté',
    tabAlt: 'L’applet web Intercom sur la Tab5 pendant le même appel : mon visage vu par la caméra du Mac remplit l’écran, avec un bouton TALK en bas et l’image de la caméra de la tablette dans le coin',
    caption: <><b>Les applets web</b> sont des pages que Pip écrit et sert depuis mon serveur, mais ils peuvent quand même utiliser la caméra, les micros et le haut-parleur de la tablette. Voici l’Intercom, un applet d’appel vidéo que Pip a créé, pendant un vrai appel : la Tab5 me montre à travers la caméra de mon Mac, pendant que le navigateur de mon Mac me montre à travers celle de la tablette.</>,
  },
  native: {
    alt: 'L’applet natif NCIR Thermometer qui affiche la température de l’objet et la température ambiante avec un graphique de tendance',
    caption: <><b>Les applets natifs</b> sont des scripts Lua que Pip envoie à la tablette à la volée, donc ils tournent sur la tablette elle-même, à pleine vitesse.</>,
  },
  built: {
    title: 'Créé par Pip',
    label: 'Une partie de morpion sur la Tab5, X gagne en diagonale',
    caption: 'Un morpion, une autre appli créée par Pip, en pleine partie sur la tablette',
    list: [
      { time: '106 s', what: 'un minuteur pomodoro' },
      { time: '5 min', what: 'un jeu de réflexes en Lua, testé sur la tablette' },
      { time: '8 min', what: 'un niveau à bulle qui lit l’IMU' },
      { time: '32 min', what: 'un interphone webcam avec un navigateur à l’autre bout' },
    ],
  },
  devring: {
    title: 'Pas touche pendant les tests',
    label: 'Une bordure rouge autour de l’écran pendant qu’un sous-agent testeur touche une appli compteur : 0, 1, 2, 3, puis retour à 2',
    p: 'Une bordure rouge entoure l’écran dès qu’un sous-agent crée ou teste une appli dessus, donc je sais qu’il ne faut pas y toucher. Dans ce clip, un sous-agent testeur parcourt une appli compteur qu’un sous-agent codeur vient d’écrire, en comptant jusqu’à 3 puis en redescendant à 2.',
  },

  /* ── 4. Desktops ── */
  desktops: {
    title: 'Bureaux',
    pipLabel: 'Un Pip vert citron avec un chapeau de fête qui lance un avion en papier',
    lede: 'Chaque conversation a son propre bureau, avec son propre Pip et sa couleur.',
  },
  switch: {
    title: 'Tire pour changer',
    label: 'Sur le bureau de Mopi, la pilule en haut est tirée vers le bas jusqu’à la barre spotlight, glisse jusqu’à la pastille de Fizz et se relâche, et le bureau de Fizz arrive ; puis pareil de Fizz à Wavo',
    p: 'Tirer vers le bas la pilule en haut de l’écran ouvre la barre spotlight, qui a une pastille pour chaque bureau. Quand tu glisses jusqu’à l’une d’elles et que tu lâches, ce bureau s’affiche avec son propre Pip, son image et son travail. Dans ce clip, je passe de Mopi à Fizz, puis à Wavo.',
  },
  newpip: {
    title: 'Chaque Pip s’invente lui-même',
    p: 'Chaque nouveau bureau commence par un œuf, et son Pip s’invente une personnalité, un nom, un corps, un chapeau et une image d’accueil assortie avant d’éclore. Toucher son nom ouvre la fiche qu’il a écrite sur lui-même, et voici huit des miens.',
  },
  hatch: [
    { alt: 'La barre spotlight tirée vers le bas sur le bureau de Wavo, glissée au-delà de la dernière pastille jusqu’à ce qu’un plus surgisse ; on lâche, et un nouveau bureau arrive avec un œuf', caption: 'Glisse après la dernière pastille pour un nouveau bureau' },
    { alt: 'Riva, un cœur doré couronné, vient d’éclore, avec sa première phrase dans une bulle', caption: 'L’œuf éclot et le Pip dit sa première phrase' },
    { alt: 'La fiche de Riva sur la Tab5, écrite par elle-même : une rivale dorée et fanfaronne, théâtrale, compétitive et loyale, avec sa phrase fétiche, ce qu’elle aime et ce qu’elle déteste', caption: 'Touche son nom pour voir la fiche qu’il a écrite' },
  ],
  pips: {
    mopi: { name: 'Mopi', look: 'un nuage cyan à lunettes', vibe: 'Un petit philosophe somnolent qui prend la sieste et la rêverie tout aussi au sérieux l’une que l’autre.', says: 'Redemande-moi après ma sieste.' },
    poco: { name: 'Poco', look: 'un haricot violet avec une écharpe', vibe: 'Un minuscule garçon de ranch à la voix aiguë qui traite chaque petite tâche comme une aventure au Far West.', says: 'Allez, on la dompte !' },
    fizz: { name: 'Fizz', look: 'un bonbon rose avec un chapeau de fête', vibe: 'Un petit gremlin en bonbon rose qui transforme chaque petit bazar en jeu, puis range tout joyeusement.', says: 'Le chaos d’abord, le rangement après !' },
    wavo: { name: 'Wavo', look: 'une goutte vert citron à lunettes de soleil', vibe: 'Un surfeur-mathématicien décontracté qui résout des équations dans le sable mouillé entre deux séries de vagues.', says: 'Surfe sur le cosinus, mec.' },
    quib: { name: 'Quib', look: 'un haricot cyan à lunettes', vibe: 'Un minuscule bibliothécaire grognon qui garde les livres de la tablette et aime la compagnie en secret.', says: 'Chut. Les livres d’abord, les sentiments après.' },
    doughby: { name: 'Doughby', look: 'un bonbon violet avec un chapeau de fête', vibe: 'Un boulanger obsédé par les jeux de mots qui traite chaque conversation comme une fournée de blagues toute fraîche.', says: 'Je suis pétri de joie !' },
    blooma: { name: 'Blooma', look: 'une goutte rose avec une fleur', vibe: 'Une douce jardinière zen qui transforme les petits moments en petites saisons de calme.', says: 'Pousse en douceur, reste curieux.' },
    bzzt: { name: 'Bzzt', look: 'un nuage vert citron avec une antenne', vibe: 'Un petit robot comique pince-sans-rire qui apprend sérieusement ce qu’est une blague, une chute à plat après l’autre.', says: 'C’était une blague. Ris.' },
  },
  ask: {
    title: 'Parle à Pip de partout',
    label: 'La barre spotlight tirée vers le bas sur l’écran d’accueil de Riva, la question « What’s a good name for a cactus? » tapée et envoyée, puis la réponse de Riva : Prickly Pete, Spike Lee ou Sir Pokes-A-Lot',
    p: 'Tu peux aussi parler à Pip depuis la barre spotlight sur n’importe quel écran, en la tirant vers le bas ou en appuyant sur Ctrl+Espace, puis en tapant ou en parlant. Ici, je demande à Riva de trouver un nom pour un cactus.',
  },
  control: {
    title: 'Un centre de contrôle',
    label: 'Le centre de contrôle qui descend sur l’appli thermomètre, puis sa page de réglages',
    p: 'Tirer vers le bas depuis le coin en haut à droite ouvre le centre de contrôle, avec la luminosité, le volume, le micro, la caméra et un bouton pour quitter l’applet, et les réglages complets ne sont qu’à un toucher de plus.',
  },

  /* ── 5. The crew ── */
  crew: {
    title: 'L’équipe',
    pipLabel: 'Un Pip en cœur doré couronné qui crie dans un mégaphone',
    lede: 'Pip confie les longues tâches à des sous-agents, pour pouvoir continuer à me parler.',
  },
  subagents: {
    title: 'Sous-agents au travail',
    label: 'Cinq pips sous-agents au travail : ils écrivent, tapent, empilent des cubes, lisent et mélangent une fiole',
    p: 'Chaque sous-agent reçoit une tâche et l’accessoire qui va avec, comme un bloc-notes, un ordinateur portable, des cubes, un livre ou une fiole qui bouillonne. Pendant qu’ils travaillent, un petit Pip affairé s’installe sur l’écran d’accueil, et le toucher ouvre la fiche de l’équipe, où chacun dit ce qu’il est en train de faire.',
  },
  crewHome: {
    alt: 'La fiche de l’équipe ouverte sur l’écran d’accueil de Zesto : trois sous-agents, Researcher, Scout et Writer, chacun avec une courte pensée',
    caption: 'La fiche de l’équipe avec trois sous-agents au travail',
  },
  tasks: {
    title: 'Une liste par tâche longue',
    alt: 'Une liste de trois étapes terminée sur l’écran d’accueil de Fizz : concevoir et écrire l’appli Lua native, la tester sur la tablette, l’ouvrir sur le bureau',
    p: 'Pip transforme une longue tâche en liste sur l’écran d’accueil et confie chaque étape à un sous-agent, comme un éclaireur, un rédacteur ou un testeur, qui la coche une fois qu’elle est faite.',
  },
  kimi: {
    title: 'Il surveille mes autres agents',
    steps: [
      { alt: 'La fiche de l’équipe avec deux agents au travail : Zesto et Kimi, un agent extérieur, qui tape', caption: 'Kimi rejoint l’équipe' },
      { alt: 'Une fiche sur la Tab5 : Kimi veut écrire, avec Approve once, Approve for this session et Reject', caption: 'Il demande avant d’écrire' },
      { alt: 'La réponse de Pip sur la Tab5 : Kimi l’a livré, le fichier est dans l’espace de travail et contient hello from Kimi', caption: 'Pip fait son rapport' },
    ],
    p: 'Comme Pip vit dans le même harness que mes sessions de code, il voit lesquelles tournent, sont terminées, bloquées sur une question ou cassées, et il peut aussi faire venir des agents d’autres fournisseurs. Ici, il confie une tâche à Kimi Code sur mon serveur : Kimi rejoint la fiche de l’équipe, sa demande d’écrire un fichier arrive sur la tablette pour que je l’approuve, et Pip fait son rapport une fois que c’est fait.',
  },

  /* ── 6. How it works ── */
  inside: {
    title: 'Fonctionnement',
    pipLabel: 'Un Pip orange à lunettes qui réfléchit, jusqu’à ce qu’une ampoule s’allume',
    lede: 'La tablette n’est que le visage, et toute la réflexion se fait sur mon serveur.',
  },
  flow: {
    label: 'Le trajet d’une requête : la Tab5 parle à un pont sur la VM, et le pont parle au DeepSeek Harness',
    nodes: {
      tab: { title: 'Tab5', where: 'Sur mon bureau', items: ['Pip, dessiné sur la tablette', 'Tactile, clavier, micros', 'Caméra, IMU, haut-parleur', 'Applets natifs en Lua'] },
      bridge: { title: 'Pet bridge', where: 'Sur la VM', items: ['La transcription, sur la VM', 'Le matériel de la tablette, en API', 'Des pages pour les applets'] },
      dsh: { title: 'DeepSeek Harness', where: 'Sur la VM', items: ['Pip, une session avec son propre personnage', 'Des sous-agents pour les longues tâches', 'Un navigateur où Pip voit et clique', 'Des applets dans Docker'] },
    },
    links: [
      { out: 'voix, appuis, touches', back: 'images, réponses, scripts' },
      { out: 'tes mots, pour Pip', back: 'réponses, pages, applis' },
    ],
    caption: 'La tablette dessine Pip et l’écran, et elle parle en Wi-Fi à une petite VM Ubuntu sur mon bureau, où tourne tout le reste.',
  },
  hw: {
    working: 'Marche sur la Tab5',
    workingList: ['Tactile', 'Caméra', 'Micros', 'Haut-parleur', 'IMU', 'I2C', 'Clavier'],
    unchecked: 'Pas encore vérifié',
    uncheckedList: ['USB', 'Prise casque', 'Wi-Fi comme fonction', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: 'Toujours en cours',
    p: 'Pip est encore en construction et change presque chaque semaine, donc les instructions pour déployer le tien arriveront ici plus tard.',
  },
  credit: <>La Tab5 en 3D en haut de cette page est construite sur le modèle de structure de la Tab5 fourni par M5Stack dans <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (licence MIT, copyright M5Stack), avec le verre, l’écran et le dos en plus. Les animations de Pip sont rendues avec le code de dessin du firmware lui-même, et les captures d’écran et les clips viennent de l’écran de la tablette. Les clips de gestes ont été enregistrés avec la tablette ralentie, donc Pip y bouge un peu vite.</>,
};

export default fr;
