import type { CsdpCopy } from './en';

/* The EMA Smart Home article's German words, in the shape of en.tsx. The PDFs themselves stay English. */
const de: CsdpCopy = {
  meta: {
    title: 'EMA Smart Home | Braven Chiam',
    description: 'Ein Smart-Home-System, das mein fünfköpfiges Schulteam gebaut hat und für das wir ein A bekommen haben. Vier BeagleBone-Black-Wireless-Knoten kümmern sich um Klima, Bad, Küche und Tür, und ein SocketIO-Webserver verbindet sie und hostet ein Live-Dashboard mit einer 3D-Ansicht in Spline.',
  },
  ld: { headline: 'EMA Smart Home' },
  hero: {
    alt: 'EMA Smart Home',
    back: 'Zu den Projekten',
    tag: 'Schulprojekt, 5er‑Team',
    title: <>EMA Smart <em>Home</em></>,
    lead: 'Das ist ein Smart-Home-System auf vier BeagleBone-Black-Wireless-Boards, das den Energieverbrauch eines Zuhauses senken soll. Es war das komplexeste Gruppenprojekt, an dem ich bisher gearbeitet habe, es hat Wissen aus mehreren unserer Kurse gebraucht, und wir haben ein A dafür bekommen.',
    builtWith: 'Gebaut mit',
    links: { demo: 'Live‑Demo', github: 'GitHub', video: 'Promovideo' },
  },
  chapters: 'Kapitel',
  rail: {
    PromoVideo: 'Video', Team: 'Team', ProjBackground: 'Aufgabe', DesignProcess: 'Dashboard',
    Climate: 'Klimaknoten', Bathroom: 'Badknoten', Kitchen: 'Küchenknoten', Intrusion: 'Einbruchsknoten',
    Connectivity: 'Vernetzung', SlideDeck: 'Folien', Documentation: 'Dokumentation',
  },
  video: { h: 'Video', title: 'Promovideo von EMA Smart Home' },
  team: {
    h: 'Team',
    roles: ['Teamleitung, Doku, Code', 'Grafik, Code, Design', 'Doku, Code', 'Doku, Code', 'Teammitglied'],
    me: '{name} (ich)',
    profile: 'Profil',
    noProfile: 'Kein Profil',
  },
  brief: {
    h: 'Aufgabe',
    p: 'Wir haben vier BeagleBone-Black-Wireless-Boards und ein Set MikroBUS-Click-Module bekommen und sollten ein System mit WLAN bauen, das nachhaltiges Wohnen unterstützt. Wir haben ein Smart-Home-System gebaut, das den Energieverbrauch in Echtzeit überwacht und Geräte schaltet, um den Verbrauch zu senken, und danach noch einen Knoten zur Einbruchserkennung ergänzt.',
    alt: 'Wo jedes Board im Haus sitzt',
    caption: 'Wo jedes Board im Haus sitzt',
  },
  dashboard: {
    h: 'Dashboard',
    p: <>Der Großteil des Projekts war Software, also steckte die Designarbeit vor allem im Dashboard, das klar, gut lesbar und schnell zu erfassen sein sollte. Außerdem haben wir ein 3D-Modell des Hauses in Spline ergänzt, das jede Aktion zeigt, während sie passiert, und du kannst es in der <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">Live-Demo</a> selbst ausprobieren.</>,
    mockAlt: 'Figma-Entwurf des Dashboards',
    mockCaption: 'Figma-Entwurf des Dashboards',
    finishedCaption: 'Das fertige Dashboard',
    splineCaption: 'Die 3D-Ansicht in Spline zeigt Aktionen live',
  },
  nodes: {
    Climate: {
      h: 'Klimaknoten',
      p: 'Der Klimaknoten überwacht Temperatur, Luftfeuchtigkeit und ob jemand im Raum ist, und er schaltet den Ventilator nur ein, wenn eine Person erkannt wird und es im Raum warm und feucht ist.',
      alt: 'Hardware des Klimaknotens',
    },
    Bathroom: {
      h: 'Badknoten',
      p: 'Mit den Tasten und dem Display stellst du ein, wie lange du duschen willst. Der Timer startet, wenn der Knoten erkennt, dass du in die Dusche gehst, und ein Summer ertönt, wenn die Zeit um ist.',
      alt: 'Hardware des Badknotens',
    },
    Kitchen: {
      h: 'Küchenknoten',
      p: 'Der Küchenknoten überwacht den Energieverbrauch des Kühlschranks und meldet dem Dashboard einen Energiewert. Er dient außerdem als Feueralarm, und erkennt er ein unkontrolliertes Feuer, ertönt der Alarm auf allen Knoten.',
      alt: 'Hardware des Küchenknotens',
    },
    Intrusion: {
      h: 'Einbruchsknoten',
      p: 'Der Einbruchsknoten erkennt, wenn jemand an die Tür klopft oder die Tür zu ungewöhnlichen Zeiten aufgeht, und in beiden Fällen löst er auf allen Knoten einen Alarm aus.',
      alt: 'Hardware des Einbruchsknotens',
    },
  },
  connectivity: {
    h: 'Vernetzung',
    p: [
      'Jedes Board verbindet sich mit einem SocketIO-Webserver, der das Dashboard hostet und Ereignisse und Alarme zwischen den Knoten koordiniert.',
      'Die Karte unten zeigt die vier Knoten und den Server. Wähl einen Knoten, um zu sehen, was er macht, oder simulier ein Feuer in der Küche, um zu sehen, wie der Alarm jeden Knoten erreicht.',
    ],
    diagramAlt: 'Diagramm, wie Knoten, Server und Dashboard verbunden sind',
    diagramCaption: 'Wie Knoten, Server und Dashboard verbunden sind',
    repoTitle: 'Quellcode auf GitHub',
    repoText: 'Im Repository liegt der Code für jeden Knoten und für den SocketIO-Server, der das Dashboard hostet.',
    repoButton: 'Code auf GitHub ansehen',
  },
  slides: { h: 'Folien', title: 'Foliensatz von EMA Smart Home (PDF)', open: 'Folien öffnen (PDF)' },
  docs: { h: 'Dokumentation', title: 'Dokumentation von EMA Smart Home (PDF)', open: 'Dokumentation öffnen (PDF)' },

  nodeMap: {
    nodes: {
      climate: {
        name: 'Klima',
        short: 'Lüftersteuerung',
        does: 'Er schaltet den Ventilator nur ein, wenn jemand im Raum ist und die Luft warm und feucht ist.',
        hardware: 'BME680-Sensor für Temperatur und Luftfeuchtigkeit, PIR-Anwesenheitssensor, 8x8-LED-Matrix, Summer',
        alarm: 'Er ertönt, sobald irgendein Knoten Alarm schlägt',
      },
      bathroom: {
        name: 'Bad',
        short: 'Duschtimer',
        does: 'Er misst deine Duschzeit bis zu der Länge, die du mit den Tasten einstellst, und startet, wenn du reingehst.',
        hardware: 'PIR-Sensor, OLED-Display, kapazitive Tasten, Summer',
        alarm: 'Er spielt drei Töne, wenn die Zeit um ist',
      },
      kitchen: {
        name: 'Küche',
        short: 'Energie und Feuer',
        does: 'Er meldet den Energieverbrauch des Kühlschranks als Wert ans Dashboard und achtet auf Feuer.',
        hardware: 'Analoger Stromsensor, Flame Click, OLED-Display, Summer',
        alarm: 'Ein Feuer löst den Alarm auf allen Knoten aus',
      },
      intrusion: {
        name: 'Einbruch',
        short: 'Türsicherung',
        does: 'Er achtet auf Klopfen an der Tür und darauf, ob die Tür zu ungewöhnlichen Zeiten aufgeht.',
        hardware: 'Reedschalter an der Tür, Vibrationssensor fürs Klopfen, Summer',
        alarm: 'Beides löst den Alarm auf allen Knoten aus',
      },
    },
    hub: { label: 'Webserver', idle: 'SocketIO, hostet das Dashboard', alarm: 'Alarm an alle Knoten' },
    nodeAria: 'Knoten {name}',
    nodeAriaAlarm: 'Knoten {name}, Alarm ertönt',
    alarmTag: 'Alarm',
    caption: 'Jede Linie ist eine SocketIO-Verbindung, und die Punkte sind Messwerte auf dem Weg zum Server.',
    eyebrow: { pinned: 'Gewählter Knoten', idle: 'Wähl einen Knoten' },
    tabsAria: 'Sensorknoten',
    cardTitle: 'Knoten {name}',
    terms: { does: 'Aufgabe', hardware: 'Hardware', buzzer: 'Summer' },
    status: {
      idle: 'Verbunden, schickt Messwerte an den Server',
      arming: 'Die Küche sieht eine Flamme, und ihr Summer ertönt',
      travelling: 'Alarm auf dem Weg zum Server',
      received: 'Der Server sendet den Alarm an alle, und jeder Knoten ertönt',
    },
    sim: { run: 'Küchenfeuer simulieren', busy: 'Alarm läuft' },
    hint: 'Wenn der Küchenknoten eine Flamme erkennt, bekommt der Server den Alarm und schickt ihn an jeden Knoten weiter.',
  },
};
export default de;
