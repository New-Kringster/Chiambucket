import type { Lang } from './i18n';

/* The words in the site's shell (nav, footer, language menu), in every language. Page copy lives
   with each page (_copy folders). */
export type ShellCopy = {
  home: string; photography: string; homelab: string; contact: string; work: string;
  openMenu: string; closeMenu: string; logoAlt: string;
  language: string;
  /** shown on pages that are only in English (the articles) */
  englishOnly: string;
  footerHome: string; creditsBefore: string; creditsLink: string;
  /** close buttons on pop-ups */
  close: string;
  /** the AI-use mark's label: {n} is the level, {short} one of aiShort */
  aiUse: string;
  aiShort: [string, string, string, string];
};

export const SHELL: Record<Lang, ShellCopy> = {
  en: {
    home: 'Home', photography: 'Photography', homelab: 'HomeLab', contact: 'Contact', work: 'My work',
    openMenu: 'Open menu', closeMenu: 'Close menu', logoAlt: 'Chiambucket home',
    language: 'Change language',
    englishOnly: 'This article is only in English for now.',
    footerHome: 'Chiambucket Home', creditsBefore: 'Credits for the content are', creditsLink: 'here',
    close: 'Close', aiUse: 'AI use: L{n}, {short}. Open the Scale of AI use', aiShort: ['little use', 'average use', 'heavy use', 'entirely AI'],
  },
  zh: {
    home: '首页', photography: '摄影', homelab: 'HomeLab', contact: '联系我', work: '我的作品',
    openMenu: '打开菜单', closeMenu: '关闭菜单', logoAlt: 'Chiambucket 首页',
    language: '切换语言',
    englishOnly: '这篇文章暂时只有英文版哦。',
    footerHome: 'Chiambucket 首页', creditsBefore: '内容的致谢都在', creditsLink: '这里',
    close: '关闭', aiUse: 'AI 使用程度：L{n}，{short}。打开 AI 使用等级说明', aiShort: ['少量使用', '一般使用', '大量使用', '完全由 AI 生成'],
  },
  ja: {
    home: 'ホーム', photography: '写真', homelab: 'HomeLab', contact: '連絡先', work: '作品',
    openMenu: 'メニューを開く', closeMenu: 'メニューを閉じる', logoAlt: 'Chiambucket ホーム',
    language: '言語を変更',
    englishOnly: 'この記事は今のところ英語版だけです。',
    footerHome: 'Chiambucket ホーム', creditsBefore: 'コンテンツのクレジットは', creditsLink: 'こちら',
    close: '閉じる', aiUse: 'AI の使用度：L{n}、{short}。AI 使用スケールを開く', aiShort: ['少しだけ使用', 'ほどほどに使用', 'たくさん使用', 'すべて AI'],
  },
  nl: {
    home: 'Home', photography: 'Fotografie', homelab: 'HomeLab', contact: 'Contact', work: 'Mijn werk',
    openMenu: 'Menu openen', closeMenu: 'Menu sluiten', logoAlt: 'Chiambucket home',
    language: 'Taal wijzigen',
    englishOnly: 'Dit artikel is voorlopig alleen in het Engels.',
    footerHome: 'Chiambucket Home', creditsBefore: 'De credits voor de content staan', creditsLink: 'hier',
    close: 'Sluiten', aiUse: 'AI-gebruik: L{n}, {short}. Open de schaal van AI-gebruik', aiShort: ['weinig gebruik', 'gemiddeld gebruik', 'veel gebruik', 'volledig AI'],
  },
  de: {
    home: 'Start', photography: 'Fotografie', homelab: 'HomeLab', contact: 'Kontakt', work: 'Projekte',
    openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', logoAlt: 'Chiambucket Startseite',
    language: 'Sprache ändern',
    englishOnly: 'Diesen Artikel gibt es vorerst nur auf Englisch.',
    footerHome: 'Chiambucket Start', creditsBefore: 'Die Credits für die Inhalte findest du', creditsLink: 'hier',
    close: 'Schließen', aiUse: 'KI-Nutzung: L{n}, {short}. Skala der KI-Nutzung öffnen', aiShort: ['wenig Nutzung', 'mittlere Nutzung', 'starke Nutzung', 'komplett KI'],
  },
  ru: {
    home: 'Главная', photography: 'Фото', homelab: 'HomeLab', contact: 'Контакты', work: 'Проекты',
    openMenu: 'Открыть меню', closeMenu: 'Закрыть меню', logoAlt: 'Chiambucket, главная',
    language: 'Сменить язык',
    englishOnly: 'Эта статья пока есть только на английском.',
    footerHome: 'Chiambucket, главная', creditsBefore: 'Авторы контента указаны', creditsLink: 'здесь',
    close: 'Закрыть', aiUse: 'Использование ИИ: L{n}, {short}. Открыть шкалу использования ИИ', aiShort: ['немного', 'в меру', 'много', 'полностью ИИ'],
  },
  fr: {
    home: 'Accueil', photography: 'Photographie', homelab: 'HomeLab', contact: 'Contact', work: 'Mes projets',
    openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', logoAlt: 'Accueil Chiambucket',
    language: 'Changer de langue',
    englishOnly: 'Cet article n’existe qu’en anglais pour l’instant.',
    footerHome: 'Accueil Chiambucket', creditsBefore: 'Les crédits du contenu sont', creditsLink: 'ici',
    close: 'Fermer', aiUse: 'Usage de l’IA\u202f: L{n}, {short}. Ouvrir l’échelle d’usage de l’IA', aiShort: ['usage léger', 'usage moyen', 'usage intensif', 'entièrement IA'],
  },
  es: {
    home: 'Inicio', photography: 'Fotografía', homelab: 'HomeLab', contact: 'Contacto', work: 'Mis proyectos',
    openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', logoAlt: 'Inicio de Chiambucket',
    language: 'Cambiar idioma',
    englishOnly: 'Por ahora este artículo solo está en inglés.',
    footerHome: 'Inicio de Chiambucket', creditsBefore: 'Los créditos del contenido están', creditsLink: 'aquí',
    close: 'Cerrar', aiUse: 'Uso de IA: L{n}, {short}. Abrir la escala de uso de IA', aiShort: ['poco uso', 'uso medio', 'mucho uso', 'totalmente IA'],
  },
};
