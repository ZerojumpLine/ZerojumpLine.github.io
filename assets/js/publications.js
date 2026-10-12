// Publications index:
//  1. category filter ordered All → highlights → years, newest first
//     (Quarto sorts categories alphabetically, which put 2017 at the top);
//  2. a year heading above the first paper of each year. The heading is drawn
//     by CSS from data-year, so the list.js-managed items are never touched,
//     and it is recomputed whenever filtering/sorting re-renders the list.
(function () {
  function orderCategories() {
    var box = document.querySelector("#quarto-margin-sidebar .quarto-listing-category");
    if (!box) return;
    var items = Array.prototype.slice.call(box.querySelectorAll(".category"));
    function rank(el) {
      var name = el.textContent.replace(/\(\d+\)/, "").trim().toLowerCase();
      if (name === "all") return [0, 0];
      if (name === "highlights") return [1, 0];
      if (/^\d{4}$/.test(name)) return [2, -parseInt(name, 10)];
      return [3, name];
    }
    items.sort(function (a, b) {
      var ra = rank(a), rb = rank(b);
      if (ra[0] !== rb[0]) return ra[0] - rb[0];
      return ra[1] < rb[1] ? -1 : ra[1] > rb[1] ? 1 : 0;
    });
    items.forEach(function (el) { box.appendChild(el); });
  }

  // Quick links (Publication / Preprint / Code / Website) under each paper,
  // read from the data-only listing rendered by _partials/pub-links.ejs.
  var linkData = null;
  function addLinks() {
    if (linkData === null) {
      var el = document.getElementById("zl-pub-links");
      try { linkData = el ? JSON.parse(el.textContent) : {}; } catch (e) { linkData = {}; }
    }
    document.querySelectorAll(".quarto-listing-default .quarto-post").forEach(function (post) {
      var body = post.querySelector(".body");
      var title = post.querySelector(".listing-title a");
      if (!body || !title || body.querySelector(".zl-pub-links")) return;
      // listing paths point at the .qmd source; compare by directory
      var dir = function (u) {
        return new URL(u, window.location.href).pathname.replace(/index\.(qmd|html|md|markdown)$/, "");
      };
      var path = dir(title.getAttribute("href"));
      var key = Object.keys(linkData).find(function (k) { return dir(k) === path; });
      var links = key && linkData[key];
      if (!links || !links.length) return;
      var box = document.createElement("div");
      box.className = "zl-pub-links";
      links.forEach(function (l) {
        if (!l.url) return;
        var a = document.createElement("a");
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noopener";
        if (l.icon) {
          var i = document.createElement("i");
          i.className = "bi bi-" + l.icon;
          a.appendChild(i);
        }
        a.appendChild(document.createTextNode(l.name || "Link"));
        box.appendChild(a);
      });
      body.appendChild(box);
    });
  }

  function markYears() {
    document.querySelectorAll(".quarto-post .listing-category").forEach(function (tag) {
      var name = tag.textContent.trim();
      if (/^\d{4}$/.test(name)) tag.classList.add("zl-year-tag");
      if (name.toLowerCase() === "highlights") tag.classList.add("zl-highlight-tag");
    });
    var last = null;
    document.querySelectorAll(".quarto-listing-default .quarto-post").forEach(function (post) {
      var date = post.querySelector(".listing-date");
      var m = date && date.textContent.match(/\d{4}/);
      var year = m ? m[0] : null;
      var start = year && year !== last;
      post.classList.toggle("zl-year-start", !!start);
      if (start) post.setAttribute("data-year", year);
      else post.removeAttribute("data-year");
      last = year || last;
    });
  }

  function init() {
    orderCategories();
    markYears();
    addLinks();
    var list = document.querySelector(".quarto-listing-default");
    if (list) new MutationObserver(function () { markYears(); addLinks(); }).observe(list, { childList: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
