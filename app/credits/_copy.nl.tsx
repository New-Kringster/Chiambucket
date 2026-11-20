import type { CreditsCopy } from './_copy';

const nl: CreditsCopy = {
  meta: {
    title: 'Credits | Braven Chiam',
    description:
      'Het colofon van chiambucket.com, dat is gebouwd met Claude en Next.js, gehost wordt op Vercel en een zelfgehoste Lychee-galerij gebruikt voor de foto’s.',
    ogDescription: 'Hoe deze site is gebouwd en gehost, en welke tools erachter zitten.',
    twitterDescription: 'Deze site is gebouwd met Claude en wordt gehost op Vercel.',
  },
  kicker: 'Credits',
  title: <>Credits &amp; <em>content</em></>,
  sub: 'Op deze pagina lees je hoe de site is gebouwd en gehost, en welke tools erachter zitten.',
  claude: {
    eyebrow: 'Ontwerp en bouw',
    title: 'Claude',
    body: <>Ik heb deze site ontworpen en gebouwd met Claude, een AI-model van <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude hielp met de layout, schreef een groot deel van de code, schaafde de teksten bij en hielp me debuggen, terwijl ik besliste wat bleef, wat veranderde en hoe het eruitziet.</>,
  },
  hosting: {
    eyebrow: 'Hosting',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> host de site en zet bij elke push een nieuwe versie live. Vercel Analytics en Speed Insights tellen de bezoeken en meten hoe snel de pagina’s zijn.</>,
      'Mijn homelab draait nog steeds de fotogalerij en mijn andere zelfgehoste diensten, maar de publieke site draait op Vercel, omdat beheerde hosting hem sneller en betrouwbaarder houdt.',
    ],
  },
  tools: {
    eyebrow: 'Tools en content',
    title: 'Software en lettertypes',
    list: [
      <><b>Next.js en React</b>, geschreven in TypeScript</>,
      <><b>Framer Motion</b> voor de homelabpagina en de projectdemo’s</>,
      <><b>Lychee</b>, de fotogalerij die ik host voor de fotografiepagina</>,
      <><b>Oswald, Inter en DM Sans</b>, de belangrijkste lettertypes</>,
      <><b>Canvas</b> voor de geschilderde luchten, wolken, het gras en de zee achter elke pagina, één keer getekend en alleen met CSS bewogen</>,
      <><b>Inline SVG</b> voor de iconen</>,
    ],
    note: 'De foto’s, teksten en projecten op deze site zijn van mijzelf.',
  },
};

export default nl;
