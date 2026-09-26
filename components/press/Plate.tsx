/*
  Plate — a photograph tipped into the page, shown as it is (no riso
  treatment) so build photos and screenshots stay faithful. Cover-cropped to
  `ratio` around `focus`. Wrap it in something with `.pr-lift` to get the
  hatched shadow on hover.
*/
export default function Plate({
  src, alt, ratio, focus = '50% 50%', eager = false, className = '',
}: {
  src: string; alt: string; ratio: string; focus?: string; eager?: boolean; className?: string;
}) {
  return (
    <div className={`pr-plate ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: focus }} />
    </div>
  );
}
