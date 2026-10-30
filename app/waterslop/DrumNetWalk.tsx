'use client';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { DN } from './drumnet-data';
import Story, { useFrame, type Frame } from './Story';

/* DrumNetStory: the DrumNet chapter. Three frames introduce the problem and the
   three-stage pipeline, then one real DrumNet V10 run is played forward one
   operation at a time, from the 800 x 600 capture to the final reading, driven by
   the reader's scrolling. Every map, score and box comes from the same run the
   report figures were drawn from (drumnet-data.ts). Each step draws on one
   1000 x 540 SVG stage so it scales to any width. */

const A = '/images/waterslop/dn/';
const RED = '#ff6666';
const BLUE = '#8da0e8';
const INK = '#e9e0d2';
const MUTED = '#ada496';
const DIM = '#7d766e';
const SUNKEN = '#121110';
const LINE = '#3a3634';

type Strip = { file: string; tile: readonly [number, number]; n: number };

const ramp = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return `rgb(${Math.round(0x12 + (0x7a - 0x12) * c)},${Math.round(0x11 + (0x9b - 0x11) * c)},${Math.round(0x10 + (0xff - 0x10) * c)})`;
};
/* Maps were exported through the same blue ramp; undo it so values are 0..1 again. */
const hexRows = (hex: string, w: number, h: number) => {
  const rows: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      const v = parseInt(hex.substr((y * w + x) * 2, 2), 16);
      row.push(Math.max(0, Math.min(1, (v - 13.2) / 139.3)));
    }
    rows.push(row);
  }
  return rows;
};
const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (p: number, d = 1) => `${(p * 100).toFixed(d)} %`;

/* ── SVG primitives ── */
function Img({ href, x, y, w, h, px, op }: { href: string; x: number; y: number; w: number; h: number; px?: boolean; op?: number }) {
  return <image href={A + href} x={x} y={y} width={w} height={h} preserveAspectRatio="none" style={px ? { imageRendering: 'pixelated' } : undefined} opacity={op} />;
}
function Sprite({ strip, idx, x, y, w, h, px = true }: { strip: Strip; idx: number; x: number; y: number; w: number; h: number; px?: boolean }) {
  const [tw, th] = strip.tile;
  return (
    <svg x={x} y={y} width={w} height={h} viewBox={`${idx * tw} 0 ${tw} ${th}`} preserveAspectRatio="none">
      <image href={A + strip.file} width={tw * strip.n} height={th} preserveAspectRatio="none" style={px ? { imageRendering: 'pixelated' } : undefined} />
    </svg>
  );
}
function Frame({ x, y, w, h, hot }: { x: number; y: number; w: number; h: number; hot?: boolean }) {
  return <rect x={x - 1.5} y={y - 1.5} width={w + 3} height={h + 3} rx={4} fill="none" stroke={hot ? RED : LINE} strokeWidth={hot ? 2 : 1.5} />;
}
function T({ x, y, s, size = 20, c = INK, a = 'middle', w = 500, mono }: { x: number; y: number; s: string; size?: number; c?: string; a?: 'start' | 'middle' | 'end'; w?: number; mono?: boolean }) {
  return <text x={x} y={y} fontSize={size} fill={c} textAnchor={a} fontWeight={w} style={{ fontFamily: mono ? 'ui-monospace, Menlo, monospace' : 'Manrope, Arial, sans-serif' }}>{s}</text>;
}
function Cap({ x, y, title, sub, w = 160 }: { x: number; y: number; title: string; sub?: string; w?: number }) {
  return (
    <>
      <T x={x + w / 2} y={y} s={title} size={19} w={700} />
      {sub && <T x={x + w / 2} y={y + 22} s={sub} size={15} c={MUTED} />}
    </>
  );
}
function Arrow({ x1, x2, y, hot }: { x1: number; x2: number; y: number; hot?: boolean }) {
  const c = hot ? RED : '#78716c';
  return (
    <g stroke={c} strokeWidth={2} fill="none">
      <path d={`M${x1} ${y} H${x2}`} />
      <path d={`M${x2 - 8} ${y - 5} L${x2} ${y} L${x2 - 8} ${y + 5}`} />
    </g>
  );
}
/* A stack of feature maps drawn back to front, like the report figures. */
function Stack({ strip, x, y, w, h, shown = 6, step = 7, count, reveal }: { strip: Strip; x: number; y: number; w: number; h: number; shown?: number; step?: number; count?: number; reveal?: number }) {
  const n = Math.min(shown, strip.n);
  const tiles = [];
  for (let k = n - 1; k >= 0; k--) {
    const tx = x + k * step, ty = y - k * step;
    tiles.push(
      <g key={k}>
        <rect x={tx - 1} y={ty - 1} width={w + 2} height={h + 2} rx={3} fill={SUNKEN} stroke="#45403f" strokeWidth={1} />
        <Sprite strip={strip} idx={k} x={tx} y={ty} w={w} h={h} />
      </g>,
    );
  }
  return (
    <m.g initial={reveal !== undefined ? { opacity: 0, x: -14 } : false} animate={{ opacity: 1, x: 0 }} transition={{ delay: (reveal ?? 0) * 0.28, duration: 0.45 }}>
      {tiles}
      {count !== undefined && <T x={x + w / 2 + ((n - 1) * step) / 2} y={y + h + 24} s={`${count} maps`} size={14} c={DIM} />}
    </m.g>
  );
}
function Grid({ rows, x, y, cell, hi, gap = 0.5, cls }: { rows: number[][]; x: number; y: number; cell: number; hi?: [number, number]; gap?: number; cls?: string }) {
  return (
    <g className={cls}>
      {rows.map((row, r) => row.map((v, c) => <rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell - gap} height={cell - gap} fill={ramp(v)} />))}
      {hi && <rect x={x + hi[1] * cell - 1.5} y={y + hi[0] * cell - 1.5} width={cell + 2} height={cell + 2} fill="none" stroke={RED} strokeWidth={2.5} />}
    </g>
  );
}
function Bars({ vals, x, y, w, h, hi, color = BLUE, base }: { vals: readonly number[]; x: number; y: number; w: number; h: number; hi?: number; color?: string; base?: number }) {
  const lo = base ?? Math.min(...vals), range = Math.max(...vals) - lo || 1;
  const bw = w / vals.length;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={SUNKEN} rx={2} />
      {vals.map((v, i) => {
        const bh = ((v - lo) / range) * (h - 4);
        return <rect key={i} x={x + i * bw + 1} y={y + h - 2 - bh} width={bw - 2} height={bh} fill={i === hi ? RED : color} />;
      })}
    </g>
  );
}
/* Photo with a region drawn in capture pixels (800 x 600 space). */
const Photo = ({ x, y, w, children }: { x: number; y: number; w: number; children?: ReactNode }) => {
  const s = w / 800;
  return (
    <g>
      <Img href="photo.webp" x={x} y={y} w={w} h={w * 0.75} />
      <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
    </g>
  );
};
const Box = ({ b, c, dash, sw = 3 }: { b: readonly number[]; c: string; dash?: boolean; sw?: number }) => (
  <rect x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={dash ? '9 7' : undefined} />
);

/* ── derived data ── */
const SP = DN.spotter;
const RF = DN.refiner;
const P1 = RF.passes[0];
const P2 = RF.passes[1];
const RD = DN.reader;
const VT = DN.vote;
const CT = DN.cut;
const spotStrips = SP.blocks as unknown as Strip[];
const refStrips = P1.blocks as unknown as Strip[];
const rdStrips = RD.blocks as unknown as Strip[];
const featStrip = VT.feats as unknown as Strip;
const cutCells = CT.cells as unknown as Strip;
const cutFeats = CT.feats as unknown as Strip;
const HEAD_NAMES = ['score', 'dx', 'dy', 'w', 'h'];
const headMax = (() => {
  let best: [number, number] = [0, 0], bv = -1e9;
  SP.head[0].forEach((row, r) => row.forEach((v, c) => { if (v > bv) { bv = v; best = [r, c]; } }));
  return best;
})();
const front = hexRows(P1.b4hex[0], 32, 12);
const frontCol = Array.from({ length: 32 }, (_, x) => front.reduce((a, row) => a + row[x], 0) / 12);
const frontRow = front.map((row) => row.reduce((a, b) => a + b, 0) / 32);
const colmean = hexRows(P1.colmeanhex, 32, 32);
const rowmean = hexRows(P1.rowmeanhex, 12, 32);
const c4maps = RD.c4hex.map((h) => hexRows(h, 2, 4));
const softmaxRows = RD.logits.map((l, i) => ({ d: i, l, e: Math.exp(l), p: RD.probs[i] }));
const eSum = softmaxRows.reduce((a, r) => a + r.e, 0);

/* ── steps ── */
type Step = { id: string; stage: string; title: string; caption: string; facts: [string, string][]; draw: (reduced: boolean) => ReactNode };

const STEPS: Step[] = [
  {
    id: 'capture', stage: 'Capture', title: 'One photo from the reader',
    caption: 'The OV2640 captures the meter at 800 × 600 in greyscale, lit by the board’s own LEDs. This is the frame every later stage works from. The reader never transmits it; only the reading leaves the device.',
    facts: [['input', '800 × 600 px'], ['mode', 'SVGA, greyscale, JPEG'], ['meter', 'B17S-000028']],
    draw: () => (
      <g>
        <Frame x={180} y={20} w={640} h={480} />
        <Img href="photo.webp" x={180} y={20} w={640} h={480} />
        <T x={500} y={528} s="800 × 600" size={17} c={MUTED} />
      </g>
    ),
  },
  {
    id: 'thumb', stage: 'Spotter', title: 'Downscale to a thumbnail',
    caption: 'The first step in the DrumNet V10 pipeline is to downscale the 800 × 600 greyscale image from the camera into a 320 × 240 thumbnail, so that the spotter can run inference more quickly.',
    facts: [['thumbnail', '320 × 240'], ['numbers', fmt(320 * 240)]],
    draw: () => (
      <g>
        <Frame x={40} y={90} w={480} h={360} />
        <Img href="photo.webp" x={40} y={90} w={480} h={360} />
        <T x={280} y={478} s="800 × 600" size={16} c={MUTED} />
        <Arrow x1={540} x2={640} y={270} />
        <m.g initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ transformOrigin: '800px 270px' }}>
          <Frame x={672} y={174} w={256} h={192} hot />
          <Img href="thumb.webp" x={672} y={174} w={256} h={192} />
          <T x={800} y={394} s="320 × 240" size={16} c={RED} />
        </m.g>
      </g>
    ),
  },
  {
    id: 'spot-blocks', stage: 'Spotter', title: 'Five blocks shrink the thumbnail to a 10 × 7 grid',
    caption: 'The Spotter (DetNet) is a CNN built for efficiency and rough work, a fast search. It is made up of 5 blocks, each a 3 × 3 convolution, ReLU and 2 × 2 max-pool, that shrink the 320 × 240 thumbnail into a 10 × 7 grid.',
    facts: [['blocks', '5 × (3 × 3 conv, ReLU, 2 × 2 max-pool)'], ['weights', fmt(21085)], ['out', '32 maps · 10 × 7']],
    draw: () => {
      const spec = [[150, 112, 8, 80], [110, 83, 16, 1168], [80, 60, 24, 3480], [60, 45, 32, 6944], [48, 34, 32, 9248]] as const;
      let x = 30;
      const els: ReactNode[] = [];
      els.push(<g key="t"><Frame x={x} y={204} w={130} h={98} /><Img href="thumb.webp" x={x} y={204} w={130} h={98} /><Cap x={x} y={350} w={130} title="thumbnail" sub="320 × 240" /></g>);
      x += 165;
      spec.forEach(([w, h, n, wt], i) => {
        els.push(<Arrow key={`a${i}`} x1={x - 30} x2={x - 6} y={256} />);
        els.push(<Stack key={i} strip={spotStrips[i]} x={x} y={300 - h} w={w} h={h} shown={6} step={7} count={n} reveal={i + 1} />);
        els.push(<g key={`c${i}`}><Cap x={x} y={350} w={w + 28} title={`block ${i + 1}`} sub={`${[320, 160, 80, 40, 20][i] / 2} × ${[240, 120, 60, 30, 15][i] / 2}`} /><T x={x + (w + 28) / 2} y={392} s={`${fmt(wt)} weights`} size={13} c={DIM} /></g>);
        x += w + 28 + 30;
      });
      return <g>{els}</g>;
    },
  },
  {
    id: 'head', stage: 'Spotter', title: 'The head: a score map and four offsets',
    caption: 'A 1 × 1 convolution turns the grid into five 10 × 7 grids: the score (which cell), dy, dx, width and height. The score map is used to find the cell on the map that best corresponds to the centre of the meter’s digit window; the position of that cell is mirrored to the other layers to get the position and size of the Region Of Interest.',
    facts: [['score', `${SP.raw[0].toFixed(2)}, the highest of 70 cells`], ['dx, dy', `${SP.sig[0].toFixed(2)} across · ${SP.sig[1].toFixed(2)} down the cell`], ['w, h', `${SP.size_norm[0].toFixed(2)} · ${SP.size_norm[1].toFixed(2)} of the frame → ${SP.box[2]} × ${SP.box[3]} px`]],
    draw: () => {
      const small = [1, 2, 3, 4];
      const meaning = ['the centre is 42% across the cell', 'the centre is 67% down the cell', 'box width 0.25 of the frame · 201 px', 'box height 0.12 of the frame · 73 px'];
      return (
        <g>
          <Grid rows={SP.head[0] as unknown as number[][]} x={40} y={70} cell={34} hi={headMax} />
          <T x={210} y={48} s="score · 10 × 7" size={17} c={INK} w={700} />
          <T x={210} y={340} s={`chosen cell: raw ${SP.raw[0].toFixed(2)}`} size={15} c={RED} />
          {small.map((k, i) => {
            const gx = 440 + (i % 2) * 150, gy = 60 + Math.floor(i / 2) * 140;
            return (
              <g key={k}>
                <Grid rows={SP.head[k] as unknown as number[][]} x={gx} y={gy} cell={12} hi={headMax} />
                <T x={gx} y={gy + 104} s={HEAD_NAMES[k]} size={15} c={INK} a="start" w={700} />
              </g>
            );
          })}
          {small.map((k, i) => (
            <g key={`r${k}`}>
              <T x={760} y={88 + i * 54} s={HEAD_NAMES[k]} size={15} c={MUTED} a="start" />
              <rect x={790} y={70 + i * 54} width={62} height={28} rx={5} fill="none" stroke="#45403f" />
              <T x={821} y={89 + i * 54} s={SP.raw[k].toFixed(2)} size={14} c={INK} mono />
              <Arrow x1={858} x2={880} y={84 + i * 54} />
              <rect x={886} y={70 + i * 54} width={62} height={28} rx={5} fill="none" stroke={RED} />
              <T x={917} y={89 + i * 54} s={SP.sig[i].toFixed(2)} size={14} c={RED} mono />
            </g>
          ))}
          <T x={760} y={318} s="raw → sigmoid (0 to 1)" size={13} c={DIM} a="start" />
          {meaning.map((s, i) => <T key={i} x={440} y={372 + i * 26} s={`${HEAD_NAMES[i + 1]}: ${s}`} size={15} c={MUTED} a="start" />)}
          <T x={440} y={490} s="w and h are trained 3× and 8× larger than life, then divided back here" size={13} c={DIM} a="start" />
        </g>
      );
    },
  },
  {
    id: 'rough', stage: 'Spotter', title: 'A rough box, then a generous crop',
    caption: 'The ROI is scaled and used to crop the original image. Since DetNet’s work is rough, the crop is typically 1.5× wider and 2.4× taller than the ROI. This allows the refiners to work with a more focused image instead of searching for the window through the whole image. If confidence is low, DetNet retries with an alternative DetNet model.',
    facts: [['selection', `${SP.box[2]} × ${SP.box[3]} px`], ['widened 1.5×', `${SP.wide[2]} px wide`], ['crop', `${Math.round(SP.crop[2])} × ${Math.round(SP.crop[3])} px`]],
    draw: () => (
      <g>
        <Frame x={60} y={30} w={600} h={450} />
        <Photo x={60} y={30} w={600}>
          <Box b={SP.crop} c="#ffffff" dash />
          <Box b={SP.box} c={RED} />
        </Photo>
        <g>
          <rect x={700} y={120} width={22} height={14} fill="none" stroke={RED} strokeWidth={3} />
          <T x={734} y={133} s="the spotter’s selection" size={16} c={INK} a="start" />
          <T x={734} y={155} s={`${SP.box[2]} × ${SP.box[3]} px`} size={14} c={MUTED} a="start" />
          <rect x={700} y={190} width={22} height={14} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="4 3" />
          <T x={734} y={203} s="the refiner’s crop" size={16} c={INK} a="start" />
          <T x={734} y={225} s={`${Math.round(SP.crop[2])} × ${Math.round(SP.crop[3])} px`} size={14} c={MUTED} a="start" />
          <T x={700} y={290} s="cut from the full 800 × 600 frame," size={14} c={MUTED} a="start" />
          <T x={700} y={312} s="not from the thumbnail" size={14} c={MUTED} a="start" />
        </g>
      </g>
    ),
  },
  {
    id: 'crop', stage: 'Refiner', title: 'The refiner sees only the crop',
    caption: 'The crop is converted to grey and resized to 256 × 96. The Refiner network (RefNet) refines the selection of the ROI. Its architecture is like DetNet, but it differs in its heads, and it is much more detailed and computationally intensive.',
    facts: [['crop in', `${Math.round(SP.crop[2])} × ${Math.round(SP.crop[3])} px`], ['resized', '256 × 96 grey'], ['numbers', fmt(256 * 96)]],
    draw: () => (
      <g>
        <Frame x={40} y={150} w={320} h={240} />
        <Photo x={40} y={150} w={320}><Box b={SP.crop} c="#fff" dash sw={4} /></Photo>
        <Arrow x1={385} x2={430} y={270} />
        <m.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ transformOrigin: '700px 270px' }}>
          <Frame x={448} y={176} w={504} h={189} hot />
          <Img href="ref-p1-crop.webp" x={448} y={176} w={504} h={189} />
          <T x={700} y={394} s="256 × 96 grey" size={16} c={RED} />
        </m.g>
      </g>
    ),
  },
  {
    id: 'ref-blocks', stage: 'Refiner', title: 'Four blocks, down to 32 maps of 32 × 12',
    caption: 'RefNet is 4 blocks of 3 × 3 convolution, ReLU and 2 × 2 max-pool operations that turn the 256 × 96 cropped image into 32 maps of 32 × 12 values.',
    facts: [['blocks', '4 × (3 × 3 conv, ReLU, 2 × 2 max-pool on the first three)'], ['weights', fmt(80 + 1168 + 4640 + 9248)], ['out', '32 maps · 32 × 12']],
    draw: () => {
      const spec = [[170, 64, 8, 80, '128 × 48'], [128, 48, 16, 1168, '64 × 24'], [104, 39, 32, 4640, '32 × 12'], [104, 39, 32, 9248, '32 × 12 · no pool']] as const;
      let x = 24;
      const els: ReactNode[] = [];
      els.push(<g key="c"><Frame x={x} y={226} w={160} h={60} /><Img href="ref-p1-crop.webp" x={x} y={226} w={160} h={60} /><Cap x={x} y={350} w={160} title="crop" sub="256 × 96" /></g>);
      x += 196;
      spec.forEach(([w, h, n, wt, dim], i) => {
        els.push(<Arrow key={`a${i}`} x1={x - 30} x2={x - 6} y={256} />);
        els.push(<Stack key={i} strip={refStrips[i]} x={x} y={292 - h} w={w} h={h} shown={6} step={7} count={n} reveal={i + 1} />);
        els.push(<g key={`c${i}`}><Cap x={x} y={350} w={w + 24} title={`block ${i + 1}`} sub={dim} /><T x={x + (w + 24) / 2} y={392} s={`${fmt(wt)} weights`} size={13} c={DIM} /></g>);
        x += w + 24 + 26;
      });
      return <g>{els}</g>;
    },
  },
  {
    id: 'colavg', stage: 'Refiner', title: 'Every column is squashed into one average',
    caption: 'Each column of each map in the 32 × 32 × 12 map block is compressed into an average of each column, which produces a 32 × 32 column average map. Watch one map: its 32 columns of 12 values each collapse into 32 single pixels, one row of the new map. The other 31 maps fill in the other 31 rows.',
    facts: [['in', '32 maps · 32 × 12'], ['per column', '12 values → 1 average'], ['out', 'column average map · 32 × 32']],
    draw: (reduced) => <AverageAnim mode="col" reduced={reduced} />,
  },
  {
    id: 'rowavg', stage: 'Refiner', title: 'And every row, the same way',
    caption: 'Likewise each row of the 32 × 32 × 12 map block is compressed into an average of each row, which produces a 32 × 12 row average map. The column map will find the left and right edges; the row map will find the top and bottom.',
    facts: [['in', '32 maps · 32 × 12'], ['per row', '32 values → 1 average'], ['out', 'row average map · 32 × 12']],
    draw: (reduced) => <AverageAnim mode="row" reduced={reduced} />,
  },
  {
    id: 'heads', stage: 'Refiner', title: 'Four 1 × 1 heads pin the window edges',
    caption: 'The column average map is run through a 1 × 1 convolution block which produces a left score and offset, and a right score and offset. The highest score is used to locate the position on the offset slice; that offset value is used to calculate where that edge is on the map. The same is done for the row average map to get the top and bottom edge of the reader window.',
    facts: [['left', `cell ${P1.edges.left.cell} + ${P1.edges.left.offset.toFixed(2)} → ${pct(P1.edges.left.frac)} across`], ['right', `cell ${P1.edges.right.cell} + ${P1.edges.right.offset.toFixed(2)} → ${pct(P1.edges.right.frac)}`], ['top · bottom', `${pct(P1.edges.top.frac)} · ${pct(P1.edges.bottom.frac)} down`]],
    draw: () => {
      const names = ['left score', 'left offset', 'right score', 'right offset'];
      const e = P1.edges;
      const cw = 504, ch = 189, cx = 448, cy = 300;
      return (
        <g>
          <Grid rows={colmean} x={30} y={30} cell={7} />
          <T x={142} y={272} s="column averages · 32 × 32" size={14} c={MUTED} />
          <Arrow x1={270} x2={310} y={140} />
          <rect x={316} y={118} width={92} height={40} rx={6} fill="none" stroke={RED} strokeWidth={1.5} />
          <T x={362} y={143} s="1 × 1 conv" size={15} c={RED} w={700} />
          <T x={362} y={176} s="32 in, 4 out" size={12} c={DIM} />
          {names.map((nm, i) => (
            <g key={nm}>
              <T x={448} y={44 + i * 58} s={nm} size={13} c={MUTED} a="start" />
              <Bars vals={P1.col_head[i]} x={448} y={50 + i * 58} w={504} h={38} hi={i === 0 ? e.left.cell : i === 2 ? e.right.cell : i === 1 ? e.left.cell : e.right.cell} />
            </g>
          ))}
          <Frame x={cx} y={cy} w={cw} h={ch} />
          <Img href="ref-p1-crop.webp" x={cx} y={cy} w={cw} h={ch} />
          <g stroke={RED} strokeWidth={2.5}>
            <line x1={cx + e.left.frac * cw} x2={cx + e.left.frac * cw} y1={cy} y2={cy + ch} />
            <line x1={cx + e.right.frac * cw} x2={cx + e.right.frac * cw} y1={cy} y2={cy + ch} />
            <line x1={cx} x2={cx + cw} y1={cy + e.top.frac * ch} y2={cy + e.top.frac * ch} strokeDasharray="6 5" />
            <line x1={cx} x2={cx + cw} y1={cy + e.bottom.frac * ch} y2={cy + e.bottom.frac * ch} strokeDasharray="6 5" />
          </g>
          <T x={cx + e.left.frac * cw} y={cy - 8} s="left" size={13} c={RED} />
          <T x={cx + e.right.frac * cw} y={cy - 8} s="right" size={13} c={RED} />
          <T x={cx + cw + 10} y={cy + e.top.frac * ch + 5} s="top" size={13} c={RED} a="start" />
          <T x={cx + cw + 10} y={cy + e.bottom.frac * ch + 5} s="bottom" size={13} c={RED} a="start" />
          <Grid rows={rowmean} x={30} y={330} cell={5.5} />
          <T x={63} y={520} s="row averages" size={13} c={MUTED} />
          <T x={300} y={400} s="the row map goes through" size={13} c={DIM} a="middle" />
          <T x={300} y={420} s="its own 1 × 1 conv" size={13} c={DIM} a="middle" />
          <T x={300} y={440} s="for top and bottom" size={13} c={DIM} a="middle" />
        </g>
      );
    },
  },
  {
    id: 'passes', stage: 'Refiner', title: 'Expand, crop and refine again',
    caption: 'The refiner runs twice. First from the output of the spotter; its generated new ROI is expanded (×1.5 and ×2.4) and passed back into the same refiner for a second refinement run. The pass 2 box is the window handed to the reader.',
    facts: [['spotter', `${SP.wide[2]} × ${SP.wide[3]} px`], ['pass 1', `${P1.box[2]} × ${P1.box[3]} px`], ['pass 2', `${P2.box[2]} × ${P2.box[3]} px → to the reader`]],
    draw: () => {
      const items = [['spotter’s selection', SP.wide, '#ffffff'], ['pass 1 box', P1.box, RED], ['pass 2 box', P2.box, '#8da0e8']] as const;
      return (
        <g>
          {items.map(([label, b, c], i) => {
            const x = 30 + i * 330;
            return (
              <m.g key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}>
                <Frame x={x} y={100} w={300} h={225} />
                <Photo x={x} y={100} w={300}><Box b={b} c={c} sw={5} /></Photo>
                <Cap x={x} y={360} w={300} title={label} sub={`${b[2]} × ${b[3]} px`} />
                {i < 2 && <><Arrow x1={x + 304} x2={x + 356} y={212} /><T x={x + 330} y={238} s="expand" size={12} c={DIM} /><T x={x + 330} y={254} s="& refine" size={12} c={DIM} /></>}
              </m.g>
            );
          })}
          <T x={500} y={470} s="each box is expanded, cropped and refined again, so the window sits in the middle of its crop" size={14} c={DIM} />
        </g>
      );
    },
  },
  {
    id: 'cut', stage: 'Cut', title: 'Cut the window into drums',
    caption: 'The drum layout, for example 4 whole drums and 2 decimal drums (4 + 2), should have been set during setup. The layout is used to evenly slice the ROI into slices of each drum (cell); then each cell is passed to DrumNet to read the digit on the drum. On this meter WindowNet could not find the ROI, so the window here was drawn by hand.',
    facts: [['window', `${CT.bw} × ${CT.bh} px`], ['cells', `${CT.n} · ${CT.cell_shape}`], ['reader cells', 'grey, stretched to full contrast, 32 × 64']],
    draw: () => {
      const s = 3;
      const wx = 30, wy = 90;
      return (
        <g>
          <Frame x={wx} y={wy} w={CT.win_w * s} h={CT.win_h * s} />
          <Img href="cut-win.webp" x={wx} y={wy} w={CT.win_w * s} h={CT.win_h * s} />
          <rect x={wx + CT.box[0] * s} y={wy + CT.box[1] * s} width={CT.box[2] * s} height={CT.box[3] * s} fill="none" stroke={RED} strokeWidth={2} />
          {CT.cuts.slice(1, -1).map((c, i) => (
            <m.line key={i} x1={wx + c * s} x2={wx + c * s} y1={wy + CT.box[1] * s} y2={wy + (CT.box[1] + CT.box[3]) * s} stroke={RED} strokeWidth={1.5} strokeDasharray="4 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
          ))}
          <Cap x={wx} y={wy + CT.win_h * s + 34} w={CT.win_w * s} title="window" sub="cut into 6 equal strips" />
          <Arrow x1={560} x2={600} y={170} />
          {Array.from({ length: 6 }, (_, i) => (
            <m.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.12 }}>
              <Sprite strip={cutCells} idx={i} x={620 + i * 60} y={126} w={52} h={68} px={false} />
            </m.g>
          ))}
          <Cap x={620} y={236} w={352} title="cells" sub="one per drum, as photographed" />
          <Arrow x1={790} x2={790} y={290} />
          {Array.from({ length: 6 }, (_, i) => (
            <m.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 + i * 0.12 }}>
              <Sprite strip={cutFeats} idx={i} x={620 + i * 60} y={318} w={52} h={104} px={false} />
            </m.g>
          ))}
          <Cap x={620} y={460} w={352} title="reader cells" sub="grey, full contrast, 32 × 64" />
        </g>
      );
    },
  },
  {
    id: 'rd-blocks', stage: 'Reader', title: 'A reader turns one cell into 96 tiny maps',
    caption: 'Each reader (206,619 parameters) is a 4-block 3 × 3 convolution, ReLU and max-pool operation that converts the 32 × 64 cell image into 96 feature maps of 2 × 4 (block 4).',
    facts: [['cell', '32 × 64 · 2,048 numbers'], ['blocks', '16 → 48 → 96 → 96 maps'], ['out', '96 maps · 2 × 4']],
    draw: () => {
      const spec = [[64, 128, 16, 160, '16 × 32'], [48, 96, 48, 6960, '8 × 16'], [40, 80, 96, 41568, '4 × 8'], [32, 64, 96, 83040, '2 × 4']] as const;
      let x = 60;
      const els: ReactNode[] = [];
      els.push(<g key="c"><Frame x={x} y={120} w={96} h={192} /><Img href="rd-cellgrey.webp" x={x} y={120} w={96} h={192} /><Cap x={x} y={360} w={96} title="cell" sub="32 × 64" /></g>);
      x += 160;
      spec.forEach(([w, h, n, wt, dim], i) => {
        els.push(<Arrow key={`a${i}`} x1={x - 46} x2={x - 12} y={216} />);
        els.push(<Stack key={i} strip={rdStrips[i]} x={x} y={312 - h} w={w} h={h} shown={8} step={6} count={n} reveal={i + 1} />);
        els.push(<g key={`c${i}`}><Cap x={x} y={360} w={w + 42} title={`block ${i + 1}`} sub={dim} /><T x={x + (w + 42) / 2} y={402} s={`${fmt(wt)} weights`} size={13} c={DIM} /></g>);
        x += w + 42 + 70;
      });
      return <g>{els}</g>;
    },
  },
  {
    id: 'flatten', stage: 'Reader', title: 'Flatten 96 maps into one list of 768',
    caption: 'These 96 feature maps are then flattened by rearranging each 2 × 4 feature map into a 1 × 8 list; it is then combined to form a long list of 768 values.',
    facts: [['maps', '96 · 2 × 4'], ['each map', '→ 1 × 8, row by row'], ['list', '768 numbers']],
    draw: () => {
      const j = RD.j;
      return (
        <g>
          {c4maps.map((mp, i) => {
            const gx = 40 + (i % 16) * 32, gy = 40 + Math.floor(i / 16) * 44;
            return <g key={i}><Grid rows={mp} x={gx} y={gy} cell={9} /> {i === j && <rect x={gx - 2} y={gy - 2} width={22} height={40} fill="none" stroke={RED} strokeWidth={2} />}</g>;
          })}
          <T x={40} y={326} s={`block 4 · 96 maps · map ${j + 1} highlighted`} size={14} c={MUTED} a="start" />
          <m.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <T x={600} y={100} s="row by row" size={14} c={DIM} />
            {c4maps[j].flatMap((row, r) => row.map((v, c) => <rect key={`${r}${c}`} x={560 + (r * 2 + c) * 14} y={110} width={12} height={12} fill={ramp(v)} />))}
            <rect x={558} y={108} width={116} height={16} fill="none" stroke={RED} strokeWidth={1.5} />
            <T x={690} y={122} s={`cells ${j * 8 + 1}–${j * 8 + 8}`} size={13} c={MUTED} a="start" />
          </m.g>
          <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
            {RD.flat.map((v, i) => <rect key={i} x={40 + (i % 128) * 7.2} y={370 + Math.floor(i / 128) * 20} width={6.6} height={18} fill={ramp(v)} />)}
            <rect x={40 + (j * 8 % 128) * 7.2 - 1} y={370 + Math.floor((j * 8) / 128) * 20 - 1} width={8 * 7.2 + 1} height={20} fill="none" stroke={RED} strokeWidth={1.5} />
            <T x={40} y={510} s="one list · 768 numbers" size={14} c={MUTED} a="start" />
          </m.g>
        </g>
      );
    },
  },
  {
    id: 'dense', stage: 'Reader', title: 'The dense layer: 768 numbers become 96 units',
    caption: 'In the dense layer, the weighted sum of the 768 numbers and each of the 96 weights of the dense layer is passed through a ReLU activation function to get 96 values (units). These 96 units are used to compute the reading and roll value.',
    facts: [[`unit ${RD.dense.unit + 1}`, `Σ ${RD.dense.pre > 0 ? '+' : ''}${(RD.dense.pre - RD.dense.off).toFixed(2)} + offset ${RD.dense.off.toFixed(2)} = ${RD.dense.pre.toFixed(2)}`], ['ReLU', `${RD.dense.value.toFixed(2)}`], ['weights', fmt(RD.weights.fc)]],
    draw: () => {
      const d = RD.dense;
      const chip = (x: number, s: string, hot?: boolean) => (<g><rect x={x} y={248} width={92} height={36} rx={6} fill="none" stroke={hot ? RED : '#45403f'} strokeWidth={1.5} /><T x={x + 46} y={272} s={s} size={16} c={hot ? RED : INK} mono /></g>);
      return (
        <g>
          {RD.flat.map((v, i) => <rect key={i} x={40 + (i % 32) * 7} y={160 + Math.floor(i / 32) * 7} width={6.2} height={6.2} fill={ramp(v)} />)}
          <T x={152} y={350} s="768 numbers" size={14} c={MUTED} />
          <T x={290} y={272} s="×" size={22} c={MUTED} />
          <rect x={318} y={244} width={70} height={44} rx={6} fill="#232120" stroke="#45403f" /><T x={353} y={273} s="Wt" size={17} w={700} /><T x={353} y={306} s={`unit ${d.unit + 1}`} size={12} c={DIM} />
          <T x={420} y={262} s="Σ" size={18} c={MUTED} /><Arrow x1={405} x2={445} y={266} />
          {chip(452, `${(d.pre - d.off) > 0 ? '+' : ''}${(d.pre - d.off).toFixed(2)}`)}
          <T x={562} y={272} s="+" size={20} c={MUTED} />
          {chip(580, d.off.toFixed(2))}<T x={626} y={304} s="offset" size={12} c={DIM} />
          <T x={690} y={272} s="=" size={20} c={MUTED} />
          {chip(706, `${d.pre > 0 ? '+' : ''}${d.pre.toFixed(2)}`)}
          <T x={830} y={238} s="ReLU" size={13} c={RED} /><Arrow x1={806} x2={856} y={266} />
          {chip(862, d.value.toFixed(2), true)}
          <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {RD.units.map((v, i) => <rect key={i} x={660 + (i % 12) * 22} y={360 + Math.floor(i / 12) * 22} width={20} height={20} fill={ramp(v / 8)} />)}
            <rect x={660 + (d.unit % 12) * 22 - 1.5} y={360 + Math.floor(d.unit / 12) * 22 - 1.5} width={23} height={23} fill="none" stroke={RED} strokeWidth={2} />
            <T x={792} y={370 + 8 * 22 + 12} s="96 units" size={14} c={MUTED} />
          </m.g>
        </g>
      );
    },
  },
  {
    id: 'digit', stage: 'Reader', title: 'The digit head: ten scores, a softmax, one answer',
    caption: 'To predict the digit in the cell, the weighted sum of each possible class (from 0 to 9) is taken with the 96 units to get a probability distribution of the classes. A SOFTMAX function is applied to normalise the distribution and the class with the highest probability is the selected answer. The confidence value is the probability of the selected class.',
    facts: [['best', `digit ${RD.digit.best} · ${pct(RD.probs[RD.digit.best])}`], ['score for the 7', RD.logits[7].toFixed(2)], ['weights', fmt(RD.weights.digit)]],
    draw: () => {
      const maxE = Math.max(...softmaxRows.map((r) => r.e));
      return (
        <g>
          {RD.units.map((v, i) => <rect key={i} x={40 + (i % 12) * 16} y={60 + Math.floor(i / 12) * 16} width={14} height={14} fill={ramp(v / 8)} />)}
          <T x={136} y={212} s="96 units" size={13} c={MUTED} />
          <T x={250} y={130} s="×  Wt  →  Σ" size={16} c={MUTED} />
          <rect x={330} y={108} width={120} height={36} rx={6} fill="none" stroke={RED} /><T x={390} y={132} s={`${RD.logits[7] > 0 ? '+' : ''}${RD.logits[7].toFixed(2)}`} size={16} c={RED} mono /><T x={390} y={164} s="score for the 7" size={12} c={DIM} />
          {['score', 'e^score', '÷ sum', 'softmax'].map((h, i) => <T key={h} x={[520, 600, 760, 925][i]} y={60} s={h} size={12} c={DIM} a={i === 3 ? 'end' : 'start'} />)}
          {softmaxRows.map((r, i) => {
            const y = 78 + i * 42, hot = i === RD.digit.best;
            return (
              <m.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
                <T x={490} y={y + 18} s={String(i)} size={16} c={hot ? RED : INK} w={700} />
                <rect x={508} y={y} width={60} height={26} rx={5} fill="none" stroke={hot ? RED : '#45403f'} /><T x={538} y={y + 18} s={r.l.toFixed(1)} size={13} c={hot ? RED : INK} mono />
                <rect x={600} y={y + 4} width={120} height={18} fill={SUNKEN} rx={2} /><rect x={600} y={y + 4} width={(r.e / maxE) * 120} height={18} fill={hot ? RED : BLUE} rx={2} />
                <T x={728} y={y + 18} s={r.e >= 100 ? fmt(Math.round(r.e)) : r.e.toFixed(2)} size={12} c={MUTED} a="start" />
                <rect x={790} y={y + 4} width={100} height={18} fill={SUNKEN} rx={2} /><rect x={790} y={y + 4} width={(r.e / eSum) * 100} height={18} fill={hot ? RED : BLUE} rx={2} />
                <T x={925} y={y + 18} s={r.p < 0.001 ? '< 0.1 %' : pct(r.p)} size={13} c={hot ? RED : MUTED} a="end" mono />
              </m.g>
            );
          })}
          <T x={140} y={400} s={`digit ${RD.digit.best}`} size={34} w={700} c={RED} />
          <T x={140} y={436} s={pct(RD.probs[RD.digit.best])} size={22} c={INK} mono />
        </g>
      );
    },
  },
  {
    id: 'roll', stage: 'Reader', title: 'The roll head: how far the drum has turned',
    caption: 'To predict the roll value, the weighted sum of the 96 units and the roll weights is taken and then squished with a tanh function to get a roll value between +0.5 and −0.5. The value is used to estimate how far the drum has rolled and in which direction.',
    facts: [['roll score', RD.rollh.score.toFixed(3)], ['tanh', `${RD.rollh.roll > 0 ? '+' : ''}${RD.rollh.roll.toFixed(3)}`], ['weights', fmt(RD.weights.roll)]],
    draw: () => {
      const cx = 640, cy = 270, w = 300, h = 220;
      const pts = Array.from({ length: 61 }, (_, i) => { const x = -3 + i * 0.1; return `${cx + (x / 3) * (w / 2)},${cy - Math.tanh(x) * (h / 2)}`; }).join(' ');
      const px = cx + (RD.rollh.score / 3) * (w / 2), py = cy - Math.tanh(RD.rollh.score) * (h / 2);
      return (
        <g>
          {RD.units.map((v, i) => <rect key={i} x={40 + (i % 12) * 16} y={100 + Math.floor(i / 12) * 16} width={14} height={14} fill={ramp(v / 8)} />)}
          <T x={136} y={252} s="96 units" size={13} c={MUTED} />
          <T x={250} y={180} s="×  Wt  →  Σ" size={16} c={MUTED} />
          <rect x={330} y={158} width={110} height={36} rx={6} fill="none" stroke="#45403f" /><T x={385} y={182} s={`+${RD.rollh.score.toFixed(3)}`} size={15} mono /><T x={385} y={214} s="roll score" size={12} c={DIM} />
          <T x={385} y={262} s="squished with tanh" size={13} c={MUTED} />
          <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={SUNKEN} rx={6} />
          <line x1={cx - w / 2} x2={cx + w / 2} y1={cy} y2={cy} stroke="#45403f" /><line x1={cx} x2={cx} y1={cy - h / 2} y2={cy + h / 2} stroke="#45403f" />
          <polyline points={pts} fill="none" stroke={BLUE} strokeWidth={2.5} />
          <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <line x1={px} x2={px} y1={cy} y2={py} stroke={RED} strokeDasharray="4 3" /><line x1={cx - w / 2} x2={px} y1={py} y2={py} stroke={RED} strokeDasharray="4 3" />
            <circle cx={px} cy={py} r={6} fill={RED} />
          </m.g>
          <T x={cx - w / 2 - 8} y={cy - h / 2 + 6} s="+0.5" size={12} c={DIM} a="end" /><T x={cx - w / 2 - 8} y={cy + h / 2} s="−0.5" size={12} c={DIM} a="end" />
          <T x={cx - w / 2} y={cy + h / 2 + 18} s="−3" size={12} c={DIM} /><T x={cx} y={cy + h / 2 + 18} s="0" size={12} c={DIM} /><T x={cx + w / 2} y={cy + h / 2 + 18} s="+3" size={12} c={DIM} />
          <T x={cx + w / 2 + 70} y={cy + 8} s={`roll ${RD.rollh.roll > 0 ? '+' : ''}${RD.rollh.roll.toFixed(3)}`} size={20} w={700} c={RED} />
        </g>
      );
    },
  },
  {
    id: 'vote', stage: 'Vote', title: 'Three readers vote on every drum',
    caption: 'The DrumNet reader ensemble is a collection of 3 reader networks sharing the same architecture, each trained from a different random starting seed. Each cell is fed into all 3 readers, and the 3 sets of probability values are averaged together; each reader has the same voting power, so the third reader was added as a tie breaker. The new confidence and roll are averaged too.',
    facts: [['drum 6', `7 · ${pct(VT.conf[5])} · roll ${VT.roll[5] > 0 ? '+' : ''}${VT.roll[5].toFixed(3)}`], ['drum 3', `9 · ${pct(VT.conf[2])} · reader 3 outvoted`]],
    draw: () => {
      const drums = [5, 2];
      return (
        <g>
          {drums.map((d, row) => {
            const y0 = 40 + row * 250;
            const mean = VT.ens_probs[d] as readonly number[];
            const mi = mean.indexOf(Math.max(...mean));
            return (
              <g key={d}>
                <Frame x={40} y={y0 + 40} w={60} h={120} /><Sprite strip={featStrip} idx={d} x={40} y={y0 + 40} w={60} h={120} px={false} />
                <T x={70} y={y0 + 182} s={`drum ${d + 1}`} size={13} c={MUTED} />
                {VT.members.map((mb, k) => {
                  const p = mb.probs[d] as readonly number[]; const bi = p.indexOf(Math.max(...p)); const y = y0 + k * 62;
                  return (
                    <m.g key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + k * 0.25 }}>
                      <T x={150} y={y + 36} s={`reader ${k + 1}`} size={13} c={MUTED} a="start" />
                      <Bars vals={p} x={230} y={y + 12} w={200} h={40} hi={bi} base={0} />
                      <T x={446} y={y + 40} s={`${bi} · ${pct(p[bi])}`} size={14} c={bi === mi ? INK : RED} a="start" mono />
                      <T x={446} y={y + 22} s={bi === mi ? `roll ${mb.rolls[d] > 0 ? '+' : ''}${mb.rolls[d].toFixed(3)}` : 'outvoted'} size={11} c={DIM} a="start" />
                    </m.g>
                  );
                })}
                <path d={`M560 ${y0 + 36} L600 ${y0 + 92} L560 ${y0 + 148}`} fill="none" stroke={RED} strokeWidth={1.5} />
                <rect x={606} y={y0 + 74} width={64} height={34} rx={6} fill="none" stroke="#45403f" /><T x={638} y={y0 + 96} s="mean" size={14} />
                <Arrow x1={676} x2={706} y={y0 + 91} />
                <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                  <Bars vals={mean} x={712} y={y0 + 60} w={150} h={62} hi={mi} base={0} />
                  <T x={880} y={y0 + 96} s={`${mi}`} size={30} w={700} c={RED} a="start" />
                  <T x={912} y={y0 + 96} s={pct(VT.conf[d])} size={20} c={RED} a="start" />
                  <T x={880} y={y0 + 120} s={`roll ${VT.roll[d] > 0 ? '+' : ''}${VT.roll[d].toFixed(3)}`} size={12} c={MUTED} a="start" />
                </m.g>
              </g>
            );
          })}
        </g>
      );
    },
  },
  {
    id: 'carry', stage: 'Vote', title: 'The carry rule settles each drum',
    caption: 'The carry rule checks the drum to the right. If it reads 0 or 9, the drum on the left could be in transition and its roll value is acceptable; if the right drum is between 1 and 8, the left drum cannot be in transition, so the roll is negated and the digit is absolute. This catches two drums transitioning together: 79 rolling to 80 could be read as 89, and the rule knows to pick the preceding number instead.',
    facts: [['free', 'right drum on 9 or 0, or the last drum'], ['lock', 'right drum on 1 to 8'], ['result', VT.near.join(' ')]],
    draw: () => (
      <g>
        {VT.near.map((n, i) => {
          const x = 70 + i * 150;
          const last = i === VT.n - 1;
          const right = VT.near[i + 1];
          const free = last || right === 0 || right === 9;
          const roll = VT.roll[i];
          return (
            <m.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}>
              <path d={`M${x + 50} 150 V116 H${x + 130}`} fill="none" stroke={free ? '#e7e4e1' : RED} strokeWidth={2} />
              {!last && <path d={`M${x + 130} 116 V150`} fill="none" stroke={free ? '#e7e4e1' : RED} strokeWidth={2} strokeDasharray="3 3" />}
              <path d={`M${x + 44} 142 L${x + 50} 150 L${x + 56} 142`} fill="none" stroke={free ? '#e7e4e1' : RED} strokeWidth={2} />
              <T x={x + 90} y={104} s={last ? 'free · last drum' : free ? 'free' : 'lock'} size={13} c={free ? '#e7e4e1' : RED} />
              <rect x={x} y={160} width={100} height={150} rx={8} fill={free ? '#e7e4e1' : RED} />
              <rect x={x + 18} y={178} width={64} height={114} rx={4} fill="#121110" />
              <T x={x + 50} y={262} s={String(n)} size={66} w={700} c="#fff" />
              <T x={x + 50} y={340} s={`roll ${roll > 0 ? '+' : ''}${roll.toFixed(3)}`} size={13} c={MUTED} mono />
              <T x={x + 50} y={366} s={free ? `${n} → ${(n + 1) % 10} allowed` : `${n}, absolute`} size={13} c={free ? INK : RED} />
            </m.g>
          );
        })}
        <T x={500} y={450} s="free: the right drum is on 9 or 0, so this drum may be rolling · lock: the right drum sits between 1 and 8, so this drum cannot be rolling" size={13} c={DIM} />
        <T x={500} y={474} s="all six rolls are inside the dead band, so every drum keeps its nearest digit" size={13} c={DIM} />
      </g>
    ),
  },
  {
    id: 'reading', stage: 'Vote', title: 'The reading',
    caption: 'Six settled drums make one reading: 0092.07 cubic metres. The least sure drum sets the confidence of the whole reading. On this unseen meter the lowest drum sits below the 80 % gate, so the firmware would flag it and take the second route, rerunning the full pipeline with WindowNet.',
    facts: [['reading', VT.text], ['lowest drum', `${pct(VT.minconf)} (drum 3)`], ['gate', '80 % → second route']],
    draw: () => (
      <g>
        <Frame x={60} y={150} w={400} h={132} />
        <Img href="vote-window.webp" x={60} y={150} w={400} h={132} />
        {VT.near.map((n, i) => <T key={i} x={60 + 400 * ((CT.cuts[i] + CT.cuts[i + 1]) / 2 / CT.win_w)} y={128} s={String(n)} size={24} w={700} c={i >= VT.dot ? RED : INK} />)}
        {VT.conf.map((c, i) => <T key={i} x={60 + 400 * ((CT.cuts[i] + CT.cuts[i + 1]) / 2 / CT.win_w)} y={312} s={pct(c)} size={11} c={c === VT.minconf ? RED : MUTED} mono />)}
        <Arrow x1={480} x2={520} y={216} />
        <m.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ transformOrigin: '740px 216px' }}>
          <T x={540} y={240} s={VT.text.slice(0, VT.dot)} size={84} w={800} c={INK} a="start" />
          <T x={540 + 190} y={240} s={VT.text.slice(VT.dot)} size={84} w={800} c={RED} a="start" />
          <T x={540} y={276} s="cubic metres · confidence 71.5 %, the least sure of the 6 drums" size={14} c={MUTED} a="start" />
        </m.g>
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <rect x={540} y={360} width={84} height={34} rx={6} fill="none" stroke={RED} /><T x={582} y={383} s={pct(VT.minconf)} size={15} c={RED} mono />
          <T x={640} y={383} s="<" size={18} c={MUTED} />
          <rect x={660} y={360} width={70} height={34} rx={6} fill="none" stroke="#45403f" /><T x={695} y={383} s="80 %" size={15} mono />
          <Arrow x1={742} x2={782} y={377} /><T x={792} y={383} s="second route" size={17} w={700} a="start" />
          <T x={540} y={420} s="lowest drum                   gate" size={11} c={DIM} a="start" />
        </m.g>
      </g>
    ),
  },
];

/* The column / row averaging animation. A column of 12 cells (or a row of 32) is
   drawn as one group and transformed into its single-pixel slot in the average map,
   so you see the squash itself, not a swap of pictures. */
function AverageAnim({ mode, reduced }: { mode: 'col' | 'row'; reduced: boolean }) {
  const c = 13;                           // cell size of the big map
  const mx = 40, my = 120;                // big map origin
  const mapW = 32 * c, mapH = 12 * c;
  const s = mode === 'col' ? 8 : 8;       // cell size of the average map
  const ax = mode === 'col' ? 640 : 700, ay = mode === 'col' ? 100 : 100;
  const n = mode === 'col' ? 32 : 12;
  const targetRow = 0;
  const avg = mode === 'col' ? frontCol : frontRow;
  const other = mode === 'col' ? colmean : rowmean;
  const stepDelay = 0.07, dur = 0.9;
  const total = (n - 1) * stepDelay + dur;
  return (
    <g>
      <g transform={`translate(${mx - 60} ${my - 20}) scale(0.25)`}>{[...Array(10)].map((_, k) => <rect key={k} x={k * 18} y={-k * 18 + 180} width={mapW} height={mapH} rx={6} fill="#1c1a19" stroke="#45403f" strokeWidth={4} />)}</g>
      <T x={mx + 30} y={my - 36} s="block 4 · 32 maps · the front map, 32 × 12" size={14} c={MUTED} a="start" />
      <rect x={mx - 2} y={my - 2} width={mapW + 4} height={mapH + 4} fill={SUNKEN} rx={3} />
      {/* static copy of the map (fades slightly while the groups leave) */}
      {Array.from({ length: n }, (_, i) => {
        const cells = mode === 'col' ? front.map((row, r) => ({ x: mx + i * c, y: my + r * c, v: row[i] })) : front[i].map((v, col) => ({ x: mx + col * c, y: my + i * c, v }));
        const tx = mode === 'col' ? ax + i * s : ax + targetRow * s;
        const ty = mode === 'col' ? ay + targetRow * s : ay + i * s;
        const sx = mode === 'col' ? s / c : s / (32 * c);
        const sy = mode === 'col' ? s / (12 * c) : s / c;
        const ox = mode === 'col' ? mx + i * c : mx;
        const oy = mode === 'col' ? my : my + i * c;
        const style: CSSProperties = reduced ? { transform: `translate(${tx - ox}px, ${ty - oy}px) scale(${sx}, ${sy})` } : { animation: `dn-squash ${dur}s cubic-bezier(.6,.05,.3,1) ${i * stepDelay}s both` };
        return (
          <g key={i} className="dn-col" style={{ ...style, transformOrigin: `${ox}px ${oy}px`, ['--tx' as string]: `${tx - ox}px`, ['--ty' as string]: `${ty - oy}px`, ['--sx' as string]: sx, ['--sy' as string]: sy }}>
            {cells.map((cell, k) => <rect key={k} x={cell.x} y={cell.y} width={c - 0.5} height={c - 0.5} fill={ramp(cell.v)} />)}
          </g>
        );
      })}
      {/* the true average cell appears where each group lands */}
      {avg.map((v, i) => {
        const x = mode === 'col' ? ax + i * s : ax + targetRow * s;
        const y = mode === 'col' ? ay + targetRow * s : ay + i * s;
        return <rect key={i} x={x} y={y} width={s - 0.5} height={s - 0.5} fill={ramp(v)} style={reduced ? undefined : { animation: `dn-appear 0.3s ease ${i * stepDelay + dur - 0.15}s both` }} />;
      })}
      {/* the other 31 maps fill the rest of the average map */}
      <g style={reduced ? undefined : { animation: `dn-appear 0.8s ease ${total + 0.2}s both` }}>
        {mode === 'col'
          ? other.map((row, r) => (r === targetRow ? null : row.map((v, i) => <rect key={`${r}-${i}`} x={ax + i * s} y={ay + r * s} width={s - 0.5} height={s - 0.5} fill={ramp(v)} />)))
          : other.map((row, r) => (r === targetRow ? null : row.map((v, i) => <rect key={`${r}-${i}`} x={ax + r * s} y={ay + i * s} width={s - 0.5} height={s - 0.5} fill={ramp(v)} />)))}
      </g>
      {mode === 'col' ? (
        <>
          <rect x={ax - 3} y={ay - 3} width={32 * s + 6} height={32 * s + 6} rx={3} fill="none" stroke="#45403f" />
          <T x={ax + 16 * s} y={ay + 32 * s + 26} s="column average map · 32 × 32" size={14} c={MUTED} />
          <T x={ax + 16 * s} y={ay + 32 * s + 46} s="one row per map, one pixel per column" size={12} c={DIM} />
          <T x={ax - 10} y={ay + 10} s="map 1" size={11} c={RED} a="end" />
        </>
      ) : (
        <>
          <rect x={ax - 3} y={ay - 3} width={32 * s + 6} height={12 * s + 6} rx={3} fill="none" stroke="#45403f" />
          <T x={ax + 16 * s} y={ay + 12 * s + 26} s="row average map · 32 × 12" size={14} c={MUTED} />
          <T x={ax + 16 * s} y={ay + 12 * s + 46} s="one column per map, one pixel per row" size={12} c={DIM} />
          <T x={ax + 4} y={ay - 10} s="map 1" size={11} c={RED} />
        </>
      )}
      <T x={mx + mapW / 2} y={my + mapH + 30} s={mode === 'col' ? '32 columns · 12 values each' : '12 rows · 32 values each'} size={14} c={MUTED} />
      <Arrow x1={mx + mapW + 40} x2={ax - 40} y={my + mapH / 2} hot />
      <T x={(mx + mapW + ax) / 2} y={my + mapH / 2 - 14} s="average" size={13} c={RED} />
    </g>
  );
}


/* One step's stage. The squash animations restart when the frame becomes active. */
function StepVisual({ step }: { step: Step }) {
  const { active } = useFrame();
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return (
    <LazyMotion features={domAnimation}>
      <div className="ws-wstage dn-stage" style={{ ['--ar' as string]: 1000 / 540 }} data-no-zoom>
        <svg key={active ? 'live' : 'still'} viewBox="0 0 1000 540" className="dn-svg" role="img" aria-label={step.title}>
          {step.draw(reduced || !active)}
        </svg>
        <style>{`
          .dn-svg { display: block; width: 100%; height: auto; aspect-ratio: 1000 / 540; }
          .dn-col { transform-box: view-box; }
          @keyframes dn-squash { from { transform: translate(0,0) scale(1,1); } 55% { transform: translate(0,0) scale(1,1); } to { transform: translate(var(--tx), var(--ty)) scale(var(--sx), var(--sy)); } }
          @keyframes dn-appear { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    </LazyMotion>
  );
}

const I = '/images/waterslop/';
const INTRO: Frame[] = [
  {
    id: 'half-rolled', eyebrow: 'The problem', title: 'Half-rolled drums',
    body: <p>OCR is a relatively solved problem, with plenty of models to choose from. What complicates this application is that water meter drums have an in-between state when transitioning from one value to another, known as half-rolled drums, which makes it significantly harder to guess the true value of that drum.</p>,
    visual: <img src={I + 'half-rolled.webp'} alt="A MeterSim register reading 0000697 where the last drum is caught between a 7 and an 8" className="light" loading="lazy" decoding="async" />,
    pointers: [{ at: [91, 50], label: 'caught between 7 and 8', side: 'l' }],
  },
  {
    id: 'window', eyebrow: 'The problem', title: 'Finding the digit window',
    body: <p>The second hurdle was locating the meter&rsquo;s digit window, then cutting out each digit correctly, before feeding it to the OCR model. DrumNet&rsquo;s architecture is built around solving these two problems step by step.</p>,
    visual: <img src={I + 'windownet-early.webp'} alt="Eight Itron drum-window crops with red outer boxes and green drum splits from an early WindowNet" loading="lazy" decoding="async" />,
    pointers: [{ at: [12, 40], label: 'the window found', side: 'r', to: [20, 12] }, { at: [62, 60], label: 'each drum cut', to: [70, 88] }],
  },
  {
    id: 'arch', eyebrow: 'Network architecture', title: 'Three stages, 693K parameters',
    body: (
      <>
        <p>DrumNet V10 is a 693K-parameter, 3-stage CNN pipeline: the Spotter network, the Edge refiner network and the Reader network. The Spotter and the Refiner are known collectively as WindowNet; its job is to find the location of the drums on the meter and cut them out. The cut-out images are then passed to the reader network, which makes the final prediction.</p>
        <p className="ws-note">WindowNet runs during setup and stores the Region Of Interest; standard readings reuse it. A low-confidence reading reruns DrumNet with WindowNet as a recovery mode.</p>
      </>
    ),
    visual: (
      <div className="ws-trio-v">
        <figure><img src={I + 'dia-spotter.webp'} alt="The DetNet spotter diagram" loading="lazy" decoding="async" /><figcaption>Spotter (DetNet)</figcaption></figure>
        <figure><img src={I + 'dia-refiner.webp'} alt="The RefNet refiner diagram" loading="lazy" decoding="async" /><figcaption>Refiner (RefNet)</figcaption></figure>
        <figure><img src={I + 'dia-reader.webp'} alt="A single DrumNet reader diagram" loading="lazy" decoding="async" /><figcaption>Reader × 3</figcaption></figure>
      </div>
    ),
  },
];

const FRAMES: Frame[] = [
  ...INTRO,
  ...STEPS.map((st, k) => ({
    id: st.id,
    eyebrow: `${st.stage} · step ${k + 1} of ${STEPS.length}`,
    title: st.title,
    body: (
      <>
        <p>{st.caption}</p>
        <div className="ws-facts">{st.facts.map(([a, b]) => <span key={a} className="ws-fact"><b>{a}</b>{b}</span>)}</div>
      </>
    ),
    visual: <StepVisual step={st} />,
  })),
  {
    id: 'summary', eyebrow: 'DrumNet V10', title: 'Where it stands',
    body: <p>The visualisations are from an image of a meter type WindowNet had never seen before. It was therefore unable to correctly identify the ROI; the results are promising and show conceptually how WindowNet works, but the window used from the cut stage onwards was drawn by hand.</p>,
    wide: true,
    visual: (
      <div className="ws-tablewrap">
        <table className="ws-table ws-kv">
          <tbody>
            {[
              ['Parameters', '693K (DrumNet ~620K + WindowNet ~73K)'],
              ['Size on board', '~920 KB (DrumNet 636 KB int8 + WindowNet ~285 KB)'],
              ['Read time', '~2.1 s (with WindowNet)'],
              ['Training data', 'DrumNet reader: 197,204 images. WindowNet: 12,000 simulator photos + ~5,300 real-meter photos'],
              ['Training time (DrumNet only)', '~6 h on an RTX 3080 laptop (fine-tuned from V9b); WindowNet not counted'],
              ['Accuracy: full pipeline', '56 % (808 / 1,440)'],
              ['Accuracy: training fit (DrumNet only)', '99.8 %'],
              ['Accuracy: pooled test set (DrumNet only)', '93.2 % (538 / 577)'],
              ['Accuracy: on board (DrumNet only)', '85.8 %'],
            ].map(([k, v]) => <tr key={k} className={k.startsWith('Accuracy: full') ? 'hl' : undefined}><th scope="row">{k}</th><td>{v}</td></tr>)}
          </tbody>
        </table>
      </div>
    ),
  },
];

export default function DrumNetStory({ chapter }: { chapter: string }) {
  return <Story id="drumnet" chapter={chapter} title="DrumNet" frames={FRAMES} per={0.85} />;
}
