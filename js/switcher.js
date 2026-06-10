// Respira Mejor — FAQ acordeón (un panel a la vez) + ficha modal de padecimientos.

// FAQ: un solo panel abierto
(function () {
  const list = document.querySelector('[data-faq]');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));
  items.forEach((it) => it.addEventListener('toggle', () => {
    if (it.open) items.forEach((o) => { if (o !== it && o.open) o.open = false; });
  }));
})();

// Padecimientos: tarjeta → ficha modal (síntomas, diagnóstico, qué esperar) en la misma página
(function () {
  const modal = document.getElementById('dxModal');
  const cards = Array.from(document.querySelectorAll('.dx-card[data-dx]'));
  if (!cards.length) return;

  const fichas = {};
  document.querySelectorAll('.dx-ficha').forEach((f) => { fichas[f.dataset.dx] = f; });

  // Sin soporte de <dialog>: la tarjeta lleva a la guía de FAQ
  if (!modal || typeof modal.showModal !== 'function') {
    cards.forEach((c) => c.addEventListener('click', () => {
      location.href = 'preguntas-frecuentes/index.html#' + c.dataset.dx;
    }));
    return;
  }

  const head = document.getElementById('dxModalHead');
  const ic = document.getElementById('dxModalIc');
  const tag = document.getElementById('dxModalTag');
  const title = document.getElementById('dxModalTitle');
  const content = document.getElementById('dxModalContent');
  const moreLink = document.getElementById('dxMoreLink');
  let lastFocus = null;

  function open(slug) {
    const f = fichas[slug];
    if (!f) return;
    const iconEl = f.querySelector('.dx-ficha__icon');
    const lead = f.querySelector('.dx-modal__lead');
    const points = f.querySelector('.dx-points');
    ic.innerHTML = iconEl ? iconEl.innerHTML : '';
    tag.textContent = f.dataset.tag || '';
    title.textContent = f.dataset.name || '';
    const card = cards.find((c) => c.dataset.dx === slug);
    const cp = card ? getComputedStyle(card).getPropertyValue('--cp').trim() : '';
    if (cp) modal.style.setProperty('--cp', cp); else modal.style.removeProperty('--cp');
    content.innerHTML = (lead ? lead.outerHTML : '') + (points ? points.outerHTML : '');
    if (moreLink) moreLink.href = 'preguntas-frecuentes/index.html#' + slug;
    if (!modal.open) {
      lastFocus = document.activeElement;
      modal.showModal();
    }
    const closeBtn = modal.querySelector('[data-dx-close]');
    if (closeBtn) closeBtn.focus();
  }

  cards.forEach((c) => c.addEventListener('click', () => open(c.dataset.dx)));
  modal.querySelectorAll('[data-dx-close]').forEach((b) => b.addEventListener('click', () => modal.close()));

  // Cerrar al hacer clic en el backdrop (fuera del cuadro)
  modal.addEventListener('click', (e) => {
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
  });
  modal.addEventListener('close', () => { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
})();
