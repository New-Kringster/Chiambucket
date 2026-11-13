'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { themeForPath } from '../lib/theme';

/* Page transitions: the bright dissolve (components/dissolve.ts) as a veil.

   A click on a link to another page of the site is held for a moment while a
   veil in the next page's own colour burns in from the point that was
   clicked, its front a thin line of light with glitter and star flares. The
   route changes under the veil, and once the new page has painted the veil
   breaks up from the middle of the screen to show it.

   Links that open elsewhere (new tab, modifier keys, downloads, other sites,
   same-page anchors) are left alone, as are back and forward. Reduced motion,
   or a browser without WebGL, keeps plain navigation. */

const VEIL: Record<string, string> = {
  night: '#0d1214', dusk: '#2b2540', sunlit: '#cdd5c2', golden: '#b6aec3', noon: '#92b6d0', teal: '#8eb2ad', mist: '#b5afc4',
};
const PAGE_VEIL: Record<string, string> = { '/waterslop': '#181716' };

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const easeIn = (k: number) => k * k * (1.6 - 0.6 * k);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 2.4);

type Phase = 'idle' | 'cover' | 'wait' | 'reveal';

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const host = useRef<HTMLDivElement>(null);
  const s = useRef({ phase: 'idle' as Phase, raf: 0, timer: 0, fx: null as import('./dissolve').Dissolve | null, cv: null as HTMLCanvasElement | null, mod: null as typeof import('./dissolve') | null, from: '' });

  // Load the shader code when the browser is idle, so the first click is instant.
  useEffect(() => {
    const load = () => import('./dissolve').then((m) => { s.current.mod = m; });
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(load); else window.setTimeout(load, 1500);
  }, []);

  useEffect(() => {
    const st = s.current;
    const el = host.current!;
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

    const teardown = () => {
      cancelAnimationFrame(st.raf);
      clearTimeout(st.timer);
      st.fx?.destroy(); st.fx = null;
      st.cv?.remove(); st.cv = null;
      el.classList.remove('on');
      st.phase = 'idle';
    };

    const run = (dur: number, draw: (k: number, t: number) => void, done: () => void) => {
      const t0 = performance.now();
      const tick = () => {
        const k = Math.min(1, (performance.now() - t0) / dur);
        draw(k, (performance.now() - t0) / 1000);
        if (k < 1) st.raf = requestAnimationFrame(tick); else done();
      };
      st.raf = requestAnimationFrame(tick);
    };

    const reveal = () => {
      if (st.phase !== 'wait' || !st.fx) { teardown(); return; }
      st.phase = 'reveal';
      clearTimeout(st.timer);
      const fx = st.fx;
      run(950, (k, t) => fx.draw({ inP: 1, outP: easeOut(k), time: t + 1, focus: [0.5, 0.5] }), teardown);
    };
    (st as unknown as { reveal: () => void }).reveal = reveal;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return; // files, not pages
      if (st.phase !== 'idle') { e.preventDefault(); e.stopPropagation(); return; }
      if (reduced() || !st.mod) return;

      // Build the veil before taking the click from the link.
      const cv = document.createElement('canvas');
      el.appendChild(cv);
      el.classList.add('on');
      const fx = st.mod.Dissolve.create(cv);
      if (!fx) { cv.remove(); el.classList.remove('on'); return; }
      e.preventDefault();
      e.stopPropagation();
      st.cv = cv; st.fx = fx; st.phase = 'cover'; st.from = location.pathname;
      fx.setColor(hex(PAGE_VEIL[url.pathname] ?? VEIL[themeForPath(url.pathname)] ?? VEIL.night));
      const focus: [number, number] = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
      const href = url.pathname + url.search + url.hash;
      router.prefetch(url.pathname);
      run(560, (k, t) => fx.draw({ inP: easeIn(k), outP: 0, time: t, focus }), () => {
        st.phase = 'wait';
        router.push(href);
        // If the route never changes (an error, a slow network), lift the veil anyway.
        st.timer = window.setTimeout(reveal, 6000);
      });
    };

    const onResize = () => st.fx?.resize();
    window.addEventListener('click', onClick, true);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('click', onClick, true); window.removeEventListener('resize', onResize); teardown(); };
  }, [router]);

  // The new page is in: wait for it to paint, then lift the veil.
  useEffect(() => {
    const st = s.current as typeof s.current & { reveal?: () => void };
    if (st.phase !== 'wait' || pathname === st.from) return;
    let r1 = 0, r2 = 0;
    const t = window.setTimeout(() => { r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => st.reveal?.()); }); }, 90);
    return () => { clearTimeout(t); cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [pathname]);

  return (
    <>
      <div ref={host} className="ptx" aria-hidden="true" />
      <style>{`.ptx{position:fixed;inset:0;z-index:2147483000;pointer-events:none;display:none}.ptx.on{display:block;pointer-events:auto;cursor:progress}.ptx canvas{position:absolute;inset:0;width:100%;height:100%;display:block}`}</style>
    </>
  );
}
