/* The Pandus Dispenser article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The code keeps the images, ids, URLs and the dispense demo's timings. */
const en = {
  meta: {
    title: 'Pandus Dispenser | Braven Chiam',
    description: 'My first school project at Nanyang Polytechnic was a syrup dispenser made of six 3D-printed parts and run by an Arduino Uno, which I programmed from Python with PyFirmata.',
    ogDescription: 'Pandus is a syrup dispenser made of six 3D-printed parts and run by an Arduino Uno with PyFirmata.',
  },
  ld: { headline: 'Pandus Dispenser' },
  hero: {
    alt: 'Pandus syrup dispenser',
    back: 'Back to projects',
    tag: 'School project',
    title: <>Pandus <em>Dispenser</em></>,
    lead: 'Pandus was my first school project, a syrup dispenser made of six 3D-printed parts and run by an Arduino Uno. I built it from the parts we were given in class, plus a few that I bought.',
    builtWith: 'Built with',
    /** the key links */
    links: { video: 'Demo video', cad: '3D model' },
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    PromotionalVideo: 'Video', ProjectBackground: 'Background', DesignProcess: 'Design',
    ControlnFunction: 'Control', Coverimg: 'Cover image',
  },
  video: { h: 'Video', title: 'Pandus Dispenser video' },
  background: {
    h: 'Background',
    p: [
      'Pandus was my first major project as a first-year student at Nanyang Polytechnic, and the brief was open with no theme. We were given an Arduino Uno, a 4G servo, LEDs, buttons, sliding switches, an infrared collision detection module and a bundle of wires.',
      'I planned a water dispenser, but someone else had already chosen that, so I made a syrup dispenser instead.',
    ],
    alt: 'Filming part of the Pandus video',
    caption: 'Filming part of the video',
  },
  design: {
    h: 'Design',
    p: 'I designed Pandus in Onshape, and because I had little experience with it, learning the software took up a lot of the time. That left no time for prototypes, so I sent the final design straight to the 3D printer, and every part fit on the first print.',
    explodedAlt: 'Exploded view of the Pandus model in Onshape',
    assembledAlt: 'The assembled Pandus model in Onshape',
    cadTitle: '3D model',
    cadText: 'You can rotate the Pandus model in Onshape and take it apart.',
    cadButton: 'Open the 3D model in Onshape',
  },
  control: {
    h: 'Control',
    p: [
      'We were taught to program the Arduino from Python with the Firmata library. On top of the class parts, I bought high-power LEDs, a DC pump and a relay board, and I powered the high-current parts from a separate power bank.',
      'The demo below runs one dispense cycle from the flow chart further down, and you can pick a level to run it yourself.',
    ],
    /** the four pictures under the demo, in order */
    alts: [
      'Flow chart in which the infrared sensor opens the servo and lights the LED, the select button sets the level and the confirm button runs the pump for 3, 4 or 5 seconds',
      'Circuit diagram of the Arduino Uno, servo, infrared sensor, relays, DC pump, high-power LED, buzzer, buttons and indicator LEDs',
      'The wiring inside Pandus, with the relay board, buttons and indicator LEDs',
      'The breadboard, buzzer and Arduino Uno inside Pandus',
    ],
  },
  cover: {
    h: 'Cover image',
    p: 'I photographed Pandus four times under different lighting and blended the four shots in Photoshop to make the cover.',
    caption: 'How the four photos combine into the cover',
  },

  /** the dispense demo (DispenseDemo); {n} is a level (1 to 3), {s} the pump's seconds, {level} the level's label */
  demo: {
    level: 'Level {n}',
    /** which indicator LEDs each level lights, levels 1 to 3 */
    ledText: ['the red LED', 'the red and yellow LEDs', 'all three LEDs'],
    pump: '{s} s pump',
    /** the five steps of a cycle, by phase */
    phases: {
      idle: { label: 'Waiting', blurb: 'The dispenser waits for the infrared collision detection module to detect a cup.' },
      wake: { label: 'Cup in', blurb: 'When a cup triggers the infrared module, the servo turns to 180° to open the door over the buttons, the high-power LED turns on and the level resets to 1.' },
      select: { label: 'Select', blurb: 'The select button steps through levels 1, 2 and 3, and the indicator LEDs show which one is chosen.' },
      pour: { label: 'Pour', blurb: 'The confirm button switches the DC pump on through the relay for 3, 4 or 5 seconds, depending on the level.' },
      done: { label: 'Done', blurb: 'The pump stops and everything turns off until the next cup.' },
    },
    /** added after the select step's blurb; {leds} is one of ledText */
    selectNow: 'It is on level {n} now, which lights {leds}.',
    /** the cup's aria-label in each state */
    cup: {
      idle: 'Cup under the spout, empty and waiting',
      empty: 'Cup under the spout, empty',
      filling: 'Cup under the spout, filling at level {n}',
      filled: 'Cup under the spout, filled at level {n}',
    },
    /** the status line over the levels */
    status: { reduced: '{level} · {s} s pump', auto: 'Running on its own · {level}', pick: 'Your pick · {level}' },
    resume: 'Run on its own',
    levelsAria: 'Choose a level',
    railAria: 'Dispense cycle',
    again: 'Pour another',
    schemaAria: 'Component status',
    /** the four components in the schematic: short label and full name */
    comps: {
      ir: { label: 'IR module', full: 'Infrared collision detection module' },
      servo: { label: 'Door', full: 'Servo door over the buttons' },
      led: { label: 'LED', full: 'High-power LED over the cup' },
      pump: { label: 'Pump', full: 'DC pump switched by a relay' },
    },
    /** the components' state words */
    states: { watching: 'Watching', triggered: 'Triggered', closed: 'Closed', open: 'Open', on: 'On', off: 'Off', running: 'Running' },
  },
};

export type PandusCopy = typeof en;
export default en;
