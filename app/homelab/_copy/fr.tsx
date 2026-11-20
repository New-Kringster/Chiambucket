import type { HomelabCopy } from './en';

/* The homelab page in French. Same shape as en.tsx. */
const fr: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Je fais tourner trois serveurs à la maison pour ma photothèque, le partage de fichiers, et les serveurs MQTT et TURN qu’utilisent Project June et LUMEN. Cette page présente leur matériel, la carte du réseau, le stockage, les services et leur état en direct.',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['Auto-hébergement', 'Réseau domestique', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: 'Détails de {name}',
  close: 'Fermer',

  hero: {
    checking: 'Vérification des services publics',
    online: '{count}services publics en ligne',
    onlineCount: '{n} sur {total}',
    tele: 'NewMain tourne sous Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>Trois serveurs <em>dans ma chambre</em></>,
    lead: 'Ils font tourner ma photothèque, mes fichiers et les serveurs MQTT et TURN qu’utilisent Project June et LUMEN, et c’est aussi là que j’apprends le réseau, le stockage et Docker, et que j’héberge ce que je construis.',
    stats: [
      { v: '3', k: 'serveurs' },
      { v: '38', k: 'services auto-hébergés' },
      { v: '24 To', k: 'de stockage utile' },
      { v: '4', k: 'VLAN' },
    ],
    mapCta: 'Voir la carte réseau',
    stackCta: 'Voir les services',
    scrollCue: 'Défiler',
  },

  mission: {
    eyebrow: 'Pourquoi un lab',
    title: 'À quoi il sert',
    lead: 'Mes projets matériels ont besoin de serveurs avec qui parler, alors Project June diffuse ses caméras via mon serveur TURN et utilise mon broker MQTT pour la télémétrie et le contrôle, et le relais vocal de LUMEN tourne ici dans Docker. C’est en les faisant tourner moi-même que j’ai appris le réseau, le stockage et le déploiement.',
    pillars: {
      cloud: { k: 'Serveurs et stockage', d: 'Des conteneurs Docker font tourner les services que j’utilise tous les jours derrière un reverse proxy, avec deux niveaux de stockage et des sauvegardes.' },
      net: { k: 'Réseau', d: 'Le réseau a quatre VLAN, du RADIUS et un Wi-Fi WPA3-Enterprise, sur des switchs et des points d’accès UniFi.' },
      code: { k: 'Déployer mes applis', d: 'Les applis que je crée sont déployées sur une VM du cluster Proxmox, et ensuite, j’aimerais que des agents gèrent eux-mêmes certaines parties du lab.' },
      link: { k: 'Pour mes projets', d: 'coturn permet à Project June de diffuser sa vidéo en 5G, tandis que Mosquitto transporte les messages de mes projets d’école sur ESP32.' },
    },
  },

  machines: {
    eyebrow: 'Matériel',
    title: 'Serveurs',
    photoAlt: 'Le serveur {name}',
    more: 'Fiche et détails',
    rack: {
      alt: 'La baie du homelab dans ma chambre : le panneau de brassage avec les câbles bleus en haut, les serveurs derrière une porte grillagée',
      eyebrow: 'La baie',
      title: 'Les trois serveurs dans une baie',
      body: 'La baie est dans un coin de ma chambre, avec le panneau de brassage en haut et les serveurs derrière la porte grillagée. Deux d’entre eux tournent en permanence, et Adell reste éteint jusqu’à ce que j’en aie besoin.',
    },
  },

  statusLabels: { 'always-on': 'Actif 24/7', 'on-demand': 'À la demande' },

  specLabels: {
    os: 'OS', cpu: 'CPU', memory: 'Mémoire', gpu: 'GPU', array: 'Array', fastPool: 'Pool rapide',
    storage: 'Stockage', boot: 'Boot', hosts: 'Héberge', power: 'Énergie',
  },

  servers: {
    newmain: {
      tag: 'Serveur principal',
      role: 'Stockage et l’essentiel de la stack Docker',
      blurb: 'C’est le serveur principal, où un array Unraid protégé par parité garde les données en vrac, un miroir ZFS NVMe garde tout ce qui a besoin de vitesse, et où tournent la plupart des conteneurs Docker.',
      specs: {
        cpu: 'Ryzen 9 5950X, 16 cœurs',
        array: '2 parité + 3 données',
        fastPool: '2 × 2 To NVMe, miroir ZFS',
      },
      detail: {
        tagline: 'Le stockage et la plupart des services',
        story: [
          'Unraid regroupe des disques dépareillés en un seul array protégé par parité pour les données en vrac, tandis qu’un miroir ZFS séparé de deux disques NVMe garde les données des applis Docker, les bases de données et les disques des VM.',
          'Presque tous les services de cette page tournent ici, y compris tout ce qui se trouve derrière les sous-domaines de chiambucket.com. La GTX 1070 s’occupe du transcodage vidéo et du machine learning derrière la recherche et le regroupement des visages d’Immich.',
          'Je touche à cette machine le moins possible, parce que tout le reste en dépend.',
        ],
        highlights: [
          'L’array de parité survit à la panne de deux disques à la fois',
          'Miroir ZFS NVMe pour les données des applis et les disques des VM',
          'Fait tourner la plupart des conteneurs Docker',
          'GTX 1070 pour le machine learning d’Immich et le transcodage',
        ],
      },
    },
    caca: {
      tag: 'Nœud Proxmox, toujours allumé',
      role: 'Cluster Proxmox, toujours allumé',
      blurb: 'CaCa est un petit ThinkCentre qui était autrefois mon serveur principal, et c’est maintenant le nœud toujours allumé d’un cluster Proxmox, qui fait tourner les VM CasaOS et Debian depuis son propre SSD de 1 To.',
      specs: {
        storage: 'SSD NVMe 1 To, boot et VM',
        boot: 'SSD NVMe local',
        hosts: 'VM CasaOS et Debian',
      },
      detail: {
        tagline: 'Le nœud Proxmox qui reste allumé',
        story: [
          'CaCa était mon serveur principal avant NewMain, et c’est maintenant la moitié toujours allumée d’un cluster Proxmox à deux nœuds avec Adell.',
          'Il démarre Proxmox depuis un SSD NVMe de 1 To interne, et les machines virtuelles CasaOS et Debian qui tournaient autrefois directement sur le matériel tournent maintenant depuis ce même disque.',
          'Il consomme peu, donc il reste allumé jour et nuit pendant qu’Adell dort.',
        ],
        highlights: [
          'Démarre et fait tourner ses VM depuis un SSD NVMe local de 1 To',
          'Héberge les VM CasaOS et Debian',
          'Faible consommation, allumé 24/7',
          'En cluster avec Adell pour la migration à chaud',
        ],
      },
    },
    adell: {
      tag: 'Nœud Proxmox, à la demande',
      role: 'Cluster Proxmox, réveillé à la demande',
      blurb: 'Adell a vingt cœurs Xeon et 128 Go de RAM et fait partie du même cluster Proxmox que CaCa, mais il consomme beaucoup, donc il reste éteint jusqu’à ce que je le réveille via UpSnap.',
      specs: {
        cpu: '2 × Xeon E5-2470 v2, 20 cœurs',
        storage: 'PERC H710P en mode IT',
        power: 'Wake-on-LAN uniquement',
      },
      detail: {
        tagline: 'La grosse machine que je réveille au besoin',
        story: [
          'Adell est la grosse machine du cluster, avec deux Xeon qui totalisent vingt cœurs et 128 Go de RAM, donc il consomme trop pour rester allumé.',
          'Quand une tâche en a besoin, j’appuie sur « wake » dans UpSnap, qui envoie un paquet Wake-on-LAN, et Adell démarre par le réseau, exécute la tâche puis se rendort.',
        ],
        highlights: [
          'Vingt cœurs Xeon, 128 Go de RAM',
          'Se réveille à la demande par Wake-on-LAN',
          'Démarrage PXE, pas de disque système local',
          'Reste éteint tant qu’aucune tâche n’en a besoin',
        ],
      },
    },
  },

  visuals: {
    runsLabel: 'Ce qui tourne ici',
    runsFoot: '{n} des {total} services de cette page tournent sur NewMain',
    bootLabel: 'Comment il démarre',
    bootSteps: [
      { t: 'SSD local', s: 'Un SSD NVMe de 1 To dans la machine' },
      { t: 'Proxmox', s: 'Proxmox démarre depuis ce disque' },
      { t: 'VM', s: 'CasaOS et Debian tournent depuis le même SSD' },
    ],
    wakeLabel: 'Comment il se réveille',
    wakeFoot: <>Un seul paquet Wake-on-LAN depuis UpSnap démarre les <b>20 cœurs</b></>,
  },

  map: {
    eyebrow: 'Réseau',
    title: 'Carte du réseau',
    lead: 'Chez moi, tout passe par un seul réseau UniFi découpé en quatre VLAN, et tu peux choisir un appareil pour voir ce qu’il fait, ou un VLAN pour mettre en évidence ses appareils.',
    clear: 'Effacer',
    tip: 'Choisis un VLAN pour voir ses appareils',
    svgLabel: 'Carte du réseau. Choisis un appareil pour voir les détails.',
    core: 'Cœur de réseau',
    segment: 'Segment',
    hint: 'Choisis un appareil pour voir ce qu’il fait.',
    legend: {
      unraid: 'VLAN Unraid',
      server: 'VLAN serveurs',
      default: 'VLAN par défaut',
      iot: 'VLAN IoT, isolé',
    },
    vlans: {
      unraid: { label: 'VLAN Unraid', blurb: 'NewMain est seul sur ce VLAN, et les VLAN de confiance peuvent y accéder pour le stockage et les applis, mais pas le VLAN IoT.' },
      server: { label: 'VLAN serveurs', blurb: 'CaCa et Adell, le cluster Proxmox, partagent ce segment pour pouvoir migrer des VM à chaud et démarrer en PXE.' },
      default: { label: 'VLAN par défaut', blurb: 'Les postes de travail et le Wi-Fi principal WPA3-Enterprise sont ici, et ils peuvent joindre les serveurs, alors que le VLAN IoT ne peut pas les joindre.' },
      iot: { label: 'VLAN IoT', blurb: 'Les objets connectés ont accès à internet et à rien d’autre, car les règles du pare-feu isolent ce segment de tous les autres VLAN.' },
      core: { label: 'Cœur de réseau', blurb: 'La passerelle et les switchs qui routent entre les VLAN.' },
    },
    nodes: {
      internet: { label: 'Internet', sub: 'Bordure publique',
        detail: 'Le trafic entrant arrive sur une seule adresse publique et va directement à la passerelle, donc rien derrière elle n’est joignable directement.' },
      udm: { label: 'UDM Pro', sub: 'Passerelle, pare-feu, RADIUS',
        detail: 'L’UniFi Dream Machine Pro est la passerelle, le pare-feu, le contrôleur réseau et le serveur RADIUS. Elle décide quel VLAN peut joindre quel autre, et authentifie le Wi-Fi WPA3-Enterprise.' },
      sw1: { label: 'USW Pro Max 24', sub: 'Baie serveurs',
        detail: 'Ce switch 24 ports est dans la baie serveurs, et chaque serveur s’y connecte avec une paire de liens redondants.' },
      sw2: { label: 'USW Flex 2.5G', sub: 'Général',
        detail: 'Ce switch 2,5 Gb relie les appareils du quotidien les plus rapides de l’appartement.' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'Alimente les AP',
        detail: 'Ce switch PoE 8 ports relie et alimente les cinq points d’accès, avec un câble chacun.' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'Le serveur Unraid a un VLAN pour lui seul, que les VLAN de confiance peuvent joindre pour le stockage et les applis, mais pas le VLAN IoT.' },
      caca: { label: 'CaCa', sub: 'Toujours allumé',
        detail: 'CaCa est le nœud Proxmox qui reste allumé, et il partage le VLAN serveurs avec Adell.' },
      adell: { label: 'Adell', sub: 'À la demande',
        detail: 'Adell est le nœud Proxmox que je réveille quand j’en ai besoin, et il partage le VLAN serveurs avec CaCa pour la migration à chaud et le démarrage PXE.' },
      clients: { label: 'Ordinateurs', sub: 'Portables, fixes',
        detail: 'Les appareils du quotidien sont sur le VLAN par défaut, d’où ils peuvent joindre les serveurs, mais le VLAN IoT ne peut pas les joindre.' },
      aps: { label: '5 AP UniFi', sub: 'Wi-Fi',
        detail: 'Cinq points d’accès diffusent deux réseaux Wi-Fi séparés dans tout l’appartement, alimentés en PoE par le Lite 8.' },
      wmain: { label: 'WLAN principal', sub: 'WPA3-Enterprise',
        detail: 'Le Wi-Fi principal utilise WPA3-Enterprise avec RADIUS sur l’UDM Pro, donc chaque appareil a ses propres identifiants.' },
      wiot: { label: 'WLAN IoT', sub: 'Isolé',
        detail: 'Les objets connectés ont accès à internet et à rien d’autre, car les règles du pare-feu les isolent de tous les autres VLAN.' },
    },
  },

  storage: {
    eyebrow: 'Stockage et VM',
    title: 'Stockage et machines virtuelles',
    poolsTitle: 'Le stockage de NewMain',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'Array',
      sub: 'Unraid, protégé par parité',
      body: 'Il a deux disques de parité et trois disques de données, donc il survit à la panne de deux disques à la fois, et il garde les sauvegardes PXE, les archives et les médias.',
    },
    fast: {
      name: 'Pool rapide',
      sub: 'Miroir ZFS NVMe',
      body: 'Deux disques NVMe de 2 To forment un miroir ZFS, d’où tournent les données des applis Docker, les disques des VM et la bibliothèque d’ISO PXE.',
    },
    sharedOver: 'Partagé via',
    protocols: ['SFTP', 'SMB sur le réseau local', 'NFS vers Linux et macOS'],
    clusterTitle: 'Le cluster Proxmox',
    clusterLead: 'CaCa et Adell forment un seul cluster Proxmox. CaCa démarre depuis son propre SSD de 1 To et reste allumé, tandis qu’Adell démarre par le réseau sans disque système local, et je le réveille quand j’ai besoin de ses cœurs.',
    vms: [
      { k: 'claudeplayground', d: 'C’est une VM Ubuntu où je déploie les applis que je crée, et Claude y a un accès SSH pour les mettre en ligne.' },
      { k: 'CasaOS et Debian', d: 'Ces VM tournaient autrefois directement sur le matériel.' },
      { k: 'Wake-on-LAN', d: 'UpSnap allume Adell quand une tâche en a besoin, donc il ne consomme que pendant qu’il travaille.' },
    ],
  },

  stack: {
    eyebrow: 'Logiciels',
    title: 'Services',
    lead: 'Voici les principaux services sur 38, et les services publics affichent un état en direct, vérifié une fois par minute.',
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
    status: { up: 'en ligne', down: 'hors ligne', wait: 'vérification', build: 'en construction', self: 'privé' },
    loadLabel: 'Charge : {label}',
    weights: {
      extreme: 'La plus lourde',
      'very-high': 'Très élevée',
      high: 'Élevée',
      moderate: 'Modérée',
      low: 'Légère',
      dev: 'En développement',
      diagnostic: 'À la demande',
    },
    facts: { runsOn: 'Tourne sur', load: 'Charge', access: 'Accès', category: 'Catégorie' },
    access: {
      public: 'Public, via Nginx Proxy Manager et CrowdSec',
      dev: 'En développement sur NewMain',
      private: 'Privé, sur le réseau Tailscale',
    },
    visit: 'Visiter {host}',
  },

  services: {
    openclaw: {
      blurb: 'Je construis en ce moment OpenClaw, un runner qui permet à des agents IA d’effectuer de vraies tâches sur le lab, et il n’est pas encore terminé.',
      long: [
        'Le but est de donner à un agent un endroit sûr dans le lab, où il peut lancer un conteneur, vérifier un service, déployer une petite appli et faire son rapport.',
        'C’est la suite de l’accès SSH que j’ai donné à Claude sur une VM pour déployer mes applis, et la prochaine étape est de le laisser gérer certaines parties du lab pendant que je vérifie les résultats.',
      ],
    },
    npm: {
      blurb: 'Il est placé devant chaque service public comme reverse proxy, où il termine le SSL, route chaque sous-domaine de chiambucket.com vers son conteneur et fait tourner un bouncer CrowdSec qui bannit les IP hostiles.',
      long: [
        'Tout le trafic public arrive sur une seule adresse et passe d’abord par NPM, donc aucun conteneur n’est exposé directement à internet.',
        'CrowdSec surveille le trafic à la recherche de schémas d’attaque et bannit la source. Comme tout passe par NPM, tous les services publics tombent dès que NPM tombe.',
      ],
    },
    tailscale: { blurb: 'C’est un maillage WireGuard qui met tous mes appareils sur un même réseau privé, et je m’en sers pour me connecter en SSH et modifier des configs de n’importe où.' },
    shadowsocks: { blurb: 'C’est un proxy qui fait passer mon trafic pour du HTTPS ordinaire, pour que je puisse joindre la maison depuis les réseaux restreints de l’école.' },
    twingate: { blurb: 'C’est un connecteur zero trust que je garde comme accès de plus, à côté de Teleport, WireGuard et Unraid Connect.' },
    pihole: { blurb: 'Il bloque les pubs et les traqueurs au niveau DNS pour tout le réseau, même si je m’en sers surtout pour le dépannage maintenant.' },
    immich: {
      blurb: 'Immich remplace Google Photos comme photothèque, avec la sauvegarde automatique du téléphone, la recherche et les albums, et c’est le service que j’utilise le plus.',
      long: [
        'Chaque photo et chaque vidéo de mon téléphone est sauvegardée ici automatiquement et reste sur mon propre stockage.',
        'C’est le service le plus lourd de NewMain. La GTX 1070 fait tourner le machine learning pour la recherche et le regroupement des visages, et le dimensionner m’a appris à prévoir le CPU, le GPU, la mémoire et le stockage pour une vraie charge de travail.',
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
    crafty: { blurb: 'Crafty gère mes serveurs Minecraft, et il tourne à deux endroits pour qu’un monde puisse toujours être lancé.' },
    paperless: { blurb: 'C’est une archive de documents qui fait l’OCR de chaque PDF et de chaque scan, pour que je puisse les chercher depuis n’importe quel appareil.' },
    vscode: { blurb: 'Il fait tourner VS Code dans le navigateur, pour que je puisse modifier les fichiers de config sur le serveur.' },
    upstat: { blurb: 'Il suit la disponibilité et le temps de réponse de chaque service et conteneur, pour que je sois le premier au courant des problèmes.' },
    netdata: { blurb: 'Il enregistre des métriques à la seconde pour le CPU, les disques, le réseau et les conteneurs.' },
    upsnap: { blurb: 'C’est un panneau Wake-on-LAN, et c’est avec lui que j’allume Adell.' },
    openspeedtest: { blurb: 'C’est un test de débit auto-hébergé qui mesure le débit entre le serveur et l’endroit où je me trouve.' },
    portainer: { blurb: 'Il me donne une interface web pour Docker, sur l’hôte Unraid comme sur la VM CasaOS.' },
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

  access: {
    eyebrow: 'Accès à distance',
    title: 'Six accès',
    lead: 'Je garde six accès distincts depuis l’extérieur, pour qu’une panne de l’un d’eux ne me laisse pas dehors.',
    primary: 'Principal',
    methods: {
      tailscale: { type: 'VPN maillé', note: 'C’est un maillage WireGuard avec un seul identifiant sur tous mes appareils, et c’est celui que j’utilise tous les jours.' },
      wireguard: { type: 'Tunnel', note: 'C’est un simple tunnel chiffré vers le réseau, sans aucun tiers.' },
      teleport: { type: 'VPN intégré', note: 'L’UDM Pro fournit ce VPN elle-même, donc il n’y a aucun client à configurer.' },
      twingate: { type: 'Zero trust', note: 'Il vérifie l’accès identité par identité et garde tous les ports entrants fermés.' },
      shadowsocks: { type: 'Proxy', note: 'Il fait passer mon trafic pour du HTTPS, pour que je puisse passer les Wi-Fi restreints de l’école et du bureau.' },
      unraidConnect: { type: 'Service éditeur', note: 'Il me donne un accès direct au serveur Unraid depuis mon compte Unraid.' },
    },
    home: { type: 'La baie', note: 'Tous les chemins ci-dessus mènent ici.' },
  },

  cta: {
    title: 'Mon chantier actuel',
    sub: 'Je construis OpenClaw, un runner qui permet à des agents IA d’effectuer de vraies tâches sur le lab, comme lancer un conteneur, vérifier un service, déployer une petite appli et faire leur rapport, mais il n’est pas encore terminé.',
    projects: 'Voir mes projets',
    contact: 'Me contacter',
  },
};

export default fr;
