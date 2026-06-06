'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientEffects() {
  const pathname = usePathname();

  // One-time effects: page loader, cursor spotlight, nav scroll glow
  useEffect(() => {
    const fadeLoader = () => {
      const loader = document.getElementById('loader');
      if (!loader) return;
      loader.style.transition = 'opacity 0.5s';
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    };
    if (document.readyState === 'complete') {
      fadeLoader();
    } else {
      window.addEventListener('load', fadeLoader, { once: true });
    }

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
