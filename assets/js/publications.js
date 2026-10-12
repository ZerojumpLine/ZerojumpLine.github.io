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
    var list = document.querySelector(".quarto-listing-default");
    if (list) new MutationObserver(markYears).observe(list, { childList: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
