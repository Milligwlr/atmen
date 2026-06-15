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

  const ic = document.getElementById('dxModalIc');
  const tag = document.getElementById('dxModalTag');
  const title = document.getElementById('dxModalTitle');
  const content = document.getElementById('dxModalContent');
  const moreLink = document.getElementById('dxMoreLink');
  const body = modal.querySelector('.dx-modal__body');
  let lastFocus = null;

  // Bloqueo de scroll de fondo mientras la ficha está abierta. Era la causa real
  // del "se traba / se siente roto" al hacer scroll en móvil: la página se
  // desplazaba detrás del diálogo fijo y el backdrop-filter repintaba en cada frame.
  let scrollLockY = 0;
  function lockScroll() {
    scrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = '-' + scrollLockY + 'px';
    document.body.classList.add('dx-modal-open');
  }
  function unlockScroll() {
    if (!document.body.classList.contains('dx-modal-open')) return;
    document.body.classList.remove('dx-modal-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollLockY);
  }

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
    if (body) body.scrollTop = 0; // cada ficha arranca desde arriba
    if (!modal.open) {
      lastFocus = document.activeElement;
      modal.showModal();
      lockScroll();
    }
    const closeBtn = modal.querySelector('[data-dx-close]');
    if (closeBtn) closeBtn.focus();
  }

  cards.forEach((c) => c.addEventListener('click', () => open(c.dataset.dx)));
  // El enlace "Preguntar" (WhatsApp) no debe abrir además la ficha.
  document.querySelectorAll('.dx-card__ask').forEach((a) => a.addEventListener('click', (e) => e.stopPropagation()));
  modal.querySelectorAll('[data-dx-close]').forEach((b) => b.addEventListener('click', () => modal.close()));

  // Cerrar al tocar el backdrop (el área del propio <dialog>, fuera del cuadro).
  // e.target === modal es más fiable en táctil que el cálculo por coordenadas.
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  // Escape (evento 'cancel') y cualquier cierre: restaurar scroll y foco.
  modal.addEventListener('cancel', (e) => { e.preventDefault(); modal.close(); });
  modal.addEventListener('close', () => {
    unlockScroll();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  });
})();
