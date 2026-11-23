/* The OCR Reader article's English words. Every other language fills the same
   shape. The code keeps the images, ids, hrefs, layout flags and numbers; text
   for a list is keyed by the frame, node, scene or agent id it belongs to.
   Kept in English and out of this file: the ConfigKing screens (a port of the
   Cardputer firmware's own UI), the Cardputer's printed key legends, the
   exported 3D chapter (app/waterslop/chapter/, made by the WaterSlop project),
   the entrance's OCR READER drums, and units, symbols and identifiers drawn on
   the DrumNet film (dx, dy, ReLU, tanh, Wt, px, the sizes and numbers). */
const en = {
  meta: {
    title: 'OCR Reader, a vision water meter reader on an ESP32-S3 | Chiambucket',
    description:
      'OCR Reader is a low-cost, battery-powered water meter reader that reads the meter with a camera. A 693K-parameter network, DrumNet V10, runs entirely on its ESP32-S3 to read the drums, and the reading is sent over LoRaWAN. The article goes through MeterSim, SimGen2, the six agents that trained it, the network step by step, the firmware, the PCB in 3D, the enclosure and a ConfigKing simulator.',
    ogTitle: 'OCR Reader: a vision water meter reader on an ESP32-S3',
  },
  /** the prose in the page's JSON-LD (its description is meta.description) */
  ld: { headline: 'OCR Reader: a vision OCR water meter reader on an ESP32-S3' },

  /** chrome shared by the chapter engine (Story.tsx) and the ConfigKing simulator's page controls */
  ui: {
    chapterDash: 'Chapter - {n}',
    next: 'Next',
    nextChapter: 'Next chapter',
    nextFrame: 'Next frame',
    coverAria: 'Chapter {n}: {title}',
    coverN: 'Chapter {n}',
    coverContents: 'In chapter {n}',
    ck: {
      hint: 'Tap the screen or a key to take over',
      deviceAria: 'ConfigKing simulator on an M5Stack Cardputer. Click the screen or the keys, then use the arrow keys, Enter, Escape and Tab.',
      keyboard: 'Cardputer keyboard',
      view: 'View',
      close: 'Zoom in',
      full: 'Full view',
      zoom: 'Magnified',
      fullScreen: 'Full screen',
      exitFullScreen: 'Exit full screen',
    },
  },

  entrance: 'Water meter OCR on an ESP32-S3',
  skip: { toEnd: 'Skip to the end', toTop: 'Back to top' },

  hero: {
    label: 'OCR Reader',
    labelSub: 'Water meter OCR on an ESP32-S3 · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader is a low-cost, low-power, vision-based OCR water meter reader. A 693K-parameter neural network, DrumNet V10, runs entirely on the reader’s ESP32-S3, where it finds the digit window, reads each drum and sends the number home over LoRaWAN in about 2 seconds. The target is 99 % accuracy on a 2-year battery, and the current build reads 56 % of readings correctly, with plans to improve.',
    contentsAria: 'Chapters',
    start: 'Start reading',
    report: 'The report',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  /** the hero's contents, by chapter id */
  chapters: {
    v2: 'PCB & enclosure', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: 'Agentic workflow',
    firmware: 'Firmware', power: 'Power optimisation', camera: 'Camera choice', proto: 'Prototype V2', conclusion: 'Conclusion', report: 'The report',
  },

  /* ── Chapters I to III: the 3D chapter, the DrumNet film and ConfigKing ── */
  pcb: {
    aria: 'The PCB and enclosure of Prototype V2 in 3D, ending with the reader taking a photo of the meter',
    /** replaces the exported chapter's own "Chapter V:" label */
    chapterColon: 'Chapter {n}:',
    /** replaces the exported chapter's "WaterSlop PCB" */
    name: 'OCR Reader PCB',
  },

  film: {
    aria: 'An animation of the whole DrumNet V10 architecture',
    title: 'DrumNet',
    of: '{stage} · {n} of {total}',
    nudge: 'The film plays on its own, and the page carries on in a moment.',
    scenesAria: 'Scenes',
    sceneAria: '{n}. {title}',
    prev: 'Previous scene',
    prevTitle: 'Previous (←)',
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
    playTitle: 'Play / pause (space)',
    next: 'Next scene',
    nextTitle: 'Next (→)',
    fast: 'Fast forward, now {n} times',
    fastTitle: 'Fast forward (f)',
    skip: 'Skip chapter',
    skipTitle: 'Skip to the next chapter, ConfigKing',
    /** the caption under the film, by scene id (film/scenes.ts) */
    scenes: {
      photo: {
        stage: 'Capture', title: 'The photo the reader just took',
        body: 'This is one 800 × 600 frame in grey, and everything from here on runs on the ESP32-S3 using only this photo.',
      },
      downscale: {
        stage: 'Input', title: 'Downscale the capture',
        body: 'The reader captures the meter at 800 × 600 in grey, and for the spotter it is downscaled to 320 × 240, which has four times fewer numbers, so the rough search runs quickly and cheaply.',
      },
      'spot-net': {
        stage: 'Spotter', title: 'Five blocks shrink the thumbnail to a 10 × 7 grid',
        body: 'Each block slides a 3 × 3 kernel over its input, keeps the strong responses (ReLU) and halves the size (max-pool). The thumbnail becomes 8 maps, then 16, 24, 32 and 32, each half the size of the last, until one cell of the last block stands for a 32 × 34 patch of the thumbnail.',
      },
      'spot-head': {
        stage: 'Spotter', title: 'The score map picks the cell and the other four say where',
        body: 'A 1 × 1 convolution turns block 5 into five 10 × 7 maps, and the score map chooses the cell most likely to hold the centre of the digit window. That position is handed to the dx, dy, width and height maps, which are read at the same cell, and together they draw a box on the thumbnail.',
      },
      'spot-crop': {
        stage: 'Spotter', title: 'A rough box, then a generous crop',
        body: 'The spotter’s work is rough, so the box is widened 1.5 ×, and the crop around it takes 1.5 × its width and 2.4 × its height. It is cut from the full 800 × 600 frame, not the thumbnail, and sent down to the refiner.',
      },
      'ref-net': {
        stage: 'Refiner · pass 1', title: 'Four blocks bring the crop down to 32 maps of 32 × 12',
        body: 'The crop is converted to grey and resized to 256 × 96, and RefNet runs four of the same kind of blocks as the spotter. The last one does not pool, so block 4 keeps 32 maps of 32 × 12, one column for every 8 pixels of the crop.',
      },
      'ref-avg': {
        stage: 'Refiner · pass 1', title: 'Every map is averaged into one row and one column',
        body: 'Block 4 is a slab of 32 maps, and each one peels off in turn. Its 32 columns average into one row of the column-average map and its 12 rows into one column of the row-average map, so the first finds left and right and the second top and bottom.',
      },
      'ref-heads': {
        stage: 'Refiner · pass 1', title: 'The average maps become score and offset strips',
        body: 'A 1 × 1 convolution reads every column of the column map and turns it into four strips, a score and an offset for the left edge and the same for the right, while the row map becomes four more for top and bottom. The highest score picks the cell, its offset says where the edge sits inside that cell, and the four edges make the box.',
      },
      'ref-pass2': {
        stage: 'Refiner · pass 2', title: 'Expand the box, crop again and run the same network',
        body: 'The pass 1 box is only as centred as the spotter’s guess, so it is expanded, cropped again and sent through the very same refiner, with the same four blocks, heads and 15,400 weights. Pass 2 replays pass 1 quickly, and its box goes on to the reader.',
      },
      cut: {
        stage: 'Cut', title: 'Cut the window into drums',
        body: 'The layout of 4 whole drums and 2 decimal drums was set during setup, so the window is sliced into six equal cells, and each one is turned grey, stretched to full contrast at 32 × 64 and sent to the readers. We follow the sixth drum, the 7.',
      },
      'rd-net': {
        stage: 'Reader 1', title: 'A reader turns one cell into 96 tiny maps',
        body: 'The reader uses the same four blocks of 3 × 3 convolution, ReLU and max-pool once more, but wider, with 16, 48, 96 and 96 maps, so the 32 × 64 cell ends as 96 maps of 2 × 4, where one cell stands for a 16 × 16 patch of the drum.',
      },
      flatten: {
        stage: 'Reader 1', title: 'Flattening 96 maps into one list of 768',
        body: 'Nothing is computed here. The first map is pulled off the block and its 2 × 4 cells are read row by row into a line of 8, then the other 95 maps follow until the block is empty, so the 768 numbers are always in the same order, with map 1 first and map 96 last.',
      },
      dense: {
        stage: 'Reader 1', title: 'The dense layer turns 768 numbers into 96 units',
        body: 'Each of the 96 units multiplies every number by its own weight, adds up the 768 products and an offset, and turns anything below zero into zero. Unit 69 goes first and slowly, then the other 95 do the same.',
      },
      digit: {
        stage: 'Reader 1', title: 'The digit head turns ten scores into one answer',
        body: 'Each digit 0 to 9 has its own 96 weights and offset, so ten weighted sums give ten scores. Softmax raises e to every score and divides by the total, which turns one clear lead into nearly all of the probability. The 7 wins at 96.4 %, and that percentage is the confidence.',
      },
      roll: {
        stage: 'Reader 1', title: 'The roll head measures how far the drum has turned',
        body: 'One more weighted sum of the 96 units gives a roll score, which tanh squashes into −0.5 to +0.5 to say how far past its mark the drum sits. This 7 has rolled 3.7 % of a step towards the 8.',
      },
      readers3: {
        stage: 'Reader ensemble', title: 'Readers 2 and 3 read the same drum',
        body: 'Three copies of the reader share one architecture but were trained from different random starts, so they make different mistakes. The same cell goes through readers 2 and 3 the same way, quickly, and each gives its own ten percentages and its own roll.',
      },
      vote: {
        stage: 'Vote', title: 'Three answers are averaged into one',
        body: 'The three readers’ answers come down to the vote, where their probability lists are averaged, so each reader has the same voting power and the third breaks ties. The averaged list gives the digit and its confidence, the three rolls are averaged too, and drum 6 comes out as a 7 at 98.8 %.',
      },
      drums: {
        stage: 'Vote', title: 'Every other drum goes through the same machinery',
        body: 'The other five cells go through the same steps quickly, the four blocks, flatten, dense and the two heads in all three readers at once, then the vote, until six averaged answers line up before the carry rule. Drum 3 is the least sure, a 9 at 71.5 %, because reader 3 saw a 0 and was outvoted.',
      },
      carry: {
        stage: 'Vote', title: 'The carry rule, then the reading',
        body: 'A drum may only be mid-roll if the drum to its right is on 9 or 0, or if it is the last drum, and then its roll is trusted and the digit may step on. If the right drum sits on 1 to 8, this drum is locked to its nearest digit, which keeps 79 rolling to 80 from reading as 89. Here every roll is inside the dead band, so each drum keeps its digit and the reading is 0092.07.',
      },
      finale: {
        stage: 'DrumNet V10', title: 'The whole pipeline running at once',
        body: 'Every stage runs at once one more time, from the thumbnail and the spotter through the refiner, the six cells, the three readers, the vote and the carry rule, which takes the reader about two seconds per number.',
      },
    },
    /** the panels on the film's map, by panel key */
    panels: {
      input: { title: 'Input', sub: 'one photo from the reader' },
      spotter: { title: 'DetNet Spotter', sub: 'a rough box around the digit window' },
      ref1: { title: 'RefNet Refiner · pass 1', sub: 'find the four edges inside the rough box' },
      ref2: { title: 'RefNet Refiner · pass 2', sub: 'expand, crop again and rerun the network' },
      cut: { title: 'Cut into digits', sub: 'one cell per drum' },
      reader1: { title: 'DrumNet Reader 1', sub: 'which digit shows, and how far it has turned' },
      reader2: { title: 'DrumNet Reader 2', sub: 'the same net from a different random start' },
      reader3: { title: 'DrumNet Reader 3', sub: 'the tie breaker' },
      vote: { title: 'Ensemble vote and reading', sub: 'average, carry rule, reading' },
    },
    /** words drawn on the film's canvas (film/draw.ts, film/scenes.ts) */
    draw: {
      block: 'block {n}',
      mapsOne: '{n} map · {sub}',
      maps: '{n} maps · {sub}',
      weights: '{n} weights',
      noPool: '{sub} · no pool',
      greyJpeg: '800 × 600 · greyscale JPEG',
      fewer: '{n} numbers · 4 × fewer',
      thumbnail: 'thumbnail',
      conv5: '1 × 1 conv · 32 → 5',
      score: 'score',
      chosen: 'highest of the 70 cells: chosen',
      across: 'centre {n} % across the cell',
      down: 'centre {n} % down the cell',
      width: 'width 0.25 of the frame · {n} px',
      height: 'height 0.12 of the frame · {n} px',
      headCols: ['cell', 'raw', '0 to 1', 'meaning'],
      sigmoid: '0 to 1 is the sigmoid of the raw value',
      corner: 'dx, dy from the cell corner',
      selection: 'the spotter’s selection · {w} × {h} px',
      widened: 'widened 1.5 ×',
      cropBox: 'the crop · 1.5 × wider, 2.4 × taller · {w} × {h} px',
      cutFrom: 'cut from the full 800 × 600 frame, not the thumbnail',
      colAvgSize: 'column averages · 32 × 32',
      colAvgNote: 'one row per map · 12 values → 1',
      rowAvgSize: 'row averages · 32 × 12',
      rowAvgNote: 'one column per map · 32 values → 1',
      slab: 'block 4 · 32 maps · 32 × 12',
      peel1: 'as map 1 peels off, each of its 32 columns averages to one value,',
      peel2: 'and each of its 12 rows to one value',
      mapOf: 'map {n} of 32',
      colAvg: 'column averages',
      rowAvg: 'row averages',
      sameCol: 'same weights for every column',
      sameRow: 'same weights for every row',
      conv: '1 × 1 conv',
      inOut: '32 in, 4 out',
      leftScore: 'left score', leftOffset: 'left offset', rightScore: 'right score', rightOffset: 'right offset',
      topScore: 'top score', topOffset: 'top offset', bottomScore: 'bottom score', bottomOffset: 'bottom offset',
      stripsKey: 'solid: the highest score · dotted: its offset · the line: where in the cell the edge is',
      crop: 'crop · 256 × 96 grey',
      expanded: 'expanded · {w} × {h} px → 256 × 96',
      sameRef: 'the same RefNet · same blocks, same heads, same 15,400 weights',
      pass2Box: 'pass 2 box',
      toReader: '{w} × {h} px · to the reader',
      window: 'window · {w} × {h} px · 6 equal strips',
      cells: 'cells · one per drum',
      readerCells: 'reader cells · grey, full contrast, 32 × 64',
      drum: 'drum {n}',
      drumSize: 'drum {n} · 32 × 64',
      reader1Maps: 'maps and units shown are reader 1’s, but the digit and roll are this reader’s own',
      mapsLeft: 'block 4 · {n} of 96 maps left',
      rowByRow: 'row by row',
      map1List: 'map 1 → list positions 1 to 8',
      map: 'map {n}',
      oneList: 'one list · {n} numbers',
      numbers768: '768 numbers',
      weightPer: 'one weight per number',
      sum768: 'sum of the 768',
      offset: 'offset',
      unit: 'unit {n}',
      units96: '96 units',
      aboveZero: '{w} weights · {n} of the 96 are above zero for this drum',
      digitCols: ['score', 'e^score', '÷ sum', 'softmax'],
      digit: 'digit {n}',
      firmwareChecks: 'the confidence the firmware checks',
      share: 'e^7.1 = 1,215 ÷ 1,260 · a score 3.6 above the next is a 36 × share',
      rollScore: 'roll score',
      roll: 'roll {v}',
      rollMeasured: 'the 7 has passed its mark by 3.7 % of a step toward the 8',
      rollPast: 'the {d} is {p} % of a step past its mark',
      rollBefore: 'the {d} is {p} % of a step before its mark',
      leastSure: 'least sure, as reader 3 read a 0 and was outvoted',
      reader: 'reader {n}',
      mean: 'mean',
      meanOfThree: 'roll {v} · the mean of three',
      inBand: 'in band',
      pastBand: 'past band',
      freeLast: 'free · last drum',
      free: 'free · right drum on 9 or 0',
      lock: 'lock · right drum on 1 to 8',
      allowed: '{n} → {m} allowed',
      absolute: '{n}, absolute',
      carryNote: '79 rolling to 80 could read as 89, so the rule picks the preceding number instead',
      units: 'cubic metres · confidence 71.5 %, the least sure of the 6 drums',
      secondRoute: 'second route: rerun with WindowNet',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: 'Skip to the simulator',
    intro: {
      eyebrow: 'Setup and configuration', title: 'The same reading, on the setup tool',
      /** the body around the Skip to the simulator button */
      before: <p>That reading, 0092.07, and the frame it came from are what ConfigKing shows when it asks a reader to Read. ConfigKing is the firmware I wrote for an M5Stack Cardputer, and it finds readers nearby over BLE and ESP-NOW, sets up new ones step by step and reconfigures the rest.</p>,
      after: <p className="ws-note">DrumNet and the firmware are flashed onto Prototype V2 with the LoRa device address set at the same time, and because the readers are mostly asleep, you press the boot button to wake one up so it can be found. The screen here is a working copy of the real firmware&rsquo;s screens, drawn from its source code on a photo of the Cardputer.</p>,
    },
    /** what the chip beside a pressed key says it does */
    press: { connect: 'connect', save: 'save', next: 'next', finish: 'finish', continue: 'continue' },
    /** the wizard steps, by scene */
    steps: {
      nearby: { eyebrow: 'Step 1', title: 'Discovery', body: 'When an unconfigured reader is powered on, it automatically starts in configuration mode. ConfigKing detects this and prompts you to set it up.' },
      identify: { eyebrow: 'Step 2', title: 'Identification and reading rate', body: 'Set the name the reader shows on the dashboard, then its reading rate, and expand the (i) icon for more details about the reader.' },
      layout: { eyebrow: 'Step 3', title: 'Drum layout', body: 'Set the drum layout to match the meter the reader will be installed on, with 1 to 8 whole-number drums and 0 to 4 fraction drums.' },
      camera: { eyebrow: 'Step 4', title: 'Camera configuration', body: 'Set the brightness, gain and LED PWM duty cycle for even lighting. You can zoom and pan to look at the image more closely, and the picture darkens and brightens as the settings change.' },
      roi: { eyebrow: 'Step 5', title: 'ROI refinement', body: 'WindowNet generates a ROI automatically, and the controls let you refine it, with zoom and pan to see it in more detail.' },
      read: { eyebrow: 'Step 6', title: 'Test read', body: 'A test reading is made with the ROI set earlier and shows its confidence, which you can inspect digit by digit by pressing (D).' },
      radio: { eyebrow: 'Step 7', title: 'LoRa connectivity test', body: 'A connectivity test makes sure the reader can reach the LoRaWAN gateway, and expanding the (i) menu shows more information.' },
      review: { eyebrow: 'Step 8', title: 'Review changes and save', body: 'Check the settings that will be saved to the reader. Once they are saved, the reader switches to standard deployment mode and the BLE link drops.' },
      done: { eyebrow: 'Setup complete', title: 'The reader sleeps and starts reading', body: 'The finish message shows the reader’s own sleep timer, and from here the reader wakes on its own interval, takes a reading, sends it and goes back to sleep.' },
      connected: { eyebrow: 'A configured reader', title: 'Read, Configure, More', body: 'A configured reader gets Read, Configure and More instead of the wizard. Configure opens one setup category at a time with an explicit save or discard, and More holds the radio test, reader info, About and a factory reset that asks for confirmation.' },
    },
    free: {
      eyebrow: 'Try it', title: 'Set up a reader yourself',
      body: <p>This has the same screens, keys and wizard as the real thing, talking to a simulated reader. You can press the keys on the Cardputer, tap its screen or type on your own keyboard, and a reader will turn up nearby in a moment.</p>,
    },
  },

  /* ── Chapter IV: MeterSim ── */
  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['A simulated meter', 'Built for agents', 'Designs and presets', 'Half-rolled drums', 'Weather and surfaces', 'Unattended evaluation'],
      lede: 'MeterSim draws a water meter on a tablet, so a real camera can collect labelled readings with nobody watching.',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: 'A simulated meter for a real camera',
        body: <p>The first version of MeterSim was built alongside the firmware for Prototype V0.5, and the two work together, so MeterSim can control Prototype V0.5 automatically and generate labelled images for training the model. Claude wrote all of the software and firmware.</p>,
        alt: 'Prototype V0.5, an ESP32-EYE, pointed at a tablet showing the MeterSim display',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: 'Built for agents to use',
        body: <p>MeterSim is built to be used by AI agents rather than people, so its control panel is mainly a way for people to watch the progress the agents make. The agents used MeterSim to build tests, collect data and check accuracy while they created DrumNet. It takes over the most tedious job in machine learning, gathering good data to train on, by generating that data, and because the meter is simulated, every image comes already labelled.</p>,
        alt: 'The MeterSim control interface, with sliders for reading, drums, surface and weather effects',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: 'Nine meter designs and nine presets',
        body: (
          <>
            <p>MeterSim has 9 meter designs, and each can be set up with a different barrel layout, such as 7 integer barrels and 1 decimal barrel (7+1). The integer barrels are usually white or black, while the decimal barrels are red.</p>
            <p>Common combinations of conditions are saved as presets: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty.</p>
          </>
        ),
        alt: [
          'The nine meter designs available in MeterSim: Itron Weg 50, Elster brass, Itron Multimag Cyble, Bonega S/13 and T/13, Istameter II, an industrial generic, B Meters blue and a clean Elster brass',
          'Nine preset conditions: clean, noon, digit glare, half shadow, soft shadow, dusk, shaded, tilted and dirty',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: 'Half-rolled drums',
        body: <p>It also simulates half-rolled barrels, so the model can learn to read a barrel that is partway between one digit and the next, and the agent sets these up automatically while it collects training data.</p>,
        alt: 'The MeterSim roll control, dragging individual drums part-way between digits',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: 'Weather and surface conditions',
        body: <p>MeterSim also simulates the weather and the state of the meter&rsquo;s surface, to match how a meter left out in the elements may look, so the reader is trained to read in all of these conditions. The controls cover glare, smudge, shadow, lighting, blur, sensor noise, fog, dirt and scaling.</p>,
        alt: 'The surface and weather effect sliders in MeterSim, each with a preview thumbnail',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: 'Unattended evaluation and data collection',
        body: (
          <>
            <p>MeterSim is a self-hosted web app with two endpoints, the control panel at /control and the display at /display. The reader joins the same local Wi-Fi network as MeterSim, which it uses to send its readings and images and to receive commands.</p>
            <p>To evaluate a model, MeterSim generates a random meter and conditions and shows them to the reader, which takes an image and reads it with the trained network. The result goes back to MeterSim, which knows the simulated value and compares it with the prediction, and when an agent repeats this many times with nobody watching, it gives an approximate accuracy for the model. Collecting labelled data works the same way, except that the reader&rsquo;s images are saved to disk with their labels in JSON, ready for training.</p>
          </>
        ),
        alt: [
          'A tablet showing the MeterSim display next to a laptop with the control panel, with the ESP32-EYE reader pointed at the tablet',
          'The ESP32-EYE reader on a bottle pointed at the MeterSim display, in a classroom',
        ],
      },
    },
  },

  /* ── Chapter V: SimGen2 ── */
  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['Six stages', 'Real over synthetic', 'Compare them yourself'],
      lede: "SimGen2 makes synthetic captures that look like the reader's own camera took them, in about 2 s each, almost 5× faster than a real capture.",
    },
    page: 'SimGen2',
    /** the six stages named under the stage strip, in order */
    stages: [
      ['Display screenshot', 'MeterSim’s display, 1920 × 1080'], ['Warped', 'pose and lens, to 1600 × 1200'], ['Field blur', '1.2 to 2.2 px'], ['Gain, tone curve, vignette', 'the sensor’s response'], ['Sensor noise', 'grain where the real camera has it'], ['OV2640 JPEG', 'quality 6, as the reader compresses'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: 'Simulating the camera itself',
        body: (
          <>
            <p>Even with all this automation, one big bottleneck remained, because capturing an image on the reader and sending it to MeterSim takes almost 10 s, which adds up to many hours over thousands of images. So the next goal was to simulate the reader&rsquo;s camera itself, and that system is SimGen2. It scales the image, then applies filters and warping so it looks like an image taken with the reader&rsquo;s camera.</p>
            <p>SimGen2 was developed entirely by OpenAI&rsquo;s ChatGPT Astra 6, which used roughly 4000 real images from the reader to develop the filters.</p>
          </>
        ),
        alt: 'The six processing stages of SimGen2 from display screenshot to warped, blurred, toned, noisy and JPEG-compressed output, with a strip of the register at each stage',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: 'Real over synthetic',
        body: <p>SimGen2 generates an image in about 2 s, almost 5× faster than capturing one with the physical reader, and running alongside the reader it produced tens of thousands of unique labelled images to train the DrumNet Simulated model. Here a real capture tinted magenta is laid over its SimGen2 version tinted green, so the picture is uncoloured wherever the two match, and the LED glare in the real capture is the biggest difference left.</p>,
        alt: 'A real capture tinted magenta overlaid on its SimGen2 synthetic version tinted green; where they match the image is uncoloured',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: 'Compare them yourself',
        body: <p>These are twenty-one real captures and their SimGen2 versions across six meter designs, cut from the report&rsquo;s sheets. Drag the divider to compare them, with the real capture on the left and SimGen2 on the right. The register strip is shown largest because it is the part DrumNet reads.</p>,
      },
    },
    /** the pair comparer (Compare.tsx); {meter} is the meter's id */
    compare: {
      realStrip: 'Real capture of the {meter} register',
      simStrip: 'The same register as SimGen2 generated it',
      realMeter: 'Real capture of the {meter} meter',
      simMeter: 'The same meter as SimGen2 generated it',
      real: 'real',
      sim: 'SimGen2',
      divider: 'Divider between the real capture on the left and SimGen2 on the right',
      pairs: 'Pairs',
    },
  },

  /* ── Chapter VI: the agents ── */
  agents: {
    cover: {
      title: 'Agentic workflow', lines: ['Agentic', 'workflow'],
      contents: ['The loop', 'Six agents', 'Resources and the scheduler', 'Managed with T3 Code'],
      lede: 'Six agents trained and tested the readers at the same time, sharing one scheduler for the compute and the test rig.',
    },
    page: 'Agentic workflow',
    rows: {
      'ag-loop': {
        eyebrow: 'Agentic workflow', title: 'The self-improvement loop',
        body: <p>I used LLM-based AI agents extensively in this project, and their task was to improve the full vision pipeline running on the ESP32-S3 towards a target of 99 % meter accuracy. Each agent worked in a loop where it formed a hypothesis, planned how to carry it out, gathered training data, retrained, fine-tuned or RL-trained the model, tested for improvements or regressions, then reported its findings and started again.</p>,
      },
      'ag-six': {
        eyebrow: 'Agentic workflow', title: 'Six agents, three of them on DrumNet',
        body: (
          <>
            <p>Three agents ran this loop, each on its own variant of DrumNet, while three more agents handled other jobs. After about 1.5 weeks Standard and Premade were still performing poorly, so their development was halted and all of their resources went to DrumNet Simulated.</p>
            <p>DrumNet Simulated was then allowed to train on every dataset, including those from the rig and the external catalogue, and was renamed DrumNet. The current build, V10, is the best-performing network in the DrumNet series.</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: 'Agentic workflow', title: 'Shared resources and a scheduler',
        body: (
          <>
            <p>With six agents running at once they kept competing for resources, so I developed a scheduler that lets them book timeslots on the shared resources. One is the compute used for training, which is my server&rsquo;s CPU and my laptop&rsquo;s GPU, and the other is the Jetson rig, where an agent can flash and work with Prototype V1 while it controls, through MeterSim, the display the prototype is pointed at.</p>
            <p className="ws-note">On the scheduler&rsquo;s compute timeline, the filled area shows booked threads against the 20-thread budget and the red line shows booked memory against the 9 GB budget, while the laptop GPU takes one job at a time.</p>
          </>
        ),
        alt: [
          'A sketch of the three DrumNet agents sharing the Jetson rig and compute through two schedulers, with the coordinator, Sim2 Genius and the window detector model alongside',
          'The scheduler timeline for the compute resources, with booked blocks per agent and the booked load against the budget',
        ],
      },
      'ag-t3': {
        eyebrow: 'Agentic workflow', title: 'Managed with T3 Code',
        body: (
          <>
            <p>The agents ran 24/7 on a &ldquo;heartbeat&rdquo;, a simple script that wakes an agent after a set interval or at a set time so it carries on working. They were told to act independently and make their own decisions, so very little human involvement was needed.</p>
            <p>The networking ran on Tailscale, a personal peer-to-peer VPN, which let the agents on my server at home reach and control the Jetson rig at school over SSH. The agents themselves were managed in T3 Code, an open-source meta-harness for Claude Code and Codex.</p>
          </>
        ),
        alt: 'Diagram of T3 Code connecting the client device, the home server running the agents, the laptop GPU and the Jetson rig at school over Tailscale',
      },
    },
    /** the loop ring (Agents.tsx): each step, and the same step broken into the lines drawn on the ring */
    loop: {
      steps: ['Hypothesis', 'Execution planning', 'Gather the training dataset', 'Re-train, fine-tune or RL the model', 'Test for improvement or regression', 'Report findings, then a new hypothesis'],
      lines: [['Hypothesis'], ['Execution', 'planning'], ['Gather the', 'training dataset'], ['Re-train, fine-tune', 'or RL the model'], ['Test for improvement', 'or regression'], ['Report findings,', 'then a new hypothesis']],
      aria: "The agents' loop: {steps}, and around again.",
      target: 'TARGET',
      accuracy: 'meter accuracy',
    },
    /** the six agent badges, by agent */
    badges: {
      model: 'Model', job: 'Job', data: 'Trains on', won: 'became DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: 'The purist', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Only images taken by Prototype V1, from the base DrumNet V1', fate: 'Halted after 1.5 weeks' },
        simulated: { name: 'DrumNet Simulated', persona: 'The dreamer', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Only SimGen2 images, fully computer-generated, from the base DrumNet V1', fate: 'Renamed DrumNet and now at V10' },
        premade: { name: 'DrumNet Premade', persona: 'The collector', model: 'Fable 5.1, then Opus 5.5', job: 'Reads drums', data: 'Every dataset: Prototype V1, SimGen2, Badger55, Jomjol-digits, from the dig-cont model', fate: 'Halted after 1.5 weeks' },
        windownet: { name: 'WindowNet', persona: 'The spotter', model: 'Opus 5.5', job: 'Finds the window', data: 'Trains the Spotter (DetNet) and Refiner (RefNet) that locate the drum window', fate: 'Still the weakest link, where most wrong readings start' },
        sim2: { name: 'Sim 2 Genius', persona: 'The stagehand', model: 'Opus 5.5', job: 'Runs the simulator', data: 'Operates, maintains and improves SimGen2 for the others', fate: 'Keeps the synthetic pictures coming' },
        coordinator: { name: 'OCR Coordinator', persona: 'The foreman', model: 'Fable 5.1', job: 'Runs the project', data: 'Talks to all the other agents, books their time, keeps the plan', fate: 'Reallocated everything to Simulated when the others stalled' },
      },
    },
  },

  /* ── Chapter VII: firmware (ReadCycle.tsx) ── */
  firmware: {
    cover: {
      title: 'Firmware', lines: ['Reader', 'firmware'],
      contents: ['Written by an agent', 'One wake cycle', 'The dashboard'],
      lede: 'In one wake cycle the reader wakes, captures the meter, reads the drums, sends the number home and goes back to sleep.',
    },
    page: 'Firmware',
    chartAria: 'Reader firmware flow for one wake cycle',
    /** the edge labels, drawn in capitals */
    success: 'success',
    fail: 'fail',
    nextCycle: 'NEXT CYCLE',
    /** the chart's boxes, by node id */
    nodes: {
      wake: { title: 'Wake from RTC', sub: 'restore state, initialise peripherals', time: '~0.2 s' },
      capture: { title: 'Image capture', sub: 'image captured using the LED lights', time: '~0.5 s' },
      low: { title: 'Low power reading', sub: 'DrumNet readers only, stored ROI, no WindowNet', time: '~0.5 to 3 s' },
      uplink: { title: 'LoRaWAN uplink', sub: 'reading sent to the gateway', time: '~0.3 s' },
      sleep: { title: 'Sleep', sub: 'all peripherals are shut down' },
      full: { title: 'Full DrumNet pipeline', sub: 'rerun with WindowNet as a backup' },
      check: { title: 'Check confidence', sub: 'is the new reading confident enough?' },
      alt: { title: 'Run with alternative spotter', sub: 'a different backup set of weights' },
      reject: { title: 'Reject reading', sub: 'saved to NVS for evaluation, warned on the dashboard' },
    },
    /** the nine steps beside the chart, by node id */
    steps: {
      wake: 'The reader wakes from sleep and restores its configuration and LoRaWAN session from Non-Volatile Storage.',
      capture: 'The camera is initialised and a capture is taken with the LED lights.',
      low: 'The image goes straight through the DrumNet readers using the ROI stored at setup, without WindowNet. This is the normal and cheapest path, and a confident reading goes on to the uplink after about 1.5 s awake in all.',
      full: 'Only if the readers report a low confidence does the full pipeline run as a backup, with WindowNet finding the window again.',
      check: 'The new reading’s confidence is checked, and most readings leave the loop here.',
      alt: 'The spotter runs once more with a different backup set of weights as the last attempt in this cycle.',
      reject: 'A failed attempt is stored in NVS for later evaluation and a low-confidence warning is reported on the dashboard.',
      uplink: 'The LoRa link switches on and the reading is sent to the gateway.',
      sleep: 'All peripherals shut down and the reader deep-sleeps until the RTC wakes it for the next cycle, although pressing BOOT wakes it for configuration.',
    },
    rows: {
      'fw-agents': {
        eyebrow: 'Firmware', title: 'Written by an agent, on real hardware',
        body: (
          <>
            <p>An Astra 6 agent was tasked with writing the firmware for the reader (Prototype V2) and for the M5Stack Cardputer Adv, which runs ConfigKing, the configuration console that lets onsite engineers configure readers for deployment and reconfigure them later. The agent was told to only write code using Fable 5.1.</p>
            <p className="ws-note">My laptop, the LoRaWAN gateway (graciously provided by Mr Lee Chang Fatt) and the Jetson Nano were set up on the same network, the Cardputer and Prototype V2 were connected to the laptop over USB serial, and all four devices were made available to the agents.</p>
          </>
        ),
        alt: 'The firmware development setup: the laptop, Jetson Nano, LoRaWAN gateway, Prototype V2 reader and the Cardputer, with the agents reaching them over the network',
      },
      'fw-cycle': { eyebrow: 'One wake cycle', title: 'Nine steps, though most readings take five' },
      'fw-dashboard': {
        eyebrow: 'Dashboard', title: 'Where the reading is shown',
        body: <p>After the reading is made it is sent to the LoRaWAN gateway, which forwards it over MQTT to the Jetson Nano, where it is stored. The Jetson serves the dashboard as a single HTML file whose JavaScript updates the values from the stored data, but the dashboard is only a demo and is not designed to scale to real deployments.</p>,
        alt: 'The reader monitor dashboard: a bench reader card reading 0092.07 cubic metres with a low confidence chip, and history charts and a table of nine readings',
      },
    },
  },

  /* ── Chapter VIII: power ── */
  power: {
    cover: {
      title: 'Power optimisation', lines: ['Saving', 'power'],
      contents: ['Sub-sampling', 'Capture modes, side by side', 'PWM dimming', 'Greyscale', 'INT8 and vector maths', 'Hardware'],
      lede: 'Every step of the wake cycle was trimmed towards a 2-year battery life with smaller captures, dimmer light and integer maths.',
    },
    page: 'Power optimisation',
    /** the three capture modes, in order (1600, 800, 400); {res} is the resolution */
    modes: [
      { time: '350 ms capture', note: 'every pixel of the sensor' },
      { time: '89 ms capture', note: 'SVGA, the chosen mode' },
      { time: '61 ms capture', note: 'CIF, too few pixels per drum' },
    ],
    modeAlt: '{res} capture of the meter',
    drumsAria: 'the drums at {res}',
    /** before and after quantisation, in order */
    int8: [
      { value: '61 s', label: 'Float32', note: 'capture to prediction, before quantisation' },
      { value: '17 s', label: 'INT8 + ESP-NN', note: 'roughly 3.6× faster' },
    ],
    /** the hardware list beside the last row, in order */
    hardware: [
      { name: 'TPS63900 buck-boost', note: '~75 nA quiescent, holds 3.3 V whatever the input, rated for Li-SOCl2' },
      { name: 'Low-Iq LDOs', note: '1.5 V and 2.8 V for the camera, no switching artefacts' },
      { name: 'Ambiq AM1805 timer', note: 'powers everything down and back up on a schedule' },
      { name: 'LoRaWAN', note: 'low power, long range, an open standard the operator can run' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: 'Power optimisation · software', title: 'In-camera sub-sampling',
        body: (
          <>
            <p>The reader has to run for up to 2 years on one set of batteries. The ESP32-S3 is fairly efficient at heavy work like the vector maths a neural network needs, but it is nowhere near as efficient as Nordic&rsquo;s nRF line-up, so I used the strategies in this chapter to cut its energy use. Its wireless radios are only needed for the initial configuration, so they are turned off in deployment.</p>
            <p>The OV2640 captures up to 1600 × 1200, and it also has sub-sampling modes at 800 × 600 (SVGA) and 400 × 296 (CIF).</p>
          </>
        ),
        alt: ['OV2640 SVGA sub-sampling mode diagram showing which pixels are skipped', 'OV2640 CIF sub-sampling mode diagram'],
      },
      'pw-modes': {
        eyebrow: 'Capture modes, side by side', title: 'SVGA, the chosen mode at 89 ms',
        body: (
          <>
            <p>This is the same meter at the three resolutions, with the full frame above and the drums below at the same magnification. At 1600 × 1200 every pixel of the sensor is read out and the capture takes 350 ms, which matters because the less time the camera stays on, the less energy it uses. At 400 × 296 the capture takes only 61 ms, but the drums are left with too few pixels to read reliably.</p>
            <p>In my testing SVGA gave the best balance of quality and speed, and at 800 × 600 the network processes 4× less information than at 1600 × 1200. I did not run proper tests to back up the accuracy, although it did not suffer much in my experience.</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: 'Power optimisation · software', title: 'PWM dimming on the LEDs',
        body: <p>I first dismissed PWM dimming because the OV2640 has a rolling shutter, which could capture during the off-cycles of the PWM signal and show banding. The OV2640 did not show any banding in practice, so I run the LEDs at 20 kHz with a 50 % duty cycle, which saves some power and adds brightness control.</p>,
        alt: ['A capture showing horizontal banding across the meter face', 'A capture with PWM-dimmed LEDs and no banding'],
      },
      'pw-grey': {
        eyebrow: 'Power optimisation · software', title: 'In-camera greyscale',
        body: <p>The OV2640 converts the image to greyscale on the camera itself and returns a slightly smaller file, and although the saving is minimal or none, it was easy to implement.</p>,
        alt: ['The meter captured in greyscale by the camera', 'The same meter captured in colour'],
      },
      'pw-int8': {
        eyebrow: 'Power optimisation · software', title: 'Vector instructions and INT8',
        body: <p>Earlier builds of DrumNet ran in full-precision Float32 on the ESP32-S3, which was slow and inefficient. The ESP32-S3 has built-in vector instructions, used through the ESP-NN library, that perform several Multiply and Accumulate (MAC) operations per clock cycle, and once DrumNet was quantised to 8 bits, the time from capture to prediction fell from 61 s to 17 s, roughly 3.6× faster. I have not properly measured the gain in efficiency, although I am sure it improved a lot too.</p>,
      },
      'pw-hw': {
        eyebrow: 'Power optimisation · hardware', title: 'Low-Iq converters, a timer and LoRaWAN',
        body: (
          <ul>
            <li><b>Low Iq, high-efficiency DC-DC converters.</b> The OV2640 needs 1.5 V and 2.8 V. Buck converters are more efficient than LDOs, but their high quiescent current and more complex design add cost and board space for close to no gain, and they can introduce artefacts in the image, so I stuck with low-quiescent-current LDOs. The main 3.3 V rail would move to a special low-Iq (~75 nA) buck-boost converter, the TI TPS63900.</li>
            <li><b>Ultra-low-power timer ICs.</b> A timer IC like the Ambiq AM1805 can turn off all the components and turn them back on to a schedule, although the gain would probably be minimal.</li>
            <li><b>LoRaWAN.</b> I chose LoRaWAN for its low power and long range, and because it is an open standard, so unlike with Sigfox and NB-IoT the operator can own and run the whole network.</li>
          </ul>
        ),
      },
    },
  },

  /* ── Chapter IX: camera (FocusLab.tsx) ── */
  camera: {
    cover: {
      title: 'Camera choice', lines: ['Camera', 'choice'],
      contents: ['Two OV2640 lenses', 'The focus test'],
      lede: 'I tested two OV2640 lenses against focusing charts at 3, 4 and 6 cm.',
    },
    page: 'Camera choice',
    lab: {
      lenses: { '160': '160° lens', '120': '120° lens' },
      charts: { b: 'Chart B (ISO 12233)', a: 'Chart A (hand-drawn)' },
      cm: '{d} cm',
      lens: 'Lens',
      distance: 'Distance',
      chart: 'Chart',
      alt: '{lens}° lens, chart {chart} at {dist} cm, full frame',
      caption: 'full frame · {lens}° · {dist} cm',
      chosen: ' · the chosen setup',
      parts: { centre: 'centre', left: 'left', right: 'right' },
      cropAria: '{part} crop',
      notInFrame: 'Not in frame',
      notes: {
        '160': 'The 160° variant focuses well on close objects, but its focus seems to taper off from the centre towards the left of the image, and the effect is nowhere near as strong towards the right.',
        '120': 'The 120° variant clearly cannot focus well on close objects (macro), and its focus tapers off evenly in a cone, as expected from a fixed-focus lens.',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: 'Camera choice', title: 'A macro camera, wide enough for the drums',
        body: (
          <>
            <p>I needed a capable macro camera that was wide enough to capture the full width of the meter barrels from very close to the meter. No reputable retailer had an option that was both low-cost and had the right connector, so I bought two OV2640 cameras from Lazada, one with a 160° field-of-view lens and one with a 120° lens. They were not sold as macro cameras, but wide-angle lenses naturally have a very short focusing distance and a much deeper apparent depth of field.</p>
            <p>For the test I took an image with both cameras at 3 cm, 4 cm and 6 cm against two focusing charts. Chart A is one I drew by hand, and Chart B is Stephen H. Westin&rsquo;s ISO 12233 chart from Cornell. Each camera ran on a spare ESP32-S3 cam board with a simple web applet written with an AI agent, and it was mounted on the side of a box with a ruler running out from the lens, while the charts sat on a movable stand.</p>
          </>
        ),
        alt: 'The focus test box with the ESP32 cam board on the side and a ruler on the floor',
      },
      'cam-lab': {
        eyebrow: 'The focus test', title: 'The chosen setup, 160° at 4 cm',
        body: (
          <>
            <p>Pick a lens, a distance and a chart to see the full capture, with its centre, left and right cut from the same frame at actual pixels. These are fixed-focus lenses, so the focus is set permanently at the factory, and from here on I use the 160° variant at 4 cm.</p>
            <p className="ws-note">The chart was square to the camera with no major slants or dents, and the 120° variant tapers evenly, so the lopsided focus of the 160° variant points towards a manufacturing defect, although I have no spare cameras to test whether that is true.</p>
          </>
        ),
      },
    },
  },

  /* ── Chapter X: Prototype V2 and the enclosure ── */
  proto: {
    cover: {
      title: 'Prototype V2', lines: ['Prototype', 'V2'],
      contents: ['A shrunken-down Prototype V1', 'The size of a dev board', 'The enclosure and adapter'],
      lede: 'Prototype V2 is Prototype V1 shrunk to the size of a dev board, in a two-part enclosure that needs no tools.',
    },
    page: 'Prototype V2',
    enclosurePage: 'Enclosure',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototype V2', title: 'A shrunken-down Prototype V1',
        body: <p>Prototype V2 is a shrunken-down version of Prototype V1, which fits in tighter spaces and let me try smaller components like the Wio-SX1262 LoRa module from Seeed Studio. It has built-in battery management, power circuitry for the camera and fan, PWM-dimmable LED lights and a LoRa module. I designed the 4-layer board in KiCad, sourced the components from DigiKey and had it made by JLCPCB, and the circuits are in the report.</p>,
        alt: '3D render of the top of the Prototype V2 board from KiCad',
      },
      'v2-size': {
        eyebrow: 'Prototype V2', title: 'The size of a dev board',
        body: (
          <>
            <p>I designed the PCB to be about the same size as a typical ESP32-S3 dev board, so it fits in a smaller housing that suits meters in tighter spaces.</p>
            <p className="ws-note">Prototype V2 was made before I wrote the report, so it still carries some decisions I have since moved away from. The fan was proposed for high humidity, which may cause fogging, but it will be dropped instead if the readings are not reliable, and the power circuitry was designed before I decided to use Li-SOCl2 cells.</p>
          </>
        ),
        alt: 'The Prototype V2 PCB lying next to an ESP32-S3 development board of nearly the same size',
      },
      'en-all': {
        eyebrow: 'Enclosure', title: 'A toolless enclosure and a two-part adapter',
        body: (
          <>
            <p>The interior enclosure houses the PCB and batteries of Prototype V2. I exported the 3D file from KiCad into Onshape as the reference, modelled the camera by hand for accuracy, and designed the enclosure to need no tools: side clips snap the two halves together, grooves and pins stop them sliding sideways, platforms and posts hold the PCB without screws, and a cutout lets the LoRa IPEX cable reach the transceiver. The final print fitted and finished well, but I had to cut a hole for the camera, which was mounted flipped because of an incorrect pin layout at the assembly stage.</p>
            <p>The exterior adapter comes in two parts. The bottom half mounts against the meter and holds the camera lens about 4 cm from the dial, the focus distance chosen in the camera test, while the much wider top half leaves room to line the reader up with the barrels and means I can reuse it on other meters by redesigning only the bottom half. I had forgotten the tabs that lock the meter&rsquo;s lid, so I made room for them with a few cuts from side cutters.</p>
          </>
        ),
        /** the four pictures, in order */
        figures: [
          { alt: 'The KiCad 3D model of the board with the camera modelled on, used as the reference in Onshape', caption: 'the KiCad export used as the reference in Onshape' },
          { alt: 'The final printed interior enclosure with the board inside', caption: 'the printed interior enclosure' },
          { alt: 'A CAD section through the adapter showing the camera about 4 cm from the meter face', caption: 'a section through the adapter, 4 cm from the dial' },
          { alt: 'The completed adapter mounted on the meter', caption: 'the adapter mounted on the meter' },
        ],
      },
    },
  },

  /* ── Chapter XI: conclusion ── */
  conclusion: {
    cover: {
      title: 'Conclusion', lines: ['Conclusion'],
      contents: ['Where the project stands', 'The report'],
      lede: 'The reader gets 56 % of readings right against a 99 % target, and this chapter covers what it would take to close the gap.',
    },
    page: 'Conclusion',
    row: {
      eyebrow: 'Conclusion', title: 'Where the project stands',
      body: (
        <>
          <p>Because of time constraints the project stops where it is, and many issues still need to be addressed before it could be a viable solution. I have not measured its energy use or tested it against the rated 2-year life, and I do not think Prototype V2 can reach that rating as it stands, so a third revision with more energy-saving components is needed before it is worth monitoring consumption. The firmware, on the other hand, is close to the efficiency I was aiming for.</p>
          <p>DrumNet V10 reads 56 % of readings correctly, far short of the 99 % target. The main bottleneck is WindowNet, because most wrong readings came from it failing to find the correct ROI. The readers also show signs of under-training, and a meter they have not seen gives a low confidence because the dataset was dominated by the 9 meters SimGen2 could generate, so a larger and more diverse dataset could help both. The shell is much too bulky for a real deployment, mostly because of the camera&rsquo;s height, so I need a shorter camera that is better at macro imaging, and weather sealing will need different materials and designs.</p>
          <p className="ws-note">Much of this project was my first attempt at something new, and although I am not exactly satisfied with the outcome, I am proud of the knowledge and experience I have gained, and grateful for the rare opportunity of time, resources and support to learn and experiment the way I do. Thank you to Mr Alex Oh (NYP) for his guidance, expertise and encouragement, to Mr Soh (NYP), without whom I would not have got the camera working, and to Mr Lee Chang Fatt (NYP) for the LoRaWAN gateway.</p>
        </>
      ),
    },
    /** the four figures beside it, in order */
    figures: [
      { value: '56 %', label: 'full pipeline', note: '808 of 1,440 readings correct' },
      { value: '99 %', label: 'the target', note: 'the whole reading correct' },
      { value: '93.2 %', label: 'DrumNet alone', note: 'pooled test set, WindowNet left out' },
      { value: '2 yr', label: 'the target life', note: 'not yet measured, and a V3 board is needed first' },
    ],
  },

  /* ── Chapter XII: the report ── */
  report: {
    title: 'The report',
    frameTitle: 'OCR Water Meter Reader report (PDF)',
    name: 'OCR Water Meter Reader',
    about: 'Low cost and power vision-based OCR solution for reading water meters. Braven Chiam, NYP Electronic and Computer Engineering. 58 pages, PDF, 6.8 MB.',
    open: 'Open the report',
    note: 'I used AI tools heavily in developing this project. I wrote most of the report myself in my own words, except for the introduction and certain graphs, and other AI use included research, chart generation and data verification. This project scores a Level 3 on my scale of AI use.',
  },
};

export type WaterslopCopy = typeof en;
export default en;
