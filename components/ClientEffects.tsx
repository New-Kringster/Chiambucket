'use client';
import { useEffect } from 'react';

export default function ClientEffects() {
  useEffect(() => {
    // Page loader fade
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

    // Cursor spotlight
    const onMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    };
    document.addEventListener('mousemove', onMouseMove);

    // Nav scroll glow
    const onScroll = () => {
      const holder = document.querySelector('.nav-holder');
      if (holder) holder.classList.toggle('nav-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Scroll reveal
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length > 0) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
