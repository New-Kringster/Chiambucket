/* The Project June article's English words. Every other language fills the same shape (./<lang>.tsx).
   The code keeps the images, clips, ids, hrefs and the tool icons' product names; text for a list is
   keyed by the id it belongs to. Kept in English and out of this file: the driving console's readout
   values (the brightness steps Dark, Ambient, Bright and VBright, the GPS place names, the numbers and
   their units), which reproduce what the real console shows. */
const en = {
  meta: {
    title: 'Project June | Braven Chiam',
    description: 'A 5G rover I built in three weeks, where an ESP32-S3 and three phones stream three live camera feeds, GPS and sensor readings to a web console that I drive it from.',
    ogDescription: 'A 5G rover with three live camera feeds, GPS, sensors and MQTT telemetry.',
  },
  /** the prose in the page's JSON-LD (its description is meta.description) */
  ld: { headline: 'Project June' },
  hero: {
    alt: 'Project June, a 5G radio-controlled vehicle',
    back: 'Back to projects',
    tag: 'Personal project',
    title: <>Project <em>June</em></>,
    lead: 'I built this 5G rover because I wanted a Mars rover, and it streams three live camera feeds, GPS and sensor readings (temperature, humidity, pressure and brightness) to a web console that I drive it from.',
    builtWith: 'Built with',
    /** the key links: GitHub, the build video */
    links: ['GitHub', 'Watch the build'],
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    Demo: 'Demo', ProjectJune: 'Overview', OnboardSys: 'On board', Ultras: 'Ultrasonic sensor', Laser: 'Laser',
    Gps: 'GPS', IMU: '10-axis IMU', Lightsensor: 'Light sensor', Dht11: 'DHT11', TechArch: 'Architecture',
    Livestr: 'Video', ctrlntelm: 'Control and telemetry', Software: 'Software', softD: 'Console design', Driving: 'Driving it',
  },
  demo: { h: 'Demo', video: 'Project June demo video' },
  overview: {
    h: 'Overview',
    p: 'I planned two weeks for Project June and it took three. It was rushed and there is a lot I would do differently, but it is still one of the most ambitious things I have built.',
    alt: 'The original Project June rover',
    caption: 'The first photo of Project June',
  },
  onboard: {
    h: 'On board',
    p: 'An ESP32-S3 reads the sensors, drives the motor and sends the telemetry, while three phones on board give the rover its 5G hotspot and its front, left and right camera views. The DC motor runs through a MOSFET motor driver I built, and a 2S3P lithium-ion pack I made from three 2S packs extends the range, while a power bank supplies the ESP32 and the phones.',
    alt: 'Parts diagram of Project June: three phones, the ESP32-S3, sensors, motor driver, power bank and battery pack',
  },
  /** the on-board sensor sections, by section id */
  sensors: {
    Ultras: {
      h: 'Ultrasonic sensor',
      p: 'The ultrasonic sensor is mounted at the back, so it tells me how far away any obstacles behind the rover are.',
      alt: 'The ultrasonic distance sensor and its console readout',
    },
    Laser: {
      h: 'Laser',
      p: 'A laser diode sits on a 3G servo at the front, and I can aim it up to 45° either way from the console.',
      alt: 'The laser diode on its servo and its console control',
    },
    Gps: {
      h: 'GPS',
      p: "A Neo8M module gives the rover's live position, which shows up on the console map.",
      alt: 'The Neo8M GPS module and the console map',
    },
    IMU: {
      h: '10-axis IMU',
      p: 'One board gives me accelerometer, gyroscope and barometer readings, although I never used its magnetometer.',
      alt: 'The 10-axis IMU board and its console readout',
    },
    Lightsensor: {
      h: 'Light sensor',
      p: 'The light sensor is a TEMT6000, and because I could not calibrate it, the console shows brightness in four steps: Dark, Ambient, Bright and VBright.',
      alt: 'The TEMT6000 light sensor and its console readout',
    },
    Dht11: {
      h: 'DHT11',
      p: 'The DHT11 measures the ambient temperature and humidity.',
      alt: 'The DHT11 temperature and humidity sensor and its console readout',
    },
  },
  arch: {
    h: 'Architecture',
    p: 'This diagram shows the three parts of the system, the rover, the server and the client, and what runs between them.',
    alt: 'Architecture diagram: the rover with its sensors and three phones, a server running Mosquitto, a Node.js Socket.IO server and CoTURN, and the client console with an Xbox controller',
  },
  video: {
    h: 'Video',
    p1: 'Each phone sends its camera as its own WebRTC stream, three in total, relayed through a TURN server so the video works over mobile data.',
    p2: 'Below is a rebuild of the console with footage from a day run and a night run, and you can select a stage of the signal path or a camera to take a closer look.',
    systemAlt: 'Diagram of the live video system',
    routingAlt: 'Diagram of the WebRTC stream routing',
  },
  /** the rebuilt driving console (CommandLink) */
  console: {
    /** follows the bold label before each blurb */
    labelEnd: '.',
    tag: 'Driving console',
    /** the line beside the tag, by run */
    rebuilt: { day: 'Rebuilt from the day run', night: 'Rebuilt from the night run' },
    toggleAria: 'Choose the day or night run',
    day: 'Day run',
    night: 'Night run',
    signalPath: 'Signal path',
    trackAria: 'Signal path from controller to rover',
    /** the four stages of the signal path, by id; the longest blurb sizes the blurb box */
    nodes: {
      pad: {
        label: 'Xbox controller',
        sub: 'Bluetooth to the console',
        blurb: 'The controller pairs with the web console over Bluetooth, and the console turns stick and trigger input into movement commands that it publishes over MQTT.',
      },
      server: {
        label: 'Server',
        sub: 'MQTT, signalling, TURN',
        blurb: 'Mosquitto brokers the commands and the telemetry, a Node.js Socket.IO server serves the console and handles the WebRTC signalling, and CoTURN relays the video so that it works over mobile data.',
      },
      phones: {
        label: 'Three phones',
        sub: '5G hotspot and cameras',
        blurb: 'Phone 1 is the main 5G hotspot and the front camera, Phone 2 is a second hotspot and the left camera, and Phone 3 joins the hotspot as the right camera, with each one sending its view as a WebRTC stream.',
      },
      rover: {
        label: 'ESP32-S3',
        sub: 'On the rover',
        blurb: 'It joins the phone hotspot over Wi-Fi, drives the motor through the MOSFET driver and sends the sensor data back over MQTT in three packets at about 10 Hz.',
      },
    },
    /** the flow key under the signal path */
    flow: { out: 'Commands', back: 'Video and telemetry' },
    telemetry: 'Telemetry',
    /** the telemetry readouts' names, by metric */
    metrics: {
      lat: 'Latitude', lon: 'Longitude', speed: 'Speed', alt: 'Altitude',
      temp: 'Temperature', hum: 'Humidity', sats: 'Satellites',
    },
    brightness: 'Brightness',
    gpsFix: 'GPS fix',
    cameras: 'Camera feeds',
    camsAria: 'Choose the main camera',
    live: 'LIVE',
    /** the main camera's video label, by run; {label} is the camera's name */
    camAria: { day: '{label} camera, day run', night: '{label} camera, night run' },
    /** the three cameras, by position: name, phone, note, and the thumbnail button's label */
    feeds: {
      left: { label: 'Left', phone: 'Phone 2', note: 'Phone 2 is the second hotspot and the left camera.', show: 'Show the left camera (Phone 2)' },
      center: { label: 'Front', phone: 'Phone 1', note: 'Phone 1 is the main 5G hotspot and the front camera.', show: 'Show the front camera (Phone 1)' },
      right: { label: 'Right', phone: 'Phone 3', note: 'Phone 3 joins the hotspot and is the right camera.', show: 'Show the right camera (Phone 3)' },
    },
  },
  control: {
    h: 'Control and telemetry',
    p1: 'The ESP32 publishes sensor data to an MQTT topic that the client subscribes to, and the client sends movement and other commands back to the ESP32 on a second topic.',
    alt1: 'Diagram of the control and telemetry system',
    packetsH: 'Three packets',
    p2: 'I could not get all the sensor data into one MQTT message and have not worked out why yet, so it goes out as three separate packets at about 10 Hz.',
    alt2: 'Diagram of the three telemetry packets',
  },
  software: {
    h: 'Software',
    p: 'This is a simplified flow chart of the code.',
    alts: ['Software flow chart, part 1', 'Software flow chart, part 2'],
  },
  design: {
    h: 'Console design',
    p: 'I designed the console in Figma.',
    embed: 'Project June console design in Figma',
    splineH: 'Spline 3D',
    splineP: 'The 3D rover in the console is a Spline model, which moves to the forward view when I push the controller forward and to the reverse view when I pull it back.',
    modelAlt: 'The Spline 3D rover model',
    modelCaption: 'The Spline model',
    viewCaption: 'The view change in the console',
  },
  driving: {
    h: 'Driving it',
    p: 'The video came from over 8 km away and passed through every part of the system, so there was about one second of delay between a controller input and the movement on the live feed. The stream was not always stable either, which made driving hard at times.',
    repo: {
      title: 'Project June on GitHub',
      text: 'The repository holds the console, the WebRTC video, the MQTT telemetry and the ESP32 firmware.',
      button: 'View the code on GitHub',
    },
  },
};

export type ProjectJuneCopy = typeof en;
export default en;
