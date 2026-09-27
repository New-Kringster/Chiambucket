import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import {
  range,
  mix,
  windowOpacity,
  components,
  layerSteps,
} from "./timeline.js";
import { powerChips, powerChipForMesh } from "./power-data.js";
import { enclosureRotation } from "./interaction.js";
import { board as boardFrame, shellOffset } from "./board-frame.js";
import { layerColours } from "./layer-colours.js";

const colour = (hex) => new THREE.Color(hex);

// Baked ray-traced occlusion darkens all indirect light and part of the
// direct light. That partial direct term stands in for the soft area-light
// shadowing KiCad's ray tracer computes per pixel.
const occlusionChunk = /* glsl */ `
  reflectedLight.indirectDiffuse *= wsOcclusion;
  reflectedLight.indirectSpecular *= wsOcclusion;
  reflectedLight.directDiffuse *= mix(1.0, wsOcclusion, 0.6);
  reflectedLight.directSpecular *= mix(1.0, wsOcclusion, 0.6);
  #ifdef USE_CLEARCOAT
    clearcoatSpecularIndirect *= wsOcclusion;
  #endif
`;

// Parts and shells carry per-vertex occlusion from scripts/occlusion.mjs.
function useVertexOcclusion(shader) {
  shader.vertexShader =
    `attribute float ao;\nvarying float vWsAO;\n${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvWsAO = ao;",
    );
  shader.fragmentShader =
    `varying float vWsAO;\n${shader.fragmentShader}`.replace(
      "#include <aomap_fragment>",
      `#include <aomap_fragment>\nfloat wsOcclusion = vWsAO;\n${occlusionChunk}`,
    );
}

// The board surface is drawn from KiCad's own layers: copper shows through
// the solder mask as raised, lighter traces, exposed pads are gold and the
// silkscreen sits on top. Board x and y index the baked layer atlas directly.
function useBoardSurface(shader, uniforms) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader =
    `varying vec3 vBoardPos;\nvarying float vBoardNz;\n${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvBoardPos = position;\nvBoardNz = objectNormal.z;",
    );
  shader.fragmentShader = /* glsl */ `
    uniform sampler2D wsLayers;
    uniform sampler2D wsBoardAO;
    uniform vec2 wsBoardMin;
    uniform vec2 wsBoardSize;
    uniform float wsBump;
    uniform vec3 wsMaskBare;
    uniform vec3 wsMaskCopper;
    uniform vec3 wsGold;
    uniform vec3 wsSubstrate;
    uniform vec3 wsEdge;
    uniform vec3 wsSilk;
    uniform vec3 wsPlating;
    varying vec3 vBoardPos;
    varying float vBoardNz;
    // Bilinear coverage thresholded at 0.5 keeps pad and trace edges crisp
    // when magnified and falls back to smooth coverage when minified.
    float wsCover(float v) {
      float w = clamp(fwidth(v) * 0.7, 0.02, 0.5);
      return smoothstep(0.5 - w, 0.5 + w, v);
    }
    float wsHeight(vec2 uv) {
      vec3 l = texture2D(wsLayers, uv).rgb;
      return l.r * 0.8 + l.b * 0.45;
    }
    vec3 wsPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
      vec3 sx = normalize(dFdx(surfPos));
      vec3 sy = normalize(dFdy(surfPos));
      vec3 r1 = cross(sy, surfNorm);
      vec3 r2 = cross(surfNorm, sx);
      float det = dot(sx, r1) * faceDir;
      vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
      return normalize(abs(det) * surfNorm - grad);
    }
    ${shader.fragmentShader}`
    .replace(
      "#include <color_fragment>",
      /* glsl */ `#include <color_fragment>
      vec2 wsUv = (vBoardPos.xy - wsBoardMin) / wsBoardSize;
      float wsFront = step(0.0, vBoardNz);
      bool wsFace = abs(vBoardNz) > 0.5;
      vec2 wsAtlas = vec2(clamp(wsUv.x, 0.001, 0.999) * 0.5 + (1.0 - wsFront) * 0.5, wsUv.y);
      vec3 wsL = texture2D(wsLayers, wsAtlas).rgb;
      vec3 wsA = texture2D(wsBoardAO, wsUv).rgb;
      float wsCopper = wsCover(wsL.r);
      float wsOpen = wsCover(wsL.g);
      float wsSilkCover = wsCover(wsL.b);
      float wsHole = wsCover(wsA.b);
      float wsOcclusion = mix(wsA.g, wsA.r, wsFront);
      vec3 wsColour = mix(wsMaskBare, wsMaskCopper, wsCopper);
      wsColour = mix(wsColour, wsSubstrate, wsOpen * (1.0 - wsCopper));
      wsColour = mix(wsColour, wsGold, wsOpen * wsCopper);
      wsColour = mix(wsColour, wsSilk, wsSilkCover);
      wsColour = mix(wsColour, vec3(0.003), wsHole);
      float wsMetal = 0.7 * wsOpen * wsCopper * (1.0 - wsHole);
      float wsRough = mix(mix(0.5, 0.28, wsOpen * wsCopper), 0.85, wsSilkCover);
      float wsCoat = (1.0 - wsOpen) * (1.0 - wsSilkCover) * (1.0 - wsHole);
      if (!wsFace) {
        // Outer edges show the FR4 core; drilled hole walls are plated.
        vec2 wsEdgeDistance = min(wsUv, 1.0 - wsUv) * wsBoardSize;
        float wsOuter = step(min(wsEdgeDistance.x, wsEdgeDistance.y), 0.3);
        wsColour = mix(wsPlating, wsEdge, wsOuter);
        wsMetal = 1.0 - wsOuter;
        wsRough = mix(0.34, 0.72, wsOuter);
        wsCoat = 0.0;
        wsOcclusion = mix(0.4, 1.0, wsOuter);
      }
      diffuseColor.rgb *= wsColour;`,
    )
    .replace(
      "#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nroughnessFactor = wsRough;",
    )
    .replace(
      "#include <metalnessmap_fragment>",
      "#include <metalnessmap_fragment>\nmetalnessFactor *= wsMetal;",
    )
    .replace(
      "#include <normal_fragment_maps>",
      /* glsl */ `#include <normal_fragment_maps>
      vec2 wsDx = dFdx(wsAtlas);
      vec2 wsDy = dFdy(wsAtlas);
      float wsH = wsHeight(wsAtlas);
      vec2 wsDh = vec2(wsHeight(wsAtlas + wsDx) - wsH, wsHeight(wsAtlas + wsDy) - wsH) * wsBump;
      vec3 wsBumped = wsPerturb(-vViewPosition, normal, wsDh, faceDirection);
      if (wsFace) normal = wsBumped;`,
    )
    .replace(
      "#include <clearcoat_normal_fragment_maps>",
      "#include <clearcoat_normal_fragment_maps>\n#ifdef USE_CLEARCOAT\nif (wsFace) clearcoatNormal = normal;\n#endif",
    )
    .replace(
      "#include <lights_physical_fragment>",
      "#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= wsCoat;\n#endif",
    )
    .replace(
      "#include <aomap_fragment>",
      `#include <aomap_fragment>\n${occlusionChunk}`,
    );
}

// Only the LED lens emits; the long metal leads keep their normal material.
function useLensEmission(shader, lower, upper) {
  shader.vertexShader = `varying float vLens;\n${shader.vertexShader}`.replace(
    "#include <begin_vertex>",
    `#include <begin_vertex>\nvLens = 1.0 - smoothstep(${lower.toFixed(5)}, ${upper.toFixed(5)}, position.z);`,
  );
  shader.fragmentShader =
    `varying float vLens;\n${shader.fragmentShader}`.replace(
      "#include <emissivemap_fragment>",
      "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vLens;",
    );
}

// Dequantize a part into float board coordinates so parts can be merged.
function bakeTransform(mesh) {
  const source = mesh.geometry,
    geometry = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(source.attributes)) {
    const size = attribute.itemSize,
      out = new Float32Array(attribute.count * size);
    for (let i = 0; i < attribute.count; i++)
      for (let k = 0; k < size; k++)
        out[i * size + k] = attribute.getComponent(i, k);
    geometry.setAttribute(
      name === "_ao" ? "ao" : name,
      new THREE.BufferAttribute(out, size),
    );
  }
  geometry.setIndex(source.index);
  geometry.applyMatrix4(mesh.matrixWorld);
  return geometry;
}

// Combine parts that always highlight together, one draw group per material.
function mergeParts(parts) {
  const materials = [],
    slots = new Map(),
    buckets = [],
    attributes = {};
  let offset = 0;
  for (const { geometry, material } of parts) {
    for (const [name, attribute] of Object.entries(geometry.attributes))
      (attributes[name] ||= []).push(attribute.array);
    const key = material.userData.key;
    if (!slots.has(key)) {
      slots.set(key, materials.length);
      materials.push(material);
      buckets.push([]);
    }
    const bucket = buckets[slots.get(key)];
    for (let i = 0; i < geometry.index.count; i++)
      bucket.push(geometry.index.getX(i) + offset);
    offset += geometry.attributes.position.count;
  }
  const geometry = new THREE.BufferGeometry();
  for (const [name, arrays] of Object.entries(attributes)) {
    const size = parts[0].geometry.attributes[name].itemSize;
    const out = new Float32Array(arrays.reduce((s, a) => s + a.length, 0));
    let at = 0;
    for (const a of arrays) {
      out.set(a, at);
      at += a.length;
    }
    geometry.setAttribute(name, new THREE.BufferAttribute(out, size));
  }
  const index = [];
  for (const [slot, bucket] of buckets.entries()) {
    geometry.addGroup(index.length, bucket.length, slot);
    for (const v of bucket) index.push(v);
  }
  geometry.setIndex(index);
  geometry.computeBoundingSphere();
  return new THREE.Mesh(geometry, materials);
}

export async function createScene(host, onProgress, { assetBase }) {
  const asset = (path) => new URL(assetBase + path, document.baseURI).href;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.append(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-90, 90, 51.6, -51.6, 0.1, 1000);
  camera.position.set(0, 0, 180);
  const pmrem = new THREE.PMREMGenerator(renderer),
    room = new RoomEnvironment(),
    env = pmrem.fromScene(room, 0.02);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.6;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x78736c, 0.45));
  const key = new THREE.DirectionalLight(0xfff5e8, 2.1);
  key.position.set(-55, 80, 120);
  key.castShadow = true;
  // A wide filter radius on a 2048 map gives soft contact-scale shadows at a
  // quarter of the fill cost of the previous 4096 map.
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 3.5;
  Object.assign(key.shadow.camera, {
    left: -110,
    right: 110,
    top: 110,
    bottom: -110,
    near: 1,
    far: 400,
  });
  key.shadow.bias = -0.00012;
  key.shadow.normalBias = 0.04;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdce7f5, 0.75);
  fill.position.set(80, 20, 60);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xfff5e8, 2.4);
  back.position.set(-20, 50, -100);
  scene.add(back);
  const rig = new THREE.Group(),
    content = new THREE.Group();
  rig.add(content);
  scene.add(rig);

  const texLoader = new THREE.TextureLoader();
  async function dataTexture(name) {
    const t = await texLoader.loadAsync(asset(name));
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  }
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [gltf, boardLayers, boardAO] = await Promise.all([
    loader.loadAsync(asset("board.glb")),
    dataTexture("board-layers.webp"),
    dataTexture("board-ao.webp"),
  ]);
  const source = gltf.scene;
  source.updateMatrixWorld(true);

  const boardUniforms = {
    wsLayers: { value: boardLayers },
    wsBoardAO: { value: boardAO },
    wsBoardMin: {
      value: new THREE.Vector2(
        boardFrame.center[0] - boardFrame.layerSize[0] / 2,
        boardFrame.center[1] - boardFrame.layerSize[1] / 2,
      ),
    },
    wsBoardSize: { value: new THREE.Vector2(...boardFrame.layerSize) },
    wsBump: { value: 0.9 },
    wsMaskBare: { value: colour("#0a2c15") },
    wsMaskCopper: { value: colour("#16502a") },
    wsGold: { value: colour("#e3bf6c") },
    wsSubstrate: { value: colour("#6d5c34") },
    wsEdge: { value: colour("#4c4128") },
    wsSilk: { value: colour("#eeede6") },
    wsPlating: { value: colour("#b8914c") },
  };

  const groups = new Map(),
    ledBounds = [],
    materialCache = new Map();
  let boardMesh = null;
  source.traverse((o) => {
    if (!o.isMesh) return;
    // Node extras land on the mesh, or on its parent group for multi-material parts.
    const node = o.userData.component ? o : o.parent;
    const name = node?.name || o.name,
      kind = node?.userData.component || "other";
    const geometry = bakeTransform(o);
    if (kind === "board") {
      boardMesh = new THREE.Mesh(geometry);
      return;
    }
    // Colour SOT packages: dark epoxy body with silver leads.
    if (/^SOT-|^SOT-353/.test(name)) {
      geometry.computeBoundingBox();
      const box = geometry.boundingBox,
        center = box.getCenter(new THREE.Vector3()),
        size = box.getSize(new THREE.Vector3()),
        pos = geometry.attributes.position,
        colors = [];
      const dark = new THREE.Color("#242527"),
        silver = new THREE.Color("#a5a7a6");
      for (let i = 0; i < pos.count; i++) {
        const nx = Math.abs((pos.getX(i) - center.x) / size.x),
          ny = Math.abs((pos.getY(i) - center.y) / size.y),
          nz = (pos.getZ(i) - box.min.z) / size.z;
        const c = nx < 0.34 && ny < 0.4 && nz > 0.23 ? dark : silver;
        colors.push(c.r, c.g, c.b);
      }
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      );
    }
    if (kind === "leds") {
      geometry.computeBoundingBox();
      ledBounds.push(geometry.boundingBox.clone());
    }
    const m = o.material;
    const mat = new THREE.MeshPhysicalMaterial({
      color: m.color.clone(),
      metalness: m.metalness,
      roughness: m.roughness,
    });
    mat.color.convertSRGBToLinear();
    if (geometry.attributes.color) {
      mat.vertexColors = true;
      mat.color.set(0xffffff);
      mat.metalness = 0.18;
      mat.roughness = 0.5;
    }
    const rgb = mat.color,
      gray =
        Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b) < 0.025;
    if (gray) {
      // Light greys are tinned leads and shields; dark greys are moulded epoxy.
      mat.metalness = rgb.r > 0.09 ? 0.85 : 0.04;
      mat.roughness = rgb.r > 0.09 ? 0.3 : 0.55;
    }
    if (
      /ESP32/.test(name) &&
      m.color.r > 0.1 &&
      m.color.r < 0.2 &&
      Math.abs(m.color.r - m.color.g) < 0.01
    ) {
      mat.color.set("#515355");
      mat.metalness = 0.8;
      mat.roughness = 0.38;
    }
    if (m.color.r > m.color.b * 1.6 && m.color.g > m.color.b * 1.3) {
      mat.color.set("#c5ae54");
      mat.metalness = 0.9;
      mat.roughness = 0.26;
    }
    mat.envMapIntensity = 0.85;
    mat.userData.key = [
      mat.color.getHexString(),
      mat.metalness,
      mat.roughness,
      mat.vertexColors,
    ].join();
    const powerRef = powerChipForMesh(name);
    const usbShell = /UJ20/.test(name),
      // GLTFLoader turns spaces in node names into underscores.
      cameraBody = /Camera.body/.test(name);
    const group = [
      kind,
      powerRef,
      usbShell,
      cameraBody,
      Boolean(geometry.attributes.color),
    ].join("|");
    if (!groups.has(group))
      groups.set(group, { kind, powerRef, usbShell, cameraBody, parts: [] });
    // Share one material per look within a group.
    const cacheKey = group + "|" + mat.userData.key;
    if (!materialCache.has(cacheKey)) materialCache.set(cacheKey, mat);
    groups
      .get(group)
      .parts.push({ geometry, material: materialCache.get(cacheKey) });
  });
  if (!boardMesh) throw new Error("board.glb has no PCB mesh");

  const boardMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.85,
  });
  boardMaterial.onBeforeCompile = (shader) =>
    useBoardSurface(shader, boardUniforms);
  boardMaterial.customProgramCacheKey = () => "waterslop-board";
  boardMesh.material = boardMaterial;
  boardMesh.userData = { kind: "board", powerRef: null };
  boardMesh.geometry.computeBoundingSphere();

  const board = new THREE.Group();
  board.add(boardMesh);
  const meshes = [boardMesh];
  const ledRange = ledBounds.length
    ? ledBounds.reduce((a, b) => a.union(b))
    : null;
  for (const {
    kind,
    powerRef,
    usbShell,
    cameraBody,
    parts,
  } of groups.values()) {
    const mesh = mergeParts(parts);
    mesh.userData = { kind, powerRef, usbShell, cameraBody };
    for (const mat of mesh.material) {
      if (kind === "leds") {
        const height = ledRange.max.z - ledRange.min.z;
        const lower = ledRange.min.z + height * 0.12,
          upper = ledRange.min.z + height * 0.25;
        mat.onBeforeCompile = (shader) => {
          useVertexOcclusion(shader);
          useLensEmission(shader, lower, upper);
        };
        mat.customProgramCacheKey = () => `waterslop-led-${lower}-${upper}`;
      } else {
        mat.onBeforeCompile = useVertexOcclusion;
        mat.customProgramCacheKey = () => "waterslop-part";
      }
    }
    board.add(mesh);
    meshes.push(mesh);
  }
  for (const mesh of meshes) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for (const m of [mesh.material].flat()) {
      m.transparent = false;
      m.userData.original = m.color.clone();
      m.userData.metalness = m.metalness;
      m.userData.clearcoat = m.clearcoat;
    }
  }
  content.add(board);

  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const glowContext = glowCanvas.getContext("2d");
  const gradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,249,225,1)");
  gradient.addColorStop(0.12, "rgba(255,238,194,.65)");
  gradient.addColorStop(0.38, "rgba(255,225,159,.14)");
  gradient.addColorStop(1, "rgba(255,225,159,0)");
  glowContext.fillStyle = gradient;
  glowContext.fillRect(0, 0, 128, 128);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const ledLights = ledBounds.map((bounds) => {
    const center = bounds.getCenter(new THREE.Vector3());
    center.z = bounds.min.z - 0.15;
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    halo.position.copy(center);
    halo.scale.set(9, 9, 1);
    const light = new THREE.PointLight(0xffedca, 0, 25, 2);
    light.position.copy(center);
    content.add(halo, light);
    return { halo, light };
  });

  onProgress("Loading the enclosure…");
  const [bm, tm, ...layerMaps] = await Promise.all([
    loader.loadAsync(asset("shell-bottom.glb")),
    loader.loadAsync(asset("shell-top.glb")),
    ...Array.from({ length: Math.ceil(layerSteps.length / 3) }, (_, i) =>
      dataTexture(`layers-${i}.webp`),
    ),
  ]);
  const bottom = bm.scene,
    top = tm.scene;
  for (const shell of [bottom, top]) {
    shell.position.fromArray(shellOffset);
    content.add(shell);
    shell.traverse((o) => {
      if (!o.isMesh) return;
      if (o.geometry.attributes._ao)
        o.geometry.setAttribute("ao", o.geometry.attributes._ao);
      o.castShadow = true;
      o.receiveShadow = true;
      o.material.roughness = 0.46;
      o.material.metalness = 0.04;
      o.material.envMapIntensity = 0.8;
      if (o.geometry.attributes.ao)
        o.material.onBeforeCompile = useVertexOcclusion;
      o.material.customProgramCacheKey = () => "waterslop-shell";
    });
  }

  // Each layer is one KiCad colour stored as coverage in one channel.
  const holes = boardAO;
  const layerGroup = new THREE.Group();
  content.add(layerGroup);
  const layerMeshes = layerSteps.map((step, i) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: layerMaps[Math.floor(i / 3)] },
        holes: { value: holes },
        channel: { value: i % 3 },
        showHoles: { value: /traces/.test(step.id) ? 1 : 0 },
        colour: { value: colour(layerColours[step.id]) },
        opacity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform sampler2D holes;
        uniform int channel;
        uniform float showHoles;
        uniform vec3 colour;
        uniform float opacity;
        varying vec2 vUv;
        float cover(float v) {
          float w = clamp(fwidth(v) * 0.7, 0.02, 0.5);
          return smoothstep(0.5 - w, 0.5 + w, v);
        }
        void main() {
          vec3 t = texture2D(map, vUv).rgb;
          float c = cover(channel == 0 ? t.r : channel == 1 ? t.g : t.b);
          float h = cover(texture2D(holes, vUv).b) * showHoles * c;
          gl_FragColor = vec4(mix(colour, vec3(0.96, 0.95, 0.9), h), c * opacity);
          #include <colorspace_fragment>
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(...boardFrame.layerSize),
      mat,
    );
    // Registration stays exact; renderOrder controls the overlay stack.
    m.position.set(...boardFrame.center, 4);
    m.renderOrder = 10 + i;
    layerGroup.add(m);
    return m;
  });

  let width = 0,
    height = 0,
    lastFrame = "";
  // Framing follows the stage (the host's parent). The canvas may be taller,
  // bleeding above the stage, and that extra height extends the view upward.
  const frame = host.parentElement;
  function resize() {
    width = host.clientWidth;
    height = frame.clientHeight || host.clientHeight;
    const above = Math.max(
      0,
      frame.getBoundingClientRect().top - host.getBoundingClientRect().top,
    );
    const unitsPerPixel = 103.2 / height;
    renderer.setSize(width, host.clientHeight, false);
    camera.left = (-51.6 * width) / height;
    camera.right = (51.6 * width) / height;
    camera.top = 51.6 + above * unitsPerPixel;
    camera.bottom =
      -51.6 - (host.clientHeight - height - above) * unitsPerPixel;
    camera.updateProjectionMatrix();
    lastFrame = "";
    // Resizing clears the canvas; redraw now rather than on the next scroll.
    if (lastRender) render(...lastRender);
  }
  let lastRender = null;
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  observer.observe(frame);
  const tmp = new THREE.Vector3(),
    focusPoint = new THREE.Vector3();
  function render(state, reduced = false, interaction = {}) {
    lastRender = [state, reduced, interaction];
    const { p, componentIndex, focus } = state;
    const ledIntensity = interaction.ledIntensity || 0;
    const chip =
      state.component.id === "power"
        ? powerChips.find((c) => c.id === interaction.selectedRef)
        : null;
    const highlighted = new Set();
    // Skip the GPU entirely when nothing that affects the picture changed,
    // e.g. while the comparison graph animates beside a still board.
    const frame = [
      p.toFixed(6),
      chip?.id,
      interaction.rotation?.yaw,
      interaction.rotation?.pitch,
      ledIntensity.toFixed(4),
      reduced,
      width,
      height,
    ].join();
    let [x, y, rx, ry, rz, scale] = state.pose;
    const mobile = width <= 760,
      viewH = 103.2,
      viewW = (viewH * width) / height;
    const prev = components[Math.max(0, componentIndex - 1)],
      t = range(
        p,
        0.325 + componentIndex * 0.064,
        0.342 + componentIndex * 0.064,
      );
    const matches = (mesh, id) =>
      id === "power"
        ? Boolean(mesh.userData.powerRef) &&
          (!chip || mesh.userData.powerRef === chip.id)
        : id === "usb"
          ? mesh.userData.kind === "usb" || mesh.userData.usbShell
          : id === "leds"
            ? mesh.userData.kind === "leds" || mesh.userData.cameraBody
            : mesh.userData.kind === id;
    for (const mesh of meshes) {
      const weight =
        (matches(mesh, state.component.id) ? t : 0) +
        (matches(mesh, prev.id) ? 1 - t : 0);
      if (weight > 0.95 && focus > 0.95)
        highlighted.add(mesh.userData.powerRef || mesh.userData.kind);
      mesh.userData.weight = weight;
    }
    if (frame === lastFrame)
      return { highlighted: [...highlighted], ledIntensity };
    lastFrame = frame;

    for (const { halo, light } of ledLights) {
      halo.material.opacity = ledIntensity * 0.85;
      halo.visible = ledIntensity > 0.001;
      light.intensity = ledIntensity * 70;
    }
    focusPoint
      .fromArray(prev.focus)
      .lerp(tmp.fromArray(state.component.focus), t);
    if (chip) {
      focusPoint.fromArray(chip.position);
      scale = 4.9;
    }
    if (mobile) {
      x = mix(19, 0, range(p, 0.105, 0.151));
      y = mix(-26, 0, range(p, 0.105, 0.151));
      scale *= 0.57;
      const blend = windowOpacity(p, 0.312, 0.815, 0.024);
      x = mix(x, 0, blend);
      y = mix(y, state.component.id === "power" ? 34 : 27, blend);
      scale = mix(
        scale,
        (chip ? 2.15 : state.component.scale * 0.44) *
          (height < 740 ? 0.85 : 1),
        blend,
      );
      const assembly = range(p, 0.812, 0.836);
      x = mix(x, 0, assembly);
      y = mix(y, -6, assembly);
      scale = mix(
        scale,
        mix(0.48, 0.6, state.finish) * Math.min(1, viewW / 58),
        assembly,
      );
    }
    if (p < 0.048 && mobile) {
      x = mix(70, 19, range(p, 0, 0.048));
      y = mix(-85, -26, range(p, 0, 0.048));
    }
    [rx, ry, rz] = enclosureRotation(
      [rx, ry, rz],
      state.finish,
      interaction.rotation,
    );
    if (reduced && focus > 0.95) {
      [rx, ry, rz] = state.component.rotation;
    }
    rig.position.set((x / 100) * viewW, (y / 100) * viewH, 0);
    rig.rotation.set(rx, ry, rz);
    rig.scale.setScalar(scale);
    // Move the focal component to the rig origin so zooming cannot leave it off-screen.
    content.position.set(
      mix(-0.17, -focusPoint.x, focus),
      mix(-2.72, -focusPoint.y, focus),
      mix(2.11, -focusPoint.z, focus),
    );
    for (const mesh of meshes) {
      const weight = mesh.userData.weight;
      const dim = mix(mix(1, 0.13, focus), 1, weight);
      for (const m of [mesh.material].flat()) {
        m.color.copy(m.userData.original).multiplyScalar(dim);
        m.envMapIntensity = 0.85 * mix(1, 0.28, focus * (1 - weight));
        m.opacity = state.render;
        m.transparent = state.render < 0.995;
        m.metalness = m.userData.metalness * dim;
        m.specularIntensity = dim;
        m.clearcoat = m.userData.clearcoat * dim;
        m.emissive.set(0);
        if (mesh.userData.kind === "leds") {
          m.emissive.set("#fff0cc");
          m.emissiveIntensity = ledIntensity * 5;
        }
      }
      mesh.visible = state.render > 0.005;
    }
    for (const [i, m] of layerMeshes.entries())
      m.material.uniforms.opacity.value = state.blueprint * state.layers[i];
    layerGroup.visible = state.blueprint > 0.001;
    const closure = reduced ? Number(state.closure > 0.5) : state.closure;
    bottom.position.z = shellOffset[2] + (1 - closure) * 27;
    top.position.z = shellOffset[2] - (1 - closure) * 29;
    for (const shell of [bottom, top]) {
      shell.visible = state.assembly > 0.001;
      shell.traverse((o) => {
        if (o.isMesh) {
          o.material.opacity = state.assembly;
          o.material.transparent = state.assembly < 0.995;
        }
      });
    }
    renderer.render(scene, camera);
    return { highlighted: [...highlighted], ledIntensity };
  }
  return {
    render,
    renderer,
    dispose() {
      observer.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        for (const m of [o.material ?? []].flat()) {
          m.map?.dispose();
          m.dispose();
        }
      });
      for (const t of [boardLayers, boardAO, glowTexture, ...layerMaps])
        t.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
