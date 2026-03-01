(function () {
  function initNav(root) {
    const btn = root.querySelector("#menuBtn");
    const menu = root.querySelector("#mobileMenu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const isHidden = menu.classList.toggle("hidden");
      btn.setAttribute("aria-expanded", String(!isHidden));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // If you ever end up with multiple navs, this still works safely.
    document.querySelectorAll("nav").forEach(initNav);
  });

  window.playRandomCasino = function() {
    const casinos = [
      '/go/spinmama/',
      '/go/spinwinera/',
      '/go/spingranny/',
      '/go/vincispin/',
      '/go/bitstarz/',
      '/go/bitkingz/',
      '/go/crocoslots/'
    ];
    const random = casinos[Math.floor(Math.random() * casinos.length)];
    window.location.href = random;
  };
})();
