import type { ArchiveCopy } from './en';

/* De woorden van de /archive-pagina in het Nederlands, in dezelfde vorm als en.tsx. */
const nl: ArchiveCopy = {
  meta: {
    title: 'Twee jaar chiambucket.com | Braven Chiam',
    description:
      'Elk ontwerp dat chiambucket.com sinds september 2024 heeft gehad, van een WordPress-site tot het geschilderde scrollverhaal, met screenshots en een werkende kopie van elke oude versie.',
    ogTitle: 'Twee jaar chiambucket.com',
    ogDescription: 'Acht ontwerpen sinds september 2024, en een werkende kopie van elk oud ontwerp.',
  },
  ldName: 'Twee jaar chiambucket.com',
  ldItem: 'v{n}: {name} ({when})',

  title: 'Twee jaar chiambucket.com',
  lede:
    'Het begon als een WordPress-pagina waarop ik links deelde naar een paar van mijn zelfgehoste diensten, maar inmiddels is het mijn persoonlijke blog en portfolio geworden. Drie migraties en acht redesigns later is dit de grootste vernieuwing van mijn website tot nu toe. Met hulp van Claude heb ik elke grote ontwerpronde op deze pagina gearchiveerd, en je kunt ze allemaal bezoeken om te zien hoe chiambucket.com er vroeger uitzag.',
  stripLabel: 'De acht versies, elk zo breed als de tijd dat ze online stonden',
  segLabel: 'v{n}, {name}, {when}',
  today: 'Vandaag',

  srName: 'v{n}: ',
  builtWith: 'Gebouwd met {built}',
  backHome: 'Terug naar de homepage',
  open: 'Open v{n}',

  fact: {
    kicker: 'Leuk weetje',
    title: 'Waarom chiambucket.com?',
    text:
      'Chiambucket begon als een bijnaam die een goede vriend me gaf. Toen ik een domeinnaam zocht voor mijn nieuwe landingspagina, bleek chiambucket.com toevallig de goedkoopste die nog vrij was, dus die nam ik en ik heb hem sindsdien gehouden.',
    extra: <><b>Extra leuk weetje:</b> ik heb ook <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, en die stuurt door naar deze site!</>,
  },

  versions: {
    1: {
      name: 'De eerste WordPress-site',
      when: 'September tot oktober 2024',
      built: 'WordPress en Elementor',
      body: 'Mijn eerste chiambucket.com was een WordPress-site die ik met Elementor in elkaar zette en op mijn server thuis draaide. Hij draaide om de knop Quick Links, want het was de pagina waar ik mijn vrienden naartoe stuurde als ze me vroegen om de links naar mijn zelfgehoste diensten. Verderop stond een carrousel met mijn foto’s, mijn homelabrack en een strook met contactlinks.',
      desktopAlt: 'Een marineblauwe pagina met “Welcome To Chiambucket!” in het wit en een blauwe knop Quick Links',
      phoneAlt: 'Dezelfde marineblauwe welkomstpagina op een telefoon',
      detailAlt: 'Een witte sectie met de titel “A little bit about myself” boven een carrousel met landschapsfoto’s',
    },
    2: {
      name: 'De WordPress-revamp',
      when: 'November 2024 tot voorjaar 2025',
      built: 'WordPress en Elementor',
      body: 'Twee maanden later bouwde ik de header en het menu opnieuw en voegde ik een About Me-pagina toe. De kop wisselde tussen een paar zinnetjes na “Welcome To My”, en de pagina daaronder had een slider die een van mijn foto’s voor en na het bewerken vergeleek, naast een hoge foto van het homelabrack.',
      desktopAlt: 'Een marineblauwe pagina met een afgeronde menubalk en de kop “Welcome To My” boven een blauwe knop Quick Links',
      phoneAlt: 'De vernieuwde marineblauwe landingspagina op een telefoon',
      detailAlt: 'Een grijze sectie met een voor-en-na-fotoslider onder “My Photos” en het homelabrack onder “My Homelab Journey”',
    },
    3: {
      name: 'De zelfgebouwde zwarte site',
      when: '2025',
      built: 'HTML, CSS en jQuery',
      body: 'In 2025 verliet ik WordPress en schreef ik de hele site zelf. Hij was zwart, met Oswald voor de koppen en een spotlight op een bol van deeltjes achter de titel, een 3D-scène in Spline die er geweldig uitzag maar de hele site liet haperen. Naast mijn kernvaardigheden stond een tekening van Sukuna uit Jujutsu Kaisen, een personage waar ik erg dol op was. De knop To BucketCentral moest naar een pagina leiden die al mijn zelfgehoste diensten op één plek verzamelde, maar die pagina heb ik geschrapt voordat ik hem bouwde.',
      desktopAlt: 'Een zwarte pagina met “Welcome To Chiambucket!” in een spotlight boven een bol van deeltjes',
      phoneAlt: 'De zwarte welkomstpagina met spotlight op een telefoon',
      detailAlt: 'Donkere kaarten met “Hi I am Braven, I shape designs And stir up Creations!” naast een tekening van Sukuna uit Jujutsu Kaisen, boven My Core Skills',
    },
    4: {
      name: 'De gradient-hero',
      when: 'Januari tot juni 2026',
      built: 'HTML, CSS en jQuery',
      body: 'In januari ontwierp ik hem opnieuw, nog steeds met de hand, vooral om van het haperen af te komen en om bentogrids uit te proberen, waar ik echt fan van was. De bovenkant van de homepage werd een verloop van lavendel naar violet met “Creating with Intention.”, en de secties daaronder werden een grid van donkere kaarten voor mijn CAD- en PCB-tools, mijn ontwerpaanpak en een stoffige render van Project June.',
      desktopAlt: 'Een verloop van lavendel naar violet achter de kop “Creating with Intention.”',
      phoneAlt: 'De gradient-hero op een telefoon',
      detailAlt: 'Donkere kaarten voor 3D-CAD en PCB-ontwerp en “A Design first Engineering approach”, boven een rover die stof opwerpt',
    },
    5: {
      name: 'De herbouw in Next.js',
      when: 'Juni tot juli 2026',
      built: 'Next.js, React en Vercel',
      body: 'In juni liet ik Claude voor het eerst de site ontwerpen, bouwde ik hem opnieuw in Next.js en verhuisde ik hem naar Vercel voor meer snelheid en uptime. Elke pagina kreeg een eigen accentkleur, de homepage zei “Creating with Meaning.” boven een blauwe gloed, en in een nieuwe galerij met al mijn projecten kon je zoeken en filteren, waarbij elke kaart een korte samenvatting opende.',
      desktopAlt: 'Een zwarte pagina met “Creating with Meaning.” boven een blauwe gloed en twee knoppen',
      phoneAlt: 'De Next.js-homepage op een telefoon',
      detailAlt: 'De galerij All projects met filterchips en kaarten voor Project June, LoRA Messenger en LUMEN',
    },
    6: {
      name: 'Dark Sensory',
      when: 'Juli tot oktober 2026',
      built: 'Next.js, WebGL en Vercel',
      body: 'In juli deed ik een kleinere wijziging. De layout bleef zoals hij was en alleen het kleurenthema veranderde. De blauwe en paarse tinten begonnen eruit te zien als elke site die door AI is gemaakt, dus de meeste pagina’s werden warm amber, voor een luxer gevoel.',
      desktopAlt: 'Een donkere amberkleurige pagina met “CREATING WITH MEANING.” in hoge hoofdletters en een gloeiende knop Get in touch',
      phoneAlt: 'De amberkleurige Dark Sensory-homepage op een telefoon',
      detailAlt: 'Matglazen donkere kaarten voor video, interfaceontwerp, fotografie en PowerPoint-werk, in warm amberkleurig licht',
    },
    7: {
      name: 'Natuurthema',
      when: '30 oktober tot 18 november 2026',
      built: 'Next.js en Vercel',
      body: 'Eind oktober gaf ik de site een natuurthema. Het was een grotere verandering dan de vorige, maar nog steeds een stapje, want de inhoud en layout bleven hetzelfde terwijl elke pagina verhuisde naar een geschilderd landschap op een eigen moment van de dag, en de site kreeg zijn compacte menubalk.',
      desktopAlt: 'Een geschilderde saliegroene ochtend met een parasolden links en “Braven Chiam” in heldere glazen letters',
      phoneAlt: 'De homepage met de geschilderde ochtend op een telefoon',
      detailAlt: 'Een kop Projects op de geschilderde lucht boven de topprojectkaart van de OCR Meter',
    },
    8: {
      name: 'Natuurredesign',
      when: 'Sinds 18 november 2026',
      built: 'Next.js, GSAP en WebGL',
      body: 'Dit is de volledige revamp waar ik aan heb gewerkt, de eerste sinds v5 die meer verandert dan het uiterlijk, met overal nieuwe animaties en nieuwe ontwerpen. De homepage houdt het schilderij, maar vertelt een verhaal terwijl je scrolt: de ochtend valt uiteen in korrels, en daarna krijgen de OCR Reader, Project June, Pip en BeadReader elk een eigen hoofdstuk, vóór mijn andere projecten, mijn homelab en mijn foto’s.',
      desktopAlt: 'De huidige homepage: de geschilderde ochtend met “Braven Chiam” in helder glas',
      phoneAlt: 'De huidige homepage op een telefoon',
      detailAlt: 'Het hoofdstuk van Project June op de huidige homepage, met drie live camerabeelden naast de kop “Three live feeds from three phones”',
    },
  },
};

export default nl;
