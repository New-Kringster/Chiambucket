import type { LumenCopy } from './en';

const nl: LumenCopy = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN is een spraakassistent voor een slimme kamer, gebouwd op een ESP32 zonder PSRAM. Het board hoort een wake word en neemt op met een INMP441-microfoon, een FastAPI-relay stuurt het fragment via OpenRouter naar Whisper en een DeepSeek-commandoparser, en MQTT brengt het commando naar de apparaten.',
    ogDescription: 'Een ESP32-spraakassistent die een wake word op het board zelf hoort, het fragment via een FastAPI-relay naar Whisper en een DeepSeek-commandoparser stuurt, en de kamer via MQTT bestuurt.',
  },
  ld: {
    headline: 'LUMEN, een ESP32-spraakassistent',
    description: 'Een spraakgestuurde assistent voor een slimme kamer, gebouwd voor het vak IoT Programming aan NYP. Een ESP32 met MicroPython neemt de vraag op, een FastAPI-relay roept OpenRouter aan voor spraak-naar-tekst met Whisper en een DeepSeek-commandoparser, en het commando gaat via MQTT terug naar de kamer.',
  },
  hero: {
    alt: 'Coverafbeelding van LUMEN, een slimme-huisassistent gebouwd met OpenAI Whisper en DeepSeek',
    back: 'Terug naar projecten',
    tag: 'Schoolproject',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN is een spraakgestuurde assistent voor een slimme kamer, die je gebruikt door “Hello Robot” te zeggen of een knop ingedrukt te houden en te praten. Een ESP32 neemt het geluid op, een server zet het om in tekst en laat een LLM er één JSON-commando van maken, en MQTT brengt dat commando naar de lampen, de ventilator, de servo en de zoemer. Het lastigste was om dit allemaal op een board met zo’n 33 KB vrij RAM te krijgen.',
    builtWith: 'Gemaakt met',
  },
  chapters: 'Hoofdstukken',
  rail: {
    overview: 'Overzicht', try: 'Probeer het', how: 'Hoe het werkt', brain: 'De parser', hardware: 'Hardware',
    memory: 'Geheugen', auto: 'Automodus', deploy: 'Dashboard', slides: 'Slides', next: 'Wat ik nog zou doen',
  },

  overview: {
    h: 'Overzicht',
    p: [
      'LUMEN was mijn miniproject voor het vak IoT Programming aan NYP, en de opdracht was gewoon om een verbonden apparaat te bouwen dat iets nuttigs doet. Ik wilde zien wat een goedkope ESP32 kon met echt taalbegrip in plaats van een vaste lijst commando’s.',
      'Hij luistert naar een wake word, neemt op wat je zegt en maakt er acties van: “dim het licht een beetje”, “zet de ventilator over tien minuten aan”, “zet de helderheid op de luchtvochtigheid”, “welterusten”. Het taalwerk draait op een kleine server, dus de ESP32 hoeft alleen geluid op te nemen en commando’s uit te voeren.',
    ],
    video: 'Het wake word, een paar gesproken commando’s en de kamer die reageert.',
  },

  try: {
    h: 'Probeer het',
    p: 'Deze demo volgt hetzelfde pad als het echte systeem, alleen kleiner: van een trigger naar Whisper voor spraak-naar-tekst, dan naar een DeepSeek-LLM die de tekst omzet in één JSON-commando (allebei via OpenRouter), en ten slotte via MQTT naar de apparaten. Je kunt hieronder een zin kiezen of ze een voor een laten langskomen.',
    note: 'De vraag over de temperatuur en het verzoek om een broodje laten de vangrails zien: een vraag wordt beantwoord met live sensordata zonder dat er iets gebeurt, en een onmogelijk verzoek wordt geweigerd. De ESP32 doet alleen iets met gevalideerde JSON.',
  },

  console: {
    title: 'LUMEN-console',
    wake: '“Hello Robot”',
    ptt: 'push-to-talk',
    pipeAria: 'Pipeline van het verzoek',
    stages: ['Trigger', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: 'Gehoord',
    parsed: 'Geparst',
    quote: '“{said}”',
    idle: 'Zeg "Hello Robot" of houd de knop ingedrukt om te praten.',
    room: 'De kamer',
    autoOn: 'Automodus aan',
    autoOff: 'Automodus uit',
    devices: { white: 'Witte led', rgb: 'NeoPixel', fan: 'Ventilator', servo: 'Servo' },
    on: 'aan',
    off: 'uit',
    motion: 'beweging',
    still: 'stil',
    dark: 'donker',
    lit: 'licht',
    timer: 'Timer: licht uit over 10 min',
    play: 'Start',
    pause: 'Pauze',
    steps: [
      { said: 'Zet het licht op cyaan en de ventilator een seconde later aan.', reply: 'Nu cyaan, ventilator over 1s.' },
      { said: 'Zet de helderheid op het percentage luchtvochtigheid.', reply: 'Helderheid op 69%.' },
      { said: 'Doe het licht over tien minuten uit.', reply: 'Licht uit over 10 min.' },
      { said: 'Hoe warm is het hier?', reply: 'Hier is het 24,3°C.' },
      { said: 'Welterusten.', reply: 'Welterusten.' },
      { said: 'Maak een broodje voor me.', reply: 'Sorry, dat kan ik niet.' },
    ],
  },

  how: {
    h: 'Hoe het werkt',
    p1: <><strong>De ESP32 denkt bijna niet na</strong>, want zijn enige taken zijn geluid opnemen en commando&apos;s uitvoeren. Spraak-naar-tekst, het taalmodel en het loggen draaien allemaal op een FastAPI-server in Docker op mijn homelab, die het board via het lokale netwerk bereikt.</>,
    p2: <>Een trigger (het wake word “Hello Robot”, of een push-to-talk-knop als reserve) laat een INMP441-microfoon 16&nbsp;kHz mono-audio opnemen. Het board verpakt dat als WAV en streamt het naar het <code>/upload</code>-endpoint van de server. De server gebruikt één <strong>OpenRouter</strong>-API-sleutel voor beide stappen: eerst zet Whisper de audio om in tekst, en dan maakt een DeepSeek-model er onder een strikte systeemprompt één JSON-commando van. Daarna valideert hij de JSON, publiceert hij die op een MQTT-topic waar de ESP32 op geabonneerd is, en zet hij elk resultaat in een Google Sheet met een geschatte prijs per verzoek.</>,
    p3: 'De server is ook geabonneerd op de status- en sensortopics van de kamer, bewaart de laatste waarden en geeft ze als context mee aan de LLM. Zo worden vragen als “hoe warm is het?” en “staat de ventilator aan?” beantwoord met echte metingen.',
    pipelineH: 'De spraakpipeline',
    steps: [
      <>Je <b>triggert</b> hem door “Hello Robot” te zeggen of de push-to-talk-knop ingedrukt te houden.</>,
      <>De INMP441 <b>registreert</b> zo&apos;n drie seconden 16&nbsp;kHz mono-audio, en de rode REC-led blijft branden zolang dat duurt.</>,
      <>Het board <b>verpakt</b> de ruwe PCM in een WAV-header van 44 bytes en <b>streamt</b> het naar <code>/upload</code> terwijl het nog opneemt.</>,
      <>De server stuurt het fragment naar OpenRouter, waar Whisper het <b>omzet in tekst</b>.</>,
      <>De server <b>voegt context toe</b> door het model het transcript te geven samen met een momentopname van de apparaatstatus en de sensormetingen.</>,
      <>Een DeepSeek-model, ook via OpenRouter, <b>parst</b> het tot één JSON-commando, dat de server tegen het schema controleert. Gaat dat mis, dan probeert hij het één keer opnieuw en valt daarna terug op een no-op.</>,
      <>De server <b>verstuurt</b> het commando via MQTT en voegt een rij toe aan de Google Sheet.</>,
      <>De ESP32 <b>voert het commando uit</b> en laat het antwoord op zijn OLED zien.</>,
    ],
  },

  flow: {
    stages: [
      { tag: 'Op de ESP32', title: 'Trigger en microfoon', text: 'Een wake word of push-to-talk laat de INMP441 16 kHz mono-audio opnemen.' },
      { tag: 'FastAPI-server, OpenRouter', title: 'Whisper, DeepSeek en validatie', text: 'Whisper maakt van spraak tekst en een DeepSeek-model parst die tot één JSON-commando, dat de server tegen het schema controleert, met één nieuwe poging voor een no-op.' },
      { tag: 'In de kamer', title: 'Apparaten en OLED', text: 'De led, de RGB, de ventilator, de servo en de zoemer reageren, en de OLED laat het antwoord zien.' },
    ],
    links: ['stream naar /upload', 'MQTT-commando'],
    caption: 'Het pad dat een spraakcommando aflegt van de ESP32 via de server naar de apparaten in de kamer',
  },

  brain: {
    h: 'De commandoparser',
    p: 'Het model bestuurt nooit zelf een apparaat, maar zet elke zin om in precies een van drie JSON-vormen:',
    shapes: [
      <><b>action</b> is één verandering, zoals “zet de ventilator aan” of “maak hem cyaan”.</>,
      <><b>sequence</b> is een reeks stappen op volgorde, elk met een vertraging vanaf het moment dat je sprak, zoals “lampen uit, en een seconde later de ventilator uit”.</>,
      <><b>timer</b> is één verandering na een aftelling, zoals “licht uit over tien minuten”.</>,
    ],
    p2: 'Het werkt ook in andere talen, want Whisper zet veel talen om in tekst en de parser koppelt elke taal aan dezelfde JSON-woordenschat. Een commando in het Maleis of Mandarijn geeft dezelfde actie als de Engelse versie.',
    p3: 'Een lange, strikte systeemprompt legt de apparaatwoordenschat vast (witte led, NeoPixel-RGB, ventilator, servo, zoemer, comfortbereik, automodus), dwingt geldige JSON af met getallen als getallen, en laat het model zelf kleurnamen naar RGB vertalen. De server controleert elk antwoord tegen een schema, en als er een faalt, probeert hij het één keer opnieuw en valt daarna terug op een no-op, in plaats van het board iets te sturen wat het niet kan vertrouwen.',
    p4: <>Het model kan ook de metingen van de kamer als invoer gebruiken. Vraag ik het om “de helderheid op het percentage luchtvochtigheid te zetten”, dan leest het de live luchtvochtigheid uit de bewaarde sensorstatus, rondt die af, houdt hem binnen het bereik van 0 tot 100 van de led en geeft een echt <code>set_brightness</code>-commando.</>,
  },

  chart: {
    aria: 'Een stroomdiagram van het parsen van commando’s. Whisper zet spraak in een van vele talen om in tekst, en daarna gaan de tekst en live sensorcontext naar de DeepSeek-LLM. Als de JSON die eruit komt niet door de schemavalidatie komt, probeert de server het één keer opnieuw, en is hij dan nog steeds ongeldig, dan is het resultaat een veilige no-op. Is hij geldig, dan wordt het commando op type doorgestuurd: als action voor één verandering aan een apparaat, als sequence voor stappen op volgorde met vertragingen, of als timer voor één verandering na een aftelling.',
    input: { t: 'Transcript en sensorcontext', s: 'Whisper-transcript plus een live momentopname uit de MQTT-cache' },
    note: { t: 'Meertalige invoer', s: 'Whisper kent veel talen' },
    badge: 'Spreekt veel talen',
    llm: { t: 'DeepSeek-LLM (via OpenRouter)', s: 'Parst het verzoek tot één JSON-commando' },
    valid: ['JSON-schema', 'geldig?'],
    validOne: 'JSON-schema geldig?',
    yes: 'Ja',
    no: 'Nee',
    fails: 'faalt',
    route: { t: 'Doorsturen op type', s: 'action, sequence of timer' },
    outcomes: ['Eén apparaatwijziging', 'Stappen met vertraging', 'Eén wijziging later'],
    retry: { t: 'Eén keer opnieuw', s: 'LLM opnieuw vragen', phone: 'De LLM opnieuw vragen' },
    noop: { t: 'Veilige no-op', s: 'antwoord, geen actie', phone: 'Alleen een antwoord, niets in de kamer' },
    ifInvalid: 'indien ongeldig',
    failurePath: 'Foutpad',
    stillFails: 'faalt weer',
    ifValid: 'indien geldig',
    byType: 'op type',
    caption: 'Hoe een spraakcommando door de parser gaat, waarbij elk pad eindigt als action, sequence, timer of een weigering die niets doet',
  },

  prompt: {
    eyebrow: 'De systeemprompt die LUMEN naar het model stuurt',
    viewAria: 'Weergave van de prompt',
    formatted: 'Opgemaakt',
    code: 'Code',
    more: 'Toon de hele prompt',
    less: 'Toon minder',
  },

  hardware: {
    h: 'Hardware',
    p1: 'Alles hangt aan één ESP32-WROOM met MicroPython, met de ingangen aan de ene kant en de uitgangen aan de andere. Eén niet-blokkerende hoofdlus bedient ze allemaal, zodat het herkennen van de trigger nooit vastloopt.',
    p2: 'De LDR is een digitale lichtmodule met een eigen potmeter voor de gevoeligheid, dus er zijn geen analoge metingen. Zo omzeil ik het conflict van de ADC van de ESP32 met wifi. Een rode led brandt alleen terwijl de microfoon opneemt, en een SSD1306-OLED met twee navigatieknoppen laat de status en het laatste commando zien over vier pagina’s. De DF2301Q-wakewordmodule is aangesloten en de driver is geschreven, maar op de werkbank demo ik met de push-to-talk-knop.',
    micAlt: 'Close-up van de INMP441-I2S-microfoon aangesloten op de ESP32',
    micCaption: 'De INMP441-I2S-microfoon.',
  },

  hub: {
    aria: 'Een bedradingskaart met een ESP32-WROOM in het midden. Links staan de sensoren en hun pinnen: de INMP441-microfoon op I2S (GPIO 14, 23, 32), de DHT22 (GPIO 4), de PIR (GPIO 35), de LDR (GPIO 34) en de push-to-talk-knop (GPIO 19). Rechts staan de uitgangen: de witte led (GPIO 25), NeoPixel (GPIO 27), ventilator (GPIO 26), servo (GPIO 13), zoemer (GPIO 33) en opname-led (GPIO 17). Onderaan draagt de gedeelde I2C-bus (SDA 21, SCL 22) de SSD1306-OLED (0x3C) en de DF2301Q-wakewordmodule (0x64), en twee navigatieknoppen zitten op GPIO 18 en 16.',
    inputs: 'Sensoren en ingangen',
    outputs: 'Uitgangen',
    bus: 'I2C-bus (SDA 21, SCL 22) en UI-knoppen',
    core: { t: 'ESP32', s: ['WROOM, MicroPython', 'één niet-blokkerende lus'], phone: 'ESP32-WROOM', phoneS: 'MicroPython, één niet-blokkerende lus' },
    parts: {
      mic: { n: 'INMP441-mic', s: 'I2S-microfoon' },
      dht: { n: 'DHT22', s: 'temperatuur en vocht' },
      pir: { n: 'PIR', s: 'beweging' },
      ldr: { n: 'LDR-module', s: 'licht of donker' },
      ptt: { n: 'PTT-knop', s: 'push-to-talk' },
      led: { n: 'Witte led', s: 'PWM-helderheid' },
      neo: { n: 'NeoPixel', s: 'WS2812 RGB' },
      fan: { n: 'Ventilator', s: 'aan of uit' },
      servo: { n: 'Servo', s: '0 tot 180°' },
      buzzer: { n: 'Zoemer', s: 'piepjes en alarm' },
      rec: { n: 'REC-led', s: 'opname' },
      oled: { n: 'OLED', s: 'SSD1306, 0x3C' },
      wake: { n: 'DF2301Q', s: 'wake word, 0x64' },
      navA: { n: 'Nav A', s: 'pagina' },
      navB: { n: 'Nav B', s: 'pagina' },
    },
    caption: 'Elk onderdeel en de GPIO die het gebruikt, waarbij de OLED en de DF2301Q één I2C-bus delen',
  },

  memory: {
    h: 'Passend in het geheugen',
    p1: 'De ESP32-WROOM heeft geen PSRAM, en met wifi aan liet MicroPython me zo’n 33 KB bruikbaar RAM over. Een spraakfragment is ongeveer 96 KB, dus de audio past niet in één keer in het geheugen.',
    p2: <>Om dat te omzeilen houdt niets ooit het hele fragment vast. De microfoon is één blijvende, voorverwarmde instantie, de opnamebuffers zijn klein en worden pas aangemaakt als ze nodig zijn, en de upload wordt tijdens het opnemen <strong>via een raw socket gestreamd</strong>: eerst een preambule, dan de WAV-header, dan de PCM stukje voor stukje en ten slotte een staart. Zo blijft het geheugen tijdens een upload op zo&apos;n 10&nbsp;KB piek. Maak je in plaats daarvan één groot <code>bytes</code>-object, dan pakt de garbage collector een blok van ~26&nbsp;KB uit dezelfde heap die wifi en de I2S-microfoon nodig hebben, en dan krijgt de netwerkstack te weinig tot de upload een time-out geeft.</>,
    p3: <>De huidige firmware heeft een sober statusscherm van vier pagina&apos;s op de OLED, want een rijkere versie met live bijgewerkte sensorwaarden en een opnamescherm liet de heap zo groeien dat het opstarten misging. Daarmee kon het board geen verbinding meer maken met MQTT (<code>ENOBUFS</code>) en de microfoon niet meer openen (<code>ENOMEM</code>). Om ruimte te maken heb ik ook de realtimeklok en de schema&apos;s op kloktijd weggehaald, dus timers lopen nu op een monotone tick-teller en hebben geen klok nodig.</>,
  },

  auto: {
    h: 'Automodus',
    p: [
      'De automodus draait lokaal op het board. Ziet hij beweging terwijl de kamer donker is, dan zet hij de witte led aan, en na vijf minuten zonder beweging weer uit. Stijgt de temperatuur boven het comfortbereik, dan zet hij de ventilator aan, met een hysteresemarge zodat de ventilator niet steeds aan- en uitspringt rond de drempel.',
      'Elk gesproken commando gaat voor en wist de automatische stand, zodat de automodus nooit een lamp overschrijft die je net hebt ingesteld.',
    ],
  },

  deploy: {
    h: 'Dashboard en deployment',
    p: [
      'De server is een FastAPI-app in Docker met een webdashboard: bediening van de apparaten (witte led, RGB-kiezer, ventilator, servo, zoemer, schakelaar voor de automodus, editor voor het comfortbereik), een live statusuitlezing, een grafiek van de temperatuur en luchtvochtigheid, een log van recente commando’s, een speler voor de laatste paar spraakopnames, en een tekstvak dat via hetzelfde LLM-pad loopt. Dat tekstvak is mijn reserve voor als de microfoon het tijdens een live demo laat afweten, en een reset wist de grafiek, het log en de opnames.',
      'Het draait op mijn homelab achter Nginx Proxy Manager en Cloudflare, die het dashboard op een HTTPS-hostnaam serveren. De MQTT-broker wordt direct bereikt in plaats van via Cloudflare, en de ESP32 praat alleen met een LAN-adres in plaats van de publieke hostnaam, zodat de firmware klein blijft.',
    ],
    dashAlt: 'Het webdashboard van LUMEN: bediening van de apparaten, live uitlezing, grafiek en activiteitenlog',
    dashCaption: 'Het webdashboard van LUMEN',
  },

  slides: {
    h: 'Slides',
    p: 'Dit zijn de slides die ik bij de beoordeling van het vak presenteerde, over de opdracht, de pipeline, het geheugenwerk en de demo.',
    frame: 'Presentatie van het LUMEN-project (Figma-deck)',
  },

  next: {
    h: 'Wat ik nog zou doen',
    p: 'Een ESP32-S3 met PSRAM zou het meeste terugbrengen van wat ik heb geschrapt, want de WROOM zit al aan zijn limiet als hij microfoonaudio streamt terwijl hij wifi en MQTT draait.',
    items: [
      <><b>Een rijkere OLED</b> met de live bijgewerkte sensorpagina&apos;s en het opnamescherm die ik moest weghalen.</>,
      <><b>Schema&apos;s op kloktijd</b> (“elke dag om 8&nbsp;uur”), die de realtimeklok nodig hebben die ik heb weggehaald om geheugen te sparen.</>,
      <><b>Blijvende geschiedenis</b>, zodat de grafieken van het dashboard en de timers een herstart overleven, want nu staan de laatste paar uur alleen in het RAM.</>,
      <><b>Een werkend wake word</b> op de hardware, zodat push-to-talk de reserve wordt in plaats van de hoofdtrigger.</>,
    ],
  },
};

export default nl;
