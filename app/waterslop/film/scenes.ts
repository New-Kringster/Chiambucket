/* The DrumNet film: one world map of the whole V10 architecture, laid out
   like the report's diagram, and a list of scenes that each animate one stage
   as a pure function of their progress p (0 → 1). The camera view of each
   scene is a rectangle of that map. Numbers and maps are the real run's
   (drumnet-data.ts), the same run the report figures were drawn from. */
import { DN } from '../drumnet-data';
import { C, SERIF, MONO, type Ctx, type Env, type Rect, type Strip, type NetBlock, arrow, bars, chip, clamp01, drawNet, ease, easeOut, eyebrow, fmt, frame, grid, hexRows, img, lerp, lerpRect, line, netLayout, norm, pct, ramp, rect, seg, segL, sgn, stack, stackRight, strip1d, tile, txt, lw } from './draw';

export const MAP = { w: 3460, h: 4080 };
export type Scene = { id: string; stage: string; title: string; body: string; dur: number; view: Rect; full?: boolean; draw: (ctx: Ctx, env: Env, p: number) => void };
/* the reader half of the map is a second column; its scenes draw in column-local x */
const RX = 1760;
const right = (f: (ctx: Ctx, env: Env, p: number) => void) => (ctx: Ctx, env: Env, p: number) => { ctx.save(); ctx.translate(RX, 0); f(ctx, env, p); ctx.restore(); };

/* ── data ── */
const SP = DN.spotter, RF = DN.refiner, RD = DN.reader, VT = DN.vote, CT = DN.cut;
type Edge = { cell: number; offset: number; frac: number };
type Pass = { input_box: readonly number[]; region: readonly number[]; crop: string; blocks: unknown; col_head: readonly (readonly number[])[]; row_head: readonly (readonly number[])[]; edges: { left: Edge; right: Edge; top: Edge; bottom: Edge }; box: readonly number[]; b4hex: readonly string[]; colmeanhex: string; rowmeanhex: string };
const P1 = RF.passes[0] as unknown as Pass, P2 = RF.passes[1] as unknown as Pass;
const spotStrips = SP.blocks as unknown as Strip[];
const rdStrips = RD.blocks as unknown as Strip[];
const cutCells = CT.cells as unknown as Strip, cutFeats = CT.feats as unknown as Strip;
const HEAD = (SP.head as unknown as number[][][]).map((m) => { const flat = norm(m.flat()); return m.map((row, r) => row.map((_, c) => flat[r * 10 + c])); });
const CHOSEN: [number, number] = (() => { let best: [number, number] = [0, 0], bv = -1e9; (SP.head[0] as unknown as number[][]).forEach((row, r) => row.forEach((v, c) => { if (v > bv) { bv = v; best = [r, c]; } })); return best; })();
const passData = (P: Pass) => ({
  slices: P.b4hex.map((h) => hexRows(h, 32, 12)),
  col: hexRows(P.colmeanhex, 32, 32),
  row: hexRows(P.rowmeanhex, 12, 32),
  colHead: P.col_head.map((v) => norm(v)),
  rowHead: P.row_head.map((v) => norm(v)),
  strips: P.blocks as unknown as Strip[],
});
const PD1 = passData(P1), PD2 = passData(P2);
const C4 = RD.c4hex.map((h) => hexRows(h, 2, 4));
const FLAT = RD.flat as unknown as number[], UNITS = (RD.units as unknown as number[]).map((v) => v / 8);
const EXP = RD.logits.map((l) => Math.exp(l)), ESUM = EXP.reduce((a, b) => a + b, 0), EMAX = Math.max(...EXP);
const MEMBERS = VT.members as unknown as Array<{ probs: number[][]; rolls: number[] }>;
const ENS = VT.ens_probs as unknown as number[][];

/* ── layout ── */
const PX = 40, PW = 1620;
const PAN = {
  input: { x: PX, y: 0, w: PW, h: 440, title: 'Input', sub: 'one photo from the reader' },
  spotter: { x: PX, y: 520, w: PW, h: 760, title: 'DetNet Spotter', sub: 'a rough box around the digit window' },
  ref1: { x: PX, y: 1360, w: PW, h: 1000, title: 'RefNet Refiner · pass 1', sub: 'pin the four edges inside the rough box' },
  ref2: { x: PX, y: 2440, w: PW, h: 1000, title: 'RefNet Refiner · pass 2', sub: 'expand, crop again, refine again' },
  cut: { x: PX + RX, y: 0, w: PW, h: 360, title: 'Cut into digits', sub: 'one cell per drum' },
  reader1: { x: PX + RX, y: 440, w: PW, h: 1380, title: 'DrumNet Reader 1', sub: 'which digit shows, and how far it has turned' },
  reader2: { x: PX + RX, y: 1900, w: PW, h: 400, title: 'DrumNet Reader 2', sub: 'the same net, a different random start' },
  reader3: { x: PX + RX, y: 2380, w: PW, h: 400, title: 'DrumNet Reader 3', sub: 'the tie breaker' },
  vote: { x: PX + RX, y: 2860, w: PW, h: 1160, title: 'Ensemble vote and reading', sub: 'average, carry rule, reading' },
};
const PHOTO: Rect = { x: 330, y: 50, w: 480, h: 360 };
const THUMB: Rect = { x: 1010, y: 158, w: 192, h: 144 };
const SPOT_NET = netLayout(120, PAN.spotter.y + 40, 280, 160, 120, [
  { strip: spotStrips[0], w: 150, h: 112, n: 8, label: 'block 1', sub: '160 × 120', weights: 80 },
  { strip: spotStrips[1], w: 110, h: 83, n: 16, label: 'block 2', sub: '80 × 60', weights: 1168 },
  { strip: spotStrips[2], w: 80, h: 60, n: 24, label: 'block 3', sub: '40 × 30', weights: 3480 },
  { strip: spotStrips[3], w: 60, h: 45, n: 32, label: 'block 4', sub: '20 × 15', weights: 6944 },
  { strip: spotStrips[4], w: 48, h: 34, n: 32, label: 'block 5', sub: '10 × 7', weights: 9248 },
], 70);
const ISO = { ox: 300, oy: 905, cell: 30, gap: 56, kx: -0.85, ky: 0.58 };
const SPOT_PHOTO: Rect = { x: 1210, y: 900, w: 400, h: 300 };
const refNet = (y0: number, strips: Strip[]) => netLayout(120, y0 + 40, 240, 320, 120, [
  { strip: strips[0], w: 200, h: 75, n: 8, label: 'block 1', sub: '128 × 48', weights: 80 },
  { strip: strips[1], w: 150, h: 56, n: 16, label: 'block 2', sub: '64 × 24', weights: 1168 },
  { strip: strips[2], w: 112, h: 42, n: 32, label: 'block 3', sub: '32 × 12', weights: 4640 },
  { strip: strips[3], w: 112, h: 42, n: 32, label: 'block 4', sub: '32 × 12 · no pool', weights: 9248 },
], 64);
const REF1_NET = refNet(PAN.ref1.y, PD1.strips), REF2_NET = refNet(PAN.ref2.y, PD2.strips);
const CUBE = (y0: number) => ({ x: 120, y: y0 + 372, cell: 10, dx: 3, dy: -2.2 });
const COLMAP = (y0: number) => ({ x: 640, y: y0 + 332, cell: 8 });
const ROWMAP = (y0: number) => ({ x: 1000, y: y0 + 332, cell: 8 });
const CROP = (y0: number): Rect => ({ x: 560, y: y0 + 700, w: 512, h: 192 });
const WIN: Rect = { x: 120, y: PAN.cut.y + 80, w: 492, h: 162 };
const cellAt = (i: number): Rect => ({ x: 760 + i * 96, y: PAN.cut.y + 70, w: 64, h: 128 });
const RD_NET = netLayout(120, PAN.reader1.y + 40, 300, 96, 192, [
  { strip: rdStrips[0], w: 72, h: 144, n: 16, label: 'block 1', sub: '16 × 32', weights: 160 },
  { strip: rdStrips[1], w: 56, h: 112, n: 48, label: 'block 2', sub: '8 × 16', weights: 6960 },
  { strip: rdStrips[2], w: 44, h: 88, n: 96, label: 'block 3', sub: '4 × 8', weights: 41568 },
  { strip: rdStrips[3], w: 36, h: 72, n: 96, label: 'block 4', sub: '2 × 4', weights: 83040 },
], 80);
const FLAT_Y = PAN.reader1.y + 360, DENSE_Y = PAN.reader1.y + 600, DIGIT_Y = PAN.reader1.y + 820, ROLL_Y = PAN.reader1.y + 1160;
const LIST: Rect = { x: 560, y: FLAT_Y + 120, w: 1024, h: 48 };
const D768 = { x: 120, y: DENSE_Y + 30, cell: 6 };
const U96 = { x: 1000, y: DENSE_Y + 30, cell: 18 };
const miniNet = (y0: number, k: number) => netLayout(120, y0 + 40, 220, 64, 128, [
  { strip: rdStrips[0], w: 48, h: 96, n: 16, label: 'block 1', sub: '16 × 32' },
  { strip: rdStrips[1], w: 40, h: 80, n: 48, label: 'block 2', sub: '8 × 16' },
  { strip: rdStrips[2], w: 32, h: 64, n: 96, label: 'block 3', sub: '4 × 8' },
  { strip: rdStrips[3], w: 28, h: 56, n: 96, label: 'block 4', sub: '2 × 4' },
], 48);
const MINI = [miniNet(PAN.reader2.y, 1), miniNet(PAN.reader3.y, 2)];
const VOTE_Y = PAN.vote.y + 40, DRUMS_Y = PAN.vote.y + 380, CARRY_Y = PAN.vote.y + 550, READ_Y = PAN.vote.y + 930;
const drumSlot = (i: number) => ({ x: 170 + i * 240, y: DRUMS_Y + 10 });

/* photo-space (800 × 600) box into a display rect */
const inPhoto = (R: Rect, b: readonly number[]): Rect => ({ x: R.x + (b[0] / 800) * R.w, y: R.y + (b[1] / 600) * R.h, w: (b[2] / 800) * R.w, h: (b[3] / 600) * R.h });
const photoSrc = (b: readonly number[]): Rect => ({ x: b[0], y: b[1], w: b[2], h: b[3] });
const isoPt = (layer: number, r: number, c: number) => ({ x: ISO.ox + (c + 0.5) * ISO.cell + ISO.kx * (r + 0.5) * ISO.cell, y: ISO.oy + layer * ISO.gap + ISO.ky * (r + 0.5) * ISO.cell });

/* ── the skeleton: every panel and the arrows between them ── */
export function skeleton(ctx: Ctx, env: Env) {
  const list = Object.values(PAN);
  list.forEach((p) => {
    // titles stay readable when the whole map is on screen, but never wider than their panel
    const ts = Math.min(Math.max(28, 14 / env.scale), p.w / (p.title.length * 0.64));
    rect(ctx, env, p, { fill: C.panel, stroke: C.line, rad: 14, w: 1.2 });
    txt(ctx, env, p.title, p.x + 36, p.y + 18 + ts, ts, { font: SERIF, c: C.ink });
    if (env.scale > 0.3) {
      ctx.font = `400 ${ts}px ${SERIF}`;
      txt(ctx, env, p.sub, p.x + 36 + ctx.measureText(p.title).width + 18, p.y + 18 + ts, 14, { c: C.muted });
    }
  });
  const chain = (ps: Array<{ x: number; y: number; h: number; w: number }>) => ps.forEach((p, i) => { if (i < ps.length - 1) arrow(ctx, env, p.x + 810, p.y + p.h + 6, p.x + 810, ps[i + 1].y - 8, { c: '#5a5450', w: 2, head: 10 }); });
  chain([PAN.input, PAN.spotter, PAN.ref1, PAN.ref2]);
  chain([PAN.cut, PAN.reader1, PAN.reader2, PAN.reader3, PAN.vote]);
  // the refined window crosses to the second column
  const r2 = PAN.ref2, cut = PAN.cut;
  ctx.save(); ctx.strokeStyle = '#5a5450'; lw(ctx, env, 2); ctx.beginPath();
  ctx.moveTo(r2.x + r2.w + 6, r2.y + r2.h / 2); ctx.lineTo(cut.x - 50, r2.y + r2.h / 2); ctx.lineTo(cut.x - 50, cut.y + cut.h / 2); ctx.stroke(); ctx.restore();
  arrow(ctx, env, cut.x - 50, cut.y + cut.h / 2, cut.x - 8, cut.y + cut.h / 2, { c: '#5a5450', w: 2, head: 10 });
  // the ensemble bracket: the cut feeds all three readers
  line(ctx, env, cut.x + 30, PAN.reader1.y + 200, cut.x + 30, PAN.reader3.y + 150, { c: '#5a5450', w: 2 });
  [PAN.reader1, PAN.reader2, PAN.reader3].forEach((r, k) => arrow(ctx, env, cut.x + 30, r.y + (k === 0 ? 200 : 150), cut.x + 72, r.y + (k === 0 ? 200 : 150), { c: '#5a5450', w: 2 }));
}

/* ── shared pieces ── */
function thumbTile(ctx: Ctx, env: Env, r: Rect, alpha = 1) { frame(ctx, env, r, { alpha }); img(ctx, env, 'thumb.webp', r, { alpha }); }
function cropTile(ctx: Ctx, env: Env, file: string, r: Rect, alpha = 1) { frame(ctx, env, r, { alpha }); img(ctx, env, file, r, { alpha }); }
function cube(ctx: Ctx, env: Env, y0: number, slices: number[][][], from: number, alpha = 1) {
  const k = CUBE(y0);
  for (let s = 31; s >= from; s--) {
    const x = k.x + s * k.dx, y = k.y + s * k.dy;
    if (s === from) { rect(ctx, env, { x: x - 1, y: y - 1, w: 322, h: 122 }, { fill: C.sunken, stroke: '#45403f', rad: 2, alpha }); grid(ctx, env, slices[s], x, y, k.cell, { alpha }); }
    else rect(ctx, env, { x, y, w: 320, h: 120 }, { fill: '#1a1a22', stroke: '#3a3a46', w: 0.8, alpha: alpha * 0.9 });
  }
}
/* a map slice squashed into one row of the column map and one column of the row map */
function squash(ctx: Ctx, env: Env, y0: number, slice: number[][], s: number, t: number) {
  const k = CUBE(y0), cm = COLMAP(y0), rm = ROWMAP(y0);
  const fx = k.x + s * k.dx, fy = k.y + s * k.dy;
  const e = ease(t);
  // to the column map: row s
  ctx.save();
  ctx.translate(lerp(fx, cm.x, e), lerp(fy, cm.y + s * cm.cell, e));
  ctx.scale(lerp(1, cm.cell / k.cell, e), lerp(1, cm.cell / (12 * k.cell), e));
  grid(ctx, env, slice, 0, 0, k.cell, { gap: 0 });
  ctx.restore();
  // to the row map: column s
  ctx.save();
  ctx.translate(lerp(fx, rm.x + s * rm.cell, e), lerp(fy, rm.y, e));
  ctx.scale(lerp(1, rm.cell / (32 * k.cell), e), lerp(1, rm.cell / k.cell, e));
  grid(ctx, env, slice, 0, 0, k.cell, { gap: 0 });
  ctx.restore();
}
function avgMaps(ctx: Ctx, env: Env, y0: number, D: ReturnType<typeof passData>, rowsDone: number, alpha = 1) {
  const cm = COLMAP(y0), rm = ROWMAP(y0);
  rect(ctx, env, { x: cm.x - 3, y: cm.y - 3, w: 32 * cm.cell + 6, h: 32 * cm.cell + 6 }, { stroke: '#45403f', rad: 3, alpha });
  rect(ctx, env, { x: rm.x - 3, y: rm.y - 3, w: 32 * rm.cell + 6, h: 12 * rm.cell + 6 }, { stroke: '#45403f', rad: 3, alpha });
  for (let s = 0; s < rowsDone; s++) {
    strip1d(ctx, env, D.col[s], cm.x, cm.y + s * cm.cell, cm.cell, cm.cell, { alpha });
    strip1d(ctx, env, D.row[s], rm.x + s * rm.cell, rm.y, rm.cell, rm.cell, { vertical: true, alpha });
  }
  txt(ctx, env, 'column averages · 32 × 32', cm.x + 128, cm.y + 32 * cm.cell + 24, 14, { a: 'center', c: C.muted, alpha });
  txt(ctx, env, 'one row per map · 12 values → 1', cm.x + 128, cm.y + 32 * cm.cell + 42, 12, { a: 'center', c: C.dim, alpha });
  txt(ctx, env, 'row averages · 32 × 12', rm.x + 128, rm.y + 12 * rm.cell + 24, 14, { a: 'center', c: C.muted, alpha });
  txt(ctx, env, 'one column per map · 32 values → 1', rm.x + 128, rm.y + 12 * rm.cell + 42, 12, { a: 'center', c: C.dim, alpha });
}
/* the refiner's averaging stage as a function of p */
function refAvg(ctx: Ctx, env: Env, y0: number, D: ReturnType<typeof passData>, p: number) {
  const k = CUBE(y0);
  txt(ctx, env, 'block 4 · 32 maps · 32 × 12', k.x, k.y - 86, 14, { c: C.muted });
  const first = segL(p, 0, 0.32);                       // slice 0, slowly
  const restT = segL(p, 0.32, 0.9);                      // slices 1..31, quickly
  const peeled = p < 0.32 ? 0 : Math.min(32, 1 + Math.floor(restT * 31 + 1e-6));
  const from = Math.min(31, peeled + (first > 0 && peeled === 0 ? 1 : 0));
  cube(ctx, env, y0, D.slices, Math.min(31, peeled === 0 ? (first > 0 ? 1 : 0) : Math.min(32, peeled + 1)));
  avgMaps(ctx, env, y0, D, peeled);
  if (first > 0 && peeled === 0) squash(ctx, env, y0, D.slices[0], 0, first);
  if (peeled > 0 && peeled < 32) { const s = peeled; const lt = (restT * 31) % 1; squash(ctx, env, y0, D.slices[s], s, lt); }
  if (peeled >= 32) avgMaps(ctx, env, y0, D, 32);
  void from;
  if (p < 0.32) { txt(ctx, env, 'map 1 peels off: each of its 32 columns averages to one value', 500, k.y - 40, 13, { c: C.red, alpha: clamp01(first * 3) }); txt(ctx, env, 'and each of its 12 rows to one value', 500, k.y - 22, 13, { c: C.red, alpha: clamp01(first * 3) }); }
  else if (p < 0.9) txt(ctx, env, `map ${Math.min(32, peeled + 1)} of 32`, 500, k.y - 40, 13, { c: C.red });
}
/* the refiner's heads: strips around the crop, the edges found, the box */
function refHeads(ctx: Ctx, env: Env, y0: number, P: Pass, D: ReturnType<typeof passData>, p: number, boxC: string) {
  const cr = CROP(y0), cm = COLMAP(y0), rm = ROWMAP(y0);
  const e = P.edges;
  const a1 = seg(p, 0, 0.2), a2 = seg(p, 0.22, 0.45), a3 = seg(p, 0.5, 0.78), a4 = seg(p, 0.8, 1);
  cropTile(ctx, env, P.crop, cr);
  // the small maps and their 1 × 1 convolutions
  grid(ctx, env, D.col, 120, y0 + 660, 4, { alpha: a1 });
  txt(ctx, env, 'column averages', 184, y0 + 816, 12, { a: 'center', c: C.muted, alpha: a1 });
  strip1d(ctx, env, D.row.map((r) => r[0]), 120, y0 + 850, 4, 4, { alpha: a1 });
  for (let r = 0; r < 12; r++) strip1d(ctx, env, D.row.map((row) => row[r]), 120, y0 + 850 + r * 4, 4, 4, { alpha: a1 });
  txt(ctx, env, 'row averages', 184, y0 + 920, 12, { a: 'center', c: C.muted, alpha: a1 });
  [y0 + 700, y0 + 866].forEach((cy, i) => {
    arrow(ctx, env, 260, cy, 300, cy, { alpha: a1 });
    rect(ctx, env, { x: 306, y: cy - 16, w: 92, h: 32 }, { stroke: C.red, rad: 6, w: 1.4, alpha: a1 });
    txt(ctx, env, '1 × 1 conv', 352, cy + 5, 13, { a: 'center', c: C.red, w: 700, alpha: a1 });
    txt(ctx, env, '32 in, 4 out', 306, cy + 34, 11, { c: C.dim, alpha: a1 });
    txt(ctx, env, i === 0 ? 'same weights for every column' : 'same weights for every row', 306, cy + 48, 11, { c: C.dim, alpha: a1 });
  });
  // strips: left score/offset above, right score/offset below, top left, bottom right
  const cw = cr.w / 32, ch = cr.h / 12, sh = 16;
  const strips: Array<{ vals: number[]; x: number; y: number; v: boolean; hi: number; dashed: boolean; name: string; lx: number; ly: number }> = [
    { vals: D.colHead[0], x: cr.x, y: cr.y - 56, v: false, hi: e.left.cell, dashed: false, name: 'left score', lx: cr.x + cr.w + 70, ly: cr.y - 44 },
    { vals: D.colHead[1], x: cr.x, y: cr.y - 34, v: false, hi: e.left.cell, dashed: true, name: 'left offset', lx: cr.x + cr.w + 70, ly: cr.y - 22 },
    { vals: D.colHead[2], x: cr.x, y: cr.y + cr.h + 18, v: false, hi: e.right.cell, dashed: false, name: 'right score', lx: cr.x + cr.w + 70, ly: cr.y + cr.h + 30 },
    { vals: D.colHead[3], x: cr.x, y: cr.y + cr.h + 40, v: false, hi: e.right.cell, dashed: true, name: 'right offset', lx: cr.x + cr.w + 70, ly: cr.y + cr.h + 52 },
    { vals: D.rowHead[0], x: cr.x - 56, y: cr.y, v: true, hi: e.top.cell, dashed: false, name: 'top score', lx: cr.x - 64, ly: cr.y - 10 },
    { vals: D.rowHead[1], x: cr.x - 34, y: cr.y, v: true, hi: e.top.cell, dashed: true, name: 'top offset', lx: cr.x - 64, ly: cr.y + cr.h + 16 },
    { vals: D.rowHead[2], x: cr.x + cr.w + 18, y: cr.y, v: true, hi: e.bottom.cell, dashed: false, name: 'bottom score', lx: cr.x + cr.w + 18, ly: cr.y - 10 },
    { vals: D.rowHead[3], x: cr.x + cr.w + 40, y: cr.y, v: true, hi: e.bottom.cell, dashed: true, name: 'bottom offset', lx: cr.x + cr.w + 18, ly: cr.y + cr.h + 16 },
  ];
  strips.forEach((s) => {
    const n = s.vals.length, lim = Math.max(0, Math.round(n * a1));
    if (s.v) strip1d(ctx, env, s.vals, s.x, s.y, ch, sh, { vertical: true, limit: lim, hi: a2 > 0.5 ? s.hi : undefined, dashed: s.dashed });
    else strip1d(ctx, env, s.vals, s.x, s.y, cw, sh, { limit: lim, hi: a2 > 0.5 ? s.hi : undefined, dashed: s.dashed });
    if (!s.v) txt(ctx, env, s.name, s.lx, s.ly, 11, { c: C.muted, alpha: a1 });
  });
  txt(ctx, env, 'top score · offset', cr.x - 45, cr.y + cr.h + 16, 10.5, { c: C.muted, alpha: a1, a: 'center' });
  txt(ctx, env, 'bottom score · offset', cr.x + cr.w + 47, cr.y + cr.h + 16, 10.5, { c: C.muted, alpha: a1, a: 'center' });
  txt(ctx, env, 'solid: the highest score · dotted: its offset · the line: where in the cell the edge is', cr.x + cr.w / 2, cr.y + cr.h + 78, 12, { a: 'center', c: C.dim, alpha: a2 });
  // dashed lines from the chosen cells to the crop, becoming the box
  const lx = cr.x + e.left.frac * cr.w, rx = cr.x + e.right.frac * cr.w, ty = cr.y + e.top.frac * cr.h, by = cr.y + e.bottom.frac * cr.h;
  if (a3 > 0) {
    const L = a3;
    line(ctx, env, lx, cr.y - 18, lx, lerp(cr.y - 18, cr.y + cr.h, L), { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, rx, cr.y + cr.h + 18, rx, lerp(cr.y + cr.h + 18, cr.y, L), { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, cr.x - 18, ty, lerp(cr.x - 18, cr.x + cr.w, L), ty, { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, cr.x + cr.w + 18, by, lerp(cr.x + cr.w + 18, cr.x, L), by, { c: C.red, dash: [5, 4], w: 1.4 });
  }
  if (a4 > 0) {
    rect(ctx, env, { x: lx, y: ty, w: rx - lx, h: by - ty }, { stroke: boxC, w: 3, alpha: a4 });
    txt(ctx, env, `${P.box[2]} × ${P.box[3]} px`, rx + 8, ty - 8, 13, { c: boxC, alpha: a4 });
  }
}
function refNetDraw(ctx: Ctx, env: Env, L: ReturnType<typeof refNet>, P: Pass, p: number) {
  drawNet(ctx, env, L, p, (r) => { cropTile(ctx, env, P.crop, r); txt(ctx, env, 'crop · 256 × 96 grey', r.x + r.w / 2, r.y + r.h + 24, 13, { a: 'center', c: C.muted }); });
}
/* the reader's whole chain, compact, for readers 2 and 3 */
function miniReader(ctx: Ctx, env: Env, k: number, p: number) {
  const L = MINI[k - 1], y0 = k === 1 ? PAN.reader2.y : PAN.reader3.y, M = MEMBERS[k];
  const probs = M.probs[5], best = probs.indexOf(Math.max(...probs));
  drawNet(ctx, env, L, segL(p, 0, 0.45), (r) => { frame(ctx, env, r); tile(ctx, env, cutFeats, 5, r, { pixel: false }); }, { caps: false, step: 5 });
  const d = seg(p, 0.45, 0.62), g = seg(p, 0.62, 0.84), r = seg(p, 0.84, 1);
  const right = stackRight(L.blocks[3], 5);
  arrow(ctx, env, right + 10, L.midY, 890, L.midY, { alpha: d });
  for (let i = 0; i < 96; i++) { ctx.save(); ctx.globalAlpha = d; ctx.fillStyle = ramp(UNITS[i] * (0.8 + 0.4 * ((i * 7 + k * 13) % 5) / 5)); ctx.fillRect(900 + (i % 12) * 10, y0 + 70 + Math.floor(i / 12) * 10, 9, 9); ctx.restore(); }
  txt(ctx, env, '96 units', 960, y0 + 168, 11, { a: 'center', c: C.muted, alpha: d });
  arrow(ctx, env, 1030, L.midY, 1070, L.midY, { alpha: g });
  bars(ctx, env, probs, { x: 1080, y: y0 + 60, w: 220, h: 100 }, { hi: best, base: 0, alpha: g, grow: g, labels: true });
  txt(ctx, env, `${best}`, 1330, y0 + 118, 40, { font: SERIF, c: C.red, alpha: r });
  txt(ctx, env, pct(probs[best]), 1366, y0 + 118, 22, { c: C.red, alpha: r, font: MONO });
  txt(ctx, env, `roll ${sgn(M.rolls[5])}`, 1330, y0 + 146, 13, { c: C.muted, alpha: r });
  txt(ctx, env, `reader ${k + 1}`, 120, y0 + 46 + 180, 13, { c: C.muted });
}

/* ── scenes ── */
export const SCENES: Scene[] = [
  {
    id: 'map', stage: 'DrumNet V10', title: 'The whole machine, before the first photo', dur: 4,
    body: 'Nine panels. Down the left: a spotter finds a rough box and a refiner pins its edges, twice. Down the right: the window is cut into drums, three readers read each drum, and a vote settles the reading. 693K parameters, all on the ESP32-S3, and every number here is from one real run.',
    view: { x: 0, y: 0, w: MAP.w, h: MAP.h }, full: true,
    draw: () => {},
  },
  {
    id: 'downscale', stage: 'Input', title: 'Downscale the capture', dur: 4,
    body: 'The reader captures the meter at 800 × 600 in grey. For the spotter it is downscaled to 320 × 240: four times fewer numbers, so the rough search runs quickly and cheaply.',
    view: { ...PAN.input, y: -20, h: 500 },
    draw: (ctx, env, p) => {
      frame(ctx, env, PHOTO); img(ctx, env, 'photo.webp', PHOTO);
      txt(ctx, env, '800 × 600 · greyscale JPEG', PHOTO.x + PHOTO.w / 2, PHOTO.y + PHOTO.h + 28, 15, { a: 'center', c: C.muted });
      const t = seg(p, 0.15, 0.75);
      if (t > 0) {
        arrow(ctx, env, PHOTO.x + PHOTO.w + 30, PHOTO.y + PHOTO.h / 2, THUMB.x - 30, PHOTO.y + PHOTO.h / 2, { alpha: t });
        const r = lerpRect(PHOTO, THUMB, t);
        frame(ctx, env, r, { hot: t > 0.9 });
        img(ctx, env, t < 0.5 ? 'photo.webp' : 'thumb.webp', r);
        txt(ctx, env, '320 × 240', THUMB.x + THUMB.w / 2, THUMB.y + THUMB.h + 28, 15, { a: 'center', c: C.red, alpha: seg(p, 0.7, 0.9) });
        txt(ctx, env, `${fmt(76800)} numbers · 4 × fewer`, THUMB.x + THUMB.w / 2, THUMB.y + THUMB.h + 48, 12, { a: 'center', c: C.dim, alpha: seg(p, 0.8, 1) });
      }
    },
  },
  {
    id: 'spot-net', stage: 'Spotter', title: 'Five blocks shrink the thumbnail to a 10 × 7 grid', dur: 10,
    body: 'Each block slides a 3 × 3 kernel over its input, keeps the strong responses (ReLU) and halves the size (max-pool). The thumbnail becomes 8 maps, then 16, 24, 32, 32, each half the size of the last, until one cell of the last block stands for a 32 × 34 patch of the thumbnail.',
    view: { x: PX, y: PAN.spotter.y, w: PW, h: 360 },
    draw: (ctx, env, p) => drawNet(ctx, env, SPOT_NET, p, (r) => { thumbTile(ctx, env, r); txt(ctx, env, 'thumbnail', r.x + r.w / 2, r.y + r.h + 24, 15, { a: 'center', w: 700 }); txt(ctx, env, '320 × 240', r.x + r.w / 2, r.y + r.h + 42, 12.5, { a: 'center', c: C.muted }); }),
  },
  {
    id: 'spot-head', stage: 'Spotter', title: 'The score map picks the cell, the other four say where', dur: 10,
    body: 'A 1 × 1 convolution turns block 5 into five 10 × 7 maps. The score map chooses the cell most likely to hold the centre of the digit window. That position is handed down to the dx, dy, width and height maps, read at the same cell, and together they draw a box on the thumbnail.',
    view: { x: PX, y: 870, w: PW, h: 420 },
    draw: (ctx, env, p) => {
      const names = ['score', 'dx', 'dy', 'w', 'h'];
      const b5 = SPOT_NET.blocks[4];
      const a1 = seg(p, 0, 0.2), a2 = seg(p, 0.2, 0.36), a3 = segL(p, 0.36, 0.62), a4 = seg(p, 0.62, 0.86), a5 = seg(p, 0.86, 1);
      // 1 × 1 conv: an elbow from block 5 down and across to the layers
      const bx = b5.x + b5.w / 2 + 12, by0 = b5.y + b5.h + 66, ey = ISO.oy - 26;
      ctx.save(); ctx.globalAlpha *= a1; ctx.strokeStyle = C.red; lw(ctx, env, 1.4); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(bx, by0); ctx.lineTo(bx, ey); ctx.lineTo(560, ey); ctx.stroke(); ctx.restore();
      arrow(ctx, env, 560, ey, 560, ISO.oy - 4, { alpha: a1, c: C.red, dash: [4, 4] });
      rect(ctx, env, { x: 700, y: ey - 16, w: 118, h: 30 }, { stroke: C.red, rad: 6, w: 1.4, alpha: a1, fill: C.chip });
      txt(ctx, env, '1 × 1 conv · 32 → 5', 759, ey + 4, 12, { a: 'center', c: C.red, w: 700, alpha: a1 });
      // the five layers, sheared
      for (let l = 0; l < 5; l++) {
        const la = seg(a1, l * 0.16, l * 0.16 + 0.36);
        if (la <= 0) continue;
        ctx.save(); ctx.globalAlpha *= la;
        ctx.translate(ISO.ox, ISO.oy + l * ISO.gap); ctx.transform(1, 0, ISO.kx, ISO.ky, 0, 0);
        rect(ctx, env, { x: -4, y: -4, w: 308, h: 218 }, { fill: '#0e0e13', stroke: '#3a3a46' });
        const sweep = l === 0 && a2 > 0 && a2 < 1 ? Math.floor(a2 * 70) : -1;
        HEAD[l].forEach((row, r) => row.forEach((v, c) => {
          const idx = r * 10 + c; const lit = sweep >= 0 && idx === sweep;
          ctx.fillStyle = lit ? C.hi : ramp(v); ctx.fillRect(c * ISO.cell, r * ISO.cell, ISO.cell - 1, ISO.cell - 1);
        }));
        const chosen = l === 0 ? a2 >= 1 : a3 * 4 >= l;
        if (chosen) { ctx.strokeStyle = C.red; ctx.lineWidth = 2.5; if (l > 0) ctx.setLineDash([4, 3]); ctx.strokeRect(CHOSEN[1] * ISO.cell, CHOSEN[0] * ISO.cell, ISO.cell, ISO.cell); }
        ctx.restore();
        txt(ctx, env, names[l], ISO.ox + 312, ISO.oy + l * ISO.gap + 30, l === 0 ? 18 : 15, { c: l === 0 ? C.hi : C.muted, w: l === 0 ? 700 : 400, alpha: la });
      }
      // the dashed drop through the layers
      if (a3 > 0) {
        const top = isoPt(0, CHOSEN[0], CHOSEN[1]), bot = isoPt(4, CHOSEN[0], CHOSEN[1]);
        line(ctx, env, top.x, top.y, top.x, lerp(top.y, bot.y, a3), { c: C.red, dash: [5, 4], w: 1.6 });
      }
      // the numbers
      const rows = [
        ['score', SP.raw[0].toFixed(2), '', 'highest of the 70 cells: chosen'],
        ['dx', SP.raw[1].toFixed(2), SP.sig[0].toFixed(2), `centre ${Math.round(SP.sig[0] * 100)} % across the cell`],
        ['dy', SP.raw[2].toFixed(2), SP.sig[1].toFixed(2), `centre ${Math.round(SP.sig[1] * 100)} % down the cell`],
        ['w', SP.raw[3].toFixed(2), SP.sig[2].toFixed(2), `width ${SP.size_norm[0].toFixed(2)} of the frame · ${SP.box[2]} px`],
        ['h', SP.raw[4].toFixed(2), SP.sig[3].toFixed(2), `height ${SP.size_norm[1].toFixed(2)} of the frame · ${SP.box[3]} px`],
      ];
      eyebrow(ctx, env, 'cell', 700, ISO.oy + 10); eyebrow(ctx, env, 'raw', 790, ISO.oy + 10); eyebrow(ctx, env, '0 to 1', 882, ISO.oy + 10); eyebrow(ctx, env, 'meaning', 970, ISO.oy + 10);
      rows.forEach(([n, raw, s, m], i) => {
        const ra = i === 0 ? a2 : seg(a3, (i - 1) * 0.22, (i - 1) * 0.22 + 0.3);
        if (ra <= 0) return;
        const y = ISO.oy + 44 + i * 50;
        rect(ctx, env, { x: 700, y: y - 18, w: 20, h: 20 }, { fill: i === 0 ? C.blue : '#1d2030', stroke: C.red, w: 1.5, dash: i ? [3, 2] : undefined, alpha: ra });
        txt(ctx, env, n, 730, y, 15, { w: 700, alpha: ra });
        chip(ctx, env, raw, 790, y - 20, 70, 28, { alpha: ra });
        if (s) { arrow(ctx, env, 864, y - 6, 878, y - 6, { alpha: ra }); chip(ctx, env, s, 882, y - 20, 62, 28, { hot: true, alpha: ra }); arrow(ctx, env, 948, y - 6, 962, y - 6, { alpha: ra }); }
        txt(ctx, env, m, 970, y, 12, { c: C.body, alpha: ra });
      });
      txt(ctx, env, '0 to 1 is the sigmoid of the raw value', 700, ISO.oy + 300, 11, { c: C.dim, alpha: a3 });
      // onto the thumbnail
      const R = SPOT_PHOTO;
      frame(ctx, env, R); img(ctx, env, 'thumb.webp', R);
      const gw = R.w / 10, gh = R.h / 7;
      ctx.save(); ctx.globalAlpha *= 0.35 * a4 * (1 - a5);
      for (let c = 1; c < 10; c++) line(ctx, env, R.x + c * gw, R.y, R.x + c * gw, R.y + R.h, { c: C.hi, w: 0.8 });
      for (let r = 1; r < 7; r++) line(ctx, env, R.x, R.y + r * gh, R.x + R.w, R.y + r * gh, { c: C.hi, w: 0.8 });
      ctx.restore();
      if (a4 > 0) {
        const cx0 = R.x + CHOSEN[1] * gw, cy0 = R.y + CHOSEN[0] * gh;
        rect(ctx, env, { x: cx0, y: cy0, w: gw, h: gh }, { stroke: C.red, w: 2, alpha: a4 });
        const m1 = seg(a4, 0.1, 0.45), m2 = seg(a4, 0.5, 1);
        const cx = cx0 + m1 * SP.sig[0] * gw, cy = cy0 + m1 * SP.sig[1] * gh;
        const bw = m2 * SP.size_norm[0] * R.w, bh = m2 * SP.size_norm[1] * R.h;
        line(ctx, env, cx0, cy0, cx, cy, { c: C.red, dash: [3, 3] });
        ctx.save(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (m2 > 0) rect(ctx, env, { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh }, { stroke: C.red, w: 2.5 });
        txt(ctx, env, 'dx, dy from the cell corner', cx + 10, cy - 8, 11, { c: C.red, alpha: m1 * (1 - m2) });
      }
      txt(ctx, env, `the spotter’s selection · ${SP.box[2]} × ${SP.box[3]} px`, R.x + R.w / 2, R.y + R.h + 26, 14, { a: 'center', c: C.red, alpha: a5 });
    },
  },
  {
    id: 'spot-crop', stage: 'Spotter', title: 'A rough box, then a generous crop', dur: 5,
    body: 'The spotter’s work is rough, so the box is widened 1.5 ×, and the crop around it takes 1.5 × its width and 2.4 × its height. It is cut from the full 800 × 600 frame, not the thumbnail, and sent down to the refiner.',
    view: { x: PX, y: 870, w: PW, h: 780 },
    draw: (ctx, env, p) => {
      const R = SPOT_PHOTO;
      const a1 = seg(p, 0, 0.22), a2 = seg(p, 0.22, 0.48), a3 = seg(p, 0.5, 0.68), a4 = seg(p, 0.7, 1);
      const box = inPhoto(R, SP.box), wide = inPhoto(R, SP.wide), crop = inPhoto(R, SP.crop);
      if (a3 > 0) rect(ctx, env, R, { fill: '#000', alpha: 0.55 * a3 });
      rect(ctx, env, box, { stroke: C.red, w: 2.5 });
      if (a1 > 0) rect(ctx, env, lerpRect(box, wide, a1), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, 'widened 1.5 ×', wide.x + wide.w + 8, wide.y + 12, 11, { c: C.white, alpha: a1 * (1 - a2) });
      if (a2 > 0) rect(ctx, env, lerpRect(wide, crop, a2), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, `the crop · 1.5 × wider, 2.4 × taller · ${Math.round(SP.crop[2])} × ${Math.round(SP.crop[3])} px`, crop.x, crop.y - 8, 11.5, { c: C.white, alpha: a2 });
      txt(ctx, env, 'cut from the full 800 × 600 frame, not the thumbnail', R.x + R.w / 2, R.y + R.h + 46, 13, { a: 'center', c: C.muted, alpha: a3 });
      if (a3 > 0) {
        const fly = lerpRect(crop, REF1_NET.input, a4);
        frame(ctx, env, fly, { hot: true });
        img(ctx, env, 'photo.webp', fly, { src: photoSrc(SP.crop), alpha: 1 - a4 });
        img(ctx, env, P1.crop, fly, { alpha: a4 });
      }
    },
  },
  {
    id: 'ref-net', stage: 'Refiner · pass 1', title: 'Four blocks, down to 32 maps of 32 × 12', dur: 7,
    body: 'The crop is converted to grey and resized to 256 × 96. RefNet runs the same kind of blocks as the spotter, four of them, and the last one does not pool, so block 4 keeps 32 maps of 32 × 12: one column per 8 pixels of the crop.',
    view: { x: PX, y: PAN.ref1.y, w: PW, h: 320 },
    draw: (ctx, env, p) => refNetDraw(ctx, env, REF1_NET, P1, p),
  },
  {
    id: 'ref-avg', stage: 'Refiner · pass 1', title: 'Every map is squashed into one row and one column', dur: 8,
    body: 'Block 4 is 32 maps stacked into a slab. Each map peels off: its 32 columns average down to 32 values, one row of the column-average map, and its 12 rows average across to 12 values, one column of the row-average map. The column map will find left and right; the row map, top and bottom.',
    view: { x: PX, y: PAN.ref1.y + 300, w: PW, h: 360 },
    draw: (ctx, env, p) => refAvg(ctx, env, PAN.ref1.y, PD1, p),
  },
  {
    id: 'ref-heads', stage: 'Refiner · pass 1', title: 'Four 1 × 1 heads pin the window edges', dur: 9,
    body: 'A 1 × 1 convolution reads every column of the column map and gives a left score and offset and a right score and offset; another reads every row for top and bottom. The highest score names the cell, its offset says where inside the cell the edge is, and the four edges become the box.',
    view: { x: PX, y: PAN.ref1.y + 640, w: PW, h: 380 },
    draw: (ctx, env, p) => refHeads(ctx, env, PAN.ref1.y, P1, PD1, p, C.red),
  },
  {
    id: 'ref-pass2', stage: 'Refiner · pass 2', title: 'Expand the box, crop again, refine again', dur: 9,
    body: 'The pass 1 box is only as centred as the spotter’s guess, so it is expanded, cropped again and sent through the very same refiner. Pass 2 is the whole thing over again, quickly: blocks, averages, heads. Its box goes to the reader.',
    view: { x: PX, y: PAN.ref1.y, w: PW, h: 2100 },
    draw: (ctx, env, p) => {
      const cr = CROP(PAN.ref1.y);
      const rel = (b: readonly number[], reg: readonly number[]): Rect => ({ x: cr.x + ((b[0] - reg[0]) / reg[2]) * cr.w, y: cr.y + ((b[1] - reg[1]) / reg[3]) * cr.h, w: (b[2] / reg[2]) * cr.w, h: (b[3] / reg[3]) * cr.h });
      const box1 = rel(P1.box, P1.region), reg2 = rel(P2.region, P1.region);
      const a1 = seg(p, 0, 0.14), a2 = seg(p, 0.14, 0.3);
      if (a1 > 0) rect(ctx, env, lerpRect(box1, reg2, a1), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, `expanded · ${Math.round(P2.region[2])} × ${Math.round(P2.region[3])} px → 256 × 96`, reg2.x, reg2.y - 8, 11.5, { c: C.white, alpha: a1 });
      if (a2 > 0) {
        const fly = lerpRect(reg2, REF2_NET.input, a2);
        frame(ctx, env, fly, { hot: true });
        img(ctx, env, 'photo.webp', fly, { src: photoSrc(P2.region), alpha: 1 - a2 });
        img(ctx, env, P2.crop, fly, { alpha: a2 });
      }
      const q = segL(p, 0.3, 1);
      if (q > 0) {
        refNetDraw(ctx, env, REF2_NET, P2, segL(q, 0, 0.3));
        if (q > 0.3) refAvg(ctx, env, PAN.ref2.y, PD2, segL(q, 0.3, 0.62));
        if (q > 0.62) refHeads(ctx, env, PAN.ref2.y, P2, PD2, segL(q, 0.62, 1), C.blue);
        if (q >= 1) { const c2 = CROP(PAN.ref2.y); txt(ctx, env, 'pass 2 box', c2.x + c2.w + 70, c2.y + c2.h / 2 - 6, 15, { c: C.blue, w: 700 }); txt(ctx, env, `${P2.box[2]} × ${P2.box[3]} px · to the reader`, c2.x + c2.w + 70, c2.y + c2.h / 2 + 14, 12, { c: C.blue }); }
      }
    },
  },
  {
    id: 'cut', stage: 'Cut', title: 'Cut the window into drums', dur: 6,
    body: 'The drum layout was set at setup: 4 whole drums and 2 decimal drums. The window is sliced into six equal cells, each is turned grey and stretched to full contrast at 32 × 64, and each goes to the readers. We follow the sixth drum, the 7.',
    view: { x: PX + RX, y: PAN.cut.y, w: PW, h: 360 },
    draw: right((ctx, env, p) => {
      const a1 = seg(p, 0, 0.15), a2 = segL(p, 0.15, 0.42), a3 = seg(p, 0.45, 0.68), a4 = seg(p, 0.7, 0.84), a5 = seg(p, 0.86, 1);
      const s = 3;
      frame(ctx, env, WIN, { alpha: a1 }); img(ctx, env, 'cut-win.webp', WIN, { alpha: a1 });
      txt(ctx, env, `window · ${CT.bw} × ${CT.bh} px · 6 equal strips`, WIN.x + WIN.w / 2, WIN.y + WIN.h + 26, 13, { a: 'center', c: C.muted, alpha: a1 });
      const bx = WIN.x + CT.box[0] * s, by = WIN.y + CT.box[1] * s, bw = CT.box[2] * s, bh = CT.box[3] * s;
      if (a2 > 0) rect(ctx, env, { x: bx, y: by, w: bw, h: bh }, { stroke: C.red, w: 2, alpha: Math.min(1, a2 * 4) });
      for (let i = 1; i < 6; i++) { const la = clamp01(a2 * 6 - i); if (la > 0) line(ctx, env, WIN.x + CT.cuts[i] * s, by, WIN.x + CT.cuts[i] * s, by + bh, { c: C.red, dash: [4, 4], w: 1.5, alpha: la }); }
      for (let i = 0; i < 6; i++) {
        const home: Rect = { x: WIN.x + CT.cuts[i] * s, y: by, w: (CT.cuts[i + 1] - CT.cuts[i]) * s, h: bh };
        const spread: Rect = { x: cellAt(i).x, y: PAN.cut.y + 90, w: 69, h: 90 };
        const greyR = cellAt(i);
        const r = lerpRect(home, spread, a3);
        if (a3 > 0) { frame(ctx, env, r); tile(ctx, env, cutCells, i, r, { pixel: false, alpha: 1 - a4 }); }
        if (a4 > 0) { const g = lerpRect(spread, greyR, a4); frame(ctx, env, g, { hot: i === 5 && a5 > 0 }); tile(ctx, env, cutFeats, i, g, { pixel: false, alpha: a4 }); }
      }
      txt(ctx, env, 'cells · one per drum', cellAt(2).x + 80, PAN.cut.y + 220, 13, { a: 'center', c: C.muted, alpha: a3 * (1 - a4) });
      txt(ctx, env, 'reader cells · grey, full contrast, 32 × 64', cellAt(2).x + 80, PAN.cut.y + 230, 13, { a: 'center', c: C.muted, alpha: a4 });
      if (a5 > 0) {
        const fly = lerpRect(cellAt(5), RD_NET.input, a5);
        frame(ctx, env, fly, { hot: true }); tile(ctx, env, cutFeats, 5, fly, { pixel: false });
        txt(ctx, env, 'drum 6', fly.x + fly.w / 2, fly.y - 10, 12, { a: 'center', c: C.red });
      }
    }),
  },
  {
    id: 'rd-net', stage: 'Reader', title: 'A reader turns one cell into 96 tiny maps', dur: 7,
    body: 'The reader is the same recipe once more, four blocks of 3 × 3 convolution, ReLU and max-pool, but wider: 16, 48, 96, 96 maps. The 32 × 64 cell ends as 96 maps of 2 × 4, where one cell stands for a 16 × 16 patch of the drum.',
    view: { x: PX + RX, y: PAN.reader1.y, w: PW, h: 380 },
    draw: right((ctx, env, p) => drawNet(ctx, env, RD_NET, p, (r) => { frame(ctx, env, r); tile(ctx, env, cutFeats, 5, r, { pixel: false }); txt(ctx, env, 'cell · 32 × 64', r.x + r.w / 2, r.y + r.h + 24, 13, { a: 'center', c: C.muted }); })),
  },
  {
    id: 'flatten', stage: 'Reader', title: 'Flatten: 96 maps become one list of 768', dur: 7,
    body: 'Nothing is computed here. The first map’s 2 × 4 cells are read row by row into a line of 8; the other 95 maps follow, so the list is always in the same order, map 1 first and map 96 last. 768 numbers.',
    view: { x: PX + RX, y: FLAT_Y - 20, w: PW, h: 250 },
    draw: right((ctx, env, p) => {
      const sx = 120, sy = FLAT_Y + 60;
      for (let k = 95; k >= 1; k--) rect(ctx, env, { x: sx + k * 2.4, y: sy - k * 1.1, w: 20, h: 40 }, { fill: '#1a1a22', stroke: '#3a3a46', w: 0.6 });
      const first = seg(p, 0, 0.12);
      const big: Rect = { x: 470, y: FLAT_Y + 28, w: 36, h: 72 };
      const start: Rect = { x: sx, y: sy, w: 20, h: 40 };
      const pull = lerpRect(start, big, first);
      rect(ctx, env, { x: pull.x - 1, y: pull.y - 1, w: pull.w + 2, h: pull.h + 2 }, { fill: C.sunken, stroke: C.red, w: 1.5 });
      txt(ctx, env, 'block 4 · 96 maps of 2 × 4', sx, sy + 66, 13, { c: C.muted });
      // map 1 unrolls: cells leave the 2 × 4 grid for the line of 8
      const u = segL(p, 0.14, 0.42);
      const cell = 18, lineX = 560, lineY = FLAT_Y + 56;
      C4[0].forEach((row, r) => row.forEach((v, c) => {
        const i = r * 2 + c;
        const ct = seg(u, i * 0.1, i * 0.1 + 0.3);
        const fx = big.x + c * cell, fy = big.y + r * cell, tx = lineX + i * cell, ty = lineY;
        const x = lerp(fx, tx, ct), y = lerp(fy, ty, ct);
        ctx.save(); ctx.fillStyle = ramp(v); ctx.fillRect(x, y, cell - 1, cell - 1); ctx.restore();
        txt(ctx, env, String(i + 1), x + cell / 2, y + 13, 10, { a: 'center', c: C.hi, alpha: first });
      }));
      txt(ctx, env, 'row by row', lineX + 4 * cell, lineY - 8, 11, { a: 'center', c: C.dim, alpha: u });
      txt(ctx, env, 'map 1 → list positions 1 to 8', lineX + 8 * cell + 12, lineY + 13, 11.5, { c: C.muted, alpha: seg(u, 0.6, 1) });
      // the rest, quickly, filling the list
      const rest = segL(p, 0.44, 0.9);
      const filled = u > 0 ? 8 + Math.floor(rest * 760) : 0;
      const cw = LIST.w / 128, chh = LIST.h / 6;
      rect(ctx, env, { x: LIST.x - 2, y: LIST.y - 2, w: LIST.w + 4, h: LIST.h + 4 }, { stroke: '#45403f', rad: 2 });
      ctx.save();
      for (let i = 0; i < Math.min(768, filled); i++) { ctx.fillStyle = ramp(FLAT[i]); ctx.fillRect(LIST.x + (i % 128) * cw, LIST.y + Math.floor(i / 128) * chh, cw - 0.6, chh - 0.6); }
      ctx.restore();
      if (rest > 0 && rest < 1) {
        const m = Math.min(95, 1 + Math.floor(rest * 95));
        const from = { x: sx + m * 2.4, y: sy - m * 1.1 }, to = { x: LIST.x + ((m * 8) % 128) * cw, y: LIST.y + Math.floor((m * 8) / 128) * chh };
        line(ctx, env, from.x + 10, from.y + 20, to.x, to.y, { c: C.red, w: 1.2, alpha: 0.7 });
        txt(ctx, env, `map ${m + 1}`, to.x, to.y - 6, 10, { c: C.red });
      }
      txt(ctx, env, `one list · ${filled >= 768 ? '768' : fmt(Math.min(768, filled))} numbers`, LIST.x, LIST.y + LIST.h + 20, 13, { c: C.muted });
    }),
  },
  {
    id: 'dense', stage: 'Reader', title: 'The dense layer: 768 numbers become 96 units', dur: 7,
    body: 'Each of the 96 units has its own 768 weights. Every number is multiplied by its weight, all 768 products are added, an offset is added, and anything below zero becomes zero. Unit 69 first, slowly; then the other 95 the same way.',
    view: { x: PX + RX, y: DENSE_Y - 20, w: PW, h: 240 },
    draw: right((ctx, env, p) => {
      const d = RD.dense;
      const a1 = segL(p, 0, 0.4), a2 = segL(p, 0.42, 0.9), a3 = seg(p, 0.9, 1);
      ctx.save();
      for (let i = 0; i < 768; i++) { ctx.fillStyle = ramp(FLAT[i]); ctx.fillRect(D768.x + (i % 32) * D768.cell, D768.y + Math.floor(i / 32) * D768.cell, D768.cell - 0.6, D768.cell - 0.6); }
      ctx.restore();
      txt(ctx, env, '768 numbers', D768.x + 96, D768.y + 164, 13, { a: 'center', c: C.muted });
      const sig = { x: 470, y: DENSE_Y + 100 };
      txt(ctx, env, '×', 330, sig.y + 8, 22, { a: 'center', c: C.muted });
      rect(ctx, env, { x: 350, y: sig.y - 20, w: 60, h: 40 }, { fill: C.chip, stroke: '#45403f', rad: 6 });
      txt(ctx, env, 'Wt', 380, sig.y + 6, 16, { a: 'center', w: 700 });
      txt(ctx, env, 'one weight per number', 380, sig.y + 36, 11, { a: 'center', c: C.dim });
      ctx.save(); ctx.fillStyle = C.chip; ctx.strokeStyle = C.red; lw(ctx, env, 1.4); ctx.beginPath(); ctx.arc(sig.x, sig.y, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx, env, 'Σ', sig.x, sig.y + 7, 18, { a: 'center', c: C.red, w: 700 });
      // unit 69, slowly: products stream from the 768 into Σ
      if (a1 > 0 && a1 < 1) {
        const n = Math.floor(a1 * 60);
        for (let k = 0; k < n; k++) { const i = (k * 131) % 768; const fx = D768.x + (i % 32) * D768.cell + 3, fy = D768.y + Math.floor(i / 32) * D768.cell + 3; line(ctx, env, fx, fy, sig.x - 18, sig.y, { c: C.red, w: 0.6, alpha: 0.35 }); }
      }
      const uy = sig.y;
      const chips = [[`${sgn(d.pre - d.off, 2)}`, 'sum of the 768'], ['+', ''], [d.off.toFixed(2), 'offset'], ['=', ''], [`${sgn(d.pre, 2)}`, ''], ['ReLU', ''], [d.value.toFixed(2), `unit ${d.unit + 1}`]];
      let cx = 510;
      chips.forEach(([s, sub], i) => {
        const al = seg(a1, 0.35 + i * 0.08, 0.5 + i * 0.08);
        if (s === '+' || s === '=') { txt(ctx, env, s, cx + 10, uy + 7, 20, { c: C.muted, alpha: al }); cx += 30; return; }
        if (s === 'ReLU') { arrow(ctx, env, cx, uy, cx + 40, uy, { alpha: al }); txt(ctx, env, 'ReLU', cx + 20, uy - 10, 11, { a: 'center', c: C.red, alpha: al }); cx += 48; return; }
        chip(ctx, env, s, cx, uy - 17, 74, 34, { alpha: al, hot: i === chips.length - 1 });
        if (sub) txt(ctx, env, sub, cx + 37, uy + 32, 10.5, { a: 'center', c: C.dim, alpha: al });
        cx += 84;
      });
      // the 96 grid fills: unit 69 first, then all
      rect(ctx, env, { x: U96.x - 3, y: U96.y - 3, w: 12 * U96.cell + 6, h: 8 * U96.cell + 6 }, { stroke: '#45403f', rad: 3 });
      const done = a2 > 0 ? Math.floor(a2 * 96) : 0;
      for (let i = 0; i < 96; i++) {
        const on = i === d.unit ? a1 >= 1 : i < done;
        if (!on) continue;
        ctx.save(); ctx.fillStyle = ramp(UNITS[i]); ctx.fillRect(U96.x + (i % 12) * U96.cell, U96.y + Math.floor(i / 12) * U96.cell, U96.cell - 1, U96.cell - 1); ctx.restore();
      }
      if (a1 >= 1) rect(ctx, env, { x: U96.x + (d.unit % 12) * U96.cell - 1.5, y: U96.y + Math.floor(d.unit / 12) * U96.cell - 1.5, w: U96.cell + 2, h: U96.cell + 2 }, { stroke: C.red, w: 2 });
      if (a1 >= 0.95 && a1 < 1) arrow(ctx, env, cx, uy, U96.x + (d.unit % 12) * U96.cell, U96.y + Math.floor(d.unit / 12) * U96.cell + 9, { c: C.red });
      if (a2 > 0 && a2 < 1) { const i = Math.min(95, done); line(ctx, env, sig.x + 18, sig.y, U96.x + (i % 12) * U96.cell + 9, U96.y + Math.floor(i / 12) * U96.cell + 9, { c: C.red, w: 1, alpha: 0.6 }); txt(ctx, env, `unit ${i + 1}`, 700, uy + 70, 12, { c: C.red }); }
      txt(ctx, env, '96 units', U96.x + 6 * U96.cell, U96.y + 8 * U96.cell + 20, 13, { a: 'center', c: C.muted });
      txt(ctx, env, `${fmt(RD.weights.fc)} weights · ${RD.nz} of the 96 are above zero for this drum`, U96.x + 6 * U96.cell, U96.y + 8 * U96.cell + 38, 11, { a: 'center', c: C.dim, alpha: a3 });
    }),
  },
  {
    id: 'digit', stage: 'Reader', title: 'The digit head: ten scores, a softmax, one answer', dur: 7,
    body: 'Each digit 0 to 9 has its own 96 weights and offset, so ten weighted sums give ten scores. Softmax raises e to every score and divides by the total, which turns one clear lead into nearly all of the probability. The 7 wins at 96.4 %; that percentage is the confidence.',
    view: { x: PX + RX, y: DIGIT_Y - 20, w: PW, h: 360 },
    draw: right((ctx, env, p) => {
      const gx = 120, gy = DIGIT_Y + 40, cell = 10;
      ctx.save(); for (let i = 0; i < 96; i++) { ctx.fillStyle = ramp(UNITS[i]); ctx.fillRect(gx + (i % 12) * cell, gy + Math.floor(i / 12) * cell, cell - 0.6, cell - 0.6); } ctx.restore();
      txt(ctx, env, '96 units', gx + 60, gy + 100, 12, { a: 'center', c: C.muted });
      ['score', 'e^score', '÷ sum', 'softmax'].forEach((h, i) => eyebrow(ctx, env, h, [450, 540, 740, 880][i], DIGIT_Y + 24));
      for (let i = 0; i < 10; i++) {
        const y = DIGIT_Y + 44 + i * 29;
        const a1 = seg(p, i * 0.03, i * 0.03 + 0.12), a2 = seg(p, 0.36 + i * 0.015, 0.5 + i * 0.015), a3 = seg(p, 0.66 + i * 0.015, 0.8 + i * 0.015);
        const hot = i === RD.digit.best && a3 > 0.8;
        if (a1 > 0 && a1 < 1) for (let k = 0; k < 12; k++) { const u = (k * 37 + i) % 96; line(ctx, env, gx + (u % 12) * cell + 5, gy + Math.floor(u / 12) * cell + 5, 408, y + 8, { c: C.red, w: 0.6, alpha: 0.3 }); }
        ctx.save(); ctx.globalAlpha *= a1; ctx.fillStyle = C.chip; ctx.strokeStyle = hot ? C.red : '#45403f'; lw(ctx, env, 1.2); ctx.beginPath(); ctx.arc(410, y + 8, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        txt(ctx, env, 'Σ', 410, y + 12, 11, { a: 'center', c: hot ? C.red : C.muted, alpha: a1 });
        txt(ctx, env, String(i), 436, y + 14, 15, { a: 'center', w: 700, c: hot ? C.red : C.ink, alpha: a1 });
        chip(ctx, env, RD.logits[i].toFixed(1), 450, y - 2, 56, 22, { hot, alpha: a1, size: 12 });
        rect(ctx, env, { x: 540, y: y + 2, w: 150, h: 16 }, { fill: C.sunken, rad: 2, alpha: a2 });
        rect(ctx, env, { x: 540, y: y + 2, w: (EXP[i] / EMAX) * 150 * a2, h: 16 }, { fill: hot ? C.red : C.blue, rad: 2, alpha: a2 });
        txt(ctx, env, EXP[i] >= 100 ? fmt(Math.round(EXP[i])) : EXP[i].toFixed(2), 698, y + 14, 11, { c: C.muted, alpha: a2 });
        rect(ctx, env, { x: 740, y: y + 2, w: 120, h: 16 }, { fill: C.sunken, rad: 2, alpha: a3 });
        rect(ctx, env, { x: 740, y: y + 2, w: (EXP[i] / ESUM) * 120 * a3, h: 16 }, { fill: hot ? C.red : C.blue, rad: 2, alpha: a3 });
        txt(ctx, env, RD.probs[i] < 0.001 ? '< 0.1 %' : pct(RD.probs[i]), 940, y + 14, 12, { a: 'right', font: MONO, c: hot ? C.red : C.muted, alpha: a3 });
      }
      const fin = seg(p, 0.86, 1);
      txt(ctx, env, `digit ${RD.digit.best}`, 1100, DIGIT_Y + 160, 52, { font: SERIF, c: C.red, alpha: fin });
      txt(ctx, env, pct(RD.probs[RD.digit.best]), 1100, DIGIT_Y + 200, 24, { font: MONO, alpha: fin });
      txt(ctx, env, 'the confidence the firmware checks', 1100, DIGIT_Y + 224, 12, { c: C.dim, alpha: fin });
      txt(ctx, env, `e^7.1 = 1,215 ÷ 1,260 · a score 3.6 above the next is a 36 × share`, 450, DIGIT_Y + 346, 11, { c: C.dim, alpha: fin });
    }),
  },
  {
    id: 'roll', stage: 'Reader', title: 'The roll head: how far the drum has turned', dur: 5,
    body: 'One more weighted sum of the 96 units gives a roll score, squashed by tanh into −0.5 to +0.5: how far past its mark the drum sits. This 7 has rolled 3.7 % of a step towards the 8.',
    view: { x: PX + RX, y: ROLL_Y - 20, w: PW, h: 240 },
    draw: right((ctx, env, p) => {
      const gx = 120, gy = ROLL_Y + 40, cell = 10;
      ctx.save(); for (let i = 0; i < 96; i++) { ctx.fillStyle = ramp(UNITS[i]); ctx.fillRect(gx + (i % 12) * cell, gy + Math.floor(i / 12) * cell, cell - 0.6, cell - 0.6); } ctx.restore();
      txt(ctx, env, '96 units', gx + 60, gy + 100, 12, { a: 'center', c: C.muted });
      const a1 = seg(p, 0, 0.3), a2 = seg(p, 0.3, 0.55), a3 = seg(p, 0.55, 0.85), a4 = seg(p, 0.85, 1);
      if (a1 > 0 && a1 < 1) for (let k = 0; k < 14; k++) { const u = (k * 41) % 96; line(ctx, env, gx + (u % 12) * cell + 5, gy + Math.floor(u / 12) * cell + 5, 300, ROLL_Y + 80, { c: C.red, w: 0.6, alpha: 0.3 }); }
      txt(ctx, env, '×  Wt  →  Σ', 300, ROLL_Y + 86, 15, { a: 'center', c: C.muted, alpha: a1 });
      chip(ctx, env, sgn(RD.rollh.score), 380, ROLL_Y + 62, 90, 34, { alpha: a2 });
      txt(ctx, env, 'roll score', 425, ROLL_Y + 112, 11, { a: 'center', c: C.dim, alpha: a2 });
      arrow(ctx, env, 480, ROLL_Y + 79, 560, ROLL_Y + 79, { alpha: a3 }); txt(ctx, env, 'tanh', 520, ROLL_Y + 70, 11, { a: 'center', c: C.red, alpha: a3 });
      const PL = { x: 580, y: ROLL_Y + 10, w: 280, h: 160 };
      rect(ctx, env, PL, { fill: C.sunken, rad: 6, alpha: a3 });
      const cx = PL.x + PL.w / 2, cy = PL.y + PL.h / 2;
      line(ctx, env, PL.x, cy, PL.x + PL.w, cy, { c: '#45403f', alpha: a3 }); line(ctx, env, cx, PL.y, cx, PL.y + PL.h, { c: '#45403f', alpha: a3 });
      ctx.save(); ctx.globalAlpha *= a3; ctx.strokeStyle = C.blue; lw(ctx, env, 2); ctx.beginPath();
      for (let i = 0; i <= 60 * a3; i++) { const x = -3 + i * 0.1; const px = cx + (x / 3) * (PL.w / 2), py = cy - Math.tanh(x) * (PL.h / 2) * 0.92; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke(); ctx.restore();
      const px = cx + (RD.rollh.score / 3) * (PL.w / 2), py = cy - Math.tanh(RD.rollh.score) * (PL.h / 2) * 0.92;
      if (a4 > 0) { line(ctx, env, px, cy, px, py, { c: C.red, dash: [3, 3], alpha: a4 }); line(ctx, env, PL.x, py, px, py, { c: C.red, dash: [3, 3], alpha: a4 }); ctx.save(); ctx.globalAlpha *= a4; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      txt(ctx, env, '+0.5', PL.x - 6, PL.y + 10, 10, { a: 'right', c: C.dim, alpha: a3 }); txt(ctx, env, '−0.5', PL.x - 6, PL.y + PL.h, 10, { a: 'right', c: C.dim, alpha: a3 });
      txt(ctx, env, `roll ${sgn(RD.rollh.roll)}`, 900, ROLL_Y + 86, 30, { font: SERIF, c: C.red, alpha: a4 });
      txt(ctx, env, 'the 7 has passed its mark by 3.7 % of a step toward the 8', 900, ROLL_Y + 112, 12, { c: C.muted, alpha: a4 });
    }),
  },
  {
    id: 'readers3', stage: 'Reader ensemble', title: 'Two more readers read the same drum', dur: 6,
    body: 'Three copies of the reader share one architecture but were trained from different random starts, so they make different mistakes. The same cell goes through all three at once; each gives its own ten percentages and its own roll.',
    view: { x: PX + RX, y: PAN.reader1.y, w: PW, h: 2360 },
    draw: right((ctx, env, p) => { miniReader(ctx, env, 1, p); miniReader(ctx, env, 2, segL(p, 0.05, 1)); }),
  },
  {
    id: 'vote', stage: 'Vote', title: 'Three answers are averaged into one', dur: 7,
    body: 'The three probability lists are averaged, so each reader has the same voting power and the third breaks ties. The averaged list gives the digit and its confidence; the three rolls are averaged too. Drum 6: a 7 at 98.8 %.',
    view: { x: PX + RX, y: VOTE_Y - 30, w: PW, h: 360 },
    draw: right((ctx, env, p) => {
      const d = 5, mean = ENS[d], mi = mean.indexOf(Math.max(...mean));
      frame(ctx, env, { x: 120, y: VOTE_Y + 40, w: 64, h: 128 }); tile(ctx, env, cutFeats, d, { x: 120, y: VOTE_Y + 40, w: 64, h: 128 }, { pixel: false });
      txt(ctx, env, 'drum 6', 152, VOTE_Y + 190, 12, { a: 'center', c: C.muted });
      MEMBERS.forEach((M, k) => {
        const pr = M.probs[d], bi = pr.indexOf(Math.max(...pr)), y = VOTE_Y + 10 + k * 92;
        const a = seg(p, k * 0.08, k * 0.08 + 0.2);
        line(ctx, env, 190, VOTE_Y + 104, 230, y + 36, { c: '#5a5450', alpha: a });
        txt(ctx, env, `reader ${k + 1}`, 240, y + 40, 12, { c: C.muted, alpha: a });
        bars(ctx, env, pr, { x: 320, y, w: 220, h: 70 }, { hi: bi, base: 0, alpha: a, grow: a, labels: k === 2 });
        txt(ctx, env, `${bi} · ${pct(pr[bi])}`, 560, y + 40, 14, { font: MONO, alpha: a });
        txt(ctx, env, `roll ${sgn(M.rolls[d])}`, 560, y + 58, 11, { c: C.dim, alpha: a });
        const c = seg(p, 0.3, 0.6);
        line(ctx, env, 700, y + 36, lerp(700, 840, c), lerp(y + 36, VOTE_Y + 118, c), { c: C.red, alpha: c });
      });
      const m = seg(p, 0.55, 0.7), r = seg(p, 0.7, 0.9), f = seg(p, 0.88, 1);
      rect(ctx, env, { x: 840, y: VOTE_Y + 98, w: 74, h: 40 }, { fill: C.chip, stroke: '#45403f', rad: 6, alpha: m }); txt(ctx, env, 'mean', 877, VOTE_Y + 124, 15, { a: 'center', alpha: m });
      arrow(ctx, env, 920, VOTE_Y + 118, 960, VOTE_Y + 118, { alpha: r });
      bars(ctx, env, mean, { x: 970, y: VOTE_Y + 60, w: 220, h: 110 }, { hi: mi, base: 0, alpha: r, grow: r, labels: true });
      txt(ctx, env, `${mi}`, 1220, VOTE_Y + 128, 48, { font: SERIF, c: C.red, alpha: f });
      txt(ctx, env, pct(VT.conf[d]), 1265, VOTE_Y + 128, 26, { font: MONO, c: C.red, alpha: f });
      txt(ctx, env, `roll ${sgn(VT.roll[d])} · the mean of three`, 1220, VOTE_Y + 154, 12, { c: C.muted, alpha: f });
    }),
  },
  {
    id: 'drums', stage: 'Vote', title: 'Every other drum goes through the same machinery', dur: 8,
    body: 'The other five cells take the same trip: three readers each, then the vote. Six averaged answers line up before the carry rule. Drum 3 is the least sure, a 9 at 71.5 %, because reader 3 saw a 0 and was outvoted.',
    view: { x: PX + RX, y: PAN.cut.y - 20, w: PW, h: 3420 },
    draw: right((ctx, env, p) => {
      for (let i = 0; i < 6; i++) {
        const slot = drumSlot(i);
        const t = i === 5 ? seg(p, 0.55, 0.75) : seg(p, i * 0.09, i * 0.09 + 0.45);
        const from: Rect = i === 5 ? { x: 120, y: VOTE_Y + 40, w: 64, h: 128 } : cellAt(i);
        const to: Rect = { x: slot.x, y: slot.y, w: 44, h: 88 };
        if (t <= 0) continue;
        // a bezier through the readers
        const e = t, mx = i === 5 ? 120 : 90, my = PAN.reader2.y;
        const x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * mx + e * e * to.x, y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * my + e * e * to.y;
        const big = t < 1 ? Math.min(2.2, Math.max(1, 0.3 / env.scale)) : 1;
        const r = { x, y, w: lerp(from.w, to.w, e) * big, h: lerp(from.h, to.h, e) * big };
        if (i !== 5 || t < 1) { frame(ctx, env, r, { hot: t < 1 }); tile(ctx, env, cutFeats, i, r, { pixel: false }); }
        if (t >= 1) {
          frame(ctx, env, to); tile(ctx, env, cutFeats, i, to, { pixel: false });
          const mean = ENS[i], mi = mean.indexOf(Math.max(...mean));
          const g = i === 5 ? seg(p, 0.75, 0.9) : seg(p, i * 0.09 + 0.45, i * 0.09 + 0.6);
          bars(ctx, env, mean, { x: slot.x + 56, y: slot.y + 10, w: 120, h: 60 }, { hi: mi, base: 0, alpha: g, grow: g });
          txt(ctx, env, `${mi}`, slot.x + 56, slot.y + 100, 26, { font: SERIF, c: VT.conf[i] === VT.minconf ? C.red : C.ink, alpha: g });
          txt(ctx, env, pct(VT.conf[i]), slot.x + 82, slot.y + 100, 14, { font: MONO, c: VT.conf[i] === VT.minconf ? C.red : C.muted, alpha: g });
          txt(ctx, env, `drum ${i + 1}`, slot.x + 22, slot.y + 104, 10, { a: 'center', c: C.dim, alpha: g });
        }
      }
      const f = seg(p, 0.9, 1);
      txt(ctx, env, 'the least sure drum: reader 3 read a 0 and was outvoted', drumSlot(2).x + 56, DRUMS_Y + 128, 11, { c: C.red, alpha: f });
    }),
  },
  {
    id: 'carry', stage: 'Vote', title: 'The carry rule, then the reading', dur: 9,
    body: 'A drum may only be mid-roll if the drum to its right is on 9 or 0, or it is the last drum. Then its roll is trusted and the digit may step on. If the right drum sits on 1 to 8, this drum is locked to its nearest digit. That is what keeps 79 rolling to 80 from reading as 89. Here every roll is inside the dead band, so each drum keeps its digit: 0092.07.',
    view: { x: PX + RX, y: DRUMS_Y - 20, w: PW, h: 800 },
    draw: right((ctx, env, p) => {
      const a1 = segL(p, 0, 0.3), a2 = segL(p, 0.3, 0.62), a3 = seg(p, 0.64, 0.8), a4 = seg(p, 0.8, 1);
      for (let i = 0; i < 6; i++) {
        const slot = drumSlot(i), x = slot.x, n = VT.near[i], last = i === 5, right = VT.near[i + 1];
        const free = last || right === 0 || right === 9, roll = VT.roll[i];
        const ra = seg(a1, i * 0.12, i * 0.12 + 0.4);
        // roll slider
        txt(ctx, env, sgn(roll), x + 150, CARRY_Y + 20, 13, { a: 'center', font: MONO, c: C.ink, alpha: ra });
        rect(ctx, env, { x: x + 142, y: CARRY_Y + 30, w: 16, h: 60 }, { fill: C.sunken, rad: 3, alpha: ra });
        rect(ctx, env, { x: x + 142, y: CARRY_Y + 45, w: 16, h: 30 }, { fill: '#2a2726', alpha: ra });
        rect(ctx, env, { x: x + 138, y: CARRY_Y + 59 + roll * 120, w: 24, h: 3 }, { fill: C.red, alpha: ra });
        txt(ctx, env, Math.abs(roll) < (last ? VT.dead_last : VT.dead) ? 'in band' : 'past band', x + 150, CARRY_Y + 104, 10, { a: 'center', c: C.dim, alpha: ra });
        // the rule arrow from the right neighbour
        const ca = seg(a2, i * 0.1, i * 0.1 + 0.4);
        const col = free ? '#e7e4e1' : C.red;
        if (ca > 0) {
          line(ctx, env, x + 40, CARRY_Y + 150, x + 40, CARRY_Y + 125, { c: col, w: 2, alpha: ca });
          line(ctx, env, x + 40, CARRY_Y + 125, x + (last ? 60 : 240 + 40), CARRY_Y + 125, { c: col, w: 2, alpha: ca, dash: last ? undefined : [4, 3] });
          txt(ctx, env, last ? 'free · last drum' : free ? 'free · right drum on 9 or 0' : 'lock · right drum on 1 to 8', x + 50, CARRY_Y + 118, 11, { c: col, alpha: ca });
        }
        // the drum card
        rect(ctx, env, { x, y: CARRY_Y + 150, w: 80, h: 120 }, { fill: a3 > 0.5 ? col : '#e7e4e1', rad: 8, alpha: ra });
        rect(ctx, env, { x: x + 14, y: CARRY_Y + 164, w: 52, h: 92 }, { fill: '#121110', rad: 4, alpha: ra });
        txt(ctx, env, String(n), x + 40, CARRY_Y + 232, 56, { a: 'center', w: 700, c: C.white, alpha: ra });
        txt(ctx, env, free ? `${n} → ${(n + 1) % 10} allowed` : `${n}, absolute`, x + 40, CARRY_Y + 292, 11, { a: 'center', c: free ? C.muted : C.red, alpha: a3 });
      }
      txt(ctx, env, '79 rolling to 80 could read as 89: the rule picks the preceding number instead', 170, CARRY_Y + 316, 12, { c: C.dim, alpha: a3 * (1 - a4) });
      // the reading
      const W: Rect = { x: 120, y: READ_Y + 30, w: 400, h: 132 };
      frame(ctx, env, W, { alpha: a4 }); img(ctx, env, 'vote-window.webp', W, { alpha: a4 });
      VT.near.forEach((n, i) => txt(ctx, env, String(n), W.x + W.w * ((CT.cuts[i] + CT.cuts[i + 1]) / 2 / CT.win_w), READ_Y + 18, 22, { a: 'center', w: 700, c: i >= VT.dot ? C.red : C.ink, alpha: a4 }));
      VT.conf.forEach((c, i) => txt(ctx, env, pct(c), W.x + W.w * ((CT.cuts[i] + CT.cuts[i + 1]) / 2 / CT.win_w), READ_Y + 182, 10, { a: 'center', font: MONO, c: c === VT.minconf ? C.red : C.muted, alpha: a4 }));
      arrow(ctx, env, 540, READ_Y + 96, 580, READ_Y + 96, { alpha: a4 });
      txt(ctx, env, VT.text.slice(0, VT.dot), 600, READ_Y + 120, 84, { font: SERIF, w: 700, alpha: a4 });
      txt(ctx, env, VT.text.slice(VT.dot), 600 + 4 * 54, READ_Y + 120, 84, { font: SERIF, w: 700, c: C.red, alpha: a4 });
      txt(ctx, env, 'cubic metres · confidence 71.5 %, the least sure of the 6 drums', 600, READ_Y + 150, 13, { c: C.muted, alpha: a4 });
      chip(ctx, env, pct(VT.minconf), 600, READ_Y + 170, 80, 30, { hot: true, alpha: a4 }); txt(ctx, env, '<', 696, READ_Y + 191, 16, { c: C.muted, alpha: a4 });
      chip(ctx, env, '80 %', 716, READ_Y + 170, 64, 30, { alpha: a4 }); arrow(ctx, env, 790, READ_Y + 185, 830, READ_Y + 185, { alpha: a4 });
      txt(ctx, env, 'second route: rerun with WindowNet', 840, READ_Y + 191, 15, { w: 700, alpha: a4 });
    }),
  },
  {
    id: 'finale', stage: 'DrumNet V10', title: 'The whole machine, running', dur: 14,
    body: 'Every stage at once, one more time: the thumbnail into the spotter, the crop through the refiner twice, the window into six cells, three readers each, the vote and the carry rule. About two seconds on the reader for one number.',
    view: { x: 0, y: 0, w: MAP.w, h: MAP.h }, full: true,
    draw: () => {},
  },
];
