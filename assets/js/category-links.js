// On an article page, clicking a category tag opens that section's own index
// filtered by the category (e.g. /news/2026-07-10-MICS/ → /news/#category=Seminar).
// Quarto's default links to the first listing that includes the page, which for
// news items is the About page ("Latest Update").
document.addEventListener(
  "click",
  function (event) {
    var tag = event.target.closest(".quarto-title-block .quarto-category");
    if (!tag) return;
    var section = window.location.pathname.split("/").filter(Boolean)[0];
    if (!section || section.indexOf(".") !== -1) return; // top-level page: keep Quarto's behaviour
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = "/" + section + "/#category=" + encodeURIComponent(tag.textContent.trim());
  },
  true // capture, so it runs before Quarto's own handler
);
