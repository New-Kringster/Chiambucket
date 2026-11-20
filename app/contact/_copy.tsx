import type { Lang } from '@/lib/i18n';

/* The contact page's words in every language (small enough to ship together). */
const en = {
  meta: {
    title: 'Contact | Braven Chiam',
    description: 'Email Braven Chiam at braven@chiambucket.com, or find him on GitHub, LinkedIn, YouTube, Instagram and WhatsApp.',
    ogDescription: 'Email braven@chiambucket.com, or find me on GitHub, LinkedIn, YouTube, Instagram and WhatsApp.',
  },
  kicker: 'Contact',
  title: <>Let&apos;s <em>talk</em></>,
  sub: 'Email is the fastest way to reach me, and I’m also on the sites below.',
  emailLabel: 'Email',
  write: 'Write an email',
  copy: 'Copy address',
  copied: 'Copied',
};
export type ContactCopy = typeof en;

export const CONTACT: Record<Lang, ContactCopy> = {
  en,
  zh: {
    meta: {
      title: '联系我 | Braven Chiam',
      description: '给 Braven Chiam 发邮件到 braven@chiambucket.com，或者在 GitHub、LinkedIn、YouTube、Instagram 和 WhatsApp 上找到他。',
      ogDescription: '发邮件到 braven@chiambucket.com，或者在 GitHub、LinkedIn、YouTube、Instagram 和 WhatsApp 上找我。',
    },
    kicker: '联系我',
    title: <>来<em>聊聊</em>吧</>,
    sub: '发邮件是找到我最快的方式，下面这些平台上也能找到我哦。',
    emailLabel: '邮箱',
    write: '写封邮件',
    copy: '复制地址',
    copied: '已复制',
  },
  ja: {
    meta: {
      title: '連絡先 | Braven Chiam',
      description: 'Braven Chiam へのご連絡は braven@chiambucket.com まで。GitHub、LinkedIn、YouTube、Instagram、WhatsApp でも見つかります。',
      ogDescription: 'メールは braven@chiambucket.com へ。GitHub、LinkedIn、YouTube、Instagram、WhatsApp にもいます。',
    },
    kicker: '連絡先',
    title: <>気軽に<em>話そう</em></>,
    sub: 'いちばん早く届くのはメールです。下のサイトでも見つかりますよ。',
    emailLabel: 'メール',
    write: 'メールを書く',
    copy: 'アドレスをコピー',
    copied: 'コピーしました',
  },
  nl: {
    meta: {
      title: 'Contact | Braven Chiam',
      description: 'Mail Braven Chiam op braven@chiambucket.com, of vind hem op GitHub, LinkedIn, YouTube, Instagram en WhatsApp.',
      ogDescription: 'Mail naar braven@chiambucket.com, of vind me op GitHub, LinkedIn, YouTube, Instagram en WhatsApp.',
    },
    kicker: 'Contact',
    title: <>Laten we <em>praten</em></>,
    sub: 'Mailen is de snelste manier om me te bereiken, en je vindt me ook op de sites hieronder.',
    emailLabel: 'E-mail',
    write: 'Stuur een mail',
    copy: 'Adres kopiëren',
    copied: 'Gekopieerd',
  },
  de: {
    meta: {
      title: 'Kontakt | Braven Chiam',
      description: 'Schreib Braven Chiam an braven@chiambucket.com, oder finde ihn auf GitHub, LinkedIn, YouTube, Instagram und WhatsApp.',
      ogDescription: 'Schreib mir an braven@chiambucket.com, oder finde mich auf GitHub, LinkedIn, YouTube, Instagram und WhatsApp.',
    },
    kicker: 'Kontakt',
    title: <>Lass uns <em>reden</em></>,
    sub: 'Am schnellsten erreichst du mich per E-Mail, und du findest mich auch auf den Seiten unten.',
    emailLabel: 'E-Mail',
    write: 'E-Mail schreiben',
    copy: 'Adresse kopieren',
    copied: 'Kopiert',
  },
  ru: {
    meta: {
      title: 'Контакты | Braven Chiam',
      description: 'Напишите Braven Chiam на braven@chiambucket.com или найдите его на GitHub, LinkedIn, YouTube, Instagram и WhatsApp.',
      ogDescription: 'Пишите на braven@chiambucket.com или найдите меня на GitHub, LinkedIn, YouTube, Instagram и WhatsApp.',
    },
    kicker: 'Контакты',
    title: <>Давайте <em>поговорим</em></>,
    sub: 'Быстрее всего до меня можно достучаться по почте, а ещё я есть на сайтах ниже.',
    emailLabel: 'Почта',
    write: 'Написать письмо',
    copy: 'Скопировать адрес',
    copied: 'Скопировано',
  },
  fr: {
    meta: {
      title: 'Contact | Braven Chiam',
      description: 'Écris à Braven Chiam à braven@chiambucket.com, ou retrouve-le sur GitHub, LinkedIn, YouTube, Instagram et WhatsApp.',
      ogDescription: 'Écris-moi à braven@chiambucket.com, ou retrouve-moi sur GitHub, LinkedIn, YouTube, Instagram et WhatsApp.',
    },
    kicker: 'Contact',
    title: <>On <em>discute</em>&nbsp;?</>,
    sub: 'Le plus rapide pour me joindre, c’est par e-mail, et tu me trouveras aussi sur les sites ci-dessous.',
    emailLabel: 'E-mail',
    write: 'Écrire un e\u2011mail',  // a non-breaking hyphen: the button wraps on phones, never at e-mail
    copy: 'Copier l’adresse',
    copied: 'Copié',
  },
  es: {
    meta: {
      title: 'Contacto | Braven Chiam',
      description: 'Escríbele a Braven Chiam a braven@chiambucket.com, o encuéntralo en GitHub, LinkedIn, YouTube, Instagram y WhatsApp.',
      ogDescription: 'Escríbeme a braven@chiambucket.com, o encuéntrame en GitHub, LinkedIn, YouTube, Instagram y WhatsApp.',
    },
    kicker: 'Contacto',
    title: <>¿<em>Hablamos</em>?</>,
    sub: 'Lo más rápido para contactarme es el correo, y también me encuentras en los sitios de abajo.',
    emailLabel: 'Correo',
    write: 'Escribir un correo',
    copy: 'Copiar dirección',
    copied: 'Copiado',
  },
};
