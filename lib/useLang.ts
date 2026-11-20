'use client';
import { usePathname } from 'next/navigation';
import { splitLang, type Lang } from './i18n';

/** The page's language, from its path (/ja/... is Japanese, a plain path is English). */
export function useLang(): Lang {
  return splitLang(usePathname()).lang;
}
