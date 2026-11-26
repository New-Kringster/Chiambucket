import type { PantryCopy } from './en';

/* The Pantry Expiry Tracker article in French. Same shape as en.tsx. */
const fr: PantryCopy = {
  meta: {
    title: 'Pantry Expiry Tracker | Braven Chiam',
    description: 'Un suivi des dates de péremption pour la porte du frigo, construit sur une M5Stack CoreS3 SE et un module QRCode pendant mon stage chez M5Stack. Tu scannes un code-barres et tu choisis quand il périme, et l’écran montre toujours quoi manger en premier, pendant qu’un petit serveur nomme les produits et envoie des rappels à Home Assistant.',
    ogDescription: 'Scanne un code-barres, choisis quand il périme, et la porte du frigo te montre quoi manger en premier.',
  },
  ld: {
    headline: 'Pantry Expiry Tracker',
    about: ['M5Stack CoreS3 SE', 'ESP32-S3', 'lecteur de codes-barres', 'Home Assistant', 'MQTT', 'Open Food Facts'],
  },
  hero: {
    alt: 'Le suivi de péremption : une CoreS3 SE empilée sur le module QRCode et sa base batterie, l’écran allumé en rouge pendant le scan',
    back: 'Retour aux projets',
    tag: 'Projet de stage',
    title: <>Pantry <em>Expiry Tracker</em></>,
    lead: 'J’ai construit ce suivi des dates de péremption pour la porte du frigo pendant mon stage chez M5Stack. Tu scannes le code-barres d’un produit et tu choisis quand il périme, et l’écran montre toujours quoi manger en premier, avec les noms des produits en chinois ou en anglais.',
    builtWith: 'Fait avec',
    links: ['GitHub', 'Lire sur M5Stack', 'Flasher le firmware', 'Serveur'],
    meta: 'Projet de stage chez M5Stack, novembre 2026. M5Stack CoreS3 SE, Module13.2 QRCode, C++, Python, Docker, MQTT.',
  },
  chapters: 'Chapitres',
  rail: {
    demo: 'Démo', try: 'Essaie-le', features: 'Ce qu’il fait', scan: 'Scanner un produit', first: 'Quoi manger en premier',
    again: 'Rescanner pour ouvrir', swipe: 'Glisser pour supprimer', pantries: 'Plusieurs placards', control: 'Centre de contrôle',
    web: 'Dans un navigateur', ha: 'Home Assistant', how: 'Comment ça marche', hardware: 'Matériel', setup: 'En monter un',
  },
  demo: {
    h: 'Démo',
    p: 'J’ai filmé ça à mon bureau, en scannant d’abord des produits sur une feuille de démo affichée sur mon portable, puis une vraie brique de 冰红茶, avant de scanner la brique une deuxième fois et de passer à un deuxième placard.',
    video: 'Le suivi en action : scan de produits, une vraie brique, un nouveau scan de la brique et un changement de placard',
    moments: [
      { label: 'Scan de la feuille de démo', note: 'Nutella, Coca-Cola et Ritter Sport sur l’écran de mon portable' },
      { label: 'Une vraie brique', note: 'Une brique de 冰红茶, nommée par GS1 China' },
      { label: 'Nouveau scan', note: 'La brique enregistrée s’ouvre au lieu d’être ajoutée deux fois' },
      { label: 'Un autre placard', note: 'Je passe au frigo et j’y ajoute un produit' },
    ],
  },
  try: {
    h: 'Essaie-le',
    p: <>Voici une copie de l’écran du suivi qui suit les mêmes étapes. Touche <b>SCAN NOW</b> et choisis un produit sur l’étagère pour le présenter au scanner, puis règle sa date de péremption et enregistre-le. Tu peux aussi glisser une carte vers la gauche pour la supprimer, et scanner quelque chose qui est déjà dans la liste l’ouvre au lieu de l’ajouter.</>,
    note: 'Les codes-barres sur l’étagère sont les vrais codes EAN-13 des produits, donc le vrai suivi peut les scanner directement sur cette page.',
  },
  sim: {
    live: {
      home: 'Le placard, {n} produits, triés par date de péremption.',
      scan: 'Scan en cours. Choisis un produit sur l’étagère à présenter au scanner.',
      entry: '{name}. Règle sa date de péremption, puis enregistre-le.',
      detail: '{name}, déjà dans la liste. {days}.',
    },
    list: 'Placard',
    card: '{name}, {days}',
    remove: 'Supprimer {name}',
    cancel: 'Annuler',
    back: 'Retour',
    more: { d: 'Plus de jours', w: 'Plus de semaines', m: 'Plus de mois' },
    fewer: { d: 'Moins de jours', w: 'Moins de semaines', m: 'Moins de mois' },
    hintScan: 'Choisis un produit à présenter au scanner',
    hint: 'Touche un produit pour le scanner',
    scan: 'Scanner {name}',
    scanSaved: 'Scanner {name}, déjà dans la liste',
    onList: 'dans la liste',
    shelf: {
      '5449000000996': 'Coca-Cola', '3256540000698': 'Pains au lait', '6909548500734': '冰红茶',
      '3046920029759': 'Lindt noir', '3017620425035': 'Nutella',
    } as Record<string, string>,
    reset: 'Recommencer',
  },
  features: {
    h: 'Ce qu’il fait',
    p: 'Le suivi est collé sur la porte du frigo, et chaque écran ci-dessous est une capture prise dessus.',
  },
  scan: {
    h: 'Scanner un produit',
    alt: 'Le sélecteur de péremption pour 牛奶面包 de Brioche Pasquier, avec Days 0, Weeks 1 et Months 0, dans une semaine, et un bouton SAVE vert',
    p1: <>Quand tu touches <b>SCAN NOW</b> et que tu tiens un code-barres à environ une largeur de main de la fenêtre de scan, l’écran s’allume en rouge pendant que le scanner cherche un code. Le suivi affiche ensuite le nom, la marque, la taille et la photo du produit, qui viennent surtout d’Open Food Facts, tandis que les produits vendus en Chine continentale viennent de GS1 China grâce à un compte gratuit.</>,
    p2: <>Tu règles la date avec les flèches sous Days, Weeks et Months, puis tu touches <b>SAVE</b>.</>,
  },
  first: {
    h: 'Quoi manger en premier',
    alt: 'L’écran d’accueil : Prince périmé en rouge, Pesto alla Genovese dans 2 jours et Skyr dans 5 jours en orange, avec SCAN NOW en bas',
    p: 'L’écran d’accueil liste le placard avec la péremption la plus proche en haut, et le compteur passe au rouge à moins d’un jour de la date et à l’orange à moins d’une semaine.',
  },
  again: {
    h: 'Rescanner pour ouvrir',
    alt: 'La fiche de Barilla Pesto alla Genovese : ajouté aujourd’hui, périme le mercredi 2026-11-11, 2 jours, avec un bouton DELETE rouge',
    p: 'Scanner quelque chose qui est déjà dans la liste l’ouvre au lieu de l’ajouter deux fois, donc tu peux vérifier sa date ou le supprimer depuis là.',
  },
  swipe: {
    h: 'Glisser pour supprimer',
    alt: 'La carte Prince glissée vers la gauche, qui montre un bouton poubelle rouge',
    p: 'Glisser un produit de droite à gauche fait apparaître une poubelle rouge à toucher, et glisser de gauche à droite n’importe où te ramène en arrière.',
  },
  pantries: {
    h: 'Plusieurs placards',
    alt: 'Le menu des placards ouvert : Default Pantry avec 6 produits, Fridge avec 1, et Create Pantry',
    p: <>Le bouton <b>Pantry</b> passe d’un placard à l’autre, comme le frigo, le congélateur ou un placard de cuisine, et il peut aussi en créer un nouveau.</>,
  },
  control: {
    h: 'Un centre de contrôle',
    alt: 'Le centre de contrôle : un interrupteur de bip, un curseur de luminosité, batterie à 100 % et Home Assistant connecté',
    p: 'Le bouton d’état en haut à droite ouvre l’interrupteur du bip, la luminosité de l’écran et le niveau de batterie, et son icône de maison passe au vert quand le suivi est connecté à Home Assistant.',
  },
  web: {
    h: 'Le gérer dans un navigateur',
    p: 'La même liste est sur une page web, où tu peux ajouter des produits par code-barres, les renommer et organiser les placards depuis un ordinateur ou un téléphone. Un petit badge à côté de chaque nom indique d’où il vient, comme OFF pour Open Food Facts ou GS1 pour GS1 China.',
    alt: 'La page web du placard : des onglets All, Default Pantry et Fridge, un formulaire code-barres et date, et les produits triés par péremption avec leurs badges de source',
    caption: 'La page web du placard',
  },
  ha: {
    h: 'Rappels dans Home Assistant',
    p: 'Chaque placard apparaît dans Home Assistant comme un appareil à part, avec son nombre de produits, ce qui périme bientôt et le prochain produit à périmer. Chaque scan, ajout et suppression déclenche aussi un événement, donc tu peux construire tes propres automatisations par-dessus, comme un rappel sur ton téléphone la veille de la péremption d’un produit.',
    alt: 'Trois appareils dans Home Assistant : Pantry Tracker, Default Pantry et Fridge, chacun avec périmés, bientôt périmés, nombre de produits et prochaine péremption',
    caption: 'Les appareils du placard dans Home Assistant',
  },
  how: {
    h: 'Comment ça marche',
    p: 'Le suivi s’occupe seulement de l’écran et du scanner, et un conteneur Docker sur le réseau de la maison fait le reste : il garde la liste, cherche les codes-barres, met en cache les photos des produits et publie tout vers Home Assistant en MQTT. J’ai séparé les choses comme ça parce que l’ESP32-S3 ne peut pas gérer la connexion à GS1 China, et parce qu’une seule liste sur le serveur veut dire que le suivi, la page web et Home Assistant sont toujours d’accord.',
    overviewAlt: 'Vue d’ensemble du système : le suivi sur le frigo parle au serveur du placard en Wi-Fi, le serveur cherche les produits sur Open Food Facts et GS1 China et publie vers Home Assistant en MQTT, et n’importe quel navigateur peut ouvrir sa page web',
    overviewCaption: 'Comment les pièces se connectent',
    flowAlt: 'Ce qui se passe quand tu scannes : le code-barres est lu en UART, le serveur dit s’il est déjà enregistré, le produit est recherché et mis en cache, tu choisis la péremption, le produit est enregistré et Home Assistant est mis à jour',
    flowCaption: 'Ce qui se passe quand tu scannes',
  },
  hardware: {
    h: 'Matériel',
    parts: [
      { b: 'CoreS3 SE', s: 'fait tourner le suivi, avec l’écran tactile et le Wi-Fi.' },
      { b: 'Module13.2 QRCode', s: 'lit les codes-barres 1D et 2D et s’empile sous la CoreS3 SE.' },
      { b: 'Une base batterie', s: 'se met en dessous, pour qu’il tourne sur le frigo sans câble.' },
    ],
    fridgeAlt: 'Le suivi collé sur une porte de frigo grise, avec son écran Set me up et un QR code',
    fridgeCaption: 'Sur la porte du frigo, prêt à être configuré',
    p: 'Il te faut aussi un ordinateur qui reste allumé pour le serveur, et Home Assistant si tu veux des rappels.',
  },
  setup: {
    h: 'En monter un',
    p: 'Tout ce qu’il te faut se télécharge gratuitement : le firmware se flashe depuis ton navigateur, et le serveur vient en bundle Docker avec ses images incluses, donc rien n’a besoin d’être tiré de Docker Hub pendant l’installation.',
    steps: [
      <>Sur le module QRCode, mets l’interrupteur d’interface sur UART et active le numéro 2 dans les deux blocs DIP TX et RX, puis empile les trois pièces.</>,
      <>Ouvre <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> dans Chrome ou Edge, choisis <b>Pantry</b>, branche la CoreS3 SE en USB-C et appuie sur <b>Install</b>, ce qui flashe le firmware directement depuis le navigateur.</>,
      <>Télécharge le serveur pour l’ordinateur qui le fera tourner, soit le <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-amd64.tar.gz">bundle pour les ordinateurs Intel et AMD</a>, soit le <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-arm64.tar.gz">bundle pour les Mac Apple Silicon et un Raspberry Pi</a>. Décompresse-le, règle <code>TZ</code> dans <code>docker-compose.yml</code> sur ton fuseau horaire et lance <code>./install.sh</code> dans ce dossier.</>,
      <>Allume le suivi, scanne le QR code sur son écran avec ton téléphone, et entre ton Wi-Fi et l’adresse du serveur, par exemple <code>http://192.168.1.20:8080</code>.</>,
      <>Touche <b>SCAN NOW</b> et scanne ce code une fois, ce qui fait passer le moteur de scan de l’USB à la liaison série.</>,
      <>Dans Home Assistant, ajoute l’intégration MQTT avec l’adresse IP du serveur et le port 1883.</>,
      <>Pour les codes-barres chinois, ajoute un compte gratuit gds.org.cn dans <b>Settings</b> sur la page web du serveur et connecte-toi une fois.</>,
    ],
    hardwareAlt: 'L’interrupteur d’interface sur UART, l’interrupteur 2 activé dans les blocs DIP TX et RX, et la CoreS3 SE empilée sur le module et la base batterie',
    bootAlt: 'Premier démarrage : le suivi ouvre un hotspot Pantry avec un QR code, le téléphone s’y connecte, la page de configuration prend le Wi-Fi et l’adresse du serveur, et l’écran d’accueil se charge',
    codeAlt: 'Le code de réglage du moteur de scan 21424000, Serial Communication',
    repo: <>Le <a href="https://github.com/New-Kringster/Pantry_tracker_code" target="_blank" rel="noopener">dépôt GitHub</a> contient le guide complet dans son README, avec le code du firmware et du serveur si tu préfères les compiler toi-même.</>,
    note: 'Les noms et photos des produits sur cette page viennent d’Open Food Facts (CC BY-SA) et de GS1 China.',
  },
};

export default fr;
