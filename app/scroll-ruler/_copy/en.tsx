/* The Scroll Ruler article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The AtomS3R's screens keep the firmware's own English (RULER, CALIBRATE, tap: zero...), so they are not here. */
const en = {
  meta: {
    title: 'Scroll Ruler | Braven Chiam',
    description: 'A digital ruler built from an M5Stack AtomS3R and a Unit Scroll during my internship at M5Stack. You press the scroll wheel down and roll it along whatever you want to measure, and the screen shows the distance in centimetres after a one-time 10 cm calibration.',
    ogDescription: 'Roll the Unit Scroll along something and the AtomS3R shows how long it is.',
  },
  ld: {
    headline: 'Scroll Ruler',
    about: ['M5Stack AtomS3R', 'M5Stack Unit Scroll', 'ESP32-S3', 'rotary encoder', 'digital ruler'],
  },
  hero: {
    alt: 'The Scroll Ruler: an AtomS3R on its Atomic Battery Base, with the Unit Scroll plugged in underneath and the screen reading 0.0 cm',
    back: 'Back to projects',
    tag: 'Internship project',
    title: <>Scroll <em>Ruler</em></>,
    lead: 'I built this digital ruler during my internship at M5Stack from an AtomS3R and a Unit Scroll. You press the scroll wheel down and roll it along whatever you want to measure, and the screen shows the distance in centimetres.',
    builtWith: 'Built with',
    /** the key links: GitHub, Flashdeck */
    links: ['GitHub', 'Flash the firmware'],
    meta: 'Internship project at M5Stack, November 2026. M5Stack AtomS3R, Atomic Battery Base, Unit Scroll, C++.',
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    demo: 'Demo', try: 'Try it', use: 'How to use it', measure: 'Measure', calibrate: 'Calibrate',
    steps: 'How fine it measures', how: 'How it works', hardware: 'Hardware', setup: 'Setting one up',
  },
  demo: {
    h: 'Demo',
    p: 'I filmed this at my desk, first calibrating it over 10 cm of a ruler and then measuring three lengths along the same ruler.',
    video: 'The Scroll Ruler calibrated over 10 cm of a ruler, then measuring 4.1, 8.2 and 7.3 cm',
    /** the four moment cards, in time order */
    moments: [
      { label: 'Calibrating over 10 cm', note: 'It counted 49 steps of the wheel, about 2 mm a step' },
      { label: 'The first run', note: 'Rolled along the ruler, it reads 4.1 cm' },
      { label: 'The second run', note: 'A longer roll reads 8.2 cm' },
      { label: 'The third run', note: 'The last roll reads 7.3 cm' },
    ],
  },
  try: {
    h: 'Try it',
    p: 'This copy of the ruler runs the same logic as the firmware and starts on its calibration screen. Drag the Unit Scroll along the ruler to roll it with the wheel pressed down, which counts, or click the ruler to lift it and set it down somewhere else, which doesn’t. Tapping the screen saves a calibration or zeroes the reading, and holding it for a second starts a new calibration.',
    note: 'A calibration that isn’t exactly 10 cm throws every reading off by the same amount, here as on the real ruler.',
  },
  /** the simulator's words around the device (RulerSim); {cm} and {n} are numbers */
  sim: {
    reading: 'Reading {cm} centimetres.',
    readingLive: 'Reading {cm} centimetres, counting.',
    calibrating: 'Calibrating: {n} steps so far. Roll exactly 10 centimetres with the wheel pressed, then release.',
    confirming: '{n} steps for 10 centimetres. Tap the screen to save it.',
    button: 'The AtomS3R\'s screen, which is also its button: tap to zero or save, hold to calibrate again',
    puck: 'The Unit Scroll at {cm} cm on the ruler. Hold an arrow key to roll it with the wheel pressed.',
    reset: 'Start over',
  },
  use: {
    h: 'How to use it',
    p: 'The AtomS3R’s whole screen is its button, so the ruler has only two controls: the scroll wheel, which you press down while you roll it, and the screen, which you tap or hold.',
  },
  measure: {
    h: 'Measure',
    screen: 'The ruler screen while counting: RULER with a green LIVE tag, 4.1 cm in green, and 41 mm at 2.0 mm a step',
    p1: 'You press the wheel down and roll it forward, and the distance counts only while the wheel stays pressed, with the Unit Scroll’s LED glowing green and the reading turning green too. Releasing the wheel stops the count, and rolling backwards while it is pressed takes distance off again.',
    p2: 'Tapping the screen sets the reading back to zero, and holding it for about a second starts a new calibration.',
  },
  calibrate: {
    h: 'Calibrate',
    rolling: 'Calibrating: 49 steps counted so far, with the instruction to press the wheel and roll exactly 10 cm',
    rollingCaption: 'Rolling the 10 cm',
    checking: 'Checking: 49 steps equal 10 cm, tap to save',
    checkingCaption: 'Released, ready to save',
    p1: 'The first time it starts, and whenever you ask it to, the ruler measures 10 cm to learn how far the wheel travels per step. You press the wheel and roll it exactly 10 cm along a real ruler, then release it and tap the screen to save the number of steps it counted.',
    p2: 'Pressing the wheel again keeps adding to the same roll, and holding the screen starts it over. The calibration stays in flash, so it survives a power cut, and the direction you rolled it in becomes forward.',
  },
  steps: {
    h: 'How fine it measures',
    p: 'The wheel only has so many steps in a turn, so the ruler measures in steps rather than smoothly. Mine counted 49 steps for 10 cm, which makes each step about 2 mm, and the screen shows the exact step length under every reading so you know how much to trust the last digit.',
  },
  how: {
    h: 'How it works',
    p1: 'The Unit Scroll has its own small chip that counts the wheel’s steps and reads its button, and the AtomS3R asks it for both over I2C through the Grove port a hundred times a second. Each read returns the steps since the last one, and they only count toward the distance while the wheel is pressed.',
    p2: 'I kept the ruler’s logic, which is the calibration and the distance maths, in one file with no hardware code in it, so eleven unit tests check it on a computer before it goes onto the device. If the Unit Scroll comes unplugged the screen says so, and it picks the unit back up as soon as it is plugged in again.',
  },
  hardware: {
    h: 'Hardware',
    /** the parts list, in order, each linking to M5Stack */
    parts: [
      { b: 'AtomS3R', s: 'runs the ruler on its ESP32-S3, and its 0.85-inch screen is also its button.' },
      { b: 'Atomic Battery Base', s: 'holds the battery, so the ruler needs no cable.' },
      { b: 'Unit Scroll', s: 'is the wheel you roll, with a push button and an RGB LED, and it plugs into the AtomS3R’s Grove port.' },
    ],
    photoAlt: 'The ruler held up after the second run, its screen reading 8.2 cm, above the ruler it rolled along',
    photoCaption: 'After the second run in the demo',
  },
  setup: {
    h: 'Setting one up',
    steps: [
      <>Stack the AtomS3R on the Atomic Battery Base and plug the Unit Scroll into the AtomS3R’s Grove port.</>,
      <>Open <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Scroll Wheel Ruler</b>, plug the AtomS3R in over USB-C and press <b>Install</b>, which flashes the firmware straight from the browser.</>,
      <>It starts on the calibration screen, so press the wheel and roll it exactly 10 cm along a ruler, then release it and tap the screen to save.</>,
    ],
    repo: <>The <a href="https://github.com/New-Kringster/AtomS3R_ScrollWheelRuler" target="_blank" rel="noopener">GitHub repository</a> has the firmware’s code, its unit tests and a download of the firmware image for flashing with esptool instead.</>,
    note: <>The AtomS3R on this page is rendered from M5Stack’s own model in <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT licence, copyright M5Stack), and its screens are drawn from the firmware’s own layout.</>,
  },
};
export type ScrollRulerCopy = typeof en;
export default en;
