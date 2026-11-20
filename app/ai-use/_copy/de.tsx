import type { AiUseCopy } from './en';

/* The /ai-use page's words in German, in the shape of en.tsx. */
const de: AiUseCopy = {
  meta: {
    title: 'Skala der KI-Nutzung | Braven Chiam',
    description:
      'Wie ich KI in meinen Projekten nutze, und die vierstufige Skala (L1 bis L4), mit der ich kennzeichne, wie viel von jedem Projekt mit KI-Tools entstanden ist.',
  },
  ldHeadline: 'Skala der KI-Nutzung',

  title: 'Skala der KI-Nutzung',
  sub: 'Mit dieser Skala zeige ich offen, wie stark KI-Tools meine Projekte beeinflusst haben.',
  scaleLabel: 'Die vier Stufen',
  humanEnd: 'Mensch bestimmt',
  agentEnd: 'Agenten bestimmen',

  stance: {
    title: 'Warum ich KI nutze und es offen sage',
    body: [
      'Für mich ist KI eine revolutionäre Technologie, die in vielen Bereichen eine Entwicklung in nie dagewesenem Tempo möglich macht. Statt ihre Nutzung abzuriegeln und einzuschränken, wie es die meisten Institutionen tun, erlaube ich mir, diese Tools voll auszuschöpfen und an die Grenzen dessen zu gehen, was sie können. So lerne ich ständig dazu über diese Technologie, die sich laufend verändert und rasant besser wird, und das macht meine Arbeit deutlich schneller und besser.',
      'Ich bin aber klar dagegen, mit KI-Tools minderwertige Arbeit ohne Mühe zu produzieren, besonders bei Kunst. Ich nutze KI-Tools in meiner Designarbeit, passe die Designstile aber selbst stark an, bis sie ein Niveau haben, das ich stolz zeigen kann.',
      'Deshalb habe ich diese Skala gebaut, damit man leicht sieht, wie viel KI in einem Projekt steckt. Wenn du sie nützlich findest, nutz sie gern auch für deine eigene Arbeit!',
    ],
  },

  levelsTitle: 'Die vier Stufen',
  levelsIntro: 'Jede Stufe schließt alles aus den Stufen davor ein.',
  usesLabel: 'Typisch für {code}',
  levels: {
    l1: {
      code: 'L1',
      short: 'Wenig Nutzung',
      name: 'Wenig bis kaum KI-Nutzung',
      alt: 'Badge L1: wenig Nutzung KI-basierter Tools',
      body: [
        'Ich habe im Projekt KI-Tools genutzt, aber sie hatten kaum oder gar keinen Einfluss auf das Ergebnis.',
      ],
      uses: ['Umformulieren', 'Ideen', 'Machbarkeit prüfen', 'Kleine Nebenaufgaben', 'Diagramme erstellen', 'Meine Arbeit prüfen'],
    },
    l2: {
      code: 'L2',
      short: 'Mittlere Nutzung',
      name: 'Mittlere KI-Nutzung',
      alt: 'Badge L2: mittlere Nutzung KI-basierter Tools',
      body: [
        'Alles aus Stufe 1, dazu wurden KI-Tools genutzt, um zentrale Teile des Projekts zu erstellen oder zu generieren.',
      ],
      uses: ['Code schreiben', 'Assets, von denen das Projekt abhängt, etwa Texturen für ein 3D-Objekt', 'Geräte konfigurieren'],
    },
    l3: {
      code: 'L3',
      short: 'Starke Nutzung',
      name: 'Starke KI-Nutzung',
      alt: 'Badge L3: starke Nutzung KI-basierter Tools',
      body: [
        'Stufe 3 geht noch einen Schritt weiter. KI-Tools liefen in Automatisierungsschleifen und trafen wichtige, folgenreiche Entscheidungen für das Projekt selbst, ohne vorher einen Menschen zu fragen. Der Code ist fast komplett von KI geschrieben, mit kaum menschlicher Beteiligung.',
        'Menschen übernehmen eine übergeordnete Rolle: Sie orchestrieren und steuern die Arbeit, die die KI-Agenten liefern. Menschen sind weiterhin eingebunden und treffen die wichtigen Entscheidungen.',
      ],
      uses: ['Agenten in Automatisierungsschleifen', 'Fast der ganze Code von KI', 'Menschen orchestrieren und prüfen'],
    },
    l4: {
      code: 'L4',
      short: 'Komplett KI',
      name: 'Komplett KI-generiert',
      alt: 'Badge L4: komplett mit KI-Tools erstellt',
      body: [
        'Auf Stufe 4 geht die Rolle des Orchestrierens an einen Agenten über. Menschen sind nicht mehr eingebunden, und Agenten treffen jede Entscheidung selbst.',
        'Ein Mensch setzt die Ziele und lässt die Agenten in einer Schleife laufen. Menschliches Eingreifen ist selten und passiert nur, wenn es nötig ist. Die Ergebnisse kommen erst beim Menschen an, um sie zu nutzen oder zu studieren, wenn die Arbeit fertig ist.',
      ],
      uses: ['Ein Mensch setzt das Ziel', 'Agenten orchestrieren andere Agenten', 'Ergebnisse werden am Ende geprüft'],
    },
  },

  compareTitle: 'Die Stufen im Vergleich',
  compareIntro: 'Jede Zeile stellt allen vier Stufen dieselbe Frage.',
  compareCaption: 'Vergleich der vier Stufen der KI-Nutzung',
  /* ­ is a soft hyphen, so long German words can break in the narrow phone columns. */
  rows: [
    {
      q: 'Wie viel KI',
      a: ['Wenig bis kaum', 'Mittel', 'Stark', 'Komplett KI-generiert'],
    },
    {
      q: 'Woran KI arbeitet',
      a: ['Kleine Hilfs­aufgaben', 'Zentrale Teile des Projekts', 'Fast die ganze Arbeit, in Automatisierungs­schleifen', 'Die ganze Arbeit'],
    },
    {
      q: 'Wer die Kernarbeit macht',
      a: ['Ich', 'Ich, mit KI für zentrale Teile', 'KI-Agenten', 'KI-Agenten'],
    },
    {
      q: 'Wer die wichtigen Entscheidungen trifft',
      a: ['Ich', 'Ich', 'Ich, während KI manche wichtige Entscheidung selbst trifft', 'Agenten, die auf meine Ziele hinarbeiten'],
    },
    {
      q: 'KI handelt ohne zu fragen',
      a: ['Nein', 'Nein', 'Ja', 'Ja'],
    },
    {
      q: 'Mensch eingebunden',
      a: ['Ja, durchgehend', 'Ja, durchgehend', 'Ja, bei den wichtigen Entscheidungen', 'Nein, nur am Anfang und am Ende'],
    },
    {
      q: 'Meine Rolle',
      a: ['Macher', 'Macher, mit KI als Werkzeug', 'Orches­trator und Manager', 'Setzt das Ziel, greift selten ein, studiert die Ergebnisse'],
    },
    {
      q: 'Beispiele',
      a: [
        'Umfor­mulieren, Machbarkeit prüfen, Diagramme, meine Arbeit prüfen',
        'Code schreiben, 3D-Texturen, Geräte konfigurieren',
        'Agenten­schleifen, die fast den ganzen Code schreiben',
        'Agenten, die selbstständig auf ein gesetztes Ziel hinarbeiten',
      ],
    },
  ],

  downloadTitle: 'Badges herunterladen',
  downloadIntro:
    'Jede Stufe gibt es als Label, als kleineres Icon und in einer vertikalen und horizontalen Version mit einem QR-Code, der auf diese Seite zurückführt, alles als SVG-Dateien, mit denen du deine eigenen Projekte kennzeichnen kannst.',
  marks: {
    label: { label: 'Label', name: 'Label' },
    icon: { label: 'Icon', name: 'Icon' },
    'vertical-qr': { label: 'QR vertikal', name: 'vertikal mit QR-Code' },
    'horizontal-qr': { label: 'QR horizontal', name: 'horizontal mit QR-Code' },
  },
  markAlt: 'Badge {code}, {name}',
  downloadLabel: 'Badge {code}, {name}, als SVG herunterladen',
};

export default de;
