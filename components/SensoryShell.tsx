'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SensoryAtmosphere from './SensoryAtmosphere';
import { isPressPath } from '../lib/theme';

/*
  SensoryShell — mounts the dark-sensory field behind the whole site.
  Rendered ONCE in app/layout.tsx. It renders the fixed WebGL atmosphere
  backdrop and keeps the `sensory-active` flag on <html> (the inline script in
  layout.tsx already sets it before paint; this effect keeps it right across
  client-side navigation). All the reskin CSS lives in the
  "DARK SENSORY / SIGNAL ARCHIVE" section at the end of public/mainstyle.css,
  keyed on html.sensory-active, with accents following the route's data-theme.

  Routes in PRESS_ROUTES use the paper design instead: no field, and the
  `press` class replaces `sensory-active`.
*/
export default function SensoryShell() {
  const press = isPressPath(usePathname());

  useEffect(() => {
    const cl = document.documentElement.classList;
    cl.toggle('press', press);
    cl.toggle('sensory-active', !press);
  }, [press]);

  return press ? null : <SensoryAtmosphere />;
}
