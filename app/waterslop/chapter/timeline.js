export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a, b, t) => a + (b - a) * t;
export const ease = (t) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
export const range = (p, a, b) => ease((p - a) / (b - a));
export const windowOpacity = (p, a, b, r = 0.014) =>
  range(p, a, a + r) * (1 - range(p, b - r, b));
// A short exposure pulse every 2.4 seconds; reduced motion keeps a steady low glow.
export function ledPulse(seconds, reduced = false) {
  if (reduced) return 0.28;
  const phase = ((seconds % 2.4) + 2.4) % 2.4;
  return range(phase, 0, 0.06) * (1 - range(phase, 0.16, 0.42));
}
export const components = [
  {
    id: "esp32",
    title: "ESP32-S3",
    eyebrow: "MICROPROCESSOR",
    body: "I chose the ESP32-S3 N16R8 for its balance of price, performance and power use. Its 128-bit SIMD vector instructions accelerate the INT8 operations used by the OCR model.",
    ref: "U1",
    focus: [-2, 20, 0],
    rotation: [-0.15, 0.18, -0.17],
    scale: 2.3,
  },
  {
    id: "power",
    title: "Power and BMS",
    eyebrow: "POWER",
    body: "Voltage regulation, battery management and protection are built into the board. Hover or select a chip below to see what it does.",
    ref: "U2 · U4 · U5 · U7 · U8 · U10 · U11",
    focus: [1, -14, -1],
    rotation: [0.03, -0.06, 0.03],
    scale: 2.65,
  },
  {
    id: "usb",
    title: "ESD-protected USB-C port",
    eyebrow: "USB",
    body: "The USB data lines connect directly to the ESP32-S3's built-in USB-OTG peripheral. This removes the need for a UART converter and saves board space.",
    ref: "U3 · J1",
    focus: [-6.8, -19, -0.5],
    rotation: [0.02, -0.08, 0.05],
    scale: 3.9,
  },
  {
    id: "humidity",
    title: "Humidity and temperature detection",
    eyebrow: "HUMIDITY",
    body: "The SHT40 measures humidity and temperature. These readings help the firmware identify conditions where the meter may fog up, so it can skip an image capture and save battery power.",
    ref: "U9",
    focus: [4.76, -24.93, -1],
    rotation: [0, 0, 0],
    scale: 5.2,
  },
  {
    id: "leds",
    title: "Light pulses",
    eyebrow: "LEDs",
    body: "The LEDs turn on briefly while the camera captures the meter. Short light pulses keep power use low.",
    ref: "D1 · D2",
    focus: [-1, 2, -9],
    rotation: [0.05, Math.PI + 0.08, 0.03],
    scale: 3.05,
  },
  {
    id: "camera",
    title: "OV2640 at 120° FOV",
    eyebrow: "CAMERA",
    body: "I chose the OV2640 with a 120° field-of-view lens for close-up imaging. The wide lens lets the camera sit close to the meter while keeping the whole dial in focus and in frame.",
    ref: "J2",
    focus: [-1.48, 3.12, -9.3],
    rotation: [0.08, Math.PI + 0.16, -0.04],
    scale: 3.55,
  },
  {
    id: "lora",
    title: "LoRaWAN connectivity",
    eyebrow: "LORA",
    body: "LoRaWAN provides long-range communication with low power use. Each reader sends its readings to a gateway, which relays them over the internet to the database. More gateways can extend the network as the number of readers grows.",
    ref: "U6",
    focus: [-2.1, 18.7, -4],
    rotation: [0.08, Math.PI + 0.16, -0.12],
    scale: 3.5,
  },
];
export const stops = [
  { id: "pcb", label: "PCB & Enclosure", p: 0.067 },
  { id: "layers", label: "Placement", p: 0.151 },
  ...components.map((c, i) => ({
    id: c.id,
    label: c.title,
    p: 0.35 + i * 0.064,
  })),
  { id: "assembly", label: "Assembly", p: 0.836 },
  { id: "enclosure", label: "Enclosure", p: 0.987 },
];
const poses = [
  [0, 76, -85, -0.7, 0.65, -0.5, 1.35],
  [0.048, 24, -29, -0.3, 0.24, -0.24, 1.85],
  [0.105, 24, -29, -0.3, 0.24, -0.24, 1.85],
  [0.151, 0, 0, 0, 0, 0, 1.4],
  [0.275, 0, 0, 0, 0, 0, 1.56],
  [0.312, 0, 0, 0, 0, 0, 1.6],
  ...components.flatMap((c, i) => [
    [0.342 + i * 0.064, -25, 0, ...c.rotation, c.scale],
    [0.377 + i * 0.064, -25, 0, ...c.rotation, c.scale],
  ]),
  [0.832, 0, 0, -1, 3.5, 1.05, 0.95],
  [0.925, 0, 0, -1, 3.5, 1.05, 0.95],
  [0.984, 8, -9, -1, 3.5, 1.05, 1.2],
];
export function samplePose(p) {
  const hi = poses.findIndex((x) => x[0] > p);
  if (hi === 0) return poses[0].slice(1);
  if (hi < 0) return poses.at(-1).slice(1);
  const a = poses[hi - 1],
    b = poses[hi],
    t = range(p, a[0], b[0]);
  return a.slice(1).map((v, i) => mix(v, b[i + 1], t));
}
export const layerSteps = [
  { id: "B_Cu-traces", start: 0.151 },
  { id: "In2_Cu-traces", start: 0.171 },
  { id: "In1_Cu-traces", start: 0.191 },
  { id: "F_Cu-traces", start: 0.211 },
  { id: "B_Cu-pour", start: 0.231 },
  { id: "In2_Cu-pour", start: 0.237 },
  { id: "In1_Cu-pour", start: 0.243 },
  { id: "F_Cu-pour", start: 0.249 },
  { id: "F_Silkscreen", start: 0.266 },
];
export function sampleTimeline(p) {
  p = clamp(p);
  const idx = clamp(Math.floor((p - 0.325) / 0.064), 0, 6);
  return {
    p,
    pose: samplePose(p),
    hero: windowOpacity(p, 0, 0.14, 0.035),
    blueprint: windowOpacity(p, 0.133, 0.31, 0.017),
    layerReveal: range(p, 0.151, 0.28),
    layers: layerSteps.map((l) => range(p, l.start, l.start + 0.012)),
    render: 1 - windowOpacity(p, 0.133, 0.312, 0.015),
    componentIndex: idx,
    component: components[idx],
    focus: windowOpacity(p, 0.318, 0.812, 0.024),
    copy: windowOpacity(
      p,
      0.325 + idx * 0.064,
      0.325 + (idx + 1) * 0.064,
      0.006,
    ),
    assembly: range(p, 0.815, 0.86),
    closure: range(p, 0.893, 0.972),
    finish: range(p, 0.972, 0.984),
    chapter: windowOpacity(p, 0, 0.137, 0.035),
  };
}
