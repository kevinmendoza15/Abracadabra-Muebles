(function () {
  if (!Carrito.lineas().length) { location.replace("carrito.html"); return; }
  var $ = function (i) { return document.getElementById(i); };
  var PAISES = ["Colombia", "México", "Estados Unidos", "España", "Chile", "Panamá", "Perú"];
  var paq = Carrito.paquete(), sub = paq.value, fijo = null;
  $("pais").innerHTML = PAISES.map(function (p) { return "<option>" + p + "</option>"; }).join("");
  function sel() {
    var nac = $("pais").value === "Colombia", exp = document.querySelector("input[name=srv]:checked").value === "x";
    var env = nac ? (exp ? 25000 : (sub >= 150000 ? 0 : 12000)) : (exp ? 160000 : 95000);
    return { nac: nac, env: env, tier: (nac ? "Nacional" : "Internacional") + " - " + (exp ? "Express" : "Estándar") };
  }
  function pintar() {
    var s = fijo || sel();
    $("tarifa").textContent = "Envío: " + (s.env === 0 ? "Gratis" : fmt(s.env)) + " (" + s.tier + ")";
    $("res").innerHTML = "<h2>Resumen</h2>" + paq.items.map(function (i) { return "<p><span>" + i.item_name + " ×" + i.quantity + "</span><span>" + fmt(i.price * i.quantity) + "</span></p>"; }).join("") +
      "<p><span>Productos</span><span>" + fmt(sub) + "</span></p><p><span>Envío</span><span>" + (s.env === 0 ? "Gratis" : fmt(s.env)) + "</span></p><p class='g'><span>Total</span><span>" + fmt(sub + s.env) + "</span></p>";
  }
  document.addEventListener("change", pintar); pintar();
  Analytics.evento("begin_checkout", paq);
  $("b1").onclick = function () {
    if (!$("nombre").value.trim()) { $("err").textContent = "Escribe un nombre ficticio para continuar."; return; }
    fijo = sel();
    Analytics.propUsuario({ tipo_cliente: fijo.nac ? "Nacional" : "Internacional" });
    Analytics.evento("add_shipping_info", Object.assign({}, paq, { shipping_tier: fijo.tier }));
    $("p1").hidden = true; $("p2").hidden = false; pintar();
  };
  $("b2").onclick = function () {
    var pago = document.querySelector("input[name=pago]:checked").value;
    var ped = { transaction_id: "T-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      value: paq.value, shipping: fijo.env, tipo_cliente: fijo.nac ? "Nacional" : "Internacional", items: paq.items, enviado: false };
    if (paq.coupon) ped.coupon = paq.coupon;
    sessionStorage.setItem("abc_pedido", JSON.stringify(ped));
    $("b2").disabled = true;
    Analytics.eventoYNavegar("add_payment_info", Object.assign({}, paq, { payment_type: pago }), "gracias.html");
  };
})();
