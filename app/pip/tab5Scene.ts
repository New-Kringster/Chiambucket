/*
  The Tab5 in 3D for the Pip hero.

  The frame is M5Stack's own Tab5 structure model (M5_Hardware, MIT licence,
  Products/C145_Tab5/Structures/Tab5.stl): only its outer frame is kept,
  centred and compressed into public/pip/tab5.glb. That file is the rear frame
  without a front or a back, so the glass front, the screen, the camera and the
  back plate are added here as simple shapes fitted to its measurements
  (128 x 80 x 12 mm, 4 mm corners; units are millimetres).

  The screen shows a video (Pip on its home screen). One progress number
  poses everything: at 0 the tablet sits turned to one side, by about 0.45 it
  faces us, and by 1 its screen fills the view, so the page can carry on from
  the screen's own black. Renders only while the hero is on screen.
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

export type Tab5Scene = {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  resize(): void;
  render(): void;
  destroy(): void;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const seg = (p: number, a: number, b: number) => smoother(clamp01((p - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Measurements, mm */
const W = 128, H = 80, D = 12, R = 4;
const SCREEN_W = 110.7, SCREEN_H = 62.3, SCREEN_X = -1.2;   // 5" 16:9 panel, a wider bezel on the camera side

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function slab(w: number, h: number, r: number, depth: number, bevel = 0.35) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, Math.max(0.5, r - bevel)), {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function createTab5Scene(host: HTMLElement, opts: { video: HTMLVideoElement; glb: string; onReady?: () => void }): Tab5Scene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.55;
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-120, 160, 220);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fe9ff, 0.9);   // a cool edge light, Pip's cyan
  rim.position.set(200, -60, -80);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(26, 1, 10, 4000);

  /* The device: a tilt group (pointer), inside a pose group (scroll). */
  const pose = new THREE.Group();
  const tilt = new THREE.Group();
  pose.add(tilt);
  scene.add(pose);

  const shell = new THREE.MeshStandardMaterial({ color: 0xb4b8bd, roughness: 0.46, metalness: 0.06, transparent: true });
  const back = new THREE.Mesh(slab(W - 1.2, H - 1.2, R - 0.4, 0.6), shell);
  back.position.z = -D + 0.9;
  tilt.add(back);

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x030304, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.7 });
  const glass = new THREE.Mesh(slab(W - 2.6, H - 2.6, R - 1, 0.5, 0.25), glassMat);
  glass.position.z = -0.05;
  tilt.add(glass);

  const tex = new THREE.VideoTexture(opts.video);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.position.set(SCREEN_X, 0, 0.47);
  tilt.add(screen);
  // a faint sheen over the screen so the glass reads as glass when it turns
  const sheenMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.04, transparent: true, opacity: 0.16, clearcoat: 1, depthWrite: false });
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(W - 3, H - 3), sheenMat);
  sheen.position.z = 0.5;
  tilt.add(sheen);

  const lens = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), new THREE.MeshPhysicalMaterial({ color: 0x0a0d14, roughness: 0.15, clearcoat: 1 }));
  lens.position.set(SCREEN_X + SCREEN_W / 2 + (W / 2 - (SCREEN_X + SCREEN_W / 2)) / 2 + 0.2, 0, 0.46);
  tilt.add(lens);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(opts.glb, (gltf) => {
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry = toCreasedNormals(m.geometry, (32 * Math.PI) / 180);
      m.material = shell;
    });
    tilt.add(gltf.scene);
    opts.onReady?.();
    needs = true;
  });

  let p = 0, px = 0, py = 0, needs = true, aspect = 1;
  const resize = () => {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    aspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    needs = true;
  };

  /* Where the camera stands so a width w (mm) takes a fraction f of the view's width, or height h of its height. */
  const tanH = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const distFor = (w: number, fw: number, h: number, fh: number) => Math.max(w / fw / (2 * tanH() * aspect), h / fh / (2 * tanH()));
  const coverFor = (w: number, h: number) => Math.min(w / (2 * tanH() * aspect), h / (2 * tanH()));

  const place = () => {
    const wide = aspect > 1.05;
    const turn = seg(p, 0.02, 0.5);
    const fill = seg(p, 0.3, 0.94);
    // start: beside the words on wide screens, under them on phones
    const d0 = wide ? distFor(W, 0.44, H, 0.62) : distFor(W, 0.86, H, 0.4);
    // end: the screen just past contain, so the grey frame has left the view
    // wide screens: the panel covers the view; tall ones: it fits the width (the rest is the screen's own black)
    const d1 = wide ? coverFor(SCREEN_W * 0.97, SCREEN_H * 0.97) : distFor(SCREEN_W, 1.04, SCREEN_H, 1.04);
    const d = lerp(d0, d1, fill);
    const half = d * tanH();
    const x0 = wide ? half * aspect * 0.42 : 0;
    const y0 = wide ? -half * 0.02 : -half * 0.36;
    pose.position.set(lerp(x0, -SCREEN_X, turn), lerp(y0, 0, turn), 0);
    pose.rotation.set(lerp(-0.3, 0, turn), lerp(wide ? -0.58 : -0.36, 0, turn), lerp(0.03, 0, turn));
    sheenMat.opacity = 0.16 * (1 - fill);
    glassMat.envMapIntensity = 0.7 * (1 - fill * 0.9);
    shell.envMapIntensity = 1 - fill * 0.8;
    // the body leaves as the screen takes over, so only Pip on black remains
    const gone = seg(p, 0.8, 0.97);
    shell.opacity = 1 - gone;
    glassMat.transparent = gone > 0;
    glassMat.opacity = 1 - gone;
    shell.visible = glassMat.visible = gone < 1;
    const calm = 1 - turn;
    tilt.rotation.set(py * 0.1 * calm, px * 0.16 * calm, 0);
    camera.position.set(0, 0, d);
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(1, d - 200);
    camera.far = d + 400;
    camera.updateProjectionMatrix();
  };

  resize();
  return {
    setProgress(v) { if (v !== p) { p = v; needs = true; } },
    setPointer(x, y) { px = x; py = y; needs = true; },
    resize,
    render() {
      // the video texture changes every frame it plays, so render whenever it is running
      if (!needs && opts.video.paused) return;
      needs = false;
      place();
      renderer.render(scene, camera);
    },
    destroy() {
      renderer.dispose();
      pmrem.dispose();
      env.dispose();
      tex.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose()); }
      });
      renderer.domElement.remove();
    },
  };
}
