'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';

/*
  The homelab's scroll engine, the same idea as the homepage's: a tall section
  holds a sticky stage, and how far the page has scrolled through the section
  is its progress, 0 to 1. The progress follows the scroll through a
  critically damped spring, so motion eases in and out instead of jumping with
  the wheel, and it is written to the section as `--p` (CSS reads it) and
  handed to `onProgress` for anything drawn in script. With reduced motion
  the progress jumps straight to 1, and homelab.css unpins the stages and
  shows every one finished.
*/

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 before a, 1 after b, linear between */
export const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const ease = (t: number) => t * t * (3 - 2 * t);

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function follower(apply: (v: number) => void, omega = 9) {
  let v = 0, t = 0, vel = 0, raf = 0, last = 0, dead = false;
  const tick = (now: number) => {
    raf = 0;
    if (dead) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    vel += (-omega * omega * (v - t) - 2 * omega * vel) * dt;
    v += vel * dt;
    if (Math.abs(v - t) < 1e-4 && Math.abs(vel) < 1e-3) { v = t; vel = 0; }
    apply(v);
    if (v !== t) raf = requestAnimationFrame(tick); else last = 0;
  };
  return {
    set: (x: number) => { t = x; if (!raf) raf = requestAnimationFrame(tick); },
    jump: (x: number) => { t = v = x; vel = 0; apply(v); },
    stop: () => { dead = true; cancelAnimationFrame(raf); },
  };
}

/** Progress through a pinned section (see above). */
export function useStage(ref: RefObject<HTMLElement | null>, onProgress?: (p: number) => void) {
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (v: number) => { el.style.setProperty('--p', v.toFixed(4)); cb.current?.(v); };
    const f = follower(apply);
    if (reducedMotion()) { f.jump(1); return () => f.stop(); }
    const target = () => {
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      return run > 0 ? clamp01(-r.top / run) : 1;
    };
    f.jump(target());
    const on = () => f.set(target());
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { f.stop(); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [ref]);
}

/** Whether an element is on screen, so continuous motion only runs while it can be seen. */
export function useOnScreen(ref: RefObject<HTMLElement | null>, margin = '0px') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return on;
}
