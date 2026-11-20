/* The /ai-use page's words in English. Each level's words are keyed by its id (l1 to l4);
   its colour and mark files stay in ../AiUse.tsx. */
type LevelCopy = {
  /** the level's label, as printed on its mark */
  code: string;
  short: string;
  name: string;
  alt: string;
  body: string[];
  uses: string[];
};

const en = {
  meta: {
    title: 'Scale of AI use | Braven Chiam',
    description:
      'How I use AI in my projects, and the four-level scale (L1 to L4) I use to label how much of each project was made with AI tools.',
  },
  ldHeadline: 'Scale of AI use',

  title: 'Scale of AI use',
  sub: 'This scale is used to transparently communicate the impact of AI tools on my projects.',
  scaleLabel: 'The four levels',
  humanEnd: 'Human decides',
  agentEnd: 'Agents decide',

  stance: {
    title: 'Why I use AI, and why I say so',
    body: [
      'In my opinion, AI is a revolutionary technology that allows unprecedented, rapid development in many fields. Instead of gating and limiting its use as most institutions do, I let myself explore these tools to their full potential and push the limits of what they can do. In that way, I continuously learn about this ever-changing, rapidly improving technology, which significantly speeds up my work and raises its quality.',
      'However, I am very much against the use of AI tools to make low-quality, low-effort work, especially art. I use AI tools in my design work, but I heavily tweak the design styles myself till they are of a level I can proudly display.',
      'As such, I built this scale to make it easy to see how much AI was involved in a given project. If you find it useful, please feel free to adopt it for your work too!',
    ],
  },

  levelsTitle: 'The four levels',
  levelsIntro: 'Each level includes everything in the levels before it.',
  usesLabel: 'Typical {code} uses',
  levels: {
    l1: {
      code: 'L1',
      short: 'Little use',
      name: 'Little to insignificant use of AI',
      alt: 'L1 mark: little use of AI based tools',
      body: [
        'I used AI tools in the project, but they had little to no impact on the outcome.',
      ],
      uses: ['Paraphrasing', 'Ideas', 'Feasibility checks', 'Small, minor pieces of work', 'Generating charts', 'Checking my work'],
    },
    l2: {
      code: 'L2',
      short: 'Average use',
      name: 'Moderate use of AI',
      alt: 'L2 mark: average use of AI based tools',
      body: [
        'Everything in Level 1, plus AI tools were used to create or generate core parts of the project.',
      ],
      uses: ['Writing code', 'Assets the project depends on, like textures for a 3D object', 'Configuring devices'],
    },
    l3: {
      code: 'L3',
      short: 'Heavy use',
      name: 'Heavy use of AI',
      alt: 'L3 mark: heavy use of AI based tools',
      body: [
        'Level 3 takes this one step further. AI tools ran in automation loops and made crucial, impactful decisions for the project on their own, without asking a human first. The code is almost entirely written by AI, with little to no human involvement.',
        'Humans take a higher-level role: they orchestrate and manage the work the AI agents produce. Humans are still in the loop and make the key decisions.',
      ],
      uses: ['Agents in automation loops', 'Almost all code written by AI', 'Humans orchestrate and review'],
    },
    l4: {
      code: 'L4',
      short: 'Entirely AI',
      name: 'Entirely AI generated',
      alt: 'L4 mark: entirely created by AI tools',
      body: [
        'At Level 4 the orchestration role passes to an agent. Humans are no longer in the loop, and agents make every decision on their own.',
        'A human sets the goals and leaves the agents running in a loop. Human intervention is rare and happens only when needed. The results reach the human to use or study only after the work is complete.',
      ],
      uses: ['A human sets the goal', 'Agents orchestrate other agents', 'Results reviewed after completion'],
    },
  } satisfies Record<string, LevelCopy>,

  compareTitle: 'The levels side by side',
  compareIntro: 'Each row asks the same question of all four levels.',
  compareCaption: 'Comparison of the four levels of AI use',
  /* One question per row, answered for L1 to L4 in order. ­ is a soft hyphen: Chrome won't
     auto-hyphenate capitalised words in the narrow phone columns. */
  rows: [
    {
      q: 'How much AI',
      a: ['Little to insignificant', 'Moderate', 'Heavy', 'Entirely AI generated'],
    },
    {
      q: 'What AI works on',
      a: ['Small supporting tasks', 'Core parts of the project', 'Almost all of the work, in automation loops', 'All of the work'],
    },
    {
      q: 'Who does the core work',
      a: ['Me', 'Me, with AI generating core parts', 'AI agents', 'AI agents'],
    },
    {
      q: 'Who makes the key decisions',
      a: ['Me', 'Me', 'Me, while AI makes some crucial calls on its own', 'Agents, working toward goals I set'],
    },
    {
      q: 'AI acts without asking',
      a: ['No', 'No', 'Yes', 'Yes'],
    },
    {
      q: 'Human in the loop',
      a: ['Yes, throughout', 'Yes, throughout', 'Yes, for the key decisions', 'No, only at the start and the end'],
    },
    {
      q: 'My role',
      a: ['Maker', 'Maker, using AI as a tool', 'Orches­trator and manager', 'Sets the goal, steps in rarely, studies the results'],
    },
    {
      q: 'Example uses',
      a: [
        'Para­phrasing, feasibility checks, charts, checking my work',
        'Writing code, 3D textures, configuring devices',
        'Agent loops that write almost all of the code',
        'Agents running on their own toward a set goal',
      ],
    },
  ] as { q: string; a: [string, string, string, string] }[],

  downloadTitle: 'Download the marks',
  downloadIntro:
    'Each level comes as a label, a smaller icon, and vertical and horizontal versions with a QR code that links back to this page, all as SVG files you can use to mark your own projects.',
  /** each kind of mark: its button label, and its name inside markAlt and downloadLabel */
  marks: {
    label: { label: 'Label', name: 'label' },
    icon: { label: 'Icon', name: 'icon' },
    'vertical-qr': { label: 'Vertical QR', name: 'vertical QR code' },
    'horizontal-qr': { label: 'Horizontal QR', name: 'horizontal QR code' },
  },
  markAlt: '{code} {name} mark',
  downloadLabel: 'Download the {code} {name} mark as SVG',
};

export type AiUseCopy = typeof en;
export default en;
