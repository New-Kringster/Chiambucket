/*
  The Tab5 in 3D for the Pip hero.

  The frame is M5Stack's own Tab5 structure model (M5_Hardware, MIT licence,
  Products/C145_Tab5/Structures/Tab5.stl): only its outer frame is kept,
  centred and compressed into public/pip/tab5.glb. That file is the rear frame
  without a front or a back, so the glass front, the screen, the camera and the
  back plate are added here as simple shapes fitted to its measurements
  (128 x 80 x 12 mm, 4 mm corners; units are millimetres).

  The screen is two layers, as on the tablet: Mopi's real home picture
  (public/images/pip/mopi-home.webp, with the tablet's own status strip and
  name tag), and Pip on its own plane, drawn from a "stacked alpha" video
  (pip-layer: premultiplied colour on the left half, alpha on the right, made
  by drawing each frame of Pip's firmware animation over black and over
  white). One progress number poses the tablet: at 0 it sits turned to one
  side, by about 0.5 it faces us, by 1 its screen fills the view and the body
  has faded. Then setHandoff fades the home picture and flies the Pip plane to
  any rectangle on the page (the Meet Pip slot), so the same Pip carries on.
  Renders only while the hero is on screen.
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

export type Rect = { x: number; y: number; w: number; h: number };
export type Tab5Scene = {
  setProgress(p: number): void;
  /** fade: the home picture leaving (0..1); t: how far Pip has flown to `to` (0..1); opacity: Pip's own. */
  setHandoff(fade: number, t: number, to: Rect | null, opacity: number): void;
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
const MM = SCREEN_W / 1280;   // one screen pixel, mm
/* Pip's layer: an 800 x 720 box drawn at 520/720 scale, centred, its top 120 px down the screen
   (the tablet draws Pip 300 px tall with its feet at y 546). */
const PIP_W = 800 * (520 / 720) * MM, PIP_H = 520 * MM, PIP_Y = (360 - (120 + 260)) * MM;

/* Premultiplied colour from the left half, alpha from the right; output stays in display space,
   the way the tablet blends Pip over its picture. */
const PIP_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const PIP_FRAG = `uniform sampler2D map; uniform float opacity; varying vec2 vUv;
void main() {
  vec3 c = texture2D(map, vec2(vUv.x * 0.5, vUv.y)).rgb;
  float a = texture2D(map, vec2(0.5 + vUv.x * 0.5, vUv.y)).g;
  a = smoothstep(0.03, 0.97, a);
  gl_FragColor = vec4(min(c, vec3(a)) * opacity, a * opacity);
}`;

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

export function createTab5Scene(host: HTMLElement, opts: { video: HTMLVideoElement; wallpaper: string; still?: string; glb: string; onReady?: () => void }): Tab5Scene {
  let needs = true, pending = 2;   // ready once the model and the home picture have loaded
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

  // the screen: Mopi's home picture (with reduced motion, one still with Pip in it)
  const tex = new THREE.TextureLoader().load(opts.still ?? opts.wallpaper, () => { needs = true; pending--; if (!pending) opts.onReady?.(); });
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  const wallMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), wallMat);
  screen.position.set(SCREEN_X, 0, 0.47);
  tilt.add(screen);

  // Pip, its own plane over the picture. `anchor` marks where the tablet draws it.
  const pipTex = new THREE.VideoTexture(opts.video);
  pipTex.colorSpace = THREE.NoColorSpace;
  pipTex.minFilter = THREE.LinearFilter;
  pipTex.magFilter = THREE.LinearFilter;
  pipTex.generateMipmaps = false;
  const pipMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: pipTex }, opacity: { value: 1 } }, vertexShader: PIP_VERT, fragmentShader: PIP_FRAG,
    transparent: true, premultipliedAlpha: true, depthTest: false, depthWrite: false, toneMapped: false,
  });
  pipMat.blending = THREE.CustomBlending;
  pipMat.blendSrc = THREE.OneFactor;
  pipMat.blendDst = THREE.OneMinusSrcAlphaFactor;
  const pip = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), pipMat);
  pip.renderOrder = 10;
  pip.matrixAutoUpdate = false;
  pip.visible = !opts.still;
  scene.add(pip);
  const anchor = new THREE.Object3D();
  anchor.position.set(SCREEN_X, PIP_Y, 0.5);
  anchor.scale.set(PIP_W, PIP_H, 1);
  tilt.add(anchor);
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
    needs = true;
    pending--;
    if (!pending) opts.onReady?.();
  });

  let p = 0, px = 0, py = 0, aspect = 1, fade = 0, fly = 0, flyTo: Rect | null = null, pipOpacity = 1;
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

  const place = () => {
    const wide = aspect > 1.05;
    const turn = seg(p, 0.02, 0.5);
    const fill = seg(p, 0.3, 0.94);
    // start: beside the words on wide screens, under them on phones
    const d0 = wide ? distFor(W, 0.44, H, 0.62) : distFor(W, 0.78, H, 0.34);
    // the panel fits the view; the body has faded by then, so only the screen remains on the black page
    const d1 = distFor(SCREEN_W, wide ? 0.94 : 1.0, SCREEN_H, wide ? 0.86 : 1.0);
    const d = lerp(d0, d1, fill);
    const half = d * tanH();
    const x0 = wide ? half * aspect * 0.42 : 0;
    const y0 = wide ? -half * 0.02 : -half * 0.54;
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
    wallMat.opacity = 1 - fade;
    wallMat.visible = fade < 1;
    placePip();
  };

  /* Pip's plane: on the screen where the tablet draws it, or flown part or all of the way to a
     rectangle in the host's CSS pixels. The tablet faces the camera by the time Pip flies, so a
     rectangle at the plane's depth maps to world units by one scale. */
  const v = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  const placePip = () => {
    scene.updateMatrixWorld();
    anchor.matrixWorld.decompose(v, q, sc);
    pipMat.uniforms.opacity.value = pipOpacity;
    if (fly <= 0 || !flyTo) { pip.matrix.compose(v, q, sc); return; }
    const hw = host.clientWidth || 1, hh = host.clientHeight || 1;
    const k = hh / (2 * (camera.position.z - v.z) * tanH());   // CSS px per mm at Pip's depth
    const home: Rect = { x: hw / 2 + v.x * k - (sc.x * k) / 2, y: hh / 2 - v.y * k - (sc.y * k) / 2, w: sc.x * k, h: sc.y * k };
    const r2: Rect = { x: lerp(home.x, flyTo.x, fly), y: lerp(home.y, flyTo.y, fly), w: lerp(home.w, flyTo.w, fly), h: lerp(home.h, flyTo.h, fly) };
    v.set((r2.x + r2.w / 2 - hw / 2) / k, -(r2.y + r2.h / 2 - hh / 2) / k, v.z);
    sc.set(r2.w / k, r2.h / k, 1);
    pip.matrix.compose(v, q.identity(), sc);
  };

  resize();
  return {
    setProgress(v) { if (v !== p) { p = v; needs = true; } },
    setPointer(x, y) { px = x; py = y; needs = true; },
    setHandoff(f, t, to, o) { fade = f; fly = t; flyTo = to; pipOpacity = o; needs = true; },
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
      pipTex.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose()); }
      });
      renderer.domElement.remove();
    },
  };
}
