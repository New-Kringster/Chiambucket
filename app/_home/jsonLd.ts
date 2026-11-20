import { HTML_LANG, SITE, localize, type Lang } from '@/lib/i18n';
import type { HomeCopy } from './_copy';

/** The homepage's JSON-LD: a Person, the WebSite and the two highlighted builds. Names of people,
    sites and projects stay as they are; the prose comes from the copy, and the translated pages also
    say which language they are in. */
export function homeJsonLd(ld: HomeCopy['ld'], lang: Lang) {
  const url = SITE + localize('/', lang);
  const inLanguage = lang === 'en' ? {} : { inLanguage: HTML_LANG[lang] };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Braven Chiam',
      url,
      image: 'https://www.chiambucket.com/images/logo.png',
      jobTitle: ld.jobTitle,
      email: 'mailto:braven@chiambucket.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Singapore', addressCountry: 'SG' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Nanyang Polytechnic' },
      knowsAbout: ld.knowsAbout,
      sameAs: [
        'https://github.com/New-Kringster',
        'https://www.instagram.com/bombastic_demise',
        'https://www.youtube.com/@newkringster2564',
      ],
      subjectOf: [
        { '@type': 'CreativeWork', name: 'OCR Reader', url: 'https://www.chiambucket.com/waterslop' },
        { '@type': 'CreativeWork', name: 'Project June', url: 'https://www.chiambucket.com/project-june' },
        { '@type': 'SoftwareApplication', name: 'BeadReader', url: 'https://www.chiambucket.com/beadreader' },
      ],
      ...inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Chiambucket',
      url,
      author: { '@type': 'Person', name: 'Braven Chiam' },
      ...inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Project June',
      headline: ld.juneHeadline,
      url: 'https://www.chiambucket.com/project-june',
      author: { '@type': 'Person', name: 'Braven Chiam' },
      about: ld.juneAbout,
      keywords: ld.juneKeywords,
      ...inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BeadReader',
      url: 'https://www.chiambucket.com/beadreader',
      applicationCategory: 'BookApplication',
      operatingSystem: 'Web',
      author: { '@type': 'Person', name: 'Braven Chiam' },
      about: ld.beadAbout,
      keywords: ld.beadKeywords,
      ...inLanguage,
    },
  ];
}
