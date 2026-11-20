import { usePeekKit, type PeekLabels } from './kit';

/*
  The peek reader in French: the same write-ups as en.tsx, words translated.
  Image paths and links stay as they are; internal links are localized by the kit.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Pantry Expiry Tracker', 'proj-ruler': 'Scroll Ruler', 'proj-cadmouse': '3D CAD Mouse', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus Dispenser', 'proj-elecf': 'ELEC-F Concept',
  'proj-kauli': 'Kauli Concept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Web Development', 'proj-mc': 'Minecraft Live Map',
};

export const LABELS: PeekLabels = {
  soon: 'Article bientôt',
  next: 'Suite : {title}',
  untitled: 'Projet {n}',
  pullHint: 'Continue à défiler pour {title}',
  pullAria: 'Ouvrir le projet suivant : {title}',
  end: 'Voilà tous les projets',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Le rover Project June', ['Projet perso'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 semaines · Autodidacte · Design 3D · Cellulaire · WebRTC · MQTT</p>
          <p className="hp-rd-lead">Un rover 5G que j&rsquo;ai construit en trois semaines, qui diffuse trois caméras en direct, embarque une suite complète de capteurs et se pilote avec une manette Xbox partout où il y a du réseau.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Trois flux vidéo en direct', <><p>Trois caméras diffusent en direct en WebRTC via un serveur TURN, si bien que les flux traversent le NAT cellulaire avec une faible latence.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Les caméras de Project June" loading="lazy" /></>)}
          {chapter('02', 'Contrôle et télémétrie', <p>MQTT transporte le contrôle et la télémétrie via un broker Mosquitto, avec une commande moteur PWM maison et une direction par servo, le tout piloté par une manette Xbox.</p>)}
          {chapter('03', 'Une suite complète de capteurs', <><p>Le rover embarque un GPS Neo8M, un gyroscope, un accéléromètre, un magnétomètre, un baromètre, un capteur de distance à ultrasons, un DHT11 et un capteur de lumière TEMT6000.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="L’architecture du système Project June" loading="lazy" /></>)}
          {cta('Tout le carnet de bord', 'L’article couvre les photos, l’architecture et chaque problème que j’ai rencontré.', 'Lire l’article complet', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, un compagnon de bureau cyan, sur la M5Stack Tab5', ['Projet de stage'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 semaine · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">Un compagnon de bureau sur une M5Stack Tab5 dont le cerveau est le DeepSeek Harness sur mon serveur, ce qui lui permet de piloter un navigateur, de créer ses propres applis et de garder un œil sur mes autres agents.</p>
          {chapter('01', 'Un compagnon qui montre ce qu’il fait', <><p>Pip dort quand tu le laisses tranquille, se réveille quand tu prends la tablette, se tortille et se masse les tempes pendant qu&rsquo;il réfléchit, et saute de joie quand quelque chose marche. Il mime aussi chaque outil qu&rsquo;il utilise, en sortant des jumelles pour lire une page ou un mégaphone pour briefer un assistant.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip avec une loupe, des jumelles, un mégaphone et un avion en papier" loading="lazy" /></>)}
          {chapter('02', 'Il se sert de l’écran', <p>Les réponses arrivent sous forme de pages et de texte mis en forme, et Pip peut cliquer dans ces pages avec son propre curseur ou me poser des questions à choix multiples. Il crée aussi de petites applis qu&rsquo;il range dans un tiroir, soit des pages web servies depuis mon serveur, soit des scripts Lua qui tournent sur la tablette elle-même.</p>)}
          {chapter('03', 'Un hub pour mes agents', <><p>Pip tourne dans le même harness que mes sessions de code, confie les longues tâches à des pips assistants, et me prévient quand une session se termine ou attend une réponse.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Des pips assistants au travail avec un bloc-notes, un ordinateur portable, des cubes, un livre et une fiole" loading="lazy" /></>)}
          {cta('Vois Pip bouger', 'L’article montre ses humeurs, ses applis et ses bureaux, et comment tout se connecte.', 'Lire l’article complet', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('Le suivi de garde-manger, une CoreS3 SE posée sur le module QRCode', ['Projet de stage'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pantry Expiry Tracker</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">Un suivi des dates de péremption pour la porte du frigo. Tu scannes le code-barres d&rsquo;un produit et tu choisis quand il expire, et l&rsquo;écran montre toujours quoi manger en premier.</p>
          {chapter('01', 'Scanner, puis enregistrer', <><p>L&rsquo;écran s&rsquo;allume en rouge pendant que le scanner cherche un code, puis affiche le nom, la marque et la photo du produit depuis Open Food Facts ou GS1 China, et tu règles la date avec les sélecteurs Days, Weeks et Months avant d&rsquo;enregistrer.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="Le sélecteur de date de péremption sur l’appareil" loading="lazy" /></>)}
          {chapter('02', 'Quoi manger en premier', <><p>L&rsquo;écran d&rsquo;accueil trie le garde-manger par date de péremption et passe le compteur en rouge à moins d&rsquo;un jour et en orange à moins d&rsquo;une semaine, et scanner un produit déjà dans la liste l&rsquo;ouvre au lieu de l&rsquo;ajouter deux fois.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="L’écran d’accueil trié par date de péremption" loading="lazy" /></>)}
          {chapter('03', 'Un serveur fait le reste', <p>Un conteneur Docker sur le réseau de la maison garde la liste, cherche les codes-barres, sert une page web pour gérer les garde-manger et publie chacun d&rsquo;eux vers Home Assistant en MQTT pour les rappels.</p>)}
          {cta('Essaie le suivi', 'L’article a une copie qui marche de son écran, la vidéo de démo et comment en monter un.', 'Lire l’article complet', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('Le Scroll Ruler, un AtomS3R avec un Unit Scroll branché', ['Projet de stage'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Scroll Ruler</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">Une règle numérique. Tu appuies sur la molette du Unit Scroll et tu la fais rouler le long de ce que tu veux mesurer, et l&rsquo;AtomS3R affiche la distance en centimètres.</p>
          {chapter('01', 'Calibrer une fois', <><p>Au premier démarrage, tu fais rouler exactement 10&nbsp;cm le long d&rsquo;une vraie règle et tu touches l&rsquo;écran pour enregistrer les pas comptés, ce qui lui apprend la distance parcourue par la molette à chaque pas. Ensuite, la calibration reste en flash.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="La règle qui affiche 8,2 cm" loading="lazy" /></>)}
          {chapter('02', 'Rouler pour mesurer', <p>La distance ne compte que tant que la molette est enfoncée, avec la LED allumée en vert, donc tu peux la soulever et la reposer sans perdre la mesure. Toucher l&rsquo;écran la remet à zéro, et le maintenir lance une nouvelle calibration.</p>)}
          {chapter('03', 'Testé hors de l’appareil', <p>Les calculs de calibration et de distance sont dans un seul fichier sans code matériel, si bien que onze tests unitaires les vérifient sur un ordinateur avant que le firmware parte sur l&rsquo;AtomS3R.</p>)}
          {cta('Fais-la rouler toi-même', 'L’article a une copie qui marche de la règle, la vidéo de démo et comment en flasher une.', 'Lire l’article complet', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan avec quatre capteurs de distance Unit ToF4M sur la tête', ['Projet de stage'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · quatre Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">Un LiDAR de fortune. Stack-chan balaie une pièce avec quatre capteurs de distance grâce à ses deux servos, sa caméra colore les points, et n&rsquo;importe quel navigateur sur le même Wi-Fi affiche le scan en 3D.</p>
          {chapter('01', 'Le balayage', <><p>La tête parcourt une grille ligne par ligne, de l&rsquo;horizontale jusqu&rsquo;à la verticale et jusqu&rsquo;à 256 degrés de large, et chaque position devient un échantillon&#8239;: une direction donnée par les servos et une distance donnée par les capteurs.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="Le scan terminé d’un coin de pièce aux couleurs de la caméra" loading="lazy" /></>)}
          {chapter('02', 'Quatre capteurs, une mesure', <p>Les quatre capteurs pointent dans la même direction, donc chaque échantillon garde la médiane de leurs mesures, ce qui élimine une valeur aberrante.</p>)}
          {chapter('03', 'La couleur de la caméra', <p>Des photos prises avant le balayage colorent les points, et le navigateur pousse chaque pixel jusqu&rsquo;à la distance mesurée, ce qui a donné 68&#8239;206 points colorés dans ce scan.</p>)}
          {cta('Explore le scan', 'L’article a le vrai scan en 3D, le film de démo et comment en flasher un.', 'Lire l’article complet', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('La M5Stack Capsule v1.1 qui sert de souris 3D', ['Projet de stage'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D CAD Mouse</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Une souris 3D sans fil pour Onshape. Tu cliques sur le bouton de la Capsule et tu la tournes dans ta main, et le modèle à l&rsquo;écran tourne avec elle.</p>
          {chapter('01', 'Se faire passer pour une SpaceMouse', <p>Onshape n&rsquo;écoute une souris 3D qu&rsquo;à travers le pilote de 3Dconnexion, alors la Capsule se présente en Bluetooth comme leur SpaceMouse Wireless et le pilote fait le reste.</p>)}
          {chapter('02', 'Suivre ta main', <><p>Elle envoie la vitesse à laquelle ta main tourne, mesurée par son gyroscope, pour que le modèle tourne du même angle que ta main. Maintenir le bouton fait un panoramique à la place, et la torsion zoome.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Faire tourner un boîtier dans Onshape avec la Capsule" loading="lazy" /></>)}
          {chapter('03', 'Testé hors de l’appareil', <p>Les calculs de mouvement et les gestes du bouton sont dans une seule bibliothèque sans code matériel, si bien que 19 tests unitaires les vérifient sur un ordinateur avant chaque flash.</p>)}
          {cta('Tourne-la toi-même', 'L’article a une copie qui marche de ses commandes, la vidéo de démo et comment en monter une.', 'Lire l’article complet', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Projet perso'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 mois · Autodidacte · Design 3D · Conception de PCB</p>
          <p className="hp-rd-lead">Une paire de messagers portables ESP32 qui se parlent hors réseau&#8239;: du texte en LoRa longue portée et de la voix bidirectionnelle en ESP-NOW.</p>
          {chapter('01', 'Deux radios, deux rôles', <><p>LoRa transporte le texte sur de longues distances tandis qu&rsquo;ESP-NOW transporte la voix bidirectionnelle à faible latence, et j&rsquo;ai programmé les deux appareils dans PlatformIO avec le framework Arduino.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="L’intérieur du LoRA Messenger" loading="lazy" /></>)}
          {chapter('02', 'Un PCB maison, soudé à la main', <><p>J&rsquo;ai conçu la carte dans KiCAD et soudé moi-même les composants CMS par refusion, et un circuit TP4056 sur la carte gère la charge.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="PCB sur mesure" loading="lazy" /></>)}
          {chapter('03', 'Audio et boîtier', <><p>Un micro et un haut-parleur I2S gèrent les appels et deux écrans OLED affichent les messages et l&rsquo;état, le tout dans un boîtier imprimé en 3D que j&rsquo;ai modélisé dans Onshape.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="Boîtier imprimé en 3D" loading="lazy" /></>)}
          {cta('Comment tout s’est assemblé', 'L’article couvre l’étape sur breadboard, les révisions du PCB et ce que j’ai appris.', 'Lire l’article complet', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('L’assistant vocal LUMEN', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP, programmation IoT · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">Un assistant vocal pour pièce connectée qui se réveille quand tu dis «&#8239;Hello Robot&#8239;». Un ESP32 capte ce que tu dis ensuite, un relais FastAPI le transcrit et demande à un LLM une seule commande JSON stricte, et cette commande repart vers la pièce en MQTT.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'De la parole à une commande JSON', <p>L&rsquo;ESP32 envoie en continu de l&rsquo;audio 16&nbsp;kHz au serveur, où Whisper le transcrit via OpenRouter et un LLM DeepSeek le transforme en exactement une commande (une action, une séquence ou un minuteur), vérifiée contre un schéma avant d&rsquo;atteindre la carte.</p>)}
          {chapter('02', 'Tenir sur une carte sans PSRAM', <><p>Le WROOM avait environ 33&nbsp;Ko de RAM libre avec le WiFi actif alors qu&rsquo;un clip vocal fait environ 96&nbsp;Ko, donc l&rsquo;audio est envoyé sur un socket brut pendant l&rsquo;enregistrement au lieu d&rsquo;être gardé en mémoire, et le pic de mémoire pendant un envoi reste autour de 10&nbsp;Ko.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="Le micro INMP441 câblé à l’ESP32" loading="lazy" /></>)}
          {chapter('03', 'Une pièce à qui parler', <><p>Des lumières, un NeoPixel, un ventilateur, un servo et un buzzer répondent aux commandes, et il y a aussi un mode auto local et un tableau de bord web. Si tu lui demandes de «&#8239;régler la luminosité sur l&rsquo;humidité&#8239;», il lit le capteur en direct et fait exactement ça.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="Le tableau de bord web de LUMEN" loading="lazy" /></>)}
          {cta('Voir tout le projet', 'L’article couvre les limites de mémoire, le câblage et une démo interactive.', 'Lire l’article complet', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('L’OCR Reader avec DrumNet : une solution OCR de compteur d’eau entièrement intégrée verticalement', ['Projet perso'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">Une caméra sur batterie et bon marché qui se monte sur un compteur d&rsquo;eau mécanique et lit les tambours avec un réseau de neurones de 693K paramètres qui tourne entièrement sur un ESP32-S3, puis envoie le nombre à la maison en LoRaWAN.</p>
          {chapter('01', 'DrumNet sur la puce', <><p>Un détecteur trouve la fenêtre des chiffres, un affineur précise ses bords en faisant la moyenne des colonnes et des lignes des cartes de caractéristiques, et trois lecteurs votent sur chaque tambour en appliquant la règle de retenue. Tout le réseau tourne en INT8 et prend environ 2 secondes par lecture.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="Le vote de l’ensemble DrumNet et la lecture" loading="lazy" /></>)}
          {chapter('02', 'Entraîné par six agents', <><p>MeterSim génère des compteurs étiquetés et SimGen2 leur donne l&rsquo;air de vraies photos, tandis que six agents IA se relayaient sur le GPU et la plateforme Jetson grâce à un planificateur de réservations, 24&nbsp;h/24 et 7&nbsp;j/7 via Tailscale et T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="Les neuf modèles de compteur dans MeterSim" loading="lazy" /></>)}
          {chapter('03', 'Une carte, une coque, 9 heures de refusion', <><p>Le PCB KiCad à 4 couches embarque la gestion de la batterie, LoRa et des LED en PWM, et je l&rsquo;ai assemblé à la main, débogué au microscope et logé dans un boîtier imprimé en 3D sans outils, avec un adaptateur pour le compteur.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="Rendu 3D de la carte Prototype V2" loading="lazy" /></>)}
          {cta('Parcours tout le pipeline', 'L’article suit l’exécution de DrumNet étape par étape, avec une visite 3D de la carte, un simulateur ConfigKing et le rapport complet.', 'Lire l’article complet', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('Le lecteur de livres privé BeadReader', ['Projet perso'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Appli web · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Autodidacte</p>
          <p className="hp-rd-lead">Un petit lecteur de livres en ligne privé pour une poignée d&rsquo;amis, qui se connectent avec un seul code d&rsquo;accès. L&rsquo;appli retient exactement où tu t&rsquo;es arrêté, montre qui d&rsquo;autre est en train de lire et suit la progression de chacun.</p>
          {chapter('01', 'Une bibliothèque qui se souvient', <><p>Quand tu ouvres un livre, il revient au chapitre et à la position de défilement exacts, enregistrés sous forme de fraction pour que tout reste aligné après un changement de taille de police, et la couleur, la police et la mise en page de chaque lecteur sont aussi sauvegardées.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="La vue de lecture" loading="lazy" /></>)}
          {chapter('02', 'Lire ensemble', <><p>Tu vois qui est en ligne, tu repères un ami dans le même livre grâce à son anneau vert et au numéro de son chapitre, et tu peux lui envoyer un coucou ou un petit mot qui disparaît.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="La présence et les messages rapides" loading="lazy" /></>)}
          {chapter('03', 'Un filtre appliqué en SQL', <p>Les chapitres explicites sont filtrés dans la requête même de la base de données, donc le texte filtré ne quitte jamais le serveur pour un lecteur sans accès. Le même chapitre peut s&rsquo;afficher différemment pour chaque lecteur, et le mode cal le supprime complètement.</p>)}
          {cta('Voir tout le projet', 'L’article couvre la présence, le filtre de contenu, les webtoons et la stack.', 'Lire l’article complet', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA Smart Home System', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA Smart Home System</h2>
          <p className="hp-md-meta">3 mois · Projet de groupe à l&rsquo;école · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">Une maison connectée construite par mon équipe de cinq pour un module sur la vie durable, et notée A. Quatre nœuds BeagleBone remontent leurs données à un serveur SocketIO qui fait tourner un tableau de bord 3D en direct.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Quatre nœuds, un rôle chacun', <><p>Les quatre nœuds couvrent le climat, la salle de bain, la cuisine (l&rsquo;énergie du frigo et une alarme incendie) et l&rsquo;intrusion, et chaque BeagleBone Black Wireless embarque des modules de capteurs MikroBUS.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="Le matériel du nœud cuisine" loading="lazy" /></>)}
          {chapter('02', 'Un seul serveur pour tous', <><p>Chaque nœud se connecte à un serveur web SocketIO, qui héberge le tableau de bord et déclenche l&rsquo;alarme incendie sur tous les nœuds à la fois.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="Comment chaque partie du système se connecte" loading="lazy" /></>)}
          {chapter('03', 'Un tableau de bord 3D en direct', <><p>Le tableau de bord affiche les données en direct sur un modèle 3D Spline de la maison, et j&rsquo;ai conçu son interface dans Figma.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="Le tableau de bord 3D EMA" loading="lazy" /></>)}
          {cta('Essaie-le ou lis l’article', 'Il y a une démo en ligne du tableau de bord ainsi que l’article complet du projet.', 'Démo en ligne', 'https://csdpdemo.chiambucket.com', { label: 'Lire l’article', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus Dispenser', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus Dispenser</h2>
          <p className="hp-md-meta">1 mois · Premier projet d&rsquo;école · Design 3D · PyFirmata</p>
          <p className="hp-rd-lead">Mon premier projet d&rsquo;école était un distributeur de sirop imprimé en 3D en six pièces, et chaque pièce s&rsquo;est ajustée dès la première impression.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Ce qu’il fait', <><p>Il verse trois tailles de gobelet, se réveille quand quelqu&rsquo;un s&rsquo;approche, et a une porte à servo et une LED haute puissance pour éclairer le gobelet.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Le modèle Pandus dans Onshape" loading="lazy" /></>)}
          {chapter('02', 'Commande et composants', <><p>Un Arduino Uno R3 piloté avec PyFirmata fait fonctionner un servo, des LED, une carte relais, des boutons, une pompe DC et un module infrarouge de détection d&rsquo;obstacle.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="L’organigramme du Pandus" loading="lazy" /></>)}
          {cta('Tout le projet', 'L’article couvre les pièces, les organigrammes et le modèle Onshape.', 'Lire l’article complet', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F, un système de congélateur sécurisé', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F Concept</h2>
          <p className="hp-md-meta">Stockage frigorifique sécurisé · Équipe de 4 · Cours d&rsquo;ingénierie · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">Un système de sécurité pour congélateur que mon équipe et moi avons conçu pour un cours d&rsquo;ingénierie. Les chambres froides d&rsquo;usine peuvent piéger les personnes qui y travaillent, alors ELEC-F surveille la porte et la pièce et donne l&rsquo;alerte avant que le froid devienne dangereux.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Le problème', <><p>Des loquets défectueux, des joints gelés ou une simple inattention peuvent laisser un travailleur enfermé dans une chambre froide, où l&rsquo;hypothermie arrive vite. ELEC-F est là pour réduire ce temps et rassurer la personne coincée.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="Le prototype de congélateur ELEC-F" loading="lazy" /></>)}
          {chapter('02', 'Comment ça marche', <><p>Un capteur ToF détecte si la porte est ouverte ou fermée, et un capteur PIR vérifie si quelqu&rsquo;un est encore à l&rsquo;intérieur. Si la porte se ferme avec une personne dedans, un minuteur démarre, et quand il arrive à zéro, l&rsquo;unité RGB clignote et le buzzer sonne.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="L’état armé d’ELEC-F sur le M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Construit sur M5Stack', <><p>Deux contrôleurs M5Stack Fire et un Mini Hub relient les unités ToF, PIR et RGB, choisis parce qu&rsquo;ils continuent de fonctionner aux températures négatives qu&rsquo;exige un congélateur.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="Le contrôleur M5Stack câblé à ses capteurs" loading="lazy" /></>)}
          {cta('Voir tout le concept', 'L’article couvre la recherche, la construction et une visite interactive.', 'Lire l’article complet', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli Concept', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli Concept</h2>
          <p className="hp-md-meta">Concept · Communication · 3D dans Blender</p>
          <p className="hp-rd-lead">Un concept de produit original que j&rsquo;ai créé et présenté pour un projet de communication, avec des scènes 3D construites dans Blender.</p>
          {chapter('01', 'De l’idée à la présentation', <><p>Le sujet portait autant sur la façon de communiquer une idée que sur l&rsquo;idée elle-même, alors j&rsquo;ai conçu le concept, je l&rsquo;ai rendu dans Blender et j&rsquo;ai monté la présentation pour l&rsquo;exposer clairement à un public.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Rendu du concept Kauli" loading="lazy" /></>)}
          {soon('Le concept Kauli', 'Les rendus et le pitch auront droit à un article complet.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Projet perso'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Perso · Design 3D · Ultraléger 20&nbsp;g</p>
          <p className="hp-rd-lead">Ma propre version de la populaire ZeroMouse, une souris gaming ultralégère de 20&nbsp;g que j&rsquo;ai conçue de zéro pour jouer un peu mieux aux FPS.</p>
          {chapter('01', 'Concevoir au gramme près', <p>Chaque partie de la coque a été modélisée pour perdre du poids sans perdre en rigidité, en équilibrant le confort de prise et l&rsquo;objectif d&rsquo;environ 20 grammes.</p>)}
          {soon('Series One Light', 'Le modèle et ses compromis auront droit à un article complet.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Le PCB Copy Board', ['Projet perso'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Perso · Conception de PCB · KiCAD · 1 semaine</p>
          <p className="hp-rd-lead">Une recréation de zéro dans KiCAD de la carte de dev ATMega328 de NYP, faite pour avoir ma propre copie à la maison.</p>
          {chapter('01', 'Rétro-conçue, puis refaite', <p>J&rsquo;ai recréé la carte de l&rsquo;école dans KiCAD à partir de son schéma, et comme certains composants n&rsquo;étaient plus fabriqués, j&rsquo;ai trouvé des remplaçants, puis j&rsquo;ai utilisé la carte pour mon premier vrai essai de soudure par refusion.</p>)}
          {soon('Copy Board', 'La recherche des composants, le routage et la refusion auront droit à un article complet.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Projet de développement web', ['Projet d’école'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Web Development Project</h2>
          <p className="hp-md-meta">École · HTML &amp; CSS · Premier site</p>
          <p className="hp-rd-lead">Le premier site entièrement fonctionnel que j&rsquo;ai construit, en HTML et CSS, pour le dernier devoir de mon cours de développement web. Ce site-ci était ma deuxième tentative.</p>
          {chapter('01', 'Là où tout a commencé', <p>C&rsquo;était ma première approche du développement web, et ça montre le chemin parcouru depuis.</p>)}
          {soon('Voir où tout a commencé', 'Le site est toujours en ligne.', { label: 'Démo en ligne', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft Live Map', ['Projet perso'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft Live Map</h2>
          <p className="hp-md-meta">Perso · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">Un serveur Minecraft auto-hébergé sur le homelab, avec une carte web en direct du monde multijoueur que tout le monde peut parcourir en temps réel.</p>
          {chapter('01', 'Serveur et carte', <p>Un serveur Paper tourne dans Docker avec le plugin Dynmap, qui génère une carte interactive en direct, mise à jour à mesure que les joueurs explorent et construisent.</p>)}
          {soon('Explore le monde en direct', 'La carte en direct est ouverte à tous.', { label: 'Ouvrir la carte', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
