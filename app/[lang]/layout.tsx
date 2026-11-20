import { OTHER_LANGS } from '@/lib/i18n';

/* Every page under /{lang} is prerendered for each language other than English; any other first
   segment that no route claims is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return OTHER_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
