import type { BeadreaderCopy } from './en';

/* The BeadReader article's German words, in the shape of en.tsx. */
const de: BeadreaderCopy = {
  meta: {
    title: 'BeadReader | Braven Chiam',
    description: 'Eine private Lese-App für Bücher, nur auf Einladung, die ich mit Next.js, Supabase und Cloudflare R2 gebaut habe. Mit Login per Zugangscode, Lesestand und Themes für jeden Leser, Live-Anwesenheit, einer Inhaltssperre direkt in SQL, Webtoons und gemeinsamer Lesestatistik.',
    ogDescription: 'Eine private Lese-App für Bücher, nur auf Einladung, mit Live-Anwesenheit, Lesestand für jeden Leser, einer Inhaltssperre in SQL, Webtoons und gemeinsamer Lesestatistik.',
  },
  ld: {
    headline: 'BeadReader',
    description: 'Eine private Online-Lese-App für Bücher, nur auf Einladung, gebaut mit Next.js, Supabase und Cloudflare R2. Mit Login per Zugangscode über ein HMAC-signiertes Cookie, Lesestand und Themes für jeden Leser, Live-Anwesenheit, einer Sperre für explizite Inhalte direkt in SQL, Webtoons und einem gemeinsamen Dashboard mit Lesestatistik.',
  },
  hero: {
    alt: 'BeadReader auf drei Handys: der Login-Bildschirm, ein Kapitel und die Statistikseite',
    back: 'Zu den Projekten',
    tag: 'Eigenes Projekt',
    title: <>Bead<em>Reader</em></>,
    lead: 'BeadReader ist eine private Online-Lese-App für ein paar Freunde. Der Admin veröffentlicht Bücher in Markdown oder als Webtoons aus Bildern, und die Leser melden sich mit einem einzigen Zugangscode an. Die App merkt sich, wo jeder aufgehört hat, und man sieht, wer sonst gerade liest, kann ein Winken oder eine kurze Notiz schicken und den Fortschritt auf einem gemeinsamen Statistik-Dashboard vergleichen.',
    builtWith: 'Gebaut mit',
    links: { github: 'GitHub', deploy: 'Selbst deployen' },
  },
  chapters: 'Kapitel',
  rail: {
    room: 'Privater Zugang', library: 'Lesestand und Themes', together: 'Gemeinsam lesen', gate: 'Die Spicy-Sperre',
    books: 'Text und Webtoons', stats: 'Lesestatistik', instant: 'Offline und Updates', stack: 'Der Stack',
  },
  room: {
    h: 'Privater Zugang',
    p: [
      'BeadReader ist eine private Bibliothek für einen Admin und ein paar Leser, ganz ohne Passwörter und ohne Registrierung. Stattdessen ist ein einziger Zugangscode deine Identität. Er entscheidet, ob du Admin oder Leser bist und ob du explizite Kapitel sehen kannst, und sobald du ihn eingibst, hält dich ein signiertes Cookie eingeloggt.',
      'Der Admin legt jeden Leser an und gibt ihm einen Code, und widerruft der Admin diesen Code, wird der Leser bei seiner nächsten Anfrage ausgeloggt.',
    ],
    alt: 'Der Login-Bildschirm von BeadReader mit einem einzigen Feld für den Zugangscode',
    caption: 'Der Login-Bildschirm mit seinem einen Feld für den Zugangscode',
  },
  library: {
    h: 'Lesestand und Themes',
    p: [
      'Öffnest du ein Buch, springt es zurück zu dem Kapitel und der Scrollposition, wo du zuletzt warst. Die Position wird als Bruchteil des Kapitels gespeichert statt als Pixelwert, sodass sie auch nach einer Änderung der Schriftgröße noch stimmt, und hörst du am Handy mitten im Absatz auf, landest du am Laptop an genau derselben Stelle.',
      'BeadReader speichert für jeden Leser die eigene Hintergrund- und Textfarbe, die Schriftgröße und die Wahl zwischen einem scrollenden und einem seitenweisen Layout. Das Inhaltsverzeichnis markiert jedes Kapitel, das du geöffnet hast, zeigt beim angefangenen einen Fortschrittsbalken und lässt dich ein Kapitel als ungelesen markieren.',
    ],
    figs: [
      { alt: 'Die Leseansicht im Paper-Theme', caption: 'Die Leseansicht im Paper-Theme' },
      { alt: 'Das Inhaltsverzeichnis eines Buchs mit dem Fortschritt des Lesers', caption: 'Das Inhaltsverzeichnis mit Lesestand und Fortschrittsbalken' },
    ],
  },
  together: {
    h: 'Gemeinsam lesen',
    p: [
      'In der Bibliothek siehst du, wer sonst online ist, und in einem Buch sitzen oben die Avatare der Leser, die gerade online sind, jeder mit einem grünen Punkt. Ist ein Freund im selben Buch, bekommt sein Avatar außerdem einen grünen Ring und seine Kapitelnummer.',
      'Tippst du auf die Avatare, kannst du ein Winken oder eine kurze Notiz schicken. Die erscheint ein paar Sekunden auf dem Bildschirm des anderen und wird nie gespeichert. Jeder kann ein Profilfoto hochladen, das im Browser zugeschnitten und komprimiert wird, und wer will, kann mit einem Privatsphäre-Schalter unsichtbar lesen.',
    ],
    alt: 'Das Menü zum Schicken eines Winkens oder einer Notiz',
    caption: 'Das Menü zum Schicken eines Winkens oder einer kurzen Notiz',
  },
  gate: {
    h: 'Die Spicy-Sperre',
    p: [
      'Manche Kapitel oder Stellen in einem Kapitel sind als explizit markiert, und der Zugang dazu wird für jeden Leser einzeln festgelegt und direkt in der Datenbankabfrage durchgesetzt. Ein Leser ohne Zugang bekommt den gesperrten Text nie, nicht einmal versteckt in der Antwort, also lässt er sich auch nicht aus der rohen API ziehen.',
      'Dasselbe Kapitel sieht je nach Leser anders aus: Mit Zugang bekommst du eine verschwommene Stelle, die beim Antippen scharf wird, ohne Zugang siehst du eine gesperrte Vorschau mit dem Hinweis, dass du Zugang anfragen kannst, und im Cal-Modus wird jede explizite Stelle entfernt, ohne Markierung und ohne Chili-Symbol.',
    ],
    alt: 'Ein Inhaltsverzeichnis mit einem markierten expliziten Kapitel',
    caption: 'Ein Inhaltsverzeichnis mit einem markierten expliziten Kapitel, so wie es ein Leser mit Zugang sieht',
  },
  books: {
    h: 'Text und Webtoons',
    p: [
      'Jedes Buch ist entweder Text oder ein Webtoon, und das wählt der Admin beim Anlegen. Textbücher werden in Markdown mit einer Vorschau daneben geschrieben, und jedes Kapitel hat seinen eigenen Status als Entwurf oder veröffentlicht.',
      'Für einen Webtoon wählt der Admin einen Ordner mit nummerierten Bildern, prüft ihre Reihenfolge in der Vorschau und lädt sie mit kurzlebigen signierten URLs direkt aus dem Browser zu Cloudflare R2 hoch. Die Leser scrollen dann durch einen einzigen lückenlosen senkrechten Streifen, mit demselben Lesestand, derselben Verfolgung und derselben Sperre wie bei einem Textbuch.',
    ],
    figs: [
      { alt: 'Die Bücherliste des Admins', caption: 'Die Bücherliste des Admins mit Text- und Webtoon-Büchern, als Entwurf und veröffentlicht' },
      { alt: 'Ein Webtoon-Kapitel als lückenloser senkrechter Streifen', caption: 'Ein Webtoon-Kapitel als ein einziger senkrechter Streifen' },
    ],
  },
  stats: {
    h: 'Lesestatistik',
    p: [
      'Leser, die ihre Aktivität teilen, erscheinen auf einem gemeinsamen Dashboard mit ihren Gesamtstunden, fertig gelesenen Büchern und Lesesträhnen. Ein Histogramm zeigt Tag für Tag, zu welcher Tageszeit gelesen wird, und tippst du auf einen Leser, öffnet sich eine Aufschlüsselung seiner Zeit nach Buch und Kapitel.',
      'Lesezeit zählt nur, solange du wirklich liest, sie pausiert also, wenn der Tab den Fokus verliert oder du nichts mehr tust.',
    ],
    figs: [
      { alt: 'Die Übersicht der Lesestatistik', caption: 'Die Statistikübersicht mit Lesesträhnen' },
      { alt: 'Die Statistik eines Lesers im Detail', caption: 'Die Zeit eines Lesers, aufgeschlüsselt nach Buch und Kapitel' },
    ],
  },
  instant: {
    h: 'Offline und Updates',
    p: [
      'Ein Service Worker speichert Cover, Artwork und statische Dateien auf dem Gerät, aber nie HTML oder API-Antworten, und die App lädt das nächste Kapitel vor, sodass Seiten schnell aufgehen und weniger Daten verbrauchen. Die Kontoseite zeigt, was gespeichert ist und wie viel Platz es braucht, mit einem Button, um alles zu löschen.',
      'Ein öffentliches Changelog und ein Pop-up mit den Neuerungen, das für jede Version einmal erscheint, erklären neue Funktionen, und sobald ein neuerer Build deployt ist, erscheint ein Hinweis zum Neuladen.',
    ],
    figs: [
      { alt: 'Das Konto- und Speicherfenster', caption: 'Die Kontoseite und der Speicher auf dem Gerät, mit einem Button zum Löschen von allem' },
      { alt: 'Das Changelog in der App', caption: 'Das Changelog in der App' },
    ],
  },
  stack: {
    h: 'Der Stack',
    p: [
      'BeadReader ist eine Next.js-App mit App Router und Tailwind CSS v4, Supabase für Postgres und Speicher und Cloudflare R2 für die Webtoon-Bilder, während der Login mein eigenes kurzes HMAC-signiertes Cookie nutzt statt Supabase Auth.',
      'Weil der Login selbst gebaut ist, läuft jeder Datenbankzugriff auf dem Server mit der Service Role von Supabase, und jede Tabelle hat Row-Level Security eingeschaltet, ohne eine einzige Policy, sodass der öffentliche Schlüssel gar nichts lesen kann. Die Sperre für explizite Inhalte steckt in der SQL-Abfrage, und das Deployment auf Vercel mit einem Klick richtet Supabase über die Integration ein und führt die Migrationen während des Builds aus.',
    ],
  },

  presence: {
    eyebrow: 'Gerade online',
    captions: [
      'Mara ist in Kapitel 12 des Buchs, das du gerade liest, deshalb hat ihr Avatar den grünen Ring.',
      'Tipp auf einen Leser, um ihm zuzuwinken. Das erscheint auf seinem Bildschirm und verblasst dann.',
      'Du kannst auch eine kurze Notiz schicken, die nach ein paar Sekunden weg ist und nie gespeichert wird.',
      'Sam öffnet dasselbe Buch und bekommt auch einen grünen Ring.',
    ],
    note: 'krasser Twist!',
    sentNote: 'lese das gerade!',
    status: {
      mara: 'Dieses Buch, Kapitel 12',
      jae: 'Der Hobbit, Kapitel 3',
      samLibrary: 'Stöbert in der Bibliothek',
      samBook: 'Dieses Buch, Kapitel 1',
    },
    here: 'liest hier',
    wave: '{name} zuwinken',
    sendNote: '{name} eine Notiz schicken',
    stepsAria: 'Schritte der Demo',
    step: 'Schritt {n} von {total}',
    legend: 'Ein grüner Ring zeigt, wer in deinem Buch ist',
  },

  spicyGate: {
    chapter: 'Kapitel 9',
    passage: {
      lead: 'Den ganzen Abend waren sie umeinander herumgeschlichen. Als endlich der letzte Gast gegangen war, wurde es still im Raum.',
      spicy: 'Was dann geschah, blieb zwischen ihnen und dem schwachen Licht des Feuers.',
      trail: 'Der Morgen kam viel zu früh.',
    },
    modes: {
      full: { label: 'Voller Zugang', caption: 'Dieser Leser hat Zugang, also macht ein Tippen die verschwommene Zeile scharf.' },
      none: { label: 'Kein Zugang', caption: 'Der Server schickt diesem Leser die gesperrte Stelle nie.' },
      cal: { label: 'Cal-Modus', caption: 'Die Zeile ist ganz entfernt, ohne Lücke und ohne Markierung.' },
    },
    revealAria: 'Tippen, um die Spicy-Stelle aufzudecken',
    revealedAria: 'Spicy-Stelle aufgedeckt',
    reveal: 'Antippen',
    locked: 'Spicy-Stelle. Frag den Admin nach Zugang.',
    tabsAria: 'Lesermodus',
    footnote: 'Die Sperre steckt in der SQL-Abfrage, also verlässt gesperrter Text nie den Server.',
  },
};
export default de;
