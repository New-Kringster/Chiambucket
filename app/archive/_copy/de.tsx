import type { ArchiveCopy } from './en';

/* The /archive page's words in German, in the shape of en.tsx. */
const de: ArchiveCopy = {
  meta: {
    title: 'Zwei Jahre chiambucket.com | Braven Chiam',
    description:
      'Jedes Design, das chiambucket.com seit September 2024 hatte, von einer WordPress-Seite bis zur gemalten Scroll-Geschichte, mit Screenshots und einer funktionierenden Kopie jeder alten Version.',
    ogTitle: 'Zwei Jahre chiambucket.com',
    ogDescription: 'Acht Designs seit September 2024 und eine funktionierende Kopie von jedem alten.',
  },
  ldName: 'Zwei Jahre chiambucket.com',
  ldItem: 'v{n}: {name} ({when})',

  title: 'Zwei Jahre chiambucket.com',
  lede:
    'Angefangen hat alles als WordPress-Seite, auf der ich Links zu ein paar meiner selbst gehosteten Dienste geteilt habe, aber inzwischen ist daraus mein persönlicher Blog und mein Portfolio geworden. Drei Umzüge und acht Redesigns später ist das hier das größte Redesign meiner Website bisher. Mit Hilfe von Claude habe ich jede große Überarbeitung auf dieser Seite archiviert, und du kannst jede davon besuchen, um zu sehen, wie chiambucket.com früher aussah.',
  stripLabel: 'Die acht Versionen, jede so breit, wie lange sie online war',
  segLabel: 'v{n}, {name}, {when}',
  today: 'Heute',

  srName: 'v{n}: ',
  builtWith: 'Gebaut mit {built}',
  backHome: 'Zurück zur Startseite',
  open: 'v{n} öffnen',

  fact: {
    kicker: 'Fun Fact',
    title: 'Warum chiambucket.com?',
    text:
      'Chiambucket war ursprünglich ein Spitzname, den mir ein guter Freund gegeben hat. Als ich einen Domainnamen für meine neue Landingpage gesucht habe, war chiambucket.com zufällig die günstigste verfügbare Domain, also habe ich sie genommen und seitdem behalten.',
    extra: <><b>Noch ein Fun Fact:</b> Mir gehört auch <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, und die leitet auf diese Seite weiter!</>,
  },

  versions: {
    1: {
      name: 'Die erste WordPress-Seite',
      when: 'September bis Oktober 2024',
      built: 'WordPress und Elementor',
      body: 'Mein erstes chiambucket.com war eine WordPress-Seite, die ich mit Elementor zusammengebaut habe und die auf meinem Server zu Hause lief. Sie drehte sich um ihren Quick-Links-Button, denn auf diese Seite habe ich meine Freunde geschickt, wenn sie mich nach den Links zu meinen selbst gehosteten Diensten gefragt haben. Weiter unten gab es ein Karussell mit meinen Fotos, mein Homelab-Rack und eine Leiste mit Kontaktlinks.',
      desktopAlt: 'Eine marineblaue Seite mit „Welcome To Chiambucket!“ in Weiß und einem blauen Quick-Links-Button',
      phoneAlt: 'Dieselbe marineblaue Willkommensseite auf einem Handy',
      detailAlt: 'Ein weißer Abschnitt mit dem Titel „A little bit about myself“ über einem Karussell mit Landschaftsfotos',
    },
    2: {
      name: 'Das WordPress-Revamp',
      when: 'November 2024 bis Frühjahr 2025',
      built: 'WordPress und Elementor',
      body: 'Zwei Monate später habe ich den Header und das Menü neu gebaut und eine Über-mich-Seite ergänzt. Die Überschrift wechselte nach „Welcome To My“ durch ein paar Phrasen, und darunter zeigte die Seite einen Slider, der eines meiner Fotos vor und nach der Bearbeitung verglich, neben einem hohen Bild vom Homelab-Rack.',
      desktopAlt: 'Eine marineblaue Seite mit abgerundeter Menüleiste und der Überschrift „Welcome To My“ über einem blauen Quick-Links-Button',
      phoneAlt: 'Die überarbeitete marineblaue Landingpage auf einem Handy',
      detailAlt: 'Ein grauer Abschnitt mit einem Vorher-nachher-Fotoslider unter „My Photos“ und dem Homelab-Rack unter „My Homelab Journey“',
    },
    3: {
      name: 'Die handgebaute schwarze Seite',
      when: '2025',
      built: 'HTML, CSS und jQuery',
      body: '2025 habe ich WordPress verlassen und die ganze Seite selbst geschrieben. Sie war schwarz, mit Oswald für die Überschriften und einem Spotlight auf einer Partikelkugel hinter dem Titel, einer 3D-Szene aus Spline, die toll aussah, aber die ganze Seite ruckeln ließ. Neben meinen Kernkompetenzen war eine Zeichnung von Sukuna aus Jujutsu Kaisen, einer Figur, die ich sehr mochte. Der Button To BucketCentral sollte zu einer Seite führen, die alle meine selbst gehosteten Dienste an einem Ort sammelt, aber die Seite habe ich verworfen, bevor ich sie gebaut habe.',
      desktopAlt: 'Eine schwarze Seite mit „Welcome To Chiambucket!“, angestrahlt von einem Spotlight über einer Partikelkugel',
      phoneAlt: 'Die schwarze Spotlight-Willkommensseite auf einem Handy',
      detailAlt: 'Dunkle Karten mit „Hi I am Braven, I shape designs And stir up Creations!“ neben einer Zeichnung von Sukuna aus Jujutsu Kaisen, über My Core Skills',
    },
    4: {
      name: 'Der Verlaufs-Hero',
      when: 'Januar bis Juni 2026',
      built: 'HTML, CSS und jQuery',
      body: 'Im Januar habe ich sie noch einmal neu gestaltet, wieder von Hand, vor allem um das Ruckeln loszuwerden und Bento-Grids auszuprobieren, die mir richtig gut gefallen haben. Oben auf der Startseite war jetzt ein Verlauf von Lavendel zu Violett mit „Creating with Intention.“, und die Abschnitte darunter wurden zu einem Raster aus dunklen Karten für meine CAD- und PCB-Tools, meinen Designansatz und einen staubigen Render von Project June.',
      desktopAlt: 'Ein Verlauf von Lavendel zu Violett hinter der Überschrift „Creating with Intention.“',
      phoneAlt: 'Der Verlaufs-Hero auf einem Handy',
      detailAlt: 'Dunkle Karten für 3D-CAD und Platinendesign und „A Design first Engineering approach“, über einem Rover, der Staub aufwirbelt',
    },
    5: {
      name: 'Der Neubau mit Next.js',
      when: 'Juni bis Juli 2026',
      built: 'Next.js, React und Vercel',
      body: 'Im Juni habe ich die Seite zum ersten Mal mit Claude gestaltet, sie in Next.js neu gebaut und für mehr Tempo und Verfügbarkeit zu Vercel umgezogen. Jede Seite bekam ihre eigene Akzentfarbe, auf der Startseite stand „Creating with Meaning.“ über einem blauen Leuchten, und eine neue Galerie aller meiner Projekte ließ sich durchsuchen und filtern, wobei jede Karte eine kurze Zusammenfassung öffnete.',
      desktopAlt: 'Eine schwarze Seite mit „Creating with Meaning.“ über einem blauen Leuchten und zwei Buttons',
      phoneAlt: 'Die Next.js-Startseite auf einem Handy',
      detailAlt: 'Die Galerie All projects mit Filterchips und Karten für Project June, LoRA Messenger und LUMEN',
    },
    6: {
      name: 'Dark Sensory',
      when: 'Juli bis Oktober 2026',
      built: 'Next.js, WebGL und Vercel',
      body: 'Im Juli gab es eine kleinere Änderung: Das Layout blieb, wie es war, und nur das Farbschema hat sich geändert. Die Blau- und Lilatöne sahen langsam aus wie jede KI-gemachte Seite, also wurden die meisten Seiten in ein warmes Bernstein getaucht, für einen hochwertigeren Look.',
      desktopAlt: 'Eine dunkle, bernsteinfarbene Seite mit „CREATING WITH MEANING.“ in hohen Großbuchstaben und einem leuchtenden Button Get in touch',
      phoneAlt: 'Die bernsteinfarbene Dark-Sensory-Startseite auf einem Handy',
      detailAlt: 'Mattierte dunkle Karten für Video, Interface-Design, Fotografie und PowerPoint, in warmem Bernsteinlicht',
    },
    7: {
      name: 'Naturthema',
      when: '30. Oktober bis 18. November 2026',
      built: 'Next.js und Vercel',
      body: 'Ende Oktober habe ich der Seite ein Naturthema gegeben. Das war eine größere Änderung als die davor, aber immer noch eine schrittweise, denn Inhalt und Layout blieben gleich, während jede Seite in eine gemalte Landschaft zu ihrer eigenen Tageszeit zog und die Seite ihre kompakte Menüleiste bekam.',
      desktopAlt: 'Ein gemalter, salbeigrüner Morgen mit einer Schirmkiefer links und „Braven Chiam“ in klaren Glasbuchstaben',
      phoneAlt: 'Die gemalte Morgen-Startseite auf einem Handy',
      detailAlt: 'Eine Überschrift Projects auf dem gemalten Himmel über der Flaggschiff-Karte von OCR Meter',
    },
    8: {
      name: 'Natur-Redesign',
      when: 'Seit 18. November 2026',
      built: 'Next.js, GSAP und WebGL',
      body: 'Das ist die komplette Überarbeitung, an der ich gearbeitet habe, die erste seit v5, die mehr als nur den Look ändert, mit neuen Animationen und neuen Designs überall. Die Startseite behält das Gemälde, erzählt aber beim Scrollen eine Geschichte: Der Morgen zerfällt in Körnung, und dann bekommen der OCR Reader, Project June, Pip und BeadReader jeweils ein eigenes Kapitel, bevor meine anderen Projekte, mein Homelab und meine Fotos kommen.',
      desktopAlt: 'Die aktuelle Startseite: der gemalte Morgen mit „Braven Chiam“ in klarem Glas',
      phoneAlt: 'Die aktuelle Startseite auf einem Handy',
      detailAlt: 'Das Kapitel von Project June auf der aktuellen Startseite, mit drei Live-Kamerabildern neben der Überschrift „Three live feeds from three phones“',
    },
  },
};

export default de;
