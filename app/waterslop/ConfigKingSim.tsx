'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useFrame } from './Story';

/* ConfigKingSim: the Cardputer's 240 x 135 screen, drawn the way the firmware
   draws it, inside a drawing of the Cardputer itself. The drawing primitives are
   ported from cardputer-setup/src/ui.cpp (pills, boxed fields, menu rows, popups,
   battery and signal glyphs, the shared viewport transform) and the screens from
   app.cpp (home, find, the seven wizard steps, Read, Configure, More, About).
   The reader on the other end of the BLE link is simulated: a blank reader the
   first time, a configured one after Finish. Values are the ones in the report's
   screenshots and the DrumNet run.

   Everything drawn that the firmware reacts to is also a touch target: menu rows,
   fields and their arrows, the key pills in the hints, popup buttons. The picture
   pans by dragging. The keyboard works once the reader has clicked the device. */

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

/* ── touch targets, collected while drawing ── */
export type Key = { ch?: string; enter?: boolean; esc?: boolean; del?: boolean; fn?: boolean; tab?: boolean; up?: boolean; down?: boolean; left?: boolean; right?: boolean };
type Hit = Rect & { key?: Key; pre?: (s: Sim) => Sim };
let HITS: Hit[] = [];
const hit = (h: Hit) => { HITS.push(h); };
const pillKey = (name: string): Key | null => {
  switch (name) {
    case 'Enter': return { enter: true }; case 'Esc': return { esc: true }; case 'Tab': return { tab: true };
    case 'UD': return { down: true }; case 'LR': return { right: true };
    case 'L': return { left: true }; case 'R': return { right: true }; case 'U': return { up: true }; case 'D': return { down: true };
    default: return name.length === 1 ? { ch: name } : null;
  }
};

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
  const k = pillKey(key);
  if (k) hit({ x: x - 2, y: y - 3, w: w + 4, h: h + 6, key: k });
  return x + w;
}
function hintsAt(g: Ctx, x: number, y: number, spec: string) {
  let i = 0;
  while (i < spec.length) {
    if (spec[i] === '[') { const e = spec.indexOf(']', i); if (e < 0) break; x = pill(g, x, y, spec.slice(i + 1, e)) + 2; i = e + 1; }
    else {
      let e = spec.indexOf('[', i); if (e < 0) e = spec.length;
      const t = spec.slice(i, e); text(g, x, y + 2, t, C.DIM);
      // the word after a pill is part of its target
      const last = HITS[HITS.length - 1]; if (last && last.y <= y && last.y + last.h >= y) last.w += textW(g, t.trimEnd());
      x += textW(g, t); i = e;
    }
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
/* A field. Tapping an unfocused field focuses it; tapping a focused field with
   arrows changes it (left half down, right half up), without arrows it edits. */
function field(g: Ctx, x: number, y: number, w: number, ic: string, label: string, value: string, focused: boolean, arrows: boolean, valueColor = C.FG, boxX = 0, focus?: (s: Sim) => Sim) {
  icon(g, x, y + 1, ic, focused ? C.FG : C.DIM);
  text(g, x + 15, y + 3, label, focused ? C.FG : C.DIM);
  const bx = boxX > 0 ? boxX : x + 15 + textW(g, label) + 6, bw = w - (bx - x) - (arrows ? 8 : 0);
  rrect(g, bx, y, bw, 14, 3, focused ? C.ACC : C.LINE, false);
  text(g, bx + 5, y + 3, value, focused ? valueColor : valueColor === C.FG ? C.DIM : valueColor);
  if (focused && arrows) { arrowL(g, bx - 7, y + 4, C.ACC); arrowR(g, bx + bw + 3, y + 4, C.ACC); }
  if (focused && arrows) { hit({ x: x, y: y - 2, w: bx - x + bw / 2, h: 18, key: { left: true } }); hit({ x: bx + bw / 2, y: y - 2, w: w - (bx + bw / 2 - x) + 10, h: 18, key: { right: true } }); }
  else if (focused) hit({ x, y: y - 2, w, h: 18, key: { enter: true } });
  else if (focus) hit({ x, y: y - 2, w, h: 18, pre: focus });
}
function menuRow(g: Ctx, y: number, ic: string, label: string, selected: boolean, index: number, right?: string) {
  if (selected) rrect(g, 2, y - 2, W - 4, 15, 4, C.SEL, true);
  icon(g, 8, y, ic, selected ? C.ACC : C.DIM);
  text(g, 24, y + 2, label, selected ? C.FG : C.DIM);
  if (right) textRight(g, W - 8, y + 2, right, C.DIM);
  if (selected) arrowR(g, W - 12, y + 2, C.ACC);
  hit({ x: 2, y: y - 2, w: W - 4, h: 16, key: { enter: true }, pre: (s) => ({ ...s, menuIndex: index }) });
}
function popup(g: Ctx, title: string, lines: string[], hintSpec: string, ic = 'info') {
  HITS = [];   // a popup takes every tap
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
/* How bright the picture looks for the camera settings, relative to the
   settings the real frame was taken with (exposure 312, gain 3, LED 35 %). */
const brightness = (rv: RV) => Math.min(2.6, Math.max(0.08, Math.pow(rv.exposure / 312, 0.6) * (1 + (rv.gain - 3) * 0.12) * Math.pow(Math.max(1, rv.ledDuty) / 35, 0.45)));
function viewportImage(g: Ctx, v: Vp, has: boolean, bright: number) {
  rect(g, v.view.x, v.view.y, v.view.w, v.view.h, C.POP, true);
  if (!has || !photo || !photo.complete || !photo.naturalWidth) return false;
  g.save(); g.beginPath(); g.rect(v.view.x, v.view.y, v.view.w, v.view.h); g.clip();
  const k = photo.naturalWidth / FRAME_W;
  const sx = v.px * k, sy = v.py * k, sw = (v.view.w / v.zoom) * k, sh = (v.view.h / v.zoom) * k;
  g.imageSmoothingEnabled = true;
  if (Math.abs(bright - 1) > 0.02) g.filter = `brightness(${bright.toFixed(3)})`;
  g.drawImage(photo, sx, sy, sw, sh, v.view.x, v.view.y, v.view.w, v.view.h);
  g.filter = 'none';
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
/* the screens that show the reader's picture, so a drag pans it */
const hasViewport = (s: Sim) => s.screen === 'wizard' && (s.step === 2 || s.step === 3 || s.step === 4) && s.popup.kind === 'none';

function render(g: Ctx, s: Sim, now: number) {
  HITS = [];
  rect(g, 0, 0, W, H, C.BG, true);
  const connected = s.phase !== 'disconnected';
  const centre = s.screen === 'wizard' ? (s.wizMode === 'setup' ? `${s.step + 1}/7` : s.wizMode === 'edit' ? 'edit' : '') : s.screen === 'about' ? 'about' : s.screen === 'scan' ? 'find' : '';
  topBar(g, connected ? 'link' : 'bluetooth', connected ? `${s.rv.name} -58dBm` : 'ConfigKing', centre, 100, Boolean(s.busy));
  const menuScreen = (items: string[], title: string, hint: string) => {
    text(g, 6, BAR_H + 3, title, C.DIM);
    const rowH = items.length > 4 ? 16 : 18;
    items.forEach((it, i) => menuRow(g, BAR_H + 15 + i * rowH, menuIcon[it] ?? 'info', it, i === s.menuIndex, i));
    hints(g, hint);
  };
  const stepTitle = () => { icon(g, 4, BAR_H + 2, STEP_ICONS[s.step], C.ACC); text(g, 19, BAR_H + 4, STEP_TITLES[s.step], C.FG); };
  const infoButton = (x: number, y: number, focused: boolean) => { if (focused) rrect(g, x, y, 15, 15, 4, C.SEL, true); rrect(g, x, y, 15, 15, 4, focused ? C.ACC : C.LINE, false); icon(g, x + 2, y + 2, 'info', focused ? C.ACC : C.DIM); hit({ x: x - 3, y: y - 3, w: 21, h: 21, key: { ch: 'i' } }); };
  const bright = brightness(s.rv);
  const drawFrame = (overlayBox: boolean) => {
    if (!viewportImage(g, s.vp, s.hasFrame, bright)) text(g, s.vp.view.x + 8, s.vp.view.y + s.vp.view.h / 2 - 4, 'no picture', C.DIM);
    if (overlayBox && s.rv.roi.w > 0) viewportBox(g, s.vp, s.rv.roi, s.rv.integers, s.rv.fractions, C.OK, true);
    viewportFrame(g, s.vp);
  };
  switch (s.screen) {
    case 'home': {
      if (s.phase === 'disconnected') {
        textBig(g, 6, BAR_H + 4, 'ConfigKing', C.FG);
        text(g, 6, BAR_H + 22, s.scanning ? 'Looking for readers nearby' : 'Water meter reader setup', C.DIM);
        homeMenu(s.phase).forEach((it, i) => menuRow(g, BAR_H + 40 + i * 22, menuIcon[it], it, i === s.menuIndex, i));
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
        hit({ x: 2, y: y - 2, w: W - 4, h: 16, key: { enter: true }, pre: (st) => ({ ...st, scanIndex: i }) });
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
          field(g, 6, BAR_H + 24, 200, 'tag', 'Name', s.editing ? s.editBuf + '_' : s.rv.name, s.fieldIndex === 0, false, C.FG, 62, (st) => ({ ...st, fieldIndex: 0 }));
          field(g, 6, BAR_H + 48, 200, 'clock', 'Every', `${s.rv.intervalS} s`, s.fieldIndex === 1, true, C.FG, 62, (st) => ({ ...st, fieldIndex: 1 }));
          if (s.editing) hints(g, 'type a name  [Enter] done  [Esc] cancel');
          else if (s.fieldIndex === 0) hints(g, '[Enter] edit  [UD] field  [Esc] back');
          else if (s.fieldIndex === 1) hints(g, `[LR] change  [UD] field  [Enter] ${saveOrNext(s)}`);
          else hints(g, '[Enter] reader details  [UD] field');
          break;
        }
        case 1: {
          stepTitle();
          field(g, 6, BAR_H + 22, 150, 'drums', 'Whole', String(s.rv.integers), s.fieldIndex === 0, true, C.FG, 0, (st) => ({ ...st, fieldIndex: 0 }));
          field(g, 6, BAR_H + 44, 150, 'drums', 'Decimal', String(s.rv.fractions), s.fieldIndex === 1, true, C.BAD, 0, (st) => ({ ...st, fieldIndex: 1 }));
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
          field(g, cx, BAR_H + 18, cw, 'exposure', '', String(s.rv.exposure), s.camCtl === 'Exposure', true, C.FG, 0, (st) => ({ ...st, camCtl: 'Exposure' }));
          field(g, cx, BAR_H + 36, cw, 'gain', '', String(s.rv.gain), s.camCtl === 'Gain', true, C.FG, 0, (st) => ({ ...st, camCtl: 'Gain' }));
          field(g, cx, BAR_H + 54, cw, 'led', '', `${s.rv.ledDuty}%`, s.camCtl === 'LED', true, C.FG, 0, (st) => ({ ...st, camCtl: 'LED' }));
          icon(g, cx, BAR_H + 73, 'pan', s.camCtl === 'Pan' ? C.ACC : C.DIM); text(g, cx + 15, BAR_H + 75, 'Pan', s.camCtl === 'Pan' ? C.FG : C.DIM);
          hit({ x: cx, y: BAR_H + 70, w: cw, h: 16, pre: (st) => ({ ...st, camCtl: 'Pan' }) });
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
          if (!viewportImage(g, s.vp, s.hasFrame, bright)) text(g, s.vp.view.x + 8, s.vp.view.y + s.vp.view.h / 2 - 4, s.busy === 'read' ? 'reading...' : 'no picture', C.DIM);
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
          if (s.reviewScroll > 0) { arrowU(g, W - 10, y0, C.DIM); hit({ x: W - 20, y: y0 - 6, w: 20, h: 16, key: { up: true } }); }
          if (s.reviewScroll + visible < rows.length) { arrowD(g, W - 10, y0 + (visible - 1) * dy, C.DIM); hit({ x: W - 20, y: y0 + (visible - 1) * dy - 6, w: 20, h: 16, key: { down: true } }); }
          const by = H - FOOT_H - 16;
          rrect(g, 4, by, W - 8, 14, 4, C.ACC, true); icon(g, 10, by + 1, 'flag', C.BG); text(g, 26, by + 3, 'Finish: commit and start the reader', C.BG);
          hit({ x: 4, y: by - 2, w: W - 8, h: 18, key: { enter: true } });
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
type Later = (ms: number, kind: string, then: (s: Sim) => Sim) => void;

const infoIdentity = (s: Sim): Sim => ({ ...s, popup: { kind: 'info', title: 'Reader details', icon: 'reader', hints: '[Esc] close', lines: [`DevEUI ${s.rv.devEui}`, `Firmware ${s.rv.fw}  ${s.rv.model}`, s.rv.configured ? 'Configured reader' : 'Blank reader, first setup', `App key ${s.rv.keySet ? 'loaded' : 'missing'}`, `Interval ${s.rv.intervalS} s  layout ${s.rv.integers}+${s.rv.fractions}`] } });
const infoRadio = (s: Sim): Sim => ({ ...s, popup: s.radio.tested
  ? { kind: 'info', title: 'LoRa details', icon: 'signal', hints: '[Esc] close', lines: [`Session ${RADIO.joined}  FCnt ${RADIO.fcnt}`, `RSSI ${RADIO.rssi} dBm  SNR ${RADIO.snr} dB`, `Data rate DR${RADIO.dr}  ack yes`, `Round trip ${RADIO.ms} ms`] }
  : { kind: 'info', title: 'LoRa details', icon: 'signal', hints: '[Esc] close', lines: ['Run the radio test first.'] } });
const confirm = (s: Sim, kind: Confirm, title: string, body: string): Sim => ({ ...s, screen: 'confirm', confirm: kind, confirmTitle: title, confirmText: body, popup: { kind: 'none' } });
const goHome = (s: Sim): Sim => ({ ...s, screen: 'home', popup: { kind: 'none' }, phase: 'disconnected', menuIndex: 0, editing: false, hasFrame: false, read: null, radio: { tested: false, ok: false, ack: false }, dismissed: false });
const goConnectedHome = (s: Sim): Sim => ({ ...s, screen: 'home', popup: { kind: 'none' }, menuIndex: 0, editing: false });
function enterStep(s: Sim, step: Step, later: Later): Sim {
  const n: Sim = { ...s, step, fieldIndex: 0, editing: false, reviewScroll: 0, digitView: 0, lastErr: '' };
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

/* ── the Cardputer ── */
/* The keyboard as printed on the device, four rows of fourteen. The firmware
   reads the ` keycap as Esc and, with fn, ; . , / as the arrows; the drawing
   prints those as the keys' second legends and sends them directly. */
type KeyCap = { id: string; cap: string; sub?: string; key: Key | 'fn' | 'none'; w?: number };
const ROWS: KeyCap[][] = [
  [{ id: '`', cap: '`', sub: 'esc', key: { esc: true } }, ...'1234567890'.split('').map((c) => ({ id: c, cap: c, key: { ch: c } })), { id: '_', cap: '_', key: { ch: '_' } }, { id: '=', cap: '=', key: { ch: '=' } }, { id: 'del', cap: 'del', key: { del: true } }],
  [{ id: 'tab', cap: 'tab', key: { tab: true } }, ...'qwertyuiop'.split('').map((c) => ({ id: c, cap: c, key: { ch: c } })), { id: '[', cap: '[', key: { ch: '[' } }, { id: ']', cap: ']', key: { ch: ']' } }, { id: '\\', cap: '\\', key: { ch: '\\' } }],
  [{ id: 'fn', cap: 'fn', key: 'fn' }, { id: 'shift', cap: 'shift', key: 'none' }, ...'asdfghjkl'.split('').map((c) => ({ id: c, cap: c, key: { ch: c } })), { id: ';', cap: ';', sub: '↑', key: { up: true } }, { id: "'", cap: "'", key: { ch: "'" } }, { id: 'enter', cap: 'enter', key: { enter: true } }],
  [{ id: 'ctrl', cap: 'ctrl', key: 'none' }, { id: 'opt', cap: 'opt', key: 'none' }, { id: 'alt', cap: 'alt', key: 'none' }, ...'zxcvbnm'.split('').map((c) => ({ id: c, cap: c, key: { ch: c } })), { id: ',', cap: ',', sub: '←', key: { left: true } }, { id: '.', cap: '.', sub: '↓', key: { down: true } }, { id: '/', cap: '/', sub: '→', key: { right: true } }, { id: 'space', cap: 'space', key: { ch: ' ' } }],
];
/* the physical key that lights up for a key event */
const capFor = (k: Key, raw?: string): string => k.esc ? '`' : k.enter ? 'enter' : k.tab ? 'tab' : k.del ? 'del' : k.up ? ';' : k.down ? '.' : k.left ? ',' : k.right ? '/' : raw && raw.length === 1 ? raw.toLowerCase() : '';

/* The big keys beside the device: a cross of arrows, the three keys every
   screen uses, and the letters that do something, each with its job. */
const CLUSTER: Array<{ id: string; cap: string; sub?: string; key: Key; cls: string }> = [
  { id: 'up', cap: '↑', key: { up: true }, cls: 'u' }, { id: 'left', cap: '←', key: { left: true }, cls: 'l' }, { id: 'down', cap: '↓', key: { down: true }, cls: 'd' }, { id: 'right', cap: '→', key: { right: true }, cls: 'r' },
];
const SHORTCUTS: Array<{ cap: string; sub: string; key: Key }> = [
  { cap: 'Enter', sub: 'select', key: { enter: true } }, { cap: 'Esc', sub: 'back', key: { esc: true } }, { cap: 'Tab', sub: 'next control', key: { tab: true } },
  { cap: '+', sub: 'zoom in', key: { ch: '+' } }, { cap: '−', sub: 'zoom out', key: { ch: '-' } }, { cap: 'i', sub: 'info', key: { ch: 'i' } }, { cap: 'p', sub: 'preset, refresh', key: { ch: 'p' } },
  { cap: 'f', sub: 'find window', key: { ch: 'f' } }, { cap: 'd', sub: 'next digit', key: { ch: 'd' } }, { cap: 'r', sub: 'read again', key: { ch: 'r' } }, { cap: 't', sub: 'radio test', key: { ch: 't' } },
];

function Body() {
  // the device body: a Cardputer seen straight on, drawn in the page's own line
  return (
    <svg className="ck-body" viewBox="0 0 1000 640" aria-hidden="true">
      <defs>
        <linearGradient id="ck-shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#30302f" /><stop offset="1" stopColor="#161615" /></linearGradient>
        <linearGradient id="ck-bez" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0b0b" /><stop offset="1" stopColor="#040404" /></linearGradient>
      </defs>
      <rect x="1" y="1" width="998" height="638" rx="30" fill="url(#ck-shell)" stroke="#4a4846" />
      <rect x="6" y="6" width="988" height="628" rx="26" fill="none" stroke="#ffffff10" />
      <rect x="138" y="30" width="724" height="414" rx="12" fill="url(#ck-bez)" stroke="#3a3a3a" />
      <text x="40" y="58" fontSize="17" fontWeight="700" fill="#e0582b" fontFamily="Manrope, Arial, sans-serif" letterSpacing="2">M5STACK</text>
      <text x="40" y="78" fontSize="12" fill="#8a8580" fontFamily="Manrope, Arial, sans-serif" letterSpacing="1.5">CARDPUTER</text>
      <text x="960" y="58" fontSize="12" fill="#8a8580" fontFamily="Manrope, Arial, sans-serif" textAnchor="end" letterSpacing="1.5">ConfigKing</text>
      <circle cx="40" cy="420" r="6" fill="#111" stroke="#4a4846" />
      <circle cx="960" cy="420" r="6" fill="#111" stroke="#4a4846" />
      <rect x="30" y="456" width="940" height="170" rx="10" fill="#1d1d1c" stroke="#ffffff0a" />
    </svg>
  );
}

export default function ConfigKingSim({ scene = 'free', keys = true, className, large = false }: { scene?: SimScene; keys?: boolean; className?: string; large?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [sim, setSim] = useState<Sim>(() => preset(scene));
  const simRef = useRef(sim);
  simRef.current = sim;
  const timers = useRef<number[]>([]);
  const { active } = useFrame();
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState<string>('');
  const [fnHeld, setFnHeld] = useState(false);
  const litTimer = useRef(0);

  // A scripted scene replaces the state; the operator takes over from there.
  useEffect(() => { timers.current.forEach(clearTimeout); timers.current = []; setSim(preset(scene)); }, [scene]);
  useEffect(() => { if (!active) setArmed(false); }, [active]);

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

  const flash = useCallback((id: string) => {
    if (!id) return;
    setLit(id); window.clearTimeout(litTimer.current);
    litTimer.current = window.setTimeout(() => setLit(''), 160);
  }, []);
  const press = useCallback((k: Key, raw?: string) => {
    const withFn = fnHeld && (k.up || k.down || k.left || k.right) ? { ...k, fn: true } : k;
    if (fnHeld) setFnHeld(false);
    flash(capFor(k, raw));
    apply((s, later) => applyKey(s, withFn, later));
  }, [apply, fnHeld, flash]);

  // The reader's own keyboard, once they have clicked the device (so the page
  // keeps its arrow keys until then). Shift makes the arrow steps ×10, like fn.
  useEffect(() => {
    if (!keys || !active || !armed) return;
    const map: Record<string, Key> = { ArrowUp: { up: true }, ArrowDown: { down: true }, ArrowLeft: { left: true }, ArrowRight: { right: true }, Enter: { enter: true }, Escape: { esc: true }, Tab: { tab: true }, Backspace: { del: true } };
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      let k = map[e.key];
      if (!k && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) k = { ch: e.key };
      if (!k) return;
      e.preventDefault();
      press({ ...k, fn: e.shiftKey && Boolean(k.up || k.down || k.left || k.right) }, e.key);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [keys, active, armed, press]);

  // The screen is a touch screen: taps hit what is drawn, drags pan the picture.
  const drag = useRef<{ x: number; y: number; moved: boolean; id: number } | null>(null);
  const toScreen = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const onDown = (e: React.PointerEvent) => {
    if (!keys) return;
    setArmed(true);
    const p = toScreen(e);
    drag.current = { x: p.x, y: p.y, moved: false, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || d.id !== e.pointerId) return;
    const p = toScreen(e);
    const dx = p.x - d.x, dy = p.y - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 2.5) return;
    d.moved = true;
    const s = simRef.current;
    if (hasViewport(s)) {
      const v = s.vp;
      if (d.x >= v.view.x && d.x <= v.view.x + v.view.w && d.y >= v.view.y && d.y <= v.view.y + v.view.h) {
        apply((st) => ({ ...st, vp: panBy(st.vp, -dx, -dy) }));
        d.x = p.x; d.y = p.y;
      }
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.moved) return;
    const p = toScreen(e);
    for (let i = HITS.length - 1; i >= 0; i--) {
      const h = HITS[i];
      if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) {
        if (h.key) flash(capFor(h.key, h.key.ch));
        apply((s, later) => { const s2 = h.pre ? h.pre(s) : s; return h.key ? applyKey(s2, h.key, later) : s2; });
        return;
      }
    }
  };

  const capClick = (k: KeyCap) => {
    setArmed(true);
    if (k.key === 'fn') { setFnHeld((f) => !f); return; }
    if (k.key === 'none') { flash(k.id); return; }
    press(k.key, k.cap);
  };

  return (
    <div ref={box} className={`ck${large ? ' ck-large' : ''}${keys ? ' ck-live' : ''}${className ? ` ${className}` : ''}`} data-no-zoom>
      <div className="ck-dev" role="application" aria-label="ConfigKing simulator on a Cardputer. Click the screen or the keys, then use the arrow keys, Enter, Escape and Tab." tabIndex={keys ? 0 : -1} onFocus={() => { if (keys) setArmed(true); }}>
        <Body />
        <div className="ck-screenwrap">
          <canvas ref={canvas} className="ck-screen" width={W * 3} height={H * 3} aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }} />
          {keys && !armed && <div className="ck-hint" aria-hidden="true"><span>Tap the screen or a key to take over</span></div>}
        </div>
        <div className="ck-kb" aria-label="Cardputer keyboard">
          {ROWS.map((row, r) => (
            <div key={r} className="ck-kbrow">
              {row.map((k) => (
                <button key={k.id} type="button" tabIndex={-1} className={`ck-cap${lit === k.id ? ' lit' : ''}${k.key === 'fn' && fnHeld ? ' held' : ''}`} onClick={() => capClick(k)} aria-label={k.sub ? `${k.cap}, ${k.sub}` : k.cap}>
                  <span>{k.cap}</span>{k.sub && <small>{k.sub}</small>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {keys && (
        <div className="ck-cluster" aria-label="Keys">
          <div className="ck-dpad">
            {CLUSTER.map((k) => <button key={k.id} type="button" className={`ck-key ${k.cls}${lit === capFor(k.key) ? ' lit' : ''}`} onClick={() => { setArmed(true); press(k.key); }} aria-label={k.id}>{k.cap}</button>)}
          </div>
          <div className="ck-short">
            {SHORTCUTS.map((k) => <button key={k.cap} type="button" className={`ck-key${lit === capFor(k.key, k.key.ch) ? ' lit' : ''}`} onClick={() => { setArmed(true); press(k.key, k.key.ch); }}><b>{k.cap}</b><small>{k.sub}</small></button>)}
          </div>
          <p className="ck-tip">Shift with an arrow moves ×10. Drag the picture to pan it.</p>
        </div>
      )}
    </div>
  );
}

/* The device alone, for the chapter's cover: the discovery popup on screen. */
export function CardputerCover() {
  return <ConfigKingSim scene="nearby" keys={false} className="ck-cover" />;
}

export const CK_STYLE = `
  .ck { display: flex; gap: clamp(14px, 1.6vw, 28px); align-items: center; justify-content: center; width: min(var(--vw, 48vw), calc((100svh - var(--ws-nav, 0px) - 22svh) * 1.56)); }
  .ck.ck-live { width: min(92vw, calc((100svh - var(--ws-nav, 0px) - 26svh) * 2.05)); }
  .ck-dev { position: relative; flex: 1 1 0; width: 100%; min-width: 0; aspect-ratio: 1000 / 640; container-type: inline-size; outline: none; border-radius: 3cqw; }
  .ck-dev:focus-visible { box-shadow: 0 0 0 1px var(--ink, #d8cbb8); }
  .ck-body { position: absolute; inset: 0; width: 100%; height: 100%; display: block; filter: drop-shadow(0 30px 40px #000a); }
  .ck-screenwrap { position: absolute; left: 14.8%; top: 5.9%; width: 70.4%; height: 62.3%; border-radius: 0.6cqw; overflow: hidden; }
  .ck-screen { display: block; width: 100%; height: 100%; background: #000; touch-action: none; cursor: default; }
  .ck-live .ck-screen { cursor: pointer; }
  .ck-hint { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding: 0 0 2cqw; pointer-events: none; background: linear-gradient(to top, #000000b0, transparent 45%); }
  .ck-hint span { font: 500 1.5cqw/1.3 Manrope, Arial, sans-serif; color: #fff0db; letter-spacing: 0.04em; background: #181716e6; border: 1px solid #d8cbb84d; padding: 0.6cqw 1.2cqw; border-radius: 0.4cqw; }
  .ck-kb { position: absolute; left: 3.6%; top: 72%; width: 92.8%; height: 25.6%; display: grid; grid-template-rows: repeat(4, 1fr); gap: 0.6cqw; padding: 0.8cqw; }
  .ck-kbrow { display: grid; grid-template-columns: repeat(14, 1fr); gap: 0.6cqw; }
  .ck-cap { position: relative; min-width: 0; padding: 0; border: 1px solid #4a4846; border-top-color: #5c5a57; border-radius: 0.5cqw; background: linear-gradient(#3a3a3c, #2a2a2b); color: #e6e0d6; font: 500 1.45cqw/1 Manrope, Arial, sans-serif; cursor: pointer; transition: background 0.1s, transform 0.08s; -webkit-tap-highlight-color: transparent; }
  .ck-cap span { display: block; padding-top: 0.2cqw; }
  .ck-cap small { position: absolute; top: 0.3cqw; right: 0.5cqw; font-size: 0.95cqw; color: #ffa600; }
  .ck-cap:hover { background: linear-gradient(#4a4a4c, #383839); }
  .ck-cap:active, .ck-cap.lit { background: #d8cbb8; color: #181716; transform: translateY(1px); }
  .ck-cap.lit small { color: #181716; }
  .ck-cap.held { background: #ffa600; color: #181716; }
  .ck.ck-cover { width: 100%; }
  .ck-cover .ck-kb .ck-cap { pointer-events: none; }
  .ck-cover .ck-screen { pointer-events: none; }
  /* the big keys */
  .ck-cluster { flex: 0 0 auto; display: flex; flex-direction: column; gap: 14px; width: clamp(150px, 15vw, 230px); }
  .ck-dpad { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 5px; width: 100%; max-width: 160px; margin: 0 auto; }
  .ck-dpad .u { grid-column: 2; grid-row: 1; } .ck-dpad .l { grid-column: 1; grid-row: 2; } .ck-dpad .d { grid-column: 2; grid-row: 2; } .ck-dpad .r { grid-column: 3; grid-row: 2; }
  .ck-key { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 42px; padding: 6px 4px; border: 1px solid #d8cbb875; border-radius: 5px; background: #d8cbb80d; color: var(--ink, #d8cbb8); font: 500 16px/1 Manrope, Arial, sans-serif; cursor: pointer; transition: background 0.12s, color 0.12s, transform 0.08s; -webkit-tap-highlight-color: transparent; }
  .ck-key b { font-weight: 500; font-size: 15px; }
  .ck-key small { font: 400 9.5px/1.2 Manrope, Arial, sans-serif; color: #ada496; letter-spacing: 0.02em; }
  .ck-key:hover { background: #d8cbb822; color: #fff0db; }
  .ck-key:active, .ck-key.lit { background: #eee4d5; color: #28231e; transform: translateY(1px); }
  .ck-key.lit small, .ck-key:active small { color: #28231e; }
  .ck-short { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
  .ck-short .ck-key { min-height: 44px; }
  .ck-tip { margin: 0; font: 400 11px/1.4 Manrope, Arial, sans-serif; color: #7d766e; text-align: center; }
  @media (max-width: 900px) {
    .ck, .ck.ck-live { width: 92vw; flex-direction: column; gap: 12px; align-items: stretch; }
    .ck.ck-cover { width: 100%; }
    .ck-dev { flex: 0 0 auto; width: 100%; }
    .ck-cluster { width: 100%; flex-direction: row; flex-wrap: nowrap; justify-content: center; align-items: center; gap: 10px; }
    .ck-dpad { flex: 0 0 auto; width: 108px; margin: 0; gap: 3px; }
    .ck-dpad .ck-key { min-height: 32px; font-size: 14px; padding: 2px; }
    .ck-short { flex: 1 1 auto; grid-template-columns: repeat(4, 1fr); gap: 3px; }
    .ck-short .ck-key { min-height: 32px; padding: 3px 2px; gap: 0; }
    .ck-short .ck-key b { font-size: 12px; }
    .ck-short .ck-key small { font-size: 8px; }
    .ck-tip { display: none; }
  }
  @media (prefers-reduced-motion: reduce) { .ck-cap, .ck-key { transition: none; } }
`;
