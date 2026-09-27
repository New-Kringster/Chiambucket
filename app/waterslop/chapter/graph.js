// The points are editorial positions, not benchmark measurements. Keep that label visible.
const points = [
  { label: "ESP32-S3", v: [0.63, 0.39, 0.63], gold: true },
  { label: "RP2040", v: [0.27, 0.18, 0.37] },
  { label: "STM32H7", v: [0.89, 0.84, 0.43] },
  { label: "nRF52840", v: [0.35, 0.57, 0.89] },
];
export function createGraph(canvas) {
  const ctx = canvas.getContext("2d");
  return function draw(turn = 0, tilt = 0) {
    const { width: w, height: h } = canvas.getBoundingClientRect();
    if (!w || !h) return;
    const d = Math.min(devicePixelRatio, 2);
    if (
      canvas.width !== Math.round(w * d) ||
      canvas.height !== Math.round(h * d)
    ) {
      canvas.width = Math.round(w * d);
      canvas.height = Math.round(h * d);
    }
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const a = -0.65 + turn,
      scale = Math.min(w * 0.42, h * 0.55);
    const project = ([x, y, z]) => {
      x -= 0.45;
      z -= 0.45;
      let X = x * Math.cos(a) - z * Math.sin(a),
        Z = x * Math.sin(a) + z * Math.cos(a);
      return [
        w * 0.47 + X * scale * 1.45,
        h * 0.67 -
          y * scale * Math.cos(tilt + 0.25) * 0.8 +
          Z * scale * Math.sin(tilt + 0.25),
      ];
    };
    function line(a, b, color, width = 0.7) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(...project(a));
      ctx.lineTo(...project(b));
      ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      let t = i / 4;
      line([t, 0, 0], [t, 0, 1], "#c4bfaa20");
      line([0, 0, t], [1, 0, t], "#c4bfaa20");
    }
    for (const end of [
      [1.1, 0, 0],
      [0, 1.1, 0],
      [0, 0, 1.1],
    ])
      line([0, 0, 0], end, "#c4bfaa88");
    ctx.font = "11px Baskerville, sans-serif";
    ctx.fillStyle = "#b9b7a8";
    for (const [text, p, dx, dy] of [
      ["Performance", [1.1, 0, 0], -8, 14],
      ["Cost", [0, 1.1, 0], -5, -7],
      ["Efficiency", [0, 0, 1.1], -12, 15],
    ]) {
      let q = project(p);
      ctx.fillText(text, q[0] + dx, Math.max(11, Math.min(h - 6, q[1] + dy)));
    }
    for (const point of points) {
      const q = project(point.v);
      line(
        point.v,
        [point.v[0], 0, point.v[2]],
        point.gold ? "#cfb47755" : "#c4bfaa30",
      );
      ctx.fillStyle = point.gold ? "#e5c885" : "#b9b7a8";
      ctx.shadowColor = point.gold ? "#e5c885" : "transparent";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(...q, point.gold ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = point.gold
        ? "600 12px Baskerville, sans-serif"
        : "11px Baskerville, sans-serif";
      ctx.fillText(
        point.label,
        q[0] + (point.label === "RP2040" ? -45 : 8),
        q[1] + (point.gold ? 4 : point.label === "nRF52840" ? -12 : -6),
      );
    }
  };
}
