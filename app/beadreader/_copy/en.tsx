/* The BeadReader article's words in English. Other languages fill the same shape (./<lang>.tsx).
   The code keeps the images, ids, URLs and the demo readers' names. */
const en = {
  meta: {
    title: 'BeadReader | Braven Chiam',
    description: 'A private, invite-only book reader I built with Next.js, Supabase and Cloudflare R2, with access-code login, per-reader resume and themes, live presence, a content gate enforced in SQL, webtoons and shared reading stats.',
    ogDescription: 'A private, invite-only book reader with live presence, per-reader resume, a content gate enforced in SQL, webtoons and shared reading stats.',
  },
  ld: {
    headline: 'BeadReader',
    description: 'A private, invite-only online book reader built with Next.js, Supabase and Cloudflare R2, with access-code login through an HMAC-signed cookie, per-reader resume and themes, live presence, an explicit-content gate enforced in SQL, webtoons and a shared reading-stats dashboard.',
  },
  hero: {
    alt: 'BeadReader on three phones: the login screen, a chapter and the stats page',
    back: 'Back to projects',
    tag: 'Personal project',
    title: <>Bead<em>Reader</em></>,
    lead: 'BeadReader is a private online book reader for a few friends, where the admin publishes books in Markdown or as image webtoons and readers log in with one access code. The app remembers where each reader stopped, and readers can see who else is reading, send a wave or a short note, and compare progress on a shared stats dashboard.',
    builtWith: 'Built with',
    /** the key links */
    links: { github: 'GitHub', deploy: 'Deploy your own' },
  },
  chapters: 'Chapters',
  /** the chapter rail, by section id */
  rail: {
    room: 'Private access', library: 'Resume and themes', together: 'Reading together', gate: 'The spicy gate',
    books: 'Text and webtoons', stats: 'Reading stats', instant: 'Offline and updates', stack: 'The stack',
  },
  room: {
    h: 'Private access',
    p: [
      'BeadReader is a private library for one admin and a few readers, and it has no passwords and no sign-up. Instead, a single access code is your identity, which decides whether you are the admin or a reader and whether you can see explicit chapters, and once you enter it, a signed cookie keeps you logged in.',
      'The admin creates each reader and hands them a code, and if the admin revokes that code, the reader is logged out on their next request.',
    ],
    alt: 'The BeadReader login screen with one access code field',
    caption: 'The login screen with its one access code field',
  },
  library: {
    h: 'Resume and themes',
    p: [
      'Opening a book jumps back to the chapter and scroll position you last reached. The position is stored as a fraction of the chapter rather than a pixel offset, so it still holds after a font size change, and if you stop mid-paragraph on your phone, you land in the same place on a laptop.',
      'BeadReader saves each reader\'s own background and text colour, font size and choice of a scrolling or paginated layout. The contents page marks each chapter you have opened, shows a progress bar on the one in progress and lets you mark a chapter as unread.',
    ],
    /** the two pictures: alt text and caption */
    figs: [
      { alt: 'The reading view in the paper theme', caption: 'The reading view in the paper theme' },
      { alt: 'A book\'s contents with per-reader progress', caption: 'The contents page with read tracking and a progress bar' },
    ],
  },
  together: {
    h: 'Reading together',
    p: [
      'From the library you can see who else is online, and inside a book the avatars of online readers sit at the top, each with a green dot. If a friend is in the same book, their avatar also gets a green ring and their chapter number.',
      'Tapping the avatars lets you send a wave or a short note, which shows on the other reader\'s screen for a few seconds and is never saved. Everyone can upload a profile photo, which is cropped and compressed in the browser, and anyone can turn on a privacy toggle to read invisibly.',
    ],
    alt: 'The menu for sending a wave or a note',
    caption: 'The menu for sending a wave or a short note',
  },
  gate: {
    h: 'The spicy gate',
    p: [
      'Some chapters, or passages inside a chapter, are marked explicit, and access to them is set for each reader and enforced in the database query. A reader without access never receives the gated text, not even hidden in the response, so it cannot be pulled from the raw API.',
      'The same chapter looks different depending on the reader: with access you get a blurred passage that clears when you tap it, without access you see a locked preview with a note to request it, and in cal mode every explicit passage is removed, with no markers and no pepper icon.',
    ],
    alt: 'A contents list with an explicit chapter marked',
    caption: 'A contents list with an explicit chapter marked, as a reader with access sees it',
  },
  books: {
    h: 'Text and webtoons',
    p: [
      'Each book is either text or a webtoon, which the admin chooses when creating it. Text books are written in Markdown with a side-by-side preview, and each chapter has its own draft and published state.',
      'For a webtoon, the admin picks a numbered folder of images, previews their order and uploads them straight from the browser to Cloudflare R2 with short-lived signed URLs. Readers then scroll through one gapless vertical strip, with the same resume, tracking and gating as a text book.',
    ],
    figs: [
      { alt: 'The admin books list', caption: 'The admin books list with text and webtoon books, both draft and published' },
      { alt: 'A webtoon chapter as a gapless vertical strip', caption: 'A webtoon chapter as one vertical strip' },
    ],
  },
  stats: {
    h: 'Reading stats',
    p: [
      'Readers who share their activity appear on a common dashboard that shows their total hours, books finished and reading streaks. A histogram shows what time of day people read, day by day, and tapping a reader opens a per-book, per-chapter breakdown of their time.',
      'Reading time only counts while you are actually reading, so it pauses when the tab loses focus or you go idle.',
    ],
    figs: [
      { alt: 'The reading-stats overview', caption: 'The stats overview with reading streaks' },
      { alt: 'A per-reader stats breakdown', caption: 'One reader\'s time broken down by book and chapter' },
    ],
  },
  instant: {
    h: 'Offline and updates',
    p: [
      'A service worker caches covers, artwork and static files on the device, never HTML or API responses, and the reader preloads the next chapter, so pages open fast and use less data. The Account page shows what is cached and how much space it uses, with one button to clear it.',
      'A public changelog and a what\'s-new popup, shown once for each version, explain new features, and a prompt to refresh appears whenever a newer build is deployed.',
    ],
    figs: [
      { alt: 'The account and storage panel', caption: 'The account page and on-device storage, with a clear-all button' },
      { alt: 'The in-app changelog', caption: 'The in-app changelog' },
    ],
  },
  stack: {
    h: 'The stack',
    p: [
      'BeadReader is a Next.js App Router app with Tailwind CSS v4, Supabase for Postgres and storage, and Cloudflare R2 for webtoon images, while the login uses my own short HMAC-signed cookie instead of Supabase Auth.',
      'Because the login is custom, all database access runs on the server with the Supabase service role, and every table has row-level security turned on with no policies, so the public key can read nothing. The explicit-content gate lives in the SQL query, and the one-click Vercel deploy sets up Supabase through the integration and runs the migrations during the build.',
    ],
  },

  /** the presence widget (ReadingTogether); {name} is a demo reader's name */
  presence: {
    eyebrow: 'Online now',
    /** the four steps of the demo, in order */
    captions: [
      'Mara is on chapter 12 of the book you are reading, so her avatar has the green ring.',
      'Tap a reader to send a wave, which shows on their screen and then fades.',
      'You can also send a short note, which is gone in a few seconds and never saved.',
      'Sam opens the same book and gets a green ring too.',
    ],
    /** the note in step 3, and the one a visitor sends */
    note: 'loved that twist!',
    sentNote: 'reading this now!',
    /** what each reader is doing: Mara, Jae, then Sam before and after he opens the book */
    status: {
      mara: 'This book, chapter 12',
      jae: 'The Hobbit, chapter 3',
      samLibrary: 'Browsing the library',
      samBook: 'This book, chapter 1',
    },
    here: 'reading here',
    wave: 'Wave at {name}',
    sendNote: 'Send {name} a note',
    stepsAria: 'Demo steps',
    /** a step dot's aria-label */
    step: 'Step {n} of {total}',
    legend: 'A green ring marks a reader in your book',
  },

  /** the content-gate widget (SpicyGate) and its sample passage */
  spicyGate: {
    chapter: 'Chapter 9',
    passage: {
      lead: 'They had circled each other all evening. When the last guest finally left, the room went quiet.',
      spicy: 'What happened next stayed between them and the low light of the fire.',
      trail: 'Morning came far too soon.',
    },
    /** the three reader modes */
    modes: {
      full: { label: 'Full access', caption: 'This reader has access, so a tap clears the blurred line.' },
      none: { label: 'No access', caption: 'The server never sends this reader the locked passage.' },
      cal: { label: 'Cal mode', caption: 'The line is removed entirely, with no gap and no marker.' },
    },
    revealAria: 'Tap to reveal the spicy passage',
    revealedAria: 'Spicy passage revealed',
    reveal: 'Tap to reveal',
    locked: 'Spicy passage. Ask the admin for access.',
    tabsAria: 'Reader mode',
    footnote: 'The gate is enforced in the SQL query, so gated text never leaves the server.',
  },
};

export type BeadreaderCopy = typeof en;
export default en;
