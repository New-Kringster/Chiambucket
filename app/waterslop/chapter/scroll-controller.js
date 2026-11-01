import { stops, clamp, mix, CAPTURE_AT, SHUTTER_AT } from "./timeline.js";

// Chiambucket: the exported positions, scaled into the part of the story before the
// capture, then the shutter: once past the viewfinder it plays on into the film.
export const autoplaySections = [
  ...[
    { id: "layers", start: 0.105, end: 0.35, backward: 0.067, duration: 6400 },
    { id: "assembly", start: 0.77, end: 0.987, backward: 0.734, duration: 4600 },
  ].map((s) => ({ ...s, start: s.start * CAPTURE_AT, end: s.end * CAPTURE_AT, backward: s.backward * CAPTURE_AT })),
  { id: "shutter", start: SHUTTER_AT, end: 1, backward: stops.at(-1).p, duration: 1300 },
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

// Chiambucket: one gesture, one step, from the title card (0) through every stop
// to the DrumNet film's top (1). Going back into an autoplay section lands where
// that section starts. Outside the chapter (and past the film) it is null, so
// the page scrolls as usual there.
export function chapterStep(p, dir) {
  const eps = 0.004,
    points = [0, ...stops.map((s) => s.p), 1];
  if (dir > 0) {
    if (p < -0.0005 || p >= 1 - 0.0005) return null;
    return points.find((x) => x > p + eps) ?? null;
  }
  if (p <= 0.0005 || p > 1 + 0.0005) return null;
  let to = [...points].reverse().find((x) => x < p - eps) ?? 0;
  const section = autoplaySections.find((a) => to > a.start && to < a.end);
  if (section) to = section.backward;
  return to;
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
  // Chiambucket: step mode. `step(p, direction)` returns the position one step
  // on from p, or null where scrolling stays continuous (outside the chapter).
  // One wheel gesture, one touch swipe or one arrow key moves one step.
  step = null,
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
    pointer = false,
    lastWheelAt = -1e9,
    stepped = false,
    touch = null;

  function stop() {
    clock.clearTimeout(idle);
    motion = null;
    velocity = 0;
    onChange("manual");
  }
  // Chiambucket: where a step is measured from. A navigation in flight counts as
  // arrived, so a quick second swipe goes on to the stop after it.
  const here = () => (motion?.kind === "navigating" ? motion.to : read());
  function stepTo(to, dir) {
    direction = dir;
    begin({
      kind: "navigating",
      from: motion ? position : read(),
      to,
      duration: 900,
      ease: quintic,
    });
  }
  // Drags on the chapter's own draggable controls (the enclosure, the comparison
  // graph) and keys in form fields are theirs, not steps. A swipe that starts on
  // a link or a button still steps; a tap on one still clicks it.
  const own = (t) =>
    t instanceof Element &&
    Boolean(t.closest("input, textarea, select, [contenteditable], #model-interaction, #comparison, [data-no-step]"));
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
      step &&
      e.type === "keydown" &&
      ["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(e.key) &&
      !e.altKey && !e.ctrlKey && !e.metaKey &&
      !own(e.target) &&
      !reduced()
    ) {
      const dir = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1;
      const to = step(here(), dir);
      if (to !== null) {
        e.preventDefault();
        stepTo(to, dir);
        return;
      }
    }
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
    if (step) {
      // A gesture is a run of wheel events less than 220 ms apart: the first
      // one steps, the rest (a trackpad's momentum) are swallowed.
      const now = clock.now(),
        fresh = now - lastWheelAt > 220;
      lastWheelAt = now;
      if (!fresh && stepped) return;
      const dir = delta > 0 ? 1 : -1,
        to = step(here(), dir);
      if (to !== null) {
        stepped = true;
        stepTo(to, dir);
        return;
      }
      stepped = false;
    }
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
  // Chiambucket: a swipe steps once it has moved 8 px; the page does not scroll
  // under it. Where `step` returns null the touch scrolls natively as before.
  function touchStart(e) {
    input(e);
    touch =
      step && e.touches.length === 1 && !own(e.target) && !reduced()
        ? { y: e.touches[0].clientY, p: here(), dir: 0, to: null }
        : null;
  }
  function touchMove(e) {
    if (!touch) return;
    const dy = touch.y - e.touches[0].clientY;
    if (!touch.dir && Math.abs(dy) > 8) {
      touch.dir = dy > 0 ? 1 : -1;
      touch.to = step(touch.p, touch.dir);
    }
    if (touch.to !== null && touch.dir && e.cancelable) e.preventDefault();
  }
  function touchEnd() {
    if (touch?.dir && touch.to !== null) stepTo(touch.to, touch.dir);
    touch = null;
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
    ["touchstart", touchStart, { passive: true }],
    ["touchmove", touchMove, { passive: false }],
    ["touchend", touchEnd, { passive: true }],
    ["touchcancel", () => (touch = null), { passive: true }],
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
