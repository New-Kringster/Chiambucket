/* The LoRA Messenger article's English words. Every other language fills the same shape (./<lang>.tsx).
   The code keeps the images, ids, hrefs and the tool icons' product names; text for a list is keyed by
   the id it belongs to. */
const en = {
  meta: {
    title: 'LoRA Messenger | Braven Chiam',
    description: 'My first PCB, an ESP32 handheld that sends text over LoRa with no internet and does crude full-duplex voice over ESP-NOW, with a KiCAD board, a 3D-printed Onshape case and PlatformIO firmware.',
  },
  /** the prose in the page's JSON-LD (its description is meta.description) */
  ld: { headline: 'LoRA Messenger', alternativeHeadline: 'Brolocator' },
  hero: {
    alt: 'The LoRA Messenger handheld',
    back: 'Back to projects',
    tag: 'Personal project',
    title: <>LoRA <em>Messenger</em></>,
    lead: 'This was my first PCB and my first ESP32 project, a pair of handhelds that text each other over LoRa with no internet and do crude full-duplex two-way voice over ESP-NOW when they are in range. I called it Brolocator while I was building it.',
    builtWith: 'Built with',
    /** the key links: GitHub, the demo video, the Onshape model */
    links: ['GitHub', 'Demo video', '3D model'],
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    Demo: 'Demo', Functionality: 'What it does', ProjectDevelopment: 'Development', Code: 'Code',
    PCBDesign: 'PCB', threeDDesign: 'Case', Assembly: 'Assembly',
  },
  demo: { h: 'Demo', video: 'LoRA Messenger demo video' },
  features: {
    h: 'What it does',
    items: [
      'Sends text messages over LoRa across long distances',
      'Does two-way voice over ESP-NOW when the other unit is in range',
      'Runs on rechargeable LiPo batteries',
      'Has two displays',
      'Has a range-test mode',
      'Uses a simple menu UI',
    ],
    p: 'The two radios do different jobs, because LoRa reaches further but only carries short text packets, while ESP-NOW is short range but fast enough for crude two-way voice. The demo below shows both of them.',
    /** the six photos under the demo, in order */
    alts: [
      'The front of the LoRA Messenger',
      'The side of the LoRA Messenger',
      'Close-up of the displays',
      'The menu UI',
      'The messaging screen',
      'The range-test mode',
    ],
  },
  /** the two-handset radio demo (LinkDemo) */
  demoWidget: {
    /** the messages you can send, in order */
    texts: [
      'On my way, give me 10',
      'Found the trailhead',
      'Battery at 40%, heading back',
      'Camp is just past the ridge',
    ],
    /** the two radios, by id */
    radio: {
      lora: {
        label: 'Text over LoRa',
        short: 'LoRa',
        range: 'Long distance',
        carries: 'Short text packets',
        module: 'Ebyte E220-900D',
        blurb: 'LoRa reaches much further than ESP-NOW, but it only has the bandwidth for text.',
      },
      espnow: {
        label: 'Voice over ESP-NOW',
        short: 'ESP-NOW',
        range: 'Short, direct link',
        carries: 'Crude full-duplex voice',
        module: 'The ESP32 itself',
        blurb: 'ESP-NOW is a direct link between the two ESP32s, fast enough for crude two-way voice but only at short range.',
      },
    },
    /** the quote marks around a message on the handsets' screens: opening, closing */
    quote: ['“', '”'] as [string, string],
    modesAria: 'Choose a radio link',
    replay: 'Play the demo',
    you: 'You',
    friend: 'Friend',
    /** the handsets' screen status lines (shown in capitals) */
    screen: {
      pick: 'Pick a message', sending: 'Sending', delivered: 'Delivered',
      micLive: 'Mic live', holdToTalk: 'Hold to talk',
      newMessage: 'New message', receiving: 'Receiving', standingBy: 'Standing by', listening: 'Listening',
    },
    /** the label under the link between the handsets */
    link: {
      inFlight: 'Packet in flight', delivered: 'Delivered', longRange: 'Long-range link',
      streaming: 'Voice streaming both ways', direct: 'Direct peer link',
    },
    pickLabel: 'Pick a message, then send it',
    send: 'Send over LoRa',
    holdLabel: 'Press and hold to talk',
    transmitting: 'Transmitting',
    holdToTalk: 'Hold to talk',
    /** the comparison gauges' row names */
    gauge: { range: 'Range', carries: 'Carries', radio: 'Radio' },
  },
  dev: {
    h: 'Development',
    p: 'This was my first deep dive into microcontrollers and my first PCB, so I learned how to use each component with help from YouTube and ChatGPT.',
    alt: 'Breadboard prototype with the ESP32, LoRa module, I2S mic and speaker, two OLED displays, rotary encoder and buttons',
    caption: 'The breadboard prototype with an ESP32 DevKit, an Ebyte E220-900D LoRa module, an I2S mic and speaker, two I2C OLED displays, a rotary encoder and buttons',
  },
  code: {
    h: 'Code',
    p: 'I wrote the ESP32 firmware in PlatformIO, which my research pointed to as the best fit for the ESP32. The source is on GitHub, and the full PlatformIO project is below.',
    alt: 'The firmware open in PlatformIO',
    project: { title: 'PlatformIO project', text: 'This is the complete firmware project, ready to open in PlatformIO.', button: 'Download the project' },
    repo: { title: 'Source on GitHub', text: 'The firmware source code is on GitHub.', button: 'View the code on GitHub' },
  },
  pcb: {
    h: 'PCB',
    p: 'I designed the board in KiCAD to carry every component.',
    schematicAlt: 'KiCAD schematic',
    schematicCaption: 'Schematic',
    layoutAlt: 'KiCAD board layout',
    layoutCaption: 'Board layout',
    finishedAlt: 'The finished PCB',
    files: { title: 'KiCAD files', text: 'This is the full KiCAD project for the board.', button: 'Download the KiCAD files' },
  },
  case: {
    h: 'Case',
    p: 'I modelled the case in Onshape and 3D printed it, and the live model is linked below.',
    /** the three figures, in order */
    figs: [
      { alt: 'Case model in Onshape', caption: 'The case in Onshape' },
      { alt: 'Printed case iterations side by side', caption: 'The printed iterations of the case' },
      { alt: 'Case clips before and after reinforcing', caption: 'The case clips before and after I reinforced them' },
    ],
    model: { title: 'Onshape model', text: 'This is the live 3D model of the case.', button: 'Open the 3D model in Onshape' },
  },
  assembly: {
    h: 'Assembly',
    /** the three figures, in order */
    figs: [
      { alt: 'All components soldered to the PCB', caption: 'All components soldered to the PCB and working' },
      { alt: 'Fitting the PCB into the case', caption: 'Fitting the PCB into the case' },
      { alt: 'The finished LoRA Messenger', caption: 'The finished LoRA Messenger' },
    ],
  },
};

export type BrolocatorCopy = typeof en;
export default en;
