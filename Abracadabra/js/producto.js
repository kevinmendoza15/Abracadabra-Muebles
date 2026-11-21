(function () {
  var el = document.getElementById("det");
  var id = new URLSearchParams(location.search).get("id");
  var p = PRODUCTOS.filter(function (x) { return x.id === id; })[0];
  if (!p) { el.innerHTML = '<p>Producto no encontrado.</p><a class="btn" href="index.html">Volver al catálogo</a>'; return; }
  document.title = p.nombre + " · Abracadabra";
  var cc = !!Carrito.cupon(), u = Carrito.gaItem(p, 1, 0, cc);
  el.innerHTML = '<div class="dos"><div class="ph grande" style="background:' + p.fondo + ';color:' + p.tinta + '">' + p.siglas + '</div><div><span class="suave">' + p.categoria + " · " + p.id + '</span><h1 class="t">' + p.nombre + '</h1><p class="precio g">' + fmt(u.price) + (cc ? ' <s class="suave">' + fmt(p.precio) + "</s>" : "") + '</p><p>' + p.descripcion + '</p><button class="btn" id="add" type="button">Agregar al carrito</button><p id="ok" class="aviso" aria-live="polite"></p><a href="index.html">← Volver al catálogo</a></div></div>';
  Analytics.evento("view_item", { value: u.price, items: [u] });
  document.getElementById("add").onclick = function () {
    var paq = Carrito.unidad(p, 1);
    Carrito.cambiar(p.id, 1);
    Analytics.evento("add_to_cart", paq);
    pintarBadge();
    document.getElementById("ok").innerHTML = 'Agregado al carrito. <a href="carrito.html">Ver carrito</a>';
  };
})();
