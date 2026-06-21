/* Respira Mejor — dataLayer stub.
 * GTM aún no instalado (no tenemos GTM_ID). Cuando se instale, este archivo
 * se actualiza para empujar eventos reales según módulo 13 del playbook.
 * Por ahora solo hace logging condicional para depurar manualmente.
 *
 * Eventos esquema fijo (cuando se conecte GTM):
 *   cta_click  → cta_type ∈ {whatsapp, calcom, phone, email}
 *   faq_open   → cta_type = accordion
 *   scroll_depth → cta_type = scroll, cta_label ∈ {25,50,75,100}
 */
(function () {
  window.dataLayer = window.dataLayer || [];

  function pageSlug() {
    var p = location.pathname;
    if (p === '/' || p === '') return 'home';
    return p.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  }

  // Reenvía a GA4 (gtag) si el tag está cargado; si no, solo deja el evento en dataLayer.
  // GA4 ahora se gestiona vía GTM (contenedor GTM-M7STX283).
  // Sin envío directo a gtag para evitar doble conteo; GTM escucha estos eventos del dataLayer.
  function ga(name, params) { /* no-op: gestionado por GTM */ }

  function pushCta(type, label) {
    var lbl = (label || '').substring(0, 60).trim();
    window.dataLayer.push({
      event: 'cta_click',
      cta_type: type,
      cta_label: lbl,
      cta_page: pageSlug()
    });
    ga('cta_click', { cta_type: type, cta_label: lbl, cta_page: pageSlug() });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var txt = (a.innerText || a.getAttribute('aria-label') || '').trim();

    if (/wa\.me|api\.whatsapp|chat\.whatsapp/.test(href)) {
      pushCta('whatsapp', txt);
    } else if (/cal\.com/.test(href)) {
      pushCta('calcom', txt);
    } else if (/^tel:/.test(href)) {
      pushCta('phone', txt);
    } else if (/^mailto:/.test(href)) {
      pushCta('email', txt);
    }
  }, { passive: true });

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d.tagName !== 'DETAILS' || !d.open) return;
    var summaryEl = d.querySelector('summary');
    var summaryText = summaryEl ? summaryEl.innerText.trim() : '';
    window.dataLayer.push({
      event: 'faq_open',
      cta_type: 'accordion',
      cta_label: summaryText.substring(0, 80),
      cta_page: pageSlug()
    });
    ga('faq_open', { cta_type: 'accordion', cta_label: summaryText.substring(0, 80), cta_page: pageSlug() });
  }, true);

  var marks = [25, 50, 75, 100];
  var fired = {};
  var ticking = false;
  function checkScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (max <= 0) { ticking = false; return; }
    var scrolled = (h.scrollTop / max) * 100;
    marks.forEach(function (m) {
      if (scrolled >= m && !fired[m]) {
        fired[m] = true;
        window.dataLayer.push({
          event: 'scroll_depth',
          cta_type: 'scroll',
          cta_label: String(m),
          cta_page: pageSlug()
        });
        ga('scroll_depth', { cta_type: 'scroll', cta_label: String(m), cta_page: pageSlug() });
      }
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(checkScroll); ticking = true; }
  }, { passive: true });
})();
