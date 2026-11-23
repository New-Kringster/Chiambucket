/* The Stack-chan LiDAR article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The embed (../embed) always uses this English copy, since other sites put it in their own pages. */
const en = {
  meta: {
    title: 'Stack-chan LiDAR | Braven Chiam',
    description: 'A LiDAR made from M5Stack’s Stack-chan, which sweeps four Unit ToF4M distance sensors across a room with its servos, colours the points with its camera and shows the scan in 3D in any browser.',
    ogDescription: 'Stack-chan sweeps four distance sensors across a room and turns the readings into a coloured 3D scan you can explore.',
  },
  ld: {
    headline: 'Stack-chan LiDAR',
    about: ['M5Stack Stack-chan', 'M5Stack CoreS3', 'Unit ToF4M', 'VL53L1X', 'point cloud', '3D scanning', 'ESP32-S3'],
  },
  /** the chapter dots on the right, by section id */
  chapters: { top: 'Stack-chan LiDAR', sweep: 'The sweep', colour: 'Colour', demo: 'Demo', play: 'Try the scan', setup: 'Make one' },
  chaptersLabel: 'Chapters',
  hero: {
    alt: 'Stack-chan drawn from M5Stack\'s models, with four Unit ToF4M sensors in a square on top of its head',
    back: 'Back to projects',
    tag: 'Internship project',
    featured: 'Featured',
    title: 'Stack-chan LiDAR',
    lead: 'I turned Stack-chan into a LiDAR by putting four distance sensors on its head and letting its servos sweep them across a room. Its camera colours the points, and any browser on the same Wi-Fi shows the scan in 3D as it builds.',
    builtWith: 'Built with',
    /** the key link: Flashdeck */
    flash: 'Flash the firmware',
    meta: 'Internship project at M5Stack, November 2026. Stack-chan (CoreS3), PaHub, four Unit ToF4M, C++ and WebGL.',
    cue: 'Scroll to run a scan',
  },
  sweep: {
    alt: 'Over Stack-chan\'s shoulder, its sensor cone reaching the wall while the scan fills in around the room',
    /** the chapter's two captions, in order */
    caps: [
      { title: 'Sweeping the room', p: 'Stack-chan turns its head across the room a few degrees at a time and stops at every step to measure how far away the wall is. The servos give the direction and the sensors give the distance, so every step adds a point in 3D. This is the real scan from the demo, filling in as the head pans across.' },
      { title: 'Quick, Normal or Fine', p: 'Before a scan I pick Quick, Normal or Fine. Quick is done in under a minute, and Fine takes longer but picks up much more detail.' },
    ],
  },
  colour: {
    alt: 'The finished scan from outside the room in the camera\'s colours',
    caps: [
      { title: 'Colour from its camera', p: 'Before it sweeps, Stack-chan takes photos of the area with the CoreS3’s camera. The browser then places every pixel of those photos at the distance the sensors measured in that direction, which turns a grid of readings into 68,206 coloured points.' },
      { title: 'Lining up the photos', p: 'The camera sits below the sensors, so the photos and the distances are taken from slightly different places. I lined them up by matching the edges in the depth to the edges in the photos, and the colours now land in the right place on most of the room, though not everywhere.' },
    ],
  },
  demo: {
    h: 'Demo',
    p: 'I put Stack-chan on a table in the corner of an empty room and started a scan from my laptop. The video shows the head sweeping while the points build up in the browser, and then the finished scan from every side, first coloured by distance and then by the camera.',
    video: 'Stack-chan sweeping a room corner with the point cloud growing in the browser, then the finished scan in depth and photo colour',
    /** the four moment cards, in time order */
    moments: [
      { label: 'The sweep', note: 'The head works across the corner while the points fill in' },
      { label: 'The finished scan', note: 'The walls and ceiling of the corner, seen from outside' },
      { label: 'Depth', note: 'Each point coloured by how far away it is' },
      { label: 'Photo colour', note: 'The same points coloured by Stack-chan’s photos' },
    ],
  },
  play: {
    h: 'Try the scan',
    stillAlt: 'The finished scan from above: the walls and ceiling of a room corner, with a blue box on the table',
  },
  /** the playground's controls and messages (PlyPlayground); {n} is a point count, {size} the scan's size in metres */
  pg: {
    view: 'A 3D point cloud of the room Stack-chan scanned. Drag to turn it, scroll or pinch to zoom, right-drag to move it, and double-click a spot to fly to it.',
    loading: 'Loading the scan',
    hintTouch: 'Drag to turn it and pinch to zoom',
    hintMouse: 'Drag to turn it, scroll to zoom and right-drag to move it',
    drop: 'Drop a .ply file to open it',
    stat: '{n} points, {size} m',
    colourBy: 'Colour the points by',
    /** the colour switch: by the camera's photos, by distance, by height */
    modes: ['Photo', 'Depth', 'Height'],
    eyeTitle: 'See it from Stack-chan\'s head',
    eye: 'See it from Stack-chan’s head',
    reset: 'Back to the starting view',
    full: 'Full screen',
    leaveFull: 'Leave full screen',
    open: 'Open your own .ply',
    upY: 'Y is up in this file',
    back: 'Back to Stack-chan’s scan',
    download: 'Download this scan',
    /** why a dropped file could not be shown, by plyViewer's error code */
    errors: {
      notPly: 'This file does not look like a .ply point cloud.',
      lists: 'Lists in the vertex data are not supported; export only the points.',
      noXyz: 'No x, y and z found in this .ply.',
      short: 'This .ply ends before all its points.',
      unreadable: 'That file could not be read.',
    },
  },
  setup: {
    h: 'Make one',
    parts: [
      <><a href="https://docs.m5stack.com/en/StackChan" target="_blank" rel="noopener">Stack-chan</a>, M5Stack&rsquo;s little robot, which has a CoreS3 for a head on two servos. Its ESP32-S3 runs the scan, the web server and the camera.</>,
      <>Four <a href="https://docs.m5stack.com/en/unit/Unit-ToF4M" target="_blank" rel="noopener">Unit ToF4M</a>, which are VL53L1X time-of-flight distance sensors, mounted in a square on top of the head.</>,
      <>A <a href="https://docs.m5stack.com/en/unit/pahub2" target="_blank" rel="noopener">PaHub</a>, which lets the four sensors share one Grove port even though they all have the same I2C address.</>,
    ],
    photoAlt: 'The real Stack-chan with the four sensors on its head and their Grove cables looping down to the back',
    photoCaption: 'The real Stack-chan with its sensors',
    steps: [
      <>Plug a PaHub into Stack-chan&rsquo;s Port A and the four Unit ToF4M into its channels 0 to 3, then mount the sensors on top of the head facing forward.</>,
      <>Open <a href="https://flashdeck.shebang.pro/" target="_blank" rel="noopener">Flashdeck</a> in Chrome or Edge, choose <b>Stack-chan LiDAR</b>, plug Stack-chan in over USB-C and press Install.</>,
      <>Join the <b>StackChan-LiDAR</b> Wi-Fi network it starts and open <b>http://192.168.4.1/</b>, which Stack-chan also shows when you tap its face. Then pick an area and a level of detail and start a scan.</>,
    ],
    note: 'The Stack-chan on this page is built from M5Stack’s own 3D models (M5_Hardware, MIT licence).',
  },
};

export type LidarCopy = typeof en;
export default en;
