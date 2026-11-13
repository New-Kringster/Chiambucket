/* ────────────────────────────────────────────────────────────────
   Dissolve: an image breaks up into glittering grain with luminous edges
   and four-point star flares as `p` goes 0 → 1, uncovering whatever sits
   behind its canvas. One small WebGL1 program, no library.

   It draws only while something changes: on setProgress, on resize, and
   while the edge is on screen (0 < p < 1), when the sparkle twinkles.
   ──────────────────────────────────────────────────────────────── */

const VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D img;
uniform vec2 res;      // canvas size in px
uniform vec2 imgSize;  // image size in px
uniform float p;       // 0 whole image, 1 gone
uniform float t;       // seconds, for the twinkle
uniform float focusY;  // where the break-up starts (0 bottom, 1 top)

float h21(vec2 q){ q = fract(q * vec2(123.34, 456.21)); q += dot(q, q + 45.32); return fract(q.x * q.y); }
float vnoise(vec2 x){
  vec2 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 x){ float s = 0.0, a = 0.5; for (int k = 0; k < 5; k++){ s += a * vnoise(x); x *= 2.03; a *= 0.5; } return s; }

void main(){
  vec2 px = v * res;
  // object-fit: cover
  float s = max(res.x / imgSize.x, res.y / imgSize.y);
  vec2 uv = (px - 0.5 * res) / (imgSize * s) + 0.5;
  vec3 col = texture2D(img, vec2(uv.x, 1.0 - uv.y)).rgb;

  // The field the threshold sweeps: coarse shapes plus fine grain, biased so
  // the break-up starts at focusY and spreads outwards.
  vec2 q = px / max(res.x, res.y);
  float n = fbm(q * 5.0) * 0.62 + h21(floor(px / 2.0)) * 0.38;
  n = n * 0.75 + abs(v.y - focusY) * 0.42;
  float th = mix(-0.08, 1.12, p);
  float edge = 0.055;

  float keep = smoothstep(th, th + 0.01, n);           // 1 = image remains
  float band = 1.0 - smoothstep(0.0, edge, n - th);    // 1 at the edge
  band *= keep;

  // Grain in the band: bright specks that flicker.
  float g = h21(floor(px / 1.5) + floor(t * 9.0));
  float spark = step(0.86, g) * band;

  // Luminous rim: warm white pushed past 1, tone-mapped back below.
  vec3 hot = vec3(1.0, 0.93, 0.78);
  vec3 c = col * (1.0 + band * 2.4) + hot * (band * band * 1.6 + spark * 2.2);

  // Four-point star flares on a coarse grid, only where the edge passes.
  float cell = 46.0;
  vec2 id = floor(px / cell), cpx = (id + 0.5) * cell;
  float r = h21(id + 7.0);
  vec2 cq = cpx / max(res.x, res.y);
  float cn = fbm(cq * 5.0) * 0.62 + h21(floor(cpx / 2.0)) * 0.38;
  cn = cn * 0.75 + abs(cpx.y / res.y - focusY) * 0.42;
  float near = 1.0 - smoothstep(0.0, edge * 1.6, abs(cn - th));
  vec2 d = (px - cpx - (vec2(h21(id + 3.0), h21(id + 5.0)) - 0.5) * cell * 0.6) / cell;
  float tw = 0.6 + 0.4 * sin(t * 5.0 + r * 40.0);
  float star = exp(-abs(d.x) * 60.0) * exp(-abs(d.y) * 6.0) + exp(-abs(d.y) * 60.0) * exp(-abs(d.x) * 6.0);
  star += exp(-dot(d, d) * 260.0) * 1.5;
  float flare = star * near * step(0.78, r) * tw;

  vec3 outc = c * keep + hot * flare * 1.8;
  float a = clamp(keep + flare * 0.9 + spark * 0.5, 0.0, 1.0);
  outc = outc / (1.0 + max(outc - 1.0, 0.0) * 0.6); // soft shoulder
  gl_FragColor = vec4(outc * a, a);
}`;

export type Dissolve = { setProgress: (p: number) => void; resize: () => void; dispose: () => void };

export function createDissolve(canvas: HTMLCanvasElement, img: HTMLImageElement, focusY = 0.35): Dissolve | null {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u('res'), uImg = u('imgSize'), uP = u('p'), uT = u('t'), uF = u('focusY');
  gl.uniform2f(uImg, img.naturalWidth, img.naturalHeight);
  gl.uniform1f(uF, focusY);

  let p = 0, raf = 0, dead = false;
  const t0 = performance.now();
  const draw = () => {
    raf = 0;
    if (dead) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uP, p);
    gl.uniform1f(uT, (performance.now() - t0) / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Keep twinkling only while the edge is visible and the tab is shown.
    if (p > 0.001 && p < 0.999 && !document.hidden) raf = requestAnimationFrame(draw);
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const resize = () => {
    // Grain is meant to be coarse; phones draw at 1x to keep the shader light.
    const dpr = Math.min(devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1 : 1.5);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    request();
  };
  const onVis = () => { if (!document.hidden) request(); };
  document.addEventListener('visibilitychange', onVis);
  resize();
  return {
    setProgress: (v) => { if (v !== p) { p = v; request(); } },
    resize,
    dispose: () => {
      dead = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
