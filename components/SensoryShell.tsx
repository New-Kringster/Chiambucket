'use client';
import { useEffect } from 'react';
import SensoryAtmosphere from './SensoryAtmosphere';

/*
  SensoryShell — mounts the dark-sensory field behind the whole site.
  Rendered ONCE in app/layout.tsx. It renders the fixed WebGL atmosphere
  backdrop and keeps the `sensory-active` flag on <html> (the inline script in
  layout.tsx already sets it before paint; this effect is a safety net for any
  path that skips that script). All the reskin CSS lives in the
  "DARK SENSORY / SIGNAL ARCHIVE" section at the end of public/mainstyle.css,
  keyed on html.sensory-active, with accents following the route's data-theme.
*/
export default function SensoryShell() {
  useEffect(() => {
    document.documentElement.classList.add('sensory-active');
  }, []);

  return <SensoryAtmosphere />;
}
