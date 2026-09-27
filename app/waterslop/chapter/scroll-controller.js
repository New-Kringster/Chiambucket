import { stops, clamp, mix } from "./timeline.js";

export const autoplaySections = [
  { id: "layers", start: 0.105, end: 0.35, backward: 0.067, duration: 6400 },
  { id: "assembly", start: 0.77, end: 0.987, backward: 0.734, duration: 4600 },
];
const restingStates = stops
  .filter((s) => !["layers", "assembly"].includes(s.id))
  .map((s) => s.p);
const epsilon = 0.00015;

// Spring rates in radians per second. Higher follows the input more tightly.
const follow = { scrolling: 13, snapping: 7, navigating: 18, autoplay: 9 };

// Where to rest after input stops. Moving a third of the way towards the next
// frame is enough to reach it, so short deliberate scrolls advance instead of
// springing back. Leaving the chapter past its first or last frame is allowed.
export function snapTarget(p, direction = 0) {
  if (p < 0 || p > 1) return null;
  let behind = null,
    ahead = null;
  for (const s of restingStates) {
    if (s <= p + epsilon) behind = s;
    else if (ahead === null) ahead = s;
  }
  if (behind !== null && p - behind <= epsilon) return behind;
  if (behind === null) return direction < 0 ? null : ahead;
  if (ahead === null) return direction > 0 ? null : behind;
  const travelled = (p - behind) / (ahead - behind);
  const threshold = direction > 0 ? 0.3 : direction < 0 ? 0.7 : 0.5;
  return travelled >= threshold ? ahead : behind;
}

export function nextStop(p) {
  return stops.find((s) => s.p > p + 0.008) ?? null;
}

// Quintic easing gives Next a gentle start and an unhurried landing.
const quintic = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// Every programmatic movement is a critically damped spring chasing a goal.
// Wheel input moves the goal, snapping sets it, and Next and autoplay sweep
// it along a timed path. Because the spring keeps its velocity when the goal
// changes, handing over between these never jolts the page.
export function createScrollController({
  read,
  write,
  reduced,
  bounds = () => [-Infinity, Infinity],
  tolerance = () => 0.0005,
  wheelDelta = () => null,
  onChange = () => {},
  idleDelay = 160,
  // Tests pass a virtual clock; the browser uses its own.
  clock = {
    now: () => performance.now(),
    setTimeout: (cb, ms) => setTimeout(cb, ms),
    clearTimeout: (id) => clearTimeout(id),
  },
}) {
  let motion = null,
    position = read(),
    velocity = 0,
    lastTick = 0,
    idle = 0,
    previous = read(),
    direction = 1,
    pointer = false;

  function stop() {
    clock.clearTimeout(idle);
    motion = null;
    velocity = 0;
    onChange("manual");
  }
  // Positions this controller wrote recently. iOS Safari can apply a
  // programmatic scroll a frame or more late, so its scroll event reports an
  // older write rather than the latest one.
  const recent = [];
  function remember(p) {
    recent.push({ p, at: clock.now() });
    while (recent.length > 16 || clock.now() - recent[0].at > 400)
      recent.shift();
  }
  const ours = (p) => recent.some((w) => Math.abs(p - w.p) <= tolerance());
  function begin(next) {
    // A running spring keeps its position, velocity and frame clock, so the
    // handover lands between frames without a stall.
    if (!motion) {
      position = read();
      velocity = 0;
      lastTick = clock.now();
    }
    motion = { at: clock.now(), ...next };
    onChange(next.kind);
  }
  function schedule() {
    clock.clearTimeout(idle);
    idle = clock.setTimeout(settle, idleDelay);
  }
  function settle() {
    if (pointer || reduced() || (motion && motion.kind !== "scrolling")) return;
    // Decide from where the wheel is heading, not from the lagging spring.
    const p = motion?.to ?? read();
    const section = autoplaySections.find(
      (s) => p >= s.start && p < s.end - epsilon,
    );
    if (section) {
      const to = direction > 0 ? section.end : section.backward;
      const from = motion ? position : read();
      begin({
        kind: "autoplay",
        from,
        to,
        duration: Math.max(
          380,
          (section.duration * Math.abs(to - from)) /
            (section.end - section.backward),
        ),
        ease: (t) => t,
      });
      return;
    }
    const to = snapTarget(p, direction);
    if (to !== null && Math.abs(to - p) > epsilon)
      begin({ kind: "snapping", to });
  }
  function input(e) {
    if (
      e.type === "keydown" &&
      ![
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ].includes(e.key)
    )
      return;
    stop();
    schedule();
  }
  function wheel(e) {
    const delta = wheelDelta(e);
    if (reduced() || e.ctrlKey || delta === null) {
      input(e);
      return;
    }
    e.preventDefault();
    if (!delta) return;
    direction = delta > 0 ? 1 : -1;
    const [lo, hi] = bounds();
    const from =
      motion?.kind === "scrolling" ? motion.to : motion ? position : read();
    begin({ kind: "scrolling", to: clamp(from + delta, lo, hi) });
    schedule();
  }
  function scroll() {
    const p = read();
    // Our own writes echo back as scroll events, sometimes late. Anything
    // else is the reader taking over, e.g. the scrollbar or find in page.
    if (ours(p)) return;
    if (motion) stop();
    if (Math.abs(p - previous) > epsilon) direction = p > previous ? 1 : -1;
    previous = p;
    schedule();
  }
  const release = () => {
    pointer = false;
    schedule();
  };
  const press = () => {
    pointer = true;
    input({ type: "pointerdown" });
  };
  const listeners = [
    ["wheel", wheel, { passive: false }],
    ["touchstart", input, { passive: true }],
    ["keydown", input],
    ["pointerdown", press, { passive: true }],
    ["pointerup", release, { passive: true }],
    ["pointercancel", release, { passive: true }],
    ["blur", release],
    ["scroll", scroll, { passive: true }],
  ];
  let listening = false;

  return {
    // Input is only taken over once the host is ticking the controller;
    // before that a captured wheel event would never be applied.
    start() {
      if (!listening)
        for (const [type, cb, options] of listeners)
          window.addEventListener(type, cb, options);
      listening = true;
      previous = read();
      direction = 1;
      schedule();
    },
    goTo(to, { immediate = false } = {}) {
      stop();
      // An explicit chapter choice plays that chapter forward, even when linked from below.
      direction = 1;
      if (immediate || reduced()) {
        write(to);
        remember(to);
        previous = to;
        schedule();
      } else
        begin({
          kind: "navigating",
          from: read(),
          to,
          duration: 1100,
          ease: quintic,
        });
    },
    cancel: stop,
    tick(time) {
      if (!motion || document.hidden) {
        lastTick = time;
        return;
      }
      if (reduced()) {
        stop();
        return;
      }
      const m = motion;
      // Long frames slow the motion down rather than skipping ahead.
      const dt = clamp((time - lastTick) / 1000, 0, 0.05);
      lastTick = time;
      const timed = m.duration !== undefined;
      const t = timed ? clamp((time - m.at) / m.duration) : 1;
      const goal = timed ? mix(m.from, m.to, m.ease(t)) : m.to;
      // Exact critically damped step, so 60 Hz and 120 Hz screens match.
      const w = follow[m.kind],
        offset = position - goal,
        decay = Math.exp(-w * dt),
        k = (velocity + w * offset) * dt;
      position = goal + (offset + k) * decay;
      velocity = (velocity - w * k) * decay;
      const done =
        t === 1 &&
        Math.abs(position - m.to) < 0.00003 &&
        Math.abs(velocity) < 0.0006;
      if (done) position = m.to;
      const [lo, hi] = bounds();
      position = clamp(position, lo, hi);
      write(position);
      remember(position);
      previous = position;
      if (done) {
        stop();
        if (m.kind !== "autoplay") schedule();
      }
    },
    get active() {
      return Boolean(motion);
    },
    destroy() {
      stop();
      if (listening)
        for (const [type, cb, options] of listeners)
          window.removeEventListener(type, cb, options);
      listening = false;
    },
  };
}
