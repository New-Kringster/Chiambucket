'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { themeForPath } from '../lib/theme';

export default function ClientEffects() {
  const pathname = usePathname();

  // Keep the per-page accent theme in sync across client-side navigation
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeForPath(pathname));
  }, [pathname]);

  // One-time effects: cursor spotlight, nav scroll glow
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    };
    document.addEventListener('mousemove', onMouseMove);

    const onScroll = () => {
      const holder = document.querySelector('.nav-holder');
      if (holder) holder.classList.toggle('nav-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Scroll reveal — re-runs on every route change so new page elements are observed
  useEffect(() => {
    const revealEls = document.querySelectorAll<Element>('[data-reveal]');
    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
