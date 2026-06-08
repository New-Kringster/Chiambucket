'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type InfoItem = {
  icon?: string;
  iconRound?: boolean;
  eyebrow: string;
  title: string;
  blurb: string;
  add?: string;
  points?: string[];
  chips?: string[];
  link?: { label: string; url: string };
};

/* Lightweight, theme-aware detail modal shared by the homepage capability cards
   and the photography tool cards. Accent colours follow the page's data-theme
   via the --hp-* tokens. CSS-only enter/exit (no framer dependency on these pages). */
export default function InfoModal({ item, onClose }: { item: InfoItem | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<InfoItem | null>(null);
  const closeT = useRef<number | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  // Keep the last item mounted through the exit animation
  useEffect(() => {
    if (item) {
      window.clearTimeout(closeT.current);
      setData(item);
      requestAnimationFrame(() => setOpen(true));
    } else {
      setOpen(false);
      closeT.current = window.setTimeout(() => setData(null), 260);
    }
  }, [item]);

  // ESC + scroll lock while open
  useEffect(() => {
    if (!data) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [data, onClose]);

  if (!mounted || !data) return null;

  return createPortal(
    <div className={`im-scrim${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label={data.title} onClick={onClose}>
      <div className="im-panel" onClick={(e) => e.stopPropagation()}>
        <button className="im-x" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        {data.icon && <span className={`im-icon${data.iconRound ? ' round' : ''}`}><img src={data.icon} alt="" /></span>}
        <span className="im-eyebrow">{data.eyebrow}</span>
        <h3 className="im-title">{data.title}</h3>
        <p className="im-blurb">{data.blurb}</p>
        {data.add && <p className="im-add">{data.add}</p>}
        {data.points && (
          <ul className="im-points">
            {data.points.map((pt) => (
              <li key={pt}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {pt}
              </li>
            ))}
          </ul>
        )}
        {data.chips && <div className="im-chips">{data.chips.map((c) => <span key={c}>{c}</span>)}</div>}
        {data.link && <a className="hp-btn im-link" href={data.link.url}>{data.link.label}</a>}
      </div>
    </div>,
    document.body,
  );
}
