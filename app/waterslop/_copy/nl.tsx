import type { WaterslopCopy } from './en';

/* De Nederlandse woorden van het OCR Reader-artikel, in dezelfde vorm als en.tsx. */
const nl: WaterslopCopy = {
  meta: {
    title: 'OCR Reader, een watermeterlezer met camera op een ESP32-S3 | Chiambucket',
    description:
      'OCR Reader is een goedkope watermeterlezer op een batterij die de meter met een camera afleest. Een netwerk van 693K parameters, DrumNet V10, draait helemaal op de ESP32-S3 om de rollen te lezen, en de meting gaat via LoRaWAN de deur uit. Het artikel loopt door MeterSim, SimGen2, de zes agents die het netwerk trainden, het netwerk stap voor stap, de firmware, de PCB in 3D, de behuizing en een ConfigKing-simulator.',
    ogTitle: 'OCR Reader: een watermeterlezer met camera op een ESP32-S3',
  },
  ld: { headline: 'OCR Reader: een watermeterlezer met camera en OCR op een ESP32-S3' },

  ui: {
    chapterDash: 'Hoofdstuk - {n}',
    next: 'Volgende',
    nextChapter: 'Volgend deel',
    nextFrame: 'Volgend beeld',
    coverAria: 'Hoofdstuk {n}: {title}',
    coverN: 'Hoofdstuk {n}',
    coverContents: 'In hoofdstuk {n}',
    ck: {
      hint: 'Tik op het scherm of een toets om te sturen',
      deviceAria: 'ConfigKing-simulator op een M5Stack Cardputer. Klik op het scherm of de toetsen en gebruik daarna de pijltjestoetsen, Enter, Escape en Tab.',
      keyboard: 'Cardputer-toetsenbord',
      view: 'Beeld',
      close: 'Inzoomen',
      full: 'Volledig',
      zoom: 'Vergroot',
      fullScreen: 'Volledig scherm',
      exitFullScreen: 'Volledig scherm sluiten',
    },
  },

  entrance: 'Watermeter-OCR op een ESP32-S3',
  skip: { toEnd: 'Naar het einde', toTop: 'Terug naar boven' },

  hero: {
    label: 'OCR Reader',
    labelSub: 'Watermeter-OCR op een ESP32-S3 · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader is een goedkope, zuinige watermeterlezer die de meter met een camera en OCR afleest. Een neuraal netwerk van 693K parameters, DrumNet V10, draait helemaal op de ESP32-S3 van de lezer. Daar vindt het het cijfervenster, leest het elke rol en stuurt het het getal in zo’n 2 seconden via LoRaWAN naar huis. Het doel is 99 % nauwkeurigheid op een batterij die 2 jaar meegaat. De huidige versie leest 56 % van de metingen goed, en ik wil dat nog verbeteren.',
    contentsAria: 'Hoofdstukken',
    start: 'Begin hier',
    report: 'Het verslag',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  chapters: {
    v2: 'PCB & behuizing', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: 'Agentische workflow',
    firmware: 'Firmware', power: 'Stroombesparing', camera: 'Camerakeuze', proto: 'Prototype V2', conclusion: 'Conclusie', report: 'Het verslag',
  },

  /* ── Hoofdstuk I tot III: het 3D-hoofdstuk, de DrumNet-film en ConfigKing ── */
  pcb: {
    aria: 'De PCB en behuizing van Prototype V2 in 3D, met aan het eind de lezer die een foto van de meter maakt',
    chapterColon: 'Hoofdstuk {n}:',
    name: 'OCR Reader-PCB',
  },

  film: {
    aria: 'Een animatie van de hele DrumNet V10-architectuur',
    title: 'DrumNet',
    of: '{stage} · {n} van {total}',
    nudge: 'De film speelt vanzelf, en zo meteen gaat de pagina verder.',
    scenesAria: 'Scènes',
    sceneAria: '{n}. {title}',
    prev: 'Vorige scène',
    prevTitle: 'Vorige (←)',
    play: 'Afspelen',
    pause: 'Pauze',
    replay: 'Opnieuw',
    playTitle: 'Afspelen / pauze (spatie)',
    next: 'Volgende scène',
    nextTitle: 'Volgende (→)',
    fast: 'Vooruitspoelen, nu {n} keer zo snel',
    fastTitle: 'Vooruitspoelen (f)',
    skip: 'Overslaan',
    skipTitle: 'Door naar het volgende hoofdstuk, ConfigKing',
    scenes: {
      photo: {
        stage: 'Opname', title: 'De foto die de lezer net maakte',
        body: 'Dit is één beeld van 800 × 600 in grijstinten, en alles vanaf hier draait op de ESP32-S3 met alleen deze foto.',
      },
      downscale: {
        stage: 'Invoer', title: 'De opname verkleinen',
        body: 'De lezer legt de meter vast op 800 × 600 in grijstinten, en voor de spotter wordt dat verkleind tot 320 × 240. Dat zijn vier keer minder getallen, dus de ruwe zoektocht gaat snel en kost weinig.',
      },
      'spot-net': {
        stage: 'Spotter', title: 'Vijf blokken krimpen de miniatuur tot een raster van 10 × 7',
        body: 'Elk blok schuift een kernel van 3 × 3 over zijn invoer, houdt de sterke reacties over (ReLU) en halveert de grootte (max-pool). De miniatuur wordt 8 feature maps, daarna 16, 24, 32 en 32, elke keer half zo groot, tot één cel van het laatste blok staat voor een stukje van 32 × 34 uit de miniatuur.',
      },
      'spot-head': {
        stage: 'Spotter', title: 'De scoremap kiest de cel, de andere vier zeggen waar',
        body: 'Een convolutie van 1 × 1 maakt van blok 5 vijf maps van 10 × 7, en de scoremap kiest de cel die het meest waarschijnlijk het midden van het cijfervenster bevat. Die positie gaat naar de maps voor dx, dy, breedte en hoogte, die op dezelfde cel worden gelezen, en samen tekenen ze een kader op de miniatuur.',
      },
      'spot-crop': {
        stage: 'Spotter', title: 'Een ruw kader, en dan een ruime uitsnede',
        body: 'De spotter werkt grof, dus het kader wordt 1,5 × breder gemaakt, en de uitsnede eromheen is 1,5 × zo breed en 2,4 × zo hoog. Hij wordt uit het volle beeld van 800 × 600 gesneden, niet uit de miniatuur, en gaat dan door naar de refiner.',
      },
      'ref-net': {
        stage: 'Refiner · ronde 1', title: 'Vier blokken brengen de uitsnede terug tot 32 maps van 32 × 12',
        body: 'De uitsnede wordt grijs gemaakt en geschaald naar 256 × 96, en RefNet draait vier blokken van dezelfde soort als de spotter. Het laatste blok doet geen pooling, dus blok 4 houdt 32 maps van 32 × 12 over, één kolom voor elke 8 pixels van de uitsnede.',
      },
      'ref-avg': {
        stage: 'Refiner · ronde 1', title: 'Elke map wordt gemiddeld tot één rij en één kolom',
        body: 'Blok 4 is een stapel van 32 maps, en die komen een voor een los. De 32 kolommen van een map worden gemiddeld tot één rij van de kolomgemiddelden, en de 12 rijen tot één kolom van de rijgemiddelden. Zo vindt de eerste links en rechts, en de tweede boven en onder.',
      },
      'ref-heads': {
        stage: 'Refiner · ronde 1', title: 'De gemiddelden worden stroken met scores en offsets',
        body: 'Een convolutie van 1 × 1 leest elke kolom van de kolommap en maakt er vier stroken van: een score en een offset voor de linkerrand, en hetzelfde voor de rechterrand. De rijmap wordt nog eens vier stroken voor boven en onder. De hoogste score kiest de cel, de offset zegt waar in die cel de rand zit, en de vier randen vormen samen het kader.',
      },
      'ref-pass2': {
        stage: 'Refiner · ronde 2', title: 'Het kader vergroten, opnieuw uitsnijden en hetzelfde net draaien',
        body: 'Het kader uit ronde 1 is maar zo goed gecentreerd als de gok van de spotter, dus het wordt vergroot, opnieuw uitgesneden en door precies dezelfde refiner gestuurd, met dezelfde vier blokken, uitgangen en 15.400 gewichten. Ronde 2 speelt ronde 1 snel opnieuw af, en het kader dat eruit komt gaat door naar de lezer.',
      },
      cut: {
        stage: 'Knippen', title: 'Het venster in rollen knippen',
        body: 'De indeling van 4 hele rollen en 2 decimale rollen is bij de installatie ingesteld, dus het venster wordt in zes gelijke cellen gesneden. Elke cel wordt grijs gemaakt, op vol contrast gezet op 32 × 64 en naar de lezers gestuurd. We volgen de zesde rol, de 7.',
      },
      'rd-net': {
        stage: 'Lezer 1', title: 'Een lezer maakt van één cel 96 piepkleine maps',
        body: 'De lezer gebruikt nog een keer dezelfde vier blokken van 3 × 3-convolutie, ReLU en max-pool, maar breder, met 16, 48, 96 en 96 maps. Zo eindigt de cel van 32 × 64 als 96 maps van 2 × 4, waarbij één cel staat voor een stukje van 16 × 16 van de rol.',
      },
      flatten: {
        stage: 'Lezer 1', title: '96 maps platslaan tot één lijst van 768',
        body: 'Hier wordt niets berekend. De eerste map komt los van het blok en de 2 × 4 cellen worden rij voor rij in een regel van 8 gelezen. Daarna volgen de andere 95 maps tot het blok leeg is, dus de 768 getallen staan altijd in dezelfde volgorde, met map 1 voorop en map 96 achteraan.',
      },
      dense: {
        stage: 'Lezer 1', title: 'De dense laag maakt van 768 getallen 96 units',
        body: 'Elk van de 96 units vermenigvuldigt elk getal met een eigen gewicht, telt de 768 producten en een offset op, en maakt alles onder nul gelijk aan nul. Unit 69 gaat eerst, rustig aan, en daarna doen de andere 95 hetzelfde.',
      },
      digit: {
        stage: 'Lezer 1', title: 'De cijferuitgang maakt van tien scores één antwoord',
        body: 'Elk cijfer van 0 tot 9 heeft zijn eigen 96 gewichten en offset, dus tien gewogen sommen geven tien scores. Softmax neemt e tot de macht van elke score en deelt door het totaal, waardoor één duidelijke voorsprong bijna alle kans krijgt. De 7 wint met 96,4 %, en dat percentage is de zekerheid.',
      },
      roll: {
        stage: 'Lezer 1', title: 'De draaiuitgang meet hoe ver de rol gedraaid is',
        body: 'Nog één gewogen som van de 96 units geeft een draaiscore, die tanh platdrukt tot −0,5 tot +0,5. Dat zegt hoe ver de rol voorbij zijn stand staat. Deze 7 is 3,7 % van een stap richting de 8 gedraaid.',
      },
      readers3: {
        stage: 'Lezer-ensemble', title: 'Lezer 2 en 3 lezen dezelfde rol',
        body: 'De drie lezers hebben dezelfde architectuur, maar zijn vanuit verschillende willekeurige starts getraind, dus ze maken verschillende fouten. Dezelfde cel gaat op dezelfde manier, snel, door lezer 2 en 3, en elk geeft zijn eigen tien percentages en zijn eigen draai.',
      },
      vote: {
        stage: 'Stemming', title: 'Drie antwoorden worden gemiddeld tot één',
        body: 'De antwoorden van de drie lezers komen samen bij de stemming, waar hun lijsten met kansen worden gemiddeld. Zo heeft elke lezer evenveel stemrecht en beslist de derde bij een gelijkspel. De gemiddelde lijst geeft het cijfer en de zekerheid, de drie draaiwaarden worden ook gemiddeld, en rol 6 komt eruit als een 7 met 98,8 %.',
      },
      drums: {
        stage: 'Stemming', title: 'Elke andere rol gaat door dezelfde machine',
        body: 'De andere vijf cellen gaan snel door dezelfde stappen, de vier blokken, het platslaan, de dense laag en de twee uitgangen, in alle drie de lezers tegelijk, en dan de stemming, tot er zes gemiddelde antwoorden voor de carry-regel klaarstaan. Rol 3 is het minst zeker, een 9 met 71,5 %, omdat lezer 3 een 0 zag en werd overstemd.',
      },
      carry: {
        stage: 'Stemming', title: 'De carry-regel, en dan de meting',
        body: 'Een rol mag alleen halverwege staan als de rol rechts ervan op 9 of 0 staat, of als het de laatste rol is. Dan wordt de draai vertrouwd en mag het cijfer doorschuiven. Staat de rechterrol op 1 tot 8, dan wordt deze rol vastgezet op het dichtstbijzijnde cijfer, zodat 79 dat naar 80 draait niet als 89 wordt gelezen. Hier valt elke draai binnen de dode band, dus elke rol houdt zijn cijfer en de meting is 0092.07.',
      },
      finale: {
        stage: 'DrumNet V10', title: 'De hele pipeline tegelijk aan het werk',
        body: 'Nog één keer draait elke stap tegelijk, van de miniatuur en de spotter via de refiner, de zes cellen, de drie lezers en de stemming tot de carry-regel. Daar doet de lezer zo’n twee seconden over per getal.',
      },
    },
    panels: {
      input: { title: 'Invoer', sub: 'één foto van de lezer' },
      spotter: { title: 'DetNet Spotter', sub: 'een ruw kader rond het cijfervenster' },
      ref1: { title: 'RefNet Refiner · ronde 1', sub: 'vind de vier randen in het ruwe kader' },
      ref2: { title: 'RefNet Refiner · ronde 2', sub: 'vergroten, opnieuw uitsnijden en herhalen' },
      cut: { title: 'In cijfers knippen', sub: 'één cel per rol' },
      reader1: { title: 'DrumNet-lezer 1', sub: 'welk cijfer er staat en hoe ver het draaide' },
      reader2: { title: 'DrumNet-lezer 2', sub: 'hetzelfde net, andere willekeurige start' },
      reader3: { title: 'DrumNet-lezer 3', sub: 'de tiebreaker' },
      vote: { title: 'Stemming en meting', sub: 'gemiddelde, carry-regel, meting' },
    },
    draw: {
      block: 'blok {n}',
      mapsOne: '{n} map · {sub}',
      maps: '{n} maps · {sub}',
      weights: '{n} gewichten',
      noPool: '{sub} · geen pool',
      greyJpeg: '800 × 600 · grijze JPEG',
      fewer: '{n} getallen · 4 × minder',
      thumbnail: 'miniatuur',
      conv5: '1 × 1 conv · 32 → 5',
      score: 'score',
      chosen: 'hoogste van de 70 cellen: gekozen',
      across: 'midden {n} % in de breedte',
      down: 'midden {n} % in de hoogte',
      width: 'breedte 0.25 van het beeld · {n} px',
      height: 'hoogte 0.12 van het beeld · {n} px',
      headCols: ['cel', 'ruw', '0 tot 1', 'betekenis'],
      sigmoid: '0 tot 1 is de sigmoid van de ruwe waarde',
      corner: 'dx, dy vanaf de hoek van de cel',
      selection: 'selectie van de spotter · {w} × {h} px',
      widened: '1.5 × verbreed',
      cropBox: 'de uitsnede · 1.5 × breder, 2.4 × hoger · {w} × {h} px',
      cutFrom: 'uit het volle beeld van 800 × 600, niet de miniatuur',
      colAvgSize: 'kolomgemiddelden · 32 × 32',
      colAvgNote: 'één rij per map · 12 waarden → 1',
      rowAvgSize: 'rijgemiddelden · 32 × 12',
      rowAvgNote: 'één kolom per map · 32 waarden → 1',
      slab: 'blok 4 · 32 maps · 32 × 12',
      peel1: 'terwijl map 1 loskomt, wordt elk van zijn 32 kolommen één waarde,',
      peel2: 'en elk van zijn 12 rijen ook',
      mapOf: 'map {n} van 32',
      colAvg: 'kolomgemiddelden',
      rowAvg: 'rijgemiddelden',
      sameCol: 'zelfde gewichten voor elke kolom',
      sameRow: 'zelfde gewichten voor elke rij',
      conv: '1 × 1 conv',
      inOut: '32 in, 4 uit',
      leftScore: 'score links', leftOffset: 'offset links', rightScore: 'score rechts', rightOffset: 'offset rechts',
      topScore: 'score boven', topOffset: 'offset boven', bottomScore: 'score onder', bottomOffset: 'offset onder',
      stripsKey: 'vol: de hoogste score · gestippeld: de offset · de lijn: waar de rand in de cel zit',
      crop: 'uitsnede · 256 × 96 grijs',
      expanded: 'vergroot · {w} × {h} px → 256 × 96',
      sameRef: 'dezelfde RefNet · zelfde blokken, uitgangen en 15 400 gewichten',
      pass2Box: 'kader ronde 2',
      toReader: '{w} × {h} px · naar de lezer',
      window: 'venster · {w} × {h} px · 6 gelijke stroken',
      cells: 'cellen · één per rol',
      readerCells: 'lezercellen · grijs, vol contrast, 32 × 64',
      drum: 'rol {n}',
      drumSize: 'rol {n} · 32 × 64',
      reader1Maps: 'maps en units zijn van lezer 1, cijfer en draai van deze lezer zelf',
      mapsLeft: 'blok 4 · nog {n} van 96 maps',
      rowByRow: 'rij voor rij',
      map1List: 'map 1 → lijstposities 1 tot 8',
      map: 'map {n}',
      oneList: 'één lijst · {n} getallen',
      numbers768: '768 getallen',
      weightPer: 'één gewicht per getal',
      sum768: 'som van de 768',
      offset: 'offset',
      unit: 'unit {n}',
      units96: '96 units',
      aboveZero: '{w} gewichten · {n} van de 96 boven nul voor deze rol',
      digitCols: ['score', 'e^score', '÷ som', 'softmax'],
      digit: 'cijfer {n}',
      firmwareChecks: 'de zekerheid die de firmware controleert',
      share: 'e^7.1 = 1 215 ÷ 1 260 · 3.6 hoger dan de volgende geeft 36 × zoveel',
      rollScore: 'draaiscore',
      roll: 'draai {v}',
      rollMeasured: 'de 7 staat 3.7 % van een stap voorbij zijn stand, richting de 8',
      rollPast: 'de {d} staat {p} % van een stap voorbij zijn stand',
      rollBefore: 'de {d} staat {p} % van een stap vóór zijn stand',
      leastSure: 'minst zeker, want lezer 3 las een 0 en werd overstemd',
      reader: 'lezer {n}',
      mean: 'gemiddeld',
      meanOfThree: 'draai {v} · gemiddelde van drie',
      inBand: 'binnen band',
      pastBand: 'buiten band',
      freeLast: 'vrij · laatste rol',
      free: 'vrij · rechterrol op 9 of 0',
      lock: 'vast · rechterrol op 1 tot 8',
      allowed: '{n} → {m} toegestaan',
      absolute: '{n}, absoluut',
      carryNote: '79 dat naar 80 draait kan als 89 lezen, dus de regel kiest het vorige getal',
      units: 'kubieke meter · zekerheid 71.5 %, de minst zekere van de 6 rollen',
      secondRoute: 'tweede route: opnieuw met WindowNet',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: 'Naar de simulator',
    intro: {
      eyebrow: 'Installatie en configuratie', title: 'Dezelfde meting, op de installatietool',
      before: <p>Die meting, 0092.07, en het beeld waar ze uit kwam, zijn wat ConfigKing laat zien als het een lezer om een Read vraagt. ConfigKing is de firmware die ik voor een M5Stack Cardputer schreef. Het vindt lezers in de buurt via BLE en ESP-NOW, zet nieuwe stap voor stap op en configureert de rest opnieuw.</p>,
      after: <p className="ws-note">DrumNet en de firmware worden op Prototype V2 geflasht, en meteen wordt ook het LoRa-apparaatadres ingesteld. Omdat de lezers bijna altijd slapen, druk je op de bootknop om er een wakker te maken, zodat hij gevonden kan worden. Het scherm hier is een werkende kopie van de schermen van de echte firmware, getekend vanuit de broncode op een foto van de Cardputer.</p>,
    },
    press: { connect: 'verbinden', save: 'opslaan', next: 'volgende', finish: 'klaar', continue: 'verder' },
    steps: {
      nearby: { eyebrow: 'Stap 1', title: 'Ontdekken', body: 'Zet je een lezer aan die nog niet is ingesteld, dan start hij vanzelf in configuratiemodus. ConfigKing ziet dat en vraagt of je hem wilt instellen.' },
      identify: { eyebrow: 'Stap 2', title: 'Naam en meetinterval', body: 'Stel de naam in die de lezer op het dashboard krijgt en daarna hoe vaak hij meet. Klap het (i)-icoon open voor meer details over de lezer.' },
      layout: { eyebrow: 'Stap 3', title: 'Indeling van de rollen', body: 'Stel de indeling van de rollen in zodat die past bij de meter waar de lezer op komt, met 1 tot 8 rollen voor hele getallen en 0 tot 4 voor decimalen.' },
      camera: { eyebrow: 'Stap 4', title: 'Camera instellen', body: 'Stel de helderheid, de gain en de PWM-duty-cycle van de leds in voor gelijkmatig licht. Je kunt in- en uitzoomen en schuiven om het beeld beter te bekijken, en het beeld wordt donkerder en lichter als je de instellingen verandert.' },
      roi: { eyebrow: 'Stap 5', title: 'ROI bijstellen', body: 'WindowNet maakt automatisch een ROI, en met de knoppen kun je die bijstellen, met zoomen en schuiven om hem beter te zien.' },
      read: { eyebrow: 'Stap 6', title: 'Testmeting', body: 'Er wordt een testmeting gedaan met de ROI van net, en die laat zijn zekerheid zien. Met (D) bekijk je die cijfer voor cijfer.' },
      radio: { eyebrow: 'Stap 7', title: 'LoRa-verbinding testen', body: 'Een verbindingstest checkt of de lezer de LoRaWAN-gateway kan bereiken, en in het (i)-menu staat meer informatie.' },
      review: { eyebrow: 'Stap 8', title: 'Nakijken en opslaan', body: 'Kijk de instellingen na die op de lezer worden opgeslagen. Zodra ze zijn opgeslagen, schakelt de lezer over naar de gewone gebruiksmodus en valt de BLE-verbinding weg.' },
      done: { eyebrow: 'Klaar met instellen', title: 'De lezer slaapt en begint te meten', body: 'Het eindbericht laat de slaaptimer van de lezer zien. Vanaf nu wordt de lezer op zijn eigen interval wakker, doet een meting, verstuurt die en gaat weer slapen.' },
      connected: { eyebrow: 'Een ingestelde lezer', title: 'Read, Configure, More', body: 'Een lezer die al is ingesteld krijgt Read, Configure en More in plaats van de wizard. Configure opent één onderdeel van de instellingen tegelijk, dat je zelf opslaat of weggooit, en onder More vind je de radiotest, info over de lezer, About en een fabrieksreset die eerst om bevestiging vraagt.' },
    },
    free: {
      eyebrow: 'Probeer het', title: 'Stel zelf een lezer in',
      body: <p>Dit zijn dezelfde schermen, toetsen en wizard als het echte ding, maar dan in gesprek met een gesimuleerde lezer. Je kunt op de toetsen van de Cardputer drukken, op het scherm tikken of op je eigen toetsenbord typen, en zo meteen duikt er een lezer in de buurt op.</p>,
    },
  },

  /* ── Hoofdstuk IV: MeterSim ── */
  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['Een gesimuleerde meter', 'Gemaakt voor agents', 'Ontwerpen en presets', 'Half gedraaide rollen', 'Weer en oppervlak', 'Testen zonder toezicht'],
      lede: 'MeterSim tekent een watermeter op een tablet, zodat een echte camera gelabelde metingen kan verzamelen terwijl niemand meekijkt.',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: 'Een gesimuleerde meter voor een echte camera',
        body: <p>De eerste versie van MeterSim is samen met de firmware voor Prototype V0.5 gebouwd, en die twee werken samen. Zo kan MeterSim Prototype V0.5 automatisch aansturen en gelabelde beelden maken om het model mee te trainen. Claude heeft alle software en firmware geschreven.</p>,
        alt: 'Prototype V0.5, een ESP32-EYE, gericht op een tablet met het scherm van MeterSim',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: 'Gemaakt voor agents',
        body: <p>MeterSim is gemaakt voor AI-agents en niet voor mensen, dus het bedieningspaneel is vooral een manier voor mensen om te zien hoe ver de agents zijn. De agents gebruikten MeterSim om tests te bouwen, data te verzamelen en de nauwkeurigheid te controleren terwijl ze DrumNet maakten. Het neemt het saaiste klusje van machine learning over, goede trainingsdata verzamelen, door die data zelf te maken. En omdat de meter gesimuleerd is, komt elk beeld al gelabeld binnen.</p>,
        alt: 'Het bedieningspaneel van MeterSim, met schuifjes voor de stand, de rollen, het oppervlak en weereffecten',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: 'Negen meterontwerpen en negen presets',
        body: (
          <>
            <p>MeterSim heeft 9 meterontwerpen, en elk kan een andere indeling van rollen krijgen, zoals 7 rollen voor hele getallen en 1 voor decimalen (7+1). De rollen voor hele getallen zijn meestal wit of zwart, die voor decimalen rood.</p>
            <p>Veelvoorkomende combinaties van omstandigheden zijn opgeslagen als presets: schoon, middag, glans op de cijfers, halve schaduw, zachte schaduw, schemer, in de schaduw, gekanteld en vuil.</p>
          </>
        ),
        alt: [
          'De negen meterontwerpen in MeterSim: Itron Weg 50, Elster messing, Itron Multimag Cyble, Bonega S/13 en T/13, Istameter II, een algemene industriële meter, B Meters blauw en een schone Elster messing',
          'Negen presets: schoon, middag, glans op de cijfers, halve schaduw, zachte schaduw, schemer, in de schaduw, gekanteld en vuil',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: 'Half gedraaide rollen',
        body: <p>Het simuleert ook half gedraaide rollen, zodat het model leert een rol te lezen die ergens tussen twee cijfers in staat. De agent stelt die automatisch in terwijl hij trainingsdata verzamelt.</p>,
        alt: 'De draaiknop van MeterSim, waarmee losse rollen half tussen twee cijfers worden gesleept',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: 'Weer en oppervlak',
        body: <p>MeterSim simuleert ook het weer en de staat van het oppervlak van de meter, zodat het lijkt op een meter die buiten weer en wind trotseert. Zo leert de lezer in al die omstandigheden te lezen. De knoppen regelen schittering, vegen, schaduw, belichting, onscherpte, sensorruis, mist, vuil en schaal.</p>,
        alt: 'De schuifjes voor oppervlak en weer in MeterSim, elk met een klein voorbeeldje',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: 'Testen en data verzamelen zonder toezicht',
        body: (
          <>
            <p>MeterSim is een selfhosted webapp met twee endpoints, het bedieningspaneel op /control en het scherm op /display. De lezer zit op hetzelfde lokale wifinetwerk als MeterSim, en gebruikt dat om zijn metingen en beelden te sturen en commando&rsquo;s te ontvangen.</p>
            <p>Om een model te testen, maakt MeterSim een willekeurige meter met willekeurige omstandigheden en laat die aan de lezer zien. Die maakt een foto en leest hem met het getrainde netwerk. Het resultaat gaat terug naar MeterSim, dat de gesimuleerde waarde kent en met de voorspelling vergelijkt. Laat een agent dat heel vaak doen terwijl niemand kijkt, dan krijg je een goede schatting van de nauwkeurigheid van het model. Gelabelde data verzamelen werkt net zo, alleen worden de beelden van de lezer dan met hun labels in JSON op schijf bewaard, klaar om op te trainen.</p>
          </>
        ),
        alt: [
          'Een tablet met het scherm van MeterSim naast een laptop met het bedieningspaneel, en de ESP32-EYE-lezer gericht op de tablet',
          'De ESP32-EYE-lezer op een fles, gericht op het scherm van MeterSim, in een klaslokaal',
        ],
      },
    },
  },

  /* ── Hoofdstuk V: SimGen2 ── */
  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['Zes stappen', 'Echt over synthetisch', 'Vergelijk ze zelf'],
      lede: 'SimGen2 maakt synthetische opnames die eruitzien alsof de camera van de lezer ze zelf nam, in zo’n 2 s per stuk, bijna 5× sneller dan een echte opname.',
    },
    page: 'SimGen2',
    stages: [
      ['Screenshot', 'het scherm van MeterSim, 1920 × 1080'], ['Vervormd', 'stand en lens, naar 1600 × 1200'], ['Onscherpte', '1,2 tot 2,2 px'], ['Gain, tooncurve, vignet', 'hoe de sensor reageert'], ['Sensorruis', 'korrel waar de echte camera die heeft'], ['OV2640-JPEG', 'kwaliteit 6, zoals de lezer comprimeert'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: 'De camera zelf simuleren',
        body: (
          <>
            <p>Zelfs met al die automatisering bleef er één grote bottleneck over. Een beeld maken op de lezer en naar MeterSim sturen duurt bijna 10 s, en over duizenden beelden loopt dat op tot vele uren. Dus het volgende doel was de camera van de lezer zelf te simuleren, en dat systeem is SimGen2. Het schaalt het beeld en legt er filters en vervormingen overheen, zodat het eruitziet alsof het met de camera van de lezer is gemaakt.</p>
            <p>SimGen2 is helemaal ontwikkeld door ChatGPT Astra 6 van OpenAI, dat zo&rsquo;n 4000 echte beelden van de lezer gebruikte om de filters te maken.</p>
          </>
        ),
        alt: 'De zes stappen van SimGen2, van screenshot naar vervormd, onscherp, met tooncurve, met ruis en als JPEG gecomprimeerd, met een strook van het telwerk bij elke stap',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: 'Echt over synthetisch',
        body: <p>SimGen2 maakt een beeld in zo&rsquo;n 2 s, bijna 5× sneller dan een opname met de echte lezer. Naast de lezer maakte het tienduizenden unieke gelabelde beelden om het model DrumNet Simulated te trainen. Hier ligt een echte opname in magenta over de SimGen2-versie in groen, dus overal waar die twee overeenkomen, is het beeld kleurloos. De schittering van de leds in de echte opname is het grootste verschil dat nog over is.</p>,
        alt: 'Een echte opname in magenta over de synthetische SimGen2-versie in groen; waar ze overeenkomen, is het beeld kleurloos',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: 'Vergelijk ze zelf',
        body: <p>Dit zijn eenentwintig echte opnames en hun SimGen2-versies van zes meterontwerpen, uitgeknipt uit de bladen van het verslag. Sleep de scheidingslijn om ze te vergelijken, met de echte opname links en SimGen2 rechts. De strook van het telwerk is het grootst, want dat is het deel dat DrumNet leest.</p>,
      },
    },
    compare: {
      realStrip: 'Echte opname van het telwerk van de {meter}',
      simStrip: 'Hetzelfde telwerk zoals SimGen2 het maakte',
      realMeter: 'Echte opname van de {meter}-meter',
      simMeter: 'Dezelfde meter zoals SimGen2 hem maakte',
      real: 'echt',
      sim: 'SimGen2',
      divider: 'Scheidingslijn tussen de echte opname links en SimGen2 rechts',
      pairs: 'Paren',
    },
  },

  /* ── Hoofdstuk VI: de agents ── */
  agents: {
    cover: {
      title: 'Agentische workflow', lines: ['Agentische', 'workflow'],
      contents: ['De lus', 'Zes agents', 'Middelen en de planner', 'Beheerd met T3 Code'],
      lede: 'Zes agents trainden en testten de lezers tegelijk, en deelden één planner voor de rekenkracht en de testopstelling.',
    },
    page: 'Agentische workflow',
    rows: {
      'ag-loop': {
        eyebrow: 'Agentische workflow', title: 'De lus die zichzelf verbetert',
        body: <p>Ik heb in dit project veel AI-agents op basis van LLM&rsquo;s gebruikt. Hun taak was de hele vision-pipeline op de ESP32-S3 te verbeteren, richting een doel van 99 % nauwkeurigheid per meter. Elke agent werkte in een lus: een hypothese bedenken, plannen hoe die uit te voeren, trainingsdata verzamelen, het model hertrainen, finetunen of met RL trainen, testen op verbetering of regressie, en dan de bevindingen melden en opnieuw beginnen.</p>,
      },
      'ag-six': {
        eyebrow: 'Agentische workflow', title: 'Zes agents, drie op DrumNet',
        body: (
          <>
            <p>Drie agents draaiden deze lus, elk op een eigen variant van DrumNet, terwijl drie andere agents andere klussen deden. Na zo&rsquo;n 1,5 week presteerden Standard en Premade nog steeds slecht, dus die zijn stopgezet en al hun middelen gingen naar DrumNet Simulated.</p>
            <p>Daarna mocht DrumNet Simulated op elke dataset trainen, ook die van de testopstelling en de externe catalogus, en het werd omgedoopt tot DrumNet. De huidige versie, V10, is het beste netwerk uit de DrumNet-reeks.</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: 'Agentische workflow', title: 'Gedeelde middelen en een planner',
        body: (
          <>
            <p>Met zes agents tegelijk zaten ze elkaar steeds in de weg, dus ik heb een planner gemaakt waarmee ze tijdslots op de gedeelde middelen kunnen boeken. Het ene is de rekenkracht voor het trainen, de CPU van mijn server en de GPU van mijn laptop. Het andere is de Jetson-rig, waar een agent Prototype V1 kan flashen en ermee kan werken, terwijl hij via MeterSim het scherm aanstuurt waar het prototype op gericht is.</p>
            <p className="ws-note">Op de tijdlijn van de planner voor rekenkracht toont het gevulde vlak de geboekte threads tegenover het budget van 20 threads, en de rode lijn het geboekte geheugen tegenover het budget van 9 GB. De GPU van de laptop doet één taak tegelijk.</p>
          </>
        ),
        alt: [
          'Een schets van de drie DrumNet-agents die de Jetson-rig en de rekenkracht delen via twee planners, met de coördinator, Sim2 Genius en het model dat het venster vindt ernaast',
          'De tijdlijn van de planner voor de rekenkracht, met geboekte blokken per agent en de geboekte belasting tegenover het budget',
        ],
      },
      'ag-t3': {
        eyebrow: 'Agentische workflow', title: 'Beheerd met T3 Code',
        body: (
          <>
            <p>De agents draaiden 24/7 op een &ldquo;heartbeat&rdquo;, een simpel script dat een agent na een vaste tijd of op een vast moment wakker maakt, zodat hij verder werkt. Ze kregen de opdracht zelfstandig te werken en hun eigen beslissingen te nemen, dus er was heel weinig menselijke inbreng nodig.</p>
            <p>Het netwerk liep via Tailscale, een persoonlijke peer-to-peer-VPN, waardoor de agents op mijn server thuis de Jetson-rig op school via SSH konden bereiken en bedienen. De agents zelf werden beheerd in T3 Code, een opensource meta-harness voor Claude Code en Codex.</p>
          </>
        ),
        alt: 'Diagram van T3 Code dat het apparaat van de gebruiker, de thuisserver met de agents, de GPU van de laptop en de Jetson-rig op school via Tailscale verbindt',
      },
    },
    loop: {
      steps: ['Hypothese', 'Uitvoering plannen', 'Trainingsdata verzamelen', 'Model hertrainen, finetunen of RL', 'Testen op verbetering of regressie', 'Bevindingen melden, dan een nieuwe hypothese'],
      lines: [['Hypothese'], ['Uitvoering', 'plannen'], ['Trainingsdata', 'verzamelen'], ['Model hertrainen,', 'finetunen of RL'], ['Testen op verbetering', 'of regressie'], ['Bevindingen melden,', 'dan nieuwe hypothese']],
      aria: 'De lus van de agents: {steps}, en weer opnieuw.',
      target: 'DOEL',
      accuracy: 'nauwkeurigheid',
    },
    badges: {
      model: 'Model', job: 'Taak', data: 'Traint op', won: 'werd DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: 'De purist', model: 'Fable 5.1, daarna Opus 5.5', job: 'Leest rollen', data: 'Alleen beelden van Prototype V1, vanaf het basismodel DrumNet V1', fate: 'Na 1,5 week stopgezet' },
        simulated: { name: 'DrumNet Simulated', persona: 'De dromer', model: 'Fable 5.1, daarna Opus 5.5', job: 'Leest rollen', data: 'Alleen SimGen2-beelden, volledig door de computer gemaakt, vanaf het basismodel DrumNet V1', fate: 'Omgedoopt tot DrumNet en nu op V10' },
        premade: { name: 'DrumNet Premade', persona: 'De verzamelaar', model: 'Fable 5.1, daarna Opus 5.5', job: 'Leest rollen', data: 'Elke dataset: Prototype V1, SimGen2, Badger55, Jomjol-digits, vanaf het model dig-cont', fate: 'Na 1,5 week stopgezet' },
        windownet: { name: 'WindowNet', persona: 'De spotter', model: 'Opus 5.5', job: 'Vindt het venster', data: 'Traint de Spotter (DetNet) en Refiner (RefNet) die het venster met de rollen vinden', fate: 'Nog steeds de zwakke schakel, waar de meeste foute metingen beginnen' },
        sim2: { name: 'Sim 2 Genius', persona: 'De toneelknecht', model: 'Opus 5.5', job: 'Bedient de simulator', data: 'Bedient, onderhoudt en verbetert SimGen2 voor de anderen', fate: 'Zorgt dat de synthetische beelden blijven komen' },
        coordinator: { name: 'OCR Coordinator', persona: 'De voorman', model: 'Fable 5.1', job: 'Leidt het project', data: 'Praat met alle andere agents, boekt hun tijd en bewaakt het plan', fate: 'Gaf alles aan Simulated toen de anderen vastliepen' },
      },
    },
  },

  /* ── Hoofdstuk VII: firmware (ReadCycle.tsx) ── */
  firmware: {
    cover: {
      title: 'Firmware', lines: ['De', 'firmware'],
      contents: ['Geschreven door een agent', 'Eén wekcyclus', 'Het dashboard'],
      lede: 'In één wekcyclus wordt de lezer wakker, maakt hij een foto van de meter, leest hij de rollen, stuurt hij het getal naar huis en gaat hij weer slapen.',
    },
    page: 'Firmware',
    chartAria: 'Verloop van de firmware van de lezer in één wekcyclus',
    success: 'gelukt',
    fail: 'mislukt',
    nextCycle: 'VOLGENDE CYCLUS',
    nodes: {
      wake: { title: 'Wakker via RTC', sub: 'staat herstellen, randapparatuur starten', time: '~0,2 s' },
      capture: { title: 'Foto maken', sub: 'foto gemaakt met de ledlampjes', time: '~0,5 s' },
      low: { title: 'Zuinige meting', sub: 'alleen de DrumNet-lezers, opgeslagen ROI, geen WindowNet', time: '~0,5 tot 3 s' },
      uplink: { title: 'LoRaWAN-uplink', sub: 'meting naar de gateway gestuurd', time: '~0,3 s' },
      sleep: { title: 'Slapen', sub: 'alle randapparatuur gaat uit' },
      full: { title: 'Volledige DrumNet-pipeline', sub: 'opnieuw met WindowNet als back-up' },
      check: { title: 'Zekerheid checken', sub: 'is de nieuwe meting zeker genoeg?' },
      alt: { title: 'Andere spotter proberen', sub: 'een andere set back-upgewichten' },
      reject: { title: 'Meting afkeuren', sub: 'in NVS bewaard voor analyse, waarschuwing op het dashboard' },
    },
    steps: {
      wake: 'De lezer wordt wakker en haalt zijn configuratie en LoRaWAN-sessie terug uit het niet-vluchtige geheugen (NVS).',
      capture: 'De camera start op en er wordt een foto gemaakt met de ledlampjes aan.',
      low: 'Het beeld gaat meteen door de DrumNet-lezers met de ROI die bij de installatie is opgeslagen, zonder WindowNet. Dit is de normale en goedkoopste route, en een zekere meting gaat na zo’n 1,5 s wakker zijn in totaal door naar de uplink.',
      full: 'Alleen als de lezers een lage zekerheid melden, draait de volledige pipeline als back-up, waarbij WindowNet het venster opnieuw zoekt.',
      check: 'De zekerheid van de nieuwe meting wordt gecheckt, en hier verlaten de meeste metingen de lus.',
      alt: 'De spotter draait nog één keer met een andere set back-upgewichten, als laatste poging in deze cyclus.',
      reject: 'Een mislukte poging wordt in NVS bewaard om later te bekijken, en op het dashboard verschijnt een waarschuwing over de lage zekerheid.',
      uplink: 'De LoRa-verbinding gaat aan en de meting wordt naar de gateway gestuurd.',
      sleep: 'Alle randapparatuur gaat uit en de lezer gaat in diepe slaap tot de RTC hem wekt voor de volgende cyclus, al maakt een druk op BOOT hem wakker om te configureren.',
    },
    rows: {
      'fw-agents': {
        eyebrow: 'Firmware', title: 'Geschreven door een agent, op echte hardware',
        body: (
          <>
            <p>Een Astra 6-agent kreeg de taak de firmware te schrijven voor de lezer (Prototype V2) en voor de M5Stack Cardputer Adv. Daarop draait ConfigKing, de configuratieconsole waarmee technici ter plaatse lezers kunnen instellen voor gebruik en later opnieuw kunnen configureren. De agent mocht alleen code schrijven met Fable 5.1.</p>
            <p className="ws-note">Mijn laptop, de LoRaWAN-gateway (vriendelijk beschikbaar gesteld door Mr Lee Chang Fatt) en de Jetson Nano zaten op hetzelfde netwerk, de Cardputer en Prototype V2 hingen via USB-serieel aan de laptop, en alle vier de apparaten waren bereikbaar voor de agents.</p>
          </>
        ),
        alt: 'De opstelling voor de firmware: de laptop, de Jetson Nano, de LoRaWAN-gateway, de Prototype V2-lezer en de Cardputer, die de agents via het netwerk bereiken',
      },
      'fw-cycle': { eyebrow: 'Eén wekcyclus', title: 'Negen stappen, al hebben de meeste metingen er vijf nodig' },
      'fw-dashboard': {
        eyebrow: 'Dashboard', title: 'Waar de meting te zien is',
        body: <p>Na de meting gaat die naar de LoRaWAN-gateway, die hem via MQTT doorstuurt naar de Jetson Nano, waar hij wordt opgeslagen. De Jetson serveert het dashboard als één HTML-bestand waarvan de JavaScript de waarden bijwerkt uit de opgeslagen data. Het dashboard is alleen een demo en is niet gemaakt om op te schalen naar echte installaties.</p>,
        alt: 'Het dashboard van de lezers: een kaart van de testlezer met 0092.07 kubieke meter en een label voor lage zekerheid, plus grafieken van de geschiedenis en een tabel met negen metingen',
      },
    },
  },

  /* ── Hoofdstuk VIII: stroom ── */
  power: {
    cover: {
      title: 'Stroombesparing', lines: ['Stroom', 'besparen'],
      contents: ['Subsampling', 'Opnamemodi naast elkaar', 'PWM-dimmen', 'Grijstinten', 'INT8 en vectorrekenen', 'Hardware'],
      lede: 'Elke stap van de wekcyclus is bijgeschaafd richting een batterij die 2 jaar meegaat, met kleinere opnames, zachter licht en rekenen met gehele getallen.',
    },
    page: 'Stroombesparing',
    modes: [
      { time: 'opname van 350 ms', note: 'elke pixel van de sensor' },
      { time: 'opname van 89 ms', note: 'SVGA, de gekozen modus' },
      { time: 'opname van 61 ms', note: 'CIF, te weinig pixels per rol' },
    ],
    modeAlt: 'Opname van de meter op {res}',
    drumsAria: 'de rollen op {res}',
    int8: [
      { value: '61 s', label: 'Float32', note: 'van opname tot voorspelling, vóór kwantisatie' },
      { value: '17 s', label: 'INT8 + ESP-NN', note: 'ongeveer 3,6× sneller' },
    ],
    hardware: [
      { name: 'TPS63900 buck-boost', note: '~75 nA ruststroom, houdt 3,3 V vast bij elke ingangsspanning, geschikt voor Li-SOCl2' },
      { name: 'Low-Iq LDO’s', note: '1,5 V en 2,8 V voor de camera, zonder schakelruis' },
      { name: 'Ambiq AM1805-timer', note: 'zet alles volgens schema uit en weer aan' },
      { name: 'LoRaWAN', note: 'zuinig, groot bereik, een open standaard die de beheerder zelf kan draaien' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: 'Stroombesparing · software', title: 'Subsampling in de camera',
        body: (
          <>
            <p>De lezer moet tot 2 jaar meegaan op één set batterijen. De ESP32-S3 is best efficiënt bij zwaar werk zoals het vectorrekenen dat een neuraal netwerk nodig heeft, maar lang niet zo efficiënt als de nRF-chips van Nordic, dus ik heb de trucjes uit dit hoofdstuk gebruikt om zijn energieverbruik omlaag te krijgen. De draadloze radio&rsquo;s zijn alleen nodig voor de eerste configuratie, dus tijdens gebruik staan ze uit.</p>
            <p>De OV2640 maakt opnames tot 1600 × 1200, en heeft ook subsamplingmodi op 800 × 600 (SVGA) en 400 × 296 (CIF).</p>
          </>
        ),
        alt: ['Diagram van de SVGA-subsamplingmodus van de OV2640, met welke pixels worden overgeslagen', 'Diagram van de CIF-subsamplingmodus van de OV2640'],
      },
      'pw-modes': {
        eyebrow: 'Opnamemodi naast elkaar', title: 'SVGA, de gekozen modus van 89 ms',
        body: (
          <>
            <p>Dit is dezelfde meter op de drie resoluties, met het volle beeld bovenaan en de rollen eronder op dezelfde vergroting. Op 1600 × 1200 wordt elke pixel van de sensor uitgelezen en duurt de opname 350 ms. Dat telt, want hoe korter de camera aan staat, hoe minder energie hij verbruikt. Op 400 × 296 duurt de opname maar 61 ms, maar dan houden de rollen te weinig pixels over om ze betrouwbaar te lezen.</p>
            <p>In mijn tests gaf SVGA de beste balans tussen kwaliteit en snelheid, en op 800 × 600 verwerkt het netwerk 4× minder informatie dan op 1600 × 1200. Ik heb geen echte tests gedaan om de nauwkeurigheid hard te maken, al merkte ik er zelf weinig van dat die achteruitging.</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: 'Stroombesparing · software', title: 'PWM-dimmen van de leds',
        body: <p>Eerst wilde ik geen PWM-dimmen, omdat de OV2640 een rolling shutter heeft. Die zou tijdens de uit-fases van het PWM-signaal kunnen opnemen en strepen laten zien. In de praktijk liet de OV2640 helemaal geen strepen zien, dus ik laat de leds draaien op 20 kHz met een duty cycle van 50 %. Dat bespaart wat stroom en geeft me ook controle over de helderheid.</p>,
        alt: ['Een opname met horizontale strepen over de wijzerplaat van de meter', 'Een opname met PWM-gedimde leds en zonder strepen'],
      },
      'pw-grey': {
        eyebrow: 'Stroombesparing · software', title: 'Grijstinten in de camera',
        body: <p>De OV2640 zet het beeld op de camera zelf om naar grijstinten en geeft een iets kleiner bestand terug. De besparing is klein of zelfs nul, maar het was makkelijk in te bouwen.</p>,
        alt: ['De meter in grijstinten vastgelegd door de camera', 'Dezelfde meter in kleur vastgelegd'],
      },
      'pw-int8': {
        eyebrow: 'Stroombesparing · software', title: 'Vectorinstructies en INT8',
        body: <p>Eerdere versies van DrumNet draaiden in volle precisie, Float32, op de ESP32-S3, en dat was traag en inefficiënt. De ESP32-S3 heeft ingebouwde vectorinstructies, die je via de ESP-NN-library gebruikt, en die doen meerdere Multiply and Accumulate-bewerkingen (MAC) per klokcyclus. Toen DrumNet eenmaal naar 8 bits was gekwantiseerd, ging de tijd van opname tot voorspelling van 61 s naar 17 s, ongeveer 3,6× sneller. Hoeveel efficiënter het werd, heb ik niet goed gemeten, al weet ik zeker dat het ook flink beter werd.</p>,
      },
      'pw-hw': {
        eyebrow: 'Stroombesparing · hardware', title: 'Low-Iq-converters, een timer en LoRaWAN',
        body: (
          <ul>
            <li><b>Efficiënte DC-DC-converters met lage Iq.</b> De OV2640 heeft 1,5 V en 2,8 V nodig. Buck-converters zijn efficiënter dan LDO&rsquo;s, maar door hun hoge ruststroom en ingewikkeldere ontwerp kosten ze geld en ruimte op het board voor bijna geen winst, en ze kunnen ruis in het beeld veroorzaken. Dus ik bleef bij LDO&rsquo;s met een lage ruststroom. De hoofdvoeding van 3,3 V zou naar een speciale buck-boost-converter met lage Iq (~75 nA) gaan, de TI TPS63900.</li>
            <li><b>Timer-IC&rsquo;s die bijna niets verbruiken.</b> Een timer-IC zoals de Ambiq AM1805 kan alle onderdelen uitzetten en volgens schema weer aanzetten, al zou de winst waarschijnlijk klein zijn.</li>
            <li><b>LoRaWAN.</b> Ik koos LoRaWAN omdat het zuinig is en een groot bereik heeft, en omdat het een open standaard is. Anders dan bij Sigfox en NB-IoT kan de beheerder zo het hele netwerk zelf bezitten en draaien.</li>
          </ul>
        ),
      },
    },
  },

  /* ── Hoofdstuk IX: camera (FocusLab.tsx) ── */
  camera: {
    cover: {
      title: 'Camerakeuze', lines: ['Camera', 'keuze'],
      contents: ['Twee OV2640-lenzen', 'De focustest'],
      lede: 'Ik testte twee OV2640-lenzen met testkaarten op 3, 4 en 6 cm.',
    },
    page: 'Camerakeuze',
    lab: {
      lenses: { '160': '160°-lens', '120': '120°-lens' },
      charts: { b: 'Kaart B (ISO 12233)', a: 'Kaart A (handgetekend)' },
      cm: '{d} cm',
      lens: 'Lens',
      distance: 'Afstand',
      chart: 'Kaart',
      alt: '{lens}°-lens, kaart {chart} op {dist} cm, volledig beeld',
      caption: 'volledig beeld · {lens}° · {dist} cm',
      chosen: ' · de gekozen opstelling',
      parts: { centre: 'midden', left: 'links', right: 'rechts' },
      cropAria: 'uitsnede {part}',
      notInFrame: 'Niet in beeld',
      notes: {
        '160': 'De 160°-variant stelt goed scherp op dingen dichtbij, maar de scherpte lijkt vanaf het midden naar de linkerkant van het beeld af te nemen, en naar rechts is dat lang niet zo sterk.',
        '120': 'De 120°-variant kan duidelijk niet goed scherpstellen op dingen dichtbij (macro), en de scherpte neemt gelijkmatig af in een kegel, zoals je verwacht van een lens met vaste focus.',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: 'Camerakeuze', title: 'Een macrocamera, breed genoeg voor de rollen',
        body: (
          <>
            <p>Ik had een goede macrocamera nodig die breed genoeg was om de hele breedte van de rollen van heel dichtbij vast te leggen. Geen betrouwbare winkel had iets wat zowel goedkoop was als de juiste connector had, dus ik kocht twee OV2640-camera&rsquo;s op Lazada, een met een lens van 160° beeldhoek en een met een lens van 120°. Ze werden niet als macrocamera verkocht, maar groothoeklenzen hebben van nature een heel korte scherpstelafstand en een veel grotere schijnbare scherptediepte.</p>
            <p>Voor de test maakte ik met beide camera&rsquo;s een foto op 3 cm, 4 cm en 6 cm van twee testkaarten. Kaart A heb ik zelf met de hand getekend, en kaart B is de ISO 12233-kaart van Stephen H. Westin van Cornell. Elke camera draaide op een reserve-ESP32-S3-camboard met een simpele webapplet die ik met een AI-agent schreef, en zat aan de zijkant van een doos met een liniaal die vanaf de lens naar buiten liep, terwijl de kaarten op een verschuifbaar standaardje stonden.</p>
          </>
        ),
        alt: 'De doos voor de focustest met het ESP32-camboard aan de zijkant en een liniaal op de bodem',
      },
      'cam-lab': {
        eyebrow: 'De focustest', title: 'De gekozen opstelling, 160° op 4 cm',
        body: (
          <>
            <p>Kies een lens, een afstand en een kaart om de hele opname te zien, met het midden, links en rechts uit hetzelfde beeld gesneden op ware pixelgrootte. Dit zijn lenzen met vaste focus, dus de scherpte is in de fabriek voorgoed ingesteld. Vanaf hier gebruik ik de 160°-variant op 4 cm.</p>
            <p className="ws-note">De kaart stond recht voor de camera zonder grote hoeken of deuken, en de 120°-variant neemt gelijkmatig af. Dus de scheve scherpte van de 160°-variant wijst op een fabricagefout, al heb ik geen reservecamera&rsquo;s om te testen of dat klopt.</p>
          </>
        ),
      },
    },
  },

  /* ── Hoofdstuk X: Prototype V2 en de behuizing ── */
  proto: {
    cover: {
      title: 'Prototype V2', lines: ['Prototype', 'V2'],
      contents: ['Een gekrompen Prototype V1', 'Zo groot als een devboard', 'De behuizing en adapter'],
      lede: 'Prototype V2 is Prototype V1, gekrompen tot de grootte van een devboard, in een behuizing van twee delen die geen gereedschap nodig heeft.',
    },
    page: 'Prototype V2',
    enclosurePage: 'Behuizing',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototype V2', title: 'Een gekrompen Prototype V1',
        body: <p>Prototype V2 is een kleinere versie van Prototype V1. Hij past in krappere ruimtes en liet me kleinere onderdelen proberen, zoals de Wio-SX1262 LoRa-module van Seeed Studio. Hij heeft ingebouwd batterijbeheer, voeding voor de camera en de ventilator, ledlampjes die je met PWM kunt dimmen en een LoRa-module. Ik heb het vierlaagse board in KiCad ontworpen, de onderdelen bij DigiKey gehaald en het door JLCPCB laten maken, en de schakelingen staan in het verslag.</p>,
        alt: '3D-render van de bovenkant van het Prototype V2-board uit KiCad',
      },
      'v2-size': {
        eyebrow: 'Prototype V2', title: 'Zo groot als een devboard',
        body: (
          <>
            <p>Ik heb de PCB ongeveer zo groot gemaakt als een gewoon ESP32-S3-devboard, zodat hij in een kleinere behuizing past die goed werkt voor meters in krappe ruimtes.</p>
            <p className="ws-note">Prototype V2 is gemaakt voordat ik het verslag schreef, dus er zitten nog een paar keuzes in waar ik inmiddels van ben afgestapt. De ventilator was bedoeld voor hoge luchtvochtigheid, die beslaan kan veroorzaken, maar als de metingen er niet betrouwbaar door worden, gaat hij er weer uit. En de voeding is ontworpen voordat ik besloot Li-SOCl2-cellen te gebruiken.</p>
          </>
        ),
        alt: 'De Prototype V2-PCB naast een ESP32-S3-ontwikkelboard dat bijna even groot is',
      },
      'en-all': {
        eyebrow: 'Behuizing', title: 'Een behuizing zonder gereedschap en een adapter in twee delen',
        body: (
          <>
            <p>De binnenbehuizing bevat de PCB en de batterijen van Prototype V2. Ik heb het 3D-bestand uit KiCad naar Onshape geëxporteerd als referentie, de camera voor de nauwkeurigheid met de hand gemodelleerd, en de behuizing zo ontworpen dat je geen gereedschap nodig hebt. Klemmen aan de zijkant klikken de twee helften op elkaar, groeven en pennen houden ze op hun plek, platformpjes en paaltjes houden de PCB vast zonder schroeven, en een uitsparing laat de IPEX-kabel van de LoRa-module bij de transceiver komen. De uiteindelijke print paste goed en zag er netjes uit, maar ik moest wel een gat voor de camera maken, die omgekeerd was gemonteerd door een verkeerde pinindeling bij het assembleren.</p>
            <p>De buitenadapter bestaat uit twee delen. De onderste helft zit tegen de meter en houdt de cameralens zo&rsquo;n 4 cm van de wijzerplaat, de scherpstelafstand die ik in de cameratest koos. De veel bredere bovenste helft geeft ruimte om de lezer goed op de rollen uit te lijnen, en betekent dat ik hem op andere meters kan hergebruiken door alleen de onderste helft opnieuw te ontwerpen. Ik was de lipjes vergeten die het deksel van de meter vastzetten, dus ik heb er met een paar knippen van een zijkniptang ruimte voor gemaakt.</p>
          </>
        ),
        figures: [
          { alt: 'Het KiCad 3D-model van het board met de camera erop gemodelleerd, gebruikt als referentie in Onshape', caption: 'de KiCad-export die als referentie in Onshape diende' },
          { alt: 'De uiteindelijke geprinte binnenbehuizing met het board erin', caption: 'de geprinte binnenbehuizing' },
          { alt: 'Een CAD-doorsnede van de adapter met de camera zo’n 4 cm van de wijzerplaat', caption: 'een doorsnede van de adapter, 4 cm van de wijzerplaat' },
          { alt: 'De afgemaakte adapter op de meter gemonteerd', caption: 'de adapter op de meter' },
        ],
      },
    },
  },

  /* ── Hoofdstuk XI: conclusie ── */
  conclusion: {
    cover: {
      title: 'Conclusie', lines: ['Conclusie'],
      contents: ['Waar het project staat', 'Het verslag'],
      lede: 'De lezer leest 56 % van de metingen goed tegenover een doel van 99 %, en dit hoofdstuk gaat over wat er nodig is om dat gat te dichten.',
    },
    page: 'Conclusie',
    row: {
      eyebrow: 'Conclusie', title: 'Waar het project staat',
      body: (
        <>
          <p>Door tijdgebrek stopt het project hier, en er moeten nog veel problemen worden opgelost voordat het een bruikbare oplossing kan zijn. Ik heb het energieverbruik niet gemeten en het niet getest op de beoogde 2 jaar, en ik denk niet dat Prototype V2 dat in zijn huidige vorm haalt. Er is dus eerst een derde revisie met zuinigere onderdelen nodig voordat het zin heeft het verbruik te volgen. De firmware zit daarentegen al dicht bij de efficiëntie die ik voor ogen had.</p>
          <p>DrumNet V10 leest 56 % van de metingen goed, ver onder het doel van 99 %. De grootste bottleneck is WindowNet, want de meeste foute metingen kwamen doordat het de juiste ROI niet vond. De lezers lijken ook te weinig getraind, en een meter die ze nog niet hebben gezien geeft een lage zekerheid, omdat de dataset vooral bestond uit de 9 meters die SimGen2 kon maken. Een grotere en gevarieerdere dataset zou bij allebei kunnen helpen. De behuizing is veel te groot voor echt gebruik, vooral door de hoogte van de camera, dus ik heb een lagere camera nodig die beter is in macrobeelden, en voor weerbestendigheid zijn andere materialen en ontwerpen nodig.</p>
          <p className="ws-note">Veel in dit project deed ik voor het eerst, en al ben ik niet echt tevreden met de uitkomst, ik ben trots op de kennis en ervaring die ik heb opgedaan, en dankbaar voor de zeldzame kans, met tijd, middelen en steun, om te leren en te experimenteren zoals ik dat doe. Dank aan Mr Alex Oh (NYP) voor zijn begeleiding, kennis en aanmoediging, aan Mr Soh (NYP), zonder wie ik de camera nooit aan de praat had gekregen, en aan Mr Lee Chang Fatt (NYP) voor de LoRaWAN-gateway.</p>
        </>
      ),
    },
    figures: [
      { value: '56 %', label: 'hele pipeline', note: '808 van de 1.440 metingen goed' },
      { value: '99 %', label: 'het doel', note: 'de hele meting goed' },
      { value: '93,2 %', label: 'alleen DrumNet', note: 'samengevoegde testset, zonder WindowNet' },
      { value: '2 jr', label: 'beoogde levensduur', note: 'nog niet gemeten, eerst is een V3-board nodig' },
    ],
  },

  /* ── Hoofdstuk XII: het verslag ── */
  report: {
    title: 'Het verslag',
    frameTitle: 'Verslag OCR Water Meter Reader (pdf)',
    name: 'OCR Water Meter Reader',
    about: 'Goedkope en zuinige OCR-oplossing met camera voor het aflezen van watermeters. Braven Chiam, NYP Electronic and Computer Engineering. 58 pagina’s, pdf, 6,8 MB.',
    open: 'Open het verslag',
    note: 'Ik heb bij dit project veel AI-tools gebruikt. Het grootste deel van het verslag heb ik zelf in mijn eigen woorden geschreven, behalve de inleiding en een paar grafieken. Verder gebruikte ik AI voor onderzoek, het maken van grafieken en het controleren van data. Dit project scoort niveau 3 op mijn schaal van AI-gebruik.',
  },
};

export default nl;
