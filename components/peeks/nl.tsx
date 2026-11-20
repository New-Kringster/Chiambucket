import { usePeekKit, type PeekLabels } from './kit';

/*
  De peek-lezer in het Nederlands: dezelfde vorm als en.tsx, alleen de woorden
  zijn vertaald. Afbeeldingspaden en links blijven gelijk; interne links worden
  door de kit gelokaliseerd.
*/

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Houdbaarheidstracker', 'proj-ruler': 'Scroll Ruler', 'proj-cadmouse': '3D CAD-muis', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'EMA Smart Home', 'proj-pandus': 'Pandus Dispenser', 'proj-elecf': 'ELEC-F Concept',
  'proj-kauli': 'Kauli Concept', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Webontwikkeling', 'proj-mc': 'Minecraft Live Map',
};

export const LABELS: PeekLabels = {
  soon: 'Artikel volgt binnenkort',
  next: 'Volgende: {title}',
  untitled: 'Project {n}',
  pullHint: 'Scroll door voor {title}',
  pullAria: 'Open het volgende project: {title}',
  end: 'Dat waren alle projecten',
};

/* ── De inhoud van de lezer voor één project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('De rover van Project June', ['Eigen project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 weken · Zelf geleerd · 3D-ontwerp · Mobiel netwerk · WebRTC · MQTT</p>
          <p className="hp-rd-lead">Een 5G-rover die ik in drie weken bouwde. Hij streamt drie live camera&rsquo;s, heeft een volledig sensorpakket aan boord en rijdt met een Xbox-controller overal waar bereik is.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Drie live videostreams', <><p>Drie camera&rsquo;s streamen live via WebRTC door een TURN-server, zodat de beelden met weinig vertraging door de NAT van het mobiele netwerk komen.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="De camera&rsquo;s van Project June" loading="lazy" /></>)}
          {chapter('02', 'Besturing en telemetrie', <p>MQTT brengt de besturing en telemetrie over een Mosquitto-broker, met eigen PWM-motorsturing en servobesturing vanaf een Xbox-controller.</p>)}
          {chapter('03', 'Een volledig sensorpakket', <><p>De rover heeft een Neo8M-gps, een gyroscoop, een versnellingsmeter, een magnetometer, een barometer, een ultrasone afstandssensor, een DHT11 en een TEMT6000-lichtsensor aan boord.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="De systeemarchitectuur van Project June" loading="lazy" /></>)}
          {cta('Het hele bouwverslag', 'Het artikel laat de foto’s en de architectuur zien, en elk probleem waar ik tegenaan liep.', 'Lees het hele artikel', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, een cyaan bureauhuisdier, op de M5Stack Tab5', ['Stageproject'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 week · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">Een bureauhuisdier op een M5Stack Tab5 met de DeepSeek Harness op mijn server als brein, zodat het een browser kan bedienen, zijn eigen apps kan bouwen en een oogje kan houden op mijn andere agents.</p>
          {chapter('01', 'Een huisdier dat laat zien wat het doet', <><p>Pip slaapt als je het met rust laat, wordt wakker als je de tablet oppakt, draait en wrijft over zijn slapen terwijl het nadenkt, en springt op als iets lukt. Het speelt ook elke tool na die het gebruikt, met een verrekijker om een pagina te lezen of een megafoon om een helper bij te praten.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip met een vergrootglas, een verrekijker, een megafoon en een papieren vliegtuigje" loading="lazy" /></>)}
          {chapter('02', 'Het gebruikt het scherm', <p>Antwoorden komen als pagina&rsquo;s en opgemaakte tekst, en Pip kan met zijn eigen cursor door die pagina&rsquo;s klikken of me meerkeuzevragen stellen. Het bouwt ook kleine apps die het in een la bewaart, als webpagina&rsquo;s vanaf mijn server of als Lua-scripts die op de tablet zelf draaien.</p>)}
          {chapter('03', 'Een centrale voor mijn agents', <><p>Pip draait in dezelfde harness als mijn codeersessies, geeft lange klussen door aan helper-pips en laat me weten wanneer een sessie klaar is of een antwoord nodig heeft.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Helper-pips aan het werk met een notitieblok, een laptop, blokken, een boek en een kolf" loading="lazy" /></>)}
          {cta('Zie Pip bewegen', 'Het artikel laat zijn stemmingen, apps en bureaubladen zien en hoe alles met elkaar verbonden is.', 'Lees het hele artikel', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('De houdbaarheidstracker, een CoreS3 SE op de QRCode-module', ['Stageproject'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Houdbaarheidstracker</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">Een houdbaarheidstracker voor op de koelkastdeur. Je scant de barcode van een product en kiest wanneer het over de datum gaat, en het scherm laat altijd zien wat je het eerst moet opeten.</p>
          {chapter('01', 'Scannen, dan opslaan', <><p>Het scherm gloeit rood terwijl de scanner een code zoekt, en laat dan de naam, het merk en de foto van het product zien uit Open Food Facts of GS1 China. Met de keuzes Dagen, Weken en Maanden stel je de houdbaarheid in voordat je opslaat.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="De houdbaarheidskiezer op de tracker" loading="lazy" /></>)}
          {chapter('02', 'Wat je eerst opeet', <><p>Het startscherm sorteert de voorraad op houdbaarheid en kleurt de teller rood binnen een dag en oranje binnen een week, en als je iets scant dat al op de lijst staat, opent het dat in plaats van het dubbel toe te voegen.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="Het startscherm, gesorteerd op houdbaarheid" loading="lazy" /></>)}
          {chapter('03', 'Een server doet de rest', <p>Een Docker-container op het thuisnetwerk bewaart de lijst, zoekt barcodes op, biedt een webpagina om voorraden te beheren en publiceert elke voorraad via MQTT naar Home Assistant voor herinneringen.</p>)}
          {cta('Probeer de tracker', 'Het artikel heeft een werkende kopie van het scherm, de demovideo en uitleg om er zelf een te bouwen.', 'Lees het hele artikel', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('De Scroll Ruler, een AtomS3R met een Unit Scroll erop', ['Stageproject'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Scroll Ruler</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">Een digitale liniaal. Je drukt het wieltje van de Unit Scroll in en rolt het langs wat je wilt meten, en de AtomS3R laat de afstand in centimeters zien.</p>
          {chapter('01', 'Eén keer kalibreren', <><p>De eerste keer dat hij opstart, rol je precies 10 cm langs een echte liniaal en tik je op het scherm om de getelde stappen op te slaan. Zo leert hij hoe ver het wieltje per stap gaat. Daarna blijft de kalibratie in het flashgeheugen staan.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="De liniaal geeft 8,2 cm aan" loading="lazy" /></>)}
          {chapter('02', 'Rollen om te meten', <p>De afstand telt alleen terwijl het wieltje is ingedrukt en de led groen brandt, dus je kunt hem optillen en weer neerzetten zonder de meting kwijt te raken. Tikken op het scherm zet hem op nul, en het scherm vasthouden start een nieuwe kalibratie.</p>)}
          {chapter('03', 'Getest buiten het apparaat', <p>Het rekenwerk voor kalibratie en afstand zit in één bestand zonder hardwarecode, dus elf unittests controleren het op een computer voordat de firmware op de AtomS3R gaat.</p>)}
          {cta('Rol er zelf mee', 'Het artikel heeft een werkende kopie van de liniaal, de demovideo en uitleg om er een te flashen.', 'Lees het hele artikel', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan met vier Unit ToF4M-afstandssensoren op zijn hoofd', ['Stageproject'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · vier Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">Een zelfgemaakte LiDAR. Stack-chan zwaait met zijn twee servo&rsquo;s vier afstandssensoren door een kamer, zijn camera kleurt de punten in, en elke browser op dezelfde wifi laat de scan in 3D zien.</p>
          {chapter('01', 'De zwaai', <><p>Het hoofd werkt een raster rij voor rij af, van horizontaal tot recht omhoog en tot 256 graden breed, en elke stand wordt één meting: een richting van de servo&rsquo;s en een afstand van de sensoren.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="De afgeronde scan van een hoek van een kamer in de kleuren van de camera" loading="lazy" /></>)}
          {chapter('02', 'Vier sensoren, één meting', <p>De vier sensoren wijzen dezelfde kant op, dus elke meting houdt de mediaan van hun waarden, en zo valt een uitschieter weg.</p>)}
          {chapter('03', 'Kleur van de camera', <p>Foto&rsquo;s die voor de zwaai zijn gemaakt kleuren de punten in, en de browser duwt elke pixel naar de gemeten afstand, wat in deze scan 68.206 gekleurde punten opleverde.</p>)}
          {cta('Verken de scan', 'Het artikel heeft de echte scan in 3D, de demofilm en uitleg om er een te flashen.', 'Lees het hele artikel', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('De M5Stack Capsule v1.1 die als 3D-muis werkt', ['Stageproject'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D CAD-muis</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Een draadloze 3D-muis voor Onshape. Je klikt op de knop van de Capsule en draait hem in je hand, en het model op het scherm draait mee.</p>
          {chapter('01', 'Vermomd als SpaceMouse', <p>Onshape luistert alleen naar een 3D-muis via de driver van 3Dconnexion, dus de Capsule stelt zich via Bluetooth voor als hun SpaceMouse Wireless en de driver doet de rest.</p>)}
          {chapter('02', 'Je hand volgen', <><p>Hij stuurt met zijn gyroscoop door hoe snel je hand draait, zodat het model over dezelfde hoek draait als je hand. Met de knop ingedrukt verschuif je in plaats daarvan, en met een draai zoom je.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Een behuizing draaien in Onshape met de Capsule" loading="lazy" /></>)}
          {chapter('03', 'Getest buiten het apparaat', <p>Het rekenwerk voor de beweging en de knopgebaren zit in één bibliotheek zonder hardwarecode, dus 19 unittests controleren het op een computer voor elke flash.</p>)}
          {cta('Draai er zelf aan', 'Het artikel heeft een werkende kopie van de bediening, de demovideo en uitleg om er zelf een te bouwen.', 'Lees het hele artikel', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Eigen project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 maanden · Zelf geleerd · 3D-ontwerp · PCB-ontwerp</p>
          <p className="hp-rd-lead">Een paar ESP32-handhelds die off-grid met elkaar praten: tekst via LoRa over lange afstand en tweewegspraak via ESP-NOW.</p>
          {chapter('01', 'Twee radio’s, twee taken', <><p>LoRa brengt tekst over lange afstand, terwijl ESP-NOW tweewegspraak met weinig vertraging doet, en ik programmeerde beide handsets in PlatformIO met het Arduino-framework.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="De binnenkant van de LoRA Messenger" loading="lazy" /></>)}
          {chapter('02', 'Een eigen PCB, met de hand gereflowd', <><p>Ik ontwierp het board in KiCAD en reflowde de SMD-onderdelen zelf, en een TP4056-schakeling erop regelt het opladen.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="Eigen PCB" loading="lazy" /></>)}
          {chapter('03', 'Audio en behuizing', <><p>Een I2S-microfoon en een speaker regelen de gesprekken en twee OLED-schermpjes tonen berichten en status, alles in een 3D-geprinte behuizing die ik in Onshape modelleerde.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="3D-geprinte behuizing" loading="lazy" /></>)}
          {cta('Zie hoe het samenkwam', 'Het artikel gaat over de breadboardfase, de nieuwe versies van de PCB en wat ik heb geleerd.', 'Lees het hele artikel', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('LUMEN-spraakassistent', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT Programming · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">Een spraakassistent voor een slimme kamer die wakker wordt als je &ldquo;Hello Robot&rdquo; zegt. Een ESP32 neemt op wat je daarna zegt, een FastAPI-relay zet het om in tekst en vraagt een LLM om één strikt JSON-commando, en dat commando gaat via MQTT terug naar de kamer.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'Spraak naar één JSON-commando', <p>De ESP32 streamt 16&nbsp;kHz-audio naar de server, waar Whisper het via OpenRouter uitschrijft en een DeepSeek-LLM er precies één commando van maakt (een actie, een reeks of een timer), dat tegen een schema wordt gecontroleerd voordat het bij het board aankomt.</p>)}
          {chapter('02', 'Passend op een board zonder PSRAM', <><p>De WROOM had met wifi aan zo&rsquo;n 33&nbsp;KB vrij RAM, terwijl een spraakfragment ongeveer 96&nbsp;KB is. Daarom wordt de audio tijdens het opnemen via een raw socket gestreamd in plaats van in het geheugen te blijven, en het geheugengebruik blijft tijdens een upload op zo&rsquo;n 10&nbsp;KB piek.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="De INMP441-microfoon aangesloten op de ESP32" loading="lazy" /></>)}
          {chapter('03', 'Een kamer waar je tegen praat', <><p>Lampen, een NeoPixel, een ventilator, een servo en een zoemer reageren op commando&rsquo;s, en er is ook een lokale automatische modus en een webdashboard. Vraag je om &ldquo;zet de helderheid op de luchtvochtigheid&rdquo;, dan leest hij de live sensor uit en doet precies dat.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="Het webdashboard van LUMEN" loading="lazy" /></>)}
          {cta('Zie het hele project', 'Het artikel gaat over de geheugenlimieten, de bedrading en een interactieve demo.', 'Lees het hele artikel', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('OCR Reader met DrumNet: een volledig verticaal geïntegreerde OCR-oplossing voor watermeters', ['Eigen project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">Een goedkope camera op een batterij die je over een mechanische watermeter zet. Hij leest de rollen met een neuraal netwerk van 693K parameters dat helemaal op een ESP32-S3 draait, en stuurt het getal daarna via LoRaWAN naar huis.</p>
          {chapter('01', 'DrumNet op de chip', <><p>Een spotter vindt het cijfervenster, een refiner legt de randen vast door kolommen en rijen van de feature maps te middelen, en drie lezers stemmen over elke rol, met de carry-regel toegepast. Het hele netwerk draait in INT8 en doet zo&rsquo;n 2 seconden over een meting.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="De stemming van het DrumNet-ensemble en de meting" loading="lazy" /></>)}
          {chapter('02', 'Getraind door zes agents', <><p>MeterSim rendert gelabelde meters en SimGen2 laat ze eruitzien als camerabeelden, terwijl zes AI-agents om de beurt de GPU en de Jetson-rig gebruikten via een reserveringsplanner, 24/7 via Tailscale en T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="De negen meterontwerpen in MeterSim" loading="lazy" /></>)}
          {chapter('03', 'Een board, een behuizing, 9 uur reflowen', <><p>De vierlaagse KiCad-PCB heeft batterijbeheer, LoRa en PWM-leds aan boord. Ik heb hem met de hand in elkaar gezet, onder een microscoop gedebugd en in een 3D-geprinte behuizing zonder gereedschap gestopt, met een adapter voor de meter.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="3D-render van het Prototype V2-board" loading="lazy" /></>)}
          {cta('Loop de hele pipeline door', 'Het artikel volgt de DrumNet-run stap voor stap, met een 3D-rondleiding over het board, een ConfigKing-simulator en het volledige verslag.', 'Lees het hele artikel', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader, een privé-boekenlezer', ['Eigen project'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Webapp · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Zelf geleerd</p>
          <p className="hp-rd-lead">Een kleine, privé online boekenlezer voor een handjevol vrienden, die inloggen met één toegangscode. De app onthoudt precies waar je gebleven was, laat zien wie er nog meer leest en houdt ieders voortgang bij.</p>
          {chapter('01', 'Een bibliotheek die je onthoudt', <><p>Als je een boek opent, springt het terug naar precies het hoofdstuk en de scrollpositie waar je was. Die wordt als breuk opgeslagen, zodat hij nog klopt na een andere lettergrootte, en de kleur, het lettertype en de opmaak van elke lezer worden ook bewaard.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="De leesweergave" loading="lazy" /></>)}
          {chapter('02', 'Samen lezen', <><p>Je ziet wie er online is, herkent een vriend in hetzelfde boek aan de groene ring en het hoofdstuknummer, en kunt een zwaai of een kort berichtje sturen dat weer verdwijnt.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Aanwezigheid en snelle berichtjes" loading="lazy" /></>)}
          {chapter('03', 'Een filter dat SQL afdwingt', <p>Expliciete hoofdstukken worden in de databasequery zelf afgeschermd, dus afgeschermde tekst verlaat de server nooit voor een lezer zonder toegang. Hetzelfde hoofdstuk kan er voor elke lezer anders uitzien, en de cal-modus haalt het helemaal weg.</p>)}
          {cta('Zie het hele project', 'Het artikel gaat over aanwezigheid, het inhoudsfilter, webtoons en de stack.', 'Lees het hele artikel', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('EMA Smart Home System', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">EMA Smart Home System</h2>
          <p className="hp-md-meta">3 maanden · Groepsproject school · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">Een smart home dat ik met mijn team van vijf bouwde voor een module over duurzaam wonen, beoordeeld met een A. Vier BeagleBone-nodes rapporteren aan een SocketIO-server met een live 3D-dashboard.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="EMA Smart Home" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Vier nodes, elk één taak', <><p>De vier nodes doen het klimaat, de badkamer, de keuken (het verbruik van de koelkast en een brandalarm) en inbraak, en elke BeagleBone Black Wireless heeft MikroBUS-sensormodules.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="De hardware van de keukennode" loading="lazy" /></>)}
          {chapter('02', 'Eén server voor allemaal', <><p>Elke node maakt verbinding met een SocketIO-webserver, die het dashboard host en het brandalarm op alle nodes tegelijk laat afgaan.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="Hoe elk deel van het systeem verbonden is" loading="lazy" /></>)}
          {chapter('03', 'Een live 3D-dashboard', <><p>Het dashboard laat live data zien op een 3D-model van het huis in Spline, en ik ontwierp de UI in Figma.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="Het 3D-dashboard van EMA" loading="lazy" /></>)}
          {cta('Probeer het of lees het artikel', 'Er is een live demo van het dashboard en ook het volledige artikel over het project.', 'Live demo', 'https://csdpdemo.chiambucket.com', { label: 'Lees het artikel', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Pandus Dispenser', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pandus Dispenser</h2>
          <p className="hp-md-meta">1 maand · Eerste schoolproject · 3D-ontwerp · PyFirmata</p>
          <p className="hp-rd-lead">Mijn eerste schoolproject was een 3D-geprinte siroopdispenser van zes onderdelen, en elk onderdeel paste bij de eerste print.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Pandus Dispenser" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Wat hij doet', <><p>Hij schenkt drie bekergroottes, wordt wakker als er iemand aan komt lopen, en heeft een servodeurtje en een krachtige led om de beker te verlichten.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Het Pandus-model in Onshape" loading="lazy" /></>)}
          {chapter('02', 'Besturing en onderdelen', <><p>Een Arduino Uno R3, aangestuurd met PyFirmata, bedient een servo, leds, een relaisboard, knoppen, een DC-pomp en een infrarood botsingsdetectiemodule.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Het stroomschema van Pandus" loading="lazy" /></>)}
          {cta('Het hele project', 'Het artikel gaat over de onderdelen, de stroomschema’s en het Onshape-model.', 'Lees het hele artikel', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F Safe Freezer System', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">ELEC-F Concept</h2>
          <p className="hp-md-meta">Veilig vriezersysteem · Team van 4 · Engineeringvak · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">Een veiligheidssysteem voor vriezers dat mijn team en ik ontwierpen voor een engineeringvak. Mensen die in walk-in vriezers in fabrieken werken kunnen erin opgesloten raken, dus ELEC-F houdt de deur en de ruimte in de gaten en slaat alarm voordat de kou gevaarlijk wordt.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F Safe Freezer System" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Het probleem', <><p>Kapotte sloten, bevroren afdichtingen of gewoon onoplettendheid kunnen ervoor zorgen dat iemand in een walk-in vriezer opgesloten raakt, waar onderkoeling snel toeslaat. ELEC-F is er om die tijd korter te maken en wie er vastzit gerust te stellen.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="Het vriezerprototype van ELEC-F" loading="lazy" /></>)}
          {chapter('02', 'Hoe het werkt', <><p>Een ToF-sensor leest of de deur open of dicht is, en een PIR-sensor checkt of er nog iemand binnen is. Gaat de deur dicht met iemand erin, dan start een timer, en als die afloopt knippert de RGB-unit en gaat de zoemer af.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="ELEC-F in ingeschakelde stand op de M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Gebouwd op M5Stack', <><p>Twee M5Stack Fire-controllers en een Mini Hub verbinden de ToF-, PIR- en RGB-units, gekozen omdat ze blijven werken bij de temperaturen onder nul die een vriezer vraagt.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="De M5Stack-controller aangesloten op zijn sensoren" loading="lazy" /></>)}
          {cta('Zie het hele concept', 'Het artikel gaat over het onderzoek, de bouw en een interactieve rondleiding.', 'Lees het hele artikel', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Kauli Concept', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Kauli Concept</h2>
          <p className="hp-md-meta">Concept · Communicatievaardigheden · 3D in Blender</p>
          <p className="hp-rd-lead">Een eigen productconcept dat ik bedacht en pitchte voor een project over communicatievaardigheden, gepresenteerd met 3D-scènes die ik in Blender bouwde.</p>
          {chapter('01', 'Van idee tot presentatie', <><p>De opdracht ging net zo goed over een idee overbrengen als over er een hebben, dus ik ontwierp het concept, renderde het in Blender en bouwde de presentatie om het helder aan een publiek te laten zien.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Render van het Kauli-concept" loading="lazy" /></>)}
          {soon('Kauli-concept', 'De renders en de pitch krijgen nog een volledig artikel.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Eigen project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Eigen · 3D-ontwerp · Ultralicht 20 g</p>
          <p className="hp-rd-lead">Mijn eigen versie van de populaire ZeroMouse, een ultralichte gamingmuis van 20 g die ik vanaf nul ontwierp om net wat beter te spelen in FPS-games.</p>
          {chapter('01', 'Ontwerpen op de gram', <p>Elk deel van de behuizing is zo gemodelleerd dat het gewicht verliest zonder stijfheid in te leveren, in balans tussen grip en het doel om rond de 20 gram uit te komen.</p>)}
          {soon('Series One Light', 'Het model en de afwegingen krijgen nog een volledig artikel.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Copy Board-PCB', ['Eigen project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Eigen · PCB-ontwerp · KiCAD · 1 week</p>
          <p className="hp-rd-lead">Een zelfgemaakte namaak in KiCAD van het ATMega328-devboard van NYP, zodat ik thuis mijn eigen exemplaar had om mee te werken.</p>
          {chapter('01', 'Uitgeplozen en nagebouwd', <p>Ik bouwde het schoolboard na in KiCAD aan de hand van het schema, en omdat sommige onderdelen niet meer gemaakt werden zocht ik vervangers. Daarna gebruikte ik het board voor mijn eerste echte poging tot reflow-solderen.</p>)}
          {soon('Copy Board', 'Onderdelen zoeken, de layout en het reflowen krijgen nog een volledig artikel.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Webontwikkelingsproject', ['Schoolproject'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Webontwikkelingsproject</h2>
          <p className="hp-md-meta">School · HTML &amp; CSS · Eerste website</p>
          <p className="hp-rd-lead">De eerste volledig werkende website die ik bouwde, in HTML en CSS, voor de eindopdracht van mijn les webontwikkeling. Deze site was mijn tweede poging.</p>
          {chapter('01', 'Waar het begon', <p>Dit was mijn kennismaking met bouwen voor het web, en het laat zien hoe ver mijn werk sindsdien is gekomen.</p>)}
          {soon('Zie waar het begon', 'De site staat nog steeds online.', { label: 'Live demo', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Minecraft Live Map', ['Eigen project'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Minecraft Live Map</h2>
          <p className="hp-md-meta">Eigen · Docker · Paper &amp; Dynmap</p>
          <p className="hp-rd-lead">Een zelfgehoste Minecraft-server op het homelab, met een live webkaart van de multiplayerwereld waarin iedereen in realtime kan rondkijken.</p>
          {chapter('01', 'Server en kaart', <p>Een Paper-server draait in Docker, met de Dynmap-plug-in die een live, interactieve kaart maakt die bijwerkt terwijl spelers verkennen en bouwen.</p>)}
          {soon('Verken de wereld live', 'De live kaart is voor iedereen open.', { label: 'Open de live kaart', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
