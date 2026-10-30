/* The DrumNet film: one world map of the whole V10 architecture, laid out
   like the report's diagram, and a list of scenes that each animate one stage
   as a pure function of their progress p (0 → 1). The camera view of each
   scene is a rectangle of that map. Panels are revealed as the film reaches
   them. Numbers and maps are the real run's (drumnet-data.ts), the same run
   the report figures were drawn from; readers 2 and 3 and the other drums
   reuse reader 1's feature maps and units, their digits and rolls are real. */
import { DN } from '../drumnet-data';
import { C, SERIF, MONO, type Ctx, type Env, type Rect, type Strip, arrow, bars, chip, clamp01, drawNet, ease, eyebrow, fmt, frame, grid, hexRows, img, lerp, lerpRect, line, netLayout, norm, pct, ramp, rect, seg, segL, sgn, stackRight, strip1d, tile, txt, lw } from './draw';

export const MAP = { w: 3460, h: 6260 };
export type Scene = {
  id: string; stage: string; title: string; body: string; dur: number; view: Rect;
  full?: boolean;                 // the whole revealed map, beside the caption
  until?: string;                 // stop drawing once this scene has started (not in the finale)
  draw: (ctx: Ctx, env: Env, p: number) => void;
  finale?: (ctx: Ctx, env: Env, p: number) => void;   // what to draw in the finale instead of draw
};
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
const MEMBERS = VT.members as unknown as Array<{ probs: number[][]; rolls: number[] }>;
const ENS = VT.ens_probs as unknown as number[][];
/* a reader's answer for one drum: reader 1 on drum 6 has measured scores, the rest are derived from the probabilities (softmax is reversible up to a constant) */
type Answer = { probs: number[]; logits: number[]; e: number[]; esum: number; emax: number; best: number; roll: number; rollScore: number; measured: boolean };
const answer = (k: number, i: number): Answer => {
  const probs = MEMBERS[k].probs[i], best = probs.indexOf(Math.max(...probs)), roll = MEMBERS[k].rolls[i];
  const measured = k === 0 && i === 5;
  const logits = measured ? (RD.logits as unknown as number[]) : probs.map((q) => Math.log(Math.max(q, 1e-5)) + 7.1 - Math.log(probs[best]));
  const e = logits.map((l) => Math.exp(l)), esum = e.reduce((a, b) => a + b, 0), emax = Math.max(...e);
  const r2 = Math.max(-0.499, Math.min(0.499, roll));
  return { probs, logits, e, esum, emax, best, roll, rollScore: measured ? RD.rollh.score : Math.atanh(2 * r2), measured };
};

/* ── layout ── */
const PX = 40, PW = 1620;
const RH = 1460;
export const PAN = {
  input: { x: PX, y: 0, w: PW, h: 440, title: 'Input', sub: 'one photo from the reader' },
  spotter: { x: PX, y: 520, w: PW, h: 760, title: 'DetNet Spotter', sub: 'a rough box around the digit window' },
  ref1: { x: PX, y: 1360, w: PW, h: 1000, title: 'RefNet Refiner · pass 1', sub: 'pin the four edges inside the rough box' },
  ref2: { x: PX, y: 2440, w: PW, h: 1000, title: 'RefNet Refiner · pass 2', sub: 'expand, crop again, the same network again' },
  cut: { x: PX + RX, y: 0, w: PW, h: 360, title: 'Cut into digits', sub: 'one cell per drum' },
  reader1: { x: PX + RX, y: 440, w: PW, h: RH, title: 'DrumNet Reader 1', sub: 'which digit shows, and how far it has turned' },
  reader2: { x: PX + RX, y: 440 + RH + 80, w: PW, h: RH, title: 'DrumNet Reader 2', sub: 'the same net, a different random start' },
  reader3: { x: PX + RX, y: 440 + 2 * (RH + 80), w: PW, h: RH, title: 'DrumNet Reader 3', sub: 'the tie breaker' },
  vote: { x: PX + RX, y: 440 + 3 * (RH + 80), w: PW, h: 1160, title: 'Ensemble vote and reading', sub: 'average, carry rule, reading' },
};
export type PanelKey = keyof typeof PAN;
/* the scene at which each panel appears */
export const REVEAL: Record<PanelKey, string> = { input: 'downscale', spotter: 'spot-net', ref1: 'spot-crop', ref2: 'ref-pass2', cut: 'cut', reader1: 'cut', reader2: 'readers3', reader3: 'readers3', vote: 'vote' };

const PHOTO: Rect = { x: 330, y: 50, w: 480, h: 360 };
const THUMB: Rect = { x: 1010, y: 158, w: 192, h: 144 };
const SPOT_NET = netLayout(120, PAN.spotter.y + 40, 280, 160, 120, [
  { strip: spotStrips[0], w: 150, h: 112, n: 8, label: 'block 1', sub: '160 × 120', weights: 80 },
  { strip: spotStrips[1], w: 110, h: 83, n: 16, label: 'block 2', sub: '80 × 60', weights: 1168 },
  { strip: spotStrips[2], w: 80, h: 60, n: 24, label: 'block 3', sub: '40 × 30', weights: 3480 },
  { strip: spotStrips[3], w: 60, h: 45, n: 32, label: 'block 4', sub: '20 × 15', weights: 6944 },
  { strip: spotStrips[4], w: 48, h: 34, n: 32, label: 'block 5', sub: '10 × 7', weights: 9248 },
], 70);
const ISO = { ox: 300, oy: 900, cell: 28, gap: 66, kx: -0.85, ky: 0.52 };
const SPOT_PHOTO: Rect = { x: 1210, y: 900, w: 400, h: 300 };
const refNet = (y0: number, strips: Strip[]) => netLayout(120, y0 + 40, 240, 320, 120, [
  { strip: strips[0], w: 200, h: 75, n: 8, label: 'block 1', sub: '128 × 48', weights: 80 },
  { strip: strips[1], w: 150, h: 56, n: 16, label: 'block 2', sub: '64 × 24', weights: 1168 },
  { strip: strips[2], w: 112, h: 42, n: 32, label: 'block 3', sub: '32 × 12', weights: 4640 },
  { strip: strips[3], w: 112, h: 42, n: 32, label: 'block 4', sub: '32 × 12 · no pool', weights: 9248 },
], 64);
const REF1_NET = refNet(PAN.ref1.y, PD1.strips), REF2_NET = refNet(PAN.ref2.y, PD2.strips);
const CUBE = (y0: number) => ({ x: 120, y: y0 + 390, cell: 10, dx: 3, dy: -2.2 });
const COLMAP = (y0: number) => ({ x: 640, y: y0 + 340, cell: 8 });
const ROWMAP = (y0: number) => ({ x: 1000, y: y0 + 340, cell: 8 });
const CROP = (y0: number): Rect => ({ x: 560, y: y0 + 700, w: 512, h: 192 });
const SMALLCOL = (y0: number): Rect => ({ x: 120, y: y0 + 660, w: 128, h: 128 });
const SMALLROW = (y0: number): Rect => ({ x: 120, y: y0 + 850, w: 128, h: 48 });
const WIN: Rect = { x: 120, y: PAN.cut.y + 80, w: 492, h: 162 };
const cellAt = (i: number): Rect => ({ x: 760 + i * 96, y: PAN.cut.y + 70, w: 64, h: 128 });
/* a reader panel's internals, relative to its top */
const R = (y0: number) => ({
  net: netLayout(120, y0 + 40, 300, 96, 192, [
    { strip: rdStrips[0], w: 72, h: 144, n: 16, label: 'block 1', sub: '16 × 32', weights: 160 },
    { strip: rdStrips[1], w: 56, h: 112, n: 48, label: 'block 2', sub: '8 × 16', weights: 6960 },
    { strip: rdStrips[2], w: 44, h: 88, n: 96, label: 'block 3', sub: '4 × 8', weights: 41568 },
    { strip: rdStrips[3], w: 36, h: 72, n: 96, label: 'block 4', sub: '2 × 4', weights: 83040 },
  ], 80),
  flat: y0 + 380, dense: y0 + 640, digit: y0 + 860, roll: y0 + 1232, note: y0 + RH - 24,
});
const RP = [R(PAN.reader1.y), R(PAN.reader2.y), R(PAN.reader3.y)];
const VOTE_Y = PAN.vote.y + 40, DRUMS_Y = PAN.vote.y + 380, CARRY_Y = PAN.vote.y + 550, READ_Y = PAN.vote.y + 930;
const drumSlot = (i: number) => ({ x: 170 + i * 240, y: DRUMS_Y + 10 });

const inPhoto = (Rr: Rect, b: readonly number[]): Rect => ({ x: Rr.x + (b[0] / 800) * Rr.w, y: Rr.y + (b[1] / 600) * Rr.h, w: (b[2] / 800) * Rr.w, h: (b[3] / 600) * Rr.h });
const photoSrc = (b: readonly number[]): Rect => ({ x: b[0], y: b[1], w: b[2], h: b[3] });
const isoPt = (layer: number, r: number, c: number) => ({ x: ISO.ox + (c + 0.5) * ISO.cell + ISO.kx * (r + 0.5) * ISO.cell, y: ISO.oy + layer * ISO.gap + ISO.ky * (r + 0.5) * ISO.cell });

/* ── the skeleton: the panels revealed so far and the arrows between them ── */
export function skeleton(ctx: Ctx, env: Env, alphaOf: (k: PanelKey) => number) {
  const keys = Object.keys(PAN) as PanelKey[];
  keys.forEach((k) => {
    const p = PAN[k], a = alphaOf(k);
    if (a <= 0) return;
    const ts = Math.min(Math.max(28, 14 / env.scale), p.w / (p.title.length * 0.64));
    rect(ctx, env, p, { fill: C.panel, stroke: C.line, rad: 14, w: 1.2, alpha: a });
    txt(ctx, env, p.title, p.x + 36, p.y + 18 + ts, ts, { font: SERIF, c: C.ink, alpha: a });
    if (env.scale > 0.3) {
      ctx.font = `400 ${ts}px ${SERIF}`;
      txt(ctx, env, p.sub, p.x + 36 + ctx.measureText(p.title).width + 18, p.y + 18 + ts, 14, { c: C.muted, alpha: a });
    }
  });
  const chain = (ks: PanelKey[]) => ks.forEach((k, i) => {
    if (i === ks.length - 1) return;
    const a = Math.min(alphaOf(k), alphaOf(ks[i + 1])); if (a <= 0) return;
    const p = PAN[k], n = PAN[ks[i + 1]];
    arrow(ctx, env, p.x + 810, p.y + p.h + 6, p.x + 810, n.y - 8, { c: '#5a5450', w: 2, head: 10, alpha: a });
  });
  chain(['input', 'spotter', 'ref1', 'ref2']);
  chain(['cut', 'reader1', 'reader2', 'reader3', 'vote']);
  const ca = Math.min(alphaOf('ref2'), alphaOf('cut'));
  if (ca > 0) {
    const r2 = PAN.ref2, cut = PAN.cut;
    ctx.save(); ctx.globalAlpha *= ca; ctx.strokeStyle = '#5a5450'; lw(ctx, env, 2); ctx.beginPath();
    ctx.moveTo(r2.x + r2.w + 6, r2.y + r2.h / 2); ctx.lineTo(cut.x - 50, r2.y + r2.h / 2); ctx.lineTo(cut.x - 50, cut.y + cut.h / 2); ctx.stroke(); ctx.restore();
    arrow(ctx, env, cut.x - 50, cut.y + cut.h / 2, cut.x - 8, cut.y + cut.h / 2, { c: '#5a5450', w: 2, head: 10, alpha: ca });
  }
  const ba = Math.min(alphaOf('cut'), alphaOf('reader3'));
  if (ba > 0) {
    const cut = PAN.cut;
    line(ctx, env, cut.x + 30, PAN.reader1.y + 230, cut.x + 30, PAN.reader3.y + 230, { c: '#5a5450', w: 2, alpha: ba });
    ([PAN.reader1, PAN.reader2, PAN.reader3]).forEach((r) => arrow(ctx, env, cut.x + 30, r.y + 230, cut.x + 72, r.y + 230, { c: '#5a5450', w: 2, alpha: ba }));
  }
}
/* the box around every revealed panel, for the zoomed-out view */
export function revealedBounds(alphaOf: (k: PanelKey) => number): Rect {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  (Object.keys(PAN) as PanelKey[]).forEach((k) => { if (alphaOf(k) <= 0) return; const p = PAN[k]; x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + p.w); y1 = Math.max(y1, p.y + p.h); });
  if (!isFinite(x0)) return { x: 0, y: 0, w: MAP.w, h: MAP.h };
  return { x: x0 - 40, y: y0 - 40, w: x1 - x0 + 80, h: y1 - y0 + 80 };
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
function squash(ctx: Ctx, env: Env, y0: number, slice: number[][], s: number, t: number) {
  const k = CUBE(y0), cm = COLMAP(y0), rm = ROWMAP(y0);
  const fx = k.x + s * k.dx, fy = k.y + s * k.dy;
  const e = ease(t);
  ctx.save();
  ctx.translate(lerp(fx, cm.x, e), lerp(fy, cm.y + s * cm.cell, e));
  ctx.scale(lerp(1, cm.cell / k.cell, e), lerp(1, cm.cell / (12 * k.cell), e));
  grid(ctx, env, slice, 0, 0, k.cell, { gap: 0 });
  ctx.restore();
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
function refAvg(ctx: Ctx, env: Env, y0: number, D: ReturnType<typeof passData>, p: number) {
  const k = CUBE(y0);
  txt(ctx, env, 'block 4 · 32 maps · 32 × 12', k.x, k.y - 92, 14, { c: C.muted });
  const first = segL(p, 0, 0.32);
  const restT = segL(p, 0.32, 0.9);
  const peeled = p < 0.32 ? 0 : Math.min(32, 1 + Math.floor(restT * 31 + 1e-6));
  cube(ctx, env, y0, D.slices, Math.min(31, peeled === 0 ? (first > 0 ? 1 : 0) : Math.min(32, peeled + 1)));
  avgMaps(ctx, env, y0, D, peeled);
  if (first > 0 && peeled === 0) squash(ctx, env, y0, D.slices[0], 0, first);
  if (peeled > 0 && peeled < 32) { const s = peeled; const lt = (restT * 31) % 1; squash(ctx, env, y0, D.slices[s], s, lt); }
  if (peeled >= 32) avgMaps(ctx, env, y0, D, 32);
  if (p < 0.32) { txt(ctx, env, 'map 1 peels off: each of its 32 columns averages to one value,', 560, k.y - 110, 13, { c: C.red, alpha: clamp01(first * 3) }); txt(ctx, env, 'and each of its 12 rows to one value', 560, k.y - 92, 13, { c: C.red, alpha: clamp01(first * 3) }); }
  else if (p < 0.9) txt(ctx, env, `map ${Math.min(32, peeled + 1)} of 32`, 560, k.y - 92, 13, { c: C.red });
}
/* a copy of a map morphing from its own box into a strip's box */
function morph(ctx: Ctx, env: Env, rows: number[][], from: Rect, to: Rect, t: number, alpha = 1) {
  const e = ease(t);
  const r = lerpRect(from, to, e);
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.translate(r.x, r.y); ctx.scale(r.w / from.w, r.h / from.h);
  grid(ctx, env, rows, 0, 0, from.w / rows[0].length, { gap: 0, cellH: from.h / rows.length });
  ctx.restore();
}
/* the refiner's heads: the two average maps morph into the eight strips around the crop, the highest scores light, the box is drawn */
function refHeads(ctx: Ctx, env: Env, y0: number, P: Pass, D: ReturnType<typeof passData>, p: number, boxC: string) {
  const cr = CROP(y0), sc = SMALLCOL(y0), sr = SMALLROW(y0);
  const e = P.edges;
  const a0 = segL(p, 0, 0.42), a2 = seg(p, 0.44, 0.6), a3 = seg(p, 0.62, 0.82), a4 = seg(p, 0.84, 1);
  cropTile(ctx, env, P.crop, cr);
  grid(ctx, env, D.col, sc.x, sc.y, 4);
  txt(ctx, env, 'column averages', sc.x + 64, sc.y + sc.h + 16, 12, { a: 'center', c: C.muted });
  const rowRows = Array.from({ length: 12 }, (_, r) => D.row.map((row) => row[r]));
  grid(ctx, env, rowRows, sr.x, sr.y, 4);
  txt(ctx, env, 'row averages', sr.x + 64, sr.y + sr.h + 16, 12, { a: 'center', c: C.muted });
  ([[sc, 'same weights for every column'], [sr, 'same weights for every row']] as Array<[Rect, string]>).forEach(([q, note]) => {
    const cy = q.y + q.h / 2, al = clamp01(a0 * 3);
    arrow(ctx, env, 260, cy, 300, cy, { alpha: al });
    rect(ctx, env, { x: 306, y: cy - 16, w: 92, h: 32 }, { stroke: C.red, rad: 6, w: 1.4, alpha: al, fill: C.chip });
    txt(ctx, env, '1 × 1 conv', 352, cy + 5, 13, { a: 'center', c: C.red, w: 700, alpha: al });
    txt(ctx, env, '32 in, 4 out', 306, cy + 34, 11, { c: C.dim, alpha: al });
    txt(ctx, env, note, 306, cy + 48, 11, { c: C.dim, alpha: al });
  });
  const cw = cr.w / 32, ch = cr.h / 12, sh = 16;
  type S = { vals: number[]; box: Rect; v: boolean; hi: number; dashed: boolean; name: string; lx: number; ly: number; la: CanvasTextAlign; src: Rect; rows: number[][] };
  const strips: S[] = [
    { vals: D.colHead[0], box: { x: cr.x, y: cr.y - 56, w: cr.w, h: sh }, v: false, hi: e.left.cell, dashed: false, name: 'left score', lx: cr.x + cr.w + 104, ly: cr.y - 44, la: 'left', src: sc, rows: D.col },
    { vals: D.colHead[1], box: { x: cr.x, y: cr.y - 34, w: cr.w, h: sh }, v: false, hi: e.left.cell, dashed: true, name: 'left offset', lx: cr.x + cr.w + 104, ly: cr.y - 22, la: 'left', src: sc, rows: D.col },
    { vals: D.colHead[2], box: { x: cr.x, y: cr.y + cr.h + 18, w: cr.w, h: sh }, v: false, hi: e.right.cell, dashed: false, name: 'right score', lx: cr.x + cr.w + 64, ly: cr.y + cr.h + 30, la: 'left', src: sc, rows: D.col },
    { vals: D.colHead[3], box: { x: cr.x, y: cr.y + cr.h + 40, w: cr.w, h: sh }, v: false, hi: e.right.cell, dashed: true, name: 'right offset', lx: cr.x + cr.w + 64, ly: cr.y + cr.h + 52, la: 'left', src: sc, rows: D.col },
    { vals: D.rowHead[0], box: { x: cr.x - 56, y: cr.y, w: sh, h: cr.h }, v: true, hi: e.top.cell, dashed: false, name: 'top score', lx: cr.x - 48, ly: cr.y + cr.h + 16, la: 'center', src: sr, rows: rowRows },
    { vals: D.rowHead[1], box: { x: cr.x - 34, y: cr.y, w: sh, h: cr.h }, v: true, hi: e.top.cell, dashed: true, name: 'top offset', lx: cr.x - 26, ly: cr.y + cr.h + 30, la: 'center', src: sr, rows: rowRows },
    { vals: D.rowHead[2], box: { x: cr.x + cr.w + 18, y: cr.y, w: sh, h: cr.h }, v: true, hi: e.bottom.cell, dashed: false, name: 'bottom score', lx: cr.x + cr.w + 26, ly: cr.y - 24, la: 'center', src: sr, rows: rowRows },
    { vals: D.rowHead[3], box: { x: cr.x + cr.w + 40, y: cr.y, w: sh, h: cr.h }, v: true, hi: e.bottom.cell, dashed: true, name: 'bottom offset', lx: cr.x + cr.w + 48, ly: cr.y - 10, la: 'center', src: sr, rows: rowRows },
  ];
  strips.forEach((s, j) => {
    const t = seg(a0, j * 0.09, j * 0.09 + 0.4);
    if (t <= 0) return;
    if (t < 1) { morph(ctx, env, s.rows, s.src, s.box, t, 0.9); return; }
    if (s.v) strip1d(ctx, env, s.vals, s.box.x, s.box.y, ch, sh, { vertical: true, hi: a2 > 0.5 ? s.hi : undefined, dashed: s.dashed });
    else strip1d(ctx, env, s.vals, s.box.x, s.box.y, cw, sh, { hi: a2 > 0.5 ? s.hi : undefined, dashed: s.dashed });
    txt(ctx, env, s.name, s.lx, s.ly, 10.5, { c: C.muted, a: s.la });
  });
  txt(ctx, env, 'solid: the highest score · dotted: its offset · the line: where in the cell the edge is', cr.x + cr.w / 2, cr.y + cr.h + 80, 12, { a: 'center', c: C.dim, alpha: a2 });
  const lx = cr.x + e.left.frac * cr.w, rx = cr.x + e.right.frac * cr.w, ty = cr.y + e.top.frac * cr.h, by = cr.y + e.bottom.frac * cr.h;
  if (a3 > 0) {
    line(ctx, env, lx, cr.y - 18, lx, lerp(cr.y - 18, cr.y + cr.h, a3), { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, rx, cr.y + cr.h + 18, rx, lerp(cr.y + cr.h + 18, cr.y, a3), { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, cr.x - 18, ty, lerp(cr.x - 18, cr.x + cr.w, a3), ty, { c: C.red, dash: [5, 4], w: 1.4 });
    line(ctx, env, cr.x + cr.w + 18, by, lerp(cr.x + cr.w + 18, cr.x, a3), by, { c: C.red, dash: [5, 4], w: 1.4 });
  }
  if (a4 > 0) {
    rect(ctx, env, { x: lx, y: ty, w: rx - lx, h: by - ty }, { stroke: boxC, w: 3, alpha: a4 });
    txt(ctx, env, `${P.box[2]} × ${P.box[3]} px`, rx + 8, ty - 8, 13, { c: boxC, alpha: a4 });
  }
}
function refNetDraw(ctx: Ctx, env: Env, L: ReturnType<typeof refNet>, P: Pass, p: number) {
  drawNet(ctx, env, L, p, (r) => { cropTile(ctx, env, P.crop, r); txt(ctx, env, 'crop · 256 × 96 grey', r.x + r.w / 2, r.y + r.h + 24, 13, { a: 'center', c: C.muted }); });
}

/* ── the reader, as functions of a reader k and a drum i ── */
function readerNet(ctx: Ctx, env: Env, k: number, i: number, p: number) {
  const L = RP[k].net;
  drawNet(ctx, env, L, p, (r) => { frame(ctx, env, r); tile(ctx, env, cutFeats, i, r, { pixel: false }); txt(ctx, env, `drum ${i + 1} · 32 × 64`, r.x + r.w / 2, r.y + r.h + 24, 13, { a: 'center', c: C.muted }); });
  if (k > 0) txt(ctx, env, 'maps and units shown are reader 1’s; the digit and roll are this reader’s own', 120, RP[k].note, 11, { c: C.dim });
}
function readerFlatten(ctx: Ctx, env: Env, k: number, p: number) {
  const FY = RP[k].flat;
  const sx = 120, sy = FY + 100;
  const first = seg(p, 0, 0.12), u = segL(p, 0.14, 0.42), rest = segL(p, 0.44, 0.9);
  const taken = rest > 0 ? 1 + Math.floor(rest * 95) : (u > 0 || first >= 1 ? 1 : 0);
  const remaining = 96 - taken;
  for (let q = remaining - 1; q >= 1; q--) rect(ctx, env, { x: sx + q * 2.2, y: sy - q * 0.9, w: 20, h: 40 }, { fill: '#1a1a22', stroke: '#3a3a46', w: 0.6 });
  const big: Rect = { x: 470, y: FY + 40, w: 36, h: 72 };
  const start: Rect = { x: sx, y: sy, w: 20, h: 40 };
  if (rest < 1) { const pull = lerpRect(start, big, first); rect(ctx, env, { x: pull.x - 1, y: pull.y - 1, w: pull.w + 2, h: pull.h + 2 }, { fill: C.sunken, stroke: C.red, w: 1.5 }); }
  txt(ctx, env, `block 4 · ${remaining} of 96 maps left`, sx, sy + 66, 13, { c: C.muted });
  const cell = 18, lineX = 560, lineY = FY + 70;
  if (first >= 1 && rest < 1) C4[0].forEach((row, r) => row.forEach((v, c) => {
    const ci = r * 2 + c;
    const ct = seg(u, ci * 0.1, ci * 0.1 + 0.3);
    const fx = big.x + c * cell, fy = big.y + r * cell, tx = lineX + ci * cell, ty = lineY;
    const x = lerp(fx, tx, ct), y = lerp(fy, ty, ct);
    ctx.save(); ctx.fillStyle = ramp(v); ctx.fillRect(x, y, cell - 1, cell - 1); ctx.restore();
    txt(ctx, env, String(ci + 1), x + cell / 2, y + 13, 10, { a: 'center', c: C.hi });
  }));
  txt(ctx, env, 'row by row', lineX + 4 * cell, lineY - 8, 11, { a: 'center', c: C.dim, alpha: u * (1 - rest) });
  txt(ctx, env, 'map 1 → list positions 1 to 8', lineX + 8 * cell + 12, lineY + 13, 11.5, { c: C.muted, alpha: seg(u, 0.6, 1) * (1 - rest) });
  const LIST: Rect = { x: 560, y: FY + 140, w: 1024, h: 48 };
  const filled = rest > 0 ? 8 * taken : (u >= 1 ? 8 : 0);
  const cw = LIST.w / 128, chh = LIST.h / 6;
  rect(ctx, env, { x: LIST.x - 2, y: LIST.y - 2, w: LIST.w + 4, h: LIST.h + 4 }, { stroke: '#45403f', rad: 2 });
  ctx.save();
  for (let q = 0; q < Math.min(768, filled); q++) { ctx.fillStyle = ramp(FLAT[q]); ctx.fillRect(LIST.x + (q % 128) * cw, LIST.y + Math.floor(q / 128) * chh, cw - 0.6, chh - 0.6); }
  ctx.restore();
  if (rest > 0 && rest < 1) {
    const m = taken - 1;
    const from = { x: sx + 10, y: sy + 20 }, to = { x: LIST.x + ((m * 8) % 128) * cw, y: LIST.y + Math.floor((m * 8) / 128) * chh };
    line(ctx, env, from.x, from.y, to.x, to.y, { c: C.red, w: 1.2, alpha: 0.7 });
    txt(ctx, env, `map ${m + 1}`, to.x, to.y - 6, 10, { c: C.red });
  }
  txt(ctx, env, `one list · ${Math.min(768, filled)} numbers`, LIST.x, LIST.y + LIST.h + 20, 13, { c: C.muted });
}
function readerDense(ctx: Ctx, env: Env, k: number, p: number) {
  const DY = RP[k].dense, d = RD.dense;
  const D768 = { x: 120, y: DY + 30, cell: 6 }, U96 = { x: 1000, y: DY + 30, cell: 18 };
  const a1 = segL(p, 0, 0.4), a2 = segL(p, 0.42, 0.9), a3 = seg(p, 0.9, 1);
  ctx.save();
  for (let q = 0; q < 768; q++) { ctx.fillStyle = ramp(FLAT[q]); ctx.fillRect(D768.x + (q % 32) * D768.cell, D768.y + Math.floor(q / 32) * D768.cell, D768.cell - 0.6, D768.cell - 0.6); }
  ctx.restore();
  txt(ctx, env, '768 numbers', D768.x + 96, D768.y + 164, 13, { a: 'center', c: C.muted });
  const sig = { x: 470, y: DY + 100 };
  txt(ctx, env, '×', 330, sig.y + 8, 22, { a: 'center', c: C.muted });
  rect(ctx, env, { x: 350, y: sig.y - 20, w: 60, h: 40 }, { fill: C.chip, stroke: '#45403f', rad: 6 });
  txt(ctx, env, 'Wt', 380, sig.y + 6, 16, { a: 'center', w: 700 });
  txt(ctx, env, 'one weight per number', 380, sig.y + 36, 11, { a: 'center', c: C.dim });
  ctx.save(); ctx.fillStyle = C.chip; ctx.strokeStyle = C.red; lw(ctx, env, 1.4); ctx.beginPath(); ctx.arc(sig.x, sig.y, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
  txt(ctx, env, 'Σ', sig.x, sig.y + 7, 18, { a: 'center', c: C.red, w: 700 });
  if (a1 > 0 && a1 < 1) {
    const n = Math.floor(a1 * 60);
    for (let q = 0; q < n; q++) { const i = (q * 131) % 768; line(ctx, env, D768.x + (i % 32) * D768.cell + 3, D768.y + Math.floor(i / 32) * D768.cell + 3, sig.x - 18, sig.y, { c: C.red, w: 0.6, alpha: 0.35 }); }
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
  rect(ctx, env, { x: U96.x - 3, y: U96.y - 3, w: 12 * U96.cell + 6, h: 8 * U96.cell + 6 }, { stroke: '#45403f', rad: 3 });
  const done = a2 > 0 ? Math.floor(a2 * 96) : 0;
  for (let i = 0; i < 96; i++) {
    const on = i === d.unit ? a1 >= 1 : i < done;
    if (!on) continue;
    ctx.save(); ctx.fillStyle = ramp(UNITS[i]); ctx.fillRect(U96.x + (i % 12) * U96.cell, U96.y + Math.floor(i / 12) * U96.cell, U96.cell - 1, U96.cell - 1); ctx.restore();
  }
  if (a1 >= 1) rect(ctx, env, { x: U96.x + (d.unit % 12) * U96.cell - 1.5, y: U96.y + Math.floor(d.unit / 12) * U96.cell - 1.5, w: U96.cell + 2, h: U96.cell + 2 }, { stroke: C.red, w: 2 });
  if (a2 > 0 && a2 < 1) { const i = Math.min(95, done); line(ctx, env, cx + 2, uy, U96.x + (i % 12) * U96.cell + 9, U96.y + Math.floor(i / 12) * U96.cell + 9, { c: C.red, w: 1, alpha: 0.6 }); txt(ctx, env, `unit ${i + 1}`, 700, uy + 70, 12, { c: C.red }); }
  txt(ctx, env, '96 units', U96.x + 6 * U96.cell, U96.y + 8 * U96.cell + 20, 13, { a: 'center', c: C.muted });
  txt(ctx, env, `${fmt(RD.weights.fc)} weights · ${RD.nz} of the 96 are above zero for this drum`, U96.x + 6 * U96.cell, U96.y + 8 * U96.cell + 38, 11, { a: 'center', c: C.dim, alpha: a3 });
}
function unitsGrid(ctx: Ctx, env: Env, gx: number, gy: number, cell = 10) {
  ctx.save(); for (let i = 0; i < 96; i++) { ctx.fillStyle = ramp(UNITS[i]); ctx.fillRect(gx + (i % 12) * cell, gy + Math.floor(i / 12) * cell, cell - 0.6, cell - 0.6); } ctx.restore();
  txt(ctx, env, '96 units', gx + 60, gy + 100, 12, { a: 'center', c: C.muted });
}
function readerDigit(ctx: Ctx, env: Env, k: number, i: number, p: number) {
  const DG = RP[k].digit, A = answer(k, i);
  const gx = 120, gy = DG + 40, cell = 10;
  unitsGrid(ctx, env, gx, gy, cell);
  ['score', 'e^score', '÷ sum', 'softmax'].forEach((h, j) => eyebrow(ctx, env, h, [450, 540, 740, 880][j], DG + 24));
  for (let d = 0; d < 10; d++) {
    const y = DG + 44 + d * 29;
    const a1 = seg(p, d * 0.03, d * 0.03 + 0.12), a2 = seg(p, 0.36 + d * 0.015, 0.5 + d * 0.015), a3 = seg(p, 0.66 + d * 0.015, 0.8 + d * 0.015);
    const hot = d === A.best && a3 > 0.8;
    if (a1 > 0 && a1 < 1) for (let q = 0; q < 12; q++) { const u = (q * 37 + d) % 96; line(ctx, env, gx + (u % 12) * cell + 5, gy + Math.floor(u / 12) * cell + 5, 408, y + 8, { c: C.red, w: 0.6, alpha: 0.3 }); }
    ctx.save(); ctx.globalAlpha *= a1; ctx.fillStyle = C.chip; ctx.strokeStyle = hot ? C.red : '#45403f'; lw(ctx, env, 1.2); ctx.beginPath(); ctx.arc(410, y + 8, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx, env, 'Σ', 410, y + 12, 11, { a: 'center', c: hot ? C.red : C.muted, alpha: a1 });
    txt(ctx, env, String(d), 436, y + 14, 15, { a: 'center', w: 700, c: hot ? C.red : C.ink, alpha: a1 });
    chip(ctx, env, A.logits[d].toFixed(1), 450, y - 2, 56, 22, { hot, alpha: a1, size: 12 });
    rect(ctx, env, { x: 540, y: y + 2, w: 150, h: 16 }, { fill: C.sunken, rad: 2, alpha: a2 });
    rect(ctx, env, { x: 540, y: y + 2, w: (A.e[d] / A.emax) * 150 * a2, h: 16 }, { fill: hot ? C.red : C.blue, rad: 2, alpha: a2 });
    txt(ctx, env, A.e[d] >= 100 ? fmt(Math.round(A.e[d])) : A.e[d].toFixed(2), 698, y + 14, 11, { c: C.muted, alpha: a2 });
    rect(ctx, env, { x: 740, y: y + 2, w: 120, h: 16 }, { fill: C.sunken, rad: 2, alpha: a3 });
    rect(ctx, env, { x: 740, y: y + 2, w: (A.e[d] / A.esum) * 120 * a3, h: 16 }, { fill: hot ? C.red : C.blue, rad: 2, alpha: a3 });
    txt(ctx, env, A.probs[d] < 0.001 ? '< 0.1 %' : pct(A.probs[d]), 940, y + 14, 12, { a: 'right', font: MONO, c: hot ? C.red : C.muted, alpha: a3 });
  }
  const fin = seg(p, 0.86, 1);
  txt(ctx, env, `digit ${A.best}`, 1100, DG + 160, 52, { font: SERIF, c: C.red, alpha: fin });
  txt(ctx, env, pct(A.probs[A.best]), 1100, DG + 200, 24, { font: MONO, alpha: fin });
  txt(ctx, env, 'the confidence the firmware checks', 1100, DG + 224, 12, { c: C.dim, alpha: fin });
  if (A.measured) txt(ctx, env, 'e^7.1 = 1,215 ÷ 1,260 · a score 3.6 above the next is a 36 × share', 450, DG + 352, 11, { c: C.dim, alpha: fin });
}
function readerRoll(ctx: Ctx, env: Env, k: number, i: number, p: number) {
  const RY = RP[k].roll, A = answer(k, i);
  const gx = 120, gy = RY + 40, cell = 10;
  unitsGrid(ctx, env, gx, gy, cell);
  const a1 = seg(p, 0, 0.3), a2 = seg(p, 0.3, 0.55), a3 = seg(p, 0.55, 0.85), a4 = seg(p, 0.85, 1);
  if (a1 > 0 && a1 < 1) for (let q = 0; q < 14; q++) { const u = (q * 41) % 96; line(ctx, env, gx + (u % 12) * cell + 5, gy + Math.floor(u / 12) * cell + 5, 300, RY + 80, { c: C.red, w: 0.6, alpha: 0.3 }); }
  txt(ctx, env, '×  Wt  →  Σ', 300, RY + 86, 15, { a: 'center', c: C.muted, alpha: a1 });
  chip(ctx, env, sgn(A.rollScore), 380, RY + 62, 90, 34, { alpha: a2 });
  txt(ctx, env, 'roll score', 425, RY + 112, 11, { a: 'center', c: C.dim, alpha: a2 });
  arrow(ctx, env, 480, RY + 79, 560, RY + 79, { alpha: a3 }); txt(ctx, env, 'tanh', 520, RY + 70, 11, { a: 'center', c: C.red, alpha: a3 });
  const PL = { x: 580, y: RY + 10, w: 280, h: 160 };
  rect(ctx, env, PL, { fill: C.sunken, rad: 6, alpha: a3 });
  const cx = PL.x + PL.w / 2, cy = PL.y + PL.h / 2;
  line(ctx, env, PL.x, cy, PL.x + PL.w, cy, { c: '#45403f', alpha: a3 }); line(ctx, env, cx, PL.y, cx, PL.y + PL.h, { c: '#45403f', alpha: a3 });
  ctx.save(); ctx.globalAlpha *= a3; ctx.strokeStyle = C.blue; lw(ctx, env, 2); ctx.beginPath();
  for (let q = 0; q <= 60 * a3; q++) { const x = -3 + q * 0.1; const px = cx + (x / 3) * (PL.w / 2), py = cy - Math.tanh(x) * (PL.h / 2) * 0.92; if (q === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
  ctx.stroke(); ctx.restore();
  const px = cx + (Math.max(-3, Math.min(3, A.rollScore)) / 3) * (PL.w / 2), py = cy - Math.tanh(A.rollScore) * (PL.h / 2) * 0.92;
  if (a4 > 0) { line(ctx, env, px, cy, px, py, { c: C.red, dash: [3, 3], alpha: a4 }); line(ctx, env, PL.x, py, px, py, { c: C.red, dash: [3, 3], alpha: a4 }); ctx.save(); ctx.globalAlpha *= a4; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  txt(ctx, env, '+0.5', PL.x - 6, PL.y + 10, 10, { a: 'right', c: C.dim, alpha: a3 }); txt(ctx, env, '−0.5', PL.x - 6, PL.y + PL.h, 10, { a: 'right', c: C.dim, alpha: a3 });
  txt(ctx, env, `roll ${sgn(A.roll)}`, 900, RY + 86, 30, { font: SERIF, c: C.red, alpha: a4 });
  txt(ctx, env, A.measured ? 'the 7 has passed its mark by 3.7 % of a step toward the 8' : `the ${A.best} is ${Math.abs(A.roll * 100).toFixed(1)} % of a step ${A.roll >= 0 ? 'past' : 'before'} its mark`, 900, RY + 112, 12, { c: C.muted, alpha: a4 });
}
/* the whole reader in one go, for readers 2 and 3 and for the other drums */
function readerAll(ctx: Ctx, env: Env, k: number, i: number, p: number) {
  if (p <= 0) return;
  readerNet(ctx, env, k, i, segL(p, 0, 0.3));
  if (p > 0.3) readerFlatten(ctx, env, k, segL(p, 0.3, 0.5));
  if (p > 0.5) readerDense(ctx, env, k, segL(p, 0.5, 0.7));
  if (p > 0.7) readerDigit(ctx, env, k, i, segL(p, 0.7, 0.88));
  if (p > 0.88) readerRoll(ctx, env, k, i, segL(p, 0.88, 1));
}
/* one drum's slot in the vote panel: its cell, the averaged bars and the answer */
function voteSlot(ctx: Ctx, env: Env, i: number, g: number) {
  if (g <= 0) return;
  const slot = drumSlot(i), to: Rect = { x: slot.x, y: slot.y, w: 44, h: 88 };
  frame(ctx, env, to, { alpha: g }); tile(ctx, env, cutFeats, i, to, { pixel: false, alpha: g });
  const mean = ENS[i], mi = mean.indexOf(Math.max(...mean));
  bars(ctx, env, mean, { x: slot.x + 56, y: slot.y + 10, w: 120, h: 60 }, { hi: mi, base: 0, alpha: g, grow: g });
  const low = VT.conf[i] === VT.minconf;
  txt(ctx, env, `${mi}`, slot.x + 56, slot.y + 100, 26, { font: SERIF, c: low ? C.red : C.ink, alpha: g });
  txt(ctx, env, pct(VT.conf[i]), slot.x + 82, slot.y + 100, 14, { font: MONO, c: low ? C.red : C.muted, alpha: g });
  txt(ctx, env, `drum ${i + 1}`, slot.x + 22, slot.y + 104, 10, { a: 'center', c: C.dim, alpha: g });
  if (low) txt(ctx, env, 'least sure: reader 3 read a 0 and was outvoted', slot.x + 56, slot.y + 120, 10, { c: C.red, alpha: g });
}

/* ── scenes ── */
export const SCENES: Scene[] = [
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
      const bx = b5.x + b5.w / 2 + 12, by0 = b5.y + b5.h + 66, ey = ISO.oy - 26;
      ctx.save(); ctx.globalAlpha *= a1; ctx.strokeStyle = C.red; lw(ctx, env, 1.4); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(bx, by0); ctx.lineTo(bx, ey); ctx.lineTo(560, ey); ctx.stroke(); ctx.restore();
      arrow(ctx, env, 560, ey, 560, ISO.oy - 4, { alpha: a1, c: C.red, dash: [4, 4] });
      rect(ctx, env, { x: 700, y: ey - 16, w: 118, h: 30 }, { stroke: C.red, rad: 6, w: 1.4, alpha: a1, fill: C.chip });
      txt(ctx, env, '1 × 1 conv · 32 → 5', 759, ey + 4, 12, { a: 'center', c: C.red, w: 700, alpha: a1 });
      // the five layers, back to front so the score layer sits on top
      for (let l = 4; l >= 0; l--) {
        const la = seg(a1, l * 0.16, l * 0.16 + 0.36);
        if (la <= 0) continue;
        ctx.save(); ctx.globalAlpha *= la;
        ctx.translate(ISO.ox, ISO.oy + l * ISO.gap); ctx.transform(1, 0, ISO.kx, ISO.ky, 0, 0);
        rect(ctx, env, { x: -4, y: -4, w: 10 * ISO.cell + 8, h: 7 * ISO.cell + 8 }, { fill: '#0e0e13', stroke: '#3a3a46' });
        const sweep = l === 0 && a2 > 0 && a2 < 1 ? Math.floor(a2 * 70) : -1;
        HEAD[l].forEach((row, r) => row.forEach((v, c) => {
          const idx = r * 10 + c; const lit = sweep >= 0 && idx === sweep;
          ctx.fillStyle = lit ? C.hi : ramp(v); ctx.fillRect(c * ISO.cell, r * ISO.cell, ISO.cell - 1, ISO.cell - 1);
        }));
        const chosen = l === 0 ? a2 >= 1 : a3 * 4 >= l;
        if (chosen) { ctx.strokeStyle = C.red; ctx.lineWidth = 2.5; if (l > 0) ctx.setLineDash([4, 3]); ctx.strokeRect(CHOSEN[1] * ISO.cell, CHOSEN[0] * ISO.cell, ISO.cell, ISO.cell); }
        ctx.restore();
        txt(ctx, env, names[l], ISO.ox + 10 * ISO.cell + 14, ISO.oy + l * ISO.gap + 28, l === 0 ? 18 : 15, { c: l === 0 ? C.hi : C.muted, w: l === 0 ? 700 : 400, alpha: la });
      }
      if (a3 > 0) {
        const top = isoPt(0, CHOSEN[0], CHOSEN[1]), bot = isoPt(4, CHOSEN[0], CHOSEN[1]);
        line(ctx, env, top.x, top.y, top.x, lerp(top.y, bot.y, a3), { c: C.red, dash: [5, 4], w: 1.6 });
      }
      const rows = [
        ['score', SP.raw[0].toFixed(2), '', 'highest of the 70 cells: chosen'],
        ['dx', SP.raw[1].toFixed(2), SP.sig[0].toFixed(2), `centre ${Math.round(SP.sig[0] * 100)} % across the cell`],
        ['dy', SP.raw[2].toFixed(2), SP.sig[1].toFixed(2), `centre ${Math.round(SP.sig[1] * 100)} % down the cell`],
        ['w', SP.raw[3].toFixed(2), SP.sig[2].toFixed(2), `width 0.25 of the frame · ${SP.box[2]} px`],
        ['h', SP.raw[4].toFixed(2), SP.sig[3].toFixed(2), `height 0.12 of the frame · ${SP.box[3]} px`],
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
        txt(ctx, env, m, 970, y, 11.5, { c: C.body, alpha: ra });
      });
      txt(ctx, env, '0 to 1 is the sigmoid of the raw value', 700, ISO.oy + 300, 11, { c: C.dim, alpha: a3 });
      const Rr = SPOT_PHOTO;
      frame(ctx, env, Rr); img(ctx, env, 'thumb.webp', Rr);
      const gw = Rr.w / 10, gh = Rr.h / 7;
      ctx.save(); ctx.globalAlpha *= 0.35 * a4 * (1 - a5);
      for (let c = 1; c < 10; c++) line(ctx, env, Rr.x + c * gw, Rr.y, Rr.x + c * gw, Rr.y + Rr.h, { c: C.hi, w: 0.8 });
      for (let r = 1; r < 7; r++) line(ctx, env, Rr.x, Rr.y + r * gh, Rr.x + Rr.w, Rr.y + r * gh, { c: C.hi, w: 0.8 });
      ctx.restore();
      if (a4 > 0) {
        const cx0 = Rr.x + CHOSEN[1] * gw, cy0 = Rr.y + CHOSEN[0] * gh;
        rect(ctx, env, { x: cx0, y: cy0, w: gw, h: gh }, { stroke: C.red, w: 2, alpha: a4 });
        const m1 = seg(a4, 0.1, 0.45), m2 = seg(a4, 0.5, 1);
        const cx = cx0 + m1 * SP.sig[0] * gw, cy = cy0 + m1 * SP.sig[1] * gh;
        const bw = m2 * SP.size_norm[0] * Rr.w, bh = m2 * SP.size_norm[1] * Rr.h;
        line(ctx, env, cx0, cy0, cx, cy, { c: C.red, dash: [3, 3] });
        ctx.save(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (m2 > 0) rect(ctx, env, { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh }, { stroke: C.red, w: 2.5 });
        txt(ctx, env, 'dx, dy from the cell corner', cx + 10, cy - 8, 11, { c: C.red, alpha: m1 * (1 - m2) });
      }
      txt(ctx, env, `the spotter’s selection · ${SP.box[2]} × ${SP.box[3]} px`, Rr.x + Rr.w / 2, Rr.y + Rr.h + 26, 14, { a: 'center', c: C.red, alpha: a5 });
    },
  },
  {
    id: 'spot-crop', stage: 'Spotter', title: 'A rough box, then a generous crop', dur: 5,
    body: 'The spotter’s work is rough, so the box is widened 1.5 ×, and the crop around it takes 1.5 × its width and 2.4 × its height. It is cut from the full 800 × 600 frame, not the thumbnail, and sent down to the refiner.',
    view: { x: PX, y: 870, w: PW, h: 780 },
    draw: (ctx, env, p) => {
      const Rr = SPOT_PHOTO;
      const a1 = seg(p, 0, 0.22), a2 = seg(p, 0.22, 0.48), a3 = seg(p, 0.5, 0.68), a4 = seg(p, 0.7, 1);
      const box = inPhoto(Rr, SP.box), wide = inPhoto(Rr, SP.wide), crop = inPhoto(Rr, SP.crop);
      if (a3 > 0) rect(ctx, env, Rr, { fill: '#000', alpha: 0.55 * a3 });
      rect(ctx, env, box, { stroke: C.red, w: 2.5 });
      if (a1 > 0) rect(ctx, env, lerpRect(box, wide, a1), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, 'widened 1.5 ×', wide.x, wide.y + wide.h + 14, 11, { c: C.white, alpha: a1 * (1 - a2) });
      if (a2 > 0) rect(ctx, env, lerpRect(wide, crop, a2), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, `the crop · 1.5 × wider, 2.4 × taller · ${Math.round(SP.crop[2])} × ${Math.round(SP.crop[3])} px`, crop.x, crop.y - 8, 11, { c: C.white, alpha: a2 });
      txt(ctx, env, 'cut from the full 800 × 600 frame, not the thumbnail', Rr.x + Rr.w / 2, Rr.y + Rr.h + 46, 13, { a: 'center', c: C.muted, alpha: a3 });
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
    id: 'ref-heads', stage: 'Refiner · pass 1', title: 'The average maps become score and offset strips', dur: 10,
    body: 'A 1 × 1 convolution reads every column of the column map and turns it into four strips: a left score and offset, a right score and offset. The row map becomes four more for top and bottom. The highest score names the cell, its offset says where inside the cell the edge is, and the four edges become the box.',
    view: { x: PX, y: PAN.ref1.y + 630, w: PW, h: 370 },
    draw: (ctx, env, p) => refHeads(ctx, env, PAN.ref1.y, P1, PD1, p, C.red),
  },
  {
    id: 'ref-pass2', stage: 'Refiner · pass 2', title: 'Expand the box, crop again, the same network again', dur: 10,
    body: 'The pass 1 box is only as centred as the spotter’s guess, so it is expanded, cropped again and sent through the very same refiner: the same four blocks, the same heads, the same 15,400 weights. Pass 2 is pass 1 over again, quickly. Its box goes to the reader.',
    view: { x: PX, y: PAN.ref1.y, w: PW, h: 2100 },
    draw: (ctx, env, p) => {
      const cr = CROP(PAN.ref1.y);
      const rel = (b: readonly number[], reg: readonly number[]): Rect => ({ x: cr.x + ((b[0] - reg[0]) / reg[2]) * cr.w, y: cr.y + ((b[1] - reg[1]) / reg[3]) * cr.h, w: (b[2] / reg[2]) * cr.w, h: (b[3] / reg[3]) * cr.h });
      const box1 = rel(P1.box, P1.region), reg2 = rel(P2.region, P1.region);
      const a1 = seg(p, 0, 0.12), a2 = seg(p, 0.12, 0.26), a2b = seg(p, 0.14, 0.3);
      if (a1 > 0) rect(ctx, env, lerpRect(box1, reg2, a1), { stroke: C.white, w: 1.5, dash: [6, 4] });
      txt(ctx, env, `expanded · ${Math.round(P2.region[2])} × ${Math.round(P2.region[3])} px → 256 × 96`, reg2.x, reg2.y - 8, 11.5, { c: C.white, alpha: a1 });
      if (a2 > 0) {
        const fly = lerpRect(reg2, REF2_NET.input, a2);
        frame(ctx, env, fly, { hot: true });
        img(ctx, env, 'photo.webp', fly, { src: photoSrc(P2.region), alpha: 1 - a2 });
        img(ctx, env, P2.crop, fly, { alpha: a2 });
      }
      // the network itself is copied down: a dashed outline around pass 1's blocks slides to pass 2's
      if (a2b > 0) {
        const box = (L: typeof REF1_NET): Rect => ({ x: L.blocks[0].x - 16, y: L.blocks[0].y - 70, w: stackRight(L.blocks[3], 6) - L.blocks[0].x + 32, h: 190 });
        const o = lerpRect(box(REF1_NET), box(REF2_NET), a2b);
        rect(ctx, env, o, { stroke: C.red, dash: [8, 6], w: 1.6, rad: 8, alpha: 0.9 });
        txt(ctx, env, 'the same RefNet · same blocks, same heads, same 15,400 weights', o.x + o.w / 2, o.y - 10, 13, { a: 'center', c: C.red, w: 700 });
      }
      const q = segL(p, 0.3, 1);
      if (q > 0) {
        refNetDraw(ctx, env, REF2_NET, P2, segL(q, 0, 0.3));
        if (q > 0.3) refAvg(ctx, env, PAN.ref2.y, PD2, segL(q, 0.3, 0.6));
        if (q > 0.6) refHeads(ctx, env, PAN.ref2.y, P2, PD2, segL(q, 0.6, 1), C.blue);
        if (q >= 1) { const c2 = CROP(PAN.ref2.y); txt(ctx, env, 'pass 2 box', c2.x + c2.w + 120, c2.y + c2.h / 2 - 6, 15, { c: C.blue, w: 700 }); txt(ctx, env, `${P2.box[2]} × ${P2.box[3]} px · to the reader`, c2.x + c2.w + 120, c2.y + c2.h / 2 + 14, 12, { c: C.blue }); }
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
      if (a5 > 0 && a5 < 1) {
        const fly = lerpRect(cellAt(5), RP[0].net.input, a5);
        frame(ctx, env, fly, { hot: true }); tile(ctx, env, cutFeats, 5, fly, { pixel: false });
        txt(ctx, env, 'drum 6', fly.x + fly.w / 2, fly.y - 10, 12, { a: 'center', c: C.red });
      }
    }),
  },
  {
    id: 'rd-net', stage: 'Reader 1', title: 'A reader turns one cell into 96 tiny maps', dur: 7, until: 'drums',
    body: 'The reader is the same recipe once more, four blocks of 3 × 3 convolution, ReLU and max-pool, but wider: 16, 48, 96, 96 maps. The 32 × 64 cell ends as 96 maps of 2 × 4, where one cell stands for a 16 × 16 patch of the drum.',
    view: { x: PX + RX, y: PAN.reader1.y, w: PW, h: 380 },
    draw: right((ctx, env, p) => readerNet(ctx, env, 0, 5, p)),
  },
  {
    id: 'flatten', stage: 'Reader 1', title: 'Flatten: 96 maps become one list of 768', dur: 7, until: 'drums',
    body: 'Nothing is computed here. The first map is pulled off the block and its 2 × 4 cells are read row by row into a line of 8; the other 95 maps follow and the block empties, so the list is always in the same order, map 1 first and map 96 last. 768 numbers.',
    view: { x: PX + RX, y: RP[0].flat - 20, w: PW, h: 250 },
    draw: right((ctx, env, p) => readerFlatten(ctx, env, 0, p)),
  },
  {
    id: 'dense', stage: 'Reader 1', title: 'The dense layer: 768 numbers become 96 units', dur: 7, until: 'drums',
    body: 'Each of the 96 units has its own 768 weights. Every number is multiplied by its weight, all 768 products are added, an offset is added, and anything below zero becomes zero. Unit 69 first, slowly; then the other 95 the same way.',
    view: { x: PX + RX, y: RP[0].dense - 20, w: PW, h: 240 },
    draw: right((ctx, env, p) => readerDense(ctx, env, 0, p)),
  },
  {
    id: 'digit', stage: 'Reader 1', title: 'The digit head: ten scores, a softmax, one answer', dur: 7, until: 'drums',
    body: 'Each digit 0 to 9 has its own 96 weights and offset, so ten weighted sums give ten scores. Softmax raises e to every score and divides by the total, which turns one clear lead into nearly all of the probability. The 7 wins at 96.4 %; that percentage is the confidence.',
    view: { x: PX + RX, y: RP[0].digit - 20, w: PW, h: 380 },
    draw: right((ctx, env, p) => readerDigit(ctx, env, 0, 5, p)),
  },
  {
    id: 'roll', stage: 'Reader 1', title: 'The roll head: how far the drum has turned', dur: 5, until: 'drums',
    body: 'One more weighted sum of the 96 units gives a roll score, squashed by tanh into −0.5 to +0.5: how far past its mark the drum sits. This 7 has rolled 3.7 % of a step towards the 8.',
    view: { x: PX + RX, y: RP[0].roll - 20, w: PW, h: 240 },
    draw: right((ctx, env, p) => readerRoll(ctx, env, 0, 5, p)),
  },
  {
    id: 'readers3', stage: 'Reader ensemble', title: 'Readers 2 and 3 read the same drum', dur: 8, until: 'drums',
    body: 'Three copies of the reader share one architecture but were trained from different random starts, so they make different mistakes. The same cell goes through readers 2 and 3 the same way, quickly; each gives its own ten percentages and its own roll.',
    view: { x: PX + RX, y: PAN.reader2.y - 20, w: PW, h: 2 * RH + 120 },
    draw: right((ctx, env, p) => { readerAll(ctx, env, 1, 5, segL(p, 0, 0.92)); readerAll(ctx, env, 2, 5, segL(p, 0.08, 1)); }),
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
    id: 'drums', stage: 'Vote', title: 'Every other drum goes through the same machinery', dur: 14,
    body: 'The other five cells take the same trip, quickly: four blocks, flatten, dense, the two heads, in all three readers at once, then the vote. Six averaged answers line up before the carry rule. Drum 3 is the least sure, a 9 at 71.5 %, because reader 3 saw a 0 and was outvoted.',
    view: { x: PX + RX, y: PAN.cut.y - 20, w: PW, h: PAN.vote.y + 560 - PAN.cut.y + 40 },
    draw: right((ctx, env, p) => {
      voteSlot(ctx, env, 5, seg(p, 0, 0.08));
      for (let i = 0; i < 5; i++) {
        const q = segL(p, 0.05 + i * 0.17, 0.05 + i * 0.17 + 0.2);
        const landed = seg(p, 0.05 + i * 0.17 + 0.2, 0.05 + i * 0.17 + 0.27);
        const live = q > 0 && (i === 4 || q < 1);
        if (live) { readerAll(ctx, env, 0, i, q); readerAll(ctx, env, 1, i, q); readerAll(ctx, env, 2, i, q); }
        if (q > 0 && q < 1) { const c = cellAt(i); rect(ctx, env, { x: c.x - 4, y: c.y - 4, w: c.w + 8, h: c.h + 8 }, { stroke: C.red, w: 2 }); txt(ctx, env, `drum ${i + 1}`, c.x + c.w / 2, c.y - 10, 12, { a: 'center', c: C.red }); }
        voteSlot(ctx, env, i, landed);
      }
    }),
    finale: right((ctx, env) => { for (let i = 0; i < 6; i++) voteSlot(ctx, env, i, 1); }),
  },
  {
    id: 'carry', stage: 'Vote', title: 'The carry rule, then the reading', dur: 9,
    body: 'A drum may only be mid-roll if the drum to its right is on 9 or 0, or it is the last drum. Then its roll is trusted and the digit may step on. If the right drum sits on 1 to 8, this drum is locked to its nearest digit. That is what keeps 79 rolling to 80 from reading as 89. Here every roll is inside the dead band, so each drum keeps its digit: 0092.07.',
    view: { x: PX + RX, y: DRUMS_Y - 20, w: PW, h: 800 },
    draw: right((ctx, env, p) => {
      const a1 = segL(p, 0, 0.3), a2 = segL(p, 0.3, 0.62), a3 = seg(p, 0.64, 0.8), a4 = seg(p, 0.8, 1);
      for (let i = 0; i < 6; i++) {
        const slot = drumSlot(i), x = slot.x, n = VT.near[i], last = i === 5, rightD = VT.near[i + 1];
        const free = last || rightD === 0 || rightD === 9, roll = VT.roll[i];
        const ra = seg(a1, i * 0.12, i * 0.12 + 0.4);
        txt(ctx, env, sgn(roll), x + 150, CARRY_Y + 20, 13, { a: 'center', font: MONO, c: C.ink, alpha: ra });
        rect(ctx, env, { x: x + 142, y: CARRY_Y + 30, w: 16, h: 60 }, { fill: C.sunken, rad: 3, alpha: ra });
        rect(ctx, env, { x: x + 142, y: CARRY_Y + 45, w: 16, h: 30 }, { fill: '#2a2726', alpha: ra });
        rect(ctx, env, { x: x + 138, y: CARRY_Y + 59 + roll * 120, w: 24, h: 3 }, { fill: C.red, alpha: ra });
        txt(ctx, env, Math.abs(roll) < (last ? VT.dead_last : VT.dead) ? 'in band' : 'past band', x + 150, CARRY_Y + 104, 10, { a: 'center', c: C.dim, alpha: ra });
        const ca = seg(a2, i * 0.1, i * 0.1 + 0.4);
        const col = free ? '#e7e4e1' : C.red;
        if (ca > 0) {
          line(ctx, env, x + 40, CARRY_Y + 150, x + 40, CARRY_Y + 125, { c: col, w: 2, alpha: ca });
          line(ctx, env, x + 40, CARRY_Y + 125, x + (last ? 60 : 240 + 40), CARRY_Y + 125, { c: col, w: 2, alpha: ca, dash: last ? undefined : [4, 3] });
          txt(ctx, env, last ? 'free · last drum' : free ? 'free · right drum on 9 or 0' : 'lock · right drum on 1 to 8', x + 50, CARRY_Y + 118, 11, { c: col, alpha: ca });
        }
        rect(ctx, env, { x, y: CARRY_Y + 150, w: 80, h: 120 }, { fill: a3 > 0.5 ? col : '#e7e4e1', rad: 8, alpha: ra });
        rect(ctx, env, { x: x + 14, y: CARRY_Y + 164, w: 52, h: 92 }, { fill: '#121110', rad: 4, alpha: ra });
        txt(ctx, env, String(n), x + 40, CARRY_Y + 232, 56, { a: 'center', w: 700, c: C.white, alpha: ra });
        txt(ctx, env, free ? `${n} → ${(n + 1) % 10} allowed` : `${n}, absolute`, x + 40, CARRY_Y + 292, 11, { a: 'center', c: free ? C.muted : C.red, alpha: a3 });
      }
      txt(ctx, env, '79 rolling to 80 could read as 89: the rule picks the preceding number instead', 170, CARRY_Y + 316, 12, { c: C.dim, alpha: a3 * (1 - a4) });
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
