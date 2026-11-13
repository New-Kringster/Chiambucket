/* ────────────────────────────────────────────────────────────────
   The OCR Reader set piece: the real board and case (public/waterslop/*.glb,
   exported from KiCad and Onshape for the /waterslop article) drawn with
   three.js and posed by one number, the scroll progress p in [0, 1].

   Rendering is on demand: a frame is drawn only when p, the size or the
   loading state changes, so nothing runs while the page is idle.
   The board surface shader is a trimmed copy of the one in
   app/waterslop/chapter/scene.js (KiCad layers baked into board-layers.webp).
   ──────────────────────────────────────────────────────────────── */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const BASE = '/waterslop/';
// The PCB outline in the assembly frame, in millimetres (board-frame.js).
const BOARD = { center: [0.1729, -0.2611], layerSize: [25.2984, 54.9656] };
const SHELL_OFFSET = [0.2225, 2.7544, -2.5709];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of p through [a, b], eased. */
/** Progress of p through [a, b], eased with smootherstep: velocity and
    acceleration are both zero at the ends, so no motion starts or stops dead. */
const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

type Shader = { uniforms: Record<string, { value: unknown }>; vertexShader: string; fragmentShader: string };

const occlusionChunk = /* glsl */ `
  reflectedLight.indirectDiffuse *= wsOcclusion;
  reflectedLight.indirectSpecular *= wsOcclusion;
  reflectedLight.directDiffuse *= mix(1.0, wsOcclusion, 0.6);
  reflectedLight.directSpecular *= mix(1.0, wsOcclusion, 0.6);
`;

function useVertexOcclusion(shader: Shader) {
  shader.vertexShader = `attribute float ao;\nvarying float vWsAO;\n${shader.vertexShader}`.replace(
    '#include <begin_vertex>', '#include <begin_vertex>\nvWsAO = ao;');
  shader.fragmentShader = `varying float vWsAO;\n${shader.fragmentShader}`.replace(
    '#include <aomap_fragment>', `#include <aomap_fragment>\nfloat wsOcclusion = vWsAO;\n${occlusionChunk}`);
}

function useBoardSurface(shader: Shader, uniforms: Record<string, { value: unknown }>) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = `varying vec3 vBoardPos;\nvarying float vBoardNz;\n${shader.vertexShader}`.replace(
    '#include <begin_vertex>', '#include <begin_vertex>\nvBoardPos = position;\nvBoardNz = objectNormal.z;');
  shader.fragmentShader = /* glsl */ `
    uniform sampler2D wsLayers; uniform sampler2D wsBoardAO;
    uniform vec2 wsBoardMin; uniform vec2 wsBoardSize;
    uniform vec3 wsMaskBare; uniform vec3 wsMaskCopper; uniform vec3 wsGold;
    uniform vec3 wsSubstrate; uniform vec3 wsEdge; uniform vec3 wsSilk; uniform vec3 wsPlating;
    varying vec3 vBoardPos; varying float vBoardNz;
    float wsCover(float v) { float w = clamp(fwidth(v) * 0.7, 0.02, 0.5); return smoothstep(0.5 - w, 0.5 + w, v); }
    ${shader.fragmentShader}`
    .replace('#include <color_fragment>', /* glsl */ `#include <color_fragment>
      vec2 wsUv = (vBoardPos.xy - wsBoardMin) / wsBoardSize;
      float wsFront = step(0.0, vBoardNz);
      bool wsFace = abs(vBoardNz) > 0.5;
      vec2 wsAtlas = vec2(clamp(wsUv.x, 0.001, 0.999) * 0.5 + (1.0 - wsFront) * 0.5, wsUv.y);
      vec3 wsL = texture2D(wsLayers, wsAtlas).rgb;
      vec3 wsA = texture2D(wsBoardAO, wsUv).rgb;
      float wsCopper = wsCover(wsL.r); float wsOpen = wsCover(wsL.g);
      float wsSilkCover = wsCover(wsL.b); float wsHole = wsCover(wsA.b);
      float wsOcclusion = mix(wsA.g, wsA.r, wsFront);
      vec3 wsColour = mix(wsMaskBare, wsMaskCopper, wsCopper);
      wsColour = mix(wsColour, wsSubstrate, wsOpen * (1.0 - wsCopper));
      wsColour = mix(wsColour, wsGold, wsOpen * wsCopper);
      wsColour = mix(wsColour, wsSilk, wsSilkCover);
      wsColour = mix(wsColour, vec3(0.003), wsHole);
      float wsMetal = 0.7 * wsOpen * wsCopper * (1.0 - wsHole);
      float wsRough = mix(mix(0.5, 0.28, wsOpen * wsCopper), 0.85, wsSilkCover);
      if (!wsFace) {
        vec2 wsEdgeDistance = min(wsUv, 1.0 - wsUv) * wsBoardSize;
        float wsOuter = step(min(wsEdgeDistance.x, wsEdgeDistance.y), 0.3);
        wsColour = mix(wsPlating, wsEdge, wsOuter);
        wsMetal = 1.0 - wsOuter; wsRough = mix(0.34, 0.72, wsOuter);
        wsOcclusion = mix(0.4, 1.0, wsOuter);
      }
      diffuseColor.rgb *= wsColour;`)
    .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = wsRough;')
    .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor *= wsMetal;')
    .replace('#include <aomap_fragment>', `#include <aomap_fragment>\n${occlusionChunk}`);
}

/** Dequantize a glTF mesh into float geometry in the assembly frame. */
function bake(mesh: THREE.Mesh) {
  const src = mesh.geometry, g = new THREE.BufferGeometry();
  for (const [name, attr] of Object.entries(src.attributes)) {
    if (!['position', 'normal', '_ao', 'ao', 'color'].includes(name)) continue;
    const a = attr as THREE.BufferAttribute, size = a.itemSize, out = new Float32Array(a.count * size);
    for (let i = 0; i < a.count; i++) for (let k = 0; k < size; k++) out[i * size + k] = a.getComponent(i, k);
    g.setAttribute(name === '_ao' ? 'ao' : name, new THREE.BufferAttribute(out, size));
  }
  if (src.index) g.setIndex(src.index.clone());
  g.applyMatrix4(mesh.matrixWorld);
  return g;
}

export type ReaderScene = {
  setProgress: (p: number) => void;
  jump: (p: number) => void;
  resize: () => void;
  dispose: () => void;
};

export async function createReaderScene(host: HTMLElement, opts: { compact: boolean }): Promise<ReaderScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, opts.compact ? 1.5 : 1.75));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 1, 2000);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.02);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.55;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3630, 0.35));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.4); key.position.set(-60, 90, 120); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe6c98a, 2.2); rim.position.set(80, -40, -90); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xcfe0f0, 0.5); fill.position.set(90, 10, 60); scene.add(fill);

  // rig: the whole reader; content is centred on the board so it turns about its middle.
  const rig = new THREE.Group();
  const content = new THREE.Group();
  content.position.set(-BOARD.center[0], -BOARD.center[1], 0);
  rig.add(content);
  scene.add(rig);

  const tex = new THREE.TextureLoader();
  const data = async (name: string) => {
    const t = await tex.loadAsync(BASE + name);
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  };
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [gltf, layers, ao, bm, tm] = await Promise.all([
    loader.loadAsync(BASE + 'board.glb'),
    data('board-layers.webp'),
    data('board-ao.webp'),
    loader.loadAsync(BASE + 'shell-bottom.glb'),
    loader.loadAsync(BASE + 'shell-top.glb'),
  ]);

  const col = (h: string) => new THREE.Color(h);
  const uniforms = {
    wsLayers: { value: layers }, wsBoardAO: { value: ao },
    wsBoardMin: { value: new THREE.Vector2(BOARD.center[0] - BOARD.layerSize[0] / 2, BOARD.center[1] - BOARD.layerSize[1] / 2) },
    wsBoardSize: { value: new THREE.Vector2(BOARD.layerSize[0], BOARD.layerSize[1]) },
    wsMaskBare: { value: col('#0a2c15') }, wsMaskCopper: { value: col('#16502a') }, wsGold: { value: col('#e3bf6c') },
    wsSubstrate: { value: col('#6d5c34') }, wsEdge: { value: col('#4c4128') }, wsSilk: { value: col('#eeede6') },
    wsPlating: { value: col('#b8914c') },
  };

  // Parts are merged per look (one draw call each) to keep phones smooth.
  const buckets = new Map<string, { mat: THREE.MeshStandardMaterial; geos: THREE.BufferGeometry[] }>();
  let boardGeo: THREE.BufferGeometry | null = null;
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const node = (m.userData.component ? m : m.parent) as THREE.Object3D | null;
    const kind = (node?.userData.component as string) || 'other';
    const g = bake(m);
    if (kind === 'board') { boardGeo = g; return; }
    const src = m.material as THREE.MeshStandardMaterial;
    const c = src.color.clone();
    let metal = src.metalness ?? 0, rough = src.roughness ?? 0.5;
    const gray = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) < 0.025;
    if (gray) { metal = c.r > 0.09 ? 0.85 : 0.04; rough = c.r > 0.09 ? 0.3 : 0.55; }
    if (c.r > c.b * 1.6 && c.g > c.b * 1.3) { c.set('#c5ae54'); metal = 0.9; rough = 0.26; }
    if (g.attributes.color) g.deleteAttribute('color');
    if (!g.attributes.ao) g.setAttribute('ao', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(1), 1));
    if (!g.attributes.normal) g.computeVertexNormals();
    const keyStr = `${c.getHexString()}|${metal.toFixed(2)}|${rough.toFixed(2)}`;
    if (!buckets.has(keyStr)) {
      const mat = new THREE.MeshStandardMaterial({ color: c, metalness: metal, roughness: rough, envMapIntensity: 0.85 });
      mat.onBeforeCompile = (s) => useVertexOcclusion(s as unknown as Shader);
      mat.customProgramCacheKey = () => 'hs-part';
      buckets.set(keyStr, { mat, geos: [] });
    }
    if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
    buckets.get(keyStr)!.geos.push(g);
  });
  const board = new THREE.Group();
  if (boardGeo) {
    const bmat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 1, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.85 });
    bmat.onBeforeCompile = (s) => useBoardSurface(s as unknown as Shader, uniforms);
    bmat.customProgramCacheKey = () => 'hs-board';
    board.add(new THREE.Mesh(boardGeo, bmat));
  }
  for (const { mat, geos } of buckets.values()) {
    const merged = mergeGeometries(geos, false);
    if (merged) board.add(new THREE.Mesh(merged, mat));
    else geos.forEach((g) => board.add(new THREE.Mesh(g, mat)));
  }
  content.add(board);

  const shellMats: THREE.MeshStandardMaterial[] = [];
  const bottom = bm.scene, top = tm.scene;
  for (const shell of [bottom, top]) {
    shell.position.fromArray(SHELL_OFFSET);
    shell.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.geometry.attributes._ao) m.geometry.setAttribute('ao', m.geometry.attributes._ao);
      const mat = (m.material as THREE.MeshStandardMaterial).clone();
      mat.roughness = 0.46; mat.metalness = 0.04; mat.envMapIntensity = 0.8;
      if (m.geometry.attributes.ao) { mat.onBeforeCompile = (s) => useVertexOcclusion(s as unknown as Shader); mat.customProgramCacheKey = () => 'hs-shell'; }
      mat.transparent = true;
      m.material = mat;
      shellMats.push(mat);
    });
    content.add(shell);
  }

  // ── Pose from progress ──
  // p is what is drawn; target is where the scroll is. p follows target
  // through a critically damped spring, so a jerky wheel or a fling still
  // gives continuous motion that eases to a stop.
  let p = 0, target = 0, vel = 0, last = 0, w = 1, h = 1, raf = 0, disposed = false;
  const OMEGA = 10; // rad/s: how quickly it catches up
  // Yaw, then pitch, then roll about the board's own normal: roll turns the
  // board in its plane (upright to lying sideways), yaw turns its face away.
  rig.rotation.order = 'YXZ';
  // The segments overlap, and each eases in and out, so one motion always
  // hands over to the next with no stop in between:
  // .00–.24 the bare board rises in, turning to face us
  // .14–.44 PCB beat: it drifts slowly closer and keeps turning a little
  // .34–.52 it turns on its side, long edge level, face turned away,
  //         so the case halves meet it from the left and right
  // .46–.66 the case closes; .60–.84 the closed reader turns to its lens
  // .80–.98 it settles into the project card
  const pose = () => {
    const enter = seg(p, 0, 0.24);
    const drift = seg(p, 0.14, 0.44);
    const lean = seg(p, 0.16, 0.32) * (1 - seg(p, 0.3, 0.46));
    const side = seg(p, 0.34, 0.52);
    const close = seg(p, 0.46, 0.66);
    const turn = seg(p, 0.6, 0.84);
    const settle = seg(p, 0.8, 0.98);

    rig.position.y = lerp(-70, 0, enter);
    rig.rotation.z = lerp(0.5, 0.08, enter) + side * (Math.PI / 2 - 0.08) - settle * 0.12;
    rig.rotation.x = lerp(-1.2, -0.42, enter) - lean * 0.06 + side * 0.22 - turn * 0.1 - settle * 0.08;
    rig.rotation.y = lerp(0.9, -0.08, enter) - drift * 0.16 + side * -0.89 + turn * -1.5 - settle * 0.25;

    bottom.position.z = SHELL_OFFSET[2] + (1 - close) * 46;
    top.position.z = SHELL_OFFSET[2] - (1 - close) * 50;
    const shellVis = seg(p, 0.42, 0.5);
    for (const m of shellMats) { m.opacity = shellVis; m.depthWrite = shellVis > 0.98; }
    bottom.visible = top.visible = shellVis > 0.001;

    // Camera: distance and framing. On wide screens the reader sits right of the
    // copy (further right once it is in the card); on tall ones above it.
    const wide = w / h > 1.1;
    const dist = lerp(270, 190, lean) * (opts.compact ? 1.3 : 1) * lerp(1, 1.1, side) * lerp(1, 1.05, settle);
    const sideX = wide ? -dist * lerp(0.13, 0.17, settle) : 0;
    const sideY = wide ? -dist * 0.02 * settle : -dist * lerp(lerp(0.05, 0.12, seg(p, 0.06, 0.22)), 0.2, settle);
    camera.position.set(sideX, sideY + lean * -8, dist);
    camera.lookAt(sideX, sideY, 0);
  };
  const render = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    // semi-implicit critically damped spring toward target
    const x = p - target;
    vel += (-OMEGA * OMEGA * x - 2 * OMEGA * vel) * dt;
    p += vel * dt;
    if (Math.abs(p - target) < 1e-4 && Math.abs(vel) < 1e-3) { p = target; vel = 0; }
    pose();
    renderer.render(scene, camera);
    if (p !== target) raf = requestAnimationFrame(render);
    else last = 0;
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(render); };
  const resize = () => {
    w = host.clientWidth || 1; h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    request();
  };
  resize();
  // Compile everything up front so the first scroll frame does not stall.
  renderer.compile(scene, camera);
  request();

  return {
    setProgress: (v) => { if (Math.abs(v - target) > 1e-5) { target = v; request(); } },
    /** Jump without easing (reduced motion, first frame). */
    jump: (v: number) => { target = p = v; vel = 0; request(); },
    resize,
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); [m.material].flat().forEach((x) => (x as THREE.Material).dispose()); }
      });
      layers.dispose(); ao.dispose(); env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
