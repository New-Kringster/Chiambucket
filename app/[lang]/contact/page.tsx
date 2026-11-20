import type { Metadata } from 'next';
import ContactClient from '../../contact/ContactClient';
import { CONTACT } from '../../contact/_copy';
import { langMeta } from '@/lib/langMeta';
import type { Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return langMeta('/contact', lang, CONTACT[lang].meta);
}

export default function LangContactPage() {
  return <ContactClient />;
}
