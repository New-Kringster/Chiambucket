export function enclosureRotation(
  [rx, ry, rz],
  finish,
  { pitch = 0, yaw = 0 } = {},
) {
  const weight = finish;
  return [rx + pitch * weight, ry + yaw * weight, rz];
}

// Pointer capture keeps drags working outside the canvas. Arrow keys offer the same rotation.
export function rotationInput(
  element,
  onChange,
  { limitPitch = 1.2, yawDirection = 1, signal } = {},
) {
  let yaw = 0,
    pitch = 0,
    drag = null,
    touched = false;
  const update = () => {
    element.dataset.rotation = `${yaw.toFixed(3)},${pitch.toFixed(3)}`;
    onChange({ yaw, pitch, touched });
  };
  element.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return;
      drag = [e.clientX, e.clientY];
      touched = true;
      element.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    { signal },
  );
  element.addEventListener(
    "pointermove",
    (e) => {
      if (!drag) return;
      yaw += (e.clientX - drag[0]) * 0.008 * yawDirection;
      pitch = Math.max(
        -limitPitch,
        Math.min(limitPitch, pitch + (e.clientY - drag[1]) * 0.006),
      );
      drag = [e.clientX, e.clientY];
      update();
    },
    { signal },
  );
  const end = () => {
    drag = null;
  };
  element.addEventListener("pointerup", end, { signal });
  element.addEventListener("pointercancel", end, { signal });
  element.addEventListener("lostpointercapture", end, { signal });
  element.addEventListener(
    "keydown",
    (e) => {
      const d = {
        ArrowLeft: [-0.12, 0],
        ArrowRight: [0.12, 0],
        ArrowUp: [0, -0.12],
        ArrowDown: [0, 0.12],
      }[e.key];
      if (!d) return;
      e.preventDefault();
      e.stopPropagation();
      touched = true;
      yaw += d[0] * yawDirection;
      pitch = Math.max(-limitPitch, Math.min(limitPitch, pitch + d[1]));
      update();
    },
    { signal },
  );
  return {
    reset() {
      yaw = 0;
      pitch = 0;
      touched = false;
      update();
    },
  };
}
