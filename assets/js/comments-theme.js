// Keep the utterances comment box in step with the site's light/dark scheme.
// utterances accepts a `set-theme` message from the parent page.
(function () {
  var LIGHT = "boxy-light", DARK = "github-dark";

  function currentTheme() {
    return document.body.classList.contains("quarto-dark") ? DARK : LIGHT;
  }

  function apply() {
    var frame = document.querySelector("iframe.utterances-frame");
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ type: "set-theme", theme: currentTheme() }, "https://utteranc.es");
    }
  }

  function init() {
    // re-apply when the scheme is toggled
    new MutationObserver(apply).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // and once the iframe has been injected and loaded
    new MutationObserver(function () {
      var frame = document.querySelector("iframe.utterances-frame");
      if (frame && !frame.dataset.zlTheme) {
        frame.dataset.zlTheme = "1";
        frame.addEventListener("load", apply);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
