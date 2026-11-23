import type { Lang } from './i18n';

/* The fixed words in the shared article components (ArticleRecommendations, ArticleLightbox), in every
   language. They are short, so all languages ship together. The recommendation cards' titles and blurbs
   are longer and load per language from components/recs/<lang>.ts. */
export type ArticleShellCopy = {
  recs: {
    eyebrow: string; title: string;
    /** the peek button's aria-label and its visible pill */
    peekAria: string; peek: string;
    types: { personal: string; school: string; internship: string };
    /** the M5Stack mark on internship cards */
    atM5: string;
    read: string; soon: string; more: string;
    /** the peek reader's dialog and its close button */
    dialog: string; close: string;
  };
  lightbox: { label: string; close: string; zoom: string; fit: string };
};

export const ARTICLE_SHELL: Record<Lang, ArticleShellCopy> = {
  en: {
    recs: {
      eyebrow: 'More to explore', title: 'Other projects',
      peekAria: 'Peek at a quick summary', peek: 'Peek summary',
      types: { personal: 'Personal', school: 'School', internship: 'Internship' }, atM5: 'at M5Stack',
      read: 'Read article', soon: 'Coming soon', more: 'Show more projects',
      dialog: 'Project details', close: 'Close details',
    },
    lightbox: { label: 'Image viewer', close: 'Close image', zoom: 'Click to zoom · Esc to close', fit: 'Click to fit · Esc to close' },
  },
  zh: {
    recs: {
      eyebrow: '继续探索', title: '其他项目',
      peekAria: '快速预览项目摘要', peek: '快速预览',
      types: { personal: '个人', school: '学校', internship: '实习' }, atM5: '在 M5Stack',
      read: '阅读文章', soon: '即将推出', more: '显示更多项目',
      dialog: '项目详情', close: '关闭详情',
    },
    lightbox: { label: '图片查看器', close: '关闭图片', zoom: '点击放大 · Esc 关闭', fit: '点击还原 · Esc 关闭' },
  },
  ja: {
    recs: {
      eyebrow: 'もっと見る', title: 'ほかの作品',
      peekAria: '概要をざっと見る', peek: 'ざっと見る',
      types: { personal: '個人', school: '学校', internship: 'インターン' }, atM5: 'M5Stack にて',
      read: '記事を読む', soon: '近日公開', more: 'ほかの作品も見る',
      dialog: '作品の詳細', close: '詳細を閉じる',
    },
    lightbox: { label: '画像ビューアー', close: '画像を閉じる', zoom: 'クリックで拡大 · Esc で閉じる', fit: 'クリックで全体表示 · Esc で閉じる' },
  },
  nl: {
    recs: {
      eyebrow: 'Meer ontdekken', title: 'Andere projecten',
      peekAria: 'Bekijk een korte samenvatting', peek: 'Snel bekijken',
      types: { personal: 'Eigen', school: 'School', internship: 'Stage' }, atM5: 'bij M5Stack',
      read: 'Lees artikel', soon: 'Binnenkort', more: 'Meer projecten',
      dialog: 'Projectdetails', close: 'Details sluiten',
    },
    lightbox: { label: 'Afbeeldingsviewer', close: 'Afbeelding sluiten', zoom: 'Klik om te zoomen · Esc om te sluiten', fit: 'Klik om passend te maken · Esc om te sluiten' },
  },
  de: {
    recs: {
      eyebrow: 'Mehr entdecken', title: 'Weitere Projekte',
      peekAria: 'Kurze Zusammenfassung ansehen', peek: 'Kurz ansehen',
      types: { personal: 'Eigene', school: 'Schule', internship: 'Praktikum' }, atM5: 'bei M5Stack',
      read: 'Artikel lesen', soon: 'Bald', more: 'Mehr Projekte',
      dialog: 'Projektdetails', close: 'Details schließen',
    },
    lightbox: { label: 'Bildansicht', close: 'Bild schließen', zoom: 'Klicken zum Zoomen · Esc zum Schließen', fit: 'Klicken zum Einpassen · Esc zum Schließen' },
  },
  ru: {
    recs: {
      eyebrow: 'Что ещё посмотреть', title: 'Другие проекты',
      peekAria: 'Кратко о проекте', peek: 'Кратко',
      types: { personal: 'Личные', school: 'Учебные', internship: 'Стажировка' }, atM5: 'в M5Stack',
      read: 'Читать статью', soon: 'Скоро', more: 'Больше проектов',
      dialog: 'О проекте', close: 'Закрыть',
    },
    lightbox: { label: 'Просмотр изображения', close: 'Закрыть изображение', zoom: 'Нажмите, чтобы увеличить · Esc, чтобы закрыть', fit: 'Нажмите, чтобы вписать · Esc, чтобы закрыть' },
  },
  fr: {
    recs: {
      eyebrow: 'À découvrir aussi', title: 'Autres projets',
      peekAria: 'Voir un résumé rapide', peek: 'Aperçu',
      types: { personal: 'Perso', school: 'École', internship: 'Stage' }, atM5: 'chez M5Stack',
      read: 'Lire l’article', soon: 'Bientôt', more: 'Plus de projets',
      dialog: 'Détails du projet', close: 'Fermer les détails',
    },
    lightbox: { label: 'Visionneuse d’images', close: 'Fermer l’image', zoom: 'Clique pour zoomer · Échap pour fermer', fit: 'Clique pour ajuster · Échap pour fermer' },
  },
  es: {
    recs: {
      eyebrow: 'Más para explorar', title: 'Otros proyectos',
      peekAria: 'Ver un resumen rápido', peek: 'Vista rápida',
      types: { personal: 'Personal', school: 'Escolar', internship: 'Prácticas' }, atM5: 'en M5Stack',
      read: 'Leer artículo', soon: 'Pronto', more: 'Más proyectos',
      dialog: 'Detalles del proyecto', close: 'Cerrar detalles',
    },
    lightbox: { label: 'Visor de imágenes', close: 'Cerrar imagen', zoom: 'Haz clic para ampliar · Esc para cerrar', fit: 'Haz clic para ajustar · Esc para cerrar' },
  },
};
