/*
  navBlob — the geometry behind the nav's merge (components/Nav.tsx).

  The nav's pieces (logo, page pill, "View my work", and on phones the menu
  button) are all capsules of the same height on one line. As the page
  scrolls they slide together into one bar, and where two neighbours come
  close a neck of glass reaches across and thickens until they fuse, like
  metaballs. Everything here is plain path strings: the union is drawn as one
  SVG path (clockwise subpaths, so a nonzero fill unions them) that both
  clips the glass layer and feeds the rim and shadow filter.
*/

export type Capsule = {
  x0: number; // left edge, px
  x1: number; // right edge, px
  cy: number; // centre line, px
  r: number; // half the height
  s: number; // presence, 0 (a point) to 1 (full size), scaled about its centre
};

// Necks start to form when the gap between two capsules is under NECK_FROM
// and are a full-height bar once it is under NECK_FULL.
const NECK_FROM = 20;
const NECK_FULL = 3;

const f = (v: number) => (Math.round(v * 100) / 100).toString();

function capsulePath(c: Capsule) {
  const cx = (c.x0 + c.x1) / 2;
  const r = c.r * c.s;
  const hw = Math.max(r, ((c.x1 - c.x0) / 2) * c.s);
  if (r < 0.5) return '';
  const l = cx - hw + r;
  const rt = cx + hw - r;
  const t = c.cy - r;
  const b = c.cy + r;
  // clockwise: along the top, round the right end, back along the bottom, round the left end
  return `M${f(l)} ${f(t)}H${f(rt)}A${f(r)} ${f(r)} 0 0 1 ${f(rt)} ${f(b)}H${f(l)}A${f(r)} ${f(r)} 0 0 1 ${f(l)} ${f(t)}Z`;
}

/* The neck between the right end of one capsule (cap centre xa) and the left
   end of the next (cap centre xb). t is how far it has formed: at 0 it is a
   strand touching the centre line, at 1 a straight bar the full height. Its
   edges leave each end tangent to it and dip towards the middle. */
function neckPath(xa: number, xb: number, cy: number, r: number, t: number) {
  const th = (1 - t) * 1.05; // where it leaves each end, as an angle from the top
  const sin = Math.sin(th);
  const cos = Math.cos(th);
  const ax = xa + r * sin;
  const bx = xb - r * sin;
  if (bx - ax < 0.5) return '';
  const top = cy - r * cos;
  const bot = cy + r * cos;
  const mx = (ax + bx) / 2;
  const n = r * Math.pow(t, 0.8); // half-height of the neck at its middle
  const L = (mx - ax) * 0.55;
  return [
    `M${f(ax)} ${f(top)}`,
    `C${f(ax + cos * L)} ${f(top + sin * L)} ${f(mx - L)} ${f(cy - n)} ${f(mx)} ${f(cy - n)}`,
    `C${f(mx + L)} ${f(cy - n)} ${f(bx - cos * L)} ${f(top + sin * L)} ${f(bx)} ${f(top)}`,
    `L${f(bx)} ${f(bot)}`,
    `C${f(bx - cos * L)} ${f(bot - sin * L)} ${f(mx + L)} ${f(cy + n)} ${f(mx)} ${f(cy + n)}`,
    `C${f(mx - L)} ${f(cy + n)} ${f(ax + cos * L)} ${f(bot - sin * L)} ${f(ax)} ${f(bot)}`,
    'Z',
  ].join('');
}

const smooth = (v: number) => {
  const c = Math.min(1, Math.max(0, v));
  return c * c * (3 - 2 * c);
};

/** One path for the union of the capsules (given left to right) and the necks between them. */
export function blobPath(caps: Capsule[]) {
  let d = '';
  caps.forEach((c, i) => {
    d += capsulePath(c);
    const next = caps[i + 1];
    if (!next || c.s < 0.999 || next.s < 0.999) return;
    const gap = next.x0 - c.x1;
    if (gap >= NECK_FROM) return;
    const r = Math.min(c.r, next.r);
    d += neckPath(c.x1 - r, next.x0 + r, c.cy, r, smooth((NECK_FROM - gap) / (NECK_FROM - NECK_FULL)));
  });
  return d;
}
