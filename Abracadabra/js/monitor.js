// Monitor de eventos (ayuda didáctica). No envía nada a GA4.
(function () {
  var KO = "abc_mon_oculto", H = document.documentElement;
  if (!sessionStorage.getItem("abc_utm")) {
    var q = new URLSearchParams(location.search), s = q.get("utm_source"), m = q.get("utm_medium"), c = q.get("utm_campaign");
    sessionStorage.setItem("abc_utm", (s || m || c) ? (s || "-") + " / " + (m || "-") + " · " + (c || "-") : "directo (sin UTM)");
  }
  Analytics._log("page_view", { page_path: location.pathname + location.search });
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(n) { return Number(n).toLocaleString("es-CO"); }
  function resumen(n, p) {
    if (n === "page_view") return p.page_path;
    if (n === "user_properties") return "tipo_cliente = " + p.tipo_cliente;
    var o = [];
    ["transaction_id", "item_list_name", "promotion_id", "shipping_tier", "payment_type", "tipo_cliente"].forEach(function (k) { if (p[k]) o.push(k + ": " + p[k]); });
    if (p.value != null) o.push("value " + num(p.value));
    if (p.shipping != null) o.push("envío " + num(p.shipping));
    if (p.coupon) o.push("cupón " + p.coupon);
    if (p.items) o.push(p.items.length + " ítem(s): " + p.items.map(function (i) { return i.item_id + "×" + i.quantity; }).join(", "));
    return o.join(" · ");
  }
  var a = document.createElement("aside");
  a.id = "monitor";
  a.innerHTML = '<div class="mon-cab"><strong>Monitor de eventos</strong><button id="mon-btn" type="button"></button></div><div class="mon-cuerpo"><p id="mon-estado"></p><p class="mon-t">Origen de la visita</p><p id="mon-utm"></p><p class="mon-t">Últimos 12 eventos</p><ol id="mon-lista"></ol><button id="mon-sim" type="button">Simular nuevo visitante</button></div>';
  document.body.appendChild(a);
  var $ = function (i) { return document.getElementById(i); };
  var st = $("mon-estado");
  if (Analytics.activo) { st.className = "ok"; st.textContent = "Conectado a " + Analytics.id + (Analytics.debug ? " · modo depuración" : ""); }
  else { st.className = "no"; st.textContent = "Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js."; }
  $("mon-utm").textContent = sessionStorage.getItem("abc_utm");
  function lista() {
    var l = []; try { l = JSON.parse(sessionStorage.getItem("abc_log")) || []; } catch (e) {}
    $("mon-lista").innerHTML = l.map(function (e) {
      return "<li><span class='h'>" + new Date(e.t).toLocaleTimeString("es-CO") + "</span> <b>" + esc(e.n) + "</b><br><span class='r'>" + esc(resumen(e.n, e.p)) + "</span></li>";
    }).join("");
  }
  document.addEventListener("abc-log", lista); lista();
  function plegar(o) {
    H.classList.toggle("mon-off", o);
    $("mon-btn").textContent = o ? "Mostrar" : "Ocultar";
    try { localStorage.setItem(KO, o ? "1" : "0"); } catch (e) {}
  }
  var ini = false; try { ini = localStorage.getItem(KO) === "1"; } catch (e) {}
  plegar(ini);
  $("mon-btn").onclick = function () { plegar(!H.classList.contains("mon-off")); };
  $("mon-sim").onclick = function () {
    var h = location.hostname.split("."), dom = [null, h.join("."), "." + h.join(".")];
    for (var i = 1; i < h.length - 1; i++) dom.push("." + h.slice(i).join("."));
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") !== 0) return;
      dom.forEach(function (d) { document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : ""); });
    });
    try { localStorage.removeItem("abc_carrito"); } catch (e) {}
    sessionStorage.clear();
    location.href = "index.html";
  };
})();
