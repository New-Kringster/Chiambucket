'use client';
import { useRef, useState, type CSSProperties } from 'react';

/* PairCompare: the report's sheets of real captures beside their SimGen2
   versions, cut into pairs. One pair at a time, the synthetic image laid over
   the real one; drag the divider to reveal either side. The register strip is
   the part that matters, so it is the big one. */

const P = '/images/waterslop/pairs/';
const METERS: Array<[string, number[]]> = [
  ['sgwhite', [1, 2, 3, 4, 5, 6]], ['bmeters', [7, 8, 9]], ['elster', [10, 11, 12]], ['multimag', [13, 14, 15]], ['anchor', [16, 17, 18]], ['gprime', [19, 20, 21]],
];
const PAIRS = METERS.flatMap(([m, ns]) => ns.map((n) => ({ n, meter: m })));

export default function PairCompare() {
  const [i, setI] = useState(15);   // the anchor meter, the real one on the rig
  const [pos, setPos] = useState(0.5);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const p = PAIRS[i];
  const at = (e: React.PointerEvent) => {
    const r = stage.current?.getBoundingClientRect(); if (!r) return;
    setPos(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };
  const style = { '--pos': `${(pos * 100).toFixed(2)}%` } as CSSProperties;
  return (
    <div className="pc" data-no-zoom>
      <div ref={stage} className="pc-stage" style={style}
        onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); at(e); }}
        onPointerMove={(e) => { if (dragging.current) at(e); }}
        onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
        <div className="pc-strip">
          <img src={`${P}p${p.n}-real-strip.webp`} alt={`Real capture of the ${p.meter} register`} draggable={false} />
          <img className="over" src={`${P}p${p.n}-virt-strip.webp`} alt="The same register as SimGen2 generated it" draggable={false} />
        </div>
        <div className="pc-meter">
          <img src={`${P}p${p.n}-real-meter.webp`} alt={`Real capture of the ${p.meter} meter`} draggable={false} />
          <img className="over" src={`${P}p${p.n}-virt-meter.webp`} alt="The same meter as SimGen2 generated it" draggable={false} />
        </div>
        <div className="pc-div" aria-hidden="true"><span /></div>
        <span className="pc-tag l">real</span><span className="pc-tag r">SimGen2</span>
      </div>
      <input className="pc-range" type="range" min={0} max={1000} value={Math.round(pos * 1000)} onChange={(e) => setPos(+e.target.value / 1000)} aria-label="Reveal: left is the real capture, right is SimGen2" />
      <div className="pc-thumbs" role="tablist" aria-label="Pairs">
        {PAIRS.map((q, k) => (
          <button key={q.n} type="button" role="tab" aria-selected={k === i} className={k === i ? 'on' : undefined} onClick={() => setI(k)} title={q.meter}>
            <img src={`${P}p${q.n}-real-strip.webp`} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <style>{`
        .pc { display: flex; flex-direction: column; gap: 10px; width: min(100%, 1100px); }
        .pc-stage { position: relative; display: grid; grid-template-columns: 1fr; gap: 8px; cursor: ew-resize; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
        .pc-strip, .pc-meter { position: relative; border: 1px solid #d8cbb833; border-radius: 4px; overflow: hidden; background: #121110; }
        .pc-strip img, .pc-meter img { display: block; width: 100%; height: auto; }
        .pc-strip { width: 100%; }
        .pc-meter { width: 46%; margin: 0 auto; }
        .pc-stage img.over { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; clip-path: inset(0 0 0 var(--pos)); }
        .pc-div { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 1px; background: #fff0db; pointer-events: none; }
        .pc-div span { position: absolute; top: 50%; left: 50%; width: 30px; height: 30px; border-radius: 50%; background: #fff0db; transform: translate(-50%, -50%); box-shadow: 0 6px 14px -4px #000; }
        .pc-div span::before, .pc-div span::after { content: ''; position: absolute; top: 50%; width: 0; height: 0; border: 5px solid transparent; }
        .pc-div span::before { left: 4px; border-right-color: #28231e; transform: translateY(-50%); border-left: 0; }
        .pc-div span::after { right: 4px; border-left-color: #28231e; transform: translateY(-50%); border-right: 0; }
        .pc-tag { position: absolute; top: 8px; font: 600 10px/1.4 Manrope, Arial, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #fff0db; background: #181716d9; padding: 3px 7px; border-radius: 2px; pointer-events: none; }
        .pc-tag.l { left: 8px; } .pc-tag.r { right: 8px; }
        .pc-range { width: 100%; margin: 0; accent-color: #d8cbb8; height: 18px; }
        .pc-thumbs { display: grid; grid-template-columns: repeat(11, 1fr); gap: 5px; }
        .pc-thumbs button { padding: 0; border: 1px solid #d8cbb833; border-radius: 3px; background: #121110; overflow: hidden; opacity: 0.6; transition: opacity .15s, border-color .15s; aspect-ratio: 140 / 52; }
        .pc-thumbs button img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .pc-thumbs button:hover { opacity: 0.9; }
        .pc-thumbs button.on { opacity: 1; border-color: #fff0db; }
        @media (max-width: 900px) { .pc-thumbs { grid-template-columns: repeat(7, 1fr); } .pc-meter { width: 60%; } }
      `}</style>
    </div>
  );
}
