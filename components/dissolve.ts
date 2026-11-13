/* The bright dissolve: a picture (or a flat colour) that forms out of, or
   breaks into, glittering grain. A noise front sweeps out from a focus point;
   along the front the material burns to a thin bright line, the picture's own
   contours light up, grains flicker and four-point stars flare.

   It is one WebGL quad. On a display and browser that can show more than SDR
   white (a float drawing buffer with extended tone mapping), the light along
   the front is drawn brighter than white; everywhere else it clips to white.

   Used by the OCR Reader chapter openers and entrance, and by the site's page
   transitions. The caller owns timing: set inP / outP and call draw(). */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uHasTex, uIn, uOut, uTime, uGain, uZoom, uImgA, uViewA, uSeed, uDpr, uMode;
uniform vec3 uColor, uLight;
uniform vec2 uFocus, uRes;

float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
vec2 coverUv(vec2 uv) { float r = uViewA / uImgA; vec2 s = r > 1.0 ? vec2(1.0, 1.0 / r) : vec2(r, 1.0); return (uv - 0.5) * s * uZoom + 0.5; }

/* the sweep: near the focus first, with a ragged fbm edge */
float field(vec2 uv) {
  vec2 asp = vec2(uViewA, 1.0);
  float d = length((uv - uFocus) * asp) / length(asp);
  return d * 0.7 + fbm(uv * asp * 2.4 + uSeed) * 0.6;
}
/* distance from the nearest moving front (9 when nothing is moving) */
float front(float f, float tIn, float tOut) {
  float b = 9.0;
  if (uIn > 0.0005 && uIn < 0.9995) b = min(b, abs(f - tIn));
  if (uOut > 0.0005 && uOut < 0.9995) b = min(b, abs(f - tOut));
  return b;
}

void main() {
  float tIn = mix(0.06, 0.95, uIn);
  float tOut = mix(0.06, 0.95, uOut);
  vec2 px = gl_FragCoord.xy;
  /* grains on a grid of CSS pixels, so canvases of different resolutions
     (a page-transition mask and its light) break up identically */
  vec2 gcell = floor(vUv * uRes / uDpr / 1.5);
  float grain = h21(gcell + uSeed) * 0.05;
  float f = field(vUv) + grain;

  float aIn = uIn <= 0.0005 ? 0.0 : uIn >= 0.9995 ? 1.0 : 1.0 - smoothstep(tIn - 0.006, tIn + 0.006, f);
  float aOut = uOut <= 0.0005 ? 1.0 : uOut >= 0.9995 ? 0.0 : smoothstep(tOut - 0.006, tOut + 0.006, f);
  float a = aIn * aOut;
  float b = front(f, tIn, tOut);
  float edge = exp(-b * b / 0.00012);
  float halo = exp(-b * b / 0.0024);

  vec3 base = uColor;
  float contour = 0.0;
  if (uHasTex > 0.5) {
    vec2 uv = coverUv(vUv);
    base = texture2D(uTex, uv).rgb;
    if (halo > 0.01) {
      vec2 o = 1.6 * uDpr / uRes;
      float gx = lum(texture2D(uTex, uv + vec2(o.x, 0.0)).rgb) - lum(texture2D(uTex, uv - vec2(o.x, 0.0)).rgb);
      float gy = lum(texture2D(uTex, uv + vec2(0.0, o.y)).rgb) - lum(texture2D(uTex, uv - vec2(0.0, o.y)).rgb);
      contour = clamp(length(vec2(gx, gy)) * 5.0, 0.0, 1.0);
    }
  }

  /* the picture breaks into its own grains on the far side of the front,
     and a few of them catch the light and flicker white */
  float tw = h21(gcell + floor(uTime * 12.0) + uSeed * 3.0);
  float dustBand = exp(-b * b / 0.006) * (1.0 - a);
  float dust = step(0.62, h21(gcell + uSeed * 5.0)) * dustBand * (0.55 + 0.45 * tw);
  /* mask mode: where the old page still shows, its scattering grains included */
  if (uMode > 1.5) { float m = max(a, dust); gl_FragColor = vec4(m); return; }
  float glit = step(0.972, tw) * halo;

  /* four-point stars, one candidate per cell, lit while the front passes it */
  float cs = 64.0 * uDpr;
  vec2 cell = floor(px / cs);
  vec2 cp = (cell + 0.2 + 0.6 * vec2(h21(cell + 3.1), h21(cell + 7.7))) * cs;
  float cb = front(field(cp / uRes), tIn, tOut);
  float on = step(0.6, h21(cell + 11.3 + uSeed)) * exp(-cb * cb / 0.0016);
  vec2 dv = (px - cp) / uDpr;
  float r = length(dv);
  float tws = 0.55 + 0.45 * sin(uTime * 7.0 + h21(cell) * 40.0);
  float star = (exp(-abs(dv.x) * 0.7) * exp(-abs(dv.y) * 0.075) + exp(-abs(dv.y) * 0.7) * exp(-abs(dv.x) * 0.075)) * exp(-r * 0.045)
             + exp(-r * r * 0.03) * 1.4;
  float spark = on * tws * star;

  float lit = edge * 1.1 + glit * 1.2 + spark * 1.5 + contour * halo * 1.0;
  /* light mode: only the light along the front, drawn over a live page */
  if (uMode > 0.5) { float l = lit + dust * 0.35; gl_FragColor = vec4(uLight * l * uGain, clamp(l, 0.0, 1.0)); return; }
  vec3 col = base * a + base * dust * 1.5 + uLight * lit * uGain;
  float alpha = max(max(a, dust), clamp(lit, 0.0, 1.0));
  gl_FragColor = vec4(col, alpha);
}`;

export type DissolveMode = 'normal' | 'light' | 'mask';
export type DissolveOpts = { maxDpr?: number; seed?: number; size?: [number, number]; dpr?: number; sdr?: boolean };
export type DissolveState = { inP: number; outP: number; time: number; focus?: [number, number]; zoom?: number };

export class Dissolve {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private prog: WebGLProgram;
  private tex: WebGLTexture | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private imgA = 1;
  private hasTex = false;
  private color: [number, number, number] = [0, 0, 0];
  private light: [number, number, number] = [1, 0.97, 0.9];
  private seed = Math.random() * 50;
  private mode = 0;
  private fixed: [number, number] | null = null;
  private hdr = false;
  private dpr = 1;
  readonly canvas: HTMLCanvasElement;

  /* opts.size draws at a fixed pixel size (for a canvas that is not on the
     page), opts.dpr then says how many of its pixels make a CSS pixel; seed
     makes two instances break up identically. */
  static create(canvas: HTMLCanvasElement, opts: DissolveOpts = {}): Dissolve | null {
    try { return new Dissolve(canvas, opts); } catch { return null; }
  }

  private constructor(canvas: HTMLCanvasElement, opts: DissolveOpts) {
    this.canvas = canvas;
    if (opts.seed !== undefined) this.seed = opts.seed;
    if (opts.size) this.fixed = opts.size;
    const attrs: WebGLContextAttributes = { premultipliedAlpha: true, alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    const gl = (canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs)) as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) throw new Error('no webgl');
    this.gl = gl;
    const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
    this.dpr = opts.size ? (opts.dpr ?? 1) : Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? (coarse ? 1.25 : 1.5));

    // Brighter than white where the browser and the display can show it.
    const g2 = gl as WebGL2RenderingContext & {
      drawingBufferStorage?: (fmt: number, w: number, h: number) => void;
      drawingBufferToneMapping?: (o: { mode: string }) => void;
      drawingBufferColorSpace?: string;
    };
    const wantsHdr = typeof matchMedia !== 'undefined' && matchMedia('(dynamic-range: high)').matches;
    if (!opts.sdr && wantsHdr && 'RGBA16F' in g2 && typeof g2.drawingBufferStorage === 'function' && typeof g2.drawingBufferToneMapping === 'function') {
      try { g2.drawingBufferToneMapping({ mode: 'extended' }); this.hdr = true; } catch { this.hdr = false; }
    }
    if ('drawingBufferColorSpace' in g2) { try { g2.drawingBufferColorSpace = 'display-p3'; } catch { /* keep sRGB */ } }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
    this.prog = prog;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uMode', 'uTex', 'uHasTex', 'uIn', 'uOut', 'uTime', 'uGain', 'uZoom', 'uImgA', 'uViewA', 'uSeed', 'uDpr', 'uColor', 'uLight', 'uFocus', 'uRes']) this.u[n] = gl.getUniformLocation(prog, n);
    gl.uniform1i(this.u.uTex, 0);
    this.resize();
  }

  get isHdr() { return this.hdr; }

  resize() {
    const c = this.canvas;
    const w = this.fixed ? this.fixed[0] : Math.max(1, Math.round(c.clientWidth * this.dpr));
    const h = this.fixed ? this.fixed[1] : Math.max(1, Math.round(c.clientHeight * this.dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w; c.height = h;
      if (this.hdr) {
        const g2 = this.gl as WebGL2RenderingContext & { drawingBufferStorage: (fmt: number, w: number, h: number) => void };
        try { g2.drawingBufferStorage(g2.RGBA16F, w, h); } catch { this.hdr = false; }
      }
    }
    this.gl.viewport(0, 0, c.width, c.height);
  }

  /* An image (drawn to cover the canvas) or null for the flat colour. */
  setImage(img: TexImageSource | null, aspect?: number) {
    const gl = this.gl;
    if (!img) { this.hasTex = false; return; }
    if (!this.tex) this.tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.imgA = aspect ?? 1;
    this.hasTex = true;
  }

  setColor(rgb: [number, number, number]) { this.color = rgb; }
  setMode(m: DissolveMode) { this.mode = m === 'mask' ? 2 : m === 'light' ? 1 : 0; }
  setSize(w: number, h: number, dpr?: number) { this.fixed = [w, h]; if (dpr) this.dpr = dpr; this.resize(); }
  setLight(rgb: [number, number, number]) { this.light = rgb; }

  draw(s: DissolveState) {
    const gl = this.gl, u = this.u, c = this.canvas;
    gl.useProgram(this.prog);
    if (this.tex) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex); }
    gl.uniform1f(u.uMode, this.mode);
    gl.uniform1f(u.uHasTex, this.hasTex ? 1 : 0);
    gl.uniform1f(u.uIn, s.inP);
    gl.uniform1f(u.uOut, s.outP);
    gl.uniform1f(u.uTime, s.time);
    gl.uniform1f(u.uGain, this.hdr ? 2.6 : 1);
    gl.uniform1f(u.uZoom, s.zoom ?? 1);
    gl.uniform1f(u.uImgA, this.imgA);
    gl.uniform1f(u.uViewA, c.width / c.height);
    gl.uniform1f(u.uSeed, this.seed);
    gl.uniform1f(u.uDpr, this.dpr);
    gl.uniform3fv(u.uColor, this.color);
    gl.uniform3fv(u.uLight, this.light);
    gl.uniform2fv(u.uFocus, s.focus ?? [0.5, 0.5]);
    gl.uniform2f(u.uRes, c.width, c.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    const gl = this.gl;
    if (this.tex) gl.deleteTexture(this.tex);
    gl.deleteProgram(this.prog);
    (gl.getExtension('WEBGL_lose_context') as { loseContext?: () => void } | null)?.loseContext?.();
  }
}

/* Load an image for a texture, decoded off the main thread where possible. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}
