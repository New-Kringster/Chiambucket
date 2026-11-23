import type { PipCopy } from './en';

const zh: PipCopy = {
  meta: {
    title: 'Pip，一个用智能体当大脑的桌面宠物 | Braven Chiam',
    ogTitle: 'Pip，一个用智能体当大脑的桌面宠物',
    description: 'Pip 是一个跑在 M5Stack Tab5 上的桌面宠物，它的大脑是我服务器上的 DeepSeek Harness。它会睡觉、醒来、思考、蹦跳，用自己的光标操作浏览器，自己做应用，还会指挥我其他的智能体会话。',
  },
  ld: {
    headline: 'Pip：一个跑在 M5Stack Tab5 上、用 DeepSeek Harness 当大脑的桌面宠物',
    about: ['M5Stack Tab5', 'ESP32-P4', 'DeepSeek Harness', 'AI 智能体', '桌面宠物'],
  },
  chapters: { meet: '认识 Pip', canvas: '屏幕', applets: '小应用', desktops: '桌面', crew: '帮手们', inside: '工作原理' },
  ui: {
    chapters: '章节',
    heroStage: 'M5Stack Tab5 上的 Pip，然后是认识 Pip',
    moods: 'Pip 的情绪',
    nextStep: '下一步',
    steps: '步骤',
    deck: '我的八个 Pip',
    carousel: '轮播',
    prevPip: '上一个 Pip',
    nextPip: '下一个 Pip',
  },
  hero: {
    title: 'Pip',
    lead: 'Pip 是一个靠 DeepSeek Harness（DSH）运行的桌面宠物。它能上网浏览，能自己做应用、自己测试，能通过 MCP 连接器控制其他智能体，还有很多别的本事。Pip 的界面跑在一台 M5Stack Tab5 上。',
    meet: '认识 Pip',
    m5: '在 M5Stack 阅读',
    m5Off: '还没发布',
    meta: 'M5Stack 实习项目，2026年11月。ESP32-P4、C++、Lua、Node、Python、Docker。',
  },

  meet: {
    title: '认识 Pip',
    slotLabel: 'Mopi，一朵戴眼镜的青色小云',
    lede: '你什么时候需要，它都准备好帮忙，拿起来按住说话就行。',
  },
  moods: {
    asleep: { name: '睡着', line: '你一分钟不理它，它就会调暗屏幕，打起瞌睡。', label: '睡着的 Pip' },
    wake: { name: '醒来', line: '你拿起平板、点一下，或者有回复到达时，它会伸个懒腰醒过来。', label: '醒来的 Pip' },
    listen: { name: '在听', line: '按住屏幕说话，它会凑过来，把手放在耳朵边。', label: '在听的 Pip' },
    think: { name: '思考', line: '干活的时候，它会扭来扭去、揉揉太阳穴，有时还会灵光一闪。', label: '在思考的 Pip' },
    happy: { name: '开心', line: '事情一办成，它就会蹦一下。', label: '开心的 Pip' },
    talk: { name: '说话', line: '它的回复会伴着一声轻柔的提示音，出现在旁边的气泡里，就在它听到你说的话下面。', label: '在说话的 Pip' },
  },
  props: {
    title: '每个表情都是一个不同的动作',
    label: '拿着放大镜、望远镜、喇叭和纸飞机的 Pip',
    p: 'Pip 每做一种事都会拿起不同的道具，所以你一眼就知道它在干什么：上网搜索时拿放大镜，读网页时拿望远镜，给子智能体布置任务时拿喇叭，给另一个 Pip 发消息时拿纸飞机。',
  },
  desk: {
    title: '它住在我的桌上',
    alt: '我桌上夹在键盘上的 M5Stack Tab5，主屏幕上是 Mopi，一朵戴眼镜的青色小云',
    p: 'Pip 跑在一台夹在键盘上的 M5Stack Tab5 上，就放在我的桌上。这是 Mopi，我第一个桌面上的 Pip，它会在主屏幕上等着，直到我需要它。',
  },

  canvas: {
    title: '屏幕',
    pipLabel: '一个戴贝雷帽、拿望远镜张望的紫色 Pip',
    lede: 'Markdown、可以互动的网页浏览器、画图、提问，还有更多。',
  },
  cursor: {
    title: '会用浏览器',
    win: 'Pip 正在操作的页面',
    label: 'Pip 的光标在一个 YouTube 视频上滑过，打开字幕，再把播放速度设成 1.5 倍',
    p: '我让它打开一个带字幕的视频时，Pip 会打开视频，把光标移到字幕按钮上，再从齿轮菜单里设好速度。浏览器本身跑在我的服务器上，平板上显示的是同一个页面，Pip 就在旁边看着。',
  },
  point: {
    title: '它会指给你看',
    label: 'Tab5 上一张没有标注的动物细胞图：Pip 把两个线粒体圈起来，写上“Mitochondria”，然后画一个标着“Nucleus”的箭头指进细胞核',
    p: '这在学习时很好用。我放了一张没有标注的动物细胞图，让 Pip 圈出线粒体，再告诉我细胞核在哪。因为 Pip 能截屏再看截图，它会自己在图里找到这些部位，然后在图上画出圆圈、箭头和注释。',
  },
  markdown: {
    title: '看得清楚的回答',
    alt: 'Tab5 上一条排好版的回复：一个粗体标题、一个以粗体开头的列表，气泡里还有一句话',
    p: '比较长的回答会以排好版的文字在一个窗格里打开，简短的版本则留在 Pip 旁边的气泡里。',
  },
  question: {
    title: '它会先问，不会乱猜',
    alt: 'Tab5 上 Pip 出的一道选择题：先指细胞的哪个部分，有三个选项，还有“输入答案”和“跳过”',
    p: '需要我做决定的时候，Pip 会出一道题，我可以点选项、用键盘打字，或者按住 Pip 直接说出来。',
  },
  touches: {
    tap: { title: '点击', text: '每次点击都会显示一个蓝点，页面有反应后会变成一个绿圈。', alt: '在 M5Stack Tab5 页面的圆形帮助按钮上点一下：先是蓝点，然后是绿圈' },
    drag: { title: '拖动', text: '拖动时，页面一边滚动，手指后面一边留下一道蓝线。', alt: '手指在 M5Stack Tab5 页面上往下拖，留下一道蓝线' },
    expand: { title: '展开窗格', text: '在任何窗格上点“展开”，它就会放大到占满屏幕。', alt: '在一个窗格上点“展开”，窗格放大到全屏' },
    back: { title: '返回', text: '不管在哪里，从左往右一划就能返回。', alt: '手指从左往右划，屏幕滑回上一个画面' },
  },

  applets: {
    title: '小应用',
    pipLabel: '一个戴耳机、在笔记本电脑上打字的粉色 Pip',
    lede: 'Pip 能用 Lua 做原生应用，也能从 DSH 主机串流网页应用。',
  },
  drawer: {
    title: '应用抽屉',
    label: '小应用抽屉升起来，出现 NCIR 温度计的信息卡，然后应用启动并读取一个传感器',
    p: '往上拉把手就能打开应用抽屉，Pip 做的应用都存在这里。原生应用是用 Lua 写的，直接在平板上流畅运行，而容器应用是跑在 DSH 主机 Docker 里的网页应用，串流到 Tab5 上。因为跑在服务器上，容器应用能做的事多得多，比如局域网里的多人游戏，甚至视频通话。',
  },
  web: {
    macAlt: '一台 MacBook 在浏览器里开着 Intercom：Tab5 摄像头拍到的我占满了窗口，旁边是我自己 Mac 摄像头的预览',
    tabAlt: '同一通电话里 Tab5 上的 Intercom 网页小应用：Mac 摄像头拍到的我的脸占满屏幕，底部有一个 TALK 按钮，角落里是平板自己的摄像头画面',
    caption: <><b>网页小应用</b>是 Pip 自己写、从我服务器上提供的页面，但它们照样能用平板的摄像头、麦克风和扬声器。这是 Intercom，Pip 做的一个视频通话小应用，这里是一通真实的电话：Tab5 通过我 Mac 的摄像头显示我，而我 Mac 上的浏览器通过平板的摄像头显示我。</>,
  },
  native: {
    alt: '原生的 NCIR 温度计小应用，显示物体温度和环境温度，还有一张趋势图',
    caption: <><b>原生小应用</b>是 Pip 随时发到平板上的 Lua 脚本，所以它们直接在平板上全速运行。</>,
  },
  built: {
    title: 'Pip 做的',
    label: 'Tab5 上的一局井字棋，X 沿对角线获胜',
    caption: '井字棋，Pip 做的另一个应用，正在平板上玩',
    list: [
      { time: '106 秒', what: '一个番茄钟' },
      { time: '5 分钟', what: '一个 Lua 写的反应游戏，在平板上测试过' },
      { time: '8 分钟', what: '一个用 IMU 做的水平仪' },
      { time: '32 分钟', what: '一个网络摄像头对讲机，另一头是浏览器' },
    ],
  },
  devring: {
    title: '测试时别动手',
    label: '一个测试子智能体在点一个计数器应用时，屏幕周围出现红框：0、1、2、3，然后回到 2',
    p: '每当有子智能体在屏幕上做应用或测试应用，屏幕周围就会出现一圈红框，这样我就知道先别碰它。在这段视频里，一个测试子智能体在点一个编程子智能体刚写好的计数器应用，一直数到 3，再往回数到 2。',
  },

  desktops: {
    title: '桌面',
    pipLabel: '一个戴派对帽、扔纸飞机的青柠色 Pip',
    lede: '每段对话都有自己的桌面，配着自己的 Pip 和颜色。',
  },
  switch: {
    title: '下拉切换',
    label: '在 Mopi 的桌面上，顶部的小条被往下拉成聚焦栏，滑到 Fizz 的标签上松手，Fizz 的桌面就出现了；然后同样从 Fizz 切到 Wavo',
    p: '把屏幕顶部的小条往下拉，就会打开聚焦栏，里面每个桌面都有一个标签。滑到某一个上松手，那个桌面就会带着它自己的 Pip、图片和工作出现。在这段视频里，我从 Mopi 切到 Fizz，再切到 Wavo。',
  },
  newpip: {
    title: '每个 Pip 都自己捏自己',
    p: '每个新桌面一开始都是一颗蛋，它的 Pip 会在孵出来之前给自己编好性格、名字、身体、帽子，还有一张配套的主屏幕图片。点它的名字就能打开它给自己写的卡片，下面是我的八个 Pip。',
  },
  hatch: [
    { alt: '在 Wavo 的桌面上拉下聚焦栏，拖过最后一个标签，直到弹出一个加号；松手后，一个带着蛋的新桌面就出现了', caption: '拖过最后一个标签，新建一个桌面' },
    { alt: 'Riva，一颗戴王冠的金色爱心，孵出来了，气泡里是她的第一句话', caption: '蛋孵化了，Pip 说出它的第一句话' },
    { alt: 'Tab5 上 Riva 自己写的卡片：一个神气活现的金色对手，爱演、好胜又忠诚，还有她的口头禅、喜欢和讨厌的东西', caption: '点它的名字，看它写的卡片' },
  ],
  pips: {
    mopi: { name: 'Mopi', look: '一朵戴眼镜的青色小云', vibe: '一个睡眼惺忪的小哲学家，把打盹和发呆都当成同样严肃的工作。', says: '等我睡醒再问我。' },
    poco: { name: 'Poco', look: '一颗围着围巾的紫色豆子', vibe: '一个声音尖尖的迷你牧场小帮工，把每件小事都当成一场边疆冒险。', says: '我们来把它搞定！' },
    fizz: { name: 'Fizz', look: '一颗戴派对帽的粉色软糖', vibe: '一只粉色软糖小捣蛋，会把每一团小乱子变成游戏，然后开开心心地收拾干净。', says: '先捣乱，再收拾！' },
    wavo: { name: 'Wavo', look: '一滴戴墨镜的青柠色水珠', vibe: '一个悠哉的冲浪数学家，会在两波浪之间，在湿沙上解方程。', says: '乘着余弦冲吧，老兄。' },
    quib: { name: 'Quib', look: '一颗戴眼镜的青色豆子', vibe: '一个脾气不太好的小图书管理员，守着平板里的书，其实偷偷喜欢有人陪。', says: '嘘。先看书，感情以后再说。' },
    doughby: { name: 'Doughby', look: '一颗戴派对帽的紫色软糖', vibe: '一个痴迷谐音梗的面包师，把每段对话都当成一炉新鲜出炉的笑话。', says: '很高兴“面”见你！' },
    blooma: { name: 'Blooma', look: '一滴戴着花的粉色水珠', vibe: '一个温柔的禅意园丁，把每个小瞬间都变成一小段平静的季节。', says: '柔软生长，保持好奇。' },
    bzzt: { name: 'Bzzt', look: '一朵带天线的青柠色小云', vibe: '一个面无表情的小机器人谐星，正一本正经地学习什么是笑话，一次一个冷冷的包袱。', says: '刚才那是个笑话。笑。' },
  },
  ask: {
    title: '在哪都能问 Pip',
    label: '在 Riva 的主屏幕上拉下聚焦栏，输入并发送问题“仙人掌取什么名字好？”，然后是 Riva 的回复：Prickly Pete、Spike Lee 或者 Sir Pokes-A-Lot',
    p: '你也可以在任何屏幕上通过聚焦栏和 Pip 说话，往下一拉或者按 Ctrl+Space，然后打字或者开口说。这里我让 Riva 给一株仙人掌取名字。',
  },
  control: {
    title: '控制中心',
    label: '控制中心在温度计应用上方落下来，然后是它的设置页面',
    p: '从右上角往下拉就会打开控制中心，里面有亮度、音量、麦克风和摄像头，还有一个退出小应用的按钮，完整的设置再点一下就到。',
  },

  crew: {
    title: '帮手们',
    pipLabel: '一个戴王冠、拿喇叭喊话的金色爱心 Pip',
    lede: 'Pip 把耗时长的活交给子智能体，这样它就能继续陪我聊天。',
  },
  subagents: {
    title: '干活中的子智能体',
    label: '五个在干活的子智能体 Pip：写字、打字、搭积木、看书和摇烧瓶',
    p: '每个子智能体都会领到一份工作和一件配套的道具，比如记事本、笔记本电脑、积木、书或者冒泡的烧瓶。它们干活的时候，主屏幕上会坐着一个忙碌的小 Pip，点一下就能打开帮手卡片，每个帮手都会说说自己在忙什么。',
  },
  crewHome: {
    alt: 'Zesto 的主屏幕上打开的帮手卡片：三个子智能体 Researcher、Scout 和 Writer，各自带着一句简短的想法',
    caption: '三个子智能体在干活时的帮手卡片',
  },
  tasks: {
    title: '长任务有清单',
    alt: 'Fizz 的主屏幕上一份完成了的三步任务清单：设计并编写原生 Lua 应用，在平板上测试，在桌面上打开',
    p: 'Pip 会把一个长任务变成主屏幕上的任务清单，把每一步交给一个子智能体，比如侦察员、写手或者测试员，做完了就打个勾。',
  },
  kimi: {
    title: '它帮我盯着其他智能体',
    steps: [
      { alt: '两个在干活的帮手卡片：Zesto 和外部智能体 Kimi，都在打字', caption: 'Kimi 加入帮手们' },
      { alt: 'Tab5 上的一张卡片：Kimi 想写入文件，有“允许一次”“本次会话都允许”和“拒绝”', caption: '写入之前先问我' },
      { alt: 'Tab5 上 Pip 的回复：Kimi 搞定了，文件在工作区里，内容是 hello from Kimi', caption: 'Pip 回来汇报' },
    ],
    p: '因为 Pip 和我的编程会话住在同一个框架里，它能看到哪些会话在运行、已完成、卡在一个问题上或者出了故障，还能把其他厂商的智能体也拉进来。这里它把一份工作交给我服务器上的 Kimi Code，于是 Kimi 出现在帮手卡片上，它要写文件的请求会发到平板上等我批准，做完以后 Pip 再回来汇报。',
  },

  inside: {
    title: '工作原理',
    pipLabel: '一个戴眼镜的橙色 Pip 在思考，直到一个灯泡亮起来',
    lede: '平板只是一张脸，所有的思考都在我的服务器上进行。',
  },
  flow: {
    label: '一个请求怎么走：Tab5 和 VM 上的桥接程序通信，桥接程序再和 DeepSeek Harness 通信',
    nodes: {
      tab: { title: 'Tab5', where: '在我桌上', items: ['画在平板上的 Pip', '触摸、键盘、麦克风', '摄像头、IMU、扬声器', '用 Lua 写的原生小应用'] },
      bridge: { title: '宠物桥接', where: '在 VM 上', items: ['语音转文字，在 VM 上', '把平板的硬件变成 API', '给小应用用的页面'] },
      dsh: { title: 'DeepSeek Harness', where: '在 VM 上', items: ['Pip，一个有自己人设的会话', '负责长任务的子智能体', 'Pip 能看能点的浏览器', 'Docker 里的小应用'] },
    },
    links: [
      { out: '语音、点击、按键', back: '画面、回复、脚本' },
      { out: '你的话，以 Pip 的身份', back: '回复、页面、应用' },
    ],
    caption: '平板负责画出 Pip 和屏幕，并通过 Wi-Fi 和我桌上一台小小的 Ubuntu VM 通信，其他一切都在那里运行。',
  },
  hw: {
    working: 'Tab5 上已经能用的',
    workingList: ['触摸', '摄像头', '麦克风', '扬声器', 'IMU', 'I2C', '键盘'],
    unchecked: '还没检查',
    uncheckedList: ['USB', '耳机孔', 'Wi-Fi 功能', 'ESP-NOW', 'BLE', 'UART'],
  },
  next: {
    title: '还在进行中',
    p: 'Pip 还在开发，几乎每周都会变，所以自己部署一个的说明，之后会补在这里。',
  },
  credit: <>本页顶部的 3D Tab5 是基于 M5Stack 自己在 <a href="https://github.com/m5stack/M5_Hardware" target="_blank" rel="noopener">M5_Hardware</a> 里的 Tab5 结构模型做的（MIT 许可证，版权归 M5Stack 所有），我加上了玻璃、屏幕和背壳。Pip 的动画是用固件自己的绘图代码渲染出来的，截图和视频都来自平板的屏幕。手势视频录制时平板被放慢了，所以 Pip 在里面动得有点快。</>,
};

export default zh;
