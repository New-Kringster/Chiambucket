/*
  fox — a cartoon fox in the homepage meadow (mounted by components/SunlitScene.tsx).

  Every so often he pops up out of the grass at the horizon, bounds towards
  the camera, skids to a stop chest-deep in the near grass, notices you, waves,
  winks, then hops round and bounds away into the distance.

  He is drawn in code each frame, not swapped between paintings, so he moves
  continuously: a timeline sets where he is and what he is feeling, and every
  part follows through springs. The body squashes and stretches with each
  bound, the head lags and catches up, ears and tail overshoot and settle,
  and the face blinks, looks, smiles and squints on its own beats.

  Depth follows the same perspective as the field: at distance Z his size is
  1/Z and his feet sit 1/Z of the way from the horizon down to the near grass,
  so far off he is a speck at the horizon. The grass in front of him is the
  field's own painting (copied from its canvas, faded in over his legs) with a
  few blades drawn over the edge, and far off he takes on the haze.
*/

type Ctx = CanvasRenderingContext2D;
type Pt = [number, number];

export type FoxStage = {
  host: HTMLElement; // .sl-grass: fixed, faded and moved with the field
  grass: HTMLCanvasElement; // the painted field
  horizonAt: (x: number) => number; // screen y of the horizon at screen x
  haze: () => string | null; // rgb of the sky at the horizon
};

export type FoxHandle = {
  play: () => void;
  playing: () => boolean;
  seek: (t: number) => void;
  resize: () => void;
  destroy: () => void;
};

/* ---------------- Colours ---------------- */

const C = {
  fur: '#e2722b',
  furLight: '#f7a052',
  furShade: '#b9561d',
  furDeep: '#8c3b13',
  white: '#fdf6ea',
  whiteShade: '#e8d7c0',
  dark: '#3b2a21',
  darkLight: '#5c4234',
  nose: '#22160f',
  eye: '#21140e',
  iris: '#7a4417',
  earIn: '#f6e0ca',
  earDeep: '#83503a',
  mouth: '#5e1f22',
  tongue: '#ef8d8f',
  pad: '#e9a2a0',
  line: 'rgba(104, 42, 12, 0.5)',
};

/* ---------------- Small helpers ---------------- */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
const span = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
const easeOut = (t: number, p = 2) => 1 - Math.pow(1 - clamp(t), p);
// A steady pseudo-random number for a spot (the same every frame).
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// A closed, smooth outline through the points (uniform Catmull-Rom).
function blob(c: Ctx, pts: Pt[]) {
  const n = pts.length;
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    c.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
      p2[0], p2[1],
    );
  }
  c.closePath();
}

function shape(c: Ctx, fill: string | CanvasGradient, build: () => void, line = true) {
  c.beginPath();
  build();
  c.fillStyle = fill;
  c.fill();
  if (line) {
    c.strokeStyle = C.line;
    c.stroke();
  }
}

const ell = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => c.ellipse(x, y, Math.max(0.0001, rx), Math.max(0.0001, ry), rot, 0, Math.PI * 2);

// Fur lit from the upper right, where the sun is.
function furFill(c: Ctx, x: number, y: number, r: number, base = C.fur, light = C.furLight, shade = C.furShade) {
  const g = c.createRadialGradient(x + r * 0.35, y - r * 0.45, r * 0.08, x, y, r * 1.25);
  g.addColorStop(0, light);
  g.addColorStop(0.45, base);
  g.addColorStop(1, shade);
  return g;
}

/* ---------------- Springs ---------------- */

type Sp = { x: number; v: number };
const sp = (x = 0): Sp => ({ x, v: 0 });
// k: stiffness, z: damping ratio (below 1 overshoots)
function drive(s: Sp, target: number, k: number, z: number, dt: number) {
  s.v += (k * (target - s.x) - 2 * Math.sqrt(k) * z * s.v) * dt;
  s.x += s.v * dt;
}

type Rig = {
  lean: Sp; tilt: Sp; headY: Sp; headX: Sp; squash: Sp; run: Sp; z: Sp;
  earL: Sp; earR: Sp; tail: Sp; tailTip: Sp;
  lidL: Sp; lidR: Sp; happy: Sp; lookX: Sp; lookY: Sp; brow: Sp; wide: Sp;
  mouth: Sp; smile: Sp; tongue: Sp; blush: Sp;
  arm: Sp; elbow: Sp; paw: Sp;
};

const newRig = (): Rig => ({
  lean: sp(), tilt: sp(), headY: sp(), headX: sp(), squash: sp(1), run: sp(1), z: sp(1),
  earL: sp(), earR: sp(), tail: sp(), tailTip: sp(),
  lidL: sp(), lidR: sp(), happy: sp(), lookX: sp(), lookY: sp(), brow: sp(), wide: sp(),
  mouth: sp(), smile: sp(0.4), tongue: sp(), blush: sp(),
  arm: sp(), elbow: sp(), paw: sp(),
});

/* ---------------- The timeline ---------------- */

/* Beats, in seconds. */
const T = {
  run: 0.55, // starts bounding towards the camera
  arrive: 4.75, // skids to a stop in the near grass
  notice: 5.35, // sees you: head tilt, ears up, eyes wide
  wave: 6.0, // waves
  waveEnd: 8.85,
  wink: 9.05,
  turn: 9.6, // hops round
  leave: 10.15, // bounds away
  end: 13.9,
};
export const FOX_LENGTH = T.end;

const BLINKS = [1.4, 3.3, 5.75, 9.95, 11.6];
const blinkAt = (t: number) => BLINKS.reduce((m, b) => Math.max(m, 1 - clamp(Math.abs(t - b - 0.06) / 0.09)), 0);

const GAIT = 2.55; // bounds per second

type Beat = {
  zLog: number; // 0 near, 1 at the horizon (log scale of distance)
  x: number; // across the screen, 0 to 1
  sink: number; // 0 standing, 1 hidden down in the grass
  back: boolean; // seen from behind
  turnX: number; // horizontal squeeze while turning (1 none)
  lift: number; // extra height off the ground, in body heights
  gait: number; // 0 standing, 1 bounding
  phase: number; // where in the bound
  // targets for the springs
  lean: number; tilt: number; squash: number; run: number;
  earL: number; earR: number; tail: number;
  lid: number; lidL: number; happy: number; lookX: number; lookY: number; brow: number; wide: number;
  mouth: number; smile: number; tongue: number; blush: number;
  arm: number; elbow: number;
};

function beat(t: number, wide: boolean): Beat {
  const x0 = 0.56, x1 = wide ? 0.745 : 0.64, x2 = wide ? 0.6 : 0.5;
  const b: Beat = {
    zLog: 1, x: x0, sink: 0, back: false, turnX: 1, lift: 0, gait: 0, phase: 0,
    lean: 0, tilt: 0, squash: 1, run: 1, earL: 0, earR: 0, tail: 0,
    lid: 0, lidL: 0, happy: 0, lookX: 0, lookY: 0.15, brow: 0.2, wide: 0,
    mouth: 0.15, smile: 0.5, tongue: 0, blush: 0, arm: 0, elbow: 0,
  };

  if (t < T.run) {
    // pops up out of the far grass, ears first, with a little overshoot
    const u = t / T.run;
    b.sink = 1 - easeOut(u, 3) * (1 + 0.25 * Math.sin(u * Math.PI));
    b.earL = b.earR = 0.2;
    b.run = 0;
  } else if (t < T.arrive) {
    const u = (t - T.run) / (T.arrive - T.run);
    // he arrives with some speed left, so the spring carries him a touch too close
    const e = 0.72 * easeOut(u, 1.6) + 0.28 * u;
    b.zLog = 1 - e;
    b.x = mix(x0, x1, e) + 0.018 * Math.sin(u * Math.PI * 2.4) * (1 - u);
    b.gait = 1 - span(u, 0.86, 1);
    b.phase = ((t - T.run) * GAIT) % 1;
    b.lean = 0.06;
    b.earL = b.earR = 0.55; // swept back by the run
    b.mouth = 0.55; b.tongue = 0.75; b.smile = 0.7; b.happy = 0.15; b.brow = 0.25;
    b.lookY = 0.05;
  } else {
    b.zLog = 0;
    b.x = x1;
    b.run = 0;
    if (t < T.turn) {
      // the skid: he plants his feet and squashes down, eyes screwed up, then
      // bobs back up with everything settling
      const s = t - T.arrive;
      const skid = s < 0.3;
      b.lean = skid ? 0.05 * Math.sin(s * 40) : 0;
      b.squash = skid ? 0.84 : 1;
      b.earL = b.earR = skid ? 0.45 : 0.05;
      b.lid = skid ? 0.65 : 0;
      b.mouth = skid ? 0 : 0.12;
      b.smile = skid ? 0.2 : 0.45;
      b.tail = 0.1;
    }
    if (t >= T.notice && t < T.turn) {
      // he sees you
      b.tilt = 0.17; b.brow = 0.9; b.wide = 1; b.lookX = 0; b.lookY = 0;
      b.earL = -0.14; b.earR = -0.08; b.smile = 0.55; b.mouth = 0.2;
      b.tail = 0.25;
    }
    if (t >= T.wave && t < T.waveEnd) {
      const s = t - T.wave;
      b.arm = 1;
      b.elbow = s < 0.3 ? -0.2 : Math.sin((s - 0.3) * Math.PI * 2 * 2.3) * 0.62;
      b.tilt = -0.14 + 0.03 * Math.sin(s * Math.PI * 2 * 2.3);
      b.happy = s > 0.35 && s < 2.2 ? 1 : 0.35;
      b.mouth = 0.75; b.tongue = 0.85; b.smile = 1; b.brow = 0.7; b.blush = 1;
      b.wide = 0.3;
      b.earL = 0.25; b.earR = 0.3;
      b.tail = Math.sin(s * Math.PI * 2 * 2.9) * 0.55;
      b.lift = 0.012 * Math.abs(Math.sin((s - 0.3) * Math.PI * 2 * 2.3));
    }
    if (t >= T.waveEnd && t < T.turn) {
      // bye: a little nod and a wink
      const s = t - T.waveEnd;
      b.tilt = 0.08; b.smile = 1; b.mouth = 0.35; b.tongue = 0.3; b.blush = 0.8; b.happy = 0.25;
      b.lidL = span(t, T.wink, T.wink + 0.08) * (1 - span(t, T.wink + 0.32, T.wink + 0.42));
      b.brow = 0.6 - 0.4 * b.lidL;
      b.lift = -0.025 * Math.sin(clamp(s / 0.4) * Math.PI);
      b.tail = Math.sin(s * Math.PI * 2 * 2.9) * 0.4;
      b.lookX = s > 0.55 ? 0.7 : 0; // glances where he is going next
    }
    if (t >= T.turn && t < T.leave) {
      // crouch, hop, squeeze through side-on, land facing away
      const u = (t - T.turn) / (T.leave - T.turn);
      const crouch = u < 0.3;
      const v = clamp((u - 0.3) / 0.55);
      b.squash = crouch ? 0.86 : 1;
      b.lift = Math.sin(v * Math.PI) * 0.16;
      b.turnX = Math.max(0.4, Math.abs(Math.cos(v * Math.PI)));
      b.back = v > 0.5;
      b.lookX = 0.8; b.smile = 0.8; b.mouth = 0.3; b.earL = b.earR = 0.1;
    }
    if (t >= T.leave) {
      const u = (t - T.leave) / (T.end - T.leave);
      const e = Math.pow(u, 1.5);
      b.back = true;
      b.zLog = e;
      b.x = mix(x1, x2, easeOut(u, 1.5));
      b.gait = span(u, 0, 0.06);
      b.phase = ((t - T.leave) * GAIT) % 1;
      b.run = 1;
      b.earL = b.earR = 0.4;
      b.sink = span(u, 0.86, 1);
    }
  }
  b.lid = Math.max(b.lid, blinkAt(t));
  return b;
}

/* Step the springs towards a beat. Fixed small steps, so seeking replays the same motion. */
function stepRig(r: Rig, b: Beat, dt: number, t: number) {
  // the bound: airborne arc, squash on landing, stretch in the air
  const air = b.gait * Math.pow(Math.sin(b.phase * Math.PI), 1.3);
  const land = b.gait * Math.max(0, Math.cos(b.phase * Math.PI * 2)) * (b.phase < 0.5 ? 0 : 1);
  drive(r.squash, b.squash + air * 0.07 - land * 0.1, 260, 0.35, dt);
  drive(r.lean, b.lean + b.gait * Math.sin(b.phase * Math.PI * 2) * 0.05, 120, 0.45, dt);
  drive(r.tilt, b.tilt, 60, 0.42, dt);
  // the head trails the body: it lags the bounce and overshoots
  drive(r.headY, -air * 0.04, 140, 0.32, dt);
  drive(r.headX, b.gait * Math.sin(b.phase * Math.PI * 2 + 0.6) * 0.012, 90, 0.4, dt);
  drive(r.run, b.run, 40, 0.9, dt);
  drive(r.z, b.zLog, 70, 0.62, dt);
  // ears and tail are floppy: they swing against the bounce and the turn
  const flop = r.headY.v * 1.6 + r.tilt.v * 0.8;
  const twitch = (t > 6.9 && t < 7.0 ? -0.8 : 0) + (t > 8.15 && t < 8.22 ? 0.6 : 0);
  drive(r.earL, b.earL + flop + twitch, 150, 0.22, dt);
  drive(r.earR, b.earR + flop * 0.9 - (t > 7.6 && t < 7.68 ? 0.7 : 0), 150, 0.22, dt);
  drive(r.tail, b.tail + b.gait * Math.sin(b.phase * Math.PI * 2 - 1.2) * 0.35, 70, 0.35, dt);
  drive(r.tailTip, r.tail.x, 45, 0.3, dt);
  // the face
  drive(r.lidL, Math.max(b.lid, b.lidL), 900, 1, dt);
  drive(r.lidR, b.lid, 900, 1, dt);
  drive(r.happy, b.happy, 120, 0.8, dt);
  drive(r.lookX, b.lookX, 260, 0.75, dt);
  drive(r.lookY, b.lookY, 260, 0.75, dt);
  drive(r.brow, b.brow, 120, 0.6, dt);
  drive(r.wide, b.wide, 160, 0.5, dt);
  drive(r.mouth, b.mouth, 140, 0.65, dt);
  drive(r.smile, b.smile, 100, 0.7, dt);
  drive(r.tongue, b.tongue, 90, 0.7, dt);
  drive(r.blush, b.blush, 30, 1, dt);
  // the waving arm: the forearm follows the elbow, the paw follows the forearm
  drive(r.arm, b.arm, 70, 0.55, dt);
  drive(r.elbow, b.elbow, 160, 0.4, dt);
  drive(r.paw, r.elbow.x, 110, 0.35, dt);
}

/* ---------------- Drawing: facing the camera ---------------- */

type Look = {
  rig: Rig;
  breathe: number;
  phase: number;
  gait: number;
};

function drawEar(c: Ctx, side: 1 | -1, angle: number, front: boolean) {
  c.save();
  c.translate(side * 0.125, -0.745);
  c.rotate(side * (0.12 + angle * 0.55));
  const tip: Pt = [side * 0.035, -0.255];
  // outer ear
  shape(c, front ? furFill(c, 0, -0.12, 0.14) : furFill(c, 0, -0.12, 0.14, C.furShade, C.fur, C.furDeep), () => {
    c.moveTo(side * -0.065, 0.03);
    c.quadraticCurveTo(side * -0.07, -0.13, tip[0], tip[1]);
    c.quadraticCurveTo(side * 0.11, -0.11, side * 0.085, 0.035);
    c.closePath();
  });
  // black tip
  c.save();
  c.beginPath();
  c.moveTo(side * -0.065, 0.03);
  c.quadraticCurveTo(side * -0.07, -0.13, tip[0], tip[1]);
  c.quadraticCurveTo(side * 0.11, -0.11, side * 0.085, 0.035);
  c.closePath();
  c.clip();
  c.fillStyle = C.dark;
  c.beginPath();
  c.moveTo(side * -0.2, -0.17);
  c.quadraticCurveTo(side * 0.03, -0.14, side * 0.2, -0.2);
  c.lineTo(side * 0.2, -0.4);
  c.lineTo(side * -0.2, -0.4);
  c.closePath();
  c.fill();
  c.restore();
  if (front) {
    // inside: dark, with a pale fluff
    shape(c, C.earDeep, () => {
      c.moveTo(side * -0.035, 0.02);
      c.quadraticCurveTo(side * -0.035, -0.1, side * 0.03, -0.195);
      c.quadraticCurveTo(side * 0.075, -0.09, side * 0.06, 0.025);
      c.closePath();
    }, false);
    shape(c, C.earIn, () => {
      c.moveTo(side * -0.04, 0.035);
      c.lineTo(side * -0.03, -0.035);
      c.lineTo(side * -0.012, -0.005);
      c.lineTo(side * 0.0, -0.075);
      c.lineTo(side * 0.018, -0.015);
      c.lineTo(side * 0.04, -0.06);
      c.lineTo(side * 0.05, 0.035);
      c.closePath();
    }, false);
  }
  c.restore();
}

function drawEye(c: Ctx, side: 1 | -1, r: Rig, lid: number) {
  const cx = side * 0.083, cy = -0.665;
  const happy = clamp(r.happy.x);
  const wide = 1 + clamp(r.wide.x, -0.5, 1.5) * 0.12;
  const open = clamp(1 - lid) * (1 - happy * 0.85);
  const rx = 0.037 * wide, ry = 0.043 * wide;
  c.save();
  c.translate(cx, cy);
  // a happy eye closes into an upturned arc
  if (open < 0.12) {
    c.strokeStyle = C.eye;
    c.lineWidth = 0.011;
    c.lineCap = 'round';
    c.beginPath();
    const up = happy > lid ? 1 : -0.35; // smiling arcs curve up, blinks lie flat
    c.moveTo(-rx * 1.05, 0.004);
    c.quadraticCurveTo(0, 0.004 - up * ry * 0.95, rx * 1.05, 0.004);
    c.stroke();
    c.restore();
    return;
  }
  // the dark eye with an amber rim
  c.beginPath();
  ell(c, 0, 0, rx, ry * Math.max(0.15, open));
  c.save();
  c.clip();
  c.fillStyle = C.iris;
  c.fillRect(-rx * 1.2, -ry * 1.2, rx * 2.4, ry * 2.4);
  const lx = clamp(r.lookX.x, -1, 1) * rx * 0.28, ly = clamp(r.lookY.x, -1, 1) * ry * 0.22;
  c.fillStyle = C.eye;
  c.beginPath();
  ell(c, lx, ly, rx * 0.84, ry * 0.86);
  c.fill();
  // highlights: a big one and a small one, they make him look alive
  c.fillStyle = '#ffffff';
  c.beginPath();
  ell(c, lx + rx * 0.28, ly - ry * 0.36, rx * 0.3, ry * 0.26);
  c.fill();
  c.globalAlpha = 0.85;
  c.beginPath();
  ell(c, lx - rx * 0.3, ly + ry * 0.38, rx * 0.13, ry * 0.11);
  c.fill();
  c.globalAlpha = 1;
  // lids, inside the eye: fur coming down from above, and the cheek pushing
  // up from below when he smiles
  if (lid > 0.02) {
    c.fillStyle = C.fur;
    c.fillRect(-rx * 1.3, -ry * 1.3, rx * 2.6, ry * 2.6 * lid);
  }
  if (happy > 0.02) {
    c.fillStyle = C.white;
    c.beginPath();
    c.ellipse(0, ry * (1.3 - happy * 0.8), rx * 1.4, ry * 0.8, 0, Math.PI, 0);
    c.fill();
  }
  c.restore();
  // the dark line of the upper lid, running out at the corner like a fox's
  c.strokeStyle = C.eye;
  c.lineWidth = 0.008;
  c.lineCap = 'round';
  c.beginPath();
  const lidY = -ry * Math.max(0.15, open) * (1 - lid * 0.2);
  c.moveTo(-side * rx * 1.0, 0);
  c.quadraticCurveTo(-side * rx * 0.2, lidY * 1.25, side * rx * 1.15, -ry * 0.1);
  c.lineTo(side * rx * 1.55, ry * 0.25);
  c.stroke();
  c.restore();
}

function drawFrontArm(c: Ctx, side: 1 | -1, r: Rig) {
  // the waving arm: the upper arm swings up and out beside the face, the
  // forearm bends in and waves from the elbow, and the paw trails the forearm
  const a = clamp(r.arm.x, 0, 1.2);
  const shoulder: Pt = [side * 0.1, -0.43];
  const up = mix(0, 2.45, a);
  const fore = mix(0, 0.35, a) + r.elbow.x * a * 0.9;
  const pawA = r.paw.x * a * 0.6;
  const L1 = 0.2, L2 = 0.15;
  // canvas angles: pi/2 points down; raising swings the arm out to its side and up
  const th1 = Math.PI / 2 - side * up;
  const ex = shoulder[0] + Math.cos(th1) * L1, ey = shoulder[1] + Math.sin(th1) * L1;
  const th2 = th1 - side * fore;
  const px = ex + Math.cos(th2) * L2, py = ey + Math.sin(th2) * L2;
  // upper arm
  c.lineCap = 'round';
  c.strokeStyle = C.line;
  c.lineWidth = 0.082;
  c.beginPath(); c.moveTo(shoulder[0], shoulder[1]); c.lineTo(ex, ey); c.stroke();
  c.strokeStyle = C.fur;
  c.lineWidth = 0.07;
  c.beginPath(); c.moveTo(shoulder[0], shoulder[1]); c.lineTo(ex, ey); c.stroke();
  // forearm, in its dark sock
  c.strokeStyle = C.line;
  c.lineWidth = 0.072;
  c.beginPath(); c.moveTo(ex, ey); c.lineTo(px, py); c.stroke();
  c.strokeStyle = C.dark;
  c.lineWidth = 0.06;
  c.beginPath(); c.moveTo(ex, ey); c.lineTo(px, py); c.stroke();
  c.strokeStyle = C.fur;
  c.lineWidth = 0.066;
  c.beginPath(); c.moveTo(ex, ey); c.lineTo(mix(ex, px, 0.35), mix(ey, py, 0.35)); c.stroke();
  // the paw, palm out once it is up, with its pink beans
  c.save();
  c.translate(px, py);
  c.rotate(th2 - Math.PI / 2 + side * pawA);
  c.lineWidth = 0.009;
  shape(c, C.dark, () => ell(c, 0, 0.012, 0.042, 0.048));
  if (a > 0.6) {
    c.globalAlpha = clamp((a - 0.6) / 0.3);
    c.fillStyle = C.pad;
    c.beginPath(); ell(c, 0, 0.022, 0.018, 0.015); c.fill();
    for (const [dx, dy] of [[-0.025, -0.008], [-0.009, -0.022], [0.009, -0.022], [0.025, -0.008]] as Pt[]) {
      c.beginPath(); ell(c, dx, dy, 0.008, 0.009); c.fill();
    }
    c.globalAlpha = 1;
  }
  c.restore();
}

function drawFront(c: Ctx, L: Look) {
  const r = L.rig;
  const sit = 1 - clamp(r.run.x);
  const run = clamp(r.run.x);
  c.lineWidth = 0.009;
  c.lineJoin = 'round';

  // the tail, behind: curled round his side when sitting, flicking above his back when running
  c.save();
  c.translate(0.12, -0.1);
  c.rotate(-0.25 + r.tail.x * 0.6 - run * 0.9);
  const tipBend = (r.tailTip.x - r.tail.x) * 0.8;
  const tb = (y: number, k: number) => y + tipBend * k;
  const tail: Pt[] = [
    [0, 0.035], [0.11, 0.01], [0.22, tb(-0.04, 0.1)], [0.32, tb(-0.12, 0.2)], [0.38, tb(-0.22, 0.28)], [0.37, tb(-0.31, 0.32)],
    [0.31, tb(-0.34, 0.32)], [0.24, tb(-0.29, 0.25)], [0.18, tb(-0.2, 0.18)], [0.1, -0.13], [0.02, -0.09], [-0.04, -0.03],
  ];
  shape(c, furFill(c, 0.2, -0.15, 0.24), () => blob(c, tail));
  c.save();
  c.beginPath(); blob(c, tail); c.clip();
  c.fillStyle = C.white;
  c.beginPath(); ell(c, 0.36, tb(-0.3, 0.32), 0.1, 0.085, -0.7); c.fill();
  // a darker line of fur along its underside
  c.strokeStyle = 'rgba(140,59,19,0.35)';
  c.lineWidth = 0.02;
  c.beginPath(); c.moveTo(0.02, 0.0); c.quadraticCurveTo(0.2, -0.0, 0.33, tb(-0.15, 0.2)); c.stroke();
  c.restore();
  c.restore();

  // hind feet and haunches (sitting)
  if (sit > 0.05) {
    c.globalAlpha = sit;
    shape(c, furFill(c, -0.14, -0.13, 0.15), () => ell(c, -0.15, -0.12, 0.13, 0.12, 0.3));
    shape(c, furFill(c, 0.15, -0.13, 0.15), () => ell(c, 0.15, -0.12, 0.13, 0.12, -0.3));
    shape(c, C.dark, () => ell(c, -0.21, -0.015, 0.06, 0.028));
    shape(c, C.dark, () => ell(c, 0.21, -0.015, 0.06, 0.028));
    c.globalAlpha = 1;
  }

  // the body: chest and shoulders, breathing
  const b = L.breathe;
  shape(c, furFill(c, 0, -0.34, 0.24), () => blob(c, [
    [0, -0.58], [0.12, -0.55], [0.19 * b, -0.44], [0.2 * b, -0.3], [0.17, -0.16], [0.09, -0.06], [0, -0.04],
    [-0.09, -0.06], [-0.17, -0.16], [-0.2 * b, -0.3], [-0.19 * b, -0.44], [-0.12, -0.55],
  ]));
  // white bib, fluffy at the edge
  shape(c, C.white, () => blob(c, [
    [0, -0.57], [0.09, -0.53], [0.115, -0.44], [0.085, -0.36], [0.1, -0.31], [0.06, -0.24], [0.07, -0.19], [0.02, -0.13], [0, -0.1],
    [-0.02, -0.13], [-0.07, -0.19], [-0.06, -0.24], [-0.1, -0.31], [-0.085, -0.36], [-0.115, -0.44], [-0.09, -0.53],
  ]), false);

  // front legs: planted when sitting, pumping when running
  // hind paws coming through between the front legs as he gathers for the next bound
  if (run > 0.05 && L.gait > 0.05) {
    const g = Math.max(0, Math.sin(L.phase * Math.PI * 2 + 2.2)) * L.gait * run;
    for (const side of [-1, 1] as const) shape(c, C.dark, () => ell(c, side * 0.05, -0.03 - g * 0.08, 0.04, 0.03));
  }
  for (const side of [-1, 1] as const) {
    if (side === -1 && clamp(r.arm.x) > 0.02) continue; // the waving arm is drawn on its own
    // running: the legs take turns, one reaching out and down towards you, the other tucked up
    const swing = run * L.gait * Math.sin((L.phase + (side === 1 ? 0 : 0.5)) * Math.PI * 2);
    const out = Math.max(0, swing), tuck = Math.max(0, -swing);
    const fx = side * (0.072 + out * 0.035), fy = out * 0.035 - tuck * 0.2;
    const knee = -0.2 - tuck * 0.06;
    const leg: Pt[] = [[side * 0.072 - 0.04, -0.36], [fx - 0.042 - side * tuck * 0.03, knee], [fx - 0.034, fy - 0.07], [fx - 0.04, fy - 0.02], [fx, fy + 0.002], [fx + 0.04, fy - 0.02], [fx + 0.034, fy - 0.07], [fx + 0.042 - side * tuck * 0.03, knee], [side * 0.072 + 0.04, -0.36]];
    shape(c, furFill(c, fx + 0.02, -0.28, 0.12), () => blob(c, leg));
    c.save();
    c.beginPath(); blob(c, leg); c.clip();
    const sock = c.createLinearGradient(0, fy - 0.2, 0, fy - 0.12);
    sock.addColorStop(0, 'rgba(59,42,33,0)');
    sock.addColorStop(1, C.dark);
    c.fillStyle = sock;
    c.fillRect(fx - 0.07, fy - 0.2, 0.14, 0.25);
    c.restore();
  }

  // the head: trails the body, tilts, cheeks fluffed out
  c.save();
  c.translate(r.headX.x, r.headY.x + run * 0.06);
  c.translate(0, -0.66);
  c.rotate(r.tilt.x);
  c.translate(0, 0.66);
  drawEar(c, -1, r.earL.x, true);
  drawEar(c, 1, r.earR.x, true);
  // cheek fluff, sticking out at the sides
  for (const side of [-1, 1] as const) {
    shape(c, C.white, () => {
      c.moveTo(side * 0.15, -0.66);
      c.lineTo(side * 0.285, -0.6);
      c.lineTo(side * 0.215, -0.585);
      c.lineTo(side * 0.265, -0.545);
      c.lineTo(side * 0.17, -0.545);
      c.lineTo(side * 0.2, -0.515);
      c.lineTo(side * 0.09, -0.53);
      c.closePath();
    });
  }
  // the head
  const head: Pt[] = [
    [0, -0.815], [0.1, -0.8], [0.175, -0.755], [0.21, -0.68], [0.215, -0.615], [0.17, -0.56], [0.09, -0.525], [0, -0.515],
    [-0.09, -0.525], [-0.17, -0.56], [-0.215, -0.615], [-0.21, -0.68], [-0.175, -0.755], [-0.1, -0.8],
  ];
  shape(c, furFill(c, 0, -0.68, 0.2), () => blob(c, head));
  // the white lower face, with the orange running down the bridge of the nose
  c.save();
  c.beginPath(); blob(c, head); c.clip();
  c.fillStyle = C.white;
  c.beginPath();
  c.moveTo(-0.26, -0.64);
  c.quadraticCurveTo(-0.15, -0.6, -0.085, -0.625);
  c.quadraticCurveTo(-0.035, -0.64, -0.022, -0.6);
  c.quadraticCurveTo(0, -0.578, 0.022, -0.6);
  c.quadraticCurveTo(0.035, -0.64, 0.085, -0.625);
  c.quadraticCurveTo(0.15, -0.6, 0.26, -0.64);
  c.lineTo(0.26, -0.45);
  c.lineTo(-0.26, -0.45);
  c.closePath();
  c.fill();
  // soft shading under the chin and at the sides
  const shadeG = c.createLinearGradient(0, -0.6, 0, -0.51);
  shadeG.addColorStop(0, 'rgba(160,110,70,0)');
  shadeG.addColorStop(1, 'rgba(160,110,70,0.18)');
  c.fillStyle = shadeG;
  c.fillRect(-0.3, -0.6, 0.6, 0.1);
  c.restore();
  // blush when he is pleased
  if (r.blush.x > 0.01) {
    c.globalAlpha = clamp(r.blush.x) * 0.5;
    const blush = c.createRadialGradient(0, 0, 0, 0, 0, 0.05);
    blush.addColorStop(0, '#f2898b');
    blush.addColorStop(1, 'rgba(242,137,139,0)');
    for (const side of [-1, 1]) {
      c.save(); c.translate(side * 0.135, -0.6); c.scale(1, 0.6);
      c.fillStyle = blush; c.beginPath(); ell(c, 0, 0, 0.05, 0.05); c.fill();
      c.restore();
    }
    c.globalAlpha = 1;
  }
  // brows: little darker tufts that lift with surprise and joy
  const brow = clamp(r.brow.x, -0.5, 1.2);
  c.strokeStyle = C.furDeep;
  c.lineWidth = 0.011;
  c.lineCap = 'round';
  for (const side of [-1, 1] as const) {
    const lift = brow * 0.022 + (side === -1 ? clamp(r.lidL.x) * -0.012 : 0);
    c.beginPath();
    c.moveTo(side * 0.055, -0.712 - lift);
    c.quadraticCurveTo(side * 0.085, -0.73 - lift * 1.2, side * 0.115, -0.715 - lift * 0.7);
    c.stroke();
  }
  drawEye(c, -1, r, clamp(r.lidL.x));
  drawEye(c, 1, r, clamp(r.lidR.x));
  // the mouth: a soft smile, opening into a pant with the tongue out
  const open = clamp(r.mouth.x, 0, 1.2);
  const smile = clamp(r.smile.x, 0, 1.2);
  const my = -0.565;
  if (open > 0.05) {
    shape(c, C.mouth, () => {
      c.moveTo(-0.045 - smile * 0.01, my - 0.004 - smile * 0.008);
      c.quadraticCurveTo(0, my + 0.008, 0.045 + smile * 0.01, my - 0.004 - smile * 0.008);
      c.quadraticCurveTo(0.04, my + open * 0.05, 0, my + open * 0.06);
      c.quadraticCurveTo(-0.04, my + open * 0.05, -0.045 - smile * 0.01, my - 0.004 - smile * 0.008);
      c.closePath();
    }, false);
    const tg = clamp(r.tongue.x) * open;
    if (tg > 0.05) {
      c.save();
      c.beginPath();
      c.moveTo(-0.045, my - 0.01);
      c.quadraticCurveTo(0, my + 0.008, 0.045, my - 0.01);
      c.quadraticCurveTo(0.04, my + open * 0.05, 0, my + open * 0.06);
      c.quadraticCurveTo(-0.04, my + open * 0.05, -0.045, my - 0.01);
      c.closePath();
      c.rect(-0.05, my, 0.1, 0.08);
      c.clip();
      c.fillStyle = C.tongue;
      c.beginPath();
      ell(c, 0, my + open * 0.045 + tg * 0.02, 0.026, 0.024 + tg * 0.01);
      c.fill();
      c.strokeStyle = 'rgba(180,70,80,0.5)';
      c.lineWidth = 0.004;
      c.beginPath(); c.moveTo(0, my + open * 0.035); c.lineTo(0, my + open * 0.045 + tg * 0.03); c.stroke();
      c.restore();
    }
  }
  c.strokeStyle = C.nose;
  c.lineWidth = 0.008;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, -0.585);
  c.lineTo(0, my + 0.002);
  c.moveTo(-0.045 - smile * 0.01, my - 0.004 - smile * 0.01);
  c.quadraticCurveTo(-0.022, my + 0.012 - smile * 0.004, 0, my + 0.002);
  c.quadraticCurveTo(0.022, my + 0.012 - smile * 0.004, 0.045 + smile * 0.01, my - 0.004 - smile * 0.01);
  c.stroke();
  // the nose, with its shine
  shape(c, C.nose, () => {
    c.moveTo(-0.03, -0.603);
    c.quadraticCurveTo(0, -0.615, 0.03, -0.603);
    c.quadraticCurveTo(0.03, -0.585, 0, -0.578);
    c.quadraticCurveTo(-0.03, -0.585, -0.03, -0.603);
    c.closePath();
  }, false);
  c.fillStyle = 'rgba(255,255,255,0.75)';
  c.beginPath(); ell(c, 0.01, -0.603, 0.009, 0.004); c.fill();
  c.restore();

  // the waving arm, in front of everything
  if (clamp(r.arm.x) > 0.02) drawFrontArm(c, -1, r);
}

/* ---------------- Drawing: from behind ---------------- */

function drawBack(c: Ctx, L: Look) {
  const r = L.rig;
  c.lineWidth = 0.009;
  c.lineJoin = 'round';
  const kick = L.gait * Math.sin(L.phase * Math.PI * 2);
  // hind legs, kicking back towards the camera as he bounds off
  for (const side of [-1, 1] as const) {
    const lift = Math.max(0, side * kick) * 0.08 + L.gait * 0.02;
    shape(c, C.dark, () => blob(c, [[side * 0.09, -0.16], [side * 0.15, -0.14], [side * 0.15, -0.03 - lift], [side * 0.12, -0.0 - lift], [side * 0.07, -0.01 - lift], [side * 0.075, -0.12]]));
  }
  // the body from behind
  shape(c, furFill(c, 0.02, -0.36, 0.24, C.fur, C.furLight, C.furShade), () => blob(c, [
    [0, -0.58], [0.11, -0.54], [0.17, -0.44], [0.19, -0.3], [0.2, -0.17], [0.13, -0.08], [0, -0.07],
    [-0.13, -0.08], [-0.2, -0.17], [-0.19, -0.3], [-0.17, -0.44], [-0.11, -0.54],
  ]));
  // haunches
  for (const side of [-1, 1] as const) shape(c, furFill(c, side * 0.11, -0.17, 0.12), () => ell(c, side * 0.105, -0.16, 0.105, 0.1, side * 0.2));
  // the back of the head, a little white of the cheeks showing at the sides
  c.save();
  c.translate(r.headX.x, r.headY.x);
  for (const side of [-1, 1] as const) {
    shape(c, C.white, () => {
      c.moveTo(side * 0.14, -0.64);
      c.lineTo(side * 0.27, -0.6);
      c.lineTo(side * 0.2, -0.575);
      c.lineTo(side * 0.24, -0.54);
      c.lineTo(side * 0.12, -0.55);
      c.closePath();
    });
  }
  drawEar(c, -1, r.earL.x, false);
  drawEar(c, 1, r.earR.x, false);
  shape(c, furFill(c, 0, -0.67, 0.2, C.fur, C.furLight, C.furShade), () => blob(c, [
    [0, -0.81], [0.12, -0.79], [0.2, -0.72], [0.21, -0.63], [0.15, -0.56], [0, -0.53], [-0.15, -0.56], [-0.21, -0.63], [-0.2, -0.72], [-0.12, -0.79],
  ]));
  c.restore();
  // the tail, raised and curling up beside him like a flag, bouncing with
  // each bound and swaying, the white tip flicking last
  c.save();
  c.translate(0.03, -0.17);
  const sway = r.tail.x * 0.3;
  const bob = -L.gait * Math.sin(L.phase * Math.PI * 2 - 1.1) * 0.06;
  const flick = (r.tailTip.x - r.tail.x) * 0.5;
  c.rotate(sway * 0.5 + 0.05);
  const tail: Pt[] = [
    [-0.06, 0.04], [-0.1, -0.06], [-0.07, -0.2], [0.02, -0.33 + bob * 0.5], [0.12 + flick, -0.44 + bob], [0.22 + flick, -0.47 + bob],
    [0.27 + flick, -0.41 + bob], [0.24 + flick * 0.6, -0.31 + bob * 0.6], [0.16, -0.22 + bob * 0.3], [0.1, -0.1], [0.07, 0.02],
  ];
  shape(c, furFill(c, 0.08, -0.25, 0.26, '#d8651f', '#f08e3e', '#a2461a'), () => blob(c, tail));
  c.save();
  c.beginPath(); blob(c, tail); c.clip();
  c.fillStyle = C.white;
  c.beginPath(); ell(c, 0.22 + flick, -0.45 + bob, 0.1, 0.085, 0.5); c.fill();
  c.strokeStyle = 'rgba(140,59,19,0.35)';
  c.lineWidth = 0.022;
  c.beginPath(); c.moveTo(0.0, 0.02); c.quadraticCurveTo(0.0, -0.22, 0.14 + flick, -0.37 + bob); c.stroke();
  c.restore();
  c.restore();
}

/* ---------------- Mounting ---------------- */

export function mountFox(stage: FoxStage): FoxHandle {
  const canvas = document.createElement('canvas');
  canvas.className = 'sl-fox';
  canvas.setAttribute('aria-hidden', 'true');
  stage.host.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const occ = document.createElement('canvas');
  const oc = occ.getContext('2d')!;

  let w = 0, h = 0, top = 0, dpr = 1;
  const resize = () => {
    w = Math.round(window.innerWidth);
    h = Math.round(stage.host.querySelector<HTMLElement>('.sl-grass-canvas')?.offsetTop ?? 0) / 0.6 || window.innerHeight;
    top = Math.round(h * 0.5);
    dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2);
    canvas.style.top = `${top}px`;
    canvas.style.height = `${h - top}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round((h - top) * dpr);
  };
  resize();

  let rig = newRig();
  let t = 0;
  let raf = 0;
  let last = 0;
  let running = false;
  let lastBox: [number, number, number, number] | null = null;

  const STEP = 1 / 240;
  const advance = (to: number) => {
    while (t < to) {
      const b = beat(t, w > 700);
      stepRig(rig, b, STEP, t);
      t += STEP;
    }
  };

  // The grass canvas, mapped into screen space: it starts 3 % left, is 106 % wide and starts at 60 % down.
  const grassBox = () => {
    const g = stage.grass;
    return { x: g.offsetLeft, y: g.offsetTop, w: g.offsetWidth, h: g.offsetHeight, sx: g.width / Math.max(1, g.offsetWidth), sy: g.height / Math.max(1, g.offsetHeight) };
  };

  const render = () => {
    const b = beat(t, w > 700);
    const horizon = stage.horizonAt(w * b.x);
    const near = h * 1.0; // where his feet are when he stops: the bottom of the screen
    const tall = Math.min(h * 0.3, w * 0.5); // his height there
    const Z0 = tall / 7; // far off he is about 7 px tall
    const Z = Math.exp(Math.log(Z0) * clamp(rig.z.x, -0.03, 1.2));
    const size = tall / Z;
    const footY = horizon + (near + tall * 0.06 - horizon) / Z;
    const fx = w * b.x;
    const lift = (b.gait * Math.pow(Math.sin(b.phase * Math.PI), 1.3) * 0.11 + b.lift) * size;
    const sink = b.sink * size * 0.9;

    // clear what was drawn last frame
    ctx.setTransform(dpr, 0, 0, dpr, 0, -top * dpr);
    if (lastBox) ctx.clearRect(lastBox[0], lastBox[1], lastBox[2], lastBox[3]);
    if (size < 1) { lastBox = null; return; }
    const box: [number, number, number, number] = [fx - size * 0.7, footY - size * 1.3 - lift, size * 1.4, size * 1.45 + lift];
    lastBox = [box[0] - 4, box[1] - 4, box[2] + 8, box[3] + 8];

    // the fox
    ctx.save();
    ctx.translate(fx, footY - lift + sink);
    const sq = clamp(rig.squash.x, 0.7, 1.3);
    ctx.scale(size * b.turnX * (2 - sq) ** 0.5, size * sq);
    ctx.rotate(rig.lean.x * (b.back ? -1 : 1));
    const look: Look = { rig, breathe: 1 + 0.012 * Math.sin(t * Math.PI * 2 * 0.45), phase: b.phase, gait: b.gait };
    if (b.back) drawBack(ctx, look); else drawFront(ctx, look);
    ctx.restore();

    // far off, he takes on the haze like the grass around him
    const s = clamp((footY - horizon) / Math.max(1, near - horizon));
    const hz = stage.haze();
    if (hz) {
      const a = s < 0.08 ? mix(0.75, 0.5, s / 0.08) : s < 0.3 ? mix(0.5, 0.2, (s - 0.08) / 0.22) : mix(0.2, 0, clamp((s - 0.3) / 0.25));
      if (a > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = `rgba(${hz},${a.toFixed(3)})`;
        ctx.fillRect(box[0], box[1], box[2], box[3]);
        ctx.restore();
      }
    }

    // the grass in front of him: the field's own painting from just above his
    // feet down, faded in over his legs, then blades over the edge; both laid
    // only on him (source-atop), so the field around him is untouched
    const gb = grassBox();
    const reach = size * 0.42; // how tall the grass stands against him
    const oy0 = footY - reach, oy1 = Math.min(h + 2, footY + size * 0.1);
    const ow = Math.ceil(box[2]), oh = Math.ceil(oy1 - oy0);
    if (ow > 0 && oh > 0) {
      // the scratch canvas only ever grows, so it is not reallocated every frame
      if (occ.width < Math.ceil(ow * dpr) || occ.height < Math.ceil(oh * dpr)) {
        occ.width = Math.max(occ.width, Math.ceil(ow * dpr));
        occ.height = Math.max(occ.height, Math.ceil(oh * dpr));
      }
      oc.setTransform(dpr, 0, 0, dpr, 0, 0);
      oc.globalCompositeOperation = 'source-over';
      oc.clearRect(0, 0, occ.width / dpr, occ.height / dpr);
      oc.drawImage(stage.grass,
        (box[0] - gb.x) * gb.sx, (oy0 - gb.y) * gb.sy, ow * gb.sx, oh * gb.sy,
        0, 0, ow, oh);
      oc.globalCompositeOperation = 'destination-in';
      const fade = oc.createLinearGradient(0, 0, 0, oh);
      fade.addColorStop(0, 'rgba(0,0,0,0)');
      fade.addColorStop(clamp(reach * 0.3 / oh), 'rgba(0,0,0,0.9)');
      fade.addColorStop(clamp(reach * 0.45 / oh), 'rgba(0,0,0,1)');
      fade.addColorStop(1, 'rgba(0,0,0,1)');
      oc.fillStyle = fade;
      oc.fillRect(0, 0, ow, oh);
      oc.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      ctx.drawImage(occ, 0, 0, ow * dpr, oh * dpr, box[0], oy0, ow, oh);
      // blades standing in front of him, rooted at fixed spots in the field so
      // they stay put as he moves through them
      const step = Math.max(1.6, size * 0.03);
      const pal = paletteAt(s);
      for (let gx = Math.floor(box[0] / step); gx * step < box[0] + box[2]; gx++) {
        const hsh = hash(gx);
        const bx = gx * step + (hsh - 0.5) * step;
        const root = footY - reach * (0.05 + 0.3 * hash(gx + 7.3));
        const len = reach * (0.45 + 0.6 * hash(gx + 3.1));
        const ang = -1.05 - 0.55 * hash(gx + 1.7) + 0.08 * Math.sin(t * 1.3 + gx);
        const wid = Math.max(0.6, size * (0.006 + 0.008 * hash(gx + 9.9)));
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = pal[Math.floor(hash(gx + 4.4) * pal.length)];
        ctx.beginPath();
        const tx = bx + Math.cos(ang) * len, ty = root + Math.sin(ang) * len;
        ctx.moveTo(bx - wid, root);
        ctx.quadraticCurveTo(bx + Math.cos(ang) * len * 0.5 - wid * 0.5, root + Math.sin(ang) * len * 0.5, tx, ty);
        ctx.quadraticCurveTo(bx + Math.cos(ang) * len * 0.5 + wid * 0.5, root + Math.sin(ang) * len * 0.5, bx + wid, root);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  };

  // Colours of the field at each depth, sampled once per run from its canvas.
  let palette: string[][] = [];
  const samplePalette = () => {
    palette = [];
    const g = stage.grass;
    const gctx = g.getContext('2d');
    const gb = grassBox();
    if (!gctx || !g.width) return;
    for (let i = 0; i <= 10; i++) {
      const horizon = stage.horizonAt(w * 0.6);
      const y = horizon + (h - horizon) * (i / 10) * 0.97;
      const row = Math.round((y - gb.y) * gb.sy);
      if (row < 0 || row >= g.height) { palette.push(['#8f8742']); continue; }
      const data = gctx.getImageData(0, row, g.width, 1).data;
      const list: string[] = [];
      for (let k = 0; k < 12; k++) {
        const x = Math.floor(((k + 0.5) / 12) * g.width) * 4;
        list.push(`rgb(${data[x]},${data[x + 1]},${data[x + 2]})`);
      }
      palette.push(list);
    }
  };
  const paletteAt = (s: number) => palette[Math.round(clamp(s) * 10)] ?? ['#8f8742'];

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;
    // on a slow frame the springs take more small steps, so his timing holds
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    advance(t + dt);
    render();
    if (t >= T.end) { running = false; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); lastBox = null; return; }
    raf = requestAnimationFrame(frame);
  };

  let held = false; // seek() holds him on a frame (tests and screenshots)
  const play = () => {
    if (running || held) return;
    samplePalette();
    rig = newRig();
    t = 0;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  return {
    play,
    playing: () => running,
    seek: (to: number) => {
      held = true;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      rig = newRig();
      t = 0;
      if (!palette.length) samplePalette();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lastBox = null;
      advance(to);
      render();
    },
    resize,
    destroy: () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
    },
  };
}
