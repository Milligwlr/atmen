// Respira Mejor — Modal global "Agendar cita": ventana centrada y clara,
// reusada por el Hero, las fichas de padecimientos y el CTA final.
(function () {
  const modal = document.getElementById('agendarModal');
  if (!modal) return;

  const supportsDialog = typeof modal.showModal === 'function';
  let lastFocus = null;

  function openModal(trigger) {
    lastFocus = trigger || document.activeElement;
    var agSource = (trigger && trigger.getAttribute && trigger.getAttribute('data-cta')) || 'desconocido';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'agenda_modal_open', source: agSource });
    if (supportsDialog) {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('ag-modal-open');
    const first = modal.querySelector('.ag-opt');
    if (first) first.focus();
  }

  function closeModal() {
    if (supportsDialog && modal.open) modal.close();
    else modal.removeAttribute('open');
    document.body.classList.remove('ag-modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Abrir desde cualquier disparador
  document.querySelectorAll('[data-agendar-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn);
    });
  });

  // Cerrar: botón, backdrop, ESC
  modal.querySelectorAll('[data-ag-close]').forEach((b) => b.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    // Click fuera del cuadro interior → cerrar
    if (e.target === modal) { closeModal(); return; }
    const inner = modal.querySelector('.ag-modal__inner');
    if (inner) {
      const r = inner.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal();
    }
  });

  modal.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(); });
  modal.addEventListener('close', () => document.body.classList.remove('ag-modal-open'));
})();
