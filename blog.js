(function () {
  var root = document.documentElement;

  /* ---------- theme ---------- */
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
  }
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) { root.removeAttribute("data-theme"); } else { root.setAttribute("data-theme", "dark"); }
    try { localStorage.setItem("theme", dark ? "light" : "dark"); } catch (e) {}
  });

  /* ---------- read time ---------- */
  var body = document.querySelector(".body");
  var words = body.innerText.trim().split(/\s+/).length;
  var mins = Math.max(1, Math.round(words / 230));
  document.getElementById("read-time").textContent = mins + " min read";

  /* ---------- table of contents ---------- */
  var heads = Array.prototype.slice.call(document.querySelectorAll(".body h2, #sources h2"));
  var list = document.getElementById("toc-list");
  var links = [];
  heads.forEach(function (h, i) {
    var section = h.closest("section");
    var id = (section && section.id) ? section.id : "s" + (i + 1);
    h.id = h.id || id;
    if (section && section.id) { h.removeAttribute("id"); }
    var target = (section && section.id) ? section : h;
    target.id = id;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    links.push({ a: a, el: target });
  });

  function setActive() {
    var y = window.scrollY + 140;
    var current = links[0];
    links.forEach(function (l) {
      if (l.el.getBoundingClientRect().top + window.scrollY <= y) { current = l; }
    });
    links.forEach(function (l) { l.a.classList.toggle("active", l === current); });
  }

  /* ---------- progress bar ---------- */
  var bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    setActive();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- share ---------- */
  var url = encodeURIComponent(location.href);
  var title = encodeURIComponent(document.title);
  var hrefs = {
    x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + title,
    facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url,
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + url,
    email: "mailto:?subject=" + title + "&body=" + url
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-net]"), function (a) {
    a.href = hrefs[a.getAttribute("data-net")];
  });
  var note = document.getElementById("copied");
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (b) {
    b.addEventListener("click", function () {
      var done = function () {
        note.textContent = "Link copied";
        setTimeout(function () { note.textContent = ""; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(done, done);
      } else { done(); }
    });
  });
})();
