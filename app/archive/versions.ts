/*
  Every design chiambucket.com has had, oldest first (shared by /archive and
  the anniversary card in the homepage hero).

  v1 to v7 each run as their own copy at https://chiambucket-vN.shebang.pro
  (built by ~/apps/chiambucket-archive on the homelab, see its README). v8 is
  the live site. `start` is the day a design went live; the strip on /archive
  makes each band as wide as the time until the next one. v2 to v3 is
  approximate (the hand-built site replaced WordPress in spring 2025).

  Screenshots in public/images/archive: vN-desktop (1440 x 900 at the top of
  the homepage), vN-phone (390 x 844), vN-detail (further down the homepage)
  and vN-thumb, all taken from the archived copies with their pill hidden.
*/
export type Version = {
  n: number;
  name: string;
  when: string;
  start: string;
  built: string;
  body: string;
  /** the design's own colours: its main background and its accent */
  base: string;
  accent: string;
  desktopAlt: string;
  phoneAlt: string;
  detailAlt?: string;
};

export const FIRST_LAUNCH = '2024-09-01';

export const VERSIONS: Version[] = [
  {
    n: 1,
    name: 'The first WordPress site',
    when: 'September to October 2024',
    start: '2024-09-01',
    built: 'WordPress and Elementor',
    body: 'My first chiambucket.com was a WordPress site that I put together with Elementor and ran on my server at home. It opened on a navy page that said “Welcome To Chiambucket!” with a Quick Links button, and further down it had a carousel of my photos, my homelab rack and a strip of contact links.',
    base: '#0d1b2a',
    accent: '#4c7cf3',
    desktopAlt: 'A navy page with “Welcome To Chiambucket!” in white and a blue Quick Links button',
    phoneAlt: 'The same navy welcome page on a phone',
    detailAlt: 'A white section titled “A little bit about myself” above a carousel of landscape photos',
  },
  {
    n: 2,
    name: 'The WordPress revamp',
    when: 'November 2024 to spring 2025',
    start: '2024-11-03',
    built: 'WordPress and Elementor',
    body: 'Two months later I rebuilt the header and the menu and added an About Me page. The headline cycled through a few phrases after “Welcome To My”, and the page below showed a slider that compared one of my photos before and after editing, beside a tall picture of the homelab rack.',
    base: '#16263b',
    accent: '#4c7cf3',
    desktopAlt: 'A navy page with a rounded menu bar and the headline “Welcome To My” above a blue Quick Links button',
    phoneAlt: 'The revamped navy landing page on a phone',
    detailAlt: 'A grey section with a before and after photo slider under “My Photos” and the homelab rack under “My Homelab Journey”',
  },
  {
    n: 3,
    name: 'The hand-built black site',
    when: '2025',
    start: '2025-04-15',
    built: 'HTML, CSS and jQuery',
    body: 'In 2025 I left WordPress and wrote the whole site myself. It was black, with a spotlight falling on a sphere of particles behind the title and Oswald for the headings, and a drawing of me sat beside cards for my core skills. A To BucketCentral button led to a page that gathered all my self-hosted services in one place.',
    base: '#050505',
    accent: '#c9c9c9',
    desktopAlt: 'A black page with “Welcome To Chiambucket!” lit by a spotlight over a sphere of particles',
    phoneAlt: 'The black spotlight welcome page on a phone',
    detailAlt: 'Dark cards reading “Hi I am Braven, I shape designs And stir up Creations!” beside a cartoon of me, above My Core Skills',
  },
  {
    n: 4,
    name: 'The gradient hero',
    when: 'January to June 2026',
    start: '2026-01-19',
    built: 'HTML, CSS and jQuery',
    body: 'In January I redesigned it again, still by hand. The top of the homepage became a lavender and violet gradient that said “Creating with Intention.”, and the sections under it turned into dark cards for my CAD and PCB tools, my design approach and a dusty render of Project June.',
    base: '#464469',
    accent: '#b9b6dc',
    desktopAlt: 'A lavender to violet gradient behind the headline “Creating with Intention.”',
    phoneAlt: 'The gradient hero on a phone',
    detailAlt: 'Dark cards for 3D CAD and PCB design and “A Design first Engineering approach”, above a rover kicking up dust',
  },
  {
    n: 5,
    name: 'The Next.js rebuild',
    when: 'June to July 2026',
    start: '2026-06-06',
    built: 'Next.js, React and Vercel',
    body: 'In June I moved the site to Next.js on Vercel and gave every page its own accent colour. The homepage said “Creating with Meaning.” over a blue glow, and it gained a gallery of all my projects that you could search and filter, where each card opened a short summary.',
    base: '#0b0d16',
    accent: '#2f6fe0',
    desktopAlt: 'A black page with “Creating with Meaning.” over a blue glow and two buttons',
    phoneAlt: 'The Next.js homepage on a phone',
    detailAlt: 'The All projects gallery with filter chips and cards for Project June, LoRA Messenger and LUMEN',
  },
  {
    n: 6,
    name: 'Dark Sensory',
    when: 'July to October 2026',
    start: '2026-07-19',
    built: 'Next.js, WebGL and Vercel',
    body: 'In July the whole site moved onto a slowly moving colour field drawn with WebGL, with the content on frosted panels and small letterspaced labels. Most pages turned a warm amber, and the homepage opened its projects with two flagships, Project June and BeadReader.',
    base: '#171009',
    accent: '#d6995a',
    desktopAlt: 'A dark amber page with “CREATING WITH MEANING.” in tall capitals and a glowing Get in touch button',
    phoneAlt: 'The amber Dark Sensory homepage on a phone',
    detailAlt: 'Frosted dark cards for video, interface design, photography and PowerPoint work, in warm amber light',
  },
  {
    n: 7,
    name: 'Painted scenes',
    when: '30 October to 18 November 2026',
    start: '2026-10-30',
    built: 'Next.js and Vercel',
    body: 'At the end of October I swapped the colour field for painted scenes, so every page sits in a landscape at its own time of day, which most pages, this one included, still do. The homepage put my name in clear glass over a pine tree on a sage morning.',
    base: '#a6b495',
    accent: '#f4f1dc',
    desktopAlt: 'A painted sage morning with a stone pine on the left and “Braven Chiam” in clear glass letters',
    phoneAlt: 'The painted morning homepage on a phone',
    detailAlt: 'A Projects heading on the painted sky above the OCR Meter flagship card',
  },
  {
    n: 8,
    name: 'The scroll story',
    when: 'Since 18 November 2026',
    start: '2026-11-18',
    built: 'Next.js, GSAP and WebGL',
    body: 'The current homepage keeps the painting but tells a story as you scroll. The morning breaks up into grain, and then the OCR Reader, Project June, Pip and BeadReader each get a chapter of their own before my other projects, my homelab and my photos.',
    base: '#1d2b22',
    accent: '#d9b56b',
    desktopAlt: 'The current homepage: the painted morning with “Braven Chiam” in clear glass',
    phoneAlt: 'The current homepage on a phone',
    detailAlt: 'Project June’s chapter on the current homepage, with three live camera feeds beside the heading “Three live feeds from three phones”',
  },
];

export const archiveUrl = (n: number) => `https://chiambucket-v${n}.shebang.pro/`;
export const archiveHost = (n: number) => `chiambucket-v${n}.shebang.pro`;
