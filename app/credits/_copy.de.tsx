import type { CreditsCopy } from './_copy';

const de: CreditsCopy = {
  meta: {
    title: 'Credits | Braven Chiam',
    description:
      'So ist chiambucket.com entstanden: gebaut mit Claude und Next.js, gehostet auf Vercel, mit einer selbst gehosteten Lychee-Galerie für die Fotos.',
    ogDescription: 'Wie diese Seite gebaut und gehostet ist und welche Tools dahinterstecken.',
    twitterDescription: 'Diese Seite ist mit Claude gebaut und auf Vercel gehostet.',
  },
  kicker: 'Credits',
  title: <>Credits &amp; <em>Inhalte</em></>,
  sub: 'Hier erfährst du, wie die Seite gebaut und gehostet ist und welche Tools dahinterstecken.',
  claude: {
    eyebrow: 'Design und Bau',
    title: 'Claude',
    body: <>Ich habe diese Seite mit Claude gestaltet und gebaut, einem KI-Modell von <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude hat beim Layout geholfen, viel vom Code geschrieben, die Texte geschärft und mir beim Debuggen geholfen, während ich entschieden habe, was bleibt, was sich ändert und wie es aussieht.</>,
  },
  hosting: {
    eyebrow: 'Hosting',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> hostet die Seite und deployt bei jedem Push eine neue Version. Vercel Analytics und Speed Insights zählen die Besuche und messen die Ladezeit.</>,
      'Mein Homelab betreibt weiterhin die Fotogalerie und meine anderen selbst gehosteten Dienste, aber die öffentliche Seite läuft auf Vercel, weil sie mit verwaltetem Hosting schneller und zuverlässiger ist.',
    ],
  },
  tools: {
    eyebrow: 'Tools und Inhalte',
    title: 'Software und Schriften',
    list: [
      <><b>Next.js und React</b>, geschrieben in TypeScript</>,
      <><b>Framer Motion</b> für die Homelab-Seite und die Projektdemos</>,
      <><b>Lychee</b>, die Fotogalerie, die ich für die Fotografie-Seite hoste</>,
      <><b>Oswald, Inter und DM Sans</b>, die wichtigsten Schriften</>,
      <><b>Canvas</b> für die gemalten Himmel, Wolken, Gräser und das Meer hinter jeder Seite, einmal gezeichnet und nur per CSS bewegt</>,
      <><b>Inline-SVG</b> für die Icons</>,
    ],
    note: 'Die Fotos, Texte und Projektarbeiten auf dieser Seite sind von mir.',
  },
};
export default de;
