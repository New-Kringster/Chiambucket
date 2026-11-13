'use client';
import { usePathname } from 'next/navigation';
import SunlitScene from './SunlitScene';
import { themeForPath } from '../lib/theme';

/*
  SceneShell — mounts the painted scene for the current route (mounted once in
  app/layout.tsx). Each route's theme picks its scene (lib/theme.ts); the
  scene is rebuilt when the route changes.
*/
export default function SceneShell() {
  const pathname = usePathname();
  // The homepage draws its own chapters (app/_home/HomeStory.tsx), so no scene there.
  if (pathname === '/') return null;
  return <SunlitScene key={pathname} theme={themeForPath(pathname)} home={pathname === '/'} />;
}
