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
            navLinks.forEach((link) => link.classList.remove('article-chapter-selected'));
            const active = document.querySelector(
              `.article-chapter-wrapper a[href="#${entry.target.id}"]`
            );
            if (active) active.classList.add('article-chapter-selected');
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
