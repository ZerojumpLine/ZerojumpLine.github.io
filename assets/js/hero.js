// Drives the homepage hero: writes scroll progress to --p and highlights the active chapter.
(function () {
  function init() {
    var hero = document.querySelector(".zl-hero");
    if (!hero) return;

    // Pull the hero up under the fixed navbar so the image starts at the very top.
    var header = document.getElementById("quarto-header");
    var content = document.getElementById("quarto-content");
    if (header && content) {
      var offset = hero.getBoundingClientRect().top + window.scrollY;
      hero.style.setProperty("--zl-hero-offset", offset + "px");
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var chapters = hero.querySelectorAll(".zl-hero__chapters li");
    var ticking = false;

    function update() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var range = rect.height - window.innerHeight;
      var p = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
      hero.style.setProperty("--p", p.toFixed(4));

      // chapters occupy p ∈ [0.3, 0.9]; the last one stays lit while the hero scrolls away
      var active = Math.floor(((p - 0.3) / 0.6) * chapters.length);
      chapters.forEach(function (li, i) {
        li.classList.toggle("is-active", i === Math.min(Math.max(active, 0), chapters.length - 1));
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
