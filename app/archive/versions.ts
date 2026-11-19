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
    body: 'My first chiambucket.com was a WordPress site that I put together with Elementor and ran on my server at home. It was built around its Quick Links button, because it was the page I sent my friends to whenever they asked me for the links to my self-hosted services. Further down it had a carousel of my photos, my homelab rack and a strip of contact links.',
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
    body: 'In 2025 I left WordPress and wrote the whole site myself. It was black, with Oswald for the headings and a spotlight falling on a sphere of particles behind the title, a Spline 3D scene that looked great but made the whole site lag. Beside my core skills sat a drawing of Sukuna from Jujutsu Kaisen, a character I was very fond of. The To BucketCentral button was meant to lead to a page that gathered all my self-hosted services in one place, but I dropped that page before I built it.',
    base: '#050505',
    accent: '#c9c9c9',
    desktopAlt: 'A black page with “Welcome To Chiambucket!” lit by a spotlight over a sphere of particles',
    phoneAlt: 'The black spotlight welcome page on a phone',
    detailAlt: 'Dark cards reading “Hi I am Braven, I shape designs And stir up Creations!” beside a drawing of Sukuna from Jujutsu Kaisen, above My Core Skills',
  },
  {
    n: 4,
    name: 'The gradient hero',
    when: 'January to June 2026',
    start: '2026-01-19',
    built: 'HTML, CSS and jQuery',
    body: 'In January I redesigned it again, still by hand, mainly to get rid of the lag and to try out bento grids, which I really liked. The top of the homepage became a lavender and violet gradient that said “Creating with Intention.”, and the sections under it became a grid of dark cards for my CAD and PCB tools, my design approach and a dusty render of Project June.',
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
    body: 'In June I used Claude to design the site for the first time, rebuilt it in Next.js and moved it to Vercel for better speed and uptime. Every page got its own accent colour, the homepage said “Creating with Meaning.” over a blue glow, and a new gallery of all my projects let you search and filter them, where each card opened a short summary.',
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
    body: 'In July I made a smaller change and kept the layout as it was, changing only the colour theme. The blue and purple hues had started to look like every AI-made site, so most pages turned a warm amber for a more premium feel.',
    base: '#171009',
    accent: '#d6995a',
    desktopAlt: 'A dark amber page with “CREATING WITH MEANING.” in tall capitals and a glowing Get in touch button',
    phoneAlt: 'The amber Dark Sensory homepage on a phone',
    detailAlt: 'Frosted dark cards for video, interface design, photography and PowerPoint work, in warm amber light',
  },
  {
    n: 7,
    name: 'Nature themed',
    when: '30 October to 18 November 2026',
    start: '2026-10-30',
    built: 'Next.js and Vercel',
    body: 'At the end of October I gave the site a nature theme. It was a bigger change than the one before but still an incremental one, because the content and layout stayed the same while every page moved into a painted landscape at its own time of day and the site gained its compact menu bar.',
    base: '#a6b495',
    accent: '#f4f1dc',
    desktopAlt: 'A painted sage morning with a stone pine on the left and “Braven Chiam” in clear glass letters',
    phoneAlt: 'The painted morning homepage on a phone',
    detailAlt: 'A Projects heading on the painted sky above the OCR Meter flagship card',
  },
  {
    n: 8,
    name: 'Nature redesign',
    when: 'Since 18 November 2026',
    start: '2026-11-18',
    built: 'Next.js, GSAP and WebGL',
    body: 'This is the full revamp I have been working on, the first since v5 to change more than the look, with new animations and new designs throughout. The homepage keeps the painting but tells a story as you scroll: the morning breaks up into grain, and then the OCR Reader, Project June, Pip and BeadReader each get a chapter of their own before my other projects, my homelab and my photos.',
    base: '#1d2b22',
    accent: '#d9b56b',
    desktopAlt: 'The current homepage: the painted morning with “Braven Chiam” in clear glass',
    phoneAlt: 'The current homepage on a phone',
    detailAlt: 'Project June’s chapter on the current homepage, with three live camera feeds beside the heading “Three live feeds from three phones”',
  },
];

export const archiveUrl = (n: number) => `https://chiambucket-v${n}.shebang.pro/`;
export const archiveHost = (n: number) => `chiambucket-v${n}.shebang.pro`;
