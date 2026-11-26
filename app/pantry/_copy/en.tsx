/* The Pantry Expiry Tracker article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The simulator's screen keeps the firmware's own English labels (SCAN NOW, Days, EXPIRES...), so they are not here. */
const en = {
  meta: {
    title: 'Pantry Expiry Tracker | Braven Chiam',
    description: 'An expiry tracker for the fridge door, built on an M5Stack CoreS3 SE and a QRCode module during my internship at M5Stack. You scan a barcode and pick when it expires, and the screen always shows what to eat first, while a small server names the products and sends reminders to Home Assistant.',
    ogDescription: 'Scan a barcode, pick when it expires, and the fridge door shows what to eat first.',
  },
  ld: {
    headline: 'Pantry Expiry Tracker',
    about: ['M5Stack CoreS3 SE', 'ESP32-S3', 'barcode scanner', 'Home Assistant', 'MQTT', 'Open Food Facts'],
  },
  hero: {
    alt: 'The pantry tracker: a CoreS3 SE stacked on the QRCode module and its battery base, the screen glowing red while it scans',
    back: 'Back to projects',
    tag: 'Internship project',
    title: <>Pantry <em>Expiry Tracker</em></>,
    lead: 'I built this expiry tracker for the fridge door during my internship at M5Stack. You scan a product’s barcode and pick when it expires, and the screen always shows what to eat first, with product names in Chinese or English.',
    builtWith: 'Built with',
    /** the key links: GitHub, the M5Stack blog post, the firmware on M5Burner, the latest release */
    links: ['GitHub', 'Read on M5Stack', 'Flash the firmware', 'Server downloads'],
    meta: 'Internship project at M5Stack, November 2026. M5Stack CoreS3 SE, Module13.2 QRCode, C++, Python, Docker, MQTT.',
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    demo: 'Demo', try: 'Try it', features: 'What it does', scan: 'Scan a product', first: 'What to eat first',
    again: 'Scan again to open it', swipe: 'Swipe to delete', pantries: 'Several pantries', control: 'Control centre',
    web: 'In a browser', ha: 'Home Assistant', how: 'How it works', hardware: 'Hardware', setup: 'Setting one up',
  },
  demo: {
    h: 'Demo',
    p: 'I filmed this at my desk, first scanning products off a demo sheet on my laptop and then a real carton of 冰红茶, before scanning the carton a second time and moving to a second pantry.',
    video: 'The tracker in use: scanning products, a real carton, scanning it again and switching pantries',
    /** the four moment cards, in time order */
    moments: [
      { label: 'Scanning from the demo sheet', note: 'Nutella, Coca-Cola and Ritter Sport off my laptop screen' },
      { label: 'A real carton', note: 'A carton of 冰红茶, named by GS1 China' },
      { label: 'Scanning it again', note: 'The saved carton opens instead of being added twice' },
      { label: 'Another pantry', note: 'Switching to the fridge and adding to it' },
    ],
  },
  try: {
    h: 'Try it',
    p: <>This is a copy of the tracker’s screen that runs the same steps. Tap <b>SCAN NOW</b> and pick a product from the shelf to hold up to the scanner, then set when it expires and save it. You can also swipe a card to the left to delete it, and scanning something that is already on the list opens it instead.</>,
    note: 'The barcodes on the shelf are the products’ real EAN-13 codes, so the tracker itself can scan them off this page.',
  },
  /** the simulator's words around the screen (PantrySim); {name} is a product, {days} the screen's own label */
  sim: {
    live: {
      home: 'The pantry, {n} items, sorted by what expires first.',
      scan: 'Scanning. Pick a product from the shelf to hold up to the scanner.',
      entry: '{name}. Set when it expires, then save it.',
      detail: '{name}, already on the list. {days}.',
    },
    list: 'Pantry',
    card: '{name}, {days}',
    remove: 'Delete {name}',
    cancel: 'Cancel',
    back: 'Back',
    more: { d: 'More days', w: 'More weeks', m: 'More months' },
    fewer: { d: 'Fewer days', w: 'Fewer weeks', m: 'Fewer months' },
    hintScan: 'Pick a product to hold up to the scanner',
    hint: 'Tap a product to scan it',
    scan: 'Scan {name}',
    scanSaved: 'Scan {name}, already on the list',
    onList: 'on the list',
    /** the shelf's short names, by barcode */
    shelf: {
      '5449000000996': 'Coca-Cola', '3256540000698': 'Pains au lait', '6909548500734': '冰红茶',
      '3046920029759': 'Lindt dark', '3017620425035': 'Nutella',
    } as Record<string, string>,
    reset: 'Start over',
  },
  features: {
    h: 'What it does',
    p: 'The tracker sits on the fridge door, and every screen below is a capture from it.',
  },
  scan: {
    h: 'Scan a product',
    alt: 'The expiry picker for 牛奶面包 by Brioche Pasquier, with Days 0, Weeks 1 and Months 0, a week from today, and a green SAVE button',
    p1: <>When you tap <b>SCAN NOW</b> and hold a barcode about a hand’s width from the scan window, the screen glows red while the scanner looks for a code. The tracker then shows the product’s name, brand, size and photo, which mostly come from Open Food Facts, while products sold in mainland China come from GS1 China through a free account.</>,
    p2: <>You set the expiry with the arrows under Days, Weeks and Months and then tap <b>SAVE</b>.</>,
  },
  first: {
    h: 'See what to eat first',
    alt: 'The home screen: Prince expired in red, Pesto alla Genovese in 2 days and Skyr in 5 days in amber, with SCAN NOW at the bottom',
    p: 'The home screen lists the pantry with the soonest expiry at the top, and the count turns red within a day of the date and amber within a week.',
  },
  again: {
    h: 'Scan again to open it',
    alt: 'The item page for Barilla Pesto alla Genovese: added today, expires Wednesday 2026-11-11, 2 days, with a red DELETE button',
    p: 'Scanning something that is already on the list opens it instead of adding it twice, so you can check its date or delete it from there.',
  },
  swipe: {
    h: 'Swipe to delete',
    alt: 'The Prince card slid to the left, showing a red bin button',
    p: 'Swiping an item from right to left shows a red bin to tap, and swiping from left to right anywhere takes you back.',
  },
  pantries: {
    h: 'Keep several pantries',
    alt: 'The pantry menu open: Default Pantry with 6 items, Fridge with 1, and Create Pantry',
    p: <>The <b>Pantry</b> button switches between pantries such as the fridge, the freezer or a cupboard, and it can create a new one too.</>,
  },
  control: {
    h: 'A control centre',
    alt: 'The control centre: a beep switch, a brightness slider, 100% battery and Home Assistant connected',
    p: 'The status button at the top right opens the beep switch, the screen brightness and the battery level, and its house icon turns green when the tracker is connected to Home Assistant.',
  },
  web: {
    h: 'Manage it from a browser',
    p: 'The same list is on a web page, where you can add items by barcode, rename them and organise pantries from a computer or a phone. A small badge beside each name shows where it came from, such as OFF for Open Food Facts or GS1 for GS1 China.',
    alt: 'The pantry web page: tabs for All, Default Pantry and Fridge, a barcode and date form, and the items sorted by expiry with their source badges',
    caption: 'The pantry web page',
  },
  ha: {
    h: 'Reminders in Home Assistant',
    p: 'Each pantry appears in Home Assistant as its own device, with its item count, what is expiring soon and the next item to expire. Every scan, add and delete also fires an event, so you can build your own automations on top of it, such as a reminder on your phone the day before something expires.',
    alt: 'Three devices in Home Assistant: Pantry Tracker, Default Pantry and Fridge, each with expired, expiring soon, item count and next expiry',
    caption: 'The pantry devices in Home Assistant',
  },
  how: {
    h: 'How it works',
    p: 'The tracker only handles the screen and the scanner, while a Docker container on the home network does the rest: it stores the list, looks up barcodes, caches product photos and publishes everything to Home Assistant over MQTT. I split it this way because the ESP32-S3 can’t run the GS1 China sign-in, and because keeping one list on the server means the tracker, the web page and Home Assistant always agree.',
    overviewAlt: 'System overview: the tracker on the fridge talks to the pantry server over WiFi, the server looks products up on Open Food Facts and GS1 China and publishes to Home Assistant over MQTT, and any browser can open its web page',
    overviewCaption: 'How the parts connect',
    flowAlt: 'What happens when you scan: the barcode is read over UART, the server is asked whether it is already saved, the product is looked up and cached, you pick the expiry, the item is saved and Home Assistant is updated',
    flowCaption: 'What happens when you scan',
  },
  hardware: {
    h: 'Hardware',
    /** the parts list, in order (the first two link to M5Stack's shop) */
    parts: [
      { b: 'CoreS3 SE', s: 'runs the tracker, with the touch screen and WiFi.' },
      { b: 'Module13.2 QRCode', s: 'reads 1D and 2D barcodes and stacks under the CoreS3 SE.' },
      { b: 'A battery base', s: 'goes underneath, so it runs on the fridge without a cable.' },
    ],
    fridgeAlt: 'The tracker stuck to a grey fridge door, showing its Set me up screen with a QR code',
    fridgeCaption: 'On the fridge door, ready to be set up',
    p: 'You also need a computer that stays on for the server, and Home Assistant if you want reminders.',
  },
  setup: {
    h: 'Setting one up',
    p: 'Everything you need is free to download: the firmware flashes with M5Burner, and the server comes as a Docker bundle with its images included, so nothing has to be pulled from Docker Hub while it installs.',
    /** the steps, in order; steps 1, 4 and 5 carry a picture (see Article.tsx) */
    steps: [
      <>On the QRCode module, slide the interface toggle to UART and switch on number 2 in both the TX and RX DIP blocks, then stack the three parts.</>,
      <>Open the <a href="https://burner.m5stack.com/share/firmware/R4VK5Z" target="_blank" rel="noopener">Pantry firmware on M5Burner</a>, plug the CoreS3 SE in over USB-C and burn it with the M5Burner app.</>,
      <>Download the server for the computer that will run it, either the <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-amd64.tar.gz">bundle for Intel and AMD computers</a> or the <a href="https://github.com/New-Kringster/Pantry_tracker_code/releases/latest/download/pantry-server-docker-arm64.tar.gz">bundle for Apple Silicon Macs and a Raspberry Pi</a>. Unpack it, set <code>TZ</code> in <code>docker-compose.yml</code> to your time zone and run <code>./install.sh</code> in that folder.</>,
      <>Turn the tracker on, scan the QR code on its screen with your phone, and enter your WiFi and the server address, for example <code>http://192.168.1.20:8080</code>.</>,
      <>Tap <b>SCAN NOW</b> and scan this code once, which switches the scan engine from USB to serial.</>,
      <>In Home Assistant, add the MQTT integration with the server’s IP address and port 1883.</>,
      <>For Chinese barcodes, add a free gds.org.cn account under <b>Settings</b> on the server’s web page and sign in once.</>,
    ],
    hardwareAlt: 'The interface toggle set to UART, switch 2 on in the TX and RX DIP blocks, and the CoreS3 SE stacked on the module and the battery base',
    bootAlt: 'First boot: the tracker opens a Pantry hotspot with a QR code, the phone joins it, the setup page takes the WiFi and server address, and the home screen loads',
    codeAlt: 'The scan engine setting code 21424000, Serial Communication',
    repo: <>The <a href="https://github.com/New-Kringster/Pantry_tracker_code" target="_blank" rel="noopener">GitHub repository</a> has the full guide in its README, along with the firmware and server code if you would rather build them yourself.</>,
    note: 'Product names and photos on this page come from Open Food Facts (CC BY-SA) and GS1 China.',
  },
};
export type PantryCopy = typeof en;
export default en;
