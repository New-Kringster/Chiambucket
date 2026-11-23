import type { BeadreaderCopy } from './en';

/* The BeadReader article in French. Same shape as en.tsx. */
const fr: BeadreaderCopy = {
  meta: {
    title: 'BeadReader | Braven Chiam',
    description: 'Un lecteur de livres privé, sur invitation uniquement, que j’ai construit avec Next.js, Supabase et Cloudflare R2, avec une connexion par code d’accès, la reprise de lecture et des thèmes propres à chaque lecteur, une présence en direct, un filtre de contenu appliqué en SQL, des webtoons et des statistiques de lecture partagées.',
    ogDescription: 'Un lecteur de livres privé, sur invitation uniquement, avec présence en direct, reprise de lecture pour chaque lecteur, un filtre de contenu appliqué en SQL, des webtoons et des statistiques de lecture partagées.',
  },
  ld: {
    headline: 'BeadReader',
    description: 'Un lecteur de livres en ligne privé, sur invitation uniquement, construit avec Next.js, Supabase et Cloudflare R2, avec une connexion par code d’accès via un cookie signé en HMAC, la reprise de lecture et des thèmes propres à chaque lecteur, une présence en direct, un filtre de contenu explicite appliqué en SQL, des webtoons et un tableau de bord de statistiques de lecture partagé.',
  },
  hero: {
    alt: 'BeadReader sur trois téléphones : l’écran de connexion, un chapitre et la page de statistiques',
    back: 'Retour aux projets',
    tag: 'Projet perso',
    title: <>Bead<em>Reader</em></>,
    lead: 'BeadReader est un lecteur de livres en ligne privé pour quelques amis, où l’admin publie des livres en Markdown ou en webtoons d’images, et où les lecteurs se connectent avec un seul code d’accès. L’appli retient où chaque lecteur s’est arrêté, et les lecteurs peuvent voir qui d’autre est en train de lire, envoyer un coucou ou un petit mot, et comparer leur progression sur un tableau de statistiques partagé.',
    builtWith: 'Fait avec',
    links: { github: 'GitHub', deploy: 'Déploie le tien' },
  },
  chapters: 'Chapitres',
  rail: {
    room: 'Accès privé', library: 'Reprise et thèmes', together: 'Lire ensemble', gate: 'Le filtre pimenté',
    books: 'Textes et webtoons', stats: 'Stats de lecture', instant: 'Hors ligne et mises à jour', stack: 'La stack',
  },
  room: {
    h: 'Accès privé',
    p: [
      'BeadReader est une bibliothèque privée pour un admin et quelques lecteurs, sans mots de passe ni inscription. À la place, un seul code d’accès sert d’identité : il décide si tu es l’admin ou un lecteur et si tu peux voir les chapitres explicites, et une fois que tu l’as entré, un cookie signé te garde connecté.',
      'L’admin crée chaque lecteur et lui donne un code, et si l’admin révoque ce code, le lecteur est déconnecté à sa requête suivante.',
    ],
    alt: 'L’écran de connexion de BeadReader avec un seul champ de code d’accès',
    caption: 'L’écran de connexion et son unique champ de code d’accès',
  },
  library: {
    h: 'Reprise et thèmes',
    p: [
      'Ouvrir un livre te ramène au chapitre et à la position de défilement où tu t’étais arrêté. La position est enregistrée comme une fraction du chapitre plutôt qu’en pixels, donc elle reste juste après un changement de taille de police, et si tu t’arrêtes au milieu d’un paragraphe sur ton téléphone, tu retombes au même endroit sur un ordinateur portable.',
      'BeadReader enregistre pour chaque lecteur sa couleur de fond et de texte, sa taille de police et son choix entre une mise en page en défilement ou en pages. La table des matières marque chaque chapitre que tu as ouvert, affiche une barre de progression sur celui en cours et te permet de marquer un chapitre comme non lu.',
    ],
    figs: [
      { alt: 'La vue de lecture avec le thème papier', caption: 'La vue de lecture avec le thème papier' },
      { alt: 'La table des matières d’un livre avec la progression de chaque lecteur', caption: 'La table des matières avec le suivi de lecture et une barre de progression' },
    ],
  },
  together: {
    h: 'Lire ensemble',
    p: [
      'Depuis la bibliothèque, tu vois qui d’autre est en ligne, et dans un livre, les avatars des lecteurs en ligne sont en haut, chacun avec un point vert. Si un ami est dans le même livre, son avatar a aussi un anneau vert et le numéro de son chapitre.',
      'Toucher les avatars te permet d’envoyer un coucou ou un petit mot, qui s’affiche sur l’écran de l’autre lecteur pendant quelques secondes et n’est jamais enregistré. Chacun peut mettre une photo de profil, recadrée et compressée dans le navigateur, et n’importe qui peut activer un mode confidentialité pour lire sans être vu.',
    ],
    alt: 'Le menu pour envoyer un coucou ou un mot',
    caption: 'Le menu pour envoyer un coucou ou un petit mot',
  },
  gate: {
    h: 'Le filtre pimenté',
    p: [
      'Certains chapitres, ou certains passages dans un chapitre, sont marqués comme explicites, et l’accès à ces passages est réglé pour chaque lecteur et appliqué dans la requête à la base de données. Un lecteur sans accès ne reçoit jamais le texte filtré, même pas caché dans la réponse, donc on ne peut pas le récupérer depuis l’API brute.',
      'Le même chapitre change selon le lecteur : avec l’accès, tu as un passage flouté qui devient net quand tu le touches, sans accès tu vois un aperçu verrouillé avec un mot pour le demander, et en mode Cal, chaque passage explicite est retiré, sans aucun marqueur ni icône de piment.',
    ],
    alt: 'Une table des matières avec un chapitre explicite marqué',
    caption: 'Une table des matières avec un chapitre explicite marqué, telle que la voit un lecteur qui a l’accès',
  },
  books: {
    h: 'Textes et webtoons',
    p: [
      'Chaque livre est soit un texte, soit un webtoon, et l’admin choisit en le créant. Les livres en texte s’écrivent en Markdown avec un aperçu côte à côte, et chaque chapitre a son propre état brouillon ou publié.',
      'Pour un webtoon, l’admin choisit un dossier d’images numérotées, vérifie leur ordre et les envoie directement depuis le navigateur vers Cloudflare R2 avec des URL signées de courte durée. Les lecteurs font ensuite défiler une seule bande verticale sans espaces, avec la même reprise, le même suivi et le même filtre qu’un livre en texte.',
    ],
    figs: [
      { alt: 'La liste des livres côté admin', caption: 'La liste des livres côté admin, avec des livres en texte et en webtoon, en brouillon et publiés' },
      { alt: 'Un chapitre de webtoon en bande verticale sans espaces', caption: 'Un chapitre de webtoon en une seule bande verticale' },
    ],
  },
  stats: {
    h: 'Stats de lecture',
    p: [
      'Les lecteurs qui partagent leur activité apparaissent sur un tableau de bord commun qui montre leur total d’heures, les livres terminés et leurs séries de lecture. Un histogramme montre à quelle heure de la journée les gens lisent, jour par jour, et toucher un lecteur ouvre le détail de son temps par livre et par chapitre.',
      'Le temps de lecture ne compte que quand tu lis vraiment, donc il se met en pause quand l’onglet perd le focus ou que tu restes inactif.',
    ],
    figs: [
      { alt: 'La vue d’ensemble des statistiques de lecture', caption: 'La vue d’ensemble des stats avec les séries de lecture' },
      { alt: 'Le détail des statistiques d’un lecteur', caption: 'Le temps d’un lecteur détaillé par livre et par chapitre' },
    ],
  },
  instant: {
    h: 'Hors ligne et mises à jour',
    p: [
      'Un service worker met en cache les couvertures, les illustrations et les fichiers statiques sur l’appareil, jamais le HTML ni les réponses de l’API, et le lecteur précharge le chapitre suivant, donc les pages s’ouvrent vite et consomment moins de données. La page Compte montre ce qui est en cache et la place que ça prend, avec un seul bouton pour tout vider.',
      'Un journal des modifications public et une fenêtre « Quoi de neuf », affichée une fois par version, expliquent les nouveautés, et une invite à rafraîchir apparaît dès qu’une version plus récente est déployée.',
    ],
    figs: [
      { alt: 'Le panneau du compte et du stockage', caption: 'La page du compte et le stockage sur l’appareil, avec un bouton pour tout vider' },
      { alt: 'Le journal des modifications dans l’appli', caption: 'Le journal des modifications dans l’appli' },
    ],
  },
  stack: {
    h: 'La stack',
    p: [
      'BeadReader est une appli Next.js App Router avec Tailwind CSS v4, Supabase pour Postgres et le stockage, et Cloudflare R2 pour les images des webtoons, tandis que la connexion utilise mon propre petit cookie signé en HMAC plutôt que Supabase Auth.',
      'Comme la connexion est faite maison, tout l’accès à la base de données passe par le serveur avec le rôle de service Supabase, et chaque table a la sécurité au niveau des lignes activée sans aucune règle, donc la clé publique ne peut rien lire. Le filtre de contenu explicite vit dans la requête SQL, et le déploiement Vercel en un clic configure Supabase via l’intégration et lance les migrations pendant le build.',
    ],
  },

  presence: {
    eyebrow: 'En ligne',
    captions: [
      'Mara est au chapitre 12 du livre que tu lis, donc son avatar a l’anneau vert.',
      'Touche un lecteur pour lui envoyer un coucou, qui s’affiche sur son écran puis s’efface.',
      'Tu peux aussi envoyer un petit mot, qui disparaît en quelques secondes et n’est jamais enregistré.',
      'Sam ouvre le même livre et a lui aussi un anneau vert.',
    ],
    note: 'trop bien, ce retournement !',
    sentNote: 'je le lis en ce moment !',
    status: {
      mara: 'Ce livre, chapitre 12',
      jae: 'Le Hobbit, chapitre 3',
      samLibrary: 'Parcourt la bibliothèque',
      samBook: 'Ce livre, chapitre 1',
    },
    here: 'lit ici',
    wave: 'Envoyer un coucou à {name}',
    sendNote: 'Envoyer un mot à {name}',
    stepsAria: 'Étapes de la démo',
    step: 'Étape {n} sur {total}',
    legend: 'Un anneau vert marque un lecteur dans ton livre',
  },

  spicyGate: {
    chapter: 'Chapitre 9',
    passage: {
      lead: 'Ils s’étaient tourné autour toute la soirée. Quand le dernier invité est enfin parti, la pièce est devenue silencieuse.',
      spicy: 'Ce qui s’est passé ensuite est resté entre eux et la lueur douce du feu.',
      trail: 'Le matin est arrivé bien trop tôt.',
    },
    modes: {
      full: { label: 'Accès total', caption: 'Ce lecteur a l’accès, donc un toucher rend la ligne floutée nette.' },
      none: { label: 'Sans accès', caption: 'Le serveur n’envoie jamais le passage verrouillé à ce lecteur.' },
      cal: { label: 'Mode Cal', caption: 'La ligne est entièrement retirée, sans trou ni marqueur.' },
    },
    revealAria: 'Touche pour révéler le passage pimenté',
    revealedAria: 'Passage pimenté révélé',
    reveal: 'Touche pour voir',
    locked: 'Passage pimenté. Demande l’accès à l’admin.',
    tabsAria: 'Mode lecteur',
    footnote: 'Le filtre est appliqué dans la requête SQL, donc le texte filtré ne quitte jamais le serveur.',
  },
};

export default fr;
