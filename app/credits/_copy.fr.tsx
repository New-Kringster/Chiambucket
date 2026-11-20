import type { CreditsCopy } from './_copy';

const fr: CreditsCopy = {
  meta: {
    title: 'Crédits | Braven Chiam',
    description:
      'Le colophon de chiambucket.com, construit avec Claude et Next.js, hébergé sur Vercel, avec une galerie Lychee auto-hébergée pour les photos.',
    ogDescription: 'Comment ce site est construit et hébergé, et quels outils se cachent derrière.',
    twitterDescription: 'Ce site est construit avec Claude et hébergé sur Vercel.',
  },
  kicker: 'Crédits',
  title: <>Crédits &amp; <em>contenu</em></>,
  sub: 'Cette page explique comment le site est construit et hébergé, et quels outils se cachent derrière.',
  claude: {
    eyebrow: 'Design et code',
    title: 'Claude',
    body: <>J’ai conçu et construit ce site avec Claude, un modèle d’IA d’<a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude m’a aidé pour la mise en page, a écrit une bonne partie du code, a resserré les textes et m’a aidé à déboguer, pendant que je décidais de ce qui restait, de ce qui changeait et de l’allure du site.</>,
  },
  hosting: {
    eyebrow: 'Hébergement',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> héberge le site et déploie une nouvelle version à chaque push. Vercel Analytics et Speed Insights comptent les visites et mesurent la vitesse des pages.</>,
      'Mon homelab fait toujours tourner la galerie photo et mes autres services auto-hébergés, mais le site public tourne sur Vercel, parce qu’un hébergement géré le rend plus rapide et plus fiable.',
    ],
  },
  tools: {
    eyebrow: 'Outils et contenu',
    title: 'Logiciels et polices',
    list: [
      <><b>Next.js et React</b>, écrits en TypeScript</>,
      <><b>Framer Motion</b> pour la page homelab et les démos de projets</>,
      <><b>Lychee</b>, la galerie photo que j’héberge pour la page photographie</>,
      <><b>Oswald, Inter et DM Sans</b>, les polices principales</>,
      <><b>Canvas</b> pour les ciels, les nuages, l’herbe et la mer peints derrière chaque page, dessinés une seule fois et animés uniquement en CSS</>,
      <><b>SVG inline</b> pour les icônes</>,
    ],
    note: 'Les photos, les textes et les projets de ce site sont les miens.',
  },
};

export default fr;
