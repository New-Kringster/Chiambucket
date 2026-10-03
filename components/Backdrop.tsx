/*
  Backdrop — the site-wide background, replacing the old WebGL field.
  One fixed, static layer painted once by the browser: a soft pool of light
  at the top of the screen over the warm base, with a faint perfboard dot
  pattern that only shows inside that light. No canvas, no JavaScript, no
  animation, so an idle or scrolling page does no background work.
  Colours follow the route's data-theme through --sa-accent / --sa-base
  (the "BACKDROP" section at the end of public/mainstyle.css).
*/
export default function Backdrop() {
  return <div className="sa-backdrop" aria-hidden="true" />;
}
