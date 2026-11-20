import type { CreditsCopy } from './_copy';

const ru: CreditsCopy = {
  meta: {
    title: 'Авторы | Braven Chiam',
    description:
      'Выходные данные chiambucket.com: сайт сделан с Claude и Next.js, размещён на Vercel, а фото показывает моя собственная галерея Lychee.',
    ogDescription: 'Как устроен и где размещён этот сайт и какие инструменты за ним стоят.',
    twitterDescription: 'Этот сайт сделан с Claude и размещён на Vercel.',
  },
  kicker: 'Авторы',
  title: <>Авторы и <em>контент</em></>,
  sub: 'Здесь рассказано, как устроен и где размещён сайт и какие инструменты за ним стоят.',
  claude: {
    eyebrow: 'Дизайн и сборка',
    title: 'Claude',
    body: <>Я придумал и сделал этот сайт вместе с Claude, ИИ-моделью от <a href="https://www.anthropic.com" target="_blank" rel="noopener">Anthropic</a>. Claude помогал с вёрсткой, написал большую часть кода, подтянул тексты и помог с отладкой, а я решал, что остаётся, что меняется и как всё выглядит.</>,
  },
  hosting: {
    eyebrow: 'Хостинг',
    title: 'Vercel',
    body: [
      <><a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> хостит сайт и выкатывает новую версию при каждом push. Vercel Analytics и Speed Insights считают посещения и замеряют скорость страниц.</>,
      'Мой HomeLab по-прежнему держит фотогалерею и другие сервисы, которые я размещаю у себя, но публичный сайт живёт на Vercel: на управляемом хостинге он быстрее и надёжнее.',
    ],
  },
  tools: {
    eyebrow: 'Софт и контент',
    title: 'Софт и шрифты',
    list: [
      <><b>Next.js и React</b>, на TypeScript</>,
      <><b>Framer Motion</b> для страницы HomeLab и демо проектов</>,
      <><b>Lychee</b>, фотогалерея, которую я сам хостю для страницы с фото</>,
      <><b>Oswald, Inter и DM Sans</b>, основные шрифты</>,
      <><b>Canvas</b> для нарисованных неба, облаков, травы и моря за каждой страницей: они рисуются один раз и двигаются только средствами CSS</>,
      <><b>Inline SVG</b> для иконок</>,
    ],
    note: 'Фотографии, тексты и проекты на этом сайте мои.',
  },
};
export default ru;
