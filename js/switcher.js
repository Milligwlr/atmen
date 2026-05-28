// Atmen — Switcher: ARIA tabs upgrade en desktop, details accordion en mobile.
(function () {
  const MQ = window.matchMedia('(min-width: 900px)');

  function init(root) {
    const items = Array.from(root.querySelectorAll('.sw-item'));
    if (!items.length) return;

    function applyTabs(on) {
      root.classList.toggle('switcher--tabs', on);
      if (on) {
        items.forEach((it) => {
          const sum = it.querySelector('summary');
          sum.setAttribute('role', 'tab');
          sum.setAttribute('aria-selected', it.open ? 'true' : 'false');
        });
      } else {
        items.forEach((it) => {
          const sum = it.querySelector('summary');
          sum.removeAttribute('role');
          sum.removeAttribute('aria-selected');
        });
      }
    }

    items.forEach((it) => {
      it.addEventListener('toggle', () => {
        if (it.open) {
          items.forEach((o) => { if (o !== it && o.open) o.open = false; });
          const sum = it.querySelector('summary');
          if (sum.hasAttribute('role')) sum.setAttribute('aria-selected', 'true');
        }
      });
    });

    applyTabs(MQ.matches);
    MQ.addEventListener('change', (e) => applyTabs(e.matches));

    root.addEventListener('keydown', (e) => {
      if (!root.classList.contains('switcher--tabs')) return;
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      const summaries = items.map((it) => it.querySelector('summary'));
      const i = summaries.indexOf(document.activeElement);
      if (i < 0) return;
      let next = i;
      if (e.key === 'ArrowDown') next = (i + 1) % summaries.length;
      if (e.key === 'ArrowUp') next = (i - 1 + summaries.length) % summaries.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = summaries.length - 1;
      e.preventDefault();
      summaries[next].focus();
      summaries[next].click();
    });
  }

  document.querySelectorAll('[data-switcher]').forEach(init);
})();

// FAQ single-open
(function () {
  const list = document.querySelector('[data-faq]');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.faq-item'));
  items.forEach((it) => it.addEventListener('toggle', () => {
    if (it.open) items.forEach((o) => { if (o !== it && o.open) o.open = false; });
  }));
})();
