// Carga gtag.js solo con un ID válido (G-...) distinto del marcador.
(function () {
  var C = window.TIENDA_CONFIG || {}, id = String(C.GA_MEASUREMENT_ID || "");
  var activo = /^G-[A-Z0-9]{4,}$/i.test(id) && id !== "G-XXXXXXXXXX";
  var debug = C.DEBUG_MODE === true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  function log(n, p) { // bitácora para el monitor (últimos 12, en sessionStorage)
    var l = [];
    try { l = JSON.parse(sessionStorage.getItem("abc_log")) || []; } catch (e) {}
    l.unshift({ t: Date.now(), n: n, p: p || {} });
    try { sessionStorage.setItem("abc_log", JSON.stringify(l.slice(0, 12))); } catch (e) {}
    document.dispatchEvent(new Event("abc-log"));
  }
  if (activo) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (debug) gtag("config", id, { debug_mode: true }); else gtag("config", id);
  }
  // 1) Envía un evento (siempre con currency COP).
  function evento(n, p, extra) {
    p = p || {};
    if (!p.currency) p.currency = "COP";
    log(n, p);
    if (activo) gtag("event", n, extra ? Object.assign({}, p, extra) : p);
  }
  // 2) Envía un evento y luego navega (event_callback, 1000 ms, respaldo 1200 ms).
  function eventoYNavegar(n, p, url) {
    var hecho = false;
    function ir() { if (hecho) return; hecho = true; location.href = url; }
    if (!activo) { evento(n, p); ir(); return; }
    evento(n, p, { event_callback: ir, event_timeout: 1000 });
    setTimeout(ir, 1200);
  }
  window.Analytics = {
    activo: activo, id: id, debug: debug, evento: evento, eventoYNavegar: eventoYNavegar,
    propUsuario: function (o) { log("user_properties", o); if (activo) gtag("set", "user_properties", o); },
    _log: log
  };
})();
