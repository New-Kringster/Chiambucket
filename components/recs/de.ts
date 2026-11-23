import type { RecsCopy } from './en';

/* The recommendation cards in German: a copy of en.ts with the words translated. */
const de: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'Ein Wasserzählerleser mit Akku, bei dem eine DrumNet-Pipeline mit 693K Parametern auf einem ESP32-S3 die Zählrollen liest und per LoRaWAN meldet, gebaut auf einer eigenen KiCad-Platine in einem 3D-gedruckten Gehäuse.',
    alt: 'OCR Reader mit DrumNet, eine OCR-Lösung für Wasserzähler',
  },
  'proj-june': {
    title: 'Project June',
    blurb: 'Ein 5G-Rover mit drei Live-Kamerabildern, GPS, einem Laserpointer und sieben Sensoren, gesteuert über eine Webkonsole.',
    alt: 'Der Rover von Project June',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'Ein Schreibtisch-Haustier auf einem M5Stack Tab5, dessen Gehirn der DeepSeek Harness auf meinem Server ist. So kann es einen Browser bedienen, eigene Apps bauen und meine anderen Agents im Blick behalten.',
    alt: 'Pip, ein türkises Schreibtisch-Haustier, auf dem M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'Ein selbst gebasteltes LiDAR: vier Abstandssensoren auf Stack-chans Kopf, die seine Servos durch einen Raum schwenken, während seine Kamera einen 3D-Scan einfärbt, den du im Browser erkunden kannst.',
    alt: 'Stack-chan mit vier Unit-ToF4M-Abstandssensoren auf dem Kopf',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'Ein privater Online-Buchleser nur auf Einladung, mit Live-Anwesenheit, Weiterlesen pro Leser, einer per SQL erzwungenen Inhaltssperre, Webtoons und gemeinsamen Lesestatistiken, gebaut mit Next.js und Supabase.',
    alt: 'BeadReader, ein privater Buchleser',
  },
  'proj-pantry': {
    title: 'Haltbarkeits-Tracker',
    blurb: 'Ein Haltbarkeits-Tracker für die Kühlschranktür auf einem M5Stack CoreS3 SE und einem QRCode-Modul: Du scannst einen Barcode, wählst, wann er abläuft, und siehst, was du zuerst essen solltest, mit Erinnerungen in Home Assistant.',
    alt: 'Der Haltbarkeits-Tracker, ein CoreS3 SE auf dem QRCode-Modul',
  },
  'proj-ruler': {
    title: 'Scroll-Lineal',
    blurb: 'Ein digitales Lineal aus einem M5Stack AtomS3R und einer Unit Scroll: Drück das Rad runter, roll es an etwas entlang, und der Bildschirm zeigt, wie lang es ist, nach einer einmaligen Kalibrierung auf 10 cm.',
    alt: 'Das Scroll-Lineal, ein AtomS3R mit angesteckter Unit Scroll',
  },
  'proj-cadmouse': {
    title: '3D-CAD-Maus',
    blurb: 'Ein M5Stack Capsule als kabellose 3D-Maus für Onshape: Klick auf die Taste, dreh es in der Hand, und das Modell auf dem Bildschirm dreht sich mit.',
    alt: 'Der M5Stack Capsule v1.1, der als 3D-Maus arbeitet',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Zwei ESP32-Handgeräte, die Text über LoRa und grobe Sprache in beide Richtungen über ESP-NOW schicken, auf meiner ersten Platine, entworfen in KiCAD, mit einem in Onshape modellierten Gehäuse.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'Ein sprachgesteuerter Assistent für einen smarten Raum auf einem ESP32, bei dem Whisper und ein DeepSeek-LLM über OpenRouter Sprache in einen einzigen JSON-Befehl per MQTT verwandeln.',
    alt: 'LUMEN, ein Sprachassistent',
  },
  'proj-ema': {
    title: 'EMA Smart Home',
    blurb: 'Ein Smart Home im Team, mit A bewertet, bei dem vier BeagleBone-Black-Knoten an einen SocketIO-Server mit Live-3D-Dashboard in Spline melden.',
    alt: 'Das EMA-Smart-Home-System',
  },
  'proj-pandus': {
    title: 'Pandus-Dispenser',
    blurb: 'Mein erstes Schulprojekt war ein sechsteiliger, 3D-gedruckter Sirupspender, gesteuert von einem Arduino Uno und PyFirmata.',
    alt: 'Pandus-Dispenser',
  },
  'proj-elecf': {
    title: 'ELEC-F-Konzept',
    blurb: 'Ein Alarm für einen begehbaren Gefrierraum auf M5Stack. Ist jemand drin, wenn die Tür zufällt, startet ein Timer, und wenn er abläuft, geht der Alarm los.',
    alt: 'ELEC-F-Konzept',
  },
  'proj-kauli': {
    title: 'Kauli-Konzept',
    blurb: 'Ein Produktkonzept, das ich für ein Modul zu Kommunikationsfähigkeiten gepitcht habe, gerendert in Blender.',
    alt: 'Kauli-Konzept',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'Ein ultraleichtes Gehäuse für eine Gaming-Maus auf Basis der ZeroMouse, das ich auf etwa 20 g bringen will.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: 'Ein Nachbau des Dev-Boards meiner Schule in KiCAD, weil ich das Original nicht mit nach Hause nehmen konnte.',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Webentwicklung',
    blurb: 'Meine erste voll funktionsfähige Website, gebaut mit HTML und CSS als Abschlussaufgabe für meinen Kurs in Webentwicklung.',
    alt: 'Projekt Webentwicklung',
  },
  'proj-mc': {
    title: 'Minecraft-Livekarte',
    blurb: 'Ein Paper-Server in Docker auf meinem Homelab, mit einer Live-Dynmap der Welt.',
    alt: 'Minecraft-Livekarte',
  },
};
export default de;
