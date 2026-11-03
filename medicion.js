/* Medición común de las páginas de pago (píxel Meta + Microsoft Clarity).
   Cada página pone <html data-variante="v1|v2|v3|v4"> y carga este archivo justo después del píxel. */
(function(){
  var V = document.documentElement.getAttribute('data-variante') || 'v1';
  var q = new URLSearchParams(location.search);
  var P197 = /[?&]p=197\b/.test(location.search);
  window.PAGO = { variante: V, p197: P197, precio: P197 ? 197 : 97,
    src: (q.get('src') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 30) };

  /* Un eventID por evento: Meta recibe cada evento por el navegador y por su servidor automático;
     con el mismo eventID los junta y no los cuenta dos veces. */
  function nid(){ return V + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9); }
  window.ev = function(nombre, datos, estandar){
    datos = datos || {}; datos.variante_pago = V; datos.pagina = 'pago8s';
    try { fbq(estandar ? 'track' : 'trackCustom', nombre, datos, { eventID: nid() }); } catch (e) {}
    try { if (window.clarity) clarity('event', nombre); } catch (e) {}
  };

  fbq('track', 'PageView', {}, { eventID: nid() });
  ev('InitiateCheckout', { value: PAGO.precio, currency: 'USD', content_name: 'Ruta Excedente 8S' }, true);
  ev('VioPago_' + V);

  /* Clarity: mapas de calor y grabaciones, etiquetados por variante */
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","z3rvf294da");
  clarity('set', 'landing', 'pago8s'); clarity('set', 'variante_pago', V);
  clarity('set', 'precio', String(PAGO.precio)); clarity('set', 'fuente', PAGO.src || q.get('utm_source') || 'directo');
  if (q.get('utm_content')) clarity('set', 'anuncio', q.get('utm_content'));

  /* Hasta dónde baja y cuánto tiempo se queda */
  var marcas = {};
  addEventListener('scroll', function(){
    var h = document.documentElement, pct = Math.round(100 * (h.scrollTop + innerHeight) / h.scrollHeight);
    [25, 50, 75, 100].forEach(function(m){ if (pct >= m && !marcas[m]) { marcas[m] = 1; try { clarity('event', 'scroll_' + m); } catch (e) {} } });
  }, { passive: true });
  [15, 45, 120].forEach(function(s){ setTimeout(function(){ if (!document.hidden) { try { clarity('event', 'tiempo_' + s + 's'); } catch (e) {} } }, s * 1000); });
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a,button'); if (!a) return;
    var t = (a.getAttribute('data-ev') || a.innerText || '').trim().slice(0, 40).replace(/[^\wáéíóúñ$]+/gi, '_');
    try { clarity('event', 'clic_' + t); } catch (x) {}
  }, true);
})();
