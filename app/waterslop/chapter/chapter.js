import { sampleTimeline, stops, clamp, range, ledPulse } from "./timeline.js";
import { createGraph } from "./graph.js";
import { createScrollController, nextStop } from "./scroll-controller.js";
import { rotationInput } from "./interaction.js";
import { powerChips } from "./power-data.js";

// Wheel input over something that scrolls on its own, over an open dialog, or
// while the host page has locked scrolling stays native.
function nativeWheel(event) {
  const locked = (el) => getComputedStyle(el).overflowY === "hidden";
  if (locked(document.documentElement) || locked(document.body)) return true;
  for (let el = event.target; el instanceof Element; el = el.parentElement) {
    if (el === document.body || el === document.documentElement) break;
    if (el.matches("dialog[open], [aria-modal='true'], [data-native-scroll]"))
      return true;
    const { overflowY } = getComputedStyle(el);
    if (
      /auto|scroll|overlay/.test(overflowY) &&
      el.scrollHeight > el.clientHeight + 1 &&
      (event.deltaY < 0
        ? el.scrollTop > 0
        : el.scrollTop + el.clientHeight < el.scrollHeight - 1)
    )
      return true;
  }
  return false;
}

// Mounts the chapter into `root`, which must contain chapterMarkup().
// `assetBase` is the URL prefix for models and textures, ending in "/".
// `onCover(covered)` reports when the pinned stage fills the viewport, so a
// host can pause its own background rendering behind it.
// Returns a function that removes every listener and releases the GPU.
/**
 * @param {HTMLElement} root
 * @param {{ assetBase: string, onCover?: (covered: boolean) => void }} options
 * @returns {() => void}
 */
export function mountChapter(root, { assetBase, onCover = () => {} }) {
  const listening = new AbortController(),
    signal = listening.signal;
  const $ = (s) => root.querySelector(s),
    story = $("#story"),
    stage = $(".stage");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let scene,
    disposed = false,
    frame = 0,
    dirty = true,
    last = -1,
    active = -1,
    selectedRef = null,
    pinnedRef = null,
    graphRotation = { yaw: 0, pitch: 0, touched: false },
    modelRotation = { yaw: 0, pitch: 0 },
    lastTime = 0,
    autoTurn = 0,
    storyTop = 0,
    storyLength = 1,
    lastBlueprint = -1;

  // Cache the chapter's position; reading layout every frame would force reflow.
  function measure() {
    storyTop = story.getBoundingClientRect().top + scrollY;
    storyLength = Math.max(1, story.offsetHeight - innerHeight);
    dirty = true;
  }
  measure();
  const measurer = new ResizeObserver(measure);
  measurer.observe(document.body);
  measurer.observe(story);

  const graph = createGraph($("#comparison canvas"));
  rotationInput(
    $("#comparison canvas"),
    (value) => {
      graphRotation = value;
      dirty = true;
    },
    { yawDirection: -1, signal },
  );
  rotationInput(
    $("#model-interaction"),
    (value) => {
      modelRotation = value;
      dirty = true;
    },
    { signal },
  );
  const rawProgress = () => (scrollY - storyTop) / storyLength;
  const progress = () => clamp(rawProgress());
  const target = (p) => storyTop + p * storyLength;
  const controller = createScrollController({
    read: rawProgress,
    write: (p) => window.scrollTo({ top: target(p), behavior: "instant" }),
    reduced: () => motion.matches,
    // The whole page scrolls smoothly, not only the chapter.
    bounds: () => [
      -storyTop / storyLength,
      (document.documentElement.scrollHeight - innerHeight - storyTop) /
        storyLength,
    ],
    tolerance: () => 1.5 / storyLength,
    wheelDelta: (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return null;
      if (nativeWheel(event)) return null;
      const pixels =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      return pixels / storyLength;
    },
    onChange: (mode) => (stage.dataset.motion = mode),
  });
  function navigate(id, immediate = false) {
    const s = stops.find((s) => s.id === id);
    if (!s) return;
    controller.goTo(s.p, { immediate });
    dirty = true;
  }
  $("#next-frame").addEventListener(
    "click",
    () => {
      const next = nextStop(progress());
      if (next) {
        history.pushState(null, "", "#" + next.id);
        navigate(next.id);
      } else {
        controller.cancel();
        $("#reading").open = true;
        $("#reading").scrollIntoView({
          behavior: motion.matches ? "instant" : "smooth",
        });
      }
    },
    { signal },
  );
  function opacity(el, v) {
    el.style.opacity = v;
    el.style.visibility = v < 0.002 ? "hidden" : "visible";
    el.inert = v < 0.1;
  }
  const schematicUrl = (chip) =>
    new URL(assetBase + chip.schematic, document.baseURI).href;
  function selectChip(ref) {
    selectedRef = ref;
    dirty = true;
    stage.dataset.selectedChip = ref || "all";
    const chip = powerChips.find((c) => c.id === ref);
    $(".chip-detail").hidden = !chip;
    for (const b of root.querySelectorAll(".power-grid button"))
      b.setAttribute("aria-pressed", String(b.dataset.ref === ref));
    if (chip) {
      $("#chip-description").textContent = chip.description;
      $("#chip-schematic").src = schematicUrl(chip);
      $("#chip-schematic").alt = `KiCad schematic for ${chip.id}, ${chip.name}`;
      $("#schematic-link").href = schematicUrl(chip);
      $("#schematic-link").setAttribute(
        "aria-label",
        `Open ${chip.name} schematic at full size`,
      );
    }
  }
  for (const b of root.querySelectorAll(".power-grid button")) {
    b.addEventListener("pointerenter", () => selectChip(b.dataset.ref), {
      signal,
    });
    b.addEventListener("focus", () => selectChip(b.dataset.ref), { signal });
    b.addEventListener(
      "click",
      () => {
        pinnedRef = pinnedRef === b.dataset.ref ? null : b.dataset.ref;
        selectChip(pinnedRef);
      },
      { signal },
    );
  }
  $(".power-grid").addEventListener(
    "pointerleave",
    () => selectChip(pinnedRef),
    { signal },
  );
  $(".power-grid").addEventListener(
    "focusout",
    (e) => {
      if (!$(".power-grid").contains(e.relatedTarget)) selectChip(pinnedRef);
    },
    { signal },
  );
  for (const a of root.querySelectorAll('a[href^="#"]'))
    a.addEventListener(
      "click",
      (e) => {
        const id = a.hash.slice(1);
        if (stops.some((s) => s.id === id)) {
          e.preventDefault();
          history.pushState(null, "", "#" + id);
          navigate(id);
        } else if (id === "reading") $("#reading").open = true;
      },
      { signal },
    );

  const onHash = () => navigate(location.hash.slice(1));
  let covered = false;
  const onScroll = () => {
    dirty = true;
    const p = rawProgress();
    if (covered !== (p >= 0 && p <= 1)) onCover((covered = !covered));
  };
  window.addEventListener("popstate", onHash, { signal });
  window.addEventListener("hashchange", onHash, { signal });
  window.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  motion.addEventListener("change", () => (dirty = true), { signal });

  function update(time) {
    frame = requestAnimationFrame(update);
    if (document.hidden) {
      lastTime = time;
      return;
    }
    controller.tick(time);
    const p = progress(),
      s = sampleTimeline(p),
      showGraph = s.focus > 0.1 && s.componentIndex === 0,
      showLights = s.focus > 0.1 && s.component.id === "leds";
    if (
      !dirty &&
      Math.abs(p - last) < 0.000001 &&
      !showGraph &&
      !(showLights && !motion.matches) &&
      !controller.active
    ) {
      lastTime = time;
      return;
    }
    dirty = false;
    last = p;
    if (active !== s.componentIndex) {
      active = s.componentIndex;
      pinnedRef = null;
      selectChip(null);
      const c = s.component;
      $("#component-eyebrow").textContent = c.eyebrow;
      $("#component-title").textContent = c.title;
      $("#component-body").textContent = c.body;
      $(".component-copy").dataset.part = c.id;
      $("#comparison").hidden = active !== 0;
      $("#power-inspector").hidden = c.id !== "power";
    }
    opacity($(".hero-copy"), s.hero);
    $(".hero-copy").style.transform =
      `translateX(${motion.matches ? 0 : (1 - range(p, 0, 0.048)) * -180 - range(p, 0.105, 0.14) * 80}px)`;
    opacity($(".chapter"), s.chapter);
    $(".chapter").style.transform =
      `translateY(${motion.matches ? 0 : (1 - range(p, 0, 0.045)) * -75}px)`;
    opacity($(".halo"), Math.max(s.hero, s.finish) * 0.7);
    opacity($(".blueprint"), s.blueprint);
    // Behind iOS Safari's floating toolbar the page shows the story's own
    // background, so it follows the blueprint colour too.
    if (s.blueprint !== lastBlueprint)
      story.style.setProperty(
        "--ws-blueprint",
        (lastBlueprint = s.blueprint).toFixed(3),
      );
    opacity($(".component-copy"), s.copy * s.focus);
    opacity($(".final-copy"), s.finish);
    const next = nextStop(p);
    $("#next-frame").setAttribute(
      "aria-label",
      next ? `Next: ${next.label}` : "Next: component notes",
    );
    $("#model-interaction").hidden = s.finish < 0.999;
    if (showGraph) {
      if (!motion.matches && !graphRotation.touched)
        autoTurn += Math.min((time - lastTime) / 1000, 0.04) * 0.055;
      graph(autoTurn + graphRotation.yaw, graphRotation.pitch);
    }
    lastTime = time;
    const info = scene?.render(s, motion.matches, {
      selectedRef,
      rotation: modelRotation,
      ledIntensity: showLights
        ? ledPulse(time / 1000, motion.matches) * s.copy
        : 0,
    });
    stage.dataset.tour = String(s.focus > 0.1);
    stage.dataset.progress = p.toFixed(5);
    stage.dataset.component = s.component.id;
    stage.dataset.ready = String(Boolean(scene));
    stage.dataset.highlighted = info?.highlighted?.join(",") || "";
    stage.dataset.ledIntensity = (info?.ledIntensity || 0).toFixed(3);
  }

  // The controller does its own smoothing. A host's `scroll-behavior: smooth`
  // would turn each per-frame scroll into a native animation on engines that
  // ignore `behavior: "instant"`.
  const html = document.documentElement,
    hostScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  // Text, navigation and scrolling run while the 3D scene loads.
  navigate(location.hash.slice(1), true);
  onScroll();
  controller.start();
  frame = requestAnimationFrame(update);

  (async () => {
    try {
      const { createScene } = await import("./scene.js");
      const created = await createScene(
        $("#scene"),
        (text) => ($(".load-status").textContent = text),
        { assetBase },
      );
      if (disposed) {
        created.dispose();
        return;
      }
      scene = created;
      $(".load-status").hidden = true;
      measure();
    } catch (e) {
      if (disposed) return;
      console.error(e);
      // Without the scene the page scrolls natively and shows the notes.
      cancelAnimationFrame(frame);
      controller.destroy();
      root.classList.add("no-webgl");
      measure();
      $(".load-status").textContent =
        "3D could not load. Component notes are available below.";
      $("#reading").open = true;
      opacity($(".hero-copy"), 1);
    }
  })();
  document.fonts?.ready.then(() => (dirty = true));

  return function destroy() {
    disposed = true;
    cancelAnimationFrame(frame);
    controller.destroy();
    measurer.disconnect();
    listening.abort();
    html.style.scrollBehavior = hostScrollBehavior;
    if (covered) onCover(false);
    scene?.dispose();
    scene = null;
  };
}
