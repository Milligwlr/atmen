// Atmen — Agendar menu: dropdown (desktop) + bottom sheet (mobile)
(function () {
  const MQ_MOBILE = window.matchMedia('(max-width: 700px)');

  function init(root) {
    const btn = root.querySelector('.agendar__btn');
    const menu = root.querySelector('.agendar__menu');
    if (!btn || !menu) return;

    let open = false;
    let backdrop = null;

    function setOpen(next) {
      open = next;
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        menu.hidden = false;
        if (MQ_MOBILE.matches) {
          root.classList.add('agendar--sheet');
          backdrop = document.createElement('div');
          backdrop.className = 'agendar__backdrop';
          backdrop.addEventListener('click', close);
          document.body.appendChild(backdrop);
          document.body.style.overflow = 'hidden';
        } else {
          root.classList.add('agendar--popover');
        }
        const first = menu.querySelector('[role="menuitem"]');
        if (first) first.focus();
      } else {
        menu.hidden = true;
        root.classList.remove('agendar--sheet', 'agendar--popover');
        if (backdrop) { backdrop.remove(); backdrop = null; }
        document.body.style.overflow = '';
        btn.focus();
      }
    }
    function close() { setOpen(false); }

    btn.addEventListener('click', () => setOpen(!open));

    document.addEventListener('click', (e) => {
      if (!open) return;
      if (root.contains(e.target)) return;
      close();
    });

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const i = items.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown'
          ? (i < 0 ? 0 : (i + 1) % items.length)
          : (i <= 0 ? items.length - 1 : i - 1);
        items[next].focus();
      }
    });
  }

  document.querySelectorAll('[data-agendar]').forEach(init);
})();
