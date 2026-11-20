/*
  Stack-chan LiDAR in 3D: the robot and the real scan it made.

  The robot is M5Stack's own models (M5_Hardware, MIT licence: K151_StackChan
  base, servo body and head shell, the K128 CoreS3, and U172 Unit ToF4M four
  times) put together in Blender, with the screen face, the Grove sockets and
  the cables added there (public/stackchan-lidar/stackchan.glb, meshopt). Its
  nodes `yaw` and `pitch` are the two servos, so the head turns and tips like
  the real one; `tof0..3` are the four sensors.

  The cloud is Braven's scan from the demo video (stackchan-scan-9-dense.ply,
  68 206 points with the camera's colours), stored in
  public/stackchan-lidar/scan.bin as a u32 count, then int16 x/y/z in mm and
  u8 r/g/b, already in three.js axes (+Z forward, +Y up) with its origin at
  the tilt servo, and sorted in the order the head sweeps: columns of 4
  degrees left to right, up one column and down the next.

  Two ways to drive it:
  - setStory(q, colour): one number 0..1 runs the whole story: the cloud
    builds as the head sweeps (the head always looks at the newest point and
    a 20 degree cone shows the sensors' view), the camera closes in on the
    four sensors, then pulls back while the colour fades from depth to the
    photos. Used by the homepage chapter and the article's hero.
  - explore(): orbit controls over the finished cloud, for the article's
    "explore the scan" section, with setColour(0..1).
  Renders only on demand (render()) or, in explore mode, while the reader is
  moving it.
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type LidarScene = {
  ready: Promise<void>;
  setStory(q: number): void;
  setColour(mix: number): void;
  explore(onMove?: () => void): void;
  resize(): void;
  render(): void;
  destroy(): void;
};

const BASE = '/stackchan-lidar/';
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const seg = (p: number, a: number, b: number) => smoother(clamp01((p - a) / (b - a)));
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/* The story's camera, as (position, target) at points along q. */
const SHOTS: { q: number; pos: THREE.Vector3; at: THREE.Vector3 }[] = [
  { q: 0.0, pos: V(0.19, 0.17, 0.4), at: V(0, 0.095, 0) },
  { q: 0.1, pos: V(0.24, 0.2, 0.36), at: V(0, 0.1, 0) },
  { q: 0.32, pos: V(-0.42, 0.34, -0.5), at: V(0, 0.3, 0.9) },
  { q: 0.5, pos: V(0.1, 0.95, -2.0), at: V(0, 0.55, 0.5) },
  { q: 0.6, pos: V(0.12, 0.16, 0.24), at: V(0, 0.125, 0) },
  { q: 0.7, pos: V(0.14, 0.17, 0.26), at: V(0, 0.125, 0.02) },
  { q: 0.86, pos: V(-0.9, 1.7, -2.4), at: V(0, 0.65, 0.45) },
  { q: 1.0, pos: V(1.1, 1.75, -2.3), at: V(0, 0.65, 0.45) },
];
const REVEAL = [0.1, 0.5] as const;   // the sweep
const RAYS = [0.56, 0.74] as const;    // the four sensors' rays
const COLOUR = [0.76, 0.92] as const;  // depth to photo colour

function shotAt(q: number, pos: THREE.Vector3, at: THREE.Vector3) {
  let i = 0;
  while (i < SHOTS.length - 2 && q > SHOTS[i + 1].q) i++;
  const a = SHOTS[i], b = SHOTS[i + 1];
  const t = smoother(clamp01((q - a.q) / (b.q - a.q)));
  pos.lerpVectors(a.pos, b.pos, t);
  at.lerpVectors(a.at, b.at, t);
}

const VERT = /* glsl */ `
  attribute float aOrder;
  attribute vec3 aPhoto;
  uniform float uReveal, uMix, uSize, uScale;
  varying vec3 vCol;
  varying float vFresh;
  void main() {
    if (aOrder > uReveal) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
    float r = length(position);
    // depth: near points pale mint, far ones deep teal (like the robot's own viewer, toned to the page)
    float t = clamp((r - 0.8) / 1.7, 0.0, 1.0);
    vec3 depth = mix(vec3(0.72, 1.0, 0.86), vec3(0.05, 0.42, 0.36), t);
    vCol = mix(depth, aPhoto, uMix);
    vFresh = 1.0 - smoothstep(0.0, 0.025, uReveal - aOrder);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uScale / -mv.z, 1.0, 9.0) * (1.0 + vFresh * 0.8);
  }`;
const FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vFresh;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(vCol + vFresh * vec3(0.55, 0.9, 0.75), 1.0);
    #include <colorspace_fragment>
  }`;

/** article: the robot sits beside the title at first, then centred. home: the homepage chapter, whose
    captions sit at the left (at the foot on phones), so the view stays shifted the other way throughout. */
export function createLidarScene(host: HTMLElement, layout: 'article' | 'home' = 'article'): LidarScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.55;
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-0.6, 1.2, 1.0); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fe8d0, 0.9); rim.position.set(0.8, 0.6, -1.2); scene.add(rim);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 30);
  const camPos = new THREE.Vector3(), camAt = new THREE.Vector3();

  let robot: THREE.Object3D | null = null, yaw: THREE.Object3D | null = null, pitch: THREE.Object3D | null = null;
  let sensors: THREE.Object3D[] = [];
  let pos: Int16Array | null = null, count = 0;
  const pivot = new THREE.Vector3();

  const uniforms = { uReveal: { value: 1 }, uMix: { value: 0 }, uSize: { value: 1.6 }, uScale: { value: 1 } };
  const cloud = new THREE.Points(new THREE.BufferGeometry(), new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }));
  cloud.frustumCulled = false;

  // the sensors' view: a 20 degree cone from the array to the newest point
  const coneGeo = new THREE.ConeGeometry(Math.tan(THREE.MathUtils.degToRad(10)), 1, 40, 1, true);
  coneGeo.translate(0, -0.5, 0); coneGeo.rotateX(-Math.PI / 2);   // apex at the origin, opening along +Z
  const coneMat = new THREE.MeshBasicMaterial({ color: 0x8ff5cf, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  scene.add(cone);
  const rayMat = new THREE.LineBasicMaterial({ color: 0xbaffe4, transparent: true, opacity: 0 });
  const rays = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(24), 3)), rayMat);
  rays.frustumCulled = false;
  scene.add(rays);
  const dotGeo = new THREE.SphereGeometry(0.012, 16, 12);
  const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xd9fff0, transparent: true, opacity: 0 }));
  scene.add(dot);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const ready = Promise.all([
    loader.loadAsync(BASE + 'stackchan.glb'),
    fetch(BASE + 'scan.bin').then((r) => r.arrayBuffer()),
  ]).then(([gltf, buf]) => {
    robot = gltf.scene;
    yaw = robot.getObjectByName('yaw') ?? null;
    pitch = robot.getObjectByName('pitch') ?? null;
    sensors = ['tof0', 'tof1', 'tof2', 'tof3'].map((n) => robot!.getObjectByName(n)).filter(Boolean) as THREE.Object3D[];
    robot.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => { (mm as THREE.MeshStandardMaterial).envMapIntensity = 0.9; });
    });
    scene.add(robot);
    robot.updateMatrixWorld(true);
    if (pitch) pitch.getWorldPosition(pivot);

    count = new Uint32Array(buf, 0, 1)[0];
    pos = new Int16Array(buf, 4, count * 3);
    const rgb = new Uint8Array(buf, 4 + count * 6, count * 3);
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3), o = new Float32Array(count);
    const lin = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    for (let i = 0; i < count * 3; i++) { p[i] = pos[i] / 1000; c[i] = lin(rgb[i]); }
    for (let i = 0; i < count; i++) o[i] = (i + 1) / count;
    const g = cloud.geometry;
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aPhoto', new THREE.BufferAttribute(c, 3));
    g.setAttribute('aOrder', new THREE.BufferAttribute(o, 1));
    cloud.position.copy(pivot);
    scene.add(cloud);
  });

  /* Point the head at a point of the cloud (in the cloud's own frame). */
  const aimAt = (x: number, y: number, z: number, t = 1) => {
    if (!yaw || !pitch) return;
    const az = Math.atan2(x, z), el = Math.atan2(y, Math.hypot(x, z));
    yaw.rotation.y += (az - yaw.rotation.y) * t;
    pitch.rotation.x += (-el - pitch.rotation.x) * t;
  };
  const sensorWorld = new THREE.Vector3(), tmp = new THREE.Vector3(), tip = new THREE.Vector3();

  let controls: OrbitControls | null = null;
  let W = 1, H = 1;
  /* While the title is up, the robot sits beside it: right of centre on wide
     screens, above it on tall ones. f is how much of that shift applies. */
  const frame = (f: number) => {
    const wide = W / H > 1.1;
    const ox = wide ? (layout === 'home' ? -0.21 : -0.2) * f : 0;
    const oy = wide ? 0.04 * f : (layout === 'home' ? 0.16 : 0.2) * f;
    if (f <= 0.0001) camera.clearViewOffset(); else camera.setViewOffset(W, H, ox * W, oy * H, W, H);
  };

  const api: LidarScene = {
    ready,
    setStory(q) {
      if (!pos || !robot) return;
      shotAt(q, camPos, camAt);
      camera.position.copy(camPos); camera.lookAt(camAt);
      frame(layout === 'home' ? 1 : 1 - seg(q, 0.03, 0.16));
      const reveal = q < REVEAL[0] ? 0 : seg(q, REVEAL[0], REVEAL[1]) * 0.999 + 0.001;
      uniforms.uReveal.value = q < REVEAL[0] ? -1 : reveal;
      uniforms.uMix.value = seg(q, COLOUR[0], COLOUR[1]);
      // the head looks at the newest point while it sweeps, then settles facing forward
      const settle = seg(q, REVEAL[1], REVEAL[1] + 0.05);
      const idle = q < REVEAL[0];
      const i = Math.min(count - 1, Math.floor(reveal * count));
      if (idle) {
        aimAt(Math.sin(q * 30) * 0.4, 0.15, 1, 1);
      } else {
        const x = pos[i * 3] / 1000, y = pos[i * 3 + 1] / 1000, z = pos[i * 3 + 2] / 1000;
        if (yaw && pitch) {
          yaw.rotation.y = Math.atan2(x, z) * (1 - settle);
          pitch.rotation.x = -Math.atan2(y, Math.hypot(x, z)) * (1 - settle) - 0.18 * settle;
        }
        tip.set(x, y, z).add(pivot);
      }
      robot.updateMatrixWorld(true);
      // the sensors' cone, only while the sweep runs
      const sweeping = !idle && q < REVEAL[1];
      coneMat.opacity = sweeping ? 0.16 * seg(q, REVEAL[0], REVEAL[0] + 0.02) : 0;
      dot.material.opacity = sweeping ? 0.9 : 0;
      if (sweeping && sensors.length) {
        sensors[0].getWorldPosition(sensorWorld);
        for (let k = 1; k < sensors.length; k++) sensorWorld.add(sensors[k].getWorldPosition(tmp));
        sensorWorld.multiplyScalar(1 / sensors.length);
        cone.position.copy(sensorWorld);
        cone.lookAt(tip);
        cone.scale.setScalar(sensorWorld.distanceTo(tip));
        dot.position.copy(tip);
      }
      // four rays, one from each sensor to the same spot on the wall ahead
      const r = seg(q, RAYS[0], RAYS[0] + 0.03) * (1 - seg(q, RAYS[1] - 0.03, RAYS[1]));
      rayMat.opacity = r * 0.85;
      if (r > 0 && sensors.length === 4) {
        const target = tmp.set(0, 0.06, 1.1).add(pivot);
        const arr = rays.geometry.getAttribute('position') as THREE.BufferAttribute;
        sensors.forEach((s, k) => {
          s.getWorldPosition(sensorWorld);
          arr.setXYZ(k * 2, sensorWorld.x, sensorWorld.y, sensorWorld.z);
          arr.setXYZ(k * 2 + 1, target.x, target.y, target.z);
        });
        arr.needsUpdate = true;
      }
      api.render();
    },
    setColour(mix) { uniforms.uMix.value = mix; api.render(); },
    explore(onMove) {
      uniforms.uReveal.value = 1;
      if (yaw && pitch) { yaw.rotation.y = 0; pitch.rotation.x = -0.18; }
      coneMat.opacity = 0; rayMat.opacity = 0; dot.material.opacity = 0;
      camera.position.set(0.9, 1.5, -2.2);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.6, 0.4);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 0.3; controls.maxDistance = 5;
      controls.enablePan = false;
      controls.addEventListener('change', () => { renderer.render(scene, camera); onMove?.(); });
      controls.update();
      api.render();
    },
    resize() {
      const w = host.clientWidth || 1, h = host.clientHeight || 1;
      W = w; H = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 0.9 ? 52 : 38;
      camera.updateProjectionMatrix();
      uniforms.uScale.value = h * renderer.getPixelRatio() * 0.0042;
      api.render();
    },
    render() {
      controls?.update();
      renderer.render(scene, camera);
    },
    destroy() {
      controls?.dispose();
      renderer.dispose(); pmrem.dispose(); env.dispose();
      cloud.geometry.dispose(); (cloud.material as THREE.Material).dispose();
      coneGeo.dispose(); coneMat.dispose(); rays.geometry.dispose(); rayMat.dispose(); dotGeo.dispose();
      robot?.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose()); }
      });
      renderer.domElement.remove();
    },
  };
  return api;
}

/** The controls of explore mode want to keep easing after a drag: call this every frame while it matters. */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
