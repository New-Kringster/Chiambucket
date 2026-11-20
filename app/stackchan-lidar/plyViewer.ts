/*
  The .ply playground: a point cloud you can turn, move, zoom and recolour.

  It opens on Braven's scan (public/stackchan-lidar/scan.bin, the same points
  as stackchan-scan-9-dense.ply, already in three.js axes) with Stack-chan
  drawn where it stood, and it reads any other .ply a reader drops on it:
  ascii or binary (little or big endian), x/y/z plus red/green/blue (or
  r/g/b) when present, any number type. Stack-chan writes its .ply files with
  x forward, y left and z up, so files are read as Z up by default; `upY`
  reads them as Y up instead (most other tools). A file is centred on its own
  bounds and the view fitted to it.

  Colour modes: 0 photo (the file's colours, or depth when it has none),
  1 depth (distance from the scanner), 2 height.

  Controls, like the viewer Stack-chan serves itself: drag turns, right-drag
  or two fingers move, the wheel or a pinch zooms towards the pointer, and a
  double click flies to the point under it. view('eye') puts the camera in
  Stack-chan's head looking out, view('home') goes back; both glide.
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BASE, DEPTH_GLSL } from './lidarScene';

export type PlyInfo = { name: string; points: number; size: [number, number, number]; hasColour: boolean; robot: boolean };
export type PlyViewer = {
  ready: Promise<PlyInfo>;
  open(file: File, upY: boolean): Promise<PlyInfo>;
  bundled(): Promise<PlyInfo>;
  setMode(m: 0 | 1 | 2): void;
  view(v: 'home' | 'eye'): void;
  resize(): void;
  setActive(on: boolean): void;
  destroy(): void;
};

const VERT = /* glsl */ `
  attribute vec3 aPhoto;
  uniform float uMode, uSize, uScale, uHasColour, uYmin, uYmax;
  uniform vec3 uOrigin;
  varying vec3 vCol;
  ${DEPTH_GLSL}
  vec3 heightRamp(float t) {
    return t < 0.5 ? mix(vec3(0.42, 0.12, 0.23), vec3(1.0, 0.45, 0.24), t / 0.5) : mix(vec3(1.0, 0.45, 0.24), vec3(1.0, 0.93, 0.78), (t - 0.5) / 0.5);
  }
  void main() {
    float h = (position.y - uYmin) / max(0.0001, uYmax - uYmin);
    vec3 depth = depthRamp(length(position - uOrigin));
    vCol = uMode < 0.5 ? (uHasColour > 0.5 ? aPhoto : depth) : uMode < 1.5 ? depth : heightRamp(clamp(h, 0.0, 1.0));
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uScale / -mv.z, 1.0, 14.0);
  }`;
const FRAG = /* glsl */ `
  varying vec3 vCol;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(vCol, 1.0);
    #include <colorspace_fragment>
  }`;

/* ── PLY reading ── */
type Prop = { name: string; type: string };
const SIZES: Record<string, number> = { char: 1, uchar: 1, int8: 1, uint8: 1, short: 2, ushort: 2, int16: 2, uint16: 2, int: 4, uint: 4, int32: 4, uint32: 4, float: 4, float32: 4, double: 8, float64: 8 };
function readNum(dv: DataView, o: number, t: string, le: boolean) {
  switch (t) {
    case 'char': case 'int8': return dv.getInt8(o);
    case 'uchar': case 'uint8': return dv.getUint8(o);
    case 'short': case 'int16': return dv.getInt16(o, le);
    case 'ushort': case 'uint16': return dv.getUint16(o, le);
    case 'int': case 'int32': return dv.getInt32(o, le);
    case 'uint': case 'uint32': return dv.getUint32(o, le);
    case 'float': case 'float32': return dv.getFloat32(o, le);
    default: return dv.getFloat64(o, le);
  }
}
export function parsePly(buf: ArrayBuffer, upY: boolean) {
  const head = new TextDecoder().decode(new Uint8Array(buf, 0, Math.min(buf.byteLength, 65536)));
  const end = head.indexOf('end_header');
  if (!head.startsWith('ply') || end < 0) throw new Error('This file does not look like a .ply point cloud.');
  const lines = head.slice(0, end).split(/\r?\n/);
  const format = (lines.find((l) => l.startsWith('format')) ?? '').split(/\s+/)[1];
  let n = 0, inVertex = false; const props: Prop[] = []; let before = 0, beforeAscii = 0, seenVertex = false;
  const elems: { name: string; count: number; props: Prop[] }[] = [];
  for (const l of lines) {
    const w = l.trim().split(/\s+/);
    if (w[0] === 'element') { elems.push({ name: w[1], count: +w[2], props: [] }); inVertex = w[1] === 'vertex'; if (inVertex) { n = +w[2]; seenVertex = true; } }
    else if (w[0] === 'property' && elems.length) {
      if (w[1] === 'list') throw new Error('Lists in the vertex data are not supported; export only the points.');
      const p = { name: w[2], type: w[1] }; elems[elems.length - 1].props.push(p); if (inVertex) props.push(p);
    }
  }
  // elements before the vertices (rare) would need skipping
  for (const e of elems) { if (e.name === 'vertex') break; if (!seenVertex) break; before += e.count * e.props.reduce((s, p) => s + SIZES[p.type], 0); beforeAscii += e.count; }
  const ix = props.findIndex((p) => p.name === 'x'), iy = props.findIndex((p) => p.name === 'y'), iz = props.findIndex((p) => p.name === 'z');
  if (ix < 0 || iy < 0 || iz < 0 || !n) throw new Error('No x, y and z found in this .ply.');
  const ir = props.findIndex((p) => p.name === 'red' || p.name === 'r'), ig = props.findIndex((p) => p.name === 'green' || p.name === 'g'), ib = props.findIndex((p) => p.name === 'blue' || p.name === 'b');
  const hasColour = ir >= 0 && ig >= 0 && ib >= 0;
  const colMax = hasColour && (props[ir].type.startsWith('float') || props[ir].type === 'double') ? 1 : 255;
  const P = new Float32Array(n * 3), C = new Float32Array(n * 3);
  const bodyStart = new TextEncoder().encode(head.slice(0, end + 'end_header'.length)).length + 1;
  const put = (i: number, x: number, y: number, z: number, r: number, g: number, b: number) => {
    // Z up (Stack-chan: x forward, y left) -> three.js; Y up files are taken as they are
    if (upY) { P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z; } else { P[i * 3] = -y; P[i * 3 + 1] = z; P[i * 3 + 2] = x; }
    const lin = (v: number) => { const s = v / colMax; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    C[i * 3] = lin(r); C[i * 3 + 1] = lin(g); C[i * 3 + 2] = lin(b);
  };
  if (format === 'ascii') {
    const text = new TextDecoder().decode(new Uint8Array(buf, bodyStart));
    const rows = text.split(/\r?\n/);
    for (let i = 0, k = beforeAscii; i < n && k < rows.length; k++) {
      const w = rows[k].trim(); if (!w) continue;
      const v = w.split(/\s+/).map(Number);
      put(i, v[ix], v[iy], v[iz], hasColour ? v[ir] : 0, hasColour ? v[ig] : 0, hasColour ? v[ib] : 0); i++;
    }
  } else {
    const le = format !== 'binary_big_endian';
    const offs: number[] = []; let stride = 0;
    for (const p of props) { offs.push(stride); stride += SIZES[p.type] ?? 4; }
    const dv = new DataView(buf, bodyStart + before);
    if (dv.byteLength < n * stride) throw new Error('This .ply ends before all its points.');
    for (let i = 0; i < n; i++) {
      const o = i * stride;
      const g = (k: number) => readNum(dv, o + offs[k], props[k].type, le);
      put(i, g(ix), g(iy), g(iz), hasColour ? g(ir) : 0, hasColour ? g(ig) : 0, hasColour ? g(ib) : 0);
    }
  }
  return { P, C, n, hasColour };
}

export function createPlyViewer(host: HTMLElement): PlyViewer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env; scene.environmentIntensity = 0.5;
  const key = new THREE.DirectionalLight(0xfff1e2, 1.6); key.position.set(-0.6, 1.2, 1.0); scene.add(key);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.005, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.zoomToCursor = true; controls.screenSpacePanning = true; controls.zoomSpeed = 1.2;

  const uniforms = {
    uMode: { value: 0 }, uSize: { value: 1.6 }, uScale: { value: 1 }, uHasColour: { value: 1 },
    uYmin: { value: 0 }, uYmax: { value: 1 }, uOrigin: { value: new THREE.Vector3() },
  };
  const geom = new THREE.BufferGeometry();
  const points = new THREE.Points(geom, new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }));
  points.frustumCulled = false;
  scene.add(points);

  let robot: THREE.Object3D | null = null, showRobot = false;
  let home = { pos: new THREE.Vector3(1.6, 1.8, -2.4), at: new THREE.Vector3(0, 0.6, 0.45) };
  let eye: typeof home | null = null;
  let active = false, raf = 0;

  /* a glide from where the camera is to a new position and aim, eased in and out */
  let glide: { p0: THREE.Vector3; a0: THREE.Vector3; p1: THREE.Vector3; a1: THREE.Vector3; t0: number; dur: number } | null = null;
  const flyTo = (pos: THREE.Vector3, at: THREE.Vector3, dur = 0.9) => {
    glide = { p0: camera.position.clone(), a0: controls.target.clone(), p1: pos.clone(), a1: at.clone(), t0: performance.now(), dur: dur * 1000 };
    kick();
  };
  controls.addEventListener('start', () => { glide = null; });

  /* a double click flies to the point under the pointer, keeping the same distance ratio */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const onDbl = (e: MouseEvent) => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.params.Points = { threshold: camera.position.distanceTo(controls.target) * 0.01 };
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(points)[0];
    if (!hit) return;
    const to = hit.point, off = camera.position.clone().sub(controls.target).multiplyScalar(0.45);
    flyTo(to.clone().add(off), to);
  };
  renderer.domElement.addEventListener('dblclick', onDbl);

  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  const robotP = loader.loadAsync(BASE + 'stackchan.glb').then((g) => { robot = g.scene; robot.visible = false; scene.add(robot); return robot; });

  const setCloud = (P: Float32Array, C: Float32Array, n: number, hasColour: boolean, origin: THREE.Vector3) => {
    geom.setAttribute('position', new THREE.BufferAttribute(P, 3));
    geom.setAttribute('aPhoto', new THREE.BufferAttribute(C, 3));
    geom.setDrawRange(0, n);
    geom.computeBoundingBox();
    const bb = geom.boundingBox!;
    uniforms.uYmin.value = bb.min.y; uniforms.uYmax.value = bb.max.y;
    uniforms.uHasColour.value = hasColour ? 1 : 0;
    uniforms.uOrigin.value.copy(origin);
    const size = bb.getSize(new THREE.Vector3());
    return { size, bb };
  };
  const fit = (bb: THREE.Box3) => {
    const c = bb.getCenter(new THREE.Vector3()), s = bb.getSize(new THREE.Vector3()).length();
    home = { pos: c.clone().add(new THREE.Vector3(0.45, 0.55, -0.7).normalize().multiplyScalar(s * 0.95)), at: c };
    controls.minDistance = s * 0.005; controls.maxDistance = s * 4;
    eye = null;
    jump();
  };
  const jump = () => { glide = null; camera.position.copy(home.pos); controls.target.copy(home.at); controls.update(); kick(); };

  const api: PlyViewer = {
    ready: Promise.resolve(null as unknown as PlyInfo),
    async bundled() {
      const [buf, bot] = await Promise.all([fetch(BASE + 'scan.bin').then((r) => r.arrayBuffer()), robotP]);
      const n = new Uint32Array(buf, 0, 1)[0];
      const q = new Int16Array(buf, 4, n * 3), rgb = new Uint8Array(buf, 4 + n * 6, n * 3);
      showRobot = true; bot.visible = true; bot.updateMatrixWorld(true);
      const pivot = new THREE.Vector3(); bot.getObjectByName('pitch')?.getWorldPosition(pivot);
      // Stack-chan's own view: from between its sensors, looking out where it looked at the middle of the scan
      const s0 = new THREE.Vector3(); bot.getObjectByName('sensor')?.getWorldPosition(s0);
      eye = { pos: s0.clone().add(new THREE.Vector3(0, 0, -0.02)), at: s0.clone().add(new THREE.Vector3(0, 0.12, 0.6)) };
      const P = new Float32Array(n * 3), C = new Float32Array(n * 3);
      const lin = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      for (let i = 0; i < n; i++) {
        P[i * 3] = q[i * 3] / 1000 + pivot.x; P[i * 3 + 1] = q[i * 3 + 1] / 1000 + pivot.y; P[i * 3 + 2] = q[i * 3 + 2] / 1000 + pivot.z;
        C[i * 3] = lin(rgb[i * 3]); C[i * 3 + 1] = lin(rgb[i * 3 + 1]); C[i * 3 + 2] = lin(rgb[i * 3 + 2]);
      }
      const { size } = setCloud(P, C, n, true, pivot);
      home = { pos: new THREE.Vector3(1.5, 1.9, -2.5), at: new THREE.Vector3(0, 0.62, 0.45) };
      controls.minDistance = 0.02; controls.maxDistance = 7;
      jump();
      return { name: 'stackchan-scan-9-dense.ply', points: n, size: [size.x, size.y, size.z], hasColour: true, robot: true };
    },
    async open(file, upY) {
      const buf = await file.arrayBuffer();
      const { P, C, n, hasColour } = parsePly(buf, upY);
      showRobot = false; if (robot) robot.visible = false;
      // the scanner sat at the file's origin; the view is fitted to the points' own bounds
      const { size, bb } = setCloud(P, C, n, hasColour, new THREE.Vector3());
      fit(bb);
      return { name: file.name, points: n, size: [size.x, size.y, size.z], hasColour, robot: false };
    },
    setMode(m) { uniforms.uMode.value = m; kick(); },
    view(v) { const to = v === 'eye' && eye ? eye : home; flyTo(to.pos, to.at, 1.1); },
    resize() {
      const w = host.clientWidth || 1, h = host.clientHeight || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      uniforms.uScale.value = h * renderer.getPixelRatio() * 0.0042;
      kick();
    },
    setActive(on) { active = on; kick(); },
    destroy() {
      active = false; cancelAnimationFrame(raf); controls.dispose(); renderer.domElement.removeEventListener('dblclick', onDbl);
      renderer.dispose(); pmrem.dispose(); env.dispose(); geom.dispose(); (points.material as THREE.Material).dispose();
      robot?.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose()); } });
      renderer.domElement.remove();
    },
  };
  /* render while active: the controls ease after a drag and may spin */
  const loop = () => {
    raf = 0; if (!active) return;
    if (glide) {
      const k = Math.min(1, (performance.now() - glide.t0) / glide.dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.lerpVectors(glide.p0, glide.p1, e); controls.target.lerpVectors(glide.a0, glide.a1, e);
      if (k >= 1) glide = null;
    }
    controls.update();
    // inside its head the robot would block the view, so it hides while the camera is there
    if (robot && showRobot) robot.visible = !eye || camera.position.distanceTo(eye.pos) > 0.09;
    renderer.render(scene, camera); raf = requestAnimationFrame(loop);
  };
  function kick() { if (active && !raf) raf = requestAnimationFrame(loop); else if (!active) { controls.update(); renderer.render(scene, camera); } }
  return api;
}
