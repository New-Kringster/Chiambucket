'use client';
/* ────────────────────────────────────────────────────────────────
   The homepage as a scroll story (November 2026, branch task/home-story).

   Chapters:
     Start        the painted morning comes into focus, like eyes opening
                  to the sun, and the glass name focuses in over it;
                  scrolling breaks the painting into glittering grain (the
                  shared components/dissolve.ts) to uncover "Hello."
     Hello        who Braven is, the layers he builds in; a torn paper edge
     OCR Reader   the MeterSim meters behind the title, then a pinned 3D set
                  piece of the real board and case, ending as a full-screen
                  project card
     Project June, BeadReader   an opener (picture, huge title) and a
                  full-screen project card each
     Projects     the gallery of the other projects (peek or read)
     On the bench recent work from GitHub
     What I do    a bento of pictures, each opening its details
     HomeLab      the machines as an ASCII video
     Photos       a dense masonry wall
     Contact      "Say hello." in the night sky over the same field at dusk,
                  where the footer stands in the grass

   The nav and footer follow the chapter under them: light glass over the
   light chapters, night glass over the dark ones (html.is-day / .is-night,
   with the nav's colours eased in story.css).

   Motion: GSAP ScrollTrigger reads progress and Lenis smooths the wheel.
   Sticky stages do the pinning. Only transform, opacity and filter
   animate. With prefers-reduced-motion none of this is set up and
   story.css shows every state finished.
   ──────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Figtree, Newsreader } from 'next/font/google';
import { LAYERS, READER_BEATS, BENCH, SHOW_BENCH, PHOTOS, OCR_CARD, JUNE_CARD, BEAD_CARD } from './content';
import { FlagCard, ProjectGallery, Bento, usePeek } from './Cards';
import AsciiLab from './AsciiLab';
import { IcGitHub, IcMail, IcServer, IcPhotos } from '../../components/Icons';
import './story.css';

const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '800'], variable: '--hs-sans', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400', '500'], variable: '--hs-serif', display: 'swap' });

/** Words wrapped for word-by-word reveals (no measuring, so it renders on the server). */
function Words({ text }: { text: string }) {
  return <>{text.split(' ').map((w, i, a) => <span key={i} className="hs-w">{w}{i < a.length - 1 ? ' ' : ''}</span>)}</>;
}

/** Letters wrapped for character reveals; screen readers get the plain text. */
function Chars({ text }: { text: string }) {
  return (
    <span className="hs-chars" aria-label={text}>
      {Array.from(text).map((c, i) => <span key={i} className="hs-c" aria-hidden="true">{c === ' ' ? ' ' : c}</span>)}
    </span>
  );
}

/** One word of the name in clear glass: a cut-out shadow, the glass, a
    highlight and a rim, stacked (the old poster hero's GlassWord). */
function GlassWord({ children }: { children: string }) {
  return (
    <span className="hs-gw" aria-hidden="true">
      <span className="hs-gw-shadow">{children}</span>
      <span className="hs-gw-glass">{children}</span>
      <span className="hs-gw-light">{children}</span>
      <span className="hs-gw-rim">{children}</span>
    </span>
  );
}

/* A torn paper edge, drawn as real torn paper is: the coloured surface tears
   short of a pale fibrous core, loose fibres stick out of the core, the
   paper has a grain, and the torn lip casts a soft shadow on what is below.
   `at` is the edge of the paper section it sits on. Seeded, so the server
   and the browser draw the same tear. */
function Tear({ at, seed }: { at: 'top' | 'bottom'; seed: number }) {
  let s = seed * 9973 + 1;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const W = 1600, base = 24;
  const core: [number, number][] = [];
  const ply: [number, number][] = [];
  const skin: [number, number][] = [];
  let bite = 0;
  for (let x = 0; x <= W; x += 3 + r() * 7) {
    // long, uneven waves; fine jitter; now and then a deeper bite where the paper gave way
    const wave = Math.sin(x / 210 + seed) * 6 + Math.sin(x / 67 + seed * 2.3) * 2.6 + Math.sin(x / 23 + seed) * 0.9;
    if (bite <= 0 && r() < 0.025) bite = 40 + r() * 90;
    const b = bite > 0 ? Math.sin((bite / 130) * Math.PI) * 7 : 0;
    bite -= 6;
    const yc = base + wave + b + (r() - 0.5) * 2.6;
    core.push([x, yc]);
    // a second ply tears a little shorter, and the coloured skin shorter again, by varying amounts
    const band = 2.5 + Math.max(0, Math.sin(x / 95 + seed * 3)) * 7 + r() * 2;
    ply.push([x, yc - band * 0.45 - r()]);
    skin.push([x, yc - band - r() * 1.4]);
  }
  core.push([W, base]); ply.push([W, base - 2]); skin.push([W, base - 4]);
  const pts = (a: [number, number][], dy = 0) => a.map(([x, y]) => `${x.toFixed(0)},${(y + dy).toFixed(1)}`).join(' ');
  const poly = (a: [number, number][], dy = 0) => `0,-2 ${pts(a, dy)} ${W},-2`;
  const fibres: string[] = [];
  for (let i = 0; i < 700; i++) {
    const [x, y] = core[Math.floor(r() * core.length)];
    const len = 1.5 + r() * r() * 9;
    const a = Math.PI / 2 + (r() - 0.5) * 2;
    // a fibre bends a little as it leaves the paper
    const mx = Math.cos(a) * len * 0.5, my = Math.sin(a) * len * 0.5;
    fibres.push(`M${x.toFixed(1)} ${(y - 0.8).toFixed(1)}q${(mx + (r() - 0.5) * 1.5).toFixed(1)} ${my.toFixed(1)} ${(Math.cos(a) * len).toFixed(1)} ${(Math.sin(a) * len).toFixed(1)}`);
  }
  const id = `hs-tear-${seed}`;
  return (
    <svg className={`hs-tear is-${at}`} viewBox={`0 -2 ${W} 64`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={`${id}-sh`} x="-5%" y="-50%" width="110%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
        {/* the skin darkens a touch toward the tear, where the paper lifts and curls */}
        <linearGradient id={`${id}-curl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--hs-paper)' }} />
          <stop offset="0.8" style={{ stopColor: 'var(--hs-paper)' }} />
          <stop offset="1" style={{ stopColor: '#cfd6c3' }} />
        </linearGradient>
      </defs>
      {/* the shadow starts below the paper's top, so its blur never shows above the tear */}
      <polygon className="hs-tear-shadow" points={`0,14 ${pts(core, 6)} ${W},14`} filter={`url(#${id}-sh)`} />
      <polygon className="hs-tear-core" points={poly(core)} />
      <path className="hs-tear-fibres" d={fibres.join('')} />
      <polygon className="hs-tear-ply" points={poly(ply)} />
      <polygon points={poly(skin)} fill={`url(#${id}-curl)`} />
      <polyline className="hs-tear-lip" points={pts(skin, -0.6)} />
    </svg>
  );
}

function Sub({ children }: { children: string }) {
  return <p className="hs-sub"><span className="hs-drop">{children[0]}</span>{children.slice(1)}</p>;
}

/* Masonry: photos dealt into columns by height, so each column can drift at
   its own speed. Five on very wide screens, four on desktops, three on tablets, two on phones. */
function useCols() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const pick = () => setCols(innerWidth <= 640 ? 2 : innerWidth <= 1100 ? 3 : innerWidth < 1900 ? 4 : 5);
    pick();
    addEventListener('resize', pick);
    return () => removeEventListener('resize', pick);
  }, []);
  return cols;
}
function deal<T extends { w: number; h: number }>(items: T[], n: number) {
  const cols: T[][] = Array.from({ length: n }, () => []);
  const hs = new Array(n).fill(0);
  for (const it of items) { const k = hs.indexOf(Math.min(...hs)); cols[k].push(it); hs[k] += it.h / it.w; }
  return cols;
}

export default function HomeStory() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<{ scrollTo: (t: number, o?: { duration?: number }) => void } | null>(null);
  const peek = usePeek();
  const cols = useCols();

  /* Skip the opening on the first scroll, key or tap. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const skip = () => { el.classList.add('hs-skip'); off(); };
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const off = () => evs.forEach((e) => window.removeEventListener(e, skip));
    evs.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));
    return off;
  }, []);

  /* The tone under the nav sets the nav and footer colours; the footer's
     height lets the closing scene reach under it. */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('hs-home');
    const toneEls = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    const navIo = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        const dark = (e.target as HTMLElement).dataset.tone === 'dark';
        html.classList.toggle('is-night', dark);
        html.classList.toggle('is-day', !dark);
      }
    }, { rootMargin: '0px 0px -94% 0px' });
    toneEls.forEach((s) => navIo.observe(s));
    const foot = document.querySelector<HTMLElement>('.footer');
    const setFoot = () => { if (foot) html.style.setProperty('--hs-foot', `${foot.offsetHeight}px`); };
    setFoot();
    const ro = foot ? new ResizeObserver(setFoot) : null;
    if (foot) ro!.observe(foot);
    return () => {
      navIo.disconnect(); ro?.disconnect();
      html.classList.remove('hs-home');
      html.style.removeProperty('--hs-foot');
    };
  }, []);

  /* Scroll motion. Nothing here runs with reduced motion. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Still draw the reader, once, settled in its card.
      let gone = false;
      let dispose: (() => void) | undefined;
      const host = el.querySelector<HTMLElement>('.hs-reader-gl');
      if (host) import('./readerScene').then(({ createReaderScene }) => createReaderScene(host, { compact: innerWidth < 760 }))
        .then((s) => { if (gone) return s.dispose(); s.jump(0.97); dispose = s.dispose; host.classList.add('is-ready'); })
        .catch(() => el.classList.add('hs-no-gl'));
      return () => { gone = true; dispose?.(); };
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.11, anchors: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const disposers: (() => void)[] = [];

      const ctx = gsap.context(() => {
        /* ── Start: the name lifts away, then the painting breaks into grain ── */
        const hero = el.querySelector<HTMLElement>('.hs-hero')!;
        const canvas = hero.querySelector<HTMLCanvasElement>('.hs-dissolve')!;
        const art = hero.querySelector<HTMLImageElement>('.hs-art-img')!;
        let fx: import('../../components/dissolve').Dissolve | null = null;
        let dp = 0, fxRaf = 0, heroOn = true;
        const t0 = performance.now();
        // Draw on demand; keep drawing (for the glitter) only while the front is moving and on screen.
        const drawFx = () => {
          fxRaf = 0;
          if (!fx) return;
          fx.draw({ inP: 1, outP: dp, time: (performance.now() - t0) / 1000, focus: [0.5, 0.42] });
          if (dp > 0.001 && dp < 0.999 && heroOn && !document.hidden) fxRaf = requestAnimationFrame(drawFx);
        };
        const requestFx = () => { if (!fxRaf) fxRaf = requestAnimationFrame(drawFx); };
        const startDissolve = async () => {
          const { Dissolve, loadImage } = await import('../../components/dissolve');
          const portrait = innerHeight > innerWidth;
          const img = await loadImage(portrait ? '/images/home/morning-tall.webp' : '/images/home/morning-wide.webp');
          if (cancelled) return;
          fx = Dissolve.create(canvas);
          if (!fx) return;
          fx.setImage(img, img.naturalWidth / img.naturalHeight);
          art.style.opacity = '';
          requestFx();
          heroTl.scrollTrigger?.refresh();
        };
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
            onToggle: (st) => { heroOn = st.isActive; if (heroOn) requestFx(); },
            onUpdate: (st) => {
              dp = Math.min(1, Math.max(0, (st.progress - 0.2) / 0.64));
              hero.classList.toggle('is-dissolving', !!fx && dp > 0);
              if (fx) requestFx();
              else art.style.opacity = String(1 - dp); // without WebGL the painting simply fades
            },
          },
        });
        heroTl.to('.hs-name-wrap', { yPercent: -40, opacity: 0, ease: 'none', duration: 0.3 }, 0)
          .fromTo('.hs-under-inner', { scale: 0.94, opacity: 0.3 }, { scale: 1, opacity: 1, ease: 'none', duration: 0.6 }, 0.3);
        // Build the dissolve after the opening (or on the first scroll), so it never competes with it.
        let started = false;
        const kick = () => { if (started) return; started = true; window.removeEventListener('scroll', kick); startDissolve(); };
        const kickTimer = window.setTimeout(kick, 2600);
        window.addEventListener('scroll', kick, { passive: true });
        const onResize = () => { fx?.resize(); requestFx(); };
        window.addEventListener('resize', onResize);
        disposers.push(() => { clearTimeout(kickTimer); window.removeEventListener('scroll', kick); window.removeEventListener('resize', onResize); cancelAnimationFrame(fxRaf); fx?.destroy(); });

        /* ── Hello ── */
        gsap.fromTo('.hs-said .hs-w', { opacity: 0.16 }, {
          opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: '.hs-said', start: 'top 78%', end: 'bottom 42%', scrub: true },
        });
        gsap.fromTo('.hs-layers-trace', { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: '.hs-layers', start: 'top 80%', end: 'bottom 60%', scrub: true },
        });
        gsap.utils.toArray<HTMLElement>('.hs-layer, .hs-layer-end').forEach((l, i) => {
          gsap.from(l, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', delay: i * 0.06,
            scrollTrigger: { trigger: l, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });

        /* ── OCR Reader ── */
        const reader = el.querySelector<HTMLElement>('.hs-reader')!;
        const host = reader.querySelector<HTMLElement>('.hs-reader-gl')!;
        const panels = gsap.utils.toArray<HTMLElement>('.hs-beat');
        const intro = reader.querySelector<HTMLElement>('.hs-reader-intro')!;
        const meters = reader.querySelector<HTMLElement>('.hs-reader-meters')!;
        const card = reader.querySelector<HTMLElement>('.hs-reader-card')!;
        const stage = reader.querySelector<HTMLElement>('.hs-reader-stage')!;
        let scene: import('./readerScene').ReaderScene | null = null;
        let progress = 0;
        const beatSpans = [[0.2, 0.38], [0.44, 0.62], [0.64, 0.8]];
        const paint = (p: number) => {
          scene?.setProgress(p);
          const ramp = (a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
          // the title holds for the first half of its screen, then fades as the board arrives
          const f = ramp(0.08, 0.17);
          intro.style.opacity = String(1 - f);
          intro.style.transform = `translate3d(0, ${(-f * 10).toFixed(2)}vh, 0)`;
          meters.style.opacity = String(1 - ramp(0.06, 0.2));
          meters.style.transform = `translate3d(0, ${(-ramp(0, 0.2) * 14).toFixed(2)}vh, 0) scale(${(1 + ramp(0, 0.2) * 0.06).toFixed(3)})`;
          panels.forEach((el, i) => {
            const [a, b] = beatSpans[i];
            const v = Math.min(ramp(a, a + 0.05), 1 - ramp(b - 0.04, b));
            el.style.opacity = String(v);
            el.style.transform = `translate3d(0, ${((1 - v) * (p < a + 0.05 ? 3 : -3)).toFixed(2)}rem, 0)`;
            el.style.visibility = v > 0.01 ? 'visible' : 'hidden';
          });
          // the scene steps back into a card: eased, so it starts and lands softly
          const c0 = ramp(0.82, 0.94), c = c0 * c0 * (3 - 2 * c0);
          stage.style.setProperty('--k', c.toFixed(4));
          card.style.visibility = c > 0.01 ? 'visible' : 'hidden';
          card.classList.toggle('is-live', c > 0.6);
          reader.style.setProperty('--hs-rp', p.toFixed(4));
        };
        ScrollTrigger.create({
          trigger: reader, start: 'top top', end: 'bottom bottom',
          onUpdate: (st) => { progress = st.progress; paint(progress); },
          onEnter: () => paint(progress), onLeaveBack: () => paint(0),
        });
        paint(0);
        const near = new IntersectionObserver(async ([e]) => {
          if (!e.isIntersecting || scene) return;
          near.disconnect();
          try {
            const { createReaderScene } = await import('./readerScene');
            const s = await createReaderScene(host, { compact: innerWidth < 760 });
            if (cancelled) return s.dispose();
            scene = s; s.jump(progress); host.classList.add('is-ready');
          } catch { el.classList.add('hs-no-gl'); }
        }, { rootMargin: '150% 0px' });
        near.observe(reader);
        const onR = () => scene?.resize();
        window.addEventListener('resize', onR);
        disposers.push(() => { near.disconnect(); window.removeEventListener('resize', onR); scene?.dispose(); });

        /* ── Project June and BeadReader: one pinned scene each. The title
           assembles over the picture; then the whole scene steps back (it
           scales down a little and rounds its corners) as the card's frame
           draws in round it, the picture dims, and the card's poster and
           copy come up. --k carries the eased progress of that change. ── */
        gsap.utils.toArray<HTMLElement>('.hs-fl').forEach((fl) => {
          const photo = fl.querySelector('.hs-fl-photo');
          const chars = fl.querySelectorAll('.hs-fl-title .hs-c');
          const sub = fl.querySelector('.hs-fl-head .hs-sub');
          const tag = fl.querySelector('.hs-fl-head .hs-tag');
          const head = gsap.timeline({ paused: true })
            .from(chars, { yPercent: 60, opacity: 0, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
            .from([tag, sub], { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.2);
          ScrollTrigger.create({ trigger: fl, start: 'top 60%', onEnter: () => head.play(), onLeaveBack: () => head.reverse() });
          const card = fl.querySelector<HTMLElement>('.hs-fl-card')!;
          ScrollTrigger.create({
            trigger: fl, start: 'top top', end: 'bottom bottom',
            onUpdate: (st) => {
              const r = Math.min(1, Math.max(0, (st.progress - 0.3) / 0.4));
              const k = r * r * (3 - 2 * r);
              fl.style.setProperty('--k', k.toFixed(4));
              card.classList.toggle('is-live', k > 0.6);
            },
          });
          if (photo) gsap.fromTo(photo, { scale: 1.12 }, { scale: 1, ease: 'none',
            scrollTrigger: { trigger: fl, start: 'top bottom', end: 'top top', scrub: true } });
        });

        /* ── Rising blocks ── */
        gsap.utils.toArray<HTMLElement>('.hs-rise').forEach((r) => {
          gsap.from(r, { y: 50, opacity: 0, duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: r, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });

        /* ── Projects: cards rise in a wave ── */
        ScrollTrigger.batch('.hs-pc', {
          start: 'top 92%',
          onEnter: (b) => gsap.fromTo(b, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07, overwrite: true }),
          onLeaveBack: (b) => gsap.to(b, { y: 60, opacity: 0, duration: 0.3, overwrite: true }),
        });

        /* ── On the bench: cards tilt up as they rise over the title ── */
        if (SHOW_BENCH) gsap.utils.toArray<HTMLElement>('.hs-card').forEach((c) => {
          gsap.fromTo(c, { rotateX: 14, y: 80, scale: 0.94 }, { rotateX: 0, y: 0, scale: 1, ease: 'none',
            scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 55%', scrub: true } });
        });
        if (SHOW_BENCH) gsap.to('.hs-bench-title', { scale: 0.86, opacity: 0.25, ease: 'none',
          scrollTrigger: { trigger: '.hs-bench', start: 'top top', end: 'bottom bottom', scrub: true } });

        /* ── What I do: tiles open like shutters, pictures drift ── */
        ScrollTrigger.batch('.hs-tile', {
          start: 'top 90%',
          onEnter: (b) => gsap.fromTo(b, { clipPath: 'inset(12% 6% 12% 6% round 22px)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.06, overwrite: true }),
        });
        gsap.utils.toArray<HTMLElement>('.hs-tile-media > img').forEach((im) => {
          if (im.classList.contains('is-contain')) return;
          gsap.fromTo(im, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        /* ── Photos: each column drifts at its own speed ── */
        gsap.utils.toArray<HTMLElement>('.hs-mcol').forEach((c, i, all) => {
          const sp = [-6, 8, -10, 5, -7][i % 5] * (all.length > 2 ? 1 : 0.6);
          gsap.fromTo(c, { yPercent: sp * -0.5 }, { yPercent: sp * 0.5, ease: 'none',
            scrollTrigger: { trigger: '.hs-masonry', start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        /* ── Contact: the sign-off assembles; the field rises at dusk ── */
        gsap.from('.hs-contact-title .hs-c', { yPercent: 100, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.03,
          scrollTrigger: { trigger: '.hs-contact', start: 'top 70%', toggleActions: 'play none none reverse' } });
        gsap.fromTo('.hs-dusk img', { yPercent: -3, scale: 1.04 }, { yPercent: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.hs-contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      }, el);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);
      el.classList.add('hs-motion');

      cleanup = () => {
        window.removeEventListener('load', refresh);
        disposers.forEach((d) => d());
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
        el.classList.remove('hs-motion');
      };
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  // Masonry columns changed: measure the page again.
  useEffect(() => { import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh()); }, [cols]);

  const photoCols = deal(PHOTOS, cols);

  return (
    <div ref={root} className={`hs ${sans.variable} ${serif.variable}`}>
      <main className="hs-main">
        {/* ── Start ── */}
        <section className="hs-hero" id="top" data-tone="art">
          <div className="hs-stage">
            <div className="hs-under">
              <div className="hs-under-inner">
                <p className="hs-under-kicker">Hello.</p>
                <p className="hs-under-line">I’m Braven. Most projects need hardware, software and design, and I like doing all three myself.</p>
              </div>
            </div>
            <div className="hs-art">
              <picture>
                <source media="(orientation: portrait)" srcSet="/images/home/morning-tall.webp" />
                <img className="hs-art-img" src="/images/home/morning-wide.webp" alt="A painted morning: a stone pine on a grassy hill under a sage sky, the sun low on the right" fetchPriority="high" />
              </picture>
              {/* the same painting, soft and bright: it fades as the eye adjusts */}
              <picture className="hs-art-soft" aria-hidden="true">
                <source media="(orientation: portrait)" srcSet="/images/home/morning-tall.webp" />
                <img src="/images/home/morning-wide.webp" alt="" />
              </picture>
              <div className="hs-flare" aria-hidden="true" />
              <canvas className="hs-dissolve" aria-hidden="true" />
            </div>
            <div className="hs-name-wrap">
              <h1 className="hs-name" aria-label="Braven Chiam">
                <GlassWord>Braven</GlassWord>{' '}
                <GlassWord>Chiam</GlassWord>
              </h1>
            </div>
          </div>
        </section>

        {/* ── Hello ── */}
        <section className="hs-paper hs-hello" id="hello" data-tone="paper">
          <div className="hs-wrap">
            <p className="hs-said">
              <Words text="I’m a third-year Electronic and Computer Engineering student at Nanyang Polytechnic. I started by taking apart a broken radio to see how it worked. Now I design circuit boards, write firmware, build web apps and run the homelab they live on." />
            </p>
            <div className="hs-layers">
              <h2 className="hs-layers-h">From the chip to the cloud</h2>
              <div className="hs-layers-row">
                <span className="hs-layers-trace" aria-hidden="true" />
                {LAYERS.map((l) => (
                  <div className="hs-layer" key={l.name}>
                    <span className="hs-layer-pad" aria-hidden="true" />
                    <h3>{l.name}</h3>
                    <p>{l.line}</p>
                  </div>
                ))}
                <span className="hs-layer-end" aria-hidden="true"><i /></span>
              </div>
            </div>
          </div>
          <Tear at="bottom" seed={3} />
        </section>

        <div id="portfolio-items-holder" className="hs-work">
          {/* ── OCR Reader ── */}
          <section className="hs-reader" id="ocr-reader" data-tone="dark" aria-labelledby="hs-reader-h">
            <div className="hs-reader-stage">
              <div className="hs-reader-scene">
                <div className="hs-reader-meters" aria-hidden="true">
                  <img src="/images/waterslop/metersim-key.webp" alt="" loading="lazy" />
                </div>
                <div className="hs-reader-gl" aria-hidden="true">
                  <img className="hs-reader-fallback" src="/images/ocr-reader-flagship.webp" alt="" />
                </div>
              </div>
              <div className="hs-reader-intro">
                <p className="hs-tag">Flagship project</p>
                <h2 id="hs-reader-h" className="hs-reader-title">OCR Reader</h2>
                <Sub>A battery-powered camera that reads a water meter, entirely on the chip.</Sub>
              </div>
              <ol className="hs-beats">
                {READER_BEATS.map((b, i) => (
                  <li className="hs-beat" key={b.title}>
                    <span className="hs-beat-n">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </li>
                ))}
              </ol>
              <div className="hs-reader-card hs-stagecard">
                <FlagCard p={OCR_CARD} onPeek={peek.show} variant="ocr" slot={<span className="hs-fc-slot" />} />
              </div>
              <div className="hs-reader-rail" aria-hidden="true"><span /></div>
            </div>
          </section>

          {/* ── Project June ── */}
          <section className="hs-fl is-june" id="june" data-tone="dark">
            <div className="hs-fl-stage">
              <div className="hs-fl-scene" aria-hidden="true">
                <img className="hs-fl-photo" src="/images/home/june-night.webp" alt="" loading="lazy" />
              </div>
              <div className="hs-fl-head">
                <p className="hs-tag">Highlighted hardware build</p>
                <h2 className="hs-fl-title"><Chars text="Project June" /></h2>
                <Sub>A 5G rover I can drive anywhere there is signal.</Sub>
              </div>
              <div className="hs-fl-card hs-stagecard">
                <FlagCard p={JUNE_CARD} onPeek={peek.show} variant="june" side="left" />
              </div>
            </div>
          </section>

          {/* ── BeadReader ── */}
          <section className="hs-fl is-bead" id="beadreader" data-tone="dark">
            <div className="hs-fl-stage">
              <div className="hs-fl-scene" aria-hidden="true">
                <img className="hs-fl-photo" src="/images/home/beadreader-phones.webp" alt="" loading="lazy" />
              </div>
              <div className="hs-fl-head">
                <p className="hs-tag">Highlighted software build</p>
                <h2 className="hs-fl-title"><Chars text="BeadReader" /></h2>
                <Sub>A private book reader for a few friends.</Sub>
              </div>
              <div className="hs-fl-card hs-stagecard">
                <FlagCard p={BEAD_CARD} onPeek={peek.show} variant="bead" />
              </div>
            </div>
          </section>

          {/* ── Projects ── */}
          <section className="hs-paper hs-projects" id="projects" data-tone="paper">
            <Tear at="top" seed={9} />
            <div className="hs-wrap">
              <div className="hs-chead hs-rise">
                <h2 className="hs-ctitle">More projects</h2>
                <Sub>Open a summary, or read the whole write-up.</Sub>
              </div>
              <ProjectGallery onPeek={peek.show} />
            </div>
          </section>

          {/* ── On the bench: off the page for now (SHOW_BENCH in content.ts) ── */}
          {SHOW_BENCH && (
          <section className="hs-paper hs-bench" id="bench" data-tone="paper">
            <div className="hs-bench-pin">
              <h2 className="hs-bench-title">On the bench</h2>
              <Sub>What I have been building since the last write-up.</Sub>
            </div>
            <div className="hs-cards">
              {BENCH.map((b) => (
                <article className="hs-card" key={b.name}>
                  <p className="hs-card-status">{b.status}</p>
                  <h3>{b.name}</h3>
                  <p>{b.what}</p>
                  <ul className="hs-chips">{b.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                  {b.link && <a className="hs-btn" href={b.link.url} target="_blank" rel="noopener"><IcGitHub /> {b.link.label}</a>}
                </article>
              ))}
            </div>
            <Tear at="bottom" seed={21} />
          </section>
          )}
        </div>

        {/* ── What I do ── */}
        <section className="hs-skills" id="skills" data-tone="dark">
          <div className="hs-wrap">
            <div className="hs-chead hs-rise">
              <h2 className="hs-ctitle">What I do</h2>
              <Sub>Tap a tile for where I used it.</Sub>
            </div>
            <Bento />
          </div>
        </section>

        {/* ── HomeLab: the cloud-and-N mark in ASCII behind the copy ── */}
        <section className="hs-lab" id="homelab" data-tone="dark">
          <AsciiLab />
          <div className="hs-wrap">
            <div className="hs-lab-text">
              <p className="hs-tag">Infrastructure</p>
              <h2 className="hs-ctitle">HomeLab</h2>
              <Sub>Three servers at home that my projects run on.</Sub>
              <p className="hs-lead hs-rise">They hold my photo library and my files, and run the MQTT and TURN servers that Project June and LUMEN use. They run on solar export credits. This site is hosted on Vercel.</p>
              <dl className="hs-facts hs-rise">
                <div><dt>3</dt><dd>servers</dd></div>
                <div><dt>24 TB</dt><dd>usable storage</dd></div>
                <div><dt>38</dt><dd>self-hosted apps</dd></div>
              </dl>
              <div className="hs-btns hs-lab-cta hs-rise"><a className="hs-btn is-primary" href="/homelab"><IcServer /> Explore the HomeLab</a></div>
            </div>
          </div>
        </section>

        {/* ── Photos ── */}
        <section className="hs-photos" id="photos" data-tone="dark" aria-labelledby="hs-photos-h">
          <div className="hs-wrap">
            <div className="hs-chead hs-rise">
              <h2 id="hs-photos-h" className="hs-ctitle">Photography</h2>
              <Sub>Photos from New Zealand, China and Europe.</Sub>
            </div>
          </div>
          <div className="hs-masonry" style={{ '--cols': cols } as CSSProperties}>
            {photoCols.map((col, ci) => (
              <div className="hs-mcol" key={ci}>
                {col.map((p) => (
                  <figure className="hs-mph" key={p.src}>
                    <img src={p.src} alt={`A photo from the ${p.album} album`} loading="lazy" width={p.w} height={p.h} />
                    <figcaption>{p.album}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
          <div className="hs-photos-more"><a className="hs-btn is-primary" href="/photography"><IcPhotos /> See every album</a></div>
        </section>

        {/* ── Contact, at dusk ── */}
        <section className="hs-contact" id="contact" data-tone="dark">
          <div className="hs-dusk" aria-hidden="true">
            <picture>
              <source media="(max-width: 899px)" srcSet="/images/home/dusk-tall.webp" />
              <img src="/images/home/dusk-pano.webp" alt="" loading="lazy" />
            </picture>
          </div>
          <div className="hs-contact-in">
            <h2 className="hs-contact-title" aria-label="Say hello.">
              <span className="hs-ct-w" aria-hidden="true"><Chars text="Say" /></span>{' '}
              <span className="hs-ct-w" aria-hidden="true"><Chars text="hello." /></span>
            </h2>
            <p className="hs-contact-line">Questions about a build, or something you want made? Email me.</p>
            <a className="hs-contact-mail" href="mailto:braven@chiambucket.com">braven@chiambucket.com</a>
            <div className="hs-btns">
              <a className="hs-btn is-primary" href="mailto:braven@chiambucket.com"><IcMail /> Email me</a>
              <a className="hs-btn" href="/contact">All the ways to reach me</a>
            </div>
          </div>
        </section>
      </main>
      {peek.modal}
    </div>
  );
}
