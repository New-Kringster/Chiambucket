import type { RecsCopy } from './en';

/* The recommendation cards in Dutch: a copy of en.ts with the words translated. */
const nl: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'Een watermeterlezer op een batterij, waarin een DrumNet-pipeline van 693K parameters op een ESP32-S3 de telrollen leest en via LoRaWAN doorgeeft, gebouwd op een eigen KiCad-printplaat in een 3D-geprinte behuizing.',
    alt: 'OCR Reader met DrumNet, een OCR-oplossing voor watermeters',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'Een 5G-rover met drie live camerabeelden, gps, een laserpointer en zeven sensoren, die je bestuurt vanuit een webconsole.',
    alt: 'De rover van Project June',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'Een bureauhuisdier op een M5Stack Tab5 met de DeepSeek Harness op mijn server als brein, zodat het een browser kan bedienen, zijn eigen apps kan bouwen en mijn andere agents in de gaten kan houden.',
    alt: 'Pip, een cyaan bureauhuisdier, op de M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'Een zelfgemaakte LiDAR: vier afstandssensoren op het hoofd van Stack-chan, die zijn servo’s door een kamer laten zwaaien, terwijl zijn camera een 3D-scan inkleurt die je in de browser kunt verkennen.',
    alt: 'Stack-chan met vier Unit ToF4M-afstandssensoren op zijn hoofd',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'Een privé online boekenlezer, alleen op uitnodiging, met live aanwezigheid, verder lezen per lezer, een inhoudsfilter dat SQL afdwingt, webtoons en gedeelde leesstatistieken, gebouwd met Next.js en Supabase.',
    alt: 'BeadReader, een privé boekenlezer',
  },
  'proj-pantry': {
    title: 'Houdbaarheidstracker',
    blurb: 'Een houdbaarheidstracker voor de koelkastdeur op een M5Stack CoreS3 SE en een QRCode-module: je scant een barcode, kiest wanneer het over de datum gaat en ziet wat je het eerst moet opeten, met herinneringen in Home Assistant.',
    alt: 'De houdbaarheidstracker, een CoreS3 SE op de QRCode-module',
  },
  'proj-ruler': {
    title: 'Scroll Ruler',
    blurb: 'Een digitale liniaal van een M5Stack AtomS3R en een Unit Scroll: druk het wieltje in, rol het ergens langs en het scherm laat zien hoe lang het is, na één keer kalibreren op 10 cm.',
    alt: 'De Scroll Ruler, een AtomS3R met een Unit Scroll eraan',
  },
  'proj-cadmouse': {
    title: '3D CAD-muis',
    blurb: 'Een M5Stack Capsule als draadloze 3D-muis voor Onshape: klik op de knop, draai hem in je hand en het model op het scherm draait mee.',
    alt: 'De M5Stack Capsule v1.1 die als 3D-muis werkt',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Twee ESP32-handhelds die tekst sturen via LoRa en ruwe tweerichtingsspraak via ESP-NOW, op mijn eerste printplaat, ontworpen in KiCAD, met een behuizing gemodelleerd in Onshape.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'Een spraakgestuurde assistent voor een slimme kamer op een ESP32, waarbij Whisper en een DeepSeek-LLM via OpenRouter spraak omzetten in één JSON-commando via MQTT.',
    alt: 'LUMEN, een spraakassistent',
  },
  'proj-ema': {
    title: 'EMA Smart Home',
    blurb: 'Een smart home dat we als team bouwden, beoordeeld met een A, waarin vier BeagleBone Black-nodes rapporteren aan een SocketIO-server met een live 3D-dashboard in Spline.',
    alt: 'Het EMA Smart Home-systeem',
  },
  'proj-pandus': {
    title: 'Pandus Dispenser',
    blurb: 'Mijn eerste schoolproject was een 3D-geprinte siroopdispenser van zes onderdelen, aangestuurd door een Arduino Uno en PyFirmata.',
    alt: 'Pandus Dispenser',
  },
  'proj-elecf': {
    title: 'ELEC-F Concept',
    blurb: 'Een alarm voor een walk-in vriezer op M5Stack. Is er iemand binnen als de deur dichtgaat, dan start een timer en gaat het alarm af als die afloopt.',
    alt: 'ELEC-F Concept',
  },
  'proj-kauli': {
    title: 'Kauli Concept',
    blurb: 'Een productconcept dat ik pitchte voor een module over communicatievaardigheden, gerenderd in Blender.',
    alt: 'Kauli Concept',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'Een ultralichte gamingmuisbehuizing op basis van de ZeroMouse, die ik terug wil brengen naar zo’n 20 g.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: 'Een namaak in KiCAD van het devboard van mijn school, gemaakt omdat ik het origineel niet mee naar huis mocht nemen.',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Webdev-project',
    blurb: 'Mijn eerste volledig werkende website, gebouwd met HTML en CSS als eindopdracht voor mijn vak webontwikkeling.',
    alt: 'Webontwikkelingsproject',
  },
  'proj-mc': {
    title: 'Minecraft Live Map',
    blurb: 'Een Paper-server in Docker op mijn homelab, met een live Dynmap van de wereld.',
    alt: 'Minecraft Live Map',
  },
};
export default nl;
