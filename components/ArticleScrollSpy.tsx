'use client';
import { useEffect } from 'react';

export default function ArticleScrollSpy() {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.article-chapter-wrapper a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const actives = document.querySelectorAll(
              `.article-chapter-wrapper a[href="#${entry.target.id}"]`
            );
            // sections without a rail link (sub-sections of a chapter) keep the current selection
            if (!actives.length) return;
            navLinks.forEach((link) => link.classList.remove('article-chapter-selected'));
            actives.forEach((a) => a.classList.add('article-chapter-selected'));
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return null;
}
