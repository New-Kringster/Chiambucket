/* PCB-style fanout for the entrance: the name is the chip, and traces route
   out of its pins to the edges of the screen with 45° bends and vias.
   Deterministic (seeded), so the server and the client draw the same board. */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Trace = { d: string; via: [number, number]; delay: number };
export type Board = { w: number; h: number; traces: Trace[]; pads: [number, number, number, number][] };

/** Fan traces out of the top and bottom edges (and the two sides) of a chip box. */
export function fanout(w: number, h: number, box: { x0: number; x1: number; y0: number; y1: number }, pins: number, seed: number): Board {
  const r = rng(seed);
  const traces: Trace[] = [];
  const pads: Board['pads'] = [];
  const cx = (box.x0 + box.x1) / 2;
  const pitch = (box.x1 - box.x0) / pins;
  for (const side of [-1, 1] as const) {
    const yPin = side < 0 ? box.y0 : box.y1;
    const edge = side < 0 ? -20 : h + 20;
    for (let i = 0; i < pins; i++) {
      if (r() < 0.18) continue; // a few unused pins keep it from reading as a pattern
      const x0 = box.x0 + pitch * (i + 0.5);
      const off = (x0 - cx) / ((box.x1 - box.x0) / 2); // -1 … 1
      const run = 18 + r() * 40;
      const y1 = yPin + side * run;
      const d = Math.abs(off) * (side < 0 ? box.y0 : h - box.y1) * (0.45 + r() * 0.35);
      const x2 = x0 + Math.sign(off || 1) * d;
      const y2 = y1 + side * d;
      // Some traces turn again and run along to a side edge.
      const turn = Math.abs(off) > 0.7 && r() < 0.5;
      let path = `M${x0.toFixed(1)} ${yPin} V${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
      let via: [number, number] = [x2, y2];
      if (turn) {
        const xe = off < 0 ? -20 : w + 20;
        const y3 = y2 + side * (20 + r() * 40);
        path += ` V${y3.toFixed(1)} L${(xe < 0 ? x2 - 30 : x2 + 30).toFixed(1)} ${(y3 + side * 30).toFixed(1)} H${xe}`;
        via = [x2, y3];
      } else {
        path += ` V${edge}`;
      }
      traces.push({ d: path, via, delay: 0.05 + (1 - Math.abs(off)) * 0.25 + r() * 0.5 });
      pads.push([x0 - pitch * 0.18, side < 0 ? yPin - 10 : yPin, pitch * 0.36, 10]);
    }
  }
  // Side pins run straight out with one jog.
  for (const side of [-1, 1] as const) {
    const xPin = side < 0 ? box.x0 : box.x1;
    const n = 3;
    for (let i = 0; i < n; i++) {
      const y0 = box.y0 + ((box.y1 - box.y0) * (i + 1)) / (n + 1);
      const x1 = xPin + side * (30 + r() * 60);
      const jog = (r() - 0.5) * 80;
      const xe = side < 0 ? -20 : w + 20;
      const d = `M${xPin} ${y0.toFixed(1)} H${x1.toFixed(1)} L${(x1 + side * Math.abs(jog)).toFixed(1)} ${(y0 + jog).toFixed(1)} H${xe}`;
      traces.push({ d, via: [x1, y0], delay: 0.2 + r() * 0.5 });
      pads.push([side < 0 ? xPin - 10 : xPin, y0 - 4, 10, 8]);
    }
  }
  return { w, h, traces, pads };
}

/** Shuffled per-letter delays, so the name assembles out of order. */
export function letterDelays(n: number, seed: number, from: number, spread: number) {
  const r = rng(seed);
  // Fisher-Yates, not sort(): engines sort differently and would break hydration.
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const out = new Array<number>(n);
  order.forEach((idx, k) => { out[idx] = from + (spread * k) / Math.max(1, n - 1) + r() * 0.08; });
  return out;
}
