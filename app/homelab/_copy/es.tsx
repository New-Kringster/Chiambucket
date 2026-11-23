import { draft, type Draft } from './draft';
import type { HomelabCopy } from './en';

/* The homelab page's Spanish words, in the same shape as en.tsx. */
// a loose cast while drafting: keys English no longer has are ignored by draft()
const es = {
  meta: {
    title: 'Homelab | Braven Chiam',
    description:
      'Mi nube casera la llevan agentes de IA en braven-agents, un servidor que controla las demás máquinas, la red UniFi y plataformas externas como Cloudflare. Esta página cuenta cómo se conecta todo, las máquinas, los servicios y su estado en directo.',
  },
  jsonLd: {
    headline: 'Una nube casera llevada por agentes de IA',
    about: ['Autoalojamiento', 'Agentes de IA', 'Automatización de infraestructura', 'Docker', 'Unraid', 'UniFi', 'Cloudflare'],
  },

  details: 'Detalles de {name}',
  close: 'Cerrar',

  hero: {
    title: 'Un HomeLab pensado para agentes',
    lead: 'Todas las máquinas, redes y servicios de aquí los gestiona braven-agents, un servidor cuyo trabajo es ejecutar mis agentes de IA. Pueden llegar a todo lo demás, desde el servidor de almacenamiento hasta el router y Cloudflare, así que la mayoría de los cambios salen de un prompt sin que yo toque nada.',
    mapCta: 'Ver cómo se conecta',
    machinesCta: 'Ver las máquinas',
  },

  core: {
    title: 'Todo pasa por braven-agents',
    lead: 'braven-agents tiene las llaves de todos los demás sistemas, y los agentes que corren en él llegan a cada uno por su propia API o por SSH. Elige un sistema para ver qué hacen ahí.',
    mapLabel: 'Cómo se conecta braven-agents con todos los demás sistemas',
    coreTag: 'El núcleo',
    coreRole: 'Ejecuta Claude Code, Codex y OpenCode, además de Hermes para las tareas programadas, y yo lanzo y sigo su trabajo en T3 Code.',
    groups: { machines: 'Máquinas', edge: 'Red y edge', platforms: 'Plataformas' },
    doesLabel: 'Qué hacen aquí los agentes',
    planned: 'Previsto',
    proxmoxName: 'Servidor Proxmox',
    nodes: {
      newmain: { role: 'Almacenamiento y servicios autoalojados', via: 'Unraid API',
        does: ['Arrancar, actualizar y reiniciar contenedores Docker', 'Vigilar el array y la salud de cada disco', 'Crear recursos compartidos y máquinas virtuales'] },
      caca: { role: 'Entorno de dev de un proyecto sin anunciar', via: 'SSH',
        does: ['Compilar y probar el proyecto', 'Mantener al día sus herramientas y paquetes'] },
      servertop: { role: 'Puente a mi iCloud', via: 'SSH',
        does: ['Leer y añadir eventos en mis calendarios', 'Leer y añadir recordatorios', 'Hacer otras tareas de iCloud que necesitan un Mac'] },
      blade: { role: 'Trabajos de GPU', via: 'SSH',
        does: ['Lanzar entrenamientos en la RTX 3080, como los que entrenaron DrumNet', 'Ejecutar modelos más grandes y otros trabajos pesados de GPU'] },
      proxmox: { role: 'Máquinas virtuales, hardware aún por decidir', via: 'Aún sin arrancar',
        does: ['Todavía se está montando, así que aún no corre nada en él.'] },
      unifi: { role: 'Toda la red de casa', via: 'UniFi API',
        does: ['Crear redes y VLAN', 'Añadir reglas de firewall y redirecciones de puertos', 'Buscar y gestionar los dispositivos conectados'] },
      npm: { role: 'Proxy inverso de los servicios públicos', via: 'NPM API',
        does: ['Añadir un proxy host para cada subdominio nuevo', 'Emitir y renovar certificados SSL', 'Decidir quién puede acceder a un servicio'] },
      cloudflare: { role: 'DNS y servicios edge', via: 'Cloudflare API',
        does: ['Crear y cambiar registros DNS', 'Abrir Cloudflare Tunnels para apps nuevas', 'Desplegar Workers y gestionar el almacenamiento R2'] },
      github: { role: 'Mi código', via: 'GitHub CLI',
        does: ['Crear repositorios, ramas y pull requests', 'Subir los cambios que hacen'] },
      vercel: { role: 'El hosting de esta web', via: 'Vercel API',
        does: ['Desplegar previews y comprobar que los builds pasan', 'Publicar esta web cuando se lo pido'] },
      shebang: { role: 'Mi plataforma de hosting', via: 'Shebang MCP',
        does: ['Publicar páginas y archivos', 'Darle a una app nueva su propia base de datos e inicio de sesión'] },
    },
  },

  prompt: {
    title: 'De un prompt a una app funcionando',
    lead: 'Cuando pido algo nuevo, los agentes pasan solos por cada sistema que toca. Si les pido, por ejemplo, poner online una app nueva con su propia dirección de chiambucket.com, esto es lo que pasa:',
    requestLabel: 'La petición',
    request: 'Pon mi nueva app de notas en línea en notes.chiambucket.com.',
    steps: [
      { at: 'braven-agents', t: 'Un agente escribe la app y su archivo Docker Compose, y luego la prueba.' },
      { at: 'NewMain', t: 'Arranca la app como contenedor en NewMain.' },
      { at: 'Nginx Proxy Manager', t: 'Añade un proxy host para el subdominio nuevo y consigue un certificado SSL para él.' },
      { at: 'Cloudflare', t: 'Crea el registro DNS que apunta el subdominio a casa.' },
      { at: 'UniFi', t: 'Si la app necesita un puerto o una regla de firewall, la añade en el router.' },
      { at: 'braven-agents', t: 'Abre la dirección para comprobar que la app responde y luego me manda el enlace.' },
    ],
    ownTitle: 'Sin pedírselo',
    own: 'Cada día se ejecuta una revisión de salud que arregla sola lo que puede, así que reinicia los contenedores, servicios y máquinas virtuales que se han parado y vuelve a montar los discos que se han caído.',
    waitTitle: 'Lo que aún me espera',
    wait: 'Borrar datos, tocar el array de almacenamiento y reiniciar máquinas todavía necesitan mi aprobación, y las herramientas preguntan antes de hacer algo destructivo.',
  },

  machines: {
    title: 'Las máquinas',
    photoAlt: '{name}',
    lead: 'Hay cinco máquinas funcionando, y una sexta todavía está en planes.',
    status: { running: 'En marcha', planned: 'Previsto' },
    items: {
      agents: {
        name: 'braven-agents', role: 'El núcleo',
        blurb: 'Es la máquina más potente de aquí, y corre Ubuntu directamente sobre el hardware para que los agentes la tengan entera para ellos.',
        specs: [
          { k: 'SO', v: 'Ubuntu' },
          { k: 'CPU', v: 'Ryzen 9 5950X, 16 núcleos' },
          { k: 'Memoria', v: '64 GB DDR4' },
          { k: 'GPU', v: 'GTX 1070 8 GB' },
          { k: 'Discos', v: '2 × 2 TB NVMe' },
        ],
      },
      newmain: {
        name: 'NewMain', role: 'Datos y servicios',
        blurb: 'NewMain guarda mis archivos, fotos y copias de seguridad en cinco discos duros dentro de un array de Unraid protegido por paridad, y ejecuta en Docker los servicios autoalojados que aparecen más abajo en esta página.',
        specs: [
          { k: 'SO', v: 'Unraid' },
          { k: 'CPU', v: '2 × Xeon E5-2470 v2, 20 núcleos' },
          { k: 'Memoria', v: '128 GB DDR3' },
          { k: 'Array', v: '5 discos duros, con paridad' },
          { k: 'Controladora', v: 'PERC H710P en modo IT' },
        ],
      },
      caca: {
        name: 'CaCa', role: 'Entorno de dev',
        blurb: 'CaCa es un ThinkCentre pequeño que hace de entorno de desarrollo para un proyecto del que todavía no puedo hablar.',
        specs: [
          { k: 'CPU', v: 'Core i7-6700T' },
          { k: 'Memoria', v: '32 GB DDR4' },
          { k: 'Discos', v: 'SSD NVMe de 1 TB' },
        ],
      },
      servertop: {
        name: 'Servertop', role: 'Puente a iCloud',
        blurb: 'Servertop es un MacBook Air que se queda con la sesión de mi iCloud iniciada, así que los agentes llegan a través de él a mis calendarios, recordatorios y otras cosas personales.',
        specs: [
          { k: 'Modelo', v: 'MacBook Air, M1' },
          { k: 'Memoria', v: '8 GB' },
          { k: 'Discos', v: 'SSD de 256 GB' },
        ],
      },
      blade: {
        name: 'Razer Blade 15', role: 'Nodo GPU',
        blurb: 'Este portátil corre Ubuntu y se encarga del trabajo pesado de GPU, y es la misma máquina que entrenó DrumNet para el OCR Reader.',
        specs: [
          { k: 'SO', v: 'Ubuntu' },
          { k: 'CPU', v: 'Core i7 de 10.ª generación' },
          { k: 'GPU', v: 'RTX 3080 Laptop GPU' },
          { k: 'Memoria', v: '32 GB' },
          { k: 'Discos', v: '2 × SSD de 1 TB' },
        ],
      },
      proxmox: {
        name: 'Servidor Proxmox', role: 'Virtualización',
        blurb: 'Un servidor Proxmox nuevo todavía se está montando, y su hardware aún está por decidir.',
        specs: [
          { k: 'SO', v: 'Proxmox VE' },
          { k: 'Hardware', v: 'Por decidir' },
        ],
      },
    },
    rack: {
      alt: 'El rack de mi cuarto, con el panel de parcheo y los cables azules arriba y los servidores detrás de una puerta de malla',
      caption: 'braven-agents, NewMain y CaCa comparten este rack en mi cuarto.',
    },
  },

  stack: {
    title: 'Lo que aloja',
    lead: 'NewMain ejecuta estos servicios para mí y mis proyectos, y los públicos muestran un estado en directo que se comprueba cada minuto.',
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
    status: { up: 'En línea', down: 'Caído', wait: 'Comprobando', self: 'Privado' },
    loadLabel: 'Carga: {label}',
    weights: {
      extreme: 'Máxima',
      'very-high': 'Muy alta',
      high: 'Alta',
      moderate: 'Moderada',
      low: 'Ligera',
      diagnostic: 'A demanda',
    },
    facts: { runsOn: 'Corre en', load: 'Carga', access: 'Acceso', category: 'Categoría' },
    access: {
      public: 'Público, a través de Nginx Proxy Manager y CrowdSec',
      private: 'Privado, en la red de Tailscale',
    },
    visit: 'Visitar {host}',
  },

  services: {
    npm: {
      blurb: 'Está delante de cada servicio público como proxy inverso: termina el SSL, envía cada subdominio de chiambucket.com a su contenedor y ejecuta un bouncer de CrowdSec que bloquea las IPs hostiles.',
      long: [
        'Todo el tráfico público llega a una sola dirección y pasa primero por NPM, así que ningún contenedor queda expuesto directamente a internet.',
        'CrowdSec vigila el tráfico en busca de patrones de ataque y bloquea el origen. Como todo pasa por NPM, todos los servicios públicos se caen cuando se cae NPM.',
      ],
    },
    tailscale: { blurb: 'Es una malla WireGuard que pone todos mis dispositivos en una red privada, y la uso para llegar a casa desde cualquier sitio.' },
    shadowsocks: { blurb: 'Es un proxy que hace que mi tráfico parezca HTTPS normal, así puedo llegar a casa desde las redes restringidas de la escuela.' },
    twingate: { blurb: 'Es un conector zero trust que mantengo como otra vía de entrada, junto a Tailscale, WireGuard y UniFi Teleport.' },
    pihole: { blurb: 'Bloquea anuncios y rastreadores a nivel de DNS para toda la red, aunque ahora lo uso sobre todo para diagnosticar problemas.' },
    immich: {
      blurb: 'Immich sustituye a Google Fotos como mi fototeca, con copias automáticas desde el móvil, búsqueda y álbumes, y es el servicio que más uso.',
      long: [
        'Cada foto y vídeo de mi móvil se copia aquí automáticamente y se queda en mi propio almacenamiento.',
        'Es el servicio más pesado de NewMain, y dimensionarlo me enseñó a repartir CPU, memoria y almacenamiento para una carga de trabajo real.',
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
    crafty: { blurb: 'Crafty gestiona mis servidores de Minecraft.' },
    paperless: { blurb: 'Es un archivo de documentos que pasa OCR a cada PDF y escaneo, así puedo buscarlos desde cualquier dispositivo.' },
    vscode: { blurb: 'Ejecuta VS Code en el navegador, así puedo editar archivos de configuración en el servidor.' },
    upstat: { blurb: 'Sigue el tiempo activo y el tiempo de respuesta de cada servicio y contenedor, así los problemas se ven pronto.' },
    netdata: { blurb: 'Registra métricas por segundo de CPU, discos, red y contenedores.' },
    upsnap: { blurb: 'Es un panel de Wake-on-LAN que enciende las máquinas que están dormidas.' },
    openspeedtest: { blurb: 'Es un test de velocidad autoalojado que mide el rendimiento entre el servidor y donde yo esté.' },
    portainer: { blurb: 'Me da una interfaz web para los contenedores Docker de NewMain.' },
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

  tubs: {
    title: 'Shebang Tubs',
    status: 'Inicios, en desarrollo',
    lead: 'Shebang Tubs es un proyecto y un framework que estoy creando para que cualquiera pueda crear y autoalojar sus propias apps con agentes.',
    body: [
      'Cada app es un tub, una carpeta con un archivo Compose sencillo y su propia base de datos, archivos y secretos, así un agente puede crearla, ejecutarla y moverla a otra máquina como un solo zip con sus datos intactos.',
      'Un panel despliega, arranca y para los tubs, y al publicar uno le da una dirección web a través de Cloudflare Tunnel, sin redirección de puertos ni proxy inverso. Los agentes reciben una clave de API, así que pueden hacer todo esto ellos solos.',
    ],
    diagram: {
      label: 'Qué contiene un tub y adónde va',
      tub: 'Un tub',
      parts: ['Archivo Compose', 'Base de datos', 'Archivos', 'Secretos'],
      zip: 'Exportado en un solo zip',
      runs: 'Funciona en cualquier máquina con Docker',
      publish: 'Publicado con Cloudflare Tunnel',
    },
  },

  cta: {
    title: 'Hacia dónde va',
    sub: 'La meta es una nube personal que se cuide sola y pueda crear y ejecutar cualquier cosa desde un solo prompt. La mayoría de las piezas ya están en su sitio, y la siguiente es el servidor Proxmox nuevo.',
    projects: 'Ver mis proyectos',
    contact: 'Contactar',
  },
} as Draft<HomelabCopy>;

export default draft(es);
