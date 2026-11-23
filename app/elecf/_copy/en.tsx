/* The ELEC-F article's English words. Every other language fills the same shape (./<lang>.tsx).
   The code keeps the images, ids, hrefs, the team's names and the tool icons' product names;
   text for a list is keyed by the id it belongs to. */
const en = {
  meta: {
    title: 'ELEC-F | Braven Chiam',
    description: 'ELEC-F is a safe freezer storage system my team of four built, in which two M5Stack Fire controllers with ToF, PIR and RGB units sound an alarm when someone is shut inside a walk-in freezer for too long.',
    ogDescription: 'A freezer safety system on M5Stack that watches the door with a ToF sensor and the room with a PIR sensor, and raises the alarm with an RGB light and a buzzer.',
  },
  /** the prose in the page's JSON-LD (its description is meta.description) */
  ld: { headline: 'Elec-F: Safe Freezer Storage System' },
  hero: {
    alt: 'The ELEC-F cardboard freezer prototype with M5Stack and sensors',
    back: 'Back to projects',
    tags: { school: 'School project', team: 'Team of 4' },
    key: 'ELEC-F',
    title: <>Safe Freezer <em>Storage</em> System</>,
    lead: 'ELEC-F is a safe freezer storage system my team of four built for an engineering course. It watches a walk-in freezer’s door and the room inside, and sounds an alarm if someone is shut in for too long.',
    builtWith: 'Built with',
    /** the key links: GitHub, the demo video */
    links: ['GitHub', 'Demo video'],
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    Demo: 'Demo', Problem: 'The problem', Objective: 'Goals', HowItWorks: 'How it works',
    Hardware: 'Hardware', Logic: 'Logic', Build: 'Prototype', Team: 'Team',
  },
  demo: { h: 'Demo', video: 'ELEC-F demo video' },
  problem: {
    h: 'The problem',
    p1: 'As factories fill up with automation, safety has to keep up, and one risk that often gets overlooked is the walk-in freezer, where a worker can be trapped inside.',
    howH: 'How it happens',
    how: [
      'The door can fail, because worn latches jam, moisture freezes the seals shut and emergency releases can be broken, missing or frozen over.',
      'Nobody may realise a person is still inside, and experienced workers can get careless.',
    ],
    whyH: 'Why it is dangerous',
    why: [
      'The cold causes hypothermia, which brings on confusion and then unconsciousness.',
      'A sealed freezer can run low on oxygen, which can lead to asphyxiation.',
      'Panic and attempts to escape lead to falls and other injuries.',
      'Without a timely rescue, being trapped for a long time can be fatal.',
    ],
    p2: 'Being trapped also causes panic, especially for people with cleithrophobia, the fear of being unable to escape. ELEC-F is meant to shorten the time someone is stuck and let them know help is coming.',
  },
  goals: {
    h: 'Goals',
    items: [
      'Stop workers from being stuck inside a factory freezer.',
      'Keep in contact with anyone who does get trapped and reassure them.',
      'Work reliably in a cold, damp, sealed room.',
    ],
  },
  how: {
    h: 'How it works',
    p1: 'While the door is open, you set a time limit on the M5Stack, and closing the door starts the timer. If the timer runs out while someone is still inside, the alarm goes off.',
    partsIntro: 'The system has four parts that run together:',
    parts: [
      <>The <b>timer</b> is set on the M5Stack while the door is open and starts when the door closes.</>,
      <>The <b>door sensor</b> is a time-of-flight (ToF) sensor that measures distance to tell whether the door is open or closed.</>,
      <>The <b>presence sensor</b> is a PIR sensor that detects body heat and movement to tell whether someone is still in the room.</>,
      <>The <b>alarm</b> flashes the RGB unit and sounds the buzzer if the door stays closed past the limit with someone inside.</>,
    ],
    p2: 'We chose ToF and PIR sensors because both keep working below freezing.',
  },
  /** the door-timer widget (SafetySequence); {n} is the step number, {total} the number of steps */
  seq: {
    steps: {
      open: {
        label: 'Door open',
        title: 'Set the timer',
        desc: 'When a worker walks in, the PIR sensor picks up their body heat and movement and the ToF sensor reads the door as open. You then set on the M5Stack how long the door may stay shut.',
        alt: 'The M5Stack screen during step 1, set the timer',
        pir: 'Person inside',
        tof: 'Door open',
      },
      armed: {
        label: 'Door closed',
        title: 'Timer running',
        desc: 'When the door shuts, the ToF sensor reads it as closed and the timer starts, but if the room empties before the time runs out, the system resets.',
        alt: 'The M5Stack screen during step 2, timer running',
        pir: 'Person inside',
        tof: 'Door closed',
      },
      alarm: {
        label: 'Time up',
        title: 'Alarm',
        desc: 'If the time runs out with someone still inside, the RGB unit flashes and the M5Stack buzzer sounds to alert anyone nearby until the door is opened.',
        alt: 'The M5Stack screen during step 3, alarm',
        pir: 'Person inside',
        tof: 'Door closed',
      },
    },
    eyebrow: 'Step {n} of {total} · {label}',
    /** the three chips' names */
    chips: { pir: 'PIR', tof: 'ToF', alert: 'Alert' },
    /** the alert chip, by alarm state */
    alert: { idle: 'Standby', armed: 'Armed', sounding: 'RGB light and buzzer' },
    /** an extra value for the PIR chip's hidden sizer, which reserves the widest chip row; the sizer
        holds the longest of this and the steps' PIR values, so it may be the longest PIR phrase */
    pirSizer: 'Presence detected',
    stepsAria: 'Steps',
    dotAria: 'Step {n}: {title}',
    prev: 'Previous step',
    nextAria: 'Next step',
    next: 'Next',
  },
  hardware: {
    h: 'Hardware',
    p: 'Everything is M5Stack, which made it quick to prototype and easy to swap modules. Two M5Stack Fire controllers run the logic and the display, and a Mini Hub unit splits the Fire’s single port so every sensor has somewhere to plug in.',
    figAlt: 'The M5Stack Fire wired to the ToF, PIR and RGB units',
    figCaption: 'The M5Stack Fire and its sensor units',
    /** the component cards, by id */
    components: {
      fire: { name: 'M5Stack Fire ×2', role: 'Controller', desc: 'It runs the timer, reads the sensors and drives the screen, and it has the buzzer built in.' },
      hub: { name: 'Mini Hub unit', role: 'Expansion', desc: 'It splits the Fire’s single port so every sensor can plug in.' },
      tof: { name: 'ToF sensor', role: 'Door state', desc: 'It measures distance to tell whether the freezer door is open or closed.' },
      pir: { name: 'PIR sensor', role: 'Presence', desc: 'It picks up body heat and movement to tell whether someone is still inside.' },
      rgb: { name: 'RGB unit', role: 'Alarm', desc: 'It flashes along with the buzzer when someone is inside past the limit.' },
    },
    wiringAlt: 'ELEC-F wiring layout',
    wiringCaption: 'How the units are wired together',
  },
  logic: {
    h: 'Logic',
    p: 'The flow chart below shows the full loop the M5Stack runs. The buttons set the time limit while the door is open, and once the door closes, the timer runs and the sensors decide what happens next.',
    flowAlt: 'ELEC-F software flow chart, from setting the timer to sounding the alarm',
    blockAlt: 'ELEC-F system block diagram',
    blockCaption: 'System block diagram',
  },
  build: {
    h: 'Prototype',
    p: 'We made the freezer and its door out of cardboard to test the sensors and the timing end to end before thinking about a proper enclosure.',
    alts: ['ELEC-F prototype with the sensors mounted', 'The door of the ELEC-F prototype'],
    posterAlt: 'The ELEC-F project poster',
    posterCaption: 'The project poster',
    repo: {
      title: 'ELEC-F on GitHub',
      text: 'The repository has the M5Stack code for the door timer, the sensor readings and the alarm.',
      button: 'View the code on GitHub',
    },
  },
  team: {
    h: 'Team',
    lead: 'Team lead',
    member: 'Team member',
    /** Braven's own row */
    me: 'Braven (me)',
    profile: 'Profile',
  },
};

export type ElecfCopy = typeof en;
export default en;
