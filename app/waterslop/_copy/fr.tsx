import type { WaterslopCopy } from './en';

/* The OCR Reader article in French. Same shape as en.tsx. */
const fr: WaterslopCopy = {
  meta: {
    title: 'OCR Reader, un lecteur de compteur d’eau par vision sur ESP32-S3 | Chiambucket',
    description:
      'OCR Reader est un lecteur de compteur d’eau peu coûteux et sur batterie, qui lit le compteur avec une caméra. Un réseau de 693K paramètres, DrumNet V10, tourne entièrement sur son ESP32-S3 pour lire les tambours, et le relevé part en LoRaWAN. L’article passe par MeterSim, SimGen2, les six agents qui l’ont entraîné, le réseau étape par étape, le firmware, le PCB en 3D, le boîtier et un simulateur ConfigKing.',
    ogTitle: 'OCR Reader : un lecteur de compteur d’eau par vision sur ESP32-S3',
  },
  ld: { headline: 'OCR Reader : un lecteur de compteur d’eau par OCR et vision sur ESP32-S3' },

  ui: {
    chapterDash: 'Chapitre - {n}',
    next: 'Suivant',
    nextChapter: 'Chapitre suivant',
    nextFrame: 'Étape suivante',
    coverAria: 'Chapitre {n} : {title}',
    coverN: 'Chapitre {n}',
    coverContents: 'Dans le chapitre {n}',
    ck: {
      hint: 'Appuie sur l’écran ou une touche pour piloter',
      deviceAria: 'Simulateur ConfigKing sur un M5Stack Cardputer. Clique sur l’écran ou les touches, puis utilise les flèches, Entrée, Échap et Tab.',
      keyboard: 'Clavier du Cardputer',
      view: 'Vue',
      close: 'Gros plan',
      full: 'Tout voir',
      zoom: 'Agrandi',
      fullScreen: 'Plein écran',
      exitFullScreen: 'Quitter le plein écran',
    },
  },

  entrance: 'OCR de compteur d’eau sur ESP32-S3',
  skip: { toEnd: 'Aller à la fin', toTop: 'Retour en haut' },

  hero: {
    label: 'OCR Reader',
    labelSub: 'OCR de compteur d’eau sur ESP32-S3 · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader est un lecteur de compteur d’eau par OCR et par vision, peu coûteux et basse consommation. Un réseau de neurones de 693K paramètres, DrumNet V10, tourne entièrement sur l’ESP32-S3 du lecteur, où il trouve la fenêtre des chiffres, lit chaque tambour et envoie le nombre à la maison en LoRaWAN en environ 2 secondes. L’objectif, c’est 99 % de précision avec 2 ans de batterie, et la version actuelle lit correctement 56 % des relevés, avec des pistes pour faire mieux.',
    contentsAria: 'Chapitres',
    start: 'Commencer',
    report: 'Le rapport',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  chapters: {
    v2: 'PCB et boîtier', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: 'Workflow agentique',
    firmware: 'Firmware', power: 'Économie d’énergie', camera: 'Choix de caméra', proto: 'Prototype V2', conclusion: 'Conclusion', report: 'Le rapport',
  },

  /* ── Chapitres I à III ── */
  pcb: {
    aria: 'Le PCB et le boîtier du Prototype V2 en 3D, jusqu’au lecteur qui prend une photo du compteur',
    chapterColon: 'Chapitre {n} :',
    name: 'PCB de l’OCR Reader',
  },

  film: {
    aria: 'Une animation de toute l’architecture DrumNet V10',
    title: 'DrumNet',
    of: '{stage} · {n} sur {total}',
    nudge: 'Le film se lance tout seul, et la page reprend dans un instant.',
    scenesAria: 'Scènes',
    sceneAria: '{n}. {title}',
    prev: 'Scène précédente',
    prevTitle: 'Précédente (←)',
    play: 'Lecture',
    pause: 'Pause',
    replay: 'Revoir',
    playTitle: 'Lecture / pause (espace)',
    next: 'Scène suivante',
    nextTitle: 'Suivante (→)',
    fast: 'Avance rapide, actuellement {n} fois',
    fastTitle: 'Avance rapide (f)',
    skip: 'Passer',
    skipTitle: 'Passer au chapitre suivant, ConfigKing',
    scenes: {
      photo: {
        stage: 'Capture', title: 'La photo que le lecteur vient de prendre',
        body: 'C’est une seule image de 800 × 600 en niveaux de gris, et tout ce qui suit tourne sur l’ESP32-S3 avec cette seule photo.',
      },
      downscale: {
        stage: 'Entrée', title: 'Réduire la capture',
        body: 'Le lecteur capture le compteur en 800 × 600 en gris, et pour le détecteur l’image est réduite à 320 × 240, soit quatre fois moins de nombres, si bien que la recherche grossière va vite et coûte peu.',
      },
      'spot-net': {
        stage: 'Détecteur', title: 'Cinq blocs réduisent la miniature à une grille de 10 × 7',
        body: 'Chaque bloc fait glisser un noyau 3 × 3 sur son entrée, garde les réponses fortes (ReLU) et divise la taille par deux (max-pool). La miniature devient 8 cartes, puis 16, 24, 32 et 32, chacune deux fois plus petite que la précédente, jusqu’à ce qu’une cellule du dernier bloc représente une zone de 32 × 34 de la miniature.',
      },
      'spot-head': {
        stage: 'Détecteur', title: 'La carte de score choisit la cellule, les quatre autres disent où',
        body: 'Une convolution 1 × 1 transforme le bloc 5 en cinq cartes de 10 × 7, et la carte de score choisit la cellule la plus susceptible de contenir le centre de la fenêtre des chiffres. Cette position est transmise aux cartes dx, dy, largeur et hauteur, lues à la même cellule, et ensemble elles dessinent une boîte sur la miniature.',
      },
      'spot-crop': {
        stage: 'Détecteur', title: 'Une boîte grossière, puis un recadrage généreux',
        body: 'Le travail du détecteur reste approximatif, donc la boîte est élargie 1,5 ×, et le recadrage autour prend 1,5 × sa largeur et 2,4 × sa hauteur. Il est découpé dans l’image complète de 800 × 600, pas dans la miniature, puis envoyé à l’affineur.',
      },
      'ref-net': {
        stage: 'Affineur · passe 1', title: 'Quatre blocs ramènent le recadrage à 32 cartes de 32 × 12',
        body: 'Le recadrage est passé en gris et redimensionné en 256 × 96, et RefNet enchaîne quatre blocs du même type que ceux du détecteur. Le dernier ne fait pas de pooling, donc le bloc 4 garde 32 cartes de 32 × 12, une colonne pour chaque tranche de 8 pixels du recadrage.',
      },
      'ref-avg': {
        stage: 'Affineur · passe 1', title: 'Chaque carte est moyennée en une ligne et une colonne',
        body: 'Le bloc 4 est une pile de 32 cartes, et chacune se détache à son tour. Ses 32 colonnes se moyennent en une ligne de la carte des moyennes de colonnes, et ses 12 lignes en une colonne de la carte des moyennes de lignes, si bien que la première trouve la gauche et la droite, et la seconde le haut et le bas.',
      },
      'ref-heads': {
        stage: 'Affineur · passe 1', title: 'Les cartes de moyennes deviennent des bandes de score et de décalage',
        body: 'Une convolution 1 × 1 lit chaque colonne de la carte des colonnes et la transforme en quatre bandes, un score et un décalage pour le bord gauche et pareil pour le bord droit, tandis que la carte des lignes en donne quatre de plus pour le haut et le bas. Le meilleur score choisit la cellule, son décalage dit où se trouve le bord dans cette cellule, et les quatre bords forment la boîte.',
      },
      'ref-pass2': {
        stage: 'Affineur · passe 2', title: 'Agrandir la boîte, recadrer encore et relancer le même réseau',
        body: 'La boîte de la passe 1 n’est pas mieux centrée que l’estimation du détecteur, alors on l’agrandit, on recadre à nouveau et on l’envoie dans exactement le même affineur, avec les mêmes quatre blocs, les mêmes têtes et les mêmes 15 400 poids. La passe 2 rejoue la passe 1 en accéléré, et sa boîte part vers le lecteur.',
      },
      cut: {
        stage: 'Découpe', title: 'Découper la fenêtre en tambours',
        body: 'La disposition, 4 tambours entiers et 2 tambours décimaux, a été fixée pendant la configuration, donc la fenêtre est découpée en six cellules égales, et chacune est passée en gris, poussée au contraste maximal en 32 × 64 et envoyée aux lecteurs. On suit le sixième tambour, le 7.',
      },
      'rd-net': {
        stage: 'Lecteur 1', title: 'Un lecteur transforme une cellule en 96 minuscules cartes',
        body: 'Le lecteur reprend les mêmes quatre blocs de convolution 3 × 3, ReLU et max-pool, mais en plus larges, avec 16, 48, 96 et 96 cartes, donc la cellule de 32 × 64 finit en 96 cartes de 2 × 4, où une cellule représente une zone de 16 × 16 du tambour.',
      },
      flatten: {
        stage: 'Lecteur 1', title: 'Aplatir 96 cartes en une liste de 768',
        body: 'Rien n’est calculé ici. La première carte est retirée du bloc et ses 2 × 4 cellules sont lues ligne par ligne en une rangée de 8, puis les 95 autres cartes suivent jusqu’à ce que le bloc soit vide, donc les 768 nombres sont toujours dans le même ordre, la carte 1 en premier et la carte 96 en dernier.',
      },
      dense: {
        stage: 'Lecteur 1', title: 'La couche dense transforme 768 nombres en 96 unités',
        body: 'Chacune des 96 unités multiplie chaque nombre par son propre poids, additionne les 768 produits et un biais, et remplace tout ce qui est sous zéro par zéro. L’unité 69 passe en premier, lentement, puis les 95 autres font pareil.',
      },
      digit: {
        stage: 'Lecteur 1', title: 'La tête des chiffres transforme dix scores en une réponse',
        body: 'Chaque chiffre de 0 à 9 a ses propres 96 poids et son biais, donc dix sommes pondérées donnent dix scores. Le softmax élève e à la puissance de chaque score et divise par le total, ce qui transforme une avance nette en presque toute la probabilité. Le 7 gagne avec 96,4 %, et ce pourcentage, c’est la confiance.',
      },
      roll: {
        stage: 'Lecteur 1', title: 'La tête de rotation mesure de combien le tambour a tourné',
        body: 'Une somme pondérée de plus sur les 96 unités donne un score de rotation, que tanh écrase entre −0,5 et +0,5 pour dire de combien le tambour a dépassé son repère. Ce 7 a tourné de 3,7 % d’un cran vers le 8.',
      },
      readers3: {
        stage: 'Ensemble de lecteurs', title: 'Les lecteurs 2 et 3 lisent le même tambour',
        body: 'Les trois copies du lecteur partagent la même architecture, mais elles ont été entraînées à partir de départs aléatoires différents, donc elles ne font pas les mêmes erreurs. La même cellule passe par les lecteurs 2 et 3 de la même façon, en accéléré, et chacun donne ses propres dix pourcentages et sa propre rotation.',
      },
      vote: {
        stage: 'Vote', title: 'Trois réponses moyennées en une seule',
        body: 'Les réponses des trois lecteurs descendent jusqu’au vote, où leurs listes de probabilités sont moyennées, donc chaque lecteur a la même voix et le troisième départage les égalités. La liste moyennée donne le chiffre et sa confiance, les trois rotations sont moyennées aussi, et le tambour 6 sort comme un 7 à 98,8 %.',
      },
      drums: {
        stage: 'Vote', title: 'Tous les autres tambours passent par la même machine',
        body: 'Les cinq autres cellules suivent les mêmes étapes en accéléré, les quatre blocs, l’aplatissement, la couche dense et les deux têtes dans les trois lecteurs à la fois, puis le vote, jusqu’à ce que six réponses moyennées s’alignent avant la règle de retenue. Le tambour 3 est le moins sûr, un 9 à 71,5 %, parce que le lecteur 3 y a vu un 0 et a été mis en minorité.',
      },
      carry: {
        stage: 'Vote', title: 'La règle de retenue, puis le relevé',
        body: 'Un tambour n’a le droit d’être en pleine rotation que si le tambour à sa droite est sur 9 ou 0, ou s’il est le dernier tambour, et alors on se fie à sa rotation et le chiffre peut avancer. Si le tambour de droite est sur 1 à 8, ce tambour est bloqué sur son chiffre le plus proche, ce qui évite qu’un 79 qui passe à 80 soit lu 89. Ici, chaque rotation reste dans la zone morte, donc chaque tambour garde son chiffre et le relevé est 0092.07.',
      },
      finale: {
        stage: 'DrumNet V10', title: 'Tout le pipeline en même temps',
        body: 'Toutes les étapes tournent ensemble une dernière fois, de la miniature et du détecteur jusqu’à l’affineur, aux six cellules, aux trois lecteurs, au vote et à la règle de retenue, ce qui prend au lecteur environ deux secondes par relevé.',
      },
    },
    panels: {
      input: { title: 'Entrée', sub: 'une photo du lecteur' },
      spotter: { title: 'Détecteur DetNet', sub: 'une boîte grossière autour de la fenêtre des chiffres' },
      ref1: { title: 'Affineur RefNet · passe 1', sub: 'trouver les quatre bords dans la boîte grossière' },
      ref2: { title: 'Affineur RefNet · passe 2', sub: 'agrandir, recadrer et relancer le réseau' },
      cut: { title: 'Découpe en chiffres', sub: 'une cellule par tambour' },
      reader1: { title: 'Lecteur DrumNet 1', sub: 'quel chiffre s’affiche, et de combien il a tourné' },
      reader2: { title: 'Lecteur DrumNet 2', sub: 'le même réseau, d’un autre départ aléatoire' },
      reader3: { title: 'Lecteur DrumNet 3', sub: 'celui qui départage' },
      vote: { title: 'Vote d’ensemble et relevé', sub: 'moyenne, règle de retenue, relevé' },
    },
    draw: {
      block: 'bloc {n}',
      mapsOne: '{n} carte · {sub}',
      maps: '{n} cartes · {sub}',
      weights: '{n} poids',
      noPool: '{sub} · sans pool',
      greyJpeg: '800 × 600 · JPEG en gris',
      fewer: '{n} nombres · 4 × moins',
      thumbnail: 'miniature',
      conv5: 'conv 1 × 1 · 32 → 5',
      score: 'score',
      chosen: 'meilleure des 70 cellules : choisie',
      across: 'centre à {n} % sur la largeur',
      down: 'centre à {n} % sur la hauteur',
      width: 'largeur 0,25 du cadre · {n} px',
      height: 'hauteur 0,12 du cadre · {n} px',
      headCols: ['cellule', 'brut', '0 à 1', 'sens'],
      sigmoid: '0 à 1, c’est la sigmoïde de la valeur brute',
      corner: 'dx, dy depuis le coin de la cellule',
      selection: 'la sélection du détecteur · {w} × {h} px',
      widened: 'élargie 1,5 ×',
      cropBox: 'recadrage · 1,5 × plus large, 2,4 × plus haut · {w} × {h} px',
      cutFrom: 'découpé dans l’image 800 × 600 entière, pas la miniature',
      colAvgSize: 'moyennes des colonnes · 32 × 32',
      colAvgNote: 'une ligne par carte · 12 valeurs → 1',
      rowAvgSize: 'moyennes des lignes · 32 × 12',
      rowAvgNote: 'une colonne par carte · 32 valeurs → 1',
      slab: 'bloc 4 · 32 cartes · 32 × 12',
      peel1: 'la carte 1 se détache, et ses 32 colonnes donnent chacune une valeur,',
      peel2: 'et ses 12 lignes chacune une valeur',
      mapOf: 'carte {n} sur 32',
      colAvg: 'moyennes des colonnes',
      rowAvg: 'moyennes des lignes',
      sameCol: 'mêmes poids pour chaque colonne',
      sameRow: 'mêmes poids pour chaque ligne',
      conv: 'conv 1 × 1',
      inOut: '32 entrées, 4 sorties',
      leftScore: 'score gauche', leftOffset: 'décalage gauche', rightScore: 'score droit', rightOffset: 'décalage droit',
      topScore: 'score haut', topOffset: 'décalage haut', bottomScore: 'score bas', bottomOffset: 'décalage bas',
      stripsKey: 'plein : meilleur score · pointillé : son décalage · trait : position du bord dans la cellule',
      crop: 'recadrage · 256 × 96 gris',
      expanded: 'agrandi · {w} × {h} px → 256 × 96',
      sameRef: 'le même RefNet · mêmes blocs, mêmes têtes, mêmes 15 400 poids',
      pass2Box: 'boîte passe 2',
      toReader: '{w} × {h} px · vers le lecteur',
      window: 'fenêtre · {w} × {h} px · 6 bandes égales',
      cells: 'cellules · une par tambour',
      readerCells: 'cellules du lecteur · gris, plein contraste, 32 × 64',
      drum: 'tambour {n}',
      drumSize: 'tambour {n} · 32 × 64',
      reader1Maps: 'cartes et unités du lecteur 1, mais chiffre et rotation de ce lecteur',
      mapsLeft: 'bloc 4 · reste {n} cartes sur 96',
      rowByRow: 'ligne par ligne',
      map1List: 'carte 1 → positions 1 à 8 de la liste',
      map: 'carte {n}',
      oneList: 'une liste · {n} nombres',
      numbers768: '768 nombres',
      weightPer: 'un poids par nombre',
      sum768: 'somme des 768',
      offset: 'biais',
      unit: 'unité {n}',
      units96: '96 unités',
      aboveZero: '{w} poids · {n} des 96 au-dessus de zéro pour ce tambour',
      digitCols: ['score', 'e^score', '÷ somme', 'softmax'],
      digit: 'chiffre {n}',
      firmwareChecks: 'la confiance que vérifie le firmware',
      share: 'e^7,1 = 1 215 ÷ 1 260 · un score 3,6 au-dessus du suivant pèse 36 ×',
      rollScore: 'score de rotation',
      roll: 'rotation {v}',
      rollMeasured: 'le 7 a dépassé son repère de 3,7 % d’un cran vers le 8',
      rollPast: 'le {d} est à {p} % d’un cran après son repère',
      rollBefore: 'le {d} est à {p} % d’un cran avant son repère',
      leastSure: 'le moins sûr, car le lecteur 3 a lu un 0 et a été mis en minorité',
      reader: 'lecteur {n}',
      mean: 'moyenne',
      meanOfThree: 'rotation {v} · la moyenne des trois',
      inBand: 'dans la zone',
      pastBand: 'hors zone',
      freeLast: 'libre · dernier tambour',
      free: 'libre · tambour de droite sur 9 ou 0',
      lock: 'bloqué · tambour de droite sur 1 à 8',
      allowed: '{n} → {m} autorisé',
      absolute: '{n}, absolu',
      carryNote: '79 qui passe à 80 pourrait se lire 89, donc la règle prend plutôt le nombre précédent',
      units: 'mètres cubes · confiance 71,5 %, le moins sûr des 6 tambours',
      secondRoute: 'second recours : relancer avec WindowNet',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: 'Aller au simulateur',
    intro: {
      eyebrow: 'Installation et configuration', title: 'Le même relevé, sur l’outil de configuration',
      before: <p>Ce relevé, 0092.07, et l’image dont il vient, c’est ce qu’affiche ConfigKing quand il demande Read à un lecteur. ConfigKing est le firmware que j’ai écrit pour un M5Stack Cardputer : il trouve les lecteurs à proximité en BLE et en ESP-NOW, configure les nouveaux étape par étape et reconfigure les autres.</p>,
      after: <p className="ws-note">DrumNet et le firmware sont flashés sur le Prototype V2, avec l’adresse LoRa de l’appareil réglée en même temps, et comme les lecteurs dorment la plupart du temps, il faut appuyer sur le bouton boot pour en réveiller un et qu’on puisse le trouver. L’écran ici est une copie fonctionnelle des écrans du vrai firmware, dessinée à partir de son code source sur une photo du Cardputer.</p>,
    },
    press: { connect: 'connecter', save: 'sauver', next: 'suivant', finish: 'terminer', continue: 'continuer' },
    steps: {
      nearby: { eyebrow: 'Étape 1', title: 'Découverte', body: 'Quand un lecteur non configuré est mis sous tension, il démarre automatiquement en mode configuration. ConfigKing le détecte et te propose de le configurer.' },
      identify: { eyebrow: 'Étape 2', title: 'Identité et cadence de lecture', body: 'Choisis le nom que le lecteur affiche sur le tableau de bord, puis sa cadence de lecture, et déplie l’icône (i) pour plus de détails sur le lecteur.' },
      layout: { eyebrow: 'Étape 3', title: 'Les tambours', body: 'Règle la disposition des tambours pour qu’elle corresponde au compteur sur lequel le lecteur sera installé, avec 1 à 8 tambours entiers et 0 à 4 tambours décimaux.' },
      camera: { eyebrow: 'Étape 4', title: 'Réglages de la caméra', body: 'Règle la luminosité, le gain et le rapport cyclique PWM des LED pour un éclairage uniforme. Tu peux zoomer et te déplacer dans l’image pour la regarder de plus près, et l’image s’assombrit ou s’éclaircit à mesure que les réglages changent.' },
      roi: { eyebrow: 'Étape 5', title: 'Affinage de la ROI', body: 'WindowNet génère une ROI automatiquement, et les commandes te permettent de l’affiner, avec zoom et déplacement pour la voir plus en détail.' },
      read: { eyebrow: 'Étape 6', title: 'Lecture test', body: 'Une lecture test est faite avec la ROI réglée plus tôt et affiche sa confiance, que tu peux inspecter chiffre par chiffre en appuyant sur (D).' },
      radio: { eyebrow: 'Étape 7', title: 'Test de connexion LoRa', body: 'Un test de connexion vérifie que le lecteur arrive à joindre la passerelle LoRaWAN, et déplier le menu (i) affiche plus d’informations.' },
      review: { eyebrow: 'Étape 8', title: 'Vérifier et enregistrer', body: 'Vérifie les réglages qui seront enregistrés sur le lecteur. Une fois qu’ils sont enregistrés, le lecteur passe en mode de déploiement standard et la liaison BLE se coupe.' },
      done: { eyebrow: 'Configuration terminée', title: 'Le lecteur s’endort et commence à lire', body: 'Le message de fin affiche la minuterie de sommeil du lecteur, et à partir de là le lecteur se réveille à son propre intervalle, fait un relevé, l’envoie et se rendort.' },
      connected: { eyebrow: 'Un lecteur configuré', title: 'Read, Configure, More', body: 'Un lecteur déjà configuré a droit à Read, Configure et More au lieu de l’assistant. Configure ouvre une catégorie de réglages à la fois, avec un choix explicite d’enregistrer ou d’annuler, et More regroupe le test radio, les infos du lecteur, About et une réinitialisation d’usine qui demande confirmation.' },
    },
    free: {
      eyebrow: 'Essaie', title: 'Configure un lecteur toi-même',
      body: <p>Ce sont les mêmes écrans, les mêmes touches et le même assistant que sur le vrai, qui parlent à un lecteur simulé. Tu peux appuyer sur les touches du Cardputer, toucher son écran ou taper sur ton propre clavier, et un lecteur va apparaître à proximité dans un instant.</p>,
    },
  },

  /* ── Chapitre IV : MeterSim ── */
  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['Un compteur simulé', 'Conçu pour les agents', 'Modèles et préréglages', 'Tambours à mi-course', 'Météo et surfaces', 'Évaluation sans surveillance'],
      lede: 'MeterSim dessine un compteur d’eau sur une tablette, pour qu’une vraie caméra puisse collecter des relevés étiquetés sans que personne ne surveille.',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: 'Un compteur simulé pour une vraie caméra',
        body: <p>La première version de MeterSim a été construite en même temps que le firmware du Prototype V0.5, et les deux fonctionnent ensemble, si bien que MeterSim peut piloter le Prototype V0.5 automatiquement et générer des images étiquetées pour entraîner le modèle. Claude a écrit tout le logiciel et tout le firmware.</p>,
        alt: 'Le Prototype V0.5, un ESP32-EYE, pointé vers une tablette qui affiche l’écran de MeterSim',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: 'Conçu pour être utilisé par des agents',
        body: <p>MeterSim est fait pour être utilisé par des agents IA plutôt que par des humains, donc son panneau de contrôle sert surtout aux humains à suivre les progrès des agents. Les agents se sont servis de MeterSim pour construire des tests, collecter des données et vérifier la précision pendant qu’ils créaient DrumNet. Il se charge de la tâche la plus fastidieuse du machine learning, rassembler de bonnes données d’entraînement, en générant ces données, et comme le compteur est simulé, chaque image arrive déjà étiquetée.</p>,
        alt: 'L’interface de contrôle de MeterSim, avec des curseurs pour le relevé, les tambours, la surface et les effets météo',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: 'Neuf modèles de compteur et neuf préréglages',
        body: (
          <>
            <p>MeterSim propose 9 modèles de compteur, et chacun peut être configuré avec une disposition de tambours différente, par exemple 7 tambours entiers et 1 tambour décimal (7+1). Les tambours entiers sont en général blancs ou noirs, et les tambours décimaux rouges.</p>
            <p>Les combinaisons de conditions courantes sont enregistrées en préréglages : propre, midi, reflet sur les chiffres, demi-ombre, ombre douce, crépuscule, à l’ombre, incliné et sale.</p>
          </>
        ),
        alt: [
          'Les neuf modèles de compteur de MeterSim : Itron Weg 50, Elster en laiton, Itron Multimag Cyble, Bonega S/13 et T/13, Istameter II, un modèle industriel générique, B Meters bleu et un Elster en laiton propre',
          'Neuf conditions préréglées : propre, midi, reflet sur les chiffres, demi-ombre, ombre douce, crépuscule, à l’ombre, incliné et sale',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: 'Tambours à mi-course',
        body: <p>Il simule aussi des tambours à mi-course, pour que le modèle apprenne à lire un tambour arrêté entre deux chiffres, et l’agent les règle automatiquement pendant qu’il collecte les données d’entraînement.</p>,
        alt: 'Le réglage de rotation de MeterSim, qui fait glisser chaque tambour entre deux chiffres',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: 'Météo et état de surface',
        body: <p>MeterSim simule aussi la météo et l’état de la surface du compteur, pour reproduire l’allure d’un compteur laissé dehors aux intempéries, et le lecteur apprend ainsi à lire dans toutes ces conditions. Les réglages couvrent les reflets, les traces, l’ombre, l’éclairage, le flou, le bruit du capteur, le brouillard, la saleté et la mise à l’échelle.</p>,
        alt: 'Les curseurs d’effets de surface et de météo de MeterSim, chacun avec une miniature d’aperçu',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: 'Évaluation et collecte de données sans surveillance',
        body: (
          <>
            <p>MeterSim est une appli web auto-hébergée avec deux points d’accès, le panneau de contrôle sur /control et l’affichage sur /display. Le lecteur rejoint le même réseau Wi-Fi local que MeterSim, qui lui sert à envoyer ses relevés et ses images et à recevoir des commandes.</p>
            <p>Pour évaluer un modèle, MeterSim génère un compteur et des conditions au hasard et les montre au lecteur, qui prend une image et la lit avec le réseau entraîné. Le résultat revient à MeterSim, qui connaît la valeur simulée et la compare à la prédiction, et quand un agent répète ça de nombreuses fois sans que personne ne surveille, on obtient une précision approximative du modèle. La collecte de données étiquetées marche de la même façon, sauf que les images du lecteur sont enregistrées sur le disque avec leurs étiquettes en JSON, prêtes pour l’entraînement.</p>
          </>
        ),
        alt: [
          'Une tablette qui affiche l’écran de MeterSim à côté d’un portable avec le panneau de contrôle, et le lecteur ESP32-EYE pointé vers la tablette',
          'Le lecteur ESP32-EYE posé sur une bouteille et pointé vers l’écran de MeterSim, dans une salle de classe',
        ],
      },
    },
  },

  /* ── Chapitre V : SimGen2 ── */
  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['Six étapes', 'Le réel sur le synthétique', 'Compare toi-même'],
      lede: 'SimGen2 crée des captures synthétiques qui ont l’air prises par la caméra du lecteur elle-même, en environ 2 s chacune, presque 5× plus vite qu’une vraie capture.',
    },
    page: 'SimGen2',
    stages: [
      ['Capture d’écran', 'l’écran de MeterSim, 1920 × 1080'], ['Déformation', 'pose et objectif, en 1600 × 1200'], ['Flou de champ', '1,2 à 2,2 px'], ['Gain, courbe, vignettage', 'la réponse du capteur'], ['Bruit du capteur', 'du grain là où la vraie caméra en a'], ['JPEG OV2640', 'qualité 6, comme le lecteur compresse'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: 'Simuler la caméra elle-même',
        body: (
          <>
            <p>Même avec toute cette automatisation, il restait un gros goulot d’étranglement, parce que capturer une image sur le lecteur et l’envoyer à MeterSim prend presque 10 s, ce qui fait des heures et des heures sur des milliers d’images. Le prochain objectif était donc de simuler la caméra du lecteur elle-même, et ce système, c’est SimGen2. Il met l’image à l’échelle, puis applique des filtres et des déformations pour qu’elle ressemble à une image prise avec la caméra du lecteur.</p>
            <p>SimGen2 a été entièrement développé par ChatGPT Astra 6 d’OpenAI, qui s’est servi d’environ 4 000 vraies images du lecteur pour mettre au point les filtres.</p>
          </>
        ),
        alt: 'Les six étapes de traitement de SimGen2, de la capture d’écran à la sortie déformée, floutée, retouchée, bruitée et compressée en JPEG, avec la bande des chiffres à chaque étape',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: 'Le réel sur le synthétique',
        body: <p>SimGen2 génère une image en environ 2 s, presque 5× plus vite qu’une capture avec le vrai lecteur, et en tournant à côté du lecteur il a produit des dizaines de milliers d’images étiquetées uniques pour entraîner le modèle DrumNet Simulated. Ici, une vraie capture teintée en magenta est posée sur sa version SimGen2 teintée en vert, donc l’image reste sans couleur partout où les deux correspondent, et le reflet des LED dans la vraie capture est la plus grosse différence qui reste.</p>,
        alt: 'Une vraie capture teintée en magenta posée sur sa version synthétique SimGen2 teintée en vert ; là où elles correspondent, l’image est sans couleur',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: 'Compare toi-même',
        body: <p>Voici vingt et une vraies captures et leurs versions SimGen2 sur six modèles de compteur, découpées dans les planches du rapport. Fais glisser le séparateur pour les comparer, avec la vraie capture à gauche et SimGen2 à droite. La bande des chiffres est affichée en plus grand, parce que c’est la partie que lit DrumNet.</p>,
      },
    },
    compare: {
      realStrip: 'Vraie capture de la bande des chiffres du {meter}',
      simStrip: 'La même bande telle que SimGen2 l’a générée',
      realMeter: 'Vraie capture du compteur {meter}',
      simMeter: 'Le même compteur tel que SimGen2 l’a généré',
      real: 'réel',
      sim: 'SimGen2',
      divider: 'Séparateur entre la vraie capture à gauche et SimGen2 à droite',
      pairs: 'Paires',
    },
  },

  /* ── Chapitre VI : les agents ── */
  agents: {
    cover: {
      title: 'Workflow agentique', lines: ['Workflow', 'agentique'],
      contents: ['La boucle', 'Six agents', 'Ressources et planificateur', 'Géré avec T3 Code'],
      lede: 'Six agents ont entraîné et testé les lecteurs en même temps, en partageant un seul planificateur pour la puissance de calcul et le banc de test.',
    },
    page: 'Workflow agentique',
    rows: {
      'ag-loop': {
        eyebrow: 'Workflow agentique', title: 'La boucle d’auto-amélioration',
        body: <p>J’ai beaucoup utilisé des agents IA basés sur des LLM dans ce projet, et leur mission était d’améliorer tout le pipeline de vision qui tourne sur l’ESP32-S3, en visant 99 % de précision sur le compteur. Chaque agent travaillait en boucle : il formulait une hypothèse, planifiait comment la mettre en œuvre, rassemblait des données d’entraînement, réentraînait le modèle, l’affinait ou l’entraînait par RL, testait s’il y avait une amélioration ou une régression, puis présentait ses résultats et recommençait.</p>,
      },
      'ag-six': {
        eyebrow: 'Workflow agentique', title: 'Six agents, dont trois sur DrumNet',
        body: (
          <>
            <p>Trois agents faisaient tourner cette boucle, chacun sur sa propre variante de DrumNet, pendant que trois autres agents s’occupaient d’autres tâches. Après environ 1,5 semaine, Standard et Premade donnaient toujours de mauvais résultats, donc leur développement a été arrêté et toutes leurs ressources sont allées à DrumNet Simulated.</p>
            <p>DrumNet Simulated a ensuite eu le droit de s’entraîner sur tous les jeux de données, y compris ceux du banc et du catalogue externe, et il a été renommé DrumNet. La version actuelle, V10, est le réseau le plus performant de la série DrumNet.</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: 'Workflow agentique', title: 'Des ressources partagées et un planificateur',
        body: (
          <>
            <p>Avec six agents en même temps, ils se disputaient sans arrêt les ressources, alors j’ai développé un planificateur qui leur permet de réserver des créneaux sur les ressources partagées. L’une, c’est la puissance de calcul pour l’entraînement, soit le CPU de mon serveur et le GPU de mon portable, et l’autre, c’est le banc Jetson, où un agent peut flasher le Prototype V1 et travailler avec, tout en pilotant, via MeterSim, l’écran vers lequel le prototype est pointé.</p>
            <p className="ws-note">Sur la chronologie de calcul du planificateur, la zone remplie montre les threads réservés par rapport au budget de 20 threads et la ligne rouge la mémoire réservée par rapport au budget de 9 Go, tandis que le GPU du portable prend une tâche à la fois.</p>
          </>
        ),
        alt: [
          'Un croquis des trois agents DrumNet qui partagent le banc Jetson et la puissance de calcul via deux planificateurs, avec le coordinateur, Sim2 Genius et le modèle de détection de fenêtre à côté',
          'La chronologie du planificateur pour les ressources de calcul, avec les blocs réservés par agent et la charge réservée par rapport au budget',
        ],
      },
      'ag-t3': {
        eyebrow: 'Workflow agentique', title: 'Géré avec T3 Code',
        body: (
          <>
            <p>Les agents tournaient 24 h/24, 7 j/7 grâce à un « heartbeat », un simple script qui réveille un agent après un intervalle donné ou à une heure fixe pour qu’il continue à travailler. On leur avait dit d’agir de façon autonome et de prendre leurs propres décisions, donc il a fallu très peu d’intervention humaine.</p>
            <p>Le réseau passait par Tailscale, un VPN personnel en pair-à-pair, qui permettait aux agents sur mon serveur à la maison de joindre et de piloter le banc Jetson à l’école en SSH. Les agents eux-mêmes étaient gérés dans T3 Code, un méta-harness open source pour Claude Code et Codex.</p>
          </>
        ),
        alt: 'Schéma de T3 Code qui relie l’appareil client, le serveur à la maison qui fait tourner les agents, le GPU du portable et le banc Jetson à l’école via Tailscale',
      },
    },
    loop: {
      steps: ['Hypothèse', 'Planification de l’exécution', 'Réunir les données d’entraînement', 'Réentraîner, affiner ou RL du modèle', 'Tester le progrès ou la régression', 'Rapport des résultats, puis nouvelle hypothèse'],
      lines: [['Hypothèse'], ['Planification', 'de l’exécution'], ['Réunir les données', 'd’entraînement'], ['Réentraîner, affiner', 'ou RL du modèle'], ['Tester le progrès', 'ou la régression'], ['Rapport des résultats,', 'puis nouvelle hypothèse']],
      aria: 'La boucle des agents : {steps}, et on recommence.',
      target: 'CIBLE',
      accuracy: 'de précision',
    },
    badges: {
      model: 'Modèle', job: 'Rôle', data: 'Données', won: 'est devenu DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: 'Le puriste', model: 'Fable 5.1, puis Opus 5.5', job: 'Lit les tambours', data: 'Seulement des images prises par le Prototype V1, à partir du DrumNet V1 de base', fate: 'Arrêté après 1,5 semaine' },
        simulated: { name: 'DrumNet Simulated', persona: 'Le rêveur', model: 'Fable 5.1, puis Opus 5.5', job: 'Lit les tambours', data: 'Seulement des images SimGen2, entièrement générées par ordinateur, à partir du DrumNet V1 de base', fate: 'Renommé DrumNet, aujourd’hui en V10' },
        premade: { name: 'DrumNet Premade', persona: 'Le collectionneur', model: 'Fable 5.1, puis Opus 5.5', job: 'Lit les tambours', data: 'Tous les jeux de données : Prototype V1, SimGen2, Badger55, Jomjol-digits, à partir du modèle dig-cont', fate: 'Arrêté après 1,5 semaine' },
        windownet: { name: 'WindowNet', persona: 'Le guetteur', model: 'Opus 5.5', job: 'Trouve la fenêtre', data: 'Entraîne le détecteur (DetNet) et l’affineur (RefNet) qui localisent la fenêtre des tambours', fate: 'Toujours le maillon faible, d’où partent la plupart des mauvais relevés' },
        sim2: { name: 'Sim 2 Genius', persona: 'Le machiniste', model: 'Opus 5.5', job: 'Gère le simulateur', data: 'Utilise, entretient et améliore SimGen2 pour les autres', fate: 'Fait arriver les images synthétiques sans arrêt' },
        coordinator: { name: 'OCR Coordinator', persona: 'Le contremaître', model: 'Fable 5.1', job: 'Dirige le projet', data: 'Parle à tous les autres agents, réserve leur temps, tient le plan', fate: 'A tout réattribué à Simulated quand les autres ont calé' },
      },
    },
  },

  /* ── Chapitre VII : firmware ── */
  firmware: {
    cover: {
      title: 'Firmware', lines: ['Firmware', 'du lecteur'],
      contents: ['Écrit par un agent', 'Un cycle de réveil', 'Le tableau de bord'],
      lede: 'En un cycle de réveil, le lecteur se réveille, capture le compteur, lit les tambours, envoie le nombre à la maison et se rendort.',
    },
    page: 'Firmware',
    chartAria: 'Déroulé du firmware du lecteur sur un cycle de réveil',
    success: 'succès',
    fail: 'échec',
    nextCycle: 'CYCLE SUIVANT',
    nodes: {
      wake: { title: 'Réveil par la RTC', sub: 'état restauré, périphériques initialisés', time: '~0,2 s' },
      capture: { title: 'Capture d’image', sub: 'image capturée avec les LED allumées', time: '~0,5 s' },
      low: { title: 'Lecture basse conso', sub: 'lecteurs DrumNet seuls, ROI stockée, sans WindowNet', time: '~0,5 à 3 s' },
      uplink: { title: 'Envoi LoRaWAN', sub: 'relevé envoyé à la passerelle', time: '~0,3 s' },
      sleep: { title: 'Sommeil', sub: 'tous les périphériques coupés' },
      full: { title: 'Pipeline DrumNet complet', sub: 'relancé avec WindowNet en secours' },
      check: { title: 'Test de confiance', sub: 'le nouveau relevé est-il assez sûr ?' },
      alt: { title: 'Essai avec un autre détecteur', sub: 'un autre jeu de poids de secours' },
      reject: { title: 'Relevé rejeté', sub: 'gardé en NVS pour analyse, alerte au tableau de bord' },
    },
    steps: {
      wake: 'Le lecteur sort du sommeil et restaure sa configuration et sa session LoRaWAN depuis la mémoire non volatile.',
      capture: 'La caméra est initialisée et une capture est prise avec les LED allumées.',
      low: 'L’image passe directement par les lecteurs DrumNet avec la ROI enregistrée à la configuration, sans WindowNet. C’est le chemin normal et le moins coûteux, et un relevé sûr part vers l’envoi après environ 1,5 s d’éveil en tout.',
      full: 'C’est seulement si les lecteurs annoncent une faible confiance que le pipeline complet tourne en secours, avec WindowNet qui retrouve la fenêtre.',
      check: 'La confiance du nouveau relevé est vérifiée, et la plupart des relevés sortent de la boucle ici.',
      alt: 'Le détecteur tourne une fois de plus avec un autre jeu de poids de secours, comme dernière tentative de ce cycle.',
      reject: 'Une tentative ratée est enregistrée en NVS pour être évaluée plus tard, et une alerte de faible confiance s’affiche sur le tableau de bord.',
      uplink: 'La liaison LoRa s’allume et le relevé est envoyé à la passerelle.',
      sleep: 'Tous les périphériques s’éteignent et le lecteur passe en sommeil profond jusqu’à ce que la RTC le réveille pour le cycle suivant, mais un appui sur BOOT le réveille pour la configuration.',
    },
    rows: {
      'fw-agents': {
        eyebrow: 'Firmware', title: 'Écrit par un agent, sur du vrai matériel',
        body: (
          <>
            <p>Un agent Astra 6 a été chargé d’écrire le firmware du lecteur (Prototype V2) et du M5Stack Cardputer Adv, qui fait tourner ConfigKing, la console de configuration qui permet aux ingénieurs sur site de configurer les lecteurs pour le déploiement et de les reconfigurer plus tard. On a demandé à l’agent de n’écrire du code qu’avec Fable 5.1.</p>
            <p className="ws-note">Mon portable, la passerelle LoRaWAN (gentiment fournie par M. Lee Chang Fatt) et le Jetson Nano étaient sur le même réseau, le Cardputer et le Prototype V2 étaient branchés au portable en série USB, et les quatre appareils étaient mis à disposition des agents.</p>
          </>
        ),
        alt: 'Le montage de développement du firmware : le portable, le Jetson Nano, la passerelle LoRaWAN, le lecteur Prototype V2 et le Cardputer, avec les agents qui y accèdent par le réseau',
      },
      'fw-cycle': { eyebrow: 'Un cycle de réveil', title: 'Neuf étapes, mais la plupart des relevés n’en font que cinq' },
      'fw-dashboard': {
        eyebrow: 'Tableau de bord', title: 'Là où s’affiche le relevé',
        body: <p>Une fois le relevé fait, il est envoyé à la passerelle LoRaWAN, qui le transmet en MQTT au Jetson Nano, où il est stocké. Le Jetson sert le tableau de bord sous la forme d’un seul fichier HTML dont le JavaScript met à jour les valeurs à partir des données stockées, mais ce tableau de bord n’est qu’une démo et il n’est pas conçu pour suivre de vrais déploiements à grande échelle.</p>,
        alt: 'Le tableau de bord de suivi des lecteurs : une carte de lecteur de banc qui affiche 0092.07 mètres cubes avec une pastille de faible confiance, des graphiques d’historique et un tableau de neuf relevés',
      },
    },
  },

  /* ── Chapitre VIII : énergie ── */
  power: {
    cover: {
      title: 'Économie d’énergie', lines: ['Économiser', 'l’énergie'],
      contents: ['Sous-échantillonnage', 'Modes de capture côte à côte', 'Gradation PWM', 'Niveaux de gris', 'INT8 et calcul vectoriel', 'Matériel'],
      lede: 'Chaque étape du cycle de réveil a été allégée pour viser 2 ans d’autonomie, avec des captures plus petites, une lumière plus douce et des calculs en entiers.',
    },
    page: 'Économie d’énergie',
    modes: [
      { time: 'capture en 350 ms', note: 'chaque pixel du capteur' },
      { time: 'capture en 89 ms', note: 'SVGA, le mode choisi' },
      { time: 'capture en 61 ms', note: 'CIF, trop peu de pixels par tambour' },
    ],
    modeAlt: 'Capture du compteur en {res}',
    drumsAria: 'les tambours en {res}',
    int8: [
      { value: '61 s', label: 'Float32', note: 'de la capture à la prédiction, avant quantification' },
      { value: '17 s', label: 'INT8 + ESP-NN', note: 'environ 3,6× plus rapide' },
    ],
    hardware: [
      { name: 'Buck-boost TPS63900', note: '~75 nA au repos, tient 3,3 V quelle que soit l’entrée, prévu pour le Li-SOCl2' },
      { name: 'LDO à faible Iq', note: '1,5 V et 2,8 V pour la caméra, sans artefacts de découpage' },
      { name: 'Timer Ambiq AM1805', note: 'coupe tout et rallume tout selon un horaire' },
      { name: 'LoRaWAN', note: 'basse conso, longue portée, un standard ouvert que l’exploitant peut gérer' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: 'Économie d’énergie · logiciel', title: 'Sous-échantillonnage dans la caméra',
        body: (
          <>
            <p>Le lecteur doit tenir jusqu’à 2 ans sur un seul jeu de piles. L’ESP32-S3 est plutôt efficace pour les gros calculs comme les maths vectorielles dont un réseau de neurones a besoin, mais il est loin d’être aussi efficace que la gamme nRF de Nordic, donc j’ai utilisé les stratégies de ce chapitre pour réduire sa consommation. Ses radios sans fil ne servent qu’à la configuration initiale, donc elles sont coupées en déploiement.</p>
            <p>L’OV2640 capture jusqu’en 1600 × 1200, et il a aussi des modes de sous-échantillonnage en 800 × 600 (SVGA) et en 400 × 296 (CIF).</p>
          </>
        ),
        alt: ['Schéma du mode de sous-échantillonnage SVGA de l’OV2640, qui montre les pixels sautés', 'Schéma du mode de sous-échantillonnage CIF de l’OV2640'],
      },
      'pw-modes': {
        eyebrow: 'Modes de capture côte à côte', title: 'SVGA, le mode choisi, en 89 ms',
        body: (
          <>
            <p>Voici le même compteur aux trois résolutions, avec l’image entière en haut et les tambours en bas au même grossissement. En 1600 × 1200, chaque pixel du capteur est lu et la capture prend 350 ms, ce qui compte, parce que moins la caméra reste allumée, moins elle consomme. En 400 × 296, la capture ne prend que 61 ms, mais il reste trop peu de pixels aux tambours pour les lire de façon fiable.</p>
            <p>Dans mes tests, le SVGA donnait le meilleur équilibre entre qualité et vitesse, et en 800 × 600 le réseau traite 4× moins d’informations qu’en 1600 × 1200. Je n’ai pas fait de vrais tests pour confirmer la précision, mais d’après mon expérience, elle n’en a pas beaucoup souffert.</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: 'Économie d’énergie · logiciel', title: 'Gradation PWM des LED',
        body: <p>Au début, j’ai écarté la gradation PWM parce que l’OV2640 a un obturateur roulant, qui pourrait capturer pendant les phases éteintes du signal PWM et faire apparaître des bandes. En pratique, l’OV2640 n’a montré aucune bande, donc je fais tourner les LED à 20 kHz avec un rapport cyclique de 50 %, ce qui économise un peu d’énergie et ajoute un réglage de luminosité.</p>,
        alt: ['Une capture avec des bandes horizontales sur le cadran du compteur', 'Une capture avec les LED en gradation PWM, sans bandes'],
      },
      'pw-grey': {
        eyebrow: 'Économie d’énergie · logiciel', title: 'Niveaux de gris dans la caméra',
        body: <p>L’OV2640 convertit l’image en niveaux de gris directement dans la caméra et renvoie un fichier un peu plus petit, et même si le gain est minime, voire nul, c’était facile à mettre en place.</p>,
        alt: ['Le compteur capturé en niveaux de gris par la caméra', 'Le même compteur capturé en couleur'],
      },
      'pw-int8': {
        eyebrow: 'Économie d’énergie · logiciel', title: 'Instructions vectorielles et INT8',
        body: <p>Les premières versions de DrumNet tournaient en Float32 pleine précision sur l’ESP32-S3, ce qui était lent et peu efficace. L’ESP32-S3 a des instructions vectorielles intégrées, utilisées via la bibliothèque ESP-NN, qui effectuent plusieurs opérations de multiplication-accumulation (MAC) par cycle d’horloge, et une fois DrumNet quantifié sur 8 bits, le temps entre la capture et la prédiction est passé de 61 s à 17 s, environ 3,6× plus vite. Je n’ai pas vraiment mesuré le gain d’efficacité, mais je suis sûr qu’elle s’est beaucoup améliorée aussi.</p>,
      },
      'pw-hw': {
        eyebrow: 'Économie d’énergie · matériel', title: 'Convertisseurs à faible Iq, un timer et LoRaWAN',
        body: (
          <ul>
            <li><b>Convertisseurs DC-DC à faible Iq et haut rendement.</b> L’OV2640 a besoin de 1,5 V et de 2,8 V. Les convertisseurs buck ont un meilleur rendement que les LDO, mais leur courant de repos élevé et leur conception plus complexe ajoutent du coût et de la place sur la carte pour presque aucun gain, et ils peuvent introduire des artefacts dans l’image, donc je suis resté sur des LDO à faible courant de repos. Le rail principal de 3,3 V passerait sur un convertisseur buck-boost spécial à faible Iq (~75 nA), le TI TPS63900.</li>
            <li><b>Circuits timer ultra basse consommation.</b> Un circuit timer comme l’Ambiq AM1805 peut couper tous les composants et les rallumer selon un horaire, même si le gain serait sans doute minime.</li>
            <li><b>LoRaWAN.</b> J’ai choisi LoRaWAN pour sa faible consommation et sa longue portée, et parce que c’est un standard ouvert, donc contrairement à Sigfox et NB-IoT, l’exploitant peut posséder et gérer tout le réseau.</li>
          </ul>
        ),
      },
    },
  },

  /* ── Chapitre IX : caméra ── */
  camera: {
    cover: {
      title: 'Choix de caméra', lines: ['Choix de', 'caméra'],
      contents: ['Deux objectifs OV2640', 'Le test de mise au point'],
      lede: 'J’ai testé deux objectifs OV2640 face à des mires de mise au point à 3, 4 et 6 cm.',
    },
    page: 'Choix de caméra',
    lab: {
      lenses: { '160': 'Objectif 160°', '120': 'Objectif 120°' },
      charts: { b: 'Mire B (ISO 12233)', a: 'Mire A (dessinée)' },
      cm: '{d} cm',
      lens: 'Objectif',
      distance: 'Distance',
      chart: 'Mire',
      alt: 'Objectif {lens}°, mire {chart} à {dist} cm, image entière',
      caption: 'image entière · {lens}° · {dist} cm',
      chosen: ' · le réglage choisi',
      parts: { centre: 'centre', left: 'gauche', right: 'droite' },
      cropAria: 'recadrage {part}',
      notInFrame: 'Hors champ',
      notes: {
        '160': 'La variante 160° fait bien la mise au point sur les objets proches, mais sa netteté semble baisser du centre vers la gauche de l’image, et l’effet est loin d’être aussi fort vers la droite.',
        '120': 'La variante 120° n’arrive clairement pas à faire la mise au point sur les objets proches (macro), et sa netteté baisse régulièrement en cône, comme on s’y attend avec un objectif à mise au point fixe.',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: 'Choix de caméra', title: 'Une caméra macro, assez large pour les tambours',
        body: (
          <>
            <p>Il me fallait une bonne caméra macro, assez large pour capturer toute la largeur des tambours du compteur de très près. Aucun revendeur sérieux n’avait une option à la fois peu chère et avec le bon connecteur, donc j’ai acheté deux caméras OV2640 sur Lazada, une avec un objectif de 160° de champ de vision et une avec un objectif de 120°. Elles n’étaient pas vendues comme caméras macro, mais les objectifs grand angle ont naturellement une distance de mise au point très courte et une profondeur de champ apparente bien plus grande.</p>
            <p>Pour le test, j’ai pris une image avec chaque caméra à 3 cm, 4 cm et 6 cm devant deux mires de mise au point. La mire A, je l’ai dessinée à la main, et la mire B est la mire ISO 12233 de Stephen H. Westin, de Cornell. Chaque caméra tournait sur une carte ESP32-S3 cam de rechange avec une petite applet web écrite avec un agent IA, et elle était fixée sur le côté d’une boîte, avec une règle qui partait de l’objectif, pendant que les mires étaient posées sur un support mobile.</p>
          </>
        ),
        alt: 'La boîte du test de mise au point, avec la carte ESP32 cam sur le côté et une règle au sol',
      },
      'cam-lab': {
        eyebrow: 'Le test de mise au point', title: 'Le réglage choisi, 160° à 4 cm',
        body: (
          <>
            <p>Choisis un objectif, une distance et une mire pour voir la capture entière, avec son centre, sa gauche et sa droite découpés dans la même image en pixels réels. Ce sont des objectifs à mise au point fixe, réglée une fois pour toutes en usine, et à partir d’ici j’utilise la variante 160° à 4 cm.</p>
            <p className="ws-note">La mire était bien face à la caméra, sans inclinaison ni bosse notable, et la variante 120° perd sa netteté de façon régulière, donc la mise au point déséquilibrée de la variante 160° fait penser à un défaut de fabrication, même si je n’ai pas de caméra de rechange pour le vérifier.</p>
          </>
        ),
      },
    },
  },

  /* ── Chapitre X : Prototype V2 et boîtier ── */
  proto: {
    cover: {
      title: 'Prototype V2', lines: ['Prototype', 'V2'],
      contents: ['Un Prototype V1 miniaturisé', 'La taille d’une carte de dev', 'Le boîtier et l’adaptateur'],
      lede: 'Le Prototype V2, c’est le Prototype V1 réduit à la taille d’une carte de développement, dans un boîtier en deux parties qui se monte sans outils.',
    },
    page: 'Prototype V2',
    enclosurePage: 'Boîtier',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototype V2', title: 'Un Prototype V1 miniaturisé',
        body: <p>Le Prototype V2 est une version miniaturisée du Prototype V1, qui tient dans des espaces plus étroits et m’a permis d’essayer des composants plus petits, comme le module LoRa Wio-SX1262 de Seeed Studio. Il intègre la gestion de la batterie, l’alimentation de la caméra et du ventilateur, des LED à gradation PWM et un module LoRa. J’ai conçu la carte à 4 couches dans KiCad, commandé les composants chez DigiKey et fait fabriquer la carte par JLCPCB, et les circuits sont dans le rapport.</p>,
        alt: 'Rendu 3D du dessus de la carte du Prototype V2 dans KiCad',
      },
      'v2-size': {
        eyebrow: 'Prototype V2', title: 'La taille d’une carte de dev',
        body: (
          <>
            <p>J’ai conçu le PCB pour qu’il fasse à peu près la taille d’une carte de développement ESP32-S3 classique, afin qu’il tienne dans un boîtier plus petit, adapté aux compteurs installés dans des espaces étroits.</p>
            <p className="ws-note">Le Prototype V2 a été fabriqué avant que j’écrive le rapport, donc il garde quelques choix que j’ai abandonnés depuis. Le ventilateur était prévu pour la forte humidité, qui peut provoquer de la buée, mais il sera plutôt retiré si les relevés ne sont pas fiables, et l’alimentation a été conçue avant que je décide d’utiliser des piles Li-SOCl2.</p>
          </>
        ),
        alt: 'Le PCB du Prototype V2 posé à côté d’une carte de développement ESP32-S3 presque de la même taille',
      },
      'en-all': {
        eyebrow: 'Boîtier', title: 'Un boîtier sans outils et un adaptateur en deux parties',
        body: (
          <>
            <p>Le boîtier intérieur accueille le PCB et les piles du Prototype V2. J’ai exporté le fichier 3D de KiCad vers Onshape comme référence, modélisé la caméra à la main pour plus de précision, et conçu le boîtier pour qu’il se monte sans outils : des clips latéraux emboîtent les deux moitiés, des rainures et des ergots les empêchent de glisser sur le côté, des plateformes et des plots tiennent le PCB sans vis, et une découpe laisse passer le câble IPEX LoRa jusqu’au transceiver. L’impression finale s’est bien ajustée et avait une belle finition, mais j’ai dû percer un trou pour la caméra, montée à l’envers à cause d’une mauvaise disposition des broches à l’étape d’assemblage.</p>
            <p>L’adaptateur extérieur est en deux parties. La moitié du bas se fixe contre le compteur et tient l’objectif de la caméra à environ 4 cm du cadran, la distance de mise au point choisie lors du test de la caméra, tandis que la moitié du haut, bien plus large, laisse de la place pour aligner le lecteur sur les tambours et me permet de le réutiliser sur d’autres compteurs en ne redessinant que la moitié du bas. J’avais oublié les languettes qui verrouillent le couvercle du compteur, alors je leur ai fait de la place avec quelques coups de pince coupante.</p>
          </>
        ),
        figures: [
          { alt: 'Le modèle 3D KiCad de la carte avec la caméra modélisée dessus, utilisé comme référence dans Onshape', caption: 'l’export KiCad utilisé comme référence dans Onshape' },
          { alt: 'Le boîtier intérieur imprimé final, avec la carte dedans', caption: 'le boîtier intérieur imprimé' },
          { alt: 'Une coupe CAO de l’adaptateur qui montre la caméra à environ 4 cm de la face du compteur', caption: 'une coupe de l’adaptateur, à 4 cm du cadran' },
          { alt: 'L’adaptateur terminé, monté sur le compteur', caption: 'l’adaptateur monté sur le compteur' },
        ],
      },
    },
  },

  /* ── Chapitre XI : conclusion ── */
  conclusion: {
    cover: {
      title: 'Conclusion', lines: ['Conclusion'],
      contents: ['Où en est le projet', 'Le rapport'],
      lede: 'Le lecteur réussit 56 % des relevés pour un objectif de 99 %, et ce chapitre parle de ce qu’il faudrait pour combler l’écart.',
    },
    page: 'Conclusion',
    row: {
      eyebrow: 'Conclusion', title: 'Où en est le projet',
      body: (
        <>
          <p>Faute de temps, le projet s’arrête là où il en est, et beaucoup de problèmes restent à régler avant qu’il puisse devenir une solution viable. Je n’ai pas mesuré sa consommation d’énergie ni vérifié les 2 ans d’autonomie visés, et je ne pense pas que le Prototype V2 puisse les atteindre en l’état, donc il faut une troisième révision avec des composants plus économes avant que ça vaille la peine de suivre la consommation. Le firmware, lui, est proche de l’efficacité que je visais.</p>
          <p>DrumNet V10 lit correctement 56 % des relevés, bien loin de l’objectif de 99 %. Le principal goulot d’étranglement, c’est WindowNet, parce que la plupart des mauvais relevés venaient du fait qu’il ne trouvait pas la bonne ROI. Les lecteurs montrent aussi des signes de sous-entraînement, et un compteur qu’ils n’ont jamais vu donne une faible confiance, parce que le jeu de données était dominé par les 9 compteurs que SimGen2 savait générer, donc un jeu de données plus grand et plus varié pourrait aider sur les deux points. La coque est bien trop encombrante pour un vrai déploiement, surtout à cause de la hauteur de la caméra, donc il me faut une caméra moins haute et meilleure en macro, et l’étanchéité demandera d’autres matériaux et d’autres designs.</p>
          <p className="ws-note">Une bonne partie de ce projet, c’était ma première tentative de quelque chose de nouveau, et même si je ne suis pas vraiment satisfait du résultat, je suis fier des connaissances et de l’expérience que j’ai acquises, et reconnaissant d’avoir eu la chance rare d’avoir du temps, des ressources et du soutien pour apprendre et expérimenter à ma façon. Merci à M. Alex Oh (NYP) pour ses conseils, son expertise et ses encouragements, à M. Soh (NYP), sans qui je n’aurais pas réussi à faire marcher la caméra, et à M. Lee Chang Fatt (NYP) pour la passerelle LoRaWAN.</p>
        </>
      ),
    },
    figures: [
      { value: '56 %', label: 'pipeline complet', note: '808 relevés justes sur 1 440' },
      { value: '99 %', label: 'l’objectif', note: 'le relevé entier juste' },
      { value: '93,2 %', label: 'DrumNet seul', note: 'jeu de test combiné, sans WindowNet' },
      { value: '2 ans', label: 'l’autonomie visée', note: 'pas encore mesurée, et il faut d’abord une carte V3' },
    ],
  },

  /* ── Chapitre XII : le rapport ── */
  report: {
    title: 'Le rapport',
    frameTitle: 'Rapport OCR Water Meter Reader (PDF)',
    name: 'OCR Water Meter Reader',
    about: 'Une solution OCR par vision, peu coûteuse et basse consommation, pour lire les compteurs d’eau. Braven Chiam, génie électronique et informatique, NYP. 58 pages, PDF, 6,8 Mo.',
    open: 'Ouvrir le rapport',
    note: 'J’ai beaucoup utilisé des outils d’IA pour développer ce projet. J’ai écrit l’essentiel du rapport moi-même, avec mes propres mots, sauf l’introduction et certains graphiques, et j’ai aussi utilisé l’IA pour la recherche, la génération de graphiques et la vérification des données. Ce projet est au niveau 3 de mon échelle d’usage de l’IA.',
  },
};

export default fr;
