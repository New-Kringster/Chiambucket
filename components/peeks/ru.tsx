import { usePeekKit, type PeekLabels } from './kit';

/* The peek reader in Russian: the same shape as en.tsx, words translated. */

export const TITLES: Record<string, string> = {
  'proj-june': 'Project June', 'proj-lora': 'LoRA Messenger', 'proj-lumen': 'LUMEN',
  'proj-beadreader': 'BeadReader', 'proj-waterslop': 'OCR Reader', 'proj-pip': 'Pip', 'proj-pantry': 'Трекер сроков годности', 'proj-ruler': 'Линейка Scroll', 'proj-cadmouse': '3D-мышь для CAD', 'proj-lidar': 'Stack-chan LiDAR',
  'proj-ema': 'Умный дом EMA', 'proj-pandus': 'Дозатор Pandus', 'proj-elecf': 'Концепт ELEC-F',
  'proj-kauli': 'Концепт Kauli', 'proj-sol': 'Series One Light', 'proj-copyboard': 'Copy Board',
  'proj-webdev': 'Веб-разработка', 'proj-mc': 'Живая карта Minecraft',
};

export const LABELS: PeekLabels = {
  soon: 'Статья скоро',
  next: 'Дальше: {title}',
  untitled: 'Проект {n}',
  pullHint: 'Листайте дальше: {title}',
  pullAria: 'Открыть следующий проект: {title}',
  end: 'Это все проекты',
};

/* ── Reader content for one project ── */
export function PeekBody({ id }: { id: string }) {
  const { chapter, cta, soon, hero } = usePeekKit(id, LABELS);

  switch (id) {
    case 'proj-june': return (
      <>
        {hero('Ровер Project June', ['Личный проект'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Project June</h2>
          <p className="hp-md-meta">3 недели · Самостоятельно · 3D-дизайн · Сотовая связь · WebRTC · MQTT</p>
          <p className="hp-rd-lead">5G-ровер, который я собрал за три недели: он передаёт картинку с трёх живых камер, несёт полный набор датчиков и управляется с геймпада Xbox откуда угодно, где есть сигнал.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/MnkJsx-nwoE" title="Project June" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Три живых видеопотока', <><p>Три камеры передают видео вживую по WebRTC через TURN-сервер, так что картинка проходит через NAT сотовой сети с низкой задержкой.</p><img className="hp-rd-fig" src="/images/ProjJune13.webp" alt="Камеры Project June" loading="lazy" /></>)}
          {chapter('02', 'Управление и телеметрия', <p>MQTT через брокер Mosquitto носит команды и телеметрию, а ШИМ-управление моторами и рулевой сервопривод, написанные мной, работают от геймпада Xbox.</p>)}
          {chapter('03', 'Полный набор датчиков', <><p>На ровере стоят GPS Neo8M, гироскоп, акселерометр, магнитометр, барометр, ультразвуковой дальномер, DHT11 и датчик освещённости TEMT6000.</p><img className="hp-rd-fig" src="/images/ProjJuneArchi.webp" alt="Архитектура системы Project June" loading="lazy" /></>)}
          {cta('Полный журнал сборки', 'В статье фото, архитектура и все проблемы, на которые я наткнулся.', 'Читать статью', '/project-june')}
        </div>
      </>
    );
    case 'proj-pip': return (
      <>
        {hero('Pip, голубой настольный питомец, на M5Stack Tab5', ['Проект стажировки'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Pip</h2>
          <p className="hp-md-meta">1 неделя · M5Stack Tab5 · ESP32-P4 · DeepSeek Harness · Lua · Docker</p>
          <p className="hp-rd-lead">Настольный питомец на M5Stack Tab5, мозг которого это DeepSeek Harness на моём сервере, поэтому он умеет управлять браузером, писать свои приложения и присматривать за другими моими агентами.</p>
          {chapter('01', 'Питомец, который показывает, что делает', <><p>Pip спит, когда его оставляют в покое, просыпается, когда берёшь планшет в руки, ёрзает и трёт виски, пока думает, и подпрыгивает, когда что-то получается. А ещё он изображает каждый инструмент, которым пользуется: берёт бинокль, чтобы прочитать страницу, или мегафон, чтобы дать задание помощнику.</p><img className="hp-rd-fig" src="/videos/pip/props.webp" alt="Pip с лупой, биноклем, мегафоном и бумажным самолётиком" loading="lazy" /></>)}
          {chapter('02', 'Он пользуется экраном', <p>Ответы приходят в виде страниц и оформленного текста, и Pip может щёлкать по этим страницам своим курсором или задавать мне вопросы с вариантами ответа. А ещё он пишет маленькие приложения и хранит их в ящике: это либо веб-страницы с моего сервера, либо скрипты на Lua, которые работают прямо на планшете.</p>)}
          {chapter('03', 'Центр для моих агентов', <><p>Pip работает в той же обвязке, что и мои сессии программирования, передаёт долгие задачи помощникам-пипам и сообщает мне, когда сессия закончилась или ждёт ответа.</p><img className="hp-rd-fig" src="/videos/pip/crew.webp" alt="Помощники-пипы за работой с блокнотом, ноутбуком, кубиками, книгой и колбой" loading="lazy" /></>)}
          {cta('Посмотрите на Pip в деле', 'В статье его настроения, приложения и рабочие столы и то, как всё это связано.', 'Читать статью', '/pip')}
        </div>
      </>
    );
    case 'proj-pantry': return (
      <>
        {hero('Трекер для кладовки: CoreS3 SE на модуле QRCode', ['Проект стажировки'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Трекер сроков годности</h2>
          <p className="hp-md-meta">M5Stack CoreS3 SE · Module13.2 QRCode · C++ · Python · Docker · MQTT</p>
          <p className="hp-rd-lead">Трекер сроков годности для дверцы холодильника. Вы сканируете штрихкод продукта и выбираете, когда истекает срок, а экран всегда показывает, что съесть первым.</p>
          {chapter('01', 'Сканируем и сохраняем', <><p>Пока сканер ищет код, экран светится красным, потом показывает название, бренд и фото продукта из Open Food Facts или GS1 China, а срок вы задаёте переключателями дней, недель и месяцев и сохраняете.</p><img className="hp-rd-fig" src="/images/pantry/screen-expiry-picker.webp" alt="Выбор срока годности на трекере" loading="lazy" /></>)}
          {chapter('02', 'Что съесть первым', <><p>Главный экран сортирует продукты по сроку и красит счётчик в красный, если остался день, и в янтарный, если неделя, а если отсканировать то, что уже есть в списке, оно откроется, а не добавится второй раз.</p><img className="hp-rd-fig" src="/images/pantry/screen-home.webp" alt="Главный экран, отсортированный по сроку годности" loading="lazy" /></>)}
          {chapter('03', 'Остальное делает сервер', <p>Контейнер Docker в домашней сети хранит список, ищет штрихкоды, отдаёт веб-страницу для управления кладовками и публикует каждую кладовку в Home Assistant по MQTT для напоминаний.</p>)}
          {cta('Попробуйте трекер', 'В статье рабочая копия его экрана, демо-видео и инструкция, как собрать такой же.', 'Читать статью', '/pantry')}
        </div>
      </>
    );
    case 'proj-ruler': return (
      <>
        {hero('Линейка Scroll: AtomS3R с подключённым Unit Scroll', ['Проект стажировки'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Линейка Scroll</h2>
          <p className="hp-md-meta">M5Stack AtomS3R · Atomic Battery Base · Unit Scroll · C++</p>
          <p className="hp-rd-lead">Цифровая линейка. Вы прижимаете колёсико Unit Scroll и катите его по тому, что хотите измерить, а AtomS3R показывает расстояние в сантиметрах.</p>
          {chapter('01', 'Калибровка один раз', <><p>При первом запуске вы прокатываете ровно 10&nbsp;см вдоль настоящей линейки и нажимаете на экран, чтобы сохранить насчитанные шаги, и так она узнаёт, сколько колёсико проходит за шаг. После этого калибровка хранится во флеш-памяти.</p><img className="hp-rd-fig" src="/images/scroll-ruler/reading.webp" alt="Линейка показывает 8,2 см" loading="lazy" /></>)}
          {chapter('02', 'Катите и измеряйте', <p>Расстояние считается только пока колёсико прижато и светодиод горит зелёным, так что линейку можно поднять и поставить обратно, не потеряв показание. Нажатие на экран обнуляет его, а долгое нажатие запускает новую калибровку.</p>)}
          {chapter('03', 'Проверено без устройства', <p>Вся математика калибровки и расстояния лежит в одном файле без кода для железа, так что одиннадцать юнит-тестов проверяют её на компьютере, прежде чем прошивка попадёт на AtomS3R.</p>)}
          {cta('Прокатите сами', 'В статье рабочая копия линейки, демо-видео и инструкция по прошивке.', 'Читать статью', '/scroll-ruler')}
        </div>
      </>
    );
    case 'proj-lidar': return (
      <>
        {hero('Stack-chan с четырьмя датчиками расстояния Unit ToF4M на голове', ['Проект стажировки'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Stack-chan LiDAR</h2>
          <p className="hp-md-meta">M5Stack Stack-chan · PaHub · четыре Unit ToF4M · C++ · WebGL</p>
          <p className="hp-rd-lead">Самодельный лидар. Stack-chan проводит четыре датчика расстояния по комнате своими двумя сервоприводами, камера раскрашивает точки, а любой браузер в той же сети Wi-Fi показывает скан в 3D.</p>
          {chapter('01', 'Обзор', <><p>Голова проходит сетку ряд за рядом, от горизонта до зенита и до 256 градусов в ширину, и каждое положение даёт один замер: направление от сервоприводов и расстояние от датчиков.</p><img className="hp-rd-fig" src="/images/stackchan-lidar/cloud.webp" alt="Готовый скан угла комнаты в цветах камеры" loading="lazy" /></>)}
          {chapter('02', 'Четыре датчика, один замер', <p>Все четыре датчика смотрят в одну сторону, поэтому каждый замер берёт медиану их показаний и так отбрасывает случайный выброс.</p>)}
          {chapter('03', 'Цвет от камеры', <p>Снимки, сделанные перед обзором, раскрашивают точки, а браузер выносит каждый пиксель на измеренное расстояние, и в этом скане получилось 68&nbsp;206 цветных точек.</p>)}
          {cta('Посмотрите скан', 'В статье настоящий скан в 3D, демо-ролик и инструкция по прошивке.', 'Читать статью', '/stackchan-lidar')}
        </div>
      </>
    );
    case 'proj-cadmouse': return (
      <>
        {hero('M5Stack Capsule v1.1, который работает как 3D-мышь', ['Проект стажировки'], 'internship')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">3D-мышь для CAD</h2>
          <p className="hp-md-meta">M5Stack Capsule v1.1 · Bluetooth LE · C++</p>
          <p className="hp-rd-lead">Беспроводная 3D-мышь для Onshape. Вы нажимаете кнопку на Capsule и вращаете его в руке, и модель на экране вращается вместе с ним.</p>
          {chapter('01', 'Под видом SpaceMouse', <p>Onshape слушает 3D-мышь только через драйвер 3Dconnexion, поэтому Capsule представляется по Bluetooth их SpaceMouse Wireless, а остальное делает драйвер.</p>)}
          {chapter('02', 'Следом за рукой', <><p>Он передаёт, как быстро поворачивается рука, по данным гироскопа, так что модель поворачивается на тот же угол, что и рука. Если держать кнопку, модель сдвигается, а поворот вокруг оси приближает её.</p><img className="hp-rd-fig" src="/images/cad-mouse/hold.webp" alt="Вращение корпуса в Onshape с помощью Capsule" loading="lazy" /></>)}
          {chapter('03', 'Проверено без устройства', <p>Математика движения и жесты кнопки лежат в одной библиотеке без кода для железа, так что 19 юнит-тестов проверяют их на компьютере перед каждой прошивкой.</p>)}
          {cta('Покрутите сами', 'В статье рабочая копия управления, демо-видео и инструкция, как собрать такую же.', 'Читать статью', '/cad-mouse')}
        </div>
      </>
    );
    case 'proj-lora': return (
      <>
        {hero('LoRA Messenger', ['Личный проект'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LoRA Messenger</h2>
          <p className="hp-md-meta">3 месяца · Самостоятельно · 3D-дизайн · Проектирование плат</p>
          <p className="hp-rd-lead">Пара карманных мессенджеров на ESP32, которые общаются друг с другом без всякой сети: текст по дальнобойной LoRa и двусторонний голос по ESP-NOW.</p>
          {chapter('01', 'Два радио, две задачи', <><p>LoRa передаёт текст на большое расстояние, а ESP-NOW даёт двусторонний голос с низкой задержкой, и оба устройства я запрограммировал в PlatformIO на фреймворке Arduino.</p><img className="hp-rd-fig" src="/images/Brolocator5.webp" alt="Начинка LoRA Messenger" loading="lazy" /></>)}
          {chapter('02', 'Своя плата, запаянная вручную', <><p>Я спроектировал плату в KiCAD и сам запаял SMD-компоненты оплавлением, а схема на TP4056 на плате отвечает за зарядку.</p><img className="hp-rd-fig" src="/images/Brolocator10.webp" alt="Своя печатная плата" loading="lazy" /></>)}
          {chapter('03', 'Звук и корпус', <><p>Микрофон и динамик на I2S отвечают за звонки, а два OLED-дисплея показывают сообщения и статус, и всё это внутри напечатанного на 3D-принтере корпуса, который я смоделировал в Onshape.</p><img className="hp-rd-fig" src="/images/Brolocator14.webp" alt="Корпус, напечатанный на 3D-принтере" loading="lazy" /></>)}
          {cta('Как всё сложилось', 'В статье этап с макетной платой, переделки платы и то, чему я научился.', 'Читать статью', '/brolocator')}
        </div>
      </>
    );
    case 'proj-lumen': return (
      <>
        {hero('Голосовой ассистент LUMEN', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">LUMEN</h2>
          <p className="hp-md-meta">NYP IoT Programming · ESP32 · MicroPython · Whisper · DeepSeek · MQTT</p>
          <p className="hp-rd-lead">Голосовой ассистент для умной комнаты, который просыпается, когда вы говорите «Hello Robot». ESP32 записывает, что вы скажете дальше, релей на FastAPI расшифровывает это и просит LLM выдать одну строгую JSON-команду, а эта команда уходит обратно в комнату по MQTT.</p>
          <div className="hp-md-video"><video controls preload="metadata" poster="/images/lumen-demo-poster.webp" playsInline><source src="/videos/lumen-demo.webm" type="video/webm" /><source src="/videos/lumen-demo.mp4" type="video/mp4" /></video></div>
          {chapter('01', 'Речь в одну JSON-команду', <p>ESP32 передаёт звук 16&nbsp;кГц на сервер, где Whisper расшифровывает его через OpenRouter, а LLM DeepSeek превращает в ровно одну команду (действие, последовательность или таймер), которая проверяется по схеме, прежде чем попасть на плату.</p>)}
          {chapter('02', 'Как уместить всё на плату без PSRAM', <><p>У WROOM было около 33&nbsp;КБ свободной RAM при включённом WiFi, а голосовой клип весит примерно 96&nbsp;КБ, поэтому звук передаётся через сырой сокет прямо во время записи, а не хранится в памяти, и пиковое потребление памяти при отправке держится около 10&nbsp;КБ.</p><img className="hp-rd-fig" src="/images/lumen-mic.webp" alt="Микрофон INMP441, подключённый к ESP32" loading="lazy" /></>)}
          {chapter('03', 'Комната, с которой можно поговорить', <><p>Свет, NeoPixel, вентилятор, сервопривод и пищалка реагируют на команды, а ещё есть локальный авторежим и веб-панель. Если попросить «поставь яркость по влажности», он прочитает живой датчик и сделает ровно это.</p><img className="hp-rd-fig" src="/images/lumen-dashboard.webp" alt="Веб-панель LUMEN" loading="lazy" /></>)}
          {cta('Вся сборка целиком', 'В статье ограничения по памяти, схема подключения и интерактивное демо.', 'Читать статью', '/lumen')}
        </div>
      </>
    );
    case 'proj-waterslop': return (
      <>
        {hero('OCR Reader с DrumNet: полностью вертикально интегрированное решение для распознавания счётчиков воды', ['Личный проект'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">OCR Reader</h2>
          <p className="hp-md-meta">NYP ECE · ESP32-S3 · OV2640 · DrumNet · LoRaWAN · KiCad · Onshape</p>
          <p className="hp-rd-lead">Недорогая камера на батарейке, которая крепится поверх механического счётчика воды и читает барабаны нейросетью на 693K параметров, работающей целиком на ESP32-S3, а потом отправляет число домой по LoRaWAN.</p>
          {chapter('01', 'DrumNet прямо на чипе', <><p>Поисковик находит окошко с цифрами, уточнитель находит его края, усредняя столбцы и строки карт признаков, а три читателя голосуют за каждый барабан с учётом правила переноса. Вся сеть работает в INT8 и тратит около 2 секунд на одно показание.</p><img className="hp-rd-fig" src="/images/waterslop/dia-vote.webp" alt="Голосование ансамбля DrumNet и итоговое показание" loading="lazy" /></>)}
          {chapter('02', 'Обучена шестью агентами', <><p>MeterSim рендерит размеченные счётчики, а SimGen2 делает их похожими на снимки с камеры, пока шесть ИИ-агентов по очереди занимали GPU и стенд с Jetson через планировщик бронирования, круглосуточно, через Tailscale и T3 Code.</p><img className="hp-rd-fig" src="/images/waterslop/metersim-designs.webp" alt="Девять моделей счётчиков в MeterSim" loading="lazy" /></>)}
          {chapter('03', 'Плата, корпус и 9 часов пайки', <><p>На четырёхслойной плате из KiCad есть управление батареей, LoRa и светодиоды с ШИМ. Я собрал её вручную, отладил под микроскопом и поместил в корпус, напечатанный на 3D-принтере и собирающийся без инструментов, с переходником под счётчик.</p><img className="hp-rd-fig" src="/images/waterslop/pcb-3d-top.webp" alt="3D-рендер платы Prototype V2" loading="lazy" /></>)}
          {cta('Пройдите весь конвейер', 'Статья шаг за шагом идёт по прогону DrumNet, с 3D-туром по плате, симулятором ConfigKing и полным отчётом.', 'Читать статью', '/waterslop')}
        </div>
      </>
    );
    case 'proj-beadreader': return (
      <>
        {hero('BeadReader, закрытая читалка книг', ['Личный проект'], 'highlight')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">BeadReader</h2>
          <p className="hp-md-meta">Веб-приложение · Next.js · Supabase · Cloudflare R2 · Tailwind v4 · Самостоятельно</p>
          <p className="hp-rd-lead">Небольшая закрытая онлайн-читалка для горстки друзей, которые входят по одному коду доступа. Приложение помнит, где именно вы остановились, показывает, кто ещё читает, и следит за прогрессом каждого.</p>
          {chapter('01', 'Библиотека, которая вас помнит', <><p>Когда вы открываете книгу, она возвращает вас точно в ту же главу и на то же место прокрутки. Место хранится как доля, поэтому оно совпадает даже после смены размера шрифта, а цвет, шрифт и макет каждого читателя тоже сохраняются.</p><img className="hp-rd-fig" src="/images/beadreader/reader-paper.webp" alt="Режим чтения" loading="lazy" /></>)}
          {chapter('02', 'Читаем вместе', <><p>Видно, кто в сети, друга в той же книге можно узнать по зелёному кольцу и номеру главы, а ещё ему можно помахать или отправить короткую исчезающую записку.</p><img className="hp-rd-fig" src="/images/beadreader/reader-menu.webp" alt="Присутствие и быстрые сообщения" loading="lazy" /></>)}
          {chapter('03', 'Фильтр на уровне SQL', <p>Откровенные главы закрыты прямо в запросе к базе данных, так что закрытый текст никогда не покидает сервер, если у читателя нет доступа. Одна и та же глава может выглядеть по-разному для разных читателей, а режим cal убирает её совсем.</p>)}
          {cta('Вся сборка', 'В статье присутствие, фильтр контента, вебтуны и стек.', 'Читать статью', '/beadreader')}
        </div>
      </>
    );
    case 'proj-ema': return (
      <>
        {hero('Система умного дома EMA', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Система умного дома EMA</h2>
          <p className="hp-md-meta">3 месяца · Групповой учебный проект · Python · WebSocket · Spline 3D</p>
          <p className="hp-rd-lead">Умный дом, который мы впятером сделали для курса об устойчивом образе жизни и получили за него A. Четыре узла на BeagleBone отчитываются серверу SocketIO, на котором работает живая 3D-панель.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/PFhsRaakJAs" title="Умный дом EMA" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Четыре узла, у каждого своя задача', <><p>Четыре узла отвечают за климат, ванную, кухню (энергию холодильника и пожарную сигнализацию) и охрану от проникновения, и на каждом BeagleBone Black Wireless стоят модули датчиков MikroBUS.</p><img className="hp-rd-fig" src="/images/csdp7.webp" alt="Железо кухонного узла" loading="lazy" /></>)}
          {chapter('02', 'Один сервер для всех', <><p>Каждый узел подключается к веб-серверу SocketIO, который держит панель и включает пожарную тревогу сразу на всех узлах.</p><img className="hp-rd-fig" src="/images/csdp9.webp" alt="Как связаны части системы" loading="lazy" /></>)}
          {chapter('03', 'Живая 3D-панель', <><p>Панель показывает живые данные на 3D-модели дома в Spline, а интерфейс для неё я нарисовал в Figma.</p><img className="hp-rd-fig" src="/images/Cdyspstart.webp" alt="3D-панель EMA" loading="lazy" /></>)}
          {cta('Попробуйте или почитайте', 'Есть живое демо панели и полная статья о проекте.', 'Живое демо', 'https://csdpdemo.chiambucket.com', { label: 'Читать статью', url: '/csdp' })}
        </div>
      </>
    );
    case 'proj-pandus': return (
      <>
        {hero('Дозатор Pandus', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Дозатор Pandus</h2>
          <p className="hp-md-meta">1 месяц · Первый учебный проект · 3D-дизайн · PyFirmata</p>
          <p className="hp-rd-lead">Мой первый учебный проект: дозатор сиропа из шести деталей, напечатанных на 3D-принтере, и каждая деталь подошла с первой печати.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/fIJQzOhCKQU" title="Дозатор Pandus" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Что он умеет', <><p>Он наливает три размера порций, просыпается, когда кто-то подходит, и у него есть дверца на сервоприводе и мощный светодиод, который подсвечивает стакан.</p><img className="hp-rd-fig" src="/images/pandus2.webp" alt="Модель Pandus в Onshape" loading="lazy" /></>)}
          {chapter('02', 'Управление и компоненты', <><p>Arduino Uno R3 под управлением PyFirmata работает с сервоприводом, светодиодами, релейным модулем, кнопками, насосом постоянного тока и инфракрасным модулем обнаружения препятствий.</p><img className="hp-rd-fig" src="/images/pandus5.webp" alt="Блок-схема Pandus" loading="lazy" /></>)}
          {cta('Вся сборка', 'В статье детали, блок-схемы и модель в Onshape.', 'Читать статью', '/pandus')}
        </div>
      </>
    );
    case 'proj-elecf': return (
      <>
        {hero('ELEC-F, безопасная система для морозильной камеры', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Концепт ELEC-F</h2>
          <p className="hp-md-meta">Безопасное хранение в морозильной камере · Команда из 4 человек · Инженерный курс · M5Stack · ToF + PIR</p>
          <p className="hp-rd-lead">Система безопасности для морозильной камеры, которую мы с командой придумали для инженерного курса. В больших заводских морозильных камерах люди могут оказаться запертыми, поэтому ELEC-F следит за дверью и помещением и поднимает тревогу, пока холод не стал опасным.</p>
          <div className="hp-md-video"><iframe src="https://www.youtube.com/embed/8De2ahk-GPo" title="ELEC-F, безопасная система для морозильной камеры" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          {chapter('01', 'Проблема', <><p>Неисправная защёлка, примёрзший уплотнитель или простая невнимательность могут оставить работника запертым в морозильной камере, где переохлаждение наступает быстро. ELEC-F нужен, чтобы сократить это время и успокоить того, кто оказался внутри.</p><img className="hp-rd-fig" src="/images/elecf-prototype1.avif" alt="Прототип морозильной камеры ELEC-F" loading="lazy" /></>)}
          {chapter('02', 'Как это работает', <><p>Датчик ToF определяет, открыта дверь или закрыта, а датчик PIR проверяет, остался ли кто-то внутри. Если дверь закрывается, когда внутри человек, запускается таймер, а когда он истекает, мигает RGB-модуль и звучит пищалка.</p><img className="hp-rd-fig" src="/images/elecf-door-armed.png" alt="ELEC-F в режиме охраны на M5Stack" loading="lazy" /></>)}
          {chapter('03', 'Сделано на M5Stack', <><p>Два контроллера M5Stack Fire и Mini Hub связывают модули ToF, PIR и RGB. Мы выбрали их, потому что они продолжают работать при минусовых температурах, как и требует морозильная камера.</p><img className="hp-rd-fig" src="/images/elecf-controller-sensors.png" alt="Контроллер M5Stack, подключённый к датчикам" loading="lazy" /></>)}
          {cta('Весь концепт', 'В статье исследование, сборка и интерактивный разбор.', 'Читать статью', '/elecf')}
        </div>
      </>
    );
    case 'proj-kauli': return (
      <>
        {hero('Концепт Kauli', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Концепт Kauli</h2>
          <p className="hp-md-meta">Концепт · Навыки общения · 3D в Blender</p>
          <p className="hp-rd-lead">Оригинальный концепт продукта, который я придумал и представил для проекта по навыкам общения, с 3D-сценами из Blender.</p>
          {chapter('01', 'От идеи до презентации', <><p>Задание было не только в том, чтобы придумать идею, но и в том, чтобы её донести, поэтому я разработал концепт, отрендерил его в Blender и сделал презентацию, чтобы понятно показать его аудитории.</p><img className="hp-rd-fig" src="/images/kauli-obj.webp" alt="Рендер концепта Kauli" loading="lazy" /></>)}
          {soon('Концепт Kauli', 'О рендерах и питче будет полная статья.')}
        </div>
      </>
    );
    case 'proj-sol': return (
      <>
        {hero('Series One Light', ['Личный проект'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Series One Light</h2>
          <p className="hp-md-meta">Личное · 3D-дизайн · Сверхлёгкая, 20 г</p>
          <p className="hp-rd-lead">Мой вариант популярной ZeroMouse: сверхлёгкая игровая мышь на 20&nbsp;г, которую я спроектировал с нуля, чтобы играть в шутеры чуть лучше.</p>
          {chapter('01', 'Дизайн ради граммов', <p>Каждую деталь корпуса я моделировал так, чтобы сбросить вес без потери жёсткости, балансируя между удобным хватом и целью дойти примерно до 20 граммов.</p>)}
          {soon('Series One Light', 'О модели и её компромиссах будет полная статья.')}
        </div>
      </>
    );
    case 'proj-copyboard': return (
      <>
        {hero('Плата Copy Board', ['Личный проект'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Copy Board</h2>
          <p className="hp-md-meta">Личное · Проектирование плат · KiCAD · 1 неделя</p>
          <p className="hp-rd-lead">Копия отладочной платы NYP на ATMega328, сделанная в KiCAD с нуля, чтобы у меня дома был свой экземпляр для работы.</p>
          {chapter('01', 'Разобрал, потом собрал заново', <p>Я воссоздал учебную плату в KiCAD по её схеме, а так как некоторые компоненты уже сняты с производства, подобрал замены, и эта плата стала моей первой серьёзной попыткой пайки оплавлением.</p>)}
          {soon('Copy Board', 'О поиске компонентов, разводке и пайке будет полная статья.')}
        </div>
      </>
    );
    case 'proj-webdev': return (
      <>
        {hero('Проект по веб-разработке', ['Учебный проект'], 'school')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Проект по веб-разработке</h2>
          <p className="hp-md-meta">Учёба · HTML и CSS · Первый сайт</p>
          <p className="hp-rd-lead">Первый полностью рабочий сайт, который я сделал на HTML и CSS для итогового задания курса по веб-разработке. Этот сайт стал моей второй попыткой.</p>
          {chapter('01', 'С чего всё началось', <p>Это было моё знакомство с веб-разработкой, и по нему видно, как далеко я с тех пор продвинулся.</p>)}
          {soon('С чего всё началось', 'Сайт до сих пор онлайн.', { label: 'Живое демо', url: 'https://tht.chiambucket.com' })}
        </div>
      </>
    );
    case 'proj-mc': return (
      <>
        {hero('Живая карта Minecraft', ['Личный проект'], 'personal')}
        <div className="hp-rd-body">
          <h2 className="hp-md-title">Живая карта Minecraft</h2>
          <p className="hp-md-meta">Личное · Docker · Paper и Dynmap</p>
          <p className="hp-rd-lead">Свой сервер Minecraft на HomeLab с живой веб-картой многопользовательского мира, которую любой может листать в реальном времени.</p>
          {chapter('01', 'Сервер и карта', <p>Сервер Paper работает в Docker, а плагин Dynmap строит живую интерактивную карту, которая обновляется, пока игроки исследуют мир и строят.</p>)}
          {soon('Мир вживую', 'Живая карта открыта для всех.', { label: 'Открыть карту', url: 'https://map.chiambucket.com' })}
        </div>
      </>
    );
    default: return null;
  }
}
