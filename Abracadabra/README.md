# Abracadabra · Laboratorio GA4

Tienda **ficticia** de muebles (sofás, comedores, sala y diseño a medida) para el laboratorio de Google Analytics 4 del Diplomado en E-commerce y Negocios Internacionales Digitales. Solo HTML, CSS y JavaScript puros: sin servidor, sin base de datos y sin pagos reales.

## 1. Configura tu ID de medición
Abre `js/config.js` (es el único archivo que debes editar) y reemplaza `G-XXXXXXXXXX` por tu ID de GA4 (Administrar > Flujos de datos > tu flujo web).
- `DEBUG_MODE: true` envía `debug_mode` y los eventos aparecen en **DebugView**.
- `DEBUG_MODE: false` es el modo normal.
- Con el marcador `G-XXXXXXXXXX` no se carga gtag.js y el monitor muestra un aviso rojo.

## 2. Estructura
- `index.html` catálogo y banner del cupón · `producto.html?id=ABC-001` detalle · `carrito.html` · `checkout.html` (envío y pago simulado) · `gracias.html`
- `css/estilos.css` estilos.
- `js/config.js`, `js/analytics.js` (gtag y las funciones `Analytics.evento` y `Analytics.eventoYNavegar`), `js/productos.js`, `js/carrito.js`
- `js/comun.js` (encabezado, pie, formato de moneda) y `js/monitor.js` (monitor de eventos).
- Un script por página: `index.js`, `producto.js`, `pagina-carrito.js`, `checkout.js`, `gracias.js`.

## 3. Datos de prueba
- Cupón: `BIENVENIDA10` (10 %), desde el banner del inicio o en el carrito.
- Envío: Nacional Estándar $12.000 (gratis desde $150.000 en productos), Nacional Express $25.000, Internacional Estándar $95.000, Internacional Express $160.000. Países: Colombia, México, Estados Unidos, España, Chile, Panamá y Perú.
- Pago: Tarjeta de crédito, PSE, Nequi o PayPal (todo simulado). Usa un nombre inventado; la tienda no pide ni guarda correo, teléfono, documento ni datos de tarjeta.

## 4. Eventos
`view_item_list`, `view_promotion`, `select_promotion`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`. Además, la propiedad de usuario `tipo_cliente` (Nacional/Internacional) al confirmar el envío. Todos llevan `currency: "COP"`.

## 5. Monitor de eventos
Panel a la derecha (abajo en pantallas de menos de 820 px) con el estado de conexión, el origen de la visita (UTM), los últimos 12 eventos y el botón **Simular nuevo visitante** (borra cookies `_ga*`, carrito y sessionStorage). Prueba UTM así: `index.html?utm_source=instagram&utm_medium=social&utm_campaign=lanzamiento`.

## 6. Publicar en GitHub y Vercel
1. En github.com: **New repository** (por ejemplo `abracadabra-ga4`), público.
2. **Add file > Upload files** y arrastra el **contenido** de la carpeta `Abracadabra` (que `index.html` quede en la raíz del repositorio). **Commit changes**.
3. En vercel.com: **Add New > Project**, importa el repositorio.
4. **Framework Preset: Other**; deja vacíos Build Command y Output Directory. **Deploy**.
5. Para cambiar el ID más adelante: edita `js/config.js` en GitHub y Vercel republica solo.
