(function () {
  var el = document.getElementById("gr"), p = null;
  try { p = JSON.parse(sessionStorage.getItem("abc_pedido")); } catch (e) {}
  if (!p) { el.innerHTML = '<h1 class="t">No hay un pedido reciente</h1><a class="btn" href="index.html">Ir al catálogo</a>'; return; }
  if (!p.enviado) {
    var d = { transaction_id: p.transaction_id, affiliation: "Abracadabra Online", value: p.value, shipping: p.shipping, tipo_cliente: p.tipo_cliente, items: p.items };
    if (p.coupon) d.coupon = p.coupon;
    Analytics.evento("purchase", d);
    p.enviado = true; // evita repetir purchase al recargar
    sessionStorage.setItem("abc_pedido", JSON.stringify(p));
    Carrito.vaciar(); pintarBadge();
  }
  el.innerHTML = '<h1 class="t">¡Gracias por tu compra simulada!</h1><p>Pedido <b>' + p.transaction_id + '</b> (' + p.tipo_cliente + '). Productos: ' + fmt(p.value) + ' · Envío: ' + fmt(p.shipping) + ' · Total: ' + fmt(p.value + p.shipping) + '.</p><p class="suave">No se cobró nada: es un ejercicio académico.</p><a class="btn" href="index.html">Seguir explorando</a>';
})();
