'use client';
import { useEffect, useRef } from 'react';

/*
  SensoryAtmosphere — the "dark sensory" field behind every page.
  A full-viewport WebGL fragment shader draws a slowly flowing, domain-warped
  fBM gradient with in-shader film grain and a soft focal bloom. The palette is
  driven by the route's `data-theme` on <html> and CROSSFADES on client-side
  navigation (a MutationObserver retargets the palette; the render loop lerps).
  It degrades to a static CSS mesh (the per-theme --aura tokens) on
  prefers-reduced-motion or when WebGL is unavailable, and pauses when the tab
  is hidden. A second fixed layer lays fine SVG-turbulence grain over the page.
*/

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2  uRes;
uniform vec2  uMouse;
uniform vec3  uC0; // near-black base
uniform vec3  uC1; // deep tone
uniform vec3  uC2; // mid tone
uniform vec3  uC3; // dim highlight
uniform vec3  uCv; // whisper tint where the warp peaks
uniform vec3  uBloom; // focal plume colour

float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p  = uv;
  p.x *= uRes.x / uRes.y;
  float t = uTime * 0.05;

  // domain warp: fBM of fBM of fBM
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.3 + 1.8 * q + vec2(1.7, 9.2) + 0.12 * t),
                fbm(p * 1.3 + 1.8 * q + vec2(8.3, 2.8) - 0.10 * t));
  float f = fbm(p * 1.3 + 1.7 * r);

  // Palette stays intentionally dark so content is always legible —
  // the brightest stop is a dim highlight, never near-white.
  vec3 col = mix(uC0, uC1, smoothstep(0.22, 0.68, f));
  col = mix(col, uC2, smoothstep(0.58, 0.96, f));
  col = mix(col, uCv, smoothstep(0.70, 1.04, r.y) * 0.28);
  col = mix(col, uC3, smoothstep(0.90, 1.14, f + 0.13 * r.x));

  // soft focal plume — the single, contained light source
  vec2 center = vec2(0.5 * uRes.x / uRes.y, 0.56);
  center.x += 0.05 * sin(uTime * 0.11) + (uMouse.x - 0.5) * 0.07;
  center.y += 0.03 * cos(uTime * 0.09) + (uMouse.y - 0.5) * 0.045;
  float d = distance(p, center);
  float bloom = smoothstep(0.58, 0.0, d);
  col += uBloom * bloom * (0.5 + 0.5 * f);

  // strong vignette so the edges sink into black and the light stays focused
  float vig = smoothstep(1.10, 0.32, length(uv - 0.5));
  col *= mix(0.16, 1.0, vig);

  // fine, STATIC sensor grain — no time term, so it never sizzles or flickers
  float g = hash(gl_FragCoord.xy);
  col += (g - 0.5) * 0.015;

  col *= 0.90;
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

/* Per-theme shader palettes: [c0 base, c1 deep, c2 mid, c3 highlight, cv whisper, bloom].
   Hues follow lib/theme.ts route themes so the field recolours with the page. */
type Palette = number[][];
const PALETTES: Record<string, Palette> = {
  blue: [
    [0.005, 0.007, 0.014], [0.016, 0.034, 0.078], [0.040, 0.064, 0.150],
    [0.115, 0.155, 0.315], [0.120, 0.075, 0.230], [0.040, 0.058, 0.135],
  ],
  violet: [
    [0.007, 0.005, 0.013], [0.038, 0.017, 0.072], [0.088, 0.040, 0.152],
    [0.205, 0.115, 0.320], [0.170, 0.052, 0.205], [0.088, 0.048, 0.150],
  ],
  indigo: [
    [0.005, 0.006, 0.014], [0.022, 0.028, 0.085], [0.055, 0.065, 0.170],
    [0.135, 0.150, 0.330], [0.100, 0.080, 0.240], [0.055, 0.065, 0.160],
  ],
  mauve: [
    [0.008, 0.005, 0.010], [0.046, 0.020, 0.055], [0.102, 0.046, 0.115],
    [0.230, 0.122, 0.238], [0.180, 0.060, 0.160], [0.100, 0.052, 0.120],
  ],
  steel: [
    [0.005, 0.007, 0.010], [0.018, 0.032, 0.048], [0.045, 0.075, 0.105],
    [0.115, 0.175, 0.225], [0.060, 0.110, 0.150], [0.050, 0.080, 0.110],
  ],
  datacenter: [
    [0.004, 0.008, 0.009], [0.010, 0.040, 0.045], [0.025, 0.085, 0.090],
    [0.070, 0.200, 0.190], [0.030, 0.140, 0.100], [0.030, 0.095, 0.095],
  ],
  paper: [
    [0.013, 0.009, 0.005], [0.060, 0.036, 0.017], [0.130, 0.082, 0.040],
    [0.300, 0.196, 0.100], [0.210, 0.120, 0.055], [0.120, 0.076, 0.035],
  ],
};

// Fine grain tile (SVG fractal noise) as a data URI for the over-content overlay.
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function SensoryAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // fallback CSS mesh stands in

    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power' });
    if (!gl) return; // CSS fallback stands in

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uPal = ['uC0', 'uC1', 'uC2', 'uC3', 'uCv', 'uBloom'].map((n) => gl.getUniformLocation(prog, n));

    /* Palette state: `cur` is what renders, `target` follows data-theme.
       The render loop eases cur → target, so route changes crossfade. */
    const paletteFor = () => PALETTES[document.documentElement.getAttribute('data-theme') || 'blue'] || PALETTES.blue;
    let target = paletteFor();
    const cur = target.map((v) => v.slice());
    const themeWatch = new MutationObserver(() => { target = paletteFor(); });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = 1 - e.clientY / window.innerHeight; };
    window.addEventListener('pointermove', onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) cur[i][j] += (target[i][j] - cur[i][j]) * 0.04;
        gl.uniform3f(uPal[i], cur[i][0], cur[i][1], cur[i][2]);
      }
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) raf = requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      // Deliberately do NOT call WEBGL_lose_context.loseContext() here.
      // React Strict Mode (dev) and client-side route changes tear this effect
      // down and re-run it; if we force-lose the context, the re-run's
      // getContext() returns the already-lost context and the backdrop stays
      // blank (a bright wash). Letting the browser reclaim the context when the
      // canvas is removed from the DOM is safe and avoids that.
    };
  }, []);

  return (
    <>
      <div className="sa-root" aria-hidden="true">
        <div className="sa-fallback" />
        <canvas ref={canvasRef} className="sa-canvas" />
        <div className="sa-veil" />
      </div>
      <div className="sa-grain" aria-hidden="true" style={{ backgroundImage: GRAIN_URI }} />
      <style>{`
        .sa-root { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
        .sa-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        /* Static mesh shown before/without WebGL (and on reduced motion).
           Rides the per-theme --aura tokens so it recolours with the route. */
        .sa-fallback { position: absolute; inset: 0;
          background:
            radial-gradient(56% 46% at 50% 55%, var(--aura-1, rgba(70,95,190,0.10)), transparent 70%),
            radial-gradient(45% 40% at 22% 28%, var(--aura-2, rgba(24,44,110,0.13)), transparent 72%),
            radial-gradient(50% 45% at 82% 30%, var(--aura-3, rgba(48,38,100,0.09)), transparent 74%),
            radial-gradient(85% 72% at 50% 122%, rgba(4,6,14,0.94), transparent 70%),
            #04050a; }
        /* A darkening veil so text over the shader always stays legible */
        .sa-veil { position: absolute; inset: 0; background:
          radial-gradient(115% 88% at 50% 42%, transparent 38%, rgba(3,4,8,0.62) 100%); }
        /* Fine, STATIC film grain (no animation) — texture, never TV static.
           z-index 2 keeps it above content but below the nav (z 999). */
        .sa-grain { position: fixed; inset: 0; z-index: 2; pointer-events: none;
          opacity: 0.028; mix-blend-mode: soft-light; background-size: 200px 200px; }
      `}</style>
    </>
  );
}
