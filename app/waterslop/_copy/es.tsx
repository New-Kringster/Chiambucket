import type { WaterslopCopy } from './en';

/* The OCR Reader article's Spanish words. */
const es: WaterslopCopy = {
  meta: {
    title: 'OCR Reader, un lector de contadores de agua por visión en un ESP32-S3 | Chiambucket',
    description:
      'OCR Reader es un lector de contadores de agua barato y con batería que lee el contador con una cámara. Una red de 693K parámetros, DrumNet V10, funciona entera en su ESP32-S3 para leer los tambores, y la lectura se envía por LoRaWAN. El artículo recorre MeterSim, SimGen2, los seis agentes que la entrenaron, la red paso a paso, el firmware, la PCB en 3D, la carcasa y un simulador de ConfigKing.',
    ogTitle: 'OCR Reader: un lector de contadores de agua por visión en un ESP32-S3',
  },
  ld: { headline: 'OCR Reader: un lector OCR de contadores de agua por visión en un ESP32-S3' },

  ui: {
    chapterDash: 'Capítulo - {n}',
    next: 'Seguir',
    nextChapter: 'Próximo capítulo',
    nextFrame: 'Siguiente paso',
    coverAria: 'Capítulo {n}: {title}',
    coverN: 'Capítulo {n}',
    coverContents: 'En el capítulo {n}',
    ck: {
      hint: 'Toca la pantalla o una tecla para tomar el control',
      deviceAria: 'Simulador de ConfigKing en un M5Stack Cardputer. Haz clic en la pantalla o en las teclas y luego usa las flechas, Enter, Escape y Tab.',
      keyboard: 'Teclado del Cardputer',
      view: 'Vista',
      close: 'Acercar',
      full: 'Completa',
      zoom: 'Ampliada',
      fullScreen: 'Pantalla completa',
      exitFullScreen: 'Salir',
    },
  },

  entrance: 'OCR de contadores de agua en un ESP32-S3',
  skip: { toEnd: 'Ir al final', toTop: 'Volver arriba' },

  hero: {
    label: 'OCR Reader',
    labelSub: 'OCR de contadores de agua en un ESP32-S3 · NYP ECE · 2026',
    title: ['OCR', 'Reader'],
    lead: 'OCR Reader es un lector OCR de contadores de agua por visión, barato y de bajo consumo. Una red neuronal de 693K parámetros, DrumNet V10, funciona entera en el ESP32-S3 del lector, donde encuentra la ventana de los dígitos, lee cada tambor y envía el número a casa por LoRaWAN en unos 2 segundos. El objetivo es un 99 % de precisión con una batería que dure 2 años, y la versión actual acierta el 56 % de las lecturas, con planes para mejorarla.',
    contentsAria: 'Capítulos',
    start: 'Empezar a leer',
    report: 'El informe',
    meta: 'ESP32-S3 · OV2640 · KiCad · Onshape · PlatformIO · Tailscale',
  },

  chapters: {
    v2: 'PCB y carcasa', drumnet: 'DrumNet', configking: 'ConfigKing', metersim: 'MeterSim', simgen2: 'SimGen2', agents: 'Flujo agéntico',
    firmware: 'Firmware', power: 'Ahorro de energía', camera: 'La cámara', proto: 'Prototipo V2', conclusion: 'Conclusión', report: 'El informe',
  },

  /* ── Chapters I to III: the 3D chapter, the DrumNet film and ConfigKing ── */
  pcb: {
    aria: 'La PCB y la carcasa del Prototipo V2 en 3D, que termina con el lector haciendo una foto del contador',
    chapterColon: 'Capítulo {n}:',
    name: 'PCB de OCR Reader',
  },

  film: {
    aria: 'Una animación de toda la arquitectura de DrumNet V10',
    title: 'DrumNet',
    of: '{stage} · {n} de {total}',
    nudge: 'La película se reproduce sola y la página sigue en un momento.',
    scenesAria: 'Escenas',
    sceneAria: '{n}. {title}',
    prev: 'Escena anterior',
    prevTitle: 'Anterior (←)',
    play: 'Reproducir',
    pause: 'Pausa',
    replay: 'Volver a ver',
    playTitle: 'Reproducir / pausa (espacio)',
    next: 'Escena siguiente',
    nextTitle: 'Siguiente (→)',
    fast: 'Avance rápido, ahora {n} veces',
    fastTitle: 'Avance rápido (f)',
    skip: 'Saltar',
    skipTitle: 'Saltar al siguiente capítulo, ConfigKing',
    scenes: {
      photo: {
        stage: 'Captura', title: 'La foto que acaba de hacer el lector',
        body: 'Es un único cuadro de 800 × 600 en grises, y todo lo que viene a partir de aquí corre en el ESP32-S3 usando solo esta foto.',
      },
      downscale: {
        stage: 'Entrada', title: 'Reducir la captura',
        body: 'El lector captura el contador a 800 × 600 en grises, y para el localizador se reduce a 320 × 240, que tiene cuatro veces menos números, así que la búsqueda aproximada es rápida y barata.',
      },
      'spot-net': {
        stage: 'Localizador', title: 'Cinco bloques reducen la miniatura a una rejilla de 10 × 7',
        body: 'Cada bloque desliza un kernel de 3 × 3 sobre su entrada, se queda con las respuestas fuertes (ReLU) y reduce el tamaño a la mitad (max-pool). La miniatura se convierte en 8 mapas, luego en 16, 24, 32 y 32, cada uno la mitad de grande que el anterior, hasta que una celda del último bloque representa un trozo de 32 × 34 de la miniatura.',
      },
      'spot-head': {
        stage: 'Localizador', title: 'El mapa de puntuación elige la celda y los otros cuatro dicen dónde',
        body: 'Una convolución de 1 × 1 convierte el bloque 5 en cinco mapas de 10 × 7, y el mapa de puntuación elige la celda con más probabilidades de contener el centro de la ventana de los dígitos. Esa posición pasa a los mapas de dx, dy, ancho y alto, que se leen en la misma celda, y entre todos dibujan una caja sobre la miniatura.',
      },
      'spot-crop': {
        stage: 'Localizador', title: 'Una caja aproximada y luego un recorte generoso',
        body: 'El trabajo del localizador es aproximado, así que la caja se ensancha 1,5 ×, y el recorte a su alrededor toma 1,5 × su ancho y 2,4 × su alto. Se corta del cuadro completo de 800 × 600, no de la miniatura, y baja al refinador.',
      },
      'ref-net': {
        stage: 'Refinador · pasada 1', title: 'Cuatro bloques bajan el recorte a 32 mapas de 32 × 12',
        body: 'El recorte se pasa a grises y se redimensiona a 256 × 96, y RefNet ejecuta cuatro bloques del mismo tipo que los del localizador. El último no hace pooling, así que el bloque 4 conserva 32 mapas de 32 × 12, una columna por cada 8 píxeles del recorte.',
      },
      'ref-avg': {
        stage: 'Refinador · pasada 1', title: 'Cada mapa se promedia en una fila y una columna',
        body: 'El bloque 4 es una losa de 32 mapas, y cada uno se despega por turnos. Sus 32 columnas se promedian en una fila del mapa de promedios por columna y sus 12 filas en una columna del mapa de promedios por fila, así que el primero encuentra la izquierda y la derecha, y el segundo, arriba y abajo.',
      },
      'ref-heads': {
        stage: 'Refinador · pasada 1', title: 'Los promedios pasan a tiras de puntuación y desplazamiento',
        body: 'Una convolución de 1 × 1 lee cada columna del mapa de columnas y la convierte en cuatro tiras, una puntuación y un desplazamiento para el borde izquierdo y lo mismo para el derecho, mientras que el mapa de filas da otras cuatro para arriba y abajo. La puntuación más alta elige la celda, su desplazamiento dice dónde cae el borde dentro de esa celda, y los cuatro bordes forman la caja.',
      },
      'ref-pass2': {
        stage: 'Refinador · pasada 2', title: 'Ampliar la caja, recortar otra vez y pasar la misma red',
        body: 'La caja de la pasada 1 solo está tan centrada como la suposición del localizador, así que se amplía, se recorta otra vez y pasa por el mismo refinador, con los mismos cuatro bloques, cabezas y 15.400 pesos. La pasada 2 repite rápido la pasada 1, y su caja sigue hacia el lector.',
      },
      cut: {
        stage: 'Corte', title: 'Cortar la ventana en tambores',
        body: 'La disposición de 4 tambores enteros y 2 decimales se fijó durante la configuración, así que la ventana se divide en seis celdas iguales, y cada una se pasa a grises, se estira a contraste completo a 32 × 64 y se envía a los lectores. Seguimos al sexto tambor, el 7.',
      },
      'rd-net': {
        stage: 'Lector 1', title: 'Un lector convierte una celda en 96 mapas diminutos',
        body: 'El lector usa otra vez los mismos cuatro bloques de convolución 3 × 3, ReLU y max-pool, pero más anchos, con 16, 48, 96 y 96 mapas, así que la celda de 32 × 64 acaba en 96 mapas de 2 × 4, donde una celda representa un trozo de 16 × 16 del tambor.',
      },
      flatten: {
        stage: 'Lector 1', title: 'Aplanar 96 mapas en una lista de 768',
        body: 'Aquí no se calcula nada. El primer mapa sale del bloque y sus 2 × 4 celdas se leen fila a fila en una línea de 8, luego le siguen los otros 95 mapas hasta vaciar el bloque, así que los 768 números siempre van en el mismo orden, con el mapa 1 primero y el mapa 96 al final.',
      },
      dense: {
        stage: 'Lector 1', title: 'La capa densa convierte 768 números en 96 unidades',
        body: 'Cada una de las 96 unidades multiplica cada número por su propio peso, suma los 768 productos y un sesgo, y convierte en cero todo lo que queda por debajo de cero. La unidad 69 va primero y despacio, y luego las otras 95 hacen lo mismo.',
      },
      digit: {
        stage: 'Lector 1', title: 'La cabeza de dígito saca una respuesta de diez puntuaciones',
        body: 'Cada dígito del 0 al 9 tiene sus propios 96 pesos y su sesgo, así que diez sumas ponderadas dan diez puntuaciones. Softmax eleva e a cada puntuación y divide entre el total, lo que convierte una ventaja clara en casi toda la probabilidad. El 7 gana con un 96,4 %, y ese porcentaje es la confianza.',
      },
      roll: {
        stage: 'Lector 1', title: 'La cabeza de giro mide cuánto ha girado el tambor',
        body: 'Una suma ponderada más de las 96 unidades da una puntuación de giro, que tanh comprime entre −0,5 y +0,5 para decir cuánto ha pasado el tambor de su marca. Este 7 ha girado un 3,7 % de un paso hacia el 8.',
      },
      readers3: {
        stage: 'Conjunto de lectores', title: 'Los lectores 2 y 3 leen el mismo tambor',
        body: 'Tres copias del lector comparten una arquitectura, pero se entrenaron desde puntos de partida aleatorios distintos, así que cometen errores distintos. La misma celda pasa por los lectores 2 y 3 de la misma manera, rápido, y cada uno da sus propios diez porcentajes y su propio giro.',
      },
      vote: {
        stage: 'Votación', title: 'Tres respuestas se promedian en una',
        body: 'Las respuestas de los tres lectores bajan a la votación, donde se promedian sus listas de probabilidades, así que cada lector tiene el mismo peso en el voto y el tercero deshace los empates. La lista promediada da el dígito y su confianza, los tres giros también se promedian, y el tambor 6 sale como un 7 al 98,8 %.',
      },
      drums: {
        stage: 'Votación', title: 'Todos los demás tambores pasan por la misma maquinaria',
        body: 'Las otras cinco celdas pasan rápido por los mismos pasos, los cuatro bloques, el aplanado, la capa densa y las dos cabezas en los tres lectores a la vez, y luego la votación, hasta que seis respuestas promediadas se alinean ante la regla de acarreo. El tambor 3 es el menos seguro, un 9 al 71,5 %, porque el lector 3 vio un 0 y perdió la votación.',
      },
      carry: {
        stage: 'Votación', title: 'La regla de acarreo y luego la lectura',
        body: 'Un tambor solo puede estar a medio girar si el tambor de su derecha está en 9 o en 0, o si es el último tambor, y entonces su giro se da por bueno y el dígito puede avanzar. Si el tambor de la derecha está entre 1 y 8, este tambor queda fijado a su dígito más cercano, lo que evita que un 79 que pasa a 80 se lea como 89. Aquí todos los giros caen dentro de la banda muerta, así que cada tambor mantiene su dígito y la lectura es 0092.07.',
      },
      finale: {
        stage: 'DrumNet V10', title: 'Toda la cadena funcionando a la vez',
        body: 'Todas las etapas corren a la vez una vez más, desde la miniatura y el localizador, pasando por el refinador, las seis celdas, los tres lectores y la votación, hasta la regla de acarreo, lo que le lleva al lector unos dos segundos por número.',
      },
    },
    panels: {
      input: { title: 'Entrada', sub: 'una foto del lector' },
      spotter: { title: 'Localizador DetNet', sub: 'una caja aproximada sobre los dígitos' },
      ref1: { title: 'Refinador RefNet · pasada 1', sub: 'busca los cuatro bordes dentro de la caja' },
      ref2: { title: 'Refinador RefNet · pasada 2', sub: 'amplía, recorta otra vez y repite la red' },
      cut: { title: 'Cortar en dígitos', sub: 'una celda por tambor' },
      reader1: { title: 'Lector 1 de DrumNet', sub: 'qué dígito se ve y cuánto ha girado' },
      reader2: { title: 'Lector 2 de DrumNet', sub: 'la misma red desde otro inicio aleatorio' },
      reader3: { title: 'Lector 3 de DrumNet', sub: 'el que deshace empates' },
      vote: { title: 'Votación y lectura', sub: 'promedio, regla de acarreo, lectura' },
    },
    draw: {
      block: 'bloque {n}',
      mapsOne: '{n} mapa · {sub}',
      maps: '{n} mapas · {sub}',
      weights: '{n} pesos',
      noPool: '{sub} · sin pool',
      greyJpeg: '800 × 600 · JPEG en grises',
      fewer: '{n} números · 4 × menos',
      thumbnail: 'miniatura',
      conv5: 'conv 1 × 1 · 32 → 5',
      score: 'score',
      chosen: 'la mayor de las 70 celdas: elegida',
      across: 'centro {n} % a lo ancho',
      down: 'centro {n} % a lo alto',
      width: 'ancho 0,25 del cuadro · {n} px',
      height: 'alto 0,12 del cuadro · {n} px',
      headCols: ['celda', 'bruto', '0 a 1', 'significado'],
      sigmoid: '0 a 1 es la sigmoide del valor bruto',
      corner: 'dx, dy desde la esquina',
      selection: 'selección del localizador · {w} × {h} px',
      widened: 'ensanchada 1,5 ×',
      cropBox: 'el recorte · 1,5 × más ancho, 2,4 × más alto · {w} × {h} px',
      cutFrom: 'cortado del cuadro entero de 800 × 600, no de la miniatura',
      colAvgSize: 'promedios por columna · 32 × 32',
      colAvgNote: 'una fila por mapa · 12 valores → 1',
      rowAvgSize: 'promedios por fila · 32 × 12',
      rowAvgNote: 'una columna por mapa · 32 valores → 1',
      slab: 'bloque 4 · 32 mapas · 32 × 12',
      peel1: 'al despegarse el mapa 1, cada una de sus 32 columnas da un valor,',
      peel2: 'y cada una de sus 12 filas, otro valor',
      mapOf: 'mapa {n} de 32',
      colAvg: 'promedios por columna',
      rowAvg: 'promedios por fila',
      sameCol: 'mismos pesos en cada columna',
      sameRow: 'mismos pesos en cada fila',
      conv: 'conv 1 × 1',
      inOut: '32 entran, 4 salen',
      leftScore: 'score izq.', leftOffset: 'offset izq.', rightScore: 'score der.', rightOffset: 'offset der.',
      topScore: 'score sup.', topOffset: 'offset sup.', bottomScore: 'score inf.', bottomOffset: 'offset inf.',
      stripsKey: 'sólida: el score más alto · punteada: su offset · la línea: dónde está el borde en la celda',
      crop: 'recorte · 256 × 96 en grises',
      expanded: 'ampliada · {w} × {h} px → 256 × 96',
      sameRef: 'el mismo RefNet · mismos bloques, mismas cabezas, mismos 15.400 pesos',
      pass2Box: 'caja de la pasada 2',
      toReader: '{w} × {h} px · al lector',
      window: 'ventana · {w} × {h} px · 6 franjas iguales',
      cells: 'celdas · una por tambor',
      readerCells: 'celdas del lector · grises, contraste total, 32 × 64',
      drum: 'tambor {n}',
      drumSize: 'tambor {n} · 32 × 64',
      reader1Maps: 'mapas y unidades del lector 1, pero el dígito y el giro son de este lector',
      mapsLeft: 'bloque 4 · quedan {n} de 96 mapas',
      rowByRow: 'fila a fila',
      map1List: 'mapa 1 → posiciones 1 a 8 de la lista',
      map: 'mapa {n}',
      oneList: 'una lista · {n} números',
      numbers768: '768 números',
      weightPer: 'un peso por número',
      sum768: 'suma de los 768',
      offset: 'sesgo',
      unit: 'unidad {n}',
      units96: '96 unidades',
      aboveZero: '{w} pesos · {n} de las 96 superan el cero en este tambor',
      digitCols: ['score', 'e^score', '÷ suma', 'softmax'],
      digit: 'dígito {n}',
      firmwareChecks: 'la confianza que comprueba el firmware',
      share: 'e^7,1 = 1.215 ÷ 1.260 · 3,6 de score sobre el siguiente pesa 36 ×',
      rollScore: 'score de giro',
      roll: 'giro {v}',
      rollMeasured: 'el 7 ha pasado su marca un 3,7 % de un paso hacia el 8',
      rollPast: 'el {d} ha pasado su marca un {p} % de un paso',
      rollBefore: 'al {d} le falta un {p} % de un paso para su marca',
      leastSure: 'el menos seguro: el lector 3 leyó un 0 y perdió la votación',
      reader: 'lector {n}',
      mean: 'media',
      meanOfThree: 'giro {v} · la media de tres',
      inBand: 'en banda',
      pastBand: 'fuera de banda',
      freeLast: 'libre · último tambor',
      free: 'libre · tambor derecho en 9 o 0',
      lock: 'fijo · tambor derecho entre 1 y 8',
      allowed: '{n} → {m} permitido',
      absolute: '{n}, absoluto',
      carryNote: 'un 79 que pasa a 80 podría leerse como 89, así que la regla elige el número anterior',
      units: 'metros cúbicos · confianza 71,5 %, el menos seguro de los 6 tambores',
      secondRoute: 'segunda vía: repetir con WindowNet',
    },
  },

  configking: {
    title: 'ConfigKing',
    skipToSim: 'Ir al simulador',
    intro: {
      eyebrow: 'Instalación y configuración', title: 'La misma lectura, en el configurador',
      before: <p>Esa lectura, 0092.07, y el cuadro del que salió son lo que muestra ConfigKing cuando le pide una lectura a un lector con Read. ConfigKing es el firmware que escribí para un M5Stack Cardputer, y encuentra lectores cercanos por BLE y ESP-NOW, configura los nuevos paso a paso y reconfigura los demás.</p>,
      after: <p className="ws-note">DrumNet y el firmware se graban en el Prototipo V2 a la vez que se fija la dirección de dispositivo LoRa, y como los lectores pasan casi todo el tiempo dormidos, pulsas el botón BOOT para despertar uno y que se pueda encontrar. La pantalla de aquí es una copia funcional de las pantallas del firmware real, dibujada a partir de su código fuente sobre una foto del Cardputer.</p>,
    },
    press: { connect: 'conectar', save: 'guardar', next: 'avanzar', finish: 'terminar', continue: 'continuar' },
    steps: {
      nearby: { eyebrow: 'Paso 1', title: 'Detección', body: 'Cuando se enciende un lector sin configurar, arranca solo en modo de configuración. ConfigKing lo detecta y te pide que lo configures.' },
      identify: { eyebrow: 'Paso 2', title: 'Nombre y frecuencia de lectura', body: 'Pon el nombre que el lector mostrará en el panel y luego su frecuencia de lectura, y despliega el icono (i) para ver más detalles del lector.' },
      layout: { eyebrow: 'Paso 3', title: 'Tambores', body: 'Ajusta la disposición de tambores para que coincida con el contador donde se instalará el lector, con de 1 a 8 tambores enteros y de 0 a 4 tambores decimales.' },
      camera: { eyebrow: 'Paso 4', title: 'Ajustes de cámara', body: 'Ajusta el brillo, la ganancia y el ciclo de trabajo PWM del LED para que la luz sea uniforme. Puedes hacer zoom y desplazarte para mirar la imagen de cerca, y la imagen se oscurece y se aclara a medida que cambian los ajustes.' },
      roi: { eyebrow: 'Paso 5', title: 'Ajuste del ROI', body: 'WindowNet genera un ROI automáticamente, y los controles te dejan afinarlo, con zoom y desplazamiento para verlo con más detalle.' },
      read: { eyebrow: 'Paso 6', title: 'Lectura de prueba', body: 'Se hace una lectura de prueba con el ROI fijado antes y se muestra su confianza, que puedes revisar dígito a dígito pulsando (D).' },
      radio: { eyebrow: 'Paso 7', title: 'Prueba de conexión LoRa', body: 'Una prueba de conexión comprueba que el lector llega al gateway LoRaWAN, y al desplegar el menú (i) ves más información.' },
      review: { eyebrow: 'Paso 8', title: 'Revisar cambios y guardar', body: 'Revisa los ajustes que se guardarán en el lector. Una vez guardados, el lector pasa al modo de despliegue normal y el enlace BLE se corta.' },
      done: { eyebrow: 'Configuración lista', title: 'El lector se duerme y empieza a leer', body: 'El mensaje final muestra el temporizador de sueño del propio lector, y a partir de aquí el lector se despierta en su propio intervalo, hace una lectura, la envía y vuelve a dormirse.' },
      connected: { eyebrow: 'Un lector configurado', title: 'Read, Configure, More', body: 'Un lector ya configurado ofrece Read, Configure y More en lugar del asistente. Configure abre una categoría de ajustes cada vez, con guardar o descartar explícitos, y More reúne la prueba de radio, la información del lector, About y un restablecimiento de fábrica que pide confirmación.' },
    },
    free: {
      eyebrow: 'Pruébalo', title: 'Configura un lector tú mismo',
      body: <p>Tiene las mismas pantallas, teclas y asistente que el de verdad, hablando con un lector simulado. Puedes pulsar las teclas del Cardputer, tocar su pantalla o escribir con tu propio teclado, y en un momento aparecerá un lector cerca.</p>,
    },
  },

  /* ── Chapter IV: MeterSim ── */
  metersim: {
    cover: {
      title: 'MeterSim', lines: ['Meter', 'Sim'],
      contents: ['Un contador simulado', 'Hecho para agentes', 'Diseños y preajustes', 'Tambores a medio girar', 'Clima y superficies', 'Evaluación desatendida'],
      lede: 'MeterSim dibuja un contador de agua en una tableta, para que una cámara real pueda recoger lecturas etiquetadas sin que nadie mire.',
    },
    page: 'MeterSim',
    rows: {
      'ms-rig': {
        eyebrow: 'MeterSim', title: 'Un contador simulado para una cámara real',
        body: <p>La primera versión de MeterSim se hizo a la vez que el firmware del Prototipo V0.5, y los dos funcionan juntos, así que MeterSim puede controlar el Prototipo V0.5 automáticamente y generar imágenes etiquetadas para entrenar el modelo. Claude escribió todo el software y el firmware.</p>,
        alt: 'El Prototipo V0.5, un ESP32-EYE, apuntando a una tableta que muestra la pantalla de MeterSim',
      },
      'ms-control': {
        eyebrow: 'MeterSim', title: 'Hecho para que lo usen agentes',
        body: <p>MeterSim está hecho para que lo usen agentes de IA y no personas, así que su panel de control sirve sobre todo para que las personas vean el progreso de los agentes. Los agentes usaron MeterSim para montar pruebas, recoger datos y medir la precisión mientras creaban DrumNet. Se encarga del trabajo más pesado del aprendizaje automático, reunir buenos datos para entrenar, generándolos él mismo, y como el contador es simulado, cada imagen viene ya etiquetada.</p>,
        alt: 'La interfaz de control de MeterSim, con deslizadores para la lectura, los tambores, la superficie y los efectos del clima',
      },
      'ms-designs': {
        eyebrow: 'MeterSim', title: 'Nueve contadores y nueve preajustes',
        body: (
          <>
            <p>MeterSim tiene 9 diseños de contador, y cada uno se puede montar con una disposición de tambores distinta, como 7 tambores enteros y 1 decimal (7+1). Los tambores enteros suelen ser blancos o negros, y los decimales, rojos.</p>
            <p>Las combinaciones de condiciones más habituales se guardan como preajustes: limpio, mediodía, reflejo en los dígitos, media sombra, sombra suave, anochecer, a la sombra, inclinado y sucio.</p>
          </>
        ),
        alt: [
          'Los nueve diseños de contador disponibles en MeterSim: Itron Weg 50, Elster de latón, Itron Multimag Cyble, Bonega S/13 y T/13, Istameter II, un genérico industrial, B Meters azul y un Elster de latón limpio',
          'Nueve condiciones predefinidas: limpio, mediodía, reflejo en los dígitos, media sombra, sombra suave, anochecer, a la sombra, inclinado y sucio',
        ],
      },
      'ms-halfroll': {
        eyebrow: 'MeterSim', title: 'Tambores a medio girar',
        body: <p>También simula tambores a medio girar, para que el modelo aprenda a leer un tambor que está entre un dígito y el siguiente, y el agente los prepara automáticamente mientras recoge datos de entrenamiento.</p>,
        alt: 'El control de giro de MeterSim, arrastrando tambores sueltos hasta quedar entre dos dígitos',
      },
      'ms-effects': {
        eyebrow: 'MeterSim', title: 'Clima y estado de la superficie',
        body: <p>MeterSim también simula el clima y el estado de la superficie del contador, para parecerse a un contador que lleva tiempo a la intemperie, y así el lector aprende a leer en todas estas condiciones. Los controles cubren reflejos, manchas, sombras, iluminación, desenfoque, ruido del sensor, niebla, suciedad y escala.</p>,
        alt: 'Los deslizadores de efectos de superficie y clima de MeterSim, cada uno con una miniatura de vista previa',
      },
      'ms-eval': {
        eyebrow: 'MeterSim', title: 'Evaluación y recogida de datos desatendidas',
        body: (
          <>
            <p>MeterSim es una app web autoalojada con dos endpoints, el panel de control en /control y la pantalla en /display. El lector se une a la misma red Wi-Fi local que MeterSim, y la usa para enviar sus lecturas e imágenes y para recibir órdenes.</p>
            <p>Para evaluar un modelo, MeterSim genera un contador y unas condiciones al azar y se los muestra al lector, que hace una foto y la lee con la red entrenada. El resultado vuelve a MeterSim, que conoce el valor simulado y lo compara con la predicción, y cuando un agente repite esto muchas veces sin que nadie mire, sale una precisión aproximada del modelo. Recoger datos etiquetados funciona igual, salvo que las imágenes del lector se guardan en disco con sus etiquetas en JSON, listas para entrenar.</p>
          </>
        ),
        alt: [
          'Una tableta con la pantalla de MeterSim junto a un portátil con el panel de control, y el lector ESP32-EYE apuntando a la tableta',
          'El lector ESP32-EYE sobre una botella apuntando a la pantalla de MeterSim, en un aula',
        ],
      },
    },
  },

  /* ── Chapter V: SimGen2 ── */
  simgen2: {
    cover: {
      title: 'SimGen2', lines: ['Sim', 'Gen2'],
      contents: ['Seis etapas', 'Lo real sobre lo sintético', 'Compáralas tú mismo'],
      lede: 'SimGen2 crea capturas sintéticas que parecen hechas por la propia cámara del lector, en unos 2 s cada una, casi 5× más rápido que una captura real.',
    },
    page: 'SimGen2',
    stages: [
      ['Captura de pantalla', 'la pantalla de MeterSim, 1920 × 1080'], ['Deformada', 'pose y lente, a 1600 × 1200'], ['Desenfoque', '1,2 a 2,2 px'], ['Ganancia, curva, viñeta', 'la respuesta del sensor'], ['Ruido del sensor', 'grano donde lo tiene la cámara real'], ['JPEG del OV2640', 'calidad 6, como comprime el lector'],
    ],
    rows: {
      'sg-stages': {
        eyebrow: 'SimGen2', title: 'Simular la propia cámara',
        body: (
          <>
            <p>Incluso con toda esta automatización quedaba un gran cuello de botella, porque hacer una foto con el lector y enviarla a MeterSim lleva casi 10 s, lo que suma muchas horas a lo largo de miles de imágenes. Así que el siguiente objetivo fue simular la propia cámara del lector, y ese sistema es SimGen2. Escala la imagen y luego le aplica filtros y deformaciones para que parezca una foto hecha con la cámara del lector.</p>
            <p>SimGen2 lo desarrolló por completo ChatGPT Astra 6 de OpenAI, que usó unas 4000 imágenes reales del lector para crear los filtros.</p>
          </>
        ),
        alt: 'Las seis etapas de procesado de SimGen2, de la captura de pantalla a la salida deformada, desenfocada, con tono, con ruido y comprimida en JPEG, con una franja del registro en cada etapa',
      },
      'sg-overlay': {
        eyebrow: 'SimGen2', title: 'Lo real sobre lo sintético',
        body: <p>SimGen2 genera una imagen en unos 2 s, casi 5× más rápido que hacerla con el lector físico, y funcionando junto al lector produjo decenas de miles de imágenes etiquetadas únicas para entrenar el modelo DrumNet Simulated. Aquí una captura real teñida de magenta se superpone a su versión de SimGen2 teñida de verde, así que la imagen queda sin color allí donde las dos coinciden, y el reflejo del LED en la captura real es la mayor diferencia que queda.</p>,
        alt: 'Una captura real teñida de magenta superpuesta a su versión sintética de SimGen2 teñida de verde; donde coinciden, la imagen queda sin color',
      },
      'sg-pairs': {
        eyebrow: 'SimGen2', title: 'Compáralas tú mismo',
        body: <p>Son veintiuna capturas reales y sus versiones de SimGen2 en seis diseños de contador, recortadas de las hojas del informe. Arrastra el divisor para compararlas, con la captura real a la izquierda y SimGen2 a la derecha. La franja del registro se ve más grande porque es la parte que lee DrumNet.</p>,
      },
    },
    compare: {
      realStrip: 'Captura real del registro del contador {meter}',
      simStrip: 'El mismo registro tal como lo generó SimGen2',
      realMeter: 'Captura real del contador {meter}',
      simMeter: 'El mismo contador tal como lo generó SimGen2',
      real: 'real',
      sim: 'SimGen2',
      divider: 'Divisor entre la captura real a la izquierda y SimGen2 a la derecha',
      pairs: 'Pares',
    },
  },

  /* ── Chapter VI: the agents ── */
  agents: {
    cover: {
      title: 'Flujo agéntico', lines: ['Flujo', 'agéntico'],
      contents: ['El bucle', 'Seis agentes', 'Recursos y el planificador', 'Gestionado con T3 Code'],
      lede: 'Seis agentes entrenaron y probaron los lectores a la vez, compartiendo un planificador para la computación y el banco de pruebas.',
    },
    page: 'Flujo agéntico',
    rows: {
      'ag-loop': {
        eyebrow: 'Flujo agéntico', title: 'El bucle de automejora',
        body: <p>En este proyecto usé muchísimo agentes de IA basados en LLM, y su tarea era mejorar toda la cadena de visión que corre en el ESP32-S3 hacia un objetivo del 99 % de precisión en las lecturas. Cada agente trabajaba en bucle: formulaba una hipótesis, planeaba cómo llevarla a cabo, reunía datos de entrenamiento, reentrenaba el modelo o lo ajustaba con fine-tuning o RL, comprobaba si había mejoras o regresiones, y luego contaba lo que había encontrado y volvía a empezar.</p>,
      },
      'ag-six': {
        eyebrow: 'Flujo agéntico', title: 'Seis agentes, tres de ellos en DrumNet',
        body: (
          <>
            <p>Tres agentes ejecutaban este bucle, cada uno con su propia variante de DrumNet, mientras otros tres se ocupaban de otras tareas. Tras una semana y media, Standard y Premade seguían rindiendo mal, así que se paró su desarrollo y todos sus recursos pasaron a DrumNet Simulated.</p>
            <p>A partir de ahí, DrumNet Simulated pudo entrenar con todos los conjuntos de datos, incluidos los del banco de pruebas y el catálogo externo, y pasó a llamarse DrumNet. La versión actual, V10, es la red que mejor funciona de toda la serie DrumNet.</p>
          </>
        ),
      },
      'ag-resources': {
        eyebrow: 'Flujo agéntico', title: 'Recursos compartidos y un planificador',
        body: (
          <>
            <p>Con seis agentes funcionando a la vez, no paraban de pelearse por los recursos, así que desarrollé un planificador que les deja reservar franjas de tiempo en los recursos compartidos. Uno es la computación para entrenar, que es la CPU de mi servidor y la GPU de mi portátil, y el otro es el banco Jetson, donde un agente puede grabar y trabajar con el Prototipo V1 mientras controla, a través de MeterSim, la pantalla a la que apunta el prototipo.</p>
            <p className="ws-note">En la línea de tiempo de computación del planificador, el área rellena muestra los hilos reservados frente al presupuesto de 20 hilos y la línea roja la memoria reservada frente al presupuesto de 9 GB, mientras que la GPU del portátil acepta un trabajo cada vez.</p>
          </>
        ),
        alt: [
          'Un boceto de los tres agentes de DrumNet compartiendo el banco Jetson y la computación a través de dos planificadores, con el coordinador, Sim2 Genius y el modelo detector de ventana al lado',
          'La línea de tiempo del planificador para los recursos de computación, con los bloques reservados por agente y la carga reservada frente al presupuesto',
        ],
      },
      'ag-t3': {
        eyebrow: 'Flujo agéntico', title: 'Gestionado con T3 Code',
        body: (
          <>
            <p>Los agentes funcionaban 24/7 con un «latido», un script sencillo que despierta a un agente tras un intervalo fijo o a una hora fija para que siga trabajando. Se les dijo que actuaran por su cuenta y tomaran sus propias decisiones, así que hizo falta muy poca intervención humana.</p>
            <p>La red funcionaba con Tailscale, una VPN personal peer-to-peer, que permitía a los agentes de mi servidor en casa llegar al banco Jetson de la escuela y controlarlo por SSH. Los propios agentes se gestionaban en T3 Code, un meta-harness de código abierto para Claude Code y Codex.</p>
          </>
        ),
        alt: 'Diagrama de T3 Code conectando el dispositivo cliente, el servidor de casa donde corren los agentes, la GPU del portátil y el banco Jetson de la escuela a través de Tailscale',
      },
    },
    loop: {
      steps: ['Hipótesis', 'Planificar la ejecución', 'Reunir los datos de entrenamiento', 'Reentrenar, ajustar o RL al modelo', 'Probar si hay mejora o regresión', 'Informar y luego una nueva hipótesis'],
      lines: [['Hipótesis'], ['Planificar la', 'ejecución'], ['Reunir los datos', 'de entrenamiento'], ['Reentrenar, ajustar', 'o RL al modelo'], ['Probar si hay', 'mejora o regresión'], ['Informar y luego', 'una nueva hipótesis']],
      aria: 'El bucle de los agentes: {steps}, y vuelta a empezar.',
      target: 'OBJETIVO',
      accuracy: 'de precisión',
    },
    badges: {
      model: 'Modelo', job: 'Tarea', data: 'Entrena con', won: 'hoy es DrumNet',
      list: {
        standard: { name: 'DrumNet Standard', persona: 'El purista', model: 'Fable 5.1, luego Opus 5.5', job: 'Lee tambores', data: 'Solo imágenes hechas por el Prototipo V1, a partir de la base DrumNet V1', fate: 'Parado tras semana y media' },
        simulated: { name: 'DrumNet Simulated', persona: 'El soñador', model: 'Fable 5.1, luego Opus 5.5', job: 'Lee tambores', data: 'Solo imágenes de SimGen2, generadas por completo por ordenador, a partir de la base DrumNet V1', fate: 'Rebautizado como DrumNet y ya en la V10' },
        premade: { name: 'DrumNet Premade', persona: 'El coleccionista', model: 'Fable 5.1, luego Opus 5.5', job: 'Lee tambores', data: 'Todos los conjuntos de datos: Prototipo V1, SimGen2, Badger55, Jomjol-digits, a partir del modelo dig-cont', fate: 'Parado tras semana y media' },
        windownet: { name: 'WindowNet', persona: 'El vigía', model: 'Opus 5.5', job: 'Encuentra la ventana', data: 'Entrena el localizador (DetNet) y el refinador (RefNet) que sitúan la ventana de los tambores', fate: 'Sigue siendo el eslabón más débil, donde empiezan casi todas las lecturas erróneas' },
        sim2: { name: 'Sim 2 Genius', persona: 'El tramoyista', model: 'Opus 5.5', job: 'Maneja el simulador', data: 'Opera, mantiene y mejora SimGen2 para los demás', fate: 'Hace que no falten imágenes sintéticas' },
        coordinator: { name: 'OCR Coordinator', persona: 'El capataz', model: 'Fable 5.1', job: 'Dirige el proyecto', data: 'Habla con todos los demás agentes, reserva su tiempo y mantiene el plan', fate: 'Pasó todo a Simulated cuando los demás se estancaron' },
      },
    },
  },

  /* ── Chapter VII: firmware (ReadCycle.tsx) ── */
  firmware: {
    cover: {
      title: 'Firmware', lines: ['Firmware', 'del lector'],
      contents: ['Escrito por un agente', 'Un ciclo de activación', 'El panel'],
      lede: 'En un ciclo de activación, el lector se despierta, captura el contador, lee los tambores, envía el número a casa y vuelve a dormirse.',
    },
    page: 'Firmware',
    chartAria: 'Flujo del firmware del lector en un ciclo de activación',
    success: 'éxito',
    fail: 'fallo',
    nextCycle: 'PRÓXIMO CICLO',
    nodes: {
      wake: { title: 'Despertar por RTC', sub: 'restaura el estado, inicia periféricos', time: '~0,2 s' },
      capture: { title: 'Captura de imagen', sub: 'imagen tomada con las luces LED', time: '~0,5 s' },
      low: { title: 'Lectura de bajo consumo', sub: 'solo lectores DrumNet, ROI guardado, sin WindowNet', time: '~0,5 a 3 s' },
      uplink: { title: 'Envío LoRaWAN', sub: 'lectura enviada al gateway', time: '~0,3 s' },
      sleep: { title: 'Dormir', sub: 'se apagan todos los periféricos' },
      full: { title: 'DrumNet completo', sub: 'repetir con WindowNet como respaldo' },
      check: { title: 'Comprobar confianza', sub: '¿es la nueva lectura lo bastante fiable?' },
      alt: { title: 'Probar otro localizador', sub: 'otro juego de pesos de respaldo' },
      reject: { title: 'Rechazar lectura', sub: 'guardada en NVS para evaluar, aviso en el panel' },
    },
    steps: {
      wake: 'El lector se despierta y recupera su configuración y su sesión LoRaWAN del almacenamiento no volátil.',
      capture: 'Se inicializa la cámara y se hace una captura con las luces LED.',
      low: 'La imagen pasa directamente por los lectores de DrumNet con el ROI guardado en la configuración, sin WindowNet. Es el camino normal y el más barato, y una lectura fiable pasa al envío tras unos 1,5 s despierto en total.',
      full: 'Solo si los lectores dan una confianza baja se ejecuta la cadena completa como respaldo, con WindowNet buscando otra vez la ventana.',
      check: 'Se comprueba la confianza de la nueva lectura, y la mayoría de las lecturas salen del bucle aquí.',
      alt: 'El localizador se ejecuta una vez más con otro juego de pesos de respaldo, como último intento de este ciclo.',
      reject: 'Un intento fallido se guarda en NVS para evaluarlo más tarde y se avisa de la baja confianza en el panel.',
      uplink: 'Se enciende el enlace LoRa y la lectura se envía al gateway.',
      sleep: 'Se apagan todos los periféricos y el lector entra en sueño profundo hasta que el RTC lo despierta para el siguiente ciclo, aunque pulsar BOOT lo despierta para configurarlo.',
    },
    rows: {
      'fw-agents': {
        eyebrow: 'Firmware', title: 'Escrito por un agente, en hardware real',
        body: (
          <>
            <p>A un agente Astra 6 le encargué escribir el firmware del lector (Prototipo V2) y del M5Stack Cardputer Adv, que ejecuta ConfigKing, la consola de configuración con la que los técnicos sobre el terreno preparan los lectores para su despliegue y los reconfiguran después. Al agente se le dijo que solo escribiera código usando Fable 5.1.</p>
            <p className="ws-note">Mi portátil, el gateway LoRaWAN (cedido amablemente por el Sr. Lee Chang Fatt) y la Jetson Nano estaban en la misma red, el Cardputer y el Prototipo V2 iban conectados al portátil por serie USB, y los cuatro dispositivos quedaron a disposición de los agentes.</p>
          </>
        ),
        alt: 'El montaje para desarrollar el firmware: el portátil, la Jetson Nano, el gateway LoRaWAN, el lector Prototipo V2 y el Cardputer, con los agentes llegando a ellos por la red',
      },
      'fw-cycle': { eyebrow: 'Un ciclo de activación', title: 'Nueve pasos, aunque casi siempre bastan cinco' },
      'fw-dashboard': {
        eyebrow: 'Panel', title: 'Dónde se muestra la lectura',
        body: <p>Una vez hecha la lectura, se envía al gateway LoRaWAN, que la reenvía por MQTT a la Jetson Nano, donde se guarda. La Jetson sirve el panel como un único archivo HTML cuyo JavaScript actualiza los valores con los datos guardados, pero el panel es solo una demo y no está pensado para escalar a despliegues reales.</p>,
        alt: 'El panel de seguimiento de lectores: la tarjeta de un lector de banco que marca 0092.07 metros cúbicos con un aviso de baja confianza, y gráficos de historial y una tabla de nueve lecturas',
      },
    },
  },

  /* ── Chapter VIII: power ── */
  power: {
    cover: {
      title: 'Ahorro de energía', lines: ['Ahorrar', 'energía'],
      contents: ['Submuestreo', 'Modos de captura, lado a lado', 'Atenuación por PWM', 'Escala de grises', 'INT8 y cálculo vectorial', 'Hardware'],
      lede: 'Cada paso del ciclo de activación se recortó pensando en 2 años de batería, con capturas más pequeñas, menos luz y cálculo con enteros.',
    },
    page: 'Ahorro de energía',
    modes: [
      { time: 'captura en 350 ms', note: 'todos los píxeles del sensor' },
      { time: 'captura en 89 ms', note: 'SVGA, el modo elegido' },
      { time: 'captura en 61 ms', note: 'CIF, pocos píxeles por tambor' },
    ],
    modeAlt: 'Captura del contador a {res}',
    drumsAria: 'los tambores a {res}',
    int8: [
      { value: '61 s', label: 'Float32', note: 'de la captura a la predicción, antes de cuantizar' },
      { value: '17 s', label: 'INT8 + ESP-NN', note: 'unas 3,6× más rápido' },
    ],
    hardware: [
      { name: 'Buck-boost TPS63900', note: '~75 nA en reposo, mantiene 3,3 V con cualquier entrada, apto para Li-SOCl2' },
      { name: 'LDO de baja Iq', note: '1,5 V y 2,8 V para la cámara, sin artefactos de conmutación' },
      { name: 'Temporizador Ambiq AM1805', note: 'lo apaga todo y lo vuelve a encender según un horario' },
      { name: 'LoRaWAN', note: 'bajo consumo, largo alcance, un estándar abierto que el operador puede gestionar' },
    ],
    rows: {
      'pw-sub': {
        eyebrow: 'Ahorro de energía · software', title: 'Submuestreo en la cámara',
        body: (
          <>
            <p>El lector tiene que funcionar hasta 2 años con un solo juego de baterías. El ESP32-S3 es bastante eficiente en trabajo pesado como el cálculo vectorial que necesita una red neuronal, pero ni de lejos tanto como la gama nRF de Nordic, así que usé las estrategias de este capítulo para recortar su consumo. Sus radios inalámbricas solo hacen falta para la configuración inicial, así que se apagan durante el despliegue.</p>
            <p>El OV2640 captura hasta 1600 × 1200, y también tiene modos de submuestreo a 800 × 600 (SVGA) y 400 × 296 (CIF).</p>
          </>
        ),
        alt: ['Diagrama del modo de submuestreo SVGA del OV2640 que muestra qué píxeles se saltan', 'Diagrama del modo de submuestreo CIF del OV2640'],
      },
      'pw-modes': {
        eyebrow: 'Modos de captura, lado a lado', title: 'SVGA, el modo elegido, en 89 ms',
        body: (
          <>
            <p>Es el mismo contador a las tres resoluciones, con el cuadro completo arriba y los tambores abajo al mismo aumento. A 1600 × 1200 se lee cada píxel del sensor y la captura tarda 350 ms, y eso importa porque cuanto menos tiempo está encendida la cámara, menos energía gasta. A 400 × 296 la captura tarda solo 61 ms, pero a los tambores les quedan muy pocos píxeles para leerlos con fiabilidad.</p>
            <p>En mis pruebas, SVGA dio el mejor equilibrio entre calidad y velocidad, y a 800 × 600 la red procesa 4× menos información que a 1600 × 1200. No hice pruebas en serio para respaldar la precisión, aunque por lo que vi no se resintió mucho.</p>
          </>
        ),
      },
      'pw-pwm': {
        eyebrow: 'Ahorro de energía · software', title: 'Atenuación PWM de los LED',
        body: <p>Al principio descarté la atenuación por PWM porque el OV2640 tiene rolling shutter, que podía capturar durante los ciclos apagados de la señal PWM y mostrar bandas. En la práctica el OV2640 no mostró ninguna banda, así que hago funcionar los LED a 20 kHz con un ciclo de trabajo del 50 %, lo que ahorra algo de energía y añade control del brillo.</p>,
        alt: ['Una captura con bandas horizontales sobre la esfera del contador', 'Una captura con los LED atenuados por PWM y sin bandas'],
      },
      'pw-grey': {
        eyebrow: 'Ahorro de energía · software', title: 'Escala de grises en la cámara',
        body: <p>El OV2640 convierte la imagen a escala de grises en la propia cámara y devuelve un archivo algo más pequeño, y aunque el ahorro es mínimo o nulo, fue fácil de implementar.</p>,
        alt: ['El contador capturado en escala de grises por la cámara', 'El mismo contador capturado en color'],
      },
      'pw-int8': {
        eyebrow: 'Ahorro de energía · software', title: 'Instrucciones vectoriales e INT8',
        body: <p>Las primeras versiones de DrumNet corrían en Float32 de precisión completa en el ESP32-S3, y eso era lento e ineficiente. El ESP32-S3 tiene instrucciones vectoriales integradas, que se usan a través de la librería ESP-NN y que hacen varias operaciones de multiplicación y acumulación (MAC) por ciclo de reloj, y una vez cuantizado DrumNet a 8 bits, el tiempo de la captura a la predicción bajó de 61 s a 17 s, unas 3,6× más rápido. No he medido bien la mejora de eficiencia, aunque estoy seguro de que también mejoró mucho.</p>,
      },
      'pw-hw': {
        eyebrow: 'Ahorro de energía · hardware', title: 'Convertidores de baja Iq, un temporizador y LoRaWAN',
        body: (
          <ul>
            <li><b>Convertidores DC-DC de baja Iq y alta eficiencia.</b> El OV2640 necesita 1,5 V y 2,8 V. Los convertidores buck son más eficientes que los LDO, pero su alta corriente de reposo y su diseño más complejo añaden coste y espacio en la placa a cambio de casi nada, y pueden meter artefactos en la imagen, así que me quedé con LDO de baja corriente de reposo. La línea principal de 3,3 V pasaría a un convertidor buck-boost especial de baja Iq (~75 nA), el TI TPS63900.</li>
            <li><b>Circuitos temporizadores de ultrabajo consumo.</b> Un temporizador como el Ambiq AM1805 puede apagar todos los componentes y volver a encenderlos según un horario, aunque la ganancia probablemente sería mínima.</li>
            <li><b>LoRaWAN.</b> Elegí LoRaWAN por su bajo consumo y su largo alcance, y porque es un estándar abierto, así que, a diferencia de Sigfox y NB-IoT, el operador puede tener y gestionar toda la red.</li>
          </ul>
        ),
      },
    },
  },

  /* ── Chapter IX: camera (FocusLab.tsx) ── */
  camera: {
    cover: {
      title: 'La cámara', lines: ['La', 'cámara'],
      contents: ['Dos lentes para el OV2640', 'La prueba de enfoque'],
      lede: 'Probé dos lentes del OV2640 frente a cartas de enfoque a 3, 4 y 6 cm.',
    },
    page: 'La cámara',
    lab: {
      lenses: { '160': 'Lente de 160°', '120': 'Lente de 120°' },
      charts: { b: 'Carta B (ISO 12233)', a: 'Carta A (a mano)' },
      cm: '{d} cm',
      lens: 'Lente',
      distance: 'Distancia',
      chart: 'Carta',
      alt: 'Lente de {lens}°, carta {chart} a {dist} cm, cuadro completo',
      caption: 'cuadro completo · {lens}° · {dist} cm',
      chosen: ' · la configuración elegida',
      parts: { centre: 'centro', left: 'izquierda', right: 'derecha' },
      cropAria: 'recorte, {part}',
      notInFrame: 'Fuera del cuadro',
      notes: {
        '160': 'La variante de 160° enfoca bien los objetos cercanos, pero su enfoque parece ir cayendo desde el centro hacia la izquierda de la imagen, y hacia la derecha el efecto no es ni de lejos tan fuerte.',
        '120': 'La variante de 120° claramente no enfoca bien los objetos cercanos (macro), y su enfoque cae de forma uniforme en cono, como cabe esperar de una lente de foco fijo.',
      },
    },
    rows: {
      'cam-why': {
        eyebrow: 'La cámara', title: 'Una cámara macro que abarque los tambores',
        body: (
          <>
            <p>Necesitaba una buena cámara macro lo bastante ancha para captar todo el ancho de los tambores del contador desde muy cerca. Ninguna tienda de confianza tenía una opción que fuera barata y tuviera el conector adecuado a la vez, así que compré dos cámaras OV2640 en Lazada, una con una lente de 160° de campo de visión y otra con una de 120°. No se vendían como cámaras macro, pero las lentes gran angular tienen por naturaleza una distancia de enfoque muy corta y una profundidad de campo aparente mucho mayor.</p>
            <p>Para la prueba hice una foto con las dos cámaras a 3 cm, 4 cm y 6 cm frente a dos cartas de enfoque. La carta A la dibujé a mano, y la carta B es la carta ISO 12233 de Stephen H. Westin, de Cornell. Cada cámara funcionaba en una placa de cámara ESP32-S3 de repuesto con un sencillo applet web escrito con un agente de IA, y estaba montada en el lateral de una caja con una regla que salía desde la lente, mientras las cartas estaban en un soporte móvil.</p>
          </>
        ),
        alt: 'La caja de la prueba de enfoque con la placa de cámara ESP32 en el lateral y una regla en el suelo',
      },
      'cam-lab': {
        eyebrow: 'La prueba de enfoque', title: 'La configuración elegida, 160° a 4 cm',
        body: (
          <>
            <p>Elige una lente, una distancia y una carta para ver la captura completa, con su centro, su izquierda y su derecha recortados del mismo cuadro a píxeles reales. Son lentes de foco fijo, así que el enfoque viene fijado para siempre de fábrica, y a partir de aquí uso la variante de 160° a 4 cm.</p>
            <p className="ws-note">La carta estaba recta frente a la cámara, sin inclinaciones ni abolladuras importantes, y la variante de 120° cae de forma uniforme, así que el enfoque torcido de la variante de 160° apunta a un defecto de fabricación, aunque no tengo cámaras de repuesto para comprobar si es así.</p>
          </>
        ),
      },
    },
  },

  /* ── Chapter X: Prototype V2 and the enclosure ── */
  proto: {
    cover: {
      title: 'Prototipo V2', lines: ['Prototipo', 'V2'],
      contents: ['Un Prototipo V1 en pequeño', 'Como una placa de desarrollo', 'La carcasa y el adaptador'],
      lede: 'El Prototipo V2 es el Prototipo V1 encogido al tamaño de una placa de desarrollo, en una carcasa de dos piezas que no necesita herramientas.',
    },
    page: 'Prototipo V2',
    enclosurePage: 'Carcasa',
    rows: {
      'v2-intro': {
        eyebrow: 'Prototipo V2', title: 'Un Prototipo V1 en pequeño',
        body: <p>El Prototipo V2 es una versión reducida del Prototipo V1, que cabe en espacios más estrechos y me dejó probar componentes más pequeños como el módulo LoRa Wio-SX1262 de Seeed Studio. Lleva gestión de batería integrada, circuitos de alimentación para la cámara y el ventilador, luces LED regulables por PWM y un módulo LoRa. Diseñé la placa de 4 capas en KiCad, compré los componentes en DigiKey y la fabricó JLCPCB, y los circuitos están en el informe.</p>,
        alt: 'Render 3D de la cara superior de la placa del Prototipo V2 desde KiCad',
      },
      'v2-size': {
        eyebrow: 'Prototipo V2', title: 'Como una placa de desarrollo',
        body: (
          <>
            <p>Diseñé la PCB para que tuviera más o menos el tamaño de una placa de desarrollo ESP32-S3 típica, así que cabe en una carcasa más pequeña que va bien para contadores en espacios estrechos.</p>
            <p className="ws-note">El Prototipo V2 se hizo antes de escribir el informe, así que aún tiene algunas decisiones que he dejado atrás. El ventilador se propuso para la humedad alta, que puede provocar empañamiento, pero se quitará si las lecturas no son fiables, y los circuitos de alimentación se diseñaron antes de decidir usar pilas de Li-SOCl2.</p>
          </>
        ),
        alt: 'La PCB del Prototipo V2 junto a una placa de desarrollo ESP32-S3 de casi el mismo tamaño',
      },
      'en-all': {
        eyebrow: 'Carcasa', title: 'Carcasa sin herramientas y adaptador en dos piezas',
        body: (
          <>
            <p>La carcasa interior aloja la PCB y las baterías del Prototipo V2. Exporté el archivo 3D de KiCad a Onshape como referencia, modelé la cámara a mano para que fuera exacta y diseñé la carcasa para que no necesitara herramientas: unos clips laterales encajan las dos mitades, unas ranuras y pasadores evitan que se deslicen de lado, unas plataformas y postes sujetan la PCB sin tornillos, y un hueco deja pasar el cable IPEX de LoRa hasta el transceptor. La impresión final encajó y quedó bien acabada, pero tuve que abrir un agujero para la cámara, que quedó montada al revés por una disposición de pines incorrecta en la fase de montaje.</p>
            <p>El adaptador exterior tiene dos piezas. La mitad inferior se apoya contra el contador y mantiene la lente de la cámara a unos 4 cm de la esfera, la distancia de enfoque elegida en la prueba de la cámara, mientras que la mitad superior, mucho más ancha, deja sitio para alinear el lector con los tambores y me permite reutilizarla en otros contadores rediseñando solo la mitad inferior. Se me olvidaron las pestañas que bloquean la tapa del contador, así que les hice sitio con unos cuantos cortes de alicate.</p>
          </>
        ),
        figures: [
          { alt: 'El modelo 3D de la placa en KiCad, con la cámara modelada, usado como referencia en Onshape', caption: 'la exportación de KiCad usada como referencia en Onshape' },
          { alt: 'La carcasa interior impresa, con la placa dentro', caption: 'la carcasa interior impresa' },
          { alt: 'Una sección CAD del adaptador que muestra la cámara a unos 4 cm de la esfera del contador', caption: 'una sección del adaptador, a 4 cm de la esfera' },
          { alt: 'El adaptador terminado, montado en el contador', caption: 'el adaptador montado en el contador' },
        ],
      },
    },
  },

  /* ── Chapter XI: conclusion ── */
  conclusion: {
    cover: {
      title: 'Conclusión', lines: ['Conclusión'],
      contents: ['Dónde está el proyecto', 'El informe'],
      lede: 'El lector acierta el 56 % de las lecturas frente a un objetivo del 99 %, y este capítulo cuenta qué haría falta para cerrar la diferencia.',
    },
    page: 'Conclusión',
    row: {
      eyebrow: 'Conclusión', title: 'Dónde está el proyecto',
      body: (
        <>
          <p>Por falta de tiempo, el proyecto se queda donde está, y aún hay muchos problemas por resolver antes de que pueda ser una solución viable. No he medido su consumo ni lo he probado frente a la vida nominal de 2 años, y no creo que el Prototipo V2 pueda alcanzarla tal como está, así que hace falta una tercera revisión con componentes que ahorren más energía antes de que merezca la pena medir el consumo. El firmware, en cambio, está cerca de la eficiencia que buscaba.</p>
          <p>DrumNet V10 acierta el 56 % de las lecturas, muy lejos del objetivo del 99 %. El cuello de botella principal es WindowNet, porque la mayoría de las lecturas erróneas vinieron de que no encontraba el ROI correcto. Los lectores también muestran señales de falta de entrenamiento, y un contador que no han visto da una confianza baja porque en el conjunto de datos dominaban los 9 contadores que SimGen2 podía generar, así que un conjunto más grande y variado podría ayudar en las dos cosas. La carcasa es demasiado voluminosa para un despliegue real, sobre todo por la altura de la cámara, así que necesito una cámara más baja que sea mejor en macro, y el sellado contra la intemperie necesitará otros materiales y diseños.</p>
          <p className="ws-note">Gran parte de este proyecto fue mi primer intento de algo nuevo, y aunque no estoy del todo satisfecho con el resultado, estoy orgulloso de los conocimientos y la experiencia que he ganado, y agradecido por la rara oportunidad de tener tiempo, recursos y apoyo para aprender y experimentar a mi manera. Gracias al Sr. Alex Oh (NYP) por su guía, sus conocimientos y sus ánimos, al Sr. Soh (NYP), sin quien no habría conseguido que funcionara la cámara, y al Sr. Lee Chang Fatt (NYP) por el gateway LoRaWAN.</p>
        </>
      ),
    },
    figures: [
      { value: '56 %', label: 'cadena completa', note: '808 de 1.440 lecturas correctas' },
      { value: '99 %', label: 'el objetivo', note: 'toda la lectura correcta' },
      { value: '93,2 %', label: 'solo DrumNet', note: 'conjunto de prueba combinado, sin WindowNet' },
      { value: '2 años', label: 'la vida objetivo', note: 'aún sin medir, y antes hace falta una placa V3' },
    ],
  },

  /* ── Chapter XII: the report ── */
  report: {
    title: 'El informe',
    frameTitle: 'Informe OCR Water Meter Reader (PDF)',
    name: 'OCR Water Meter Reader',
    about: 'Solución OCR de bajo coste y consumo, basada en visión, para leer contadores de agua. Braven Chiam, Ingeniería Electrónica y de Computadores en NYP. 58 páginas, PDF, 6,8 MB.',
    open: 'Abrir el informe',
    note: 'Usé mucho las herramientas de IA para desarrollar este proyecto. Escribí yo mismo la mayor parte del informe, con mis propias palabras, salvo la introducción y algunos gráficos, y otros usos de la IA fueron la investigación, la creación de gráficos y la verificación de datos. Este proyecto tiene un Nivel 3 en mi escala de uso de IA.',
  },
};

export default es;
