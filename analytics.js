/* Scenic City Learning — anonymous visit tracking (GoatCounter). No cookies. */
window.goatcounter = window.goatcounter || {};
window.goatcounter.path = function () {
  return location.pathname + location.search + location.hash || "/";
};

(function () {
  const send = (opts) => {
    try {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        window.goatcounter.count(opts);
      }
    } catch (_) {
      /* blocked or not loaded yet */
    }
  };

  window.addEventListener("hashchange", () => {
    send({
      path: location.pathname + location.search + location.hash,
      title: document.title + " " + location.hash,
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href.startsWith("tel:")) send({ path: "click-call", title: "Call", event: true });
    else if (href.startsWith("sms:")) send({ path: "click-text", title: "Text", event: true });
    else if (href.startsWith("mailto:")) send({ path: "click-email", title: "Email", event: true });
  });

  const form = document.getElementById("intake");
  if (form) {
    form.addEventListener("submit", () => {
      send({ path: "click-book", title: "Book form", event: true });
    });
  }
})();
