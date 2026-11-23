import type { BeadreaderCopy } from './en';

const nl: BeadreaderCopy = {
  meta: {
    title: 'BeadReader | Braven Chiam',
    description: 'Een privé boekenlezer, alleen op uitnodiging, die ik bouwde met Next.js, Supabase en Cloudflare R2, met inloggen via een toegangscode, per lezer verder lezen en thema’s, live aanwezigheid, een inhoudsfilter dat SQL afdwingt, webtoons en gedeelde leesstatistieken.',
    ogDescription: 'Een privé boekenlezer, alleen op uitnodiging, met live aanwezigheid, per lezer verder lezen, een inhoudsfilter dat SQL afdwingt, webtoons en gedeelde leesstatistieken.',
  },
  ld: {
    headline: 'BeadReader',
    description: 'Een privé online boekenlezer, alleen op uitnodiging, gebouwd met Next.js, Supabase en Cloudflare R2, met inloggen via een toegangscode en een HMAC-ondertekende cookie, per lezer verder lezen en thema’s, live aanwezigheid, een filter voor expliciete inhoud dat SQL afdwingt, webtoons en een gedeeld dashboard met leesstatistieken.',
  },
  hero: {
    alt: 'BeadReader op drie telefoons: het inlogscherm, een hoofdstuk en de statistiekenpagina',
    back: 'Terug naar projecten',
    tag: 'Eigen project',
    title: <>Bead<em>Reader</em></>,
    lead: 'BeadReader is een privé online boekenlezer voor een paar vrienden, waar de admin boeken publiceert in Markdown of als webtoons met afbeeldingen, en lezers inloggen met één toegangscode. De app onthoudt waar elke lezer gebleven is, en lezers kunnen zien wie er nog meer leest, een zwaai of een kort berichtje sturen en hun voortgang vergelijken op een gedeeld statistiekendashboard.',
    builtWith: 'Gemaakt met',
    links: { github: 'GitHub', deploy: 'Zelf deployen' },
  },
  chapters: 'Hoofdstukken',
  rail: {
    room: 'Privétoegang', library: 'Voortgang en thema’s', together: 'Samen lezen', gate: 'Pikant filter',
    books: 'Tekst en webtoons', stats: 'Leesstatistieken', instant: 'Offline en updates', stack: 'De stack',
  },
  room: {
    h: 'Privétoegang',
    p: [
      'BeadReader is een privébibliotheek voor één admin en een paar lezers, en er zijn geen wachtwoorden en je hoeft je niet aan te melden. In plaats daarvan is één toegangscode je identiteit. Die bepaalt of je de admin bent of een lezer en of je expliciete hoofdstukken kunt zien, en zodra je hem invoert, houdt een ondertekende cookie je ingelogd.',
      'De admin maakt elke lezer aan en geeft diegene een code, en als de admin die code intrekt, wordt de lezer bij het volgende verzoek uitgelogd.',
    ],
    alt: 'Het inlogscherm van BeadReader met één veld voor de toegangscode',
    caption: 'Het inlogscherm met zijn ene veld voor de toegangscode',
  },
  library: {
    h: 'Voortgang en thema’s',
    p: [
      'Als je een boek opent, spring je terug naar het hoofdstuk en de scrollpositie waar je het laatst was. De positie wordt opgeslagen als een breuk van het hoofdstuk en niet als een aantal pixels, dus hij klopt nog na een andere lettergrootte, en als je op je telefoon midden in een alinea stopt, kom je op je laptop op dezelfde plek uit.',
      'BeadReader bewaart voor elke lezer de eigen achtergrond- en tekstkleur, lettergrootte, en of de tekst doorscrolt of in pagina’s staat. De inhoudspagina markeert elk hoofdstuk dat je hebt geopend, laat een voortgangsbalk zien bij het hoofdstuk waar je mee bezig bent en laat je een hoofdstuk als ongelezen markeren.',
    ],
    figs: [
      { alt: 'De leesweergave in het paper-thema', caption: 'De leesweergave in het paper-thema' },
      { alt: 'De inhoud van een boek met de voortgang per lezer', caption: 'De inhoudspagina met bijgehouden hoofdstukken en een voortgangsbalk' },
    ],
  },
  together: {
    h: 'Samen lezen',
    p: [
      'Vanuit de bibliotheek zie je wie er nog meer online is, en in een boek staan de avatars van de lezers die online zijn bovenaan, elk met een groen stipje. Zit een vriend in hetzelfde boek, dan krijgt zijn avatar ook een groene ring en zijn hoofdstuknummer.',
      'Als je op de avatars tikt, kun je een zwaai of een kort berichtje sturen. Dat staat een paar seconden op het scherm van de andere lezer en wordt nooit opgeslagen. Iedereen kan een profielfoto uploaden, die in de browser wordt bijgesneden en gecomprimeerd, en iedereen kan een privacyschakelaar aanzetten om onzichtbaar te lezen.',
    ],
    alt: 'Het menu om een zwaai of een berichtje te sturen',
    caption: 'Het menu om een zwaai of een kort berichtje te sturen',
  },
  gate: {
    h: 'Pikant filter',
    p: [
      'Sommige hoofdstukken, of passages in een hoofdstuk, zijn als expliciet gemarkeerd, en de toegang daartoe wordt per lezer ingesteld en in de databasequery afgedwongen. Een lezer zonder toegang krijgt de afgeschermde tekst nooit binnen, ook niet verborgen in het antwoord, dus je kunt hem niet uit de ruwe API halen.',
      'Hetzelfde hoofdstuk ziet er voor elke lezer anders uit: met toegang krijg je een vervaagde passage die scherp wordt als je erop tikt, zonder toegang zie je een vergrendeld voorproefje met een briefje om toegang te vragen, en in cal-modus is elke expliciete passage weggehaald, zonder markeringen en zonder pepericoontje.',
    ],
    alt: 'Een inhoudsopgave met een expliciet hoofdstuk gemarkeerd',
    caption: 'Een inhoudsopgave met een expliciet hoofdstuk gemarkeerd, zoals een lezer met toegang hem ziet',
  },
  books: {
    h: 'Tekst en webtoons',
    p: [
      'Elk boek is tekst of een webtoon, en dat kiest de admin als hij het aanmaakt. Tekstboeken worden in Markdown geschreven met een voorbeeld ernaast, en elk hoofdstuk heeft zijn eigen concept- en gepubliceerde status.',
      'Voor een webtoon kiest de admin een map met genummerde afbeeldingen, bekijkt hij de volgorde en uploadt hij ze rechtstreeks vanuit de browser naar Cloudflare R2 met kortlevende ondertekende URL’s. Lezers scrollen daarna door één verticale strook zonder naden, met hetzelfde verder lezen, bijhouden en afschermen als bij een tekstboek.',
    ],
    figs: [
      { alt: 'De boekenlijst van de admin', caption: 'De boekenlijst van de admin met tekstboeken en webtoons, als concept en gepubliceerd' },
      { alt: 'Een hoofdstuk van een webtoon als verticale strook zonder naden', caption: 'Een hoofdstuk van een webtoon als één verticale strook' },
    ],
  },
  stats: {
    h: 'Leesstatistieken',
    p: [
      'Lezers die hun activiteit delen, staan op een gezamenlijk dashboard met hun totale uren, uitgelezen boeken en leesreeksen. Een histogram laat per dag zien op welk moment van de dag mensen lezen, en als je op een lezer tikt, zie je hoe zijn tijd per boek en per hoofdstuk verdeeld is.',
      'Leestijd telt alleen als je echt aan het lezen bent, dus hij pauzeert als het tabblad niet meer actief is of als je niets meer doet.',
    ],
    figs: [
      { alt: 'Het overzicht van de leesstatistieken', caption: 'Het statistiekenoverzicht met leesreeksen' },
      { alt: 'De statistieken van één lezer uitgesplitst', caption: 'De tijd van één lezer, uitgesplitst per boek en hoofdstuk' },
    ],
  },
  instant: {
    h: 'Offline en updates',
    p: [
      'Een service worker cachet covers, artwork en statische bestanden op het apparaat, nooit HTML of API-antwoorden, en de lezer laadt het volgende hoofdstuk alvast, dus pagina’s openen snel en gebruiken minder data. De accountpagina laat zien wat er in de cache staat en hoeveel ruimte dat inneemt, met één knop om alles te wissen.',
      'Een openbare changelog en een pop-up met wat er nieuw is, één keer per versie, leggen nieuwe functies uit, en zodra er een nieuwere build is gedeployd, verschijnt er een melding om te verversen.',
    ],
    figs: [
      { alt: 'Het paneel voor account en opslag', caption: 'De accountpagina en de opslag op het apparaat, met een knop om alles te wissen' },
      { alt: 'De changelog in de app', caption: 'De changelog in de app' },
    ],
  },
  stack: {
    h: 'De stack',
    p: [
      'BeadReader is een Next.js-app met de App Router en Tailwind CSS v4, met Supabase voor Postgres en opslag en Cloudflare R2 voor de webtoonafbeeldingen, terwijl het inloggen mijn eigen korte HMAC-ondertekende cookie gebruikt in plaats van Supabase Auth.',
      'Omdat het inloggen zelfgemaakt is, loopt alle databasetoegang op de server met de service role van Supabase, en elke tabel heeft row-level security aan zonder policies, dus de publieke sleutel kan niets lezen. Het filter voor expliciete inhoud zit in de SQL-query, en de Vercel-deploy met één klik zet Supabase op via de integratie en draait de migraties tijdens de build.',
    ],
  },

  presence: {
    eyebrow: 'Nu online',
    captions: [
      'Mara zit in hoofdstuk 12 van het boek dat jij leest, dus haar avatar heeft de groene ring.',
      'Tik op een lezer om te zwaaien. Dat verschijnt op zijn scherm en vervaagt dan.',
      'Je kunt ook een kort berichtje sturen, dat na een paar seconden weg is en nooit wordt opgeslagen.',
      'Sam opent hetzelfde boek en krijgt ook een groene ring.',
    ],
    note: 'wat een plottwist!',
    sentNote: 'ben dit nu aan het lezen!',
    status: {
      mara: 'Dit boek, hoofdstuk 12',
      jae: 'The Hobbit, hoofdstuk 3',
      samLibrary: 'In de bibliotheek',
      samBook: 'Dit boek, hoofdstuk 1',
    },
    here: 'leest hier',
    wave: 'Zwaai naar {name}',
    sendNote: 'Stuur {name} een berichtje',
    stepsAria: 'Stappen van de demo',
    step: 'Stap {n} van {total}',
    legend: 'Een groene ring betekent: iemand in jouw boek',
  },

  spicyGate: {
    chapter: 'Hoofdstuk 9',
    passage: {
      lead: 'Ze hadden de hele avond om elkaar heen gedraaid. Toen de laatste gast eindelijk vertrok, werd het stil in de kamer.',
      spicy: 'Wat er daarna gebeurde, bleef tussen hen en het zachte licht van het vuur.',
      trail: 'De ochtend kwam veel te snel.',
    },
    modes: {
      full: { label: 'Volle toegang', caption: 'Deze lezer heeft toegang, dus een tik maakt de vage regel scherp.' },
      none: { label: 'Geen toegang', caption: 'De server stuurt deze lezer de vergrendelde passage nooit.' },
      cal: { label: 'Cal-modus', caption: 'De regel is helemaal weg, zonder gat en zonder markering.' },
    },
    revealAria: 'Tik om de pikante passage te tonen',
    revealedAria: 'Pikante passage getoond',
    reveal: 'Tik om te tonen',
    locked: 'Pikante passage. Vraag de admin om toegang.',
    tabsAria: 'Lezersmodus',
    footnote: 'Het filter wordt in de SQL-query afgedwongen, dus afgeschermde tekst verlaat de server nooit.',
  },
};

export default nl;
