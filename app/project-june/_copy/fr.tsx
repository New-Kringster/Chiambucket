import type { ProjectJuneCopy } from './en';

/* The Project June article in French. Same shape as en.tsx. */
const fr: ProjectJuneCopy = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: 'Un rover 5G que j’ai construit en trois semaines, où un ESP32-S3 et trois téléphones envoient trois flux caméra en direct, le GPS et les mesures des capteurs à une console web depuis laquelle je le pilote.',
    ogDescription: 'Un rover 5G avec trois flux caméra en direct, du GPS, des capteurs et de la télémétrie MQTT.',
  },
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June, un véhicule radiocommandé en 5G',
    back: 'Retour aux projets',
    tag: 'Projet perso',
    title: <>Project <em>June</em></>,
    lead: 'J’ai construit ce rover 5G parce que je voulais un rover martien, et il envoie trois flux caméra en direct, le GPS et les mesures des capteurs (température, humidité, pression et luminosité) à une console web depuis laquelle je le pilote.',
    builtWith: 'Fait avec',
    links: ['GitHub', 'Voir la vidéo'],
  },
  chapters: 'Chapitres',
  rail: {
    Demo: 'Démo', ProjectJune: 'Aperçu', OnboardSys: 'À bord', Ultras: 'Capteur à ultrasons', Laser: 'Laser',
    Gps: 'GPS', IMU: 'IMU 10 axes', Lightsensor: 'Capteur de lumière', Dht11: 'DHT11', TechArch: 'Architecture',
    Livestr: 'Vidéo', ctrlntelm: 'Pilotage et télémétrie', Software: 'Logiciel', softD: 'Design de console', Driving: 'Au volant',
  },
  demo: { h: 'Démo', video: 'Vidéo de démo de Project June' },
  overview: {
    h: 'Aperçu',
    p: 'J’avais prévu deux semaines pour Project June et il m’en a fallu trois. C’était fait dans l’urgence et il y a plein de choses que je ferais autrement, mais ça reste un des projets les plus ambitieux que j’aie construits.',
    alt: 'Le rover Project June d’origine',
    caption: 'La première photo de Project June',
  },
  onboard: {
    h: 'À bord',
    p: 'Un ESP32-S3 lit les capteurs, pilote le moteur et envoie la télémétrie, pendant que trois téléphones à bord donnent au rover son hotspot 5G et ses vues caméra avant, gauche et droite. Le moteur DC passe par un driver moteur à MOSFET que j’ai construit, et un pack lithium-ion 2S3P que j’ai fait à partir de trois packs 2S augmente l’autonomie, tandis qu’une batterie externe alimente l’ESP32 et les téléphones.',
    alt: 'Schéma des pièces de Project June : trois téléphones, l’ESP32-S3, les capteurs, le driver moteur, la batterie externe et le pack de batteries',
  },
  sensors: {
    Ultras: {
      h: 'Capteur à ultrasons',
      p: 'Le capteur à ultrasons est monté à l’arrière, donc il me dit à quelle distance se trouvent les obstacles derrière le rover.',
      alt: 'Le capteur de distance à ultrasons et son affichage dans la console',
    },
    Laser: {
      h: 'Laser',
      p: 'Une diode laser est montée sur un servo 3G à l’avant, et je peux la viser jusqu’à 45° de chaque côté depuis la console.',
      alt: 'La diode laser sur son servo et sa commande dans la console',
    },
    Gps: {
      h: 'GPS',
      p: 'Un module Neo8M donne la position du rover en direct, qui s’affiche sur la carte de la console.',
      alt: 'Le module GPS Neo8M et la carte de la console',
    },
    IMU: {
      h: 'IMU 10 axes',
      p: 'Une seule carte me donne les mesures de l’accéléromètre, du gyroscope et du baromètre, même si je ne me suis jamais servi de son magnétomètre.',
      alt: 'La carte IMU 10 axes et son affichage dans la console',
    },
    Lightsensor: {
      h: 'Capteur de lumière',
      p: 'Le capteur de lumière est un TEMT6000, et comme je n’ai pas réussi à le calibrer, la console affiche la luminosité en quatre paliers : Dark, Ambient, Bright et VBright.',
      alt: 'Le capteur de lumière TEMT6000 et son affichage dans la console',
    },
    Dht11: {
      h: 'DHT11',
      p: 'Le DHT11 mesure la température et l’humidité ambiantes.',
      alt: 'Le capteur de température et d’humidité DHT11 et son affichage dans la console',
    },
  },
  arch: {
    h: 'Architecture',
    p: 'Ce schéma montre les trois parties du système, le rover, le serveur et le client, et ce qui circule entre eux.',
    alt: 'Schéma d’architecture : le rover avec ses capteurs et ses trois téléphones, un serveur qui fait tourner Mosquitto, un serveur Node.js Socket.IO et CoTURN, et la console client avec une manette Xbox',
  },
  video: {
    h: 'Vidéo',
    p1: 'Chaque téléphone envoie sa caméra dans son propre flux WebRTC, trois en tout, relayés par un serveur TURN pour que la vidéo marche en données mobiles.',
    p2: 'Ci-dessous, une reconstruction de la console avec des images d’une sortie de jour et d’une sortie de nuit. Tu peux choisir une étape du chemin du signal ou une caméra pour regarder de plus près.',
    systemAlt: 'Schéma du système vidéo en direct',
    routingAlt: 'Schéma du routage des flux WebRTC',
  },
  console: {
    labelEnd: '.',
    tag: 'Console de pilotage',
    rebuilt: { day: 'D’après la sortie de jour', night: 'D’après la sortie de nuit' },
    toggleAria: 'Choisir la sortie de jour ou de nuit',
    day: 'De jour',
    night: 'De nuit',
    signalPath: 'Chemin du signal',
    trackAria: 'Chemin du signal, de la manette au rover',
    nodes: {
      pad: {
        label: 'Manette Xbox',
        sub: 'Bluetooth vers la console',
        blurb: 'La manette se connecte à la console web en Bluetooth, et la console transforme les mouvements des sticks et des gâchettes en commandes de déplacement qu’elle publie en MQTT.',
      },
      server: {
        label: 'Serveur',
        sub: 'MQTT, signalisation, TURN',
        blurb: 'Mosquitto sert de broker pour les commandes et la télémétrie, un serveur Node.js Socket.IO sert la console et gère la signalisation WebRTC, et CoTURN relaie la vidéo pour qu’elle marche en données mobiles.',
      },
      phones: {
        label: 'Trois téléphones',
        sub: 'Hotspot 5G et caméras',
        blurb: 'Le téléphone 1 est le hotspot 5G principal et la caméra avant, le téléphone 2 est un second hotspot et la caméra gauche, et le téléphone 3 rejoint le hotspot comme caméra droite. Chacun envoie son image dans un flux WebRTC.',
      },
      rover: {
        label: 'ESP32-S3',
        sub: 'Sur le rover',
        blurb: 'Il rejoint le hotspot du téléphone en Wi-Fi, pilote le moteur via le driver à MOSFET et renvoie les données des capteurs en MQTT, en trois paquets à environ 10 Hz.',
      },
    },
    flow: { out: 'Commandes', back: 'Vidéo et télémétrie' },
    telemetry: 'Télémétrie',
    metrics: {
      lat: 'Latitude', lon: 'Longitude', speed: 'Vitesse', alt: 'Altitude',
      temp: 'Température', hum: 'Humidité', sats: 'Satellites',
    },
    brightness: 'Luminosité',
    gpsFix: 'Fix GPS',
    cameras: 'Flux caméra',
    camsAria: 'Choisir la caméra principale',
    live: 'DIRECT',
    camAria: { day: 'Caméra {label}, sortie de jour', night: 'Caméra {label}, sortie de nuit' },
    feeds: {
      left: { label: 'Gauche', phone: 'Tél. 2', note: 'Le téléphone 2 est le second hotspot et la caméra gauche.', show: 'Afficher la caméra gauche (tél. 2)' },
      center: { label: 'Avant', phone: 'Tél. 1', note: 'Le téléphone 1 est le hotspot 5G principal et la caméra avant.', show: 'Afficher la caméra avant (tél. 1)' },
      right: { label: 'Droite', phone: 'Tél. 3', note: 'Le téléphone 3 rejoint le hotspot et sert de caméra droite.', show: 'Afficher la caméra droite (tél. 3)' },
    },
  },
  control: {
    h: 'Pilotage et télémétrie',
    p1: 'L’ESP32 publie les données des capteurs sur un topic MQTT auquel le client est abonné, et le client renvoie les commandes de déplacement et les autres commandes à l’ESP32 sur un second topic.',
    alt1: 'Schéma du système de pilotage et de télémétrie',
    packetsH: 'Trois paquets',
    p2: 'Je n’ai pas réussi à faire tenir toutes les données des capteurs dans un seul message MQTT, et je n’ai pas encore compris pourquoi, donc elles partent en trois paquets séparés à environ 10 Hz.',
    alt2: 'Schéma des trois paquets de télémétrie',
  },
  software: {
    h: 'Logiciel',
    p: 'Voici un organigramme simplifié du code.',
    alts: ['Organigramme du logiciel, partie 1', 'Organigramme du logiciel, partie 2'],
  },
  design: {
    h: 'Design de console',
    p: 'J’ai conçu la console dans Figma.',
    embed: 'Le design de la console Project June dans Figma',
    splineH: 'Spline 3D',
    splineP: 'Le rover 3D de la console est un modèle Spline, qui passe à la vue avant quand je pousse la manette vers l’avant et à la vue arrière quand je la tire en arrière.',
    modelAlt: 'Le modèle 3D du rover dans Spline',
    modelCaption: 'Le modèle Spline',
    viewCaption: 'Le changement de vue dans la console',
  },
  driving: {
    h: 'Au volant',
    p: 'La vidéo venait de plus de 8 km et passait par chaque partie du système, donc il y avait environ une seconde de délai entre une action sur la manette et le mouvement sur le flux en direct. Le flux n’était pas toujours stable non plus, ce qui rendait parfois le pilotage difficile.',
    repo: {
      title: 'Project June sur GitHub',
      text: 'Le dépôt contient la console, la vidéo WebRTC, la télémétrie MQTT et le firmware de l’ESP32.',
      button: 'Voir le code sur GitHub',
    },
  },
};

export default fr;
