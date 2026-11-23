/* The 3D CAD Mouse article's words in English. Other languages fill the same shape (./<lang>.tsx). */
const en = {
  meta: {
    title: '3D CAD Mouse | Braven Chiam',
    description: 'A wireless 3D mouse for Onshape made from an M5Stack Capsule. You click its button and turn it in your hand, and the model on the screen turns with it, because the Capsule passes itself off as a 3Dconnexion SpaceMouse over Bluetooth.',
    ogDescription: 'Turn an M5Stack Capsule in your hand and the model in Onshape turns with it.',
  },
  ld: {
    headline: '3D CAD Mouse',
    about: ['M5Stack Capsule', 'ESP32-S3', 'IMU', 'Bluetooth LE HID', '3D mouse', 'Onshape'],
  },
  hero: {
    alt: 'The M5Stack Capsule v1.1 standing upright, its colourful pin label facing forward and the USB-C port at the bottom',
    back: 'Back to projects',
    tag: 'Internship project',
    title: <>3D CAD <em>Mouse</em></>,
    lead: 'I turned an M5Stack Capsule into a wireless 3D mouse for Onshape. You click its button and turn it in your hand, and the model on the screen turns with it, as if you were holding the part itself.',
    builtWith: 'Built with',
    burnerTitle: 'The firmware is not on M5Burner yet',
    burner: 'Install with M5Burner',
    burnerSoon: 'Coming soon',
    meta: 'Internship project at M5Stack, November 2026. M5Stack Capsule v1.1, Bluetooth LE, C++.',
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    demo: 'Demo', try: 'Try it', use: 'How to use it', how: 'How it works',
    spacemouse: 'Passing as a SpaceMouse', turning: 'Following your hand', stopping: 'Stopping cleanly',
    hardware: 'Hardware', setup: 'Setting one up',
  },
  demo: {
    h: 'Demo',
    p: 'I filmed this at my desk with one of my enclosures open in Onshape. With rotate on, the part turns and tips as I turn the Capsule, and holding the button lets me slide the part across the screen and zoom in on its buttons.',
    video: 'Turning an orange enclosure in Onshape by turning the Capsule in my hand, then panning and zooming in on its buttons',
    /** the four moment cards, in time order */
    moments: [
      { label: 'Turning the part', note: 'Rotate is on, so the part turns and tips with my hand' },
      { label: 'Turning it over', note: 'Tipping the Capsule right over shows the underside' },
      { label: 'Sliding it across', note: 'Holding the button pans the part off to the side and back' },
      { label: 'Zooming in', note: 'Twisting while I hold it zooms in on the buttons, then back out' },
    ],
  },
  try: {
    h: 'Try it',
    p: 'This copy runs the Capsule’s button logic with your pointer standing in for your hand. The top of the Capsule is its button, so click it to turn rotate on and move the pointer over the view to turn the part, hold it to pan, and double click it to fit the part back in view.',
    note: 'The real Capsule measures how fast your hand turns, so the part turns through the same angle your hand did. Here the pointer’s movement stands in for that.',
  },
  /** the simulator's words (CadSim) */
  sim: {
    led: {
      ready: 'Green blink: connected, rotate off',
      rotate: 'Cyan: rotate on',
      pan: 'Amber: panning',
      fit: 'White flash: fit',
    },
    status: {
      demo: 'Playing a demo with rotate on. Touch the Capsule’s button to take over.',
      pan: 'Panning while you hold. Move to slide the part, and scroll to zoom, which is the twist on the real one.',
      rotate: 'Rotate is on. Move the pointer over the view and the part turns with it. Click again to stop.',
      off: 'Rotate is off. Click the button to start, hold it to pan, or double click to fit.',
    },
    viewport: 'An orange handheld enclosure in a CAD viewport, turned by the Capsule',
    button: 'The Capsule\'s button: click to toggle rotate, hold to pan, double click to fit',
    reset: 'Start over',
  },
  use: {
    h: 'How to use it',
    p1: 'You hold the Capsule upright with its label facing you and the USB port at the bottom, and its one button does everything.',
    parts: [
      { b: 'Click to rotate', s: 'A click turns rotate on, and the light turns cyan. From then on the model follows your hand until you click again. Rotate starts 0.3 seconds after the click, which is how long it waits to rule out a double click.' },
      { b: 'Hold to pan and zoom', s: 'Holding the button pauses rotate and pans instead, with the light amber. Pointing the Capsule left, right, up or down slides the model that way, and twisting it zooms. Rotate picks up again when you let go.' },
      { b: 'Double click to fit', s: 'A double click fits the whole model on the screen, and rotate stays as it was.' },
    ],
    p2: 'The light breathes blue while it waits for a computer and blinks green every few seconds once it is connected. A high tick means rotate is on and a lower one means it is off, and the Capsule switches itself off after a long time unused.',
  },
  how: {
    h: 'How it works',
    p: 'The Capsule has a gyroscope and an accelerometer in its IMU, a button and Bluetooth, which is everything a 3D mouse needs. The hard part was getting Onshape to listen to it.',
  },
  spacemouse: {
    h: 'Passing as a SpaceMouse',
    p: 'Onshape only takes 3D mouse input through the driver from 3Dconnexion, the company that makes the SpaceMouse. So the Capsule introduces itself over Bluetooth as their SpaceMouse Wireless, with that model’s IDs and the same layout for its reports, and the driver does the rest. Nothing has to be installed inside Onshape. I built the Bluetooth side on the code from an air mouse I had made earlier, which already worked with both Windows and macOS.',
  },
  turning: {
    h: 'Following your hand',
    p1: 'A real SpaceMouse reports how far you push its cap, and the driver turns that into speed. The Capsule sends how fast your hand is turning instead, from its gyroscope, so the driver turns the model through the same angle your hand turned. It feels like holding the part rather than steering it.',
    p2: 'The accelerometer only works out which way is down. That keeps the axes level however you grip the Capsule, so turning it about the vertical always spins the model about the screen’s vertical. I didn’t use it to move the model, because a position worked out from an accelerometer drifts away within a second, which is why panning comes from pointing the Capsule instead.',
  },
  stopping: {
    h: 'Stopping cleanly',
    p1: 'Pressing the button freezes the output straight away, so the jolt of your thumb and your hand coming to a stop never reach the model. While your hand moves, the Capsule sends a report 62.5 times a second, like the real SpaceMouse. When it stops, it keeps sending zeros until three have gone through, because a lost last report would leave the model spinning, and then it goes quiet.',
    p2: 'The motion maths and the button gestures sit in one library with no hardware code in it, so 19 unit tests check them on a computer before each flash.',
  },
  hardware: {
    h: 'Hardware',
    /** the parts list, in order (the first links to M5Stack's docs) */
    parts: [
      { b: 'M5Stack Capsule v1.1', s: 'is the whole thing, with nothing added. Its ESP32-S3 runs the firmware and the Bluetooth, its BMI270 IMU reads the gyroscope 200 times a second, and its RGB LED and buzzer give the feedback.' },
      { b: 'The button', s: 'on top of the Capsule does all three gestures.' },
      { b: 'A 250 mAh battery', s: 'inside keeps it wireless, and it powers itself off when it hasn’t moved for a while.' },
    ],
    holdAlt: 'Holding the Capsule in front of the monitor while the enclosure in Onshape turns with it',
    holdCaption: 'Turning the enclosure in the demo',
  },
  setup: {
    h: 'Setting one up',
    steps: [
      <>Install 3Dconnexion’s free driver, 3DxWare, on your computer. It includes the part that lets Onshape in the browser listen to a 3D mouse.</>,
      <>Flash the firmware onto a Capsule v1.1 with M5Burner. It isn’t on M5Burner yet, so this step is coming soon.</>,
      <>Open your computer’s Bluetooth settings and pair <b>Capsule CAD Mouse</b>. It chirps when it connects.</>,
      <>Open a model in Onshape, click the button and turn the Capsule.</>,
    ],
    note: 'I have only tried it in Onshape so far. Other programs that take a SpaceMouse through 3DxWare should work the same way, but I haven’t tested them yet, and I haven’t measured how long the battery lasts.',
  },
};
export type CadMouseCopy = typeof en;
export default en;
