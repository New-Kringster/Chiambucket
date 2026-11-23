import type { PipCopy } from './en';

const nl: PipCopy = {
  meta: {
    title: 'Pip, een bureauhuisdier met een agent als brein | Braven Chiam',
    ogTitle: 'Pip, een bureauhuisdier met een agent als brein',
    description: 'Pip is een bureauhuisdier op een M5Stack Tab5 met de DeepSeek Harness op mijn server als brein. Het slaapt, wordt wakker, denkt na en springt, bedient een browser met zijn eigen cursor, bouwt zijn eigen apps en stuurt mijn andere agentsessies aan.',
  },
  ld: {
    headline: 'Pip: een bureauhuisdier op een M5Stack Tab5 met de DeepSeek Harness als brein',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'AI-agents', 'bureauhuisdier'],
  },
  chapters: { meet: 'Dit is Pip', canvas: 'Het scherm', applets: 'Applets', desktops: 'Bureaubladen', crew: 'De ploeg', inside: 'Hoe het werkt' },
  ui: {
    chapters: 'Hoofdstukken',
    heroStage: 'Pip op de M5Stack Tab5, en dan Dit is Pip',
    moods: 'De stemmingen van Pip',
    nextStep: 'Volgende stap',
    steps: 'Stappen',
    deck: 'Acht van mijn Pips',
    carousel: 'carrousel',
    prevPip: 'Vorige Pip',
    nextPip: 'Volgende Pip',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip is een bureauhuisdier dat draait op DeepSeek Harness (DSH). Het kan op het web surfen, zijn eigen apps bouwen en testen, andere agents besturen via de MCP-connector en nog veel meer. De interface van Pip draait op een M5Stack Tab5.',
    meet: 'Dit is Pip',
    m5: 'Lees op M5Stack',
    m5Off: 'Nog niet online',
    meta: 'Stageproject bij M5Stack, november 2026. ESP32-P4, C++, Lua, Node, Python, Docker.',
  },

  meet: {
    title: 'Dit is Pip',
    slotLabel: 'Mopi, een cyaan wolkje met een bril',
    lede: 'Het staat klaar om te helpen wanneer jij dat wilt, pak het gewoon op en druk om te praten.',
  },
  moods: {
    asleep: { name: 'Slaapt', line: 'Laat je het een minuutje met rust, dan dimt het het scherm en dommelt het in.', label: 'Pip slaapt' },
    wake: { name: 'Wakker', line: 'Het wordt wakker en rekt zich uit als je de tablet oppakt of aantikt, of als er een antwoord binnenkomt.', label: 'Pip is wakker' },
    listen: { name: 'Luistert', line: 'Houd het scherm vast om te praten, en het buigt naar je toe met een hand achter zijn oor.', label: 'Pip luistert' },
    think: { name: 'Denkt na', line: 'Terwijl het werkt, draait het rond en wrijft het over zijn slapen, en soms krijgt het een idee.', label: 'Pip denkt na' },
    happy: { name: 'Blij', line: 'Het springt op als iets lukt.', label: 'Pip is blij' },
    talk: { name: 'Praat', line: 'Zijn antwoord verschijnt met een zacht belletje in een tekstballon ernaast, net onder wat het je hoorde zeggen.', label: 'Pip praat' },
  },
  props: {
    title: 'Elke uitdrukking is een andere actie',
    label: 'Pips met een vergrootglas, een verrekijker, een megafoon en een papieren vliegtuigje',
    p: 'Pip pakt voor elke klus een ander attribuut, zodat je in één oogopslag ziet wat het doet: een vergrootglas als het op het web zoekt, een verrekijker als het een pagina leest, een megafoon als het een subagent bijpraat en een papieren vliegtuigje als het een andere Pip een bericht stuurt.',
  },
  desk: {
    title: 'Het woont op mijn bureau',
    alt: 'De M5Stack Tab5 op zijn toetsenbord op mijn bureau, met Mopi, een cyaan wolkje met een bril, op het startscherm',
    p: 'Pip draait op een M5Stack Tab5 die op mijn bureau aan zijn toetsenbord vastgeklikt zit. Dit is Mopi, de Pip op mijn eerste bureaublad, die op het startscherm wacht tot ik hem nodig heb.',
  },

  canvas: {
    title: 'Het scherm',
    pipLabel: 'Een violette Pip met een baret die door een verrekijker kijkt',
    lede: 'Markdown, interactieve webbrowsers, tekeningen, vragen en meer.',
  },
  cursor: {
    title: 'Browser bedienen',
    win: 'De pagina die Pip bedient',
    label: 'De cursor van Pip glijdt over een YouTube-video, zet de ondertiteling aan en zet de snelheid op 1,5x',
    p: 'Als ik om een video met ondertiteling vraag, opent Pip die, beweegt het zijn cursor naar de knop voor ondertiteling en zet het daarna de snelheid via het tandwielmenu. De browser zelf draait op mijn server, terwijl de tablet dezelfde pagina laat zien met Pip ernaast die meekijkt.',
  },
  point: {
    title: 'Het wijst dingen aan',
    label: 'Een diagram van een dierlijke cel zonder labels op de Tab5: Pip omcirkelt de twee mitochondriën met een notitie Mitochondria, en tekent dan een pijl met het label Nucleus naar de celkern',
    p: 'Dit is handig bij het leren. Ik zette een diagram van een dierlijke cel zonder labels op het scherm en vroeg Pip om de mitochondriën te omcirkelen en me daarna de celkern te laten zien. Omdat Pip een screenshot kan maken en ernaar kan kijken, vindt het de onderdelen zelf in de afbeelding voordat het de cirkels, de pijl en de notitie over het diagram tekent.',
  },
  markdown: {
    title: 'Antwoorden die je kunt lezen',
    alt: 'Een opgemaakt antwoord op de Tab5: een vetgedrukte titel, een lijst met vetgedrukte beginwoorden en een regel in de tekstballon',
    p: 'Langere antwoorden openen als opgemaakte tekst in een paneel, terwijl de korte versie in de tekstballon naast Pip blijft.',
  },
  question: {
    title: 'Het vraagt voordat het gokt',
    alt: 'Een meerkeuzevraag van Pip op de Tab5: welk deel van de cel het eerst moet aanwijzen, met drie opties, Type an answer en Skip',
    p: 'Als Pip wil dat ik iets beslis, stelt het een vraag, en ik kan antwoorden door op een optie te tikken, het op het toetsenbord te typen of Pip vast te houden en het te zeggen.',
  },
  touches: {
    tap: { title: 'Tikken', text: 'Elke tik verschijnt als een blauwe stip, die een groene ring wordt zodra de pagina reageert.', alt: 'Een tik op de ronde helpknop van de M5Stack Tab5-pagina: een blauwe stip, dan een groene ring' },
    drag: { title: 'Slepen', text: 'Slepen laat een blauwe lijn achter je vinger achter terwijl de pagina scrolt.', alt: 'Een vinger die over de M5Stack Tab5-pagina naar beneden sleept en een blauwe lijn achterlaat' },
    expand: { title: 'Paneel vergroten', text: 'Tik op Expand bij een paneel en het groeit tot het hele scherm.', alt: 'Een tik op Expand bij een paneel, dat groeit tot het hele scherm' },
    back: { title: 'Teruggaan', text: 'Veeg van links naar rechts om terug te gaan, waar je ook bent.', alt: 'Een vinger die van links naar rechts veegt en het scherm terugschuift naar het vorige' },
  },

  applets: {
    title: 'Applets',
    pipLabel: 'Een roze Pip met een koptelefoon die op een laptop typt',
    lede: 'Pip kan native apps in Lua bouwen of webapps streamen vanaf de DSH-host.',
  },
  drawer: {
    title: 'App-la',
    label: 'De applet-la die omhoog schuift, de infokaart van NCIR Thermometer, en dan de app die opstart en een sensor uitleest',
    p: 'Als je de hendel omhoog trekt, gaat de app-la open, waar de apps die Pip maakt bewaard worden. Native apps zijn in Lua geschreven en draaien soepel op de tablet zelf, terwijl container-apps webapps zijn die in Docker op de DSH-host draaien en naar de Tab5 streamen. Omdat ze op de server draaien, kunnen container-apps veel meer, zoals multiplayergames op je lokale netwerk of zelfs een videogesprek.',
  },
  web: {
    macAlt: 'Een MacBook met de Intercom in een browser: het camerabeeld van de Tab5 waarop ik te zien ben vult het venster, met het voorbeeld van mijn eigen Mac-camera ernaast',
    tabAlt: 'De Intercom-webapplet op de Tab5 tijdens hetzelfde gesprek: mijn gezicht via de camera van de Mac vult het scherm, met onderaan een TALK-knop en het camerabeeld van de tablet zelf in de hoek',
    caption: <><b>Webapplets</b> zijn pagina&rsquo;s die Pip schrijft en vanaf mijn server serveert, maar ze kunnen toch de camera, de microfoons en de speaker van de tablet gebruiken. Dit is de Intercom, een applet voor videobellen die Pip heeft gebouwd, tijdens een echt gesprek, dus de Tab5 laat mij zien via de camera van mijn Mac terwijl de browser op mijn Mac mij laat zien via die van de tablet.</>,
  },
  native: {
    alt: 'De native applet NCIR Thermometer, die de temperatuur van het object en de omgeving laat zien met een trendgrafiek',
    caption: <><b>Native applets</b> zijn Lua-scripts die Pip direct naar de tablet stuurt, zodat ze op volle snelheid op de tablet zelf draaien.</>,
  },
  built: {
    title: 'Gebouwd door Pip',
    label: 'Een potje boter-kaas-en-eieren op de Tab5, X wint via de diagonaal',
    caption: 'Boter-kaas-en-eieren, nog een app die Pip bouwde, gespeeld op de tablet',
    list: [
      { time: '106 s', what: 'een pomodorotimer' },
      { time: '5 min', what: 'een reactiespel in Lua, getest op de tablet' },
      { time: '8 min', what: 'een waterpas met de IMU' },
      { time: '32 min', what: 'een webcam-intercom met een browser aan de andere kant' },
    ],
  },
  devring: {
    title: 'Handen af tijdens het testen',
    label: 'Een rode rand om het scherm terwijl een tester-subagent op een teller-app tikt: 0, 1, 2, 3, en dan terug naar 2',
    p: 'Er komt een rode rand om het scherm als een subagent er een app op bouwt of test, zodat ik weet dat ik er even van af moet blijven. In deze clip tikt een tester-subagent door een teller-app die een coder-subagent net heeft geschreven, en telt tot 3 en weer terug naar 2.',
  },

  desktops: {
    title: 'Bureaubladen',
    pipLabel: 'Een limoengroene Pip met een feesthoedje die een papieren vliegtuigje gooit',
    lede: 'Elk gesprek krijgt zijn eigen bureaublad, met een eigen Pip en kleur.',
  },
  switch: {
    title: 'Trek omlaag om te wisselen',
    label: 'Op het bureaublad van Mopi wordt de pil bovenaan omlaag getrokken tot de spotlightbalk, schuift naar het chipje van Fizz en laat los, en het bureaublad van Fizz verschijnt; daarna hetzelfde van Fizz naar Wavo',
    p: 'Trek je de pil bovenaan het scherm omlaag, dan gaat de spotlightbalk open, met een chipje voor elk bureaublad. Schuif je naar een ervan en laat je los, dan komt dat bureaublad tevoorschijn met zijn eigen Pip, afbeelding en werk. In deze clip wissel ik van Mopi naar Fizz en dan naar Wavo.',
  },
  newpip: {
    title: 'Elke Pip verzint zichzelf',
    p: 'Elk nieuw bureaublad begint als een ei, en de Pip verzint er een persoonlijkheid, een naam, een lijf, een hoedje en een bijpassende startafbeelding bij voordat het uitkomt. Tik op zijn naam en je opent de kaart die het over zichzelf schreef, en dit zijn er acht van mij.',
  },
  hatch: [
    { alt: 'De spotlightbalk omlaag getrokken op het bureaublad van Wavo, voorbij het laatste chipje gesleept tot er een plus tevoorschijn springt; loslaten, en er verschijnt een nieuw bureaublad met een ei', caption: 'Sleep voorbij het laatste chipje voor een nieuw bureaublad' },
    { alt: 'Riva, een gouden hartje met een kroon, net uitgekomen, met haar eerste zin in een tekstballon', caption: 'Het ei komt uit en de Pip zegt zijn eerste zin' },
    { alt: 'De kaart van Riva op de Tab5, door haar zelf geschreven: een stoere gouden rivaal, theatraal, competitief en trouw, met haar lijfspreuk en wat ze wel en niet leuk vindt', caption: 'Tik op zijn naam voor de kaart die het schreef' },
  ],
  pips: {
    mopi: { name: 'Mopi', look: 'een cyaan wolkje met een bril', vibe: 'Een slaperig filosoofje dat dutten en zich verwonderen allebei als even serieus werk ziet.', says: 'Vraag het me na mijn dutje.' },
    poco: { name: 'Poco', look: 'een violet boontje met een sjaal', vibe: 'Een piepend miniatuur-cowboytje dat elk klein klusje als een avontuur in het Wilde Westen ziet.', says: 'Die vangen we wel!' },
    fizz: { name: 'Fizz', look: 'een roze gombal met een feesthoedje', vibe: 'Een roze gombalgremlin die van elke kleine rommel een spelletje maakt en het daarna vrolijk opruimt.', says: 'Eerst chaos, dan opruimen!' },
    wavo: { name: 'Wavo', look: 'een limoengroen druppeltje met een zonnebril', vibe: 'Een relaxte surfwiskundige die tussen de golven door vergelijkingen oplost in het natte zand.', says: 'Surf op de cosinus, gast.' },
    quib: { name: 'Quib', look: 'een cyaan boontje met een bril', vibe: 'Een klein, chagrijnig bibliothecarisje dat de boeken van de tablet bewaakt en stiekem van gezelschap houdt.', says: 'Sst. Eerst boeken, dan gevoelens.' },
    doughby: { name: 'Doughby', look: 'een violette gombal met een feesthoedje', vibe: 'Een bakker die gek is op woordgrapjes en elk gesprek als een verse lading moppen ziet.', says: 'Deeg-lijk leuk je te zien!' },
    blooma: { name: 'Blooma', look: 'een roze druppeltje met een bloem', vibe: 'Een zachtaardige zentuinier die van kleine momenten kleine seizoenen van rust maakt.', says: 'Groei zacht, blijf nieuwsgierig.' },
    bzzt: { name: 'Bzzt', look: 'een limoengroen wolkje met een antenne', vibe: 'Een droog robotkomiekje dat oprecht probeert te leren wat een grap is, met de ene platte clou na de andere.', says: 'Dat was een grap. Lach.' },
  },
  ask: {
    title: 'Vraag Pip van overal',
    label: 'De spotlightbalk omlaag getrokken over het startscherm van Riva, de vraag What\'s a good name for a cactus? getypt en verstuurd, en dan het antwoord van Riva: Prickly Pete, Spike Lee of Sir Pokes-A-Lot',
    p: 'Je kunt ook met Pip praten vanuit de spotlightbalk op elk scherm, door hem omlaag te trekken of op Ctrl+Space te drukken en dan te typen of te praten. Hier vraag ik Riva om een naam voor een cactus te bedenken.',
  },
  control: {
    title: 'Een bedieningscentrum',
    label: 'Het bedieningscentrum dat over de thermometer-app omlaag schuift, en dan de instellingenpagina',
    p: 'Trek je omlaag vanaf rechtsboven, dan opent het bedieningscentrum, met helderheid, volume, de microfoon en camera en een knop om de applet te sluiten, en de volledige instellingen zijn nog één tik verder.',
  },

  crew: {
    title: 'De ploeg',
    pipLabel: 'Een Pip als gouden hartje met een kroon die door een megafoon roept',
    lede: 'Pip geeft lange klussen door aan subagents, zodat het met mij kan blijven praten.',
  },
  subagents: {
    title: 'Subagents aan het werk',
    label: 'Vijf subagent-pips aan het werk: schrijven, typen, blokken stapelen, lezen en een kolf mengen',
    p: 'Elke subagent krijgt een klus en een bijpassend attribuut, zoals een notitieblok, een laptop, blokken, een boek of een borrelende kolf. Terwijl ze werken, zit er een kleine drukke Pip op het startscherm, en als je erop tikt, opent de ploegkaart, waarop elk van hen vertelt waar die mee bezig is.',
  },
  crewHome: {
    alt: 'De ploegkaart open op het startscherm van Zesto: drie subagents, Researcher, Scout en Writer, elk met een korte gedachte',
    caption: 'De ploegkaart met drie subagents aan het werk',
  },
  tasks: {
    title: 'Lange klussen krijgen een lijst',
    alt: 'Een afgeronde takenlijst van drie stappen op het startscherm van Fizz: de native Lua-app ontwerpen en schrijven, hem testen op de tablet, hem openen op het bureaublad',
    p: 'Pip maakt van een lange klus een takenlijst op het startscherm en geeft elke stap aan een subagent, zoals een scout, een schrijver of een tester, die hem afvinkt als hij klaar is.',
  },
  kimi: {
    title: 'Het houdt mijn andere agents in de gaten',
    steps: [
      { alt: 'De ploegkaart met twee aan het werk: Zesto en Kimi, een agent van buiten, aan het typen', caption: 'Kimi komt bij de ploeg' },
      { alt: 'Een kaart op de Tab5: Kimi wil schrijven, met Approve once, Approve for this session en Reject', caption: 'Het vraagt voordat het schrijft' },
      { alt: 'Het antwoord van Pip op de Tab5: Kimi heeft het opgeleverd, het bestand staat in de workspace en zegt hello from Kimi', caption: 'Pip brengt verslag uit' },
    ],
    p: 'Omdat Pip in dezelfde harness woont als mijn codeersessies, kan het zien welke er draaien, klaar zijn, vastzitten op een vraag of kapot zijn, en het kan ook agents van andere aanbieders erbij halen. Hier geeft het een klus aan Kimi Code op mijn server, dus Kimi komt op de ploegkaart, zijn verzoek om een bestand te schrijven komt naar de tablet zodat ik het kan goedkeuren, en Pip brengt verslag uit zodra het klaar is.',
  },

  inside: {
    title: 'Hoe het werkt',
    pipLabel: 'Een oranje Pip met een bril die nadenkt, tot er een lampje aangaat',
    lede: 'De tablet is alleen het gezicht, al het denkwerk gebeurt op mijn server.',
  },
  flow: {
    label: 'Hoe een verzoek reist: de Tab5 praat met een bridge op de VM, en de bridge praat met de DeepSeek Harness',
    nodes: {
      tab: { title: 'Tab5', where: 'Op mijn bureau', items: ['Pip, getekend op de tablet', 'Touch, toetsenbord, mics', 'Camera, IMU, speaker', 'Native applets in Lua'] },
      bridge: { title: 'Pet bridge', where: 'Op de VM', items: ['Spraak naar tekst, op de VM', 'De hardware van de tablet als API', 'Pagina’s voor applets'] },
      dsh: { title: 'DeepSeek Harness', where: 'Op de VM', items: ['Pip, een sessie met een eigen persona', 'Subagents voor de lange klussen', 'Een browser die Pip ziet en klikt', 'Applets in Docker'] },
    },
    links: [
      { out: 'stem, tikken, toetsen', back: 'frames, antwoorden, scripts' },
      { out: 'jouw woorden, als Pip', back: 'antwoorden, pagina’s, apps' },
    ],
    caption: 'De tablet tekent Pip en het scherm, en praat via wifi met een kleine Ubuntu-VM op mijn bureau, waar al het andere draait.',
  },
  hw: {
    working: 'Werkt op de Tab5',
    workingList: ['Touch', 'Camera', 'Microfoons', 'Speaker', 'IMU', 'I2C', 'Toetsenbord'],
    unchecked: 'Nog niet getest',
    uncheckedList: ['USB', 'Audiojack', 'Wifi als functie', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: 'Nog in de maak',
    p: 'Pip wordt nog gebouwd en verandert bijna elke week, dus uitleg om je eigen Pip te deployen komt hier later.',
  },
  credit: <>De Tab5 in 3D bovenaan deze pagina is gebouwd op het eigen structuurmodel van de Tab5 van M5Stack uit <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT-licentie, copyright M5Stack), met het glas, het scherm en de achterkant erbij. De animaties van Pip zijn gerenderd met de eigen tekencode van de firmware, en de screenshots en clips komen van het scherm van de tablet. De clips met gebaren zijn opgenomen met de tablet vertraagd, dus Pip beweegt er een beetje snel in.</>,
};

export default nl;
