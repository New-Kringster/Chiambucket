/*
  GlassDefs — the SVG filters behind the "light bending" on glass surfaces.
  The displacement map (a 128px PNG, inlined) is neutral grey-blue in the middle
  and pushes sampling inward along each edge, so whatever sits behind a glass
  card or pill is bent at its rim like a lens. Stretched to each element by
  preserveAspectRatio="none". Only Chromium supports url() filters inside
  backdrop-filter; the inline head script in app/layout.tsx adds
  html.lg-refract there, and every other browser keeps plain frosted blur.
  Mounted once in app/layout.tsx.
*/
const MAP = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAABPElEQVR42u3dQY6CQBRF0adx4a4aigKkBx1MrcA/qHNDiON38p3y6P29JGvS7ndLtmRL+v3s93Mk5/3+DM+VibqGH+MI57DPd7Hvhv+TtmHnNVmSV5aosFdWI9QCNCO4ABcgANMCbEYAMDVANwIAAKoD2I0AAIDqAA4j1AKcRnABLkB1AB8jAAAgANMCXEao7GkCAAAEAIAAABAAAAIAQAAACAAAAQAgAAAEAIAAABAAAAIAQAAACAAAAQAgAAAEAIAAABAAAAIAQAAACAAAAQAgAAAEAIAAABAAAAIAQAAACAAAAQAAQAAACAAAAQAgAAAEAIAAANBP8jlbFwBA/oJmBvBNeQAABGBegNMItQCHEVyAC1AdwG4EAABUB9CNAACA6gA2IwCYGqAZAcDUAKsRXIALUB3AYoTK/gC73F/oc8M1GQAAAABJRU5ErkJggg==';

function Refract({ id, scale }: { id: string; scale: number }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feImage href={MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

/* Same lens, but red, green and blue bend by slightly different amounts, so
   edges pick up a faint prism fringe. Used on small pieces only (pills,
   buttons), since it filters the backdrop three times. */
function Disperse({ id, scale }: { id: string; scale: number }) {
  const channel = (k: number, row: string, name: string) => (
    <>
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * k} xChannelSelector="R" yChannelSelector="G" result={`${name}d`} />
      <feColorMatrix in={`${name}d`} type="matrix" values={row} result={name} />
    </>
  );
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feImage href={MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
      {channel(1.08, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', 'r')}
      {channel(1, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', 'g')}
      {channel(0.92, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', 'b')}
      <feBlend in="r" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b" mode="screen" />
    </filter>
  );
}

export default function GlassDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      {/* cards and panels */}
      <Refract id="lg-refract" scale={60} />
      {/* pills and buttons: a stronger bend with a prism fringe */}
      <Disperse id="lg-refract-pill" scale={38} />
    </svg>
  );
}
