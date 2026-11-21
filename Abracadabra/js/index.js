(function () {
  var $ = function (i) { return document.getElementById(i); };
  var LID = "catalogo_principal", LN = "Catálogo principal";
  $("grid").innerHTML = PRODUCTOS.map(function (p, i) {
    return '<a class="card" href="producto.html?id=' + p.id + '" data-i="' + i + '"><div class="ph" style="background:' + p.fondo + ';color:' + p.tinta + '">' + p.siglas + '</div><div class="in"><span class="suave">' + p.categoria + '</span><h3>' + p.nombre + '</h3><p class="precio">' + fmt(p.precio) + '</p></div></a>';
  }).join("");
  Analytics.evento("view_item_list", { item_list_id: LID, item_list_name: LN,
    items: PRODUCTOS.map(function (p, i) { return Carrito.gaItem(p, 1, i, false); }) });
  $("grid").addEventListener("click", function (e) {
    var a = e.target.closest(".card"); if (!a) return;
    e.preventDefault();
    var i = +a.getAttribute("data-i"), p = PRODUCTOS[i];
    Analytics.eventoYNavegar("select_item", { item_list_id: LID, item_list_name: LN, items: [Carrito.gaItem(p, 1, i, false)] }, "producto.html?id=" + p.id);
  });
  var ban = $("banner");
  function promo() {
    return { promotion_id: "BIENVENIDA10", promotion_name: "Bienvenida 10% de descuento", creative_name: "banner_inicio_bienvenida",
      creative_slot: "inicio_superior", items: [Carrito.gaItem(PRODUCTOS[0], 1, 0, true)] };
  }
  ban.hidden = false;
  if (Carrito.cupon()) {
    ban.innerHTML = '<div><b>Cupón BIENVENIDA10 aplicado</b><br><span class="suave">Tu 10 % de descuento ya está en el carrito.</span></div><a class="btn" href="carrito.html">Ver carrito</a>';
  } else {
    ban.innerHTML = '<div><b>Bienvenida: 10 % de descuento</b><br><span class="suave">Cupón BIENVENIDA10 en tu primera compra.</span></div><button class="btn" type="button">Aplicar cupón</button>';
    Analytics.evento("view_promotion", promo());
    var enviado = false;
    ban.onclick = function () {
      if (enviado) return; enviado = true;
      Carrito.aplicarCupon("BIENVENIDA10");
      Analytics.eventoYNavegar("select_promotion", promo(), "carrito.html");
    };
  }
})();
