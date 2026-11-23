import type { LumenCopy } from './en';

/* The LUMEN article in French. Same shape as en.tsx. */
const fr: LumenCopy = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN est un assistant vocal pour une pièce connectée, construit sur un ESP32 sans PSRAM. La carte entend un mot d’éveil et enregistre avec un micro INMP441, un relais FastAPI envoie le clip à Whisper et à un parseur de commandes DeepSeek via OpenRouter, et MQTT porte la commande jusqu’aux appareils.',
    ogDescription: 'Un assistant vocal sur ESP32 qui entend un mot d’éveil sur la carte, envoie le clip via un relais FastAPI à Whisper et à un parseur de commandes DeepSeek, et pilote la pièce en MQTT.',
  },
  ld: {
    headline: 'LUMEN, un assistant vocal sur ESP32',
    description: 'Un assistant à commande vocale pour une pièce connectée, construit pour le module IoT Programming de NYP. Un ESP32 sous MicroPython enregistre la demande, un relais FastAPI appelle OpenRouter pour la transcription Whisper et un parseur de commandes DeepSeek, et la commande revient dans la pièce en MQTT.',
  },
  hero: {
    alt: 'Visuel de couverture de LUMEN, un assistant de maison connectée construit avec OpenAI Whisper et DeepSeek',
    back: 'Retour aux projets',
    tag: 'Projet d’école',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN est un assistant à commande vocale pour une pièce connectée : tu dis « Hello Robot » ou tu maintiens un bouton, et tu parles. Un ESP32 enregistre l’audio, un serveur le transcrit et demande à un LLM d’en faire une seule commande JSON, puis MQTT envoie cette commande aux lumières, au ventilateur, au servo et au buzzer. Le plus dur a été de faire tenir tout ça sur une carte avec environ 33 Ko de RAM libre.',
    builtWith: 'Fait avec',
  },
  chapters: 'Chapitres',
  rail: {
    overview: 'Aperçu', try: 'Essayer', how: 'Fonctionnement', brain: 'Le parseur', hardware: 'Matériel',
    memory: 'Mémoire', auto: 'Mode auto', deploy: 'Dashboard', slides: 'Diapos', next: 'Et ensuite',
  },

  overview: {
    h: 'Aperçu',
    p: [
      'LUMEN, c’était mon mini-projet pour le module IoT Programming de NYP, où la consigne était simplement de construire un appareil connecté qui fait quelque chose d’utile. Je voulais voir ce qu’un ESP32 pas cher pouvait faire avec une vraie compréhension du langage plutôt qu’avec une liste fixe de commandes.',
      'Il guette un mot d’éveil, enregistre ce que tu dis et le transforme en actions : « baisse un peu la lumière », « allume le ventilateur dans dix minutes », « règle la luminosité sur l’humidité », « bonne nuit ». Le travail sur le langage tourne sur un petit serveur, donc l’ESP32 n’a qu’à enregistrer l’audio et exécuter les commandes.',
    ],
    video: 'Le mot d’éveil, quelques commandes vocales et la pièce qui répond.',
  },

  try: {
    h: 'Essaie-le',
    p: 'Cette démo suit le même chemin que le vrai système, en plus petit : d’un déclencheur à Whisper pour la transcription, puis à un LLM DeepSeek qui transforme le texte en une seule commande JSON (les deux via OpenRouter), et enfin en MQTT jusqu’aux appareils. Tu peux choisir une phrase ci-dessous ou la laisser les faire défiler.',
    note: 'La question sur la température et la demande de sandwich montrent les garde-fous : une question reçoit une réponse tirée des capteurs en direct, sans aucune action, et une demande impossible est refusée. L’ESP32 n’agit jamais que sur du JSON validé.',
  },

  console: {
    title: 'Console LUMEN',
    wake: '« Hello Robot »',
    ptt: 'push-to-talk',
    pipeAria: 'Pipeline de la requête',
    stages: ['Réveil', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: 'Entendu',
    parsed: 'Analysé',
    quote: '« {said} »',
    idle: 'Dis « Hello Robot » ou maintiens le bouton.',
    room: 'La pièce',
    autoOn: 'Auto activé',
    autoOff: 'Auto coupé',
    devices: { white: 'LED blanche', rgb: 'NeoPixel', fan: 'Ventilo', servo: 'Servo' },
    on: 'on',
    off: 'off',
    motion: 'mouvement',
    still: 'calme',
    dark: 'sombre',
    lit: 'clair',
    timer: 'Lumière éteinte dans 10 min',
    play: 'Lecture',
    pause: 'Pause',
    steps: [
      { said: 'Mets la lumière en cyan et allume le ventilateur une seconde après.', reply: 'Cyan, puis ventilo dans 1 s.' },
      { said: 'Règle la luminosité sur le pourcentage d’humidité.', reply: 'Luminosité réglée à 69 %.' },
      { said: 'Éteins la lumière dans dix minutes.', reply: 'Lumière éteinte dans 10 min.' },
      { said: 'Il fait quelle température ici ?', reply: '24,3 °C ici.' },
      { said: 'Bonne nuit.', reply: 'Bonne nuit.' },
      { said: 'Fais-moi un sandwich.', reply: 'Désolé, je ne peux pas faire ça.' },
    ],
  },

  how: {
    h: 'Fonctionnement',
    p1: <><strong>L’ESP32 ne réfléchit presque pas</strong>, parce que son seul travail est d’enregistrer l’audio et d’exécuter les commandes. La transcription, le modèle de langage et les logs tournent tous sur un serveur FastAPI dans Docker sur mon homelab, que la carte joint par le réseau local.</>,
    p2: <>Un déclencheur (le mot d’éveil « Hello Robot », ou un bouton push-to-talk en secours) lance la capture d’un micro INMP441 en audio mono 16&nbsp;kHz. La carte l’emballe en WAV et le streame vers l’endpoint <code>/upload</code> du serveur. Le serveur utilise une seule clé d’API <strong>OpenRouter</strong> pour les deux étapes : Whisper transcrit d’abord l’audio, puis un modèle DeepSeek transforme le texte en une seule commande JSON, sous un prompt système strict. Il valide ensuite le JSON, le publie sur un topic MQTT auquel l’ESP32 est abonné, et ajoute chaque résultat à une Google Sheet avec un coût estimé par requête.</>,
    p3: 'Le serveur s’abonne aussi aux topics d’état et de capteurs de la pièce, garde en cache les dernières valeurs et les passe au LLM comme contexte. C’est comme ça que des questions comme « il fait quelle température ? » et « le ventilateur est allumé ? » reçoivent une réponse tirée de vraies mesures.',
    pipelineH: 'Le pipeline vocal',
    steps: [
      <>Tu le <b>déclenches</b> en disant « Hello Robot » ou en maintenant le bouton push-to-talk.</>,
      <>L’INMP441 <b>enregistre</b> environ trois secondes d’audio mono 16&nbsp;kHz, et la LED rouge REC reste allumée pendant ce temps.</>,
      <>La carte <b>emballe</b> le PCM brut dans un en-tête WAV de 44 octets et le <b>streame</b> vers <code>/upload</code> pendant qu’elle enregistre encore.</>,
      <>Le serveur envoie le clip à OpenRouter, où Whisper le <b>transcrit</b> en texte.</>,
      <>Le serveur <b>ajoute du contexte</b> en passant au modèle la transcription avec un instantané de l’état des appareils et des mesures des capteurs.</>,
      <>Un modèle DeepSeek, lui aussi via OpenRouter, l’<b>analyse</b> pour en faire une seule commande JSON, que le serveur vérifie par rapport au schéma, avec un seul nouvel essai avant de se rabattre sur un no-op.</>,
      <>Le serveur <b>envoie</b> la commande en MQTT et ajoute une ligne à la Google Sheet.</>,
      <>L’ESP32 <b>exécute</b> la commande et affiche la réponse sur son OLED.</>,
    ],
  },

  flow: {
    stages: [
      { tag: 'Sur l’ESP32', title: 'Déclencheur et micro', text: 'Un mot d’éveil ou le push-to-talk lance la capture de l’INMP441 en audio mono 16 kHz.' },
      { tag: 'Serveur FastAPI, OpenRouter', title: 'Whisper, DeepSeek et validation', text: 'Whisper transforme la parole en texte et un modèle DeepSeek en fait une seule commande JSON, que le serveur vérifie par rapport au schéma, avec un nouvel essai avant un no-op.' },
      { tag: 'Dans la pièce', title: 'Appareils et OLED', text: 'La LED, le RGB, le ventilateur, le servo et le buzzer répondent, et l’OLED affiche la réponse.' },
    ],
    links: ['stream vers /upload', 'commande MQTT'],
    caption: 'Le chemin d’une commande vocale, de l’ESP32 aux appareils de la pièce en passant par le serveur',
  },

  brain: {
    h: 'Le parseur de commandes',
    p: 'Le modèle ne pilote jamais un appareil directement, il convertit plutôt chaque phrase en exactement une de ces trois formes JSON :',
    shapes: [
      <><b>action</b> est un seul changement, comme « allume le ventilateur » ou « mets-le en cyan ».</>,
      <><b>sequence</b> est une suite d’étapes ordonnées, chacune avec un délai compté à partir du moment où tu as parlé, comme « éteins les lumières, puis le ventilateur une seconde après ».</>,
      <><b>timer</b> est un seul changement après un compte à rebours, comme « éteins la lumière dans dix minutes ».</>,
    ],
    p2: 'Ça marche aussi dans d’autres langues, parce que Whisper transcrit beaucoup de langues et que le parseur ramène chacune au même vocabulaire JSON. Une commande dite en malais ou en mandarin donne la même action que la version anglaise.',
    p3: 'Un prompt système long et strict fixe le vocabulaire des appareils (LED blanche, NeoPixel RGB, ventilateur, servo, buzzer, plage de confort, mode auto), impose du JSON valide avec les nombres écrits comme des nombres, et demande au modèle de convertir lui-même les noms de couleurs en RGB. Le serveur vérifie chaque réponse par rapport à un schéma, et si l’une échoue, il réessaie une fois puis se rabat sur un no-op au lieu d’envoyer à la carte quelque chose dont il ne peut pas être sûr.',
    p4: <>Le modèle peut aussi se servir des mesures de la pièce comme entrées. Quand je lui demande de « régler la luminosité sur le pourcentage d’humidité », il lit l’humidité en direct dans l’état des capteurs en cache, l’arrondit, la ramène dans la plage de 0 à 100 de la LED et émet une vraie commande <code>set_brightness</code>.</>,
  },

  chart: {
    aria: 'Un organigramme de l’analyse des commandes. Whisper transcrit la parole dans de nombreuses langues, puis le texte et le contexte des capteurs en direct vont au LLM DeepSeek. Si le JSON de sortie échoue à la validation du schéma, le serveur réessaie une fois, et s’il est toujours invalide, le résultat est un no-op sans risque. S’il est valide, la commande est aiguillée selon son type : une action pour un seul changement d’appareil, une sequence pour des étapes ordonnées avec des délais, ou un timer pour un seul changement après un compte à rebours.',
    input: { t: 'Texte transcrit et contexte capteurs', s: 'Transcription Whisper et état de la pièce du cache MQTT' },
    note: { t: 'Entrée multilingue', s: 'Whisper gère plein de langues' },
    badge: 'Parle plein de langues',
    llm: { t: 'LLM DeepSeek (via OpenRouter)', s: 'Fait de la demande une commande JSON' },
    valid: ['Schéma JSON', 'valide ?'],
    validOne: 'Schéma JSON valide ?',
    yes: 'Oui',
    no: 'Non',
    fails: 'échec',
    route: { t: 'Aiguillage par type', s: 'action, sequence ou timer' },
    outcomes: ['Un appareil change', 'Étapes avec délais', 'Un changement différé'],
    retry: { t: 'Un réessai', s: 'relancer le LLM', phone: 'Relancer le LLM' },
    noop: { t: 'No-op sûr', s: 'réponse, sans action', phone: 'Réponse seule, aucune action sur la pièce' },
    ifInvalid: 'si invalide',
    failurePath: 'Chemin d’échec',
    stillFails: 'échoue encore',
    ifValid: 'si valide',
    byType: 'par type',
    caption: 'Le trajet d’une commande vocale dans le parseur, où chaque chemin finit en action, en sequence, en timer ou en refus qui ne fait rien',
  },

  prompt: {
    eyebrow: 'Le prompt système que LUMEN envoie au modèle',
    viewAria: 'Vue du prompt',
    formatted: 'Formaté',
    code: 'Code',
    more: 'Voir tout le prompt',
    less: 'Voir moins',
  },

  hardware: {
    h: 'Matériel',
    p1: 'Tout est branché sur un seul ESP32-WROOM sous MicroPython, avec les entrées d’un côté et les sorties de l’autre. Une seule boucle principale non bloquante les sert toutes, donc la détection du déclencheur ne se bloque jamais.',
    p2: 'La LDR est un module de lumière numérique avec son propre potentiomètre de sensibilité, donc il n’y a aucune lecture analogique, ce qui évite le conflit entre l’ADC de l’ESP32 et le WiFi. Une LED rouge s’allume seulement pendant que le micro enregistre, et un OLED SSD1306 avec deux boutons de navigation affiche l’état et la dernière commande sur quatre pages. Le module de mot d’éveil DF2301Q est câblé et son driver est écrit, mais sur le banc, je fais la démo avec le bouton push-to-talk.',
    micAlt: 'Gros plan sur le micro I2S INMP441 câblé à l’ESP32',
    micCaption: 'Le micro I2S INMP441.',
  },

  hub: {
    aria: 'Une carte de câblage avec un ESP32-WROOM au centre. Les capteurs et leurs broches sont à gauche : le micro INMP441 en I2S (GPIO 14, 23, 32), le DHT22 (GPIO 4), le PIR (GPIO 35), la LDR (GPIO 34) et le bouton push-to-talk (GPIO 19). Les sorties sont à droite : la LED blanche (GPIO 25), le NeoPixel (GPIO 27), le ventilateur (GPIO 26), le servo (GPIO 13), le buzzer (GPIO 33) et la LED d’enregistrement (GPIO 17). En bas, le bus I2C partagé (SDA 21, SCL 22) porte l’OLED SSD1306 (0x3C) et le module de mot d’éveil DF2301Q (0x64), et deux boutons de navigation sont sur les GPIO 18 et 16.',
    inputs: 'Capteurs et entrées',
    outputs: 'Sorties',
    bus: 'Bus I2C (SDA 21, SCL 22) et boutons de nav',
    core: { t: 'ESP32', s: ['WROOM, MicroPython', 'une boucle non bloquante'], phone: 'ESP32-WROOM', phoneS: 'MicroPython, une boucle non bloquante' },
    parts: {
      mic: { n: 'Micro INMP441', s: 'micro I2S' },
      dht: { n: 'DHT22', s: 'température et humidité' },
      pir: { n: 'PIR', s: 'mouvement' },
      ldr: { n: 'Module LDR', s: 'clair ou sombre' },
      ptt: { n: 'Bouton PTT', s: 'push-to-talk' },
      led: { n: 'LED blanche', s: 'luminosité PWM' },
      neo: { n: 'NeoPixel', s: 'RGB WS2812' },
      fan: { n: 'Ventilo', s: 'on ou off' },
      servo: { n: 'Servo', s: '0 à 180°' },
      buzzer: { n: 'Buzzer', s: 'bips et alertes' },
      rec: { n: 'LED REC', s: 'enregistre' },
      oled: { n: 'OLED', s: 'SSD1306, 0x3C' },
      wake: { n: 'DF2301Q', s: 'mot d’éveil, 0x64' },
      navA: { n: 'Nav A', s: 'page' },
      navB: { n: 'Nav B', s: 'page' },
    },
    caption: 'Chaque composant et le GPIO qu’il utilise, avec l’OLED et le DF2301Q qui partagent un seul bus I2C',
  },

  memory: {
    h: 'Tenir en mémoire',
    p1: 'L’ESP32-WROOM n’a pas de PSRAM, et avec le WiFi actif, MicroPython me laissait environ 33 Ko de RAM utilisable. Un clip vocal fait environ 96 Ko, donc l’audio ne peut pas tenir en mémoire d’un seul coup.',
    p2: <>Pour contourner ça, rien ne garde jamais le clip entier. Le micro est une seule instance persistante et préchauffée, les buffers de capture sont petits et alloués à la demande, et l’envoi est <strong>streamé sur un socket brut</strong> pendant l’enregistrement : un préambule, l’en-tête WAV, le PCM morceau par morceau, puis une fin. Ça garde le pic de mémoire pendant un envoi autour de 10&nbsp;Ko. Si je construis plutôt un gros objet <code>bytes</code>, le garbage collector doit prendre un bloc d’environ 26&nbsp;Ko dans le même tas dont ont besoin le WiFi et le micro I2S, ce qui affame la pile réseau jusqu’à ce que l’envoi expire.</>,
    p3: <>Le firmware actuel embarque un écran d’état léger de quatre pages sur l’OLED, parce qu’une version plus riche, avec des valeurs de capteurs rafraîchies en direct et un écran d’enregistrement, faisait tellement grossir le tas que le démarrage cassait. Avec elle, la carte ne pouvait plus se connecter à MQTT (<code>ENOBUFS</code>) ni ouvrir le micro (<code>ENOMEM</code>). Pour faire de la place, j’ai aussi retiré l’horloge temps réel et les programmations à heure fixe, donc les minuteurs tournent maintenant sur un compteur de ticks monotone et n’ont besoin d’aucune horloge.</>,
  },

  auto: {
    h: 'Mode auto',
    p: [
      'Le mode auto tourne en local sur la carte. Quand il détecte du mouvement alors que la pièce est sombre, il allume la LED blanche et l’éteint après cinq minutes sans mouvement. Quand la température dépasse la plage de confort, il allume le ventilateur, avec un écart d’hystérésis pour que le ventilateur ne passe pas son temps à s’allumer et s’éteindre autour du seuil.',
      'N’importe quelle commande vocale passe en priorité et efface l’état automatique, donc le mode auto n’écrase jamais une lumière que tu viens de régler.',
    ],
  },

  deploy: {
    h: 'Dashboard et déploiement',
    p: [
      'Le serveur est une appli FastAPI dockerisée avec un tableau de bord web : les commandes des appareils (LED blanche, sélecteur RGB, ventilateur, servo, buzzer, interrupteur du mode auto, réglage de la plage de confort), l’état en direct, un graphique de l’historique de température et d’humidité, un journal des commandes récentes, un lecteur pour les derniers enregistrements vocaux, et une zone de texte qui suit le même chemin vers le LLM. La zone de texte, c’est ma roue de secours au cas où le micro lâche pendant une démo en direct, et une remise à zéro efface le graphique, le journal et les enregistrements.',
      'Il tourne sur mon homelab derrière Nginx Proxy Manager et Cloudflare, qui servent le tableau de bord sur un nom d’hôte HTTPS. Le broker MQTT est joint directement plutôt qu’à travers Cloudflare, et l’ESP32 ne parle qu’à une adresse du LAN au lieu du nom d’hôte public, ce qui garde le firmware léger.',
    ],
    dashAlt: 'Le tableau de bord web de LUMEN : commandes des appareils, état en direct, graphique de l’historique et journal d’activité',
    dashCaption: 'Le tableau de bord web de LUMEN',
  },

  slides: {
    h: 'Diapos',
    p: 'Voici la présentation que j’ai faite à la revue du module, qui couvre la consigne, le pipeline, le travail sur la mémoire et la démo.',
    frame: 'Présentation du projet LUMEN (diapos Figma)',
  },

  next: {
    h: 'Ce que j’ajouterais',
    p: 'Un ESP32-S3 avec de la PSRAM ramènerait presque tout ce que j’ai coupé, parce que le WROOM est déjà à sa limite quand il streame l’audio du micro tout en faisant tourner le WiFi et MQTT.',
    items: [
      <><b>Un OLED plus riche</b>, avec les pages de capteurs rafraîchies en direct et l’écran d’enregistrement que j’ai dû retirer.</>,
      <><b>Des programmations à heure fixe</b> (« tous les jours à 8&nbsp;h »), qui ont besoin de l’horloge temps réel que j’ai retirée pour gagner de la mémoire.</>,
      <><b>Un historique durable</b>, pour que les graphiques du tableau de bord et les minuteurs survivent à un redémarrage, parce qu’aujourd’hui les deux dernières heures environ ne vivent qu’en RAM.</>,
      <><b>Un mot d’éveil qui marche</b> sur le matériel, pour que le push-to-talk devienne la solution de secours plutôt que le déclencheur principal.</>,
    ],
  },
};

export default fr;
