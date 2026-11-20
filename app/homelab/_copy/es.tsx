import type { HomelabCopy } from './en';

/* The homelab page's Spanish words, in the same shape as en.tsx. */
const es: HomelabCopy = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Tengo tres servidores en casa para mi fototeca, para compartir archivos y para los servidores MQTT y TURN que usan Project June y LUMEN. Esta página cuenta su hardware, el mapa de red, el almacenamiento, los servicios y su estado en directo.',
  },
  jsonLd: {
    headline: 'Homelab',
    about: ['Autoalojamiento', 'Redes domésticas', 'Docker', 'Unraid', 'Proxmox', 'UniFi'],
  },

  details: 'Detalles de {name}',
  close: 'Cerrar',

  hero: {
    checking: 'Comprobando servicios públicos',
    online: '{count}servicios públicos en línea',
    onlineCount: '{n} de {total}',
    tele: 'NewMain corre Unraid 7.1.2',
    eyebrow: 'Homelab',
    title: <>Tres servidores <em>en mi cuarto</em></>,
    lead: 'Mueven mi fototeca, mis archivos y los servidores MQTT y TURN que usan Project June y LUMEN, y además es donde aprendo redes, almacenamiento y Docker y donde alojo lo que construyo.',
    stats: [
      { v: '3', k: 'servidores' },
      { v: '38', k: 'servicios propios' },
      { v: '24 TB', k: 'útiles' },
      { v: '4', k: 'VLANs' },
    ],
    mapCta: 'Ver el mapa de red',
    stackCta: 'Ver los servicios',
    scrollCue: 'Baja',
  },

  mission: {
    eyebrow: 'El porqué',
    title: 'Para qué sirve',
    lead: 'Mis proyectos de hardware necesitan servidores con los que hablar: Project June transmite sus cámaras a través de mi servidor TURN y usa mi bróker MQTT para la telemetría y el control, y el relé de voz de LUMEN corre aquí en Docker. Gestionar todo esto yo mismo es como aprendí redes, almacenamiento y despliegue.',
    pillars: {
      cloud: { k: 'Servidores y discos', d: 'Contenedores Docker ejecutan los servicios que uso a diario detrás de un proxy inverso, con dos niveles de almacenamiento y copias de seguridad.' },
      net: { k: 'Redes', d: 'La red tiene cuatro VLANs, RADIUS y Wi-Fi WPA3-Enterprise, sobre switches y puntos de acceso UniFi.' },
      code: { k: 'Desplegar mis apps', d: 'Las apps que creo se despliegan en una VM del clúster Proxmox, y lo siguiente es que unos agentes gestionen partes del lab por su cuenta.' },
      link: { k: 'Para mis proyectos', d: 'coturn permite a Project June transmitir vídeo por 5G, y Mosquitto lleva los mensajes de mis proyectos escolares con ESP32.' },
    },
  },

  machines: {
    eyebrow: 'Hardware',
    title: 'Servidores',
    photoAlt: 'El servidor {name}',
    more: 'Specs y detalles',
    rack: {
      alt: 'El rack del homelab en mi cuarto: el panel de parcheo con cables azules arriba y los servidores detrás de una puerta de malla',
      eyebrow: 'El rack',
      title: 'Los tres servidores en un armario',
      body: 'El rack está en una esquina de mi cuarto, con el panel de parcheo arriba y los servidores detrás de la puerta de malla. Dos funcionan todo el tiempo, y Adell se queda apagado hasta que lo necesito.',
    },
  },

  statusLabels: { 'always-on': '24/7', 'on-demand': 'Bajo demanda' },

  specLabels: {
    os: 'SO', cpu: 'CPU', memory: 'Memoria', gpu: 'GPU', array: 'Array', fastPool: 'Pool rápido',
    storage: 'Discos', boot: 'Arranque', hosts: 'Aloja', power: 'Energía',
  },

  servers: {
    newmain: {
      tag: 'Servidor principal',
      role: 'Almacenamiento y casi todo Docker',
      blurb: 'Este es el servidor principal: un array de Unraid protegido por paridad guarda los datos en bloque, un espejo ZFS de NVMe guarda todo lo que necesita velocidad, y aquí corren casi todos los contenedores Docker.',
      specs: {
        cpu: 'Ryzen 9 5950X, 16 núcleos',
        array: '2 de paridad + 3 de datos',
        fastPool: '2 × 2 TB NVMe, espejo ZFS',
      },
      detail: {
        tagline: 'Almacenamiento y casi todos los servicios',
        story: [
          'Unraid junta discos dispares en un solo array protegido por paridad para los datos en bloque, mientras que un espejo ZFS aparte de dos discos NVMe guarda los datos de las apps Docker, las bases de datos y los discos de las VMs.',
          'Casi todos los servicios de esta página corren aquí, incluido todo lo que hay detrás de los subdominios de chiambucket.com. La GTX 1070 se encarga de la transcodificación de vídeo y del aprendizaje automático que hay detrás de la búsqueda y la agrupación de caras de Immich.',
          'Toco esta máquina lo menos posible, porque todo lo demás depende de ella.',
        ],
        highlights: [
          'El array de paridad aguanta que fallen dos discos a la vez',
          'Espejo ZFS de NVMe para datos de apps y discos de VMs',
          'Ejecuta casi todos los contenedores Docker',
          'GTX 1070 para el aprendizaje automático de Immich y la transcodificación',
        ],
      },
    },
    caca: {
      tag: 'Nodo Proxmox, 24/7',
      role: 'Clúster Proxmox, siempre activo',
      blurb: 'CaCa es un ThinkCentre pequeño que antes era mi servidor principal, y ahora es el nodo siempre encendido de un clúster Proxmox, con las VMs de CasaOS y Debian en su propio SSD de 1 TB.',
      specs: {
        storage: 'SSD NVMe de 1 TB, arranque y VMs',
        boot: 'SSD NVMe local',
        hosts: 'VMs de CasaOS y Debian',
      },
      detail: {
        tagline: 'El nodo Proxmox que nunca se apaga',
        story: [
          'CaCa era mi servidor principal antes de NewMain, y ahora es la mitad siempre encendida de un clúster Proxmox de dos nodos con Adell.',
          'Arranca Proxmox desde un SSD NVMe de 1 TB que lleva dentro, y las máquinas virtuales de CasaOS y Debian que antes corrían directamente sobre el hardware ahora corren desde el mismo disco.',
          'Consume poco, así que se queda encendido día y noche mientras Adell duerme.',
        ],
        highlights: [
          'Arranca y ejecuta sus VMs desde un SSD NVMe local de 1 TB',
          'Aloja las VMs de CasaOS y Debian',
          'Bajo consumo, encendido 24/7',
          'Forma clúster con Adell para la migración en vivo',
        ],
      },
    },
    adell: {
      tag: 'Nodo Proxmox, bajo demanda',
      role: 'Clúster Proxmox, se despierta bajo demanda',
      blurb: 'Adell tiene veinte núcleos Xeon y 128 GB de RAM y está en el mismo clúster Proxmox que CaCa, pero consume mucho, así que se queda apagado hasta que lo despierto con UpSnap.',
      specs: {
        cpu: '2 × Xeon E5-2470 v2, 20 núcleos',
        storage: 'PERC H710P en modo IT',
        power: 'Solo Wake-on-LAN',
      },
      detail: {
        tagline: 'La máquina grande que despierto cuando la necesito',
        story: [
          'Adell es la máquina grande del clúster, con dos Xeon que suman veinte núcleos y 128 GB de RAM, así que consume demasiado para dejarla encendida.',
          'Cuando un trabajo la necesita, pulso despertar en UpSnap, que envía un paquete Wake-on-LAN, y Adell arranca por red, hace el trabajo y vuelve a dormirse.',
        ],
        highlights: [
          'Veinte núcleos Xeon, 128 GB de RAM',
          'Se despierta bajo demanda con Wake-on-LAN',
          'Arranque PXE, sin disco de sistema local',
          'Apagado hasta que un trabajo lo necesita',
        ],
      },
    },
  },

  visuals: {
    runsLabel: 'Qué corre aquí',
    runsFoot: '{n} de los {total} servicios de esta página corren en NewMain',
    bootLabel: 'Cómo arranca',
    bootSteps: [
      { t: 'SSD local', s: 'Un SSD NVMe de 1 TB dentro de la máquina' },
      { t: 'Proxmox', s: 'Proxmox arranca desde ese disco' },
      { t: 'VMs', s: 'CasaOS y Debian corren desde el mismo SSD' },
    ],
    wakeLabel: 'Cómo despierta',
    wakeFoot: <>Un solo paquete Wake-on-LAN desde UpSnap enciende los <b>20 núcleos</b></>,
  },

  map: {
    eyebrow: 'Red',
    title: 'Mapa de red',
    lead: 'Mi casa funciona con una sola red UniFi dividida en cuatro VLANs, y puedes elegir un dispositivo para ver qué hace o una VLAN para resaltar los dispositivos que tiene.',
    clear: 'Quitar resaltado',
    tip: 'Elige una VLAN para resaltar sus dispositivos',
    svgLabel: 'Mapa de red. Elige un dispositivo para ver los detalles.',
    core: 'Red troncal',
    segment: 'Segmento',
    hint: 'Elige un dispositivo para ver qué hace.',
    legend: {
      unraid: 'VLAN Unraid',
      server: 'VLAN de servidores',
      default: 'VLAN por defecto',
      iot: 'VLAN IoT, aislada',
    },
    vlans: {
      unraid: { label: 'VLAN Unraid', blurb: 'NewMain está sola en esta VLAN, y las VLANs de confianza pueden llegar a ella para el almacenamiento y las apps, pero la VLAN IoT no.' },
      server: { label: 'VLAN de servidores', blurb: 'CaCa y Adell, el clúster Proxmox, comparten este segmento para poder migrar VMs en vivo y arrancar por PXE.' },
      default: { label: 'VLAN por defecto', blurb: 'Aquí están los equipos de trabajo y la Wi-Fi principal WPA3-Enterprise, que pueden llegar a los servidores, mientras que la VLAN IoT no puede llegar a ellos.' },
      iot: { label: 'VLAN IoT', blurb: 'Los dispositivos inteligentes tienen acceso a internet y a nada más, porque las reglas del firewall bloquean este segmento frente a todas las demás VLANs.' },
      core: { label: 'Red troncal', blurb: 'El gateway y los switches que enrutan entre las VLANs.' },
    },
    nodes: {
      internet: { label: 'Internet', sub: 'Borde público',
        detail: 'El tráfico entrante llega a una única dirección pública y va directo al gateway, así que nada de lo que hay detrás es accesible directamente.' },
      udm: { label: 'UDM Pro', sub: 'Gateway, firewall, RADIUS',
        detail: 'La UniFi Dream Machine Pro es el gateway, el firewall, el controlador de red y el servidor RADIUS. Decide qué VLAN puede llegar a cuál y autentica la Wi-Fi WPA3-Enterprise.' },
      sw1: { label: 'USW Pro Max 24', sub: 'Rack de servidores',
        detail: 'Este switch de 24 puertos está en el rack de servidores, y cada servidor se conecta a él con un par de enlaces redundantes.' },
      sw2: { label: 'USW Flex 2.5G', sub: 'General',
        detail: 'Este switch de 2,5 Gb conecta los dispositivos de uso diario más rápidos del piso.' },
      sw3: { label: 'USW Lite 8 PoE', sub: 'Alimenta los APs',
        detail: 'Este switch PoE de 8 puertos conecta y alimenta los cinco puntos de acceso, con un cable cada uno.' },
      newmain: { label: 'NewMain', sub: 'Unraid',
        detail: 'El servidor Unraid tiene una VLAN para él solo, a la que las VLANs de confianza pueden llegar para el almacenamiento y las apps, pero la VLAN IoT no.' },
      caca: { label: 'CaCa', sub: 'Siempre activo',
        detail: 'CaCa es el nodo Proxmox que nunca se apaga, y comparte la VLAN de servidores con Adell.' },
      adell: { label: 'Adell', sub: 'Bajo demanda',
        detail: 'Adell es el nodo Proxmox que despierto cuando lo necesito, y comparte la VLAN de servidores con CaCa para la migración en vivo y el arranque PXE.' },
      clients: { label: 'Equipos', sub: 'Portátiles, sobremesa',
        detail: 'Los dispositivos de uso diario están en la VLAN por defecto, desde donde pueden llegar a los servidores, pero la VLAN IoT no puede llegar a ellos.' },
      aps: { label: '5 APs UniFi', sub: 'Wi-Fi',
        detail: 'Cinco puntos de acceso emiten dos redes Wi-Fi separadas por todo el piso, alimentados por PoE desde el Lite 8.' },
      wmain: { label: 'WLAN principal', sub: 'WPA3-Enterprise',
        detail: 'La Wi-Fi principal usa WPA3-Enterprise con RADIUS en la UDM Pro, así que cada dispositivo tiene sus propias credenciales.' },
      wiot: { label: 'WLAN IoT', sub: 'Aislada',
        detail: 'Los dispositivos inteligentes tienen acceso a internet y a nada más, porque las reglas del firewall los bloquean frente a todas las demás VLANs.' },
    },
  },

  storage: {
    eyebrow: 'Discos y VMs',
    title: 'Discos y máquinas virtuales',
    poolsTitle: 'Almacenamiento en NewMain',
    disks: { parity: 'P', data: 'D', nvme: 'NVMe' },
    array: {
      name: 'Array',
      sub: 'Unraid, con paridad',
      body: 'Tiene dos discos de paridad y tres de datos, así que aguanta que fallen dos discos a la vez, y guarda copias de PXE, archivos antiguos y multimedia.',
    },
    fast: {
      name: 'Pool rápido',
      sub: 'Espejo ZFS de NVMe',
      body: 'Dos discos NVMe de 2 TB forman un espejo ZFS, desde el que corren los datos de las apps Docker, los discos de las VMs y la biblioteca de ISOs de PXE.',
    },
    sharedOver: 'Compartido por',
    protocols: ['SFTP', 'SMB en la red local', 'NFS a Linux y macOS'],
    clusterTitle: 'El clúster Proxmox',
    clusterLead: 'CaCa y Adell forman un clúster Proxmox. CaCa arranca desde su propio SSD de 1 TB y se queda encendido, mientras que Adell arranca por red sin disco de sistema local y lo despierto cuando necesito sus núcleos.',
    vms: [
      { k: 'claudeplayground', d: 'Es una VM de Ubuntu donde despliego las apps que creo, y Claude tiene acceso SSH para publicarlas.' },
      { k: 'CasaOS y Debian', d: 'Estas VMs antes corrían directamente sobre el hardware.' },
      { k: 'Wake-on-LAN', d: 'UpSnap enciende Adell cuando un trabajo lo necesita, así que solo consume mientras trabaja.' },
    ],
  },

  stack: {
    eyebrow: 'Software',
    title: 'Servicios',
    lead: 'Estos son los servicios principales de los 38, y los públicos muestran un estado en directo que se comprueba cada minuto.',
    filterLabel: 'Filtrar servicios',
    categories: {
      all: 'Todos',
      access: 'Acceso',
      files: 'Archivos',
      media: 'Multimedia',
      monitoring: 'Monitoreo',
      projects: 'Proyectos',
    },
    checkedAt: 'Comprobado a las {time}',
    checking: 'Comprobando estado',
    showFewer: 'Ver menos',
    showAll: 'Ver los {n} servicios',
    status: { up: 'en línea', down: 'caído', wait: 'comprobando', build: 'en desarrollo', self: 'privado' },
    loadLabel: 'Carga: {label}',
    weights: {
      extreme: 'Máxima',
      'very-high': 'Muy alta',
      high: 'Alta',
      moderate: 'Moderada',
      low: 'Ligera',
      dev: 'En desarrollo',
      diagnostic: 'A demanda',
    },
    facts: { runsOn: 'Corre en', load: 'Carga', access: 'Acceso', category: 'Categoría' },
    access: {
      public: 'Público, a través de Nginx Proxy Manager y CrowdSec',
      dev: 'En desarrollo en NewMain',
      private: 'Privado, en la red de Tailscale',
    },
    visit: 'Visitar {host}',
  },

  services: {
    openclaw: {
      blurb: 'Ahora estoy creando OpenClaw, un ejecutor que deja a los agentes de IA hacer tareas reales en el lab, y todavía no está terminado.',
      long: [
        'La idea es darle a un agente un sitio seguro dentro del lab donde pueda arrancar un contenedor, revisar un servicio, desplegar una app pequeña e informar de vuelta.',
        'Viene de haberle dado a Claude acceso SSH a una VM para desplegar mis apps, y el siguiente paso es dejar que gestione partes del lab mientras yo reviso los resultados.',
      ],
    },
    npm: {
      blurb: 'Está delante de cada servicio público como proxy inverso: termina el SSL, envía cada subdominio de chiambucket.com a su contenedor y ejecuta un bouncer de CrowdSec que bloquea las IPs hostiles.',
      long: [
        'Todo el tráfico público llega a una sola dirección y pasa primero por NPM, así que ningún contenedor queda expuesto directamente a internet.',
        'CrowdSec vigila el tráfico en busca de patrones de ataque y bloquea el origen. Como todo pasa por NPM, todos los servicios públicos se caen cuando se cae NPM.',
      ],
    },
    tailscale: { blurb: 'Es una malla WireGuard que pone todos mis dispositivos en una red privada, y la uso para entrar por SSH y editar configuraciones desde cualquier sitio.' },
    shadowsocks: { blurb: 'Es un proxy que hace que mi tráfico parezca HTTPS normal, así puedo llegar a casa desde las redes restringidas de la escuela.' },
    twingate: { blurb: 'Es un conector zero trust que mantengo como otra vía de entrada, junto a Teleport, WireGuard y Unraid Connect.' },
    pihole: { blurb: 'Bloquea anuncios y rastreadores a nivel de DNS para toda la red, aunque ahora lo uso sobre todo para diagnosticar problemas.' },
    immich: {
      blurb: 'Immich sustituye a Google Fotos como mi fototeca, con copias automáticas desde el móvil, búsqueda y álbumes, y es el servicio que más uso.',
      long: [
        'Cada foto y vídeo de mi móvil se copia aquí automáticamente y se queda en mi propio almacenamiento.',
        'Es el servicio más pesado de NewMain. La GTX 1070 ejecuta el aprendizaje automático de la búsqueda y la agrupación de caras, y dimensionarlo me enseñó a repartir CPU, GPU, memoria y almacenamiento para una carga de trabajo real.',
      ],
    },
    lychee: { blurb: 'Lychee es la galería de fotos que hay detrás de la página de fotografía de esta web.' },
    pingvin: { blurb: 'Aquí subo los archivos que son demasiado grandes para las apps de chat y consigo un enlace para enviarlos.' },
    pairdrop: { blurb: 'Envía un archivo entre dos dispositivos cualesquiera desde el navegador, como AirDrop, sin cuentas.' },
    fbq: {
      blurb: 'Me da acceso desde el navegador y enlaces para compartir los mismos archivos que uso por NFS y SMB en casa.',
      long: ['Antes usé Nextcloud, el FileBrowser original, Alist y SFTPGo, y este es el que me quedé.'],
    },
    syncthing: { blurb: 'Mantiene los archivos sincronizados entre mis dispositivos todo el tiempo, con historial de versiones.' },
    fireshare: { blurb: 'Mis amigos y yo subimos y compartimos aquí clips de juegos, sin límites de subida.' },
    neko: { blurb: 'Ejecuta un navegador compartido en una pestaña, así podemos entrar en la misma sala para ver algo o investigar en una sola pantalla.' },
    crafty: { blurb: 'Crafty gestiona mis servidores de Minecraft, y corre en dos sitios para que siempre se pueda arrancar un mundo.' },
    paperless: { blurb: 'Es un archivo de documentos que pasa OCR a cada PDF y escaneo, así puedo buscarlos desde cualquier dispositivo.' },
    vscode: { blurb: 'Ejecuta VS Code en el navegador, así puedo editar archivos de configuración en el servidor.' },
    upstat: { blurb: 'Sigue el tiempo activo y el tiempo de respuesta de cada servicio y contenedor, así me entero yo primero de los problemas.' },
    netdata: { blurb: 'Registra métricas por segundo de CPU, discos, red y contenedores.' },
    upsnap: { blurb: 'Es un panel de Wake-on-LAN, y es como enciendo Adell.' },
    openspeedtest: { blurb: 'Es un test de velocidad autoalojado que mide el rendimiento entre el servidor y donde yo esté.' },
    portainer: { blurb: 'Me da una interfaz web para Docker tanto en el host Unraid como en la VM de CasaOS.' },
    coturn: {
      blurb: 'Monté este servidor TURN y STUN para Project June, para que sus tres cámaras por WebRTC puedan atravesar el NAT de la red móvil.',
      long: [
        'Project June transmite tres cámaras en directo por 5G, pero las redes móviles ponen los dispositivos detrás de capas de NAT que WebRTC no puede atravesar por sí solo.',
        'Mi propio servidor TURN y STUN les da a los vídeos una dirección pública fija donde encontrarse, así puedo conducir el rover desde cualquier sitio, y apenas usa CPU.',
      ],
    },
    mosquitto: { blurb: 'Monté este bróker MQTT primero para la telemetría y el control de Project June, y ahora lleva los mensajes entre mis proyectos escolares con ESP32 y sus paneles.' },
    nginx: { blurb: 'Dos pequeños contenedores nginx sirven mis webs estáticas y las demos de mis proyectos.' },
  },

  access: {
    eyebrow: 'Acceso remoto',
    title: 'Seis accesos',
    lead: 'Tengo seis vías de entrada distintas desde fuera, así que si una se rompe no me quedo fuera.',
    primary: 'Principal',
    methods: {
      tailscale: { type: 'VPN en malla', note: 'Es una malla WireGuard con un solo inicio de sesión en todos mis dispositivos, y es la que uso a diario.' },
      wireguard: { type: 'Túnel', note: 'Es un túnel cifrado simple hacia la red, sin terceros de por medio.' },
      teleport: { type: 'VPN integrada', note: 'La UDM Pro genera esta VPN ella misma, así que no hay cliente que configurar.' },
      twingate: { type: 'Zero trust', note: 'Comprueba el acceso por identidad y mantiene cerrados todos los puertos de entrada.' },
      shadowsocks: { type: 'Proxy', note: 'Hace que mi tráfico parezca HTTPS, así puedo pasar por las Wi-Fi restringidas de la escuela y de la oficina.' },
      unraidConnect: { type: 'Del fabricante', note: 'Me da acceso directo al servidor Unraid desde mi cuenta de Unraid.' },
    },
    home: { type: 'El rack', note: 'Todos los caminos de arriba acaban aquí.' },
  },

  cta: {
    title: 'En qué estoy ahora',
    sub: 'Estoy creando OpenClaw, un ejecutor que deja a los agentes de IA hacer tareas reales en el lab, como arrancar un contenedor, revisar un servicio, desplegar una app pequeña e informar de vuelta, pero todavía no está terminado.',
    projects: 'Ver mis proyectos',
    contact: 'Contactar',
  },
};

export default es;
