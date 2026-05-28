// Atmen — Testimonials wall: pause on hover, IntersectionObserver pause off-viewport, click to expand
(function () {
  const root = document.querySelector('[data-wall]');
  if (!root) return;
  const rows = Array.from(root.querySelectorAll('.marquee-row'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      rows.forEach((r) => {
        r.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { rootMargin: '100px' });
  io.observe(root);

  root.addEventListener('click', (e) => {
    const card = e.target.closest('.tcard');
    if (!card) return;
    card.classList.toggle('tcard--expanded');
  });
})();
