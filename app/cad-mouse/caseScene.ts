/*
  The viewport of the 3D CAD Mouse "Try it" section: the LoRA Messenger's case,
  the part that is open in Onshape in the demo video.

  The model is the real one. tools/cad-mouse/stl2glb.py takes the four parts
  exported from the public Onshape document "Brolocator case" (lid, button cap,
  base, board), seats the lid on the base, bakes creased normals and writes
  public/cad-mouse/brolocator.glb (meshopt, millimetres, long axis up).

  It is drawn the way Onshape draws a part: flat shading with dark edges on a
  light background. The view is three numbers, as in a CAD program: a turn, a
  slide and a zoom. Turns are about the screen's axes, which is what the
  Capsule sends, so a drag to the right always spins the case about the
  screen's vertical whichever way it already faces. Draws only when something
  changed.
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export type CaseScene = {
  /** Turn by a pointer movement in CSS pixels. */
  rotate(dx: number, dy: number): void;
  /** Slide by a pointer movement in CSS pixels. */
  pan(dx: number, dy: number): void;
  /** Multiply the zoom (above 1 zooms in). */
  zoom(factor: number): void;
  /** Back to the opening view. */
  fit(): void;
  /** The slow turn that plays until the reader takes over. */
  setAuto(on: boolean): void;
  resize(): void;
  destroy(): void;
};

type Opts = {
  glb: string;
  onReady?: () => void;
  onError?: () => void;
  /** Called with the degrees the automatic turn just moved, so the Capsule can follow it. */
  onAutoTurn?: (yaw: number, pitch: number) => void;
};

const DEG = Math.PI / 180;
const DEG_PER_PX = 0.4;
const FOV = 24;
const RADIUS = 96;            // the case fits in a sphere this big, mm
const ZOOM_MIN = 0.5, ZOOM_MAX = 6;
const COLOURS: Record<string, number> = { lid: 0xf08a1c, button: 0xc3c7cc, base: 0xb9d3e4, pcb: 0x3f7a62 };
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);

const home = () => new THREE.Quaternion().setFromAxisAngle(X, 16 * DEG).multiply(new THREE.Quaternion().setFromAxisAngle(Y, -30 * DEG));

export function createCaseScene(canvas: HTMLCanvasElement, opts: Opts): CaseScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 4 / 3, 10, 4000);
  const part = new THREE.Group();
  scene.add(part);
  // a light fixed to the view, like a CAD program's headlight, plus soft fill from above
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f99, 1.5));
  const head = new THREE.DirectionalLight(0xffffff, 1.9);
  head.position.set(-0.45, 0.7, 1);
  scene.add(head);

  // the little axes in the corner, turning with the part
  const triadScene = new THREE.Scene();
  const triadCam = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0, 10);
  triadCam.position.z = 5;
  const triad = new THREE.Group();
  ([[1, 0, 0, 0xe5484d], [0, 1, 0, 0x30a46c], [0, 0, 1, 0x3e63dd]] as const).forEach(([x, y, z, c]) => {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1, 8).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: c }));
    bar.quaternion.setFromUnitVectors(Y, new THREE.Vector3(x, y, z));
    triad.add(bar);
  });
  triadScene.add(triad);

  const q = home();
  const slide = new THREE.Vector2();
  let zoom = 1, w = 1, h = 1, dist = 500;
  let raf = 0, dirty = true, auto = false, autoT = 0, autoLast = 0, dead = false;
  let tween: null | { t0: number; q0: THREE.Quaternion; s0: THREE.Vector2; z0: number } = null;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mmPerPx = () => (2 * dist * Math.tan((FOV * DEG) / 2)) / (h * zoom);
  const turn = (yaw: number, pitch: number) => {
    q.premultiply(new THREE.Quaternion().setFromAxisAngle(Y, yaw * DEG));
    q.premultiply(new THREE.Quaternion().setFromAxisAngle(X, pitch * DEG));
    q.normalize();
  };

  const draw = () => {
    part.quaternion.copy(q);
    part.position.set(slide.x, slide.y, 0);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    triad.quaternion.copy(q);
    renderer.setViewport(0, 0, w, h);
    renderer.clear();
    renderer.render(scene, camera);
    const s = Math.round(Math.min(w, h) * 0.17);
    renderer.clearDepth();
    renderer.setViewport(Math.round(w * 0.025), Math.round(w * 0.025), s, s);
    renderer.render(triadScene, triadCam);
  };

  const frame = (now: number) => {
    raf = 0;
    if (dead) return;
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / 520), e = 1 - Math.pow(1 - k, 3);
      q.copy(tween.q0).slerp(home(), e);
      slide.copy(tween.s0).multiplyScalar(1 - e);
      zoom = tween.z0 + (1 - tween.z0) * e;
      if (k >= 1) tween = null;
      dirty = true;
    } else if (auto) {
      const dt = Math.min(0.05, (now - (autoLast || now)) / 1000);
      autoLast = now; autoT += dt;
      // sway about the opening view: the same angles on every pass, so it never drifts off
      const yaw = Math.cos(autoT * 0.7) * 34 * dt, pitch = Math.cos(autoT * 0.45 + 0.6) * 7 * dt;
      turn(yaw, pitch);
      opts.onAutoTurn?.(yaw, pitch);
      dirty = true;
    }
    if (dirty) { dirty = false; draw(); }
    if (tween || auto) raf = requestAnimationFrame(frame);
  };
  const kick = () => { dirty = true; if (!raf && !dead) raf = requestAnimationFrame(frame); };

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(opts.glb, (gltf) => {
    if (dead) return;
    const edge = new THREE.LineBasicMaterial({ color: 0x1b222c, transparent: true, opacity: 0.6 });
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = (m.material as THREE.Material).name;   // the GLB names each part's material: lid, button, base, pcb
      m.material = new THREE.MeshLambertMaterial({ color: COLOURS[name] ?? 0xcccccc, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      // the board's hundreds of holes would turn into a black smear of edges, so it goes without
      if (name !== 'pcb') m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 32), edge));
    });
    part.add(gltf.scene);
    kick();
    opts.onReady?.();
  }, undefined, () => opts.onError?.());

  const resize = () => {
    const el = canvas.parentElement ?? canvas;
    w = el.clientWidth || 1; h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // far enough back that the whole case fits, whichever side of the view is the short one
    const half = (FOV * DEG) / 2, halfW = Math.atan(Math.tan(half) * camera.aspect);
    dist = (RADIUS * 1.06) / Math.sin(Math.min(half, halfW));
    camera.position.set(0, 0, dist);
    kick();
  };
  resize();

  return {
    rotate(dx, dy) { tween = null; turn(dx * DEG_PER_PX, dy * DEG_PER_PX); kick(); },
    pan(dx, dy) { tween = null; const k = mmPerPx(); slide.x += dx * k; slide.y -= dy * k; kick(); },
    zoom(f) { tween = null; zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * f)); kick(); },
    fit() {
      if (still) { q.copy(home()); slide.set(0, 0); zoom = 1; tween = null; }
      else tween = { t0: performance.now(), q0: q.clone(), s0: slide.clone(), z0: zoom };
      kick();
    },
    setAuto(on) { auto = on && !still; autoLast = 0; if (auto) kick(); },
    resize,
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
      });
      renderer.dispose();
    },
  };
}
