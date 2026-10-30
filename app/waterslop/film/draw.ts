/* Canvas primitives for the DrumNet film. Everything is drawn in world units;
   the camera transform is already on the context. Scenes are pure functions of
   their progress p, so the same drawing serves the walkthrough, the finale
   where every stage runs at once, and reduced motion (p = 1). */

export type Ctx = CanvasRenderingContext2D;
export type Rect = { x: number; y: number; w: number; h: number };
export type Strip = { file: string; tile: readonly number[]; n: number };
export type Env = { img: (file: string) => HTMLImageElement | null; scale: number; reduced: boolean };

export const C = {
  bg: '#181716', ink: '#d8cbb8', muted: '#ada496', dim: '#7d766e', body: '#bfb6a9', hi: '#fff0db',
  red: '#ff6666', blue: '#8da0e8', panel: '#1c1a19', line: 'rgba(216,203,184,0.2)', lineS: 'rgba(216,203,184,0.46)',
  sunken: '#121110', stage: '#07101b', white: '#ffffff', green: '#6fd38a', chip: '#232120',
};
export const SERIF = "'Libre Baskerville', Baskerville, 'Times New Roman', serif";
export const SANS = 'Manrope, Arial, sans-serif';
export const MONO = 'ui-monospace, Menlo, Consolas, monospace';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => { const c = clamp01(t); return c * c * (3 - 2 * c); };
export const easeOut = (t: number) => { const c = clamp01(t); return 1 - (1 - c) * (1 - c) * (1 - c); };
export const easeIn = (t: number) => { const c = clamp01(t); return c * c * c; };
/* the share of p between a and b, eased */
export const seg = (p: number, a: number, b: number) => ease((p - a) / (b - a));
export const segL = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
export const fmt = (n: number) => n.toLocaleString('en-US');
export const pct = (p: number, d = 1) => `${(p * 100).toFixed(d)} %`;
export const sgn = (v: number, d = 3) => `${v > 0 ? '+' : ''}${v.toFixed(d)}`;

/* the blue ramp the report's feature maps use */
const RAMP: string[] = Array.from({ length: 65 }, (_, i) => {
  const c = i / 64;
  return `rgb(${Math.round(0x12 + (0x8d - 0x12) * c)},${Math.round(0x11 + (0xa0 - 0x11) * c)},${Math.round(0x10 + (0xe8 - 0x10) * c)})`;
});
export const ramp = (v: number) => RAMP[Math.round(clamp01(v) * 64)];
export function hexRows(hex: string, w: number, h: number): number[][] {
  const rows: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) row.push(clamp01((parseInt(hex.substr((y * w + x) * 2, 2), 16) - 13.2) / 139.3));
    rows.push(row);
  }
  return rows;
}
export function norm(vals: readonly number[]): number[] {
  let lo = Infinity, hi = -Infinity;
  for (const v of vals) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const r = hi - lo || 1;
  return vals.map((v) => (v - lo) / r);
}

export function lw(ctx: Ctx, env: Env, w: number) { ctx.lineWidth = Math.max(w, 1.1 / env.scale); }

export function txt(ctx: Ctx, env: Env, s: string, x: number, y: number, size: number, o: { c?: string; font?: string; a?: CanvasTextAlign; w?: number | string; base?: CanvasTextBaseline; alpha?: number; ls?: number } = {}) {
  if (size * env.scale < 2.2) return;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.font = `${o.w ?? 400} ${size}px ${o.font ?? SANS}`;
  ctx.fillStyle = o.c ?? C.ink;
  ctx.textAlign = o.a ?? 'left';
  ctx.textBaseline = o.base ?? 'alphabetic';
  if (o.ls) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${o.ls}px`;
  ctx.fillText(s, x, y);
  ctx.restore();
}
export function eyebrow(ctx: Ctx, env: Env, s: string, x: number, y: number, size = 11, c = C.muted) {
  txt(ctx, env, s.toUpperCase(), x, y, size, { c, w: 600, ls: size * 0.14 });
}

export function rect(ctx: Ctx, env: Env, r: Rect, o: { fill?: string; stroke?: string; w?: number; rad?: number; dash?: number[]; alpha?: number } = {}) {
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.beginPath();
  if (o.rad) ctx.roundRect(r.x, r.y, r.w, r.h, o.rad); else ctx.rect(r.x, r.y, r.w, r.h);
  if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  if (o.stroke) { ctx.strokeStyle = o.stroke; lw(ctx, env, o.w ?? 1); if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
  ctx.restore();
}
export function line(ctx: Ctx, env: Env, x1: number, y1: number, x2: number, y2: number, o: { c?: string; w?: number; dash?: number[]; alpha?: number } = {}) {
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.strokeStyle = o.c ?? C.ink; lw(ctx, env, o.w ?? 1);
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}
export function arrow(ctx: Ctx, env: Env, x1: number, y1: number, x2: number, y2: number, o: { c?: string; w?: number; alpha?: number; head?: number; dash?: number[] } = {}) {
  const c = o.c ?? '#78716c', h = o.head ?? 9;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.strokeStyle = c; lw(ctx, env, o.w ?? 1.5);
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x2 - h * Math.cos(ang - 0.5), y2 - h * Math.sin(ang - 0.5)); ctx.lineTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(ang + 0.5), y2 - h * Math.sin(ang + 0.5));
  ctx.stroke();
  ctx.restore();
}
/* a value chip: a rounded outline with a mono number */
export function chip(ctx: Ctx, env: Env, s: string, x: number, y: number, w: number, h: number, o: { hot?: boolean; alpha?: number; size?: number; fill?: boolean } = {}) {
  rect(ctx, env, { x, y, w, h }, { stroke: o.hot ? C.red : '#45403f', rad: 6, w: 1.2, alpha: o.alpha, fill: o.fill ? C.chip : undefined });
  txt(ctx, env, s, x + w / 2, y + h * 0.66, o.size ?? h * 0.46, { a: 'center', font: MONO, c: o.hot ? C.red : C.ink, alpha: o.alpha });
}

/* an image, or a tile from a sprite strip */
export function img(ctx: Ctx, env: Env, file: string, r: Rect, o: { alpha?: number; pixel?: boolean; src?: Rect } = {}) {
  const im = env.img(file);
  if (!im) { rect(ctx, env, r, { fill: C.sunken, alpha: o.alpha }); return; }
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  ctx.imageSmoothingEnabled = !o.pixel;
  const s = o.src ?? { x: 0, y: 0, w: im.naturalWidth, h: im.naturalHeight };
  ctx.drawImage(im, s.x, s.y, s.w, s.h, r.x, r.y, r.w, r.h);
  ctx.restore();
}
export function tile(ctx: Ctx, env: Env, strip: Strip, idx: number, r: Rect, o: { alpha?: number; pixel?: boolean } = {}) {
  const [tw, th] = strip.tile;
  img(ctx, env, strip.file, r, { ...o, pixel: o.pixel ?? true, src: { x: idx * tw, y: 0, w: tw, h: th } });
}
export function frame(ctx: Ctx, env: Env, r: Rect, o: { hot?: boolean; alpha?: number; c?: string; w?: number } = {}) {
  rect(ctx, env, { x: r.x - 1.5, y: r.y - 1.5, w: r.w + 3, h: r.h + 3 }, { stroke: o.c ?? (o.hot ? C.red : '#3a3634'), rad: 3, w: o.w ?? (o.hot ? 2 : 1.2), alpha: o.alpha });
}

/* a stack of feature maps, front tile at (x, y), the rest behind it up and to the right */
export function stack(ctx: Ctx, env: Env, strip: Strip, r: Rect, o: { shown?: number; step?: number; alpha?: number; front?: (r: Rect) => void; depthAlpha?: number; frontIdx?: number } = {}) {
  const shown = Math.min(o.shown ?? 8, strip.n), step = o.step ?? 6;
  for (let k = shown - 1; k >= 0; k--) {
    const tr = { x: r.x + k * step, y: r.y - k * step * 0.72, w: r.w, h: r.h };
    const a = (o.alpha ?? 1) * (k === 0 ? 1 : (o.depthAlpha ?? 0.9));
    rect(ctx, env, { x: tr.x - 1, y: tr.y - 1, w: tr.w + 2, h: tr.h + 2 }, { fill: C.sunken, stroke: '#45403f', w: 1, rad: 2, alpha: a });
    if (k === 0 && o.front) o.front(tr); else tile(ctx, env, strip, (o.frontIdx ?? 0) + k, tr, { alpha: a });
  }
}
export function grid(ctx: Ctx, env: Env, rows: readonly (readonly number[])[], x: number, y: number, cell: number, o: { gap?: number; alpha?: number; cellH?: number; hi?: [number, number]; hiC?: string; dashed?: boolean; limit?: number } = {}) {
  const g = o.gap ?? Math.min(0.5, cell * 0.08), ch = o.cellH ?? cell;
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  let n = 0;
  outer: for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
    if (o.limit !== undefined && n++ >= o.limit) break outer;
    ctx.fillStyle = ramp(rows[r][c]); ctx.fillRect(x + c * cell, y + r * ch, cell - g, ch - g);
  }
  if (o.hi) {
    ctx.strokeStyle = o.hiC ?? C.red; lw(ctx, env, 2); if (o.dashed) ctx.setLineDash([3, 2]);
    ctx.strokeRect(x + o.hi[1] * cell - 1.5, y + o.hi[0] * ch - 1.5, cell + 2, ch + 2);
  }
  ctx.restore();
}
/* a row of coloured cells: a 1-D map (scores, offsets, a flattened list) */
export function strip1d(ctx: Ctx, env: Env, vals: readonly number[], x: number, y: number, cell: number, h: number, o: { alpha?: number; hi?: number; hiC?: string; dashed?: boolean; vertical?: boolean; limit?: number; gap?: number } = {}) {
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  const g = o.gap ?? Math.min(0.6, cell * 0.08), n = o.limit ?? vals.length;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = ramp(vals[i]);
    if (o.vertical) ctx.fillRect(x, y + i * cell, h - g, cell - g); else ctx.fillRect(x + i * cell, y, cell - g, h - g);
  }
  if (o.hi !== undefined) {
    ctx.strokeStyle = o.hiC ?? C.red; lw(ctx, env, 1.8); if (o.dashed) ctx.setLineDash([3, 2]);
    if (o.vertical) ctx.strokeRect(x - 1.5, y + o.hi * cell - 1.5, h + 2, cell + 2); else ctx.strokeRect(x + o.hi * cell - 1.5, y - 1.5, cell + 2, h + 2);
  }
  ctx.restore();
}
export function bars(ctx: Ctx, env: Env, vals: readonly number[], r: Rect, o: { hi?: number; c?: string; base?: number; alpha?: number; grow?: number; labels?: boolean } = {}) {
  const lo = o.base ?? Math.min(...vals), range = Math.max(...vals) - lo || 1;
  const bw = r.w / vals.length, g = o.grow ?? 1;
  rect(ctx, env, r, { fill: C.sunken, rad: 2, alpha: o.alpha });
  ctx.save();
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  vals.forEach((v, i) => {
    const bh = ((v - lo) / range) * (r.h - 4) * g;
    ctx.fillStyle = i === o.hi ? C.red : (o.c ?? C.blue);
    ctx.fillRect(r.x + i * bw + 1, r.y + r.h - 2 - bh, Math.max(1, bw - 2), bh);
  });
  ctx.restore();
  if (o.labels) vals.forEach((_, i) => txt(ctx, env, String(i), r.x + i * bw + bw / 2, r.y + r.h + 12, 9, { a: 'center', c: C.dim, alpha: o.alpha }));
}

/* ── the network animation: an input, then one block after another ──
   Each block: a 3 × 3 kernel sweeps the source map while the first output map
   is revealed row by row (the LeNet picture), the other maps fan out behind it,
   then the fan collapses into a compact block that is the next block's source. */
export type NetBlock = { strip: Strip; w: number; h: number; label: string; sub: string; n: number; weights?: number };
export type NetLayout = { input: Rect; blocks: Array<Rect & NetBlock>; midY: number };
export function netLayout(x: number, y: number, rowH: number, inW: number, inH: number, blocks: NetBlock[], gap = 64, step = 6): NetLayout {
  const midY = y + rowH / 2;
  const input = { x, y: midY - inH / 2, w: inW, h: inH };
  let cx = x + inW + gap;
  const out = blocks.map((b) => {
    const r = { ...b, x: cx, y: midY - b.h / 2 + Math.min(8, b.n) * step * 0.36, w: b.w, h: b.h };
    cx += b.w + Math.min(8, b.n) * step + gap;
    return r;
  });
  return { input, blocks: out, midY };
}
function kernelPath(t: number, src: Rect, k: number) {
  const rows = 3;
  const row = Math.min(rows - 1, Math.floor(t * rows)), u = t * rows - row;
  const uu = row % 2 === 0 ? u : 1 - u;
  return { x: src.x + uu * (src.w - k), y: src.y + (row / (rows - 1)) * (src.h - k) };
}
export function drawNet(ctx: Ctx, env: Env, L: NetLayout, p: number, drawInput: (r: Rect) => void, o: { step?: number; caps?: boolean; capY?: number } = {}) {
  const step = o.step ?? 6, N = L.blocks.length;
  drawInput(L.input);
  for (let i = 0; i < N; i++) {
    const b = L.blocks[i];
    const bi = clamp01(p * N - i);
    if (bi <= 0) break;
    const src = i === 0 ? L.input : L.blocks[i - 1];
    const prevRight = i === 0 ? L.input.x + L.input.w : L.blocks[i - 1].x + L.blocks[i - 1].w + Math.min(8, L.blocks[i - 1].n) * step;
    arrow(ctx, env, prevRight + 8, L.midY, b.x - 10, L.midY, { alpha: clamp01(bi * 4) });
    // the first map fills as the kernel sweeps (to 0.5); then the other maps slide in from above, one after another
    const reveal = bi < 0.5 ? bi / 0.5 : 1;
    const arrive = bi < 0.5 ? 0 : (bi - 0.5) / 0.5;
    const shown = Math.min(8, b.n);
    const kp = kernelPath(reveal, src, Math.max(6, src.w / 9));
    for (let k = shown - 1; k >= 0; k--) {
      let kt = 1;
      if (k > 0) { const s0 = ((k - 1) / shown) * 0.68; kt = seg(arrive, s0, s0 + 0.3); if (kt <= 0) continue; }
      const tr = { x: b.x + k * step, y: b.y - k * step * 0.72 - (1 - kt) * 70, w: b.w, h: b.h };
      const a = k === 0 ? 1 : 0.9 * kt;
      rect(ctx, env, { x: tr.x - 1, y: tr.y - 1, w: tr.w + 2, h: tr.h + 2 }, { fill: C.sunken, stroke: '#45403f', w: 1, rad: 2, alpha: a });
      if (k === 0 && reveal < 1) {
        const rh = ((kp.y - src.y) / src.h) * b.h + b.h / 9;
        ctx.save(); ctx.beginPath(); ctx.rect(tr.x, tr.y, tr.w, Math.min(tr.h, rh)); ctx.clip();
        tile(ctx, env, b.strip, 0, tr); ctx.restore();
      } else tile(ctx, env, b.strip, k, tr, { alpha: a });
    }
    if (reveal < 1) {
      // the kernel on the source and the cell it produces on the output
      const k = Math.max(6, src.w / 9);
      const ox = b.x + ((kp.x - src.x) / src.w) * b.w, oy = b.y + ((kp.y - src.y) / src.h) * b.h, oc = Math.max(3, b.w / 10);
      rect(ctx, env, { x: kp.x, y: kp.y, w: k, h: k }, { stroke: C.red, w: 1.6 });
      rect(ctx, env, { x: ox, y: oy, w: oc, h: oc * (b.h / b.w) * (src.w / src.h) }, { fill: C.red });
      ctx.save(); ctx.globalAlpha *= 0.45;
      line(ctx, env, kp.x + k, kp.y, ox, oy, { c: C.red });
      line(ctx, env, kp.x + k, kp.y + k, ox, oy + oc * (b.h / b.w) * (src.w / src.h), { c: C.red });
      ctx.restore();
    }
    const cw = b.w + shown * step;
    const la = clamp01((bi - 0.25) * 3);
    if (o.caps !== false) {
      const cy = o.capY ?? L.midY + Math.max(...L.blocks.map((q) => q.h / 2)) + 30;
      const count = bi >= 1 ? b.n : Math.max(1, Math.round(b.n * clamp01(arrive)));
      txt(ctx, env, b.label, b.x + cw / 2, cy, 17, { a: 'center', w: 700, alpha: la });
      txt(ctx, env, `${count} map${count === 1 ? '' : 's'} · ${b.sub}`, b.x + cw / 2, cy + 20, 12.5, { a: 'center', c: C.muted, alpha: la });
      if (b.weights) txt(ctx, env, `${fmt(b.weights)} weights`, b.x + cw / 2, cy + 37, 11.5, { a: 'center', c: C.dim, alpha: la });
    }
  }
}
export const stackRight = (b: Rect & { n: number }, step = 6) => b.x + b.w + Math.min(8, b.n) * step;
