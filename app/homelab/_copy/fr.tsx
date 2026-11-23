import type { HomelabCopy } from './en';

/* The homelab page in French. Same shape as en.tsx. */
const fr: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Mon cloud maison est géré par des agents IA sur braven-agents, un serveur qui pilote les autres machines, le réseau UniFi et des plateformes externes comme Cloudflare. Cette page montre comment tout se relie, les machines, les services et leur état en direct.',
  },
  jsonLd: {
    headline: 'Un cloud maison géré par des agents IA',
    about: ['Auto-hébergement', 'Agents IA', 'Automatisation de l’infrastructure', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: 'Détails de {name}',
  close: 'Fermer',

  hero: {
    title: 'Un HomeLab pensé pour les agents',
    lead: 'Chaque machine, chaque réseau et chaque service ici est géré par braven-agents, un serveur dont le travail est de faire tourner mes agents IA. Ils peuvent atteindre tout le reste, du serveur de stockage au routeur et à Cloudflare, donc la plupart des changements se font à partir d’un prompt, sans que je touche à rien.',
    mapCta: 'Voir les connexions',
    machinesCta: 'Voir les machines',
  },

  core: {
    title: 'Tout passe par braven-agents',
    lead: 'braven-agents détient les clés de tous les autres systèmes, et les agents qui tournent dessus atteignent chacun via sa propre API ou en SSH. Choisis un système pour voir ce qu’ils y font.',
    mapLabel: 'Comment braven-agents se connecte à tous les autres systèmes',
    coreTag: 'Le cœur',
    coreRole: 'Il fait tourner Claude Code, Codex et OpenCode, plus Hermes pour les tâches planifiées, et je lance et suis leur travail dans T3 Code.',
    groups: { machines: 'Machines', edge: 'Réseau et edge', platforms: 'Plateformes' },
    doesLabel: 'Ce que les agents y font',
    planned: 'Prévu',
    proxmoxName: 'Serveur Proxmox',
    nodes: {
      newmain: { role: 'Stockage et services auto-hébergés', via: 'Unraid API',
        does: ['Lancer, mettre à jour et redémarrer les conteneurs Docker', 'Surveiller l’array et la santé de chaque disque', 'Créer des partages et des machines virtuelles'] },
      caca: { role: 'Environnement de dev d’un projet secret', via: 'SSH',
        does: ['Compiler et tester le projet', 'Garder ses outils et ses paquets à jour'] },
      servertop: { role: 'Passerelle vers mon iCloud', via: 'SSH',
        does: ['Lire et ajouter des événements dans mes calendriers', 'Lire et ajouter des rappels', 'Gérer les autres tâches iCloud qui demandent un Mac'] },
      blade: { role: 'Calculs GPU', via: 'SSH',
        does: ['Lancer des entraînements sur la RTX 3080, comme ceux qui ont entraîné DrumNet', 'Faire tourner de plus gros modèles et d’autres travaux lourds pour le GPU'] },
      proxmox: { role: 'Machines virtuelles, matériel encore à choisir', via: 'Pas encore lancé',
        does: ['Il est encore en cours de montage, donc rien n’y tourne pour l’instant.'] },
      unifi: { role: 'Tout le réseau de la maison', via: 'UniFi API',
        does: ['Créer des réseaux et des VLAN', 'Ajouter des règles de pare-feu et des redirections de ports', 'Trouver et gérer les appareils connectés'] },
      npm: { role: 'Reverse proxy des services publics', via: 'NPM API',
        does: ['Ajouter un proxy host pour chaque nouveau sous-domaine', 'Émettre et renouveler les certificats SSL', 'Choisir qui peut accéder à un service'] },
      cloudflare: { role: 'DNS et services edge', via: 'Cloudflare API',
        does: ['Créer et modifier les enregistrements DNS', 'Ouvrir des Cloudflare Tunnels pour les nouvelles applis', 'Déployer des Workers et gérer le stockage R2'] },
      github: { role: 'Mon code', via: 'GitHub CLI',
        does: ['Créer des dépôts, des branches et des pull requests', 'Pousser les changements qu’ils font'] },
      vercel: { role: 'L’hébergement de ce site', via: 'Vercel API',
        does: ['Déployer des previews et vérifier que les builds passent', 'Mettre ce site en ligne quand je le demande'] },
      shebang: { role: 'Ma plateforme d’hébergement', via: 'Shebang MCP',
        does: ['Publier des pages et des fichiers', 'Donner à une nouvelle appli sa propre base de données et sa connexion'] },
    },
  },

  prompt: {
    title: 'D’un prompt à une appli qui tourne',
    lead: 'Quand je demande quelque chose de nouveau, les agents passent tout seuls par chaque système concerné. Si je leur demande de mettre une nouvelle appli en ligne à sa propre adresse chiambucket.com, par exemple, voilà ce qui se passe :',
    requestLabel: 'La demande',
    request: 'Mets ma nouvelle appli de notes en ligne sur notes.chiambucket.com.',
    steps: [
      { at: 'braven-agents', t: 'Un agent écrit l’appli et son fichier Docker Compose, puis la teste.' },
      { at: 'NewMain', t: 'Il lance l’appli comme conteneur sur NewMain.' },
      { at: 'Nginx Proxy Manager', t: 'Il ajoute un proxy host pour le nouveau sous-domaine et obtient un certificat SSL pour lui.' },
      { at: 'Cloudflare', t: 'Il crée l’enregistrement DNS qui fait pointer le sous-domaine vers la maison.' },
      { at: 'UniFi', t: 'Si l’appli a besoin d’un port ou d’une règle de pare-feu, il l’ajoute sur le routeur.' },
      { at: 'braven-agents', t: 'Il ouvre l’adresse pour vérifier que l’appli répond, puis m’envoie le lien.' },
    ],
    ownTitle: 'Sans rien demander',
    own: 'Un bilan de santé tourne chaque jour et répare tout seul ce qu’il peut, donc il redémarre les conteneurs, les services et les machines virtuelles qui se sont arrêtés et remonte les disques qui ont décroché.',
    waitTitle: 'Ce qui m’attend encore',
    wait: 'Supprimer des données, toucher à l’array de stockage et redémarrer les machines demandent toujours mon accord, et les outils demandent avant toute action destructrice.',
  },

  machines: {
    title: 'Les machines',
    photoAlt: '{name}',
    lead: 'Cinq machines tournent, et une sixième est encore en projet.',
    status: { running: 'En marche', planned: 'Prévu' },
    items: {
      agents: {
        name: 'braven-agents', role: 'Le cœur',
        blurb: 'C’est la machine la plus puissante ici, et elle tourne sous Ubuntu en bare metal pour que les agents l’aient entièrement pour eux.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X, 16 cœurs' },
          { k: 'Mémoire', v: '64 Go DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 Go' },
          { k: 'Stockage', v: '2 × 2 To NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'Stockage et services',
        blurb: 'NewMain garde mes fichiers, mes photos et mes sauvegardes sur cinq disques durs dans un array Unraid protégé par parité, et fait tourner dans Docker les services auto-hébergés présentés plus bas sur cette page.',
        specs: [
          { k: 'OS', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 cœurs' },
          { k: 'Mémoire', v: '128 Go DDR3' },
          { k: 'Array', v: '5 disques durs, protégés par parité' },
          { k: 'Contrôleur', v: 'PERC H710P en mode IT' },
        ],
      },
      caca: {
        name: 'CaCa', role: 'Machine de dev',
        blurb: 'CaCa est un petit ThinkCentre qui sert d’environnement de développement pour un projet dont je ne peux pas encore parler.',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'Mémoire', v: '32 Go DDR4' },
          { k: 'Stockage', v: 'SSD NVMe 1 To' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'Pont iCloud',
        blurb: 'Servertop est un MacBook Air qui reste connecté à mon iCloud, et c’est par lui que les agents accèdent à mes calendriers, mes rappels et d’autres choses perso.',
        specs: [
          { k: 'Modèle', v: 'MacBook Air, M1' },
          { k: 'Mémoire', v: '8 Go' },
          { k: 'Stockage', v: 'SSD 256 Go' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'Calcul GPU',
        blurb: 'Ce portable tourne sous Ubuntu et prend en charge le travail lourd pour le GPU, et c’est la même machine qui a entraîné DrumNet pour l’OCR Reader.',
        specs: [
          { k: 'OS', v: 'Ubuntu' },
          { k: 'CPU', v: 'Core i7 10e génération' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'Mémoire', v: '32 Go' },
          { k: 'Stockage', v: '2 × SSD 1 To' },
        ],
      },
      proxmox: {
        name: 'Serveur Proxmox', role: 'Virtualisation',
        blurb: 'Un nouveau serveur Proxmox est encore en cours de montage, et son matériel reste à choisir.',
        specs: [
          { k: 'OS', v: 'Proxmox VE' },
          { k: 'Matériel', v: 'À choisir' },
        ],
      },
    },
    rack: {
      alt: 'La baie dans ma chambre, avec le panneau de brassage et les câbles bleus en haut et les serveurs derrière une porte grillagée',
      caption: 'braven-agents, NewMain et CaCa partagent cette baie dans ma chambre.',
    },
  },

  stack: {
    title: 'Ce qu’il héberge',
    lead: 'NewMain fait tourner ces services pour moi et mes projets, et les services publics affichent un état en direct, vérifié une fois par minute.',
    filterLabel: 'Filtrer les services',
    categories: {
      all: 'Tous',
      access: 'Accès',
      files: 'Fichiers',
      media: 'Médias et outils',
      monitoring: 'Supervision',
      projects: 'Pour mes projets',
    },
    checkedAt: 'Vérifié à {time}',
    checking: 'Vérification de l’état',
    showFewer: 'Afficher moins',
    showAll: 'Voir les {n} services',
    status: { up: 'En ligne', down: 'Hors ligne', wait: 'Vérification', self: 'Privé' },
    loadLabel: 'Charge : {label}',
    weights: {
      extreme: 'La plus lourde',
      'very-high': 'Très élevée',
      high: 'Élevée',
      moderate: 'Modérée',
      low: 'Légère',
      diagnostic: 'À la demande',
    },
    facts: { runsOn: 'Tourne sur', load: 'Charge', access: 'Accès', category: 'Catégorie' },
    access: {
      public: 'Public, via Nginx Proxy Manager et CrowdSec',
      private: 'Privé, sur le réseau Tailscale',
    },
    visit: 'Visiter {host}',
  },

  services: {
    npm: {
      blurb: 'Il est placé devant chaque service public comme reverse proxy, où il termine le SSL, route chaque sous-domaine de chiambucket.com vers son conteneur et fait tourner un bouncer CrowdSec qui bannit les IP hostiles.',
      long: [
        'Tout le trafic public arrive sur une seule adresse et passe d’abord par NPM, donc aucun conteneur n’est exposé directement à internet.',
        'CrowdSec surveille le trafic à la recherche de schémas d’attaque et bannit la source. Comme tout passe par NPM, tous les services publics tombent dès que NPM tombe.',
      ],
    },
    tailscale: { blurb: 'C’est un maillage WireGuard qui met tous mes appareils sur un même réseau privé, et je m’en sers pour joindre la maison de n’importe où.' },
    shadowsocks: { blurb: 'C’est un proxy qui fait passer mon trafic pour du HTTPS ordinaire, pour que je puisse joindre la maison depuis les réseaux restreints de l’école.' },
    twingate: { blurb: 'C’est un connecteur zero trust que je garde comme accès de plus, à côté de Tailscale, WireGuard et UniFi Teleport.' },
    pihole: { blurb: 'Il bloque les pubs et les traqueurs au niveau DNS pour tout le réseau, même si je m’en sers surtout pour le dépannage maintenant.' },
    immich: {
      blurb: 'Immich remplace Google Photos comme photothèque, avec la sauvegarde automatique du téléphone, la recherche et les albums, et c’est le service que j’utilise le plus.',
      long: [
        'Chaque photo et chaque vidéo de mon téléphone est sauvegardée ici automatiquement et reste sur mon propre stockage.',
        'C’est le service le plus lourd de NewMain, et le dimensionner m’a appris à prévoir le CPU, la mémoire et le stockage pour une vraie charge de travail.',
      ],
    },
    lychee: { blurb: 'Lychee est la galerie photo derrière la page photographie de ce site.' },
    pingvin: { blurb: 'J’y envoie les fichiers trop gros pour les messageries, et j’obtiens un lien à partager.' },
    pairdrop: { blurb: 'Il envoie un fichier entre deux appareils depuis le navigateur, comme AirDrop, sans aucun compte.' },
    fbq: {
      blurb: 'Il me donne un accès par navigateur et des liens de partage pour les mêmes fichiers que j’utilise en NFS et SMB à la maison.',
      long: ['Avant lui, j’ai utilisé Nextcloud, le FileBrowser d’origine, Alist et SFTPGo, et c’est celui que j’ai gardé.'],
    },
    syncthing: { blurb: 'Il garde mes fichiers synchronisés entre mes appareils en permanence, avec un historique des versions.' },
    fireshare: { blurb: 'Mes amis et moi y mettons et partageons nos clips de jeu, sans limite d’envoi.' },
    neko: { blurb: 'Il fait tourner un navigateur partagé dans un onglet, pour qu’on rejoigne la même salle et qu’on regarde ou cherche des choses sur un seul écran.' },
    crafty: { blurb: 'Crafty gère mes serveurs Minecraft.' },
    paperless: { blurb: 'C’est une archive de documents qui fait l’OCR de chaque PDF et de chaque scan, pour que je puisse les chercher depuis n’importe quel appareil.' },
    vscode: { blurb: 'Il fait tourner VS Code dans le navigateur, pour que je puisse modifier les fichiers de config sur le serveur.' },
    upstat: { blurb: 'Il suit la disponibilité et le temps de réponse de chaque service et conteneur, pour que les problèmes se voient tôt.' },
    netdata: { blurb: 'Il enregistre des métriques à la seconde pour le CPU, les disques, le réseau et les conteneurs.' },
    upsnap: { blurb: 'C’est un panneau Wake-on-LAN qui allume les machines en veille.' },
    openspeedtest: { blurb: 'C’est un test de débit auto-hébergé qui mesure le débit entre le serveur et l’endroit où je me trouve.' },
    portainer: { blurb: 'Il me donne une interface web pour les conteneurs Docker de NewMain.' },
    coturn: {
      blurb: 'J’ai monté ce serveur TURN et STUN pour Project June, pour que ses trois flux caméra WebRTC passent à travers le NAT cellulaire.',
      long: [
        'Project June diffuse trois flux caméra en direct en 5G, mais les réseaux cellulaires placent les appareils derrière plusieurs couches de NAT que WebRTC ne peut pas traverser seul.',
        'Mon propre serveur TURN et STUN donne aux flux une adresse publique fixe où se retrouver, donc je peux piloter le rover de n’importe où, et il consomme peu de CPU.',
      ],
    },
    mosquitto: { blurb: 'J’ai d’abord monté ce broker MQTT pour la télémétrie et le contrôle de Project June, et il transporte maintenant les messages entre mes projets d’école sur ESP32 et leurs tableaux de bord.' },
    nginx: { blurb: 'Deux petits conteneurs nginx servent mes sites statiques et les démos de mes projets.' },
  },

  tubs: {
    title: 'Shebang Tubs',
    status: 'Tout début, en dev',
    lead: 'Shebang Tubs est un projet et un framework que je construis pour que n’importe qui puisse créer et auto-héberger ses propres applis avec des agents.',
    body: [
      'Chaque appli est un tub, un dossier avec un simple fichier Compose et sa propre base de données, ses fichiers et ses secrets, pour qu’un agent puisse la construire, la lancer et la déplacer vers une autre machine en un seul zip, données comprises.',
      'Un tableau de bord déploie, démarre et arrête les tubs, et en publier un lui donne une adresse web via Cloudflare Tunnel, sans redirection de port ni reverse proxy. Les agents reçoivent une clé API, donc ils peuvent tout faire eux-mêmes.',
    ],
    diagram: {
      label: 'Ce que contient un tub et où il va',
      tub: 'Un tub',
      parts: ['Fichier Compose', 'Base de données', 'Fichiers', 'Secrets'],
      zip: 'Exporté en un seul zip',
      runs: 'Tourne sur toute machine avec Docker',
      publish: 'Publié via Cloudflare Tunnel',
    },
  },

  cta: {
    title: 'Où tout ça mène',
    sub: 'Le but est un cloud perso qui prend soin de lui-même et peut construire et faire tourner n’importe quoi à partir d’un seul prompt. La plupart des pièces sont déjà en place, et la prochaine est le nouveau serveur Proxmox.',
    projects: 'Voir mes projets',
    contact: 'Me contacter',
  },
};

export default fr;
