'use client';
import { usePathname } from 'next/navigation';
import SunlitScene from './SunlitScene';
import { themeForPath } from '../lib/theme';
import { isEmbed } from '../lib/embed';
import { splitLang } from '../lib/i18n';

/*
  SceneShell — mounts the painted scene for the current route (mounted once in
  app/layout.tsx). Each route's theme picks its scene (lib/theme.ts); the
  scene is rebuilt when the route changes.
*/
export default function SceneShell() {
  const pathname = usePathname();
  // The homepage draws its own chapters (app/_home/HomeStory.tsx), and the HomeLab
  // is told the same way on black (app/homelab), so neither has a scene.
  const { base } = splitLang(pathname);
  if (base === '/' || base === '/homelab' || isEmbed(pathname)) return null;
  return <SunlitScene key={pathname} theme={themeForPath(base)} home={false} />;
}
