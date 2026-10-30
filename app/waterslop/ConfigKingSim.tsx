'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame } from './Story';

/* ConfigKingSim: the Cardputer's 240 x 135 screen, drawn the way the firmware
   draws it. The drawing primitives are ported from cardputer-setup/src/ui.cpp
   (pills, boxed fields, menu rows, popups, battery and signal glyphs, the shared
   viewport transform) and the screens from app.cpp (home, find, the seven wizard
   steps, Read, Configure, More, About). The reader on the other end of the BLE
   link is simulated: a blank reader the first time, a configured one after Finish.
   Values are the ones in the report's screenshots and the DrumNet run. */

const W = 240, H = 135, BAR_H = 13, FOOT_H = 13;
const C = { BG: '#000000', FG: '#ffffff', DIM: '#9ca29c', MUTE: '#4a4d4a', LINE: '#292c29', ACC: '#ffa600', OK: '#29ff21', BAD: '#ff5152', WARN: '#ffd700', SEL: '#182439', BAR: '#101821', RED_TINT: '#630000', PILL: '#393c39', FRAME: '#6b6d6b', POP: '#080808', CELL: '#181c18' };
const ICONS: Record<string, number[]> = {
  find: [240, 264, 516, 516, 516, 264, 244, 14, 7, 3, 0], info: [248, 260, 546, 514, 610, 546, 546, 626, 260, 248, 0], read: [0, 248, 260, 626, 1273, 1273, 626, 260, 248, 0, 0],
  configure: [0, 896, 1118, 896, 0, 28, 977, 14, 0, 896, 1118], more: [0, 0, 0, 0, 870, 870, 0, 0, 0, 0, 0], tag: [992, 560, 664, 540, 772, 386, 193, 98, 52, 24, 0],
  clock: [248, 260, 546, 546, 1057, 1081, 1025, 514, 514, 260, 248], drums: [0, 1911, 1365, 1365, 1365, 1365, 1365, 1365, 1911, 0, 0], camera: [0, 112, 1022, 514, 626, 650, 650, 626, 514, 1022, 0],
  exposure: [32, 546, 372, 248, 508, 1533, 508, 248, 372, 546, 32], gain: [0, 2, 2, 18, 18, 146, 146, 1170, 1170, 1170, 0], led: [112, 136, 260, 260, 260, 136, 136, 112, 112, 32, 0],
  window: [0, 1025, 1022, 682, 682, 682, 682, 682, 1022, 1025, 0], pan: [32, 112, 168, 32, 546, 2015, 546, 32, 168, 112, 32], zoom: [480, 528, 1224, 1512, 1224, 528, 488, 28, 14, 6, 0],
  signal: [0, 2, 2, 18, 18, 146, 146, 1170, 1170, 1170, 0], check: [0, 2, 6, 12, 8, 528, 816, 480, 192, 0, 0], warn: [32, 112, 80, 136, 168, 292, 292, 514, 546, 1025, 2047],
  sound: [0, 64, 200, 964, 1106, 1106, 1106, 964, 200, 64, 0], mute: [0, 64, 192, 970, 1092, 1098, 1088, 960, 192, 64, 0], reader: [0, 1022, 514, 762, 650, 682, 650, 762, 514, 1022, 0],
  flag: [512, 1020, 518, 514, 518, 1020, 512, 512, 512, 512, 512], link: [0, 0, 124, 130, 273, 955, 273, 130, 124, 0, 0], bluetooth: [32, 48, 40, 292, 168, 112, 168, 292, 40, 48, 32],
  battery: [0, 0, 2044, 1030, 1029, 1029, 1030, 2044, 0, 0, 0], edit: [6, 9, 18, 36, 72, 144, 288, 832, 640, 896, 0],
};
const FONT = '10px ui-monospace, Menlo, Consolas, "Liberation Mono", monospace';
const FONT_BIG = '600 13px Manrope, Arial, sans-serif';
const FRAME_W = 800, FRAME_H = 600;
const INTERVALS = [60, 120, 300, 600, 900, 1800, 3600];
const PRESETS: Array<[number, number]> = [[4, 2], [6, 0], [7, 1], [5, 3]];
const STEP_TITLES = ['Identify', 'Drum layout', 'Camera', 'Read window', 'Test read', 'Radio', 'Review'];
const STEP_ICONS = ['tag', 'drums', 'camera', 'window', 'read', 'signal', 'flag'];
const PHOTO = '/images/waterslop/hero.webp';   // the reader's own 800 x 600 frame, kept at 1600 x 1200
const AUTO_GUESS: Rect = { x: 367, y: 220, w: 235, h: 56 };   // WindowNet's proposal on this meter
const GOOD_BOX: Rect = { x: 376, y: 232, w: 146, h: 35 };     // the box the operator settled on
const READ = { near: [0, 0, 9, 2, 0, 7], conf: [0.981, 0.9492, 0.7146, 1.0, 0.9998, 0.9881], text: '0092.07', min: 0.7146, ms: 1579 };
const RADIO = { rssi: -17, snr: 9.8, dr: 3, fcnt: 220, ms: 1418, joined: 'restored' };

type Rect = { x: number; y: number; w: number; h: number };
type Screen = 'home' | 'scan' | 'connecting' | 'wizard' | 'configure' | 'more' | 'confirm' | 'message' | 'about';
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type WizMode = 'setup' | 'edit' | 'read';
type Phase = 'disconnected' | 'blank' | 'unfinished' | 'configured';
type CamCtl = 'Pan' | 'Exposure' | 'Gain' | 'LED';
type RoiMode = 'Move box' | 'Size box' | 'Pan view';
type Confirm = 'cancel' | 'factory' | 'discard' | 'disconnect';
type RV = { name: string; devEui: string; fw: string; model: string; configured: boolean; keySet: boolean; intervalS: number; integers: number; fractions: number; roi: Rect; exposure: number; gain: number; ledDuty: number; dirty: boolean };
type ReadResult = { status: number; text: string; min: number; ms: number; box: Rect; digits: number[]; confs: number[]; cached: boolean };
type Radio = { tested: boolean; ok: boolean; ack: boolean };
type Vp = { zoom: number; px: number; py: number; view: Rect };
type Popup = { kind: 'none' } | { kind: 'nearby' } | { kind: 'info'; title: string; lines: string[]; hints: string; icon: string };
export type Sim = {
  screen: Screen; step: Step; wizMode: WizMode; phase: Phase; popup: Popup;
  menuIndex: number; scanIndex: number; fieldIndex: number; reviewScroll: number; busy: string;
  message: string; messageTitle: string; confirm: Confirm; confirmTitle: string; confirmText: string;
  rv: RV; saved: RV | null; editing: boolean; editBuf: string;
  camCtl: CamCtl; roiMode: RoiMode; digitView: number; vp: Vp; read: ReadResult | null; radio: Radio;
  roiProposed: boolean; roiFromProposal: boolean; scanning: boolean; scanStarted: number; connectStarted: number;
  hasFrame: boolean; lastErr: string; lastEvent: string; dismissed: boolean; soundOn: boolean; readerConfigured: boolean; readerSeen: boolean;
};
export type SimScene = 'free' | 'nearby' | 'identify' | 'layout' | 'camera' | 'roi' | 'read' | 'radio' | 'review' | 'done' | 'connected' | 'reread';

/* ── the viewport (core/viewport.h) ── */
const clampZoom = (z: number) => Math.min(8, Math.max(0.1, z));
function clampPan(v: Vp): Vp {
  const vw = v.view.w / v.zoom, vh = v.view.h / v.zoom;
  const px = vw >= FRAME_W ? (FRAME_W - vw) / 2 : Math.min(Math.max(v.px, 0), FRAME_W - vw);
  const py = vh >= FRAME_H ? (FRAME_H - vh) / 2 : Math.min(Math.max(v.py, 0), FRAME_H - vh);
  return { ...v, px, py };
}
function centreOn(v: Vp, sx: number, sy: number): Vp { return clampPan({ ...v, px: sx - v.view.w / (2 * v.zoom), py: sy - v.view.h / (2 * v.zoom) }); }
function fitRect(v: Vp, r: Rect, margin: number): Vp {
  const rw = Math.max(1, r.w + 2 * margin), rh = Math.max(1, r.h + 2 * margin);
  const zoom = clampZoom(Math.min(v.view.w / rw, v.view.h / rh));
  return centreOn({ ...v, zoom }, r.x + r.w / 2, r.y + r.h / 2);
}
const fitFrame = (v: Vp) => fitRect(v, { x: 0, y: 0, w: FRAME_W, h: FRAME_H }, 0);
function zoomBy(v: Vp, f: number): Vp {
  const cx = v.px + v.view.w / (2 * v.zoom), cy = v.py + v.view.h / (2 * v.zoom);
  return centreOn({ ...v, zoom: clampZoom(v.zoom * f) }, cx, cy);
}
const panBy = (v: Vp, dx: number, dy: number) => clampPan({ ...v, px: v.px + dx / v.zoom, py: v.py + dy / v.zoom });
const screenX = (v: Vp, sx: number) => v.view.x + (sx - v.px) * v.zoom;
const screenY = (v: Vp, sy: number) => v.view.y + (sy - v.py) * v.zoom;
function screenRect(v: Vp, r: Rect): Rect {
  const x0 = Math.round(screenX(v, r.x)), y0 = Math.round(screenY(v, r.y)), x1 = Math.round(screenX(v, r.x + r.w)), y1 = Math.round(screenY(v, r.y + r.h));
  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}
const drumEdge = (b: Rect, n: number, i: number) => Math.trunc(b.x + i * (b.w / n));
const drumRect = (b: Rect, n: number, i: number): Rect => { const x0 = drumEdge(b, n, i), x1 = drumEdge(b, n, i + 1); return { x: x0, y: b.y, w: Math.max(1, x1 - x0), h: b.h }; };
const SIDE_VIEW: Rect = { x: 0, y: BAR_H, w: 150, h: H - BAR_H - FOOT_H };
const FULL_VIEW: Rect = { x: 0, y: BAR_H + 11, w: W, h: H - BAR_H - 11 - FOOT_H };

/* ── state ── */
const baseRV = (configured: boolean): RV => ({
  name: configured ? 'mysloooop1' : 'reader', devEui: '441BF6FFFE99DC7C', fw: '0.1', model: 'v10-s10-int8', configured, keySet: true,
  intervalS: configured ? 60 : 300, integers: 4, fractions: 2, roi: configured ? { ...GOOD_BOX } : { x: 0, y: 0, w: 0, h: 0 }, exposure: configured ? 312 : 336, gain: 3, ledDuty: 35, dirty: false,
});
function initial(readerConfigured: boolean): Sim {
  return {
    screen: 'home', step: 0, wizMode: 'setup', phase: 'disconnected', popup: { kind: 'none' }, menuIndex: 0, scanIndex: 0, fieldIndex: 0, reviewScroll: 0, busy: '',
    message: '', messageTitle: '', confirm: 'cancel', confirmTitle: '', confirmText: '', rv: baseRV(readerConfigured), saved: null, editing: false, editBuf: '',
    camCtl: 'Pan', roiMode: 'Move box', digitView: 0, vp: fitFrame({ zoom: 0.3, px: 0, py: 0, view: SIDE_VIEW }), read: null, radio: { tested: false, ok: false, ack: false },
    roiProposed: false, roiFromProposal: false, scanning: false, scanStarted: 0, connectStarted: 0, hasFrame: false, lastErr: '', lastEvent: '', dismissed: false, soundOn: true, readerConfigured, readerSeen: false,
  };
}
const readResult = (box: Rect, cached: boolean): ReadResult => ({ status: READ.min >= 0.8 ? 0 : 1, text: READ.text, min: READ.min, ms: READ.ms, box, digits: READ.near, confs: READ.conf, cached });

function preset(scene: SimScene): Sim {
  const s = initial(scene === 'connected' || scene === 'reread');
  const connected = (st: Sim, phase: Phase): Sim => ({ ...st, phase, rv: { ...baseRV(true), configured: phase === 'configured' } });
  const wiz = (st: Sim, step: Step): Sim => ({ ...connected(st, 'blank'), screen: 'wizard', wizMode: 'setup', step, hasFrame: true, rv: { ...baseRV(true), configured: false } });
  switch (scene) {
    case 'nearby': return { ...s, popup: { kind: 'nearby' }, readerSeen: true };
    case 'identify': return wiz(s, 0);
    case 'layout': return wiz(s, 1);
    case 'camera': return { ...wiz(s, 2), vp: fitFrame({ zoom: 0.3, px: 0, py: 0, view: SIDE_VIEW }) };
    case 'roi': { const st = wiz(s, 3); st.rv.roi = { ...AUTO_GUESS }; st.roiProposed = true; st.roiFromProposal = true; st.vp = fitRect({ zoom: 0.3, px: 0, py: 0, view: FULL_VIEW }, st.rv.roi, 30); return st; }
    case 'read': { const st = wiz(s, 4); st.read = readResult(GOOD_BOX, false); st.vp = fitRect({ zoom: 0.3, px: 0, py: 0, view: SIDE_VIEW }, GOOD_BOX, 12); return st; }
    case 'radio': { const st = wiz(s, 5); st.read = readResult(GOOD_BOX, false); st.radio = { tested: true, ok: true, ack: true }; return st; }
    case 'review': { const st = wiz(s, 6); st.read = readResult(GOOD_BOX, false); st.radio = { tested: true, ok: true, ack: true }; return st; }
    case 'done': return { ...s, screen: 'message', messageTitle: 'Setup complete', message: 'mysloooop1 sends a status frame,\nsleeps in 3 s, then reads\nevery 60 s.', readerConfigured: true };
    case 'connected': return { ...connected(s, 'configured'), screen: 'home' };
    case 'reread': { const st = connected(s, 'configured'); st.screen = 'wizard'; st.wizMode = 'read'; st.step = 4; st.hasFrame = true; st.read = readResult(GOOD_BOX, true); st.vp = fitRect({ zoom: 0.3, px: 0, py: 0, view: SIDE_VIEW }, GOOD_BOX, 12); return st; }
    default: return s;
  }
}

/* ── drawing (ui.cpp) ── */
type Ctx = CanvasRenderingContext2D;
function text(g: Ctx, x: number, y: number, s: string, color = C.FG) { g.font = FONT; g.fillStyle = color; g.textBaseline = 'top'; g.fillText(s, x, y - 1); }
function textBig(g: Ctx, x: number, y: number, s: string, color = C.FG) { g.font = FONT_BIG; g.fillStyle = color; g.textBaseline = 'top'; g.fillText(s, x, y - 1); }
function textW(g: Ctx, s: string) { g.font = FONT; return g.measureText(s).width; }
function textRight(g: Ctx, xr: number, y: number, s: string, color = C.FG) { text(g, xr - textW(g, s), y, s, color); }
function icon(g: Ctx, x: number, y: number, name: string, color = C.FG) {
  const rows = ICONS[name]; if (!rows) return;
  g.fillStyle = color;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) if ((rows[r] >> (10 - c)) & 1) g.fillRect(x + c, y + r, 1, 1);
}
function tri(g: Ctx, pts: number[], color: string) { g.fillStyle = color; g.beginPath(); g.moveTo(pts[0], pts[1]); g.lineTo(pts[2], pts[3]); g.lineTo(pts[4], pts[5]); g.closePath(); g.fill(); }
const arrowL = (g: Ctx, x: number, y: number, c: string) => tri(g, [x, y + 3, x + 4, y, x + 4, y + 6], c);
const arrowR = (g: Ctx, x: number, y: number, c: string) => tri(g, [x + 4, y + 3, x, y, x, y + 6], c);
const arrowU = (g: Ctx, x: number, y: number, c: string) => tri(g, [x + 3, y, x, y + 4, x + 6, y + 4], c);
const arrowD = (g: Ctx, x: number, y: number, c: string) => tri(g, [x + 3, y + 4, x, y, x + 6, y], c);
function rrect(g: Ctx, x: number, y: number, w: number, h: number, r: number, color: string, fill: boolean) {
  g.beginPath(); g.roundRect(x + (fill ? 0 : 0.5), y + (fill ? 0 : 0.5), w - (fill ? 0 : 1), h - (fill ? 0 : 1), r);
  if (fill) { g.fillStyle = color; g.fill(); } else { g.strokeStyle = color; g.lineWidth = 1; g.stroke(); }
}
function rect(g: Ctx, x: number, y: number, w: number, h: number, color: string, fill: boolean) {
  if (fill) { g.fillStyle = color; g.fillRect(x, y, w, h); } else { g.strokeStyle = color; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
}
function pill(g: Ctx, x: number, y: number, key: string) {
  const arrows = ['L', 'R', 'U', 'D', 'LR', 'UD'].includes(key);
  const inner = arrows ? (key.length === 2 ? 13 : 7) : textW(g, key);
  const w = inner + 8, h = 11;
  rrect(g, x, y, w, h, 5, C.PILL, true);
  const ax = x + 4, ay = y + 2;
  if (key === 'L') arrowL(g, ax, ay, C.FG); else if (key === 'R') arrowR(g, ax, ay, C.FG); else if (key === 'U') arrowU(g, ax, ay, C.FG); else if (key === 'D') arrowD(g, ax, ay, C.FG);
  else if (key === 'LR') { arrowL(g, ax, ay, C.FG); arrowR(g, ax + 8, ay, C.FG); } else if (key === 'UD') { arrowU(g, ax, ay, C.FG); arrowD(g, ax + 7, ay, C.FG); }
  else text(g, x + 4, y + 2, key, C.FG);
  return x + w;
}
function hintsAt(g: Ctx, x: number, y: number, spec: string) {
  let i = 0;
  while (i < spec.length) {
    if (spec[i] === '[') { const e = spec.indexOf(']', i); if (e < 0) break; x = pill(g, x, y, spec.slice(i + 1, e)) + 2; i = e + 1; }
    else { let e = spec.indexOf('[', i); if (e < 0) e = spec.length; const t = spec.slice(i, e); text(g, x, y + 2, t, C.DIM); x += textW(g, t); i = e; }
  }
}
function hints(g: Ctx, spec: string) { rect(g, 0, H - FOOT_H, W, FOOT_H, C.BG, true); hintsAt(g, 2, H - FOOT_H + 1, spec); }
function battery(g: Ctx, x: number, y: number, level: number, charging: boolean) {
  rrect(g, x, y, 17, 8, 2, C.DIM, false); rect(g, x + 17, y + 2, 2, 4, C.DIM, true);
  if (level < 0) { text(g, x + 6, y, '?', C.DIM); return; }
  const fw = Math.floor((13 * level + 50) / 100);
  const c = charging ? C.OK : level <= 15 ? C.BAD : level <= 35 ? C.WARN : C.FG;
  if (fw > 0) rect(g, x + 2, y + 2, fw, 4, c, true);
}
function signalBars(g: Ctx, x: number, y: number, bars: number, color: string) {
  for (let i = 0; i < 4; i++) { const h = 3 + i * 3; if (i < bars) rect(g, x + i * 4, y + 12 - h, 3, h, color, true); else rect(g, x + i * 4, y + 12 - h, 3, h, C.MUTE, false); }
}
function topBar(g: Ctx, ic: string, left: string, centre: string, level: number, busy: boolean) {
  rect(g, 0, 0, W, BAR_H, C.BAR, true);
  icon(g, 3, 1, ic, C.DIM); text(g, 17, 3, left, C.FG);
  if (centre) textRight(g, W - 62, 3, centre, busy ? C.ACC : C.DIM);
  if (busy) { g.fillStyle = C.ACC; g.beginPath(); g.arc(W - 56, 6, 3, 0, Math.PI * 2); g.fill(); }
  textRight(g, W - 24, 3, `${level}%`, C.DIM);
  battery(g, W - 22, 3, level, false);
}
function field(g: Ctx, x: number, y: number, w: number, ic: string, label: string, value: string, focused: boolean, arrows: boolean, valueColor = C.FG, boxX = 0) {
  icon(g, x, y + 1, ic, focused ? C.FG : C.DIM);
  text(g, x + 15, y + 3, label, focused ? C.FG : C.DIM);
  const bx = boxX > 0 ? boxX : x + 15 + textW(g, label) + 6, bw = w - (bx - x) - (arrows ? 8 : 0);
  rrect(g, bx, y, bw, 14, 3, focused ? C.ACC : C.LINE, false);
  text(g, bx + 5, y + 3, value, focused ? valueColor : valueColor === C.FG ? C.DIM : valueColor);
  if (focused && arrows) { arrowL(g, bx - 7, y + 4, C.ACC); arrowR(g, bx + bw + 3, y + 4, C.ACC); }
}
function menuRow(g: Ctx, y: number, ic: string, label: string, selected: boolean, right?: string) {
  if (selected) rrect(g, 2, y - 2, W - 4, 15, 4, C.SEL, true);
  icon(g, 8, y, ic, selected ? C.ACC : C.DIM);
  text(g, 24, y + 2, label, selected ? C.FG : C.DIM);
  if (right) textRight(g, W - 8, y + 2, right, C.DIM);
  if (selected) arrowR(g, W - 12, y + 2, C.ACC);
}
function popup(g: Ctx, title: string, lines: string[], hintSpec: string, ic = 'info') {
  const n = lines.length, pw = 220, ph = 24 + n * 11 + 18, px = (W - pw) / 2, py = Math.floor((H - ph) / 2) - 2;
  rrect(g, px, py, pw, ph, 5, C.POP, true); rrect(g, px, py, pw, ph, 5, C.ACC, false);
  icon(g, px + 7, py + 5, ic, C.ACC); text(g, px + 22, py + 7, title, C.FG);
  lines.forEach((l, i) => text(g, px + 8, py + 22 + i * 11, l, C.DIM));
  hintsAt(g, px + 6, py + ph - 14, hintSpec);
}

/* ── the viewport picture (viewportImage / viewportBox) ── */
let photo: HTMLImageElement | null = null;
const photoWaiters: Array<() => void> = [];
function loadPhoto(cb: () => void) {
  if (photo && photo.complete) { cb(); return; }
  photoWaiters.push(cb);
  if (!photo) { photo = new Image(); photo.src = PHOTO; photo.onload = () => { photoWaiters.splice(0).forEach((f) => f()); }; }
}
function viewportImage(g: Ctx, v: Vp, has: boolean) {
  rect(g, v.view.x, v.view.y, v.view.w, v.view.h, C.POP, true);
  if (!has || !photo || !photo.complete || !photo.naturalWidth) return false;
  g.save(); g.beginPath(); g.rect(v.view.x, v.view.y, v.view.w, v.view.h); g.clip();
  const k = photo.naturalWidth / FRAME_W;
  const sx = v.px * k, sy = v.py * k, sw = (v.view.w / v.zoom) * k, sh = (v.view.h / v.zoom) * k;
  g.imageSmoothingEnabled = true;
  g.drawImage(photo, sx, sy, sw, sh, v.view.x, v.view.y, v.view.w, v.view.h);
  g.restore();
  return true;
}
function viewportFrame(g: Ctx, v: Vp) { rect(g, v.view.x, v.view.y, v.view.w, v.view.h, C.LINE, false); }
function viewportBox(g: Ctx, v: Vp, box: Rect, integers: number, fractions: number, color: string, thick: boolean) {
  g.save(); g.beginPath(); g.rect(v.view.x, v.view.y, v.view.w, v.view.h); g.clip();
  const r = screenRect(v, box), n = integers + fractions;
  rect(g, r.x, r.y, r.w, r.h, color, false);
  if (thick) rect(g, r.x - 1, r.y - 1, r.w + 2, r.h + 2, color, false);
  if (fractions > 0 && n > 0) {
    const fx = Math.round(screenX(v, drumEdge(box, n, integers)));
    rect(g, fx, r.y, r.x + r.w - fx, 1, C.BAD, true); rect(g, fx, r.y + r.h - 1, r.x + r.w - fx, 1, C.BAD, true);
    if (thick) { rect(g, fx, r.y - 1, r.x + r.w - fx + 1, 1, C.BAD, true); rect(g, fx, r.y + r.h, r.x + r.w - fx + 1, 1, C.BAD, true); }
  }
  for (let i = 1; i < n; i++) {
    const sx = Math.round(screenX(v, drumEdge(box, n, i)));
    if (sx < v.view.x || sx >= v.view.x + v.view.w) continue;
    rect(g, sx, r.y, 1, r.h, i >= integers ? C.BAD : color, true);
  }
  g.restore();
}

/* ── screens (app.cpp render half) ── */
const layoutExample = (ints: number, fracs: number) => {
  let s = '';
  for (let i = 0; i < ints; i++) s += i === ints - 1 ? '9' : i === ints - 2 ? '2' : '0';
  if (fracs) { s += '.'; for (let i = 0; i < fracs; i++) s += i === 0 ? '0' : '7'; }
  return s;
};
const menuIcon: Record<string, string> = { Find: 'find', About: 'info', 'Resume setup': 'flag', Read: 'read', Configure: 'configure', More: 'more', 'Radio test': 'signal', 'Reader info': 'reader', 'Factory reset': 'warn', Disconnect: 'link', 'Name and interval': 'tag', 'Drum layout': 'drums', Camera: 'camera', 'Read window': 'window' };
const homeMenu = (p: Phase) => p === 'disconnected' ? ['Find', 'About'] : p === 'configured' ? ['Read', 'Configure', 'More'] : p === 'unfinished' ? ['Resume setup', 'Read', 'Configure', 'More'] : [];
const moreMenu = (p: Phase) => ['Radio test', 'Reader info', 'About', ...(p === 'configured' ? ['Factory reset'] : []), 'Disconnect'];
const configureMenu = ['Name and interval', 'Drum layout', 'Camera', 'Read window'];
const rssiBars = (rssi: number) => rssi > -70 ? 4 : rssi > -90 ? 3 : rssi > -105 ? 2 : 1;
const saveOrNext = (s: Sim) => s.wizMode === 'edit' ? 'save' : 'next';

function render(g: Ctx, s: Sim, now: number) {
  rect(g, 0, 0, W, H, C.BG, true);
  const connected = s.phase !== 'disconnected';
  const centre = s.screen === 'wizard' ? (s.wizMode === 'setup' ? `${s.step + 1}/7` : s.wizMode === 'edit' ? 'edit' : '') : s.screen === 'about' ? 'about' : s.screen === 'scan' ? 'find' : '';
  topBar(g, connected ? 'link' : 'bluetooth', connected ? `${s.rv.name} -58dBm` : 'ConfigKing', centre, 100, Boolean(s.busy));
  const menuScreen = (items: string[], title: string, hint: string) => {
    text(g, 6, BAR_H + 3, title, C.DIM);
    const rowH = items.length > 4 ? 16 : 18;
    items.forEach((it, i) => menuRow(g, BAR_H + 15 + i * rowH, menuIcon[it] ?? 'info', it, i === s.menuIndex));
    hints(g, hint);
  };
  const stepTitle = () => { icon(g, 4, BAR_H + 2, STEP_ICONS[s.step], C.ACC); text(g, 19, BAR_H + 4, STEP_TITLES[s.step], C.FG); };
  const infoButton = (x: number, y: number, focused: boolean) => { if (focused) rrect(g, x, y, 15, 15, 4, C.SEL, true); rrect(g, x, y, 15, 15, 4, focused ? C.ACC : C.LINE, false); icon(g, x + 2, y + 2, 'info', focused ? C.ACC : C.DIM); };
  const drawFrame = (overlayBox: boolean) => {
    if (!viewportImage(g, s.vp, s.hasFrame)) text(g, s.vp.view.x + 8, s.vp.view.y + s.vp.view.h / 2 - 4, 'no picture', C.DIM);
    if (overlayBox && s.rv.roi.w > 0) viewportBox(g, s.vp, s.rv.roi, s.rv.integers, s.rv.fractions, C.OK, true);
    viewportFrame(g, s.vp);
  };
  switch (s.screen) {
    case 'home': {
      if (s.phase === 'disconnected') {
        textBig(g, 6, BAR_H + 4, 'ConfigKing', C.FG);
        text(g, 6, BAR_H + 22, s.scanning ? 'Looking for readers nearby' : 'Water meter reader setup', C.DIM);
        homeMenu(s.phase).forEach((it, i) => menuRow(g, BAR_H + 40 + i * 22, menuIcon[it], it, i === s.menuIndex));
        hints(g, '[UD] move  [Enter] select');
      } else menuScreen(homeMenu(s.phase), s.phase === 'unfinished' ? 'Setup not finished' : 'Configured reader', '[Enter] select  [i] info  [Esc] leave');
      break;
    }
    case 'scan': {
      icon(g, 6, BAR_H + 2, 'find', C.DIM);
      const list = s.readerSeen ? [{ name: 'WSR-DC7C', state: s.readerConfigured, rssi: -53 }] : [];
      text(g, 21, BAR_H + 4, s.scanning ? 'Scanning...' : list.length === 0 ? 'No reader found' : 'Readers nearby', C.FG);
      if (list.length === 0 && !s.scanning) { text(g, 6, BAR_H + 24, 'Hold BOOT on the reader for', C.DIM); text(g, 6, BAR_H + 35, 'setup mode, then press r.', C.DIM); }
      list.forEach((r, i) => {
        const y = BAR_H + 20 + i * 16, sel = i === s.scanIndex;
        if (sel) rrect(g, 2, y - 2, W - 4, 15, 4, C.SEL, true);
        icon(g, 8, y, 'reader', sel ? C.ACC : C.DIM); text(g, 24, y + 2, r.name, sel ? C.FG : C.DIM); text(g, 90, y + 2, r.state ? 'configured' : 'blank', C.DIM);
        signalBars(g, W - 44, y - 1, 4, sel ? C.FG : C.DIM); textRight(g, W - 6, y + 2, String(r.rssi), C.DIM);
      });
      hints(g, '[Enter] connect  [r] rescan  [Esc] back');
      break;
    }
    case 'connecting': {
      textBig(g, 6, BAR_H + 10, 'Connecting', C.FG);
      text(g, 6, BAR_H + 34, `connecting  ${Math.floor((now - s.connectStarted) / 1000)} s`, C.FG);
      text(g, 6, BAR_H + 50, 'Pairing is automatic (bonded once).', C.DIM); text(g, 6, BAR_H + 61, 'The first time can take ~5 s.', C.DIM);
      hints(g, '[Esc] abort');
      break;
    }
    case 'configure': menuScreen(configureMenu, 'Configure: pick a category', '[UD] move  [Enter] open  [Esc] back'); break;
    case 'more': menuScreen(moreMenu(s.phase), 'More', '[UD] move  [Enter] select  [Esc] back'); break;
    case 'confirm': popup(g, s.confirmTitle, s.confirmText.split('\n'), s.confirm === 'factory' ? '[Enter] reset  [Esc] back' : '[Enter] yes  [Esc] no', s.confirm === 'factory' ? 'warn' : 'info'); break;
    case 'message': {
      icon(g, 6, BAR_H + 3, 'info', C.ACC); text(g, 21, BAR_H + 5, s.messageTitle, C.FG);
      s.message.split('\n').forEach((l, i) => text(g, 6, BAR_H + 22 + i * 11, l, C.DIM));
      hints(g, '[Enter] continue');
      break;
    }
    case 'about': {
      textBig(g, 6, BAR_H + 3, 'ConfigKing', C.FG); text(g, 100, BAR_H + 8, 'fw 0.2', C.DIM);
      let y = BAR_H + 24;
      icon(g, 6, y - 1, 'battery', C.DIM); text(g, 21, y, 'Battery 100%  4.17 V', C.FG); y += 13;
      icon(g, 6, y - 1, s.soundOn ? 'sound' : 'mute', C.DIM); text(g, 21, y, s.soundOn ? 'Sounds on' : 'Sounds off', C.FG); text(g, 100, y, '(s) toggle', C.MUTE); y += 13;
      icon(g, 6, y - 1, 'bluetooth', C.DIM); text(g, 21, y, 'BLE ready  ac:a7:04:00:01:63', C.FG); y += 13;
      icon(g, 6, y - 1, 'reader', C.DIM); text(g, 21, y, connected ? `Reader ${s.rv.name}  fw ${s.rv.fw}  -58 dBm` : 'No reader connected', connected ? C.FG : C.DIM); y += 13;
      icon(g, 6, y - 1, 'signal', C.DIM);
      if (!connected) text(g, 21, y, 'LoRa: connect a reader', C.DIM);
      else if (s.busy === 'radio') text(g, 21, y, 'LoRa test running...', C.ACC);
      else if (!s.radio.tested) text(g, 21, y, 'LoRa via reader: (t) test', C.FG);
      else text(g, 21, y, `LoRa ACK ${RADIO.ms} ms  ${RADIO.rssi} dBm`, C.OK);
      hints(g, connected ? '[s] sound  [t] LoRa  [i] more  [Esc]' : '[s] sound  [i] more  [Esc] back');
      break;
    }
    case 'wizard': {
      switch (s.step) {
        case 0: {
          stepTitle(); infoButton(W - 22, BAR_H + 1, s.fieldIndex === 2);
          field(g, 6, BAR_H + 24, 200, 'tag', 'Name', s.editing ? s.editBuf + '_' : s.rv.name, s.fieldIndex === 0, false, C.FG, 62);
          field(g, 6, BAR_H + 48, 200, 'clock', 'Every', `${s.rv.intervalS} s`, s.fieldIndex === 1, true, C.FG, 62);
          if (s.editing) hints(g, 'type a name  [Enter] done  [Esc] cancel');
          else if (s.fieldIndex === 0) hints(g, '[Enter] edit  [UD] field  [Esc] back');
          else if (s.fieldIndex === 1) hints(g, `[LR] change  [UD] field  [Enter] ${saveOrNext(s)}`);
          else hints(g, '[Enter] reader details  [UD] field');
          break;
        }
        case 1: {
          stepTitle();
          field(g, 6, BAR_H + 22, 150, 'drums', 'Whole', String(s.rv.integers), s.fieldIndex === 0, true);
          field(g, 6, BAR_H + 44, 150, 'drums', 'Decimal', String(s.rv.fractions), s.fieldIndex === 1, true, C.BAD);
          const n = s.rv.integers + s.rv.fractions, cw = 14, x0 = 6, y0 = BAR_H + 68;
          const ex = layoutExample(s.rv.integers, s.rv.fractions).replace('.', '');
          for (let i = 0; i < n; i++) {
            const x = x0 + i * (cw + 1);
            rect(g, x, y0, cw, 18, i >= s.rv.integers ? C.RED_TINT : C.CELL, true); rect(g, x, y0, cw, 18, i >= s.rv.integers ? C.BAD : C.LINE, false);
            text(g, x + 4, y0 + 5, ex[i] ?? '', i >= s.rv.integers ? C.BAD : C.FG);
          }
          text(g, x0 + n * (cw + 1) + 6, y0 + 5, `${layoutExample(s.rv.integers, s.rv.fractions)} m3`, C.DIM);
          hints(g, `[LR] change  [p] preset  [Enter] ${saveOrNext(s)}`);
          break;
        }
        case 2: {
          drawFrame(false);
          const cx = 154, cw = W - cx - 4;
          icon(g, cx, BAR_H + 2, 'camera', C.ACC); text(g, cx + 15, BAR_H + 4, 'Camera', C.FG);
          field(g, cx, BAR_H + 18, cw, 'exposure', '', String(s.rv.exposure), s.camCtl === 'Exposure', true);
          field(g, cx, BAR_H + 36, cw, 'gain', '', String(s.rv.gain), s.camCtl === 'Gain', true);
          field(g, cx, BAR_H + 54, cw, 'led', '', `${s.rv.ledDuty}%`, s.camCtl === 'LED', true);
          icon(g, cx, BAR_H + 73, 'pan', s.camCtl === 'Pan' ? C.ACC : C.DIM); text(g, cx + 15, BAR_H + 75, 'Pan', s.camCtl === 'Pan' ? C.FG : C.DIM);
          if (s.camCtl === 'Pan') { arrowL(g, cx + 40, BAR_H + 76, C.ACC); arrowR(g, cx + 48, BAR_H + 76, C.ACC); arrowU(g, cx + 58, BAR_H + 75, C.ACC); arrowD(g, cx + 67, BAR_H + 76, C.ACC); }
          let x = pill(g, cx, BAR_H + 87, 'Tab'); text(g, x + 3, BAR_H + 89, 'next ctl', C.DIM);
          x = pill(g, cx, BAR_H + 99, 'Enter'); text(g, x + 3, BAR_H + 101, saveOrNext(s), C.DIM);
          hints(g, '[+][-] zoom  [p] refresh');
          break;
        }
        case 3: {
          const y = BAR_H + 2;
          icon(g, 2, y - 1, s.roiMode === 'Pan view' ? 'pan' : s.roiMode === 'Size box' ? 'zoom' : 'window', C.ACC);
          text(g, 15, y, s.roiMode, C.FG);
          const names = ['x', 'y', 'w', 'h'], vals = [s.rv.roi.x, s.rv.roi.y, s.rv.roi.w, s.rv.roi.h];
          let sx = 70;
          for (let i = 0; i < 4; i++) {
            const hot = (s.roiMode === 'Move box' && i < 2) || (s.roiMode === 'Size box' && i >= 2);
            text(g, sx, y, names[i], C.DIM); const v = String(vals[i]); text(g, sx + 7, y, v, hot ? C.ACC : C.FG); sx += 7 + textW(g, v) + 6;
          }
          pill(g, W - 28, y - 2, 'Tab');
          drawFrame(true);
          if (s.roiFromProposal) text(g, s.vp.view.x + 4, s.vp.view.y + 2, 'auto guess: check it', C.WARN);
          hints(g, `[+][-] zoom  [f] find  [Enter] ${saveOrNext(s)}`);
          break;
        }
        case 4: {
          const r = s.read;
          if (!viewportImage(g, s.vp, s.hasFrame)) text(g, s.vp.view.x + 8, s.vp.view.y + s.vp.view.h / 2 - 4, s.busy === 'read' ? 'reading...' : 'no picture', C.DIM);
          if (r && r.box.w > 0) viewportBox(g, s.vp, r.box, s.rv.integers, s.rv.fractions, r.status === 0 ? C.OK : r.status === 1 ? C.WARN : C.BAD, s.digitView === 0);
          if (r && s.digitView > 0) { const sr = screenRect(s.vp, drumRect(r.box, r.digits.length, s.digitView - 1)); g.save(); g.beginPath(); g.rect(s.vp.view.x, s.vp.view.y, s.vp.view.w, s.vp.view.h); g.clip(); rect(g, sr.x - 1, sr.y - 1, sr.w + 2, sr.h + 2, C.ACC, false); g.restore(); }
          viewportFrame(g, s.vp);
          const cx = 154;
          icon(g, cx, BAR_H + 2, 'read', C.ACC); text(g, cx + 15, BAR_H + 4, s.wizMode === 'read' ? 'Reading' : 'Test read', C.FG);
          if (!r) text(g, cx, BAR_H + 22, s.busy === 'read' ? 'working' : '', C.DIM);
          else {
            const names = ['OK', 'LOW', 'FAIL', 'CAMERA', 'NO WINDOW'], c = r.status === 0 ? C.OK : r.status === 1 ? C.WARN : C.BAD;
            text(g, cx, BAR_H + 20, names[r.status] ?? '?', c);
            textBig(g, cx, BAR_H + 30, r.text, C.FG);
            if (s.digitView === 0) {
              text(g, cx, BAR_H + 50, `min ${r.min.toFixed(3)}`, C.DIM);
              text(g, cx, BAR_H + 61, `${r.ms} ms${r.cached ? ' cached' : ''}`, C.MUTE);
              const x = pill(g, cx, BAR_H + 74, 'r'); text(g, x + 3, BAR_H + 76, 'read again', C.DIM);
            } else {
              const i = s.digitView - 1, cf = r.confs[i];
              text(g, cx, BAR_H + 50, `digit ${s.digitView}/${r.digits.length}`, C.DIM);
              textBig(g, cx, BAR_H + 60, String(r.digits[i]), i >= s.rv.integers ? C.BAD : C.FG);
              const cc = cf >= 0.8 ? C.OK : cf >= 0.5 ? C.WARN : C.BAD;
              text(g, cx + 18, BAR_H + 64, `conf ${cf.toFixed(2)}`, cc);
              rect(g, cx, BAR_H + 80, 80, 6, C.LINE, false); rect(g, cx + 1, BAR_H + 81, Math.round(78 * Math.min(1, Math.max(0, cf))), 4, cc, true);
            }
          }
          hints(g, s.wizMode === 'read' ? '[d] digit  [+][-] zoom  [Esc] back' : '[d] digit  [+][-] zoom  [Enter] next');
          break;
        }
        case 5: {
          stepTitle(); infoButton(W - 22, BAR_H + 1, s.fieldIndex === 1);
          if (s.busy === 'radio') { text(g, 6, BAR_H + 30, 'waiting for the gateway...', C.DIM); hints(g, ''); break; }
          if (!s.radio.tested) {
            icon(g, 6, BAR_H + 24, 'signal', C.DIM); text(g, 21, BAR_H + 26, 'Send one confirmed frame and', C.FG); text(g, 21, BAR_H + 38, "wait for the gateway's answer.", C.FG);
            hints(g, s.fieldIndex === 1 ? '[Enter] details  [UD] focus' : '[Enter] run radio test  [UD] focus');
            break;
          }
          const bars = rssiBars(RADIO.rssi);
          for (let i = 0; i < 4; i++) { const h = 7 + i * 7; if (i < bars) rect(g, 10 + i * 11, BAR_H + 52 - h, 9, h, C.OK, true); else rect(g, 10 + i * 11, BAR_H + 52 - h, 9, h, C.MUTE, false); }
          textBig(g, 60, BAR_H + 24, `ACK ${(RADIO.ms / 1000).toFixed(1)} s`, C.OK);
          text(g, 60, BAR_H + 44, bars >= 3 ? 'Good signal' : bars === 2 ? 'Fair signal' : 'Weak signal', C.DIM);
          if (s.fieldIndex === 1) hints(g, '[Enter] details  [UD] focus  [t] again');
          else hints(g, s.wizMode === 'setup' ? '[Enter] next  [UD] focus  [t] again' : '[Esc] back  [UD] focus  [t] again');
          break;
        }
        case 6: {
          stepTitle();
          const r = s.read, rv = s.rv;
          const rows: Array<[string, string, string, string]> = [
            ['tag', 'Name', rv.name, C.FG], ['clock', 'Every', `${rv.intervalS} s`, C.FG], ['drums', 'Drums', `${rv.integers} + ${rv.fractions}`, C.FG],
            ['camera', 'Camera', `exp ${rv.exposure} gain ${rv.gain} led ${rv.ledDuty}%`, C.FG], ['window', 'Window', `${rv.roi.x},${rv.roi.y} ${rv.roi.w}x${rv.roi.h}`, C.FG],
            ['read', 'Read', r ? `${r.text}  min ${r.min.toFixed(3)}` : 'none', r ? (r.status === 0 ? C.OK : r.status === 1 ? C.WARN : C.DIM) : C.DIM],
            ['signal', 'Radio', !s.radio.tested ? 'not tested' : `ACK ${RADIO.ms} ms  ${RADIO.rssi} dBm`, s.radio.tested ? C.OK : C.DIM],
          ];
          const visible = 5, y0 = BAR_H + 17, dy = 13;
          for (let i = 0; i < visible && i + s.reviewScroll < rows.length; i++) {
            const [ic, label, value, color] = rows[i + s.reviewScroll], y = y0 + i * dy;
            icon(g, 6, y - 1, ic, C.DIM); text(g, 21, y, label, C.DIM); text(g, 66, y, value.slice(0, 28), color);
          }
          if (s.reviewScroll > 0) arrowU(g, W - 10, y0, C.DIM);
          if (s.reviewScroll + visible < rows.length) arrowD(g, W - 10, y0 + (visible - 1) * dy, C.DIM);
          const by = H - FOOT_H - 16;
          rrect(g, 4, by, W - 8, 14, 4, C.ACC, true); icon(g, 10, by + 1, 'flag', C.BG); text(g, 26, by + 3, 'Finish: commit and start the reader', C.BG);
          hints(g, '[Enter] finish  [UD] scroll  [Esc] back');
          break;
        }
      }
      if (s.lastErr) { rect(g, 0, H - FOOT_H - 11, W, 11, C.BG, true); text(g, 2, H - FOOT_H - 10, s.lastErr.slice(0, 40), C.BAD); }
      break;
    }
  }
  if (s.popup.kind === 'nearby') popup(g, 'Reader nearby', [`WSR-DC7C  ${s.readerConfigured ? 'configured' : 'blank'}  -53 dBm`, 'Connect to it now?'], '[Enter] connect  [Esc] not now', 'reader');
  else if (s.popup.kind === 'info') popup(g, s.popup.title, s.popup.lines, s.popup.hints, s.popup.icon);
}

/* ── keys (app.cpp key half) ── */
export type Key = { ch?: string; enter?: boolean; esc?: boolean; del?: boolean; fn?: boolean; tab?: boolean; up?: boolean; down?: boolean; left?: boolean; right?: boolean };
type Later = (ms: number, kind: string, then: (s: Sim) => Sim) => void;

const infoIdentity = (s: Sim): Sim => ({ ...s, popup: { kind: 'info', title: 'Reader details', icon: 'reader', hints: '[Esc] close', lines: [`DevEUI ${s.rv.devEui}`, `Firmware ${s.rv.fw}  ${s.rv.model}`, s.rv.configured ? 'Configured reader' : 'Blank reader, first setup', `App key ${s.rv.keySet ? 'loaded' : 'missing'}`, `Interval ${s.rv.intervalS} s  layout ${s.rv.integers}+${s.rv.fractions}`] } });
const infoRadio = (s: Sim): Sim => ({ ...s, popup: s.radio.tested
  ? { kind: 'info', title: 'LoRa details', icon: 'signal', hints: '[Esc] close', lines: [`Session ${RADIO.joined}  FCnt ${RADIO.fcnt}`, `RSSI ${RADIO.rssi} dBm  SNR ${RADIO.snr} dB`, `Data rate DR${RADIO.dr}  ack yes`, `Round trip ${RADIO.ms} ms`] }
  : { kind: 'info', title: 'LoRa details', icon: 'signal', hints: '[Esc] close', lines: ['Run the radio test first.'] } });
const confirm = (s: Sim, kind: Confirm, title: string, body: string): Sim => ({ ...s, screen: 'confirm', confirm: kind, confirmTitle: title, confirmText: body, popup: { kind: 'none' } });
const goHome = (s: Sim): Sim => ({ ...s, screen: 'home', popup: { kind: 'none' }, phase: 'disconnected', menuIndex: 0, editing: false, hasFrame: false, read: null, radio: { tested: false, ok: false, ack: false }, dismissed: false });
const goConnectedHome = (s: Sim): Sim => ({ ...s, screen: 'home', popup: { kind: 'none' }, menuIndex: 0, editing: false });
function enterStep(s: Sim, step: Step, later: Later): Sim {
  let n: Sim = { ...s, step, fieldIndex: 0, editing: false, reviewScroll: 0, digitView: 0, lastErr: '' };
  if (step === 2) { n.camCtl = 'Pan'; n.vp = fitFrame({ ...n.vp, view: SIDE_VIEW }); if (!n.hasFrame) later(500, 'capture', (x) => ({ ...x, hasFrame: true, vp: fitFrame({ ...x.vp, view: SIDE_VIEW }) })); }
  if (step === 3) {
    n.roiMode = 'Move box'; n.vp = { ...n.vp, view: FULL_VIEW };
    if (n.wizMode === 'setup' && !n.rv.configured && n.rv.roi.w <= 0 && !n.roiProposed) {
      n.roiProposed = true; n.hasFrame = true;
      later(900, 'find', (x) => { const roi = { ...AUTO_GUESS }; return { ...x, rv: { ...x.rv, roi, dirty: true }, roiFromProposal: true, lastEvent: 'EVT roi auto guess: check the digits', vp: fitRect({ ...x.vp, view: FULL_VIEW }, roi, 30) }; });
    }
    if (n.rv.roi.w <= 0) n.rv = { ...n.rv, roi: { x: 300, y: 250, w: 200, h: 60 } };
    n.vp = fitRect(n.vp, n.rv.roi, 30);
  }
  if (step === 4) { n.vp = { ...n.vp, view: SIDE_VIEW }; n.vp = n.read && n.read.box.w > 0 ? fitRect(n.vp, n.read.box, 12) : fitFrame(n.vp); }
  return n;
}
function doRead(s: Sim, later: Later): Sim {
  later(1500, 'read', (x) => {
    const cached = x.wizMode === 'read' && x.rv.configured && !x.rv.dirty;
    const r = readResult(x.rv.roi.w > 0 ? x.rv.roi : GOOD_BOX, cached);
    return { ...x, read: r, hasFrame: true, digitView: 0, vp: fitRect({ ...x.vp, view: SIDE_VIEW }, r.box, 12) };
  });
  return { ...s, read: null, digitView: 0 };
}
function doRadio(s: Sim, later: Later): Sim {
  later(1400, 'radio', (x) => ({ ...x, radio: { tested: true, ok: true, ack: true }, rv: { ...x.rv, dirty: false } }));
  return { ...s, radio: { tested: false, ok: false, ack: false } };
}
function finishSetup(s: Sim, later: Later): Sim {
  later(700, 'done', (x) => ({ ...x, screen: 'message', messageTitle: 'Setup complete', message: `${x.rv.name} sends a status frame,\nsleeps in 3 s, then reads\nevery ${x.rv.intervalS} s.`, readerConfigured: true, phase: 'disconnected', popup: { kind: 'none' } }));
  return s;
}
function connectTo(s: Sim, later: Later): Sim {
  later(1300, 'connect', (x) => {
    const rv = baseRV(x.readerConfigured);
    const phase: Phase = x.readerConfigured ? 'configured' : 'blank';
    const n: Sim = { ...x, rv, phase, hasFrame: false, read: null, radio: { tested: false, ok: false, ack: false }, roiProposed: false, roiFromProposal: false };
    return phase === 'blank' ? enterStep({ ...n, screen: 'wizard', wizMode: 'setup' }, 0, later) : goConnectedHome(n);
  });
  return { ...s, screen: 'connecting', popup: { kind: 'none' }, connectStarted: Date.now() };
}
function saveEdit(s: Sim): Sim { return { ...s, rv: { ...s.rv, dirty: false }, saved: null, screen: 'configure', lastEvent: 'EVT saved' }; }
function editChanged(s: Sim) { const a = s.rv, b = s.saved; return !b || a.name !== b.name || a.intervalS !== b.intervalS || a.integers !== b.integers || a.fractions !== b.fractions || a.exposure !== b.exposure || a.gain !== b.gain || a.ledDuty !== b.ledDuty || JSON.stringify(a.roi) !== JSON.stringify(b.roi); }
const viewKeys = (s: Sim, k: Key, panArrows: boolean): Sim | null => {
  const z = k.ch === '+' || k.ch === '=' ? 1 : k.ch === '-' || k.ch === '_' ? -1 : 0;
  if (z) return { ...s, vp: zoomBy(s.vp, z > 0 ? 1.5 : 1 / 1.5) };
  if (panArrows && (k.left || k.right || k.up || k.down)) { const st = k.fn ? 64 : 16; return { ...s, vp: panBy(s.vp, k.left ? -st : k.right ? st : 0, k.up ? -st : k.down ? st : 0) }; }
  return null;
};
const moveBox = (b: Rect, dx: number, dy: number): Rect => ({ ...b, x: Math.min(Math.max(b.x + dx, 0), FRAME_W - 1 - b.w), y: Math.min(Math.max(b.y + dy, 0), FRAME_H - 1 - b.h) });
const sizeBox = (b: Rect, dw: number, dh: number): Rect => ({ ...b, w: Math.min(Math.max(b.w + dw, 8), FRAME_W - b.x), h: Math.min(Math.max(b.h + dh, 10), FRAME_H - b.y) });

export function applyKey(s: Sim, k: Key, later: Later): Sim {
  if (s.busy) return s;
  if (s.popup.kind === 'nearby') {
    if (k.enter) return connectTo(s, later);
    if (k.esc || k.ch === 'n') return { ...s, popup: { kind: 'none' }, dismissed: true };
    return s;
  }
  if (s.popup.kind === 'info') { if (k.esc || k.enter || k.ch === 'i') return { ...s, popup: { kind: 'none' } }; return s; }
  const nav = (items: string[]): Sim | null => {
    if (k.up) return { ...s, menuIndex: (s.menuIndex + items.length - 1) % items.length };
    if (k.down) return { ...s, menuIndex: (s.menuIndex + 1) % items.length };
    return null;
  };
  switch (s.screen) {
    case 'home': {
      const items = homeMenu(s.phase);
      if (items.length === 0) return s;
      const n = nav(items); if (n) return n;
      if (k.esc && s.phase !== 'disconnected') return confirm(s, 'disconnect', 'Disconnect?', `Leave ${s.rv.name} for now.\nIt sleeps after its idle timeout.`);
      if (k.ch === 'i' && s.phase !== 'disconnected') return infoIdentity(s);
      if (k.enter) {
        switch (items[s.menuIndex]) {
          case 'Find': { later(1600, 'scan', (x) => ({ ...x, scanning: false, readerSeen: true })); return { ...s, screen: 'scan', popup: { kind: 'none' }, scanIndex: 0, scanning: true }; }
          case 'About': return { ...s, screen: 'about', popup: { kind: 'none' } };
          case 'Read': { const n2: Sim = { ...s, screen: 'wizard', wizMode: 'read', step: 4, popup: { kind: 'none' }, vp: { ...s.vp, view: SIDE_VIEW } }; return doRead(n2, later); }
          case 'Configure': return { ...s, screen: 'configure', menuIndex: 0 };
          case 'More': return { ...s, screen: 'more', menuIndex: 0 };
        }
      }
      return s;
    }
    case 'scan': {
      if (k.esc) return goHome({ ...s, scanning: false });
      if (k.ch === 'r') { later(1600, 'scan', (x) => ({ ...x, scanning: false, readerSeen: true })); return { ...s, scanning: true }; }
      if (!s.readerSeen) return s;
      if (k.enter) return connectTo(s, later);
      return s;
    }
    case 'connecting': return k.esc ? goHome(s) : s;
    case 'configure': {
      const n = nav(configureMenu); if (n) return n;
      if (k.esc) return goConnectedHome(s);
      if (k.enter) { const st = [0, 1, 2, 3][s.menuIndex] as Step; return enterStep({ ...s, saved: { ...s.rv }, screen: 'wizard', wizMode: 'edit', popup: { kind: 'none' } }, st, later); }
      return s;
    }
    case 'more': {
      const items = moreMenu(s.phase);
      const n = nav(items); if (n) return n;
      if (k.esc) return goConnectedHome(s);
      if (k.enter) {
        switch (items[s.menuIndex]) {
          case 'Radio test': return doRadio({ ...s, screen: 'wizard', wizMode: 'read', step: 5, fieldIndex: 0 }, later);
          case 'Reader info': return infoIdentity(s);
          case 'About': return { ...s, screen: 'about' };
          case 'Factory reset': return confirm(s, 'factory', 'Factory reset WSR-DC7C?', 'Setup, layout, window and bonds are\nwiped. DevEUI, key and counters stay.\nThe reader reboots into discovery.');
          case 'Disconnect': return goHome(s);
        }
      }
      return s;
    }
    case 'confirm': {
      if (k.enter) {
        switch (s.confirm) {
          case 'factory': return { ...goHome(s), screen: 'message', messageTitle: 'Reader reset', message: 'Setup wiped; radio identity kept.\nThe reader reboots into discovery.', readerConfigured: false };
          case 'cancel': return goHome(s);
          case 'discard': return { ...s, rv: s.saved ? { ...s.saved, dirty: false } : s.rv, saved: null, screen: 'configure' };
          case 'disconnect': return goHome(s);
        }
      }
      if (k.esc) return { ...s, screen: s.confirm === 'factory' ? 'more' : s.confirm === 'disconnect' ? 'home' : 'wizard' };
      return s;
    }
    case 'message': return k.enter || k.esc ? (s.phase === 'disconnected' ? goHome(s) : goConnectedHome(s)) : s;
    case 'about': {
      if (k.ch === 's') return { ...s, soundOn: !s.soundOn };
      if (k.ch === 't' && s.phase !== 'disconnected') return doRadio(s, later);
      if (k.ch === 'i') return { ...s, popup: { kind: 'info', title: 'ConfigKing diagnostics', icon: 'info', hints: '[Esc] close', lines: ['BLE ready  own ac:a7:04:00:01:63', 'Scans 3  most seen 1', 'Battery 100%  4.17 V', 'Heap free 182 kB  up 4 min', 'Serial: KEY UI SCREENSHOT SEND BATT'] } };
      if (k.esc || k.enter) return { ...s, screen: s.phase === 'disconnected' ? 'home' : 'more', menuIndex: 0 };
      return s;
    }
    case 'wizard': return wizardKey(s, k, later);
  }
  return s;
}

function wizardKey(s: Sim, k: Key, later: Later): Sim {
  if (k.esc) {
    if (s.editing) return { ...s, editing: false };
    if (s.wizMode === 'read') return goConnectedHome(s);
    if (s.wizMode === 'edit') return editChanged(s) || s.rv.dirty ? confirm(s, 'discard', 'Discard changes?', 'Nothing is saved on the reader.') : { ...s, screen: 'configure' };
    if (s.step === 0) return confirm(s, 'cancel', 'Cancel setup?', 'Staged changes are discarded; the\nreader sleeps after its idle timeout.\nThe draft stays on this ConfigKing.');
    return enterStep(s, (s.step - 1) as Step, later);
  }
  const mul = k.fn ? 10 : 1;
  const rv = s.rv;
  switch (s.step) {
    case 0: {
      if (s.editing) {
        if (k.enter) return { ...s, editing: false, rv: { ...rv, name: s.editBuf.length ? s.editBuf : rv.name } };
        if (k.del) return { ...s, editBuf: s.editBuf.slice(0, -1) };
        if (k.ch && k.ch.length === 1 && k.ch > ' ' && s.editBuf.length < 16) return { ...s, editBuf: s.editBuf + k.ch };
        return s;
      }
      if (k.ch === 'i' || (s.fieldIndex === 2 && k.enter)) return infoIdentity(s);
      if (k.down || k.tab) return { ...s, fieldIndex: (s.fieldIndex + 1) % 3 };
      if (k.up) return { ...s, fieldIndex: (s.fieldIndex + 2) % 3 };
      if (s.fieldIndex === 0 && (k.enter || (k.ch && k.ch.length === 1 && k.ch > ' '))) return { ...s, editing: true, editBuf: k.ch && k.ch.length === 1 && k.ch > ' ' ? k.ch : rv.name };
      if (s.fieldIndex === 1 && (k.left || k.right)) { let idx = Math.max(0, INTERVALS.indexOf(rv.intervalS)); idx = (idx + (k.right ? 1 : INTERVALS.length - 1)) % INTERVALS.length; return { ...s, rv: { ...rv, intervalS: INTERVALS[idx] } }; }
      if (k.enter) return s.wizMode === 'edit' ? saveEdit(s) : enterStep({ ...s, rv: { ...rv, dirty: true } }, 1, later);
      return s;
    }
    case 1: {
      if (k.up || k.down || k.tab) return { ...s, fieldIndex: s.fieldIndex ^ 1 };
      if (k.left || k.right) { const d = k.right ? 1 : -1; return s.fieldIndex === 0 ? { ...s, rv: { ...rv, integers: Math.min(8, Math.max(1, rv.integers + d)) } } : { ...s, rv: { ...rv, fractions: Math.min(4, Math.max(0, rv.fractions + d)) } }; }
      if (k.ch === 'p') { const i = PRESETS.findIndex(([a, b]) => a === rv.integers && b === rv.fractions); const [a, b] = PRESETS[(i + 1) % PRESETS.length]; return { ...s, rv: { ...rv, integers: a, fractions: b } }; }
      if (k.enter) { if (rv.integers + rv.fractions > 9) return { ...s, lastErr: 'ERR total drums must be <= 9' }; return s.wizMode === 'edit' ? saveEdit(s) : enterStep({ ...s, rv: { ...rv, dirty: true } }, 2, later); }
      return s;
    }
    case 2: {
      const ctls: CamCtl[] = ['Pan', 'Exposure', 'Gain', 'LED'];
      if (k.tab) return { ...s, camCtl: ctls[(ctls.indexOf(s.camCtl) + 1) % 4] };
      const v = viewKeys(s, k, s.camCtl === 'Pan'); if (v) return v;
      if (k.up || k.down) return { ...s, camCtl: ctls[(ctls.indexOf(s.camCtl) + (k.down ? 1 : 3)) % 4] };
      if (k.left || k.right) {
        const d = k.right ? 1 : -1;
        if (s.camCtl === 'Exposure') return { ...s, rv: { ...rv, exposure: Math.min(1200, Math.max(1, rv.exposure + d * (k.fn ? 96 : 24))) } };
        if (s.camCtl === 'Gain') return { ...s, rv: { ...rv, gain: Math.min(30, Math.max(0, rv.gain + d * (k.fn ? 5 : 1))) } };
        if (s.camCtl === 'LED') return { ...s, rv: { ...rv, ledDuty: Math.min(100, Math.max(0, rv.ledDuty + d * (k.fn ? 20 : 5))) } };
        return s;
      }
      if (k.ch === 'p') { later(600, 'capture', (x) => ({ ...x, hasFrame: true })); return { ...s, hasFrame: false }; }
      if (k.enter) return s.wizMode === 'edit' ? saveEdit(s) : enterStep({ ...s, rv: { ...rv, dirty: true } }, 3, later);
      return s;
    }
    case 3: {
      const modes: RoiMode[] = ['Move box', 'Size box', 'Pan view'];
      let b = { ...rv.roi }, edited = false;
      if (k.tab) return { ...s, roiMode: modes[(modes.indexOf(s.roiMode) + 1) % 3] };
      if (k.ch === '+' || k.ch === '=' || k.ch === '-' || k.ch === '_') return viewKeys(s, k, false) ?? s;
      if (s.roiMode === 'Pan view' && (k.left || k.right || k.up || k.down)) return viewKeys(s, k, true) ?? s;
      if (s.roiMode === 'Move box' && (k.left || k.right || k.up || k.down)) { const nb = moveBox(b, k.left ? -mul : k.right ? mul : 0, k.up ? -mul : k.down ? mul : 0); edited = nb.x !== b.x || nb.y !== b.y; b = nb; }
      else if (s.roiMode === 'Size box' && (k.left || k.right || k.up || k.down)) { const nb = sizeBox(b, k.left ? -mul : k.right ? mul : 0, k.up ? -mul : k.down ? mul : 0); edited = nb.w !== b.w || nb.h !== b.h; b = nb; }
      else if (k.ch === 'p') { later(600, 'capture', (x) => ({ ...x, hasFrame: true })); return { ...s, hasFrame: false }; }
      else if (k.ch === 'f') { later(900, 'find', (x) => ({ ...x, rv: { ...x.rv, roi: { ...AUTO_GUESS }, dirty: true }, roiFromProposal: true, hasFrame: true })); return s; }
      else if (k.ch === 'z') return { ...s, vp: fitRect(s.vp, rv.roi, 30) };
      const n: Sim = { ...s, rv: { ...rv, roi: b }, roiFromProposal: edited ? false : s.roiFromProposal };
      if (k.enter) {
        if (s.wizMode === 'edit') return saveEdit(n);
        return doRead(enterStep({ ...n, rv: { ...n.rv, dirty: true } }, 4, later), later);
      }
      return n;
    }
    case 4: {
      const r = s.read;
      if (k.ch === 'r') return doRead(s, later);
      if (k.ch === 'd' && r) { const dv = (s.digitView + 1) % (r.digits.length + 1); return { ...s, digitView: dv, vp: dv === 0 ? fitRect(s.vp, r.box, 12) : fitRect(s.vp, drumRect(r.box, r.digits.length, dv - 1), 3) }; }
      if (k.ch === 'z' && r) return { ...s, digitView: 0, vp: fitRect(s.vp, r.box, 12) };
      const v = viewKeys(s, k, true); if (v) return v;
      if (k.enter) { if (s.wizMode === 'setup') return enterStep(s, 5, later); if (s.wizMode === 'read') return goConnectedHome(s); }
      return s;
    }
    case 5: {
      if (k.ch === 'i' || (s.fieldIndex === 1 && k.enter)) return infoRadio(s);
      if (k.up || k.down || k.tab) return { ...s, fieldIndex: s.fieldIndex ^ 1 };
      if (k.ch === 't' || (k.enter && !s.radio.tested)) return doRadio(s, later);
      if (k.enter) return s.wizMode === 'setup' ? enterStep(s, 6, later) : goConnectedHome(s);
      return s;
    }
    case 6: {
      if (k.up) return { ...s, reviewScroll: Math.max(0, s.reviewScroll - 1) };
      if (k.down) return { ...s, reviewScroll: Math.min(2, s.reviewScroll + 1) };
      if (k.enter) return finishSetup(s, later);
      return s;
    }
  }
  return s;
}

/* ── the component ── */
const KEYS: Array<[string, Key, string?]> = [
  ['↑', { up: true }, 'Up'], ['↓', { down: true }, 'Down'], ['←', { left: true }, 'Left'], ['→', { right: true }, 'Right'],
  ['Enter', { enter: true }], ['Esc', { esc: true }], ['Tab', { tab: true }], ['+', { ch: '+' }, 'Zoom in'], ['−', { ch: '-' }, 'Zoom out'],
  ['i', { ch: 'i' }, 'Info'], ['p', { ch: 'p' }, 'Preset / refresh'], ['f', { ch: 'f' }, 'Find window'], ['d', { ch: 'd' }, 'Digit'], ['r', { ch: 'r' }, 'Read again'], ['t', { ch: 't' }, 'Radio test'], ['s', { ch: 's' }, 'Sound'],
];

export default function ConfigKingSim({ scene = 'free', keys = true, className }: { scene?: SimScene; keys?: boolean; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [sim, setSim] = useState<Sim>(() => preset(scene));
  const simRef = useRef(sim);
  simRef.current = sim;
  const timers = useRef<number[]>([]);
  const { active } = useFrame();

  // A scripted scene replaces the state; the operator takes over from there.
  useEffect(() => { timers.current.forEach(clearTimeout); timers.current = []; setSim(preset(scene)); }, [scene]);

  // Every state change goes through `apply`: the transition may schedule a
  // delayed reply from the reader (a connect, a read, a radio test), during
  // which the device is busy and ignores keys, exactly as the firmware does.
  const apply = useCallback((fn: (s: Sim, later: Later) => Sim) => {
    let busy = '';
    const later: Later = (ms, kind, then) => {
      busy = kind;
      const t = window.setTimeout(() => { timers.current = timers.current.filter((x) => x !== t); apply((cur) => then({ ...cur, busy: '' })); }, ms);
      timers.current.push(t);
    };
    const next = fn(simRef.current, later);
    simRef.current = busy ? { ...next, busy } : next;
    setSim(simRef.current);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Background discovery on the disconnected home screen, as on the device.
  useEffect(() => {
    if (!active || scene !== 'free') return;
    const s = sim;
    if (s.screen !== 'home' || s.phase !== 'disconnected' || s.popup.kind !== 'none' || s.dismissed || s.busy) return;
    const t = window.setTimeout(() => setSim((x) => (x.screen === 'home' && x.phase === 'disconnected' && x.popup.kind === 'none' && !x.dismissed ? { ...x, popup: { kind: 'nearby' }, readerSeen: true } : x)), 1800);
    return () => clearTimeout(t);
  }, [sim, active, scene]);

  // Draw on every state change, and once the photo arrives.
  useEffect(() => {
    const cv = canvas.current; if (!cv) return;
    const draw = () => {
      const g = cv.getContext('2d'); if (!g) return;
      const k = Math.max(1, Math.ceil((cv.clientWidth * (window.devicePixelRatio || 1)) / W));
      if (cv.width !== W * k) { cv.width = W * k; cv.height = H * k; }
      g.setTransform(k, 0, 0, k, 0, 0);
      g.imageSmoothingEnabled = false;
      render(g, simRef.current, Date.now());
    };
    draw();
    loadPhoto(draw);
    const ro = new ResizeObserver(draw); ro.observe(cv);
    return () => ro.disconnect();
  }, [sim]);
  // The connecting screen counts seconds.
  useEffect(() => {
    if (sim.screen !== 'connecting' && !sim.scanning) return;
    const t = window.setInterval(() => setSim((s) => ({ ...s })), 500);
    return () => clearInterval(t);
  }, [sim.screen, sim.scanning]);

  const press = useCallback((k: Key) => apply((s, later) => applyKey(s, k, later)), [apply]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, Key> = { ArrowUp: { up: true }, ArrowDown: { down: true }, ArrowLeft: { left: true }, ArrowRight: { right: true }, Enter: { enter: true }, Escape: { esc: true }, Tab: { tab: true }, Backspace: { del: true } };
    let k = map[e.key];
    if (!k && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) k = { ch: e.key };
    if (!k) return;
    e.preventDefault();
    press({ ...k, fn: e.shiftKey && Boolean(k.up || k.down || k.left || k.right) });
  };

  return (
    <div ref={box} className={`ck${className ? ` ${className}` : ''}`} data-no-zoom>
      <div className="ck-device" tabIndex={0} role="application" aria-label="ConfigKing simulator. Use the arrow keys, Enter, Escape and Tab." onKeyDown={onKeyDown} onClick={() => box.current?.querySelector<HTMLElement>('.ck-device')?.focus()}>
        <canvas ref={canvas} className="ck-screen" width={W * 3} height={H * 3} aria-hidden="true" />
      </div>
      {keys && (
        <div className="ck-keys" aria-label="Keys">
          {KEYS.map(([label, k, title]) => <button key={label} type="button" title={title ?? label} onClick={() => press(k)}>{label}</button>)}
        </div>
      )}
    </div>
  );
}
