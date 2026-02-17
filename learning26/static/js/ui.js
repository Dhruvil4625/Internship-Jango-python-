document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector(".navbar");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 6) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var current = window.location.pathname.replace(/\/+$/, "");
  var links = document.querySelectorAll(".nav-links a[href]");
  links.forEach(function (a) {
    var href = a.getAttribute("href") || "";
    var path = href.replace(window.location.origin, "").replace(/\/+$/, "");
    if (path && path === current) a.classList.add("active");
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".hero, .card").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
});
