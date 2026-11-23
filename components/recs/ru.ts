import type { RecsCopy } from './en';

/* The recommendation cards in Russian: a copy of en.ts with the words translated. */
const ru: RecsCopy = {
  'proj-waterslop': {
    title: 'OCR Reader',
    blurb: 'Считыватель водяного счётчика на батарейке: конвейер DrumNet на 693K параметров на ESP32-S3 читает барабаны и отправляет показания по LoRaWAN, а всё собрано на своей плате из KiCad в корпусе с 3D-принтера.',
    alt: 'OCR Reader с DrumNet, решение для OCR водяного счётчика',
  },
  'proj-june': {
    title: 'Project June',
    blurb: '5G-ровер с тремя живыми камерами, GPS, лазерной указкой и семью датчиками, которым управляют из веб-консоли.',
    alt: 'Ровер Project June',
  },
  'proj-pip': {
    title: 'Pip',
    blurb: 'Настольный питомец на M5Stack Tab5, у которого вместо мозга DeepSeek Harness на моём сервере, поэтому он умеет управлять браузером, собирать свои приложения и присматривать за другими моими агентами.',
    alt: 'Pip, бирюзовый настольный питомец, на M5Stack Tab5',
  },
  'proj-lidar': {
    title: 'Stack-chan LiDAR',
    blurb: 'Самодельный LiDAR: четыре датчика расстояния на голове Stack-chan, которые его сервоприводы проводят по комнате, а камера раскрашивает 3D-скан, который можно изучать в браузере.',
    alt: 'Stack-chan с четырьмя датчиками расстояния Unit ToF4M на голове',
  },
  'proj-beadreader': {
    title: 'BeadReader',
    blurb: 'Закрытая онлайн-читалка только по приглашениям: присутствие в реальном времени, своё место чтения у каждого, ограничение контента на уровне SQL, вебтуны и общая статистика чтения. Сделана на Next.js и Supabase.',
    alt: 'BeadReader, закрытая читалка книг',
  },
  'proj-pantry': {
    title: 'Трекер сроков годности',
    blurb: 'Трекер сроков годности для дверцы холодильника на M5Stack CoreS3 SE и модуле QRCode: сканируете штрихкод, выбираете срок и видите, что съесть первым, а напоминания приходят в Home Assistant.',
    alt: 'Трекер сроков годности: CoreS3 SE на модуле QRCode',
  },
  'proj-ruler': {
    title: 'Линейка Scroll',
    blurb: 'Цифровая линейка из M5Stack AtomS3R и Unit Scroll: нажмите колёсико, прокатите его вдоль предмета, и экран покажет длину. Нужна только одна калибровка на 10 см.',
    alt: 'Линейка Scroll: AtomS3R с подключённым Unit Scroll',
  },
  'proj-cadmouse': {
    title: '3D-мышь для CAD',
    blurb: 'M5Stack Capsule в роли беспроводной 3D-мыши для Onshape: нажмите кнопку, поверните его в руке, и модель на экране повернётся вместе с ним.',
    alt: 'M5Stack Capsule v1.1, который работает как 3D-мышь',
  },
  'proj-lora': {
    title: 'LoRA Messenger',
    blurb: 'Два портативных устройства на ESP32, которые передают текст по LoRa и грубый двусторонний голос по ESP-NOW. Это моя первая плата, разведённая в KiCAD, а корпус смоделирован в Onshape.',
    alt: 'LoRA Messenger',
  },
  'proj-lumen': {
    title: 'LUMEN',
    blurb: 'Голосовой ассистент умной комнаты на ESP32: Whisper и LLM DeepSeek через OpenRouter превращают речь в одну JSON-команду, которая уходит по MQTT.',
    alt: 'Голосовой ассистент LUMEN',
  },
  'proj-ema': {
    title: 'Умный дом EMA',
    blurb: 'Командный умный дом с оценкой A: четыре узла на BeagleBone Black отчитываются серверу SocketIO с живой 3D-панелью в Spline.',
    alt: 'Система умного дома EMA',
  },
  'proj-pandus': {
    title: 'Дозатор Pandus',
    blurb: 'Мой первый учебный проект: дозатор сиропа из шести напечатанных на 3D-принтере деталей, которым управляют Arduino Uno и PyFirmata.',
    alt: 'Дозатор Pandus',
  },
  'proj-elecf': {
    title: 'Концепт ELEC-F',
    blurb: 'Сигнализация для холодильной камеры на M5Stack. Если дверь закрылась, а внутри кто-то есть, запускается таймер, и когда он истекает, звучит тревога.',
    alt: 'Концепт ELEC-F',
  },
  'proj-kauli': {
    title: 'Концепт Kauli',
    blurb: 'Концепт продукта, который я представил на курсе по навыкам общения, с рендерами в Blender.',
    alt: 'Концепт Kauli',
  },
  'proj-sol': {
    title: 'Series One Light',
    blurb: 'Сверхлёгкий корпус игровой мыши по мотивам ZeroMouse, который я хочу довести примерно до 20 г.',
    alt: 'Series One Light',
  },
  'proj-copyboard': {
    title: 'Copy Board',
    blurb: 'Копия учебной отладочной платы из моего колледжа в KiCAD, потому что оригинал нельзя было забрать домой.',
    alt: 'Copy Board',
  },
  'proj-webdev': {
    title: 'Веб-проект',
    blurb: 'Мой первый полностью рабочий сайт на HTML и CSS, итоговое задание по курсу веб-разработки.',
    alt: 'Проект по веб-разработке',
  },
  'proj-mc': {
    title: 'Живая карта Minecraft',
    blurb: 'Сервер Paper в Docker на моём HomeLab с живой картой мира на Dynmap.',
    alt: 'Живая карта Minecraft',
  },
};
export default ru;
