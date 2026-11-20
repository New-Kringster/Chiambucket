import type { CreditsCopy } from './_copy';

const es: CreditsCopy = {
  meta: {
    title: 'Créditos | Braven Chiam',
    description:
      'Los créditos de chiambucket.com, que está hecha con Claude y Next.js, alojada en Vercel, y usa una galería Lychee autoalojada para las fotos.',
    ogDescription: 'Cómo está hecha y alojada esta web, y qué herramientas hay detrás.',
    twitterDescription: 'Esta web está hecha con Claude y alojada en Vercel.',
  },
  kicker: 'Créditos',
  title: <>Créditos y <em>contenido</em></>,
  sub: 'Esta página cuenta cómo está hecha y alojada la web, y qué herramientas hay detrás.',
  claude: {
    eyebrow: 'Diseño y desarrollo',
    title: 'Claude',
    body: <>Diseñé y construí esta web con Claude, un modelo de IA de <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude me ayudó con la maquetación, escribió buena parte del código, pulió los textos y me ayudó a depurar, mientras que yo decidía qué se quedaba, qué cambiaba y qué aspecto tiene.</>,
  },
  hosting: {
    eyebrow: 'Alojamiento',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> aloja la web y despliega una nueva versión con cada push. Vercel Analytics y Speed Insights cuentan las visitas y miden la velocidad de las páginas.</>,
      'Mi homelab sigue ejecutando la galería de fotos y mis otros servicios autoalojados, pero la web pública corre en Vercel porque un alojamiento gestionado la hace más rápida y fiable.',
    ],
  },
  tools: {
    eyebrow: 'Herramientas y contenido',
    title: 'Software y tipografías',
    list: [
      <><b>Next.js y React</b>, escrito en TypeScript</>,
      <><b>Framer Motion</b> para la página del homelab y las demos de los proyectos</>,
      <><b>Lychee</b>, la galería de fotos que alojo para la página de fotografía</>,
      <><b>Oswald, Inter y DM Sans</b>, las tipografías principales</>,
      <><b>Canvas</b> para los cielos, nubes, hierba y mar pintados detrás de cada página, dibujados una sola vez y movidos solo con CSS</>,
      <><b>SVG en línea</b> para los iconos</>,
    ],
    note: 'Las fotografías, los textos y los proyectos de esta web son míos.',
  },
};
export default es;
