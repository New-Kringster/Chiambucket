/* ─────────────────────────────────────────────────────────────
   projects.js, Homepage project gallery: filter, search & modal
   Cards live in index.html as .hp-pf-card with data attributes:
     data-type="personal|school"   data-highlight="1" (optional)
     data-search="lowercase keywords for search"
   Each card holds a <template class="hp-pf-detail"> with the modal
   body. To add a project, copy a card block in index.html, no JS
   changes needed.
   ───────────────────────────────────────────────────────────── */
(function () {
  let activeFilter = "all";

  function cards() { return Array.prototype.slice.call(document.querySelectorAll(".hp-pf-card")); }
  function grid() { return document.getElementById("hp-pf-grid"); }

  /* opts: { fade } briefly dims the grid before re-laying out,
            { stagger } pops shown cards back in with a staggered entrance */
  function applyFilter(opts) {
    opts = opts || {};
    const input = document.getElementById("hp-pf-search");
    const q = (input ? input.value : "").toLowerCase().trim();

    const decided = cards().map((card) => {
      const type = card.dataset.type || "";
      const isHighlight = card.dataset.highlight === "1";
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "highlight" ? isHighlight : type === activeFilter);
      const matchSearch = !q || (card.dataset.search || "").indexOf(q) !== -1;
      return { card, show: matchFilter && matchSearch };
    });

    const commit = () => {
      let i = 0, shown = 0;
      decided.forEach(({ card, show }) => {
        card.style.display = show ? "" : "none";
        card.classList.remove("just-shown");
        if (show) {
          shown++;
          if (opts.stagger) {
            card.style.animationDelay = (i * 0.045) + "s";
            void card.offsetWidth;            // restart the entrance animation
            card.classList.add("just-shown");
          }
          i++;
        }
      });
      const empty = document.getElementById("hp-pf-empty");
      if (empty) empty.hidden = shown > 0;
    };

    const g = grid();
    if (opts.fade && g) {
      g.classList.add("is-filtering");
      setTimeout(() => { commit(); g.classList.remove("is-filtering"); }, 180);
    } else {
      commit();
    }
  }

  window.setProjectFilter = function (btn) {
    if (btn.classList.contains("is-active")) return;
    document.querySelectorAll(".hp-pf-filter").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    applyFilter({ fade: true, stagger: true });
  };

  window.filterProjects = function () { applyFilter({}); };

  /* ── Navigate to a card's full article (footer button) ── */
  window.openArticle = function (btn) {
    const card = typeof btn === "string" ? document.getElementById(btn) : btn.closest(".hp-pf-card");
    const url = card && card.getAttribute("data-article");
    if (url) window.location = url;
  };

  /* ── Modal ── */
  function modal() { return document.getElementById("hp-modal"); }

  window.openProject = function (cardEl) {
    const card = typeof cardEl === "string" ? document.getElementById(cardEl) : cardEl.closest(".hp-pf-card");
    if (!card) return;
    const tpl = card.querySelector(".hp-pf-detail");
    const target = document.getElementById("hp-modal-content");
    if (!tpl || !target) return;
    target.innerHTML = tpl.innerHTML;
    const m = modal();
    m.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => m.classList.add("is-open"));
    const closeBtn = m.querySelector(".hp-modal-close");
    if (closeBtn) closeBtn.focus();
  };

  window.closeProject = function () {
    const m = modal();
    if (!m) return;
    m.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      m.hidden = true;
      const target = document.getElementById("hp-modal-content");
      if (target) target.innerHTML = ""; // unload iframes
    }, 320);
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal() && !modal().hidden) window.closeProject();
  });

  /* Mark highlight cards for the gold treatment + init */
  document.addEventListener("DOMContentLoaded", () => {
    cards().forEach((c) => { if (c.dataset.highlight === "1") c.classList.add("is-highlight"); });
    applyFilter();
  });
})();
