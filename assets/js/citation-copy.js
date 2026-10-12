// Click a BibTeX block (.quarto-appendix-bibtex) to copy its citation.
// The label shown in the corner is the --copy-label custom property (article.css).
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".quarto-appendix-bibtex").forEach(function (block) {
    block.addEventListener("click", function () {
      var text = block.getAttribute("data-clipboard-text");
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        block.style.setProperty("--copy-label", '"Copied"');
        setTimeout(function () { block.style.removeProperty("--copy-label"); }, 1200);
      });
    });
  });
});
