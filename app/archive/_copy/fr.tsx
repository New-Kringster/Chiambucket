import type { ArchiveCopy } from './en';

/* The /archive page in French. Same shape as en.tsx. Words quoted from the old
   designs stay in English, as they appear in the screenshots. */
const fr: ArchiveCopy = {
  meta: {
    title: 'Deux ans de chiambucket.com | Braven Chiam',
    description:
      'Tous les designs qu’a eus chiambucket.com depuis septembre 2024, d’un site WordPress jusqu’à l’histoire peinte qui se déroule au défilement, avec des captures et une copie fonctionnelle de chaque ancienne version.',
    ogTitle: 'Deux ans de chiambucket.com',
    ogDescription: 'Huit designs depuis septembre 2024, et une copie fonctionnelle de chacun des anciens.',
  },
  ldName: 'Deux ans de chiambucket.com',
  ldItem: 'v{n} : {name} ({when})',

  title: 'Deux ans de chiambucket.com',
  lede:
    'Au départ, c’était une page WordPress où je partageais les liens de quelques-uns de mes services auto-hébergés, mais c’est depuis devenu mon blog perso et mon portfolio. Trois migrations et huit refontes plus tard, voici la plus grosse refonte de mon site à ce jour. Avec l’aide de Claude, j’ai archivé chaque grande refonte sur cette page, et tu peux visiter n’importe laquelle pour voir à quoi ressemblait chiambucket.com avant.',
  stripLabel: 'Les huit versions, chacune aussi large que le temps pendant lequel elle était en ligne',
  segLabel: 'v{n}, {name}, {when}',
  today: 'Aujourd’hui',

  srName: 'v{n} : ',
  builtWith: 'Fait avec {built}',
  backHome: 'Retour à l’accueil',
  open: 'Voir v{n}',

  fact: {
    kicker: 'Anecdote',
    title: 'Pourquoi chiambucket.com ?',
    text:
      'Chiambucket, au départ, c’est un surnom qu’un de mes amis proches m’a donné. Quand je cherchais un nom de domaine pour ma nouvelle page d’accueil, chiambucket.com se trouvait être le moins cher disponible, alors je l’ai pris et je l’ai gardé depuis.',
    extra: <><b>Petit bonus&#8239;:</b> je possède aussi <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, et il redirige vers ce site&#8239;!</>,
  },

  versions: {
    1: {
      name: 'Le premier site WordPress',
      when: 'Septembre à octobre 2024',
      built: 'WordPress et Elementor',
      body: 'Mon premier chiambucket.com était un site WordPress que j’avais monté avec Elementor et qui tournait sur mon serveur à la maison. Il était construit autour de son bouton Quick Links, parce que c’était la page où j’envoyais mes amis chaque fois qu’ils me demandaient les liens de mes services auto-hébergés. Plus bas, il y avait un carrousel de mes photos, ma baie homelab et une bande de liens de contact.',
      desktopAlt: 'Une page bleu marine avec « Welcome To Chiambucket! » en blanc et un bouton bleu Quick Links',
      phoneAlt: 'La même page d’accueil bleu marine sur un téléphone',
      detailAlt: 'Une section blanche intitulée « A little bit about myself » au-dessus d’un carrousel de photos de paysages',
    },
    2: {
      name: 'La refonte WordPress',
      when: 'Novembre 2024 au printemps 2025',
      built: 'WordPress et Elementor',
      body: 'Deux mois plus tard, j’ai refait l’en-tête et le menu et ajouté une page À propos de moi. Le titre faisait défiler quelques phrases après « Welcome To My », et la page en dessous montrait un slider qui comparait une de mes photos avant et après retouche, à côté d’une grande photo de la baie homelab.',
      desktopAlt: 'Une page bleu marine avec une barre de menu arrondie et le titre « Welcome To My » au-dessus d’un bouton bleu Quick Links',
      phoneAlt: 'La page d’accueil bleu marine refaite, sur un téléphone',
      detailAlt: 'Une section grise avec un slider photo avant/après sous « My Photos » et la baie homelab sous « My Homelab Journey »',
    },
    3: {
      name: 'Le site noir fait main',
      when: '2025',
      built: 'HTML, CSS et jQuery',
      body: 'En 2025, j’ai quitté WordPress et écrit tout le site moi-même. Il était noir, avec Oswald pour les titres et un projecteur braqué sur une sphère de particules derrière le titre, une scène 3D Spline superbe mais qui faisait ramer tout le site. À côté de mes compétences principales, il y avait un dessin de Sukuna de Jujutsu Kaisen, un personnage que j’aimais beaucoup. Le bouton To BucketCentral devait mener à une page qui regroupait tous mes services auto-hébergés au même endroit, mais j’ai abandonné cette page avant de la construire.',
      desktopAlt: 'Une page noire avec « Welcome To Chiambucket! » éclairé par un projecteur au-dessus d’une sphère de particules',
      phoneAlt: 'La page d’accueil noire au projecteur sur un téléphone',
      detailAlt: 'Des cartes sombres où l’on lit « Hi I am Braven, I shape designs And stir up Creations! » à côté d’un dessin de Sukuna de Jujutsu Kaisen, au-dessus de My Core Skills',
    },
    4: {
      name: 'Le hero en dégradé',
      when: 'Janvier à juin 2026',
      built: 'HTML, CSS et jQuery',
      body: 'En janvier, je l’ai refait encore une fois, toujours à la main, surtout pour me débarrasser des ralentissements et pour essayer les grilles bento, que j’aimais beaucoup. Le haut de la page d’accueil est devenu un dégradé lavande et violet qui disait « Creating with Intention. », et les sections en dessous sont devenues une grille de cartes sombres pour mes outils de CAO et de PCB, mon approche du design et un rendu poussiéreux de Project June.',
      desktopAlt: 'Un dégradé lavande vers violet derrière le titre « Creating with Intention. »',
      phoneAlt: 'Le hero en dégradé sur un téléphone',
      detailAlt: 'Des cartes sombres pour la CAO 3D, la conception de PCB et « A Design first Engineering approach », au-dessus d’un rover qui soulève la poussière',
    },
    5: {
      name: 'La refonte en Next.js',
      when: 'Juin à juillet 2026',
      built: 'Next.js, React et Vercel',
      body: 'En juin, j’ai utilisé Claude pour concevoir le site pour la première fois, je l’ai refait en Next.js et je l’ai passé sur Vercel pour gagner en vitesse et en disponibilité. Chaque page a eu sa propre couleur d’accent, la page d’accueil disait « Creating with Meaning. » sur une lueur bleue, et une nouvelle galerie de tous mes projets permettait de les chercher et de les filtrer, chaque carte ouvrant un court résumé.',
      desktopAlt: 'Une page noire avec « Creating with Meaning. » sur une lueur bleue et deux boutons',
      phoneAlt: 'La page d’accueil Next.js sur un téléphone',
      detailAlt: 'La galerie All projects avec des filtres et des cartes pour Project June, LoRA Messenger et LUMEN',
    },
    6: {
      name: 'Dark Sensory',
      when: 'Juillet à octobre 2026',
      built: 'Next.js, WebGL et Vercel',
      body: 'En juillet, j’ai fait un changement plus petit en gardant la mise en page telle quelle et en ne changeant que le thème de couleurs. Les teintes bleues et violettes commençaient à ressembler à tous les sites faits par IA, alors la plupart des pages sont passées à un ambre chaud pour un rendu plus premium.',
      desktopAlt: 'Une page ambre sombre avec « CREATING WITH MEANING. » en hautes capitales et un bouton Get in touch lumineux',
      phoneAlt: 'La page d’accueil Dark Sensory ambrée sur un téléphone',
      detailAlt: 'Des cartes sombres givrées pour la vidéo, le design d’interface, la photo et les PowerPoint, dans une lumière ambre chaude',
    },
    7: {
      name: 'Thème nature',
      when: '30 octobre au 18 novembre 2026',
      built: 'Next.js et Vercel',
      body: 'Fin octobre, j’ai donné au site un thème nature. C’était un changement plus grand que le précédent, mais toujours progressif, parce que le contenu et la mise en page restaient les mêmes, alors que chaque page passait dans un paysage peint à son propre moment de la journée et que le site gagnait sa barre de menu compacte.',
      desktopAlt: 'Un matin peint vert sauge avec un pin parasol à gauche et « Braven Chiam » en lettres de verre transparent',
      phoneAlt: 'La page d’accueil du matin peint sur un téléphone',
      detailAlt: 'Un titre Projects sur le ciel peint au-dessus de la carte phare OCR Meter',
    },
    8: {
      name: 'Refonte nature',
      when: 'Depuis le 18 novembre 2026',
      built: 'Next.js, GSAP et WebGL',
      body: 'Voici la refonte complète sur laquelle je travaillais, la première depuis la v5 à changer plus que l’apparence, avec de nouvelles animations et de nouveaux designs partout. La page d’accueil garde la peinture mais raconte une histoire au fil du défilement : le matin se décompose en grain, puis l’OCR Reader, Project June, Pip et BeadReader ont chacun leur propre chapitre avant mes autres projets, mon homelab et mes photos.',
      desktopAlt: 'La page d’accueil actuelle : le matin peint avec « Braven Chiam » en verre transparent',
      phoneAlt: 'La page d’accueil actuelle sur un téléphone',
      detailAlt: 'Le chapitre de Project June sur la page d’accueil actuelle, avec trois flux caméra en direct à côté du titre « Three live feeds from three phones »',
    },
  },
};

export default fr;
