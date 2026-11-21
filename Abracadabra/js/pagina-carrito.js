(function () {
  var el = document.getElementById("carro"), msg = "", vista = false;
  function prod(id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }
  function render() {
    var L = Carrito.lineas(), cc = !!Carrito.cupon();
    pintarBadge();
    if (!L.length) { el.innerHTML = '<p>Tu carrito está vacío.</p><a class="btn" href="index.html">Ver catálogo</a>'; return; }
    var sub = 0, tot = 0;
    var filas = L.map(function (l) {
      var u = Carrito.gaItem(l.p, l.q, 0, cc); sub += l.p.precio * l.q; tot += u.price * l.q;
      return '<div class="fila"><div class="mini" style="background:' + l.p.fondo + ';color:' + l.p.tinta + '">' + l.p.siglas + '</div><div class="fi"><b>' + l.p.nombre + '</b><br><span class="suave">' + fmt(u.price) + ' c/u</span></div><div class="cant"><button type="button" data-a="-" data-id="' + l.p.id + '" aria-label="Quitar una unidad">−</button><span>' + l.q + '</span><button type="button" data-a="+" data-id="' + l.p.id + '" aria-label="Agregar una unidad">+</button></div><div class="fim">' + fmt(u.price * l.q) + '</div><button type="button" class="x" data-a="x" data-id="' + l.p.id + '">Quitar</button></div>';
    }).join("");
    var cup = cc ? '<p class="ok-t">Cupón BIENVENIDA10 aplicado (10 %).</p>'
      : '<div class="cupon"><input id="cup" placeholder="Código de cupón" aria-label="Código de cupón"><button type="button" class="btn sec" id="aplicar">Aplicar</button></div><p class="err">' + msg + '</p>';
    el.innerHTML = filas + cup + '<div class="tot"><p><span>Subtotal</span><span>' + fmt(sub) + '</span></p>' + (cc ? '<p><span>Descuento</span><span>−' + fmt(sub - tot) + '</span></p>' : "") + '<p class="g"><span>Total productos</span><span>' + fmt(tot) + '</span></p><p class="suave">El envío se calcula en el checkout.</p><a class="btn" href="checkout.html">Ir al checkout</a></div>';
    if (!vista) { vista = true; Analytics.evento("view_cart", Carrito.paquete()); }
  }
  el.addEventListener("click", function (e) {
    var t = e.target;
    if (t.id === "aplicar") {
      msg = Carrito.aplicarCupon(document.getElementById("cup").value) ? "" : "Cupón no válido. Prueba con BIENVENIDA10.";
      render(); return;
    }
    var a = t.getAttribute("data-a"); if (!a) return;
    var id = t.getAttribute("data-id"), p = prod(id);
    var l = Carrito.lineas().filter(function (x) { return x.p.id === id; })[0];
    if (a === "+") { var pa = Carrito.unidad(p, 1); Carrito.cambiar(id, 1); Analytics.evento("add_to_cart", pa); }
    else { var n = a === "x" ? l.q : 1, pr = Carrito.unidad(p, n); Carrito.cambiar(id, -n); Analytics.evento("remove_from_cart", pr); }
    render();
  });
  render();
})();
