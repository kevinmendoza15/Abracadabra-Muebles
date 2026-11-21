// Lógica del carrito (localStorage) y constructor de ítems GA4.
(function () {
  var K = "abc_carrito", CUP = "BIENVENIDA10", PCT = 0.1;
  function leer() { try { var s = JSON.parse(localStorage.getItem(K)); if (s && s.l) return s; } catch (e) {} return { l: [], c: null }; }
  function gua(s) { try { localStorage.setItem(K, JSON.stringify(s)); } catch (e) {} }
  function prod(id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }
  function desc(p) { return Math.round(p.precio * PCT); }
  window.Carrito = {
    CUPON: CUP,
    cupon: function () { return leer().c; },
    aplicarCupon: function (c) {
      if (String(c || "").trim().toUpperCase() !== CUP) return false;
      var s = leer(); s.c = CUP; gua(s); return true;
    },
    lineas: function () {
      return leer().l.map(function (x) { return { p: prod(x.id), q: x.q }; }).filter(function (x) { return x.p; });
    },
    cambiar: function (id, d) { // devuelve las unidades realmente cambiadas
      var s = leer(), l = s.l.filter(function (x) { return x.id === id; })[0];
      if (!l) { if (d <= 0) return 0; l = { id: id, q: 0 }; s.l.push(l); }
      var a = l.q; l.q = Math.max(0, a + d);
      s.l = s.l.filter(function (x) { return x.q > 0; });
      gua(s); return Math.abs(l.q - a);
    },
    vaciar: function () { gua({ l: [], c: null }); },
    descuento: desc,
    gaItem: function (p, q, i, cc) {
      var o = { item_id: p.id, item_name: p.nombre, item_brand: "Abracadabra", item_category: p.categoria,
        price: cc ? p.precio - desc(p) : p.precio, quantity: q, index: i };
      if (cc) { o.discount = desc(p); o.coupon = CUP; }
      return o;
    },
    valor: function (it) { return it.reduce(function (a, x) { return a + x.price * x.quantity; }, 0); },
    paquete: function () { // value, items y coupon del carrito completo
      var cc = !!leer().c, it = Carrito.lineas().map(function (l, i) { return Carrito.gaItem(l.p, l.q, i, cc); });
      var r = { value: Carrito.valor(it), items: it };
      if (cc) r.coupon = CUP;
      return r;
    },
    unidad: function (p, q) { // paquete de un solo producto (add/remove)
      var i = Carrito.gaItem(p, q, 0, !!leer().c);
      return { value: i.price * q, items: [i] };
    }
  };
})();
