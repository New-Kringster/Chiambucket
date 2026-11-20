/*
  Stack-chan LiDAR in 3D: the robot and the real scan it made.

  The robot is M5Stack's own models (M5_Hardware, MIT licence: K151_StackChan
  base, servo body and head shell, the K128 CoreS3, and U172 Unit ToF4M four
  times) put together in Blender by tools/stackchan-lidar/assemble.py, with
  the glass face, the sensor chips, the Grove sockets and the cables added
  there (public/stackchan-lidar/stackchan.glb, meshopt). Its nodes `yaw` and
  `pitch` are the two servos and `win0..3` are the four sensor chips.

  The cloud is Braven's scan from the demo video (stackchan-scan-9-dense.ply,
  68 206 points with the camera's colours) in public/stackchan-lidar/scan.bin:
  a u32 count, int16 x/y/z in mm in three.js axes (+Z forward, +Y up, origin
  the tilt servo), then u8 r/g/b, sorted in 4 degree columns from left to
  right (tools/stackchan-lidar/pack_scan.py), so revealing it in order fills
  the room in as the head pans across.

  Shots. setShot(name, t) sets where everything should be; a render loop
  eases the camera, the head, the reveal and the colour toward that with
  critically damped steps, so fast or jumpy scrolling still glides.
    meet     the robot close up, beside the title; at the end the camera
             swings round behind its shoulder
    sweep    the cloud fills in column by column while the head pans across,
             a cone from the sensors to the wall
    sensors  side view of the head, a beam from each of the four sensors
    colour   depth fades to the photos' colours as the view pulls back
    rest     the finished room turning slowly, behind the rest of the page
  setStory(q) runs meet, sweep, sensors and colour from one number (the
  homepage chapter). The loop runs only while setActive(true).
*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export type Shot = 'meet' | 'sweep' | 'sensors' | 'colour' | 'rest';
export type LidarScene = {
  ready: Promise<void>;
  setShot(shot: Shot, t: number): void;
  setStory(q: number): void;
  setActive(on: boolean): void;
  /** jump straight to the targets (no easing), for stills */
  settle(): void;
  resize(): void;
  destroy(): void;
};

export const BASE = '/stackchan-lidar/';
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const seg = (p: number, a: number, b: number) => smoother(clamp01((p - a) / (b - a)));
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const lerpV = (a: THREE.Vector3, b: THREE.Vector3, t: number) => a.clone().lerp(b, t);
const UP = new THREE.Vector3(0, 1, 0);

/* The infrared palette: depth runs from a pale warm white near the robot through amber and laser
   orange to a deep plum far away. */
export const DEPTH_GLSL = /* glsl */ `
  vec3 depthRamp(float r) {
    float t = clamp((r - 0.7) / 1.8, 0.0, 1.0);
    vec3 a = vec3(1.0, 0.94, 0.80), b = vec3(1.0, 0.69, 0.36), c = vec3(1.0, 0.36, 0.22), d = vec3(0.42, 0.12, 0.23);
    return t < 0.33 ? mix(a, b, t / 0.33) : t < 0.66 ? mix(b, c, (t - 0.33) / 0.33) : mix(c, d, (t - 0.66) / 0.34);
  }`;

const VERT = /* glsl */ `
  attribute float aOrder;
  attribute vec3 aPhoto;
  uniform float uReveal, uMix, uSize, uScale;
  varying vec3 vCol;
  varying float vFresh;
  ${DEPTH_GLSL}
  void main() {
    if (aOrder > uReveal) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
    vCol = mix(depthRamp(length(position)), aPhoto, uMix);
    vFresh = 1.0 - smoothstep(0.0, 0.03, uReveal - aOrder);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uScale / -mv.z, 1.0, 9.0) * (1.0 + vFresh * 0.7);
  }`;
const FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vFresh;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(vCol + vFresh * vec3(0.9, 0.45, 0.2), 1.0);
    #include <colorspace_fragment>
  }`;

/* A beam: a cone with its apex at the sensor, fading out along its length. */
const BEAM_VERT = /* glsl */ `
  varying float vL;
  void main() { vL = position.z; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const BEAM_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity, uFade;
  varying float vL;
  void main() {
    float a = uOpacity * (1.0 - smoothstep(uFade, 1.0, vL)) * smoothstep(0.0, 0.04, vL);
    gl_FragColor = vec4(uColor * a, a);
  }`;
function beam(halfAngleDeg: number, fade: number, color: number) {
  const g = new THREE.ConeGeometry(Math.tan(THREE.MathUtils.degToRad(halfAngleDeg)), 1, 48, 1, true);
  g.translate(0, -0.5, 0); g.rotateX(-Math.PI / 2);   // apex at the origin, opening along +Z, length 1
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uFade: { value: fade } },
    vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  return mesh;
}

/* Fixed camera poses, in metres around the robot (it faces +Z, the cloud's origin is its tilt servo). */
type Pose = { pos: THREE.Vector3; at: THREE.Vector3 };
const POSE: Record<string, Pose> = {
  front: { pos: V(0.2, 0.14, 0.36), at: V(0, 0.085, 0) },
  shoulder: { pos: V(0.15, 0.21, -0.3), at: V(-0.1, 0.13, 0.6) },
  room: { pos: V(0.5, 0.75, -1.5), at: V(0, 0.3, 0.6) },
  // the head in profile from its right, so the beams run off to the left of the screen, behind the caption
  side: { pos: V(0.42, 0.16, 0.02), at: V(0, 0.115, 0.075) },
  sideTall: { pos: V(0.5, 0.24, 0.04), at: V(0, 0.15, 0.015) },
  outside: { pos: V(-1.2, 1.9, -2.5), at: V(0, 0.62, 0.45) },
};

/* Camera moves swing round the robot's head instead of cutting straight through: the position is
   interpolated in spherical coordinates about HEAD (distance on a log scale, so a pull-out starts slowly),
   with `lift` raising it in the middle of the move like a crane. `dir` forces the way round (+1 or -1). */
const HEAD = V(0, 0.09, 0);
function arc(a: Pose, b: Pose, s: number, out: Pose, lift = 0, dir = 0) {
  const ra = a.pos.clone().sub(HEAD), rb = b.pos.clone().sub(HEAD);
  const la = ra.length(), lb = rb.length();
  const aza = Math.atan2(ra.x, ra.z), azb = Math.atan2(rb.x, rb.z);
  let d = azb - aza;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  if (dir > 0 && d < 0) d += Math.PI * 2;
  if (dir < 0 && d > 0) d -= Math.PI * 2;
  const ela = Math.asin(ra.y / la), elb = Math.asin(rb.y / lb);
  const r = la * Math.pow(lb / la, s), az = aza + d * s, el = ela + (elb - ela) * s + lift * Math.sin(Math.PI * s);
  out.pos.set(Math.sin(az) * Math.cos(el) * r, Math.sin(el) * r, Math.cos(az) * Math.cos(el) * r).add(HEAD);
  // mid-swing the aim leans toward the head, so the robot stays in shot while the camera moves round it
  out.at.lerpVectors(a.at, b.at, s).lerp(HEAD, 0.6 * Math.sin(Math.PI * s));
  return out;
}
/* a pose turned round the head by `da` radians (camera and aim together) and brought `k` times as close */
const turn = (p: Pose, da: number, k: number): Pose => ({
  pos: p.pos.clone().sub(HEAD).applyAxisAngle(UP, da).multiplyScalar(k).add(HEAD),
  at: p.at.clone().sub(HEAD).applyAxisAngle(UP, da).add(HEAD),
});
/* the slow orbit round the finished room behind the rest of the page */
const ORBIT_R = 3.1, ORBIT_START = -2.6;
const orbitPose = (a: number): Pose => ({ pos: V(Math.sin(a) * ORBIT_R, 1.9, Math.cos(a) * ORBIT_R * 0.85 + 0.3), at: POSE.outside.at.clone() });

export function createLidarScene(host: HTMLElement, layout: 'article' | 'home' = 'article'): LidarScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.5;
  const key = new THREE.DirectionalLight(0xfff1e2, 1.7); key.position.set(-0.6, 1.2, 1.0); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff9a5c, 1.1); rim.position.set(0.9, 0.5, -1.1); scene.add(rim);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 30);

  let robot: THREE.Object3D | null = null, yaw: THREE.Object3D | null = null, pitch: THREE.Object3D | null = null;
  let wins: THREE.Object3D[] = [];
  let pos: Int16Array | null = null, count = 0;
  const pivot = new THREE.Vector3();

  const uniforms = { uReveal: { value: 0 }, uMix: { value: 0 }, uSize: { value: 1.6 }, uScale: { value: 1 } };
  const cloud = new THREE.Points(new THREE.BufferGeometry(), new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }));
  cloud.frustumCulled = false;

  const cone = beam(10, 0.82, 0xff8a4c);         // the sensors' ~20 degree view during the sweep
  scene.add(cone);
  const beams = [0, 1, 2, 3].map(() => { const b = beam(0.45, 0.3, 0xffb15c); scene.add(b); return b; });
  const dotGeo = new THREE.SphereGeometry(0.014, 16, 12);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xfff0d6, transparent: true, opacity: 0 });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  scene.add(dot);

  /* what the loop eases toward (target) and where things are now (cur) */
  const target = { pos: POSE.front.pos.clone(), at: POSE.front.at.clone(), yaw: 0, pitch: -0.12, reveal: 0, mix: 0, cone: 0, beams: 0, ox: 0, oy: 0, len: 1.2, orbit: false };
  const cur = { pos: POSE.front.pos.clone(), at: POSE.front.at.clone(), yaw: 0, pitch: -0.12, reveal: 0, mix: 0, cone: 0, beams: 0, ox: 0, oy: 0, len: 1.2 };
  const vel = { pos: new THREE.Vector3(), at: new THREE.Vector3() };   // the camera's spring velocities
  let W = 1, H = 1, active = false, raf = 0, last = 0, orbitAngle = 0, clock = 0;

  /* where the robot sits beside the copy: right of centre on wide screens, above it on tall ones */
  const offsetFor = (amount: number) => {
    const wide = W / H > 1.1;
    target.ox = wide ? -0.2 * amount : 0;
    target.oy = wide ? 0.03 * amount : (layout === 'home' ? 0.16 : 0.24) * amount;
  };

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const ready = Promise.all([
    loader.loadAsync(BASE + 'stackchan.glb'),
    fetch(BASE + 'scan.bin').then((r) => r.arrayBuffer()),
  ]).then(([gltf, buf]) => {
    robot = gltf.scene;
    yaw = robot.getObjectByName('yaw') ?? null;
    pitch = robot.getObjectByName('pitch') ?? null;
    wins = ['win0', 'win1', 'win2', 'win3'].map((n) => robot!.getObjectByName(n)).filter(Boolean) as THREE.Object3D[];
    robot.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => { (mm as THREE.MeshStandardMaterial).envMapIntensity = 0.85; });
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

  /* over the robot's shoulder, turned with its head */
  const chase = (az: number): Pose => ({ pos: V(0.26, 0.21, -0.6).applyAxisAngle(UP, az), at: V(-0.16, 0.12, 0.7).applyAxisAngle(UP, az) });

  /* the newest point's direction and distance, for the head and the cone during the sweep */
  const newest = (reveal: number) => {
    if (!pos || !count) return { az: 0, r: 1.2 };
    const i = Math.max(0, Math.min(count - 1, Math.floor(reveal * count)));
    const x = pos[i * 3] / 1000, y = pos[i * 3 + 1] / 1000, z = pos[i * 3 + 2] / 1000;
    return { az: Math.atan2(x, z), r: Math.hypot(x, y, z) };
  };

  const api: LidarScene = {
    ready,
    setShot(shot, t) {
      if (shot === 'rest' && !target.orbit) orbitAngle = 0;   // the orbit starts where the colour chapter ends
      target.orbit = false;
      target.cone = 0; target.beams = 0;
      const tall = W / H < 0.9;
      const side = tall ? POSE.sideTall : POSE.side;
      const sideNear = turn(side, -0.42, 0.84);   // the sensors chapter drifts round towards the front
      if (shot === 'meet') {
        // a slow push in on the robot while it looks about, then the camera swings up and round behind its
        // shoulder as the head turns to where the sweep starts
        const s = seg(t, 0.4, 1);
        const a0 = newest(0).az;
        const near = turn(POSE.front, 0, 1.14 - 0.14 * seg(t, 0, 0.45));
        arc(near, chase(a0), s, target, 0.45);
        target.yaw = 0.45 * Math.sin(t * Math.PI * 1.5) * (1 - s) + a0 * s;
        target.pitch = -0.12 - 0.06 * s;
        target.reveal = 0; target.mix = 0;
        offsetFor(layout === 'home' ? 1 : 1 - seg(t, 0.25, 0.75));
      } else if (shot === 'sweep') {
        const s = seg(t, 0.04, 0.86);
        target.reveal = s;
        const n = newest(s);
        target.yaw = n.az;
        // over the shoulder, turned with the head (so the new points are always ahead), then a crane up
        // and back to see the whole room
        arc(chase(n.az), POSE.room, seg(t, 0.84, 1), target, 0.3);
        target.pitch = -(0.18 + 0.5 * (0.5 - 0.5 * Math.cos(s * Math.PI * 2 * 4)));   // a slow nod up and down as it pans
        target.len = n.r;
        target.cone = t > 0.02 && t < 0.86 ? 1 : 0;
        target.mix = 0;
        offsetFor(layout === 'home' ? 0.35 : 0.55);
      } else if (shot === 'sensors') {
        // a dive from the room down to the side of the head, then a slow drift round and in
        if (t < 0.32) arc(POSE.room, side, seg(t, 0, 0.32), target, 0.25);
        else arc(side, sideNear, seg(t, 0.32, 1), target);
        target.reveal = 1; target.mix = 0;
        target.yaw = 0; target.pitch = -0.1;
        target.beams = seg(t, 0.2, 0.4) * (1 - seg(t, 0.85, 1));
        offsetFor(layout === 'home' ? 0.25 : 0.3);
      } else if (shot === 'colour') {
        // the camera pulls out and swings round behind the robot until the whole room is in view, while the
        // depth colours fade into the photos'
        arc(sideNear, orbitPose(ORBIT_START), seg(t, 0, 0.85), target, 0.35, 1);
        target.reveal = 1; target.mix = seg(t, 0.3, 0.8);
        target.yaw = 0; target.pitch = -0.1;
        offsetFor(layout === 'home' ? 0.5 : 0.3);
      } else {
        target.reveal = 1; target.mix = 1; target.yaw = 0; target.pitch = -0.1;
        target.orbit = true;
        offsetFor(0);
      }
      kick();
    },
    setStory(q) {
      if (q < 0.1) api.setShot('meet', q / 0.1);
      else if (q < 0.52) api.setShot('sweep', (q - 0.1) / 0.42);
      else if (q < 0.75) api.setShot('sensors', (q - 0.52) / 0.23);
      else api.setShot('colour', (q - 0.75) / 0.25);
    },
    setActive(on) { active = on; if (on) kick(); },
    settle() {
      cur.pos.copy(target.pos); cur.at.copy(target.at); vel.pos.set(0, 0, 0); vel.at.set(0, 0, 0);
      cur.yaw = target.yaw; cur.pitch = target.pitch; cur.reveal = target.reveal; cur.mix = target.mix;
      cur.cone = target.cone; cur.beams = target.beams; cur.ox = target.ox; cur.oy = target.oy; cur.len = target.len;
      draw();
    },
    resize() {
      W = host.clientWidth || 1; H = host.clientHeight || 1;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.fov = W / H < 0.9 ? 50 : 36;
      camera.updateProjectionMatrix();
      uniforms.uScale.value = H * renderer.getPixelRatio() * 0.0042;
      kick();
    },
    destroy() {
      active = false; cancelAnimationFrame(raf);
      renderer.dispose(); pmrem.dispose(); env.dispose();
      cloud.geometry.dispose(); (cloud.material as THREE.Material).dispose();
      [cone, ...beams].forEach((b) => { b.geometry.dispose(); (b.material as THREE.Material).dispose(); });
      dotGeo.dispose(); dotMat.dispose();
      robot?.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose()); }
      });
      renderer.domElement.remove();
    },
  };

  /* ── the loop: ease cur toward target, then draw ── */
  const tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpW = new THREE.Vector3(), fwd = new THREE.Vector3();
  function draw() {
    if (!robot || !yaw || !pitch) return;
    // tall screens see less across, so the camera stands further back
    camera.position.copy(cur.pos);
    if (W / H < 0.9) camera.position.sub(cur.at).multiplyScalar(1.35).add(cur.at);
    // a little handheld drift, so the shot never sits dead still
    const d = camera.position.distanceTo(cur.at) * 0.012;
    camera.position.x += Math.sin(clock * 0.47) * d;
    camera.position.y += Math.sin(clock * 0.31 + 1.3) * d * 0.6;
    camera.lookAt(cur.at);
    if (Math.abs(cur.ox) + Math.abs(cur.oy) < 0.0005) camera.clearViewOffset();
    else camera.setViewOffset(W, H, cur.ox * W, cur.oy * H, W, H);
    yaw.rotation.y = cur.yaw; pitch.rotation.x = cur.pitch;
    robot.updateMatrixWorld(true);
    uniforms.uReveal.value = cur.reveal < 0.0005 ? -1 : cur.reveal;
    uniforms.uMix.value = cur.mix;
    // the cone and the beams come out of the sensor chips, along the way the head faces
    pitch.getWorldQuaternion(tmpQ);
    fwd.set(0, 0, 1).applyQuaternion(tmpQ);
    if (wins.length) {
      tmpV.set(0, 0, 0);
      wins.forEach((w) => tmpV.add(w.getWorldPosition(tmpW)));
      tmpV.multiplyScalar(1 / wins.length);
      cone.position.copy(tmpV); cone.quaternion.copy(tmpQ);
      cone.scale.setScalar(cur.len);
      (cone.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.22 * cur.cone;
      dot.position.copy(tmpV).addScaledVector(fwd, cur.len);
      dotMat.opacity = 0.9 * cur.cone;
      beams.forEach((b, k) => {
        if (!wins[k]) return;
        wins[k].getWorldPosition(b.position);
        b.quaternion.copy(tmpQ);
        b.scale.set(1, 1, 0.55);
        (b.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.6 * cur.beams;
      });
    }
    renderer.render(scene, camera);
  }
  function step(now: number) {
    raf = 0;
    if (!active) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    clock += dt;
    if (target.orbit) {
      orbitAngle += dt * 0.06;
      const o = orbitPose(ORBIT_START + orbitAngle);
      target.pos.copy(o.pos); target.at.copy(o.at);
    }
    // the camera rides a critically damped spring: it picks up speed into a move and settles out of it
    const w = 5.5;
    for (const k of ['pos', 'at'] as const) {
      tmpV.subVectors(target[k], cur[k]).multiplyScalar(w * w * dt).addScaledVector(vel[k], -2 * w * dt);
      vel[k].add(tmpV);
      cur[k].addScaledVector(vel[k], dt);
    }
    const kc = 1 - Math.exp(-dt * 3.2), kh = 1 - Math.exp(-dt * 4.5), kr = 1 - Math.exp(-dt * 5);
    cur.yaw += (target.yaw - cur.yaw) * kh; cur.pitch += (target.pitch - cur.pitch) * kh;
    cur.reveal += (target.reveal - cur.reveal) * kr; cur.mix += (target.mix - cur.mix) * kr;
    cur.cone += (target.cone - cur.cone) * kr; cur.beams += (target.beams - cur.beams) * kr;
    cur.ox += (target.ox - cur.ox) * kc; cur.oy += (target.oy - cur.oy) * kc;
    cur.len += (target.len - cur.len) * kh;
    draw();
    // keeps running while it shows: the camera always drifts a little
    raf = requestAnimationFrame(step);
  }
  function kick() { if (active && !raf) { last = 0; raf = requestAnimationFrame(step); } }

  return api;
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
