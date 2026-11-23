/* The Pip article's words in English. Other languages fill the same shape (./<lang>.tsx).
   Text drawn on the Tab5 itself (the 3D scene, the screenshots and clips) is the tablet's own UI, so it is not here. */
const en = {
  meta: {
    title: 'Pip, a desk pet with an agent for a brain | Braven Chiam',
    /** Open Graph and the card's title */
    ogTitle: 'Pip, a desk pet with an agent for a brain',
    description: 'Pip is a desk pet on an M5Stack Tab5 whose brain is the DeepSeek Harness on my server. It sleeps, wakes, thinks and hops, drives a browser with its own cursor, builds its own apps, and steers my other agent sessions.',
  },
  ld: {
    headline: 'Pip: a desk pet on an M5Stack Tab5 with the DeepSeek Harness for a brain',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'AI agents', 'desk pet'],
  },
  /** the desktop dots at the foot of the screen, by chapter id */
  chapters: { meet: 'Meet Pip', canvas: 'The screen', applets: 'Applets', desktops: 'Desktops', crew: 'The crew', inside: 'How it works' },
  /** the moving parts' own labels (PipFx) */
  ui: {
    chapters: 'Chapters',
    heroStage: 'Pip on the M5Stack Tab5, then Meet Pip',
    moods: "Pip's moods",
    nextStep: 'Next step',
    steps: 'Steps',
    deck: 'Eight of my Pips',
    carousel: 'carousel',
    prevPip: 'Previous Pip',
    nextPip: 'Next Pip',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip is a desk pet that runs from DeepSeek Harness (DSH). It can browse the web, build and test its own apps, control other agents through the MCP connector and much more. Pip’s interface runs on an M5Stack Tab5.',
    meet: 'Meet Pip',
    m5: 'Read on M5Stack',
    m5Off: 'Not published yet',
    meta: 'Internship project at M5Stack, November 2026. ESP32-P4, C++, Lua, Node, Python, Docker.',
  },

  /* ── 1. Meet Pip ── */
  meet: {
    title: 'Meet Pip',
    slotLabel: 'Mopi, a cyan cloud in glasses',
    lede: "It's ready to help whenever you are, just pick it up and push to talk.",
  },
  /** Pip's moods, in order: the name, the line under the clip, and the clip's label */
  moods: {
    asleep: { name: 'Asleep', line: 'If you leave it alone for a minute, it dims the screen and dozes off.', label: 'Pip asleep' },
    wake: { name: 'Awake', line: 'It wakes with a stretch when you pick the tablet up or tap it, or when a reply arrives.', label: 'Pip awake' },
    listen: { name: 'Listening', line: 'Hold the screen to talk, and it leans in with a hand to its ear.', label: 'Pip listening' },
    think: { name: 'Thinking', line: 'While it works, it twists around and rubs its temples, and sometimes it gets an idea.', label: 'Pip thinking' },
    happy: { name: 'Happy', line: 'It hops whenever something works out.', label: 'Pip happy' },
    talk: { name: 'Talking', line: 'Its reply appears with a soft chime in a bubble beside it, just under what it heard you say.', label: 'Pip talking' },
  },
  props: {
    title: 'Each expression is a different action',
    label: 'Pips with a magnifying glass, binoculars, a megaphone and a paper plane',
    p: 'Pip picks up a different prop for each job, so you can tell what it is doing at a glance: a magnifying glass when it searches the web, binoculars when it reads a page, a megaphone when it briefs a subagent and a paper plane when it messages another Pip.',
  },
  desk: {
    title: 'It lives on my desk',
    alt: 'The M5Stack Tab5 on its keyboard on my desk, with Mopi, a cyan cloud in glasses, on its home screen',
    p: 'Pip runs on an M5Stack Tab5 clipped to its keyboard on my desk. This is Mopi, the Pip on my first desktop, which waits on the home screen until I need it.',
  },

  /* ── 2. The screen ── */
  canvas: {
    title: 'The screen',
    pipLabel: 'A violet Pip in a beret looking through binoculars',
    lede: 'Markdown, interactive web browsers, drawings, questions and more.',
  },
  cursor: {
    title: 'Browser use capabilities',
    win: 'The page Pip is driving',
    label: 'Pip\'s cursor gliding over a YouTube video, turning on captions and setting the speed to 1.5x',
    p: 'When I ask for a video with captions on, Pip opens it, moves its cursor to the captions button and then sets the speed from the gear menu. The browser itself runs on my server, while the tablet shows the same page with Pip watching beside it.',
  },
  point: {
    title: 'It points things out',
    label: 'An unlabelled animal cell diagram on the Tab5: Pip circles the two mitochondria with a Mitochondria note, then draws an arrow labelled Nucleus into the nucleus',
    p: 'This comes in handy for studying. I put up an unlabelled diagram of an animal cell and asked Pip to circle the mitochondria and then show me the nucleus. Because Pip can take a screenshot and look at it, it finds the parts in the picture by itself before drawing the circles, the arrow and the note over the diagram.',
  },
  markdown: {
    title: 'Answers you can read',
    alt: 'A formatted reply on the Tab5: a bold title, a list with bold leads, and a line in the talk bubble',
    p: 'Longer answers open as formatted text in a pane, while the short version stays in the bubble next to Pip.',
  },
  question: {
    title: 'It asks before it guesses',
    alt: 'A multiple choice question from Pip on the Tab5: which part of the cell to point at first, with three options, Type an answer and Skip',
    p: 'When Pip needs me to decide something, it puts up a question, and I can answer by tapping an option, typing on the keyboard or holding Pip and saying it.',
  },
  /** the four touch cells, by kind */
  touches: {
    tap: { title: 'Taps', text: 'Each tap shows as a blue dot, which turns into a green ring once the page reacts.', alt: 'A touch on the round help button of the M5Stack Tab5 page: a blue dot, then a green ring' },
    drag: { title: 'Drags', text: 'A drag leaves a blue line behind your finger as the page scrolls.', alt: 'A touch dragging down the M5Stack Tab5 page, leaving a blue line' },
    expand: { title: 'Expanding a pane', text: 'Tap Expand on any pane and it grows to fill the screen.', alt: 'A touch on Expand on a pane, which grows to the full screen' },
    back: { title: 'Going back', text: 'Swipe from left to right to go back, wherever you are.', alt: 'A touch swiping from left to right, sliding the screen back to the one before' },
  },

  /* ── 3. Applets ── */
  applets: {
    title: 'Applets',
    pipLabel: 'A pink Pip in headphones typing on a laptop',
    lede: 'Pip can build native apps in Lua or stream web apps from the DSH host.',
  },
  drawer: {
    title: 'App Drawer',
    label: 'The applet drawer rising, the NCIR Thermometer info card, then the app launching and reading a sensor',
    p: 'Pulling up on the handle opens the app drawer, where the apps Pip makes are saved. Native apps are written in Lua and run smoothly on the tablet itself, while container apps are web apps that run in Docker on the DSH host and stream to the Tab5. Because they run on the server, container apps can do much more, such as multiplayer games on your local network or even a video call.',
  },
  web: {
    macAlt: 'A MacBook showing the Intercom in a browser: the Tab5\'s camera view of me fills the window, with my own Mac camera preview beside it',
    tabAlt: 'The Intercom web applet on the Tab5 during the same call: my face from the Mac\'s camera fills the screen, a TALK button at the bottom and the tablet\'s own camera view in the corner',
    caption: <><b>Web applets</b> are pages Pip writes and serves from my server, but they can still use the tablet&rsquo;s camera, mics and speaker. This is the Intercom, a video call applet Pip built, during a real call, so the Tab5 shows me through my Mac&rsquo;s camera while the browser on my Mac shows me through the tablet&rsquo;s.</>,
  },
  native: {
    alt: 'The native NCIR Thermometer applet showing the object and ambient temperature with a trend graph',
    caption: <><b>Native applets</b> are Lua scripts that Pip sends to the tablet on the fly, so they run on the tablet itself at full speed.</>,
  },
  built: {
    title: 'Built by Pip',
    label: 'A game of Tic-Tac-Toe on the Tab5, X wins along the diagonal',
    caption: 'Tic-Tac-Toe, another app Pip built, being played on the tablet',
    /** how long Pip took, and what it built */
    list: [
      { time: '106 s', what: 'a pomodoro timer' },
      { time: '5 min', what: 'a reaction game in Lua, tested on the tablet' },
      { time: '8 min', what: 'a bubble level from the IMU' },
      { time: '32 min', what: 'a webcam intercom with a browser on the other end' },
    ],
  },
  devring: {
    title: 'Hands off while it tests',
    label: 'A red border round the screen while a tester subagent taps a counter app: 0, 1, 2, 3, then back to 2',
    p: 'A red border goes around the screen whenever a subagent is building or testing an app on it, so I know to keep my hands off. In this clip, a tester subagent taps through a counter app that a coder subagent has just written, counting up to 3 and back down to 2.',
  },

  /* ── 4. Desktops ── */
  desktops: {
    title: 'Desktops',
    pipLabel: 'A lime Pip in a party hat throwing a paper plane',
    lede: 'Every conversation gets its own desktop, with its own Pip and colour.',
  },
  switch: {
    title: 'Pull down to switch',
    label: 'On Mopi\'s desktop the pill at the top is pulled down into the spotlight bar, slides to Fizz\'s chip and lets go, and Fizz\'s desktop arrives; then the same from Fizz to Wavo',
    p: 'Pulling down the pill at the top of the screen opens the spotlight bar, which has a chip for every desktop. When you slide to one and let go, that desktop comes up with its own Pip, picture and work. In this clip I switch from Mopi to Fizz and then to Wavo.',
  },
  newpip: {
    title: 'Every Pip makes itself up',
    p: 'Each new desktop starts as an egg, and its Pip makes up a personality, a name, a body, a hat and a home picture to match before it hatches. Tapping its name opens the card it wrote about itself, and these are eight of mine.',
  },
  /** a new desktop, step by step, in order */
  hatch: [
    { alt: 'The spotlight bar pulled down on Wavo\'s desktop, dragged past the last chip until a plus springs out; let go, and a new desktop arrives with an egg', caption: 'Drag past the last chip for a new desktop' },
    { alt: 'Riva, a gold heart in a crown, hatched, with her first line in a bubble', caption: 'The egg hatches and the Pip says its first line' },
    { alt: "Riva's card on the Tab5, written by her: a swaggering golden rival, theatrical, competitive and loyal, with her catchphrase, likes and dislikes", caption: 'Tap its name for the card it wrote' },
  ],
  /** eight real Pips, from their own cards, by id */
  pips: {
    mopi: { name: 'Mopi', look: 'a cyan cloud in glasses', vibe: 'A drowsy little philosopher who treats napping and wondering as equally serious work.', says: 'Ask me after my nap.' },
    poco: { name: 'Poco', look: 'a violet bean in a scarf', vibe: 'A squeaky miniature ranch-hand who treats every tiny task like a frontier adventure.', says: "Let's wrangle it!" },
    fizz: { name: 'Fizz', look: 'a pink gumdrop in a party hat', vibe: 'A pink gumdrop gremlin who turns every tiny mess into a game, then cheerfully tidies it up.', says: 'Chaos first, tidy after!' },
    wavo: { name: 'Wavo', look: 'a lime drop in sunglasses', vibe: 'A laid-back surf-mathematician who solves equations in wet sand between sets.', says: 'Ride the cosine, dude.' },
    quib: { name: 'Quib', look: 'a cyan bean in glasses', vibe: "A tiny, grumpy librarian who guards the tablet's books and secretly likes company.", says: 'Shh. Books first, feelings later.' },
    doughby: { name: 'Doughby', look: 'a violet gumdrop in a party hat', vibe: 'A pun-obsessed baker who treats every conversation like a fresh batch of jokes.', says: 'Nice to whisk you!' },
    blooma: { name: 'Blooma', look: 'a pink drop with a flower', vibe: 'A gentle zen gardener who turns tiny moments into little seasons of calm.', says: 'Grow soft, stay curious.' },
    bzzt: { name: 'Bzzt', look: 'a lime cloud with an antenna', vibe: 'A deadpan little robot comic who is earnestly learning what a joke is, one flat punchline at a time.', says: 'That was a joke. Laugh.' },
  },
  ask: {
    title: 'Ask Pip from anywhere',
    label: 'The spotlight bar pulled down over Riva\'s home screen, the question What\'s a good name for a cactus? typed and sent, then Riva\'s reply: Prickly Pete, Spike Lee or Sir Pokes-A-Lot',
    p: 'You can also talk to Pip from the spotlight bar on any screen, by pulling it down or pressing Ctrl+Space and then typing or speaking. Here I ask Riva to name a cactus.',
  },
  control: {
    title: 'A control centre',
    label: 'The control centre dropping down over the thermometer app, then its settings page',
    p: 'Pulling down from the top right opens the control centre, which has brightness, volume, the mic and camera and a button to exit the applet, and the full settings are one more tap away.',
  },

  /* ── 5. The crew ── */
  crew: {
    title: 'The crew',
    pipLabel: 'A gold heart Pip in a crown shouting through a megaphone',
    lede: 'Pip hands long jobs to subagents, so it can keep talking to me.',
  },
  subagents: {
    title: 'Subagents at work',
    label: 'Five subagent pips at work: writing, typing, stacking blocks, reading and mixing a flask',
    p: 'Each subagent gets a job and a prop to match it, such as a notepad, a laptop, blocks, a book or a bubbling flask. While they work, a small busy Pip sits on the home screen, and tapping it opens the crew card, where each of them says what it is up to.',
  },
  crewHome: {
    alt: 'The crew card open on Zesto\'s home screen: three subagents, Researcher, Scout and Writer, each with a short thought',
    caption: 'The crew card with three subagents at work',
  },
  tasks: {
    title: 'Long jobs get a list',
    alt: 'A finished three step task list on Fizz\'s home screen: design and write the native Lua app, test it on the tablet, open it on the desktop',
    p: 'Pip turns a long job into a task list on the home screen and hands each step to a subagent, such as a scout, a writer or a tester, which ticks it off when it is done.',
  },
  kimi: {
    title: 'It watches my other agents',
    /** the three steps, in order */
    steps: [
      { alt: 'The crew card with two at work: Zesto and Kimi, an outside agent, typing', caption: 'Kimi joins the crew' },
      { alt: 'A card on the Tab5: Kimi wants to write, with Approve once, Approve for this session and Reject', caption: 'It asks before it writes' },
      { alt: 'Pip\'s reply on the Tab5: Kimi shipped it, the file is in the workspace and reads hello from Kimi', caption: 'Pip reports back' },
    ],
    p: 'Because Pip lives in the same harness as my coding sessions, it can see which ones are running, finished, stuck on a question or broken, and it can bring in agents from other providers too. Here it hands a job to Kimi Code on my server, so Kimi joins the crew card, its request to write a file comes to the tablet for me to approve, and Pip reports back once it is done.',
  },

  /* ── 6. How it works ── */
  inside: {
    title: 'How it works',
    pipLabel: 'An orange Pip in glasses thinking, until a light bulb lights up',
    lede: 'The tablet is only the face, and all the thinking happens on my server.',
  },
  /** the request's path (Parts.tsx Flow): the three boxes by id, the two links between them */
  flow: {
    label: 'How a request travels: the Tab5 talks to a bridge on the VM, the bridge talks to the DeepSeek Harness',
    nodes: {
      tab: { title: 'Tab5', where: 'On my desk', items: ['Pip, drawn on the tablet', 'Touch, keyboard, mics', 'Camera, IMU, speaker', 'Native applets in Lua'] },
      bridge: { title: 'Pet bridge', where: 'On the VM', items: ['Speech to text, on the VM', 'The tablet’s hardware, as an API', 'Pages for applets'] },
      dsh: { title: 'DeepSeek Harness', where: 'On the VM', items: ['Pip, a session with its own persona', 'Subagents that do the long jobs', 'A browser Pip can see and click', 'Applets in Docker'] },
    },
    links: [
      { out: 'voice, taps, keys', back: 'frames, replies, scripts' },
      { out: 'your words, as Pip', back: 'replies, pages, apps' },
    ],
    caption: 'The tablet draws Pip and the screen, and it talks over Wi-Fi to a small Ubuntu VM on my desk, where everything else runs.',
  },
  hw: {
    working: 'On the Tab5, working',
    workingList: ['Touch', 'Camera', 'Microphones', 'Speaker', 'IMU', 'I2C', 'Keyboard'],
    unchecked: 'Not checked yet',
    uncheckedList: ['USB', 'Headphone jack', 'Wi-Fi as a feature', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: 'Still in progress',
    p: 'Pip is still being built and changes most weeks, so instructions for deploying your own will be added here later.',
  },
  credit: <>The Tab5 in 3D at the top of this page is built on M5Stack&rsquo;s own Tab5 structure model from <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> (MIT licence, copyright M5Stack), with the glass, screen and back added. Pip&rsquo;s animations are rendered from the firmware&rsquo;s own drawing code, and the screenshots and clips come from the tablet&rsquo;s screen. The gesture clips were recorded with the tablet slowed down, so Pip moves a little fast in them.</>,
};

export type PipCopy = typeof en;
export default en;
