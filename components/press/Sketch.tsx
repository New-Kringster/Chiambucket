'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import rough from 'roughjs';
import type { Drawable, Options } from 'roughjs/bin/core';
import type { RoughGenerator } from 'roughjs/bin/generator';

/*
  Pen sketches for the press pages, drawn with rough.js so every line and
  hatch is generated in code. Doodles "boil" (redraw with a new seed a few
  times a second, like hand-drawn animation) only while hovered.
*/

const gen = rough.generator();

const INK = '#1F2338';
const BLUE = '#0078BF';
const PINK = '#FF48B0';
const YELLOW = '#FFE800';

const pen = (o: Options = {}): Options => ({
  stroke: INK, strokeWidth: 1.6, roughness: 1.3, bowing: 1.2, ...o,
});
const hatch = (fill: string, o: Options = {}): Options => pen({
  fill, fillStyle: 'hachure', hachureAngle: -41, hachureGap: 4.6, fillWeight: 1.3, ...o,
});

type Draw = (g: RoughGenerator, seed: number) => Drawable[];

function Paths({ drawables }: { drawables: Drawable[] }) {
  return (
    <>
      {drawables.flatMap((d, i) =>
        gen.toPaths(d).map((p, j) => (
          <path
            key={`${i}-${j}`}
            d={p.d}
            style={{ stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? 'none' }}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )),
      )}
    </>
  );
}

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* A doodle in a fixed viewBox that boils while the pointer is over it. */
export function Doodle({ w, h, draw, className = '', label }: {
  w: number; h: number; draw: Draw; className?: string; label?: string;
}) {
  const [seed, setSeed] = useState(1);
  const timer = useRef<number | undefined>(undefined);
  const drawables = useMemo(() => draw(gen, seed), [draw, seed]);

  const start = () => {
    if (reduce() || timer.current) return;
    timer.current = window.setInterval(() => setSeed((s) => (s % 6) + 1), 130);
  };
  const stop = () => { window.clearInterval(timer.current); timer.current = undefined; };
  useEffect(() => stop, []);

  return (
    <svg
      className={`pr-doodle ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      <Paths drawables={drawables} />
    </svg>
  );
}

/* ── The broken radio that started it all ── */
export const drawRadio: Draw = (g, seed) => {
  const s = (n: number) => seed * 10 + n;
  return [
    g.path('M58 58 C 58 20, 182 20, 182 58', pen({ seed: s(1), strokeWidth: 2 })),
    g.rectangle(22, 56, 200, 112, pen({ seed: s(2), strokeWidth: 2 })),
    g.circle(78, 112, 72, hatch(BLUE, { seed: s(3), hachureGap: 4.2 })),
    g.circle(78, 112, 16, pen({ seed: s(4), fill: INK, fillStyle: 'solid' })),
    g.rectangle(126, 74, 80, 28, pen({ seed: s(5) })),
    g.line(136, 78, 136, 98, pen({ seed: s(6), strokeWidth: 1 })),
    g.line(150, 78, 150, 98, pen({ seed: s(7), strokeWidth: 1 })),
    g.line(164, 78, 164, 98, pen({ seed: s(8), strokeWidth: 1 })),
    g.line(178, 78, 178, 98, pen({ seed: s(9), strokeWidth: 1 })),
    g.line(192, 78, 192, 98, pen({ seed: s(10), strokeWidth: 1 })),
    g.line(158, 72, 170, 104, pen({ seed: s(11), stroke: PINK, strokeWidth: 2.4 })),
    g.circle(146, 136, 24, hatch(PINK, { seed: s(12), fillStyle: 'cross-hatch', hachureGap: 3.6 })),
    g.circle(186, 136, 24, hatch(PINK, { seed: s(13), fillStyle: 'cross-hatch', hachureGap: 3.6 })),
    g.line(204, 58, 238, 8, pen({ seed: s(14), strokeWidth: 1.8 })),
    g.circle(238, 8, 7, pen({ seed: s(15), fill: INK, fillStyle: 'solid' })),
    g.line(40, 168, 36, 180, pen({ seed: s(16), strokeWidth: 2 })),
    g.line(204, 168, 208, 180, pen({ seed: s(17), strokeWidth: 2 })),
    // screws that came out and never went back in
    g.circle(246, 170, 12, pen({ seed: s(18) })),
    g.line(241, 175, 251, 165, pen({ seed: s(19), strokeWidth: 1.2 })),
    g.circle(268, 150, 10, pen({ seed: s(20) })),
    g.line(264, 146, 272, 154, pen({ seed: s(21), strokeWidth: 1.2 })),
    g.path('M232 120 q 8 -8 14 0 t 14 0 t 14 0', pen({ seed: s(22), strokeWidth: 1.4, stroke: BLUE })),
  ];
};

/* ── The homelab: a rack of servers under a sun ── */
export const drawRack: Draw = (g, seed) => {
  const s = (n: number) => seed * 10 + n;
  const units = [0, 1, 2, 3, 4];
  return [
    g.circle(214, 44, 52, hatch(YELLOW, { seed: s(1), stroke: INK, hachureGap: 3.4, fillWeight: 2 })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const a = (k / 8) * Math.PI * 2;
      return g.line(214 + Math.cos(a) * 34, 44 + Math.sin(a) * 34, 214 + Math.cos(a) * 46, 44 + Math.sin(a) * 46,
        pen({ seed: s(2 + k), strokeWidth: 1.6 }));
    }),
    g.rectangle(30, 30, 140, 236, pen({ seed: s(11), strokeWidth: 2.1 })),
    ...units.map((u) => g.rectangle(42, 44 + u * 42, 116, 32,
      u === 1 ? hatch(PINK, { seed: s(12 + u), fillStyle: 'cross-hatch', hachureGap: 4 })
        : u === 3 ? pen({ seed: s(12 + u) })
          : hatch(BLUE, { seed: s(12 + u), hachureAngle: 38, hachureGap: 5 }))),
    ...units.map((u) => g.rectangle(126, 52 + u * 42, 24, 16, pen({ seed: s(20 + u), fill: '#F2EDE3', fillStyle: 'solid', strokeWidth: 1.2 }))),
    g.line(44, 266, 40, 280, pen({ seed: s(30), strokeWidth: 2 })),
    g.line(156, 266, 160, 280, pen({ seed: s(31), strokeWidth: 2 })),
    g.path('M170 240 C 200 244, 206 262, 236 262', pen({ seed: s(32), stroke: BLUE, strokeWidth: 1.6 })),
    g.path('M170 222 C 214 220, 218 250, 252 244', pen({ seed: s(33), stroke: PINK, strokeWidth: 1.6 })),
  ];
};

/* A loose hand-drawn arrow from (x1,y1) curving to (x2,y2). */
export function Arrow({ from, to, bend = 0.35, className = '', w, h, color = INK }: {
  from: [number, number]; to: [number, number]; bend?: number; className?: string; w: number; h: number; color?: string;
}) {
  const paths = useMemo(() => {
    const [x1, y1] = from, [x2, y2] = to;
    const mx = (x1 + x2) / 2 + (y2 - y1) * bend, my = (y1 + y2) / 2 - (x2 - x1) * bend;
    const ang = Math.atan2(y2 - my, x2 - mx);
    const head = 13;
    const o = { stroke: color, strokeWidth: 1.9, roughness: 0.9, bowing: 1.4, seed: 7 };
    return [
      gen.curve([[x1, y1], [mx, my], [x2, y2]], o),
      gen.line(x2, y2, x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45), { ...o, seed: 8 }),
      gen.line(x2, y2, x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45), { ...o, seed: 9 }),
    ];
  }, [from, to, bend, color]);
  return (
    <svg className={`pr-arrow ${className}`} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {paths.flatMap((d, i) => gen.toPaths(d).map((p, j) => (
        <path key={`${i}-${j}`} d={p.d} pathLength={1} style={{ stroke: p.stroke, strokeWidth: p.strokeWidth, fill: 'none' }} strokeLinecap="round" />
      )))}
    </svg>
  );
}

/* Pen hatching that fills its (positioned) parent, used as a drawn shadow. */
export function Hatch({ className = '', gap = 6, angle = -45, color = INK, weight = 1.1, seed = 3 }: {
  className?: string; gap?: number; angle?: number; color?: string; weight?: number; seed?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.clientWidth), h = Math.round(el.clientHeight);
      setSize((s) => (s && Math.abs(s[0] - w) < 3 && Math.abs(s[1] - h) < 3 ? s : [w, h]));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const drawables = useMemo(() => (size ? [gen.rectangle(1, 1, size[0] - 2, size[1] - 2, {
    stroke: 'none', fill: color, fillStyle: 'hachure', hachureAngle: angle, hachureGap: gap,
    fillWeight: weight, roughness: 1.6, seed, disableMultiStrokeFill: true,
  })] : []), [size, gap, angle, color, weight, seed]);
  return (
    <svg ref={ref} className={`pr-hatch ${className}`} aria-hidden="true"
      viewBox={size ? `0 0 ${size[0]} ${size[1]}` : undefined} preserveAspectRatio="none">
      {size && <Paths drawables={drawables} />}
    </svg>
  );
}

/* A wobbly pen outline stretched over its parent (buttons, stamps). */
export function RoughFrame({ className = '', seed = 2, color = INK }: { className?: string; seed?: number; color?: string }) {
  const drawables = useMemo(() => [gen.rectangle(3, 3, 234, 58, {
    stroke: color, strokeWidth: 1.8, roughness: 1.4, bowing: 0.8, seed,
  })], [seed, color]);
  return (
    <svg className={`pr-frame ${className}`} viewBox="0 0 240 64" preserveAspectRatio="none" aria-hidden="true">
      {drawables.flatMap((d, i) => gen.toPaths(d).map((p, j) => (
        <path key={`${i}-${j}`} d={p.d} vectorEffect="non-scaling-stroke"
          style={{ stroke: p.stroke, strokeWidth: p.strokeWidth, fill: 'none' }} strokeLinecap="round" />
      )))}
    </svg>
  );
}
