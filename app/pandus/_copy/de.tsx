import type { PandusCopy } from './en';

/* The Pandus Dispenser article's German words, in the shape of en.tsx. */
const de: PandusCopy = {
  meta: {
    title: 'Pandus-Dispenser | Braven Chiam',
    description: 'Mein erstes Schulprojekt an der Nanyang Polytechnic war ein Sirupspender aus sechs 3D-gedruckten Teilen, gesteuert von einem Arduino Uno, den ich mit PyFirmata aus Python programmiert habe.',
    ogDescription: 'Pandus ist ein Sirupspender aus sechs 3D-gedruckten Teilen, gesteuert von einem Arduino Uno mit PyFirmata.',
  },
  ld: { headline: 'Pandus-Dispenser' },
  hero: {
    alt: 'Der Sirupspender Pandus',
    back: 'Zu den Projekten',
    tag: 'Schulprojekt',
    title: <>Pandus-<em>Dispenser</em></>,
    lead: 'Pandus war mein erstes Schulprojekt, ein Sirupspender aus sechs 3D-gedruckten Teilen, gesteuert von einem Arduino Uno. Gebaut habe ich ihn aus den Teilen, die wir im Unterricht bekommen haben, plus ein paar, die ich selbst gekauft habe.',
    builtWith: 'Gebaut mit',
    links: { video: 'Demovideo', cad: '3D‑Modell' },
  },
  chapters: 'Kapitel',
  rail: {
    PromotionalVideo: 'Video', ProjectBackground: 'Hintergrund', DesignProcess: 'Design',
    ControlnFunction: 'Steuerung', Coverimg: 'Titelbild',
  },
  video: { h: 'Video', title: 'Video zum Pandus-Dispenser' },
  background: {
    h: 'Hintergrund',
    p: [
      'Pandus war mein erstes großes Projekt als Erstsemester an der Nanyang Polytechnic, und die Aufgabe war offen, ganz ohne Thema. Wir haben einen Arduino Uno, einen 4G-Servo, LEDs, Tasten, Schiebeschalter, ein Infrarot-Modul zur Hinderniserkennung und ein Bündel Kabel bekommen.',
      'Eigentlich hatte ich einen Wasserspender geplant, aber den hatte schon jemand anderes gewählt, also habe ich stattdessen einen Sirupspender gebaut.',
    ],
    alt: 'Dreharbeiten für einen Teil des Pandus-Videos',
    caption: 'Dreharbeiten für einen Teil des Videos',
  },
  design: {
    h: 'Design',
    p: 'Pandus habe ich in Onshape entworfen, und weil ich damit noch wenig Erfahrung hatte, ging viel Zeit dafür drauf, die Software zu lernen. Für Prototypen blieb deshalb keine Zeit, also habe ich das fertige Design direkt an den 3D-Drucker geschickt, und jedes Teil passte beim ersten Druck.',
    explodedAlt: 'Explosionsansicht des Pandus-Modells in Onshape',
    assembledAlt: 'Das zusammengebaute Pandus-Modell in Onshape',
    cadTitle: '3D-Modell',
    cadText: 'Du kannst das Pandus-Modell in Onshape drehen und auseinandernehmen.',
    cadButton: '3D-Modell in Onshape öffnen',
  },
  control: {
    h: 'Steuerung',
    p: [
      'Uns wurde beigebracht, den Arduino mit der Firmata-Bibliothek aus Python zu programmieren. Zusätzlich zu den Teilen aus dem Unterricht habe ich Hochleistungs-LEDs, eine DC-Pumpe und ein Relaisboard gekauft, und die Teile mit hohem Strombedarf habe ich über eine eigene Powerbank versorgt.',
      'Die Demo unten spielt einen Ausgabezyklus aus dem Flussdiagramm weiter unten durch, und du kannst eine Stufe wählen, um ihn selbst laufen zu lassen.',
    ],
    alts: [
      'Flussdiagramm, in dem der Infrarotsensor den Servo öffnet und die LED einschaltet, die Wahltaste die Stufe einstellt und die Bestätigungstaste die Pumpe 3, 4 oder 5 Sekunden laufen lässt',
      'Schaltplan mit Arduino Uno, Servo, Infrarotsensor, Relais, DC-Pumpe, Hochleistungs-LED, Summer, Tasten und Anzeige-LEDs',
      'Die Verkabelung im Inneren von Pandus, mit dem Relaisboard, den Tasten und den Anzeige-LEDs',
      'Das Steckbrett, der Summer und der Arduino Uno im Inneren von Pandus',
    ],
  },
  cover: {
    h: 'Titelbild',
    p: 'Ich habe Pandus viermal unter verschiedenem Licht fotografiert und die vier Aufnahmen in Photoshop zum Titelbild zusammengesetzt.',
    caption: 'Wie die vier Fotos zum Titelbild verschmelzen',
  },

  demo: {
    level: 'Stufe {n}',
    ledText: ['die rote LED', 'die rote und die gelbe LED', 'alle drei LEDs'],
    pump: '{s} s Pumpe',
    phases: {
      idle: { label: 'Wartet', blurb: 'Der Spender wartet darauf, dass das Infrarot-Modul zur Hinderniserkennung einen Becher erkennt.' },
      wake: { label: 'Becher da', blurb: 'Löst ein Becher das Infrarot-Modul aus, dreht sich der Servo auf 180° und öffnet die Klappe über den Tasten, die Hochleistungs-LED geht an, und die Stufe springt auf 1 zurück.' },
      select: { label: 'Wählen', blurb: 'Die Wahltaste schaltet durch die Stufen 1, 2 und 3, und die Anzeige-LEDs zeigen, welche gewählt ist.' },
      pour: { label: 'Füllen', blurb: 'Die Bestätigungstaste schaltet die DC-Pumpe über das Relais für 3, 4 oder 5 Sekunden ein, je nach Stufe.' },
      done: { label: 'Fertig', blurb: 'Die Pumpe stoppt, und alles geht aus bis zum nächsten Becher.' },
    },
    selectNow: 'Gerade ist Stufe {n} gewählt, angezeigt durch {leds}.',
    cup: {
      idle: 'Becher unter dem Auslauf, leer und wartend',
      empty: 'Becher unter dem Auslauf, leer',
      filling: 'Becher unter dem Auslauf, wird auf Stufe {n} gefüllt',
      filled: 'Becher unter dem Auslauf, auf Stufe {n} gefüllt',
    },
    status: { reduced: '{level} · {s} s Pumpe', auto: 'Läuft automatisch · {level}', pick: 'Deine Wahl · {level}' },
    resume: 'Automatisch',
    levelsAria: 'Stufe wählen',
    railAria: 'Ausgabezyklus',
    again: 'Nachfüllen',
    schemaAria: 'Status der Bauteile',
    comps: {
      ir: { label: 'IR-Modul', full: 'Infrarot-Modul zur Hinderniserkennung' },
      servo: { label: 'Klappe', full: 'Servoklappe über den Tasten' },
      led: { label: 'LED', full: 'Hochleistungs-LED über dem Becher' },
      pump: { label: 'Pumpe', full: 'DC-Pumpe, geschaltet über ein Relais' },
    },
    states: { watching: 'Wacht', triggered: 'Ausgelöst', closed: 'Zu', open: 'Offen', on: 'An', off: 'Aus', running: 'Läuft' },
  },
};
export default de;
