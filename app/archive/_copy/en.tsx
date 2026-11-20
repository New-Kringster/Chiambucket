/* The /archive page's words in English. Each version's prose is keyed by its number
   (the dates, colours and screenshots stay in ../versions.ts). */
type VersionCopy = {
  name: string;
  when: string;
  built: string;
  body: string;
  desktopAlt: string;
  phoneAlt: string;
  detailAlt: string;
};

const en = {
  meta: {
    title: 'Two years of chiambucket.com | Braven Chiam',
    description:
      'Every design chiambucket.com has had since September 2024, from a WordPress site to the painted scroll story, with screenshots and a working copy of each old version.',
    ogTitle: 'Two years of chiambucket.com',
    ogDescription: 'Eight designs since September 2024, and a working copy of every old one.',
  },
  /** JSON-LD: the page's name and each version's list entry */
  ldName: 'Two years of chiambucket.com',
  ldItem: 'v{n}: {name} ({when})',

  title: 'Two years of chiambucket.com',
  lede:
    'It started off as a WordPress page where I shared links to some of my self-hosted services, but it has since turned into my personal blog and portfolio. Three migrations and eight redesigns later, this is the biggest redesign of my website to date. With the help of Claude, I have archived every major design overhaul on this page, and you can visit any of them to see what chiambucket.com looked like in the past.',
  stripLabel: 'The eight versions, each as wide as the time it was live',
  segLabel: 'v{n}, {name}, {when}',
  today: 'Today',

  /** read before each version's name by screen readers */
  srName: 'v{n}: ',
  builtWith: 'Built with {built}',
  backHome: 'Back to the homepage',
  open: 'Open v{n}',

  fact: {
    kicker: 'Fun fact',
    title: 'Why chiambucket.com?',
    text:
      'Chiambucket started as a nickname that one of my close friends gave me. When I was looking for a domain name for my new landing page, chiambucket.com just happened to be the cheapest one available, so I took it and have kept it ever since.',
    extra: <><b>Extra fun fact:</b> I also own <a href="https://bravenchiam.com" target="_blank" rel="noopener">bravenchiam.com</a>, and it redirects to this site!</>,
  },

  versions: {
    1: {
      name: 'The first WordPress site',
      when: 'September to October 2024',
      built: 'WordPress and Elementor',
      body: 'My first chiambucket.com was a WordPress site that I put together with Elementor and ran on my server at home. It was built around its Quick Links button, because it was the page I sent my friends to whenever they asked me for the links to my self-hosted services. Further down it had a carousel of my photos, my homelab rack and a strip of contact links.',
      desktopAlt: 'A navy page with “Welcome To Chiambucket!” in white and a blue Quick Links button',
      phoneAlt: 'The same navy welcome page on a phone',
      detailAlt: 'A white section titled “A little bit about myself” above a carousel of landscape photos',
    },
    2: {
      name: 'The WordPress revamp',
      when: 'November 2024 to spring 2025',
      built: 'WordPress and Elementor',
      body: 'Two months later I rebuilt the header and the menu and added an About Me page. The headline cycled through a few phrases after “Welcome To My”, and the page below showed a slider that compared one of my photos before and after editing, beside a tall picture of the homelab rack.',
      desktopAlt: 'A navy page with a rounded menu bar and the headline “Welcome To My” above a blue Quick Links button',
      phoneAlt: 'The revamped navy landing page on a phone',
      detailAlt: 'A grey section with a before and after photo slider under “My Photos” and the homelab rack under “My Homelab Journey”',
    },
    3: {
      name: 'The hand-built black site',
      when: '2025',
      built: 'HTML, CSS and jQuery',
      body: 'In 2025 I left WordPress and wrote the whole site myself. It was black, with Oswald for the headings and a spotlight falling on a sphere of particles behind the title, a Spline 3D scene that looked great but made the whole site lag. Beside my core skills sat a drawing of Sukuna from Jujutsu Kaisen, a character I was very fond of. The To BucketCentral button was meant to lead to a page that gathered all my self-hosted services in one place, but I dropped that page before I built it.',
      desktopAlt: 'A black page with “Welcome To Chiambucket!” lit by a spotlight over a sphere of particles',
      phoneAlt: 'The black spotlight welcome page on a phone',
      detailAlt: 'Dark cards reading “Hi I am Braven, I shape designs And stir up Creations!” beside a drawing of Sukuna from Jujutsu Kaisen, above My Core Skills',
    },
    4: {
      name: 'The gradient hero',
      when: 'January to June 2026',
      built: 'HTML, CSS and jQuery',
      body: 'In January I redesigned it again, still by hand, mainly to get rid of the lag and to try out bento grids, which I really liked. The top of the homepage became a lavender and violet gradient that said “Creating with Intention.”, and the sections under it became a grid of dark cards for my CAD and PCB tools, my design approach and a dusty render of Project June.',
      desktopAlt: 'A lavender to violet gradient behind the headline “Creating with Intention.”',
      phoneAlt: 'The gradient hero on a phone',
      detailAlt: 'Dark cards for 3D CAD and PCB design and “A Design first Engineering approach”, above a rover kicking up dust',
    },
    5: {
      name: 'The Next.js rebuild',
      when: 'June to July 2026',
      built: 'Next.js, React and Vercel',
      body: 'In June I used Claude to design the site for the first time, rebuilt it in Next.js and moved it to Vercel for better speed and uptime. Every page got its own accent colour, the homepage said “Creating with Meaning.” over a blue glow, and a new gallery of all my projects let you search and filter them, where each card opened a short summary.',
      desktopAlt: 'A black page with “Creating with Meaning.” over a blue glow and two buttons',
      phoneAlt: 'The Next.js homepage on a phone',
      detailAlt: 'The All projects gallery with filter chips and cards for Project June, LoRA Messenger and LUMEN',
    },
    6: {
      name: 'Dark Sensory',
      when: 'July to October 2026',
      built: 'Next.js, WebGL and Vercel',
      body: 'In July I made a smaller change and kept the layout as it was, changing only the colour theme. The blue and purple hues had started to look like every AI-made site, so most pages turned a warm amber for a more premium feel.',
      desktopAlt: 'A dark amber page with “CREATING WITH MEANING.” in tall capitals and a glowing Get in touch button',
      phoneAlt: 'The amber Dark Sensory homepage on a phone',
      detailAlt: 'Frosted dark cards for video, interface design, photography and PowerPoint work, in warm amber light',
    },
    7: {
      name: 'Nature themed',
      when: '30 October to 18 November 2026',
      built: 'Next.js and Vercel',
      body: 'At the end of October I gave the site a nature theme. It was a bigger change than the one before but still an incremental one, because the content and layout stayed the same while every page moved into a painted landscape at its own time of day and the site gained its compact menu bar.',
      desktopAlt: 'A painted sage morning with a stone pine on the left and “Braven Chiam” in clear glass letters',
      phoneAlt: 'The painted morning homepage on a phone',
      detailAlt: 'A Projects heading on the painted sky above the OCR Meter flagship card',
    },
    8: {
      name: 'Nature redesign',
      when: 'Since 18 November 2026',
      built: 'Next.js, GSAP and WebGL',
      body: 'This is the full revamp I have been working on, the first since v5 to change more than the look, with new animations and new designs throughout. The homepage keeps the painting but tells a story as you scroll: the morning breaks up into grain, and then the OCR Reader, Project June, Pip and BeadReader each get a chapter of their own before my other projects, my homelab and my photos.',
      desktopAlt: 'The current homepage: the painted morning with “Braven Chiam” in clear glass',
      phoneAlt: 'The current homepage on a phone',
      detailAlt: 'Project June’s chapter on the current homepage, with three live camera feeds beside the heading “Three live feeds from three phones”',
    },
  } satisfies Record<number, VersionCopy>,
};

export type ArchiveCopy = typeof en;
export default en;
