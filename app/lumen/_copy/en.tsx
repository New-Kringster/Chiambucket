/* The LUMEN article's English words. Every other language fills the same shape (./<lang>.tsx).
   The code keeps the images, ids, hrefs, pins and layout; text for a list is keyed by id or kept
   in the same order as the code's list.
   Kept in English and out of this file: the system prompt (prompt.ts, shown verbatim in both the
   Formatted and Code views), the console's parsed JSON, the command type names drawn in the
   flowchart (action, sequence, timer, JSON), the hardware map's pins (G14, I2C...), sensor units
   (°C, % RH) and the tool icons' product names.
   The diagrams' labels sit in fixed boxes on wide screens, so keep them about as short as the English. */
const en = {
  meta: {
    title: 'LUMEN | Braven Chiam',
    description: 'LUMEN is a voice assistant for a smart room, built on an ESP32 with no PSRAM. The board hears a wake word and records with an INMP441 mic, a FastAPI relay sends the clip to Whisper and a DeepSeek command parser through OpenRouter, and MQTT carries the command to the devices.',
    ogDescription: 'An ESP32 voice assistant that hears a wake word on the board, sends the clip through a FastAPI relay to Whisper and a DeepSeek command parser, and controls the room over MQTT.',
  },
  /** the prose in the page's JSON-LD */
  ld: {
    headline: 'LUMEN, an ESP32 voice assistant',
    description: 'A voice-controlled smart-room assistant built for the NYP IoT Programming module. An ESP32 running MicroPython records the request, a FastAPI relay calls OpenRouter for Whisper speech-to-text and a DeepSeek command parser, and the command goes back to the room over MQTT.',
  },
  hero: {
    alt: 'LUMEN cover art for a smart-home assistant built with OpenAI Whisper and DeepSeek',
    back: 'Back to projects',
    tag: 'School project',
    title: <><em>LUMEN</em></>,
    lead: 'LUMEN is a voice-controlled assistant for a smart room, which you use by saying “Hello Robot” or holding a button and speaking. An ESP32 records the audio, a server transcribes it and has an LLM turn it into one JSON command, and MQTT carries that command to the lights, fan, servo and buzzer. The hardest part was fitting all of this onto a board with about 33 KB of free RAM.',
    builtWith: 'Built with',
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    overview: 'Overview', try: 'Try it', how: 'How it works', brain: 'The parser', hardware: 'Hardware',
    memory: 'Memory', auto: 'Auto mode', deploy: 'Dashboard', slides: 'Slides', next: "What I'd add next",
  },

  overview: {
    h: 'Overview',
    p: [
      "LUMEN was my mini project for NYP's IoT Programming module, where the brief was simply to build a connected device that does something useful. I wanted to see what a cheap ESP32 could do with real language understanding instead of a fixed list of commands.",
      'It listens for a wake word, records what you say and turns it into actions: “dim the light a bit”, “turn the fan on in ten minutes”, “set the brightness to match the humidity”, “good night”. The language work runs on a small server, so the ESP32 only has to record audio and run commands.',
    ],
    video: 'The wake word, a few spoken commands and the room responding.',
  },

  try: {
    h: 'Try it',
    p: 'This demo follows the same path as the real system on a smaller scale, from a trigger to Whisper for speech-to-text, then to a DeepSeek LLM that parses the text into one JSON command (both through OpenRouter), and finally over MQTT to the devices. You can pick a phrase below or let it cycle through them.',
    note: 'The temperature question and the sandwich request show the guardrails, because a question is answered from live sensor data without any action and an impossible request is refused. The ESP32 only ever acts on validated JSON.',
  },

  /** the demo console (LumenConsole); the parsed JSON it shows stays as code */
  console: {
    title: 'LUMEN console',
    /** the trigger chip: wake word or push-to-talk */
    wake: '“Hello Robot”',
    ptt: 'push-to-talk',
    pipeAria: 'Request pipeline',
    /** the four pipeline stages, in order */
    stages: ['Trigger', 'Whisper', 'DeepSeek', 'MQTT'],
    heard: 'Heard',
    parsed: 'Parsed',
    /** how a heard phrase is quoted; {said} is the phrase */
    quote: '“{said}”',
    /** the reply line before the first command */
    idle: 'Say "Hello Robot" or hold the button to talk.',
    room: 'The room',
    autoOn: 'Auto mode on',
    autoOff: 'Auto mode off',
    devices: { white: 'White LED', rgb: 'NeoPixel', fan: 'Fan', servo: 'Servo' },
    on: 'on',
    off: 'off',
    motion: 'motion',
    still: 'still',
    dark: 'dark',
    lit: 'lit',
    /** the chip shown while the ten-minute timer runs */
    timer: 'Timer: light off in 10 min',
    play: 'Play',
    pause: 'Pause',
    /** the demo's six exchanges, in order: what was said and the reply shown */
    steps: [
      { said: 'Set the light to cyan and turn the fan on a second later.', reply: 'Cyan now, fan in 1s.' },
      { said: 'Set the brightness to the humidity percentage.', reply: 'Brightness set to 69%.' },
      { said: 'Turn the light off in ten minutes.', reply: 'Light off in 10 min.' },
      { said: "What's the temperature in here?", reply: '24.3°C in here.' },
      { said: 'Good night.', reply: 'Good night.' },
      { said: 'Make me a sandwich.', reply: "Sorry, I can't do that." },
    ],
  },

  how: {
    h: 'How it works',
    p1: <><strong>The ESP32 does almost no thinking</strong>, because its only jobs are to record audio and carry out commands. Speech-to-text, the language model and logging all run on a FastAPI server in Docker on my homelab, which the board reaches over the local network.</>,
    p2: <>A trigger (the “Hello Robot” wake word, or a push-to-talk button as the fallback) starts an INMP441 microphone capturing 16&nbsp;kHz mono audio. The board wraps it as a WAV and streams it to the server&apos;s <code>/upload</code> endpoint. The server uses one <strong>OpenRouter</strong> API key for both steps, first having Whisper transcribe the audio and then having a DeepSeek model turn the text into one JSON command under a strict system prompt. It then validates the JSON, publishes it to an MQTT topic that the ESP32 subscribes to, and appends each result to a Google Sheet with an estimated cost per request.</>,
    p3: "The server also subscribes to the room's state and sensor topics, caches the latest values and passes them to the LLM as context, which is how questions like “what's the temperature?” and “is the fan on?” get answered from real readings.",
    pipelineH: 'The voice pipeline',
    /** the numbered voice-pipeline steps */
    steps: [
      <>You <b>trigger</b> it by saying “Hello Robot” or holding the push-to-talk button.</>,
      <>The INMP441 <b>records</b> about three seconds of 16&nbsp;kHz mono audio, and the red REC LED stays lit while it does.</>,
      <>The board <b>wraps</b> the raw PCM in a 44-byte WAV header and <b>streams</b> it to <code>/upload</code> while it is still recording.</>,
      <>The server sends the clip to OpenRouter, where Whisper <b>transcribes</b> it into text.</>,
      <>The server <b>adds context</b> by passing the model the transcript along with a snapshot of device state and sensor readings.</>,
      <>A DeepSeek model, also through OpenRouter, <b>parses</b> it into one JSON command, which the server checks against the schema, retrying once before falling back to a no-op.</>,
      <>The server <b>sends</b> the command over MQTT and appends a row to the Google Sheet.</>,
      <>The ESP32 <b>executes</b> the command and shows the reply on its OLED.</>,
    ],
  },

  /** the signal-path diagram (SignalPath): three stages joined by two links */
  flow: {
    stages: [
      { tag: 'On the ESP32', title: 'Trigger and mic', text: 'A wake word or push-to-talk starts the INMP441 capturing 16 kHz mono audio.' },
      { tag: 'FastAPI server, OpenRouter', title: 'Whisper, DeepSeek and validation', text: 'Whisper turns speech into text and a DeepSeek model parses it into one JSON command, which the server checks against the schema, retrying once before a no-op.' },
      { tag: 'In the room', title: 'Devices and OLED', text: 'The LED, RGB, fan, servo and buzzer respond, and the OLED shows the reply.' },
    ],
    links: ['stream to /upload', 'MQTT command'],
    caption: 'The path a voice command takes from the ESP32 through the server to the devices in the room',
  },

  brain: {
    h: 'The command parser',
    p: 'The model never controls a device directly, and instead converts each sentence into exactly one of three JSON shapes:',
    /** the three shapes; their bold names are the JSON type values, keep them */
    shapes: [
      <><b>action</b> is a single change, such as “turn the fan on” or “set it to cyan”.</>,
      <><b>sequence</b> is a set of ordered steps, each with a delay from the moment you spoke, such as “lights off, then fan off a second later”.</>,
      <><b>timer</b> is one change after a countdown, such as “light off in ten minutes”.</>,
    ],
    p2: 'It also works in other languages, because Whisper transcribes many languages and the parser maps each one to the same JSON vocabulary. A command spoken in Malay or Mandarin produces the same action as the English version.',
    p3: 'A long, strict system prompt fixes the device vocabulary (white LED, NeoPixel RGB, fan, servo, buzzer, comfort range, auto mode), forces valid JSON with numbers as numbers, and has the model map colour names to RGB itself. The server checks every response against a schema, and if one fails it retries once and then falls back to a no-op instead of sending the board something it cannot trust.',
    p4: <>The model can also use the room&apos;s readings as inputs, so when I ask it to “set the brightness to the humidity percentage”, it reads the live humidity from the cached sensor state, rounds it, clamps it to the LED&apos;s 0 to 100 range and emits a real <code>set_brightness</code> command.</>,
  },

  /** the command-parsing flowchart (CommandFlowchart): the wide SVG and the phone layout */
  chart: {
    aria: 'A flowchart of command parsing. Whisper transcribes speech in any of many languages, then the text and live sensor context go to the DeepSeek LLM. If the output JSON fails schema validation, the server retries once, and if it is still invalid the result is a safe no-op. If it is valid, the command is routed by type, as an action for a single device change, a sequence for ordered steps with delays, or a timer for one change after a countdown.',
    input: { t: 'Transcribed text and sensor context', s: 'Whisper transcript plus a live room snapshot from the MQTT cache' },
    note: { t: 'Multilingual input', s: 'Whisper handles many languages' },
    /** the phone layout's badge on the input */
    badge: 'Speaks many languages',
    llm: { t: 'DeepSeek LLM (through OpenRouter)', s: 'Parses the request into one JSON command' },
    /** the decision, on two lines in the wide SVG and one on phones */
    valid: ['JSON schema', 'valid?'],
    validOne: 'JSON schema valid?',
    yes: 'Yes',
    no: 'No',
    fails: 'fails',
    route: { t: 'Route by command type', s: 'action, sequence or timer' },
    /** what each command type does: action, sequence, timer */
    outcomes: ['Single device change', 'Steps with delays', 'One change after a delay'],
    retry: { t: 'Retry once', s: 're-prompt the LLM', phone: 'Re-prompt the LLM' },
    noop: { t: 'Safe no-op', s: 'reply only, no action', phone: 'Reply only, no action on the room' },
    /** the phone layout's connectors and branch label */
    ifInvalid: 'if invalid',
    failurePath: 'Failure path',
    stillFails: 'still fails',
    ifValid: 'if valid',
    byType: 'by type',
    caption: 'How a voice command moves through the parser, where every path ends as an action, a sequence, a timer or a refusal that takes no action',
  },

  /** the system prompt's frame (PromptReveal); the prompt itself stays English */
  prompt: {
    eyebrow: 'The system prompt LUMEN sends the model',
    viewAria: 'Prompt view',
    formatted: 'Formatted',
    code: 'Code',
    more: 'Show the full prompt',
    less: 'Show less',
  },

  hardware: {
    h: 'Hardware',
    p1: 'Everything hangs off one ESP32-WROOM running MicroPython, with the inputs on one side and the outputs on the other. One non-blocking main loop serves all of them, so trigger detection never stalls.',
    p2: "The LDR is a digital light module with its own sensitivity potentiometer, so there are no analog reads, which avoids the ESP32's ADC conflict with WiFi. A red LED lights only while the microphone is recording, and an SSD1306 OLED with two navigation buttons shows the status and the last command across four pages. The DF2301Q wake-word module is wired in and its driver is written, but on the bench I demo with the push-to-talk button.",
    micAlt: 'Close-up of the INMP441 I2S microphone wired to the ESP32',
    micCaption: 'The INMP441 I2S microphone.',
  },

  /** the wiring map (HardwareHub): the wide SVG and the phone pin list; the pins stay in the code */
  hub: {
    aria: 'A wiring map with an ESP32-WROOM at the centre. The sensors and their pins are on the left, with the INMP441 mic on I2S (GPIO 14, 23, 32), the DHT22 (GPIO 4), the PIR (GPIO 35), the LDR (GPIO 34) and the push-to-talk button (GPIO 19). The outputs are on the right, with the white LED (GPIO 25), NeoPixel (GPIO 27), fan (GPIO 26), servo (GPIO 13), buzzer (GPIO 33) and recording LED (GPIO 17). Along the bottom, the shared I2C bus (SDA 21, SCL 22) carries the SSD1306 OLED (0x3C) and the DF2301Q wake-word module (0x64), and two navigation buttons sit on GPIO 18 and 16.',
    inputs: 'Sensors and inputs',
    outputs: 'Outputs',
    bus: 'I2C bus (SDA 21, SCL 22) and UI buttons',
    /** the board in the middle of the wide SVG, then its card on phones */
    core: { t: 'ESP32', s: ['WROOM, MicroPython', 'one non-blocking loop'], phone: 'ESP32-WROOM', phoneS: 'MicroPython, one non-blocking loop' },
    /** each part's name and what it is, by part id */
    parts: {
      mic: { n: 'INMP441 mic', s: 'I2S microphone' },
      dht: { n: 'DHT22', s: 'temperature and humidity' },
      pir: { n: 'PIR', s: 'motion' },
      ldr: { n: 'LDR module', s: 'light or dark' },
      ptt: { n: 'PTT button', s: 'push-to-talk' },
      led: { n: 'White LED', s: 'PWM brightness' },
      neo: { n: 'NeoPixel', s: 'WS2812 RGB' },
      fan: { n: 'Fan', s: 'on or off' },
      servo: { n: 'Servo', s: '0 to 180°' },
      buzzer: { n: 'Buzzer', s: 'beeps and alerts' },
      rec: { n: 'REC LED', s: 'recording' },
      oled: { n: 'OLED', s: 'SSD1306, 0x3C' },
      wake: { n: 'DF2301Q', s: 'wake word, 0x64' },
      navA: { n: 'Nav A', s: 'page' },
      navB: { n: 'Nav B', s: 'page' },
    },
    caption: 'Every component and the GPIO it uses, with the OLED and the DF2301Q sharing one I2C bus',
  },

  memory: {
    h: 'Fitting it in memory',
    p1: 'The ESP32-WROOM has no PSRAM, and with WiFi up MicroPython left me about 33 KB of usable RAM. A voice clip is about 96 KB, so the audio cannot fit in memory all at once.',
    p2: <>To get around that, nothing ever holds the whole clip. The microphone is one persistent, pre-warmed instance, the capture buffers are small and allocated lazily, and the upload is <strong>streamed over a raw socket</strong> as it records, sending a preamble, the WAV header, the PCM chunk by chunk and then a tail. This keeps peak memory during an upload to about 10&nbsp;KB. Building one big <code>bytes</code> object instead makes the garbage collector take a ~26&nbsp;KB block from the same heap that WiFi and the I2S microphone need, which starves the network stack until the upload times out.</>,
    p3: <>The current firmware ships a lean four-page status screen on the OLED, because a richer version with live-refreshing sensor values and a recording splash grew the heap enough to break boot. With it, the board could no longer connect to MQTT (<code>ENOBUFS</code>) or open the microphone (<code>ENOMEM</code>). To make room I also removed the real-time clock and clock-time schedules, so timers now run off a monotonic tick count and need no clock.</>,
  },

  auto: {
    h: 'Auto mode',
    p: [
      'Auto mode runs locally on the board. When it detects motion while the room is dark, it turns the white LED on and switches it off again after five minutes without motion. When the temperature rises above the comfort range, it turns the fan on, with a hysteresis gap so the fan does not keep toggling around the threshold.',
      'Any spoken command takes priority and clears the automatic state, so auto mode never overrides a light you just set.',
    ],
  },

  deploy: {
    h: 'Dashboard and deployment',
    p: [
      'The server is a Dockerised FastAPI app with a web dashboard: device controls (white LED, RGB picker, fan, servo, buzzer, auto-mode toggle, comfort-range editor), a live state readout, a temperature and humidity history chart, a log of recent commands, a player for the last few voice recordings, and a text box that feeds the same LLM path. The text box is my backup in case the microphone fails during a live demo, and a reset clears the chart, log and recordings.',
      'It runs on my homelab behind Nginx Proxy Manager and Cloudflare, which serve the dashboard on an HTTPS hostname. The MQTT broker is reached directly rather than through Cloudflare, and the ESP32 only talks to a LAN address instead of the public hostname, which keeps the firmware small.',
    ],
    dashAlt: 'The LUMEN web dashboard: device controls, live readout, history chart and activity log',
    dashCaption: 'The LUMEN web dashboard',
  },

  slides: {
    h: 'Slides',
    p: 'This is the deck I presented at the module review, which covers the brief, the pipeline, the memory work and the demo.',
    frame: 'LUMEN project presentation (Figma deck)',
  },

  next: {
    h: "What I'd add next",
    p: 'An ESP32-S3 with PSRAM would bring back most of what I cut, because the WROOM is already at its limit streaming microphone audio while it runs WiFi and MQTT.',
    items: [
      <><b>A richer OLED</b> with the live-refreshing sensor pages and the recording splash that I had to remove.</>,
      <><b>Clock-time schedules</b> (“every day at 8&nbsp;am”), which need the real-time clock I removed to save memory.</>,
      <><b>Durable history</b>, so the dashboard&apos;s charts and the timers survive a reboot, because today the last couple of hours live only in RAM.</>,
      <><b>A working wake word</b> on the hardware, so push-to-talk becomes the fallback instead of the main trigger.</>,
    ],
  },
};

export type LumenCopy = typeof en;
export type LumenConsoleCopy = LumenCopy['console'];
export type LumenPromptCopy = LumenCopy['prompt'];
export default en;
