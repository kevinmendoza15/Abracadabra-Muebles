window.fmt = function (n) { return "$" + Number(n).toLocaleString("es-CO") + " COP"; };
window.pintarBadge = function () {
  var n = Carrito.lineas().reduce(function (a, l) { return a + l.q; }, 0), b = document.getElementById("badge");
  if (b) b.textContent = n;
};
document.getElementById("cab").innerHTML = '<div><a class="logo" href="index.html">Abracadabra</a><nav><a href="index.html">Catálogo</a><a href="carrito.html">Carrito (<span id="badge">0</span>)</a></nav></div>';
document.getElementById("pie").innerHTML = "<p>Sitio académico de simulación: no procesa pagos reales ni guarda datos personales. Usa Google Analytics 4 con fines didácticos.</p>";
pintarBadge();
