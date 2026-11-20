/* The photography page's English words. Every other language fills the same shape. Tool and album
   text is keyed by the ids in PhotographyClient.tsx, which keeps the icons, album ids and URLs. */
const en = {
  meta: {
    title: 'Photography | Braven Chiam',
    description:
      'Photo albums by Braven Chiam from Europe, China, New Zealand and Hong Kong, plus ultrawide 21:9 frames, and the software he edits with.',
    twitterDescription: 'Photo albums by Braven Chiam from Europe, China, New Zealand, Hong Kong and more.',
    ldName: 'Photography by Braven Chiam',
    ldDescription: 'Photo albums by Braven Chiam from Europe, China, New Zealand and Hong Kong, plus ultrawide 21:9 frames.',
  },
  hero: {
    kicker: 'Photography',
    title: <>Photography <em>and design</em></>,
    sub: 'These are my albums from Europe, China, New Zealand and Hong Kong, plus a set of ultrawide 21:9 frames, and they are served from a Lychee gallery I host on my homelab. The programs I edit with come first, and the albums follow.',
    allPhotos: 'All photos',
    youtube: 'Videos on YouTube',
  },
  tools: {
    eyebrow: 'Software',
    title: 'What I edit with',
    /** the card's aria-label and its icon's alt text */
    cardLabel: '{name} details',
    iconAlt: '{name} icon',
    items: {
      premiere: {
        name: 'Premiere Pro',
        maker: 'Adobe',
        desc: 'I learned video editing on Premiere Pro, but it crashed too often, so I moved to DaVinci Resolve.',
        add: 'I learned it alongside Photoshop and no longer use it.',
        chips: ['Video editing', 'Timelines', 'Where I started'],
      },
      illustrator: {
        name: 'Illustrator',
        maker: 'Adobe',
        desc: 'I use Illustrator for logos and anything that has to scale cleanly as an SVG, though less often than Photoshop.',
        add: 'I also draw icons and other vector artwork in it.',
        chips: ['Logos', 'Vector / SVG', 'Icons'],
      },
      figma: {
        name: 'Figma',
        maker: 'Figma',
        desc: 'I use Figma for designs built from shapes rather than photos, so most of my interfaces and posters start there as frames.',
        add: 'I prototype interfaces and lay out posters here before building them in code or sending them to print.',
        chips: ['UI design', 'Prototyping', 'Layout'],
      },
      photoshop: {
        name: 'Photoshop',
        maker: 'Adobe',
        desc: 'My main tool since 2019. I had formal training through my school media club, and I use it for retouching photos and laying out posters.',
        add: 'Besides retouching and posters, I also use it for compositing.',
        chips: ['Photo editing', 'Posters', 'Compositing'],
      },
      resolve: {
        name: 'DaVinci Resolve',
        maker: 'Blackmagic Design',
        desc: 'I edit my videos in Resolve because cutting, colour and export all happen in one program. I rarely post them, but more are planned.',
        add: 'It replaced Premiere Pro for me, which kept crashing.',
        chips: ['Video editing', 'Colour grading', 'Project films'],
      },
      lightroom: {
        name: 'Lightroom',
        maker: 'Adobe',
        desc: 'Most of my photos are finished in Lightroom, where I recover highlights, shadows and detail from RAW files that would otherwise be unusable.',
        add: 'It is usually the last program a photo in the albums below goes through.',
        chips: ['Photo editing', 'Colour', 'RAW workflow'],
      },
    },
  },
  figma: {
    label: 'Figma board',
    open: 'Open in Figma',
    openLabel: 'Open the board in Figma',
    frameTitle: 'Figma board: Random board',
    caption: 'A working Figma file where I lay out interfaces and posters before building or printing them.',
  },
  galleries: {
    eyebrow: 'Galleries',
    title: 'Albums',
    open: 'Open album',
    /** the open link's aria-label */
    openLabel: 'Open {title} gallery',
    showAll: 'Show all photos',
    albums: {
      highlight: 'Highlights',
      europe: 'Europe',
      '21by9': '21:9',
      china: 'China',
      zealand: 'New Zealand',
      hongkong: 'Hong Kong',
      general: 'General',
    },
  },
};
export type PhotographyCopy = typeof en;
export default en;
