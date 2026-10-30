import { components } from "./timeline.js";
import { powerChips } from "./power-data.js";

const sources = {
  esp32: "https://www.espressif.com/en/products/socs/esp32-s3",
  humidity: "https://sensirion.com/products/catalog/SHT40",
  usb: "https://www.st.com/en/protection-devices/usblc6-2.html",
};
const escape = (text) =>
  String(text).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

// The chapter's markup as one string, so the standalone page and a
// server-rendered host produce identical HTML. The component notes are real
// text in the document for readers without WebGL and for search engines.
export function chapterMarkup() {
  const notes = components
    .map(
      (c) =>
        `<article><h3>${escape(c.title)}</h3><p>${escape(c.body)}</p>${
          sources[c.id]
            ? `<a href="${sources[c.id]}">Component documentation</a>`
            : ""
        }</article>`,
    )
    .join("");
  const chips = powerChips
    .map(
      (c) =>
        `<button type="button" data-ref="${c.id}" aria-pressed="false"><span>${escape(c.name)}</span><small>${c.id} · ${escape(c.role)}</small></button>`,
    )
    .join("");
  return `<a class="skip" href="#reading">Read without animation</a>
<section id="story" aria-label="Chapter V: PCB and enclosure">
  <div class="stage">
    <div class="blueprint" aria-hidden="true"></div>
    <div class="halo" aria-hidden="true"></div>
    <div id="scene" role="img" aria-label="WaterSlop PCB and enclosure"></div>
    <div class="texture" aria-hidden="true"></div>
    <div class="chapter">Chapter - V</div>
    <div class="hero-copy">
      <h1><span>PCB &amp;</span><span>Enclosure</span></h1>
      <nav class="contents" aria-label="In this chapter">
        <a href="#esp32"><span>Components Choice</span><i></i><span>(1)</span></a>
        <a href="#layers"><span>Placement</span><i></i><span>(2)</span></a>
        <a href="#enclosure"><span>Enclosure</span><i></i><span>(3)</span></a>
      </nav>
    </div>
    <aside class="component-copy">
      <p class="eyebrow" id="component-eyebrow"></p>
      <h2 id="component-title"></h2>
      <p id="component-body"></p>
      <figure id="comparison">
        <canvas tabindex="0" aria-label="Rotate the cost, performance and efficiency comparison. Drag or use arrow keys."></canvas>
        <figcaption>Illustrative comparison, not measured benchmarks</figcaption>
      </figure>
      <div id="power-inspector" hidden>
        <div class="power-grid" aria-label="Power management ICs">${chips}</div>
        <section class="chip-detail" hidden aria-live="polite">
          <p id="chip-description"></p>
          <a id="schematic-link" target="_blank" rel="noopener"><img id="chip-schematic" alt="" /></a>
        </section>
      </div>
    </aside>
    <div class="final-copy"><h2>Enclosure</h2></div>
    <div id="model-interaction" tabindex="0" role="img" aria-label="Rotate the enclosure. Drag or use arrow keys." hidden></div>
    <div class="load-status" role="status">Loading the board…</div>
    <button id="next-frame" type="button" aria-label="Next frame">
      <span>Next</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  </div>
</section>
<details id="reading">
  <summary>Component notes and sources</summary>
  <div id="reading-content">${notes}</div>
  <p>The comparison graph uses illustrative positions, not measured prices, speed or power consumption.</p>
</details>
<noscript><p class="noscript">Enable JavaScript to view the board and enclosure animation.</p></noscript>`;
}
