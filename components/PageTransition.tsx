'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { themeForPath } from '../lib/theme';

/* Page transitions: the bright dissolve (components/dissolve.ts) from one
   page straight into the next.

   A click on a link to another page of the site starts a View Transition: the
   browser keeps a snapshot of the old page while the route changes, then the
   snapshot breaks up from the point that was clicked, its grains scattering,
   to show the new page underneath. The light along the front (the glowing
   line, glitter, star flares) is drawn by a WebGL canvas above both. The
   snapshot's holes come from a small second canvas in 'mask' mode, seeded
   like the light so the two line up, and handed to CSS as a mask image each
   frame. The site nav is its own transition group, shown live, so its own
   animations (the active pill moving, its day and night colours) play
   through the dissolve.

   Browsers without View Transitions get the older veil: a veil in the next
   page's colour burns in from the click, the route changes under it, and it
   breaks up again.

   Links that open elsewhere (new tab, modifier keys, downloads, other sites,
   same-page anchors) are left alone, as are back and forward. Reduced motion,
   or a browser without WebGL, keeps plain navigation. */

const VEIL: Record<string, string> = {
  night: '#0d1214', dusk: '#2b2540', sunlit: '#cdd5c2', golden: '#b6aec3', noon: '#92b6d0', teal: '#8eb2ad', mist: '#b5afc4',
};
const PAGE_VEIL: Record<string, string> = { '/waterslop': '#181716' };

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const easeIn = (k: number) => k * k * (1.6 - 0.6 * k);
const VT_MS = 1100;
type VTDoc = Document & { startViewTransition?: (cb: () => Promise<void>) => { ready: Promise<void>; finished: Promise<void> } };
const easeOut = (k: number) => 1 - Math.pow(1 - k, 2.4);

type Phase = 'idle' | 'cover' | 'wait' | 'reveal';

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const host = useRef<HTMLDivElement>(null);
  const s = useRef({
    phase: 'idle' as Phase, raf: 0, timer: 0, from: '',
    fx: null as import('./dissolve').Dissolve | null, cv: null as HTMLCanvasElement | null,
    mask: null as import('./dissolve').Dissolve | null, maskStyle: null as HTMLStyleElement | null,
    mod: null as typeof import('./dissolve') | null, resolve: null as null | (() => void),
  });

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
      st.mask?.destroy(); st.mask = null;
      st.maskStyle?.remove(); st.maskStyle = null;
      st.resolve = null;
      el.classList.remove('on', 'vt');
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

    /* The page-to-page dissolve. Returns false if it cannot run here. */
    const dissolveTo = (href: string, focus: [number, number]) => {
      const mod = st.mod!;
      const seed = Math.random() * 50;
      const cv = document.createElement('canvas');
      el.appendChild(cv);
      el.classList.add('on', 'vt');
      const light = mod.Dissolve.create(cv, { seed });
      const mw = 360, mh = Math.max(1, Math.round((mw * innerHeight) / innerWidth));
      const mask = mod.Dissolve.create(document.createElement('canvas'), { seed, size: [mw, mh], dpr: mw / innerWidth, sdr: true });
      if (!light || !mask) { light?.destroy(); mask?.destroy(); cv.remove(); el.classList.remove('on', 'vt'); return false; }
      light.setMode('light');
      mask.setMode('mask');
      const style = document.createElement('style');
      document.head.appendChild(style);
      Object.assign(st, { cv, fx: light, mask, maskStyle: style, phase: 'wait' as Phase, from: location.pathname });
      const frame = (outP: number, t: number) => {
        mask.draw({ inP: 1, outP, time: t, focus });
        const url = mask.canvas.toDataURL('image/png');
        style.textContent = `::view-transition-old(root){-webkit-mask-image:url(${url});mask-image:url(${url})}`;
        light.draw({ inP: 1, outP, time: t, focus });
      };
      frame(0, 0);
      const vt = (document as VTDoc).startViewTransition!(() => new Promise<void>((res) => {
        st.resolve = res;
        router.push(href);
        // If the route never changes (an error, a slow network), go on anyway.
        st.timer = window.setTimeout(res, 5000);
      }));
      vt.ready.then(() => {
        st.phase = 'reveal';
        clearTimeout(st.timer);
        run(VT_MS - 60, (k, t) => frame(easeOut(k), t), () => {});
      }).catch(teardown);
      vt.finished.finally(teardown);
      return true;
    };

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
      const focus: [number, number] = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
      const href = url.pathname + url.search + url.hash;
      if ((document as VTDoc).startViewTransition && dissolveTo(href, focus)) { e.preventDefault(); e.stopPropagation(); return; }

      // No View Transitions: build the veil before taking the click from the link.
      const cv = document.createElement('canvas');
      el.appendChild(cv);
      el.classList.add('on');
      const fx = st.mod.Dissolve.create(cv);
      if (!fx) { cv.remove(); el.classList.remove('on'); return; }
      e.preventDefault();
      e.stopPropagation();
      st.cv = cv; st.fx = fx; st.phase = 'cover'; st.from = location.pathname;
      fx.setColor(hex(PAGE_VEIL[url.pathname] ?? VEIL[themeForPath(url.pathname)] ?? VEIL.night));
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
    if (st.resolve) {
      // Rendering is held during a View Transition's update, so wait on a timer, not on frames.
      const res = st.resolve;
      const t = window.setTimeout(() => { st.resolve = null; res(); }, 80);
      return () => clearTimeout(t);
    }
    let r1 = 0, r2 = 0;
    const t = window.setTimeout(() => { r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => st.reveal?.()); }); }, 90);
    return () => { clearTimeout(t); cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [pathname]);

  return (
    <>
      <div ref={host} className="ptx" aria-hidden="true" />
      <style>{CSS}</style>
    </>
  );
}

const CSS = `
.ptx{position:fixed;inset:0;z-index:2147483000;pointer-events:none;display:none}
.ptx.on{display:block;pointer-events:auto;cursor:progress}
.ptx canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.ptx.vt{view-transition-name:ptx-light}
.pnav{view-transition-name:ptx-nav}
::view-transition-group(root){animation:ptx-hold ${VT_MS}ms linear both}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
::view-transition-old(root){z-index:1;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
::view-transition-group(ptx-nav){animation:none;z-index:2}
::view-transition-old(ptx-nav){display:none}
::view-transition-new(ptx-nav){animation:none}
::view-transition-group(ptx-light){animation:none;z-index:3}
::view-transition-old(ptx-light){display:none}
::view-transition-new(ptx-light){animation:none}
@keyframes ptx-hold{from{opacity:1}to{opacity:1}}
`;
