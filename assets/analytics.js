(function () {
  function parseCasinoFromGoPath(pathname) {
    // Expected: /go/{casino}/ or /go/{casino}
    var parts = (pathname || "").split("/").filter(Boolean); // ["go","bitstarz"]
    if (parts.length >= 2 && parts[0] === "go") return parts[1];
    return "";
  }

  function trackGoClick(a) {
    if (typeof window.gtag !== "function") return;

    var href = a.getAttribute("href") || "";
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return;
    }

    // Only for /go/ internal routes
    var dest = url.pathname + (url.search || "");
    if (url.pathname.indexOf("/go/") !== 0) return;

    var casino = parseCasinoFromGoPath(url.pathname);

    var fired = false;
    var navigate = function () {
      if (fired) return;
      fired = true;
      window.location.href = href;
    };

    // Send event
    window.gtag("event", "go_click", {
      destination: dest,                 // e.g. /go/bitstarz/
      casino: casino || "(unknown)",     // e.g. bitstarz
      page_path: window.location.pathname,
      link_text: (a.textContent || "").trim().slice(0, 80),
      transport_type: "beacon",
      event_callback: navigate
    });

    // Fallback: if GA doesn't callback quickly, still navigate.
    setTimeout(navigate, 350);
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;

      var href = a.getAttribute("href");
      if (!href) return;

      // Allow open-in-new-tab etc.
      if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Only intercept internal /go/ links
      // (works for absolute and relative)
      try {
        var u = new URL(href, window.location.href);
        if (u.pathname.indexOf("/go/") !== 0) return;
      } catch (err) {
        return;
      }

      e.preventDefault();
      trackGoClick(a);
    },
    true
  );
})();
