/*
  critters — the fox and the rabbit in the homepage grass (used by
  components/SunlitScene.tsx). They are friends, and every so often they play
  out a short scene: a chase where they swap who is chasing, a rest where the
  fox lies down and the rabbit grooms beside it, a pounce game, a run straight
  at the camera, peekaboo in the near grass, or a run side by side. Scenes are
  picked at random (never the same one twice in a row) and often mirrored.

  Each animal is a set of painted poses (public/images/sunlit/), all at one
  scale per animal, anchored at the feet. A scene is a timeline of steps per
  animal (move, hold a pose, jump, rise out of or sink into the grass); each
  frame the step under the current time sets the pose, position and size.
  Depth d runs from the hill crest (0) to the bottom of the screen (1) and on
  towards the camera. Deeper is bigger; they move between three lanes cut
  between the far, mid and near grass; closer than all of it they go soft,
  as if the lens were focused on the field.
*/

type Frame = { src: string; w: number; h: number };

/* Sprite sizes are the exported WebP sizes; every pose of one animal shares a
   scale. REF is the fox's stretched leap: its width is one body length. */
const FOX = {
  gallop: [{ src: 'fox-leap', w: 520, h: 228 }, { src: 'fox-tuck', w: 520, h: 228 }],
  trot: [{ src: 'fox-trot-a', w: 507, h: 236 }, { src: 'fox-trot-b', w: 507, h: 236 }],
  toward: [{ src: 'fox-front-a', w: 251, h: 277 }, { src: 'fox-front-b', w: 251, h: 277 }],
  sit: [{ src: 'fox-sit', w: 277, h: 354 }],
  bow: [{ src: 'fox-bow', w: 493, h: 288 }],
  pounce: [{ src: 'fox-pounce', w: 411, h: 246 }],
  lie: [{ src: 'fox-lie', w: 514, h: 187 }],
} satisfies Record<string, Frame[]>;
const RABBIT = {
  gallop: [{ src: 'rabbit-hop', w: 519, h: 219 }, { src: 'rabbit-tuck', w: 519, h: 219 }],
  hop: [{ src: 'rabbit-hop', w: 519, h: 219 }, { src: 'rabbit-tuck', w: 519, h: 219 }],
  toward: [{ src: 'rabbit-front-a', w: 195, h: 307 }, { src: 'rabbit-front-b', w: 195, h: 307 }],
  sit: [{ src: 'rabbit-sit', w: 269, h: 344 }],
  groom: [{ src: 'rabbit-groom', w: 258, h: 318 }],
  binky: [{ src: 'rabbit-binky', w: 334, h: 298 }],
  flop: [{ src: 'rabbit-flop', w: 479, h: 156 }],
} satisfies Record<string, Frame[]>;

export type Kit = Record<string, Frame[]>;
export const KITS: { fox: Kit; rabbit: Kit } = { fox: FOX, rabbit: RABBIT };
export const REF_W = 520;

/* How each gait moves: seconds per stride, how high the body lifts, and
   whether its first frame is the stretched, airborne one (bounding gaits) or
   the frames simply alternate (trot). */
const GAITS: Record<string, { cycle: number; bounce: number; bound: boolean }> = {
  'fox:gallop': { cycle: 0.46, bounce: 0.13, bound: true },
  'fox:trot': { cycle: 0.52, bounce: 0.025, bound: false },
  'fox:toward': { cycle: 0.42, bounce: 0.07, bound: true },
  'rabbit:gallop': { cycle: 0.36, bounce: 0.24, bound: true },
  'rabbit:hop': { cycle: 0.56, bounce: 0.16, bound: true },
  'rabbit:toward': { cycle: 0.36, bounce: 0.14, bound: true },
};

export type Screen = { w: number; h: number; hill: number };

type Step = {
  t0: number;
  t1: number;
  x0: number;
  d0: number;
  x1: number;
  d1: number;
  pose: string;
  face: 1 | -1;
  gait?: { cycle: number; bounce: number; bound: boolean };
  arc?: number; // a single jump: peak height as a fraction of the grass band
  sink0?: number; // 0 = standing in the open, 1 = hidden down in the grass
  sink1?: number;
  idle?: 'breathe' | 'groom' | 'wag';
};

// How long something takes to cover a distance in body lengths per second.
function travel(sc: Screen, size: number, x0: number, d0: number, x1: number, d1: number, bodyLengthsPerSec: number) {
  const band = sc.h * (1 - sc.hill);
  const px = Math.hypot((x1 - x0) * sc.w, (d1 - d0) * band);
  const d = (d0 + d1) / 2;
  return px / Math.max(1, bodyLengthsPerSec * span(sc, d) * size);
}

/** On-screen body length (px) of the fox at depth d; everything scales from it. */
export function span(sc: Screen, d: number) {
  const band = sc.h * (1 - sc.hill);
  return Math.min(band * (0.32 + 1.6 * Math.pow(Math.max(0, d), 1.6)), sc.w * 0.55 + 60);
}

// Poses an animal can rest in; anything else (a gait, a jump) rests as 'sit'.
const RESTING = new Set(['sit', 'lie', 'bow', 'groom', 'flop']);

class Track {
  steps: Step[] = [];
  t: number;
  sunk = 0; // how far down in the grass it is now
  constructor(public who: 'fox' | 'rabbit', public size: number, public x: number, public d: number, public face: 1 | -1 = 1, start = 0) {
    this.t = start;
  }
  private push(s: Omit<Step, 't0' | 't1'> & { dur: number }) {
    const { dur, ...rest } = s;
    this.steps.push({ ...rest, t0: this.t, t1: this.t + dur });
    this.t += dur;
    this.x = rest.x1;
    this.d = rest.d1;
    return this;
  }
  /** Run, trot or hop to a spot, at a pace in body lengths per second. */
  go(sc: Screen, pose: string, x: number, d: number, pace: number, opts: { dur?: number; until?: number } = {}) {
    const gait = GAITS[`${this.who}:${pose}`];
    if (pose !== 'toward' && Math.abs(x - this.x) > 0.001) this.face = x > this.x ? 1 : -1;
    this.sunk = 0;
    const dur = opts.until !== undefined ? Math.max(0.3, opts.until - this.t)
      : opts.dur ?? travel(sc, this.size, this.x, this.d, x, d, pace);
    return this.push({ x0: this.x, d0: this.d, x1: x, d1: d, pose, face: this.face, gait, dur });
  }
  /** Hold a pose where it is. */
  hold(pose: string, dur: number, idle: Step['idle'] = 'breathe') {
    const sunk = this.sunk > 0 ? { sink0: this.sunk, sink1: this.sunk } : {};
    return this.push({ x0: this.x, d0: this.d, x1: this.x, d1: this.d, pose, face: this.face, idle, ...sunk, dur });
  }
  /** A single leap in one pose (a pounce, a binky), ending at x, d. */
  jump(pose: string, x: number, d: number, dur: number, arc: number) {
    if (Math.abs(x - this.x) > 0.001) this.face = x > this.x ? 1 : -1;
    return this.push({ x0: this.x, d0: this.d, x1: x, d1: d, pose, face: this.face, arc, dur });
  }
  /** Rise out of the grass or duck back into it, in a held pose. */
  sink(pose: string, from: number, to: number, dur: number) {
    this.sunk = to;
    return this.push({ x0: this.x, d0: this.d, x1: this.x, d1: this.d, pose, face: this.face, sink0: from, sink1: to, dur });
  }
  turn(face?: 1 | -1) { this.face = face ?? (this.face > 0 ? -1 : 1); return this; }
  /** Stay put until a moment: out of sight if it has not come on yet, otherwise resting where it is. */
  wait(until: number) {
    if (until <= this.t) return this;
    const last = this.steps[this.steps.length - 1];
    if (!last) { this.t = until; return this; }
    const idle = last.idle === 'groom' || last.idle === 'wag' ? last.idle : 'breathe';
    return this.hold(RESTING.has(last.pose) ? last.pose : 'sit', until - this.t, idle);
  }
  get end() { return this.t; }
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
// A gap of n fox body lengths at depth d, as a fraction of the screen width.
const gap = (sc: Screen, n: number, d: number) => (n * span(sc, d)) / sc.w;

/* ---------------- Scenes ---------------- */

type Scene = (sc: Screen) => Track[];
const FOX_SIZE = 1;
const RABBIT_SIZE = 0.62;

const SCENES: Record<string, Scene> = {
  // The rabbit runs, the fox chases; the rabbit stops and turns, the fox drops
  // into a play bow, the rabbit kicks up a binky, and then the rabbit chases the fox back.
  chase(sc) {
    const d = rnd(0.32, 0.46);
    const r = new Track('rabbit', RABBIT_SIZE, -0.1, d);
    const f = new Track('fox', FOX_SIZE, -0.2, d + 0.05, 1, 0.35);
    r.go(sc, 'gallop', 0.58, d, 3.4);
    const stop = r.end;
    f.go(sc, 'gallop', 0.43, d + 0.05, 3.2, { until: stop + 0.25 });
    r.turn(-1).hold('sit', 0.45).jump('binky', 0.58, d, 0.6, 0.32).hold('sit', 0.5);
    f.turn(1).hold('bow', r.end - f.end + 0.15, 'wag');
    f.go(sc, 'gallop', -0.22, d + 0.05, 3.3);
    r.wait(f.steps[f.steps.length - 1].t0 + 0.3).go(sc, 'gallop', -0.12, d, 3.6);
    return [f, r];
  },
  // They wander in; the fox lies down, the rabbit sits by it and grooms, then flops; then off they go.
  rest(sc) {
    const d = rnd(0.4, 0.54);
    const x = rnd(0.42, 0.6);
    const f = new Track('fox', FOX_SIZE, -0.18, d);
    const r = new Track('rabbit', RABBIT_SIZE, -0.12, d + 0.07, 1, 0.9);
    f.go(sc, 'trot', x, d, 1.5).hold('sit', 0.7);
    r.go(sc, 'hop', x + Math.max(0.09, gap(sc, 0.95, d)), d + 0.07, 2.4).turn(-1).hold('sit', 0.8);
    const settle = Math.max(f.end, r.end);
    f.hold('sit', settle - f.end + 0.3).hold('lie', 5.2);
    r.wait(settle).hold('groom', 2.4, 'groom').hold('flop', 2.4).hold('sit', 0.5);
    r.go(sc, 'hop', 1.14, d + 0.07, 2.6);
    f.wait(Math.max(f.end, r.steps[r.steps.length - 1].t0)).hold('sit', 0.4).go(sc, 'trot', 1.18, d, 1.7);
    return [f, r];
  },
  // The rabbit sits in the open; the fox trots up, crouches, pounces, and the rabbit leaps clear and they race off.
  pounce(sc) {
    const d = rnd(0.36, 0.5);
    const r = new Track('rabbit', RABBIT_SIZE, -0.1, d + 0.04);
    r.go(sc, 'hop', 0.62, d + 0.04, 2.6).hold('sit', 0.4);
    const f = new Track('fox', FOX_SIZE, -0.2, d, 1, Math.max(0, r.end - 2.2));
    f.go(sc, 'trot', 0.32, d, 1.6).hold('bow', 1.1, 'wag');
    r.wait(f.end - 0.9).turn(-1).hold('sit', 0.5).turn(1);
    const leap = f.end;
    f.jump('pounce', 0.5, d, 0.75, 0.42);
    r.wait(leap + 0.45).jump('binky', 0.7, d + 0.04, 0.55, 0.3).go(sc, 'gallop', 1.14, d + 0.04, 3.6);
    f.hold('sit', 0.35).go(sc, 'gallop', 1.2, d, 3.3);
    return [f, r];
  },
  // They come over to say hello: in from the side, then straight at the camera, going soft as they come close.
  hello(sc) {
    const d = rnd(0.16, 0.26);
    const xr = rnd(0.42, 0.55);
    const r = new Track('rabbit', RABBIT_SIZE, -0.1, d);
    const f = new Track('fox', FOX_SIZE, -0.2, d - 0.03, 1, 0.4);
    r.go(sc, 'hop', xr, d, 2.6).hold('sit', 0.6);
    f.go(sc, 'trot', xr - 0.14, d - 0.03, 1.6, { until: r.end + 0.1 }).hold('sit', 0.4);
    const go = Math.max(r.end, f.end);
    r.wait(go).go(sc, 'toward', xr + rnd(-0.06, 0.08), 1.38, 0, { dur: 1.7 });
    f.wait(go + 0.5).go(sc, 'toward', xr - 0.14 + rnd(-0.1, 0.02), 1.38, 0, { dur: 1.55 });
    return [f, r];
  },
  // Two heads pop up out of the near grass, look at each other, duck, then dash off.
  peekaboo(sc) {
    const d = rnd(0.68, 0.78);
    const xr = rnd(0.3, 0.42);
    const xf = Math.min(0.88, xr + Math.max(rnd(0.2, 0.3), gap(sc, 0.7, d)));
    const r = new Track('rabbit', RABBIT_SIZE, xr, d, 1, 0);
    const f = new Track('fox', FOX_SIZE, xf, d + 0.03, -1, 0.9);
    r.sink('sit', 1, 0, 0.5).hold('sit', 0.7).turn(-1).hold('sit', 0.5).turn(1);
    f.sink('sit', 1, 0, 0.5).hold('sit', 0.4);
    const look = Math.max(r.end, f.end);
    r.wait(look).hold('sit', 1.2).sink('sit', 0, 1, 0.35);
    f.wait(look).hold('sit', 1.25).sink('sit', 0, 1, 0.35);
    const dash = Math.max(r.end, f.end) + 0.6;
    r.wait(dash).go(sc, 'gallop', 1.14, d - 0.12, 3.6);
    f.wait(dash + 0.35).turn(1).go(sc, 'gallop', 1.2, d - 0.1, 3.4);
    return [f, r];
  },
  // Side by side at a run, the rabbit kicking up a binky halfway across.
  together(sc) {
    const d = rnd(0.3, 0.46);
    const r = new Track('rabbit', RABBIT_SIZE, -0.1, d + 0.08);
    const f = new Track('fox', FOX_SIZE, -0.14, d, 1, 0.15);
    const mid = rnd(0.38, 0.55);
    r.go(sc, 'gallop', mid, d + 0.08, 3.4).jump('binky', mid + 0.1, d + 0.08, 0.6, 0.3).go(sc, 'gallop', 1.14, d + 0.08, 3.6);
    f.go(sc, 'gallop', 1.18, d, 3.1, { until: r.end + 0.2 });
    return [f, r];
  },
};

/* ---------------- Playing them ---------------- */

type Actor = {
  who: 'fox' | 'rabbit';
  kit: Kit;
  size: number;
  el: HTMLDivElement;
  imgs: Map<string, HTMLImageElement>;
  shown: HTMLImageElement | null;
  lane: number;
};

function makeActor(who: 'fox' | 'rabbit', size: number, base: string): Actor {
  const kit = KITS[who];
  const el = document.createElement('div');
  el.className = 'sl-critter';
  const imgs = new Map<string, HTMLImageElement>();
  for (const frames of Object.values(kit)) {
    for (const fr of frames) {
      if (imgs.has(fr.src) || !fr.w) continue;
      const img = new Image();
      img.src = `${base}${fr.src}.webp`;
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      img.style.width = `${fr.w}px`;
      img.style.height = `${fr.h}px`;
      img.style.left = `${-fr.w / 2}px`;
      img.style.top = `${-fr.h}px`;
      el.appendChild(img);
      imgs.set(fr.src, img);
    }
  }
  return { who, kit, size, el, imgs, shown: null, lane: -1 };
}

export function createCritters(lanes: HTMLElement[], ridgeAt: (x: number, w: number, h: number) => number, hill: number) {
  const actors = { fox: makeActor('fox', FOX_SIZE, '/images/sunlit/'), rabbit: makeActor('rabbit', RABBIT_SIZE, '/images/sunlit/') };
  const all = [actors.fox, actors.rabbit];
  let tracks: Track[] | null = null;
  let start = 0;
  let next = performance.now() + 1800;
  let lastScene = '';
  let mirror = false;
  let forced: { name: string; mirror: boolean } | null = null;

  const hide = () => all.forEach((a) => { a.el.style.visibility = 'hidden'; });
  const toLane = (a: Actor, lane: number) => {
    if (a.lane === lane) return;
    a.lane = lane;
    lanes[lane].appendChild(a.el);
  };
  all.forEach((a) => toLane(a, 0));
  hide();

  const begin = (now: number, sc: Screen) => {
    const names = Object.keys(SCENES).filter((n) => n !== lastScene);
    const name = forced?.name ?? names[Math.floor(Math.random() * names.length)];
    lastScene = name;
    tracks = SCENES[name](sc);
    mirror = forced?.mirror ?? Math.random() < 0.5;
    forced = null;
    start = now;
  };

  const show = (a: Actor, st: Step, t: number, sc: Screen) => {
    const u = Math.min(1, Math.max(0, (t - st.t0) / Math.max(0.001, st.t1 - st.t0)));
    const ease = st.gait ? u : u * u * (3 - 2 * u);
    const x = (st.x0 + (st.x1 - st.x0) * ease);
    const d = st.d0 + (st.d1 - st.d0) * ease;
    const frames = a.kit[st.pose];
    let frame = frames[0];
    let lift = 0;
    let airborne = false;
    const S = (span(sc, d) / REF_W) * a.size;
    const local = t - st.t0;
    if (st.gait) {
      const phase = local / st.gait.cycle;
      const hop = phase % 1;
      if (st.gait.bound) {
        frame = frames[hop > 0.14 && hop < 0.76 ? 0 : 1];
        airborne = hop > 0.3 && hop < 0.7;
        lift = Math.sin(Math.PI * hop) * st.gait.bounce * frame.h * S;
      } else {
        frame = frames[Math.floor(phase * 2) % frames.length];
        lift = Math.abs(Math.sin(Math.PI * phase * 2)) * st.gait.bounce * frame.h * S;
      }
    } else if (st.arc) {
      lift = Math.sin(Math.PI * u) * st.arc * sc.h * (1 - sc.hill);
      airborne = u > 0.15 && u < 0.85;
    }
    if (!frame.w) return false; // a pose whose painting is missing
    const img = a.imgs.get(frame.src);
    if (!img) return false;
    if (a.shown !== img) {
      if (a.shown) a.shown.style.opacity = '0';
      img.style.opacity = '1';
      a.shown = img;
    }

    const sink = st.sink0 !== undefined ? st.sink0 + ((st.sink1 ?? st.sink0) - st.sink0) * (u * u * (3 - 2 * u)) : 0;
    lift -= sink * frame.h * S * 0.85;
    let scaleY = 1;
    let rotate = 0;
    if (st.idle === 'breathe') scaleY = 1 + Math.sin(t * 2.6) * 0.012;
    if (st.idle === 'groom') rotate = Math.sin(t * 9) * 2.2;
    if (st.idle === 'wag') rotate = Math.sin(t * 11) * 1.2;

    // the lanes sit between the far, mid and near grass (SunlitScene FAR_TO_MID, MID_TO_NEAR)
    const lane = d < 0.36 ? 0 : d < 0.8 ? 1 : 2;
    if (airborne || st.idle || st.sink0 !== undefined || !st.gait) toLane(a, lane);
    else if (a.lane < 0) toLane(a, lane);

    const sx = (mirror ? 1 - x : x) * sc.w;
    const face = (mirror ? -st.face : st.face) as number;
    const ground = ridgeAt(Math.min(sc.w, Math.max(0, sx)), sc.w, sc.h);
    const feet = ground + 4 + d * (sc.h - ground + 30);
    a.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${(feet - lift).toFixed(1)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${(S * face).toFixed(4)}, ${(S * scaleY).toFixed(4)})`;
    a.el.style.opacity = sink > 0 ? (1 - sink * sink).toFixed(3) : '';
    const soft = Math.pow(Math.min(1, Math.max(0, (d - 0.82) / 0.3)), 1.1);
    a.el.style.filter = soft > 0.02 ? `blur(${(soft * Math.min(14, 3 + span(sc, d) * a.size * 0.03)).toFixed(1)}px)` : 'none';
    a.el.style.visibility = 'visible';
    return true;
  };

  return {
    /** Advance to `now`; call every frame while the hero is on screen. */
    step(now: number, sc: Screen) {
      if (!tracks && now >= next) begin(now, sc);
      if (!tracks) return;
      const t = (now - start) / 1000;
      let live = false;
      for (const tr of tracks) {
        const a = actors[tr.who];
        const st = tr.steps.find((s) => t >= s.t0 && t < s.t1);
        if (!st || !show(a, st, t, sc)) { a.el.style.visibility = 'hidden'; if (t < tr.end) live = true; continue; }
        live = true;
      }
      if (!live) { tracks = null; hide(); next = now + rnd(2500, 6000); }
    },
    /** Drop the scene in progress (the hero left the screen). */
    stop(now: number) {
      if (tracks) { tracks = null; next = now + 2500; }
      hide();
    },
    destroy() { all.forEach((a) => a.el.remove()); },
    /** Development only: play a named scene next, straight away. */
    queue(name: string, flip = false) {
      if (!(name in SCENES)) return Object.keys(SCENES);
      forced = { name, mirror: flip };
      tracks = null;
      hide();
      next = 0;
      return name;
    },
  };
}
