'use client';
/* ────────────────────────────────────────────────────────────────
   The homepage as a scroll story (November 2026, branch task/home-story).

   Chapters, in order (CHAPTERS in content.ts drives the left index):
     Start        entrance: PCB traces fan out of the name, the name
                  assembles, the painted morning fades up inside a frame;
                  scrolling breaks the painting into glittering grain
                  (dissolve.ts) to uncover the first chapter
     Hello        who Braven is, a sentence lit word by word, the layers
     OCR Reader   pinned 3D set piece with the real board and case
     Project June, BeadReader   chapter openers: full-bleed image, a huge
                  title scrolling up over it, a serif line with a drop cap
     On the bench new work from GitHub, cards rising over a pinned title
     Other builds the remaining write-ups as a list
     HomeLab, Photos (a pinned horizontal strip), Contact

   Motion: GSAP ScrollTrigger reads scroll progress; Lenis smooths the wheel.
   Sticky stages do the pinning, so nothing is re-parented. Only transform,
   opacity and filter animate. With prefers-reduced-motion none of this is
   set up and story.css shows every state finished.
   ──────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Figtree, Newsreader } from 'next/font/google';
import { CHAPTERS, LAYERS, READER_BEATS, BENCH, BUILDS, UNWRITTEN, PHOTOS } from './content';
import { fanout, letterDelays } from './traces';
import { IcRead, IcPlay, IcGitHub, IcMail, IcServer, IcPhotos, IcOut } from '../../components/Icons';
import './story.css';

const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '800'], variable: '--hs-sans', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400', '500'], variable: '--hs-serif', display: 'swap' });

const NAME = ['Braven', 'Chiam'];
const DELAYS = letterDelays(NAME.join('').length, 7, 0.55, 0.95);
// Two boards: one for wide screens (name on one line), one for tall ones (two lines).
const WIDE = fanout(1600, 1000, { x0: 250, x1: 1350, y0: 318, y1: 528 }, 18, 11);
const TALL = fanout(400, 860, { x0: 28, x1: 372, y0: 222, y1: 428 }, 8, 23);

function BoardSvg({ b, cls }: { b: typeof WIDE; cls: string }) {
  return (
    <svg className={`hs-traces ${cls}`} viewBox={`0 0 ${b.w} ${b.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {b.traces.map((t, i) => (
        <path key={i} d={t.d} pathLength={1} style={{ '--d': `${t.delay.toFixed(3)}s` } as CSSProperties} />
      ))}
      {b.traces.map((t, i) => (
        <circle key={`v${i}`} cx={t.via[0].toFixed(1)} cy={t.via[1].toFixed(1)} r={4.5} style={{ '--d': `${(t.delay + 0.55).toFixed(3)}s` } as CSSProperties} />
      ))}
      {b.pads.map((p, i) => (
        <rect key={`p${i}`} x={p[0].toFixed(1)} y={p[1].toFixed(1)} width={p[2].toFixed(1)} height={p[3]} />
      ))}
    </svg>
  );
}

/** Words wrapped for word-by-word reveals (no measuring, so it renders on the server). */
function Words({ text, cls = 'hs-w' }: { text: string; cls?: string }) {
  return (
    <>
      {text.split(' ').map((w, i, a) => (
        <span key={i} className={cls}>{w}{i < a.length - 1 ? ' ' : ''}</span>
      ))}
    </>
  );
}

/** Letters wrapped for character reveals; screen readers get the plain text. */
function Chars({ text }: { text: string }) {
  return (
    <span className="hs-chars" aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} className="hs-c" aria-hidden="true" style={{ '--i': i } as CSSProperties}>{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  );
}

/** A torn paper edge. `at` says which edge of the paper section it sits on. */
function Tear({ at, seed }: { at: 'top' | 'bottom'; seed: number }) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [];
  const fib: string[] = [];
  for (let x = 0; x <= 1600; x += 8 + r() * 14) {
    const y = 22 + Math.sin(x / 140 + seed) * 7 + (r() - 0.5) * 16;
    pts.push(`${x.toFixed(0)},${y.toFixed(1)}`);
    fib.push(`${x.toFixed(0)},${(y - 2 - r() * 3).toFixed(1)}`);
  }
  pts.push('1600,22');
  return (
    <svg className={`hs-tear is-${at}`} viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
      <polygon className="hs-tear-fibre" points={`0,60 ${fib.join(' ')} 1600,60`} />
      <polygon className="hs-tear-paper" points={`0,60 ${pts.join(' ')} 1600,60`} />
    </svg>
  );
}

function Sub({ children }: { children: string }) {
  return <p className="hs-sub"><span className="hs-drop">{children[0]}</span>{children.slice(1)}</p>;
}

export default function HomeStory() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('top');
  const [tone, setTone] = useState<'dark' | 'paper' | 'art'>('art');
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<{ scrollTo: (t: number, o?: { duration?: number }) => void } | null>(null);

  /* Skip the entrance on the first scroll, key or tap. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const done = setTimeout(() => el.classList.add('hs-entered'), 3600);
    const skip = () => { el.classList.add('hs-skip', 'hs-entered'); off(); };
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const off = () => evs.forEach((e) => window.removeEventListener(e, skip));
    evs.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));
    return () => { clearTimeout(done); off(); };
  }, []);

  /* Which chapter is under the middle of the screen: drives the index and its colour. */
  useEffect(() => {
    const secs = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const t = e.target as HTMLElement;
        setActive(t.id);
      }
    }, { rootMargin: '-50% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));
    const toneEls = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    // Watch the bottom-left corner of the screen, where the index sits.
    const tio2 = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.tone as 'dark' | 'paper' | 'art');
    }, { rootMargin: '-88% 0px 0px 0px' });
    toneEls.forEach((s) => tio2.observe(s));
    return () => { io.disconnect(); tio2.disconnect(); };
  }, []);

  /* Scroll motion. Nothing here runs with reduced motion. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Still draw the reader, once, finished.
      let gone = false;
      let dispose: (() => void) | undefined;
      const host = el.querySelector<HTMLElement>('.hs-reader-gl');
      if (host) import('./readerScene').then(({ createReaderScene }) => createReaderScene(host, { compact: innerWidth < 760 }))
        .then((s) => { if (gone) return s.dispose(); s.setProgress(0.9); dispose = s.dispose; host.classList.add('is-ready'); })
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
        /* ── Start: the name lifts away, then the painting dissolves ── */
        const hero = el.querySelector<HTMLElement>('.hs-hero')!;
        const canvas = hero.querySelector<HTMLCanvasElement>('.hs-dissolve')!;
        const art = hero.querySelector<HTMLImageElement>('.hs-art-img')!;
        let dissolve: import('./dissolve').Dissolve | null = null;
        const startDissolve = async () => {
          const { createDissolve } = await import('./dissolve');
          const portrait = innerHeight > innerWidth;
          const img = new Image();
          img.src = portrait ? '/images/home/morning-tall.webp' : '/images/home/morning-wide.webp';
          await img.decode();
          if (cancelled) return;
          try { dissolve = createDissolve(canvas, img, portrait ? 0.3 : 0.4); } catch { dissolve = null; }
          if (dissolve) heroTl.scrollTrigger?.refresh();
        };
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true,
            onUpdate: (st) => {
              const p = Math.min(1, Math.max(0, (st.progress - 0.22) / 0.62));
              dissolve?.setProgress(p);
              hero.classList.toggle('is-dissolving', !!dissolve && p > 0);
              // Without WebGL the painting simply fades.
              if (!dissolve) art.style.opacity = String(1 - p);
            },
          },
        });
        heroTl.to('.hs-name-wrap', { yPercent: -60, opacity: 0, ease: 'none', duration: 0.3 }, 0)
          .to('.hs-scroll-cue', { opacity: 0, ease: 'none', duration: 0.1 }, 0)
          .to('.hs-hero .hs-frame', { opacity: 0, ease: 'none', duration: 0.2 }, 0.1)
          .fromTo('.hs-under-inner', { scale: 0.94, opacity: 0.3 }, { scale: 1, opacity: 1, ease: 'none', duration: 0.6 }, 0.3);
        startDissolve();
        disposers.push(() => dissolve?.dispose());
        const onResize = () => dissolve?.resize();
        window.addEventListener('resize', onResize);
        disposers.push(() => window.removeEventListener('resize', onResize));

        /* ── Hello: the sentence lights up word by word ── */
        gsap.fromTo('.hs-said .hs-w', { opacity: 0.16 }, {
          opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: '.hs-said', start: 'top 78%', end: 'bottom 42%', scrub: true },
        });
        gsap.fromTo('.hs-layers-trace', { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: '.hs-layers', start: 'top 80%', end: 'bottom 60%', scrub: true },
        });
        gsap.utils.toArray<HTMLElement>('.hs-layer').forEach((l, i) => {
          gsap.from(l, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', delay: i * 0.06,
            scrollTrigger: { trigger: l, start: 'top 88%', toggleActions: 'play none none reverse' } });
        });

        /* ── OCR Reader: the pinned 3D scene ── */
        const reader = el.querySelector<HTMLElement>('.hs-reader')!;
        const host = reader.querySelector<HTMLElement>('.hs-reader-gl')!;
        const panels = gsap.utils.toArray<HTMLElement>('.hs-beat');
        const intro = reader.querySelector<HTMLElement>('.hs-reader-intro')!;
        const outro = reader.querySelector<HTMLElement>('.hs-reader-outro')!;
        let scene: import('./readerScene').ReaderScene | null = null;
        let progress = 0;
        const beatSpans = [[0.12, 0.34], [0.38, 0.58], [0.6, 0.8]];
        const paint = (p: number) => {
          scene?.setProgress(p);
          const fadeIn = (a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
          intro.style.opacity = String(1 - fadeIn(0.04, 0.12));
          intro.style.transform = `translate3d(0, ${(-fadeIn(0, 0.14) * 18).toFixed(2)}vh, 0)`;
          panels.forEach((el, i) => {
            const [a, b] = beatSpans[i];
            const v = Math.min(fadeIn(a, a + 0.05), 1 - fadeIn(b - 0.04, b));
            el.style.opacity = String(v);
            el.style.transform = `translate3d(0, ${((1 - v) * (p < a + 0.05 ? 3 : -3)).toFixed(2)}rem, 0)`;
            el.style.visibility = v > 0.01 ? 'visible' : 'hidden';
          });
          const o = fadeIn(0.82, 0.88);
          outro.style.opacity = String(o);
          outro.style.transform = `translate3d(0, ${((1 - o) * 3).toFixed(2)}rem, 0)`;
          outro.style.visibility = o > 0.01 ? 'visible' : 'hidden';
          reader.style.setProperty('--hs-rp', p.toFixed(4));
        };
        ScrollTrigger.create({
          trigger: reader, start: 'top top', end: 'bottom bottom',
          onUpdate: (st) => { progress = st.progress; paint(progress); },
          onEnter: () => paint(progress), onLeaveBack: () => paint(0),
        });
        paint(0);
        // Load the models a screen early, so they are in by the time the chapter arrives.
        const near = new IntersectionObserver(async ([e]) => {
          if (!e.isIntersecting || scene) return;
          near.disconnect();
          try {
            const { createReaderScene } = await import('./readerScene');
            const s = await createReaderScene(host, { compact: innerWidth < 760 });
            if (cancelled) return s.dispose();
            scene = s; s.setProgress(progress); host.classList.add('is-ready');
          } catch { el.classList.add('hs-no-gl'); }
        }, { rootMargin: '150% 0px' });
        near.observe(reader);
        const onR = () => scene?.resize();
        window.addEventListener('resize', onR);
        disposers.push(() => { near.disconnect(); window.removeEventListener('resize', onR); scene?.dispose(); });

        /* ── Chapter openers: the picture settles, the title assembles ── */
        gsap.utils.toArray<HTMLElement>('.hs-op').forEach((op) => {
          const img = op.querySelector('.hs-op-media img');
          if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, ease: 'none',
            scrollTrigger: { trigger: op, start: 'top bottom', end: 'top -60%', scrub: true } });
          const chars = op.querySelectorAll('.hs-op-title .hs-c');
          gsap.from(chars, { yPercent: 110, opacity: 0, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.035,
            scrollTrigger: { trigger: op.querySelector('.hs-op-head'), start: 'top 82%', toggleActions: 'play none none reverse' } });
          const sub = op.querySelector('.hs-op-head .hs-sub');
          if (sub) gsap.from(sub, { y: 30, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.25,
            scrollTrigger: { trigger: sub, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });

        /* ── Big statements and facts rise into place ── */
        gsap.utils.toArray<HTMLElement>('.hs-rise').forEach((r) => {
          gsap.from(r, { y: 50, opacity: 0, duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: r, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });

        /* ── On the bench: cards tilt up as they rise over the title ── */
        gsap.utils.toArray<HTMLElement>('.hs-card').forEach((c) => {
          gsap.fromTo(c, { rotateX: 14, y: 80, scale: 0.94 }, { rotateX: 0, y: 0, scale: 1, ease: 'none',
            scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 55%', scrub: true } });
        });
        gsap.to('.hs-bench-title', { scale: 0.86, opacity: 0.25, ease: 'none',
          scrollTrigger: { trigger: '.hs-bench', start: 'top top', end: 'bottom bottom', scrub: true } });

        /* ── Photos: vertical scroll drives a horizontal strip ── */
        const strip = el.querySelector<HTMLElement>('.hs-photos-track')!;
        const photos = el.querySelector<HTMLElement>('.hs-photos')!;
        const setH = () => {
          const extra = Math.max(0, strip.scrollWidth - innerWidth);
          photos.style.setProperty('--hs-strip', `${extra}px`);
        };
        setH();
        gsap.to(strip, { x: () => -Math.max(0, strip.scrollWidth - innerWidth), ease: 'none',
          scrollTrigger: { trigger: photos, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefreshInit: setH } });
        gsap.utils.toArray<HTMLElement>('.hs-photo img').forEach((im) => {
          gsap.fromTo(im, { xPercent: -8 }, { xPercent: 8, ease: 'none',
            scrollTrigger: { trigger: photos, start: 'top top', end: 'bottom bottom', scrub: true } });
        });

        /* ── Contact: the sign-off assembles ── */
        gsap.from('.hs-contact-title .hs-c', { yPercent: 100, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.03,
          scrollTrigger: { trigger: '.hs-contact', start: 'top 70%', toggleActions: 'play none none reverse' } });
      }, el);

      // Images and fonts change heights; measure again once they are in.
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

  /* Other builds: the hovered row's picture follows the pointer (fine pointers only). */
  const onBuildsMove = (e: React.PointerEvent) => {
    const el = previewRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 120}px, 0)`;
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (!t) return;
    const top = id === 'top' ? 0 : t.getBoundingClientRect().top + scrollY;
    if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <div ref={root} className={`hs ${sans.variable} ${serif.variable}`}>
      {/* ── Index ── */}
      <nav className={`hs-index is-${tone}`} aria-label="Chapters on this page">
        <ol>
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className={active === c.id ? 'is-on' : ''}>
              <a href={`#${c.id}`} onClick={go(c.id)} aria-current={active === c.id ? 'true' : undefined}>
                <span className="hs-index-n">{i}</span>{c.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main className="hs-main">
        {/* ── Start ── */}
        <section className="hs-hero" id="top" data-tone="art">
          <div className="hs-stage">
            <div className="hs-under" data-tone="paper">
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
              <canvas className="hs-dissolve" aria-hidden="true" />
            </div>
            <div className="hs-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="hs-cover" aria-hidden="true">
              <BoardSvg b={WIDE} cls="is-wide" />
              <BoardSvg b={TALL} cls="is-tall" />
            </div>
            <div className="hs-name-wrap">
              <h1 className="hs-name" aria-label="Braven Chiam">
                {(() => {
                  let k = 0;
                  return NAME.map((word, wi) => (
                    <span className="hs-name-word" key={wi} aria-hidden="true">
                      {Array.from(word).map((ch, ci) => {
                        const d = DELAYS[k++];
                        return <span key={ci} className="hs-name-ch" style={{ '--d': `${d.toFixed(3)}s` } as CSSProperties}>{ch}</span>;
                      })}
                    </span>
                  ));
                })()}
              </h1>
              <p className="hs-hero-sub"><span className="hs-drop">E</span>lectronics student in Singapore. I design the board, write the firmware and build the app.</p>
            </div>
            <a className="hs-scroll-cue" href="#hello" onClick={go('hello')}>Scroll to begin</a>
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
              </div>
            </div>
          </div>
          <Tear at="bottom" seed={3} />
        </section>

        <div id="portfolio-items-holder" className="hs-work">
          {/* ── OCR Reader ── */}
          <section className="hs-reader" id="ocr-reader" data-tone="dark" aria-labelledby="hs-reader-h">
            <div className="hs-reader-stage">
              <div className="hs-reader-gl" aria-hidden="true">
                <img className="hs-reader-fallback" src="/images/ocr-reader-flagship.webp" alt="" />
              </div>
              <div className="hs-reader-intro">
                <p className="hs-tag">Flagship project</p>
                <h2 id="hs-reader-h" className="hs-reader-title">OCR Reader</h2>
                <Sub>A battery-powered camera that reads a water meter, entirely on the chip.</Sub>
              </div>
              <ol className="hs-beats">
                {READER_BEATS.slice(0, -1).map((b, i) => (
                  <li className="hs-beat" key={b.title}>
                    <span className="hs-beat-n">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </li>
                ))}
              </ol>
              <div className="hs-reader-outro">
                <span className="hs-beat-n">{String(READER_BEATS.length).padStart(2, '0')}</span>
                <h3>{READER_BEATS[READER_BEATS.length - 1].title}</h3>
                <p className="hs-beat-p">{READER_BEATS[READER_BEATS.length - 1].text}</p>
                <p className="hs-reader-sum">The board, the case, the firmware, the network that reads the digits and the simulator its training pictures came from, told chapter by chapter.</p>
                <div className="hs-btns">
                  <a className="hs-btn is-primary" href="/waterslop"><IcRead /> Read the article</a>
                  <a className="hs-btn" href="/downloadable/ocr-reader-report.pdf" target="_blank" rel="noopener"><IcOut /> Open the report</a>
                </div>
              </div>
              <div className="hs-reader-rail" aria-hidden="true"><span /></div>
            </div>
          </section>

          {/* ── Project June ── */}
          <section className="hs-op" id="june" data-tone="dark">
            <div className="hs-op-media">
              <img src="/images/home/june-night.webp" alt="Project June, the rover, lit by its own lamp in a dark room" loading="lazy" />
            </div>
            <div className="hs-op-head">
              <p className="hs-tag">Highlighted hardware build</p>
              <h2 className="hs-op-title"><Chars text="Project June" /></h2>
              <Sub>A 5G rover I can drive anywhere there is signal.</Sub>
            </div>
            <div className="hs-op-body">
              <div className="hs-wrap hs-split">
                <p className="hs-lead hs-rise">Three phones stream the rover’s view to my dashboard over 5G, while its sensors report back what is around it. I built it from concept to first drive in three weeks.</p>
                <dl className="hs-facts hs-rise">
                  <div><dt>3</dt><dd>live video streams</dd></div>
                  <div><dt>5G</dt><dd>cellular link</dd></div>
                  <div><dt>8+</dt><dd>onboard sensors</dd></div>
                  <div><dt>3 weeks</dt><dd>from concept to drive</dd></div>
                </dl>
              </div>
              <div className="hs-wrap hs-btns hs-rise">
                <a className="hs-btn is-primary" href="/project-june"><IcRead /> Read the article</a>
                <a className="hs-btn" href="https://youtu.be/MnkJsx-nwoE?si=kd1n5bYct6dWTcQC" target="_blank" rel="noopener"><IcPlay /> Watch the build</a>
              </div>
            </div>
          </section>

          {/* ── BeadReader ── */}
          <section className="hs-op is-contain" id="beadreader" data-tone="dark">
            <div className="hs-op-media">
              <img src="/images/home/beadreader-phones.webp" alt="BeadReader open on three phones: the sign-in screen, a chapter and the library" loading="lazy" />
            </div>
            <div className="hs-op-head">
              <p className="hs-tag">Highlighted software build</p>
              <h2 className="hs-op-title"><Chars text="BeadReader" /></h2>
              <Sub>A private book reader for a few friends.</Sub>
            </div>
            <div className="hs-op-body">
              <div className="hs-wrap hs-split">
                <p className="hs-lead hs-rise">I publish books in Markdown or as image webtoons, my friends log in with one access code, and the app remembers where each of them stopped. Friends reading the same book see each other live.</p>
                <dl className="hs-facts hs-rise">
                  <div><dt>Live</dt><dd>read-together presence</dd></div>
                  <div><dt>SQL</dt><dd>enforced content gate</dd></div>
                  <div><dt>Offline</dt><dd>works without a connection</dd></div>
                  <div><dt>1 click</dt><dd>to deploy your own</dd></div>
                </dl>
              </div>
              <div className="hs-wrap hs-btns hs-rise">
                <a className="hs-btn is-primary" href="/beadreader"><IcRead /> Read the article</a>
                <a className="hs-btn" href="https://github.com/New-Kringster/BeadReader" target="_blank" rel="noopener"><IcGitHub /> GitHub</a>
              </div>
            </div>
          </section>

          {/* ── On the bench ── */}
          <section className="hs-paper hs-bench" id="bench" data-tone="paper">
            <Tear at="top" seed={9} />
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
          </section>

          {/* ── Other builds ── */}
          <section className="hs-paper hs-builds" id="builds" data-tone="paper" onPointerMove={onBuildsMove}>
            <div className="hs-wrap">
              <h2 className="hs-builds-h hs-rise">Other builds</h2>
              <ul className="hs-build-list" onPointerLeave={() => setPreview(null)}>
                {BUILDS.map((b) => (
                  <li key={b.id} className="hs-rise">
                    <a href={b.href} onPointerEnter={(e) => e.pointerType === 'mouse' && setPreview(b.img)} onFocus={() => setPreview(null)}>
                      <img className="hs-build-thumb" src={b.img} alt="" loading="lazy" />
                      <span className="hs-build-name">{b.name}</span>
                      <span className="hs-build-line">{b.line}</span>
                      <span className="hs-build-kind">{b.kind}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="hs-unwritten hs-rise">Still to write up: {UNWRITTEN.slice(0, -1).join(', ')} and {UNWRITTEN[UNWRITTEN.length - 1]}.</p>
            </div>
            <div ref={previewRef} className={`hs-build-preview${preview ? ' is-on' : ''}`} aria-hidden="true">
              {BUILDS.map((b) => <img key={b.id} src={b.img} alt="" loading="lazy" className={preview === b.img ? 'is-on' : ''} />)}
            </div>
            <Tear at="bottom" seed={21} />
          </section>
        </div>

        {/* ── HomeLab ── */}
        <section className="hs-op is-side" id="homelab" data-tone="dark">
          <div className="hs-op-media">
            <img src="/images/hl-rack-real.jpg" alt="The homelab rack at home, with the servers behind a mesh door" loading="lazy" />
          </div>
          <div className="hs-op-head">
            <p className="hs-tag">Infrastructure</p>
            <h2 className="hs-op-title"><Chars text="HomeLab" /></h2>
            <Sub>Three servers at home that my projects run on.</Sub>
          </div>
          <div className="hs-op-body">
            <div className="hs-wrap hs-split">
              <p className="hs-lead hs-rise">They hold my photo library and my files, and run the MQTT and TURN servers that Project June and LUMEN use. They run on solar export credits. This site is hosted on Vercel.</p>
              <dl className="hs-facts hs-rise">
                <div><dt>3</dt><dd>servers</dd></div>
                <div><dt>24 TB</dt><dd>usable storage</dd></div>
                <div><dt>38</dt><dd>self-hosted apps</dd></div>
              </dl>
            </div>
            <div className="hs-wrap hs-btns hs-rise">
              <a className="hs-btn is-primary" href="/homelab"><IcServer /> Explore the HomeLab</a>
            </div>
          </div>
        </section>

        {/* ── Photos ── */}
        <section className="hs-photos" id="photos" data-tone="dark" aria-labelledby="hs-photos-h">
          <div className="hs-photos-stage">
            <div className="hs-photos-head">
              <h2 id="hs-photos-h" className="hs-photos-title">Photography</h2>
              <Sub>Photos from New Zealand, China and Europe.</Sub>
            </div>
            <div className="hs-photos-track">
              {PHOTOS.map((p) => (
                <figure className="hs-photo" key={p.src} style={{ '--ar': `${p.w} / ${p.h}` } as CSSProperties}>
                  <div className="hs-photo-frame"><img src={p.src} alt={`A photo from the ${p.album} album`} loading="lazy" width={p.w} height={p.h} /></div>
                  <figcaption>{p.album}</figcaption>
                </figure>
              ))}
              <a className="hs-photo-more" href="/photography"><IcPhotos /> See every album</a>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="hs-contact" id="contact" data-tone="dark">
          <div className="hs-wrap">
            <h2 className="hs-contact-title"><Chars text="Say hello." /></h2>
            <p className="hs-contact-line">Questions about a build, or something you want made? Email me.</p>
            <a className="hs-contact-mail" href="mailto:braven@chiambucket.com">braven@chiambucket.com</a>
            <div className="hs-btns">
              <a className="hs-btn is-primary" href="mailto:braven@chiambucket.com"><IcMail /> Email me</a>
              <a className="hs-btn" href="/contact">All the ways to reach me</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
