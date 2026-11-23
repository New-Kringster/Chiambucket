/* The EMA Smart Home article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The code keeps the images, ids, URLs and the team members' names; the PDFs themselves stay English. */
const en = {
  meta: {
    title: 'EMA Smart Home | Braven Chiam',
    description: 'A smart home system my school team of five built and got an A for. Four BeagleBone Black Wireless nodes look after the climate, the bathroom, the kitchen and the door, and a SocketIO web server links them and hosts a live dashboard with a Spline 3D view.',
  },
  ld: { headline: 'EMA Smart Home' },
  hero: {
    alt: 'EMA Smart Home',
    back: 'Back to projects',
    tag: 'School project, team of five',
    title: <>EMA Smart <em>Home</em></>,
    lead: 'This is a smart home system built on four BeagleBone Black Wireless boards to cut the energy a home uses. It was the most complex group project I have worked on and drew on several of our courses, and we got an A for it.',
    builtWith: 'Built with',
    /** the key links */
    links: { demo: 'Live demo', github: 'GitHub', video: 'Promo video' },
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    PromoVideo: 'Video', Team: 'Team', ProjBackground: 'Brief', DesignProcess: 'Dashboard',
    Climate: 'Climate node', Bathroom: 'Bathroom node', Kitchen: 'Kitchen node', Intrusion: 'Intrusion node',
    Connectivity: 'Connectivity', SlideDeck: 'Slide deck', Documentation: 'Documentation',
  },
  video: { h: 'Video', title: 'EMA Smart Home promotional video' },
  team: {
    h: 'Team',
    /** each member's part, in the order of the team rows (the names stay in the code) */
    roles: ['Team lead, docs, code', 'Art, code, design', 'Docs, code', 'Docs, code', 'Team member'],
    /** my own row; {name} is my name */
    me: '{name} (me)',
    profile: 'Profile',
    noProfile: 'No profile',
  },
  brief: {
    h: 'Brief',
    p: 'We were given four BeagleBone Black Wireless boards and a set of MikroBUS click modules, and asked to build a Wi-Fi connected system that supports sustainable living. We built a smart home system that monitors energy use in real time and switches devices to cut consumption, then added an intrusion-detection node.',
    alt: 'Where each board sits in the home',
    caption: 'Where each board sits in the home',
  },
  dashboard: {
    h: 'Dashboard',
    p: <>Most of the project was software, so the design work went into making the dashboard clear, readable and quick to take in. We also added a Spline 3D model of the home that shows each action as it happens, and you can try it yourself in the <a href="https://csdpdemo.chiambucket.com" target="_blank" rel="noopener">live demo</a>.</>,
    mockAlt: 'Figma mockup of the dashboard',
    mockCaption: 'Figma mockup of the dashboard',
    finishedCaption: 'The finished dashboard',
    splineCaption: 'The Spline 3D view showing actions live',
  },
  /** the four node chapters, by section id */
  nodes: {
    Climate: {
      h: 'Climate node',
      p: 'The climate node monitors the temperature, the humidity and whether someone is in the room, and it turns the fan on only when a person is detected and the room is warm and humid.',
      alt: 'Climate node hardware',
    },
    Bathroom: {
      h: 'Bathroom node',
      p: 'You set how long you want to shower for with the buttons and display. The timer starts when the node detects you entering the shower, and a buzzer sounds when the time is up.',
      alt: 'Bathroom node hardware',
    },
    Kitchen: {
      h: 'Kitchen node',
      p: 'The kitchen node monitors the fridge’s energy use and reports an energy score to the dashboard. It also works as the fire alarm, so if it detects an uncontrolled fire, the alarm sounds on every node.',
      alt: 'Kitchen node hardware',
    },
    Intrusion: {
      h: 'Intrusion node',
      p: 'The intrusion node detects knocks on the door and the door opening at unusual times, and when either happens it sounds an alarm on every node.',
      alt: 'Intrusion node hardware',
    },
  },
  connectivity: {
    h: 'Connectivity',
    p: [
      'Each board connects to a SocketIO web server, which hosts the dashboard and coordinates events and alarms between the nodes.',
      'The map below shows the four nodes and the server. Select a node to see what it does, or simulate a kitchen fire to see the alarm reach every node.',
    ],
    diagramAlt: 'Diagram of how the nodes, server and dashboard connect',
    diagramCaption: 'How the nodes, server and dashboard connect',
    repoTitle: 'Source on GitHub',
    repoText: 'The repository holds the code for each node and for the SocketIO server that hosts the dashboard.',
    repoButton: 'View the code on GitHub',
  },
  slides: { h: 'Slide deck', title: 'EMA Smart Home slide deck (PDF)', open: 'Open the slide deck (PDF)' },
  docs: { h: 'Documentation', title: 'EMA Smart Home documentation (PDF)', open: 'Open the documentation (PDF)' },

  /** the home map widget (NodeMap); {name} is a node's name */
  nodeMap: {
    /** the four nodes, by id; facts from the write-up and the project README */
    nodes: {
      climate: {
        name: 'Climate',
        short: 'Fan control',
        does: 'It turns the fan on only when someone is in the room and the air is warm and humid.',
        hardware: 'BME680 temperature and humidity sensor, PIR presence sensor, 8x8 LED matrix, buzzer',
        alarm: 'It sounds whenever any node raises the alarm',
      },
      bathroom: {
        name: 'Bathroom',
        short: 'Shower timer',
        does: 'It times your shower to the length you set with the buttons, starting when you walk in.',
        hardware: 'PIR sensor, OLED display, capacitive buttons, buzzer',
        alarm: 'It plays three tones when the time is up',
      },
      kitchen: {
        name: 'Kitchen',
        short: 'Energy and fire',
        does: 'It reports the fridge’s energy use to the dashboard as a score and watches for fire.',
        hardware: 'Analog current sensor, Flame Click, OLED display, buzzer',
        alarm: 'A fire sets off the alarm on every node',
      },
      intrusion: {
        name: 'Intrusion',
        short: 'Door security',
        does: 'It watches the door for knocks and for the door opening at unusual times.',
        hardware: 'Reed switch on the door, vibration sensor for knocks, buzzer',
        alarm: 'Either event sets off the alarm on every node',
      },
    },
    hub: { label: 'Web server', idle: 'SocketIO, hosts the dashboard', alarm: 'Alarm sent to all nodes' },
    /** a node button's aria-label, quiet and sounding */
    nodeAria: '{name} node',
    nodeAriaAlarm: '{name} node, alarm sounding',
    /** a sounding node's tag */
    alarmTag: 'Alarm',
    caption: 'Each line is a SocketIO link, and the dots are readings on their way to the server.',
    eyebrow: { pinned: 'Selected node', idle: 'Select a node' },
    tabsAria: 'Sensor nodes',
    cardTitle: '{name} node',
    terms: { does: 'Does', hardware: 'Hardware', buzzer: 'Buzzer' },
    /** the detail card's status line: connected, then the three steps of the fire drill */
    status: {
      idle: 'Connected and sending readings to the server',
      arming: 'The kitchen sees a flame and its buzzer sounds',
      travelling: 'Alarm on its way to the server',
      received: 'The server broadcasts the alarm and every node sounds',
    },
    sim: { run: 'Simulate a kitchen fire', busy: 'Alarm running' },
    hint: 'When the kitchen node detects a flame, the server receives the alarm and sends it on to every node.',
  },
};

export type CsdpCopy = typeof en;
export default en;
